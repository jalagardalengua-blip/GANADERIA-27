/* ===================== MODELOS 3D CON ANIMACIÓN REAL (captura de movimiento) =====================
   Personas: maniquí "Universal Animation Library" de Quaternius (CC0) vestido por zonas.
   Caballos: "Farm Animals" de Quaternius (CC0), sombreado suave y recoloreado.
   Si los modelos no cargan (sin red, navegador antiguo) el juego sigue con los modelos procedurales. */
const MOD={per:null,hor:null,err:null,reg:null};
const MOD_BASE=(()=>{try{const s=document.currentScript&&document.currentScript.src;if(s&&/\/js\/modelos\.js/.test(s))return s.replace(/js\/modelos\.js.*$/,'')}catch(e){}return ''})();
function modLoad(){if(!THREE.GLTFLoader||!THREE.SkeletonUtils){MOD.err='sin cargador';return}
 const L=new THREE.GLTFLoader();let n=0;const fin=()=>{if(++n<2)return;try{if(W3&&W3.mode==='finca'&&!W3.ride&&S)rebuildFinca()}catch(e){}};
 /* .glb en la web; si el servidor no lo sirve, la misma escena en glTF incrustado (.gltf.json) */
 const ld=(n,ok)=>L.load(MOD_BASE+'modelos/'+n+'.glb',ok,undefined,()=>L.load(MOD_BASE+'modelos/'+n+'.gltf.json',ok,undefined,e=>{MOD.err=e;fin()}));
 ld('persona',g=>{MOD.per=g;modRegions();fin()});L.load(MOD_BASE+'modelos/persona2.glb',g=>{MOD.per2=g},undefined,()=>L.load(MOD_BASE+'modelos/persona2.gltf.json',g=>{MOD.per2=g},undefined,()=>{}));ld('caballo',g=>{MOD.hor=g;fin()})}
/* zonas del cuerpo por vértice (pose de referencia en T) */
const ZN={piel:0,pelo:1,cam:2,manga:3,cinto:4,pant:5,bota:6};
function modRegions(){MOD.reg=new Map();MOD.per.scene.traverse(o=>{if(!o.isSkinnedMesh)return;const p=o.geometry.attributes.position,z=new Uint8Array(p.count);
 for(let i=0;i<p.count;i++){const x=Math.abs(p.getX(i)),y=p.getY(i),zz=p.getZ(i);let r;
  if(y>1.5&&x<.2&&(x<.1||y>1.6)){r=(y>1.75||(zz<-.03&&y>1.62))?ZN.pelo:ZN.piel}
  else if(x>.66)r=ZN.piel;else if(y>.975){r=x>.42?ZN.manga:ZN.cam}else if(y>.9)r=ZN.cinto;else if(y<.12)r=ZN.bota;else r=ZN.pant;z[i]=r}
 MOD.reg.set(o.name,z)})}
function modPalette(st){const c=s=>new THREE.Color(s);const skin=st.skin||pick(['#c79a74','#d2a682','#b88a64','#e0b896']);
 return [c(skin),c(st.hair||pick(['#231812','#3b2a1c','#151010','#5a3c22'])),c(st.jacket||'#6a5a48'),c(st.mangas===false?skin:(st.manga||st.jacket||'#6a5a48')),c(st.belt||'#2a2420'),c(st.pants||'#2a2a2a'),c(st.boots||'#2a1d14')]}
const MODH={};
function modHat(kind,col){const G=geos(),g=new THREE.Group();if(kind==='campero'){mesh(G.cyl,M(col||'#3b2c22',.8),.34,.02,.34,0,0,0,g);mesh(G.cyl,M(col||'#3b2c22',.8),.14,.13,.14,0,.06,0,g);mesh(G.cyl,M('#151010'),.142,.03,.142,0,.01,0,g,true)}
 else if(kind==='gorra'){mesh(G.sph,M(col||'#c42a2a',.8),.13,.08,.14,0,0,-.01,g);mesh(G.box,M(col||'#c42a2a',.8),.2,.015,.12,0,-.03,.14,g,true)}
 else if(kind==='panuelo'){mesh(G.sph,M(col||'#c42a2a',.8),.125,.07,.135,0,-.01,-.01,g,true)}return g}
const PIEL_T=[[3.6,3.4,3.25],[3.1,2.85,2.65],[2.6,2.3,2.05],[2,1.7,1.45]];
function vestirReal(sc,st,pal){const hp=st.hat==='campero'||st.gorra||st.panu?'Pelo_Rapado':(st.pelo||(Math.random()<.35?'Pelo_Rapado':'Pelo_Raya'));
 const hx='#'+pal[1].getHexString(),tint=PIEL_T[Math.floor(Math.random()*PIEL_T.length)],col=k=>'#'+pal[k].getHexString();let piel=null;
 const Z={Z_cam:col(2),Z_manga:col(3),Z_cinto:col(4),Z_pant:col(5),Z_bota:col(6)};
 sc.traverse(o=>{if(!o.isSkinnedMesh)return;o.castShadow=true;o.receiveShadow=false;o.frustumCulled=false;const n=o.material&&o.material.name;
  if(n==='Z_piel'){if(!piel){piel=o.material.clone();piel.color.setRGB(...tint);piel.userData.lin=1;piel.normalMap=null;piel.needsUpdate=true}o.material=piel}
  else if(n==='Z_manga'&&st.mangas===false)o.userData.mangaPiel=1;
  else if(Z[n]){o.material=o.material.clone();o.material.color.set(Z[n]);o.material.roughness=n==='Z_bota'?.5:.85}
  else if(/^Pelo_/.test(o.name)){o.visible=o.name===hp;if(o.visible){o.material=o.material.clone();o.material.color.set(hx)}}
  else if(o.name==='Cejas'){o.material=o.material.clone();o.material.color.set(hx)}});
 sc.traverse(o=>{if(o.userData&&o.userData.mangaPiel&&piel)o.material=piel})}
function makePersonGL(st){const real=!!MOD.per2;const src=real?{scene:MOD.per2.scene,animations:MOD.per2.animations.length?MOD.per2.animations:MOD.per.animations}:MOD.per;const sc=THREE.SkeletonUtils.clone(src.scene);const pal=modPalette(st);
 const mat=new THREE.MeshStandardMaterial({vertexColors:true,skinning:true,roughness:.78,metalness:0});
 let headBone=null;
 sc.traverse(o=>{if(o.isBone&&o.name==='Head')headBone=o});if(real)vestirReal(sc,st,pal);else sc.traverse(o=>{if(!o.isSkinnedMesh)return;const z=MOD.reg.get(o.name);const g=o.geometry.clone();g.userData={};const n=g.attributes.position.count,a=new Float32Array(n*3);
  for(let i=0;i<n;i++){const k=pal[z?z[i]:2];a[i*3]=k.r;a[i*3+1]=k.g;a[i*3+2]=k.b}g.setAttribute('color',new THREE.BufferAttribute(a,3));o.geometry=g;o.material=mat;o.castShadow=true;o.receiveShadow=false;o.frustumCulled=false});
 const root=new THREE.Group(),b=new THREE.Group();root.add(b);b.add(sc);
 /* sombrero / gorra / pañuelo anclado al hueso de la cabeza */
 const head=new THREE.Group(),hat=new THREE.Group();head.add(hat);
 if(headBone){sc.updateMatrixWorld(true);const want=new THREE.Matrix4().makeTranslation(0,1.79,0.0);const inv=new THREE.Matrix4().copy(headBone.matrixWorld).invert();head.applyMatrix4(inv.multiply(want));headBone.add(head)}
 if(!real){const G=geos(),hairM=M('#'+pal[1].getHexString(),.85);for(const s of [1,-1]){mesh(G.sph,M('#f4efe6',.3),.016,.011,.008,s*.036,-.09,.104,head,true);mesh(G.sph,M('#2a1d14',.25),.008,.008,.005,s*.036,-.09,.111,head,true);mesh(G.box,hairM,.03,.007,.01,s*.037,-.066,.108,head,true).rotation.z=s*-.15}
  mesh(G.sph,M('#'+pal[0].getHexString(),.6),.014,.022,.02,0,-.115,.116,head,true);mesh(G.box,M('#8a4a3e',.6),.03,.005,.006,0,-.15,.104,head,true)}
 const hk=st.hat==='campero'?'campero':st.gorra?'gorra':st.panu?'panuelo':null;if(hk==='campero'){hat.position.y=-.025;hat.scale.setScalar(.92)}if(hk)hat.add(modHat(hk,hk==='campero'?st.hatc:hk==='gorra'?st.gorra:st.panu));
 /* huesos de mentira para que el código antiguo (brazos, piernas) siga funcionando sin romper nada */
 const dm=()=>new THREE.Group();const legs=[0,1].map(()=>({hip:dm(),kn:dm()})),arms=[1,-1].map(s=>{const sh=dm(),el=dm(),hand=dm();sh.add(el);el.add(hand);return {sh,el,hand,s}});
 const mixer=new THREE.AnimationMixer(sc),acts={};for(const c of src.animations)acts[c.name]=mixer.clipAction(c);
 for(const k of ['Hit_Chest','Dodge_Left','Dodge_Right'])if(acts[k]){acts[k].setLoop(THREE.LoopOnce);acts[k].clampWhenFinished=true}
 const P={root,b,legs,arms,head,hat,ph:Math.random()*6,gl:{mixer,acts,cur:null,want:null,t:Math.random()*8}};
 modPlay(P,'Idle_Loop',0);acts.Idle_Loop&&(acts.Idle_Loop.time=Math.random()*2);return P}
function modPlay(P,name,fade=.25,ts=1){const G=P.gl,a=G.acts[name];if(!a)return;a.timeScale=ts;if(G.cur===name)return;const o=G.cur&&G.acts[G.cur];
 a.reset();a.setEffectiveWeight(1);a.play();if(o&&fade>0)o.crossFadeTo(a,fade,false);else if(o)o.stop();G.cur=name}
function modAnimPerson(P,dt,sp){const G=P.gl;G.t+=dt;let k,ts=1;
 if(G.want){k=G.want;ts=G.wts||1}
 else if(sp<.05){k=(G.t%14)>10?'Idle_LookAround_Loop':'Idle_Loop'}
 else if(sp<.5){k='Walk_Loop';ts=clamp(sp/.33,.6,1.5)}
 else if(sp<1){k='Jog_Fwd_Loop';ts=clamp(sp/.8,.75,1.3)}
 else{k='Sprint_Loop';ts=clamp(sp/1.4,.8,1.2)}
 modPlay(P,k,.22,ts);G.mixer.update(dt)}

envolver('makePerson','modelos',_makePersonM=>function(st){if(st&&st.gl&&MOD.per&&MOD.reg&&!st.traje&&!st.pole){try{return makePersonGL(st)}catch(e){console.warn('persona GL',e)}}return _makePersonM(st)});

envolver('animPerson','modelos',_animPersonM=>function(P,dt,sp,pose){if(P&&P.gl){if(pose==='kneel'&&P.gl.acts.Crouch_Idle_Loop){P.gl.want='Crouch_Idle_Loop'}modAnimPerson(P,dt,sp);return}return _animPersonM(P,dt,sp,pose)});

/* ---------- caballo ---------- */
const HSC=.0031,HOFF=.4;
function makeHorseGL(o){const src=MOD.hor;const sc=THREE.SkeletonUtils.clone(src.scene);const col=o.col||'#5b3f2d',dk=o.dark||'#1d140e';
 sc.traverse(m=>{if(!m.isMesh)return;const ms=Array.isArray(m.material)?m.material:[m.material];
  const nm=ms.map(x=>{const dark=x.color&&(x.color.r+x.color.g+x.color.b)<.08;return new THREE.MeshStandardMaterial({color:dark?dk:col,roughness:dark?.85:.62,metalness:0,skinning:true,name:x.name})});
  m.material=nm.length===1?nm[0]:nm;m.castShadow=true;m.frustumCulled=false});
 sc.scale.multiplyScalar(HSC);
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);body.position.y=-HOFF;const mdl=new THREE.Group();mdl.position.y=HOFF;mdl.add(sc);body.add(mdl);
 const G=geos();
 if(o.saddle!==false){const sd=M('#3a2414',.55);mesh(G.box,sd,.46,.08,.6,0,1.52+HOFF,-.02,body);mesh(G.box,M('#7a1525',.7),.5,.03,.66,0,1.47+HOFF,-.02,body,true);
  for(const s of [1,-1]){mesh(G.box,sd,.02,.42,.05,s*.24,1.3+HOFF,.05,body,true);mesh(G.box,M('#9aa0a6',.3,.8),.08,.03,.1,s*.26,1.06+HOFF,.05,body,true)}}
 const dm=()=>new THREE.Group();const legs=[0,1,2,3].map(i=>({hip:dm(),kn:dm(),f:i<2?1:0})),nk=dm(),hd=dm(),tp=dm();nk.add(hd);
 const mixer=new THREE.AnimationMixer(sc),acts={};for(const c of src.animations)acts[c.name.replace(/^.*\|/,'')]=mixer.clipAction(c);
 const H={root,body,legs,nk,hd,tp,ph:Math.random()*6,gl:{mixer,acts,cur:null,t:0}};modPlay(H,'Idle',0);if(acts.Idle)acts.Idle.time=Math.random()*5;
 root.scale.setScalar(1);return H}

envolver('makeHorse2','modelos',_makeHorse2M=>function(o={}){if(MOD.hor&&!o.peto&&!o.mule){try{return makeHorseGL(o)}catch(e){console.warn('caballo GL',e)}}return _makeHorse2M(o)});

envolver('animHorse','modelos',_animHorseM=>function(H,dt,sp){if(H&&H.gl){let k,ts=1;
  if(sp<.03)k='Idle';else if(sp<.45){k='WalkSlow';ts=clamp(sp/.3,.7,1.4)}else if(sp<.95){k='Walk';ts=clamp(sp/.65,.8,1.4)}else{k='Run';ts=clamp(sp/1.2,.85,1.25)}
  modPlay(H,k,.3,ts);H.gl.mixer.update(dt);H.ph+=dt*(sp>.02?3+sp*5:0);H.body.position.y=-HOFF+(k==='Run'?Math.abs(Math.sin(H.ph))*.04:0);return}
 return _animHorseM(H,dt,sp)});

/* ---------- bous al carrer: los recortadores con animación real ---------- */
if(typeof calleTick==='function'){const _ctM=calleTick;
 calleTick=function(dt){if(CL&&CL.ppl)for(const p of CL.ppl){const G=p.m&&p.m.gl;if(!G)continue;
   if(p.toss>0){const ph=2.2-p.toss;G.want=ph<1.7?'Hit_Chest':null;G.wts=.6}
   else if(p.dodge>0){G.want=(p.dx||0)>0?'Dodge_Left':'Dodge_Right';G.wts=1.3}
   else if(p.jump>0){G.want='Jump_Loop';G.wts=1.4}
   else if(p.cite>0){G.want='Celebration';G.wts=1.5}
   else G.want=null}
  return _ctM(dt)}}

/* créditos */
const MOD_CRED='Modelos 3D animados: Quaternius (CC0) · Universal Base Characters, Universal Animation Library, Farm Animals y Ultimate Animated Animals';
try{if(document.readyState!=='loading')modLoad();else document.addEventListener('DOMContentLoaded',modLoad)}catch(e){MOD.err=e}
