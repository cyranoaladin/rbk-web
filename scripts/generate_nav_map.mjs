#!/usr/bin/env node
/**
 * generate_nav_map.mjs
 * Deterministic generator for docs/nav_map.md from script_tech.js
 *
 * RULES (Audit-Grade):
 * - Deterministic ordering (sorted)
 * - No timestamps (avoid noisy diffs)
 * - Single source of truth: script_tech.js
 */

import fs from "fs";
import path from "path";
import os from "os";

function parseArgs(argv) {
    const outIndex = argv.indexOf("--out");
    const checkIndex = argv.indexOf("--check");
    const out = outIndex !== -1 ? argv[outIndex + 1] : null;
    const check = checkIndex !== -1;
    return { out, check };
}

function extractFrBlock(scriptContent) {
    const frStartKeyword = "fr: {";
    const startIndex = scriptContent.indexOf(frStartKeyword);
    if (startIndex === -1) return null;

    let openBraces = 0;
    let blockContent = "";
    const braceStartIndex = startIndex + frStartKeyword.length - 1; // points to '{'

    for (let i = braceStartIndex; i < scriptContent.length; i++) {
        const ch = scriptContent[i];
        if (ch === "{") openBraces++;
        if (ch === "}") openBraces--;
        blockContent += ch;
        if (openBraces === 0) break;
    }
    return blockContent;
}

function extractCanonicalMap(frBlock) {
    // captures: key: "value" or key: 'value'
    const map = new Map();
    const re = /([a-zA-Z0-9_]+)\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(frBlock)) !== null) {
        const key = m[1];
        const value = m[2];
        if (key !== "fr") map.set(key, value);
    }
    return map;
}

function extractAliasMap(scriptContent) {
    // looks for: const LOADPAGE_ALIAS = { ... };
    const match = scriptContent.match(/const\s+LOADPAGE_ALIAS\s*=\s*({[\s\S]*?})\s*;/);
    const map = new Map();
    if (!match) return map;

    const block = match[1];
    const re = /["']([^"']+)["']\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(block)) !== null) {
        map.set(m[1], m[2]);
    }
    return map;
}

function renderMarkdown(canonicalMap, aliasMap) {
    const canonicalKeys = Array.from(canonicalMap.keys()).sort();
    const aliasKeys = Array.from(aliasMap.keys()).sort();

    const lines = [];
    lines.push("# Navigation Map (AUTO-GENERATED)");
    lines.push("");
    lines.push("> DO NOT EDIT MANUALLY. Generated from `script_tech.js`.");
    lines.push("");
    lines.push(`- Canonical IDs: **${canonicalKeys.length}**`);
    lines.push(`- Aliases: **${aliasKeys.length}**`);
    lines.push("");

    lines.push("## Canonical IDs (pagesByLang.fr)");
    lines.push("");
    lines.push("| ID | Target |");
    lines.push("|---|---|");
    for (const id of canonicalKeys) {
        lines.push(`| \`${id}\` | \`${canonicalMap.get(id)}\` |`);
    }
    lines.push("");

    lines.push("## Aliases (LOADPAGE_ALIAS)");
    lines.push("");
    if (aliasKeys.length === 0) {
        lines.push("_No aliases defined._");
    } else {
        lines.push("| Alias | Canonical |");
        lines.push("|---|---|");
        for (const a of aliasKeys) {
            lines.push(`| \`${a}\` | \`${aliasMap.get(a)}\` |`);
        }
    }
    lines.push("");

    return lines.join("\n");
}

function main() {
    const { out, check } = parseArgs(process.argv.slice(2));

    // This script lives in rbk-web/scripts/
    const packageRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
    const scriptTechPath = path.join(packageRoot, "sites", "tech", "script_tech.js");

    if (!fs.existsSync(scriptTechPath)) {
        console.error(`ERROR: script_tech.js not found at: ${scriptTechPath}`);
        process.exit(2);
    }

    const scriptContent = fs.readFileSync(scriptTechPath, "utf8");

    const frBlock = extractFrBlock(scriptContent);
    if (!frBlock) {
        console.error("ERROR: Cannot find `fr: {` block in script_tech.js");
        process.exit(2);
    }

    const canonicalMap = extractCanonicalMap(frBlock);
    const aliasMap = extractAliasMap(scriptContent);

    const md = renderMarkdown(canonicalMap, aliasMap);

    const defaultOut = path.join(packageRoot, "docs", "nav_map.md");
    const outPath = out ? path.resolve(out) : defaultOut;

    if (check) {
        // Print to stdout (for debugging / piping)
        process.stdout.write(md);
        return;
    }

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, md, "utf8");
    console.log(`✅ Generated: ${outPath}`);
}

main();
