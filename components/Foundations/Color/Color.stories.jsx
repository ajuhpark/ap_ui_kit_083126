import { makeTier1ColorStories } from "./tier1ColorStories.jsx";

/**
 * Core contains the complete set of Tier 1 color tokens. Green Tier 1
 * and Gold Tier 1 only contain the tokens that differ from Core.
 */
export default {
	title: "Tokens/Tier 1: Definitions/Tier 1 - Core/Color",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Live-computed color tokens for the Core theme. See 'Tier 1 - Green' / 'Tier 1 - Gold' for the same tokens pinned to those themes, or use the Theme toolbar dropdown to compare on this page directly.",
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
