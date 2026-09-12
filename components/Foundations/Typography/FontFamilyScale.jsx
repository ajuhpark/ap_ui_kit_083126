import React from "react";
import manifest from "../../../tokens/generated/typography-manifest.json";
import { FontFamilyCard } from "./FontFamilyCard.jsx";
import "./Typography.css";

/**
 * Font Family page -- flat, no grouping, same as Letter Spacing: there's
 * nothing to nest font1/2/3 under, they're already the top-level items.
 */
export function FontFamilyScale() {
	return (
		<div className="ap-type-token-group">
			{manifest.fontFamily.map((item) => (
				<FontFamilyCard key={item.cssVar} font={item.key} cssVar={item.cssVar} />
			))}
		</div>
	);
}
