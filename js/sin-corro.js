/* ===================== SIN GANADERÍA DE CORRO EN LA INTERFAZ =====================
   A petición del propietario, la ganadería de corro (bous al carrer) desaparece de todas las
   pantallas: el interruptor de la cabecera, la tarjeta de Inicio y el acceso del panel.
   El código del modo se conserva intacto por si se recupera más adelante. */
(function(){
 if(typeof UI==='object'&&UI)UI.casa='bravo';
 if(typeof setCasa==='function'){const o=setCasa;setCasa=function(k){if(k==='corro')return;return o.apply(this,arguments)}}
 const st=document.createElement('style');
 st.textContent=".casaSw,.corroP,.hubT[onclick*=\"setCasa('corro')\"]{display:none!important}";
 document.head.appendChild(st);
 const _r=render;render=function(){if(typeof UI==='object'&&UI&&UI.casa==='corro')UI.casa='bravo';return _r.apply(this,arguments)};
})();
