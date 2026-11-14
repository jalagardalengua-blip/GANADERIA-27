/* ===================== BOU EMBOLAT · FUEGO DE VERDAD =====================
   Las bolas de estopa arden con un sistema de partículas en el mundo: llamas que suben y se quedan atrás
   cuando el toro corre (estela), humo negro de la brea, bolas incandescentes que se van consumiendo y luz
   que parpadea sobre las fachadas. También arde la antorcha. Todo con dos objetos de dibujo y un número fijo
   de partículas (sin crear ni destruir nada por fotograma), para que no haya tirones. */
const FUEGO={sys:null,tex:null};
function fuegoTex(){if(FUEGO.tex)return FUEGO.tex;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
 g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.75)');g.addColorStop(.7,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);
 FUEGO.tex=new THREE.CanvasTexture(c);return FUEGO.tex}
function fuegoPool(n,additive){const g=new THREE.BufferGeometry(),pos=new Float32Array(n*3),size=new Float32Array(n),col=new Float32Array(n*4);
 for(let i=0;i<n;i++)pos[i*3+1]=-99;g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('size',new THREE.BufferAttribute(size,1));g.setAttribute('col',new THREE.BufferAttribute(col,4));
 const m=new THREE.ShaderMaterial({uniforms:{map:{value:fuegoTex()},uS:{value:400}},transparent:true,depthWrite:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending,
  vertexShader:'attribute float size;attribute vec4 col;varying vec4 vC;uniform float uS;void main(){vC=col;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(size*uS/max(.1,-mv.z),0.,256.);gl_Position=projectionMatrix*mv;}',
  fragmentShader:additive?'uniform sampler2D map;varying vec4 vC;void main(){float a=texture2D(map,gl_PointCoord).a*vC.a;gl_FragColor=vec4(vC.rgb*a,a);}':'uniform sampler2D map;varying vec4 vC;void main(){float a=texture2D(map,gl_PointCoord).a*vC.a;if(a<.01)discard;gl_FragColor=vec4(vC.rgb,a);}'});
 const p=new THREE.Points(g,m);p.frustumCulled=false;p.renderOrder=additive?6:5;return {p,pos,size,col,v:Array.from({length:n},()=>({x:0,y:-99,z:0,vx:0,vy:0,vz:0,l:0,L:1,s:0})),i:0,n}}
function fuegoSys(){if(!CL||!CL.sc)return null;if(FUEGO.sys&&FUEGO.sys.sc===CL.sc)return FUEGO.sys;const q=W3&&W3.q||'media',mul=q==='alta'?1:q==='media'?.65:.4;
 const S2={sc:CL.sc,fl:fuegoPool(Math.round(420*mul),true),sm:fuegoPool(Math.round(200*mul),false),objs:[],mul,w:new THREE.Vector3()};
 for(const P of [S2.sm,S2.fl]){CL.sc.add(P.p);if(CL.added)CL.added.push(P.p)}FUEGO.sys=S2;return S2}
// bolas de estopa con armazón: misma interfaz que antes ({fires,L}) y además las bolas que arden
embolar=function(b){const S2=fuegoSys(),balls=[],G=geos();
 for(const s of [1,-1]){const m=new THREE.MeshStandardMaterial({color:'#2a1a0e',roughness:.95,emissive:'#ff5a10',emissiveIntensity:0});const ball=mesh(G.sph,m,.1,.1,.1,s*.62,.62,.2,b.hp,true);
  const tow=mesh(G.sph,M('#6b5a3c',1),.105,.06,.105,s*.62,.58,.2,b.hp,true);void tow;balls.push(ball)}
 const L=new THREE.PointLight('#ff8a2a',0,16,1.7);L.position.set(0,1.1,.2);b.hp.add(L);
 const F={fires:[],L,balls,k:1,lit:true,burn:0,rate:1};if(S2)S2.objs.push(F);return F};
// la antorcha del embolador también arde
function fuegoTorch(tip){const S2=fuegoSys();if(!S2||!tip)return;S2.objs.push({balls:[tip],k:.55,lit:true,burn:0,rate:.45,torch:1,fires:[]})}
function fuegoTick(dt){const S2=FUEGO.sys;if(!S2||!CL||S2.sc!==CL.sc)return;const cam=W3.cam;S2.fl.p.material.uniforms.uS.value=S2.sm.p.material.uniforms.uS.value=(W3.R?W3.R.domElement.height:600)/(2*Math.tan(cam.fov*Math.PI/360));
 const w=S2.w,fl=S2.fl,sm=S2.sm;
 for(const F of S2.objs){const on=F.lit&&(F.k??1)>0.02&&F.balls.length&&F.balls[0].parent;if(!on){for(const b of F.balls)if(b.material&&b.material.emissiveIntensity!==undefined)b.material.emissiveIntensity=0;continue}
  const k=F.k??1;F.burn+=dt;
  for(const b of F.balls){if(!b.visible&&!F.torch)continue;b.getWorldPosition(w);
   if(b.material&&!F.torch){b.material.emissiveIntensity=(1.2+Math.random()*.6)*k;const ch=Math.min(1,F.burn/70);b.material.color.setRGB(.16*(1-ch)+.03,.1*(1-ch)+.02,.05*(1-ch)+.01)}
   // llamas
   const nf=Math.max(1,Math.round(5*k*F.rate*S2.mul*(dt*60)));for(let j=0;j<nf;j++){const p=fl.v[fl.i++%fl.n];p.x=w.x+R(-.05,.05);p.y=w.y+R(-.02,.06);p.z=w.z+R(-.05,.05);p.vx=R(-.25,.25);p.vy=R(1.1,2)*(.6+.4*k);p.vz=R(-.25,.25);p.L=p.l=R(.3,.55)*(F.torch?.7:1);p.s=R(.22,.36)*(F.torch?.7:1)*(.6+.4*k)}
   // humo de brea
   if(Math.random()<dt*(F.torch?6:16)*k*S2.mul){const p=sm.v[sm.i++%sm.n];p.x=w.x+R(-.06,.06);p.y=w.y+.35;p.z=w.z+R(-.06,.06);p.vx=R(-.15,.15);p.vy=R(.7,1.3);p.vz=R(-.15,.15);p.L=p.l=R(1.4,2.4);p.s=R(.3,.5)}}
  if(F.L){F.L.intensity=(2.4+Math.sin(CL.t*31)*.35+Math.random()*.5)*k;F.L.color.setRGB(1,.5+Math.random()*.08,.16)}}
 // simular
 for(let i=0;i<fl.n;i++){const p=fl.v[i];if(p.l>0){p.l-=dt;p.vy+=dt*.8;p.vx*=.96;p.vz*=.96;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;const t=1-p.l/p.L;
   fl.pos[i*3]=p.x;fl.pos[i*3+1]=p.y;fl.pos[i*3+2]=p.z;fl.size[i]=p.s*(t<.25?.7+t*1.6:1.1-(t-.25)*.9);
   const r=1,g=t<.2?.95-t*1.2:Math.max(.12,.71-(t-.2)*.9),bl=t<.15?.7-t*3.5:.05;fl.col.set([r,g,bl,(t<.1?t*10:1)*(1-t)*.9],i*4)}else if(fl.pos[i*3+1]>-90){fl.pos[i*3+1]=-99;fl.col[i*4+3]=0}}
 for(let i=0;i<sm.n;i++){const p=sm.v[i];if(p.l>0){p.l-=dt;p.vy*=.995;p.vx+=R(-.2,.2)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;const t=1-p.l/p.L;
   sm.pos[i*3]=p.x;sm.pos[i*3+1]=p.y;sm.pos[i*3+2]=p.z;sm.size[i]=p.s*(1+t*2.6);const c=.07+t*.08;sm.col.set([c,c*.95,c*.9,(t<.15?t/.15:1)*(1-t)*.4],i*4)}else if(sm.pos[i*3+1]>-90){sm.pos[i*3+1]=-99;sm.col[i*4+3]=0}}
 for(const P of [fl,sm]){const g=P.p.geometry;g.attributes.position.needsUpdate=g.attributes.size.needsUpdate=g.attributes.col.needsUpdate=true}}
if(typeof calleTick==='function'){const _ctF=calleTick;calleTick=function(dt){_ctF(dt);try{fuegoTick(dt*((CL&&CL.spd)||1))}catch(e){}}}
// en el ritual: la antorcha arde desde que aparece y las bolas solo al encenderlas
if(typeof embStart==='function'){const _esF=embStart;embStart=function(r){_esF(r);try{const e=CL.emb;if(e&&e.torch){const tip=new THREE.Object3D();tip.position.y=.45;e.torch.add(tip);fuegoTorch(tip);const fl=e.torch.userData.fl;if(fl)fl.scale.set(.6,.6,1)}}catch(x){}}}
if(typeof embTick==='function'){const _etF=embTick;embTick=function(r,dt){_etF(r,dt);const e=CL&&CL.emb,F=e&&e.fireObj;if(F&&!F.__init){F.__init=1;F.lit=false;F.k=0}if(F&&r.fire===F)F.lit=true}}
