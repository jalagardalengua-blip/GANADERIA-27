/* ===================== DEHESA REALISTA =====================
   La finca como una dehesa de verdad (Salamanca, Extremadura, Sierra Morena):
   - Encinas con copa ancha y redondeada, hoja menuda y oscura, envés más oscuro y la "línea de ramoneo":
     la copa plana por debajo a la altura a la que llega el ganado. Tronco gris pardo con dos o tres ramas maestras.
   - Berrocales: grupos de bolos de granito redondeados con líquenes.
   - Sierra en el horizonte, azulada por la distancia.
   - Luz de sol más cálida y con más contraste; suelo con más color.
   Todo con mallas instanciadas para que el móvil lo mueva sin tirones. */
const DH={};
function dhRuido(x,y,z){return f4Noise(x*1.7+z*.61,y*1.7-z*.37)*.6+f4Noise(x*3.9-y*.8,z*3.9+y*.5)*.4}
/* ---------- geometría de la encina (una sola, se reutiliza en todas) ---------- */
function dhCopaGeo(det){const U=THREE.BufferGeometryUtils;const blobs=[[0,0,0,1],[.62,.02,.18,.74],[-.58,.06,-.12,.78],[.12,.08,.66,.7],[-.18,.04,-.64,.72],[.38,.34,-.32,.6],[-.34,.36,.3,.62],[.02,.5,.02,.62]];
 const gs=blobs.map(([x,y,z,r],k)=>{const g=new THREE.IcosahedronGeometry(r,det);g.deleteAttribute('uv');g.deleteAttribute('normal');const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const vx=p.getX(i),vy=p.getY(i),vz=p.getZ(i);const n=1+(dhRuido(vx+k*3.1,vy,vz-k)-.5)*.42;p.setXYZ(i,vx*n+x,vy*n+y,vz*n+z)}return g});
 let g=U.mergeBufferGeometries(gs);g=U.mergeVertices(g,1e-3);const p=g.attributes.position;const c=new Float32Array(p.count*3);
 const bajo=new THREE.Color('#2e3a1d'),alto=new THREE.Color('#5d6a35'),gris=new THREE.Color('#6c7458'),t=new THREE.Color();
 for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  if(y<-.3)y=-.3+(y+.3)*.18;                                                    // línea de ramoneo: copa plana por debajo
  p.setXYZ(i,x*3.3,y*1.75,z*3.3);
  const h=clamp((y+.3)/1.3,0,1);t.copy(bajo).lerp(alto,h*h).lerp(gris,clamp((dhRuido(x*2,y*2,z*2)-.55)*1.6,0,.45));c.set([t.r,t.g,t.b],i*3)}
 g.setAttribute('color',new THREE.BufferAttribute(c,3));g.computeVertexNormals();g.translate(0,3.55,0);return g}
function dhTroncoGeo(){const U=THREE.BufferGeometryUtils;const parts=[];const tr=new THREE.CylinderGeometry(.24,.38,2.6,8,3);tr.translate(0,1.3,0);
 const pp=tr.attributes.position;for(let i=0;i<pp.count;i++){const y=pp.getY(i);pp.setX(i,pp.getX(i)+Math.sin(y*1.7)*.06);pp.setZ(i,pp.getZ(i)+Math.cos(y*1.3)*.05)}parts.push(tr);
 for(const [a,l,inc] of [[0,1.9,.75],[2.2,1.7,.85],[4.1,1.5,.7]]){const b=new THREE.CylinderGeometry(.09,.17,l,6);b.translate(0,l/2,0);b.rotateZ(inc);b.rotateY(a);b.translate(0,2.35,0);parts.push(b)}
 const g=U.mergeBufferGeometries(parts.map(x=>{x.deleteAttribute('uv');return x}));g.computeVertexNormals();return g}
function dhMatCopa(){if(DH.mc)return DH.mc;const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92,metalness:0});
 // hoja menuda: ruido en el color y en la normal según la posición, sin texturas que pesen
 m.onBeforeCompile=s=>{s.vertexShader='varying vec3 vWq;\n'+s.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvWq=(modelMatrix*instanceMatrix*vec4(transformed,1.0)).xyz;');
  s.fragmentShader='varying vec3 vWq;\nfloat dhH(vec3 p){return fract(sin(dot(floor(p),vec3(12.9898,78.233,45.164)))*43758.5453);}\n'+s.fragmentShader
   .replace('#include <color_fragment>','#include <color_fragment>\nfloat hj=dhH(vWq*7.0)*.6+dhH(vWq*15.0)*.4;diffuseColor.rgb*=.72+.5*hj;')
   .replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=normalize(normal+(vec3(dhH(vWq*9.0),dhH(vWq*9.0+3.1),dhH(vWq*9.0+7.3))-.5)*.9);')};
 m.userData.lin=1;DH.mc=m;return m}
function dhMatTronco(){if(DH.mt)return DH.mt;const m=new THREE.MeshStandardMaterial({color:'#5a5046',roughness:.95});
 m.onBeforeCompile=s=>{s.vertexShader='varying vec3 vWt;\n'+s.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvWt=(modelMatrix*instanceMatrix*vec4(transformed,1.0)).xyz;');
  s.fragmentShader='varying vec3 vWt;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat gr=fract(sin(floor(vWt.y*9.0)*91.7+floor(atan(vWt.x,vWt.z)*6.0)*17.3)*4375.5);diffuseColor.rgb*=.62+.5*gr;')};
 DH.mt=m;return m}
/* ---------- berrocal: bolos de granito ---------- */
function dhBoloGeo(){const g0=new THREE.IcosahedronGeometry(1,2);g0.deleteAttribute('uv');g0.deleteAttribute('normal');let g=THREE.BufferGeometryUtils.mergeVertices(g0,1e-4);const p=g.attributes.position;const c=new Float32Array(p.count*3);
 const gr=new THREE.Color('#9a958a'),os=new THREE.Color('#6f6a60'),li=new THREE.Color('#b5ad6a'),t=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=1+(dhRuido(x*1.3,y*1.3,z*1.3)-.5)*.35;p.setXYZ(i,x*n*1.25,Math.max(y*n,-.35)*.78,z*n);
  t.copy(gr).lerp(os,clamp(.5-y,0,1)*.6).lerp(li,clamp((dhRuido(x*4,y*4,z*4)-.62)*3,0,.7));c.set([t.r,t.g,t.b],i*3)}
 g.setAttribute('color',new THREE.BufferAttribute(c,3));g.computeVertexNormals();return g}
/* ---------- sierra en el horizonte ---------- */
function dhSierra(sc,cielo){const N=256,R=470,pos=[],ind=[];const sky=new THREE.Color(cielo);const lejos=new THREE.Color('#7b8a9a').lerp(sky,.35),cerca=new THREE.Color('#6d7b6a').lerp(sky,.18);const cols=[];
 for(const [r,hm,hv,cc,off] of [[R,26,58,lejos,0],[R*.82,14,30,cerca,50]]){const b=pos.length/3;
  for(let i=0;i<=N;i++){const a=i/N*Math.PI*2;const h=hm+hv*Math.pow(f4Fbm(Math.cos(a)*3+off,Math.sin(a)*3-off),1.6);const x=Math.cos(a)*r,z=Math.sin(a)*r;
   pos.push(x,-6,z, x,h,z);const top=cc.clone().lerp(sky,.08),bot=cc.clone().lerp(sky,.55);cols.push(bot.r,bot.g,bot.b,top.r,top.g,top.b)}
  for(let i=0;i<N;i++){const a=b+i*2;ind.push(a,a+2,a+1,a+1,a+2,a+3)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));g.setIndex(ind);
 const m=new THREE.MeshBasicMaterial({vertexColors:true,fog:false,side:THREE.DoubleSide,depthWrite:false});m.userData.lin=1;const s=new THREE.Mesh(g,m);s.name='sierra';s.renderOrder=-1;s.frustumCulled=false;sc.add(s);return s}
/* ---------- sombra pintada bajo cada encina (casi gratis) ---------- */
function dhTexSombra(){if(DH.ts)return DH.ts;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,4,64,64,62);
 g.addColorStop(0,'rgba(0,0,0,.62)');g.addColorStop(.55,'rgba(0,0,0,.42)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);DH.ts=new THREE.CanvasTexture(c);return DH.ts}
function dhSombras(sc,tp){const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);const m=new THREE.MeshBasicMaterial({map:dhTexSombra(),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,color:'#1c1a12'});
 const im=new THREE.InstancedMesh(g,m,tp.length),o=new THREE.Object3D();
 // un poco desplazada hacia donde cae la luz del sol de tarde
 tp.forEach(([x,z,s],i)=>{const k=s*1.05,d=7.2*k;const sx=x+.9*k,sz=z+.6*k;o.position.set(sx,gH(sx,sz)+.06,sz);o.rotation.set(0,0,0);o.scale.set(d*1.1,1,d);o.updateMatrix();im.setMatrixAt(i,o.matrix)});
 im.frustumCulled=false;im.renderOrder=1;im.name='sombrasEncinas';sc.add(im)}
/* ---------- montaje en la finca ---------- */
function dhMontar(sc){const q=typeof txrQ==='function'?txrQ():'media';
 // 1) quitar los árboles simples y los de la librería genérica
 sc.traverse(o=>{if(!o.isInstancedMesh)return;const t=o.geometry.type;if((t==='CylinderGeometry'&&o.geometry.parameters.radiusTop===.28)||t==='IcosahedronGeometry')o.visible=false});
 const nat=sc.getObjectByName('natura');if(nat)nat.traverse(o=>{if(o.isInstancedMesh&&o.geometry&&o.material&&(/Leaves|Bark/.test(o.material.name||'')))o.visible=false});
 // 2) encinas en las mismas posiciones que tenía la finca
 const tp=[];const rt=mulberry(S.g.name.length*13+3);const blocked=(x,z)=>(x>-42&&x<40&&z>-48&&z<66)||Math.abs(x)<6&&z>10;
 while(tp.length<300){const x=(rt()-.5)*540,z=(rt()-.5)*540;if(blocked(x,z))continue;tp.push([x,z,.75+rt()*.7,rt()*6])}
 DH.copa=DH.copa||dhCopaGeo(q==='baja'?0:1);DH.tronco=DH.tronco||dhTroncoGeo();
 const ic=new THREE.InstancedMesh(DH.copa,dhMatCopa(),tp.length),it=new THREE.InstancedMesh(DH.tronco,dhMatTronco(),tp.length);
 const o=new THREE.Object3D(),cc=new THREE.Color();
 tp.forEach(([x,z,s,r],i)=>{const y=gH(x,z)-.1,k=s*1.05,ax=1+((i*37)%9-4)*.03;o.position.set(x,y,z);o.rotation.set(0,r,0);o.scale.set(k*ax,k*(.92+((i*53)%7)*.025),k/ax);o.updateMatrix();ic.setMatrixAt(i,o.matrix);it.setMatrixAt(i,o.matrix);
  cc.setHSL(.2+((i*13)%10)*.004,.18+((i*7)%10)*.012,.48+((i*29)%10)*.012);ic.setColorAt(i,cc)});
 // las mallas instanciadas se ven siempre (three r128 decidía con un solo árbol en el origen y el encinar desaparecía al mirar a otro lado)
 // y no proyectan sombra en tiempo real: 230.000 triángulos menos en el pase de sombras; debajo va una sombra pintada
 for(const m of [ic,it]){m.castShadow=false;m.receiveShadow=true;m.frustumCulled=false;m.name='encinas';m.userData.dh=1;sc.add(m)}
 dhSombras(sc,tp);
 // 3) berrocales: grupos de bolos de granito fuera de corrales y caminos
 const rb=mulberry(S.g.name.length*7+11),bl=[];let tries=0;
 while(bl.length<(q==='alta'?140:q==='media'?90:40)&&tries++<4000){const a=rb()*Math.PI*2,r=60+rb()*190,cx=Math.cos(a)*r,cz=10+Math.sin(a)*r;if(blocked(cx,cz))continue;
  const n=2+Math.floor(rb()*5);for(let j=0;j<n;j++){const x=cx+(rb()-.5)*7,z=cz+(rb()-.5)*7;if(blocked(x,z))continue;const s=.6+rb()*1.6*(j===0?1.4:1);bl.push([x,z,s,rb()*6.3])}}
 DH.bolo=DH.bolo||dhBoloGeo();const ib=new THREE.InstancedMesh(DH.bolo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,color:'#a8a398'}),bl.length);
 bl.forEach(([x,z,s,r],i)=>{o.position.set(x,gH(x,z)-s*.18,z);o.rotation.set((r-3)*.08,r,(r-3)*.05);o.scale.set(s,s*(.75+((i*17)%5)*.08),s*(.85+((i*11)%4)*.08));o.updateMatrix();ib.setMatrixAt(i,o.matrix)});
 ib.castShadow=q!=='baja';ib.receiveShadow=true;ib.frustumCulled=false;ib.name='berrocal';sc.add(ib);
 for(const [x,z,s] of bl)if(Math.hypot(x,z)<170&&s>1)(W3.col||[]).push({t:'circ',x,z,r:s*1.05});
 // suelo: pasto con más cuerpo y menos lavado
 sc.traverse(m=>{const g=m.geometry;if(m.isMesh&&g&&g.type==='PlaneGeometry'&&g.parameters.width===600&&!m.userData.dh){m.userData.dh=1;m.material.color.set(S.month>=5&&S.month<=9?'#d2c49c':'#b7c08f');m.material.roughness=1;m.material.needsUpdate=true}});
 // matas de pasto a juego con el suelo (antes casi blancas)
 if(typeof F4!=='undefined'&&F4.pasto&&F4.pasto.mat){const pm=F4.pasto.mat;pm.color.set(S.month>=5&&S.month<=9?'#b8a66e':'#7e8c4e');pm.emissive.copy(pm.color).multiplyScalar(.08)}
 if(nat)nat.traverse(o=>{if(o.isMesh&&o.material&&o.material.name==='Grass'){o.material.emissiveIntensity=.35;o.material.color.multiplyScalar(.8)}});
 // 4) sierra al fondo
 dhSierra(sc,'#'+sc.background.getHexString());
 // 5) luz de tarde de campo: sol más cálido y con más contraste
 if(W3.sun){W3.sun.intensity=1.45;W3.sun.color.set('#ffe8c4')}if(W3.hemi){W3.hemi.intensity=.6;W3.hemi.groundColor.set('#5a4a30')}
 // la niebla empieza más lejos: se ve la profundidad de la dehesa sin tapar la sierra
 if(sc.fog){sc.fog.near=110;sc.fog.far=330}}
/* las piezas pequeñas (arreos, botones, herrajes, adornos) no proyectan sombra: no se notan y cada una es otra llamada de dibujo en el pase de sombras */
function dhSombraPeq(sc){const s=new THREE.Vector3();sc.traverse(o=>{if(!o.isMesh||!o.castShadow||o.isInstancedMesh||o.userData.dhS)return;o.userData.dhS=1;const g=o.geometry;if(!g)return;if(!g.boundingSphere)g.computeBoundingSphere();if(!g.boundingSphere)return;
 o.getWorldScale(s);if(g.boundingSphere.radius*Math.max(s.x,s.y,s.z)<.13)o.castShadow=false})}
/* la caja de sombras del sol sigue al jugador a saltos de un píxel de su mapa: sin sombras que tiemblan al andar */
function dhSnapSol(){const s=W3.sun;if(!s||!s.castShadow||!s.shadow||!s.shadow.camera)return;const c=s.shadow.camera,tx=(c.right-c.left)/s.shadow.mapSize.x;if(!(tx>0))return;
 const d=DH.v1||(DH.v1=new THREE.Vector3()),m=DH.m1||(DH.m1=new THREE.Matrix4()),mi=DH.m2||(DH.m2=new THREE.Matrix4()),p=DH.v2||(DH.v2=new THREE.Vector3());
 d.copy(s.position).sub(s.target.position);const L=d.length();if(!(L>0))return;m.lookAt(d,DH.v0||(DH.v0=new THREE.Vector3()),DH.up||(DH.up=new THREE.Vector3(0,1,0)));mi.copy(m).invert();
 p.copy(s.target.position).applyMatrix4(mi);p.x=Math.round(p.x/tx)*tx;p.y=Math.round(p.y/tx)*tx;p.applyMatrix4(m);s.target.position.copy(p);s.position.copy(p).add(d);s.target.updateMatrixWorld()}
{const f=window.fincaTick;window.fincaTick=function(dt){const r=f.apply(this,arguments);try{dhSnapSol()}catch(e){}DH.tS=(DH.tS||0)+(dt||0);if(DH.tS>3&&W3.scene){DH.tS=0;try{dhSombraPeq(W3.scene)}catch(e){}}return r}}
const _rebuildDH=rebuildFinca;
rebuildFinca=function(){_rebuildDH.apply(this,arguments);if(W3.mode!=='finca'||!W3.scene)return;try{dhMontar(W3.scene)}catch(e){console.warn('dehesa',e)}try{dhSombraPeq(W3.scene)}catch(e){}};
