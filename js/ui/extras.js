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
  if(window.UI_LANG) store('cd-lang',window.UI_LANG);   /* 重新載入後維持目前語言 */
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
    const dragging=tAct.handle||document.body.classList.contains('panMode')||(typeof act!=='undefined'&&act&&(act.moveUid!=null||act.mode==='resize'||act.mode==='rotate'));
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

/* ═══════════ 31. v4.0：圖片強化（示範圖提醒、可調參數的圖片形式、漫畫分鏡、屬性面板的圖片調整）═══════════ */

/* ── 示範圖（排版室內建的模擬圖）── */
const _normU=u=>{ let s=String(u||''); try{ s=decodeURIComponent(s); }catch(e){} return s.replace(/["'\s\\]/g,''); };
const DEMO_SET=new Set([...PH_ALL,IMG_PLACEHOLDER].map(_normU));
const PH_SLOT=/^(圖片網址|IMAGE_URL_|이미지URL|画像URL)\d*$/;
function isDemoImg(u){ return !!u&&(DEMO_SET.has(_normU(u))||PH_SLOT.test(String(u).trim())); }
function isRealUrl(u){ return !!u&&!/^data:/i.test(u.trim())&&!PH_SLOT.test(u.trim()); }
function rawBgUrl(n){ const st=n.getAttribute('style')||''; const m=/url\((['"]?)([^'")]+)\1\)/.exec(st); if(m) return m[2]; const k=/image-set\(\s*(['"])([^'"]+)\1/.exec(st); return k?k[2]:null; }
/* 圖片放在哪個屬性：bg（背景）／content（整個換成圖）／border（border-image） */
function imgKind(n){ const st=n.getAttribute('style')||''; if(/(^|;)\s*content\s*:\s*image-set/.test(st)) return 'content'; if(/border-image-source\s*:\s*image-set/.test(st)) return 'border'; return 'bg'; }
function countDemoImgs(){
  let n=0;
  (typeof model!=='undefined'&&model?[...model.querySelectorAll('*')]:[]).forEach(el=>{
    if(el.tagName==='IMG'){ if(isDemoImg(el.getAttribute('src'))) n++; }
    else{ const u=rawBgUrl(el); if(u&&isDemoImg(u)) n++; }
  });
  return n;
}
/* 頁面中的圖片：只列真的網址（示範圖、data: 圖不列） */
renderUsedImages=function(){
  const box=$('#imgUsed'); const uidOf=new Map(modelEls.map((el,i)=>[el,i]));
  const items=[];
  modelEls.forEach(el=>{ const u=el.tagName==='IMG'?el.getAttribute('src'):rawBgUrl(el); if(isRealUrl(u)) items.push([el,u]); });
  box.replaceChildren(...items.slice(0,60).map(([el,u])=>{
    const b=document.createElement('button'); b.className='uimg'; b.title=u;
    const t=document.createElement('img'); t.src=u; t.loading='lazy'; b.appendChild(t);
    b.addEventListener('click',()=>applySelection(uidOf.get(el)));
    return b;
  }));
  if(!items.length) box.innerHTML='<div class="hint" style="grid-column:1/-1">'+(window.UI_T?UI_T('頁面中還沒有圖片'):'頁面中還沒有圖片')+'</div>';
};
{ const _sa=syncAssetsFromModel; syncAssetsFromModel=function(){
  const before=assets.length; const r=_sa();
  const keep=assets.filter(isRealUrl); if(keep.length!==assets.length){ assets=keep; saveAssets(); renderAssets(); }
  return Math.max(0,assets.length-before);
}; }
/* 還沒換掉的示範圖 → 紅色警告 */
{ const _mc=modeChecks; modeChecks=function(src){
  const W=_mc(src);
  if(mode!=='widget'){ const n=countDemoImgs(); if(n) W.unshift({lv:'err',msg:`<b>${n} 張圖片還是示範圖</b>——點選圖片，在屬性最上面的「圖片網址」換成你自己的圖片`}); }
  return W;
}; }

/* ── 裁切形狀（clip-path）：k＝斜度 ── */
const SHAPES=[
 {k:'none',   n:'無'},
 {k:'slantB', n:'斜切下緣', s:1, f:k=>`polygon(0 0,100% 0,100% ${100-k}%,0 100%)`},
 {k:'slantT', n:'斜切上緣', s:1, f:k=>`polygon(0 ${k}%,100% 0,100% 100%,0 100%)`},
 {k:'slant2', n:'上下雙斜', s:1, f:k=>`polygon(0 ${k}%,100% 0,100% ${100-k}%,0 100%)`},
 {k:'slantL', n:'斜切左邊', s:1, f:k=>`polygon(${k}% 0,100% 0,100% 100%,0 100%)`},
 {k:'para',   n:'平行四邊形', s:1, f:k=>`polygon(${k}% 0,100% 0,${100-k}% 100%,0 100%)`},
 {k:'trap',   n:'梯形', s:1, f:k=>`polygon(${k}% 0,${100-k}% 0,100% 100%,0 100%)`},
 {k:'corner1',n:'單切角', s:1, f:k=>`polygon(0 0,${100-k}% 0,100% ${k}%,100% 100%,0 100%)`},
 {k:'corner2',n:'對角切角', s:1, f:k=>`polygon(${k}% 0,100% 0,100% ${100-k}%,${100-k}% 100%,0 100%,0 ${k}%)`},
 {k:'corner4',n:'四角切角', s:1, f:k=>`polygon(${k}% 0,${100-k}% 0,100% ${k}%,100% ${100-k}%,${100-k}% 100%,${k}% 100%,0 ${100-k}%,0 ${k}%)`},
 {k:'arrow',  n:'箭頭', s:1, f:k=>`polygon(0 0,${100-k}% 0,100% 50%,${100-k}% 100%,0 100%)`},
 {k:'chevron',n:'箭形', s:1, f:k=>`polygon(0 0,${100-k}% 0,100% 50%,${100-k}% 100%,0 100%,${k}% 50%)`},
 {k:'flag',   n:'燕尾旗', s:1, f:k=>`polygon(0 0,100% 0,${100-k}% 50%,100% 100%,0 100%)`},
 {k:'zigzag', n:'鋸齒下緣', s:1, f:k=>{ const n=10, d=Math.max(2,k/2); const p=['0 0','100% 0']; for(let i=n;i>=0;i--){ p.push(`${i*100/n}% ${i%2?100-d:100}%`); } return `polygon(${p.join(',')})`; }},
 {k:'circle', n:'圓形', f:()=>`circle(50% at 50% 50%)`},
 {k:'ellipse',n:'橢圓', f:()=>`ellipse(50% 50% at 50% 50%)`},
 {k:'arch',   n:'拱門', f:()=>`inset(0 round 50% 50% 0 0 / 35% 35% 0 0)`},
 {k:'diamond',n:'菱形', f:()=>`polygon(50% 0,100% 50%,50% 100%,0 50%)`},
 {k:'tri',    n:'三角形', f:()=>`polygon(50% 0,100% 100%,0 100%)`},
 {k:'hex',    n:'六角形', f:()=>`polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%)`},
 {k:'oct',    n:'八角形', f:()=>`polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)`},
 {k:'star',   n:'星形', f:()=>`polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)`},
 {k:'heart',  n:'心形', f:()=>`polygon(50% 100%,8% 58%,0 34%,4% 14%,18% 2%,34% 2%,50% 16%,66% 2%,82% 2%,96% 14%,100% 34%,92% 58%)`},
 {k:'burst',  n:'爆炸框', f:()=>{ const p=[]; for(let i=0;i<24;i++){ const a=i/24*Math.PI*2, r=i%2?36:50; p.push(`${(50+r*Math.cos(a)).toFixed(1)}% ${(50+r*Math.sin(a)).toFixed(1)}%`); } return `polygon(${p.join(',')})`; }}
];
function shapeCss(key,k){ const s=SHAPES.find(x=>x.k===key); return s&&s.f?s.f(k):''; }

/* ── 濾鏡：每個預設都是一組數值，點了之後還能再微調 ── */
const FV0={b:100,c:100,s:100,g:0,p:0,h:0,bl:0};
const FILTER_PRESETS=[
 {k:'none',n:'無',v:{}},
 {k:'gray',n:'黑白',v:{g:100}},
 {k:'sepia',n:'復古',v:{p:75,c:105}},
 {k:'cool',n:'冷調',v:{s:85,h:-12,b:102}},
 {k:'warm',n:'暖調',v:{p:30,s:130,h:-8}},
 {k:'contrast',n:'高對比',v:{c:135,s:115}},
 {k:'dream',n:'夢幻',v:{b:108,s:125,bl:0.5}},
 {k:'fade',n:'褪色',v:{s:55,b:110,c:90}},
 {k:'noir',n:'黑色電影',v:{g:100,c:145,b:90}},
 {k:'blur',n:'模糊',v:{bl:3}}
];
const FKEYS={b:'brightness',c:'contrast',s:'saturate',g:'grayscale',p:'sepia',h:'hue-rotate',bl:'blur'};
function filterFromVals(v){
  v={...FV0,...v}; const o=[];
  if(v.b!==100) o.push(`brightness(${v.b/100})`); if(v.c!==100) o.push(`contrast(${v.c/100})`); if(v.s!==100) o.push(`saturate(${v.s/100})`);
  if(v.g) o.push(`grayscale(${v.g/100})`); if(v.p) o.push(`sepia(${v.p/100})`); if(v.h) o.push(`hue-rotate(${v.h}deg)`); if(v.bl) o.push(`blur(${v.bl}px)`);
  return o.join(' ');
}
function valsFromFilter(st){
  const v={...FV0}; const re=/(brightness|contrast|saturate|grayscale|sepia|hue-rotate|blur)\(([-\d.]+)(deg|px|%)?\)/g; let m;
  while(m=re.exec(st||'')){ const k=Object.keys(FKEYS).find(x=>FKEYS[x]===m[1]); let n=parseFloat(m[2]); if(m[3]==='%') n=n; else if(k!=='h'&&k!=='bl') n=n*100; v[k]=Math.round(n*10)/10; }
  return v;
}

/* ── 小工具 ── */
const toHex=c=>{ c=String(c||'').trim(); if(/^#[0-9a-f]{6}$/i.test(c)) return c; if(/^#[0-9a-f]{3}$/i.test(c)) return '#'+c.slice(1).split('').map(x=>x+x).join('');
  const m=/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(c); return m?'#'+[m[1],m[2],m[3]].map(x=>(+x).toString(16).padStart(2,'0')).join(''):'#000000'; };
const rgbaA=(hex,a)=>{ const r=hexToRgb(hex)||[0,0,0]; return `rgba(${r.join(',')},${a})`; };
const firstColor=s=>{ const m=/(#[0-9a-f]{3,8}\b|rgba?\([^)]*\))/i.exec(s||''); return m?toHex(m[1]):'#000000'; };
const pxOf=(s,i)=>{ const all=[...String(s||'').matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(m=>+m[1]); return all.length?(i==null?Math.max(...all.map(Math.abs)):all[i]||0):0; };
/* 控制項：get/set 都直接讀寫 style */
const cProp=(label,el,prop)=>({label,el,type:'color',get:st=>toHex(st.getPropertyValue(prop)),set:(st,v)=>st.setProperty(prop,v)});
const pxProp=(label,el,props,min,max)=>({label,el,type:'px',min,max,get:st=>parseFloat(st.getPropertyValue(props[0]))||0,set:(st,v)=>props.forEach(p=>st.setProperty(p,v+'px'))});
const outline=(c,w)=>w>0?`drop-shadow(${w}px 0 0 ${c}) drop-shadow(-${w}px 0 0 ${c}) drop-shadow(0 ${w}px 0 ${c}) drop-shadow(0 -${w}px 0 ${c})`:'none';
const OUTLINE_CTL=[
 {label:'框線色',el:'frame',type:'color',get:st=>firstColor(st.filter),set:(st,v)=>{ st.filter=outline(v,pxOf(st.filter)||2); }},
 {label:'框線粗',el:'frame',type:'px',min:0,max:6,get:st=>pxOf(st.filter),set:(st,v)=>{ st.filter=outline(firstColor(st.filter),v); }}
];

/* ── 圖片樣式（外框）：外框固定，裡面的原圖可以移動、縮放 ── */
/* 結構：外框 .cd-photo  >  視窗（overflow:hidden，形狀）  >  原圖 img（object-position＋scale） */
const FRAME_STYLES=[
 {key:'plain',name:'無框',w:30,fw:100,ar:'auto'},
 {key:'rounded',name:'圓角柔影',w:30,fw:80,ar:'auto',frame:'border-radius:12px;box-shadow:0 10px 26px rgba(0,0,0,0.55);',win:'border-radius:12px;',
  ctl:[pxProp('圓角','win',['border-radius'],0,60)]},
 {key:'circle',name:'圓形外框',w:22,fw:34,ar:'1/1',win:'border-radius:50%;border:3px solid #f0b03c;box-shadow:0 0 18px rgba(240,176,60,0.35);',
  ctl:[cProp('框色','win','border-color'),pxProp('框寬','win',['border-width'],0,16)]},
 {key:'polaroid',name:'拍立得',w:26,fw:46,ar:'1/1',rot:-3,frame:'background-color:#f5f0e8;padding-top:8px;padding-left:8px;padding-right:8px;padding-bottom:26px;box-shadow:0 10px 24px rgba(0,0,0,0.5);',
  ctl:[cProp('相紙色','frame','background-color'),pxProp('邊寬','frame',['padding-top','padding-left','padding-right'],0,30),pxProp('下緣','frame',['padding-bottom'],0,80)]},
 {key:'frame',name:'相框',w:30,fw:60,ar:'4/3',frame:'background-color:#16100a;border:3px solid #b8943f;padding:8px;box-shadow:inset 0 0 12px rgba(0,0,0,0.6),0 0 20px rgba(240,176,60,0.15);',
  ctl:[cProp('框色','frame','border-color'),pxProp('框寬','frame',['border-width'],0,20),cProp('襯底色','frame','background-color'),pxProp('襯底寬','frame',['padding'],0,40)]},
 {key:'double',name:'雙線框',w:30,fw:60,ar:'auto',frame:'border:6px double #e8dcc4;padding:4px;',
  ctl:[cProp('框色','frame','border-color'),pxProp('框寬','frame',['border-width'],3,20),pxProp('間距','frame',['padding'],0,24)]},
 {key:'sticker',name:'白邊貼紙',w:24,fw:44,ar:'auto',rot:2,frame:'filter:drop-shadow(0 6px 10px rgba(0,0,0,0.45));',win:'border:4px solid #ffffff;border-radius:10px;',
  ctl:[cProp('邊色','win','border-color'),pxProp('邊寬','win',['border-width'],0,16),pxProp('圓角','win',['border-radius'],0,40)]},
 {key:'tape',name:'膠帶照片',w:28,fw:50,ar:'4/3',rot:-2,frame:'background-color:#fbf8f2;padding:6px;box-shadow:0 8px 20px rgba(0,0,0,0.4);',
  extra:`<div class='cd-x' style='position:absolute;top:-9px;left:8%;width:30%;height:18px;background-color:#f4d58a;opacity:0.85;transform:rotate(-8deg);'></div><div class='cd-x' style='position:absolute;bottom:-9px;right:8%;width:30%;height:18px;background-color:#f4d58a;opacity:0.85;transform:rotate(-8deg);'></div>`,
  ctl:[cProp('膠帶色','extra','background-color'),cProp('相紙色','frame','background-color'),pxProp('邊寬','frame',['padding'],0,24)]},
 {key:'film',name:'底片框',w:36,fw:80,ar:'16/10',frame:'background-color:#111111;padding:16px 6px;background-image:repeating-linear-gradient(90deg,#d8d2c4 0 6px,transparent 6px 14px),repeating-linear-gradient(90deg,#d8d2c4 0 6px,transparent 6px 14px);background-size:100% 6px,100% 6px;background-position:0 4px,0 calc(100% - 4px);background-repeat:repeat-x;',
  ctl:[cProp('底片色','frame','background-color')]},
 {key:'glow',name:'光暈',w:30,fw:60,ar:'auto',win:'border-radius:8px;box-shadow:0 0 22px 4px rgba(240,176,60,0.6);',
  ctl:[{label:'光色',el:'win',type:'color',get:st=>firstColor(st.boxShadow),set:(st,v)=>{ const n=pxOf(st.boxShadow)||22; st.boxShadow=`0 0 ${n}px ${Math.round(n/5)}px ${rgbaA(v,0.6)}`; }},
       {label:'光暈',el:'win',type:'px',min:0,max:60,get:st=>pxOf(st.boxShadow),set:(st,v)=>{ st.boxShadow=`0 0 ${v}px ${Math.round(v/5)}px ${rgbaA(firstColor(st.boxShadow),0.6)}`; }}]},
 {key:'slanted',name:'斜切',w:34,fw:100,ar:'16/9',shape:'slantB',slant:16},
 {key:'fade',name:'上下漸層',w:60,fw:100,ar:'auto',winRel:1,
  winExtra:`<div class='cd-x' style='position:absolute;top:0;left:0;width:100%;height:24%;background-image:linear-gradient(to bottom,#0a0a0d 0%,transparent 100%);'></div><div class='cd-x' style='position:absolute;bottom:0;left:0;width:100%;height:24%;background-image:linear-gradient(to top,#0a0a0d 0%,transparent 100%);'></div>`,
  ctl:[{label:'漸層色',el:'extra',type:'color',get:st=>firstColor(st.backgroundImage),set:(st,v)=>{ st.backgroundImage=`linear-gradient(${/to top/.test(st.backgroundImage)?'to top':'to bottom'},${v} 0%,transparent 100%)`; }},
       {label:'漸層高',el:'extra',type:'pct',min:0,max:50,get:st=>parseFloat(st.height)||0,set:(st,v)=>{ st.height=v+'%'; }}]},
 {key:'panel',name:'分鏡格',w:40,fw:70,ar:'4/3',merge:1,frame:'padding:2px;background:#111;',
  ctl:[cProp('框線色','frame','background-color'),pxProp('框線粗','frame',['padding'],0,10)]}
];
const fsOf=k=>FRAME_STYLES.find(s=>s.key===k)||FRAME_STYLES[0];
/* 產生一個圖片元件（畫布圖層版） */
function photoHTML(u,key,o){
  const s=fsOf(key); o=Object.assign({w:s.w,ar:s.ar,rot:s.rot||0,shape:s.shape||'none',slant:s.slant||14,fx:50,fy:50,zoom:100,fit:'cover',filter:''},o||{});
  const clipV=o.shape&&o.shape!=='none'?shapeCss(o.shape,o.slant):(o.clip||'');
  const clip=clipV?`clip-path:${clipV};`:'';
  const hasAr=o.ar&&o.ar!=='auto';
  const pos=o.box?`position:absolute;left:${o.box[0]}%;top:${o.box[1]}%;width:${o.box[2]}%;height:${o.box[3]}%;`:`position:absolute;width:${o.w}%;`;
  const rot=o.rot?`transform:rotate(${o.rot}deg);`:'';
  const full=o.box||hasAr;
  const ctr=o.fx===50&&o.fy===50;
  const pic=`display:block;width:100%;${full?'height:100%;':''}object-fit:${o.fit};${ctr?'':`object-position:${o.fx}% ${o.fy}%;`}${o.zoom!==100?`transform:scale(${o.zoom/100});${ctr?'':`transform-origin:${o.fx}% ${o.fy}%;`}`:''}${o.filter?`filter:${o.filter};`:''}`;
  const cls=`cd-photo cdp-${s.key}`;
  /* 外框＝視窗：只要一層 div（字數最少） */
  if(s.merge||(!s.frame&&!s.extra&&!s.winExtra)){
    const ar=(!o.box&&hasAr)?`aspect-ratio:${o.ar};`:'';
    const css=s.merge?`${pos}${ar}${s.frame||''}${clip||'overflow:hidden;'}${rot}`:`${pos}overflow:hidden;${ar}${s.win||''}${clip}${rot}`;
    const picX=(s.merge&&clipV)?'clip-path:inherit;':'';
    return `<div class='${cls}' style='${css}'>\n<img src='${u}' style='${pic}${picX}'>\n</div>`;
  }
  const win=`${s.winRel?'position:relative;':''}overflow:hidden;${o.box?'width:100%;height:100%;':(hasAr?`aspect-ratio:${o.ar};`:'')}${s.win||''}${clip}`;
  return `<div class='${cls}' style='${pos}${s.frame||''}${rot}'>\n<div style='${win}'>\n<img src='${u}' style='${pic}'>${s.winExtra?'\n'+s.winExtra:''}\n</div>${s.extra?'\n'+s.extra:''}\n</div>`;
}
/* 畫布外（一般區塊）時：改成置中、跟著版面流動 */
function photoToFlow(html){
  const t=document.createElement('template'); t.innerHTML=html.trim();
  const r=t.content.firstElementChild; if(!r||!r.classList.contains('cd-photo')||r.style.position!=='absolute') return html;
  const s=fsOf(([...r.classList].find(c=>c.startsWith('cdp-'))||'').slice(4));
  r.style.position=(s.extra?'relative':''); if(!s.extra) r.style.removeProperty('position');
  ['top','left','right','bottom'].forEach(p=>r.style.removeProperty(p));
  r.style.width=s.fw+'%'; r.style.margin='20px auto';
  return serializeDoc(t.content,null).trim();
}
{ const _is=insertSmart; insertSmart=function(html,opt){
  opt=opt||{};
  if(/class=['"]cd-photo/.test(html)){
    const sel=selNode();
    let cv=opt.canvas!==undefined?opt.canvas:(opt.forceFlow?null:(sel?containerCanvasOf(sel):null));
    if(cv==null&&opt.canvas===undefined&&!opt.forceFlow&&!sel) cv=lastCanvas();
    if(!cv) html=photoToFlow(html);
  }
  return _is(html,opt);
}; }
/* 圖片元件、漫畫分鏡本身不當成「最後一塊畫布」 */
{ const _lc=lastCanvas; lastCanvas=function(){
  const all=[...model.querySelectorAll('*')];
  for(let i=all.length-1;i>=0;i--){ const e=all[i]; if(isCanvasNode(e)&&!e.closest('.cd-photo,.cd-comic')) return e; }
  return null;
}; }

/* ── 漫畫分鏡 ── */
/* 還沒放圖的格子：src 直接寫「圖片網址1」這種字，一看就知道要填哪裡（預覽裡會顯示成灰色格子） */
const PH_WORD={zh:'圖片網址',en:'IMAGE_URL_',ko:'이미지URL',ja:'画像URL'};
const PH_RE=/^(圖片網址|IMAGE_URL_|이미지URL|画像URL)(\d*)$/;
const phName=i=>(PH_WORD[window.UI_LANG]||PH_WORD.zh)+i;
const panelLabel=i=>({zh:`第${i}格`,en:`Panel ${i}`,ko:`${i}번 칸`,ja:`コマ${i}`}[window.UI_LANG]||`第${i}格`);
function phSvg(t){ return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#8a8693"/><path d="M0 0L300 200M300 0L0 200" stroke="#9c98a5" stroke-width="3"/><text x="150" y="112" font-size="26" font-family="sans-serif" fill="#fff" text-anchor="middle">${t}</text></svg>`); }
function phPreview(html){ return html.replace(/(src=['"]|url\(["']?)((?:圖片網址|IMAGE_URL_|이미지URL|画像URL)\d*)/g,(m,a,w)=>a+phSvg(w)); }
const COMIC_LAYOUTS=[
 {key:'c2',name:'二格斜切',ar:'16/9',p:[[[0,0],[58,0],[42,100],[0,100]],[[58,0],[100,0],[100,100],[42,100]]]},
 {key:'c3',name:'上一下二',ar:'4/3',p:[[[0,0],[100,0],[100,48],[0,56]],[[0,56],[52,52],[44,100],[0,100]],[[52,52],[100,48],[100,100],[44,100]]]},
 {key:'c4',name:'四格',ar:'1/1',p:[[[0,0],[52,0],[48,50],[0,50]],[[52,0],[100,0],[100,50],[48,50]],[[0,50],[46,50],[50,100],[0,100]],[[46,50],[100,50],[100,100],[50,100]]]},
 {key:'cv',name:'直條三格',ar:'3/5',p:[[[0,0],[100,0],[100,30],[0,36]],[[0,36],[100,30],[100,66],[0,70]],[[0,70],[100,66],[100,100],[0,100]]]},
 {key:'cb',name:'一大兩小',ar:'16/10',p:[[[0,0],[64,0],[56,100],[0,100]],[[64,0],[100,0],[100,46],[60,52]],[[60,52],[100,46],[100,100],[56,100]]]},
 {key:'cx',name:'交叉斜切',ar:'4/3',p:[[[0,0],[100,0],[50,45]],[[0,0],[50,45],[38,100],[0,100]],[[100,0],[100,100],[62,100],[50,45]],[[50,45],[62,100],[38,100]]]},
 {key:'c212',name:'2－1－2（直線）',ar:'3/4',p:[[[0,0],[50,0],[50,33],[0,33]],[[50,0],[100,0],[100,33],[50,33]],[[0,33],[100,33],[100,67],[0,67]],[[0,67],[50,67],[50,100],[0,100]],[[50,67],[100,67],[100,100],[50,100]]]},
 {key:'c212s',name:'2－1－2（斜線）',ar:'3/4',p:[[[0,0],[56,0],[46,30],[0,30]],[[56,0],[100,0],[100,30],[46,30]],[[0,30],[100,30],[100,64],[0,70]],[[0,70],[44,67.4],[54,100],[0,100]],[[44,67.4],[100,64],[100,100],[54,100]]]}
];
/* g＝格線寬（佔整頁寬度的 %），r＝整頁 寬/高 */
const rd1=v=>+(+v).toFixed(1);
function panelClip(pts,g,r){
  const gx=g, gy=g*(r||1);
  const mx=pts.reduce((a,p)=>a+p[0],0)/pts.length, my=pts.reduce((a,p)=>a+p[1],0)/pts.length;
  const q=pts.map(([x,y])=>[x+(Math.abs(mx-x)<0.5?0:Math.sign(mx-x)*gx/2),y+(Math.abs(my-y)<0.5?0:Math.sign(my-y)*gy/2)]);
  const xs=q.map(p=>p[0]), ys=q.map(p=>p[1]);
  const bx=Math.min(...xs), by=Math.min(...ys), bw=Math.max(...xs)-bx||1, bh=Math.max(...ys)-by||1;
  const rect=q.length===4&&q.every(([x,y])=>(Math.abs(x-bx)<.05||Math.abs(x-bx-bw)<.05)&&(Math.abs(y-by)<.05||Math.abs(y-by-bh)<.05));
  const clip=rect?'':`polygon(${q.map(([x,y])=>`${rd1((x-bx)/bw*100)}% ${rd1((y-by)/bh*100)}%`).join(',').replace(/(^|,| )0%/g,'$10')})`;
  return {box:[rd1(bx),rd1(by),rd1(bw),rd1(bh)],clip};
}
const arRatio=ar=>{ const [w,h]=String(ar).split('/').map(Number); return (w&&h)?w/h:1; };
function comicHTML(L,u,g){
  g=g==null?1.6:g;
  const panels=L.p.map((pts,i)=>{ const c=panelClip(pts,g,arRatio(L.ar)); return photoHTML(i===0&&u?u:phName(i+1),'panel',{box:c.box,clip:c.clip,ar:'auto'}); });
  return `<div class='cd-comic cdc-${L.key}' style='position:relative;aspect-ratio:${L.ar};background:#fff;'>\n${panels.join('\n')}\n</div>`;
}
const SINGLE_PANELS=[
 {n:'方格',ar:'4/3'},{n:'直長格',ar:'3/4'},{n:'橫長格',ar:'16/7'},
 {n:'斜切格（左）',ar:'4/3',shape:'para',slant:14},{n:'斜切格（右）',ar:'4/3',clip:'polygon(0 0,86% 0,100% 100%,14% 100%)'},
 {n:'上斜格',ar:'4/3',shape:'slantT',slant:16},{n:'下斜格',ar:'4/3',shape:'slantB',slant:16},
 {n:'梯形格',ar:'4/3',shape:'trap',slant:12},{n:'箭形格',ar:'16/9',shape:'chevron',slant:10},
 {n:'圓格',ar:'1/1',shape:'circle'},{n:'爆炸格',ar:'1/1',shape:'burst'},{n:'三角格',ar:'1/1',shape:'tri'}
];
const BLANK_PAGE=`<div class='cd-comic cdc-blank' style='position:relative;aspect-ratio:3/4;background:#fff;'>\n</div>`;

/* ── 圖片頁：樣式卡片＋漫畫分鏡區 ── */
const curPhotoUrl=()=>curAssetUrl()||'';
IMG_FORMS.splice(0,IMG_FORMS.length,...FRAME_STYLES.filter(s=>s.key!=='panel').map(s=>({key:s.key,kind:'layer',name:s.name,tpl:u=>photoHTML(u,s.key)})));
IMG_FORMS.push({key:'fwide',kind:'flow',hidden:1,name:'',tpl:u=>photoHTML(u,imgForm==='fwide'?'plain':imgForm)});
if(!IMG_FORMS.find(f=>f.key===imgForm&&!f.hidden)) imgForm='plain';
applyImgSettings=h=>h;
buildFormGrid=function(){
  const g=$('#formGrid'); if(!g) return;
  const url=(curAssetUrl()||PH.port).replace(/'/g,'%27');
  g.replaceChildren(...IMG_FORMS.filter(f=>!f.hidden).map(f=>{
    const c=document.createElement('div'); c.className='fcard'+(f.key===imgForm?' selF':''); c.title=f.name+'：按住拖到預覽＝用這個樣式放圖（點一下＝設為預設樣式）';
    const pv2=document.createElement('div'); pv2.className='fprev';
    pv2.innerHTML=f.tpl(url);
    const root=pv2.firstElementChild; if(root){ root.style.top='10%'; root.style.left='50%'; root.style.width=(fsOf(f.key).ar==='1/1'?'46%':'62%'); root.style.transform=(root.style.transform||'')+' translateX(-50%)'; }
    const nm=document.createElement('div'); nm.className='fname'; nm.textContent=f.name;
    c.append(pv2,nm);
    c.addEventListener('click',()=>{ imgForm=f.key; buildFormGrid(); });
    c.addEventListener('pointerdown',ev=>{ const u=curAssetUrl(); if(!u) return; startHtmlDrag(ev,{label:f.name,img:u,html:()=>f.tpl(u)}); });
    return c;
  }));
};
/* 原本的「形式設定」區：改成說明 */
{ const fs=$('#formSettings'); if(fs){ fs.innerHTML='<div class="hint">插入之後點選圖片，到「屬性 → 🖼 圖片」調整外框、裡面的位置、縮放和濾鏡。</div>'; } }
/* 漫畫分鏡區 */
(function(){
  const wrap=$('#formWrap'); if(!wrap) return;
  const det=document.createElement('details'); det.className='acat lcat'; det.id='comicSect';
  det.innerHTML=`<summary>🎞 漫畫分鏡<span class="ac"></span></summary><div class="lbody">
    <div class="hint" style="margin:2px 0 8px">點＝插入 · 拖＝放到指定位置（拖到畫布上就是圖層）。每一格都能單獨換圖、調整裡面的位置和縮放。</div>
    <div class="sublab">整頁版型</div><div class="cmGrid" id="cmLayouts"></div>
    <div class="sublab">單格分鏡（自由組合）</div><div class="cmGrid" id="cmSingles"></div></div>`;
  det.style.marginTop='12px'; wrap.appendChild(det);
  try{ det.open=load('cdb3_comicopen')==='1'; }catch(e){}
  det.addEventListener('toggle',()=>{ store('cdb3_comicopen',det.open?'1':'0'); if(det.open) render(); });
  function card(name,html,w){
    const c=document.createElement('div'); c.className='cmCard'; c.title=name;
    const box=document.createElement('div'); box.className='cmPrev';
    const nm=document.createElement('div'); nm.className='fname'; nm.textContent=name;
    c.append(box,nm);
    c.addEventListener('click',()=>{ if(typeof suppressClick!=='undefined'&&Date.now()-suppressClick<400) return; insertSmart(html()); });
    c.addEventListener('pointerdown',ev=>startHtmlDrag(ev,{label:name,html:()=>html()}));
    requestAnimationFrame(()=>fitPreview(box,phPreview(photoToFlow(html())).replace("margin:20px auto","margin:0 auto"),w||400,100));
    return c;
  }
  function render(){
    const u=curPhotoUrl();
    $('#cmLayouts').replaceChildren(...COMIC_LAYOUTS.map(L=>card(L.name,()=>comicHTML(L,u),420)),
      card('空白分鏡頁',()=>BLANK_PAGE,420));
    $('#cmSingles').replaceChildren(...SINGLE_PANELS.map((P,i)=>card(P.n,()=>photoHTML(u||phName(1),'panel',{ar:P.ar,shape:P.shape||'none',slant:P.slant||14,clip:P.clip||null}),300)));
  }
  if(det.open) render();
  { const _ra=renderAssets; renderAssets=function(){ _ra(); if(det.open) render(); }; }
})();

/* ── 選到的圖片 → 屬性「🖼 圖片」 ── */
const compOf=n=>n&&n.closest?n.closest('.cd-photo'):null;
function picOf(fr){ return fr.querySelector('img')||[...fr.querySelectorAll('div')].find(d=>/background-image\s*:\s*url|background\s*:[^;]*url\(/i.test(d.getAttribute('style')||'')&&!d.classList.contains('cd-x'))||null; }
function partsOf(n){
  if(!n) return null;
  const fr=compOf(n);
  if(fr){ const pic=picOf(fr); if(!pic) return null; return {fr,win:pic.parentElement,pic,isImg:pic.tagName==='IMG'}; }
  if(n.tagName==='IMG'||rawBgUrl(n)){ const k=n.tagName==='IMG'?'img':imgKind(n); return {fr:null,win:n,pic:n,isImg:k==='img'||k==='content',kind:k}; }
  return null;
}
const cloneOfEl=el=>{ const i=modelEls.indexOf(el); return i>=0?uid2clone.get(i):null; };
const picUrl=p=>p.isImg?p.pic.getAttribute('src'):rawBgUrl(p.pic);
function readPic(p){
  const st=p.pic.style;
  const pos=(p.isImg?st.objectPosition:st.backgroundPosition)||'50% 50%';
  const m=/(-?[\d.]+)%\s+(-?[\d.]+)%/.exec(pos); const kw={left:0,center:50,right:100,top:0,bottom:100};
  let fx=50,fy=50; if(m){ fx=+m[1]; fy=+m[2]; } else { const w=pos.split(/\s+/); fx=kw[w[0]]??50; fy=kw[w[1]]??50; }
  const sc=/scale\(([\d.]+)\)/.exec(st.transform||''); const zoom=sc?Math.round(+sc[1]*100):100;
  const fit=p.isImg?(st.objectFit||'cover'):((st.backgroundSize||'cover')==='contain'?'contain':'cover');
  return {fx,fy,zoom,fit};
}
function writePic(st,isImg,v,kind){
  if(kind==='border'){ if(v.zoom!==100) st.transform=`scale(${v.zoom/100})`; else st.removeProperty('transform'); return; }
  const ctr=Math.round(v.fx)===50&&Math.round(v.fy)===50;   // 置中＝預設值，不用寫
  if(isImg){ st.objectFit=v.fit; if(ctr) st.removeProperty('object-position'); else st.objectPosition=`${v.fx}% ${v.fy}%`; }
  else { st.backgroundSize=v.fit; st.backgroundPosition=ctr?'center':`${v.fx}% ${v.fy}%`; }
  if(v.zoom!==100){ st.transform=`scale(${v.zoom/100})`; if(ctr) st.removeProperty('transform-origin'); else st.transformOrigin=`${v.fx}% ${v.fy}%`; }
  else { st.removeProperty('transform'); st.removeProperty('transform-origin'); }
}
const AR_LIST=[['auto','原圖比例'],['1/1','1:1'],['4/3','4:3'],['3/4','3:4'],['3/2','3:2'],['2/3','2:3'],['16/9','16:9'],['9/16','9:16'],['16/7','16:7 橫幅']];
const nz=x=>String(x||'').replace(/\s*,\s*/g,',').replace(/\s+/g,' ').replace(/\(\s+/g,'(').trim().replace(/(?<![\d.])0(?:px|%)/g,'0');
function curShape(st){ const cp=nz(st.clipPath); if(!cp||cp==='none') return ['none',14];
  for(const s of SHAPES){ if(!s.f) continue; if(s.s){ for(let k=2;k<=45;k++){ if(nz(s.f(k))===cp) return [s.k,k]; } } else if(nz(s.f())===cp) return [s.k,14]; }
  return ['custom',14]; }

(function(){
  const look=document.querySelector('details.ps[data-g="look"]'); if(!look) return;
  const old=$('#psImg'); if(old) old.remove();
  const det=document.createElement('details'); det.className='ps'; det.dataset.g='img'; det.id='psImg';
  det.innerHTML=`<summary><span class="si">🖼</span>圖片<span class="sv" id="svImg"></span></summary><div class="psb">
    <div id="piFrameBox">
      <div class="sublab">外框樣式</div>
      <div class="srow"><select class="tin" id="piStyle">${FRAME_STYLES.map(s=>`<option value="${s.key}">${s.name}</option>`).join('')}</select></div>
      <div id="piCtl"></div>
    </div>
    <div class="sublab">形狀</div>
    <div class="srow"><label>比例</label><select class="tin" id="piAr">${AR_LIST.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></div>
    <div class="srow"><label>裁切</label><select class="tin" id="piShape">${SHAPES.map(s=>`<option value="${s.k}">${s.n}</option>`).join('')}</select></div>
    <div class="srow" id="piSlantRow"><label>斜度</label><input type="range" id="piSlant" min="2" max="45" value="14"><span class="sval" id="piSlantV">14%</span></div>
    <div class="srow" id="piRadRow"><label>圓角</label><input type="range" id="piRad" min="0" max="80" value="0"><span class="sval" id="piRadV">0px</span></div>
    <div class="sublab">裡面的圖</div>
    <div class="seg" id="piFit"><button data-v="cover">填滿框</button><button data-v="contain">完整顯示</button></div>
    <div class="srow"><label>縮放</label><input type="range" id="piZoom" min="100" max="400" value="100"><span class="sval" id="piZoomV">100%</span></div>
    <div class="srow"><label>左右</label><input type="range" id="piFx" min="0" max="100" value="50"><span class="sval" id="piFxV">50%</span></div>
    <div class="srow"><label>上下</label><input type="range" id="piFy" min="0" max="100" value="50"><span class="sval" id="piFyV">50%</span></div>
    <button class="mbtn" id="piPan">✋ 在預覽裡拖曳調整（滾輪縮放）</button>
    <div class="sublab">濾鏡</div>
    <div class="chipRow" id="piPresets">${FILTER_PRESETS.map(x=>`<button class="chip" data-f="${x.k}">${x.n}</button>`).join('')}</div>
    ${[['b','亮度',30,170,1,'%'],['c','對比',30,200,1,'%'],['s','飽和',0,250,1,'%'],['g','灰階',0,100,1,'%'],['p','復古',0,100,1,'%'],['h','色相',-180,180,1,'°'],['bl','模糊',0,10,0.5,'px']].map(([k,n,a,b,st,u])=>`<div class="srow"><label>${n}</label><input type="range" class="piF" data-f="${k}" min="${a}" max="${b}" step="${st}" value="${FV0[k]}" data-u="${u}"><span class="sval">${FV0[k]}${u}</span></div>`).join('')}
  </div>`;
  look.parentNode.insertBefore(det,look);
  let P=null;   // 目前選到的圖片元件
  const live=(el,fn)=>{ const c=cloneOfEl(el); if(c) fn(c.style); };
  const commit=()=>{ const n=selNode(); if(n) writeback(n); };
  function fill(){
    const n=selNode(); P=partsOf(n); det.style.display=P?'':'none'; if(!P){ setPan(false); return; }
    // 選到元件裡面的東西時，網址欄也一起顯示
    if(P.fr){ $('#imgSrcRow').style.display=''; $('#imgSrcLab').textContent='圖片網址'; const u=picUrl(P)||''; $('#inImgSrc').value=u; $('#inImgSrc').title=u; }
    $('#piFrameBox').style.display=P.fr?'':'none';
    if(P.fr) $('#pbToCanvas').style.display='none';
    if(P.fr){
      const key=([...P.fr.classList].find(c=>c.startsWith('cdp-'))||'cdp-plain').slice(4); $('#piStyle').value=key;
      const s=fsOf(key); const box=$('#piCtl'); box.innerHTML='';
      (s.ctl||[]).forEach((c,i)=>{
        const els=c.el==='frame'?[P.fr]:c.el==='win'?[P.win]:[...P.fr.querySelectorAll('.cd-x')]; if(!els.length) return;
        const v=c.get(els[0].style); const row=document.createElement('div'); row.className='srow';
        if(c.type==='color'){ row.innerHTML=`<label>${c.label}</label><input type="color" value="${v}"><input class="tin isHex" value="${v}" spellcheck="false">`;
          const [ci,ti]=row.querySelectorAll('input');
          const go=(val,done)=>{ els.forEach(e=>live(e,st=>c.set(st,val))); if(done){ els.forEach(e=>c.set(e.style,val)); commit(); } };
          ci.addEventListener('input',()=>{ ti.value=ci.value; go(ci.value); }); ci.addEventListener('change',()=>go(ci.value,1));
          ti.addEventListener('change',()=>{ if(/^#[0-9a-f]{6}$/i.test(ti.value.trim())){ ci.value=ti.value.trim(); go(ci.value,1); } });
        }else{ const u=c.type==='pct'?'%':'px'; row.innerHTML=`<label>${c.label}</label><input type="range" min="${c.min}" max="${c.max}" value="${Math.round(v)}"><span class="sval">${Math.round(v)}${u}</span>`;
          const r=row.querySelector('input'), sv=row.querySelector('.sval');
          r.addEventListener('input',()=>{ sv.textContent=r.value+u; els.forEach(e=>live(e,st=>c.set(st,+r.value))); });
          r.addEventListener('change',()=>{ els.forEach(e=>c.set(e.style,+r.value)); commit(); });
        }
        box.appendChild(row);
      });
    }
    const wst=P.win.style;
    $('#piAr').value=(wst.aspectRatio||'auto').replace(/\s/g,'');
    if(!$('#piAr').value) $('#piAr').value='auto';
    $('#piAr').closest('.srow').style.display=(P.fr&&P.fr.style.height)?'none':'';
    const [sk,sl]=curShape(wst);
    const sel=$('#piShape'); if(sk==='custom'&&!sel.querySelector('[value=custom]')) sel.insertAdjacentHTML('beforeend','<option value="custom">（自訂）</option>');
    sel.value=sk; $('#piSlant').value=sl; $('#piSlantV').textContent=sl+'%';
    $('#piSlantRow').style.display=(SHAPES.find(s=>s.k===sk)||{}).s?'':'none';
    const rad=parseFloat(wst.borderRadius)||0; $('#piRad').value=rad; $('#piRadV').textContent=rad+'px';
    $('#piRadRow').style.display=sk==='none'?'':'none';
    const noFit=P.kind==='border'; $('#piFit').style.display=noFit?'none':''; ['#piFx','#piFy'].forEach(id=>$(id).closest('.srow').style.display=noFit?'none':'');
    const v=readPic(P);
    $$('#piFit button').forEach(b=>b.classList.toggle('on',b.dataset.v===v.fit));
    $('#piZoom').value=v.zoom; $('#piZoomV').textContent=v.zoom+'%';
    $('#piFx').value=v.fx; $('#piFxV').textContent=Math.round(v.fx)+'%'; $('#piFy').value=v.fy; $('#piFyV').textContent=Math.round(v.fy)+'%';
    const fv=valsFromFilter(P.pic.style.filter);
    $$('#psImg .piF').forEach(r=>{ r.value=fv[r.dataset.f]; r.nextElementSibling.textContent=fv[r.dataset.f]+r.dataset.u; });
    $('#svImg').textContent=[P.fr?fsOf(([...P.fr.classList].find(c=>c.startsWith('cdp-'))||'cdp-plain').slice(4)).name:'',sk!=='none'?(SHAPES.find(s=>s.k===sk)||{n:'（自訂）'}).n:''].filter(Boolean).join(' · ');
  }
  { const _pp=populateProps; populateProps=function(){ _pp(); try{ fill(); }catch(e){ console.error(e); } }; }
  { const _cs=clearSelection; clearSelection=function(){ setPan(false); return _cs.apply(this,arguments); }; }
  /* 網址欄：選到元件時改的是裡面的圖 */
  $('#inImgSrc').addEventListener('change',e=>{
    if(!P||!P.fr) return; e.stopImmediatePropagation();
    const v=e.target.value.trim(); if(!v) return;
    if(P.isImg) P.pic.setAttribute('src',v); else { const old=rawBgUrl(P.pic); if(old) P.pic.setAttribute('style',P.pic.getAttribute('style').split(old).join(v)); }
    commit(); toast('<b>圖片已更換</b>');
  },true);
  /* 換外框樣式（位置、大小、裡面的圖都保留） */
  $('#piStyle').addEventListener('change',()=>{
    if(!P||!P.fr) return;
    const key=$('#piStyle').value, s=fsOf(key), fr=P.fr, v=readPic(P);
    const [sk,sl]=curShape(P.win.style);
    const html=photoHTML(picUrl(P)||'',key,{ar:(P.win.style.aspectRatio||s.ar).replace(/\s/g,''),shape:sk==='custom'?'none':sk,slant:sl,clip:sk==='custom'?P.win.style.clipPath:null,
      fx:v.fx,fy:v.fy,zoom:v.zoom,fit:v.fit,filter:P.pic.style.filter||''});
    const t=parseFrag(html); const nf=t.firstElementChild;
    ['position','top','left','right','bottom','width','height','margin','z-index','transform'].forEach(p=>{ const val=fr.style.getPropertyValue(p); if(val) nf.style.setProperty(p,val); else if(p!=='transform') nf.style.removeProperty(p); });
    if(!fr.style.position){ nf.style.removeProperty('position'); }
    if(s.extra&&!nf.style.position) nf.style.position='relative';
    if(!P.isImg){ const np=nf.querySelector('img'); if(np){ const d=document.createElement('div'); d.setAttribute('style',P.pic.getAttribute('style')); np.replaceWith(d); } }
    fr.replaceWith(nf); writeback(nf); toast('<b>已換成</b>「'+s.name+'」');
  });
  /* 比例、裁切、圓角 */
  $('#piAr').addEventListener('change',()=>{ if(!P) return; const v=$('#piAr').value, w=P.win;
    if(v==='auto'){ w.style.removeProperty('aspect-ratio'); if(w===P.pic){ } else P.pic.style.removeProperty('height'); }
    else { w.style.aspectRatio=v; if(w!==P.pic) P.pic.style.height='100%'; else { P.pic.style.objectFit=P.pic.style.objectFit||'cover'; } }
    commit(); });
  function shapeVal(){ const sk=$('#piShape').value; return sk==='none'?'':sk==='custom'?P.win.style.clipPath:shapeCss(sk,+$('#piSlant').value); }
  $('#piShape').addEventListener('change',()=>{ if(!P) return; const v=shapeVal(); if(v) P.win.style.clipPath=v; else P.win.style.removeProperty('clip-path'); commit(); });
  $('#piSlant').addEventListener('input',e=>{ $('#piSlantV').textContent=e.target.value+'%'; if(P) live(P.win,st=>st.clipPath=shapeVal()); });
  $('#piSlant').addEventListener('change',()=>{ if(!P) return; P.win.style.clipPath=shapeVal(); commit(); });
  $('#piRad').addEventListener('input',e=>{ $('#piRadV').textContent=e.target.value+'px'; if(P) live(P.win,st=>st.borderRadius=e.target.value+'px'); });
  $('#piRad').addEventListener('change',e=>{ if(!P) return; if(+e.target.value) P.win.style.borderRadius=e.target.value+'px'; else P.win.style.removeProperty('border-radius'); commit(); });
  /* 裡面的圖：填滿／完整、縮放、位置 */
  const curV=()=>({fit:($('#piFit .on')||{dataset:{v:'cover'}}).dataset.v,zoom:+$('#piZoom').value,fx:+$('#piFx').value,fy:+$('#piFy').value});
  function picLive(){ if(!P) return; const v=curV(); live(P.pic,st=>writePic(st,P.isImg,v,P.kind)); }
  function picCommit(){ if(!P) return; writePic(P.pic.style,P.isImg,curV(),P.kind); if(P.fr&&P.isImg&&P.win!==P.pic&&P.win.style.aspectRatio&&!P.pic.style.height) P.pic.style.height='100%'; commit(); }
  $('#piFit').addEventListener('click',e=>{ const b=e.target.closest('[data-v]'); if(!b||!P) return; $$('#piFit button').forEach(x=>x.classList.toggle('on',x===b));
    if(b.dataset.v==='contain'&&P.fr&&!P.win.style.aspectRatio&&!(P.fr.style.height)){ toast('「原圖比例」本來就會完整顯示；先把比例改成固定的'); }
    picCommit(); });
  [['#piZoom','#piZoomV'],['#piFx','#piFxV'],['#piFy','#piFyV']].forEach(([a,b])=>{
    $(a).addEventListener('input',e=>{ $(b).textContent=e.target.value+'%'; picLive(); });
    $(a).addEventListener('change',picCommit);
  });
  /* 預覽裡拖曳平移、滾輪縮放 */
  let pan=false, drag=null;
  function setPan(on){ pan=!!on; $('#piPan').classList.toggle('on',pan); document.body.classList.toggle('panMode',pan); }
  $('#piPan').addEventListener('click',()=>setPan(!pan));
  const inPic=e=>{ if(!pan||!P) return false; const wc=cloneOfEl(P.win); return wc&&wc.contains(e.target); };
  pv.addEventListener('mousedown',e=>{
    if(!inPic(e)) return; e.preventDefault(); e.stopImmediatePropagation();
    const wc=cloneOfEl(P.win).getBoundingClientRect(); drag={sx:e.clientX,sy:e.clientY,v:curV(),w:wc.width||1,h:wc.height||1};
  },true);
  document.addEventListener('mousemove',e=>{ if(!drag) return;
    const k=100/ (drag.v.zoom/100);
    $('#piFx').value=Math.max(0,Math.min(100,drag.v.fx-(e.clientX-drag.sx)/drag.w*k)); $('#piFy').value=Math.max(0,Math.min(100,drag.v.fy-(e.clientY-drag.sy)/drag.h*k));
    $('#piFxV').textContent=Math.round($('#piFx').value)+'%'; $('#piFyV').textContent=Math.round($('#piFy').value)+'%'; picLive(); });
  document.addEventListener('mouseup',()=>{ if(!drag) return; drag=null; picCommit(); });
  pv.addEventListener('wheel',e=>{ if(!inPic(e)) return; e.preventDefault();
    const z=Math.max(100,Math.min(400,+$('#piZoom').value-(e.deltaY>0?10:-10))); $('#piZoom').value=z; $('#piZoomV').textContent=z+'%'; picLive();
    clearTimeout(window._pzT); window._pzT=setTimeout(picCommit,400); },{passive:false});
  /* 濾鏡：預設會把數值帶到滑桿上，再自己微調 */
  const fvals=()=>{ const v={}; $$('#psImg .piF').forEach(r=>v[r.dataset.f]=+r.value); return v; };
  $$('#psImg .piF').forEach(r=>{
    r.addEventListener('input',()=>{ r.nextElementSibling.textContent=r.value+r.dataset.u; if(P) live(P.pic,st=>st.filter=filterFromVals(fvals())); });
    r.addEventListener('change',()=>{ if(!P) return; const f=filterFromVals(fvals()); if(f) P.pic.style.filter=f; else P.pic.style.removeProperty('filter'); commit(); });
  });
  $('#piPresets').addEventListener('click',e=>{ const b=e.target.closest('[data-f]'); if(!b||!P) return;
    const pr=FILTER_PRESETS.find(x=>x.k===b.dataset.f); const v={...FV0,...pr.v};
    $$('#psImg .piF').forEach(r=>{ r.value=v[r.dataset.f]; r.nextElementSibling.textContent=v[r.dataset.f]+r.dataset.u; });
    const f=filterFromVals(v); if(f) P.pic.style.filter=f; else P.pic.style.removeProperty('filter'); commit(); });
})();

/* ── 選到漫畫分鏡（整頁）→ 屬性「🎞 分鏡」 ── */
(function(){
  const look=document.querySelector('details.ps[data-g="look"]'); if(!look) return;
  const det=document.createElement('details'); det.className='ps'; det.dataset.g='comic'; det.id='psComic'; det.open=true;
  det.innerHTML=`<summary><span class="si">🎞</span>漫畫分鏡</summary><div class="psb">
    <div class="srow"><label>格線色</label><input type="color" id="pcG"><input class="tin isHex" id="pcGt" spellcheck="false"></div>
    <div class="srow" id="pcGwRow"><label>格線寬</label><input type="range" id="pcGw" min="0" max="6" step="0.2" value="1.6"><span class="sval" id="pcGwV">1.6%</span></div>
    <div class="srow"><label>框線色</label><input type="color" id="pcL"><input class="tin isHex" id="pcLt" spellcheck="false"></div>
    <div class="srow"><label>框線粗</label><input type="range" id="pcLw" min="0" max="6" value="2"><span class="sval" id="pcLwV">2px</span></div>
    <div class="hint">每一格都是圖層：可以拖曳、縮放；點一格可以換圖、調整裡面的位置。</div></div>`;
  look.parentNode.insertBefore(det,look);
  let C=null;
  const panels=()=>[...C.children].filter(x=>x.classList&&x.classList.contains('cd-photo'));
  const layoutOf=()=>COMIC_LAYOUTS.find(L=>C.classList.contains('cdc-'+L.key));
  function fill(){
    const n=selNode(); C=n&&n.closest?n.closest('.cd-comic'):null;
    if(C&&n!==C&&compOf(n)) C=null;                // 選到裡面的某一格 → 用「🖼 圖片」
    det.style.display=C?'':'none'; if(!C) return;
    const g=toHex(C.style.backgroundColor||'#ffffff'); $('#pcG').value=g; $('#pcGt').value=g;
    const p0=panels()[0]; const lc=p0?toHex(p0.style.backgroundColor||'#111111'):'#111111', lw=p0?(parseFloat(p0.style.padding)||0):2;
    $('#pcL').value=lc; $('#pcLt').value=lc; $('#pcLw').value=lw; $('#pcLwV').textContent=lw+'px';
    $('#pcGwRow').style.display=layoutOf()?'':'none';

  }
  { const _pp=populateProps; populateProps=function(){ _pp(); try{ fill(); }catch(e){ console.error(e); } }; }
  const commit=()=>writeback(C);
  const setG=v=>{ C.style.backgroundColor=v; commit(); };
  $('#pcG').addEventListener('input',e=>{ $('#pcGt').value=e.target.value; const c=cloneOfEl(C); if(c) c.style.backgroundColor=e.target.value; });
  $('#pcG').addEventListener('change',e=>setG(e.target.value));
  $('#pcGt').addEventListener('change',e=>{ if(/^#[0-9a-f]{6}$/i.test(e.target.value.trim())) setG(e.target.value.trim()); });
  const setL=()=>{ const c=$('#pcL').value, w=+$('#pcLw').value; panels().forEach(p=>{ p.style.background=c; p.style.padding=w+'px'; }); commit(); };
  $('#pcL').addEventListener('input',e=>$('#pcLt').value=e.target.value); $('#pcL').addEventListener('change',setL);
  $('#pcLt').addEventListener('change',e=>{ if(/^#[0-9a-f]{6}$/i.test(e.target.value.trim())){ $('#pcL').value=e.target.value.trim(); setL(); } });
  $('#pcLw').addEventListener('input',e=>$('#pcLwV').textContent=e.target.value+'px'); $('#pcLw').addEventListener('change',setL);
  $('#pcGw').addEventListener('input',e=>$('#pcGwV').textContent=e.target.value+'%');
  $('#pcGw').addEventListener('change',e=>{ const L=layoutOf(); if(!L) return; const g=+e.target.value;
    panels().forEach((p,i)=>{ if(!L.p[i]) return; const c=panelClip(L.p[i],g,arRatio(L.ar));
      ['left','top','width','height'].forEach((k,j)=>p.style[k]=c.box[j]+'%');
      if(c.clip) p.style.clipPath=c.clip; else p.style.removeProperty('clip-path'); }); commit(); });
})();

/* 選取標籤 */
{ const _lf=labelFor; labelFor=function(el){
  if(el&&el.tagName==='IMG'){ const m=PH_RE.exec((el.getAttribute('src')||'').trim()); if(m) return (m[2]?panelLabel(m[2]):'')+'（還沒放圖）'; }
  if(el&&el.tagName==='IMG'&&isDemoImg(el.getAttribute('src'))) return '示範圖（記得換掉）';
  if(el&&el.classList&&el.classList.contains('cd-photo')) return '圖片：'+fsOf(([...el.classList].find(c=>c.startsWith('cdp-'))||'cdp-plain').slice(4)).name;
  if(el&&el.classList&&el.classList.contains('cd-comic')) return '漫畫分鏡';
  return _lf(el); }; }

/* 聊天室：object-position 也要換成 background-position */
adaptForMode=function(html){
  if(mode!=='chat'||!/<img\b/i.test(html)) return html;
  const t=document.createElement('template'); t.innerHTML=html;
  t.content.querySelectorAll('img').forEach(im=>{
    const u=im.getAttribute('src')||''; const d=document.createElement('div');
    const st=im.getAttribute('style'); if(st) d.setAttribute('style',st);
    const fit=d.style.objectFit, pos=d.style.objectPosition; d.style.removeProperty('object-fit'); d.style.removeProperty('object-position');
    if(d.style.height==='auto') d.style.removeProperty('height');
    if(!d.style.height&&!d.style.aspectRatio){ const r=imgRatio.get(u); d.style.aspectRatio=r?String(Math.round(r*1000)/1000):'1'; }
    if(d.style.display==='block') d.style.removeProperty('display');
    const q=/[\s()'"]/.test(u)?`"${u}"`:u, sz=fit==='contain'?'contain':(fit==='fill'?'100% 100%':'cover');
    d.setAttribute('style',(d.getAttribute('style')||'').replace(/;?\s*$/,';')+`background:url(${q}) ${pos||'center'}/${sz} no-repeat;`);
    im.replaceWith(d);
  });
  return serializeDoc(t.content,null);
};
/* 預覽裡：還沒放圖的格子顯示成灰色格子＋編號（code 不變） */
{ const _pr=parseAndRender; parseAndRender=function(k){ const r=_pr(k);
  pv.querySelectorAll('img').forEach(im=>{ const v=(im.getAttribute('src')||'').trim(); if(PH_RE.test(v)) im.src=phSvg(v); });
  pv.querySelectorAll('[style*="url("]').forEach(d=>{ const m=/url\((["']?)([^"')]+)\1\)/.exec(d.getAttribute('style')||''); if(m&&PH_RE.test(m[2].trim())) d.style.backgroundImage=`url("${phSvg(m[2].trim())}")`; });
  return r; }; }
/* 原本的 bgUrlOf 也要認得 image-set 寫法（屬性面板的網址欄、換圖都會用到） */
bgUrlOf=function(n){ const u=rawBgUrl(n); return (u&&!/^data:image\/svg/i.test(u))?u:null; };
buildFormGrid();

/* ═══════════ 32. v4.1：調整數值時，code 裡只亮「改到的那一段」＋正在拖的滑桿發光 ═══════════ */
(function(){
  const wrap=$('#codewrap'); if(!wrap) return;
  const layer=document.createElement('div'); layer.id='codeMarks'; wrap.appendChild(layer);
  const mirror=document.createElement('div'); mirror.id='codeMirror'; document.body.appendChild(mirror);
  let hideT=null;
  function rectsOf(start,end){
    const cs=getComputedStyle(codeEl);
    ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','tabSize','paddingTop','paddingRight','paddingBottom','paddingLeft','whiteSpace','wordBreak','overflowWrap','wordWrap','textIndent','boxSizing','borderTopWidth','borderLeftWidth','borderRightWidth'].forEach(k=>mirror.style[k]=cs[k]);
    mirror.style.width=codeEl.clientWidth+'px';
    const v=codeEl.value;
    mirror.textContent=v.slice(0,start);
    const sp=document.createElement('span'); sp.textContent=v.slice(start,end)||' '; mirror.appendChild(sp);
    mirror.appendChild(document.createTextNode(v.slice(end,end+200)));
    const mr=mirror.getBoundingClientRect();
    return [...sp.getClientRects()].map(r=>({x:r.left-mr.left,y:r.top-mr.top,w:r.width,h:r.height}));
  }
  window.markCode=function(start,end){
    if($('#stage').classList.contains('codeClosed')||end<=start) return;
    requestAnimationFrame(()=>{
      const rs=rectsOf(start,end); if(!rs.length) return;
      // 捲到看得到的位置
      const top=rs[0].y, bot=rs[rs.length-1].y+rs[rs.length-1].h;
      if(top<codeEl.scrollTop+4||bot>codeEl.scrollTop+codeEl.clientHeight-4) codeEl.scrollTop=Math.max(0,top-codeEl.clientHeight*0.35);
      const lx=rs[0].x; if(lx<codeEl.scrollLeft+4||lx+Math.min(rs[0].w,200)>codeEl.scrollLeft+codeEl.clientWidth-4) codeEl.scrollLeft=Math.max(0,lx-codeEl.clientWidth*0.3);
      last=rs; const ox=codeEl.offsetLeft-codeEl.scrollLeft, oy=codeEl.offsetTop-codeEl.scrollTop;
      layer.replaceChildren(...rs.map(r=>{ const d=document.createElement('i'); d.style.cssText=`left:${ox+r.x-2}px;top:${oy+r.y}px;width:${r.w+4}px;height:${r.h}px`; return d; }));
      layer.classList.add('on');
      clearTimeout(hideT); hideT=setTimeout(()=>layer.classList.remove('on'),1800);
    });
  };
  let last=null;
  codeEl.addEventListener('scroll',()=>{ if(!last) return; const ox=codeEl.offsetLeft-codeEl.scrollLeft, oy=codeEl.offsetTop-codeEl.scrollTop; [...layer.children].forEach((d,i)=>{ const r=last[i]; if(r){ d.style.left=(ox+r.x-2)+'px'; d.style.top=(oy+r.y)+'px'; } }); },{passive:true});
  function tidyStyles(root){
    const hx=n=>(+n).toString(16).padStart(2,'0');
    root.querySelectorAll('[style]').forEach(e=>{
      const s0=e.getAttribute('style')||'';
      if(!/[:;,]\s|rgb\(|image-set\(\s*url\(|:\s*initial|\s\/\s|center center/.test(s0)) return;
      let s=s0;
      // image-set(url("x") 1x) → image-set('x' 1x)（瀏覽器改寫後會多出 url(，換回原本的寫法）
      s=s.replace(/image-set\(\s*url\((["']?)([^"')]+)\1\)/g,(m,q,u)=>`image-set('${u}'`);
      // 被展開的 border-image／border 收回來
      s=s.replace(/border-image-(?:width|outset|repeat)\s*:\s*initial\s*;?\s*/g,'');
      const bw=/(^|;)\s*border-width\s*:\s*([^;\s]+)\s*;/.exec(s), bs=/(^|;)\s*border-style\s*:\s*([^;\s]+)\s*;/.exec(s), bc=/(^|;)\s*border-color\s*:\s*([^;]+?)\s*;/.exec(s);
      if(bw&&bs&&bc&&!/\s/.test(bc[2].replace(/\([^)]*\)/g,''))){
        s=s.replace(bw[0],bw[1]+`border:${bw[2]} ${bs[2]} ${bc[2]};`).replace(bs[0],bs[1]).replace(bc[0],bc[1]);
      }
      s=s.replace(/(background-position|object-position)\s*:\s*center center/g,'$1:center');
      s=s.replace(/aspect-ratio\s*:\s*([\d.]+)\s*\/\s*1(?![\d.])/g,'aspect-ratio:$1').replace(/aspect-ratio\s*:\s*([\d.]+)\s*\/\s*([\d.]+)/g,'aspect-ratio:$1/$2');
      s=s.replace(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/g,(m,r,g,b)=>'#'+hx(r)+hx(g)+hx(b));
      s=s.replace(/:\s+/g,':').replace(/;\s+/g,';').replace(/,\s+/g,',').replace(/;;+/g,';').replace(/^;/,'').trim();
      if(s!==s0) e.setAttribute('style',s);
    });
  }

  /* 回寫 code 時比對前後，只標出改到的那一段（延伸到整個「屬性:值;」） */
  const _wb=writeback;
  writeback=function(){
    const before=codeEl.value;
    tidyStyles(model);      // 改過的 style 也維持「屬性:值;」的緊湊寫法
    window._wbLocal=true;
    let r; try{ r=_wb.apply(this,arguments); } finally{ window._wbLocal=false; }
    const after=codeEl.value;
    if(before!==after){
      let p=0; const n=Math.min(before.length,after.length);
      while(p<n&&before[p]===after[p]) p++;
      let a=before.length-1, b=after.length-1;
      while(a>=p&&b>=p&&before[a]===after[b]){ a--; b--; }
      let s=p, e=b+1;
      if(e-s<300){
        while(s>0&&!/[;'"\s<>]/.test(after[s-1])) s--;
        while(s>0&&after[s-1]===' ') s--;
        while(e<after.length&&after[e-1]!==';'&&!/['"<>]/.test(after[e])) e++;
      }
      if(e<=s) e=Math.min(after.length,s+1);
      markCode(s,e);
    }
    return r;
  };
  /* 局部標示時，不要再整行閃 */
  { const _fl=flashCodeLine; flashCodeLine=function(a,b){ if(window._wbLocal) return; return _fl(a,b); }; }
  /* 正在拖的滑桿：那一列發光 */
  document.addEventListener('pointerdown',e=>{ const r=e.target.closest&&e.target.closest('#side input[type=range]'); if(!r) return; const row=r.closest('.srow')||r.parentElement; row.classList.add('adj');
    const up=()=>{ row.classList.remove('adj'); document.removeEventListener('pointerup',up); document.removeEventListener('pointercancel',up); };
    document.addEventListener('pointerup',up); document.addEventListener('pointercancel',up); },true);
})();
