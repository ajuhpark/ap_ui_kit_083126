import { createContext, useContext } from "react";

/**
 * Lets any Foundations component read the currently active Theme/Viewport
 * toolbar globals without prop-drilling through Storybook's `args`. Set by
 * the `withTokenAttributes` decorator in .storybook/preview.jsx.
 */
export const TokenPreviewContext = createContext({
	theme: "core",
	viewport: "mobile",
});

export function useTokenPreview() {
	return useContext(TokenPreviewContext);
}
