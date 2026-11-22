// QA: modo hiperrealista de la corrida en directo: siempre encendido donde se puede (el botón HD se quitó a propósito); se apaga y enciende por código sin errores; capturas HD/normal
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const ctx=await b.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,isMobile:true,hasTouch:true});const p=await ctx.newPage();
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||/WebGL|THREE/.test(m.text()))errs.push(m.type()+' '+m.text().slice(0,200))});
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9600,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:1,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,1).map(a=>a.id);S.offers.push(o);const r=celebrar(o);r.toros[0].res='oreja';r.toros[0].trof=1;enterPlaza(r.id)});
const fr=()=>p.frames().find(f=>/ruedo\.html/.test(f.url()));
for(let i=0;i<120&&!(fr()&&await fr().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);
await fr().evaluate(()=>{__ruedo.ui.speed=2});await p.waitForTimeout(14000);
const R={};R.soporta=await fr().evaluate(()=>__ruedo.HI.ok);R.ini=await fr().evaluate(()=>__ruedo.HI.on);R.boton=await fr().evaluate(()=>{const b=document.getElementById('bHD');return b&&!b.hidden?b.textContent:null});
await fr().evaluate(()=>{__ruedo.ui.paused=true});await p.waitForTimeout(1500);
await p.screenshot({path:'/tmp/hiper-on.png',timeout:120000});
await fr().evaluate(()=>__ruedo.hi(!__ruedo.HI.on));await p.waitForTimeout(2500);R.apagado=await fr().evaluate(()=>!__ruedo.HI.on);
await p.screenshot({path:'/tmp/hiper-off.png',timeout:120000});
await fr().evaluate(()=>__ruedo.hi(!__ruedo.HI.on));await p.waitForTimeout(2500);R.encendido=await fr().evaluate(()=>__ruedo.HI.on);
await fr().evaluate(()=>{__ruedo.ui.paused=false});await p.waitForTimeout(4000);

console.log(JSON.stringify(R));const ok=R.soporta&&R.ini&&R.boton===null&&R.apagado&&R.encendido;console.log(errs.length?'ERRORES '+JSON.stringify(errs.slice(0,8)):ok?'HIPER OK':'HIPER MAL');await b.close()})();
