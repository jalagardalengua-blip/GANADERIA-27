/* ===================== GANADERÍA DE CORRO · FÍSICAS DE LA RES Y BOU EMBOLAT REAL =====================
   1) Físicas: la res deja de ser un punto. Se comprueba el cuerpo entero (hocico, centro y grupa) contra
      las casas, los cadafales, las talanqueras, la fuente y el refugio; resbala por las paredes en lugar de
      atravesarlas, gira hacia el lado libre cuando choca, se desengancha sola si queda encajada y va de la
      plaza a las calles por las bocacalles (también al recogerse con los cabestros). Los recortadores
      tampoco se meten en las fachadas al correr, esquivar o ser volteados.
   2) Bou embolat como en la vida real: la res sale del cajón lazada por los cuernos; la soga pasa por la
      anilla del pilón y los emboladors la recogen a tirones hasta dejarla amarrada. Le protegen las astas con
      barro, le colocan el armazón de hierro con las bolas de estopa, las encienden con la antorcha, se apagan
      las luces de la calle, se corta la soga y el toro queda libre. La soga tiene física (cuelga, se tensa y
      cae al suelo al cortarla). */

/* ---------------- colisiones ---------------- */
// círculo libre: centro y 8 puntos del contorno dentro de la zona transitable
const CLPOST={on:false,x:0,z:0,r:.32};
function clFree(E,x,z,r,vaca){if(CLPOST.on&&Math.hypot(x-CLPOST.x,z-CLPOST.z)<CLPOST.r+r)return false;if(!E.walk({x,z},vaca))return false;if(r<=0)return true;
 for(let i=0;i<8;i++){const a=i*.7853981634;if(!E.walk({x:x+Math.sin(a)*r,z:z+Math.cos(a)*r},vaca))return false}return true}
// al recogerse o salir: puede pasar junto a los refugios y entrar en el cajón, pero nunca por las casas
function clInCajon(E,x,z){const c=E.cajon;return c&&Math.abs(x-c.x)<2.5&&Math.abs(z-c.z)<4.5}
function clFreeHome(E,x,z,r){const w=(px,pz)=>E.walk({x:px,z:pz},false)||clInCajon(E,px,pz);if(!w(x,z))return false;
 for(let i=0;i<8;i++){const a=i*.7853981634;if(!w(x+Math.sin(a)*r,z+Math.cos(a)*r))return false}return true}
// cuerpo de la res: centro, hocico y grupa
const CLBODY=[[0,.55],[.85,.38],[-.85,.42]];
function clBody(E,x,z,yaw,home){const s=Math.sin(yaw),c=Math.cos(yaw),mar=CL&&CL.o&&CL.o.tipo==='mar'&&typeof MAR!=='undefined';
 for(const [o,r] of CLBODY){const px=x+s*o,pz=z+c*o;
  if(mar&&px>MAR.x-3){if(o===0&&!E.walk({x:px,z:pz},!home))return false;continue} // en el muelle puede asomarse al agua
  if(home?!clFreeHome(E,px,pz,r):!clFree(E,px,pz,r,true))return false}return true}
// normal de la pared más cercana (sale del muro hacia el espacio libre)
function clNormal(E,r,home){const s=Math.sin(r.yaw),c=Math.cos(r.yaw),cx=r.x+s*.6,cz=r.z+c*.6;let nx=0,nz=0,hit=0;
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2,dx=Math.sin(a),dz=Math.cos(a),px=cx+dx*1.25,pz=cz+dz*1.25;
  const ok=home?clFreeHome(E,px,pz,0):E.walk({x:px,z:pz},true);if(!ok){nx-=dx;nz-=dz;hit++}}
 const l=Math.hypot(nx,nz);return hit&&l>1e-3?[nx/l,nz/l]:null}
// posición libre más cercana (para desencajar)
function clFindFree(r,home){const E=CL.env;for(let d=.15;d<=2.6;d+=.15)for(let i=0;i<16;i++){const a=i/16*Math.PI*2,x=r.x+Math.sin(a)*d,z=r.z+Math.cos(a)*d;
  if(clBody(E,x,z,r.yaw,home))return [x,z,r.yaw];for(const dy of [.6,-.6,1.2,-1.2])if(clBody(E,x,z,r.yaw+dy,home))return [x,z,r.yaw+dy]}return null}
// antenas: devuelve el giro que aparta de la pared que tiene delante (0 si el camino está libre)
function clAvoid(r,signOnly){const E=CL&&CL.env;if(!E)return 0;const home=r.mode==='recogida'||r.mode==='sale',L=1.6+Math.max(0,r.v||0)*.35;
 const free=a=>{const y=r.yaw+a;for(const k of [.55,1]){const px=r.x+Math.sin(y)*(.85+L*k),pz=r.z+Math.cos(y)*(.85+L*k);if(home?!clFreeHome(E,px,pz,.35):!clFree(E,px,pz,.35,true))return false}return true};
 if(free(0))return 0;let lft=0,rgt=0;for(const a of [.45,.9,1.4]){if(free(a))lft+=1.6-a;if(free(-a))rgt+=1.6-a}
 const sg=lft>=rgt?1:-1;if(signOnly)return lft===0&&rgt===0?0:sg;return sg*(lft===0&&rgt===0?1.6:.9)}
// movimiento de la res: avanza, resbala por la pared o gira; devuelve true si ha chocado de frente
function clBullMove(r,dt,home){const E=CL.env,ok=(x,z,y)=>clBody(E,x,z,y,home);
 if(r.pyaw!=null){const dy=angD(r.pyaw,r.yaw),mx=4.6*dt;if(Math.abs(dy)>mx)r.yaw=r.pyaw+Math.sign(dy)*mx}
 // escapando de una pared: gira hacia el rumbo libre y sale por él (sin que la persecución lo vuelva a meter)
 if(r.esc&&CL.t<r.esc.until){const a=r.esc.a,dy=clamp(angD(r.yaw,a),-4.6*dt,4.6*dt),ny=r.yaw+dy;if(ok(r.x,r.z,ny))r.yaw=ny;
  if(Math.abs(angD(r.yaw,a))<.35){const sp2=Math.max(1.6,r.v)*dt,nx=r.x+Math.sin(r.yaw)*sp2,nz=r.z+Math.cos(r.yaw)*sp2;if(ok(nx,nz,r.yaw)){r.x=nx;r.z=nz}else r.esc=null}
  r.v=Math.max(r.v,1.6);r.stuck=0;return false}else if(r.esc)r.esc=null;
 // desencaje en curso: camina hasta el hueco libre sin saltos
 if(r.unst){const u=r.unst,dx=u[0]-r.x,dz=u[1]-r.z,d=Math.hypot(dx,dz),st=Math.min(d,2.4*dt),nx=r.x+dx/(d||1)*st,nz=r.z+dz/(d||1)*st,ny=r.yaw+clamp(angD(r.yaw,u[2]),-3*dt,3*dt);
  // cada paso del desencaje se comprueba con el cuerpo entero: nunca atraviesa una pared ni una esquina
  const libreAhora=ok(r.x,r.z,r.yaw);if(ok(nx,nz,ny)||!libreAhora){r.x=nx;r.z=nz;r.yaw=ny}else if(ok(r.x,r.z,ny))r.yaw=ny;else r.unst=null;
  r.v=Math.max(r.v,1);if(r.unst&&(d<.05||(CL.t-u[3])>3))r.unst=null;return false}
 if(!ok(r.x,r.z,r.yaw)){const bx=r.x-Math.sin(r.yaw)*.25,bz=r.z-Math.cos(r.yaw)*.25;
  if(ok(bx,bz,r.yaw)){r.x=bx;r.z=bz}else if(r.pyaw!=null&&ok(r.x,r.z,r.pyaw))r.yaw=r.pyaw;
  else{const f=clFindFree(r,home);if(f)r.unst=[f[0],f[1],f[2],CL.t]}}
 const sp=Math.max(0,r.v)*dt;if(sp<1e-5)return false;const dx=Math.sin(r.yaw)*sp,dz=Math.cos(r.yaw)*sp;
 if(ok(r.x+dx,r.z+dz,r.yaw)){r.x+=dx;r.z+=dz;r.stuck=0;return false}
 const n=clNormal(E,r,home);if(n){const dot=dx*n[0]+dz*n[1],tx=dx-n[0]*dot,tz=dz-n[1]*dot;
  if(Math.hypot(tx,tz)>sp*.15&&ok(r.x+tx,r.z+tz,r.yaw)){r.x+=tx;r.z+=tz;r.v*=1-Math.min(.5,dt*2.2);r.yaw+=angD(r.yaw,Math.atan2(tx,tz))*Math.min(1,dt*3);r.stuck=0;return false}}
 if(Math.abs(dx)>1e-4&&ok(r.x+dx,r.z,r.yaw)){r.x+=dx;r.v*=.97;return false}
 if(Math.abs(dz)>1e-4&&ok(r.x,r.z+dz,r.yaw)){r.z+=dz;r.v*=.97;return false}
 // choque de frente: rumbo libre más parecido al que quería, y a escapar por él
 r.stuck=(r.stuck||0)+dt;let esc=null;for(let k=1;k<=12&&!esc;k++)for(const sg2 of [1,-1]){const a=r.yaw+sg2*k*.26;if(ok(r.x+Math.sin(a)*.4,r.z+Math.cos(a)*.4,a)&&ok(r.x,r.z,r.yaw+sg2*Math.min(k*.26,.5))){esc=a;break}}
 if(esc!=null){r.esc={a:esc,until:CL.t+.9};if(r.mode==='trota'&&!r.salida){r.mode='mira';r.t=0}}else if(r.stuck>.6){const f=clFindFree({x:r.x-Math.sin(r.yaw)*.6,z:r.z-Math.cos(r.yaw)*.6,yaw:r.yaw+Math.PI},home);if(f)r.unst=[f[0],f[1],f[2],CL.t];r.stuck=0}
 r.v*=.4;return true}
// personas encajadas: al hueco libre más cercano
function clUnstickP(E,p){if(clFree(E,p.x,p.z,.28,false))return;for(let d=.1;d<=2;d+=.1)for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=p.x+Math.sin(a)*d,z=p.z+Math.cos(a)*d;if(clFree(E,x,z,.28,false)){p.x=x;p.z=z;return}}}

/* ---------------- rutas entre la plaza y las calles ---------------- */
// las calles solo se comunican con la plaza: para cambiar de calle hay que pasar por la bocacalle
const CLBOCA={e:{sal:[12.4,0],ent:[15.6,0]},w:{sal:[-12.4,0],ent:[-15.6,0]},n:{sal:[0,9.4],ent:[0,12.6]}};
function clRectOf(x,z){for(const k in CLRECT)if(inRc(CLRECT[k],x,z,.05))return k;if(CL&&CL.env&&clInCajon(CL.env,x,z))return 'n';return null}
function clWpBase(x,z,tx,tz){if(!CL||!CL.env||CL.env.name!=='calle')return [tx,tz];const a=clRectOf(x,z),b=clRectOf(tx,tz);if(!a||!b||a===b)return [tx,tz];
 if(a!=='plz'&&CLBOCA[a])return CLBOCA[a].sal;if(b!=='plz'&&CLBOCA[b])return CLBOCA[b].ent;return [tx,tz]}
// rodeo de obstáculos redondos (pilón, fuente, refugio central): si el camino recto pasa por encima, punto de paso por el lado libre
function clObst(){const L=[];if(CLPOST.on)L.push({x:CLPOST.x,z:CLPOST.z,R:CLPOST.r+1.15});if(CL&&CL.env&&CL.env.name==='calle')for(const c of CLCIRC)if(!c.post)L.push({x:c.x,z:c.z,R:c.r+1.75});return L}
function clWp(x,z,tx,tz){const w=clWpBase(x,z,tx,tz);if(!CL||!CL.env)return w;const dx=w[0]-x,dz=w[1]-z,L=Math.hypot(dx,dz);if(L<.5)return w;const ux=dx/L,uz=dz/L;let best=null,bt=1e9;
 for(const o of clObst()){const t=(o.x-x)*ux+(o.z-z)*uz;if(t<-.5||t>L+o.R)continue;const px=x+ux*t,pz=z+uz*t,d=Math.hypot(o.x-px,o.z-pz);if(d<o.R&&t<bt){bt=t;best={o,d,px,pz}}}
 if(!best)return w;const o=best.o;let sx=-uz,sz=ux;const side=(x-o.x)*sx+(z-o.z)*sz;if(Math.abs(side)>.05&&side<0){sx=-sx;sz=-sz}
 // lado preferido (el del toro) y el contrario; gana el que deja pasar el cuerpo entero con más holgura
 const E=CL.env,yaw=Math.atan2(ux,uz),score=sg=>{let sc=0;for(const k of [.4,.1,.8]){const c=[o.x+sx*sg*(o.R+k),o.z+sz*sg*(o.R+k)];if(clBody(E,c[0],c[1],yaw,false))sc+=k===.4?3:1;else if(k===.4)return {sc:-1}}return {sc,c:[o.x+sx*sg*(o.R+.4),o.z+sz*sg*(o.R+.4)]}};
 const A=score(1),B=score(-1);if(A.sc<0&&B.sc<0)return w;return (A.sc>=B.sc?A:B).c}

/* ---------------- BOU EMBOLAT ---------------- */
const EMB_TXT={
 puerta:'Dentro del cajón, los emboladors lazan los cuernos del toro y pasan la soga por la anilla del pilón.',
 arrastre:'Se abre el cajón. Los emboladors tiran de la soga y, a tirones, acercan el toro al pilón.',
 amarre:'El toro queda amarrado al pilón. Le sujetan la cabeza contra el poste.',
 fang:'Le protegen las astas con barro (fang) para que el fuego no le alcance.',
 ferros:'Colocan el armazón de hierro con las bolas de estopa y lo sujetan con correas.',
 foc:'Con la antorcha encienden las bolas. Se apagan las luces de la calle.',
 solta:'¡Tallen la corda! Cortan la soga y los emboladors corren a los cadafales.'};
const EMB_POST={x:0,z:-1}; // en medio de la plaza
function embMan(col){try{return makePerson({gl:1,jacket:col||'#f4f4f0',mangas:false,pants:'#1c1d22',belt:'#c42a2a',boots:'#ececec',hair:pick(['#231812','#3b2a1c','#151010'])})}catch(e){return null}}
function embAnim(P,dt,k,ts,lean){if(!P)return;if(P.gl){P.gl.want=k;P.gl.wts=ts||1;modAnimPerson(P,dt,0)}else{animPerson(P,dt,k==='Idle_Loop'?0:Math.abs(ts||1)*.5)}P.b.rotation.x=lean||0}
function embStart(r){const E=CL.env,sc=CL.sc,add=o=>{CL.add?CL.add(o):sc.add(o);return o},G=geos();
 if(CL.emb){for(const o of CL.emb.objs)sc.remove(o)}
 // el pilón: poste de madera reforzado con anilla, sobre una base de piedra
 for(let i=CLCIRC.length-1;i>=0;i--)if(CLCIRC[i].post)CLCIRC.splice(i,1);CLPOST.on=false;
 const P=EMB_POST,objs=[],post=new THREE.Group();post.position.set(P.x,0,P.z);
 mesh(G.cyl,M('#5a3b22',.85),.2,2.2,.2,0,1.1,0,post);mesh(G.cyl,M('#8a8478',.9),.42,.25,.42,0,.12,0,post);for(const y of [.55,1.55])mesh(G.cyl,M('#2a2a2a',.45,.7),.215,.06,.215,0,y,0,post,true);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.09,.02,8,16),M('#3a3a3a',.4,.8));ring.position.set(0,1,.24);post.add(ring);add(post);objs.push(post);
 // emboladors en fila detrás del pilón, los dos que embolan y el de la antorcha
 const men=[];for(let i=0;i<6;i++){const m=embMan(i%2?'#f4f4f0':'#1e1f24');if(m){add(m.root);objs.push(m.root);men.push({P:m,x:P.x,z:P.z-1.6-i*1.1})}}
 const fit=[0,1].map(i=>{const m=embMan(i?'#c42a2a':'#f4f4f0');if(m){add(m.root);objs.push(m.root)}return m&&{P:m,x:P.x+(i?2.5:-2.5),z:P.z-1.2}}).filter(Boolean);
 const rm=embMan('#1e1f24');if(rm){add(rm.root);objs.push(rm.root)}const rabo=rm&&{P:rm,x:P.x+2.2,z:P.z+4};
 const tm=embMan('#e6bb55');let torch=null,tor=null;if(tm){add(tm.root);objs.push(tm.root);torch=new THREE.Group();mesh(G.cyl,M('#4a2f1c',.9),.03,.75,.03,0,0,0,torch,true);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(.35,.6),new THREE.MeshBasicMaterial({map:fireTex(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));fl.position.y=.55;torch.add(fl);torch.userData.fl=fl;
  const L=new THREE.PointLight('#ff9a3a',1.4,9,1.8);L.position.y=.6;torch.add(L);torch.position.set(.3,1.25,.3);torch.rotation.x=-.35;tm.root.add(torch);tor={P:tm,x:P.x+2.6,z:P.z-2.6}}
 // soga: tramo con física (verlet) del pitón a la anilla y tramo recto por las manos de los emboladors
 const NS=16,nodes=[];for(let i=0;i<=NS;i++)nodes.push({x:P.x,y:1,z:P.z,px:P.x,py:1,pz:P.z});
 const segs=NS+men.length+1,rope=new THREE.InstancedMesh(new THREE.CylinderGeometry(.022,.022,1,6).translate(0,.5,0).rotateX(Math.PI/2),M('#cdb27c',.95),segs);rope.castShadow=true;rope.frustumCulled=false;add(rope);objs.push(rope);
 const e=CL.emb={r,ph:'puerta',t:0,objs,men,fit,tor,rabo,torch,rope,nodes,NS,ring:{x:P.x,y:1,z:P.z+.24},L:0,Ltot:0,mode:'tira',mt:0,ang:0,clay:[],ferros:null,cut:false};
 // la res empieza dentro del cajón, con la soga ya en los cuernos
 r.mode='emb';r.v=0;r.x=E.cajon.x;r.z=E.cajon.z;r.yaw=Math.atan2(P.x-r.x,P.z-r.z);r.fire=null;
 const H=embHorn(r);e.L=Math.hypot(H.x-e.ring.x,H.z-e.ring.z);e.Ltot=e.L+.6;e.L0=e.L;
 for(let i=0;i<=NS;i++){const t=i/NS;const n=nodes[i];n.x=n.px=H.x+(e.ring.x-H.x)*t;n.z=n.pz=H.z+(e.ring.z-H.z)*t;n.y=n.py=1}
 if(CL.door)CL.door.position.y=1.9;
 // luces de la calle (se apagarán al encender las bolas)
 e.lights=[];sc.traverse(o=>{if(o.isPointLight&&o.parent!==torch)e.lights.push([o,o.intensity])});
 sc.traverse(o=>{if(o.isHemisphereLight)e.hemi=[o,o.intensity]});
 $('#h3cap').textContent=EMB_TXT.puerta;$('#h3cap').style.opacity=1;banner('Bou embolat',`${CL.o.pueblo} · ${CL.o.fiesta}`,3)}
// punta de los cuernos (en el mundo)
function embHorn(r){const s=Math.sin(r.yaw),c=Math.cos(r.yaw);return {x:r.x+s*1.15,y:1.05,z:r.z+c*1.15}}
function embPhase(e,ph){e.ph=ph;e.t=0;if(EMB_TXT[ph]){$('#h3cap').textContent=EMB_TXT[ph];$('#h3cap').style.opacity=1}}
function embTick(r,dt){const e=CL.emb,E=CL.env,b=r.b,P=EMB_POST;e.t+=dt;let anim={speed:0,head:.75,toss:0,paw:false,push:false,look:0};
 const ring=e.ring;
 switch(e.ph){
  case 'puerta':{if(e.t>2.2){embPhase(e,'arrastre');if(CL.door)CL.door.position.y=4.2;try{bufido(.5)}catch(x){}}break}
  case 'arrastre':{// a tirones: los emboladors recogen soga; la res resiste y les hace ceder
   e.mt-=dt;if(e.mt<=0){e.mode=e.mode==='tira'?'resiste':'tira';const lejos=e.L>6;e.mt=e.mode==='tira'?(lejos?1.6+Math.random()*1.4:.9+Math.random()*1.3):(lejos?.3+Math.random()*.4:.4+Math.random()*.8);if(e.mode==='resiste'){try{bufido(.35)}catch(x){}if(Math.random()<.5)clCrowd(.3)}}
   // lejos del pilón el toro camina con la soga; cerca se resiste de verdad
   const far=e.L>6,rate=e.mode==='tira'?(far?-2.8:-1.15):(far?.6:1.4);e.L=clamp(e.L+rate*dt,1.15,e.L0+1.2);
   e.ang+=((e.mode==='resiste'?Math.sin(CL.t*1.7)*.45:0)-e.ang)*Math.min(1,dt*1.5);
   anim=e.mode==='tira'?(far?{speed:.7,head:.7,look:Math.sin(CL.t*1.6)*.3}:{speed:.35,head:.85,push:true,look:Math.sin(CL.t*2)*.4}):{speed:0,head:.95,toss:Math.sin(CL.t*9)>.3?.7:0,paw:true,look:Math.sin(CL.t*3)};
   if(e.L<=1.2){embPhase(e,'amarre');clCrowd(.5)}break}
  case 'amarre':{e.L=1.15;anim={speed:0,head:1,toss:Math.sin(CL.t*6)>.6?.6:0,paw:Math.sin(CL.t*1.3)>0,look:Math.sin(CL.t*2.3)*.6};if(e.t>2.2)embPhase(e,'fang');break}
  case 'fang':{e.L=1.15;anim={speed:0,head:1,look:Math.sin(CL.t*1.9)*.35,paw:Math.sin(CL.t*1.1)>.4};
   if(!e.clay.length&&e.t>1.3){for(const s of [1,-1]){const c=mesh(geos().sph,M('#6b4a2e',.95),.01,.01,.01,s*.6,.6,.2,b.hp,true);e.clay.push(c)}}
   for(const c of e.clay){const k=clamp((e.t-1.3)/1.4,0,1)*.12;c.scale.set(k*.9,k*1.3,k*.9)}
   if(e.t>3.2)embPhase(e,'ferros');break}
  case 'ferros':{e.L=1.15;anim={speed:0,head:1,toss:e.t>1&&e.t<1.4?.5:0,look:Math.sin(CL.t*2.1)*.3};
   if(!e.ferros&&e.t>.9){const g=new THREE.Group(),ir=M('#2b2b2b',.45,.7);for(const s of [1,-1]){const rod=mesh(geos().box,ir,.03,.03,.66,s*.31,.52,.22,g,true);rod.rotation.y=s*1.45;mesh(geos().box,ir,.025,.32,.025,s*.6,.75,.2,g,true)}
     mesh(geos().box,M('#3b2a1c',.8),.92,.07,.08,0,.42,.3,g,true);b.hp.add(g);e.ferros=g;e.fireObj=embolar(b);e.fireObj.fires.forEach(f=>f.visible=false);e.fireObj.L.intensity=0;e.fireObj.k=0}
   if(e.t>3)embPhase(e,'foc');break}
  case 'foc':{e.L=1.15;anim={speed:0,head:1,look:Math.sin(CL.t*2.6)*.5,paw:true};const F=e.fireObj;
   if(e.t>2.8&&F){if(!r.fire){r.fire=F;F.fires.forEach(f=>{f.visible=true});try{crowdLevel(.35)}catch(x){}clCrowd(.8)}F.k=Math.min(1,(F.k||0)+dt*.7)}
   // se apagan las luces de la calle
   const d=clamp((e.t-2.8)/2,0,1);for(const [o,i0] of e.lights)o.intensity=i0*(1-.82*d);if(e.hemi)e.hemi[0].intensity=e.hemi[1]*(1-.4*d);
   if(e.t>5.4)embPhase(e,'solta');break}
  case 'solta':{anim={speed:0,head:1,toss:e.t>.6&&e.t<1.1?.9:0,look:Math.sin(CL.t*4)*.8,paw:true};
   if(!e.cut&&e.t>.9){e.cut=true;try{bufido(.8)}catch(x){}ole('¡Solta!');clCrowd(1)}
   if(e.t>1.6){e.ph='libre';CLPOST.on=true;CLPOST.x=EMB_POST.x;CLPOST.z=EMB_POST.z;
    // salida: arranca al galope calle abajo hacia la plaza
    r.salida=CL.t;r.mode='trota';r.t=0;r.tt=0;r.v=2.5;r.trotV=5.6;CL.lowT=CL.t;
    {let best=null;for(let k=0;k<24;k++){const a=Math.random()*6.283,d=7.5+Math.random()*3,x=EMB_POST.x+Math.sin(a)*d,z=EMB_POST.z+Math.cos(a)*d;if(clRectOf(x,z)==='plz'&&clFree(CL.env,x,z,.8,true)&&clLinea(CL.env,r.x,r.z,x,z)){best=[x,z];break}}r.wx=best?best[0]:0;r.wz=best?best[1]:8}$('#h3cap').textContent='El toro embolado corre libre por la plaza. Respeta la distancia y busca los cadafales.'}break}}
 // posición de la res según la soga (tensa mientras está atada)
 if(!e.cut){const H=embHorn(r),d=Math.hypot(H.x-ring.x,H.z-ring.z);void H;
  void d;const a=Math.atan2(E.cajon.x-ring.x,E.cajon.z-ring.z)+e.ang*.8*Math.min(1,3/(e.L+1)),ux=Math.sin(a),uz=Math.cos(a);
  const tx=ring.x+ux*(e.L+1.15),tz=ring.z+uz*(e.L+1.15);const nx=r.x+(tx-r.x)*Math.min(1,dt*6),nz=r.z+(tz-r.z)*Math.min(1,dt*6);
  const fy=Math.atan2(ring.x-nx,ring.z-nz)+e.ang*.5,okp=clBody(E,nx,nz,fy,true);if(okp){r.x=nx;r.z=nz;r.yaw+=angD(r.yaw,fy)*Math.min(1,dt*4)}else{r.yaw+=angD(r.yaw,Math.atan2(ring.x-r.x,ring.z-r.z))*Math.min(1,dt*4)}
  {const H2=embHorn(r),act=Math.hypot(H2.x-ring.x,H2.z-ring.z);if(e.L<act-.3)e.L=act-.3}/* la soga no puede ser más corta que la distancia real */
  if(e.ph==='amarre'||e.ph==='fang'||e.ph==='ferros'||e.ph==='foc'||e.ph==='solta'){r.x+=Math.cos(r.yaw)*Math.sin(CL.t*2.2)*.12*dt*6;r.z-=Math.sin(r.yaw)*Math.sin(CL.t*2.2)*.12*dt*6}}
 b.root.position.set(r.x,0,r.z);b.root.rotation.y=r.yaw;animBull(b,dt,anim);embTail(e,r,dt);
 if(r.fire){const f=(.85+Math.sin(CL.t*23)*.1+Math.random()*.08)*(r.fire.k??1);r.fire.L.intensity=2.1*f;r.fire.fires.forEach(fl=>{fl.scale.set(f,f*(1+Math.random()*.2),1);fl.lookAt(W3.cam.position)})}
 embPeople(e,r,dt);embRope(e,r,dt)}
// emboladors, los que embolan y el de la antorcha
function embPeople(e,r,dt){const P=EMB_POST,ring=e.ring,H=embHorn(r),E=CL.env;
 const lm=Math.min(1.2,Math.max(0,e.Ltot-e.L));/* recogen la soga sin salirse de la plaza */const tira=e.ph==='arrastre'&&e.mode==='tira',resiste=e.ph==='arrastre'&&e.mode==='resiste';
 e.men.forEach((m,i)=>{let tx,tz;if(!e.cut||e.t<2.2&&e.ph!=='libre'){tx=P.x+(i%2?.25:-.25);tz=P.z-1.3-lm-i*.85}else{if(!m.ref){const q=E.nearRef(m.x,m.z);m.ref=[q.x,q.z]}tx=m.ref[0];tz=m.ref[1]}
  const dx=tx-m.x,dz=tz-m.z,d=Math.hypot(dx,dz),run=e.cut;const sp=run?5.2:Math.min(2.2,d*4);if(d>.03){const k=Math.min(d,sp*dt);m.x+=dx/d*k;m.z+=dz/d*k}
  m.P.root.position.set(m.x,0,m.z);if(run&&d>.4)m.P.root.rotation.y=Math.atan2(dx,dz);else m.P.root.rotation.y=Math.atan2(r.x-m.x,r.z-m.z);
  if(run&&d>.4)embAnim(m.P,dt,'Sprint_Loop',1.1,0);else if(tira)embAnim(m.P,dt,'Walk_Loop',-.75,-.32);else if(resiste)embAnim(m.P,dt,'Walk_Loop',.6,-.12);else embAnim(m.P,dt,'Idle_Loop',1,e.cut?0:-.25)});
 // los que embolan: se acercan a la cabeza en el barro y los hierros, y se apartan después
 const s=Math.sin(r.yaw),c=Math.cos(r.yaw),near=e.ph==='fang'||e.ph==='ferros';
 e.fit.forEach((m,i)=>{const sd=i?1:-1;let tx,tz;
  if(near){tx=H.x+c*sd*.75-s*.25;tz=H.z-s*sd*.75-c*.25}else if(e.cut||e.ph==='libre'){if(!m.ref){const q=E.nearRef(m.x,m.z);m.ref=[q.x,q.z]}tx=m.ref[0];tz=m.ref[1]}else{tx=P.x+sd*2.4;tz=P.z+.8}
  const dx=tx-m.x,dz=tz-m.z,d=Math.hypot(dx,dz),sp=e.cut?5:1.6;if(d>.05){const k=Math.min(d,sp*dt);m.x+=dx/d*k;m.z+=dz/d*k}
  m.P.root.position.set(m.x,0,m.z);m.P.root.rotation.y=d>.3?Math.atan2(dx,dz):Math.atan2(H.x-m.x,H.z-m.z);
  embAnim(m.P,dt,d>.3?(e.cut?'Sprint_Loop':'Walk_Loop'):'Idle_Loop',1,d>.3?0:near?.25:0)});
 // la antorcha: se acerca a las bolas, las enciende y se retira
 const t=e.tor;if(t){let tx,tz;if(e.ph==='foc'&&e.t<3.8){tx=H.x+s*.55+c*.55;tz=H.z+c*.55-s*.55}else if(e.ph==='foc'||e.cut||e.ph==='libre'){if(!t.ref){const q=E.nearRef(t.x,t.z);t.ref=[q.x,q.z]}tx=t.ref[0];tz=t.ref[1]}else{tx=P.x+2.6;tz=P.z-2.6}
  const dx=tx-t.x,dz=tz-t.z,d=Math.hypot(dx,dz),sp=(e.ph==='foc'&&e.t>=3.8)||e.cut?4.6:1.8;if(d>.05){const k=Math.min(d,sp*dt);t.x+=dx/d*k;t.z+=dz/d*k}
  t.P.root.position.set(t.x,0,t.z);t.P.root.rotation.y=d>.3?Math.atan2(dx,dz):Math.atan2(H.x-t.x,H.z-t.z);embAnim(t.P,dt,d>.3?(sp>3?'Sprint_Loop':'Walk_Loop'):'Idle_Loop',1,0);
  const tr=e.torch;if(tr){tr.rotation.x=e.ph==='foc'&&d<.4?-1.1:-.35;const fl=tr.userData.fl;fl.lookAt(W3.cam.position);const f=.9+Math.random()*.2;fl.scale.set(f,f,1)}}}
// soga: verlet del pitón a la anilla; recta y tensa por las manos de los emboladors
function embRope(e,r,dt){const N=e.nodes,NS=e.NS,ring=e.ring,H=embHorn(r);const rest=(e.cut?Math.max(e.L,1.4):e.L)/NS*.985,g=9.8*dt*dt;
 for(let i=0;i<=NS;i++){const n=N[i];const vx=(n.x-n.px)*.97,vy=(n.y-n.py)*.97,vz=(n.z-n.pz)*.97;n.px=n.x;n.py=n.y;n.pz=n.z;n.x+=vx;n.y+=vy-g;n.z+=vz;if(n.y<.03){n.y=.03;n.px=n.x-(n.x-n.px)*.5;n.pz=n.z-(n.z-n.pz)*.5}}
 for(let it=0;it<10;it++){if(!e.cut){N[0].x=H.x;N[0].y=H.y;N[0].z=H.z}N[NS].x=ring.x;N[NS].y=ring.y;N[NS].z=ring.z;
  for(let i=0;i<NS;i++){const a=N[i],b=N[i+1],dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,d=Math.hypot(dx,dy,dz)||1e-4,df=(d-rest)/d*.5;
   const pa=i===0&&!e.cut?0:1,pb=i+1===NS?0:1,w=pa+pb||1;a.x+=dx*df*2*pa/w;a.y+=dy*df*2*pa/w;a.z+=dz*df*2*pa/w;b.x-=dx*df*2*pb/w;b.y-=dy*df*2*pb/w;b.z-=dz*df*2*pb/w}}
 // puntos de dibujo: tramo físico + anilla + manos (si aún sujetan)
 const pts=N.map(n=>[n.x,n.y,n.z]);if(!e.cut||e.t<.3)for(const m of e.men)pts.push([m.x+.15,.98,m.z+.25]);else pts.push([ring.x,.03,ring.z-1.2]);
 const R_=e.rope,o=new THREE.Object3D(),seg=pts.length-1;let k=0;
 for(let i=0;i<seg&&k<R_.count;i++,k++){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);o.position.set(a[0],a[1],a[2]);o.lookAt(b[0],b[1],b[2]);o.scale.set(1,1,Math.max(.001,L));o.updateMatrix();R_.setMatrixAt(k,o.matrix)}
 for(;k<R_.count;k++){o.position.set(0,-50,0);o.scale.set(.001,.001,.001);o.updateMatrix();R_.setMatrixAt(k,o.matrix)}R_.instanceMatrix.needsUpdate=true}

/* ---------------- enganches con el juego ---------------- */
// sale la res: si es embolat, empieza el ritual en lugar de salir corriendo con las bolas ya encendidas
if(typeof calleNext==='function'){const _cnE=calleNext;calleNext=function(){_cnE.apply(this,arguments);try{if(CL&&CL.res&&!CL.plaza&&CL.o.tipo==='embolado')embStart(CL.res)}catch(e){console.warn('embolat',e)}}}
// mientras dura el ritual la res la controla la soga
if(typeof resTick==='function'){const _rtE=resTick;resTick=function(r,dt){if(CL&&CL.emb&&CL.emb.r===r&&CL.emb.ph!=='libre'){embTick(r,dt);return}
  if(r.salida){if(Math.hypot(r.x-EMB_POST.x,r.z-EMB_POST.z)>6||CL.t-r.salida>4){r.salida=0;r.trotV=0}else if(r.mode==='trota'||r.mode==='mira'){if(r.mode==='mira'){r.mode='trota'}r.t=0}}
  _rtE(r,dt);if(CL&&CL.emb&&CL.emb.r===r){const e=CL.emb;if(e.cut){embPeople(e,r,dt);embRope(e,r,dt);embTail(e,r,dt)}
   // las bolas se van consumiendo al final
   if(r.fire&&r.dur){const q=r.tt/r.dur;r.fire.k=q<.7?1:clamp(1-(q-.7)/.3*.75,.2,1);if(r.mode==='recogida')r.fire.k=Math.min(r.fire.k,.25)}}}}
// recortadores: durante el ritual miran desde los refugios de la calle
if(typeof npcTick==='function'){const _npE=npcTick;npcTick=function(p,dt){const e=CL&&CL.emb;if(e&&e.ph!=='libre'&&!p.herido){const E=CL.env;
  if(!p.embRef){const i=CL.npc.indexOf(p),q=E.nearRef((i%2?2.9:-2.9),24+i*2.2);p.embRef=[q.x,q.z]}const dx=p.embRef[0]-p.x,dz=p.embRef[1]-p.z,d=Math.hypot(dx,dz);
  if(d>.25){p.vx=dx/d*3.2;p.vz=dz/d*3.2}else{p.vx*=.6;p.vz*=.6}p.st='safe';p.t=2;p.cite=0;return}
 if(p.embRef&&(!e||e.ph==='libre'))p.embRef=null;_npE(p,dt)}}
// cámara: planos cerrados del ritual con la cámara general
if(typeof camCalle==='function'){const _ccE=camCalle;camCalle=function(dt){const e=CL&&CL.emb;if(!e||e.ph==='libre'||CL.cam!=='tv'){_ccE(dt);return}
  const r=e.r,P=EMB_POST,c=W3.cam.position,k=Math.min(1,dt*2.2);let t,l;
  if(e.ph==='puerta'||e.ph==='arrastre'){const lejos=r.z-P.z>9;t=lejos?[2.4,3.4,r.z-7.5]:[5.5,3.2,P.z-5];l=lejos?[0,1.1,r.z+1]:[0,1,(r.z+P.z)/2]}
  else if(e.ph==='amarre'||e.ph==='solta'){t=[2.4,2.3,P.z-3.2];l=[0,1.1,P.z+1.4]}
  else{const H=embHorn(r);t=[clamp(H.x+2.2,-2.7,2.7),1.75,H.z+2];l=[H.x,1.05,H.z]}
  c.x+=(t[0]-c.x)*k;c.y+=(t[1]-c.y)*k;c.z+=(t[2]-c.z)*k;W3.look.set(l[0],l[1],l[2]);W3.cam.lookAt(W3.look)}}
// limpieza
function embClean(){for(let i=CLCIRC.length-1;i>=0;i--)if(CLCIRC[i].post)CLCIRC.splice(i,1);CLPOST.on=false;if(CL)CL.emb=null}
if(typeof salirCalle==='function'){const _scE=salirCalle;salirCalle=function(){embClean();return _scE.apply(this,arguments)}}
if(typeof irCalle==='function'){const _icE=irCalle;irCalle=function(){for(let i=CLCIRC.length-1;i>=0;i--)if(CLCIRC[i].post)CLCIRC.splice(i,1);CLPOST.on=false;return _icE.apply(this,arguments)}}

/* ---------------- el del rabo: sujeta la cola del toro amarrado y tira de ella ---------------- */
const EMB_TQ=new THREE.Quaternion(),EMB_V1=new THREE.Vector3(),EMB_V2=new THREE.Vector3(),EMB_V3=new THREE.Vector3(),EMB_WQ=new THREE.Quaternion(),EMB_PQ=new THREE.Quaternion();
function embTailBones(r){if(r.tail!==undefined)return r.tail;const L=[];for(let i=1;i<=7;i++){const o=r.b.root.getObjectByName('Tail'+i);if(o)L.push(o)}r.tail=L.length>=4?L:null;return r.tail}
// cinemática inversa (CCD) para llevar la punta de la cola a la mano
function embTailIK(bones,target,w){const end=bones[bones.length-1];for(let it=0;it<4;it++)for(let j=bones.length-2;j>=0;j--){const bj=bones[j];bj.updateMatrixWorld(true);
  bj.getWorldPosition(EMB_V1);end.getWorldPosition(EMB_V2);EMB_V2.sub(EMB_V1).normalize();EMB_V3.copy(target).sub(EMB_V1).normalize();
  const a=Math.acos(clamp(EMB_V2.dot(EMB_V3),-1,1));if(a<1e-3)continue;EMB_TQ.setFromUnitVectors(EMB_V2,EMB_V3);const lim=Math.min(a,.35*w);if(lim<a)EMB_TQ.slerp(new THREE.Quaternion(),1-lim/a);
  bj.getWorldQuaternion(EMB_WQ);EMB_WQ.premultiply(EMB_TQ);bj.parent.getWorldQuaternion(EMB_PQ);bj.quaternion.copy(EMB_PQ.invert().multiply(EMB_WQ))}}
function embTail(e,r,dt){const m=e.rabo;if(!m)return;const P=EMB_POST,E=CL.env,s=Math.sin(r.yaw),c=Math.cos(r.yaw),hold=!e.cut&&['amarre','fang','ferros','foc','solta'].includes(e.ph);
 // agarre detrás de la grupa, un poco hacia un lado, con un tirón de vez en cuando
 // la mano, a partir de la base real de la cola: detrás, a un lado y algo más baja (con un tirón de vez en cuando)
 const pull=Math.sin(CL.t*1.3)*.08,tb0=embTailBones(r);let bx=r.x-s*1.0,bz=r.z-c*1.0,by=1.25;if(tb0){r.b.root.updateMatrixWorld(true);tb0[0].getWorldPosition(EMB_V1);bx=EMB_V1.x;bz=EMB_V1.z;by=EMB_V1.y}
 const hx=bx-s*(.38+pull)+c*.26,hz=bz-c*(.38+pull)-s*.26,hy=by-.22;let tx,tz;
 if(hold){tx=hx-s*.42+c*.08;tz=hz-c*.42-s*.08}else if(e.cut||e.ph==='libre'){if(!m.ref){const q=E.nearRef(m.x,m.z);m.ref=[q.x,q.z]}tx=m.ref[0];tz=m.ref[1]}else{tx=P.x+2.3;tz=P.z+4}
 const dx=tx-m.x,dz=tz-m.z,d=Math.hypot(dx,dz),sp=e.cut?5.2:2.4;if(d>.04){const k=Math.min(d,sp*dt);const nx=m.x+dx/d*k,nz=m.z+dz/d*k;if(clFree(E,nx,nz,.25,false)||e.cut){m.x=nx;m.z=nz}else{m.x+=dx/d*k*.3;m.z+=dz/d*k*.3}}
 const near=hold&&d<.35;m.P.root.position.set(m.x,0,m.z);m.P.root.rotation.y=near?Math.atan2(hx-m.x,hz-m.z):d>.3?Math.atan2(dx,dz):Math.atan2(r.x-m.x,r.z-m.z);
 embAnim(m.P,dt,d>.3?(e.cut?'Sprint_Loop':'Walk_Loop'):'Idle_Loop',1,near?-.3:0);
 // la cola va a su mano mientras la sujeta
 const tb=embTailBones(r);if(tb&&near){r.b.root.updateMatrixWorld(true);embTailIK(tb,EMB_V3.set(hx,hy,hz).clone(),1)}}

/* ---------------- encierro: la manada toma las esquinas sin saltos ----------------
   La ruta es una sucesión de tramos rectos; cada res sigue su punto de la ruta con velocidad limitada
   y gira de forma progresiva, en vez de cambiar de dirección y de carril de golpe en cada esquina. */
if(typeof encTick==='function'){const _etE=encTick;encTick=function(dt){_etE(dt);const E=CL&&CL.enc;if(!E)return;
 for(const h of E.herd){const tx=h.x,tz=h.z;if(h.sx==null){h.sx=tx;h.sz=tz;h.syaw=h.b.root.rotation.y}
  const dx=tx-h.sx,dz=tz-h.sz,d=Math.hypot(dx,dz),mx=7.5*dt,k=d>mx?mx/d:1;h.sx+=dx*k;h.sz+=dz*k;
  if(d>.02)h.syaw+=clamp(angD(h.syaw,Math.atan2(dx,dz)),-4.6*dt,4.6*dt);
  h.b.root.position.set(h.sx,0,h.sz);h.b.root.rotation.y=h.syaw;h.x=h.sx;h.z=h.sz}}}

/* ---------------- destinos alcanzables ---------------- */
// camino recto despejado para la res (cada 0,5 m)
function clLinea(E,x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.ceil(L/.5));for(let i=1;i<=n;i++){const t=i/n;if(!clFree(E,x0+(x1-x0)*t,z0+(z1-z0)*t,.7,true))return false}return true}
// los destinos al azar nunca caen dentro de un cadafal, una talanquera o el refugio: siempre donde cabe la res
if(typeof envCalle==='function'){const _ecF=envCalle;envCalle=function(){const E=_ecF.apply(this,arguments),r0=E.rand.bind(E);
 E.rand=()=>{let q=r0();for(let k=0;k<24;k++){if(clFree(E,q.x,q.z,1.0,true))return q;q=r0()}return q};return E}}
