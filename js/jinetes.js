/* ===================== JINETES REALISTAS =====================
   Alguacilillos (chambergo con pluma, traje negro) y picadores (castoreño, chaquetilla bordada y vara)
   con el cuerpo humano realista, sentados en la montura con las piernas abiertas y la vara en la mano.
   Cada jinete se anima en cada fotograma aunque la escena no lo haga (el picador en la suerte de varas). */
const JIN={set:new Set(),fr:0,t:0};
function jinSombrero(P,k){const G=geos();while(P.hat.children.length)P.hat.remove(P.hat.children[0]);P.hat.visible=true;
 if(k==='castoreno'){mesh(G.cyl,M('#d8c08a',.7),.3,.02,.3,0,.12,0,P.hat);mesh(G.sph,M('#d8c08a',.7),.14,.11,.14,0,.16,0,P.hat);mesh(G.cyl,M('#1b1410',.8),.145,.025,.145,0,.14,0,P.hat)}
 else{mesh(G.cyl,M('#111',.7),.33,.02,.33,0,.12,0,P.hat);mesh(G.cyl,M('#111',.7),.13,.11,.13,0,.18,0,P.hat);mesh(G.sph,M('#c0303a',.7),.05,.16,.04,.1,.28,-.04,P.hat,true).rotation.z=-.5;mesh(G.sph,M('#f4f0e6',.7),.04,.13,.035,.14,.26,-.05,P.hat,true).rotation.z=-.7}
 P.hat.position.y=-.13}
function jinHuesos(P){const sc=P.b.children[0],bones={};sc.traverse(o=>{if(o.isBone)bones[o.name]=o});
 P.piernas=['l','r'].map(s=>({s:s==='l'?1:-1,th:bones['thigh_'+s],ca:bones['calf_'+s],ft:bones['foot_'+s]}));return bones}
function makeJineteGL(st){let P;
 if(st.traje){P=makeToreroGL(Object.assign({},st,{pole:null,paseo:null}));jinHuesos(P)}
 else{P=makeCampoGL(Object.assign({},st,{hat:'campero',pole:null}))}
 jinSombrero(P,st.hat);
 if(st.pole){const g=new THREE.Group();g.rotation.set(0,0,-1.5);P.arms[1].hand.add(g);mesh(geos().cyl,M('#a88b5a',.7),.025,st.pole,.025,0,-st.pole*.32,0,g);mesh(geos().cyl,M('#3a3a3a',.4,.6),.012,.09,.012,0,-st.pole*.82-.04,0,g)}
 P.gl.brazos=true;P.jinete=true;return P}
const _makePersonJ=makePerson;
makePerson=function(st){if(st&&(st.hat==='castoreno'||st.hat==='chambergo')&&MOD.per2&&MOD.reg&&!st.proc){try{return makeJineteGL(st)}catch(e){console.warn('jinete GL',e)}}return _makePersonJ(st)};
const _seatJ=seat;
seat=function(P){if(P&&P.jinete){P.montado=true;JIN.set.add(P);return}return _seatJ.apply(this,arguments)};
const _animPersonJ=animPerson;
animPerson=function(P,dt,sp,pose){if(P&&P.montado){P.gl.want='Idle_Loop';P.gl.wts=.35;P._jf=JIN.fr}
 const r=_animPersonJ.apply(this,arguments);if(P&&P.montado){try{f4Montado(P)}catch(e){}}return r};
function jinRaiz(o){while(o.parent)o=o.parent;return o}
function jinTick(){const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-(JIN.t||now))/1000));JIN.t=now;
 for(const P of JIN.set){const top=jinRaiz(P.root);if(top.isScene&&top!==W3.scene){JIN.set.delete(P);continue}if(top!==W3.scene)continue;if(P._jf!==JIN.fr){try{animPerson(P,dt,0)}catch(e){}}}JIN.fr++}
(function jinHook(){if(!W3.R){setTimeout(jinHook,500);return}if(W3.R.__jin)return;W3.R.__jin=1;const rd=W3.R.render;W3.R.render=function(sc,cam){if(sc===W3.scene&&JIN.set.size)try{jinTick()}catch(e){}return rd.apply(this,arguments)}})();
