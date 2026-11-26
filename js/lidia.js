/* ===================== LIDIA: juicio del toro, prestigio y sello de cada torero ===================== */
/* prestigio base de cada torero (0-100) y su sello en la plaza */
const TORB={
 'Juan Belmonte':[97,{tempo:1.2,cap:'verónicas a pies juntos: parar, templar y mandar',tipos:['naturales','derechazos'],rem:'Se queda quieto entre los pitones. Parar, templar y mandar: así nació el toreo moderno.'}],
 'Joselito «El Gallo»':[97,{tempo:1.05,band:1,cap:'lances de dominio y largas cambiadas',rem:'Remata con poder y sabiduría: el toro, rendido a sus pies.'}],
 'Manolete':[96,{tempo:1.15,st:'valiente',cap:'verónicas estatuarias, sin mover las zapatillas',tipos:['naturales','derechazos'],rem:'Manoletina final, vertical e inmóvil. Silencio sobrecogedor en los tendidos.'}],
 'Luis Miguel Dominguín':[94,{tempo:1.05,st:'poderoso',cap:'lances de figura, con dominio absoluto',rem:'Se arrodilla ante la cara del toro y alza el dedo: «el número uno».'}],
 'Antonio Ordóñez':[95,{tempo:1.25,st:'artista',cap:'verónicas de cadencia clásica',tipos:['naturales','derechazos'],rem:'Pase de pecho de clasicismo puro, de pitón a rabo.'}],
 'Curro Romero':[90,{tempo:1.4,st:'artista',cap:'verónicas lentísimas, con duende',rem:'Unos ayudados por alto de cartel: la plaza, en pie.'}],
 'Santiago Martín «El Viti»':[93,{tempo:1.15,st:'tecnico',cap:'lances sobrios y templados',rem:'Pase de pecho y se va con la compostura de siempre, sin mirar atrás.'}],
 'Paco Camino':[93,{tempo:1.2,st:'tecnico',cap:'verónicas de seda: el Niño Sabio de Camas',rem:'Remate de torería cabal: lo sabe todo del toro.'}],
 'Manuel Benítez «El Cordobés»':[90,{tempo:.95,st:'tremendista',cap:'lances heterodoxos y desplantes',tipos:['rodillas','circulares','derechazos'],rem:'¡El salto de la rana! El tendido enloquece.'}],
 'Paquirri':[91,{band:1,st:'poderoso',cap:'largas cambiadas y lances poderosos',rem:'Remata con poder: domina los tres tercios.'}],
 'José Tomás':[97,{tempo:1.25,st:'valiente',cap:'gaoneras y chicuelinas sin moverse',tipos:['naturales','derechazos','naturales'],rem:'Quietud absoluta: el pitón le roza la taleguilla y no se mueve.'}],
 'Enrique Ponce':[93,{tempo:1.2,st:'tecnico',cap:'verónicas templadísimas',tipos:['derechazos','naturales','poncinas'],rem:'Poncinas con la rodilla flexionada: magisterio de tres décadas.'}],
 'Morante de la Puebla':[95,{tempo:1.38,st:'artista',cap:'verónicas y medias de otra época, chicuelinas de mano baja',tipos:['naturales','derechazos'],rem:'Trincherilla y kikirikí: toreo barroco, de otro tiempo.'}],
 'Julián López «El Juli»':[93,{tempo:1.1,st:'poderoso',cap:'lopecinas y lances largos',tipos:['derechazos','naturales','circulares'],rem:'Le baja la mano y lo somete: poder de figura.'}],
 'José María Manzanares':[91,{tempo:1.22,st:'artista',cap:'verónicas de empaque',est:1,rem:'Pase de pecho de largo trazo, con la planta de su padre.'}],
 'Rafael «El Gallo»':[88,{tempo:1.3,st:'artista',cap:'lances de genio y espantadas de leyenda',rem:'Un remate genial e imprevisible: así era «el Divino Calvo».'}],
 'Domingo Ortega':[90,{st:'poderoso',cap:'lances de dominio por bajo',rem:'Doblones por bajo: lleva al toro donde quiere.'}],
 'Pepe Luis Vázquez':[89,{tempo:1.3,st:'artista',cap:'verónicas de gracia sevillana',rem:'Remate de pellizco y gracia.'}],
 'Antonio Bienvenida':[88,{tempo:1.15,st:'tecnico',cap:'lances de escuela',rem:'Remate de maestro: elegancia de los Bienvenida.'}],
 'Antoñete':[88,{tempo:1.3,st:'artista',cap:'lances de distancia y temple',rem:'Le da distancia y lo cita de lejos: el toreo de siempre.'}],
 'Diego Puerta':[86,{st:'valiente',cap:'lances de raza',rem:'Valor seco, sin trampa.'}],
 'Rafael de Paula':[86,{tempo:1.4,st:'artista',cap:'verónicas que paran el tiempo',rem:'Una media verónica que nadie olvidará.'}],
 'Paco Ojeda':[88,{st:'valiente',cap:'lances encerrado en terrenos imposibles',rem:'Encerrado entre los pitones, sin enmendarse.'}],
 'Espartaco':[88,{st:'poderoso',cap:'lances de entrega',rem:'Remata con la entrega de siempre.'}],
 'Joselito (José Miguel Arroyo)':[89,{tempo:1.15,st:'tecnico',cap:'verónicas de pureza',rem:'Pureza y verdad en el remate.'}],
 'Finito de Córdoba':[84,{tempo:1.3,st:'artista',cap:'verónicas de seda',rem:'Remate de empaque cordobés.'}],
 'Vicente Barrera':[80,{tempo:1.15,st:'tecnico',cap:'lances templados',rem:'Remate de torero valenciano.'}],
 'Francisco Rivera Ordóñez':[80,{st:'valiente',band:1,cap:'largas cambiadas',rem:'Remate con raza de dinastía.'}],
 'Sebastián Castella':[86,{st:'valiente',cap:'cambiados por la espalda',rem:'Quietud de piedra: el toro pasa rozando.'}],
 'El Fandi':[82,{band:1,st:'tremendista',cap:'largas cambiadas de rodillas',rem:'Remata de rodillas, con el público en pie.'}],
 'Miguel Ángel Perera':[87,{st:'valiente',tipos:['derechazos','circulares'],cap:'lances ceñidos',rem:'Péndulos y circulares sin enmendarse.'}],
 'Alejandro Talavante':[87,{tipos:['cambiados','naturales','derechazos'],cap:'chicuelinas y tafalleras',rem:'Un cambiado por la espalda sorprende al tendido.'}],
 'Cayetano':[80,{tempo:1.2,st:'artista',cap:'verónicas de dinastía',rem:'Remate de empaque.'}],
 'Daniel Luque':[87,{tempo:1.15,st:'tecnico',cap:'lances de muñeca',rem:'Las luquecinas: invento propio en el remate.'}],
 'Diego Urdiales':[85,{tempo:1.35,st:'artista',cap:'verónicas de cánones clásicos',rem:'Remate de pureza riojana.'}],
 'Paco Ureña':[84,{st:'valiente',cap:'lances de verdad',rem:'Se cruza al pitón contrario, con verdad.'}],
 'Emilio de Justo':[86,{st:'valiente',cap:'lances de raza',rem:'Remate con hondura.'}],
 'Andrés Roca Rey':[93,{st:'valiente',tipos:['rodillas','derechazos','circulares'],cap:'cambiados de rodillas en los medios',rem:'Péndulos ajustadísimos y desplante a un palmo de los pitones.'}],
 'Pablo Aguado':[85,{tempo:1.38,st:'artista',cap:'verónicas sevillanas de mano baja',rem:'Remate de pellizco sevillano.'}],
 'Juan Ortega':[85,{tempo:1.4,st:'artista',cap:'verónicas de compás lento',rem:'Un remate de pura belleza.'}],
 'Tomás Rufo':[84,{st:'poderoso',cap:'lances largos',rem:'Remata con poder.'}],
 'Borja Jiménez':[85,{st:'valiente',cap:'largas cambiadas',rem:'Remata con raza.'}],
 'Román':[78,{st:'valiente',cap:'lances de valor',rem:'Remate de valor valenciano.'}]};
const torBase=n=>{if(TORB[n])return TORB[n][0];if(NOVILLEROS.some(x=>x.n===n))return 52+((n.length*7)%10);if(n===SOBRE.n)return 50;let h=0;for(const ch of n)h=(h*31+ch.charCodeAt(0))>>>0;return 66+h%13};
function torPres(n){const t=S&&S.tor&&S.tor[n];return t?t.pres:torBase(n)}
matRating=function(n){return Math.round(torPres(n))};
const torSello=n=>TORB[n]?TORB[n][1]:null;

/* ---------- juicio del toro: nota de 0 a 10 por su juego, no por las orejas ---------- */
function juzgar(t,o){if(t.res==='devuelto'){t.nota=0;t.juicio='Devuelto a los corrales por falta de fuerza.';return}
 const min=MINPESO[o.tipo][o.cat],m=t.m||{},B=t.B,N=t.N,C=t.C,F=t.F;
 const pres=clamp(6+(t.peso-min)/25+((m.hl||1)-.9)*4,3,10),varas=clamp((B-38)/5.6+(t.derribo?.6:0)+(t.entradas-1)*.4,1,10),muleta=clamp((N-36)/5.8+(t.rec-.5)*1.6-(t.corto?1.2:0)-(t.rajado?2.5:0),1,10),
  casta=clamp((C-38)/5.6+(t.cogida?.5:0),1,10),fuerza=clamp((F-30)/6-(t.fell?1.2:0),1,10);
 let nota=.35+varas*.28+muleta*.32+casta*.2+fuerza*.1+pres*.1;
 if(t.cogida&&N<58)nota-=.3;
 t.nota=Math.round(clamp(nota,0,10)*10)/10;t.nv={pres,varas,muleta,casta,fuerza};
 const f=[];f.push(varas>=8?`bravo en varas (${t.entradas} entradas${t.derribo?', derribó':''})`:varas>=6?'cumplió en el caballo':'manseó en varas');
 f.push(muleta>=8?'humillado y con recorrido en la muleta':muleta>=6?'noble aunque sin terminar de entregarse':t.corto?'se quedó corto y protestó':'deslucido en la muleta');
 f.push(casta>=8?'mucha casta y emoción':casta>=6?'casta suficiente':'poca casta');if(t.fell)f.push('perdió las manos');if(t.rajado)f.push('se rajó buscando tablas');
 if(t.cogida)f.push(N<58?`prendió a ${t.mat}: desarrolló sentido y buscó al hombre`:`prendió a ${t.mat} por su casta, sin maldad`);
 t.juicio=f.join('; ')+'.'}

/* ---------- lidia con torero, prestigio y juicio ---------- */
const _lidiar=lidiar;
lidiar=function(a,o,mat){const t=_lidiar(a,o,mat);const rt=torPres(mat.n);t.trp=Math.round(rt);
 if(t.res!=='devuelto'){
  if(t.cogida&&Math.random()<clamp((rt-72)/70,0,.35)&&t.estilo!=='valiente'&&t.estilo!=='tremendista')delete t.cogida;
  const tor=(rt-76)/10;if(!t.avisos&&(t.ent||1)<=2){if(tor>0&&t.trof<2&&Math.random()<tor*.32)t.trof++;if(tor<0&&t.trof>0&&Math.random()<-tor*.4)t.trof--}
  juzgar(t,o);
  if(t.res!=='indulto'||t.nota<8.8){t.res=t.nota>=8.3?'vuelta':t.nota>=6.9?'ovacion':t.nota>=5?'silencio':'pitos';if(t.res==='pitos'&&t.trof>0)t.res='silencio';if(t.res==='indulto')t.trof=Math.min(t.trof,2)}
  t.score=Math.max(t.score*0.4+t.nota*6,0);
  t.car=t.B>82?'Se arranca de largo, con fijeza':t.B<60?'Sale suelto y escarba':t.N>78?'Humilla desde el primer capotazo':t.C>80?'Mira y mide: encastado':t.F<50?'Justo de fuerzas, flojea':'Sale con son';
 }else juzgar(t,o);
 return t};
nota10=function(t){return t.res==='devuelto'?'—':(t.nota!=null?t.nota:clamp((t.score||60)/10,0,10)).toFixed(1)};

/* ---------- prestigio de los toreros a lo largo de tu carrera ---------- */
const _celebrar=celebrar;
celebrar=function(o){const r=_celebrar(o);S.tor=S.tor||{};
 for(const t of r.toros){const who=t.cogida&&t.sust?[t.mat,t.sust.n]:[t.mat];for(const n of who){const T=S.tor[n]=S.tor[n]||{pres:torBase(n),f:0,ore:0,cog:0,ind:0,pu:0};}
  const T=S.tor[t.mat];T.f++;if(t.cogida){T.cog++;T.pres=clamp(T.pres-.4,30,99)}
  const kill=t.cogida&&t.sust?S.tor[t.sust.n]:T;kill.ore+=t.trof||0;if(t.res==='indulto')kill.ind++;
  kill.pres=clamp(kill.pres+(t.trof||0)*.6*(o.cat===1?1.4:1)-(t.avisos?.4:0)+(t.res==='indulto'?2:0)-(t.trof===0&&t.nota>=7.5?.3:0),30,99);
  if(o.cat===1&&t.trof>=2)kill.pu++}
 const bn=r.toros.filter(t=>t.nota!=null);if(bn.length){const m=bn.reduce((s,t)=>s+t.nota,0)/bn.length;r.notaMedia=Math.round(m*10)/10;const extra=Math.round((m-6.5)*.35*CATMUL[o.cat]*10)/10;S.pres=clamp(S.pres+extra,0,100);r.dp=Math.round((r.dp+extra)*10)/10}
 return r};
/* escalafón de matadores en la pestaña de ofertas */
const _renderOfertasL=renderOfertas;
renderOfertas=function(el){_renderOfertasL(el);const L=MATADORES.map(m=>({n:m.n,e:m.e,p:torPres(m.n),s:S.tor&&S.tor[m.n]})).sort((a,b)=>b.p-a.p).slice(0,20);
 const d=document.createElement('section');d.className='sect';d.innerHTML=`<header><h2>Escalafón de matadores</h2><span class="sp"></span><small class="muted">prestigio en tu carrera</small></header><div class="tw"><table class="t"><tr><th>#</th><th>Matador</th><th>Pres.</th><th>Or.</th></tr>${L.map((m,i)=>`<tr><td>${i+1}</td><td><b>${esc(m.n)}</b><br><small class="muted">${ESTILO[(torSello(m.n)||{}).st||m.e]||''}</small></td><td class="num"><b>${Math.round(m.p)}</b></td><td class="num">${m.s?m.s.ore:0}</td></tr>`).join('')}</table></div>`;
 (el.firstElementChild||el).appendChild(d)};

/* ---------- sello de cada torero en la plaza 3D ---------- */
let LID={mat:null,sust:null};
const _buildGuion=buildGuion;buildGuion=function(t,first,C){LID={mat:t.mat,sust:t.sust?t.sust.n:null,t};return _buildGuion(t,first,C)};
const selloP=(P,s)=>s&&s.tempo?{...P,gal:P.gal/s.tempo}:P;
const _actCapote=actCapote;actCapote=function(P,n,chic,mat,cut){const s=torSello(mat);const o=_actCapote(selloP(P,s),n,chic,mat,cut);if(s&&s.cap)o.cap=`${mat} recibe con el capote: ${s.cap}${P.corto?'. El toro se queda corto y obliga a enmendarse.':P.rec>.7?', con el toro humillado.':'.'}`;return o};
const _actSerie=actSerie;actSerie=function(P,tipo,np,who,st,coger,cae,music){const n=who==='s2'?LID.sust:LID.mat,s=torSello(n);let tp=tipo,extra=null;
 if(s&&s.tipos&&tipo!=='tablas'){const k=(LID.k=(LID.k||0)+1);tp=s.tipos[k%s.tipos.length]}
 if(tp==='poncinas'){tp='rodillas';extra='Poncinas, con la rodilla flexionada'}if(tp==='cambiados'){tp='circulares';extra='Cambiado por la espalda y ligazón'}
 const o=_actSerie(selloP(P,s),tp,np,who,(s&&s.st)||st,coger,cae,music);if(extra)o.cap=o.cap.replace(/^[^.:]+/,extra);if(s&&s.tempo>=1.25&&!P.corto)o.cap+=' Temple de seda: el toro va a cámara lenta.';return o};
const _actRemate=actRemate;actRemate=function(P,who,st,last){const n=who==='s2'?LID.sust:LID.mat,s=torSello(n);const o=_actRemate(P,who,(s&&s.st)||st,last);if(s&&s.rem)o.cap=s.rem;return o};
const _actBand=actBanderillas;actBanderillas=function(P){const o=_actBand(P);const s=torSello(LID.mat);if(s&&s.band)o.cap=`${LID.mat} coge los palos y banderillea él mismo: al cuarteo, de poder a poder y al violín. ¡La plaza, en pie!`;return o};
const _actEst=actEstocada;actEstocada=function(t,killer,kname){const o=_actEst(t,killer,kname);const s=torSello(kname);if(s&&s.est)o.cap=`${kname} entra a matar recibiendo, sin moverse: ${o.cap}`;return o};
const _actSalida=actSalida;actSalida=function(t,P,desc,x){const o=_actSalida(t,P,desc,x);if(t.car)o.cap=`${o.cap} ${t.car}.`;return o};
/* juicio en el resumen final de la plaza */
const _cpEnd=cpEnd;cpEnd=function(){_cpEnd();const r=CP&&CP.r;const box=$('#h3dim .cartel');if(!r||!box)return;const d=document.createElement('div');d.className='juicio';
 d.innerHTML=`<span class="lbl">Juicio de los toros${r.notaMedia!=null?` · media ${r.notaMedia}`:''}</span>${r.toros.map(t=>`<div><b>${esc(t.name)} · ${nota10(t)}</b><small>${esc(t.juicio||'')}</small></div>`).join('')}`;box.insertBefore(d,box.querySelector('button'))};
