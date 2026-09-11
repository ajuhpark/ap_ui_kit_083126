import React from "react";
import { useLiveCssValue, hasVisibleAlpha } from "./useLiveCssValue.js";
import "./ColorSwatchCard.css";

/**
 * Single semantic-token row: a bordered white card with a 48x48 swatch on
 * the left and the token's name/live value/CSS-var name stacked on the
 * right. Structure mirrors ap_ds_storybook's ColorSwatchCard.jsx exactly,
 * except the value is read live via useLiveCssValue instead of being
 * hand-typed as a `value` prop.
 */
export function ColorSwatchCard({ cssVar, name }) {
	const [ref, liveValue] = useLiveCssValue(cssVar);
	const hasAlpha = hasVisibleAlpha(liveValue);
	return (
		<div className="ap-color-swatch-card">
			<div
				className={`ap-color-swatch-card-swatch${hasAlpha ? " ap-color-swatch-card-swatch--checkered" : ""}`}
				ref={ref}
				style={{ backgroundColor: `var(${cssVar})` }}
			/>
			<div className="ap-color-swatch-card-info">
				<div className="ap-color-swatch-card-header">
					<span className="ap-color-swatch-card-name">{name}</span>
					<span className="ap-color-swatch-card-hex">{liveValue || "…"}</span>
				</div>
				<div className="ap-color-swatch-card-var">{cssVar}</div>
			</div>
		</div>
	);
}
