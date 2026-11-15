/* ===================== FESTEJOS DE CORRO · SIN TIRONES EN EL MÓVIL =====================
   1) Paso fijo: aunque el móvil vaya a pocos fotogramas, la res, la soga y los emboladors avanzan en pasos
      de 1/30 s como mucho. Antes, con un fotograma lento, la res daba saltos de más de un metro y podía
      quedarse enganchada en el pilón o meterse en una fachada.
   2) Luces: como mucho 4 luces puntuales en el móvil (8 en ordenador). Se apagan las farolas más lejanas y el
      número de luces no cambia cuando se encienden las bolas, así no se recompilan los sombreados a mitad del bou.
   3) Las piezas pequeñas no proyectan sombra (cada una es otra llamada de dibujo en el pase de sombras). */
const CRD={t:0,tS:0,mov:Math.min(innerWidth,innerHeight)<700||matchMedia('(pointer:coarse)').matches};
function crdLuces(sc){const cam=W3.cam;if(!sc||!cam)return;const ls=[];sc.traverse(o=>{if(o.isPointLight&&!o.userData.crdOff)ls.push(o)});
 const off=[];sc.traverse(o=>{if(o.isPointLight&&o.userData.crdOff)off.push(o)});const cupo=CRD.mov?4:8;
 // las de la res (bolas) y la antorcha van colgadas de un personaje: siempre se quedan
 const prio=o=>{let p=o.parent,suya=false;while(p&&p!==sc){if(p.isBone||p.type==='Group'&&p.parent&&p.parent!==sc){suya=true;break}p=p.parent}const w=o.getWorldPosition(CRD.v||(CRD.v=new THREE.Vector3()));return (suya?-1e6:0)+w.distanceTo(cam.position)};
 if(ls.length>cupo){ls.sort((a,b)=>prio(a)-prio(b));for(const o of ls.slice(cupo)){o.userData.crdOff=1;o.visible=false}}
 // si sobra hueco, se vuelve a encender la apagada más cercana (sin pasar del cupo)
 else if(ls.length<cupo&&off.length){off.sort((a,b)=>prio(a)-prio(b));for(const o of off.slice(0,cupo-ls.length)){o.userData.crdOff=0;o.visible=true}}}
if(typeof calleTick==='function'){const _ctR=calleTick;
 calleTick=function(dt){const n=dt>1/29?Math.min(6,Math.ceil(dt*30)):1,h=dt/n;let r;
  for(let i=0;i<n;i++){r=_ctR(h);if(!CL||CL.done)break}
  try{if(CL&&CL.sc){CRD.t+=dt;if(CRD.t>.25){CRD.t=0;crdLuces(CL.sc)}CRD.tS+=dt;if(CRD.tS>3&&typeof dhSombraPeq==='function'){CRD.tS=0;dhSombraPeq(CL.sc)}}}catch(e){}
  return r}}
// al montar el festejo: aplicar el cupo de luces y las sombras antes del primer fotograma
if(typeof irCalle==='function'){const _icR=irCalle;irCalle=function(){const r=_icR.apply(this,arguments);try{if(CL&&CL.sc){crdLuces(CL.sc);if(typeof dhSombraPeq==='function')dhSombraPeq(CL.sc)}}catch(e){}return r}}
