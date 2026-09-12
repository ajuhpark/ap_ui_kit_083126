import React from "react";
import { useLiveCssValue } from "../Color/useLiveCssValue.js";

/**
 * One Font Weight card: the token key (e.g. "regular", "100",
 * "56-italic-weight") on its own line, then the live-computed value and
 * CSS var name -- structurally identical to FontSizeCard's key/value/var
 * rows, minus the alphabet-triplet sample. No sample here: a font weight
 * has no useful "look" to preview on its own, without a specific font
 * and size to render it in (unlike Font Size/Line Height/Letter
 * Spacing, which are all inherently visual).
 */
export function FontWeightCard({ tokenKey, cssVar }) {
	const [ref, liveValue] = useLiveCssValue(cssVar);

	return (
		<div className="ap-type-token-swatch" ref={ref}>
			<div className="ap-type-token-heading-name">{tokenKey}</div>
			<div className="ap-type-token-header">
				<span className="ap-type-token-label">{liveValue || "…"}</span>
				<span className="ap-type-token-var">{cssVar}</span>
			</div>
		</div>
	);
}
