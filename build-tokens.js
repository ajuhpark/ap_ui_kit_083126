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
 * ============================================================================
 */

import fs from "node:fs";
import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";

register(StyleDictionary);

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
 */
async function build(sourceFiles, buildPath, destination, selector) {
	const sd = new StyleDictionary({
		log: { warnings: "disabled" },
		source: sourceFiles,
		preprocessors: ["tokens-studio"],
		platforms: {
			css: {
				transformGroup: "tokens-studio",
				transforms: ["name/kebab"],
				prefix: "ap",
				buildPath,
				options: { selector },
				files: [{ destination, format: "css/variables" }],
			},
		},
	});
	await sd.cleanAllPlatforms();
	await sd.buildAllPlatforms();
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
