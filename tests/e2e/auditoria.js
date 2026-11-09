const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errs=[],reqs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push('console: '+m.text().slice(0,140))});
p.on('requestfinished',async r=>{try{const s=await r.sizes();reqs.push([r.url().replace('http://localhost:8765/',''),s.responseBodySize])}catch(e){}});
if(process.env.THREE_JS)await p.route(/cdnjs\.cloudflare\.com.*three/,r=>r.fulfill({path:process.env.THREE_JS,contentType:'application/javascript'}));await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
const t0=Date.now();await p.goto('http://localhost:8765/index.html',{waitUntil:'load'});const tLoad=Date.now()-t0;
const nav=await p.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return {dcl:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd)}});
await p.waitForTimeout(3000);
const out={tLoad,nav};
out.schema=await p.evaluate(()=>{localStorage.clear();startReal(0);confCompraCorro(0);for(let i=0;i<3;i++)advance();save();const s=localStorage.getItem('hierro-divisa-v1');
 const d=x=>Array.isArray(x)?`array(${x.length})`+(x[0]&&typeof x[0]==='object'?' of {'+Object.keys(x[0]).join(',')+'}':''):x&&typeof x==='object'?'{'+Object.keys(x).join(',')+'}':typeof x;
 const top={};for(const k of Object.keys(S))top[k]=d(S[k]);return {bytes:s.length,top,animal:Object.keys(S.animals[0]),corro:Object.keys(S.corro),corroAnimal:Object.keys(S.corro.an[0]),offer:Object.keys(S.offers[0]||{}),keys:Object.keys(localStorage)}});
fs.writeFileSync('docs/qa/partida-referencia.json',await p.evaluate(()=>localStorage.getItem('hierro-divisa-v1')));
// ciclo de vida 3D: entrar/salir de la finca 10 veces
out.mem=await p.evaluate(async()=>{const r=[];for(let i=0;i<10;i++){show3D();enterFinca();await new Promise(z=>setTimeout(z,250));const m=W3.R.info.memory;r.push([m.geometries,m.textures,W3.R.info.render.calls]);exit3D();await new Promise(z=>setTimeout(z,100))}return r});
out.plaza=await p.evaluate(async()=>{const r=[];if(typeof RD!=='undefined')RD.forzarClasica=true;for(let i=0;i<4;i++){const o={id:9900+i,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:2,precio:12000,st:'aceptada'};o.toros=campo().filter(a=>a.sex==='M'&&ageY(a)>=3).slice(i*2,i*2+2).map(a=>a.id);if(o.toros.length<2)break;S.offers.push(o);const c=celebrar(o);show3D();enterPlaza(c.id);await new Promise(z=>setTimeout(z,300));const m=W3.R.info.memory;r.push([m.geometries,m.textures]);exitPlaza();await new Promise(z=>setTimeout(z,100))}return r});
out.hidden=await p.evaluate(()=>typeof document.hidden+' visibilitychange-handlers:'+(String(window.onvisibilitychange)));
out.reqs=reqs.sort((a,b)=>b[1]-a[1]).slice(0,25);out.errs=[...new Set(errs)];
console.log(JSON.stringify(out,null,1));await b.close()})();
