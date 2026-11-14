// QA: el polvo nunca manda valores NaN a la GPU (en iPhone salían círculos negros)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:640,height:360}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('C '+m.text().slice(0,160))});
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9701,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:1,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,1).map(a=>a.id);S.offers.push(o);const r=celebrar(o);enterPlaza(r.id)});
const fr=()=>p.frames().find(f=>/ruedo\.html/.test(f.url()));
for(let i=0;i<120&&!(fr()&&await fr().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);
await fr().evaluate(()=>{__ruedo.ui.speed=4;window.__nan={n:0,frames:0,vis:0};(function q(){const d=__ruedo.dust;for(let i=0;i<d.N;i++){const a=d.alpha[i],s=d.size[i];if(!(a>=0&&a<=1)||!isFinite(s))__nan.n++;if(a>0)__nan.vis++}__nan.frames++;requestAnimationFrame(q)})()});
await p.waitForTimeout(40000);const r=await fr().evaluate(()=>window.__nan);console.log(JSON.stringify(r));
console.log(errs.length?'ERRORES '+JSON.stringify(errs):r.n===0&&r.vis>0?'POLVO OK':'POLVO MAL');await b.close()})();
