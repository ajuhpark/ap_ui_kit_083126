import { makeTier1ColorStories } from "./tier1ColorStories.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 3. Gold Tier 1 > Color
 *
 * Only shows Brand -- same reasoning as ColorGreen.stories.jsx (confirmed
 * via tokens/sets/tier_1_gold.json: "brand" is the only key gold's `color`
 * object overrides).
 */
export default {
	title: "Tokens/Tier 1: Definitions/3. Gold Tier 1/Color",
	parameters: { layout: "padded" },
};

const stories = makeTier1ColorStories("gold");

export const Brand = stories.Brand;
