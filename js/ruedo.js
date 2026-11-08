/* ===================== CORRIDA EN DIRECTO · PLAZA REALISTA =====================
   Al ver en directo una corrida de tu hierro se abre la plaza realista (ruedo.html): albero, tendidos con público,
   torero con traje de luces, capote y muleta con tela simulada y el toro de lidia de la ganadería.
   El resultado de cada toro (orejas, vuelta, indulto, silencio, pitos, devolución) es el que calcula el juego
   según su bravura, nobleza, casta, fuerza, encaste y el matador; la faena se compone con esos mismos datos.
   "Vista clásica" vuelve a la plaza 3D de siempre. */
const RD={on:false,r:null,i:0,el:null,fr:null};
function ruedoDatos(r,i){const t=r.toros[i];if(!t)return null;
 return {id:r.id*10+i,seed:r.id*97+i*13+7,i:i+1,ultimo:i>=r.toros.length-1,plaza:r.plaza,feria:r.feria,gan:S.g.name,div:t.div||S.g.div,
  name:t.name,num:t.num,peso:t.peso,pelo:t.pelo,enc:t.enc,mat:t.mat,traje:t.traje,estilo:t.estilo,B:t.B,N:t.N,C:t.C,F:t.F,score:t.score,
  res:t.res,trof:t.trof||0,ent:t.ent,esto:t.esto,desc:t.desc,avisos:t.avisos,rajado:!!t.rajado,fell:!!t.fell,pases:t.pases,
  cogida:t.cogida?{parte:t.cogida.parte}:null,sust:t.sust?{n:t.sust.n}:null}}
function ruedoEnviar(){if(!RD.fr||!RD.r)return;const d=ruedoDatos(RD.r,RD.i);if(d)RD.fr.contentWindow.postMessage({ruedo:'lidia',valor:d},'*')}
function ruedoCerrar(resumen){const id=RD.r&&RD.r.id;RD.on=false;if(RD.el)RD.el.remove();RD.el=RD.fr=null;document.body.style.overflow='';try{render()}catch(e){}if(resumen&&id!=null)try{verCorrida(id)}catch(e){}}
function ruedoAbrir(id){const r=S.hist.find(h=>h.id===id);if(!r||!r.toros||!r.toros.length)return false;
 S.porVer=(S.porVer||[]).filter(x=>x!==id);r.visto=true;save();
 if(typeof W3!=='undefined'&&W3.on){try{exit3D()}catch(e){}}
 RD.on=true;RD.r=r;RD.i=0;const el=document.createElement('div');el.id='ruedoOv';
 el.innerHTML='<iframe src="ruedo.html" title="Corrida en directo" allow="fullscreen; autoplay"></iframe>';document.body.appendChild(el);document.body.style.overflow='hidden';
 RD.el=el;RD.fr=el.querySelector('iframe');try{el.requestFullscreen&&(!navigator.userActivation||navigator.userActivation.isActive)&&matchMedia('(pointer:coarse)').matches&&el.requestFullscreen().catch(()=>{})}catch(e){}
 try{navigator.wakeLock&&navigator.wakeLock.request('screen').catch(()=>{})}catch(e){}return true}
addEventListener('message',e=>{const d=e.data;if(!RD.on||!d||typeof d.ruedo!=='string'||!RD.fr||e.source!==RD.fr.contentWindow)return;
 if(d.ruedo==='listo')ruedoEnviar();
 else if(d.ruedo==='siguiente'){RD.i++;if(RD.i>=RD.r.toros.length)ruedoCerrar(true);else ruedoEnviar()}
 else if(d.ruedo==='salir')ruedoCerrar(true);
 else if(d.ruedo==='clasica'){const id=RD.r.id;ruedoCerrar(false);RD.forzarClasica=true;try{_enterPlazaRD(id)}finally{RD.forzarClasica=false}}});
function ruedoPuede(){try{if(localStorage.getItem('hd-ruedo')==='clasica')return false}catch(e){}try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}}
const _enterPlazaRD=enterPlaza;
envolver('enterPlaza','ruedo',orig=>function(id){if(!RD.forzarClasica&&ruedoPuede()){try{if(ruedoAbrir(id))return}catch(e){try{errLog('ruedo: '+e.message,'ruedo')}catch(e2){}}}return orig.apply(this,arguments)});
