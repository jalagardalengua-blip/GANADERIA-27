/* ===================== PULIDO VISUAL =====================
   - Vitrina 3D en la ficha: el animal real (su pelo, sus pitones y su edad) girando en un pedestal de albero;
     se puede arrastrar para girarlo. Si el móvil no tiene WebGL se queda el dibujo de siempre.
   - Cartel de toros al entrar en la plaza con aspecto de cartel clásico: papel crema, tipografía roja y negra,
     hierro y divisa de la ganadería, terna de matadores y los seis toros reseñados. */
const VT={};
function vtInit(){if(VT.R||VT.err)return VT.R;try{const R=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
 const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight('#f4ead6','#6b4b2a',.75));const k=new THREE.DirectionalLight('#fff1d6',1.5);k.position.set(3,5,4);k.castShadow=true;k.shadow.mapSize.set(1024,1024);
 Object.assign(k.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:.5,far:20});sc.add(k);const rim=new THREE.DirectionalLight('#ffd9a0',.6);rim.position.set(-4,3,-4);sc.add(rim);
 const cv=document.createElement('canvas');cv.width=cv.height=256;const c=cv.getContext('2d');const g=c.createRadialGradient(128,128,10,128,128,128);g.addColorStop(0,'rgba(214,176,118,1)');g.addColorStop(.7,'rgba(190,150,96,.85)');g.addColorStop(1,'rgba(190,150,96,0)');c.fillStyle=g;c.fillRect(0,0,256,256);
 const tx=new THREE.CanvasTexture(cv);tx.encoding=THREE.sRGBEncoding;const fl=new THREE.Mesh(new THREE.CircleGeometry(2.6,48),new THREE.MeshStandardMaterial({map:tx,transparent:true,roughness:1}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;sc.add(fl);
 const cam=new THREE.PerspectiveCamera(28,2,.1,50);Object.assign(VT,{R,sc,cam,tx});return R}catch(e){VT.err=e;return null}}
function vtKind(a){const y=ageY(a);if(y<1)return 'becerro';return a.sex==='H'?'vaca':'toro'}
function vtMostrar(a){const cv=$('#fcv');if(!cv||!vtInit())return;const wrap=cv.parentElement;if(!wrap)return;
 if(VT.B){VT.sc.remove(VT.B.root);VT.B=null}let B;try{B=makeBull({pelo:a.pelo,kind:vtKind(a),m:morf(a)})}catch(e){return}
 const y=ageY(a),s=y===0?.62:y===1?.78:y===2?.9:1;B.root.scale.multiplyScalar(s);B.root.traverse(o=>{if(o.isMesh){o.castShadow=true}});VT.sc.add(B.root);VT.B=B;try{gxScene(VT.sc)}catch(e){}
 const box=new THREE.Box3().setFromObject(B.root),ctr=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());B.root.position.x-=ctr.x;B.root.position.z-=ctr.z;
 const R=VT.R,el=R.domElement;el.className='vtCv';cv.replaceWith(el);wrap.classList.add('vt3d');wrap.style.background='';
 const ajusta=()=>{const w=wrap.clientWidth||320,h=Math.round(Math.min(230,Math.max(170,w*.52)));R.setSize(w,h,false);el.style.width='100%';el.style.height=h+'px';VT.cam.aspect=w/h;VT.cam.updateProjectionMatrix()};ajusta();
 const L=Math.max(sz.x,sz.z),H=sz.y;let yaw=.9,drag=null,vel=.35,t0=performance.now();
 el.onpointerdown=e=>{drag={x:e.clientX,y:yaw};vel=0;el.setPointerCapture&&el.setPointerCapture(e.pointerId)};el.onpointermove=e=>{if(drag){yaw=drag.y+(e.clientX-drag.x)*.012}};el.onpointerup=el.onpointercancel=()=>{drag=null;vel=.35};
 if(!wrap.querySelector('.vtHint')){const h=document.createElement('small');h.className='vtHint';h.textContent='Arrastra para girar';wrap.appendChild(h)}
 const loop=now=>{if(!el.isConnected||VT.B!==B)return;const dt=Math.min(.05,(now-t0)/1000);t0=now;if(!drag)yaw+=vel*dt;
  try{animBull(B,dt,{speed:0,head:.3})}catch(e){}const d=L*1.75+1.3;VT.cam.position.set(Math.sin(yaw)*d,H*.62+.35,Math.cos(yaw)*d);VT.cam.lookAt(0,H*.48,0);R.render(VT.sc,VT.cam);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
const _openFichaVT=openFicha;
openFicha=function(id){const r=_openFichaVT.apply(this,arguments);try{const a=byId(id);if(a)vtMostrar(a)}catch(e){try{errLog('vitrina: '+e.message,'pulido')}catch(e2){}}return r};
/* ---------- cartel de toros clásico ---------- */
const _cartelHTMLP=cartelHTML;
cartelHTML=function(C){try{const r=C.r,mats=[];for(const t of r.toros){if(!mats.some(m=>m.n===t.mat))mats.push({n:t.mat,e:t.estilo})}
 const n=r.toros.length,g=S.g||{},fecha=`${MESES[S.month]} de ${S.year}`;const num=['','Un','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho'][n]||n;
 return `<div class="cartelP"><div class="cpPapel"><small class="cpEmp">${r.cat===1?'Plaza de toros de primera':'Plaza de toros'}</small><h2>${esc(r.plaza)}</h2>
  <p class="cpFer">${esc(r.feria)} · ${fecha}</p><p class="cpGran">Gran corrida de toros</p>
  <div class="cpGan"><span class="cpHi">${hierroSVG(g.hierro||{l:'?'},38,'#1a1410')}</span><div><small>${num} ${n===1?'hermoso toro':'hermosos toros'} de la ganadería de</small><b>${esc(g.name||'')}</b><span class="cpDv">${divisa(g.div)}<i>con divisa</i></span></div></div>
  <p class="cpPara">para los matadores</p><div class="cpMat">${mats.slice(0,3).map(m=>`<div><b>${esc(m.n)}</b><small>${matRating(m.n)} · ${ESTILO[m.e]||''}</small></div>`).join('')}</div></div>
  <div class="cpDer"><span class="lbl">Reseña de la corrida</span><div class="cpTor">${r.toros.map((t,i)=>`<div><b>${i+1}º</b><span>${esc(t.name)}${t.num!=null?' · nº '+t.num:''}</span><small>${t.peso} kg · ${t.pelo}</small></div>`).join('')}</div>
  <button class="btn oro adv" onclick="cartelGo()">Empezar el festejo</button></div></div>`}catch(e){return _cartelHTMLP.apply(this,arguments)}};
/* ---------- público de la plaza con siluetas de persona sentada ---------- */
function pubGeoCuerpo(){const U=THREE.BufferGeometryUtils,parts=[];const add=(g,k)=>{g=g.index?g.toNonIndexed():g;const n=g.attributes.position.count,c=new Float32Array(n*3).fill(k);g.setAttribute('color',new THREE.BufferAttribute(c,3));if(g.attributes.uv)g.deleteAttribute('uv');parts.push(g)};
 const t=new THREE.CylinderGeometry(.19,.155,.42,10);t.scale(1.15,1,.72);t.translate(0,.06,0);add(t,1);
 const h=new THREE.SphereGeometry(.2,10,5,0,Math.PI*2,0,Math.PI/2);h.scale(1.12,.38,.72);h.translate(0,.27,0);add(h,1);
 for(const s of [1,-1]){const a=new THREE.CylinderGeometry(.056,.048,.4,6);a.rotateX(-.28);a.translate(s*.235,.07,.04);add(a,.92)}
 const l=new THREE.BoxGeometry(.36,.13,.34);l.translate(0,-.21,.15);add(l,.4);const lg=new THREE.BoxGeometry(.3,.3,.1);lg.translate(0,-.38,.3);add(lg,.32);
 const g=U.mergeBufferGeometries(parts);g.computeVertexNormals();return g}
function pubGeoCabeza(){const g=new THREE.SphereGeometry(.115,12,9).toNonIndexed();g.scale(.92,1.05,.98);const p=g.attributes.position,c=new Float32Array(p.count*3);
 for(let i=0;i<p.count;i++){const y=p.getY(i),z=p.getZ(i);const pelo=y>.035||(z<-.02&&y>-.05);const k=pelo?[.26,.2,.17]:[1,1,1];c.set(k,i*3)}
 g.setAttribute('color',new THREE.BufferAttribute(c,3));g.deleteAttribute('uv');g.computeVertexNormals();return g}
const _buildPlazaP=buildPlaza;
buildPlaza=function(){const P=_buildPlazaP.apply(this,arguments);try{if(P&&!P.pubOk&&P.body&&P.heads){P.pubOk=1;
 P.body.geometry.dispose();P.body.geometry=pubGeoCuerpo();P.body.material.vertexColors=true;P.body.material.needsUpdate=true;
 P.heads.geometry.dispose();P.heads.geometry=pubGeoCabeza();P.heads.material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.75});
 const piel=['#e7bd98','#d6a37d','#c08a63','#a5734f','#f0caa6','#8c5f40'].map(c=>new THREE.Color(c));const r=mulberry(5);for(let i=0;i<P.heads.count;i++)P.heads.setColorAt(i,piel[Math.floor(r()*piel.length)]);P.heads.instanceColor.needsUpdate=true}}catch(e){try{errLog('público: '+e.message,'pulido')}catch(e2){}}return P};
/* ---------- imagen propia para cada ganadería al elegirla ----------
   Cada ganadería recibe una foto distinta (ninguna se repite) del pelo que más la caracteriza. */
const PELO_GAN={'Miura':'cardeno','Victorino Martín':'cardeno','Adolfo Martín':'cardeno','La Quinta':'cardeno','Partido de Resina':'cardeno','José Escolar':'cardeno','Ana Romero':'cardeno',
 'Torrestrella':'jabonero','Prieto de la Cal':'jabonero',
 'El Pilar':'colorado','Zalduendo':'colorado','El Torero':'colorado','Hermanos García Jiménez':'colorado','Montalvo':'colorado','Puerto de San Lorenzo':'colorado',
 'Victoriano del Río':'castano','Alcurrucén':'castano','Daniel Ruiz':'castano','Salvador Domecq':'castano','Pedraza de Yeltes':'castano','Valdefresno':'castano','Baltasar Ibán':'castano'};
const IMG_GAN=(()=>{const usado={cardeno:0,jabonero:0,colorado:0,castano:0,negro:0},m={},orden=['negro','castano','colorado','jabonero','cardeno'];
 for(const g of GANADERIAS){const pref=PELO_GAN[g.name]||'negro';const lista=[pref,...orden.filter(x=>x!==pref)];const c=lista.find(x=>usado[x]<8);if(!c)continue;m[g.name]=`img/toro-${c}-${usado[c]++}.jpg`}return m})();
const _encImgP=encImg;
encImg=function(g,i){return (g&&IMG_GAN[g.name])||_encImgP.apply(this,arguments)};
