import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { FontWeightGroup } from "./FontWeightGroup.jsx";
import "./Typography.css";

/**
 * Font Weight page -- one static group per Tokens Studio group:
 * fontWeights_choices_text, fontWeights_choices_numbers, then
 * font_weights_font_1/2/3 (the per-font groups that reference into the
 * two choice pools). Order and group names come straight from the
 * manifest, which mirrors Tokens Studio's own panel order.
 *
 * `groups` defaults to the full Core list (manifest.fontWeight) but can
 * be overridden -- the Green/Gold Tier 1 pages pass
 * manifest.fontWeightThemeDiffs.{green,gold} instead, which is already
 * pre-filtered down to just the items whose value actually differs from
 * Core (see generate-typography-manifest.js). Same component, same
 * classes, just a different (smaller) data set -- nothing else changes.
 */
export function FontWeightScale({ groups = manifest.fontWeight }) {
	return (
		<div className="ap-type-font-groups">
			{groups.map((group) => (
				<FontWeightGroup key={group.groupName} groupName={group.groupName} items={group.items} />
			))}
		</div>
	);
}
