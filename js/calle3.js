/* ===================== VER TU HIERRO EN DIRECTO: retransmisión limpia, automática y cogidas realistas ===================== */
/* el ganadero mira: no participa. Las reses salen y se recogen solas, como en la plaza. */
const CLDUR={vaca:50,toro:60,becerro:40,embolado:65};
const _irCalle3=irCalle;
irCalle=function(id){_irCalle3(id);if(!CL)return;CL.spd=1;CL.her=[];CL.spect=true;W3.root.classList.add('clspect');
 const h=$('#h3calle');if(h&&!h.__v3){h.__v3=1;const B=h.querySelector('.clB');B.innerHTML=`<button class="btn sm" id="clcam">Cámara: TV</button><button class="btn sm" id="clspd">×1</button>`;
  $('#clcam').onclick=()=>{const v=['tv','cad','res'],n={tv:'TV',cad:'cadafal',res:'la res'};CL.cam=v[(v.indexOf(CL.cam)+1)%3];$('#clcam').textContent='Cámara: '+n[CL.cam]};
  $('#clspd').onclick=()=>{CL.spd=CL.spd===1?2:CL.spd===2?4:1;$('#clspd').textContent='×'+CL.spd}}
 $('#clcam').textContent='Cámara: TV';$('#clspd').textContent='×1';CL.cam='tv';durRes()};
clSpect=function(){if(!CL)return;CL.spect=true;W3.root.classList.add('clspect');const r=CL.env.nearRef(CL.me.x,CL.me.z);CL.me.x=r.x;CL.me.z=r.z;CL.cam=CL.cam==='jug'?'tv':CL.cam};
function durRes(){const r=CL&&CL.res;if(!r||r.durSet)return;r.durSet=1;const t=cTipo(r.a);r.dur=CL.o.tipo==='embolado'?CLDUR.embolado:CLDUR[t]||50;CL.lowT=CL.t}
const _calleNext3=calleNext;calleNext=function(){_calleNext3.apply(this,arguments);if(CL&&CL.res)durRes()};
/* la recogida nunca se atasca */
const _resTick3=resTick;resTick=function(r,dt){_resTick3(r,dt);if(CL&&CL.res===r&&r.mode==='recogida'&&r.t>14){calleNext()}};
/* velocidad de la retransmisión y heridos */
const _calleTick3=calleTick;
calleTick=function(dt){if(!CL)return;const k=CL.spd||1;for(let i=0;i<k;i++){_calleTick3(dt);if(!CL||CL.done)break;heridosTick(dt)}
 if(!CL)return;const low=$('#tvLow');if(low)low.classList.toggle('off',CL.t-(CL.lowT||0)>8);
 const r=CL.res,n=$('#tvN');if(n&&r&&r.dur&&CL.t%0.5<dt*k){const tot=CL.an.map(cById).filter(x=>x&&x.tipo!=='cabestro').length,s=Math.max(0,Math.ceil(r.dur-r.tt));n.textContent=`RES ${Math.min(tot,CL.i+1)}/${tot} · ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}};
/* ---------- recortadores: más oficio, menos cogidas ---------- */
const _npcTick3=npcTick;
npcTick=function(p,dt){if(p.herido)return;const r=CL.res;
 if(r&&r.mode==='embiste'&&r.tgt===p&&p.dodge<=0){const d=Math.hypot(r.x-p.x,r.z-p.z);
  if(d<3.6&&!p.tryT){p.tryT=1;const sen=r.a.g.sen,ok=Math.random()<clamp(p.sk+.3-(sen-50)/300-(d<1.3?.15:0),.62,.98);
   if(ok){const fx=Math.sin(r.yaw),fz=Math.cos(r.yaw),side=((p.x-r.x)*fz-(p.z-r.z)*fx)>=0?1:-1;p.dodge=.5;p.dx=fz*side*2.6;p.dz=-fx*side*2.6;r.mode='pasa';r.t=0;r.st.qui++;CL.ev.quieb++;clCrowd(.6);if(Math.random()<.35)ole(pick(['¡Olé!','¡Bien!','¡Toma!','¡Qué recorte!']))}
   else if(Math.random()<.8){const fx=Math.sin(r.yaw),fz=Math.cos(r.yaw),side=((p.x-r.x)*fz-(p.z-r.z)*fx)>=0?1:-1;p.dodge=.45;p.dx=fz*side*3.2;p.dz=-fx*side*3.2;r.mode='pasa';r.t=0;clCrowd(.9);ole('¡Por los pelos!')}
   else clToss(p);return}
  if(d<3.6){p.vx*=.8;p.vz*=.8;return}}
 if(!(r&&r.mode==='embiste'&&r.tgt===p))p.tryT=0;
 if(CL.plaza&&r&&r.mode==='mira'&&p.st!=='huye'){const d=Math.hypot(r.x-p.x,r.z-p.z),fw=((p.x-r.x)*Math.sin(r.yaw)+(p.z-r.z)*Math.cos(r.yaw))/(d||1);
  if(d<2.4&&d>1.1&&fw>.75&&(r.ring||0)<14&&Math.random()<dt*1.4*p.sk){if(Math.random()<clamp(p.sk-(r.a.g.sen-50)/200,.3,.9)){p.anillas=(p.anillas||0)+1;r.ring=(r.ring||0)+1;anillaEn(r);CL.ev.anil++;ole('¡Anilla!');clCrowd(.8)}r.mode='embiste';r.tgt=p;r.t=0;r.v=2.5;r.st.emb++;return}
  if(d>5&&d<12&&Math.random()<dt*.6&&p.st!=='cita'){p.st='cita';p.t=3}}
 _npcTick3(p,dt);
 // en la plaza se acercan de frente para la anilla
 if(CL.plaza&&r&&r.mode==='mira'&&p.st==='cita'){const fx=Math.sin(r.yaw),fz=Math.cos(r.yaw),tx=r.x+fx*1.9,tz=r.z+fz*1.9,ex=tx-p.x,ez=tz-p.z,el=Math.hypot(ex,ez);if(el>.3){p.vx=ex/el*2.4;p.vz=ez/el*2.4}}};
/* ---------- cogidas realistas: revolcón, menos grave o grave ---------- */
const HER_TXT={leve:'Revolcón sin consecuencias: se levanta por su pie y vuelve al cadafal entre aplausos.',mg:'Cogida: sale conmocionado y cojeando, ayudado por sus compañeros, camino de la enfermería.',grave:'Cogida grave: herida por asta en el muslo. Los compañeros hacen el quite y los servicios sanitarios lo evacuan en camilla a la enfermería.'};
clToss=function(p){if(p.toss>0||p.herido)return;const r=CL.res;if(!r)return;const a=r.a,male=a.sex==='M'&&cTipo(a)!=='becerro';
 const pg=(male?.17:.05)+(a.g.sen>75?.06:0)+(CL.o.tipo==='embolado'?.04:0),sev=Math.random()<pg?'grave':Math.random()<.3?'mg':'leve';
 const dx=p.x-r.x,dz=p.z-r.z,d=Math.hypot(dx,dz)||1;p.toss=male?2.6:2.2;p.tv={x:dx/d*(male?3.6:3),z:dz/d*(male?3.6:3)};p.sev=sev;CL.ev.cog++;if(sev==='grave')CL.ev.grave=(CL.ev.grave||0)+1;
 try{bufido(.8)}catch(e){}clCrowd(1);try{shake(sev==='grave'?.55:.3);flash(sev==='grave'?'rgba(150,10,20,.5)':'rgba(150,10,20,.25)',.5)}catch(e){}slowmo&&slowmo(.45,.5);
 $('#h3cap').textContent=`¡Cogida! ${a.name} prende a ${p.name}.`;r.mode='pasa';r.t=0;r.st.emb++;r.hook=sev!=='leve'?p:null;p.after=sev};
function heridosTick(dt){if(!CL)return;const r=CL.res;
 for(const p of CL.ppl.slice()){if(!p.after||p.toss>0)continue;const sev=p.after;p.after=null;
  if(sev==='leve'){$('#h3cap').textContent=`${p.name}: ${HER_TXT.leve}`;continue}
  p.herido={sev,ph:'tendido',t:0};p.vx=p.vz=0;CL.ppl=CL.ppl.filter(q=>q!==p);CL.her.push(p);$('#h3cap').textContent=`${p.name}: ${HER_TXT[sev]}`;
  if(r){r.tgt=null;const q=CL.ppl.filter(x=>!x.me&&!x.herido).sort((a,b)=>Math.hypot(a.x-r.x,a.z-r.z)-Math.hypot(b.x-r.x,b.z-r.z)).slice(0,2);q.forEach(x=>{x.st='cita';x.t=5;x.cite=3})}
  try{crowdLevel(.02)}catch(e){}}
 for(const p of CL.her.slice()){const H=p.herido,m=p.m;H.t+=dt;
  if(H.ph==='tendido'){m.root.position.set(p.x,.12,p.z);m.root.rotation.x=-Math.PI/2;
   if(r&&r.hook===p&&H.t<1.6&&Math.hypot(r.x-p.x,r.z-p.z)<2.2){r.v=0;const fy=Math.atan2(p.x-r.x,p.z-r.z);r.yaw+=angD(r.yaw,fy)*Math.min(1,dt*6);if(Math.sin(H.t*7)>.6)r.b.hp.rotation.x=.9}
   if(H.t>(H.sev==='grave'?3.2:2.2)){if(H.sev==='mg'){H.ph='ayuda';H.t=0;m.root.rotation.x=0}else{H.ph='camilla';H.t=0;camilla(p)}}}
  else if(H.ph==='ayuda'){const rf=CL.env.nearRef(p.x,p.z);const ex=rf.x-p.x,ez=rf.z-p.z,el=Math.hypot(ex,ez);if(el>.4){p.x+=ex/el*1.4*dt;p.z+=ez/el*1.4*dt;p.yaw=Math.atan2(ex,ez)}
   m.root.position.set(p.x,0,p.z);m.root.rotation.set(0,p.yaw,Math.sin(H.t*6)*.12);animPerson(m,dt,.4);if(el<=.4||H.t>14)retirar(p)}
  else if(H.ph==='camilla'){const C=H.cam;const go=C.st===0?{x:p.x,z:p.z}:C.dest;const ex=go.x-C.x,ez=go.z-C.z,el=Math.hypot(ex,ez);
   if(el>.5){C.x+=ex/el*(C.st?2.2:4.6)*dt;C.z+=ez/el*(C.st?2.2:4.6)*dt;C.yaw=Math.atan2(ex,ez)}else if(C.st===0){C.st=1}else{retirar(p);continue}
   C.g.position.set(C.x,0,C.z);C.g.rotation.y=C.yaw;C.men.forEach(mm=>animPerson(mm,dt,el>.5?.9:0));
   if(C.st===1){m.root.position.set(C.x,.95,C.z);m.root.rotation.set(-Math.PI/2,C.yaw,0)}else{m.root.position.set(p.x,.12,p.z);m.root.rotation.x=-Math.PI/2}}}}
function camilla(p){const rf=CL.env.nearRef(p.x,p.z);const g=new THREE.Group();CL.sc.add(g);CL.added&&CL.added.push(g);const G=geos();
 mesh(G.box,M('#f4f2ee',.7),.62,.08,2,0,.85,0,g);mesh(G.box,M('#c42a2a',.6),.64,.02,2.02,0,.9,0,g,true);
 const men=[-1.25,1.25].map(z=>{const m=makePerson({jacket:'#f07a1a',pants:'#1d3557',belt:'#e6e2d8',boots:'#202020'});m.root.position.set(0,0,z);g.add(m.root);m.arms[0].lock=m.arms[1].lock=1;m.arms[0].sh.rotation.set(-.4,0,.25);m.arms[1].sh.rotation.set(-.4,0,-.25);return m});
 p.herido.cam={g,men,x:rf.x,z:rf.z,yaw:0,st:0,dest:{x:rf.x,z:rf.z}};try{cencerro(.2)}catch(e){}}
function retirar(p){const H=p.herido;if(H&&H.cam)CL.sc.remove(H.cam.g);p.m.root.visible=false;CL.her=CL.her.filter(q=>q!==p);CL.ret=(CL.ret||0)+1;$('#h3cap').textContent=`${p.name} ya está en la enfermería. Sigue el festejo.`;try{applause(2,.25)}catch(e){}}
/* ---------- final: clasificación de anillas en el concurso y parte médico ---------- */
const _calleFin3=calleFin;
calleFin=function(){_calleFin3.apply(this,arguments);const box=$('#h3dim .stack');if(!box||!CL)return;
 if(CL.plaza){const L=CL.npc.map(p=>({n:p.name,a:p.anillas||0})).sort((a,b)=>b.a-a.a);const d=document.createElement('div');d.className='clFin';d.innerHTML=`<span class="lbl">Concurso de anillas</span>${L.map((x,i)=>`<div><span>${i+1}º <b>${esc(x.n)}</b></span><b>${x.a}</b></div>`).join('')}`;box.insertBefore(d,box.querySelector('button'))}
 const g=CL.ev.grave||0,c=CL.ev.cog||0;const sm=box.querySelector('small.muted');if(sm)sm.textContent=`Quiebros y recortes ${CL.ev.quieb} · cogidas ${c}${g?` (${g} grave${g>1?'s':''})`:''}${CL.plaza?` · anillas ${CL.ev.anil}`:''}`};
