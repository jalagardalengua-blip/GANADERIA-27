/* ===================== EFECTOS: subtítulos, cámara, cámara lenta, chispas, confeti y transiciones ===================== */
W3.ts=1;W3.shk=0;
/* ---------- subtítulos: arriba, sin tapar botones, y se desvanecen solos ---------- */
function subsInit(){const cap=$('#h3cap');if(!cap||cap.__subs)return;cap.__subs=1;let t=null;
 const show=()=>{const txt=cap.textContent||'';cap.style.opacity=txt?1:0;clearTimeout(t);if(txt)t=setTimeout(()=>{cap.style.opacity=0},3800+txt.length*45)};
 new MutationObserver(show).observe(cap,{childList:true,characterData:true,subtree:true});
 const tst=()=>document.body.classList.toggle('in3d',!!W3.on);tst();setInterval(tst,500)}
/* ---------- sacudida de cámara y destellos ---------- */
function shake(a){W3.shk=Math.max(W3.shk,a)}
function flash(col,op){let f=$('#fxFlash');if(!f&&W3.root){f=document.createElement('div');f.id='fxFlash';f.className='fxFlash';W3.root.appendChild(f)}if(!f)return;f.style.background=col;f.style.transition='none';f.style.opacity=op||.45;void f.offsetWidth;f.style.transition='opacity .7s ease-out';f.style.opacity=0}
function slowmo(s,d){W3.ts=s;W3.tsT=d}
function fxHook(){if(!W3.R||W3.R.__fx)return;W3.R.__fx=1;const rd=W3.R.render.bind(W3.R);
 W3.R.render=function(sc,cam){if(W3.shk>.002&&cam){const k=W3.shk,dx=(Math.random()-.5)*k,dy=(Math.random()-.5)*k,dz=(Math.random()-.5)*k;cam.position.x+=dx;cam.position.y+=dy;cam.position.z+=dz;rd(sc,cam);cam.position.x-=dx;cam.position.y-=dy;cam.position.z-=dz;W3.shk*=.88}else rd(sc,cam);
  if(W3.tsT>0){W3.tsT-=1/60;if(W3.tsT<=0)W3.ts=1}}}
const _show3Dfx=show3D;show3D=function(){const r=_show3Dfx();if(r){fxHook();subsInit()}return r};
const _exit3Dfx=exit3D;exit3D=function(){W3.ts=1;W3.shk=0;return _exit3Dfx.apply(this,arguments)};
/* cámara lenta: los modos reciben el tiempo escalado */
for(const n of ['calleTick','plazaTick','tientaTick','fincaTick']){const f=window[n];if(typeof f!=='function')continue;window[n]=function(dt){return f(dt*(W3.ts||1))}}
/* ---------- momentos: olés, cogidas, remates ---------- */
const _oleFx=ole;ole=function(txt){_oleFx(txt);if(/Olé|Salto|Recorte|Anilla|Bien/.test(txt||'')){const big=/Salto|Recorte|Olé/.test(txt);if(big)slowmo(.42,.45);flash('radial-gradient(circle,rgba(255,220,140,.5),transparent 70%)',.5)}};
const _tossFx=tossPlayer;tossPlayer=function(){const r=_tossFx.apply(this,arguments);shake(.5);flash('rgba(160,10,20,.55)',.6);return r};
if(typeof clToss==='function'){const _ct=clToss;clToss=function(p){const was=p.toss>0;_ct(p);if(!was){shake(p.me?.6:.25);if(p.me)flash('rgba(160,10,20,.55)',.6);slowmo(.5,.35)}}}
if(typeof calleTick==='function'){const _ctk=calleTick;calleTick=function(dt){const r=CL&&CL.res,rem=r?r.st.rem:0;_ctk(dt);if(CL&&CL.res&&CL.res===r&&r.st.rem>rem)shake(.22);if(CL&&CL.res&&CL.res.fire)sparks(CL.res,dt)}}
if(typeof tientaTick==='function'){const _ttk=tientaTick;tientaTick=function(dt){const was=W3.F&&W3.F.toss>0;_ttk(dt);if(W3.F&&!was&&W3.F.toss>0){shake(.45);flash('rgba(160,10,20,.5)',.55)}}}
/* plaza: cogida e indulto */
if(typeof actCogida==='function'){const _ac=actCogida;actCogida=function(){const o=_ac.apply(this,arguments);if(o&&o.init){const i0=o.init;o.init=function(Z){shake(.35);flash('rgba(160,10,20,.45)',.5);return i0.apply(this,arguments)}}return o}}
if(typeof actIndulto==='function'){const _ai=actIndulto;actIndulto=function(){const o=_ai.apply(this,arguments);if(o&&o.init){const i0=o.init;o.init=function(Z){confetti(160);flash('rgba(255,230,160,.5)',.5);return i0.apply(this,arguments)}}return o}}
/* ---------- chispas del bou embolat ---------- */
function sparks(r,dt){const sc=CL.sc;if(!CL.spk){const n=90,g=new THREE.BufferGeometry(),pos=new Float32Array(n*3);g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const m=new THREE.PointsMaterial({color:'#ffb347',size:.09,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending});const pts=new THREE.Points(g,m);pts.frustumCulled=false;sc.add(pts);if(CL.added)CL.added.push(pts);
  CL.spk={pts,pos,v:Array.from({length:n},()=>({x:0,y:-99,z:0,vx:0,vy:0,vz:0,l:0})),i:0}}
 const S2=CL.spk;r.b.hp.updateMatrixWorld(true);for(let k=0;k<2;k++){const s=S2.v[S2.i++%S2.v.length];const side=Math.random()<.5?1:-1;const w=new THREE.Vector3(side*.62,.75,.2).applyMatrix4(r.b.hp.matrixWorld);s.x=w.x;s.y=w.y;s.z=w.z;s.vx=R(-.6,.6);s.vy=R(.6,1.8);s.vz=R(-.6,.6);s.l=R(.5,1.1)}
 S2.v.forEach((s,i)=>{if(s.l>0){s.l-=dt;s.vy-=dt*1.4;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt}else s.y=-99;S2.pos[i*3]=s.x;S2.pos[i*3+1]=s.y;S2.pos[i*3+2]=s.z});S2.pts.geometry.attributes.position.needsUpdate=true}
/* ---------- confeti dorado ---------- */
function confetti(n){const cv=document.createElement('canvas');cv.className='fxConf';document.body.appendChild(cv);const c=cv.getContext('2d');const W=cv.width=innerWidth,H=cv.height=innerHeight;
 const cols=['#e6bb55','#fff1c4','#bf3a3f','#f4f0e6','#c48a2c'];const P=Array.from({length:n||120},()=>({x:W/2+R(-W*.3,W*.3),y:H*.35+R(-40,40),vx:R(-5,5),vy:R(-12,-4),r:R(0,6),vr:R(-.3,.3),w:R(5,10),h:R(8,16),c:pick(cols)}));let t=0;
 const loop=()=>{t++;c.clearRect(0,0,W,H);for(const p of P){p.vy+=.28;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(t*.1+p.r)));c.restore()}
  if(t<200)requestAnimationFrame(loop);else cv.remove()};requestAnimationFrame(loop)}
if(typeof calleFin==='function'){const _cf=calleFin;calleFin=function(){_cf.apply(this,arguments);const r=S.corro&&S.corro.hist[0];if(r&&(r.media>=82||r.trofeo))confetti(140)}}
const _construirFx=construir;construir=function(k,now){const lv=mejLv(k);const r=_construirFx.apply(this,arguments);if(now&&mejLv(k)>lv)confetti(70);return r};
/* ---------- interfaz: transiciones, contador de dinero y vuelta al menú ---------- */
let FXM={money:null,tab:null};
const _renderFx=render;
render=function(){_renderFx();if(!S)return;const scr=$('#scr');if(scr&&FXM.tab!==UI.tab){scr.classList.remove('tabIn');void scr.offsetWidth;scr.classList.add('tabIn');FXM.tab=UI.tab}
 const num=document.querySelector('.sbar .num');if(num&&FXM.money!=null&&Math.abs(S.money-FXM.money)>=1){const a=FXM.money,b=S.money,t0=performance.now(),up=b>a;num.classList.add(up?'mUp':'mDown');
  const tick=now=>{const k=Math.min(1,(now-t0)/700),e=1-Math.pow(1-k,3);num.textContent=eur(a+(b-a)*e);if(k<1)requestAnimationFrame(tick);else{num.textContent=eur(b);setTimeout(()=>num.classList.remove('mUp','mDown'),400)}};requestAnimationFrame(tick)}
 FXM.money=S.money;
 const em=document.querySelector('.hdr .wrap > :first-child');if(em&&!em.__m){em.__m=1;em.style.cursor='pointer';em.title='Menú principal';em.addEventListener('click',irMenu)}};
function irMenu(){save();S=null;MENU.v='main';FXM={money:null,tab:null};render();window.scrollTo(0,0)}
/* ---------- avanzar de mes: pase de capote con el mes nuevo ---------- */
const _advanceFx=advance;
advance=function(){if(!S)return _advanceFx.apply(this,arguments);const m=(S.month+1)%12,y=S.year+(S.month===11?1:0);
 if(!W3.on){const d=document.createElement('div');d.className='capWipe';d.innerHTML=`<i></i><b>${MESES[m]}<small>Temporada ${y}</small></b>`;document.body.appendChild(d);setTimeout(()=>d.remove(),1250);uiSnd('cap')}
 return _advanceFx.apply(this,arguments)};
/* ---------- sonidos de interfaz: madera de barrera y clarín ---------- */
function uiSnd(k){if(!AU.on)return;try{auInit();const c=AU.ctx;if(!c)return;const t=c.currentTime;
 if(k==='tap'){const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(180,t+.05);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(g);g.connect(AU.master);o.start(t);o.stop(t+.08)}
 if(k==='cap'){const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(2200,t+.5);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+.8);s.connect(f);f.connect(g);g.connect(AU.master);s.start(t);s.stop(t+.85)}}catch(e){}}
document.addEventListener('pointerdown',e=>{if(W3.on)return;const b=e.target.closest&&e.target.closest('button,.mItem');if(b&&!b.disabled)uiSnd('tap')},{passive:true});
