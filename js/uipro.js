/* ===================== INTERFAZ PROFESIONAL · estilo videojuego deportivo =====================
   - Cabecera cinematográfica en cada pantalla (imagen, título y datos clave en vivo).
   - Hub de Inicio con grandes accesos ilustrados (como el menú principal de un juego deportivo).
   - Transición de entrada al cambiar de pestaña y efecto de brillo en los accesos. */
const PG={
 camada:{img:'hero',k:'Tu hierro',t:'Ganadería',d:()=>{const c=campo();return [[c.filter(a=>a.sex==='M'&&!a.role&&ageY(a)>=4).length,'toros de lidia'],[c.filter(a=>a.role==='vaca').length,'vacas de vientre'],[c.filter(a=>a.role==='semental').length,'sementales']]}},
 ofertas:{img:'palco',k:'Empresas y ferias',t:'Ofertas',d:()=>[[S.offers.filter(o=>o.st==='nueva').length,'sin responder'],[S.offers.filter(o=>o.st==='aceptada').length,'aceptadas'],[S.stats.corridas||0,'corridas lidiadas']]},
 mercado:{img:'cuerno',k:'Compra y venta',t:'Mercado',d:()=>[[eur(S.money),'saldo'],[eur(patrimonio()),'patrimonio']]},
 tareas:{img:'dehesa',k:'Trabajo de campo',t:'Tareas',d:()=>{let p=0;try{p=listaTareas().length}catch(e){}return [[p,'pendientes'],[S.retos.filter(r=>r.done).length+'/'+S.retos.length,'retos del mes'],[Math.round(S.conf)+'%','confianza']]}},
 palmares:{img:'cabeza',k:'Carrera',t:'Perfil y palmarés',d:()=>{let pos='—';try{pos=miPos()+'º'}catch(e){}return [[pos,'escalafón'],[S.stats.orejas||0,'orejas'],[S.stats.indultos||0,'indultos']]}},
 c_con:{img:'calle',k:'Bous al carrer',t:'Contratos',d:()=>{const C=S.corro;return C?[[C.of.filter(o=>o.st==='nueva').length,'nuevos'],[C.of.filter(o=>o.st==='aceptada').length,'aceptados']]:[]}},
 c_res:{img:'calle',k:'Ganadería de corro',t:'Reses',d:()=>{const C=S.corro;return C?[[C.an.length,'reses'],[C.an.filter(a=>a.tipo==='vaca'||a.sex==='H').length,'vacas']]:[]}},
 c_mer:{img:'calle-nit',k:'Ganadería de corro',t:'Mercado',d:()=>[[eur(S.money),'saldo']]},
 c_inv:{img:'calle-nit',k:'Ganadería de corro',t:'Inversiones',d:()=>[[eur(S.money),'saldo']]}};
function pgHero(k){const P=PG[k];if(!P)return '';let d=[];try{d=P.d()}catch(e){}
 return `<header class="pgH"><i style="background-image:url(img/${P.img}.jpg)"></i><div class="pgT"><small>${P.k}</small><h1>${P.t}</h1></div>${d.length?`<div class="pgK">${d.map(([v,l])=>`<span><b>${v}</b><small>${l}</small></span>`).join('')}</div>`:''}</header>`}
function hubHTML(){const nv=S.offers.filter(o=>o.st==='nueva').length,c=campo();let tp=0;try{tp=listaTareas().length}catch(e){}
 const T=[['finca3d','enter3D()','dehesa','Finca en 3D','Baja a la dehesa',`${c.length} cabezas`],['camada',"go('camada')",'hero','Ganadería','Tu camada y su reata',`${c.filter(a=>a.sex==='M'&&!a.role&&ageY(a)>=4).length} toros listos`],
  ['ofertas',"go('ofertas')",'palco','Ofertas','Ferias y empresas',nv?`${nv} nuevas`:'al día'],['mercado',"go('mercado')",'cuerno','Mercado','Compra y vende',eur(S.money)],['tareas',"go('tareas')",'cabeza','Tareas','Faenas del mes',tp?`${tp} pendientes`:'todo hecho'],
  ['corro',"setCasa('corro')",'calle','Bous al carrer',S.corro?esc(S.corro.name):'Ganadería de corro',S.corro?`${S.corro.of.filter(o=>o.st==='nueva').length} contratos`:'empieza']];
 return `<section class="hub">${T.map(([k,fn,img,t,s,v],i)=>`<button class="hubT ${i===0?'big':''}" onclick="${fn}"><i style="background-image:url(img/${img}.jpg)"></i><span class="hubX"><small>${s}</small><b>${t}</b></span><em>${v}</em></button>`).join('')}</section>`}
const _renderPro=render;
render=function(){const prev=UI._tabPrev;_renderPro.apply(this,arguments);if(!S)return;try{const scr=$('#scr');if(!scr)return;const tab=UI.tab;
 if(tab==='inicio'&&UI.casa!=='corro'){const st=scr.querySelector('.stack')||scr;if(!st.querySelector('.hub')){const ref=st.querySelector('.season')||st.firstElementChild;const w=document.createElement('div');w.innerHTML=hubHTML();if(ref)ref.after(w.firstElementChild);else st.prepend(w.firstElementChild)}const duo=[...st.querySelectorAll('.duo')].pop();if(duo&&duo.querySelector('[onclick="enter3D()"]'))duo.style.display='none'}
 else if(PG[tab]&&!scr.querySelector('.pgH')){scr.insertAdjacentHTML('afterbegin',pgHero(tab))}
 if(prev!==tab){scr.classList.remove('pgIn');void scr.offsetWidth;scr.classList.add('pgIn')}UI._tabPrev=tab}catch(e){try{errLog('uipro: '+e.message,'uipro')}catch(e2){}}};
