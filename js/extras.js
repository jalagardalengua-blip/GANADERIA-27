/* ===================== AMPLIACIONES: ganaderías, encastes, pelajes, toreros y faenas del campo ===================== */

/* ---------- encastes nuevos ---------- */
Object.assign(ENC,{
 'Pablo Romero':{bra:72,nob:66,fue:74,cas:72,tra:94,m:1.06,pelos:['cárdeno','cárdeno claro','cárdeno','entrepelado'],d:'Los «toros guapos»: trapío imponente, caja pechuda y cárdenos claros.'},
 'Murube':{bra:66,nob:84,fue:58,cas:64,tra:72,m:.97,pelos:['negro','negro','castaño','negro mulato'],d:'Nobleza y fijeza: el toro del rejoneo.'},
 'Contreras':{bra:74,nob:68,fue:70,cas:76,tra:78,m:1.02,pelos:['negro','negro','colorado','burraco'],d:'Encaste minoritario de casta seria y codicia.'},
 'Vega-Villar':{bra:70,nob:64,fue:66,cas:78,tra:80,m:1.0,pelos:['berrendo en negro','sardo','chorreado','negro','berrendo en colorado'],d:'Pintas raras y embestidas encastadas: joyas para el torista.'},
 'Veragua':{bra:64,nob:62,fue:72,cas:70,tra:82,m:1.04,pelos:['jabonero','albahío','melocotón','colorado'],d:'Jaboneros y albahíos: un patrimonio genético casi perdido.'},
 'Saltillo':{bra:80,nob:58,fue:62,cas:84,tra:62,m:.93,pelos:['cárdeno','cárdeno claro','entrepelado'],d:'Cárdenos finos, de casta encendida y mucha movilidad.'}
});
Object.assign(ENCMORF,{'Pablo Romero':[1.06,1.02,1.12,1.0],Murube:[.98,.97,.9,.98],Contreras:[1,1,1.02,1],'Vega-Villar':[1.02,1.04,.98,1.04],Veragua:[1.04,1.06,.94,1.06],Saltillo:[.94,.95,.92,.96]});
Object.assign(PELO,{'berrendo en negro':['#ece6da','#171310',5],'berrendo en colorado':['#ece6da','#74351c',5],ensabanado:['#eee8dc','#faf6ee',0],sardo:['#6b3a22','#171310',6],chorreado:['#3a2416','#130e0b',7],
 'melocotón':['#d6b088','#ead0ad',0],tostado:['#3a2214','#5a3622',0],'albahío':['#e2d1ad','#f2e6cc',0],'cárdeno claro':['#7f8287','#b2b4b8',1],'negro mulato':['#1d1712','#4a3426',0]});
Object.assign(FAMP,{'berrendo en negro':'negro','berrendo en colorado':'colorado',ensabanado:'jabonero',sardo:'colorado',chorreado:'castano','melocotón':'jabonero',tostado:'castano','albahío':'jabonero','cárdeno claro':'cardeno','negro mulato':'negro'});
const _peloMat=peloMat;
peloMat=function(pelo){const d=PELO[pelo];if(!d||d[2]<5||PT[pelo])return _peloMat(pelo);
 const [base,hi,pat]=d,cv=document.createElement('canvas');cv.width=256;cv.height=128;const c=cv.getContext('2d'),r=mulberry(pelo.length*29);
 c.fillStyle=base;c.fillRect(0,0,256,128);
 if(pat===5){c.fillStyle=hi;for(let i=0;i<9;i++){c.beginPath();c.ellipse(r()*256,10+r()*70,14+r()*34,10+r()*26,r()*3,0,7);c.fill()}c.fillRect(0,0,256,14)}
 if(pat===6){for(let i=0;i<2600;i++){const k=r();c.fillStyle=k<.4?'#171310':k<.7?'#efe6d6':'#8a4a26';c.globalAlpha=.55;c.fillRect(r()*256,r()*128,2+r()*4,2+r()*3)}c.globalAlpha=1}
 if(pat===7){c.fillStyle=hi;for(let x=0;x<256;x+=6+r()*8){c.globalAlpha=.55+r()*.3;c.fillRect(x,0,2+r()*3,128)}c.globalAlpha=1}
 for(let i=0;i<1600;i++){c.fillStyle=`rgba(${r()<.5?'255,255,255':'0,0,0'},${.03+r()*.05})`;c.fillRect(r()*256,r()*128,1+r()*3,1)}
 PT[pelo]=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),roughness:.62});return PT[pelo]};

/* ---------- las 15 ganaderías históricas ---------- */
const GINFO={
 'Miura':{loc:'Lora del Río, Sevilla',d:'La más mítica del campo bravo: envergadura, seriedad y exigencia física. Corridas de máxima emoción.'},
 'Victorino Martín':{loc:'Moraleja, Cáceres',d:'Criadores del encaste Albaserrada: cárdenos de casta, fiereza y complejidad, ídolos del torista.'},
 'Juan Pedro Domecq':{loc:'Jerez de la Frontera, Cádiz',d:'Origen de la inmensa mayoría de las ganaderías actuales: entrega y nobleza.'},
 'Garcigrande':{loc:'Alaraz, Salamanca',d:'Hierro clave en las ferias del norte y del centro, habitual en los carteles de las figuras.'},
 'Victoriano del Río':{loc:'Guadalix de la Sierra, Madrid',d:'Sinónimo de regularidad y éxito en grandes ferias como Las Ventas.'},
 'Fuente Ymbro':{loc:'San José del Valle, Cádiz',d:'Intensidad, transmisión y motor en el ruedo.'},
 'Adolfo Martín':{loc:'Escurial, Cáceres',d:'Del mismo tronco que Victorino: cárdenos de lidia exigente para el aficionado castizo.'},
 'La Quinta':{loc:'Palma del Río, Córdoba',d:'Santa Coloma vía Buendía: toros grises de embestida humillada que piden técnica depurada.'},
 'Cuadri':{loc:'Trigueros, Huelva',d:'Negros enormes, de gran fuerza y poder.'},
 'Dolores Aguirre':{loc:'Navarra y Andalucía',d:'Atanasio-Conde de la Corte: toros duros y de mucha casta.'}};
const GNUEVAS=[
 {name:'Jandilla',enc:'Domecq',pres:76,div:['#2f6b3a','#bf3a3f'],loc:'Mérida, Badajoz',d:'Referente del encaste Domecq: bravura, movilidad y ritmo, también en los encierros de San Fermín.'},
 {name:'Núñez del Cuvillo',enc:'Domecq',pres:79,div:['#1f3f8a','#f1ece0'],loc:'Vejer de la Frontera, Cádiz',d:'Una de las divisas preferidas por las figuras por la clase y acometividad de sus toros.'},
 {name:'Alcurrucén',enc:'Núñez',pres:71,div:['#e6bb55','#141414'],loc:'Egido de Torredondo, Cáceres',d:'De los hermanos Lozano: toros de encaste Núñez que van de menos a más en la faena.'},
 {name:'Torrestrella',enc:'Domecq',pres:70,div:['#bf3a3f','#e6bb55'],loc:'Medina Sidonia, Cádiz',d:'Creada por Álvaro Domecq: jaboneros, berrendos y ensabanados de embestida dinámica.',pelos:['jabonero','berrendo en negro','ensabanado','berrendo en colorado','negro','colorado','melocotón']},
 {name:'Partido de Resina',enc:'Pablo Romero',pres:63,div:['#3a78b8','#f1ece0'],loc:'Aznalcázar, Sevilla',d:'El antiguo Pablo Romero: los «toros guapos», de imponente trapío y caja pechuda.'},
 {name:'Santiago Domecq',enc:'Domecq',pres:74,div:['#6b1d2b','#f1ece0'],loc:'Jerez de la Frontera, Cádiz',d:'Vacada en constante auge: casta exigente con entrega en la muleta.'},
 {name:'El Pilar',enc:'Domecq',pres:72,div:['#1f6b3a','#e6bb55'],loc:'Tamames, Salamanca',d:'Línea de Aldeanueva: profundidad y duración en sus embestidas.'},
 {name:'Zalduendo',enc:'Domecq',pres:70,div:['#141414','#e6bb55'],d:'Encaste Domecq: toros de clase, muy presentes en las ferias de figuras.'},
 {name:'Daniel Ruiz',enc:'Domecq',pres:68,div:['#1f6b3a','#141414'],loc:'Albacete',d:'Hierro albaceteño de origen Domecq, habitual en las ferias de Levante y La Mancha.'},
 {name:'Domingo Hernández',enc:'Domecq',pres:76,div:['#2c4f9e','#e6bb55'],loc:'Salamanca',d:'De la misma familia que Garcigrande: nobleza y calidad para las figuras.'},
 {name:'El Torero',enc:'Domecq',pres:70,div:['#bf3a3f','#f1ece0'],loc:'Cádiz',d:'Domecq de Salvador Domecq: toros encastados y con transmisión.'},
 {name:'Salvador Domecq',enc:'Domecq',pres:69,div:['#7a1b2a','#e6bb55'],loc:'Cádiz',d:'Rama de la dinastía Domecq en el campo gaditano.'},
 {name:'Pedraza de Yeltes',enc:'Domecq',pres:68,div:['#3a78b8','#141414'],loc:'Salamanca',d:'Toros serios y con motor, revelación en las ferias toristas.'},
 {name:'Hermanos García Jiménez',enc:'Domecq',pres:66,div:['#e6bb55','#1f3f8a'],loc:'Salamanca',d:'Divisa salmantina de origen Domecq.'},
 {name:'Montalvo',enc:'Domecq',pres:64,div:['#5b2a6e','#f1ece0'],loc:'Salamanca',d:'Ganadería salmantina de encaste Domecq.'},
 {name:'Puerto de San Lorenzo',enc:'Atanasio',pres:66,div:['#141414','#2c4f9e'],loc:'Salamanca',d:'Atanasio Fernández: toros grandes y de embestida larga.'},
 {name:'Valdefresno',enc:'Atanasio',pres:60,div:['#1f6b3a','#bf3a3f'],loc:'Salamanca',d:'Encaste Atanasio-Lisardo: casta y trapío.'},
 {name:'Conde de la Corte',enc:'Atanasio',pres:56,div:['#6b1d2b','#e6bb55'],d:'Hierro histórico del que nace una de las grandes líneas del campo bravo.'},
 {name:'José Escolar',enc:'Albaserrada',pres:62,div:['#3a3f4b','#bf3a3f'],d:'Albaserrada pura: cárdenos encastados para el aficionado torista.'},
 {name:'Baltasar Ibán',enc:'Contreras',pres:60,div:['#2c4f9e','#f1ece0'],loc:'Madrid',d:'El gran referente del encaste Contreras.'},
 {name:'Prieto de la Cal',enc:'Veragua',pres:52,div:['#e6bb55','#bf3a3f'],d:'Guardianes del encaste Veragua: jaboneros únicos en el campo bravo.',pelos:['jabonero','jabonero','albahío','melocotón','colorado']},
 {name:'Murube',enc:'Murube',pres:58,div:['#1f6b3a','#f1ece0'],d:'Origen del encaste que lleva su nombre: nobleza y fijeza.'},
 {name:'Fermín Bohórquez',enc:'Murube',pres:64,div:['#7a1b2a','#f1ece0'],loc:'Jerez de la Frontera, Cádiz',d:'Encaste Murube, referencia del toro de rejones.'},
 {name:'Ana Romero',enc:'Santa Coloma',pres:58,div:['#d58fb0','#141414'],d:'Santa Coloma: toros finos y encastados.'}];
for(const g of GANADERIAS)Object.assign(g,GINFO[g.name]||{});
for(const g of GNUEVAS)if(!GANADERIAS.some(x=>x.name===g.name))GANADERIAS.push(g);
const _startReal=startReal;
startReal=function(i){const g=GANADERIAS[i];_startReal(i);if(!S)return;if(g.loc)S.g.prov=g.loc.split(',').pop().trim();
 if(g.pelos)for(const a of S.animals)if(Math.random()<.75)a.pelo=pick(g.pelos);save();render()};

/* ---------- toreros ---------- */
const TOREROS_REALES=[
 {n:'Juan Belmonte',t:'#1d2f5e',e:'valiente'},{n:'Joselito «El Gallo»',t:'#7a1525',e:'poderoso'},{n:'Manolete',t:'#2b2b2b',e:'valiente'},
 {n:'Luis Miguel Dominguín',t:'#1f4a32',e:'poderoso'},{n:'Antonio Ordóñez',t:'#5a2a6e',e:'artista'},{n:'Curro Romero',t:'#ece6da',e:'artista'},
 {n:'Santiago Martín «El Viti»',t:'#2f3b4a',e:'tecnico'},{n:'Paco Camino',t:'#7a4a1e',e:'tecnico'},{n:'Manuel Benítez «El Cordobés»',t:'#c43f78',e:'tremendista'},
 {n:'Paquirri',t:'#1f6b3a',e:'poderoso'},{n:'José Tomás',t:'#6b1d2b',e:'valiente'},{n:'Enrique Ponce',t:'#2c4f9e',e:'tecnico'},
 {n:'Morante de la Puebla',t:'#8a6a2a',e:'artista'},{n:'Julián López «El Juli»',t:'#3a3f4b',e:'poderoso'},{n:'José María Manzanares',t:'#e6e2d8',e:'artista'},
 {n:'Rafael «El Gallo»',t:'#6b1d2b',e:'artista'},{n:'Domingo Ortega',t:'#2b2b2b',e:'poderoso'},{n:'Pepe Luis Vázquez',t:'#e6e2d8',e:'artista'},{n:'Antonio Bienvenida',t:'#1d2f5e',e:'tecnico'},
 {n:'Antoñete',t:'#2f3b4a',e:'artista'},{n:'Diego Puerta',t:'#7a1525',e:'valiente'},{n:'Rafael de Paula',t:'#ece6da',e:'artista'},{n:'Paco Ojeda',t:'#2b2b2b',e:'valiente'},
 {n:'Espartaco',t:'#1f4a32',e:'poderoso'},{n:'Joselito (José Miguel Arroyo)',t:'#5a2a6e',e:'tecnico'},{n:'Finito de Córdoba',t:'#8a6a2a',e:'artista'},{n:'Vicente Barrera',t:'#2c4f9e',e:'tecnico'},
 {n:'Francisco Rivera Ordóñez',t:'#3a3f4b',e:'valiente'},{n:'Sebastián Castella',t:'#1d2f5e',e:'valiente'},{n:'El Fandi',t:'#c43f78',e:'tremendista'},{n:'Miguel Ángel Perera',t:'#2b2b2b',e:'poderoso'},
 {n:'Alejandro Talavante',t:'#7a4a1e',e:'artista'},{n:'Cayetano',t:'#7a1525',e:'artista'},{n:'Daniel Luque',t:'#1f6b3a',e:'tecnico'},{n:'Diego Urdiales',t:'#5a2a6e',e:'artista'},
 {n:'Paco Ureña',t:'#6b1d2b',e:'valiente'},{n:'Emilio de Justo',t:'#2f3b4a',e:'valiente'},{n:'Andrés Roca Rey',t:'#1d2f5e',e:'poderoso'},{n:'Pablo Aguado',t:'#e6e2d8',e:'artista'},
 {n:'Juan Ortega',t:'#8a6a2a',e:'artista'},{n:'Tomás Rufo',t:'#2c4f9e',e:'poderoso'},{n:'Borja Jiménez',t:'#7a1525',e:'valiente'},{n:'Román',t:'#1f4a32',e:'valiente'}];
for(const t of TOREROS_REALES)if(!MATADORES.some(m=>m.n===t.n))MATADORES.push({...t,real:1});

/* ---------- faenas del campo: calendario real de una ganadería brava ---------- */
const FAENAS=[
 {id:'saneo',m:[0,1],n:'Saneamiento con el veterinario',t:'Pasar el ganado por la manga para el saneamiento (tuberculosis y brucelosis)',sp:[28,-16],dur:3,c:900,ok:'Saneamiento al día: la Junta da la carta verde para mover ganado.',mal:'Sin saneamiento hecho a tiempo: la Junta inmoviliza la ganadería y multa de 1.500 €.',pen:{money:1500,pres:1}},
 {id:'crotal',m:[2,3],n:'Crotalar a los becerros',t:'Crotalar y reseñar a los becerros recién nacidos (DIB)',sp:[-37,7],dur:2.5,c:400,ok:'Becerros crotalados y declarados en plazo.',mal:'Becerros sin crotalar en plazo: multa de 600 €.',pen:{money:600}},
 {id:'vacuna',m:[3,4],n:'Vacunas y desparasitado',t:'Vacunar de lengua azul y desparasitar en la manga',sp:[28,-16],dur:3,c:1200,ok:'Ganado vacunado y desparasitado: llega fuerte al verano.',mal:'Sin vacunar: un brote de lengua azul tumba a parte de la camada.',pen:{salud:8},bonus:{salud:2}},
 {id:'heno',m:[4,5],n:'Henificar',t:'Recoger las pacas de heno y meterlas en el pajar',sp:[-36,15],dur:4,c:1500,ok:'Pajar lleno: en invierno gastarás menos pienso.',mal:'Sin heno propio: el invierno saldrá más caro.',flag:'heno'},
 {id:'fundas',m:[5,6],n:'Enfundar pitones',t:'Enfundar los pitones de los utreros para que no se astillen',sp:[28,-16],dur:3,c:1100,ok:'Pitones enfundados: los toros llegarán íntegros a la plaza (+3 % en precio este año).',mal:'Sin fundas: se astillan pitones en las peleas.',flag:'fundas',pen:{salud:3}},
 {id:'agua',m:[6,7],n:'Charcas y abrevaderos',t:'Revisar charcas y abrevaderos con la calor',sp:[-36,-6],dur:2.5,c:500,ok:'Agua limpia y abundante en pleno verano.',mal:'Charcas secas y abrevaderos sucios: el ganado sufre el calor.',pen:{salud:3},bonus:{salud:1.5}},
 {id:'destete',m:[8,9],n:'Destete',t:'Destetar a los becerros: separarlos de sus madres',sp:[-37,7],dur:3,c:700,ok:'Destete hecho: las vacas se recuperan para la próxima paridera.',mal:'Destete tardío: las vacas llegan flojas a la cubrición.',pen:{salud:2},bonus:{salud:2}},
 {id:'siembra',m:[9,10],n:'Siembra de forraje',t:'Sembrar avena y veza para el invierno',sp:[6,-34],dur:4,c:1800,ok:'Forraje sembrado: menos pienso al final del invierno.',mal:'Sin siembra: tocará comprar más pienso.',flag:'siembra'},
 {id:'libro',m:[11],n:'Libro genealógico',t:'Declarar los nacimientos al Libro Genealógico en el despacho',sp:[0,9],dur:2,c:300,ok:'Libro genealógico al día.',mal:'Nacimientos sin declarar: la Asociación te sanciona.',pen:{pres:1.5}},
 {id:'ronda',m:[0,1,2,3,4,5,6,7,8,9,10,11],n:'Ronda a caballo',t:'Dar la ronda a caballo por el cercado de los toros',sp:[34,17],dur:2,c:0,ok:'Ronda hecha: el mayoral ve a tiempo a los que cojean.',mal:null,bonus:{les:1}}];
const fKey=()=>`${S.year}-${S.month}`;
function fDone(id){return !!(S.fae&&S.fae[fKey()]&&S.fae[fKey()][id])}
function fMark(id){S.fae=S.fae||{};const k=fKey();(S.fae[k]=S.fae[k]||{})[id]=1;const ks=Object.keys(S.fae);if(ks.length>14)delete S.fae[ks[0]]}
function fActivas(){if(!S)return [];return FAENAS.filter(f=>f.m.includes(S.month)&&!(f.m.length<12&&f.m.some(m=>m!==S.month&&S.fae&&S.fae[`${S.year}-${m}`]&&S.fae[`${S.year}-${m}`][f.id])))}
function fHacer(id,del){const f=FAENAS.find(x=>x.id===id);if(!f||fDone(id))return;if(del){S.money-=f.c;toast(`${f.n}: lo hace el mayoral · −${eur(f.c)}`)}else{S.xp=(S.xp||0)+10;S.conf=clamp((S.conf||50)+.5,0,100);toast(f.ok)}
 fMark(id);if(f.flag)S['f_'+f.flag]=S.year;if(f.bonus&&f.bonus.salud)for(const a of campo())a.salud=clamp(a.salud+f.bonus.salud,5,100);if(f.bonus&&f.bonus.les)for(const a of campo())if(a.lesion>0)a.lesion=Math.max(0,a.lesion-1);
 save();if(W3.mode==='finca'){W3.tasksKey='';rebuildFinca()}else render()}
function faenaYo(id){const f=FAENAS.find(x=>x.id===id);enter3D();if(!W3.F)return;const [x,z]=f.sp;W3.F.p.set(x+2.5,0,z+2.5);W3.F.carry=null;setCarry();W3.cam.position.set(x+6,4,z+8);if(f.ride)toast('Monta a caballo y acércate a la puerta del cercado de los toros')}
function faenasMes(rep){for(const f of FAENAS){if(!f.m.includes(S.month)||fDone(f.id))continue;const last=f.m[f.m.length-1]===S.month;if(!last||!f.mal)continue;
  const doneAny=f.m.some(m=>S.fae&&S.fae[`${S.year}-${m}`]&&S.fae[`${S.year}-${m}`][f.id]);if(doneAny)continue;
  const p=f.pen||{};if(p.money){S.money-=p.money;rep.cost+=p.money}if(p.pres)S.pres=clamp(S.pres-p.pres,0,100);if(p.salud)for(const a of campo())if(Math.random()<.4)a.salud=clamp(a.salud-p.salud,5,100);rep.lines.push(f.mal)}
 if([0,1,2].includes(S.month)&&S.f_siembra===S.year-1||[10,11,0,1].includes(S.month)&&(S.f_heno===S.year||S.f_heno===S.year-1&&S.month<=1)){const v=Math.round(campo().length*FEED[S.feed].c*.09);if(v>0){S.money+=v;rep.inc+=v;rep.lines.push(`Heno y forraje propios: ahorras ${eur(v)} de pienso.`)}}}
const _finTareas2=finTareas;finTareas=function(rep){_finTareas2(rep);try{faenasMes(rep)}catch(e){console.error(e)}};
const _priceFor=priceFor;priceFor=function(c,t){return r100(_priceFor(c,t)*(S&&S.f_fundas===S.year?1.03:1))};
const _listaTareas=listaTareas;
listaTareas=function(){const T=_listaTareas();for(const f of fActivas()){if(fDone(f.id))continue;T.push({t:f.t,p:`faenaYo('${f.id}')`,pl:'Hacerlo yo',d:f.c?`fHacer('${f.id}',1)`:null,dl:`Mayoral · ${eur(f.c)}`})}return T};
const _tareas3=tareas;
tareas=function(){const L=_tareas3();for(const f of fActivas())L.push({t:f.t,d:fDone(f.id)});return L};
const _rebuild=rebuildFinca;
rebuildFinca=function(){_rebuild.apply(this,arguments);if(W3.mode!=='finca'||!W3.scene||!W3.acts)return;const G=geos();
 for(const f of fActivas()){if(fDone(f.id))continue;const [x,z]=f.sp;const g=new THREE.Group();g.position.set(x,gH(x,z),z);W3.scene.add(g);
  mesh(G.cyl,M('#e6bb55',.35,.5),.06,2.4,.06,0,1.2,0,g,true);const fl=mesh(G.box,new THREE.MeshStandardMaterial({color:'#e6bb55',emissive:'#7a5a10',emissiveIntensity:.6}),.7,.42,.03,.36,2.2,0,g,true);
  W3.acts.push({x,z,r:3.6,l:f.n,hold:true,dur:f.dur,cond:()=>!fDone(f.id)&&(!f.ride||W3.ride),fn:()=>fHacer(f.id,false)})}};

const _render2=render;
render=function(){_render2();if(S)return;const bs=[...document.querySelectorAll('.gan')];bs.forEach((b,i)=>{const g=GANADERIAS[i];if(!g||!g.loc||b.dataset.x)return;b.dataset.x=1;const sm=b.querySelector('small');if(sm)sm.insertAdjacentHTML('afterend',`<small class="gloc">${esc(g.loc)}</small>`);if(g.d)b.title=g.d})};

/* ---------- arranque: refresca la interfaz con las ampliaciones ---------- */
(function(){try{if(S&&S.corro&&!S.corro.mkt)corroMkt()}catch(e){}render()})();
