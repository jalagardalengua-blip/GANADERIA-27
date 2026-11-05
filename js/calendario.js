/* ===================== CALENDARIO AL ESTILO FIFA · avanzar por días o semanas y simular hasta una fecha =====================
   El juego sigue cerrando cada mes como siempre (gastos, crecimiento, paridera, ofertas…), pero ahora el tiempo
   corre día a día: «Avanzar» pasa una semana y el calendario permite simular hasta el día que elijas.
   Los festejos tienen su día (las corridas, en domingo) y la simulación se para para que decidas si lo ves en directo. */
const DSEM=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],DSEML=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const CALS={busy:false,stop:false,view:null,sel:null};
const dimOf=(m,y)=>new Date(y,m+1,0).getDate();
function calDay(){if(!S)return 1;if(!S.day||S.day<1)S.day=1;const d=dimOf(S.month,S.year);if(S.day>d)S.day=d;return S.day}
function calFecha(d,m,y,largo){const wd=new Date(y,m,d).getDay();return largo?`${DSEML[wd]} ${d} de ${MESES[m].toLowerCase()} de ${y}`:`${DSEM[wd]} ${d} ${MESES[m].slice(0,3)}`}
/* día de cada festejo: corridas en domingo, festejos de corro en fin de semana o día de fiesta */
function evDia(o,abs,corro){if(o.dia)return o.dia;const y=Math.floor(abs/12),m=abs%12,dm=dimOf(m,y);let d=4+((o.id*37+(corro?11:0))%(dm-7));
 const want=corro?[6,0,5][o.id%3]:0;for(let k=0;k<7;k++){const dd=d+k;if(dd<=dm&&new Date(y,m,dd).getDay()===want){d=dd;break}}o.dia=Math.min(dm,Math.max(1,d));return o.dia}
function calEventos(abs){const out=[];if(!S)return out;
 for(const o of S.offers||[])if(o.abs===abs&&(o.st==='aceptada'||o.st==='lidiada'))out.push({d:evDia(o,abs),k:'corrida',o,t:`${o.plaza}`,s:o.feria||'Corrida',done:o.st==='lidiada'});
 const C=S.corro;if(C)for(const o of C.of||[])if(o.abs===abs&&(o.st==='aceptada'||o.st==='hecha')&&typeof FEST!=='undefined'&&FEST[o.tipo])out.push({d:evDia(o,abs,1),k:'corro',o,t:o.pueblo,s:FEST[o.tipo].n,done:o.st==='hecha'});
 const m=abs%12;for(const f of FERIAS)if(f.m===m)out.push({d:f.dia||(f.dia=8+(f.id.charCodeAt(0)+f.id.charCodeAt(1))%15),k:'feria',t:f.feria,s:f.plaza});
 return out.sort((a,b)=>a.d-b.d)}
function calPend(){const abs=absNow(),d=calDay();return calEventos(abs).filter(e=>(e.k==='corrida'||e.k==='corro')&&!e.done&&e.d===d)}
/* avanzar n días; se para en un día de festejo propio */
function calPaso(){const dm=dimOf(S.month,S.year);if(S.day>=dm){S.day=1;try{CALS.inMonth=true;advance()}finally{CALS.inMonth=false}if(!S)return 'fin'}else S.day++;
 save();return calPend().length?'evento':null}
function calAvanzar(n,silent){if(!S||CALS.busy)return;const d0=calDay(),m0=S.month,y0=S.year;let r=null;
 for(let i=0;i<n;i++){r=calPaso();if(r)break}
 if(!S)return;render();
 if(r==='evento')return calEventoHoy();
 if(!silent&&S.month===m0&&S.year===y0)toast(`${calFecha(d0,m0,y0)} → ${calFecha(S.day,S.month,S.year)}`)}
function calSemana(){calAvanzar(7)}
function calDia(){calAvanzar(1)}
/* simular hasta una fecha (día a día, con contador como en FIFA) */
function calSimular(tAbs,tDay){if(!S||CALS.busy)return;closeModal(true);CALS.busy=true;CALS.stop=false;document.body.classList.add('calBusy');
 const ov=document.createElement('div');ov.className='calSim';ov.innerHTML=`<div class="calSimIn"><small>SIMULANDO</small><b id="calSimF"></b><i><u id="calSimB"></u></i><button class="btn" id="calSimX">Detener</button></div>`;document.body.appendChild(ov);
 $('#calSimX').onclick=()=>{CALS.stop=true};
 const start=absNow()*31+calDay(),goal=tAbs*31+tDay;
 const step=()=>{if(!S){fin();return}const cur=absNow()*31+calDay();if(cur>=goal||CALS.stop){fin();return}
  let r=null;for(let k=0;k<2&&!r;k++){r=calPaso();if(absNow()*31+calDay()>=goal)break}
  const f=$('#calSimF');if(f&&S)f.textContent=calFecha(S.day,S.month,S.year)+' '+S.year;const bb=$('#calSimB');if(bb&&S)bb.style.width=Math.min(100,(absNow()*31+calDay()-start)/Math.max(1,goal-start)*100)+'%';
  if(r==='evento'||r==='fin'){fin(r);return}setTimeout(step,45)};
 const fin=r=>{CALS.busy=false;document.body.classList.remove('calBusy');ov.classList.add('out');setTimeout(()=>ov.remove(),300);if(!S)return;render();if(r==='evento')calEventoHoy();else toast(`Hoy es ${calFecha(S.day,S.month,S.year,true)}`)};
 step()}
/* día de festejo: verlo en directo o simularlo */
function calEventoHoy(){const ev=calPend();if(!ev.length)return;const e=ev[0],o=e.o;
 if(e.k==='corrida'){modal(`Hoy toreas en ${o.plaza}`,`<div class="stack calEv"><div class="calEvH"><span class="calEvD">${calFecha(S.day,S.month,S.year,true)}</span><b>${esc(o.feria||'Corrida de toros')}</b><small>${o.toros?o.toros.length:o.n} toros de tu hierro · ${eur(o.precio)}/cabeza</small></div>
  <button class="btn oro adv" onclick="calCorrida(${o.id},true)">Verla en directo${ICO.chev}</button><button class="btn" onclick="calCorrida(${o.id},false)">Simular el resultado</button></div>`);return}
 if(e.k==='corro'){modal(`Hoy sale tu corro`,`<div class="stack calEv"><div class="calEvH"><span class="calEvD">${calFecha(S.day,S.month,S.year,true)}</span><b>${esc(FEST[o.tipo].n)} en ${esc(o.pueblo)}</b><small>${esc(o.fiesta||'')} · ${eur(o.pago)}</small></div>
  <button class="btn oro adv" onclick="calCorro(${o.id},true)">Verlo en directo${ICO.chev}</button><button class="btn" onclick="calCorro(${o.id},false)">Simular el festejo</button></div>`)}}
function calCorrida(id,vivo){closeModal(true);const o=S.offers.find(x=>x.id===id);if(!o||o.st!=='aceptada')return;if(!o.toros||!o.toros.length){toast('No hay toros reseñados para esta corrida');return}
 const r=celebrar(o);save();render();if(vivo){if(show3D())enterPlaza(r.id)}else verCorrida(r.id)}
function calCorro(id,vivo){closeModal(true);const C=S.corro;const o=C&&C.of.find(x=>x.id===id);if(!o||o.st!=='aceptada')return;
 if(vivo){irCalle(o.id);return}const r=cResolver(o,null);save();render();if(r)toast(`${FEST[o.tipo].n} en ${o.pueblo}: ${LUCTXT(r.media)} · +${eur(r.ing)}`);else toast('No había reses disponibles para el festejo')}
/* ---------- el calendario ---------- */
function calAbrir(){if(!S)return;CALS.view=absNow();CALS.sel=null;calPintar()}
function calPintar(){const v=CALS.view,y=Math.floor(v/12),m=v%12,dm=dimOf(m,y),hoyA=absNow(),hoyD=calDay();const ev=calEventos(v);
 const first=(new Date(y,m,1).getDay()+6)%7;let cells='';for(let i=0;i<first;i++)cells+='<span class="cd vac"></span>';
 for(let d=1;d<=dm;d++){const past=v<hoyA||(v===hoyA&&d<hoyD),hoy=v===hoyA&&d===hoyD,sel=CALS.sel&&CALS.sel[0]===v&&CALS.sel[1]===d;const e=ev.filter(x=>x.d===d);
  cells+=`<button class="cd ${past?'past':''} ${hoy?'hoy':''} ${sel?'sel':''} ${new Date(y,m,d).getDay()===0?'dom':''}" ${past?'disabled':''} onclick="calSel(${v},${d})"><b>${d}</b>${e.map(x=>`<i class="ce ${x.k}${x.done?' done':''}"></i>`).join('')}</button>`}
 const sel=CALS.sel;const selTxt=sel?calFecha(sel[1],sel[0]%12,Math.floor(sel[0]/12),true):'';
 const prox=(()=>{for(let a=hoyA;a<hoyA+12;a++){const e=calEventos(a).find(x=>(x.k==='corrida'||x.k==='corro')&&!x.done&&(a>hoyA||x.d>hoyD));if(e)return [a,e]}return null})();
 const body=`<div class="stack calW">
  <div class="calHoy"><small>HOY</small><b>${calFecha(hoyD,S.month,S.year,true)}</b></div>
  <div class="calQuick"><button class="btn sm" onclick="closeModal(true);calDia()">+1 día</button><button class="btn sm" onclick="closeModal(true);calSemana()">+1 semana</button>
   ${prox?`<button class="btn sm oro" onclick="calSimular(${prox[0]},${prox[1].d})">Hasta el próximo festejo</button>`:''}<button class="btn sm" onclick="calSimular(${hoyA},${dimOf(S.month,S.year)})">Fin de mes</button></div>
  <div class="calNav"><button class="btn sm" ${v<=hoyA?'disabled':''} onclick="CALS.view--;calPintar()">‹</button><b>${MESES[m]} ${y}</b><button class="btn sm" ${v>=hoyA+11?'disabled':''} onclick="CALS.view++;calPintar()">›</button></div>
  <div class="calG"><span class="cw">L</span><span class="cw">M</span><span class="cw">X</span><span class="cw">J</span><span class="cw">V</span><span class="cw">S</span><span class="cw dom">D</span>${cells}</div>
  <div class="calLeg"><span><i class="ce corrida"></i>Tu corrida</span><span><i class="ce corro"></i>Festejo de corro</span><span><i class="ce feria"></i>Gran feria</span></div>
  ${ev.length?`<div class="list calL">${ev.map(e=>`<div class="task"><span class="calLd"><b>${e.d}</b><small>${DSEM[new Date(y,m,e.d).getDay()]}</small></span><span class="t"><b>${esc(e.t)}</b><br><small class="muted">${esc(e.s)}${e.done?' · celebrado':''}</small></span><i class="ce ${e.k}"></i></div>`).join('')}</div>`:'<small class="muted" style="text-align:center">Sin festejos este mes.</small>'}
  ${sel?`<button class="btn oro adv" onclick="calSimular(${sel[0]},${sel[1]})">Simular hasta el ${esc(selTxt)}${ICO.chev}</button>`:'<small class="muted" style="text-align:center">Toca un día para simular hasta esa fecha. La simulación se para en tus festejos.</small>'}</div>`;
 const ex=$('#ov');if(ex&&ex.querySelector('.calW')){ex.querySelector('.calW').outerHTML=body;return}modal('Calendario',body)}
function calSel(a,d){CALS.sel=[a,d];calPintar()}
/* el mes de siempre: al cerrarlo, el día vuelve a 1 */
const _advanceCal=advance;
advance=function(){const r=_advanceCal.apply(this,arguments);if(S&&!CALS.inMonth)S.day=1;return r};
/* barra de estado: fecha con día, avanzar una semana y botón de calendario */
const _renderCal=render;
render=function(){_renderCal.apply(this,arguments);if(!S)return;try{const sb=$('.sbar');if(!sb)return;const d=calDay();
 const l=sb.querySelector('.it.hm .l'),s=sb.querySelector('.it.hm .s');if(l)l.textContent=calFecha(d,S.month,S.year)+' '+S.year;if(s)s.textContent=`${d} ${MESES[S.month].slice(0,3)}`;
 const go=sb.querySelector('button.go');if(go&&!go.dataset.cal){go.dataset.cal=1;go.setAttribute('onclick','calSemana()');go.setAttribute('aria-label','Avanzar una semana');go.innerHTML=`<span class="goT">Avanzar</span><small class="goS">1 semana</small>${ICO.chev}`;
  const cb=document.createElement('button');cb.className='calBtn';cb.setAttribute('aria-label','Abrir el calendario');cb.innerHTML=ICO.cal;cb.onclick=calAbrir;const n=calPend().length;if(n)cb.insertAdjacentHTML('beforeend',`<i class="bdg">${n}</i>`);go.before(cb)}
 }catch(e){}};
/* finca 3D: el botón del HUD también avanza una semana */
const _init3DCal=typeof init3D==='function'?init3D:null;
function calHud(){const b=$('#h3adv');if(!b||b.dataset.cal)return;b.dataset.cal=1;b.textContent='Avanzar semana';b.onclick=()=>{calSemana();if(W3.mode==='finca'&&S)rebuildFinca()}}
const _show3DCal=show3D;show3D=function(){const r=_show3DCal.apply(this,arguments);try{calHud()}catch(e){}return r};
