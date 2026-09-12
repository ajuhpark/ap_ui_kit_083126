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
 * UNIT QUIRK: --ap-line-heights-* is emitted as a bare unitless number
 * (e.g. "46"), not "46px" the way --ap-font-size-* is -- see
 * generate-typography-manifest.js's header comment for why. Using it
 * directly as `line-height: var(--ap-line-heights-font1-h1)` would be
 * read as a 46x multiplier of the font size, not 46px. `calc(var(...) *
 * 1px)` is the standard way to coerce a unitless custom property into a
 * real length, so that's used here instead of the raw var().
 *
 * DISPLAY NOTE: --ap-font-size-* values already carry "px" in their
 * resolved string (e.g. "39px"), unlike --ap-line-heights-*'s bare
 * number -- so liveFontSize is shown as-is, while liveLineHeight gets
 * "px" appended by hand. Mixing these two up is what produced "28pxpx"
 * before this got fixed.
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
				<span className="ap-type-token-label">{liveLineHeight ? `${liveLineHeight}px` : "…"}</span>
				<span className="ap-type-token-var">{cssVar}</span>
			</div>
			<div className="ap-type-token-var">on {fontSizeVar} ({liveFontSize || "…"})</div>
			<div
				ref={fontSizeRef}
				className="ap-type-token-sample ap-type-token-sample--leading"
				style={{
					fontFamily: `var(${fontFamilyVar}), sans-serif`,
					fontSize: `var(${fontSizeVar})`,
					lineHeight: `calc(var(${cssVar}) * 1px)`,
				}}
			>
				{SAMPLE_LINES.map((line) => (
					<div key={line}>{line}</div>
				))}
			</div>
		</div>
	);
}
