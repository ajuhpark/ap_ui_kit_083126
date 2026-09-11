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
 * NOTE (see build-tokens.js's architecture caveat): viewport tokens only
 * ever touch fontSize/lineHeights, never color -- so on Color Foundations
 * pages the Viewport dropdown is a deliberate no-op, exactly like
 * ap_ds_storybook's own readouts/theme toolbar is a no-op outside
 * Foundations. It's still wired globally now so Typography/Spacing
 * Foundations pages can use it later without touching this file again.
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
			toolbar: {
				icon: "paintbrush",
				items: [
					{ value: "core", title: "Core" },
					{ value: "green", title: "Green" },
					{ value: "gold", title: "Gold" },
				],
				dynamicTitle: true,
			},
		},
		viewport: {
			name: "Viewport",
			description: "Viewport scale (mobile / tablet / desktop)",
			toolbar: {
				icon: "grow",
				items: [
					{ value: "mobile", title: "Mobile" },
					{ value: "tablet", title: "Tablet" },
					{ value: "desktop", title: "Desktop" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "core",
		viewport: "mobile",
	},
	parameters: {
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
