/* ===================== TORO DE LIDIA REALISTA (modelo propio hecho con Tripo) =====================
   Malla esculpida del toro bravo (morrillo, papada, pitones, rabo) con sus texturas de pelo, relieve y brillo.
   No traía esqueleto: se le ha transferido el del toro animado de Quaternius (pesos por cercanía), así que usa
   las mismas animaciones (andar, galope, embestida, comer, muerte...) y todo el código de la lidia sigue igual.
   El pelo de cada res se pinta encima conservando el relieve de la textura (negro, cárdeno, colorado, jabonero,
   berrendos y señas). Dos versiones: detallada para plaza, tienta y ficha; ligera para la manada de la finca.
   Las vacas y becerros siguen con el modelo de siempre. */
const TRI={hi:null,lo:null,det:null,mats:new Map(),geo:new Map(),err:null};
/* el modelo se llevó a las proporciones del toro de Quaternius para heredar su esqueleto: aquí se le devuelve su anchura y largo reales */
const TRI_FX=1.78,TRI_FZ=1.06;
function triLoad(){if(!THREE.GLTFLoader)return;const L=new THREE.GLTFLoader();let n=0;
 const fin=()=>{if(++n<2)return;try{if(TRI.hi&&typeof W3!=='undefined'&&W3&&W3.mode==='finca'&&!W3.ride&&typeof S!=='undefined'&&S)rebuildFinca()}catch(e){}};
 L.load(TOR_BASE+'modelos/toro-tripo.glb',g=>{TRI.hi=g;fin()},undefined,e=>{TRI.err=e;fin()});
 L.load(TOR_BASE+'modelos/toro-tripo-lo.glb',g=>{TRI.lo=g;fin()},undefined,e=>{fin()})}
function triMalla(g){let m=null;g.scene.traverse(o=>{if(o.isSkinnedMesh)m=o});return m}
/* textura de relieve: el pelo negro original se convierte en gris medio (0,5) conservando sus vetas; pitones, ojos y pezuñas quedan con su color */
function triDetalle(){if(TRI.det)return TRI.det;const src=triMalla(TRI.hi).material.map;if(!src||!src.image)return null;const im=src.image,w=im.width,h=im.height;
 const cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');c.drawImage(im,0,0);const D=c.getImageData(0,0,w,h),d=D.data;
 let s=0,k=0;for(let i=0;i<d.length;i+=16){const l=(.3*d[i]+.59*d[i+1]+.11*d[i+2])/255;if(l<.3){s+=l;k++}}const mean=Math.max(.02,s/Math.max(1,k));
 for(let i=0;i<d.length;i+=4){const l=(.3*d[i]+.59*d[i+1]+.11*d[i+2])/255;if(l>.42&&(d[i]-d[i+2])>12)continue;const g=Math.min(255,Math.round(Math.min(.8,.5*Math.pow(l/mean,.55))*255));d[i]=d[i+1]=d[i+2]=g}
 c.putImageData(D,0,0);const t=new THREE.CanvasTexture(cv);t.flipY=src.flipY;t.encoding=THREE.sRGBEncoding;t.wrapS=src.wrapS;t.wrapT=src.wrapT;t.anisotropy=4;
 TRI.det={t,d,w,h};return TRI.det}
function triClaro(det,u,v){if(!det)return false;const x=Math.min(det.w-1,Math.max(0,Math.floor(((u%1)+1)%1*det.w))),y=Math.min(det.h-1,Math.max(0,Math.floor(((v%1)+1)%1*det.h)));
 const i=(y*det.w+x)*4,o=TRI.hi_orig;if(!o)return false;const l=(.3*o[i]+.59*o[i+1]+.11*o[i+2])/255;return l>.42&&(o[i]-o[i+2])>12}
function triOrig(){if(TRI.hi_orig)return;const src=triMalla(TRI.hi).material.map;if(!src||!src.image)return;const im=src.image,cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const c=cv.getContext('2d');c.drawImage(im,0,0);TRI.hi_orig=c.getImageData(0,0,im.width,im.height).data}
/* pelo por vértice sobre la malla del toro (en el espacio del esqueleto, igual que el de siempre) */
function triColores(lod,spec,m){const ck=lod+'|'+(spec.pelo||'negro')+'|'+(spec.kind||'toro')+'|'+(m.bragado?1:0)+(m.lucero?1:0)+(m.calcetero?1:0)+(m.rabicano?1:0);
 if(TRI.geo.has(ck))return TRI.geo.get(ck);triOrig();const det=triDetalle();
 const src=TRI[lod],mm=triMalla(src);src.scene.updateMatrixWorld(true);const I=torInfo('bull'),[base,hi,pat]=PELO[spec.pelo]||PELO.negro;
 const cB=new THREE.Color(base),cH=new THREE.Color(hi),cD=new THREE.Color(shade(base,-.35)),cW=new THREE.Color('#ece4d6'),cP=new THREE.Color('#15100c');
 const r=mulberry((spec.pelo||'negro').length*17),blobs=[];
 if(pat===2)for(let i=0;i<7;i++)blobs.push({x:(r()-.5)*.7,y:I.top*(.45+r()*.5),z:I.zMin+I.L*(.12+r()*.62),rx:.18+r()*.2,ry:.16+r()*.16,rz:.22+r()*.3});
 const g=mm.geometry.clone(),p=g.attributes.position,uv=g.attributes.uv,n=p.count,a=new Float32Array(n*3),v=new THREE.Vector3(),c=new THREE.Color(),K=2*.62;
 for(let i=0;i<n;i++){v.fromBufferAttribute(p,i).applyMatrix4(mm.matrixWorld);const x=v.x,y=v.y,z=v.z,zr=(z-I.zMin)/I.L,yn=y/I.top;
  if(zr>.8&&y>I.top*.72&&uv&&triClaro(det,uv.getX(i),uv.getY(i))){a[i*3]=a[i*3+1]=a[i*3+2]=1;continue}   // pitones con su color
  if(y<.11){a[i*3]=a[i*3+1]=a[i*3+2]=.3;continue}                                                       // pezuñas                                                                   // pezuñas
  else{if(yn>.8)c.copy(cB).lerp(cH,Math.min(1,(yn-.8)/.25)*.7);else if(yn<.55)c.copy(cB).lerp(cD,Math.min(1,(.55-yn)/.35));else c.copy(cB);
   if(pat===1){const q=r();if(q<.16)c.lerp(cW,.16);else if(q<.55)c.lerp(cD,.45)}
   for(const b of blobs){const d=((x-b.x)/b.rx)**2+((y-b.y)/b.ry)**2+((z-b.z)/b.rz)**2;if(d<1){c.copy(cW);break}}
   if(m.bragado&&yn<.62&&zr>.25&&zr<.7&&Math.abs(x)<.3)c.copy(cW);
   if(m.calcetero&&y<.34&&zr<.95)c.copy(cW);
   if(m.lucero&&zr>.9&&y>I.horn.y-.1&&Math.abs(x)<.06)c.copy(cW);
   if(m.rabicano&&zr<.06&&y<I.top*.62)c.copy(cW)}
  a[i*3]=c.r*K;a[i*3+1]=c.g*K;a[i*3+2]=c.b*K}
 g.setAttribute('color',new THREE.BufferAttribute(a,3));g.computeBoundingBox();g.boundingSphere=new THREE.Sphere();g.boundingBox.getBoundingSphere(g.boundingSphere);g.boundingSphere.radius*=1.7;
 TRI.geo.set(ck,g);return g}
function triMat(lod){if(TRI.mats.has(lod))return TRI.mats.get(lod);const o=triMalla(TRI.hi).material,det=triDetalle();
 const m=new THREE.MeshStandardMaterial({vertexColors:true,skinning:true,map:det?det.t:null,normalMap:lod==='hi'?o.normalMap:null,roughnessMap:lod==='hi'?o.roughnessMap:null,roughness:lod==='hi'?1:.62,metalness:0,name:'ToroTripo'});
 if(m.normalMap)m.normalScale=new THREE.Vector2(1,1);m.userData.lin=1;TRI.mats.set(lod,m);return m}
function makeBullTri(spec){
 const G=geos(),kind=spec.kind||'toro',cab=kind==='cabestro',KD=TOR_KIND[kind]||TOR_KIND.toro;
 const m=spec.m||{len:1,alt:1,morr:.9,leg:1,girth:1,papada:1,horn:cab?'cab':'veleto',hl:cab?1.25:1,ht:.05,hc:'#e2d6bc'};
 const lod=(typeof W3!=='undefined'&&W3&&W3.mode==='finca'&&W3.on&&TRI.lo&&!spec.hi)?'lo':'hi';
 const I=torInfo('bull'),geo=triColores(lod,spec,m),mat=triMat(lod);
 const sc=THREE.SkeletonUtils.clone(TRI[lod].scene);const bones={};
 sc.traverse(o=>{if(o.isBone)bones[o.name]=o;if(!o.isSkinnedMesh)return;o.geometry=geo;o.material=mat;o.castShadow=true;o.receiveShadow=lod==='hi';o.frustumCulled=false});
 const root=new THREE.Group(),b=new THREE.Group();root.add(b);const mdl=new THREE.Group();b.add(mdl);mdl.add(sc);
 const k=KD.f/KD.s,sx=k*(m.girth||1)*TRI_FX*.92,sy=k*(m.alt||1)*(.75+.25*(m.leg||1)),sz=k*(m.len||1)*KD.z*TRI_FZ*.97;mdl.scale.set(sx,sy,sz);
 if(bones.Torso3&&bones.Neck1){const f=1+.06*(m.morr??.9)*(cab?.5:1);bones.Torso3.scale.setScalar(f);bones.Neck1.scale.setScalar(1/f)}
 root.updateMatrixWorld(true);
 /* cabeza: los pitones son los del propio modelo; el ancla se usa para el cencerro del cabestro y para el código que la mueve */
 const hp=torAnchor(bones.Head,b,new THREE.Vector3(0,I.horn.y*sy-.08,I.horn.z*sz-.15),1,.28);
 if(cab){mesh(G.cyl,M('#8a6a2a',.35,.6),.13,.24,.13,0,-.55,.2,hp);mesh(G.box,M('#3a2a1c'),.06,.3,.06,0,-.35,.2,hp,true)}
 const hpq=hp.quaternion.clone();
 const spine=bones.Torso3||bones.Torso2||bones.Body;
 const bg=torAnchor(spine,b,new THREE.Vector3(0,I.back(I.band)*sy-.02,I.band*sz),1);
 if(spec.div){const dv=torAnchor(spine,b,new THREE.Vector3(0,I.back(I.div)*sy+.02,I.div*sz),1);const dl=spec.div,nn=Math.max(2,dl.length);for(let i=0;i<nn;i++){const kk=i-(nn-1)/2;const rr=new THREE.Mesh(new THREE.PlaneGeometry(.07,.42),M(dl[i%dl.length],.7,0,THREE.DoubleSide));rr.position.set(kk*.07,-.12,0);rr.rotation.set(.3,0,-kk*.5);dv.add(rr)}mesh(G.sph,M(spec.div[0],.6),.06,.06,.06,0,.02,0,dv,true)}
 const cols=['#bf3a3f','#e6bb55','#1f6b3a','#3a78b8','#f1ece0','#5b2a6e'];
 for(let i=0;i<6;i++){const s=new THREE.Group();s.position.set((i%2?.12:-.12),0,(Math.floor(i/2)-1)*.18);s.rotation.set(-.5,0,(i%2?-.3:.3));
  mesh(G.cyl,M('#efe6d2'),.018,.75,.018,0,.37,0,s,true);for(let j=0;j<3;j++)mesh(G.box,M(cols[(i+j)%6],.6),.07,.12,.07,0,.5+j*.12,0,s,true);s.visible=false;bg.add(s)}
 root.scale.setScalar(KD.s);
 const mixer=new THREE.AnimationMixer(sc),acts={};for(const c of TRI.hi.animations)acts[c.name]=mixer.clipAction(c);
 const B={root,b,hp,hpq,legs:[],tp:new THREE.Group(),bg,ph:Math.random()*6,kind,hipY:1,t:Math.random()*10,tri:lod,
  cruz:{y:I.back(I.cruz)*sy,z:I.cruz*sz},gl:{mixer,acts,cur:null,neck:bones.Neck2||bones.Neck1||null}};
 torPlay(B,'Idle',0);if(acts.Idle)acts.Idle.time=Math.random()*3;return B}

envolver('makeBullGL','toro3',_makeBullGLT=>function(spec){const kind=(spec&&spec.kind)||'toro';if((kind==='toro'||kind==='cabestro')&&TRI.hi&&TOR.bull){try{return makeBullTri(spec)}catch(e){console.warn('toro Tripo',e)}}return _makeBullGLT.apply(this,arguments)});
try{if(document.readyState!=='loading')triLoad();else document.addEventListener('DOMContentLoaded',triLoad)}catch(e){TRI.err=e}
