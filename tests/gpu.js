// Coste de dibujo por fotograma de cada escena: llamadas, triángulos, sombras y los objetos más pesados
const {chromium}=require('playwright');const ESC=process.argv[2]||'ruedo';
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});const p=await ctx.newPage();
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2000);let fr=p.mainFrame();
if(ESC==='ruedo'){await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9901,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:1,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,1).map(a=>a.id);S.offers.push(o);const r=celebrar(o);enterPlaza(r.id)});
 const f=()=>p.frames().find(x=>/ruedo\.html/.test(x.url()));for(let i=0;i<120&&!(f()&&await f().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);fr=f();await p.waitForTimeout(3000)}
else if(ESC==='finca'){await p.evaluate(()=>{localStorage.clear();startReal(1);enter3D()});await p.waitForTimeout(8000)}
else if(ESC==='corro'){await p.evaluate(()=>{localStorage.clear();startReal(0);irCalle()});await p.waitForTimeout(12000)}
const r=await fr.evaluate((esc)=>{const R=esc==='ruedo'?__ruedo:null;const ren=R?null:W3.R;let scene,rend;
 if(R){rend=null}else{rend=W3.R;scene=W3.scene}
 const info=(rend||window.__rinfo)?null:null;
 // en ruedo no hay acceso directo al renderer: lo buscamos por el canvas
 const sc=R?(()=>{let s=R.tor.root;while(s.parent)s=s.parent;return s})():scene;
 const objs=[];let shadowCasters=0,shadowTris=0,lights=0,shadowLights=0;
 sc.traverse(o=>{if(o.isLight){lights++;if(o.castShadow)shadowLights++}if(!(o.isMesh||o.isPoints)||!o.visible)return;let vis=true,q=o;while(q){if(!q.visible){vis=false;break}q=q.parent}if(!vis)return;
  const g=o.geometry;const tri=(g.index?g.index.count:g.attributes.position?g.attributes.position.count:0)/3*(o.isInstancedMesh?o.count:1)*(g.isInstancedBufferGeometry?g.instanceCount:1);
  if(o.castShadow){shadowCasters++;shadowTris+=tri}objs.push([o.name||o.type,Math.round(tri),o.castShadow?'S':'',o.isSkinnedMesh?'skin':'',(Array.isArray(o.material)?o.material.length:1)])});
 const tris=objs.reduce((a,o)=>a+o[1],0);objs.sort((a,b)=>b[1]-a[1]);
 const cv=R?R.canvas:rend.domElement;
 return {meshes:objs.length,tris,shadowCasters,shadowTris,lights,shadowLights,buffer:cv.width+'x'+cv.height,top:objs.slice(0,12)}},ESC);
console.log(ESC,JSON.stringify(r));await b.close()})();
