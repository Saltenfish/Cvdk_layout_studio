'use strict';
/* ═══════════ V3. 平台流程：和 CaveDuck 一樣用 DOMPurify 3.3.3 ＋ marked（breaks 開啟、GFM），照各頁面的處理順序 ═══════════ */
const CD_INFO_TAGS=['a','b','p','i','span','br','hr','strong','em','img','div'];
const CD_MD_TAGS=['h1','h2','h3','h4','h5','h6','ul','ol','li','blockquote','code','pre','del','table','thead','tbody','tr','th','td'];
const CD_CHAT_FORBID=['a','img','style'];
const CD_WIDGET_TAGS=['div','span','p','br','hr','section','article','header','footer','nav','aside','figure','figcaption',
  'h1','h2','h3','h4','h5','h6','strong','em','b','i','u','s','small','sub','sup','mark',
  'ul','ol','li','table','thead','tbody','tfoot','tr','th','td','blockquote','pre','code','dl','dt','dd','details','summary'];
/* DOMPurify 刪掉這些標籤時，裡面的內容也一起刪（DOMPurify 預設 FORBID_CONTENTS） */
const CD_FORBID_CONTENTS=new Set(['annotation-xml','audio','colgroup','desc','foreignobject','head','iframe','math','mi','mn','mo','ms','mtext','noembed','noframes','noscript','plaintext','script','style','svg','template','thead','title','video','xmp']);
/* 角色介面直接寫會被刪、但可以用 Markdown 寫出來的標籤 */
const CD_MD_ONLY=new Set(CD_MD_TAGS);

function cdEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
/* 平台的 Markdown 圖片：<img class="cursor-pointer" src alt title> */
const cdMdRenderer=new marked.Renderer();
cdMdRenderer.image=function(t){ return '<img class="cursor-pointer" src="'+cdEsc(t.href)+'" alt="'+cdEsc(t.text||'')+'"'+(t.title?' title="'+cdEsc(t.title)+'"':'')+'>'; };
marked.use({breaks:true,renderer:cdMdRenderer});

/* 排版室用來對應「預覽元素 ↔ code」的記號，過濾時一律保留（平台沒有這個屬性，不影響結果） */
let cdKeepMarks=false;
DOMPurify.addHook('uponSanitizeAttribute',(node,data)=>{
  if(cdKeepMarks&&(data.attrName==='data-cdbuid'||data.attrName==='data-cdbvar')) data.forceKeepAttr=true;
});
function cdPurify(html,cfg,rep){
  const out=DOMPurify.sanitize(html,cfg);
  if(rep){
    const gone=new Set(DOMPurify.removed.filter(r=>r.element).map(r=>r.element));
    for(const r of DOMPurify.removed){
      if(r.element&&r.element.nodeType===1){ const t=r.element.nodeName.toLowerCase(); if(t!=='body'&&t!=='html') rep.tags[t]=(rep.tags[t]||0)+1; }
      else if(r.attribute&&r.from&&!gone.has(r.from)){ const k=r.from.nodeName.toLowerCase()+'['+r.attribute.name+']'; if(r.attribute.name!=='data-cdbuid') rep.attrs[k]=(rep.attrs[k]||0)+1; }
    }
  }
  return out;
}

/* 角色介面：YouTube 嵌入（平台唯一允許的 iframe，最多 4 個） */
const CD_YT=/^https?:\/\/(?:www\.)?(?:youtube|youtube-nocookie)\.com\/embed\/([\w-]{11})/i;
function cdWithEmbeds(text,fn){
  const embeds=[];
  let t=text.replace(/CDKEMBED(\d+)CDKEND/g,'').replace(/<iframe\b[\s\S]*?<\/iframe>/gi,m=>{
    if(embeds.length>=4) return '';
    const tag=(m.match(/<iframe\b[^>]*>/i)||[''])[0];
    const src=((tag.match(/[\s"']src\s*=\s*["']([^"']+)["']/i)||[])[1])||'';
    const id=(src.match(CD_YT)||[])[1]; if(!id) return '';
    embeds.push('<iframe class="aspect-video rounded-lg w-full max-w-2xl" src="https://www.youtube-nocookie.com/embed/'+id+'?playsinline=1&amp;rel=0" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>');
    return 'CDKEMBED'+(embeds.length-1)+'CDKEND';
  });
  t=fn(t);
  return t.replace(/CDKEMBED(\d+)CDKEND/g,(m,i)=>embeds[+i]||'');
}
/* {{char}}／{{user}} → 平台的名字顏色（排版室裡名字照原樣顯示） */
function cdColorize(h,mark){
  const v=(cls,m)=>'<span class="'+cls+'"'+(mark?' data-cdbvar="'+m+'"':'')+'>'+m+'</span>';
  return h.replace(/\{\{\s*char\s*\}\}/g,m=>v('text-char-name',m)).replace(/\{\{\s*user\s*\}\}/g,m=>v('text-asker-name',m));
}
function cdWidgetStyle(css){
  return css.replace(/url\s*\([^)]*\)/gi,'').replace(/expression\s*\([^)]*\)/gi,'').replace(/-moz-binding\s*:[^;]*/gi,'').replace(/@import\b[^;]*/gi,'');
}

/* 照目前頁面跑一次平台流程。src 可以是字串或 DOM（DocumentFragment）；回傳 HTML 字串 */
function cdPlatformHTML(src,m,rep,mark){
  m=m||mode;
  let html;
  if(typeof src==='string'){ const t=document.createElement('template'); t.innerHTML=src; src=t.content; }
  const box=document.createElement('div'); box.appendChild(src.cloneNode(true));
  /* 小工具：style 裡的 {{變數}} 先換成示意值（平台會換成狀態值） */
  if(m==='widget') box.querySelectorAll('[style]').forEach(el=>{ const s=el.getAttribute('style'); if(s.indexOf('{{')>=0) el.setAttribute('style',s.replace(/\{\{[^{}]+\}\}/g,'60')); });
  html=box.innerHTML;
  cdKeepMarks=!!mark;
  try{
    if(m==='chat'){
      html=cdPurify(html,{FORBID_TAGS:CD_CHAT_FORBID},rep);
    }else if(m==='widget'){
      html=cdPurify(html,{ALLOWED_TAGS:CD_WIDGET_TAGS,ALLOWED_ATTR:['class','style'],ALLOW_DATA_ATTR:false},rep);
      html=html.replace(/style="([^"]*)"/gi,(x,css)=>'style="'+cdWidgetStyle(css)+'"');
    }else{
      html=cdWithEmbeds(html,t=>{
        const a=cdPurify(t,{ALLOWED_TAGS:CD_INFO_TAGS},rep);
        const b=cdPurify(marked.parse(a),{ALLOWED_TAGS:CD_INFO_TAGS.concat(CD_MD_TAGS)},rep2(rep));
        return cdColorize(b,mark);
      });
    }
  }finally{ cdKeepMarks=false; }
  return html;
}
/* 第二次過濾刪掉的東西（Markdown 產生的），另外記 */
function rep2(rep){ if(!rep) return null; rep.md=rep.md||{tags:{},attrs:{}}; return rep.md; }

/* 給編輯器用：帶記號跑平台流程，回傳預覽用的 DocumentFragment */
function cdPlatformRender(model,els){
  const box=document.createElement('template');
  box.content.appendChild(model.cloneNode(true));
  const cEls=[...box.content.querySelectorAll('*')];
  cEls.forEach((el,i)=>el.setAttribute('data-cdbuid',i));
  const rep={tags:{},attrs:{}};
  const html=cdPlatformHTML(box.content,mode,rep,true);
  const t=document.createElement('template'); t.innerHTML=html;
  const frag=t.content;
  /* 被平台改掉的屬性：原值記在 data-cdbraw-*，雙擊改字時還原，不會寫進 code */
  frag.querySelectorAll('[data-cdbuid]').forEach(c=>{
    const mEl=els[+c.getAttribute('data-cdbuid')]; if(!mEl) return;
    for(const a of mEl.attributes){ if(c.getAttribute(a.name)!==a.value) c.setAttribute('data-cdbraw-'+a.name,a.value); }
  });
  return {frag,rep};
}
/* 雙擊改字前檢查：這段在預覽裡和 code 一一對應才能直接改（有 Markdown 產生的、被刪掉的東西就不行） */
function cdEditable(uid,clone){
  const mEl=modelEls[uid]; if(!mEl||!clone) return false;
  for(const x of clone.querySelectorAll('*')){ if(!x.hasAttribute('data-cdbuid')&&!x.closest('[data-cdbvar]')) return false; }
  const n=clone.querySelectorAll('[data-cdbuid]').length;
  return n===mEl.querySelectorAll('*').length;
}
