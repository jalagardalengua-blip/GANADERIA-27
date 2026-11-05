/* ===================== FASE 4 · RECINTOS DE GANADERÍA DE VERDAD =====================
   Inspirado en la distribución típica de una ganadería brava de dehesa (Salamanca, Andalucía, Extremadura):
   - paredes de piedra seca con piedras de remate irregulares (en lugar de bloques lisos);
   - charcas de agua en los cercados de toros y vacas;
   - manga de manejo de madera con mueco (cajón de curas) junto a los corrales y el embarcadero;
   - abrevaderos de obra junto a las charcas;
   - inspección de cada instalación: nivel, función, mantenimiento y mejora. */
let PIEDRA_TX=null;
function piedraTex(){if(PIEDRA_TX)return PIEDRA_TX;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),r=mulberry(77);
 x.fillStyle='#4a4238';x.fillRect(0,0,256,256);
 for(let row=0,y=0;y<256;row++){const h=18+r()*14;let px=-r()*30;while(px<256){const w=22+r()*34,g=118+r()*50|0,t=r()*.25;x.fillStyle=`rgb(${g+18*t|0},${g-4|0},${g-22|0})`;
   x.beginPath();const j=()=>r()*4-2;x.moveTo(px+3+j(),y+2+j());x.lineTo(px+w-3+j(),y+2+j());x.lineTo(px+w-2+j(),y+h-2+j());x.lineTo(px+2+j(),y+h-3+j());x.closePath();x.fill();
   x.fillStyle='rgba(255,255,255,.06)';x.fillRect(px+4,y+3,w-10,3);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(px+4,y+h-6,w-8,3);
   for(let k=0;k<6;k++){x.fillStyle=`rgba(${r()<.5?'60,80,40':'200,190,170'},${r()*.25})`;x.fillRect(px+r()*w,y+r()*h,2,2)}px+=w}y+=h}
 PIEDRA_TX=new THREE.CanvasTexture(c);PIEDRA_TX.wrapS=PIEDRA_TX.wrapT=THREE.RepeatWrapping;PIEDRA_TX.anisotropy=4;return PIEDRA_TX}
function muroGeo(L,H,W){const g=new THREE.BoxGeometry(W,H,L),uv=g.attributes.uv,T=2.4;const dims=[[L,H],[L,H],[W,L],[W,L],[W,H],[W,H]];for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*dims[f][0]/T,uv.getY(i)*dims[f][1]/T)}return g}
const INSTAL={placita:{x:-30,z:13,n:'Placita de tientas',f:'Aquí se tientan las vacas y los machos con picador y muleta.'},corrales:{x:20.5,z:-24,n:'Corrales y embarcadero',f:'Apartar, encerrar y embarcar los toros reseñados para las plazas.'},
 comederos:{x:44,z:4,n:'Comederos',f:'Pienso y forraje para la camada; mejores comederos, menos gasto.'},abrev:{x:90,z:44,n:'Abrevaderos y charcas',f:'Agua limpia todo el año: más salud, sobre todo en verano.'},cercas:{x:38,z:-6,n:'Cercados',f:'Paredes de piedra y malla que separan toros, vacas y sementales.'},casa:{x:-3,z:7,n:'Cortijo',f:'Casa, oficina de la ganadería y visitas de aficionados.'}};
function inspeccionar(k){const d=MEJ[k],I=INSTAL[k],lv=mejLv(k);const desc=d&&d.d?d.d:[];
 modal(I.n,`<div class="stack"><p style="margin:0">${esc(I.f)}</p><div class="kv"><span>Nivel <b>${lv}${d?' / '+d.max:''}</b></span><span>Mantenimiento <b>${eur(lv*180)}/mes</b></span>${k==='cercas'?`<span>Estado <b>${S.roto?'cerca rota':'en buen estado'}</b></span>`:''}${k==='placita'?`<span>Hembras por tentar <b>${campo().filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2).length}</b></span>`:''}${k==='corrales'?`<span>Capacidad de la finca <b>${campo().length}/${capacidad()}</b></span>`:''}</div>
 ${lv&&desc[lv-1]?`<small class="muted">Ahora: ${esc(desc[lv-1])}</small>`:''}${d&&lv<d.max?`<div class="card"><b>Siguiente nivel · ${eur(d.c[lv])}</b><br><small>${esc(desc[lv]||'')}</small></div><button class="btn oro adv" onclick="closeModal(true);construir('${k}')">Mejorar${ICO.chev}</button>`:'<small class="muted">Nivel máximo.</small>'}</div>`)}
const _rebuildF3=rebuildFinca;
rebuildFinca=function(){_rebuildF3.apply(this,arguments);if(W3.mode!=='finca'||!W3.scene||!S)return;const sc=W3.scene,G=geos(),col=W3.col,acts=W3.acts;
 try{
  // 1. paredes de piedra seca: cada tramo con su propia geometría para que la piedra no se estire, y piedras de remate
  const mPied=M('#a69c88',.98);const piedra=new THREE.MeshStandardMaterial({map:piedraTex(),color:'#d8cfc0',roughness:1});const rem=[];
  const muros=[];sc.children.forEach(o=>{if(o.isMesh&&o.material===mPied&&o.geometry===G.box)muros.push(o)});
  for(const o of muros){const W=o.scale.x,H=o.scale.y,L=o.scale.z;o.geometry=muroGeo(L,H,W);o.scale.set(1,1,1);o.material=piedra;o.castShadow=true;o.receiveShadow=true;
   const n=Math.floor(L/.7),dir=new THREE.Vector3(Math.sin(o.rotation.y),0,Math.cos(o.rotation.y));for(let i=0;i<n;i++){const t=(i+.5)/n-.5;rem.push([o.position.x+dir.x*t*L,o.position.y+H/2+.06,o.position.z+dir.z*t*L,o.rotation.y+(Math.random()-.5)*.6])}}
  if(rem.length){const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.32,0),new THREE.MeshStandardMaterial({color:'#9a907e',roughness:1,flatShading:true}),rem.length);const ob=new THREE.Object3D();
   rem.forEach(([x,y,z,r],i)=>{ob.position.set(x,y,z);ob.rotation.set(Math.random(),r,Math.random());const s=.7+Math.random()*.5;ob.scale.set(s*1.1,s*.55,s);ob.updateMatrix();im.setMatrixAt(i,ob.matrix)});im.castShadow=true;sc.add(im)}
  // 2. charcas con orilla de barro y abrevadero de obra
  const agua=new THREE.MeshStandardMaterial({color:'#3c5a5e',roughness:.08,metalness:.35,transparent:true,opacity:.92});const barro=M('#6e5a3e',1);
  for(const [x,z,r] of [[92,50,6.5],[-98,36,5.5]]){const y=gH(x,z);const orilla=new THREE.Mesh(new THREE.CircleGeometry(r+1.6,40),barro);orilla.rotation.x=-Math.PI/2;orilla.position.set(x,y+.03,z);orilla.receiveShadow=true;sc.add(orilla);
   const ag=new THREE.Mesh(new THREE.CircleGeometry(r,40),agua);ag.rotation.x=-Math.PI/2;ag.position.set(x,y+.06,z);sc.add(ag);col.push({t:'circ',x,z,r:r+.3});
   for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.random()*.4,j=mesh(G.cyl,M('#7f8a4a',.9),.04,.9,.04,x+Math.cos(a)*(r+.3),y+.45,z+Math.sin(a)*(r+.3),sc,true);j.rotation.z=(Math.random()-.5)*.4}
   const ab=new THREE.Group();ab.position.set(x-r-4,y,z);sc.add(ab);mesh(G.box,M('#bdb6a8',.9),1.1,.7,4,0,.35,0,ab);mesh(G.box,agua,.8,.05,3.7,0,.66,0,ab,true);col.push({t:'box',x0:x-r-4.6,x1:x-r-3.4,z0:z-2,z1:z+2})}
  // 3. manga de manejo y mueco al norte del embarcadero
  const mad=M('#6b5640',.9),mg=new THREE.Group();mg.position.set(28,gH(28,-36),-36);sc.add(mg);
  for(const sx of [-.6,.6]){for(let z=-6;z<=6;z+=1.5)mesh(G.cyl,mad,.07,1.8,.07,sx,.9,z,mg,true);for(const h of [.45,.95,1.45])mesh(G.box,mad,.06,.12,12.2,sx,h,0,mg,true)}
  const mu=new THREE.Group();mu.position.set(0,0,-7.2);mg.add(mu);const hie=M('#4b5258',.45,.6);for(const [a,b] of [[-.75,-.9],[.75,-.9],[-.75,.9],[.75,.9]])mesh(G.box,hie,.1,2,.1,a,1,b,mu,true);for(const h of [.5,1.1,1.7])for(const sx of [-.75,.75])mesh(G.box,hie,.05,.05,1.8,sx,h,0,mu,true);mesh(G.box,hie,1.6,.08,1.9,0,2,0,mu,true);
  col.push({t:'box',x0:27,x1:29,z0:-45,z1:-30});
  acts.push({x:30.4,z:-43,r:2.4,l:'Mueco: revisar a los lesionados',cond:()=>!W3.ride,fn:()=>{const l=campo().filter(a=>a.lesion>0||a.salud<60);if(!l.length){toast('No hay reses que necesiten pasar por el mueco');return}const c=l.length*90;if(S.money<c){toast('No te llega para el veterinario');return}S.money-=c;l.forEach(a=>{a.salud=clamp(a.salud+12,5,100);a.lesion=Math.max(0,(a.lesion||0)-1)});save();toast(`${l.length} reses curadas en el mueco · −${eur(c)}`)}});
  // 4. inspección de instalaciones
  for(const [k,I] of Object.entries(INSTAL)){if(!MEJ[k]&&k!=='casa')continue;acts.push({x:I.x,z:I.z,r:2.2,l:`Inspeccionar: ${I.n.toLowerCase()}`,cond:()=>!W3.ride&&!W3.F.carry,fn:()=>inspeccionar(k)})}
 }catch(e){try{errLog('finca3: '+e.message,'finca3')}catch(e2){}}};
