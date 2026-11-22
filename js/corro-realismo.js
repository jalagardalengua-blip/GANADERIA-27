/* ===================== PLAZA DE CORRO · CÁMARA, IMAGEN Y MODELOS =====================
   En los festejos el ganadero mira la retransmisión (no baja a la calle). Lo que se controla es la cámara:
   CÁMARA
   - Selector claro con cuatro planos: TV (realización automática), cadafal, la res y libre.
   - Arrastra con un dedo para girar la cámara alrededor de la acción y subir o bajar; pellizca para acercar o alejar.
     En el plano libre recorres la plaza a tu aire. Doble toque: vuelve al plano del realizador.
   - Flecha en el borde que señala dónde está la res cuando se sale del encuadre.
   IMAGEN
   - Luz ambiental real de una calle (HDRI de Poly Haven, CC0) para que la piedra, la madera y la gente
     reflejen el cielo y los alrededores como en una foto.
   - Revelado HDR como en la corrida en directo: resplandor de los focos y las bolas de fuego, curva ACES,
     color de tarde de fiestas, viñeta y grano. Se apaga solo si el móvil no llega.
   MODELOS 3D GRATUITOS (glTF, CC0, ver modelos/props/LICENCIAS.md)
   - Farolas de poste de madera con farol (Lantern, Khronos) en las calles que salen de la plaza.
   - Radiocasetes (BoomBox, Microsoft) en los cadafales de las peñas. */
const CRL={env:null,pend:false,mod:{},arr:null};
/* ---------- cámara con el dedo ---------- */
const CO={yaw:0,pitch:0,zoom:1,ty:0,tp:0,tz:1,libre:{x:0,z:0,yaw:.6,pitch:.55,d:26},t:0};
const CO_PLANOS=[['tv','TV'],['cad','Cadafal'],['res','La res'],['libre','Libre']];
function crlHUD(){const h=document.getElementById('h3calle');if(!h)return;
 const B=h.querySelector('.clB');if(B&&!B.querySelector('.coSeg')){const old=B.querySelector('#clcam');if(old)old.hidden=true;const seg=document.createElement('div');seg.className='coSeg';
  seg.innerHTML=CO_PLANOS.map(([k,l])=>`<button data-k="${k}">${l}</button>`).join('');seg.onclick=e=>{const b=e.target.closest('button');if(!b||!CL)return;CL.cam=b.dataset.k;CO.ty=CO.tp=0;CO.tz=1;crlSeg()};B.prepend(seg)}
 if(!h.querySelector('.crlArr')){const ar=document.createElement('div');ar.className='crlArr';ar.innerHTML='<svg viewBox="0 0 40 40"><path d="M20 3 36 30H4Z"/></svg><b></b>';h.appendChild(ar);CRL.arr=ar}
 if(!h.querySelector('.coAy')){const t=document.createElement('div');t.className='coAy';t.textContent='Arrastra para girar la cámara · pellizca para acercar · doble toque para volver';h.appendChild(t);setTimeout(()=>t.classList.add('fuera'),5200)}
 crlSeg();crlToque()}
function crlSeg(){document.querySelectorAll('.coSeg button').forEach(b=>b.classList.toggle('on',CL&&b.dataset.k===CL.cam))}
function crlToque(){const cv=W3.R&&W3.R.domElement;if(!cv||cv.__co)return;cv.__co=1;const pt=new Map();let pz=null,tap=0;
 const on=()=>W3.mode==='calle'&&CL;
 cv.addEventListener('pointerdown',e=>{if(!on())return;pt.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pt.size===2){const [a,b]=[...pt.values()];pz={d:Math.hypot(a.x-b.x,a.y-b.y),z:CO.tz}}
  const now=performance.now();if(pt.size===1){if(now-tap<300){CO.ty=CO.tp=0;CO.tz=1;if(CL.cam==='libre')CL.cam='tv';crlSeg();tap=0}else tap=now}});
 cv.addEventListener('pointermove',e=>{if(!on()||!pt.has(e.pointerId))return;const p=pt.get(e.pointerId),dx=e.clientX-p.x,dy=e.clientY-p.y;pt.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pt.size>=2&&pz){const [a,b]=[...pt.values()];CO.tz=Math.max(.45,Math.min(2.4,pz.z*pz.d/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y))));return}
  if(CL.cam==='libre'&&e.pointerType!=='mouse'&&pt.size===1&&Math.abs(dy)>Math.abs(dx)*2.5&&false)return;
  CO.ty-=dx*.0065;CO.tp=Math.max(-.5,Math.min(.9,CO.tp+dy*.004));CO.t=0});
 const fin=e=>{pt.delete(e.pointerId);if(pt.size<2)pz=null};cv.addEventListener('pointerup',fin);cv.addEventListener('pointercancel',fin);
 cv.addEventListener('wheel',e=>{if(!on())return;CO.tz=Math.max(.45,Math.min(2.4,CO.tz*(e.deltaY>0?1.08:.93)))},{passive:true})}
/* aplica el giro, la altura y el zoom al plano que calcula el realizador; el plano libre gira alrededor de la plaza */
function crlCam(dt){if(!CL||!W3.cam)return;const k=Math.min(1,dt*6);CO.yaw+=(CO.ty-CO.yaw)*k;CO.pitch+=(CO.tp-CO.pitch)*k;CO.zoom+=(CO.tz-CO.zoom)*k;const c=W3.cam.position,L=W3.look;
 if(CL.cam==='libre'){const f=CL.res||{x:0,z:0};const Lb=CO.libre;Lb.x+=(f.x*.35-Lb.x)*Math.min(1,dt*.8);Lb.z+=(f.z*.35-Lb.z)*Math.min(1,dt*.8);const yaw=.6+CO.yaw,pit=Math.max(.12,Math.min(1.35,.55+CO.pitch)),d=26*CO.zoom;
  c.set(Lb.x+Math.sin(yaw)*Math.cos(pit)*d,Math.sin(pit)*d+1,Lb.z+Math.cos(yaw)*Math.cos(pit)*d);L.set(Lb.x,1,Lb.z);W3.cam.lookAt(L);return}
 if(Math.abs(CO.yaw)<1e-3&&Math.abs(CO.pitch)<1e-3&&Math.abs(CO.zoom-1)<1e-3)return;
 const dx=c.x-L.x,dy=c.y-L.y,dz=c.z-L.z,hd=Math.hypot(dx,dz),d=Math.hypot(hd,dy);let yaw=Math.atan2(dx,dz)+CO.yaw,pit=Math.atan2(dy,hd)+CO.pitch*.8;pit=Math.max(.04,Math.min(1.4,pit));const D=d*CO.zoom;
 c.set(L.x+Math.sin(yaw)*Math.cos(pit)*D,L.y+Math.sin(pit)*D,L.z+Math.cos(yaw)*Math.cos(pit)*D);W3.cam.lookAt(L)}
/* flecha en el borde cuando la res se sale del encuadre */
function crlFlecha(){const r=CL&&CL.res,A=CRL.arr;if(!A)return;if(!r){A.classList.remove('on');return}W3.cam.updateMatrixWorld();W3.cam.matrixWorldInverse.copy(W3.cam.matrixWorld).invert();const v=new THREE.Vector3(r.x,1.2,r.z).project(W3.cam);const fuera=v.z>1||Math.abs(v.x)>.95||Math.abs(v.y)>.9;A.classList.toggle('on',fuera);if(!fuera)return;
 let x=v.x,y=v.y;if(v.z>1){x=-x;y=-y}const a=Math.atan2(x,y);A.style.transform=`translate(${(innerWidth/2+Math.sin(a)*innerWidth*.42).toFixed(0)}px,${(innerHeight/2-Math.cos(a)*innerHeight*.38).toFixed(0)}px) translate(-50%,-50%)`;
 A.querySelector('svg').style.transform=`rotate(${a}rad)`;A.querySelector('b').textContent='la res'}
/* ---------- luz ambiental real (HDRI) ---------- */
function crlEnv(sc){if(!sc||!THREE.RGBELoader)return;if(CRL.env){if(sc.environment!==CRL.env){sc.environment=CRL.env;crlEnvAjuste(sc)}return}if(CRL.pend)return;CRL.pend=true;
 new THREE.RGBELoader().setDataType(THREE.UnsignedByteType).load('texturas/hdri/ciudad_1k.hdr',tex=>{try{const pm=new THREE.PMREMGenerator(W3.R);pm.compileEquirectangularShader();CRL.env=pm.fromEquirectangular(tex).texture;tex.dispose();pm.dispose();
  if(W3.mode==='calle'&&W3.scene){W3.scene.environment=CRL.env;crlEnvAjuste(W3.scene)}}catch(e){console.warn('hdri',e)}},undefined,()=>{CRL.pend=false})}
function crlEnvAjuste(sc){sc.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms){if(m.isMeshStandardMaterial&&!m.userData.crlE){m.userData.crlE=1;m.envMapIntensity=m.metalness>.5?.9:.42;m.needsUpdate=true}}
 if(o.isHemisphereLight&&!o.userData.crlE){o.userData.crlE=1;o.intensity*=.72}})}
/* ---------- revelado HDR ---------- */
const HW={on:false,ok:null,rt:null,b:[],q:null,m:{},n:5,t:0,bloom:true,tm:null,refr:new WeakSet()};
function hwSoporta(){if(HW.ok!=null)return HW.ok;try{const c=W3.R.capabilities,e=W3.R.extensions;HW.ok=!!(c.isWebGL2&&THREE.WebGLMultisampleRenderTarget&&(e.get('EXT_color_buffer_float')||e.get('EXT_color_buffer_half_float')))}catch(e){HW.ok=false}return HW.ok}
function hwMat(fs,u){return new THREE.ShaderMaterial({uniforms:u,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:fs,depthTest:false,depthWrite:false,toneMapped:false})}
function hwMontar(){if(HW.q)return;HW.cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);HW.q=new THREE.Mesh(new THREE.PlaneGeometry(2,2));HW.q.frustumCulled=false;HW.sc=new THREE.Scene();HW.sc.add(HW.q);
 HW.m.pre=hwMat(`uniform sampler2D tS;uniform vec2 px;uniform float th,ex;varying vec2 vUv;void main(){vec3 c=.25*(texture2D(tS,vUv+px*vec2(-1,-1)).rgb+texture2D(tS,vUv+px*vec2(1,-1)).rgb+texture2D(tS,vUv+px*vec2(-1,1)).rgb+texture2D(tS,vUv+px*vec2(1,1)).rgb);
  c=min(c*ex,vec3(24.));float br=max(c.r,max(c.g,c.b)),k=th*.6;float s=clamp(br-th+k,0.,2.*k);s=s*s/(4.*k+1e-4);c*=max(s,br-th)/max(br,1e-4);gl_FragColor=vec4(c,1.);}`,{tS:{value:null},px:{value:new THREE.Vector2()},th:{value:1.0},ex:{value:1}});
 HW.m.down=hwMat(`uniform sampler2D tS;uniform vec2 px;varying vec2 vUv;void main(){vec3 c=texture2D(tS,vUv).rgb*.5+.125*(texture2D(tS,vUv+px*vec2(-1,-1)).rgb+texture2D(tS,vUv+px*vec2(1,-1)).rgb+texture2D(tS,vUv+px*vec2(-1,1)).rgb+texture2D(tS,vUv+px*vec2(1,1)).rgb);gl_FragColor=vec4(c,1.);}`,{tS:{value:null},px:{value:new THREE.Vector2()}});
 HW.m.up=hwMat(`uniform sampler2D tS;uniform vec2 px;varying vec2 vUv;void main(){vec3 c=texture2D(tS,vUv).rgb*4.;c+=2.*(texture2D(tS,vUv+vec2(px.x,0.)).rgb+texture2D(tS,vUv-vec2(px.x,0.)).rgb+texture2D(tS,vUv+vec2(0.,px.y)).rgb+texture2D(tS,vUv-vec2(0.,px.y)).rgb);
  c+=texture2D(tS,vUv+px).rgb+texture2D(tS,vUv-px).rgb+texture2D(tS,vUv+vec2(px.x,-px.y)).rgb+texture2D(tS,vUv+vec2(-px.x,px.y)).rgb;gl_FragColor=vec4(c/16.*.9,1.);}`,{tS:{value:null},px:{value:new THREE.Vector2()}});
 HW.m.up.blending=THREE.AdditiveBlending;HW.m.up.transparent=true;
 HW.m.fin=hwMat(`uniform sampler2D tS,tB;uniform vec2 px;uniform float ex,tm,useB;varying vec2 vUv;
  vec3 fit(vec3 v){vec3 a=v*(v+.0245786)-.000090537;vec3 b=v*(.983729*v+.4329510)+.238081;return a/b;}
  vec3 aces(vec3 c){const mat3 I=mat3(vec3(.59719,.07600,.02840),vec3(.35458,.90834,.13383),vec3(.04823,.01566,.83777));const mat3 O=mat3(vec3(1.60475,-.10208,-.00327),vec3(-.53108,1.10813,-.07276),vec3(-.07367,-.00605,1.07602));c*=ex/.6;c=I*c;c=fit(c);c=O*c;return clamp(c,0.,1.);}
  vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(vec3(.0031308),c));}
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  void main(){vec2 d=vUv-.5;float r2=dot(d,d);vec2 o=d*.012*r2;vec3 c=texture2D(tS,vUv).rgb;c.r=texture2D(tS,vUv-o).r;c.b=texture2D(tS,vUv+o).b;
   vec3 n=texture2D(tS,vUv+vec2(px.x,0.)).rgb+texture2D(tS,vUv-vec2(px.x,0.)).rgb+texture2D(tS,vUv+vec2(0.,px.y)).rgb+texture2D(tS,vUv-vec2(0.,px.y)).rgb;c=max(c+(c*4.-n)*.1,vec3(0.));
   if(useB>.5)c+=texture2D(tB,vUv).rgb*.5/max(ex,.05);c=aces(c);vec3 s=srgb(c);float l=dot(s,vec3(.2126,.7152,.0722));s=mix(vec3(l),s,1.07);s=mix(s,s*s*(3.-2.*s),.18);
   s+=vec3(-.006,.002,.01)*(1.-smoothstep(0.,.45,l))+vec3(.016,.007,-.01)*smoothstep(.45,1.,l);s*=1.-.28*smoothstep(.12,.62,r2*1.6);
   s+=(h(vUv*vec2(1731.,977.)+tm)-.5)*.03*(1.-l*.6);s+=(h(vUv*911.+tm*1.3)-.5)/255.;gl_FragColor=vec4(clamp(s,0.,1.),1.);}`,
  {tS:{value:null},tB:{value:null},px:{value:new THREE.Vector2()},ex:{value:1},tm:{value:0},useB:{value:1}})}
function hwTam(){const R=W3.R,v=R.getDrawingBufferSize(new THREE.Vector2()),w=Math.max(2,v.x|0),h=Math.max(2,v.y|0);if(HW.rt&&HW.rt.width===w&&HW.rt.height===h)return;
 const op={type:THREE.HalfFloatType,format:THREE.RGBAFormat,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false,stencilBuffer:false};
 if(!HW.rt){HW.rt=new THREE.WebGLMultisampleRenderTarget(w,h,{type:THREE.HalfFloatType,format:THREE.RGBAFormat,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:true,stencilBuffer:false});HW.rt.samples=4}else HW.rt.setSize(w,h);
 let bw=w>>1,bh=h>>1;for(let i=0;i<HW.n;i++){if(!HW.b[i])HW.b[i]=new THREE.WebGLRenderTarget(Math.max(1,bw),Math.max(1,bh),op);else HW.b[i].setSize(Math.max(1,bw),Math.max(1,bh));bw>>=1;bh>>=1}HW.m.fin.uniforms.px.value.set(1/w,1/h)}
function hwPaso(m,dst){HW.q.material=m;W3.R.setRenderTarget(dst);HW.orig(HW.sc,HW.cam)}
function hwRender(sc,cam){const R=W3.R;hwMontar();hwTam();const ex=R.toneMappingExposure;HW.t=(HW.t+.016)%100;
 R.setRenderTarget(HW.rt);R.clear();HW.orig(sc,cam);const fu=HW.m.fin.uniforms;fu.tS.value=HW.rt.texture;fu.ex.value=ex;fu.tm.value=HW.t;fu.useB.value=HW.bloom?1:0;
 if(HW.bloom){const B=HW.b,pu=HW.m.pre.uniforms;pu.tS.value=HW.rt.texture;pu.px.value.set(.5/HW.rt.width,.5/HW.rt.height);pu.ex.value=ex;hwPaso(HW.m.pre,B[0]);
  const du=HW.m.down.uniforms;for(let i=1;i<HW.n;i++){du.tS.value=B[i-1].texture;du.px.value.set(1/B[i-1].width,1/B[i-1].height);hwPaso(HW.m.down,B[i])}
  const uu=HW.m.up.uniforms,ac=R.autoClear;R.autoClear=false;for(let i=HW.n-1;i>0;i--){uu.tS.value=B[i].texture;uu.px.value.set(1/B[i].width,1/B[i].height);hwPaso(HW.m.up,B[i-1])}R.autoClear=ac;fu.tB.value=B[0].texture}
 hwPaso(HW.m.fin,null)}
function hwHook(){const R=W3.R;if(!R||R.__hw)return;R.__hw=1;HW.orig=R.render.bind(R);
 R.render=function(sc,cam){const quiere=W3.mode==='calle'&&HW.on;const tm=quiere?THREE.NoToneMapping:THREE.ACESFilmicToneMapping;
  // al cambiar de modo, la curva de color pasa a hacerse en el revelado (o vuelve al material): se recompilan los de la escena
  if(R.toneMapping!==tm){R.toneMapping=tm;HW.refr=new WeakSet()}if(sc&&!HW.refr.has(sc)&&R.getRenderTarget()===null&&!HW.busy){HW.refr.add(sc);sc.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms)m.needsUpdate=true})}
  if(quiere&&sc===W3.scene&&R.getRenderTarget()===null&&!HW.busy){HW.busy=true;try{hwRender(sc,cam)}catch(e){console.warn('revelado',e);HW.on=false}finally{HW.busy=false}return}
  return HW.orig(sc,cam)}}
/* ---------- modelos glTF gratuitos ---------- */
function crlCarga(n,url,alto){return new Promise(ok=>{if(CRL.mod[n])return ok(CRL.mod[n]);if(!THREE.GLTFLoader)return ok(null);new THREE.GLTFLoader().load(url,g=>{const o=g.scene;const b=new THREE.Box3().setFromObject(o),s=new THREE.Vector3();b.getSize(s);const k=alto/(s.y||1);
  o.scale.setScalar(k);o.position.y=-b.min.y*k;const w=new THREE.Group();w.add(o);o.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true}});CRL.mod[n]=w;ok(w)},undefined,()=>ok(null))})}
async function crlProps(){if(!CL||!CL.sc)return;const sc=CL.sc,plz=CLRECT&&CLRECT.plz;if(!plz)return;const id=CL;
 const [farol,radio]=await Promise.all([crlCarga('farol','modelos/props/farol.glb',3.4),crlCarga('radio','modelos/props/radio.glb',.34)]);if(CL!==id)return;
 const add=(m,x,y,z,ry)=>{const c=m.clone(true);c.position.set(x,y,z);c.rotation.y=ry;sc.add(c);(CL.added=CL.added||[]).push(c);return c};
 // farolas en las calles que salen de la plaza, pegadas a la fachada
 if(farol){const W=plz.x1,D=plz.z1;for(const s of [-1,1]){for(let x=W+5;x<W+40;x+=11){add(farol,s*x,0,3.55*(x%22<11?1:-1),x%22<11?Math.PI:0)}}
  for(let z=D+6;z<D+34;z+=11)add(farol,3.1*(z%22<11?1:-1),0,z,(z%22<11?-1:1)*Math.PI/2)}
 // radiocasetes en algunos cadafales (la música de las peñas)
 if(radio){const cads=(CLREF||[]).filter(r=>r.cad);for(let i=0;i<cads.length;i+=Math.max(1,Math.floor(cads.length/4))){const r=cads[i];const x=(r.x0+r.x1)/2,z=(r.z0+r.z1)/2;add(radio,x+.4,2.24,z,Math.random()*6.28)}}}
/* ---------- enganches ---------- */
if(typeof irCalle==='function'){const _icCR=irCalle;irCalle=function(){const r=_icCR.apply(this,arguments);try{CO.yaw=CO.pitch=CO.ty=CO.tp=0;CO.zoom=CO.tz=1;crlHUD();if(W3.mode==='calle'){crlEnv(W3.scene);hwHook();HW.on=hwSoporta()&&(()=>{try{return localStorage.getItem('hd-corro-hd')!=='0'}catch(e){return true}})();crlProps()}}catch(e){console.warn('corro realismo',e)}return r}}
if(typeof camCalle==='function'){const _ccCR=camCalle;camCalle=function(dt){if(CL&&CL.cam==='libre'){crlCam(dt||0);CO.base=null;return}
 /* el realizador sigue moviendo su cámara sin el giro del dedo; el giro se aplica encima en cada fotograma */
 if(CO.base&&W3.cam)W3.cam.position.copy(CO.base);_ccCR.apply(this,arguments);try{CO.base=(CO.base||new THREE.Vector3()).copy(W3.cam.position);crlCam(dt||0)}catch(e){}}}
if(typeof calleTick==='function'){const _ctCR=calleTick;calleTick=function(dt){const r=_ctCR.apply(this,arguments);try{if(CL&&W3.mode==='calle'){crlFlecha();if(typeof PERF!=='undefined'&&PERF.fps){HW.bloom=PERF.fps>34||HW.bloom&&PERF.fps>28}}}catch(e){}return r}}
