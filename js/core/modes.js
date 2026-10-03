'use strict';
/* ═══════════ 23. 三合一：模式切換（各頁面各自一份 code／復原／存檔）═══════════ */
const CHAT_STARTER = `<div style='box-sizing:border-box;width:100%;max-width:720px;margin:0 auto;background:#0a0a0d;border:1px solid rgba(143,180,224,0.35);border-radius:10px;color:#d8d2c4;font-family:serif;line-height:1.8;overflow:hidden;'>
<div style='padding:14px 20px;border-bottom:1px solid rgba(143,180,224,0.25);display:flex;justify-content:space-between;align-items:center;font-family:sans-serif;'>
<span style='color:#8fb4e0;letter-spacing:4px;font-weight:700;'>霧港・夜間廣播</span>
<span style='font-size:12px;color:#6b6675;'>23:47</span>
</div>
<div style='position:relative;width:100%;aspect-ratio:720/260;background:radial-gradient(circle at 72% 30%,rgba(143,180,224,0.28),transparent 60%),linear-gradient(160deg,#10141c,#0a0a0d);overflow:hidden;'>
<div style='position:absolute;top:18%;left:7%;width:56%;font-size:clamp(12px,2.56vw,20px);color:#e8f0fa;letter-spacing:3px;'>這是聊天室頁面的畫布</div>
<div style='position:absolute;top:44%;left:7%;width:60%;font-size:clamp(9px,1.79vw,14px);color:#8fa0b8;font-family:sans-serif;line-height:1.9;'>聊天室不能用 img：從左邊「圖片」拖進來的圖，會自動變成背景圖 div。</div>
</div>
<details style='padding:12px 20px;font-family:sans-serif;font-size:14px;'>
<summary style='cursor:pointer;color:#8fb4e0;'>點開看更多（details 只有聊天室／小工具能用）</summary>
<div style='margin-top:8px;color:#97919f;'>{{char}} 壓低聲音對 {{user}} 說：今晚的月亮不太對勁。</div>
</details>
</div>`;
const WIDGET_STARTER = `<div style='background:linear-gradient(135deg,#14120e,#0a0a0d);border:1px solid rgba(121,189,142,0.4);border-radius:10px;padding:12px 14px;color:#d8d2c4;font-family:sans-serif;font-size:13px;'>
<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'>
<span style='color:#79bd8e;font-weight:700;letter-spacing:3px;'>{{char}}</span>
<span style='font-size:11px;color:#97919f;'>📍 {{PLACE}}・{{TIME}}</span>
</div>
<div style='display:flex;align-items:center;gap:8px;margin-bottom:6px;'>
<span style='flex:0 0 36px;color:#97919f;font-size:11px;'>HP</span>
<div style='flex:1;height:8px;background:#26242f;border-radius:4px;overflow:hidden;'><div style='width:{{HP}}%;height:100%;background:linear-gradient(90deg,#2ea877,#9ed8c0);'></div></div>
<span style='flex:0 0 32px;text-align:right;font-size:11px;color:#9ed8c0;'>{{HP}}</span>
</div>
<div style='display:flex;align-items:center;gap:8px;'>
<span style='flex:0 0 36px;color:#97919f;font-size:11px;'>心情</span>
<span style='color:#f0b03c;'>{{MOOD}}</span>
</div>
</div>`;
const STARTERS = { info:STARTER, chat:CHAT_STARTER, widget:WIDGET_STARTER };
/* 範例 code 跟著介面語言 */
const STARTER_VARIANTS={};
(function(){
  let L=null; try{ L=new URLSearchParams(location.search).get('lang'); }catch(e){}
  if(!['zh','en','ko','ja'].includes(L)) L=load('cd-lang');
  const TR={
   zh:[['左欄「部件」新增元素','左邊「新增」加入元素']],
   en:[['CaveDuck 排版室','CaveDuck Layout Studio'],['左欄「部件」新增元素 · 雙擊任何文字直接編輯','Add elements from "Add" on the left · double-click any text to edit it'],['這塊是「畫布區塊」','This is a "canvas block"'],['裡面的東西都是圖層：單擊選取後，拖外框移動、拖角落縮放、抓上方圓點旋轉。雙擊我可以直接改字，反白幾個字還能單獨調大小、顏色。','Everything inside is a layer: click to select, drag the frame to move, drag a corner to resize, grab the top dot to rotate. Double-click me to edit the text, and highlight a few words to change their size or color.'],['流 式 區 塊','F L O W  B L O C K'],['一般區塊由上往下堆疊；選取後拖下緣控制點可以調高度','Normal blocks stack top to bottom; select one and drag the bottom handle to change its height'],['霧港・夜間廣播','Fog Harbor · Night Radio'],['這是聊天室頁面的畫布','This is a canvas for the chat page'],['聊天室不能用 img：從左邊「圖片」拖進來的圖，會自動變成背景圖 div。','Chat can\'t use img: images dragged in from "Images" on the left become background-image divs automatically.'],['點開看更多（details 只有聊天室／小工具能用）','Click to see more (details only works in chat / widgets)'],['{{char}} 壓低聲音對 {{user}} 說：今晚的月亮不太對勁。','{{char}} lowers their voice and tells {{user}}: "Something is off about the moon tonight."'],['心情','Mood']],
   ko:[['CaveDuck 排版室','CaveDuck 레이아웃 스튜디오'],['左欄「部件」新增元素 · 雙擊任何文字直接編輯','왼쪽 「추가」에서 요소 추가 · 글자를 더블클릭하면 바로 수정'],['這塊是「畫布區塊」','여기는 「캔버스 블록」'],['裡面的東西都是圖層：單擊選取後，拖外框移動、拖角落縮放、抓上方圓點旋轉。雙擊我可以直接改字，反白幾個字還能單獨調大小、顏色。','안에 있는 건 모두 레이어예요: 클릭해서 선택하고, 테두리를 끌어 이동, 모서리로 크기 조절, 위쪽 점으로 회전. 더블클릭하면 글자를 바로 고칠 수 있고, 몇 글자만 드래그해 크기나 색을 따로 바꿀 수도 있어요.'],['流 式 區 塊','일 반 블 록'],['一般區塊由上往下堆疊；選取後拖下緣控制點可以調高度','일반 블록은 위에서 아래로 쌓여요. 선택 후 아래쪽 핸들을 끌면 높이를 바꿀 수 있어요'],['霧港・夜間廣播','안개 항구・심야 방송'],['這是聊天室頁面的畫布','채팅방 페이지의 캔버스예요'],['聊天室不能用 img：從左邊「圖片」拖進來的圖，會自動變成背景圖 div。','채팅방은 img를 못 써요: 왼쪽 「이미지」에서 끌어온 그림은 자동으로 배경 이미지 div가 돼요.'],['點開看更多（details 只有聊天室／小工具能用）','눌러서 더 보기 (details는 채팅방/위젯에서만 가능)'],['{{char}} 壓低聲音對 {{user}} 說：今晚的月亮不太對勁。','{{char}} 이(가) 목소리를 낮춰 {{user}} 에게 말한다: "오늘 밤 달이 좀 이상해."'],['心情','기분']],
   ja:[['CaveDuck 排版室','CaveDuck レイアウト工房'],['左欄「部件」新增元素 · 雙擊任何文字直接編輯','左の「追加」から要素を追加 · 文字をダブルクリックで直接編集'],['這塊是「畫布區塊」','ここは「キャンバスブロック」'],['裡面的東西都是圖層：單擊選取後，拖外框移動、拖角落縮放、抓上方圓點旋轉。雙擊我可以直接改字，反白幾個字還能單獨調大小、顏色。','中のものはすべてレイヤーです：クリックで選択し、枠をドラッグで移動、角で拡大縮小、上の丸で回転。ダブルクリックで文字を直接編集でき、一部を選択すればサイズや色を個別に変えられます。'],['流 式 區 塊','通 常 ブ ロ ッ ク'],['一般區塊由上往下堆疊；選取後拖下緣控制點可以調高度','通常ブロックは上から順に積み重なります。選択して下端のハンドルをドラッグすると高さを変えられます'],['霧港・夜間廣播','霧の港・深夜放送'],['這是聊天室頁面的畫布','これはチャットページのキャンバスです'],['聊天室不能用 img：從左邊「圖片」拖進來的圖，會自動變成背景圖 div。','チャットでは img が使えません：左の「画像」からドラッグした画像は自動で背景画像 div になります。'],['點開看更多（details 只有聊天室／小工具能用）','開いて続きを見る（details はチャット／ウィジェットのみ）'],['{{char}} 壓低聲音對 {{user}} 說：今晚的月亮不太對勁。','{{char}} は声をひそめて {{user}} に言った：「今夜の月、なんだか様子がおかしい」'],['心情','気分']]
  };
  const fix=(s,l)=>{ (TR[l]||TR.zh).forEach(([a,b])=>{ s=s.split(a).join(b); }); return s; };
  ['info','chat','widget'].forEach(m=>{
    const base=STARTERS[m];
    STARTER_VARIANTS[m]=new Set([base,...Object.keys(TR).map(l=>fix(base,l))]);   // 任何語言、沒改過的範例
    STARTERS[m]=fix(base,L);
  });
})();
const MODE_LIST = ['info','chat','widget'];
function codeKey(m){ return 'cdb3_code_'+m; }
function saveKey(){ return mode==='info'?'cdb_htmlsaves':('cdb_htmlsaves_'+mode); }
const docs = {};
MODE_LIST.forEach(m=>{
  let c=load(codeKey(m));
  if(c==null) c=(m==='info')?(load('cdb_code')??STARTERS.info):STARTERS[m];
  if(STARTER_VARIANTS[m]&&STARTER_VARIANTS[m].has(c)) c=STARTERS[m];   // 沒動過的範例 → 換成目前語言
  docs[m]={code:c,undo:[],redo:[],scroll:0};
});

/* —— 小工具 style 過濾 —— */
const NAME_KEYS={char:1,'캐릭터':1,user:1,'사용자':1};
function widgetCss(css){
  return css.replace(/url\s*\([^)]*\)/gi,'').replace(/expression\s*\([^)]*\)/gi,'').replace(/-moz-binding\s*:[^;]*/gi,'').replace(/@import\b[^;]*/gi,'');
}
/* 預覽後處理：小工具的 style 過濾已經在平台流程（platform.js）裡做了，這裡保留空殼給其他程式掛 */
function postProcessClone(root){}
/* 含 {{…}} 的 style 宣告，瀏覽器不認得、改屬性時會被吃掉 → 記下來，寫回時補上 */
let tplDecls=new WeakMap();
function rememberTplDecls(){
  tplDecls=new WeakMap();
  modelEls.forEach(el=>{ const s=el.getAttribute('style'); if(s&&s.indexOf('{{')>=0){ const d=splitDecls(s).filter(x=>x.indexOf('{{')>=0); if(d.length) tplDecls.set(el,d); } });
}
function restoreTplDecls(){
  modelEls.forEach(el=>{
    const d=tplDecls.get(el); if(!d) return;
    const cur=el.getAttribute('style')||'';
    const miss=d.filter(x=>cur.indexOf(x)<0); if(!miss.length) return;
    const base=cur.trim().replace(/;\s*$/,'');
    el.setAttribute('style',(base?base+';':'')+miss.join(';')+';');
  });
}

/* —— 模式專屬檢查 —— */
function modeChecks(src){
  const W=[];
  if(mode==='widget'){
    if(/url\s*\(/i.test(src)) W.push({lv:'err',msg:'style 裡的 <code>url()</code> 在小工具會被<b>刪除</b>（背景圖、花紋、遮罩都不會顯示；漸層可以）'});
    if(/<details[^>]*\bopen\b/i.test(src)) W.push({lv:'warn',msg:'<code>open</code> 屬性會被刪，<code>&lt;details&gt;</code> 在小工具一定是收合的'});
  }
  if(mode==='chat'){
    if(/<img\b/i.test(src)) W.push({lv:'err',msg:'聊天室會刪掉 <code>&lt;img&gt;</code>——改用 <code>background:url()</code> 的 div（左邊「圖片」拖進來會自動轉換）'});
    if(/<a\b/i.test(src)) W.push({lv:'warn',msg:'聊天室會刪掉 <code>&lt;a&gt;</code> 連結（文字留下）'});
  }
  return W;
}
function widgetKeys(src){
  const s=new Set(); let m; const re=/\{\{\s*([^{}]+?)\s*\}\}/g;
  while(m=re.exec(src)){ const k=m[1].trim(); if(!NAME_KEYS[k]) s.add(k); }
  return [...s];
}

/* —— 聊天室：img 自動改寫成背景圖 div —— */
const imgRatio=new Map();
function noteRatio(u,im){ if(im.naturalWidth&&im.naturalHeight) imgRatio.set(u,im.naturalWidth/im.naturalHeight); }
function adaptForMode(html){
  if(mode!=='chat'||!/<img\b/i.test(html)) return html;
  const t=document.createElement('template'); t.innerHTML=html;
  t.content.querySelectorAll('img').forEach(im=>{
    const u=im.getAttribute('src')||''; const d=document.createElement('div');
    const st=im.getAttribute('style'); if(st) d.setAttribute('style',st);
    const fit=d.style.objectFit; d.style.removeProperty('object-fit');
    if(d.style.height==='auto') d.style.removeProperty('height');
    if(!d.style.height&&!d.style.aspectRatio){ const r=imgRatio.get(u); d.style.aspectRatio=r?String(Math.round(r*1000)/1000):'1'; }
    d.style.backgroundImage=`url("${u}")`;
    d.style.backgroundSize=fit==='contain'?'contain':'cover';
    d.style.backgroundPosition='center'; d.style.backgroundRepeat='no-repeat';
    im.replaceWith(d);
  });
  return serializeDoc(t.content,null);
}
function bgUrlOf(n){ const m=/url\((['"]?)([^'")]+)\1\)/.exec(n.getAttribute('style')||''); return (m&&!/^data:image\/svg/i.test(m[2]))?m[2]:null; }

/* 頁面中的圖片：img＋背景圖 */
renderUsedImages=function(){
  const box=$('#imgUsed'); const uidOf=new Map(modelEls.map((el,i)=>[el,i]));
  const items=[];
  modelEls.forEach(el=>{ const u=el.tagName==='IMG'?el.getAttribute('src'):bgUrlOf(el); if(u) items.push([el,u]); });
  box.replaceChildren(...items.slice(0,60).map(([el,u])=>{
    const b=document.createElement('button'); b.className='uimg'; b.title=u;
    const t=document.createElement('img'); t.src=u; t.loading='lazy'; b.appendChild(t);
    b.addEventListener('click',()=>applySelection(uidOf.get(el)));
    return b;
  }));
  if(!items.length) box.innerHTML='<div class="hint" style="grid-column:1/-1">頁面中還沒有圖片</div>';
};

/* —— 切換模式 —— */
const MODE_HINT={
  info:'單擊選取 · 拖外框移動 · 雙擊改字 · 從左邊把部件／圖片拖進來',
  chat:'聊天室：幾乎所有標籤都能用，但 a、img、style 會被刪（圖片自動轉背景圖）',
  widget:'小工具：只有 47 個標籤、只留 class/style，url() 會被刪；變數用 {{英文大寫}}'
};
function applyModeUI(){
  const M=MODES[mode];
  ALLOWED_TAGS=M.tags; DROP_WITH_CONTENT=M.drop;
  $('#app').dataset.mode=mode; $('#page').dataset.mode=mode;
  $$('#modeTabs button').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode));
  $('#modeBadge').textContent=M.name;
  $('#stageHint').textContent=MODE_HINT[mode];
  $('#stageHint').title=MODE_HINT[mode];
  codeEl.placeholder=M.ph;
  $('#saveModeName').textContent=M.name;
  $('#warnTitle').textContent='CaveDuck '+M.name+'相容性檢查';
  document.title='CaveDuck 排版室・'+M.name;
}
function updateModeCounts(){
  const ids={info:'#mcInfo',chat:'#mcChat',widget:'#mcWidget'};
  MODE_LIST.forEach(m=>{ const len=(m===mode?codeEl.value:docs[m].code).length; $(ids[m]).textContent=len?(len>=1000?(len/1000).toFixed(1)+'k':len):''; });
}
function switchMode(m){
  if(!MODES[m]||m===mode) return;
  if(editingText) commitTextEdit();
  docs[mode].code=codeEl.value; docs[mode].undo=undoStack; docs[mode].redo=redoStack; docs[mode].scroll=$('#canvas').scrollTop;
  store(codeKey(mode),codeEl.value);
  mode=m; store('cdb3_mode',m);
  const d=docs[m];
  codeEl.value=d.code; undoStack=d.undo; redoStack=d.redo;
  selectedUid=-1; clearSelection();
  applyModeUI();
  htmlSaves=loadHtmlSaves(); renderHtmlSaves();
  parseAndRender();
  requestAnimationFrame(()=>{ $('#canvas').scrollTop=d.scroll||0; positionOverlay(); });
  toast('切到 <b>'+MODES[m].name+'</b>');
}
$('#modeTabs').addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) switchMode(b.dataset.mode); });
document.addEventListener('keydown',e=>{
  if(e.altKey&&!e.ctrlKey&&!e.metaKey&&['1','2','3'].includes(e.key)){ e.preventDefault(); switchMode(MODE_LIST[+e.key-1]); }
});

pv.addEventListener('scroll',positionOverlay,{passive:true});

/* —— 左抽屜：圖示欄點一下開、再點一下收 —— */
const DRAWER_INFO={props:['屬性','點選預覽中的元素'],parts:['新增','點＝插入・拖到預覽＝放在那裡'],img:['圖片','按住縮圖拖到預覽'],deco:['裝飾','加到畫布的一層'],mine:['我的常用設定','存下常用樣式，一鍵套用'],tree:['圖層','頁面結構與順序'],save:['存檔','這個頁面自己的存檔']};
function setDrawer(open){
  $('#main').classList.toggle('drawerClosed',!open);
  $('#drawerIco').textContent=open?'⟨':'⟩';
  $('#btnDrawer').lastChild.textContent=open?'收合':'展開';
  store('cdb3_drawer',open?'1':'0');
  requestAnimationFrame(positionOverlay);
}
function openDrawer(name){
  if(name){
    $$('#tabs button[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab===name));
    $$('.pane').forEach(p=>p.classList.toggle('on',p.id==='pane-'+name));
    const di=DRAWER_INFO[name]; if(di){ $('#drawerTitle').textContent=di[0]; $('#drawerSub').textContent=di[1]; }
    if(name==='props'&&selNode()) populateProps();
    store('cdb3_tab',name);
  }
  setDrawer(true);
}

/* —— 選取框快捷列 —— */
const qbar=ovl.querySelector('.qbar');
qbar.addEventListener('mousedown',e=>{ e.stopPropagation(); e.preventDefault(); });
qbar.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  const n=selNode(), c=selClone(); if(!n) return;
  const isAbs=c&&getComputedStyle(c).position==='absolute';
  switch(b.dataset.q){
    case 'up':   if(isAbs) restack('up');   else if(!$('#tUp').disabled) $('#tUp').click(); else toast('已經在最上面'); break;
    case 'down': if(isAbs) restack('down'); else if(!$('#tDown').disabled) $('#tDown').click(); else toast('已經在最下面'); break;
    case 'color': loadIntoPalette(n.style.color||n.style.backgroundColor||n.style.background); toast('已帶到調色盤，選好按「套到文字／背景」'); break;
    case 'code': $('#pbSelectCode').click(); break;
    case 'dup': $('#pbDup').click(); break;
    case 'canvas': $('#pbToCanvas').click(); break;
    case 'del': $('#pbDel').click(); break;
  }
});

/* —— 通用拖曳：部件／新元素 → 預覽 —— */
let suppressClick=0;
$('#side').addEventListener('click',e=>{ if(Date.now()-suppressClick<400){ e.stopPropagation(); e.preventDefault(); } },true);
function startHtmlDrag(ev,spec){
  if(ev.button!==0) return;
  ev.preventDefault();
  const d={sx:ev.clientX,sy:ev.clientY,active:false,dropEl:null};
  const move=e=>{
    if(!d.active){
      if(Math.abs(e.clientX-d.sx)+Math.abs(e.clientY-d.sy)<=6) return;
      d.active=true; document.body.classList.add('dragging');
      if(spec.img){ ghost.classList.remove('lab'); ghost.querySelector('img').src=spec.img; } else { ghost.classList.add('lab'); ghost.querySelector('.glab').textContent=spec.label; }
      ghost.style.display='block';
    }
    if(spec.img){ ghost.style.left=(e.clientX-45)+'px'; ghost.style.top=(e.clientY-45)+'px'; } else { ghost.style.left=(e.clientX-60)+'px'; ghost.style.top=(e.clientY-22)+'px'; }
    if(d.dropEl&&d.dropEl!==pv) d.dropEl.classList.remove('cdb-drop');
    d.dropEl=null; d.cvClone=null;
    const under=document.elementFromPoint(e.clientX,e.clientY);
    if(under&&pv.contains(under)){
      let cvClone=null, x=under.closest?under.closest('[data-cdbuid]'):null;
      while(x&&x!==pv){ if(getComputedStyle(x).position==='relative'){ cvClone=x; break; } x=x.parentElement&&x.parentElement.closest?x.parentElement.closest('[data-cdbuid]'):null; }
      if(spec.flowOnly) cvClone=null;
      d.dropEl=cvClone||under.closest('[data-cdbuid]')||pv;
      if(d.dropEl!==pv) d.dropEl.classList.add('cdb-drop');
      d.cvClone=cvClone; d.px=e.clientX; d.py=e.clientY; d.overPv=true;
    }else d.overPv=(under===pv||under===$('#page'));
  };
  const up=()=>{
    document.removeEventListener('pointermove',move); document.removeEventListener('pointerup',up);
    ghost.style.display='none'; ghost.classList.remove('lab'); document.body.classList.remove('dragging');
    if(d.dropEl&&d.dropEl!==pv) d.dropEl.classList.remove('cdb-drop');
    if(!d.active) return;
    suppressClick=Date.now();
    if(!d.overPv){ toast('放開的位置不在預覽上'); return; }
    if(d.cvClone){
      const cvNode=modelEls[+d.cvClone.getAttribute('data-cdbuid')]; if(!cvNode) return;
      const r=d.cvClone.getBoundingClientRect();
      const xPct=Math.min(92,Math.max(0,(d.px-r.left)/r.width*100-12));
      const yPct=Math.min(92,Math.max(0,(d.py-r.top)/r.height*100-6));
      insertSmart(spec.html(true),{canvas:cvNode,x:xPct,y:yPct});
    }else{
      let after=null;
      if(d.dropEl&&d.dropEl!==pv){ const n=modelEls[+d.dropEl.getAttribute('data-cdbuid')]; after=n?topBlockOf(n):null; }
      insertSmart(spec.html(false),{canvas:null,after,forceFlow:true});
    }
  };
  document.addEventListener('pointermove',move); document.addEventListener('pointerup',up);
}
const NEW_SPECS={
  newText:{label:'Ｔ 文字',html:cv=>cv?`<div style='position:absolute;width:44%;text-align:center;font-size:${pxToClamp(20)};color:#f0b03c;letter-spacing:2px;'>雙擊編輯文字</div>`:`<div style='padding:22px 28px;text-align:center;'><span style='font-size:15px;letter-spacing:2px;color:#d8d2c4;'>雙擊這裡編輯文字</span></div>`},
  newBlock:{label:'▢ 區塊',html:cv=>cv?`<div style='position:absolute;width:40%;height:28%;background:rgba(20,16,8,0.78);border:1px solid rgba(184,148,63,0.45);border-radius:6px;'></div>`:`<div style='width:88%;margin:18px auto;padding:24px;background:rgba(20,16,8,0.78);border:1px solid rgba(184,148,63,0.45);border-radius:6px;'>雙擊編輯內容</div>`},
  newCanvas:{label:'⬒ 畫布區塊',flowOnly:true,html:()=>`<div style='position:relative;width:100%;aspect-ratio:780/420;background:#0a0a0d;overflow:hidden;'></div>`},
  newSpacer:{label:'↕ 空白間隔',flowOnly:true,html:()=>`<div style='height:80px;'></div>`}
};
Object.entries(NEW_SPECS).forEach(([id,spec])=>$('#'+id).addEventListener('pointerdown',ev=>startHtmlDrag(ev,spec)));

/* —— 底部 code 抽屜：拖曳調高度 —— */
(function(){
  const h=load('cdb3_codeH'); if(h) document.documentElement.style.setProperty('--codeH',h+'px');
  $('#gutterCode').addEventListener('mousedown',e=>{
    e.preventDefault(); const g=$('#gutterCode'); g.classList.add('drag');
    const sy=e.clientY, h0=$('#codewrap').getBoundingClientRect().height, maxH=$('#stage').getBoundingClientRect().height-140;
    const move=ev=>{ const v=Math.max(120,Math.min(maxH,h0-(ev.clientY-sy))); document.documentElement.style.setProperty('--codeH',Math.round(v)+'px'); positionOverlay(); };
    const up=()=>{ document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); g.classList.remove('drag'); store('cdb3_codeH',parseInt(getComputedStyle(document.documentElement).getPropertyValue('--codeH'))||''); };
    document.addEventListener('mousemove',move); document.addEventListener('mouseup',up);
  });
})();
try{ new ResizeObserver(()=>positionOverlay()).observe($('#canvas')); }catch(e){}
