/* ===================== AGENDA DEL GANADERO =====================
   En Inicio, en lugar del cartel con el nombre (que ya está en la cabecera), sale lo que pide atención:
   - la caja: a este ritmo, cuándo te quedas sin dinero (la bancarrota llega a −90.000 €);
   - la finca llena: más cabezas que sitio, con acceso directo para vender;
   - ofertas que caducan este mes y tareas pendientes.
   Además, al avanzar el mes, si la quiebra está a menos de medio año, avisa en grande. */
function cajaPrevision(){try{const L=typeof libroDatos==='function'?libroDatos().slice(0,6):[];let neto;
  if(L.length>=3)neto=L.reduce((a,x)=>a+(x.inc||0)-(x.cost||0),0)/L.length;
  else{const c=campo();neto=-(Math.round(c.length*FEED[S.feed].c*feedMul())+2500+10*c.length+(typeof mantenimiento==='function'?mantenimiento():0))}
  const margen=S.money+90000;const meses=neto<0?Math.floor(margen/-neto):Infinity;return {neto:Math.round(neto),meses}}catch(e){return {neto:0,meses:Infinity}}}
function agItems(){const it=[];const P=cajaPrevision();
 if(P.meses<=12){const m=MESES[(S.month+Math.max(0,P.meses))%12].toLowerCase();it.push({n:P.meses<=4?'mal':'ojo',ic:ICO.monG,t:P.meses<=0?'Estás al borde de la bancarrota':`Al ritmo actual te quedas sin dinero en ${m}`,s:`Pierdes unos ${eur(-P.neto)} al mes. Vende ganado, acepta corridas o baja gastos.`,b:'Ver cuentas',a:"typeof libro==='function'?libro():go('mercado')"})}
 const cap=capacidad(),n=campo().length;if(n>cap)it.push({n:'mal',ic:ICO.toroG,t:`Finca saturada: ${n} cabezas para ${cap}`,s:'Las reses enferman. Vende vacas viejas o machos que no vayas a lidiar.',b:'Vender',a:"go('mercado')"});
 else if(n>cap*.92)it.push({n:'ojo',ic:ICO.toroG,t:`La finca está casi llena (${n}/${cap})`,s:'Con los partos de primavera se llenará. Amplía en Obras o vende.',b:'Obras',a:"obras()"});
 const nuevas=S.offers.filter(o=>o.st==='nueva');const urge=nuevas.filter(o=>o.abs-absNow()<=1);
 if(urge.length)it.push({n:'ojo',ic:ICO.plazaI||ICO.star,t:urge.length>1?`${urge.length} ofertas caducan este mes`:`La oferta de ${urge[0].plaza.split(' · ')[0]} caduca este mes`,s:'Si no respondes, la empresa busca otra ganadería.',b:'Responder',a:"go('ofertas')"});
 else if(nuevas.length)it.push({n:'ok',ic:ICO.plazaI||ICO.star,t:`${nuevas.length} ${nuevas.length>1?'ofertas':'oferta'} sin responder`,s:'Las empresas esperan tu respuesta.',b:'Ver',a:"go('ofertas')"});
 try{const tl=(typeof listaTareas==='function'?listaTareas():[]).filter(x=>!/oferta/i.test(x.t||''));if(tl.length)it.push({n:'ok',ic:ICO.cal,t:tl.length===1?esc(tl[0].t):`${tl.length} tareas pendientes`,s:tl.length===1?'':esc(tl[0].t),b:'Tareas',a:"go('tareas')"})}catch(e){}
 return it.slice(0,4)}
function agendaHTML(){const it=agItems();
 if(!it.length)return `<section class="agenda"><header><h2>Agenda</h2><small>${MESES[S.month]} ${S.year}</small></header><div class="agOk">${ICO.star}<span><b>Todo en orden</b><small>Buen momento para bajar a la finca o preparar los sementales.</small></span></div></section>`;
 return `<section class="agenda"><header><h2>Agenda</h2><small>${MESES[S.month]} ${S.year}</small></header>${it.map(x=>`<button class="agI ${x.n}" onclick="${x.a}"><span class="agIc">${x.ic||''}</span><span class="agT"><b>${x.t}</b>${x.s?`<small>${x.s}</small>`:''}</span><span class="agB">${x.b}${ICO.chev}</span></button>`).join('')}</section>`}
/* sustituye el cartel grande del nombre por la agenda */
{const _rAG=render;render=function(){const r=_rAG.apply(this,arguments);try{if(S&&UI.tab==='inicio'&&UI.casa!=='corro'){const h=document.querySelector('#scr .hero2');if(h&&!h.dataset.ag){const d=document.createElement('div');d.innerHTML=agendaHTML();h.replaceWith(d.firstElementChild)}}}catch(e){console.warn(e)}return r}}
/* aviso grande al avanzar si la quiebra está cerca */
{const _adAG=advance;advance=function(){const r=_adAG.apply(this,arguments);try{if(S&&!S.over){const P=cajaPrevision();if(P.meses<=6&&S.agAviso!==absNow()){S.agAviso=absNow();
 setTimeout(()=>{if(document.getElementById('ov'))return;toast(P.meses<=1?'⚠️ El banco te avisa: el mes que viene puedes perder la finca.':`⚠️ A este ritmo, en ${P.meses} meses el banco se queda la finca.`)},900)}}}catch(e){}return r}}
