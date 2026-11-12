/* ===================== CALIDAD DE IMAGEN =====================
   - Texturas nítidas en ángulos rasantes (filtrado anisótropo) en finca, plaza, tienta y calle.
   - Resolución que sube sola si el móvil va sobrado (hasta 2x) y baja si se resiente, sobre el ajuste de Gráficos.
   - Mulillas del arrastre con el caballo animado de verdad, collera y madroños de colores, en vez de las figuras simples. */
const CAL={scan:0,an:null};
function calAniso(){const R=W3&&W3.R;if(!R)return 1;if(CAL.an==null)CAL.an=R.capabilities.getMaxAnisotropy?R.capabilities.getMaxAnisotropy():1;
 const q=W3.q||'media';return Math.max(1,Math.min(CAL.an,q==='alta'?8:q==='media'?4:1))}
function calTexturas(sc){const a=calAniso();if(a<=1)return;const vistos=new Set();
 sc.traverse(o=>{if(!o.isMesh&&!o.isInstancedMesh)return;const ms=Array.isArray(o.material)?o.material:[o.material];
  for(const m of ms){if(!m||vistos.has(m))continue;vistos.add(m);
   for(const k of ['map','normalMap','roughnessMap','aoMap','bumpMap']){const t=m[k];if(!t||t.anisotropy>=a)continue;
    if(t.generateMipmaps===false||t.minFilter===THREE.LinearFilter||t.minFilter===THREE.NearestFilter)continue;   // sin mipmaps: no aporta y puede emborronar
    t.anisotropy=a;t.needsUpdate=true}}})}
/* resolución dinámica con techo más alto que el ajuste base cuando sobra rendimiento */
function calTecho(){const q=W3.q||'media',dpr=window.devicePixelRatio||1;return Math.min(dpr,q==='alta'?2:q==='media'?1.6:1)}
function calTick(){if(!W3.on||!W3.scene||!W3.R)return;const now=performance.now();
 if(now-CAL.scan>1500){CAL.scan=now;try{calTexturas(W3.scene)}catch(e){}}
 if(typeof PERF==='undefined'||PERF.pr==null)return;
 if(!CAL.t0||now-CAL.t0>5000){CAL.t0=now;return}if(now-CAL.t0<3000)return;CAL.t0=now;
 const top=calTecho();if(PERF.fps>55&&PERF.base<top&&PERF.pr>=PERF.base-.01){PERF.base=Math.min(top,+(PERF.base+.2).toFixed(2));PERF.pr=PERF.base;W3.R.setPixelRatio(PERF.pr)}}
for(const n of ['fincaTick','plazaTick','calleTick','tientaTick','toreroTick']){if(typeof window[n]!=='function')continue;const f=window[n];window[n]=function(dt){const r=f.apply(this,arguments);try{calTick()}catch(e){}return r}}
/* ---------- mulillas con el caballo animado ---------- */
function calPompones(H,cols){const sc=H.root;sc.updateMatrixWorld(true);let hb=null,nb=null;sc.traverse(o=>{if(o.isBone&&o.name==='Head')hb=o;if(o.isBone&&o.name==='Neck')nb=o});
 const fijo=(bone,fn)=>{if(!bone)return;const g=new THREE.Group();bone.add(g);const ws=new THREE.Vector3(),wq=new THREE.Quaternion();bone.getWorldScale(ws);bone.getWorldQuaternion(wq);
  g.scale.set(1/ws.x,1/ws.y,1/ws.z);g.quaternion.copy(wq.invert());fn(g)};const G=geos();
 // madroños sobre la testuz
 fijo(hb,g=>{cols.forEach((c,i)=>mesh(G.sph,M(c,.7),.07,.07,.07,(i-1)*.07,.16+(i%2)*.03,-.02,g,true));mesh(G.cyl,M('#e6bb55',.4,.5),.012,.22,.012,0,.26,-.02,g,true)});
 // collera con cascabeles
 fijo(nb,g=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.26,.06,8,18),M('#7a1525',.6));t.rotation.x=Math.PI/2.4;t.castShadow=true;g.add(t);
  for(let i=0;i<5;i++){const a=-1.1+i*.55;mesh(G.sph,M('#d9b45a',.25,.85),.035,.035,.035,Math.sin(a)*.28,-.05,Math.cos(a)*.22,g,true)}})}
const _makeHorse2C=makeHorse2;
makeHorse2=function(o={}){if(o&&o.mule&&MOD.hor&&!o.proc){try{const H=makeHorseGL({col:o.col||'#3a2c22',dark:'#15100c',saddle:false});calPompones(H,['#c0303a','#e6bb55','#2b5aa0']);H.root.scale.setScalar(.84);return H}catch(e){console.warn('mula GL',e)}}return _makeHorse2C.apply(this,arguments)};
