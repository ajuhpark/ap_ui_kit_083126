import React from "react";
import { ColorSwatchCardGroup } from "./ColorSwatchCardGroup.jsx";

/**
 * Tier 2 semantic page body. ap_ds_storybook's equivalent (ContentColors.jsx
 * etc.) renders nothing but a <ColorSwatchCardGroup label="content" .../> --
 * no separate big section title -- so this mirrors that instead of the
 * larger .ap-color-section__title heading Tier 1 pages use.
 */
export function ColorGridSection({ grid }) {
	if (!grid) return null;
	if (grid.items.length === 0) {
		return (
			<div className="ap-color-swatch-card-group">
				<div className="ap-color-swatch-card-label">{grid.title}</div>
				<p className="ap-color-section__empty">No tokens in this category differ from Core.</p>
			</div>
		);
	}
	return <ColorSwatchCardGroup label={grid.title} items={grid.items} />;
}
