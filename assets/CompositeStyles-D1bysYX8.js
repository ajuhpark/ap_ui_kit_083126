import{R as e,r as c}from"./iframe-CDKT6lrn.js";import{V as m,m as d}from"./Typography-ba4VxVJ6.js";import{u as h}from"./useLiveCssValue-CcNxMxdM.js";const y="The quick brown fox jumps over the lazy dog";function r({itemKey:t,cssVar:o}){const s=`${o}-letter-spacing`,n=`${o}-text-transform`,a=`${o}-text-decoration`,[l,p]=h(o);return e.createElement("div",{className:"ap-type-composite-card",ref:l},e.createElement("div",{className:"ap-type-token-heading-name"},t),e.createElement("div",{className:"ap-type-composite-sample",style:{font:`var(${o})`,letterSpacing:`var(${s})`,textTransform:`var(${n})`,textDecoration:`var(${a})`}},y),e.createElement("div",{className:"ap-type-composite-readout-row"},e.createElement("span",{className:"ap-type-composite-readout-label"},"font:"),e.createElement("span",{className:"ap-type-composite-readout-var"},o),e.createElement("span",{className:"ap-type-composite-readout-sep"},"|"),e.createElement("span",{className:"ap-type-composite-readout-value"},p||"…")))}r.__docgenInfo={description:`One Tier 2 Semantic Typography composite style (e.g. "Body / lg"):
the item key, then a live text sample styled with the \`font\` shorthand
PLUS its three companion properties (letter-spacing/text-transform/
text-decoration -- see build-tokens.js for why those can't fold into
the shorthand itself), then a single readout row below it.

The sample still applies letter-spacing/text-transform/text-decoration
inline via var() -- that costs nothing and stays correct the moment any
composite style's tokens.json values actually change -- but their own
readout rows are hidden for now, since every composite style currently
resolves to the same 0em/none/none in every theme (see build-tokens.js's
"Composite typography styles" doc section) and displaying three rows
that never vary was just noise. Re-add them (see git history for the
previous version) once a composite style actually uses one of these.

The readout row's structure/markup (label, var name, "|" separator,
value) matches ap_ds_storybook's composite-style-card-readout-row
pattern -- ".ap-type-composite-readout-*" below is that same shape,
"ap-" prefixed. Unlike ap_ds_storybook's version, the value here is
still the full resolved \`font\` shorthand (e.g. "500 52px/63px 'Basier
Circle'"), not just a bare font-size -- that's the one-liner value
ap_ui_kit actually builds (see build-tokens.js), and it's the whole
point of the composite-styles feature, so it's retained rather than
trading it away to match ds's simpler single-property readout.`,methods:[],displayName:"CompositeStyleCard"};const u=()=>e.createElement("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true"},e.createElement("path",{d:"M2.5 4.5L6 8L9.5 4.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}));function f(t){return t.charAt(0).toUpperCase()+t.slice(1)}function i({groupName:t,items:o}){const[s,n]=c.useState(!0);return e.createElement("div",{className:"ap-type-font-group"},e.createElement("button",{type:"button",className:"ap-type-font-group-header",onClick:()=>n(a=>!a),"aria-expanded":s},e.createElement("span",{className:"ap-type-font-group-title"},f(t)),e.createElement("span",{className:`ap-type-font-group-chevron${s?"":" ap-type-font-group-chevron--collapsed"}`},e.createElement(u,null))),s&&e.createElement("div",{className:"ap-type-composite-group"},o.map(a=>e.createElement(r,{key:a.cssVar,itemKey:a.key,cssVar:a.cssVar}))))}i.__docgenInfo={description:`Collapsible section for one composite style family (Display, Headline,
Title, Label, Body, Meta) -- same collapsible pattern as
FontSizeFontGroup.jsx, one card per size variant. Expanded by default.`,methods:[],displayName:"CompositeStyleGroup"};function g(){return e.createElement(m,null,e.createElement("div",{className:"ap-type-font-groups"},d.compositeStyles.map(t=>e.createElement(i,{key:t.groupName,groupName:t.groupName,items:t.items}))))}g.__docgenInfo={description:`Tier 2 Semantic Typography's composite styles (Display/Headline/Title/
Label/Body/Meta) -- the "one-liner" \`font\`-shorthand approach, not
ap_ds_storybook's SCSS mixins (see build-tokens.js and the project doc
for the full comparison). Each composite style's fontSize/lineHeight
are viewport-scaled the same way Tier 1's Font Size/Line Height pages
are (they're built from the exact same fontSize/lineHeights aliases --
see build-tokens.js's THEME x VIEWPORT CROSS-PRODUCT note), so this
page gets the same local Mobile/Tablet/Desktop toggle, reused
unchanged from ViewportPreviewPanel.jsx.`,methods:[],displayName:"CompositeStyles"};export{g as C};
