import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { LetterSpacingCard } from "./LetterSpacingCard.jsx";
import "./Typography.css";

/**
 * Letter Spacing page -- a single flat list, NOT grouped by font the way
 * FontSizeScale/LineHeightScale are. Two reasons: the underlying token
 * (tier_1_core.letterSpacing) is itself flat and shared across every
 * font/heading level already (see tokens.json), so per-font grouping
 * would be showing a distinction that doesn't exist in the data; and
 * ap_ds_storybook's own letter-spacing page -- the reference this was
 * modeled on -- is deliberately flat too, demonstrated on one
 * representative font/size rather than three.
 */
export function LetterSpacingScale() {
	return (
		<div className="ap-type-token-group">
			{manifest.letterSpacing.map((item) => (
				<LetterSpacingCard key={item.cssVar} label={item.key} cssVar={item.cssVar} />
			))}
		</div>
	);
}
