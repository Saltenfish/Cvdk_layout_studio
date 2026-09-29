'use strict';
/* ═══════════ 3. 資料：部件庫（可插入的常用區塊）═══════════ */
const PARTS = [
{cat:'基礎結構',items:[
 {name:'外層容器（深色）',desc:'一切的起點',code:
`<!-- ═══ 外層容器 ═══ -->
<div style='box-sizing:border-box;width:100%;max-width:780px;margin:0 auto;background:#0a0a0d;font-family:serif;line-height:1.95;color:#d8d2c4;overflow:hidden;'>
<div style='padding:40px 24px;text-align:center;'>內容放這裡</div>
</div>`},
 {name:'標題區',desc:'大標＋小副標',code:
`<!-- ═══ 標題區 ═══ -->
<div style='padding:40px 24px 8px;text-align:center;'>
<div class='animate__animated animate__fadeInDown' style='font-size:26px;font-weight:400;letter-spacing:14px;color:#f0b03c;text-indent:14px;'>主標題</div>
<div style='color:#8fa0b8;font-size:13px;letter-spacing:5px;font-family:sans-serif;margin-top:8px;'>副標題 · SUBTITLE</div>
</div>`},
 {name:'敘事段落（黑塊）',desc:'標籤＋主文＋小字',code:
`<!-- ═══ 敘事段落 ═══ -->
<div style='background:#0a0a0d;padding:34px 28px;text-align:center;'>
<span style='font-size:14px;letter-spacing:9px;color:#c8791f;font-family:sans-serif;font-weight:700;'>小 標 籤</span>
<div style='margin-top:18px;font-size:18px;letter-spacing:1px;color:#d8d2c4;'>主要敘事文字<br>第二行文字</div>
<div style='color:#8fa0b8;font-size:13px;margin-top:10px;'>補充的小字敘述。</div>
</div>`},
 {name:'空白間隔',desc:'拉開距離',code:
`<!-- ═══ 空白間隔（改 height 調距離）═══ -->
<div style='background:#0a0a0d;height:120px;'></div>`},
 {name:'漸層分隔線',desc:'細緻的過場',code:
`<!-- ═══ 分隔線 ═══ -->
<div style='height:1px;background:linear-gradient(90deg,transparent,#b8943f,transparent);margin:24px 28px;'></div>`},
 {name:'底部 Footer',desc:'收尾色塊',code:
`<!-- ═══ FOOTER ═══ -->
<div style='padding:24px 28px;text-align:center;background:#0e0a06;'>
<div style='font-size:14px;letter-spacing:3px;color:#c8a050;margin-bottom:4px;'>標題 · TITLE</div>
<div style='font-size:11px;color:#7a6030;letter-spacing:1px;'>副標小字說明</div>
</div>`}
]},
{cat:'圖片相關',items:[
 {name:'全幅圖＋上下漸層',desc:'圖與黑底無縫銜接',code:
`<!-- ═══ 全幅圖（上下漸層過渡）═══ -->
<div style='position:relative;width:100%;'>
<img src='這裡放圖片網址' alt='' style='width:100%;display:block;'>
<div style='position:absolute;top:0;left:0;width:100%;height:22%;background:linear-gradient(to bottom,#0a0a0d 0%,transparent 100%);'></div>
<div style='position:absolute;bottom:0;left:0;width:100%;height:26%;background:linear-gradient(to top,#0a0a0d 0%,transparent 100%);'></div>
</div>`},
 {name:'圖上疊字（可拖曳）',desc:'放進 relative 圖容器內',code:
`<!-- ▼ 圖上疊字（位置可調：改 top / left，或直接在預覽拖曳）-->
<div style='position:absolute;top:60%;left:12%;'>
<span style='font-family:sans-serif;font-weight:900;font-size:48px;color:#ff2b2b;text-shadow:0 0 20px rgba(255,43,43,0.8),4px 4px 0 #6b0000;letter-spacing:4px;'>碰!</span>
</div>`},
 {name:'圓形頭像（金框）',desc:'發光圓框大頭照',code:
`<!-- ═══ 圓形頭像 ═══ -->
<div style='text-align:center;margin:24px 0;'>
<img src='這裡放圖片網址' alt='' style='display:inline-block;width:150px;height:150px;object-fit:cover;border-radius:50%;border:3px solid #f0b03c;box-shadow:0 0 20px rgba(240,176,60,0.35);'>
</div>`},
 {name:'背景圖容器',desc:'文字直接疊在圖上',code:
`<!-- ═══ 背景圖容器 ═══ -->
<div style='background:url(這裡放圖片網址) center/cover;border-radius:4px;padding:3px;'>
<div style='background:rgba(14,10,6,0.85);border-radius:2px;padding:28px 24px;color:#e0c890;'>
內容放這裡（底下透出背景圖）
</div>
</div>`},
 {name:'圖片輪播（左右滑）',desc:'scroll-snap 手滑切換',code:
`<!-- ═══ 圖片輪播：橫向滑動 + scroll-snap ═══ -->
<div style='display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;background:#0a0a0d;'>
<div style='flex:0 0 100%;scroll-snap-align:center;position:relative;color:#fff;'>
<img src='第1張圖網址' alt='' style='display:block;width:100%;aspect-ratio:4/3;object-fit:cover;'>
<div style='position:absolute;top:12px;right:14px;background:rgba(0,0,0,0.55);font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;'>1/3</div>
</div>
<div style='flex:0 0 100%;scroll-snap-align:center;position:relative;color:#fff;'>
<img src='第2張圖網址' alt='' style='display:block;width:100%;aspect-ratio:4/3;object-fit:cover;'>
<div style='position:absolute;top:12px;right:14px;background:rgba(0,0,0,0.55);font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;'>2/3</div>
</div>
<div style='flex:0 0 100%;scroll-snap-align:center;position:relative;color:#fff;'>
<img src='第3張圖網址' alt='' style='display:block;width:100%;aspect-ratio:4/3;object-fit:cover;'>
<div style='position:absolute;top:12px;right:14px;background:rgba(0,0,0,0.55);font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;'>3/3</div>
</div>
</div>
<div style='text-align:center;font-size:11px;color:rgba(180,150,80,0.5);letter-spacing:2px;padding:6px 0;font-family:monospace;'>← SWIPE →</div>`},
 {name:'疊圖層動畫組',desc:'多層圖輪流亮起',code:
`<!-- ═══ 疊圖層：底圖＋各層輪流點亮（週期8s，delay 錯開）═══ -->
<div style='position:relative;width:100%;'>
<img src='底圖網址' alt='' style='width:100%;display:block;'>
<img src='疊層1網址' alt='' style='position:absolute;top:0;left:0;width:100%;height:100%;animation:fadeIn 8s steps(2,jump-none) 0s infinite;'>
<img src='疊層2網址' alt='' style='position:absolute;top:0;left:0;width:100%;height:100%;animation:fadeIn 8s steps(2,jump-none) 2s infinite;'>
</div>`}
]},
{cat:'卡片資料',items:[
 {name:'四角金框檔案卡',desc:'角色資料卡經典款',code:
`<!-- ═══ 檔案卡片（四角裝飾）═══ -->
<div style='position:relative;width:88%;max-width:520px;margin:24px auto;padding:36px 32px;background:linear-gradient(160deg,#1a140a 0%,#241a0e 50%,#16100a 100%);border:2px solid rgba(184,148,63,0.5);border-radius:8px;box-shadow:0 0 30px rgba(240,176,60,0.15),inset 0 0 20px rgba(0,0,0,0.6);'>
<div style='position:absolute;top:8px;left:8px;width:22px;height:22px;border-top:2px solid #f0b03c;border-left:2px solid #f0b03c;'></div>
<div style='position:absolute;top:8px;right:8px;width:22px;height:22px;border-top:2px solid #f0b03c;border-right:2px solid #f0b03c;'></div>
<div style='position:absolute;bottom:8px;left:8px;width:22px;height:22px;border-bottom:2px solid #f0b03c;border-left:2px solid #f0b03c;'></div>
<div style='position:absolute;bottom:8px;right:8px;width:22px;height:22px;border-bottom:2px solid #f0b03c;border-right:2px solid #f0b03c;'></div>
內容放這裡
</div>`},
 {name:'資料列（欄位＋值）',desc:'姓名/年齡這種列',code:
`<!-- ═══ 資料列 ═══ -->
<div style='padding:12px 0;border-bottom:1px solid rgba(184,148,63,0.25);'>
<span style='font-size:13px;letter-spacing:3px;color:#c8791f;font-family:sans-serif;'>欄位名</span>
<div style='margin-top:6px;font-size:15px;color:#d8d2c4;'>欄位內容</div>
</div>`},
 {name:'兩欄圖文卡',desc:'圖左文右，手機自動直排',code:
`<!-- ═══ 兩欄圖文卡 ═══ -->
<div style='border-radius:12px;overflow:hidden;background:#16130d;display:flex;flex-wrap:wrap;margin-bottom:16px;'>
<img src='圖片網址' alt='' style='flex:1 1 240px;min-height:150px;object-fit:cover;display:block;max-width:100%;'><div style='flex:1 1 180px;padding:20px;display:flex;flex-wrap:wrap;align-items:center;'>
<div>
<div style='font-size:14px;font-weight:700;color:#f0b03c;margin-bottom:6px;'>小標題</div>
<div style='font-size:12px;color:#a89878;line-height:1.9;'>說明文字放這裡。</div>
</div>
</div>
</div>`},
 {name:'標籤徽章列',desc:'年齡/身高小標籤',code:
`<!-- ═══ 標籤列 ═══ -->
<div style='display:flex;flex-wrap:wrap;gap:6px;padding:8px 0;'>
<span style='background:rgba(184,148,63,0.12);border:1px solid rgba(184,148,63,0.45);color:#d8c480;font-family:monospace;font-size:11px;padding:3px 8px;border-radius:3px;'>標籤一</span><span style='background:rgba(184,148,63,0.12);border:1px solid rgba(184,148,63,0.45);color:#d8c480;font-family:monospace;font-size:11px;padding:3px 8px;border-radius:3px;'>標籤二</span><span style='background:rgba(184,148,63,0.12);border:1px solid rgba(184,148,63,0.45);color:#d8c480;font-family:monospace;font-size:11px;padding:3px 8px;border-radius:3px;'>標籤三</span>
</div>`},
 {name:'進度條（div 版）',desc:'好感度/血條',code:
`<!-- ═══ 進度條（改內層 width:N% 調進度）═══ -->
<div style='margin:10px 0;'>
<div style='display:flex;justify-content:space-between;font-size:11px;font-family:monospace;color:#c8a050;margin-bottom:4px;'><span>好感度</span><span>65%</span></div>
<div style='height:10px;background:rgba(0,0,0,0.5);border:1px solid rgba(184,148,63,0.4);border-radius:6px;overflow:hidden;'>
<div style='width:65%;height:100%;background:linear-gradient(90deg,#c8791f,#f0b03c);border-radius:6px;'></div>
</div>
</div>`},
 {name:'橫滑卡片列',desc:'一排可左右滑的卡',code:
`<!-- ═══ 橫向滑動卡片列 ═══ -->
<div style='display:flex;gap:16px;overflow-x:auto;padding:10px 6px 14px;-webkit-overflow-scrolling:touch;align-items:flex-start;'>
<div style='flex:0 0 160px;background:#1a1208;border:1px solid rgba(184,148,63,0.35);border-radius:4px;padding:10px;'><div style='font-size:13px;color:#c8a848;font-weight:900;margin-bottom:4px;'>卡片一</div><div style='font-size:11px;color:#a89060;line-height:1.7;'>卡片說明文字</div></div>
<div style='flex:0 0 160px;background:#1a1208;border:1px solid rgba(184,148,63,0.35);border-radius:4px;padding:10px;'><div style='font-size:13px;color:#c8a848;font-weight:900;margin-bottom:4px;'>卡片二</div><div style='font-size:11px;color:#a89060;line-height:1.7;'>卡片說明文字</div></div>
<div style='flex:0 0 160px;background:#1a1208;border:1px solid rgba(184,148,63,0.35);border-radius:4px;padding:10px;'><div style='font-size:13px;color:#c8a848;font-weight:900;margin-bottom:4px;'>卡片三</div><div style='font-size:11px;color:#a89060;line-height:1.7;'>卡片說明文字</div></div>
</div>
<div style='text-align:center;font-size:10px;color:rgba(180,150,80,0.4);letter-spacing:2px;font-family:monospace;'>← SWIPE →</div>`}
]},
{cat:'對話與裝飾',items:[
 {name:'對話框＋尖角',desc:'指向下方的氣泡',code:
`<!-- ═══ 對話框（朝下尖角）═══ -->
<div style='position:relative;max-width:680px;margin:0 auto 24px;background:#12121a;border:1.5px solid #c8791f;border-radius:18px;padding:20px 24px;box-shadow:0 0 30px rgba(240,176,60,0.12);'>
<div style='font-family:sans-serif;font-size:20px;font-weight:700;color:#f0b03c;letter-spacing:1px;line-height:1.6;text-align:center;'>對話內容放這裡!</div>
<div style='font-family:sans-serif;font-size:14px;color:#8fa0b8;margin-top:8px;text-align:center;'>（補充的小字）</div>
<div style='position:absolute;bottom:-13px;left:50%;margin-left:-12px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:13px solid #c8791f;'></div>
<div style='position:absolute;bottom:-10px;left:50%;margin-left:-10px;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:11px solid #12121a;'></div>
</div>`},
 {name:'跑馬燈',desc:'角色介面唯一可用寫法',code:
`<!-- ═══ 跑馬燈 ═══ -->
<div style='overflow:hidden;padding:5px 0;background:#0e0a06;'>
<span style='display:inline-block;white-space:nowrap;padding-left:100%;animation:slideOutLeft 32s linear infinite;font:11px/1.6 monospace;letter-spacing:2px;color:#c8a050;'>✦ 跑馬燈文字 ✦ 會一直往左跑 ✦ 文字可以放很長 ✦</span>
</div>`},
 {name:'手寫圈註強調',desc:'紅筆圈起來的字',code:
`<!-- ═══ 手寫圈註 ═══ -->
<span style='display:inline-block;position:relative;white-space:nowrap;padding:0 6px;color:#ff8a3c;font-weight:bold;'>
被圈的字
<span style='position:absolute;left:-5px;top:-3px;width:calc(100% + 10px);height:calc(100% + 6px);border:2px solid #c83018;border-radius:50% 40% 55% 45% / 55% 45% 50% 50%;transform:rotate(-3deg);opacity:0.9;'></span>
<span style='position:absolute;left:-3px;top:-4px;width:calc(100% + 6px);height:calc(100% + 8px);border:1.5px solid #a82010;border-radius:45% 55% 40% 60% / 40% 60% 45% 55%;transform:rotate(4deg);opacity:0.7;'></span>
</span>`},
 {name:'斜體彩影標語',desc:'旋轉＋彩色陰影大字',code:
`<!-- ═══ 斜體彩影標語 ═══ -->
<div style='padding:40px 28px;text-align:center;'>
<span style='display:inline-block;font-size:26px;font-weight:700;font-style:italic;color:#f0b03c;letter-spacing:2px;transform:rotate(-4deg);text-shadow:2px 2px 0 #ff2b2b,4px 4px 12px rgba(255,43,43,0.5);'>震驚的一句話???</span>
</div>`},
 {name:'反白劇透文字',desc:'選取才看得到',code:
`<!-- 選取才看得到的隱藏內容 -->
<span style='background:#1a1a1a;color:#1a1a1a;border-radius:2px;padding:1px 3px;'>這裡是被遮住的劇透文字，反白選取才看得到。</span>`},
 {name:'刪除線劃記',desc:'手寫感的一筆劃掉',code:
`<!-- ═══ 劃掉的字 ═══ -->
<span style='display:inline-block;position:relative;white-space:nowrap;'>被劃掉的字<span style='position:absolute;left:-2px;top:45%;width:calc(100% + 4px);height:3px;border-top:2px solid #7a1010;transform:rotate(-1.5deg);border-radius:50%;opacity:0.75;'></span></span>`}
]}
];


/* ═══════════ 3.5 追加預設：部件＋裝飾（全部只用角色介面可用的 div/span/b/br＋inline style）═══════════ */
PARTS.splice(1,0,
{cat:'標題樣式',items:[
 {name:'雙線夾標題',desc:'左右細線夾住標題',code:
`<!-- ═══ 雙線夾標題 ═══ -->
<div style='display:flex;align-items:center;gap:16px;padding:28px 28px 10px;'>
<div style='flex:1;height:1px;background:linear-gradient(90deg,transparent,#b8943f);'></div>
<span style='font-size:20px;letter-spacing:8px;color:#f0b03c;white-space:nowrap;'>章節標題</span>
<div style='flex:1;height:1px;background:linear-gradient(90deg,#b8943f,transparent);'></div>
</div>`},
 {name:'章節編號標題',desc:'大數字＋標題＋英文',code:
`<!-- ═══ 章節編號標題 ═══ -->
<div style='display:flex;align-items:flex-end;gap:14px;padding:30px 28px 14px;border-bottom:1px solid rgba(184,148,63,0.3);'>
<span style='font-family:serif;font-size:56px;line-height:0.85;color:rgba(240,176,60,0.9);font-weight:700;'>01</span>
<div>
<div style='font-size:20px;letter-spacing:4px;color:#e8d5a0;'>第一章標題</div>
<div style='font-size:11px;letter-spacing:4px;color:#8fa0b8;font-family:sans-serif;margin-top:4px;'>CHAPTER ONE</div>
</div>
</div>`},
 {name:'英文襯底大字',desc:'淡淡的大英文墊在標題後',code:
`<!-- ═══ 英文襯底大字標題 ═══ -->
<div style='position:relative;padding:44px 24px 26px;text-align:center;overflow:hidden;'>
<div style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:serif;font-size:72px;font-weight:900;letter-spacing:6px;color:rgba(240,176,60,0.07);white-space:nowrap;'>PROFILE</div>
<div style='position:relative;font-size:24px;letter-spacing:12px;text-indent:12px;color:#f0b03c;'>角色檔案</div>
</div>`},
 {name:'直書標題',desc:'直排的古風標題',code:
`<!-- ═══ 直書標題（writing-mode）═══ -->
<div style='display:flex;justify-content:center;gap:18px;padding:30px 0;'>
<div style='writing-mode:vertical-rl;font-size:26px;letter-spacing:10px;color:#f0b03c;'>月下獨酌</div>
<div style='writing-mode:vertical-rl;font-size:12px;letter-spacing:6px;color:#8fa0b8;padding-top:40px;'>花間一壺酒・獨酌無相親</div>
</div>`},
 {name:'引號金句',desc:'大引號包住一句話',code:
`<!-- ═══ 引號金句 ═══ -->
<div style='position:relative;max-width:560px;margin:24px auto;padding:30px 44px;text-align:center;'>
<div style='position:absolute;top:0;left:6px;font-family:serif;font-size:64px;line-height:1;color:rgba(240,176,60,0.35);'>“</div>
<div style='font-size:18px;line-height:1.9;letter-spacing:2px;color:#e8d5a0;font-style:italic;'>一句很有份量的台詞放在這裡。</div>
<div style='position:absolute;bottom:-10px;right:6px;font-family:serif;font-size:64px;line-height:1;color:rgba(240,176,60,0.35);'>”</div>
<div style='margin-top:12px;font-size:12px;letter-spacing:3px;color:#8fa0b8;font-family:sans-serif;'>—— 角色名</div>
</div>`},
 {name:'印章標題',desc:'方框印章＋標題',code:
`<!-- ═══ 印章標題 ═══ -->
<div style='display:flex;align-items:center;justify-content:center;gap:14px;padding:30px 20px;'>
<span style='display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:2px solid #c83018;border-radius:6px;color:#c83018;font-size:20px;font-weight:900;transform:rotate(-6deg);'>密</span>
<span style='font-size:22px;letter-spacing:8px;color:#e8d5a0;'>機密檔案</span>
</div>`}
]},
{cat:'版面排列',items:[
 {name:'兩欄文字',desc:'左右兩欄，手機自動直排',code:
`<!-- ═══ 兩欄文字 ═══ -->
<div style='display:flex;flex-wrap:wrap;gap:20px;padding:24px 28px;'>
<div style='flex:1 1 220px;'>
<div style='font-size:14px;letter-spacing:3px;color:#c8791f;margin-bottom:8px;'>左欄標題</div>
<div style='font-size:14px;line-height:1.9;color:#d8d2c4;'>左欄的內容文字。</div>
</div>
<div style='flex:1 1 220px;'>
<div style='font-size:14px;letter-spacing:3px;color:#c8791f;margin-bottom:8px;'>右欄標題</div>
<div style='font-size:14px;line-height:1.9;color:#d8d2c4;'>右欄的內容文字。</div>
</div>
</div>`},
 {name:'三格數據',desc:'三個大數字並排',code:
`<!-- ═══ 三格數據 ═══ -->
<div style='display:flex;flex-wrap:wrap;gap:10px;padding:20px 24px;'>
<div style='flex:1 1 120px;text-align:center;padding:16px 8px;background:rgba(240,176,60,0.06);border:1px solid rgba(184,148,63,0.3);border-radius:8px;'><div style='font-size:28px;color:#f0b03c;font-weight:700;'>172</div><div style='font-size:11px;letter-spacing:3px;color:#8fa0b8;margin-top:4px;'>身高 cm</div></div>
<div style='flex:1 1 120px;text-align:center;padding:16px 8px;background:rgba(240,176,60,0.06);border:1px solid rgba(184,148,63,0.3);border-radius:8px;'><div style='font-size:28px;color:#f0b03c;font-weight:700;'>24</div><div style='font-size:11px;letter-spacing:3px;color:#8fa0b8;margin-top:4px;'>年齡</div></div>
<div style='flex:1 1 120px;text-align:center;padding:16px 8px;background:rgba(240,176,60,0.06);border:1px solid rgba(184,148,63,0.3);border-radius:8px;'><div style='font-size:28px;color:#f0b03c;font-weight:700;'>A</div><div style='font-size:11px;letter-spacing:3px;color:#8fa0b8;margin-top:4px;'>血型</div></div>
</div>`},
 {name:'時間軸',desc:'直線＋圓點的事件列表',code:
`<!-- ═══ 時間軸 ═══ -->
<div style='position:relative;margin:24px 28px;padding-left:26px;border-left:2px solid rgba(184,148,63,0.4);'>
<div style='position:relative;margin-bottom:20px;'><div style='position:absolute;left:-33px;top:5px;width:12px;height:12px;border-radius:50%;background:#f0b03c;box-shadow:0 0 10px rgba(240,176,60,0.6);'></div><div style='font-size:12px;letter-spacing:2px;color:#c8791f;'>1998</div><div style='font-size:14px;color:#d8d2c4;margin-top:2px;'>第一個事件</div></div>
<div style='position:relative;margin-bottom:20px;'><div style='position:absolute;left:-33px;top:5px;width:12px;height:12px;border-radius:50%;background:#f0b03c;box-shadow:0 0 10px rgba(240,176,60,0.6);'></div><div style='font-size:12px;letter-spacing:2px;color:#c8791f;'>2010</div><div style='font-size:14px;color:#d8d2c4;margin-top:2px;'>第二個事件</div></div>
<div style='position:relative;'><div style='position:absolute;left:-33px;top:5px;width:12px;height:12px;border-radius:50%;background:#0a0a0d;border:2px solid #f0b03c;'></div><div style='font-size:12px;letter-spacing:2px;color:#c8791f;'>現在</div><div style='font-size:14px;color:#d8d2c4;margin-top:2px;'>正在發生的事</div></div>
</div>`},
 {name:'編號清單',desc:'圓圈數字的條列',code:
`<!-- ═══ 編號清單 ═══ -->
<div style='padding:16px 28px;'>
<div style='display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;'><span style='flex:0 0 26px;height:26px;border-radius:50%;background:#c8791f;color:#0a0a0d;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;'>1</span><span style='font-size:14px;line-height:1.8;color:#d8d2c4;'>第一點內容</span></div>
<div style='display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;'><span style='flex:0 0 26px;height:26px;border-radius:50%;background:#c8791f;color:#0a0a0d;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;'>2</span><span style='font-size:14px;line-height:1.8;color:#d8d2c4;'>第二點內容</span></div>
<div style='display:flex;gap:12px;align-items:flex-start;'><span style='flex:0 0 26px;height:26px;border-radius:50%;background:#c8791f;color:#0a0a0d;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;'>3</span><span style='font-size:14px;line-height:1.8;color:#d8d2c4;'>第三點內容</span></div>
</div>`},
 {name:'左右對話',desc:'兩個角色一來一往',code:
`<!-- ═══ 左右對話 ═══ -->
<div style='padding:16px 20px;font-family:sans-serif;'>
<div style='display:flex;margin-bottom:12px;'><div style='max-width:75%;background:#1e1c24;color:#e5e7eb;padding:10px 14px;border-radius:4px 16px 16px 16px;font-size:14px;line-height:1.7;'><b style='display:block;font-size:11px;color:#8fb4e0;margin-bottom:2px;'>角色 A</b>左邊的台詞</div></div>
<div style='display:flex;justify-content:flex-end;'><div style='max-width:75%;background:#3a2a10;color:#f5e6c4;padding:10px 14px;border-radius:16px 4px 16px 16px;font-size:14px;line-height:1.7;'><b style='display:block;font-size:11px;color:#f0b03c;margin-bottom:2px;text-align:right;'>角色 B</b>右邊的台詞</div></div>
</div>`},
 {name:'圖示＋說明列',desc:'符號開頭的條目',code:
`<!-- ═══ 圖示＋說明列 ═══ -->
<div style='padding:12px 28px;'>
<div style='display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed rgba(184,148,63,0.25);'><span style='font-size:18px;'>🗡</span><div><div style='font-size:14px;color:#f0b03c;'>特技</div><div style='font-size:13px;color:#a8a29a;'>說明文字</div></div></div>
<div style='display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed rgba(184,148,63,0.25);'><span style='font-size:18px;'>❤</span><div><div style='font-size:14px;color:#f0b03c;'>喜歡</div><div style='font-size:13px;color:#a8a29a;'>說明文字</div></div></div>
<div style='display:flex;gap:12px;padding:10px 0;'><span style='font-size:18px;'>✖</span><div><div style='font-size:14px;color:#f0b03c;'>討厭</div><div style='font-size:13px;color:#a8a29a;'>說明文字</div></div></div>
</div>`}
]});
PARTS.find(g=>g.cat==='卡片資料').items.push(
 {name:'能力星等',desc:'★ 評分列',code:
`<!-- ═══ 能力星等 ═══ -->
<div style='padding:14px 28px;font-size:14px;'>
<div style='display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(184,148,63,0.2);'><span style='color:#d8d2c4;letter-spacing:2px;'>力量</span><span style='color:#f0b03c;letter-spacing:3px;'>★★★★<span style='color:#3a3528;'>★</span></span></div>
<div style='display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(184,148,63,0.2);'><span style='color:#d8d2c4;letter-spacing:2px;'>智力</span><span style='color:#f0b03c;letter-spacing:3px;'>★★<span style='color:#3a3528;'>★★★</span></span></div>
<div style='display:flex;justify-content:space-between;padding:6px 0;'><span style='color:#d8d2c4;letter-spacing:2px;'>魅力</span><span style='color:#f0b03c;letter-spacing:3px;'>★★★★★</span></div>
</div>`},
 {name:'票券卡',desc:'虛線撕線的票根',code:
`<!-- ═══ 票券卡 ═══ -->
<div style='display:flex;max-width:520px;margin:24px auto;background:#f3e6c8;color:#3a2a10;border-radius:10px;overflow:hidden;font-family:sans-serif;'>
<div style='flex:1;padding:18px 20px;'><div style='font-size:11px;letter-spacing:3px;color:#8a6a30;'>ADMIT ONE</div><div style='font-size:22px;font-weight:900;letter-spacing:2px;margin:4px 0;'>活動名稱</div><div style='font-size:12px;color:#6a5030;'>2026.10.31 · 20:00</div></div>
<div style='flex:0 0 96px;border-left:2px dashed rgba(58,42,16,0.35);display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;font-size:12px;letter-spacing:4px;background:#e8d5a0;'>NO.0427</div>
</div>`},
 {name:'橫線筆記紙',desc:'有格線的便條紙',code:
`<!-- ═══ 橫線筆記紙 ═══ -->
<div style='max-width:520px;margin:24px auto;padding:14px 24px 20px 44px;background:#fbf6e8 repeating-linear-gradient(to bottom,transparent 0,transparent 31px,rgba(80,120,170,0.25) 31px,rgba(80,120,170,0.25) 32px);border-left:3px double rgba(200,48,24,0.5);color:#3a3024;font-size:15px;line-height:32px;box-shadow:0 6px 18px rgba(0,0,0,0.4);transform:rotate(-0.6deg);'>
今天的筆記寫在這裡。<br>第二行會自動對齊格線。
</div>`},
 {name:'公告欄（警示條紋）',desc:'黃黑斜紋邊條',code:
`<!-- ═══ 公告欄 ═══ -->
<div style='margin:24px 20px;border-radius:6px;overflow:hidden;border:1px solid #f0b03c;'>
<div style='height:12px;background:repeating-linear-gradient(-45deg,#f0b03c 0,#f0b03c 10px,#16120a 10px,#16120a 20px);'></div>
<div style='padding:16px 20px;background:#16120a;'><div style='font-size:15px;font-weight:700;letter-spacing:3px;color:#f0b03c;'>⚠ 注意事項</div><div style='font-size:13px;line-height:1.8;color:#d8d2c4;margin-top:6px;'>公告內容放在這裡。</div></div>
</div>`},
 {name:'手機通知卡',desc:'像跳出來的訊息通知',code:
`<!-- ═══ 手機通知卡 ═══ -->
<div style='max-width:380px;margin:20px auto;display:flex;gap:12px;align-items:center;padding:12px 14px;background:rgba(40,40,48,0.92);border-radius:16px;font-family:sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.5);'>
<div style='flex:0 0 40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#f0b03c,#c8791f);display:flex;align-items:center;justify-content:center;font-size:20px;'>💬</div>
<div style='flex:1;min-width:0;'><div style='display:flex;justify-content:space-between;font-size:12px;color:#9ca3af;'><b style='color:#f3f4f6;'>角色名</b><span>現在</span></div><div style='font-size:13px;color:#e5e7eb;margin-top:2px;'>傳來了一則新訊息……</div></div>
</div>`}
);
PARTS.find(g=>g.cat==='對話與裝飾').items.push(
 {name:'假按鈕列',desc:'看起來像按鈕的標籤',code:
`<!-- ═══ 假按鈕列（純外觀）═══ -->
<div style='display:flex;flex-wrap:wrap;justify-content:center;gap:10px;padding:20px;'>
<span style='padding:8px 20px;border-radius:999px;background:linear-gradient(135deg,#f0b03c,#c8791f);color:#1a1006;font-weight:700;font-size:13px;letter-spacing:2px;box-shadow:0 4px 12px rgba(240,176,60,0.3);'>選項一</span>
<span style='padding:8px 20px;border-radius:999px;border:1px solid #f0b03c;color:#f0b03c;font-size:13px;letter-spacing:2px;'>選項二</span>
</div>`},
 {name:'報紙頭版標題',desc:'報頭＋日期列',code:
`<!-- ═══ 報紙頭版 ═══ -->
<div style='max-width:640px;margin:24px auto;padding:18px 22px;background:#efe6d2;color:#1e1a14;font-family:serif;'>
<div style='text-align:center;font-size:34px;font-weight:900;letter-spacing:6px;border-bottom:3px double #1e1a14;padding-bottom:6px;'>霧港日報</div>
<div style='display:flex;justify-content:space-between;font-size:11px;letter-spacing:2px;padding:4px 0;border-bottom:1px solid #1e1a14;'><span>第 1024 期</span><span>2026 年 9 月 28 日</span><span>晴</span></div>
<div style='font-size:22px;font-weight:700;margin-top:12px;'>頭條標題寫在這裡</div>
<div style='font-size:13px;line-height:1.8;margin-top:6px;'>內文第一段……</div>
</div>`},
 {name:'折角便利貼',desc:'右下折角的小紙條',code:
`<!-- ═══ 折角便利貼 ═══ -->
<div style='position:relative;max-width:260px;margin:24px auto;padding:18px 20px 30px;background:#ffe98a;color:#4a3a10;font-size:14px;line-height:1.8;clip-path:polygon(0 0,100% 0,100% calc(100% - 26px),calc(100% - 26px) 100%,0 100%);transform:rotate(2deg);'>
記得買牛奶！<br>還有貓飼料。
<div style='position:absolute;right:0;bottom:0;width:26px;height:26px;background:linear-gradient(135deg,#d9bf52 50%,transparent 50%);'></div>
</div>`},
 {name:'閃爍提示字',desc:'慢慢閃的小提示',code:
`<!-- ═══ 閃爍提示字 ═══ -->
<div style='text-align:center;padding:14px;'>
<span class='animate__animated animate__flash animate__infinite animate__slower' style='font-size:12px;letter-spacing:4px;color:#f0b03c;font-family:monospace;'>▼ 往下滑繼續閱讀 ▼</span>
</div>`}
);

/* 裝飾：全部用漸層畫（沒有 url），小工具也能用 */
DECOS.find(g=>g.cat.startsWith('漸層過渡')).items.push(
 {name:'四邊暈影', kind:'cover', p:[C('c','顏色','#0a0a0d'),R('w','寬度',5,40,14,'%')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;box-shadow:inset 0 0 ${p.w*4}px ${p.w*2}px ${p.c};'></div>`},
 {name:'斜向光束', kind:'cover', p:[C('c','光色','#f0b03c'),R('a','亮度',5,60,18),R('deg','角度',0,180,115,'°')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(${p.deg}deg,transparent 30%,${rgbaOf(p.c,p.a)} 48%,transparent 66%);'></div>`}
);
DECOS.find(g=>g.cat.startsWith('遮罩')).items.push(
 {name:'雙色光暈', kind:'cover', p:[C('c1','左上色','#c8791f'),C('c2','右下色','#3d5a8a'),R('a','濃度',5,80,30)],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle at 15% 20%,${rgbaOf(p.c1,p.a)},transparent 50%),radial-gradient(circle at 85% 80%,${rgbaOf(p.c2,p.a)},transparent 50%);'></div>`},
 {name:'對角漸層罩', kind:'cover', p:[C('c1','起始色','#241a0e'),C('c2','結束色','#0a0a0d'),R('a','不透明',0,100,60),R('deg','角度',0,360,135,'°')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(${p.deg}deg,${rgbaOf(p.c1,p.a)},${rgbaOf(p.c2,p.a)});'></div>`},
 {name:'底部色帶', kind:'edge', p:[C('c','顏色','#f0b03c'),R('h','高度',2,30,8,'%'),R('a','不透明',10,100,80)],
  b:p=>`<div style='position:absolute;bottom:0;left:0;width:100%;height:${p.h}%;background:${rgbaOf(p.c,p.a)};'></div>`}
);
DECOS.find(g=>g.cat.startsWith('花紋')).items.push(
 {name:'斜條紋', kind:'cover', p:[C('c','條紋色','#f0b03c'),R('a','濃度',2,60,8),R('w','間距',4,40,14,'px')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(45deg,${rgbaOf(p.c,p.a)} 0,${rgbaOf(p.c,p.a)} ${Math.max(1,Math.round(p.w/3))}px,transparent ${Math.max(1,Math.round(p.w/3))}px,transparent ${p.w}px);'></div>`},
 {name:'圓點花紋', kind:'cover', p:[C('c','點色','#f0b03c'),R('a','濃度',3,80,14),R('s','間距',8,48,20,'px')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background-image:radial-gradient(${rgbaOf(p.c,p.a)} 1.5px,transparent 2px);background-size:${p.s}px ${p.s}px;'></div>`},
 {name:'掃描線', kind:'cover', p:[C('c','線色','#000000'),R('a','濃度',5,80,30)],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(to bottom,${rgbaOf(p.c,p.a)} 0,${rgbaOf(p.c,p.a)} 1px,transparent 1px,transparent 3px);'></div>`},
 {name:'方格紙', kind:'cover', p:[C('c','線色','#8fa0b8'),R('a','濃度',3,60,12),R('s','格子',10,60,24,'px')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(${rgbaOf(p.c,p.a)} 1px,transparent 1px),linear-gradient(90deg,${rgbaOf(p.c,p.a)} 1px,transparent 1px);background-size:${p.s}px ${p.s}px;'></div>`},
 {name:'菱格紋', kind:'cover', p:[C('c','紋路色','#f0b03c'),R('a','濃度',3,60,8),R('s','大小',12,60,28,'px')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(45deg,${rgbaOf(p.c,p.a)} 25%,transparent 25%,transparent 75%,${rgbaOf(p.c,p.a)} 75%),linear-gradient(45deg,${rgbaOf(p.c,p.a)} 25%,transparent 25%,transparent 75%,${rgbaOf(p.c,p.a)} 75%);background-size:${p.s}px ${p.s}px;background-position:0 0,${p.s/2}px ${p.s/2}px;'></div>`}
);
DECOS.find(g=>g.cat==='光點／邊框').items.push(
 {name:'呼吸光暈（會動）', kind:'spot', p:[C('c','顏色','#8fb4e0'),R('sz','大小',60,320,140,'px'),R('a','亮度',10,90,40)],
  b:p=>`<div class='animate__animated animate__pulse animate__infinite animate__slower' style='position:absolute;width:${p.sz}px;height:${p.sz}px;border-radius:50%;background:radial-gradient(circle,${rgbaOf(p.c,p.a)} 0%,transparent 70%);'></div>`},
 {name:'閃爍星星', kind:'spot', p:[C('c','顏色','#fff4d0'),R('sz','大小',8,48,18,'px')],
  b:p=>`<div class='animate__animated animate__flash animate__infinite animate__slower' style='position:absolute;font-size:${p.sz}px;line-height:1;color:${p.c};text-shadow:0 0 ${Math.round(p.sz/2)}px ${p.c};'>✦</div>`},
 {name:'雙線框', kind:'cover', p:[C('c','框色','#b8943f'),R('g','內縮',4,24,10,'px')],
  b:p=>`<div style='position:absolute;top:${p.g}px;left:${p.g}px;right:${p.g}px;bottom:${p.g}px;border:3px double ${p.c};'></div>`},
 {name:'虛線框', kind:'cover', p:[C('c','框色','#8fa0b8'),R('g','內縮',4,30,12,'px'),R('r','圓角',0,30,8,'px')],
  b:p=>`<div style='position:absolute;top:${p.g}px;left:${p.g}px;right:${p.g}px;bottom:${p.g}px;border:1.5px dashed ${p.c};border-radius:${p.r}px;'></div>`},
 {name:'角落緞帶', kind:'cover', p:[C('c','緞帶色','#c83018'),C('t','字色','#fff4d0')],
  b:p=>`<div style='position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;'><div style='position:absolute;top:18px;right:-38px;width:150px;padding:4px 0;background:${p.c};color:${p.t};font-size:12px;font-weight:700;letter-spacing:3px;text-align:center;transform:rotate(45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);'>NEW</div></div>`},
 {name:'花飾分隔線', kind:'spot', p:[C('c','顏色','#b8943f'),R('w','寬度',80,400,220,'px')],
  b:p=>`<div style='position:absolute;width:${p.w}px;display:flex;align-items:center;gap:8px;color:${p.c};font-size:12px;'><div style='flex:1;height:1px;background:linear-gradient(90deg,transparent,${p.c});'></div>✦<div style='flex:1;height:1px;background:linear-gradient(90deg,${p.c},transparent);'></div></div>`}
);
DECOS.find(g=>g.cat.startsWith('文字效果')).items.push(
 {name:'金色漸層字', kind:'text', st:{'background':'linear-gradient(180deg,#fff1c4 0%,#f0b03c 55%,#9a6412 100%)','-webkit-background-clip':'text','background-clip':'text','-webkit-text-fill-color':'transparent'}},
 {name:'空心描邊字', kind:'text', st:{'color':'transparent','-webkit-text-stroke':'1px #f0b03c'}},
 {name:'冰藍霓虹', kind:'text', st:{color:'#bfe6ff','text-shadow':'0 0 6px rgba(120,200,255,0.9),0 0 18px rgba(80,160,255,0.6)'}},
 {name:'粉紅霓虹', kind:'text', st:{color:'#ffd0e2','text-shadow':'0 0 6px rgba(255,120,180,0.9),0 0 18px rgba(229,65,122,0.6)'}},
 {name:'復古雙色陰影', kind:'text', st:{color:'#f0b03c','text-shadow':'3px 3px 0 #c83018,6px 6px 0 rgba(0,0,0,0.5)'}},
 {name:'打字機字', kind:'text', st:{'font-family':'monospace','letter-spacing':'2px',color:'#d8d2c4'}},
 {name:'模糊夢境', kind:'text', st:{color:'rgba(232,213,160,0.85)','text-shadow':'0 0 4px rgba(232,213,160,0.8),0 0 12px rgba(232,213,160,0.4)','letter-spacing':'3px'}}
);
