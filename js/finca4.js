/* ===================== FINCA 3D · MÁS REAL =====================
   - El vaquero (tú) y el mayoral usan el cuerpo humano realista, con las herramientas en sus manos de verdad
     y las piernas abiertas sobre la montura cuando vas a caballo.
   - Pasto alto alrededor tuyo que se mece con el viento (macollas instanciadas, color según la estación).
   - Suelo de la dehesa con manchas de hierba verde, pasto seco y tierra pisada en lugar de un verde uniforme. */
const F4={};
/* ---------- personas realistas en la finca ---------- */
function makeCampoGL(st){const P=makePersonGL(Object.assign({},st,{gl:1,pole:null}));const sc=P.b.children[0];const bones={};sc.traverse(o=>{if(o.isBone)bones[o.name]=o});
 P.arms.forEach((ar,i)=>{const s=i===0?'l':'r',hb=bones['hand_'+s];if(hb)ar.hand=trjMano(hb,sc,i===0?1:-1);ar.bUp=bones['upperarm_'+s];ar.bLo=bones['lowerarm_'+s];ar.bHa=hb});
 P.piernas=['l','r'].map(s=>({s:s==='l'?1:-1,th:bones['thigh_'+s],ca:bones['calf_'+s],ft:bones['foot_'+s]}));
 if(st.pole){const p=mesh(geos().cyl,M('#a88b5a',.7),.025,st.pole,.025,0,-.1,0,P.arms[1].hand);p.rotation.x=st.pole>3.2?1.2:.25}
 P.gl.brazos=true;return P}
const _makePersonF4=makePerson;
makePerson=function(st){if(st&&!st.traje&&st.hat==='campero'&&W3&&W3.mode==='finca'&&MOD.per2&&MOD.reg&&!st.proc){try{return makeCampoGL(st)}catch(e){console.warn('campo GL',e)}}return _makePersonF4(st)};
function f4Montado(P){const bq=P.b.getWorldQuaternion(new THREE.Quaternion());for(const L of P.piernas||[]){if(!L.th||!L.ca)continue;
 trjApunta(L.th,L.ca,new THREE.Vector3(L.s*.42,-.42,.8).normalize().applyQuaternion(bq));trjApunta(L.ca,L.ft,new THREE.Vector3(L.s*.2,-1,-.12).normalize().applyQuaternion(bq))}}
const _animPersonF4=animPerson;
animPerson=function(P,dt,sp,pose){if(P&&P.gl&&P.gl.brazos&&P===W3.pl&&W3.ride){P.gl.want='Idle_Loop';P.gl.wts=.4}else if(P&&P.gl&&P.gl.brazos&&P.gl.want==='Idle_Loop'&&P.gl.wts===.4){P.gl.want=null}
 const r=_animPersonF4.apply(this,arguments);if(P&&P.gl&&P.gl.brazos){try{if(!P.gl.torero)trjBrazos(P);if(P===W3.pl&&W3.ride)f4Montado(P)}catch(e){}}return r};
/* ---------- ruido para el suelo ---------- */
function f4Hash(x,z){const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s)}
function f4Noise(x,z){const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi,u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);
 const a=f4Hash(xi,zi),b=f4Hash(xi+1,zi),c=f4Hash(xi,zi+1),d=f4Hash(xi+1,zi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function f4Fbm(x,z){let s=0,a=.5,f=1;for(let i=0;i<4;i++){s+=a*f4Noise(x*f,z*f);f*=2.03;a*=.5}return s/.9375}
function f4Paleta(m){return m>=2&&m<=4?{verde:'#6c7d43',seco:'#a19a63',tierra:'#86705a',pasto:'#9aa865'}:m>=5&&m<=7?{verde:'#8b8551',seco:'#c2aa72',tierra:'#9a7f5f',pasto:'#d2bd82'}:m>=8&&m<=10?{verde:'#787d4b',seco:'#a99a66',tierra:'#8a735a',pasto:'#b9ad74'}:{verde:'#65744a',seco:'#8d8c5c',tierra:'#7a6852',pasto:'#97a36c'}}
function f4Suelo(sc){let ter=null;sc.traverse(o=>{const g=o.geometry;if(o.isMesh&&g&&g.type==='PlaneGeometry'&&g.parameters.width===600)ter=o});if(!ter||ter.userData.f4)return;ter.userData.f4=1;
 const g=ter.geometry,pos=g.attributes.position,col=g.attributes.color;if(!col)return;const lin=!!g.userData.lin;const P=f4Paleta(S.month),cv=new THREE.Color(P.verde),cs=new THREE.Color(P.seco),ct=new THREE.Color(P.tierra),c=new THREE.Color(),o=new THREE.Color();
 if(lin){cv.convertSRGBToLinear();cs.convertSRGBToLinear();ct.convertSRGBToLinear()}
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);o.fromBufferAttribute(col,i);
  const yard=Math.abs(x)<3.2&&z>12||Math.hypot(x,z-2)<20;if(yard)continue;              // camino y era del cortijo: se quedan como estaban
  const n1=f4Fbm(x*.018+3,z*.018-7),n2=f4Fbm(x*.07-11,z*.07+5),n3=f4Fbm(x*.25,z*.25);
  c.copy(cv).lerp(cs,clamp((n1-.38)*2.6,0,1));                                          // manchas de pasto seco y de hierba verde
  if(n2>.68)c.lerp(ct,clamp((n2-.68)*4,0,.75));                                          // calvas de tierra pisada
  c.multiplyScalar(.9+n3*.2);o.lerp(c,.85);col.setXYZ(i,o.r,o.g,o.b)}
 col.needsUpdate=true;const m=ter.material;if(m.normalScale)m.normalScale.set(.55,.55)}
/* ---------- pasto alto que se mece ---------- */
function f4TexPasto(){if(F4.tx)return F4.tx;const cv=document.createElement('canvas');cv.width=128;cv.height=128;const c=cv.getContext('2d');const r=mulberry(77);
 for(let i=0;i<22;i++){const x=10+r()*108,h=50+r()*74,w=2+r()*3.5,lean=(r()-.5)*34;const g=c.createLinearGradient(0,128,0,128-h);const k=.55+r()*.45;
  const v0=Math.round(195*k),v1=Math.round(255*(.85+k*.15));g.addColorStop(0,`rgb(${v0},${v0},${Math.round(v0*.9)})`);g.addColorStop(1,`rgb(${v1},${v1},${Math.round(v1*.92)})`);c.fillStyle=g;
  c.beginPath();c.moveTo(x-w,128);c.quadraticCurveTo(x+lean*.3,128-h*.5,x+lean,128-h);c.quadraticCurveTo(x+lean*.3+w*.4,128-h*.5,x+w,128);c.fill()}
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.generateMipmaps=false;t.minFilter=THREE.LinearFilter;F4.tx=t;return t}
function f4GeoPasto(){if(F4.geo)return F4.geo;const W=.62,H=.5,gs=[];for(const a of [0,Math.PI/3,-Math.PI/3,Math.PI,Math.PI*4/3,Math.PI*2/3]){const p=new THREE.PlaneGeometry(W,H);p.translate(0,H/2,0);p.rotateY(a);gs.push(p)}
 const g=THREE.BufferGeometryUtils.mergeBufferGeometries(gs);const n=g.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,1,0);F4.geo=g;return g}
function f4Pasto(sc){const q=txrQ();if(q==='baja')return;const N=q==='alta'?4200:2600,R=q==='alta'?30:24;const P=f4Paleta(S.month);
 const mat=new THREE.MeshStandardMaterial({map:f4TexPasto(),color:P.pasto,alphaTest:.5,side:THREE.FrontSide,roughness:1,emissive:new THREE.Color(P.pasto).multiplyScalar(.22)});mat.userData.f4u={value:0};
 mat.onBeforeCompile=s=>{s.uniforms.uT=mat.userData.f4u;s.vertexShader='uniform float uT;\n'+s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
  #ifdef USE_INSTANCING
  vec4 wp=instanceMatrix*vec4(0.,0.,0.,1.);
  #else
  vec4 wp=vec4(0.);
  #endif
  float hh=clamp(position.y/.5,0.,1.);hh*=hh;transformed.x+=sin(uT*1.6+wp.x*.31+wp.z*.23)*.09*hh;transformed.z+=cos(uT*1.2+wp.x*.17-wp.z*.29)*.06*hh;`)};
 const im=new THREE.InstancedMesh(f4GeoPasto(),mat,N);im.receiveShadow=true;im.castShadow=false;im.frustumCulled=false;im.name='pastoAlto';
 const r=mulberry(911),base=[];const cc=new THREE.Color();for(let i=0;i<N;i++){base.push([(r()-.5)*2*R,(r()-.5)*2*R,.5+r()*.6,r()*6.3]);cc.setHSL(.13,.12,.72+r()*.3);im.setColorAt(i,cc)}
 F4.pasto={im,base,R,last:null,mat};sc.add(im);f4Mover(true)}
function f4Libre(x,z){if(Math.abs(x)<3.4&&z>11)return false;if(Math.hypot(x,z-2)<15)return false;
 for(const c of W3.col||[]){if(c.t==='box'){if(x>c.x0-.4&&x<c.x1+.4&&z>c.z0-.4&&z<c.z1+.4)return false}else if(c.t==='circ'){if(Math.hypot(x-c.x,z-c.z)<c.r+.3)return false}}return true}
function f4Mover(force){const G=F4.pasto;if(!G||!W3.F)return;const px=W3.F.p.x,pz=W3.F.p.z;if(!force&&G.last&&Math.hypot(px-G.last[0],pz-G.last[1])<2.5)return;G.last=[px,pz];
 const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),v=new THREE.Vector3(),Y=new THREE.Vector3(0,1,0),D=2*G.R;
 G.base.forEach(([bx,bz,sc,rot],i)=>{let x=px+((((bx-px)%D)+D*1.5)%D)-G.R,z=pz+((((bz-pz)%D)+D*1.5)%D)-G.R;const ok=f4Libre(x,z);const d=Math.hypot(x-px,z-pz);
  const fade=clamp((G.R-d)/4,0,1);const k=ok?sc*fade:0;q.setFromAxisAngle(Y,rot);s.set(k,k*(.85+.3*((i*13)%7)/7),k);v.set(x,gH(x,z)-.03,z);m.compose(v,q,s);G.im.setMatrixAt(i,m)});G.im.instanceMatrix.needsUpdate=true}
/* ---------- montaje ---------- */
const _rebuildF4=rebuildFinca;
rebuildFinca=function(){_rebuildF4.apply(this,arguments);if(W3.mode!=='finca'||!W3.scene)return;try{f4Suelo(W3.scene)}catch(e){console.warn('suelo',e)}try{F4.pasto=null;f4Pasto(W3.scene)}catch(e){console.warn('pasto',e)}};
const _fincaTickF4=fincaTick;
fincaTick=function(dt){const r=_fincaTickF4.apply(this,arguments);try{if(F4.pasto&&F4.pasto.im.parent===W3.scene){F4.pasto.mat.userData.f4u.value+=dt;f4Mover(false)}}catch(e){}return r};
