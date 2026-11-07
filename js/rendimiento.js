/* ===================== FASE 10 · RENDIMIENTO ADAPTATIVO =====================
   - Primer arranque: perfil gráfico según el dispositivo (memoria, núcleos, pantalla táctil).
   - Resolución dinámica: si el 3D baja de ~26 FPS se reduce la resolución interna; si va sobrado, se recupera.
   - Indicador opcional de FPS (Ajustes → Gráficos). */
(function(){try{if(!localStorage.getItem('hd-qual')){const mem=navigator.deviceMemory||4,cpu=navigator.hardwareConcurrency||4,tactil=matchMedia('(pointer:coarse)').matches;
 const q=mem<=2||cpu<=2?'baja':tactil&&(mem<=4||cpu<=4)?'media':tactil?'media':'alta';localStorage.setItem('hd-qual',q);localStorage.setItem('hd-qual-auto','1')}}catch(e){}})();
const PERF={t:0,n:0,fps:60,pr:null,base:null,on:(()=>{try{return localStorage.getItem('hd-fps')==='1'}catch(e){return false}})()};
function perfTick(dt){if(!W3.on||!W3.R)return;const now=performance.now();if(!PERF.t0||now-PERF.t0>4000){PERF.t0=now;PERF.n=0;return}PERF.n++;const el=(now-PERF.t0)/1000;if(el<2)return;const f=PERF.n/el;PERF.fps=Math.round(f);PERF.t0=now;PERF.n=0;
 const R=W3.R;if(PERF.base==null){PERF.base=R.getPixelRatio();PERF.pr=PERF.base}
 if(f<26&&PERF.pr>.6){PERF.pr=Math.max(.6,PERF.pr-.15);R.setPixelRatio(PERF.pr)}else if(f>52&&PERF.pr<PERF.base){PERF.pr=Math.min(PERF.base,PERF.pr+.1);R.setPixelRatio(PERF.pr)}
 if(PERF.on){let e=$('#fpsT');if(!e){e=document.createElement('div');e.id='fpsT';e.className='fpsT';(W3.root||document.body).appendChild(e)}e.textContent=`${PERF.fps} FPS · ${PERF.pr.toFixed(2)}x`}}
for(const n of ['fincaTick','plazaTick','calleTick','tientaTick','toreroTick']){if(typeof window[n]!=='function')continue;const f=window[n];window[n]=function(dt){const r=f.apply(this,arguments);try{perfTick(dt)}catch(e){}return r}}
{const _sq=setQual;setQual=function(k){PERF.base=null;try{localStorage.removeItem('hd-qual-auto')}catch(e){}return _sq.apply(this,arguments)}}
function fpsToggle(){PERF.on=!PERF.on;try{localStorage.setItem('hd-fps',PERF.on?'1':'0')}catch(e){}const e=$('#fpsT');if(e&&!PERF.on)e.remove();render()}
{const _ss=startScreen;startScreen=function(){let h=_ss.apply(this,arguments);if(MENU.v==='ajustes'){let auto=false;try{auto=localStorage.getItem('hd-qual-auto')==='1'}catch(e){}
 h=h.replace(/(<h2>Gráficos 3D<\/h2><\/header>)/,`$1${auto?'<small class="muted">Elegida automáticamente para tu dispositivo.</small>':''}`).replace(/(<section class="sect card goldline"><header><h2>Sonido)/,`<section class="sect card goldline"><header><h2>Rendimiento</h2></header><small class="muted">La resolución se ajusta sola si el 3D va lento.</small><div class="seg"><button aria-pressed="${PERF.on}" onclick="fpsToggle()"><b>${PERF.on?'Ocultar':'Mostrar'} FPS</b><span>Contador de imágenes por segundo en 3D</span></button></div></section>$1`)}return h}}
/* ===================== FASE 12 · COMPARTIR RESULTADO (sin servidor) ===================== */
function compartirTexto(t){if(navigator.share){navigator.share({title:'Hierro y Divisa',text:t}).catch(()=>{})}else if(navigator.clipboard){navigator.clipboard.writeText(t).then(()=>toast('Resumen copiado: pégalo donde quieras')).catch(()=>toast('No se pudo copiar'))}else toast(t)}
function compartirCorrida(id){const r=S.hist.find(h=>h.id===id);if(!r)return;const t=`🐂 ${S.g.name} en ${r.plaza} (${r.feria||''}): ${r.resumen||''}\n${(r.toros||[]).map(x=>`· ${x.name}: ${x.res}${x.trof?' '+x.trof+' or.':''} (nota ${x.nota??'—'})`).join('\n')}\n— Hierro y Divisa`;compartirTexto(t)}
{const _vc=verCorrida;verCorrida=function(id){const r=_vc.apply(this,arguments);try{const sh=$('#ov .sheet')||$('#ov');if(sh&&!sh.querySelector('.shareB')){const b=document.createElement('button');b.className='btn shareB';b.textContent='Compartir resultado';b.onclick=()=>compartirCorrida(id);(sh.querySelector('.stack')||sh).appendChild(b)}}catch(e){}return r}}
