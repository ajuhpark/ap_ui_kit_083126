import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { FontSizeScale } from "./FontSizeScale.jsx";
import { LineHeightScale } from "./LineHeightScale.jsx";
import { FontWeightScale } from "./FontWeightScale.jsx";
import { FontFamilyScale } from "./FontFamilyScale.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 3. Gold Tier 1 > Typography
 * Same reasoning as TypographyGreen.stories.jsx -- see there for why
 * Font Size/Line Height/Font Family reuse their Core components
 * unchanged (full-scale differences) while Font Weight passes
 * manifest.fontWeightThemeDiffs.gold (a real per-item diff) through
 * FontWeightScale's `groups` prop instead of the full manifest.fontWeight.
 */
export default {
	title: "Tokens/Tier 1: Definitions/3. Gold Tier 1/Typography",
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
