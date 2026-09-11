import React from "react";
import { ColorSwatchCard } from "./ColorSwatchCard.jsx";
import "./ColorSwatchCard.css";

/**
 * Optional small label above a vertical list of ColorSwatchCards, capped
 * at 412px wide -- matches ap_ds_storybook's ColorSwatchCardGroup.jsx
 * (label rendered with the same properties as its .color-palette-label,
 * see ColorSwatchCard.css's .ap-color-swatch-card-label).
 */
export function ColorSwatchCardGroup({ label, items }) {
	return (
		<div className="ap-color-swatch-card-group">
			{label ? <div className="ap-color-swatch-card-label">{label}</div> : null}
			<div className="ap-color-swatch-card-list">
				{items.map((item) => (
					<ColorSwatchCard key={item.cssVar} cssVar={item.cssVar} name={item.label} />
				))}
			</div>
		</div>
	);
}
