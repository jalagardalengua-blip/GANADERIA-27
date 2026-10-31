/* ===================== FINCA: construcciones taurinas con las que interactuar y personal contratado ===================== */
Object.assign(MEJ,{
 capilla:{n:'Ermita de la Virgen',max:1,c:[65000],pos:[-26,50],d:['Ermita para encomendarse antes de cada corrida: una vela al mes da suerte a tu hierro en la plaza.']},
 bascula:{n:'Báscula ganadera',max:1,c:[38000],pos:[16,-12],d:['Báscula oficial: pesas la camada y las empresas pagan un 3 % más por toros con peso certificado.']},
 picadero:{n:'Picadero de caballos',max:2,c:[95000,170000],pos:[-34,-24],d:['Caballos de picar y de rejoneo: tientas un 30 % más baratas y doma (+1.500–2.500 €/mes).','Cuadra de rejoneo de élite: exhibiciones de rejoneo (+3.000 €/mes) y tientas a mitad de precio.']},
 coso:{n:'Coso taurino propio',max:2,c:[380000,650000],pos:[-13,-32],d:['Plaza de toros en tu finca: organiza un festival al mes con dos de tus toros y míralo en directo.','Coso cubierto con palcos: festivales con más público y prestigio.']},
 monumento:{n:'Monumento al toro bravo',max:1,c:[140000],pos:[-24,40],d:['Toro de bronce sobre pedestal de granito: la finca gana fama (+prestigio cada mes).']},
 mirador:{n:'Torre mirador',max:1,c:[55000],pos:[30,58],d:['Torre de piedra para ver toda la dehesa desde lo alto.']}});
const STAFF={
 vaquero:{n:'Vaqueros',max:3,f:22000,s:2600,d:'Echan de comer cada mes, reparan las cercas y recogen las reses escapadas.'},
 veter:{n:'Veterinario de plantilla',max:1,f:38000,s:4800,d:'Cura a los lesionados cada mes y hace el saneamiento y las vacunas.'},
 mayoral:{n:'Mayoral de campo',max:1,f:65000,s:5600,d:'Lleva el calendario: crotales, destete, heno, siembra, fundas, libro genealógico y herradero.'},
 conocedor:{n:'Conocedor',max:1,f:48000,s:3900,d:'Ojo de ganadero: las notas de tienta salen mucho más fiables.'},
 guarda:{n:'Guarda de campo',max:1,f:14000,s:1900,d:'Vigila las cercas: ya no se rompen ni se escapan reses.'},
 representante:{n:'Representante comercial',max:1,f:58000,s:4300,d:'Negocia con las empresas: +6 % en el precio de cada toro.'}};
const stf=k=>S&&S.staff?(+S.staff[k]||0):0;
const staffUnlock=()=>S&&(S.pres>=60||patrimonio()>=1200000||(S.stats&&S.stats.corridas>=8));
function staffSalarios(){let t=0;for(const k in STAFF)t+=stf(k)*STAFF[k].s;return t}
function contratar(k){const d=STAFF[k];if(!staffUnlock()){toast('Aún no: necesitas prestigio 60, 1,2 M de patrimonio u 8 corridas lidiadas');return}if(stf(k)>=d.max)return;if(S.money<d.f){toast('No te llega para el fichaje');return}
 S.money-=d.f;S.staff=S.staff||{};S.staff[k]=stf(k)+1;S.xp=(S.xp||0)+15;log(`Contratas: ${d.n}.`);save();render();try{confetti(50)}catch(e){}toast(`${d.n}: contratado · sueldo ${eur(d.s)}/mes`)}
function despedir(k){if(!stf(k))return;S.staff[k]--;save();render();toast(`${STAFF[k].n}: baja`)}
function staffHTML(){const ok=staffUnlock();return `<div class="obras">${Object.entries(STAFF).map(([k,d])=>{const n=stf(k);return `<div class="obra ${n?'hecha':''}"><div class="oh"><b>${d.n}</b><span class="lvd">${Array.from({length:d.max},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</span></div>
 <small>${esc(d.d)}<span class="muted">Fichaje ${eur(d.f)} · sueldo ${eur(d.s)}/mes</span></small><div class="ob row" style="gap:.4rem">${n<d.max?`<button class="btn sm oro" ${!ok||S.money<d.f?'disabled':''} onclick="contratar('${k}')">Contratar · ${eur(d.f)}</button>`:'<span class="badge ok">Plantilla completa</span>'}${n?`<button class="btn sm" onclick="despedir('${k}')">Despedir</button>`:''}</div></div>`}).join('')}</div>
 ${ok?`<small class="muted">Sueldos: ${eur(staffSalarios())} al mes.</small>`:'<div class="card muted">Se desbloquea al llegar a prestigio 60, 1,2 millones de patrimonio u 8 corridas lidiadas. Los fichajes son caros: piénsalo bien.</div>'}`}
/* efectos de mes: el personal trabaja antes de las cuentas */
const _finTareasF=finTareas;
finTareas=function(rep){const g=stf('guarda');_finTareasF(rep);if(!S)return;const sal=staffSalarios();if(sal){S.money-=sal;rep.cost+=sal;rep.lines.push(`Personal contratado: ${eur(sal)} en sueldos.`)}
 if(g&&S.roto){S.roto=null;rep.lines.push('El guarda arregla a tiempo una cerca que cedía.')}if(g)S.escapado=null;
 if(stf('vaquero')){S.fedM=Math.max(S.fedM||0,4);if(S.roto){S.roto=null;rep.lines.push('Los vaqueros reparan la cerca rota.')}if(S.escapado){S.escapado=null;rep.lines.push('Los vaqueros devuelven a su cercado la res escapada.')}}
 if(stf('veter')){let n=0;for(const a of campo())if(a.salud<70||a.lesion>0){a.salud=clamp(a.salud+14,5,100);a.lesion=Math.max(0,(a.lesion||0)-1);n++}if(n)rep.lines.push(`El veterinario atiende a ${n} ${n>1?'reses':'res'}.`);
  for(const id of ['saneo','vacuna'])if(typeof fActivas==='function'&&fActivas().some(f=>f.id===id)&&!fDone(id)){fMark(id);const f=FAENAS.find(x=>x.id===id);if(f.bonus&&f.bonus.salud)for(const a of campo())a.salud=clamp(a.salud+f.bonus.salud,5,100)}}
 if(stf('mayoral')){if(typeof fActivas==='function')for(const f of fActivas()){if(fDone(f.id))continue;fMark(f.id);if(f.flag)S['f_'+f.flag]=S.year}if(S.month>=7&&campo().some(a=>!a.herrado)){herradero(true);rep.lines.push('El mayoral hierra a los becerros.')}}
 const pl=mejLv('picadero');if(pl){const v=pl>=2?RI(4500,6500):RI(1500,2500);S.money+=v;rep.inc+=v;rep.lines.push(`Doma${pl>=2?' y exhibiciones de rejoneo':''} en el picadero: +${eur(v)}.`)}
 if(mej('monumento'))S.pres=clamp(S.pres+.15,0,100);if(mej('capilla'))S.pres=clamp(S.pres+.05,0,100)};
const _priceForF=priceFor;priceFor=function(c,t){return r100(_priceForF(c,t)*(mej('bascula')?1.03:1)*(stf('representante')?1.06:1))};
const _tCostF=tCost;tCost=function(sex){const l=mejLv('picadero');return Math.round(_tCostF(sex)*(l>=2?.5:l?.7:1))};
const _ttCalcF=ttCalc;ttCalc=function(a,T){_ttCalcF(a,T);if(stf('conocedor')&&a.rev&&a.g){a.rev.bra=Math.round(a.rev.bra*.35+a.g.bra*.65);a.rev.cas=Math.round(a.rev.cas*.35+a.g.cas*.65);a.nota=Math.round(.65*a.rev.bra+.35*a.rev.cas)}};
const _lidiarF=lidiar;lidiar=function(a,o,mat){const t=_lidiarF(a,o,mat);if(S.vela!=null&&absNow()-S.vela<=1&&t.res!=='devuelto'&&t.trof<2&&Math.random()<.12)t.trof++;return t};
/* tareas que ya hace el personal */
const _listaTareasF=listaTareas;listaTareas=function(){let T=_listaTareasF();const hide=[];if(stf('vaquero'))hide.push(/^Echar pienso|^Reparar la cerca|^Devolver a/);if(stf('veter'))hide.push(/^Curar/);if(stf('mayoral'))hide.push(/^Herrar/,/^Crotalar|^Destetar|^Recoger las pacas|^Sembrar|^Enfundar|^Declarar|^Pasar el ganado|^Vacunar|^Revisar charcas/);
 return T.filter(x=>!hide.some(r=>r.test(x.t)))};
/* pantalla de la finca: sección de personal */
const _renderFincaF=renderFinca;renderFinca=function(el){_renderFincaF(el);const d=document.createElement('section');d.className='sect';d.innerHTML=`<header><h2>Personal de la finca</h2><span class="sp"></span><small class="muted">delegar trabajos</small></header>${staffHTML()}`;const st=el.querySelector('.stack')||el;const last=st.lastElementChild;st.insertBefore(d,last)};
/* ---------- 3D: edificios nuevos, interacciones y personal trabajando ---------- */
const _rebuildF=rebuildFinca;
rebuildFinca=function(){_rebuildF.apply(this,arguments);if(W3.mode!=='finca'||!W3.scene)return;const sc=W3.scene,G=geos(),col=W3.col,acts=W3.acts;W3.extra=[];
 const at=(k)=>{const [x,z]=MEJ[k].pos;const g=new THREE.Group();g.position.set(x,gH(x,z),z);sc.add(g);return [g,x,z]};
 if(mej('capilla')){const [g,x,z]=at('capilla');const wall=M('#f4f0e6',.9);mesh(G.box,wall,5,4,7,0,2,0,g);for(const s of [1,-1]){const r=mesh(G.box,M('#a4532f',.85),3.1,.18,7.4,s*1.3,4.55,0,g);r.rotation.z=-s*.62}
  mesh(G.box,wall,2.2,2.6,.5,0,5.1,3.3,g);mesh(G.box,M('#1d1a16'),.7,.9,.52,0,5.2,3.32,g,true);mesh(G.sph,M('#c9a24a',.3,.8),.25,.3,.25,0,5.1,3.36,g,true);mesh(G.box,M('#c9a24a',.3,.8),.08,.7,.08,0,6.75,3.3,g,true);mesh(G.box,M('#c9a24a',.3,.8),.4,.08,.08,0,6.85,3.3,g,true);
  mesh(G.box,M('#4a2c1a'),1.4,2.4,.1,0,1.2,3.52,g,true);const fl=mesh(G.sph,new THREE.MeshBasicMaterial({color:'#ffc35a'}),.06,.1,.06,.9,1.1,3.6,g,true);W3.extra.push({fl});col.push({t:'box',x0:x-2.6,x1:x+2.6,z0:z-3.6,z1:z+3.4});
  acts.push({x,z:z+4.4,r:2.6,l:()=>S.vela===absNow()?'Ya ardió tu vela este mes':'Encender una vela a la Virgen',hold:true,dur:2,cond:()=>!W3.ride,fn:()=>{if(S.vela===absNow())return;S.vela=absNow();save();toast('Una vela por tu hierro: que la Virgen guíe a tus toros en la plaza');try{applause(1.5,.12)}catch(e){}}})}
 if(mej('bascula')){const [g,x,z]=at('bascula');mesh(G.box,M('#8d8a83',.8),3.4,.3,6,0,.15,0,g);const st=M('#4b5258',.4,.7);for(const sx of [-1.6,1.6])for(let i=0;i<5;i++)mesh(G.cyl,st,.05,1.8,.05,sx,1.2,-2.6+i*1.3,g,true);for(const sx of [-1.6,1.6])for(const y of [.8,1.5,2.1])mesh(G.box,st,.06,.06,6,sx,y,0,g,true);
  mesh(G.box,M('#e6e2d8',.6),.9,.7,.25,2.3,1.4,-2.6,g);const scr=mesh(G.box,new THREE.MeshBasicMaterial({color:'#7cff9a'}),.6,.22,.02,2.3,1.5,-2.47,g,true);col.push({t:'box',x0:x-1.8,x1:x+1.8,z0:z-3.1,z1:z+3.1});
  acts.push({x:x+2.6,z:z-2,r:2.6,l:'Pesar la camada',cond:()=>!W3.ride,fn:pesarCamada})}
 if(mejLv('picadero')){const [g,x,z]=at('picadero');const R5=5.5;const ar=new THREE.Mesh(new THREE.CircleGeometry(R5,32),M('#c9a46e',1));ar.rotation.x=-Math.PI/2;ar.position.y=.03;ar.receiveShadow=true;g.add(ar);
  for(let i=0;i<20;i++){const a=i/20*Math.PI*2;mesh(G.box,M('#6b4a2a'),.14,1.3,.14,Math.cos(a)*R5,.65,Math.sin(a)*R5,g,true)}const rail=new THREE.Mesh(new THREE.TorusGeometry(R5,.05,4,48),M('#e7dcc2'));rail.rotation.x=Math.PI/2;rail.position.y=1.15;g.add(rail);const rl2=rail.clone();rl2.position.y=.65;g.add(rl2);
  const h=makeHorse2({col:mejLv('picadero')>=2?'#e8e2d6':'#5b3f2d',peto:false});g.add(h.root);const rider=makePerson({jacket:'#2b2b2b',pants:'#d8cfbd',hat:'campero',hatc:'#1a1a1a'});seat(rider);rider.root.position.set(0,.98,-.05);h.body.add(rider.root);W3.extra.push({horse:h,cx:x,cz:z,R:R5-1.4,a:0});
  acts.push({x:x+R5+1,z,r:2.6,l:()=>S.doma===absNow()?'Caballos domados este mes':'Domar los caballos de rejoneo',hold:true,dur:3,cond:()=>!W3.ride,fn:()=>{if(S.doma===absNow())return;S.doma=absNow();const v=RI(600,1200);S.money+=v;S.xp=(S.xp||0)+8;save();toast(`Buena sesión de doma: +${eur(v)}`)}})}
 if(mejLv('coso')){const [g,x,z]=at('coso');const lv=mejLv('coso');const Rr=8.8;const ar=new THREE.Mesh(new THREE.CircleGeometry(Rr,48),M('#d4a35c',1));ar.rotation.x=-Math.PI/2;ar.position.y=.03;ar.receiveShadow=true;g.add(ar);
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(Rr,Rr,1.4,48,1,true),M('#8e2a26',.8,0,THREE.DoubleSide));bar.position.y=.7;g.add(bar);
  const pts=[];for(let i=0;i<5;i++){const xx=Rr+.6+i*.55,y=1.6+i*.5;pts.push(new THREE.Vector2(xx,y),new THREE.Vector2(xx+.55,y),new THREE.Vector2(xx+.55,y+.5))}const lat=new THREE.Mesh(new THREE.LatheGeometry(pts,48),M('#bdb3a2',.95,0,THREE.DoubleSide));lat.castShadow=true;g.add(lat);
  const wl=new THREE.Mesh(new THREE.CylinderGeometry(11.5,11.5,4.6,48,1,true),M('#f2ece0',.9,0,THREE.DoubleSide));wl.position.y=2.3;g.add(wl);const tr=new THREE.Mesh(new THREE.TorusGeometry(11.5,.12,4,48),M('#a4532f'));tr.rotation.x=Math.PI/2;tr.position.y=4.6;g.add(tr);
  if(lv>=2){const rf=new THREE.Mesh(new THREE.ConeGeometry(12.2,3.2,48,1,true),M('#9b4a2a',.8,0,THREE.DoubleSide));rf.position.y=6.2;g.add(rf)}
  const gate=mesh(G.box,M('#4a2c1a'),2.6,3,.3,0,1.5,11.55,g);mesh(G.box,M('#c9a24a',.3,.7),3.2,.5,.32,0,3.3,11.6,g,true);col.push({t:'circ',x,z,r:11.6});
  const sg=document.createElement('canvas');sg.width=512;sg.height=96;const c=sg.getContext('2d');c.fillStyle='#7a1d22';c.fillRect(0,0,512,96);c.fillStyle='#e6bb55';c.font='bold 40px Cinzel, Georgia, serif';c.textAlign='center';c.textBaseline='middle';c.fillText(('Coso de '+S.g.name).toUpperCase().slice(0,26),256,50);
  const sgn=new THREE.Mesh(new THREE.PlaneGeometry(3.2,.6),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sg)}));sgn.position.set(0,3.3,11.78);g.add(sgn);
  acts.push({x,z:z+12.8,r:2.8,l:()=>S.festival===absNow()?'Ya hubo festival este mes':'Organizar un festival en tu coso',cond:()=>!W3.ride,fn:festivalModal})}
 if(mej('monumento')){const [g,x,z]=at('monumento');mesh(G.box,M('#9a958c',.85),3.2,1.6,1.8,0,.8,0,g);mesh(G.box,M('#b8b2a6',.8),3.5,.2,2.1,0,1.7,0,g);
  const b=makeBull({pelo:'negro',kind:'toro'});b.root.position.y=1.8;b.root.rotation.y=.4;b.root.traverse(o=>{if(o.isMesh)o.material=M('#8a6a3a',.35,.85)});g.add(b.root);mesh(G.box,M('#c9a24a',.3,.8),1.2,.35,.04,0,.85,.92,g,true);col.push({t:'box',x0:x-1.8,x1:x+1.8,z0:z-1.1,z1:z+1.1});
  acts.push({x,z:z+2.2,r:2.4,l:'Contemplar el monumento',cond:()=>!W3.ride,fn:()=>{cine(x,z,6,3.5,6);toast(`${S.g.name}: ${S.stats.corridas} corridas, ${S.stats.toros} toros lidiados y ${S.stats.indultos} indultos.`)}})}
 if(mej('mirador')){const [g,x,z]=at('mirador');const st=M('#b8a88a',.9);mesh(G.box,st,3.2,9,3.2,0,4.5,0,g);for(const [a,b2] of [[-1,-1],[1,-1],[-1,1],[1,1]])mesh(G.box,st,.7,.8,.7,a*1.25,9.4,b2*1.25,g);mesh(G.box,M('#3a2a1c'),1,2,.1,0,1,1.62,g,true);
  for(let i=0;i<3;i++)mesh(G.box,M('#1d1a16'),.6,.9,.1,0,3+i*2.3,1.62,g,true);col.push({t:'box',x0:x-1.7,x1:x+1.7,z0:z-1.7,z1:z+1.7});
  acts.push({x,z:z+2.6,r:2.4,l:'Subir al mirador',cond:()=>!W3.ride,fn:()=>{cine(x,z,9,40,10,true);toast('Desde lo alto de la torre se ve toda tu dehesa')}})}
 // personal trabajando por la finca
 const ws=[];const add=(st,x,z)=>{const p=makePerson(st);p.root.position.set(x,0,z);sc.add(p.root);ws.push({p,x,z,hx:x,hz:z,t:R(0,3),tx:x,tz:z})};
 for(let i=0;i<stf('vaquero');i++)add({jacket:'#6b4a2a',pants:'#3a3027',hat:'campero',hatc:'#2a1d14'},R(10,24),R(-4,8));
 if(stf('veter'))add({jacket:'#e9e6df',pants:'#2b3a4a',hat:null},-8,25);if(stf('mayoral'))add({jacket:'#3a3027',pants:'#2a2420',hat:'campero',hatc:'#111'},-12,14);
 if(stf('guarda'))add({jacket:'#3e5a3a',pants:'#2a2a2a',hat:'campero',hatc:'#2e3b2a'},30,-6);if(stf('conocedor'))add({jacket:'#5a4a3a',pants:'#2a2420',hat:'campero',hatc:'#3b2c22'},-26,30);if(stf('representante'))add({jacket:'#1d2433',pants:'#1d2433',shirt:'#f4f0e6'},2,10);
 W3.workers=ws};
function pesarCamada(){const c=campo().filter(a=>a.sex==='M'&&!a.role).sort((a,b)=>b.peso-a.peso);const top=c.slice(0,8);const m=c.length?Math.round(c.reduce((s,a)=>s+a.peso,0)/c.length):0;S.pesado=absNow();save();
 modal('Báscula ganadera',`<div class="stack"><div class="kv"><span>Machos pesados <b>${c.length}</b></span><span>Peso medio <b>${m} kg</b></span></div><div class="list">${top.map(a=>`<div class="task"><span class="t"><b>${esc(a.name)}</b> <span class="mono muted">${a.num??''}</span><br><small class="muted">${ageY(a)} años · ${a.pelo}</small></span><b>${a.peso} kg</b></div>`).join('')}</div><small class="muted">Con peso certificado las empresas pagan un 3 % más.</small></div>`)}
function festivalModal(){if(S.festival===absNow()){toast('Ya organizaste el festival de este mes');return}const tor=campo().filter(a=>lidiable(a)&&ageY(a)>=4).sort((a,b)=>(est(b).bra||0)-(est(a).bra||0)).slice(0,2);const coste=6000,lv=mejLv('coso'),taq=r100((8000+S.pres*140)*(lv>=2?1.6:1));
 modal('Festival en tu coso',`<div class="stack"><p style="margin:0">Dos de tus toros, dos matadores y tu gente en los tendidos. Lo ves en directo.</p><div class="kv"><span>Organización <b>${eur(coste)}</b></span><span>Taquilla estimada <b>${eur(taq)}</b></span></div>
 ${tor.length<2?'<p class="muted">Necesitas dos toros de cuatro años o más, sin tentar ni reseñar.</p>':`<div class="list">${tor.map(a=>`<div class="task"><span class="t"><b>${esc(a.name)}</b> ${a.num??''}<br><small class="muted">${ageY(a)} años · ${a.peso} kg · ${a.pelo}</small></span></div>`).join('')}</div><button class="btn oro adv" onclick="hacerFestival()">Anunciar el festival${ICO.chev}</button>`}</div>`)}
function hacerFestival(){const tor=campo().filter(a=>lidiable(a)&&ageY(a)>=4).sort((a,b)=>(est(b).bra||0)-(est(a).bra||0)).slice(0,2);if(tor.length<2)return;const lv=mejLv('coso');const coste=6000,taq=r100((8000+S.pres*140)*(lv>=2?1.6:1));
 S.money+=taq-coste;S.festival=absNow();const o={id:S.oid++,plaza:`Coso de ${S.g.name}`,feria:'Festival en la finca',cat:3,tipo:'corrida',abs:absNow(),n:2,precio:0,st:'aceptada',toros:tor.map(a=>a.id)};tor.forEach(a=>a.res=o.id);S.offers.push(o);
 const r=celebrar(o);S.pres=clamp(S.pres+(lv>=2?1.2:.7),0,100);save();closeModal();toast(`Festival anunciado · taquilla ${eur(taq)}`);setTimeout(()=>{enterPlaza(r.id)},300)}
/* cámara cinematográfica y animaciones de la finca */
function cine(x,z,dur,h,r,orbit){W3.cine={x,z,t:0,dur,h,r,orbit}}
const _fincaTickF=fincaTick;
fincaTick=function(dt){_fincaTickF(dt);if(W3.mode!=='finca')return;
 if(W3.extra)for(const e of W3.extra){if(e.horse){e.a+=dt*.55;const hx=e.cx+Math.cos(e.a)*e.R,hz=e.cz+Math.sin(e.a)*e.R;e.horse.root.position.set(hx-e.cx,0,hz-e.cz);e.horse.root.rotation.y=-e.a;animHorse(e.horse,dt,1.15)}if(e.fl)e.fl.scale.y=.9+Math.random()*.25}
 if(W3.workers)for(const w of W3.workers){w.t-=dt;if(w.t<0){w.t=R(3,8);w.tx=w.hx+R(-6,6);w.tz=w.hz+R(-6,6)}const ex=w.tx-w.x,ez=w.tz-w.z,el=Math.hypot(ex,ez);const sp=el>.4?1.3:0;if(sp){w.x+=ex/el*sp*dt;w.z+=ez/el*sp*dt;w.p.root.rotation.y=Math.atan2(ex,ez)}w.p.root.position.set(w.x,gH(w.x,w.z),w.z);animPerson(w.p,dt,sp/3)}
 const C=W3.cine;if(C){C.t+=dt;const a=C.t*.35+.6,cp=W3.cam.position;cp.set(C.x+Math.cos(a)*C.r,gH(C.x,C.z)+C.h,C.z+Math.sin(a)*C.r);W3.cam.lookAt(C.orbit?C.x+Math.cos(a+2.4)*60:C.x,C.orbit?2:2.4,C.orbit?C.z+Math.sin(a+2.4)*60:C.z);if(C.t>C.dur)W3.cine=null}};
