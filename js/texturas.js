/* ===================== TEXTURAS REALES Y DEHESA CON VEGETACIÓN (Quaternius, CC0) =====================
   Albero con grano y relieve, suelo de la finca con detalle, calles con relieve,
   y en la dehesa encinas, matorral, rocas y pasto de verdad alrededor de la finca. */
const TXR={c:{},nat:null,err:null};
function txr(name,rep,lin){const k=name+'|'+rep;if(TXR.c[k])return TXR.c[k];const t=new THREE.TextureLoader().load((typeof MOD_BASE!=='undefined'?MOD_BASE:'')+'img/tex/'+name+'.jpg');t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=4;TXR.c[k]=t;return t}
const txrQ=()=>{try{return getQual()}catch(e){return 'media'}};
/* plaza: albero de verdad (también en el modo torero y las capeas en plaza) */
const _buildPlazaTx=buildPlaza;
buildPlaza=function(){const P=_buildPlazaTx.apply(this,arguments);try{if(txrQ()!=='baja')P.sc.traverse(o=>{const g=o.geometry;if(o.isMesh&&g&&g.type==='CircleGeometry'&&Math.abs(g.parameters.radius-PR)<.01&&o.material&&o.material.map){const m=o.material;m.map=txr('albero',9);m.normalMap=txr('tierra-n',9);m.normalScale=new THREE.Vector2(.55,.55);m.roughness=1;m.needsUpdate=true}})}catch(e){}return P};
/* calles: relieve en el suelo */
if(typeof buildCalle==='function'){const _bcTx=buildCalle;buildCalle=function(){const sc=_bcTx.apply(this,arguments);try{if(txrQ()!=='baja')sc.traverse(o=>{const g=o.geometry;if(o.isMesh&&g&&g.type==='PlaneGeometry'&&g.parameters.width===200&&o.material){const m=o.material;const n=txr('asfalto-n',1);n.repeat.set(28,17);m.normalMap=n;m.normalScale=new THREE.Vector2(.45,.45);m.needsUpdate=true}})}catch(e){}return sc}}
/* vegetación */
function txrNatLoad(){if(!THREE.GLTFLoader||TXR.nat||TXR.loading)return;TXR.loading=1;
 new THREE.GLTFLoader().load((typeof MOD_BASE!=='undefined'?MOD_BASE:'')+'modelos/natura.gltf.json',g=>{TXR.nat=g.scene;g.scene.updateMatrixWorld(true);
  g.scene.traverse(o=>{if(o.isMesh){const m=o.material;if(/Leaves/.test(m.name)){m.color.set(m.name==='Leaves_NormalTree'?'#7e8c4c':'#8a9655');m.alphaTest=.45}if(/Bark/.test(m.name))m.color.set('#9b8f84');if(m.name==='Grass')m.color.set('#c9c07a');if(m.name==='Rocks')m.color.set('#cfc7b8')}});
  try{if(W3&&W3.mode==='finca'&&!W3.ride&&S)rebuildFinca()}catch(e){}},undefined,e=>{TXR.err=e})}
function txrInst(name,list,shadow){const src=TXR.nat&&TXR.nat.getObjectByName(name);if(!src||!list.length)return [];const out=[];const bb=new THREE.Box3().setFromObject(src);const base=bb.min.y,h=bb.max.y-bb.min.y||1;
 const T=new THREE.Matrix4(),Rm=new THREE.Matrix4(),Sm=new THREE.Matrix4(),O=new THREE.Matrix4().makeTranslation(-src.position.x,-base,-src.position.z);
 src.traverse(o=>{if(!o.isMesh)return;const im=new THREE.InstancedMesh(o.geometry,o.material,list.length);im.castShadow=!!shadow;im.receiveShadow=true;const loc=new THREE.Matrix4().multiplyMatrices(O,o.matrixWorld);
  list.forEach((p,i)=>{const s=p.h/h;T.makeTranslation(p.x,p.y,p.z);Rm.makeRotationY(p.r);Sm.makeScale(s*(p.sx||1),s,s*(p.sx||1));const M2=new THREE.Matrix4().multiply(T).multiply(Rm).multiply(Sm).multiply(loc);im.setMatrixAt(i,M2)});im.instanceMatrix.needsUpdate=true;im.userData.nat=1;out.push(im)});return out}
const _rebuildTx=rebuildFinca;
rebuildFinca=function(){_rebuildTx.apply(this,arguments);if(W3.mode!=='finca'||!W3.scene)return;const sc=W3.scene,q=txrQ();if(q==='baja')return;
 try{
  // detalle de tierra en el terreno
  sc.traverse(o=>{const g=o.geometry;if(o.isMesh&&g&&g.type==='PlaneGeometry'&&g.parameters.width===600&&!o.userData.tx){o.userData.tx=1;const m=o.material;m.map=txr('detalle',150);m.normalMap=txr('tierra-n',150);m.normalScale=new THREE.Vector2(.35,.35);m.needsUpdate=true}});
  if(!TXR.nat){txrNatLoad();return}
  // encinas: las cercanas pasan a ser árboles de verdad
  let trunk=null,crown=null;sc.traverse(o=>{if(o.isInstancedMesh){const t=o.geometry.type;if(t==='CylinderGeometry'&&o.geometry.parameters.radiusTop===.28&&!trunk)trunk=o;if(t==='IcosahedronGeometry'&&!crown)crown=o}});
  const enc=[];if(trunk&&crown){const m=new THREE.Matrix4(),p=new THREE.Vector3(),qq=new THREE.Quaternion(),s=new THREE.Vector3(),Z=new THREE.Matrix4().makeScale(0,0,0);const lim=q==='alta'?26:12;
   const idx=[];for(let i=0;i<trunk.count;i++){trunk.getMatrixAt(i,m);m.decompose(p,qq,s);idx.push([Math.hypot(p.x,p.z-10),i,p.x,p.y-1.2*s.x,p.z,s.x])}idx.sort((a,b)=>a[0]-b[0]);
   for(const [d,i,x,y,z,sc2] of idx.slice(0,lim)){if(d>230)break;trunk.setMatrixAt(i,Z);crown.setMatrixAt(i*2,Z);crown.setMatrixAt(i*2+1,Z);enc.push({x,y:y-.15,z,h:6.2+sc2*2.6,r:sc2*9,sx:1.15+((i*37)%10)/40})}
   trunk.instanceMatrix.needsUpdate=true;crown.instanceMatrix.needsUpdate=true}
  // matorral, rocas y pasto
  const rn=mulberry(((S&&S.g&&S.g.name)||'x').length*31+7),blocked=(x,z)=>(x>-44&&x<42&&z>-50&&z<68)||Math.abs(x)<7&&z>8;
  const scat=(n,R0,R1,hm,hv)=>{const o=[];let t=0;while(o.length<n&&t++<n*8){const a=rn()*Math.PI*2,r=R0+rn()*(R1-R0),x=Math.cos(a)*r,z=10+Math.sin(a)*r;if(blocked(x,z))continue;o.push({x,y:gH(x,z)-.05,z,h:hm+rn()*hv,r:rn()*6.3,sx:.8+rn()*.5})}return o};
  const grp=new THREE.Group();grp.name='natura';{const mo=S?S.month:3,gc=mo>=2&&mo<=4?'#a9b866':mo>=5&&mo<=8?'#d8c27e':mo>=9&&mo<=10?'#bfb470':'#9fae68';TXR.nat.traverse(o=>{if(o.isMesh&&o.material&&o.material.name==='Grass'){o.material.color.set(gc);o.material.userData.lin=0;o.material.side=THREE.DoubleSide;o.material.emissive=new THREE.Color(gc).multiplyScalar(.28);o.material.emissiveIntensity=1}})}
  [...txrInst('CommonTree_3',enc,false),...txrInst('Grass_Wispy_Tall',scat(q==='alta'?70:36,30,170,.55,.45),false),...txrInst('Grass_Wide_Short',scat(q==='alta'?60:30,30,150,.35,.25),false),...(S&&S.month>=2&&S.month<=5?txrInst('Flower_3_Group',scat(q==='alta'?40:20,32,140,.35,.2),false):[]),...txrInst('Rock_Medium_1',scat(q==='alta'?30:16,40,180,.5,.9),false),...txrInst('Rock_Big_1',scat(q==='alta'?8:4,60,200,1.2,1.6),true),...txrInst('Grass_Common_Tall',scat(q==='alta'?30:0,34,150,.45,.4),false)].forEach(m=>grp.add(m));
  sc.add(grp)}catch(e){console.warn('natura',e)}};
try{setTimeout(txrNatLoad,1500)}catch(e){}
