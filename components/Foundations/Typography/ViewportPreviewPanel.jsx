import React, { useState } from "react";
import { TokenPreviewContext, useTokenPreview } from "../../TokenPreviewContext.jsx";

const VIEWPORTS = [
	{ value: "desktop", label: "Desktop" },
	{ value: "tablet", label: "Tablet" },
	{ value: "mobile", label: "Mobile" },
];

/**
 * Wraps Font Size and Line Height's content in their OWN local
 * Mobile/Tablet/Desktop toggle. These are the only two Typography pages
 * whose values actually change across breakpoints (Letter Spacing, Font
 * Weight, and Font Family don't read viewport-scoped tokens at all), so
 * this control lives only here instead of as a Storybook-wide toolbar
 * global that would show up -- doing nothing -- on every other page in
 * the whole project.
 *
 * Mechanism: re-provides TokenPreviewContext with this component's own
 * local `viewport` state (theme still comes through unchanged from the
 * real outer context, which is pinned per Core/Green/Gold story same as
 * every other Foundations page). Every descendant card's useLiveCssValue
 * call already reads `viewport` from that same context via
 * useTokenPreview(), so this toggle works with ZERO changes to
 * useLiveCssValue.js, FontSizeCard.jsx, or LineHeightCard.jsx -- a nested
 * Provider transparently overrides the outer one for everything rendered
 * inside `children`.
 *
 * The wrapper div's own `data-theme`/`data-viewport` attributes are what
 * actually make build/all-combinations/css's compound
 * `[data-theme="..."][data-viewport="..."]` selectors match -- set
 * directly here (not relied on from any ancestor) so this works
 * regardless of what the rest of the page's markup happens to carry.
 */
export function ViewportPreviewPanel({ children }) {
	const { theme } = useTokenPreview();
	const [viewport, setViewport] = useState("desktop");

	return (
		<TokenPreviewContext.Provider value={{ theme, viewport }}>
			<div data-theme={theme} data-viewport={viewport}>
				<div className="ap-type-viewport-panel">
					<p className="ap-type-responsive-note">
						Font size and line height are responsive — every value below
						changes across breakpoints. Use the toggle to preview{" "}
						<strong>Mobile</strong>, <strong>Tablet</strong>, or{" "}
						<strong>Desktop</strong> for this theme.
					</p>
					<div className="ap-type-viewport-toggle" role="group" aria-label="Preview viewport">
						{VIEWPORTS.map((vp) => (
							<button
								key={vp.value}
								type="button"
								className={`ap-type-viewport-toggle-button${
									viewport === vp.value ? " ap-type-viewport-toggle-button--active" : ""
								}`}
								aria-pressed={viewport === vp.value}
								onClick={() => setViewport(vp.value)}
							>
								{vp.label}
							</button>
						))}
					</div>
				</div>
				{children}
			</div>
		</TokenPreviewContext.Provider>
	);
}
