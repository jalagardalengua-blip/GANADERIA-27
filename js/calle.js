/* ===================== BOUS AL CARRER · CALLE 3D =====================
   Pueblo valenciano con plaza, iglesia, cadafales, calles estrechas, barreras y cajón.
   Tú eres un recortador más: citas, quiebras, recortas, saltas y pones anillas. */
let CL=null;
const CLRECT={plz:{x0:-14,x1:14,z0:-11,z1:11},e:{x0:14,x1:62,z0:-4,z1:4},w:{x0:-62,x1:-14,z0:-4,z1:4},n:{x0:-3.5,x1:3.5,z0:11,z1:42}};
const CLREF=[{x0:-13.8,x1:-4.6,z0:7.6,z1:10.9,cad:1},{x0:4.6,x1:13.8,z0:7.6,z1:10.9,cad:1},{x0:10.6,x1:13.9,z0:-10.9,z1:-4.8,cad:1},{x0:-13.9,x1:-10.6,z0:-10.9,z1:-4.8,cad:1},
 {x0:28,x1:31.5,z0:2.9,z1:4,cad:0},{x0:44,x1:47.5,z0:-4,z1:-2.9,cad:0},{x0:-31.5,x1:-28,z0:-4,z1:-2.9,cad:0},{x0:-47.5,x1:-44,z0:2.9,z1:4,cad:0},{x0:-3.5,x1:-2.4,z0:22,z1:25.5,cad:0},{x0:2.4,x1:3.5,z0:30,z1:33.5,cad:0},
 {x0:58.5,x1:62,z0:-4,z1:4,bar:1},{x0:-62,x1:-58.5,z0:-4,z1:4,bar:1}];
const CLCIRC=[{x:-9,z:2.6,r:1.9},{x:9,z:-2.6,r:1.9}];
const inRc=(r,x,z,m=0)=>x>r.x0-m&&x<r.x1+m&&z>r.z0-m&&z<r.z1+m;
const FACOL=['#efe7d6','#e9d3a8','#f2e3c8','#e7c9a0','#dfe6e8','#f0d9c6','#e8e0cf','#d9c09a','#f4efe4','#cfd9c8'];
const PERS=['#2e6b45','#6b4a2a','#7a1d22','#2f4f6b','#d9d2c2','#3a3a3a'];
const TXC={};
function facadeTex(col,fl,nw,seed){const k=[col,fl,nw,seed%4].join('|');if(TXC[k])return TXC[k];
 const W=128*nw,H=170*fl+60,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d'),r=mulberry(seed*13+fl);
 c.fillStyle=col;c.fillRect(0,0,W,H);for(let i=0;i<W*H/60;i++){c.fillStyle=`rgba(${r()<.5?'90,70,50':'255,255,255'},${r()*.06})`;c.fillRect(r()*W,r()*H,2+r()*5,1+r()*3)}
 const gr=c.createLinearGradient(0,H-90,0,H);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(60,45,30,.22)');c.fillStyle=gr;c.fillRect(0,H-90,W,90);
 const zoc=seed%3===0?'#7d8c94':seed%3===1?'#9a8a74':'#5f7a8c';c.fillStyle=zoc;c.fillRect(0,H-38,W,38);if(seed%3===0){c.strokeStyle='rgba(255,255,255,.35)';for(let x=0;x<W;x+=12)for(let y=H-38;y<H;y+=12)c.strokeRect(x,y,12,12)}
 c.fillStyle='rgba(0,0,0,.28)';c.fillRect(0,0,W,10);c.fillStyle=shade(col,-.12);c.fillRect(0,10,W,8);
 const pers=PERS[seed%PERS.length];
 for(let f=0;f<fl;f++){const y0=30+f*170;
  for(let i=0;i<nw;i++){const cx=i*128+64;
   if(f===fl-1){if(i===Math.floor(nw/2)||(nw>2&&i===0&&seed%2)){c.fillStyle='#4a2c1a';c.beginPath();c.moveTo(cx-34,H);c.lineTo(cx-34,y0+40);c.arc(cx,y0+40,34,Math.PI,0);c.lineTo(cx+34,H);c.fill();c.strokeStyle='#2a180e';c.lineWidth=3;c.beginPath();c.moveTo(cx,y0+8);c.lineTo(cx,H);c.stroke();
     c.fillStyle='rgba(255,255,255,.15)';for(let j=0;j<6;j++)c.fillRect(cx-30,y0+60+j*16,60,2);c.fillStyle='#c9a24a';c.beginPath();c.arc(cx+20,y0+100,3,0,7);c.fill()}
    else{c.fillStyle='#f6f1e6';c.fillRect(cx-30,y0+26,60,84);c.fillStyle='#1a1c22';c.fillRect(cx-25,y0+31,50,74);c.strokeStyle='#1b1b1b';c.lineWidth=3;for(let x=cx-20;x<=cx+20;x+=8){c.beginPath();c.moveTo(x,y0+28);c.lineTo(x,y0+108);c.stroke()}c.beginPath();c.moveTo(cx-28,y0+60);c.lineTo(cx+28,y0+60);c.stroke()}}
   else{c.fillStyle='#f6f1e6';c.fillRect(cx-32,y0+2,64,144);c.fillStyle='#14161b';c.fillRect(cx-27,y0+8,54,136);
    const op=r();c.fillStyle=pers;if(op<.45){c.fillRect(cx-27,y0+8,54,136*(.35+r()*.4))}else{c.fillRect(cx-27,y0+8,22,136);c.fillRect(cx+5,y0+8,22,136)}
    c.fillStyle='rgba(0,0,0,.25)';for(let y=y0+12;y<y0+140;y+=7)c.fillRect(cx-27,y,54,1);
    if(r()<.35){c.fillStyle='rgba(255,215,140,.0)'}}}}
 const t=new THREE.CanvasTexture(cv);t.anisotropy=4;TXC[k]=t;return t}
function railTex(){if(TXC.rail)return TXC.rail;const cv=document.createElement('canvas');cv.width=128;cv.height=64;const c=cv.getContext('2d');c.strokeStyle='#15161a';c.lineWidth=5;c.strokeRect(3,3,122,58);c.lineWidth=3;for(let x=12;x<128;x+=12){c.beginPath();c.moveTo(x,4);c.lineTo(x,60);c.stroke()}
 c.lineWidth=2;for(let x=18;x<128;x+=24){c.beginPath();c.arc(x,32,6,0,7);c.stroke()}const t=new THREE.CanvasTexture(cv);TXC.rail=t;return t}
function groundTex(sand){const k=sand?'gs':'ga';if(TXC[k])return TXC[k];const cv=document.createElement('canvas');cv.width=cv.height=512;const c=cv.getContext('2d'),r=mulberry(sand?5:9);
 c.fillStyle=sand?'#b99a6c':'#55565a';c.fillRect(0,0,512,512);for(let i=0;i<26000;i++){c.fillStyle=`rgba(${r()<.5?(sand?'120,90,55':'30,30,32'):(sand?'230,205,160':'120,120,125')},${r()*.25})`;c.fillRect(r()*512,r()*512,1+r()*2,1+r()*2)}
 if(!sand){c.fillStyle='rgba(185,154,108,.22)';for(let i=0;i<160;i++){c.beginPath();c.ellipse(r()*512,r()*512,4+r()*14,2+r()*8,r()*3,0,7);c.fill()}c.strokeStyle='rgba(20,20,22,.35)';c.lineWidth=2;for(let i=0;i<14;i++){c.beginPath();let x=r()*512,y=r()*512;c.moveTo(x,y);for(let j=0;j<5;j++){x+=R(-30,30);y+=R(-30,30);c.lineTo(x,y)}c.stroke()}}
 const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;TXC[k]=t;return t}
function stoneTex(){if(TXC.st)return TXC.st;const cv=document.createElement('canvas');cv.width=512;cv.height=1024;const c=cv.getContext('2d'),r=mulberry(77);c.fillStyle='#cdb892';c.fillRect(0,0,512,1024);
 for(let y=0;y<1024;y+=28){const o=(y/28)%2*30;for(let x=-o;x<512;x+=60){c.fillStyle=`rgba(${120+r()*50},${100+r()*40},${70+r()*30},.35)`;c.fillRect(x+2,y+2,56,24)}}
 c.fillStyle='#3a2a1c';c.beginPath();c.moveTo(196,1024);c.lineTo(196,760);c.arc(256,760,60,Math.PI,0);c.lineTo(316,1024);c.fill();c.strokeStyle='#9c845e';c.lineWidth=14;c.beginPath();c.arc(256,760,76,Math.PI,0);c.stroke();
 c.fillStyle='#2a2f44';c.beginPath();c.arc(256,470,58,0,7);c.fill();c.strokeStyle='#e2c58a';c.lineWidth=4;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;c.beginPath();c.moveTo(256,470);c.lineTo(256+Math.cos(a)*56,470+Math.sin(a)*56);c.stroke()}c.beginPath();c.arc(256,470,58,0,7);c.stroke();
 c.fillStyle='#9c845e';c.fillRect(150,300,212,10);const t=new THREE.CanvasTexture(cv);TXC.st=t;return t}

function buildCalle(night){
 const sc=new THREE.Scene(),G=geos();const sky=night?'#0e1630':'#a9cbe6';sc.background=new THREE.Color(sky);sc.fog=new THREE.Fog(sky,night?40:70,night?140:220);
 const hemi=new THREE.HemisphereLight(night?'#5a6a9a':'#e8f1fa',night?'#2a1e14':'#8a6a48',night?.38:.72);sc.add(hemi);
 const sun=new THREE.DirectionalLight(night?'#9fb4e8':'#fff0d6',night?.35:1.25);sun.position.set(night?-30:38,60,night?20:26);sun.castShadow=true;sun.shadow.mapSize.set(W3.q==='alta'?2048:1024,W3.q==='alta'?2048:1024);
 Object.assign(sun.shadow.camera,{left:-70,right:70,top:50,bottom:-50,near:1,far:200});sun.shadow.bias=-.0006;sc.add(sun);sc.add(sun.target);
 if(night){const st=new THREE.BufferGeometry(),p=[],r=mulberry(3);for(let i=0;i<700;i++){const a=r()*6.28,e=.15+r()*1.3,R2=180;p.push(Math.cos(a)*Math.cos(e)*R2,Math.sin(e)*R2,Math.sin(a)*Math.cos(e)*R2)}st.setAttribute('position',new THREE.Float32BufferAttribute(p,3));sc.add(new THREE.Points(st,new THREE.PointsMaterial({color:'#ffffff',size:.9,sizeAttenuation:false})))}
 else{const dome=new THREE.Mesh(new THREE.SphereGeometry(240,24,12),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{},vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float h;void main(){vec3 a=vec3(.93,.95,.96),b=vec3(.36,.6,.86);gl_FragColor=vec4(mix(a,b,smoothstep(-.05,.55,h)),1.);}'}));dome.userData.dome=1;sc.add(dome)}
 const ga=groundTex(false);ga.repeat.set(28,17);const gnd=new THREE.Mesh(new THREE.PlaneGeometry(200,120),new THREE.MeshStandardMaterial({map:ga,roughness:.95}));gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;sc.add(gnd);
 const gs=groundTex(true);gs.repeat.set(4,3);const ar=new THREE.Mesh(new THREE.PlaneGeometry(28,22),new THREE.MeshStandardMaterial({map:gs,roughness:1}));ar.rotation.x=-Math.PI/2;ar.position.y=.02;ar.receiveShadow=true;sc.add(ar);
 const curb=M('#a7a49c',.9);for(const s of [-1,1]){mesh(G.box,curb,48,.14,.5,38,.07,s*3.75,sc,true);mesh(G.box,curb,48,.14,.5,-38,.07,s*3.75,sc,true);mesh(G.box,curb,.5,.14,31,s*3.25,.07,26.5,sc,true)}
 const r=mulberry(night?21:12);let hs=0;
 const house=(x0,x1,line,axis,face)=>{let p=x0;while(p<x1-1){let w=Math.min(x1-p,R(5,8.5));if(x1-p-w<3)w=x1-p;const fl=RI(2,3),h=fl*3.2+.6,col=FACOL[Math.floor(r()*FACOL.length)],nw=Math.max(1,Math.round(w/2.6)),seed=hs++;
  const tex=facadeTex(col,fl,nw,seed),wm=M(col,.92),fm=new THREE.MeshStandardMaterial({map:tex,roughness:.88});const d=7;
  const mats=axis==='x'?[wm,wm,M('#8f4a2e',.9),wm,face>0?fm:wm,face<0?fm:wm]:[face>0?fm:wm,face<0?fm:wm,M('#8f4a2e',.9),wm,wm,wm];
  const cx=p+w/2,b=new THREE.Mesh(G.box,mats);if(axis==='x'){b.scale.set(w,h,d);b.position.set(cx,h/2,line-face*d/2)}else{b.scale.set(d,h,w);b.position.set(line-face*d/2,h/2,cx)}b.castShadow=true;b.receiveShadow=true;sc.add(b);
  const ev=mesh(G.box,M('#9b4a2a',.85),axis==='x'?w+.2:.7,.25,axis==='x'?.7:w+.2,axis==='x'?cx:line+face*.15,h+.05,axis==='x'?line+face*.15:cx,sc);
  for(let f=1;f<fl;f++)for(let i=0;i<nw;i++){if(r()<.3)continue;const u=p+(i+.5)*w/nw,y=.6+f*3.2;
   const bx=axis==='x'?[u,y,line+face*.42]:[line+face*.42,y,u];mesh(G.box,M('#d8d2c6',.8),axis==='x'?1.6:.85,.12,axis==='x'?.85:1.6,bx[0],bx[1],bx[2],sc);
   const rl=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.9),new THREE.MeshStandardMaterial({map:railTex(),transparent:true,alphaTest:.4,side:THREE.DoubleSide,roughness:.5,metalness:.4}));
   if(axis==='x')rl.position.set(u,y+.5,line+face*.84);else{rl.position.set(line+face*.84,y+.5,u);rl.rotation.y=Math.PI/2}sc.add(rl);
   if(r()<.55)CL.balc.push([bx[0]+(axis==='x'?R(-.4,.4):face*.2),y+.1,bx[2]+(axis==='x'?face*.2:R(-.4,.4)),axis==='x'?(face>0?0:Math.PI):(face>0?Math.PI/2:-Math.PI/2)]);
   if(r()<.12){const fg=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.3,4,4),new THREE.MeshStandardMaterial({map:senyera(),side:THREE.DoubleSide,roughness:.8}));if(axis==='x')fg.position.set(u,y-.2,line+face*.86);else{fg.position.set(line+face*.86,y-.2,u);fg.rotation.y=Math.PI/2}sc.add(fg)}}
  if(r()<.5){const lx=axis==='x'?[p+.4,3.6,line+face*.35]:[line+face*.35,3.6,p+.4];const lp=mesh(G.cyl,M('#1b1b1b',.5,.5),.07,.5,.07,lx[0],lx[1],lx[2],sc,true);const gl=mesh(G.sph,new THREE.MeshStandardMaterial({color:'#fff1c8',emissive:night?'#ffcf7a':'#000000',emissiveIntensity:night?1.6:0}),.17,.2,.17,lx[0],lx[1]-.3,lx[2],sc,true);CL.lamps.push(gl.position.clone())}
  p+=w}};
 CL.balc=[];CL.lamps=[];
 house(-14,-3.5,11,'x',-1);house(3.5,14,11,'x',-1);house(-14,-8,-11,'x',1);house(8,14,-11,'x',1);house(-11,-4,14,'z',-1);house(4,11,14,'z',-1);house(-11,-4,-14,'z',1);house(4,11,-14,'z',1);
 house(14,64,4,'x',-1);house(14,64,-4,'x',1);house(-64,-14,4,'x',-1);house(-64,-14,-4,'x',1);house(11,46,3.5,'z',-1);house(11,46,-3.5,'z',1);
 house(-4,4,66,'z',-1);house(-4,4,-66,'z',1);
 const ch=new THREE.Group();ch.position.set(0,0,-11);sc.add(ch);const stx=stoneTex();
 const cf=new THREE.Mesh(G.box,[M('#cdb892'),M('#cdb892'),M('#9b4a2a'),M('#cdb892'),new THREE.MeshStandardMaterial({map:stx,roughness:.9}),M('#cdb892')]);cf.scale.set(16,13,10);cf.position.set(0,6.5,-5);cf.castShadow=true;cf.receiveShadow=true;ch.add(cf);
 const tw=mesh(G.box,M('#c6b08a',.9),4.2,24,4.2,-6,12,-3,ch);const bel=mesh(G.box,M('#1d1a16'),4.3,2.4,1.6,-6,20.5,-3,ch,true);mesh(G.box,M('#1d1a16'),1.6,2.4,4.3,-6,20.5,-3,ch,true);
 const pyr=new THREE.Mesh(new THREE.ConeGeometry(3.2,4.5,4),M('#6a8fb0',.4,.3));pyr.position.set(-6,26.2,-3);pyr.rotation.y=Math.PI/4;pyr.castShadow=true;ch.add(pyr);
 mesh(G.cyl,M('#f2ead8'),.9,.1,.9,-6,17,-.86,ch,true).rotation.x=Math.PI/2;for(let i=0;i<3;i++)mesh(G.box,M('#bfb39c',.9),9-i*1.2,.22,1.1,0,.11+i*.22,.55-i*.4,ch);
 const cadM=M('#8b6a45',.85),cadD=M('#5d4128',.9);
 for(const rf of CLREF.filter(q=>q.cad)){const w=rf.x1-rf.x0,d=rf.z1-rf.z0,cx=(rf.x0+rf.x1)/2,cz=(rf.z0+rf.z1)/2,H=2.1;
  mesh(G.box,cadM,w,.14,d,cx,H,cz,sc);const front=w>d?(cz>0?rf.z0:rf.z1):(cx>0?rf.x0:rf.x1);
  const nP=Math.max(2,Math.round((w>d?w:d)/1.3));for(let i=0;i<=nP;i++){const t=i/nP;for(const dd of [0,1]){const px=w>d?rf.x0+t*w:(dd?rf.x0+.1:rf.x1-.1),pz=w>d?(dd?rf.z0+.1:rf.z1-.1):rf.z0+t*d;mesh(G.box,cadD,.14,H,.14,px,H/2,pz,sc)}}
  for(let i=0;i<nP;i++){const t=(i+.5)/nP,px=w>d?rf.x0+t*w:front,pz=w>d?front:rf.z0+t*d;const xb=mesh(G.box,cadD,w>d?w/nP*1.05:.06,.08,w>d?.06:d/nP*1.05,px,1.05,pz,sc,true);xb.rotation[w>d?'z':'x']=.75}
  mesh(G.box,cadD,w>d?w:.06,.08,w>d?.06:d,w>d?cx:front,H+1,w>d?front:cz,sc,true);
  const nn=Math.floor((w>d?w:d)/.55);for(let row=0;row<2;row++)for(let i=0;i<nn;i++){const t=(i+.5)/nn,o=row?.9:.35,px=w>d?rf.x0+t*w:(cx>0?rf.x0+o+.4:rf.x1-o-.4),pz=w>d?(cz>0?rf.z0+o+.3:rf.z1-o-.3):rf.z0+t*d;
   CL.crowd.push([px,H+.14,pz,w>d?(cz>0?Math.PI:0):(cx>0?-Math.PI/2:Math.PI/2),1])}}
 const barM=M('#6f7478',.45,.6);
 for(const rf of CLREF.filter(q=>!q.cad)){const vert=rf.bar;const L=vert?rf.z1-rf.z0:rf.x1-rf.x0,ln=vert?(rf.x0>0?rf.x0:rf.x1):(rf.z0>0?rf.z0:rf.z1);
  const n=Math.round(L/.22),bars=new THREE.InstancedMesh(new THREE.CylinderGeometry(.03,.03,2,6),barM,n+2),o=new THREE.Object3D();
  for(let i=0;i<=n+1;i++){const t=Math.min(1,i/n);if(vert)o.position.set(ln,1,rf.z0+t*L);else o.position.set(rf.x0+t*L,1,ln);o.updateMatrix();bars.setMatrixAt(i,o.matrix)}bars.castShadow=true;sc.add(bars);
  mesh(G.box,barM,vert?.08:L,.08,vert?L:.08,vert?ln:(rf.x0+rf.x1)/2,2,vert?(rf.z0+rf.z1)/2:ln,sc,true);mesh(G.box,barM,vert?.08:L,.08,vert?L:.08,vert?ln:(rf.x0+rf.x1)/2,.3,vert?(rf.z0+rf.z1)/2:ln,sc,true);
  if(vert)for(let i=0;i<22;i++)CL.crowd.push([ln+(rf.x0>0?1:-1)*R(.6,3.2),0,R(rf.z0+.3,rf.z1-.3),rf.x0>0?-Math.PI/2:Math.PI/2,0])}
 const cj=new THREE.Group();cj.position.set(0,0,43.6);sc.add(cj);mesh(G.box,M('#e6e2d6',.7),5.2,3.4,7,0,2.2,3,cj);mesh(G.box,M('#2d2d2d'),5.2,.8,7,0,.4,3,cj,true);mesh(G.box,M('#bf3a3f',.6),5.25,.5,7.05,0,3.2,3,cj,true);
 const door=mesh(G.box,M('#4a4f55',.5,.5),2.2,2.6,.1,0,1.9,-.55,cj);CL.door=door;for(const s of [-1,1])mesh(G.box,M('#4a4f55',.5,.5),.12,3,.12,s*1.2,1.5,-.55,cj);
 mesh(G.box,M('#4a4f55',.5,.5),7,2.2,.12,0,1.1,6.8,cj);
 const tri=new THREE.BufferGeometry();tri.setAttribute('position',new THREE.Float32BufferAttribute([-.16,0,0,.16,0,0,0,-.32,0],3));tri.computeVertexNormals();
 const fl=[];const strand=(ax,az,bx,bz,yy)=>{const n=Math.floor(Math.hypot(bx-ax,bz-az)/.42);for(let i=0;i<n;i++){const t=i/n;fl.push([ax+(bx-ax)*t,yy-Math.sin(t*Math.PI)*.9,az+(bz-az)*t,Math.atan2(bx-ax,bz-az)])}};
 for(let x=18;x<62;x+=7)strand(x,-4,x+2,4,6.4);for(let x=-18;x>-62;x-=7)strand(x,-4,x-2,4,6.4);for(let z=14;z<42;z+=6)strand(-3.5,z,3.5,z+1.5,6.2);
 strand(-14,-11,14,11,8.5);strand(-14,11,14,-11,8.5);strand(-14,0,14,0,8.8);
 const fcol=['#c0303a','#e6bb55','#2b5aa0','#f4f0e6','#1f6b3a','#d58fb0'].map(c=>new THREE.Color(c));
 const fim=new THREE.InstancedMesh(tri,new THREE.MeshStandardMaterial({side:THREE.DoubleSide,roughness:.8,emissive:night?'#332211':'#000000'}),fl.length),o=new THREE.Object3D();
 fl.forEach((f,i)=>{o.position.set(f[0],f[1],f[2]);o.rotation.set(0,f[3]+Math.PI/2,0);o.updateMatrix();fim.setMatrixAt(i,o.matrix);fim.setColorAt(i,fcol[i%fcol.length])});sc.add(fim);
 if(night){const bulbs=new THREE.InstancedMesh(new THREE.SphereGeometry(.06,6,4),new THREE.MeshBasicMaterial({color:'#ffd27a'}),Math.ceil(fl.length/3));let k=0;fl.forEach((f,i)=>{if(i%3)return;o.position.set(f[0],f[1]+.02,f[2]);o.rotation.set(0,0,0);o.updateMatrix();bulbs.setMatrixAt(k++,o.matrix)});sc.add(bulbs);
  for(const p of [[0,7,0],[9,6,6],[-9,6,-6],[30,6,0],[-30,6,0],[0,6,26],[48,6,0],[-48,6,0]]){const l=new THREE.PointLight('#ffc879',1.25,26,1.6);l.position.set(...p);sc.add(l)}
  const amb=new THREE.AmbientLight('#3a4466',.35);sc.add(amb)}
 calleDeco(sc,night);
 const r2=mulberry(5);for(const b of CL.balc)CL.crowd.push([b[0],b[1],b[2],b[3],1]);
 for(let i=0;i<34;i++){const s=r2();CL.crowd.push([R(-7,7),.12+(s<.5?.22:.44),-10.2+(s<.5?0:-.4),0,1])}
 const crowd=CL.crowd,pc=['#f4f2ee','#f4f2ee','#f4f2ee','#c42a2a','#f4f2ee','#b8232a','#3a4b6e','#262626','#efe7da','#2b5aa0','#1f6b3a','#e6bb55'].map(c=>new THREE.Color(c));
 const bodyI=new THREE.InstancedMesh(new THREE.CylinderGeometry(.2,.17,.62,8),new THREE.MeshStandardMaterial({roughness:.8}),crowd.length),headI=new THREE.InstancedMesh(new THREE.SphereGeometry(.12,8,6),M('#c79a74',.7),crowd.length),legI=new THREE.InstancedMesh(new THREE.BoxGeometry(.3,.75,.2),M('#2a2d36',.8),crowd.length);
 const hairI=new THREE.InstancedMesh(new THREE.SphereGeometry(.13,8,5,0,Math.PI*2,0,Math.PI*.5),M('#2a1c12',.9),crowd.length),armI=new THREE.InstancedMesh(new THREE.BoxGeometry(.09,.5,.1),new THREE.MeshStandardMaterial({roughness:.8}),crowd.length*2);
 crowd.forEach((c,i)=>{c.w=r2();const col=pc[Math.floor(c.w*977)%pc.length];bodyI.setColorAt(i,col);armI.setColorAt(i*2,col);armI.setColorAt(i*2+1,col)});CL.bodyI=bodyI;CL.headI=headI;CL.legI=legI;CL.hairI=hairI;CL.armI=armI;sc.add(bodyI,headI,legI,hairI,armI);crowdPose(0,0);
 CL.D=dustPool(sc);return sc}
let SENY=null;function senyera(){if(SENY)return SENY;const cv=document.createElement('canvas');cv.width=64;cv.height=96;const c=cv.getContext('2d');c.fillStyle='#f1c40f';c.fillRect(0,0,64,96);c.fillStyle='#c0262d';for(let i=0;i<4;i++)c.fillRect(0,10+i*22,64,10);c.fillStyle='#2b5aa0';c.fillRect(0,0,16,96);SENY=new THREE.CanvasTexture(cv);return SENY}
function crowdPose(lev,t){const o=new THREE.Object3D(),C=CL.crowd;CL.cf=(CL.cf||0)+1;if(lev<.04&&CL.lastLev<.04&&CL.cf>2)return;if(CL.cf%2&&CL.cf>2)return;CL.lastLev=lev;
 C.forEach((c,i)=>{const j=lev>.04&&c.w<lev*1.2?Math.max(0,Math.sin(t*9+c.w*40))*.2*lev:0;const sit=c[4];o.rotation.set(0,c[3],0);o.scale.set(1,1,1);
  o.position.set(c[0],c[1]+(sit?.32:.95)+j,c[2]);o.updateMatrix();CL.bodyI.setMatrixAt(i,o.matrix);o.position.y=c[1]+(sit?.75:1.38)+j;o.updateMatrix();CL.headI.setMatrixAt(i,o.matrix);o.position.y+=.025;o.updateMatrix();CL.hairI.setMatrixAt(i,o.matrix);
  for(const sd of [-1,1]){const up=lev>.04&&c.w<lev*1.2&&sd*Math.sin(t*3+c.w*9)>0;const ax=Math.cos(c[3])*sd*.25,az=-Math.sin(c[3])*sd*.25;o.position.set(c[0]+ax,c[1]+(sit?.32:.95)+j+(up?.45:0),c[2]+az);o.rotation.set(0,c[3],up?sd*-.3:sd*.12);o.scale.set(1,1,1);o.updateMatrix();CL.armI.setMatrixAt(i*2+(sd>0?1:0),o.matrix)}o.rotation.set(0,c[3],0);
  o.position.set(c[0]+(sit?Math.sin(c[3])*.25:0),c[1]+(sit?.08:.38),c[2]+(sit?Math.cos(c[3])*.25:0));o.scale.set(1,sit?.3:1,sit?1.6:1);o.updateMatrix();CL.legI.setMatrixAt(i,o.matrix)});
 CL.bodyI.instanceMatrix.needsUpdate=CL.headI.instanceMatrix.needsUpdate=CL.legI.instanceMatrix.needsUpdate=CL.hairI.instanceMatrix.needsUpdate=CL.armI.instanceMatrix.needsUpdate=true}

/* ---------- entorno: calle o plaza de toros ---------- */
function envCalle(){return {name:'calle',
 walk(p,vaca){let ok=false;for(const k in CLRECT)if(inRc(CLRECT[k],p.x,p.z)){ok=true;break}
  if(vaca){for(const rf of CLREF)if(inRc(rf,p.x,p.z,.7)){ok=false;break}for(const c of CLCIRC)if(Math.hypot(p.x-c.x,p.z-c.z)<c.r+.7)ok=false}else for(const c of CLCIRC)if(Math.hypot(p.x-c.x,p.z-c.z)<.75)ok=false
  return ok},
 refugio(x,z){return CLREF.some(rf=>inRc(rf,x,z))||CLCIRC.some(c=>{const d=Math.hypot(x-c.x,z-c.z);return d<c.r&&d>.7})},
 nearRef(x,z){let b=null,bd=1e9;for(const rf of CLREF){const px=clamp(x,rf.x0+.4,rf.x1-.4),pz=clamp(z,rf.z0+.4,rf.z1-.4),d=Math.hypot(px-x,pz-z);if(d<bd){bd=d;b={x:px,z:pz,d}}}for(const c of CLCIRC){const a=Math.atan2(x-c.x,z-c.z),px=c.x+Math.sin(a)*1.3,pz=c.z+Math.cos(a)*1.3,d=Math.hypot(px-x,pz-z);if(d<bd){bd=d;b={x:px,z:pz,d}}}return b},
 cajon:{x:0,z:42.4,ox:0,oz:9},start:{x:2,z:-3},
 rand(){const k=pick(['plz','plz','plz','e','w','n']),r=CLRECT[k];return {x:R(r.x0+1.5,r.x1-1.5),z:R(r.z0+1.2,r.z1-1.2)}}}}
function envPlaza(){const rr=PR-.7;return {name:'plaza',
 walk(p,vaca){const d=Math.hypot(p.x,p.z);if(vaca)return d<rr-.5&&!this.refugio(p.x,p.z);return d<rr+2.6},
 refugio(x,z){const d=Math.hypot(x,z);if(d>rr+.3)return true;for(const a of [.35,1.95,3.55,5.15]){const bx=Math.sin(a)*(PR-.7),bz=Math.cos(a)*(PR-.7);if(Math.hypot(x-bx,z-bz)<1.2&&d>PR-1.6)return true}return false},
 nearRef(x,z){let b=null,bd=1e9;for(const a of [.35,1.95,3.55,5.15]){const bx=Math.sin(a)*(PR-1.1),bz=Math.cos(a)*(PR-1.1),d=Math.hypot(x-bx,z-bz);if(d<bd){bd=d;b={x:bx,z:bz,d}}}
  const d0=Math.hypot(x,z)||1,cx=x/d0*(PR+1),cz=z/d0*(PR+1),dc=Math.hypot(cx-x,cz-z);if(dc<bd)b={x:cx,z:cz,d:dc,salto:true};return b},
 cajon:{x:0,z:-PR+.2,ox:0,oz:-PR+4},start:{x:0,z:6},
 rand(){const a=R(0,6.28),d=R(3,PR-4);return {x:Math.sin(a)*d,z:Math.cos(a)*d}}}}

/* ---------- arranque ---------- */
const RECOR_N=['Dani «el Gato»','Rubén Arnau','Pau Ferrer','Sergi «Tremendo»','Javi Ribes','Toni Albiol','Àlex Canós','Iván «Llamp»','Quique Vicent','Marc Serrano'];
function irCalle(id){const C=S.corro,o=C.of.find(x=>x.id===id);if(!o||o.st!=='aceptada')return;if(o.abs!==absNow()){toast('Ese festejo no es este mes');return}
 const an=cElegir(o);if(!an.length){toast('No tienes reses descansadas para ese festejo');return}if(!show3D())return;
 const plaza=o.tipo==='concurso',night=o.tipo==='embolado'||(!plaza&&o.night);
 CL={o,an:an.map(a=>a.id),plaza,night,crowd:[],ev:{luc:{},cog:0,anil:0,quieb:0},pts:0,mine:{q:0,r:0,s:0,a:0},spect:false,cam:'jug',t:0,i:-1,log:[]};
 let sc;if(plaza){const P=buildPlaza();sc=P.sc;CL.P=P;CL.added=[];CL.env=envPlaza()}else{sc=buildCalle(night);CL.env=envCalle()}
 CL.sc=sc;W3.scene=sc;W3.mode='calle';hudMode('calle');calleHUD(true);
 const add=o3=>{sc.add(o3);if(CL.added)CL.added.push(o3);return o3};CL.add=add;
 const me=makePerson({jacket:'#f4f4f4',pants:'#1f232b',shirt:null,belt:C.div[0],legs:'#1f232b',boots:'#e9e9e9',hair:'#2a1c12'});add(me.root);
 CL.me={m:me,x:CL.env.start.x,z:CL.env.start.z,yaw:Math.PI,v:0,vx:0,vz:0,toss:0,safe:false,dodge:0,me:1,name:'Tú',cite:0,jump:0,anim:0};
 CL.npc=[];const pn=pick(RECOR_N);const used=new Set();for(let i=0;i<(plaza?3:6);i++){let nm;do nm=pick(RECOR_N);while(used.has(nm));used.add(nm);
  const col=pick(['#2b5aa0','#1f6b3a','#bf3a3f','#e6bb55','#f4f4f4','#5b2a6e','#d9792b']);const p=makePerson({jacket:col,pants:'#20242c',belt:'#141414',boots:'#ececec',hair:pick(['#231812','#3b2a1c','#151010'])});add(p.root);
  const s=CL.env.rand();CL.npc.push({m:p,x:s.x,z:s.z,yaw:R(0,6),v:0,toss:0,safe:false,dodge:0,name:nm,sk:R(.45,.9),st:'idle',t:R(0,3),cite:0,jump:0,anim:0})}
 CL.cab=[0,1].map(i=>{const b=makeBull({pelo:i?'berrendo en colorado':'berrendo en negro',kind:'cabestro'});b.root.visible=false;add(b.root);return {b,x:0,z:0,yaw:0}});
 CL.ppl=[CL.me,...CL.npc];
 W3.yaw=0;W3.pitch=.32;clSpect(true);crowdStart&&crowdStart();ambStop&&ambStop();
 const F=FEST[o.tipo];banner(`${F.n}${night&&o.tipo==='vaquillas'?' · nit':''}`,`${o.pueblo} · ${o.fiesta}`,3.6);
 calleNext()}
function calleHUD(on){let h=$('#h3calle');if(!h){h=document.createElement('div');h.id='h3calle';h.className='h3calle';
  h.innerHTML=`<div class="tvTop"><span class="tvIco">${ICO.toroG}</span><span class="tvTx"><b id="tvTit">BOUS AL CARRER</b><span><i id="tvGan"></i><i id="tvN"></i></span></span></div>
  <div class="tvLive"><b>DIRECTO</b><span>TV</span></div>
  <div class="tvLow" id="tvLow"></div><canvas class="tvMap" id="tvMap" width="180" height="150"></canvas>
  <div class="clT"><span id="clres" class="clres"></span><span id="clpts" class="clpts"></span></div>
  <div class="clB"><button class="btn sm" id="clcam">Cámara</button><button class="btn sm oro" id="clsp">Bajar a la calle</button><button class="btn sm" id="clnx">Siguiente res</button></div>
  <div class="clA"><button class="btn" id="clrun">Correr</button><button class="btn" id="clcit">Citar</button><button class="btn oro" id="clq">¡Quiebro!</button></div>`;W3.root.appendChild(h);
  $('#clcam').onclick=()=>{const v=['tv','jug','cad','res'],n={tv:'TV',jug:'recortador',cad:'cadafal',res:'la res'};CL.cam=v[(v.indexOf(CL.cam)+1)%4];$('#clcam').textContent='Cámara: '+n[CL.cam]};
  $('#clsp').onclick=()=>clSpect(!CL.spect);
  $('#clnx').onclick=()=>{if(CL&&CL.res&&CL.res.mode!=='recogida'){CL.res.mode='recogida';CL.res.t=0}};
  $('#clrun').onclick=()=>{W3.run=!W3.run;$('#clrun').classList.toggle('oro',W3.run)};
  $('#clcit').onclick=()=>clAccion('cita');$('#clq').addEventListener('pointerdown',e=>{e.preventDefault();clAccion('q')});
  window.addEventListener('keydown',e=>{if(!CL||W3.mode!=='calle')return;const k=e.key.toLowerCase();if(k===' '){e.preventDefault();clAccion('q')}if(k==='c')clAccion('cita');if(k==='shift')W3.run=true});
  window.addEventListener('keyup',e=>{if(e.key==='Shift'&&W3.mode==='calle')W3.run=false})}
 h.hidden=!on}
const _hudMode=hudMode;
hudMode=function(m){_hudMode(m);if(W3.root)W3.root.dataset.m=m||'';const h=$('#h3calle');if(h)h.hidden=m!=='calle';if(m==='calle'){$('#h3cap').hidden=false;$('#h3toro').hidden=false}};

/* ---------- reses ---------- */
function calleNext(){const C=S.corro;if(CL.res){CL.ev.luc[CL.res.a.id]=clResLuc(CL.res);if(CL.res.b)CL.sc.remove(CL.res.b.root);CL.res=null}
 const vivos=CL.an.map(cById).filter(a=>a&&a.tipo!=='cabestro');CL.i++;
 if(CL.i>=vivos.length){calleFin();return}
 const a=vivos[CL.i],t=cTipo(a),emb=CL.o.tipo==='embolado';
 const b=makeBull({pelo:a.pelo,kind:t==='toro'||a.sex==='M'?(t==='becerro'?'becerro':'toro'):(t==='becerro'?'becerro':'vaca'),m:cMorf(a)});CL.add(b.root);
 const E=CL.env.cajon;const res={a,b,x:E.x,z:E.z,yaw:Math.atan2(E.ox-E.x,E.oz-E.z),v:0,mode:'sale',t:0,tt:0,tgt:null,st:{emb:0,rem:0,pers:0,par:0,qui:0,dist:0},dur:emb?85:t==='toro'?80:t==='becerro'?55:70,fire:null,ring:0};
 if(emb){res.fire=embolar(b)}CL.res=res;CL.cab.forEach(c=>c.b.root.visible=false);
 if(CL.door)CL.door.position.y=4.2;
 $('#h3toro').textContent=`${t==='becerro'?'Becerr'+(a.sex==='H'?'a':'o'):TIPOTXT[t]} · ${a.name}${a.num!=null?' nº '+a.num:''} · ${a.pelo} · ${C.name}`;
 $('#h3cap').textContent=emb?'Sale el toro embolado. Las bolas arden: respeta la distancia y busca los cadafales.':t==='becerro'?'Sale el becerro: es su primera prueba. Fíjate en cómo embiste.':CL.plaza?`Sale ${a.name}. Concurso de anillas: acércate de frente cuando esté parada y pon la anilla en el pitón.`:`Se abre el cajón y sale ${a.name}. Cítala y quiébrala cuando llegue.`;
 cencerro&&cencerro(.6);clInfo();tvLow()}
function cMorf(a){const fake={id:a.id,born:a.born,enc:null,g:{tra:70},sex:a.sex,peso:a.peso};try{const m=morf(fake);if(a.sex==='H'){m.horn='lira';m.hl=Math.min(1.2,.9+cAge(a)*.04)}return m}catch(e){return undefined}}
function embolar(b){const g=new THREE.Group();const fires=[];
 for(const s of [1,-1]){const ball=mesh(geos().sph,new THREE.MeshStandardMaterial({color:'#2a1a0e',emissive:'#ff7a1a',emissiveIntensity:1.4}),.1,.1,.1,s*.62,.62,.2,b.hp,true);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(.5,.9),new THREE.MeshBasicMaterial({map:fireTex(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));fl.position.set(s*.62,1.02,.2);b.hp.add(fl);fires.push(fl)}
 const L=new THREE.PointLight('#ff8a2a',2.2,14,1.8);L.position.set(0,1,.2);b.hp.add(L);return {fires,L}}
let FIRE=null;function fireTex(){if(FIRE)return FIRE;const cv=document.createElement('canvas');cv.width=64;cv.height=128;const c=cv.getContext('2d');const g=c.createRadialGradient(32,96,2,32,80,60);g.addColorStop(0,'rgba(255,255,220,1)');g.addColorStop(.25,'rgba(255,200,80,.95)');g.addColorStop(.6,'rgba(255,90,20,.6)');g.addColorStop(1,'rgba(120,20,0,0)');c.fillStyle=g;c.beginPath();c.ellipse(32,80,26,48,0,0,7);c.fill();FIRE=new THREE.CanvasTexture(cv);return FIRE}
function clResLuc(r){const s=r.st,a=r.a;const v=40+s.emb*2.4+s.rem*3+Math.min(18,s.dist/14)+s.qui*1.2-s.par*1.5;return Math.round(clamp(v*.6+corroLuc(a)*.4,20,99))}
function clInfo(){const r=CL.res;$('#clres').textContent=r?`${r.a.name} · embestidas ${r.st.emb} · remates ${r.st.rem} · ${Math.max(0,Math.ceil(r.dur-r.tt))} s`:'';
 const m=CL.mine;$('#clpts').textContent=`Tus puntos ${CL.pts} · quiebros ${m.q} · recortes ${m.r} · saltos ${m.s}${CL.plaza?` · anillas ${m.a}`:''}`}

/* ---------- acción del jugador ---------- */
function clWindow(p){const r=CL.res;if(!r||p.toss>0)return null;const dx=p.x-r.x,dz=p.z-r.z,d=Math.hypot(dx,dz);
 const fw={x:Math.sin(r.yaw),z:Math.cos(r.yaw)},front=(dx*fw.x+dz*fw.z)/(d||1);return {d,front,charge:r.mode==='embiste'&&r.tgt===p&&r.v>2.5}}
function clAccion(kind){if(!CL||!CL.res||CL.spect)return;const p=CL.me;if(p.toss>0||p.dodge>0||p.jump>0)return;
 if(kind==='cita'){p.cite=2.2;ole('¡Eh, eh!');return}
 const w=clWindow(p);if(!w)return;const r=CL.res,sen=r.a.g.sen;
 if(CL.plaza&&!w.charge&&w.d<2.4&&w.d>1&&w.front>.75&&r.v<2.2&&r.ring<14){const ok=Math.random()<clamp(.55-(sen-50)/220+(r.mode==='mira'?.15:0),.15,.85);
  if(ok){CL.mine.a++;CL.pts+=25;CL.ev.anil++;r.ring++;anillaEn(r);ole('¡Anilla!');oleSnd&&oleSnd(false);clCrowd(.9);r.mode='embiste';r.tgt=p;r.t=0;r.v=2.5;r.st.emb++}else{r.mode='embiste';r.tgt=p;r.t=0;r.v=4;$('#h3cap').textContent='Falla la anilla y la vaca se le arranca encima.'}clInfo();return}
 if(!w.charge){p.cite=2.2;ole('¡Eh!');return}
 const d=w.d,run=Math.hypot(p.vx,p.vz)>4.6;
 if(d<1.5&&d>.85){const ok=Math.random()<clamp(.62-(sen-50)/200,.2,.85);if(ok){p.jump=1.05;CL.mine.s++;CL.pts+=30;r.st.qui++;CL.ev.quieb++;r.mode='pasa';r.t=0;ole('¡Salto!');oleSnd&&oleSnd(true);clCrowd(1)}else clToss(p);clInfo();return}
 if(d>=1.5&&d<=3.6){const q=1-Math.abs(d-2.4)/1.3,ok=Math.random()<clamp(.42+.55*q-(sen-50)/220,.12,.95);
  if(ok){const fx=Math.sin(r.yaw),fz=Math.cos(r.yaw),side=((p.x-r.x)*fz-(p.z-r.z)*fx)>=0?1:-1;p.dodge=.5;p.dx=fz*side*2.6;p.dz=-fx*side*2.6;r.mode='pasa';r.t=0;r.st.qui++;CL.ev.quieb++;
   if(run){CL.mine.r++;CL.pts+=Math.round(18+q*14);ole('¡Recorte!')}else{CL.mine.q++;CL.pts+=Math.round(12+q*14);ole(q>.7?'¡Olé!':'¡Bien!')}oleSnd&&oleSnd(q>.7);clCrowd(.6+q*.4)}
  else{$('#h3cap').textContent='Te ha ganado la acción: no te dio tiempo a salir.';clToss(p)}clInfo();return}
 p.cite=1.2}
function anillaEn(r){const hp=r.b.hp;const k=r.ring;const t=new THREE.Mesh(new THREE.TorusGeometry(.07,.012,6,14),M('#d9dde0',.25,.9));t.position.set((k%2?1:-1)*(.34+(k>>1)*.06),.3,.18);t.rotation.y=Math.PI/2;hp.add(t)}
function clToss(p){if(p.toss>0)return;p.toss=2.2;const r=CL.res;const dx=p.x-r.x,dz=p.z-r.z,d=Math.hypot(dx,dz)||1;p.tv={x:dx/d*3,z:dz/d*3};CL.ev.cog++;bufido&&bufido(.7);clCrowd(1);
 if(p.me){try{navigator.vibrate&&navigator.vibrate([60,40,120])}catch(e){}CL.pts=Math.max(0,CL.pts-10);$('#h3cap').textContent=`¡Volteretón de ${r.a.name}! Te levantas dolorido: refúgiate en un cadafal.`}else $('#h3cap').textContent=`¡Cogida! ${r.a.name} prende a ${p.name}. Se levanta por su pie entre el griterío.`;
 r.mode='pasa';r.t=0;r.st.emb++}
function clCrowd(l){CL.cheer=Math.max(CL.cheer||0,l);try{crowdLevel(.05+l*.3)}catch(e){}}

/* ---------- bucle ---------- */
function calleTick(dt){if(!CL)return;CL.t+=dt;const E=CL.env,r=CL.res;
 let jx=W3.jx,jy=W3.jy;const k=W3.keys;if(k['w']||k['arrowup'])jy=1;if(k['s']||k['arrowdown'])jy=-1;if(k['a']||k['arrowleft'])jx=-1;if(k['d']||k['arrowright'])jx=1;
 const me=CL.me;
 if(!CL.spect&&me.toss<=0&&me.dodge<=0){const L=Math.min(1,Math.hypot(jx,jy));if(L>.08){const fx=-Math.sin(W3.yaw),fz=-Math.cos(W3.yaw);const mx=fx*jy-fz*jx,mz=fz*jy+fx*jx,ml=Math.hypot(mx,mz)||1;const v=(W3.run?6.9:3.4)*L;me.vx=mx/ml*v;me.vz=mz/ml*v;me.yaw+=angD(me.yaw,Math.atan2(mx,mz))*Math.min(1,dt*12)}else{me.vx*=.8;me.vz*=.8}}
 else if(CL.spect){me.vx=me.vz=0}
 for(const p of CL.ppl){if(p!==me&&p.toss<=0&&p.dodge<=0)npcTick(p,dt);
  if(p.toss>0){p.toss-=dt;const ph=2.2-p.toss;if(ph<.7){p.x+=p.tv.x*dt;p.z+=p.tv.z*dt}if(p.toss<=0){p.m.root.rotation.x=0}}
  else if(p.dodge>0){p.dodge-=dt;p.x+=p.dx*dt*2;p.z+=p.dz*dt*2}
  else{const nx=p.x+p.vx*dt,nz=p.z+p.vz*dt;if(E.walk({x:nx,z:nz},false)){p.x=nx;p.z=nz}else if(E.walk({x:nx,z:p.z},false))p.x=nx;else if(E.walk({x:p.x,z:nz},false))p.z=nz}
  if(p.jump>0)p.jump-=dt;p.cite=Math.max(0,p.cite-dt);p.safe=E.refugio(p.x,p.z)}
 if(r)resTick(r,dt);
 for(const p of CL.ppl){const m=p.m,sp=Math.hypot(p.vx||0,p.vz||0);m.root.position.set(p.x,0,p.z);
  if(p.toss>0){const ph=2.2-p.toss;if(ph<.7){m.root.position.y=Math.sin(ph/.7*Math.PI)*2.1;m.root.rotation.x=-ph/.7*Math.PI*1.5}else if(ph<1.7){m.root.rotation.x=-Math.PI/2;m.root.position.y=.15}else{const v=(ph-1.7)/.5;m.root.rotation.x=-Math.PI/2*(1-v);m.root.position.y=.15*(1-v)}}
  else{m.root.rotation.x=0;if(p.jump>0){const v=1-p.jump/1.05;m.root.position.y=Math.sin(v*Math.PI)*1.55;m.root.rotation.x=Math.sin(v*Math.PI)*-.5}
   if(sp>.3)p.yaw+=angD(p.yaw,Math.atan2(p.vx,p.vz))*Math.min(1,dt*10);else if(r)p.yaw+=angD(p.yaw,Math.atan2(r.x-p.x,r.z-p.z))*Math.min(1,dt*3);
   m.root.rotation.y=p.yaw;m.root.rotation.z=p.dodge>0?Math.sign(p.dx||1)*.35:0;
   const ar=m.arms;if(p.cite>0){ar[0].lock=ar[1].lock=1;const w=Math.sin(CL.t*12);ar[0].sh.rotation.set(-2.6+w*.3,0,.3);ar[1].sh.rotation.set(-2.6-w*.3,0,-.3)}else if(p.dodge>0){ar[0].lock=ar[1].lock=1;ar[0].sh.rotation.set(-1.4,0,.9);ar[1].sh.rotation.set(-1.4,0,-.9)}else{ar[0].lock=ar[1].lock=0}
   animPerson(m,dt,Math.min(1.4,sp/4))}
  m.root.visible=!(p===me&&CL.spect)}
 if(CL.cheer>0){CL.cheer=Math.max(0,CL.cheer-dt*.35)}if(!CL.plaza)crowdPose(CL.cheer||0,CL.t);else{try{crowdAnim(CL.P,CL.cheer||0,CL.t)}catch(e){}}
 dustTick(CL.plaza?CL.P.D:CL.D,dt);
 const btn=$('#clq');if(btn){const w=clWindow(me);let lab='¡Quiebro!',on=false;if(w){if(w.charge){on=w.d<=3.6&&w.d>.85;lab=w.d<1.5?'¡Salto!':Math.hypot(me.vx,me.vz)>4.6?'¡Recorte!':'¡Quiebro!'}else if(CL.plaza&&w.d<2.4&&w.d>1&&w.front>.75&&r.v<2.2&&r.ring<14){on=true;lab='¡Anilla!'}}
  if(btn.textContent!==lab)btn.textContent=lab;btn.style.boxShadow=on?'0 0 0 4px rgba(147,184,92,.95)':''}
 if(CL.t%0.5<dt){clInfo();const cp=$('#h3cap');if(cp.textContent!==CL.capT){CL.capT=cp.textContent;CL.capAt=CL.t;cp.style.opacity=1}else if(CL.t-CL.capAt>6)cp.style.opacity=0}if(CL.t%0.2<dt)tvMap();
 camCalle(dt)}
function npcTick(p,dt){const r=CL.res,E=CL.env;p.t-=dt;let tx=null,tz=null,spd=0;
 if(!r||r.mode==='sale'&&r.t<.4){p.vx*=.9;p.vz*=.9;return}
 const dx=r.x-p.x,dz=r.z-p.z,d=Math.hypot(dx,dz);const tgt=r.tgt===p&&r.mode==='embiste';
 if(tgt&&d<3.4&&d>1.4&&p.dodge<=0){if(Math.random()<dt*14){if(Math.random()<p.sk+.12-(r.a.g.sen-50)/250){const fx=Math.sin(r.yaw),fz=Math.cos(r.yaw),side=((p.x-r.x)*fz-(p.z-r.z)*fx)>=0?1:-1;p.dodge=.5;p.dx=fz*side*2.6;p.dz=-fx*side*2.6;r.mode='pasa';r.t=0;r.st.qui++;CL.ev.quieb++;clCrowd(.6);if(Math.random()<.4)ole(pick(['¡Olé!','¡Bien!','¡Toma!']))}else clToss(p)}}
 if(p.st==='huye'){const rf=E.nearRef(p.x,p.z);tx=rf.x;tz=rf.z;spd=6.6;if(rf.d<.4||p.t<0){p.st='safe';p.t=R(3,7)}}
 else if(p.st==='safe'){spd=0;if(p.t<0&&(!tgt)&&d>6){p.st='idle';p.t=R(1,3)}}
 else if(tgt&&d<9&&d>3.6&&Math.random()<dt*(1.2-p.sk)){p.st='huye';p.t=4}
 else if(p.st==='cita'){spd=d>6?2.2:0;tx=r.x;tz=r.z;p.cite=Math.max(p.cite,.3);if(p.t<0||d<4.5){p.st='idle';p.t=R(1.5,4)}}
 else{if(p.t<0){if(d<14&&r.mode==='mira'&&Math.random()<p.sk){p.st='cita';p.t=R(2,4)}else{const q=E.rand();p.wx=q.x;p.wz=q.z;p.t=R(2,5)}}if(p.wx!=null){tx=p.wx;tz=p.wz;spd=d<5?5:2.6}}
 if(tx!=null&&spd>0){const ex=tx-p.x,ez=tz-p.z,el=Math.hypot(ex,ez);if(el>.3){p.vx=ex/el*spd;p.vz=ez/el*spd}else{p.vx*=.8;p.vz*=.8}}else{p.vx*=.85;p.vz*=.85}}
function resTick(r,dt){const E=CL.env,a=r.a,g=a.g;r.t+=dt;r.tt+=dt;let cs=0,head=.35,toss=0,paw=false;
 const vmax=(6.4+(g.fue-60)/26)*(cTipo(a)==='becerro'?.82:1)*(r.tt>r.dur*.7?.86:1),turn=(2.4+g.sen/60)*(cTipo(a)==='toro'?.8:1);
 const alive=CL.ppl.filter(p=>p.toss<=0&&!p.safe&&!(p===CL.me&&CL.spect));
 const pickT=()=>{let b=null,bw=0;for(const p of alive){const d=Math.hypot(p.x-r.x,p.z-r.z);if(d>26)continue;const mv=Math.hypot(p.vx||0,p.vz||0)>2;const w=(p.cite>0?3:1)*(mv?1.5:1)*(p.me?1.25:1)/(d+2);if(w>bw){bw=w;b=p}}return b};
 if(r.tt>r.dur&&!['recogida','sale'].includes(r.mode)){r.mode='recogida';r.t=0;$('#h3cap').textContent='Salen los cabestros con los cencerros. La res se recoge en el cajón.';cencerro&&cencerro(.6)}
 switch(r.mode){
  case 'sale':{const ex=E.cajon.ox-r.x,ez=E.cajon.oz-r.z,d=Math.hypot(ex,ez);r.yaw=Math.atan2(ex,ez);r.v=Math.min(vmax*.8,r.v+dt*6);cs=1.15;if(d<1.5||r.t>(CL.plaza?3:7)){r.mode='mira';r.t=0;if(CL.door)CL.door.position.y=1.9}break}
  case 'mira':{r.v=Math.max(0,r.v-dt*6);const tg=pickT();r.tgt=tg;if(tg){const fy=Math.atan2(tg.x-r.x,tg.z-r.z);r.yaw+=angD(r.yaw,fy)*Math.min(1,dt*3)}head=.3;
   const wait=clamp(2.6-g.bra/40,.35,2.4);if(r.t>wait*.6&&g.bra<62)paw=true;
   if(tg&&r.t>wait){const d=Math.hypot(tg.x-r.x,tg.z-r.z);if(d<20&&Math.random()<clamp(g.bra/90,.2,1)){r.mode='embiste';r.t=0;r.st.emb++;bufido&&bufido(.4)}else if(r.t>wait+2.5){r.st.par++;r.mode='trota';r.t=0;const q=E.rand();r.wx=q.x;r.wz=q.z}}
   else if(!tg&&r.t>3){r.mode='trota';r.t=0;const q=E.rand();r.wx=q.x;r.wz=q.z}break}
  case 'trota':{const ex=r.wx-r.x,ez=r.wz-r.z,d=Math.hypot(ex,ez);r.yaw+=angD(r.yaw,Math.atan2(ex,ez))*Math.min(1,dt*2.5);r.v+=(2.6-r.v)*Math.min(1,dt*2);cs=.55;if(d<1.5||r.t>5){r.mode='mira';r.t=0}const tg=pickT();if(tg&&Math.hypot(tg.x-r.x,tg.z-r.z)<6&&Math.random()<dt*2){r.tgt=tg;r.mode='embiste';r.t=0;r.st.emb++}break}
  case 'embiste':{const tg=r.tgt;if(!tg||tg.toss>0){r.mode='mira';r.t=0;break}const px=tg.x+(tg.vx||0)*.25,pz=tg.z+(tg.vz||0)*.25;const fy=Math.atan2(px-r.x,pz-r.z);r.yaw+=clamp(angD(r.yaw,fy),-turn*dt,turn*dt);
   r.v=Math.min(vmax,r.v+dt*7);cs=r.v>4.5?1.2:.9;head=.6;const d=Math.hypot(tg.x-r.x,tg.z-r.z);r.st.dist+=r.v*dt;if(r.v>5&&Math.random()<dt*5)dust(CL.plaza?CL.P.D:CL.D,r.x,0,r.z,.3);
   if(tg.safe){r.mode='remata';r.t=0;break}
   if(d<.95&&tg.dodge<=0&&tg.jump<=0){clToss(tg);toss=1}
   if(r.t>3.2+g.res/30||(r.t>1&&r.v<1.2)){r.mode='mira';r.t=0;r.st.par++}break}
  case 'pasa':{r.v=Math.max(2,r.v-dt*2.5);cs=r.v>4?1.1:.7;head=.5;if(r.t>1.3){r.mode='mira';r.t=0}break}
  case 'remata':{r.v=Math.max(0,r.v-dt*12);head=.9;toss=Math.sin(r.t*8)>0?.7:0;if(r.t<.05){r.st.rem++;clCrowd(.7);try{bufido(.5)}catch(e){}}if(r.t>1.4){r.mode='mira';r.t=0}break}
  case 'recogida':{CL.cab.forEach((c,i)=>{if(!c.b.root.visible){c.b.root.visible=true;c.x=E.cajon.ox+(i?1.4:-1.4);c.z=E.cajon.oz;}});
   const cx=(CL.cab[0].x+CL.cab[1].x)/2,cz=(CL.cab[0].z+CL.cab[1].z)/2;const goHome=Math.hypot(r.x-cx,r.z-cz)<4;
   for(const [i,c] of CL.cab.entries()){const tx=goHome?E.cajon.x+(i?.8:-.8):r.x+(i?2:-2),tz=goHome?E.cajon.z:r.z+(i?1:-1);const ex=tx-c.x,ez=tz-c.z,el=Math.hypot(ex,ez);if(el>.5){c.x+=ex/el*2.4*dt;c.z+=ez/el*2.4*dt;c.yaw=Math.atan2(ex,ez)}c.b.root.position.set(c.x,0,c.z);c.b.root.rotation.y=c.yaw;animBull(c.b,dt,{speed:el>.5?.5:0,head:.3})}
   if(goHome){if(CL.door)CL.door.position.y=4.2;const ex=E.cajon.x-r.x,ez=E.cajon.z-r.z,el=Math.hypot(ex,ez);r.yaw+=angD(r.yaw,Math.atan2(ex,ez))*Math.min(1,dt*3);r.v+=(2.3-r.v)*Math.min(1,dt*2);cs=.5;if(el<1.2||r.t>40){calleNext();return}}
   else{r.v=Math.max(0,r.v-dt*3);head=.3}break}}
 const nx=r.x+Math.sin(r.yaw)*r.v*dt,nz=r.z+Math.cos(r.yaw)*r.v*dt;const home=r.mode==='recogida'||r.mode==='sale';
 if(home||E.walk({x:nx,z:nz},true)){r.x=nx;r.z=nz}else if(E.walk({x:nx,z:r.z},true)&&Math.abs(nx-r.x)>.004){r.x=nx;r.v*=.97}else if(E.walk({x:r.x,z:nz},true)&&Math.abs(nz-r.z)>.004){r.z=nz;r.v*=.97}else{if(r.mode==='embiste'&&r.v>4){r.mode='remata';r.t=0}else{r.yaw+=Math.PI*.6*(Math.random()<.5?1:-1)*dt*4;r.v*=.5}}
 r.b.root.position.set(r.x,0,r.z);r.b.root.rotation.y=r.yaw;animBull(r.b,dt,{speed:Math.min(1.25,r.v/5)*(cs?1:1),head,toss,paw});
 if(r.fire){const f=.85+Math.sin(CL.t*23)*.1+Math.random()*.08;r.fire.L.intensity=2.1*f;r.fire.fires.forEach(fl=>{fl.scale.set(f,f*(1+Math.random()*.2),1);fl.lookAt(W3.cam.position)})}}
function camCalle(dt){if(CL.cam==='fix')return;const c=W3.cam.position,me=CL.me,r=CL.res;let tx,ty,tz,lx,ly,lz;const k=Math.min(1,dt*3.5);
 if(CL.cam==='jug'&&!CL.spect){const dist=6.2*(W3.zoom||1),hgt=1.6+W3.pitch*5.5;tx=me.x+Math.sin(W3.yaw)*dist;tz=me.z+Math.cos(W3.yaw)*dist;ty=hgt;
  if(r&&r.mode==='embiste'&&r.tgt===me){lx=(me.x+r.x)/2;lz=(me.z+r.z)/2}else{lx=me.x-Math.sin(W3.yaw)*2;lz=me.z-Math.cos(W3.yaw)*2}ly=1.1}
 else if(CL.cam==='tv'){const f=r||me;let bx,bz;if(CL.plaza){const a=Math.atan2(f.x,f.z)+Math.PI*.8;bx=Math.sin(a)*(PR+8);bz=Math.cos(a)*(PR+8);ty=14}else if(inRc(CLRECT.plz,f.x,f.z,3)){bx=f.x*.35+10;bz=f.z*.35+13;ty=11.5}else if(Math.abs(f.z)<5&&Math.abs(f.x)>14){bx=f.x-Math.sign(f.x)*15;bz=0;ty=15}else{bx=0;bz=f.z-16;ty=16}tx=bx;tz=bz;lx=f.x;lz=f.z;ly=.6}
 else if(CL.cam==='res'&&r){tx=r.x-Math.sin(r.yaw)*7;tz=r.z-Math.cos(r.yaw)*7;ty=3.2;lx=r.x+Math.sin(r.yaw)*3;lz=r.z+Math.cos(r.yaw)*3;ly=1}
 else{const f=r||me;if(CL.plaza){const a=Math.atan2(f.x,f.z)+Math.PI;tx=Math.sin(a+.5)*(PR+6);tz=Math.cos(a+.5)*(PR+6);ty=9}else if(inRc(CLRECT.plz,f.x,f.z,2)){tx=8;tz=9.6;ty=4.2}else if(f.x>14){tx=f.x-11;tz=0;ty=5.2}else if(f.x<-14){tx=f.x+11;tz=0;ty=5.2}else{tx=0;tz=f.z-11;ty=5.2}lx=f.x;lz=f.z;ly=1}
 c.x+=(tx-c.x)*k;c.y+=(ty-c.y)*k;c.z+=(tz-c.z)*k;W3.look.set(lx,ly,lz);W3.cam.lookAt(W3.look)}

/* ---------- final ---------- */
function calleFin(){const o=CL.o,ev=CL.ev;ev.an=CL.an;const r=cResolver(o,ev);const C=S.corro;
 let premio=0;if(CL.plaza){const rivals=Array.from({length:5},()=>RI(120,420));const mejor=Math.max(...rivals);if(CL.pts>mejor){premio=r100(R(900,1800));S.money+=premio;C.st.trofeos.push({t:'Ganas el concurso de recortadores',a:'tú',p:o.pueblo,y:S.year})}CL.rank=1+rivals.filter(x=>x>CL.pts).length}
 save();const m=CL.mine;
 $('#h3dim').hidden=false;$('#h3dim').style.opacity=1;$('#h3dim').innerHTML=`<div class="stack" style="max-width:480px;width:100%"><h2>${esc(FEST[o.tipo].n)} · ${esc(o.pueblo)}</h2>
 <div>${r?`Lucimiento del corro: <b>${r.media}</b> (${LUCTXT(r.media)})`:''}</div>
 <div class="clFin">${r?r.res.map(x=>`<div><span><b>${esc(x.name)}</b> <small class="muted">${TIPOTXT[x.tipo]} · ${LUCTXT(x.luc)}</small></span><b>${x.luc}</b></div>`).join(''):''}</div>
 <small class="muted">Tus puntos: ${CL.pts} · quiebros ${m.q} · recortes ${m.r} · saltos ${m.s}${CL.plaza?` · anillas ${m.a} · puesto ${CL.rank}º de 6`:''} · cogidas ${ev.cog}</small>
 ${r?`<div><b>+${eur(r.ing)}</b> para la ganadería${r.prima?` (incluye prima de ${eur(r.prima)})`:''}${premio?` · premio del concurso ${eur(premio)}`:''}</div>`:''}
 ${r&&r.trofeo?`<div class="badge oro">${esc(r.trofeo.t)}: ${esc(r.trofeo.a)}</div>`:''}
 <button class="btn oro" onclick="salirCalle()">Volver</button></div>`;CL.done=true;calleHUD(false);$('#h3ban').hidden=true}
function salirCalle(){$('#h3cap').style.opacity='';if(CL){if(CL.added)CL.added.forEach(o=>CL.sc.remove(o));if(CL.res&&CL.res.b)CL.sc.remove(CL.res.b.root)}CL=null;$('#h3dim').hidden=true;W3.run=false;calleHUD(false);try{crowdStop()}catch(e){}exit3D();UI.tab='corro';render()}

function calleDeco(sc,night){const G=geos(),red=M('#9e2a22',.75),wood=M('#7a2018',.8),post=M('#5a1a14',.8);
 const tal=(x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0),a=Math.atan2(x1-x0,z1-z0),g=new THREE.Group();g.position.set((x0+x1)/2,0,(z0+z1)/2);g.rotation.y=a;sc.add(g);
  for(let i=0;i<4;i++)mesh(G.box,i%2?wood:red,.06,.26,L,0,.3+i*.38,0,g);const n=Math.ceil(L/1.6);for(let i=0;i<=n;i++)mesh(G.box,post,.12,1.8,.12,0,.9,-L/2+i*L/n,g);
  for(let i=0;i<n;i++){const st=mesh(G.box,post,.05,.05,L/n*1.05,0,.9,-L/2+(i+.5)*L/n,g,true);st.rotation.x=.55}};
 for(const c of CLCIRC){const tr=new THREE.Group();tr.position.set(c.x,0,c.z);sc.add(tr);mesh(G.cyl,M('#8d8269',.9),.32,4.4,.32,0,2.2,0,tr);
  const lf=M('#4f7a33',.9);for(let i=0;i<7;i++){const a=i/7*6.28;mesh(G.sph,i%2?lf:M('#5f8a3c',.9),2.1,1.5,2.1,Math.cos(a)*1.6,5.6+Math.sin(i*3)*.5,Math.sin(a)*1.6,tr)}mesh(G.sph,lf,2.6,1.9,2.6,0,6.6,0,tr);
  const n=12;for(let i=0;i<n;i++){const a0=i/n*6.28,a1=(i+1)/n*6.28;tal(c.x+Math.sin(a0)*c.r,c.z+Math.cos(a0)*c.r,c.x+Math.sin(a1)*c.r,c.z+Math.cos(a1)*c.r)}
  for(let i=0;i<9;i++){const a=R(0,6.28),d=R(.9,c.r-.3);CL.crowd.push([c.x+Math.sin(a)*d,0,c.z+Math.cos(a)*d,a+Math.PI,0])}}
 tal(-14,-4.6,-14,4.6);tal(14,-4.6,14,4.6);tal(-4,11,4,11);
 for(const [x0,x1,z] of [[-13.8,-8.2,-10.6],[8.2,13.8,-10.6]])tal(x0,z,x1,z);
 for(let i=0;i<10;i++){CL.crowd.push([R(-3.4,3.4),0,R(11.3,12.6),Math.PI,0])}
 for(const x of [-13.6,13.6])for(let i=0;i<8;i++)CL.crowd.push([x+(x>0?R(.3,1.2):-R(.3,1.2)),0,R(-3.6,3.6),x>0?-Math.PI/2:Math.PI/2,0])}

function clSpect(on){CL.spect=on;const b=$('#clsp');b.textContent=on?'Bajar a la calle':'Subir al cadafal';b.classList.toggle('oro',on);W3.root.classList.toggle('clspect',on);
 if(on){const r=CL.env.nearRef(CL.me.x,CL.me.z);CL.me.x=r.x;CL.me.z=r.z;CL.cam='tv'}else{const s0=CL.env.start;CL.me.x=s0.x;CL.me.z=s0.z;CL.cam='jug';$('#h3cap').textContent='Estás en la calle. Joystick para moverte, Citar para llamarla y el botón dorado cuando llegue.'}
 $('#clcam').textContent='Cámara: '+({tv:'TV',jug:'recortador',cad:'cadafal',res:'la res'}[CL.cam])}
function tvLow(){const r=CL&&CL.res;const el=$('#tvLow');if(!el)return;if(!r){el.innerHTML='';return}const a=r.a,t=cTipo(a);
 el.innerHTML=`<span class="tvH">${hierroSVG({l:S.corro.l,a:'none'},40,'#fff')}</span><span class="tvD"><b>Nº ${a.num??'—'} &nbsp;${esc(a.name.toUpperCase())}</b><small>${TIPOTXT[t]} · ${a.pelo}</small><small>Peso: ${a.peso} kg · Edad: ${cAge(a)} ${cAge(a)===1?'año':'años'}</small></span>`;
 $('#tvGan').textContent='GANADERÍA: '+S.corro.name.toUpperCase();$('#tvTit').textContent=CL.plaza?'CONCURSO DE RECORTADORES':CL.o.tipo==='embolado'?'BOU EMBOLAT':CL.o.tipo==='capea'?'CAPEA':'BOUS AL CARRER';const tot=CL.an.map(cById).filter(x=>x&&x.tipo!=='cabestro').length;$('#tvN').textContent=`RESES: ${Math.min(tot,CL.i+1)}/${tot}`}
function tvMap(){const cv=$('#tvMap');if(!cv||!CL)return;const c=cv.getContext('2d'),W=cv.width,H=cv.height;c.clearRect(0,0,W,H);c.fillStyle='rgba(10,12,16,.82)';c.fillRect(0,0,W,H);
 const sx=CL.plaza?W/(PR*2.4):W/140,ox=W/2,oz=H/2;const P=(x,z)=>[ox+x*sx,oz+z*sx];c.fillStyle='rgba(255,255,255,.18)';c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=1.5;
 if(CL.plaza){c.beginPath();c.arc(ox,oz,PR*sx,0,7);c.fill();c.stroke()}else for(const k in CLRECT){const r=CLRECT[k],[a,b]=P(r.x0,r.z0),[d,e]=P(r.x1,r.z1);c.fillRect(a,b,d-a,e-b);c.strokeRect(a,b,d-a,e-b)}
 for(const p of CL.ppl){if(p===CL.me&&CL.spect)continue;const [x,y]=P(p.x,p.z);c.fillStyle=p.me?'#e6bb55':'#f4f2ee';c.beginPath();c.arc(x,y,p.me?3.4:2.2,0,7);c.fill()}
 const r=CL.res;if(r){const [x,y]=P(r.x,r.z);c.fillStyle='#d8242c';c.beginPath();c.arc(x,y,4.2,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=1;c.stroke()}
 c.fillStyle='#fff';c.font='bold 10px sans-serif';c.fillText('N',W-12,12)}

function clAbandon(){if(!CL)return;if(CL.done){salirCalle();return}if(CL.res){CL.ev.luc[CL.res.a.id]=clResLuc(CL.res);CL.sc.remove(CL.res.b.root);CL.res=null}CL.i=1e9;calleFin()}
