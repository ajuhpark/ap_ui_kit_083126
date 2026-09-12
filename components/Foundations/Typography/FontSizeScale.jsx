import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { FontSizeFontGroup } from "./FontSizeFontGroup.jsx";
import { ViewportPreviewPanel } from "./ViewportPreviewPanel.jsx";
import "./Typography.css";

/**
 * Font Size page -- one collapsible group per font, wrapped in its own
 * local Mobile/Tablet/Desktop toggle (see ViewportPreviewPanel.jsx).
 */
export function FontSizeScale() {
	return (
		<ViewportPreviewPanel>
			<div className="ap-type-font-groups">
				<FontSizeFontGroup font="font1" items={manifest.fontSize.font1} />
				<FontSizeFontGroup font="font2" items={manifest.fontSize.font2} />
				<FontSizeFontGroup font="font3" items={manifest.fontSize.font3} />
			</div>
		</ViewportPreviewPanel>
	);
}
