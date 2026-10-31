/* ===================== GRÁFICOS: personajes más detallados, color de cine y cielo ===================== */
const GX={};
function gxGeos(){if(GX.g)return GX.g;const t=(g,dy)=>{g.translate(0,dy,0);return g};
 const torso=new THREE.LatheGeometry([[0,0],[.15,.0],[.17,.05],[.16,.16],[.15,.26],[.17,.38],[.2,.5],[.21,.56],[.18,.62],[.08,.66],[0,.66]].map(([x,y])=>new THREE.Vector2(x,y)),18);
 torso.scale(1,1,.68);
 const head=new THREE.SphereGeometry(1,24,18),hp=head.attributes.position;
 for(let i=0;i<hp.count;i++){let x=hp.getX(i),y=hp.getY(i),z=hp.getZ(i);const jaw=y<-.2?1-(-.2-y)*.55:1;x*=.86*jaw;z*=(z>0?1:.96)*(y<-.3?.92:1);if(y<-.55)y=-.55-(y+.55)*.6;if(z>.55&&Math.abs(x)<.25&&y>-.25&&y<.15)z+=.06;hp.setXYZ(i,x,y,z)}head.computeVertexNormals();
 GX.g={torso,head,uL:t(new THREE.CylinderGeometry(.088,.068,.48,12),-.24),lL:t(new THREE.CylinderGeometry(.064,.046,.44,12),-.22),uA:t(new THREE.CylinderGeometry(.058,.047,.31,10),-.155),lA:t(new THREE.CylinderGeometry(.047,.038,.29,10),-.145),
  shoe:new THREE.SphereGeometry(1,12,8),hand:new THREE.SphereGeometry(1,10,8),nose:new THREE.ConeGeometry(.022,.06,6),hair:new THREE.SphereGeometry(1,20,14,0,Math.PI*2,0,Math.PI*.55)};
 GX.g.nose.rotateX(Math.PI/2);return GX.g}
makePerson=function(st){
 const G=geos(),X=gxGeos(),root=new THREE.Group(),b=new THREE.Group();root.add(b);const tr=!!st.traje;
 const skinC=st.skin||pick(['#c79a74','#d2a682','#b88a64','#e0b896']),skin=M(skinC,.62),jk=tr?trajeMat(st.traje,st.plata):M(st.jacket||'#6a5a48',.78),pt=tr?trajeMat(st.traje,st.plata):M(st.pants||'#2a2a2a',.82),lg=tr?M('#eaa7b4',.55):M(st.legs||st.pants||'#2a2a2a',.82);
 const bt=M(st.boots||(tr?'#0d0a09':'#2a1d14'),.4),gold=M(st.plata?'#d5dadd':'#e6bb55',.3,.65),hairM=M(st.hair||pick(['#231812','#3b2a1c','#151010','#5a3c22']),.85);
 const legs=[],arms=[];
 mesh(G.sph,pt,.19,.13,.13,0,.95,0,b);
 for(const s of [1,-1]){const hip=new THREE.Group();hip.position.set(s*.105,.94,0);b.add(hip);const u=new THREE.Mesh(X.uL,pt);u.castShadow=true;hip.add(u);
  const kn=new THREE.Group();kn.position.y=-.48;hip.add(kn);mesh(G.sph,tr?gold:pt,.07,.07,.07,0,0,0,kn,true);
  const l=new THREE.Mesh(X.lL,lg);l.castShadow=true;kn.add(l);const sh=mesh(X.shoe,bt,.058,.05,.13,0,-.44,.045,kn);sh.castShadow=true;legs.push({hip,kn})}
 const tor=new THREE.Mesh(X.torso,jk);tor.position.y=.9;tor.castShadow=true;tor.receiveShadow=true;b.add(tor);
 if(tr){mesh(G.cyl,M(st.faja||'#8e1a24',.7),.175,.11,.125,0,1.0,0,b,true);mesh(G.box,M(st.shirt||'#f4f0e6',.7),.12,.22,.02,0,1.38,.135,b,true);mesh(G.box,M('#111',.6),.045,.09,.02,0,1.49,.14,b,true);
  for(const s of [1,-1]){mesh(G.sph,gold,.1,.065,.12,s*.22,1.53,0,b,true);mesh(G.box,gold,.012,.42,.012,s*.16,.72,.07,b,true)}}
 else{if(st.shirt)mesh(G.box,M(st.shirt,.7),.12,.22,.02,0,1.36,.135,b,true);mesh(G.cyl,M(st.belt||'#2a2420',.7),.165,.06,.12,0,.97,0,b,true)}
 mesh(G.cyl,skin,.052,.11,.05,0,1.6,0,b,true);
 const head=new THREE.Group();head.position.set(0,1.735,0);b.add(head);
 const hm=mesh(X.head,skin,.112,.14,.122,0,0,0,head);hm.castShadow=true;
 const hr=mesh(X.hair,hairM,.12,.15,.13,0,.012,-.01,head,true);hr.rotation.x=-.25;
 for(const s of [1,-1]){mesh(G.sph,M('#f4efe6',.3),.02,.014,.01,s*.042,.022,.112,head,true);mesh(G.sph,M('#2a1d14',.25),.009,.009,.006,s*.042,.022,.12,head,true);
  mesh(G.box,hairM,.034,.008,.01,s*.043,.048,.114,head,true).rotation.z=s*-.15;mesh(G.sph,skin,.018,.03,.014,s*.112,.0,0,head,true)}
 mesh(X.nose,M(skinC,.6),1,1,1,0,-.012,.13,head,true);mesh(G.box,M('#8a4a3e',.6),.036,.006,.006,0,-.06,.115,head,true);
 const hat=new THREE.Group();head.add(hat);
 if(st.hat==='campero'){mesh(G.cyl,M(st.hatc||'#3b2c22',.8),.34,.02,.34,0,.12,0,hat);mesh(G.cyl,M(st.hatc||'#3b2c22',.8),.14,.13,.14,0,.18,0,hat);mesh(G.cyl,M('#151010'),.142,.03,.142,0,.13,0,hat,true)}
 if(st.hat==='montera'){mesh(G.box,M('#111',.6),.3,.08,.16,0,.12,-.02,hat);for(const s of [1,-1])mesh(G.sph,M('#111',.6),.07,.07,.07,s*.14,.12,-.02,hat,true);mesh(G.sph,M('#111',.8),.035,.035,.03,0,.02,-.135,head,true)}
 if(st.hat==='castoreno'){mesh(G.cyl,M('#d8c08a',.7),.32,.02,.32,0,.12,0,hat);mesh(G.sph,M('#d8c08a',.7),.15,.12,.15,0,.16,0,hat)}
 if(st.hat==='chambergo'){mesh(G.cyl,M('#111',.7),.36,.02,.36,0,.12,0,hat);mesh(G.cyl,M('#111',.7),.14,.12,.14,0,.18,0,hat);mesh(G.sph,M('#c0303a',.7),.05,.16,.04,.1,.28,-.04,hat,true).rotation.z=-.5;mesh(G.sph,M('#f4f0e6',.7),.04,.13,.035,.14,.26,-.05,hat,true).rotation.z=-.7}
 if(st.panu){mesh(G.cyl,M(st.panu,.7),.075,.05,.075,0,1.6,0,b,true)}
 for(const s of [1,-1]){const sh=new THREE.Group();sh.position.set(s*.235,1.5,0);b.add(sh);mesh(G.sph,jk,.075,.07,.075,0,0,0,sh,true);const u=new THREE.Mesh(X.uA,jk);u.castShadow=true;sh.add(u);
  const el=new THREE.Group();el.position.y=-.31;sh.add(el);mesh(G.sph,jk,.05,.05,.05,0,0,0,el,true);const l=new THREE.Mesh(X.lA,st.mangas===false?skin:jk);l.castShadow=true;el.add(l);if(tr)mesh(G.cyl,gold,.05,.04,.05,0,-.26,0,el,true);
  mesh(X.hand,skin,.042,.06,.028,0,-.32,0,el,true);mesh(X.hand,skin,.014,.03,.014,s*-.03,-.3,.02,el,true);
  const hand=new THREE.Group();hand.position.y=-.32;el.add(hand);arms.push({sh,el,hand,s})}
 if(st.pole){const p=mesh(G.cyl,M('#a88b5a',.7),.025,st.pole,.025,0,-.1,0,arms[1].hand);p.rotation.x=st.pole>3.2?1.2:.25}
 if(st.paseo){const cp=mesh(G.box,trajeMat(st.paseo,false),.32,.8,.04,.2,1.18,.13,b,true);cp.rotation.z=.15}
 return {root,b,legs,arms,head,hat,ph:0}};

/* ---------- color de cine: sRGB + ACES, con conversión de materiales ---------- */
const GXC={on:true};
function gxLinMat(m){if(!m||m.userData.lin)return;m.userData.lin=1;if(m.color&&!m.isShaderMaterial)m.color.convertSRGBToLinear();if(m.emissive)m.emissive.convertSRGBToLinear();
 for(const k of ['map','emissiveMap'])if(m[k]&&m[k].encoding!==THREE.sRGBEncoding){m[k].encoding=THREE.sRGBEncoding;m[k].needsUpdate=true}if(m.map)m.needsUpdate=true}
function gxScene(sc){sc.traverse(o=>{const ge=o.geometry;if(ge&&ge.attributes&&ge.attributes.color&&!ge.userData.lin){ge.userData.lin=1;const a=ge.attributes.color.array,c=new THREE.Color(),k=ge.attributes.color.itemSize;for(let i=0;i<a.length;i+=k){c.setRGB(a[i],a[i+1],a[i+2]).convertSRGBToLinear();a[i]=c.r;a[i+1]=c.g;a[i+2]=c.b}ge.attributes.color.needsUpdate=true}
 if(o.material){if(Array.isArray(o.material))o.material.forEach(gxLinMat);else gxLinMat(o.material)}
  if(o.isInstancedMesh&&o.instanceColor&&!o.userData.linC){o.userData.linC=1;const a=o.instanceColor.array,c=new THREE.Color();for(let i=0;i<a.length;i+=3){c.setRGB(a[i],a[i+1],a[i+2]).convertSRGBToLinear();a[i]=c.r;a[i+1]=c.g;a[i+2]=c.b}o.instanceColor.needsUpdate=true}
  if(o.isLight&&o.color){const k=o.color.getHex()+'|'+(o.groundColor?o.groundColor.getHex():'');if(o.userData.lk!==k){o.color.convertSRGBToLinear();if(o.groundColor)o.groundColor.convertSRGBToLinear();o.userData.lk=o.color.getHex()+'|'+(o.groundColor?o.groundColor.getHex():'')}}})}
function gxCol(sc,key,col){if(!col||!col.isColor)return;const h=col.getHex();if(sc.userData[key]===h)return;col.convertSRGBToLinear();sc.userData[key]=col.getHex()}
function gxHook(){if(!W3.R||W3.R.__gx)return;const R3=W3.R;R3.__gx=1;R3.outputEncoding=THREE.sRGBEncoding;R3.toneMapping=THREE.ACESFilmicToneMapping;R3.toneMappingExposure=1.05;R3.physicallyCorrectLights=false;
 const rend=R3.render.bind(R3);let n=0;
 R3.render=function(sc,cam){if(sc){n++;if(sc!==GXC.last||n%45===0){gxScene(sc);GXC.last=sc}else if(n%6===0){sc.traverse(o=>{if(o.isLight&&o.color){const k=o.color.getHex()+'|'+(o.groundColor?o.groundColor.getHex():'');if(o.userData.lk!==k){o.color.convertSRGBToLinear();if(o.groundColor)o.groundColor.convertSRGBToLinear();o.userData.lk=o.color.getHex()+'|'+(o.groundColor?o.groundColor.getHex():'')}}})}
  gxCol(sc,'bgk',sc.background);if(sc.fog)gxCol(sc,'fgk',sc.fog.color);if(!sc.userData.dome&&!sc.children.some(c=>c.userData&&c.userData.dome)&&sc.background&&sc.background.isColor)gxDome(sc)}
  return rend(sc,cam)}}
function gxDome(sc){sc.userData.dome=1;const u={top:{value:new THREE.Color()},hor:{value:new THREE.Color()}};
 const dome=new THREE.Mesh(new THREE.SphereGeometry(400,24,12),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:u,
  vertexShader:'varying float h;void main(){h=normalize(position).y;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_Position.z=gl_Position.w*.9999;}',
  fragmentShader:'uniform vec3 top;uniform vec3 hor;varying float h;void main(){vec3 c=mix(hor,top,smoothstep(-.02,.5,h));c=mix(c,hor*1.06,smoothstep(.0,-.2,h));gl_FragColor=vec4(c,1.);}'}));
 dome.userData.dome=1;dome.frustumCulled=false;dome.renderOrder=-10;dome.onBeforeRender=()=>{const bg=sc.background;if(!bg||!bg.isColor)return;u.hor.value.copy(bg).multiplyScalar(1.12);u.top.value.copy(bg).lerp(new THREE.Color(.08,.22,.55),.55)};
 sc.add(dome)}
const _show3D=show3D;
show3D=function(){const r=_show3D();if(r&&GXC.on)gxHook();return r};
