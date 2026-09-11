/**
 * ============================================================================
 * scripts/generate-border-manifest.js
 * ============================================================================
 * Produces tokens/generated/border-manifest.json -- the list of
 * --ap-border-width-* / --ap-border-radius-* CSS custom property NAMES the
 * Storybook "Foundations / Border" page renders. Same architecture as
 * generate-color-manifest.js: this script only ever extracts names from the
 * already-built "core" CSS output, never a value -- BorderToken.jsx reads
 * each token's ACTUAL value at render time via getComputedStyle(), so
 * nothing here is hand-typed (unlike ap_ds_storybook's BorderScale.jsx,
 * which hand-types both `key` and `value` for every token).
 *
 * Border tokens are a flat list (no family/step sub-split like Color's
 * "Color Palettes"), and border-width/radius don't vary per theme (there's
 * no equivalent of Color's tier2ThemeDiffs here) -- ap_ds_storybook only
 * ever has one Border page, under "1. Core", never duplicated under a
 * theme folder, and ap_ui_kit follows the same pattern.
 *
 * Run after build-tokens.js (see package.json's "build" script). Output is
 * regenerated every time, same as color-manifest.json -- not tracked in
 * git (see .gitignore).
 * ============================================================================
 */

import fs from "node:fs";

const CORE_CSS_PATH = "build/tier_1_core/css/variables.css";
const OUT_DIR = "tokens/generated";
const OUT_PATH = `${OUT_DIR}/border-manifest.json`;

if (!fs.existsSync(CORE_CSS_PATH)) {
	console.error(`\n✘ ${CORE_CSS_PATH} not found -- run "node build-tokens.js" first.\n`);
	process.exit(1);
}

// Matches lines like `  --ap-border-width-1: 1px;`
const varRe = /^\s*(--ap-[a-z0-9-]+):\s*([^;]+);\s*$/gm;

function parseCssVarNames(cssText) {
	const names = [];
	varRe.lastIndex = 0;
	let match;
	while ((match = varRe.exec(cssText))) {
		names.push(match[1]);
	}
	return names;
}

function stripPrefix(cssVar, prefix) {
	return cssVar.slice(prefix.length);
}

// Border tokens are a single flat scale per prefix (no family sub-split),
// and the CSS file's own declaration order already matches Token Studio's
// source order (0, 1, 2, 4, 8, ... "round" last) -- confirmed against the
// built output -- so no re-sorting is needed here, just filter + strip.
function buildTokenList(allNames, prefix) {
	return allNames.filter((name) => name.startsWith(prefix)).map((cssVar) => ({
		key: stripPrefix(cssVar, prefix),
		cssVar,
	}));
}

const allNames = parseCssVarNames(fs.readFileSync(CORE_CSS_PATH, "utf-8"));

const manifest = {
	generatedFrom: CORE_CSS_PATH,
	width: buildTokenList(allNames, "--ap-border-width-"),
	radius: buildTokenList(allNames, "--ap-border-radius-"),
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(
	`✔︎ ${OUT_PATH} (${manifest.width.length} width tokens, ${manifest.radius.length} radius tokens)`,
);
