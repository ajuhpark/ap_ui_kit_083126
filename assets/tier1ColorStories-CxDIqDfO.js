import{R as e}from"./iframe-CDKT6lrn.js";import{m as i}from"./Color-D-FO5NaN.js";import{u as n,h as m}from"./useLiveCssValue-CcNxMxdM.js";function c({label:a,items:l}){return e.createElement("div",{className:"ap-color-palette"},e.createElement("div",{className:"ap-color-palette-label"},a),e.createElement("div",{className:"ap-color-palette-body"},e.createElement("div",{className:"ap-color-tile-column"},l.map(t=>e.createElement(p,{key:t.cssVar,cssVar:t.cssVar}))),e.createElement("div",{className:"ap-color-label-column"},l.map(t=>e.createElement(d,{key:t.cssVar,cssVar:t.cssVar,step:t.step})))))}function p({cssVar:a}){const[l,t]=n(a),s=m(t);return e.createElement("div",{ref:l,className:`ap-color-tile${s?" ap-color-tile--checkered":""}`,style:{backgroundColor:`var(${a})`},title:a})}function d({cssVar:a,step:l}){const[t,s]=n(a);return e.createElement("div",{ref:t,className:"ap-color-label"},e.createElement("div",{className:"ap-color-label-text"},l!=null&&e.createElement("span",{className:"ap-color-label-step"},l),e.createElement("span",{className:"ap-color-label-value"},s||"…")),e.createElement("div",{className:"ap-color-label-var"},a))}c.__docgenInfo={description:`Mirrors ap_ds_storybook's components/Foundations/Color/ColorPalette.jsx
structure exactly: a title, then a row containing two SEPARATE flex
columns -- the tiles (packed edge-to-edge, zero gap, each a 4rem square)
and the step/value/CSS-variable labels, each label the same height as a
tile so the two columns stay aligned row-for-row even though the tiles
themselves have no gap between them.

The one real difference from ap_ds_storybook's version: there, each
step's \`value\` is hand-typed into a JS array. Here, both the tile and
its label independently read the SAME cssVar's live, currently-resolved
value via useLiveCssValue -- custom properties inherit, so a tile and
its label (each with their own ref) always agree, without either one
needing to carry a value of its own. See useLiveCssValue.js.`,methods:[],displayName:"ColorPalette"};function o({scale:a}){return a?e.createElement("section",{className:"ap-color-section"},e.createElement("h3",{className:"ap-color-section__title"},a.title),e.createElement("div",{className:"ap-color-token-group"},a.families.map(l=>e.createElement(c,{key:l.name,label:l.name,items:l.items})))):null}o.__docgenInfo={description:`Renders one manifest "scale" entry (e.g. "Color Palettes") as a wrapping
row of families -- structurally identical to ap_ds_storybook's
UtilityColors.jsx (a \`.color-token-group\` of \`<ColorPalette>\`s), except
every value is live-computed rather than hand-typed. See ColorPalette.jsx
and Color.css for the actual tile/label layout.`,methods:[],displayName:"ColorScaleSection"};const r=a=>i.scales.find(l=>l.title===a);function b(a){return{ColorPalettes:{globals:{theme:a},render:()=>e.createElement(o,{scale:r("Color Palettes")})},DataViz:{globals:{theme:a},render:()=>e.createElement(o,{scale:r("Data Viz")})},Utility:{globals:{theme:a},render:()=>e.createElement(o,{scale:r("Utility")})},Brand:{globals:{theme:a},render:()=>e.createElement(o,{scale:r("Brand")})},Neutral:{globals:{theme:a},render:()=>e.createElement(o,{scale:r("Neutral")})},Transparent:{globals:{theme:a},render:()=>e.createElement(o,{scale:r("Transparent")})}}}export{b as m};
