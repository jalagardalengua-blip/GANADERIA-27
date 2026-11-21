/* ===================== BARRA INFERIOR VIOLETA (estilo atardecer) =====================
   Sobre la barra de gala de navbar.js: en la ganadería principal cada pestaña muestra su celda
   ilustrada (img/ui/tab-*.jpg) dentro de un marco violeta biselado con línea de luz rosa y ámbar.
   La ganadería de corro conserva su barra propia. */
const NAV_VIO={inicio:1,finca:1,camada:1,ofertas:1,mercado:1,tareas:1,palmares:1};
function navVioleta(){const nav=document.querySelector('nav.tabs.gala');if(!nav)return;const corro=nav.classList.contains('galaC');nav.classList.toggle('vio',!corro);if(corro)return;
 nav.querySelectorAll('.wrap > button').forEach(b=>{const k=b.dataset.g;if(!NAV_VIO[k])return;const im=b.querySelector('.gIco');if(im&&!im.dataset.vio){im.dataset.vio=1;im.src='img/ui/tab-'+k+'.jpg';im.classList.add('gTile')}})}
{const _rv=render;render=function(){_rv.apply(this,arguments);try{navVioleta()}catch(e){}}}

/* ---------- Portada: tus retratos de fondo y logotipo de cartel ---------- */
if(typeof MENU_BG!=='undefined'&&Array.isArray(MENU_BG))MENU_BG.splice(0,MENU_BG.length,'carga-1','carga-2','carga-1','carga-2','carga-1','carga-2');
/* Logotipo taurino: hierro de marcar al rojo, «Hierro» forjado, «y» en cursiva clásica, «Divisa» en pan de oro y cintas */
function hierroMarca(sz){return `<svg class="lgMarca" width="${sz}" height="${sz}" viewBox="0 0 100 100" aria-hidden="true"><defs>
 <radialGradient id="lgAscua" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#ffc24a"/><stop offset=".7" stop-color="#ff5a1a"/><stop offset="1" stop-color="#9a1606"/></radialGradient>
 <linearGradient id="lgAcero" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2522"/><stop offset=".5" stop-color="#8d857c"/><stop offset="1" stop-color="#2a2522"/></linearGradient>
 <filter id="lgBrillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
 <rect x="47.5" y="0" width="5" height="22" rx="2" fill="url(#lgAcero)"/><rect x="44" y="18" width="12" height="6" rx="2" fill="#3a332e"/>
 <g filter="url(#lgBrillo)"><circle cx="50" cy="58" r="30" fill="none" stroke="url(#lgAscua)" stroke-width="5.5"/>
 <text x="50" y="71" text-anchor="middle" font-family="'Cinzel Decorative',Cinzel,serif" font-weight="900" font-size="34" fill="url(#lgAscua)">HD</text></g></svg>`}
function cintasDivisa(){return `<svg class="lgCintas" viewBox="0 0 220 28" aria-hidden="true"><path d="M110 4 C70 4 30 10 2 24 l14-2 -4 6 C40 16 80 10 110 10z" fill="#5b2a6e" stroke="#1a0b14" stroke-width=".8"/><path d="M110 4 C150 4 190 10 218 24 l-14-2 4 6 C180 16 140 10 110 10z" fill="#e8b84a" stroke="#1a0b14" stroke-width=".8"/><circle cx="110" cy="7" r="4.5" fill="#c41f2f" stroke="#1a0b14" stroke-width=".8"/></svg>`}
if(typeof menuLogo==='function'){menuLogo=function(sm){return `<div class="mLogo lgTaurino ${sm?'sm':''}">${hierroMarca(sm?54:86)}<h1><span class="lgH">Hierro</span><em class="lgY">y</em><span class="lgD">Divisa</span></h1>${cintasDivisa()}<div class="mTag">Modo carrera · Ganadero de bravo</div></div>`}}
