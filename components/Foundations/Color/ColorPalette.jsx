import React from "react";
import { useLiveCssValue, hasVisibleAlpha } from "./useLiveCssValue.js";
import "./Color.css";

/**
 * Mirrors ap_ds_storybook's components/Foundations/Color/ColorPalette.jsx
 * structure exactly: a title, then a row containing two SEPARATE flex
 * columns -- the tiles (packed edge-to-edge, zero gap, each a 4rem square)
 * and the step/value/CSS-variable labels, each label the same height as a
 * tile so the two columns stay aligned row-for-row even though the tiles
 * themselves have no gap between them.
 *
 * The one real difference from ap_ds_storybook's version: there, each
 * step's `value` is hand-typed into a JS array. Here, both the tile and
 * its label independently read the SAME cssVar's live, currently-resolved
 * value via useLiveCssValue -- custom properties inherit, so a tile and
 * its label (each with their own ref) always agree, without either one
 * needing to carry a value of its own. See useLiveCssValue.js.
 */
export function ColorPalette({ label, items }) {
	return (
		<div className="ap-color-palette">
			<div className="ap-color-palette-label">{label}</div>
			<div className="ap-color-palette-body">
				<div className="ap-color-tile-column">
					{items.map((item) => (
						<ColorTile key={item.cssVar} cssVar={item.cssVar} />
					))}
				</div>
				<div className="ap-color-label-column">
					{items.map((item) => (
						<ColorLabel key={item.cssVar} cssVar={item.cssVar} step={item.step} />
					))}
				</div>
			</div>
		</div>
	);
}

function ColorTile({ cssVar }) {
	const [ref, value] = useLiveCssValue(cssVar);
	const hasAlpha = hasVisibleAlpha(value);
	return (
		<div
			ref={ref}
			className={`ap-color-tile${hasAlpha ? " ap-color-tile--checkered" : ""}`}
			style={{ backgroundColor: `var(${cssVar})` }}
			title={cssVar}
		/>
	);
}

function ColorLabel({ cssVar, step }) {
	const [ref, value] = useLiveCssValue(cssVar);
	return (
		<div ref={ref} className="ap-color-label">
			<div className="ap-color-label-text">
				{step != null && <span className="ap-color-label-step">{step}</span>}
				<span className="ap-color-label-value">{value || "…"}</span>
			</div>
			<div className="ap-color-label-var">{cssVar}</div>
		</div>
	);
}
