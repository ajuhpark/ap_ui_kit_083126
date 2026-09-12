/**
 * ============================================================================
 * build-tokens.js
 * ============================================================================
 * Mirrors ap_ds_storybook's build-tokens.js pattern (per-flavor build +
 * a combined, selector-scoped bundle for runtime on/off switching), but
 * extended to TWO independent toggleable dimensions instead of one:
 *
 *   THEMES:    core / green / gold        -> [data-theme="..."]
 *   VIEWPORTS: mobile / tablet / desktop  -> [data-viewport="..."]
 *
 * ap_ds_storybook doesn't have a viewport dimension -- that's new here.
 * Viewport is treated exactly like a theme: its own standalone build per
 * option, plus a combined bundle scoped by a data attribute so it can be
 * turned on/off at runtime the same way [data-theme] works.
 *
 * PIPELINE NOTE: this reads tokens.json directly and does NOT run
 * `npx token-transformer`. token-transformer's own output format was found
 * to double-wrap every $type/$value into `{ value, type }` objects (a bug
 * in token-transformer itself, confirmed absent from the raw tokens.json),
 * which broke every resolved value in the CSS/JS output. Style Dictionary's
 * own `source` array already does the set-merging token-transformer was
 * used for, without that corruption -- see the project doc's
 * "Debugging findings" section for the full story.
 *
 * THEME x VIEWPORT CROSS-PRODUCT (see project doc for more):
 * tier_1_green/tier_1_gold each carry their OWN complete copy of
 * fontSize/lineHeights' `desktop`/`tablet`/`mobile` sub-scales (e.g.
 * green's desktop heading scale is 1.5, core's is 1.25, gold's is 1.4) --
 * "theme" and "viewport" are NOT independent axes at the data level. Each
 * theme's top-level `font1.headingScale` (etc.) is just an alias to
 * `{fontSize.desktop.font1.headingScale}` by default; the viewport_mobile/
 * tablet/desktop sets each redirect that SAME alias to that theme's own
 * `mobile`/`tablet`/`desktop` sub-scale instead. So layering a theme's set
 * THEN a viewport's set (in that order -- see COMBINATIONS below) resolves
 * the alias against that theme's own re-defined breakpoint scale, not
 * core's -- e.g. green + mobile correctly resolves to green's mobile
 * headingScale (1.25), giving h1 = 16 x 1.25^4 ~= 39, distinct from both
 * green's own desktop value (81) and core's mobile value (28).
 *
 * An earlier version of this script built THEMES and VIEWPORTS as two
 * fully independent single-axis bundles (all-themes.css / all-viewports
 * .css), each defaulting the OTHER axis to a fixed value (themes always
 * built against core's viewport defaults; viewports always built against
 * core's theme) -- meaning a page with both a non-core theme AND a
 * non-desktop viewport active would silently show the wrong numbers,
 * because neither bundle ever combined the two. COMBINATIONS below fixes
 * this by building the full 3x3 cross-product directly, each block scoped
 * by a COMPOUND selector (`[data-theme="..."][data-viewport="..."]`) so
 * every one of the 9 theme/viewport pairs gets its own real, correct
 * values with no ambiguity or cascade-order dependence between blocks --
 * each compound selector only matches its own exact (theme, viewport)
 * attribute pair, so unlike two `:root`-scoped rules layered from
 * different files, there's nothing for two rules to collide over.
 *
 * TIER 2 SEMANTIC TYPOGRAPHY -- COMPANION CUSTOM PROPERTIES:
 * Every `tier_2_typography` composite token (Display/Headline/Title/
 * Label/Body/Meta) collapses to a single CSS `font` shorthand custom
 * property via @tokens-studio/sd-transforms' `typography/css/shorthand`
 * transform (part of the `tokens-studio` transformGroup) -- e.g.
 * `--ap-tier-2-typography-body-lg: 300 18px/28px 'TWK Lausanne';`. That
 * shorthand can only ever express font-style/variant/weight/stretch/
 * size/line-height/family -- letterSpacing, textCase, and textDecoration
 * are STRUCTURALLY IMPOSSIBLE to fold into the CSS `font` shorthand (a
 * spec limitation, not a tooling gap -- see the project doc's "Composite
 * typography styles" section for the full pros/cons comparison against
 * ap_ds_storybook's SCSS-mixin approach, which sets each property as its
 * own declaration and therefore doesn't have this limitation).
 *
 * Rather than switch to mixins, each `build()` call below runs a SECOND,
 * separate Style Dictionary pass over the exact same source files and
 * selector, using every `tokens-studio` transform EXCEPT
 * `typography/css/shorthand` -- so each composite token's resolved value
 * stays the full {fontFamily, fontWeight, lineHeight, fontSize,
 * letterSpacing, textCase, textDecoration} object for one extra format
 * (`css/typography-companion`, registered below) to pull just those
 * three otherwise-lost properties out as their own companion custom
 * properties (`--<token>-letter-spacing`, `-text-transform`,
 * `-text-decoration`), appended into the SAME destination file right
 * after the shorthand vars. Consumers use both together, e.g.:
 *   font: var(--ap-tier-2-typography-body-lg);
 *   letter-spacing: var(--ap-tier-2-typography-body-lg-letter-spacing);
 *   text-transform: var(--ap-tier-2-typography-body-lg-text-transform);
 *   text-decoration: var(--ap-tier-2-typography-body-lg-text-decoration);
 * This keeps the one-liner shorthand for the properties it CAN express
 * (still far more compact than a mixin per style) while completing the
 * composite definition for the three it can't.
 *
 * LINE HEIGHT UNIT FIX:
 * @tokens-studio/sd-transforms' `ts/size/lineheight` transform treats
 * lineHeight tokens as a CSS-native unitless ratio (e.g. `1.5`, meaning
 * "1.5x the font size") and deliberately leaves plain numbers unitless --
 * correct for THAT convention, but this project's `lineHeights.*` tokens
 * are actually absolute pixel leading values computed by the same
 * base*scale^n formula as fontSize (e.g. 46, meaning 46px, not "46x the
 * font size"). Left as-is, that reads as a wildly wrong line-height
 * everywhere it's used raw -- including inside the Tier 2 composite
 * `font` shorthand above, e.g. `18px/28` is CSS for "18px text, 28x
 * line-height" (~504px of leading) rather than the intended 28px.
 * `ap/lineheight/px` (registered below) is a custom value transform,
 * inserted immediately after `ts/size/lineheight` in the transform list,
 * that appends "px" to any already-resolved bare-number lineHeight value
 * -- for both standalone `lineHeights.*` tokens (their own `$type`
 * resolves to the singular "lineHeight" by the time transforms run, not
 * the plural "lineHeights" tokens.json uses -- the tokens-studio
 * preprocessor normalizes DTCG type names) and for the `lineHeight`
 * sub-field of `typography`-composite tokens (Tier 1's font1/font2/font3
 * heading composites and Tier 2's semantic composites alike), fixing the
 * shorthand's embedded value too. Needs an explicit `transforms` array
 * (built from the `tokens-studio` group's own list, see MAIN_TRANSFORMS
 * below) rather than `transformGroup: "tokens-studio"` plus an appended
 * extra, since inserting a transform in the MIDDLE of the group's order
 * -- after size resolution, before the shorthand composer packs
 * everything into one string -- isn't possible by appending alone.
 * ============================================================================
 */

import fs from "node:fs";
import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";

register(StyleDictionary);

// Appends "px" to an already-resolved, unitless numeric lineHeight value --
// see the LINE HEIGHT UNIT FIX header comment above for why this is needed
// and why it can't just be `ts/size/lineheight` itself (that transform's
// job, per its own semantics, is to treat unitless numbers as CSS's ratio
// convention and leave them alone). `transitive: true` is required here:
// Style Dictionary only runs a value transform on a token whose ORIGINAL
// (pre-resolution) $value still contained `{alias}` syntax -- true for
// every one of these formula-driven lineHeight tokens -- if that
// transform is marked transitive, matching how `ts/size/lineheight`
// itself and the other size/shorthand transforms in this pipeline behave.
StyleDictionary.registerTransform({
	name: "ap/lineheight/px",
	type: "value",
	transitive: true,
	filter: (token) =>
		token.$type === "lineHeight" ||
		(token.$type === "typography" && token.$value && typeof token.$value === "object"),
	transform: (token) => {
		const toPx = (v) => {
			if (v === undefined || v === null) return v;
			if (typeof v === "number") return `${v}px`;
			if (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v.trim())) return `${v.trim()}px`;
			return v; // already has a unit (or isn't a bare number) -- leave alone
		};
		if (token.$type === "lineHeight") {
			return toPx(token.$value);
		}
		return { ...token.$value, lineHeight: toPx(token.$value.lineHeight) };
	},
});

// Emits ONLY the three companion properties for tier_2_typography composite
// tokens (Tier 1's font1/font2/font3 composite tokens exist in the data too
// but aren't surfaced as their own Storybook page yet, so there's nothing
// that would consume companion vars for them -- scoped to tier_2_typography
// on purpose, not a limitation of this format itself).
StyleDictionary.registerFormat({
	name: "css/typography-companion",
	format: ({ dictionary, options }) => {
		const lines = dictionary.allTokens
			.filter(
				(t) =>
					t.attributes?.category === "tier_2_typography" &&
					t.$type === "typography" &&
					t.$value &&
					typeof t.$value === "object",
			)
			.flatMap((t) => {
				const { letterSpacing, textCase, textDecoration } = t.$value;
				return [
					`  --${t.name}-letter-spacing: ${letterSpacing};`,
					`  --${t.name}-text-transform: ${textCase};`,
					`  --${t.name}-text-decoration: ${textDecoration};`,
				];
			});
		if (lines.length === 0) return "";
		return `${options.selector ?? ":root"} {\n${lines.join("\n")}\n}\n`;
	},
});

// Same transform list `transformGroup: "tokens-studio"` expands to, with
// `ap/lineheight/px` inserted right after `ts/size/lineheight` (see LINE
// HEIGHT UNIT FIX above) -- this is the shared base both real transform
// lists below build from.
const TS_GROUP_TRANSFORMS = StyleDictionary.hooks.transformGroups["tokens-studio"];
const LINEHEIGHT_PX_INSERT_AT = TS_GROUP_TRANSFORMS.indexOf("ts/size/lineheight") + 1;
const BASE_TRANSFORMS = [
	...TS_GROUP_TRANSFORMS.slice(0, LINEHEIGHT_PX_INSERT_AT),
	"ap/lineheight/px",
	...TS_GROUP_TRANSFORMS.slice(LINEHEIGHT_PX_INSERT_AT),
];

// The main build's transform list: BASE_TRANSFORMS (group + lineheight-px
// fix) with `name/kebab` appended again at the end -- the group already
// runs `name/kebab` then `name/camel` in that order, so re-appending
// `name/kebab` here makes it the last transform of the "name" type to
// run, and names come out kebab-case (matching the old
// `transformGroup: "tokens-studio", transforms: ["name/kebab"]` config's
// actual behavior -- SD appends an explicit `transforms` array onto an
// expanded `transformGroup` rather than replacing it, confirmed against
// this project's own build output).
const MAIN_TRANSFORMS = [...BASE_TRANSFORMS, "name/kebab"];

// The companion-vars build's transform list: BASE_TRANSFORMS minus the
// shorthand-collapsing transform (see the TIER 2 SEMANTIC TYPOGRAPHY
// header comment) with `name/kebab` appended the same way.
const TYPOGRAPHY_PARTS_TRANSFORMS = [
	...BASE_TRANSFORMS.filter((t) => t !== "typography/css/shorthand"),
	"name/kebab",
];

const SETS_DIR = "tokens/sets";
const raw = JSON.parse(fs.readFileSync("tokens.json", "utf-8"));

fs.mkdirSync(SETS_DIR, { recursive: true });
function writeSet(name) {
	const dest = `${SETS_DIR}/${name}.json`;
	fs.writeFileSync(dest, JSON.stringify(raw[name] ?? {}, null, 2) + "\n");
	return dest;
}

// Always-present base: shared primitives + tier-2 usage tokens.
const BASE_SOURCE = [writeSet("tier_1_core"), writeSet("tier_2")];

/**
 * To add a new theme or viewport later:
 * 1) Confirm the matching Token Studio set name (must exist as a top-level
 *    key in tokens.json)
 * 2) Add an entry below with its build name, source set(s), attribute
 *    value, and standalone selector
 * That's it -- no other file needs to change; COMBINATIONS below derives
 * the cross-product automatically from these same two arrays.
 */
// `name` doubles as the build folder name (build/<name>/...) -- kept
// matching the exact Token Studio set names so the output folders are
// recognizable against the sets list in Token Studio. `attrValue` is the
// runtime attribute value (`data-theme="green"`, `data-viewport="mobile"`)
// -- separate from `name` on purpose, change it too if you'd rather the
// attribute values matched the set names. `selector` is only used for the
// PASS 1 standalone (single-axis, `:root`-scoped) builds below.
const THEMES = [
	{ name: "tier_1_core", sets: [], attrValue: "core", selector: ":root" },
	{ name: "tier_1_green", sets: ["tier_1_green"], attrValue: "green", selector: '[data-theme="green"]' },
	{ name: "tier_1_gold", sets: ["tier_1_gold"], attrValue: "gold", selector: '[data-theme="gold"]' },
];

const VIEWPORTS = [
	{ name: "viewport_mobile", sets: ["viewport_mobile"], attrValue: "mobile", selector: ":root" },
	{ name: "viewport_tablet", sets: ["viewport_tablet"], attrValue: "tablet", selector: '[data-viewport="tablet"]' },
	{ name: "viewport_desktop", sets: ["viewport_desktop"], attrValue: "desktop", selector: '[data-viewport="desktop"]' },
];

/**
 * Runs one Style Dictionary build. `selector` scopes the generated CSS
 * block (":root" for standalone/default builds, "[data-theme=...]" etc.
 * for entries going into a combined bundle) -- this is Style Dictionary's
 * own built-in `options.selector` support in the css/variables format, no
 * custom format needed.
 *
 * `log.warnings: "disabled"`: every theme/viewport file deliberately
 * overrides the same token paths tier_1_core defines (that's the whole
 * point of a theme -- same path, different value per theme/viewport).
 * Style Dictionary's collision detector flags any such override as a
 * "Token collision" regardless of whether it's an intentional 1-time
 * override or a genuine ambiguity. Verified this session (by diffing the
 * actual output values) that these are all real, correct, single overrides
 * -- e.g. green's color.brand.color_set_1 does correctly resolve to
 * green's color and not some blended/wrong value. Silencing this here
 * rather than per-collision, since it fires on every intentional override
 * by design. If a build ever merges the SAME dimension twice (e.g. both
 * viewport_tablet AND viewport_desktop into one build), that's a REAL bug
 * (ambiguous, last-one-silently-wins) rather than an expected override --
 * re-enable `warnings: "warn"` temporarily if you suspect that's happened.
 *
 * After the main shorthand build, runs the companion pass described in the
 * header comment (Tier 2 Semantic Typography's letter-spacing/text-
 * transform/text-decoration) over the SAME sourceFiles/selector, and
 * appends its output into the same destination file.
 */
async function build(sourceFiles, buildPath, destination, selector) {
	const sd = new StyleDictionary({
		log: { warnings: "disabled" },
		source: sourceFiles,
		preprocessors: ["tokens-studio"],
		platforms: {
			css: {
				transforms: MAIN_TRANSFORMS,
				prefix: "ap",
				buildPath,
				options: { selector },
				files: [{ destination, format: "css/variables" }],
			},
		},
	});
	await sd.cleanAllPlatforms();
	await sd.buildAllPlatforms();

	const companionDestination = `_companion-${destination}`;
	const companionSd = new StyleDictionary({
		log: { warnings: "disabled" },
		source: sourceFiles,
		preprocessors: ["tokens-studio"],
		platforms: {
			css: {
				transforms: TYPOGRAPHY_PARTS_TRANSFORMS,
				prefix: "ap",
				buildPath,
				options: { selector },
				files: [{ destination: companionDestination, format: "css/typography-companion" }],
			},
		},
	});
	await companionSd.cleanAllPlatforms();
	await companionSd.buildAllPlatforms();

	const mainPath = `${buildPath}${destination}`;
	const companionPath = `${buildPath}${companionDestination}`;
	if (fs.existsSync(companionPath)) {
		const companionContent = fs.readFileSync(companionPath, "utf-8");
		if (companionContent.trim().length > 0) {
			fs.appendFileSync(mainPath, "\n" + companionContent);
		}
		fs.rmSync(companionPath);
	}
}

// ============================================================================
// PASS 1: standalone builds -- one per theme, one per viewport, each scoped
// to :root so it's usable entirely on its own (e.g. if you only ever want
// the gold theme, build/tier_1_gold/css/variables.css is a complete,
// self-contained set of variables). Each one resolves the OTHER axis
// against its own implicit default (themes resolve viewport-affected
// tokens against their own `desktop` sub-scale; viewports resolve against
// core's theme) -- these are single-axis references, not the real
// cross-product (see COMBINATIONS below for that).
// ============================================================================
for (const theme of THEMES) {
	const sources = [...BASE_SOURCE, ...theme.sets.map(writeSet)];
	console.log(`\n=== Building theme: ${theme.name} ===`);
	await build(sources, `build/${theme.name}/css/`, "variables.css", ":root");
}

for (const vp of VIEWPORTS) {
	const sources = [...BASE_SOURCE, ...vp.sets.map(writeSet)];
	console.log(`\n=== Building viewport: ${vp.name} ===`);
	await build(sources, `build/${vp.name}/css/`, "variables.css", ":root");
}

// ============================================================================
// PASS 2: the real cross-product bundle -- every (theme, viewport) pair,
// each block scoped by a COMPOUND selector so it only ever matches that
// exact attribute pair on the themed wrapper div. Sources are layered
// theme-then-viewport so the viewport set's alias-redirect (which points
// at `{fontSize.<breakpoint>.fontN.headingScale}`) resolves against that
// THEME's own re-defined breakpoint sub-scale, not core's -- see the
// header comment above for why that ordering matters. This is what you
// actually import at runtime to get correct values no matter which theme
// and viewport are both active simultaneously.
// ============================================================================
async function buildCombinationsBundle() {
	console.log(`\n=== Building bundle: all-combinations ===`);
	const bundleDir = `build/all-combinations/css`;
	fs.mkdirSync(bundleDir, { recursive: true });

	const chunks = [];
	for (const theme of THEMES) {
		for (const vp of VIEWPORTS) {
			const sources = [...BASE_SOURCE, ...theme.sets.map(writeSet), ...vp.sets.map(writeSet)];
			const selector = `[data-theme="${theme.attrValue}"][data-viewport="${vp.attrValue}"]`;
			const tempDestination = `_temp-${theme.name}-${vp.name}.css`;
			await build(sources, `${bundleDir}/`, tempDestination, selector);
			const tempPath = `${bundleDir}/${tempDestination}`;
			chunks.push(fs.readFileSync(tempPath, "utf-8"));
			fs.rmSync(tempPath);
		}
	}

	fs.writeFileSync(`${bundleDir}/variables.css`, chunks.join("\n\n"));
	console.log(
		`✔︎ ${bundleDir}/variables.css (combined, [data-theme][data-viewport]-scoped, ${THEMES.length}x${VIEWPORTS.length}=${THEMES.length * VIEWPORTS.length} combinations)`,
	);
}

await buildCombinationsBundle();

console.log("\nBuild complete.");
