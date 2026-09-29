'use strict';
const LIB_WIDGET=[
 {cat:'外框與標題',items:[
  WB('外框（深色）','一切的起點',`<div style='background:linear-gradient(160deg,#17151c,#0e0d12);border:1px solid rgba(240,176,60,0.35);border-radius:10px;padding:12px 14px;color:#dcd6ca;font-family:sans-serif;font-size:13px;line-height:1.6;'>
內容放這裡
</div>`),
  WB('外框（紙張）','米色紙＋細框',`<div style='background:#f3ecdc;border:1px solid #cdbb98;border-radius:6px;padding:12px 14px;color:#3a3226;font-family:serif;font-size:13px;line-height:1.7;box-shadow:0 3px 10px rgba(0,0,0,0.25);'>
內容放這裡
</div>`),
  WB('外框（霓虹）','發光的邊框',`<div style='background:#0b0a12;border:1px solid #c89aff;border-radius:12px;padding:12px 14px;color:#e8e0ff;font-family:sans-serif;font-size:13px;box-shadow:0 0 12px rgba(200,154,255,0.45),inset 0 0 10px rgba(200,154,255,0.15);'>
內容放這裡
</div>`),
  WB('外框（終端機）','黑底綠字等寬',`<div style='background:#070b09;border:1px solid #1f4a38;border-radius:4px;padding:10px 12px;color:#8fe6b8;font-family:monospace;font-size:12px;line-height:1.7;'>
&gt; 內容放這裡
</div>`),
  WB('外框（毛玻璃）','半透明柔光卡',`<div style='background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.18);border-radius:16px;padding:12px 14px;color:#f0f0f5;font-family:sans-serif;font-size:13px;box-shadow:0 8px 20px rgba(0,0,0,0.25);'>
內容放這裡
</div>`),
  WB('標題列（名稱＋時間）','左名字右時間',`<div style='display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding-bottom:6px;margin-bottom:8px;border-bottom:1px solid rgba(240,176,60,0.3);font-family:sans-serif;'>
<span style='font-weight:700;letter-spacing:3px;color:#f0b03c;'>{{char}}</span>
<span style='font-size:11px;color:#9a948a;'>{{DATE}} · {{TIME}}</span>
</div>`),
  WB('置中標題＋雙線','標題兩邊有線',`<div style='display:flex;align-items:center;gap:8px;margin:4px 0 8px;font-size:12px;letter-spacing:4px;color:#e0c890;'><span style='flex:1;height:1px;background:rgba(224,200,144,0.4);'></span>{{TITLE}}<span style='flex:1;height:1px;background:rgba(224,200,144,0.4);'></span></div>`),
  WB('雙行標題','大名字＋小副標',`<div style='margin-bottom:8px;'><div style='font-size:16px;font-weight:700;letter-spacing:2px;color:#f5efe3;'>{{char}}</div><div style='font-size:10px;letter-spacing:3px;color:#8a8478;'>{{SUBTITLE}}</div></div>`),
  WB('小標籤標題','細字母間距小標',`<div style='font-size:10px;letter-spacing:4px;color:#8fa0b8;font-family:monospace;margin:8px 0 4px;'>▸ SECTION</div>`),
  WB('漸層分隔線','細緻的分隔',`<div style='height:1px;margin:8px 0;background:linear-gradient(90deg,transparent,rgba(240,176,60,0.6),transparent);'></div>`)
 ]},
 {cat:'數值與進度',items:[
  WB('數值條','名稱＋條＋數字',`<div style='display:flex;align-items:center;gap:8px;margin:4px 0;font-family:sans-serif;font-size:12px;'>
<span style='flex:0 0 42px;color:#9a948a;'>HP</span>
<div style='flex:1;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;'><div style='width:{{HP}}%;height:100%;background:linear-gradient(90deg,#2ea877,#9ed8c0);border-radius:4px;'></div></div>
<span style='flex:0 0 34px;text-align:right;color:#9ed8c0;'>{{HP}}</span>
</div>`),
  WB('細線數值條','極細的一條線',`<div style='margin:6px 0;font-family:sans-serif;'>
<div style='display:flex;justify-content:space-between;font-size:11px;color:#9a948a;'><span>好感</span><span style='color:#e5417a;'>{{AFF}}%</span></div>
<div style='height:2px;background:rgba(255,255,255,0.1);margin-top:3px;'><div style='width:{{AFF}}%;height:100%;background:#e5417a;box-shadow:0 0 6px #e5417a;'></div></div>
</div>`),
  WB('格子數值條','一格一格的分段條',`<div style='margin:6px 0;font-size:11px;color:#9a948a;'>體力 {{STA}}%
<div style='position:relative;height:10px;margin-top:3px;background:rgba(255,255,255,0.08);'><div style='width:{{STA}}%;height:100%;background:#ffd36a;'></div><div style='position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0,transparent calc(10% - 2px),#0e0d12 calc(10% - 2px),#0e0d12 10%);'></div></div>
</div>`),
  WB('等級＋經驗條','LV 徽章＋EXP',`<div style='display:flex;align-items:center;gap:8px;margin:6px 0;font-size:11px;'>
<span style='flex:0 0 auto;padding:1px 7px;border-radius:4px;background:#7ab8ff;color:#0b1a2e;font-weight:700;'>LV {{LV}}</span>
<div style='flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;'><div style='width:{{EXP}}%;height:100%;background:#7ab8ff;border-radius:3px;'></div></div>
<span style='color:#9ab8d8;'>{{EXP}}%</span>
</div>`),
  WB('雙向拉鋸條','左右兩邊的比例',`<div style='margin:6px 0;font-size:11px;'>
<div style='display:flex;justify-content:space-between;color:#9a948a;'><span>理性</span><span>感性</span></div>
<div style='height:8px;background:#e5417a;border-radius:4px;overflow:hidden;margin-top:3px;'><div style='width:{{LOGIC}}%;height:100%;background:#7ab8ff;'></div></div>
</div>`),
  WB('三格大數字','三個數值並排',`<div style='display:flex;gap:6px;margin:6px 0;font-family:sans-serif;text-align:center;'>
<div style='flex:1;padding:6px 4px;background:rgba(255,255,255,0.04);border-radius:6px;'><div style='font-size:10px;color:#8a8478;letter-spacing:2px;'>DAY</div><div style='font-size:18px;font-weight:700;color:#f0b03c;'>{{DAY}}</div></div>
<div style='flex:1;padding:6px 4px;background:rgba(255,255,255,0.04);border-radius:6px;'><div style='font-size:10px;color:#8a8478;letter-spacing:2px;'>LV</div><div style='font-size:18px;font-weight:700;color:#f0b03c;'>{{LV}}</div></div>
<div style='flex:1;padding:6px 4px;background:rgba(255,255,255,0.04);border-radius:6px;'><div style='font-size:10px;color:#8a8478;letter-spacing:2px;'>GOLD</div><div style='font-size:18px;font-weight:700;color:#f0b03c;'>{{GOLD}}</div></div>
</div>`),
  WB('大百分比','超大數字＋%',`<div style='text-align:center;margin:6px 0;'><span style='font-size:34px;font-weight:900;color:#ff8fb4;'>{{AFF}}</span><span style='font-size:14px;color:#c88aa4;'>%</span><div style='font-size:10px;letter-spacing:3px;color:#8a8478;'>AFFECTION</div></div>`),
  WB('金錢顯示','硬幣＋金額',`<div style='display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:rgba(255,211,106,0.12);border:1px solid rgba(255,211,106,0.5);font-size:12px;color:#ffd36a;'>🪙 {{MONEY}}</div>`),
  WB('溫度計條','直立的量表',`<div style='display:flex;align-items:flex-end;gap:8px;margin:6px 0;height:70px;'>
<div style='position:relative;width:14px;height:100%;border-radius:7px;background:rgba(255,255,255,0.08);overflow:hidden;'><div style='position:absolute;left:0;right:0;bottom:0;height:{{HEAT}}%;background:linear-gradient(0deg,#ff8a3c,#ffd36a);'></div></div>
<div style='font-size:11px;color:#c8b8a0;'>熱度<br><b style='font-size:15px;color:#ffb46a;'>{{HEAT}}</b></div>
</div>`),
  WB('百分比徽章','圓角膠囊數字',`<span style='display:inline-block;padding:1px 9px;border-radius:999px;background:rgba(229,65,122,0.15);border:1px solid rgba(229,65,122,0.5);color:#ff8fb4;font-size:11px;font-family:monospace;'>♥ {{AFF}}%</span>`)
 ]},
 {cat:'資訊列與標籤',items:[
  WB('圖示資訊列','📍 地點這種一行',`<div style='display:flex;gap:8px;align-items:baseline;margin:3px 0;font-size:12.5px;'><span>📍</span><span style='flex:0 0 52px;color:#8a8478;'>地點</span><span style='color:#e8e2d6;'>{{LOCATION}}</span></div>`),
  WB('時間地點列','一行放日期時間地點',`<div style='display:flex;flex-wrap:wrap;gap:10px;font-size:11.5px;color:#b8b2a6;margin:4px 0;'><span>📅 {{DATE}}</span><span>🕰 {{TIME}}</span><span>📍 {{LOCATION}}</span></div>`),
  WB('天氣列','天氣圖示＋溫度',`<div style='display:flex;align-items:center;gap:8px;margin:4px 0;font-size:12.5px;color:#dfe8f0;'><span style='font-size:18px;'>{{WX_ICON}}</span><span>{{WEATHER}}</span><span style='margin-left:auto;color:#9ab8d0;'>{{TEMP}}°</span></div>`),
  WB('兩欄資訊格','兩個欄位左右並排',`<div style='display:flex;gap:8px;margin:6px 0;font-size:12px;'>
<div style='flex:1;padding:6px 8px;border-left:2px solid #8fb4e0;background:rgba(143,180,224,0.06);'><div style='font-size:10px;color:#8fa0b8;letter-spacing:2px;'>WEATHER</div><div style='color:#e5e9f0;'>{{WEATHER}}</div></div>
<div style='flex:1;padding:6px 8px;border-left:2px solid #f0b03c;background:rgba(240,176,60,0.06);'><div style='font-size:10px;color:#b8a070;letter-spacing:2px;'>MOOD</div><div style='color:#f5ecd8;'>{{MOOD}}</div></div>
</div>`),
  WB('三欄資訊格','三個小格並排',`<div style='display:flex;gap:4px;margin:6px 0;font-size:11px;text-align:center;'>
<div style='flex:1;padding:4px;border:1px solid rgba(255,255,255,0.12);border-radius:4px;'><div style='color:#8a8478;'>欄位一</div><div style='color:#f0ece2;'>{{FIELD_A}}</div></div>
<div style='flex:1;padding:4px;border:1px solid rgba(255,255,255,0.12);border-radius:4px;'><div style='color:#8a8478;'>欄位二</div><div style='color:#f0ece2;'>{{FIELD_B}}</div></div>
<div style='flex:1;padding:4px;border:1px solid rgba(255,255,255,0.12);border-radius:4px;'><div style='color:#8a8478;'>欄位三</div><div style='color:#f0ece2;'>{{FIELD_C}}</div></div>
</div>`),
  WB('鍵值清單','名稱：值的清單（dl）',`<dl style='margin:6px 0;font-size:12px;line-height:1.8;'><div style='display:flex;gap:10px;'><dt style='flex:0 0 40px;color:#8a8478;'>職業</dt><dd style='margin:0;color:#e8e2d6;'>{{JOB}}</dd></div><div style='display:flex;gap:10px;'><dt style='flex:0 0 40px;color:#8a8478;'>所屬</dt><dd style='margin:0;color:#e8e2d6;'>{{GROUP}}</dd></div></dl>`),
  WB('標籤列','一排小標籤',`<div style='display:flex;flex-wrap:wrap;gap:5px;margin:6px 0;'>
<span style='padding:1px 8px;border:1px solid rgba(240,176,60,0.45);border-radius:3px;font-size:11px;color:#e0c890;'>{{TAG_A}}</span><span style='padding:1px 8px;border:1px solid rgba(240,176,60,0.45);border-radius:3px;font-size:11px;color:#e0c890;'>{{TAG_B}}</span><span style='padding:1px 8px;border:1px solid rgba(240,176,60,0.45);border-radius:3px;font-size:11px;color:#e0c890;'>{{TAG_C}}</span>
</div>`),
  WB('警告列','紅色提醒一行',`<div style='margin:6px 0;padding:5px 9px;border-radius:4px;background:rgba(224,74,74,0.12);border:1px solid rgba(224,74,74,0.45);color:#ff9a9a;font-size:12px;'>⚠ {{WARNING}}</div>`),
  WB('內心話引言','斜體＋左側色條',`<blockquote style='margin:6px 0;padding:4px 10px;border-left:2px solid rgba(229,65,122,0.6);font-style:italic;font-size:12.5px;color:#d8c8d0;'>「{{THOUGHT}}」</blockquote>`),
  WB('底部小字備註','灰色的小註解',`<div style='margin-top:8px;font-size:10.5px;color:#7a746a;text-align:right;'>※ {{NOTE}}</div>`)
 ]},
 {cat:'角色狀態',items:[
  WB('角色狀態小卡','名字＋服裝＋動作',`<div style='padding:8px 10px;margin:6px 0;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);font-size:12.5px;'>
<div style='font-weight:700;color:#f0b03c;margin-bottom:2px;'>{{char}}</div>
<div><span style='color:#8a8478;'>👕 </span>{{CHAR_OUTFIT}}</div>
<div><span style='color:#8a8478;'>✋ </span>{{CHAR_ACT}}</div>
</div>`),
  WB('雙人對照列','角色／使用者左右對照',`<div style='display:flex;gap:6px;margin:6px 0;font-size:12px;'>
<div style='flex:1;padding:6px 8px;border-radius:6px;background:rgba(240,176,60,0.07);'><b style='color:#f0b03c;'>{{char}}</b><div style='color:#d8d2c4;'>{{CHAR_ACT}}</div></div>
<div style='flex:1;padding:6px 8px;border-radius:6px;background:rgba(143,180,224,0.07);'><b style='color:#8fb4e0;'>{{user}}</b><div style='color:#d8d2c4;'>{{USER_ACT}}</div></div>
</div>`),
  WB('情緒表情列','大表情＋情緒名',`<div style='display:flex;align-items:center;gap:8px;margin:6px 0;'><span style='font-size:24px;'>{{EMOJI}}</span><div style='font-size:12px;'><div style='color:#8a8478;'>現在的情緒</div><div style='color:#f5efe3;font-weight:700;'>{{EMOTION}}</div></div></div>`),
  WB('服裝欄','上衣／下身／配件',`<div style='margin:6px 0;font-size:12px;line-height:1.8;'><div style='color:#c8a0e0;letter-spacing:2px;font-size:10.5px;'>OUTFIT</div><div>上身｜{{TOP}}</div><div>下身｜{{BOTTOM}}</div><div>配件｜{{ACCESSORY}}</div></div>`),
  WB('當前動作欄','手勢圖示＋動作',`<div style='margin:6px 0;padding:6px 10px;border-radius:6px;background:rgba(127,196,176,0.08);font-size:12.5px;color:#dcece6;'>✋ {{ACTION}}</div>`),
  WB('內心獨白雲','虛線雲朵框',`<div style='margin:6px 0;padding:8px 12px;border:1.5px dashed rgba(200,160,255,0.5);border-radius:18px;font-size:12px;font-style:italic;color:#e0d4ff;text-align:center;'>（{{THOUGHT}}）</div>`),
  WB('關係標籤','兩人之間的關係',`<div style='display:flex;align-items:center;justify-content:center;gap:8px;margin:6px 0;font-size:12px;'><b style='color:#f0b03c;'>{{char}}</b><span style='padding:1px 8px;border-radius:999px;background:rgba(229,65,122,0.15);color:#ff8fb4;'>{{RELATION}}</span><b style='color:#8fb4e0;'>{{user}}</b></div>`),
  WB('體力＋心情雙條','兩條並排的狀態',`<div style='display:flex;gap:10px;margin:6px 0;font-size:11px;color:#9a948a;'>
<div style='flex:1;'>體力<div style='height:5px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:2px;'><div style='width:{{STA}}%;height:100%;background:#8ae0a8;border-radius:3px;'></div></div></div>
<div style='flex:1;'>心情<div style='height:5px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:2px;'><div style='width:{{MOOD_V}}%;height:100%;background:#ffd36a;border-radius:3px;'></div></div></div>
</div>`),
  WB('NPC 小卡','配角的一行狀態',`<div style='display:flex;align-items:center;gap:8px;margin:4px 0;padding:5px 8px;border-radius:6px;background:rgba(255,255,255,0.03);font-size:12px;'><span style='width:22px;height:22px;border-radius:50%;background:#3a3a48;display:inline-flex;align-items:center;justify-content:center;font-size:11px;'>N</span><b style='color:#c8c0e8;'>{{NPC}}</b><span style='color:#9a948a;'>{{NPC_ACT}}</span></div>`),
  WB('位置追蹤','每個人現在在哪',`<div style='margin:6px 0;font-size:12px;line-height:1.8;'><div>📍 {{char}}｜{{CHAR_LOC}}</div><div>📍 {{user}}｜{{USER_LOC}}</div></div>`)
 ]},
 {cat:'折疊與表格',items:[
  WB('折疊區塊','點開才看到（一定是收合）',`<details style='margin:6px 0;border:1px solid rgba(255,255,255,0.1);border-radius:6px;'>
<summary style='cursor:pointer;padding:5px 9px;font-size:12px;color:#f0b03c;'>詳細資料</summary>
<div style='padding:4px 10px 8px;font-size:12px;color:#cfc9bd;'>{{DETAIL}}</div>
</details>`),
  WB('多段折疊','三個可以分別點開的段落',`<div style='margin:6px 0;font-size:12px;'>
<details style='border-top:1px solid rgba(255,255,255,0.1);'><summary style='cursor:pointer;padding:4px 0;color:#e0c890;'>第一段</summary><div style='padding:0 0 6px;'>{{PART_A}}</div></details>
<details style='border-top:1px solid rgba(255,255,255,0.1);'><summary style='cursor:pointer;padding:4px 0;color:#e0c890;'>第二段</summary><div style='padding:0 0 6px;'>{{PART_B}}</div></details>
<details style='border-top:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);'><summary style='cursor:pointer;padding:4px 0;color:#e0c890;'>第三段</summary><div style='padding:0 0 6px;'>{{PART_C}}</div></details>
</div>`),
  WB('摘要折疊','一行摘要，點開看全文',`<details style='margin:6px 0;'><summary style='cursor:pointer;font-size:12px;color:#cfc9bd;list-style:none;'>📝 {{SUMMARY}} <span style='color:#8a8478;'>（展開）</span></summary><div style='margin-top:4px;padding:6px 8px;background:rgba(255,255,255,0.04);border-radius:4px;font-size:12px;'>{{FULL_TEXT}}</div></details>`),
  WB('小表格','兩欄表格',`<table style='width:100%;border-collapse:collapse;font-size:12px;margin:6px 0;'>
<tr style='color:#f0b03c;'><th style='text-align:left;padding:3px 6px;border-bottom:1px solid rgba(240,176,60,0.4);'>項目</th><th style='text-align:right;padding:3px 6px;border-bottom:1px solid rgba(240,176,60,0.4);'>數量</th></tr>
<tr><td style='padding:3px 6px;'>{{ITEM_A}}</td><td style='text-align:right;padding:3px 6px;'>{{QTY_A}}</td></tr>
<tr><td style='padding:3px 6px;'>{{ITEM_B}}</td><td style='text-align:right;padding:3px 6px;'>{{QTY_B}}</td></tr>
</table>`),
  WB('行程表','時間＋事件',`<table style='width:100%;border-collapse:collapse;font-size:12px;margin:6px 0;'>
<tr><td style='padding:3px 6px;color:#9ab8d0;width:60px;'>09:00</td><td style='padding:3px 6px;'>{{PLAN_A}}</td></tr>
<tr style='background:rgba(255,255,255,0.03);'><td style='padding:3px 6px;color:#9ab8d0;'>13:00</td><td style='padding:3px 6px;'>{{PLAN_B}}</td></tr>
<tr><td style='padding:3px 6px;color:#9ab8d0;'>19:00</td><td style='padding:3px 6px;'>{{PLAN_C}}</td></tr>
</table>`),
  WB('排名表','第一名到第三名',`<table style='width:100%;border-collapse:collapse;font-size:12px;margin:6px 0;'>
<tr><td style='padding:3px 6px;'>🥇</td><td style='padding:3px 6px;'>{{RANK_1}}</td></tr>
<tr><td style='padding:3px 6px;'>🥈</td><td style='padding:3px 6px;'>{{RANK_2}}</td></tr>
<tr><td style='padding:3px 6px;'>🥉</td><td style='padding:3px 6px;'>{{RANK_3}}</td></tr>
</table>`),
  WB('對照表','兩人數值比較',`<table style='width:100%;border-collapse:collapse;font-size:12px;margin:6px 0;text-align:center;'>
<tr style='color:#9a948a;'><th></th><th style='color:#f0b03c;'>{{char}}</th><th style='color:#8fb4e0;'>{{user}}</th></tr>
<tr><td style='color:#9a948a;'>體力</td><td>{{C_STA}}</td><td>{{U_STA}}</td></tr>
<tr><td style='color:#9a948a;'>好感</td><td>{{C_AFF}}</td><td>{{U_AFF}}</td></tr>
</table>`),
  WB('待辦清單','☐ 開頭的清單',`<ul style='margin:6px 0;padding:0;list-style:none;font-size:12px;line-height:1.8;'><li>☐ {{TODO_A}}</li><li>☐ {{TODO_B}}</li><li>☑ <s style='color:#7a746a;'>{{DONE}}</s></li></ul>`),
  WB('日誌列表','編號的紀錄',`<ol style='margin:6px 0;padding-left:18px;font-size:12px;line-height:1.8;color:#d8d2c4;'><li>{{LOG_A}}</li><li>{{LOG_B}}</li><li>{{LOG_C}}</li></ol>`),
  WB('預覽代碼框','等寬字的小框（pre）',`<pre style='margin:6px 0;padding:6px 8px;background:#0a0a0e;border-radius:4px;font-size:11px;color:#9fe6c8;white-space:pre-wrap;'>{{CODE}}</pre>`)
 ]},
 {cat:'場景與動態',items:[
  WB('移動物件軌道','任何符號從左移到右（可換）',`<div style='position:relative;height:30px;overflow:hidden;margin:6px 0;border-bottom:1px dashed rgba(255,255,255,0.2);'>
<div style='width:calc(100% + 2.5em);margin-left:-2.5em;font-size:20px;line-height:30px;animation:slideOutRight 12s linear infinite;'>⛵</div>
</div>`),
  WB('反向移動軌道','從右移到左',`<div style='position:relative;height:30px;overflow:hidden;margin:6px 0;'>
<div style='width:calc(100% + 2.5em);text-align:right;font-size:18px;line-height:30px;animation:slideOutLeft 16s linear infinite;'>☁</div>
</div>`),
  WB('時段天空色帶','依 {{TIME}} 換顏色',`<div style='--T_DAWN:linear-gradient(180deg,#3a3f7a,#e8a0a8);--T_DAY:linear-gradient(180deg,#9ad0ff,#f2f6ff);--T_DUSK:linear-gradient(180deg,#5a3f8a,#ff9a6a);--T_NIGHT:linear-gradient(180deg,#060a1e,#2a3060);height:36px;border-radius:6px;background:var(--T_{{TIME}},var(--T_DAY));'></div>`),
  WB('下雨','一直往下落的雨點',`<div style='position:relative;height:40px;overflow:hidden;margin:6px 0;border-radius:6px;background:linear-gradient(180deg,#2a3440,#1a2028);'>
<div style='position:absolute;left:10%;top:0;font-size:12px;color:#9ec8e8;animation:slideOutDown 1.2s linear infinite;'>╱</div>
<div style='position:absolute;left:35%;top:0;font-size:12px;color:#9ec8e8;animation:slideOutDown 1s linear -0.4s infinite;'>╱</div>
<div style='position:absolute;left:60%;top:0;font-size:12px;color:#9ec8e8;animation:slideOutDown 1.3s linear -0.8s infinite;'>╱</div>
<div style='position:absolute;left:85%;top:0;font-size:12px;color:#9ec8e8;animation:slideOutDown 1.1s linear -0.2s infinite;'>╱</div>
</div>`),
  WB('飄雪','慢慢落下的雪花',`<div style='position:relative;height:44px;overflow:hidden;margin:6px 0;border-radius:6px;background:linear-gradient(180deg,#27304a,#3c4668);'>
<div style='position:absolute;left:15%;top:0;color:#fff;font-size:11px;animation:slideOutDown 4s linear infinite;'>❄</div>
<div style='position:absolute;left:45%;top:0;color:#fff;font-size:9px;animation:slideOutDown 5s linear -2s infinite;'>❄</div>
<div style='position:absolute;left:75%;top:0;color:#fff;font-size:12px;animation:slideOutDown 4.5s linear -1s infinite;'>❄</div>
</div>`),
  WB('星空閃爍','一閃一閃的小星星',`<div style='position:relative;height:44px;border-radius:6px;background:#070a18;overflow:hidden;margin:6px 0;'>
<span style='position:absolute;left:12%;top:10px;color:#fff;font-size:9px;animation:flash 3s infinite;'>✦</span>
<span style='position:absolute;left:40%;top:22px;color:#ffe9b0;font-size:7px;animation:flash 4s -1s infinite;'>✦</span>
<span style='position:absolute;left:68%;top:8px;color:#cfd8ff;font-size:10px;animation:flash 3.5s -2s infinite;'>✦</span>
<span style='position:absolute;left:88%;top:26px;color:#fff;font-size:7px;animation:flash 5s infinite;'>✦</span>
</div>`),
  WB('閃爍提示點','一直閃的小點',`<span style='display:inline-block;width:7px;height:7px;border-radius:50%;background:#2ea877;box-shadow:0 0 6px #2ea877;animation:ping 1.2s infinite;'></span>`),
  WB('旋轉載入','轉圈圈的符號',`<span style='display:inline-block;animation:spin 1.5s linear infinite;color:#7ab8ff;'>◌</span>`),
  WB('跳動愛心','心跳的愛心圖示',`<span style='display:inline-block;color:#e5417a;animation:heartBeat 1.3s infinite;'>♥</span>`),
  WB('警示閃條','紅黃斜紋的閃動條',`<div style='height:8px;margin:6px 0;border-radius:4px;background:repeating-linear-gradient(45deg,#ffd36a 0 8px,#2a2010 8px 16px);animation:flash 2.5s infinite;'></div>`)
 ]}
];
