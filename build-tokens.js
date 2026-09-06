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
 * IMPORTANT ARCHITECTURE CAVEAT (see project doc for more):
 * tier_1_green/tier_1_gold each carry their OWN copy of the per-viewport
 * fontSize/lineHeights scale constants (e.g. green's desktop heading scale
 * is 1.5, core's is 1.25, gold's is 1.4) -- meaning "theme" and "viewport"
 * are not fully independent axes at the data level. This script builds
 * each dimension standalone against a sensible default for the other
 * (themes build against the implicit mobile-first default baked into
 * tier_1_core; viewports build against the "core" theme). If a page needs
 * BOTH a non-core theme AND a non-mobile viewport active simultaneously,
 * these two bundles alone won't combine correctly -- that needs a real
 * cross-product build (core|green|gold) x (mobile|tablet|desktop), which
 * hasn't been built yet pending confirmation this is actually needed.
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
 * 2) Add an entry below with its build name, source set(s), and selector
 * That's it -- no other file needs to change.
 */
// `name` doubles as the build folder name (build/<name>/...) -- kept
// matching the exact Token Studio set names so the output folders are
// recognizable against the sets list in Token Studio. `selector` is the
// runtime CSS attribute value instead (kept short/clean for actually
// writing `data-theme="green"` in markup) -- separate on purpose, change
// it too if you'd rather the attribute values matched the set names.
const THEMES = [
	{ name: "tier_1_core", sets: [], selector: ":root" },
	{ name: "tier_1_green", sets: ["tier_1_green"], selector: '[data-theme="green"]' },
	{ name: "tier_1_gold", sets: ["tier_1_gold"], selector: '[data-theme="gold"]' },
];

const VIEWPORTS = [
	{ name: "viewport_mobile", sets: ["viewport_mobile"], selector: ":root" },
	{ name: "viewport_tablet", sets: ["viewport_tablet"], selector: '[data-viewport="tablet"]' },
	{ name: "viewport_desktop", sets: ["viewport_desktop"], selector: '[data-viewport="desktop"]' },
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
// the gold theme, build/gold/css/variables.css is a complete, self-
// contained set of variables).
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
// PASS 2: combined, selector-scoped bundles -- one file per dimension, each
// theme/viewport rebuilt a second time scoped to its own selector instead
// of :root, then concatenated. This is what you actually import at runtime
// to get on/off switching via `data-theme` / `data-viewport` attributes.
// ============================================================================
async function buildBundle(items, bundleName, attrName) {
	console.log(`\n=== Building bundle: ${bundleName} ===`);
	const bundleDir = `build/${bundleName}/css`;
	fs.mkdirSync(bundleDir, { recursive: true });

	const chunks = [];
	for (const item of items) {
		const sources = [...BASE_SOURCE, ...item.sets.map(writeSet)];
		const tempDestination = `_temp-${item.name}.css`;
		await build(sources, `${bundleDir}/`, tempDestination, item.selector);
		const tempPath = `${bundleDir}/${tempDestination}`;
		chunks.push(fs.readFileSync(tempPath, "utf-8"));
		fs.rmSync(tempPath);
	}

	fs.writeFileSync(`${bundleDir}/variables.css`, chunks.join("\n\n"));
	console.log(`✔︎ ${bundleDir}/variables.css (combined, ${attrName}-scoped)`);
}

await buildBundle(THEMES, "all-themes", "data-theme");
await buildBundle(VIEWPORTS, "all-viewports", "data-viewport");

console.log("\nBuild complete.");
