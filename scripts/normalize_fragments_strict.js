/**
 * Strict fragment normalization:
 * - Ensures every chapter fragment has a single consistent root wrapper:
 *     <div class="space-y-14 animate-in fade-in duration-700"> ... </div>
 * - Never double-wrap if the exact wrapper is already present.
 * - Rewrites legacy loadPage('...') IDs via an alias table.
 *
 * Usage:
 *   node scripts/normalize_fragments_strict.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CHAPTERS_DIR = path.join(ROOT, "sites", "tech", "chapters");

const ROOT_WRAPPER_CLASS = 'space-y-14 animate-in fade-in duration-700';
const EXACT_OPEN = `<div class="${ROOT_WRAPPER_CLASS}">`;
const EXACT_CLOSE = `</div>`;

const LOADPAGE_ALIAS = {
    "00_executive_summary": "tech_00_home",
    "00_executive_summary_en": "tech_00_home",

    "tech_solana_n1": "tech_06a_solana_n1",
    "tech_solana_n2": "tech_06b_solana_n2",
    "tech_solana_n3": "tech_06c_solana_n3",

    "tech_06_solana_hub": "tech_solana_hub",
    "tech_06d_security": "tech_06d_security_labs",
    "tech_06e_tokens": "tech_06e_tokens_and_cpi",
    "tech_06f_amm": "tech_06f_build_an_amm",
    "tech_06g_validator": "tech_06g_validator_infra_overview",

    "tech_intro_en": "tech_intro",
    "tech_06_foundations_en": "tech_06_foundations",
    "tech_06a_solana_n1_en": "tech_06a_solana_n1",
    "tech_06b_solana_n2_en": "tech_06b_solana_n2",
    "tech_06c_solana_n3_en": "tech_06c_solana_n3",
    "tech_06d_security_labs_en": "tech_06d_security_labs",
    "tech_06e_tokens_and_cpi_en": "tech_06e_tokens_and_cpi",
    "tech_06f_build_an_amm_en": "tech_06f_build_an_amm",
    "tech_06g_validator_infra_overview_en": "tech_06g_validator_infra_overview",
    "tech_solana_hub_en": "tech_solana_hub",
};

function normalizePageId(inputId) {
    let id = (inputId || "").trim();
    if (id.endsWith("_en")) id = id.slice(0, -3);
    for (let i = 0; i < 5; i++) {
        const next = LOADPAGE_ALIAS[id];
        if (!next || next === id) break;
        id = next;
    }
    return id;
}

function rewriteLoadPageCalls(html) {
    return html.replace(/loadPage\s*\(\s*(['"])([^'"]+)\1\s*\)/g, (_, quote, id) => {
        const normalized = normalizePageId(id);
        return `loadPage(${quote}${normalized}${quote})`;
    });
}

function alreadyExactWrapped(trimmed) {
    return trimmed.startsWith(EXACT_OPEN) && trimmed.endsWith(EXACT_CLOSE);
}

function looksLikeAnotherTopWrapper(trimmed) {
    return trimmed.startsWith('<div class="space-y-');
}

const WRAPPER_REGEX = /<div class="space-y-[^"]*">/;

const OPEN_TAG_REGEX = /^<div\s+([^>]*)class=(["'])(?:(?!\2).)*\2([^>]*)>/i;
const SPACE_Y_CHECK = /space-y-/;

function enforceRootWrapperStrict(html) {
    const trimmed = (html || "").trim();

    // 1. Check if perfectly EXACT already
    if (alreadyExactWrapped(trimmed)) return trimmed;

    // 2. Check if it looks like a wrapper (starts with <div ... class="...space-y-...")
    const match = trimmed.match(OPEN_TAG_REGEX);
    if (match) {
        // match[0] is the whole opening tag
        // Check if the current class contains space-y-
        // actually accessing the class value in regex is tricky if we don't capture it specifically
        // Let's refine the regex or logic.

        // Simpler approach: Extract the opening tag.
        const openTagEndIndex = trimmed.indexOf(">");
        if (openTagEndIndex === -1) return `${EXACT_OPEN}\n\n${trimmed}\n\n${EXACT_CLOSE}`; // Should not happen if well formed

        const openTag = trimmed.substring(0, openTagEndIndex + 1);

        // Check if this opening tag has "space-y-" in its class
        if (openTag.includes("class=") && openTag.includes("space-y-")) {
            // SAFE REPLACEMENT:
            // We want to replace the whole class="..." value with our exact class.
            // But we must preserve other attributes (id, data, role).

            // Regex to match class="..." or class='...'
            // We use a replacer ensuring we only touch the class attribute.
            const newOpenTag = openTag.replace(/class=(["'])(?:(?!\1).)*\1/, `class="${ROOT_WRAPPER_CLASS}"`);

            // Reconstruct string
            return newOpenTag + trimmed.substring(openTagEndIndex + 1);
        }
    }

    // 3. Fallback: Wrap it if no suitable wrapper found
    // (User said: "Si pas de wrapper → envelopper")
    return `${EXACT_OPEN}\n\n${trimmed}\n\n${EXACT_CLOSE}`;
}

function normalizeOneFile(filePath) {
    const before = fs.readFileSync(filePath, "utf8");
    let after = before;

    after = rewriteLoadPageCalls(after);
    after = enforceRootWrapperStrict(after);

    if (after !== before) {
        fs.writeFileSync(filePath, after.endsWith("\n") ? after : after + "\n", "utf8");
        return true;
    }
    return false;
}

function main() {
    if (!fs.existsSync(CHAPTERS_DIR)) {
        console.error("chapters/ directory not found:", CHAPTERS_DIR);
        process.exit(1);
    }

    const files = fs.readdirSync(CHAPTERS_DIR).filter((f) => f.endsWith(".html"));
    let changed = 0;

    for (const f of files) {
        const p = path.join(CHAPTERS_DIR, f);
        if (normalizeOneFile(p)) changed += 1;
    }

    console.log(`Strict normalization complete. Files changed: ${changed}`);
}

main();
