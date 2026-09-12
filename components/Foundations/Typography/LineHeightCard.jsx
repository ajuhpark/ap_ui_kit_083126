import React from "react";
import { useLiveCssValue } from "../Color/useLiveCssValue.js";

// Two sentences, each its own line -- rendered as separate <div>s (same
// pattern as the alphabet-triplet SAMPLE_LINES elsewhere) rather than one
// string, so the second sentence doesn't just wrap wherever it happens to
// run out of width on the first.
const SAMPLE_LINES = [
	"The quick brown fox jumps over the lazy dog.",
	"Pack my box with five dozen liquor jugs.",
];

/**
 * One Line Height card: the heading-level name on its own line, then the
 * live line-height value + CSS var name, then a wrapped paragraph sample
 * rendered at that heading level's paired font size with the line-height
 * applied -- so the leading (gap between wrapped lines) is actually
 * visible, unlike Font Size's single-line samples.
 *
 * --ap-line-heights-* now resolves with "px" already baked in (e.g.
 * "46px"), same as --ap-font-size-* -- see build-tokens.js's LINE HEIGHT
 * UNIT FIX for the custom transform that appends it. Both liveLineHeight
 * and liveFontSize are shown as-is, and `line-height: var(${cssVar})` is
 * used directly with no calc() coercion needed.
 */
export function LineHeightCard({ font, headingName, cssVar }) {
	const [lineHeightRef, liveLineHeight] = useLiveCssValue(cssVar);
	const fontSizeVar = `--ap-font-size-${font}-${headingName}`;
	const [fontSizeRef, liveFontSize] = useLiveCssValue(fontSizeVar);
	const fontFamilyVar = `--ap-font-families-${font}`;

	return (
		<div className="ap-type-token-swatch" ref={lineHeightRef}>
			<div className="ap-type-token-heading-name">{headingName}</div>
			<div className="ap-type-token-header">
				<span className="ap-type-token-label">{liveLineHeight || "…"}</span>
				<span className="ap-type-token-var">{cssVar}</span>
			</div>
			<div className="ap-type-token-var">on {fontSizeVar} ({liveFontSize || "…"})</div>
			<div
				ref={fontSizeRef}
				className="ap-type-token-sample ap-type-token-sample--leading"
				style={{
					fontFamily: `var(${fontFamilyVar}), sans-serif`,
					fontSize: `var(${fontSizeVar})`,
					lineHeight: `var(${cssVar})`,
				}}
			>
				{SAMPLE_LINES.map((line) => (
					<div key={line}>{line}</div>
				))}
			</div>
		</div>
	);
}
