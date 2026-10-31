/* ===================== FESTEJOS CON FORMA PROPIA: bou en corda, bous a la mar y encierro ===================== */
/* ---------- bous a la mar: el final de la calle es el puerto ---------- */
const MAR={x:40};
const _envCalle=envCalle;
envCalle=function(){const E=_envCalle();if(!(CL&&CL.o&&CL.o.tipo==='mar'))return E;
 const w0=E.walk.bind(E),r0=E.refugio.bind(E),n0=E.nearRef.bind(E);
 E.walk=(p,vaca)=>{if(vaca&&p.x>MAR.x-.3&&Math.abs(p.z)<4)return false;return w0(p,vaca)};
 E.refugio=(x,z)=>r0(x,z)||(x>MAR.x+.4&&Math.abs(z)<4);
 E.nearRef=(x,z)=>{const b=n0(x,z),dw=Math.abs(x-(MAR.x+1.2))+Math.max(0,Math.abs(z)-3.5);return dw<b.d&&x>14?{x:MAR.x+1.2,z:clamp(z,-3,3),d:dw}:b};return E};
function marBuild(){const sc=CL.sc,G=geos();const geo=new THREE.PlaneGeometry(26,8,26,8);const m=new THREE.MeshStandardMaterial({color:'#1d6f8c',roughness:.12,metalness:.25,transparent:true,opacity:.92});
 const w=new THREE.Mesh(geo,m);w.rotation.x=-Math.PI/2;w.position.set(MAR.x+13,.05,0);w.receiveShadow=true;sc.add(w);CL.water=w;CL.wbase=geo.attributes.position.array.slice();
 mesh(G.box,M('#b9ad98',.9),.6,.35,8,MAR.x,.17,0,sc);for(let z=-3.5;z<=3.5;z+=1.75)mesh(G.cyl,M('#3b3b3b',.6,.4),.12,.4,.12,MAR.x-.2,.4,z,sc,true);
 const boat=new THREE.Group();boat.position.set(MAR.x+9,.1,2);sc.add(boat);mesh(G.box,M('#f1ece0',.6),1.4,.5,3.6,0,.2,0,boat);mesh(G.box,M('#2b5aa0',.6),1.45,.12,3.65,0,.42,0,boat,true);const rem=makePerson({jacket:'#e6bb55',pants:'#20242c',hat:null});rem.root.position.set(0,-.2,.6);rem.root.scale.setScalar(.95);boat.add(rem.root);seat(rem);CL.boat=boat;
 CL.splash=[];for(let i=0;i<30;i++){const s=mesh(G.sph,new THREE.MeshBasicMaterial({color:'#e8f6ff',transparent:true,opacity:.8}),.12,.12,.12,0,-9,0,sc,true);CL.splash.push({m:s,l:0})}}
function splash(x,z,n){for(let i=0;i<(n||14);i++){const s=CL.splash.find(q=>q.l<=0)||CL.splash[i%CL.splash.length];s.m.position.set(x+R(-.6,.6),.2,z+R(-.6,.6));s.vx=R(-2,2);s.vy=R(2.5,5);s.vz=R(-2,2);s.l=1}try{const c=AU.ctx;if(c){const t=c.currentTime,src=c.createBufferSource();src.buffer=AU.noise;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=1400;const g=c.createGain();g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.0001,t+.9);src.connect(f);f.connect(g);g.connect(AU.master);src.start(t);src.stop(t+1)}}catch(e){}}
function marTick(dt){if(!CL.water)return;const t=CL.t,p=CL.water.geometry.attributes.position,b=CL.wbase;for(let i=0;i<p.count;i++){const x=b[i*3],y=b[i*3+1];p.array[i*3+2]=Math.sin(x*.8+t*1.6)*.06+Math.cos(y*1.3+t*1.1)*.05}p.needsUpdate=true;
 if(CL.boat){CL.boat.position.y=.1+Math.sin(t*1.3)*.05;CL.boat.rotation.z=Math.sin(t*.9)*.05}
 for(const s of CL.splash){if(s.l<=0)continue;s.l-=dt*1.4;s.vy-=9.8*dt;s.m.position.x+=s.vx*dt;s.m.position.y=Math.max(.05,s.m.position.y+s.vy*dt);s.m.position.z+=s.vz*dt;s.m.material.opacity=Math.max(0,s.l*.8);if(s.l<=0)s.m.position.y=-9}
 for(const p2 of CL.ppl){const inW=p2.x>MAR.x+.4&&Math.abs(p2.z)<4;if(inW&&!p2.agua){p2.agua=1;splash(p2.x,p2.z,10);if(!p2.me&&Math.random()<.5)ole('¡Al agua!')}else if(!inW&&p2.agua)p2.agua=0;if(p2.agua&&p2.toss<=0)p2.m.root.position.y=-1.15+Math.sin(t*3+p2.x)*.05}
 const r=CL.res;if(!r)return;
 if(r.mode==='mira'||r.mode==='trota')r.marRoll=0;
 if(r.mode==='remata'&&!r.marRoll&&r.x>MAR.x-11&&Math.abs(r.z)<4&&Math.sin(r.yaw)>.5){r.marRoll=1;if(Math.random()<.45+r.a.g.bra/220){r.mode='alMar';r.myaw=r.yaw}}
 if(r.mode==='alMar'){r.v=0;r.yaw=r.myaw;r.x+=Math.sin(r.yaw)*6.2*dt;r.z+=Math.cos(r.yaw)*6.2*dt;r.b.root.position.set(r.x,0,r.z);r.b.root.rotation.y=r.yaw;animBull(r.b,dt,{speed:1.2,head:.6});if(r.x>MAR.x-.3){r.mode='embiste';r.v=6}}
 if(r.mode==='nada'){r.t2=(r.t2||0)+dt;r.v=1;const tx=MAR.x-.6;r.yaw+=angD(r.yaw,Math.atan2(tx-r.x,0-r.z))*Math.min(1,dt*2);r.x+=Math.sin(r.yaw)*dt*.9;r.z+=Math.cos(r.yaw)*dt*.9;r.b.root.position.set(r.x,-.75,r.z);if(CL.boat){CL.boat.position.x+=(r.x+2-CL.boat.position.x)*dt*.6;CL.boat.position.z+=(r.z+1.6-CL.boat.position.z)*dt*.6}
  if(r.x<MAR.x+.2||r.t2>9){r.x=MAR.x-1.2;r.mode='mira';r.t=0;r.v=0;r.t2=0;r.b.root.position.y=0;$('#h3cap').textContent=`${r.a.name} sale del agua chorreando: ¡ovación en el puerto!`}}
 else if((r.mode==='embiste'||r.mode==='pasa')&&r.v>3&&r.x>MAR.x-.9&&Math.abs(r.z)<4&&Math.sin(r.yaw)>.5){r.mode='nada';r.x=MAR.x+1.2;r.t2=0;r.st.rem+=2;r.st.mar=(r.st.mar||0)+1;splash(r.x,r.z,26);clCrowd(1);ole('¡AL AGUA!');shake&&shake(.3);$('#h3cap').textContent=`¡${r.a.name} se tira al mar persiguiendo al recortador! La barca la guía de vuelta al muelle.`}}

/* ---------- bou en corda: el toro atado y los cordeleros sujetando ---------- */
function cordaBuild(){const sc=CL.sc;CL.cord=[];const cols=['#f4f2ee','#c42a2a','#f4f2ee','#c42a2a','#f4f2ee','#c42a2a'];
 for(let i=0;i<6;i++){const p=makePerson({jacket:cols[i],pants:'#20242c',belt:'#c42a2a',boots:'#ececec'});sc.add(p.root);CL.added&&CL.added.push(p.root);CL.cord.push({m:p,x:0,z:30+i*1.1,yaw:Math.PI})}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(20*3),3));const line=new THREE.Line(g,new THREE.LineBasicMaterial({color:'#d8c08a'}));line.frustumCulled=false;sc.add(line);CL.added&&CL.added.push(line);CL.rope=line;CL.ropeL=15}
function cordaTick(dt){const r=CL.res;if(!r||!CL.cord)return;const C0=CL.cord[0];const dx=r.x-C0.x,dz=r.z-C0.z,d=Math.hypot(dx,dz)||1;
 // los cordeleros siguen al toro guardando la soga; si se aleja demasiado, tiran y lo frenan
 if(d>CL.ropeL*.65){const sp=Math.min(4.5,(d-CL.ropeL*.65)*2);C0.x+=dx/d*sp*dt;C0.z+=dz/d*sp*dt}
 if(d>CL.ropeL&&r.mode!=='recogida'&&r.mode!=='sale'){r.x=C0.x+dx/d*CL.ropeL;r.z=C0.z+dz/d*CL.ropeL;r.v*=.6;if(r.mode==='embiste'&&Math.random()<dt*3){r.mode='mira';r.t=0;$('#h3cap').textContent='Los cordeleros tiran de la soga y frenan la arrancada.'}}
 let px=C0.x,pz=C0.z;CL.cord.forEach((c,i)=>{if(i>0){const ex=px-c.x,ez=pz-c.z,el=Math.hypot(ex,ez)||1;if(el>1.1){c.x+=ex/el*(el-1.1);c.z+=ez/el*(el-1.1)}}c.yaw=Math.atan2(r.x-c.x,r.z-c.z);px=c.x;pz=c.z;
  c.m.root.position.set(c.x,0,c.z);c.m.root.rotation.y=c.yaw;const ar=c.m.arms;ar[0].lock=ar[1].lock=1;ar[0].sh.rotation.set(-1.2,0,.2);ar[1].sh.rotation.set(-1.2,0,-.2);c.m.root.rotation.x=d>CL.ropeL*.9?-.18:0;animPerson(c.m,dt,d>CL.ropeL*.65?.8:0)});
 r.b.hp.updateMatrixWorld(true);const h=new THREE.Vector3(0,.1,.2).applyMatrix4(r.b.hp.matrixWorld);const pos=CL.rope.geometry.attributes.position.array;const n=20,tail=CL.cord[CL.cord.length-1];
 const sag=Math.max(0,1-d/CL.ropeL);for(let i=0;i<n;i++){const u=i/(n-1);let x,z,y;if(u<.7){const v=u/.7;x=lerp(h.x,C0.x,v);z=lerp(h.z,C0.z,v);y=lerp(h.y,1.05,v)-Math.sin(v*Math.PI)*sag*1.2}else{const v=(u-.7)/.3;x=lerp(C0.x,tail.x,v);z=lerp(C0.z,tail.z,v);y=1.05}pos[i*3]=x;pos[i*3+1]=Math.max(.03,y);pos[i*3+2]=z}
 CL.rope.geometry.attributes.position.needsUpdate=true}

/* ---------- encierro: la manada corre del cajón al corral y tú delante ---------- */
const ENC_PATH=[[0,40],[0,12],[0,2],[12,0],[30,0],[57,0]];
function encBuild(){const an=CL.an.map(cById).filter(a=>a&&a.tipo!=='cabestro');CL.enc={t:0,s:0,herd:[],done:false,lead:0,cerca:0};
 an.forEach((a,i)=>{const b=makeBull({pelo:a.pelo,kind:'toro',m:cMorf(a)});CL.add(b.root);CL.enc.herd.push({a,b,off:R(-1.8,1.8),lag:i*1.4+R(0,.8),s:0,st:{emb:0,rem:0,par:0,qui:0,dist:0}})});
 for(let i=0;i<2;i++){const b=makeBull({pelo:i?'berrendo en colorado':'berrendo en negro',kind:'cabestro'});CL.add(b.root);CL.enc.herd.push({cab:1,b,off:i?1.5:-1.5,lag:2+i*1.5,s:0})}
 let L=0;CL.enc.seg=[];for(let i=1;i<ENC_PATH.length;i++){const [x0,z0]=ENC_PATH[i-1],[x1,z1]=ENC_PATH[i],l=Math.hypot(x1-x0,z1-z0);CL.enc.seg.push({x0,z0,x1,z1,l,L0:L});L+=l}CL.enc.L=L;
 CL.ppl.forEach((p,i)=>{if(p.me)return;const q=encAt(R(14,30));p.x=q.x+R(-2,2);p.z=q.z+R(-2,2);p.encOff=R(-2.5,2.5)});
 const q=encAt(10);CL.me.x=q.x+.5;CL.me.z=q.z;$('#h3toro').textContent='Encierro';
 if(CL.door)CL.door.position.y=4.2;banner('¡Cohete!','Sale la manada del cajón',2.4);try{bufido(.6)}catch(e){}
 $('#h3cap').textContent='¡Sale la manada! Los mozos corren delante de los toros por la calle, cruzan la plaza y llegan al corral.'}
function encAt(s){const E=CL.enc;s=clamp(s,0,E.L);for(const g of E.seg){if(s<=g.L0+g.l){const u=(s-g.L0)/g.l;return {x:lerp(g.x0,g.x1,u),z:lerp(g.z0,g.z1,u),yaw:Math.atan2(g.x1-g.x0,g.z1-g.z0)}}}const g=E.seg[E.seg.length-1];return {x:g.x1,z:g.z1,yaw:Math.atan2(g.x1-g.x0,g.z1-g.z0)}}
function encTick(dt){const E=CL.enc;E.t+=dt;const v=E.t<1.2?3:5.2;E.s+=v*dt;
 let leadS=0;for(const h of E.herd){h.s=Math.max(0,E.s-h.lag);const q=encAt(h.s),px=-Math.cos(q.yaw),pz=Math.sin(q.yaw);const x=q.x+px*h.off*Math.min(1,h.s/6),z=q.z+pz*h.off*Math.min(1,h.s/6);h.x=x;h.z=z;
  h.b.root.position.set(x,0,z);h.b.root.rotation.y=q.yaw;animBull(h.b,dt,{speed:h.s<E.L?1.2:0,head:.5});if(!h.cab){leadS=Math.max(leadS,h.s);if(h.st)h.st.dist=h.s}if(h.s<E.L&&Math.random()<dt*4)dust(CL.D,x,0,z,.35)}
 E.lead=leadS;
 for(const p of CL.ppl){if(p.toss>0)continue;let ps=null;if(!p.me){const target=leadS+R(2,7);const q=encAt(target);const ex=q.x+(-Math.cos(q.yaw))*(p.encOff||0)-p.x,ez=q.z+Math.sin(q.yaw)*(p.encOff||0)-p.z,el=Math.hypot(ex,ez)||1;const sp=Math.min(7,el*1.8);p.vx=ex/el*sp;p.vz=ez/el*sp}
  for(const h of E.herd){if(h.cab)continue;const d=Math.hypot(p.x-h.x,p.z-h.z);if(d<.9&&h.s<E.L){clToss(p);if(h.st)h.st.emb++;break}
   if(p.me&&d<3.2&&d>.9){const ahead=(p.x-h.x)*Math.sin(encAt(h.s).yaw)+(p.z-h.z)*Math.cos(encAt(h.s).yaw)>0;if(ahead){E.cerca+=dt;CL.pts+=Math.round(dt*30);if(Math.random()<dt*.8)ole(pick(['¡Qué carrera!','¡En las astas!','¡Olé!']))}}}}
 if(leadS>=E.L-.5&&!E.done){E.done=true;E.fin=E.t;banner('Manada en el corral',`${E.cerca.toFixed(1)} s corriendo en las astas`,3);clCrowd(1)}
 if(E.done&&E.t-E.fin>3.2){for(const h of E.herd){if(h.cab)continue;CL.ev.luc[h.a.id]=Math.round(clamp(62+h.a.g.bra*.15+h.a.g.fue*.12-h.st.par*2+R(-5,5),40,96))}CL.i=1e9;calleFin()}}
/* ---------- enganche con el modo calle ---------- */
const _irCalle=irCalle;
irCalle=function(id){const o=S.corro&&S.corro.of.find(x=>x.id===id);_irCalle(id);if(!CL||!o)return;
 if(o.tipo==='mar'){marBuild();$('#h3cap').textContent='Bous a la mar: los recortadores se lanzan al agua del puerto… y si la vaca los persigue, ¡puede acabar en el mar!'}
 if(o.tipo==='corda'){cordaBuild();$('#h3cap').textContent='Bou en corda: el toro sale atado con la soga y los cordeleros lo sujetan.'}
 if(o.tipo==='encierro'){if(CL.res){CL.sc.remove(CL.res.b.root);CL.res=null}encBuild()}};
const _calleNextE=calleNext;calleNext=function(){if(CL&&CL.enc)return;return _calleNextE.apply(this,arguments)};
const _calleTickE=calleTick;
calleTick=function(dt){if(CL&&CL.enc&&!CL.done){CL.t+=dt;const me=CL.me;let jx=W3.jx,jy=W3.jy;const k=W3.keys;if(k['w']||k['arrowup'])jy=1;if(k['s']||k['arrowdown'])jy=-1;if(k['a']||k['arrowleft'])jx=-1;if(k['d']||k['arrowright'])jx=1;
  if(!CL.spect&&me.toss<=0){const L=Math.min(1,Math.hypot(jx,jy));if(L>.08){const fx=-Math.sin(W3.yaw),fz=-Math.cos(W3.yaw);const mx=fx*jy-fz*jx,mz=fz*jy+fx*jx,ml=Math.hypot(mx,mz)||1;const v=(W3.run?7.1:3.6)*L;me.vx=mx/ml*v;me.vz=mz/ml*v}else{me.vx*=.85;me.vz*=.85}}
  encTick(dt);const E=CL.env;
  for(const p of CL.ppl){if(p.toss>0){p.toss-=dt;const ph=2.2-p.toss;if(ph<.7){p.x+=p.tv.x*dt;p.z+=p.tv.z*dt}}else{const nx=p.x+p.vx*dt,nz=p.z+p.vz*dt;if(E.walk({x:nx,z:nz},false)){p.x=nx;p.z=nz}else if(E.walk({x:nx,z:p.z},false))p.x=nx;else if(E.walk({x:p.x,z:nz},false))p.z=nz}
   const m=p.m,sp=Math.hypot(p.vx,p.vz);m.root.position.set(p.x,0,p.z);if(p.toss>0){const ph=2.2-p.toss;m.root.position.y=ph<.7?Math.sin(ph/.7*Math.PI)*1.8:.12;m.root.rotation.x=ph<1.7?-Math.PI/2:0}else{m.root.rotation.x=0;if(sp>.3)p.yaw+=angD(p.yaw,Math.atan2(p.vx,p.vz))*Math.min(1,dt*10);m.root.rotation.y=p.yaw;m.arms[0].lock=m.arms[1].lock=0;animPerson(m,dt,Math.min(1.5,sp/4))}m.root.visible=!(p===me&&CL.spect)}
  crowdPose(.25+(CL.cheer||0),CL.t);dustTick(CL.D,dt);if(CL.cheer>0)CL.cheer=Math.max(0,CL.cheer-dt*.35);
  const ld=CL.enc.herd[0];if(ld){CL.res={a:ld.a,b:ld.b,x:ld.x,z:ld.z,yaw:encAt(ld.s).yaw,mode:'enc',st:ld.st,v:6,tt:0,dur:999}}
  if(CL.t%0.2<dt)tvMap();if(CL.t%0.5<dt)$('#clres').textContent=`Encierro · ${Math.round(CL.enc.lead)} / ${Math.round(CL.enc.L)} m`;
  camCalle(dt);return}
 _calleTickE(dt);if(!CL)return;if(CL.water)marTick(dt);if(CL.cord&&CL.res)cordaTick(dt)};
