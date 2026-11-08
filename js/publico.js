/* ===================== PÚBLICO REALISTA (plaza en directo y fiestas de pueblo) =====================
   Cada espectador es una figura de unos 120 triángulos con piel, ropa de arriba, pantalón o falda, pelo, zapatos,
   y opcionalmente abanico, pañuelo y sombrero. Todo el público de una zona es UNA malla instanciada y la animación
   va en la tarjeta gráfica (shader): no cuesta nada al procesador aunque haya miles de personas.
   - Miran la acción: la cabeza sigue al toro (uFocus).
   - Olé: se levantan los brazos, unos antes que otros.  Aplausos: palmas delante del pecho.
   - Pañuelos blancos para pedir la oreja (uPanu); la presidencia saca el suyo con su color (uPresi).
   - Abanicos al sol, sombreros de paja, peñas con camiseta y pañuelo al cuello del mismo color.
   Se reparte por zonas (sectores) y cada zona se oculta si la cámara no la ve.
   Uso: const P=Publico.crear(asientos,{sentado:true,paleta:'plaza'}); escena.add(P.grupo); P.tick(dt,camara);
   asiento: {x,y,z,yaw,sit,sol,presi,grupo:'#hex' (peña),nino} — y es la superficie donde se apoya (asiento o suelo). */
(function(){
'use strict';
if(!window.THREE)return;
const TH=window.THREE;

/* ---------- geometría de una persona (mira hacia +Z) ---------- */
// rig: 0 cuerpo · 1 cabeza · 2 brazo izq · 3 brazo der · 4 abanico (mano der) · 5 pañuelo (mano der) · 6 pelo largo (cabeza)
// parte (color): 0 piel · 1 arriba · 2 abajo · 3 pelo · 4 zapatos · 5 abanico · 6 pañuelo · 7 sombrero · 8 pañuelo al cuello
function persona(sentado){
 const P=[],N=[],PA=[],RG=[],IX=[];const m=new TH.Matrix4(),q=new TH.Quaternion(),e=new TH.Euler(),s=new TH.Vector3(),p=new TH.Vector3();
 function add(g,parte,rig,px,py,pz,sx,sy,sz,rx,ry,rz){g=g.index?g:g;if(!g.index){const n=g.attributes.position.count;g.setIndex([...Array(n).keys()])}
  e.set(rx||0,ry||0,rz||0);q.setFromEuler(e);s.set(sx,sy,sz);p.set(px,py,pz);m.compose(p,q,s);g.applyMatrix4(m);
  const a=g.attributes.position,n=g.attributes.normal,o=P.length/3;for(let i=0;i<a.count;i++){P.push(a.getX(i),a.getY(i),a.getZ(i));N.push(n.getX(i),n.getY(i),n.getZ(i));PA.push(parte);RG.push(rig)}
  const ix=g.index.array;for(let i=0;i<ix.length;i++)IX.push(ix[i]+o)}
 const box=()=>new TH.BoxGeometry(1,1,1);
 const L=sentado?{hip:.06,sh:.56,neck:.6,head:.74}:{hip:.86,sh:1.36,neck:1.4,head:1.55};
 // piernas
 if(sentado){add(box(),2,0, 0,.1,.2, .36,.15,.44);            // muslos (horizontales)
  add(box(),2,0, 0,-.19,.43, .34,.46,.14);}                    // espinillas
 else{add(box(),2,0, 0,.44,0, .34,.86,.2);}
 // tronco: más ancho de hombros que de cintura
 const tr=new TH.CylinderGeometry(.5,.42,1,4,3);{const a=tr.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i);if(Math.abs(y-1/6)<.01)a.setY(i,.36);else if(Math.abs(y+1/6)<.01)a.setY(i,-.1)}}tr.rotateY(Math.PI/4);
 add(tr,1,0, 0,L.hip+(L.sh-L.hip)/2+.02,0, .44,L.sh-L.hip+.06,.27);
 // cabeza: los vértices de arriba y de detrás son pelo (sin malla aparte)
 const hd=new TH.OctahedronGeometry(1,1);const hs=[];{const a=hd.attributes.position;for(let i=0;i<a.count;i++)hs.push(a.getY(i)>.2||(a.getZ(i)<-.3&&a.getY(i)>-.4)?3:0)}
 {const o0=P.length/3;add(hd,0,1, 0,L.head,.01, .105,.13,.115);for(let i=0;i<hs.length;i++)PA[o0+i]=hs[i];}
 add(box(),3,6, 0,L.head-.1,-.07, .17,.2,.07);                  // pelo largo
 // brazos (hombro en ±.2, L.sh): manga y mano; sentado, la mano cae sobre el muslo
 for(const sg of [-1,1]){const rig=sg<0?2:3,x=sg*.235;
  const hand=()=>new TH.OctahedronGeometry(1,0);
  if(sentado){add(box(),1,rig, x,L.sh-.2,.07, .1,.42,.11, -.35,0,0);add(hand(),0,rig, x,L.sh-.44,.17, .05,.07,.055, -.35,0,0);}
  else{add(box(),1,rig, x,L.sh-.24,0, .1,.5,.11);add(hand(),0,rig, x,L.sh-.54,.0, .05,.07,.055);}}
 // abanico y pañuelo en la mano derecha (se colapsan si no se usan)
 const hand=sentado?[.235,L.sh-.47,.2]:[.235,L.sh-.6,0];
 const fan=new TH.CircleGeometry(.17,6,0,Math.PI);add(fan,5,4, hand[0],hand[1]-.02,hand[2]+.03, 1,1,1, Math.PI/2,0,Math.PI);
 const pan=new TH.PlaneGeometry(.22,.22);add(pan,6,5, hand[0],hand[1]-.13,hand[2], 1,1,1, 0,Math.PI/2,0);
 const g=new TH.BufferGeometry();g.setAttribute('position',new TH.Float32BufferAttribute(P,3));g.setAttribute('normal',new TH.Float32BufferAttribute(N,3));
 g.setAttribute('aPart',new TH.Float32BufferAttribute(PA,1));g.setAttribute('aRig',new TH.Float32BufferAttribute(RG,1));g.setAttribute('color',new TH.Float32BufferAttribute(new Array(PA.length*3).fill(1),3));g.setIndex(IX);
 g.userData={L,hand};return g}
function sombrero(sentado){const L=sentado?.74:1.55;const g=new TH.BufferGeometry();const parts=[];
 const brim=new TH.CylinderGeometry(.21,.22,.018,8,1);brim.translate(0,L+.075,0);const crown=new TH.CylinderGeometry(.095,.11,.1,8,1);crown.translate(0,L+.13,0);
 const P=[],N=[],IX=[];for(const s of [brim,crown]){const a=s.attributes.position,n=s.attributes.normal,o=P.length/3;for(let i=0;i<a.count;i++){P.push(a.getX(i),a.getY(i),a.getZ(i));N.push(n.getX(i),n.getY(i),n.getZ(i))}for(const i of s.index.array)IX.push(i+o)}
 const n=P.length/3;g.setAttribute('position',new TH.Float32BufferAttribute(P,3));g.setAttribute('normal',new TH.Float32BufferAttribute(N,3));
 g.setAttribute('aPart',new TH.Float32BufferAttribute(new Array(n).fill(7),1));g.setAttribute('aRig',new TH.Float32BufferAttribute(new Array(n).fill(1),1));g.setAttribute('color',new TH.Float32BufferAttribute(new Array(n*3).fill(1),3));g.setIndex(IX);return g}

/* ---------- material: Lambert (recibe sombras) con colores por parte y animación ---------- */
function material(U,geoL,hand){const m=new TH.MeshLambertMaterial({vertexColors:true});const L=geoL;const HP=hand.map(v=>v.toFixed(3)).join(',');
 m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
  sh.vertexShader=`attribute float aPart;attribute float aRig;attribute vec3 iTop;attribute vec3 iBot;attribute vec3 iSkin;attribute vec3 iHair;attribute vec4 iProp;
uniform float uTime,uOle,uPanu,uClap,uPitos,uFanOn;uniform vec3 uFocus;uniform vec3 uPresi;
mat3 pRX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 pRY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 pRZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
`+sh.vertexShader.replace('#include <beginnormal_vertex>',`
 float seed=iProp.z;vec3 objectNormal=normal;vec3 pP=position;
 float shY=${L.sh.toFixed(3)},neckY=${L.neck.toFixed(3)};
 // a quién le toca: cada persona reacciona con su propio umbral
 float r1=fract(seed*7.31),r2=fract(seed*13.7),r3=fract(seed*3.17),r4=fract(seed*29.3);
 float ole=smoothstep(r1*.7,r1*.7+.2,uOle);
 float pan=uPanu*step(r2,.62+.3*iProp.w);
 float clap=uClap*step(.18,r3)*(1.-pan);
 float fan=iProp.x*uFanOn*(1.-ole)*(1.-pan);
 float pito=uPitos*step(r4,.45);
 // brazos: ángulo hacia delante/arriba (X) y hacia dentro (Z)
 float upR=0.,upL=0.,inR=0.,inL=0.;
 float w=uTime*(6.+r2*4.)+seed*40.;
 upR=max(upR,clap*1.25);upL=max(upL,clap*1.25);inR=clap*(.32+.16*sin(uTime*13.+seed*30.));inL=inR;
 upR=max(upR,fan*1.75);
 upR=max(upR,pito*1.4);
 upR=mix(upR,2.7+.12*sin(w),ole);upL=mix(upL,(r3>.35?2.6:.3)+.12*sin(w+1.),ole);float spR=.28*ole,spL=.28*ole*step(.35,r3);
 upR=mix(upR,2.75,pan);spR=mix(spR,.2+.3*sin(uTime*9.+seed*50.),pan);
 if(aRig>1.5&&aRig<5.5){float sg=aRig<2.5?-1.:1.;float up=sg<0.?upL:upR,inw=sg<0.?inL:inR,spr=sg<0.?spL:spR;
  vec3 pv=vec3(sg*.235,shY,0.);mat3 R=pRY(-sg*inw)*pRZ(sg*spr)*pRX(-up);vec3 hp=vec3(${HP});
  if(aRig>3.5&&aRig<4.5){pP=hp+(pP-hp)*step(.5,fan);pP=hp+pRY(.6*sin(uTime*8.+seed*20.))*(pP-hp);}
  if(aRig>4.5){float vis=step(.5,pan+step(.5,iProp.w)*step(.01,uPanu));pP=hp+(pP-hp)*vis;pP.x+=.06*sin(uTime*10.+seed*31.+pP.y*9.)*vis;}
  pP=pv+R*(pP-pv);objectNormal=R*objectNormal;}
 // cabeza: sigue la acción, con algo de despiste propio
 if(aRig>.5&&aRig<1.5||aRig>5.5){vec3 wp=(modelMatrix*instanceMatrix[3]).xyz;mat3 IM=mat3(instanceMatrix);vec3 d=uFocus-wp;vec3 ld=transpose(IM)*d;
  float yaw=clamp(atan(ld.x,ld.z),-1.2,1.2)*.85+.35*sin(uTime*.23+seed*31.)*(1.-ole);float pit=clamp(atan(-ld.y,length(ld.xz)),-.5,.6)*.6;
  vec3 pv=vec3(0.,neckY,0.);mat3 R=pRY(yaw)*pRX(pit-.25*pan);pP=pv+R*(pP-pv);objectNormal=R*objectNormal;
  if(aRig>5.5)pP=pv+(pP-pv)*step(.45,fract(seed*3.1)) ;}
 // de pie en el olé grande, pequeño balanceo siempre
 pP.y+=.1*ole*step(r4,.4)+.012*sin(uTime*1.3+seed*20.);
 pP.x+=.02*sin(uTime*.7+seed*12.);
`).replace('#include <begin_vertex>','vec3 transformed=pP;').replace('#include <color_vertex>',`
 #if defined(USE_COLOR)
 float pa=aPart,sd=iProp.z;vec3 cc=iTop;
 if(pa<.5)cc=iSkin;else if(pa<1.5)cc=iTop;else if(pa<2.5)cc=iBot;else if(pa<3.5)cc=iHair;else if(pa<4.5)cc=vec3(.05,.045,.04);
 else if(pa<5.5){float fc=fract(sd*5.3);cc=fc<.3?vec3(.03,.03,.03):fc<.55?vec3(.85,.8,.68):fc<.75?vec3(.45,.05,.06):fc<.9?vec3(.1,.2,.42):vec3(.62,.5,.18);}
 else if(pa<6.5)cc=iProp.w>.5?uPresi:vec3(.95,.95,.92);
 else if(pa<7.5)cc=fract(sd*2.9)<.75?vec3(.72,.6,.36):vec3(.92,.9,.84);
 else cc=iTop;
 if(pa>.5&&pa<1.5&&iProp.y>.5&&position.y>${(L.sh-.05).toFixed(3)})cc=vec3(.55,.03,.04);
 vColor=vec4(cc,1.).rgb;
 #endif`);};
 m.customProgramCacheKey=()=>'publico'+L.sh;return m}

/* ---------- vestuario ---------- */
const C=h=>new TH.Color(h).convertSRGBToLinear();
const PAL={
 plaza:{
  sol:['#f4f2ec','#f1efe7','#e9eef5','#cfe0ef','#a9c4de','#f3e6cf','#e8d7b5','#f2d9d4','#d9e6d0','#f6f1e0','#c8d3dc','#ffffff','#e6dcc8','#b8cfe0','#e7c873','#d65a4f','#7fa9c9','#efe2a6'],
  sombra:['#23293a','#2f3a52','#3b3f45','#4a3f33','#1d1f24','#5a4a3a','#6b6f74','#2e4a3a','#7a1f28','#f1efe7','#dfe6ee','#3d4e6e','#594432','#8c8f94','#1a2433','#efe9dc','#a0805a','#3a2c22'],
  abajo:['#2b2f3a','#3a3e47','#1f2229','#d8d0bf','#4a5466','#c9bfa6','#2c3e5c','#6e6a62','#1c1c1f','#8a7a62','#e8e2d4','#5a4f45'],
  vestido:['#a3242e','#1f3f6e','#e8b7c2','#2d5e4a','#f0e6d0','#b84e2a','#5b2b5e','#d9c06a','#141414','#7aa0c9','#c7473f','#efe7da']},
 pueblo:{
  sol:['#f4f2ec','#ffffff','#e9eef5','#cfe0ef','#f3e6cf','#e8d7b5','#d8e8cf','#f6f1e0','#c42a2a','#2b5aa0','#1f6b3a','#e6bb55','#7a2f6e','#e2702a','#262626','#efe7da'],
  sombra:['#f4f2ec','#e9eef5','#3a4b6e','#262626','#c42a2a','#2b5aa0','#1f6b3a','#5a4a3a','#efe7da','#7a2f6e'],
  abajo:['#2a3550','#3b5a8a','#1f2229','#2c3e5c','#d8d0bf','#4a5466','#6e6a62','#1c1c1f','#c9bfa6','#3d6b9a'],
  vestido:['#c42a2a','#2b5aa0','#f0e6d0','#e8b7c2','#1f6b3a','#141414','#e6bb55','#7a2f6e','#efe7da']}};
const PIEL=['#f1c9a5','#e7b48f','#dba27a','#c98d66','#b77a54','#f4d3b5','#a86c4a','#e9bf9c','#d49a72','#8a5a3c'];
const PELO=['#1b1410','#2b1d14','#3d2a1c','#4f3a28','#0f0c0b','#6b4e33','#8c6a46','#b8a07a','#cfc7bb','#e8e3dc','#2a2420','#9b5a2a'];

function crear(asientos,opt){opt=opt||{};const sentado=opt.sentado!==false;const pal=PAL[opt.paleta||'plaza'];const rnd=opt.rnd||Math.random;
 const U={uTime:{value:0},uOle:{value:0},uPanu:{value:0},uClap:{value:0},uPitos:{value:0},uFanOn:{value:1},uFocus:{value:new TH.Vector3()},uPresi:{value:new TH.Color(1,1,1)}};
 const geoS=persona(true),geoD=persona(false),hatS=sombrero(true),hatD=sombrero(false);
 const matS=material(U,geoS.userData.L,geoS.userData.hand),matD=material(U,geoD.userData.L,geoD.userData.hand);
 const grupo=new TH.Group();grupo.name='publico';
 // vestuario de cada asiento
 const pick=a=>a[Math.floor(rnd()*a.length)];const ls=[];
 asientos.forEach(a=>{const sit=a.sit!==undefined?!!a.sit:sentado;const mujer=rnd()<.46,nino=!!a.nino,mayor=!nino&&rnd()<.22;
  let top=C(a.sol?pick(pal.sol):pick(pal.sombra)),bot=C(pick(pal.abajo));
  if(mujer&&rnd()<.5){bot=top.clone();if(rnd()<.7){top=C(pick(pal.vestido));bot=top.clone()}}
  if(a.grupo){top=C(a.grupo);if(rnd()<.6)bot=C(pick(['#f4f2ec','#2a3550','#1f2229']))}
  if(a.presi){top=C('#1d1f26');bot=C('#1d1f26')}
  const skin=C(pick(PIEL));const hair=C(mayor?pick(['#cfc7bb','#e8e3dc','#9a9590','#6e6a66']):pick(PELO));
  const fan=a.sol&&mujer&&rnd()<.3?1:a.sol&&rnd()<.03?1:0;
  const neck=a.grupo&&rnd()<.75?1:0; // pañuelo rojo al cuello de las peñas
  const hat=a.sol&&!mujer&&rnd()<(opt.paleta==='pueblo'?.22:.3)||mayor&&!mujer&&rnd()<.4;
  const sc=nino?.66:(mujer?.94:1)*(.95+rnd()*.1);
  ls.push({a,sit,top,bot,skin,hair,realHair:hair,fan,neck,hat,sc,seed:rnd(),longHair:mujer&&rnd()<.75})});
 // pelo largo: se decide en el shader con fract(seed*3.1)>=.45 → forzamos la semilla según el sexo
 ls.forEach(l=>{let s=l.seed;const f=v=>v-Math.floor(v);for(let k=0;k<40&&(f(s*3.1)>=.45)!==l.longHair;k++)s=f(s+.0617);l.seed=s});
 // sectores por cercanía
 const cell=opt.celda||14;const zonas=new Map();ls.forEach((l,i)=>{const k=Math.floor(l.a.x/cell)+','+Math.floor(l.a.z/cell)+','+(l.sit?1:0);if(!zonas.has(k))zonas.set(k,[]);zonas.get(k).push(l)});
 const mallas=[];const o=new TH.Object3D();
 const build=(lista,geo,mat,isHat)=>{const n=lista.length;if(!n)return null;const g=geo.clone();
  const at={iTop:new Float32Array(n*3),iBot:new Float32Array(n*3),iSkin:new Float32Array(n*3),iHair:new Float32Array(n*3),iProp:new Float32Array(n*4)};
  const im=new TH.InstancedMesh(g,mat,n);let cx=0,cy=0,cz=0;
  lista.forEach((l,i)=>{const a=l.a;o.position.set(a.x,a.y,a.z);o.rotation.set(0,a.yaw,0);o.scale.set(l.sc*(isHat?1:1),l.sc,l.sc);o.updateMatrix();im.setMatrixAt(i,o.matrix);cx+=a.x;cy+=a.y;cz+=a.z;
   l.top.toArray(at.iTop,i*3);l.bot.toArray(at.iBot,i*3);l.skin.toArray(at.iSkin,i*3);(isHat?l.realHair:l.hair).toArray(at.iHair,i*3);
   at.iProp[i*4]=l.fan;at.iProp[i*4+1]=l.neck?1:0;at.iProp[i*4+2]=l.seed;at.iProp[i*4+3]=l.a.presi?1:0});
  for(const k in at)g.setAttribute(k,new TH.InstancedBufferAttribute(at[k],k==='iProp'?4:3));
  cx/=n;cy/=n;cz/=n;let r=0;lista.forEach(l=>{r=Math.max(r,Math.hypot(l.a.x-cx,l.a.y-cy,l.a.z-cz))});
  im.frustumCulled=false;im.receiveShadow=opt.sombras!==false;im.castShadow=false;im.userData.esfera=new TH.Sphere(new TH.Vector3(cx,cy+.8,cz),r+2);im.userData.m0=Float32Array.from(im.instanceMatrix.array);
  grupo.add(im);mallas.push(im);return im};
 for(const lista of zonas.values()){const sit=lista[0].sit;build(lista,sit?geoS:geoD,sit?matS:matD,false);const hs=lista.filter(l=>l.hat);if(hs.length)build(hs,sit?hatS:hatD,sit?matS:matD,true)}
 const fr=new TH.Frustum(),pm=new TH.Matrix4();
 const api={grupo,U,mallas,total:ls.length,
  // nivel de ocupación (0..1): vacía asientos de forma estable
  entrada(fill){const Z=new TH.Matrix4().makeScale(0,0,0).elements;for(const im of mallas){const a=im.instanceMatrix.array;a.set(im.userData.m0);
    for(let i=0;i<im.count;i++){const s=hash(a[i*16+12],a[i*16+14]);if(s>fill)a.set(Z,i*16)}im.instanceMatrix.needsUpdate=true}},
  tick(dt,cam,st){U.uTime.value+=dt;if(st){if(st.foco)U.uFocus.value.copy(st.foco);for(const k of ['ole','panu','clap','pitos']){if(st[k]!=null){const u=U['u'+k[0].toUpperCase()+k.slice(1)];u.value+=(st[k]-u.value)*(1-Math.exp(-(st[k]>u.value?6:1.6)*dt))}}}
   if(cam){pm.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);fr.setFromProjectionMatrix(pm);let vis=0;for(const im of mallas){im.visible=fr.intersectsSphere(im.userData.esfera);if(im.visible)vis+=im.count}api.visibles=vis}},
  presidencia(color){U.uPresi.value.set(color).convertSRGBToLinear()},
  dispose(){for(const im of mallas){im.geometry.dispose()}matS.dispose();matD.dispose();geoS.dispose();geoD.dispose();hatS.dispose();hatD.dispose()}};
 return api}
function hash(x,z){let h=Math.imul((x*73.13)|0,374761393)^Math.imul((z*91.7)|0,668265263);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}

window.Publico={crear,persona,sombrero};
})();
