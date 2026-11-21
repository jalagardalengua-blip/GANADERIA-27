/* ===================== GANADERÍA DE CORRO · OBJETOS FOTOESCANEADOS DE LA PLAZA (Poly Haven, CC0) =====================
   Sillas de plástico en los tablados, sillas «gallinera», mesas de terraza, bancos, jardineras, barricas y cajas
   de la peña bajo los soportales. Modelos reducidos (600–5.800 triángulos, texturas de 512 px) y dibujados con
   instancias: una llamada de dibujo por material aunque haya decenas de sillas. Se cargan en segundo plano; si no
   han llegado o la calidad es baja, la plaza usa las mesas generadas y no se nota nada. */
const PMXP={ok:false,loading:false,m:{},wait:[]};
const PMXP_FILES={silla:'silla-plastico',gallinera:'silla-gallinera',mesa:'mesa-terraza',banco:'banco',jardinera:'jardinera',barrica:'barrica',caja:'caja-madera'};
function pmxPropsLoad(){if(PMXP.ok||PMXP.loading||!THREE.GLTFLoader)return;let q='media';try{q=getQual()}catch(e){}if(q==='baja')return;PMXP.loading=true;
 const L=new THREE.GLTFLoader(),base=(typeof MOD_BASE!=='undefined'?MOD_BASE:'')+'modelos/corro/';let n=0;const keys=Object.keys(PMXP_FILES);
 const done=()=>{if(++n<keys.length)return;PMXP.ok=Object.keys(PMXP.m).length>0;PMXP.loading=false;const w=PMXP.wait;PMXP.wait=[];for(const f of w)try{f()}catch(e){console.warn('props',e)}};
 for(const k of keys)L.load(base+PMXP_FILES[k]+'.glb',g=>{try{PMXP.m[k]=pmxPropsPrep(g.scene)}catch(e){console.warn('prop '+k,e)}done()},undefined,()=>done())}
// cada modelo: lista de [geometría, material, matriz local] apoyada en el suelo y centrada
function pmxPropsPrep(scene){scene.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(scene),c=new THREE.Vector3();bb.getCenter(c);
 const off=new THREE.Matrix4().makeTranslation(-c.x,-bb.min.y,-c.z),parts=[];
 scene.traverse(o=>{if(!o.isMesh)return;const m=o.material;for(const k of ['map','emissiveMap'])if(m[k])m[k].encoding=THREE.sRGBEncoding;m.needsUpdate=true;parts.push([o.geometry,m,new THREE.Matrix4().multiplyMatrices(off,o.matrixWorld)])});
 return {parts,size:bb.getSize(new THREE.Vector3())}}
// coloca una lista de {x,y,z,yaw,s} de un modelo como instancias
function pmxPropsInst(sc,k,list,shadow){const P=PMXP.m[k];if(!P||!list.length)return [];const out=[],T=new THREE.Matrix4(),R_=new THREE.Matrix4(),S_=new THREE.Matrix4(),W=new THREE.Matrix4();
 for(const [g,m,loc] of P.parts){const im=new THREE.InstancedMesh(g,m,list.length);im.castShadow=!!shadow;im.receiveShadow=true;
  list.forEach((p,i)=>{T.makeTranslation(p.x,p.y||0,p.z);R_.makeRotationY(p.yaw||0);S_.makeScale(p.s||1,p.s||1,p.s||1);W.multiplyMatrices(T,R_).multiply(S_).multiply(loc);im.setMatrixAt(i,W)});
  im.instanceMatrix.needsUpdate=true;im.userData.prop=k;sc.add(im);out.push(im)}return out}
// reparto de los objetos de la plaza (lo prepara buildCalle en CL.pmxProps)
function pmxPropsPlace(sc,P){if(!P)return;const go=()=>{if(!CL||(CL.sc&&CL.sc!==sc))return;const sh=W3&&W3.q==='alta';
  // en calidad media se colocan menos (los más cercanos a la plaza primero)
  const cap=sh?null:{silla:16,barrica:5,caja:5,mesa:6,gallinera:8,banco:6,jardinera:6};
  for(const k of Object.keys(P)){let L=P[k];if(cap&&L.length>cap[k])L=L.slice().sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z)).slice(0,cap[k]);pmxPropsInst(sc,k,L,sh&&k!=='silla')}};
 if(PMXP.ok)go();else{PMXP.wait.push(go);pmxPropsLoad()}}
// empieza a descargar en segundo plano poco después de abrir el juego
try{setTimeout(pmxPropsLoad,6000)}catch(e){}
