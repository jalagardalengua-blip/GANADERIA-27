/* ===================== BARRA INFERIOR DE GALA · marco de oro, capote y emblema del toro =====================
   Ganadería principal: siete pestañas con el toro y la bandera en el centro.
   Ganadería de corro: cinco pestañas bajo la tira rojigualda, con cortinas de capote.
   Iconos dibujados a partir de las referencias de diseño (img/nav/*.png). */
const NAV_IMG={inicio:1,finca:1,camada:1,ofertas:1,mercado:1,tareas:1,palmares:1,c_ini:1,c_con:1,c_res:1,c_mer:1,c_inv:1};
function navGala(){const nav=document.querySelector('nav.tabs');if(!nav)return;const wrap=nav.querySelector('.wrap');if(!wrap)return;
 const corro=document.body.classList.contains('casaC');nav.classList.add('gala');nav.classList.toggle('galaC',corro);
 wrap.querySelectorAll(':scope > button').forEach(b=>{if(b.dataset.g)return;const oc=b.getAttribute('onclick')||'';const m=oc.match(/go\('([^']+)'\)|UI\.tab='([^']+)'/);const k=m&&(m[1]||m[2]);b.dataset.g=k||'x';
  if(k&&NAV_IMG[k]){const sv=b.querySelector('svg');const im=document.createElement('img');im.className='gIco';im.alt='';im.src='img/nav/'+k+'.png';im.decoding='async';im.onerror=()=>{im.remove();if(sv)sv.style.display=''};if(sv){sv.style.display='none';sv.after(im)}else b.prepend(im)}});
 if(!corro&&!wrap.querySelector('.gEmb')){const btns=wrap.querySelectorAll(':scope > button');if(btns.length>=4){const e=document.createElement('div');e.className='gEmb';e.setAttribute('aria-hidden','true');e.innerHTML='<img src="img/nav-toro.png" alt="">';btns[3].before(e)}}
 if(!nav.querySelector('.gDrL')){nav.insertAdjacentHTML('beforeend','<i class="gDrL" aria-hidden="true"></i><i class="gDrR" aria-hidden="true"></i>')}}

envolver('render','navbar',_renderNav=>function(){_renderNav.apply(this,arguments);try{navGala()}catch(e){}},{segura:true});
