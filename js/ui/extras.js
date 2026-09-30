'use strict';
/* ═══════════ 27. v3.7：共用深淺／黑白名單查詢／備份／重設 ═══════════ */
/* 深淺：和黑白名單查詢網站共用 cd-theme */
{ const _st=setTheme; setTheme=function(t){ _st(t); store('cd-theme',t); if(typeof renderDecos==='function'){ renderDecos(); } }; }
window.addEventListener('storage',e=>{ if(e.key==='cd-theme'&&e.newValue&&e.newValue!==document.documentElement.dataset.theme) setTheme(e.newValue==='light'?'light':'dark'); });

/* 黑白名單查詢：一律開 index，新分頁，帶目前語言；深淺靠共用的 cd-theme */
$('#btnRef').addEventListener('click',()=>{
  store('cd-theme',document.documentElement.dataset.theme||'dark');
  $('#btnRef').href='https://saltenfish.github.io/Cvdk_black-whitelist_v2/index.html?lang='+(window.UI_LANG||'zh');
});

/* 備份：匯出／匯入 localStorage 裡本工具的資料 */
function ownKeys(){ const k=[]; try{ for(let i=0;i<localStorage.length;i++){ const x=localStorage.key(i); if(/^cdb/.test(x)) k.push(x); } }catch(e){} return k; }
$('#bkExport').addEventListener('click',()=>{
  store(codeKey(mode),codeEl.value);
  const data={}; ownKeys().forEach(k=>data[k]=load(k));
  const blob=new Blob([JSON.stringify({app:'caveduck-layout',ver:1,date:new Date().toISOString(),data},null,1)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  const d=new Date(); a.download='caveduck-layout-backup_'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'.json';
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500);
  toast('<b>已匯出</b> '+Object.keys(data).length+' 項資料');
});
$('#bkImport').addEventListener('click',()=>$('#bkFile').click());
$('#bkFile').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const j=JSON.parse(r.result); if(!j||j.app!=='caveduck-layout'||!j.data) throw 0;
      Object.entries(j.data).forEach(([k,v])=>{ if(/^cdb/.test(k)&&typeof v==='string') store(k,v); });
      toast('<b>已匯入</b>，重新載入中…'); setTimeout(()=>location.reload(),700);
    }catch(err){ toast('⚠ 這不是排版室的備份檔'); }
    e.target.value='';
  };
  r.readAsText(f);
});

/* 重設（按兩次才執行） */
function armTwice(btn,fn){
  btn.addEventListener('click',()=>{
    if(btn.dataset.armed){ delete btn.dataset.armed; btn.textContent=btn.dataset.orig; fn(); return; }
    btn.dataset.armed='1'; btn.dataset.orig=btn.textContent; btn.textContent=(window.UI_T?UI_T('確定？再按一次'):'確定？再按一次');
    setTimeout(()=>{ if(btn.dataset.armed){ delete btn.dataset.armed; btn.textContent=btn.dataset.orig; } },2600);
  });
}
armTwice($('#rsExample'),()=>{ pushUndo(); codeEl.value=STARTERS[mode]; clearSelection(); parseAndRender(); toast('已換回「'+MODES[mode].name+'」的範例（可按 ↩ 復原）'); });
armTwice($('#rsLayout'),()=>{
  const drop=['cdb3_sideW2','cdb3_sideW','cdb3_propW','cdb3_codeH','cdb3_codeopen','cdb3_psopen','cdb3_animopen','cdb3_decoopen','cdb3_formkinds','cdb3_formwrap','cdb3_w','cdb3_tab','cdb3_drawer','cdb3_theme','cdb3_cvoff','cdb3_cvextra','cdb_wrap','cdb_sideW','cdb_rightW','cd-theme'];
  ownKeys().forEach(k=>{ if(/^cdb3_libopen_/.test(k)) drop.push(k); });
  drop.forEach(k=>{ try{ localStorage.removeItem(k); }catch(e){} });
  store(codeKey(mode),codeEl.value);
  toast('已還原外觀設定，重新載入中…'); setTimeout(()=>{ location.href=location.pathname; },700);
});

/* code 列：複製全部／壓縮空行 */
$('#btnCopyCode').addEventListener('click',()=>{ if(!codeEl.value.trim()){ toast('目前沒有內容可複製'); return; } copyText(codeEl.value,'<b>已複製</b>整份 HTML'); });
$('#btnSqueeze').addEventListener('click',()=>{
  const v=codeEl.value; let n=0;
  const out=v.replace(/\r\n/g,'\n').replace(/\n[ \t]*\n(?:[ \t]*\n)+/g,()=>{ n++; return '\n\n'; });
  if(!n){ toast('沒有連續的空白行'); return; }
  pushUndo(); codeEl.value=out; parseAndRender(); toast('<b>已壓縮</b> '+n+' 處連續空白行');
});

/* ═══════════ 29. v3.8：手機版（≤760px）═══════════ */
const MQ_MOBILE=matchMedia('(max-width:760px)');
const TOUCH_UI=matchMedia('(hover:none)').matches||('ontouchstart' in window);
document.documentElement.classList.toggle('touchUI',TOUCH_UI);
/* 面板標題加關閉鈕（手機的面板是從下面拉起的） */
{ const h=document.querySelector('#side .drawerHead'); if(h){ const x=document.createElement('button'); x.type='button'; x.className='sheetX'; x.title='關閉'; x.textContent='✕'; x.addEventListener('click',()=>setDrawer(false)); h.appendChild(x); } }
/* 觸控：清單項目不做拖曳（讓手指可以捲動），改用「點開→插入」 */
{ const _hd=startHtmlDrag; startHtmlDrag=function(ev,spec){ if(ev.pointerType==='touch') return; return _hd(ev,spec); }; }
{ const _ad=startAssetDrag; startAssetDrag=function(ev,url,idx){ if(ev.pointerType==='touch'){ selAsset=idx; renderAssets(); buildFormGrid(); return; } return _ad(ev,url,idx); }; }
/* 觸控：在預覽裡點選、拖曳圖層、拖控制點縮放／旋轉、點兩下改字 */
(function(){
  let tAct=null, lastTap={t:0,el:null};
  const fire=(type,target,t)=>target.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:t.clientX,clientY:t.clientY,button:0,buttons:type==='mouseup'?0:1,view:window}));
  const zone=el=>el&&el.closest&&(el.closest('#pv')||el.closest('#ovl .h')||el.closest('#ovl .rot'));
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||editingText) return;
    const t=e.touches[0], el=e.target;
    if(!zone(el)||el.closest('[contenteditable=true]')) return;
    tAct={el,sx:t.clientX,sy:t.clientY,moved:false,handle:!!el.closest('#ovl')};
    fire('mousedown',el,t);
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!tAct) return;
    const t=e.touches[0];
    if(Math.abs(t.clientX-tAct.sx)+Math.abs(t.clientY-tAct.sy)>6) tAct.moved=true;
    // 拖的是畫布圖層或控制點 → 擋掉捲動；一般區塊 → 讓畫面照常捲動
    const dragging=tAct.handle||(typeof act!=='undefined'&&act&&(act.moveUid!=null||act.mode==='resize'||act.mode==='rotate'));
    if(dragging){ e.preventDefault(); fire('mousemove',document,t); }
  },{passive:false});
  const end=e=>{
    if(!tAct) return;
    const t=e.changedTouches[0], a=tAct; tAct=null;
    fire('mouseup',document,t);
    if(e.cancelable) e.preventDefault();          // 不要再多送一次滑鼠事件
    if(!a.moved&&!a.handle){
      const sm=a.el.closest&&a.el.closest('summary');   // 手機點 summary：開關 details（上面擋掉了原本的 click）
      if(sm&&pv.contains(sm)&&!editingText&&sm.parentElement&&sm.parentElement.tagName==='DETAILS') sm.parentElement.open=!sm.parentElement.open;
      const now=Date.now();
      if(now-lastTap.t<380&&lastTap.el===a.el){ fire('dblclick',a.el,t); lastTap={t:0,el:null}; }
      else lastTap={t:now,el:a.el};
    }
  };
  document.addEventListener('touchend',end,{passive:false});
  document.addEventListener('touchcancel',()=>{ if(tAct){ tAct=null; document.dispatchEvent(new MouseEvent('mouseup',{bubbles:true})); } });
})();
/* 手機：一開始先看預覽（面板收起）、預覽寬度用滿版 */
window.addEventListener('DOMContentLoaded',()=>{
  if(!MQ_MOBILE.matches) return;
  setDrawer(false);
  if(!load('cdb3_w_m')){ setWidth('full'); store('cdb3_w_m','1'); }
});
MQ_MOBILE.addEventListener('change',()=>requestAnimationFrame(positionOverlay));

/* ═══════════ 30. v3.9：預覽裡的 details／summary 可以點開測試（聊天室、小工具）═══════════ */
/* 只改預覽，不會寫進 code；重新渲染後保留你點開的狀態 */
const DET_STATE={}; let detMode=null;
function detRecord(){ if(!detMode) return; DET_STATE[detMode]=[...pv.querySelectorAll('details')].map(d=>({src:d.dataset.srcOpen==='1',cur:d.open})); }
function updDetBtn(){
  const b=$('#detToggle'); if(!b) return;
  const ds=[...pv.querySelectorAll('details')];
  b.style.display=(mode==='info'||!ds.length)?'none':'';
  const anyClosed=ds.some(d=>!d.open);
  b.textContent=anyClosed?'▾ 全部展開':'▸ 全部收合';
  b.title=mode==='widget'?'只影響預覽，不會改到 code（小工具在 CaveDuck 上一定是收合的）':'只影響預覽，不會改到 code';
}
{ const _pr=parseAndRender; parseAndRender=function(k){
  detRecord();
  const r=_pr(k);
  detMode=mode;
  const st=DET_STATE[mode]||[];
  pv.querySelectorAll('details').forEach((d,i)=>{ d.dataset.srcOpen=d.open?'1':'0'; const s=st[i]; if(s&&s.src===d.open) d.open=s.cur; });
  updDetBtn(); try{ positionOverlay(); }catch(e){}
  return r;
}; }
pv.addEventListener('toggle',()=>{ updDetBtn(); requestAnimationFrame(()=>{ try{ positionOverlay(); }catch(e){} }); },true);
$('#detToggle').addEventListener('click',()=>{
  const ds=[...pv.querySelectorAll('details')]; const open=ds.some(d=>!d.open);
  ds.forEach(d=>d.open=open); updDetBtn();
});
