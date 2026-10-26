/* ============ utilidades ============ */
const $=s=>document.querySelector(s);
const R=(a,b)=>a+Math.random()*(b-a), RI=(a,b)=>Math.floor(R(a,b+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const gauss=()=>(Math.random()+Math.random()+Math.random()+Math.random()-2)*1.73;
const r100=v=>Math.round(v/100)*100;
const eur=v=>(v<0?'−':'')+Math.abs(Math.round(v)).toLocaleString('es-ES')+' €';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

/* ============ datos del mundo ============ */
const ENC={
 'Domecq':      {bra:70,nob:82,fue:60,cas:66,tra:70,m:1.00,pelos:['negro','negro','negro','castaño','colorado','jabonero','salinero'],d:'Nobleza y calidad en la muleta; el encaste más lidiado.'},
 'Albaserrada': {bra:78,nob:62,fue:70,cas:86,tra:66,m:0.95,pelos:['cárdeno','cárdeno','cárdeno','entrepelado','negro'],d:'Casta encendida, toros que miden y exigen.'},
 'Miura':       {bra:68,nob:52,fue:80,cas:82,tra:92,m:1.12,pelos:['cárdeno','negro','colorado','castaño'],d:'Altura, longitud y leyenda. Difíciles de lidiar.'},
 'Santa Coloma':{bra:80,nob:70,fue:62,cas:80,tra:62,m:0.92,pelos:['cárdeno','cárdeno','entrepelado','negro'],d:'Bravura fina, cárdenos de poca romana.'},
 'Atanasio':    {bra:72,nob:72,fue:72,cas:70,tra:84,m:1.05,pelos:['negro','burraco','colorado','castaño'],d:'Toros grandes y con tranco, de embestida larga.'},
 'Núñez':       {bra:70,nob:76,fue:66,cas:70,tra:72,m:1.00,pelos:['negro','negro','colorado'],d:'Equilibrio entre bravura y nobleza.'},
 'Cuadri':      {bra:74,nob:60,fue:82,cas:78,tra:90,m:1.10,pelos:['negro'],d:'Negros enormes, de gran fuerza y poder.'}
};
const PELO={negro:['#171310','#3a302a',0],'cárdeno':['#4f5156','#86888c',1],entrepelado:['#25231f','#5f5c57',1],colorado:['#74351c','#a15631',0],'castaño':['#4a2a18','#73452a',0],jabonero:['#c6ab7c','#e6d4ab',0],salinero:['#8a6a57','#c0a793',1],burraco:['#171310','#3a302a',2]};
const GANADERIAS=[
 {name:'Miura',enc:'Miura',pres:78,div:['#1f6b3a','#141414']},
 {name:'Victorino Martín',enc:'Albaserrada',pres:82,div:['#1f3f8a','#bf3a3f']},
 {name:'Juan Pedro Domecq',enc:'Domecq',pres:74,div:['#c8a02e','#7a1b2a']},
 {name:'Garcigrande',enc:'Domecq',pres:80,div:['#2c4f9e','#f1ece0']},
 {name:'Victoriano del Río',enc:'Domecq',pres:79,div:['#5b2a6e','#e6bb55']},
 {name:'Fuente Ymbro',enc:'Domecq',pres:73,div:['#bf3a3f','#f1ece0']},
 {name:'Adolfo Martín',enc:'Albaserrada',pres:70,div:['#3a78b8','#f1ece0']},
 {name:'La Quinta',enc:'Santa Coloma',pres:62,div:['#2d6b4b','#e6bb55']},
 {name:'Cuadri',enc:'Cuadri',pres:60,div:['#141414','#c9402f']},
 {name:'Dolores Aguirre',enc:'Atanasio',pres:56,div:['#6b1d2b','#3a78b8']}
];
const COLORES=['#141414','#f1ece0','#bf3a3f','#1f6b3a','#1f3f8a','#3a78b8','#e6bb55','#5b2a6e','#d9792b','#d58fb0','#6b1d2b','#2d6b4b'];
const PROVINCIAS=['Salamanca','Sevilla','Cádiz','Cáceres','Badajoz','Madrid','Toledo','Córdoba','Jaén','Albacete','Ciudad Real','Huelva'];
const FEM=['Lucera','Gitana','Coplera','Bailadora','Morena','Paloma','Habanera','Carcelera','Jaraíza','Mariposa','Navarra','Hechicera','Cantinera','Torera','Primorosa','Rumbosa','Serrana','Tabernera','Viajera','Zalamera','Campanera','Cigarrera','Florida','Garbosa','Jardinera','Lagartija','Pajarita','Ventera','Romera','Remendona','Caramela','Clavellina','Granadina','Hortelana','Jocosa','Lechuza','Mesonera','Molinera','Orgullosa','Pastora','Portuguesa','Quitasueña','Revoltosa','Salerosa','Soñadora','Tempranera','Vencedora','Ciclona','Bonita','Cortijera','Bravía','Arrojada','Avispada','Barbera','Velera','Murciana','Cobradora','Embustera','Fogonera','Pocapena'];
const masc=n=>n.endsWith('a')?n.slice(0,-1)+'o':n;
const FERIAS=[
 {id:'val',plaza:'Plaza de Valencia',feria:'Fallas',m:2,cat:1,minP:45,tipo:'corrida'},
 {id:'sev',plaza:'Real Maestranza (Sevilla)',feria:'Feria de Abril',m:3,cat:1,minP:55,tipo:'corrida'},
 {id:'mad',plaza:'Las Ventas (Madrid)',feria:'San Isidro',m:4,cat:1,minP:55,tipo:'corrida'},
 {id:'cor',plaza:'Los Califas (Córdoba)',feria:'Feria de Mayo',m:4,cat:1,minP:35,tipo:'corrida'},
 {id:'pam',plaza:'Monumental de Pamplona',feria:'San Fermín',m:6,cat:1,minP:50,tipo:'corrida'},
 {id:'mnv',plaza:'Las Ventas (Madrid)',feria:'Novilladas de verano',m:6,cat:1,minP:22,tipo:'novillada'},
 {id:'bil',plaza:'Vista Alegre (Bilbao)',feria:'Semana Grande',m:7,cat:1,minP:50,tipo:'corrida'},
 {id:'mal',plaza:'La Malagueta (Málaga)',feria:'Feria de Agosto',m:7,cat:1,minP:40,tipo:'corrida'},
 {id:'zar',plaza:'La Misericordia (Zaragoza)',feria:'El Pilar',m:9,cat:1,minP:40,tipo:'corrida'}
];
const SMALL=[
 {plaza:'Plaza de segunda · Castilla y León',feria:'Feria de septiembre',cat:2},
 {plaza:'Plaza de segunda · Levante',feria:'Feria de julio',cat:2},
 {plaza:'Plaza de segunda · Andalucía',feria:'Feria de agosto',cat:2},
 {plaza:'Plaza de tercera · La Mancha',feria:'Fiestas patronales',cat:3},
 {plaza:'Plaza de tercera · Extremadura',feria:'Fiestas del Cristo',cat:3},
 {plaza:'Plaza de tercera · Sierra de Madrid',feria:'Fiestas de verano',cat:3},
 {plaza:'Plaza de tercera · Campo charro',feria:'Fiestas de la Virgen',cat:3}
];
const MATADORES=[
 {n:'Diego Montalvo',t:'#7a1525',e:'artista'},{n:'Rafael Ledesma',t:'#1d2f5e',e:'tecnico'},{n:'Antonio Ruiz «Rondeño»',t:'#1f4a32',e:'tremendista'},
 {n:'Pablo Calatrava',t:'#ece6da',e:'artista'},{n:'Julián Aranda',t:'#5a2a6e',e:'valiente'},{n:'Sergio Valcárcel',t:'#2b2b2b',e:'poderoso'},
 {n:'Manuel Salcedo «Niño de la Vega»',t:'#8a4f1e',e:'tremendista'},{n:'Álvaro Mena',t:'#2f6f7a',e:'tecnico'}
];
const NOVILLEROS=[{n:'Hugo Ortega',t:'#2d6b4b',e:'valiente'},{n:'Iván Corrales',t:'#7a1525',e:'tremendista'},{n:'Mario Tejada',t:'#1d2f5e',e:'tecnico'},{n:'Lucas Benjumea',t:'#ece6da',e:'artista'},{n:'Adrián Pozo',t:'#5a2a6e',e:'poderoso'}];
const SOBRE={n:'el sobresaliente',t:'#4a4a4a',e:'tecnico'};
const ESTILO={artista:'artista, de temple y empaque',tecnico:'lidiador técnico',tremendista:'tremendista, de valor seco',valiente:'valiente, se pone cerca',poderoso:'poderoso, manda con la muleta'};
const ENCMORF={Domecq:[1,1,1,1],Albaserrada:[.96,.93,1.05,.92],Miura:[1.14,1.12,.88,1.14],'Santa Coloma':[.93,.92,.95,.95],Atanasio:[1.07,1.05,1.05,1.04],'Núñez':[1,1,1,1],Cuadri:[1.05,1.03,1.22,.98]};
const HORNS={veleto:[.3,.62,.08,0],cornipaso:[.3,.52,-.08,.12],playero:[.62,.34,.12,0],corniabierto:[.5,.45,.2,0],cornidelantero:[.28,.32,.46,0],brocho:[.22,.46,.14,-.2],cornigacho:[.38,.12,.3,0],cornivuelto:[.34,.46,-.12,.25]};
function morf(a){
 const r=mulberry(a.id*7919+a.born*31),e=ENCMORF[a.enc]||[1,1,1,1],y=Math.max(0,ageY(a)),tr=(a.g.tra||70)/100,male=a.sex==='M';
 const hk=Object.keys(HORNS),ht=hk[Math.floor(r()*hk.length)],ageH=[.2,.36,.56,.78,.93,1,1][Math.min(6,y)];
 const mo=male?e[2]*(.8+r()*.45)*(.65+tr*.55)*[.3,.45,.65,.85,1,1.05,1.05][Math.min(6,y)]:.25;
 return {len:e[0]*(.93+r()*.14)*(.9+tr*.14),alt:e[1]*(.95+r()*.1),morr:mo,leg:e[3]*(.95+r()*.1),girth:Math.sqrt(clamp(a.peso/(male?520:420),.35,1.3))*(.94+r()*.1),papada:.6+r()*.7,
  horn:male?ht:'lira',hl:(male?.85+r()*.35:.9+r()*.3)*ageH,ht:male?.04+r()*.028:.026+r()*.01,hc:r()<.3?'#2a2018':r()<.6?'#d9c8a4':'#e8dcc0',
  lucero:r()<.12,bragado:r()<(a.pelo==='negro'||a.pelo==='colorado'?.18:.06),calcetero:r()<.08,rabicano:r()<.06};
}
function hornTxt(m){if(m.horn==='lira')return 'en lira, fina';return m.horn+(m.ht<.05?', astifino':m.ht>.062?', grueso de cepa':'')+(m.hc==='#2a2018'?', de pitones negros':'')}
function hechTxt(a,m){const p=[];if(m.len>1.05)p.push('largo');else if(m.len<.95)p.push('recogido');if(m.alt>1.06)p.push('alto de agujas');else if(m.alt<.94)p.push('bajo de agujas');if(a.sex==='M'&&m.morr>1.05)p.push('enmorrillado');if(m.girth>1.06)p.push('hondo');if(m.lucero)p.push('lucero');if(m.bragado)p.push('bragado');if(m.calcetero)p.push('calcetero');if(m.rabicano)p.push('rabicano');return p.join(', ')||'armónico'}
const FEED={eco:{n:'Económica',c:22,m:0.82,s:-0.8,d:'Pasto y poco pienso'},nor:{n:'Normal',c:40,m:1,s:0.1,d:'Pasto y pienso de campo'},pre:{n:'Premium',c:70,m:1.16,s:0.6,d:'Pienso y cereal selecto'}};
const MINPESO={corrida:{1:460,2:435,3:410},novillada:{1:390,2:370,3:350}};
const RESTXT={indulto:'Indulto',vuelta:'Vuelta al ruedo',ovacion:'Ovación en el arrastre',silencio:'Silencio',pitos:'Pitos en el arrastre',devuelto:'Devuelto a corrales'};
const RESPRES={indulto:8,vuelta:3,ovacion:.6,silencio:0,pitos:-2.5,devuelto:-3.5};
const RESPL={indulto:['indulto','indultos'],vuelta:['vuelta al ruedo','vueltas al ruedo'],ovacion:['ovación','ovaciones'],silencio:['silencio','silencios'],pitos:['pitada','pitadas'],devuelto:['devuelto','devueltos']};
const CATMUL={1:1.4,2:1,3:0.6};

/* ============ estado ============ */
let S=null;
const UI={tab:'inicio',filter:'toros',deh:false};
const KEY='hierro-divisa-v1';
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const s=localStorage.getItem(KEY);return s?JSON.parse(s):null}catch(e){return null}}
const absNow=()=>S.year*12+S.month;
const ageM=a=>(S.year-a.born)*12+S.month-2;
const ageY=a=>Math.floor(ageM(a)/12);
const ageAt=(a,abs)=>Math.floor(((Math.floor(abs/12)-a.born)*12+abs%12-2)/12);
const campo=()=>S.animals.filter(a=>a.st==='campo');
const byId=id=>S.animals.find(a=>a.id===id);

function genes(enc,b=0){const e=ENC[enc];const o={};for(const k of ['bra','nob','fue','cas','tra'])o[k]=Math.round(clamp(e[k]+b+gauss()*7,20,99));return o}
function rate(m,a){let b=[10,11,9,7,4,1.5][Math.min(5,Math.floor(m/12))];if(a.sex==='H')b*=0.72;return b*ENC[a.enc].m*a.ind}
const capPeso=a=>a.sex==='M'?640*ENC[a.enc].m:470;
function mk(o){
 const a={id:S.nid++,sex:o.sex,born:o.born,enc:o.enc,g:o.g||genes(o.enc,o.bonus||0),salud:o.salud??RI(84,100),pelo:o.pelo||pick(ENC[o.enc].pelos),
  name:o.name||(o.sex==='H'?pick(FEM):masc(pick(FEM))),num:o.num??null,herrado:o.herrado??true,role:o.role||null,tentado:false,known:null,rev:null,nota:null,
  ind:R(0.93,1.07),res:null,madre:o.madre||null,padre:o.padre||null,reata:o.reata||null,hijos:[],peso:32,st:'campo',dec:false,lesion:0};
 if(a.num==null&&a.herrado)a.num=nextNum(a.born);
 const m=Math.max(0,ageM(a));let p=32;for(let i=0;i<m;i++)p+=rate(i,a);a.peso=Math.round(Math.min(p,capPeso(a)));
 return a;
}
function nextNum(y){S.nums=S.nums||{};S.nums[y]=(S.nums[y]||0)+RI(1,3);return S.nums[y]}
function tentar(a){a.tentado=true;a.known='tienta';a.rev={bra:Math.round(clamp(a.g.bra+gauss()*3,1,99)),cas:Math.round(clamp(a.g.cas+gauss()*3,1,99))};a.nota=Math.round(.65*a.rev.bra+.35*a.rev.cas)}
const notaTxt=n=>n>=85?'Excelente':n>=76?'Muy buena':n>=68?'Buena':n>=60?'Regular':'Mansa';
function cat(a){const y=ageY(a);
 if(a.role==='semental')return 'Semental';
 if(a.sex==='H'){if(a.role==='vaca')return 'Vaca de vientre';return ['Becerra','Añoja','Eral','Hembra de 3 años','Hembra'][Math.min(4,y)]}
 return ['Becerro','Añojo','Eral','Utrero','Cuatreño','Cinqueño','Seis años'][Math.min(6,y)];}
const lidiable=a=>a.sex==='M'&&a.st==='campo'&&!a.tentado&&!a.role&&a.res==null;

/* ============ nueva partida ============ */
function newGame(cfg){
 S={v:1,g:cfg,year:2027,month:0,money:cfg.real?260000:180000,pres:cfg.real?cfg.pres:12,feed:'nor',animals:[],nid:1,nums:{},offers:[],oid:1,
  hist:[],presHist:[],semAct:null,mej:cfg.real?{placita:1,corrales:1,comederos:1,abrev:1,cercas:1,casa:1}:{},season:null,objs:[],porVer:[],mkt:null,log:[],stats:{corridas:0,toros:0,indultos:0,vueltas:0,orejas:0,premios:0,ingresos:0}};
 const real=cfg.real, enc=cfg.enc, b=real?2:-5;
 const nV=real?40:20, nM=real?12:5, nH=real?10:5, nS=real?2:1, maxM=real?5:4;
 const vacas=[];
 for(let i=0;i<nV;i++){const v=mk({sex:'H',born:S.year-RI(4,12),enc,bonus:b+2,role:'vaca'});tentar(v);vacas.push(v);S.animals.push(v)}
 for(let i=0;i<nS;i++){const s=mk({sex:'M',born:S.year-RI(5,7),enc,bonus:b+6,role:'semental'});tentar(s);if(s.nota<70){s.g.bra=Math.max(s.g.bra,78);tentar(s)}S.animals.push(s)}
 const sems=S.animals.filter(a=>a.role==='semental');S.semAct=sems[0].id;
 const kid=(sex,y)=>{const m=pick(vacas),f=pick(sems);const g={};for(const k in m.g)g[k]=Math.round(clamp((m.g[k]+f.g[k])/2+gauss()*6,20,99));
  return mk({sex,born:S.year-y,enc,g,name:sex==='H'?m.name:masc(m.name),madre:{id:m.id,name:m.name,num:m.num},padre:{id:f.id,name:f.name,num:f.num},reata:{bra:Math.round((m.rev.bra+f.rev.bra)/2),cas:Math.round((m.rev.cas+f.rev.cas)/2)}})};
 for(let y=1;y<=maxM;y++)for(let i=0;i<nM;i++)S.animals.push(kid('M',y));
 for(let y=1;y<=2;y++)for(let i=0;i<nH;i++)S.animals.push(kid('H',y));
 newSeason();regenMkt();
 for(let k=2;k<=4;k++)genOffers(k,true);
 log(`Comienza la temporada ${S.year} en ${cfg.name}.`);
 migrate(S);save();UI.tab='inicio';render();
}
function newSeason(){
 S.season={lid:0,c1:0,ov:0,vu:0,ind:0,pts:0,ore:0};
 const p=S.pres, pool=[
  {id:'lid',n:p<30?6:12,txt:n=>`Lidiar ${n} toros o novillos`,chk:(s,o)=>s.lid>=o.n},
  {id:'ov',n:2,txt:()=>'Conseguir 2 ovaciones o mejor',chk:s=>s.ov>=2},
  {id:'cash',n:r100(S.money*0.9/1000)*1000,txt:n=>`Cerrar el año con ${eur(n)} o más`,chk:(s,o)=>S.money>=o.n}];
 if(p>=35)pool.push({id:'c1',n:1,txt:()=>'Lidiar en una plaza de primera',chk:s=>s.c1>=1});
 if(p>=50)pool.push({id:'vu',n:1,txt:()=>'Lograr una vuelta al ruedo o un indulto',chk:s=>s.vu+s.ind>=1});
 pool.sort(()=>Math.random()-.5);
 S.objs=pool.slice(0,3).map(o=>({id:o.id,n:o.n,txt:o.txt(o.n),reward:r100(8000+p*120)}));
}
const OBJCHK={lid:(s,o)=>s.lid>=o.n,ov:s=>s.ov>=2,cash:(s,o)=>S.money>=o.n,c1:s=>s.c1>=1,vu:s=>s.vu+s.ind>=1};

/* ============ ofertas y mercado ============ */
function priceFor(cat,tipo){const p=S.pres;let v=cat===1?6000+p*95:cat===2?3400+p*45:1800+p*22;if(tipo==='novillada')v*=.45;return r100(v*R(.9,1.1))}
function genOffers(ahead,init){
 const tgt=absNow()+ahead, tm=tgt%12;
 for(const f of FERIAS){
  if(f.m!==tm)continue;
  if(S.offers.some(o=>o.fid===f.id&&o.abs===tgt))continue;
  if(S.pres<f.minP-10)continue;
  const ch=clamp((S.pres-f.minP+30)/50,.12,.92);
  if(Math.random()<ch)addOffer({fid:f.id,plaza:f.plaza,feria:f.feria,cat:f.cat,tipo:f.tipo,abs:tgt,n:6});
 }
 if(!init||ahead===2){
  if(tm>=3&&tm<=9&&Math.random()<.5){const s=pick(SMALL.filter(x=>x.cat===3));addOffer({...s,tipo:Math.random()<.3?'novillada':'corrida',abs:tgt,n:Math.random()<.5?4:6})}
  if(tm>=5&&tm<=8&&S.pres>=15&&Math.random()<.35){const s=pick(SMALL.filter(x=>x.cat===2));addOffer({...s,tipo:'corrida',abs:tgt,n:6})}
 }
}
function addOffer(o){o.id=S.oid++;o.precio=o.precio||priceFor(o.cat,o.tipo);o.st='nueva';o.toros=[];o.nuevo=true;S.offers.push(o)}
function regenMkt(){
 const own=S.g.enc, encs=Object.keys(ENC);
 const sem=[];for(let i=0;i<3;i++){const enc=Math.random()<.5?own:pick(encs);const g=genes(enc,R(-4,9));const t={g,enc,age:RI(4,6),pelo:pick(ENC[enc].pelos),name:masc(pick(FEM))};const tmp={g};tentar(tmp);t.rev=tmp.rev;t.nota=tmp.nota;t.precio=r100(5000+Math.max(0,t.nota-55)*450);sem.push(t)}
 const lotes=[];for(let i=0;i<2;i++){const enc=i===0?own:pick(encs);const vs=[];for(let k=0;k<5;k++){const g=genes(enc,R(-7,3));const tmp={g};tentar(tmp);vs.push({g,rev:tmp.rev,nota:tmp.nota,age:RI(4,8),pelo:pick(ENC[enc].pelos),name:pick(FEM)})}
  const avg=Math.round(vs.reduce((s,v)=>s+v.nota,0)/5);lotes.push({enc,vacas:vs,nota:avg,precio:r100(5*(1400+Math.max(0,avg-55)*70))})}
 S.mkt={sem,lotes};
}
function eligible(a,o){
 if(!lidiable(a)||a.salud<45)return false;
 const y=ageAt(a,o.abs);
 if(o.tipo==='corrida'){if(y<4||y>(o.cat===3?6:5))return false}else{if(y<2||y>3)return false}
 return a.peso>=MINPESO[o.tipo][o.cat];
}

/* ============ estimaciones ============ */
function est(a){
 if(a.known==='lidia')return {bra:a.g.bra,nob:a.g.nob,fue:a.g.fue,cas:a.g.cas,mode:'real'};
 if(a.known==='tienta')return {bra:a.rev.bra,cas:a.rev.cas,mode:'tienta'};
 if(a.campo)return {bra:a.campo,cas:a.reata?a.reata.cas:null,mode:'campo'};
 if(a.reata)return {bra:a.reata.bra,cas:a.reata.cas,mode:'reata'};
 return {mode:'none'};
}

/* ============ avance de mes ============ */
function log(t){S.log.unshift({d:`${MESES[S.month].slice(0,3)} ${S.year}`,t});S.log=S.log.slice(0,60)}
function advance(){
 const rep={lines:[],corridas:[],cost:0,inc:0};
 const n=campo().length;
 // fin de año
 if(S.month===11){
  const sin=campo().filter(a=>!a.herrado);
  if(sin.length){herradero(true);rep.lines.push(`Herradero obligatorio de fin de año: ${sin.length} becerros marcados con el hierro.`)}
  let ok=0;for(const o of S.objs){o.done=OBJCHK[o.id](S.season,o);if(o.done){ok++;S.money+=o.reward;rep.inc+=o.reward}}
  S.pres=clamp(S.pres+ok*1-(3-ok)*.8,0,100);
  rep.lines.push(`Balance de la temporada: ${ok} de 3 objetivos cumplidos${ok?` (+${eur(ok*S.objs[0].reward)})`:''}.`);
  S.presHist.push({y:S.year,p:Math.round(S.pres)});
  finTemporada(rep,ok);
 }
 if(typeof finTareas==='function')finTareas(rep);
 // gastos
 let feedMod=1;const aMano=(S.fedM||0)>=4;if(aMano){feedMod*=.9;rep.lines.push('Has echado de comer tú mismo: la camada está más tranquila y ahorras un 10 % de pienso.')}S.fedM=0;S.feedSpots=[0,0,0];for(const a of S.animals)if(a.mark&&!S.offers.some(o=>o.id===a.mark&&o.st==='nueva')){a.mark=null;a.encd=false}
 const ev=Math.random()<.42?pick(['pelea','lluvia','sequia','veedor','visita','cojera']):null;
 if(ev==='lluvia'&&[1,2,3,9,10].includes(S.month))feedMod=.72;
 if(ev==='sequia'&&[5,6,7,8].includes(S.month))feedMod=1.35;
 const fc=Math.round(n*FEED[S.feed].c*feedMod*feedMul()), pc=2500+10*n;
 S.money-=fc+pc;rep.cost+=fc+pc;
 rep.lines.push(`Alimentación ${FEED[S.feed].n.toLowerCase()}: ${eur(fc)} · Personal y finca: ${eur(pc)}`);
 // avanzar calendario
 S.month++;if(S.month>11){S.month=0;S.year++;newSeason();rep.lines.push(`Empieza la temporada ${S.year}. Nuevos objetivos de la propiedad.`)}
 if(S.money<0)S.conf=clamp(S.conf-2,0,100);
 if(S.month===1){const c=8*n;S.money-=c;rep.cost+=c;rep.lines.push(`Campaña de saneamiento ganadero: ${eur(c)}.`)}
 // envejecimiento
 if(S.month===0){
  let viejos=0,vv=0,ing=0;
  for(const a of campo()){
   const y=ageY(a);
   if(a.sex==='M'&&!a.role&&a.res==null&&y>=7){a.st='vendido';ing+=a.peso*1.5;viejos++}
   if(a.role==='vaca'&&y>=18){a.st='vendido';ing+=a.peso*1.3;vv++}
  }
  if(viejos||vv){S.money+=ing;rep.inc+=ing;rep.lines.push(`Salen al matadero ${viejos} machos que pasaron de edad y ${vv} vacas muy viejas: +${eur(ing)}.`)}
 }
 // crecimiento y salud
 const f=FEED[S.feed];
 for(const a of campo()){
  const m=ageM(a);if(m<0)continue;
  a.peso=Math.round(Math.min(capPeso(a),a.peso+rate(m,a)*f.m*R(.85,1.15)));
  a.salud=clamp(a.salud+f.s+R(-1.2,1.4)+(a.lesion>0?4:0)+(ev==='lluvia'?1.5:0)+(mej('abrev')?.5:0)+(aMano?.6:0),5,100);
  if(a.lesion>0)a.lesion--;
 }
 // paridera
 if(S.month===2){
  const sem=byId(S.semAct);const p=sem&&sem.st==='campo'&&sem.role==='semental'?sem:null;
  let nb=0,hm=0;
  for(const v of campo().filter(a=>a.role==='vaca')){
   const y=ageY(v);if(y<3)continue;
   const ch=.88*(v.salud/100)-(y>13?(y-13)*.06:0);
   if(Math.random()>ch)continue;
   const fg=p?p.g:genes(v.enc,-6);const g={};for(const k in v.g)g[k]=Math.round(clamp((v.g[k]+fg[k])/2+gauss()*6,15,99));
   const sex=Math.random()<.5?'M':'H';
   let reata=null;const fr=p?p.rev:null;
   if(v.rev&&fr)reata={bra:Math.round((v.rev.bra+fr.bra)/2),cas:Math.round((v.rev.cas+fr.cas)/2)};else if(v.rev)reata={bra:v.rev.bra-3,cas:v.rev.cas-3};
   const c=mk({sex,born:S.year,enc:v.enc,g,name:sex==='H'?v.name:masc(v.name),herrado:false,pelo:Math.random()<.6?v.pelo:pick(ENC[v.enc].pelos),
    madre:{id:v.id,name:v.name,num:v.num},padre:p?{id:p.id,name:p.name,num:p.num}:{id:null,name:'semental prestado',num:null},reata});
   c.peso=32;S.animals.push(c);nb++;if(sex==='M')hm++;
  }
  rep.lines.push(`Paridera: nacen ${nb} becerros (${hm} machos y ${nb-hm} hembras)${p?`, hijos de ${p.name} nº ${p.num}`:' con un semental prestado; asigna uno propio para mejorar la reata'}.`);
 }
 if(S.pres>40)S.pres-=(S.pres-40)*.006;
 // evento
 const males=campo().filter(a=>a.sex==='M'&&ageY(a)>=3&&!a.role);
 if(ev==='pelea'&&males.length>=2&&!(mej('cercas')&&Math.random()<.5)){const v=pick(males);const d=RI(22,50);v.salud=clamp(v.salud-d,5,100);v.lesion=3;rep.lines.push(`Pelea en el cercado: ${v.name} nº ${v.num} sale herido (salud ${Math.round(v.salud)}).`)}
 else if(ev==='lluvia'&&feedMod<1)rep.lines.push('Buenas lluvias: el pasto rebrota, baja el gasto en pienso y mejora la salud de la camada.');
 else if(ev==='sequia'&&feedMod>1)rep.lines.push('Sequía en la dehesa: hay que suplementar más y el pienso sale un 35 % más caro.');
 else if(ev==='veedor'){const s=pick(SMALL);addOffer({...s,tipo:'corrida',abs:absNow()+2,n:s.cat===3?4:6,precio:r100(priceFor(s.cat,'corrida')*1.1)});rep.lines.push(`Un veedor visita la finca y deja una oferta para ${s.plaza}.`)}
 else if(ev==='visita'){S.money+=1500;rep.inc+=1500;rep.lines.push('Visita de aficionados a la finca: +1.500 €.')}
 else if(ev==='cojera'){const a=pick(campo());if(a){a.salud=clamp(a.salud-18,5,100);a.lesion=2;rep.lines.push(`${a.name} nº ${a.num??'s/n'} aparece cojo; el mayoral lo aparta para curarlo.`)}}
 if(mej('casa')){const v=RI(600,1200);S.money+=v;rep.inc+=v;rep.lines.push(`Visitas y catas en el cortijo: +${eur(v)}.`)}
 // corridas del mes
 for(const o of S.offers.filter(o=>o.st==='aceptada'&&o.abs===absNow())){const r=celebrar(o);rep.corridas.push(r);rep.inc+=r.ingreso}
 // ofertas
 for(const o of S.offers)if(o.st==='nueva'&&absNow()>=o.abs){o.st='caducada'}
 S.offers=S.offers.filter(o=>!(o.st==='caducada'||o.st==='rechazada')||absNow()-o.abs<3);
 for(const o of S.offers)o.nuevo=false;
 const before=S.offers.length;genOffers(3);genOffers(2);
 const nuevas=S.offers.length-before;if(nuevas)rep.lines.push(`${nuevas} ${nuevas>1?'nuevas ofertas':'nueva oferta'} de empresas. Míralas en Ofertas.`);
 regenMkt();rivalsTick();
 S.animals=S.animals.filter(a=>a.st==='campo');genRetos(S);
 log(rep.lines[0]);for(const r of rep.corridas)log(`${r.plaza}: ${r.resumen}`);
 save();render();
 if(S.money<-90000||S.conf<=0)return gameOver();
 newsToast(rep);
}
function herradero(auto){
 const sin=campo().filter(a=>!a.herrado);
 for(const a of sin){a.herrado=true;a.num=nextNum(a.born)}
 const c=sin.length*35;S.money-=c;
 if(!auto){log(`Herradero: ${sin.length} becerros marcados.`);toast(`Herradero hecho: ${sin.length} becerros con hierro y número (${eur(c)})`)}
 return sin.length;
}

/* ============ la lidia ============ */
function lidiar(a,o,mat){
 const B=a.g.bra+gauss()*7, N=a.g.nob+gauss()*7, C=a.g.cas+gauss()*6;
 const F=a.g.fue-Math.max(0,(a.peso-580)/3)-(100-Math.min(100,a.salud+(mej('corrales')?4:0)))*.35+gauss()*6;
 const t={id:a.id,name:a.name,num:a.num,peso:a.peso,pelo:a.pelo,enc:a.enc,mat:mat.n,traje:mat.t,estilo:mat.e||'tecnico',B,N,C,F,madre:a.madre,m:morf(a),div:S.g.div};
 const st=t.estilo;
 t.gal=clamp(.75+(F-50)/150+(B-60)/250,.6,1.35);t.rec=clamp((N-40)/45,.15,1);t.hum=clamp((N-45)/45,0,1);t.derr=clamp(((100-N)+(C-60))/80,0,1);
 t.corto=N<60;t.remata=B>74&&Math.random()<.6;t.distraido=B<62;
 t.portagayola=(st==='tremendista'&&Math.random()<.6)||(st==='valiente'&&Math.random()<.2);
 t.derribo=B>80&&F>68&&Math.random()<.45;
 if(F<30){t.res='devuelto';t.trof=0;t.score=30;t.entradas=0;return t}
 t.rajado=B<52&&Math.random()<.7;t.fell=F<48&&Math.random()<.6;
 t.score=.38*B+.30*N+.17*C+.15*F-(t.rajado?12:0)-(t.fell?6:0);
 t.entradas=B>80?3:B>66?2:1;
 t.pases=clamp(Math.round((N-40)/9),2,7);
 if(t.score>=87&&B>=85&&N>=80&&Math.random()<(o.cat===1?.35:.55))t.res='indulto';
 else t.res=t.score>=84?'vuelta':t.score>=76.5?'ovacion':t.score>=64?'silencio':'pitos';
 const q=.5*N+.3*C+.2*F+gauss()*8-(t.fell?8:0)-(t.rajado?15:0);
 t.trof=t.res==='indulto'?2:q>86?2:q>77?1:0;
 if(t.res!=='indulto'){const sk={artista:.55,tecnico:.75,tremendista:.5,valiente:.6,poderoso:.7}[st]||.6;let ent=1;while(Math.random()>clamp(sk+(t.score-70)/150,.2,.92)&&ent<4)ent++;
  t.ent=ent;t.esto=Math.random()<(ent===1?.72:.55)?'entera':'media';t.desc=t.esto==='media'&&Math.random()<.5?RI(1,2):0;t.avisos=ent+t.desc>=5?2:ent+t.desc>=4?1:0;
  if(ent>=2)t.trof=Math.max(0,t.trof-1);if(ent>=3||t.avisos)t.trof=0;if(t.esto==='media'&&t.trof===2)t.trof=1}
 const pc=clamp(.035+(C-65)/350+(65-N)/250+(st==='valiente'?.06:st==='tremendista'?.05:st==='tecnico'?-.02:0),.015,.28);
 if(Math.random()<pc)t.cogida={tercio:Math.random()<.25?'capote':'muleta',pase:RI(1,3),parte:pick(['leve','de pronóstico reservado','de pronóstico menos grave'])};
 return t;
}
function celebrar(o){
 const pool=[...(o.tipo==='novillada'?NOVILLEROS:MATADORES)].sort(()=>Math.random()-.5).slice(0,3);
 const toros=[],hurt=new Set();
 o.toros.forEach((id,i)=>{const a=byId(id);if(!a)return;let mat=pool[i%3];if(hurt.has(mat.n))mat=pool.find(m=>!hurt.has(m.n))||SOBRE;
  const t=lidiar(a,o,mat);if(t.cogida){hurt.add(mat.n);const s=pool.find(m=>!hurt.has(m.n))||SOBRE;t.sust={n:s.n,t:s.t,e:s.e};t.trof=0;if(t.res==='indulto')t.res='vuelta'}toros.push(t)});
 let dp=0;for(const t of toros)dp+=RESPRES[t.res]*CATMUL[o.cat];
 const best=toros.reduce((m,t)=>t.score>m.score?t:m,toros[0]);
 let premio=null;
 if(best&&best.score>=80&&o.cat<=2&&Math.random()<.6){premio=best.name;dp+=3;S.money+=6000;S.stats.premios++}
 const ingreso=o.precio*toros.length+(premio?6000:0);
 S.money+=o.precio*toros.length;S.stats.ingresos+=ingreso;
 S.pres=clamp(S.pres+dp,0,100);
 for(const t of toros){
  const a=byId(t.id);
  if(t.res==='indulto'){a.res=null;a.role='semental';a.tentado=true;a.known='lidia';a.rev={bra:a.g.bra,cas:a.g.cas};a.nota=Math.round(.65*a.g.bra+.35*a.g.cas);a.salud=45;a.lesion=4;a.indultado=`${o.plaza}, ${S.year}`;S.stats.indultos++;S.season.ind++}
  else a.st='lidiado';
  if(a.madre){const m=byId(a.madre.id);if(m)m.hijos.push({name:a.name,num:a.num,res:t.res,score:Math.round(t.score),y:S.year})}
  S.stats.toros++;S.season.lid++;S.stats.orejas+=t.trof;
  if(['vuelta','ovacion','indulto'].includes(t.res))S.season.ov++;
  if(t.res==='vuelta'){S.stats.vueltas++;S.season.vu++}
 }
 S.stats.corridas++;if(o.cat===1)S.season.c1++;
 let pts=0;for(const t of toros)pts+=Math.round((PTS[t.res]||0)*(o.cat===1?1.5:o.cat===2?1.2:1))+t.trof*4;S.season.pts=(S.season.pts||0)+pts;S.season.ore=(S.season.ore||0)+toros.reduce((s,t)=>s+t.trof,0);
 o.st='lidiada';
 const cnt=k=>toros.filter(t=>t.res===k).length;
 const parts=[];for(const k of ['indulto','vuelta','ovacion','silencio','pitos','devuelto']){const c=cnt(k);if(c)parts.push(`${c} ${RESPL[k][c>1?1:0]}`)}
 for(const t of toros)if(t.cogida)parts.push(`cogida de ${t.mat}`);
 const r={id:S.hist.length+1,plaza:o.plaza,feria:o.feria,cat:o.cat,tipo:o.tipo,y:S.year,m:S.month,toros,dp:Math.round(dp*10)/10,ingreso,premio,resumen:parts.join(', '),visto:false,pts};
 S.hist.unshift(r);S.porVer.push(r.id);
 return r;
}

/* ============ dibujo: toro ============ */
function drawBull(c,x,y,s,dir,o){
 const P=PELO[o.pelo]||PELO.negro, base=P[0], hi=P[1];
 const ph=o.ph||0, sp=o.speed||0, k=o.kneel||0, head=o.head??.3, small=o.cow?0.9:1;
 c.save();c.translate(x,y);c.scale(s*dir*small,s*small);
 c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(-4,1,58,7,0,0,Math.PI*2);c.fill();
 const drop=k*14;
 const leg=(hx,hy,ang,len,w,col,front)=>{
  c.save();c.translate(hx,hy);c.rotate(ang);
  const l1=len*.5, bend=front?(k*1.6):0;
  c.fillStyle=col;c.beginPath();c.moveTo(-w/2,0);c.lineTo(w/2,0);c.lineTo(w*.28,l1);c.lineTo(-w*.28,l1);c.fill();
  c.translate(0,l1);c.rotate(bend+(sp>0?Math.max(0,Math.sin(ph+(front?0:Math.PI)))*.4*sp:0)*(front?-1:1));
  c.beginPath();c.moveTo(-w*.28,0);c.lineTo(w*.28,0);c.lineTo(w*.2,len*.5);c.lineTo(-w*.2,len*.5);c.fill();
  c.fillStyle='#120d0a';c.fillRect(-w*.24,len*.5-3,w*.5,4);
  c.restore();};
 const a=.55*sp, lenF=30-k*12, lenR=30-k*4;
 const dark='#0d0a08';
 // patas del fondo
 leg(18,-30+drop,Math.sin(ph+Math.PI)*a,lenF,9,shade(base,-.25),true);
 leg(-30,-34+drop*.3,Math.sin(ph)*a,lenR,12,shade(base,-.25),false);
 // cola
 const sw=Math.sin((o.t||0)*2.2)*6+(sp*8);
 c.strokeStyle=shade(base,-.1);c.lineWidth=2.6;c.lineCap='round';c.beginPath();c.moveTo(-46,-44+drop*.3);c.quadraticCurveTo(-56-sw*.4,-26,-52-sw,-8+drop*.3);c.stroke();
 c.fillStyle=dark;c.beginPath();c.ellipse(-52-sw,-6+drop*.3,3,6,0.2,0,Math.PI*2);c.fill();
 // cuerpo
 c.save();c.translate(0,drop*.6);
 const body=new Path2D('M-46,-44 C-30,-53 -6,-50 8,-57 C18,-67 30,-65 36,-53 L40,-40 C38,-27 31,-21 22,-20 C5,-16 -20,-18 -38,-22 C-50,-26 -53,-38 -46,-44 Z');
 const gr=c.createLinearGradient(0,-66,0,-18);gr.addColorStop(0,hi);gr.addColorStop(1,base);
 c.fillStyle=gr;c.fill(body);
 if(P[2]){c.save();c.clip(body);const rnd=mulberry(o.seed||7);
  if(P[2]===1){c.fillStyle='rgba(225,225,225,.20)';for(let i=0;i<90;i++){c.fillRect(-52+rnd()*92,-66+rnd()*48,1.4,1.4)}}
  else {c.fillStyle='#ece4d6';for(let i=0;i<4;i++){c.beginPath();c.ellipse(-40+rnd()*65,-46+rnd()*24,6+rnd()*8,4+rnd()*6,rnd()*3,0,Math.PI*2);c.fill()}}
  c.restore();}
 c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;c.stroke(body);
 // banderillas
 for(let i=0;i<(o.band||0);i++){const bx=14+i*5,by=-62+i*1.5;
  c.save();c.translate(bx,by);c.rotate(-.5+i*.15);c.fillStyle='#e8e1d0';c.fillRect(-1,-22,2,22);
  const cols=['#bf3a3f','#e6bb55','#1f6b3a','#3a78b8'];for(let j=0;j<4;j++){c.fillStyle=cols[(i+j)%4];c.fillRect(-2.5,-22+j*3.5,5,3)}c.restore();}
 // cabeza
 c.save();c.translate(36,-48);c.rotate(-.15+head*.85);
 c.fillStyle=shade(base,.06);c.beginPath();c.moveTo(-4,-9);c.lineTo(10,-10);c.bezierCurveTo(17,-9,21,0,21,8);c.lineTo(17,15);c.bezierCurveTo(10,16,3,11,-2,6);c.closePath();c.fill();
 c.fillStyle=shade(base,-.35);c.beginPath();c.ellipse(18,11,4.2,3.6,0,0,Math.PI*2);c.fill();
 c.fillStyle='#0a0806';c.beginPath();c.arc(10,-2,1.5,0,Math.PI*2);c.fill();
 c.fillStyle=shade(base,-.1);c.beginPath();c.ellipse(1,-7,5,2.4,-.6,0,Math.PI*2);c.fill();
 const horn=(ox,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(3+ox,-8);c.quadraticCurveTo(9+ox,-26,24+ox,-25);c.lineTo(24+ox,-23.4);c.quadraticCurveTo(12+ox,-22,8+ox,-6);c.closePath();c.fill();
  c.fillStyle='#2a2117';c.beginPath();c.arc(24+ox,-24.2,1.3,0,Math.PI*2);c.fill()};
 horn(-3,'#b9aa8c');horn(0,'#e2d6bc');
 c.restore();
 c.restore();
 // patas delanteras
 leg(24,-30+drop,Math.sin(ph)*a,lenF,10,base,true);
 leg(-24,-34+drop*.3,Math.sin(ph+Math.PI)*a,lenR,13,base,false);
 c.restore();
}
function shade(hex,p){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.round(clamp(p<0?v*(1+p):v+(255-v)*p,0,255));return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1)}

/* ============ dibujo: personas ============ */
function drawTorero(c,x,y,s,o){
 const face=o.face||1, traje=o.traje||'#7a1525', gold=o.plata?'#cfd4d8':'#e6bb55';
 c.save();c.translate(x,y);c.scale(s*face,s);
 c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,1,14,3,0,0,Math.PI*2);c.fill();
 const run=o.run||0, ph=o.ph||0;
 c.strokeStyle='#e8a9b4';c.lineWidth=3;c.lineCap='round';
 c.beginPath();c.moveTo(-2,-22);c.lineTo(-3-Math.sin(ph)*5*run,0);c.moveTo(2,-22);c.lineTo(3+Math.sin(ph)*5*run,0);c.stroke();
 c.fillStyle='#111';c.fillRect(-6-Math.sin(ph)*5*run,-2,5,2);c.fillRect(1+Math.sin(ph)*5*run,-2,5,2);
 c.fillStyle=traje;c.beginPath();c.moveTo(-5,-36);c.lineTo(5,-36);c.lineTo(5,-20);c.lineTo(-5,-20);c.fill();
 c.fillStyle=gold;c.fillRect(-5,-30,10,1.5);c.fillRect(-5.5,-22,2,3);c.fillRect(3.5,-22,2,3);
 c.fillStyle=traje;c.beginPath();c.moveTo(-7,-50);c.lineTo(7,-50);c.lineTo(6,-36);c.lineTo(-6,-36);c.fill();
 c.fillStyle=gold;c.fillRect(-7,-50,3,14);c.fillRect(4,-50,3,14);c.beginPath();c.arc(-7,-48,3,0,Math.PI*2);c.arc(7,-48,3,0,Math.PI*2);c.fill();
 c.fillStyle='#d6a47c';c.beginPath();c.arc(0,-55,4.3,0,Math.PI*2);c.fill();
 c.fillStyle='#141414';c.beginPath();c.ellipse(0,-59,6,2.6,0,0,Math.PI*2);c.fill();c.beginPath();c.arc(-4,-59,2.2,0,Math.PI*2);c.arc(4,-59,2.2,0,Math.PI*2);c.fill();
 if(o.arms){c.strokeStyle=traje;c.lineWidth=2.6;c.beginPath();c.moveTo(-6,-48);c.lineTo(-10,-62);c.moveTo(6,-48);c.lineTo(10,-62);c.stroke();
  for(const sx of [-10,10]){c.fillStyle='#e8e1d0';c.fillRect(sx-.8,-74,1.6,13);c.fillStyle=sx<0?'#bf3a3f':'#e6bb55';c.fillRect(sx-2,-74,4,6)}}
 if(o.cape==='muleta'){
  const sw=o.sweep||0;
  c.strokeStyle=traje;c.lineWidth=2.6;c.beginPath();c.moveTo(5,-47);c.lineTo(12+sw*6,-36);c.stroke();
  c.strokeStyle='#d8c9a4';c.lineWidth=1.4;c.beginPath();c.moveTo(12+sw*6,-36);c.lineTo(26+sw*16,-34);c.stroke();
  c.fillStyle='#b01e2a';c.beginPath();c.moveTo(12+sw*6,-36);c.lineTo(26+sw*16,-34);c.quadraticCurveTo(30+sw*22,-14,24+sw*26,-4);c.quadraticCurveTo(14+sw*12,-6,8+sw*4,-12);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.moveTo(18+sw*10,-30);c.quadraticCurveTo(24+sw*18,-16,22+sw*22,-6);c.lineTo(18+sw*16,-7);c.closePath();c.fill();
 }
 if(o.cape==='capote'){
  const sw=o.sweep||0;
  c.strokeStyle=traje;c.lineWidth=2.6;c.beginPath();c.moveTo(-5,-47);c.lineTo(-2+sw*4,-40);c.moveTo(5,-47);c.lineTo(16+sw*10,-42);c.stroke();
  c.fillStyle='#c43f78';c.beginPath();c.moveTo(-2+sw*4,-40);c.lineTo(16+sw*10,-42);c.quadraticCurveTo(34+sw*24,-24,30+sw*30,-2);c.lineTo(4+sw*8,-2);c.quadraticCurveTo(-4+sw*2,-18,-2+sw*4,-40);c.fill();
  c.fillStyle='#e6bb55';c.beginPath();c.moveTo(16+sw*10,-42);c.quadraticCurveTo(34+sw*24,-24,30+sw*30,-2);c.lineTo(26+sw*26,-2);c.quadraticCurveTo(28+sw*20,-24,14+sw*9,-40);c.fill();
 }
 c.restore();
}
function drawPicador(c,x,y,s,face,push){
 c.save();c.translate(x,y);c.scale(s*face,s);
 c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,1,48,7,0,0,Math.PI*2);c.fill();
 c.fillStyle='#4a3326';for(const lx of [-30,-22,22,30]){c.fillRect(lx-3,-30,6,30)}
 c.fillStyle='#5c3f2e';c.beginPath();c.ellipse(0,-40,40,15,0,0,Math.PI*2);c.fill();
 c.beginPath();c.moveTo(30,-48);c.quadraticCurveTo(46,-70,54,-66);c.lineTo(58,-56);c.quadraticCurveTo(48,-52,38,-36);c.fill();
 c.fillStyle='#d9ccb0';c.beginPath();c.moveTo(-34,-52);c.quadraticCurveTo(0,-58,36,-52);c.lineTo(38,-18);c.quadraticCurveTo(0,-12,-36,-18);c.closePath();c.fill();
 c.strokeStyle='rgba(90,70,45,.45)';c.lineWidth=1;for(let i=-28;i<36;i+=8){c.beginPath();c.moveTo(i,-54);c.lineTo(i+2,-16);c.stroke()}
 c.fillStyle='#e7d9b4';c.fillRect(-6,-74,12,20);
 c.fillStyle='#c9a15a';c.fillRect(-4,-78,8,6);
 c.fillStyle='#d6a47c';c.beginPath();c.arc(0,-82,4.4,0,Math.PI*2);c.fill();
 c.fillStyle='#d8c08a';c.beginPath();c.ellipse(0,-86,11,3,0,0,Math.PI*2);c.fill();c.beginPath();c.arc(0,-88,5,Math.PI,0);c.fill();
 c.strokeStyle='#cbb98f';c.lineWidth=2;c.beginPath();c.moveTo(-2,-70);c.lineTo(60+push*4,-60);c.stroke();
 c.restore();
}

/* ============ plaza ============ */
function mkCrowd(W,H){const r=mulberry(99),cols=['#e9dcc5','#3a4b6e','#8a2f2a','#262626','#c79a45','#6b7d8f','#efe7da','#56634a'];const a=[];
 const top=H*.06, bot=H*.34;for(let y=top;y<bot;y+=H*.022){for(let x=4;x<W;x+=W*.012+r()*3){a.push({x:x+r()*2,y:y+r()*2,c:cols[Math.floor(r()*cols.length)],p:r()*6,w:r()})}}return a}
function drawRing(c,W,H,cr,t,pan){
 const g=c.createLinearGradient(0,0,0,H*.36);g.addColorStop(0,'#2d241d');g.addColorStop(1,'#5a4636');c.fillStyle=g;c.fillRect(0,0,W,H*.37);
 c.fillStyle='rgba(0,0,0,.18)';for(let y=H*.06;y<H*.35;y+=H*.044)c.fillRect(0,y,W,1);
 const pf=pan?pan.frac:0;
 for(const p of cr){let col=p.c,dx=0,dy=0,sz=Math.max(1.4,W/330);
  if(pan&&p.w<pf){col='#f6f2ea';dx=Math.sin(t*9+p.p)*sz*1.4;dy=-sz*1.6;sz*=1.3}
  c.fillStyle=col;c.fillRect(p.x+dx,p.y+dy,sz,sz)}
 // palco presidencial
 const px=W*.5;c.fillStyle='#7a1d22';c.fillRect(px-W*.06,H*.02,W*.12,H*.07);c.fillStyle='#e6bb55';c.fillRect(px-W*.06,H*.085,W*.12,2);
 if(pan&&pan.palco){c.fillStyle=pan.palco;const fl=Math.sin(t*6)*3;c.beginPath();c.moveTo(px-6,H*.09);c.lineTo(px+12,H*.09+fl*.3);c.lineTo(px+10,H*.16+fl);c.lineTo(px-8,H*.15);c.fill()}
 // barrera
 c.fillStyle='#8e2a26';c.fillRect(0,H*.37,W,H*.08);
 c.fillStyle='rgba(0,0,0,.2)';for(let x=0;x<W;x+=W*.035)c.fillRect(x,H*.37,1,H*.08);
 c.fillStyle='#d6c7a6';c.fillRect(0,H*.37,W,3);
 for(const bx of [.27,.73]){c.fillStyle='#9f342f';c.fillRect(W*bx-W*.04,H*.385,W*.08,H*.075);c.fillStyle='#d6c7a6';c.fillRect(W*bx-W*.04,H*.385,W*.08,2)}
 c.fillStyle='#24160f';c.fillRect(W*.025,H*.378,W*.07,H*.072);c.strokeStyle='#d6c7a6';c.lineWidth=2;c.strokeRect(W*.025,H*.378,W*.07,H*.072);
 // albero
 const a=c.createLinearGradient(0,H*.45,0,H);a.addColorStop(0,'#c8914b');a.addColorStop(1,'#e0ad63');c.fillStyle=a;c.fillRect(0,H*.45,W,H*.55);
 c.strokeStyle='rgba(255,250,235,.55)';c.lineWidth=1.5;
 for(const k of [1,1.5]){c.beginPath();c.ellipse(W*.5,H*.45,W*.42*k,H*.16*k,0,0,Math.PI);c.stroke()}
}

/* ============ render principal ============ */
function render(){
 const app=$('#app');
 if(!S){app.innerHTML=startScreen();return}
 if(!TABS.some(t=>t[0]===UI.tab))UI.tab='inicio';
 const nuevas=S.offers.filter(o=>o.st==='nueva').length,pend=pendientes();
 const L=nivel();
 app.innerHTML=`
 <header class="hdr"><div class="bgimg" style="background-image:url(img/cabeza.jpg)"></div><div class="wrap">
  ${emblem(S.g,54)}
  <div class="id"><div class="gname">${esc(S.g.name)}</div><div class="gsub">${estrellas(S.pres)}<span>${esc(subtitulo())}</span></div></div>
  <div class="lvl" title="Valoración y nivel"><span class="ring"><b>${valoracion()}</b></span><span><span class="lt">Nivel ${L.n}</span><span class="lb"><i style="width:${L.p}%"></i></span></span></div>
 </div></header>
 <div class="sbar"><div class="wrap">
  <div class="st"><span class="it hm">${ICO.cal}<span class="l">${MESES[S.month]} ${S.year}</span><span class="s">${MESES[S.month].slice(0,3)} ${String(S.year).slice(2)}</span></span><span class="it">${ICO.monG}<b class="num">${eur(S.money)}</b></span><span class="it">${ICO.star}<span><span class="l">Prestigio </span><b class="num">${Math.round(S.pres)}</b></span></span></div>
  <button class="go" onclick="advance()" aria-label="Avanzar al mes siguiente">Avanzar ${ICO.chev}</button>
 </div></div>
 <main><div class="wrap" id="scr"></div></main>
 <nav class="tabs" aria-label="Secciones"><div class="wrap">${TABS.map(([k,l,i])=>{const b=k==='ofertas'?nuevas:k==='tareas'?pend:0;return `<button aria-current="${UI.tab===k}" onclick="go('${k}')">${ICO[i]}<span>${l}</span>${b?`<span class="bdg">${b}</span>`:''}</button>`}).join('')}</div></nav>`;
 const scr=$('#scr');
 ({inicio:renderInicio,finca:renderFinca,camada:renderCamada,ofertas:renderOfertas,mercado:renderMercado,tareas:renderTareas,palmares:renderPalmares})[UI.tab](scr);
}
const TABS=[['inicio','Inicio','casa'],['finca','Finca','finca'],['camada','Ganadería','toro'],['ofertas','Ofertas','mon'],['mercado','Mercado','bolsa'],['tareas','Tareas','tareas'],['palmares','Perfil','perfil']];
function go(t){UI.tab=t;const nt=document.getElementById('newsT');if(nt)nt.hidden=true;try{navigator.vibrate&&navigator.vibrate(6)}catch(e){}render();window.scrollTo(0,0)}
const ICO={
 casa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5M5.5 10v10h5v-6h3v6h5V10"/></svg>',
 finca:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M2 20h20M4 20v-8l5-4 5 4v8M9 20v-4h0M14 12l4-3 4 3v8M7 13h4M17 13h2"/></svg>',
 toro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 5c.5 3 2.5 4.5 5 4.5M21 5c-.5 3-2.5 4.5-5 4.5M7.5 9.5h9L15 17l-3 3-3-3z"/><circle cx="10.3" cy="12.8" r=".7" fill="currentColor"/><circle cx="13.7" cy="12.8" r=".7" fill="currentColor"/></svg>',
 mon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6M5 10v4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-4M5 14v4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-4"/></svg>',
 bolsa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 8h16l-1.2 12H5.2zM8.5 8V6.5a3.5 3.5 0 0 1 7 0V8M9 13h6"/></svg>',
 tareas:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8.5 10h7M8.5 14h7M8.5 18h4"/></svg>',
 perfil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="#e6bb55"><rect x="3" y="5" width="18" height="16" rx="2.5"/><rect x="3" y="5" width="18" height="5" rx="2.5" fill="#b8862e"/><rect x="7" y="2.5" width="2" height="5" rx="1"/><rect x="15" y="2.5" width="2" height="5" rx="1"/><g fill="#3a2a0c"><rect x="6.5" y="12.5" width="3" height="2.4" rx=".5"/><rect x="10.5" y="12.5" width="3" height="2.4" rx=".5"/><rect x="14.5" y="12.5" width="3" height="2.4" rx=".5"/><rect x="6.5" y="16.3" width="3" height="2.4" rx=".5"/><rect x="10.5" y="16.3" width="3" height="2.4" rx=".5"/></g></svg>',
 monG:'<svg viewBox="0 0 24 24"><g fill="#e6bb55" stroke="#8a6420" stroke-width=".8"><ellipse cx="12" cy="17.5" rx="7.5" ry="3"/><ellipse cx="12" cy="13" rx="7.5" ry="3"/><ellipse cx="12" cy="8.5" rx="7.5" ry="3"/></g></svg>',
 star:'<svg viewBox="0 0 24 24"><path fill="#e6bb55" stroke="#8a6420" stroke-width=".6" d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
 kg:'<svg viewBox="0 0 24 24" fill="#e6bb55"><path d="M9 7a3 3 0 1 1 6 0h-1.6a1.4 1.4 0 1 0-2.8 0z"/><path d="M7.2 8h9.6l2.4 12.4c.1.6-.3 1.1-.9 1.1H5.7c-.6 0-1-.5-.9-1.1z"/></svg>',
 pulso:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2.5-6 4 13 3-9 1.5 2H22"/></svg>',
 chev:'<svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
 escudo:'<svg viewBox="0 0 24 24" fill="none" stroke="#e6bb55" stroke-width="1.6"><path d="M12 2.5 20 6v6c0 5-3.5 8.3-8 9.5-4.5-1.2-8-4.5-8-9.5V6z"/><path d="M8.5 9c.4 1.6 1.5 2.3 2.6 2.3M15.5 9c-.4 1.6-1.5 2.3-2.6 2.3M10 11.3h4l-.8 3.6-1.2 1.2-1.2-1.2z" stroke-width="1.3"/></svg>',
 portapapeles:'<svg class="ico" viewBox="0 0 24 24"><rect x="4.5" y="4" width="15" height="18" rx="2" fill="#e6bb55"/><rect x="8.5" y="2.5" width="7" height="3.5" rx="1" fill="#b8862e"/><g fill="#3a2a0c"><rect x="7.5" y="9" width="9" height="1.6" rx=".8"/><rect x="7.5" y="12.6" width="9" height="1.6" rx=".8"/><rect x="7.5" y="16.2" width="6" height="1.6" rx=".8"/></g></svg>',
 plazaI:'<svg viewBox="0 0 24 24" fill="none" stroke="#e6bb55" stroke-width="1.6"><ellipse cx="12" cy="15" rx="9" ry="4.5"/><path d="M3 15V9.5C3 6.7 7 4.5 12 4.5s9 2.2 9 5V15M7 6v4M12 4.5v4.5M17 6v4"/></svg>',
 toroG:'<svg viewBox="0 0 24 24" fill="#e6bb55"><path d="M2.5 4.5c.6 3.6 2.9 5.3 5.7 5.3h7.6c2.8 0 5.1-1.7 5.7-5.3-1.6 2-3.4 2.4-5.6 2.4H8.1c-2.2 0-4-.4-5.6-2.4z"/><path d="M8 10.5h8l-1.4 7.2L12 21l-2.6-3.3z"/></svg>',
 cortijo:'<svg class="ico" viewBox="0 0 32 24" fill="#241703"><path d="M1 22h30v1.5H1zM9 22V12l5-4 5 4v10zM12.5 22v-4h3v4zM20 22v-6h6v6zM2.5 22l2-7 2 7zM27 22l1.8-6 1.8 6zM13.2 13h1.6v1.6h-1.6z"/></svg>',
 martillo:'<svg class="ico" viewBox="0 0 24 24" fill="#e6bb55"><path d="M13.5 3.5 20 10l-2.2 2.2-2-2-9.5 9.6a1.6 1.6 0 0 1-2.2-2.2l9.6-9.5-2-2z"/></svg>',
 capote:'<svg class="ti" viewBox="0 0 24 24" fill="#e6bb55"><circle cx="14" cy="4" r="2"/><path d="M13 6.5h2.5l1 4-1.5.5-.5 9h-1.5l-.3-6-1 6H10l1-9zM16 7l5 13c-4 1.5-11 1.5-17.5-.5L9 9z" opacity=".85"/></svg>',
 vaca:'<svg class="ti" viewBox="0 0 32 24" fill="#e6bb55"><path d="M4 7c-1.5 0-2.5 1.2-2.5 2.5S2.6 12 4 12h1c.8 1.2 1 4.5.8 9h2l1-5c3.2.8 7 .8 10.5 0l1 5h2c.2-3 .4-6 1.6-8 1-1.8 1.2-4.2.6-6-3.8-1.4-10-1.4-14-.6C9.8 5.2 8.2 4 6 4.5L5 3 4 4.5z"/><path d="M26.5 7.5c1.8.2 3.3-.4 4-1.8M29 8.6l.5 2.6" stroke="#e6bb55" stroke-width="1.2" fill="none"/></svg>',
 feria:'<svg viewBox="0 0 24 24" fill="none" stroke="#e6bb55" stroke-width="1.6"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"/></svg>'
};
const MEDAL={
 corona:'<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#1a1408" stroke="currentColor" stroke-width="1.5"/><path fill="#e6bb55" d="M6.5 15.5 5.5 8.5l3.6 2.8L12 6.5l2.9 4.8 3.6-2.8-1 7z"/><rect x="6.5" y="16" width="11" height="1.8" rx=".6" fill="#e6bb55"/></svg>',
 estrella:'<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#1a1408" stroke="currentColor" stroke-width="1.5"/><path fill="#e6bb55" d="m12 5.5 2 4.2 4.5.5-3.4 3.1.9 4.5-4-2.3-4 2.3.9-4.5L5.5 10.2l4.5-.5z"/></svg>',
 escudo:'<svg class="medal" viewBox="0 0 24 24"><path fill="#1a1408" stroke="currentColor" stroke-width="1.5" d="M12 2 20 5.5v6c0 5-3.6 8.5-8 10.2-4.4-1.7-8-5.2-8-10.2v-6z"/><path fill="#e6bb55" d="M12 6.5 16 8.3v3.3c0 2.6-1.7 4.5-4 5.4-2.3-.9-4-2.8-4-5.4V8.3z"/></svg>',
 llama:'<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#1a0a08" stroke="currentColor" stroke-width="1.5"/><path fill="#ff7a3c" d="M12.3 4.8c.4 2.4 3.9 3.7 3.9 7.6a4.2 4.2 0 0 1-8.4 0c0-2 1.2-3 1.8-4 .3 1.4.9 2 1.6 2.2-.4-2 .2-3.9 1.1-5.8z"/><path fill="#ffd36b" d="M12 11.5c.2 1.1 1.8 1.6 1.8 3.2a1.8 1.8 0 0 1-3.6 0c0-.9.6-1.4 1.8-3.2z"/></svg>',
 toro:'<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#101318" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="M5.5 7c.4 2.4 2 3.6 3.8 3.6h5.4c1.8 0 3.4-1.2 3.8-3.6-1.1 1.4-2.3 1.6-3.8 1.6H9.3C7.8 8.6 6.6 8.4 5.5 7zM9.2 11.2h5.6l-1 5L12 18.4l-1.8-2.2z"/></svg>'
};
function emblem(g,sz){const L=esc(((g&&g.hierro&&g.hierro.l)||'?').slice(0,2).toUpperCase());
 return `<svg class="emb" width="${sz}" height="${sz}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="eg${sz}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3a0"/><stop offset=".45" stop-color="#e6bb55"/><stop offset="1" stop-color="#9a6a1c"/></linearGradient></defs>
 <path fill="url(#eg${sz})" d="M2 8c2 12 8.5 17.5 17 17.5h1.5L19 30C9 30 3.5 21 2 8zM62 8c-2 12-8.5 17.5-17 17.5h-1.5L45 30C55 30 60.5 21 62 8z"/>
 <path fill="url(#eg${sz})" d="M16 22h32l-2.4 4.6-5.8 19.6L32 58l-7.8-11.8-5.8-19.6z"/><path fill="#0c0e13" d="M21.5 26h21l-4.6 17.6L32 52.5l-5.9-8.9z" opacity=".92"/>
 <text x="32" y="${L.length>1?42:44}" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="${L.length>1?13:17}" fill="url(#eg${sz})">${L}</text></svg>`}
function hierroSVG(h,sz,col){
 h=h||{l:'?',a:'none'};const L=esc((h.l||'?').slice(0,2).toUpperCase());
 let ad='';
 if(h.a==='corona')ad=`<path d="M17 13 L21 6 L26 12 L30 4 L34 12 L39 6 L43 13" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
 if(h.a==='barra')ad=`<path d="M12 52 H48" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
 if(h.a==='circulo')ad=`<circle cx="30" cy="31" r="25" fill="none" stroke="${col}" stroke-width="3.5"/>`;
 if(h.a==='media')ad=`<path d="M10 40 A20 20 0 0 0 50 40" fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>`;
 return `<svg class="hierro" width="${sz}" height="${sz}" viewBox="0 0 60 60" aria-hidden="true">${ad}<text x="30" y="${h.a==='media'?34:40}" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="${L.length>1?22:28}" fill="${col}">${L}</text></svg>`;
}
const divisa=d=>`<span class="div" aria-hidden="true"><i style="background:${d[0]}"></i><i style="background:${d[1]}"></i></span>`;
function subtitulo(){return S.g.real?`Ganadería · encaste ${S.g.enc}`:`Ganadería fundada en ${S.g.fund||2027}`}
function nivel(){const st=S.stats||{};const xp=Math.round((S.xp||0)+S.pres*6+(st.corridas||0)*25+(st.indultos||0)*150+(st.vueltas||0)*40);return {n:1+Math.floor(xp/100),p:xp%100}}
const FAMP={negro:'negro',burraco:'negro',entrepelado:'negro','cárdeno':'cardeno',salinero:'cardeno',colorado:'colorado','castaño':'castano',jabonero:'jabonero'};
function retrato(a){return `img/toro-${FAMP[a.pelo]||'negro'}-${(a.id*7+3)%8}.jpg`}
function calidad(a){const e=est(a);let q;
 if(a.role==='vaca'||a.role==='semental')q=a.nota!=null?a.nota:(e.bra||62);
 else q=(e.bra!=null?e.bra:62)*.72+a.g.tra*.28;
 const T=[[90,'rojo','Leyenda','llama'],[85,'oro','Figura','corona'],[80,'morado','Excelente','estrella'],[75,'azul','Notable','escudo'],[68,'verde','Bueno','toro'],[0,'gris','Común','toro']];
 const t=T.find(x=>q>=x[0]);let medal=t[3];if((e.cas||0)>=86)medal='llama';if(a.role==='semental')medal='corona';
 return {k:t[1],n:t[2],medal,q:Math.round(q)}}
function pendientes(){let n=0;const c=campo();if(S.porVer.length)n++;if(S.offers.some(o=>o.st==='nueva'))n++;if(S.month>=7&&c.some(a=>!a.herrado))n++;if(c.some(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2))n++;if(S.roto)n++;if(S.escapado)n++;if(c.some(a=>a.salud<55))n++;return n}

/* ============ pantalla de inicio ============ */
let NEWG={name:'',l:'',a:'circulo',c1:'#1f6b3a',c2:'#e6bb55',enc:'Domecq',prov:'Salamanca'};
function startScreen(){
 const sv=load();
 return `<main style="padding-block:max(14px,env(safe-area-inset-top,0px)) 40px"><div class="wrap stack" style="gap:1.1rem">
 <div class="hero2"><div class="img" style="background-image:url(img/hero.jpg)"></div><div class="txt"><div class="k">Modo carrera · ganadero de bravo</div><h1>Hierro y Divisa</h1><div class="tag">Tradición<i>·</i>Pasión<i>·</i>Toros</div></div></div>
 ${sv&&sv.g?`<button class="btn oro adv" onclick="continuar()">Continuar · ${esc(sv.g.name)} · ${MESES[sv.month]} ${sv.year}</button>`:''}
 <section class="sect"><header><h2>Ganaderías históricas</h2></header>
  <div class="list">${GANADERIAS.map((g,i)=>`<button class="gan" onclick="startReal(${i})">${emblem({hierro:{l:g.name[0]}},44)}
   <span style="min-width:0"><b>${esc(g.name)}</b><br><small class="muted">Encaste ${g.enc} · prestigio ${g.pres}</small><div class="pres"><i style="width:${g.pres}%"></i></div></span>${divisa(g.div)}</button>`).join('')}</div>
 </section>
 <section class="sect card goldline"><header><h2>Funda tu ganadería</h2></header>
  <small class="muted">20 vacas, un semental y plazas de tercera para empezar.</small>
  <div class="field"><label class="lbl" for="ng-name">Nombre</label><input type="text" id="ng-name" maxlength="32" placeholder="Ej.: Hermanos Valdeolmos" value="${esc(NEWG.name)}" oninput="NEWG.name=this.value;updPrev()"></div>
  <div class="two">
   <div class="field"><label class="lbl" for="ng-l">Letras del hierro</label><input type="text" id="ng-l" maxlength="2" placeholder="VH" value="${esc(NEWG.l)}" oninput="NEWG.l=this.value;updPrev()"></div>
   <div class="field"><span class="lbl">Adorno</span><div class="chips">${[['none','Solo'],['circulo','Círculo'],['corona','Corona'],['barra','Barra'],['media','Media luna']].map(([k,l])=>`<button class="chip" aria-pressed="${NEWG.a===k}" onclick="NEWG.a='${k}';rerStart()">${l}</button>`).join('')}</div></div>
  </div>
  <div class="two">
   <div class="field"><span class="lbl">Divisa · color 1</span><div class="colors">${COLORES.map(c=>`<button aria-label="Color ${c}" style="background:${c}" aria-pressed="${NEWG.c1===c}" onclick="NEWG.c1='${c}';rerStart()"></button>`).join('')}</div></div>
   <div class="field"><span class="lbl">Divisa · color 2</span><div class="colors">${COLORES.map(c=>`<button aria-label="Color ${c}" style="background:${c}" aria-pressed="${NEWG.c2===c}" onclick="NEWG.c2='${c}';rerStart()"></button>`).join('')}</div></div>
  </div>
  <div class="field"><span class="lbl">Encaste fundacional</span><div class="chips">${Object.keys(ENC).map(k=>`<button class="chip" aria-pressed="${NEWG.enc===k}" onclick="NEWG.enc='${k}';rerStart()">${k}</button>`).join('')}</div>
   <small class="muted">${ENC[NEWG.enc].d}</small></div>
  <div class="field"><label class="lbl" for="ng-prov">Provincia de la finca</label><select id="ng-prov" onchange="NEWG.prov=this.value">${PROVINCIAS.map(p=>`<option ${p===NEWG.prov?'selected':''}>${p}</option>`).join('')}</select></div>
  <div class="row" id="prev" style="padding:.4rem 0">${prevHTML()}</div>
  <button class="btn pri adv" onclick="startNew()">Fundar ganadería ${ICO.chev}</button>
 </section></div></main>`;
}
function prevHTML(){return `${emblem({hierro:{l:NEWG.l||'?'}},56)}${hierroSVG({l:NEWG.l||'?',a:NEWG.a},48,'var(--oro)')}<div><div style="font-family:var(--serif);font-weight:700;font-size:1.1rem">${esc(NEWG.name||'Tu ganadería')}</div><div class="row" style="gap:.4rem">${divisa([NEWG.c1,NEWG.c2])}<small class="muted">Encaste ${NEWG.enc} · ${NEWG.prov}</small></div></div>`}
function updPrev(){const p=$('#prev');if(p)p.innerHTML=prevHTML()}
function rerStart(){const y=window.scrollY;render();window.scrollTo(0,y)}
function startReal(i){const g=GANADERIAS[i];newGame({real:true,name:g.name,enc:g.enc,pres:g.pres,div:g.div,hierro:{l:g.name[0],a:'none'},prov:''})}
function startNew(){const n=NEWG.name.trim();if(!n){toast('Ponle nombre a tu ganadería');$('#ng-name').focus();return}
 newGame({real:false,name:n,enc:NEWG.enc,div:[NEWG.c1,NEWG.c2],hierro:{l:(NEWG.l.trim()||n[0]),a:NEWG.a},prov:NEWG.prov,fund:2027})}
function continuar(){S=load();if(!S.animals){S=null;return}migrate(S);if(!S.mej)S.mej=S.g.real?{placita:1,corrales:1,comederos:1,abrev:1,cercas:1,casa:1}:{};UI.tab='inicio';render()}

/* ============ INICIO ============ */
function offerCard(o){
 const elig=campo().filter(a=>eligible(a,o)).length,min=MINPESO[o.tipo][o.cat],img=o.cat===1?(o.id%2?'plaza-1':'plaza-2'):(o.id%2?'plaza-2':'plaza-1');
 return `<article class="ofc"><div class="pic c${o.cat}" style="background-image:url(img/${img}.jpg)"></div>
  <div class="row" style="gap:.45rem"><span class="badge ${o.cat===1?'oro':''}">Plaza de ${['','primera','segunda','tercera'][o.cat]}</span><span class="badge">${o.tipo==='novillada'?'Novillada':'Corrida de toros'}</span>${o.st==='aceptada'?'<span class="badge ok">Anunciada</span>':''}</div>
  <div class="pl">${esc(o.plaza)}</div>
  <div class="meta">
   <div class="m">${ICO.cal.replace('<svg','<svg class="ico"')}<span><small>Fecha</small><b>${MESES[o.abs%12]} ${Math.floor(o.abs/12)}</b></span></div>
   <div class="m">${ICO.toroG.replace('<svg','<svg class="ico"')}<span><b>${o.n}</b> ${o.tipo==='novillada'?'novillos':'toros'}</span></div>
   <div class="m">${ICO.monG.replace('<svg','<svg class="ico"')}<span><b>${eur(o.precio)}</b>/cabeza</span></div>
   <div class="m">${ICO.kg.replace('<svg','<svg class="ico"')}<span>mín. <b>${min} kg</b></span></div>
   <div class="m">${ICO.feria.replace('<svg','<svg class="ico"')}<span>${esc(o.feria)}</span></div>
  </div>
  ${o.st==='nueva'?`<div class="acts"><button class="btn pri" ${elig<o.n?'disabled':''} onclick="resena(${o.id})">Reseñar toros (${elig} aptos)${ICO.chev}</button><button class="btn" onclick="rechazar(${o.id})">Rechazar${ICO.chev}</button></div>
   ${elig<o.n?`<div class="note" style="color:var(--warn)">Te faltan animales aptos: necesitas ${o.n} ${o.tipo==='novillada'?'erales o utreros':'cuatreños o cinqueños'} de ${min} kg o más, sin tentar.</div>`:''}<div class="note">Responde antes de ${MESES[(o.abs-1+12)%12]}.</div>`
  :`<div style="font-size:.9rem">${o.toros.map(id=>{const a=byId(id);return a?`${esc(a.name)} <span class="mono muted">${a.num}</span>`:''}).join(' · ')}</div><div class="note">Total: ${eur(o.precio*o.toros.length)} al lidiarse.</div>`}
 </article>`}
/* ============ TAREAS ============ */
/* ============ FINCA ============ */
let DEH=null;
function renderFinca(el){
 const c=campo();
 const lid=c.filter(a=>lidiable(a)&&ageY(a)>=4&&ageY(a)<=5).length;
 const vacas=c.filter(a=>a.role==='vaca').length;
 const coste=Math.round(c.length*FEED[S.feed].c*feedMul())+2500+10*c.length;
 const prox=S.offers.filter(o=>o.st==='aceptada').sort((a,b)=>a.abs-b.abs);
 const sems=c.filter(a=>a.role==='semental');
 el.innerHTML=`<div class="stack" style="gap:1rem">
 <div class="fhero"><div class="img" style="background-image:url(img/dehesa.jpg)"></div><span class="season">${estacion()}${S.g.prov?' · '+esc(S.g.prov):''}</span><button class="hint2" onclick="UI.deh=!UI.deh;render()">${UI.deh?'Ocultar la dehesa en directo':'Toca un animal'}</button></div>
 ${UI.deh?`<div class="deh"><canvas id="deh"></canvas><span class="cap">Dehesa en directo</span><span class="hint">Toca un animal para ver su ficha</span></div>`:''}
 <div class="duo"><button class="btn oro big" onclick="enter3D()">${ICO.cortijo}Bajar a la finca en 3D</button><button class="btn big" onclick="obras()">${ICO.martillo}Obras</button></div>
 <div class="tiles t2">
  <div class="tile">${ICO.toroG.replace('<svg','<svg class="ti"')}<div><div class="lbl">Cabezas</div><div class="v">${c.length}</div></div></div>
  <div class="tile">${ICO.capote}<div><div class="lbl">Para lidiar</div><div class="v">${lid}</div></div></div>
  <div class="tile">${ICO.vaca}<div><div class="lbl">Vacas</div><div class="v">${vacas}</div></div></div>
  <div class="tile">${ICO.monG.replace('<svg','<svg class="ti"')}<div><div class="lbl">Gasto/mes</div><div class="v">${eur(coste)}</div></div></div>
 </div>
 <section class="sect"><header><h2>Tareas</h2></header><div class="list">${listaTareas().slice(0,3).map(x=>`<div class="task"><span class="dot ${x.oro?'ok':''}"></span><span class="t">${esc(x.t)}</span><button class="btn sm ${x.oro?'oro':''}" ${x.dis?'disabled':''} onclick="${x.fn}">${x.b}</button></div>`).join('')||'<div class="task"><span class="dot ok"></span><span class="t">Todo al día. El mayoral espera órdenes.</span></div>'}</div></section>
 ${prox.length?`<section class="sect"><header><h2>Carteles anunciados</h2></header><div class="list">${prox.map(o=>`<div class="task"><span class="dot ok"></span><span class="t"><b>${esc(o.plaza)}</b><br><small class="muted">${o.feria} · ${MESES[o.abs%12]} ${Math.floor(o.abs/12)} · ${o.toros.length} ${o.tipo==='novillada'?'novillos':'toros'}</small></span></div>`).join('')}</div></section>`:''}
 <section class="sect"><header><h2>Alimentación</h2><span class="sp"></span><small class="muted">por cabeza y mes</small></header>
  <div class="seg">${Object.entries(FEED).map(([k,f])=>`<button aria-pressed="${S.feed===k}" onclick="S.feed='${k}';save();render()"><b>${f.n}</b><span>${Math.round(f.c*feedMul())} € · ${f.d}</span></button>`).join('')}</div>
</section>
 <section class="sect"><header><h2>Cubrición</h2></header>
  <div class="field"><label class="lbl" for="semsel">Semental que cubre a las vacas</label>
  <select id="semsel" onchange="S.semAct=+this.value;save();toast('Semental asignado')">${sems.length?sems.map(s=>`<option value="${s.id}" ${s.id===S.semAct?'selected':''}>${esc(s.name)} nº ${s.num} · tienta ${s.nota} (${notaTxt(s.nota)})${s.indultado?' · indultado':''}</option>`).join(''):'<option>Sin semental</option>'}</select></div>
</section>
 <section class="sect"><header><h2>Instalaciones</h2></header><div class="list">${Object.entries(MEJ).map(([k,d])=>`<div class="task"><span class="dot ${mej(k)?'ok':''}"></span><span class="t"><b>${d.n}</b><br><small class="muted">${d.d}</small></span>${mej(k)?'<span class="badge ok">Hecha</span>':`<button class="btn sm oro" ${S.money<d.c?'disabled':''} onclick="construir('${k}',true)">${eur(d.c)}</button>`}</div>`).join('')}</div></section>
 <button class="btn pri adv" onclick="advance()">Avanzar a ${MESES[(S.month+1)%12]}${ICO.chev}</button>
 </div>`;
 if(UI.deh)startDehesa();
}

function estacion(){const m=S.month;return m>=2&&m<=4?'Primavera':m>=5&&m<=7?'Verano':m>=8&&m<=10?'Otoño':'Invierno'}
function fitCanvas(cv,h){const d=Math.min(2,window.devicePixelRatio||1);const w=cv.clientWidth||cv.parentElement.clientWidth;cv.width=Math.round(w*d);cv.height=Math.round(h*d);cv.style.height=h+'px';const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);return {c,w,h}}
function startDehesa(){
 const cv=$('#deh');if(!cv)return;
 const H=Math.round(Math.min(300,Math.max(200,cv.clientWidth*.55)));
 let {c,w}=fitCanvas(cv,H);
 const cmp=campo();
 const pickN=(arr,n)=>[...arr].sort(()=>Math.random()-.5).slice(0,n);
 const sel=[...pickN(cmp.filter(a=>a.sex==='M'&&!a.role&&ageY(a)>=3),6),...pickN(cmp.filter(a=>a.role==='semental'),1),...pickN(cmp.filter(a=>a.role==='vaca'),4),...pickN(cmp.filter(a=>ageY(a)===0),2)];
 const rnd=mulberry(S.g.name.length*31+7);
 const trees=[];for(let i=0;i<14;i++)trees.push({x:rnd(),z:rnd()*.95,r:.7+rnd()*.6});
 const walkers=sel.map(a=>({a,x:R(.08,.92),z:R(.1,.95),tx:0,tz:0,mv:false,idle:R(0,3),ph:R(0,6),dir:Math.random()<.5?1:-1,head:1}));
 const ws=walkers.map(wk=>{wk.tx=wk.x;wk.tz=wk.z;return wk});
 DEH={cv,ws,trees};
 let last=performance.now();
 const season=S.month;
 const grass=season>=2&&season<=4?['#8d9c4c','#6b7a36']:season>=5&&season<=7?['#cfae66','#a98a47']:season>=8&&season<=10?['#a69a5c','#7f7a42']:['#7f8f57','#5f6d3f'];
 const sky=season>=11||season<=1?['#8fb0c9','#dfe3df']:['#78a7cf','#efdcb6'];
 const step=now=>{
  if(!cv.isConnected)return;
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(cv.clientWidth!==w){({c,w}=fitCanvas(cv,H))}
  const hz=H*.42;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,sky[0]);g.addColorStop(1,sky[1]);c.fillStyle=g;c.fillRect(0,0,w,hz+2);
  c.fillStyle='#8b9878';c.beginPath();c.moveTo(0,hz);for(let x=0;x<=w;x+=10)c.lineTo(x,hz-10-Math.sin(x*.012)*8-Math.sin(x*.031)*4);c.lineTo(w,hz);c.fill();
  c.fillStyle=shade(grass[1],-.1);c.beginPath();c.moveTo(0,hz+2);for(let x=0;x<=w;x+=10)c.lineTo(x,hz-3-Math.sin(x*.02+1)*5);c.lineTo(w,hz+2);c.fill();
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,grass[1]);g.addColorStop(1,grass[0]);c.fillStyle=g;c.fillRect(0,hz,w,H-hz);
  const objs=[];
  for(const t of trees)objs.push({z:t.z,draw:()=>{const y=hz+4+t.z*(H-hz-10),s=(.3+t.z*.9)*H/240*t.r,x=t.x*w;
   c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(x,y,26*s,5*s,0,0,Math.PI*2);c.fill();
   c.fillStyle='#4a3424';c.fillRect(x-2.5*s,y-20*s,5*s,20*s);
   c.fillStyle='#3f4e26';for(const [dx,dy,r] of [[-12,-26,12],[10,-27,13],[0,-36,14],[-4,-24,11],[14,-22,9]]){c.beginPath();c.arc(x+dx*s,y+dy*s,r*s,0,Math.PI*2);c.fill()}
   c.fillStyle='rgba(120,140,70,.35)';c.beginPath();c.arc(x-4*s,y-40*s,8*s,0,Math.PI*2);c.fill()}});
  for(const k of ws){
   if(!k.mv){k.idle-=dt;k.head+=(1-k.head)*dt*2;if(k.idle<=0){k.mv=true;k.tx=clamp(k.x+R(-.3,.3),.05,.95);k.tz=clamp(k.z+R(-.25,.25),.05,.98);k.dir=k.tx>k.x?1:-1}}
   else{const dx=k.tx-k.x,dz=k.tz-k.z,d=Math.hypot(dx,dz),v=.035*dt;k.head+=(.25-k.head)*dt*2;
    if(d<v){k.mv=false;k.idle=R(2,6)}else{k.x+=dx/d*v;k.z+=dz/d*v;k.ph+=dt*6}}
   objs.push({z:k.z,draw:()=>{const y=hz+4+k.z*(H-hz-10),s=(.28+k.z*.62)*H/240,x=k.x*w;k.sx=x;k.sy=y-30*s;
    const a=k.a,sc=a.role==='vaca'||a.sex==='H'?s*.88:ageY(a)===0?s*.55:s;
    drawBull(c,x,y,sc,k.dir,{pelo:a.pelo,ph:k.ph,speed:k.mv?.6:0,head:k.head,t:now/1000+a.id,seed:a.id,cow:a.sex==='H'})}});
  }
  objs.sort((a,b)=>a.z-b.z).forEach(o=>o.draw());
  requestAnimationFrame(step);
 };
 requestAnimationFrame(step);
 cv.onclick=e=>{const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=60;for(const k of ws){const d=Math.hypot(k.sx-x,k.sy-y);if(d<bd){bd=d;best=k}}if(best)openFicha(best.a.id)};
}

/* ============ CAMADA ============ */
const FILTROS=[
 ['toros','Toros',a=>a.sex==='M'&&!a.role&&ageY(a)>=4],
 ['utreros','Utreros',a=>a.sex==='M'&&!a.role&&ageY(a)===3],
 ['erales','Erales',a=>a.sex==='M'&&!a.role&&ageY(a)===2],
 ['anojos','Añojos',a=>a.sex==='M'&&!a.role&&ageY(a)===1],
 ['becerros','Becerros',a=>ageY(a)===0],
 ['vacas','Vacas',a=>a.role==='vaca'],
 ['sementales','Sementales',a=>a.role==='semental'],
 ['hjov','Hembras',a=>a.sex==='H'&&!a.role&&ageY(a)>=1]
];
function renderCamada(el){
 const c=campo();const f=FILTROS.find(x=>x[0]===UI.filter)||FILTROS[0];
 const list=c.filter(f[2]).sort((a,b)=>calidad(b).q-calidad(a).q||b.peso-a.peso);
 el.innerHTML=`<div class="stack">
 <div class="chips" role="group" aria-label="Filtrar ganadería">${FILTROS.map(([k,l,fn])=>`<button class="chip" aria-pressed="${UI.filter===k}" onclick="UI.filter='${k}';render()">${ICO.toro}${l}<span class="c">${c.filter(fn).length}</span></button>`).join('')}</div>
 <div class="legend">${[['gris','Común'],['verde','Bueno'],['azul','Notable'],['morado','Excelente'],['oro','Figura'],['rojo','Leyenda']].map(([k,n])=>`<span class="t-${k}"><i></i>${n}</span>`).join('')}</div>
 ${list.length?`<div class="alist">${list.map(rowAnimal).join('')}</div>`:`<div class="card muted">No hay animales en este lote.</div>`}
 </div>`;
}
function rowAnimal(a){
 const e=est(a),q=calidad(a);
 const badges=[];
 if(a.res!=null){const o=S.offers.find(x=>x.id===a.res);badges.push(`<span class="badge gr">${o?o.feria:'Reseñado'}</span>`)}
 if(a.mark)badges.push('<span class="badge oro">Apartado</span>');
 if(a.indultado)badges.push('<span class="badge oro">Indultado</span>');
 if(a.tentado&&a.sex==='M'&&!a.role)badges.push('<span class="badge">Tentado</span>');
 if(a.tentado&&a.sex==='H'&&!a.role)badges.push('<span class="badge oro">Decidir</span>');
 if(a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2)badges.push('<span class="badge">Por tentar</span>');
 if(a.salud<55)badges.push('<span class="badge bad">Lesionado</span>');
 if(!a.herrado)badges.push('<span class="badge">Sin herrar</span>');
 const dato=e.mode==='none'?'sin reata':e.mode==='campo'?`campo ~${e.bra}`:e.mode==='reata'?`reata ~${e.bra}`:e.mode==='tienta'?`tienta ${a.nota}`:`bravura ${e.bra}`;
 return `<button class="ac t-${q.k}" onclick="openFicha(${a.id})" aria-label="${esc(a.name)}, ${q.n}">
  <span class="ph" style="background-image:url(${retrato(a)})"><span class="ovr"><b>${q.q}</b><small>${posDe(a)}</small></span></span>
  <span class="t"><span class="nm">${a.num!=null?`<span class="n">${a.num}</span><span class="g">- ${a.born%10}</span>`:''}<span class="n">${esc(a.name)}</span>${MEDAL[q.medal]}</span>
   <span class="sub">${cat(a)}<i>•</i>${a.pelo}<i>•</i>${dato}</span>${badges.length?`<span class="bdgs">${badges.join('')}</span>`:''}</span>
  <span class="r"><span class="kg">${ICO.kg}${a.peso} kg</span><span class="hp ${a.salud<55?'low':''}">${ICO.pulso}<span class="w">salud </span>${Math.round(a.salud)}</span></span></button>`;
}
/* ============ FICHA ============ */
function openFicha(id){
 const a=byId(id);if(!a)return;
 const e=est(a), y=ageY(a);
 const bar=(lbl,v,mode)=>{if(v==null)return `<div class="bar"><span>${lbl}</span><span class="tr"></span><span class="v muted">?</span></div>`;
  return `<div class="bar"><span>${lbl}</span><span class="tr"><i class="${mode==='reata'?'est':''} ${v<55?'low':''}" style="width:${v}%"></i></span><span class="v">${mode==='reata'?'~':''}${v}</span></div>`};
 const acts=[];
 if(a.res!=null){const o=S.offers.find(x=>x.id===a.res);acts.push(`<p class="muted" style="margin:0">Reseñado para ${o?`${esc(o.plaza)} (${o.feria}, ${MESES[o.abs%12]})`:'una corrida'}. No se puede vender ni tentar.</p>`)}
 else if(a.role==='semental'){
  acts.push(a.id===S.semAct?'<span class="badge ok">Cubre a las vacas este año</span>':`<button class="btn oro" onclick="S.semAct=${a.id};save();closeModal();render();toast('${esc(a.name)} cubrirá a las vacas')">Usar en la cubrición</button>`);
  acts.push(`<button class="btn" onclick="vender(${a.id},'mat')">Retirar al matadero · ${eur(a.peso*1.5)}</button>`);
 } else if(a.role==='vaca'){
  acts.push(`<button class="btn" onclick="vender(${a.id},'mat')">Desechar al matadero · ${eur(a.peso*1.3)}</button>`);
 } else if(a.sex==='H'){
  if(!a.tentado&&y>=2)acts.push(`<button class="btn oro" onclick="tentarUno(${a.id})">Tentar · ${eur(tCost('H'))}</button>`);
  if(a.tentado){acts.push(`<button class="btn oro" onclick="aprobarVaca(${a.id})">Aprobar para vientre</button>`)}
  if(y>=1)acts.push(`<button class="btn" onclick="vender(${a.id},'mat')">Desechar al matadero · ${eur(a.peso*1.3)}</button>`);
 } else {
  if(!a.tentado&&y>=3&&y<=6)acts.push(`<button class="btn" onclick="tentarUno(${a.id})">Tentar como semental · ${eur(tCost('M'))}</button>`);
  if(a.tentado&&a.nota!=null)acts.push(`<button class="btn oro" onclick="aprobarSemental(${a.id})">Aprobar como semental</button>`);
  if(y>=2)acts.push(`<button class="btn" onclick="vender(${a.id},'pop')">Vender para festejos populares · ${eur(700+a.peso*2.2)}</button>`);
  if(y>=1)acts.push(`<button class="btn" onclick="vender(${a.id},'mat')">Matadero · ${eur(a.peso*1.5)}</button>`);
 }
 const hijos=a.hijos||[];
 const hm=hijos.length?Math.round(hijos.reduce((s,h)=>s+h.score,0)/hijos.length):null;
 modal(`${a.num!=null?a.num+' · ':''}${a.name}`,`<div class="stack">
  ${(()=>{const q=calidad(a);return `<div class="ficha-ph t-${q.k}" style="background-image:url(${retrato(a)})"><span class="cap"><small>${q.n} · calidad ${q.q}</small>${esc(a.name)}</span></div>`})()}
  <div class="ring-wrap" style="background:linear-gradient(#cfb98f,#a98a55)"><canvas id="fcv"></canvas></div>
  <div class="kv"><span>${cat(a)}</span><span>${(()=>{const m=morf(a);return `Encornadura <b>${hornTxt(m)}</b></span><span>Hechuras <b>${hechTxt(a,m)}</b>`})()}</span><span><b>${y}</b> años</span><span><b>${a.peso}</b> kg</span><span>Pelo <b>${a.pelo}</b></span><span>Guarismo <b>${a.born%10}</b></span><span>Encaste <b>${a.enc}</b></span></div>
  <div class="stats">${[['BRA',e.bra,1],['NOB',e.nob,0],['CAS',e.cas,1],['FUE',e.fue,0],['TRA',a.g.tra,0],['SAL',Math.round(a.salud),0]].map(([k,v,est2])=>`<div class="sx ${v==null?'s0':v>=85?'s5':v>=78?'s4':v>=70?'s3':v>=60?'s2':'s1'}"><b>${v==null?'?':(est2&&(e.mode==='reata'||e.mode==='campo')?'~':'')+v}</b><span>${k}</span></div>`).join('')}</div>
  <small class="muted">${e.mode==='campo'?'Estimación de la prueba de campo (acoso y derribo).':e.mode==='none'?'Sin datos de reata: hijo de semental prestado o vaca sin tentar.':e.mode==='reata'?'Rayado: estimación por la reata (tienta de sus padres). La nobleza y la fuerza solo se ven en la plaza.':e.mode==='tienta'?`Tentado: nota ${a.nota}, ${notaTxt(a.nota).toLowerCase()}. La nobleza y la fuerza no se miden en la tienta.`:'Datos reales, comprobados en la plaza.'}</small>
  <div class="card stack" style="gap:.35rem;padding:12px"><span class="lbl">Reata</span>
   <div style="font-size:.88rem">Madre: <b>${a.madre?`${esc(a.madre.name)}${a.madre.num!=null?' nº '+a.madre.num:''}`:'origen de compra o fundación'}</b><br>Padre: <b>${a.padre?`${esc(a.padre.name)}${a.padre.num!=null?' nº '+a.padre.num:''}`:'—'}</b></div>
   ${a.indultado?`<div style="font-size:.88rem;color:var(--oro)">Indultado en ${esc(a.indultado)}.</div>`:''}
   ${a.role==='vaca'?`<div style="font-size:.88rem">Hijos lidiados: <b>${hijos.length}</b>${hm!=null?` · nota media en plaza <b>${hm}</b>`:''}</div>${hijos.slice(-4).reverse().map(h=>`<div style="font-size:.82rem" class="muted">${esc(h.name)}${h.num!=null?' nº '+h.num:''} (${h.y}): <span class="res-${h.res}">${RESTXT[h.res]}</span></div>`).join('')}`:''}
  </div>
  <div class="stack" style="gap:.5rem">${acts.join('')}</div>
 </div>`);
 const cv=$('#fcv');const {c,w,h}=fitCanvas(cv,120);
 const s=h/105*(a.sex==='H'?.95:1)*(y===0?.6:y===1?.75:1);
 let t0=performance.now();
 const loop=now=>{if(!cv.isConnected)return;c.clearRect(0,0,w,h);
  const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#d9c49a');gr.addColorStop(1,'#a88655');c.fillStyle=gr;c.fillRect(0,0,w,h);
  c.fillStyle='rgba(60,40,20,.15)';c.fillRect(0,h*.82,w,h*.18);
  drawBull(c,w/2+8,h*.9,s,1,{pelo:a.pelo,ph:0,speed:0,head:.15+Math.sin((now-t0)/1400)*.05,t:(now-t0)/1000,seed:a.id,cow:a.sex==='H'});
  requestAnimationFrame(loop)};requestAnimationFrame(loop);
}
function tCost(sex){return sex==='H'?(mej('placita')?250:450):(mej('placita')?800:1200)}
function tentarUno(id){const a=byId(id);const cost=tCost(a.sex);S.money-=cost;tentar(a);save();
 toast(`Tienta de ${a.name}: nota ${a.nota} (${notaTxt(a.nota)})`);openFicha(id);render()}
function aprobarVaca(id){const a=byId(id);a.role='vaca';save();closeModal();render();toast(`${a.name} pasa a vaca de vientre`)}
function aprobarSemental(id){const a=byId(id);a.role='semental';if(!byId(S.semAct)||byId(S.semAct).role!=='semental')S.semAct=a.id;save();closeModal();render();toast(`${a.name} queda como semental`)}
function vender(id,tipo){const a=byId(id);const p=Math.round(tipo==='pop'?700+a.peso*2.2:a.peso*(a.sex==='H'?1.3:1.5));
 S.money+=p;a.st='vendido';S.animals=S.animals.filter(x=>x.id!==id);if(S.semAct===id)S.semAct=(campo().find(x=>x.role==='semental')||{}).id??null;
 log(`Venta de ${a.name}${a.num!=null?' nº '+a.num:''}: ${eur(p)}`);save();closeModal();render();toast(`Vendido por ${eur(p)}`)}

function tientaLote(){
 const pend=campo().filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2);
 if(!pend.length)return;
 const cost=pend.length*tCost('H');S.money-=cost;pend.forEach(tentar);save();render();
 const rows=pend.sort((a,b)=>b.nota-a.nota);
 modal('Tienta de hembras',`<div class="stack">
  <p class="muted" style="margin:0">En la placita de tientas se mide la bravura de ${pend.length} hembras ante el caballo y la muleta (${eur(cost)}). Marca las que pasan a vacas de vientre; las demás van al matadero.</p>
  <div class="list">${rows.map(a=>`<label class="chk"><input type="checkbox" id="tv-${a.id}" ${a.nota>=68?'checked':''}><span><b>${esc(a.name)}</b>${a.num!=null?` <span class="mono muted">${a.num}</span>`:''}<br><small class="muted">${a.pelo} · ${a.peso} kg · madre ${a.madre?esc(a.madre.name):'—'}</small></span><span style="text-align:right"><b class="num">${a.nota}</b><br><small class="muted">${notaTxt(a.nota)}</small></span></label>`).join('')}</div>
  <button class="btn pri adv" onclick="cerrarTienta([${rows.map(a=>a.id).join(',')}])">Confirmar selección</button></div>`);
}
function cerrarTienta(ids){let ap=0,ds=0,ing=0;for(const id of ids){const a=byId(id);if(!a)continue;const ck=$('#tv-'+id);if(ck&&ck.checked){a.role='vaca';ap++}else{ing+=a.peso*1.3;a.st='vendido';ds++}}
 S.animals=S.animals.filter(a=>a.st==='campo');S.money+=ing;log(`Tienta: ${ap} aprobadas, ${ds} desechadas.`);save();closeModal();render();toast(`${ap} nuevas vacas de vientre · ${ds} al matadero (+${eur(ing)})`)}

/* ============ OFERTAS ============ */
function renderOfertas(el){
 const act=S.offers.filter(o=>o.st==='nueva'||o.st==='aceptada').sort((a,b)=>a.abs-b.abs);
 el.innerHTML=`<div class="stack" style="gap:1rem">
 ${act.length?act.map(offerCard).join(''):`<div class="card muted">No hay ofertas abiertas. Llegan cada mes según la temporada y tu prestigio (${Math.round(S.pres)}).</div>`}
 <section class="sect"><header><h2>Ferias de la temporada</h2></header><div class="list tw"><table class="t"><tr><th>Mes</th><th>Feria</th><th>Plaza</th><th>Prestigio</th></tr>${FERIAS.map(f=>`<tr><td>${MESES[f.m].slice(0,3)}</td><td>${f.feria}</td><td>${f.plaza}</td><td class="num" style="color:${S.pres>=f.minP?'var(--good)':'var(--muted)'}">${f.minP}</td></tr>`).join('')}</table></div></section>
 </div>`;
}
function rechazar(id){const o=S.offers.find(x=>x.id===id);o.st='rechazada';save();render();toast('Oferta rechazada')}
function resena(id){
 const o=S.offers.find(x=>x.id===id);
 const el=campo().filter(a=>eligible(a,o)).sort((a,b)=>b.peso-a.peso);
 modal(`Reseña · ${o.plaza}`,`<div class="stack">
  <p class="muted" style="margin:0">Elige ${o.n} ${o.tipo==='novillada'?'novillos':'toros'} para ${esc(o.feria)}. Los rayados en la ficha son estimaciones por reata.</p>
  <div class="list" id="rlist">${el.map(a=>{const e=est(a);return `<label class="chk"><input type="checkbox" value="${a.id}" onchange="cntRes(${o.n})"><span><b>${esc(a.name)}</b> <span class="mono muted">${a.num}·${a.born%10}</span><br><small class="muted">${ageAt(a,o.abs)} años al lidiarse · ${a.pelo} · trapío ${a.g.tra}${e.mode==='reata'?` · reata ~${e.bra}`:''}</small></span><span style="text-align:right"><b class="num">${a.peso} kg</b><br><small class="muted">salud ${Math.round(a.salud)}</small></span></label>`}).join('')}</div>
  <div class="row"><span id="rcnt" class="muted">0 de ${o.n}</span><span class="sp"></span><button class="btn" onclick="autoRes(${o.n})">Elegir los mejores</button><button class="btn pri" id="rok" disabled onclick="confRes(${o.id})">Embarcar y aceptar</button></div></div>`);
}
function cntRes(n){const ch=[...document.querySelectorAll('#rlist input:checked')];if(ch.length>n){ch[ch.length-1].checked=false}const k=Math.min(n,ch.length);$('#rcnt').textContent=`${k} de ${n}`;$('#rok').disabled=k!==n}
function autoRes(n){const ins=[...document.querySelectorAll('#rlist input')];
 const sc=ins.map(i=>{const a=byId(+i.value);const e=est(a);return {i,s:(e.bra||65)*1+a.g.tra*.4+a.salud*.2}}).sort((a,b)=>b.s-a.s);
 ins.forEach(i=>i.checked=false);sc.slice(0,n).forEach(x=>x.i.checked=true);cntRes(n)}
function confRes(id){const o=S.offers.find(x=>x.id===id);const ids=[...document.querySelectorAll('#rlist input:checked')].map(i=>+i.value);
 o.toros=ids;o.st='aceptada';ids.forEach(i=>byId(i).res=o.id);log(`Aceptada: ${o.plaza}, ${o.feria}.`);save();closeModal();render();toast(`Tu hierro se anuncia en ${o.plaza}`)}

/* ============ MERCADO ============ */
function renderMercado(el){
 const m=S.mkt;const c=campo();
 const viejas=c.filter(a=>a.role==='vaca'&&ageY(a)>=14);
 const tentM=c.filter(a=>a.sex==='M'&&a.tentado&&!a.role);
 const fake=(s,i,sex)=>({id:900+i*13+(sex==='H'?5:0),pelo:s.pelo,nota:s.nota,role:sex==='H'?'vaca':'semental',g:s.g||{tra:70},sex});
 el.innerHTML=`<div class="stack" style="gap:1rem">
 <section class="sect"><header><h2>Sementales en venta</h2><span class="sp"></span><small class="muted">se renuevan cada mes</small></header>
  <div class="alist">${m.sem.map((s,i)=>{const f=fake(s,i,'M');const q=calidad({...f,known:'tienta',rev:s.rev});return `<div class="ac t-${q.k}" style="cursor:default"><span class="ph" style="background-image:url(${retrato(f)})"></span>
   <span class="t"><span class="nm"><span class="n">${esc(s.name)}</span>${MEDAL[q.medal]}</span><span class="sub">${s.enc}<i>•</i>${s.age} años<i>•</i>${s.pelo}<i>•</i>tienta ${s.nota}</span><span class="bdgs"><span class="badge">${notaTxt(s.nota)}</span></span></span>
   <span class="r"><button class="btn sm oro" ${S.money<s.precio?'disabled':''} onclick="comprarSem(${i})">${eur(s.precio)}</button></span></div>`}).join('')||'<div class="card muted">Vendidos este mes.</div>'}</div></section>
 <section class="sect"><header><h2>Lotes de vacas</h2></header>
  <div class="alist">${m.lotes.map((l,i)=>{const f=fake(l.vacas[0],i,'H');const q=calidad({...f,known:'tienta',rev:l.vacas[0].rev,nota:l.nota});return `<div class="ac t-${q.k}" style="cursor:default"><span class="ph" style="background-image:url(${retrato(f)})"></span>
   <span class="t"><span class="nm"><span class="n">5 vacas · ${l.enc}</span></span><span class="sub">nota media de tienta ${l.nota}<i>•</i>${notaTxt(l.nota)}</span></span>
   <span class="r"><button class="btn sm oro" ${S.money<l.precio?'disabled':''} onclick="comprarLote(${i})">${eur(l.precio)}</button></span></div>`}).join('')||'<div class="card muted">Vendidos este mes.</div>'}</div></section>
 <section class="sect"><header><h2>Ventas en bloque</h2></header>
  <div class="list">
   <div class="task"><span class="t">Vacas de 14 años o más<br><small class="muted">${viejas.length} animales · bajan la paridera</small></span><button class="btn sm" ${!viejas.length?'disabled':''} onclick="bloque('viejas')">Matadero</button></div>
   <div class="task"><span class="t">Machos tentados no aprobados<br><small class="muted">${tentM.length} animales · ya no pueden lidiarse en plaza</small></span><button class="btn sm" ${!tentM.length?'disabled':''} onclick="bloque('tent')">Festejos populares</button></div>
  </div></section>
 </div>`;
}
function comprarSem(i){const s=S.mkt.sem[i];S.money-=s.precio;const a=mk({sex:'M',born:S.year-s.age,enc:s.enc,g:s.g,pelo:s.pelo,name:s.name,role:'semental'});a.tentado=true;a.known='tienta';a.rev=s.rev;a.nota=s.nota;S.animals.push(a);
 if(!byId(S.semAct))S.semAct=a.id;S.mkt.sem.splice(i,1);log(`Compra del semental ${s.name} (${s.enc}).`);save();render();toast(`${s.name} llega a la finca`)}
function comprarLote(i){const l=S.mkt.lotes[i];S.money-=l.precio;for(const v of l.vacas){const a=mk({sex:'H',born:S.year-v.age,enc:l.enc,g:v.g,pelo:v.pelo,name:v.name,role:'vaca'});a.tentado=true;a.known='tienta';a.rev=v.rev;a.nota=v.nota;S.animals.push(a)}
 S.mkt.lotes.splice(i,1);log(`Compra de 5 vacas de ${l.enc}.`);save();render();toast('5 vacas nuevas en el cercado')}
function bloque(k){let ing=0,n=0;for(const a of campo()){if(k==='viejas'&&a.role==='vaca'&&ageY(a)>=14){ing+=a.peso*1.3;a.st='vendido';n++}if(k==='tent'&&a.sex==='M'&&a.tentado&&!a.role){ing+=700+a.peso*2.2;a.st='vendido';n++}}
 S.animals=S.animals.filter(a=>a.st==='campo');S.money+=Math.round(ing);save();render();toast(`${n} vendidos por ${eur(ing)}`)}

/* ============ PALMARÉS ============ */
function getQual(){try{return localStorage.getItem('hd-qual')||(matchMedia('(pointer:coarse)').matches?'media':'alta')}catch(e){return 'media'}}
function setQual(k){try{localStorage.setItem('hd-qual',k)}catch(e){}toast(`Calidad ${k}: se aplica al volver a entrar en 3D`);if(W3.R){const pr={alta:1.6,media:1.2,baja:.9}[k];W3.R.setPixelRatio(Math.min(pr,window.devicePixelRatio||1));W3.R.shadowMap.enabled=k!=='baja';W3.resize&&W3.resize()}render()}
let DEFER=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();DEFER=e});
function instalar(){if(DEFER){DEFER.prompt();DEFER=null;return}modal('Instalar en el móvil',`<div class="stack"><p style="margin:0">Abre el juego desde su dirección de GitHub Pages en el navegador del móvil.</p><div class="list"><div class="task"><span class="t"><b>iPhone (Safari)</b><br><small class="muted">Botón Compartir → «Añadir a pantalla de inicio».</small></span></div><div class="task"><span class="t"><b>Android (Chrome)</b><br><small class="muted">Menú ⋮ → «Instalar aplicación» o «Añadir a pantalla de inicio».</small></span></div></div><p class="muted" style="margin:0">Se abrirá a pantalla completa, como una app, y guardará tu partida en el móvil.</p></div>`)}
function spark(){const d=S.presHist;const W=600,H=120,p=24;const xs=i=>p+i*(W-2*p)/(d.length-1),ys=v=>H-p-(v/100)*(H-2*p);
 const pts=d.map((x,i)=>`${xs(i)},${ys(x.p)}`).join(' ');
 return `<svg viewBox="0 0 ${W} ${H}" class="spark" role="img" aria-label="Prestigio por temporada"><line x1="${p}" x2="${W-p}" y1="${ys(50)}" y2="${ys(50)}" stroke="var(--line)" stroke-dasharray="4 4"/><text x="${p}" y="${ys(50)-4}" fill="var(--muted)" font-size="11">50</text>
 <polygon points="${xs(0)},${H-p} ${pts} ${xs(d.length-1)},${H-p}" fill="rgba(230,187,85,.15)"/><polyline points="${pts}" fill="none" stroke="var(--oro)" stroke-width="2.5"/>
 ${d.map((x,i)=>`<circle cx="${xs(i)}" cy="${ys(x.p)}" r="${i===d.length-1?5:3}" fill="var(--oro)"/><text x="${xs(i)}" y="${H-6}" fill="var(--muted)" font-size="11" text-anchor="middle">${x.y}</text>`).join('')}</svg>`}
function resetGame(){try{localStorage.removeItem(KEY)}catch(e){}S=null;render()}
function gameOver(){modal('Bancarrota',`<div class="stack"><p style="margin:0">El banco ejecuta la deuda y la finca sale a subasta. ${esc(S.g.name)} cierra con ${S.stats.toros} toros lidiados y ${S.stats.indultos} indultos.</p><button class="btn pri adv" onclick="closeModal();resetGame()">Empezar otra carrera</button></div>`)}

/* ============ informe mensual ============ */
function showReport(rep){if(!rep)return;if(!rep.corridas)rep={...rep,corridas:(rep.cor||[]).map(id=>S.hist.find(h=>h.id===id)).filter(Boolean)};
 modal(`${MESES[S.month]} ${S.year}`,`<div class="stack">
  <div class="kv"><span>Gastos <b style="color:var(--bad)">${eur(-rep.cost)}</b></span><span>Ingresos <b style="color:var(--good)">${eur(rep.inc)}</b></span><span>Saldo <b>${eur(S.money)}</b></span></div>
  ${rep.corridas.map(r=>`<div class="card stack" style="gap:.4rem"><span class="lbl">${r.cat===1?'Plaza de primera':'Festejo'}</span><b style="font-family:var(--display);font-size:1.3rem">${esc(r.plaza)} · ${r.feria}</b><small class="muted">${r.toros.length} ${r.tipo==='novillada'?'novillos':'toros'} de tu hierro han saltado al ruedo.</small><div class="row"><button class="btn oro" onclick="closeModal();enterPlaza(${r.id})">Verla en la plaza 3D</button><button class="btn" onclick="closeModal();verCorrida(${r.id})">Vista rápida</button></div></div>`).join('')}
  <div class="list">${rep.lines.map(l=>`<div class="task"><span class="dot ok"></span><span class="t" style="font-size:.88rem">${esc(l)}</span></div>`).join('')}</div>
  ${S.money<0?`<p style="margin:0;color:var(--warn)">Estás en números rojos. Por debajo de −90.000 € el banco se queda la finca.</p>`:''}
  <button class="btn adv" onclick="closeModal()">Seguir</button></div>`);
}
function verPendiente(){const id=S.porVer[0];if(id!=null)verCorrida(id)}

/* ============ la corrida en el ruedo ============ */
let PLAY=null;
function verCorrida(id){
 const r=S.hist.find(h=>h.id===id);if(!r)return;
 S.porVer=S.porVer.filter(x=>x!==id);r.visto=true;save();
 modal(`${r.plaza}`,`<div class="stack">
  <div class="row"><span class="badge ${r.cat===1?'oro':''}">${r.feria}</span><span class="muted" id="ptoro" style="font-size:.85rem"></span></div>
  <div class="ring-wrap"><canvas id="ring"></canvas></div>
  <div class="capt" id="pcap" aria-live="polite"></div>
  <div class="row"><button class="btn sm" id="ppause" onclick="PLAY.pause=!PLAY.pause;this.textContent=PLAY.pause?'Seguir':'Pausa'">Pausa</button>
   <button class="btn sm" id="pspd" onclick="PLAY.spd=PLAY.spd===1?2:PLAY.spd===2?4:1;this.textContent='×'+PLAY.spd">×1</button><span class="sp"></span>
   <button class="btn sm" onclick="nextToro()">Siguiente toro</button><button class="btn sm oro" onclick="endCorrida()">Resumen</button><button class="btn sm" onclick="closeModal();enterPlaza(${r.id})">En 3D</button></div>
  <div id="psum"></div></div>`,()=>{PLAY=null});
 const cv=$('#ring');const H=Math.round(Math.min(380,cv.clientWidth*.66));const f=fitCanvas(cv,H);
 PLAY={r,i:-1,cv,c:f.c,W:f.w,H,crowd:mkCrowd(f.w,H),spd:1,pause:false,t:0};
 nextToro();
 let last=performance.now();
 const loop=now=>{if(!PLAY||!cv.isConnected)return;const dt=Math.min(.05,(now-last)/1000);last=now;if(!PLAY.pause&&!PLAY.done)tick(dt*PLAY.spd);drawPlay();requestAnimationFrame(loop)};
 requestAnimationFrame(loop);
}
function buildTL(t){
 const s=[];const desc=`${t.name}${t.num!=null?', nº '+t.num:''}, ${t.pelo}, ${t.peso} kg`;
 s.push({k:'salida',d:2.6,cap:`Sale de chiqueros ${desc}.`});
 if(t.res==='devuelto'){s.push({k:'capote',d:3.2,cap:'Pierde las manos una y otra vez. El público protesta: no tiene fuerza para la lidia.',stumble:true});
  s.push({k:'final',d:3.4,cap:'Pañuelo verde: devuelto a los corrales. Los cabestros se lo llevan.'});return s}
 s.push({k:'capote',d:3.4,cap:t.B>72?'Galopa con alegría al capote y repite con el hocico por el suelo.':t.B>58?'Acude al capote sin mucha entrega.':'Sale suelto, distraído, buscando la salida.'});
 s.push({k:'varas',d:3.2*t.entradas/2+1.4,cap:`${t.entradas} ${t.entradas>1?'entradas':'entrada'} al caballo. ${t.B>80?'Se arranca de lejos y empuja con los riñones metidos.':t.B>65?'Cumple en el peto sin más.':'Sale suelto del peto, cabeceando.'}`});
 s.push({k:'banderillas',d:3.6,cap:'Tercio de banderillas: tres pares en todo lo alto.'});
 let mc=t.N>78?'Embiste con clase y largura: derechazos y naturales templados.':t.N>64?'Faena de altibajos; el toro va y viene sin terminar de entregarse.':'Se queda corto y tira derrotes; el matador tiene que machetearlo.';
 if(t.fell)mc+=' Pierde las manos a mitad de faena.';
 if(t.rajado)mc='Se raja pronto y busca las tablas. Faena imposible.';
 if(t.cogida)mc=`¡Cogida! ${t.mat} es volteado y pasa a la enfermería (${t.cogida.parte}). ${t.sust.n} se hace cargo del toro.`;
 s.push({k:'muleta',d:2.2+t.pases*.75,cap:`${t.mat}: ${mc}`});
 const fin={indulto:'¡Pañuelo naranja! La plaza pide el indulto y la presidencia lo concede. Vuelve al campo como semental.',vuelta:'Pañuelo azul: vuelta al ruedo para el toro en el arrastre.',ovacion:'Ovación cerrada al toro en el arrastre.',silencio:'Silencio en el arrastre.',pitos:'Pitos para el toro en el arrastre.'}[t.res];
 const tr=t.res==='indulto'?'':t.trof===2?` ${t.mat} corta dos orejas.`:t.trof===1?` ${t.mat} corta una oreja.`:'';
 s.push({k:'final',d:3.6,cap:fin+tr});
 return s;
}
function nextToro(){
 const P=PLAY;if(!P)return;P.i++;
 if(P.i>=P.r.toros.length){endCorrida();return}
 const t=P.r.toros[P.i];P.tl=buildTL(t);P.si=0;P.st=0;P.bx=P.W*.06;P.dir=1;P.ph=0;P.band=0;P.oles=[];P.prevSide=0;P.done=false;
 $('#ptoro').textContent=`Toro ${P.i+1} de ${P.r.toros.length} · ${t.mat}`;
 $('#pcap').textContent=P.tl[0].cap;$('#psum').innerHTML='';
}
function tick(dt){
 const P=PLAY;P.t+=dt;P.st+=dt;
 const seg=P.tl[P.si];
 if(P.st>=seg.d){P.si++;P.st=0;if(P.si>=P.tl.length){nextToro();return}$('#pcap').textContent=P.tl[P.si].cap}
}
function drawPlay(){
 const P=PLAY;if(!P||P.done)return;const {c,W,H}=P;const t=P.r.toros[P.i];if(!t)return;
 const seg=P.tl[P.si];const u=clamp(P.st/seg.d,0,1);
 const gy=H*.86, s=H/250, tx=W*.52;
 let bx=P.bx,head=.3,spd=1,kneel=0,tor=null,pic=null,ban=null,pan=null,dim=0;
 const near=x=>1-Math.min(1,Math.abs(x-tx)/(W*.25));
 const N=t.N||60;
 if(seg.k==='salida'){const e=1-Math.pow(1-u,2);bx=W*(.06+.74*e);spd=1.1-u*.5;head=.25}
 else if(seg.k==='capote'){bx=W*.5+W*.3*Math.cos(Math.PI*2*u);head=.3+near(bx)*.6*(N/90);spd=.95;
  if(seg.stumble){const q=Math.sin(u*Math.PI*5);kneel=q>.6?(q-.6)*2.2:0;}
  tor={k:'capote',sw:clamp((bx-tx)/(W*.3),-1,1)}}
 else if(seg.k==='varas'){
  const n=Math.max(1,t.entradas),k=Math.min(n-1,Math.floor(u*n)),v=u*n-k;const cx=W*.36;
  if(v<.35){const a=k===0?W*.8:W*.62;bx=a+(cx-a)*(v/.35);spd=1;head=.4}
  else if(v<.8){bx=cx+Math.sin(P.t*14)*1.5*(t.B/60);spd=.25;head=1;P.ph+=0}
  else{bx=cx+(W*.62-cx)*((v-.8)/.2);spd=.6;head=.3}
  pic={x:W*.2,push:v>=.35&&v<.8?Math.sin(P.t*14)*.5:0}}
 else if(seg.k==='banderillas'){const k=Math.min(2,Math.floor(u*3)),v=u*3-k;const from=[.62,.2,.8][k],to=[.2,.8,.2][k];
  bx=W*(from+(to-from)*v);spd=1;head=.5;P.band=k+(v>.5?1:0);
  const bfrom=to,bto=from;ban={x:W*(bfrom+(bto-bfrom)*v),y:-Math.max(0,Math.sin(v*Math.PI))*14*(Math.abs(v-.5)<.12?1:.2)}}
 else if(seg.k==='muleta'){
  P.band=3;const np=t.pases;
  if(t.rajado&&u>.3){const v=(u-.3)/.7;bx=W*.2+(W*.04-W*.2)*Math.min(1,v*3);spd=v<.33?.9:0;head=.2}
  else{bx=W*.5-W*.29*Math.cos(Math.PI*np*u);head=.3+near(bx)*.7*(N/88);spd=.6+N/250;
   if(t.fell&&u>.55&&u<.75){const q=Math.sin((u-.55)/.2*Math.PI);kneel=q;spd=.1}}
  tor={k:'muleta',sw:clamp((bx-tx)/(W*.29),-1,1)};
  const side=Math.sign(bx-tx);
  if(P.prevSide&&side&&side!==P.prevSide&&N>62&&!t.rajado)P.oles.push({x:R(W*.2,W*.8),y:H*.3,a:1,txt:N>78?'¡Olé!':'¡Bien!'});
  P.prevSide=side||P.prevSide}
 else if(seg.k==='final'){
  P.band=t.res==='devuelto'?0:3;
  if(t.res==='indulto'){bx=P.bx+(W*.06-P.bx)*Math.min(1,u*.8);spd=.8;head=.2;pan={frac:.8,palco:'#ef8a2b'}}
  else if(t.res==='devuelto'){bx=P.bx+(W*.06-P.bx)*Math.min(1,u*.7);spd=.5;head=.1;pan={frac:0,palco:'#2f8f4f'}}
  else{spd=0;head=.2;const fr=t.res==='vuelta'?.6:t.trof===2?.65:t.trof===1?.42:t.res==='ovacion'?.18:0;
   pan={frac:fr,palco:t.res==='vuelta'?'#3a78ff':t.trof>0?'#f6f2ea':null};dim=u>.35?Math.min(.78,(u-.35)*2.2):0}
 }
 if(seg.k!=='final'||t.res==='indulto'||t.res==='devuelto'){if(Math.abs(bx-P.bx)>.01)P.dir=bx>P.bx?1:-1}
 P.ph+=spd*.32*(PLAY.pause?0:PLAY.spd);P.bx=bx;
 // dibujo
 drawRing(c,W,H,P.crowd,P.t,pan);
 if(pic)drawPicador(c,pic.x,gy-4,s*.95,1,pic.push);
 drawBull(c,bx,gy,s,P.dir,{pelo:t.pelo,ph:P.ph,speed:spd,head,kneel,t:P.t,seed:t.id,band:P.band});
 if(tor)drawTorero(c,tx,gy+12,s*1.05,{traje:t.traje,cape:tor.k,sweep:tor.sw,face:tor.sw>0?1:-1});
 if(ban)drawTorero(c,ban.x,gy+14+ban.y,s*.98,{traje:'#2b3e5c',plata:true,arms:true,run:1,ph:P.t*14,face:-P.dir});
 if(seg.k==='salida'||seg.k==='varas')drawTorero(c,W*.88,gy+16,s*.9,{traje:'#1f3a2a',plata:true,cape:'capote',sweep:-.3,face:-1});
 for(const o of P.oles){o.y-=.6;o.a-=.012;if(o.a>0){c.globalAlpha=o.a;c.fillStyle='#fff6e0';c.font=`700 ${Math.round(H/18)}px Archivo, sans-serif`;c.fillText(o.txt,o.x,o.y);c.globalAlpha=1}}
 P.oles=P.oles.filter(o=>o.a>0);
 if(dim>0){c.fillStyle=`rgba(20,14,9,${dim})`;c.fillRect(0,0,W,H);
  c.globalAlpha=Math.min(1,dim*1.4);c.fillStyle='#f2e7d5';c.textAlign='center';
  c.font=`${Math.round(H/12)}px "Barlow Condensed", Arial, sans-serif`;c.fillText(RESTXT[t.res],W/2,H*.48);
  c.font=`600 ${Math.round(H/22)}px Archivo, sans-serif`;c.fillStyle='#d9a85b';c.fillText(t.trof?`${t.trof===2?'Dos orejas':'Una oreja'} para ${t.mat}`:'Arrastre',W/2,H*.6);
  c.textAlign='left';c.globalAlpha=1}
}
function endCorrida(){
 const P=PLAY;if(!P)return;P.done=true;
 const r=P.r;const {c,W,H}=P;
 drawRing(c,W,H,P.crowd,P.t,null);c.fillStyle='rgba(20,14,9,.7)';c.fillRect(0,0,W,H);c.textAlign='center';c.fillStyle='#f2e7d5';
 c.font=`${Math.round(H/11)}px "Barlow Condensed", Arial, sans-serif`;c.fillText('Fin del festejo',W/2,H*.45);
 c.font=`600 ${Math.round(H/22)}px Archivo, sans-serif`;c.fillStyle='#d9a85b';c.fillText(r.resumen,W/2,H*.57);c.textAlign='left';
 $('#pcap').textContent=`Prestigio ${r.dp>=0?'+':''}${r.dp} · Ingresos ${eur(r.ingreso)}${r.premio?` · ${r.premio} gana el premio al toro más bravo de la feria`:''}`;
 $('#ptoro').textContent='Resumen';
 $('#psum').innerHTML=`<div class="tw"><table class="t"><tr><th>Toro</th><th>Matador</th><th>Arrastre</th><th>Trofeos</th><th>Nota</th></tr>${r.toros.map(t=>`<tr><td><b>${esc(t.name)}</b><br><small class="muted">${t.peso} kg · ${t.pelo}</small></td><td>${esc(t.mat)}</td><td class="res-${t.res}">${RESTXT[t.res]}</td><td class="num">${t.res==='indulto'?'Indulto':t.trof?`${t.trof} ${t.trof>1?'or.':'or.'}`:'—'}</td><td class="num"><b>${nota10(t)}</b></td></tr>`).join('')}</table></div>
 <small class="muted">Las madres de cada toro guardan su resultado en la ficha: úsalo para decidir qué vacas siguen en la ganadería.</small>`;
 render();
}

/* ============ modal y avisos ============ */
let onClose=null;
function modal(title,html,cb){closeModal(true);onClose=cb||null;const d=document.createElement('div');d.className='ov';d.id='ov';
 d.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sh"><div class="wrap"><h2 style="flex:1;min-width:0">${esc(title)}</h2><button class="x" aria-label="Cerrar" onclick="closeModal()">✕</button></div></div><div class="bd"><div class="wrap">${html}</div></div></div>`;
 d.addEventListener('click',e=>{if(e.target===d)closeModal()});document.body.appendChild(d);document.body.style.overflow='hidden'}
function closeModal(silent){const d=$('#ov');if(d)d.remove();document.body.style.overflow='';if(onClose&&!silent){const f=onClose;onClose=null;f()}else if(!silent)onClose=null}
let tt=null;function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600)}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

/* ============ arranque ============ */
