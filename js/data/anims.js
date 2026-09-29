'use strict';
/* ═══════════ 1. 資料：動畫清單 ═══════════ */
const ANIMS = [
 {g:'強調・持續（可加無限）',list:[
  ['bounce','彈跳'],['flash','閃爍'],['pulse','脈動'],['rubberBand','橡皮筋'],['shakeX','左右抖動'],['shakeY','上下抖動'],['headShake','搖頭'],['swing','搖擺'],['tada','登場強調'],['wobble','晃動'],['jello','果凍'],['heartBeat','心跳']]},
 {g:'淡入',list:[
  ['fadeIn','淡入'],['fadeInDown','從上淡入'],['fadeInDownBig','從上遠處淡入'],['fadeInLeft','從左淡入'],['fadeInLeftBig','從左遠處淡入'],['fadeInRight','從右淡入'],['fadeInRightBig','從右遠處淡入'],['fadeInUp','從下淡入'],['fadeInUpBig','從下遠處淡入'],['fadeInTopLeft','從左上淡入'],['fadeInTopRight','從右上淡入'],['fadeInBottomLeft','從左下淡入'],['fadeInBottomRight','從右下淡入']]},
 {g:'淡出',list:[
  ['fadeOut','淡出'],['fadeOutDown','往下淡出'],['fadeOutDownBig','往下遠處淡出'],['fadeOutLeft','往左淡出'],['fadeOutLeftBig','往左遠處淡出'],['fadeOutRight','往右淡出'],['fadeOutRightBig','往右遠處淡出'],['fadeOutUp','往上淡出'],['fadeOutUpBig','往上遠處淡出'],['fadeOutTopLeft','往左上淡出'],['fadeOutTopRight','往右上淡出'],['fadeOutBottomLeft','往左下淡出'],['fadeOutBottomRight','往右下淡出']]},
 {g:'滑入',list:[['slideInDown','從上滑入'],['slideInLeft','從左滑入'],['slideInRight','從右滑入'],['slideInUp','從下滑入']]},
 {g:'滑出',list:[['slideOutDown','往下滑出'],['slideOutLeft','往左滑出（跑馬燈用）'],['slideOutRight','往右滑出'],['slideOutUp','往上滑出']]},
 {g:'縮放進場',list:[['zoomIn','放大進場'],['zoomInDown','從上放大'],['zoomInLeft','從左放大'],['zoomInRight','從右放大'],['zoomInUp','從下放大']]},
 {g:'縮放退場',list:[['zoomOut','縮小退場'],['zoomOutDown','往下縮小'],['zoomOutLeft','往左縮小'],['zoomOutRight','往右縮小'],['zoomOutUp','往上縮小']]},
 {g:'彈跳進場',list:[['bounceIn','彈跳進場'],['bounceInDown','從上彈入'],['bounceInLeft','從左彈入'],['bounceInRight','從右彈入'],['bounceInUp','從下彈入']]},
 {g:'彈跳退場',list:[['bounceOut','彈跳退場'],['bounceOutDown','往下彈出'],['bounceOutLeft','往左彈出'],['bounceOutRight','往右彈出'],['bounceOutUp','往上彈出']]},
 {g:'後退進場',list:[['backInDown','從上後退進場'],['backInLeft','從左後退進場'],['backInRight','從右後退進場'],['backInUp','從下後退進場']]},
 {g:'後退退場',list:[['backOutDown','往下後退退場'],['backOutLeft','往左後退退場'],['backOutRight','往右後退退場'],['backOutUp','往上後退退場']]},
 {g:'翻轉',list:[['flip','翻一圈'],['flipInX','X 軸翻入'],['flipInY','Y 軸翻入'],['flipOutX','X 軸翻出'],['flipOutY','Y 軸翻出']]},
 {g:'光速',list:[['lightSpeedInRight','從右光速進場'],['lightSpeedInLeft','從左光速進場'],['lightSpeedOutRight','往右光速退場'],['lightSpeedOutLeft','往左光速退場']]},
 {g:'旋轉進場',list:[['rotateIn','旋轉進場'],['rotateInDownLeft','左下旋入'],['rotateInDownRight','右下旋入'],['rotateInUpLeft','左上旋入'],['rotateInUpRight','右上旋入']]},
 {g:'旋轉退場',list:[['rotateOut','旋轉退場'],['rotateOutDownLeft','左下旋出'],['rotateOutDownRight','右下旋出'],['rotateOutUpLeft','左上旋出'],['rotateOutUpRight','右上旋出']]},
 {g:'特殊',list:[['hinge','門鉸脫落'],['jackInTheBox','驚喜盒'],['rollIn','滾動進場'],['rollOut','滾動退場']]}
];
