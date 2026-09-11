import { makeTier2SemanticStories } from "./tier2SemanticStories.jsx";

/**
 * Sidebar: Tokens > Tier 2: Semantic > Gold Tier 2 > Color
 * Pinned to gold (see tier2SemanticStories.jsx).
 */
export default {
	title: "Tokens/Tier 2: Semantic/Gold Tier 2/Color",
	parameters: { layout: "padded" },
};

const stories = makeTier2SemanticStories("gold");

export const Content = stories.Content;
export const Background = stories.Background;
export const Border = stories.Border;
