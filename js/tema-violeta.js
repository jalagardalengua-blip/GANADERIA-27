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
if(typeof menuLogo==='function'){menuLogo=function(sm){const em=sm&&typeof banderillasSVG==='function'?banderillasSVG(['#ff4fa0','#ffb35a'],48):'';
 return `<div class="mLogo vioLogo ${sm?'sm':''}">${em}<h1><span>Hierro</span><em>y</em><span>Divisa</span></h1><div class="mTag">Modo carrera · Ganadero de bravo</div></div>`}}
