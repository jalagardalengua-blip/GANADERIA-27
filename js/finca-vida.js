/* ===================== VIDA EN LA FINCA =====================
   La dehesa deja de estar vacía:
   - Vaquero a caballo: siempre hay uno de la casa rondando el ganado; los vaqueros contratados también van montados.
   - El personal contratado hace su trabajo de verdad: el veterinario va de la clínica al mueco y a los corrales,
     el guarda recorre las cercas, el conocedor se queda mirando la camada, el representante va y viene del cortijo.
     A todos se les puede hablar y cuentan algo útil.
   - Dos mastines: uno te sigue cuando andas y otro sestea a la puerta del cortijo (se le puede acariciar).
   - Garcillas bueyeras entre las reses (levantan el vuelo si te acercas), cigüeñas en su nido sobre un poste
     y otra planeando, y bandadas de estorninos que cruzan el cielo.
   Todo es ligero: las aves son una sola llamada de dibujo por especie. */
const FV={on:false};
const fvR=(a,b)=>a+Math.random()*(b-a);
/* une varias piezas (geometría + matriz + color) en una sola geometría con colores por vértice */
function fvUnir(partes){let n=0;const gs=partes.map(([g,m,c])=>{const q=(g.index?g.toNonIndexed():g.clone());q.applyMatrix4(m);n+=q.attributes.position.count;return [q,new THREE.Color(c)]});
 const P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Float32Array(n*3);let o=0;
 for(const [q,c] of gs){const p=q.attributes.position.array,nn=q.attributes.normal.array;P.set(p,o*3);N.set(nn,o*3);for(let i=0;i<q.attributes.position.count;i++){C[(o+i)*3]=c.r;C[(o+i)*3+1]=c.g;C[(o+i)*3+2]=c.b}o+=q.attributes.position.count;q.dispose()}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));return g}
const fvM=(x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)),new THREE.Vector3(sx,sy,sz));

/* ---------- aves ---------- */
function fvGeoGarcilla(){const S=new THREE.SphereGeometry(1,10,8),C=new THREE.ConeGeometry(1,1,6),Y=new THREE.CylinderGeometry(1,1,1,5);
 return fvUnir([[S,fvM(0,.2,0,.09,.075,.16,-.15),'#f4f1ea'],[S,fvM(0,.31,.11,.045,.045,.055),'#f6f2ea'],[Y,fvM(0,.27,.07,.03,.09,.03,.5),'#f4f1ea'],
  [C,fvM(0,.31,.19,.014,.07,.014,Math.PI/2),'#e8b13a'],[S,fvM(0,.29,.08,.05,.03,.05),'#f0d9a0'],
  [Y,fvM(.03,.07,0,.008,.14,.008),'#3b3226'],[Y,fvM(-.03,.07,0,.008,.14,.008),'#3b3226']])}
function fvGeoCiguena(){const S=new THREE.SphereGeometry(1,12,8),C=new THREE.ConeGeometry(1,1,6),Y=new THREE.CylinderGeometry(1,1,1,5),B=new THREE.BoxGeometry(1,1,1);
 return fvUnir([[S,fvM(0,.62,0,.17,.15,.34,-.1),'#f3f1ec'],[B,fvM(.13,.64,-.06,.04,.12,.42,0,0,-.2),'#151515'],[B,fvM(-.13,.64,-.06,.04,.12,.42,0,0,.2),'#151515'],
  [Y,fvM(0,.82,.26,.04,.3,.04,.6),'#f3f1ec'],[S,fvM(0,.95,.36,.06,.06,.08),'#f3f1ec'],[C,fvM(0,.94,.53,.025,.24,.025,Math.PI/2),'#d2412c'],
  [Y,fvM(.05,.24,0,.016,.5,.016),'#d2412c'],[Y,fvM(-.05,.24,0,.016,.5,.016),'#d2412c'],[C,fvM(0,.58,-.38,.12,.2,.05,-Math.PI/2),'#151515']])}
function fvGeoVolando(){const B=new THREE.BoxGeometry(1,1,1),S=new THREE.SphereGeometry(1,8,6);
 return fvUnir([[S,fvM(0,0,0,.1,.08,.22),'#f3f1ec'],[B,fvM(.42,0,0,.75,.02,.24),'#f3f1ec'],[B,fvM(-.42,0,0,.75,.02,.24),'#f3f1ec'],[B,fvM(.72,0,-.03,.3,.025,.25),'#141414'],[B,fvM(-.72,0,-.03,.3,.025,.25),'#141414'],
  [B,fvM(0,0,.34,.03,.03,.3),'#f3f1ec'],[B,fvM(0,0,.55,.02,.02,.16),'#d2412c'],[B,fvM(0,0,-.32,.03,.03,.3),'#d2412c']])}
function fvGeoEstornino(){const B=new THREE.BoxGeometry(1,1,1);return fvUnir([[B,fvM(0,0,0,.05,.04,.16),'#1c1a1f'],[B,fvM(.13,0,0,.22,.01,.08,0,0,.25),'#1c1a1f'],[B,fvM(-.13,0,0,.22,.01,.08,0,0,-.25),'#1c1a1f']])}
const FV_MAT=()=>FV.mat||(FV.mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85}));
function fvInst(geo,n,sc){const m=new THREE.InstancedMesh(geo,FV_MAT(),n);m.frustumCulled=false;m.castShadow=true;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);sc.add(m);return m}

/* ---------- mastín (hecho con piezas suaves, patas y rabo animados) ---------- */
function fvPerro(col){const g=new THREE.Group(),b=new THREE.Group();g.add(b);const m=new THREE.MeshStandardMaterial({color:col,roughness:.95}),dk=new THREE.MeshStandardMaterial({color:'#2a211a',roughness:.8});
 const S=new THREE.SphereGeometry(1,14,10),Y=new THREE.CylinderGeometry(1,.8,1,8);const add=(geo,mat,x,y,z,sx,sy,sz,p=b)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;p.add(o);return o};
 add(S,m,0,.58,0,.2,.2,.42);add(S,m,0,.62,.26,.22,.23,.22);add(S,m,0,.58,-.26,.19,.19,.2);
 const cab=new THREE.Group();cab.position.set(0,.78,.44);b.add(cab);add(S,m,0,0,0,.14,.14,.15,cab);add(S,m,0,-.05,.14,.08,.07,.11,cab);add(S,dk,0,-.03,.24,.03,.025,.025,cab);
 const ore=[1,-1].map(s=>{const o=add(S,dk,s*.12,.02,-.02,.05,.09,.03,cab);o.rotation.z=s*.4;return o});add(S,dk,.06,.04,.12,.015,.015,.012,cab);add(S,dk,-.06,.04,.12,.015,.015,.012,cab);
 const patas=[[.11,.3],[-.11,.3],[.11,-.3],[-.11,-.3]].map(([x,z])=>{const h=new THREE.Group();h.position.set(x,.5,z);b.add(h);const l=add(Y,m,0,-.25,0,.055,.5,.055,h);add(S,dk,0,-.5,.02,.06,.035,.08,h);return h});
 const rabo=new THREE.Group();rabo.position.set(0,.66,-.44);b.add(rabo);add(Y,m,0,.16,-.06,.03,.36,.03,rabo).rotation.x=-.5;
 return {root:g,b,cab,patas,rabo,ore,ph:Math.random()*6,sit:0}}
function fvAnimPerro(P,dt,sp,sentado){P.ph+=dt*(sp>.05?6+sp*3:2);const a=Math.min(1,sp)*.6;P.patas.forEach((h,i)=>{h.rotation.x=Math.sin(P.ph+(i===0||i===3?0:Math.PI))*a});
 P.sit+=((sentado?1:0)-P.sit)*Math.min(1,dt*3);P.b.rotation.x=-P.sit*.35;P.b.position.y=-P.sit*.12;P.patas[2].rotation.x+=-P.sit*1.2;P.patas[3].rotation.x+=-P.sit*1.2;
 P.rabo.rotation.z=Math.sin(P.ph*(sentado?1.6:1.2))*(.5+(P.feliz||0));P.cab.rotation.x=Math.sin(P.ph*.5)*.06;if(P.feliz)P.feliz=Math.max(0,P.feliz-dt*.5)}

/* ---------- el poste con el nido de cigüeñas ---------- */
function fvNido(sc,x,z){const y0=gH(x,z),g=new THREE.Group();g.position.set(x,y0,z);sc.add(g);const pal=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,8.5,8),M('#5d4630',.95));pal.position.y=4.25;pal.castShadow=true;g.add(pal);
 const nid=new THREE.Mesh(new THREE.CylinderGeometry(.9,.6,.45,12),M('#6e5638',1));nid.position.y=8.7;nid.castShadow=true;g.add(nid);const tw=new THREE.Mesh(new THREE.TorusGeometry(.8,.16,5,14),M('#58442d',1));tw.rotation.x=Math.PI/2;tw.position.y=8.9;g.add(tw);
 W3.col&&W3.col.push({t:'circ',x,z,r:.4});return y0+8.85}

/* ---------- montar la vida al construir la finca ---------- */
function fvMontar(){const sc=W3.scene;if(!sc||W3.mode!=='finca')return;FV.on=true;FV.t=0;FV.vaq=[];FV.per=[];FV.gente=[];
 const herd=W3.herd||[];const cen=()=>{let x=0,z=0,n=0;for(const h of herd){if(h.free)continue;x+=h.x;z+=h.z;n++}return n?{x:x/n,z:z/n}:{x:20,z:0}};FV.cen=cen;
 // vaqueros a caballo: el de la casa y los contratados
 const nV=1+stf('vaquero');for(let i=0;i<nV;i++){const H=makeHorse2({col:['#5b3f2d','#2d2119','#8a6a4a','#d9d2c4'][i%4]});const r=makePerson({gl:1,jacket:['#6b4a2a','#4a3a2a','#5a5040','#3e4a38'][i%4],pants:'#3a3027',shirt:'#ece6da',hat:'campero',hatc:'#2a1d14'});
  seat(r);r.root.position.set(0,.98,-.05);(H.body||H.root).add(r.root);if(r.gl){r.gl.want='Idle_Loop'}const c=cen();const a=i*2.1;H.root.position.set(c.x+Math.cos(a)*22,0,c.z+Math.sin(a)*22);sc.add(H.root);
  FV.vaq.push({H,r,a,R:fvR(16,26),dir:i%2?1:-1,sp:0,t:fvR(2,6),para:false,yaw:0,x:H.root.position.x,z:H.root.position.z,i})}
 // el personal contratado deja de pasear al azar y hace su trabajo
 const rutas={veter:[[-8,25],[30,-41],[27,-15],[-8,25]],guarda:[[40,-10],[60,20],[40,50],[0,60],[-40,40],[-50,0],[-30,-35],[10,-45],[40,-10]],representante:[[2,10],[-3,8],[9,4],[2,10]]};
 for(const w of W3.workers||[]){if(!w.role||w.role==='vaquero'){if(w.role==='vaquero'){w.p.root.visible=false;w.ia=true}continue}w.ia=true;w.ruta=rutas[w.role]||null;w.k=0;w.espera=fvR(1,4);FV.gente.push(w)}
 // mastines
 const p0=W3.F?W3.F.p:{x:0,z:12};const d1=fvPerro('#b88f58');d1.root.position.set(p0.x+2,0,p0.z+2);sc.add(d1.root);FV.per.push({P:d1,x:p0.x+2,z:p0.z+2,yaw:0,modo:'sigue'});
 const d2=fvPerro('#3a3029');d2.root.position.set(3.2,0,12.5);sc.add(d2.root);FV.per.push({P:d2,x:3.2,z:12.5,yaw:2.6,modo:'puerta',hx:3.2,hz:12.5});
 // garcillas entre las reses
 const nG=12;FV.gar={m:fvInst(fvGeoGarcilla(),nG,sc),b:[]};for(let i=0;i<nG;i++){const h=herd.length?herd[(i*7)%herd.length]:null;const x=(h?h.x:20)+fvR(-3,3),z=(h?h.z:0)+fvR(-3,3);FV.gar.b.push({h,x,z,y:gH(x,z),yaw:fvR(0,6),t:fvR(0,3),vuela:0,ox:fvR(-2.5,2.5),oz:fvR(-2.5,2.5),pk:0})}
 // cigüeñas: nido en un poste junto al cortijo y otra planeando
 const ny=fvNido(sc,-9,-6);FV.cig={m:fvInst(fvGeoCiguena(),2,sc),y:ny,x:-9,z:-6,t:0};FV.plan={m:fvInst(fvGeoVolando(),2,sc),a:[0,3]};
 // bandada de estorninos
 const nE=34;FV.band={m:fvInst(fvGeoEstornino(),nE,sc),o:[...Array(nE)].map(()=>[fvR(-6,6),fvR(-1.5,1.5),fvR(-6,6),fvR(0,6)]),t:fvR(5,15),on:false,x:0,z:0,dx:1,dz:0};
 // conversaciones
 fvActs()}
const FV_DICHO={
 vaquero:()=>{const n=(W3.herd||[]).length;return `El vaquero: «Las ${n} reses de este lado están tranquilas, patrón. ${S.feed==='pasto'?'Con este pasto aguantan bien.':'Están comiendo bien el pienso.'}»`},
 veter:()=>{const c=campo();const les=c.filter(a=>a.lesion).length;const sal=c.length?Math.round(c.reduce((s,a)=>s+(a.salud??100),0)/c.length):100;return `El veterinario: «Salud media de la ganadería: ${sal} %. ${les?`Tengo ${les} ${les>1?'reses lesionadas':'res lesionada'} en el mueco.`:'Ninguna lesión ahora mismo.'}»`},
 guarda:()=>S.escapado?'El guarda: «Hay una res fuera de las cercas, hay que recogerla.»':'El guarda: «Sin novedad en las cercas. Todo cerrado.»',
 conocedor:()=>{const c=campo().filter(a=>a.sex==='M'&&ageY(a)>=3).sort((a,b)=>((est(b)||{}).bra||0)-((est(a)||{}).bra||0));return c.length?`El conocedor: «Fíjese en ${c[0].name} (${c[0].num??''}): ese tiene la casta de la casa.»`:'El conocedor: «Aún no hay machos hechos. Paciencia.»'},
 representante:()=>{const n=S.offers.filter(o=>o.st==='nueva').length;return n?`El representante: «Tenemos ${n} ${n>1?'ofertas':'oferta'} sobre la mesa. Yo las cerraría pronto.»`:'El representante: «Estoy moviendo la ganadería con las empresas. Pronto habrá noticias.»'},
 mayoral:()=>'El mayoral de campo: «El calendario va al día: crotales, destete y saneamiento.»',
 perro:()=>['El mastín menea el rabo y se tumba panza arriba.','El mastín te acompaña orgulloso.','El mastín levanta las orejas: ha oído al ganado.'][Math.floor(Math.random()*3)]};
function fvActs(){const acts=W3.acts;if(!acts)return;FV.acts=[];const mk=(obj,l,role,fn)=>{const a={x:obj.x,z:obj.z,r:2.8,l,cond:()=>!W3.ride&&!W3.drive,fn:fn||(()=>toast(FV_DICHO[role]()))};a.__fv=obj;acts.push(a);FV.acts.push(a)};
 const nom={veter:'con el veterinario',guarda:'con el guarda',conocedor:'con el conocedor',representante:'con el representante',mayoral:'con el mayoral de campo'};
 for(const w of FV.gente)mk(w,'Hablar '+(nom[w.role]||'con el personal'),w.role);
 for(const v of FV.vaq)mk(v,'Hablar con el vaquero','vaquero');
 for(const d of FV.per)mk(d,'Acariciar al mastín','perro',()=>{d.P.feliz=1.4;d.modo=d.modo==='puerta'?'puerta':'sigue';toast(FV_DICHO.perro())})}
/* ---------- cada fotograma ---------- */
const FVq=new THREE.Quaternion(),FVe=new THREE.Euler(),FVv=new THREE.Vector3(),FVs=new THREE.Vector3(),FVm=new THREE.Matrix4();
function fvPon(m,i,x,y,z,ry,s=1,rx=0,rz=0){FVe.set(rx,ry,rz);FVq.setFromEuler(FVe);FVv.set(x,y,z);FVs.set(s,s,s);FVm.compose(FVv,FVq,FVs);m.setMatrixAt(i,FVm)}
function fvTick(dt){if(!FV.on||W3.mode!=='finca'||!W3.scene)return;dt=Math.min(dt,.1);FV.t+=dt;const P=W3.F?W3.F.p:{x:0,z:0};const c=FV.cen();
 // vaqueros: rodean el ganado al paso, a ratos se paran a mirar
 for(const v of FV.vaq){v.t-=dt;if(v.t<0){v.para=!v.para&&Math.random()<.45;v.t=v.para?fvR(3,7):fvR(6,14);if(!v.para&&Math.random()<.3)v.dir*=-1;v.R=fvR(14,28)}
  const want=v.para?0:1.6;v.sp+=(want-v.sp)*Math.min(1,dt*1.5);v.a+=v.dir*v.sp*dt/v.R;const tx=c.x+Math.cos(v.a)*v.R,tz=c.z+Math.sin(v.a)*v.R;
  const ex=tx-v.x,ez=tz-v.z,el=Math.hypot(ex,ez);if(el>.05){const k=Math.min(1,dt*(v.sp+.4)/Math.max(el,.3));v.x+=ex*k;v.z+=ez*k;if(v.sp>.2)v.yaw+=angD(v.yaw,Math.atan2(ex,ez))*Math.min(1,dt*3)}
  else if(v.para)v.yaw+=angD(v.yaw,Math.atan2(c.x-v.x,c.z-v.z))*Math.min(1,dt*1.2);
  v.H.root.position.set(v.x,gH(v.x,v.z),v.z);v.H.root.rotation.y=v.yaw;animHorse(v.H,dt,v.sp*.45);if(v.r.gl)v.r.gl.mixer.update(dt)}
 // personal con ruta (veterinario, guarda, representante) o puesto (conocedor)
 for(const w of FV.gente){let tx=w.x,tz=w.z;if(w.ruta){const q=w.ruta[w.k%w.ruta.length];tx=q[0];tz=q[1];if(Math.hypot(tx-w.x,tz-w.z)<.8){w.espera-=dt;if(w.espera<0){w.k++;w.espera=w.role==='guarda'?fvR(1,3):fvR(4,9)}tx=w.x;tz=w.z}}
  else if(w.role==='conocedor'){const a=Math.atan2(w.hz-c.z,w.hx-c.x);tx=c.x+Math.cos(a)*13;tz=c.z+Math.sin(a)*13;if(Math.hypot(tx-w.x,tz-w.z)<1.5){tx=w.x;tz=w.z}}
  else if(w.role==='mayoral'){tx=w.hx;tz=w.hz}
  const ex=tx-w.x,ez=tz-w.z,el=Math.hypot(ex,ez);const sp=el>.3?(w.role==='guarda'?1.25:1.05):0;if(sp){w.x+=ex/el*sp*dt;w.z+=ez/el*sp*dt;w.p.root.rotation.y=Math.atan2(ex,ez)}
  else if(w.role==='conocedor')w.p.root.rotation.y+=angD(w.p.root.rotation.y,Math.atan2(c.x-w.x,c.z-w.z))*Math.min(1,dt*2);
  w.p.root.position.set(w.x,gH(w.x,w.z),w.z);animPerson(w.p,dt,sp/3)}
 // mastines
 for(const d of FV.per){let tx=d.x,tz=d.z,sp=0,sent=false;const dp=Math.hypot(P.x-d.x,P.z-d.z);
  if(d.modo==='sigue'){if(W3.ride||W3.drive){d.modo='puerta';d.hx=d.hx??d.x;d.hz=d.hz??d.z}if(dp>4.5){const a=Math.atan2(d.x-P.x,d.z-P.z);tx=P.x+Math.sin(a)*2.6;tz=P.z+Math.cos(a)*2.6;sp=dp>12?4.5:dp>7?3:1.6}else sent=dp<3.2&&!(W3.F&&W3.F.sp>.1)}
  else{if(d.hx==null){d.hx=d.x;d.hz=d.z}tx=d.hx;tz=d.hz;const e=Math.hypot(tx-d.x,tz-d.z);sp=e>.5?1.4:0;sent=!sp;if(d.P.feliz&&dp<3)d.yaw+=angD(d.yaw,Math.atan2(P.x-d.x,P.z-d.z))*Math.min(1,dt*3);if(dp>30&&!W3.ride&&!W3.drive&&d.hx!==3.2){d.modo='sigue'}}
  const ex=tx-d.x,ez=tz-d.z,el=Math.hypot(ex,ez);if(sp&&el>.2){const k=Math.min(el,sp*dt);d.x+=ex/el*k;d.z+=ez/el*k;d.yaw+=angD(d.yaw,Math.atan2(ex,ez))*Math.min(1,dt*6)}else sp=0;
  d.P.root.position.set(d.x,gH(d.x,d.z),d.z);d.P.root.rotation.y=d.yaw;fvAnimPerro(d.P,dt,sp/3,sent)}
 // conversaciones: la marca sigue a cada personaje
 for(const a of FV.acts||[]){const o=a.__fv;a.x=o.x;a.z=o.z}
 // garcillas: picotean junto a su res, se levantan si te acercas
 const G=FV.gar;G.b.forEach((g,i)=>{const hx=g.h?g.h.x:g.x,hz=g.h?g.h.z:g.z;const dP=Math.hypot(P.x-g.x,P.z-g.z);if(dP<5&&!g.vuela){g.vuela=1;g.vx=(g.x-P.x)/(dP||1);g.vz=(g.z-P.z)/(dP||1);g.ox=fvR(-2.5,2.5);g.oz=fvR(-2.5,2.5)}
  const gy=gH(g.x,g.z);if(g.vuela){g.vuela+=dt;const f=g.vuela;g.x+=g.vx*dt*5;g.z+=g.vz*dt*5;g.y=gy+Math.sin(Math.min(Math.PI,f*1.1))*4;g.yaw=Math.atan2(g.vx,g.vz);if(f>2.8){g.vuela=0;const h=(W3.herd||[])[Math.floor(Math.random()*(W3.herd||[]).length)];if(h)g.h=h}}
  else{const tx=hx+g.ox,tz=hz+g.oz,ex=tx-g.x,ez=tz-g.z,el=Math.hypot(ex,ez);if(el>.4){const k=Math.min(el,(el>6?6:1.2)*dt);g.x+=ex/el*k;g.z+=ez/el*k;g.yaw=Math.atan2(ex,ez)}g.t-=dt;if(g.t<0){g.t=fvR(.6,2.5);g.pk=.35;if(Math.random()<.3){g.ox=fvR(-2.5,2.5);g.oz=fvR(-2.5,2.5)}}g.y=gy;g.pk=Math.max(0,g.pk-dt)}
  fvPon(G.m,i,g.x,g.y,g.z,g.yaw,1.15,g.pk>0?.5:0)});G.m.instanceMatrix.needsUpdate=true;
 // cigüeñas: una en el nido (crotora a ratos) y otra que va y viene; dos planeando en círculos
 const C=FV.cig;C.t+=dt;const cr=(C.t%9)>7.6?Math.sin(C.t*30)*.25:0;fvPon(C.m,0,C.x+.2,C.y,C.z,.8,1,cr);fvPon(C.m,1,C.x-.25,C.y,C.z+.15,-2.1+Math.sin(C.t*.3)*.4,1,0);C.m.instanceMatrix.needsUpdate=true;
 const Pl=FV.plan;for(let i=0;i<2;i++){Pl.a[i]+=dt*(.12+i*.03);const a=Pl.a[i],r=55+i*18;const x=-9+Math.cos(a)*r,z=-6+Math.sin(a)*r,y=32+i*9+Math.sin(a*2)*3;fvPon(Pl.m,i,x,y,z,a+Math.PI,1.35,0,-.25+Math.sin(FV.t*.7+i)*.06)}Pl.m.instanceMatrix.needsUpdate=true;
 // estorninos: cada cierto tiempo cruza una bandada
 const Bd=FV.band;if(!Bd.on){Bd.t-=dt;if(Bd.t<0){Bd.on=true;const a=fvR(0,6.28);Bd.x=P.x-Math.cos(a)*140;Bd.z=P.z-Math.sin(a)*140;Bd.dx=Math.cos(a);Bd.dz=Math.sin(a);Bd.y=fvR(16,26)}}
 if(Bd.on){Bd.x+=Bd.dx*dt*16;Bd.z+=Bd.dz*dt*16;const yaw=Math.atan2(Bd.dx,Bd.dz);Bd.o.forEach((o,i)=>{const w=FV.t*1.3+o[3];fvPon(Bd.m,i,Bd.x+o[0]+Math.sin(w)*2.2,Bd.y+o[1]+Math.sin(w*1.7)*1.2,Bd.z+o[2]+Math.cos(w*.9)*2.2,yaw,1,0,Math.sin(FV.t*22+o[3]*5)*.5)});
  if(Math.hypot(Bd.x-P.x,Bd.z-P.z)>170){Bd.on=false;Bd.t=fvR(18,40)}}else Bd.o.forEach((o,i)=>fvPon(Bd.m,i,0,-50,0,0,.001));Bd.m.instanceMatrix.needsUpdate=true}
{const _rbFV=rebuildFinca;rebuildFinca=function(){FV.on=false;const r=_rbFV.apply(this,arguments);try{fvMontar()}catch(e){console.warn('vida finca',e)}return r}}
{const _ftFV=fincaTick;fincaTick=function(dt){const r=_ftFV.apply(this,arguments);try{fvTick(dt||0)}catch(e){console.warn('vida finca',e);FV.on=false}return r}}
