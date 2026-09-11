import React from "react";
import { BorderScale } from "./BorderScale.jsx";

/**
 * Sidebar: Tokens > Tier 1: Definitions > 1. Core > Border
 * Border tokens don't vary per theme (no Green/Gold Border page), same as
 * ap_ds_storybook -- its Border page only ever exists once, under Core.
 */
export default {
	title: "Tokens/Tier 1: Definitions/1. Core/Border",
};

export const Border = { render: () => <BorderScale /> };
