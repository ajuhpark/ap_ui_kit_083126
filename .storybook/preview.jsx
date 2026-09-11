import React from "react";
import "../build/all-themes/css/variables.css";
import "../build/all-viewports/css/variables.css";
import { TokenPreviewContext } from "../components/TokenPreviewContext.jsx";

/**
 * ap_ui_kit has TWO independent toggleable dimensions (ap_ds_storybook only
 * has one, Theme) -- see build-tokens.js. Both bundles above are scoped by
 * data attribute ([data-theme="..."], [data-viewport="..."]) so they can be
 * switched on the fly the same way ap_ds_storybook's [data-theme] works.
 *
 * NOTE: the Theme and Viewport toolbar dropdowns are deliberately NOT
 * exposed right now (see globalTypes below) -- Theme's Green/Gold options
 * are redundant with the dedicated "Green Tier 1"/"Gold Tier 1"/"Green Tier
 * 2"/"Gold Tier 2" sidebar pages (each pins its own `globals: {theme}` on
 * the story object, which works with or without a toolbar UI for it), and
 * Viewport tokens only ever touch fontSize/lineHeights, never color, so
 * it's a no-op on every page that currently exists. `initialGlobals` below
 * still sets both to a fixed default and withTokenAttributes still reads
 * them, so nothing about the data-theme/data-viewport wiring changes --
 * only the toolbar UI is hidden. Re-add a `toolbar` block to either
 * globalType below to bring the dropdown back (e.g. once Typography/
 * Spacing Foundations pages need live Viewport switching).
 *
 * Separately, `parameters.viewport.disable` below turns off Storybook's
 * own BUILT-IN device-preview toolbar tool (the "Small mobile" / W x H
 * control) -- a core Storybook feature, unrelated to the `viewport`
 * globalType above and present in ap_ds_storybook too (neither project
 * installs @storybook/addon-viewport or configures this parameter).
 * Disabling it here removes the whole control from the toolbar so its
 * selection can't drift from browser to browser via localStorage.
 */
const withTokenAttributes = (Story, context) => {
	const { theme, viewport } = context.globals;
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
		viewport: {
			name: "Viewport",
			description: "Viewport scale (mobile / tablet / desktop)",
		},
	},
	initialGlobals: {
		theme: "core",
		viewport: "mobile",
	},
	parameters: {
		// Hides Storybook's own built-in device-preview toolbar tool -- see
		// the note above withTokenAttributes for why this is separate from
		// the (already-hidden) `viewport` globalType above.
		viewport: {
			disable: true,
		},
		options: {
			storySort: {
				// Mirrors ap_ds_storybook's sidebar tree: Tier 1: Definitions
				// (Core first, then the two themes as their own pinned-theme
				// pages), then Tier 2: Semantic (theme-pinned pages only --
				// no separate "Core" entry, same as ap_ds_storybook not
				// having a "Core Tier 2").
				order: [
					"Tokens",
					[
						"Tier 1: Definitions",
						["1. Core", "2. Green Tier 1", "3. Gold Tier 1"],
						"Tier 2: Semantic",
						["Green Tier 2", "Gold Tier 2"],
					],
				],
			},
		},
	},
};

export default preview;
