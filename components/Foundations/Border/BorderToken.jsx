import React from "react";
import { useLiveCssValue } from "../Color/useLiveCssValue.js";

/**
 * Single border token: bold key (the step name, e.g. "1", "round") above
 * its live-computed value, then the CSS variable name -- matches
 * ap_ds_storybook's .border-token structure exactly, except the value is
 * read live via useLiveCssValue instead of being hand-typed.
 * Reuses the shared hook from Foundations/Color rather than duplicating
 * it -- it's generic (any --ap-* custom property), not color-specific.
 */
export function BorderToken({ cssVar, tokenKey }) {
	const [ref, liveValue] = useLiveCssValue(cssVar);
	return (
		<div className="ap-border-token" ref={ref}>
			<div className="ap-border-token-key">{tokenKey}</div>
			<div className="ap-border-token-value">{liveValue || "…"}</div>
			<div className="ap-border-token-var">{cssVar}</div>
		</div>
	);
}
