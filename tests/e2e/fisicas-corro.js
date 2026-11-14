// QA ganadería de corro: la res no atraviesa casas ni se queda enganchada, y el bou embolat sigue el ritual real
// Uso: servidor local en la raíz (python3 -m http.server 8765) y  BASE=http://localhost:8765/ node tests/e2e/fisicas-corro.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});p.setDefaultTimeout(900000);
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message+' @'+(e.stack||'').split('\n')[1]));
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
await p.goto((process.env.BASE||'http://localhost:8765/')+'index.html');await p.waitForTimeout(800);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{startReal(0);S.money=3e6;NEWC.name='Prueba';NEWC.l='PR';NEWC.lote=1;crearCorro()});
let fallos=0;
const PUEBLOS=['Burriana','Algemesí','Onda','Segorbe','Nules','Sueca','Morella'];let ip=0;
for(const tipo of ['vaquillas','capea','cerril','mar','embolado','vaquillas','vaquillas']){const pueblo=PUEBLOS[ip++%PUEBLOS.length];
 const r=await p.evaluate(([tipo,pueblo])=>{if(W3.mode==='calle')salirCalle();const C=S.corro;if(tipo==='cerril'&&!C.an.some(a=>a.cerril)){S.money=Math.max(S.money,3e6);for(let k=0;k<20&&!C.an.some(a=>a.cerril);k++){C.mkt=null;corroMkt();if(C.mkt&&C.mkt.c&&C.mkt.c.length)cComprar('c',0)}}
  const o={id:8000+Math.floor(Math.random()*1000),pueblo,prov:'Castellón',tam:3,fiesta:'Sant Cristòfol',tipo,abs:absNow(),pago:3000,st:'aceptada',night:tipo==='embolado'};C.of.push(o);
  for(const a of C.an){a.salMes=0;a.lesion=0;a.salud=90}irCalle(o.id);if(!CL)return 'sin festejo';
  // fuera de la zona transitable: distancia aproximada que asoma cada parte del cuerpo
  const fuera=(E,x,z,home)=>{if(home?clFreeHome(E,x,z,0):E.walk({x,z},false))return 0;for(let d=.05;d<3;d+=.05)for(let i=0;i<12;i++){const a=i/12*6.283;if(home?clFreeHome(E,x+Math.sin(a)*d,z+Math.cos(a)*d,0):E.walk({x:x+Math.sin(a)*d,z:z+Math.cos(a)*d},false))return d}return 3};
  let f=0,peor=0,malos=0,quieta=0,maxQuieta=0,fases=[],lastPh=null,cuerpo=0;
  while(CL&&!CL.done&&f<60000){calleTick(1/30);f++;const r=CL&&CL.res;if(!r||!r.b)continue;
   if(CL.emb&&CL.emb.ph!==lastPh){lastPh=CL.emb.ph;fases.push(lastPh)}
   if(CL.emb&&CL.emb.r===r&&CL.emb.ph!=='libre')continue;
   const home=r.mode==='recogida'||r.mode==='sale',E=CL.env,s=Math.sin(r.yaw),c=Math.cos(r.yaw);
   for(const o of [0,1.0,-1.0]){const d=fuera(E,r.x+s*o,r.z+c*o,home);if(d>peor)peor=d;if(d>.15)malos++}
   if(!clBody(E,r.x,r.z,r.yaw,home))cuerpo++;
   if((r.mode==='embiste'||r.mode==='trota')&&r.v<.3){quieta++;maxQuieta=Math.max(maxQuieta,quieta)}else quieta=0}
  return {tipo,pueblo,plaza:CL&&CL.plazaNom,f,acabado:!!(CL&&CL.done),peorAsomo:+peor.toFixed(2),fotogramasDentroDeCasa:malos,solapes:cuerpo,maxAtascoSeg:+(maxQuieta/30).toFixed(1),fases:fases.join('>')}},[tipo,pueblo]);
 const bad=typeof r==='string'||!r.acabado||r.peorAsomo>.3||r.maxAtascoSeg>4||(tipo==='embolado'&&r.fases!=='puerta>arrastre>amarre>fang>ferros>foc>solta>libre');
 if(bad)fallos++;console.log(bad?'FAIL':'OK',JSON.stringify(r))}
console.log(errs.slice(0,10).join('\n'));console.log('TOTAL',fallos,'fallos,',errs.length,'errores');await b.close();process.exit(fallos||errs.length?1:0)})();
