import React from "react";
import { FontSizeScale } from "./FontSizeScale.jsx";
import { LineHeightScale } from "./LineHeightScale.jsx";
import { LetterSpacingScale } from "./LetterSpacingScale.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 1. Core > Typography
 * Font Size, Line Height, and Letter Spacing so far -- Text Case/Font
 * Family/Font Weight will be added here the same way once those pages
 * are built.
 */
export default {
	title: "Tokens/Tier 1: Definitions/1. Core/Typography",
};

export const FontSize = { render: () => <FontSizeScale /> };
export const LineHeight = { render: () => <LineHeightScale /> };
export const LetterSpacing = { render: () => <LetterSpacingScale /> };
