import React from "react";
import { CompositeStyles } from "./CompositeStyles.jsx";

/**
 * Green reuses Core's exact same composite-style component -- every
 * style's font-family and font-weight differ from Core in every theme
 * (confirmed against the built CSS), so unlike Font Weight there's no
 * per-item diff to compute; the whole scale is simply re-rendered under
 * the "green" theme global, same pattern as FontSizeScale/LineHeightScale/
 * FontFamilyScale.
 */
export default {
	title: "Tokens/Tier 2: Semantic/Tier 2 - Green/Typography",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Each composite style (e.g. Body / lg) is one CSS `font` shorthand custom property covering font-family, font-weight, font-size, and line-height, plus three companion custom properties for letter-spacing, text-transform, and text-decoration -- properties the CSS `font` shorthand can't express on its own. Font-size and line-height are responsive, so this page has its own Mobile / Tablet / Desktop toggle, same as Tier 1's Font Size and Line Height pages.",
			},
		},
	},
};

export const CompositeStyles_ = {
	name: "Composite Styles",
	globals: { theme: "green" },
	render: () => <CompositeStyles />,
};
