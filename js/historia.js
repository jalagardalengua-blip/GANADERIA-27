/* ======================================================================
   HISTORIA, OBLIGACIONES Y FINANZAS
   - Historia por capítulos con objetivos y recompensa (avanza sola al cumplirlos).
   (Las faenas obligatorias del campo ya las gestiona extras.js.)
   - Finanzas: arrendar pastos, crédito de inversión, venta de vacas a otras
     ganaderías, amortización de obras y plan de rescate del mayoral.
   Se engancha a juego.js/carrera.js con envolturas: no cambia su lógica.
   ====================================================================== */
const FIN={arriendoUG:12,creditoInteres:.045,creditoMeses:60,creditoFrac:.4,ventaProb:.14,cajaBaja:15000};
/* utilidades que esta versión del juego no trae */
const HBAL={sacos:4,aviso:-45000};
function hPres(x){S.pres=clamp(S.pres+x,0,100)}
function hGasto(){const n=campo().length;return {pienso:Math.round(n*FEED[S.feed].c*(typeof feedMul==='function'?feedMul():1)),personal:Math.round(2500+10*n+(typeof mantenimiento==='function'?mantenimiento():0))}}
const hFx=t=>{try{if(typeof fx==='function')fx(t)}catch(e){}};
function obrasN(){let n=0;for(const k in MEJ)n+=mejLv(k);return n}
// Personajes (ficticios)
const PJ={anselmo:'Anselmo, el mayoral',lucia:'Lucía Vera, veterinaria',julian:'Julián Cerrillos, ganadero rival',ramiro:'Don Ramiro Salcedo, empresario'};

function stInit(){if(!S)return;
 if(!S.story){S.story={cap:0,ini:absNow(),base:null,done:[],tientas:0,f3d:false,visto:-1};stBase()}
 if(!S.fin)S.fin={arr:0,credito:null,ofVenta:null};
}
function stBase(){const st=S.stats||{};S.story.base={corridas:st.corridas||0,vueltas:(st.vueltas||0)+(st.indultos||0),mej:obrasN(),histId:S.hist.length?S.hist[0].id:0,tientas:S.story.tientas,ini:absNow()};S.story.cerr=false}

/* ---------------- Historia ---------------- */
const nuevaHist=()=>S.hist.filter(h=>h.id>S.story.base.histId);
const CAPS=[
 {t:'Lo primero, el campo',
  intro:()=>S.g.real?`La propiedad te ha confiado el hierro de ${S.g.name}. ${PJ.anselmo} lleva cuarenta años en la casa y te recibe en la puerta del cortijo: «Antes de hablar de plazas, hay que conocer la finca y dar de comer a la camada con las manos».`
   :`Tu abuelo te ha dejado una dehesa en ${S.g.prov||'el campo'}, treinta vacas y más deudas que toros. ${PJ.anselmo}, que trabajó con él toda la vida, te espera en la cancela: «Su abuelo empezó igual. Lo primero es el campo».`,
  obj:[{txt:'Entra en la finca 3D',ok:()=>S.story.f3d},{txt:`Echa ${HBAL.sacos} sacos de pienso a mano`,ok:()=>(S.fedM||0)>=HBAL.sacos}],
  rw:{money:3000},outro:'Anselmo asiente: «Así se empieza. Ahora toca ganarse a los empresarios».'},
 {t:'La primera oferta',
  intro:()=>`${PJ.ramiro} ha oído hablar de tu camada. No promete nada, pero en Ofertas encontrarás plazas que buscan toros. Elige una que tus animales puedan cumplir y reseña los toros.`,
  obj:[{txt:'Acepta una oferta y reseña sus toros',ok:()=>S.offers.some(o=>o.st==='aceptada'&&o.toros&&o.toros.length)||(S.stats.corridas||0)>S.story.base.corridas}],
  rw:{money:4000},outro:'Contrato firmado. Ahora solo queda esperar la tarde… y que los toros respondan.'},
 {t:'Tarde de estreno',
  intro:()=>'Avanza hasta el mes del festejo. Tus toros saltarán al ruedo y podrás verlo desde el tendido. Pase lo que pase, de cada tarde se aprende.',
  obj:[{txt:'Lidia tu primer festejo',ok:()=>S.stats.corridas>S.story.base.corridas}],
  rw:{money:5000,pres:1},outro:'Has oído tu hierro por la megafonía de una plaza. Eso ya no se olvida.'},
 {t:'La sangre de la casa',
  intro:()=>`${PJ.lucia} se presenta en la finca: «El futuro está en las vacas. Tienta a las becerras y quédate con las bravas; lo demás es suerte». Desde hoy te asesora en las tientas.`,
  obj:[{txt:'Tienta 3 hembras',ok:()=>S.story.tientas-S.story.base.tientas>=3,prog:()=>`${Math.min(3,S.story.tientas-S.story.base.tientas)}/3`}],
  rw:{money:3000},outro:'Lucía apunta las notas en su libreta: «Con estas madres, dentro de cuatro años hablaremos de Madrid».'},
 {t:'El vecino de Los Cerrillos',
  intro:()=>`${PJ.julian} se ha quedado con una feria que esperabas. Te lo encuentras en el mercado de ganado: «Esto no es para aficionados». Demuéstrale lo contrario en el escalafón de esta temporada.`,
  start:()=>{if(!S.rivals.some(r=>r.name==='Los Cerrillos')){S.rivals.sort((a,b)=>a.pres-b.pres);S.rivals[0]={name:'Los Cerrillos',enc:'Domecq',pres:clamp(Math.round(S.pres+4),20,90),pts:0,ore:0,ind:0,div:['#6b4a2e','#f1ece0']}}},
  obj:[{txt:'Termina la temporada por delante de Los Cerrillos',ok:()=>S.story.cerr}],
  rw:{money:8000,conf:6},outro:'Julián te tiende la mano en la feria de ganado. A regañadientes, pero te la tiende.'},
 {t:'Ladrillo a ladrillo',
  intro:()=>'Una ganadería seria necesita instalaciones. Revisa en Mercado › Finanzas cuánto tarda en amortizarse cada obra. Hay una ayuda pública a la modernización de explotaciones que cubre parte de la primera obra.',
  obj:[{txt:'Termina una obra en la finca',ok:()=>obrasN()>S.story.base.mej}],
  rw:{money:9000},outro:'Llega la resolución de la ayuda a la modernización: 9.000 € para la obra.'},
 {t:'Plaza de segunda',
  intro:()=>`${PJ.ramiro} vuelve a llamar: «Si quieres que te vean, necesitas una plaza de segunda». Busca una oferta de segunda categoría y lídiala.`,
  obj:[{txt:'Lidia en una plaza de segunda o de primera',ok:()=>nuevaHist().some(h=>h.cat<=2)}],
  rw:{money:8000,pres:2},outro:'La crítica de la feria menciona tu hierro por su nombre. Buena señal.'},
 {t:'Una tarde redonda',
  intro:()=>'Para entrar en las grandes ferias hace falta un toro que haga historia. Selecciona bien: los de tienta alta y buena reata son los que embisten.',
  obj:[{txt:'Consigue una vuelta al ruedo o un indulto',ok:()=>(S.stats.vueltas||0)+(S.stats.indultos||0)>S.story.base.vueltas}],
  rw:{money:10000,conf:5},outro:'El presidente saca el pañuelo azul. Media plaza se pone en pie por tu toro.'},
 {t:'Madrid llama',
  intro:()=>'Con prestigio, las plazas de primera empiezan a mirarte. Sube tu prestigio a 55 y acepta una oferta de primera categoría.',
  obj:[{txt:'Prestigio 55',ok:()=>S.pres>=55,prog:()=>`${Math.round(S.pres)}/55`},{txt:'Acepta una oferta de primera',ok:()=>S.offers.some(o=>o.cat===1&&o.st==='aceptada')||nuevaHist().some(h=>h.cat===1)}],
  rw:{money:12000},outro:'Tu hierro aparece en el cartel de una gran feria. Anselmo enmarca el cartel en el cortijo.'},
 {t:'La tarde soñada',
  intro:()=>'Todo lo hecho lleva a esta tarde: una plaza de primera y un toro que pase a la historia.',
  obj:[{txt:'Vuelta al ruedo o indulto en una plaza de primera',ok:()=>nuevaHist().some(h=>h.cat===1&&h.toros.some(t=>t.res==='vuelta'||t.res==='indulto'))}],
  rw:{money:25000,pres:4,conf:10},outro:'Lo has conseguido. El hierro de la casa ya es leyenda. La temporada sigue: ahora toca mantenerse arriba.'}
];
const CAP_IMG=['img/carga.jpg','img/carga-m.jpg'];
function capActual(){stInit();return S.story.cap<CAPS.length?CAPS[S.story.cap]:null}
function capObjs(c){return c.obj.map(o=>({txt:o.txt,ok:!!o.ok(),prog:o.prog?o.prog():''}))}
function historiaCheck(silencio){const c=capActual();if(!c)return;
 if(S.story.visto!==S.story.cap&&!silencio){S.story.visto=S.story.cap;if(c.start)c.start();save();return capModal('intro')}
 if(capObjs(c).every(o=>o.ok)){const R=c.rw;if(R.money)S.money+=R.money;if(R.conf)S.conf=clamp((S.conf||0)+R.conf,0,100);if(R.pres)hPres(R.pres);
  S.story.done.push({cap:S.story.cap,y:S.year,m:S.month});log(`Historia: «${c.t}» completado.`);
  S.news&&S.news.unshift({d:`${MESES[S.month]} ${S.year}`,lines:[`Capítulo completado: ${c.t}.`,c.outro],cost:0,inc:R.money||0,cor:[]});
  const prev=c;S.story.cap++;stBase();save();hFx('reto');
  if(!silencio)capModal('fin',prev)}}
function capModal(tipo,c){c=c||capActual();if(!c)return;const n=CAPS.indexOf(c)+1,img=CAP_IMG[n%2];const R=c.rw;
 const rw=[R.money?`+${eur(R.money)}`:'',R.pres?`+${R.pres} prestigio`:'',R.conf?`+${R.conf} % confianza`:''].filter(Boolean).join(' · ');
 const body=tipo==='intro'
  ?`<p style="margin:0">${esc(c.intro())}</p><div class="list">${capObjs(c).map(o=>`<div class="task"><span class="dot ${o.ok?'ok':''}"></span><span class="t">${esc(o.txt)}${o.prog?` <small class="muted">(${o.prog})</small>`:''}</span></div>`).join('')}</div><p class="muted" style="margin:0">Recompensa: ${rw}</p>`
  :`<p style="margin:0">${esc(c.outro)}</p><p style="margin:0"><b>Recompensa:</b> ${rw}</p>${capActual()?`<p class="muted" style="margin:0">Siguiente capítulo: «${esc(capActual().t)}».</p>`:''}`;
 modal(tipo==='intro'?`Capítulo ${n} · ${c.t}`:`Capítulo ${n} completado`,`<div class="stack"><div class="capimg" style="background-image:url(${img})"><span>${tipo==='intro'?'Capítulo '+n:'Completado'}</span><b>${esc(c.t)}</b></div>${body}<button class="btn pri adv" onclick="closeModal()">${tipo==='intro'?'En marcha':'Seguir'}</button></div>`,
  ()=>{if(tipo==='fin')setTimeout(()=>historiaCheck(),250)})}
function historiaCard(){const c=capActual();if(!c){return `<div class="card hcap"><div class="lbl">Historia</div><b>Leyenda del campo bravo</b><p class="muted" style="margin:.3rem 0 0">Has completado la historia. Sigue criando toros y manteniéndote en lo alto del escalafón.</p></div>`}
 const n=S.story.cap+1,o=capObjs(c),hechos=o.filter(x=>x.ok).length;
 return `<div class="card hcap" onclick="capModal('intro')" role="button" tabindex="0"><div class="hcap-bg" style="background-image:url(${CAP_IMG[n%2]})"></div><div class="hcap-tx"><div class="lbl">Historia · capítulo ${n} de ${CAPS.length}</div><b>${esc(c.t)}</b>
  ${o.map(x=>`<div class="hcap-o ${x.ok?'ok':''}"><i></i>${esc(x.txt)}${x.prog?` <small>(${x.prog})</small>`:''}</div>`).join('')}<div class="meter"><i style="width:${Math.round(hechos/o.length*100)}%"></i></div></div></div>`}

/* ---------------- Finanzas ---------------- */
function valorCamada(){return typeof valorGanado==='function'?valorGanado():0}
function valorObras(){return typeof invertido==='function'?invertido():0}
function creditoMax(){return Math.max(0,Math.round(((valorCamada()+valorObras())*FIN.creditoFrac-(S.fin.credito?S.fin.credito.pend:0))/1000)*1000)}
function cuota(imp){const i=FIN.creditoInteres/12,n=FIN.creditoMeses;return Math.round(imp*i/(1-Math.pow(1+i,-n)))}
function pedirCredito(imp){stInit();imp=Math.min(imp,creditoMax());if(imp<5000||S.fin.credito)return;
 S.fin.credito={imp,cuota:cuota(imp),meses:FIN.creditoMeses,pend:imp};S.money+=imp;log(`Crédito de inversión: ${eur(imp)} a ${FIN.creditoMeses} meses.`);save();closeModal();render();toast(`Crédito concedido: ${eur(imp)}`);hFx('cobro')}
function creditoModal(){stInit();const mx=creditoMax();if(S.fin.credito){toast('Ya tienes un crédito en curso');return}
 const ops=[.25,.5,1].map(f=>Math.round(mx*f/1000)*1000).filter((v,i,a)=>v>=5000&&a.indexOf(v)===i);
 modal('Crédito de inversión',`<div class="stack"><p style="margin:0">El banco financia hasta el ${FIN.creditoFrac*100} % del valor de tu camada y tus instalaciones, al ${(FIN.creditoInteres*100).toFixed(1)} % anual y ${FIN.creditoMeses} meses. Úsalo para invertir en obras o reses que te devuelvan más de lo que cuesta.</p>
 ${ops.length?ops.map(v=>`<button class="btn" onclick="pedirCredito(${v})"><b>${eur(v)}</b><span class="muted" style="margin-left:auto">cuota ${eur(cuota(v))}/mes</span></button>`).join(''):'<p class="muted" style="margin:0">Ahora mismo tu patrimonio no permite más financiación.</p>'}</div>`)}
function toggleArriendo(){stInit();if(S.fin.arr){S.fin.arr=0;toast('Arriendo de pastos terminado');}
 else{const lib=Math.floor((capacidad()-campo().length)*.6);if(lib<5){toast('No te sobran pastos para arrendar');return}S.fin.arr=lib;toast(`Arriendas pastos para ${lib} cabezas: +${eur(lib*FIN.arriendoUG)}/mes`)}save();render()}
function venderLoteVacas(){stInit();const of=S.fin.ofVenta;if(!of)return;const vs=campo().filter(a=>a.role==='vaca').sort((a,b)=>(a.nota||0)-(b.nota||0)).slice(0,of.n);
 if(vs.length<of.n){toast('No tienes tantas vacas');return}for(const a of vs)a.st='vendido';const t=of.n*of.precio;S.money+=t;S.fin.ofVenta=null;log(`Venta de ${of.n} vacas a ${of.quien}: ${eur(t)}.`);save();render();toast(`Vendidas ${of.n} vacas: +${eur(t)}`);hFx('cobro')}
// meses para recuperar el siguiente nivel de cada obra (solo las que dan un ahorro o ingreso medible)
function amortiza(k){const lv=mejLv(k),d=MEJ[k];if(lv>=d.max)return null;const g=hGasto(),c=d.c[lv];
 const m={comederos:[.12,.06,.06][lv]*g.pienso,nave:.08*g.pienso,fabrica:.15*g.pienso,casa:900,hospederia:[2000,2500][lv],museo:1100,escuela:1200,placita:lv===1?900:0,oficina:.05*0,clinica:0}[k];
 return m>0?Math.max(1,Math.round(c/m)):null}
function finanzasHTML(){stInit();const g=hGasto(),F=S.fin,cr=F.credito,cab=campo().length,cap=capacidad();
 const libres=Math.floor((cap-cab)*.6);
 const obras=Object.keys(MEJ).filter(k=>mejLv(k)<MEJ[k].max&&(!MEJ[k].req||mej(MEJ[k].req))).map(k=>{const lv=mejLv(k),d=MEJ[k],m=amortiza(k);
  return `<div class="task"><span class="t"><b>${esc(d.n)}${d.max>1?` · nivel ${lv+1}`:''}</b> · ${eur(d.c[lv])}<br><small class="muted">${esc(d.d[lv])}${m?` Se amortiza en unos ${m} meses.`:''}</small></span><span class="tb"><button class="btn sm" onclick="construir('${k}')">Ver</button></span></div>`}).sort().join('');
 return `<div class="sect"><h2>Finanzas</h2><small class="muted">dinero que trabaja</small></div>
 <div class="card stack">
  <div class="kv"><span>Gasto mensual <b>${eur(g.pienso+g.personal)}</b></span><span>Ocupación <b>${cab}/${cap} cabezas</b></span></div>
  <div class="task"><span class="t"><b>Arrendar pastos sobrantes</b><br><small class="muted">${F.arr?`Arrendados para ${F.arr} cabezas: +${eur(F.arr*FIN.arriendoUG)} al mes (reduce tu capacidad).`:libres>=5?`Te sobran pastos para ${libres} cabezas: unos ${eur(libres*FIN.arriendoUG)} al mes.`:'Ahora no te sobran pastos.'}</small></span><span class="tb"><button class="btn sm ${F.arr?'':'oro'}" onclick="toggleArriendo()" ${!F.arr&&libres<5?'disabled':''}>${F.arr?'Terminar':'Arrendar'}</button></span></div>
  <div class="task"><span class="t"><b>Crédito de inversión</b><br><small class="muted">${cr?`Pendiente ${eur(cr.pend)} · cuota ${eur(cr.cuota)}/mes · quedan ${cr.meses} meses`:`Hasta ${eur(creditoMax())} al ${(FIN.creditoInteres*100).toFixed(1)} % anual`}</small></span><span class="tb"><button class="btn sm" onclick="creditoModal()" ${cr?'disabled':''}>Pedir</button></span></div>
  ${F.ofVenta?`<div class="task"><span class="dot ok"></span><span class="t"><b>Oferta de compra</b><br><small class="muted">${esc(F.ofVenta.quien)} compra ${F.ofVenta.n} vacas de vientre a ${eur(F.ofVenta.precio)} cada una (se van las de peor nota). Caduca a fin de mes.</small></span><span class="tb"><button class="btn sm oro" onclick="venderLoteVacas()">Vender</button></span></div>`:''}
 </div>
 ${obras?`<div class="card stack"><div class="lbl">Obras · inversión y amortización</div><div class="list">${obras}</div></div>`:''}`}
function planRescate(){const c=campo(),viejas=c.filter(a=>a.role==='vaca'&&ageY(a)>=12),machosPop=c.filter(a=>a.sex==='M'&&!a.role&&a.tentado),cap=capacidad();
 const ops=[];if(viejas.length)ops.push(`Vender ${viejas.length} vacas viejas al matadero: unos ${eur(viejas.reduce((t,a)=>t+a.peso*1.3,0))}.`);
 if(machosPop.length)ops.push(`Vender ${machosPop.length} machos tentados a festejos populares: unos ${eur(machosPop.reduce((t,a)=>t+700+a.peso*2.2,0))}.`);
 const lib=Math.floor((cap-c.length)*.6);if(lib>=5&&!S.fin.arr)ops.push(`Arrendar pastos sobrantes: ${eur(lib*FIN.arriendoUG)} al mes.`);
 if(!S.fin.credito&&creditoMax()>=5000)ops.push(`Pedir un crédito de inversión de hasta ${eur(creditoMax())}.`);
 if(S.feed!=='eco')ops.push('Pasar la alimentación a económica mientras dure el bache.');
 modal('El plan de Anselmo',`<div class="stack"><p style="margin:0">«La caja está floja, pero esto tiene arreglo. Yo haría esto, por este orden»:</p><div class="list">${ops.map(t=>`<div class="task"><span class="dot"></span><span class="t">${esc(t)}</span></div>`).join('')}</div><button class="btn pri adv" onclick="closeModal();go('mercado')">Ir a Mercado y Finanzas</button></div>`)}
function finanzasMes(rep){stInit();const F=S.fin;
 // Ayudas anuales de la PAC (enero): pago por vaca de vientre y pago básico de la explotación
 if(S.month===0){const v=Math.round(110*campo().filter(a=>a.role==='vaca').length+4000);S.money+=v;rep.inc+=v;rep.lines.push(`Ayudas anuales de la PAC: +${eur(v)}.`)}
 if(F.arr){const v=F.arr*FIN.arriendoUG;S.money+=v;rep.inc+=v;rep.lines.push(`Arriendo de pastos: +${eur(v)}.`)}
 if(F.credito){const cr=F.credito;S.money-=cr.cuota;rep.cost+=cr.cuota;cr.meses--;cr.pend=Math.max(0,Math.round(cr.pend-cr.cuota*.8));if(cr.meses<=0){F.credito=null;rep.lines.push('Crédito de inversión pagado por completo.')}}
 F.ofVenta=null;const vacas=campo().filter(a=>a.role==='vaca').length;
 if(vacas>12&&Math.random()<FIN.ventaProb){const n=RI(3,6),prov=pick(PROVINCIAS);F.ofVenta={n,precio:RI(24,34)*100,quien:`Una ganadería de ${prov}`};rep.lines.push(`${F.ofVenta.quien} quiere comprarte ${n} vacas de vientre. Míralo en Mercado › Finanzas.`)}
 // Red de seguridad: venta de urgencia del ganado de desecho antes de llegar al límite del banco
 if(S.money<HBAL.aviso){let ing=0,n=0;const c=campo();
  for(const a of c){if((a.role==='vaca'&&ageY(a)>=12)||(a.sex==='M'&&!a.role&&a.tentado&&a.res==null)){ing+=a.role==='vaca'?a.peso*1.3:700+a.peso*2.2;a.st='vendido';n++}}
  const vs=campo().filter(a=>a.role==='vaca'&&a.st==='campo').sort((a,b)=>(a.nota||0)-(b.nota||0));let i=0;while(campo().length>capacidad()*.9&&i<vs.length){ing+=vs[i].peso*1.3;vs[i].st='vendido';n++;i++}
  if(n){ing=Math.round(ing);S.money+=ing;rep.inc+=ing;S.animals=S.animals.filter(a=>a.st==='campo');rep.lines.push(`Venta de urgencia: Anselmo vende ${n} reses de desecho para frenar el descubierto (+${eur(ing)}).`)}}
 if(S.money<FIN.cajaBaja)rep.lines.push('Caja baja: Anselmo tiene un plan para sanear las cuentas (Tareas).')}

/* ---------------- Enganches ---------------- */
function historiaMes(rep){finanzasMes(rep)}
(function(){
 const w=(name,fn)=>{const o=window[name];if(typeof o==='function')window[name]=fn(o)};
 // Finanzas del mes: se aplican justo antes del informe mensual (antes del registro del libro de cuentas)
 w('newsToast',o=>function(rep){try{if(S&&rep&&rep.lines)historiaMes(rep)}catch(e){console.warn('finanzas',e)}return o.apply(this,arguments)});
 w('listaTareas',o=>function(){const T=o.apply(this,arguments)||[];try{if(S&&S.money<FIN.cajaBaja)T.unshift({t:`Caja baja (${eur(S.money)}): revisa el plan del mayoral`,p:'planRescate()',pl:'Ver plan',oro:1})}catch(e){}return T});
 w('tentar',o=>function(a){const r=o.apply(this,arguments);if(S&&S.story)S.story.tientas++;return r});
 w('enter3D',o=>function(){if(S){stInit();S.story.f3d=true}return o.apply(this,arguments)});
 w('finTemporada',o=>function(rep,ok){if(S&&S.story&&CAPS[S.story.cap]&&CAPS[S.story.cap].t==='El vecino de Los Cerrillos'){const c=S.rivals.find(r=>r.name==='Los Cerrillos');if(c&&(S.season.pts||0)>c.pts)S.story.cerr=true}return o.apply(this,arguments)});
 w('capacidad',o=>function(){const c=o.apply(this,arguments);return S&&S.fin&&S.fin.arr?c-S.fin.arr:c});
 w('renderInicio',o=>function(el){o.apply(this,arguments);if(S){stInit();el.insertAdjacentHTML('afterbegin',historiaCard())}});
 w('renderMercado',o=>function(el){o.apply(this,arguments);if(S)el.insertAdjacentHTML('beforeend',finanzasHTML())});
 w('render',o=>function(){const r=o.apply(this,arguments);if(S&&!document.getElementById('ov')){stInit();setTimeout(()=>{if(!document.getElementById('ov'))historiaCheck()},350)}return r});
})();

