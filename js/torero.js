/* ===================== MODO TORERO · sé tú el matador =====================
   Carrera propia (de novillero sin picadores a figura) y lidia jugable en 3D:
   capote, varas, banderillas, faena de muleta con temple y ligazón, estocada con descabello,
   avisos, cogidas, petición de orejas, vuelta al ruedo y salida a hombros. */
const TKEY='hierro-divisa-torero';
let TC=null,TR=null;
function tcLoad(){try{const s=localStorage.getItem(TKEY);return s?JSON.parse(s):null}catch(e){return null}}
function tcSave(){try{if(TC)localStorage.setItem(TKEY,JSON.stringify(TC))}catch(e){}}
TC=tcLoad();
const TRAJES=[['Grana y oro','#7a1525',0],['Azul marino y oro','#1d2f5e',0],['Verde botella y oro','#1f4a32',0],['Tabaco y oro','#5a3a1e',0],['Purísima y oro','#4f7fb8',0],['Nazareno y oro','#4a1f4a',0],['Corinto y oro','#5e1c2a',0],['Rosa y oro','#d07a96',0],['Blanco y plata','#ece6d8',1],['Negro y azabache','#161616',1]];
const TESTILO={artista:['Artista','Temple y empaque: más nota en cada pase limpio'],valiente:['Valiente','Se pone cerca: el público se entrega antes'],tecnico:['Lidiador','Ventana de temple más amplia y toros más fijos'],poderoso:['Poderoso','Manda: liga más y sufre menos enganchones']};
const TRANGO=[['nov','Novillero sin picadores',0],['novp','Novillero con picadores',25],['mat','Matador de toros',55],['fig','Figura del toreo',82]];
const TPUEB=['Cheste','Vinaròs','Ondara','Requena','Utiel','Algemesí','Navalcarnero','Brihuega','Arganda del Rey','Villaseca de la Sagra','Calasparra','Ciudad Rodrigo','Peñafiel','Tarazona','Moraleja'];
const TSEG=[['Plaza de Castellón','Feria de la Magdalena'],['Plaza de Alicante','Hogueras de San Juan'],['Plaza de Albacete','Feria de septiembre'],['La Ribera (Logroño)','San Mateo'],['La Glorieta (Salamanca)','Feria de la Virgen'],['Plaza de Jerez','Feria del Caballo'],['El Puerto de Santa María','Temporada de verano'],['Plaza de Granada','Corpus']];
function tcRango(){let r=TRANGO[0];for(const x of TRANGO)if(TC.pres>=x[2])r=x;if(r[0]!=='nov'&&r[0]!=='novp'&&!TC.alt)r=TRANGO[1];return r}
function tcNew(){const nm=($('#tcName')||{}).value||TC_F.name||'';const n=nm.trim()||'El Niño de la Ribera';
 TC={name:n,traje:TC_F.traje,estilo:TC_F.estilo,pres:4,money:0,tardes:0,orejas:0,rabos:0,pg:0,cog:0,ind:0,alt:false,temp:2027,of:[],hist:[],conv:0,oid:1};tcOffers();tcSave();try{auInit();clarin()}catch(e){}menuGo('torero')}
const TC_F={traje:0,estilo:'artista',name:''};
function tcOffers(){const r=tcRango()[0],of=[];const N=3;
 for(let i=0;i<N;i++){let o;
  if(r==='nov'){o={plaza:'Plaza de '+pick(TPUEB),feria:pick(['Fiestas patronales','Feria de agosto','Fiestas de la Virgen','Fiestas del Cristo']),cat:3,tipo:'nov'}}
  else if(r==='novp'){const big=TC.pres>38&&Math.random()<.4;if(big)o={plaza:'Las Ventas (Madrid)',feria:pick(['Novilladas de verano','San Isidro · novillada']),cat:1,tipo:'novp'};else{const s=pick(TSEG);o={plaza:s[0],feria:s[1]+' · novillada',cat:2,tipo:'novp'}}}
  else{const f=FERIAS.filter(x=>x.tipo==='corrida'&&x.minP<=TC.pres+12);const big=f.length&&Math.random()<clamp((TC.pres-45)/45,.15,.85);if(big){const x=pick(f);o={plaza:x.plaza,feria:x.feria,cat:1,tipo:'corrida'}}else{const s=pick(TSEG);o={plaza:s[0],feria:s[1],cat:2,tipo:'corrida'}}}
  const gs=[...GANADERIAS].sort((a,b)=>(o.cat===1?b.pres-a.pres:a.pres-b.pres)+R(-25,25));o.gan=GANADERIAS.indexOf(gs[0]);
  const pool=(r==='nov'||r==='novp')?NOVILLEROS:MATADORES;o.comp=[...pool].sort(()=>Math.random()-.5).slice(0,2).map(m=>m.n);
  const base=r==='nov'?RI(1200,3500):r==='novp'?RI(5000,16000)*(o.cat===1?1.8:1):(o.cat===1?RI(45000,90000):RI(18000,40000))*(.6+TC.pres/90);o.hon=Math.round(base/100)*100;o.id=TC.oid++;of.push(o)}
 if(TC.pres>=55&&!TC.alt){const x=pick(FERIAS.filter(f=>f.tipo==='corrida'));of.unshift({id:TC.oid++,plaza:x.plaza,feria:x.feria+' · ¡alternativa!',cat:1,tipo:'alt',gan:GANADERIAS.indexOf([...GANADERIAS].sort((a,b)=>b.pres-a.pres)[RI(0,5)]),comp:[...MATADORES].sort(()=>Math.random()-.5).slice(0,2).map(m=>m.n),hon:RI(30000,50000)})}
 TC.of=of.slice(0,3)}
function tcBorrar(){if(!(window.__noConfirm||confirm('¿Retirarte y borrar tu carrera de torero?')))return;TC=null;try{localStorage.removeItem(TKEY)}catch(e){}menuGo('torero')}
function toreroScreen(){
 const top=`<div class="mTop"><button class="mBack" onclick="menuGo('main')">${ICO.chev}<span>Volver</span></button><b>Modo torero</b><span></span></div>`;
 if(!TC){return `<div class="menu mForm">${menuBg()}${top}<div class="mPanel">
  <section class="sect card goldline"><header><h2>Tu nombre en los carteles</h2></header><input id="tcName" class="trInp" maxlength="28" placeholder="El Niño de la Ribera" value="${esc(TC_F.name||'')}" oninput="TC_F.name=this.value"></section>
  <section class="sect card goldline"><header><h2>Vestido de torear</h2></header><div class="trTrajes">${TRAJES.map(([n,c,p],i)=>`<button class="trTr ${TC_F.traje===i?'on':''}" onclick="TC_F.traje=${i};render()" style="--c:${c};--o:${p?'#d5dadd':'#e6bb55'}"><i></i><span>${n}</span></button>`).join('')}</div></section>
  <section class="sect card goldline"><header><h2>Concepto del toreo</h2></header><div class="seg">${Object.entries(TESTILO).map(([k,[n,d]])=>`<button aria-pressed="${TC_F.estilo===k}" onclick="TC_F.estilo='${k}';render()"><b>${n}</b><span>${d}</span></button>`).join('')}</div></section>
  <button class="btn oro adv" onclick="tcNew()">Empezar de novillero${ICO.chev}</button>
  <small class="muted" style="display:block;text-align:center;margin-top:.6rem">Empiezas en las plazas de los pueblos, sin picadores. Con triunfos llegarán las novilladas con caballos, la alternativa y las grandes ferias.</small></div></div>`}
 const rg=tcRango(),tj=TRAJES[TC.traje]||TRAJES[0];const nx=TRANGO.find(x=>x[2]>TC.pres);
 return `<div class="menu mForm">${menuBg()}${top}<div class="mPanel">
  <section class="sect card goldline trCard"><div class="trHd"><div class="trAv" style="--c:${tj[1]};--o:${tj[2]?'#d5dadd':'#e6bb55'}"><i></i></div><div><h2>${esc(TC.name)}</h2><small>${rg[1]} · ${TESTILO[TC.estilo][0]} · ${tj[0]}</small></div></div>
   <div class="trPres"><span>Cartel</span><i><u style="width:${TC.pres}%"></u></i><b>${Math.round(TC.pres)}</b></div>${nx?`<small class="muted">Siguiente escalón: ${nx[1]} (cartel ${nx[2]}${nx[0]==='mat'?' y tomar la alternativa':''})</small>`:''}
   <div class="kpis"><div><b>${TC.tardes}</b><small>tardes</small></div><div><b>${TC.orejas}</b><small>orejas</small></div><div><b>${TC.pg}</b><small>a hombros</small></div><div><b>${eur(TC.money)}</b><small>ganado</small></div></div></section>
  ${TC.conv?`<div class="card muted">Convaleciente de la última cornada: pierdes ${TC.conv} ${TC.conv>1?'contratos':'contrato'} mientras te recuperas.</div>`:''}
  <section class="sect"><header><h2>Contratos</h2><span class="sp"></span><small class="muted">elige tu próxima tarde</small></header><div class="list">${TC.of.map(o=>{const g=GANADERIAS[o.gan]||GANADERIAS[0];return `<div class="trOf ${o.tipo==='alt'?'alt':''}"><div><b>${esc(o.plaza)}</b><small>${esc(o.feria)}</small><small class="muted">${o.tipo==='nov'?'Novillos':o.tipo==='novp'?'Novillos (con picadores)':'Toros'} de <b>${esc(g.name)}</b> · con ${o.comp.map(esc).join(' y ')}</small></div><div class="trOfR"><b>${eur(o.hon)}</b><button class="btn sm oro" onclick="tcGo(${o.id})">Paseíllo</button></div></div>`}).join('')}</div></section>
  ${TC.hist.length?`<section class="sect"><header><h2>Últimas tardes</h2></header><div class="list">${TC.hist.slice(-6).reverse().map(h=>`<div class="task"><span class="t"><b>${esc(h.plaza)}</b><br><small class="muted">${esc(h.gan)} · ${h.txt}</small></span>${h.pg?'<span class="badge oro">a hombros</span>':h.or?`<span class="badge ok">${h.or} or.</span>`:''}</div>`).join('')}</div></section>`:''}
  <button class="btn" onclick="tcBorrar()">Cortarse la coleta (borrar carrera)</button></div></div>`}
function tcGo(id){const o=TC.of.find(x=>x.id===id);if(!o)return;if(TC.conv>0){TC.conv--;tcOffers();tcSave();toast('Sigues de baja: el contrato se lo llevan otros');render();return}
 menuIntro(o.plaza,o.feria,()=>{enterTorero(o)})}

/* ---------- la tarde ---------- */
function trToro(o){const g=GANADERIAS[o.gan]||GANADERIAS[0],e=ENC[g.enc]||ENC.Domecq;const nov=o.tipo==='nov'||o.tipo==='novp';const v=(x,s)=>clamp((x+gauss()*s)/100,.25,.99);
 const bra=v(e.bra,10),nob=v(e.nob,11),fue=v(e.fue,10),cas=v(e.cas,9);
 return {name:masc(pick(FEM)),num:RI(1,99),pelo:pick(e.pelos),peso:nov?RI(395,470):RI(500,605),gan:g.name,div:g.div,bra,nob,fue,cas,rec:clamp((nob+bra)/2+gauss()*.06,.3,.99),nov}}
function trHUD(){if($('#h3tor'))return;const d=document.createElement('div');d.id='h3tor';d.className='h3tor';d.hidden=true;
 d.innerHTML=`<div class="trTv"><span class="trLg">${ICO.toroG||''}</span><div><b id="trT1"></b><small id="trT2"></small></div><span class="trClk" id="trClk"></span></div>
 <div class="trMet"><div class="trM"><span>Plaza</span><i><u id="trExc"></u></i></div><div class="trM hp"><span>Torero</span><i><u id="trHp"></u></i></div></div>
 <div class="trBar" id="trBar" hidden><i id="trZn"></i><u id="trNd"></u><span id="trBl"></span></div>
 <div class="trBtns" id="trBtns"></div><button class="trBig" id="trBig" hidden>¡Templa!</button>
 <button class="btn sm trCam" id="trCam">Cámara: torero</button>`;
 W3.root.appendChild(d);
 $('#trBig').addEventListener('pointerdown',e=>{e.preventDefault();trBig()});
 $('#trCam').onclick=()=>{if(!TR)return;TR.view=TR.view==='juego'?'tv':'juego';TR.cut=1;$('#trCam').textContent='Cámara: '+(TR.view==='juego'?'torero':'TV')};
 window.addEventListener('keydown',e=>{if(W3.mode!=='torero'||!TR)return;const k=e.key;if(k===' '){e.preventDefault();trBig()}const n=parseInt(k,10);if(n>=1&&n<=6){const b=document.querySelectorAll('#trBtns button')[n-1];if(b)b.click()}})}
const _hudModeT=hudMode;
hudMode=function(m){_hudModeT(m);const t=$('#h3tor');if(t)t.hidden=m!=='torero';if(W3.root)W3.root.classList.toggle('torMode',m==='torero');if(m==='torero'){$('#joy').hidden=false;$('.h3act').hidden=true;$('#h3adv').hidden=true;$('#h3toro').hidden=true;$('#h3cap').hidden=false;$('#h3tasks').hidden=true}};
function enterTorero(o){if(!show3D())return;trHUD();W3.from='torero';
 try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>W3.wl=l).catch(()=>{})}catch(e){}
 const P=buildPlaza();W3.mode='torero';W3.scene=P.sc;hudMode('torero');crowdStart();setPanu(0);P.pp.visible=false;
 const tj=TRAJES[TC.traje]||TRAJES[0];const me=makePerson({traje:tj[1],plata:!!tj[2],hat:'montera'});me.mul=makeMuleta();me.arms[0].hand.add(me.mul);me.cap=makeCapote();me.b.add(me.cap);me.sw=makeEstoque();
 const pe=[0,1].map(i=>{const p=makePerson({traje:pick(['#2b3e5c','#1f3a2a','#3a2a1f','#4a1f2f','#222']),plata:true,hat:'montera'});const c=makeCapote();c.scale.setScalar(.85);p.b.add(c);p.cap=c;return p});
 const hor=makeHorse2({peto:true,col:'#cfc6b4'});const pic=makePerson({traje:'#b9975a',hat:'castoreno',pole:3.4});seat(pic);pic.root.position.set(0,.98,-.05);pic.arms[1].lock=1;pic.arms[1].sh.rotation.x=-1;hor.body.add(pic.root);
 const actors=[me.root,hor.root,...pe.map(p=>p.root)];P.sc.add(...actors);
 TR={o,me,pe,hm:hor,actors,toros:[trToro(o),trToro(o)],i:-1,res:[],view:'juego',cut:1,exc:0,hp:100,btnKey:'',t:0};
 $('#h3info').innerHTML=`<b>${esc(TC.name)}</b> · ${esc(o.plaza)}`;W3.cam.fov=50;W3.cam.updateProjectionMatrix();
 const dm=$('#h3dim');dm.hidden=false;dm.style.opacity=1;const g=GANADERIAS[o.gan]||GANADERIAS[0];
 dm.innerHTML=`<div class="cartel"><span class="lbl">${esc(o.feria)}</span><h2>${esc(o.plaza)}</h2><div class="cm">${[TC.name,...o.comp].map((n,i)=>`<div class="mt"><b>${esc(n)}</b><small>${i===0?'tú':'compañero'}</small></div>`).join('')}</div>
 <div class="ct">${TR.toros.map((t,i)=>`<div class="tt"><b>${i+1}º</b><span>${esc(t.name)} · ${t.num}</span><small>${t.peso} kg · ${t.pelo}</small></div>`).join('')}</div><small class="muted">${o.tipo==='nov'?'Novillos':'Toros'} de ${esc(g.name)}</small>
 <button class="btn oro adv" onclick="trStart()">Hacer el paseíllo</button></div>`}
function trStart(){$('#h3dim').hidden=true;auInit();try{clarin()}catch(e){}trNext()}
function trNext(){const C=TR,P=W3.P;C.i++;musicStop();$('#h3dim').hidden=true;$('#h3ban').hidden=true;P.flw.forEach(f=>{f.act=false;f.m.visible=false});setPanu(0);P.pp.visible=false;
 if(C.bm){P.sc.remove(C.bm.root);C.bm=null}if(C.me.sw.parent)C.me.sw.parent.remove(C.me.sw);
 if(C.i>=C.toros.length||C.out){trEnd();return}
 const t=C.toros[C.i];const bm=makeBull({pelo:t.pelo,kind:'toro',div:t.div});if(t.nov)bm.root.scale.setScalar(.9);P.sc.add(bm.root);C.bm=bm;
 C.t0=t;C.r={pts:0,pases:0,series:0,maxS:0,varas:0,ent:0,desc:0,avisos:0,cog:0,brindis:0,trof:0,res:'',txt:[]};
 C.b={x:0,z:-PR+1.2,yaw:0,sp:0,head:.3,toss:0,kneel:0,push:false,look:0,band:0,fall:0,sword:0,st:'salida',t:0,fz:t.fue,fuel:Math.round(18+t.cas*20+t.fue*6),sen:0,ref:0};
 C.T={x:-PR+4,z:3,yaw:Math.PI/2,cape:'capote',hand:0,sweep:0,sp:0,y:0,rx:0,spin:0,arm:null,sword:false,pose:'stand'};
 C.pst=[{x:Math.sin(1.4)*(PR-2.5),z:Math.cos(1.4)*(PR-2.5),sw:0,sp:0,yaw:0,tx:null},{x:Math.sin(-1.1)*(PR-2.5),z:Math.cos(-1.1)*(PR-2.5),sw:0,sp:0,yaw:0,tx:null}];
 C.ph='salida';C.pt=0;C.serie=0;C.sq=0;C.q=null;C.music=false;C.mt=0;C.hor={vis:false,x:-13,z:-6,yaw:.87};C.cut=1;
 banner(`${C.i+1}º · ${t.name}`,`${t.peso} kg · ${t.pelo} · ${t.gan}`,3.4);cap(`Se abre la puerta de chiqueros. Sale ${t.name}, nº ${t.num}, ${t.pelo}, de ${t.peso} kilos.`);trBtns([])}
function cap(s){$('#h3cap').textContent=s}
function trBtns(list){const k=list.map(b=>b.l+(b.dis?'0':'1')).join('|');if(k===TR.btnKey)return;TR.btnKey=k;const el=$('#trBtns');el.innerHTML='';
 list.forEach((b,i)=>{const x=document.createElement('button');x.className='btn '+(b.c||'');x.innerHTML=`<i>${i+1}</i>${esc(b.l)}`;x.disabled=!!b.dis;x.onclick=e=>{e.preventDefault();if(!x.disabled)b.fn()};el.appendChild(x)})}
const EST=()=>TC?TC.estilo:'artista';
function trDist(){const b=TR.b,T=TR.T;return Math.hypot(b.x-T.x,b.z-T.z)}
/* citar: el toro decide si se arranca */
function trCite(kind,lig){const C=TR,b=C.b,T=C.T,t=C.t0;if(b.st!=='fijo'&&!lig)return;const d=trDist();
 const capo=['veronica','chicuelina','media'].includes(kind);T.cape=capo?'capote':'muleta';T.hand=kind==='natural'?1:0;C.kind=kind;
 if(b.fuel<=0){cap(`${t.name} está parado, sin una embestida más. Hay que matarlo.`);b.ref++;return}
 if(!lig&&d>15){cap('Demasiado lejos: acórtale las distancias.');return}
 let p=.22+t.bra*.85-(1-b.fz)*.25-b.ref*.05;if(d<2.8)p-=.15;else if(d<=8)p+=.08;else p-=(d-8)*.06;if(EST()==='tecnico')p+=.06;if(lig)p+=.35;
 if(Math.random()>clamp(p,.06,.98)){b.ref++;b.st='rehusa';b.t=0;cap(b.ref>=3?'No quiere: escarba, cabecea y se queda a la defensiva. Sin pelea.':pick(['No se arranca. Escarba y mira.','Se queda parado, midiendo. Vuelve a citar.','Distraído, no atiende al cite.']));if(b.ref>=3)whistles(.2);return}
 b.ref=0;b.st='espera';b.t=0;b.rd=lig?.12:clamp(.25+(1-t.bra)*1.1+Math.random()*.3,.2,1.6);b.cd=d;
 b.bulto=!capo&&b.sen>.35&&Math.random()<b.sen*.35;T.cite=1;
 cap(lig?'¡Liga! Le deja la muleta puesta y el toro vuelve.':d>9?'Cita de lejos, dando el pecho...':d<4?'Cita en corto, metido entre los pitones.':'Cita con la '+(capo?'capa':kind==='natural'?'izquierda':'derecha')+'...');trBtns([])}
function trLure(){const T=TR.T,sg=TR.T.hand?-1:1;const rx=Math.cos(T.yaw)*sg,rz=-Math.sin(T.yaw)*sg;const k=TR.b.bulto?.15:.95;return {x:T.x+rx*k+Math.sin(T.yaw)*.4,z:T.z+rz*k+Math.cos(T.yaw)*.4}}
function trBig(){const C=TR;if(!C)return;const b=C.b;
 if(b.st==='arr')return trTemplar();if(C.ph==='aim')return trEntrar();if(C.ph==='desc')return trDescabello()}
function trTemplar(){const C=TR,b=C.b,T=C.T,t=C.t0;const d=trDist();const tec=EST()==='tecnico'?.35:0;
 let q,how;if(d<=2.8+tec&&d>=1.0-tec*.4){q=clamp(1-Math.abs(d-1.7)/(1.3+tec)*.55,0,1);how='bien'}else if(d>2.8+tec){q=.22;how='pronto'}else{q=.12;how='tarde'}
 if(how==='pronto'&&Math.random()<(EST()==='poderoso'?.15:.32)*(1.3-t.nob)){C.r.txt.push('enganchón');cap('Se adelanta y el toro se le cuela: ¡enganchón! La muleta sale volando.');whistles(.25);C.exc=Math.max(0,C.exc-.15);trPaseStart(.05,true);return}
 trPaseStart(q,false)}
function trPaseStart(q,sucio){const C=TR,b=C.b,T=C.T,t=C.t0;b.st='pase';b.t=0;C.q=q;const kind=C.kind;
 const capo=T.cape==='capote',rem=kind==='pecho'||kind==='media';const L=trLure();
 const th0=Math.atan2(b.x-T.x,b.z-T.z),thL=Math.atan2(L.x-T.x,L.z-T.z);let dir=Math.sign(angD(th0,thL))||1;
 b.pa={th0,dir,r0:Math.max(1,Math.hypot(b.x-T.x,b.z-T.z)),rad:(capo?1.45:1.15)+(1-q)*.55+(EST()==='valiente'?-.12:0),span:Math.PI*(rem?.62:capo?.78:(.85+t.rec*.4)*(q>.6?1:.8)),dur:(capo?1.35:1.25+t.rec*.7)*(sucio?.7:1),rem,capo};
 T.cite=0;b.fuel--;b.fz=Math.max(.1,b.fz-.008);if(C.r.pases>18)b.sen=Math.min(1,b.sen+.025);
 const cerca=b.cd<4.2?1.15:1,ser=1+C.serie*.16,nat=kind==='natural'?1.2:1,art=EST()==='artista'?1.1:1,val=EST()==='valiente'&&b.cd<3.6?1.12:1;
 const pts=sucio?0:q*6.5*(capo?.55:1)*cerca*ser*nat*art*val*(.55+t.nob*.6);C.r.pts+=pts;C.r.pases++;C.serie++;C.sq+=q;
 const h=t.nob*q;const ex=sucio?-.05:q>.7?.22*(1+C.serie*.12):q>.45?.1:-.03;C.exc=clamp(C.exc+ex,0,1);
 const nm={veronica:'Verónica',chicuelina:'Chicuelina',media:'Media verónica',derechazo:'Derechazo',natural:'Natural',pecho:'Pase de pecho',adorno:'Trincherilla'}[kind];
 if(!sucio)cap(`${nm}${q>.8?' de cartel: templado, largo, mandando.':q>.55?' limpio.':q>.3?', algo destemplado.':': sin mando, el toro pasa a su aire.'}${b.cd<3.4&&q>.6?' ¡Qué cerca!':''}`);
 if(q>.55&&!sucio)setTimeout(()=>{if(!TR)return;ole(C.serie>=3?'¡Olé, olé!':'¡Olé!');oleSnd(C.serie>=3)},b.pa.dur*450);
 if(kind==='adorno'||kind==='chicuelina')T.spinOn=1;
 if(q<.3&&Math.random()<.35)whistles(.15);
 if(b.fz<.32&&Math.random()<.25){b.claud=1;cap('Pierde las manos en mitad del pase: le falta fuerza. Pitos en el tendido.');C.r.pts-=3;whistles(.25)}}
function trSerieEnd(remate){const C=TR;if(!C.serie)return;const n=C.serie,avg=C.sq/n;C.r.series++;C.r.maxS=Math.max(C.r.maxS,n);
 if(n>=3&&avg>.6){const bon=(remate?8:4)+n*1.5*avg;C.r.pts+=bon;C.exc=clamp(C.exc+.25,0,1);applause(2.5,.3);ole(n>=5?'¡¡Olé!!':'¡Bravo!');if(C.T.cape==='muleta'&&!C.music&&avg>.62&&C.r.pases>=6){C.music=true;try{musicStart('faena')}catch(e){}banner('¡Música, maestro!','La banda arranca un pasodoble',2.6)}}
 else if(n>=2&&avg>.45)applause(1.4,.15);
 C.serie=0;C.sq=0}
/* tercio de varas, banderillas y brindis: escenas automáticas */
function trScript(kind){const C=TR;C.ph=kind;C.pt=0;C.cut=1;trBtns([]);C.b.st='script';
 if(kind==='varas'){C.hor.vis=true;C.r.varas++;const B=C.b;C.vs={b0:{x:B.x,z:B.z}};try{clarin()}catch(e){}cap(C.r.varas===1?'Cambio de tercio: salen los picadores. Pones al toro en suerte frente al caballo.':'Otra vara: lo vuelves a colocar de largo.')}
 if(kind==='banderillas'){try{clarin()}catch(e){}C.hor.vis=false;C.bp=0;cap('Tercio de banderillas: tus subalternos parean al toro.')}
 if(kind==='brindis'){C.r.brindis=1;cap('Montera en mano, brinda la muerte del toro al público.');applause(2.5,.25);C.exc=clamp(C.exc+.15,0,1);C.r.pts+=2}}
function trTickScript(dt){const C=TR,b=C.b,T=C.T,t=C.t0;C.pt+=dt;const u=C.pt;
 if(C.ph==='varas'){const H={x:-13,z:-6},F={x:H.x+Math.sin(.87)*2.3,z:H.z+Math.cos(.87)*2.3};
  T.x+=(-3-T.x)*Math.min(1,dt*2);T.z+=(-4.5-T.z)*Math.min(1,dt*2);faceTo(T,b.x,b.z);T.cape='capote';
  if(u<1.8){b.x+=( -4-b.x)*Math.min(1,dt*1.5);b.z+=(1-b.z)*Math.min(1,dt*1.5);b.sp=.5;faceTo(b,H.x,H.z)}
  else if(u<3.2){const v=(u-1.8)/1.4;b.x=lerp(-4,F.x,ease(v));b.z=lerp(1,F.z,ease(v));b.sp=1.2;faceTo(b,H.x,H.z);if(Math.random()<dt*6)dust(W3.P.D,b.x,0,b.z,.4)}
  else if(u<7){b.push=true;b.sp=0;b.head=.1;faceTo(b,H.x,H.z);if(!C.vs.ok){C.vs.ok=1;const br=t.bra;b.fz=Math.max(.2,b.fz-(.14+Math.random()*.06));
    if(br>.78){C.r.pts+=6;C.exc=clamp(C.exc+.2,0,1);cap('¡Se arranca con alegría y mete los riñones! Empuja con fijeza bajo el peto.');applause(2,.25)}else if(br<.55){C.r.pts-=3;cap('Sale suelto del caballo, huyendo del castigo: mansea.');whistles(.2)}else cap('Recibe el puyazo y empuja, sin terminar de emplearse.')}
   C.hor.x=H.x-Math.sin(.87)*Math.min(.6,(u-3.2)*.2);C.hor.z=H.z-Math.cos(.87)*Math.min(.6,(u-3.2)*.2)}
  else if(u<9){const v=(u-7)/2;b.push=false;b.x=lerp(F.x,-2,ease(v));b.z=lerp(F.z,2,ease(v));b.sp=.7;faceTo(b,T.x,T.z);C.pst[0].tx={x:-3,z:3}}
  else{b.st='fijo';C.ph='varasq';C.hor.x=H.x;C.hor.z=H.z}}
 if(C.ph==='banderillas'){const k=Math.floor(u/3.3),v=(u%3.3)/3.3;if(k>=3){b.band=Math.max(b.band,6);C.ph='muletaPre';b.st='fijo';cap('Suena el clarín. Coges la muleta y la espada: ¿brindas el toro?');try{clarin()}catch(e){}return}
  const pe=C.pst[k%2];const sx=Math.sin(k*1.7+1)*9,sz=Math.cos(k*1.7+1)*9;
  if(v<.55){pe.x=lerp(sx,b.x+(k%2?1:-1)*.8,ease(v/.55));pe.z=lerp(sz,b.z+.8,ease(v/.55));pe.sp=1.2;faceTo(pe,b.x,b.z);b.sp=.8;faceTo(b,pe.x,pe.z);b.head=.3}
  else{if(!C['bp'+k]){C['bp'+k]=1;b.band=Math.min(6,b.band+2);b.toss=.8;C.r.pts+=t.bra>.7?1.5:.5;if(Math.random()<.6){ole('¡Bien!');oleSnd(false)}applause(1.2,.15)}
   pe.x+=(Math.sin(k)*(PR-2.5)-pe.x)*Math.min(1,dt*2);pe.z+=(Math.cos(k)*(PR-2.5)-pe.z)*Math.min(1,dt*2);pe.sp=1.4;b.sp=.2}
  T.x+=(-PR+5-T.x)*Math.min(1,dt);T.z+=(4-T.z)*Math.min(1,dt);faceTo(T,b.x,b.z);T.cape='capote'}
 if(C.ph==='brindis'){T.arm=u<2.2?'up':null;T.cape='muleta';T.sword=true;faceTo(T,0,PR+5);if(u>2.6){T.arm=null;C.ph='muleta';C.mt=0;b.st='fijo';cap('Comienza la faena de muleta. Cita, templa y liga.')}}}
/* matar: perfilarse, entrar, descabello */
function trMatar(){const C=TR;C.ph='perf';C.pt=0;C.T.sword=true;C.T.cape='muleta';C.T.hand=0;C.T.arm='perfil';trSerieEnd(false);try{musicStop()}catch(e){}cap('Monta la espada y se perfila. Busca el momento: cuadra al toro y fija la cruz.');trBtns([])}
function trEntrar(){const C=TR,b=C.b,t=C.t0;if(C.ph!=='aim')return;const pos=Math.sin(C.pt*C.aw);const zn=EST()==='tecnico'?.16:.11;C.r.ent++;C.ph='entra';C.pt=0;C.kres=Math.abs(pos)<zn?'entera':Math.abs(pos)<zn*2.6?'caida':'pinchazo';
 C.kcog=Math.random()<b.sen*.22+(C.kres==='pinchazo'?.06:0);$('#trBar').hidden=true;$('#trBig').hidden=true}
function trDescabello(){const C=TR;if(C.ph!=='desc')return;const pos=Math.sin(C.pt*3.2);C.r.desc++;if(Math.abs(pos)<.16){C.b.dobla=0;C.ph='dobla';C.pt=0;cap('Acierta con el descabello. El toro cae fulminado.');$('#trBar').hidden=true;$('#trBig').hidden=true}else{cap('Falla el descabello. Vuelve a intentarlo.');whistles(.12)}}
function trAviso(){const C=TR;C.r.avisos++;try{clarin('aviso')}catch(e){}banner(`${C.r.avisos}º aviso`,C.r.avisos>=3?'El toro vuelve a los corrales':'La presidencia avisa del tiempo',2.6);
 if(C.r.avisos>=3){C.r.res='corral';C.ph='corral';C.pt=0;$('#trBar').hidden=true;$('#trBig').hidden=true;whistles(.5);cap('Tercer aviso: salen los cabestros y el toro vuelve vivo a los corrales. Bronca monumental.');trBtns([])}}
/* cogida */
function trCogida(sev){const C=TR,T=C.T,b=C.b;if(C.ph==='coge')return;C.prev=C.ph;C.ph='coge';C.pt=0;C.r.cog++;C.serie=0;C.sq=0;b.st='coge';b.toss=1.2;
 const g=sev||(Math.random()<.12+b.sen*.25?'grave':Math.random()<.45?'media':'leve');C.cg=g;const dmg=g==='grave'?R(55,90):g==='media'?R(22,40):R(8,18);C.hp=Math.max(0,C.hp-dmg);
 try{navigator.vibrate&&navigator.vibrate([80,40,160])}catch(e){}bufido(.9);C.exc=clamp(C.exc+.2,0,1);try{shake&&shake(9)}catch(e){}
 cap(g==='grave'?'¡Cogida! El toro lo prende por el muslo y lo zarandea. Los subalternos acuden al quite.':g==='media'?'¡Volteretón! Lo levanta los pies del suelo. Se duele del costado.':'¡Lo prende! Lo voltea, pero se levanta sin mirarse la ropa.');trBtns([]);$('#trBar').hidden=true;$('#trBig').hidden=true}
/* tick principal */
function toreroTick(dt){const C=TR;if(!C||!C.bm){trCam(dt);return}const P=W3.P,b=C.b,T=C.T,t=C.t0;C.t+=dt;const now=performance.now()/1000;
 b.toss=Math.max(0,(b.toss||0)-dt*2.5);b.push=false;b.look=0;b.sp=b.st==='pase'||b.st==='arr'?b.sp:0;b.kneel=0;T.sp=0;T.sweep*=.9;
 const ox=b.x,oz=b.z;let yo=null;
 // fases scripted
 if(['varas','banderillas','brindis'].includes(C.ph))trTickScript(dt);
 // salida del toro
 if(C.ph==='salida'){b.t+=dt;const k=b.t;if(k<3){const v=k/3;b.x=lerp(0,4,v);b.z=lerp(-PR+1.2,-4,ease(v));b.sp=1.4;yo=Math.atan2(4,PR-5)}else if(k<6){const pe=C.pst[0];pe.tx={x:2,z:2};faceTo(b,pe.x,pe.z);b.x+=Math.sin(b.yaw)*dt*3;b.z+=Math.cos(b.yaw)*dt*3;b.sp=.9}
  else{b.st='fijo';C.ph='capote';C.pst[0].tx=null;cap('El toro está en la plaza. Acércate (joystick) y recíbelo con el capote.')}}
 // movimiento del torero
 const free=['capote','varasq','muletaPre','muleta','perf'].includes(C.ph)&&(b.st==='fijo'||b.st==='rehusa'||b.st==='libre');
 if(free&&C.ph!=='perf'){let jx=W3.jx||0,jy=W3.jy||0;const k=W3.keys||{};if(k['w']||k['arrowup'])jy=1;if(k['s']||k['arrowdown'])jy=-1;if(k['a']||k['arrowleft'])jx=-1;if(k['d']||k['arrowright'])jx=1;
  const L=Math.min(1,Math.hypot(jx,jy));if(L>.1){const d=trDist()||1,fx=(b.x-T.x)/d,fz=(b.z-T.z)/d;const mx=fx*jy+(-fz)*jx,mz=fz*jy+fx*jx,ml=Math.hypot(mx,mz)||1;const v=1.7*L;const nx=T.x+mx/ml*v*dt,nz=T.z+mz/ml*v*dt;
   if(Math.hypot(b.x-nx,b.z-nz)>1.3&&Math.hypot(nx,nz)<PR-1.2){T.x=nx;T.z=nz}T.sp=v/4}faceTo(T,b.x,b.z)}
 // estados del toro
 if(b.st==='fijo'||b.st==='rehusa'){b.t+=dt;faceTo2(b,T,dt*2.4);b.head=b.st==='rehusa'?.05+Math.max(0,Math.sin(b.t*6))*.2:.32;if(b.st==='rehusa'&&b.t>1.4)b.st='fijo';
  if(b.st==='fijo'&&C.ph!=='perf'&&C.ph!=='aim'){const d=trDist();if(d<1.8&&Math.random()<dt*(.4+b.sen)){C.kind=T.cape==='capote'?'veronica':'derechazo';b.bulto=true;b.st='espera';b.rd=.15;b.cd=d;cap('¡Se le arranca sin avisar! Estaba demasiado encima.')}}}
 if(b.st==='espera'){b.t+=dt;faceTo2(b,T,dt*4);b.head=.2;if(b.t>=b.rd){b.st='arr';b.t=0;b.v=0;bufido(.45);if(b.cd>8){C.r.pts+=1.5;cap('¡Se arranca de lejos, con alegría!')}}}
 if(b.st==='arr'){b.t+=dt;const L=trLure(),d=trDist();const vmax=(4.2+t.bra*2.3)*(.6+.4*b.fz),vt=d<4.2?3.1+t.bra*.5:vmax;b.v+=(vt-b.v)*Math.min(1,dt*(d<4.2?5:2.5));
  const dx=L.x-b.x,dz=L.z-b.z,dl=Math.hypot(dx,dz)||1;b.x+=dx/dl*b.v*dt;b.z+=dz/dl*b.v*dt;b.sp=b.v/5;b.head=.35+.5*t.nob*(d<3?1:.4);yo=Math.atan2(dx,dz);if(b.v>4&&Math.random()<dt*7)dust(P.D,b.x,0,b.z,.35);
  T.cite=Math.max(0,(T.cite||0)-dt*.6);T.sweep=Math.sin(C.t*4)*.15;
  if(d<.95||dl<.35){const pc=(.3+.45*(1-t.nob)+b.sen*.35)*(EST()==='poderoso'?.8:1)*(b.bulto?1.5:1);if(Math.random()<pc)trCogida();else{cap('Llega tarde al temple: el toro pasa sin mando y tira un derrote.');trPaseStart(.08,true)}}}
 if(b.st==='pase'){b.t+=dt;const A=b.pa,v=Math.min(1,b.t/A.dur),ev=v+.06*Math.sin(2*Math.PI*v);const th=A.th0+A.dir*A.span*ease(ev),rr=lerp(A.r0,A.rad,Math.min(1,v*1.8));
  b.x=T.x+Math.sin(th)*rr;b.z=T.z+Math.cos(th)*rr;b.sp=.85+.25*t.rec;b.head=.4+.55*t.nob*(C.q||0);yo=th+A.dir*Math.PI/2;if(v>.82&&C.q<.4)b.toss=.9;if(b.claud&&v>.3&&v<.7)b.kneel=Math.sin((v-.3)/.4*Math.PI);
  faceTo(T,b.x,b.z);T.yaw+=A.dir*.45;T.sweep=A.dir*(v-.5)*2;if(T.spinOn&&v>.45)T.spin=(v-.45)/.55*Math.PI*2;
  if(v>=1){T.spin=0;T.spinOn=0;b.claud=0;b.st='rem';b.t=0;const q=C.q||0;b.rem={yaw:yo,dist:A.rem?R(6,8):q>.68?R(1.4,2.4):R(3.4,5.5),go:0};if(A.rem)trSerieEnd(true)}}
 if(b.st==='rem'){b.t+=dt;const R0=b.rem;const sp=Math.max(.6,4*(1-R0.go/R0.dist));if(R0.go<R0.dist){b.x+=Math.sin(R0.yaw)*sp*dt;b.z+=Math.cos(R0.yaw)*sp*dt;R0.go+=sp*dt;yo=R0.yaw;b.sp=sp/5}else{faceTo2(b,T,dt*3);b.sp=.25}
  const rb=Math.hypot(b.x,b.z);if(rb>PR-1.6){b.x*=(PR-1.6)/rb;b.z*=(PR-1.6)/rb;R0.go=R0.dist}
  if(C.lig&&b.t>.25){const k=C.lig;C.lig=null;trCite(k,true);if(b.st!=='espera'){b.st='fijo';trSerieEnd(false)}}
  else if(b.t>1.15+R0.dist*.25){b.st='fijo';b.t=0;if(C.serie){trSerieEnd(false)}}}
 if(b.st==='quite'){b.t+=dt;const pe=C.pst[1];pe.tx={x:b.qx,z:b.qz};const dx=pe.x-b.x,dz=pe.z-b.z,dl=Math.hypot(dx,dz)||1;if(dl>1.4){b.x+=dx/dl*3.2*dt;b.z+=dz/dl*3.2*dt;b.sp=.7;yo=Math.atan2(dx,dz)}if(b.t>3.2){b.st='fijo';pe.tx=null}}
 // cogida
 if(C.ph==='coge'){const u=C.pt+=dt;if(u<.7){T.y=Math.sin(u/.7*Math.PI)*1.9;T.rx=-u/.7*Math.PI*1.4}else if(u<2.4){T.y=.12;T.rx=-Math.PI/2;if(u<1.6&&C.cg!=='leve'){b.toss=.6;b.x+=(T.x-b.x)*dt;b.z+=(T.z-b.z)*dt}}
  if(u>.9&&!C.qt){C.qt=1;b.st='quite';b.t=0;b.qx=b.x+(b.x-T.x)*4;b.qz=b.z+(b.z-T.z)*4;const r=Math.hypot(b.qx,b.qz);if(r>PR-3){b.qx*=(PR-3)/r;b.qz*=(PR-3)/r}C.pst[1].x=T.x+1.2;C.pst[1].z=T.z+1.2}
  if(u>2.4){const v=Math.min(1,(u-2.4)/1);T.rx=-Math.PI/2*(1-v);T.y=.12*(1-v)}
  if(u>3.6){C.qt=0;if(C.hp<=0||C.cg==='grave'&&Math.random()<.7){C.out=true;C.r.res='enfermeria';TC.cog++;TC.conv=C.cg==='grave'?2:1;cap(`A la enfermería: ${C.cg==='grave'?'cornada grave en el muslo, de dos trayectorias':'herida por asta de toro'}. ${TR.o.comp[0]} se hace cargo del toro.`);C.ph='fin';C.pt=0;banner('Parte médico',C.cg==='grave'?'Cornada de pronóstico grave':'Pronóstico reservado',3.2);T.y=0;T.rx=0;C.me.root.visible=false}
   else{C.ph=C.prev==='aim'||C.prev==='entra'?'perf':C.prev||'muleta';if(C.ph==='entra')C.ph='perf';C.pt=0;T.y=0;T.rx=0;C.r.pts+=4;C.exc=clamp(C.exc+.15,0,1);applause(2.5,.3);cap('Se levanta, se recompone el vestido y vuelve a la cara del toro. La plaza lo reconoce.');if(C.ph==='perf')T.arm='perfil'}}}
 // matar
 if(C.ph==='perf'){C.pt+=dt;const d=trDist(),fx=(T.x-b.x)/(d||1),fz=(T.z-b.z)/(d||1);const tx=b.x+fx*2.7,tz=b.z+fz*2.7;T.x+=(tx-T.x)*Math.min(1,dt*2);T.z+=(tz-T.z)*Math.min(1,dt*2);T.sp=.3;faceTo(T,b.x,b.z);T.arm='perfil';b.st='fijo';faceTo2(b,T,dt*2);b.head=.15;
  if(C.pt>1.6){C.ph='aim';C.pt=0;C.aw=2+b.sen*2.2+(1-b.fz)*.6+Math.random()*.4;$('#trBar').hidden=false;$('#trBig').hidden=false;$('#trBig').textContent='¡Entrar a matar!';$('#trBl').textContent='Espera a que la aguja pase por la cruz';cap('Perfilado en corto y por derecho. ¡Ahora!')}}
 if(C.ph==='aim'){C.pt+=dt;faceTo(T,b.x,b.z);b.st='fijo';b.head=.15;const pos=Math.sin(C.pt*C.aw),zn=EST()==='tecnico'?.16:.11;$('#trZn').style.cssText=`left:${50-zn*50}%;width:${zn*100}%`;$('#trNd').style.left=(50+pos*50)+'%';if(C.pt>9){C.pt=0;cap('Demasiado tiempo perfilado: el toro se descuadra.');b.sen=Math.min(1,b.sen+.05)}}
 if(C.ph==='entra'){C.pt+=dt;const u=C.pt,d0=2.7;const fx=(b.x-T.x),fz=(b.z-T.z),dl=Math.hypot(fx,fz)||1;T.arm='perfil';
  if(u<.7){T.x+=fx/dl*3.6*dt;T.z+=fz/dl*3.6*dt;T.sp=1;faceTo(T,b.x,b.z)}
  else if(!C.kdone){C.kdone=1;if(C.kcog){C.kdone=0;C.ph='aim';trCogida('media');return}
   if(C.kres==='pinchazo'){cap(pick(['Pincha en hueso.','Pinchazo arriba, sin soltar.','Pincha y sale rebotado.']));C.r.pts-=5;whistles(.15)}
   else{b.sword=C.kres==='entera'?1:.6;T.sword=false;cap(C.kres==='entera'?'¡Estocada entera, en todo lo alto! Se tira por derecho.':'Estocada algo caída. El toro aguanta en pie.');C.r.pts+=C.kres==='entera'?(C.r.ent===1?14:8):3;if(C.kres==='entera'){ole('¡Olé!');oleSnd(true);C.exc=clamp(C.exc+.3,0,1)}b.dobla=C.kres==='entera'?R(2.5,6):R(7,13)}
   T.x-=fx/dl*1.2;T.z-=fz/dl*1.2;b.toss=.8}
  else if(u>1.6){C.kdone=0;if(C.kres==='pinchazo'){C.ph='perf';C.pt=0;T.arm='perfil'}else{C.ph='espera';C.pt=0;T.arm=null}}}
 if(C.ph==='espera'){C.pt+=dt;b.st='fijo';faceTo2(b,T,dt);b.head=.1+Math.sin(C.pt*2)*.05;b.dobla-=dt;if(C.pt>7&&$('#trBar').hidden){C.ph='desc';C.pt=0;$('#trBar').hidden=false;$('#trBig').hidden=false;$('#trBig').textContent='¡Descabellar!';$('#trBl').textContent='Verduguillo: busca el hoyo de las agujas';T.sword=true;cap('El toro no dobla. Coge el verduguillo y descabella.')}if(b.dobla<=0){C.ph='dobla';C.pt=0}}
 if(C.ph==='desc'){C.pt+=dt;faceTo(T,b.x,b.z);b.st='fijo';b.head=.05;const pos=Math.sin(C.pt*3.2);$('#trZn').style.cssText='left:42%;width:16%';$('#trNd').style.left=(50+pos*50)+'%';b.dobla-=dt;if(b.dobla<=0){C.ph='dobla';C.pt=0;$('#trBar').hidden=true;$('#trBig').hidden=true}}
 if(C.ph==='dobla'){C.pt+=dt;const u=C.pt;b.st='muerto';b.kneel=Math.min(1,u/1.2);b.fall=u>1.3?Math.min(1,(u-1.3)/.9):0;if(u>1&&!C.dbl){C.dbl=1;applause(3,.35);T.sword=false;T.arm='up'}if(u>3.4){T.arm=null;trPremio()}}
 if(C.ph==='corral'){C.pt+=dt;b.st='script';const dx=0-b.x,dz=-PR+1.2-b.z,dl=Math.hypot(dx,dz);if(dl>.6){b.x+=dx/dl*2.4*dt;b.z+=dz/dl*2.4*dt;b.sp=.6;yo=Math.atan2(dx,dz)}else b.vis=0;if(C.pt>7)trPremio()}
 if(C.ph==='fin'){C.pt+=dt;if(C.pt>3.5&&!C.finS){C.finS=1;trPremio()}}
 if(C.ph==='premio'&&C.award){C.aw2-=dt;if(C.aw2<=0){const f=C.award;C.award=null;f()}}
 if(C.ph==='vuelta'){C.pt+=dt;const a=C.va0+C.pt*.16;T.x=Math.sin(a)*(PR-2.2);T.z=Math.cos(a)*(PR-2.2);T.yaw=a+Math.PI/2;T.sp=.55;T.arm=Math.sin(C.pt*1.3)>.2?'up':null;T.cape=null;if(Math.random()<dt*2.2)throwFlower(T.x,T.z);C.exc=Math.max(C.exc,.6);if(C.pt>13)trVueltaFin()}
 // avisos (desde el inicio de la faena de muleta)
 if(['muleta','perf','aim','entra','espera','desc'].includes(C.ph)){C.mt+=dt;const lim=[170,215,250];if(C.r.avisos<3&&C.mt>lim[C.r.avisos])trAviso();if(C.mt>100)b.sen=Math.min(1,b.sen+dt*.003)}
 // botones según el tercio
 trUI();
 // aplicar al toro
 if(b.st!=='muerto'){if(yo!=null)b.yaw+=angD(b.yaw,yo)*Math.min(1,dt*12);else if(b.st==='script'){const mv=Math.hypot(b.x-ox,b.z-oz);if(mv>.004)b.yaw+=angD(b.yaw,Math.atan2(b.x-ox,b.z-oz))*Math.min(1,dt*8)}}
 const rb=Math.hypot(b.x,b.z);if(rb>PR-1){b.x*=(PR-1)/rb;b.z*=(PR-1)/rb}
 const BM=C.bm;BM.root.visible=b.vis!==0;BM.root.position.set(b.x,.3*b.fall,b.z);BM.root.rotation.set(0,b.yaw,-b.fall*1.45);
 animBull(BM,dt,{speed:b.fall?0:b.sp,head:b.head,kneel:b.kneel,toss:b.toss,push:b.push,look:b.look,fall:b.fall});setBand(BM,b.band);
 const sw=C.me.sw;if(b.sword>0){if(sw.parent!==BM.b)BM.b.add(sw);const cz=BM.cruz,vis=b.sword>=1?.22:.42;sw.position.set(.05,cz.y+.81*vis,cz.z+.59*vis);sw.rotation.set(2.2,0,.15);sw.visible=true}
 else if(T.sword){const hand=C.me.arms[T.hand?0:1].hand;if(sw.parent!==hand)hand.add(sw);sw.position.set(0,-.04,0);sw.rotation.set(T.arm==='perfil'?1.4:.4,0,0);sw.visible=true}else sw.visible=false;
 trPose(C.me,T,dt,now);
 // subalternos
 C.pe.forEach((p,i)=>{const s=C.pst[i];const hx=Math.sin(i?-1.1:1.4)*(PR-2.5),hz=Math.cos(i?-1.1:1.4)*(PR-2.5);const tg=s.tx||(C.ph==='banderillas'?null:{x:hx,z:hz});
  if(tg){const dx=tg.x-s.x,dz=tg.z-s.z,dl=Math.hypot(dx,dz);if(dl>.3){s.x+=dx/dl*Math.min(dl,3.2*dt);s.z+=dz/dl*Math.min(dl,3.2*dt);s.sp=.8;s.yaw=Math.atan2(dx,dz)}else s.yaw=Math.atan2(b.x-s.x,b.z-s.z)}
  p.root.position.set(s.x,0,s.z);p.root.rotation.y=s.sp>.1?s.yaw:Math.atan2(b.x-s.x,b.z-s.z);p.cap.rotation.y=Math.sin(now*2+i)*.2;p.arms.forEach(ar=>{ar.lock=1;ar.sh.rotation.set(-1.1,0,0)});clothTick(p.cap.userData.cl,now+i,.2);animPerson(p,dt,s.sp||0);s.sp=0});
 const HR=TR.hm;HR.root.visible=!!C.hor.vis;if(C.hor.vis){HR.root.position.set(C.hor.x,0,C.hor.z);HR.root.rotation.y=C.hor.yaw;animHorse(HR,dt,0)}
 // público
 C.exc=Math.max(0,C.exc-dt*.05);crowdLevel(.03+C.exc*.16);crowdAnim(P,C.exc,now);flowersTick(dt);dustTick(P.D,dt);
 $('#trExc').style.width=Math.round(C.exc*100)+'%';$('#trHp').style.width=Math.round(C.hp)+'%';
 $('#trT1').textContent=`${t.name} · nº ${t.num}`;$('#trT2').textContent=`${t.gan} · ${{salida:'Salida',capote:'Tercio de capa',varas:'Tercio de varas',varasq:'Tercio de varas',banderillas:'Banderillas',muletaPre:'Brindis',brindis:'Brindis',muleta:'Faena de muleta',perf:'Suerte suprema',aim:'Suerte suprema',entra:'Suerte suprema',espera:'Suerte suprema',desc:'Descabello',dobla:'Dobla el toro',premio:'Trofeos',vuelta:'Vuelta al ruedo',coge:'¡Cogida!',corral:'Al corral',fin:'Enfermería'}[C.ph]||''} · ${C.r.pases} pases`;
 const mt=C.mt||0;$('#trClk').textContent=['muleta','perf','aim','entra','espera','desc'].includes(C.ph)?`${Math.floor(mt/60)}:${String(Math.floor(mt%60)).padStart(2,'0')}${C.r.avisos?' · '+C.r.avisos+' aviso'+(C.r.avisos>1?'s':''):''}`:'';
 if(b.st==='arr'){const d=trDist(),tec=EST()==='tecnico'?.35:0;$('#trBar').hidden=false;$('#trBig').hidden=false;$('#trBig').textContent='¡Templa!';const m=x=>clamp(1-(x-.6)/5.4,0,1)*100;$('#trZn').style.cssText=`left:${m(2.8+tec)}%;width:${m(1-tec*.4)-m(2.8+tec)}%`;$('#trNd').style.left=m(d)+'%';$('#trBl').textContent='Templa cuando el toro entre en la zona'}
 else if(!['aim','desc'].includes(C.ph)){$('#trBar').hidden=true;$('#trBig').hidden=true}
 trCam(dt)}
function faceTo2(o,T,k){const y=Math.atan2(T.x-o.x,T.z-o.z);o.yaw+=angD(o.yaw,y)*Math.min(1,k)}
function trPose(M2,T,dt,now){M2.root.visible=TR.ph!=='fin'||!TR.out;M2.root.position.set(T.x,T.y||0,T.z);M2.root.rotation.set(T.rx||0,T.yaw+(T.spin||0),0);
 M2.mul.visible=T.cape==='muleta';M2.cap.visible=T.cape==='capote';const mh=T.hand||0;const hand=M2.arms[mh].hand;if(M2.mul.parent!==hand)hand.add(M2.mul);
 M2.arms.forEach(ar=>{ar.lock=0});
 if(T.cape==='muleta'){const ar=M2.arms[mh];ar.lock=1;ar.sh.rotation.set((T.arm==='perfil'&&mh===0?-.4:-.85)-(T.cite||0)*.45,0,(mh?-1:1)*.3);ar.el.rotation.x=-.3;M2.mul.rotation.set(0,(mh?.4:-.4)+(T.sweep||0)*(mh?-1:1)*1.1,0)}
 if(T.cape==='capote'){M2.cap.rotation.set(0,-(T.sweep||0)*.9,0);M2.cap.position.y=1.05;M2.arms.forEach(ar=>{ar.lock=1;ar.sh.rotation.set(-1.1-(T.cite||0)*.3,0,0)})}
 if(T.arm==='up'){const ar=M2.arms[1];ar.lock=1;ar.sh.rotation.set(-2.9,0,0)}
 if(T.arm==='perfil'){const ar=M2.arms[1];ar.lock=1;ar.sh.rotation.set(-1.4,0,0);ar.el.rotation.x=0}
 const amp=Math.min(1,Math.abs((T.sweep||0)-(T.lsw||0))/Math.max(dt,.001)*.15);T.lsw=T.sweep;if(M2.mul.visible)clothTick(M2.mul.userData.cl,now,amp);if(M2.cap.visible)clothTick(M2.cap.userData.cl,now*1.1,amp);
 animPerson(M2,dt,T.sp||0,T.pose)}
function trUI(){const C=TR,b=C.b,T=C.T;if(['premio','vuelta'].includes(C.ph))return;const st=b.st;const ok=st==='fijo'||st==='rehusa';const L=[];
 if(C.ph==='capote'){L.push({l:'Verónica',fn:()=>trQ('veronica'),dis:!ok&&st!=='rem'},{l:'Chicuelina',fn:()=>trQ('chicuelina'),dis:!ok&&st!=='rem'},{l:'Media (remate)',fn:()=>trQ('media'),dis:!ok&&st!=='rem'});
  if((C.r.pases>=2||C.t>40)&&ok)L.push({l:C.t0.nov&&TR.o.tipo==='nov'?'Cambio de tercio':'Al caballo',c:'oro',fn:()=>{trSerieEnd(false);if(TR.o.tipo==='nov')trScript('banderillas');else trScript('varas')}})}
 else if(C.ph==='varasq'&&ok){if(C.r.varas<3)L.push({l:'Otra vara',fn:()=>trScript('varas')});L.push({l:'Pedir el cambio',c:'oro',fn:()=>{C.hor.vis=false;trScript('banderillas')}})}
 else if(C.ph==='muletaPre'){L.push({l:'Brindar al público',c:'oro',fn:()=>trScript('brindis')},{l:'Empezar la faena',fn:()=>{C.ph='muleta';C.mt=0;T.cape='muleta';T.sword=true;cap('Comienza la faena de muleta. Cita, templa y liga.')}})}
 else if(C.ph==='muleta'){const can=ok||st==='rem';L.push({l:'Derechazo',fn:()=>trQ('derechazo'),dis:!can},{l:'Natural',fn:()=>trQ('natural'),dis:!can},{l:'De pecho',fn:()=>trQ('pecho'),dis:!can},{l:'Adorno',fn:()=>trQ('adorno'),dis:!can});
  if(ok&&(C.r.pases>=6||b.fuel<=2||C.r.avisos))L.push({l:'Entrar a matar',c:'pri',fn:trMatar});
  if(ok&&C.t0.bra>.88&&C.t0.cas>.78&&C.r.pts>120&&C.r.pases>=24)L.push({l:'Pedir el indulto',c:'oro',fn:trIndulto})}
 else if(C.ph==='premio'){}
 trBtns(L)}
function trQ(k){const C=TR,b=C.b;if(b.st==='rem'){if(b.t<1.05&&b.fuel>0){C.lig=k;C.kind=k;C.T.hand=k==='natural'?1:0;C.T.cape=['veronica','chicuelina','media'].includes(k)?'capote':'muleta'}return}trCite(k,false)}
function trIndulto(){const C=TR;C.r.res='indulto';C.ph='premio';C.b.st='script';setPanu(.95);W3.P.pp.visible=true;W3.P.pp.material.color.set('#f08a24');banner('¡Indulto!',`${C.t0.name} vuelve vivo al campo`,3.6);applause(5,.4);C.r.trof=2;trPremioFin()}
function trPremio(){const C=TR,r=C.r;if(C.ph==='premio'||C.ph==='vuelta')return;C.ph='premio';C.pt=0;trBtns([]);$('#trBar').hidden=true;$('#trBig').hidden=true;
 if(r.res==='enfermeria'||r.res==='corral'){trPremioFin();return}
 let F=r.pts-(r.ent-1)*6-r.desc*3-r.avisos*12+(r.cog?6:0);r.F=F;
 const frac=clamp((F-45)/85,0,1);setPanu(frac);
 C.award=()=>{const entOK=r.ent<=2&&r.desc<=1;let tr=0;if(F>=70&&entOK)tr=1;if(F>=118&&r.ent===1&&r.desc===0)tr=2;if(tr===2&&F>=195&&r.cog===0&&Math.random()<.35)r.rabo=1;r.trof=tr;
  r.res=tr?'orejas':F>=50?'ovacion':F>=25?'silencio':'pitos';W3.P.pp.visible=!!tr;if(tr)W3.P.pp.material.color.set('#ffffff');
  banner(r.rabo?'¡Dos orejas y rabo!':tr===2?'¡Dos orejas!':tr===1?'Una oreja':r.res==='ovacion'?'Ovación':r.res==='silencio'?'Silencio':'Pitos',tr?'La presidencia saca el pañuelo blanco':r.res==='ovacion'?'Petición minoritaria: saluda desde el tercio':'',3.4);
  if(tr){applause(4,.4);oleSnd(true)}else if(r.res==='pitos')whistles(.4);trPremioFin()};C.aw2=2.2}
function trPremioFin(){const C=TR,r=C.r;const L=[];
 if((r.trof>=1||r.res==='indulto')&&!C.out)L.push({l:'Dar la vuelta al ruedo',c:'oro',fn:trVuelta});
 L.push({l:C.i+1<C.toros.length&&!C.out?'Siguiente toro':'Fin de la tarde',fn:trVueltaFin});C.ph='premio';C.res.push(r);trBtns(L);
 const t=C.t0;cap(`${t.name}: ${r.res==='indulto'?'indultado':r.res==='corral'?'devuelto a los corrales':r.res==='enfermeria'?'lo mata tu compañero':r.rabo?'dos orejas y rabo':r.trof===2?'dos orejas':r.trof===1?'una oreja':r.res}. ${r.pases} pases, ${r.series} series${r.ent?', '+r.ent+' '+(r.ent>1?'entradas':'entrada')+' a matar':''}${r.avisos?', '+r.avisos+' aviso'+(r.avisos>1?'s':''):''}.`)}
function trVuelta(){const C=TR;C.ph='vuelta';C.pt=0;C.va0=Math.atan2(C.T.x,C.T.z);trBtns([{l:'Terminar la vuelta',fn:trVueltaFin}]);try{musicStart('puerta')}catch(e){}if(C.bm)C.bm.root.visible=false;C.b.vis=0}
function trVueltaFin(){const C=TR;if(!C)return;C.T.arm=null;C.T.cape='capote';trNext()}
function trEnd(){const C=TR,o=C.o;musicStop();const or=C.res.reduce((s,r)=>s+(r.trof||0),0),rab=C.res.reduce((s,r)=>s+(r.rabo||0),0),ind=C.res.filter(r=>r.res==='indulto').length;
 const pg=!C.out&&(or>=2||ind>0);const cf=o.cat===1?1.7:o.cat===2?1.15:.8;const bad=C.res.filter(r=>['pitos','corral'].includes(r.res)).length;
 let dp=(or*1.1+rab*1.5+(pg?2:0)+ind*3-bad*1.2+C.res.filter(r=>r.res==='ovacion').length*.4)*cf;if(o.tipo==='alt'){TC.alt=true;dp+=4}
 const hon=C.out?Math.round(o.hon*.5):o.hon;TC.pres=clamp(TC.pres+dp,0,100);TC.money+=hon;TC.tardes++;TC.orejas+=or;TC.rabos+=rab;TC.pg+=pg?1:0;TC.ind+=ind;
 const g=GANADERIAS[o.gan]||GANADERIAS[0];const txt=C.res.map(r=>r.res==='indulto'?'indulto':r.rabo?'2 or. y rabo':r.trof?r.trof+' or.':r.res).join(' · ');
 TC.hist.push({plaza:o.plaza,gan:g.name,or,pg,txt});if(TC.hist.length>30)TC.hist.shift();tcOffers();tcSave();
 if(pg){try{musicStart('puerta')}catch(e){}try{confetti(120)}catch(e){}}
 const dm=$('#h3dim');dm.hidden=false;dm.style.opacity=1;trBtns([]);
 dm.innerHTML=`<div class="cartel"><span class="lbl">${esc(o.feria)} · fin de la tarde</span><h2>${pg?'¡A hombros por la puerta grande!':esc(o.plaza)}</h2>
 <div class="kpis"><div><b>${or}</b><small>orejas</small></div><div><b>${dp>=0?'+':''}${dp.toFixed(1)}</b><small>cartel</small></div><div><b>${eur(hon)}</b><small>honorarios</small></div><div><b>${Math.round(TC.pres)}</b><small>${tcRango()[1]}</small></div></div>
 <div class="tw"><table class="t"><tr><th>Toro</th><th>Pases</th><th>Resultado</th></tr>${C.res.map((r,i)=>`<tr><td><b>${esc(C.toros[i].name)}</b></td><td class="num">${r.pases}</td><td>${{orejas:r.rabo?'2 orejas y rabo':r.trof+(r.trof>1?' orejas':' oreja'),ovacion:'Ovación',silencio:'Silencio',pitos:'Pitos',corral:'Al corral',enfermeria:'Enfermería',indulto:'Indulto'}[r.res]||r.res}</td></tr>`).join('')}</table></div>
 ${o.tipo==='alt'?'<p>Has tomado la alternativa: ya eres matador de toros.</p>':''}<button class="btn oro adv" onclick="trExit()">Volver a tu carrera</button></div>`;cap('');TR.done=true}
function trExit(){const C=TR;if(C){if(!C.done&&C.res.length<C.toros.length){/* abandono: cuenta como tarde mala */TC.tardes++;TC.pres=clamp(TC.pres-1.5,0,100);tcOffers();tcSave()}
  const P=W3.P;for(const a of C.actors)P.sc.remove(a);if(C.bm)P.sc.remove(C.bm.root);if(C.me.sw.parent)C.me.sw.parent.remove(C.me.sw);P.flw.forEach(f=>{f.act=false;f.m.visible=false});setPanu(0);P.pp.visible=false}
 TR=null;$('#h3dim').hidden=true;$('#h3ban').hidden=true;W3.cam.fov=60;W3.cam.updateProjectionMatrix();crowdStop();MENU.v='torero';exit3D()}
/* cámaras: detrás del torero o realización de TV */
function trCam(dt){const C=TR,cam=W3.cam;if(!C||!C.b)return;const b=C.b,T=C.T;let p,l,k=Math.min(1,dt*3.2);
 const scripted=['salida','varas','banderillas','dobla','vuelta','corral','premio','coge','entra'].includes(C.ph);
 if(C.view==='juego'&&!scripted){const d=trDist()||1,fx=(b.x-T.x)/d,fz=(b.z-T.z)/d,rx=-fz,rz=fx;const back=4.4+Math.min(3,d*.15);p=[T.x-fx*back+rx*1.5,2.35,T.z-fz*back+rz*1.5];l=[T.x+fx*Math.min(d,4)*.7,1.05,T.z+fz*Math.min(d,4)*.7];const r=Math.hypot(p[0],p[2]);if(r>PR-.6){p[0]*=(PR-.6)/r;p[2]*=(PR-.6)/r}}
 else{C.st=(C.st||0)+dt;if(C.st>5.5){C.st=0;C.shot=(C.shot||0)+1;C.cut=1}const tv=C.ph==='vuelta'?T:{x:(b.x+T.x)/2,z:(b.z+T.z)/2};const s=C.ph==='vuelta'?'wide':['low','wide','low2'][(C.shot||0)%3];
  if(s==='wide'){const a=Math.atan2(tv.x,tv.z)+.7;p=[Math.sin(a)*(PR+8),9.5,Math.cos(a)*(PR+8)];l=[tv.x*.8,1,tv.z*.8]}
  else{const dx=b.x-T.x,dz=b.z-T.z,d=Math.hypot(dx,dz)||1,qx=-dz/d,qz=dx/d,sg=s==='low'?1:-1;p=[tv.x+qx*7*sg,1.4,tv.z+qz*7*sg];const r=Math.hypot(p[0],p[2]);if(r>PR-1){p[0]*=(PR-1)/r;p[2]*=(PR-1)/r}l=[tv.x,1.05,tv.z]}}
 if(C.cut){cam.position.set(p[0],p[1],p[2]);W3.look.set(l[0],l[1],l[2]);C.cut=0}else{cam.position.x+=(p[0]-cam.position.x)*k;cam.position.y+=(p[1]-cam.position.y)*k;cam.position.z+=(p[2]-cam.position.z)*k;W3.look.x+=(l[0]-W3.look.x)*k;W3.look.y+=(l[1]-W3.look.y)*k;W3.look.z+=(l[2]-W3.look.z)*k}
 cam.lookAt(W3.look)}
/* menú principal: entrada al modo torero (bloqueado hasta terminarlo al completo) */
const TR_LOCK=true;
const TR_CAND='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#e6bb55" d="M7 10V7a5 5 0 0 1 10 0v3h1.2c.7 0 1.3.6 1.3 1.3v8.4c0 .7-.6 1.3-1.3 1.3H5.8c-.7 0-1.3-.6-1.3-1.3v-8.4c0-.7.6-1.3 1.3-1.3H7zm2 0h6V7a3 3 0 0 0-6 0v3zm3 3.2a1.6 1.6 0 0 0-.8 3v1.8h1.6v-1.8a1.6 1.6 0 0 0-.8-3z"/></svg>';
function trBloq(){try{uiSnd&&uiSnd('cap')}catch(e){}toast('Modo torero bloqueado: lo estamos terminando. Muy pronto podrás vestirte de luces.')}
const _startScreenT=startScreen;
startScreen=function(){if(MENU.v==='torero'&&!TR_LOCK)return toreroScreen();if(MENU.v==='torero')MENU.v='main';let h=_startScreenT();
 if(MENU.v==='main')h=h.replace(`<button class="mItem" onclick="menuGo('modos')">`,`<button class="mItem trItem trLock" aria-disabled="true" onclick="trBloq()"><b>Modo torero</b><small>Próximamente · en desarrollo</small><span class="mArr trCand">${TR_CAND}</span></button>\n   <button class="mItem" onclick="menuGo('modos')">`);
 if(MENU.v==='modos')h=h.replace(`<div class="mMode"><i style="background-image:url(img/palco.jpg)">`,`<div class="mMode"><i style="background-image:url(img/plaza-2.jpg)"></i><div><b>Modo torero · próximamente</b><p>Sé tú el matador: recibe con el capote, liga series de muleta con temple, entra a matar y sal a hombros. Carrera de novillero a figura.</p></div></div><div class="mMode"><i style="background-image:url(img/palco.jpg)">`);
 return h};
/* capote y muleta con caída real: el paño se curva hacia delante y recoge la luz */
const _clothTickT=clothTick;
clothTick=function(m,t,amp){_clothTickT(m,t,amp);const k=m.userData.curv;if(!k)return;const g=m.geometry,p=g.attributes.position,W=g.parameters.width/2,H=g.parameters.height;
 for(let i=0;i<p.count;i++){const x=p.getX(i)/W,y=p.getY(i);const d=(H/2-y)/H;p.array[i*3+2]+=k*x*x-.06*d*d+.03*Math.sin(x*3+t*1.3)*d}p.needsUpdate=true;g.computeVertexNormals()};
const _makeCapoteT=makeCapote;
makeCapote=function(){const g=_makeCapoteT();const cl=g.userData.cl;cl.userData.curv=.36;g.position.y=1.02;g.position.z=.36;g.children.forEach(c=>{if(c.material){c.material.side=THREE.FrontSide;c.material.roughness=.92}});return g};
