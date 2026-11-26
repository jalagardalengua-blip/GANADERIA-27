// QA: corrida en directo en la plaza realista (ruedo.html): carga, resultado de la presidencia, siguiente toro y resumen
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push('P '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('C '+m.text().slice(0,200))});
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9501,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:2,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,2).map(a=>a.id);o.n=2;S.offers.push(o);const r=celebrar(o);r.toros[0].res='vuelta';r.toros[0].trof=2;r.toros[0].ent=1;r.toros[0].esto='entera';enterPlaza(r.id)});
const fr=()=>p.frames().find(f=>/ruedo\.html/.test(f.url()));
for(let i=0;i<120&&!(fr()&&await fr().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);
await p.waitForTimeout(3000);await p.screenshot({path:'/tmp/ruedo-A.png',timeout:120000});
await fr().evaluate(()=>__ruedo.fin());await p.waitForTimeout(2500);await p.screenshot({path:'/tmp/ruedo-B.png',timeout:120000});
await fr().evaluate(()=>document.getElementById('rSig').click());await p.waitForTimeout(6000);console.log('toro2',await fr().evaluate(()=>document.getElementById('cTo').textContent));
await fr().evaluate(()=>__ruedo.fin());await p.waitForTimeout(1500);console.log(await fr().evaluate(()=>document.getElementById('rSig').textContent));
await fr().evaluate(()=>document.getElementById('rSig').click());await p.waitForTimeout(2500);
console.log('overlay',await p.evaluate(()=>!!document.getElementById('ruedoOv')),'modal',await p.evaluate(()=>!!document.getElementById('ov')));await p.screenshot({path:'/tmp/ruedo-C.png',timeout:120000});
console.log(errs.length?"ERRORES "+JSON.stringify(errs):"RUEDO OK");await b.close()})();
