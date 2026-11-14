/* ===================== MANDO TÁCTIL MODERNO =====================
   En la finca, la tienta y los festejos:
   - Joystick flotante: toca en cualquier punto de la mitad izquierda y el joystick aparece bajo el pulgar.
   - Empuja el joystick hasta el borde y echas a correr (o al galope); al soltar vuelves al paso.
   - Pellizca con dos dedos para acercar o alejar la cámara.
   - Doble toque en la mitad derecha: la cámara vuelve a tu espalda.
   - El botón de acción late y vibra un poco cuando hay algo que hacer cerca. */
const MD={id:null,cx:0,cy:0,rad:48,t0:0,auto:false,pz:null,tap:0};
function mdJoyVis(x,y){const j=document.getElementById('joy');if(!j)return;const r=j.parentElement.getBoundingClientRect(),w=j.offsetWidth;
 j.style.left=(x-r.left-w/2)+'px';j.style.top=(y-r.top-w/2)+'px';j.style.bottom='auto';j.classList.add('flota')}
function mdJoyReset(){const j=document.getElementById('joy'),k=document.getElementById('knob');if(j){j.style.left=j.style.top=j.style.bottom='';j.classList.remove('flota')}if(k)k.style.transform=''}
function mdActivo(){return typeof W3!=='undefined'&&W3.on&&W3.mode!=='plaza'&&!document.getElementById('joy').hidden}
function mdMontar(){const cv=W3.R&&W3.R.domElement;if(!cv||cv.__md)return;cv.__md=1;
 const toques=new Map();
 cv.addEventListener('pointerdown',e=>{if(!mdActivo())return;const r=cv.getBoundingClientRect();toques.set(e.pointerId,{x:e.clientX,y:e.clientY});
  // dos dedos: pellizco para el zoom (y no se mueve la cámara)
  if(toques.size===2&&MD.id==null){const [a,b]=[...toques.values()];MD.pz={d:Math.hypot(a.x-b.x,a.y-b.y),z:W3.zoom||1};e.stopImmediatePropagation();return}
  if(MD.id==null&&e.clientX-r.left<r.width*.42&&e.pointerType!=='mouse'){MD.id=e.pointerId;MD.cx=e.clientX;MD.cy=e.clientY;MD.t0=0;mdJoyVis(e.clientX,e.clientY);
   try{cv.setPointerCapture(e.pointerId)}catch(err){}e.stopImmediatePropagation();return}
  // doble toque a la derecha: cámara a la espalda
  if(e.clientX-r.left>=r.width*.42){const now=performance.now();if(now-MD.tap<300){MD.recentra=true;MD.tap=0}else MD.tap=now}},true);
 cv.addEventListener('pointermove',e=>{if(!mdActivo())return;if(toques.has(e.pointerId))toques.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(MD.pz&&toques.size>=2){const [a,b]=[...toques.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);W3.zoom=clamp(MD.pz.z*MD.pz.d/Math.max(20,d),.6,2);e.stopImmediatePropagation();return}
  if(e.pointerId!==MD.id)return;let dx=e.clientX-MD.cx,dy=e.clientY-MD.cy;const L=Math.hypot(dx,dy),m=MD.rad;
  // si el pulgar se va lejos, el joystick le sigue
  if(L>m*1.6){const k=(L-m*1.6)/L;MD.cx+=dx*k;MD.cy+=dy*k;mdJoyVis(MD.cx,MD.cy);dx=e.clientX-MD.cx;dy=e.clientY-MD.cy}
  const L2=Math.hypot(dx,dy);if(L2>m){dx*=m/L2;dy*=m/L2}const kn=document.getElementById('knob');if(kn)kn.style.transform=`translate(${dx}px,${dy}px)`;
  W3.jx=dx/m;W3.jy=-dy/m;e.stopImmediatePropagation()},true);
 const fin=e=>{toques.delete(e.pointerId);if(toques.size<2)MD.pz=null;if(e.pointerId!==MD.id)return;MD.id=null;W3.jx=W3.jy=0;mdJoyReset();
  if(MD.auto){MD.auto=false;W3.run=false;const b=document.getElementById('h3run');if(b)b.classList.remove('oro')}e.stopImmediatePropagation()};
 cv.addEventListener('pointerup',fin,true);cv.addEventListener('pointercancel',fin,true)}
/* cada fotograma: correr al empujar a fondo, recentrar la cámara y avisar de acciones */
function mdTick(dt){if(!mdActivo())return;const mag=Math.hypot(W3.jx||0,W3.jy||0);
 if(mag>.94){MD.t0+=dt;if(MD.t0>.45&&!W3.run&&!W3.drive){W3.run=true;MD.auto=true;const b=document.getElementById('h3run');if(b)b.classList.add('oro')}}
 else{MD.t0=0;if(MD.auto&&mag<.55){MD.auto=false;W3.run=false;const b=document.getElementById('h3run');if(b)b.classList.remove('oro')}}
 if(MD.recentra&&W3.F){const ty=(W3.ride&&W3.horse?W3.horse.yaw:W3.drive&&W3.truck?W3.truck.yaw:W3.F.yaw)+Math.PI;const d=angD(W3.yaw,ty);W3.yaw+=d*Math.min(1,dt*7);W3.camT=1.5;if(Math.abs(d)<.02)MD.recentra=false}
 const b=document.getElementById('h3do');const vis=b&&!b.hidden;if(vis&&!MD.btn){try{navigator.vibrate&&matchMedia('(pointer:coarse)').matches&&navigator.vibrate(12)}catch(e){}b.classList.remove('late');void b.offsetWidth;b.classList.add('late')}MD.btn=vis}
for(const n of ['fincaTick','tientaTick','calleTick']){if(typeof window[n]!=='function')continue;const f=window[n];window[n]=function(dt){const r=f.apply(this,arguments);try{mdMontar();mdTick(dt||0)}catch(e){}return r}}
/* ---------- marcas flotantes: qué se puede hacer a tu alrededor ---------- */
const MK={els:[],v:new THREE.Vector3()};
function mkEl(i){if(MK.els[i])return MK.els[i];const host=document.getElementById('w3d')||document.body;const e=document.createElement('div');e.className='mkAct';host.appendChild(e);MK.els[i]=e;return e}
function mkTick(){const on=typeof W3!=='undefined'&&W3.on&&W3.mode==='finca'&&!W3.drive&&!W3.ride&&W3.F&&W3.cam;const out=[];
 if(on){const px=W3.F.p.x,pz=W3.F.p.z;const cand=[];
  for(const a of W3.acts||[]){if(a.cond&&!a.cond())continue;const d=Math.hypot(a.x-px,a.z-pz);if(d>a.r&&d<12){const l=typeof a.l==='function'?a.l():a.l;cand.push({x:a.x,z:a.z,d,l})}}
  if(W3.truck){const d=Math.hypot(W3.truck.x-px,W3.truck.z-pz);if(d>3.6&&d<14)cand.push({x:W3.truck.x,z:W3.truck.z,d,l:'Camioneta',h:3.2})}
  if(W3.horse){const d=Math.hypot(W3.horse.x-px,W3.horse.z-pz);if(d>2.8&&d<14)cand.push({x:W3.horse.x,z:W3.horse.z,d,l:'Caballo',h:2.6})}
  cand.sort((a,b)=>a.d-b.d);const cv=W3.R.domElement,w=cv.clientWidth,h=cv.clientHeight;
  for(const c of cand){if(out.length>=3)break;MK.v.set(c.x,gH(c.x,c.z)+(c.h||2.4),c.z).project(W3.cam);if(MK.v.z>1||Math.abs(MK.v.x)>.95||Math.abs(MK.v.y)>.9)continue;let x=(MK.v.x*.5+.5)*w,y=(-MK.v.y*.5+.5)*h;
   for(let k=0;k<3&&out.some(o=>Math.abs(o[1]-x)<150&&Math.abs(o[2]-y)<26);k++)y-=28;   // apiladas, sin taparse
   out.push([c,x,y])}}
 for(let i=0;i<3;i++){const e=mkEl(i);const o=out[i];if(!o){e.classList.remove('on');continue}const [c,x,y]=o;if(e.textContent!==c.l)e.textContent=c.l;e.style.transform=`translate(${x.toFixed(0)}px,${y.toFixed(0)}px) translate(-50%,-100%)`;e.style.opacity=String(clamp(1.2-c.d/12,0,1));e.classList.add('on')}}
{const f=window.fincaTick;window.fincaTick=function(dt){const r=f.apply(this,arguments);try{mkTick()}catch(e){}return r}}
