/**
 * Normalize chapter fragments:
 * - strip DOCTYPE / html/head/body wrappers
 * - remove unmatched closing </div> / </section> when stack is empty
 * - enforce a single root wrapper <div class="space-y-14 animate-in fade-in duration-700"> ... </div>
 *
 * Usage:
 *   node scripts/normalize_fragments.js --dry
 *   node scripts/normalize_fragments.js --write
 */

const fs = require("fs");
const path = require("path");

const ROOT_CLASS = "space-y-14 animate-in fade-in duration-700";
const CHAPTERS_DIR = path.join(process.cwd(), "chapters");

const MODE = process.argv.includes("--write") ? "write" : "dry";

function stripWrappers(html) {
    let out = html;

    // Remove full-page wrappers if present
    out = out.replace(/<!DOCTYPE[^>]*>\s*/gi, "");
    out = out.replace(/<html\b[^>]*>/gi, "").replace(/<\/html>/gi, "");
    out = out.replace(/<head\b[\s\S]*?<\/head>\s*/gi, "");
    out = out.replace(/<body\b[^>]*>/gi, "").replace(/<\/body>/gi, "");

    return out.trim();
}

/**
 * Remove unmatched closing tags for div/section only when stack is empty.
 * This safely fixes the common bug: extra closing tags appended at the end.
 */
function removeOrphanClosings(html) {
    const tagRe = /<\/?(div|section)\b[^>]*>/gi;

    const removals = [];
    const stack = [];

    let m;
    while ((m = tagRe.exec(html)) !== null) {
        const tag = m[0];
        const name = m[1];
        const isClosing = tag.startsWith("</");

        if (!isClosing) {
            stack.push(name);
            continue;
        }

        if (stack.length && stack[stack.length - 1] === name) {
            stack.pop();
            continue;
        }

        // Safe removal: only when stack is empty (pure orphan)
        if (stack.length === 0) {
            removals.push([m.index, m.index + tag.length]);
        }
    }

    if (!removals.length) return html;

    // Apply removals from end to start to preserve indices
    removals.sort((a, b) => b[0] - a[0]);
    let out = html;
    for (const [start, end] of removals) {
        out = out.slice(0, start) + out.slice(end);
    }
    return out.trim();
}

/**
 * Enforce a single root wrapper.
 * - If the fragment already starts with a div that contains "space-y-" in its class, normalize it to ROOT_CLASS.
 * - Otherwise wrap the whole fragment.
 */
function enforceRootWrapper(html) {
    let out = html.trim();

    // Normalize first root div if it already looks like a "chapter wrapper"
    // (contains space-y- in class attribute).
    out = out.replace(
        /^<div\s+class="[^"]*space-y-[^"]*"[^>]*>/i,
        `<div class="${ROOT_CLASS}">`
    );

    // If it doesn't start with a div wrapper, wrap it.
    if (!/^<div\b/i.test(out)) {
        out = `<div class="${ROOT_CLASS}">\n\n${out}\n\n</div>`;
        return out.trim() + "\n";
    }

    // If it starts with div but not the wrapper we want, wrap anyway (conservative)
    if (!new RegExp(`^<div\\s+class="${ROOT_CLASS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "i").test(out)) {
        out = `<div class="${ROOT_CLASS}">\n\n${out}\n\n</div>`;
    }

    return out.trim() + "\n";
}

function normalizeFragment(content) {
    let out = stripWrappers(content);
    out = removeOrphanClosings(out);
    out = enforceRootWrapper(out);
    return out;
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) files.push(...walk(p));
        else files.push(p);
    }
    return files;
}

function main() {
    if (!fs.existsSync(CHAPTERS_DIR)) {
        console.error(`ERROR: chapters dir not found at: ${CHAPTERS_DIR}`);
        process.exit(1);
    }

    const chapterFiles = walk(CHAPTERS_DIR).filter((f) => f.endsWith(".html"));

    let changed = 0;

    for (const file of chapterFiles) {
        const original = fs.readFileSync(file, "utf-8");
        const normalized = normalizeFragment(original);

        if (normalized !== original) {
            changed++;
            const rel = path.relative(process.cwd(), file);

            if (MODE === "dry") {
                console.log(`[DRY] would normalize: ${rel}`);
            } else {
                // backup once
                const backup = `${file}.bak`;
                if (!fs.existsSync(backup)) {
                    fs.writeFileSync(backup, original, "utf-8");
                }
                fs.writeFileSync(file, normalized, "utf-8");
                console.log(`[WRITE] normalized: ${rel} (backup: ${path.basename(backup)})`);
            }
        }
    }

    console.log(`\nDone. Mode=${MODE}. Files changed: ${changed}/${chapterFiles.length}`);
}

main();
