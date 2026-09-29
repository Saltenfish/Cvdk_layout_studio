'use strict';
/* ═══════════ 3.6 部件庫（依頁面分開：角色介面／聊天室／小工具）═══════════ */
/* 模擬圖片（SVG，插入後可在屬性最上面換成自己的圖片網址） */
function svgURI(s){ return 'data:image/svg+xml,'+s.replace(/\s*\n\s*/g,'').replace(/#/g,'%23').replace(/"/g,'%22').replace(/</g,'%3C').replace(/>/g,'%3E'); }
const PH={
 land:svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3d6b"/><stop offset=".6" stop-color="#b87a8f"/><stop offset="1" stop-color="#f3c29a"/></linearGradient></defs>
  <rect width="400" height="260" fill="url(#a)"/><circle cx="290" cy="120" r="34" fill="#ffe3b0" opacity=".9"/>
  <path d="M0 200 L70 140 L130 185 L200 120 L270 180 L330 150 L400 190 L400 260 L0 260Z" fill="#3a3550"/>
  <path d="M0 230 L90 190 L170 225 L250 195 L330 228 L400 210 L400 260 L0 260Z" fill="#1f1d2c"/></svg>`),
 port:svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4460"/><stop offset="1" stop-color="#1c1a24"/></linearGradient></defs>
  <rect width="300" height="360" fill="url(#b)"/><circle cx="150" cy="140" r="56" fill="#8a7f9c"/>
  <path d="M40 360 C40 260 90 220 150 220 C210 220 260 260 260 360Z" fill="#8a7f9c"/></svg>`),
 sea:svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd4ee"/><stop offset="1" stop-color="#fbe7c6"/></linearGradient></defs>
  <rect width="400" height="160" fill="url(#c)"/><rect y="160" width="400" height="100" fill="#4f82a6"/>
  <path d="M0 175 Q50 168 100 175 T200 175 T300 175 T400 175" stroke="#cfe6f2" stroke-width="3" fill="none" opacity=".6"/>
  <path d="M250 150 L268 118 L268 150Z" fill="#fff8ec"/><rect x="238" y="150" width="46" height="9" rx="3" fill="#6b4a3a"/></svg>`),
 room:svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="260" fill="#2a2320"/><rect x="40" y="30" width="130" height="150" fill="#f0c58a" opacity=".85"/>
  <path d="M105 30 V180 M40 105 H170" stroke="#2a2320" stroke-width="6"/><rect y="200" width="400" height="60" fill="#3d302a"/>
  <rect x="230" y="120" width="120" height="80" rx="6" fill="#5a4636"/></svg>`)
};
const PH_ALL=Object.values(PH);
function P(name){ const it=PARTS.flatMap(g=>g.items).find(i=>i.name===name); if(!it) return null;
  const code=it.code.replace(/src='[^']*網址'/g,()=>`src='${PH.land}'`).replace(/url\(這裡放圖片網址\)/g,`url("${PH.room}")`);
  return {name:it.name,desc:it.desc,code}; }
function N(name,desc,code){ return {name,desc,code,isNew:true}; }


/* 文字樣式小工具：一行置中的樣式字 */
const TXT=(st,t)=>`<div style='text-align:center;padding:16px 20px;'><span style='${st}'>${t||'樣式文字'}</span></div>`;

const LIB_INFO=[
 {cat:'版面結構',items:[
  P('外層容器（深色）'),
  N('外層容器（淺色紙張）','米白底＋細網點',`<!-- ═══ 淺色紙張外層 ═══ -->
<div style='box-sizing:border-box;width:100%;max-width:780px;margin:0 auto;overflow:hidden;background-color:#f6f1e7;background-image:radial-gradient(rgba(90,80,60,0.08) 1px,transparent 1.2px);background-size:6px 6px;color:#34302a;font-family:sans-serif;font-size:14px;line-height:1.85;'>
<div style='padding:36px 28px;'>內容放這裡</div>
</div>`),
  N('外層容器（雙框卡）','外框＋內框的整頁卡',`<!-- ═══ 雙框外層 ═══ -->
<div style='box-sizing:border-box;width:100%;max-width:780px;margin:0 auto;padding:8px;background:#141217;border:1px solid rgba(200,170,110,0.4);'>
<div style='border:1px solid rgba(200,170,110,0.25);padding:32px 26px;color:#ddd6ca;font-family:serif;line-height:1.9;'>內容放這裡</div>
</div>`),
  N('色帶區段','整條色塊＋左側粗線',`<!-- ═══ 色帶區段 ═══ -->
<div style='background:#1f2a36;padding:24px 28px;border-left:4px solid #8fb4e0;'>
<div style='font:12px/1.5 monospace;letter-spacing:4px;color:#8fb4e0;margin-bottom:10px;'>SECTION 01</div>
<div style='color:#dfe6ee;font-size:14px;line-height:1.9;'>這一段的內容文字。</div>
</div>`),
  P('兩欄文字'), P('三格數據'),
  N('三欄小卡格','三張並排的小卡',`<!-- ═══ 三欄小卡 ═══ -->
<div style='display:flex;flex-wrap:wrap;gap:10px;padding:18px 20px;'>
<div style='flex:1 1 150px;padding:14px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);'><div style='font-weight:700;color:#f0b03c;'>小標一</div><div style='font-size:13px;color:#b8b2a6;margin-top:4px;'>簡短說明。</div></div>
<div style='flex:1 1 150px;padding:14px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);'><div style='font-weight:700;color:#f0b03c;'>小標二</div><div style='font-size:13px;color:#b8b2a6;margin-top:4px;'>簡短說明。</div></div>
<div style='flex:1 1 150px;padding:14px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);'><div style='font-weight:700;color:#f0b03c;'>小標三</div><div style='font-size:13px;color:#b8b2a6;margin-top:4px;'>簡短說明。</div></div>
</div>`),
  N('側欄＋主欄','左窄右寬的版面',`<!-- ═══ 側欄＋主欄 ═══ -->
<div style='display:flex;flex-wrap:wrap;gap:18px;padding:20px 24px;'>
<div style='flex:0 1 150px;border-right:1px solid rgba(255,255,255,0.1);padding-right:14px;font-size:12px;letter-spacing:2px;color:#8fa0b8;line-height:2;'>側欄標籤<br>第二項<br>第三項</div>
<div style='flex:1 1 260px;font-size:14px;line-height:1.9;color:#ddd6ca;'>主要內容寫在這一欄，寬度會自動填滿。</div>
</div>`),
  N('置中窄欄','閱讀感的窄段落',`<!-- ═══ 置中窄欄 ═══ -->
<div style='max-width:460px;margin:0 auto;padding:26px 20px;font-size:15px;line-height:2;color:#ddd6ca;text-align:justify;'>這一欄比較窄，適合放長篇敘述，讀起來比較舒服。</div>`),
  P('空白間隔'), P('漸層分隔線'), P('底部 Footer')
 ]},
 {cat:'標題',items:[
  P('標題區'), P('雙線夾標題'), P('章節編號標題'), P('英文襯底大字'), P('直書標題'), P('印章標題'),
  N('兩色堆疊大標','兩行不同顏色的大字',`<!-- ═══ 兩色堆疊大標 ═══ -->
<div style='padding:30px 28px 16px;'>
<div style='font-size:clamp(26px,5.5vw,44px);line-height:1.2;font-weight:800;color:#ece6da;'>第一行標題<br><span style='color:#7fc4b0;'>第二行強調</span></div>
<div style='margin-top:12px;width:48px;height:3px;background:#7fc4b0;'></div>
</div>`),
  N('英文主標＋中文副標','大英文字、小中文',`<!-- ═══ 英文主標＋中文副標 ═══ -->
<div style='text-align:center;padding:26px 24px;'>
<div style='font-family:Georgia,serif;font-size:34px;font-style:italic;letter-spacing:3px;color:#e8d8bc;'>Title Here</div>
<div style='font-size:12px;letter-spacing:6px;color:#9aa6b4;margin-top:6px;'>中 文 副 標 題</div>
</div>`),
  N('背景大字標題','淡色超大字墊在後面',`<!-- ═══ 背景大字標題 ═══ -->
<div style='position:relative;text-align:center;overflow:hidden;padding:10px 0;'>
<div style='font:900 clamp(90px,24vw,190px)/1 sans-serif;color:rgba(127,196,176,0.12);'>ONE</div>
<div style='position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);font-size:20px;letter-spacing:10px;color:#dfeee8;font-weight:700;'>標題文字</div>
</div>`),
  N('標題＋徽章','標題旁邊掛一個小標籤',`<!-- ═══ 標題＋徽章 ═══ -->
<div style='display:flex;align-items:center;gap:10px;padding:22px 28px 10px;'>
<span style='font-size:20px;font-weight:700;letter-spacing:3px;color:#ece6da;'>標題文字</span>
<span style='font-size:11px;padding:2px 8px;border-radius:999px;background:#e5417a;color:#fff;letter-spacing:1px;'>TAG</span>
</div>`),
  N('底線標題','粗色底線的左對齊標題',`<!-- ═══ 底線標題 ═══ -->
<div style='padding:24px 28px 6px;'><span style='font-size:20px;font-weight:700;letter-spacing:2px;color:#ece6da;background:linear-gradient(transparent 62%,rgba(240,176,60,0.45) 62%);padding:0 4px;'>標題文字</span></div>`)
 ]},
 {cat:'文字段落',items:[
  P('敘事段落（黑塊）'), P('引號金句'), P('編號清單'), P('圖示＋說明列'),
  N('路線標示','起點 → 終點的虛線',`<!-- ═══ 路線標示 ═══ -->
<div style='display:flex;align-items:center;gap:10px;padding:14px 28px;font:12px/1.5 monospace;letter-spacing:2px;color:#9ab8d0;'>
<span>起點</span><span style='flex:1;border-top:1px dotted #9ab8d0;'></span><span>▶</span><span>終點</span>
</div>`),
  N('原文＋翻譯','兩種語言上下排',`<!-- ═══ 原文＋翻譯 ═══ -->
<div style='text-align:center;padding:16px 24px;'>
<div style='font-size:12px;letter-spacing:2px;color:#8f8a80;'>Original line goes here.</div>
<div style='font-size:15px;color:#ece6da;margin-top:3px;'>翻譯的句子放這裡。</div>
</div>`),
  N('首字放大段落','第一個字特大',`<!-- ═══ 首字放大 ═══ -->
<div style='padding:18px 28px;font-size:14px;line-height:1.9;color:#ddd6ca;'><span style='float:left;font-size:46px;line-height:1;margin:4px 8px 0 0;color:#f0b03c;font-family:serif;'>故</span>事從這裡開始，第一個字會放大，後面的文字會繞著它排列。</div>`),
  N('重點框段落','左邊有色條的提示段',`<!-- ═══ 重點框 ═══ -->
<div style='margin:14px 24px;padding:12px 16px;border-left:3px solid #7fc4b0;background:rgba(127,196,176,0.08);font-size:14px;line-height:1.8;color:#dce8e4;'><b style='color:#7fc4b0;'>重點：</b>這裡寫需要特別注意的內容。</div>`),
  P('反白劇透文字'), P('刪除線劃記')
 ]},
 {cat:'文字樣式',items:[
  N('發光金字','金色＋光暈',TXT('font-size:26px;font-weight:700;color:#f0b03c;text-shadow:0 0 18px rgba(240,176,60,0.75),2px 2px 0 rgba(0,0,0,0.6);')),
  N('冰藍霓虹','冷色霓虹光',TXT('font-size:26px;font-weight:700;color:#d6f0ff;text-shadow:0 0 6px rgba(120,200,255,0.9),0 0 18px rgba(80,160,255,0.6);')),
  N('粉紅霓虹','粉色霓虹光',TXT('font-size:26px;font-weight:700;color:#ffe0ec;text-shadow:0 0 6px rgba(255,120,180,0.9),0 0 18px rgba(229,65,122,0.6);')),
  N('紅色霓虹','警示紅光',TXT('font-size:26px;font-weight:700;color:#ff4a4a;text-shadow:0 0 8px rgba(255,43,43,0.9),0 0 20px rgba(255,43,43,0.6);')),
  N('金色漸層字','由亮到暗的金屬漸層',TXT("font-size:28px;font-weight:900;background:linear-gradient(180deg,#fff1c4 0%,#f0b03c 55%,#9a6412 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;")),
  N('彩虹漸層字','多色橫向漸層',TXT("font-size:28px;font-weight:900;background:linear-gradient(90deg,#ff8a8a,#ffd36a,#8ae0a8,#7ab8ff,#c89aff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;")),
  N('空心描邊字','只有外框線',TXT('font-size:30px;font-weight:900;color:transparent;-webkit-text-stroke:1px #f0b03c;letter-spacing:3px;')),
  N('復古雙色陰影','兩層錯位陰影',TXT('font-size:28px;font-weight:900;color:#f0b03c;text-shadow:3px 3px 0 #c83018,6px 6px 0 rgba(0,0,0,0.5);')),
  N('金屬浮雕','淺色浮雕感',TXT('font-size:26px;font-weight:700;color:#e8d5a0;text-shadow:1px 1px 0 #6b5010,-1px -1px 0 rgba(255,255,255,0.25);')),
  N('圖上疊字描邊','放在圖上也看得清楚',TXT('font-size:24px;font-weight:700;color:#ffffff;text-shadow:0 1px 8px rgba(0,0,0,0.9),0 2px 16px rgba(0,0,0,0.5);')),
  N('打字機字','等寬字＋寬字距',TXT('font-family:monospace;font-size:18px;letter-spacing:3px;color:#d8d2c4;border-right:2px solid #d8d2c4;padding-right:4px;')),
  N('模糊夢境','柔焦發光字',TXT('font-size:22px;letter-spacing:4px;color:rgba(232,213,160,0.85);text-shadow:0 0 4px rgba(232,213,160,0.8),0 0 12px rgba(232,213,160,0.4);')),
  N('螢光筆標記','半截底色的重點字',TXT('font-size:20px;font-weight:700;color:#f5efe3;background:linear-gradient(transparent 55%,rgba(255,214,90,0.55) 55%);padding:0 4px;')),
  N('小字母寬間距','細小的英文標籤字',TXT('font-size:11px;letter-spacing:8px;color:#9aa6b4;font-family:sans-serif;','SMALL CAPS LABEL'))
 ]},
 {cat:'圖片',items:[
  P('全幅圖＋上下漸層'), P('圓形頭像（金框）'), P('背景圖容器'), P('兩欄圖文卡'),
  N('圖片＋底部字幕','圖片下方浮出一行字幕',`<!-- ═══ 圖片＋底部字幕 ═══ -->
<div style='position:relative;overflow:hidden;border-radius:6px;'>
<img src='${PH.room}' alt='' style='display:block;width:100%;'>
<div style='position:absolute;left:0;right:0;bottom:0;padding:28px 16px 10px;background:linear-gradient(transparent,rgba(0,0,0,0.75));text-align:left;'>
<div style='font-size:14px;font-weight:600;color:#fff;'>字幕文字放這裡</div>
<div style='font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:1px;'>小字補充</div>
</div>
</div>`),
  N('圖片＋角落標籤','圖片角落貼一張小標籤',`<!-- ═══ 圖片＋角落標籤 ═══ -->
<div style='position:relative;max-width:440px;margin:20px auto;'>
<img src='${PH.sea}' alt='' style='display:block;width:100%;border-radius:4px;'>
<div style='position:absolute;left:12px;top:12px;padding:4px 10px;background:#7fc4b0;color:#0f2a24;font-size:11px;font-weight:700;letter-spacing:2px;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,0.3);'>LABEL</div>
</div>`),
  N('拍立得雙拼','兩張斜放的相片',`<!-- ═══ 拍立得雙拼 ═══ -->
<div style='display:flex;justify-content:center;flex-wrap:wrap;gap:18px;padding:26px 16px;'>
<div style='width:170px;background:#fbf8f2;padding:8px 8px 28px;box-shadow:0 8px 20px rgba(0,0,0,0.45);transform:rotate(-4deg);'><img src='${PH.land}' alt='' style='display:block;width:100%;aspect-ratio:1;object-fit:cover;'><div style='text-align:center;font-size:12px;color:#5a4a3a;margin-top:6px;'>相片說明一</div></div>
<div style='width:170px;background:#fbf8f2;padding:8px 8px 28px;box-shadow:0 8px 20px rgba(0,0,0,0.45);transform:rotate(3deg);margin-top:14px;'><img src='${PH.sea}' alt='' style='display:block;width:100%;aspect-ratio:1;object-fit:cover;'><div style='text-align:center;font-size:12px;color:#5a4a3a;margin-top:6px;'>相片說明二</div></div>
</div>`),
  N('圖文左右','左邊文字、右邊圖片',`<!-- ═══ 圖文左右 ═══ -->
<div style='display:flex;flex-wrap:wrap;align-items:center;gap:18px;padding:30px 28px;'>
<div style='flex:1 1 240px;min-width:0;'>
<div style='font-size:24px;font-weight:700;color:#ece6da;'>標題文字</div>
<div style='margin-top:10px;font-size:14px;line-height:1.8;color:#b8b2a6;'>說明文字放這裡。</div>
</div>
<div style='flex:1 1 220px;min-width:0;max-width:300px;'><img src='${PH.port}' alt='' style='display:block;width:100%;border-radius:10px;'></div>
</div>`),
  N('圖片三格拼貼','一大兩小的拼貼',`<!-- ═══ 三格拼貼 ═══ -->
<div style='display:flex;gap:6px;padding:16px;'>
<img src='${PH.land}' alt='' style='flex:2;min-width:0;height:220px;object-fit:cover;display:block;border-radius:4px;'>
<div style='flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;'><img src='${PH.sea}' alt='' style='height:107px;width:100%;object-fit:cover;display:block;border-radius:4px;'><img src='${PH.room}' alt='' style='height:107px;width:100%;object-fit:cover;display:block;border-radius:4px;'></div>
</div>`),
  P('圖片輪播（左右滑）'), P('疊圖層動畫組'), P('圖上疊字（可拖曳）')
 ]},
 {cat:'卡片與資料',items:[
  P('四角金框檔案卡'), P('資料列（欄位＋值）'), P('標籤徽章列'), P('能力星等'), P('進度條（div 版）'), P('時間軸'),
  N('地點卡列','三張不同色的地點卡',`<!-- ═══ 地點卡列 ═══ -->
<div style='display:flex;flex-wrap:wrap;gap:10px;padding:18px 20px;'>
<div style='flex:1 1 170px;border-radius:10px;overflow:hidden;background:#1b1d24;'><div style='height:6px;background:linear-gradient(90deg,#7ab8ff,#c89aff);'></div><div style='padding:14px;'><div style='font-size:10px;letter-spacing:3px;color:#7ab8ff;'>No.1</div><div style='font-size:16px;font-weight:700;color:#eef0f5;margin:4px 0;'>地點名稱</div><div style='font-size:12.5px;line-height:1.7;color:#a8aebc;'>地點簡介。</div></div></div>
<div style='flex:1 1 170px;border-radius:10px;overflow:hidden;background:#1b1d24;'><div style='height:6px;background:linear-gradient(90deg,#ffd36a,#ff8a8a);'></div><div style='padding:14px;'><div style='font-size:10px;letter-spacing:3px;color:#ffd36a;'>No.2</div><div style='font-size:16px;font-weight:700;color:#eef0f5;margin:4px 0;'>地點名稱</div><div style='font-size:12.5px;line-height:1.7;color:#a8aebc;'>地點簡介。</div></div></div>
<div style='flex:1 1 170px;border-radius:10px;overflow:hidden;background:#1b1d24;'><div style='height:6px;background:linear-gradient(90deg,#8ae0a8,#7fc4b0);'></div><div style='padding:14px;'><div style='font-size:10px;letter-spacing:3px;color:#8ae0a8;'>No.3</div><div style='font-size:16px;font-weight:700;color:#eef0f5;margin:4px 0;'>地點名稱</div><div style='font-size:12.5px;line-height:1.7;color:#a8aebc;'>地點簡介。</div></div></div>
</div>`),
  N('身分卡','照片＋欄位的橫式卡',`<!-- ═══ 身分卡 ═══ -->
<div style='max-width:480px;margin:22px auto;display:flex;gap:14px;padding:14px;background:#1d2029;border:1px solid #394055;border-radius:12px;color:#dde2ee;font-family:sans-serif;'>
<img src='${PH.port}' alt='' style='flex:0 0 96px;width:96px;height:120px;object-fit:cover;border-radius:8px;'>
<div style='flex:1;min-width:0;font-size:13px;line-height:1.9;'>
<div style='font-size:18px;font-weight:700;'>角色名稱</div>
<div style='color:#98a0b4;'>稱號／職業</div>
<div>生日　<b>00.00</b></div><div>身高　<b>000 cm</b></div>
</div>
</div>`),
  P('票券卡'), P('公告欄（警示條紋）'), P('橫滑卡片列')
 ]},
 {cat:'對話',items:[
  P('對話框＋尖角'), P('左右對話'), P('手機通知卡'),
  N('獨白框','單人長台詞的框',`<!-- ═══ 獨白框 ═══ -->
<div style='max-width:560px;margin:18px auto;padding:18px 22px;border:1px solid rgba(240,176,60,0.4);border-radius:4px;background:rgba(240,176,60,0.05);'>
<div style='font-size:12px;letter-spacing:3px;color:#f0b03c;margin-bottom:6px;'>角色名</div>
<div style='font-size:15px;line-height:1.9;color:#ece6da;'>「台詞內容放在這裡。」</div>
</div>`),
  N('旁白條','斜體灰字的旁白',`<!-- ═══ 旁白條 ═══ -->
<div style='text-align:center;padding:14px 30px;font-style:italic;font-size:13.5px;letter-spacing:1px;color:#8f8a80;'>—— 旁白的文字放在這裡 ——</div>`),
  N('系統提示條','像遊戲系統訊息',`<!-- ═══ 系統提示 ═══ -->
<div style='margin:12px 24px;padding:8px 14px;border-radius:4px;background:#11161c;border:1px solid #2e4a5e;font:12.5px/1.6 monospace;color:#7ad0ff;'>[SYSTEM] 系統訊息放在這裡。</div>`),
  N('心聲雲朵','虛線圓角的內心話',`<!-- ═══ 心聲雲朵 ═══ -->
<div style='max-width:420px;margin:18px auto;padding:14px 20px;border:2px dashed rgba(200,160,255,0.5);border-radius:30px;text-align:center;font-size:14px;color:#e0d4ff;font-style:italic;'>（心裡想的話……）</div>`),
  N('簡訊串','手機訊息一來一往',`<!-- ═══ 簡訊串 ═══ -->
<div style='max-width:380px;margin:18px auto;padding:14px;border-radius:18px;background:#16161c;font-family:sans-serif;font-size:13.5px;'>
<div style='display:flex;margin-bottom:6px;'><span style='background:#2c2c36;color:#e8e8f0;padding:7px 12px;border-radius:14px 14px 14px 4px;max-width:75%;'>對方的訊息</span></div>
<div style='display:flex;justify-content:flex-end;margin-bottom:6px;'><span style='background:#3a7bd5;color:#fff;padding:7px 12px;border-radius:14px 14px 4px 14px;max-width:75%;'>我的回覆</span></div>
<div style='text-align:right;font-size:10px;color:#7a7a88;'>已讀 00:00</div>
</div>`),
  N('來電畫面','手機來電卡',`<!-- ═══ 來電畫面 ═══ -->
<div style='max-width:260px;margin:20px auto;padding:22px 16px;border-radius:26px;background:linear-gradient(180deg,#2a3346,#12151c);text-align:center;font-family:sans-serif;color:#eef2f8;'>
<div style='font-size:11px;letter-spacing:2px;color:#9aa6b8;'>來電中…</div>
<div style='font-size:22px;font-weight:700;margin:8px 0 18px;'>來電者名稱</div>
<div style='display:flex;justify-content:space-around;'><span style='width:44px;height:44px;border-radius:50%;background:#e04a4a;display:inline-flex;align-items:center;justify-content:center;'>✕</span><span class='animate__animated animate__pulse animate__infinite' style='width:44px;height:44px;border-radius:50%;background:#3fbf6a;display:inline-flex;align-items:center;justify-content:center;'>✆</span></div>
</div>`),
  N('大喊爆炸框','鋸齒爆炸形的吼叫',`<!-- ═══ 大喊爆炸框 ═══ -->
<div style='text-align:center;padding:20px;'>
<span style='display:inline-block;padding:26px 34px;background:#ffd84a;color:#2a1a00;font-weight:900;font-size:22px;clip-path:polygon(50% 0,61% 22%,85% 8%,78% 34%,100% 42%,80% 58%,94% 84%,66% 76%,55% 100%,42% 78%,16% 92%,22% 66%,0 55%,20% 40%,8% 14%,36% 22%);'>大喊!!</span>
</div>`),
  N('對話選項','可以選的回應選項',`<!-- ═══ 對話選項 ═══ -->
<div style='max-width:420px;margin:16px auto;font-size:14px;'>
<div style='padding:9px 14px;margin-bottom:6px;border:1px solid #4a5a7a;border-radius:6px;color:#dfe6f5;'>▶ 選項一</div>
<div style='padding:9px 14px;margin-bottom:6px;border:1px solid #4a5a7a;border-radius:6px;color:#dfe6f5;'>▶ 選項二</div>
<div style='padding:9px 14px;border:1px solid #4a5a7a;border-radius:6px;color:#dfe6f5;'>▶ 選項三</div>
</div>`)
 ]},
 {cat:'紙張與小物件',items:[
  P('橫線筆記紙'), P('折角便利貼'), P('報紙頭版標題'), P('假按鈕列'),
  N('小標籤紙','可以單獨擺的斜標籤',`<!-- ═══ 小標籤紙 ═══ -->
<div style='text-align:center;padding:16px;'>
<span style='display:inline-block;transform:rotate(-5deg);padding:8px 16px;background:#e9e0cc;border:1px dashed #8a7a5a;font:bold 12px/1.5 monospace;letter-spacing:3px;color:#4a3e28;'>LABEL</span>
</div>`),
  N('信封','有封口三角的信封',`<!-- ═══ 信封 ═══ -->
<div style='position:relative;max-width:360px;margin:24px auto;height:190px;background:#efe3cc;border-radius:4px;box-shadow:0 8px 18px rgba(0,0,0,0.4);overflow:hidden;'>
<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom right,transparent 49.5%,#dccfb4 50%) left top/50% 55% no-repeat,linear-gradient(to bottom left,transparent 49.5%,#dccfb4 50%) right top/50% 55% no-repeat;'></div>
<div style='position:absolute;left:50%;top:44%;width:38px;height:38px;margin-left:-19px;border-radius:50%;background:#b03a2e;color:#f5d8c8;font-size:16px;display:flex;align-items:center;justify-content:center;'>✉</div>
<div style='position:absolute;left:24px;bottom:18px;font-size:13px;color:#5a4a34;'>To. 收件人</div>
</div>`),
  N('明信片','左字右郵票的明信片',`<!-- ═══ 明信片 ═══ -->
<div style='max-width:460px;margin:24px auto;display:flex;gap:14px;padding:16px;background:#faf6ee;border:1px solid #d8ccb4;color:#3a3226;box-shadow:0 6px 16px rgba(0,0,0,0.35);'>
<div style='flex:1;font-size:13.5px;line-height:1.9;border-right:1px solid #d8ccb4;padding-right:12px;'>寫給你的一段話……</div>
<div style='flex:0 0 120px;display:flex;flex-direction:column;align-items:flex-end;gap:10px;'><div style='width:54px;height:64px;border:2px dotted #b8a888;background:#e8c8a0;'></div><div style='width:100%;border-bottom:1px solid #b8a888;height:16px;'></div><div style='width:100%;border-bottom:1px solid #b8a888;height:16px;'></div></div>
</div>`),
  N('收據小票','鋸齒邊的收據',`<!-- ═══ 收據小票 ═══ -->
<div style='max-width:260px;margin:24px auto;background:#fdfcf8;color:#2a2a2a;font:12.5px/1.8 monospace;padding:14px 16px 18px;clip-path:polygon(0 0,100% 0,100% 100%,94% 97%,88% 100%,82% 97%,76% 100%,70% 97%,64% 100%,58% 97%,52% 100%,46% 97%,40% 100%,34% 97%,28% 100%,22% 97%,16% 100%,10% 97%,4% 100%,0 97%);'>
<div style='text-align:center;font-weight:700;letter-spacing:3px;'>RECEIPT</div>
<div style='border-top:1px dashed #999;margin:6px 0;'></div>
<div style='display:flex;justify-content:space-between;'><span>品項一</span><span>000</span></div>
<div style='display:flex;justify-content:space-between;'><span>品項二</span><span>000</span></div>
<div style='border-top:1px dashed #999;margin:6px 0;'></div>
<div style='display:flex;justify-content:space-between;font-weight:700;'><span>TOTAL</span><span>000</span></div>
</div>`),
  N('吊牌','有繩孔的小吊牌',`<!-- ═══ 吊牌 ═══ -->
<div style='text-align:center;padding:18px;'>
<div style='display:inline-block;position:relative;padding:22px 18px 14px;background:#e8d6b4;color:#4a3820;border-radius:6px 6px 6px 6px;clip-path:polygon(20% 0,80% 0,100% 16%,100% 100%,0 100%,0 16%);font-size:13px;letter-spacing:2px;'>
<div style='width:10px;height:10px;border-radius:50%;background:#1a1612;margin:0 auto 8px;'></div>吊牌文字
</div>
</div>`),
  N('書籤','細長的絲帶書籤',`<!-- ═══ 書籤 ═══ -->
<div style='text-align:center;padding:10px;'>
<div style='display:inline-block;width:60px;padding:18px 0 34px;background:#8a2a3a;color:#f5dde2;writing-mode:vertical-rl;letter-spacing:6px;font-size:14px;clip-path:polygon(0 0,100% 0,100% 100%,50% 88%,0 100%);'>書籤文字</div>
</div>`)
 ]},
 {cat:'動態效果',items:[
  P('跑馬燈'), P('閃爍提示字'),
  N('心跳強調字','一直跳動的重點字',`<!-- ═══ 心跳強調字 ═══ -->
<div style='text-align:center;padding:18px;'>
<span class='animate__animated animate__heartBeat animate__infinite animate__slow' style='display:inline-block;font-size:22px;font-weight:700;color:#e5417a;letter-spacing:3px;'>♥ 重點文字 ♥</span>
</div>`),
  N('浮現段落','慢慢從下方淡入',`<!-- ═══ 浮現段落 ═══ -->
<div class='animate__animated animate__fadeInUp animate__slower' style='padding:24px 8%;font-size:15px;line-height:1.9;color:#d8d2c4;text-align:center;'>這一段會慢慢浮現。</div>`),
  N('搖擺吊牌','左右擺動的牌子',`<!-- ═══ 搖擺吊牌 ═══ -->
<div style='text-align:center;padding:10px 0 20px;'>
<span class='animate__animated animate__swing animate__infinite animate__slower' style='display:inline-block;padding:10px 18px;border:2px solid #f0b03c;border-radius:6px;color:#f0b03c;font-weight:700;letter-spacing:3px;'>OPEN</span>
</div>`),
  N('果凍按鈕','會 Q 彈的按鈕外觀',`<!-- ═══ 果凍按鈕 ═══ -->
<div style='text-align:center;padding:18px;'>
<span class='animate__animated animate__jello animate__infinite animate__slower' style='display:inline-block;padding:9px 24px;border-radius:999px;background:#7fc4b0;color:#0f2a24;font-weight:700;'>點我</span>
</div>`),
  N('旋轉星星','一直轉的星號',`<!-- ═══ 旋轉星星 ═══ -->
<div style='text-align:center;padding:14px;'><span style='display:inline-block;font-size:28px;color:#ffd36a;animation:spin 6s linear infinite;'>✦</span></div>`),
  N('雷達波點','向外擴散的提示點',`<!-- ═══ 雷達波點 ═══ -->
<div style='display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;font-size:13px;color:#b8e8c8;'>
<span style='position:relative;display:inline-block;width:10px;height:10px;'><span style='position:absolute;inset:0;border-radius:50%;background:#3fdc6a;animation:ping 1.4s infinite;'></span><span style='position:absolute;inset:0;border-radius:50%;background:#3fdc6a;'></span></span>LIVE
</div>`),
  N('左側滑入卡','從左邊滑進來的卡',`<!-- ═══ 左側滑入卡 ═══ -->
<div class='animate__animated animate__fadeInLeft animate__slow' style='margin:14px 24px;padding:14px 18px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#ddd6ca;'>滑進來的內容。</div>`),
  N('逐行淡入','三行依序出現',`<!-- ═══ 逐行淡入 ═══ -->
<div style='padding:18px 28px;font-size:15px;line-height:2;color:#ddd6ca;text-align:center;'>
<div class='animate__animated animate__fadeIn' style='animation-delay:0.3s;'>第一行</div>
<div class='animate__animated animate__fadeIn' style='animation-delay:1.1s;'>第二行</div>
<div class='animate__animated animate__fadeIn' style='animation-delay:1.9s;'>第三行</div>
</div>`)
 ]}
].map(g=>({cat:g.cat,items:g.items.filter(Boolean)}));

const LIB_CHAT_EXTRA={cat:'聊天室限定',items:[
 N('折疊區塊','點一下展開（details）',`<details style='margin:12px 16px;border:1px solid rgba(143,180,224,0.4);border-radius:8px;background:#141821;color:#d8dee8;'>
<summary style='cursor:pointer;padding:10px 14px;font-weight:700;color:#8fb4e0;'>點開看更多</summary>
<div style='padding:0 14px 12px;font-size:14px;line-height:1.8;'>折疊起來的內容。</div>
</details>`),
 N('問答折疊列表','多個可展開的問題',`<div style='margin:12px 16px;border-radius:8px;overflow:hidden;border:1px solid #2e3440;'>
<details style='background:#161a22;border-bottom:1px solid #2e3440;'><summary style='cursor:pointer;padding:10px 14px;color:#e5e9f0;'>Q1. 問題一？</summary><div style='padding:0 14px 12px;color:#aab3c2;font-size:14px;'>回答內容。</div></details>
<details style='background:#161a22;border-bottom:1px solid #2e3440;'><summary style='cursor:pointer;padding:10px 14px;color:#e5e9f0;'>Q2. 問題二？</summary><div style='padding:0 14px 12px;color:#aab3c2;font-size:14px;'>回答內容。</div></details>
<details style='background:#161a22;'><summary style='cursor:pointer;padding:10px 14px;color:#e5e9f0;'>Q3. 問題三？</summary><div style='padding:0 14px 12px;color:#aab3c2;font-size:14px;'>回答內容。</div></details>
</div>`),
 N('劇透折疊','點開才看到的劇透',`<details style='margin:12px 16px;'><summary style='cursor:pointer;display:inline-block;padding:4px 12px;border-radius:999px;background:#2a1a24;color:#ff8fb4;font-size:13px;'>⚠ 劇透注意（點開）</summary><div style='margin-top:8px;padding:10px 14px;border-left:3px solid #ff8fb4;color:#e8d8e0;font-size:14px;'>劇透內容。</div></details>`),
 N('巢狀折疊','折疊裡面還有折疊',`<details style='margin:12px 16px;border:1px solid #3a3a48;border-radius:8px;padding:0 12px;background:#15151c;color:#e0e0ea;'>
<summary style='cursor:pointer;padding:10px 0;font-weight:700;'>第一層</summary>
<details style='margin:0 0 10px 10px;border-left:2px solid #6a6aa8;padding-left:10px;'><summary style='cursor:pointer;padding:6px 0;color:#b0b0f0;'>第二層</summary><div style='padding:0 0 8px;font-size:13.5px;'>最裡面的內容。</div></details>
</details>`),
 N('資料表格','有框線的表格（table）',`<table style='margin:12px auto;border-collapse:collapse;font-size:13px;color:#d8d2c4;min-width:280px;'>
<tr style='background:#2a2418;color:#f0b03c;'><th style='padding:6px 12px;border:1px solid #4a3e28;'>項目</th><th style='padding:6px 12px;border:1px solid #4a3e28;'>數值</th></tr>
<tr><td style='padding:6px 12px;border:1px solid #3a3226;'>項目一</td><td style='padding:6px 12px;border:1px solid #3a3226;'>00</td></tr>
<tr><td style='padding:6px 12px;border:1px solid #3a3226;'>項目二</td><td style='padding:6px 12px;border:1px solid #3a3226;'>00</td></tr>
</table>`),
 N('斑馬紋表格','隔行變色的表格',`<table style='margin:12px auto;border-collapse:collapse;font-size:13px;min-width:300px;color:#dfe6ee;'>
<tr style='background:#2a3a4e;'><th style='padding:7px 12px;text-align:left;'>名稱</th><th style='padding:7px 12px;text-align:left;'>說明</th></tr>
<tr style='background:#18202a;'><td style='padding:7px 12px;'>項目一</td><td style='padding:7px 12px;'>內容</td></tr>
<tr style='background:#1e2834;'><td style='padding:7px 12px;'>項目二</td><td style='padding:7px 12px;'>內容</td></tr>
<tr style='background:#18202a;'><td style='padding:7px 12px;'>項目三</td><td style='padding:7px 12px;'>內容</td></tr>
</table>`),
 N('原生標題','h2＋h3 標題',`<div style='padding:14px 20px;color:#ece6da;'><h2 style='font-size:22px;font-weight:700;margin:0 0 6px;'>大標題</h2><h3 style='font-size:16px;font-weight:600;color:#9aa6b4;margin:0;'>小標題</h3></div>`),
 N('項目清單','有圓點的 ul 清單',`<ul style='margin:10px 20px;padding-left:22px;list-style:disc;color:#ddd6ca;font-size:14px;line-height:1.9;'><li>第一項</li><li>第二項</li><li>第三項</li></ul>`),
 N('定義清單','名詞＋說明（dl）',`<dl style='margin:12px 20px;color:#ddd6ca;font-size:14px;'><dt style='font-weight:700;color:#f0b03c;'>名詞一</dt><dd style='margin:2px 0 10px 16px;color:#b8b2a6;'>說明文字。</dd><dt style='font-weight:700;color:#f0b03c;'>名詞二</dt><dd style='margin:2px 0 0 16px;color:#b8b2a6;'>說明文字。</dd></dl>`),
 N('SVG 星星徽章','向量小圖示（svg）',`<div style='text-align:center;padding:12px;'>
<svg width='64' height='64' viewBox='0 0 24 24'><path d='M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z' fill='#f0b03c' stroke='#7a5410' stroke-width='0.8'/></svg>
</div>`)
]};

/* 小工具基礎部件：每類 10 種，全部可以拼在同一個外框裡 */
const WB=(n,d,c)=>N(n,d,c);
