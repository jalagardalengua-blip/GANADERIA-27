// Fase 1: 3D sin CDN, memoria al entrar/salir, guardado con copia, recuperación, ranuras, exportar/importar, segundo plano
const {chromium}=require('playwright');const fs=require('fs');const BASE=process.env.BASE||'http://localhost:8765/';
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:390,height:844},acceptDownloads:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/cdnjs|fonts\.(googleapis|gstatic)/,r=>r.abort()); // sin red externa
const R={};const ok=(k,v)=>{R[k]=v;console.log((v&&v.ok!==false?'OK  ':'FAIL')+' '+k+' '+JSON.stringify(v))};
await p.goto(BASE+'index.html');await p.waitForTimeout(800);
ok('three local sin CDN',{ok:await p.evaluate(()=>typeof THREE!=='undefined'&&THREE.REVISION)});
// memoria
const mem=await p.evaluate(async()=>{localStorage.clear();startReal(0);const r=[];for(let i=0;i<10;i++){show3D();enterFinca();await new Promise(z=>setTimeout(z,250));exit3D();await new Promise(z=>setTimeout(z,80));const m=W3.R.info.memory;r.push([m.geometries,m.textures])}return r});
ok('memoria finca x10',{ok:mem[9][1]<=mem[2][1]+8&&mem[9][0]<=mem[2][0]+15,mem:[mem[0],mem[2],mem[9]]});
// guardado y copia
const sv=await p.evaluate(()=>{save();for(let i=0;i<2;i++)advance();save();return {bak:!!localStorage.getItem(KEY+'-bak'),main:localStorage.getItem(KEY).length}});ok('copia de seguridad',{ok:sv.bak,...sv});
const rec=await p.evaluate(()=>{const name=S.g.name;localStorage.setItem(KEY,'{"roto":');const o=load();return {ok:!!o&&o.g.name===name,danada:!!localStorage.getItem(KEY+'-danada')}});ok('recuperar partida dañada',rec);
const slots=await p.evaluate(()=>{window.__noConfirm=1;S=load();save();slotGuardar(2);const m0=S.money;S.money=1;save();slotCargar(2);return new Promise(z=>setTimeout(()=>z({ok:S&&Math.abs(S.money-m0)<1,info:slotInfo(2)}),1500))});ok('ranura guardar/cargar',slots);
// exportar
const [dl]=await Promise.all([p.waitForEvent('download'),p.evaluate(()=>partidaExportar())]);const fp='/tmp/hd-export-test.json';await dl.saveAs(fp);const ex=JSON.parse(fs.readFileSync(fp,'utf8'));ok('exportar',{ok:ex.app==='hierro-y-divisa'&&!!ex.hash,name:dl.suggestedFilename(),kb:Math.round(fs.statSync(fp).size/1024)});
const imp=await p.evaluate(t=>{try{const o=desempaquetar(t);return {ok:o.g.name===S.g.name}}catch(e){return {ok:false,e:e.message}}},fs.readFileSync(fp,'utf8'));ok('importar válido',imp);
const bad=await p.evaluate(t=>{const j=JSON.parse(t);j.data=j.data.replace('"money":','"money":9');try{desempaquetar(JSON.stringify(j));return {ok:false}}catch(e){return {ok:true,msg:e.message}}},fs.readFileSync(fp,'utf8'));ok('rechaza archivo manipulado',bad);
const bad2=await p.evaluate(()=>{try{desempaquetar('{"hola":1}');return {ok:false}}catch(e){return {ok:true,msg:e.message}}});ok('rechaza JSON ajeno',bad2);
// ajustes
const aj=await p.evaluate(()=>{S=null;MENU.v='ajustes';render();return {ok:!!document.querySelector('.svSect'),slots:document.querySelectorAll('.svSlot').length}});ok('sección Partidas en Ajustes',aj);
await p.screenshot({path:'docs/qa/capturas/ajustes-partidas.png',fullPage:true});
// segundo plano
const vis=await p.evaluate(async()=>{S=load();show3D();enterFinca();await new Promise(z=>setTimeout(z,200));const on0=W3.on;Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));const off=W3.on;Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));return {ok:on0&&!off&&W3.on,on0,off,on1:W3.on}});ok('pausa en segundo plano',vis);
ok('errores de página',{ok:errs.length===0,errs});
console.log('RESULTADO',Object.values(R).every(v=>v&&v.ok!==false)?'TODO OK':'HAY FALLOS');await b.close()})();
