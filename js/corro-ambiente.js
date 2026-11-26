/* ===================== CORRO: NOCHE DE VERDAD Y FUEGO DEL BOU EMBOLAT =====================
   · De noche la plaza se iluminaba con la luz ambiental de un cielo de día (el HDRI de la ciudad) y parecía mediodía
     con el cielo azul oscuro: ahora de noche ese reflejo es mínimo y mandan la luna, los faroles y las bombillas.
   · Bou embolat: al encender las bolas se apaga casi del todo la calle (como en la realidad), la luz de las bolas es
     más fuerte y llega más lejos, parpadea, y las llamas y el humo son más grandes. Se usa el revelado HDR con
     resplandor, así las bolas y las bombillas brillan de verdad. */
const AMB={};
if(typeof crlEnvAjuste==='function'){const _eaA=crlEnvAjuste;crlEnvAjuste=function(sc){_eaA.apply(this,arguments);try{if(!(CL&&CL.night))return;
 sc.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms)if(m.isMeshStandardMaterial&&!m.userData.ambN){m.userData.ambN=1;m.envMapIntensity*=.14}})}catch(e){}}}
// de noche, el revelado HDR siempre (el resplandor es lo que hace creíble el fuego y los faroles)
if(typeof irCalle==='function'){const _icA=irCalle;irCalle=function(){const r=_icA.apply(this,arguments);try{if(CL&&CL.night&&typeof HW!=='undefined'&&typeof hwSoporta==='function'&&hwSoporta()&&W3.q!=='baja'){AMB.hw0=HW.on;HW.on=true;HW.bloom=true;AMB.hwSet=1}
  // luna y cielo: algo más fríos y tenues
  if(CL&&CL.night&&CL.sc)CL.sc.traverse(o=>{if(o.isDirectionalLight&&!o.userData.ambN){o.userData.ambN=1;o.intensity*=.8;o.color.set('#8fa6dc')}if(o.isHemisphereLight&&!o.userData.ambN){o.userData.ambN=1;o.intensity*=.85}})}catch(e){}return r}}
if(typeof salirCalle==='function'){const _scA=salirCalle;salirCalle=function(){try{if(AMB.hwSet&&typeof HW!=='undefined'){HW.on=AMB.hw0;AMB.hwSet=0}if(AMB.ex0!=null&&W3.R){W3.R.toneMappingExposure=AMB.ex0;AMB.ex0=null}}catch(e){}return _scA.apply(this,arguments)}}
/* bou embolat: oscuridad al encender y fuego más vivo */
if(typeof embTick==='function'){const _etA=embTick;embTick=function(r,dt){const out=_etA.apply(this,arguments);try{const e=CL&&CL.emb;if(!e)return out;
 if(!e.ambL){e.ambL=[];CL.sc.traverse(o=>{if(o.isDirectionalLight)e.ambL.push([o,o.intensity])})}
 const osc=e.ph==='foc'?Math.min(1,Math.max(0,(e.t-3.6)/2.2)):e.ph==='solta'||e.ph==='libre'?1:0;
 if(AMB.ex0==null&&W3.R)AMB.ex0=W3.R.toneMappingExposure;if(W3.R&&AMB.ex0!=null)W3.R.toneMappingExposure=AMB.ex0*(1-.32*osc);
 if(osc>0){for(const [o,i0] of e.lights||[])o.intensity=i0*(1-.9*osc);if(e.hemi)e.hemi[0].intensity=e.hemi[1]*(1-.62*osc);for(const [o,i0] of e.ambL)o.intensity=i0*(1-.55*osc)}
 const F=e.fireObj;if(F&&F.L){F.L.decay=1.5}}catch(x){}return out}}
// llamas y humo algo más grandes (las partículas nacen en fuegoTick; aquí se escalan al vuelo)
if(typeof fuegoTick==='function'){const _ftA=fuegoTick;fuegoTick=function(dt){_ftA(dt);try{const S2=FUEGO.sys;if(!S2)return;const f=1.35;
 for(const P of [S2.fl,S2.sm]){const sz=P.size;for(let i=0;i<P.n;i++)if(P.v[i].l>0)sz[i]*=f}
 // el parpadeo de la luz también tiñe un poco el brillo de las bolas
 for(const Fo of S2.objs)if(Fo.L&&Fo.lit&&CL&&CL.emb&&CL.emb.fireObj===Fo){Fo.L.intensity*=1.35;Fo.L.distance=15}}catch(e){}}}
/* ---------- plaza de día y de noche: cielo con degradado y sombra de contacto al pie de las fachadas ----------
   El cielo era un color plano; ahora va del azul intenso arriba al blanquecino del horizonte (de noche, del negro
   azulado al resplandor del pueblo). Al pie de cada casa, una franja de sombra suave en el suelo asienta los
   edificios (antes parecían flotar sobre la arena). */
const AMB_AO=[];
if(typeof pmxHouse==='function'){const _phA=pmxHouse;pmxHouse=function(G,MT,T,rnd,a0,a1,line,axis,face,style,tint,o){const r=_phA.apply(this,arguments);
 try{if(!(typeof vallEs==='function'&&vallEs()&&o&&o.plaza))AMB_AO.push([a0,a1,line,axis,face])}catch(e){}return r}}
function ambCielo(night){const k=night?'n':'d';AMB.sky=AMB.sky||{};if(AMB.sky[k])return AMB.sky[k];const c=document.createElement('canvas');c.width=4;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);
 if(night){g.addColorStop(0,'#03060f');g.addColorStop(.55,'#0b1430');g.addColorStop(.85,'#1d2a4e');g.addColorStop(1,'#3a3550')}else{g.addColorStop(0,'#3f74b8');g.addColorStop(.5,'#79a5d6');g.addColorStop(.85,'#bcd3e8');g.addColorStop(1,'#dfe7ee')}
 x.fillStyle=g;x.fillRect(0,0,4,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;AMB.sky[k]=t;return t}
function ambSombraTex(){if(AMB.aoT)return AMB.aoT;const c=document.createElement('canvas');c.width=4;c.height=64;const x=c.getContext('2d');for(let i=0;i<64;i++){const v=Math.pow(1-i/63,1.8);x.fillStyle=`rgb(${v*255|0},${v*255|0},${v*255|0})`;x.fillRect(0,i,4,1)}
 AMB.aoT=new THREE.CanvasTexture(c);return AMB.aoT}
if(typeof buildCalle==='function'){const _bcA=buildCalle;buildCalle=function(night){AMB_AO.length=0;const sc=_bcA.apply(this,arguments);try{if(!sc)return sc;
 sc.background=ambCielo(!!night);
 if(AMB_AO.length){const P=[],U=[],I=[];const W=1.25;for(const [a0,a1,line,axis,face] of AMB_AO){const b=P.length/3,y=.014;
   const q=axis==='x'?[[a0,line],[a1,line],[a1,line+face*W],[a0,line+face*W]]:[[line,a0],[line,a1],[line+face*W,a1],[line+face*W,a0]];
   for(const [x,z] of q)P.push(x,y,z);U.push(0,0,1,0,1,1,0,1);I.push(b,b+1,b+2,b,b+2,b+3)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);
  const m=new THREE.MeshBasicMaterial({color:'#000000',alphaMap:ambSombraTex(),transparent:true,opacity:night?.35:.5,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const ms=new THREE.Mesh(g,m);ms.renderOrder=1;ms.frustumCulled=false;ms.name='sombraFachadas';sc.add(ms)}}catch(e){console.warn('ambiente',e)}return sc}}
