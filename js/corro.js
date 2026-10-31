/* ===================== GANADERÍA DE CORRO · BOUS AL CARRER =====================
   Segunda casa ganadera, sincronizada con la de bravo: mismo dinero, mismo calendario,
   misma finca (placita de tientas) y traspaso de animales entre las dos. */

const PUEBLOS=[
 ['Burriana','Castellón',3,'Fiestas de la Misericòrdia',[8]],['Vila-real','Castellón',3,'Fiestas de Sant Pasqual',[4]],['Almassora','Castellón',2,'Fiestas de Santa Quitèria',[4]],
 ['Onda','Castellón',2,'Fiestas patronales',[]],['Cabanes','Castellón',1,'Fiestas patronales',[]],['Torreblanca','Castellón',1,'Fiestas de agosto',[7]],['Benicarló','Castellón',2,'Fiestas de Sant Bartomeu',[7]],
 ['Vinaròs','Castellón',2,'Fiestas de Sant Joan i Sant Pere',[5]],['Peñíscola','Castellón',1,'Fiestas patronales',[8]],['Segorbe','Castellón',2,'Entrada de Toros y Caballos',[8]],
 ['Nules','Castellón',2,'Fiestas patronales',[]],['Moncofa','Castellón',1,'Fiestas de agosto',[7]],['La Vall d\'Uixó','Castellón',2,'Fiestas patronales',[]],['Betxí','Castellón',1,'Fiestas patronales',[]],
 ['L\'Alcora','Castellón',1,'Fiestas patronales',[]],['Borriol','Castellón',1,'Fiestas patronales',[]],['Alcalà de Xivert','Castellón',1,'Fiestas patronales',[]],['Benicàssim','Castellón',1,'Fiestas patronales',[]],
 ['Meliana','Valencia',1,'Fiestas patronales',[]],['Museros','Valencia',1,'Fiestas patronales',[]],['Puçol','Valencia',2,'Fiestas patronales',[]],['Massamagrell','Valencia',1,'Fiestas patronales',[]],
 ['Foios','Valencia',1,'Fiestas patronales',[]],['Alboraia','Valencia',2,'Fiestas patronales',[]],['Llíria','Valencia',2,'Fiestas patronales',[]],['Chiva','Valencia',2,'Semana de toros',[7]],
 ['Ontinyent','Valencia',2,'Bous en corda',[]],['Sueca','Valencia',2,'Fiestas patronales',[]],['El Puig','Valencia',1,'Fiestas patronales',[]],['Sagunt','Valencia',3,'Fiestas patronales',[]],
 ['Dénia','Alicante',3,'Bous a la mar',[6]],['Pedreguer','Alicante',1,'Fiestas patronales',[]],['Xàbia','Alicante',2,'Fogueres de Sant Joan',[5]],['La Romana','Alicante',1,'Fiestas de agosto',[7]]];

/* tipos de festejo: req = animales que pide; pago base en euros por el servicio completo (orientativo) */
const FEST={
 vaquillas:{n:'Tarde de vaquillas',nn:'Nit de vaquetes',req:{vaca:5,toro:1,cabestro:1},pago:[2400,4600],w:45,ic:'🐄'},
 embolado:{n:'Bou embolat',req:{toro:1},pago:[1900,3600],w:24,night:true,minT:3},
 capea:{n:'Capea de becerros',req:{becerro:3},pago:[700,1400],w:10},
 cerril:{n:'Exhibición de toro cerril',req:{cerril:1},pago:[4200,7500],w:8},
 encierro:{n:'Encierro',req:{toro:2,cabestro:2},pago:[2600,5200],w:5},
 corda:{n:'Bou en corda',req:{toro:1},pago:[1500,3000],w:3},
 mar:{n:'Bous a la mar',req:{vaca:4,toro:1},pago:[3200,5600],w:1,meses:[6,7],costa:['Dénia','Xàbia','Benicarló','Vinaròs','Peñíscola']},
 concurso:{n:'Concurso de recortadores',req:{vaca:6},pago:[3800,7600],w:4,minP:30,plaza:true}
};
const SEASON_W=[.35,.25,.45,.5,.75,.9,1.5,2.3,1.7,.9,.25,.15];

/* ganaderías de corro de la Comunitat Valenciana (nombres reales; plantillas y cifras del juego, orientativas) */
const CORRO_REAL=[
 {name:'Germán Vidal',pueblo:'Cabanes',l:'GV',div:['#1f6b3a','#f1ece0'],pres:84,n:[22,4,8,3],fam:['Koreana','Serena','Castilla','Peruana','Pajarita'],tor:['Avión','Fariseo'],d:'Tres generaciones de ganado bravo en Cabanes, desde 1914. Referente del bou al carrer en Castellón.'},
 {name:'Fernando Machancoses',pueblo:'Cheste',l:'FM',div:['#bf3a3f','#e6bb55'],pres:80,n:[24,4,9,3],tor:['Alcalde'],d:'Saga fundada en 1941 por Vicente Machancoses Aguado en la finca La Vinagra (Cheste). Hierro rojo y amarillo; premiada por la Generalitat.'},
 {name:'Vicente Machancoses',pueblo:'Cheste',l:'VM',div:['#bf3a3f','#e6bb55'],pres:74,n:[18,3,7,3],d:'Rama de la saga Machancoses de Cheste, de vacas móviles, bravas y con sentido.'},
 {name:'Los Chatos',pueblo:'Torreblanca',l:'CH',div:['#141414','#e6bb55'],pres:76,n:[18,3,6,2],d:'Línea histórica de las vacas de corro valencianas.'},
 {name:'Gerardo Gamón',pueblo:'Comunitat Valenciana',l:'GG',div:['#5b2a6e','#f1ece0'],pres:66,n:[14,2,5,2],d:'Ganadería de corro habitual en las calles de Castellón.'},
 {name:'Miguel Parejo',pueblo:'Comunitat Valenciana',l:'MP',div:['#d9792b','#141414'],pres:60,n:[12,2,4,2],d:'Corro joven con vacas de mucho sentido.'},
 {name:'Peris',pueblo:'Valencia',l:'P',div:['#6b1d2b','#e6bb55'],pres:70,n:[16,3,6,2],d:'Fundada en 1890: la línea valenciana más influyente.'},
 {name:'La Paloma',pueblo:'Xaló',l:'LP',div:['#f1ece0','#1f3f8a'],pres:79,n:[18,3,6,2],fam:['Morenita'],d:'Ganó las Nits de Concurs de Calp con la mejor vaca del concurso, Morenita.'},
 {name:'Hermanos Cali',pueblo:'Moixent',l:'HC',div:['#1f6b3a','#e6bb55'],pres:70,n:[16,3,5,2],d:'Tercera en las Nits de Concurs de Calp; exhibiciones de toros en Enguera y La Romana.'},
 {name:'Vicente Benavent',pueblo:'Comunitat Valenciana',l:'VB',div:['#2c4f9e','#f1ece0'],pres:73,n:[18,3,6,2],d:'Saga Benavent: segunda en las Nits de Concurs de Calp.'},
 {name:'Hermanos Benavent',pueblo:'Comunitat Valenciana',l:'HB',div:['#2c4f9e','#bf3a3f'],pres:66,n:[14,2,5,2],d:'Otra rama de la familia Benavent, habitual en las fiestas de Viver.'},
 {name:'Hermanos Asensi',pueblo:'Comunitat Valenciana',l:'HA',div:['#d9792b','#141414'],pres:66,n:[14,2,5,2],d:'Corro presente en los concursos de la Marina Alta.'},
 {name:'La Templanza',pueblo:'Calp',l:'LT',div:['#5b2a6e','#e6bb55'],pres:62,n:[12,2,4,2],d:'Premio a la mejor suelta de tarde en las fiestas de Calp.'},
 {name:'Hermanos Navarré',pueblo:'Comunitat Valenciana',l:'HN',div:['#141414','#f1ece0'],pres:62,n:[12,2,4,2],d:'Corro habitual en las calles de Nules.'},
 {name:'Daniel Machancoses',pueblo:'Comunitat Valenciana',l:'DM',div:['#bf3a3f','#e6bb55'],pres:64,n:[14,2,5,2],d:'Otro hierro de la saga Machancoses.'},
 {name:'Daniel Sánchez',pueblo:'Comunitat Valenciana',l:'DS',div:['#3a78b8','#e6bb55'],pres:58,n:[12,2,4,2],d:'Ganadería que compite en los concursos de vacas de la Marina.'},
 {name:'Alberto Garrido',pueblo:'Comunitat Valenciana',l:'AG',div:['#2d6b4b','#f1ece0'],pres:56,n:[12,2,4,2],d:'Corro joven que se mide en los concursos de Calp.'},
 {name:'El Saliner',pueblo:'Comunitat Valenciana',l:'ES',div:['#f1ece0','#3a78b8'],pres:58,n:[12,2,4,2],d:'Habitual en las fiestas de Puçol.'},
 {name:'El Salero',pueblo:'Comunitat Valenciana',l:'SA',div:['#e6bb55','#bf3a3f'],pres:60,n:[12,2,4,2],d:'Corro de Enguera; famoso su desafío frente a La Paloma en La Romana.'},
 {name:'Gregorio de Jesús',pueblo:'Comunitat Valenciana',l:'GJ',div:['#6b1d2b','#f1ece0'],pres:56,n:[12,2,4,2],d:'Sueltas de vaquillas en Enguera y La Romana.'},
 {name:'La Espuela',pueblo:'Comunitat Valenciana',l:'LE',div:['#141414','#bf3a3f'],pres:60,n:[12,2,4,2],d:'Corro del interior de Castellón, habitual en Los Rosildos.'},
 {name:'El Cid',pueblo:'Comunitat Valenciana',l:'EC',div:['#1f3f8a','#bf3a3f'],pres:56,n:[12,2,4,2],d:'Corro habitual en las fiestas de Viver.'},
 {name:'Hermanos Infantes',pueblo:'Comunitat Valenciana',l:'HI',div:['#2d6b4b','#e6bb55'],pres:54,n:[10,2,4,2],d:'Sueltas en Nules y la Plana Baixa.'},
 {name:'Madroñiz',pueblo:'Comunitat Valenciana',l:'MZ',div:['#8a2f2a','#e6bb55'],pres:54,n:[10,2,4,2],d:'Corro de la Plana, habitual en Nules.'},
 {name:'Iván Meseguer',pueblo:'Comunitat Valenciana',l:'IM',div:['#3a3f4b','#e6bb55'],pres:52,n:[10,2,4,2],d:'Sale en las fiestas de Los Rosildos.'},
 {name:'Teodoro García Gamón',pueblo:'Comunitat Valenciana',l:'TG',div:['#5b2a6e','#bf3a3f'],pres:56,n:[12,2,4,2],d:'Sueltas en Caudiel y el Alto Palancia.'},
 {name:'Juan Aborrán',pueblo:'Comunitat Valenciana',l:'JA',div:['#d58fb0','#141414'],pres:52,n:[10,2,4,2],d:'Corro habitual en Massamagrell y l\'Horta Nord.'},
 {name:'Fernando Mansilla',pueblo:'Comunitat Valenciana',l:'FS',div:['#2c4f9e','#e6bb55'],pres:54,n:[10,2,4,2],d:'Sale en las fiestas de Burriana.'},
 {name:'Hermanos Navarro Morell',pueblo:'Comunitat Valenciana',l:'NM',div:['#1f6b3a','#bf3a3f'],pres:54,n:[10,2,4,2],d:'Sueltas en Burriana y la Plana.'},
 {name:'Juan Faet',pueblo:'Castellón',l:'JF',div:['#bf3a3f','#1f6b3a'],pres:52,n:[10,2,4,2],d:'Corro de la capital de la Plana.'}
];
const CNOMH=['Koreana','Serena','Castilla','Peruana','Pajarita','Chispa','Lunera','Morita','Gitanilla','Rubia','Pantera','Bruja','Centella','Paloma','Saeta','Tormenta','Golondrina','Canela','Valenciana','Ratita','Tómbola','Pulga','Avispa','Fiera','Perla','Rosalía','Cartuja','Montera','Faraona','Lagartija','Pólvora','Duquesa','Marquesa','Torera','Sultana','Bengala','Zíngara','Caramelo','Charrita','Mora','Molinera','Africana','Flamenca','Revoltosa','Rumbera'];
const CNOMM=['Avión','Fariseo','Rayo','Ciclón','Barquero','Tabaquero','Cartucho','Volcán','Huracán','Bandido','Matacán','Petardo','Pirata','Comanche','Trueno','Cohete','Lucero','Marinero','Pregonero','Zorro','Carbonero','Torbellino'];
const CPELOS=['negro','negro','negro','colorado','castaño','cárdeno','entrepelado','jabonero','berrendo en negro','berrendo en colorado','sardo','chorreado','melocotón','burraco'];
const LUCTXT=l=>l>=86?'Extraordinaria':l>=76?'Muy buena':l>=66?'Buena':l>=54?'Floja':'Mansa';
const CORRO_INV={
 camion:{n:'Camión de ganado',max:2,c:[38000,70000],d:['Camión propio: el porte baja de 450 € a 150 € por festejo.','Segundo camión y remolque: puedes servir dos festejos el mismo fin de semana sin perder calidad.']},
 corral:{n:'Corrales del corro',max:2,c:[25000,55000],d:['Corrales y manga móvil: +20 cabezas y las vacas descansan mejor.','Nave de corrales con sombra y agua: +40 cabezas y más salud en verano.']},
 mayoral:{n:'Mayoral de corro',max:1,c:[18000],d:['Un mayoral de confianza dirige el corro en la calle: menos lesiones y mejor lucimiento cuando no vas tú.']},
 cabestraje:{n:'Cabestraje',max:2,c:[9000,16000],d:['Cabestros bien enseñados: la recogida es rápida y no se resabian las vacas.','Parada de cabestros con cencerros: encierros y entradas más limpias.']},
 publi:{n:'Peñas y redes',max:2,c:[8000,20000],d:['Presencia en las peñas: más contratos cada mes.','Vídeos y retransmisiones: más contratos y mejor caché.']},
 seguro:{n:'Seguro y papeles',max:1,c:[6000],d:['Registro, saneamiento y seguro de responsabilidad al día: acceso a concursos en plaza y menos sustos.']}
};

let CU={filt:'vaca'};
const cLv=k=>S&&S.corro&&S.corro.inv?(+S.corro.inv[k]||0):0;
const cAnim=()=>S.corro?S.corro.an:[];
const cById=id=>cAnim().find(a=>a.id===id);
const cAge=a=>Math.max(0,Math.floor(((S.year-a.born)*12+S.month-2)/12));
const cAgeM=a=>(S.year-a.born)*12+S.month-2;
function cTipo(a){if(a.tipo==='cabestro'||a.tipo==='semental')return a.tipo;const m=cAgeM(a);if(m<24)return 'becerro';return a.sex==='H'?'vaca':'toro'}
const TIPOTXT={vaca:'Vaca',toro:'Toro',becerro:'Becerro',cabestro:'Cabestro',semental:'Semental'};
function cG(base){const o={};for(const k of ['bra','nob','fue','res','sen'])o[k]=Math.round(clamp((base[k]??60)+gauss()*8,15,99));return o}
function cNew(o){const C=S.corro;C.nid=(C.nid||1);const a={id:C.nid++,name:o.name,num:o.num??RI(1,99),sex:o.sex,tipo:o.tipo||null,born:o.born,pelo:o.pelo||pick(CPELOS),
 g:o.g||cG({bra:62,nob:60,fue:62,res:60,sen:o.sen??20}),fama:o.fama??RI(5,30),sal:o.sal??0,salMes:0,salud:100,lesion:0,peso:o.peso||(o.sex==='H'?380:520),nota:o.nota??null,tentado:!!o.tentado,cerril:!!o.cerril,anillas:0,orig:o.orig||C.name};
 if(a.sen==null)a.g.sen=a.g.sen;C.an.push(a);return a}
function corroLuc(a){const g=a.g;let v=9+g.bra*.4+g.fue*.18+g.res*.14+Math.min(g.sen,85)*.12+a.fama*.08+g.nob*.08;if(a.salud<70)v-=(70-a.salud)*.3;if(a.salMes>3)v-=(a.salMes-3)*4;return v}

/* ---------- creación / compra ---------- */
function corroSeed(C,n,fam,tor,base){const [nv,nt,nb,nc]=n,yr=S.year;const usedH=new Set(fam||[]),usedM=new Set(tor||[]);
 const nmH=()=>{let x;do x=pick(CNOMH);while(usedH.has(x)&&usedH.size<CNOMH.length);usedH.add(x);return x};
 const nmM=()=>{let x;do x=pick(CNOMM);while(usedM.has(x)&&usedM.size<CNOMM.length);usedM.add(x);return x};
 (fam||[]).forEach(nm=>cNew({name:nm,sex:'H',born:yr-RI(6,11),g:cG({...base,bra:base.bra+8,sen:62}),fama:RI(60,88),sal:RI(60,180),tentado:true,nota:RI(80,92)}));
 for(let i=(fam||[]).length;i<nv;i++){const y=RI(3,12);cNew({name:nmH(),sex:'H',born:yr-y,g:cG({...base,sen:clamp(15+y*6,15,90)}),fama:RI(5,25)+y*3,sal:y*RI(10,18),tentado:true,nota:RI(62,86)})}
 (tor||[]).forEach(nm=>cNew({name:nm,sex:'M',born:yr-RI(5,8),g:cG({...base,bra:base.bra+8,fue:base.fue+6,sen:55}),fama:RI(60,85),sal:RI(30,70),tentado:true,nota:RI(80,90),peso:RI(520,600)}));
 for(let i=(tor||[]).length;i<nt;i++)cNew({name:nmM(),sex:'M',born:yr-RI(4,8),g:cG({...base,fue:base.fue+6,sen:40}),fama:RI(10,40),sal:RI(10,40),tentado:true,nota:RI(65,85),peso:RI(480,580)});
 for(let i=0;i<nb;i++){const s=Math.random()<.5?'H':'M';cNew({name:s==='H'?nmH():nmM(),sex:s,born:yr-RI(0,1),g:cG({...base,sen:5}),fama:0,sal:0,peso:RI(110,220)})}
 for(let i=0;i<nc;i++)cNew({name:pick(['Cantinero','Lucero','Campanero','Manso','Rabicano','Bonito','Galán','Abuelo']),sex:'M',tipo:'cabestro',born:yr-RI(5,12),pelo:pick(['berrendo en negro','berrendo en colorado','colorado']),g:{bra:20,nob:90,fue:60,res:80,sen:30},fama:0,peso:720});
 if(nv>=12)cNew({name:nmM(),sex:'M',tipo:'semental',born:yr-RI(5,8),g:cG({...base,bra:base.bra+6}),fama:20,tentado:true,nota:RI(76,88),peso:560})}
function corroCostoReal(r){return r100(60000+r.pres*1500+(r.n[0]*3200+r.n[1]*4500+r.n[2]*900+r.n[3]*1500))}
function comprarCorro(i){const r=CORRO_REAL[i],c=corroCostoReal(r);if(S.money<c){toast('No te llega el dinero');return}
 modal(`Comprar ${r.name}`,`<div class="stack"><p style="margin:0">${esc(r.d)}</p><div class="kv"><span>Vacas <b>${r.n[0]}</b></span><span>Toros <b>${r.n[1]}</b></span><span>Becerros <b>${r.n[2]}</b></span><span>Cabestros <b>${r.n[3]}</b></span></div><div class="kv"><span>Precio <b>${eur(c)}</b></span><span>Tu saldo <b>${eur(S.money)}</b></span></div>
 <small class="muted">Mantienes el hierro, el nombre y las vacas con fama de la casa. Los gastos y los ingresos salen de la misma caja que tu ganadería de bravo.</small>
 <button class="btn pri adv" onclick="confCompraCorro(${i})">Cerrar la compra · ${eur(c)}</button></div>`)}
function confCompraCorro(i){const r=CORRO_REAL[i],c=corroCostoReal(r);S.money-=c;
 S.corro={name:r.name,l:r.l,div:r.div,pueblo:r.pueblo,real:true,pres:r.pres,an:[],nid:1,inv:{camion:1,corral:1,cabestraje:1,seguro:1},of:[],hist:[],st:{fest:0,ing:0,anillas:0,quiebros:0,cogidas:0,trofeos:[]},oid:1,mkt:null,fund:S.year};
 corroSeed(S.corro,r.n,r.fam,r.tor,{bra:66+r.pres/12,nob:60,fue:64,res:64,sen:30});corroOfertas(true);corroMkt();log(`Compras la ganadería de corro ${r.name}.`);save();closeModal();CU.filt='vaca';go('corro');toast(`${r.name} ya es tuya`)}
let NEWC={name:'',l:'',c1:'#bf3a3f',c2:'#e6bb55',pueblo:'Burriana',lote:0};
const LOTES=[{n:'Corro corto',d:'8 vacas, 1 toro, 2 cabestros',q:[8,1,2,2],c:46000},{n:'Corro completo',d:'14 vacas, 2 toros, 4 becerros, 3 cabestros y semental',q:[14,2,4,3],c:96000}];
function crearCorro(){const n=NEWC.name.trim();if(!n){toast('Ponle nombre a tu ganadería de corro');return}const L=LOTES[NEWC.lote];if(S.money<L.c){toast('No te llega el dinero');return}
 S.money-=L.c;const pu=PUEBLOS.find(p=>p[0]===NEWC.pueblo)||PUEBLOS[0];
 S.corro={name:n,l:(NEWC.l||n[0]).toUpperCase().slice(0,2),div:[NEWC.c1,NEWC.c2],pueblo:pu[0],real:false,pres:22,an:[],nid:1,inv:{},of:[],hist:[],st:{fest:0,ing:0,anillas:0,quiebros:0,cogidas:0,trofeos:[]},oid:1,mkt:null,fund:S.year};
 corroSeed(S.corro,L.q,null,null,{bra:58,nob:58,fue:60,res:58,sen:15});corroOfertas(true);corroMkt();log(`Fundas la ganadería de corro ${n}.`);save();go('corro');toast(`Hierro ${S.corro.l} registrado`)}

/* ---------- ofertas de festejos ---------- */
function corroOfertas(init){const C=S.corro;if(!C)return;
 for(const ahead of init?[0,1,2]:[1,2]){const abs=absNow()+ahead,mo=abs%12;
  let n=2.2*SEASON_W[mo]*(1+C.pres/45)*(1+cLv('publi')*.25)*R(.55,1.35);n=Math.round(n+(Math.random()<n%1?1:0));if(ahead===0)n=Math.min(n,2);
  for(let i=0;i<n;i++){let pu=pick(PUEBLOS);const fk=pickFest(mo,C);const F=FEST[fk];if(F.costa)pu=PUEBLOS.find(p=>p[0]===pick(F.costa))||pu;
   if(C.of.filter(o=>o.abs===abs).length>=9)break;if(C.of.some(o=>o.abs===abs&&o.pueblo===pu[0]))continue;
   const pago=r100(R(F.pago[0],F.pago[1])*(1+C.pres/220)*(.85+pu[2]*.1)*(1+cLv('publi')*.06));
   const fiesta=pu[4].includes(mo)?pu[3]:pick(['Fiestas patronales','Fiestas mayores','Semana de bous','Fiestas de la juventud',pu[3]]);
   C.of.push({id:C.oid++,pueblo:pu[0],prov:pu[1],tam:pu[2],fiesta,tipo:fk,abs,pago,st:'nueva',night:F.night||Math.random()<.45,cdg:fk==='embolado'&&pu[0]==='Burriana'&&mo===8||Math.random()<.08})}}}
function pickFest(mo,C){const L=[];for(const [k,F] of Object.entries(FEST)){if(F.meses&&!F.meses.includes(mo))continue;if(F.minP&&C.pres<F.minP)continue;if(k==='concurso'&&!cLv('seguro'))continue;L.push([k,F.w*(k==='concurso'?1+C.pres/40:1)])}
 let t=L.reduce((s,x)=>s+x[1],0)*Math.random();for(const [k,w] of L){t-=w;if(t<=0)return k}return 'vaquillas'}
function reqTxt(req){return Object.entries(req).map(([k,n])=>`${n} ${k==='cerril'?'toro cerril':k==='becerro'?(n>1?'becerros':'becerro'):TIPOTXT[k].toLowerCase()+(n>1?(k==='toro'?'s':'s'):'')}`).join(' + ')}
/* animales disponibles para un tipo de req */
function cDisp(k,o){return cAnim().filter(a=>{if(a.lesion>0||a.salud<55||a.salMes>=4)return false;const t=cTipo(a);
  if(k==='cerril')return a.sex==='M'&&a.cerril&&cAge(a)>=3&&cAge(a)<=6;
  if(k==='toro')return t==='toro'&&!a.cerril&&(!FEST[o.tipo].minT||cAge(a)>=FEST[o.tipo].minT);
  if(k==='vaca')return t==='vaca'&&cAge(a)>=(o.tipo==='concurso'?3:2);
  if(k==='becerro')return t==='becerro'&&cAgeM(a)>=6&&cAgeM(a)<=20;
  return t===k})}
function cPuede(o){for(const [k,n] of Object.entries(FEST[o.tipo].req))if(cDisp(k,o).length<n)return false;return true}
function cAceptar(id){const C=S.corro,o=C.of.find(x=>x.id===id);const mismo=C.of.filter(x=>x.st==='aceptada'&&x.abs===o.abs).length;const cap=2+cLv('camion')*2+cLv('mayoral');
 if(mismo>=cap){toast(`Este mes ya sirves ${mismo} festejos: necesitas más camión o un mayoral`);return}o.st='aceptada';save();render();toast(`Contratado: ${FEST[o.tipo].n} en ${o.pueblo}`)}
function cRechazar(id){const o=S.corro.of.find(x=>x.id===id);o.st='rechazada';save();render()}
/* elige los animales para un festejo: los de más fama descansados, y un poco al azar para repartir salidas */
function cElegir(o){const out=[];for(const [k,n] of Object.entries(FEST[o.tipo].req)){const L=cDisp(k,o).filter(a=>!out.includes(a)).sort((a,b)=>(corroLuc(b)+b.fama*.3-b.salMes*8+R(0,10))-(corroLuc(a)+a.fama*.3-a.salMes*8+R(0,10)));out.push(...L.slice(0,n))}return out}

/* ---------- resultado de un festejo (simulado o jugado) ---------- */
function cResolver(o,ev){const C=S.corro;const an=ev&&ev.an?ev.an.map(cById).filter(Boolean):cElegir(o);if(!an.length)return null;
 const res=[];let cog=0,anil=0,quieb=0;const mayo=!ev?(cLv('mayoral')?4:0):0;
 for(const a of an){if(a.tipo==='cabestro'){a.salMes++;continue}
  const e=ev&&ev.luc&&ev.luc[a.id]!=null?ev.luc[a.id]:null;
  const base=corroLuc(a)+mayo+R(-9,9),luc=Math.round(clamp(e!=null?(base*.45+e*.55):base,20,99));
  a.sal++;a.salMes++;a.g.sen=Math.round(clamp(a.g.sen+R(.8,2.6)*(cLv('cabestraje')>=1?.85:1),0,99));
  a.fama=Math.round(clamp(a.fama+(luc-62)/5+(o.tam-1)*.6,0,100));if(cTipo(a)==='becerro'){a.nota=Math.round(clamp((a.nota??luc)*.4+luc*.6,20,99));a.capeas=(a.capeas||0)+1}
  if(Math.random()<.04*(1-cLv('mayoral')*.4)){a.lesion=RI(1,2);a.salud=clamp(a.salud-RI(15,30),10,100)}else a.salud=clamp(a.salud-RI(1,4),10,100);
  if(Math.random()<(a.g.sen/100)*.18)cog++;res.push({id:a.id,name:a.name,tipo:cTipo(a),luc});
  if(o.tipo==='cerril'){a.st='muerto'}}
 if(o.tipo==='cerril')C.an=C.an.filter(a=>a.st!=='muerto');
 if(ev){cog=ev.cog??cog;anil=ev.anil||0;quieb=ev.quieb||0}else if(o.tipo==='concurso'){anil=RI(8,26)}
 const media=res.length?Math.round(res.reduce((s,r)=>s+r.luc,0)/res.length):60;
 const porte=(cLv('camion')?150:450)+380+(o.tipo==='embolado'?180:0),prima=media>=80?r100(o.pago*.15):0,ing=o.pago+prima-porte;
 S.money+=ing;{const dp=(media-64)/16+(o.tam-1)*.1;C.pres=clamp(C.pres+(dp>0?dp*(1-C.pres/105):dp),0,100)}
 C.st.fest++;C.st.ing+=ing;C.st.cogidas+=cog;C.st.anillas+=anil;C.st.quiebros+=quieb;
 const top=res.slice().sort((a,b)=>b.luc-a.luc)[0];let trofeo=null;
 if(o.cdg&&top&&top.luc>=78){trofeo={t:o.tipo==='embolado'?'Mejor toro embolado':'Mejor res del concurso',a:top.name,p:o.pueblo,y:S.year};C.st.trofeos.push(trofeo);C.pres=clamp(C.pres+.6,0,100)}
 if(o.tipo==='concurso'&&top&&top.luc>=80&&!trofeo){trofeo={t:'Mejor vaca del concurso',a:top.name,p:o.pueblo,y:S.year};C.st.trofeos.push(trofeo)}
 const r={id:o.id,abs:o.abs,pueblo:o.pueblo,fiesta:o.fiesta,tipo:o.tipo,res,media,ing,prima,porte,cog,anil,quieb,trofeo,jugado:!!ev};
 o.st='hecha';o.r=r;C.hist.unshift(r);C.hist=C.hist.slice(0,40);
 if(typeof mesInc==='function'&&ev)mesInc('vista');
 return r}

/* ---------- mes del corro (va dentro del Avanzar de siempre) ---------- */
function corroMes(rep){const C=S.corro;if(!C)return;
 for(const o of C.of.filter(o=>o.st==='aceptada'&&o.abs===absNow())){const r=cResolver(o,null);if(r)rep.lines.push(`Corro · ${FEST[o.tipo].n} en ${o.pueblo}: ${LUCTXT(r.media)} (${r.media}). Lleva el corro ${cLv('mayoral')?'tu mayoral':'tu gente'}. +${eur(r.ing)}.`),rep.inc+=r.ing;else{C.pres=clamp(C.pres-3,0,100);rep.lines.push(`Corro · No tenías reses para ${o.pueblo}: el ayuntamiento se queja y pierdes prestigio.`);o.st='hecha'}}
 const n=C.an.length,feed=C.an.reduce((s,a)=>s+(cTipo(a)==='becerro'?32:a.tipo==='cabestro'?48:58),0)*(mej('fabrica')?.88:1);
 const pers=900+40*n+(cLv('mayoral')?1400:0)+(cLv('seguro')?120:0);const cap=40+20*cLv('corral')+(cLv('corral')>=2?20:0);
 S.money-=feed+pers;rep.cost+=feed+pers;rep.lines.push(`Corro · pienso ${eur(feed)} y personal ${eur(pers)}.`);
 if(n>cap){for(const a of C.an)a.salud=clamp(a.salud-2,10,100);rep.lines.push(`Corro · ${n} reses para ${cap} plazas de corral: amplía los corrales.`)}
 for(const a of C.an){a.salud=clamp(a.salud+R(1,4)+(cLv('corral')>=2?1:0)-(a.salMes>4?(a.salMes-4)*3:0),10,100);if(a.lesion>0)a.lesion--;a.salMes=0;
  a.peso=Math.min(a.sex==='H'?460:620,a.peso+(cAgeM(a)<36?RI(8,16):0))}
 if(S.month===1){const sem=C.an.find(a=>a.tipo==='semental');let nb=0;
  for(const v of C.an.filter(a=>cTipo(a)==='vaca'&&cAge(a)>=3&&cAge(a)<=14)){if(Math.random()>(sem?.72:.35))continue;const s=Math.random()<.5?'H':'M';
   const pg=sem?sem.g:cG({bra:58,nob:58,fue:58,res:58});const g={};for(const k of ['bra','nob','fue','res'])g[k]=Math.round(clamp((v.g[k]+pg[k])/2+gauss()*7,15,99));g.sen=0;
   cNew({name:s==='H'?v.name:pick(CNOMM),sex:s,born:S.year+(S.month>=2?0:0),g,fama:0,sal:0,peso:30,madre:v.name});nb++}
  if(nb)rep.lines.push(`Corro · paridera: nacen ${nb} becerros${sem?` del semental ${sem.name}`:' (sin semental propio, cubren pocas)'}.`)}
 if(S.month===11){let v=0,ing=0;for(const a of C.an.slice()){if((cTipo(a)==='vaca'&&cAge(a)>=17)||(a.sex==='M'&&a.tipo!=='semental'&&a.tipo!=='cabestro'&&cAge(a)>=10)){v++;ing+=a.peso*1.1;C.an=C.an.filter(x=>x!==a)}}if(v){S.money+=ing;rep.inc+=ing;rep.lines.push(`Corro · retiras ${v} reses viejas: +${eur(ing)}.`)}}
 C.pres=clamp(C.pres-(C.pres-30)*.014,0,100);
 C.of=C.of.filter(o=>o.st==='aceptada'||(o.st==='nueva'&&o.abs>absNow())||(o.st==='hecha'&&absNow()-o.abs<2));
 corroOfertas(false);corroMkt()}

/* ---------- mercado del corro ---------- */
function corroMkt(){const C=S.corro;if(!C)return;const yr=S.year,m={v:[],t:[],c:[],k:[]};
 for(let i=0;i<4;i++){const y=RI(3,10),f=RI(10,80);m.v.push({name:pick(CNOMH),sex:'H',born:yr-y,g:cG({bra:58+f/5,nob:60,fue:60,res:60,sen:15+y*6}),fama:f,sal:y*RI(8,16),tentado:true,nota:RI(60,90),from:pick(CORRO_REAL).name,precio:r100(1600+f*110+(y<=6?800:0))})}
 for(let i=0;i<2;i++){const y=RI(4,8),f=RI(15,75);m.t.push({name:pick(CNOMM),sex:'M',born:yr-y,g:cG({bra:60+f/5,fue:68,res:64,nob:58,sen:35}),fama:f,sal:RI(10,50),tentado:true,nota:RI(65,90),peso:RI(500,600),from:pick(CORRO_REAL).name,precio:r100(3200+f*120)})}
 const pl=['Domecq','Núñez','Atanasio','Santa Coloma','Albaserrada'];for(let i=0;i<2;i++){const y=RI(3,6);m.c.push({name:pick(CNOMM),sex:'M',born:yr-y,cerril:true,g:cG({bra:72,fue:76,res:70,nob:60,sen:0}),fama:0,sal:0,peso:RI(470,590),from:`ganadería de plaza (${pick(pl)})`,precio:r100(R(2800,5200))})}
 m.k.push({name:pick(['Cantinero','Lucero','Campanero','Manso','Galán']),sex:'M',tipo:'cabestro',born:yr-RI(4,9),pelo:pick(['berrendo en negro','berrendo en colorado']),g:{bra:20,nob:90,fue:60,res:80,sen:30},fama:0,peso:720,precio:r100(R(1400,2200))});
 C.mkt=m}
function cComprar(k,i){const C=S.corro,it=C.mkt[k][i];if(!it||S.money<it.precio)return;S.money-=it.precio;const {precio,from,...o}=it;o.orig=from;cNew(o);C.mkt[k].splice(i,1);save();render();toast(`${o.name} llega a tus corrales`)}
/* traspasos desde la ganadería de bravo */
function bravoAptos(){if(!S.corro)return [];return campo().filter(a=>a.res==null&&!a.mark&&(
 (a.sex==='H'&&a.tentado&&!a.role)||(a.sex==='M'&&a.tentado&&!a.role)||(a.sex==='M'&&!a.role&&ageY(a)>=6)||(a.role==='vaca'&&ageY(a)>=12)))}
function traspasar(id){const a=byId(id);if(!a)return;const y=ageY(a),male=a.sex==='M';const nota=a.nota??null;
 const g={bra:a.g.bra,nob:a.g.nob,fue:a.g.fue,res:Math.round((a.g.cas+a.g.fue)/2),sen:male&&a.tentado?25:a.tentado?18:5};
 cNew({name:a.name,num:a.num,sex:a.sex,born:a.born,pelo:a.pelo,g,fama:a.indultado?40:RI(5,15),sal:0,peso:a.peso,tentado:a.tentado,nota,cerril:male&&!a.tentado&&y>=3&&y<=6,orig:S.g.name});
 a.st='corro';S.animals=S.animals.filter(x=>x.id!==id);save();render();toast(`${a.name} pasa a tu corro${male&&!a.tentado?' como toro cerril':''}`)}
function cVender(id,matadero){const C=S.corro,a=cById(id);if(!a)return;const p=matadero?Math.round(a.peso*1.1):r100(cPrecio(a));S.money+=p;C.an=C.an.filter(x=>x.id!==id);save();closeModal();render();toast(`${a.name} vendida · +${eur(p)}`)}
function cPrecio(a){const t=cTipo(a);if(t==='cabestro')return 1500;if(t==='becerro')return 600+(a.nota||50)*8;return 1200+a.fama*95+(t==='toro'?1800:0)}
function cInv(k){const d=CORRO_INV[k],lv=cLv(k);if(lv>=d.max)return;const c=d.c[lv];if(S.money<c){toast('No te llega el dinero');return}S.money-=c;S.corro.inv[k]=lv+1;S.xp=(S.xp||0)+15;save();render();toast(`${d.n}: ${lv?'mejorado':'listo'}`)}

/* ---------- tienta de corro en tu placita (motor de tienta 3D) ---------- */
function cPseudo(a){a.enc=a.enc||null;a.madre=a.madre&&a.madre.name?a.madre:{name:a.madre||'—'};a.g.cas=a.g.cas??a.g.res;a.g.tra=a.g.tra??70;return a}
function corroTienta(ids){if(!mej('placita')){toast('Necesitas la placita de tientas (Obras) para tentar en casa');return}
 const q=ids.map(cById).filter(Boolean).map(cPseudo);if(!q.length)return;closeModal&&closeModal(true);enter3D();if(!W3.on)return;
 W3.mode='tienta';hudMode('tienta');const C={x:-30,z:24};
 const hor=makeHorse2({peto:true,col:'#cfc6b4'});const pic=makePerson({traje:'#b9975a',hat:'castoreno',pole:3.4});seat(pic);pic.root.position.set(0,.98,-.05);pic.arms[1].lock=1;pic.arms[1].sh.rotation.x=-1;hor.body.add(pic.root);
 hor.root.position.set(C.x+4.6,0,C.z+2);hor.root.rotation.y=-2.2;W3.scene.add(hor.root);
 const mul=makeMuleta();W3.pl.arms[0].hand.add(mul);mul.visible=false;
 TT={q,C,hor,mul,cow:null,sex:'H',corro:true};W3.F.carry=null;setCarry();ttNext()}
const _ttDecide=ttDecide;
ttDecide=function(ok){if(!TT||!TT.corro)return _ttDecide(ok);const a=TT.a;
 if(ok){a.tentado=true;a.fama=Math.max(a.fama,Math.round((a.nota-50)/2));log(`Corro: ${a.name} aprobada en tienta (${a.nota}).`)}
 else{const p=Math.round(a.peso*1.1);S.money+=p;S.corro.an=S.corro.an.filter(x=>x.id!==a.id);log(`Corro: ${a.name} desechada.`)}
 save();$('#h3dim').hidden=true;TT.a=null;ttNext()};
const _ttCalc=ttCalc;
ttCalc=function(a,T){_ttCalc(a,T);if(T&&T.corro){a.g.sen=Math.round(clamp(a.g.sen+2,0,99))}};

/* ===================== PANTALLA DEL CORRO ===================== */
function corroCard(a){const t=cTipo(a),l=Math.round(corroLuc(a)),q=clamp(Math.round(l*.7+a.fama*.3),20,99);
 const k=q>=86?'oro':q>=78?'plata':q>=70?'bronce':q>=60?'azul':'gris';const badges=[];
 if(a.lesion>0||a.salud<55)badges.push('<span class="badge bad">Lesionada</span>');if(a.cerril)badges.push('<span class="badge oro">Cerril</span>');if(a.fama>=70)badges.push('<span class="badge oro">Famosa</span>');
 if(t==='becerro'&&!a.capeas)badges.push('<span class="badge">Sin capear</span>');if(a.g.sen>=75&&t!=='cabestro')badges.push('<span class="badge">Mucho sentido</span>');
 const img=`img/toro-${FAMP[a.pelo]||'negro'}-${(a.id*5+1)%8}.jpg`;
 return `<button class="ac t-${k}" onclick="cFicha(${a.id})"><span class="ph" style="background-image:url(${img})"><span class="ovr"><b>${t==='cabestro'?'—':q}</b><small>${({vaca:'VAC',toro:'TOR',becerro:'BEC',cabestro:'CAB',semental:'SEM'})[t]}</small></span></span>
 <span class="t"><span class="nm">${a.num!=null?`<span class="n">${a.num}</span><span class="g">- ${a.born%10}</span>`:''}<span class="n">${esc(a.name)}</span></span>
 <span class="sub">${TIPOTXT[t]}<i>•</i>${cAge(a)} años<i>•</i>${a.pelo}${t!=='cabestro'?`<i>•</i>fama ${a.fama}`:''}</span>${badges.length?`<span class="bdgs">${badges.join('')}</span>`:''}</span>
 <span class="r"><span class="kg">${a.sal} salidas</span><span class="hp ${a.salud<55?'low':''}">${ICO.pulso}<span class="w">salud </span>${Math.round(a.salud)}</span></span></button>`}
function cFicha(id){const a=cById(id);if(!a)return;const t=cTipo(a),g=a.g;const bar=(n,v,d)=>`<div class="sx"><span>${n}</span><span class="meter"><i style="width:${v}%"></i></span><b>${Math.round(v)}</b><small class="muted">${d}</small></div>`;
 const conocido=a.tentado||a.sal>=3||a.capeas;
 modal(`${a.name}${a.num!=null?' nº '+a.num:''}`,`<div class="stack"><div class="kv"><span>${TIPOTXT[t]}</span><span>${cAge(a)} años</span><span>${a.pelo}</span><span>${a.peso} kg</span><span>${a.sal} salidas</span><span>fama ${a.fama}</span></div>
 ${t==='cabestro'?'<p class="muted" style="margin:0">Buey manso que guía a las reses en la recogida y en los encierros.</p>':conocido?`<div class="stats">${bar('Bravura',g.bra,'cómo se arranca')}${bar('Fuerza',g.fue,'velocidad y empuje')}${bar('Fondo',g.res,'aguante la tarde')}${bar('Nobleza',g.nob,'embestida franca')}${bar('Sentido',g.sen,'aprende y busca al hombre')}</div>`:
 '<p class="muted" style="margin:0">Aún no se sabe de qué es: sácala a una capea o tiéntala en tu placita.</p>'}
 <small class="muted">Origen: ${esc(a.orig||S.corro.name)}${a.nota?` · nota de tienta/capea ${a.nota}`:''}${a.lesion>0?` · lesionada ${a.lesion} mes${a.lesion>1?'es':''}`:''}</small>
 <div class="row" style="flex-wrap:wrap;gap:.5rem">${['vaca','becerro'].includes(t)&&a.sex==='H'&&!a.tentado?`<button class="btn oro" onclick="corroTienta([${a.id}])">Tentar en la placita</button>`:''}
 ${t==='toro'&&!a.cerril&&!S.corro.an.some(x=>x.tipo==='semental')?`<button class="btn" onclick="cById(${a.id}).tipo='semental';save();closeModal();render();toast('Pasa a semental del corro')">Dejar de semental</button>`:''}
 ${t!=='cabestro'?`<button class="btn" onclick="cVender(${a.id},false)">Vender a otra ganadería · ${eur(r100(cPrecio(a)))}</button>`:''}<button class="btn" onclick="cVender(${a.id},true)">Matadero · ${eur(Math.round(a.peso*1.1))}</button></div></div>`)}
function ofCorroCard(o){const F=FEST[o.tipo],ok=cPuede(o),hoy=o.abs===absNow();const img=o.tipo==='concurso'?'plaza-1':(F.night||o.night)?'calle-nit':'calle';
 return `<article class="ofc"><div class="pic c2" style="background-image:url(img/${img}.jpg)"></div>
 <div class="row" style="gap:.45rem"><span class="badge ${o.tipo==='concurso'?'oro':''}">${F.n}${o.night&&o.tipo==='vaquillas'?' · nit':''}</span>${o.cdg?'<span class="badge oro">Concurso de ganaderías</span>':''}${o.st==='aceptada'?'<span class="badge ok">Contratado</span>':''}</div>
 <div class="pl">${esc(o.pueblo)}</div>
 <div class="meta"><div class="m">${ICO.cal.replace('<svg','<svg class="ico"')}<span><small>Fecha</small><b>${MESES[o.abs%12]} ${Math.floor(o.abs/12)}</b></span></div>
  <div class="m">${ICO.toroG.replace('<svg','<svg class="ico"')}<span>${reqTxt(F.req)}</span></div>
  <div class="m">${ICO.monG.replace('<svg','<svg class="ico"')}<span><b>${eur(o.pago)}</b> el festejo</span></div>
  <div class="m">${ICO.feria.replace('<svg','<svg class="ico"')}<span>${esc(o.fiesta)} · ${esc(o.prov)}</span></div></div>
 ${o.st==='nueva'?`<div class="acts"><button class="btn pri" ${ok?'':'disabled'} onclick="cAceptar(${o.id})">Aceptar${ICO.chev}</button><button class="btn" onclick="cRechazar(${o.id})">Rechazar</button></div>${ok?'':`<div class="note" style="color:var(--warn)">No tienes reses descansadas suficientes (${reqTxt(F.req)}).</div>`}`
 :hoy?`<div class="acts"><button class="btn oro" onclick="irCalle(${o.id})">Ver a tu hierro en directo${ICO.chev}</button><button class="btn" onclick="cDelegar(${o.id})">Que lo lleve el mayoral</button></div>`
 :`<div class="note">Se celebra en ${MESES[o.abs%12]}. Ese mes podrás verlo en directo.</div>`}</article>`}
function cDelegar(id){const o=S.corro.of.find(x=>x.id===id);const r=cResolver(o,null);save();render();if(r)toast(`${o.pueblo}: ${LUCTXT(r.media)} (${r.media}) · +${eur(r.ing)}`)}
function renderCorro(el){const C=S.corro;
 if(!C){el.innerHTML=`<div class="stack" style="gap:1rem">
  <div class="fhero"><div class="img" style="background-image:url(img/calle.jpg)"></div><span class="season">Bous al carrer · Comunitat Valenciana</span></div>
  <div class="card goldline"><b style="font-family:var(--display);font-size:1.25rem">Ganadería de corro</b><p class="muted" style="margin:.3rem 0 0">Vacas y toros para las fiestas de los pueblos: tardes de vaquillas, bous embolats, capeas, encierros y concursos de recortadores. Las vacas de corro salen muchas veces: cada salida es una prueba, ganan fama… y sentido. Comparte caja, calendario y placita de tientas con tu ganadería de bravo.</p></div>
  <section class="sect"><header><h2>Ganaderías de corro en venta</h2><span class="sp"></span><small class="muted">${CORRO_REAL.length} casas</small></header><div class="list">${CORRO_REAL.slice(0,CU.todas?99:8).map((r,i)=>`<button class="gan" onclick="comprarCorro(${i})">${emblem({hierro:{l:r.l}},44)}
   <span style="min-width:0"><b>${esc(r.name)}</b><br><small class="muted">${esc(r.pueblo)} · ${r.n[0]} vacas, ${r.n[1]} toros · ${eur(corroCostoReal(r))}</small><div class="pres"><i style="width:${r.pres}%"></i></div></span>${divisa(r.div)}</button>`).join('')}</div>${CU.todas?'':`<button class="btn" style="width:100%;margin-top:.5rem" onclick="CU.todas=1;render()">Ver las ${CORRO_REAL.length} ganaderías de corro</button>`}</section>
  <section class="sect card goldline"><header><h2>Crea tu ganadería de corro</h2></header>
   <div class="field"><label class="lbl" for="nc-n">Nombre</label><input type="text" id="nc-n" maxlength="30" placeholder="Ej.: Ganadería El Templario" value="${esc(NEWC.name)}" oninput="NEWC.name=this.value"></div>
   <div class="two"><div class="field"><label class="lbl" for="nc-l">Letras del hierro</label><input type="text" id="nc-l" maxlength="2" value="${esc(NEWC.l)}" oninput="NEWC.l=this.value"></div>
   <div class="field"><label class="lbl" for="nc-p">Pueblo</label><select id="nc-p" onchange="NEWC.pueblo=this.value">${PUEBLOS.map(p=>`<option ${p[0]===NEWC.pueblo?'selected':''}>${p[0]}</option>`).join('')}</select></div></div>
   <div class="two"><div class="field"><span class="lbl">Divisa · color 1</span><div class="colors">${COLORES.map(c=>`<button aria-label="Color ${c}" style="background:${c}" aria-pressed="${NEWC.c1===c}" onclick="NEWC.c1='${c}';render()"></button>`).join('')}</div></div>
   <div class="field"><span class="lbl">Divisa · color 2</span><div class="colors">${COLORES.map(c=>`<button aria-label="Color ${c}" style="background:${c}" aria-pressed="${NEWC.c2===c}" onclick="NEWC.c2='${c}';render()"></button>`).join('')}</div></div></div>
   <div class="seg">${LOTES.map((L,i)=>`<button aria-pressed="${NEWC.lote===i}" onclick="NEWC.lote=${i};render()"><b>${L.n}</b><span>${L.d} · ${eur(L.c)}</span></button>`).join('')}</div>
   <button class="btn pri adv" onclick="crearCorro()">Registrar el hierro${ICO.chev}</button></section></div>`;return}
 const an=cAnim(),cnt=t=>an.filter(a=>cTipo(a)===t).length,hoy=C.of.filter(o=>o.st==='aceptada'&&o.abs===absNow()),prox=C.of.filter(o=>o.st==='aceptada'&&o.abs>absNow()).sort((a,b)=>a.abs-b.abs),nuevas=C.of.filter(o=>o.st==='nueva').sort((a,b)=>a.abs-b.abs);
 const fl=[['vaca','Vacas'],['toro','Toros'],['becerro','Becerros'],['cabestro','Cabestros'],['semental','Semental']];const lista=an.filter(a=>cTipo(a)===CU.filt).sort((a,b)=>b.fama-a.fama);
 const aptos=bravoAptos(),M_=C.mkt||{v:[],t:[],c:[],k:[]};
 el.innerHTML=`<div class="stack" style="gap:1rem">
 <div class="card goldline cHead">${emblem({hierro:{l:C.l}},54)}<div style="min-width:0"><b class="cName">${esc(C.name)}</b><div class="row" style="gap:.4rem">${divisa(C.div)}<small class="muted">${esc(C.pueblo)} · ganadería de corro</small></div><div class="gsub">${estrellas(C.pres)}<small class="muted"> prestigio ${Math.round(C.pres)}</small></div></div></div>
 <div class="tiles t2"><div class="tile">${ICO.vaca}<div><div class="lbl">Vacas</div><div class="v">${cnt('vaca')}</div></div></div><div class="tile">${ICO.toroG.replace('<svg','<svg class="ti"')}<div><div class="lbl">Toros</div><div class="v">${cnt('toro')+cnt('semental')}</div></div></div>
  <div class="tile">${ICO.capote}<div><div class="lbl">Festejos</div><div class="v">${C.st.fest}</div></div></div><div class="tile">${ICO.monG.replace('<svg','<svg class="ti"')}<div><div class="lbl">Ingresos</div><div class="v" style="font-size:1.1rem">${eur(C.st.ing)}</div></div></div></div>
 ${hoy.length?`<section class="sect"><header><h2>Este mes en la calle</h2></header><div class="stack">${hoy.map(ofCorroCard).join('')}</div></section>`:''}
 <section class="sect"><header><h2>Contratos de los pueblos</h2><span class="sp"></span><small class="muted">${nuevas.length} sin responder</small></header><div class="stack">${nuevas.slice(0,6).map(ofCorroCard).join('')||'<div class="card muted">No hay contratos nuevos. En verano llueven: julio, agosto y septiembre concentran casi todas las fiestas.</div>'}</div></section>
 ${prox.length?`<section class="sect"><header><h2>Contratados</h2></header><div class="list">${prox.map(o=>`<div class="task"><span class="dot ok"></span><span class="t"><b>${esc(o.pueblo)}</b> · ${FEST[o.tipo].n}<br><small class="muted">${MESES[o.abs%12]} ${Math.floor(o.abs/12)} · ${esc(o.fiesta)} · ${eur(o.pago)}</small></span></div>`).join('')}</div></section>`:''}
 <section class="sect"><header><h2>Tu corro</h2></header><div class="chips">${fl.map(([k,l])=>`<button class="chip" aria-pressed="${CU.filt===k}" onclick="CU.filt='${k}';render()">${l} (${cnt(k)})</button>`).join('')}</div>
  ${CU.filt==='vaca'&&an.some(a=>a.sex==='H'&&!a.tentado&&cAgeM(a)>=18)?`<button class="btn" style="margin-top:.5rem" onclick="corroTienta(cAnim().filter(a=>a.sex==='H'&&!a.tentado&&cAgeM(a)>=18).map(a=>a.id))">Tentar en la placita las vacas sin probar</button>`:''}
  <div class="alist" style="margin-top:.6rem">${lista.map(corroCard).join('')||'<div class="card muted">Ninguna res de este tipo.</div>'}</div></section>
 <section class="sect"><header><h2>Mercado del corro</h2><span class="sp"></span><small class="muted">se renueva cada mes</small></header><div class="list">
  ${M_.v.map((x,i)=>`<div class="task"><span class="t"><b>${esc(x.name)}</b> · vaca de ${S.year-x.born} años<br><small class="muted">${esc(x.from)} · fama ${x.fama} · ${x.sal} salidas</small></span><button class="btn sm oro" ${S.money<x.precio?'disabled':''} onclick="cComprar('v',${i})">${eur(x.precio)}</button></div>`).join('')}
  ${M_.t.map((x,i)=>`<div class="task"><span class="t"><b>${esc(x.name)}</b> · toro de corro<br><small class="muted">${esc(x.from)} · fama ${x.fama} · ${x.peso} kg</small></span><button class="btn sm oro" ${S.money<x.precio?'disabled':''} onclick="cComprar('t',${i})">${eur(x.precio)}</button></div>`).join('')}
  ${M_.c.map((x,i)=>`<div class="task"><span class="t"><b>${esc(x.name)}</b> · toro cerril, ${S.year-x.born} años<br><small class="muted">De ${esc(x.from)}. Nunca corrido: tras su exhibición va al matadero.</small></span><button class="btn sm oro" ${S.money<x.precio?'disabled':''} onclick="cComprar('c',${i})">${eur(x.precio)}</button></div>`).join('')}
  ${M_.k.map((x,i)=>`<div class="task"><span class="t"><b>${esc(x.name)}</b> · cabestro<br><small class="muted">Manso, con cencerro</small></span><button class="btn sm oro" ${S.money<x.precio?'disabled':''} onclick="cComprar('k',${i})">${eur(x.precio)}</button></div>`).join('')}</div></section>
 <section class="sect"><header><h2>Desde tu ganadería de bravo</h2></header><small class="muted">Hembras y machos tentados que no apruebas, toros pasados de edad y vacas viejas pueden seguir en la calle en vez de ir al matadero.</small>
  <div class="list" style="margin-top:.5rem">${aptos.slice(0,10).map(a=>`<div class="task"><span class="t"><b>${esc(a.name)}</b> <span class="mono muted">${a.num??''}</span><br><small class="muted">${a.sex==='H'?'Hembra':'Macho'} · ${ageY(a)} años · ${a.pelo}${a.nota?' · tienta '+a.nota:''}</small></span><button class="btn sm" onclick="traspasar(${a.id})">Pasar al corro</button></div>`).join('')||'<div class="card muted">Ahora mismo no hay animales para traspasar.</div>'}</div></section>
 <section class="sect"><header><h2>Inversiones</h2></header><div class="obras">${Object.entries(CORRO_INV).map(([k,d])=>{const lv=cLv(k),nx=lv<d.max?d.c[lv]:null;return `<div class="obra ${lv?'hecha':''}"><div class="oh"><b>${d.n}</b><span class="lvd">${Array.from({length:d.max},(_,i)=>`<i class="${i<lv?'on':''}"></i>`).join('')}</span></div><small>${esc(d.d[lv?lv-1:0])}${lv&&lv<d.max?` <span class="muted">Siguiente: ${esc(d.d[lv])}</span>`:''}</small><div class="ob">${nx==null?'<span class="badge ok">Completa</span>':`<button class="btn sm oro" ${S.money<nx?'disabled':''} onclick="cInv('${k}')">${lv?'Mejorar':'Invertir'} · ${eur(nx)}</button>`}</div></div>`}).join('')}</div></section>
 ${C.hist.length?`<section class="sect"><header><h2>Últimos festejos</h2></header><div class="list">${C.hist.slice(0,8).map(r=>`<div class="task"><span class="t"><b>${esc(r.pueblo)}</b> · ${FEST[r.tipo].n}${r.jugado?' · en directo':''}<br><small class="muted">${MESES[r.abs%12]} ${Math.floor(r.abs/12)} · ${LUCTXT(r.media)} (${r.media})${r.trofeo?' · 🏆 '+esc(r.trofeo.t):''}</small></span><b class="${r.ing>=0?'pos':'neg'}">${eur(r.ing)}</b></div>`).join('')}</div></section>`:''}
 ${C.st.trofeos.length?`<section class="sect"><header><h2>Trofeos del corro</h2></header><div class="list">${C.st.trofeos.slice(-8).reverse().map(t=>`<div class="task"><span class="dot ok"></span><span class="t"><b>${esc(t.t)}</b><br><small class="muted">${esc(t.a)} · ${esc(t.p)} ${t.y}</small></span></div>`).join('')}</div></section>`:''}
 </div>`}

/* ---------- integración con el juego existente ---------- */
TABS.splice(3,0,['corro','Corro','vaca']);
const _render=render;
render=function(){if(S&&UI.tab==='corro'){UI.tab='inicio';_render();UI.tab='corro';document.querySelectorAll('nav.tabs button').forEach(b=>b.setAttribute('aria-current',String((b.getAttribute('onclick')||'').includes("'corro'"))));const sc=$('#scr');if(sc)renderCorro(sc);const nb=S.corro?S.corro.of.filter(o=>o.st==='nueva'||(o.st==='aceptada'&&o.abs===absNow())).length:0;corroBadge(nb);return}
 _render();if(S){const nb=S.corro?S.corro.of.filter(o=>o.st==='aceptada'&&o.abs===absNow()).length:0;corroBadge(nb)}};
function corroBadge(n){const b=[...document.querySelectorAll('nav.tabs button')].find(b=>(b.getAttribute('onclick')||'').includes("'corro'"));if(!b)return;let s=b.querySelector('.bdg');if(n){if(!s){s=document.createElement('span');s.className='bdg';b.appendChild(s)}s.textContent=n}else if(s)s.remove()}
const _renderInicio=renderInicio;
renderInicio=function(el){_renderInicio(el);if(!S)return;const C=S.corro,d=document.createElement('section');d.className='sect';
 const hoy=C?C.of.filter(o=>o.st==='aceptada'&&o.abs===absNow()):[];
 d.innerHTML=`<button class="corroP" onclick="go('corro')"><span class="cpI" style="background-image:url(img/calle.jpg)"></span><span class="cpT"><small>Bous al carrer</small><b>${C?esc(C.name):'Ganadería de corro'}</b><span>${C?(hoy.length?`Este mes: ${hoy.map(o=>esc(o.pueblo)).join(', ')} · ¡míralo en directo!`:`${C.of.filter(o=>o.st==='nueva').length} contratos nuevos · prestigio ${Math.round(C.pres)}`):'Compra una casa de corro o funda la tuya'}</span></span>${ICO.chev}</button>`;
 el.firstElementChild?el.firstElementChild.insertBefore(d,el.firstElementChild.children[1]||null):el.appendChild(d)};
const _finTareas=finTareas;
finTareas=function(rep){_finTareas(rep);try{corroMes(rep)}catch(e){console.error(e)}};
const _patrimonio=patrimonio;
patrimonio=function(){let v=_patrimonio();if(S&&S.corro)v+=S.corro.an.reduce((s,a)=>s+cPrecio(a),0)+Object.entries(S.corro.inv||{}).reduce((s,[k,l])=>s+CORRO_INV[k].c.slice(0,l).reduce((x,y)=>x+y,0)*.7,0);return Math.round(v)};
