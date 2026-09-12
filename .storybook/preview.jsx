import React from "react";
import "../assets/fonts/novela/novela.css";
import "../build/all-combinations/css/variables.css";
import { TokenPreviewContext } from "../components/TokenPreviewContext.jsx";

/**
 * ap_ui_kit has TWO independent toggleable dimensions (ap_ds_storybook only
 * has one, Theme) -- see build-tokens.js. build/all-combinations/css/
 * variables.css has one block per (theme, viewport) pair -- 9 total --
 * each scoped by a COMPOUND selector (`[data-theme="green"][data-viewport
 * ="mobile"]`, etc.), so an element matches exactly one block whenever
 * BOTH attributes are present on it. Every token in the project (color,
 * border, typography, everything) lives inside one of these 9 blocks now
 * -- there's no more single-axis `[data-theme="green"]`-only or
 * `[data-viewport="mobile"]`-only fallback -- so `data-viewport` must
 * always be present wherever `data-theme` is, or NOTHING resolves there.
 *
 * NOTE: Theme's toolbar dropdown is deliberately NOT exposed -- its
 * Green/Gold options are redundant with the dedicated "Tier 1 - Green"/
 * "Tier 1 - Gold"/"Tier 2 - Green"/"Tier 2 - Gold" sidebar pages (each pins
 * its own `globals: {theme}` on the story object, which works with or
 * without a toolbar UI for it).
 *
 * There is deliberately NO toolbar/global for viewport at all. An earlier
 * version of this file exposed one (as a `deviceScale` global, named to
 * avoid colliding with Storybook's own reserved "viewport" global/addon --
 * see git history if that collision needs revisiting for something else
 * later). It was removed because a Storybook-wide toolbar control is the
 * wrong shape for this: viewport only ever affects Font Size and Line
 * Height -- Color, Border, Letter Spacing, Font Weight, and Font Family
 * never read a viewport-scoped token -- so a global toggle would show up
 * doing nothing on every other page in the project. Font Size and Line
 * Height now carry their OWN local Mobile/Tablet/Desktop toggle instead
 * (see ViewportPreviewPanel.jsx), scoped to exactly the two pages where it
 * matters. `data-viewport` below is fixed at "desktop" -- every OTHER
 * token type resolves identically no matter which viewport is active (the
 * viewport sets only ever redirect fontSize/lineHeights' headingScale/
 * bodyTextScale aliases), so "desktop" here is just a stable default for
 * everything outside those two pages; ViewportPreviewPanel overrides it
 * locally for its own subtree via a nested TokenPreviewContext.Provider,
 * independent of this fixed value.
 */
const withTokenAttributes = (Story, context) => {
	const { theme } = context.globals;
	const viewport = "desktop";
	return (
		<TokenPreviewContext.Provider value={{ theme, viewport }}>
			<div data-theme={theme} data-viewport={viewport} style={{ padding: "1.5rem" }}>
				<Story />
			</div>
		</TokenPreviewContext.Provider>
	);
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
	// Project-wide "autodocs" tag -- same as ap_ds_storybook's
	// .storybook/preview.jsx. main.js's default docs.autodocs setting
	// ("tag") only auto-generates a "Docs" sidebar entry for stories
	// carrying this tag; setting it once here at the top level applies it
	// to every story in the project (current and future) instead of
	// adding it file by file.
	tags: ["autodocs"],
	decorators: [withTokenAttributes],
	globalTypes: {
		theme: {
			name: "Theme",
			description: "Color theme (tier_1_core / tier_1_green / tier_1_gold)",
		},
	},
	initialGlobals: {
		theme: "core",
	},
	parameters: {
		// Hides Storybook's own built-in device-preview toolbar tool (the
		// "Small mobile" / W x H control) -- a core Storybook feature,
		// unrelated to anything of ours, present in ap_ds_storybook too
		// (neither project installs @storybook/addon-viewport or otherwise
		// configures it beyond this). Disabling it here removes the whole
		// control from the toolbar so its selection can't drift from
		// browser to browser via localStorage.
		viewport: {
			disable: true,
		},
		options: {
			storySort: {
				// Mirrors Tier 1's own tree: Core first, then the two themes
				// as their own pinned-theme pages -- for BOTH Tier 1:
				// Definitions and Tier 2: Semantic. Tier 2 originally had no
				// "Core" entry (only Green Tier 2/Gold Tier 2 existed,
				// mirroring ap_ds_storybook not having a "Core Tier 2"), but
				// that left the full, undiffed semantic list with nowhere to
				// render -- Core is the base every theme diffs against, so
				// it needs a page here just like Tier 1's does.
				order: [
					"Tokens",
					[
						"Tier 1: Definitions",
						["Tier 1 - Core", "Tier 1 - Green", "Tier 1 - Gold"],
						"Tier 2: Semantic",
						["Tier 2 - Core", "Tier 2 - Green", "Tier 2 - Gold"],
					],
				],
			},
		},
	},
};

export default preview;
