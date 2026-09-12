import React from "react";
import { FontWeightCard } from "./FontWeightCard.jsx";

/**
 * Static (non-collapsible) section for one Font Weight group. Unlike
 * Font Size/Line Height's per-font groups, Font Weight's five groups
 * are Tokens Studio's own raw group names (two shared choice pools --
 * fontWeights_choices_text/_numbers -- plus one per font that references
 * into them), not a toggle-able per-font breakdown, so there's no
 * chevron/expand affordance here: just the group name as a plain
 * heading, same title styling as the collapsible groups.
 */
export function FontWeightGroup({ groupName, items }) {
	return (
		<div className="ap-type-font-group">
			<div className="ap-type-font-group-title">{groupName}</div>
			<div className="ap-type-token-group">
				{items.map((item) => (
					<FontWeightCard key={item.cssVar} tokenKey={item.key} cssVar={item.cssVar} />
				))}
			</div>
		</div>
	);
}
