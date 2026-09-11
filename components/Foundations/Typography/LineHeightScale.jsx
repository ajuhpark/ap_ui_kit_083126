import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { LineHeightFontGroup } from "./LineHeightFontGroup.jsx";
import "./Typography.css";

/**
 * Line Height page -- one collapsible group per font, same shape as
 * FontSizeScale.jsx.
 */
export function LineHeightScale() {
	return (
		<div className="ap-type-font-groups">
			<LineHeightFontGroup font="font1" items={manifest.lineHeight.font1} />
			<LineHeightFontGroup font="font2" items={manifest.lineHeight.font2} />
			<LineHeightFontGroup font="font3" items={manifest.lineHeight.font3} />
		</div>
	);
}
