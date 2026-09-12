import { makeTier1ColorStories } from "./tier1ColorStories.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 1. Core > Color
 * Mirrors ap_ds_storybook's "Tier 1: Definitions / 1. Core" nav structure.
 * See tier1ColorStories.jsx for what actually renders and why.
 *
 * Data Viz is its own page here (split out of Color Palettes) -- like
 * Utility/Neutral/Transparent, it's identical across all three themes, so
 * it only needs to exist on this Core page, not duplicated onto Green/Gold
 * Tier 1 (which only ever show "Brand" -- see ColorGreen.stories.jsx /
 * ColorGold.stories.jsx).
 */
export default {
	title: "Tokens/Tier 1: Definitions/1. Core/Color",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Live-computed color tokens for the Core theme. See '2. Green Tier 1' / '3. Gold Tier 1' for the same tokens pinned to those themes, or use the Theme toolbar dropdown to compare on this page directly.",
			},
		},
	},
};

const stories = makeTier1ColorStories("core");

export const ColorPalettes = stories.ColorPalettes;
export const DataViz = stories.DataViz;
export const Utility = stories.Utility;
export const Brand = stories.Brand;
export const Neutral = stories.Neutral;
export const Transparent = stories.Transparent;
