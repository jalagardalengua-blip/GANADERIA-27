/* ===================== INTERFAZ · PULIDO DE MENÚS =====================
   - La barra de estado (fecha, dinero, prestigio, «Avanzar») se queda fija arriba al bajar.
   - Las listas muy largas (obras, personal, diario…) se pliegan: se ven las primeras y un botón «Ver todas».
   - Aparición suave al cambiar de pestaña. */
const IF={abre:{},y:0};
const IF_PESTANAS={inicio:1,finca:1,tareas:1,palmares:1};
function ifPlegar(){const scr=document.getElementById('scr');if(!scr||!IF_PESTANAS[UI.tab])return;
 scr.querySelectorAll('section.sect').forEach(s=>{if(s.dataset.ifp)return;s.dataset.ifp=1;const h=s.querySelector('h2');const clave=UI.tab+':'+(h?h.textContent.trim():'');
  // el contenedor con más elementos seguidos de la misma clase es la lista
  let mejor=null,n=0;s.querySelectorAll('*').forEach(c=>{const k=c.children.length;if(k>n&&k>6){const cl=c.children[0].className;let igual=0;for(const x of c.children)if(x.className.split(' ')[0]===cl.split(' ')[0])igual++;if(igual>=k*.8){mejor=c;n=k}}});
  if(!mejor)return;const ver=4;const hijos=[...mejor.children];const ocultos=hijos.slice(ver);
  const b=document.createElement('button');b.type='button';b.className='ifMas';const pon=()=>{const ab=!!IF.abre[clave];ocultos.forEach(x=>x.classList.toggle('ifOc',!ab));b.classList.toggle('ab',ab);
   b.innerHTML=(ab?'Ver menos':`Ver ${ocultos.length} más`)+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>'};
  b.onclick=()=>{IF.abre[clave]=!IF.abre[clave];pon();if(!IF.abre[clave])b.scrollIntoView({block:'nearest',behavior:'smooth'})};pon();mejor.after(b)})}
/* nombre de la ganadería en la barra fija cuando la cabecera ya no se ve (pantallas anchas) */
function ifNombre(){const w=document.querySelector('.sbar .wrap');if(!w||w.querySelector('.ifNom')||!S||!S.g)return;const d=document.createElement('div');d.className='ifNom';
 d.innerHTML=(typeof emblem==='function'?emblem(S.g,26):'')+`<span>${esc(S.g.name)}</span>`;w.prepend(d)}
function ifScroll(){const on=scrollY>90;if(on!==document.body.classList.contains('ifScroll'))document.body.classList.toggle('ifScroll',on)}
addEventListener('scroll',ifScroll,{passive:true});
{const _rIF=render;render=function(){const tab=typeof UI!=='undefined'?UI.tab:null,cambio=tab!==IF.tab;IF.tab=tab;const r=_rIF.apply(this,arguments);
 try{ifPlegar();ifNombre();ifScroll();const scr=document.getElementById('scr');if(scr&&cambio){scr.classList.remove('ifIn');void scr.offsetWidth;scr.classList.add('ifIn')}}catch(e){}return r}}
