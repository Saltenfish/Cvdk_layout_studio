'use strict';
const WTPL=[
 N('天空時段場景條','漸層天空＋雲和海裡的鯨魚',`<!-- {{TIME}} 填 DAWN / DAY / DUSK / NIGHT -->
<div style='font-family:sans-serif;max-width:460px;margin:0 auto;'>
<div style='display:flex;justify-content:space-between;font-size:11px;letter-spacing:1px;color:#9a8f80;padding:0 4px 5px;'><span>{{PLACE}}</span><span>{{DATE}} · <b>{{CLOCK}}</b></span></div>
<div style='--T_DAWN:linear-gradient(180deg,#3a3f7a 0%,#b48ab8 50%,#f4c2b0 100%);--T_DAY:linear-gradient(180deg,#9ad0ff 0%,#dff0ff 70%,#f6f1e0 100%);--T_DUSK:linear-gradient(180deg,#5a3f8a 0%,#e86a7a 55%,#ffb070 100%);--T_NIGHT:linear-gradient(180deg,#060a1e 0%,#1a2150 60%,#39407a 100%);position:relative;height:140px;border-radius:6px;overflow:hidden;background:var(--T_{{TIME}},var(--T_DAY));box-shadow:0 6px 16px rgba(0,0,0,0.25);'>
<div style='position:absolute;top:18px;left:26px;width:28px;height:28px;border-radius:50%;background:#fffbe8;box-shadow:0 0 18px 6px rgba(255,250,220,0.55);'></div>
<div style='position:absolute;top:26px;left:0;right:0;height:30px;overflow:hidden;'><div style='width:calc(100% + 3em);text-align:right;font-size:26px;color:rgba(255,255,255,0.85);animation:slideOutLeft 26s linear infinite;'>☁</div></div>
<div style='position:absolute;top:52px;left:0;right:0;height:26px;overflow:hidden;'><div style='width:calc(100% + 3em);text-align:right;font-size:18px;color:rgba(255,255,255,0.7);animation:slideOutLeft 18s linear -7s infinite;'>☁</div></div>
<div style='position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(180deg,#2f5a7a,#172e40);border-top:1px solid rgba(255,255,255,0.25);'></div>
<div style='position:absolute;left:0;right:0;bottom:24px;height:34px;overflow:hidden;'><div style='width:calc(100% + 3em);margin-left:-3em;font-size:28px;line-height:34px;animation:slideOutRight 20s linear infinite;'>🐋</div></div>
</div>
<div style='text-align:center;font-size:12px;font-style:italic;color:#7a7266;padding-top:6px;'>{{LINE}}</div>
</div>`),
 N('觀測紀錄終端','終端機風的狀態紀錄',`<div style='font-family:monospace;font-size:12px;background:#0b0f0e;border:1px solid #1f3a33;border-radius:4px;padding:8px 10px;color:#9fe6c8;'>
<div style='display:flex;justify-content:space-between;color:#4fbf94;letter-spacing:2px;'><span>[ 觀測紀錄 ]</span><span>D{{DAY}} {{CLOCK}}</span></div>
<div style='height:1px;background:#1f3a33;margin:5px 0;'></div>
<div>好感值：<b style='color:#ff8fb4;'>{{AFF}}</b></div>
<div>目前穿著：<span style='color:#e8f5ee;'>{{OUTFIT}}</span></div>
<div>所在位置：<span style='color:#e8f5ee;'>{{LOCATION}}</span></div>
<div style='margin-top:4px;color:#4fbf94;'>&gt; {{NOTE}}<span style='animation:flash 1.2s infinite;'>_</span></div>
</div>`),
 N('雙人著裝動作卡','角色與你的服裝＋動作',`<div style='font-family:sans-serif;font-size:12.5px;display:flex;flex-direction:column;gap:6px;'>
<div style='font-size:11px;color:#9a948a;'>🕰 {{DATE_TIME}}　📍 {{LOCATION}}</div>
<div style='display:flex;gap:8px;'>
<div style='flex:1;padding:8px 10px;border-radius:10px;background:linear-gradient(160deg,#2a2233,#1a1620);border:1px solid rgba(229,65,122,0.3);'><b style='color:#ff8fb4;'>{{char}}</b><div style='color:#d8cfe0;margin-top:3px;'>👗 {{CHAR_OUTFIT}}</div><div style='color:#a89cb4;'>✋ {{CHAR_ACT}}</div></div>
<div style='flex:1;padding:8px 10px;border-radius:10px;background:linear-gradient(160deg,#1f2a33,#161c22);border:1px solid rgba(143,180,224,0.3);'><b style='color:#8fb4e0;'>{{user}}</b><div style='color:#d0dce8;margin-top:3px;'>👕 {{USER_OUTFIT}}</div><div style='color:#98a8b8;'>✋ {{USER_ACT}}</div></div>
</div>
</div>`),
 N('案件評估卡','三條評估數值＋印章',`<div style='position:relative;font-family:serif;background:#ece4d2;color:#2a2418;border-radius:4px;padding:12px 14px;border:1px solid #bba880;'>
<div style='font-size:10px;letter-spacing:4px;color:#7a6a4a;'>CASE FILE · {{CASE_NO}}</div>
<div style='font-size:15px;font-weight:700;margin:2px 0 8px;'>{{SUBJECT}}</div>
<div style='font-size:11px;'>信任 {{TRUST}}%</div><div style='height:5px;background:#d4c8ae;margin:2px 0 6px;'><div style='width:{{TRUST}}%;height:100%;background:#4a6a8a;'></div></div>
<div style='font-size:11px;'>懷疑 {{SUSPECT}}%</div><div style='height:5px;background:#d4c8ae;margin:2px 0 6px;'><div style='width:{{SUSPECT}}%;height:100%;background:#a8402a;'></div></div>
<div style='font-size:11px;'>警戒 {{ALERT}}%</div><div style='height:5px;background:#d4c8ae;margin:2px 0 4px;'><div style='width:{{ALERT}}%;height:100%;background:#2a2418;'></div></div>
<div style='position:absolute;top:10px;right:12px;border:2px solid rgba(168,64,42,0.75);color:rgba(168,64,42,0.85);font-size:11px;font-weight:900;padding:2px 6px;transform:rotate(8deg);letter-spacing:2px;'>{{STAMP}}</div>
</div>`),
 N('酒館夜談卡','服裝＋動作＋內心話',`<div style='font-family:serif;background:radial-gradient(circle at 20% 0%,rgba(200,120,60,0.25),transparent 60%),#1a1210;border:1px solid rgba(200,140,80,0.4);border-radius:10px;padding:12px 14px;color:#e8d8c0;font-size:13px;'>
<div style='display:flex;justify-content:space-between;font-size:11px;color:#b08a60;'><span>🍷 {{PLACE}}</span><span>{{CLOCK}}</span></div>
<div style='font-size:16px;letter-spacing:3px;color:#f0c890;margin:6px 0;'>{{char}}</div>
<div>✦ {{CHAR_OUTFIT}}</div><div>✦ {{CHAR_ACT}}</div>
<div style='margin-top:8px;padding:6px 10px;border-left:2px solid #c87838;font-style:italic;color:#d8b894;background:rgba(200,120,60,0.08);'>「{{THOUGHT}}」</div>
</div>`),
 N('店鋪經營日誌','天數＋金錢＋存貨表',`<div style='font-family:sans-serif;background:#fbf6ea;color:#3a3024;border:2px solid #3a3024;border-radius:6px;padding:10px 12px;font-size:12px;'>
<div style='text-align:center;font-weight:900;letter-spacing:4px;font-size:14px;'>［{{SHOP}}］營業日誌</div>
<div style='display:flex;gap:6px;margin:8px 0;text-align:center;'>
<div style='flex:1;border:1px solid #3a3024;padding:3px;'><small>DAY</small><div style='font-weight:700;'>{{DAY}}</div></div>
<div style='flex:1;border:1px solid #3a3024;padding:3px;'><small>LV</small><div style='font-weight:700;'>{{LV}}</div></div>
<div style='flex:1;border:1px solid #3a3024;padding:3px;'><small>MONEY</small><div style='font-weight:700;'>{{MONEY}}</div></div>
</div>
<table style='width:100%;border-collapse:collapse;'>
<tr style='background:#3a3024;color:#fbf6ea;'><th style='padding:3px 6px;text-align:left;'>今日菜單</th><th style='padding:3px 6px;'>售出</th></tr>
<tr><td style='padding:3px 6px;border-bottom:1px dashed #b8a888;'>{{DISH_A}}</td><td style='text-align:center;border-bottom:1px dashed #b8a888;'>{{SOLD_A}}</td></tr>
<tr><td style='padding:3px 6px;border-bottom:1px dashed #b8a888;'>{{DISH_B}}</td><td style='text-align:center;border-bottom:1px dashed #b8a888;'>{{SOLD_B}}</td></tr>
<tr><td style='padding:3px 6px;'>{{DISH_C}}</td><td style='text-align:center;'>{{SOLD_C}}</td></tr>
</table>
<div style='margin-top:6px;font-size:11px;'>📦 倉庫：{{STORAGE}}　🪑 座位：{{SEATS}}</div>
</div>`),
 N('星際終端分頁','四個折疊分頁的終端機',`<div style='font-family:monospace;font-size:12px;background:#07090f;border:1px solid #2a3a66;border-radius:6px;padding:8px 10px;color:#a8c0ff;'>
<div style='display:flex;justify-content:space-between;align-items:center;'><span><span style='display:inline-block;width:6px;height:6px;border-radius:50%;background:#4f8cff;animation:ping 1.4s infinite;'></span> DATA LINK</span><span>💰 {{CREDITS}}</span></div>
<div style='color:#6f86c8;margin:4px 0 6px;'>📍 {{SECTOR}}</div>
<details style='border-top:1px solid #1d2744;'><summary style='cursor:pointer;padding:4px 0;color:#d8e2ff;'>[01] 航點紀錄</summary><div style='padding:2px 0 6px;'>{{WAYPOINT}}</div></details>
<details style='border-top:1px solid #1d2744;'><summary style='cursor:pointer;padding:4px 0;color:#d8e2ff;'>[02] 深度掃描</summary><div style='padding:2px 0 6px;'>{{SCAN}}</div></details>
<details style='border-top:1px solid #1d2744;'><summary style='cursor:pointer;padding:4px 0;color:#d8e2ff;'>[03] 物品估價</summary><div style='padding:2px 0 6px;'>{{PRICE}}</div></details>
<details style='border-top:1px solid #1d2744;'><summary style='cursor:pointer;padding:4px 0;color:#d8e2ff;'>[04] 燃料狀態</summary><div style='padding:2px 0 6px;'>FUEL {{FUEL}}%</div></details>
</div>`),
 N('樂園日報看板','日期天氣＋今日活動',`<div style='font-family:sans-serif;border-radius:12px;overflow:hidden;background:#fff7ef;color:#4a3a4a;font-size:12.5px;box-shadow:0 4px 12px rgba(0,0,0,0.2);'>
<div style='background:repeating-linear-gradient(90deg,#ff8fb4 0 18px,#ffd0e2 18px 36px);height:8px;'></div>
<div style='padding:10px 12px;'>
<div style='display:flex;justify-content:space-between;font-weight:700;'><span>🎡 {{DATE}}</span><span>{{WEATHER}}</span></div>
<div style='margin-top:6px;'>🎪 今日活動：<b style='color:#e5417a;'>{{EVENT}}</b></div>
<div>🚫 暫停設施：{{CLOSED}}</div>
<div style='margin-top:6px;padding:6px 8px;border-radius:8px;background:#ffe9f1;'>📍 {{user}} 在 {{LOCATION}}</div>
</div>
</div>`),
 N('理智與記憶追蹤','第幾天＋理智條＋碎片',`<div style='font-family:serif;background:#0f0d10;border:1px solid #3a2a38;border-radius:6px;padding:10px 12px;color:#d8c8d4;font-size:12.5px;'>
<div style='display:flex;justify-content:space-between;color:#a07898;font-size:11px;letter-spacing:2px;'><span>第 {{DAY}} 天 · {{PHASE}}</span><span>{{CLOCK}}</span></div>
<div style='margin:8px 0 2px;display:flex;justify-content:space-between;'><span>理智</span><span>{{SAN}}/100</span></div>
<div style='height:6px;background:#2a1f28;border-radius:3px;overflow:hidden;'><div style='width:{{SAN}}%;height:100%;background:linear-gradient(90deg,#6a2a4a,#c86a98);'></div></div>
<div style='margin-top:8px;'>記憶碎片 <b style='color:#e8c0dc;letter-spacing:3px;'>{{FRAG}}</b></div>
<div style='margin-top:6px;font-style:italic;color:#8a7084;animation:pulse 5s infinite;'>……{{WHISPER}}</div>
</div>`),
 N('牛皮紙手帳','橫線紙＋中間線圈的雙頁手帳',`<div style='position:relative;background:#d6b48c;border:3px solid #6b4a2c;outline:3px solid #3a2616;border-radius:4px;color:#2a1a0e;font-family:serif;font-size:12.5px;box-shadow:0 6px 16px rgba(30,15,5,0.45);overflow:hidden;'>
<div style='position:absolute;top:0;bottom:0;left:16px;right:16px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 25px,rgba(60,36,18,0.22) 25px,rgba(60,36,18,0.22) 26px);'></div>
<div style='position:absolute;top:0;bottom:0;left:50%;width:2px;margin-left:-1px;background:rgba(60,36,18,0.35);'></div>
<div style='position:absolute;top:10px;bottom:10px;left:50%;width:10px;margin-left:-5px;background:radial-gradient(circle,#3a2616 2px,transparent 2.5px) 0 0/10px 22px repeat-y;'></div>
<div style='position:relative;display:flex;gap:40px;padding:14px 26px;line-height:26px;'>
<div style='flex:1;'><div style='font-weight:700;letter-spacing:2px;'>{{DATE}}</div><div>天氣：{{WEATHER}}</div><div>心情：{{MOOD}}</div></div>
<div style='flex:1;'><div style='font-weight:700;'>今天的事</div><div>{{NOTE}}</div><div style='color:#7a3a1a;'>☐ {{TODO}}</div></div>
</div>
</div>`),
 N('多角色好感表','四個角色的好感條',`<div style='font-family:sans-serif;font-size:12px;background:#15131a;border-radius:10px;padding:10px 12px;color:#ddd6e8;'>
<div style='letter-spacing:3px;color:#c8a0e0;margin-bottom:6px;'>♥ RELATIONSHIP</div>
<div style='display:flex;align-items:center;gap:6px;margin:4px 0;'><span style='flex:0 0 56px;'>角色 A</span><div style='flex:1;height:6px;background:#2a2533;border-radius:3px;'><div style='width:{{AFF_A}}%;height:100%;background:#e5417a;border-radius:3px;'></div></div><span style='flex:0 0 28px;text-align:right;'>{{AFF_A}}</span></div>
<div style='display:flex;align-items:center;gap:6px;margin:4px 0;'><span style='flex:0 0 56px;'>角色 B</span><div style='flex:1;height:6px;background:#2a2533;border-radius:3px;'><div style='width:{{AFF_B}}%;height:100%;background:#f0b03c;border-radius:3px;'></div></div><span style='flex:0 0 28px;text-align:right;'>{{AFF_B}}</span></div>
<div style='display:flex;align-items:center;gap:6px;margin:4px 0;'><span style='flex:0 0 56px;'>角色 C</span><div style='flex:1;height:6px;background:#2a2533;border-radius:3px;'><div style='width:{{AFF_C}}%;height:100%;background:#8fb4e0;border-radius:3px;'></div></div><span style='flex:0 0 28px;text-align:right;'>{{AFF_C}}</span></div>
<div style='display:flex;align-items:center;gap:6px;margin:4px 0;'><span style='flex:0 0 56px;'>角色 D</span><div style='flex:1;height:6px;background:#2a2533;border-radius:3px;'><div style='width:{{AFF_D}}%;height:100%;background:#79bd8e;border-radius:3px;'></div></div><span style='flex:0 0 28px;text-align:right;'>{{AFF_D}}</span></div>
</div>`),
 N('任務清單','任務名＋目標＋進度',`<div style='font-family:sans-serif;font-size:12.5px;background:linear-gradient(160deg,#1c1a12,#12110c);border:1px solid rgba(240,176,60,0.4);border-radius:8px;padding:10px 12px;color:#e8e0cc;'>
<div style='color:#f0b03c;font-weight:700;letter-spacing:2px;'>📜 {{QUEST}}</div>
<div style='margin:4px 0 8px;color:#b8ae98;'>目標：{{GOAL}}</div>
<div style='height:8px;border:1px solid rgba(240,176,60,0.5);border-radius:4px;overflow:hidden;'><div style='width:{{PROG}}%;height:100%;background:repeating-linear-gradient(45deg,#f0b03c 0 6px,#c8791f 6px 12px);'></div></div>
<div style='display:flex;justify-content:space-between;font-size:11px;color:#9a9078;margin-top:4px;'><span>進度 {{PROG}}%</span><span>獎勵：{{REWARD}}</span></div>
</div>`),
 N('天氣季節卡','大圖示＋溫度＋季節',`<div style='display:flex;align-items:center;gap:12px;font-family:sans-serif;background:linear-gradient(135deg,#dff1fb,#fdf3e2);border-radius:14px;padding:10px 14px;color:#2a3a48;'>
<div style='font-size:36px;line-height:1;'>{{WX_ICON}}</div>
<div style='flex:1;'><div style='font-size:20px;font-weight:700;'>{{TEMP}}°</div><div style='font-size:12px;color:#5a6a78;'>{{WEATHER}} · {{SEASON}}</div></div>
<div style='text-align:right;font-size:11px;color:#5a6a78;'>{{DATE}}<br>{{PLACE}}</div>
</div>`),
 N('骰子判定結果','大數字＋判定標籤',`<div style='text-align:center;font-family:sans-serif;background:#101418;border:1px solid #2c3a48;border-radius:10px;padding:10px;color:#d8e0e8;'>
<div style='font-size:11px;letter-spacing:3px;color:#7890a8;'>TURN {{TURN}} · 🎲 D20</div>
<div style='font-size:40px;font-weight:900;color:#f0b03c;line-height:1.2;animation:rubberBand 1s;'>{{DICE}}</div>
<div style='display:inline-block;padding:2px 12px;border-radius:999px;background:rgba(240,176,60,0.15);border:1px solid #f0b03c;color:#f0b03c;font-size:12px;font-weight:700;'>{{RESULT}}</div>
<div style='font-size:12px;color:#98a8b8;margin-top:6px;'>{{EFFECT}}</div>
</div>`),
 N('背包物品欄','物品列表＋負重條',`<div style='font-family:sans-serif;font-size:12.5px;background:#1a1712;border-radius:8px;padding:10px 12px;color:#e6dcc8;border:1px solid #3a3226;'>
<div style='display:flex;justify-content:space-between;'><b style='letter-spacing:2px;color:#d8b878;'>🎒 背包</b><span>💰 {{GOLD}}</span></div>
<div style='margin:6px 0;padding:6px 8px;background:rgba(255,255,255,0.04);border-radius:6px;line-height:1.8;'>{{INVENTORY}}</div>
<div style='font-size:11px;color:#9a9078;'>負重 {{WEIGHT}}%</div>
<div style='height:4px;background:#2e2a22;border-radius:2px;'><div style='width:{{WEIGHT}}%;height:100%;background:#d8b878;border-radius:2px;'></div></div>
</div>`),
 N('手機訊息視窗','像跳出的聊天訊息',`<div style='font-family:sans-serif;max-width:360px;margin:0 auto;background:rgba(36,36,44,0.95);border-radius:18px;padding:10px 12px;color:#e8e8f0;box-shadow:0 6px 18px rgba(0,0,0,0.4);'>
<div style='display:flex;justify-content:space-between;font-size:11px;color:#9a9aa8;'><span>💬 MESSAGE</span><span>{{CLOCK}}</span></div>
<div style='display:flex;gap:8px;margin-top:6px;'>
<div style='flex:0 0 34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#8fb4e0,#5a7ab8);display:flex;align-items:center;justify-content:center;font-weight:700;'>✉</div>
<div style='flex:1;min-width:0;'><b>{{SENDER}}</b><div style='margin-top:2px;padding:6px 10px;background:#3a3a48;border-radius:4px 14px 14px 14px;font-size:13px;'>{{MSG}}</div></div>
</div>
</div>`),
 N('車站時刻看板','出發地→目的地＋狀態',`<div style='font-family:monospace;background:#111;border:3px solid #2a2a2a;border-radius:6px;padding:8px 10px;color:#ffc933;font-size:13px;'>
<div style='display:flex;justify-content:space-between;font-size:10px;color:#8a7a3a;letter-spacing:2px;'><span>DEPARTURES</span><span>{{CLOCK}}</span></div>
<div style='display:flex;align-items:center;gap:8px;margin:6px 0;font-size:15px;letter-spacing:2px;'><span>{{FROM}}</span><span style='color:#8a7a3a;'>▶▶</span><span>{{TO}}</span></div>
<div style='display:flex;justify-content:space-between;font-size:12px;'><span>ETA {{ETA}}</span><span><span style='display:inline-block;width:7px;height:7px;border-radius:50%;background:#3fdc6a;animation:flash 2s infinite;'></span> {{STATUS}}</span></div>
</div>`),
 N('心跳緊張儀表','跳動的心＋緊張度',`<div style='display:flex;align-items:center;gap:12px;font-family:sans-serif;background:#1a0f14;border:1px solid rgba(229,65,122,0.35);border-radius:10px;padding:10px 12px;color:#f0d8e0;'>
<div style='font-size:30px;color:#e5417a;animation:heartBeat 1.3s infinite;'>♥</div>
<div style='flex:1;'><div style='display:flex;justify-content:space-between;font-size:12px;'><span>緊張度</span><span>{{PULSE}} bpm</span></div>
<div style='height:6px;background:#3a2028;border-radius:3px;margin-top:4px;'><div style='width:{{TENSION}}%;height:100%;background:linear-gradient(90deg,#f0b03c,#e5417a);border-radius:3px;'></div></div>
<div style='font-size:11px;color:#b890a0;margin-top:4px;'>{{REASON}}</div></div>
</div>`),
 N('劇場幕間字卡','章節＋標題＋摘要',`<div style='text-align:center;font-family:serif;background:#0c0b0d;border-top:1px solid #6a5a3a;border-bottom:1px solid #6a5a3a;padding:14px 12px;color:#e8dcc0;'>
<div style='font-size:10px;letter-spacing:6px;color:#9a8660;'>— ACT {{ACT}} —</div>
<div class='animate__animated animate__fadeIn animate__slow' style='font-size:20px;letter-spacing:6px;margin:6px 0;color:#f0d8a0;'>{{TITLE}}</div>
<div style='font-size:12px;font-style:italic;color:#a89c84;'>{{SUMMARY}}</div>
</div>`),
 N('選項分歧卡','提問＋三個選項',`<div style='font-family:sans-serif;background:#12151c;border-radius:10px;padding:10px 12px;color:#dde3ee;font-size:13px;'>
<div style='font-weight:700;margin-bottom:8px;'>❓ {{PROMPT}}</div>
<div style='padding:6px 10px;margin:4px 0;border-radius:6px;border:1px solid #3a4a66;background:#182032;'>A · {{OPT_A}}</div>
<div style='padding:6px 10px;margin:4px 0;border-radius:6px;border:1px solid #3a4a66;background:#182032;'>B · {{OPT_B}}</div>
<div style='padding:6px 10px;margin:4px 0;border-radius:6px;border:1px solid #3a4a66;background:#182032;'>C · {{OPT_C}}</div>
</div>`),
 N('夜行公路地平線','星空＋地平線＋遠方燈火',`<div style='position:relative;height:120px;border-radius:10px;overflow:hidden;background:linear-gradient(180deg,#05070f 0%,#141c3a 70%,#2a2440 100%);font-family:sans-serif;'>
<div style='position:absolute;inset:0;background-image:radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 60% 20%,#fff,transparent),radial-gradient(1.5px 1.5px at 80% 40%,#ffe9b0,transparent),radial-gradient(1px 1px at 35% 55%,#cfd8ff,transparent);animation:pulse 6s infinite;'></div>
<div style='position:absolute;left:0;right:0;bottom:0;height:34px;background:#0a0a12;'></div>
<div style='position:absolute;left:0;right:0;bottom:30px;height:14px;overflow:hidden;'><div style='width:calc(100% + 2em);text-align:right;font-size:10px;color:#ffcf6a;letter-spacing:6px;animation:slideOutLeft 9s linear infinite;'>• • •</div></div>
<div style='position:absolute;left:12px;bottom:8px;font-size:11px;color:#8a92b8;letter-spacing:2px;'>{{ROAD}} · 剩 {{DIST}} km</div>
<div style='position:absolute;right:12px;top:10px;font-size:11px;color:#cfd8ff;'>{{CLOCK}}</div>
</div>`)
];
