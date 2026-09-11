import { makeTier1ColorStories } from "./tier1ColorStories.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 2. Green Tier 1 > Color
 *
 * Only shows Brand -- confirmed via tokens/sets/tier_1_green.json that
 * "brand" is the ONLY key green's `color` object overrides (Color
 * Palettes, Utility, Neutral, and Transparent are defined once in Core and
 * never overridden per-theme, so they'd be exact duplicates of the Core
 * page here). Same live-computed component as "1. Core" -- just pinned to
 * the green theme (see tier1ColorStories.jsx).
 */
export default {
	title: "Tokens/Tier 1: Definitions/2. Green Tier 1/Color",
	parameters: { layout: "padded" },
};

const stories = makeTier1ColorStories("green");

export const Brand = stories.Brand;
