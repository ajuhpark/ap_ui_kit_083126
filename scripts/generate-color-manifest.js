/**
 * ============================================================================
 * scripts/generate-color-manifest.js
 * ============================================================================
 * Produces tokens/generated/color-manifest.json -- the list of color CSS
 * custom properties the Storybook "Foundations / Color" pages render.
 *
 * WHY THIS EXISTS: ap_ds_storybook's Foundations pages hand-type every
 * token's hex value into a JS array (see BrandColors.jsx there). That does
 * not scale to ap_ui_kit's token set (3 themes x a much larger palette,
 * still growing), and hand-typed values drift from the real tokens the
 * moment someone edits Token Studio. So this project takes the opposite
 * approach end to end:
 *   1. This script extracts ONLY the token names (the --ap-color-* /
 *      --ap-tier-2-color-* custom property names) from the already-built
 *      "core" CSS output -- never a value.
 *   2. The Storybook components import this manifest for the list of
 *      swatches to render, then read each swatch's ACTUAL value at render
 *      time via getComputedStyle(), so whatever the active theme/viewport
 *      globals are, the displayed value is always the real resolved one.
 * This script never re-implements Style Dictionary's own name/kebab
 * transform -- it parses names straight out of Style Dictionary's own
 * output, so there is no way for the manifest's variable names to drift
 * from what build-tokens.js actually generates.
 *
 * Reads build/tier_1_core/css/variables.css (the "core" theme's standalone
 * build) purely as a name source -- tier_2 (semantic) tokens are present in
 * every theme/viewport build because build-tokens.js's BASE_SOURCE includes
 * tier_2.json in all of them, so "core" is as good a source of names as any.
 *
 * ALSO produces manifest.tier2ThemeDiffs.{green,gold} -- the subset of
 * tier_2 semantic vars whose RESOLVED VALUE actually differs from core for
 * that theme. Most of Content/Background/Border only ever reference
 * color.neutral / color_palettes / utility, which never change per theme
 * -- only entries that ultimately reference color.brand.* do. This is
 * computed by diffing the already-built CSS for each theme against core's,
 * rather than static reference-path parsing, since a value diff is correct
 * regardless of how many levels of {alias} indirection a token goes
 * through. Used by the "Green Tier 2"/"Gold Tier 2" sidebar pages so they
 * only show what's actually theme-specific instead of duplicating Core's
 * full semantic list (mirrors the same reasoning already applied to Tier 1,
 * where Green/Gold only show "Brand" -- confirmed via tokens/sets/
 * tier_1_green.json / tier_1_gold.json that "brand" is the only key their
 * `color` object overrides at all).
 *
 * Run after build-tokens.js (see package.json's "build" script). Output is
 * regenerated every time, same as tokens/sets/ and build/ -- not tracked in
 * git (see .gitignore).
 * ============================================================================
 */

import fs from "node:fs";

const CORE_CSS_PATH = "build/tier_1_core/css/variables.css";
const THEME_CSS_PATHS = {
	green: "build/tier_1_green/css/variables.css",
	gold: "build/tier_1_gold/css/variables.css",
};
const OUT_DIR = "tokens/generated";
const OUT_PATH = `${OUT_DIR}/color-manifest.json`;

if (!fs.existsSync(CORE_CSS_PATH)) {
	console.error(`\n✘ ${CORE_CSS_PATH} not found -- run "node build-tokens.js" first.\n`);
	process.exit(1);
}

// Matches lines like `  --ap-color-color-palettes-pale-red-0: #fff5f5;`
const varRe = /^\s*(--ap-[a-z0-9-]+):\s*([^;]+);\s*$/gm;

function parseCssVars(cssText) {
	const map = new Map();
	varRe.lastIndex = 0;
	let match;
	while ((match = varRe.exec(cssText))) {
		map.set(match[1], match[2].trim());
	}
	return map;
}

const coreVarsMap = parseCssVars(fs.readFileSync(CORE_CSS_PATH, "utf-8"));
const all = Array.from(coreVarsMap.entries()).map(([cssVar, value]) => ({ cssVar, value }));

const colorVars = all.filter(
	(v) => v.cssVar.startsWith("--ap-color-") || v.cssVar.startsWith("--ap-tier-2-color-"),
);

function titleCase(str) {
	return str
		.split("-")
		.filter(Boolean)
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join(" ");
}

function stripPrefix(cssVar, prefix) {
	return cssVar.slice(prefix.length);
}

// For categories that fan out into named sub-scales (e.g. "Color Palettes"
// contains "Pale Red", "Orange", ... each with its own 0-900 step run).
// The step is always the trailing numeric segment Style Dictionary kept
// from Token Studio (0, 100, 200, ... 900) -- everything before the last
// "-<digits>" is the family name.
function buildFamilyScale(prefix, label) {
	const items = colorVars.filter((v) => v.cssVar.startsWith(prefix));
	const families = new Map();
	for (const item of items) {
		const remainder = stripPrefix(item.cssVar, prefix);
		const match = remainder.match(/^(.+)-(\d+)$/);
		// A family with a numeric step (e.g. "pale-red-500") gets grouped
		// under its family name with that number as the step label. A
		// family with no numeric step (e.g. a standalone "dataviz-orange"
		// token) is its own one-swatch family -- `step: null` tells the
		// component to render it without a redundant step label.
		const familyKey = match ? match[1] : remainder;
		const step = match ? match[2] : null;
		if (!families.has(familyKey)) families.set(familyKey, []);
		families.get(familyKey).push({ step, cssVar: item.cssVar });
	}
	return {
		title: label,
		families: Array.from(families.entries()).map(([key, steps]) => ({
			name: titleCase(key),
			items: steps,
		})),
	};
}

// For categories that are already one flat scale -- rendered as a SINGLE
// ColorPalette (one tile column + one label column), e.g. Neutral (just
// 100-900 plus white/black, no family sub-split) and Transparent (just
// transparent-1/2/3, same layout as ap_ds_storybook's TransparentColors.jsx
// -- ColorPalette doesn't care whether the values are opaque or alpha).
function buildFlatScale(prefix, label) {
	const items = colorVars.filter((v) => v.cssVar.startsWith(prefix));
	return {
		title: label,
		families: [
			{
				name: label,
				items: items.map((item) => ({
					step: titleCase(stripPrefix(item.cssVar, prefix)),
					cssVar: item.cssVar,
				})),
			},
		],
	};
}

// For categories that are a flat list of distinctly-named tokens rendered
// as individual cards rather than a ColorPalette tile/label column pair --
// currently just the tier_2 semantic content/background/border layers.
// `only` (optional) restricts to a specific set of cssVar names -- used
// for the per-theme diff-only grids below.
function buildGrid(prefix, label, only) {
	let items = colorVars.filter((v) => v.cssVar.startsWith(prefix));
	if (only) items = items.filter((v) => only.has(v.cssVar));
	return {
		title: label,
		items: items.map((item) => ({
			label: titleCase(stripPrefix(item.cssVar, prefix)),
			cssVar: item.cssVar,
		})),
	};
}

const TIER2_PREFIXES = [
	["--ap-tier-2-color-content-", "Content"],
	["--ap-tier-2-color-background-", "Background"],
	["--ap-tier-2-color-border-", "Border"],
];

// For each non-core theme, diff its build's tier_2 vars against core's and
// keep only the ones whose value actually changed.
function buildTier2ThemeDiff(themeCssPath) {
	if (!fs.existsSync(themeCssPath)) {
		console.warn(`  (skipping theme diff -- ${themeCssPath} not found)`);
		return null;
	}
	const themeVarsMap = parseCssVars(fs.readFileSync(themeCssPath, "utf-8"));
	const changedVars = new Set();
	for (const [cssVar, value] of themeVarsMap) {
		if (cssVar.startsWith("--ap-tier-2-color-") && coreVarsMap.get(cssVar) !== value) {
			changedVars.add(cssVar);
		}
	}
	return TIER2_PREFIXES.map(([prefix, label]) => buildGrid(prefix, label, changedVars)).filter(
		(grid) => grid.items.length > 0,
	);
}

// "Data Viz" used to live inside "Color Palettes" as a handful of
// single-swatch families (Dataviz Orange/Purple/Pale Red Subtle/Pale Red
// -- no numeric step, so buildFamilyScale already treats each as its own
// one-swatch family). Split those out into their own scale/page instead
// of teaching buildFamilyScale a "dataviz" special case -- same
// rendering path (ColorScaleSection -> ColorPalette), just a different
// `scales` entry. Family names come out of buildFamilyScale already
// title-cased ("Dataviz Orange", ...), so the split matches on that
// prefix. Confirmed identical across all three themes (core/green/gold),
// same as everything else "Color Palettes" carries -- so, like Utility/
// Neutral/Transparent, this only needs to appear on the Core Color page,
// not duplicated onto Green/Gold Tier 1's pages.
const colorPalettesScale = buildFamilyScale("--ap-color-color-palettes-", "Color Palettes");
const dataVizFamilies = colorPalettesScale.families.filter((f) => f.name.startsWith("Dataviz"));
colorPalettesScale.families = colorPalettesScale.families.filter((f) => !f.name.startsWith("Dataviz"));
const dataVizScale = { title: "Data Viz", families: dataVizFamilies };

const manifest = {
	generatedFrom: CORE_CSS_PATH,
	scales: [
		colorPalettesScale,
		dataVizScale,
		buildFamilyScale("--ap-color-utility-", "Utility"),
		buildFamilyScale("--ap-color-brand-", "Brand"),
		buildFlatScale("--ap-color-neutral-", "Neutral"),
		// Renders as a ColorPalette (tile column + label column), same as
		// ap_ds_storybook's TransparentColors.jsx -- not a "grid" card.
		buildFlatScale("--ap-color-transparent-", "Transparent"),
	],
	grids: [
		buildGrid("--ap-tier-2-color-content-", "Semantic — Content"),
		buildGrid("--ap-tier-2-color-background-", "Semantic — Background"),
		buildGrid("--ap-tier-2-color-border-", "Semantic — Border"),
	],
	tier2ThemeDiffs: {
		green: buildTier2ThemeDiff(THEME_CSS_PATHS.green),
		gold: buildTier2ThemeDiff(THEME_CSS_PATHS.gold),
	},
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n");
const diffCounts = Object.entries(manifest.tier2ThemeDiffs)
	.map(([theme, grids]) => `${theme}=${grids ? grids.reduce((n, g) => n + g.items.length, 0) : "n/a"}`)
	.join(", ");
console.log(
	`✔︎ ${OUT_PATH} (${colorVars.length} color tokens; Color Palettes families: ${colorPalettesScale.families.length}, Data Viz families: ${dataVizScale.families.length}; tier_2 diffs: ${diffCounts})`,
);
