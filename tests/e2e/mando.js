// QA: mando táctil en la finca: joystick flotante, correr al empujar a fondo y pellizco para el zoom
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2000);await p.evaluate(()=>{localStorage.clear();startReal(1);enter3D()});await p.waitForTimeout(7000);
const cdp=await ctx.newCDPSession(p);const T=(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts.map((q,i)=>({x:q[0],y:q[1],id:q[2]??i}))});
const R={};const p0=await p.evaluate(()=>[W3.F.p.x,W3.F.p.z]);
await T('touchStart',[[250,200]]);await p.waitForTimeout(150);R.joyMovido=await p.evaluate(()=>document.getElementById('joy').classList.contains('flota'));
await T('touchMove',[[250,140]]);for(let i=0;i<8;i++){await p.waitForTimeout(300);await T('touchMove',[[250,140-(i%2)]])}
R.corre=await p.evaluate(()=>!!W3.run);const p1=await p.evaluate(()=>[W3.F.p.x,W3.F.p.z]);R.avanza=Math.hypot(p1[0]-p0[0],p1[1]-p0[1])>.5;
await T('touchEnd',[]);await p.waitForTimeout(400);R.suelta=await p.evaluate(()=>!W3.run&&W3.jx===0&&!document.getElementById('joy').classList.contains('flota'));
const z0=await p.evaluate(()=>W3.zoom||1);await T('touchStart',[[560,200,1]]);await T('touchStart',[[560,200,1],[700,200,2]]);await T('touchMove',[[600,200,1],[660,200,2]]);await p.waitForTimeout(200);await T('touchEnd',[]);
R.zoom=await p.evaluate(z0=>(W3.zoom||1)>z0+.2,z0);
console.log(JSON.stringify(R));console.log(errs.length?'ERRORES '+JSON.stringify(errs):Object.values(R).every(Boolean)?'MANDO OK':'MANDO MAL');await b.close()})();
