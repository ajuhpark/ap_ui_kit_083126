/**
 * ============================================================================
 * scripts/generate-typography-manifest.js
 * ============================================================================
 * Produces tokens/generated/typography-manifest.json -- same "extract names
 * only from built CSS, never values" architecture as
 * generate-color-manifest.js / generate-border-manifest.js.
 *
 * Covers Font Size, Line Height (per font: font1/font2/font3), and Letter
 * Spacing (flat, not per-font) so far. Text Case, Font Family, Font Weight
 * can extend this manifest the same way once those pages are built -- see
 * build/tier_1_core/css/variables.css for the full set of already-built
 * text-case / font-families / font-weights variables this could read from.
 *
 * fontSize and lineHeight are keyed by heading level names (h1, h2-lg, h2,
 * ...) rather than a flat numbered scale like ap_ds_storybook's -- see the
 * project doc/README for why. Each font (font1/font2/font3) also carries
 * three formula PARAMETERS the h1/h2/... steps are calculated from (base,
 * heading-scale, body-text-scale) -- these aren't themselves usable steps,
 * so they're filtered out of the rendered scale.
 *
 * letterSpacing, unlike fontSize/lineHeight, is genuinely flat and
 * font-independent at the token level -- every heading level across every
 * font references the same shared `letterSpacing.*` primitive (see
 * tokens.json's tier_1_core.letterSpacing) -- so there's nothing to key
 * per font, and the scale is a plain list, matching how
 * ap_ds_storybook's own letter-spacing scale works (also flat, also
 * shared across its one typeface). Named steps mirror ap_ds_storybook's
 * naming convention (0, 2, half, minus-1, minus-1-half, minus-2,
 * minus-half) plus this project's own pre-existing "1" placeholder.
 *
 * UNIT NOTE (lineHeight only): unlike --ap-font-size-*, which the
 * tokens-studio transform group emits with a "px" suffix baked in (e.g.
 * "39px"), --ap-line-heights-* is emitted as a bare unitless number (e.g.
 * "46") even though these are absolute-pixel leading values (base *
 * heading-scale^n, same formula shape as fontSize), not CSS's usual
 * unitless line-height ratios. Consumers can't use `line-height:
 * var(--ap-line-heights-font1-h1)` as-is -- that reads as a 46x
 * multiplier, not 46px. LineHeightCard.jsx works around this at the point
 * of use with `calc(var(...) * 1px)`; this manifest just records the
 * cssVar names, same as fontSize.
 *
 * --ap-letter-spacing-* does NOT have this problem, even though it's also
 * built via a @tokens-studio/sd-transforms $type-specific transform
 * (`ts/size/css/letterspacing`) rather than the generic px-appending one:
 * these values are authored as literal unit strings (e.g. "2px",
 * "-1.5px"), not formulas, and that transform only rewrites values shaped
 * like percentages (e.g. "2%" -> "0.02em") -- everything else passes
 * through untouched, unit intact. Confirmed against the actual build
 * output: --ap-letter-spacing-2: 2px, --ap-letter-spacing-minus-1: -1px,
 * etc. -- all correct, no calc() workaround needed here.
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

function buildScale(allNames, prefix) {
	return allNames
		.filter((name) => name.startsWith(prefix))
		.map((cssVar) => ({ key: cssVar.slice(prefix.length), cssVar }))
		.filter((item) => !NON_STEP_SUFFIXES.has(item.key));
}

function buildFontSizeScale(allNames, font) {
	return buildScale(allNames, `--ap-font-size-${font}-`);
}

function buildLineHeightScale(allNames, font) {
	return buildScale(allNames, `--ap-line-heights-${font}-`);
}

function buildLetterSpacingScale(allNames) {
	return buildScale(allNames, "--ap-letter-spacing-");
}

const allNames = parseCssVarNames(fs.readFileSync(CORE_CSS_PATH, "utf-8"));

const manifest = {
	generatedFrom: CORE_CSS_PATH,
	fontSize: {
		font1: buildFontSizeScale(allNames, "font1"),
		font2: buildFontSizeScale(allNames, "font2"),
		font3: buildFontSizeScale(allNames, "font3"),
	},
	lineHeight: {
		font1: buildLineHeightScale(allNames, "font1"),
		font2: buildLineHeightScale(allNames, "font2"),
		font3: buildLineHeightScale(allNames, "font3"),
	},
	letterSpacing: buildLetterSpacingScale(allNames),
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(
	`✔︎ ${OUT_PATH} (font-size steps -- font1: ${manifest.fontSize.font1.length}, font2: ${manifest.fontSize.font2.length}, font3: ${manifest.fontSize.font3.length}; ` +
		`line-height steps -- font1: ${manifest.lineHeight.font1.length}, font2: ${manifest.lineHeight.font2.length}, font3: ${manifest.lineHeight.font3.length}; ` +
		`letter-spacing steps: ${manifest.letterSpacing.length})`,
);
