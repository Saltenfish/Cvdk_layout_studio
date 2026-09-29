'use strict';
/* ═══════════ 5. 小工具 ═══════════ */
let toastTimer=null;
function toast(html){ const t=$('#toast'); t.innerHTML=html; t.classList.add('on'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('on'),1800); }
function copyText(txt,msg){
  const done=()=>toast(msg||'<b>已複製</b>到剪貼簿');
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt,done)); }
  else fallbackCopy(txt,done);
}
function fallbackCopy(txt,done){ const ta=document.createElement('textarea'); ta.value=txt; ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');done&&done();}catch(e){} ta.remove(); }
function store(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
function load(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ═══════════ 6. 掃描器：找出原始碼中每個元素的字元範圍 ═══════════ */
function scanRanges(src){
  const out=[]; const stack=[]; let i=0; const n=src.length;
  while(i<n){
    const lt=src.indexOf('<',i); if(lt<0) break;
    if(src.startsWith('<!--',lt)){ const e=src.indexOf('-->',lt+4); i=(e<0)?n:e+3; continue; }
    if(src[lt+1]==='!'){ const e=src.indexOf('>',lt); i=(e<0)?n:e+1; continue; }
    if(src[lt+1]==='/'){ // 關閉標籤
      const m=/^<\/([a-zA-Z][a-zA-Z0-9-]*)\s*>/.exec(src.slice(lt));
      if(!m){ i=lt+2; continue; }
      const tag=m[0].length, name=m[1].toLowerCase(); const end=lt+tag;
      for(let s=stack.length-1;s>=0;s--){
        if(stack[s].tag===name){
          for(let k=stack.length-1;k>s;k--){ stack[k].rec.end=lt; } // 未關閉者切在此
          stack[s].rec.end=end; stack.length=s; break;
        }
      }
      i=end; continue;
    }
    const m=/^<([a-zA-Z][a-zA-Z0-9-]*)/.exec(src.slice(lt));
    if(!m){ i=lt+1; continue; }
    const name=m[1].toLowerCase();
    // 找開標籤結尾（跳過引號內的 >）
    let j=lt+m[0].length, q=null;
    while(j<n){ const c=src[j];
      if(q){ if(c===q) q=null; }
      else if(c==="'"||c==='"') q=c;
      else if(c==='>') break;
      j++;
    }
    const openEnd=(j<n)?j+1:n;
    const selfClosed=src[j-1]==='/';
    const rec={tag:name,start:lt,end:openEnd};
    out.push(rec);
    if(!VOID_TAGS.has(name)&&!selfClosed) stack.push({tag:name,rec});
    i=openEnd;
  }
  for(const s of stack) s.rec.end=n;
  return out;
}

/* ═══════════ 7. 序列化：DOM → 單引號屬性的 HTML（CaveDuck 建議格式）═══════════ */
function serializeNode(node,rangeMap,posRef){
  let out='';
  const P=posRef||{pos:0};
  const emit=s=>{ out+=s; P.pos+=s.length; };
  walk(node);
  function walk(nd){
    if(nd.nodeType===3){ emit(nd.nodeValue.replace(/</g,'&lt;')); return; }
    if(nd.nodeType===8){ emit('<!--'+nd.nodeValue+'-->'); return; }
    if(nd.nodeType!==1) return;
    const tag=nd.tagName.toLowerCase(); const start=P.pos;
    let open='<'+tag;
    for(const at of nd.attributes){
      if(at.name==='data-cdbuid') continue;
      const v=at.value.replace(/'/g,'&#39;');
      open+=' '+at.name+"='"+v+"'";
    }
    open+='>';
    emit(open);
    if(!VOID_TAGS.has(tag)){
      for(const c of [...nd.childNodes]) walk(c);
      emit('</'+tag+'>');
    }
    if(rangeMap) rangeMap.set(nd,{start,end:P.pos});
  }
  return out;
}
function serializeAll(rootFrag,rangeMap){
  const P={pos:0}; let out='';
  for(const c of [...rootFrag.childNodes]){ out+=serializeNode(c,rangeMap,{pos:out.length}); }
  if(rangeMap){ /* ranges 已於各子樹內記錄（pos 基於各自起點）*/ }
  return out;
}
/* 上面 serializeNode 逐子樹起點會重置，改用整體序列化以確保 range 正確 */
function serializeDoc(rootFrag,rangeMap){
  let out='';
  const emit=s=>{ out+=s; };
  function walk(nd){
    if(nd.nodeType===3){ emit(nd.nodeValue.replace(/</g,'&lt;')); return; }
    if(nd.nodeType===8){ emit('<!--'+nd.nodeValue+'-->'); return; }
    if(nd.nodeType!==1) return;
    const tag=nd.tagName.toLowerCase(); const start=out.length;
    let open='<'+tag;
    for(const at of nd.attributes){
      if(at.name==='data-cdbuid') continue;
      open+=' '+at.name+"='"+at.value.replace(/'/g,'&#39;')+"'";
    }
    emit(open+'>');
    if(!VOID_TAGS.has(tag)){
      for(const c of [...nd.childNodes]) walk(c);
      emit('</'+tag+'>');
    }
    if(rangeMap) rangeMap.set(nd,{start,end:out.length});
  }
  for(const c of [...rootFrag.childNodes]) walk(c);
  return out;
}

/* ═══════════ 8. 狀態 ═══════════ */
const codeEl=$('#code'), pv=$('#pv');
let model=null;            // 解析後的 DOM（source of truth for 視覺編輯）
let modelEls=[];           // 文件順序的元素清單
let ranges=[];             // 與 modelEls 對齊的 {start,end}（對應 codeEl.value）
let uid2clone=new Map();   // uid -> 預覽中的 clone 元素
let selectedUid=-1;
let warnings=[];
let undoStack=[]; let redoStack=[]; let lastSnapshot=null;
let cursorTouched=false;

function pushUndo(){ const v=codeEl.value; if(undoStack[undoStack.length-1]!==v){ undoStack.push(v); if(undoStack.length>120) undoStack.shift(); redoStack.length=0; } }
function doUndo(){ if(!undoStack.length){ toast('沒有可復原的步驟'); return; } redoStack.push(codeEl.value); const v=undoStack.pop(); codeEl.value=v; parseAndRender(); toast('<b>已復原</b>'); }
function doRedo(){ if(!redoStack.length){ toast('沒有可重做的步驟'); return; } undoStack.push(codeEl.value); const v=redoStack.pop(); codeEl.value=v; parseAndRender(); toast('<b>已重做</b>'); }

/* ═══════════ 9. 解析＋淨化＋渲染 ═══════════ */
function parseAndRender(keepSel){
  if(editingText) return; // 文字就地編輯中不重繪
  const src=codeEl.value;
  warnings=[];
  // 9.1 解析
  const tpl=document.createElement('template');
  tpl.innerHTML=src;
  model=tpl.content;
  modelEls=[...model.querySelectorAll('*')];
  rememberTplDecls();
  // 9.2 範圍對齊（掃描器 → 依序配對同名標籤）
  const scan=scanRanges(src);
  ranges=new Array(modelEls.length).fill(null);
  let si=0;
  for(let ei=0;ei<modelEls.length;ei++){
    const t=modelEls[ei].tagName.toLowerCase();
    let found=-1;
    for(let k=si;k<Math.min(scan.length,si+4);k++){ if(scan[k].tag===t){found=k;break;} }
    if(found>=0){ ranges[ei]={start:scan[found].start,end:scan[found].end}; si=found+1; }
  }
  // 9.3 建立淨化後的預覽
  const clone=model.cloneNode(true);
  uid2clone=new Map();
  const stripTagCount={}, stripAttrCount={};
  sanitizeChildren(model,clone);
  function sanitizeChildren(mParent,cParent){
    const mk=[...mParent.childNodes], ck=[...cParent.childNodes];
    for(let i=0;i<mk.length;i++){
      const m=mk[i], c=ck[i];
      if(m.nodeType!==1) continue;
      sanitizeChildren(m,c);
      const tag=m.tagName.toLowerCase();
      const uid=modelEls.indexOf(m);
      if(ALLOWED_TAGS.has(tag)){
        c.setAttribute('data-cdbuid',uid);
        for(const at of [...c.attributes]){
          const nm=at.name;
          if(nm==='data-cdbuid') continue;
          if(attrOK(tag,nm)) continue;
          stripAttrCount[tag+'['+nm+']']=(stripAttrCount[tag+'['+nm+']']||0)+1;
          c.removeAttribute(nm);
        }
        if(tag==='a'){ const h=c.getAttribute('href')||''; if(/^\s*javascript:/i.test(h)){ c.removeAttribute('href'); warnings.push({lv:'err',msg:"<code>javascript:</code> 連結已被移除（CaveDuck 會擋）"}); } }
      }else if(DROP_WITH_CONTENT.has(tag)){
        stripTagCount[tag]=(stripTagCount[tag]||0)+1;
        c.remove();
      }else{
        stripTagCount[tag]=(stripTagCount[tag]||0)+1;
        const frag=document.createDocumentFragment();
        while(c.firstChild) frag.appendChild(c.firstChild);
        c.replaceWith(frag);
      }
    }
  }
  for(const [tag,n] of Object.entries(stripTagCount)){
    const dropped=DROP_WITH_CONTENT.has(tag);
    warnings.push({lv:'err',msg:`<code>&lt;${tag}&gt;</code> 在${MODES[mode].name}<b>無效</b>（${n} 處${dropped?'，整段內容會消失':'，標籤被拆掉、內容保留'}）`});
  }
  for(const [k,n] of Object.entries(stripAttrCount)){
    warnings.push({lv:'warn',msg:`屬性 <code>${k}</code> 不在白名單，會被移除（${n} 處）`});
  }
  // 9.4 其他檢查
  if(mode!=='widget'&&/\n[ \t]*\n[ \t]*\n/.test(src)) warnings.unshift({lv:'err',msg:'偵測到<b>連續兩行以上空白行</b>——CaveDuck 會在該處截斷 HTML！請刪除多餘空行'});
  const dq=countDQAttrs(src);
  if(dq>0) warnings.push({lv:'warn',msg:`偵測到 ${dq} 個<b>雙引號屬性</b>，按 code 列的「✒ 單引號化」一鍵轉換`});
  if(/position\s*:\s*(fixed|sticky)/i.test(src)) warnings.push({lv:'warn',msg:'<code>position:fixed / sticky</code> 在 CaveDuck 不支援'});
  if(/fonts\.googleapis|@import/i.test(src)) warnings.push({lv:'warn',msg:'外部字型 / @import 在 CaveDuck 無法載入，請改用系統字族（serif、sans-serif…）'});
  warnings.push(...modeChecks(src));
  // 9.5 掛載預覽
  postProcessClone(clone);
  pv.replaceChildren(clone);
  pv.querySelectorAll('[data-cdbuid]').forEach(el=>uid2clone.set(+el.getAttribute('data-cdbuid'),el));
  let stray=0;
  pv.querySelectorAll('[data-cdbuid]').forEach(el=>{ if(el.offsetParent===pv&&getComputedStyle(el).position==='absolute') stray++; });
  if(stray) warnings.push({lv:'warn',msg:`${stray} 個 <code>position:absolute</code> 元素沒有 <code>position:relative</code> 的父層，位置會亂跑——建議放進「畫布區塊」或幫父層加 relative`});
  // 9.6 UI 更新
  if(keepSel&&selectedUid>=0&&selectedUid<modelEls.length){ applySelection(selectedUid,{silent:true}); }
  else if(selectedUid>=modelEls.length){ clearSelection(); }
  else if(selectedUid>=0){ applySelection(selectedUid,{silent:true}); }
  renderWarnings(); renderTree(); renderUsedImages();
  if(wantImgSync){ wantImgSync=false; const a=syncAssetsFromModel(); if(a) setTimeout(()=>toast('<b>已匯入 '+a+' 張圖片</b>到素材庫；想自由拖拉可選容器按「▣ 轉為畫布」'),300); }
  $('#charCount').textContent=src.length.toLocaleString()+' 字元';
  $('#codeChars').textContent=src.length.toLocaleString()+' 字元';
  store(codeKey(mode),src); docs[mode].code=src; updateModeCounts();
  const t=new Date(); $('#saveState').textContent='已自動儲存 '+String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
  try{ positionOverlay(); }catch(e){}
}
function renderWarnings(){
  const btn=$('#warnBtn'), list=$('#warnList');
  const errs=warnings.filter(w=>w.lv==='err').length;
  if(!warnings.length){ btn.className=''; btn.textContent='✔ 檢查通過'; list.innerHTML=`<div class="witem ok"><span class="wico">✔</span><span>目前的 HTML 完全符合 CaveDuck ${MODES[mode].name}規則，貼上即可用。</span></div>`; }
  else{ btn.className=errs?'bad':'mid'; btn.textContent=(errs?'⚠ ':'ℹ ')+warnings.length+' 項提醒（點我看詳情）';
    list.innerHTML=warnings.map(w=>`<div class="witem ${w.lv}"><span class="wico">${w.lv==='err'?'⚠':'ℹ'}</span><span>${w.msg}</span></div>`).join(''); }
}

/* debounce 輸入 */
let deb=null;
codeEl.addEventListener('input',()=>{ clearTimeout(deb); deb=setTimeout(()=>{ pushUndoThrottled(); parseAndRender(true); },350); });
codeEl.addEventListener('click',()=>{ cursorTouched=true; });
codeEl.addEventListener('keyup',()=>{ cursorTouched=true; });
let lastPush=0;
function pushUndoThrottled(){ const now=Date.now(); if(now-lastPush>1500){ pushUndo(); lastPush=now; } }

/* ═══════════ 10. 視覺編輯核心：改 model → 回寫 code ═══════════ */
function writeback(reselNode){
  pushUndo();
  restoreTplDecls();
  const rm=new Map();
  const newCode=serializeDoc(model,rm);
  let newSelIdx=-1;
  if(reselNode){ const all=[...model.querySelectorAll('*')]; newSelIdx=all.indexOf(reselNode); }
  codeEl.value=newCode;
  selectedUid=newSelIdx;
  parseAndRender(true);
}
function selNode(){ return (selectedUid>=0&&selectedUid<modelEls.length)?modelEls[selectedUid]:null; }
function selClone(){ return uid2clone.get(selectedUid)||null; }
/* ═══════════ 11. 選取 ═══════════ */
let filling=false;
function applySelection(uid,opt){
  opt=opt||{};
  const prev=$('#pv .cdb-sel'); if(prev) prev.classList.remove('cdb-sel');
  selectedUid=uid;
  const c=selClone();
  if(!c||!selNode()){ clearSelection(); return; }
  c.classList.add('cdb-sel');
  if(!opt.silent){ try{ c.scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(e){} }
  $('#props').classList.add('hasSel');
  populateProps();
  const r=ranges[uid];
  if(r&&document.activeElement!==codeEl){ try{ codeEl.setSelectionRange(r.start,r.end); cursorTouched=true; scrollCodeTo(r.start); }catch(e){} }
  if(r) flashCodeLine(r.start,r.end);
  markTreeSel();
  updateTreeTools();
  positionOverlay();
}
let flashTimer=null;
function flashCodeLine(start,end){
  if($('#stage').classList.contains('codeClosed')) return;
  const fl=$('#codeFlash'); if(!fl) return;
  const val=codeEl.value;
  const lh=parseFloat(getComputedStyle(codeEl).lineHeight)||19;
  const line0=(val.slice(0,start).match(/\n/g)||[]).length;
  const line1=(val.slice(0,end).match(/\n/g)||[]).length;
  const lines=Math.max(1,line1-line0+1);
  const padTop=parseFloat(getComputedStyle(codeEl).paddingTop)||0;
  requestAnimationFrame(()=>{
    const y=codeEl.offsetTop+padTop+line0*lh-codeEl.scrollTop;
    fl.style.top=y+'px'; fl.style.height=(lines*lh)+'px';
    fl.classList.add('on');
    clearTimeout(flashTimer); flashTimer=setTimeout(()=>fl.classList.remove('on'),750);
  });
}
function clearSelection(){
  const prev=$('#pv .cdb-sel'); if(prev) prev.classList.remove('cdb-sel');
  selectedUid=-1; $('#props').classList.remove('hasSel'); markTreeSel(); updateTreeTools();
  try{ positionOverlay(); }catch(e){}
}
function scrollCodeTo(pos){
  const upto=codeEl.value.slice(0,pos);
  const line=(upto.match(/\n/g)||[]).length;
  const lh=parseFloat(getComputedStyle(codeEl).lineHeight)||19;
  codeEl.scrollTop=Math.max(0,line*lh-codeEl.clientHeight*0.35);
}

/* 預覽互動：hover 外框 */
let hoverEl=null;
pv.addEventListener('mouseover',e=>{
  const t=e.target.closest('[data-cdbuid]');
  if(hoverEl&&hoverEl!==t) hoverEl.classList.remove('cdb-hover');
  if(t&&!t.classList.contains('cdb-sel')){ t.classList.add('cdb-hover'); hoverEl=t; }
});
pv.addEventListener('mouseout',()=>{ if(hoverEl){ hoverEl.classList.remove('cdb-hover'); hoverEl=null; } });
pv.addEventListener('click',e=>{ e.preventDefault(); }); // 擋住 <a> 導航

/* ═══════════ 12. 互動引擎：選取控制框、移動、縮放、旋轉 ═══════════ */
const ovl=$('#ovl'), obox=ovl.querySelector('.obox'), tagchip=ovl.querySelector('.tagchip');
let act=null;          // 進行中的操作
let editingText=false; // 文字就地編輯中
function parseUnitVal(raw,fallbackPx){
  if(raw){ const m=/^(-?[\d.]+)(px|%)?$/.exec(raw.trim()); if(m) return {num:parseFloat(m[1]),unit:m[2]||'px'}; }
  return {num:fallbackPx,unit:'px'};
}
function fmtU(num,unit){ return (unit==='%'?Math.round(num*10)/10:Math.round(num))+unit; }
function isCanvasNode(n){ return !!(n&&n.nodeType===1&&(n.style.position||'')==='relative'&&(n.style.aspectRatio||n.style.height)); }
function absTargetOf(clone){
  let x=clone;
  while(x&&x!==pv&&x.nodeType===1){ if(x.hasAttribute&&x.hasAttribute('data-cdbuid')&&getComputedStyle(x).position==='absolute') return x; x=x.parentElement; }
  return null;
}
function positionOverlay(){
  const c=selClone();
  if(!c||editingText){ ovl.classList.remove('on'); return; }
  const cv=$('#canvas'), cr=cv.getBoundingClientRect(), r=c.getBoundingClientRect();
  if(!r.width&&!r.height){ ovl.classList.remove('on'); return; }
  ovl.style.left=(r.left-cr.left+cv.scrollLeft)+'px';
  ovl.style.top=(r.top-cr.top+cv.scrollTop)+'px';
  ovl.style.width=r.width+'px'; ovl.style.height=r.height+'px';
  ovl.classList.toggle('low',(r.top-cr.top)<40);
  const n=selNode();
  const isAbs=getComputedStyle(c).position==='absolute';
  const isCv=isCanvasNode(n);
  obox.classList.toggle('movable',isAbs);
  tagchip.textContent=n?(n.tagName.toLowerCase()+(isCv?' · 畫布':isAbs?' · 圖層':'')):'';
  ovl.querySelectorAll('.h').forEach(h=>{
    const k=h.dataset.h;
    const show=isAbs?true:(isCv?(k==='s'):(k==='s'||k==='e'));
    h.classList.toggle('off',!show);
  });
  ovl.querySelector('.rot').classList.toggle('off',!isAbs);
  ovl.classList.add('on');
}
$('#canvas').addEventListener('scroll',positionOverlay,{passive:true});
window.addEventListener('resize',positionOverlay);
pv.addEventListener('dragstart',e=>e.preventDefault());

/* —— 點選＋移動 —— */
pv.addEventListener('mousedown',e=>{
  if(e.button!==0||editingText) return;
  const t=e.target.closest('[data-cdbuid]');
  if(!t) return;
  e.stopPropagation();
  const uid=+t.getAttribute('data-cdbuid'); if(!modelEls[uid]) return;
  const absC=absTargetOf(t);
  act={mode:'maybe',clickUid:uid,sx:e.clientX,sy:e.clientY,moved:false};
  if(absC){
    e.preventDefault();
    const mUid=+absC.getAttribute('data-cdbuid');
    const node=modelEls[mUid]; const st=node.style;
    const pr=absC.offsetParent||pv; const rect=pr.getBoundingClientRect();
    Object.assign(act,{moveUid:mUid,node,clone:absC,pw:rect.width||1,ph:rect.height||1});
    act.h=(st.left===''&&st.right!=='')?'right':'left';
    act.v=(st.top===''&&st.bottom!=='')?'bottom':'top';
    const fL=absC.offsetLeft,fT=absC.offsetTop,fR=act.pw-absC.offsetLeft-absC.offsetWidth,fB=act.ph-absC.offsetTop-absC.offsetHeight;
    act.hv=parseUnitVal(st[act.h],act.h==='left'?fL:fR);
    act.vv=parseUnitVal(st[act.v],act.v==='top'?fT:fB);
    if(!st[act.h]) act.hv.unit='%',act.hv.num=(act.h==='left'?fL:fR)/act.pw*100;
    if(!st[act.v]) act.vv.unit='%',act.vv.num=(act.v==='top'?fT:fB)/act.ph*100;
  }
});
/* —— 縮放控制點 —— */
ovl.querySelectorAll('.h').forEach(hd=>hd.addEventListener('mousedown',e=>{
  e.preventDefault(); e.stopPropagation();
  const n=selNode(), c=selClone(); if(!n||!c) return;
  const isAbs=getComputedStyle(c).position==='absolute';
  const isCv=isCanvasNode(n);
  const pr=c.offsetParent||pv; const prr=pr.getBoundingClientRect();
  act={mode:'resize',hk:hd.dataset.h,node:n,clone:c,isAbs,isCv,isImg:n.tagName==='IMG',
       sx:e.clientX,sy:e.clientY,pw:prr.width||1,ph:prr.height||1,changed:{}};
  const st=n.style;
  act.w0=st.width?parseUnitVal(st.width,c.offsetWidth):{num:isAbs?c.offsetWidth/act.pw*100:c.offsetWidth,unit:isAbs?'%':'px'};
  act.h0=st.height?parseUnitVal(st.height,c.offsetHeight):{num:isAbs?c.offsetHeight/act.ph*100:c.offsetHeight,unit:isAbs?'%':'px'};
  act.l0=st.left?parseUnitVal(st.left,c.offsetLeft):{num:c.offsetLeft/act.pw*100,unit:'%'};
  act.t0=st.top?parseUnitVal(st.top,c.offsetTop):{num:c.offsetTop/act.ph*100,unit:'%'};
  act.hadH=!!st.height; act.hadW=!!st.width; act.hadL=!!st.left; act.hadT=!!st.top;
  act.usesRight=!!st.right&&!st.left; act.usesBottom=!!st.bottom&&!st.top;
  if(isCv){ const m=/^\s*([\d.]+)\s*\/\s*([\d.]+)\s*$/.exec(st.aspectRatio||''); act.ar=m?{w:+m[1],h:+m[2]}:null; act.cw=c.getBoundingClientRect().width; }
  if(!isAbs&&!isCv){ act.mw0=st.maxWidth?parseUnitVal(st.maxWidth,c.offsetWidth):{num:c.offsetWidth,unit:'px'}; act.fh0=st.height?parseUnitVal(st.height,c.offsetHeight):{num:c.offsetHeight,unit:'px'}; }
}));
/* —— 旋轉控制點 —— */
ovl.querySelector('.rot').addEventListener('mousedown',e=>{
  e.preventDefault(); e.stopPropagation();
  const n=selNode(), c=selClone(); if(!n||!c) return;
  const r=c.getBoundingClientRect();
  act={mode:'rotate',node:n,clone:c,cx:r.left+r.width/2,cy:r.top+r.height/2,changed:{}};
});
document.addEventListener('mousemove',e=>{
  if(!act) return;
  if(act.mode==='maybe'||act.mode==='move'){
    const dx=e.clientX-act.sx, dy=e.clientY-act.sy;
    if(Math.abs(dx)+Math.abs(dy)>3) act.moved=true;
    if(!act.moved||act.moveUid==null) return;
    if(act.mode!=='move'){ act.mode='move'; if(selectedUid!==act.moveUid) applySelection(act.moveUid,{silent:true}); }
    const hd=(act.h==='left')?dx:-dx, vd=(act.v==='top')?dy:-dy;
    act.hCur=fmtU(act.hv.unit==='%'?act.hv.num+hd/act.pw*100:act.hv.num+hd,act.hv.unit);
    act.vCur=fmtU(act.vv.unit==='%'?act.vv.num+vd/act.ph*100:act.vv.num+vd,act.vv.unit);
    act.clone.style[act.h]=act.hCur; act.clone.style[act.v]=act.vCur;
    positionOverlay();
    return;
  }
  if(act.mode==='resize'){
    const dx=e.clientX-act.sx, dy=e.clientY-act.sy, k=act.hk, ch=act.changed, c=act.clone;
    const dW=(k.includes('e')?dx:0)+(k.includes('w')?-dx:0);
    const dH=(k.includes('s')?dy:0)+(k.includes('n')?-dy:0);
    if(act.isCv&&k==='s'){
      if(act.ar){ const nh=Math.max(40,Math.round(act.ar.h+dy*(act.ar.w/act.cw))); ch['aspect-ratio']=act.ar.w+'/'+nh; c.style.aspectRatio=ch['aspect-ratio']; }
      else{ const nh=Math.max(20,Math.round(act.fh0.num+dy)); ch['height']=nh+'px'; c.style.height=ch['height']; }
      positionOverlay(); return;
    }
    if(!act.isAbs){ // 流式：e＝max-width、s＝height
      if(k==='e'||k.includes('e')){ const v=Math.max(60,Math.round(act.mw0.num+dW)); ch['max-width']=v+'px'; c.style.maxWidth=ch['max-width']; }
      if(k==='s'||k.includes('s')){ const v=Math.max(10,Math.round(act.fh0.num+dH)); ch['height']=v+'px'; c.style.height=ch['height']; }
      positionOverlay(); return;
    }
    // absolute 圖層
    if(dW&&(k.includes('e')||k.includes('w'))){
      const v=Math.max(2,act.w0.unit==='%'?act.w0.num+dW/act.pw*100:act.w0.num+dW);
      ch['width']=fmtU(v,act.w0.unit); c.style.width=ch['width'];
      if(k.includes('w')&&!act.usesRight){ const l=act.l0.unit==='%'?act.l0.num+dx/act.pw*100:act.l0.num+dx; ch['left']=fmtU(l,act.l0.unit); c.style.left=ch['left']; }
    }
    if(!act.isImg&&dH&&(k.includes('n')||k.includes('s'))){
      const v=Math.max(2,act.h0.unit==='%'?act.h0.num+dH/act.ph*100:act.h0.num+dH);
      ch['height']=fmtU(v,act.h0.unit); c.style.height=ch['height'];
      if(k.includes('n')&&!act.usesBottom){ const t2=act.t0.unit==='%'?act.t0.num+dy/act.ph*100:act.t0.num+dy; ch['top']=fmtU(t2,act.t0.unit); c.style.top=ch['top']; }
    }
    positionOverlay(); return;
  }
  if(act.mode==='rotate'){
    let ang=Math.atan2(e.clientY-act.cy,e.clientX-act.cx)*180/Math.PI+90;
    ang=Math.round(((ang+180)%360+360)%360-180);
    if(e.shiftKey) ang=Math.round(ang/15)*15;
    act.ang=ang;
    setT(act.clone,'rotate',ang,ang===0);
    positionOverlay();
  }
});
document.addEventListener('mouseup',()=>{
  if(!act) return;
  const a=act; act=null;
  if((a.mode==='maybe')&&!a.moved){ applySelection(a.clickUid,{silent:true}); return; }
  if(a.mode==='move'&&a.hCur){
    a.node.style[a.h]=a.hCur; a.node.style[a.v]=a.vCur;
    writeback(a.node);
    toast(`<b>位置</b> ${a.h}:${a.hCur} · ${a.v}:${a.vCur}`);
    return;
  }
  if(a.mode==='resize'&&Object.keys(a.changed).length){
    for(const [p,v] of Object.entries(a.changed)) a.node.style.setProperty(p,v);
    writeback(a.node);
    toast('<b>尺寸已更新</b>');
    return;
  }
  if(a.mode==='rotate'&&a.ang!=null){
    setT(a.node,'rotate',a.ang,a.ang===0);
    writeback(a.node);
    toast('<b>旋轉</b> '+a.ang+'°');
  }
});
$('#canvas').addEventListener('mousedown',e=>{ if(e.target.id==='canvas'||e.target.id==='page'||e.target.id==='pv') clearSelection(); });

/* ═══════════ 12.5 文字就地編輯＋反白迷你工具列 ═══════════ */
const tt=$('#tt');
let editCtx=null;
pv.addEventListener('dblclick',e=>{
  if(editingText) return;
  const t=e.target.closest('[data-cdbuid]'); if(!t) return;
  const uid=+t.getAttribute('data-cdbuid');
  const n=modelEls[uid]; if(!n||n.tagName==='IMG') return;
  e.preventDefault(); e.stopPropagation();
  applySelection(uid,{silent:true});
  startTextEdit(uid);
});
obox.addEventListener('dblclick',()=>{ if(selectedUid>=0&&!editingText&&selNode()&&selNode().tagName!=='IMG') startTextEdit(selectedUid); });
function startTextEdit(uid){
  const node=modelEls[uid], clone=uid2clone.get(uid); if(!node||!clone) return;
  editingText=true; editCtx={uid,node,clone};
  ovl.classList.remove('on');
  clone.setAttribute('contenteditable','true');
  clone.querySelectorAll('[data-cdbvar]').forEach(x=>x.setAttribute('contenteditable','false'));
  try{ document.execCommand('styleWithCSS',false,false); }catch(e){}
  clone.focus();
  const r=clone.getBoundingClientRect();
  tt.style.left=Math.max(8,r.left)+'px'; tt.style.top=Math.max(8,r.top-46)+'px';
  tt.classList.add('on');
  toast('編輯中：反白幾個字可單獨調整 · 按 <b>✓ 完成</b> 或點外面結束');
}
function commitTextEdit(){
  if(!editCtx) return;
  const {node,clone}=editCtx;
  clone.removeAttribute('contenteditable');
  const tmp=clone.cloneNode(true);
  tmp.querySelectorAll('[data-cdbuid]').forEach(x=>x.removeAttribute('data-cdbuid'));
  tmp.querySelectorAll('[data-cdbvar]').forEach(x=>x.replaceWith(document.createTextNode(x.getAttribute('data-cdbvar'))));
  tmp.querySelectorAll('*').forEach(x=>{ for(const a of [...x.attributes]){ if(a.name.startsWith('data-cdbraw-')){ x.setAttribute(a.name.slice(12),a.value); x.removeAttribute(a.name); } } });
  tmp.querySelectorAll('.cdb-hover,.cdb-sel').forEach(x=>{ x.classList.remove('cdb-hover','cdb-sel'); if(!x.getAttribute('class')) x.removeAttribute('class'); });
  node.innerHTML=tmp.innerHTML;
  editingText=false; editCtx=null;
  tt.classList.remove('on');
  writeback(node);
}
document.addEventListener('mousedown',e=>{
  if(!editingText) return;
  if(e.target.closest('#tt')) return;
  if(editCtx&&(e.target===editCtx.clone||editCtx.clone.contains(e.target))) return;
  commitTextEdit();
},true);
document.addEventListener('selectionchange',()=>{
  if(!editingText||!editCtx) return;
  const s=getSelection();
  if(s.rangeCount&&!s.isCollapsed&&editCtx.clone.contains(s.anchorNode)){
    const r=s.getRangeAt(0).getBoundingClientRect();
    if(r.width||r.height){ tt.style.left=Math.max(8,r.left)+'px'; tt.style.top=Math.max(8,r.top-46)+'px'; }
  }
});
tt.addEventListener('mousedown',e=>e.preventDefault());
function wrapSel(styleObj){
  const s=getSelection(); if(!s.rangeCount||s.isCollapsed) { toast('先反白要調整的文字'); return; }
  const r=s.getRangeAt(0);
  const span=document.createElement('span');
  Object.assign(span.style,styleObj);
  try{ r.surroundContents(span); }
  catch(err){ span.appendChild(r.extractContents()); r.insertNode(span); }
  s.removeAllRanges(); const nr=document.createRange(); nr.selectNodeContents(span); s.addRange(nr);
}
function selFontPx(){
  const s=getSelection();
  let el=s.anchorNode; if(el&&el.nodeType===3) el=el.parentElement;
  return el?parseFloat(getComputedStyle(el).fontSize)||16:16;
}
$('#ttB').addEventListener('click',()=>{ try{ document.execCommand('bold'); }catch(e){} });
$('#ttI').addEventListener('click',()=>{ try{ document.execCommand('italic'); }catch(e){} });
$('#ttSizeUp').addEventListener('click',()=>wrapSel({fontSize:Math.round(selFontPx()+2)+'px'}));
$('#ttSizeDn').addEventListener('click',()=>wrapSel({fontSize:Math.max(8,Math.round(selFontPx()-2))+'px'}));
$('#ttColor').addEventListener('click',()=>wrapSel({color:currentColor()}));
$('#ttDone').addEventListener('click',commitTextEdit);

/* ═══════════ 13. 鍵盤 ═══════════ */
document.addEventListener('keydown',e=>{
  if(editingText){ if(e.key==='Escape'){ e.preventDefault(); commitTextEdit(); } return; }
  const inField=e.target.closest('input,textarea,select')||e.target.isContentEditable;
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key.toLowerCase()==='c'&&!inField){
    const n=selNode();
    if(n&&String(getSelection())===''){ copyText(serializeNode(n),'<b>已複製</b>選取區塊的 code'); }
    return;
  }
  if(mod&&e.key.toLowerCase()==='z'&&!e.shiftKey&&!inField){ e.preventDefault(); doUndo(); return; }
  if(mod&&(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))&&!inField){ e.preventDefault(); doRedo(); return; }
  if((e.key==='Delete'||e.key==='Backspace')&&!inField){
    const n=selNode(); if(n){ e.preventDefault(); n.remove(); clearSelection(); writeback(null); toast('<b>已刪除</b>元素'); }
    return;
  }
  if(e.key==='Escape'&&!inField){ clearSelection(); $('#warnPanel').classList.remove('on'); }
});
