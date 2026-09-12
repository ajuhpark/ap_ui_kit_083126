import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { FontSizeScale } from "./FontSizeScale.jsx";
import { LineHeightScale } from "./LineHeightScale.jsx";
import { FontWeightScale } from "./FontWeightScale.jsx";
import { FontFamilyScale } from "./FontFamilyScale.jsx";

/**
 * Core contains the complete set of Tier 1 typography tokens. Green
 * Tier 1 and Gold Tier 1 only contain the tokens that differ from Core.
 */
export default {
	title: "Tokens/Tier 1: Definitions/Tier 1 - Gold/Typography",
	parameters: {
		docs: {
			description: {
				component:
					"Font Size and Line Height are responsive: their values change per breakpoint. Each of those two pages has its own Mobile / Tablet / Desktop toggle to preview them for this theme. Font Weight and Font Family are not affected by viewport at all.",
			},
		},
	},
};

export const FontSize = {
	globals: { theme: "gold" },
	render: () => <FontSizeScale />,
};

export const LineHeight = {
	globals: { theme: "gold" },
	render: () => <LineHeightScale />,
};

export const FontWeight = {
	globals: { theme: "gold" },
	render: () => <FontWeightScale groups={manifest.fontWeightThemeDiffs.gold} />,
};

export const FontFamily = {
	globals: { theme: "gold" },
	render: () => <FontFamilyScale />,
};
