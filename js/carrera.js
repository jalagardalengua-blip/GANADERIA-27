/* ============ MODO CARRERA: escalafón, confianza, retos, buzón ============ */
const PTS={indulto:30,vuelta:12,ovacion:6,silencio:1,pitos:-3,devuelto:-5};
const SPOTS={pienso:[31,20.5],hierro:[-14,-11.5],aperos:[-21,6],caballo:[-12,11.6],placita:[-30,33.5],corrales:[28,-16],casa:[0,9]};
function migrate(s){if(!s)return s;s.conf=s.conf??60;s.news=s.news||[];s.xp=s.xp||0;s.mes=s.mes||{};s.trofeos=s.trofeos||[];
 if(!s.rivals)s.rivals=GANADERIAS.filter(g=>g.name!==s.g.name).slice(0,9).map(g=>({name:g.name,enc:g.enc,pres:g.pres,pts:0,ore:0,ind:0,div:g.div}));
 if(s.season){s.season.pts=s.season.pts||0;s.season.ore=s.season.ore||0}
 if(!s.retos||s.retosM!==s.year*12+s.month)genRetos(s);return s}
function genRetos(s){const c=s.animals.filter(a=>a.st==='campo'),sin=c.filter(a=>!a.herrado).length;
 const pool=[
  {id:'pienso',n:4,txt:'Echa 4 sacos de pienso a mano',rw:1200,xp:15},
  {id:'dist',n:800,txt:'Recorre 800 m de finca a caballo',rw:800,xp:10},
  {id:'der',n:2,txt:'Derriba 2 reses en acoso y derribo',rw:2500,xp:30},
  {id:'cur',n:1,txt:'Cura tú mismo a un animal',rw:900,xp:12,need:()=>c.some(a=>a.salud<55)},
  {id:'herr',n:Math.min(5,sin),txt:`Hierra ${Math.min(5,sin)} becerros con tu mano`,rw:1500,xp:20,need:()=>s.month>=7&&sin>0},
  {id:'tient',n:2,txt:'Tienta 2 reses en la placita',rw:2000,xp:25,need:()=>s.mej&&s.mej.placita&&c.filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2).length>=2},
  {id:'enc',n:1,txt:'Encierra un toro a caballo en los corrales',rw:1800,xp:20,need:()=>s.offers.some(o=>o.st==='nueva')},
  {id:'vista',n:1,txt:'Ve entera tu corrida en la plaza 3D',rw:1500,xp:20,need:()=>s.porVer&&s.porVer.length>0},
  {id:'cerca',n:1,txt:'Repara tú la cerca rota',rw:900,xp:12,need:()=>!!s.roto}];
 const ok=pool.filter(p=>!p.need||p.need()).sort(()=>Math.random()-.5);
 const pri=ok.filter(p=>['vista','cerca','herr'].includes(p.id)),rest=ok.filter(p=>!pri.includes(p));
 s.retos=[...pri,...rest].slice(0,3).map(({need,...r})=>({...r,done:false}));s.retosM=s.year*12+s.month;s.mes={}}
function retoProg(r){return r.id==='pienso'?(S.fedM||0):Math.floor((S.mes&&S.mes[r.id])||0)}
function retosCheck(){if(!S||!S.retos)return;for(const r of S.retos){if(r.done||retoProg(r)<r.n)continue;r.done=true;S.money+=r.rw;S.xp=(S.xp||0)+r.xp;save();toast(`Reto cumplido · +${eur(r.rw)}`);try{navigator.vibrate&&navigator.vibrate([20,40,20])}catch(e){}}}
function mesInc(k,v=1){if(!S)return;S.mes=S.mes||{};S.mes[k]=(S.mes[k]||0)+v;retosCheck()}
function rivalsTick(){if(S.month<2||S.month>9)return;for(const r of S.rivals){if(Math.random()<r.pres/105){const n=Math.random()<.3?2:1;for(let k=0;k<n;k++){let p=0;for(let i=0;i<6;i++){const q=Math.random()*100;if(q<r.pres*.04){p+=30;r.ind++}else p+=q<r.pres*.25?12:q<r.pres*.75?6:q<92?1:-3}r.pts+=p;r.ore+=RI(0,4)}}r.pres=clamp(r.pres+R(-.6,.6),20,95)}}
function ranking(){const me={name:S.g.name,pts:S.season.pts||0,ore:S.season.ore||0,ind:S.season.ind||0,me:true,div:S.g.div};return [...S.rivals.map(r=>({...r})),me].sort((a,b)=>b.pts-a.pts||b.ore-a.ore)}
function miPos(){return ranking().findIndex(r=>r.me)+1}
function finTemporada(rep,ok){
 S.conf=clamp(S.conf+ok*12-(3-ok)*10,0,100);
 const pos=miPos();const prem=pos===1?40000:pos<=3?15000:pos<=5?5000:0;
 if(prem){S.money+=prem;rep.inc+=prem}S.pres=clamp(S.pres+(pos<=5?(6-pos)*.8:-1),0,100);
 rep.lines.push(`Escalafón ganadero ${S.year}: terminas ${pos}º de ${S.rivals.length+1}${prem?` (+${eur(prem)})`:''}. Confianza de la propiedad: ${Math.round(S.conf)} %.`);
 if(pos===1)S.trofeos.push({y:S.year,t:'Ganadería triunfadora de la temporada',k:'oro'});
 else if(pos<=3)S.trofeos.push({y:S.year,t:`${pos}º del escalafón ganadero`,k:'plata'});
 const best=S.hist.filter(h=>h.y===S.year).flatMap(h=>h.toros.map(t=>({...t,plaza:h.plaza}))).sort((a,b)=>(b.score||0)-(a.score||0))[0];
 if(best&&best.score>=80)S.trofeos.push({y:S.year,t:`Toro más bravo del año: ${best.name} (${best.plaza})`,k:'toro'});
 for(const r of S.rivals){r.pts=0;r.ore=0;r.ind=0}}
function valoracion(){const c=campo().filter(a=>a.sex==='M'&&!a.role&&ageY(a)>=3&&a.res==null).map(a=>calidad(a).q).sort((a,b)=>b-a).slice(0,6);return c.length?Math.round(c.reduce((s,v)=>s+v,0)/c.length):50}
function estrellas(p){const v=Math.round(clamp(p,0,100)/20*2)/2;let h='';for(let i=1;i<=5;i++){const f=v>=i?1:v>=i-.5?.5:0;h+=`<svg viewBox="0 0 24 24" class="sti"><defs><linearGradient id="sg${i}${f*10}"><stop offset="${f*100}%" stop-color="#e6bb55"/><stop offset="${f*100}%" stop-color="#3a3f4b"/></linearGradient></defs><path fill="url(#sg${i}${f*10})" d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>`}return `<span class="stars" aria-label="${v} estrellas">${h}</span>`}
function posDe(a){if(a.role==='semental')return 'SEM';if(a.role==='vaca')return 'VAC';const y=ageY(a);if(a.sex==='H')return y>=1?'HEM':'BEC';return ['BEC','AÑO','ERA','UTR','TOR','TOR','TOR'][Math.min(6,y)]}
function matRating(n){let h=0;for(const ch of n)h=(h*31+ch.charCodeAt(0))>>>0;return 72+h%21}
function newsToast(rep){S.news.unshift({d:`${MESES[S.month]} ${S.year}`,lines:rep.lines,cost:rep.cost,inc:rep.inc,cor:rep.corridas.map(r=>r.id)});S.news=S.news.slice(0,24);save();
 let el=$('#newsT');if(!el){el=document.createElement('div');el.id='newsT';el.className='newsT';document.body.appendChild(el)}
 const net=rep.inc-rep.cost,top=rep.corridas[0],ln=rep.lines.find(l=>!/^Alimentación|^Campaña/.test(l))||rep.lines[0]||'';
 el.innerHTML=`<button class="nt" onclick="this.parentNode.hidden=true;showReport(S.news[0])"><span class="nd">${MESES[S.month]} ${S.year}</span><span class="nl">${top?`${esc(top.plaza)} · ${esc(top.resumen)}`:esc(ln)}</span><b class="${net>=0?'pos':'neg'}">${net>=0?'+':''}${eur(net)}</b></button>`;
 el.hidden=false;clearTimeout(newsToast.t);newsToast.t=setTimeout(()=>{el.hidden=true},6000)}
function irA3D(spot){enter3D();const P=SPOTS[spot];if(P&&W3.F){W3.F.p.set(P[0],0,P[1]);W3.F.carry=null;setCarry();W3.cam.position.set(P[0]+4,4,P[1]+6)}}
function delegar(k){const c=campo();
 if(k==='cerca'){S.money-=600;S.roto=null;toast('El mayoral repara la cerca · −600 €')}
 if(k==='escapado'){S.money-=900;S.escapado=null;toast('Los vaqueros recogen la res · −900 €')}
 if(k==='curas'){const inj=c.filter(a=>a.salud<55);S.money-=inj.length*250;inj.forEach(a=>{a.salud=Math.min(100,a.salud+30);a.lesion=0});toast(`Veterinario · −${eur(inj.length*250)}`)}
 save();render()}

/* ============ INICIO ============ */
function temporadaStrip(){const acep=S.offers.filter(o=>o.st==='aceptada');
 return `<div class="season" role="list">${MESES.map((m,i)=>{const ab=S.year*12+i,fer=FERIAS.filter(f=>f.m===i),mine=acep.filter(o=>o.abs===ab);return `<span role="listitem" class="sm ${i===S.month?'now':''} ${i<S.month?'past':''} ${mine.length?'mine':''}"><b>${m.slice(0,3)}</b><small>${mine.length?esc(mine[0].feria):fer.length?esc(fer[0].feria):'—'}</small></span>`}).join('')}</div>`}
function renderInicio(el){
 const nuevas=S.offers.filter(o=>o.st==='nueva').sort((a,b)=>a.abs-b.abs),acep=S.offers.filter(o=>o.st==='aceptada').sort((a,b)=>a.abs-b.abs);
 const pv=S.porVer.length?S.hist.find(h=>h.id===S.porVer[0]):null;const pos=miPos(),rk=ranking(),rhechos=S.retos.filter(r=>r.done).length;
 el.innerHTML=`<div class="stack" style="gap:1rem">
 ${pv||acep.length?(()=>{const o=pv||acep[0],tor=pv?pv.toros:o.toros.map(id=>byId(id)).filter(Boolean),pm=tor.length?Math.round(tor.reduce((s,t)=>s+t.peso,0)/tor.length):0,ciudad=(o.plaza.match(/\(([^)]+)\)/)||[])[1]||o.plaza.split(' · ')[0];
  return `<div class="palco"><div class="img" style="background-image:url(img/palco.jpg)"></div><span class="ptag">${ICO.plazaI.replace('<svg','<svg class="ico"')}<span><b>Plaza de toros</b><small>${esc(ciudad)}</small></span></span>
  <div class="pcard">${emblem(S.g,48)}<span class="pt"><b>Tarde de toros · ${esc(ciudad)}</b><small>${pv?'Hoy en el ruedo':`${MESES[o.abs%12]} ${Math.floor(o.abs/12)}`}<i>|</i>${tor.length} ${o.tipo==='novillada'?'novillos':'toros'}<i>|</i>${pm} kg</small></span>
  <button class="btn ${pv?'oro':''}" onclick="${pv?`enterPlaza(${pv.id})`:`go('ofertas')`}">${pv?'Ir a la plaza':'Detalles'}${ICO.chev}</button></div></div>`})()
 :`<div class="hero2"><div class="img" style="background-image:url(img/hero.jpg)"></div><div class="txt"><div class="k">Ganadería</div><h1>${esc(S.g.name)}</h1><div class="tag">Tradición<i>·</i>Pasión<i>·</i>Toros</div></div></div>`}
 ${temporadaStrip()}
 <div class="wid">
  <button class="wd" onclick="UI.perfil='rank';go('palmares')"><span class="lbl">Escalafón</span><b>${pos}º</b><small>${S.season.pts||0} pts · líder ${rk[0].me?'tú':esc(rk[0].name.split(' ')[0])}</small></button>
  <button class="wd" onclick="go('tareas')"><span class="lbl">Confianza</span><b>${Math.round(S.conf)}%</b><span class="meter"><i style="width:${S.conf}%;background:${S.conf<30?'var(--bad)':S.conf<55?'var(--warn)':'var(--good)'}"></i></span></button>
  <button class="wd" onclick="go('tareas')"><span class="lbl">Retos del mes</span><b>${rhechos}/${S.retos.length}</b><small>${S.retos.find(r=>!r.done)?esc(S.retos.find(r=>!r.done).txt):'¡Todos cumplidos!'}</small></button>
 </div>
 ${nuevas.slice(0,2).map(offerCard).join('')}
 ${nuevas.length>2?`<button class="btn adv" onclick="go('ofertas')">Ver las ${nuevas.length} ofertas${ICO.chev}</button>`:''}
 ${S.news.length?`<section class="sect"><header><h2>Buzón</h2></header><div class="list">${S.news.slice(0,3).map((n,i)=>`<button class="li" onclick="showReport(S.news[${i}])"><span class="sw" style="background:${(n.cor||[]).length?'var(--gold-grad)':'#1d222c'}"></span><span class="t"><b>${n.d}</b><small>${esc((n.lines.find(l=>!/^Alimentación|^Campaña/.test(l))||n.lines[0]||'').slice(0,90))}</small></span><span class="r" style="color:${n.inc-n.cost>=0?'var(--good)':'var(--bad)'}">${n.inc-n.cost>=0?'+':''}${eur(n.inc-n.cost)}</span></button>`).join('')}</div></section>`:''}
 <div class="duo"><button class="btn oro big" onclick="enter3D()">${ICO.cortijo}Finca en 3D</button><button class="btn big" onclick="go('camada')">${ICO.toroG.replace('<svg','<svg class="ico"')}Ganadería</button></div>
 </div>`}

/* ============ TAREAS ============ */
function listaTareas(){const c=campo(),T=[];
 const sin=c.filter(a=>!a.herrado).length,pendT=c.filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2).length,dec=c.filter(a=>a.sex==='H'&&a.tentado&&!a.role).length,nuevas=S.offers.filter(o=>o.st==='nueva'),sems=c.filter(a=>a.role==='semental');
 const mk=c.filter(a=>a.mark),enc=mk.filter(a=>a.encd).length,inj=c.filter(a=>a.salud<55);
 if(S.porVer.length)T.push({t:'Corrida de tu hierro en la plaza',p:`enterPlaza(${S.porVer[0]})`,pl:'Ir a la plaza',d:`verCorrida(${S.porVer[0]})`,dl:'Resumen',oro:1});
 if(nuevas.length)T.push({t:`${nuevas.length} ${nuevas.length>1?'ofertas':'oferta'} sin responder`,p:`go('ofertas')`,pl:'Ver'});
 if(mk.length&&enc<mk.length)T.push({t:`Encerrar ${mk.length-enc} toros apartados`,p:`irA3D('caballo')`,pl:'Hacerlo yo',d:'ofertasModal()',dl:'Vaqueros'});
 if(S.month>=7&&sin)T.push({t:`Herrar ${sin} becerros`,p:`irA3D('hierro')`,pl:'Hacerlo yo',d:'herradero();render()',dl:`Mayoral · ${eur(sin*35)}`});
 if(pendT)T.push({t:`Tentar ${pendT} hembras`,p:mej('placita')?`irA3D('placita')`:null,pl:'Hacerlo yo',d:'tientaLote()',dl:`Mayoral · ${eur(pendT*tCost('H'))}`});
 if(dec)T.push({t:`Decidir ${dec} hembras tentadas`,p:`UI.filter='hjov';go('camada')`,pl:'Decidir'});
 if(S.roto)T.push({t:`Reparar la cerca de ${RKN[S.roto.rk]}`,p:`irA3D('aperos')`,pl:'Hacerlo yo',d:`delegar('cerca')`,dl:'Mayoral · 600 €'});
 if(S.escapado){const a=byId(S.escapado.id);if(a)T.push({t:`Devolver a ${a.name} a su cercado`,p:`irA3D('caballo')`,pl:'A caballo',d:`delegar('escapado')`,dl:'Vaqueros · 900 €'})}
 if(inj.length)T.push({t:`Curar ${inj.length>1?inj.length+' animales':'a '+inj[0].name}`,p:`irA3D('aperos')`,pl:'Hacerlo yo',d:`delegar('curas')`,dl:`Veterinario · ${eur(inj.length*250)}`});
 if((S.fedM||0)<4)T.push({t:`Echar pienso a mano (${S.fedM||0}/4)`,p:`irA3D('pienso')`,pl:'Hacerlo yo',opt:1});
 if(!sems.length)T.push({t:'Sin semental para la paridera',p:`go('mercado')`,pl:'Mercado'});
 return T}
function renderTareas(el){
 const T=listaTareas();
 el.innerHTML=`<div class="stack" style="gap:1rem">
 <section class="sect"><header><h2>Retos del mes</h2></header><div class="retos">${S.retos.map(r=>{const p=Math.min(r.n,retoProg(r));return `<div class="reto ${r.done?'ok':''}"><span class="rt">${esc(r.txt)}</span><span class="meter"><i style="width:${p/r.n*100}%"></i></span><span class="rr"><small>${r.id==='dist'?Math.round(p)+' / '+r.n+' m':p+' / '+r.n}</small><b>${r.done?'Cumplido':'+'+eur(r.rw)}</b></span></div>`}).join('')}</div></section>
 <section class="sect"><header><h2>Por hacer</h2></header><div class="list">${T.length?T.map(x=>`<div class="task"><span class="dot ${x.oro?'ok':''}"></span><span class="t">${esc(x.t)}</span><span class="tb">${x.p?`<button class="btn sm ${x.oro||x.pl==='Hacerlo yo'||x.pl==='A caballo'?'oro':''}" onclick="${x.p}">${x.pl}</button>`:''}${x.d?`<button class="btn sm" onclick="${x.d}">${x.dl}</button>`:''}</span></div>`).join(''):`<div class="task"><span class="dot ok"></span><span class="t">Todo al día.</span></div>`}</div></section>
 <section class="sect"><header><h2>Objetivos ${S.year}</h2><span class="sp"></span><small class="muted">${eur(S.objs[0]?.reward||0)} c/u</small></header>
  <div class="card" style="padding:12px 14px"><div class="row" style="justify-content:space-between"><span class="lbl">Confianza de la propiedad</span><b>${Math.round(S.conf)}%</b></div><span class="meter big"><i style="width:${S.conf}%;background:${S.conf<30?'var(--bad)':S.conf<55?'var(--warn)':'var(--good)'}"></i></span></div>
  <div class="list">${S.objs.map(o=>{const ok=OBJCHK[o.id](S.season,o);return `<div class="task"><span class="dot ${ok?'ok':''}"></span><span class="t">${o.txt}</span><span class="badge ${ok?'ok':''}">${ok?'Hecho':'Pendiente'}</span></div>`}).join('')}</div></section>
 <button class="btn pri adv" onclick="advance()">Avanzar a ${MESES[(S.month+1)%12]}${ICO.chev}</button>
 </div>`}

/* ============ PERFIL ============ */
function renderPalmares(el){
 const st=S.stats,L=nivel(),q=getQual(),rk=ranking(),tab=UI.perfil||'resumen';
 const tabs=[['resumen','Resumen'],['rank','Escalafón'],['trofeos','Vitrina'],['hist','Festejos'],['ajustes','Ajustes']];
 let body='';
 if(tab==='resumen')body=`<div class="tiles">
  <div class="tile"><div class="lbl">Valoración</div><div class="v">${valoracion()}</div></div><div class="tile"><div class="lbl">Escalafón</div><div class="v">${miPos()}º</div></div>
  <div class="tile"><div class="lbl">Festejos</div><div class="v">${st.corridas}</div></div><div class="tile"><div class="lbl">Toros lidiados</div><div class="v">${st.toros}</div></div>
  <div class="tile"><div class="lbl">Orejas</div><div class="v">${st.orejas}</div></div><div class="tile"><div class="lbl">Vueltas</div><div class="v">${st.vueltas}</div></div>
  <div class="tile"><div class="lbl">Indultos</div><div class="v">${st.indultos}</div></div><div class="tile"><div class="lbl">Ingresos plaza</div><div class="v" style="font-size:1.15rem">${eur(st.ingresos)}</div></div></div>
  ${S.presHist.length>1?`<section class="sect"><header><h2>Prestigio</h2></header><div class="card">${spark()}</div></section>`:''}
  <section class="sect"><header><h2>Diario</h2></header><div class="list">${S.log.slice(0,10).map(l=>`<div class="task"><span class="mono muted" style="min-width:64px">${l.d}</span><span class="t" style="font-size:.88rem">${esc(l.t)}</span></div>`).join('')}</div></section>`;
 if(tab==='rank')body=`<div class="list tw"><table class="t rank"><tr><th>#</th><th>Ganadería</th><th>Pts</th><th>Orejas</th><th>Ind.</th></tr>${rk.map((r,i)=>`<tr class="${r.me?'me':''}"><td class="num">${i+1}</td><td>${divisa(r.div||['#333','#666'])} ${esc(r.name)}</td><td class="num"><b>${r.pts}</b></td><td class="num">${r.ore}</td><td class="num">${r.ind}</td></tr>`).join('')}</table></div><small class="muted">Puntos por toro: indulto 30, vuelta 12, ovación 6, silencio 1, pitos −3, devuelto −5, y 4 por oreja. Premios al cerrar el año.</small>`;
 if(tab==='trofeos')body=S.trofeos.length?`<div class="trofs">${S.trofeos.slice().reverse().map(t=>`<div class="trof ${t.k}">${ICO.copa}<span><b>${esc(t.t)}</b><small>Temporada ${t.y}</small></span></div>`).join('')}</div>`:'<div class="card muted">La vitrina está vacía. Termina entre los tres primeros del escalafón o cría el toro más bravo del año.</div>';
 if(tab==='hist')body=S.hist.length?`<div class="list">${S.hist.map(h=>`<button class="li" onclick="verCorrida(${h.id})"><span class="sw" style="background:${h.cat===1?'var(--gold-grad)':'#1d222c'}"></span><span class="t"><b>${esc(h.plaza)}</b><small>${h.feria} · ${MESES[h.m].slice(0,3)} ${h.y} · ${esc(h.resumen)}</small></span><span class="r"><b style="color:${h.dp>=0?'var(--good)':'var(--bad)'}">${h.dp>=0?'+':''}${h.dp}</b><br><small class="muted">${h.pts!=null?h.pts+' pts':'prestigio'}</small></span></button>`).join('')}</div>`:'<div class="card muted">Aún no has lidiado.</div>';
 if(tab==='ajustes')body=`<div class="field"><span class="lbl">Calidad gráfica 3D</span><div class="seg">${[['alta','Alta','Máxima nitidez'],['media','Media','Equilibrada'],['baja','Baja','Más fluida']].map(([k,n,d])=>`<button aria-pressed="${q===k}" onclick="setQual('${k}')"><b>${n}</b><span>${d}</span></button>`).join('')}</div></div>
  <button class="btn" onclick="instalar()">Instalar en el móvil</button>
  <div id="reset"><button class="btn ghost" onclick="$('#reset').innerHTML='<div class=&quot;card stack&quot;><span>Se borrará esta partida.</span><div class=&quot;row&quot;><button class=&quot;btn pri&quot; onclick=&quot;resetGame()&quot;>Borrar</button><button class=&quot;btn&quot; onclick=&quot;render()&quot;>Cancelar</button></div></div>'">Nueva partida</button></div>`;
 el.innerHTML=`<div class="stack" style="gap:1rem">
 <div class="card goldline prof">${emblem(S.g,64)}<div style="min-width:0;flex:1"><div class="pn">${esc(S.g.name)}</div>${estrellas(S.pres)}<div class="row" style="gap:.4rem;margin-top:.3rem">${divisa(S.g.div)}${hierroSVG(S.g.hierro,26,'var(--oro)')}<small class="muted">${S.g.enc}${S.g.prov?' · '+esc(S.g.prov):''}</small></div>
  <div class="row" style="gap:.5rem;margin-top:.4rem"><span class="lt">Nivel ${L.n}</span><span class="meter" style="width:120px"><i style="width:${L.p}%"></i></span></div></div><div class="ovrb"><b>${valoracion()}</b><small>VAL</small></div></div>
 <div class="chips">${tabs.map(([k,n])=>`<button class="chip" aria-pressed="${tab===k}" onclick="UI.perfil='${k}';render()">${n}</button>`).join('')}</div>
 ${body}</div>`}
ICO.copa='<svg class="ico" viewBox="0 0 24 24" fill="#e6bb55"><path d="M7 3h10v5a5 5 0 0 1-10 0zM5 4h2v2.5a3 3 0 0 1-3-3zM19 4h-2v2.5a3 3 0 0 0 3-3zM10.5 13h3v4h-3zM7.5 18h9v3h-9z"/></svg>';

/* arranque */
(function(){const sv=load();if(sv&&sv.animals&&sv.v===1){S=sv;if(!S.mej)S.mej=S.g.real?{placita:1,corrales:1,comederos:1,abrev:1,cercas:1,casa:1}:{};migrate(S)}render()})();
