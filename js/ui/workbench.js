'use strict';
/* ═══════════ 24. v3.1：工作台深淺・寬度自訂・顏色小視窗・屬性欄 ═══════════ */
/* —— 工作台深淺（預覽不受影響） —— */
function setTheme(t){
  document.documentElement.dataset.theme=t;
  const pg=$('#page'); pg.classList.remove('dark','light'); pg.classList.add(t);
  $$('#segTheme button').forEach(b=>b.classList.toggle('on',b.dataset.theme===t));
  store('cdb3_theme',t);
}
$('#segTheme').addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) setTheme(b.dataset.theme); });

/* —— 寬度：預設＋自訂＋兩個儲存格 —— */
let wSlots=[null,null];
try{ const v=JSON.parse(load('cdb3_wslots')||'null'); if(Array.isArray(v)&&v.length===2) wSlots=v; }catch(e){}
let curW='780';
function setWidth(w){
  w=String(w); curW=w;
  $('#page').style.width=(w==='full')?'100%':(parseInt(w)+'px');
  $$('#segW button').forEach(b=>b.classList.toggle('on',b.dataset.w===w));
  $$('#wSlots button').forEach(b=>{ const v=wSlots[+b.dataset.slot]; b.classList.toggle('on',v!=null&&String(v)===w); });
  $('#wIn').value=(w==='full')?'':parseInt(w);
  store('cdb3_w',w);
  requestAnimationFrame(()=>{ try{ positionOverlay(); }catch(e){} });
}
function renderWSlots(){
  $$('#wSlots button').forEach(b=>{
    const v=wSlots[+b.dataset.slot];
    b.classList.toggle('empty',v==null);
    b.textContent=v==null?'＋空格':('📌'+v);
    b.title=v==null?'空格：先在左邊輸入寬度，再點這裡存進來':('套用 '+v+'px（右鍵＝清除這格）');
  });
  setWidth(curW);
}
function readWIn(){ const v=parseInt($('#wIn').value); if(!(v>=200&&v<=2000)){ toast('寬度請輸入 200～2000'); return null; } return v; }
$('#segW').addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) setWidth(b.dataset.w); });
$('#wIn').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const v=readWIn(); if(v){ setWidth(v); toast('寬度 <b>'+v+'px</b>'); } } });
$('#wIn').addEventListener('change',()=>{ const v=readWIn(); if(v) setWidth(v); });
function saveWidthTo(i){
  const v=readWIn(); if(!v) return;
  wSlots[i]=v; store('cdb3_wslots',JSON.stringify(wSlots)); setWidth(v); renderWSlots();
  toast('已把 <b>'+v+'px</b> 存進第 '+(i+1)+' 格');
}
$('#wSave').addEventListener('click',()=>{
  const v=readWIn(); if(!v) return;
  if(wSlots.includes(v)){ setWidth(v); toast('這個寬度已經存過了'); return; }
  const i=wSlots.indexOf(null);
  if(i<0){ toast('兩格都滿了——在格子上按<b>右鍵</b>清除一格再存'); return; }
  saveWidthTo(i);
});
$('#wSlots').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const i=+b.dataset.slot; if(wSlots[i]==null) saveWidthTo(i); else setWidth(wSlots[i]); });
$('#wSlots').addEventListener('contextmenu',e=>{ const b=e.target.closest('button'); if(!b) return; e.preventDefault(); const i=+b.dataset.slot; if(wSlots[i]==null) return; wSlots[i]=null; store('cdb3_wslots',JSON.stringify(wSlots)); renderWSlots(); toast('已清除第 '+(i+1)+' 格'); });


/* —— 面板寬度拖曳 —— */
(function(){
  const R=document.documentElement;
  const s=load('cdb3_sideW2'); if(s) R.style.setProperty('--sideW',s+'px');
  $('#gutterL').addEventListener('mousedown',e=>{
    e.preventDefault(); const g=$('#gutterL'); g.classList.add('drag');
    const w0=$('#side').getBoundingClientRect().width, sx=e.clientX;
    const move=ev=>{ const w=Math.max(290,Math.min(560,w0+ev.clientX-sx)); R.style.setProperty('--sideW',Math.round(w)+'px'); try{ positionOverlay(); }catch(_){} };
    const up=()=>{ document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); g.classList.remove('drag'); store('cdb3_sideW2',parseInt(getComputedStyle(R).getPropertyValue('--sideW'))||''); };
    document.addEventListener('mousemove',move); document.addEventListener('mouseup',up);
  });
})();

/* —— 屬性分區：記住展開／收合 —— */
(function(){
  let st={}; try{ st=JSON.parse(load('cdb3_psopen')||'{}')||{}; }catch(e){}
  $$('details.ps').forEach(d=>{
    const k=d.dataset.g; d.open=!!st[k];
    d.addEventListener('toggle',()=>{ st[k]=d.open; store('cdb3_psopen',JSON.stringify(st)); });
  });
})();

/* —— 顏色：唯一的調色區（在屬性裡） —— */
let colTgt='color';
const TGT_NAME={color:'文字','background':'背景','border-color':'邊框'};
function bgOf(n){ const bi=n.style.backgroundImage, bc=n.style.backgroundColor; if(bi&&!/^(none|initial)$/.test(bi)) return bi; return (bc&&bc!=='initial')?bc:''; }
function tgtVal(n,p){ return p==='color'?n.style.color:p==='background'?bgOf(n):n.style.borderColor; }
function paletteFrom(val){
  const mh=/#([0-9a-f]{6})\b/i.exec(val||''); const mr=/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/i.exec(val||'');
  let hex=null,a=100;
  if(mh) hex='#'+mh[1].toLowerCase();
  else if(mr){ hex='#'+[mr[1],mr[2],mr[3]].map(x=>(+x).toString(16).padStart(2,'0')).join(''); if(mr[4]!=null) a=Math.round(parseFloat(mr[4])*100); }
  if(!hex) return false;
  $('#colMain').value=hex; $('#colHex').value=hex; $('#colAlpha').value=a; refreshColor(); return true;
}
function syncColorUI(){
  const n=selNode();
  const put=(id,v)=>{ const el=$(id); if(el) el.style.background=v||'transparent'; };
  put('#ctText',n?n.style.color:''); put('#ctBg',n?bgOf(n):''); put('#ctBd',n?n.style.borderColor:'');
  $$('#colTarget button').forEach(b=>b.classList.toggle('on',b.dataset.p===colTgt));
  $('#colApplyGo').textContent='套用到'+TGT_NAME[colTgt];
  $('#rawText').style.display=colTgt==='color'?'':'none';
  $('#rawBg').style.display=colTgt==='background'?'':'none';
  const sv=$('#svColor'); if(sv&&n){ sv.innerHTML=[n.style.color,bgOf(n),n.style.borderColor].filter(Boolean).slice(0,3).map(c=>`<i style="display:inline-block;width:11px;height:11px;border-radius:3px;border:1px solid rgba(128,128,128,.4);background:${c.replace(/"/g,"'")}"></i>`).join(''); }
}
function applyColorTo(p,c){
  const n=selNode(); if(!n){ toast('先在預覽中點選一個元素'); return; }
  if(p==='background'){ n.style.removeProperty('background'); n.style.setProperty('background',c); }
  else if(p==='border-color'){ if(!n.style.borderStyle||n.style.borderStyle==='none'||n.style.borderStyle==='initial') n.style.setProperty('border','1px solid '+c); else n.style.setProperty('border-color',c); }
  else n.style.setProperty('color',c);
  pushRecent(c); writeback(n); toast('<b>'+TGT_NAME[p]+'</b> '+c);
}
$('#colTarget').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  colTgt=b.dataset.p; const n=selNode(); if(n) paletteFrom(tgtVal(n,colTgt)); syncColorUI();
});
{ const _pick=pickSwatch; pickSwatch=function(c){ _pick(c); if(selNode()) applyColorTo(colTgt,currentColor()); }; }
$('#colMain').addEventListener('change',()=>{ if(selNode()) applyColorTo(colTgt,currentColor()); });
$('#colHex').addEventListener('keydown',e=>{ if(e.key==='Enter'&&selNode()) applyColorTo(colTgt,currentColor()); });
$('#colAlpha').addEventListener('change',()=>{ if(selNode()) applyColorTo(colTgt,currentColor()); });
$('#colApplyGo').addEventListener('click',()=>applyColorTo(colTgt,currentColor()));
$('#colClearGo').addEventListener('click',()=>{
  const n=selNode(); if(!n){ toast('先選取元素'); return; }
  if(colTgt==='background'){ n.style.removeProperty('background'); n.style.removeProperty('background-color'); }
  else n.style.removeProperty(colTgt);
  writeback(n); toast('已清除'+TGT_NAME[colTgt]+'色');
});
function openColorSection(){
  openDrawer('props'); const d=$('#psColor'); d.open=true;
  requestAnimationFrame(()=>{ try{ d.scrollIntoView({block:'start',behavior:'smooth'}); }catch(e){} });
}

/* —— 動畫：放在屬性裡，依類別收合 —— */
(function(){
  const root=$('#animList'), sel=$('#inAnim');
  let openCats=new Set();
  try{ const v=JSON.parse(load('cdb3_animopen')||'null'); if(Array.isArray(v)) openCats=new Set(v); }catch(e){}
  const saveOpen=()=>store('cdb3_animopen',JSON.stringify([...openCats]));
  const tools=document.createElement('div'); tools.className='animTools';
  tools.innerHTML='<button class="mbtn" data-t="open">全部展開</button><button class="mbtn" data-t="close">全部收合</button>';
  root.appendChild(tools);
  const cats=[];
  ANIMS.forEach(g=>{
    const og=document.createElement('optgroup'); og.label=g.g;
    const det=document.createElement('details'); det.className='acat'; det.open=openCats.has(g.g);
    det.innerHTML=`<summary>${esc(g.g)}<span class="ac">${g.list.length}</span></summary><div class="agrid"></div>`;
    det.addEventListener('toggle',()=>{ if(det.open) openCats.add(g.g); else openCats.delete(g.g); saveOpen(); });
    const grid=det.querySelector('.agrid');
    g.list.forEach(([nm,zh])=>{
      const o=document.createElement('option'); o.value=nm; o.textContent=zh; og.appendChild(o);
      const b=document.createElement('button'); b.dataset.a=nm; b.title='套用：'+nm;
      b.innerHTML=`<span>${esc(zh)}</span><small>${nm}</small>`;
      b.addEventListener('click',()=>{
        const n=selNode(); if(!n){ toast('先在預覽中點選一個元素'); return; }
        applyAnimTo(n,nm,$('#inAnimSpeed').value,$('#inAnimInf').checked);
        const dl=parseFloat($('#animDelay').value)||0; const cur=selNode();
        if(cur&&dl>0){ cur.style.setProperty('animation-delay',dl+'s'); writeback(cur); }
        toast('<b>動畫</b> '+zh);
      });
      grid.appendChild(b);
    });
    sel.appendChild(og); root.appendChild(det); cats.push(det);
  });
  tools.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const o=b.dataset.t==='open'; cats.forEach(d=>d.open=o); });
  $('#animDelay').addEventListener('change',()=>{
    const n=selNode(); if(!n) return; const dl=parseFloat($('#animDelay').value)||0;
    if(dl>0) n.style.setProperty('animation-delay',dl+'s'); else n.style.removeProperty('animation-delay');
    writeback(n);
  });
})();

/* —— 屬性面板：選取後的補充 —— */
{
  const _pp=populateProps;
  populateProps=function(){
    _pp();
    const n=selNode(), c=selClone(); if(!n) return;
    const isAbs=!!(c&&getComputedStyle(c).position==='absolute');
    const isCv=(n.style.position||'')==='relative';
    const canCv=!isCv&&n.tagName!=='IMG'&&(n.children.length>0||!n.textContent.trim());
    const H=$('#propsHead');
    H.classList.toggle('isCanvas',isCv); H.classList.toggle('noConvert',!isCv&&!canCv);
    $('#stackRow').style.display=isAbs?'':'none';
    $('#selLabel').textContent=labelFor(n);
    $('#propsSub').textContent=isCv?'畫布':isAbs?'圖層':'一般區塊';
    if($('#tabs button[data-tab=props]').classList.contains('on')) $('#drawerSub').textContent=isCv?'畫布：裡面的東西是圖層':isAbs?'圖層：可在預覽裡自由拖曳':'一般區塊：由上往下排';
    ovl.querySelector('.qcv').style.display=canCv?'':'none';
    const st=n.style;
    $('#svBox').textContent=(st.width||'auto')+' × '+(st.height||(st.aspectRatio?'比例':'auto'));
    $('#svText').textContent=[st.fontSize&&(parseClampMax(st.fontSize)?parseClampMax(st.fontSize)+'px':st.fontSize),st.fontWeight].filter(Boolean).join(' · ');
    $('#svLook').textContent=[st.opacity&&('透明 '+Math.round(parseFloat(st.opacity)*100)+'%'),st.borderRadius&&('圓角 '+st.borderRadius)].filter(Boolean).join(' · ');
    const an=$('#inAnim'); const nm=an.value; const opt=an.selectedOptions[0];
    $('#animNowName').textContent=nm?(opt?opt.textContent:nm):'無';
    $('#svAnim').textContent=nm?(opt?opt.textContent:nm):'';
    $$('#animList .agrid button').forEach(b=>b.classList.toggle('on',b.dataset.a===nm));
    const dl=/([\d.]+)s/.exec(st.animationDelay||''); $('#animDelay').value=dl?dl[1]:0;
    $$('#tabs button[data-tab=props]').forEach(b=>b.classList.add('hasSel'));
    syncColorUI();
  };
  const _cs=clearSelection;
  clearSelection=function(){ _cs(); $$('#tabs button[data-tab=props]').forEach(b=>b.classList.remove('hasSel')); if($('#tabs button[data-tab=props]').classList.contains('on')) $('#drawerSub').textContent='點選預覽中的元素'; };
}
/* 在預覽裡點選元素 → 左邊自動切到「屬性」 */
pv.addEventListener('click',()=>{ if(selectedUid>=0) openDrawer('props'); });
pv.addEventListener('dblclick',()=>{ if(selectedUid>=0) openDrawer('props'); });

/* —— 圖片形式：畫布圖層／流式 兩類可收合 —— */
let formKindOpen={layer:false,flow:false};
try{ const v=JSON.parse(load('cdb3_formkinds')||'null'); if(v) formKindOpen=Object.assign(formKindOpen,v); }catch(e){}
buildFormGrid=function(){
  const g=$('#formGrid'); if(!g) return;
  const url=(curAssetUrl()||IMG_PLACEHOLDER).replace(/'/g,'%27');
  const frag=document.createDocumentFragment();
  ['layer','flow'].forEach(kind=>{
    const list=IMG_FORMS.filter(f=>f.kind===kind);
    const open=formKindOpen[kind];
    const lb=document.createElement('button'); lb.className='fkind';
    lb.innerHTML=`<span>${open?'▾':'▸'}</span><span>${kind==='layer'?'畫布圖層形式（拖到畫布上用這些）':'流式形式（拖到畫布外／一般插入）'}</span><span class="fc">${list.length} 種</span>`;
    lb.addEventListener('click',()=>{ formKindOpen[kind]=!formKindOpen[kind]; store('cdb3_formkinds',JSON.stringify(formKindOpen)); buildFormGrid(); });
    frag.appendChild(lb);
    if(!open) return;
    list.forEach(f=>{
      const c=document.createElement('div'); c.className='fcard'+(f.key===imgForm?' selF':''); c.title=f.name+'：按住拖到預覽＝用這個形式放圖（點一下＝設為預設形式）';
      const pv2=document.createElement('div'); pv2.className='fprev';
      pv2.innerHTML=applyImgSettings(f.tpl(url));
      const root=pv2.firstElementChild;
      if(root&&f.kind==='layer'&&f.key!=='cover'){ root.style.top='6%'; root.style.left='22%'; root.style.width='56%'; }
      const nm=document.createElement('div'); nm.className='fname'; nm.textContent=f.name;
      c.appendChild(pv2); c.appendChild(nm);
      c.addEventListener('click',()=>{ imgForm=f.key; buildFormGrid(); });
      c.addEventListener('pointerdown',ev=>{
        const u=curAssetUrl(); if(!u) return;
        startHtmlDrag(ev,{label:f.name,img:u,html:cv=>{
          const fo=cv?(f.kind==='layer'?f:IMG_FORMS[0]):(f.kind==='flow'?f:IMG_FORMS.find(x=>x.key==='fwide'));
          return applyImgSettings(fo.tpl(u));
        }});
      });
      frag.appendChild(c);
    });
  });
  g.replaceChildren(frag);
};

/* —— 我的常用設定（原「我的 CSS」） —— */
const MC_SKIP=/^(position|top|left|right|bottom|inset|width|height|max-width|max-height|min-width|min-height|margin.*|transform|z-index|aspect-ratio|animation.*)$/i;
function mcPreviewCss(css){
  return splitDecls(css).filter(d=>{ const i=d.indexOf(':'); return i>0&&!MC_SKIP.test(d.slice(0,i).trim()); }).join(';');
}
renderCssLib=function(){
  const root=$('#cssList');
  $('#cssCount').textContent=cssLib.length?`（${cssLib.length}）`:'';
  root.replaceChildren(...cssLib.map((it,i)=>{
    const isLayer=/position\s*:\s*absolute/i.test(it.css);
    const d=document.createElement('div'); d.className='mc-card';
    d.innerHTML=`<div class="mc-prev"><div>Aa</div></div>
      <div class="mc-main">
        <div class="mc-name"><span>${esc(it.name)}</span><span class="mc-tag">${isLayer?'圖層':'樣式'}</span></div>
        <div class="mc-css"></div>
        <div class="mc-btns"><button class="mbtn solid">${isLayer?'加到畫布':'套用到選取'}</button><button class="mbtn" title="複製 CSS">⧉</button><button class="mbtn" title="改名">✎</button><button class="mbtn danger" title="刪除（按兩下）">✕</button></div>
      </div>`;
    d.querySelector('.mc-css').textContent=it.css; d.querySelector('.mc-css').title=it.css;
    try{ d.querySelector('.mc-prev>div').setAttribute('style',mcPreviewCss(it.css)); }catch(e){}
    const [bMain,bCopy,bRen,bDel]=d.querySelectorAll('.mc-btns .mbtn');
    bMain.addEventListener('click',()=>{
      if(isLayer){ const cv=decoTarget(); if(!cv){ toast('找不到可放置的畫布'); return; } insertSmart(`<div style='${it.css.replace(/'/g,'"')}'></div>`,{canvas:cv}); }
      else{ const n=selNode(); if(!n){ toast('先在預覽中點選一個元素'); return; } const r=mergeCss(n,it.css); if(!r.added){ toast('沒有可加入的屬性（'+r.skipped+' 項已經設定過，保留原本的）'); return; } writeback(n); toast('<b>已套用</b>「'+esc(it.name)+'」'+(r.skipped?'（保留 '+r.skipped+' 項原本的設定）':'')); }
    });
    bCopy.addEventListener('click',()=>copyText(it.css,'<b>已複製</b> CSS'));
    bRen.addEventListener('click',()=>{
      const box=d.querySelector('.mc-name span'); const inp=document.createElement('input'); inp.className='tin'; inp.value=it.name; inp.style.cssText='flex:1;padding:2px 6px;font-size:12px';
      box.replaceWith(inp); inp.focus(); inp.select();
      const done=ok=>{ if(ok&&inp.value.trim()){ it.name=inp.value.trim(); saveCssLib(); } renderCssLib(); };
      inp.addEventListener('keydown',e=>{ if(e.key==='Enter') done(true); if(e.key==='Escape') done(false); });
      inp.addEventListener('blur',()=>done(true));
    });
    bDel.addEventListener('click',()=>{
      if(!bDel.dataset.armed){ bDel.dataset.armed='1'; bDel.textContent='確定？'; setTimeout(()=>{ if(bDel.dataset.armed){ delete bDel.dataset.armed; bDel.textContent='✕'; } },2400); return; }
      cssLib.splice(i,1); saveCssLib(); renderCssLib();
    });
    return d;
  }));
  if(!cssLib.length) root.innerHTML='<div class="hint">還沒有存任何設定。先在預覽選一個調好的元素，按「＋ 存選取元素」。</div>';
};
$('#cssFromSel').addEventListener('click',()=>{
  const n=selNode(); if(!n){ toast('先在預覽中點選一個調好的元素'); return; }
  let css=(n.getAttribute('style')||'').trim();
  css=splitDecls(css).filter(d=>!/^(top|left|right|bottom)\s*:/i.test(d)).join(';');
  if(!css){ toast('這個元素沒有 style 可以存'); return; }
  const name=$('#cssName').value.trim()||labelFor(n);
  cssLib.unshift({name,css:css+';'}); saveCssLib(); renderCssLib();
  $('#cssName').value='';
  toast('<b>已存</b>「'+esc(name)+'」到我的常用設定');
});

/* —— 圖片形式區塊：預設收起來 —— */
(function(){
  const w=$('#formWrap'), t=$('#formToggle');
  const set=c=>{ w.classList.toggle('collapsed',c); t.textContent=(c?'▸':'▾')+' 圖片形式（拖放／插入都套用）'; };
  set(load('cdb3_formwrap')!=='1');
  t.addEventListener('click',()=>{ setTimeout(()=>{ const c=w.classList.contains('collapsed'); set(c); store('cdb3_formwrap',c?'0':'1'); },0); });
})();
/* —— 雙引號屬性：只算標籤裡真正用雙引號包起來的屬性值（不算註解、文字、單引號值裡的內容） —— */
function countDQAttrs(src){
  let n=0,i=0; const L=src.length;
  while(i<L){
    const lt=src.indexOf('<',i); if(lt<0) break;
    if(src.startsWith('<!--',lt)){ const e=src.indexOf('-->',lt+4); i=e<0?L:e+3; continue; }
    if(!/[a-zA-Z]/.test(src[lt+1]||'')){ i=lt+1; continue; }
    let j=lt+1,q=null;
    while(j<L){
      const c=src[j];
      if(q){ if(c===q) q=null; j++; continue; }
      if(c==='>') break;
      if(c==='='){ let k=j+1; while(k<L&&/\s/.test(src[k])) k++; if(src[k]==='"'){ n++; q='"'; j=k+1; continue; } if(src[k]==="'"){ q="'"; j=k+1; continue; } }
      j++;
    }
    i=j+1;
  }
  return n;
}
