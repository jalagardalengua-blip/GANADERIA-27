/* ===================== GANADERÍA DE CORRO · LA PLAZA DE FIESTAS DE CADA PUEBLO =====================
   Cada pueblo del selector tiene su plaza: la que ocupan los cadafales y los bous en sus fiestas, con lo que
   la hace reconocible desde la arena. Por ejemplo:
   - Benicarló: el campanario octogonal exento junto a Sant Bartomeu.
   - Alcalà de Xivert y Ontinyent: los campanarios más altos de la Comunitat.
   - Betxí: el Palau-Castell renacentista de la Plaça Major.
   - El Puig: el monasterio de cuatro torres.
   - Sagunt: el castillo sobre el cerro tras la Plaça Major y Santa Maria.
   - Peñíscola: el castillo del Papa Luna sobre el peñón, en el mar.
   - Dénia: el castillo, el Montgó y el puerto.
   - Xàbia: Sant Bertomeu, iglesia-fortaleza de piedra tosca, bajo el Montgó.
   - Segorbe: las torres medievales.
   - Foios: su torre.
   Los pueblos de costa abren la calle de levante al paseo y al mar. Todo lo nuevo es decorado lejano o queda
   detrás de las fachadas: no cambia por dónde puede ir la res (las físicas y los refugios son los mismos).
   Fuentes consultadas: prensa local (El Periòdic, Valencia Bonita, El Debate, Diari València), webs de turismo
   (comunitatvalenciana.com, turismodecastellon.com, Turisme Dival, macma.org) y fichas de campanarios
   (campaners.com). */

// colores de piedra
const PP_ST={piedra:[1.06,.99,.88],tosca:[1.12,.93,.68],blanca:[1.22,1.2,1.15],ocre:[1.1,.95,.76],gris:[.95,.94,.92]};
// colores de cadafales
const PP_CAD={
 roig:[[.85,.12,.08],[.92,.92,.9],[.72,.08,.06],[.95,.72,.08]],
 mar:[[.12,.3,.75],[.92,.92,.9],[.25,.55,.85],[.92,.92,.9],[.1,.45,.22]],
 verd:[[.1,.45,.22],[.92,.92,.9],[.95,.72,.08],[.12,.3,.75]],
 fusta:[[.62,.45,.3],[.5,.36,.24],[.7,.55,.38],[.56,.42,.3]],
 festa:[[.85,.12,.08],[.95,.72,.08],[.12,.3,.75],[.1,.45,.22],[.92,.92,.9]]};
// un campanario propio sustituye al genérico de la iglesia
const PP=(nom,o)=>{const T_=Object.assign({nom,styles:['calA','calB','calA','calC'],fl:[2,3],ref:'amarillo',centro:'fuente'},o);if(T_.camp&&T_.fondo==='iglesia')T_.sinTorre=true;return T_};
// teja vidriada azul de las cúpulas valencianas y azulejo de los chapiteles (mismas texturas que la iglesia)
function ppVidriada(){return pmxCanvas('vidriada',128,128,(c,w,h)=>{const g=['#1f4fa8','#2a62c4','#163c86','#e9eef5'];for(let y=0;y<16;y++)for(let x=0;x<16;x++){c.fillStyle=g[(x*7+y*3)%11<8?(x+y)%3:3];c.fillRect(x*8,y*8,8,8)}})}
function ppAzulejo(){return pmxCanvas('azulejo',128,128,(c,w,h)=>{for(let y=0;y<8;y++)for(let x=0;x<8;x++){c.fillStyle=(x+y)%2?'#1f4fa8':'#e9eef5';c.fillRect(x*16,y*16,16,16)}c.globalAlpha=.25;c.fillStyle='#fff';for(let i=0;i<64;i++)c.fillRect((i%8)*16+2,Math.floor(i/8)*16+2,5,3)})}
// sierras del fondo: [ángulo (grados, 0 = norte de la plaza, hacia el cajón), distancia, altura, anchura]
const PP_SERRA={
 espadà:[[-150,175,95,120],[-115,185,80,110],[-80,180,70,100],[-185,190,60,90]],
 montgó_s:[[180,165,105,150],[155,180,70,80]],
 montgó_n:[[0,170,105,150],[30,185,60,80]],
 desert:[[-60,165,85,120],[-25,180,75,110],[-95,185,60,90]],
 irta:[[90,175,55,140],[60,185,45,100]],
 serra:[[-160,180,70,120],[-120,190,55,100],[160,190,50,90]],
 segària:[[-170,170,75,110],[-135,185,55,90]],
 alcalatén:[[-140,175,80,130],[-180,185,60,100],[-100,190,55,90]],
 calderona:[[-60,180,70,140],[-100,190,55,100]],
 vall:[[150,170,85,140],[-160,180,70,120],[110,190,55,90]],
 alacant:[[-150,175,75,120],[150,180,60,100],[-100,190,50,90]]};

Object.assign(PMX_PLAZAS,{
 // ---------------- Castellón ----------------
 almassora:PP("Plaça de la Vila d'Almassora",{fondo:'iglesia',styles:['calA','calB','calC','calA'],ref:'rojo',centro:'fanal',cad:PP_CAD.roig,
  camp:{h:30,w:2.2,cap:'teja'}}),
 cabanes:PP("Plaça de l'Església de Cabanes",{fondo:'iglesia',st:PP_ST.ocre,styles:['stone','stone','calT','stone'],ref:'fusta',cad:PP_CAD.fusta,colWood:true,
  camp:{h:26,w:2,cap:'teja'},serra:'alcalatén'}),
 torreblanca:PP("Plaça de l'Església de Torreblanca",{fondo:'iglesia',styles:['calA','calC','calA'],terrat:.5,zocalo:[.16,.36,.72],gfTint:[1.3,1.28,1.22],ref:'blanco',centro:'palmera',cad:PP_CAD.mar,azulejo:true,
  torreMed:[{x:-17.5,z:17,h:17,w:2.4,col:PP_ST.blanca}]}),
 benicarlo:PP("Plaça de Sant Bartomeu de Benicarló",{fondo:'iglesia',dosPortes:true,sinTorre:true,styles:['calA','calB','calA','calC'],ref:'blanco',centro:'palmera',cad:PP_CAD.mar,mar:true,
  camp:{exent:true,side:-1,h:38,w:2.3,oct:true,cap:'cupula'}}),
 vinaros:PP("Plaça Parroquial de Vinaròs",{fondo:'iglesia',sinTorre:true,fortif:true,st:PP_ST.ocre,styles:['calA','calB','calC','calA'],ref:'blanco',centro:'fanal',cad:PP_CAD.mar,mar:true,
  camp:{exent:true,side:1,h:33,w:2.3,cap:'pinacle'}}),
 peniscola:PP("Plaça de Santa Maria de Peníscola",{fondo:'iglesia',st:PP_ST.piedra,styles:['calA','calC','calA','stone'],terrat:.6,zocalo:[.16,.36,.72],gfTint:[1.32,1.3,1.24],ref:'blanco',centro:'palmera',cad:PP_CAD.mar,azulejo:true,mar:true,
  castell:{x:118,z:-38,s:.62,ry:-1.2,col:'#d1bd98',hill:'#a39070',n:22},roca:{x:118,z:-38}}),
 segorbe:PP("Plaça de la Cova Santa de Segorbe",{fondo:'arcade',styles:['stone','calA','calT','stone','calB'],fl:[2,3],ref:'fusta',centro:'fuente',cad:PP_CAD.fusta,colWood:true,
  torreMed:[{x:-18,z:-17,h:19,w:2.6,col:PP_ST.ocre},{x:18,z:17.5,h:16,w:2.3,col:PP_ST.ocre}],campLejos:{x:-34,z:-48,h:34,w:2.6,cap:'teja'},serra:'calderona'}),
 moncofa:PP("Plaça de l'Església de Moncofa",{fondo:'iglesia',cupula:true,styles:['calA','calC','calA'],terrat:.55,zocalo:[.16,.36,.72],gfTint:[1.32,1.3,1.24],ref:'blanco',centro:'palmera',cad:PP_CAD.mar,azulejo:true,mar:true}),
 lavall:PP("Plaça del Centre de la Vall d'Uixó",{fondo:'ajuntament',styles:['calB','calA','calB','calC'],fl:[3,4],ref:'rojo',centro:'fanal',cad:PP_CAD.roig,
  campLejos:{x:22,z:-34,h:32,w:2.3,cap:'cupula'},serra:'espadà'}),
 betxi:PP("Plaça Major de Betxí",{fondo:'ajuntament',palau:{h:17,w:2.6,top:'merlets',col:PP_ST.ocre},styles:['stone','calA','calT','stone'],ref:'fusta',centro:'fuente',cad:PP_CAD.fusta,colWood:true,serra:'espadà'}),
 lalcora:PP("Plaça de l'Església de l'Alcora",{fondo:'iglesia',azulejo:true,styles:['calA','calB','calC'],zocalo:[.18,.42,.28],gfTint:[1.26,1.22,1.14],ref:'amarillo',centro:'fuente',cad:PP_CAD.verd,
  camp:{h:30,w:2.2,cap:'azulejo'},serra:'alcalatén'}),
 borriol:PP("Plaça de la Font de Borriol",{fondo:'iglesia',st:PP_ST.ocre,styles:['stone','calA','calT','stone'],ref:'fusta',centro:'fuente',cad:PP_CAD.fusta,colWood:true,
  castell:{x:-40,z:-118,s:.55,ry:.3,col:'#a99474',hill:'#7d7152',n:16,ruina:true,torre:false},serra:'desert'}),
 alcala:PP("Plaça de l'Església d'Alcalà de Xivert",{fondo:'iglesia',sinTorre:true,st:PP_ST.ocre,styles:['calA','stone','calB','calA'],ref:'amarillo',centro:'fuente',cad:PP_CAD.festa,
  camp:{exent:true,side:1,h:46,w:2.4,oct:true,cap:'cupula',cos:3},serra:'irta'}),
 benicassim:PP("Plaça de l'Església de Benicàssim",{fondo:'iglesia',st:PP_ST.blanca,styles:['calA','calC','calA'],terrat:.6,zocalo:[.16,.36,.72],gfTint:[1.32,1.3,1.24],ref:'blanco',centro:'palmera',cad:PP_CAD.mar,mar:true,
  camp:{h:28,w:2.1,cap:'azulejo'},serra:'desert'}),
 // ---------------- Valencia ----------------
 meliana:PP("Plaça de l'Ajuntament de Meliana",{fondo:'ajuntament',styles:['calB','calA','calB','calC'],fl:[2,3],ref:'rojo',centro:'fanal',cad:PP_CAD.roig,campLejos:{x:-24,z:-30,h:28,w:2.1,cap:'azulejo'}}),
 museros:PP("Plaça de l'Església de Museros",{fondo:'iglesia',azulejo:true,styles:['calA','calB','calC'],ref:'amarillo',centro:'fanal',cad:PP_CAD.festa,camp:{h:29,w:2.2,cap:'azulejo'}}),
 pucol:PP("Plaça del Palau de Puçol",{fondo:'ajuntament',palau:{h:15,w:2.4,top:'piramide',col:PP_ST.blanca},styles:['calA','calB','calA','calC'],ref:'amarillo',centro:'palmera',cad:PP_CAD.festa,
  campLejos:{x:-26,z:-32,h:30,w:2.2,cap:'azulejo'},serra:'calderona'}),
 massamagrell:PP("Plaça de l'Església de Massamagrell",{fondo:'iglesia',cupula:true,styles:['calA','calB','calC','calA'],ref:'rojo',centro:'fanal',cad:PP_CAD.roig}),
 foios:PP("Plaça de la Torre de Foios",{fondo:'ajuntament',styles:['calB','calA','calC','calB'],fl:[2,3],ref:'amarillo',centro:'fanal',cad:PP_CAD.festa,
  torreMed:[{x:18,z:-17,h:18,w:2.6,col:PP_ST.ocre}],campLejos:{x:-24,z:-32,h:28,w:2.1,cap:'azulejo'}}),
 alboraia:PP("Plaça de l'Església d'Alboraia",{fondo:'iglesia',azulejo:true,styles:['calA','calB','calC'],ref:'blanco',centro:'palmera',cad:PP_CAD.mar,camp:{h:28,w:2.1,cap:'azulejo'}}),
 lliria:PP("Plaça Major de Llíria",{fondo:'ajuntament',styles:['calA','stone','calB','calT'],fl:[2,3],ref:'amarillo',centro:'fuente',cad:PP_CAD.festa,
  campLejos:{x:6,z:-44,y:9,h:30,w:2.4,cap:'cupula'},serra:'calderona'}),
 chiva:PP("Plaça de la Vila de Chiva",{fondo:'arcade',styles:['stone','calA','calT','stone'],ref:'fusta',centro:'fuente',cad:PP_CAD.fusta,colWood:true,
  castell:{x:30,z:-112,s:.6,ry:-.4,col:'#b6a07c',hill:'#86775a',n:18,ruina:true},serra:'serra'}),
 ontinyent:PP("Plaça Major d'Ontinyent",{fondo:'ajuntament',porxos:true,styles:['calA','stone','calB','calA'],fl:[3,4],ref:'amarillo',centro:'fuente',cad:PP_CAD.festa,
  campLejos:{x:-20,z:-36,h:48,w:2.6,oct:true,cap:'cupula',cos:3},serra:'vall'}),
 sueca:PP("Plaça de l'Ajuntament de Sueca",{fondo:'ajuntament',styles:['calB','calA','calB','calC'],fl:[3,4],ref:'rojo',centro:'fanal',cad:PP_CAD.roig,campLejos:{x:22,z:-30,h:32,w:2.3,cap:'cupula'}}),
 elpuig:PP("Plaça del Monestir del Puig",{fondo:'ajuntament',monestir:true,palau:{h:20,w:3.1,top:'piramide',col:PP_ST.ocre,quatre:true},styles:['calA','calB','calC'],ref:'amarillo',centro:'fanal',cad:PP_CAD.festa,serra:'calderona'}),
 sagunt:PP("Plaça Major de Sagunt",{fondo:'iglesia',gotic:true,porxos:true,st:PP_ST.ocre,styles:['calA','stone','calB','calT'],fl:[2,3],ref:'amarillo',centro:'fuente',cad:PP_CAD.festa,
  castell:{x:-15,z:-128,s:1.15,ry:.05,col:'#c2a57b',hill:'#8f7b57',n:40}}),
 // ---------------- Alicante ----------------
 denia:PP("Plaça de la Constitució de Dénia",{fondo:'iglesia',cupula:true,styles:['calA','calC','calA','calB'],terrat:.5,zocalo:[.16,.36,.72],gfTint:[1.3,1.28,1.22],ref:'blanco',centro:'palmera',cad:PP_CAD.mar,mar:true,
  castell:{x:-70,z:-92,s:.55,ry:.6,col:'#cdb48c',hill:'#9b8a68',n:20},serra:'montgó_s'}),
 pedreguer:PP("Plaça de l'Església de Pedreguer",{fondo:'iglesia',styles:['calA','calC','calA'],terrat:.5,ref:'blanco',centro:'fuente',cad:PP_CAD.festa,camp:{h:28,w:2.1,cap:'teja'},serra:'segària'}),
 xabia:PP("Plaça de l'Església de Xàbia",{fondo:'iglesia',gotic:true,fortif:true,st:PP_ST.tosca,styles:['stone','calA','stone','calC'],zocalo:[.16,.36,.72],ref:'blanco',centro:'fuente',cad:PP_CAD.mar,serra:'montgó_n'}),
 laromana:PP("Plaça de l'Església de la Romana",{fondo:'iglesia',styles:['calA','calC','calA','stone'],terrat:.55,ref:'fusta',centro:'fuente',cad:PP_CAD.fusta,camp:{h:24,w:2,cap:'teja'},serra:'alacant'})});

// nombre del pueblo (en minúsculas, como en el selector) → plaza
Object.assign(PMX_PUEBLOS,{'almassora':'almassora','cabanes':'cabanes','torreblanca':'torreblanca','benicarló':'benicarlo','vinaròs':'vinaros','peñíscola':'peniscola','segorbe':'segorbe',
 'moncofa':'moncofa',"la vall d'uixó":'lavall','betxí':'betxi',"l'alcora":'lalcora','borriol':'borriol','alcalà de xivert':'alcala','benicàssim':'benicassim',
 'meliana':'meliana','museros':'museros','puçol':'pucol','massamagrell':'massamagrell','foios':'foios','alboraia':'alboraia','llíria':'lliria','chiva':'chiva',
 'ontinyent':'ontinyent','sueca':'sueca','el puig':'elpuig','sagunt':'sagunt','sagunto':'sagunt','dénia':'denia','pedreguer':'pedreguer','xàbia':'xabia','jávea':'xabia','la romana':'laromana'});

/* ---------- elementos singulares ---------- */
// almenas a lo largo de un tramo de muro
function ppMerlets(G,x0,z0,x1,z1,y,col){const L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.floor(L/1.1)),ax=Math.abs(x1-x0)>Math.abs(z1-z0);
 for(let i=0;i<=n;i++){if(i%2)continue;const t=i/n,x=x0+(x1-x0)*t,z=z0+(z1-z0)*t;G.granite.box(x,y+.45,z,ax?.62:.5,.9,ax?.5:.62,1.5,col)}}
// torre de planta cuadrada con muros de sillería (base y cuerpo), cornisas y ventanas
function ppTorreCuadrada(G,x,z,y0,h,w,col){for(const [p0,p1,n] of [[[x-w,z+w],[x+w,z+w],[0,1]],[[x+w,z+w],[x+w,z-w],[1,0]],[[x-w,z-w],[x-w,z+w],[-1,0]],[[x+w,z-w],[x-w,z-w],[0,-1]]])G.granite.wall(p0,p1,y0,y0+h,1.5,1.5,col,n);
 G.granite.top(x-w,z-w,x+w,z+w,y0+h,1.5,col)}
function ppVentanas(G,x,z,y0,h,w,n){for(const [nx,nz] of [[0,1],[1,0],[0,-1],[-1,0]])for(let i=1;i<=n;i++)G.iron.box(x+nx*(w+.01),y0+h*i/(n+1),z+nz*(w+.01),nz?.42:.04,1.1,nx?.42:.04,1,[.05,.05,.06])}
// campanario: caña cuadrada, cuerpos de campanas (cuadrados u octogonales) y remate
function ppCampanar(sc,G,c,st){const x=c.x,z=c.z,y0=c.y||0,H=c.h,w=c.w||2.2,cos=c.cos||2,oct=!!c.oct,col=c.col||st;
 const caña=H*(oct?.55:.68);ppTorreCuadrada(G,x,z,y0,caña,w,col);ppVentanas(G,x,z,y0,caña,w,oct?4:3);
 G.granite.box(x,y0+caña+.15,z,w*2+.4,.3,w*2+.4,1.5,[.9,.86,.78]);let y=y0+caña+.3,r=w*(oct?1.08:1);
 const cuerpoH=(H-caña-4)/cos;
 for(let k=0;k<cos;k++){const rk=r*(1-k*.14);
  if(oct){pmxCyl(G.granite,x,z,y,cuerpoH,rk,rk*.97,col,8,3);for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;G.iron.box(x+Math.sin(a)*rk*.93,y+cuerpoH*.55,z+Math.cos(a)*rk*.93,.55,cuerpoH*.5,.55,1,[.04,.04,.05])}
   for(let i=0;i<8;i++){const a=i/8*Math.PI*2;G.granite.box(x+Math.sin(a)*rk,y+cuerpoH/2,z+Math.cos(a)*rk,.32,cuerpoH,.32,1.5,[.95,.9,.8])}}
  else{ppTorreCuadrada(G,x,z,y,cuerpoH,rk,col);for(const [nx,nz] of [[0,1],[1,0],[0,-1],[-1,0]])G.iron.box(x+nx*(rk+.01),y+cuerpoH*.52,z+nz*(rk+.01),nz?rk*.75:.04,cuerpoH*.62,nx?rk*.75:.04,1,[.04,.04,.05])}
  G.granite.box(x,y+cuerpoH+.12,z,rk*2+.35,.24,rk*2+.35,1.5,[.9,.86,.78]);y+=cuerpoH+.24}
 const rt=r*(1-cos*.14);
 // remate
 if(c.cap==='cupula'||c.cap==='azulejo'){const az=c.cap==='cupula'?ppVidriada():ppAzulejo();az.wrapS=az.wrapT=THREE.RepeatWrapping;
  const mat=new THREE.MeshStandardMaterial({map:az,roughness:.22,metalness:.15});
  if(c.cap==='cupula'){const d=new THREE.Mesh(new THREE.SphereGeometry(rt*1.05,20,10,0,Math.PI*2,0,Math.PI/2),mat);d.position.set(x,y,z);d.castShadow=true;sc.add(d);
   pmxCyl(G.granite,x,z,y+rt*1.02,1.1,.4,.34,col,8,2);const lt=new THREE.Mesh(new THREE.ConeGeometry(.45,.9,8),mat);lt.position.set(x,y+rt*1.02+1.55,z);sc.add(lt);y+=rt*1.02+2}
  else{const sp=new THREE.Mesh(new THREE.CylinderGeometry(.15,rt+.05,4.6,8,1),mat);sp.position.set(x,y+2.3,z);sp.castShadow=true;sc.add(sp);y+=4.6}}
 else if(c.cap==='pinacle'){ppMerlets(G,x-rt,z+rt,x+rt,z+rt,y,col);ppMerlets(G,x-rt,z-rt,x+rt,z-rt,y,col);ppMerlets(G,x-rt,z-rt,x-rt,z+rt,y,col);ppMerlets(G,x+rt,z-rt,x+rt,z+rt,y,col);
  pmxCyl(G.granite,x,z,y,2.6,rt*.55,rt*.5,col,8,2);const sp=new THREE.Mesh(new THREE.ConeGeometry(rt*.6,2.6,8),new THREE.MeshStandardMaterial({map:PMX.T.roof.map,roughness:.8}));sp.position.set(x,y+3.9,z);sp.castShadow=true;sc.add(sp);y+=5.2}
 else{const sp=new THREE.Mesh(new THREE.ConeGeometry(rt*1.45,4.2,4),new THREE.MeshStandardMaterial({map:PMX.T.roof.map,roughness:.8}));sp.position.set(x,y+2.1,z);sp.rotation.y=Math.PI/4;sp.castShadow=true;sc.add(sp);y+=4.2}
 G.iron.box(x,y+.5,z,.07,1.3,.07,1,[.1,.1,.1]);G.iron.box(x,y+.85,z,.55,.07,.07,1,[.1,.1,.1]);
 const bell=new THREE.Mesh(new THREE.LatheGeometry([[0,.6],[.18,.58],[.28,.4],[.34,.1],[.44,0],[.4,-.02]].map(([a,b])=>new THREE.Vector2(a,b)),16),new THREE.MeshStandardMaterial({color:'#8a6a2a',metalness:.85,roughness:.35,side:THREE.DoubleSide}));
 bell.position.set(x,y0+caña+cuerpoH*.3+.3,z+w*.55);sc.add(bell)}
// torre medieval almenada
function ppTorreMed(G,t){const col=t.col||PP_ST.piedra;ppTorreCuadrada(G,t.x,t.z,0,t.h,t.w,col);ppVentanas(G,t.x,t.z,0,t.h,t.w,2);
 G.granite.box(t.x,t.h+.12,t.z,t.w*2+.5,.24,t.w*2+.5,1.5,[.9,.86,.78]);const w=t.w+.12;
 ppMerlets(G,t.x-w,t.z+w,t.x+w,t.z+w,t.h+.24,col);ppMerlets(G,t.x-w,t.z-w,t.x+w,t.z-w,t.h+.24,col);ppMerlets(G,t.x-w,t.z-w,t.x-w,t.z+w,t.h+.24,col);ppMerlets(G,t.x+w,t.z-w,t.x+w,t.z+w,t.h+.24,col)}
// torres del palacio o del monasterio a los lados del edificio del fondo
function ppPalau(sc,G,p){const col=p.col||PP_ST.ocre,w=p.w,h=p.h,xs=[-9-w*.6,9+w*.6],zs=p.quatre?[-13.2,-24]:[-13.2];
 for(const x of xs)for(const z of zs){const hh=z<-20?h+2:h;ppTorreCuadrada(G,x,z,0,hh,w,col);ppVentanas(G,x,z,0,hh,w,3);G.granite.box(x,hh+.12,z,w*2+.4,.24,w*2+.4,1.5,[.9,.86,.78]);
  if(p.top==='piramide'){const sp=new THREE.Mesh(new THREE.ConeGeometry(w*1.5,3.6,4),new THREE.MeshStandardMaterial({map:PMX.T.roof.map,roughness:.8}));sp.position.set(x,hh+2,z);sp.rotation.y=Math.PI/4;sp.castShadow=true;sc.add(sp)}
  else{const q=w+.1;ppMerlets(G,x-q,z+q,x+q,z+q,hh+.24,col);ppMerlets(G,x-q,z-q,x+q,z-q,hh+.24,col);ppMerlets(G,x-q,z-q,x-q,z+q,hh+.24,col);ppMerlets(G,x+q,z-q,x+q,z+q,hh+.24,col)}}
 if(p.quatre){// cuerpo del monasterio entre las torres traseras
  for(const [p0,p1,n] of [[[-9,-28],[9,-28],[0,-1]],[[-9,-21],[-9,-28],[-1,0]],[[9,-28],[9,-21],[1,0]]])G.granite.wall(p0,p1,0,h-2,1.5,1.5,col,n);G.granite.top(-9,-28,9,-21,h-2,1.5,col)}}
// iglesia-fortaleza: almenas y garitas sobre los muros de la nave
function ppFortif(G,st){const y=12.5;ppMerlets(G,-8.1,-11.9,8.1,-11.9,y,st);ppMerlets(G,-8.1,-28.1,-8.1,-11.9,y,st);ppMerlets(G,8.1,-28.1,8.1,-11.9,y,st);
 for(const x of [-8.1,8.1]){G.granite.box(x,y-1.2,-12.2,1.3,2.4,1.3,1.5,st);G.granite.box(x,y-2.6,-12.2,.9,.6,.9,1.5,[.9,.86,.78])}
 G.granite.box(0,y-2.2,-11.6,2.4,1.4,.9,1.5,st)}// matacán sobre la puerta
// sierras del horizonte (lejos: no tapan nada de la plaza; se ven por las calles y desde lo alto de los cadafales)
function ppSerra(sc,lista,night){const m=new THREE.MeshStandardMaterial({color:night?'#1d2433':'#6f7b70',roughness:1,flatShading:true});
 for(const [a,d,h,w] of lista){const g=new THREE.SphereGeometry(1,40,12,0,Math.PI*2,0,Math.PI/2),p=g.attributes.position,r=mulberry((a*7+d)|0);
  // cresta: picos y collados a lo largo de la sierra
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);if(y>.02){const cr=.75+.25*Math.sin(x*7.3+a)*Math.sin(x*3.1+d)+(r()-.5)*.12;p.setY(i,Math.pow(y,1.25)*cr)}}g.computeVertexNormals();
  const mm=new THREE.Mesh(g,m),ar=a*Math.PI/180;mm.scale.set(w*1.3,h*.62,w*.3);mm.position.set(Math.sin(ar)*(d+25),-1.5,Math.cos(ar)*(d+25));mm.rotation.y=ar;mm.matrixAutoUpdate=false;mm.updateMatrix();sc.add(mm)}}
// el mar al final de la calle de levante: paseo con barandilla, agua, barcas y faro
function ppMar(sc,G,night){// el suelo de la escena acaba en el paseo: a partir de ahí, agua
 for(const o of sc.children)if(o.isMesh&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.width===200&&o.geometry.parameters.height===120){o.geometry.dispose();o.geometry=new THREE.PlaneGeometry(174,120);o.position.x=-13;break}
G.paving.top(62,-4.6,74,4.6,.02,1.2,[.95,.92,.86]);
 for(let z=-8;z<=8;z+=.9)G.iron.box(73.6,.55,z,.06,1.1,.06,1,[.85,.85,.82]);G.iron.box(73.6,1.1,0,.08,.08,16.4,1,[.85,.85,.82]);
 const wm=new THREE.MeshStandardMaterial({color:night?'#0b1a2e':'#2f6f9a',roughness:.12,metalness:.35});
 const w=new THREE.Mesh(new THREE.PlaneGeometry(420,420),wm);w.rotation.x=-Math.PI/2;w.position.set(285,-.6,0);sc.add(w);
 G.granite.box(74,-.25,0,.8,.9,22,1.5,[.86,.83,.78]);
 const boat=(x,z,c,ry)=>{const b=new THREE.Group();b.position.set(x,-.45,z);b.rotation.y=ry;sc.add(b);const hm=new THREE.MeshStandardMaterial({color:'#f1ece0',roughness:.6});
  const hull=new THREE.Mesh(new THREE.BoxGeometry(2.2,.7,6),hm);b.add(hull);const st=new THREE.Mesh(new THREE.BoxGeometry(2.25,.18,6.05),new THREE.MeshStandardMaterial({color:c,roughness:.6}));st.position.y=.36;b.add(st);
  const ms=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,5,6),hm);ms.position.set(0,2.8,-.6);b.add(ms)};
 boat(92,-9,'#2b5aa0',.4);boat(118,7,'#bf3a3f',-.3);boat(150,-16,'#2b7a3d',.9);
 const far=new THREE.Group();far.position.set(170,-.6,26);sc.add(far);const fm=new THREE.MeshStandardMaterial({color:'#f2efe8',roughness:.5});
 const t=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.6,14,14),fm);t.position.y=7;far.add(t);const bnd=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,2,14),new THREE.MeshStandardMaterial({color:'#bf3a3f'}));bnd.position.y=10;far.add(bnd);
 const lp=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,1.6,10),new THREE.MeshStandardMaterial({color:'#fff7d6',emissive:'#ffd98a',emissiveIntensity:night?2.2:.2}));lp.position.y=15;far.add(lp)}
// peñón de Peñíscola: roca en el mar bajo el castillo
function ppRoca(sc,r){const g=new THREE.SphereGeometry(1,20,10,0,Math.PI*2,0,Math.PI/2),p=g.attributes.position,rr=mulberry(11);
 for(let i=0;i<p.count;i++){const k=1+(rr()-.5)*.35;p.setXYZ(i,p.getX(i)*k,p.getY(i)*(1+(rr()-.5)*.25),p.getZ(i)*k)}g.computeVertexNormals();
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:'#a8987a',roughness:1,flatShading:true}));m.scale.set(46,24,30);m.position.set(r.x,-3,r.z);sc.add(m)}
function ppTerreno(sc,night,mar){const g=new THREE.RingGeometry(0,420,48,12);g.rotateX(-Math.PI/2);
 // campo cerca y bruma de tierra en el horizonte (sin niebla azul, que lo haría parecer mar)
 const p=g.attributes.position,col=[],a=new THREE.Color(night?'#161c17':'#8c8660'),b=new THREE.Color(night?'#1b2232':'#b9bfa8'),c=new THREE.Color();
 for(let i=0;i<p.count;i++){const r=Math.hypot(p.getX(i),p.getZ(i));c.copy(a).lerp(b,Math.min(1,Math.max(0,(r-70)/260)));col.push(c.r,c.g,c.b)}g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,fog:false}));m.position.y=mar?-1:-.06;m.receiveShadow=false;sc.add(m)}
function pmxHitos(sc,G,PT,LAN){const night=!!(CL&&CL.night),st=PT.st||PP_ST.piedra;try{ppCampo(sc,PT,night);ppSuelo(sc,PT,night)}catch(e){console.warn('campo',e)}if(CL)CL.ppIntro=0;
 // campanario propio: exento en el hueco junto a la iglesia, o en la esquina de la nave en lugar del genérico
 if(PT.camp){const c=Object.assign({},PT.camp);if(c.exent){c.x=c.side*10.6;c.z=-14.4}else if(c.x===undefined){c.x=5.4;c.z=-14.4;c.w=Math.min(c.w||2.1,2.1)}ppCampanar(sc,G,c,st)}
 if(PT.campLejos)ppCampanar(sc,G,PT.campLejos,st);
 if(PT.torreMed)for(const t of PT.torreMed)ppTorreMed(G,t);
 if(PT.palau)ppPalau(sc,G,PT.palau);
 if(PT.fortif&&PT.fondo==='iglesia')ppFortif(G,st);
 if(PT.roca)ppRoca(sc,PT.roca);
 if(PT.mar&&!(CL&&CL.o&&CL.o.tipo==='mar'))ppMar(sc,G,night);
 if(PT.serra&&PP_SERRA[PT.serra])ppSerra(sc,PP_SERRA[PT.serra],night)}

/* ---------- la plaza de cada pueblo fuera del 3D: fichas de festejos, selector y calendario ---------- */
const PP_DESC={vilareal:'Plaça Major porticada y ayuntamiento',nules:'Iglesia de cúpula azul y palmeras',borriana:"Iglesia gótica de El Salvador",onda:'Bajo el castillo de las 300 torres',
 almassora:"Recinto de La Vila, cuna de los toros cerriles",cabanes:'Iglesia de piedra al pie de la sierra',torreblanca:'Iglesia blanca y la torre del pueblo',
 benicarlo:'Campanario octogonal exento junto a Sant Bartomeu',vinaros:'Arxiprestal fortificada y campanario exento, junto al mar',peniscola:'Castillo del Papa Luna sobre el peñón',
 segorbe:'Torres medievales y campanario de la catedral',moncofa:'Cúpula azul, casas encaladas y el mar',lavall:"Ayuntamiento bajo la Serra d'Espadà",betxi:'Palau-Castell renacentista',
 lalcora:'Iglesia con chapitel de azulejo, tierra de cerámica',borriol:'Castillo en ruinas sobre el pueblo',alcala:'El campanario más alto de la provincia',
 benicassim:"Iglesia blanca, palmeras y el Desert de les Palmes",meliana:"Ayuntamiento de l'Horta Nord",museros:'Iglesia con campanario de azulejo',pucol:'El Palau dels Arquebisbes',
 massamagrell:'Iglesia de cúpula azul',foios:'La torre medieval de Foios',alboraia:"Iglesia de l'Horta y su campanario",lliria:"Ayuntamiento y la Assumpció en lo alto",
 chiva:'Castillo en ruinas sobre la villa',ontinyent:'El campanario más alto de la Comunitat',sueca:'Ayuntamiento y campanario de Sant Pere',elpuig:'Monasterio de las cuatro torres',
 sagunt:'Santa Maria gótica y el castillo sobre el cerro',denia:'Castillo, Montgó y puerto',pedreguer:'Iglesia bajo la Serra de Segària',xabia:'Iglesia-fortaleza de piedra tosca bajo el Montgó',
 laromana:'Iglesia y casas blancas del Vinalopó'};
// plaza de un pueblo (sin festejo cargado): clave, nombre, descripción e imagen
function ppPlaza(pueblo){const pu=String(pueblo||'').toLowerCase().trim();let k=PMX_PUEBLOS[pu],gen=false;if(!k){k=PMX_TIPO_PUEBLO[pu];gen=true}if(!k||!PMX_PLAZAS[k])return null;
 const T_=PMX_PLAZAS[k];return {k,nom:gen?pmxNomPueblo(T_.nom,pueblo):T_.nom,desc:gen?'':(PP_DESC[k]||''),img:gen?null:'img/plazas/'+k+'.jpg'}}

/* ---------- identidad visible durante el festejo ----------
   Fachadas, tejados y terrados según cómo se construye en cada zona, y a qué mira la cámara de presentación
   (lo que hace reconocible la plaza: iglesia, campanario, castillo, palacio…). */
const PP_PAL={
 blanc:['#f7f4ec','#f4efe4','#eef2f3','#f6f3ea','#f1ece0','#e9eef0'],
 mar:['#f7f4ec','#f1ece0','#e8eef2','#f3e6c4','#dfe9ef','#f6f3ea','#f2dcc0'],
 pedra:['#cdb38e','#c2a77f','#d9c09a','#bda47e','#d3c3a5','#b89c74'],
 ocre:['#e3b778','#e8c78f','#d9a86a','#efd6a6','#e2bd8a','#f0dfbd'],
 horta:['#f2d7b8','#e9c6a0','#f4e2c4','#e6cfe0','#f0d1c2','#e7dcb8','#d9e3d0'],
 tosca:['#d8b98a','#e2c79c','#cfae7e','#f1e8d6','#e9dcc0']};
const PP_TEJA={costa:[1.06,1.02,.97],interior:[.82,.76,.72],horta:[1,.9,.82]};
const PP_ID={
 vilareal:['ocre','horta'],nules:['blanc','costa'],borriana:['ocre','horta'],onda:['pedra','interior',[-5,14,-70]],
 almassora:['ocre','horta'],cabanes:['pedra','interior'],torreblanca:['blanc','costa'],benicarlo:['blanc','costa'],vinaros:['mar','costa'],
 peniscola:['blanc','costa',[34,9,-24]],segorbe:['pedra','interior'],moncofa:['blanc','costa'],lavall:['ocre','interior',[-30,14,-70]],betxi:['pedra','interior'],
 lalcora:['ocre','interior'],borriol:['pedra','interior',[-18,12,-70]],alcala:['pedra','interior',[10,22,-16]],benicassim:['mar','costa'],
 meliana:['horta','horta'],museros:['horta','horta'],pucol:['horta','horta'],massamagrell:['horta','horta'],foios:['horta','horta'],alboraia:['horta','horta'],
 lliria:['ocre','interior'],chiva:['pedra','interior',[16,12,-70]],ontinyent:['ocre','interior',[-18,22,-34]],sueca:['horta','horta'],elpuig:['ocre','horta'],
 sagunt:['ocre','interior',[-10,16,-80]],denia:['mar','costa',[-28,12,-55]],pedreguer:['blanc','costa'],xabia:['tosca','costa'],laromana:['blanc','interior']};
// terrados (cubierta plana) en la costa: desde arriba se distingue enseguida un pueblo del litoral
const PP_TERRAT={costa:.6,horta:.25,interior:.1};
for(const [k,[pal,zona,foco]] of Object.entries(PP_ID)){const T_=PMX_PLAZAS[k];if(!T_)continue;T_.pal=PP_PAL[pal];T_.teja=PP_TEJA[zona];if(T_.terrat===undefined)T_.terrat=PP_TERRAT[zona];if(foco)T_.foco=foco;T_.zona=zona}
// el suelo empedrado solo dentro del pueblo; alrededor, campo (secano, huerta o monte según la zona)
function ppSuelo(sc,PT,night){for(const o of sc.children)if(o.isMesh&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.height===120&&(o.geometry.parameters.width===200||o.geometry.parameters.width===174)){
  const x1=PT.mar?74:76,x0=-76,z0=-38,z1=56,mp=o.material.map;o.geometry.dispose();o.geometry=new THREE.PlaneGeometry(x1-x0,z1-z0);o.position.set((x0+x1)/2,0,(z0+z1)/2);
  if(mp){mp.repeat.set((x1-x0)/4,(z1-z0)/4);if(o.material.normalMap)o.material.normalMap.repeat.copy(mp.repeat);if(o.material.roughnessMap)o.material.roughnessMap.repeat.copy(mp.repeat)}break}}
function ppCampo(sc,PT,night){const zona=PT.zona||'horta',g=new THREE.PlaneGeometry(840,840,84,84);g.rotateX(-Math.PI/2);const p=g.attributes.position,col=[],c=new THREE.Color(),N=pmxNoise(77);
 const base={costa:['#a59a6a','#8e8a58','#b3a676'],interior:['#8a7d58','#7b7a4e','#9a8a62'],horta:['#6f8a4a','#86964f','#a0965e']}[zona],cs=base.map(x=>new THREE.Color(x)),haze=new THREE.Color(night?'#1b2232':'#b9bfa8');
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),r=Math.hypot(x,z);
  // parcelas: bancales de huerta o campos de secano y olivos
  const pa=Math.floor(x/(zona==='horta'?14:22))*7+Math.floor(z/(zona==='horta'?9:18))*13,k=Math.abs(Math.sin(pa*12.9898)*43758.5453)%1,n=N.fbm(x/90+.3,z/90+.7,3,3);
  c.copy(cs[(k*3)|0]).multiplyScalar(.82+n*.35);if(night)c.multiplyScalar(.18);c.lerp(haze,Math.min(1,Math.max(0,(r-80)/300)));col.push(c.r,c.g,c.b)}
 g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,fog:false}));m.position.y=PT.mar?-1:-.08;sc.add(m)}
// plano de presentación al empezar el festejo: la plaza y lo que la distingue, desde lo alto
if(typeof camCalle==='function'){const _ccPP=camCalle;camCalle=function(dt){
 if(CL&&CL.ppIntro!=null&&!CL.plaza&&CL.cam==='tv'&&PMX.PT){const now=performance.now();if(!CL.ppIntro)CL.ppIntro=now;const s=(now-CL.ppIntro)/1000;if(s>=5.5){CL.ppIntro=null;return _ccPP(dt)}const u=s/5.5,e=u*u*(3-2*u),f=PMX.PT.foco||[0,10,-20];
  W3.cam.position.set(9-15*e,19-7*e,30-16*e);W3.cam.lookAt(f[0],f[1]-2*e,f[2]);return}
 return _ccPP(dt)}}

/* ---------- el segundo edificio de la plaza, en su lado real ----------
   En muchas plazas la iglesia y el ayuntamiento están frente a frente (Vinaròs, Xàbia, Nules, Borriana, Dénia) o el
   ayuntamiento preside y la iglesia queda enfrente (Sueca). Se construyen con los mismos edificios del fondo,
   girados media vuelta, en el tramo derecho del lado del cajón. */
function ppEspejo(G,sc,LAN,fn){const G2={};for(const k in G)G2[k]=new PmxGeo();const n0=sc.children.length,l0=LAN.length,c0=CL.crowd.length;fn(G2);
 for(const k in G2){const a=G2[k],b=G[k];if(!a.n)continue;const base=b.n;
  for(let i=0;i<a.pos.length;i+=3){b.pos.push(-a.pos[i],a.pos[i+1],-a.pos[i+2]);b.nor.push(-a.nor[i],a.nor[i+1],-a.nor[i+2])}
  for(const v of a.col)b.col.push(v);for(const v of a.uv)b.uv.push(v);for(const j of a.idx)b.idx.push(j+base);b.n+=a.n}
 const g=new THREE.Group();g.rotation.y=Math.PI;for(const o of sc.children.slice(n0)){sc.remove(o);g.add(o)}sc.add(g);
 for(let i=l0;i<LAN.length;i++){LAN[i][0]*=-1;LAN[i][2]*=-1}
 for(let i=c0;i<CL.crowd.length;i++){const c=CL.crowd[i];c[0]*=-1;c[2]*=-1;c[3]=(c[3]||0)+Math.PI}}
function ppNorte(G,sc,PT,LAN){const tipo=PT.norte;
 if(tipo==='ajuntament')ppEspejo(G,sc,LAN,G2=>pmxAjuntament(G2,sc,-21,-3.5,-11,PT,LAN));
 else if(tipo==='iglesia')ppEspejo(G,sc,LAN,G2=>pmxIglesia(G2,sc,-21,-5,-11,Object.assign({},PT,{sinTorre:false,camp:null,gotic:false,dosPortes:false,cupula:true,azulejo:true}),LAN))}
for(const [k,n] of Object.entries({vinaros:'ajuntament',xabia:'ajuntament',nules:'ajuntament',borriana:'ajuntament',denia:'ajuntament',sueca:'iglesia'}))if(PMX_PLAZAS[k])PMX_PLAZAS[k].norte=n;
// Peníscola: la plaza de Santa Maria está al pie del castillo, en lo alto del peñón
if(PMX_PLAZAS.peniscola){Object.assign(PMX_PLAZAS.peniscola,{castell:{x:2,z:-64,s:.42,ry:0,col:'#d6c4a0',hill:'#a8987a',n:20},roca:{x:0,z:-62},foco:[2,18,-60]})}
