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
