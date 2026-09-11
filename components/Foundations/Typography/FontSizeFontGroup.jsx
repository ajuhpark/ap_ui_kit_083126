import React, { useState } from "react";
import { FontSizeCard } from "./FontSizeCard.jsx";

const ChevronDownIcon = () => (
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/**
 * Collapsible section for one font's Font Size scale: a clickable
 * "font1 [chevron]" header that toggles the card grid below it. Expanded
 * by default.
 */
export function FontSizeFontGroup({ font, items }) {
	const [expanded, setExpanded] = useState(true);

	return (
		<div className="ap-type-font-group">
			<button
				type="button"
				className="ap-type-font-group-header"
				onClick={() => setExpanded((prev) => !prev)}
				aria-expanded={expanded}
			>
				<span className="ap-type-font-group-title">{font}</span>
				<span
					className={`ap-type-font-group-chevron${expanded ? "" : " ap-type-font-group-chevron--collapsed"}`}
				>
					<ChevronDownIcon />
				</span>
			</button>
			{expanded && (
				<div className="ap-type-token-group">
					{items.map((item) => (
						<FontSizeCard key={item.cssVar} font={font} headingName={item.key} cssVar={item.cssVar} />
					))}
				</div>
			)}
		</div>
	);
}
