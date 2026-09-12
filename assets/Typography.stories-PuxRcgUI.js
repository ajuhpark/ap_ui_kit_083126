import{R as e}from"./iframe-CDKT6lrn.js";import{F as N,a as z,b as x,L as B}from"./FontFamilyScale-DuIWmpLh.js";import{m as O}from"./Typography-ba4VxVJ6.js";import{u as H}from"./useLiveCssValue-CcNxMxdM.js";import"./preload-helper-Dp1pzeXC.js";const C=["ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz","0123456789"],I="--ap-font-families-font1",M="16px";function b({label:t,cssVar:i}){const[_,T]=H(i);return e.createElement("div",{className:"ap-type-token-swatch",ref:_},e.createElement("div",{className:"ap-token-key"},t),e.createElement("div",{className:"ap-token-value"},T||"…"),e.createElement("div",{className:"ap-type-token-var"},i),e.createElement("div",{className:"ap-type-token-sample",style:{fontFamily:`var(${I}), sans-serif`,fontSize:M,letterSpacing:`var(${i})`}},C.map(c=>e.createElement("div",{key:c},c))))}b.__docgenInfo={description:`One Letter Spacing card, styled to match Foundations/Border's cards
(BorderToken.jsx / Border.css): bold key on top, live-computed value
below it, CSS var name below that -- stacked, not paired side by side.
The key/value rows use the shared .ap-token-key/.ap-token-value
classes (Typography.css) -- a generalized copy of Border's own
.ap-border-token-key/-value, kept out of Border.css so this component
doesn't have to import Border's stylesheet for a border-named class.
The var name keeps the existing .ap-type-token-var class, unchanged.
Below all three: an alphabet-triplet sample at a fixed font/size with
that letter-spacing applied -- unchanged in placement/class from
before.`,methods:[],displayName:"LetterSpacingCard"};function w(){return e.createElement("div",{className:"ap-type-token-group"},O.letterSpacing.map(t=>e.createElement(b,{key:t.cssVar,label:t.key,cssVar:t.cssVar})))}w.__docgenInfo={description:`Letter Spacing page -- a single flat list, NOT grouped by font the way
FontSizeScale/LineHeightScale are. Two reasons: the underlying token
(tier_1_core.letterSpacing) is itself flat and shared across every
font/heading level already (see tokens.json), so per-font grouping
would be showing a distinction that doesn't exist in the data; and
ap_ds_storybook's own letter-spacing page -- the reference this was
modeled on -- is deliberately flat too, demonstrated on one
representative font/size rather than three.`,methods:[],displayName:"LetterSpacingScale"};const j={title:"Tokens/Tier 1: Definitions/Tier 1 - Core/Typography",parameters:{docs:{description:{component:"Font Size and Line Height are responsive: their values change per breakpoint. Each of those two pages has its own Mobile / Tablet / Desktop toggle to preview them for this theme. Letter Spacing, Font Weight, and Font Family are not affected by viewport at all."}}}},a={render:()=>e.createElement(z,null)},r={render:()=>e.createElement(B,null)},n={render:()=>e.createElement(w,null)},o={render:()=>e.createElement(x,null)},s={render:()=>e.createElement(N,null)},P=["FontSize","LineHeight","LetterSpacing","FontWeight","FontFamily"];var l,p,d;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <FontSizeScale />
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var m,g,h;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <LineHeightScale />
}`,...(h=(g=r.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var u,S,y;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <LetterSpacingScale />
}`,...(y=(S=n.parameters)==null?void 0:S.docs)==null?void 0:y.source}}};var f,v,k;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <FontWeightScale />
}`,...(k=(v=o.parameters)==null?void 0:v.docs)==null?void 0:k.source}}};var F,L,E;s.parameters={...s.parameters,docs:{...(F=s.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <FontFamilyScale />
}`,...(E=(L=s.parameters)==null?void 0:L.docs)==null?void 0:E.source}}};export{s as FontFamily,a as FontSize,o as FontWeight,n as LetterSpacing,r as LineHeight,P as __namedExportsOrder,j as default};
