/**
 * ============================================================================
 * scripts/generate-typography-manifest.js
 * ============================================================================
 * Produces tokens/generated/typography-manifest.json -- same "extract names
 * only from built CSS, never values" architecture as
 * generate-color-manifest.js / generate-border-manifest.js.
 *
 * Covers Font Size, Line Height (per font: font1/font2/font3), Letter
 * Spacing (flat, not per-font), Font Weight (Tokens Studio's own raw
 * groups), Font Family (flat, per font: font1/font2/font3), and Tier 2
 * Semantic Typography's composite styles (Display/Headline/Title/Label/
 * Body/Meta -- see COMPOSITE STYLES below).
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
 * UNIT NOTE (lineHeight only): @tokens-studio/sd-transforms' generic
 * `ts/size/lineheight` transform treats bare numbers as CSS's native
 * unitless line-height RATIO convention and deliberately leaves them
 * alone -- correct for that convention, but this project's
 * `lineHeights.*` tokens are actually absolute-pixel leading values (base
 * * heading-scale^n, same formula shape as fontSize), not ratios. Left
 * unitless, `line-height: var(--ap-line-heights-font1-h1)` would read as
 * a 46x multiplier, not 46px -- and the SAME bare number lands inside
 * Tier 2's composite `font` shorthand too (`18px/28` means "28x
 * line-height", not 28px). Fixed at the BUILD level, not here:
 * build-tokens.js registers a custom `ap/lineheight/px` value transform
 * (see its "LINE HEIGHT UNIT FIX" header comment) that appends "px" to
 * every resolved lineHeight value, standalone AND inside typography
 * composites, so --ap-line-heights-* now carries "px" the same way
 * --ap-font-size-* always has. This manifest just records the cssVar
 * names either way, same as fontSize.
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
 *
 * FONT WEIGHT is structured differently from all of the above: rather
 * than a per-font scale, Tokens Studio has five separate raw groups --
 * two shared "choice pools" (fontWeights_choices_text,
 * fontWeights_choices_numbers) that font_weights_font_1/2/3 each
 * reference into. There's no meaningful "font1/font2/font3" simplified
 * label for the two choice pools, so the manifest (and the rendered
 * page) uses Tokens Studio's own raw group names verbatim as the display
 * label, per the source of truth rather than an invented one.
 *
 * Two build quirks specific to Font Weight, both left as-is (read
 * live, not special-cased) rather than "fixed" here:
 *  - font_weights_font_1/2/3 build to `--ap-font-weights-font-1-*`,
 *    `-font-2-`, `-font-3-` (HYPHENATED "font-1"), unlike fontSize/
 *    lineHeight's `-font1-`/`-font2-`/`-font3-` (no hyphen) -- an
 *    inconsistency in the token source naming, not something this script
 *    introduces.
 *  - fontWeights_choices_text.56_italic is the one token in this whole
 *    project whose $value ("56 Italic") sd-transforms splits into TWO
 *    separate CSS variables instead of one:
 *    --ap-font-weights-choices-text-56-italic-weight (56) and
 *    -56-italic-style (italic). Since this script extracts names
 *    generically from built CSS rather than hand-mapping tokens to
 *    variables, that split just falls out naturally as two adjacent
 *    cards ("56-italic-weight", "56-italic-style") -- no special case
 *    needed, and it stays correct if the transform's behavior here ever
 *    changes.
 *
 * FONT FAMILY is the simplest of the bunch: a flat fontFamilies.font1/
 * font2/font3 group, one CSS var each (--ap-font-families-font1/2/3),
 * same "font1/font2/font3" keys already used as the `font` selector
 * elsewhere on this page (FontSizeCard, LineHeightCard, etc.).
 *
 * COMPOSITE STYLES (Tier 2 Semantic Typography -- Display/Headline/
 * Title/Label/Body/Meta): unlike everything above, these live under
 * tier_2 in tokens.json, not tier_1, and are `$type: "typography"`
 * COMPOSITE tokens (fontFamily/fontWeight/lineHeight/fontSize/
 * letterSpacing/textCase/textDecoration bundled into one token) rather
 * than single-property scales. build-tokens.js's `typography/css/
 * shorthand` transform collapses each one into a single CSS `font`
 * shorthand custom property (e.g. `--ap-tier-2-typography-body-lg: 300
 * 18px/28 'TWK Lausanne';`) -- see build-tokens.js's header comment for
 * the full pros/cons of that "one-liner" approach vs. ap_ds_storybook's
 * SCSS-mixin-per-style approach, and for why letter-spacing/text-
 * transform/text-decoration need their own separate companion custom
 * properties (`--<token>-letter-spacing` etc., also built there) since
 * the CSS `font` shorthand structurally can't include them.
 *
 * This script only needs to enumerate the composite tokens' NAMES (same
 * "never values" rule as the rest of this manifest) grouped by style
 * family (display/headline/title/label/body/meta) and ordered by size
 * within each family -- CompositeStyleCard.jsx derives the three
 * companion var names from the shorthand var's name at render time
 * (`${cssVar}-letter-spacing` etc.) rather than this manifest storing
 * them separately, since they're always a fixed suffix away.
 *
 * Like fontSize/lineHeight/fontFamily (and unlike Font Weight), Green/
 * Gold's composite styles are a full-scale replacement, not a per-item
 * diff: confirmed against the built CSS that tier_1_green/tier_1_gold's
 * font_weights_font_1 AND fontFamilies both differ from Core for every
 * composite style that references them (which is all of them), so no
 * composite-style item ever coincidentally matches Core the way some
 * individual Font Weight values do. That means there's nothing to filter
 * -- CompositeStyles.jsx is reused completely unchanged for Green/Gold,
 * same pattern as FontSizeScale/LineHeightScale/FontFamilyScale, just
 * pinned to the theme global.
 *
 * ---------------------------------------------------------------------
 * GREEN TIER 1 / GOLD TIER 1: tokens.json's tier_1_green/tier_1_gold
 * override fontSize, lineHeights, fontFamilies, and font_weights_font_1/
 * 2/3 (confirmed: NOT fontWeights_choices_text/_numbers, letterSpacing,
 * or textCase/textDecoration -- those are identical to Core in every
 * theme, so they get no Green/Gold page at all). But the SHAPE of each
 * override differs, which is why some properties reuse the Core scale
 * outright while Font Weight needs actual per-item diffing:
 *
 *  - fontSize/lineHeight: green/gold only override each font's
 *    headingScale/bodyTextScale (plus a redundant h1) -- but every
 *    step's formula is base * scale^n, so that cascades to change EVERY
 *    step. Confirmed against the built CSS: full-scale difference, no
 *    step left unchanged. So TypographyGreen/Gold.stories.jsx just
 *    reuse FontSizeScale/LineHeightScale completely unchanged, pinned
 *    to the theme global -- there's nothing to filter, the "diff" IS
 *    the whole scale.
 *  - fontFamilies: only 3 tokens total, and all 3 differ in every
 *    theme (core: TWK Lausanne/TWK Continental/Novela; green AND gold:
 *    both resolve to Basier Circle/Basier Square/Basier Square Mono) --
 *    same "full replacement" shape as fontSize/lineHeight, so
 *    FontFamilyScale is reused unchanged too.
 *  - font_weights_font_1/2/3: NOT a formula scale -- each key is an
 *    independent literal value, so unlike the above, some values
 *    coincidentally match Core (e.g. font_1/font_2's "bold" is 700 in
 *    every theme) while others don't, AND green/gold each add three
 *    brand-new keys Core doesn't have at all (medium/thin/heavy).
 *    That's a real per-item diff, so this manifest computes
 *    fontWeightThemeDiffs.{green,gold} the same way generate-color-
 *    manifest.js's buildTier2ThemeDiff does: diff each theme's built CSS
 *    value against Core's for every font_weights_font_* var (not the
 *    two choice pools, which never change), keep only the ones that
 *    differ (including brand-new ones, where Core simply has no value
 *    to compare against), and drop any group left with zero items
 *    (fontWeights_choices_text/_numbers always end up empty this way,
 *    since nothing in them ever changes). FontWeightScale.jsx takes an
 *    optional `groups` prop so the Green/Gold pages can pass this
 *    filtered list through the exact same component instead of the
 *    full manifest.fontWeight.
 * ============================================================================
 */

import fs from "node:fs";

const CORE_CSS_PATH = "build/tier_1_core/css/variables.css";
const THEME_CSS_PATHS = {
	green: "build/tier_1_green/css/variables.css",
	gold: "build/tier_1_gold/css/variables.css",
};
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

function parseCssVarValues(cssText) {
	const map = new Map();
	varRe.lastIndex = 0;
	let match;
	while ((match = varRe.exec(cssText))) {
		map.set(match[1], match[2].trim());
	}
	return map;
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

function buildFontFamilyScale(allNames) {
	return buildScale(allNames, "--ap-font-families-");
}

// Display order matches the Tokens Studio panel: the two shared choice
// pools first, then the three per-font groups that reference into them.
const FONT_WEIGHT_GROUPS = [
	{ groupName: "fontWeights_choices_text", prefix: "--ap-font-weights-choices-text-" },
	{ groupName: "fontWeights_choices_numbers", prefix: "--ap-font-weights-choices-numbers-" },
	{ groupName: "font_weights_font_1", prefix: "--ap-font-weights-font-1-" },
	{ groupName: "font_weights_font_2", prefix: "--ap-font-weights-font-2-" },
	{ groupName: "font_weights_font_3", prefix: "--ap-font-weights-font-3-" },
];

function buildFontWeightGroups(allNames) {
	return FONT_WEIGHT_GROUPS.map(({ groupName, prefix }) => ({
		groupName,
		items: buildScale(allNames, prefix),
	}));
}

// Per-theme Font Weight diff: only the items whose live value actually
// differs from Core (a brand-new key Core doesn't define at all counts
// as differing too -- coreValues.get(...) is undefined, which never
// equals a real string). Groups left with nothing that differs are
// dropped entirely, same as generate-color-manifest.js's
// buildTier2ThemeDiff drops empty grids.
function buildFontWeightThemeDiff(coreValues, themeCssPath) {
	if (!fs.existsSync(themeCssPath)) {
		console.warn(`  (skipping font-weight theme diff -- ${themeCssPath} not found)`);
		return null;
	}
	const themeValues = parseCssVarValues(fs.readFileSync(themeCssPath, "utf-8"));
	const themeNames = Array.from(themeValues.keys());
	return FONT_WEIGHT_GROUPS.map(({ groupName, prefix }) => ({
		groupName,
		items: buildScale(themeNames, prefix).filter(
			(item) => themeValues.get(item.cssVar) !== coreValues.get(item.cssVar),
		),
	})).filter((group) => group.items.length > 0);
}

// Tier 2 Semantic Typography's composite styles -- see COMPOSITE STYLES
// in the header comment. `--ap-tier-2-typography-<group>-<item>` (e.g.
// "body-lg", "meta-small") -- everything after the group's own name is
// the item key, so this splits only on the FIRST hyphen after the group
// name rather than blindly splitting the whole remainder on "-" (some
// item keys, like meta's "small", have no hyphen at all, but nothing
// here has a hyphenated group name to worry about either way). Companion
// vars (`-letter-spacing`/`-text-transform`/`-text-decoration`) are
// excluded here -- they're a fixed suffix CompositeStyleCard.jsx derives
// from the shorthand var itself, not a separate manifest entry.
const COMPOSITE_PREFIX = "--ap-tier-2-typography-";
const COMPOSITE_GROUP_ORDER = ["display", "headline", "title", "label", "body", "meta"];
const COMPOSITE_ITEM_ORDER = ["lg", "default", "sm", "xs", "small"];
const COMPOSITE_COMPANION_SUFFIXES = ["-letter-spacing", "-text-transform", "-text-decoration"];

function buildCompositeStyles(allNames) {
	const byGroup = new Map();
	for (const cssVar of allNames) {
		if (!cssVar.startsWith(COMPOSITE_PREFIX)) continue;
		if (COMPOSITE_COMPANION_SUFFIXES.some((suffix) => cssVar.endsWith(suffix))) continue;
		const rest = cssVar.slice(COMPOSITE_PREFIX.length); // e.g. "body-lg", "meta-small"
		const dashIndex = rest.indexOf("-");
		const group = dashIndex === -1 ? rest : rest.slice(0, dashIndex);
		const item = dashIndex === -1 ? "default" : rest.slice(dashIndex + 1);
		if (!byGroup.has(group)) byGroup.set(group, []);
		byGroup.get(group).push({ key: item, cssVar });
	}
	const orderedGroups = [...COMPOSITE_GROUP_ORDER, ...Array.from(byGroup.keys()).filter((g) => !COMPOSITE_GROUP_ORDER.includes(g))];
	return orderedGroups
		.filter((group) => byGroup.has(group))
		.map((group) => ({
			groupName: group,
			items: byGroup.get(group).sort((a, b) => {
				const ai = COMPOSITE_ITEM_ORDER.indexOf(a.key);
				const bi = COMPOSITE_ITEM_ORDER.indexOf(b.key);
				return (ai === -1 ? COMPOSITE_ITEM_ORDER.length : ai) - (bi === -1 ? COMPOSITE_ITEM_ORDER.length : bi);
			}),
		}));
}

const allNames = parseCssVarNames(fs.readFileSync(CORE_CSS_PATH, "utf-8"));
const coreValues = parseCssVarValues(fs.readFileSync(CORE_CSS_PATH, "utf-8"));

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
	fontWeight: buildFontWeightGroups(allNames),
	fontFamily: buildFontFamilyScale(allNames),
	fontWeightThemeDiffs: {
		green: buildFontWeightThemeDiff(coreValues, THEME_CSS_PATHS.green),
		gold: buildFontWeightThemeDiff(coreValues, THEME_CSS_PATHS.gold),
	},
	compositeStyles: buildCompositeStyles(allNames),
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n");
const fontWeightDiffCounts = Object.entries(manifest.fontWeightThemeDiffs)
	.map(([theme, groups]) => `${theme}=${groups ? groups.reduce((n, g) => n + g.items.length, 0) : "n/a"}`)
	.join(", ");
console.log(
	`✔︎ ${OUT_PATH} (font-size steps -- font1: ${manifest.fontSize.font1.length}, font2: ${manifest.fontSize.font2.length}, font3: ${manifest.fontSize.font3.length}; ` +
		`line-height steps -- font1: ${manifest.lineHeight.font1.length}, font2: ${manifest.lineHeight.font2.length}, font3: ${manifest.lineHeight.font3.length}; ` +
		`letter-spacing steps: ${manifest.letterSpacing.length}; ` +
		`font-weight groups -- ${manifest.fontWeight.map((g) => `${g.groupName}: ${g.items.length}`).join(", ")}; ` +
		`font-family steps: ${manifest.fontFamily.length}; ` +
		`font-weight theme diffs: ${fontWeightDiffCounts}; ` +
		`composite styles -- ${manifest.compositeStyles.map((g) => `${g.groupName}: ${g.items.length}`).join(", ")})`,
);
