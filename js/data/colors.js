'use strict';
/* ═══════════ 2. 資料：色票 + 裝飾庫 ═══════════ */
/* 顏色小工具 */
function hx(h){ const m=/^#?([0-9a-fA-F]{6})$/.exec((h||'').trim()); return m?[parseInt(m[1].slice(0,2),16),parseInt(m[1].slice(2,4),16),parseInt(m[1].slice(4,6),16)]:[0,0,0]; }
function rgbaOf(hex,aPct){ const c=hx(hex); return `rgba(${c[0]},${c[1]},${c[2]},${(aPct/100).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')||'0'})`; }
function enc(hex){ return hex.replace('#','%23'); }
function hexSvgBg(lineHex){ return `url("data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2234%22><polygon points=%2220,1 38,10 38,24 20,33 2,24 2,10%22 fill=%22none%22 stroke=%22${enc(lineHex)}%22 stroke-width=%221%22/></svg>")`; }
function gridSvgBg(lineHex){ return `url("data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><path d=%22M24 0H0V24%22 fill=%22none%22 stroke=%22${enc(lineHex)}%22 stroke-width=%221%22/></svg>")`; }
function noiseSvgBg(){ return `url("data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%224%22 stitchTiles=%22stitch%22/><feColorMatrix type=%22saturate%22 values=%220%22/></filter><rect width=%2280%22 height=%2280%22 filter=%22url(%23n)%22/></svg>")`; }

/* 參數欄位工廠 */
const C=(k,label,def)=>({k,label,type:'color',def});
const R=(k,label,min,max,def,unit)=>({k,label,type:'range',min,max,def,unit:unit||''});

/* ═══════════ 2. 資料：色票 + 裝飾庫 ═══════════ */
const SWATCHES = ['#0a0a0d','#0e0a06','#12121a','#1a140a','#2a1c10','#f0b03c','#c8791f','#b8943f','#c8a050','#e8d5a0','#d8d2c4','#8fa0b8','#ff2b2b','#7a1010','#c83018','#e5417a','#ff8fb4','#ffd0e2','#2ea877','#9ed8c0','#e8f3ef','#2a3830','#c8901a','#e0c890'];

/* kind: edge=邊緣漸層(半高) / cover=蓋滿畫布 / spot=小光點 / text=套到選取文字 */
const DECOS = [
 {cat:'漸層過渡（柔化畫布邊緣）', items:[
  {name:'上緣漸層', kind:'edge', p:[C('c','顏色','#0a0a0d'),R('h','高度',5,60,26,'%')], box:{top:'0',left:'0',w:'100%'},
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:${p.h}%;background:linear-gradient(to bottom,${p.c} 0%,transparent 100%);'></div>`},
  {name:'下緣漸層', kind:'edge', p:[C('c','顏色','#0a0a0d'),R('h','高度',5,60,26,'%')], box:{bottom:'0',left:'0',w:'100%'},
   b:p=>`<div style='position:absolute;bottom:0;left:0;width:100%;height:${p.h}%;background:linear-gradient(to top,${p.c} 0%,transparent 100%);'></div>`},
  {name:'左緣漸層', kind:'edge', p:[C('c','顏色','#0a0a0d'),R('h','寬度',5,60,22,'%')], box:{top:'0',left:'0',h:'100%'},
   b:p=>`<div style='position:absolute;top:0;left:0;height:100%;width:${p.h}%;background:linear-gradient(to right,${p.c} 0%,transparent 100%);'></div>`},
  {name:'右緣漸層', kind:'edge', p:[C('c','顏色','#0a0a0d'),R('h','寬度',5,60,22,'%')], box:{top:'0',right:'0',h:'100%'},
   b:p=>`<div style='position:absolute;top:0;right:0;height:100%;width:${p.h}%;background:linear-gradient(to left,${p.c} 0%,transparent 100%);'></div>`}
 ]},
 {cat:'遮罩／覆蓋（蓋滿整塊畫布）', items:[
  {name:'暗角遮罩', kind:'cover', p:[C('c','邊角色','#1a0e04'),R('a','濃度',0,90,42)],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at 50% 50%,transparent 55%,${rgbaOf(p.c,p.a)} 100%);'></div>`},
  {name:'整片色罩', kind:'cover', p:[C('c','顏色','#0a0a0d'),R('a','不透明',0,100,45)],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:${rgbaOf(p.c,p.a)};'></div>`},
  {name:'上下漸層罩', kind:'cover', p:[C('c1','上色','#0a0a0d'),C('c2','下色','#241a0e'),R('a','不透明',0,100,55)],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom,${rgbaOf(p.c1,p.a)},${rgbaOf(p.c2,p.a)});'></div>`}
 ]},
 {cat:'花紋（花紋色＋底色，覆蓋畫布）', items:[
  {name:'六邊形花紋', kind:'cover', p:[C('line','花紋色','#1a0e04'),C('bg','底色','#000000'),R('bgA','底色不透明',0,100,0),R('op','花紋濃度',3,100,10)],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background-color:${rgbaOf(p.bg,p.bgA)};background-image:${hexSvgBg(p.line)};background-size:40px 34px;opacity:${(p.op/100).toFixed(2)};'></div>`},
  {name:'格子花紋', kind:'cover', p:[C('line','線條色','#1a0e04'),C('bg','底色','#000000'),R('bgA','底色不透明',0,100,0),R('op','線條濃度',3,100,12)],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background-color:${rgbaOf(p.bg,p.bgA)};background-image:${gridSvgBg(p.line)};background-size:24px 24px;opacity:${(p.op/100).toFixed(2)};'></div>`},
  {name:'雜訊紋理', kind:'cover', p:[C('bg','底色','#000000'),R('bgA','底色不透明',0,100,0),R('op','濃度',5,60,20)],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background-color:${rgbaOf(p.bg,p.bgA)};background-image:${noiseSvgBg()};opacity:${(p.op/100).toFixed(2)};'></div>`}
 ]},
 {cat:'光點／邊框', items:[
  {name:'金色光暈球', kind:'spot', p:[C('c','顏色','#f0b03c'),R('sz','大小',60,320,150,'px'),R('a','亮度',10,90,45)],
   b:p=>`<div style='position:absolute;width:${p.sz}px;height:${p.sz}px;border-radius:50%;background:radial-gradient(circle,${rgbaOf(p.c,p.a)} 0%,transparent 70%);'></div>`, layerW:false},
  {name:'四角金框', kind:'cover', p:[C('c','框色','#f0b03c'),R('sz','角長',12,40,22,'px')],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;'><div style='position:absolute;top:6px;left:6px;width:${p.sz}px;height:${p.sz}px;border-top:2px solid ${p.c};border-left:2px solid ${p.c};'></div><div style='position:absolute;top:6px;right:6px;width:${p.sz}px;height:${p.sz}px;border-top:2px solid ${p.c};border-right:2px solid ${p.c};'></div><div style='position:absolute;bottom:6px;left:6px;width:${p.sz}px;height:${p.sz}px;border-bottom:2px solid ${p.c};border-left:2px solid ${p.c};'></div><div style='position:absolute;bottom:6px;right:6px;width:${p.sz}px;height:${p.sz}px;border-bottom:2px solid ${p.c};border-right:2px solid ${p.c};'></div></div>`},
  {name:'發光邊框', kind:'cover', p:[C('c','框色','#c8901a'),R('g','光暈',4,40,18,'px')],
   b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;border:1px solid ${p.c};box-shadow:inset 0 0 ${p.g}px ${rgbaOf(p.c,40)};pointer-events:none;'></div>`}
 ]},
 {cat:'文字效果（先選一段文字再套用）', items:[
  {name:'發光金字', kind:'text', st:{color:'#f0b03c','text-shadow':'0 0 20px rgba(240,176,60,0.8),2px 2px 0 rgba(0,0,0,0.6)'}},
  {name:'白描邊（圖上疊字）', kind:'text', st:{'text-shadow':'0 1px 8px rgba(0,0,0,0.9),0 2px 16px rgba(0,0,0,0.5)'}},
  {name:'紅色霓虹', kind:'text', st:{color:'#ff2b2b','text-shadow':'0 0 8px rgba(255,43,43,0.9),0 0 20px rgba(255,43,43,0.6)'}},
  {name:'金屬浮雕', kind:'text', st:{color:'#e8d5a0','text-shadow':'1px 1px 0 #6b5010,-1px -1px 0 rgba(255,255,255,0.2)'}}
 ]}
];
const CSS_PRESETS = [];
