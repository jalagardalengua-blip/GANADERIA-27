/* ===================== TOROS Y VACAS CON ANIMACIÓN REAL =====================
   Modelos: "Ultimate Animated Animals" de Quaternius (CC0): toro y vaca con el mismo esqueleto,
   así que la vaca usa las animaciones del toro (andar, galope, embestida, comer, muerte...).
   Del juego se conserva todo lo que distingue a cada res: el pelo y las señas (bragado, lucero,
   calcetero, rabicano) se pintan por vértice, los cuernos son los procedurales según la genética
   (veleto, cornalón, playero...) anclados al hueso de la cabeza, y las hechuras escalan el cuerpo.
   Si los modelos no cargan, se sigue usando el toro procedural de siempre. */
const TOR={bull:null,cow:null,err:null,info:{},geo:new Map(),mat:null};
/* s: escala del toro procedural (se conserva en root para el código que la usa); f: tamaño real del modelo para que
   la altura a la cruz coincida con la del procedural (toro 1,38 m, vaca 1,21 m, becerro 0,79 m, cabestro 1,49 m); z: alargado */
const TOR_KIND={toro:{s:.78,m:'bull',f:.89,z:1.06},cabestro:{s:.84,m:'bull',f:.96,z:1.04},vaca:{s:.72,m:'cow',f:.84,z:1.03},becerro:{s:.44,m:'cow',f:.55,z:1}};
const TOR_BASE=(()=>{try{const s=document.currentScript&&document.currentScript.src;if(s&&/\/js\/toros3d\.js/.test(s))return s.replace(/js\/toros3d\.js.*$/,'')}catch(e){}return ''})();

function torLoad(){if(!THREE.GLTFLoader||!THREE.SkeletonUtils){TOR.err='sin cargador';return}
 const L=new THREE.GLTFLoader();let n=0;
 const fin=()=>{if(++n<2)return;try{if(TOR.bull&&TOR.cow&&typeof W3!=='undefined'&&W3&&W3.mode==='finca'&&!W3.ride&&typeof S!=='undefined'&&S)rebuildFinca()}catch(e){}};
 L.load(TOR_BASE+'modelos/toro.glb',g=>{TOR.bull=g;fin()},undefined,e=>{TOR.err=e;fin()});
 L.load(TOR_BASE+'modelos/vaca.glb',g=>{TOR.cow=g;fin()},undefined,e=>{TOR.err=e;fin()})}

/* datos de cada modelo en su pose de reposo: puntos del lomo, base de los cuernos y largo */
function torInfo(key){if(TOR.info[key])return TOR.info[key];
 const sc=TOR[key].scene;sc.updateMatrixWorld(true);const pts=[],v=new THREE.Vector3();let horn=null,zMin=1e9,zMax=-1e9;
 sc.traverse(o=>{if(!o.isSkinnedMesh)return;const nm=o.material.name,p=o.geometry.attributes.position;
  if(nm==='Horns'){const bb=new THREE.Box3().setFromObject(o);horn={y:bb.min.y+(bb.max.y-bb.min.y)*.3,z:(bb.min.z+bb.max.z)/2}}
  if(nm==='Main'||nm==='Main_Light')for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);pts.push(v.x,v.y,v.z);zMin=Math.min(zMin,v.z);zMax=Math.max(zMax,v.z)}});
 const back=z=>{let y=0;for(let i=0;i<pts.length;i+=3)if(Math.abs(pts[i+2]-z)<.18&&Math.abs(pts[i])<.22&&pts[i+1]>y)y=pts[i+1];return y};
 const L=zMax-zMin,zc=z=>zMin+L*z;   // z relativo: 0 = rabo, 1 = morro
 const I={L,zMin,zMax,horn,back,cruz:zc(.47),band:zc(.54),div:zc(.57),top:back(zc(.47))};TOR.info[key]=I;return I}

/* malla base de cada parte: superficie suavizada (sin facetas) y hechuras de toro de lidia esculpidas en la pose de reposo:
   morrillo alto sobre el cuello y la cruz, pecho hondo con papada, cuerpo más redondo y cara más corta y ancha. */
TOR.base=new Map();
const TOR_LUZ=.58;   // el pelo del modelo se ve bajo la luz fuerte de la plaza: se ajusta a la luminosidad del toro procedural
function torMalla(key,o,nm){const k=key+'|'+nm;if(TOR.base.has(k))return TOR.base.get(k);let g=o.geometry.clone();
 try{if(THREE.BufferGeometryUtils){g.deleteAttribute('normal');if(g.attributes.uv)g.deleteAttribute('uv');if(g.attributes.uv2)g.deleteAttribute('uv2');g=THREE.BufferGeometryUtils.mergeVertices(g,1e-4)}}catch(e){g=o.geometry.clone()}
 if(key==='bull'&&/^(Main|Main_Light|Muzzle)$/.test(nm)){const I=torInfo(key),p=g.attributes.position,v=new THREE.Vector3(),M4=o.matrixWorld,inv=new THREE.Matrix4().copy(M4).invert();
  const bump=(t,c,w)=>{const d=(t-c)/w;return d*d<1?(1-d*d)*(1-d*d):0};
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(M4);const zr=(v.z-I.zMin)/I.L,yn=v.y/I.top,ax=Math.abs(v.x);
   // morrillo: abultamiento sobre el cuello y la cruz
   const mo=bump(zr,.66,.16)*Math.max(0,(yn-.62)/.38);v.y+=mo*.13*I.top;v.x*=1+mo*.18;
   // pecho hondo y papada
   const pe=bump(zr,.72,.14)*Math.max(0,(.62-yn)/.62);v.y-=pe*.09*I.top;v.z+=pe*.03*I.L;
   // cuerpo más redondo y lomo recto
   const cu=bump(zr,.45,.3)*(yn>.3?1:0);v.x*=1+cu*.1;
   // cuartos traseros algo más recogidos (toro de lidia, no de carne)
   const cq=bump(zr,.14,.14)*(yn>.45?1:0);v.x*=1-cq*.06;
   // cabeza: cara más corta y testuz ancha
   if(zr>.86){const t=(zr-.86)/.14;v.z-=t*t*.05*I.L;v.x*=1+t*.08}
   v.applyMatrix4(inv);p.setXYZ(i,v.x,v.y,v.z)}}
 g.computeVertexNormals();TOR.base.set(k,g);return g}

/* pelo por vértice: degradado del lomo al vientre, salpicado, manchas de berrendo y señas */
function torColors(key,spec,m){const ck=key+'|'+(spec.pelo||'negro')+'|'+(spec.kind||'toro')+'|'+(m.bragado?1:0)+(m.lucero?1:0)+(m.calcetero?1:0)+(m.rabicano?1:0);
 if(TOR.geo.has(ck))return TOR.geo.get(ck);
 const I=torInfo(key),[base,hi,pat]=PELO[spec.pelo]||PELO.negro,cB=new THREE.Color(base),cH=new THREE.Color(hi),cD=new THREE.Color(shade(base,-.35)),cW=new THREE.Color('#ece4d6');
 const cow=key==='cow',r=mulberry((spec.pelo||'negro').length*17+(cow?5:0)),blobs=[];
 if(pat===2)for(let i=0;i<7;i++)blobs.push({x:(r()-.5)*.7,y:I.top*(.45+r()*.5),z:I.zMin+I.L*(.12+r()*.62),rx:.18+r()*.2,ry:.16+r()*.16,rz:.22+r()*.3});
 const out={},v=new THREE.Vector3(),c=new THREE.Color(),sc=TOR[key].scene;sc.updateMatrixWorld(true);
 sc.traverse(o=>{if(!o.isSkinnedMesh)return;const nm=o.material.name;if(!/^(Main|Main_Light|Muzzle|Hooves)$/.test(nm))return;
  const g=torMalla(key,o,nm).clone(),p=g.attributes.position,n=p.count,a=new Float32Array(n*3);
  for(let i=0;i<n;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);const x=v.x,y=v.y,z=v.z,zr=(z-I.zMin)/I.L,yn=y/I.top;
   if(nm==='Hooves')c.set('#15100c');
   else if(nm==='Muzzle')c.set(cow&&zr<.9?'#c99a8c':'#120d0a');
   else{
    if(yn>.8)c.copy(cB).lerp(cH,Math.min(1,(yn-.8)/.25)*.7);else if(yn<.55)c.copy(cB).lerp(cD,Math.min(1,(.55-yn)/.35));else c.copy(cB);
    if(nm==='Main_Light')c.lerp(cH,.12);
    if(pat===1){const q=r();if(q<.16)c.lerp(cW,.16);else if(q<.55)c.lerp(cD,.45)}
    for(const b of blobs){const d=((x-b.x)/b.rx)**2+((y-b.y)/b.ry)**2+((z-b.z)/b.rz)**2;if(d<1){c.copy(cW);break}}
    if(m.bragado&&yn<.62&&zr>.25&&zr<.7&&Math.abs(x)<.3)c.copy(cW);
    if(m.calcetero&&y<.34&&zr<.95)c.copy(cW);
    if(m.lucero&&zr>.9&&y>I.horn.y-.1&&Math.abs(x)<.06)c.copy(cW);
    if(m.rabicano&&zr<.06&&y<I.top*.62)c.copy(cW);
    const k=(.94+r()*.1)*TOR_LUZ;c.r*=k;c.g*=k;c.b*=k}
   a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b}
  g.setAttribute('color',new THREE.BufferAttribute(a,3));
  g.computeBoundingBox();g.boundingSphere=new THREE.Sphere();g.boundingBox.getBoundingSphere(g.boundingSphere);g.boundingSphere.radius*=1.7;
  out[nm]=g});
 TOR.geo.set(ck,out);return out}

/* grupo hijo de un hueso cuya posición en reposo coincide con un punto del espacio del toro (b) */
function torAnchor(bone,b,pos,scale,pitch=0){const g=new THREE.Group();b.updateMatrixWorld(true);
 const want=new THREE.Matrix4().compose(pos,new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,0,0)),new THREE.Vector3(scale,scale,scale)).premultiply(b.matrixWorld);
 const loc=new THREE.Matrix4().copy(bone.matrixWorld).invert().multiply(want);loc.decompose(g.position,g.quaternion,g.scale);bone.add(g);return g}

function makeBullGL(spec){
 const G=geos(),kind=spec.kind||'toro',cow=kind==='vaca'||kind==='becerro',calf=kind==='becerro',cab=kind==='cabestro',KD=TOR_KIND[kind]||TOR_KIND.toro;
 const m=spec.m||{len:1,alt:1,morr:cow?.25:.9,leg:1,girth:1,papada:1,horn:cab?'cab':cow?'lira':'veleto',hl:calf?.25:cab?1.25:1,ht:cow?.03:.05,hc:'#e2d6bc'};
 const key=KD.m,src=TOR[key],I=torInfo(key),geo=torColors(key,spec,m);
 if(!TOR.mat)TOR.mat=new THREE.MeshStandardMaterial({vertexColors:true,skinning:true,roughness:.58,metalness:0});
 const sc=THREE.SkeletonUtils.clone(src.scene);const bones={};
 sc.traverse(o=>{if(o.isBone)bones[o.name]=o;if(!o.isSkinnedMesh)return;const nm=o.material.name;
  if(nm==='Horns'){o.visible=false;return}
  if(geo[nm]){o.geometry=geo[nm];o.material=TOR.mat}
  o.castShadow=true;o.receiveShadow=false});
 const root=new THREE.Group(),b=new THREE.Group();root.add(b);const mdl=new THREE.Group();b.add(mdl);mdl.add(sc);
 const k=KD.f/KD.s,sx=k*(m.girth||1)*(cow&&!calf?.95:1),sy=k*(m.alt||1)*(.75+.25*(m.leg||1)),sz=k*(m.len||1)*KD.z;mdl.scale.set(sx,sy,sz);
 /* morrillo: el hueso del pecho crece y el cuello lo compensa para que la cabeza no cambie */
 if(!cow&&bones.Torso3&&bones.Neck1){const f=1+.14*(m.morr??.9)*(cab?.5:1);bones.Torso3.scale.setScalar(f);bones.Neck1.scale.setScalar(1/f)}
 root.updateMatrixWorld(true);
 /* cabeza: cuernos del juego según la genética */
 const hs=calf?1.28:cow?.84:cab?1.05:1;
 const hp=torAnchor(bones.Head,b,new THREE.Vector3(0,I.horn.y*sy-.08*hs,I.horn.z*sz-.15*hs),hs,.28);
 for(const s of [1,-1]){const h=new THREE.Mesh(hornGeo(m.horn||'veleto',m.hl||1,m.ht||.05,m.hc||'#e2d6bc'),hornMat());h.castShadow=true;h.position.set(0,.08,.15);h.scale.set(s,1,1);hp.add(h)}
 if(cab){mesh(G.cyl,M('#8a6a2a',.35,.6),.13,.24,.13,0,-.55,.2,hp);mesh(G.box,M('#3a2a1c'),.06,.3,.06,0,-.35,.2,hp,true)}
 const hpq=hp.quaternion.clone();
 /* lomo: divisa y banderillas */
 const spine=bones.Torso3||bones.Torso2||bones.Body;
 const bg=torAnchor(spine,b,new THREE.Vector3(0,I.back(I.band)*sy-.04,I.band*sz),1);
 if(spec.div){const dv=torAnchor(spine,b,new THREE.Vector3(0,I.back(I.div)*sy,I.div*sz),1);{const dl=spec.div,nn=Math.max(2,dl.length);for(let i=0;i<nn;i++){const k=i-(nn-1)/2;const r=new THREE.Mesh(new THREE.PlaneGeometry(.07,.42),M(dl[i%dl.length],.7,0,THREE.DoubleSide));r.position.set(k*.07,-.12,0);r.rotation.set(.3,0,-k*.5);dv.add(r)}};mesh(G.sph,M(spec.div[0],.6),.06,.06,.06,0,.02,0,dv,true)}
 const cols=['#bf3a3f','#e6bb55','#1f6b3a','#3a78b8','#f1ece0','#5b2a6e'];
 for(let i=0;i<6;i++){const s=new THREE.Group();s.position.set((i%2?.12:-.12),0,(Math.floor(i/2)-1)*.18);s.rotation.set(-.5,0,(i%2?-.3:.3));
  mesh(G.cyl,M('#efe6d2'),.018,.75,.018,0,.37,0,s,true);for(let j=0;j<3;j++)mesh(G.box,M(cols[(i+j)%6],.6),.07,.12,.07,0,.5+j*.12,0,s,true);s.visible=false;bg.add(s)}
 root.scale.setScalar(KD.s);
 const mixer=new THREE.AnimationMixer(sc),acts={};for(const c of TOR.bull.animations)acts[c.name]=mixer.clipAction(c);
 const B={root,b,hp,hpq,legs:[],tp:new THREE.Group(),bg,ph:Math.random()*6,kind,hipY:1,t:Math.random()*10,
  cruz:{y:I.back(I.cruz)*sy,z:I.cruz*sz},gl:{mixer,acts,cur:null,neck:bones.Neck2||bones.Neck1||null}};
 torPlay(B,'Idle',0);if(acts.Idle)acts.Idle.time=Math.random()*3;return B}

function torPlay(B,name,fade=.25,ts=1){const G=B.gl,a=G.acts[name];if(!a)return;a.timeScale=ts;if(G.cur===name)return;const o=G.cur&&G.acts[G.cur];
 a.reset();a.paused=false;a.setEffectiveWeight(1);a.play();if(o&&fade>0)o.crossFadeTo(a,fade,false);else if(o)o.stop();G.cur=name}

const TOR_Q=new THREE.Quaternion(),TOR_V=new THREE.Vector3(),TOR_W=new THREE.Quaternion();
function animBullGL(B,dt,o){const G=B.gl,sp=o.speed||0,campo='limp' in o;B.t+=dt;let k,ts=1,pose=null;
 if(o.fall>0){k='Death';pose=Math.min(.98,o.fall)}
 else if(o.kneel>0){k='Death';pose=.4+Math.min(1,o.kneel)*.1}
 else if(o.toss>.05){k='Attack_Headbutt';ts=1.25}
 else if(o.push){k=sp<.05?'Idle_Headlow':'Walk';ts=.8}
 else if(o.paw){k='Idle_Headlow'}
 else if(sp<.03){const h=o.head??.3;k=campo&&h>=.85&&B.kind!=='cabestro'?'Eating':h>=.75?'Idle_Headlow':((B.t%17)>12?'Idle_2':'Idle')}
 else if(sp<1){k='Walk';ts=clamp(sp/.55,.45,1.8)}
 else{k='Gallop';ts=clamp(sp/1.15,.8,1.45)}
 if(o.limp&&k==='Walk')ts*=.7;
 torPlay(B,k,pose!=null?.2:.28,ts);
 if(pose!=null){const a=G.acts[k];a.paused=true;a.time=pose*a.getClip().duration}
 G.mixer.update(dt);
 B.hp.quaternion.copy(B.hpq);
 /* mirar a un lado girando el cuello sobre la vertical del mundo */
 const lk=o.look||0;if(G.neck&&Math.abs(lk)>.01&&pose==null){G.neck.updateWorldMatrix(true,false);G.neck.getWorldQuaternion(TOR_W).invert();TOR_V.set(0,1,0).applyQuaternion(TOR_W).normalize();TOR_Q.setFromAxisAngle(TOR_V,lk*.45);G.neck.quaternion.multiply(TOR_Q)}}

const _makeBullM=makeBull;
makeBull=function(spec){const KD=TOR_KIND[(spec&&spec.kind)||'toro'];
 if(KD&&TOR.bull&&TOR[KD.m]&&!(spec&&spec.proc)){try{return makeBullGL(spec)}catch(e){console.warn('toro GL',e)}}return _makeBullM(spec)};
const _animBullM=animBull;
animBull=function(B,dt,o){if(B&&B.gl)return animBullGL(B,dt,o||{});return _animBullM(B,dt,o)};

try{if(document.readyState!=='loading')torLoad();else document.addEventListener('DOMContentLoaded',torLoad)}catch(e){TOR.err=e}
