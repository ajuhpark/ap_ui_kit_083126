import React from "react";
import { useLiveCssValue } from "../Color/useLiveCssValue.js";

const SAMPLE_LINES = [
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	"abcdefghijklmnopqrstuvwxyz",
	"0123456789",
];

// Fixed, not read from a token: this page is only about demonstrating
// each family's look, so one representative size is enough -- same
// reasoning as LetterSpacingCard's fixed DEMO_FONT_SIZE, and the same
// role ap_ds_storybook's FontFamilyScale.jsx fills with a fixed
// --ds-typography-font-size-20 for its own samples.
const DEMO_FONT_SIZE = "24px";

/**
 * One Font Family card: the token key ("font1", "font2", "font3") on its
 * own line, then the live-resolved family name + CSS var name, then an
 * alphabet-triplet sample actually rendered in that family. Structurally
 * identical to FontSizeCard, minus the per-heading-level nesting --
 * fontFamilies is already flat (font1/font2/font3), so `font` and `key`
 * are the same thing here.
 */
export function FontFamilyCard({ font, cssVar }) {
	const [ref, liveValue] = useLiveCssValue(cssVar);

	return (
		<div className="ap-type-token-swatch" ref={ref}>
			<div className="ap-type-token-heading-name">{font}</div>
			<div className="ap-type-token-header">
				<span className="ap-type-token-label">{liveValue || "…"}</span>
				<span className="ap-type-token-var">{cssVar}</span>
			</div>
			<div
				className="ap-type-token-sample"
				style={{ fontFamily: `var(${cssVar}), sans-serif`, fontSize: DEMO_FONT_SIZE }}
			>
				{SAMPLE_LINES.map((line) => (
					<div key={line}>{line}</div>
				))}
			</div>
		</div>
	);
}
