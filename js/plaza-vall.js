/* ===================== LA VALL D'UIXÓ · PLAZA DE BOUS =====================
   Hecha a partir de fotos reales de los bous de la Vall: una explanada grande de arena, rodeada de cadafales
   de andamio de dos alturas pintados de colores (azul, rosa, verde, negro, rojo, naranja) con los carteles
   de las peñas; abajo la jaula de barrotes con la gente de pie y arriba el tablado con la barandilla.
   - En medio, el refugio amarillo: muretes en laberinto, escalones y una torreta con tejadillo.
   - Una escalera de madera de peldaños (también refugio) con armazón morado.
   - Farolas negras de dos faroles sobre los cadafales del fondo.
   - Detrás, los bloques de pisos de ladrillo de siete y ocho alturas y un edificio moderno de fachada gris oscura.
   La plaza es más grande que la genérica; los refugios siguen siendo los mismos para la res (círculo de
   refugio y rectángulos de cadafal), solo cambia su aspecto. */
const VALL={on:false,pueblo:"la vall d'uixó"};
if(typeof PMX_PLAZAS!=='undefined'&&PMX_PLAZAS.lavall)Object.assign(PMX_PLAZAS.lavall,{nom:"Plaza de bous de la Vall d'Uixó",recinto:true,osm:false,fondo:'recinto',centro:'escala',ref:'amarillo',campLejos:null,
 cad:[[.13,.32,.78],[.93,.42,.62],[.1,.48,.25],[.08,.08,.09],[.85,.14,.08],[.93,.45,.08],[.94,.94,.92],[.2,.55,.85]]});
if(typeof PP_DESC!=='undefined')PP_DESC.lavall='Explanada de arena entre cadafales de colores';
const vallEs=()=>{try{return PMX.PT&&PMX.PT.recinto}catch(e){return false}};
/* medidas: explanada de 44 × 30 m (la genérica es de 28 × 22) */
if(typeof ppMedidas==='function'){const _pmV=ppMedidas;ppMedidas=function(pu){const k=String(pu||'').toLowerCase().trim();VALL.on=k===VALL.pueblo||k==="vall d'uixó";return VALL.on?[22,15]:_pmV.apply(this,arguments)}}
if(typeof ppLayout==='function'){const _plV=ppLayout;ppLayout=function(W,D){const r=_plV.apply(this,arguments);if(VALL.on&&CLCIRC[0]){CLCIRC[0].r=3.3;if(CLCIRC[1])CLCIRC[1].r=1.9}return r}}
/* sin fachadas de casa alrededor de la arena: la explanada queda abierta y detrás van los bloques */
{const _phV=pmxHouse;pmxHouse=function(G,MT,T,rnd,a0,a1,line,axis,face,style,tint,o){if(vallEs()&&o&&o.plaza)return;return _phV.apply(this,arguments)}}

/* ---------- cadafal de andamio de dos alturas ---------- */
const VALL_PENYAS=['B.B.P.K.','ELS XICS','LA COLLA','EL DESCONTROL','PENYA EL BOU','ELS GAMBERROS','LA MARXA','ELS AMICS','LA TRONADA','ELS DEL RACÓ','PENYA L\'ESPARDENYA','LA FAMÍLIA'];
const VALL_BAN=[['#0d0d0f','#f2a51c'],['#1f6b3a','#ffffff'],['#ffffff','#1d3f8f'],['#c8102e','#ffffff'],['#f06aa0','#ffffff'],['#1d3f8f','#ffffff'],['#f2c200','#141414']];
{const _pcV=pmxCadafal;pmxCadafal=function(G,sc,f,s0,s1,dep,col,banner,awn,rnd){if(!vallEs())return _pcV.apply(this,arguments);
 // cartel de peña en casi todos y pocos toldos (como en las fotos)
 const ban=rnd()<.8?{t:VALL_PENYAS[(rnd()*VALL_PENYAS.length)|0],c:VALL_BAN[(rnd()*VALL_BAN.length)|0]}:null;_pcV.call(this,G,sc,f,s0,s1,dep,col,ban,rnd()<.18,rnd);
 const H=2.1,P=.08,top=H+2.6;
 // andamio: pies que suben por encima del tablado y travesaño alto (la estructura de tubo pintado)
 const n=Math.max(1,Math.round((s1-s0)/2));for(let i=0;i<=n;i++){const s=Math.min(s1-P/2,Math.max(s0+P/2,s0+(s1-s0)*i/n));f.box(G.paint,s-P/2,s+P/2,.05,.05+P,H,top,col)}
 f.box(G.paint,s0,s1,.05,.05+P,top-.08,top,col);f.box(G.paint,s0,s1,.05,.05+P,H+1.6,H+1.66,col);
 // cruces de San Andrés en la parte de atrás, bajo el tablado
 for(let i=0;i<n;i++){const a=s0+(s1-s0)*i/n,b=s0+(s1-s0)*(i+1)/n;for(const [y0,y1] of [[.15,H-.25]]){const p0=f.pt(a,.1),p1=f.pt(b,.1);const L=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);
  for(const sg of [1,-1]){const m=new THREE.Mesh(VALL.tubo||(VALL.tubo=new THREE.BoxGeometry(.05,1,.05)),VALL.mt||(VALL.mt=new THREE.MeshStandardMaterial({color:'#3a3d42',metalness:.6,roughness:.45})));
   const len=Math.hypot(L,y1-y0);m.scale.y=len;m.position.set((p0[0]+p1[0])/2,(y0+y1)/2,(p0[1]+p1[1])/2);m.rotation.order='YXZ';m.rotation.y=f.yaw()+Math.PI/2;m.rotation.z=sg*Math.atan2(L,y1-y0);sc.add(m)}}}
 // gente arriba también en la fila de atrás (de pie, mirando a la arena)
 const yaw=f.yaw();for(let s=s0+.4;s<s1-.3;s+=.7+rnd()*.4){if(rnd()<.55){const [x,z]=f.pt(s,.45+rnd()*.5);CL.crowd.push([x,H,z,yaw+(rnd()-.5)*.5,0])}}
 // farolas negras de dos faroles en lo alto (una cada ~9 m)
 VALL.fs=(VALL.fs||0)+(s1-s0);if(VALL.fs>9){VALL.fs=0;const [x,z]=f.pt((s0+s1)/2,.1);vallFarola(G,sc,x,top,z,yaw)}}}
function vallFarola(G,sc,x,y0,z,yaw){const ir=[.05,.05,.055],LAN=VALL.LAN;G.iron.box(x,y0+1.3,z,.1,2.6,.1,1,ir);G.iron.box(x,y0+.12,z,.2,.24,.2,1,ir);
 const ax=Math.cos(yaw),az=-Math.sin(yaw);for(const s of [-1,1]){const lx=x+ax*.42*s,lz=z+az*.42*s;G.iron.box(x+ax*.21*s,y0+2.55,z+az*.21*s,Math.abs(ax)>.5?.42:.05,.05,Math.abs(ax)>.5?.05:.42,1,ir);
  G.iron.box(lx,y0+2.35,lz,.26,.05,.26,1,ir);G.glow.box(lx,y0+2.18,lz,.2,.32,.2,1,[1,.85,.55]);G.iron.box(lx,y0+1.99,lz,.16,.05,.16,1,ir);G.iron.box(lx,y0+2.42,lz,.12,.1,.12,1,ir);if(LAN)LAN.push([lx,y0+2.18,lz,8])}
 G.iron.box(x,y0+2.68,z,.14,.14,.14,1,ir)}

/* ---------- refugio amarillo: laberinto de muretes, escalones y torreta ---------- */
{const _prV=pmxRefugio;pmxRefugio=function(G,c,LAN){if(!vallEs())return _prV.apply(this,arguments);VALL.LAN=LAN;
 const Y=[1,1,1],Yo=[.92,.86,.7],h=1.05,t=.22,X=c.x,Z=c.z,W=2.9,D=2.1;
 const muro=(x0,z0,x1,z1,hh=h)=>{const cx=(x0+x1)/2,cz=(z0+z1)/2,w=Math.max(t,Math.abs(x1-x0)),d=Math.max(t,Math.abs(z1-z0));G.yellow.box(X+cx,hh/2,Z+cz,w,hh,d,2,Y);G.yellow.box(X+cx,hh+.03,Z+cz,w+.06,.06,d+.06,2,Yo)};
 // contorno con cuatro pasos para la gente (chaflanes en las esquinas para no salirse del círculo de refugio)
 muro(-W+.6,-D,-.7,-D);muro(.7,-D,W-.6,-D);muro(-W+.6,D,-.7,D);muro(.7,D,W-.6,D);muro(-W,-D+.6,-W,-.6);muro(-W,.6,-W,D-.6);muro(W,-D+.6,W,-.6);muro(W,.6,W,D-.6);
 for(const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const a=[sx*(W-.6),sz*D],b=[sx*W,sz*(D-.6)];const p0=[X+a[0],Z+a[1]],p1=[X+b[0],Z+b[1]],nn=[sx*.7071,sz*.7071];
  G.yellow.wall([p0[0]+nn[0]*t/2,p0[1]+nn[1]*t/2],[p1[0]+nn[0]*t/2,p1[1]+nn[1]*t/2],0,h,2,2,Y,nn);G.yellow.wall([p1[0]-nn[0]*t/2,p1[1]-nn[1]*t/2],[p0[0]-nn[0]*t/2,p0[1]-nn[1]*t/2],0,h,2,2,Y,[-nn[0],-nn[1]])}
 // muretes interiores en L (el laberinto) y dos cuerpos de escalones
 muro(-1.6,-1.1,-1.6,.4);muro(-1.6,-1.1,-.6,-1.1);muro(1.6,1.1,1.6,-.4);muro(1.6,1.1,.6,1.1);
 for(let i=0;i<4;i++){const y=(i+1)*.22;G.yellow.box(X-.3,y/2,Z+1.2-i*.28,1.6,y,.3,2,i%2?Yo:Y)}
 for(let i=0;i<3;i++){const y=(i+1)*.26;G.yellow.box(X+.6-i*.3,y/2,Z-1.3,.32,y,1.1,2,i%2?Yo:Y)}
 // plataforma y torreta central con tejadillo a cuatro aguas
 G.yellow.box(X,.42,Z,1.6,.84,1.6,2,Y);G.yellow.box(X,.87,Z,1.72,.06,1.72,2,Yo);const T0=.84,TH=2.5;G.yellow.box(X,T0+TH/2,Z,.95,TH,.95,2,Y);
 for(const [dx,dz] of [[0,.48],[0,-.48],[.48,0],[-.48,0]])G.paint.box(X+dx,T0+1.5,Z+dz,Math.abs(dx)?.02:.42,.6,Math.abs(dz)?.02:.42,1,[.75,.52,.1]);
 G.yellow.box(X,T0+TH+.06,Z,1.18,.12,1.18,2,Yo);const roof=new THREE.Mesh(new THREE.ConeGeometry(.86,.75,4),new THREE.MeshStandardMaterial({color:'#d9a92a',roughness:.65}));roof.position.set(X,T0+TH+.5,Z);roof.rotation.y=Math.PI/4;roof.castShadow=true;VALL.sc&&VALL.sc.add(roof);
 const bola=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),new THREE.MeshStandardMaterial({color:'#d9a92a',roughness:.5}));bola.position.set(X,T0+TH+.92,Z);VALL.sc&&VALL.sc.add(bola);
 // la gente dentro del refugio: unos de pie en los escalones, otros con cubos de agua
 for(let i=0;i<10;i++){const a=R(0,6.28),d=R(.9,2.3);CL.crowd.push([X+Math.sin(a)*d*1.25,0,Z+Math.cos(a)*d*.85,a+Math.PI,0])}
 for(let i=0;i<4;i++){const a=i*1.6+.4,bx=X+Math.sin(a)*2.2,bz=Z+Math.cos(a)*1.5;G.paint.box(bx,.14,bz,.26,.28,.26,1,[.96,.96,.95]);G.paint.box(bx,.29,bz,.28,.03,.28,1,[.2,.45,.8])}}}

/* ---------- escalera de madera de peldaños con armazón morado (en lugar de la fuente) ---------- */
{const _pfV=pmxFuente;pmxFuente=function(sc,G,c,MT,T){if(!vallEs())return _pfV.apply(this,arguments);const X=c.x,Z=c.z,n=6,H=2.3,L=2.8,Wd=2.6,pur=[.42,.2,.52];
 for(let i=0;i<n;i++){const y=H*(i+1)/n,len=L*(n-i)/n;G.wood.box(X,y-.06,Z+(L-len)/2-L/2+len/2,Wd,.12,len,1.5,[.92,.85,.74]);
  // contrahuella blanca con el patrocinio, como en la foto
  const zf=Z-L/2+(L-len);G.paint.box(X,y-H/n/2-.03,zf+.03,Wd-.05,H/n-.1,.04,1,[.95,.95,.94]);G.paint.box(X,y-H/n/2-.03,zf+.06,Wd*.55,.05,.02,1,[.55,.25,.6])}
 for(const s of [-1,1]){const x=X+s*(Wd/2+.05);for(const [za,ya,zb,yb] of [[Z-L/2,0,Z+L/2,H],[Z+L/2,0,Z+L/2,H]]){const m=new THREE.Mesh(new THREE.BoxGeometry(.08,1,.08),new THREE.MeshStandardMaterial({color:'#6a3480',roughness:.5,metalness:.3}));
   const len=Math.hypot(zb-za,yb-ya);m.scale.y=len;m.position.set(x,(ya+yb)/2,(za+zb)/2);m.rotation.x=-Math.atan2(zb-za,yb-ya);m.castShadow=true;sc.add(m)}
  G.paint.box(x,H/2,Z+L/2-.04,.08,H,.08,1,pur);G.paint.box(x,.06,Z,.08,.12,L,1,pur)}
 G.paint.box(X,H/2,Z+L/2,Wd,.08,.08,1,pur);
 const tx=textPanelPmx('FESTES · LA VALL','#ffffff','#5a2a6e');for(const s of [-1,1]){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.26),new THREE.MeshStandardMaterial({map:tx,roughness:.6}));m.position.set(X+s*(Wd/2+.1),H*.38,Z);m.rotation.y=s*Math.PI/2;m.rotation.z=s*Math.atan2(H,L)*-1;sc.add(m)}
 for(let i=0;i<5;i++){const k=Math.floor(R(1,n)),y=H*k/n;CL.crowd.push([X+R(-1,1),y,Z-L/2+L*k/n-.2,Math.PI,0])}}}

/* ---------- bloques de pisos y edificio moderno detrás de los cadafales ---------- */
function vallBloque(G,x0,z0,x1,z1,pisos,o){const nx=o.nx,nz=o.nz,alto=pisos*2.95+.6,cx=(x0+x1)/2,cz=(z0+z1)/2,w=x1-x0,d=z1-z0;
 const lad=o.col||[.64,.36,.24],blanco=[.93,.92,.88],vid=[.16,.19,.24];G.paint.box(cx,alto/2,cz,w,alto,d,1,lad);G.paint.box(cx,alto+.25,cz,w+.2,.5,d+.2,1,[.78,.74,.68]);
 // fachada que mira a la plaza: punto de partida, dirección a lo largo y longitud
 const fz=nz!==0,len=fz?w:d,fx0=fz?x0:cx+nx*w/2,fzz0=fz?cz+nz*d/2:z0,ux=fz?1:0,uz=fz?0:1;const at=(s,t)=>[fx0+ux*s+nx*t,fzz0+uz*s+nz*t];
 const bx=(s,t,y,a,h,e,c)=>{const [px,pz]=at(s,t);G.paint.box(px,y,pz,fz?a:e,h,fz?e:a,1,c)},bv=(s,t,y,a,h,e,c)=>{const [px,pz]=at(s,t);G.iron.box(px,y,pz,fz?a:e,h,fz?e:a,1,c)};
 for(let s=1.6;s<len-1;s+=3.2)bv(s,.04,1.5,2.6,2.6,.06,vid);
 const paso=o.paso||3.4;for(let p=1;p<pisos;p++){const y=p*2.95+.6;bx(len/2,.06,y,len,.16,.12,blanco);
  for(let s=1.7,k=0;s<len-1;s+=paso,k++){bv(s,.05,y+1.35,1.3,1.5,.06,vid);bx(s,.07,y+.62,1.5,.1,.08,blanco);
   if(o.balc&&k%2===0){bx(s,.55,y+.08,2.1,.12,1.1,blanco);bx(s,1.08,y+.6,2.1,.9,.05,blanco);for(const e of [-1,1])bx(s+e*1.03,.55,y+.6,.05,.9,1.05,blanco)}}}}
function vallModerno(G,sc,x0,z0,x1,z1,alto,nx,nz){const cx=(x0+x1)/2,cz=(z0+z1)/2,w=x1-x0,d=z1-z0,gr=[.4,.41,.44],gr2=[.58,.59,.62];
 G.paint.box(cx,alto/2,cz,w,alto,d,1,gr);const fz=nz!==0,len=fz?w:d,fx0=fz?x0:cx+nx*w/2,fzz0=fz?cz+nz*d/2:z0;
 for(let s=.6,k=0;s<len-.4;s+=1.1,k++){const px=fz?fx0+s:fx0+nx*.18,pz=fz?fzz0+nz*.18:fzz0+s;G.paint.box(px,alto/2+1.5,pz,fz?.18:.36,alto-3,fz?.36:.18,1,k%2?gr2:gr)}
 G.iron.box(fz?cx:fx0+nx*.05,1.5,fz?fzz0+nz*.05:cz,fz?w-1:.06,2.8,fz?.06:d-1,1,[.12,.14,.17]);G.paint.box(cx,alto+.2,cz,w+.3,.4,d+.3,1,[.2,.2,.22])}
{const _hiV=typeof pmxHitos==='function'?pmxHitos:null;pmxHitos=function(sc,G,PT,LAN){if(!(PT&&PT.recinto))return _hiV&&_hiV.apply(this,arguments);VALL.sc=sc;VALL.LAN=LAN;VALL.fs=0;
 const W_=CLRECT.plz.x1,D_=CLRECT.plz.z1,b=D_+9;
 // fondo: el bloque de ladrillo de ocho alturas y, a su lado, el edificio moderno gris
 vallBloque(G,-W_-6,-b-12,-4,-b,8,{nx:0,nz:1,balc:true,paso:3.4});vallModerno(G,sc,2,-b-14,W_+8,-b,15,0,1);
 // frente (a los lados de la calle del cajón) y laterales (a los lados de las bocas)
 vallBloque(G,-W_-6,b,-6,b+11,7,{nx:0,nz:-1,balc:true,col:[.8,.66,.5]});vallBloque(G,6,b,W_+6,b+11,6,{nx:0,nz:-1,balc:true,col:[.7,.45,.32]});
 for(const s of [-1,1]){const x=s*(W_+8);vallBloque(G,x-(s>0?0:10)*1,-D_-4,x+(s>0?10:0),-7,7,{nx:-s,nz:0,balc:true,col:s>0?[.66,.4,.28]:[.82,.72,.58]});vallBloque(G,x-(s>0?0:10),7,x+(s>0?10:0),D_+4,6,{nx:-s,nz:0,balc:true,col:s>0?[.86,.8,.7]:[.62,.36,.24]})}
 if(_hiV)try{_hiV.call(this,sc,G,Object.assign({},PT,{camp:null,campLejos:null,castell:null,palau:null,torreMed:null}),LAN)}catch(e){}}}
/* arena de playa, más clara, con manchas mojadas de los cubos de agua */
if(typeof buildCalle==='function'){const _bcV=buildCalle;buildCalle=function(){VALL.fs=0;const sc=_bcV.apply(this,arguments);try{if(vallEs()&&sc){const T=PMX.T;sc.traverse(o=>{if(o.isMesh&&o.material&&T&&T.sand&&o.material.map===T.sand.map&&!o.userData.vall){o.userData.vall=1;
  o.material=o.material.clone();o.material.color=new THREE.Color(1.16,1.08,.94);const g=o.geometry,p=g.attributes.position,c=g.attributes.color;if(c){for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);const w=Math.sin(x*.31+z*.17)*Math.cos(z*.23-x*.11)+Math.sin(x*.07)*.5;if(w>.75){const k=.72;c.setXYZ(i,c.getX(i)*k,c.getY(i)*k*.98,c.getZ(i)*k*.95)}}c.needsUpdate=true}}})}}catch(e){console.warn('arena vall',e)}return sc}}
