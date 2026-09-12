import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { CompositeStyleGroup } from "./CompositeStyleGroup.jsx";
import { ViewportPreviewPanel } from "./ViewportPreviewPanel.jsx";
import "./Typography.css";

/**
 * Tier 2 Semantic Typography's composite styles (Display/Headline/Title/
 * Label/Body/Meta) -- the "one-liner" `font`-shorthand approach, not
 * ap_ds_storybook's SCSS mixins (see build-tokens.js and the project doc
 * for the full comparison). Each composite style's fontSize/lineHeight
 * are viewport-scaled the same way Tier 1's Font Size/Line Height pages
 * are (they're built from the exact same fontSize/lineHeights aliases --
 * see build-tokens.js's THEME x VIEWPORT CROSS-PRODUCT note), so this
 * page gets the same local Mobile/Tablet/Desktop toggle, reused
 * unchanged from ViewportPreviewPanel.jsx.
 */
export function CompositeStyles() {
	return (
		<ViewportPreviewPanel>
			<div className="ap-type-font-groups">
				{manifest.compositeStyles.map((group) => (
					<CompositeStyleGroup key={group.groupName} groupName={group.groupName} items={group.items} />
				))}
			</div>
		</ViewportPreviewPanel>
	);
}
