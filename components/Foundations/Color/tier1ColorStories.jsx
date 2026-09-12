import React from "react";
import manifest from "../../../tokens/generated/color-manifest.json";
import { ColorScaleSection } from "./ColorScaleSection.jsx";
import "./Color.css";

const findScale = (title) => manifest.scales.find((s) => s.title === title);

/**
 * Shared Tier 1 (primitive) color story bodies -- Color Palettes, Data
 * Viz, Utility, Brand, Neutral, Transparent. Every swatch reads its value
 * live via getComputedStyle at render time (see ColorPalette.jsx), so the
 * exact same component works for every theme -- only the pinned `theme`
 * global differs between "1. Core" / "2. Green Tier 1" / "3. Gold Tier 1"
 * in the sidebar (see Color.stories.jsx / ColorGreen.stories.jsx /
 * ColorGold.stories.jsx, which just call this with a different theme and
 * re-export the results).
 *
 * All six render through ColorScaleSection -> ColorPalette (tile column +
 * label column, matching ap_ds_storybook's structure exactly) -- including
 * Transparent, which is just a single-family scale (transparent-1/2/3),
 * same as ap_ds_storybook's TransparentColors.jsx.
 *
 * Data Viz used to be a handful of families mixed into "Color Palettes"
 * (Dataviz Orange/Purple/Pale Red Subtle/Pale Red) -- generate-color-
 * manifest.js now splits those into their own "Data Viz" scale entry, so
 * this is just one more findScale() lookup, same rendering path as
 * everything else here.
 *
 * `globals: { theme }` on each story pins that story to render with this
 * theme regardless of the toolbar's current Theme dropdown value -- so
 * "2. Green Tier 1 / Color" always shows green even if you arrived on
 * "core". The Viewport global is left alone (not pinned): color tokens
 * don't vary by viewport, so there's nothing to pin.
 */
export function makeTier1ColorStories(theme) {
	return {
		ColorPalettes: {
			globals: { theme },
			render: () => <ColorScaleSection scale={findScale("Color Palettes")} />,
		},
		DataViz: {
			globals: { theme },
			render: () => <ColorScaleSection scale={findScale("Data Viz")} />,
		},
		Utility: {
			globals: { theme },
			render: () => <ColorScaleSection scale={findScale("Utility")} />,
		},
		Brand: {
			globals: { theme },
			render: () => <ColorScaleSection scale={findScale("Brand")} />,
		},
		Neutral: {
			globals: { theme },
			render: () => <ColorScaleSection scale={findScale("Neutral")} />,
		},
		Transparent: {
			globals: { theme },
			render: () => <ColorScaleSection scale={findScale("Transparent")} />,
		},
	};
}
