// QA bou embolat en el móvil: pocas luces puntuales y ningún sombreado nuevo que compilar al encender las bolas (era un parón de segundos)
const {chromium}=require('playwright');const VER=process.env.VER||'';(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2000);
await p.evaluate(()=>{localStorage.clear();startReal(0);S.money=3e6;NEWC.name='Prueba';NEWC.l='PR';NEWC.lote=1;crearCorro();const C=S.corro;for(const a of C.an){a.salMes=0;a.lesion=0;a.salud=90}
 const o={id:8200,pueblo:'Vila-real',prov:'Castellón',tam:3,fiesta:'Festes',tipo:'embolado',abs:absNow(),pago:3000,st:'aceptada',night:true};C.of.push(o);irCalle(o.id)});
const fases={};
const hasta=ph=>p.evaluate(ph=>{for(let i=0;i<4000&&CL&&!(CL.emb&&CL.emb.ph===ph);i++)calleTick(1/30);return !!CL},ph);
const mide=async ph=>{await p.waitForTimeout(3500);fases[ph]=await p.evaluate(()=>{let pl=0;CL.sc.traverse(o=>{if(o.isPointLight&&o.visible)pl++});return {prog:W3.R.info.programs.length,pl,plMax:pl,progMax:W3.R.info.programs.length}})};
for(const ph of ['amarre','ferros','foc','solta','libre']){await hasta(ph);if(ph==='foc')await p.evaluate(()=>{for(let i=0;i<100;i++)calleTick(1/30)});await mide(ph)}
delete fases._n;console.log(JSON.stringify(fases));
const amarre=fases.amarre||fases.arrastre,libre=fases.libre;const nuevos=libre&&amarre?libre.progMax-amarre.progMax:-1;const maxL=Math.max(...Object.values(fases).map(f=>f.plMax||0));
console.log('sombreados nuevos al encender:',nuevos,'· luces puntuales máx.:',maxL);
console.log(errs.length?'ERRORES '+errs.slice(0,3):nuevos<=1&&maxL<=4?'LUCES OK':'LUCES MAL');await b.close()})();
