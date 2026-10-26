/* ===================== MUNDO 3D ===================== */
const W3={on:false,mode:null,keys:{},jx:0,jy:0,run:false,yaw:0,pitch:.32,from:'2d',hold:0,holding:false,act:null,act2:null,ride:false,drive:false,tod:.36};
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const lerp=(a,b,v)=>a+(b-a)*v,ease=v=>v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2,angD=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const ga=(t,c,w)=>Math.exp(-((t-c)*(t-c))/(2*w*w));
const MEJ={
 placita:{n:'Placita de tientas',c:45000,d:'Tientas en casa, toreando tú mismo: hembras a 250 € y machos a 800 €. Sin ella el mayoral alquila una placita ajena (450 € y 1.200 €).',pos:[-30,24]},
 corrales:{n:'Corrales de piedra y embarcadero',c:22000,d:'Los toros viajan descansados y llegan con más fuerza a la plaza.',pos:[28,-35]},
 comederos:{n:'Comederos de pienso',c:15000,d:'Menos desperdicio: la alimentación cuesta un 12 % menos.',pos:[30,4]},
 abrev:{n:'Abrevaderos',c:12000,d:'Agua limpia todo el año: más salud cada mes en toda la camada.',pos:[-34,6]},
 cercas:{n:'Cercas de piedra por lotes',c:30000,d:'Lotes bien separados: la mitad de peleas en el cercado y menos cercas rotas.',pos:[30,32]},
 nave:{n:'Nave y silos de pienso',c:25000,d:'Compras a granel: la alimentación cuesta un 8 % menos.',pos:[6,-26]},
 casa:{n:'Reformar el cortijo',c:40000,d:'Visitas y catas de aficionados: unos 900 € al mes.',pos:[-16,6]}
};
const mej=k=>!!(S&&S.mej&&S.mej[k]);
function feedMul(){return (mej('comederos')?.88:1)*(mej('nave')?.92:1)}
const RKN={toros:'los toros',vacas:'las vacas',sem:'los sementales'};
const MC={};
function M(col,r=.85,m=0,side){const k=col+'|'+r+'|'+m+'|'+(side||0);if(!MC[k])MC[k]=new THREE.MeshStandardMaterial({color:col,roughness:r,metalness:m,side:side||THREE.FrontSide});return MC[k]}
let G3=null;
function geos(){if(G3)return G3;const t=(g,dy)=>{g.translate(0,dy,0);return g};
 G3={sph:new THREE.SphereGeometry(1,18,14),cyl:new THREE.CylinderGeometry(1,1,1,12),box:new THREE.BoxGeometry(1,1,1),
  legU:t(new THREE.CylinderGeometry(.13,.08,.55,10),-.275),legH:t(new THREE.CylinderGeometry(.17,.085,.55,10),-.275),legL:t(new THREE.CylinderGeometry(.07,.055,.45,8),-.225),tail:t(new THREE.CylinderGeometry(.035,.02,.95,6),-.475),
  pLegU:t(new THREE.CylinderGeometry(.085,.07,.48,8),-.24),pLegL:t(new THREE.CylinderGeometry(.065,.05,.44,8),-.22),
  pArmU:t(new THREE.CylinderGeometry(.06,.05,.32,7),-.16),pArmL:t(new THREE.CylinderGeometry(.05,.042,.3,7),-.15),
  hLegU:t(new THREE.CylinderGeometry(.085,.06,.5,8),-.25),hLegL:t(new THREE.CylinderGeometry(.05,.042,.52,7),-.26)};
 const hg=new THREE.SphereGeometry(1,22,16),hp=hg.attributes.position;
 for(let i=0;i<hp.count;i++){const x=hp.getX(i),y=hp.getY(i),z=hp.getZ(i),u=(z+1)/2;hp.setXYZ(i,x*(.25-.1*u),y*(.26-.07*u)-.05*u+.03*Math.max(0,y)*(1-u),z*.34)}
 hg.computeVertexNormals();G3.head=hg;return G3}
function mesh(g,m,sx,sy,sz,x,y,z,p,noShadow){const o=new THREE.Mesh(g,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);if(!noShadow)o.castShadow=true;o.receiveShadow=true;if(p)p.add(o);return o}
const PT={};
function peloMat(pelo){if(PT[pelo])return PT[pelo];
 const [base,hi,pat]=PELO[pelo]||PELO.negro;const cv=document.createElement('canvas');cv.width=256;cv.height=128;const c=cv.getContext('2d');
 const g=c.createLinearGradient(0,0,0,128);g.addColorStop(0,hi);g.addColorStop(.5,base);g.addColorStop(1,shade(base,-.35));c.fillStyle=g;c.fillRect(0,0,256,128);
 const r=mulberry(pelo.length*17);
 for(let i=0;i<2200;i++){c.fillStyle=`rgba(${r()<.5?'255,255,255':'0,0,0'},${.03+r()*.06})`;c.fillRect(r()*256,r()*128,1+r()*3,1)}
 if(pat===1){c.fillStyle='rgba(235,235,235,.3)';for(let i=0;i<1800;i++)c.fillRect(r()*256,r()*128,1.6,1.6)}
 if(pat===2){c.fillStyle='#ece4d6';for(let i=0;i<7;i++){c.beginPath();c.ellipse(r()*256,30+r()*70,10+r()*22,8+r()*14,r()*3,0,Math.PI*2);c.fill()}}
 PT[pelo]=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),roughness:.62});return PT[pelo]}
const TM={};
function trajeMat(col,plata){const k=col+(plata?'p':'o');if(TM[k])return TM[k];const cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d');c.fillStyle=col;c.fillRect(0,0,128,128);
 const gd=plata?'#d9dde0':'#e6bb55';c.strokeStyle=gd;c.fillStyle=gd;c.lineWidth=2;
 for(let y=8;y<128;y+=22)for(let x=8;x<128;x+=22){c.beginPath();c.arc(x,y,6,0,Math.PI*1.5);c.stroke();c.beginPath();c.arc(x+11,y+11,2.2,0,Math.PI*2);c.fill()}
 c.fillRect(0,0,10,128);c.fillRect(118,0,10,128);
 TM[k]=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),roughness:.42,metalness:.28});return TM[k]}
let HMAT=null;const HG={};
function hornGeo(type,hl,ht,hc){
 const key=type+'|'+Math.round(hl*20)+'|'+Math.round(ht*400)+'|'+hc;if(HG[key])return HG[key];
 const P=type==='lira'?[.3,.68,.1,.18]:type==='cab'?[.6,.5,.15,0]:(HORNS[type]||HORNS.veleto);const [out,up,fwd,tip]=P,L=hl;
 const pts=[V3(.05,0,0),V3(.05+out*.45*L,up*.22*L,fwd*.3*L),V3(.05+out*.85*L,up*.6*L,fwd*.7*L),V3(.05+out*L*(tip<0?1+tip*1.6:1),up*L*(tip>0?.92:1),fwd*L-(tip>0?tip*.6*L:0))];
 const curve=new THREE.CatmullRomCurve3(pts),seg=16,rad=7;const g=new THREE.TubeGeometry(curve,seg,ht,rad,false);
 const pos=g.attributes.position,cols=new Float32Array((seg+1)*(rad+1)*3);const cb=new THREE.Color(hc),ct=new THREE.Color('#1a140f'),tmp=new THREE.Color(),c0=new THREE.Vector3();
 for(let i=0;i<=seg;i++){const u=i/seg;curve.getPointAt(u,c0);const f=1-.9*Math.pow(u,1.15);tmp.copy(cb).lerp(ct,clamp((u-.6)/.4,0,1));
  for(let j=0;j<=rad;j++){const k=i*(rad+1)+j;pos.setXYZ(k,c0.x+(pos.getX(k)-c0.x)*f,c0.y+(pos.getY(k)-c0.y)*f,c0.z+(pos.getZ(k)-c0.z)*f);cols.set([tmp.r,tmp.g,tmp.b],k*3)}}
 g.setAttribute('color',new THREE.BufferAttribute(cols,3));g.computeVertexNormals();HG[key]=g;return g}
function hornMat(){if(!HMAT)HMAT=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.42,side:THREE.DoubleSide});return HMAT}

/* ---------- sonido ---------- */
const AU={ctx:null,on:true,crowd:null,music:false,amb:null};
function auInit(){if(!AU.on)return;try{if(!AU.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AU.ctx=new C();AU.master=AU.ctx.createGain();AU.master.gain.value=.7;AU.master.connect(AU.ctx.destination);
  const n=AU.ctx.createBuffer(1,AU.ctx.sampleRate*2,AU.ctx.sampleRate);const d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=n}
  if(AU.ctx.state==='suspended')AU.ctx.resume()}catch(e){AU.ctx=null}}
function auToggle(){AU.on=!AU.on;if(AU.on)auInit();if(AU.master)AU.master.gain.value=AU.on?.7:0;const b=$('#h3snd');if(b)b.textContent=AU.on?'Sonido: sí':'Sonido: no'}
function nz(){const s=AU.ctx.createBufferSource();s.buffer=AU.noise;s.loop=true;return s}
function env(g,t0,a,peak,dec){g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),t0+a);g.gain.exponentialRampToValueAtTime(.0001,t0+a+dec)}
const mf=n=>440*Math.pow(2,(n-69)/12);
function drum(t,f,v){const c=AU.ctx;const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+.12);const g=c.createGain();env(g,t,.005,v,.35);o.connect(g);g.connect(AU.master);o.start(t);o.stop(t+.45)}
function brass(t,f,d,v){const c=AU.ctx;const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=2200;const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.03);g.gain.setValueAtTime(v*.85,t+Math.max(.04,d-.05));g.gain.exponentialRampToValueAtTime(.0001,t+d);
 for(const det of [1,1.004]){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f*det;o.connect(fl);o.start(t);o.stop(t+d+.05)}fl.connect(g);g.connect(AU.master)}
function clarin(){if(!AU.ctx)return;try{const t=AU.ctx.currentTime+.05;let tt=t;for(const [n,d] of [[67,.18],[72,.18],[76,.18],[79,.55],[76,.18],[79,.9]]){brass(tt,mf(n),d,.16);tt+=d}for(let i=0;i<6;i++)drum(t+i*.12,90,.25)}catch(e){}}
function snare(t,v){const c=AU.ctx;const s=nz();const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=1800;const g=c.createGain();env(g,t,.003,v,.12);s.connect(hp);hp.connect(g);g.connect(AU.master);s.start(t);s.stop(t+.2)}
const PASO={mel:[[76,.5],[77,.25],[76,.25],[74,.25],[73,.25],[74,.25],[76,.25],[69,1],[70,.25],[69,.25],[67,.25],[65,.25],[64,1],[64,.25],[65,.25],[67,.25],[69,.25],[70,.5],[69,.25],[67,.25],[65,.5],[64,.25],[62,.25],[61,1],[69,1],[73,.5],[74,.5],[76,1],[74,.5],[73,.5],[69,1],[69,2]],ch:[[45,52],[45,52],[46,53],[45,52],[43,50],[45,52],[46,53],[45,52]],beat:.3};
function phrase(t0){const c=AU.ctx,B=PASO.beat;let t=t0;for(const [n,d] of PASO.mel){brass(t,mf(n),d*B*.95,.06);t+=d*B}
 PASO.ch.forEach(([r,f],i)=>{const tb=t0+i*2*B;for(const [k,n] of [[0,r],[1,f]]){const o=c.createOscillator();o.type='triangle';o.frequency.value=mf(n-12);const g=c.createGain();env(g,tb+k*B,.01,.18,B*.8);o.connect(g);g.connect(AU.master);o.start(tb+k*B);o.stop(tb+k*B+B)}
  for(const k of [.5,1.5]){for(const n of [r+12,f+12]){const o=c.createOscillator();o.type='square';o.frequency.value=mf(n);const g=c.createGain();env(g,tb+k*B,.005,.02,B*.3);o.connect(g);g.connect(AU.master);o.start(tb+k*B);o.stop(tb+k*B+B*.4)}snare(tb+k*B,.05)}})}
function musicStart(){if(!AU.ctx||AU.music)return;AU.music=true;const loop=()=>{if(!AU.music||!AU.ctx)return;try{phrase(AU.ctx.currentTime+.05)}catch(e){}AU.mt=setTimeout(loop,PASO.beat*16*1000)};loop()}
function musicStop(){AU.music=false;clearTimeout(AU.mt)}
function crowdStart(){if(!AU.ctx||AU.crowd)return;try{const c=AU.ctx,s=nz(),bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=650;bp.Q.value=.5;const g=c.createGain();g.gain.value=.04;s.connect(bp);bp.connect(g);g.connect(AU.master);s.start();AU.crowd={s,g}}catch(e){}}
function crowdStop(){if(AU.crowd){try{AU.crowd.s.stop()}catch(e){}AU.crowd=null}}
function crowdLevel(v){if(AU.crowd)AU.crowd.g.gain.setTargetAtTime(v,AU.ctx.currentTime,.3)}
function oleSnd(big){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime,s=nz();const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(big?1:.6,t+.12);g.gain.exponentialRampToValueAtTime(.0001,t+.95);
 for(const [a,b] of [[450,750],[900,1250]]){const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=4;f.frequency.setValueAtTime(a,t);f.frequency.linearRampToValueAtTime(b,t+.35);s.connect(f);f.connect(g)}g.connect(AU.master);s.start(t);s.stop(t+1)}
function applause(dur,v){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime,s=nz(),hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=1400;const am=c.createGain();am.gain.value=.5;const lfo=c.createOscillator();lfo.type='square';lfo.frequency.value=11;const lg=c.createGain();lg.gain.value=.45;lfo.connect(lg);lg.connect(am.gain);
 const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.3);g.gain.setValueAtTime(v,t+Math.max(.4,dur-.6));g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(hp);hp.connect(am);am.connect(g);g.connect(AU.master);s.start(t);s.stop(t+dur);lfo.start(t);lfo.stop(t+dur)}
function whistles(v){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime;for(let i=0;i<9;i++){const o=c.createOscillator();o.type='sine';const st=t+R(0,1.8),f=R(2000,3200);o.frequency.setValueAtTime(f,st);o.frequency.linearRampToValueAtTime(f*R(.85,1.1),st+.5);const g=c.createGain();env(g,st,.03,v*.06,R(.4,.9));o.connect(g);g.connect(AU.master);o.start(st);o.stop(st+1.2)}}
function cencerro(v){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime;for(const f of [540,812,1210]){const o=c.createOscillator();o.type='square';o.frequency.value=f*R(.98,1.02);const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f;bp.Q.value=8;const g=c.createGain();env(g,t,.003,v*.25,.5);o.connect(bp);bp.connect(g);g.connect(AU.master);o.start(t);o.stop(t+.6)}}
function bird(v){if(!AU.ctx)return;const c=AU.ctx;let t=c.currentTime;for(let i=0,n=RI(2,5);i<n;i++){const o=c.createOscillator();o.type='sine';const f=R(2600,4200);o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*R(.7,1.3),t+.09);const g=c.createGain();env(g,t,.01,v*.1,.09);o.connect(g);g.connect(AU.master);o.start(t);o.stop(t+.15);t+=R(.1,.22)}}
function mugido(v){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime,d=R(1,1.6);const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(R(95,120),t);o.frequency.linearRampToValueAtTime(R(130,160),t+d*.4);o.frequency.linearRampToValueAtTime(R(85,100),t+d);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v*.3),t+.2);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(lp);lp.connect(g);g.connect(AU.master);o.start(t);o.stop(t+d+.05)}
function bufido(v){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime,s=nz(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;const g=c.createGain();env(g,t,.02,v*.5,.45);s.connect(lp);lp.connect(g);g.connect(AU.master);s.start(t);s.stop(t+.6)}
function ambStart(rain){ambStop();if(!AU.ctx)return;try{const c=AU.ctx,s=nz(),lp=c.createBiquadFilter();lp.type=rain?'bandpass':'lowpass';lp.frequency.value=rain?2500:380;const g=c.createGain();g.gain.value=rain?.09:.035;s.connect(lp);lp.connect(g);g.connect(AU.master);s.start();AU.amb={s}}catch(e){}}
function ambStop(){if(AU.amb){try{AU.amb.s.stop()}catch(e){}AU.amb=null}}

/* ---------- modelos ---------- */
function bprof(m,cow,calf){const L=1.25*m.len,Gi=m.girth*(cow&&!calf?.86:1),A=m.alt,Mo=cow?.12:m.morr,pap=cow?0:(m.papada||1);
 return {L,Gi,A,Mo,e:t=>Math.pow(Math.max(0,1-Math.pow(Math.abs(t),3.2)),.42),w:t=>Gi*(.37+.12*ga(t,.38,.3)+.08*ga(t,-.62,.25)),
  top:t=>A*(.38+Mo*.3*ga(t,.52,.16)+.05*ga(t,.25,.2)-.02*ga(t,-.1,.3)+.05*ga(t,-.64,.2)),bot:t=>Gi*(.4+.05*ga(t,-.05,.45))+pap*.13*ga(t,.82,.1)*Gi,cy:t=>.04*t}}
function bodyGeo(P){const g=new THREE.SphereGeometry(1,40,26),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),t=p.getZ(i),s=Math.sqrt(Math.max(1e-6,1-t*t)),nx=x/s,ny=y/s,e=P.e(t);
  p.setXYZ(i,nx*P.w(t)*e,P.cy(t)+(ny>0?ny*P.top(t):ny*P.bot(t))*e,t*P.L)}
 g.computeVertexNormals();return g}
function makeBull(spec){
 const G=geos(),kind=spec.kind||'toro',cow=kind==='vaca'||kind==='becerro',calf=kind==='becerro',cab=kind==='cabestro';
 const m=spec.m||{len:1,alt:1,morr:cow?.25:.9,leg:1,girth:1,papada:1,horn:cab?'cab':cow?'lira':'veleto',hl:calf?.25:cab?1.25:1,ht:cow?.03:.05,hc:'#e2d6bc'};
 const mat=peloMat(spec.pelo),dk=M('#110d0a',.9),wh=M('#efe8dc',.8);
 const P=bprof(m,cow,calf),Le=m.leg*(calf?1.12:1),hipY=1.0*Le*P.A,by=hipY+.24*P.A;
 const root=new THREE.Group(),b=new THREE.Group();root.add(b);
 const body=new THREE.Mesh(bodyGeo(P),mat);body.position.y=by;body.castShadow=true;body.receiveShadow=true;b.add(body);
 const topY=t=>by+P.cy(t)+P.top(t)*P.e(t);
 const nk=mesh(G.sph,mat,.3*P.Gi*(cow?.85:1),.36*P.A*(1+P.Mo*.15),.48,0,by+.1*P.A,1.02*P.L,b);nk.rotation.x=-.45;
 if(m.bragado)mesh(G.sph,wh,.3*P.Gi,.1,.6*P.L,0,by-.45*P.Gi,-.05,b,true);
 if(kind==='vaca')mesh(G.sph,M('#d9a79b',.7),.16,.12,.2,0,by-.5*P.Gi,-.66*P.L,b,true);
 const hs=calf?1.28:cow?.84:cab?1.05:1;
 const hp=new THREE.Group();hp.position.set(0,by+.22*P.A,1.2*P.L);hp.scale.setScalar(hs);b.add(hp);
 const hm=new THREE.Mesh(G.head,mat);hm.position.set(0,-.12,.28);hm.rotation.x=.42;hm.castShadow=true;hp.add(hm);
 mesh(G.sph,dk,.15,.13,.13,0,-.3,.53,hp);mesh(G.sph,mat,.2,.12,.16,0,.08,.12,hp,true);
 if(m.lucero)mesh(G.sph,wh,.08,.03,.06,0,.05,.36,hp,true).rotation.x=-.6;
 for(const s of [1,-1]){mesh(G.sph,M('#060505',.25),.042,.042,.042,s*.2,-.04,.28,hp,true);const ear=mesh(G.sph,mat,.15,.05,.085,s*.28,.02,.1,hp,true);ear.rotation.z=s*.3;
  const h=new THREE.Mesh(hornGeo(m.horn||'veleto',m.hl||1,m.ht||.05,m.hc||'#e2d6bc'),hornMat());h.castShadow=true;h.position.set(0,.08,.15);h.scale.set(s,1,1);hp.add(h)}
 if(cab){mesh(G.cyl,M('#8a6a2a',.35,.6),.13,.24,.13,0,-.55,.2,hp);mesh(G.box,M('#3a2a1c'),.06,.3,.06,0,-.35,.2,hp,true)}
 const legs=[],sy=hipY,lt=P.Gi*(cow?.84:1);
 for(const [x,y,z,f] of [[.21,hipY,.78*P.L,1],[-.21,hipY,.78*P.L,1],[.24,hipY+.04,-.86*P.L,0],[-.24,hipY+.04,-.86*P.L,0]]){
  const hip=new THREE.Group();hip.position.set(x*P.Gi,y,z);b.add(hip);const u=new THREE.Mesh(f?G.legU:G.legH,mat);u.scale.set(lt,sy,lt);u.castShadow=true;hip.add(u);
  const kn=new THREE.Group();kn.position.y=-.55*sy;hip.add(kn);const l=new THREE.Mesh(G.legL,m.calcetero?wh:mat);l.scale.set(lt,sy,lt);l.castShadow=true;kn.add(l);
  mesh(G.box,dk,.12*lt,.08,.16*lt,0,-.45*sy-.02,.02,kn);legs.push({hip,kn,f})}
 const tp=new THREE.Group();tp.position.set(0,topY(-.93)-.04,-1.2*P.L);b.add(tp);const tl=new THREE.Mesh(G.tail,mat);tl.scale.set(1,P.A*(calf?.7:1),1);tl.castShadow=true;tp.add(tl);
 mesh(G.sph,m.rabicano?wh:dk,.06,.16,.06,0,-.98*P.A*(calf?.7:1),0,tp);
 if(spec.div){const dv=new THREE.Group();dv.position.set(0,topY(.5),.5*P.L);b.add(dv);spec.div.forEach((c,i)=>{const r=new THREE.Mesh(new THREE.PlaneGeometry(.07,.42),M(c,.7,0,THREE.DoubleSide));r.position.set((i?.05:-.05),-.12,0);r.rotation.set(.3,0,(i?-.35:.35));dv.add(r)});mesh(G.sph,M(spec.div[0],.6),.06,.06,.06,0,.02,0,dv,true)}
 const bg=new THREE.Group();bg.position.set(0,topY(.42)-.04,.42*P.L);b.add(bg);
 const cols=['#bf3a3f','#e6bb55','#1f6b3a','#3a78b8','#f1ece0','#5b2a6e'];
 for(let i=0;i<6;i++){const s=new THREE.Group();s.position.set((i%2?.12:-.12),0,(Math.floor(i/2)-1)*.18);s.rotation.set(-.5,0,(i%2?-.3:.3));
  mesh(G.cyl,M('#efe6d2'),.018,.75,.018,0,.37,0,s,true);for(let j=0;j<3;j++)mesh(G.box,M(cols[(i+j)%6],.6),.07,.12,.07,0,.5+j*.12,0,s,true);s.visible=false;bg.add(s)}
 root.scale.setScalar(calf?.44:kind==='vaca'?.72:cab?.84:.78);
 return {root,b,hp,legs,tp,bg,ph:Math.random()*6,kind,hipY,t:Math.random()*10,cruz:{y:topY(.3),z:.3*P.L}}}
function animBull(B,dt,o){
 const sp=o.speed||0;B.t+=dt;B.ph+=dt*(sp>.03?4+sp*8:0);
 const gal=sp>1.05,off=gal?[0,.55,Math.PI,Math.PI+.55]:[0,Math.PI,Math.PI,0],amp=Math.min(1.25,sp)*.5,k=o.kneel||0;
 B.legs.forEach((l,i)=>{const s=Math.sin(B.ph+off[i]);let hx=s*amp*(l.f?1:.85)*(o.limp&&i===0?.35:1),kx=(l.f?1:-1)*Math.max(0,Math.sin(B.ph+off[i]+1.2))*amp*1.1;
  if(o.paw&&i===0){const q=Math.sin(B.t*7);hx=-.55+q*.55;kx=.9+q*.4}
  if(o.push&&sp<.05)hx+=l.f?-.25:.3;
  if(o.fall)hx=(l.f?.5:-.4)*o.fall,kx=0;
  l.hip.rotation.x=hx-(l.f?k*.4:0);l.kn.rotation.x=kx+(l.f?k*2.3:0)});
 B.b.rotation.x=.22*k+(gal?Math.sin(B.ph*2)*.05:0)+(o.push?-.07:0);
 B.b.rotation.z=o.limp&&sp>.05?Math.sin(B.ph)*.04:0;
 B.b.position.y=-.4*k*B.hipY+(gal?Math.abs(Math.sin(B.ph))*.06:0);
 B.b.scale.y=1+Math.sin(B.t*(sp>1?4:2.1))*.008;
 const ht=-.12+(o.head??.3)*.95-(o.toss||0)*1.1;B.hp.rotation.x+=(ht-B.hp.rotation.x)*Math.min(1,dt*(o.toss?14:6));
 B.hp.rotation.y+=((o.look||0)*.55-B.hp.rotation.y)*Math.min(1,dt*4);
 B.tp.rotation.x=.12+sp*.5;B.tp.rotation.z=Math.sin(B.t*2.4+B.ph)*.2+(sp<.05?Math.sin(B.t*.7)*.25:0)}
function setBand(B,n){B.bg.children.forEach((s,i)=>s.visible=i<n)}
function makePerson(st){
 const G=geos(),root=new THREE.Group(),b=new THREE.Group();root.add(b);const tr=!!st.traje;
 const skin=M(st.skin||'#c79a74',.7),jk=tr?trajeMat(st.traje,st.plata):M(st.jacket,.75),pt=tr?trajeMat(st.traje,st.plata):M(st.pants,.8),lg=tr?M('#eaa7b4',.55):M(st.legs||st.pants,.8);
 const bt=M(st.boots||(tr?'#0d0a09':'#2a1d14'),.45),gold=M(st.plata?'#d5dadd':'#e6bb55',.3,.65);
 const legs=[],arms=[];
 for(const s of [1,-1]){const hip=new THREE.Group();hip.position.set(s*.11,.94,0);b.add(hip);const u=new THREE.Mesh(G.pLegU,pt);u.castShadow=true;hip.add(u);
  const kn=new THREE.Group();kn.position.y=-.48;hip.add(kn);if(tr)mesh(G.sph,gold,.075,.05,.075,s*.02,0,0,kn,true);
  const l=new THREE.Mesh(G.pLegL,lg);l.castShadow=true;kn.add(l);mesh(G.box,bt,.1,.07,.22,0,-.43,.04,kn);legs.push({hip,kn})}
 if(tr){mesh(G.cyl,M(st.faja||'#8e1a24',.7),.195,.12,.145,0,1.0,0,b,true);mesh(G.cyl,jk,.21,.44,.15,0,1.32,0,b)}else mesh(G.cyl,jk,.21,.6,.15,0,1.25,0,b);
 if(st.shirt||tr)mesh(G.box,M(st.shirt||'#f4f0e6',.7),.14,.26,.02,0,1.38,.146,b,true);
 if(tr){mesh(G.box,M('#111',.6),.05,.09,.02,0,1.5,.152,b,true);for(const s of [1,-1])mesh(G.sph,gold,.11,.07,.13,s*.25,1.56,0,b,true)}
 else mesh(G.cyl,M(st.belt||'#2a2420',.7),.2,.08,.15,0,.97,0,b,true);
 mesh(G.cyl,skin,.05,.1,.05,0,1.6,0,b,true);
 const head=new THREE.Group();head.position.set(0,1.73,0);b.add(head);
 mesh(G.sph,skin,.12,.145,.13,0,0,0,head);mesh(G.sph,M(st.hair||'#231812',.9),.128,.09,.13,0,.06,-.02,head,true);
 for(const s of [1,-1])mesh(G.sph,M('#1a1512',.4),.016,.016,.01,s*.045,.025,.122,head,true);
 mesh(G.sph,skin,.02,.03,.025,0,-.01,.13,head,true);
 if(tr)mesh(G.sph,M('#111',.8),.035,.035,.03,0,.02,-.135,head,true);
 const hat=new THREE.Group();head.add(hat);
 if(st.hat==='campero'){mesh(G.cyl,M(st.hatc||'#3b2c22',.8),.34,.02,.34,0,.12,0,hat);mesh(G.cyl,M(st.hatc||'#3b2c22',.8),.14,.13,.14,0,.18,0,hat);mesh(G.cyl,M('#151010'),.142,.03,.142,0,.13,0,hat,true)}
 if(st.hat==='montera'){mesh(G.box,M('#111',.6),.3,.08,.16,0,.12,-.02,hat);for(const s of [1,-1])mesh(G.sph,M('#111',.6),.07,.07,.07,s*.14,.12,-.02,hat,true)}
 if(st.hat==='castoreno'){mesh(G.cyl,M('#d8c08a',.7),.32,.02,.32,0,.12,0,hat);mesh(G.sph,M('#d8c08a',.7),.15,.12,.15,0,.16,0,hat)}
 if(st.hat==='chambergo'){mesh(G.cyl,M('#111',.7),.36,.02,.36,0,.12,0,hat);mesh(G.cyl,M('#111',.7),.14,.12,.14,0,.18,0,hat);mesh(G.sph,M('#c0303a',.7),.05,.16,.04,.1,.28,-.04,hat,true).rotation.z=-.5;mesh(G.sph,M('#f4f0e6',.7),.04,.13,.035,.14,.26,-.05,hat,true).rotation.z=-.7}
 for(const s of [1,-1]){const sh=new THREE.Group();sh.position.set(s*.26,1.5,0);b.add(sh);const u=new THREE.Mesh(G.pArmU,jk);u.castShadow=true;sh.add(u);
  const el=new THREE.Group();el.position.y=-.32;sh.add(el);const l=new THREE.Mesh(G.pArmL,jk);l.castShadow=true;el.add(l);if(tr)mesh(G.cyl,gold,.053,.04,.053,0,-.27,0,el,true);mesh(G.sph,skin,.05,.06,.05,0,-.31,0,el,true);
  const hand=new THREE.Group();hand.position.y=-.32;el.add(hand);arms.push({sh,el,hand,s})}
 if(st.pole){const p=mesh(G.cyl,M('#a88b5a',.7),.025,st.pole,.025,0,-.1,0,arms[1].hand);p.rotation.x=st.pole>3.2?1.2:.25}
 if(st.paseo){const cp=mesh(G.box,trajeMat(st.paseo,false),.32,.8,.04,.2,1.18,.13,b,true);cp.rotation.z=.15}
 return {root,b,legs,arms,head,hat,ph:0}}
function seat(P){P.seated=true;P.legs.forEach((l,i)=>{l.hip.rotation.set(-1.05,0,(i?-1:1)*.32);l.kn.rotation.x=1.1})}
function animPerson(P,dt,sp,pose){P.ph+=dt*sp*9;const a=Math.min(1,sp)*.55;const kneel=pose==='kneel';
 if(!P.seated)P.legs.forEach((l,i)=>{const s=Math.sin(P.ph+(i?Math.PI:0));
  if(kneel){l.hip.rotation.x=i?-1.45:0;l.kn.rotation.x=i?1.45:1.6}else{l.hip.rotation.x=s*a;l.kn.rotation.x=Math.max(0,-Math.sin(P.ph+(i?Math.PI:0)+.6))*a*1.3}});
 P.arms.forEach((ar,i)=>{if(ar.lock)return;ar.sh.rotation.x=-Math.sin(P.ph+(i?Math.PI:0))*a*.8;ar.sh.rotation.z=(i?-1:1)*.08;ar.el.rotation.x=-.15-a*.3});
 P.b.position.y=kneel?-.42:P.seated?0:Math.abs(Math.sin(P.ph))*.04*a}
function mkCloth(w,h,sx,sy,mat){const g=new THREE.PlaneGeometry(w,h,sx,sy);const arr=g.attributes.position.array;g.userData.base=arr&&arr.slice?arr.slice():null;const m=new THREE.Mesh(g,mat);m.castShadow=true;return m}
function clothTick(m,t,amp){const g=m.geometry,p=g.attributes.position,b=g.userData.base;if(!b||!p.array)return;const H=g.parameters.height;
 for(let i=0;i<p.count;i++){const x=b[i*3],y=b[i*3+1];const d=(H/2-y)/H;p.array[i*3+2]=Math.sin(t*6+x*4+y*3)*.05*d*(.3+amp)+Math.sin(t*2.3+x*2)*.03*d+amp*.12*d*d}
 p.needsUpdate=true}
function makeMuleta(){const g=new THREE.Group();mesh(geos().cyl,M('#d8c9a4'),.015,.9,.015,0,0,.45,g,true).rotation.x=Math.PI/2;
 const cl=mkCloth(.92,.78,6,5,M('#b01e2a',.8,0,THREE.DoubleSide));cl.position.set(0,-.39,.47);cl.rotation.y=Math.PI/2;g.add(cl);g.userData.cl=cl;return g}
function makeCapote(){const g=new THREE.Group();const a=mkCloth(1.7,1.05,8,4,M('#c43f78',.85));const b=new THREE.Mesh(a.geometry,M('#e2b23e',.85));b.rotation.y=Math.PI;b.position.z=-.006;g.add(a,b);g.position.set(0,1.05,.42);g.userData.cl=a;return g}
function makeEstoque(){const g=new THREE.Group();mesh(geos().box,M('#cfd4d8',.25,.85),.012,.02,.85,0,0,.43,g,true);mesh(geos().box,M('#b89a5e',.3,.6),.12,.02,.02,0,0,0,g,true);mesh(geos().cyl,M('#7a1525',.6),.018,.12,.018,0,0,-.07,g,true).rotation.x=Math.PI/2;g.visible=false;return g}
function makeHorse2(o={}){const G=geos(),root=new THREE.Group(),body=new THREE.Group();root.add(body);const m=M(o.col||'#5b3f2d',.6),dk=M(o.dark||'#1d140e',.8);
 mesh(G.sph,m,.4,.46,1.0,0,1.38,0,body);mesh(G.sph,m,.38,.42,.42,0,1.45,.62,body);mesh(G.sph,m,.4,.44,.45,0,1.48,-.68,body);
 const nk=new THREE.Group();nk.position.set(0,1.62,.85);body.add(nk);mesh(G.cyl,m,.17,.8,.24,0,.36,0,nk);nk.rotation.x=.62;mesh(G.box,dk,.06,.75,.2,0,.38,-.13,nk,true);
 const hd=new THREE.Group();hd.position.set(0,.78,0);nk.add(hd);hd.rotation.x=.9;mesh(G.sph,m,.13,.14,.34,0,0,.16,hd);mesh(G.sph,dk,.1,.09,.1,0,-.02,.45,hd,true);
 for(const s of [1,-1]){const e=mesh(G.sph,m,.035,o.mule?.16:.09,.04,s*.07,.14,-.02,hd,true);e.rotation.z=s*.25;mesh(G.sph,M('#060505',.3),.025,.025,.025,s*.11,.04,.12,hd,true)}
 const legs=[];for(const [x,y,z,f] of [[.18,1.12,.62,1],[-.18,1.12,.62,1],[.18,1.15,-.66,0],[-.18,1.15,-.66,0]]){const hip=new THREE.Group();hip.position.set(x,y,z);body.add(hip);const u=new THREE.Mesh(G.hLegU,m);u.castShadow=true;hip.add(u);
  const kn=new THREE.Group();kn.position.y=-.5;hip.add(kn);const l=new THREE.Mesh(G.hLegL,m);l.castShadow=true;kn.add(l);mesh(G.box,dk,.09,.07,.12,0,-.53,.02,kn);legs.push({hip,kn,f})}
 const tp=new THREE.Group();tp.position.set(0,1.62,-1.02);body.add(tp);const tl=new THREE.Mesh(G.tail,dk);tl.scale.set(2.2,.85,2.2);tp.add(tl);
 if(o.saddle!==false)mesh(G.box,M('#3a2414',.6),.5,.1,.55,0,1.86,-.05,body);
 if(o.peto){const tx=document.createElement('canvas');tx.width=128;tx.height=64;const c=tx.getContext('2d');c.fillStyle='#ddd1b4';c.fillRect(0,0,128,64);c.strokeStyle='rgba(110,90,60,.5)';for(let i=0;i<128;i+=10){c.beginPath();c.moveTo(i,0);c.lineTo(i+4,64);c.stroke()}
  const pm=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(tx),roughness:.9,side:THREE.DoubleSide});const peto=new THREE.Mesh(new THREE.CylinderGeometry(.6,.64,1.05,16,1,true,-Math.PI*.15,Math.PI*1.3),pm);peto.rotation.z=Math.PI/2;peto.rotation.y=Math.PI/2;peto.position.set(0,1.2,0);peto.scale.set(1,1.85,1);peto.castShadow=true;body.add(peto)}
 if(o.mule)for(const [c,y] of [['#c0303a',.14],['#e6bb55',.2],['#2b5aa0',.26]])mesh(G.sph,M(c,.7),.06,.06,.06,0,y,.0,hd,true);
 root.scale.setScalar(o.mule?.86:1);return {root,body,legs,nk,hd,tp,ph:Math.random()*6}}
function animHorse(H,dt,sp){H.ph+=dt*(sp>.02?3+sp*5:0);const a=Math.min(1.2,sp)*.45,gal=sp>1.1,off=gal?[0,.4,Math.PI,Math.PI+.4]:[0,Math.PI,Math.PI*.5,Math.PI*1.5];
 H.legs.forEach((l,i)=>{const s=Math.sin(H.ph+off[i]);l.hip.rotation.x=s*a;l.kn.rotation.x=(l.f?1:-1)*Math.max(0,Math.sin(H.ph+off[i]+1.1))*a*1.4});
 const now=performance.now();H.body.position.y=Math.abs(Math.sin(H.ph))*.05*Math.min(1,sp);H.nk.rotation.x=.62+Math.sin(H.ph*2)*.05*Math.min(1,sp)+(sp<.05?Math.sin(now/1400)*.04:0);H.tp.rotation.x=.25+sp*.3;H.tp.rotation.z=Math.sin(now/500)*.15}
function makeTeam(){const root=new THREE.Group();const mules=[];const cols=['#3a2c22','#4b382a','#2e241d'];
 for(let i=0;i<3;i++){const m=makeHorse2({mule:true,col:cols[i],saddle:false});m.root.position.x=(i-1)*.95;root.add(m.root);mules.push(m)}
 mesh(geos().box,M('#6b4a2a'),3.2,.1,.1,0,.75,-1.25,root);
 const men=[0,1].map(i=>{const p=makePerson({jacket:'#f2ede2',pants:'#2a2a2a',shirt:'#f2ede2',belt:'#b01e2a',hat:'campero',hatc:'#1a1a1a'});p.root.position.set(i?2.1:-2.1,0,.4);root.add(p.root);return p});
 root.visible=false;return {root,mules,men}}
function dustPool(sc){const arr=[];const g=new THREE.SphereGeometry(1,8,6);for(let i=0;i<40;i++){const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:'#cdb48a',transparent:true,opacity:0,depthWrite:false}));m.visible=false;sc.add(m);arr.push({m,l:0})}return {arr,i:0}}
function dust(D,x,y,z,s){if(!D)return;const p=D.arr[D.i++%D.arr.length];p.m.position.set(x+R(-.3,.3),y+.2,z+R(-.3,.3));p.l=1;p.s=s||.4;p.m.visible=true}
function dustTick(D,dt){if(!D)return;for(const p of D.arr){if(p.l<=0)continue;p.l-=dt*.9;const k=1-p.l;p.m.scale.setScalar(p.s*(.4+k*1.6));p.m.position.y+=dt*.4;p.m.material.opacity=Math.max(0,p.l*.45);if(p.l<=0)p.m.visible=false}}

/* ---------- motor ---------- */
function init3D(){
 const d=document.createElement('div');d.id='w3d';d.hidden=true;
 d.innerHTML=`<canvas id="c3d"></canvas>
 <div class="h3top"><div class="h3info" id="h3info"></div><span class="sp"></span><button class="btn sm" id="h3fs" aria-label="Pantalla completa">⛶</button><button class="btn sm" id="h3snd">Sonido: sí</button><button class="btn sm" id="h3adv">Avanzar mes</button><button class="btn sm" id="h3exit">Salir</button></div>
 <div id="h3tasks" class="h3tasks" hidden></div>
 <div id="h3toro" class="h3pill" hidden></div><div id="h3carry" class="h3pill" hidden></div><div id="h3ban" class="h3ban" hidden></div>
 <div id="joy" aria-hidden="true"><div id="knob"></div></div>
 <div class="h3act"><button class="btn" id="h3do2" hidden></button><button class="btn" id="h3run">Correr</button><button class="btn oro" id="h3do" hidden></button></div>
 <div id="h3tt" class="h3plaza" hidden><span id="ttinfo" class="h3ttinfo"></span><button class="btn sm" id="ttend">Terminar con esta</button><button class="btn pri" id="ttcita">Citar</button><button class="btn oro" id="tttemp">¡Templar!</button></div>
 <div id="h3plaza" class="h3plaza" hidden><button class="btn sm" id="pv">Cámara: TV</button><button class="btn sm" id="ps">×1</button><button class="btn sm" id="pn">Siguiente toro</button><button class="btn sm oro" id="psal" hidden>Saludar desde el tercio</button><button class="btn sm" id="px">Salir de la plaza</button></div>
 <div id="h3ole" class="h3ole"></div>
 <div id="h3cap" class="h3cap" hidden></div><div id="h3dim" class="h3dim" hidden></div><div id="h3help" class="h3help"></div>`;
 document.body.appendChild(d);W3.root=d;
 const cv=$('#c3d');const R3=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
 const Q=typeof getQual==='function'?getQual():'alta';W3.q=Q;R3.setPixelRatio(Math.min({alta:1.6,media:1.2,baja:.9}[Q]||1.2,window.devicePixelRatio||1));R3.shadowMap.enabled=Q!=='baja';R3.shadowMap.type=THREE.PCFSoftShadowMap;
 W3.R=R3;W3.cam=new THREE.PerspectiveCamera(60,1,.1,700);W3.look=V3(0,1,0);
 const rs=()=>{const w=d.clientWidth,h=d.clientHeight;R3.setSize(w,h,false);W3.cam.aspect=w/h;W3.cam.updateProjectionMatrix()};W3.resize=rs;window.addEventListener('resize',rs);
 const joy=$('#joy'),knob=$('#knob');let jid=null,cx=0,cy=0;
 joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);const r=joy.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;mv(e)});
 const mv=e=>{if(e.pointerId!==jid)return;let dx=e.clientX-cx,dy=e.clientY-cy;const L=Math.hypot(dx,dy),m=48;if(L>m){dx*=m/L;dy*=m/L}knob.style.transform=`translate(${dx}px,${dy}px)`;W3.jx=dx/m;W3.jy=-dy/m};
 joy.addEventListener('pointermove',mv);const up=e=>{if(e.pointerId!==jid)return;jid=null;W3.jx=W3.jy=0;knob.style.transform=''};joy.addEventListener('pointerup',up);joy.addEventListener('pointercancel',up);
 let did=null,lx=0,ly=0;
 cv.addEventListener('pointerdown',e=>{did=e.pointerId;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(did)});
 cv.addEventListener('pointermove',e=>{if(e.pointerId!==did)return;W3.yaw-=(e.clientX-lx)*.006;W3.pitch=clamp(W3.pitch+(e.clientY-ly)*.004,.05,1.1);lx=e.clientX;ly=e.clientY;W3.camT=3});
 cv.addEventListener('pointerup',()=>did=null);cv.addEventListener('pointercancel',()=>did=null);
 cv.addEventListener('wheel',e=>{W3.zoom=clamp((W3.zoom||1)+e.deltaY*.001,.6,2);e.preventDefault()},{passive:false});
 const doBtn=$('#h3do');
 const press=()=>{const a=W3.act;if(!a)return;if(a.hold){W3.holding=true;W3.hold=0}else a.fn()};
 const release=()=>{W3.holding=false;W3.hold=0;doBtn.style.backgroundImage=''};
 doBtn.addEventListener('pointerdown',e=>{e.preventDefault();press()});doBtn.addEventListener('pointerup',release);doBtn.addEventListener('pointerleave',release);doBtn.addEventListener('pointercancel',release);
 doBtn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)press()}});doBtn.addEventListener('keyup',release);
 $('#h3do2').onclick=()=>{if(W3.act2)W3.act2.fn()};
 window.addEventListener('keydown',e=>{if(!W3.on||document.getElementById('ov'))return;const k=e.key.toLowerCase();if(W3.keys[k])return;W3.keys[k]=true;
  if(k==='e')press();if(k==='q'&&W3.act2)W3.act2.fn();if(k==='shift')W3.run=true;
  if(W3.mode==='tienta'){if(k===' '){e.preventDefault();ttTemplar()}if(k==='c')ttCitar()}});
 window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();W3.keys[k]=false;if(k==='shift')W3.run=false;if(k==='e')release()});
 $('#h3run').onclick=()=>{W3.run=!W3.run;$('#h3run').classList.toggle('oro',W3.run)};
 $('#h3snd').onclick=auToggle;$('#h3fs').onclick=()=>{try{const d=document;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{const e=d.documentElement;const r=(e.requestFullscreen||e.webkitRequestFullscreen);if(r){const p=r.call(e);if(p&&p.catch)p.catch(()=>{});try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(e2){}}}}catch(e){}};
 $('#h3tasks').onclick=()=>{W3.tasksMin=!W3.tasksMin;W3.tasksKey=''};
 $('#h3adv').onclick=()=>{advance();if(W3.mode==='finca')rebuildFinca()};
 $('#h3exit').onclick=()=>{if(W3.mode==='tienta')ttExit();else exit3D()};
 $('#pv').onclick=()=>{const v=['tv','tendido','callejon','toro'],n={tv:'TV',tendido:'tendido',callejon:'callejón',toro:'junto al toro'};CP.view=v[(v.indexOf(CP.view)+1)%4];CP.cut=true;$('#pv').textContent='Cámara: '+n[CP.view]};
 $('#ps').onclick=()=>{CP.spd=CP.spd===1?2:CP.spd===2?4:1;$('#ps').textContent='×'+CP.spd};
 $('#pn').onclick=()=>cpNext();$('#px').onclick=exitPlaza;$('#psal').onclick=saludar;
 $('#ttcita').onclick=ttCitar;$('#tttemp').addEventListener('pointerdown',e=>{e.preventDefault();ttTemplar()});$('#ttend').onclick=ttEndVaca;
 let last=performance.now();
 const loop=now=>{requestAnimationFrame(loop);if(!W3.on)return;const dt=Math.min(.05,(now-last)/1000);last=now;
  if(W3.mode==='finca')fincaTick(dt);else if(W3.mode==='plaza')plazaTick(dt);else if(W3.mode==='tienta')tientaTick(dt);
  if(W3.holding&&W3.act&&W3.act.hold){W3.hold+=dt;const p=Math.min(1,W3.hold/W3.act.dur);doBtn.style.backgroundImage=`linear-gradient(90deg,rgba(191,58,63,.85) ${p*100}%,transparent ${p*100}%)`;if(p>=1){const f=W3.act.fn;W3.holding=false;W3.hold=0;doBtn.style.backgroundImage='';f()}}
  if(W3.scene)R3.render(W3.scene,W3.cam)};
 requestAnimationFrame(loop)}
function show3D(){if(typeof THREE==='undefined'){toast('No se pudo cargar el motor 3D en este dispositivo');return false}
 if(!W3.R)init3D();auInit();W3.root.hidden=false;W3.on=true;document.body.style.overflow='hidden';W3.resize();return true}
function enter3D(){if(!show3D())return;W3.from='2d';enterFinca()}
function exit3D(){try{W3.wl&&W3.wl.release();W3.wl=null}catch(e){}W3.on=false;W3.mode=null;W3.drive=false;W3.ride=false;musicStop();crowdStop();ambStop();W3.root.hidden=true;document.body.style.overflow='';render()}
function hudInfo(){const h=Math.floor(W3.tod*24),mi=Math.floor((W3.tod*24-h)*60);$('#h3info').innerHTML=`<b>${MESES[S.month]} ${S.year}</b>${W3.mode==='finca'?` · ${String(h).padStart(2,'0')}:${String(mi).padStart(2,'0')}`:''} · ${eur(S.money)} · prestigio ${Math.round(S.pres)}`}
function hudMode(m){$('#h3plaza').hidden=m!=='plaza';$('#h3tt').hidden=m!=='tienta';$('#h3cap').hidden=m==='finca';$('#h3toro').hidden=m==='finca';$('#h3tasks').hidden=m!=='finca';
 $('#joy').hidden=m==='plaza';$('.h3act').hidden=m!=='finca';$('#h3adv').hidden=m!=='finca';$('#h3dim').hidden=true;$('#h3carry').hidden=true;$('#h3ban').hidden=true}
function ole(txt){const o=$('#h3ole');if(!o||!o.appendChild)return;const s=document.createElement('span');s.textContent=txt;s.style.left=(15+Math.random()*60)+'%';o.appendChild(s);setTimeout(()=>s.remove(),1600)}
function banner(txt,sub,dur){const e=$('#h3ban');e.innerHTML=`${esc(txt)}${sub?`<small>${esc(sub)}</small>`:''}`;e.hidden=false;clearTimeout(W3.banT);W3.banT=setTimeout(()=>{e.hidden=true},(dur||3.2)*1000)}

/* ---------- tareas de la finca ---------- */
function rkOf(a){if(a.role==='semental')return 'sem';if(a.sex==='H'||a.role==='vaca'||ageY(a)<=1)return 'vacas';return 'toros'}
function newRoto(){const rk=pick(['toros','vacas','sem']);const Rc=RECTS[rk];const sd=pick(['z0','x1','z1','x0'].filter(s=>s!==Rc.gate[0]));const hz=sd[0]==='z';const lo=hz?Rc.x0:Rc.z0,hi=hz?Rc.x1:Rc.z1;const c=R(lo+5,hi-5),fx=Rc[sd];return {rk,side:sd,a:c-2,b:c+2,x:hz?c:fx,z:hz?fx:c}}
function outward(r){const Rc=RECTS[r.rk];const cx=(Rc.x0+Rc.x1)/2,cz=(Rc.z0+Rc.z1)/2;if(r.side[0]==='x')return {x:r.x+Math.sign(r.x-cx)*6,z:r.z};return {x:r.x,z:r.z+Math.sign(r.z-cz)*6}}
function finTareas(rep){
 const c=campo();
 if(S.escapado){const a=byId(S.escapado.id);if(a&&a.st==='campo'){S.money-=800;rep.cost+=800;rep.lines.push(`Un vecino encontró a ${a.name} fuera de la finca y la Guardia Civil lo ha devuelto. Multa y gastos: 800 €.`)}S.escapado=null}
 if(S.roto){const grp=c.filter(a=>rkOf(a)===S.roto.rk&&!a.mark&&a.res==null&&ageY(a)>=1);if(grp.length&&Math.random()<.85){const a=pick(grp),o=outward(S.roto);S.escapado={id:a.id,rk:S.roto.rk,x:o.x,z:o.z};rep.lines.push(`Por la cerca rota del cercado de ${RKN[S.roto.rk]} se ha escapado ${a.name}${a.num!=null?' nº '+a.num:''}. Hay que devolverlo a caballo.`)}}
 else if(Math.random()<(mej('cercas')?.14:.3)){S.roto=newRoto();rep.lines.push(`El mayoral avisa: hay una cerca rota en el cercado de ${RKN[S.roto.rk]}.`)}
 const inj=c.filter(a=>a.salud<55).length;if(inj)rep.lines.push(`${inj} ${inj>1?'animales necesitan':'animal necesita'} cura. El botiquín está en el cuarto de aperos.`)}
function tareas(){const c=campo(),L=[];
 L.push({t:`Echar pienso en los comederos (${Math.min(4,S.fedM||0)}/4 sacos)`,d:(S.fedM||0)>=4});
 const sin=c.filter(a=>!a.herrado).length;if(S.month>=7&&sin)L.push({t:`Herrar becerros en la corraleta (${sin} pendientes)`,d:false});
 if(S.roto)L.push({t:`Reparar la cerca rota de ${RKN[S.roto.rk]} (herramientas en el cuarto de aperos)`,d:false});
 if(S.escapado){const a=byId(S.escapado.id);if(a)L.push({t:`Devolver a ${a.name} a su cercado, mejor a caballo`,d:false})}
 const inj=c.filter(a=>a.salud<55);if(inj.length)L.push({t:inj.length>1?`Curar a ${inj.length} animales lesionados`:`Curar a ${inj[0].name}, que está lesionado`,d:false});
 for(const o of S.offers.filter(o=>o.st==='nueva')){const mk=c.filter(a=>a.mark===o.id);if(!mk.length)continue;const en=mk.filter(a=>a.encd).length;L.push({t:`${o.feria}: apartados ${mk.length}/${o.n}, encerrados ${en}/${o.n}`,d:en===o.n&&mk.length===o.n})}
 if(S.offers.some(o=>o.st==='nueva')&&!c.some(a=>a.mark))L.push({t:'Apartar toros para las ofertas de las empresas',d:false});
 if(mej('placita')){const n=c.filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2).length;if(n)L.push({t:`Tentar ${n} hembras en la placita`,d:false})}
 if(S.porVer.length)L.push({t:'Ir a la plaza: hay una corrida de tu hierro',d:false});
 return L}
function drawTasks(){const el=$('#h3tasks');if(!el||el.hidden)return;const L=tareas();const key=(W3.tasksMin?'m':'')+L.map(x=>x.t+x.d).join('|');if(key===W3.tasksKey)return;W3.tasksKey=key;
 const pend=L.filter(x=>!x.d).length;el.innerHTML=W3.tasksMin?`<b>Tareas del mes · ${pend} pendientes</b>`:`<b>Tareas del mes</b><ul>${L.map(x=>`<li class="${x.d?'ok':''}">${esc(x.t)}</li>`).join('')}</ul>`}

/* ---------- la finca ---------- */
const RECTS={toros:{x0:36,x1:112,z0:-8,z1:72,gate:['x0',12,22]},vacas:{x0:-116,x1:-40,z0:-24,z1:56,gate:['x1',2,12]},sem:{x0:-30,x1:2,z0:-74,z1:-44,gate:['z1',-20,-12]},pen:{x0:-27,x1:-19,z0:-19,z1:-11,gate:['x1',-16,-13]},emb:{x0:22,x1:34,z0:-30,z1:-20,gate:['z1',25,31]}};
const FEEDS=[{x:46,z:20,r:'toros'},{x:-54,z:20,r:'vacas'},{x:-14,z:-58,r:'sem'}];
const INW={z0:[0,1],z1:[0,-1],x0:[1,0],x1:[-1,0]};
function openings(k){const Rc=RECTS[k];const L=[[...Rc.gate]];if(S.roto&&S.roto.rk===k)L.push([S.roto.side,S.roto.a,S.roto.b]);
 return L.map(([sd,a,b])=>{const c=(a+b)/2,hz=sd[0]==='z',x=hz?c:Rc[sd],z=hz?Rc[sd]:c,n=INW[sd];return {x,z,ix:x+n[0]*4,iz:z+n[1]*4}})}
function gH(x,z){const d=Math.hypot(x,z),f=clamp((d-55)/40,0,1);return(1.3*Math.sin(x*.021)*Math.cos(z*.026)+.7*Math.sin(x*.052+z*.031)+.35*Math.sin(z*.09))*f}
function enterFinca(){W3.mode='finca';hudMode('finca');
 if(!W3.F||W3.F.key!==S.g.name){W3.F={key:S.g.name,p:V3(0,0,16),yaw:0,carry:null,toss:0,hits:0,uses:0};W3.truck={x:11,z:12,yaw:-.4,v:0};W3.horse={x:-12,z:13.4,yaw:0,v:0}}
 W3.drive=false;W3.ride=false;W3.tasksKey='';rebuildFinca();W3.yaw=Math.PI*.15;
 $('#h3help').textContent='Joystick para andar · arrastra para mirar · el botón dorado actúa (algunos hay que mantenerlos pulsados)';setTimeout(()=>{const h=$('#h3help');if(h)h.textContent=''},7000)}
function rebuildFinca(){
 if(W3.mode!=='finca')return;
 const sc=new THREE.Scene();const m=S.month;
 const skyC=m>=11||m<=1?'#a9c3d6':m>=5&&m<=7?'#9fc4e3':'#92bde0';sc.background=new THREE.Color(skyC);sc.fog=new THREE.Fog(skyC,90,260);W3.skyDay=new THREE.Color(skyC);
 W3.rainOn=mulberry(S.year*13+m*7)()<([0,1,2,3,9,10,11].includes(m)?.45:.06);
 const hemi=new THREE.HemisphereLight('#dce9f5','#6b5a3a',.75);sc.add(hemi);W3.hemi=hemi;
 const sun=new THREE.DirectionalLight('#fff0d4',1.15);sun.position.set(40,70,25);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:200});sun.shadow.bias=-.0006;sc.add(sun);sc.add(sun.target);W3.sun=sun;
 const G=geos();const col=[];W3.col=col;const acts=[];W3.acts=acts;W3.D=dustPool(sc);
 const tg=new THREE.PlaneGeometry(600,600,150,150);tg.rotateX(-Math.PI/2);const pos=tg.attributes.position;const cols=new Float32Array(pos.count*3);
 const gr=m>=2&&m<=4?['#7d8f3d','#99a64e']:m>=5&&m<=7?['#c3a25c','#a98c4b']:m>=8&&m<=10?['#a19555','#867e45']:['#7f8f52','#66753f'];
 const ca=new THREE.Color(gr[0]),cb=new THREE.Color(gr[1]),cc=new THREE.Color('#b9a47a'),tmp=new THREE.Color();const rn=mulberry(5);
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,gH(x,z));tmp.copy(ca).lerp(cb,.5+.5*Math.sin(x*.07+z*.05)*Math.cos(z*.04)).lerp(cc,(Math.abs(x)<3.2&&z>12)?.85:Math.max(0,1-Math.hypot(x,z-2)/26)*.75);tmp.offsetHSL(0,0,(rn()-.5)*.04);cols.set([tmp.r,tmp.g,tmp.b],i*3)}
 tg.setAttribute('color',new THREE.BufferAttribute(cols,3));tg.computeVertexNormals();
 const ter=new THREE.Mesh(tg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95}));ter.receiveShadow=true;sc.add(ter);
 const reform=mej('casa');const wall=M(reform?'#f2ede2':'#d9cbae',.9),roof=M('#a4532f',.8),wood=M('#4a2c1a',.7);
 W3.win=new THREE.MeshStandardMaterial({color:'#2b2420',emissive:'#ffc36b',emissiveIntensity:0,roughness:.6});
 const cj=new THREE.Group();sc.add(cj);
 mesh(G.box,wall,18,5,10,0,2.5,0,cj);
 const rs=new THREE.Shape();rs.moveTo(-5.6,0);rs.lineTo(5.6,0);rs.lineTo(0,2.4);rs.closePath();const rg=new THREE.ExtrudeGeometry(rs,{depth:18.8,bevelEnabled:false});rg.translate(0,0,-9.4);
 const rf=new THREE.Mesh(rg,roof);rf.rotation.y=Math.PI/2;rf.position.y=5;rf.castShadow=true;cj.add(rf);
 mesh(G.box,wood,1.7,2.7,.2,0,1.35,5.05,cj);
 for(const x of [-6,-3.2,3.2,6]){mesh(G.box,W3.win,1.1,1.3,.15,x,2.6,5.05,cj);mesh(G.box,wall,1.4,.15,.3,x,1.9,5.1,cj)}
 mesh(G.box,wall,1.2,1.6,1.2,5,6.2,-1,cj);
 const ht=document.createElement('canvas');ht.width=ht.height=128;const hc=ht.getContext('2d');hc.fillStyle='#efe6d2';hc.fillRect(0,0,128,128);hc.strokeStyle='#3a2c22';hc.lineWidth=5;hc.strokeRect(6,6,116,116);
 hc.fillStyle='#2a1f17';hc.font='64px "Cinzel", Georgia, serif';hc.textAlign='center';hc.textBaseline='middle';hc.fillText((S.g.hierro.l||'?').slice(0,2).toUpperCase(),64,70);
 const az=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(ht),roughness:.6}));az.position.set(0,3.4,5.12);cj.add(az);
 if(reform){for(let i=-3;i<=3;i++){mesh(G.box,wall,.5,2.6,.5,i*2.4,1.3,7.6,cj)}mesh(G.box,roof,18,.35,3.2,0,2.75,6.6,cj);
  for(const x of [-7.5,-4.5,4.5,7.5]){mesh(G.cyl,M('#9b4a2a'),.3,.4,.3,x,.2,8.4,cj);mesh(G.sph,M('#c0303a',.8),.35,.25,.35,x,.55,8.4,cj)}
  mesh(G.box,wood,2.2,.4,.6,-2.5,.45,8.6,cj)}
 col.push({t:'box',x0:-9.4,x1:9.4,z0:-5.4,z1:reform?7.9:5.4});
 for(const [x,z,w,d] of [[-16,0,.6,14],[16,-3,.6,8],[-12.5,-7,7,.6],[12.5,-7,7,.6]]){mesh(G.box,wall,w,1.6,d,x,.8,z,sc);col.push({t:'box',x0:x-w/2-.2,x1:x+w/2+.2,z0:z-d/2-.2,z1:z+d/2+.2})}
 acts.push({x:0,z:6.4,r:2.6,l:'Entrar al despacho',fn:despacho});
 const tb=new THREE.Group();tb.position.set(-5.5,0,8.5);sc.add(tb);mesh(G.box,wood,.15,1.8,.15,-.7,.9,0,tb);mesh(G.box,wood,.15,1.8,.15,.7,.9,0,tb);mesh(G.box,M('#c9b08a'),1.8,1,.08,0,1.5,0,tb);
 acts.push({x:-5.5,z:8.5,r:2.2,l:'Obras y mejoras',fn:obras});
 const may=makePerson({jacket:'#55613e',pants:'#3a3530',shirt:'#ece6da',hat:'campero',hatc:'#5a5148',pole:3.2,belt:'#2a2420'});may.root.position.set(4.5,0,9.5);may.root.rotation.y=-.6;sc.add(may.root);W3.may=may;
 acts.push({x:4.5,z:9.5,r:2.4,l:'Hablar con el mayoral',fn:mayoral});
 // cuarto de aperos
 const ap=new THREE.Group();ap.position.set(-21,0,2);sc.add(ap);mesh(G.box,wall,4.2,2.6,3,0,1.3,0,ap);mesh(G.box,roof,4.6,.25,3.4,0,2.7,0,ap);mesh(G.box,wood,1,2,.1,.9,1,1.52,ap);
 mesh(G.box,M('#c0303a',.6),.5,.35,.3,-1.2,1.1,1.6,ap);mesh(G.box,M('#f4f0e6'),.08,.25,.31,-1.2,1.1,1.61,ap,true);mesh(G.box,M('#f4f0e6'),.25,.08,.31,-1.2,1.1,1.61,ap,true);
 mesh(G.box,wood,.9,.1,.4,.9,.9,1.75,ap);mesh(G.cyl,M('#6b5640'),.03,1,.03,.7,1.3,1.75,ap,true).rotation.z=.3;mesh(G.box,M('#555',.4,.6),.25,.12,.05,.95,1.75,1.75,ap,true);
 col.push({t:'box',x0:-23.3,x1:-18.7,z0:.3,z1:3.7});
 acts.push({x:-22.2,z:4.4,r:1.5,l:'Coger el botiquín',cond:()=>!W3.F.carry&&!W3.ride,fn:()=>{W3.F.uses=3;carry('botiquin')}});
 acts.push({x:-19.9,z:4.4,r:1.5,l:'Coger las herramientas',cond:()=>!W3.F.carry&&!W3.ride,fn:()=>carry('herr')});
 // caballo
 mesh(G.box,wood,.15,1.2,.15,-12,.6,15.6,sc);mesh(G.box,wood,2.4,.12,.12,-12,1.1,15.6,sc);
 W3.horseM=makeHorse2({col:'#6b4a33'});sc.add(W3.horseM.root);
 // camioneta
 const tr=new THREE.Group();sc.add(tr);const tc=M('#4d5a35',.5,.3);
 mesh(G.box,tc,2,.9,4.6,0,.95,0,tr);mesh(G.box,tc,1.9,.8,2,0,1.8,.6,tr);mesh(G.box,M('#9fb6c4',.1,.5),1.92,.55,.05,0,1.9,1.62,tr);
 mesh(G.box,M('#e9e2c8',.3,.2),.3,.15,.05,.65,1.05,2.31,tr,true);mesh(G.box,M('#e9e2c8',.3,.2),.3,.15,.05,-.65,1.05,2.31,tr,true);
 const wheels=[];for(const [x,z] of [[1,1.5],[-1,1.5],[1,-1.5],[-1,-1.5]]){const wg=new THREE.Group();wg.position.set(x,.42,z);tr.add(wg);const w=mesh(G.cyl,M('#151515',.6),.42,.3,.42,0,0,0,wg);w.rotation.z=Math.PI/2;wheels.push(wg)}
 W3.truckM={g:tr,wheels};
 const gate=new THREE.Group();gate.position.set(0,gH(0,96),96);sc.add(gate);mesh(G.box,M('#e9e2d4'),1,3.4,1,-4,1.7,0,gate);mesh(G.box,M('#e9e2d4'),1,3.4,1,4,1.7,0,gate);mesh(G.box,M('#2a221c',.4,.5),9,.5,.3,0,3.6,0,gate);
 const gt=document.createElement('canvas');gt.width=512;gt.height=64;const gc=gt.getContext('2d');gc.fillStyle='#2a221c';gc.fillRect(0,0,512,64);gc.fillStyle='#e6bb55';gc.font='36px "Cinzel", Georgia, serif';gc.textAlign='center';gc.fillText(S.g.name.toUpperCase().slice(0,22),256,46);
 const gp=new THREE.Mesh(new THREE.PlaneGeometry(8,1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(gt)}));gp.position.set(0,4.3,0);gate.add(gp);const gp2=gp.clone();gp2.rotation.y=Math.PI;gate.add(gp2);
 col.push({t:'circ',x:-4,z:96,r:.8},{t:'circ',x:4,z:96,r:.8});W3.porteria={x:0,z:96};
 if(mej('placita')){const pl=new THREE.Group();pl.position.set(-30,0,24);sc.add(pl);
  const w=new THREE.Mesh(new THREE.CylinderGeometry(7,7,1.8,40,1,true),M('#f1ece0',.9,0,THREE.DoubleSide));w.position.y=.9;w.castShadow=true;w.receiveShadow=true;pl.add(w);
  const tr2=new THREE.Mesh(new THREE.TorusGeometry(7,.12,6,48),M('#a8402f'));tr2.rotation.x=Math.PI/2;tr2.position.y=1.82;pl.add(tr2);
  const fl=new THREE.Mesh(new THREE.CircleGeometry(6.95,40),M('#d6a75f',.95));fl.rotation.x=-Math.PI/2;fl.position.y=.03;fl.receiveShadow=true;pl.add(fl);
  for(const a of [0,2.1,4.2]){mesh(G.box,M('#8e2a26'),1.4,1.6,.12,Math.sin(a)*6.4,.8,Math.cos(a)*6.4,pl).rotation.y=a}
  mesh(G.box,wall,3,2.6,2,0,1.3,-8,pl);
  col.push({t:'circ',x:-30,z:24,r:7.4});
  const nH=()=>campo().filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2).length;
  acts.push({x:-30,z:24,r:9.8,plac:true,l:()=>{const n=nH();return n?`Placita: tentar ${n} ${n>1?'hembras':'hembra'}`:'Placita: tentar un macho'},fn:()=>{if(nH())startTienta('H');else machoModal()}})}
 // corrales y embarcadero
 if(mej('corrales')){const lr=new THREE.Group();lr.position.set(28,0,-37);sc.add(lr);mesh(G.box,M('#d9d4c8',.5,.2),2.6,2.8,7,0,2.2,0,lr);mesh(G.box,M('#8e2a26',.5,.2),2.6,2.2,2.2,0,1.7,-4.6,lr);
  for(const z of [-2.5,2.5,-4.6])for(const x of [1.3,-1.3]){const w=mesh(G.cyl,M('#151515'),.55,.35,.55,x,.55,z,lr);w.rotation.z=Math.PI/2}
  const ramp=mesh(G.box,M('#6e5a44'),2.4,.3,3,28,.7,-32,sc);ramp.rotation.x=.25;col.push({t:'box',x0:26.5,x1:29.5,z0:-42,z1:-33.4})}
 acts.push({x:28,z:-17.5,r:3.2,l:'Corrales: embarcar toros',fn:ofertasModal});
 if(mej('nave')){const nv=new THREE.Group();nv.position.set(6,0,-26);sc.add(nv);mesh(G.box,M('#9aa1a3',.55,.35),14,6,9,0,3,0,nv);mesh(G.box,M('#7c8285',.5,.4),14.6,.3,9.6,0,6.1,0,nv);
  for(const x of [9.5,12.5]){mesh(G.cyl,M('#c7cbcc',.35,.6),1.3,7,1.3,x,4.5,0,nv);const cn=new THREE.Mesh(new THREE.ConeGeometry(1.3,1.6,14),M('#c7cbcc',.35,.6));cn.position.set(x,.6,0);cn.rotation.x=Math.PI;nv.add(cn)}
  col.push({t:'box',x0:-1.4,x1:20.4,z0:-31,z1:-21})}
 // cercados
 const postG=new THREE.CylinderGeometry(.08,.1,1.5,6);const posts=[];
 const cut=(lo,hi,gs)=>{let iv=[[lo,hi]];for(const [g0,g1] of gs){const n=[];for(const [a,b] of iv){if(g1<=a||g0>=b){n.push([a,b]);continue}if(g0>a)n.push([a,g0]);if(g1<b)n.push([g1,b])}iv=n}return iv};
 for(const [k,Rc] of Object.entries(RECTS)){
  const gaps=[Rc.gate];if(S.roto&&S.roto.rk===k)gaps.push([S.roto.side,S.roto.a,S.roto.b]);
  const stone=(mej('cercas')&&['toros','vacas','sem'].includes(k))||(k==='emb'&&mej('corrales')),wood=k==='pen'||(k==='emb'&&!mej('corrales'));
  for(const sd of ['z0','x1','z1','x0']){const hz=sd[0]==='z',fx=Rc[sd],lo=hz?Rc.x0:Rc.z0,hi=hz?Rc.x1:Rc.z1;
   for(const [a,b] of cut(lo,hi,gaps.filter(g=>g[0]===sd).map(g=>[g[1],g[2]]))){const p=hz?[a,fx]:[fx,a],q=hz?[b,fx]:[fx,b];col.push({t:'seg',a:p,b:q});const L=b-a;if(L<.5)continue;
    const mx=(p[0]+q[0])/2,mz=(p[1]+q[1])/2,ang=Math.atan2(q[0]-p[0],q[1]-p[1]);
    if(stone){const w=mesh(G.box,M('#a69c88',.98),.6,k==='emb'?1.9:1.1,L,mx,gH(mx,mz)+(k==='emb'?.95:.5),mz,sc);w.rotation.y=ang}
    else{for(let s2=0;s2<=L;s2+=wood?1.6:3.2)posts.push([p[0]+(q[0]-p[0])*s2/L,p[1]+(q[1]-p[1])*s2/L]);for(const h of (wood?[.35,.7,1.05,1.4]:[.45,.85,1.25])){const w=mesh(G.box,wood?M('#6b5640',.9):M('#8d8d88',.4,.6),wood?.06:.025,wood?.1:.025,L,mx,gH(mx,mz)+h,mz,sc,true);w.rotation.y=ang}}}}}
 if(posts.length){const im=new THREE.InstancedMesh(postG,M('#6b5640',.9),posts.length);const o=new THREE.Object3D();posts.forEach((p,i)=>{o.position.set(p[0],gH(p[0],p[1])+.75,p[1]);o.updateMatrix();im.setMatrixAt(i,o.matrix)});im.castShadow=true;sc.add(im)}
 if(S.roto){const r=S.roto,y=gH(r.x,r.z);for(let i=0;i<3;i++){const pp=mesh(G.cyl,M('#6b5640',.9),.08,1.5,.08,r.x+R(-1.5,1.5),y+.12,r.z+R(-1.5,1.5),sc);pp.rotation.set(Math.PI/2,R(0,3),0)}
  acts.push({x:r.x,z:r.z,r:2.8,l:'Reparar la cerca',hold:true,dur:2.5,cond:()=>W3.F.carry==='herr',fn:repararCerca})}
 W3.feeds=FEEDS.map((f,i)=>{const g=new THREE.Group();g.position.set(f.x,gH(f.x,f.z),f.z);g.rotation.y=.3;sc.add(g);
  if(mej('comederos')){mesh(G.box,M('#7c776d',.9),1.2,.7,5,0,.35,0,g);col.push({t:'circ',x:f.x,z:f.z,r:1.4})}
  const fill=mesh(G.box,M('#b89a5e',.95),mej('comederos')?.9:2.2,.3,mej('comederos')?4.6:3,0,mej('comederos')?.55:0,0,g,true);
  const st=S.feedSpots&&S.feedSpots[i]||0;fill.scale.y=Math.max(.001,st*.3);fill.visible=st>0;return {...f,g,fill,lvl:st}});
 if(mej('abrev')){for(const [x,z,r] of [[60,46,1.2],[-70,28,1],[-14,-62,0]]){const g=new THREE.Group();g.position.set(x,gH(x,z),z);g.rotation.y=r;sc.add(g);mesh(G.box,M('#9c9a92',.9),1.2,.7,5,0,.35,0,g);mesh(G.box,M('#4f7d8f',.15,.2),.9,.05,4.6,0,.68,0,g,true);col.push({t:'circ',x,z,r:1.6})}}
 else{const pd=new THREE.Mesh(new THREE.CircleGeometry(5,24),M('#5c6f5a',.2,.1));pd.rotation.x=-Math.PI/2;pd.position.set(-70,gH(-70,30)+.06,30);sc.add(pd)}
 const rem=new THREE.Group();rem.position.set(32,0,24);sc.add(rem);mesh(G.box,M('#7a6a4a'),2,1.1,3,0,.9,0,rem);for(let i=0;i<5;i++)mesh(G.box,M('#d9c79a'),.7,.3,.45,-.4+(i%2)*.8,1.6+Math.floor(i/2)*.3,-.8+i*.35,rem);col.push({t:'circ',x:32,z:24,r:1.8});
 acts.push({x:32,z:24,r:2.8,l:'Coger un saco de pienso',cond:()=>!W3.F.carry&&!W3.ride,fn:()=>carry('saco')});
 const lum=new THREE.Group();lum.position.set(-15.5,0,-13);sc.add(lum);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;mesh(G.sph,M('#6f6a62'),.22,.16,.22,Math.cos(a)*.6,.1,Math.sin(a)*.6,lum,true)}
 const fireOn=S.month>=7&&campo().some(a=>!a.herrado);
 W3.flames=[0,1,2].map(i=>{const f=new THREE.Mesh(new THREE.ConeGeometry(.22-i*.05,.7-i*.12,7),new THREE.MeshBasicMaterial({color:i?'#ffb347':'#ff6a1a',transparent:true,opacity:.9}));f.position.set((i-1)*.15,.35,0);f.visible=fireOn;lum.add(f);return f});
 acts.push({x:-15.5,z:-13,r:2.2,l:()=>fireOn?'Coger el hierro de la lumbre':'Lumbre del herradero',cond:()=>!W3.F.carry&&!W3.ride,fn:()=>{if(!fireOn){toast(S.month<7?'El herradero se hace de agosto a diciembre':'No quedan becerros sin herrar');return}carry('hierro')}});
 col.push({t:'circ',x:-15.5,z:-13,r:.9});
 for(const [k,d] of Object.entries(MEJ)){if(mej(k))continue;const [x,z]=d.pos;const g=new THREE.Group();g.position.set(x,gH(x,z),z);sc.add(g);
  mesh(G.box,M('#5a3d26'),.12,1.6,.12,0,.8,0,g);mesh(G.box,M('#e0962f',.7),1.4,.8,.08,0,1.5,0,g);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;mesh(G.cyl,M('#e0962f'),.05,.6,.05,Math.cos(a)*1.6,.3,Math.sin(a)*1.6,g,true)}
  acts.push({x,z,r:2.6,l:`Solar: ${d.n}`,cond:()=>!W3.ride,fn:()=>construir(k)})}
 const tp=[];const rt=mulberry(S.g.name.length*13+3);
 const blocked=(x,z)=>(x>-42&&x<40&&z>-44&&z<34)||Math.abs(x)<6&&z>10;
 while(tp.length<300){const x=(rt()-.5)*540,z=(rt()-.5)*540;if(blocked(x,z))continue;tp.push([x,z,.75+rt()*.7,rt()*6])}
 const trunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.28,.42,2.4,7),M('#4a3626',.95),tp.length);
 const crown=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(2.6,1),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.9,flatShading:true}),tp.length*2);
 const o=new THREE.Object3D(),cc2=new THREE.Color();
 tp.forEach(([x,z,s,r],i)=>{const y=gH(x,z);o.position.set(x,y+1.2*s,z);o.scale.set(s,s,s);o.rotation.set(0,r,(r-3)*.03);o.updateMatrix();trunk.setMatrixAt(i,o.matrix);
  for(let j=0;j<2;j++){o.position.set(x+(j?1.4:-1)*s,y+(3.3+j*.5)*s,z+(j?-.6:.8)*s);o.scale.set(s*(1.2-j*.25),s*(.62-j*.08),s*(1.15-j*.2));o.rotation.set(0,r+j,0);o.updateMatrix();crown.setMatrixAt(i*2+j,o.matrix);
   cc2.setHSL(.2+rt()*.04,.32+rt()*.1,.2+rt()*.07);crown.setColorAt(i*2+j,cc2)}
  if(Math.hypot(x,z)<160)col.push({t:'circ',x,z,r:.6*s})});
 trunk.castShadow=crown.castShadow=true;crown.receiveShadow=true;sc.add(trunk,crown);
 // lluvia
 W3.rainG=null;if(W3.rainOn){const N=700,g=new THREE.BufferGeometry(),arr=new Float32Array(N*6);W3.drops=[];for(let i=0;i<N;i++){W3.drops.push([R(-25,25),R(0,20),R(-25,25)])}
  g.setAttribute('position',new THREE.BufferAttribute(arr,3));const ls=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:'#c8d4e0',transparent:true,opacity:.45}));ls.frustumCulled=false;sc.add(ls);W3.rainG=ls}
 // camada
 W3.herd=[];const cmp=campo();const esc0=S.escapado&&byId(S.escapado.id)&&byId(S.escapado.id).st==='campo'?byId(S.escapado.id):null;
 const addB=(a,kind,Rc,rk)=>{const mm=morf(a);const B=makeBull({pelo:a.pelo,kind,m:mm});const x=Rc.x0+2+Math.random()*(Rc.x1-Rc.x0-4),z=Rc.z0+2+Math.random()*(Rc.z1-Rc.z0-4);B.root.position.set(x,gH(x,z),z);sc.add(B.root);
  const h={a,B,R:Rc,rk,x,z,tx:x,tz:z,mode:'idle',t:Math.random()*4,yaw:Math.random()*6,kind,bravo:kind==='toro',pow:(a.peso*(a.g.fue+40))*(1+mm.morr*.25),mk:null,jump:0,free:false,target:null,tk:null};
  W3.herd.push(h);if(a.mark)markBull(h,true);return h};
 const pr=a=>(a.mark?2:0)+(a.salud<55?1:0);
 const pen=S.month>=7?cmp.filter(a=>!a.herrado&&a!==esc0).slice(0,8):[];
 cmp.filter(a=>a.encd&&a.mark&&a!==esc0).forEach(a=>addB(a,'toro',RECTS.emb,'emb'));
 cmp.filter(a=>a.sex==='M'&&!a.role&&ageY(a)>=2&&!a.encd&&a!==esc0).sort((a,b)=>pr(b)-pr(a)||a.born-b.born||b.peso-a.peso).slice(0,14).forEach(a=>addB(a,'toro',RECTS.toros,'toros'));
 const vac=cmp.filter(a=>a.role==='vaca'&&a!==esc0).sort((a,b)=>pr(b)-pr(a)).slice(0,10);vac.forEach(a=>addB(a,'vaca',RECTS.vacas,'vacas'));
 const hasM=a=>vac.some(v=>v.id===(a.madre&&a.madre.id))?1:0;
 cmp.filter(a=>ageY(a)<=1&&!a.role&&!pen.includes(a)&&a!==esc0).sort((a,b)=>hasM(b)-hasM(a)).slice(0,7).forEach(a=>addB(a,'becerro',RECTS.vacas,'vacas'));
 cmp.filter(a=>a.sex==='H'&&!a.role&&ageY(a)>=2&&a!==esc0).sort((a,b)=>pr(b)-pr(a)).slice(0,4).forEach(a=>addB(a,'vaca',RECTS.vacas,'vacas'));
 cmp.filter(a=>a.role==='semental'&&a!==esc0).slice(0,3).forEach(a=>addB(a,'toro',RECTS.sem,'sem'));
 pen.forEach(a=>{const h=addB(a,'becerro',RECTS.pen,'pen');h.bravo=false});
 if(esc0){const rk=S.escapado.rk,kind=rk==='vacas'?(esc0.sex==='H'?'vaca':'becerro'):'toro';const h=addB(esc0,kind,RECTS[rk],rk);h.x=S.escapado.x;h.z=S.escapado.z;h.free=true;h.target=RECTS[rk];h.tk=rk;h.escaped=true}
 for(const h of W3.herd)if(h.kind==='becerro'&&h.rk!=='pen')h.mother=W3.herd.find(x=>x.a.id===(h.a.madre&&h.a.madre.id)&&x.kind==='vaca')||null;
 const pl=makePerson({jacket:'#5a3b25',shirt:'#f0ebe0',pants:'#3a3530',hat:'campero',belt:'#2a2420'});sc.add(pl.root);W3.pl=pl;
 W3.sack=mesh(G.box,M('#d9c79a'),.5,.28,.7,0,1.65,-.18,null);W3.sack.rotation.z=.3;pl.b.add(W3.sack);
 W3.iron=new THREE.Group();const rod=mesh(G.cyl,M('#3a3a3a',.4,.7),.02,1.2,.02,0,0,.55,W3.iron,true);rod.rotation.x=Math.PI/2;
 W3.ironTip=mesh(G.box,new THREE.MeshBasicMaterial({color:'#ff5a1f'}),.2,.2,.04,0,0,1.15,W3.iron,true);pl.arms[1].hand.add(W3.iron);
 W3.kit=mesh(G.box,M('#c0303a',.6),.32,.24,.14,0,-.1,.05,null);pl.arms[1].hand.add(W3.kit);
 W3.tools=new THREE.Group();mesh(G.cyl,M('#6b5640'),.03,.9,.03,0,-.1,.2,W3.tools,true).rotation.x=1.3;mesh(G.box,M('#555',.4,.6),.22,.1,.05,0,-.05,.62,W3.tools,true);pl.arms[1].hand.add(W3.tools);
 W3.garr=mesh(G.cyl,M('#a88b5a',.7),.025,3.8,.025,0,-.1,.5,null);W3.garr.rotation.x=1.25;pl.arms[1].hand.add(W3.garr);
 setCarry();
 W3.scene=sc;hudInfo();ambStart(W3.rainOn);W3.tasksKey=''}
function setCarry(){const c=W3.F.carry;if(W3.sack)W3.sack.visible=c==='saco';if(W3.iron)W3.iron.visible=c==='hierro';if(W3.kit)W3.kit.visible=c==='botiquin';if(W3.tools)W3.tools.visible=c==='herr';if(W3.garr)W3.garr.visible=!!W3.ride;
 if(W3.pl){const ar=W3.pl.arms;ar[0].lock=c==='saco'?1:0;ar[1].lock=c||W3.ride?1:0;if(c==='saco'){ar[0].sh.rotation.set(-2.5,0,-.2);ar[1].sh.rotation.set(-.3,0,0)}if(c&&c!=='saco'){ar[1].sh.rotation.set(-.7,0,0);ar[1].el.rotation.x=-.4}if(W3.ride&&!c){ar[1].sh.rotation.set(-.5,0,0);ar[1].el.rotation.x=-.3}}
 const p=$('#h3carry');if(p){p.hidden=!c;p.textContent={saco:'Llevas un saco de pienso (25 kg)',hierro:'Llevas el hierro al rojo',botiquin:`Llevas el botiquín (${W3.F.uses} curas)`,herr:'Llevas las herramientas'}[c]||''}}
function carry(c){W3.F.carry=c;setCarry();toast({saco:'Saco al hombro. Llévalo a un comedero.',hierro:'Hierro al rojo. Busca un becerro en la corraleta.',botiquin:'Botiquín cogido. Busca a los animales que cojean.',herr:'Herramientas listas. Busca la cerca rota.'}[c])}
function markBull(h,on){if(h.mk){h.B.b.remove(h.mk);h.mk=null}if(on){h.mk=mesh(geos().sph,M('#f4f1ea',.9),.3,.16,.3,.3,1.55,-.7,h.B.b,true)}}
function collide(p,r=.42,skipTruck){
 for(const c of W3.col){
  if(c.t==='box'){if(p.x>c.x0-r&&p.x<c.x1+r&&p.z>c.z0-r&&p.z<c.z1+r){const d=[p.x-(c.x0-r),(c.x1+r)-p.x,p.z-(c.z0-r),(c.z1+r)-p.z];const mi=Math.min(...d);if(mi===d[0])p.x=c.x0-r;else if(mi===d[1])p.x=c.x1+r;else if(mi===d[2])p.z=c.z0-r;else p.z=c.z1+r;p.hit=1}}
  else if(c.t==='circ'){const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),m=c.r+r;if(d<m&&d>1e-4){p.x=c.x+dx/d*m;p.z=c.z+dz/d*m;p.hit=1}}
  else{const [ax,az]=c.a,[bx,bz]=c.b;const vx=bx-ax,vz=bz-az,L2=vx*vx+vz*vz;let t=((p.x-ax)*vx+(p.z-az)*vz)/L2;t=clamp(t,0,1);const qx=ax+vx*t,qz=az+vz*t,dx=p.x-qx,dz=p.z-qz,d=Math.hypot(dx,dz);if(d<r){if(d>1e-4){p.x=qx+dx/d*r;p.z=qz+dz/d*r}else{p.x=qx+r}p.hit=1}}}
 if(!skipTruck&&W3.truck&&!W3.drive){const T=W3.truck,dx=p.x-T.x,dz=p.z-T.z,d=Math.hypot(dx,dz),m=2.3+r;if(d<m&&d>1e-4){p.x=T.x+dx/d*m;p.z=T.z+dz/d*m}}
 p.x=clamp(p.x,-275,275);p.z=clamp(p.z,-275,275)}
const inR=(Rc,x,z,mg=0)=>x>Rc.x0+mg&&x<Rc.x1-mg&&z>Rc.z0+mg&&z<Rc.z1-mg;
function tossPlayer(dx,dz,bull){const F=W3.F;if(F.toss>0)return;try{navigator.vibrate&&navigator.vibrate([60,40,120])}catch(e){}F.toss=2.2;F.tv={x:dx*5,z:dz*5};F.carry=null;setCarry();bufido(.8);
 const now=performance.now();F.hits=(F.lastHit&&now-F.lastHit<40000)?F.hits+1:1;F.lastHit=now;
 if(F.hits>=2){S.money-=2500;save();toast(`${bull} te ha cogido otra vez. Urgencias y puntos: −2.500 €. Sal del cercado.`)}else toast(`¡Revolcón de ${bull}! Te levantas dolorido.`)}
function dayTick(dt){
 W3.tod=(W3.tod+dt/480)%1;const ang=(W3.tod-.25)*Math.PI*2,el=Math.sin(ang),dl=clamp(el*2.2+.25,0,1),rf=W3.rainOn?.55:1;
 const F=W3.F,sun=W3.sun;sun.intensity=(.08+1.05*dl)*rf;sun.color.setRGB(1,.72+.26*dl,.5+.42*dl);sun.position.set(F.p.x+Math.cos(ang)*70,10+Math.max(0,el)*70,F.p.z+25);sun.target.position.set(F.p.x,0,F.p.z);
 W3.hemi.intensity=(.22+.55*dl)*(W3.rainOn?.85:1);
 const night=W3.cN||(W3.cN=new THREE.Color('#0d1828')),dusk=W3.cD||(W3.cD=new THREE.Color('#e3a27c')),grey=W3.cG||(W3.cG=new THREE.Color('#8f979e'));
 const sky=W3.scene.background;sky.copy(night).lerp(dusk,clamp(dl*2,0,1)).lerp(W3.skyDay,clamp(dl*2-1,0,1));if(W3.rainOn)sky.lerp(grey,.55*dl);W3.scene.fog.color.copy(sky);
 if(W3.win)W3.win.emissiveIntensity=(1-dl)*1.2;
 if(W3.rainG){const a=W3.rainG.geometry.attributes.position.array;if(a){W3.drops.forEach((d,i)=>{d[1]-=dt*18;if(d[1]<0){d[1]+=20;d[0]=R(-25,25);d[2]=R(-25,25)}a.set([d[0],d[1],d[2],d[0]+.05,d[1]+.6,d[2]],i*6)});W3.rainG.geometry.attributes.position.needsUpdate=true}W3.rainG.position.set(F.p.x,F.p.y,F.p.z)}
 W3.ambT=(W3.ambT||0)-dt;if(W3.ambT<=0){W3.ambT=R(2.5,6);const r=Math.random();
  if(dl>.4&&!W3.rainOn&&r<.45)bird(R(.5,1));
  else{const near=W3.herd.reduce((m,h)=>{const d=Math.hypot(h.x-F.p.x,h.z-F.p.z);return d<m.d?{d,h}:m},{d:1e9,h:null});if(near.h&&near.d<45){const v=clamp(1-near.d/45,.05,1);if(near.h.kind!=='toro'&&r<.8)cencerro(v);else mugido(v*.7)}}}}
function fincaTick(dt){
 const F=W3.F,pl=W3.pl,k=W3.keys,T=W3.truck,Hh=W3.horse;
 let jx=W3.jx,jy=W3.jy;if(k['w']||k['arrowup'])jy=1;if(k['s']||k['arrowdown'])jy=-1;if(k['a']||k['arrowleft'])jx=-1;if(k['d']||k['arrowright'])jx=1;
 const L=Math.min(1,Math.hypot(jx,jy));let sp=0;
 const fx=-Math.sin(W3.yaw),fz=-Math.cos(W3.yaw),mx=fx*jy-fz*jx,mz=fz*jy+fx*jx,ml=Math.hypot(mx,mz)||1;
 if(W3.drive){
  T.v+=jy*9*dt;T.v*=Math.pow(.55,dt);T.v=clamp(T.v,-5,16);T.yaw-=jx*dt*clamp(T.v/6,-1,1)*1.4;
  const np={x:T.x+Math.sin(T.yaw)*T.v*dt,z:T.z+Math.cos(T.yaw)*T.v*dt,hit:0};collide(np,2.1,true);if(np.hit)T.v*=.4;T.x=np.x;T.z=np.z;
  F.p.set(T.x,gH(T.x,T.z),T.z);pl.root.visible=false;
  W3.truckM.wheels.forEach((w,i)=>{w.children[0].rotation.x+=T.v*dt/.42;if(i<2)w.rotation.y=-jx*.4})}
 else if(W3.ride){
  const tv=L>.08?(W3.run?9.5:3.4)*L:0;if(L>.08)Hh.yaw+=clamp(angD(Hh.yaw,Math.atan2(mx,mz)),-2.4*dt,2.4*dt);Hh.v+=(tv-Hh.v)*Math.min(1,dt*1.8);
  const np={x:Hh.x+Math.sin(Hh.yaw)*Hh.v*dt,z:Hh.z+Math.cos(Hh.yaw)*Hh.v*dt,hit:0};collide(np,1.0);if(np.hit)Hh.v*=.6;Hh.x=np.x;Hh.z=np.z;
  F.p.set(Hh.x,gH(Hh.x,Hh.z),Hh.z);F.yaw=Hh.yaw;if(Hh.v>7&&Math.random()<dt*6)dust(W3.D,Hh.x,F.p.y,Hh.z,.4)}
 else if(F.toss>0){F.toss-=dt;const ph=2.2-F.toss;
  if(ph<.7){const v=ph/.7;F.p.x+=F.tv.x*dt;F.p.z+=F.tv.z*dt;collide(F.p);pl.root.position.y=gH(F.p.x,F.p.z)+Math.sin(v*Math.PI)*2.3;pl.root.rotation.x=-v*Math.PI*1.5}
  else if(ph<1.7){pl.root.rotation.x=-Math.PI/2;pl.root.position.y=gH(F.p.x,F.p.z)+.15}
  else{const v=(ph-1.7)/.5;pl.root.rotation.x=-Math.PI/2*(1-v);pl.root.position.y=gH(F.p.x,F.p.z)+.15*(1-v)}
  if(F.toss<=0)pl.root.rotation.x=0;pl.root.position.x=F.p.x;pl.root.position.z=F.p.z}
 else if(L>.08){const v=(W3.run&&F.carry!=='saco'?7.5:F.carry==='saco'?2.6:3.6)*L;F.p.x+=mx/ml*v*dt;F.p.z+=mz/ml*v*dt;collide(F.p);F.yaw+=angD(F.yaw,Math.atan2(mx,mz))*Math.min(1,dt*10);sp=L*(W3.run?1.5:1)}
 const HM=W3.horseM;HM.root.position.set(Hh.x,gH(Hh.x,Hh.z),Hh.z);HM.root.rotation.y=Hh.yaw;animHorse(HM,dt,W3.ride?Hh.v/4.5:0);
 if(W3.ride){pl.root.visible=true;pl.root.position.set(Hh.x,gH(Hh.x,Hh.z)+.98+HM.body.position.y,Hh.z);pl.root.position.x-=Math.sin(Hh.yaw)*.05;pl.root.position.z-=Math.cos(Hh.yaw)*.05;pl.root.rotation.set(0,Hh.yaw,0);animPerson(pl,dt,0)}
 else if(!W3.drive){pl.root.visible=true;if(!(F.toss>0)){F.p.y=gH(F.p.x,F.p.z);pl.root.position.copy(F.p);pl.root.rotation.y=F.yaw;animPerson(pl,dt,sp)}}
 const tm=W3.truckM.g;tm.position.set(T.x,gH(T.x,T.z),T.z);tm.rotation.y=T.yaw;
 if(W3.may)animPerson(W3.may,dt,0);
 if(W3.flames)W3.flames.forEach((f,i)=>{f.scale.y=.8+Math.sin(performance.now()/90+i*2)*.25;f.rotation.y+=dt*3});
 if(W3.ironTip)W3.ironTip.material.color.setHSL(.04,1,.45+Math.sin(performance.now()/150)*.08);
 herdTick(dt);dustTick(W3.D,dt);dayTick(dt);
 // interacción
 const px=F.p.x,pz=F.p.z;let best=null,bd=1e9,sec=null;
 const nearAnimal=(r)=>{let n=null,nd=r;for(const h of W3.herd){const d=Math.hypot(h.x-px,h.z-pz);if(d<nd){nd=d;n=h}}return n?{h:n,d:nd}:null};
 const apartarOpt=h=>{const of=S.offers.filter(o=>o.st==='nueva'&&eligible(h.a,o));if(!of.length)return null;const o=h.a.mark?S.offers.find(x=>x.id===h.a.mark)||of[0]:of[0];const n=campo().filter(a=>a.mark===o.id).length;
  return {l:h.a.mark?`Quitar de la reseña (${n}/${o.n})`:`Apartar para ${o.feria} (${n}/${o.n})`,fn:()=>apartar(h,o)}};
 if(W3.drive){best={l:'Bajar de la camioneta',fn:bajar};if(Math.hypot(px-W3.porteria.x,pz-W3.porteria.z)<10)sec={l:'Salir hacia la plaza',fn:irPlaza}}
 else if(W3.ride){best={l:'Desmontar',fn:desmontar};const n=nearAnimal(5.5);if(n){sec=apartarOpt(n.h)||{l:`Ver a ${n.h.a.name}`,fn:()=>openFicha(n.h.a.id)}}}
 else if(!(F.toss>0)){
  for(const a of W3.acts){if(a.cond&&!a.cond())continue;const d=Math.hypot(a.x-px,a.z-pz);if(d<a.r&&d<bd){bd=d;best=a}}
  if(best&&best.plac&&campo().some(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2))sec={l:'Tentar un macho',fn:machoModal};
  const dT=Math.hypot(T.x-px,T.z-pz);if(dT<3.6&&!F.carry&&dT<bd){bd=dT;best={l:'Subir a la camioneta',fn:subir}}
  const dH=Math.hypot(Hh.x-px,Hh.z-pz);if(dH<2.8&&!F.carry&&dH<bd){bd=dH;best={l:'Montar a caballo',fn:montar}}
  if(F.carry==='saco'){W3.feeds.forEach((f,i)=>{const d=Math.hypot(f.x-px,f.z-pz);if(d<3.4&&d<bd+1){bd=d;best={l:f.lvl>=1?'El comedero está lleno':'Echar el pienso',hold:f.lvl<1,dur:1.2,fn:()=>echarPienso(i)}}});sec={l:'Soltar el saco',fn:()=>{F.carry=null;setCarry()}}}
  else if(F.carry==='hierro'){sec={l:'Dejar el hierro',fn:()=>{F.carry=null;setCarry()}};
   for(const h of W3.herd){if(h.rk!=='pen'||h.a.herrado)continue;const d=Math.hypot(h.x-px,h.z-pz);if(d<2.2&&d<bd+2){bd=d;best={l:`Herrar a ${h.a.name}`,hold:true,dur:1.5,fn:()=>herrarUno(h)}}}}
  else if(F.carry==='botiquin'){sec={l:'Dejar el botiquín',fn:()=>{F.carry=null;setCarry()}};
   for(const h of W3.herd){if(h.a.salud>=55)continue;const d=Math.hypot(h.x-px,h.z-pz);if(d<2.8&&d<bd+2){bd=d;best={l:`Curar a ${h.a.name}`,hold:true,dur:2,fn:()=>curar(h)}}}}
  else if(F.carry==='herr'){sec={l:'Dejar las herramientas',fn:()=>{F.carry=null;setCarry()}}}
  else{const n=nearAnimal(3.6);if(n&&(!best||n.d<bd)){const nh=n.h;best={l:`Ver a ${nh.a.name}${nh.a.num!=null?' nº '+nh.a.num:''}${nh.a.salud<55?' (cojea)':''}`,fn:()=>openFicha(nh.a.id)};sec=apartarOpt(nh)}}}
 W3.act=best;W3.act2=sec;
 const b=$('#h3do');if(best){b.hidden=false;const l=typeof best.l==='function'?best.l():best.l;if(b.textContent!==l){b.textContent=l;W3.holding=false;W3.hold=0;b.style.backgroundImage=''}}else b.hidden=true;
 const b2=$('#h3do2');if(sec){b2.hidden=false;if(b2.textContent!==sec.l)b2.textContent=sec.l}else b2.hidden=true;
 $('#h3run').hidden=!!W3.drive;$('#h3run').textContent=W3.ride?'Galope':'Correr';
 W3.camT=Math.max(0,(W3.camT||0)-dt);
 if((W3.drive||W3.ride)&&W3.camT<=0){const ty=(W3.drive?T.yaw:Hh.yaw)+Math.PI;W3.yaw+=angD(W3.yaw,ty)*Math.min(1,dt*(W3.drive?2.5:1.5))}
 const d=(W3.drive?11:W3.ride?8:6.2)*(W3.zoom||1),cp=W3.cam.position;const tx=F.p.x+Math.sin(W3.yaw)*Math.cos(W3.pitch)*d,tz=F.p.z+Math.cos(W3.yaw)*Math.cos(W3.pitch)*d,ty=F.p.y+1.6+Math.sin(W3.pitch)*d;
 cp.x+=(tx-cp.x)*Math.min(1,dt*8);cp.z+=(tz-cp.z)*Math.min(1,dt*8);cp.y+=(Math.max(ty,gH(cp.x,cp.z)+.6)-cp.y)*Math.min(1,dt*8);
 W3.cam.lookAt(F.p.x,F.p.y+(W3.drive?2:W3.ride?2.4:1.5),F.p.z);
 W3.hud=(W3.hud||0)+dt;if(W3.hud>.6){W3.hud=0;hudInfo();drawTasks()}}
function subir(){W3.drive=true;W3.F.carry=null;setCarry();toast('Joystick: acelerar, frenar y girar. En la portería puedes salir hacia la plaza.')}
function bajar(){const T=W3.truck;W3.drive=false;T.v=0;const F=W3.F;F.p.set(T.x+Math.cos(T.yaw)*2.8,0,T.z-Math.sin(T.yaw)*2.8);collide(F.p,.42,true);W3.pl.root.visible=true}
function montar(){W3.ride=true;W3.horse.v=0;W3.F.carry=null;seat(W3.pl);setCarry();toast('A caballo, con la garrocha. El ganado se aparta: colócate detrás para arrearlo. «Galope» para ir rápido.')}
function desmontar(){const Hh=W3.horse;W3.ride=false;Hh.v=0;const P=W3.pl;P.seated=false;P.legs.forEach(l=>{l.hip.rotation.set(0,0,0);l.kn.rotation.x=0});const F=W3.F;F.p.set(Hh.x+Math.cos(Hh.yaw)*1.6,0,Hh.z-Math.sin(Hh.yaw)*1.6);collide(F.p);setCarry()}
function echarPienso(i){const f=W3.feeds[i];if(f.lvl>=1)return;f.lvl=Math.min(1,f.lvl+.34);S.feedSpots=S.feedSpots||[0,0,0];S.feedSpots[i]=f.lvl;S.fedM=(S.fedM||0)+1;
 f.fill.visible=true;f.fill.scale.y=Math.max(.001,f.lvl*.3);W3.F.carry=null;setCarry();for(let j=0;j<4;j++)dust(W3.D,f.x,f.g.position.y+.5,f.z,.35);save();
 toast(S.fedM>=4?'Pienso echado. La camada comerá a gusto este mes.':`Pienso echado (${S.fedM} de 4 sacos este mes para notar el ahorro).`)}
function herrarUno(h){const a=h.a;if(a.herrado)return;a.herrado=true;a.num=nextNum(a.born);S.money-=35;
 h.mode='flee';h.t=2.5;const dx=h.x-W3.F.p.x,dz=h.z-W3.F.p.z,d=Math.hypot(dx,dz)||1;h.tx=h.x+dx/d*5;h.tz=h.z+dz/d*5;h.jump=.6;mugido(.5);
 for(let j=0;j<5;j++)dust(W3.D,h.x,gH(h.x,h.z)+.8,h.z,.25);save();
 const left=campo().filter(x=>!x.herrado).length;toast(`${a.name} lleva ya tu hierro y el número ${a.num}. ${left?`Quedan ${left}.`:'Herradero terminado.'}`);if(!left){W3.F.carry=null;setCarry()}}
function curar(h){const a=h.a;a.salud=Math.min(100,a.salud+30);a.lesion=0;S.money-=120;W3.F.uses--;save();h.mode='flee';h.t=1.5;const dx=h.x-W3.F.p.x,dz=h.z-W3.F.p.z,d=Math.hypot(dx,dz)||1;h.tx=h.x+dx/d*4;h.tz=h.z+dz/d*4;
 toast(`${a.name} curado (salud ${Math.round(a.salud)}). −120 € de veterinaria.`);if(W3.F.uses<=0){W3.F.carry=null;toast('El botiquín se ha quedado vacío.')}setCarry()}
function repararCerca(){if(!S.roto)return;S.roto=null;W3.F.carry=null;S.money-=150;save();log('Cerca reparada.');rebuildFinca();toast('Cerca reparada (−150 € de material).')}
function apartar(h,o){const a=h.a;if(a.mark){a.mark=null;a.encd=false;markBull(h,false);save();toast(`${a.name} vuelve al lote`);return}
 const n=campo().filter(x=>x.mark===o.id).length;if(n>=o.n){toast(`Ya tienes ${o.n} apartados para ${o.feria}`);return}
 a.mark=o.id;markBull(h,true);save();toast(n+1===o.n?`Reseña completa. Ahora, a caballo, arréalos hasta los corrales.`:`${a.name} apartado (${n+1}/${o.n}). Llevan una marca blanca en el anca.`)}
function capturar(h){const a=h.a;h.free=false;h.target=null;h.mode='idle';h.t=2;
 if(h.escaped){h.escaped=false;h.R=RECTS[h.tk];S.escapado=null;save();toast(`${a.name} vuelve a su cercado. ${S.roto&&S.roto.rk===h.tk?'Repara la cerca o se volverá a escapar.':''}`);mugido(.5)}
 else{a.encd=true;h.R=RECTS.emb;h.rk='emb';save();const o=S.offers.find(x=>x.id===a.mark);const n=o?campo().filter(x=>x.mark===o.id&&x.encd).length:0;toast(o?`${a.name} encerrado en los corrales (${n}/${o.n}).`:`${a.name} encerrado.`)}
 W3.tasksKey=''}
function herdTick(dt){
 const F=W3.F,px=F.p.x,pz=F.p.z,H=W3.herd,T=W3.truck,now=performance.now(),Hh=W3.horse;
 const hx=W3.ride?Hh.x:px,hz=W3.ride?Hh.z:pz;
 for(const h of H){const Rc=h.R;let spd=0,head=.9,paw=false,push=false,toss=0,look=0;
  const dx=px-h.x,dz=pz-h.z,dP=Math.hypot(dx,dz);const dH=Math.hypot(h.x-hx,h.z-hz);
  const pin=!W3.ride&&!W3.drive&&(h.free?dP<10:inR(Rc,px,pz));
  if(W3.ride&&h.a.mark&&!h.a.encd&&!h.free&&dH<12&&h.rk==='toros'){h.free=true;h.target=RECTS.emb;h.tk='emb'}
  if(W3.drive&&Math.hypot(T.x-h.x,T.z-h.z)<9&&!['spar','flee'].includes(h.mode)){h.mode='flee';h.t=2;const ex=h.x-T.x,ez=h.z-T.z,el=Math.hypot(ex,ez)||1;h.tx=h.x+ex/el*8;h.tz=h.z+ez/el*8}
  const herdR=W3.ride?12:(h.kind==='toro'?0:4.5);
  if(dH<herdR&&!['spar','charge','arreo','flee'].includes(h.mode)){h.mode='arreo';h.arT=1.5}
  if(h.bravo&&pin&&dP<10&&!['charge','calm','spar','flee','arreo'].includes(h.mode))h.mode='watch';
  if(h.kind==='vaca'&&pin&&dP<6&&!['charge','calm'].includes(h.mode)&&H.some(c=>c.mother===h&&Math.hypot(c.x-px,c.z-pz)<5)&&Math.random()<dt*.6){h.mode='charge';h.t=1.4;toast(`¡${h.a.name} defiende a su becerro!`)}
  switch(h.mode){
   case 'watch':{head=.1;h.tyaw=Math.atan2(dx,dz);if(Math.random()<dt*.5)h.paw=.8;if(h.paw>0){h.paw-=dt;paw=true;if(Math.random()<dt*4)dust(W3.D,h.x+Math.sin(h.yaw),gH(h.x,h.z),h.z+Math.cos(h.yaw),.3)}
    const e=est(h.a);if(Math.random()<dt*((e.bra||70)/100)*.35&&dP<8&&!(F.toss>0)){h.mode='charge';h.t=1.8;bufido(.6);toast(`¡${h.a.name} se arranca!`)}if(dP>13||!pin)h.mode='idle';break}
   case 'charge':{h.t-=dt;head=1;const v=6.8;if(dP>.01){h.x+=dx/dP*v*dt;h.z+=dz/dP*v*dt}h.tyaw=Math.atan2(dx,dz);spd=1.35;if(Math.random()<dt*6)dust(W3.D,h.x,gH(h.x,h.z),h.z,.35);
    if(dP<1.5&&!(F.toss>0)&&!W3.ride){tossPlayer(dx/dP,dz/dP,h.a.name);toss=1;h.mode='calm';h.t=6}
    if(h.t<=0||W3.ride){h.mode='calm';h.t=5}break}
   case 'calm':{h.t-=dt;head=.6;if(h.t<=0)h.mode='idle';break}
   case 'flee':{h.t-=dt;const ex=h.tx-h.x,ez=h.tz-h.z,d=Math.hypot(ex,ez);if(d>.3&&h.t>0){const v=4;h.x+=ex/d*v*dt;h.z+=ez/d*v*dt;h.tyaw=Math.atan2(ex,ez);spd=1.1;head=.2}else{h.mode='idle';h.t=R(2,5)}break}
   case 'arreo':{const ex=h.x-hx,ez=h.z-hz,d=Math.max(.1,dH);let vx=ex/d,vz=ez/d;
    if(h.free&&h.tk){let best=null,bd=1e9;const ok=h.tk==='emb'&&inR(RECTS.toros,h.x,h.z)?'toros':h.tk;for(const op of openings(ok)){const dd=Math.hypot(op.x-h.x,op.z-h.z);if(dd<bd){bd=dd;best=op}}
     if(best&&(bd<11||ok!==h.tk)){const ax=(ok!==h.tk?best.x-(best.ix-best.x):best.ix)-h.x,az=(ok!==h.tk?best.z-(best.iz-best.z):best.iz)-h.z,al=Math.hypot(ax,az)||1;vx+=ax/al*.9;vz+=az/al*.9}}
    const vl=Math.hypot(vx,vz)||1;const v=(W3.ride?(Hh.v>5?4.6:2.4):1.5)*clamp(1.35-dH/(herdR||1),.3,1);
    h.x+=vx/vl*v*dt;h.z+=vz/vl*v*dt;h.tyaw=Math.atan2(vx,vz);spd=v>3?1.15:.6;head=.45;if(v>3&&Math.random()<dt*4)dust(W3.D,h.x,gH(h.x,h.z),h.z,.3);
    if(dH>herdR+2||!herdR){h.arT-=dt;if(h.arT<=0){h.mode='idle';h.t=R(2,4)}}else h.arT=1.5;break}
   case 'paw':{h.t-=dt;paw=true;head=.95;if(Math.random()<dt*5)dust(W3.D,h.x+Math.sin(h.yaw),gH(h.x,h.z),h.z+Math.cos(h.yaw),.35);if(h.t<=0){h.mode='idle';h.t=R(2,6)}break}
   case 'spar':{const o=h.foe;if(!o||o.foe!==h||o.mode!=='spar'){h.mode='idle';h.foe=null;h.contact=false;break}
    const ax=o.x-h.x,az=o.z-h.z,d=Math.hypot(ax,az)||1;h.tyaw=Math.atan2(ax,az);head=1;
    if(!h.contact){const v=1.8;if(d>2.1){h.x+=ax/d*v*dt;h.z+=az/d*v*dt;spd=.7}else{h.contact=o.contact=true;h.t=o.t=R(2.5,5);if(dP<40)bufido(.4)}}
    else{push=true;h.t-=dt;const share=h.pow/(h.pow+o.pow);const f=(share-.5)*1.4*dt;h.x+=ax/d*f;h.z+=az/d*f;if(d<1.9){h.x-=ax/d*.5*dt;h.z-=az/d*.5*dt}
     if(Math.random()<dt*2.5){toss=.6;dust(W3.D,(h.x+o.x)/2,gH(h.x,h.z),(h.z+o.z)/2,.45)}spd=.15;
     if(h.t<=0){const win=h.pow*R(.8,1.2)>o.pow*R(.8,1.2)?h:o,lose=win===h?o:h;
      lose.mode='flee';lose.t=2.6;lose.tx=lose.x-(win.x-lose.x)*3;lose.tz=lose.z-(win.z-lose.z)*3;lose.foe=null;lose.contact=false;
      win.mode='paw';win.t=2.4;win.foe=null;win.contact=false}}
    break}
   case 'eat':{h.t-=dt;head=1;const f=W3.feeds[h.feed];if(f){f.lvl=Math.max(0,f.lvl-dt*.0025);f.fill.scale.y=Math.max(.001,f.lvl*.3);if(f.lvl<=0){f.fill.visible=false;h.t=0}if(S.feedSpots)S.feedSpots[h.feed]=f.lvl}if(h.t<=0){h.mode='idle';h.t=R(3,8)}break}
   case 'idle':{h.t-=dt;head=.9;look=Math.sin(now/2000+h.a.id)*.6;
    if(h.kind==='becerro'&&h.mother){const md=Math.hypot(h.mother.x-h.x,h.mother.z-h.z);if(md>4){h.mode='walk';h.tx=h.mother.x-Math.sin(h.mother.yaw)*2;h.tz=h.mother.z-Math.cos(h.mother.yaw)*2;h.fast=md>10;break}}
    if(h.t<=0){const fi=h.free?-1:W3.feeds.findIndex(f=>f.r===h.rk&&f.lvl>.05);
     if(fi>=0&&Math.random()<.5){const f=W3.feeds[fi],ang=Math.random()*6.28;h.mode='walk';h.tx=f.x+Math.cos(ang)*2.4;h.tz=f.z+Math.sin(ang)*2.4;h.feedGo=fi}
     else if(h.free){h.mode='walk';h.tx=h.x+R(-5,5);h.tz=h.z+R(-5,5);h.fast=false}
     else{h.mode='walk';h.tx=clamp(h.x+R(-14,14),Rc.x0+2,Rc.x1-2);h.tz=clamp(h.z+R(-14,14),Rc.z0+2,Rc.z1-2);h.fast=h.kind==='becerro'&&Math.random()<.3}}
    else if(!h.free&&h.kind==='toro'&&h.rk==='toros'&&ageY(h.a)>=3&&Math.random()<dt*.025){const foe=H.find(o=>o!==h&&!o.free&&o.kind==='toro'&&o.rk===h.rk&&['idle','walk'].includes(o.mode)&&Math.hypot(o.x-h.x,o.z-h.z)<16);
     if(foe){h.mode=foe.mode='spar';h.foe=foe;foe.foe=h;h.contact=foe.contact=false}}
    else if(h.kind==='toro'&&Math.random()<dt*.01){h.mode='paw';h.t=R(1.5,3)}
    break}
   case 'walk':{const ex=h.tx-h.x,ez=h.tz-h.z,d=Math.hypot(ex,ez);head=.35;
    if(d<.4||(h.free&&h.stuck>2)){h.stuck=0;if(h.feedGo!=null){h.mode='eat';h.feed=h.feedGo;h.feedGo=null;h.t=R(10,22);const f=W3.feeds[h.feed];h.tyaw=Math.atan2(f.x-h.x,f.z-h.z)}else{h.mode='idle';h.t=R(3,9)}}
    else{const v=(h.fast?3.2:1.1*(h.kind==='toro'?clamp(560/h.a.peso,.8,1.15):1))*(h.a.salud<55?.6:1);h.x+=ex/d*v*dt;h.z+=ez/d*v*dt;h.tyaw=Math.atan2(ex,ez);spd=h.fast?1.1:.55}break}
  }
  if(h.jump>0)h.jump-=dt;
  if(h.free){const p={x:h.x,z:h.z,hit:0};collide(p,.9);if(p.hit)h.stuck=(h.stuck||0)+dt;h.x=p.x;h.z=p.z;if(h.target&&inR(h.target,h.x,h.z,1.2))capturar(h)}
  else{h.x=clamp(h.x,Rc.x0+1.2,Rc.x1-1.2);h.z=clamp(h.z,Rc.z0+1.2,Rc.z1-1.2)}
  if(h.tyaw!=null)h.yaw+=angD(h.yaw,h.tyaw)*Math.min(1,dt*4);
  h.anim={speed:spd,head,paw,push,toss,look,limp:h.a.salud<55}}
 for(let i=0;i<H.length;i++)for(let j=i+1;j<H.length;j++){const a=H[i],b=H[j];if(a.rk!==b.rk&&!a.free&&!b.free)continue;const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),m=(a.kind==='becerro'||b.kind==='becerro')?1.1:1.8;
  if(d<m&&d>1e-4&&!(a.foe===b&&a.contact)){const p=(m-d)/2;a.x-=dx/d*p;a.z-=dz/d*p;b.x+=dx/d*p;b.z+=dz/d*p}}
 for(const h of H){const dd=Math.hypot(h.x-px,h.z-pz);h.B.root.position.set(h.x,gH(h.x,h.z)+(h.jump>0?Math.sin(h.jump/.6*Math.PI)*.5:0),h.z);h.B.root.rotation.y=h.yaw;
  h.B.root.visible=dd<200;if(dd<110)animBull(h.B,dt,h.anim)}}

/* ---------- menús ---------- */
function despacho(){modal('Despacho del cortijo',`<div class="stack">
 <div class="kv"><span><b>${MESES[S.month]} ${S.year}</b></span><span>Saldo <b>${eur(S.money)}</b></span><span>Prestigio <b>${Math.round(S.pres)}</b></span><span>Cabezas <b>${campo().length}</b></span></div>
 <div class="list">${tareas().map(x=>`<div class="task"><span class="dot ${x.d?'ok':''}"></span><span class="t">${esc(x.t)}</span></div>`).join('')}</div>
 <button class="btn pri adv" onclick="closeModal();advance();rebuildFinca()">Avanzar a ${MESES[(S.month+1)%12]}</button>
 <button class="btn adv" onclick="closeModal();exit3D()">Ir a la gestión completa</button></div>`)}
function piensoModal(){modal('Alimentación de la camada',`<div class="stack"><p class="muted" style="margin:0">Plan mensual del pienso. Si además echas tú cuatro sacos en los comederos, ahorras otro 10 %.</p>
 <div class="seg">${Object.entries(FEED).map(([k,f])=>`<button aria-pressed="${S.feed===k}" onclick="S.feed='${k}';save();closeModal();toast('Alimentación ${f.n.toLowerCase()}')"><b>${f.n}</b><span>${Math.round(f.c*feedMul())} € · ${f.d}</span></button>`).join('')}</div></div>`)}
function mayoral(){
 const c=campo();const t=[];
 const sin=c.filter(a=>!a.herrado).length,pendT=c.filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2).length,nuevas=S.offers.filter(o=>o.st==='nueva');
 const her=c.filter(a=>a.salud<55);const sems=c.filter(a=>a.role==='semental');
 if(S.porVer.length)t.push('Hay una corrida de nuestro hierro. Coge la camioneta y sal por la portería.');
 if(S.escapado){const a=byId(S.escapado.id);if(a)t.push(`Se nos ha escapado ${a.name} por la cerca rota de ${RKN[S.escapado.rk]}. Coge el caballo y devuélvelo antes de que acabe el mes.`)}
 if(S.roto)t.push(`Hay una cerca rota en el cercado de ${RKN[S.roto.rk]}. Coge las herramientas del cuarto de aperos y arréglala.`);
 if(nuevas.length)t.push(`Han llamado ${nuevas.length} ${nuevas.length>1?'empresas':'empresa'}. Aparta los toros en el cercado y luego, a caballo, arréalos a los corrales.`);
 if(sin&&S.month>=7)t.push(`Tengo ${sin} becerros en la corraleta. La lumbre está encendida: coge el hierro y hérralos tú.`);
 if(pendT)t.push(`${pendT} hembras ya tienen edad de tienta.${mej('placita')?' En la placita las toreas tú y ves de qué son.':' Sin placita propia las tiento yo fuera, y sale más caro.'}`);
 if((S.fedM||0)<4)t.push(`Este mes llevas ${S.fedM||0} sacos echados. Los sacos están en el remolque, junto a la puerta del cercado de los toros.`);
 if(her.length)t.push(`${her.length} ${her.length>1?'animales cojean':'animal cojea'}: ${her.slice(0,3).map(a=>a.name).join(', ')}. El botiquín está en el cuarto de aperos.`);
 if(!sems.length)t.push('No tenemos semental. Habría que comprar uno en el mercado o tentar un macho.');
 t.push('Cuidado a pie en el cercado de los toros: si se te queda mirando y escarba, sal de ahí. A caballo te respetan.');
 modal('El mayoral',`<div class="stack"><div class="list">${t.map(x=>`<div class="task"><span class="dot"></span><span class="t">«${esc(x)}»</span></div>`).join('')}</div>
 <div class="row"><button class="btn" onclick="piensoModal()">Plan de pienso</button>${!mej('placita')&&pendT?'<button class="btn" onclick="closeModal();tientaLote()">Que tiente el mayoral</button>':''}<button class="btn" onclick="obras()">Obras</button></div></div>`)}
function obras(){modal('Obras y mejoras',`<div class="stack"><p class="muted" style="margin:0">Cada obra aparece en la finca y cambia la economía de la ganadería. También puedes ir a los solares con estaca naranja.</p>
 <div class="list">${Object.entries(MEJ).map(([k,d])=>`<div class="task"><span class="dot ${mej(k)?'ok':''}"></span><span class="t"><b>${d.n}</b><br><small class="muted">${d.d}</small></span>${mej(k)?'<span class="badge ok">Hecha</span>':`<button class="btn sm oro" ${S.money<d.c?'disabled':''} onclick="construir('${k}',true)">${eur(d.c)}</button>`}</div>`).join('')}</div></div>`)}
function construir(k,now){const d=MEJ[k];if(mej(k))return;
 if(!now){modal(d.n,`<div class="stack"><p style="margin:0">${d.d}</p><div class="kv"><span>Coste <b>${eur(d.c)}</b></span><span>Saldo <b>${eur(S.money)}</b></span></div>
  <button class="btn pri adv" ${S.money<d.c?'disabled':''} onclick="construir('${k}',true)">Construir</button>${S.money<d.c?'<small class="muted">No tienes saldo suficiente.</small>':''}</div>`);return}
 if(S.money<d.c)return;S.money-=d.c;S.mej[k]=1;log(`Obra terminada: ${d.n}.`);save();closeModal();if(W3.mode==='finca')rebuildFinca();render();toast(`${d.n}: obra terminada`)}
function ofertasModal(){const act=S.offers.filter(o=>o.st==='nueva'||o.st==='aceptada').sort((a,b)=>a.abs-b.abs);
 modal('Ofertas y embarque',act.length?`<div class="stack"><p class="muted" style="margin:0">Aparta los toros en el cercado, arréalos a caballo hasta los corrales y embárcalos aquí.</p>${act.map(o=>{const elig=campo().filter(a=>eligible(a,o)).length;const mk=campo().filter(a=>a.mark===o.id&&eligible(a,o));const en=mk.filter(a=>a.encd).length;
  return `<div class="card offer"><div class="pl">${esc(o.plaza)}</div><div class="kv"><span>${esc(o.feria)}</span><span><b>${MESES[o.abs%12]}</b></span><span><b>${o.n}</b> ${o.tipo==='novillada'?'novillos':'toros'}</span><span><b>${eur(o.precio)}</b>/cabeza</span><span>apartados <b>${mk.length}/${o.n}</b></span><span>en corrales <b>${en}/${o.n}</b></span></div>
  ${o.st==='nueva'?`<div class="row">${mk.length===o.n&&en===o.n?`<button class="btn oro" onclick="embarcar(${o.id})">Embarcar los ${o.n} toros</button>`:''}${mk.length===o.n&&en<o.n?`<button class="btn" onclick="vaqueros(${o.id})">Que los encierren los vaqueros · ${eur((o.n-en)*600)}</button>`:''}<button class="btn" ${elig<o.n?'disabled':''} onclick="resena(${o.id})">Reseñar desde la lista</button><button class="btn ghost" onclick="rechazar(${o.id});closeModal()">Rechazar</button></div>`:'<span class="badge ok">Embarque previsto</span>'}</div>`}).join('')}</div>`:'<p class="muted">No hay ofertas abiertas ahora mismo.</p>')}
function vaqueros(id){const o=S.offers.find(x=>x.id===id);const mk=campo().filter(a=>a.mark===o.id);const n=mk.filter(a=>!a.encd).length;S.money-=n*600;mk.forEach(a=>a.encd=true);save();closeModal();rebuildFinca();ofertasModal();toast(`Los vaqueros han encerrado ${n} toros (−${eur(n*600)})`)}
function embarcar(id){const o=S.offers.find(x=>x.id===id);const ids=campo().filter(a=>a.mark===o.id&&a.encd&&eligible(a,o)).map(a=>a.id);if(ids.length!==o.n)return;
 o.toros=ids;o.st='aceptada';ids.forEach(i=>{const a=byId(i);a.res=o.id;a.mark=null;a.encd=false});for(const a of campo())if(a.mark===o.id){a.mark=null;a.encd=false}
 log(`Embarcados para ${o.plaza}.`);save();closeModal();rebuildFinca();render();toast(`Toros embarcados. Tu hierro se anuncia en ${o.plaza}.`)}
function irPlaza(){if(S.porVer.length){enterPlaza(S.porVer[0]);return}
 const nx=S.offers.filter(o=>o.st==='aceptada').sort((a,b)=>a.abs-b.abs)[0];
 toast(nx?`Tu próximo festejo: ${nx.plaza}, ${MESES[nx.abs%12]}. Avanza los meses hasta entonces.`:'No tienes festejos anunciados. Aparta toros y embárcalos en los corrales.')}
function machoModal(){const c=campo().filter(a=>a.sex==='M'&&!a.role&&!a.tentado&&a.res==null&&!a.mark&&ageY(a)>=3&&ageY(a)<=5).sort((a,b)=>(est(b).bra||0)-(est(a).bra||0)).slice(0,12);
 modal('Tienta de machos',`<div class="stack"><p class="muted" style="margin:0">Un macho tentado ya no puede lidiarse en plaza: o queda como semental o se vende para festejos populares. Elige a uno de reata contrastada (${eur(tCost('M'))}).</p>
 ${c.length?`<div class="list">${c.map(a=>{const e=est(a);return `<div class="task"><span class="t"><b>${esc(a.name)}</b> <span class="mono muted">${a.num??''}</span><br><small class="muted">${ageY(a)} años · ${a.pelo} · ${a.peso} kg${e.bra?` · reata ~${e.bra}`:''}</small></span><button class="btn sm oro" onclick="closeModal();startTienta('M',${a.id})">Tentar</button></div>`}).join('')}</div>`:'<p class="muted">No hay machos de 3 a 5 años disponibles.</p>'}</div>`)}

/* ---------- tienta jugable ---------- */
let TT=null;
function startTienta(sex,id){
 const q=sex==='M'?[byId(id)].filter(Boolean):campo().filter(a=>a.sex==='H'&&!a.tentado&&!a.role&&ageY(a)>=2).sort((a,b)=>b.peso-a.peso);if(!q.length)return;
 W3.mode='tienta';hudMode('tienta');const C={x:-30,z:24};
 const hor=makeHorse2({peto:true,col:'#cfc6b4'});const pic=makePerson({traje:'#b9975a',hat:'castoreno',pole:3.4});seat(pic);pic.root.position.set(0,.98,-.05);pic.arms[1].lock=1;pic.arms[1].sh.rotation.x=-1;hor.body.add(pic.root);
 hor.root.position.set(C.x+4.6,0,C.z+2);hor.root.rotation.y=-2.2;W3.scene.add(hor.root);
 const mul=makeMuleta();W3.pl.arms[0].hand.add(mul);mul.visible=false;
 TT={q,C,hor,mul,cow:null,sex};W3.F.carry=null;setCarry();ttNext()}
function ttNext(){const T=TT,C=T.C;if(T.cow){W3.scene.remove(T.cow.root);T.cow=null}
 const a=T.q.shift();if(!a){ttExit();return}
 S.money-=tCost(T.sex);T.a=a;T.pases=0;T.fallos=0;T.rehuse=0;T.emb=0;T.phase='caballo';T.t=0;
 T.cow=makeBull({pelo:a.pelo,kind:T.sex==='M'?'toro':'vaca',m:morf(a)});W3.scene.add(T.cow.root);T.cx=C.x;T.cz=C.z-6.2;T.cyaw=0;T.cyaw0=0;
 T.hor.root.visible=true;T.mul.visible=false;
 W3.F.p.set(C.x-2,0,C.z+1);W3.F.yaw=Math.PI;W3.F.toss=0;
 $('#h3toro').textContent=`Tienta · ${a.name}${a.num!=null?' nº '+a.num:''} · ${a.pelo} · ${T.sex==='M'?'hijo':'hija'} de ${a.madre?a.madre.name:'—'}`;
 $('#h3cap').textContent=`Sale ${T.sex==='M'?'el novillo':'la becerra'}. Primero, al caballo: el picador mide su bravura.`;
 $('#ttcita').disabled=true;$('#tttemp').disabled=true;ttInfo()}
function ttInfo(){$('#ttinfo').textContent=TT&&TT.a?`Pases ${TT.pases} · fallos ${TT.fallos} · embestidas ${TT.emb}/7`:''}
function ttCitar(){const T=TT;if(!T||T.phase!=='espera')return;if(T.emb>=7||T.rehuse>=3){ttEndVaca();return}
 const B=T.a.g.bra,arr=Math.pow(B/100,1.4)*1.25;
 if(Math.random()<arr){T.phase='arranca';T.t=0;const P=W3.F.p,dx=T.cx-P.x,dz=T.cz-P.z,d=Math.hypot(dx,dz)||1;
  const rx=-dz/d,rz=dx/d;const sw=(1-clamp((T.a.g.nob-45)/45,0,1))*.7;T.cp={x:P.x+rx*(1.1-sw),z:P.z+rz*(1.1-sw)};
  T.spd=3.2+(B-50)/14+(T.a.g.fue-60)/40;T.dir={x:(T.cp.x-T.cx),z:(T.cp.z-T.cz)};const L=Math.hypot(T.dir.x,T.dir.z)||1;T.dir.x/=L;T.dir.z/=L;T.emb++;bufido(.4);
  $('#h3cap').textContent='¡Se arranca! Templa cuando llegue a la muleta.';$('#tttemp').disabled=false;$('#ttcita').disabled=true}
 else{T.rehuse++;T.phase='rehusa';T.t=0;$('#ttcita').disabled=true;$('#h3cap').textContent=T.rehuse>=3?'No quiere pelea. Mansea.':'No se arranca: escarba y cabecea. Vuelve a citar, más cerca.'}
 ttInfo()}
function ttTemplar(){const T=TT;if(!T||T.phase!=='arranca')return;const d=Math.hypot(T.cp.x-T.cx,T.cp.z-T.cz);
 $('#tttemp').disabled=true;$('#tttemp').style.boxShadow='';
 if(d<=3.4&&d>=.8){T.phase='pase';T.t=0;T.pases++;const L=2.2+clamp((T.a.g.nob-40)/45,.1,1)*4;T.pend={x:T.cp.x+T.dir.x*L,z:T.cp.z+T.dir.z*L};T.p0={x:T.cx,z:T.cz};
  T.pdur=(L+d)/T.spd;ole(d<2.2?'¡Olé!':'¡Bien!');oleSnd(false);$('#h3cap').textContent=T.a.g.nob>72?'Pase largo y templado: humilla y repite con clase.':T.a.g.nob>58?'Pasa, aunque sin terminar de entregarse.':'Pasa a regañadientes, tirando un derrote al final.'}
 else{T.fallos++;T.t=0;if(Math.random()<.6){T.phase='coge'}else{T.phase='queda';$('#h3cap').textContent='Te has adelantado: se queda a mitad de viaje y te mira.'}}
 ttInfo()}
function ttCalc(a,T){const prec=clamp(6-T.pases*.8,1.5,6);a.tentado=true;a.known='tienta';a.rev={bra:Math.round(clamp(a.g.bra+gauss()*prec*.5,1,99)),cas:Math.round(clamp(a.g.cas+gauss()*prec*.5,1,99))};
 if(T.rehuse>=3)a.rev.bra=Math.min(a.rev.bra,Math.round(a.g.bra));a.nota=Math.round(.65*a.rev.bra+.35*a.rev.cas)}
function ttEndVaca(){const T=TT;if(!T||!T.a||T.phase==='fin')return;
 const a=T.a;ttCalc(a,T);T.phase='fin';$('#ttcita').disabled=true;$('#tttemp').disabled=true;save();const M_=T.sex==='M';
 $('#h3dim').hidden=false;$('#h3dim').style.opacity=1;$('#h3dim').innerHTML=`<div class="stack" style="max-width:460px;width:100%"><h2>${esc(a.name)}: ${a.nota}</h2><div>${notaTxt(a.nota)} · ${T.pases} pases, ${T.emb} embestidas${T.rehuse?`, ${T.rehuse} rehúses`:''}</div>
 <small class="muted">${T.pases>=4?'Lo has visto bien: la nota es fiable.':'Con pocos pases la nota es aproximada.'}</small>
 <div class="row" style="justify-content:center"><button class="btn oro" onclick="ttDecide(1)">${M_?'Aprobar como semental':'Aprobar para vientre'}</button><button class="btn" onclick="ttDecide(0)">${M_?'Vender para festejos populares':'Al matadero'}</button></div></div>`}
function ttDecide(ok){const a=TT.a,M_=TT.sex==='M';
 if(ok){a.role=M_?'semental':'vaca';if(M_&&(!byId(S.semAct)||byId(S.semAct).role!=='semental'))S.semAct=a.id;log(`Tienta: ${a.name} aprobado${M_?' como semental':'a'} (${a.nota}).`)}
 else{const p=Math.round(M_?700+a.peso*2.2:a.peso*1.3);S.money+=p;a.st='vendido';S.animals=S.animals.filter(x=>x.id!==a.id);log(`Tienta: ${a.name} desechad${M_?'o':'a'}.`)}
 save();$('#h3dim').hidden=true;TT.a=null;ttNext()}
function ttExit(){if(TT){const T=TT;if(T.a&&T.phase!=='fin'){if(T.emb>0)ttCalc(T.a,T);else S.money+=tCost(T.sex)}
  if(T.cow)W3.scene.remove(T.cow.root);W3.scene.remove(T.hor.root);if(T.mul.parent)T.mul.parent.remove(T.mul)}
 TT=null;W3.F.toss=0;if(W3.pl){W3.pl.root.rotation.x=0;W3.pl.arms[0].lock=0}W3.mode='finca';hudMode('finca');W3.F.p.set(-30,0,33);save();rebuildFinca();render()}
function tientaTick(dt){
 const T=TT,F=W3.F,pl=W3.pl,C=T.C;if(!T.cow){camTienta(dt);return}
 let jx=W3.jx,jy=W3.jy;const k=W3.keys;if(k['w']||k['arrowup'])jy=1;if(k['s']||k['arrowdown'])jy=-1;if(k['a']||k['arrowleft'])jx=-1;if(k['d']||k['arrowright'])jx=1;
 let sp=0;const L=Math.min(1,Math.hypot(jx,jy));
 if(F.toss>0){F.toss-=dt;const ph=2.2-F.toss;if(ph<.7){pl.root.position.y=Math.sin(ph/.7*Math.PI)*2;pl.root.rotation.x=-ph/.7*Math.PI*1.5;F.p.x+=F.tv.x*dt*.6;F.p.z+=F.tv.z*dt*.6}else if(ph<1.7){pl.root.rotation.x=-Math.PI/2;pl.root.position.y=.15}else{const v=(ph-1.7)/.5;pl.root.rotation.x=-Math.PI/2*(1-v);pl.root.position.y=.15*(1-v)}if(F.toss<=0)pl.root.rotation.x=0}
 else if(L>.08&&['espera','rehusa','queda'].includes(T.phase)){const fx=-Math.sin(W3.yaw),fz=-Math.cos(W3.yaw);const mx=fx*jy-fz*jx,mz=fz*jy+fx*jx,ml=Math.hypot(mx,mz)||1;F.p.x+=mx/ml*1.5*L*dt;F.p.z+=mz/ml*1.5*L*dt;sp=L*.6}
 const dc=Math.hypot(F.p.x-C.x,F.p.z-C.z);if(dc>6){F.p.x=C.x+(F.p.x-C.x)/dc*6;F.p.z=C.z+(F.p.z-C.z)/dc*6}
 T.t+=dt;let cs=0,head=.4,toss=0,paw=false,push=false;const cow=T.cow;
 const face=(x,z)=>{T.cyaw=Math.atan2(x-T.cx,z-T.cz)};
 switch(T.phase){
  case 'caballo':{const hx=C.x+3.4,hz=C.z+1.2,B=T.a.g.bra;const st=B>78?.6:B>62?1.2:2.2,pushT=B>78?2.4:B>62?1.4:.6;
   if(T.t<st){face(hx,hz);head=.3;if(B<62)paw=true}
   else if(T.t<st+1.2){const v=(T.t-st)/1.2;T.cx=lerp(C.x,hx-1.6,ease(v));T.cz=lerp(C.z-6.2,hz-.6,ease(v));face(hx,hz);cs=1.2;head=.6}
   else if(T.t<st+1.2+pushT){push=true;head=1;if(!T.capSet){T.capSet=1;bufido(.5);$('#h3cap').textContent=B>78?'Se arranca de lejos y empuja metiendo los riñones. Bravo.':B>62?'Va al caballo y cumple.':'Toca el peto y sale suelto. Poco que ver.'}}
   else if(T.t<st+2.2+pushT){const v=(T.t-st-1.2-pushT);T.cx=lerp(hx-1.6,C.x+3.5,v);T.cz=lerp(hz-.6,C.z-3.5,v);cs=.7;face(C.x+3.5,C.z-3.5)}
   else{T.phase='espera';T.t=0;T.capSet=0;T.hor.root.visible=false;T.mul.visible=true;$('#h3cap').textContent='Te toca. Ponte delante, cita y templa cuando llegue a la muleta.';$('#ttcita').disabled=false}
   break}
  case 'espera':{face(F.p.x,F.p.z);head=.25;if(T.emb>=7||T.rehuse>=3)ttEndVaca();break}
  case 'rehusa':{paw=true;head=.6;face(F.p.x,F.p.z);if(T.t>1.3){T.phase='espera';$('#ttcita').disabled=false}break}
  case 'queda':{head=.2;face(F.p.x,F.p.z);if(T.t>1.2){T.phase='espera';$('#ttcita').disabled=false}break}
  case 'arranca':{T.cx+=T.dir.x*T.spd*dt;T.cz+=T.dir.z*T.spd*dt;face(T.cx+T.dir.x,T.cz+T.dir.z);cs=1.2;head=.5+clamp((T.a.g.nob-45)/45,0,1)*.5;
   const d=Math.hypot(T.cp.x-T.cx,T.cp.z-T.cz);const ring=$('#tttemp');ring.style.boxShadow=d<3.4&&d>.8?'0 0 0 4px rgba(147,184,92,.95)':'';
   if(d<.6||((T.cx-T.cp.x)*T.dir.x+(T.cz-T.cp.z)*T.dir.z)>0){T.fallos++;T.phase='coge';T.t=0;ring.style.boxShadow='';$('#tttemp').disabled=true;ttInfo()}
   break}
  case 'coge':{const P=F.p,dx=P.x-T.cx,dz=P.z-T.cz,d=Math.hypot(dx,dz)||1;T.cx+=dx/d*T.spd*dt;T.cz+=dz/d*T.spd*dt;face(P.x,P.z);cs=1.2;head=1;
   if(d<1.3){F.toss=2.2;F.tv={x:dx/d*3,z:dz/d*3};toss=1;T.phase='quite';T.t=0;bufido(.6);$('#h3cap').textContent='¡Volteretón! El mayoral entra al quite con el capote.'}
   else if(T.t>2.5){T.phase='espera';T.t=0;$('#ttcita').disabled=false}break}
  case 'pase':{const v=clamp(T.t/T.pdur,0,1);const ev=v+.06*Math.sin(2*Math.PI*v);T.cx=lerp(T.p0.x,T.pend.x,ev);T.cz=lerp(T.p0.z,T.pend.z,ev);face(T.pend.x,T.pend.z);cs=1;head=.5+clamp((T.a.g.nob-45)/45,0,1)*.5;
   T.mul.rotation.y=-.4+(v-.5)*2.2;if(v>.85&&T.a.g.nob<60)toss=.8;
   if(v>=1){T.phase='vuelve';T.t=0}break}
  case 'vuelve':{face(F.p.x,F.p.z);cs=.4;head=.3;if(T.t>1+(T.a.g.nob<58?.6:0)){T.phase='espera';T.t=0;$('#ttcita').disabled=false;$('#h3cap').textContent=T.pases>=3?'Repite. Sigue toreando o termina con este animal.':'Se vuelve y te busca. Cita otra vez.'}break}
  case 'quite':{if(T.t<2.4){const qx=C.x+4,qz=C.z-3;const dx=qx-T.cx,dz=qz-T.cz,d=Math.hypot(dx,dz)||1;if(d>.5){T.cx+=dx/d*3*dt;T.cz+=dz/d*3*dt;cs=.9}face(qx,qz)}else{T.phase='espera';T.t=0;$('#ttcita').disabled=false;$('#h3cap').textContent='Te levantas. Vuelve a citar.'}break}
 }
 const dcw=Math.hypot(T.cx-C.x,T.cz-C.z);if(dcw>6.2){T.cx=C.x+(T.cx-C.x)/dcw*6.2;T.cz=C.z+(T.cz-C.z)/dcw*6.2}
 T.cyaw0+=angD(T.cyaw0,T.cyaw)*Math.min(1,dt*8);
 cow.root.position.set(T.cx,0,T.cz);cow.root.rotation.y=T.cyaw0;animBull(cow,dt,{speed:cs,head,toss,paw,push});
 if(!(F.toss>0)){pl.root.position.set(F.p.x,0,F.p.z);const fy=Math.atan2(T.cx-F.p.x,T.cz-F.p.z);F.yaw+=angD(F.yaw,fy)*Math.min(1,dt*6);pl.root.rotation.y=F.yaw;
  const ar=pl.arms[0];ar.lock=T.mul.visible?1:0;if(T.mul.visible){ar.sh.rotation.set(-.85,0,.3);ar.el.rotation.x=-.3;if(T.phase!=='pase')T.mul.rotation.y=-.5+Math.sin(performance.now()/300)*.08*(T.phase==='espera'?1:0)}
  animPerson(pl,dt,sp)}
 else{pl.root.position.x=F.p.x;pl.root.position.z=F.p.z}
 clothTick(T.mul.userData.cl,performance.now()/1000,T.phase==='pase'?1:.1);
 dustTick(W3.D,dt);camTienta(dt)}
function camTienta(dt){const F=W3.F,T=TT;const tx=T?T.cx:F.p.x,tz=T?T.cz:F.p.z;const mx=(F.p.x+tx)/2,mz=(F.p.z+tz)/2;
 const ang=Math.atan2(F.p.x-tx,F.p.z-tz)+.5;const cx=F.p.x+Math.sin(ang)*5.5,cz=F.p.z+Math.cos(ang)*5.5;const c=W3.cam.position;const k=Math.min(1,dt*3);
 c.x+=(cx-c.x)*k;c.y+=(3.6-c.y)*k;c.z+=(cz-c.z)*k;W3.cam.lookAt(mx,1,mz)}

/* ---------- la plaza ---------- */
const PR=25;let CP=null;
const DOOR={x:Math.sin(Math.PI-.55)*(PR-.6),z:Math.cos(Math.PI-.55)*(PR-.6)};
function buildPlaza(){
 if(W3.P)return W3.P;
 const sc=new THREE.Scene();sc.background=new THREE.Color('#9cc0dc');sc.fog=new THREE.Fog('#9cc0dc',90,200);
 sc.add(new THREE.HemisphereLight('#e7f0f8','#7a5a3a',.62));
 const sun=new THREE.DirectionalLight('#ffe2b5',1.35);sun.position.set(-52,26,-26);sun.castShadow=true;sun.shadow.mapSize.set(W3.q==='alta'?2048:1024,W3.q==='alta'?2048:1024);Object.assign(sun.shadow.camera,{left:-50,right:50,top:50,bottom:-50,near:1,far:180});sun.shadow.bias=-.0005;sc.add(sun);
 const G=geos();
 const at=document.createElement('canvas');at.width=at.height=256;const ac=at.getContext('2d');ac.fillStyle='#d4a35c';ac.fillRect(0,0,256,256);const r=mulberry(4);for(let i=0;i<5000;i++){ac.fillStyle=`rgba(${r()<.5?'120,80,40':'250,220,170'},${r()*.18})`;ac.fillRect(r()*256,r()*256,2,2)}
 const atx=new THREE.CanvasTexture(at);atx.wrapS=atx.wrapT=THREE.RepeatWrapping;atx.repeat.set(8,8);
 const fl=new THREE.Mesh(new THREE.CircleGeometry(PR,72),new THREE.MeshStandardMaterial({map:atx,roughness:1}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;sc.add(fl);
 for(const d of [7,9]){const rg=new THREE.Mesh(new THREE.RingGeometry(PR-d-.07,PR-d+.07,96),new THREE.MeshBasicMaterial({color:'#fbf6ea',transparent:true,opacity:.75}));rg.rotation.x=-Math.PI/2;rg.position.y=.02;sc.add(rg)}
 const cj=new THREE.Mesh(new THREE.RingGeometry(PR,PR+2,72),M('#8a6a45',1));cj.rotation.x=-Math.PI/2;cj.position.y=.01;cj.receiveShadow=true;sc.add(cj);
 const bar=new THREE.Mesh(new THREE.CylinderGeometry(PR,PR,1.4,96,1,true),M('#8e2a26',.8,0,THREE.DoubleSide));bar.position.y=.7;bar.receiveShadow=true;bar.castShadow=true;sc.add(bar);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(PR,.07,6,96),M('#e7dcc2'));rim.rotation.x=Math.PI/2;rim.position.y=1.42;sc.add(rim);
 const cb=new THREE.Mesh(new THREE.CylinderGeometry(PR+2,PR+2,2.3,96,1,true),M('#6e2420',.8,0,THREE.DoubleSide));cb.position.y=1.15;cb.castShadow=true;sc.add(cb);
 for(const a of [.35,1.95,3.55,5.15]){const g=new THREE.Group();g.position.set(Math.sin(a)*(PR-.7),0,Math.cos(a)*(PR-.7));g.rotation.y=a;sc.add(g);mesh(G.box,M('#9f342f'),2.2,1.5,.12,0,.75,0,g);mesh(G.box,M('#e7dcc2'),2.2,.08,.14,0,1.5,0,g)}
 const tor=new THREE.Group();tor.position.set(0,0,-PR+.05);sc.add(tor);mesh(G.box,M('#1b120c'),2.4,1.36,.05,0,.68,-.04,tor);mesh(G.box,M('#e7dcc2'),2.7,.12,.14,0,1.42,0,tor);
 const tl=new THREE.Group(),trr=new THREE.Group();tl.position.set(-1.2,0,0);trr.position.set(1.2,0,0);tor.add(tl,trr);mesh(G.box,M('#8e2a26'),1.2,1.34,.08,.6,.68,0,tl);mesh(G.box,M('#8e2a26'),1.2,1.34,.08,-.6,.68,0,trr);
 const dg=new THREE.Group();dg.position.set(DOOR.x,0,DOOR.z);dg.rotation.y=Math.atan2(DOOR.x,DOOR.z);sc.add(dg);mesh(G.box,M('#2a1a14'),3,1.36,.05,0,.68,.62,dg);
 const rows=14,pts=[];for(let i=0;i<rows;i++){const x=PR+2+i*.95,y=2.3+i*.5;pts.push(new THREE.Vector2(x,y),new THREE.Vector2(x+.95,y),new THREE.Vector2(x+.95,y+.5))}
 const lat=new THREE.Mesh(new THREE.LatheGeometry(pts,96),M('#a79a86',.95,0,THREE.DoubleSide));lat.receiveShadow=true;lat.castShadow=true;sc.add(lat);
 const RO=PR+2+rows*.95;
 const wt=document.createElement('canvas');wt.width=512;wt.height=256;const wc=wt.getContext('2d');wc.fillStyle='#a8573a';wc.fillRect(0,0,512,256);wc.fillStyle='rgba(70,30,20,.25)';for(let y=0;y<256;y+=8)for(let x=(y/8%2)*12;x<512;x+=24)wc.fillRect(x,y,1,8);for(let y=0;y<256;y+=8)wc.fillRect(0,y,512,1);
 for(let i=0;i<4;i++){const cx=64+i*128;wc.fillStyle='#2a1a14';wc.beginPath();wc.moveTo(cx-34,240);wc.lineTo(cx-34,120);wc.arc(cx,120,38,Math.PI*1.1,Math.PI*1.9);wc.lineTo(cx+34,240);wc.fill();wc.strokeStyle='#e2c9a4';wc.lineWidth=5;wc.beginPath();wc.arc(cx,118,44,Math.PI*1.05,Math.PI*1.95);wc.stroke()}
 const wtx=new THREE.CanvasTexture(wt);wtx.wrapS=THREE.RepeatWrapping;wtx.repeat.set(16,1);
 const ow=new THREE.Mesh(new THREE.CylinderGeometry(RO+.4,RO+.4,6,96,1,true),new THREE.MeshStandardMaterial({map:wtx,roughness:.9,side:THREE.DoubleSide}));ow.position.y=2.3+rows*.5+3;ow.castShadow=true;sc.add(ow);
 const roofR=new THREE.Mesh(new THREE.RingGeometry(RO-3,RO+1,96),M('#9b4a2a',.85,0,THREE.DoubleSide));roofR.rotation.x=-Math.PI/2;roofR.position.y=2.3+rows*.5+6;roofR.castShadow=true;sc.add(roofR);
 const pcols=['#e9dcc5','#3a4b6e','#8a2f2a','#262626','#c79a45','#6b7d8f','#efe7da','#56634a','#b8735a','#f2e9d0'].map(c=>new THREE.Color(c));
 const seats=[];const rp=mulberry(11);
 for(let i=0;i<rows;i++){const rad=PR+2.5+i*.95,y=2.3+i*.5+.5,n=Math.floor(Math.PI*2*rad/.62);for(let j=0;j<n;j++){const a=j/n*Math.PI*2;if(rp()<.08)continue;if((a<.13||a>Math.PI*2-.13)&&i>8)continue;seats.push([a,rad,y,rp()])}}
 const body=new THREE.InstancedMesh(new THREE.BoxGeometry(.42,.6,.3),new THREE.MeshStandardMaterial({roughness:.8}),seats.length);
 const heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.12,8,6),M('#c79a74',.7),seats.length);
 const panu=new THREE.InstancedMesh(new THREE.PlaneGeometry(.32,.32),new THREE.MeshBasicMaterial({color:'#fbf8f1',side:THREE.DoubleSide}),seats.length);
 const o=new THREE.Object3D();
 seats.forEach(([a,rad,y,w],i)=>{const x=Math.sin(a)*rad,z=Math.cos(a)*rad;o.position.set(x,y,z);o.rotation.set(0,a+Math.PI,0);o.scale.set(1,1,1);o.updateMatrix();body.setMatrixAt(i,o.matrix);body.setColorAt(i,pcols[Math.floor(w*997)%pcols.length]);
  o.position.y=y+.43;o.updateMatrix();heads.setMatrixAt(i,o.matrix);o.position.y=y+.95;o.scale.set(0,0,0);o.updateMatrix();panu.setMatrixAt(i,o.matrix)});
 sc.add(body,heads,panu);
 const pa=new THREE.Group();const pr=PR+2+10*.95;pa.position.set(0,2.3+10*.5,pr);sc.add(pa);
 mesh(G.box,M('#7a1d22'),4,2.4,1.6,0,1.2,.2,pa);mesh(G.box,M('#e6bb55',.4,.5),4.1,.12,.2,0,.9,-.62,pa);
 const pp=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9,4,4),new THREE.MeshBasicMaterial({color:'#ffffff',side:THREE.DoubleSide}));pp.position.set(0,.4,-.7);pp.visible=false;pa.add(pp);
 const flw=[];const fcols=['#c0303a','#f4f0e6','#e6bb55','#d58fb0','#2b2b2b'];for(let i=0;i<26;i++){const m=mesh(G.box,M(fcols[i%5],.7),.14,.06,.2,0,-5,0,sc,true);m.visible=false;flw.push({m,st:1,act:false})}
 W3.P={sc,seats,body,heads,panu,pp,o,sun,toril:{l:tl,r:trr,a:0},flw,D:dustPool(sc)};return W3.P}
function setPanu(frac){const P=W3.P;if(P.frac===frac)return;P.frac=frac;const o=P.o;
 P.seats.forEach(([a,rad,y,w],i)=>{o.position.set(Math.sin(a)*rad,y+.95,Math.cos(a)*rad);o.rotation.set(0,a+Math.PI+(w-.5),.2*(w-.5));const s=w<frac?1:0;o.scale.set(s,s,s);o.updateMatrix();P.panu.setMatrixAt(i,o.matrix)});
 P.panu.instanceMatrix.needsUpdate=true}
function crowdAnim(P,lev,t){P.cf=(P.cf||0)+1;if(lev<.04&&P.lastLev<.04)return;if(P.cf%2)return;P.lastLev=lev;const o=P.o;
 P.seats.forEach(([a,rad,y,w],i)=>{const j=lev>.04&&w<lev*1.1?Math.max(0,Math.sin(t*9+w*40))*.22*lev:0;o.position.set(Math.sin(a)*rad,y+j,Math.cos(a)*rad);o.rotation.set(0,a+Math.PI,0);o.scale.set(1,1,1);o.updateMatrix();P.body.setMatrixAt(i,o.matrix);o.position.y=y+.43+j;o.updateMatrix();P.heads.setMatrixAt(i,o.matrix)});
 P.body.instanceMatrix.needsUpdate=true;P.heads.instanceMatrix.needsUpdate=true}
function throwFlower(x,z){const P=W3.P;const f=P.flw.find(q=>!q.act)||P.flw[Math.floor(Math.random()*P.flw.length)];const a=Math.atan2(x,z)+R(-.4,.4);f.from={x:Math.sin(a)*(PR+5),y:5,z:Math.cos(a)*(PR+5)};f.to={x:x+R(-2,2),z:z+R(-2,2)};f.st=0;f.act=true;f.m.visible=true}
function flowersTick(dt){for(const f of W3.P.flw){if(!f.act||f.st>=1)continue;f.st=Math.min(1,f.st+dt/1.3);const v=f.st;f.m.position.set(lerp(f.from.x,f.to.x,v),lerp(f.from.y,.04,v)+Math.sin(v*Math.PI)*4,lerp(f.from.z,f.to.z,v));f.m.rotation.set(v*9,v*5,0);if(v>=1)f.m.rotation.set(0,R(0,3),0)}}
function mkTorero(col,plata){return makePerson({traje:col,plata,hat:'montera'})}
function enterPlaza(id){
 const r=S.hist.find(h=>h.id===id);if(!r)return;
 if(!W3.on){if(!show3D())return;W3.from='2d'}else W3.from=W3.mode==='finca'?'finca':'2d';
 try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>W3.wl=l).catch(()=>{})}catch(e){}W3.drive=false;W3.ride=false;ambStop();S.porVer=S.porVer.filter(x=>x!==id);r.visto=true;save();
 const P=buildPlaza();W3.mode='plaza';W3.scene=P.sc;hudMode('plaza');crowdStart();
 if(CP&&CP.actors)for(const a of CP.actors)P.sc.remove(a);
 const ban=mkTorero('#2b3e5c',true);ban.arms.forEach(a=>{a.lock=1;a.sh.rotation.x=-2.6});
 for(const a of ban.arms){mesh(geos().cyl,M('#efe6d2'),.02,.75,.02,0,-.2,0,a.hand,true);mesh(geos().box,M('#bf3a3f'),.07,.2,.07,0,-.5,0,a.hand,true)}
 const pe=[0,1].map(i=>{const p=mkTorero(i?'#1f3a2a':'#3a2a1f',true);const c=makeCapote();c.scale.setScalar(.85);p.b.add(c);p.cap=c;return p});
 const hor=makeHorse2({peto:true,col:'#cfc6b4'});const pic=makePerson({traje:'#b9975a',hat:'castoreno',pole:3.4});seat(pic);pic.root.position.set(0,.98,-.05);pic.arms[1].lock=1;pic.arms[1].sh.rotation.x=-1;hor.body.add(pic.root);hor.rider=pic;
 const me=makePerson({jacket:'#5a3b25',shirt:'#f0ebe0',pants:'#3a3530',hat:'campero'});
 const cab=[0,1].map(i=>makeBull({pelo:i?'colorado':'jabonero',kind:'cabestro'}));
 const team=makeTeam();
 [ban,...pe].forEach(p=>P.sc.add(p.root));P.sc.add(hor.root,me.root,team.root,...cab.map(c=>c.root));
 const actors=[ban.root,hor.root,me.root,team.root,...pe.map(p=>p.root),...cab.map(c=>c.root)];
 // paseíllo
 const mats=[];for(const t of r.toros){if(!mats.some(m=>m.n===t.mat))mats.push({n:t.mat,t:t.traje||'#7a1525'})}while(mats.length<3)mats.push({n:'',t:pick(['#7a1525','#1d2f5e','#1f4a32'])});
 const PC=['#d9b24a','#c43f78','#2b5aa0','#e9e2c8'];
 const rows=[];const alg=[0,1].map(()=>{const h=makeHorse2({col:'#1e1712'});const rd=makePerson({jacket:'#141414',pants:'#141414',shirt:'#f4f0e6',hat:'chambergo',boots:'#141414'});seat(rd);rd.root.position.set(0,.98,-.05);h.body.add(rd.root);return {o:h,kind:'h',rider:rd}});rows.push(alg);
 rows.push(mats.slice(0,3).map((m,i)=>({o:makePerson({traje:m.t,hat:'montera',paseo:PC[i%4]}),kind:'p',mat:true})));
 for(let k=0;k<2;k++)rows.push([0,1,2].map(i=>({o:mkTorero(pick(['#2b3e5c','#1f3a2a','#3a2a1f','#4a1f2f','#222']),true),kind:'p'})));
 rows.push([0,1].map(()=>{const h=makeHorse2({peto:true,col:'#cfc6b4'});const rd=makePerson({traje:'#b9975a',hat:'castoreno'});seat(rd);rd.root.position.set(0,.98,-.05);h.body.add(rd.root);return {o:h,kind:'h',rider:rd}}));
 rows.push([{o:team,kind:'team'}]);
 rows.forEach(rw=>rw.forEach(a=>{if(a.kind!=='team'){P.sc.add(a.o.root);actors.push(a.o.root)}a.o.root.visible=false}));
 const sword=makeEstoque();
 CP={r,i:-1,spd:1,view:'tv',ban,pe,hor,me,cab,team,sword,pas:rows,actors,bull:null,saludo:false,exc:0,cut:true};
 W3.yaw=-.4;W3.pitch=.35;W3.cam.fov=46;W3.cam.updateProjectionMatrix();
 $('#pv').textContent='Cámara: TV';$('#ps').textContent='×1';
 cpNext()}
function cpNext(){
 const P=W3.P,C=CP;C.i++;$('#h3dim').hidden=true;$('#psal').hidden=true;$('#h3ban').hidden=true;C.salDone=false;C.saludo=false;musicStop();
 P.flw.forEach(f=>{f.act=false;f.m.visible=false});
 C.pas.forEach(rw=>rw.forEach(a=>{a.o.root.visible=false}));C.team.root.visible=false;
 if(C.i>=C.r.toros.length){cpEnd();return}
 const t=C.r.toros[C.i];
 if(C.sword.parent)C.sword.parent.remove(C.sword);C.sword.visible=false;
 for(const k of ['bull','tor','sus']){if(C[k]){P.sc.remove(C[k].root);C[k]=null}}
 C.bull=makeBull({pelo:t.pelo,kind:'toro',m:t.m,div:t.div||S.g.div});P.sc.add(C.bull.root);C.actors.push(C.bull.root);
 const mkT=col=>{const tp=mkTorero(col);const mul=makeMuleta();tp.arms[0].hand.add(mul);tp.mul=mul;tp.cap=makeCapote();tp.b.add(tp.cap);P.sc.add(tp.root);C.actors.push(tp.root);return tp};
 C.tor=mkT(t.traje||'#7a1525');if(t.sust)C.sus=mkT(t.sust.t);
 C.s=freshState();C.g=buildGuion(t,C.i===0,C);C.ai=0;C.at=0;if(C.g[0].init)C.g[0].init(C.s);C.done=false;C.cut=true;C.shotI=0;C.lastA=-1;
 setPanu(0);P.pp.visible=false;
 $('#h3toro').textContent=`Toro ${C.i+1} de ${C.r.toros.length} · ${t.name}${t.num!=null?' nº '+t.num:''} · ${t.peso} kg · ${t.mat} (${ESTILO[t.estilo]||'lidiador'})`;$('#h3cap').textContent=C.g[0].cap}
function freshState(){const T=()=>({x:0,z:3,yaw:Math.PI,pose:'stand',cape:null,hand:0,sweep:0,y:0,rx:0,spin:0,vis:false,sp:0,arm:null,sword:false,capeUp:false});
 return {b:{x:0,z:-PR+1.2,yaw:0,head:.3,sp:0,kneel:0,toss:0,look:0,push:false,band:0,vis:true,fall:0,sword:0,drag:false},t:{...T(),x:-PR+3,z:2,vis:true},s2:T(),act:'t',ban:{vis:false,x:0,z:0,yaw:0,y:0,sp:0},
  pe:[{x:Math.sin(1.4)*(PR-2.5),z:Math.cos(1.4)*(PR-2.5),vis:true,sw:0,sp:0,yaw:null},{x:Math.sin(-1.1)*(PR-2.5),z:Math.cos(-1.1)*(PR-2.5),vis:true,sw:0,sp:0,yaw:null}],
  hor:{vis:false,fall:0,x:-13,z:-6,yaw:.87},cab:{vis:false,x:0,z:-PR,yaw:0,sp:0},team:{vis:false,x:DOOR.x,z:DOOR.z,yaw:0,sp:0},toril:0,palco:null,cam:null}}
function cpEnd(){const C=CP;C.done=true;const r=C.r;musicStop();applause(3,.25);
 $('#h3dim').hidden=false;$('#h3dim').style.opacity=1;$('#h3dim').innerHTML=`<div class="stack" style="max-width:560px;width:100%"><h2>Fin del festejo</h2><div>${esc(r.resumen)}</div>
 <div class="kv" style="justify-content:center"><span>Prestigio <b>${r.dp>=0?'+':''}${r.dp}</b></span><span>Ingresos <b>${eur(r.ingreso)}</b></span>${r.premio?`<span>Premio al toro más bravo: <b>${esc(r.premio)}</b></span>`:''}</div>
 <div class="tw"><table class="t">${r.toros.map(t=>`<tr><td><b>${esc(t.name)}</b> <span class="mono muted">${t.num??''}</span></td><td>${esc(t.mat)}${t.cogida?' <span class="badge bad">cogida</span>':''}</td><td class="res-${t.res}">${RESTXT[t.res]}</td><td class="num">${t.res==='indulto'?'Indulto':t.trof?`${t.trof} ${t.trof>1?'orejas':'oreja'}`:'—'}</td></tr>`).join('')}</table></div>
 <button class="btn oro" onclick="exitPlaza()">Salir de la plaza</button></div>`;$('#h3cap').textContent=''}
function exitPlaza(){if(CP&&CP.actors)for(const a of CP.actors)W3.P.sc.remove(a);if(CP&&CP.sword&&CP.sword.parent)CP.sword.parent.remove(CP.sword);$('#h3dim').hidden=true;W3.cam.fov=60;W3.cam.updateProjectionMatrix();musicStop();crowdStop();
 if(W3.from==='finca')enterFinca();else exit3D()}
function saludar(){const C=CP;if(!C||C.saludo||C.salDone)return;C.saludo=true;C.salT=0;$('#psal').hidden=true;S.pres=clamp(S.pres+.5,0,100);save();ole('¡Ganadero!');applause(3,.35)}
function oleP(txt,big){ole(txt);oleSnd(big);if(CP)CP.exc=Math.min(1,(CP.exc||0)+(big?.6:.35))}

/* ---------- guion de la lidia ---------- */
const PT2=(x,z)=>({x,z});
function perfilDef(t){return {gal:t.gal??.95,rec:t.rec??clamp(((t.N||60)-40)/45,.15,1),hum:t.hum??clamp(((t.N||60)-45)/45,0,1),derr:t.derr??.4,corto:t.corto??((t.N||60)<60)}}
function buildGuion(t,first,C){
 const g=[],P=perfilDef(t),st=t.estilo||'tecnico',B=t.B||65,mat=t.mat,sust=t.sust?t.sust.n:null;let cu=false;const cog=t.cogida;const A=o=>{g.push(o);return o};
 const desc=`${t.name}${t.num!=null?', nº '+t.num:''}, ${t.pelo}, ${t.peso} kg`;
 if(first&&C&&C.pas)A(actPaseillo(C));
 if(t.portagayola)A(actPortagayola(P,mat));
 A(actSalida(t,P,desc,!(first&&C&&C.pas)));
 if(t.res==='devuelto'){A(actFlojea(P));A(actCabestros('devuelto'));return g}
 const nCap=st==='tecnico'?4:st==='artista'?5:3;const chic=st==='tremendista'||st==='valiente';
 if(cog&&cog.tercio==='capote'){A(actCapote(P,Math.min(nCap,cog.pase+1),chic,mat,true));A(actCogida(t,P));A(actRelevo(t));cu=true}
 else A(actCapote(P,nCap,chic,mat,false));
 A(actVaras(t,P,B,mat));
 A(actBanderillas(P));
 const who=cu?'s2':'t';
 if(Math.random()<.7&&!cu)A(actBrindis(st,mat));
 const nS=t.rajado?2:t.score>80?4:t.score>70?3:2;
 const tipos={artista:['derechazos','naturales','derechazos','naturales'],tecnico:['derechazos','derechazos','naturales','derechazos'],tremendista:['rodillas','derechazos','naturales','circulares'],valiente:['derechazos','naturales','circulares','derechazos'],poderoso:['derechazos','derechazos','naturales','circulares']}[st]||['derechazos','naturales','derechazos','naturales'];
 for(let s=0;s<nS;s++){
  if(t.rajado&&s===1){A(actRaja(P,who));A(actSerie(P,'tablas',3,who,st,false,false,false));continue}
  const np=clamp(Math.round((t.pases||4)*.8+R(-1,1)),2,6)-(P.corto?1:0);
  A(actWalk(who,s,st));
  const coger=cog&&cog.tercio==='muleta'&&!cu&&s===Math.min(nS-1,cog.pase-1);
  A(actSerie(P,tipos[s%tipos.length],Math.max(2,np),who,st,coger,s===1&&t.fell,s>=1&&(t.score||0)>74));
  if(coger){A(actCogida(t,P));A(actRelevo(t));cu=true;break}
  A(actRemate(P,who,st,s===nS-1));
 }
 const killer=cu?'s2':'t',kname=cu?sust:mat;
 if(t.res==='indulto'){A(actIndulto(t,killer));A(actCabestros('indulto'));A(actVuelta(killer,kname,2));return g}
 A(actEstocada(t,killer,kname));A(actDobla(t));A(actPeticion(t,killer,kname));A(actArrastre(t));if(t.trof>0)A(actVuelta(killer,kname,t.trof));
 return g}
function TS(Z){return Z.act==='s2'?Z.s2:Z.t}
function faceTo(o,x,z){o.yaw=Math.atan2(x-o.x,z-o.z)}
function actPaseillo(C){const D=DOOR,E={x:0,z:PR-7};const dx=E.x-D.x,dz=E.z-D.z,Ln=Math.hypot(dx,dz),ux=dx/Ln,uz=dz/Ln,px=-uz,pz=ux,yaw=Math.atan2(ux,uz);const rows=C.pas;
 return {d:22,shots:['hint'],cap:'Suena el pasodoble. Los alguacilillos abren plaza y las cuadrillas hacen el paseíllo, montera calada y capote de paseo.',
  init(Z){musicStart();applause(4,.2);Z.b.vis=false;Z.t.vis=false;Z.pe.forEach(p=>p.vis=false);rows.forEach(r=>r.forEach(a=>{a.o.root.visible=true}))},
  f(Z,u,dt){const T=u*22;Z.b.vis=false;Z.t.vis=false;Z.pe.forEach(p=>p.vis=false);
   rows.forEach((r,ri)=>{const lim=Ln-ri*2.8-1.2,s=clamp((T-ri*1.2)*1.6,0,lim),mov=s>0&&s<lim-.05;
    r.forEach((a,j)=>{const off=(j-(r.length-1)/2)*(a.kind==='h'?2.3:1.35);a.o.root.position.set(D.x+ux*s+px*off,0,D.z+uz*s+pz*off);a.o.root.rotation.y=yaw;a.o.root.visible=T<21.4;
     if(a.kind==='h'){animHorse(a.o,dt,mov?.6:0);animPerson(a.rider,dt,0)}
     else if(a.kind==='team'){a.o.mules.forEach(m=>animHorse(m,dt,mov?.6:0));a.o.men.forEach(p=>animPerson(p,dt,mov?.55:0))}
     else{const ar=a.o.arms[1];if(a.mat&&T>17){ar.lock=1;ar.sh.rotation.set(-2.6,0,0)}else ar.lock=0;animPerson(a.o,dt,mov?.55:0)}})});
   const front=clamp(T*1.6,0,Ln-1.2);Z.cam={p:[D.x+ux*(front+6)+px*2.5,1.7,D.z+uz*(front+6)+pz*2.5],l:[D.x+ux*(front-3),1.3,D.z+uz*(front-3)]};
   if(T>16&&!Z.pk){Z.pk=1;banner('Paseíllo','Los matadores saludan a la presidencia',3)}
   if(T>21&&!Z.pasEnd){Z.pasEnd=1;musicStop();clarin()}}}}
function actPortagayola(P,mat){return {d:4.2,shots:['toril','low'],cap:`¡A porta gayola! ${mat} se va de rodillas a la puerta de chiqueros.`,init(Z){Z.pg=1;const T=Z.t;T.vis=true;T.x=0;T.z=-PR+4.5;T.yaw=Math.PI;T.pose='kneel';T.cape='capote';Z.b.vis=true;Z.b.x=0;Z.b.z=-PR+.6;Z.toril=1;clarin()},
 f(Z,u){const T=Z.t,b=Z.b;Z.toril=1;if(u<.35){b.x=0;b.z=-PR+.6;T.sweep=0}else{const v=(u-.35)/.65;b.x=lerp(0,4,v)+Math.sin(v*Math.PI)*-1.4;b.z=lerp(-PR+.6,-PR+12,v);b.sp=1.3;b.head=.5;T.sweep=clamp((v-.3)*3,-1,1);T.capeUp=v>.25&&v<.7;if(v>.45&&!Z.pgo){Z.pgo=1;oleP('¡Olé!',true)}}
  if(u>.95){T.pose='stand';T.capeUp=false}}}}
function actSalida(t,P,desc,snd){let pts;return {d:t.distraido?5:4.2,shots:['toril','wide'],cap:`Sale de chiqueros ${desc}.${t.remata?' Remata en tablas con fuerza.':t.distraido?' Sale abanto, mirando a los tendidos.':''}`,
 init(Z){const b=Z.b;b.vis=true;pts={x0:b.x,z0:b.z,bur:PT2(Math.sin(.35)*(PR-1.6),Math.cos(.35)*(PR-1.6))};Z.t.vis=true;Z.t.cape='capote';if(!Z.pg){Z.t.x=-PR+3;Z.t.z=2}Z.t.pose='stand';Z.pe.forEach(p=>p.vis=true);if(snd)clarin();Z.toril=1;setTimeout(()=>bufido(.7),400)},
 f(Z,u){const b=Z.b;Z.toril=u<.5?1:0;
  if(t.remata){if(u<.5){const v=ease(u/.5);b.x=lerp(pts.x0,pts.bur.x,v);b.z=lerp(pts.z0,pts.bur.z,v);b.sp=1.3*P.gal;b.head=.5}
   else if(u<.62){b.x=pts.bur.x;b.z=pts.bur.z;b.head=1;b.toss=u<.56?1:0;if(!pts.hit){pts.hit=1;dust(W3.P.D,b.x,0,b.z,.6);dust(W3.P.D,b.x,0,b.z,.5);oleP('¡Uy!',false)}}
   else{const v=ease((u-.62)/.38);b.x=lerp(pts.bur.x,4,v);b.z=lerp(pts.bur.z,-4,v);b.sp=1.1*P.gal;b.head=.3}}
  else if(t.distraido){const v=ease(Math.min(1,u*1.4));b.x=lerp(pts.x0,3,v);b.z=lerp(pts.z0,-6,v);b.sp=u<.7?.6:0;b.head=.1;b.look=Math.sin(u*14)}
  else{const v=ease(u);b.x=lerp(pts.x0,4,v)+Math.sin(v*Math.PI)*5;b.z=lerp(pts.z0,-4,v);b.sp=1.3*P.gal;b.head=.3}
  Z.pe[0].sw=Math.sin(u*20)*.6}}}
function actFlojea(P){let p0;return {d:4.5,shots:['wide'],cap:'Pierde las manos una y otra vez. El público protesta: no tiene fuerza para la lidia.',init(Z){p0={x:Z.b.x,z:Z.b.z};whistles(.8)},
 f(Z,u){const b=Z.b,q=Math.sin(u*Math.PI*4);b.x=p0.x+Math.sin(u*3)*3;b.z=p0.z+u*4;b.sp=q>.5?.1:.6;b.kneel=q>.55?(q-.55)*2.2:0;b.head=.2}}}
function actCapote(P,n,chic,mat,cut){let T0,ax,b0;const off=1.3,Lc=2.6+P.rec*3,tp=1.9/P.gal;
 return {d:n*tp+1.6,shots:['low','wide','rev'],cap:`${mat} recibe con el capote: ${chic?'chicuelinas y tafalleras ceñidas':'verónicas'}${P.corto?'. El toro se queda corto y obliga a enmendarse.':P.rec>.7?', largas, con el toro humillado.':'.'}`,
  init(Z){const Tq=Z.t;Tq.vis=true;Tq.cape='capote';Tq.pose='stand';T0=PT2(2,-2);Tq.x=T0.x;Tq.z=T0.z;b0={x:Z.b.x,z:Z.b.z};const d=Math.hypot(b0.x-T0.x,b0.z-T0.z)||1;ax={x:(b0.x-T0.x)/d,z:(b0.z-T0.z)/d}},
  f(Z,u){const Tq=Z.t,b=Z.b;const tot=n*tp,tu=u*(tot+1.6);
   if(tu<tot){const k=Math.floor(tu/tp),v=tu/tp-k;const sg=k%2?-1:1;const ev=v+.07*Math.sin(2*Math.PI*v);
    const A0=k===0?b0:{x:T0.x+ax.x*Lc*(k%2?-1:1),z:T0.z+ax.z*Lc*(k%2?-1:1)},A1={x:T0.x+ax.x*Lc*(k%2?1:-1),z:T0.z+ax.z*Lc*(k%2?1:-1)};
    const pr={x:-ax.z,z:ax.x};const lat=sg*off*Math.sin(Math.PI*ev)*(P.corto?.6:1);
    b.x=lerp(A0.x,A1.x,ev)+pr.x*lat;b.z=lerp(A0.z,A1.z,ev)+pr.z*lat;b.sp=P.corto&&v>.6?.4:1.05*P.gal;b.head=.35+.6*P.hum*Math.sin(Math.PI*ev);if(v>.8)b.toss=P.derr*(v-.8)*4;
    faceTo(Tq,A0.x,A0.z);Tq.sweep=(ev-.5)*2*sg;Tq.spin=chic&&ev>.5?(ev-.5)*2*Math.PI*2:0;
    if(v>.45&&!Z['oc'+k]){Z['oc'+k]=1;if(P.hum>.5)oleP('¡Olé!',k>=2)}}
   else{const v=(tu-tot)/1.6;b.sp=Math.max(0,.8-v*2);faceTo(b,Tq.x,Tq.z);b.head=.3;Tq.spin=0;Tq.sweep=0;if(v>.3&&!cut){Tq.yaw=Math.atan2(-ax.x,-ax.z);Tq.x+=Math.sin(Tq.yaw)*.03;Tq.z+=Math.cos(Tq.yaw)*.03;Tq.sp=.5}
    if(!Z.capApp&&!cut&&v>.2){Z.capApp=1;applause(2.5,.25)}}}}}
function actVaras(t,P,B,mat){const n=Math.max(1,t.entradas||(B>80?3:B>66?2:1)),der=!!t.derribo,Hp=PT2(-13,-6),Cn=PT2(-10.8,-5.1);let b0;const D=3.4*n+(der?4:0)+2.5;
 return {d:D,shots:['side','wide'],cap:`Suena el clarín: tercio de varas. ${n} ${n>1?'entradas':'entrada'} al caballo. ${B>80?'Se arranca de largo y empuja con los riñones metidos.':B>66?'Cumple en el peto.':'Sale suelto del peto, cabeceando.'}${der?' ¡Derriba al caballo! Quite providencial de la cuadrilla.':''}`,
  init(Z){clarin();Z.hor.vis=true;Z.hor.x=-13;Z.hor.z=-6;Z.hor.yaw=.87;Z.t.x=-7;Z.t.z=-1;Z.t.cape='capote';Z.t.spin=0;b0={x:Z.b.x,z:Z.b.z};Z.cam={p:[-5,2.3,-11.5],l:[-11.2,1.3,-5.6]}},
  f(Z,u){const b=Z.b,tt=u*D,T=Z.t;
   if(tt<3.4*n){const k=Math.floor(tt/3.4),v=tt/3.4-k;const A0=k===0?b0:PT2(-3,-2);
    if(v<.35){const e=ease(v/.35);b.x=lerp(A0.x,Cn.x,e);b.z=lerp(A0.z,Cn.z,e);b.sp=1.2*P.gal;b.head=.45}
    else if(v<.8){b.x=Cn.x+Math.sin(performance.now()/70)*.05*(B/60);b.z=Cn.z;b.push=true;b.head=1;b.yawOverride=Math.atan2(Hp.x-b.x,Hp.z-b.z);if(Math.random()<.15)dust(W3.P.D,b.x,0,b.z,.4);if(!Z['vp'+k]){Z['vp'+k]=1;bufido(.6);if(B>78)applause(2,.2)}}
    else{const e=(v-.8)/.2;b.x=lerp(Cn.x,-3,e);b.z=lerp(Cn.z,-2,e);b.sp=.7;b.head=.3}
    faceTo(T,b.x,b.z)}
   else if(der&&tt<3.4*n+4){const v=(tt-3.4*n)/4;Z.hor.fall=v<.2?v/.2:v<.75?1:1-(v-.75)/.25;if(!Z.derOk){Z.derOk=1;oleP('¡Uyyy!',true)}
    if(v<.15){b.x=Cn.x;b.z=Cn.z;b.push=true;b.head=1;b.toss=v>.08?1:0}
    else{const e=ease(Math.min(1,(v-.15)/.5));b.x=lerp(Cn.x,-4,e);b.z=lerp(Cn.z,4,e);b.sp=1;b.head=.6;const p=Z.pe[0];p.x=lerp(p.x,b.x-1.5,.05);p.z=lerp(p.z,b.z+1.5,.05);p.sw=Math.sin(v*20);p.sp=1}}
   else{const v=(tt-3.4*n-(der?4:0))/2.5;Z.hor.fall=0;Z.hor.vis=v<.5;Z.hor.x=lerp(-13,-PR+2,v);b.sp=v<.6?.8:0;b.x=lerp(b.x,1,.03);b.z=lerp(b.z,-1,.03);faceTo(T,b.x,b.z);T.sweep=Math.sin(v*9)*.8;T.spin=t.estilo==='artista'?0:(v>.3&&v<.7?(v-.3)*2.5*Math.PI*2:0)}}}}
function actBanderillas(P){let A;return {d:9,shots:['wide','toro','low'],cap:'Cambio de tercio. Los subalternos dejan tres pares de banderillas asomándose al balcón.',
 init(Z){clarin();Z.t.vis=false;Z.s2.vis=false;A=[{x:Z.b.x,z:Z.b.z},PT2(7,1),PT2(-7,1),PT2(7,1)];Z.ban.vis=true;Z.ban.x=7;Z.ban.z=4},
 f(Z,u){const b=Z.b,k=Math.min(2,Math.floor(u*3)),v=u*3-k;const a=A[k],c=A[k+1];
  if(v<.75){const e=v/.75;b.x=lerp(a.x,c.x,e);b.z=lerp(a.z,c.z,e);b.sp=1.1*P.gal;b.head=.55;const bx=lerp(c.x,a.x,e),bz=lerp(c.z,a.z,e)+1.4-Math.abs(e-.5)*1.2;Z.ban.x=bx;Z.ban.z=bz;Z.ban.y=Math.max(0,1-Math.abs(e-.5)*8)*.5;Z.ban.yaw=Math.atan2(b.x-bx,b.z-bz);Z.ban.sp=1.2;
   if(e>.5&&Z.b.band<(k+1)*2){Z.b.band=(k+1)*2;b.toss=P.derr;if(P.derr<.4){oleP('¡Bien!',false);applause(1.8,.25)}else ole('¡Uy!')}}
  else{b.sp=0;b.head=.3;Z.ban.sp=1;Z.ban.x=lerp(Z.ban.x,c.x+4,.04);Z.ban.z=lerp(Z.ban.z,PR-3,.04);Z.ban.y=0;const p=Z.pe[1];p.x=lerp(p.x,b.x+2,.06);p.z=lerp(p.z,b.z,.06);p.sw=Math.sin(u*40)*.6}
  if(u>.97)Z.ban.vis=false}}}
function actBrindis(st,mat){let P0;return {d:4.5,shots:['low','palco'],cap:`${mat} brinda la muerte del toro ${st==='artista'?'al público, montera en mano':'a la presidencia'}.`,
 init(Z){clarin();Z.t.vis=true;Z.t.cape=null;Z.t.x=4;Z.t.z=PR-10;P0={x:Z.t.x,z:Z.t.z};Z.t.pose='stand'},
 f(Z,u){const T=Z.t;const tgt=PT2(0,PR-4);if(u<.5){const v=ease(u/.5);T.x=lerp(P0.x,tgt.x,v);T.z=lerp(P0.z,tgt.z,v);T.sp=.9;faceTo(T,tgt.x,tgt.z+5)}else{T.sp=0;T.yaw=0;T.arm=u<.85?'up':null;if(!Z.brOk){Z.brOk=1;applause(2.5,.3)}}Z.b.head=.2;Z.b.look=Math.sin(u*6)*.5}}}
function actWalk(who,s,st){let P0,dst;return {d:2.6,shots:['wide','rev'],cap:s===0?'Comienza la faena de muleta.':'',
 init(Z){const T=Z[who];T.vis=true;Z.act=who;T.cape='muleta';T.pose='stand';T.hand=0;P0={x:T.x,z:T.z};const b=Z.b;const dd=st==='artista'?7:st==='valiente'?3.5:5;
  let ang=Math.atan2(T.x-b.x,T.z-b.z);if(!isFinite(ang))ang=0;dst={x:b.x+Math.sin(ang)*dd,z:b.z+Math.cos(ang)*dd};const r=Math.hypot(dst.x,dst.z);if(r>PR-4){dst.x*=(PR-4)/r;dst.z*=(PR-4)/r}if(s===0&&who==='t'&&!Z.brOk)clarin()},
 f(Z,u){const T=Z[who];const v=ease(u);T.x=lerp(P0.x,dst.x,v);T.z=lerp(P0.z,dst.z,v);T.sp=u<.8?.8:0;if(u>.7)faceTo(T,Z.b.x,Z.b.z);else faceTo(T,dst.x,dst.z);T.sweep=u>.75?Math.sin(u*12)*.2:0;Z.b.head=.25;Z.b.yawOverride=Math.atan2(T.x-Z.b.x,T.z-Z.b.z)}}}
function actSerie(P,tipo,np,who,st,coger,cae,music){let T0,r0,th0,dir,rad;const tp=1.9/P.gal*(P.rec>.6?1.15:1);
 const nom={derechazos:'Serie de derechazos',naturales:'Al natural, con la izquierda',circulares:'Circulares invertidos',rodillas:'De rodillas, en los medios',tablas:'Pegado a tablas, por la cara'}[tipo];
 return {d:np*tp,shots:['low','rev','toro','wide'],cap:`${nom}${P.corto?': el toro se queda corto y protesta.':P.rec>.7?': el toro repite largo y humillado.':'.'}${cae?' Pierde las manos.':''}${music?' ¡Música, maestro! La banda arranca un pasodoble.':''}`,
  init(Z){const T=Z[who];T.vis=true;Z.act=who;T.cape='muleta';T.hand=tipo==='naturales'?1:0;T.pose=tipo==='rodillas'?'kneel':'stand';T0={x:T.x,z:T.z};if(music)musicStart();
   const b=Z.b;r0=Math.hypot(b.x-T0.x,b.z-T0.z)||4;th0=Math.atan2(b.x-T0.x,b.z-T0.z);dir=tipo==='naturales'?-1:1;rad=(st==='valiente'?1.25:st==='tecnico'?1.9:1.6)+(1-P.hum)*.35},
  f(Z,u){const T=Z[who],b=Z.b,tt=u*np*tp;const k=Math.min(np-1,Math.floor(tt/tp)),v=tt/tp-k;let th,rr;
   if(tipo==='tablas'||P.corto){th=th0+dir*Math.PI*.9*(k%2?1-ease(Math.min(1,v*1.2)):ease(Math.min(1,v*1.2)));rr=k===0?lerp(r0,rad,Math.min(1,v*2)):rad;if(v>.8)b.toss=P.derr}
   else{const ev=v+.06*Math.sin(2*Math.PI*v);th=th0+dir*Math.PI*(k+ev);rr=k===0?lerp(r0,rad,Math.min(1,v*1.6)):rad}
   b.x=T0.x+Math.sin(th)*rr;b.z=T0.z+Math.cos(th)*rr;b.sp=.85*P.gal+.15;b.head=.4+.6*P.hum;b.yawOverride=th+dir*Math.PI/2;
   if(cae&&k===1&&v>.3&&v<.7){b.kneel=Math.sin((v-.3)/.4*Math.PI);b.sp=.1}
   faceTo(T,b.x,b.z);T.yaw+=dir*.5;T.sweep=dir*(v-.5)*2;
   if(v>.45&&!Z['o'+k+tipo+who]){Z['o'+k+tipo+who]=1;if(P.hum>.45&&!P.corto)oleP(k>=2?'¡Olé, olé!':'¡Olé!',k>=2);else if(P.corto&&Math.random()<.5)whistles(.3)}}}}
function actRemate(P,who,st,last){let p0,p1,said;const nom={artista:'Remata con un pase de pecho de pitón a rabo y una trinchera de cartel.',tecnico:'Pase de pecho y se va andando, sin prisa.',tremendista:'Desplante de rodillas, de espaldas al toro. ¡Se viene arriba la plaza!',valiente:'Pase de pecho, y aguanta la mirada del toro a un palmo.',poderoso:'Molinete y pase de pecho. Manda en el toro.'}[st];
 return {d:2.4,shots:['low','wide'],cap:nom,init(Z){const b=Z.b,T=Z[who];p0={x:b.x,z:b.z};const a=Math.atan2(b.x-T.x,b.z-T.z);p1={x:T.x+Math.sin(a+.3)*7,z:T.z+Math.cos(a+.3)*7};const r=Math.hypot(p1.x,p1.z);if(r>PR-3){p1.x*=(PR-3)/r;p1.z*=(PR-3)/r}said=0},
 f(Z,u){const b=Z.b,T=Z[who];const v=ease(Math.min(1,u*1.4));b.x=lerp(p0.x,p1.x,v);b.z=lerp(p0.z,p1.z,v);b.sp=u<.7?1:0;b.head=u<.3?.2:.4;b.toss=u<.25?.4:0;T.sweep=u<.3?-1+u*6:0;
  if(st==='tremendista'&&u>.4&&u<.9){T.pose='kneel';T.yaw=Math.atan2(T.x-b.x,T.z-b.z)}else{faceTo(T,b.x,b.z);T.pose='stand'}
  T.spin=st==='artista'&&u>.35&&u<.5?(u-.35)/.15*Math.PI:0;
  if(u>.5&&!said){said=1;oleP(last?'¡Torero, torero!':'¡Olé!',true);applause(2.2,last?.45:.3)}}}}
function actRaja(P,who){let p0,tb;return {d:3.2,shots:['wide'],cap:'Se raja: rompe la faena y se va a buscar el abrigo de las tablas.',init(Z){p0={x:Z.b.x,z:Z.b.z};const a=Math.atan2(p0.x,p0.z);tb={x:Math.sin(a)*(PR-2.2),z:Math.cos(a)*(PR-2.2)};whistles(.5)},
 f(Z,u){const b=Z.b,T=Z[who];const v=ease(Math.min(1,u*1.5));b.x=lerp(p0.x,tb.x,v);b.z=lerp(p0.z,tb.z,v);b.sp=u<.66?1:0;b.head=.15;T.x=lerp(T.x,tb.x*.88,.02);T.z=lerp(T.z,tb.z*.88,.02);T.sp=.7;faceTo(T,b.x,b.z)}}}
function actCogida(t,P){let p0,land,bar;const c=t.cogida;
 return {d:8,shots:['low','wide'],cap:`¡Cogida! El toro prende a ${t.mat} y lo voltea. La cuadrilla entra al quite. Parte médico: ${c.parte}.`,
  init(Z){musicStop();const T=Z.t;Z.act='t';T.vis=true;p0={x:T.x,z:T.z};const b=Z.b;const a=Math.atan2(T.x-b.x,T.z-b.z);land={x:T.x+Math.sin(a)*2.2,z:T.z+Math.cos(a)*2.2};const ra=Math.atan2(land.x,land.z);bar={x:Math.sin(ra)*(PR-.8),z:Math.cos(ra)*(PR-.8)}},
  f(Z,u){const T=Z.t,b=Z.b;
   if(u<.08){b.x=lerp(b.x,T.x,.3);b.z=lerp(b.z,T.z,.3);b.sp=1;b.head=1;b.yawOverride=Math.atan2(T.x-b.x,T.z-b.z)}
   else if(u<.3){const v=(u-.08)/.22;T.x=lerp(p0.x,land.x,v);T.z=lerp(p0.z,land.z,v);T.y=Math.sin(v*Math.PI)*2.6;T.rx=-v*Math.PI*1.6;T.cape=null;b.toss=v<.4?1:.3;b.head=1;b.sp=.2;if(!Z.cgS){Z.cgS=1;oleP('¡Aaay!',true);bufido(.8);try{navigator.vibrate&&navigator.vibrate(150)}catch(e){}}}
   else if(u<.42){T.y=0;T.rx=-Math.PI/2;T.x=land.x;T.z=land.z;b.yawOverride=Math.atan2(T.x-b.x,T.z-b.z);b.sp=.4;b.head=1;b.x=lerp(b.x,T.x,.02);b.z=lerp(b.z,T.z,.02);b.toss=Math.sin(u*80)>.6?.6:0;
    Z.pe.forEach((p,i)=>{p.x=lerp(p.x,b.x+(i?2:-2),.08);p.z=lerp(p.z,b.z+1.5,.08);p.sw=Math.sin(u*60);p.sp=1.2})}
   else if(u<.65){b.x=lerp(b.x,Z.pe[0].x+4,.03);b.z=lerp(b.z,Z.pe[0].z-4,.03);b.sp=.9;b.head=.6;Z.pe[0].x+=.04;Z.pe[0].z-=.04;Z.pe[0].sw=Math.sin(u*50);Z.pe[0].sp=1;
    Z.pe[1].x=lerp(Z.pe[1].x,T.x+.6,.1);Z.pe[1].z=lerp(Z.pe[1].z,T.z,.1);Z.pe[1].sp=1}
   else{const v=ease((u-.65)/.35);T.rx=-Math.PI/2;T.y=.95;T.x=lerp(land.x,bar.x,v);T.z=lerp(land.z,bar.z,v);T.yaw=Math.atan2(bar.x-land.x,bar.z-land.z)+Math.PI/2;
    Z.pe[1].x=T.x+.6;Z.pe[1].z=T.z;Z.pe[1].sp=.8;Z.pe[1].yaw=T.yaw-Math.PI/2;b.sp=0;b.head=.3;if(u>.97)T.vis=false;if(!Z.cgA){Z.cgA=1;applause(3,.3)}}}}}
function actRelevo(t){let P0;return {d:3,shots:['wide'],cap:`${t.sust.n} se hace cargo del toro mientras ${t.mat} es atendido en la enfermería.`,
 init(Z){const s2=Z.s2;s2.vis=true;s2.cape='muleta';s2.hand=0;s2.pose='stand';const a=Math.atan2(Z.b.x,Z.b.z)+1.2;s2.x=Math.sin(a)*(PR-1.5);s2.z=Math.cos(a)*(PR-1.5);P0={x:s2.x,z:s2.z};Z.act='s2';Z.t.vis=false},
 f(Z,u){const s2=Z.s2,b=Z.b;const v=ease(u);s2.x=lerp(P0.x,b.x*.6+2,v);s2.z=lerp(P0.z,b.z*.6+2,v);s2.sp=u<.9?.9:0;faceTo(s2,b.x,b.z);b.head=.3;b.yawOverride=Math.atan2(s2.x-b.x,s2.z-b.z)}}}
function actEstocada(t,who,mat){const n=t.ent||1,dsc=t.desc||0,av=t.avisos||0,per=3.4,D=per*n+dsc*2.4+.8;let base=null;
 const txt=n===1?`${mat} monta la espada, se perfila y entra a matar: ${t.esto==='media'?'media estocada, algo trasera':'estocada entera, en todo lo alto'}.`:`${mat} entra a matar: ${n-1} ${n-1>1?'pinchazos':'pinchazo'} antes de ${t.esto==='media'?'media estocada':'una estocada entera'}.`;
 return {d:D,shots:['low','rev'],cap:txt+(dsc?` Necesita ${dsc} ${dsc>1?'descabellos':'descabello'}.`:''),
  init(Z){musicStop();const T=Z[who];T.vis=true;T.cape='muleta';T.hand=0;T.pose='stand';T.sword=true;Z.b.sword=0},
  f(Z,u){const T=Z[who],b=Z.b,tt=u*D;b.head=.75;
   if(!base){const a=Math.atan2(T.x-b.x,T.z-b.z);base={a,x:b.x,z:b.z}}
   const fx=Math.sin(b.yaw),fz=Math.cos(b.yaw),px=Math.cos(b.yaw),pz=-Math.sin(b.yaw);
   if(tt<per*n){const k=Math.floor(tt/per),v=tt/per-k;const pf={x:b.x+fx*2.9,z:b.z+fz*2.9};
    if(v<.45){T.x=lerp(T.x,pf.x,.12);T.z=lerp(T.z,pf.z,.12);faceTo(T,b.x,b.z);T.arm='perfil';T.sp=.25;b.yawOverride=Math.atan2(T.x-b.x,T.z-b.z);if(k<n-1||Z.b.sword===0)T.sword=true}
    else if(v<.62){const e=(v-.45)/.17;T.x=lerp(pf.x,b.x+fx*.4+px*.7,e);T.z=lerp(pf.z,b.z+fz*.4+pz*.7,e);T.sp=1.3;T.arm='perfil';b.toss=e>.7?.4:0;b.head=.95}
    else if(v<.7){T.arm=null;if(k<n-1){T.sword=false;Z.b.sword=.2;if(!Z['pz'+k]){Z['pz'+k]=1;whistles(.2);banner('Pinchazo','',1.6)}}else{T.sword=false;Z.b.sword=t.esto==='media'?.5:1;if(!Z.ent){Z.ent=1;oleP(t.esto==='media'?'¡Bien!':'¡Olé!',t.esto!=='media');applause(2.5,.35)}}}
    else{if(k<n-1)Z.b.sword=0;T.x+=px*.03;T.z+=pz*.03;T.sp=.6;faceTo(T,b.x,b.z)}
    if(av&&k===n-1&&v>.2&&!Z.av1){Z.av1=1;clarin();banner('Primer aviso','',2)}}
   else if(tt<per*n+dsc*2.4){const k=Math.floor((tt-per*n)/2.4),v=(tt-per*n)/2.4-k;T.sword=true;const pf={x:b.x+fx*1.3+px*.4,z:b.z+fz*1.3+pz*.4};T.x=lerp(T.x,pf.x,.1);T.z=lerp(T.z,pf.z,.1);faceTo(T,b.x,b.z);T.arm=v>.55&&v<.7?'perfil':null;b.head=1.05;
    if(v>.6&&!Z['ds'+k]){Z['ds'+k]=1;if(k===dsc-1)T.sword=false}if(av>1&&k===dsc-1&&!Z.av2){Z.av2=1;clarin();banner('Segundo aviso','',2)}}
   else{T.sword=false;T.arm=null;faceTo(T,b.x,b.z)}}}}
function actDobla(t){return {d:4.6,shots:['low'],cap:'El toro se amorcilla, aguanta en pie... y dobla.',
 init(Z){const T=TS(Z);T.sword=false;Z.pe.forEach(p=>p.vis=true)},
 f(Z,u){const b=Z.b,T=TS(Z);b.head=.85-u*.5;
  Z.pe.forEach((p,i)=>{const a=b.yaw+(i?.9:-.9);p.x=lerp(p.x,b.x+Math.sin(a)*3,.05);p.z=lerp(p.z,b.z+Math.cos(a)*3,.05);p.sw=Math.sin(u*30+i)*.4;p.sp=.3});
  if(u<.45){b.sp=.12;b.x+=Math.sin(performance.now()/300)*.004}
  else if(u<.7){b.kneel=(u-.45)/.25}
  else{b.kneel=1-(u-.7)/.3;b.fall=ease(Math.min(1,(u-.7)/.25));if(!Z.dob){Z.dob=1;applause(2.4,.3)}}
  T.cape='muleta';T.sweep=0;faceTo(T,b.x,b.z);if(u>.8)T.arm='up'}}}
function actPeticion(t,who,mat){const fr=t.trof>=2?.72:t.trof===1?.48:(t.score||0)>74?.22:0;const verdict=t.trof===2?['Dos orejas',`para ${mat}`]:t.trof===1?['Una oreja',`para ${mat}`]:(t.score||0)>74?['Saludos desde el tercio',`${mat}, tras una petición minoritaria`]:(t.score||0)>62?['Silencio',`para ${mat}`]:['Pitos',`para ${mat}`];
 return {d:5,shots:['palco','wide'],cap:t.trof>0?'El público pide la oreja con los pañuelos. La presidencia la concede.':verdict[0]==='Saludos desde el tercio'?'Hay petición, pero no mayoritaria. El matador sale a saludar al tercio.':verdict[0]==='Pitos'?'Bronca y pitos para el matador.':'Silencio en los tendidos.',
  init(Z){if(verdict[0]==='Pitos')whistles(1);else if(fr>0)applause(4,.45)},
  f(Z,u){const T=TS(Z);setPanu(u>.08?fr:0);if(u>.55)Z.palco=t.trof>0?'#ffffff':null;if(u>.5&&!Z.verd){Z.verd=1;banner(verdict[0],verdict[1],3.5)}
   if(verdict[0]==='Saludos desde el tercio'&&u>.4){const a=Math.atan2(T.x,T.z);const tgt={x:Math.sin(a)*(PR-7),z:Math.cos(a)*(PR-7)};T.x=lerp(T.x,tgt.x,.04);T.z=lerp(T.z,tgt.z,.04);T.sp=.5;T.arm='up';T.yaw=a+Math.PI;T.cape=null}
   if(fr>0)Z.cam={p:[0,2.4,-PR+14],l:[0,8,PR]}}}}
function actArrastre(t){const vu=t.res==='vuelta';let p0;const D=vu?16:10;
 return {d:D,shots:['wide','low'],cap:{vuelta:'¡Pañuelo azul! La presidencia concede la vuelta al ruedo al toro: las mulillas lo pasean por el anillo entre una ovación.',ovacion:'Ovación cerrada al toro en el arrastre.',silencio:'Silencio en el arrastre.',pitos:'Pitos para el toro en el arrastre.'}[t.res]||'Arrastre.',
  init(Z){p0={x:Z.b.x,z:Z.b.z};Z.team.vis=true;Z.team.x=DOOR.x;Z.team.z=DOOR.z;const T=TS(Z);T.vis=false;Z.s2.vis=false;Z.pe.forEach(p=>p.vis=false);if(vu){Z.palco='#3a78ff';applause(D,.5)}else if(t.res==='ovacion')applause(5,.4);else if(t.res==='pitos')whistles(1);setPanu(vu?.5:0)},
  f(Z,u){const tm=Z.team,tt=u*D,b=Z.b;
   const ap={x:p0.x+Math.sin(b.yaw)*3.6,z:p0.z+Math.cos(b.yaw)*3.6};
   if(tt<3.6){const v=ease(tt/3.6);const nx=lerp(DOOR.x,ap.x,v),nz=lerp(DOOR.z,ap.z,v);tm.yaw=Math.atan2(nx-tm.x,nz-tm.z)||tm.yaw;tm.x=nx;tm.z=nz;tm.sp=.8}
   else if(tt<4.6){tm.sp=0;tm.yaw+=angD(tm.yaw,Math.atan2(ap.x-p0.x,ap.z-p0.z))*.1}
   else{b.drag=true;const dd=tt-4.6;let nx,nz;
    if(vu&&dd<D-4.6-3){const a0=Math.atan2(ap.x,ap.z),a=a0+dd/(D-7.6)*Math.PI*2;nx=Math.sin(a)*(PR-5);nz=Math.cos(a)*(PR-5);if(Math.random()<.08)throwFlower(nx,nz)}
    else{const rem=vu?(dd-(D-7.6))/3:dd/(D-4.6);const st=Z.dst||(Z.dst={x:tm.x,z:tm.z});const v=ease(clamp(rem,0,1));nx=lerp(st.x,DOOR.x*1.08,v);nz=lerp(st.z,DOOR.z*1.08,v)}
    if(Math.hypot(nx-tm.x,nz-tm.z)>.001)tm.yaw+=angD(tm.yaw,Math.atan2(nx-tm.x,nz-tm.z))*.25;tm.x=nx;tm.z=nz;tm.sp=1;if(Math.random()<.2)dust(W3.P.D,b.x,0,b.z,.4)}
   if(u>.97){tm.vis=false;b.vis=false;b.drag=false}}}}
function actVuelta(who,mat,trof){return {d:11,shots:['wide','low'],cap:`${mat} da la vuelta al ruedo con ${trof>=2?'las dos orejas':'la oreja'} en la mano. Llueven flores y sombreros desde los tendidos.`,
 init(Z){const T=Z[who];T.vis=true;T.cape=null;T.pose='stand';T.y=0;T.rx=0;T.sword=false;Z.act=who;Z.salOK=true;applause(11,.5);setPanu(.35)},
 f(Z,u){const T=Z[who];const a=-u*Math.PI*2+.2;T.x=Math.sin(a)*(PR-3);T.z=Math.cos(a)*(PR-3);T.yaw=a-Math.PI/2;T.sp=.75;T.arm='up';if(Math.random()<.18)throwFlower(T.x,T.z)}}}
function actIndulto(t,who){return {d:7,shots:['palco','low','wide'],cap:'¡La plaza entera pide el indulto con pañuelos! La presidencia saca el pañuelo naranja. El matador simula la suerte con la mano: el toro vuelve vivo al campo como semental.',
 init(Z){musicStart();applause(7,.6)},
 f(Z,u){setPanu(.85);if(u>.3)Z.palco='#ef8a2b';if(u>.32&&!Z.indB){Z.indB=1;banner('¡Indulto!',t.name,4)}const b=Z.b;b.head=.3;b.look=Math.sin(u*4)*.4;const T=Z[who];T.cape='muleta';T.sweep=Math.sin(u*10)*.6;faceTo(T,b.x,b.z);if(u>.6&&u<.8){T.x=lerp(T.x,b.x+Math.sin(b.yaw)*1.4,.05);T.z=lerp(T.z,b.z+Math.cos(b.yaw)*1.4,.05);T.arm='perfil'}else if(u>=.8)T.arm='up';
  Z.cam=u<.3?{p:[0,2.4,-PR+14],l:[0,8,PR]}:null}}}
function actCabestros(kind){let p0;return {d:8,shots:['wide'],cap:kind==='indulto'?'Salen los cabestros para devolver al toro a los corrales.':'Pañuelo verde: devuelto. Los cabestros se lo llevan a los corrales.',
 init(Z){p0={x:Z.b.x,z:Z.b.z};Z.cab.vis=true;Z.cab.x=0;Z.cab.z=-PR+1;Z.toril=1;if(kind==='devuelto'){Z.palco='#2f8f4f';whistles(.6)}musicStop()},
 f(Z,u){const b=Z.b,c=Z.cab;Z.toril=1;if(u<.45){const v=ease(u/.45);c.x=lerp(0,p0.x,v);c.z=lerp(-PR+1,p0.z-2,v);c.sp=1;c.yaw=Math.atan2(p0.x,p0.z-2+PR-1);b.head=.2;b.yawOverride=Math.atan2(c.x-b.x,c.z-b.z)}
  else{const v=ease((u-.45)/.55);c.x=lerp(p0.x,0,v);c.z=lerp(p0.z-2,-PR+.5,v);c.sp=.9;c.yaw=Math.atan2(-p0.x,-PR+.5-p0.z+2);b.x=lerp(p0.x,0,Math.max(0,v-.08));b.z=lerp(p0.z,-PR+.5,Math.max(0,v-.08));b.sp=.8;b.head=.2;if(u>.97){b.vis=false;c.vis=false}}}}}
function plazaTick(dt){
 const C=CP;if(!C)return;const P=W3.P;dt*=C.spd;const now=performance.now()/1000;
 if(!C.done&&C.g){C.at+=dt;let a=C.g[C.ai];if(C.at>=a.d){C.ai++;C.at=0;if(C.ai>=C.g.length){cpNext();return}a=C.g[C.ai];if(a.init)a.init(C.s);if(a.cap)$('#h3cap').textContent=a.cap}}
 if(C.done||!C.bull){camPlaza(dt);return}
 const Z=C.s,a=C.g[C.ai],u=clamp(C.at/a.d,0,1);
 const b=Z.b;const ox=b.x,oz=b.z;b.sp=0;b.toss=Math.max(0,(b.toss||0)-dt*3);b.kneel=0;b.push=false;b.look=0;b.yawOverride=null;
 for(const T of [Z.t,Z.s2]){T.sp=0;if(T.arm!=='up'&&T.arm!=='perfil')T.arm=null}
 Z.pe.forEach(p=>p.sp=0);Z.ban.sp=0;Z.cab.sp=0;Z.team.sp=0;
 a.f(Z,u,dt);
 if(b.drag&&Z.team.vis){const fx=Math.sin(Z.team.yaw),fz=Math.cos(Z.team.yaw);b.x=Z.team.x-fx*3.2;b.z=Z.team.z-fz*3.2;b.yaw=Z.team.yaw+Math.PI;b.fall=1;b.sword=0}
 else{const mv=Math.hypot(b.x-ox,b.z-oz);
  if(b.yawOverride!=null)b.yaw+=angD(b.yaw,b.yawOverride)*Math.min(1,dt*12);else if(mv>.004&&!b.fall)b.yaw+=angD(b.yaw,Math.atan2(b.x-ox,b.z-oz))*Math.min(1,dt*10);
  const rb=Math.hypot(b.x,b.z);if(rb>PR-1){b.x*=(PR-1)/rb;b.z*=(PR-1)/rb}}
 const BM=C.bull;BM.root.visible=b.vis;BM.root.position.set(b.x,.3*b.fall,b.z);BM.root.rotation.set(0,b.yaw,-b.fall*1.45);
 animBull(BM,dt,{speed:b.fall?0:b.sp,head:b.head,kneel:b.kneel,toss:b.toss,push:b.push,look:b.look,fall:b.fall});setBand(BM,b.band);
 if(b.sp>1.1&&Math.random()<dt*8)dust(P.D,b.x,0,b.z,.35);
 // estoque
 const sw=C.sword,TT2=TS(Z),M2a=Z.act==='s2'?C.sus:C.tor;
 if(b.sword>0&&b.vis){if(sw.parent!==BM.b)BM.b.add(sw);const cz=BM.cruz,vis=b.sword>=1?.22:b.sword>=.5?.42:.6;sw.position.set(.05,cz.y+.81*vis,cz.z+.59*vis);sw.rotation.set(2.2,0,.15);sw.visible=true}
 else if(TT2.sword&&TT2.vis&&M2a){const hand=M2a.arms[1].hand;if(sw.parent!==hand)hand.add(sw);sw.position.set(0,-.04,0);sw.rotation.set(TT2.arm==='perfil'?1.4:.4,0,0);sw.visible=true}
 else sw.visible=false;
 for(const [k,M2] of [['t',C.tor],['s2',C.sus]]){if(!M2)continue;const T=Z[k];M2.root.visible=!!T.vis;if(!T.vis)continue;
  M2.root.position.set(T.x,T.y||0,T.z);M2.root.rotation.set(T.rx||0,T.yaw+(T.spin||0),0);
  M2.mul.visible=T.cape==='muleta';M2.cap.visible=T.cape==='capote';
  const mh=T.sword&&T.cape==='muleta'?0:(T.hand||0);const hand=M2.arms[mh].hand;if(M2.mul.parent!==hand)hand.add(M2.mul);
  M2.arms.forEach(ar=>{ar.lock=0});
  if(T.cape==='muleta'){const ar=M2.arms[mh];ar.lock=1;ar.sh.rotation.set(T.arm==='perfil'&&mh===0?-.4:-.85,0,(mh?-1:1)*.3);ar.el.rotation.x=-.3;M2.mul.rotation.set(0,(mh?.4:-.4)+(T.sweep||0)*(mh?-1:1)*1.1,0)}
  if(T.cape==='capote'){M2.cap.rotation.set(T.capeUp?-1.2:0,-(T.sweep||0)*.9,0);M2.cap.position.y=T.capeUp?1.7:1.05;M2.arms.forEach(ar=>{ar.lock=1;ar.sh.rotation.set(T.capeUp?-2.6:-1.1,0,0)})}
  if(T.arm==='up'){const ar=M2.arms[1];ar.lock=1;ar.sh.rotation.set(-2.9,0,0)}
  if(T.arm==='perfil'){const ar=M2.arms[1];ar.lock=1;ar.sh.rotation.set(-1.4,0,0);ar.el.rotation.x=0}
  const amp=Math.min(1,Math.abs((T.sweep||0)-(T.lsw||0))/Math.max(dt,.001)*.15);T.lsw=T.sweep;
  if(M2.mul.visible)clothTick(M2.mul.userData.cl,now,amp);if(M2.cap.visible)clothTick(M2.cap.userData.cl,now*1.1,amp);
  animPerson(M2,dt,T.sp,T.pose)}
 C.ban.root.visible=Z.ban.vis;if(Z.ban.vis){C.ban.root.position.set(Z.ban.x,Z.ban.y||0,Z.ban.z);C.ban.root.rotation.y=Z.ban.yaw;animPerson(C.ban,dt,Z.ban.sp||0)}
 C.pe.forEach((p,i)=>{const s=Z.pe[i];p.root.visible=s.vis;p.root.position.set(s.x,0,s.z);p.root.rotation.y=s.yaw!=null?s.yaw:Math.atan2(b.x-s.x,b.z-s.z);p.cap.rotation.y=(s.sw||0)*.9;p.arms.forEach(ar=>{ar.lock=1;ar.sh.rotation.set(-1.1,0,0)});clothTick(p.cap.userData.cl,now+i,Math.abs(s.sw||0));animPerson(p,dt,s.sp||0);s.yaw=null});
 C.hor.root.visible=Z.hor.vis;if(Z.hor.vis){C.hor.root.position.set(Z.hor.x,0,Z.hor.z);C.hor.root.rotation.y=Z.hor.yaw;C.hor.body.rotation.z=(Z.hor.fall||0)*1.35;C.hor.body.position.y=-(Z.hor.fall||0)*.45;animHorse(C.hor,dt,0)}
 C.cab.forEach((c,i)=>{c.root.visible=Z.cab.vis;if(Z.cab.vis){c.root.position.set(Z.cab.x+(i?1.6:-1.6),0,Z.cab.z+(i?.8:0));c.root.rotation.y=Z.cab.yaw||0;animBull(c,dt,{speed:Z.cab.sp,head:.25})}});
 if(C.ai>0||!C.pas||C.i>0){const tm=C.team;tm.root.visible=Z.team.vis;if(Z.team.vis){tm.root.position.set(Z.team.x,0,Z.team.z);tm.root.rotation.y=Z.team.yaw;tm.mules.forEach(m=>animHorse(m,dt,Z.team.sp));tm.men.forEach(p=>animPerson(p,dt,Z.team.sp*.9))}}
 P.toril.a+=((Z.toril||0)-P.toril.a)*Math.min(1,dt*4);P.toril.l.rotation.y=-P.toril.a*1.6;P.toril.r.rotation.y=P.toril.a*1.6;
 const me=C.me;me.root.visible=C.view==='callejon'||C.saludo;
 if(C.saludo){C.salT+=dt;const v=Math.min(1,C.salT/2.5);const a0=2.5;me.root.position.set(Math.sin(a0)*lerp(PR+1,PR-3.5,v),0,Math.cos(a0)*lerp(PR+1,PR-3.5,v));me.root.rotation.y=a0+Math.PI;me.arms[1].lock=v>=1?1:0;if(v>=1)me.arms[1].sh.rotation.set(-2.8,0,0);animPerson(me,dt,v<1?.8:0);if(C.salT>6){C.saludo=false;C.salDone=true;me.arms[1].lock=0}}
 else{me.root.position.set(Math.sin(2.5)*(PR+1),0,Math.cos(2.5)*(PR+1));me.root.rotation.y=2.5+Math.PI;animPerson(me,dt,0)}
 if(Z.salOK&&!C.salDone&&!C.saludo)$('#psal').hidden=false;
 P.pp.visible=!!Z.palco;if(Z.palco){P.pp.material.color.set(Z.palco);P.pp.rotation.z=Math.sin(performance.now()/180)*.15}
 C.exc=Math.max(0,(C.exc||0)-dt*.35);crowdLevel(.03+C.exc*.16);crowdAnim(P,C.exc,now);flowersTick(dt);
 dustTick(P.D,dt);camPlaza(dt)}
function camPlaza(dt){const C=CP,cam=W3.cam;if(!C)return;const Z=C.s||freshState();const b=Z.b,T=TS(Z);const a=C.g&&C.g[C.ai];
 const tv=T.vis?T:b,mx=(b.x+tv.x)/2,mz=(b.z+tv.z)/2;let p,l,k=Math.min(1,dt*3);
 if(C.view==='tv'){C.shotT=(C.shotT||0)+dt;const sh=(a&&a.shots)||['low','wide'];
  if(C.lastA!==C.ai){C.lastA=C.ai;C.shotI=0;C.shotT=0;C.cut=true}else if(C.shotT>6&&sh.length>1){C.shotT=0;C.shotI=(C.shotI+1)%sh.length;C.cut=true}
  let s=sh[C.shotI%sh.length];if(s==='hint'||s==='side'){if(Z.cam){p=Z.cam.p;l=Z.cam.l}else s='wide'}
  if(s==='palco'){if(Z.cam){p=Z.cam.p;l=Z.cam.l}else{p=[3,2.4,PR-14];l=[0,8.5,PR+9]}}
  if(s==='wide'){C.wa=C.wa??Math.atan2(mx,mz)+.8;C.wa+=angD(C.wa,Math.atan2(mx,mz)+.8)*Math.min(1,dt*.5);p=[Math.sin(C.wa)*(PR+8),9,Math.cos(C.wa)*(PR+8)];l=[mx*.8,1,mz*.8]}
  if(s==='low'){const dx=b.x-tv.x,dz=b.z-tv.z,d=Math.hypot(dx,dz)||1,qx=-dz/d,qz=dx/d;const c1=[mx+qx*7,mz+qz*7],c2=[mx-qx*7,mz-qz*7];C.ls=C.ls||(Math.hypot(...c1)<Math.hypot(...c2)?1:-1);if(C.cut)C.ls=Math.hypot(...c1)<Math.hypot(...c2)?1:-1;const c=C.ls>0?c1:c2;let r=Math.hypot(c[0],c[1]);if(r>PR-1){c[0]*=(PR-1)/r;c[1]*=(PR-1)/r}p=[c[0],1.35,c[1]];l=[mx,1.05,mz]}
  if(s==='rev'){const dx=tv.x-b.x,dz=tv.z-b.z,d=Math.hypot(dx,dz)||1;p=[tv.x+dx/d*4.2-dz/d*1.2,1.9,tv.z+dz/d*4.2+dx/d*1.2];l=[b.x,1,b.z];const r=Math.hypot(p[0],p[2]);if(r>PR-1){p[0]*=(PR-1)/r;p[2]*=(PR-1)/r}}
  if(s==='toro'){const by=b.yaw;p=[b.x-Math.sin(by)*6+Math.cos(by)*3,2.4,b.z-Math.cos(by)*6-Math.sin(by)*3];l=[b.x,1.1,b.z];const r=Math.hypot(p[0],p[2]);if(r>PR-1){p[0]*=(PR-1)/r;p[2]*=(PR-1)/r}}
  if(s==='toril'){p=[5,2.3,-PR+8];l=[b.x*.5,1.1,lerp(-PR+1,b.z,.5)]}
  if(!p){p=[Math.sin(.8)*(PR+8),9,Math.cos(.8)*(PR+8)];l=[mx,1,mz]}}
 else if(C.view==='tendido'){const d=36*(W3.zoom||1);p=[Math.sin(W3.yaw)*d,10+W3.pitch*14,Math.cos(W3.yaw)*d];l=[mx*.5,1,mz*.5]}
 else if(C.view==='callejon'){const a2=2.6;p=[Math.sin(a2)*(PR+1.7),1.75,Math.cos(a2)*(PR+1.7)];l=[mx,1,mz]}
 else{const by=b.yaw;p=[b.x-Math.sin(by)*6+Math.cos(by)*3,2.4,b.z-Math.cos(by)*6-Math.sin(by)*3];l=[b.x,1.1,b.z];const r=Math.hypot(p[0],p[2]);if(r>PR-1){p[0]*=(PR-1)/r;p[2]*=(PR-1)/r}k=Math.min(1,dt*5)}
 if(C.cut){cam.position.set(p[0],p[1],p[2]);W3.look.set(l[0],l[1],l[2]);C.cut=false}
 else{cam.position.x+=(p[0]-cam.position.x)*k;cam.position.y+=(p[1]-cam.position.y)*k;cam.position.z+=(p[2]-cam.position.z)*k;W3.look.x+=(l[0]-W3.look.x)*k;W3.look.y+=(l[1]-W3.look.y)*k;W3.look.z+=(l[2]-W3.look.z)*k}
 cam.lookAt(W3.look)}
