import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { FontSizeScale } from "./FontSizeScale.jsx";
import { LineHeightScale } from "./LineHeightScale.jsx";
import { FontWeightScale } from "./FontWeightScale.jsx";
import { FontFamilyScale } from "./FontFamilyScale.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 2. Green Tier 1 > Typography
 *
 * tokens.json's tier_1_green overrides fontSize, lineHeights,
 * fontFamilies, and font_weights_font_1/2/3 -- NOT
 * fontWeights_choices_text/_numbers, letterSpacing, or textCase/
 * textDecoration (identical to Core in every theme, so those get no
 * page here at all). See generate-typography-manifest.js's header
 * comment for the full reasoning; short version:
 *
 *  - Font Size / Line Height: overriding headingScale/bodyTextScale
 *    cascades through every step's base*scale^n formula, so the WHOLE
 *    scale differs -- FontSizeScale/LineHeightScale reused completely
 *    unchanged, just pinned to this theme.
 *  - Font Family: all 3 tokens differ (TWK Lausanne/Continental/Novela
 *    -> Basier Circle/Square/Square Mono) -- same "full replacement"
 *    shape, FontFamilyScale reused unchanged too.
 *  - Font Weight: NOT a formula scale -- individual keys, so some
 *    values coincidentally match Core (e.g. both fonts' "bold" stays
 *    700) while others don't, plus three brand-new keys Core doesn't
 *    have at all (medium/thin/heavy). This page passes
 *    manifest.fontWeightThemeDiffs.green -- already filtered to just
 *    the items that actually differ -- into the same FontWeightScale/
 *    FontWeightGroup/FontWeightCard components Core's page uses, via
 *    FontWeightScale's `groups` prop.
 *
 * Every card still reads its value live via useLiveCssValue, so pinning
 * `globals: { theme: "green" }` on each story (same mechanism
 * ColorGreen.stories.jsx uses for Brand) is the only theme-specific
 * wiring any of these need.
 */
export default {
	title: "Tokens/Tier 1: Definitions/2. Green Tier 1/Typography",
};

export const FontSize = {
	globals: { theme: "green" },
	render: () => <FontSizeScale />,
};

export const LineHeight = {
	globals: { theme: "green" },
	render: () => <LineHeightScale />,
};

export const FontWeight = {
	globals: { theme: "green" },
	render: () => <FontWeightScale groups={manifest.fontWeightThemeDiffs.green} />,
};

export const FontFamily = {
	globals: { theme: "green" },
	render: () => <FontFamilyScale />,
};
