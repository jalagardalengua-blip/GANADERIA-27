const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
if(process.env.THREE_JS)await p.route(/cdnjs\.cloudflare\.com.*three/,r=>r.fulfill({path:process.env.THREE_JS,contentType:'application/javascript'}));await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
await p.goto(''+(process.env.BASE||'http://localhost:8765/')+'index.html');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9501,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:6,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,6).map(a=>a.id);o.n=o.toros.length;S.offers.push(o);const r=celebrar(o);show3D();enterPlaza(r.id);cartelGo();let f=0;while(CP&&!CP.done&&f<200000){plazaTick(1/15);f++}return {n:o.n,f,done:CP&&CP.done,j:CP&&CP.r.toros.map(t=>t.res+' '+t.nota)}}));
console.log(errs);await b.close()})();
