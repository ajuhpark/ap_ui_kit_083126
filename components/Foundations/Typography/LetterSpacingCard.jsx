import React from "react";
import { useLiveCssValue } from "../Color/useLiveCssValue.js";

const SAMPLE_LINES = [
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	"abcdefghijklmnopqrstuvwxyz",
	"0123456789",
];

// Fixed, not read from a token: letter-spacing isn't font- or
// size-scoped in this project (see LetterSpacingScale.jsx), and unlike
// Font Size/Line Height there's no per-font display wanted here -- just
// one representative font at one representative size, matching
// ap_ds_storybook's own letter-spacing page (which is likewise always
// shown on its single typeface at a fixed 16px, never on its font-size
// scale). font1 stands in for "the" font the same way ap_ds_storybook
// only ever has Inter.
const DEMO_FONT_FAMILY_VAR = "--ap-font-families-font1";
const DEMO_FONT_SIZE = "16px";

/**
 * One Letter Spacing card, styled to match Foundations/Border's cards
 * (BorderToken.jsx / Border.css): bold key on top, live-computed value
 * below it, CSS var name below that -- stacked, not paired side by side.
 * The key/value rows use the shared .ap-token-key/.ap-token-value
 * classes (Typography.css) -- a generalized copy of Border's own
 * .ap-border-token-key/-value, kept out of Border.css so this component
 * doesn't have to import Border's stylesheet for a border-named class.
 * The var name keeps the existing .ap-type-token-var class, unchanged.
 * Below all three: an alphabet-triplet sample at a fixed font/size with
 * that letter-spacing applied -- unchanged in placement/class from
 * before.
 */
export function LetterSpacingCard({ label, cssVar }) {
	const [ref, liveValue] = useLiveCssValue(cssVar);

	return (
		<div className="ap-type-token-swatch" ref={ref}>
			<div className="ap-token-key">{label}</div>
			<div className="ap-token-value">{liveValue || "…"}</div>
			<div className="ap-type-token-var">{cssVar}</div>
			<div
				className="ap-type-token-sample"
				style={{
					fontFamily: `var(${DEMO_FONT_FAMILY_VAR}), sans-serif`,
					fontSize: DEMO_FONT_SIZE,
					letterSpacing: `var(${cssVar})`,
				}}
			>
				{SAMPLE_LINES.map((line) => (
					<div key={line}>{line}</div>
				))}
			</div>
		</div>
	);
}
