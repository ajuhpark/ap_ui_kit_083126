import React from "react";
import manifest from "../../../tokens/generated/border-manifest.json";
import { BorderToken } from "./BorderToken.jsx";
import "./Border.css";

const BorderTokenRow = ({ tokens }) => (
	<div className="ap-border-token-group">
		{tokens.map((token) => (
			<BorderToken key={token.cssVar} cssVar={token.cssVar} tokenKey={token.key} />
		))}
	</div>
);

/**
 * Combines the width and radius scales into one page, same as
 * ap_ds_storybook's BorderScale.jsx (Figma has them as two separate
 * frames, but they render as one Storybook story). Values are read live
 * off tokens/generated/border-manifest.json's variable NAMES -- never
 * hand-typed.
 */
export function BorderScale() {
	return (
		<div className="ap-border-sections">
			<section className="ap-border-section">
				<h3 className="ap-foundation-section-title">
					<span className="ap-foundation-title-muted">border</span>{" "}
					<span className="ap-foundation-title-bold">width</span>
				</h3>
				<BorderTokenRow tokens={manifest.width} />
			</section>
			<section className="ap-border-section">
				<h3 className="ap-foundation-section-title">
					<span className="ap-foundation-title-muted">border</span>{" "}
					<span className="ap-foundation-title-bold">radius</span>
				</h3>
				<BorderTokenRow tokens={manifest.radius} />
			</section>
		</div>
	);
}
