/* ===================== TOREROS REALISTAS CON TRAJE DE LUCES =====================
   Cuerpo humano real (Quaternius Universal Base Characters, CC0) vestido por zonas con un traje de luces:
   chaquetilla con hombreras y caireles bordados en oro o plata, camisa y corbatín, faja, taleguilla con machos
   y alamares laterales, medias rosas, zapatillas negras y montera. El capote y la muleta del juego se sujetan
   con las manos reales y las posturas de lidia (citar, templar, perfilarse, brazos arriba) mueven los huesos del modelo.
   Picadores (a caballo) y monosabios siguen con el modelo de siempre. */
const TRJ={geo:new Map()};
function trjColor(x,y,z,mn,base,oro,mz){const ax=Math.abs(x);
 if(mn==='Z_bota')return '#0d0a09';
 if(mn==='Z_cinto')return '#8e1a24';
 if(mn==='Z_pant'){if(y<.47)return '#e8a7b4';                       // medias rosas
  if(ax>.12&&ax<.2&&y>.5&&(Math.sin(y*80)>.6||ax>.175))return oro;  // alamares laterales de la taleguilla
  if(y<.53&&y>.47)return oro;                                       // machos bajo la rodilla
  return base}
 if(mn==='Z_manga'){if(ax>.6)return oro;return (Math.sin(ax*90)>.88)?oro:base}
 // chaquetilla
 if(y>1.36&&ax>.13&&ax<.3)return oro;                               // hombreras
 if(y>1.42&&ax<.06&&z>0)return '#111';                              // corbatín
 if(ax<.08&&z>.04&&y>1.05)return '#f4f0e6';                         // camisa
 if(ax>.13&&y<1.34&&y>1.02&&Math.sin(y*70+ax*30)>.8)return oro;     // bordado lateral
 if(ax>.08&&ax<.11&&z>.03)return oro;                               // solapa
 return base}
function trjGeo(o,traje,plata){const k=o.material.name+'|'+traje+'|'+(plata?1:0);if(TRJ.geo.has(k))return TRJ.geo.get(k);
 const g=o.geometry.clone();g.userData={};const p=g.attributes.position,n=p.count,a=new Float32Array(n*3),c=new THREE.Color(),oro=plata?'#d5dadd':'#cfa443';
 for(let i=0;i<n;i++){c.set(trjColor(p.getX(i),p.getY(i),p.getZ(i),o.material.name,traje,oro));a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b}
 g.setAttribute('color',new THREE.BufferAttribute(a,3));TRJ.geo.set(k,g);return g}
function vestirTorero(sc,st){const tint=PIEL_T[Math.floor(Math.random()*PIEL_T.length)];let piel=null;
 const lucesM=new THREE.MeshStandardMaterial({vertexColors:true,skinning:true,roughness:.42,metalness:.32,name:'luces'});
 sc.traverse(o=>{if(!o.isSkinnedMesh)return;o.castShadow=true;o.receiveShadow=false;o.frustumCulled=false;const n=o.material&&o.material.name;
  if(n==='Z_piel'){if(!piel){piel=o.material.clone();piel.color.setRGB(...tint);piel.userData.lin=1;piel.normalMap=null}o.material=piel}
  else if(/^Z_(cam|manga|cinto|pant|bota)$/.test(n)){o.geometry=trjGeo(o,st.traje,st.plata);o.material=lucesM}
  else if(/^Pelo_/.test(o.name)){o.visible=o.name==='Pelo_Rapado';if(o.visible){o.material=o.material.clone();o.material.color.set('#1c140e')}}
  else if(o.name==='Cejas'){o.material=o.material.clone();o.material.color.set('#1c140e')}})}
/* ancla de la mano: su eje -Y sigue al brazo, como la mano del torero de siempre */
function trjMano(bone,sc,side){sc.updateMatrixWorld(true);const g=new THREE.Group();
 const want=new THREE.Matrix4().compose(new THREE.Vector3().setFromMatrixPosition(bone.matrixWorld),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,side*Math.PI/2)),new THREE.Vector3(1,1,1));
 const loc=new THREE.Matrix4().copy(bone.matrixWorld).invert().multiply(want);loc.decompose(g.position,g.quaternion,g.scale);bone.add(g);return g}
function makeToreroGL(st){const P=makePersonGL(Object.assign({},st,{gl:1,traje:null,hat:null,gorra:null,panu:null,_torero:1}));const sc=P.b.children[0];
 vestirTorero(sc,st);const bones={};sc.traverse(o=>{if(o.isBone)bones[o.name]=o});
 // montera
 const G=geos(),hm=M('#111',.6);mesh(G.box,hm,.22,.06,.15,0,.02,-.02,P.hat);for(const s of [1,-1])mesh(G.sph,hm,.05,.045,.05,s*.12,0,-.02,P.hat,true);P.hat.position.y=-.075;
 // capote de paseo
 if(st.paseo){const cp=mesh(G.box,trajeMat(st.paseo,false),.32,.8,.04,.2,1.18,.13,P.b,true);cp.rotation.z=.15}
 // manos reales para la muleta y el estoque; brazos con huesos reales
 P.arms.forEach((ar,i)=>{const sfx=i===0?'l':'r';const hb=bones['hand_'+sfx];if(hb){ar.hand=trjMano(hb,sc,i===0?1:-1)}ar.bUp=bones['upperarm_'+sfx];ar.bLo=bones['lowerarm_'+sfx];ar.bHa=hb});
 P.gl.torero=true;return P}
/* las posturas de lidia (rotaciones de hombro y codo del modelo de siempre) se trasladan a los huesos */
const TQ={a:new THREE.Quaternion(),b:new THREE.Quaternion(),c:new THREE.Quaternion(),v1:new THREE.Vector3(),v2:new THREE.Vector3(),v3:new THREE.Vector3(),e:new THREE.Euler(),d:new THREE.Vector3()};
function trjApunta(bone,child,dirW){if(!bone||!child)return;bone.updateWorldMatrix(true,false);child.updateWorldMatrix(false,false);
 const p0=TQ.v1.setFromMatrixPosition(bone.matrixWorld),p1=TQ.v2.setFromMatrixPosition(child.matrixWorld);const cur=p1.sub(p0).normalize();
 TQ.a.setFromUnitVectors(cur,dirW);bone.getWorldQuaternion(TQ.b);TQ.b.premultiply(TQ.a);bone.parent.getWorldQuaternion(TQ.c).invert();bone.quaternion.copy(TQ.c.multiply(TQ.b));bone.updateMatrixWorld(true)}
function trjBrazos(P){const bq=P.b.getWorldQuaternion(new THREE.Quaternion());
 for(const ar of P.arms){if(!ar.lock||!ar.bUp)continue;const sh=ar.sh.rotation,el=ar.el.rotation.x||0;
  TQ.e.set(sh.x,sh.y,sh.z);const up=TQ.d.set(0,-1,0).applyEuler(TQ.e).applyQuaternion(bq).normalize();trjApunta(ar.bUp,ar.bLo,up.clone());
  TQ.e.set(sh.x+el,sh.y,sh.z);const lo=new THREE.Vector3(0,-1,0).applyEuler(TQ.e).applyQuaternion(bq).normalize();trjApunta(ar.bLo,ar.bHa,lo)}}
const _animPersonT=animPerson;
animPerson=function(P,dt,sp,pose){const r=_animPersonT.apply(this,arguments);if(P&&P.gl&&P.gl.torero){try{trjBrazos(P)}catch(e){}}return r};
const _makePersonT=makePerson;
makePerson=function(st){if(st&&st.traje&&!st.pole&&MOD.per2&&MOD.reg&&!st.proc){try{return makeToreroGL(st)}catch(e){console.warn('torero GL',e)}}return _makePersonT(st)};
