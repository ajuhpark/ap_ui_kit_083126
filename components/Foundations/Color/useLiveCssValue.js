import { useEffect, useRef, useState } from "react";
import { useTokenPreview } from "../../TokenPreviewContext.jsx";

// getComputedStyle normalizes colors to rgb()/rgba() (or, in some engines,
// "rgb(r g b / a)"). Only flag a swatch as needing the transparency
// checkerboard when its live value actually has alpha < 1 -- otherwise
// every opaque swatch would get an unnecessary checker pattern painted
// over it.
export function hasVisibleAlpha(value) {
	if (!value) return false;
	const rgbaMatch = value.match(/rgba?\(([^)]+)\)/i);
	if (rgbaMatch) {
		const parts = rgbaMatch[1]
			.split(/[,/]/)
			.map((p) => p.trim())
			.filter(Boolean);
		if (parts.length === 4) {
			const alpha = parseFloat(parts[3]);
			return !Number.isNaN(alpha) && alpha < 1;
		}
		return false;
	}
	const hexMatch = value.match(/^#([0-9a-f]{8})$/i);
	if (hexMatch) {
		return parseInt(hexMatch[1].slice(6, 8), 16) < 255;
	}
	return false;
}

/**
 * Reads a CSS custom property's REAL, currently-resolved value straight off
 * the DOM, re-reading whenever the Theme/Viewport toolbar globals change.
 * Returns `[ref, value]` -- attach `ref` to the element you want the read
 * to happen on (custom properties inherit, so any descendant of the
 * decorator's themed wrapper div gives the same answer; a tile and its
 * label can each hold their own ref to the same cssVar and always agree).
 *
 * This is the one place every Foundations/Color component reads a token's
 * value -- nothing here is ever hand-typed (see ColorSwatchCard.jsx /
 * ColorPalette.jsx and scripts/generate-color-manifest.js for why).
 */
export function useLiveCssValue(cssVar) {
	const ref = useRef(null);
	const [value, setValue] = useState("");
	const { theme, viewport } = useTokenPreview();

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		setValue(getComputedStyle(node).getPropertyValue(cssVar).trim());
	}, [cssVar, theme, viewport]);

	return [ref, value];
}

/**
 * Same idea as useLiveCssValue, but reads SEVERAL css vars off ONE node in
 * a single effect -- needed for Tier 2 Semantic Typography's composite
 * style cards, which display the `font` shorthand value alongside its
 * three companion vars (letter-spacing/text-transform/text-decoration,
 * see build-tokens.js) and need all four reads to agree on exactly which
 * DOM node they came from. Calling useLiveCssValue four times wouldn't
 * work here -- each call owns its own internal ref, and only one of those
 * four refs could ever actually be attached to the sample element.
 * Returns `[ref, values]` where `values` is a plain object keyed by the
 * css var name (e.g. `values["--ap-tier-2-typography-body-lg"]`).
 */
export function useLiveCssValues(cssVars) {
	const ref = useRef(null);
	const [values, setValues] = useState({});
	const { theme, viewport } = useTokenPreview();
	const cssVarsKey = cssVars.join("|");

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const computed = getComputedStyle(node);
		const next = {};
		for (const cssVar of cssVarsKey.split("|")) {
			next[cssVar] = computed.getPropertyValue(cssVar).trim();
		}
		setValues(next);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cssVarsKey, theme, viewport]);

	return [ref, values];
}
