import React from "react";
import manifest from "../../../tokens/generated/color-manifest.json";
import { ColorGridSection } from "./ColorGridSection.jsx";
import "./Color.css";

/**
 * Shared Tier 2 (semantic) color story bodies -- Content, Background,
 * Border -- reused across all three per-theme sidebar pages
 * (Semantic.stories.jsx / SemanticGreen.stories.jsx /
 * SemanticGold.stories.jsx).
 *
 * theme "core" renders the FULL semantic list (manifest.grids -- all 63
 * tokens, unfiltered). "green"/"gold" render only the tokens that
 * actually resolve to a different value for that theme (manifest.
 * tier2ThemeDiffs, computed by diffing the built CSS rather than static
 * reference parsing -- most of Content/Background/Border reference
 * color.neutral/color_palettes/utility, which never changes per theme;
 * only the color.brand-referencing entries do). Both lists share the
 * same "Content"/"Background"/"Border" titles (see generate-color-
 * manifest.js), so findGrid works the same way regardless of which one
 * is active -- same component, same classes, just a different
 * (possibly filtered) items array, same pattern as FontWeightScale's
 * `groups` prop for Typography's Green/Gold pages.
 */
export function makeTier2SemanticStories(theme) {
	const grids = theme === "core" ? manifest.grids : (manifest.tier2ThemeDiffs?.[theme] ?? []);
	const findGrid = (title) => grids.find((g) => g.title === title) ?? { title, items: [] };

	return {
		Content: {
			globals: { theme },
			render: () => <ColorGridSection grid={findGrid("Content")} />,
		},
		Background: {
			globals: { theme },
			render: () => <ColorGridSection grid={findGrid("Background")} />,
		},
		Border: {
			globals: { theme },
			render: () => <ColorGridSection grid={findGrid("Border")} />,
		},
	};
}
