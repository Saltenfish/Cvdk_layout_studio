'use strict';
/* ═══════════ 28. 介面語言（中／EN／한／日）═══════════ */
(function(){
const LANGS=['zh','en','ko','ja'];
let L=null;
try{ L=new URLSearchParams(location.search).get('lang'); }catch(e){}
if(!LANGS.includes(L)) L=load('cd-lang');
if(!LANGS.includes(L)) L='zh';
window.UI_LANG=L;
const LI={en:0,ko:1,ja:2}[L];
const sel=$('#langSel'); if(sel){ sel.value=L; sel.addEventListener('change',()=>{ store('cd-lang',sel.value); const u=new URL(location.href); u.searchParams.delete('lang'); location.href=u.pathname+u.search+u.hash; }); }
window.addEventListener('storage',e=>{ if(e.key==='cd-lang'&&e.newValue&&e.newValue!==L&&LANGS.includes(e.newValue)&&!new URLSearchParams(location.search).get('lang')) location.reload(); });
document.documentElement.lang={zh:'zh-Hant',en:'en',ko:'ko',ja:'ja'}[L];
/* 第一次進來：先選語言（之後就記住，不再問） */
let urlLang=null; try{ urlLang=new URLSearchParams(location.search).get('lang'); }catch(e){}
if(!LANGS.includes(urlLang)&&!LANGS.includes(load('cd-lang'))){
  const nav=(navigator.language||'').toLowerCase();
  const guess=nav.startsWith('ko')?'ko':nav.startsWith('ja')?'ja':nav.startsWith('zh')?'zh':'en';
  const box=document.createElement('div'); box.id='langAsk'; box.dataset.noi18n='1';
  box.innerHTML=`<div class="laCard"><div class="laT">選擇語言 · Language · 언어 · 言語</div><div class="laS">之後可在右上角更改 · You can change this later (top right)</div><div class="laB">${[['zh','中文'],['en','English'],['ko','한국어'],['ja','日本語']].map(([k,n])=>`<button data-l="${k}" class="${k===guess?'on':''}">${n}</button>`).join('')}</div></div>`;
  document.body.appendChild(box);
  box.addEventListener('click',e=>{ const b=e.target.closest('button[data-l]'); if(!b) return;
    store('cd-lang',b.dataset.l);
    if(b.dataset.l===L){ box.remove(); } else location.reload();
  });
}
if(LI==null){ window.UI_T=s=>s; return; }

const CJK=/[㐀-鿿！-～「」]/;
const norm=s=>s.replace(/\s+/g,' ').trim();
const HMAP=new Map(Object.entries(I18N_HTML).map(([k,v])=>[norm(k),v[LI]]));
function dict(k){ const v=I18N_DICT[k]; return v&&v[LI]?v[LI]:null; }
function fill(tpl,m){ return tpl.replace(/\{(\d)\}/g,(_,i)=>{ const x=m[+i]||''; return dict(x)||(x.length<m[0].length?TS(x):x); }); }
function TS(s){                      // 一整段字串（可含 inline HTML）
  if(!s||!CJK.test(s)) return s;
  const k=s.trim(); const d=dict(k)||HMAP.get(norm(k));
  if(d) return s.replace(k,d);
  for(const p of I18N_PAT){ const m=k.match(p[0]); if(m) return s.replace(k,fill(p[1+LI],m)); }
  return s;
}
window.UI_T=TS;

const SKIP='#pv,#page,#code,textarea,script,style,#cvIn,#cvOut,.fitIn,.hpBox,.pprev,.fprev,.uimg,.mc-name,.mc-css,#assetGrid,#imgUsed,#htmlSaveList .hsName,[data-noi18n]';
const skip=el=>!!(el&&el.closest&&el.closest(SKIP));
const skipA=el=>!!(el&&el.closest&&el.closest('#pv,#page,.fitIn,.hpBox,.pprev,.fprev,[data-noi18n]'));
let busy=false;
function trAttr(el){
  for(const a of ['title','placeholder']){ const v=el.getAttribute(a); if(v&&CJK.test(v)){ const t=TS(v); if(t!==v) el.setAttribute(a,t); } }
}
function trEl(el){
  if(el.nodeType!==1) return;
  if(skip(el)){ if(!skipA(el)){ trAttr(el); el.querySelectorAll('[title],[placeholder]').forEach(x=>{ if(!skipA(x)) trAttr(x); }); } return; }
  trAttr(el);
  // 整段帶 inline 標籤的句子：先整塊比對
  if(el.children.length&&el.innerHTML.length<900&&CJK.test(el.textContent)){
    const h=el.innerHTML, t=TS(h);
    if(t!==h){ el.innerHTML=t; el.querySelectorAll('*').forEach(trAttr); return; }
  }
  for(const c of [...el.childNodes]){
    if(c.nodeType===3) trText(c);
    else if(c.nodeType===1) trEl(c);
  }
}
function trText(n){
  const v=n.nodeValue; if(!v||!CJK.test(v)) return;
  const t=TS(v); if(t!==v) n.nodeValue=t;
}
function run(root){ busy=true; try{ trEl(root); }finally{ busy=false; } }

/* toast 在顯示前先翻整段 */
{ const _t=toast; toast=function(h){ _t(typeof h==='string'?TS(h):h); }; }

run(document.body);
const tt=()=>{ const t=document.title, n=TS(t); if(n!==t) document.title=n; };
tt(); new MutationObserver(tt).observe(document.querySelector('title')||document.head,{childList:true,characterData:true,subtree:true});

new MutationObserver(list=>{
  if(busy) return;
  busy=true;
  try{
    for(const m of list){
      const tg=m.target;
      if(m.type==='characterData'){ if(!skip(tg.parentElement)){ const p=tg.parentElement; if(p&&p.children.length===0) trText(tg); else if(p) trEl(p); } }
      else if(m.type==='attributes'){ if(!skipA(tg)) trAttr(tg); }
      else{
        if(skip(tg)) continue;
        // 父層若是一句帶 inline 標籤的句子，整塊翻
        if(tg.nodeType===1&&tg.children.length&&tg.innerHTML.length<900){ const h=tg.innerHTML, t=TS(h); if(t!==h){ tg.innerHTML=t; continue; } }
        m.addedNodes.forEach(nd=>{ if(nd.nodeType===3) trText(nd); else if(nd.nodeType===1) trEl(nd); });
      }
    }
  }finally{ busy=false; }
}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder']});
})();
