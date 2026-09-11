import React from "react";
import { ColorPalette } from "./ColorPalette.jsx";

/**
 * Renders one manifest "scale" entry (e.g. "Color Palettes") as a wrapping
 * row of families -- structurally identical to ap_ds_storybook's
 * UtilityColors.jsx (a `.color-token-group` of `<ColorPalette>`s), except
 * every value is live-computed rather than hand-typed. See ColorPalette.jsx
 * and Color.css for the actual tile/label layout.
 */
export function ColorScaleSection({ scale }) {
	if (!scale) return null;
	return (
		<section className="ap-color-section">
			<h3 className="ap-color-section__title">{scale.title}</h3>
			<div className="ap-color-token-group">
				{scale.families.map((family) => (
					<ColorPalette key={family.name} label={family.name} items={family.items} />
				))}
			</div>
		</section>
	);
}
