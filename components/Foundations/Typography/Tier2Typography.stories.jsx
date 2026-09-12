import React from "react";
import { CompositeStyles } from "./CompositeStyles.jsx";

/**
 * Tier 2 Semantic Typography's composite styles -- Display, Headline,
 * Title, Label, Body, and Meta -- each collapsing font-family/weight/
 * size/line-height into one CSS `font` shorthand custom property, with
 * letter-spacing/text-transform/text-decoration as separate companion
 * custom properties alongside it (see build-tokens.js for why). Green
 * and Gold reuse this exact same page, pinned to their own theme.
 */
export default {
	title: "Tokens/Tier 2: Semantic/Tier 2 - Core/Typography",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Each composite style (e.g. Body / lg) is one CSS `font` shorthand custom property covering font-family, font-weight, font-size, and line-height, plus three companion custom properties for letter-spacing, text-transform, and text-decoration -- properties the CSS `font` shorthand can't express on its own. Font-size and line-height are responsive, so this page has its own Mobile / Tablet / Desktop toggle, same as Tier 1's Font Size and Line Height pages.",
			},
		},
	},
};

export const CompositeStyles_ = { name: "Composite Styles", render: () => <CompositeStyles /> };
