/**
 * QA Script - Anti-Regression Gate
 *
 * Enforces:
 * 1. Strict Normalization (idempotency check)
 * 2. No forbidden files (.bak)
 * 3. Clean routing (no legacy or _en IDs)
 * 4. Strict Wrapper integrity
 * 5. Successful Build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHAPTERS_DIR = path.join(__dirname, '..', 'sites', 'tech', 'chapters');
const ROOT_WRAPPER_EXACT = '<div class="space-y-14 animate-in fade-in duration-700">';

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting QA Gate...');

function runStep(name, fn) {
    try {
        process.stdout.write(`⏳ ${name}... `);
        fn();
        console.log('✅ OK');
    } catch (e) {
        console.log('❌ FAILED');
        console.error(e.message || e);
        process.exit(1);
    }
}

/**
 * grepMustNotMatch(cmd, humanError)
 *
 * Contract:
 * - grep exit 1  => no match => SUCCESS
 * - grep exit 0  => match found => FAIL (prints evidence)
 * - other codes  => technical failure
 *
 * IMPORTANT: cmd MUST produce line-based output (-n recommended) for audit evidence.
 */
function grepMustNotMatch(cmd, humanError) {
    try {
        // If grep finds matches: exit 0 => execSync returns output
        // Hardening: maxBuffer increased to 10MB to avoid "stdout maxBuffer length exceeded" on large diffs
        const output = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

        // Evidence for auditors (file:line:content)
        const trimmed = (output || '').trim();
        if (trimmed.length > 0) console.error('\n' + trimmed);

        // Logical failure: matches exist
        throw new Error(humanError);
    } catch (e) {
        // grep exit 1 => no match => SUCCESS
        if (typeof e.status === 'number' && e.status === 1) return;

        // If we threw intentionally above
        if (String(e.message || '').includes(humanError)) throw e;

        // Otherwise: technical failure (grep error)
        throw new Error(`Grep check failed (technical error): ${e.message || e}`);
    }
}

// 1. Run Normalization
runStep('Running Normalize Strict', () => {
    execSync('npm run normalize:strict', { stdio: 'inherit' });
});

// 2. Check for .bak files
runStep('Checking for .bak files', () => {
    // Hardening: LC_ALL=C for determinism, maxBuffer for safety, encoding for symmetry
    const files = execSync(`LC_ALL=C find "${CHAPTERS_DIR}" -name "*.bak" -type f`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }).trim();
    if (files.length > 0) {
        throw new Error(`Found disallowed .bak files:\n${files}`);
    }
});

// 3. Grep Check: _en IDs (audit-grade: absolute path + strict regex + evidence)
runStep('Checking prohibited _en IDs', () => {
    // LC_ALL=C for deterministic behavior across environments
    grepMustNotMatch(
        `LC_ALL=C grep -R -nE "loadPage\\(\\s*['\\"][^'\\"]*_en['\\"]\\s*\\)" "${CHAPTERS_DIR}" --include="*.html"`,
        'Found prohibited loadPage calls with _en suffix! See evidence above.'
    );
});

// 4. Grep Check: legacy tech_solana_n IDs (audit-grade: absolute path + strict regex + evidence)
runStep('Checking prohibited legacy IDs', () => {
    grepMustNotMatch(
        `LC_ALL=C grep -R -nE "loadPage\\(\\s*['\\"]tech_solana_n[123]['\\"]\\s*\\)" "${CHAPTERS_DIR}" --include="*.html"`,
        'Found prohibited legacy tech_solana_n IDs! See evidence above.'
    );
});

// 5. Check Wrappers (STRICT)
runStep('Verifying Root Wrappers', () => {
    const files = fs.readdirSync(CHAPTERS_DIR).filter(f => f.endsWith('.html'));
    const invalid = [];
    const EXPECTED_END = '</div>';

    files.forEach(f => {
        const content = fs.readFileSync(path.join(CHAPTERS_DIR, f), 'utf8').trim();

        if (!content.startsWith(ROOT_WRAPPER_EXACT)) {
            invalid.push({ file: f, reason: 'Incorrect Start Wrapper' });
        } else if (!content.endsWith(EXPECTED_END)) {
            invalid.push({ file: f, reason: 'Incorrect End Tag (trailing content?)' });
        } else {
            const count = (content.match(new RegExp(ROOT_WRAPPER_EXACT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            if (count > 1) invalid.push({ file: f, reason: 'Double Wrapper Detected' });
        }
    });

    if (invalid.length > 0) {
        console.error(`❌ strict wrapper validation failed for ${invalid.length} files:`);
        invalid.forEach(err => console.error(`   - ${err.file}: ${err.reason}`));
        throw new Error('Strict Root Wrapper Check Failed.');
    }
});

// 6. Build
runStep('Running Build', () => {
    execSync('npm run build', { stdio: 'inherit' });
});

// 7. Editorial Check: No Placeholders (...) (audit-grade: prints matches)
runStep('Checking for Placeholders (...)', () => {
    grepMustNotMatch(
        `LC_ALL=C grep -R -n "\\.\\.\\." "${CHAPTERS_DIR}" --include="*.html"`,
        'Placeholders (...) found in chapters! See evidence above.'
    );
});

// 8. QA Check: Link Integrity (REGEX ALIGNED: spaces allowed, quotes mandatory)
runStep('Scanning for Unknown Page IDs', () => {
  const scriptContent = fs.readFileSync(path.join(__dirname, '../sites/tech/script_tech.js'), 'utf8');

    const canonicalIds = new Set();
    const aliasIds = new Set();

    // Extract keys from pagesByLang.fr using brace counting
    const frStartKeyword = 'fr: {';
    const startIndex = scriptContent.indexOf(frStartKeyword);

    if (startIndex !== -1) {
        let openBraces = 0;
        let blockContent = '';
        const braceStartInfo = startIndex + frStartKeyword.length - 1; // index of '{'

        for (let i = braceStartInfo; i < scriptContent.length; i++) {
            const char = scriptContent[i];
            if (char === '{') openBraces++;
            if (char === '}') openBraces--;
            blockContent += char;
            if (openBraces === 0) break;
        }

        const regex = /([a-zA-Z0-9_]+)\s*:\s*["']/g;
        let m;
        while ((m = regex.exec(blockContent)) !== null) {
            if (m[1] !== 'fr') canonicalIds.add(m[1]);
        }
    }

    // Extract aliases
    const aliasBlock = scriptContent.match(/const LOADPAGE_ALIAS = ({[\s\S]*?});/);
    if (aliasBlock) {
        const regex = /['"]([^'"]+)['"]\s*:/g;
        let m;
        while ((m = regex.exec(aliasBlock[1])) !== null) aliasIds.add(m[1]);
    }

    // Scan chapters
    const files = fs.readdirSync(CHAPTERS_DIR).filter(f => f.endsWith('.html'));
    const dangling = [];

    files.forEach(f => {
        const content = fs.readFileSync(path.join(CHAPTERS_DIR, f), 'utf8');

        // ✅ STRICT + ROBUST: spaces allowed, quotes mandatory (aligned with steps 3/4)
        const matches = [...content.matchAll(/loadPage\(\s*['"]([^'"]+)['"]\s*\)/g)];

        matches.forEach(m => {
            const id = m[1];
            if (!canonicalIds.has(id) && !aliasIds.has(id)) dangling.push({ file: f, id });
        });
    });

    if (dangling.length > 0) {
        console.error('❌ Found dangling links (pointing to unknown IDs):');
        dangling.forEach(d => console.error(`   - In ${d.file}: loadPage('${d.id}')`));
        throw new Error('Dangling links detected. Fix IDs or add to aliases.');
    }
});

// Helper: Diff strict check
function diffMustBeEmpty(cmd, humanError) {
    try {
        // diff exit 0 => identical => SUCCESS
        execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
        return;
    } catch (e) {
        // diff exit 1 => files differ => FAIL with evidence (stdout is the diff)
        if (typeof e.status === 'number' && e.status === 1) {
            const out = (e.stdout ? e.stdout.toString('utf8') : '').trim();
            if (out.length > 0) console.error('\n' + out);
            throw new Error(humanError);
        }
        // Any other exit code => technical failure
        throw new Error(`Diff check failed (technical error): ${e.message || e}`);
    }
}

// 9. Artifact Check: nav_map.md (Strict Diff)
runStep('Verifying Documentation Map (Auto-Gen Strict Diff)', () => {
    const packageRoot = path.join(__dirname, '..');

    const target = path.join(packageRoot, 'docs', 'nav_map.md');
    // Ensure docs dir exists or generator might fail if not recursive (though generator handles it)
    if (!fs.existsSync(target)) {
        // Just warning here? No, strict lock means file MUST exist and match.
        // We will try running generator to temp first.
    }

    // Generate into tmp file (CWD-independent)
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rbk-navmap-'));
    const tmpOut = path.join(tmpDir, 'nav_map.md');

    const generator = path.join(packageRoot, 'scripts', 'generate_nav_map.mjs');
    if (!fs.existsSync(generator)) {
        throw new Error(`nav_map generator missing: ${generator}`);
    }

    // Run generator using node (assuming mjs support or node version > 14)
    // Hardening: LC_ALL=C for deterministic node execution (if locale sensitive)
    execSync(`LC_ALL=C node "${generator}" --out "${tmpOut}"`, { stdio: 'inherit' });

    // Strict diff (deterministic locale)
    // If target doesn't exist, diff will definitely fail (exit 2 or similar usually, or "No such file")
    // Let's rely on diff message or helper
    if (!fs.existsSync(target)) {
        throw new Error('docs/nav_map.md missing! Run: npm run nav:gen (rbk-web) and commit.');
    }

    diffMustBeEmpty(
        `LC_ALL=C diff -u "${target}" "${tmpOut}"`,
        'docs/nav_map.md is OUT OF DATE. Run: npm run nav:gen (rbk-web) and commit the result. See diff above.'
    );
});

console.log('\x1b[32m%s\x1b[0m', '\n✨ QA GATE PASSED. READY FOR DELIVERY.');
