// QA: cogida animada en la plaza realista: prende, voltea, cae y (leve) se levanta y sigue la faena
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push('P '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('C '+m.text().slice(0,200))});
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9502,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:1,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,1).map(a=>a.id);S.offers.push(o);const r=celebrar(o);r.toros[0].res='oreja';r.toros[0].trof=1;r.toros[0].cogida={parte:'leve'};enterPlaza(r.id)});
const fr=()=>p.frames().find(f=>/ruedo\.html/.test(f.url()));
for(let i=0;i<120&&!(fr()&&await fr().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);

await fr().evaluate(()=>{__ruedo.ui.speed=4;__ruedo.cog()});
let seen={cogida:0,h:0,back:0};for(let i=0;i<240;i++){const s=await fr().evaluate(()=>({ph:__ruedo.D.phase,h:__ruedo.CG.h,t:__ruedo.CG.t,on:__ruedo.CG.on}));
 if(s.ph==='cogida'){if(!seen.cogida)await fr().evaluate(()=>{__ruedo.ui.speed=1});seen.cogida=1;seen.h=Math.max(seen.h,s.h);if(s.h>1.2&&!seen.shot){seen.shot=1;await p.screenshot({path:'/tmp/cog-A.png',timeout:120000})}if(s.t>2.2&&!seen.shot2){seen.shot2=1;seen.dEnd=await fr().evaluate(()=>__ruedo.dist);await p.screenshot({path:'/tmp/cog-B.png',timeout:120000})}}
 else if(seen.cogida){seen.back=s.ph;seen.dUp=await fr().evaluate(()=>__ruedo.dist);break}await p.waitForTimeout(300)}
console.log('seen',JSON.stringify(seen));await p.waitForTimeout(3000);await p.screenshot({path:'/tmp/cog-C.png',timeout:120000});
console.log('fase',await fr().evaluate(()=>__ruedo.D.phase+' dist '+__ruedo.dist.toFixed(1)));
console.log(errs.length?"ERRORES "+JSON.stringify(errs):"COGIDA OK");await b.close()})();
