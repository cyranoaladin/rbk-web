const fs = require('fs');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, '../script_tech.js');
const DOCS_DIR = path.join(__dirname, '../docs');
const CHAPTERS_DIR = path.join(__dirname, '../chapters');

if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR);

const scriptContent = fs.readFileSync(SCRIPT_PATH, 'utf8');

// --- DATA EXTRACTION ---

// 1. Extract pagesByLang
// Quick & Dirty regex extraction for pagesByLang object structure
const pagesByLangMatch = scriptContent.match(/const pagesByLang = ({[\s\S]*?});/);
let pagesByLang = { fr: {}, en: {} };

if (pagesByLangMatch) {
    const cleanStr = pagesByLangMatch[1]
        .replace(/\/\/.*$/gm, '') // remove single line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // remove block comments

    // Extract key: value pairs
    const regex = /([a-zA-Z0-9_]+)\s*:\s*["']([^"']+)["']/g;
    let m;
    // We assume the first block of keys is FR and second EN, or we look for "fr: {"
    // Let's rely on simple string searching for the blocks
    const frBlockMatch = cleanStr.match(/fr\s*:\s*{([\s\S]*?)}(?:\s*,|$)/);
    const enBlockMatch = cleanStr.match(/en\s*:\s*{([\s\S]*?)}(?:\s*,|$)/);

    const parseBlock = (blockStr, target) => {
        let match;
        const r = /([a-zA-Z0-9_]+)\s*:\s*["']([^"']+)["']/g;
        while ((match = r.exec(blockStr)) !== null) {
            target[match[1]] = match[2];
        }
    };

    if (frBlockMatch) parseBlock(frBlockMatch[1], pagesByLang.fr);
    if (enBlockMatch) parseBlock(enBlockMatch[1], pagesByLang.en);
}

// 2. Extract LOADPAGE_ALIAS
const aliasMatch = scriptContent.match(/const LOADPAGE_ALIAS = ({[\s\S]*?});/);
let loadPageAlias = {};
if (aliasMatch) {
    const cleanStr = aliasMatch[1].replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const regex = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = regex.exec(cleanStr)) !== null) {
        loadPageAlias[m[1]] = m[2];
    }
}

// 3. Extract sidebarConfig
// We need to parse this to understand structure.
// We'll use a hacky evaluator again as it's the most reliable way without building a full parser.
let sidebarConfig = [];
const sidebarMatch = scriptContent.match(/const sidebarConfig = (\[[\s\S]*?\]);/);
if (sidebarMatch) {
    const tempFile = path.join(__dirname, 'temp_sidebar_extract.js');
    try {
        fs.writeFileSync(tempFile, `console.log(JSON.stringify(${sidebarMatch[1]}));`);
        // We might need to mock lucide icons or other vars if used? 
        // Thankfully the config looks static in previous reads.
        const output = require('child_process').execSync(`node ${tempFile}`).toString();
        sidebarConfig = JSON.parse(output);
    } catch (e) {
        console.error("Sidebar extraction failed", e);
    } finally {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
}


// --- ANALYSIS ---

const canonicalIds = new Set(Object.keys(pagesByLang.fr));
const aliasIds = new Set(Object.keys(loadPageAlias));
const sidebarIds = new Set();
const sidebarSequence = []; // List of IDs in order (flattened)

function traverseSidebar(nodes) {
    nodes.forEach(node => {
        if (node.items) traverseSidebar(node.items);
        else if (node.children) {
            // If group has an ID, it might be a page too
            if (node.id) {
                sidebarIds.add(node.id);
                // Only add to sequence if it is a canonical page (navigatable)
                if (canonicalIds.has(node.id)) sidebarSequence.push(node.id);
            }
            traverseSidebar(node.children);
        } else if (node.id) {
            sidebarIds.add(node.id);
            if (canonicalIds.has(node.id)) sidebarSequence.push(node.id);
        }
    });
}
traverseSidebar(sidebarConfig);

// Analyze Chapter Files
const chapters = fs.readdirSync(CHAPTERS_DIR).filter(f => f.endsWith('.html'));
const references = {}; // id -> count
const deadEnds = [];
const danglingLinks = new Set();
const allLoadPages = new Set();

chapters.forEach(file => {
    const content = fs.readFileSync(path.join(CHAPTERS_DIR, file), 'utf8');
    const matches = [...content.matchAll(/loadPage\(['"]([^'"]+)['"]\)/g)];

    // Determine if this file is a canonical page
    // We reverse map file -> canonical ID (FR only for map, but check EN too?)
    // Simplification: Audit based on FR canonical structure for now, assuming EN mirrors.
    const pageId = Object.keys(pagesByLang.fr).find(key => pagesByLang.fr[key].endsWith(file));

    // Check if dead end (no loadPage calls at all? or no "Next" button logic?)
    // Ideally we check if it has A link to something.
    if (pageId && matches.length === 0) {
        // Only classify as dead end if it's meant to be in a flow.
        // Some pages might be popups or terminals. 
        // But for Lead, "dead end" means user is stuck.
        deadEnds.push(pageId);
    }

    matches.forEach(m => {
        const targetId = m[1];
        allLoadPages.add(targetId);

        // Count references
        if (!references[targetId]) references[targetId] = 0;
        references[targetId]++;

        // Validate link
        if (!canonicalIds.has(targetId) && !aliasIds.has(targetId)) {
            // Check if strict match failed but maybe loose match works?
            // QA script will be strict.
            danglingLinks.add(targetId);
        }
    });
});

// Classify Orphans vs Aliases
// An orphan is a CANONICAL id that is NOT in the sidebar AND NOT aliased 
// (Wait, aliases map legacy -> canonical. An alias itself isn't a page definition)
// So we check canonicals.

const trueOrphans = [...canonicalIds].filter(id => !sidebarIds.has(id));

// Legacy IDs detected: 
// IDs found in loadPage calls (or aliases defs) that are NOT canonical
// But technically they are valid if they are in LOADPAGE_ALIAS.
const activeLegacyIds = [...allLoadPages].filter(id => aliasIds.has(id) && !canonicalIds.has(id));


// --- REPORT GENERATION ---

let report = `# Documentation Navigation Map (R4.3)

Generated: ${new Date().toISOString()}

## 1. Sidebar Sequence (Prev/Next Chain)
*Only canonical pages included in navigation flow.*

`;

sidebarSequence.forEach((id, i) => {
    const prev = sidebarSequence[i - 1] || '(Start)';
    const next = sidebarSequence[i + 1] || '(End)';
    report += `- **${id}**: Prev=\`${prev}\` | Next=\`${next}\`\n`;
});

report += `\nTotal Navigable Pages: ${sidebarSequence.length}\n`;

report += `\n## 2. Legacy IDs Detected (Aliased)
*These IDs are used in code/content but mapped to canonical pages.*

| Legacy ID | Mapped To (Canonical) | Status |
|-----------|------------------------|--------|
`;

activeLegacyIds.forEach(id => {
    report += `| \`${id}\` | \`${loadPageAlias[id]}\` | ✅ Handled |\n`;
});
// Also verify aliases defined in script but not used (audit completeness)
const unusedAliases = Object.keys(loadPageAlias).filter(id => !allLoadPages.has(id));
if (unusedAliases.length > 0) {
    report += `\n**Unused Aliases (Defined but not linked):** ${unusedAliases.join(', ')}\n`;
}


report += `\n## 3. True Orphans
*Canonical pages not reachable via Sidebar.*

`;
if (trueOrphans.length === 0) {
    report += "✅ **None.** All canonical pages are in the sidebar.\n";
} else {
    trueOrphans.forEach(id => report += `- ⚠️ \`${id}\`: Defined in \`pagesByLang\` but missing from sidebar.\n`);
}

report += `\n## 4. Backlink / Integrity Check

`;

if (danglingLinks.size === 0) {
    report += "✅ **Dangling Links:** 0 (All `loadPage` calls point to valid IDs).\n";
} else {
    report += "❌ **Dangling Links Detected:**\n";
    danglingLinks.forEach(id => report += `- \`${id}\` (Unknown ID)\n`);
}

if (deadEnds.length === 0) {
    report += "✅ **Dead Ends:** 0 (All pages have outgoing links).\n";
} else {
    report += "**Potential Dead Ends (No `loadPage` calls):**\n";
    deadEnds.forEach(id => report += `- \`${id}\`\n`);
}

fs.writeFileSync(path.join(DOCS_DIR, 'nav_map.md'), report);
console.log("Nav Map generated at docs/nav_map.md");
