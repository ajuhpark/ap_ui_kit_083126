import { makeTier2SemanticStories } from "./tier2SemanticStories.jsx";

/**
 * Sidebar: Tokens > Tier 2: Semantic > Green Tier 2 > Color
 * Mirrors ap_ds_storybook's "Tier 2: Semantic / Strawberry Tier 2 / Color" /
 * "Chocolate Tier 2" split -- pinned to green (see tier2SemanticStories.jsx).
 */
export default {
	title: "Tokens/Tier 2: Semantic/Green Tier 2/Color",
	parameters: { layout: "padded" },
};

const stories = makeTier2SemanticStories("green");

export const Content = stories.Content;
export const Background = stories.Background;
export const Border = stories.Border;
