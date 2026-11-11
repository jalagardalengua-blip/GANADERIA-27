/* ===================== MÓVIL (Android e iOS) =====================
   - Botón de pantalla completa solo donde el navegador lo permite (en iPhone Safari no existe).
   - Panel de tareas de la finca plegado en pantallas bajas (móvil tumbado) para no tapar el campo.
   - Sin zoom automático de iOS al tocar un buscador o un desplegable.
   - Vibración breve en los momentos grandes en los móviles que la admiten (Android). */
const MOVIL={tactil:matchMedia('(pointer:coarse)').matches,fs:!!(document.fullscreenEnabled||document.webkitFullscreenEnabled)};
document.documentElement.classList.toggle('tactil',MOVIL.tactil);document.documentElement.classList.toggle('sinFS',!MOVIL.fs);
function vibra(ms){try{if(MOVIL.tactil&&navigator.vibrate&&!(typeof ACC!=='undefined'&&ACC.calma))navigator.vibrate(ms)}catch(e){}}
if(typeof enter3D==='function'){const _e3=enter3D;enter3D=function(){if(innerHeight<520&&W3.tasksMin===undefined)W3.tasksMin=true;return _e3.apply(this,arguments)}}
if(typeof tossPlayer==='function'){const _tp=tossPlayer;tossPlayer=function(){vibra([60,40,120]);return _tp.apply(this,arguments)}}
