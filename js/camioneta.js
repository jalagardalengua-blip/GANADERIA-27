/* ===================== CAMIONETA DE LA FINCA: todoterreno en 3D =====================
   Modelo «Toyota Fortuner 2021» de Asadawut.Kaewma (Sketchfab, CC BY 4.0), aligerado para el móvil
   (sin el interior, 80.000 triángulos, texturas de 512 px). Sustituye a la camioneta de cajas en la finca 3D:
   las cuatro ruedas se separan en grupos propios para que giren al avanzar y las delanteras se orienten
   con la dirección, como hacía la anterior. Mientras se descarga se ve la camioneta de siempre. */
const CAM4={g:null,pend:false,cola:[],err:false};
const CAM4_RUEDAS=[[.76,.36,1.12],[-.76,.36,1.12],[.76,.36,-1.57],[-.76,.36,-1.57]];   // como W3.truckM.wheels: delanteras primero
function camionetaGLB(tm){if(!tm||!tm.g||CAM4.err||!THREE.GLTFLoader)return;if(CAM4.g){camionetaPon(tm);return}
 CAM4.cola.push(tm);if(CAM4.pend)return;CAM4.pend=true;
 new THREE.GLTFLoader().load('modelos/camioneta.glb',g=>{CAM4.g=g.scene;CAM4.g.updateMatrixWorld(true);const q=CAM4.cola.splice(0);for(const t of q)try{camionetaPon(t)}catch(e){console.warn('camioneta',e)}},undefined,()=>{CAM4.err=true});}
function camionetaPon(tm){if(tm.glb)return;const src=CAM4.g.clone(true);src.updateMatrixWorld(true);
 const cuerpo=new THREE.Group(),ruedas=CAM4_RUEDAS.map(([x,y,z])=>{const wg=new THREE.Group();wg.position.set(x,y,z);const sp=new THREE.Group();wg.add(sp);return wg});
 const meshes=[];src.traverse(o=>{if(o.isMesh)meshes.push(o)});const bb=new THREE.Box3(),c=new THREE.Vector3(),sz=new THREE.Vector3();
 for(const o of meshes){bb.setFromObject(o);bb.getCenter(c);bb.getSize(sz);let k=-1;
  if(sz.x<.45&&sz.y<.9&&sz.z<.9)CAM4_RUEDAS.forEach(([x,y,z],i)=>{if(Math.hypot(c.x-x,c.y-y,c.z-z)<.32)k=i});
  const m=o.matrixWorld.clone();o.parent.remove(o);o.matrixAutoUpdate=true;
  if(k>=0){const w=ruedas[k];m.premultiply(new THREE.Matrix4().makeTranslation(-w.position.x,-w.position.y,-w.position.z));w.children[0].add(o)}else cuerpo.add(o);
  m.decompose(o.position,o.quaternion,o.scale);o.castShadow=true;o.receiveShadow=true;
  for(const mt of [].concat(o.material))if(mt&&mt.isMeshStandardMaterial){mt.envMapIntensity=1;if(/glass/i.test(mt.name)){mt.transparent=true;mt.opacity=Math.min(mt.opacity,.55);mt.depthWrite=false}}}
 // fuera la camioneta de cajas (carrocería, faros y ruedas viejas)
 for(const ch of tm.g.children.slice())ch.visible=false;
 tm.g.add(cuerpo);for(const w of ruedas)tm.g.add(w);tm.wheels.length=0;tm.wheels.push(...ruedas);tm.glb=true;}
