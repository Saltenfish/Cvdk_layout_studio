'use strict';
/* ═══════════ 3.8 裝飾庫重整：放在拼圖上的裝飾，或拼圖之間的銜接 ═══════════ */
(function(){
const OLD=DECOS.flatMap(g=>g.items);
const D=n=>OLD.find(i=>i.name===n);
const FULL="position:absolute;top:0;left:0;width:100%;height:100%;";
const NEWD=[
 {cat:'邊緣與過渡（柔化／剪裁畫布邊緣）',items:[
  D('上緣漸層'),D('下緣漸層'),D('左緣漸層'),D('右緣漸層'),
  {name:'上下雙漸層',kind:'cover',p:[C('c','顏色','#0a0a0d'),R('h','高度',5,45,22,'%')],
   b:p=>`<div style='${FULL}background:linear-gradient(to bottom,${p.c} 0%,transparent ${p.h}%,transparent ${100-p.h}%,${p.c} 100%);'></div>`},
  D('四邊暈影'),
  {name:'底部霧氣',kind:'edge',p:[C('c','霧色','#c8d4e8'),R('a','濃度',5,70,28),R('h','高度',10,60,35,'%')],
   b:p=>`<div style='position:absolute;left:-10%;bottom:0;width:120%;height:${p.h}%;background:radial-gradient(ellipse at 50% 100%,${rgbaOf(p.c,p.a)} 0%,transparent 70%);'></div>`},
  {name:'斜切下緣',kind:'edge',p:[C('c','下一段的底色','#0a0a0d'),R('h','斜度',4,30,12,'%')],
   b:p=>`<div style='position:absolute;left:0;bottom:0;width:100%;height:${p.h}%;background:${p.c};clip-path:polygon(0 100%,100% 0,100% 100%);'></div>`},
  {name:'波浪下緣',kind:'edge',p:[C('c','下一段的底色','#0a0a0d'),R('s','波寬',16,80,36,'px')],
   b:p=>`<div style='position:absolute;left:0;bottom:0;width:100%;height:${Math.round(p.s/2)}px;background:radial-gradient(circle at 50% 100%,${p.c} ${Math.round(p.s/2)-1}px,transparent ${Math.round(p.s/2)}px) 0 0/${p.s}px ${Math.round(p.s/2)}px repeat-x;'></div>`},
  {name:'鋸齒下緣',kind:'edge',p:[C('c','下一段的底色','#0a0a0d'),R('s','齒寬',8,40,18,'px')],
   b:p=>`<div style='position:absolute;left:0;bottom:0;width:100%;height:${Math.round(p.s/2)}px;background:linear-gradient(135deg,transparent 50%,${p.c} 50%) 0 0/${p.s}px ${Math.round(p.s/2)}px repeat-x,linear-gradient(225deg,transparent 50%,${p.c} 50%) 0 0/${p.s}px ${Math.round(p.s/2)}px repeat-x;'></div>`},
  {name:'撕紙下緣',kind:'edge',p:[C('c','紙的顏色','#f3ecdc'),R('h','高度',4,20,8,'%')],
   b:p=>`<div style='position:absolute;left:0;bottom:0;width:100%;height:${p.h}%;background:${p.c};clip-path:polygon(0 40%,6% 70%,11% 35%,18% 62%,24% 30%,31% 58%,37% 40%,44% 72%,50% 34%,57% 60%,63% 28%,70% 66%,76% 38%,83% 64%,89% 32%,95% 60%,100% 42%,100% 100%,0 100%);'></div>`},
  {name:'圓弧下緣',kind:'edge',p:[C('c','下一段的底色','#0a0a0d'),R('h','高度',4,30,10,'%')],
   b:p=>`<div style='position:absolute;left:-10%;bottom:0;width:120%;height:${p.h}%;background:${p.c};border-radius:50% 50% 0 0 / 100% 100% 0 0;'></div>`}
 ]},
 {cat:'光影與色罩（蓋在整塊畫布上）',items:[
  D('暗角遮罩'),D('整片色罩'),D('上下漸層罩'),D('雙色光暈'),D('對角漸層罩'),D('斜向光束'),
  {name:'頂光聚光燈',kind:'cover',p:[C('c','光色','#fff4d8'),R('a','亮度',5,70,26)],
   b:p=>`<div style='${FULL}background:radial-gradient(ellipse 45% 70% at 50% 0%,${rgbaOf(p.c,p.a)},transparent 70%);'></div>`},
  {name:'百葉窗光影',kind:'cover',p:[C('c','光色','#ffe9c0'),R('a','亮度',3,40,12),R('deg','角度',0,180,120,'°')],
   b:p=>`<div style='${FULL}background:repeating-linear-gradient(${p.deg}deg,${rgbaOf(p.c,p.a)} 0 18px,transparent 18px 44px);'></div>`},
  {name:'彩虹薄光',kind:'cover',p:[R('a','濃度',3,40,12)],
   b:p=>`<div style='${FULL}background:conic-gradient(from 200deg at 70% 30%,rgba(255,120,120,${p.a/100}),rgba(255,220,120,${p.a/100}),rgba(120,230,170,${p.a/100}),rgba(120,180,255,${p.a/100}),rgba(200,140,255,${p.a/100}),rgba(255,120,120,${p.a/100}));'></div>`},
  {name:'夕陽色調',kind:'cover',p:[R('a','濃度',5,70,30)],
   b:p=>`<div style='${FULL}background:linear-gradient(180deg,rgba(90,60,140,${p.a/100}),rgba(240,120,90,${p.a/100}) 70%,rgba(255,190,110,${p.a/100}));mix-blend-mode:soft-light;'></div>`},
  {name:'夜色藍調',kind:'cover',p:[C('c','藍色','#1a2a5a'),R('a','濃度',5,80,40)],
   b:p=>`<div style='${FULL}background:${rgbaOf(p.c,p.a)};mix-blend-mode:multiply;'></div>`}
 ]},
 {cat:'花紋底紋',items:[
  D('六邊形花紋'),D('格子花紋'),D('雜訊紋理'),D('斜條紋'),D('圓點花紋'),D('掃描線'),D('方格紙'),D('菱格紋'),
  {name:'橫條紋',kind:'cover',p:[C('c','條紋色','#ffffff'),R('a','濃度',2,40,6),R('s','間距',6,60,20,'px')],
   b:p=>`<div style='${FULL}background:repeating-linear-gradient(to bottom,${rgbaOf(p.c,p.a)} 0 ${Math.round(p.s/2)}px,transparent ${Math.round(p.s/2)}px ${p.s}px);'></div>`},
  {name:'蘇格蘭格紋',kind:'cover',p:[C('c1','主色','#c83018'),C('c2','副色','#1a3a2a'),R('a','濃度',5,60,18)],
   b:p=>`<div style='${FULL}background:repeating-linear-gradient(0deg,${rgbaOf(p.c1,p.a)} 0 10px,transparent 10px 30px),repeating-linear-gradient(90deg,${rgbaOf(p.c2,p.a)} 0 10px,transparent 10px 30px);'></div>`},
  {name:'十字點',kind:'cover',p:[C('c','點色','#ffffff'),R('a','濃度',3,50,10),R('s','間距',10,50,22,'px')],
   b:p=>`<div style='${FULL}background-image:linear-gradient(${rgbaOf(p.c,p.a)} 2px,transparent 2px),linear-gradient(90deg,${rgbaOf(p.c,p.a)} 2px,transparent 2px);background-size:${p.s}px ${p.s}px;background-position:${Math.round(p.s/2)-5}px ${Math.round(p.s/2)-1}px,${Math.round(p.s/2)-1}px ${Math.round(p.s/2)-5}px;'></div>`},
  {name:'同心圓',kind:'cover',p:[C('c','線色','#f0b03c'),R('a','濃度',3,50,10),R('s','間距',8,40,16,'px')],
   b:p=>`<div style='${FULL}background:repeating-radial-gradient(circle at 50% 50%,${rgbaOf(p.c,p.a)} 0 1px,transparent 1px ${p.s}px);'></div>`},
  {name:'星點夜空',kind:'cover',p:[C('c','星色','#ffffff'),R('a','亮度',20,100,70)],
   b:p=>`<div style='${FULL}background-image:radial-gradient(1px 1px at 12% 22%,${rgbaOf(p.c,p.a)},transparent),radial-gradient(1.5px 1.5px at 38% 64%,${rgbaOf(p.c,p.a)},transparent),radial-gradient(1px 1px at 58% 18%,${rgbaOf(p.c,p.a)},transparent),radial-gradient(2px 2px at 78% 44%,${rgbaOf(p.c,p.a)},transparent),radial-gradient(1px 1px at 90% 80%,${rgbaOf(p.c,p.a)},transparent),radial-gradient(1px 1px at 24% 86%,${rgbaOf(p.c,p.a)},transparent);background-size:220px 160px;'></div>`}
 ]},
 {cat:'框線與角飾',items:[
  D('四角金框'),D('發光邊框'),D('雙線框'),D('虛線框'),D('角落緞帶'),
  {name:'內縮細框',kind:'cover',p:[C('c','框色','#e8dcc4'),R('g','內縮',4,40,16,'px'),R('a','濃度',10,100,40)],
   b:p=>`<div style='position:absolute;top:${p.g}px;left:${p.g}px;right:${p.g}px;bottom:${p.g}px;border:1px solid ${rgbaOf(p.c,p.a)};'></div>`},
  {name:'圓角霓虹框',kind:'cover',p:[C('c','光色','#c89aff'),R('r','圓角',4,40,18,'px'),R('g','內縮',2,24,8,'px')],
   b:p=>`<div style='position:absolute;top:${p.g}px;left:${p.g}px;right:${p.g}px;bottom:${p.g}px;border:1.5px solid ${p.c};border-radius:${p.r}px;box-shadow:0 0 10px ${rgbaOf(p.c,60)},inset 0 0 10px ${rgbaOf(p.c,30)};'></div>`},
  {name:'L 形對角',kind:'cover',p:[C('c','線色','#7fc4b0'),R('sz','長度',14,80,40,'px')],
   b:p=>`<div style='${FULL}'><div style='position:absolute;top:10px;left:10px;width:${p.sz}px;height:${p.sz}px;border-top:2px solid ${p.c};border-left:2px solid ${p.c};'></div><div style='position:absolute;bottom:10px;right:10px;width:${p.sz}px;height:${p.sz}px;border-bottom:2px solid ${p.c};border-right:2px solid ${p.c};'></div></div>`},
  {name:'票根打孔邊',kind:'cover',p:[C('c','孔的顏色（=外面底色）','#0e0e10'),R('s','孔距',10,40,18,'px')],
   b:p=>`<div style='${FULL}background:radial-gradient(circle at 0 50%,${p.c} 5px,transparent 5.5px) left/${p.s}px ${p.s}px repeat-y,radial-gradient(circle at 100% 50%,${p.c} 5px,transparent 5.5px) right/${p.s}px ${p.s}px repeat-y;'></div>`},
  {name:'底片齒孔',kind:'cover',p:[C('c','孔色','#e8e8e8'),R('a','濃度',20,100,60)],
   b:p=>`<div style='${FULL}'><div style='position:absolute;top:4px;left:0;width:100%;height:8px;background:repeating-linear-gradient(90deg,${rgbaOf(p.c,p.a)} 0 8px,transparent 8px 18px);'></div><div style='position:absolute;bottom:4px;left:0;width:100%;height:8px;background:repeating-linear-gradient(90deg,${rgbaOf(p.c,p.a)} 0 8px,transparent 8px 18px);'></div></div>`},
  {name:'角落花飾',kind:'cover',p:[C('c','顏色','#e0c890'),R('sz','大小',14,40,22,'px')],
   b:p=>`<div style='${FULL}color:${p.c};font-size:${p.sz}px;line-height:1;'><span style='position:absolute;top:8px;left:10px;'>❦</span><span style='position:absolute;top:8px;right:10px;transform:scaleX(-1);'>❦</span><span style='position:absolute;bottom:8px;left:10px;transform:scaleY(-1);'>❦</span><span style='position:absolute;bottom:8px;right:10px;transform:scale(-1);'>❦</span></div>`}
 ]},
 {cat:'點綴小物（放在畫布任何位置）',items:[
  D('金色光暈球'),D('呼吸光暈（會動）'),D('閃爍星星'),
  {name:'紙膠帶',kind:'spot',p:[C('c','膠帶色','#f4d58a'),R('w','長度',50,200,100,'px'),R('deg','角度',-45,45,-12,'°')],
   b:p=>`<div style='position:absolute;width:${p.w}px;height:22px;background:${rgbaOf(p.c,70)};transform:rotate(${p.deg}deg);box-shadow:0 1px 3px rgba(0,0,0,0.2);'></div>`},
  {name:'圖釘',kind:'spot',p:[C('c','釘頭色','#e04a4a'),R('sz','大小',10,30,16,'px')],
   b:p=>`<div style='position:absolute;width:${p.sz}px;height:${p.sz}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffffff 0,${p.c} 35%,${p.c} 70%,rgba(0,0,0,0.5) 100%);box-shadow:2px 3px 4px rgba(0,0,0,0.45);'></div>`},
  {name:'圓形印章',kind:'spot',p:[C('c','印泥色','#c83018'),R('sz','大小',50,140,80,'px'),R('deg','角度',-40,40,-14,'°')],
   b:p=>`<div style='position:absolute;width:${p.sz}px;height:${p.sz}px;border:3px double ${rgbaOf(p.c,85)};border-radius:50%;color:${rgbaOf(p.c,85)};font-size:${Math.round(p.sz/5.5)}px;font-weight:900;letter-spacing:2px;display:flex;align-items:center;justify-content:center;transform:rotate(${p.deg}deg);'>已確認</div>`},
  {name:'愛心徽章',kind:'spot',p:[C('c','顏色','#e5417a'),R('sz','大小',16,60,28,'px')],
   b:p=>`<div style='position:absolute;font-size:${p.sz}px;line-height:1;color:${p.c};text-shadow:0 2px 6px rgba(0,0,0,0.35);'>♥</div>`},
  {name:'驚嘆泡泡',kind:'spot',p:[C('c','泡泡色','#ffd84a'),R('sz','大小',24,70,38,'px')],
   b:p=>`<div style='position:absolute;width:${p.sz}px;height:${p.sz}px;border-radius:50% 50% 50% 8%;background:${p.c};color:#2a1a00;font-weight:900;font-size:${Math.round(p.sz*0.55)}px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);'>!</div>`},
  {name:'手繪箭頭',kind:'spot',p:[C('c','顏色','#f5efe3'),R('sz','大小',20,90,42,'px'),R('deg','角度',-180,180,20,'°')],
   b:p=>`<div style='position:absolute;font-size:${p.sz}px;line-height:1;color:${p.c};transform:rotate(${p.deg}deg);'>↝</div>`},
  {name:'月亮',kind:'spot',p:[C('c','月色','#fff1c4'),R('sz','大小',20,120,48,'px')],
   b:p=>`<div style='position:absolute;width:${p.sz}px;height:${p.sz}px;border-radius:50%;box-shadow:inset ${Math.round(p.sz/4)}px ${Math.round(-p.sz/8)}px 0 0 ${p.c};filter:drop-shadow(0 0 8px ${rgbaOf(p.c,60)});'></div>`},
  {name:'價格標籤',kind:'spot',p:[C('c','標籤色','#e8dcc4'),C('t','字色','#3a2a14')],
   b:p=>`<div style='position:absolute;padding:4px 12px 4px 16px;background:${p.c};color:${p.t};font:bold 12px/1.4 monospace;clip-path:polygon(10px 0,100% 0,100% 100%,10px 100%,0 50%);transform:rotate(-8deg);'>$ 000</div>`},
  {name:'小便條角',kind:'spot',p:[C('c','紙色','#ffe98a'),R('w','寬度',60,200,110,'px')],
   b:p=>`<div style='position:absolute;width:${p.w}px;padding:8px 10px;background:${p.c};color:#4a3a10;font-size:12px;box-shadow:0 4px 10px rgba(0,0,0,0.35);transform:rotate(3deg);'>小便條</div>`}
 ]},
 {cat:'分隔與銜接（插在兩個區塊之間）',items:[
  {name:'花飾分隔線',kind:'flow',p:[C('c','顏色','#b8943f'),R('w','寬度',30,100,60,'%')],
   b:p=>`<div style='display:flex;align-items:center;gap:10px;width:${p.w}%;margin:18px auto;color:${p.c};font-size:12px;'><div style='flex:1;height:1px;background:linear-gradient(90deg,transparent,${p.c});'></div>✦<div style='flex:1;height:1px;background:linear-gradient(90deg,${p.c},transparent);'></div></div>`},
  {name:'三星分隔',kind:'flow',p:[C('c','顏色','#e0c890'),R('g','間距',2,16,8,'px')],
   b:p=>`<div style='text-align:center;padding:14px 0;color:${p.c};font-size:12px;letter-spacing:${p.g}px;'>✦ ✦ ✦</div>`},
  {name:'章節花紋',kind:'flow',p:[C('c','顏色','#c8a070'),R('sz','大小',14,40,22,'px')],
   b:p=>`<div style='text-align:center;padding:12px 0;color:${p.c};font-size:${p.sz}px;'>❦</div>`},
  {name:'剪裁虛線',kind:'flow',p:[C('c','顏色','#8a8478')],
   b:p=>`<div style='display:flex;align-items:center;gap:6px;margin:16px 20px;color:${p.c};font-size:14px;'>✂<div style='flex:1;border-top:1.5px dashed ${p.c};'></div></div>`},
  {name:'雙色漸層過場',kind:'flow',p:[C('c1','上一段底色','#0a0a0d'),C('c2','下一段底色','#1f2a36'),R('h','高度',20,200,80,'px')],
   b:p=>`<div style='height:${p.h}px;background:linear-gradient(to bottom,${p.c1},${p.c2});'></div>`},
  {name:'斜切銜接',kind:'flow',p:[C('c1','上一段底色','#0a0a0d'),C('c2','下一段底色','#1f2a36'),R('h','高度',16,120,48,'px')],
   b:p=>`<div style='height:${p.h}px;background:linear-gradient(to bottom right,${p.c1} 49.5%,${p.c2} 50%);'></div>`},
  {name:'波浪銜接',kind:'flow',p:[C('c1','上一段底色','#0a0a0d'),C('c2','下一段底色','#1f2a36'),R('s','波寬',20,90,44,'px')],
   b:p=>`<div style='height:${Math.round(p.s/2)}px;background:radial-gradient(circle at 50% 0,${p.c1} ${Math.round(p.s/2)-1}px,${p.c2} ${Math.round(p.s/2)}px) 0 0/${p.s}px ${Math.round(p.s/2)}px repeat-x;'></div>`},
  {name:'星星連線',kind:'flow',p:[C('c','顏色','#cfd8ff')],
   b:p=>`<div style='text-align:center;padding:12px 0;color:${p.c};font-size:13px;letter-spacing:4px;'>·˚ ✧ ˚· ✦ ·˚ ✧ ˚·</div>`},
  {name:'繼續閱讀提示',kind:'flow',p:[C('c','顏色','#9aa6b4')],
   b:p=>`<div style='display:flex;align-items:center;gap:10px;margin:18px 24px;color:${p.c};font-size:10px;letter-spacing:4px;'><div style='flex:1;height:1px;background:${p.c};opacity:0.4;'></div>CONTINUE<div style='flex:1;height:1px;background:${p.c};opacity:0.4;'></div></div>`},
  {name:'圓點頁碼',kind:'flow',p:[C('c','亮點色','#f0b03c'),C('d','暗點色','#4a4640')],
   b:p=>`<div style='text-align:center;padding:12px 0;font-size:10px;letter-spacing:6px;'><span style='color:${p.c};'>●</span><span style='color:${p.d};'>●●●</span></div>`},
  {name:'粗細雙線',kind:'flow',p:[C('c','顏色','#b8943f')],
   b:p=>`<div style='margin:16px 24px;border-top:3px solid ${p.c};border-bottom:1px solid ${p.c};height:4px;'></div>`}
 ]}
];
DECOS.splice(0,DECOS.length,...NEWD.map(g=>({cat:g.cat,items:g.items.filter(Boolean)})));
})();
