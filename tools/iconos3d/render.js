// Renderiza los iconos 3D de la barra inferior a PNG con fondo transparente.
// Uso (desde la raíz del repo, con un servidor estático en marcha):
//   python3 -m http.server 8731 &   node tools/iconos3d/render.js http://localhost:8731 img/ui
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [,,base='http://localhost:8731',out='img/ui']=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage();
 p.on('pageerror',e=>console.error('ERROR',e.message));
 await p.goto(base+'/tools/iconos3d/render.html');await p.waitForFunction(()=>window.LISTO);
 fs.mkdirSync(out,{recursive:true});
 for(const n of ['inicio','finca','camada','ofertas','mercado','tareas','palmares']){
  const url=await p.evaluate(n=>window.renderIcono(n),n);
  fs.writeFileSync(path.join(out,`tab-${n}.png`),Buffer.from(url.split(',')[1],'base64'));console.log('ok',n)}
 await b.close()})();
