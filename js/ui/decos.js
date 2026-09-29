'use strict';
/* ═══════════ 26. v3.6：裝飾庫改成可收合分類＋支援「插在區塊之間」的裝飾 ═══════════ */
function isLightUI(){ return document.documentElement.dataset.theme==='light'; }
const LIGHT_DEF={'#0a0a0d':'#f4efe6','#0e0e10':'#f4efe6','#000000':'#000000','#1a0e04':'#8a6a4a','#241a0e':'#e2d4bc','#1f2a36':'#d6e0ea','#c8d4e8':'#ffffff','#ffffff':'#6a5a40','#e8e8e8':'#5a5040','#e8dcc4':'#8a7a60','#cfd8ff':'#6a7ab0','#4a4640':'#cfc6b4','#1a2a5a':'#9ab0e0','#e0c890':'#9a7a40','#fff1c4':'#d8a040','#f5efe3':'#5a4a34','#fff4d0':'#c89a30','#fff4d8':'#ffffff','#b8943f':'#9a7430','#c8a070':'#9a6a38','#8a8478':'#6a6458','#9aa6b4':'#5a6678'};
const DECO_STATES=new Map();
function decoState(it){
  let s=DECO_STATES.get(it.name);
  if(s&&s.__touched) return s;
  const d=decoDefaults(it);
  DECO_STATES.set(it.name,d); return d;
}
const URL_DECOS=new Set(['六邊形花紋','格子花紋','雜訊紋理']);
const KIND_LABEL={edge:'邊緣',cover:'蓋滿畫布',spot:'自由擺放',flow:'插在區塊之間'};
function decoPreviewHtml(it,state){
  const inner=it.b(state);
  const lt=isLightUI();
  if(it.kind==='flow') return `<div style="background:${lt?'#efe8dc':'#0a0a0d'};height:40px"></div>${inner}<div style="background:${lt?'#d6e0ea':'#1f2a36'};height:40px"></div>`;
  const html=it.kind==='spot'?inner.replace(/^<div style='/,"<div style='top:32%;left:38%;"):inner;
  return `<div style="position:relative;height:190px;background:${lt?'linear-gradient(135deg,#f3ece0,#d9cfbe)':'linear-gradient(135deg,#3a3040,#1c1922)'};overflow:hidden">${html}</div>`;
}
function decoBody(body,it,state){
  const prev=document.createElement('div'); prev.className='pprev'; body.appendChild(prev);
  const ctrls=document.createElement('div'); ctrls.style.marginTop='8px'; body.appendChild(ctrls);
  const draw=()=>fitPreview(prev,decoPreviewHtml(it,state),420,200);
  (it.p||[]).forEach(pp=>{
    const row=document.createElement('div'); row.className='srow';
    if(pp.type==='color'){
      row.innerHTML=`<label>${pp.label}</label><input type="color" value="${state[pp.k]}"><input class="tin" value="${state[pp.k]}" spellcheck="false" style="font-size:11px">`;
      const [ci,ti]=row.querySelectorAll('input');
      ci.addEventListener('input',()=>{ ti.value=ci.value; state[pp.k]=ci.value; state.__touched=1; draw(); });
      ti.addEventListener('input',()=>{ if(/^#[0-9a-f]{6}$/i.test(ti.value.trim())){ ci.value=ti.value.trim(); state[pp.k]=ti.value.trim(); state.__touched=1; draw(); } });
    }else{
      row.innerHTML=`<label>${pp.label}</label><input type="range" min="${pp.min}" max="${pp.max}" value="${state[pp.k]}"><span class="sval">${state[pp.k]}${pp.unit}</span>`;
      const ri=row.querySelector('input'), sv=row.querySelector('.sval');
      ri.addEventListener('input',()=>{ state.__touched=1; state[pp.k]=+ri.value; sv.textContent=ri.value+pp.unit; draw(); });
    }
    ctrls.appendChild(row);
  });
  const prow=document.createElement('div'); prow.className='prow';
  prow.innerHTML=`<button class="mbtn solid">${it.kind==='flow'?'插到選取的後面':'加到畫布'}</button><button class="mbtn">複製 code</button>`;
  body.appendChild(prow);
  const [bAdd,bCopy]=prow.querySelectorAll('.mbtn');
  bAdd.addEventListener('click',()=>{
    let html=it.b(state);
    if(it.kind==='flow'){ insertSmart(html,{forceFlow:true}); return; }
    const cv=decoTarget(); if(!cv){ toast('找不到可放置的畫布'); return; }
    if(it.kind==='spot') html=html.replace(/^<div style='/,"<div style='top:20%;left:20%;");
    insertSmart(html,{canvas:cv});
  });
  bCopy.addEventListener('click',()=>copyText(it.b(state),'<b>已複製</b> '+it.name));
  draw();
}
function renderDecos(){
  const root=$('#decoList');
  let open=new Set(); try{ const v=JSON.parse(load('cdb3_decoopen')||'null'); if(Array.isArray(v)) open=new Set(v); }catch(e){}
  root.replaceChildren(...DECOS.map(g=>{
    const items=g.items.filter(it=>!(mode==='widget'&&URL_DECOS.has(it.name)));
    const det=document.createElement('details'); det.className='acat lcat'; det.open=open.has(g.cat);
    det.innerHTML=`<summary>${esc(g.cat)}<span class="ac">${items.length}</span></summary><div class="lbody"></div>`;
    det.addEventListener('toggle',()=>{ if(det.open) open.add(g.cat); else open.delete(g.cat); store('cdb3_decoopen',JSON.stringify([...open])); });
    const body=det.querySelector('.lbody');
    items.forEach(it=>{
      const state=decoState(it);
      const d=document.createElement('div'); d.className='pitem';
      d.innerHTML=`<button class="phead"><span class="pname">${esc(it.name)}</span><span class="pdesc">${KIND_LABEL[it.kind]||''}</span><span class="pmore">看更多 ▸</span></button><div class="pbody"></div>`;
      const head=d.querySelector('.phead'), pb=d.querySelector('.pbody');
      head.addEventListener('click',()=>{ hideHover(); const o=d.classList.toggle('open'); if(o&&!d.dataset.built){ d.dataset.built='1'; decoBody(pb,it,state); } });
      head.addEventListener('mouseenter',()=>{ if(!d.classList.contains('open')) showHover(head,it.name,decoPreviewHtml(it,state),{baseW:420,deco:true}); });
      head.addEventListener('mouseleave',hideHover);
      body.appendChild(d);
    });
    return det;
  }));
}
{ const _rl=renderLib; renderLib=function(){ _rl(); renderDecos(); }; }
renderDecos();
