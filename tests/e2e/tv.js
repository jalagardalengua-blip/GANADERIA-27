// QA: realización de TV en la corrida en directo: solo planos de retransmisión, cortes espaciados y sin botón de cámara
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{localStorage.clear();startReal(1);const o={id:9800,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:1,precio:12000,st:'aceptada'};const L=campo().filter(a=>a.sex==='M'&&ageY(a)>=3);o.toros=L.slice(0,1).map(a=>a.id);S.offers.push(o);const r=celebrar(o);r.toros[0].res='oreja';r.toros[0].trof=1;enterPlaza(r.id)});
const fr=()=>p.frames().find(f=>/ruedo\.html/.test(f.url()));
for(let i=0;i<120&&!(fr()&&await fr().evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(1000);
await fr().evaluate(()=>{__ruedo.ui.speed=4;window.__tv={seq:[],last:null,tcut:0,minGap:99};(function q(){const s=__ruedo.plano,t=__ruedo.t;if(s!==__tv.last){if(__tv.last!=null)__tv.minGap=Math.min(__tv.minGap,t-__tv.tcut);__tv.seq.push(s);__tv.last=s;__tv.tcut=t}requestAnimationFrame(q)})()});
const vistos={};for(let k=0;k<55;k++){await p.waitForTimeout(2500);const s=await fr().evaluate(()=>__ruedo.plano);if(!vistos[s]){vistos[s]=1;await p.screenshot({path:`/tmp/tv-${s}.png`,timeout:120000})}}
const r=await fr().evaluate(()=>({seq:__tv.seq,minGap:+__tv.minGap.toFixed(1),boton:!!document.getElementById('bCam')}));console.log(JSON.stringify(r));
const ok=r.seq.every(s=>['tendido','tele','callejon'].includes(s))&&!r.boton&&r.minGap>=2;console.log(errs.length?'ERRORES '+JSON.stringify(errs):ok?'TV OK':'TV MAL');await b.close()})();
