'use strict';
/* ═══════════ 0. 常數：CaveDuck 角色介面實測黑白名單（來源：01_HTML標籤對照表.csv 實測數據）═══════════ */
let ALLOWED_TAGS = new Set(['a','b','br','div','em','hr','i','img','p','span','strong']);
const TAG_ATTRS = { a:['target','href','title'], img:['src','alt','title','width','height','loading'] };
const GLOBAL_ATTRS = new Set(['style','class']);
let DROP_WITH_CONTENT = new Set(['script','style','iframe','object','embed','title','head','svg','math','noscript','template','textarea','xmp','plaintext','noembed','noframes','annotation-xml','foreignobject','desc']);
const VOID_TAGS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);

/* ═══════════ 0.5 三個頁面的規則（依 CaveDuck_區塊規則.md）═══════════ */
const DROP_INFO = DROP_WITH_CONTENT;
const PURIFY_DROP = new Set(['annotation-xml','audio','colgroup','desc','foreignobject','head','iframe','math','mi','mn','mo','ms','mtext','noembed','noframes','noscript','plaintext','script','style','svg','template','thead','title','video','xmp','object','embed','textarea']);
const CHAT_TAGS = new Set((
  /* 文字 */ 'b strong i em u s strike del ins mark small big sub sup code kbd samp var tt abbr acronym cite dfn q time data bdi bdo nobr font center blink marquee '+
  /* 標題段落 */ 'h1 h2 h3 h4 h5 h6 p br hr pre blockquote address hgroup '+
  /* 版面 */ 'div span section article header footer nav aside main search figure figcaption details summary dialog menu dir '+
  /* 清單表格 */ 'ul ol li dl dt dd menuitem table caption thead tbody tfoot tr th td colgroup '+
  /* 表單媒體 */ 'form input button select option optgroup textarea label fieldset legend datalist output progress meter picture source track map area audio video canvas '+
  /* 其他 */ 'ruby rt rp wbr spacer slot title '+
  /* SVG */ 'svg altglyph altglyphdef altglyphitem animatecolor animatemotion animatetransform circle clippath defs desc ellipse filter g glyph glyphref hkern image line lineargradient marker mask metadata mpath path pattern polygon polyline radialgradient rect stop switch symbol text textpath tref tspan view vkern '+
  /* SVG 濾鏡 */ 'feblend fecolormatrix fecomponenttransfer fecomposite feconvolvematrix fediffuselighting fedisplacementmap fedistantlight fedropshadow feflood fefunca fefuncb fefuncg fefuncr fegaussianblur feimage femerge femergenode femorphology feoffset fepointlight fespecularlighting fespotlight fetile feturbulence '+
  /* MathML */ 'math menclose merror mfenced mfrac mglyph mi mlabeledtr mmultiscripts mn mo mover mpadded mphantom mroot mrow ms mspace msqrt mstyle msub msup msubsup mtable mtd mtext mtr munder munderover mprescripts'
).split(/\s+/));
const WIDGET_TAGS = new Set(['div','span','p','br','hr','section','article','header','footer','nav','aside','figure','figcaption',
  'h1','h2','h3','h4','h5','h6','strong','em','b','i','u','s','small','sub','sup','mark',
  'ul','ol','li','table','thead','tbody','tfoot','tr','th','td','blockquote','pre','code','dl','dt','dd','details','summary']);
const MODES = {
  info:  { name:'角色介面', tags:ALLOWED_TAGS, drop:DROP_INFO,
           attr:(t,n)=>n==='style'||n==='class'||(TAG_ATTRS[t]||[]).includes(n),
           ph:'在這裡貼上或編寫 CaveDuck 角色介面 HTML…' },
  chat:  { name:'聊天室', tags:CHAT_TAGS, drop:PURIFY_DROP,
           attr:(t,n)=>!/^on/i.test(n),
           ph:'在這裡貼上或編寫聊天室訊息用的 HTML…（不能用 a、img、style）' },
  widget:{ name:'小工具', tags:WIDGET_TAGS, drop:PURIFY_DROP,
           attr:(t,n)=>n==='style'||n==='class',
           ph:'在這裡貼上或編寫小工具（狀態欄）HTML…（變數用 {{英文大寫}}）' }
};
let mode='info';
function attrOK(tag,nm){ return MODES[mode].attr(tag,nm); }


const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
