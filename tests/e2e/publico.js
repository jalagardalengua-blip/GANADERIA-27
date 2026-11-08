// QA: público realista y fiestas de pueblo
// - Plaza en directo: miles de espectadores, reacciones (aplausos, pañuelos, pitos), resolución automática y huellas en el albero.
// - Calle: cadafales con sillas, público de peñas, cohete al salir cada res y personas animadas sin esqueleto roto.
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push('P '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/favicon|404/.test(m.text()))errs.push('C '+m.text().slice(0,200))});
const ok=(n,c,v)=>console.log((c?'OK   ':'FALLO ')+n,JSON.stringify(v));let fallos=0;const chk=(n,c,v)=>{if(!c)fallos++;ok(n,c,v)};
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
// plaza en directo suelta
await p.goto('http://localhost:8765/ruedo.html#qa');
for(let i=0;i<120&&!(await p.evaluate(()=>window.__ruedo&&document.getElementById('loading').classList.contains('off')).catch(()=>false));i++)await p.waitForTimeout(500);
const r1=await p.evaluate(()=>{const R=__ruedo;R.sim(20);R.REACT.panu=1;R.REACT.clap=5;R.PUB.presidencia('#e8892b');return {total:R.PUB.total,mallas:R.PUB.mallas.length,huellas:!!R.HUE.tex,fase:R.D.phase}});
chk('público de la plaza',r1.total>5000&&r1.mallas>10,r1);
// Chrome sin pantalla solo pinta fotogramas cuando se le piden: se avanzan unos cuantos
await p.evaluate(()=>new Promise(r=>{let n=0;const f=()=>{if(++n<40)requestAnimationFrame(f);else r()};requestAnimationFrame(f)}));
const r2=await p.evaluate(()=>{const U=__ruedo.PUB.U;return {panu:+U.uPanu.value.toFixed(2),clap:+U.uClap.value.toFixed(2),visibles:__ruedo.PUB.visibles}});
chk('pañuelos y aplausos llegan al público',r2.panu>.5&&r2.clap>.5&&r2.visibles>0&&r2.visibles<r1.total,r2);
const r3=await p.evaluate(()=>{const s=__ruedo.scene;let sil=0,big=0;s.traverse(o=>{if(o.isMesh&&o.material&&o.material.colorWrite===false&&o.castShadow)sil++;if(o.isMesh&&o.castShadow&&o.geometry&&o.geometry.type==='LatheGeometry'&&o.material.colorWrite!==false)big++});return {sil,big}});
chk('sombras con silueta barata',r3.sil===1&&r3.big===0,r3);
// fiesta de pueblo dentro del juego
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
const c1=await p.evaluate(()=>{localStorage.clear();startReal(1);S.money=3e6;NEWC.name='Peña QA';NEWC.l='PQ';NEWC.lote=1;crearCorro();const C=S.corro;
 const o={id:7101,pueblo:'Burriana',prov:'Castellón',tam:3,fiesta:'Misericòrdia',tipo:'vaquillas',abs:absNow(),pago:3500,st:'aceptada'};C.of.push(o);for(const a of C.an){a.salMes=0;a.lesion=0;a.salud=90}irCalle(o.id);
 for(let i=0;i<120;i++)calleTick(1/30);let sillas=0,bad=0;CL.sc.traverse(o=>{if(o.isInstancedMesh&&o.geometry===PBX.silla)sillas=o.count;if(o.isSkinnedMesh){const si=o.geometry.attributes.skinIndex,sw=o.geometry.attributes.skinWeight;const G=['getX','getY','getZ','getW'];for(let i=0;i<si.count;i++){let m=0;for(const k of G)if(sw[k](i)>.001&&si[k](i)>=o.skeleton.bones.length)m=1;if(m){bad++;break}}}});
 return {publico:CL.pub&&CL.pub.total,sillas,huesosMal:bad,coets:PB.coet.length}});
chk('público y cadafales en la calle',c1.publico>250&&c1.sillas>60,c1);
chk('personas animadas con esqueleto sano',c1.huesosMal===0,c1);
const c2=await p.evaluate(()=>{for(let i=0;i<400;i++)calleTick(1/30);crowdPose(1,CL.t);crowdPose(1,CL.t+.5);const u=CL.pub.U;return {ole:+u.uOle.value.toFixed(2),focoX:+u.uFocus.value.x.toFixed(1)}});
chk('el público de la calle reacciona y mira a la res',c2.ole>0,c2);
await p.evaluate(()=>salirCalle());
chk('sin errores',errs.length===0,errs);
console.log(fallos?'HAY FALLOS':'RESULTADO TODO OK');await b.close()})();
