import React from "react";
import { FontSizeScale } from "./FontSizeScale.jsx";
import { LineHeightScale } from "./LineHeightScale.jsx";
import { LetterSpacingScale } from "./LetterSpacingScale.jsx";
import { FontWeightScale } from "./FontWeightScale.jsx";
import { FontFamilyScale } from "./FontFamilyScale.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 1. Core > Typography
 * Font Size, Line Height, Letter Spacing, Font Weight, and Font Family so
 * far -- Text Case will be added here the same way once that page is
 * built.
 */
export default {
	title: "Tokens/Tier 1: Definitions/1. Core/Typography",
};

export const FontSize = { render: () => <FontSizeScale /> };
export const LineHeight = { render: () => <LineHeightScale /> };
export const LetterSpacing = { render: () => <LetterSpacingScale /> };
export const FontWeight = { render: () => <FontWeightScale /> };
export const FontFamily = { render: () => <FontFamilyScale /> };
