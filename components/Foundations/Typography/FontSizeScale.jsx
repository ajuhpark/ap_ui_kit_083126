import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { FontSizeFontGroup } from "./FontSizeFontGroup.jsx";
import "./Typography.css";

/**
 * Font Size page -- one collapsible group per font.
 */
export function FontSizeScale() {
	return (
		<div className="ap-type-font-groups">
			<FontSizeFontGroup font="font1" items={manifest.fontSize.font1} />
			<FontSizeFontGroup font="font2" items={manifest.fontSize.font2} />
			<FontSizeFontGroup font="font3" items={manifest.fontSize.font3} />
		</div>
	);
}
