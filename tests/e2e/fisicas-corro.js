// QA ganadería de corro: físicas y movimientos de la res en todos los festejos y plazas.
// Falla si la res asoma dentro de una casa, se teletransporta, gira de golpe, se atasca,
// o si el bou embolat se queda en el pilón en lugar de salir libre por la plaza.
// Uso: servidor local en la raíz (python3 -m http.server 8765) y  BASE=http://localhost:8765/ node tests/e2e/fisicas-corro.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});p.setDefaultTimeout(1800000);
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message+' @'+(e.stack||'').split('\n')[1]));
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
await p.goto((process.env.BASE||'http://localhost:8765/')+'index.html');await p.waitForTimeout(800);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{startReal(0);S.money=3e6;NEWC.name='Prueba';NEWC.l='PR';NEWC.lote=1;crearCorro()});
const CASOS=[['embolado','Vila-real'],['embolado','Nules'],['embolado','Burriana'],['embolado','Onda'],['embolado','Morella'],['embolado','Sueca'],
 ['vaquillas','Algemesí'],['capea','Segorbe'],['cerril','Morella'],['mar','Burriana'],['encierro','Onda'],['corda','Nules'],['concurso','Vila-real']];
let fallos=0;
for(const [tipo,pueblo] of CASOS){
 const r=await p.evaluate(([tipo,pueblo])=>{if(W3.mode==='calle')salirCalle();const C=S.corro;
  for(const a of C.an){a.salMes=0;a.lesion=0;a.salud=90}
  if(tipo==='cerril'){const ok=()=>cDisp('cerril',{tipo:'cerril'}).length>0;S.money=Math.max(S.money,3e6);for(let k=0;k<20&&!ok();k++){C.mkt=null;corroMkt();if(C.mkt&&C.mkt.c&&C.mkt.c.length)cComprar('c',0)}}
  const o={id:8000+Math.floor(Math.random()*1000),pueblo,prov:'Castellón',tam:3,fiesta:'Festes',tipo,abs:absNow(),pago:3000,st:'aceptada',night:tipo==='embolado'};C.of.push(o);
  irCalle(o.id);if(!CL)return 'sin festejo';
  const fuera=(E,x,z,home)=>{if(home?clFreeHome(E,x,z,0):E.walk({x,z},false))return 0;for(let d=.05;d<3;d+=.05)for(let i=0;i<12;i++){const a=i/12*6.283;if(home?clFreeHome(E,x+Math.sin(a)*d,z+Math.cos(a)*d,0):E.walk({x:x+Math.sin(a)*d,z:z+Math.cos(a)*d},false))return d}return 3};
  const P=EMB_POST,H=[],fases=[];let salida=-1,f=0,peor=0,tele=0,maxSalto=0,giros=0,atasco=0,maxAtasco=0,cerca=0,maxCerca=0,plz=0,last=null,lastPh=null;
  while(CL&&!CL.done&&f<60000){calleTick(1/30);f++;
   if(CL&&CL.enc)for(const h of CL.enc.herd){const x=h.b.root.position.x,z=h.b.root.position.z,y=h.b.root.rotation.y;if(h.__q){const j=Math.hypot(x-h.__q[0],z-h.__q[1]);maxSalto=Math.max(maxSalto,j);if(j>.5)tele++;if(Math.abs(angD(h.__q[2],y))*30>9)giros++}h.__q=[x,z,y]}
   const r=CL&&CL.res;if(!r||!r.b){last=null;continue}
   if(CL.emb&&CL.emb.ph!==lastPh){lastPh=CL.emb.ph;fases.push(lastPh)}
   if(CL.emb&&CL.emb.r===r&&CL.emb.ph!=='libre'){last=null;continue}
   if(r.mode==='enc'||r.mode==='nada'||r.mode==='alMar'){last=null;continue}
   const home=r.mode==='recogida'||r.mode==='sale',E=CL.env,s=Math.sin(r.yaw),c=Math.cos(r.yaw);
   if(E.name==='calle')for(const o2 of [0,1.0,-1.0]){const d=fuera(E,r.x+s*o2,r.z+c*o2,home);if(d>peor)peor=d}
   if(E.name==='calle'&&clRectOf(r.x,r.z)==='plz')plz++;
   if(tipo==='embolado'&&salida<0){cerca++;if(Math.hypot(r.x-P.x,r.z-P.z)>4)salida=cerca}
   if(last&&last.r===r){const j=Math.hypot(r.x-last.x,r.z-last.z);maxSalto=Math.max(maxSalto,j);if(j>.5)tele++;if(Math.abs(angD(last.yaw,r.yaw))*30>9)giros++}
   H.push([r.x,r.z,r.mode]);if(H.length>60)H.shift();
   if(H.length===60&&H.every(h=>h[2]==='embiste'||h[2]==='trota')&&Math.hypot(H[59][0]-H[0][0],H[59][1]-H[0][1])<.5){atasco++;maxAtasco=Math.max(maxAtasco,atasco)}else atasco=0;
   last={x:r.x,z:r.z,yaw:r.yaw,r}}
  const sg=n=>+(n/30).toFixed(1);
  return {tipo,pueblo,plaza:CL&&CL.plazaNom,acabado:!!(CL&&CL.done),peorAsomo:+peor.toFixed(2),teletransportes:tele,maxSaltoM:+maxSalto.toFixed(2),girosBruscos:giros,maxAtascoSeg:sg(maxAtasco),
   enPlazaSeg:sg(plz),seSueltaDelPilonSeg:sg(salida<0?99999:salida),fases:fases.join('>')}},[tipo,pueblo]);
 const emb=typeof r==='object'&&r.tipo==='embolado';
 const bad=typeof r==='string'||!r.acabado||r.peorAsomo>.3||r.teletransportes>0||r.girosBruscos>0||r.maxAtascoSeg>2||
  (emb&&(r.fases!=='puerta>arrastre>amarre>fang>ferros>foc>solta>libre'||r.seSueltaDelPilonSeg>4||r.enPlazaSeg<5));
 if(bad)fallos++;console.log(bad?'FAIL':'OK',JSON.stringify(r))}
console.log(errs.slice(0,10).join('\n'));console.log('TOTAL',fallos,'fallos,',errs.length,'errores');await b.close();process.exit(fallos||errs.length?1:0)})();
