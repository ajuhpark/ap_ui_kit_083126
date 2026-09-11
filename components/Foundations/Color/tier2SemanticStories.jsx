import React from "react";
import manifest from "../../../tokens/generated/color-manifest.json";
import { ColorGridSection } from "./ColorGridSection.jsx";
import "./Color.css";

/**
 * Shared Tier 2 (semantic) color story bodies -- Content, Background,
 * Border -- reused across the per-theme sidebar pages
 * (SemanticGreen.stories.jsx / SemanticGold.stories.jsx).
 *
 * Unlike Core's Tier 2 page (which shows the full semantic list), these
 * are trimmed to only the tokens that actually resolve to a different
 * value for that theme -- see generate-color-manifest.js's
 * `tier2ThemeDiffs`, computed by diffing the built CSS rather than static
 * reference parsing. Most of Content/Background/Border reference
 * color.neutral/color_palettes/utility, which never change per theme; only
 * the color.brand-referencing entries do.
 */
export function makeTier2SemanticStories(theme) {
	const diffGrids = manifest.tier2ThemeDiffs?.[theme] ?? [];
	const findDiffGrid = (title) =>
		diffGrids.find((g) => g.title === title) ?? { title, items: [] };

	return {
		Content: {
			globals: { theme },
			render: () => <ColorGridSection grid={findDiffGrid("Content")} />,
		},
		Background: {
			globals: { theme },
			render: () => <ColorGridSection grid={findDiffGrid("Background")} />,
		},
		Border: {
			globals: { theme },
			render: () => <ColorGridSection grid={findDiffGrid("Border")} />,
		},
	};
}
