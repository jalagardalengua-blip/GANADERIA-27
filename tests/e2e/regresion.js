// QA: recorre todos los modos en un navegador real (3D con SwiftShader) y recoge errores
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
if(process.env.THREE_JS)await p.route(/cdnjs\.cloudflare\.com.*three/,r=>r.fulfill({path:process.env.THREE_JS,contentType:'application/javascript'}));
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | ')));p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|net::/.test(m.text()))errs.push('CONSOLE '+m.text())});
const step=async(name,fn,arg)=>{const n0=errs.length;try{const r=await p.evaluate(fn,arg);console.log('OK',name,r!==undefined?JSON.stringify(r).slice(0,300):'')}catch(e){console.log('FAIL',name,e.message.split('\n')[0])}if(errs.length>n0)console.log('  errors:',errs.slice(n0).join('\n  '))};
const run=async(frames,mode)=>p.evaluate(([frames,mode])=>{for(let i=0;i<frames;i++){const dt=1/30;if(W3.mode==='finca')fincaTick(dt);else if(W3.mode==='plaza')plazaTick(dt);else if(W3.mode==='tienta')tientaTick(dt);else if(W3.mode==='calle')calleTick(dt)}},[frames,mode]);
await p.goto(''+(process.env.BASE||'http://localhost:8765/')+'index.html');await p.waitForTimeout(800);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(800);await p.evaluate(()=>{window.__noConfirm=1});
for(const g of ['Miura','Torrestrella','Prieto de la Cal']){
 await step('start '+g,()=>{});await p.evaluate(g=>{localStorage.clear();startReal(GANADERIAS.findIndex(x=>x.name===g))},g);
 for(const t of ['inicio','finca','camada','corro','ofertas','mercado','tareas','palmares'])await step(g+' tab '+t,t=>{go(t);return document.querySelector('#scr')?.children.length},t);
}
await step('fundar',()=>{localStorage.clear();S=null;render();NEWG.name='Los Almendros';NEWG.l='LA';startNew();return 1});await p.waitForTimeout(1500);await step('fundada',()=>S&&S.g.name);
await step('ficha',()=>{openFicha(campo()[0].id);closeModal();return 1});
await step('vender/tentar lote',()=>{S.money=2e6;tientaLote&&tientaLote();closeModal();return 1});
await step('obras all',()=>{for(const k in MEJ){let g=0;while(mejLv(k)<MEJ[k].max&&g++<5)construir(k,true)}return JSON.stringify(S.mej).length});
await step('crear corro',()=>{S.money=3e6;NEWC.name='El Templario';NEWC.l='ET';NEWC.lote=1;crearCorro();return S.corro.an.length});
// 36 meses con acciones aleatorias
await step('36 meses',()=>{let n=0;for(let i=0;i<36;i++){for(const o of S.offers.filter(o=>o.st==='nueva')){const el=campo().filter(a=>eligible(a,o)).slice(0,o.n);if(el.length===o.n){o.toros=el.map(a=>a.id);o.st='aceptada';el.forEach(a=>a.res=o.id)}}
  for(const o of S.corro.of)if(o.st==='nueva'&&cPuede(o))cAceptar(o.id);for(const f of fActivas())if(Math.random()<.5)fHacer(f.id,1);
  if(Math.random()<.3){const a=bravoAptos()[0];if(a)traspasar(a.id)}S.money=Math.max(S.money,300000);advance();n++;closeModal&&closeModal(true);const ov=document.getElementById('ov');if(ov)ov.remove()}
  return {n,money:Math.round(S.money),year:S.year,corro:S.corro.st.fest,toros:campo().length}});
for(const t of ['inicio','finca','camada','corro','ofertas','mercado','tareas','palmares'])await step('tab after '+t,t=>{go(t);return 1},t);
// finca 3D
await step('finca 3D',()=>{enter3D();return W3.mode});await run(200);
await step('acts',()=>{const r=[];for(const a of W3.acts.slice(0,40)){if(a.cond&&!a.cond())continue;try{W3.F.p.set(a.x,0,a.z);const l=typeof a.l==='function'?a.l():a.l;r.push(l)}catch(e){r.push('ERR '+e.message)}}return r.length});
await run(120);
await step('montar/acoso',()=>{montar();const h=W3.herd.find(h=>acosable(h));if(h)iniAcoso(h);return !!h});await run(200);
await step('desmontar',()=>{if(W3.acoso)finAcoso(false);desmontar();return 1});
await step('camioneta',()=>{W3.F.p.set(W3.truck.x,0,W3.truck.z);subir();W3.jy=1;return W3.drive});await run(150);await step('bajar',()=>{W3.jy=0;bajar();return W3.drive});
await step('noche',()=>{W3.tod=.9;return 1});await run(60);
// tienta
await step('tienta H',()=>{const c=campo().filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2);if(!c.length){const m=campo().find(a=>a.sex==='M'&&!a.role&&!a.tentado&&ageY(a)>=3);startTienta('M',m.id)}else startTienta('H');return TT&&TT.phase});
await step('tienta juego',()=>{let g=0,n=0;while(TT&&g<40000){g++;if(TT.phase==='espera')ttCitar();if(TT.phase==='arranca'){const d=Math.hypot(TT.cp.x-TT.cx,TT.cp.z-TT.cz);if(d<2.5)ttTemplar()}if(TT&&TT.phase==='fin'){n++;ttDecide(n%2)}if(TT)tientaTick(1/30)}return {n,mode:W3.mode}});
// plaza
await step('corrida',()=>{exit3D();RD.forzarClasica=true;const o={id:9501,plaza:'Las Ventas (Madrid)',feria:'San Isidro',cat:1,tipo:'corrida',abs:absNow(),n:6,precio:12000,st:'aceptada'};o.toros=campo().filter(a=>lidiable(a)&&ageY(a)>=3).slice(0,6).map(a=>a.id);if(o.toros.length<6)o.toros=campo().filter(a=>a.sex==='M'&&ageY(a)>=3).slice(0,6).map(a=>a.id);o.n=o.toros.length;S.offers.push(o);if(o.toros.length<2)return 'pocos toros '+o.toros.length;const r=celebrar(o);show3D();enterPlaza(r.id);cartelGo();return CP&&CP.paused});
await step('corrida play',()=>{let f=0;const v=['tv','tendido','callejon','toro'];while(CP&&!CP.done&&f<450000){if(f%400===0)CP.view=v[(f/400)%4];plazaTick(1/15);f++}return {f,done:CP&&CP.done}});
await step('juicio',()=>{const r=CP.r;return r.toros.map(t=>[t.name,t.nota,t.res,t.trof,t.mat,t.trp,!!t.cogida,(t.juicio||'').slice(0,60)])});
await p.screenshot({path:'docs/qa/capturas/regresion-final.png'});
await step('salir plaza',()=>{exitPlaza();return W3.mode});
// calle: cada tipo
for(const tipo of ['vaquillas','embolado','capea','concurso','encierro','corda','mar','cerril']){
 await step('calle '+tipo,tipo=>{if(W3.mode==='calle')salirCalle();const C=S.corro;if(tipo==='cerril'&&!C.an.some(a=>a.cerril)){C.mkt=null;corroMkt();cComprar('c',0)}
  const o={id:7000+Math.floor(Math.random()*1000),pueblo:'Burriana',prov:'Castellón',tam:3,fiesta:'Misericòrdia',tipo,abs:absNow(),pago:3500,st:'aceptada',night:tipo==='embolado'};C.of.push(o);
  for(const a of C.an){a.salMes=0;a.lesion=0;a.salud=90}irCalle(o.id);return CL?{n:CL.an.length,plaza:CL.plaza}:'no CL'},tipo);
 await step('calle play '+tipo,()=>{if(!CL)return 'skip';clSpect(false);let f=0;while(CL&&!CL.done&&f<45000){const me=CL.me,r=CL.res;if(r){const w=clWindow(me);if(w&&(w.charge&&w.d<2.6&&w.d>1.6||CL.plaza&&!w.charge&&w.d<2.3&&w.d>1.1&&w.front>.75))clAccion('q');const d=Math.hypot(r.x-me.x,r.z-me.z);if(d>6&&r.mode!=='embiste'){W3.yaw=Math.atan2(-(r.x-me.x)/d,-(r.z-me.z)/d);W3.jy=.6}else W3.jy=0}calleTick(1/30);f++}return {f,done:CL&&CL.done,pts:CL&&CL.pts}});
 await step('calle fin '+tipo,()=>{if(CL)salirCalle();return S.corro.hist[0]&&[S.corro.hist[0].tipo,S.corro.hist[0].media]});
}
await step('tienta corro',()=>{const v=S.corro.an.filter(a=>a.sex==='H'&&cAgeM(a)>=18);v.forEach(a=>a.tentado=false);corroTienta(v.slice(0,2).map(a=>a.id));return TT&&TT.corro});
await step('tienta corro juego',()=>{let g=0,n=0;while(TT&&g<40000){g++;if(TT.phase==='espera')ttCitar();if(TT.phase==='arranca'){const d=Math.hypot(TT.cp.x-TT.cx,TT.cp.z-TT.cz);if(d<2.5)ttTemplar()}if(TT&&TT.phase==='fin'){n++;ttDecide(n%2)}if(TT)tientaTick(1/30)}return {n,mode:W3.mode}});
await step('exit',()=>{exit3D();go('corro');return 1});
await step('save/load',()=>{save();const s=load();return !!(s&&s.corro)});
await step('continuar',()=>{S=null;continuar();return S&&S.g.name});
await step('menu',()=>{irMenu();menuGo('hist');menuGo('fundar');menuGo('ajustes');menuGo('modos');menuGo('main');return document.querySelectorAll('.mItem').length});
await step('continuar menu',()=>{menuContinuar();return 1});await p.waitForTimeout(1500);await step('continuada',()=>S&&S.g.name);
await step('gameover',()=>{S.money=-200000;advance();return document.body.innerText.slice(0,40)});
console.log('TOTAL ERRORS',errs.length);await b.close()})();
