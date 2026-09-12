import React from "react";
import { BorderScale } from "./BorderScale.jsx";

/**
 * Border tokens are the same across every theme, so there's no
 * separate Green or Gold Tier 1 page -- this Core page covers all three.
 */
export default {
	title: "Tokens/Tier 1: Definitions/Tier 1 - Core/Border",
};

export const Border = { render: () => <BorderScale /> };
