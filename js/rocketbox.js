/* ===================== PERSONAS REALISTAS · MICROSOFT ROCKETBOX (licencia MIT) =====================
   16 personas con texturas fotográficas (9 hombres y 7 mujeres con ropa de calle) y animaciones de captura de
   movimiento de actores reales: parado, mirar alrededor, andar, trotar, correr, celebrar, aplaudir, sentado,
   saludar y agachado. Hombres y mujeres usan sus propias animaciones.
   Sustituyen a la persona genérica (makePerson({gl:1})) en: mozos de las fiestas de pueblo, primera fila de la
   Plaza Mayor del corro y personal de la finca sin sombrero. El torero, los jinetes y los vaqueros con sombrero
   siguen con su modelo propio.
   Se cargan en segundo plano tras arrancar el juego (≈8 MB, luego quedan en la caché); hasta entonces se usa la
   persona de siempre.
   Origen: https://github.com/microsoft/Microsoft-Rocketbox · © 2020 Microsoft · MIT (ver modelos/rb/LICENCIA.txt) */
const RBX={ok:false,cargando:false,h:[],m:[],am:null,af:null,i:0,err:null};
const RB_H=['male_01','male_03','male_05','male_06','male_08','male_11','male_14','male_16','male_17'];
const RB_M=['female_01','female_02','female_07','female_08','female_11','female_15','female_17'];
function rbCargar(cb){if(RBX.ok){cb&&cb();return}if(RBX.cargando)return;if(typeof THREE==='undefined'||!THREE.GLTFLoader||!THREE.SkeletonUtils)return;
 RBX.cargando=true;const L=new THREE.GLTFLoader(),base=(typeof MOD_BASE!=='undefined'?MOD_BASE:'')+'modelos/rb/';
 const ld=f=>new Promise((ok,ko)=>L.load(base+f+'.glb',ok,undefined,ko));
 (async()=>{RBX.am=await ld('anim-m');RBX.af=await ld('anim-f');
  // una a una para no saturar la conexión del móvil
  for(const n of RB_H){try{RBX.h.push(await ld(n))}catch(e){}}for(const n of RB_M){try{RBX.m.push(await ld(n))}catch(e){}}
  for(const g of [...RBX.h,...RBX.m])g.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=false;o.frustumCulled=false;const m=o.material;if(m&&m.map){m.map.anisotropy=4}}});
  RBX.ok=RBX.h.length+RBX.m.length>=4;cb&&cb()})().catch(e=>{RBX.err=e;RBX.cargando=false;try{console.warn('Rocketbox',e)}catch(_){}})}
// precarga en segundo plano cuando el juego está tranquilo
(function(){const go=()=>setTimeout(()=>{try{(window.requestIdleCallback||setTimeout)(()=>rbCargar(),{timeout:4000})}catch(e){rbCargar()}},6000);
 if(document.readyState==='complete')go();else addEventListener('load',go,{once:true})})();

function rbPersona(st){const muj=st.mujer!=null?!!st.mujer:(RBX.m.length&&Math.random()<.4);const pool=muj&&RBX.m.length?RBX.m:RBX.h;const g=pool[(RBX.i++)%pool.length];
 const sc=THREE.SkeletonUtils.clone(g.scene);const set=pool===RBX.m?RBX.af:RBX.am;
 const root=new THREE.Group(),b=new THREE.Group();root.add(b);b.add(sc);
 // grupo anclado a la cabeza (lo usa el código que coloca sombreros)
 const head=new THREE.Group(),hat=new THREE.Group();head.add(hat);let hb=null;sc.traverse(o=>{if(o.name==='Bip01_Head')hb=o});
 if(hb){sc.updateMatrixWorld(true);const want=new THREE.Matrix4().makeTranslation(0,(pool===RBX.m?1.72:1.84)-.06,0.02);const inv=new THREE.Matrix4().copy(hb.matrixWorld).invert();head.applyMatrix4(inv.multiply(want));hb.add(head)}
 // (sin gorra ni pañuelo postizos: el modelo ya trae su pelo y su ropa)
 const dm=()=>new THREE.Group();const legs=[0,1].map(()=>({hip:dm(),kn:dm()})),arms=[1,-1].map(s=>{const sh=dm(),el=dm(),hand=dm();sh.add(el);el.add(hand);return {sh,el,hand,s}});
 const mixer=new THREE.AnimationMixer(sc),acts={};for(const c of set.animations)acts[c.name]=mixer.clipAction(c);
 const P={root,b,legs,arms,head,hat,ph:Math.random()*6,rb:1,gl:{mixer,acts,cur:null,want:null,t:Math.random()*8}};
 modPlay(P,'Idle_Loop',0);if(acts.Idle_Loop)acts.Idle_Loop.time=Math.random()*8;return P}

// engancha la persona genérica: solo gente "de calle" (sin traje de luces, sin sombrero de campo ni de jinete)
const _mpRB=makePerson;
makePerson=function(st){
 if(st&&st.gl&&RBX.ok&&!st.traje&&!st.pole&&!st._torero&&!st.hat&&!st.proc&&!st.noRB){try{return rbPersona(st)}catch(e){try{console.warn('rocketbox',e)}catch(_){}}}
 return _mpRB.apply(this,arguments)};
// aplauso y saludo como nuevas acciones (si quien llama las pide por nombre)
function rbAccion(P,k,ts){if(!P||!P.gl)return;P.gl.want=P.gl.acts[k]?k:null;P.gl.wts=ts||1}

// Plaza Mayor: los espectadores realistas no hacen todos lo mismo: unos celebran, otros aplauden o saludan,
// y en calma algunos miran alrededor
if(typeof pmxSpecTick==='function'){const _pstRB=pmxSpecTick;pmxSpecTick=function(dt){_pstRB(dt);if(!CL||!CL.pmxSpec)return;
 for(const s of CL.pmxSpec){const P=s.P;if(!P||!P.rb||!P.gl)continue;if(s.k==null)s.k=Math.random();
  P.gl.want=s.ch?(s.k<.45?'Celebration':s.k<.85?'Clap':'Wave'):(s.k<.3?'Idle_LookAround_Loop':null)}}}

/* ===================== ANIMALES ROCKETBOX: caballo con montura y perro pastor =====================
   Vienen con esqueleto pero sin animaciones: aquí se generan por código sobre sus huesos reales.
   Para cada articulación se averigua qué eje la dobla hacia delante (probando giros y mirando cómo se mueve
   el hueso siguiente), y se crean los clips Idle, WalkSlow, Walk y Run (paso a cuatro tiempos y galope), con
   el cuello, la columna y la cola acompañando. El juego los usa por nombre, igual que el caballo de antes. */
const RB_TAU=Math.PI*2,rbFrac=x=>x-Math.floor(x),rbLerp=(a,b,t)=>a+(b-a)*t;
const _RQ=new THREE.Quaternion(),_RV=new THREE.Vector3(),_RV2=new THREE.Vector3();
function rbEje(b,quiere){const ch=b.children.find(c=>c.isBone);if(!ch)return null;const root=b;let best=null,bs=-1;
 b.updateWorldMatrix(true,true);const p0=ch.getWorldPosition(new THREE.Vector3());const q0=b.quaternion.clone();
 for(const ax of [new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)]){b.quaternion.copy(q0).multiply(_RQ.setFromAxisAngle(ax,.2));b.updateWorldMatrix(false,true);
  const d=ch.getWorldPosition(new THREE.Vector3()).sub(p0);const s=Math.abs(d[quiere.c]);const lat=quiere.c==='x'?0:Math.abs(d.x);const sc=s-lat*2;if(sc>bs){bs=sc;best={ax,sg:Math.sign(d[quiere.c])*(quiere.s||1)}}}
 b.quaternion.copy(q0);b.updateWorldMatrix(false,true);return best?{ax:best.ax,sg:best.sg||1}:null}
function rbPata(p,duty,A,K,F){if(p<duty)return[rbLerp(A,-A,p/duty),0,-.15*Math.sin(Math.PI*p/duty)];const s=(p-duty)/(1-duty),w=Math.sin(Math.PI*s);return[rbLerp(-A,A,s*s*(3-2*s)),w*K,w*F]}
function rbClipsCuadrupedo(scene,pre){scene.updateMatrixWorld(true);const B={};scene.traverse(o=>{if(o.isBone)B[o.name.replace(/_/g,' ')]=o});
 const f=re=>{const k=Object.keys(B).find(n=>re.test(n));return k?B[k]:null};
 const piernas=[];for(const s of ['L','R']){
  piernas.push({del:1,s,b:[f(new RegExp(pre+' '+s+' UpperArm$')),f(new RegExp(pre+' '+s+' Forearm$')),f(new RegExp(pre+' '+s+' Hand$'))]});
  piernas.push({del:0,s,b:[f(new RegExp(pre+' '+s+'( Thigh)?$')),f(new RegExp(pre+' '+s+' Calf$')),f(new RegExp(pre+' '+s+' Foot$'))]})}
 // ejes: muslo/brazo adelante = el hueso hijo va hacia +z; la rodilla delantera dobla la mano hacia atrás,
 // el corvejón lleva la caña hacia delante y el menudillo recoge el casco hacia atrás
 for(const L of piernas){if(!L.b[0])continue;L.e=[rbEje(L.b[0],{c:'z'}),L.b[1]&&rbEje(L.b[1],{c:'z',s:L.del?-1:1}),L.b[2]&&rbEje(L.b[2],{c:'z',s:-1})]}
 const cuello=Object.keys(B).filter(n=>new RegExp(pre+' Neck').test(n)).map(n=>B[n]).sort((a,b)=>a.name.length-b.name.length);
 const cabeza=f(new RegExp(pre+' Head$'));const cola=Object.keys(B).filter(n=>new RegExp(pre+' Tail').test(n)).map(n=>B[n]);
 const espina=[f(new RegExp(pre+' Spine$')),f(new RegExp(pre+' Spine1$'))].filter(Boolean);
 const eC=cuello.map(b=>({b,p:rbEje(b,{c:'y',s:-1}),y:rbEje(b,{c:'x'})})),eT=cola.map(b=>({b,l:rbEje(b,{c:'x'}),u:rbEje(b,{c:'y'})})),eE=espina.map(b=>({b,p:rbEje(b,{c:'y'})}));
 const eH=cabeza?{b:cabeza,p:rbEje(cabeza,{c:'y',s:-1})}:null;const orejas=Object.keys(B).filter(n=>/Ear/.test(n)).map(n=>({b:B[n],e:rbEje(B[n],{c:'z'})}));
 const fase={walk:{LH:0,LF:.25,RH:.5,RF:.75},run:{LH:0,RH:.11,RF:.39,LF:.5}};
 // la cola viene estirada hacia atrás en la pose de reposo: se deja caer (el caballo casi vertical, el perro algo bajada)
 const colaBase=(R,run)=>eT.forEach((x,i)=>R(x.b,x.u,i===0?(pre==='horse'?(run?-.75:-1.15):(run?-.15:-.45)):(pre==='horse'?-.12:.05)));
 function clip(nombre,dur,fn){const N=Math.max(12,Math.round(dur*30)),T=[];for(let i=0;i<=N;i++)T.push(i/N*dur);const tracks=new Map();
  const put=(b,e,ang,t)=>{if(!b||!e)return;let tr=tracks.get(b);if(!tr){tr={b,q0:b.quaternion.clone(),v:new Float32Array(T.length*4),acc:T.map(()=>new THREE.Quaternion())};tracks.set(b,tr)}
   tr.acc[t].multiply(_RQ.setFromAxisAngle(e.ax,ang*e.sg))};
  T.forEach((t,ti)=>fn(t/dur,t,(b,e,a)=>put(b,e,a,ti)));
  const out=[];for(const tr of tracks.values()){T.forEach((t,ti)=>{const q=tr.q0.clone().multiply(tr.acc[ti]);q.toArray(tr.v,ti*4)});out.push(new THREE.QuaternionKeyframeTrack(tr.b.name+'.quaternion',T,tr.v))}
  return new THREE.AnimationClip(nombre,dur,out)}
 const andar=(nombre,dur,g,amp)=>clip(nombre,dur,(u,t,R)=>{const ph=fase[g];const run=g==='run';
  for(const L of piernas){if(!L.e||!L.e[0])continue;const p=rbFrac(u+ph[(L.s)+(L.del?'F':'H')]);const [a,k,fl]=rbPata(p,run?.36:.62,(L.del?(run?.62:.32):(run?.55:.28))*amp,(L.del?(run?1.25:.75):(run?1:.6))*amp,(L.del?(run?1.1:.6):(run?.9:.5))*amp);
   R(L.b[0],L.e[0],a);R(L.b[1],L.e[1],k);R(L.b[2],L.e[2],fl)}
  const c=RB_TAU*u;for(const s of eE)R(s.b,s.p,(run?.07:.02)*Math.sin(c*(run?1:2)));
  for(const n of eC)R(n.b,n.p,(run?.12:.05)*Math.sin(c*(run?1:2)+1)/Math.max(1,eC.length)*2);
  colaBase(R,run);eT.forEach((x,i)=>R(x.b,x.l,(run?.06:.12)*Math.sin(c+i*.8)))});
 const clips=[andar('WalkSlow',1.5,'walk',.8),andar('Walk',1.1,'walk',1),andar('Run',.62,'run',1),
  clip('Idle',6,(u,t,R)=>{const c=RB_TAU*u;eC.forEach((n,i)=>{R(n.b,n.p,.06*Math.sin(c)+.03*Math.sin(c*3));R(n.b,n.y,.12*Math.sin(c+1)/Math.max(1,eC.length))});
   colaBase(R,false);eT.forEach((x,i)=>R(x.b,x.l,.22*Math.sin(c*3+i*.7)));for(const o of orejas)R(o.b,o.e,.25*Math.max(0,Math.sin(c*2+(o.b.name.includes('L')?0:1.5)))**8);
   for(const s of eE)R(s.b,s.p,.012*Math.sin(c*6))}),
  clip('Graze',4,(u,t,R)=>{const c=RB_TAU*u;eC.forEach((n,i)=>R(n.b,n.p,.5/Math.max(1,eC.length)*2+.03*Math.sin(c*4)));if(eH)R(eH.b,eH.p,.35+.05*Math.sin(c*8));colaBase(R,false);eT.forEach((x,i)=>R(x.b,x.l,.2*Math.sin(c*2+i*.7)))})];
 return clips}
function rbCargarAnimales(){if(RBX.anim||!RBX.ok)return;RBX.anim=1;const L=new THREE.GLTFLoader(),base=(typeof MOD_BASE!=='undefined'?MOD_BASE:'')+'modelos/rb/';
 const prep=(g,pre,k)=>{g.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false}});g.clips=rbClipsCuadrupedo(g.scene,pre);RBX[k]=g};
 L.load(base+'horse_brown_saddle_01.glb',g=>{try{prep(g,'horse','caballo')}catch(e){console.warn('caballo rb',e)}},undefined,()=>{});
 L.load(base+'dog_germanshepard_01.glb',g=>{try{prep(g,'dog','perro')}catch(e){console.warn('perro rb',e)}},undefined,()=>{})}

// caballo: mismo contrato que el caballo de antes (root, body, gl con Idle/WalkSlow/Walk/Run), para que jinetes,
// vaqueros y el paseo a caballo funcionen igual. La montura ya viene en el modelo. El pelo se tiñe (negro, tordo...).
function rbTinte(mat,col){const c=new THREE.Color(col);const lum=c.r*.3+c.g*.59+c.b*.11;const amt=Math.min(.85,Math.abs(lum-.27)*3.5);
 if(amt<.12)return mat;const m=mat.clone();m.userData.t={c:c.convertSRGBToLinear(),a:amt};
 m.onBeforeCompile=sh=>{sh.uniforms.uTin={value:m.userData.t.c};sh.uniforms.uTinA={value:m.userData.t.a};sh.fragmentShader='uniform vec3 uTin;uniform float uTinA;\n'+sh.fragmentShader.replace('#include <map_fragment>',
  '#include <map_fragment>\n{float l=dot(diffuseColor.rgb,vec3(.3,.59,.11));diffuseColor.rgb=mix(diffuseColor.rgb,uTin*(.45+l*3.5),uTinA);}')};m.customProgramCacheKey=()=>'rbtin'+col;return m}
function rbCaballo(o){const g=RBX.caballo;const sc=THREE.SkeletonUtils.clone(g.scene);const col=o.col||'#5b3f2d';
 sc.traverse(m=>{if(!m.isMesh)return;m.castShadow=true;m.frustumCulled=false;if(m.material&&m.material.name!=='reins'&&!/rein/i.test(m.material.name||''))m.material=rbTinte(m.material,col)});
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);body.position.y=-HOFF;const mdl=new THREE.Group();mdl.position.set(0,HOFF,.15);mdl.add(sc);body.add(mdl);
 const dm=()=>new THREE.Group();const legs=[0,1,2,3].map(i=>({hip:dm(),kn:dm(),f:i<2?1:0})),nk=dm(),hd=dm(),tp=dm();nk.add(hd);
 const mixer=new THREE.AnimationMixer(sc),acts={};for(const c of g.clips)acts[c.name]=mixer.clipAction(c);
 const H={root,body,legs,nk,hd,tp,ph:Math.random()*6,rb:1,gl:{mixer,acts,cur:null,t:0}};modPlay(H,'Idle',0);if(acts.Idle)acts.Idle.time=Math.random()*5;return H}
if(typeof makeHorse2==='function'){const _mh2RB=makeHorse2;makeHorse2=function(o={}){if(RBX.caballo&&!o.peto&&!o.mule&&!o.noRB){try{return rbCaballo(o)}catch(e){try{console.warn('caballo rb',e)}catch(_){}}}return _mh2RB(o)}}
// en reposo, de vez en cuando el caballo baja la cabeza a pastar
if(typeof animHorse==='function'){const _ahRB=animHorse;animHorse=function(H,dt,sp){if(H&&H.rb&&sp<.03){H.gl.t+=dt;const k=(H.gl.t%26)>17?'Graze':'Idle';modPlay(H,k,.6,1);H.gl.mixer.update(dt);H.body.position.y=-HOFF;return}return _ahRB(H,dt,sp)}}

// perro pastor en la finca: acompaña al personal y corre detrás si se aleja
function rbPerro(){const g=RBX.perro;const sc=THREE.SkeletonUtils.clone(g.scene);sc.traverse(m=>{if(m.isMesh){m.castShadow=true;m.frustumCulled=false}});
 const root=new THREE.Group();root.add(sc);const mixer=new THREE.AnimationMixer(sc),acts={};for(const c of g.clips)acts[c.name]=mixer.clipAction(c);
 const P={root,gl:{mixer,acts,cur:null,t:Math.random()*9}};modPlay(P,'Idle',0);return P}
if(typeof fincaTick==='function'){const _ftRB=fincaTick;fincaTick=function(dt){_ftRB(dt);try{rbFincaPerros(dt)}catch(e){}}}
function rbFincaPerros(dt){if(typeof W3==='undefined'||W3.mode!=='finca'||!W3.workers||!W3.workers.length)return;
 if(RBX.ok&&!RBX.anim)rbCargarAnimales();if(!RBX.perro)return;
 if(!W3.rbPerros||W3.rbPerros.sc!==W3.workers[0].p.root.parent){const par=W3.workers[0].p.root.parent;if(!par)return;W3.rbPerros={sc:par,l:[]};
  const n=Math.min(2,W3.workers.length);for(let i=0;i<n;i++){const d=rbPerro(),w=W3.workers[i];d.x=w.x+1.5;d.z=w.z+1;d.w=w;d.off=[R(-2,2),R(-2,2)];d.root.position.set(d.x,0,d.z);par.add(d.root);W3.rbPerros.l.push(d)}}
 for(const d of W3.rbPerros.l){const w=d.w;d.gl.t+=dt;if(d.gl.t>6){d.gl.t=0;d.off=[R(-2.5,2.5),R(-2.5,2.5)]}
  const tx=w.x+d.off[0],tz=w.z+d.off[1],ex=tx-d.x,ez=tz-d.z,el=Math.hypot(ex,ez);const sp=el>4?3.6:el>.6?1.1:0;
  if(sp){d.x+=ex/el*sp*dt;d.z+=ez/el*sp*dt;const yw=Math.atan2(ex,ez);d.root.rotation.y+=Math.atan2(Math.sin(yw-d.root.rotation.y),Math.cos(yw-d.root.rotation.y))*Math.min(1,dt*6)}
  d.root.position.set(d.x,typeof gH==='function'?gH(d.x,d.z):0,d.z);modPlay(d,sp>2?'Run':sp>0?'Walk':'Idle',.3,sp>2?1:sp>0?1.1:1);d.gl.mixer.update(dt)}}
// los animales se cargan cuando ya están las personas
(function(){const t=setInterval(()=>{if(RBX.ok){clearInterval(t);rbCargarAnimales()}},3000)})();
