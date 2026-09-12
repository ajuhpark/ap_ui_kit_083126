import React from "react";
import { FontSizeScale } from "./FontSizeScale.jsx";
import { LineHeightScale } from "./LineHeightScale.jsx";
import { LetterSpacingScale } from "./LetterSpacingScale.jsx";
import { FontWeightScale } from "./FontWeightScale.jsx";
import { FontFamilyScale } from "./FontFamilyScale.jsx";

/**
 * Core contains the complete set of Tier 1 typography tokens. Green
 * Tier 1 and Gold Tier 1 only contain the tokens that differ from Core.
 */
export default {
	title: "Tokens/Tier 1: Definitions/Tier 1 - Core/Typography",
	parameters: {
		docs: {
			description: {
				component:
					"Font Size and Line Height are responsive: their values change per breakpoint. Each of those two pages has its own Mobile / Tablet / Desktop toggle to preview them for this theme. Letter Spacing, Font Weight, and Font Family are not affected by viewport at all.",
			},
		},
	},
};

export const FontSize = { render: () => <FontSizeScale /> };
export const LineHeight = { render: () => <LineHeightScale /> };
export const LetterSpacing = { render: () => <LetterSpacingScale /> };
export const FontWeight = { render: () => <FontWeightScale /> };
export const FontFamily = { render: () => <FontFamilyScale /> };
