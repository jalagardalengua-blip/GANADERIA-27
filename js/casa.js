/* ===================== DOS CASAS: campo bravo y bous al carrer, separadas con su propio menú ===================== */
UI.casa=UI.casa||'bravo';
{const i=TABS.findIndex(t=>t[0]==='corro');if(i>=0)TABS.splice(i,1)}
const TABS_C=[['c_ini','Corro','vaca'],['c_con','Contratos','mon'],['c_res','Reses','toro'],['c_mer','Mercado','bolsa'],['c_inv','Inversiones','martillo']];
function casaBar(){const c=UI.casa==='corro';const C=S.corro;const nb=C?C.of.filter(o=>o.st==='nueva'||(o.st==='aceptada'&&o.abs===absNow())).length:0;
 return `<div class="casaSw ${c?'c':''}"><div class="wrap"><button class="cs ${c?'':'on'}" onclick="setCasa('bravo')">${ICO.toroG}<span><b>Campo bravo</b><small>${esc(S.g.name)}</small></span></button>
 <button class="cs ${c?'on':''}" onclick="setCasa('corro')">${ICO.vaca}<span><b>Bous al carrer</b><small>${C?esc(C.name):'Sin ganadería de corro'}</small></span>${nb&&!c?`<i class="bdg">${nb}</i>`:''}</button><span class="knob"></span></div></div>`}
function setCasa(k){if(UI.casa===k)return;UI.casa=k;const d=document.createElement('div');d.className='capWipe'+(k==='corro'?' cC':'');d.innerHTML=`<i></i><b>${k==='corro'?'Bous al carrer':'Campo bravo'}<small>${k==='corro'?(S.corro?esc(S.corro.name):'Ganadería de corro'):esc(S.g.name)}</small></b>`;document.body.appendChild(d);setTimeout(()=>d.remove(),1250);try{uiSnd('cap')}catch(e){}
 setTimeout(()=>{UI.tab=k==='corro'?'c_ini':'inicio';render();window.scrollTo(0,0)},420)}
const _goC=go;go=function(t){if(t==='corro'){setCasa('corro');return}return _goC(t)};
const _renderCasa=render;
render=function(){if(!S){_renderCasa();return}
 const corro=UI.casa==='corro';
 if(!corro){if(String(UI.tab).startsWith('c_')||UI.tab==='corro')UI.tab='inicio';_renderCasa();document.body.classList.remove('casaC')}
 else{const t=String(UI.tab).startsWith('c_')?UI.tab:'c_ini';UI.tab='inicio';_renderCasa();UI.tab=t;document.body.classList.add('casaC');
  const C=S.corro;const h=$('.hdr');if(h&&C){const gn=h.querySelector('.gname'),gs=h.querySelector('.gsub');if(gn)gn.textContent=C.name;if(gs)gs.innerHTML=`${estrellas(C.pres)}<span>Ganadería de corro · ${esc(C.pueblo)}</span>`;const em=h.querySelector('.wrap > :first-child');if(em&&em.outerHTML)em.outerHTML=emblem({hierro:{l:C.l}},54);const bg=h.querySelector('.bgimg');if(bg)bg.style.backgroundImage='url(img/calle.jpg)'}
  const nav=$('nav.tabs .wrap');if(nav){const nn=C?C.of.filter(o=>o.st==='nueva').length:0,hoy=C?C.of.filter(o=>o.st==='aceptada'&&o.abs===absNow()).length:0;
   nav.innerHTML=TABS_C.map(([k,l,i])=>{const b=k==='c_con'?nn:k==='c_ini'?hoy:0;return `<button aria-current="${UI.tab===k}" onclick="UI.tab='${k}';render();window.scrollTo(0,0)">${ICO[i]||ICO.casa}<span>${l}</span>${b?`<span class="bdg">${b}</span>`:''}</button>`}).join('')}
  const scr=$('#scr');if(scr){CU.part=C?UI.tab.slice(2):'all';renderCorro(scr);CU.part=null}}
 const hd=$('.hdr');if(hd&&!document.querySelector('.casaSw'))hd.insertAdjacentHTML('afterend',casaBar())};
