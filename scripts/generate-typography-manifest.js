/**
 * ============================================================================
 * scripts/generate-typography-manifest.js
 * ============================================================================
 * Produces tokens/generated/typography-manifest.json -- same "extract names
 * only from built CSS, never values" architecture as
 * generate-color-manifest.js / generate-border-manifest.js.
 *
 * Currently only covers the Font Size scale (per font: font1/font2/font3),
 * since that's the first Typography primitive being built out. Line
 * Height, Letter Spacing, Text Case, Font Family, Font Weight can extend
 * this manifest the same way once those pages are built -- see
 * build/tier_1_core/css/variables.css for the full set of already-built
 * line-heights / letter-spacing / text-case / font-families / font-weights
 * variables this could read from.
 *
 * Font sizes are keyed by heading level (h1, h2-lg, h2, ...) rather than a
 * flat numbered scale like ap_ds_storybook's -- see the project doc/README
 * for why. Each font (font1/font2/font3) also carries three formula
 * PARAMETERS the h1/h2/... steps are calculated from (base, heading-scale,
 * body-text-scale) -- these aren't themselves usable "size steps", so
 * they're filtered out of the rendered scale.
 * ============================================================================
 */

import fs from "node:fs";

const CORE_CSS_PATH = "build/tier_1_core/css/variables.css";
const OUT_DIR = "tokens/generated";
const OUT_PATH = `${OUT_DIR}/typography-manifest.json`;

if (!fs.existsSync(CORE_CSS_PATH)) {
	console.error(`\n✘ ${CORE_CSS_PATH} not found -- run "node build-tokens.js" first.\n`);
	process.exit(1);
}

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

const NON_STEP_SUFFIXES = new Set(["base", "heading-scale", "body-text-scale"]);

function buildFontSizeScale(allNames, font) {
	const prefix = `--ap-font-size-${font}-`;
	return allNames
		.filter((name) => name.startsWith(prefix))
		.map((cssVar) => ({ key: cssVar.slice(prefix.length), cssVar }))
		.filter((item) => !NON_STEP_SUFFIXES.has(item.key));
}

const allNames = parseCssVarNames(fs.readFileSync(CORE_CSS_PATH, "utf-8"));

const manifest = {
	generatedFrom: CORE_CSS_PATH,
	fontSize: {
		font1: buildFontSizeScale(allNames, "font1"),
		font2: buildFontSizeScale(allNames, "font2"),
		font3: buildFontSizeScale(allNames, "font3"),
	},
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(
	`✔︎ ${OUT_PATH} (font-size steps -- font1: ${manifest.fontSize.font1.length}, font2: ${manifest.fontSize.font2.length}, font3: ${manifest.fontSize.font3.length})`,
);
