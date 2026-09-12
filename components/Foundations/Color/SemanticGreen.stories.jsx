import { makeTier2SemanticStories } from "./tier2SemanticStories.jsx";

/**
 * Core contains the complete set of Tier 2 semantic color tokens. Green
 * Tier 2 and Gold Tier 2 only contain the tokens that differ from Core.
 */
export default {
	title: "Tokens/Tier 2: Semantic/Tier 2 - Green/Color",
	parameters: { layout: "padded" },
};

const stories = makeTier2SemanticStories("green");

export const Content = stories.Content;
export const Background = stories.Background;
export const Border = stories.Border;
