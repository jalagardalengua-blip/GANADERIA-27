// QA: tres vistas en la corrida en directo (TV, tendido, a pie de ruedo) y que en banderillas se encuadre al banderillero
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9960,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:1,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,1).map(a=>a.id);S.offers.push(o);const r=celebrar(o);enterPlaza(r.id)});
const fr=()=>p.frames().find(f=>/ruedo\.html/.test(f.url()));
for(let i=0;i<120&&!(fr()&&await fr().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);
await p.waitForTimeout(2000);await fr().evaluate(()=>__ruedo.banda());
const R={vistas:[]};
for(const v of ['cine','tendido','cerca']){await fr().evaluate(v=>__ruedo.vista(v),v);
 // esperar al cite del banderillero
 for(let i=0;i<90;i++){const st=await fr().evaluate(()=>__ruedo.xl.band&&__ruedo.xl.band.st);if(st==='cita'||st==='reunion')break;if(!st){await fr().evaluate(()=>__ruedo.banda());}await p.waitForTimeout(500)}
 await p.waitForTimeout(700);
 const enc=await fr().evaluate(()=>{const P=__ruedo.xl.band&&__ruedo.xl.band.P;if(!P)return null;const c=__ruedo.cam;const q=P.pos.clone().setY(1.2).project(c);return {x:+q.x.toFixed(2),y:+q.y.toFixed(2),dentro:Math.abs(q.x)<.92&&Math.abs(q.y)<.92&&q.z<1,etiqueta:document.getElementById('bVista').textContent,plano:__ruedo.plano,camPos:__ruedo.cam.position.toArray().map(v=>+v.toFixed(1)),peon:P.pos.toArray().map(v=>+v.toFixed(1))}});
 R.vistas.push([v,enc,await fr().evaluate(()=>[__ruedo.xl.band&&__ruedo.xl.band.st,__ruedo.HI.on])]);await p.screenshot({path:`/tmp/vista-${v}.png`,timeout:120000})}
console.log(JSON.stringify(R));const ok=R.vistas.every(([v,e])=>e&&e.dentro);console.log(errs.length?'ERRORES '+JSON.stringify(errs):ok?'VISTAS OK':'VISTAS MAL');await b.close()})();
