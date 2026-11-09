/* ===================== FIESTA DE PUEBLO: cadafales de madera, peñas y público realista =====================
   - Cadafales como los de verdad: postes y vigas de madera con cruces, tarima de tablones, barandilla, escalera,
     gradas con sillas de plástico, toldo de lona a rayas con fleco y la pancarta de la peña. De noche, bombillas.
   - Cada cadafal es de una peña: la mayoría lleva su camiseta y muchos el pañuelo rojo al cuello.
   - Público realista (js/publico.js) en cadafales, balcones, barreras, escalinata de la iglesia y talanqueras:
     miran a la res, se levantan y levantan los brazos con los recortes y aplauden.
   - Cohete al abrir el cajón: silbido, estampido y humo en el cielo. */
const PB={coet:[],t:0};
const PENYAS=[['Penya El Trago','#2e7d32'],['Penya La Bota','#b71c1c'],['Penya Els Bous','#283593'],["Penya L'Embolic",'#6a1b9a'],['Penya La Traca','#e65100'],['Penya Els Xiquets','#00838f'],['Penya El Cànter','#5d4037'],['Penya La Juerga','#ad1457'],['Penya El Rebombori','#1b5e20'],['Penya Els Fadrins','#0d47a1']];
const LONAS=[['#f2efe6','#b3261e'],['#f2efe6','#1e6b3a'],['#f2efe6','#1f4e8c'],['#f6e7a8','#c0392b'],['#f2efe6','#d9822b']];
const PBX={};
function pbCv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]}
function pbMadera(){if(PBX.mad)return PBX.mad;const [cv,c]=pbCv(256,256),r=mulberry(41);c.fillStyle='#8a6440';c.fillRect(0,0,256,256);
 for(let i=0;i<8;i++){const y=i*32,t=.85+r()*.3;c.fillStyle=`rgb(${Math.round(138*t)},${Math.round(100*t)},${Math.round(64*t)})`;c.fillRect(0,y,256,31);
  for(let k=0;k<26;k++){c.strokeStyle=`rgba(${r()<.5?'60,40,20':'190,150,100'},${.08+r()*.12})`;c.lineWidth=.6+r()*1.2;c.beginPath();const yy=y+r()*30;c.moveTo(0,yy);for(let x=0;x<=256;x+=32)c.lineTo(x,yy+Math.sin(x*.05+k)*1.5);c.stroke()}
  c.fillStyle='rgba(30,18,8,.55)';c.fillRect(0,y+30,256,2);for(let k=0;k<3;k++){c.fillStyle='rgba(50,30,15,.35)';c.beginPath();c.ellipse(r()*256,y+8+r()*16,3+r()*4,1.5+r()*2,0,0,6.28);c.fill()}
  c.fillStyle='rgba(40,40,40,.6)';for(const x of [10+r()*20,226-r()*20]){c.beginPath();c.arc(x,y+10,1.4,0,6.28);c.arc(x,y+21,1.4,0,6.28);c.fill()}}
 const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return PBX.mad=t}
function pbLona(a,b,fleco){const k='l'+a+b+(fleco?1:0);if(PBX[k])return PBX[k];const [cv,c]=pbCv(256,fleco?64:256);
 for(let i=0;i<8;i++){c.fillStyle=i%2?b:a;c.fillRect(i*32,0,32,cv.height)}
 c.fillStyle='rgba(0,0,0,.06)';for(let y=0;y<cv.height;y+=3)c.fillRect(0,y,256,1);
 if(fleco){c.globalCompositeOperation='destination-out';for(let i=0;i<16;i++){c.beginPath();c.arc(i*16+8,64,9,0,6.28);c.fill()}c.globalCompositeOperation='source-over'}
 const t=new THREE.CanvasTexture(cv);t.wrapS=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return PBX[k]=t}
function pbPancarta(nom,col){const [cv,c]=pbCv(512,96);c.fillStyle='#f4efe2';c.fillRect(0,0,512,96);c.fillStyle=col;c.fillRect(6,6,500,84);
 c.strokeStyle='#f4efe2';c.lineWidth=3;c.strokeRect(14,14,484,68);c.fillStyle='#ffffff';c.font='bold 46px "Barlow Condensed","Arial Narrow",sans-serif';c.textAlign='center';c.textBaseline='middle';
 c.fillText(nom.toUpperCase(),256,50,460);c.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<40;i++)c.fillRect(Math.random()*512,Math.random()*96,2,1);
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;return t}
function pbSilla(){if(PBX.silla)return PBX.silla;const parts=[];const bx=(sx,sy,sz,x,y,z,rx)=>{const g=new THREE.BoxGeometry(sx,sy,sz);if(rx)g.rotateX(rx);g.translate(x,y,z);parts.push(g)};
 bx(.44,.035,.42,0,.43,0);bx(.44,.36,.03,0,.66,-.2,-.12);for(const sx of [-.19,.19])for(const sz of [-.17,.17])bx(.035,.43,.035,sx,.215,sz);
 bx(.03,.2,.03,-.2,.55,-.03);bx(.03,.2,.03,.2,.55,-.03);
 return PBX.silla=THREE.BufferGeometryUtils.mergeBufferGeometries(parts.map(g=>g.toNonIndexed()))}

/* ---------- un cadafal ---------- */
function pbCadafal(sc,rf,i,night,seats,sillas){const w=rf.x1-rf.x0,d=rf.z1-rf.z0,cx=(rf.x0+rf.x1)/2,cz=(rf.z0+rf.z1)/2;
 let L,D,px,pz,th;if(w>d){L=w;D=d;px=cx;if(cz>0){pz=rf.z0;th=Math.PI}else{pz=rf.z1;th=0}}else{L=d;D=w;pz=cz;if(cx>0){px=rf.x0;th=-Math.PI/2}else{px=rf.x1;th=Math.PI/2}}
 const H=2.1,g=new THREE.Group();g.position.set(px,0,pz);g.rotation.y=th;sc.add(g);
 const [pena,pcol]=PENYAS[(i*3+((typeof locSeed==='function'?locSeed():0)|0))%PENYAS.length];const lona=LONAS[(i+1)%LONAS.length];
 const est=[],tab=[],bar=[];const bx=(arr,sx,sy,sz,x,y,z,rx,rz)=>{const q=new THREE.BoxGeometry(sx,sy,sz);if(rx)q.rotateX(rx);if(rz)q.rotateZ(rz);q.translate(x,y,z);arr.push(q.toNonIndexed())};
 // postes: delante llegan a la barandilla, detrás a la tarima
 const nP=Math.max(2,Math.ceil(L/1.5)),xs=[];for(let k=0;k<=nP;k++)xs.push(-L/2+.08+(L-.16)*k/nP);
 for(const x of xs){bx(est,.13,H+1.02,.13,x,(H+1.02)/2,-.08);bx(est,.13,H,.13,x,H/2,-D+.08)}
 // vigas y viguetas bajo la tarima
 bx(est,L,.18,.12,0,H-.13,-.08);bx(est,L,.18,.12,0,H-.13,-D+.08);for(const x of xs)bx(est,.1,.14,D,x,H-.13,-D/2);
 // cruces de San Andrés delante y en los lados
 for(let k=0;k<nP;k++){const x0=xs[k],x1=xs[k+1],bw=x1-x0,hh=H-.55,a=Math.atan2(hh,bw),len=Math.hypot(bw,hh);
  bx(est,len,.07,.05,(x0+x1)/2,.3+hh/2,-.02,0,a);bx(est,len,.07,.05,(x0+x1)/2,.3+hh/2,-.02,0,-a)}
 for(const sx of [-1,1]){const x=sx*(L/2-.08),hh=H-.55,a=Math.atan2(hh,D-.16),len=Math.hypot(D-.16,hh);const q=new THREE.BoxGeometry(.05,.07,len);q.rotateX(a);q.translate(x+sx*.03,.3+hh/2,-D/2);est.push(q.toNonIndexed());const q2=new THREE.BoxGeometry(.05,.07,len);q2.rotateX(-a);q2.translate(x+sx*.03,.3+hh/2,-D/2);est.push(q2.toNonIndexed())}
 // tarima de tablones y grada trasera
 bx(tab,L+.12,.07,D+.06,0,H,-D/2);const grada=D>2.4;if(grada){bx(tab,L-.2,.32,D*.42,0,H+.19,-D+D*.21);bx(tab,L-.2,.04,.06,0,H+.36,-D+D*.42)}
 bx(tab,L,.32,.04,0,H-.12,.0);  // faldón delantero
 // barandilla: pasamanos, larguero intermedio y laterales
 bx(bar,L,.07,.08,0,H+1.0,-.08);bx(bar,L,.05,.04,0,H+.52,-.06);for(const sx of [-1,1]){bx(bar,.07,.07,D,sx*(L/2-.06),H+1.0,-D/2);bx(bar,.04,.05,D,sx*(L/2-.06),H+.52,-D/2);bx(est,.12,1.02,.12,sx*(L/2-.08),H+.51,-D+.08)}
 const madera=pbMadera();
 const mEst=new THREE.MeshStandardMaterial({map:madera,color:'#c9b49a',roughness:.88}),mTab=new THREE.MeshStandardMaterial({map:madera,color:'#e8d6bc',roughness:.85}),mBar=new THREE.MeshStandardMaterial({map:madera,color:'#b08f70',roughness:.7});
 for(const [arr,m] of [[est,mEst],[tab,mTab],[bar,mBar]]){const geo=THREE.BufferGeometryUtils.mergeBufferGeometries(arr);const ms=new THREE.Mesh(geo,m);ms.castShadow=true;ms.receiveShadow=true;g.add(ms)}
 // escalera en un lado
 {const sx=1,x=sx*(L/2+.22),lad=[];bx(lad,.06,H+.9,.06,x,(H+.9)/2-.1,-D+.35);bx(lad,.06,H+.9,.06,x,(H+.9)/2-.1,-D+.85);for(let y=.3;y<H;y+=.3)bx(lad,.05,.04,.5,x,y,-D+.6);
  const ms=new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(lad),mBar);ms.castShadow=true;g.add(ms)}
 // pancarta de la peña colgada de la barandilla
 {const ph=Math.min(.5,L*.09),pw=ph*512/96,pan=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),new THREE.MeshStandardMaterial({map:pbPancarta(pena,pcol),roughness:.85,side:THREE.DoubleSide}));pan.position.set(0,H+.5,.02);g.add(pan)}
 // toldo de lona a rayas con fleco, sobre palos finos
 {const yF=H+2.45,yB=H+2.15,aw=L+.3,ad=D+.35;const lt=pbLona(lona[0],lona[1],false).clone();lt.needsUpdate=true;lt.repeat.set(aw/2.2,1);
  const top=new THREE.Mesh(new THREE.PlaneGeometry(aw,Math.hypot(ad,yF-yB)),new THREE.MeshStandardMaterial({map:lt,roughness:.9,side:THREE.DoubleSide}));top.rotation.x=-Math.PI/2+Math.atan2(yF-yB,ad);top.position.set(0,(yF+yB)/2,-D/2+.1);top.castShadow=true;top.receiveShadow=true;g.add(top);
  const ft=pbLona(lona[0],lona[1],true).clone();ft.needsUpdate=true;ft.repeat.set(aw/2.2,1);const fr=new THREE.Mesh(new THREE.PlaneGeometry(aw,.3),new THREE.MeshStandardMaterial({map:ft,transparent:true,alphaTest:.5,roughness:.9,side:THREE.DoubleSide}));fr.position.set(0,yF-.15,.27);g.add(fr);
  const pal=[];const np=Math.max(2,Math.ceil(L/3));for(let k=0;k<=np;k++){const x=-L/2+.05+(L-.1)*k/np;bx(pal,.06,yF-H-1.0,.06,x,H+1.0+(yF-H-1.0)/2,-.08);bx(pal,.06,yB-H,.06,x,H+(yB-H)/2,-D+.1)}
  const ms=new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(pal),new THREE.MeshStandardMaterial({color:'#8d8d86',metalness:.5,roughness:.45}));ms.castShadow=true;g.add(ms);
  if(night){const n=Math.floor(aw/.45),bulbs=new THREE.InstancedMesh(new THREE.SphereGeometry(.05,6,4),new THREE.MeshBasicMaterial({color:'#ffd88a'}),n),o=new THREE.Object3D();for(let k=0;k<n;k++){o.position.set(-aw/2+(k+.5)*aw/n,yF-.34-Math.sin((k%6)/6*Math.PI)*.1,.3);o.updateMatrix();bulbs.setMatrixAt(k,o.matrix)}g.add(bulbs);
   const pl=new THREE.PointLight('#ffcf85',.8,9,1.8);pl.position.set(0,H+1.9,-D/2);g.add(pl)}}
 // asientos: filas de sillas mirando a la calle; la última sube a la grada
 g.updateMatrixWorld(true);const rows=grada?[[-.55,H+.04],[-1.3,H+.04],[-D+.6,H+.36]]:[[-.55,H+.04],[-1.35,H+.04]];const v=new THREE.Vector3();const rr=mulberry(i*97+13);
 rows.forEach(([z,y],ri)=>{const n=Math.floor((L-.5)/.56);for(let k=0;k<n;k++){if(rr()<.12)continue;const x=-L/2+.3+(k+.5)*(L-.6)/n+(rr()-.5)*.06;v.set(x,y,z).applyMatrix4(g.matrixWorld);
  const yaw=th+(rr()-.5)*.35;sillas.push([v.x,y,v.z,yaw]);seats.push({x:v.x,y:y+.45,z:v.z,yaw,sit:true,sol:!night,grupo:rr()<.7?pcol:null,nino:rr()<.08})}});
 // algunos de pie apoyados en la barandilla
 for(let k=0;k<Math.floor(L/2.2);k++){v.set(-L/2+.6+rr()*(L-1.2),H+.04,-.3).applyMatrix4(g.matrixWorld);seats.push({x:v.x,y:H+.04,z:v.z,yaw:th+(rr()-.5)*.6,sit:false,sol:!night,grupo:rr()<.6?pcol:null})}
 return g}

function pbCadafales(sc,night){PB.seats=[];PB.sillas=[];CLREF.filter(q=>q.cad).forEach((rf,i)=>pbCadafal(sc,rf,i,night,PB.seats,PB.sillas))}

/* ---------- público de toda la calle ---------- */
function pbPublico(sc,night){const seats=(PB.seats||[]).slice();
 for(const c of CL.crowd){if(!Array.isArray(c))continue;const sit=!!c[4];
  // balcones: de pie, asomados; escalinata y bordillos: sentados
  const balcon=c[1]>2.5;seats.push({x:c[0],y:balcon?c[1]-.04:sit?c[1]+.42:c[1],z:c[2],yaw:c[3],sit:balcon?false:sit,sol:!night,nino:!balcon&&Math.random()<.1})}
 const P=Publico.crear(seats,{sentado:true,paleta:'pueblo',celda:10,rnd:mulberry(((S&&S.corro&&S.corro.name)||'x').length*7+3)});sc.add(P.grupo);CL.pub=P;
 if(PB.sillas.length){const im=new THREE.InstancedMesh(pbSilla(),new THREE.MeshStandardMaterial({color:'#f1f0ea',roughness:.45}),PB.sillas.length),o=new THREE.Object3D();
  PB.sillas.forEach((s,k)=>{o.position.set(s[0],s[1],s[2]);o.rotation.set(0,s[3],0);o.updateMatrix();im.setMatrixAt(k,o.matrix)});im.castShadow=true;im.receiveShadow=true;sc.add(im)}
 PB.t0=null}

/* animación: la llama la calle en cada paso (lev = emoción del público 0..1) */
function pbPose(lev,t){const P=CL&&CL.pub;if(!P)return;const dt=PB.t0==null?0:Math.max(0,Math.min(.1,t-PB.t0));PB.t0=t;
 const r=CL.res,foco=r?new THREE.Vector3(r.x,1.1,r.z):new THREE.Vector3(0,1,0);const e=Math.max(0,Math.min(1,(lev-.15)/.7));
 P.tick(dt,W3.cam,{foco,ole:e,clap:lev>.4?1:0});pbCoetTick(dt)}

/* ---------- cohete al abrir el cajón ---------- */
function pbHumo(){if(PBX.humo)return PBX.humo;const [cv,c]=pbCv(64,64);const gr=c.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(235,232,225,.9)');gr.addColorStop(.6,'rgba(210,205,200,.45)');gr.addColorStop(1,'rgba(200,200,200,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);
 const t=new THREE.CanvasTexture(cv);return PBX.humo=t}
function pbCoet(){if(!CL||!CL.sc)return;const E=CL.env&&CL.env.cajon||{x:0,z:40};const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:pbHumo(),transparent:true,depthWrite:false,opacity:0}));sp.position.set(E.x+(Math.random()-.5)*6,26+Math.random()*6,E.z-4);sp.scale.set(.5,.5,.5);CL.sc.add(sp);
 const fl=new THREE.Sprite(new THREE.SpriteMaterial({color:'#fff2c0',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0}));fl.position.copy(sp.position);fl.scale.set(3,3,3);CL.sc.add(fl);
 PB.coet.push({sp,fl,t:0});
 try{if(AU.ctx&&AU.on){const c=AU.ctx,t0=c.currentTime,buf=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  // silbido de subida
  const s=c.createBufferSource();s.buffer=buf;const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=8;bp.frequency.setValueAtTime(900,t0);bp.frequency.exponentialRampToValueAtTime(3200,t0+.9);const g=c.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.18,t0+.2);g.gain.linearRampToValueAtTime(0,t0+.95);s.connect(bp);bp.connect(g);g.connect(AU.master);s.start(t0);s.stop(t0+1);
  // estampido con eco de la calle
  const b=c.createBufferSource();b.buffer=buf;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(2400,t0+1);lp.frequency.exponentialRampToValueAtTime(140,t0+1.6);const gb=c.createGain();gb.gain.setValueAtTime(.95,t0+1);gb.gain.exponentialRampToValueAtTime(.001,t0+2.3);b.connect(lp);lp.connect(gb);gb.connect(AU.master);if(AU.rev)gb.connect(AU.rev);b.start(t0+1,.3);b.stop(t0+2.4)}}catch(e){}}
function pbCoetTick(dt){for(let i=PB.coet.length-1;i>=0;i--){const k=PB.coet[i];k.t+=dt;const t=k.t;
 if(t>1){const u=t-1;k.fl.material.opacity=Math.max(0,1-u*6);k.sp.material.opacity=Math.max(0,.85-u*.22);const s=1+u*3.2;k.sp.scale.set(s,s,s);k.sp.position.y+=dt*.4}
 if(t>5){CL.sc.remove(k.sp);CL.sc.remove(k.fl);k.sp.material.dispose();k.fl.material.dispose();PB.coet.splice(i,1)}}}
if(typeof calleNext==='function')envolver('calleNext','pueblo',_cnPb=>function(){_cnPb.apply(this,arguments);if(CL&&CL.res&&!CL.done)pbCoet()});
if(typeof salirCalle==='function')envolver('salirCalle','pueblo',_scPb=>function(){PB.coet.length=0;try{if(CL&&CL.pub)CL.pub.dispose()}catch(e){}return _scPb.apply(this,arguments)},{segura:true});
