'use strict';
/* ═══════════ 25. v3.5：依頁面切換的部件庫／小工具模板／滑過預覽／畫布轉換 ═══════════ */
DRAWER_INFO.tpl=['小工具模板','完整的小工具，插入後再改'];
DRAWER_INFO.conv=['畫布轉換','一般 div ⇄ 畫布，看各寬度的樣子'];

/* —— 預覽用的簡易過濾（照目前頁面規則） —— */
function cleanForPreview(html){
  const t=document.createElement('template'); t.innerHTML=html;
  (function walk(p){
    [...p.childNodes].forEach(n=>{
      if(n.nodeType===8){ n.remove(); return; }
      if(n.nodeType!==1) return;
      const tag=n.tagName.toLowerCase();
      if(!ALLOWED_TAGS.has(tag)){
        if(DROP_WITH_CONTENT.has(tag)){ n.remove(); return; }
        walk(n); n.replaceWith(...n.childNodes); return;
      }
      [...n.attributes].forEach(a=>{ if(!attrOK(tag,a.name)) n.removeAttribute(a.name); });
      if(mode==='widget'&&n.hasAttribute('style')) n.setAttribute('style',widgetCss(n.getAttribute('style').replace(/\{\{[^{}]+\}\}/g,'60')));
      walk(n);
    });
  })(t.content);
  return t.innerHTML;
}
/* 把 html 等比縮小放進 box（base 寬度排版，再縮到 box 寬） */
function fitPreview(box,html,baseW,maxH){
  box.innerHTML='';
  const inner=document.createElement('div'); inner.className='fitIn'; inner.style.width=baseW+'px';
  inner.innerHTML=cleanForPreview(adaptForMode(html));
  box.appendChild(inner);
  requestAnimationFrame(()=>{
    const s=Math.min(1,(box.clientWidth||baseW)/baseW);
    inner.style.transform='scale('+s+')';
    const h=inner.scrollHeight*s; box.style.height=Math.min(maxH||9999,Math.max(40,h))+'px';
  });
}

/* —— 滑過浮出預覽 —— */
const hov=document.createElement('div'); hov.id='hoverPrev'; hov.innerHTML='<div class="hpTitle"></div><div class="hpBox"></div><div class="hpMore">縮圖只是示意・點一下看完整預覽與設定</div>'; document.body.appendChild(hov);
let hovT=null;
function showHover(anchor,title,html,opt){
  clearTimeout(hovT);
  hovT=setTimeout(()=>{
    if(document.body.classList.contains('dragging')) return;
    hov.querySelector('.hpTitle').textContent=title;
    const box=hov.querySelector('.hpBox'); box.className='hpBox'+(opt&&opt.deco?' deco':'');
    hov.classList.add('on');
    const side=$('#side').getBoundingClientRect(), r=anchor.getBoundingClientRect();
    hov.style.left=(side.right+12)+'px';
    fitPreview(box,html,(opt&&opt.baseW)||(mode==='widget'?440:600),(opt&&opt.maxH)||420);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ const hh=hov.offsetHeight; hov.style.top=Math.max(60,Math.min(innerHeight-hh-12,r.top-20))+'px'; }));
  },260);
}
function hideHover(){ clearTimeout(hovT); hov.classList.remove('on'); }
document.addEventListener('pointerdown',hideHover,true);

/* —— 插入前處理：素材庫有選圖 → 模擬圖換成那張 —— */
function prepCode(code){
  let c=stripComments(code);
  if(selAsset>=0&&assets[selAsset]&&mode!=='widget'){ const u=assets[selAsset]; PH_ALL.forEach(ph=>{ c=c.split(ph).join(u); }); }
  return adaptForMode(c);
}

/* —— 列表項目（純文字列＋點開預覽） —— */
function libItem(it,opt){
  opt=opt||{};
  const d=document.createElement('div'); d.className='pitem';
  d.innerHTML=`<button class="phead"><span class="grip">⠿</span><span class="pname">${esc(it.name)}</span><span class="pdesc">${esc(it.desc||'')}</span><span class="pmore">看更多 ▸</span></button>
    <div class="pbody"><div class="pprev"></div><div class="prow"><button class="mbtn solid">插入</button>${opt.replace?'<button class="mbtn">取代整份</button>':''}<button class="mbtn">複製 code</button></div></div>`;
  const head=d.querySelector('.phead');
  head.addEventListener('click',()=>{ const o=d.classList.toggle('open'); hideHover(); if(o) fitPreview(d.querySelector('.pprev'),it.code,mode==='widget'?440:600,300); });
  head.addEventListener('pointerdown',ev=>startHtmlDrag(ev,{label:it.name,html:()=>prepCode(it.code)}));
  head.addEventListener('mouseenter',()=>{ if(!d.classList.contains('open')) showHover(head,it.name,it.code); });
  head.addEventListener('mouseleave',hideHover);
  const btns=[...d.querySelectorAll('.prow .mbtn')];
  btns[0].addEventListener('click',()=>insertSmart(prepCode(it.code),opt.flow?{forceFlow:true}:undefined));
  if(opt.replace){ btns[1].addEventListener('click',()=>{ const b=btns[1]; if(!b.dataset.armed){ b.dataset.armed='1'; b.textContent='確定取代？'; setTimeout(()=>{ if(b.dataset.armed){ delete b.dataset.armed; b.textContent='取代整份'; } },2400); return; } pushUndo(); codeEl.value=prepCode(it.code); clearSelection(); parseAndRender(); toast('<b>已換成</b>「'+esc(it.name)+'」'); }); }
  btns[btns.length-1].addEventListener('click',()=>copyText(prepCode(it.code),'<b>已複製</b>「'+esc(it.name)+'」'));
  return d;
}
function libCats(root,cats,key){
  let open=new Set(); try{ const v=JSON.parse(load(key)||'null'); if(Array.isArray(v)) open=new Set(v); }catch(e){}
  root.replaceChildren(...cats.map(g=>{
    const det=document.createElement('details'); det.className='acat lcat'; det.open=open.has(g.cat);
    det.innerHTML=`<summary>${esc(g.cat)}<span class="ac">${g.items.length}</span></summary><div class="lbody"></div>`;
    det.addEventListener('toggle',()=>{ if(det.open) open.add(g.cat); else open.delete(g.cat); store(key,JSON.stringify([...open])); });
    const body=det.querySelector('.lbody'); g.items.forEach(it=>body.appendChild(libItem(it)));
    return det;
  }));
}
function renderLib(){
  const cats=mode==='widget'?LIB_WIDGET:(mode==='chat'?LIB_INFO.concat([LIB_CHAT_EXTRA]):LIB_INFO);
  libCats($('#partsList'),cats,'cdb3_libopen_'+mode);
  $('#libNote').innerHTML=mode==='widget'?'小工具的基礎部件：變數用 <b>{{英文大寫}}</b>，改名字就能對應你的狀態值。完整的小工具在「模板」。'
    :mode==='chat'?'角色介面能用的都在這裡，另外多了<b>聊天室限定</b>（折疊、表格、SVG）。圖片會自動改成背景圖。'
    :'每個部件都可以自由組合：先拖一個外層容器，再把標題、段落、圖片拖進去。';
  const tl=$('#tplList'); if(tl){ tl.replaceChildren(...WTPL.map(it=>libItem(it,{replace:true,flow:true}))); }
  // 裝飾：小工具隱藏用了 url() 的花紋
  const URLD=new Set(['六邊形花紋','格子花紋','雜訊紋理']);
  $$('#decoList .pitem').forEach(p=>{ const n=p.querySelector('.phead span'); p.style.display=(mode==='widget'&&n&&URLD.has(n.textContent))?'none':''; });
}
/* 裝飾：滑過預覽（用預設參數） */
(function(){
  const all=DECOS.flatMap(g=>g.items);
  $$('#decoList .pitem').forEach(p=>{
    const head=p.querySelector('.phead'); const nm=head.querySelector('span').textContent; const it=all.find(x=>x.name===nm); if(!it) return;
    head.addEventListener('mouseenter',()=>{ if(p.classList.contains('open')) return;
      const html=it.kind==='text'?`<div style="padding:26px;text-align:center;font-size:26px;font-weight:700;${Object.entries(it.st).map(([k,v])=>k+':'+v).join(';')}">範例文字 Aa</div>`
        :`<div style="position:relative;height:200px;background:linear-gradient(135deg,#241a0e,#0e0a06);overflow:hidden;">${it.b(decoDefaults(it)).replace(/^<div style='/,it.kind==='spot'?"<div style='top:30%;left:35%;":"<div style='")}</div>`;
      showHover(head,it.name,html,{baseW:420,deco:true}); });
    head.addEventListener('mouseleave',hideHover);
  });
})();
{ const _sm=switchMode; switchMode=function(m){ _sm(m); renderLib(); const cur=$('#tabs button.on'); if(mode!=='widget'&&cur&&cur.dataset.tab==='tpl') openDrawer('parts'); }; }

/* —— 左面板：轉換頁會把預覽區換成轉換工作區 —— */
{ const _od=openDrawer; openDrawer=function(n){ _od(n); $('#app').classList.toggle('convOn',n==='conv'); if(n==='conv') requestAnimationFrame(cvPreview); }; }

/* ═══ 畫布轉換 ═══ */
function allCss(){ return [...document.querySelectorAll('link[data-app]')].map(l=>'<link rel="stylesheet" href="'+l.href+'">').join('')+'<style>'+[...document.querySelectorAll('style')].map(s=>s.textContent).join('\n')+'</style>'; }
let CSS_CACHE=null;
function frameDoc(html,W){
  CSS_CACHE=CSS_CACHE||allCss();
  const theme=$('#page').classList.contains('light')?'light':'dark';
  return `<!doctype html><html><head><meta charset="utf-8">${CSS_CACHE}<style>html,body{margin:0;height:auto!important;background:transparent;overflow:hidden}#page{width:${W}px;border-top:0;box-shadow:none;border-radius:0;overflow:visible}</style></head><body><div id="page" class="${theme}" data-mode="${mode}"><div id="pv">${html}</div></div></body></html>`;
}
function loadFrame(ifr,html,W){
  return new Promise(res=>{ ifr.onload=()=>res(ifr.contentDocument); ifr.srcdoc=frameDoc(html,W); });
}
let measureFrame=null;
function measure(html,W){
  if(!measureFrame){ measureFrame=document.createElement('iframe'); measureFrame.style.cssText='position:fixed;left:-99999px;top:0;height:1200px;border:0;visibility:hidden'; document.body.appendChild(measureFrame); }
  measureFrame.style.width=W+'px';
  return loadFrame(measureFrame,html,W);
}
function toClampW(px,W){ px=Math.round(px); return `clamp(${Math.max(9,Math.round(px*0.55))}px,${+(px/(W/100)).toFixed(2)}vw,${px}px)`; }
function tagAll(frag){ let i=0; frag.querySelectorAll('*').forEach(e=>e.setAttribute('data-cv',i++)); }
function compactStyles(frag){
  const hx2=n=>(+n).toString(16).padStart(2,'0');
  frag.querySelectorAll('[style]').forEach(e=>{
    let s=e.getAttribute('style')||'';
    s=s.replace(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/g,(m,r,g,b,a)=>(a==null||+a===1)?('#'+hx2(r)+hx2(g)+hx2(b)):('rgba('+r+','+g+','+b+','+a+')'));
    s=s.replace(/\s*:\s+/g,':').replace(/;\s*/g,';').replace(/,\s+/g,',').trim();
    if(s&&!s.endsWith(';')) s+=';';
    e.setAttribute('style',s);
  });
}
function untag(frag){ compactStyles(frag); frag.querySelectorAll('[data-cv]').forEach(e=>e.removeAttribute('data-cv')); }
function rectOf(doc,el){ const x=doc.querySelector('[data-cv="'+el.getAttribute('data-cv')+'"]'); return x?x.getBoundingClientRect():null; }
function hasDirectText(el){ return [...el.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim()); }
const r1=v=>Math.round(v*10)/10;

async function convToCanvas(src,W,doFont){
  const frag=parseFrag(src.trim());
  const els=[...frag.children]; if(!els.length) throw '沒有可以轉換的內容';
  if(els.length>1||hasDirectText(frag)){ const w=document.createElement('div'); w.setAttribute('style','width:100%;'); while(frag.firstChild) w.appendChild(frag.firstChild); frag.appendChild(w); }
  let cv=frag.firstElementChild;
  while(cv.children.length===1&&!hasDirectText(cv)) cv=cv.firstElementChild;
  if(!cv.children.length&&!hasDirectText(cv)) throw '找不到可以變成圖層的內容';
  [...cv.childNodes].forEach(n=>{ if(n.nodeType===3&&n.nodeValue.trim()){ const s=document.createElement('div'); s.textContent=n.nodeValue.trim(); n.replaceWith(s); } else if(n.nodeType===3) n.remove(); });
  tagAll(frag);
  const doc=await measure(serializeDoc(frag,null),W);
  const cr=rectOf(doc,cv); const x=doc.querySelector('[data-cv="'+cv.getAttribute('data-cv')+'"]'); const cs=doc.defaultView.getComputedStyle(x);
  const bl=parseFloat(cs.borderLeftWidth)||0, bt=parseFloat(cs.borderTopWidth)||0;
  const box={left:cr.left+bl,top:cr.top+bt,w:cr.width-bl-(parseFloat(cs.borderRightWidth)||0),h:cr.height-bt-(parseFloat(cs.borderBottomWidth)||0)};
  if(box.w<1||box.h<1) throw '量不到大小（內容是空的嗎？）';
  let n=0;
  [...cv.children].forEach(k=>{
    const r=rectOf(doc,k); if(!r) return;
    const kx=doc.querySelector('[data-cv="'+k.getAttribute('data-cv')+'"]'); const ks=doc.defaultView.getComputedStyle(kx);
    const visualBox=(ks.backgroundColor!=='rgba(0, 0, 0, 0)'||ks.backgroundImage!=='none'||parseFloat(ks.borderTopWidth)>0||ks.boxShadow!=='none');
    ['margin','margin-top','margin-bottom','margin-left','margin-right','top','left','right','bottom','max-width'].forEach(p=>k.style.removeProperty(p));
    k.style.setProperty('position','absolute');
    k.style.setProperty('top',r1((r.top-box.top)/box.h*100)+'%');
    k.style.setProperty('left',r1((r.left-box.left)/box.w*100)+'%');
    k.style.setProperty('width',r1(r.width/box.w*100)+'%');
    if(visualBox&&k.tagName!=='IMG') k.style.setProperty('height',r1(r.height/box.h*100)+'%'); else if(k.tagName!=='IMG') k.style.removeProperty('height');
    n++;
  });
  ['height','min-height','max-height'].forEach(p=>cv.style.removeProperty(p));
  cv.style.setProperty('position','relative'); cv.style.setProperty('box-sizing','border-box');
  cv.style.setProperty('aspect-ratio',Math.round(cr.width)+'/'+Math.round(cr.height));
  if(!cv.style.overflow) cv.style.setProperty('overflow','hidden');
  if(doFont) frag.querySelectorAll('[style]').forEach(e=>{ const m=/^([\d.]+)px$/.exec(e.style.fontSize||''); if(m) e.style.setProperty('font-size',toClampW(parseFloat(m[1]),W)); });
  untag(frag);
  return {code:serializeDoc(frag,null),msg:'已把 '+n+' 個區塊變成圖層'};
}
async function convToFlow(src,W,doFont){
  const frag=parseFrag(src.trim());
  const cands=[...frag.querySelectorAll('*')].filter(e=>(e.style.position||'')==='relative'&&[...e.children].some(k=>(k.style.position||'')==='absolute'));
  const canv=cands.filter(e=>!cands.some(o=>o!==e&&o.contains(e)));
  if(!canv.length) throw '找不到畫布（position:relative 裡面有 absolute 圖層的區塊）';
  tagAll(frag);
  const doc=await measure(serializeDoc(frag,null),W);
  let moved=0;
  canv.forEach(cv=>{
    const cr=rectOf(doc,cv); if(!cr) return;
    const x=doc.querySelector('[data-cv="'+cv.getAttribute('data-cv')+'"]'); const cs=doc.defaultView.getComputedStyle(x);
    const top0=cr.top+(parseFloat(cs.borderTopWidth)||0), left0=cr.left+(parseFloat(cs.borderLeftWidth)||0);
    const W0=cr.width-(parseFloat(cs.borderLeftWidth)||0)-(parseFloat(cs.borderRightWidth)||0);
    const bottom0=cr.bottom-(parseFloat(cs.borderBottomWidth)||0);
    const items=[];
    [...cv.children].forEach(k=>{
      if((k.style.position||'')!=='absolute') return;
      const deco=!k.textContent.trim()&&k.tagName!=='IMG'&&!k.querySelector('img');
      if(deco) return;
      const r=rectOf(doc,k); if(r) items.push({k,r});
    });
    items.sort((a,b)=>a.r.top-b.r.top||a.r.left-b.r.left);
    // 垂直重疊的放同一列
    const rows=[];
    items.forEach(it=>{ const row=rows[rows.length-1]; if(row&&it.r.top<row.bottom-4){ row.items.push(it); row.bottom=Math.max(row.bottom,it.r.bottom); } else rows.push({items:[it],top:it.r.top,bottom:it.r.bottom}); });
    let prev=top0;
    const clean=k=>{ ['position','top','left','right','bottom','inset','margin'].forEach(p=>k.style.removeProperty(p)); if(/%$/.test(k.style.height||'')){ k.style.removeProperty('height'); } };
    rows.forEach(row=>{
      const gap=Math.max(0,Math.round(row.top-prev));
      if(row.items.length===1){
        const {k,r}=row.items[0]; const hadBox=/%$/.test(k.style.height||'');
        clean(k); k.style.setProperty('position','relative');
        k.style.setProperty('margin-top',gap+'px'); k.style.setProperty('margin-left',r1((r.left-left0)/W0*100)+'%');
        k.style.setProperty('width',r1(r.width/W0*100)+'%');
        if(hadBox) k.style.setProperty('height',Math.round(r.height)+'px');
        cv.appendChild(k);
      }else{
        const wrap=document.createElement('div');
        wrap.setAttribute('style',`position:relative;display:flex;align-items:flex-start;margin-top:${gap}px;`);
        row.items.sort((a,b)=>a.r.left-b.r.left);
        let pr=left0;
        row.items.forEach(({k,r})=>{ const hadBox=/%$/.test(k.style.height||''); clean(k);
          k.style.setProperty('flex','0 0 auto'); k.style.setProperty('width',r1(r.width/W0*100)+'%');
          k.style.setProperty('margin-left',r1((r.left-pr)/W0*100)+'%'); k.style.setProperty('margin-top',Math.round(r.top-row.top)+'px');
          if(hadBox) k.style.setProperty('height',Math.round(r.height)+'px');
          pr=r.right; wrap.appendChild(k); });
        cv.appendChild(wrap);
      }
      prev=row.bottom; moved+=row.items.length;
    });
    ['aspect-ratio','height','min-height','padding','padding-top','padding-bottom'].forEach(p=>cv.style.removeProperty(p));
    cv.style.setProperty('padding-bottom',Math.max(0,Math.round(bottom0-prev))+'px');
  });
  if(doFont) frag.querySelectorAll('[style]').forEach(e=>{ const mx=parseClampMax(e.style.fontSize); if(mx) e.style.setProperty('font-size',mx+'px'); });
  untag(frag);
  return {code:serializeDoc(frag,null),msg:'已把 '+moved+' 個圖層排成固定版面（沒有文字的裝飾層保留原位）'};
}
let cvDir='toCanvas', cvWhich='out';
function cvCounts(){
  const a=$('#cvIn').value.length, b=$('#cvOut').value.length;
  $('#cvInCount').textContent=a.toLocaleString()+' 字元';
  $('#cvOutCount').textContent=b?(b.toLocaleString()+' 字元（'+(b-a>=0?'+':'')+(b-a).toLocaleString()+'）'):'—';
}
$('#cvDir').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; cvDir=b.dataset.d; $$('#cvDir button').forEach(x=>x.classList.toggle('on',x===b)); });
$('#cvWhich').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; cvWhich=b.dataset.w; $$('#cvWhich button').forEach(x=>x.classList.toggle('on',x===b)); cvPreview(); });
$('#cvIn').addEventListener('input',()=>{ cvCounts(); clearTimeout(cvDeb); cvDeb=setTimeout(()=>{ if(cvWhich==='in') cvPreview(); },500); });
let cvDeb=null;
$('#cvRun').addEventListener('click',async()=>{
  const src=$('#cvIn').value; if(!src.trim()){ toast('先在左邊貼上 code'); return; }
  const W=Math.max(300,Math.min(1400,parseInt($('#cvBase').value)||780));
  try{
    const r=cvDir==='toCanvas'?await convToCanvas(src,W,$('#cvFont').checked):await convToFlow(src,W,$('#cvFont').checked);
    $('#cvOut').value=r.code; cvCounts(); cvWhich='out'; $$('#cvWhich button').forEach(x=>x.classList.toggle('on',x.dataset.w==='out')); cvPreview(); toast(r.msg);
  }catch(err){ toast('⚠ '+(typeof err==='string'?err:'轉換失敗')); console.error(err); }
});
$('#cvFromEditor').addEventListener('click',()=>{ $('#cvIn').value=codeEl.value; cvCounts(); if(cvWhich==='in') cvPreview(); toast('已帶入目前「'+MODES[mode].name+'」的 code'); });
$('#cvCopy').addEventListener('click',()=>{ if(!$('#cvOut').value){ toast('還沒有結果'); return; } copyText($('#cvOut').value,'<b>已複製</b>轉換結果'); });
$('#cvToEditor').addEventListener('click',()=>{ const v=$('#cvOut').value; if(!v){ toast('還沒有結果'); return; } pushUndo(); codeEl.value=v; clearSelection(); parseAndRender(); toast('已放進編輯器（可按 ↩ 復原）'); });
$('#cvSwap').addEventListener('click',()=>{ const v=$('#cvOut').value; if(!v) return; $('#cvIn').value=v; $('#cvOut').value=''; cvCounts(); cvWhich='in'; $$('#cvWhich button').forEach(x=>x.classList.toggle('on',x.dataset.w==='in')); cvPreview(); });
let cvExtra=[]; try{ const x=JSON.parse(load('cdb3_cvextra')||'[]'); if(Array.isArray(x)) cvExtra=x; }catch(e){}
let cvOff=new Set(); try{ const x=JSON.parse(load('cdb3_cvoff')||'[]'); if(Array.isArray(x)) cvOff=new Set(x); }catch(e){}
function cvAll(){ return [...new Set([390,600,780,...wSlots.filter(Boolean).map(Number),...cvExtra])].sort((a,b)=>a-b); }
function cvWidths(){ const w=cvAll().filter(x=>!cvOff.has(x)); return w.length?w:[780]; }
function renderCvWs(){
  const box=$('#cvWs'); if(!box) return;
  box.replaceChildren(...cvAll().map(w=>{ const b=document.createElement('button'); b.className='cvW'+(cvOff.has(w)?'':' on'); b.textContent=w;
    if(cvExtra.includes(w)){ const x=document.createElement('i'); x.textContent='×'; x.title='移除'; x.addEventListener('click',e=>{ e.stopPropagation(); cvExtra=cvExtra.filter(v=>v!==w); store('cdb3_cvextra',JSON.stringify(cvExtra)); renderCvWs(); cvPreview(); }); b.appendChild(x); }
    b.addEventListener('click',()=>{ if(cvOff.has(w)) cvOff.delete(w); else cvOff.add(w); store('cdb3_cvoff',JSON.stringify([...cvOff])); renderCvWs(); cvPreview(); });
    return b; }));
}
function cvAddW(){ const v=parseInt($('#cvWIn').value); if(!(v>=200&&v<=2000)){ toast('寬度請輸入 200～2000'); return; } if(!cvAll().includes(v)){ cvExtra.push(v); cvExtra=cvExtra.slice(-4); store('cdb3_cvextra',JSON.stringify(cvExtra)); } cvOff.delete(v); $('#cvWIn').value=''; renderCvWs(); cvPreview(); }
$('#cvWAdd').addEventListener('click',cvAddW);
$('#cvWIn').addEventListener('keydown',e=>{ if(e.key==='Enter') cvAddW(); });
async function cvPreview(){
  renderCvWs();
  if(!$('#app').classList.contains('convOn')) return;
  const html=cleanForPreview(cvWhich==='in'?$('#cvIn').value:$('#cvOut').value);
  const box=$('#cvPrev');
  if(!html.trim()){ box.innerHTML='<div class="hint" style="padding:30px;text-align:center">'+(cvWhich==='in'?'左邊貼上 code 後，這裡會出現三種寬度的樣子':'按「轉換」後，這裡會出現結果在三種寬度的樣子')+'</div>'; return; }
  CSS_CACHE=null;
  const gap=18, avail=box.clientWidth-gap*(cvWidths().length+1);
  const s=Math.min(1,avail/cvWidths().reduce((a,b)=>a+b,0));
  box.innerHTML='';
  for(const W of cvWidths()){
    const cell=document.createElement('div'); cell.className='cvCell';
    cell.innerHTML=`<div class="cvLab">${W}px</div><div class="cvFrameWrap" style="width:${Math.round(W*s)}px"><iframe style="width:${W}px;height:600px;transform:scale(${s})"></iframe></div>`;
    box.appendChild(cell);
    const ifr=cell.querySelector('iframe');
    loadFrame(ifr,html,W).then(doc=>{ setTimeout(()=>{ const h=Math.max(60,(doc.getElementById('page')||doc.body).offsetHeight); ifr.style.height=h+'px'; cell.querySelector('.cvFrameWrap').style.height=Math.round(h*s)+'px'; },120); });
  }
}
window.addEventListener('resize',()=>{ clearTimeout(cvDeb); cvDeb=setTimeout(cvPreview,300); });
cvCounts();
imgRatio.set(PH.land,400/260); imgRatio.set(PH.sea,400/260); imgRatio.set(PH.room,400/260); imgRatio.set(PH.port,300/360);
renderLib();
