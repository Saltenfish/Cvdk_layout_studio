'use strict';
/* 初始化 */
setTheme(load('cd-theme')||load('cdb3_theme')||'dark');
curW=load('cdb3_w')||'780';
mode=MODES[load('cdb3_mode')]?load('cdb3_mode'):'info';
applyModeUI();
codeEl.value=docs[mode].code; undoStack=docs[mode].undo; redoStack=docs[mode].redo;
htmlSaves=loadHtmlSaves(); renderHtmlSaves();
setCodeOpen(load('cdb3_codeopen')==='1');
openDrawer(DRAWER_INFO[load('cdb3_tab')]?load('cdb3_tab'):'props');
if(load('cdb3_drawer')==='0') setDrawer(false);
refreshColor(); renderRecent(); renderCssLib(); buildFormGrid(); renderWSlots();
parseAndRender();
try{ syncAssetsFromModel(); }catch(e){}
