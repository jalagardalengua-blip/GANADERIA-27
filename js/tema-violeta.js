/* ===================== BARRA INFERIOR VIOLETA (estilo atardecer) =====================
   Sobre la barra de gala de navbar.js: en la ganadería principal cada pestaña muestra su celda
   ilustrada (img/ui/tab-*.jpg) dentro de un marco violeta biselado con línea de luz rosa y ámbar.
   La ganadería de corro conserva su barra propia. */
const NAV_VIO={inicio:1,finca:1,camada:1,ofertas:1,mercado:1,tareas:1,palmares:1};
function navVioleta(){const nav=document.querySelector('nav.tabs.gala');if(!nav)return;const corro=nav.classList.contains('galaC');nav.classList.toggle('vio',!corro);if(corro)return;
 nav.querySelectorAll('.wrap > button').forEach(b=>{const k=b.dataset.g;if(!NAV_VIO[k])return;const im=b.querySelector('.gIco');if(im&&!im.dataset.vio){im.dataset.vio=1;im.src='img/ui/tab-'+k+'.jpg';im.classList.add('gTile')}})}
{const _rv=render;render=function(){_rv.apply(this,arguments);try{navVioleta()}catch(e){}}}
