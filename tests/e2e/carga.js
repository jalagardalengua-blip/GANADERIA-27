// QA: pantalla de carga al abrir el juego, al entrar en la finca con un botón y en la plaza en directo
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const R={};
for(const [n,vp] of [['v',{width:390,height:844}],['h',{width:844,height:390}]]){const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errs.push(n+' '+e.message));
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(500);await p.screenshot({path:`/tmp/carga-${n}.png`});
 R['arranque_'+n]=await p.evaluate(()=>document.getElementById('carga').classList.contains('on'));
 await p.waitForTimeout(4000);R['oculta_'+n]=await p.evaluate(()=>!document.getElementById('carga').classList.contains('on'));
 if(n==='h'){await p.evaluate(()=>{localStorage.clear();startReal(1);render();const bt=document.createElement('button');bt.id='tb';bt.setAttribute('onclick','enter3D()');bt.textContent='x';bt.style.cssText='position:fixed;top:4px;left:4px;z-index:2147483647;width:60px;height:40px';document.body.appendChild(bt)});
  await p.click('#tb');R.click_muestra=await p.evaluate(()=>CG.on);await p.waitForTimeout(150);await p.screenshot({path:'/tmp/carga-finca.png'});
  for(let i=0;i<40&&await p.evaluate(()=>CG.on);i++)await p.waitForTimeout(500);R.finca=await p.evaluate(()=>W3.on&&W3.mode==='finca'&&!CG.on)}
 await p.close()}
console.log(JSON.stringify(R));const ok=Object.values(R).every(Boolean);console.log(errs.length?'ERRORES '+JSON.stringify(errs):ok?'CARGA OK':'CARGA MAL');await b.close()})();
