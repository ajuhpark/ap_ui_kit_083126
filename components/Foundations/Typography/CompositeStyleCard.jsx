import React from "react";
import { useLiveCssValue } from "../Color/useLiveCssValue.js";

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";

/**
 * One Tier 2 Semantic Typography composite style (e.g. "Body / lg"):
 * the item key, then a live text sample styled with the `font` shorthand
 * PLUS its three companion properties (letter-spacing/text-transform/
 * text-decoration -- see build-tokens.js for why those can't fold into
 * the shorthand itself), then a single readout row below it.
 *
 * The sample still applies letter-spacing/text-transform/text-decoration
 * inline via var() -- that costs nothing and stays correct the moment any
 * composite style's tokens.json values actually change -- but their own
 * readout rows are hidden for now, since every composite style currently
 * resolves to the same 0em/none/none in every theme (see build-tokens.js's
 * "Composite typography styles" doc section) and displaying three rows
 * that never vary was just noise. Re-add them (see git history for the
 * previous version) once a composite style actually uses one of these.
 *
 * The readout row's structure/markup (label, var name, "|" separator,
 * value) matches ap_ds_storybook's composite-style-card-readout-row
 * pattern -- ".ap-type-composite-readout-*" below is that same shape,
 * "ap-" prefixed. Unlike ap_ds_storybook's version, the value here is
 * still the full resolved `font` shorthand (e.g. "500 52px/63px 'Basier
 * Circle'"), not just a bare font-size -- that's the one-liner value
 * ap_ui_kit actually builds (see build-tokens.js), and it's the whole
 * point of the composite-styles feature, so it's retained rather than
 * trading it away to match ds's simpler single-property readout.
 */
export function CompositeStyleCard({ itemKey, cssVar }) {
	const letterSpacingVar = `${cssVar}-letter-spacing`;
	const textTransformVar = `${cssVar}-text-transform`;
	const textDecorationVar = `${cssVar}-text-decoration`;
	const [ref, liveFont] = useLiveCssValue(cssVar);

	return (
		<div className="ap-type-composite-card" ref={ref}>
			<div className="ap-type-token-heading-name">{itemKey}</div>
			<div
				className="ap-type-composite-sample"
				style={{
					font: `var(${cssVar})`,
					letterSpacing: `var(${letterSpacingVar})`,
					textTransform: `var(${textTransformVar})`,
					textDecoration: `var(${textDecorationVar})`,
				}}
			>
				{SAMPLE_TEXT}
			</div>
			<div className="ap-type-composite-readout-row">
				<span className="ap-type-composite-readout-label">font:</span>
				<span className="ap-type-composite-readout-var">{cssVar}</span>
				<span className="ap-type-composite-readout-sep">|</span>
				<span className="ap-type-composite-readout-value">{liveFont || "…"}</span>
			</div>
		</div>
	);
}
