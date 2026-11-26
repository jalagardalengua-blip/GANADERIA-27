/* ===================== MODELOS 3D REALISTAS (GLB) =====================
   Sustituye las reses, la finca, la placita y las plazas dibujadas con primitivas
   por modelos GLB cuando la calidad gráfica es media o alta. Si un modelo no carga
   (sin conexión, móvil antiguo...) el juego sigue con las figuras de siempre. */
const MOD={lib:{},prom:{},tex:{},mats:{},plaza:{},off:false};
const MODB='modelos/';
const MODQ=()=>!MOD.off&&typeof THREE!=='undefined'&&!!THREE.GLTFLoader&&!!THREE.SkeletonUtils&&(W3.q||'media')!=='baja';
const PELOF={negro:'negro','cárdeno':'cardeno',entrepelado:'entrepelado',colorado:'colorado','castaño':'castano',jabonero:'jabonero',salinero:'salinero',burraco:'burraco'};
const FINCA_GLB=['cortijo','portada','abrevadero','comedero','pacas','placita','encina','olivo','camioneta','barril_1','barril_2','cantaro','tinaja_ceramica','macetero_barro','maceta','banco_madera','farol','cubo_madera','carretilla_mano','sacos_abono','botas_goma','escoba','hacha','hachuela','tocon','neumatico_viejo','bombona_gas','roca_1','pedrusco'];
const GENTE_GLB=['aficionado_1','aficionado_2','aficionado_3','aficionado_4'];
const PLAZA_GLB={ventas:{R:30},maestranza:{R:31},valencia:{R:26},ronda:{R:33}};

function modFix(root){ // mismo tratamiento de color que el resto del juego (sin gestión de color en r128)
 root.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;
  for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const k of ['map','emissiveMap'])if(m[k])m[k].encoding=THREE.LinearEncoding;
   if(m.map)m.map.anisotropy=4;if(m.transparent&&m.alphaTest===0&&/hoja|leaf|arbusto|shrub|parra|bush|foliage/i.test(m.name+(m.map&&m.map.name||''))){m.transparent=false;m.alphaTest=.5}m.needsUpdate=true}})}
function modGet(name,dir){const k=(dir||'')+name;if(MOD.lib[k])return Promise.resolve(MOD.lib[k]);if(MOD.prom[k])return MOD.prom[k];
 MOD.prom[k]=new Promise((ok,ko)=>{new THREE.GLTFLoader().load(MODB+(dir||'')+name+'.glb',g=>{modFix(g.scene);MOD.lib[k]=g;ok(g)},null,e=>{MOD.prom[k]=null;ko(e)})});return MOD.prom[k]}
function modTex(url){if(MOD.tex[url])return MOD.tex[url];const t=new THREE.TextureLoader().load(url);t.flipY=false;t.encoding=THREE.LinearEncoding;t.anisotropy=4;return MOD.tex[url]=t}
function modJSON(url){return fetch(url).then(r=>{if(!r.ok)throw new Error(url);return r.json()})}

/* ---------- precarga ---------- */
function modPreload(){if(!MODQ()||MOD.started)return;MOD.started=true;
 // reses primero: salen en la finca, la tienta y la plaza
 Promise.all(['res_toro','res_vaca','res_becerro'].map(n=>modGet(n))).then(()=>{Object.values(PELOF).forEach(p=>modTex(MODB+'pelo/'+p+'.webp'));MOD.res=true;
  if(W3.on&&W3.mode==='finca')rebuildFinca();
  ['res_toro_hd','res_vaca_hd','res_becerro_hd'].forEach(n=>modGet(n).catch(()=>null));Object.values(PELOF).forEach(p=>modTex(MODB+'pelo_hd/'+p+'.webp'))}).catch(e=>console.warn('reses GLB',e));
 Promise.all(FINCA_GLB.map(n=>modGet(n,'finca/').catch(()=>null))).then(()=>{MOD.finca=true;if(W3.on&&W3.mode==='finca')rebuildFinca()});
 GENTE_GLB.forEach(n=>modGet(n,'gente/').catch(()=>null))}
function modPLR(){return MODQ()&&MOD.lib['finca/placita']?9.5:7}

/* ---------- utilidades ---------- */
function modClone(k){const g=MOD.lib[k];return g?THREE.SkeletonUtils.clone(g.scene):null}
function modPut(k,parent,x,y,z,ry,s){const o=modClone(k);if(!o)return null;o.position.set(x,y,z);o.rotation.y=ry||0;if(s!=null)(typeof s==='number'?o.scale.setScalar(s):o.scale.set(...s));parent.add(o);return o}
function modSize(o){return new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3())}
function modBone(root,name){let b=null;const want=name.replace(/[.\s]/g,'');root.traverse(o=>{if(!b&&o.isBone&&o.name.replace(/[.\s]/g,'')===want)b=o});return b}
function modBoneEnd(root,suffix){let b=null;root.traverse(o=>{if(!b&&o.isBone&&o.name.endsWith(suffix))b=o});return b}
// instancias de un GLB estático (un InstancedMesh por primitiva)
function modInst(k,list,parent){const g=MOD.lib[k];if(!g||!list.length)return [];g.scene.updateMatrixWorld(true);const out=[];
 g.scene.traverse(o=>{if(!o.isMesh)return;const im=new THREE.InstancedMesh(o.geometry,o.material,list.length);const M4=new THREE.Matrix4(),q=new THREE.Quaternion(),S3=new THREE.Vector3();
  list.forEach(([x,y,z,ry,s],i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),ry);S3.set(s,s,s);M4.compose(new THREE.Vector3(x,y,z),q,S3).multiply(o.matrixWorld);im.setMatrixAt(i,M4)});
  im.castShadow=true;im.receiveShadow=true;parent.add(im);out.push(im)});return out}

/* =================== RESES =================== */
function peloGlbMat(pelo,kind,hd){const f=PELOF[pelo]||'negro',k=f+(hd?'_hd':'');if(MOD.mats[k])return MOD.mats[k];
 let base=null;MOD.lib['res_'+kind+(hd?'_hd':'')].scene.traverse(o=>{if(!base&&o.isMesh)base=o.material});
 const m=base.clone();m.map=modTex(MODB+(hd?'pelo_hd/':'pelo/')+f+'.webp');m.roughness=1;m.metalness=1;m.side=THREE.FrontSide;m.needsUpdate=true;return MOD.mats[k]=m}
const CLIPS_RES=['Idle','Idle_2','Idle_Headlow','Eating','Walk','Gallop','Attack_Headbutt','Attack_Kick','Death','Idle_HitReact_Left','Idle_HitReact_Right','Gallop_Jump','Jump_toIdle'];
function makeBull(spec){
 const kind=spec.kind||'toro';
 // en la plaza y en la tienta la res se ve de cerca: modelo de alta definición (35.000 triángulos, pelo 2048 px)
 const hd=(W3.mode==='plaza'||(typeof TT!=='undefined'&&!!TT))&&!!MOD.lib['res_'+kind+'_hd'];
 const src=MOD.lib['res_'+kind+(hd?'_hd':'')];
 if(kind==='cabestro'||!MOD.res||!MODQ()||!src)return makeBullProc(spec);
 const model=THREE.SkeletonUtils.clone(src.scene);const mat=peloGlbMat(spec.pelo,kind,hd);
 model.traverse(o=>{if(o.isMesh){o.material=mat;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false}});
 const m=spec.m||{};const sx=clamp(m.girth||1,.85,1.2),sy=clamp(m.alt||1,.88,1.15),sz=clamp(m.len||1,.88,1.15);
 const root=new THREE.Group(),b=new THREE.Group(),inner=new THREE.Group();root.add(b);b.add(inner);inner.add(model);inner.scale.set(sx,sy,sz);
 // morrillo, cuernos y cara siguen las proporciones de la res; los complementos (banderillas, divisa) se anclan a la cruz
 const bones={};for(const n of ['Body','Torso','Torso2','Torso3','Neck1','Neck2','Neck3','Head','FrontUpperLeg.L','FrontUpperLeg.R','FrontLowerLeg.L','FrontLowerLeg.R','Tail1','Tail2'])bones[n]=modBone(model,n);
 inner.updateMatrixWorld(true);
 const proc=makeBullProc(spec);const bg=proc.bg;proc.b.remove(bg);
 const cruzY=kind==='becerro'?.78:kind==='vaca'?1.12:1.22,cruzZ=kind==='becerro'?.12:.18;
 const pos=new THREE.Vector3(0,cruzY+.02,cruzZ+.12);inner.add(bg);bg.position.copy(pos).divide(inner.scale);bg.rotation.set(0,0,0);bg.scale.setScalar(.8);
 inner.updateMatrixWorld(true);const anc=bones.Neck1||bones.Torso3;if(anc)anc.attach(bg);
 if(spec.div){const dv=new THREE.Group();inner.add(dv);dv.position.set(0,cruzY+.03,cruzZ+.25);spec.div.forEach((c,i)=>{const r=new THREE.Mesh(new THREE.PlaneGeometry(.06,.36),M(c,.7,0,THREE.DoubleSide));r.position.set((i?.045:-.045),-.1,0);r.rotation.set(.3,0,(i?-.35:.35));dv.add(r)});
  mesh(geos().sph,M(spec.div[0],.6),.05,.05,.05,0,.02,0,dv,true);inner.updateMatrixWorld(true);if(anc)anc.attach(dv)}
 const mixer=new THREE.AnimationMixer(model);const act={};
 for(const c of src.animations){if(CLIPS_RES.includes(c.name))act[c.name]=mixer.clipAction(c)}
 const B={root,b,hp:new THREE.Group(),legs:[],tp:new THREE.Group(),bg,ph:Math.random()*6,kind,hipY:kind==='becerro'?.5:.8,t:Math.random()*10,
  cruz:{y:cruzY*sy,z:cruzZ*sz},glb:{mixer,act,bones,cur:null,curA:null,tossT:0,var:Math.random(),idleT:0,look:0,pitch:0,kn:0,q:new THREE.Quaternion(),e:new THREE.Euler()}};
 glbPlay(B.glb,'Idle',0);B.glb.curA.time=Math.random()*B.glb.curA.getClip().duration;return B}
function glbPlay(G,name,fade,once){const a=G.act[name];if(!a)return;if(G.cur===name&&!once)return;
 a.reset();a.enabled=true;a.setEffectiveTimeScale(1);a.setEffectiveWeight(1);a.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat,Infinity);a.clampWhenFinished=!!once;a.play();
 if(G.curA&&G.curA!==a&&fade>0)G.curA.crossFadeTo(a,fade,false);else if(G.curA&&G.curA!==a)G.curA.stop();
 if(name==='Walk'||name==='Gallop'||name==='Idle'||name==='Eating')a.time=Math.random()*a.getClip().duration*.9;
 G.cur=name;G.curA=a}
// gira un hueso en su propio espacio, sumándose a la animación
function boneAdd(G,bone,x,y,z){if(!bone||(!x&&!y&&!z))return;G.e.set(x,y,z);G.q.setFromEuler(G.e);bone.quaternion.multiply(G.q)}
function animBull(B,dt,o){if(!B.glb)return animBullProc(B,dt,o);
 const G=B.glb,sp=o.speed||0,head=o.head??.3;B.t+=dt;
 let clip='Idle',ts=1,fade=.3;
 if(o.toss>.5&&G.tossT<=0){G.tossT=.75;glbPlay(G,'Attack_Headbutt',.12,true);G.curA.setEffectiveTimeScale(1.35)}
 if(G.tossT>0){G.tossT-=dt;clip=null}
 else if(o.fall>.02){clip='Idle_Headlow';ts=0}                      // tumbado (derribo, arrastre)
 else if(o.kneel>.02){clip='Idle_Headlow';ts=.6}
 else if(o.push){clip='Idle_Headlow';ts=.5}                           // empuja en el peto o pelea: riñones y cabeza abajo
 else if(sp>1.0){clip='Gallop';ts=clamp(.7+sp*.33,.8,1.35)}           // galope, embestida
 else if(sp>.04){clip='Walk';ts=clamp(sp/.5,.5,2)*(o.limp?.75:1)}      // al paso / trote
 else if(o.paw){clip='Idle_Headlow';ts=.8}                             // escarba (la mano se mueve abajo)
 else{G.idleT-=dt;                                                     // parado
  if(head>=.95)clip='Eating';                                          // pastando o en el comedero
  else if(head>=.55)clip='Idle_Headlow';                               // humillado, tranquilo
  else clip=G.var>.5?'Idle':'Idle_2';                                  // alerta, fijo en lo que mira
  if(G.idleT<=0){G.idleT=R(5,12);G.var=Math.random()}}
 if(clip){glbPlay(G,clip,fade);G.curA.paused=ts===0;if(ts)G.curA.setEffectiveTimeScale(ts)}
 G.mixer.update(dt);
 // capa procedimental: mirada, humillar en la embestida, arrodillarse al doblar, rabo
 const bo=G.bones,k=Math.min(1,dt*5);
 G.look+=((o.look||0)*.5-G.look)*Math.min(1,dt*4);
 const loco=G.cur==='Walk'||G.cur==='Gallop'||G.cur==='Idle'||G.cur==='Idle_2';
 const wantP=loco?(G.cur==='Gallop'?clamp(head-.4,0,.6)*1.1:G.cur==='Walk'?.3+clamp(head-.5,-.3,.4)*.7:clamp(head-.5,-.3,.4)*.7):0;G.pitch+=(wantP-G.pitch)*k;
 // ejes del esqueleto: -x baja la cabeza, -z la gira hacia su izquierda
 boneAdd(G,bo.Neck2,-G.pitch*.5,0,-G.look*.45);boneAdd(G,bo.Neck3,-G.pitch*.4,0,-G.look*.35);boneAdd(G,bo.Head,-G.pitch*.3,0,-G.look*.25);
 G.kn+=((o.kneel||0)-G.kn)*Math.min(1,dt*3);
 if(G.kn>.01){const kn=G.kn;for(const s of ['L','R']){boneAdd(G,bo['FrontUpperLeg.'+s],.25*kn,0,0);boneAdd(G,bo['FrontLowerLeg.'+s],2.4*kn,0,0)}}
 if(o.paw&&!G.kn&&(o.speed||0)<.04){const ph=B.t*6.5;boneAdd(G,bo['FrontUpperLeg.L'],-.32+.5*Math.sin(ph),0,0);boneAdd(G,bo['FrontLowerLeg.L'],.15+.95*Math.max(0,Math.sin(ph+1.3)),0,0)}
 if(o.push&&!G.kn){const pp=Math.sin(B.t*4.5);boneAdd(G,bo.Neck2,-.25-.12*pp,0,0);boneAdd(G,bo.Head,-.15,0,.08*pp);B.b.position.z=.05+.05*pp}else B.b.position.z=0;
 B.b.position.y=-.36*G.kn*B.hipY;B.b.rotation.x=.24*G.kn+(o.push?-.05:0);
 if(o.limp&&sp>.05)B.b.rotation.z=Math.sin(B.t*6)*.03;else B.b.rotation.z=0}

/* =================== FINCA =================== */
function modFinca(FX){if(!MODQ())return;const sc=FX.sc,L=MOD.lib,fx=FX.glb=[];const has=k=>!!L['finca/'+k];
 const put=(k,p,x,y,z,ry,s)=>{const o=modPut('finca/'+k,p,x,y,z,ry,s);if(o)fx.push(o);return o};
 // cortijo
 if(has('cortijo')){FX.cj.children.forEach(c=>c.visible=false);const o=put('cortijo',sc,0,0,0,0,1.15);if(o&&FX.az){FX.az.visible=true;FX.cj.remove(FX.az);FX.az.position.set(0,3.55,4.9);sc.add(FX.az)}
  // atrezo del porche y la fachada
  put('banco_madera',sc,-4.6,0,6.1,0,1);put('banco_madera',sc,4.8,0,6.1,0,1);
  for(const [k,x,z,r] of [['tinaja_ceramica',-8.2,6.4,.3],['macetero_barro',-6.8,6.5,0],['maceta',-1.5,5.6,0],['maceta',1.5,5.6,0],['cantaro',6.6,6.3,1],['macetero_barro',8.4,6.2,.5]])put(k,sc,x,0,z,r,1.2);
  put('farol',sc,-1.25,2.35,5.05,0,1.1);put('farol',sc,1.25,2.35,5.05,0,1.1)}
 // portería con el nombre de la ganadería
 if(has('portada')&&FX.gate){FX.gate.children.forEach(c=>{if(!(FX.gp||[]).includes(c))c.visible=false});const o=put('portada',FX.gate,0,0,0,0,1.25);if(o)o.traverse(c=>{if(c.isMesh&&/rotulo/i.test(c.material.name))c.visible=false});for(const g of FX.gp||[]){g.position.y=4.35;g.scale.set(.82,.8,1)}}
 // placita de tientas
 if(has('placita')&&FX.pl){FX.pl.children.forEach(c=>c.visible=false);put('placita',FX.pl,0,.05,0,0,PLR/PLAZA_R0)}
 // comederos y abrevaderos
 if(has('comedero'))for(const g of FX.feeds){if(g.userData.cb){g.userData.cb.visible=false;const o=put('comedero',g,0,0,0,Math.PI/2,[1.15,1,1.2]);if(o)o.traverse(c=>{if(c.isMesh&&/heno/i.test(c.material.name))c.visible=false})}}
 if(has('abrevadero'))for(const g of FX.abrev){g.children.forEach(c=>c.visible=false);put('abrevadero',g,0,0,0,Math.PI/2,[.85,1,1])}
 // pacas y sacos junto al remolque de pienso
 if(FX.rem){put('pacas',sc,35.5,gH(35.5,27),27.5,.4,1);put('sacos_abono',sc,30.2,gH(30.2,26),26.2,1.1,1.2);put('pacas',sc,-24.5,gH(-24.5,8),8.5,1.6,.8)}
 // cuarto de aperos y herradero
 for(const [k,x,z,r,s] of [['carretilla_mano',-18.5,3.6,.7,1],['escoba',-23.6,3.8,0,1],['botas_goma',-22.9,3.9,.3,1],['cubo_madera',-19.2,4.6,0,1],['barril_1',-23.8,.9,0,1],['barril_2',-23.8,-.1,.5,1],['bombona_gas',-18.4,.4,0,1],['neumatico_viejo',-17.6,-1.2,0,1.1],
  ['tocon',-14,-11.6,0,1],['hachuela',-14,-11.25,1.2,1],['hacha',-13.4,-12,0,1],['cubo_madera',-17,-12.4,0,1]])put(k,sc,x,gH(x,z),z,r,s);
 // camioneta
 if(has('camioneta')&&FX.tr){const o=modClone('finca/camioneta');if(o){const sz=modSize(o);const L2=Math.max(sz.x,sz.z);const s=4.75/L2;o.scale.setScalar(s);if(sz.x>sz.z)o.rotation.y=-Math.PI/2;
  const bb=new THREE.Box3().setFromObject(o);o.position.y=-bb.min.y;const c=bb.getCenter(new THREE.Vector3());o.position.x-=c.x;o.position.z-=c.z;
  FX.tr.children.forEach(c2=>{c2.visible=false});FX.tr.add(o);fx.push(o)}}
 // dehesa: encinas y olivos de verdad cerca de la casa, el resto lejano sigue siendo bosque ligero
 if(has('encina')&&FX.tp){const near=[],oli=[];const O=new THREE.Object3D();
  FX.tp.forEach(([x,z,s,r],i)=>{const d=Math.hypot(x,z);if(d<150&&near.length<(W3.q==='alta'?40:22)){(Math.abs(x)<120&&z>40&&oli.length<8?oli:near).push([x,gH(x,z),z,r,s*1.25]);
    O.position.set(0,-50,0);O.scale.set(0,0,0);O.updateMatrix();FX.trunk.setMatrixAt(i,O.matrix);FX.crown.setMatrixAt(i*2,O.matrix);FX.crown.setMatrixAt(i*2+1,O.matrix)}});
  FX.trunk.instanceMatrix.needsUpdate=FX.crown.instanceMatrix.needsUpdate=true;
  const sE=8/Math.max(.1,modSize(L['finca/encina'].scene).y),sO=5.5/Math.max(.1,modSize(L['finca/olivo'].scene).y);
  fx.push(...modInst('finca/encina',near.map(t=>[t[0],t[1],t[2],t[3],t[4]*sE]),sc));
  if(has('olivo'))fx.push(...modInst('finca/olivo',oli.map(t=>[t[0],t[1],t[2],t[3],t[4]*sO]),sc))}
 // piedras y matorral
 const rr=mulberry(S.g.name.length*7+1),rocks={roca_1:[],pedrusco:[]},RB={roca_1:9,pedrusco:1.6};
 const free=(x,z)=>!(x>-44&&x<42&&z>-46&&z<36)&&!(Math.abs(x)<7&&z>10&&z<100)&&!Object.values(RECTS).some(Rc=>x>Rc.x0-1&&x<Rc.x1+1&&z>Rc.z0-1&&z<Rc.z1+1);
 for(let i=0;i<220;i++){const x=(rr()-.5)*300,z=(rr()-.5)*300;if(!free(x,z))continue;const ks=Object.keys(rocks),k=ks[Math.floor(rr()*ks.length)];rocks[k].push([x,gH(x,z)-.08,z,rr()*6,RB[k]*(.5+rr()*1.1)])}
 for(const [k,l] of Object.entries(rocks))if(has(k))fx.push(...modInst('finca/'+k,l,sc));
 // visitas de aficionados cuando el cortijo está reformado
 FX.gente=[];if(mej('casa')){const pts=[[-6,9.5],[6,10],[0,13.5],[-9,12],[8.5,13]];[0,1].forEach(i=>{const P=modPerson(['aficionado_3','aficionado_4'][i]);if(!P)return;P.root.position.set(pts[i][0],0,pts[i][1]);sc.add(P.root);FX.gente.push({P,pts,wp:i,t:R(2,5),st:'quieto',x:pts[i][0],z:pts[i][1],yaw:0})})}}
const PLAZA_R0=13;
function modFincaTick(dt){const FX=W3.FX;if(!FX||!FX.gente)return;
 for(const g of FX.gente){g.t-=dt;
  if(g.st==='quieto'){personPlay(g.P,'reposo');if(g.t<=0){g.wp=(g.wp+1+Math.floor(Math.random()*3))%g.pts.length;g.st='anda'}}
  else{const [tx,tz]=g.pts[g.wp],dx=tx-g.x,dz=tz-g.z,d=Math.hypot(dx,dz);personPlay(g.P,'andar');if(d<.3){g.st='quieto';g.t=R(4,10)}else{const v=1.25;g.x+=dx/d*v*dt;g.z+=dz/d*v*dt;g.yaw+=angD(g.yaw,Math.atan2(dx,dz))*Math.min(1,dt*5)}}
  // si el jugador se acerca, se le quedan mirando
  const F=W3.F;if(F&&Math.hypot(F.p.x-g.x,F.p.z-g.z)<3.5&&g.st==='quieto')g.yaw+=angD(g.yaw,Math.atan2(F.p.x-g.x,F.p.z-g.z))*Math.min(1,dt*3);
  g.P.root.position.set(g.x,gH(g.x,g.z),g.z);g.P.root.rotation.y=g.yaw;g.P.mixer.update(dt)}}

/* =================== GENTE (aficionados y recortadores) =================== */
function modPerson(k){const src=MOD.lib['gente/'+k];if(!src||!MODQ())return null;const model=THREE.SkeletonUtils.clone(src.scene);model.traverse(o=>{if(o.isMesh)o.frustumCulled=false});
 const root=new THREE.Group();root.add(model);const mixer=new THREE.AnimationMixer(model);const act={};for(const c of src.animations)act[c.name]=mixer.clipAction(c);
 const P={root,mixer,act,cur:null,curA:null};personPlay(P,'reposo');P.curA.time=Math.random()*3;return P}
function personPlay(P,name,once,ts){if(P.cur===name&&!once)return;const a=P.act[name];if(!a)return;a.reset();a.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat,Infinity);a.clampWhenFinished=!!once;a.setEffectiveTimeScale(ts||1);a.setEffectiveWeight(1);a.play();
 if(P.curA&&P.curA!==a)P.curA.crossFadeTo(a,.25,false);P.cur=name;P.curA=a}

/* ---------- la tienta: aficionados en los burladeros ---------- */
function modTientaStart(T){T.gente=[];if(!MODQ())return;const C=T.C;
 [['aficionado_1',.9],['aficionado_2',2.75],['aficionado_4',4.6]].forEach(([k,a])=>{const P=modPerson(k);if(!P)return;const r=PLR-.75;
  const g={P,a0:a,x:C.x+Math.sin(a)*r,z:C.z+Math.cos(a)*r,yaw:a+Math.PI,st:'mira',t:0,cd:0};g.hx=g.x;g.hz=g.z;P.root.position.set(g.x,0,g.z);W3.scene.add(P.root);T.gente.push(g)})}
function modTientaTick(T,dt){if(!T.gente||!T.gente.length)return;const C=T.C;
 for(const g of T.gente){g.t-=dt;g.cd-=dt;const dx=T.cx-g.x,dz=T.cz-g.z,d=Math.hypot(dx,dz),toCow=Math.atan2(dx,dz);
  switch(g.st){
   case 'mira':{personPlay(g.P,'reposo');g.yaw+=angD(g.yaw,toCow)*Math.min(1,dt*3);
    // la vaca se viene: unos hacen el quiebro, otros se van a la carrera por la tapia
    if(T.cow&&d<2.8&&g.cd<=0&&T.phase!=='caballo'){g.cd=4;if(Math.random()<.55){g.st='quiebro';g.t=1.4;personPlay(g.P,'quiebro',true)}else{g.st='huye';g.t=1.3;g.dir=Math.sign(angD(Math.atan2(g.x-C.x,g.z-C.z),Math.atan2(T.cx-C.x,T.cz-C.z)))||1;personPlay(g.P,'correr_mirando_atras')}}
    // entra al quite cuando el torero está en el suelo
    if(T.phase==='quite'&&!T.gente.some(o=>o.st==='quite')&&g===T.gente.reduce((a,b)=>Math.hypot(b.x-T.cx,b.z-T.cz)<Math.hypot(a.x-T.cx,a.z-T.cz)?b:a)){g.st='quite';g.t=2.3;personPlay(g.P,'correr')}
    break}
   case 'quiebro':{g.yaw+=angD(g.yaw,toCow)*Math.min(1,dt*2);if(g.t<=0)g.st='vuelve';break}
   case 'huye':{const a=Math.atan2(g.x-C.x,g.z-C.z)+g.dir*dt*.55,r=PLR-.75;const nx=C.x+Math.sin(a)*r,nz=C.z+Math.cos(a)*r;g.yaw+=angD(g.yaw,Math.atan2(nx-g.x,nz-g.z))*Math.min(1,dt*8);g.x=nx;g.z=nz;if(g.t<=0)g.st='vuelve';break}
   case 'quite':{const tx=T.cx+Math.sin(toCow+Math.PI)*1.6,tz=T.cz+Math.cos(toCow+Math.PI)*1.6,ex=tx-g.x,ez=tz-g.z,e=Math.hypot(ex,ez);
    if(e>.4){const v=4.2;g.x+=ex/e*v*dt;g.z+=ez/e*v*dt;g.yaw+=angD(g.yaw,Math.atan2(ex,ez))*Math.min(1,dt*8)}else{personPlay(g.P,'recorte_giro');g.yaw+=angD(g.yaw,toCow)*Math.min(1,dt*6)}
    if(g.t<=0||T.phase!=='quite')g.st='vuelve';break}
   case 'vuelve':{const r=PLR-.75,hx=C.x+Math.sin(g.a0)*r,hz=C.z+Math.cos(g.a0)*r,ex=hx-g.x,ez=hz-g.z,e=Math.hypot(ex,ez);
    if(e<.3){g.st='mira';break}personPlay(g.P,e>3?'correr':'andar');const v=e>3?3.6:1.3;g.x+=ex/e*Math.min(e,v*dt);g.z+=ez/e*Math.min(e,v*dt);g.yaw+=angD(g.yaw,Math.atan2(ex,ez))*Math.min(1,dt*6);break}}
  // nunca dentro del radio de la res
  if(T.cow&&d<1.1&&g.st!=='quite'){g.x-=dx/d*(1.1-d);g.z-=dz/d*(1.1-d)}
  const rc=Math.hypot(g.x-C.x,g.z-C.z);if(rc>PLR-.6){g.x=C.x+(g.x-C.x)/rc*(PLR-.6);g.z=C.z+(g.z-C.z)/rc*(PLR-.6)}
  g.P.root.position.set(g.x,0,g.z);g.P.root.rotation.y=g.yaw;g.P.mixer.update(dt)}}
function modTientaEnd(T){if(T&&T.gente)for(const g of T.gente)W3.scene.remove(g.P.root);if(T)T.gente=[]}

/* =================== PLAZAS =================== */
function plazaKey(n){n=(n||'').toLowerCase();
 if(/ventas|madrid/.test(n))return 'ventas';if(/maestranza|sevilla/.test(n))return 'maestranza';if(/valencia/.test(n))return 'valencia';
 if(/segunda|tercera/.test(n))return 'ronda';
 // plazas sin modelo propio: la más parecida en estilo
 if(/malagueta|misericordia|vista alegre/.test(n))return 'valencia';if(/pamplona/.test(n))return 'ventas';if(/califas/.test(n))return 'maestranza';return null}
function modPlaza(P,name){const key=MODQ()?plazaKey(name):null;P.want=key;
 if(!key){plazaApply(P,null);return}
 if(MOD.plaza[key]){plazaApply(P,key);return}
 Promise.all([modGet(key,'plazas/'),modJSON(MODB+'plazas/'+key+'.json')]).then(([g,js])=>{MOD.plaza[key]={g,js};if(W3.P===P&&P.want===key)plazaApply(P,key)}).catch(e=>console.warn('plaza GLB',e))}
function plazaApply(P,key){if(P.key===key)return;const sc=P.sc;
 if(P.glbObj){sc.remove(P.glbObj);P.glbObj=null}
 const swapCrowd=(c)=>{for(const k of ['body','heads','panu'])if(P[k]!==c[k]){sc.remove(P[k]);sc.add(c[k]);P[k]=c[k]}P.seats=c.seats;P.frac=-1;P.lastLev=1};
 if(!key){P.procL.forEach(o=>o.visible=true);swapCrowd(P.crowd0);P.pa.position.copy(P.pa0);P.palL=null;P.key=null;setPanu(0);return}
 const D=MOD.plaza[key],R0=PLAZA_GLB[key].R,s=PR/R0;
 const o=THREE.SkeletonUtils.clone(D.g.scene);o.scale.setScalar(s);sc.add(o);P.glbObj=o;
 P.procL.forEach(m=>m.visible=false);
 if(!D.crowd){const rp=mulberry(R0*7);let seats=D.js.seats;const cap=W3.q==='alta'?9000:5200;if(seats.length>cap){const k=cap/seats.length;seats=seats.filter(()=>rp()<k)}
  seats=seats.map(([a,r,y])=>[a,r*s,y*s,rp()]);
  const body=new THREE.InstancedMesh(new THREE.BoxGeometry(.42,.6,.3),new THREE.MeshStandardMaterial({roughness:.8}),seats.length);
  const heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.12,8,6),M('#c79a74',.7),seats.length);
  const panu=new THREE.InstancedMesh(new THREE.PlaneGeometry(.32,.32),new THREE.MeshBasicMaterial({color:'#fbf8f1',side:THREE.DoubleSide}),seats.length);
  const pcols=['#e9dcc5','#3a4b6e','#8a2f2a','#262626','#c79a45','#6b7d8f','#efe7da','#56634a','#b8735a','#f2e9d0'].map(c=>new THREE.Color(c));const q=new THREE.Object3D();
  seats.forEach(([a,rad,y,w],i)=>{q.position.set(Math.sin(a)*rad,y,Math.cos(a)*rad);q.rotation.set(0,a+Math.PI,0);q.scale.set(1,1,1);q.updateMatrix();body.setMatrixAt(i,q.matrix);body.setColorAt(i,pcols[Math.floor(w*997)%pcols.length]);
   q.position.y=y+.43;q.updateMatrix();heads.setMatrixAt(i,q.matrix);q.scale.set(0,0,0);q.updateMatrix();panu.setMatrixAt(i,q.matrix)});
  D.crowd={seats,body,heads,panu}}
 swapCrowd(D.crowd);
 const pl=D.js.palco;P.pa.position.set(0,pl.y*s-.1,pl.r*s+.6);P.palL=[0,pl.y*s+1.2,pl.r*s+1];
 P.key=key;setPanu(0)}

/* arranque: la primera vez que se abre el 3D empieza la descarga de modelos */
{const _show3D=show3D;show3D=function(){const r=_show3D.apply(this,arguments);if(r)try{modPreload()}catch(e){console.warn(e)}return r}}
