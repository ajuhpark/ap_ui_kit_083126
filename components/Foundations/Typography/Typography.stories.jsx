import React from "react";
import { FontSizeScale } from "./FontSizeScale.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 1. Core > Typography
 * Only a FontSize story for now -- Line Height/Letter Spacing/Text
 * Case/Font Family/Font Weight will be added here the same way once
 * those pages are built.
 */
export default {
	title: "Tokens/Tier 1: Definitions/1. Core/Typography",
};

export const FontSize = { render: () => <FontSizeScale /> };
