/* ===================== FASE 2 · PANEL DE MANDO, EVENTOS Y ACCESIBILIDAD =====================
   - Bus de eventos sencillo (Bus.on / Bus.emit) para que los módulos se enteren de lo que pasa sin tocarse entre sí.
   - Inicio con agenda de próximos festejos, centro de avisos y resumen económico de los últimos meses.
   - Ajustes de accesibilidad: tamaño de texto y reducir movimiento/efectos. */
const Bus={h:{},on(ev,f){(this.h[ev]=this.h[ev]||[]).push(f)},emit(ev,d){for(const f of this.h[ev]||[])try{f(d)}catch(e){try{errLog('Bus '+ev+': '+e.message,'bus')}catch(e2){}}}};
{const _s=save;save=function(){const r=_s.apply(this,arguments);if(r!==false)Bus.emit('SAVE_COMPLETED');return r}}
{const _a=advance;advance=function(){const m0=S&&S.money;const r=_a.apply(this,arguments);if(S)Bus.emit('MONTH_CLOSED',{dinero:S.money-m0});return r}}
{const _c=celebrar;celebrar=function(o){const r=_c.apply(this,arguments);Bus.emit('EVENT_COMPLETED',{tipo:'corrida',id:o.id,res:r});return r}}
if(typeof cResolver==='function'){const _r=cResolver;cResolver=function(o){const r=_r.apply(this,arguments);if(r)Bus.emit('EVENT_COMPLETED',{tipo:'corro',id:o.id,res:r});return r}}
/* ---------- avisos ---------- */
function avisos(){if(!S)return [];const A=[],c=campo(),ab=absNow();const add=(nivel,txt,acc,ico)=>A.push({nivel,txt,acc,ico});
 if(S.porVer&&S.porVer.length)add('oro',`${S.porVer.length} ${S.porVer.length>1?'corridas listas':'corrida lista'} para ver`,`enterPlaza(${S.porVer[0]})`,'plazaI');
 try{const p=calPend();if(p.length)add('rojo',`Hoy: ${p[0].t} (${p[0].s})`,'calEventoHoy()','cal')}catch(e){}
 const nuevas=S.offers.filter(o=>o.st==='nueva');const urg=nuevas.filter(o=>o.abs-ab<=1);
 if(urg.length)add('rojo',`${urg.length} ${urg.length>1?'ofertas caducan':'oferta caduca'} este mes sin responder`,"go('ofertas')",'mon');else if(nuevas.length)add('',`${nuevas.length} ofertas sin responder`,"go('ofertas')",'mon');
 const sinRes=S.offers.filter(o=>o.st==='aceptada'&&(!o.toros||o.toros.length<(o.n||1)));if(sinRes.length)add('rojo',`${sinRes.length} ${sinRes.length>1?'corridas aceptadas':'corrida aceptada'} sin todos los toros reseñados`,"go('ofertas')",'toro');
 const les=c.filter(a=>a.lesion>0||a.salud<45);if(les.length)add('',`${les.length} ${les.length>1?'reses lesionadas o con poca salud':'res lesionada o con poca salud'}`,"go('tareas')",'tareas');
 try{const cap=capacidad(),n=c.length;if(n>cap)add('rojo',`Finca saturada: ${n} cabezas para ${cap} de capacidad`,'obras()','finca');else if(n>cap*.92)add('',`Finca casi llena: ${n}/${cap} cabezas`,'obras()','finca')}catch(e){}
 try{const gasto=2500+10*c.length+mantenimiento();if(S.money<gasto*2)add('rojo',`Liquidez baja: ${eur(S.money)} (gasto mensual ≈ ${eur(gasto)})`,"go('mercado')",'monG')}catch(e){}
 if(!c.some(a=>a.role==='semental'))add('rojo','No tienes semental: la paridera dependerá de uno prestado',"go('mercado')",'toroG');
 if(S.month>=9&&c.some(a=>!a.herrado))add('',`${c.filter(a=>!a.herrado).length} becerros sin herrar antes de fin de año`,"go('tareas')",'martillo');
 if(S.conf<35)add('rojo',`La propiedad pierde la confianza (${Math.round(S.conf)} %)`,"go('palmares')",'perfil');
 const C=S.corro;if(C){const cn=C.of.filter(o=>o.st==='nueva').length;if(cn)add('',`Corro: ${cn} contratos de pueblos sin responder`,"setCasa('corro');UI.tab='c_con';render()",'vaca')}
 return A}
/* ---------- agenda ---------- */
function agenda(n){const out=[],ab=absNow(),d=calDay();for(let a=ab;a<ab+4&&out.length<n;a++){for(const e of calEventos(a)){if(a===ab&&e.d<d)continue;if(e.done)continue;out.push({...e,abs:a});if(out.length>=n)break}}return out}
/* ---------- economía ---------- */
function ecoMeses(n){return (S.news||[]).slice(0,n).reverse().map(x=>({d:x.d,inc:x.inc||0,cost:x.cost||0}))}
function panelHTML(){const A=avisos(),G=agenda(4),E=ecoMeses(6);const ab=absNow();
 const icon=k=>ICO[k]?ICO[k].replace('<svg','<svg class="pnI"'):'';
 const ag=G.length?G.map(e=>{const y=Math.floor(e.abs/12),m=e.abs%12,dd=new Date(y,m,e.d),hoy=e.abs===ab&&e.d===calDay();
  return `<button class="agE ${e.k}" onclick="${e.k==='feria'?'calAbrir()':hoy?'calEventoHoy()':'calAbrir()'}"><span class="agD"><b>${e.d}</b><small>${MESES[m].slice(0,3)}</small></span><span class="agT"><b>${esc(e.t)}</b><small>${esc(e.s)}${hoy?' · hoy':` · ${DSEML[dd.getDay()]}`}</small></span><i class="ce ${e.k}"></i></button>`}).join(''):'<small class="muted">Sin festejos a la vista. Acepta ofertas o contratos de pueblos.</small>';
 const mx=Math.max(1,...E.map(x=>Math.max(x.inc,x.cost)));
 const eco=E.length?`<div class="ecoG">${E.map(x=>`<div class="ecoC" title="${esc(x.d)}"><div class="ecoB"><i class="in" style="height:${Math.round(x.inc/mx*100)}%"></i><i class="out" style="height:${Math.round(x.cost/mx*100)}%"></i></div><small>${esc(x.d.slice(0,3))}</small></div>`).join('')}</div>
  <div class="ecoK"><span><i class="in"></i>Ingresos ${eur(E.reduce((s,x)=>s+x.inc,0))}</span><span><i class="out"></i>Gastos ${eur(E.reduce((s,x)=>s+x.cost,0))}</span><b class="${E.reduce((s,x)=>s+x.inc-x.cost,0)>=0?'pos':'neg'}">${eur(E.reduce((s,x)=>s+x.inc-x.cost,0))}</b></div>`:'<small class="muted">Las cuentas aparecerán al cerrar el primer mes.</small>';
 return `<section class="sect pnSect"><header><h2>Avisos</h2></header>${A.length?`<div class="pnAv">${A.slice(0,6).map(a=>`<button class="pnA ${a.nivel}" onclick="${a.acc}">${icon(a.ico)}<span>${esc(a.txt)}</span>${ICO.chev}</button>`).join('')}</div>`:'<div class="pnOk">Todo en orden en la ganadería.</div>'}</section>
 <section class="sect"><header><h2>Agenda</h2></header><div class="agL">${ag}</div><button class="btn sm" onclick="calAbrir()">Abrir el calendario</button></section>
 <section class="sect"><header><h2>Cuentas</h2><span class="sp"></span><small class="muted">últimos meses</small></header><div class="card eco">${eco}</div></section>`}
const _renderInicioP=renderInicio;
renderInicio=function(el){_renderInicioP.apply(this,arguments);try{if(!S)return;const st=el.querySelector('.stack')||el;const ref=st.querySelector('.wid');const w=document.createElement('div');w.className='pnWrap';w.innerHTML=panelHTML();if(ref)ref.after(w);else st.prepend(w)}catch(e){errLog('panel: '+e.message,'panel')}};
/* ---------- accesibilidad ---------- */
const ACC=(()=>{try{return JSON.parse(localStorage.getItem('hd-acc')||'{}')}catch(e){return {}}})();
function accApply(){document.documentElement.classList.toggle('txtL',ACC.txt==='l');document.documentElement.classList.toggle('txtXL',ACC.txt==='xl');document.documentElement.classList.toggle('calma',!!ACC.calma)}
function accSet(k,v){ACC[k]=v;try{localStorage.setItem('hd-acc',JSON.stringify(ACC))}catch(e){}accApply();render()}
accApply();
if(typeof shake==='function'){const _sh=shake;shake=function(){if(ACC.calma)return;return _sh.apply(this,arguments)}}
if(typeof confetti==='function'){const _cf=confetti;confetti=function(){if(ACC.calma)return;return _cf.apply(this,arguments)}}
if(typeof flash==='function'){const _fl=flash;flash=function(){if(ACC.calma)return;return _fl.apply(this,arguments)}}
const _startScreenAcc=startScreen;
startScreen=function(){let h=_startScreenAcc.apply(this,arguments);if(MENU.v!=='ajustes')return h;
 const sec=`<section class="sect card goldline"><header><h2>Accesibilidad</h2></header><div class="seg">${[['','Normal','Tamaño de texto estándar'],['l','Grande','Texto un 12 % mayor'],['xl','Muy grande','Texto un 25 % mayor']].map(([k,n,d])=>`<button aria-pressed="${(ACC.txt||'')===k}" onclick="accSet('txt','${k}')"><b>${n}</b><span>${d}</span></button>`).join('')}</div>
  <div class="seg"><button aria-pressed="${!ACC.calma}" onclick="accSet('calma',false)"><b>Efectos completos</b><span>Transiciones, confeti y sacudidas</span></button><button aria-pressed="${!!ACC.calma}" onclick="accSet('calma',true)"><b>Reducir movimiento</b><span>Sin destellos, sacudidas ni animaciones</span></button></div></section>`;
 const i=h.indexOf('<section class="sect card goldline svSect">');return i>0?h.slice(0,i)+sec+h.slice(i):h};
