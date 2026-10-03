'use strict';
/* ═══════════ 14. 屬性面板 ═══════════ */
function getT(node,kind){
  const t=node.style.transform||'';
  const m=t.match(kind==='rotate'?/rotate\(\s*(-?[\d.]+)deg\s*\)/:/scale\(\s*(-?[\d.]+)\s*\)/);
  return m?parseFloat(m[1]):null;
}
function setT(node,kind,val,isDefault){
  let t=node.style.transform||'';
  const re=kind==='rotate'?/rotate\(\s*-?[\d.]+deg\s*\)\s*/:/scale\(\s*-?[\d.]+\s*\)\s*/;
  t=t.replace(re,'').trim();
  if(!isDefault) t=(t+' '+(kind==='rotate'?`rotate(${val}deg)`:`scale(${val})`)).trim();
  if(t) node.style.transform=t; else node.style.removeProperty('transform');
}
function populateProps(){
  const n=selNode(); if(!n) return;
  filling=true;
  const st=n.style, c=selClone();
  $('#selTag').textContent=n.tagName.toLowerCase();
  $('#selClass').value=n.getAttribute('class')||'';
  const isImgSel=n.tagName==='IMG'; const bgU=isImgSel?null:bgUrlOf(n);
  $('#imgSrcRow').style.display=(isImgSel||bgU)?'':'none';
  $('#imgSrcLab').textContent=isImgSel?'圖片網址':'背景圖網址';
  if(isImgSel||bgU){ const src=isImgSel?(n.getAttribute('src')||''):bgU; $('#inImgSrc').value=src; $('#inImgSrc').title=src; }
  const op=st.opacity!==''?Math.round(parseFloat(st.opacity)*100):100;
  $('#inOpacity').value=op; $('#nOpacity').value=op;
  const rot=getT(n,'rotate')??0; $('#inRotate').value=rot; $('#nRotate').value=rot;
  const sc=Math.round((getT(n,'scale')??1)*100); $('#inScale').value=sc; $('#nScale').value=sc;
  fillRadius(st.borderRadius||'');
  const isAbs=c&&getComputedStyle(c).position==='absolute';
  $('#posGroup').style.display=isAbs?'':'none';
  $('#inTop').value=st.top||''; $('#inLeft').value=st.left||''; $('#inBottom').value=st.bottom||''; $('#inRight').value=st.right||'';
  $('#inW').value=st.width||''; $('#inH').value=st.height||'';
  $('#inMargin').value=st.margin||''; $('#inPadding').value=st.padding||'';
  const clampMax=parseClampMax(st.fontSize);
  $('#inFs').value=clampMax?clampMax+'px':(st.fontSize||'');
  $('#inFs').title=clampMax?'自動等比縮放（clamp）：顯示的是最大字級':'';
  $('#inLs').value=st.letterSpacing||''; $('#inLh').value=st.lineHeight||'';
  $('#inFw').value=['400','700','900'].includes(st.fontWeight)?st.fontWeight:'';
  $('#inColor').value=st.color||'';
  setChip('#chipColor',st.color||'');
  $('#inBg').value=st.background||st.backgroundColor||'';
  setChip('#chipBg',st.backgroundColor||st.background||'');
  $('#inBorder').value=st.border||'';
  $('#segAlign').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.al===(st.textAlign||'x')));
  // 動畫（可能掛在內層）
  const animEl=hasAnimCls(n)?n:((n.children.length===1&&hasAnimCls(n.firstElementChild))?n.firstElementChild:n);
  const cls=(animEl.getAttribute('class')||'').split(/\s+/).filter(Boolean);
  const animName=cls.map(x=>/^animate__(?!animated$|infinite$|slow$|slower$|fast$|faster$|delay)(.+)/.exec(x)).filter(Boolean).map(m=>m[1]).find(x=>ANIM_NAMES.has(x))||'';
  $('#inAnim').value=animName;
  $('#inAnimSpeed').value=cls.find(x=>['animate__slow','animate__slower','animate__fast','animate__faster'].includes(x))||'';
  $('#inAnimInf').checked=cls.includes('animate__infinite');
  $('#inStyle').value=n.getAttribute('style')||'';
  renderDecoColors();
  filling=false;
}
function setStyleProp(prop,val){
  const n=selNode(); if(!n||filling) return;
  if(val===''||val==null) n.style.removeProperty(prop); else n.style.setProperty(prop,val);
  writeback(n);
}
function bindText(id,prop){ $(id).addEventListener('change',e=>setStyleProp(prop,e.target.value.trim())); }
bindText('#inTop','top'); bindText('#inLeft','left'); bindText('#inBottom','bottom'); bindText('#inRight','right');
bindText('#inW','width'); bindText('#inH','height');
bindText('#inMargin','margin'); bindText('#inPadding','padding');
$('#inFs').addEventListener('change',e=>{
  const n=selNode(); if(!n||filling) return;
  let v=e.target.value.trim();
  const num=/^(\d+(?:\.\d+)?)(px)?$/.exec(v);
  if(num&&containerCanvasOf(n)&&n.style.position!=='relative'){ v=pxToClamp(parseFloat(num[1])); } // 畫布內 → 自動等比縮放
  else if(num) v=num[1]+'px';
  setStyleProp('font-size',v);
});
bindText('#inLs','letter-spacing'); bindText('#inLh','line-height');
bindText('#inColor','color'); bindText('#inBorder','border');
$('#inFw').addEventListener('change',e=>setStyleProp('font-weight',e.target.value));
$('#inBg').addEventListener('change',e=>{ const v=e.target.value.trim(); const n=selNode(); if(!n||filling)return; n.style.removeProperty('background'); n.style.removeProperty('background-color'); if(v) n.style.setProperty('background',v); writeback(n); });
$('#segAlign').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b)return; setStyleProp('text-align',b.dataset.al); });

/* 顏色 chip（確認式）＋「改」跳到左邊調色盤（左為主） */
function setChip(sel,val){ const el=$(sel); if(!el) return; const i=el.querySelector('i')||el.appendChild(document.createElement('i')); i.style.background=val||'transparent'; el.title=val||'（未設定）'; }
function loadIntoPalette(val){
  const m=/#([0-9a-fA-F]{6})/.exec(val||''); const hex=m?('#'+m[1]):'#f0b03c';
  $('#colMain').value=hex; $('#colHex').value=hex;
  const a=/rgba?\([^)]*,\s*([\d.]+)\s*\)/.exec(val||''); $('#colAlpha').value=a?Math.round(parseFloat(a[1])*100):100;
  refreshColor();
  switchTab('color');
}
function switchTab(name){ if(name==='color'){ openColorSection(); return; } openDrawer(name); }


/* 圓角：滑桿＋數字＋單位，或展開四角分別調 */
let radius4=false;
function fillRadius(v){
  const parts=(v||'').trim().split(/\s+/);
  if(parts.length>=2){ // 四角
    radius4=true; $('#radius4Row').style.display='';
    const p=[parts[0],parts[1],parts[2]||parts[0],parts[3]||parts[1]];
    ['#rTL','#rTR','#rBR','#rBL'].forEach((id,i)=>$(id).value=parseFloat(p[i])||0);
  }else{
    const m=/^(-?[\d.]+)(px|%)?$/.exec((v||'').trim());
    const num=m?parseFloat(m[1]):0, unit=(m&&m[2])||'px';
    $('#inRadiusR').value=Math.min(150,num); $('#nRadius').value=num; $('#radiusUnit').value=unit;
  }
}
function commitRadius(){
  const n=selNode(); if(!n||filling) return;
  if(radius4){
    const u=$('#radiusUnit').value;
    const v=['#rTL','#rTR','#rBR','#rBL'].map(id=>(parseFloat($(id).value)||0)+u).join(' ');
    n.style.setProperty('border-radius',v);
  }else{
    const num=parseFloat($('#nRadius').value)||0, u=$('#radiusUnit').value;
    if(num<=0) n.style.removeProperty('border-radius'); else n.style.setProperty('border-radius',num+u);
  }
  writeback(n);
}
$('#inRadiusR').addEventListener('input',()=>{ if(filling)return; $('#nRadius').value=$('#inRadiusR').value; const c=selClone(); if(c) c.style.borderRadius=$('#nRadius').value+$('#radiusUnit').value; });
$('#inRadiusR').addEventListener('change',commitRadius);
$('#nRadius').addEventListener('input',()=>{ if(filling)return; $('#inRadiusR').value=Math.min(150,parseFloat($('#nRadius').value)||0); });
$('#nRadius').addEventListener('change',commitRadius);
$('#radiusUnit').addEventListener('change',commitRadius);
['#rTL','#rTR','#rBR','#rBL'].forEach(id=>$(id).addEventListener('change',commitRadius));
$('#radius4Toggle').addEventListener('click',()=>{ radius4=!radius4; $('#radius4Row').style.display=radius4?'':'none'; $('#radius4Toggle').classList.toggle('on',radius4); if(radius4){ const v=parseFloat($('#nRadius').value)||0; ['#rTL','#rTR','#rBR','#rBL'].forEach(id=>$(id).value=v); } commitRadius(); });
$('#selClass').addEventListener('change',e=>{ const n=selNode(); if(!n||filling)return; const v=e.target.value.trim(); if(v) n.setAttribute('class',v); else n.removeAttribute('class'); writeback(n); });
$('#inStyle').addEventListener('change',e=>{ const n=selNode(); if(!n||filling)return; const v=e.target.value.trim(); if(v) n.setAttribute('style',v); else n.removeAttribute('style'); writeback(n); });

/* 滑桿＋數字輸入連動：拖動即時預覽、放開/輸入數字寫回 */
function bindSlider(id,numId,live,commit){
  const el=$(id), nu=$(numId);
  const clamp=v=>Math.max(+el.min,Math.min(+el.max,v));
  el.addEventListener('input',e=>{ nu.value=e.target.value; const c=selClone(); if(c&&!filling) live(c,+e.target.value); });
  el.addEventListener('change',e=>{ const n=selNode(); if(n&&!filling){ const rn=commit(n,+e.target.value)||n; writeback(rn); } });
  nu.addEventListener('input',()=>{ el.value=clamp(+nu.value||0); const c=selClone(); if(c&&!filling) live(c,+nu.value||0); });
  nu.addEventListener('change',()=>{ const n=selNode(); if(n&&!filling){ const rn=commit(n,+nu.value||0)||n; writeback(rn); } });
}
bindSlider('#inOpacity','#nOpacity',
  (c,v)=>{ c.style.opacity=v/100; },
  (n,v)=>{ if(v>=100) n.style.removeProperty('opacity'); else n.style.setProperty('opacity',String(Math.round(v)/100)); });
bindSlider('#inRotate','#nRotate',
  (c,v)=>{ setT(c,'rotate',v,v===0); },
  (n,v)=>{ const h=transformHostFor(n); setT(h,'rotate',v,v===0); return h; });
bindSlider('#inScale','#nScale',
  (c,v)=>{ setT(c,'scale',v/100,v===100); },
  (n,v)=>{ const h=transformHostFor(n); setT(h,'scale',Math.round(v)/100,v===100); return h; });

/* 動畫（屬性面板內）——動畫與 transform 互不洗掉：衝突時自動分層 */
const ANIM_NAMES=new Set(ANIMS.flatMap(g=>g.list.map(x=>x[0])));
const POS_PROPS=['position','top','left','right','bottom','width','height','max-width','z-index','margin'];
function hasAnimCls(n){ return /(^|\s)animate__/.test(n.getAttribute('class')||''); }
function hasRS(n){ return /(rotate|scale)\(/.test(n.style.transform||''); }
function stripAnimCls(el){
  if(!el) return [];
  const all=(el.getAttribute('class')||'').split(/\s+/).filter(Boolean);
  const anim=all.filter(x=>x.startsWith('animate__'));
  const keep=all.filter(x=>!x.startsWith('animate__'));
  if(keep.length) el.setAttribute('class',keep.join(' ')); else el.removeAttribute('class');
  return anim;
}
function addCls(el,cls){
  if(!cls.length) return;
  const all=(el.getAttribute('class')||'').split(/\s+/).filter(Boolean);
  el.setAttribute('class',[...all,...cls.filter(c=>!all.includes(c))].join(' '));
}
function wrapImgOut(node){ // img 外包一層拿走定位/transform，回傳外層
  const w=document.createElement('div');
  POS_PROPS.concat(['transform','opacity']).forEach(p=>{ const v=node.style.getPropertyValue(p); if(v){ w.style.setProperty(p,v); node.style.removeProperty(p); } });
  if(!w.style.position) w.style.position='relative';
  node.style.setProperty('width','100%'); node.style.setProperty('display','block');
  node.parentNode.insertBefore(w,node); w.appendChild(node);
  return w;
}
function innerOf(node){ // 容器的內層（沒有就把子內容包一層）
  if(node.children.length===1&&node.childNodes.length===1) return node.firstElementChild;
  const inner=document.createElement('div');
  while(node.firstChild) inner.appendChild(node.firstChild);
  node.appendChild(inner);
  return inner;
}
function animTargetFor(node){ // 動畫要掛哪：node 有 transform → 掛內層/img 本體
  if(!hasRS(node)) return node;
  if(node.tagName==='IMG'){ wrapImgOut(node); return node; }
  return innerOf(node);
}
function transformHostFor(node){ // transform 要設在哪：node 有動畫 → 動畫下放、transform 掛外層
  if(!hasAnimCls(node)) return node;
  if(node.tagName==='IMG'){ const w=wrapImgOut(node); return w; }
  const anim=stripAnimCls(node);
  addCls(innerOf(node),anim);
  return node;
}
function applyAnimTo(node,name,speed,inf){
  stripAnimCls(node);
  if(node.firstElementChild&&node.children.length===1&&hasAnimCls(node.firstElementChild)) stripAnimCls(node.firstElementChild);
  if(name){
    const target=animTargetFor(node);
    const cls=['animate__animated','animate__'+name]; if(speed) cls.push(speed); if(inf) cls.push('animate__infinite');
    addCls(target,cls);
  }
  writeback(node);
}
function propAnimChanged(){ const n=selNode(); if(!n||filling)return; applyAnimTo(n,$('#inAnim').value,$('#inAnimSpeed').value,$('#inAnimInf').checked); }
$('#inAnim').addEventListener('change',propAnimChanged);
$('#inAnimSpeed').addEventListener('change',propAnimChanged);
$('#inAnimInf').addEventListener('change',propAnimChanged);
$('#inAnimClear').addEventListener('click',()=>{ const n=selNode(); if(!n)return; applyAnimTo(n,'',null,false); toast('已移除動畫 class'); });

/* 面板動作 */
$('#pbSelectCode').addEventListener('click',()=>{
  setCodeOpen(true);
  const r=ranges[selectedUid];
  if(!r){ toast('這個元素對不到原始碼位置，改用「複製區塊code」'); return; }
  codeEl.focus(); codeEl.setSelectionRange(r.start,r.end); scrollCodeTo(r.start);
  toast('已在下方選取，<b>Ctrl+C</b> 帶走');
});
$('#pbCopy').addEventListener('click',()=>{ const n=selNode(); if(n) copyText(serializeNode(n),'<b>已複製</b>區塊 code'); });
$('#pbDup').addEventListener('click',()=>{ const n=selNode(); if(!n)return; const cp=n.cloneNode(true); n.parentNode.insertBefore(cp,n.nextSibling); n.parentNode.insertBefore(document.createTextNode('\n'),cp); writeback(cp); toast('<b>已複製一份</b>在原元素後面'); });
$('#pbDel').addEventListener('click',()=>{ const n=selNode(); if(!n)return; n.remove(); clearSelection(); writeback(null); toast('<b>已刪除</b>'); });

/* 圖片網址（選到 img 時顯示） */
$('#inImgSrc').addEventListener('change',e=>{
  const n=selNode(); if(!n||filling) return;
  const v=e.target.value.trim();
  if(n.tagName==='IMG'){ if(v) n.setAttribute('src',v); }
  else{ const old=bgUrlOf(n); if(!old||!v) return; n.setAttribute('style',(n.getAttribute('style')||'').split(old).join(v)); }
  writeback(n); toast('<b>圖片已更換</b>');
});

/* 疊層（z 軸前後，同一位置的視覺疊序） */
function restack(dir){
  const n=selNode(); if(!n){ toast('先選取一個圖層'); return; }
  const c=selClone();
  if(!c||getComputedStyle(c).position!=='absolute'){ toast('疊層前後只對畫布內的圖層（absolute）有作用；流式區塊請用「圖層」頁籤調順序'); return; }
  const p=n.parentNode; if(!p||!p.children) return;
  const kids=[...p.children];
  if(kids.length<2){ toast('這一層只有它自己，沒有疊層可調'); return; }
  const zOf=el=>{ const z=parseInt(el.style.zIndex||''); return isNaN(z)?null:z; };
  const anyZ=kids.some(s=>zOf(s)!=null);
  if(anyZ){
    const zs=kids.map(el=>zOf(el)??0);
    const mx=Math.max(...zs), mn=Math.min(...zs);
    if(dir==='front'||dir==='up') n.style.zIndex=String(mx+1);
    else if(mn-1>=0) n.style.zIndex=String(mn-1);
    else{ kids.forEach(el=>{ if(el!==n) el.style.zIndex=String((zOf(el)??0)+1); }); n.style.zIndex='0'; }
  }else{
    if(dir==='front') p.appendChild(n);
    else if(dir==='back') p.insertBefore(n,p.firstChild);
    else if(dir==='up'){ const nx=nextElSib(n); if(!nx){ toast('已經在最前面'); return; } p.insertBefore(n,nx.nextSibling); }
    else{ const pr=prevElSib(n); if(!pr){ toast('已經在最後面'); return; } p.insertBefore(n,pr); }
  }
  writeback(n); toast('<b>疊層已調整</b>');
}
$('#stFront').addEventListener('click',()=>restack('front'));
$('#stUp').addEventListener('click',()=>restack('up'));
$('#stDn').addEventListener('click',()=>restack('down'));
$('#stBack').addEventListener('click',()=>restack('back'));

/* 轉為畫布：把選取區塊變成 relative 容器，直接子元素依現在位置變成 absolute 圖層 */
$('#pbToCanvas').addEventListener('click',()=>{
  const n=selNode(), c=selClone(); if(!n||!c){ toast('先選一個區塊'); return; }
  const mkids=[...n.children], ckids=[...c.children];
  const cr=c.getBoundingClientRect(); const W=cr.width||1, H=cr.height||1;
  if(!mkids.length){
    n.style.position='relative'; if(!n.style.overflow) n.style.overflow='hidden';
    if(!n.style.height&&!n.style.aspectRatio) n.style.minHeight='220px';
    writeback(n); toast('<b>已變成空白畫布</b>——現在可以往裡面加圖層'); return;
  }
  if(mkids.length!==ckids.length){ // 對不齊（有被過濾的標籤）→ 只把容器變定位host
    n.style.position='relative'; if(!n.style.overflow) n.style.overflow='hidden';
    writeback(n); toast('已設為畫布容器（內容含特殊標籤，未自動轉圖層）'); return;
  }
  const rects=ckids.map(ck=>ck.getBoundingClientRect());
  n.style.position='relative'; if(!n.style.overflow) n.style.overflow='hidden';
  if(!n.style.height&&!n.style.aspectRatio) n.style.aspectRatio=Math.round(W)+'/'+Math.round(H);
  mkids.forEach((k,i)=>{
    const r=rects[i];
    const top=(r.top-cr.top)/H*100, left=(r.left-cr.left)/W*100, w=r.width/W*100;
    k.style.position='absolute';
    k.style.top=Math.round(top*10)/10+'%';
    k.style.left=Math.round(left*10)/10+'%';
    k.style.width=Math.round(w*10)/10+'%';
    k.style.removeProperty('margin');
  });
  writeback(n);
  toast('<b>已轉為畫布</b>——裡面 '+mkids.length+' 個元素現在都能自由拖曳了');
});

/* 裝飾／背景重上色 */
function renderDecoColors(){
  const grp=$('#decoColorGrp'), list=$('#decoColorList'); const n=selNode();
  if(!n){ grp.style.display='none'; return; }
  const raw=n.getAttribute('style')||'';
  const bgPart=raw.split(';').filter(d=>/background|box-shadow|border|gradient|url\(/i.test(d)).join(';');
  const found=[...new Set((bgPart.match(/%23[0-9a-fA-F]{6}|#[0-9a-fA-F]{6}/g)||[]))];
  if(!found.length){ grp.style.display='none'; return; }
  grp.style.display='';
  list.replaceChildren(...found.map(orig=>{
    const hex=orig.replace('%23','#');
    const wrap=document.createElement('div'); wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:2px';
    const inp=document.createElement('input'); inp.type='color'; inp.value=hex; inp.style.cssText='width:34px;height:26px;padding:1px;border:1px solid var(--line);border-radius:6px;background:none;cursor:pointer';
    const lb=document.createElement('span'); lb.textContent=hex; lb.style.cssText='font:9px var(--mono);color:var(--faint)';
    inp.addEventListener('change',()=>{
      const cur=selNode(); if(!cur) return;
      const nv=orig.startsWith('%23')?inp.value.replace('#','%23'):inp.value;
      const r=cur.getAttribute('style')||'';
      cur.setAttribute('style', r.split(orig).join(nv));
      writeback(cur);
    });
    wrap.appendChild(inp); wrap.appendChild(lb);
    return wrap;
  }));
}
/* ═══════════ 15. 插入引擎：畫布內＝圖層、否則接在選取區塊後 ═══════════ */
function stripComments(html){ return html.replace(/<!--[\s\S]*?-->[ \t]*\n?/g,'').replace(/\n{3,}/g,'\n\n').trim(); }
function parseFrag(html){ const t=document.createElement('template'); t.innerHTML=html; return t.content; }
function topBlockOf(node){ let n=node; while(n&&n.parentNode&&n.parentNode!==model) n=n.parentNode; return (n&&n.parentNode===model)?n:null; }
function containerCanvasOf(node){
  let n=node;
  while(n&&n.nodeType===1){ if((n.style.position||'')==='relative') return n; n=(n.parentNode&&n.parentNode.nodeType===1)?n.parentNode:null; }
  return null;
}
function splitDecls(css){
  const out=[]; let cur='',depth=0,q=null;
  for(const ch of css){
    if(q){ cur+=ch; if(ch===q) q=null; continue; }
    if(ch==="'"||ch==='"'){ q=ch; cur+=ch; continue; }
    if(ch==='(') depth++;
    if(ch===')') depth--;
    if(ch===';'&&depth===0){ out.push(cur); cur=''; continue; }
    cur+=ch;
  }
  if(cur.trim()) out.push(cur);
  return out.map(s=>s.trim()).filter(Boolean);
}
function mergeCss(node,css){ // 只補上元素還沒設定的屬性，絕不洗掉既有設定
  let added=0,skipped=0;
  const existing=[...node.style];
  for(const d of splitDecls(css)){
    const i=d.indexOf(':'); if(i<0) continue;
    const prop=d.slice(0,i).trim().toLowerCase(), val=d.slice(i+1).trim();
    if(node.style.getPropertyValue(prop)){ skipped++; continue; }
    const base=prop.split('-')[0];
    if((base==='background'||base==='border'||base==='margin'||base==='padding')&&existing.some(p=>p.split('-')[0]===base)){ skipped++; continue; }
    node.style.setProperty(prop,val); added++;
  }
  return {added,skipped};
}
function lastCanvas(){
  const all=[...model.querySelectorAll('*')];
  for(let i=all.length-1;i>=0;i--) if(isCanvasNode(all[i])) return all[i];
  return null;
}
function pxToClamp(px){ px=Math.round(px); return `clamp(${Math.max(9,Math.round(px*0.55))}px,${+(px/7.8).toFixed(2)}vw,${px}px)`; }
function parseClampMax(v){ const m=/^clamp\([^,]+,[^,]+,\s*([\d.]+)px\s*\)$/.exec((v||'').trim()); return m?parseFloat(m[1]):null; }
let layerDrop={x:30,y:26};
/* 插入時換行，不要接成一長條 */
function nlAppend(p,node){ const l=p.lastChild; if(!(l&&l.nodeType===3&&/\n[ \t]*$/.test(l.nodeValue))) p.appendChild(document.createTextNode('\n')); p.appendChild(node); p.appendChild(document.createTextNode('\n')); }
function insertSmart(html,opt){
  opt=opt||{};
  html=stripComments(html);
  html=adaptForMode(html);
  const frag=parseFrag(html);
  const els=[...frag.children];
  if(!els.length){ toast('沒有可插入的內容'); return null; }
  const sel=selNode();
  let cv=opt.canvas!==undefined?opt.canvas:(opt.forceFlow?null:(sel?containerCanvasOf(sel):null));
  if(cv==null&&opt.canvas===undefined&&!opt.forceFlow&&!sel) cv=lastCanvas(); // 沒選任何東西 → 預設進最後一塊畫布
  if(cv){ // → 圖層
    let layer;
    if(els.length===1&&/absolute/.test(els[0].style.position||'')){ layer=els[0]; nlAppend(cv,frag); }
    else{
      layer=document.createElement('div');
      layer.style.cssText='position:absolute;width:60%;';
      layer.appendChild(frag);
      nlAppend(cv,layer);
    }
    const x=opt.x!=null?opt.x:layerDrop.x, y=opt.y!=null?opt.y:layerDrop.y;
    if(!layer.style.top&&!layer.style.bottom) layer.style.top=Math.round(y*10)/10+'%';
    if(!layer.style.left&&!layer.style.right) layer.style.left=Math.round(x*10)/10+'%';
    if(opt.x==null){ layerDrop.x=10+(layerDrop.x-10+7)%55; layerDrop.y=10+(layerDrop.y-10+9)%55; }
    writeback(layer);
    toast('<b>已加入圖層</b>——直接拖曳定位、拖角落縮放');
    return layer;
  }
  // → 流式
  const after=opt.after!==undefined?opt.after:(sel?topBlockOf(sel):null);
  const first=els[0];
  frag.insertBefore(document.createTextNode('\n'),frag.firstChild);
  frag.appendChild(document.createTextNode('\n'));
  model.insertBefore(frag,after?after.nextSibling:null);
  writeback(first);
  toast('<b>已插入</b>'+(after?'到選取區塊之後':'到頁尾'));
  return first;
}
/* 基本元素 */
function inCanvasCtx(){ const s=selNode(); return (s?containerCanvasOf(s):null)||lastCanvas(); } // 沒選東西時預設進最後一塊畫布
$('#newText').addEventListener('click',()=>{
  const cv=inCanvasCtx();
  if(cv) insertSmart(`<div style='position:absolute;width:44%;text-align:center;font-size:${pxToClamp(20)};color:#f0b03c;letter-spacing:2px;'>雙擊編輯文字</div>`,{canvas:cv});
  else insertSmart(`<div style='padding:22px 28px;text-align:center;'><span style='font-size:15px;letter-spacing:2px;color:#d8d2c4;'>雙擊這裡編輯文字</span></div>`,{forceFlow:true});
});
$('#newBlock').addEventListener('click',()=>{
  const cv=inCanvasCtx();
  if(cv) insertSmart(`<div style='position:absolute;width:40%;height:28%;background:rgba(20,16,8,0.78);border:1px solid rgba(184,148,63,0.45);border-radius:6px;'></div>`,{canvas:cv});
  else insertSmart(`<div style='width:88%;margin:18px auto;padding:24px;background:rgba(20,16,8,0.78);border:1px solid rgba(184,148,63,0.45);border-radius:6px;'>雙擊編輯內容</div>`,{forceFlow:true});
});
$('#newCanvas').addEventListener('click',()=>{
  const el=insertSmart(`<div style='position:relative;width:100%;aspect-ratio:780/420;background:#0a0a0d;overflow:hidden;'></div>`,{forceFlow:true});
  if(el) toast('<b>畫布區塊已建立</b>——選著它再按「文字／區塊」就會變圖層');
});
$('#newSpacer').addEventListener('click',()=>insertSmart(`<div style='height:80px;'></div>`,{forceFlow:true}));

/* ═══════════ 16. 圖層樹 ═══════════ */
function labelFor(el){
  // 先找前面的註解
  let p=el.previousSibling;
  while(p&&p.nodeType===3&&!p.nodeValue.trim()) p=p.previousSibling;
  if(p&&p.nodeType===8){ const t=p.nodeValue.replace(/[═▼▲─\-—•·]/g,' ').trim(); if(t) return t.slice(0,22); }
  const cls=(el.getAttribute('class')||'').split(/\s+/).filter(x=>x&&!x.startsWith('animate__'))[0];
  if(el.tagName==='IMG'){ const s=el.getAttribute('src')||''; return '圖片 '+s.split('/').pop().slice(0,16); }
  const tx=(el.textContent||'').trim().replace(/\s+/g,' ');
  if(tx) return tx.slice(0,18);
  if(cls) return '.'+cls;
  const st=el.getAttribute('style')||'';
  if(/linear-gradient|radial-gradient/.test(st)) return '（漸層色塊）';
  if(/position:\s*absolute/.test(st)) return '（浮動層）';
  return '（空區塊）';
}
function renderTree(){
  const box=$('#treeBox'); const uidOf=new Map(modelEls.map((el,i)=>[el,i]));
  const frag=document.createDocumentFragment();
  function walkKids(parent,depth){
    for(const el of parent.children){
      const uid=uidOf.get(el);
      const row=document.createElement('button');
      row.className='trow'+(uid===selectedUid?' sel':''); row.dataset.uid=uid;
      row.style.paddingLeft=(6+depth*13)+'px';
      const bad=!ALLOWED_TAGS.has(el.tagName.toLowerCase());
      row.innerHTML=`<span class="ttag">${el.tagName.toLowerCase()}</span><span class="tlab">${esc(labelFor(el))}</span>${bad?'<span class="tbad">⚠無效</span>':''}`;
      row.addEventListener('click',()=>applySelection(uid));
      frag.appendChild(row);
      walkKids(el,depth+1);
    }
  }
  walkKids(model,0);
  box.replaceChildren(frag);
  if(!model.children.length) box.innerHTML='<div class="hint">（目前沒有內容）</div>';
}
function markTreeSel(){ $$('#treeBox .trow').forEach(r=>r.classList.toggle('sel',+r.dataset.uid===selectedUid)); updateTreeTools(); }
function updateTreeTools(){
  const n=selNode();
  const prevEl=n?prevElSib(n):null, nextEl=n?nextElSib(n):null;
  $('#tUp').disabled=!prevEl; $('#tDown').disabled=!nextEl;
  $('#tOut').disabled=!(n&&n.parentNode&&n.parentNode.nodeType===1);
  $('#tIn').disabled=!prevEl;
  $('#tDup').disabled=!n; $('#tDel').disabled=!n;
}
function prevElSib(n){ let p=n.previousSibling; while(p&&p.nodeType!==1)p=p.previousSibling; return p; }
function nextElSib(n){ let p=n.nextSibling; while(p&&p.nodeType!==1)p=p.nextSibling; return p; }
/* 把元素連同前面的說明註解一起搬 */
function unitOf(n){
  const arr=[n]; let p=n.previousSibling;
  if(p&&p.nodeType===3&&!p.nodeValue.trim()){ const ws=p; p=p.previousSibling; if(p&&p.nodeType===8){ arr.unshift(ws); } }
  if(p&&p.nodeType===8){ arr.unshift(p); }
  return arr;
}
function moveUnit(n,refParent,refNode){ // 插到 refParent 內、refNode 之前（refNode 可為 null＝末尾）
  const unit=unitOf(n); const frag=document.createDocumentFragment();
  unit.forEach(x=>frag.appendChild(x)); // appendChild 會自動從原位移除
  refParent.insertBefore(frag,refNode);
}
$('#tUp').addEventListener('click',()=>{ const n=selNode(); const p=prevElSib(n); if(!p)return; moveUnit(n,n.parentNode,unitOf(p)[0]); writeback(n); });
$('#tDown').addEventListener('click',()=>{ const n=selNode(); const x=nextElSib(n); if(!x)return; moveUnit(n,n.parentNode,x.nextSibling); writeback(n); });
$('#tOut').addEventListener('click',()=>{ const n=selNode(); const pa=n.parentNode; if(!pa||pa.nodeType!==1)return; moveUnit(n,pa.parentNode,pa.nextSibling); writeback(n); });
$('#tIn').addEventListener('click',()=>{ const n=selNode(); const p=prevElSib(n); if(!p)return; moveUnit(n,p,null); writeback(n); });
$('#tDup').addEventListener('click',()=>{ const n=selNode(); if(!n)return; const cp=n.cloneNode(true); n.parentNode.insertBefore(cp,n.nextSibling); n.parentNode.insertBefore(document.createTextNode('\n'),cp); writeback(cp); });
$('#tDel').addEventListener('click',()=>{ const n=selNode(); if(!n)return; n.remove(); clearSelection(); writeback(null); });

/* ═══════════ 17. 部件庫 ═══════════ */
(function buildParts(){
  const root=$('#partsList');
  PARTS.forEach(grp=>{
    const h=document.createElement('h4'); h.textContent=grp.cat; root.appendChild(h);
    grp.items.forEach(it=>{
      const d=document.createElement('div'); d.className='pitem';
      d.innerHTML=`<button class="phead" title="點＝展開預覽；按住拖到預覽＝放在那裡"><span class="grip">⠿</span><span>${esc(it.name)}</span><span class="pdesc">${esc(it.desc)}</span></button>
      <div class="pbody">
        <div class="pprev"></div>
        <textarea class="pcode" readonly spellcheck="false"></textarea>
        <div class="prow"><button class="mbtn solid">插入</button><button class="mbtn">複製 code</button></div>
      </div>`;
      const head=d.querySelector('.phead'), body=d.querySelector('.pbody');
      const cc=stripComments(it.code);
      head.addEventListener('click',()=>{
        const open=d.classList.toggle('open');
        if(open&&!d.dataset.rendered){
          d.dataset.rendered='1';
          d.querySelector('.pprev').innerHTML=cc;
          d.querySelector('.pcode').value=cc;
        }
      });
      const ta=d.querySelector('.pcode');
      ta.addEventListener('click',()=>{ ta.select(); });
      const btns=d.querySelectorAll('.prow .mbtn');
      btns[0].addEventListener('click',()=>insertSmart(cc));
      btns[1].addEventListener('click',()=>copyText(cc,'<b>已複製</b>「'+it.name+'」code'));
      head.addEventListener('pointerdown',ev=>startHtmlDrag(ev,{label:it.name,html:()=>cc}));
      root.appendChild(d);
    });
  });
})();

/* ═══════════ 18. 圖片工具：形式庫（layer＝畫布圖層 / flow＝流式） ═══════════ */
const IMG_PLACEHOLDER="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='60'><rect width='80' height='60' fill='%23c8791f'/><circle cx='26' cy='22' r='9' fill='%23f0b03c'/><path d='M0 48 L28 28 L48 42 L62 32 L80 44 L80 60 L0 60Z' fill='%2316100a'/></svg>";
const IMG_FORMS=[
 {key:'plain',  kind:'layer', name:'原圖圖層',   tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:30%;'>`},
 {key:'rounded',kind:'layer', name:'圓角柔影',   tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:30%;border-radius:10px;box-shadow:0 8px 22px rgba(0,0,0,0.55);'>`},
 {key:'circle', kind:'layer', name:'圓形金框',   tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:22%;aspect-ratio:1;object-fit:cover;border-radius:50%;border:3px solid #f0b03c;box-shadow:0 0 20px rgba(240,176,60,0.35);'>`},
 {key:'polaroid',kind:'layer',name:'拍立得',     tpl:u=>`<div style='position:absolute;width:26%;background:#f5f0e8;padding:8px 8px 24px;box-shadow:0 10px 24px rgba(0,0,0,0.5);transform:rotate(-3deg);'><img src='${u}' alt='' style='width:100%;display:block;'></div>`},
 {key:'goldframe',kind:'layer',name:'金框相框',  tpl:u=>`<div style='position:absolute;width:30%;background:#16100a;border:2px solid rgba(184,148,63,0.6);padding:6px;box-shadow:0 0 24px rgba(240,176,60,0.18),inset 0 0 12px rgba(0,0,0,0.6);'><img src='${u}' alt='' style='width:100%;display:block;'></div>`},
 {key:'sticker',kind:'layer', name:'白邊貼紙',   tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:24%;border:3px solid #fff;border-radius:8px;transform:rotate(2deg);box-shadow:0 6px 16px rgba(0,0,0,0.45);'>`},
 {key:'glow',   kind:'layer', name:'金光暈染',   tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:30%;filter:drop-shadow(0 0 14px rgba(240,176,60,0.55));'>`},
 {key:'faded',  kind:'layer', name:'淡化半透明', tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:30%;opacity:0.5;'>`},
 {key:'shadow', kind:'layer', name:'陰影浮起',   tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:30%;box-shadow:0 14px 30px rgba(0,0,0,0.6);'>`},
 {key:'roundsq',kind:'layer', name:'大圓角',     tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:30%;border-radius:22px;'>`},
 {key:'circleF',kind:'layer', name:'圓形去框',   tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:24%;aspect-ratio:1;object-fit:cover;border-radius:50%;'>`},
 {key:'diamond',kind:'layer', name:'菱形',       tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:26%;aspect-ratio:1;object-fit:cover;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);'>`},
 {key:'hexagon',kind:'layer', name:'六角形',     tpl:u=>`<img src='${u}' alt='' style='position:absolute;width:26%;aspect-ratio:1;object-fit:cover;clip-path:polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%);'>`},
 {key:'cover',  kind:'layer', name:'滿版覆蓋層', tpl:u=>`<img src='${u}' alt='' style='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;'>`},
 {key:'fwide',  kind:'flow',  name:'滿寬圖片',   tpl:u=>`<img src='${u}' alt='' style='width:100%;display:block;'>`},
 {key:'ffade',  kind:'flow',  name:'全幅＋上下漸層', tpl:u=>`<div style='position:relative;width:100%;'>\n<img src='${u}' alt='' style='width:100%;display:block;'>\n<div style='position:absolute;top:0;left:0;width:100%;height:22%;background:linear-gradient(to bottom,#0a0a0d 0%,transparent 100%);'></div>\n<div style='position:absolute;bottom:0;left:0;width:100%;height:26%;background:linear-gradient(to top,#0a0a0d 0%,transparent 100%);'></div>\n</div>`},
 {key:'fcircle',kind:'flow',  name:'置中圓頭像', tpl:u=>`<div style='text-align:center;margin:24px 0;'>\n<img src='${u}' alt='' style='display:inline-block;width:150px;height:150px;object-fit:cover;border-radius:50%;border:3px solid #f0b03c;box-shadow:0 0 20px rgba(240,176,60,0.35);'>\n</div>`},
 {key:'fbg',    kind:'flow',  name:'背景圖容器', tpl:u=>`<div style='background:url(${u}) center/cover;border-radius:4px;padding:3px;'>\n<div style='background:rgba(14,10,6,0.85);border-radius:2px;padding:28px 24px;color:#e0c890;'>\n內容放這裡\n</div>\n</div>`}
];
let imgForm='plain';
function curFormObj(){ return IMG_FORMS.find(f=>f.key===imgForm)||IMG_FORMS[0]; }
function curAssetUrl(){ return (selAsset>=0&&assets[selAsset])?assets[selAsset]:($('#imgUrl').value.trim()||''); }
/* 套用共用設定：淡化(透明度)＋邊框色/寬 */
function applyImgSettings(html){
  const fade=+$('#imgFade').value, bOn=$('#imgBorderOn').checked, bC=$('#imgBorderC').value, bW=+$('#imgBorderW').value;
  if(fade>=100 && !bOn) return html;
  const t=document.createElement('template'); t.innerHTML=html;
  const root=t.content.firstElementChild; if(!root) return html;
  if(fade<100) root.style.opacity=(fade/100).toFixed(2);
  if(bOn){ const img=root.tagName==='IMG'?root:root.querySelector('img'); if(img) img.style.border=bW+'px solid '+bC; }
  return serializeDoc(t.content,null).trim();
}
function buildFormGrid(){
  const g=$('#formGrid'); if(!g) return;
  const url=(curAssetUrl()||IMG_PLACEHOLDER).replace(/'/g,'%27');
  const frag=document.createDocumentFragment();
  let lastKind='';
  IMG_FORMS.forEach(f=>{
    if(f.kind!==lastKind){ lastKind=f.kind; const lb=document.createElement('div'); lb.className='fkind'; lb.style.gridColumn='1/-1'; lb.textContent=f.kind==='layer'?'▸ 畫布圖層形式（拖到畫布上用這些）':'▸ 流式形式（拖到畫布外／一般插入）'; frag.appendChild(lb); }
    const c=document.createElement('div'); c.className='fcard'+(f.key===imgForm?' selF':''); c.title=f.name;
    const pv2=document.createElement('div'); pv2.className='fprev';
    pv2.innerHTML=applyImgSettings(f.tpl(url));
    const root=pv2.firstElementChild;
    if(root&&f.kind==='layer'&&f.key!=='cover'){ root.style.top='6%'; root.style.left='22%'; root.style.width='56%'; }
    const nm=document.createElement('div'); nm.className='fname'; nm.textContent=f.name;
    c.appendChild(pv2); c.appendChild(nm);
    c.addEventListener('click',()=>{ imgForm=f.key; buildFormGrid(); });
    frag.appendChild(c);
  });
  g.replaceChildren(frag);
}
/* 圖片形式收合＋設定連動 */
$('#formToggle').addEventListener('click',()=>{ const w=$('#formWrap'); const c=w.classList.toggle('collapsed'); $('#formToggle').textContent=(c?'▸':'▾')+' 圖片形式（拖放／插入都套用）'; });
$('#imgFade').addEventListener('input',()=>{ $('#imgFadeN').value=$('#imgFade').value; buildFormGrid(); });
$('#imgFadeN').addEventListener('input',()=>{ $('#imgFade').value=$('#imgFadeN').value; buildFormGrid(); });
$('#imgBorderOn').addEventListener('change',buildFormGrid);
$('#imgBorderC').addEventListener('input',buildFormGrid);
$('#imgBorderW').addEventListener('input',buildFormGrid);
let imgDeb=null;
$('#imgUrl').addEventListener('input',()=>{ clearTimeout(imgDeb); imgDeb=setTimeout(updateImgPrev,300); });
function updateImgPrev(){
  const u=$('#imgUrl').value.trim(); const box=$('#imgPrevBox');
  if(!u){ box.innerHTML='<span class="noimg">貼上連結會先在這裡預覽</span>'; return; }
  box.innerHTML='<span class="noimg">載入中…</span>';
  const im=new Image();
  im.onload=()=>{ noteRatio(u,im); box.replaceChildren(im); };
  im.onerror=()=>{ box.innerHTML='<span class="noimg" style="color:var(--danger)">圖片載入失敗，確認網址是否為圖片直連</span>'; };
  im.src=u;
}
/* —— 素材庫 —— */
let assets=[]; try{ const a=JSON.parse(load('cdb_assets')||'[]'); if(Array.isArray(a)) assets=a; }catch(e){}
let selAsset=-1;
let assetPins=(()=>{ try{ const v=JSON.parse(load('cdb_assetPins')||'[]'); if(Array.isArray(v)) return new Set(v); }catch(e){} return new Set(); })();
function saveAssets(){ store('cdb_assets',JSON.stringify(assets.slice(0,80))); store('cdb_assetPins',JSON.stringify([...assetPins])); }
function renderAssets(){
  const g=$('#assetGrid');
  g.replaceChildren(...assets.map((u,i)=>{
    const b=document.createElement('div'); b.className='asset'+(i===selAsset?' selA':'')+(assetPins.has(u)?' pinned':''); b.title=u;
    const im=document.createElement('img'); im.onload=()=>noteRatio(u,im); im.src=u; im.loading='lazy'; b.appendChild(im);
    const pin=document.createElement('button'); pin.className='apin'+(assetPins.has(u)?' on':''); pin.textContent='📌'; pin.title=assetPins.has(u)?'已釘選（點取消）':'釘選（清除時保留）'; b.appendChild(pin);
    const x=document.createElement('button'); x.className='ax'; x.textContent='✕'; b.appendChild(x);
    pin.addEventListener('click',ev=>{ ev.stopPropagation(); if(assetPins.has(u)) assetPins.delete(u); else assetPins.add(u); saveAssets(); renderAssets(); });
    x.addEventListener('click',ev=>{ ev.stopPropagation(); assets.splice(i,1); assetPins.delete(u); if(selAsset===i) selAsset=-1; saveAssets(); renderAssets(); });
    b.addEventListener('pointerdown',ev=>{ if(ev.target===x||ev.target===pin) return; startAssetDrag(ev,u,i); });
    return b;
  }));
  if(!assets.length) g.innerHTML='<div class="hint" style="grid-column:1/-1">'+(window.UI_T?UI_T('還沒有素材——上面貼網址按「＋加入」'):'還沒有素材——上面貼網址按「＋加入」')+'</div>';
}
$('#assetClear').addEventListener('click',()=>{
  const btn=$('#assetClear');
  if(!btn.dataset.armed){ btn.dataset.armed='1'; btn.textContent='確定清除？'; setTimeout(()=>{if(btn.dataset.armed){delete btn.dataset.armed;btn.textContent='一鍵清除（留釘選）';}},2600); return; }
  delete btn.dataset.armed; btn.textContent='一鍵清除（留釘選）';
  const kept=assets.filter(u=>assetPins.has(u)); const removed=assets.length-kept.length;
  assets=kept; selAsset=-1; saveAssets(); renderAssets(); buildFormGrid();
  toast(removed?('<b>已清除</b> '+removed+' 張（保留 '+kept.length+' 張釘選）'):'沒有可清除的（都被釘選了）');
});
$('#imgAdd').addEventListener('click',()=>{
  const u=$('#imgUrl').value.trim();
  if(!u){ toast('先貼上圖片網址'); return; }
  if(!assets.includes(u)) assets.unshift(u);
  selAsset=0; saveAssets(); renderAssets(); buildFormGrid();
  toast('<b>已加入素材庫</b>——按住縮圖拖到預覽上');
});
/* 自動把內容裡的圖片網址匯入素材庫 */
function syncAssetsFromModel(){
  const urls=[];
  model.querySelectorAll('img[src]').forEach(im=>{ const s=im.getAttribute('src'); if(s) urls.push(s); });
  model.querySelectorAll('[style]').forEach(el=>{
    const st=el.getAttribute('style')||'';
    const re=/url\((['"]?)([^'")]+)\1\)/g; let m;
    while(m=re.exec(st)){ urls.push(m[2]); }
  });
  let added=0;
  urls.forEach(u=>{
    if(/^data:image\/svg/i.test(u)) return;                 // 裝飾用 svg 不算圖
    if(!/^https?:\/\//i.test(u) && !/^data:image/i.test(u)) return;
    if(!assets.includes(u)){ assets.push(u); added++; }
  });
  if(added){ assets=assets.slice(0,80); saveAssets(); renderAssets(); if($('#formGrid')) buildFormGrid(); }
  return added;
}
let wantImgSync=false;
codeEl.addEventListener('paste',()=>{ wantImgSync=true; });
/* 素材拖放 → 圖層 / 流式圖片 */
let aDrag=null; const ghost=$('#dragGhost');
function startAssetDrag(ev,url,idx){
  ev.preventDefault();
  selAsset=idx; renderAssets(); buildFormGrid();
  aDrag={url,sx:ev.clientX,sy:ev.clientY,active:false,dropEl:null};
  const move=e=>{
    if(!aDrag) return;
    if(!aDrag.active&&Math.abs(e.clientX-aDrag.sx)+Math.abs(e.clientY-aDrag.sy)>6){
      aDrag.active=true; document.body.classList.add('dragging'); ghost.classList.remove('lab'); ghost.querySelector('img').src=aDrag.url; ghost.style.display='block';
    }
    if(!aDrag.active) return;
    ghost.style.left=(e.clientX-45)+'px'; ghost.style.top=(e.clientY-45)+'px';
    if(aDrag.dropEl) aDrag.dropEl.classList.remove('cdb-drop');
    aDrag.dropEl=null;
    const under=document.elementFromPoint(e.clientX,e.clientY);
    if(under&&pv.contains(under)){
      let cvClone=null,x=under.closest?under.closest('[data-cdbuid]'):null;
      while(x&&x!==pv){ if(getComputedStyle(x).position==='relative'){ cvClone=x; break; } x=x.parentElement&&x.parentElement.closest?x.parentElement.closest('[data-cdbuid]'):null; }
      aDrag.dropEl=cvClone||under.closest('[data-cdbuid]')||pv;
      if(aDrag.dropEl&&aDrag.dropEl!==pv) aDrag.dropEl.classList.add('cdb-drop');
      aDrag.isCanvas=!!cvClone; aDrag.cvClone=cvClone; aDrag.px=e.clientX; aDrag.py=e.clientY;
      aDrag.overPv=true;
    } else aDrag.overPv=false;
  };
  const up=e=>{
    document.removeEventListener('pointermove',move);
    document.removeEventListener('pointerup',up);
    ghost.style.display='none'; document.body.classList.remove('dragging');
    if(aDrag&&aDrag.dropEl&&aDrag.dropEl!==pv) aDrag.dropEl.classList.remove('cdb-drop');
    const d=aDrag; aDrag=null;
    if(!d||!d.active||!d.overPv) return;
    const fo=curFormObj();
    if(d.isCanvas&&d.cvClone){
      const uid=+d.cvClone.getAttribute('data-cdbuid');
      const cvNode=modelEls[uid]; if(!cvNode) return;
      const r=d.cvClone.getBoundingClientRect();
      const xPct=Math.min(92,Math.max(0,(d.px-r.left)/r.width*100-15));
      const yPct=Math.min(92,Math.max(0,(d.py-r.top)/r.height*100-8));
      const lf=fo.kind==='layer'?fo:IMG_FORMS[0];
      insertSmart(applyImgSettings(lf.tpl(d.url)),{canvas:cvNode,x:xPct,y:yPct});
    }else{
      const blockClone=d.dropEl&&d.dropEl!==pv?d.dropEl:null;
      let after=null;
      if(blockClone){ const uid=+blockClone.getAttribute('data-cdbuid'); after=modelEls[uid]?topBlockOf(modelEls[uid]):null; }
      const ff=fo.kind==='flow'?fo:IMG_FORMS.find(f=>f.key==='fwide');
      insertSmart(applyImgSettings(ff.tpl(d.url)),{canvas:null,after,forceFlow:true});
    }
  };
  document.addEventListener('pointermove',move);
  document.addEventListener('pointerup',up);
}
function imgSnippet(){
  const url=curAssetUrl();
  if(!url){ toast('先貼網址或點選一個素材'); return null; }
  return applyImgSettings(curFormObj().tpl(url));
}
$('#imgInsert').addEventListener('click',()=>{ const s=imgSnippet(); if(s) insertSmart(s,{forceFlow:curFormObj().kind==='flow'}); });
$('#imgCopy').addEventListener('click',()=>{ const s=imgSnippet(); if(s) copyText(s,'<b>已複製</b>圖片 code'); });
renderAssets(); buildFormGrid();
function renderUsedImages(){
  const box=$('#imgUsed'); const uidOf=new Map(modelEls.map((el,i)=>[el,i]));
  const imgs=[...model.querySelectorAll('img[src]')].slice(0,60);
  box.replaceChildren(...imgs.map(im=>{
    const b=document.createElement('button'); b.className='uimg'; b.title=im.getAttribute('src');
    const t=document.createElement('img'); t.src=im.getAttribute('src'); t.loading='lazy';
    b.appendChild(t);
    b.addEventListener('click',()=>applySelection(uidOf.get(im)));
    return b;
  }));
  if(!imgs.length) box.innerHTML='<div class="hint" style="grid-column:1/-1">頁面中還沒有圖片</div>';
}

/* ═══════════ 19. 動畫面板 ═══════════ */
/* ═══════════ 20. 調色盤 ═══════════ */
function hexToRgb(h){ const m=/^#?([0-9a-f]{6})$/i.exec(h.trim()); if(!m)return null; const x=parseInt(m[1],16); return [x>>16&255,x>>8&255,x&255]; }
function currentColor(){
  const hex=$('#colHex').value.trim(); const a=+$('#colAlpha').value;
  if(a>=100) return hex;
  const rgb=hexToRgb(hex); if(!rgb) return hex;
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(a/100).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')})`;
}
function refreshColor(){
  const c=currentColor();
  $('#colOut').textContent=c;
  $('#colAlphaVal').textContent=$('#colAlpha').value+'%';
  $('#colPrev').firstElementChild.style.background=c;
  $('#ttcSw').style.background=c;
}
$('#colMain').addEventListener('input',e=>{ $('#colHex').value=e.target.value; refreshColor(); });
$('#colHex').addEventListener('input',e=>{ const v=e.target.value.trim(); if(/^#[0-9a-f]{6}$/i.test(v)) $('#colMain').value=v; refreshColor(); });
$('#colAlpha').addEventListener('input',refreshColor);
function pushRecent(c){
  let arr=[]; try{ arr=JSON.parse(load('cdb_recent')||'[]'); }catch(e){}
  arr=[c,...arr.filter(x=>x!==c)].slice(0,24);
  store('cdb_recent',JSON.stringify(arr)); renderRecent();
}
function renderRecent(){
  let arr=[]; try{ arr=JSON.parse(load('cdb_recent')||'[]'); }catch(e){}
  const box=$('#recentColors');
  box.replaceChildren(...arr.map(c=>swBtn(c)));
  if(!arr.length) box.innerHTML='<div class="hint" style="grid-column:1/-1">（還沒有）</div>';
}
function pickSwatch(c){ if(/^#[0-9a-f]{6}$/i.test(c)) $('#colMain').value=c; $('#colHex').value=c; if(/rgba?\(/.test(c)){ const m=/rgba?\([^)]*,\s*([\d.]+)\s*\)/.exec(c); $('#colAlpha').value=m?Math.round(parseFloat(m[1])*100):100; } refreshColor(); }
function swBtn(c,onRemove){
  const b=document.createElement('button'); b.className='sw'; b.style.background=c; b.title=c+(onRemove?'（右鍵移除）':'');
  b.addEventListener('click',()=>pickSwatch(c));
  if(onRemove) b.addEventListener('contextmenu',e=>{ e.preventDefault(); onRemove(); });
  return b;
}
/* 常用色票（可新增／移除／清除，存在瀏覽器） */
function loadFav(){ try{ const v=JSON.parse(load('cdb_swatches')||'null'); if(Array.isArray(v)) return v; }catch(e){} return [...SWATCHES]; }
let favColors=loadFav();
function saveFav(){ store('cdb_swatches',JSON.stringify(favColors)); }
function renderFav(){
  const box=$('#swatches');
  box.replaceChildren(...favColors.map((c,i)=>swBtn(c,()=>{ favColors.splice(i,1); saveFav(); renderFav(); })));
  if(!favColors.length) box.innerHTML='<div class="hint" style="grid-column:1/-1">（已清空，按「＋加入目前色」新增）</div>';
}
renderFav();
$('#colAddFav').addEventListener('click',()=>{ const c=currentColor(); if(!favColors.includes(c)){ favColors.unshift(c); saveFav(); renderFav(); toast('<b>已加入常用</b> '+c); } else toast('已經在常用色票裡'); });
$('#colClearFav').addEventListener('click',()=>{ favColors=[]; saveFav(); renderFav(); toast('已清除常用色票'); });
$('#colClearRecent').addEventListener('click',()=>{ store('cdb_recent','[]'); renderRecent(); toast('已清除最近使用'); });
/* 釘選色票（不被常用/最近清除影響，可單獨移除） */
function loadPin(){ try{ const v=JSON.parse(load('cdb_pinnedColors')||'null'); if(Array.isArray(v)) return v; }catch(e){} return []; }
let pinColors=loadPin();
function savePin(){ store('cdb_pinnedColors',JSON.stringify(pinColors)); }
function renderPin(){
  const box=$('#pinnedColors');
  box.replaceChildren(...pinColors.map((c,i)=>swBtn(c,()=>{ pinColors.splice(i,1); savePin(); renderPin(); })));
  if(!pinColors.length) box.innerHTML='<div class="hint" style="grid-column:1/-1">（還沒有釘選；按「＋釘選目前色」）</div>';
}
renderPin();
$('#colAddPin').addEventListener('click',()=>{ const c=currentColor(); if(!pinColors.includes(c)){ pinColors.unshift(c); savePin(); renderPin(); toast('<b>已釘選</b> '+c); } else toast('已經釘選了'); });
$('#colCopy').addEventListener('click',()=>{ const c=currentColor(); pushRecent(c); copyText(c,'<b>已複製</b> '+c); });
function applyColor(prop){
  const n=selNode(); if(!n){ toast('先在預覽中點選一個元素'); return; }
  const c=currentColor(); pushRecent(c);
  if(prop==='background'){ n.style.removeProperty('background'); n.style.setProperty('background',c); }
  else n.style.setProperty(prop,c);
  writeback(n); toast('<b>已套用</b> '+c);
}
$('#colApplyText').addEventListener('click',()=>applyColor('color'));
$('#colApplyBg').addEventListener('click',()=>applyColor('background'));
$('#colApplyBd').addEventListener('click',()=>applyColor('border-color'));

/* ═══════════ 21. 裝飾庫 ═══════════ */
function decoDefaults(it){ const o={}; (it.p||[]).forEach(pp=>o[pp.k]=pp.def); return o; }
function decoTarget(){ // 裝飾要掛的畫布（沒有就把最外層變成可定位容器）
  const s=selNode();
  let cv=(s?containerCanvasOf(s):null)||lastCanvas();
  if(cv) return cv;
  const host=(s?topBlockOf(s):null)||model.firstElementChild;
  if(host){ if(!host.style.position) host.style.position='relative'; if(!host.style.overflow) host.style.overflow='hidden'; return host; }
  return null;
}
function buildDecoList(){
  const root=$('#decoList'); const frag=document.createDocumentFragment();
  DECOS.forEach(grp=>{
    const h=document.createElement('h4'); h.textContent=grp.cat; frag.appendChild(h);
    grp.items.forEach(it=>{
      const d=document.createElement('div'); d.className='pitem';
      const state=decoDefaults(it);
      d.innerHTML=`<button class="phead"><span>${esc(it.name)}</span><span class="pdesc">${it.kind==='text'?'套到文字':it.kind==='cover'?'蓋滿畫布':it.kind==='spot'?'光點':'邊緣'}</span></button><div class="pbody"></div>`;
      const head=d.querySelector('.phead'), body=d.querySelector('.pbody');
      head.addEventListener('click',()=>{ const open=d.classList.toggle('open'); if(open&&!d.dataset.built){ d.dataset.built='1'; buildDecoBody(body,it,state); } });
      frag.appendChild(d);
    });
  });
  root.replaceChildren(frag);
}
function buildDecoBody(body,it,state){
  if(it.kind==='text'){
    body.innerHTML=`<div class="pprev" style="min-height:44px;display:flex;align-items:center;justify-content:center;background:#16110a"><span style="font-size:20px;font-weight:700">範例文字</span></div>
      <div class="prow"><button class="mbtn solid">套到選取文字</button><button class="mbtn">複製 style</button></div>`;
    const sp=body.querySelector('.pprev span'); Object.assign(sp.style,it.st);
    const [bAp,bCp]=body.querySelectorAll('.mbtn');
    const cssStr=Object.entries(it.st).map(([k,v])=>k+':'+v).join(';')+';';
    bAp.addEventListener('click',()=>{
      const n=selNode(); if(!n){ toast('先選一個文字元素（或雙擊反白一段字）'); return; }
      Object.entries(it.st).forEach(([k,v])=>n.style.setProperty(k,v));
      writeback(n); toast('<b>已套用</b>文字效果');
    });
    bCp.addEventListener('click',()=>copyText(cssStr,'<b>已複製</b> style'));
    return;
  }
  const prev=document.createElement('div'); prev.className='pprev'; prev.style.height='72px'; prev.style.background='linear-gradient(135deg,#241a0e,#0e0a06)';
  const previnner=document.createElement('div'); previnner.style.cssText='position:relative;width:100%;height:100%'; prev.appendChild(previnner);
  body.appendChild(prev);
  const ctrls=document.createElement('div'); body.appendChild(ctrls);
  (it.p||[]).forEach(pp=>{
    const row=document.createElement('div'); row.className='srow';
    if(pp.type==='color'){
      row.innerHTML=`<label>${pp.label}</label><input type="color" value="${pp.def}"><input class="tin" value="${pp.def}" spellcheck="false" style="font-size:11px">`;
      const [ci,ti]=row.querySelectorAll('input');
      ci.addEventListener('input',()=>{ ti.value=ci.value; state[pp.k]=ci.value; renderDecoPrev(); });
      ti.addEventListener('input',()=>{ if(/^#[0-9a-f]{6}$/i.test(ti.value.trim())){ ci.value=ti.value.trim(); state[pp.k]=ti.value.trim(); renderDecoPrev(); } });
    }else{
      row.innerHTML=`<label>${pp.label}</label><input type="range" min="${pp.min}" max="${pp.max}" value="${pp.def}"><span class="sval">${pp.def}${pp.unit}</span>`;
      const [ri,sv]=[row.querySelector('input'),row.querySelector('.sval')];
      ri.addEventListener('input',()=>{ state[pp.k]=+ri.value; sv.textContent=ri.value+pp.unit; renderDecoPrev(); });
    }
    ctrls.appendChild(row);
  });
  const prow=document.createElement('div'); prow.className='prow';
  prow.innerHTML='<button class="mbtn solid">加到畫布</button><button class="mbtn">複製 code</button>';
  body.appendChild(prow);
  const [bAdd,bCopy]=prow.querySelectorAll('.mbtn');
  function renderDecoPrev(){
    previnner.innerHTML=it.b(state);
    const layer=previnner.firstElementChild;
    if(layer&&it.kind==='spot'){ layer.style.top='50%'; layer.style.left='50%'; layer.style.transform='translate(-50%,-50%)'; }
  }
  renderDecoPrev();
  bAdd.addEventListener('click',()=>{
    const cv=decoTarget(); if(!cv){ toast('找不到可放置的畫布'); return; }
    let html=it.b(state);
    if(it.kind==='spot'){ // 光點給個起始定位
      html=html.replace(/^<div style='/,"<div style='top:20%;left:20%;");
    }
    insertSmart(html,{canvas:cv});
  });
  bCopy.addEventListener('click',()=>copyText(it.b(state),'<b>已複製</b> '+it.name));
}
buildDecoList();

/* 自訂 CSS（我的裝飾） */
function loadCssLib(){ try{ const v=JSON.parse(load('cdb_css')||'null'); if(Array.isArray(v)) return v; }catch(e){} return CSS_PRESETS.map(x=>({...x})); }
let cssLib=loadCssLib();
function saveCssLib(){ store('cdb_css',JSON.stringify(cssLib)); }
function renderCssLib(){
  const root=$('#cssList');
  root.replaceChildren(...cssLib.map((it,i)=>{
    const d=document.createElement('div'); d.className='citem';
    const isLayer=/position\s*:\s*absolute/i.test(it.css);
    d.innerHTML=`<div class="cname">${esc(it.name)} <span style="font-size:10px;color:var(--faint);font-weight:400">${isLayer?'· 圖層':'· 併入'}</span></div><div class="csnip">${esc(it.css)}</div>
    <div class="crow"><button class="mbtn">${isLayer?'加到畫布':'貼到選取元素'}</button><button class="mbtn">複製</button><button class="mbtn" style="flex:0 0 auto;color:var(--danger)">刪</button></div>`;
    const [bMain,bCopy,bDel]=d.querySelectorAll('.crow .mbtn');
    bMain.addEventListener('click',()=>{
      if(isLayer){ const cv=decoTarget(); if(!cv){ toast('找不到可放置的畫布'); return; } insertSmart(`<div style='${it.css}'></div>`,{canvas:cv}); }
      else{ const n=selNode(); if(!n){ toast('先在預覽中點選一個元素'); return; } const r=mergeCss(n,it.css); if(!r.added){ toast('沒有可加入的屬性（'+r.skipped+' 項與現有重疊，全部保留）'); return; } writeback(n); toast('<b>已併入</b> '+r.added+' 項'+(r.skipped?'；保留 '+r.skipped+' 項既有設定':'')); }
    });
    bCopy.addEventListener('click',()=>copyText(it.css,'<b>已複製</b> CSS'));
    bDel.addEventListener('click',()=>{ cssLib.splice(i,1); saveCssLib(); renderCssLib(); });
    return d;
  }));
  if(!cssLib.length) root.innerHTML='<div class="hint">（還沒有自己存的）</div>';
}
$('#cssSave').addEventListener('click',()=>{
  const name=$('#cssName').value.trim()||'未命名';
  const css=$('#cssText').value.trim();
  if(!css){ toast('先貼上要儲存的 CSS'); return; }
  cssLib.unshift({name,css}); saveCssLib(); renderCssLib();
  $('#cssName').value=''; $('#cssText').value='';
  toast('<b>已儲存</b>');
});
renderCssLib();

/* ═══════════ 21.5 HTML 存檔區（跟裝飾分開，上限 15）═══════════ */
const HTML_MAX=15;
function loadHtmlSaves(){ try{ const v=JSON.parse(load(saveKey())||'[]'); if(Array.isArray(v)) return v; }catch(e){} return []; }
let htmlSaves=loadHtmlSaves();
function saveHtmlSaves(){ store(saveKey(),JSON.stringify(htmlSaves)); }
function renderHtmlSaves(){
  $('#htmlSaveCount').textContent='已存 '+htmlSaves.length+' / '+HTML_MAX+' 筆';
  const root=$('#htmlSaveList');
  root.replaceChildren(...htmlSaves.map((it,i)=>{
    const d=document.createElement('div'); d.className='citem';
    const chars=(it.html||'').length;
    d.innerHTML=`<div class="cname">${esc(it.name)} <span style="font-size:10px;color:var(--faint);font-weight:400">· ${chars.toLocaleString()} 字元</span></div>
    <div class="crow"><button class="mbtn solid">載入</button><button class="mbtn">插入</button><button class="mbtn">複製</button><button class="mbtn" style="flex:0 0 auto;color:var(--danger)">刪</button></div>`;
    const [bLoad,bIns,bCopy,bDel]=d.querySelectorAll('.crow .mbtn');
    bLoad.addEventListener('click',()=>{ if(!bLoad.dataset.armed){ bLoad.dataset.armed='1'; bLoad.textContent='取代目前？'; setTimeout(()=>{if(bLoad.dataset.armed){delete bLoad.dataset.armed;bLoad.textContent='載入';}},2600); return;} pushUndo(); codeEl.value=it.html; clearSelection(); parseAndRender(); toast('<b>已載入</b>「'+it.name+'」'); });
    bIns.addEventListener('click',()=>insertSmart(it.html,{forceFlow:true}));
    bCopy.addEventListener('click',()=>copyText(it.html,'<b>已複製</b>「'+it.name+'」'));
    bDel.addEventListener('click',()=>{ htmlSaves.splice(i,1); saveHtmlSaves(); renderHtmlSaves(); });
    return d;
  }));
  if(!htmlSaves.length) root.innerHTML='<div class="hint">（還沒有存檔）</div>';
}
$('#htmlSaveBtn').addEventListener('click',()=>{
  const html=codeEl.value;
  if(!html.trim()){ toast('目前沒有內容可存'); return; }
  if(htmlSaves.length>=HTML_MAX){ toast('已達上限 '+HTML_MAX+' 筆，請先刪除舊的存檔'); return; }
  const name=($('#htmlSaveName').value.trim())||('存檔 '+new Date().toLocaleString('zh-TW',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}));
  htmlSaves.unshift({name,html}); saveHtmlSaves(); renderHtmlSaves();
  $('#htmlSaveName').value='';
  toast('<b>已存檔</b>（'+htmlSaves.length+'/'+HTML_MAX+'）');
});
renderHtmlSaves();

/* ═══════════ 22. 頁籤／工具列／初始化 ═══════════ */
$('#tabs').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  if(b.id==='btnDrawer'){ setDrawer($('#main').classList.contains('drawerClosed')); return; }
  if(b.classList.contains('on')&&!$('#main').classList.contains('drawerClosed')){ setDrawer(false); return; }
  openDrawer(b.dataset.tab);
});
$('#btnUndo').addEventListener('click',doUndo);
$('#btnRedo').addEventListener('click',doRedo);
$('#btnTidy').addEventListener('click',()=>{ pushUndo(); codeEl.value=serializeDoc(model,new Map()); parseAndRender(true); toast('<b>已正規化</b>：屬性統一為單引號'); });
$('#btnCopyAll').addEventListener('click',()=>{ pushRecentNoop(); copyText(codeEl.value,'<b>已複製全部</b> code，貼到 CaveDuck 吧'); });
function pushRecentNoop(){}
function armButton(btn,label,fn){
  btn.addEventListener('click',()=>{
    if(btn.dataset.armed){ delete btn.dataset.armed; btn.textContent=btn.dataset.orig; fn(); return; }
    btn.dataset.armed='1'; btn.dataset.orig=btn.textContent; btn.textContent='確定？再按一次';
    setTimeout(()=>{ if(btn.dataset.armed){ delete btn.dataset.armed; btn.textContent=btn.dataset.orig; } },2600);
  });
}
armButton($('#btnClear'),'清空',()=>{ pushUndo(); codeEl.value=''; clearSelection(); parseAndRender(); toast('已清空（可按復原找回）'); });
$('#btnNoComment').addEventListener('click',()=>{
  const it=document.createNodeIterator(model,NodeFilter.SHOW_COMMENT);
  const del=[]; let nd; while(nd=it.nextNode()) del.push(nd);
  if(!del.length){ toast('目前沒有註解'); return; }
  del.forEach(x=>x.remove());
  writeback(selNode());
  toast('<b>已移除</b> '+del.length+' 個註解');
});
function setCodeOpen(open){
  $('#stage').classList.toggle('codeClosed',!open);
  $('#btnCodeToggle').textContent=open?'▾ HTML code':'▴ HTML code';
  store('cdb3_codeopen',open?'1':'0');
  requestAnimationFrame(()=>{ try{ positionOverlay(); }catch(e){} });
}
$('#btnCodeToggle').addEventListener('click',()=>setCodeOpen($('#stage').classList.contains('codeClosed')));
/* code 自動換行切換（僅顯示，不改內容/字元數） */
$('#btnWrap').addEventListener('click',()=>{
  const on=codeEl.classList.toggle('wrap');
  $('#btnWrap').textContent=on?'→ 一行到底':'↩ 自動換行';
  $('#btnWrap').classList.toggle('on',on);
  store('cdb_wrap',on?'1':'0');
});
if(load('cdb_wrap')==='1'){ codeEl.classList.add('wrap'); $('#btnWrap').textContent='→ 一行到底'; $('#btnWrap').classList.add('on'); }

$('#warnBtn').addEventListener('click',e=>{ e.stopPropagation(); $('#warnPanel').classList.toggle('on'); });
document.addEventListener('click',e=>{ if(!e.target.closest('#warnPanel')&&!e.target.closest('#warnBtn')) $('#warnPanel').classList.remove('on'); });
