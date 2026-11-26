// QA: cámara del tendido en la corrida en directo, en móvil apaisado y vertical: capturas y suavidad del encuadre
const {chromium,devices}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const res={};
for(const [n,vp] of [['h',{width:844,height:390}],['v',{width:390,height:844}]]){
const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:true,hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(n+' '+e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9600,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:1,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,1).map(a=>a.id);S.offers.push(o);const r=celebrar(o);r.toros[0].res='oreja';r.toros[0].trof=1;enterPlaza(r.id)});
const fr=()=>p.frames().find(f=>/ruedo\.html/.test(f.url()));
for(let i=0;i<120&&!(fr()&&await fr().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);
await fr().evaluate(()=>{__ruedo.setCam('tendido');__ruedo.ui.speed=2;const st={n:0,maxYaw:0,maxFov:0,lastF:null,lastD:null};window.__cam=st;const cam=__ruedo.camera||null;
 let pd=null,pf=null,pt=performance.now(),t0=pt;(function t(){const c=__ruedo.cam;if(c&&performance.now()-t0>2500){const d=new THREE.Vector3();c.getWorldDirection(d);const now=performance.now(),dt=Math.max(1e-3,(now-pt)/1000);pt=now;
  if(pd){const a=d.angleTo(pd)/dt;st.maxYaw=Math.max(st.maxYaw,a)}if(pf!=null)st.maxFov=Math.max(st.maxFov,Math.abs(c.fov-pf)/dt);pd=d.clone();pf=c.fov;st.n++}requestAnimationFrame(t)})()});
for(let k=0;k<5;k++){await p.waitForTimeout(5000);await p.screenshot({path:`/tmp/tend-${n}-${k}.png`,timeout:120000})}
res[n]=await fr().evaluate(()=>window.__cam);await ctx.close()}
console.log(JSON.stringify(res));const ok=['h','v'].every(n=>res[n].maxYaw<1.2&&res[n].maxFov<20);console.log(errs.length?'ERRORES '+JSON.stringify(errs):ok?'TENDIDO OK':'TENDIDO BRUSCO');await b.close()})();
