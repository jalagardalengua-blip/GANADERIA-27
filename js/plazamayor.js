/* ===================== PLAZA MAYOR DE FIESTAS · «VER TU HIERRO EN DIRECTO» (ganadería de corro) =====================
   Sustituye el pueblo de los bous al carrer por una plaza de calidad:
   · Casas tradicionales: planta baja de sillería de granito con puertas y rejas, fachadas encaladas o de entramado,
     balcones de forja con geranios, galerías de madera, soportales con columnas de piedra y terraza de café,
     tejados de teja árabe con aleros, chimeneas y faroles de pared.
   · Arena con huellas de pezuñas y pisadas en la plaza y en las calles; enlosado de granito fuera del recorrido.
   · Cadafales de tubo pintado con jaula, tablado, barandilla, rótulos de peñas y toldos; escaleras de acero azules;
     talanqueras de tubo en las calles; refugio central amarillo con torre y farol; fuente de granito con agua.
   · Público: los personajes reales del juego (persona GL animada, con «Celebration» cuando la res embiste)
     en los tablados y bajo los soportales, y el público instanciado de siempre en balcones, jaulas y barreras.
   Todo respeta las zonas de juego (CLRECT, CLREF, CLCIRC): la res, los recortadores y la cámara funcionan igual. */
const PMX={T:null,S:1};

/* ---------- ruido y pintor PBR en canvas (color, rugosidad, relieve, emisivo) ---------- */
function pmxNoise(seed){const r=mulberry(seed),P=256,g=new Float32Array(P*P);for(let i=0;i<g.length;i++)g[i]=r();
 const noise=(x,y,per)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const x0=((xi%per)+per)%per,y0=((yi%per)+per)%per,x1=(x0+1)%per,y1=(y0+1)%per;
  const a=g[(y0&255)*P+(x0&255)],b=g[(y0&255)*P+(x1&255)],c=g[(y1&255)*P+(x0&255)],d=g[(y1&255)*P+(x1&255)];return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const fbm=(u,v,per,oct=4)=>{let s=0,amp=.5,f=1,n=0;for(let o=0;o<oct;o++){s+=amp*noise(u*per*f,v*per*f,per*f);n+=amp;amp*=.5;f*=2}return s/n};return {noise,fbm}}
class PmxPainter{constructor(w,h,o={}){this.w=w;this.h=h;this.L={};for(const n of ['color','orm','height','emissive']){if(o[n]===false)continue;const c=document.createElement('canvas');c.width=w;c.height=h;this.L[n]={c,ctx:c.getContext('2d')}}
  this.fill(0,0,w,h,{c:o.base||'#808080',r:o.rough??.8,h:.5,e:'#000'})}
 fill(x,y,w,h,p){const L=this.L;if(p.c&&L.color){L.color.ctx.fillStyle=p.c;L.color.ctx.fillRect(x,y,w,h)}
  if(p.r!==undefined&&L.orm){L.orm.ctx.fillStyle=`rgb(0,${Math.round(p.r*255)},${Math.round((p.m||0)*255)})`;L.orm.ctx.fillRect(x,y,w,h)}
  if(p.h!==undefined&&L.height){const v=Math.round(p.h*255);L.height.ctx.fillStyle=`rgb(${v},${v},${v})`;L.height.ctx.fillRect(x,y,w,h)}
  if(p.e!==undefined&&L.emissive){L.emissive.ctx.fillStyle=p.e;L.emissive.ctx.fillRect(x,y,w,h)}}
 pixels(layer,fn){const L=this.L[layer];if(!L)return;const img=L.ctx.getImageData(0,0,this.w,this.h),d=img.data,px=[0,0,0,0];
  for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){const i=(y*this.w+x)*4;px[0]=d[i];px[1]=d[i+1];px[2]=d[i+2];fn(x,y,x/this.w,y/this.h,px);d[i]=px[0];d[i+1]=px[1];d[i+2]=px[2]}L.ctx.putImageData(img,0,0)}
 build(ns=2){const t=(c,srgb)=>{const x=new THREE.CanvasTexture(c);x.wrapS=x.wrapT=THREE.RepeatWrapping;x.anisotropy=W3&&W3.q==='alta'?8:4;if(srgb)x.encoding=THREE.sRGBEncoding;return x};
  const o={};const L=this.L;if(L.color)o.map=t(L.color.c,1);if(L.orm)o.orm=t(L.orm.c,0);if(L.height)o.normalMap=t(pmxNormal(L.height.c,ns),0);if(L.emissive)o.emissiveMap=t(L.emissive.c,1);return o}}
function pmxNormal(hc,str){const w=hc.width,h=hc.height,src=hc.getContext('2d').getImageData(0,0,w,h).data,out=document.createElement('canvas');out.width=w;out.height=h;
 const octx=out.getContext('2d'),img=octx.createImageData(w,h),d=img.data,H=(x,y)=>src[(((y+h)%h)*w+((x+w)%w))*4]/255;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=(H(x+1,y)-H(x-1,y))*str,dy=(H(x,y+1)-H(x,y-1))*str;let nx=-dx,ny=dy,nz=1;const l=Math.hypot(nx,ny,nz),i=(y*w+x)*4;d[i]=(nx/l*.5+.5)*255;d[i+1]=(ny/l*.5+.5)*255;d[i+2]=(nz/l*.5+.5)*255;d[i+3]=255}
 octx.putImageData(img,0,0);return out}
const pmxC=(v,a,b)=>v<a?a:v>b?b:v;
const pmxM2=(p,ppm,x,y,w,h,prop)=>p.fill(Math.round(x*ppm),Math.round(y*ppm),Math.max(1,Math.round(w*ppm)),Math.max(1,Math.round(h*ppm)),prop);
const pmxShade=(hex,k)=>{const c=new THREE.Color(hex);c.multiplyScalar(k);return '#'+c.getHexString()};

/* fachada encalada con balconeras: 4 vanos × 2 plantas = 11,2 × 5,8 m */
function pmxCal(seed,S,{base='#f1ede5',shutter='#5a3b24',timber=false}={}){const TW=11.2,TH=5.8,W=Math.round(2048*S),H=Math.round(W*TH/TW),ppm=W/TW;
 const N=pmxNoise(seed),rnd=mulberry(seed+3),p=new PmxPainter(W,H,{base,rough:.93});const bc=new THREE.Color(base),br=bc.r*255,bg=bc.g*255,bb=bc.b*255;
 p.pixels('color',(x,y,u,v,px)=>{const n=N.fbm(u*2,v,6,4),big=N.fbm(u*2+.31,v+.17,2,3),g=rnd(),dirt=Math.max(0,big-.52)*1.6+(v>.92?(v-.92)*2.2:0),k=1-dirt*.45+(n-.5)*.09+(g-.5)*.035;
  px[0]=pmxC(br*k-dirt*6,0,255);px[1]=pmxC(bg*k-dirt*8,0,255);px[2]=pmxC(bb*k-dirt*14,0,255)});
 p.pixels('height',(x,y,u,v,px)=>{const c=128+(N.fbm(u*2+.5,v+.5,24,3)-.5)*60;px[0]=px[1]=px[2]=c});
 const ctx=p.L.color.ctx;
 for(let fl=0;fl<2;fl++)for(let b=0;b<4;b++){const cx=1.4+b*2.8,fb=(fl+1)*2.9;for(let k=0;k<6;k++){const sx=(cx-.55+rnd()*1.1)*ppm,sy=(fb-.05)*ppm,len=(.4+rnd()*1.4)*ppm,gr=ctx.createLinearGradient(0,sy,0,sy+len);gr.addColorStop(0,'rgba(70,60,48,.22)');gr.addColorStop(1,'rgba(70,60,48,0)');ctx.fillStyle=gr;ctx.fillRect(sx,sy,(.03+rnd()*.06)*ppm,len)}}
 if(timber){const wd=(x,y,w,h)=>pmxM2(p,ppm,x,y,w,h,{c:pmxShade('#3b2a1c',.85+rnd()*.3),r:.82,h:.72});for(let fl=0;fl<=2;fl++)wd(0,fl*2.9-.09,TW,.18);
  for(let b=0;b<=4;b++)for(let fl=0;fl<2;fl++)wd(b*2.8-.08,fl*2.9,.16,2.9);for(let b=0;b<4;b++)for(let fl=0;fl<2;fl++){wd(b*2.8,fl*2.9+1.75,.38,.12);wd(b*2.8+2.42,fl*2.9+1.75,.38,.12)}}
 for(let fl=0;fl<2;fl++)for(let b=0;b<4;b++){const cx=1.4+b*2.8,fb=(fl+1)*2.9-.05,w=1.05,h=2.18,x0=cx-w/2,y0=fb-h,sc=pmxShade(shutter,.85+rnd()*.3);
  for(const sx of [x0-.56,x0+w+.06]){pmxM2(p,ppm,sx,y0,.5,h,{c:sc,r:.55,h:.62});for(let l=.06;l<h-.04;l+=.065)pmxM2(p,ppm,sx+.04,y0+l,.42,.022,{c:pmxShade(sc,.62),h:.56})}
  pmxM2(p,ppm,x0-.13,y0-.16,w+.26,h+.16,{c:pmxShade('#cfc8b9',.92+rnd()*.12),r:.8,h:.66});const on=rnd()<.38;pmxM2(p,ppm,x0,y0,w,h,{c:'#4a3423',r:.6,h:.5});
  for(let c=0;c<2;c++)for(let row=0;row<4;row++)pmxM2(p,ppm,x0+.07+c*.47,y0+.07+row*.52,.4,.45,{c:on?'#3d2f22':'#1b2127',r:.06,h:.38,e:on?(rnd()<.5?'#ffcf8a':'#f6b56a'):'#000'});
  if(rnd()<.5)pmxM2(p,ppm,x0+.07,y0+.07,w-.14,.5+rnd()*.6,{c:on?'#c9a57a':'#5a564f',r:.9,h:.4,e:on?'#6e4a24':'#000'})}
 return Object.assign(p.build(2.4),{tw:TW,th:TH})}
/* planta baja de sillería con puertas y ventanas enrejadas: 11,2 × 3,15 m */
function pmxStone(seed,S){const TW=11.2,TH=3.15,W=Math.round(2048*S),H=Math.round(W*TH/TW),ppm=W/TW,N=pmxNoise(seed),rnd=mulberry(seed+9);
 const p=new PmxPainter(W,H,{base:'#8f897e',rough:.9}),ctx=p.L.color.ctx,hctx=p.L.height.ctx;let y=0;
 while(y<TH-.05){let rh=.28+rnd()*.2;if(TH-(y+rh)<.22)rh=TH-y;let x=-rnd()*.5;
  while(x<TW){const w=.45+rnd()*.6,k=.82+rnd()*.32,c=new THREE.Color().setRGB(.6*k,.575*k,.53*k*(.95+rnd()*.1)),hv=150+rnd()*40;
   for(const ox of [0,TW,-TW]){ctx.fillStyle='#'+c.getHexString();ctx.fillRect((x+ox)*ppm+2,y*ppm+2,w*ppm-4,rh*ppm-4);hctx.fillStyle=`rgb(${hv},${hv},${hv})`;hctx.fillRect((x+ox)*ppm+3,y*ppm+3,w*ppm-6,rh*ppm-6)}x+=w}y+=rh}
 p.pixels('color',(x,yy,u,v,px)=>{const g=rnd(),n=N.fbm(u*3,v,10,4);let k=1+(n-.5)*.25+(g>.97?-.35:g<.03?.25:0)-(v>.85?(v-.85)*1.2:0);if(N.fbm(u*3+3.3,v+1.1,4,3)>.62)k*=.92;
  px[0]=pmxC(px[0]*k,0,255);px[1]=pmxC(px[1]*k,0,255);px[2]=pmxC(px[2]*k,0,255)});
 p.pixels('height',(x,yy,u,v,px)=>{const c=px[0]+(N.fbm(u*3,v,30,3)-.5)*40;px[0]=px[1]=px[2]=pmxC(c,0,255)});
 for(let b=0;b<4;b++){const cx=1.4+b*2.8;
  if(b%2===0){const w=1.2,h=2.35,x0=cx-w/2,y0=TH-h,wc=['#4a2f1c','#3b4a35','#5a2a1e','#2d3640'][(rnd()*4)|0];pmxM2(p,ppm,x0-.18,y0-.22,w+.36,h+.22,{c:'#b3ab9b',r:.85,h:.75});pmxM2(p,ppm,x0,y0,w,h,{c:wc,r:.7,h:.42});
   for(let k=0;k<8;k++)pmxM2(p,ppm,x0+k*.15,y0,.012,h,{c:pmxShade(wc,.6),h:.36});for(let k=0;k<4;k++)for(let j=0;j<6;j++)pmxM2(p,ppm,x0+.12+k*.3,y0+.2+j*.36,.03,.03,{c:'#1a1a1a',r:.4,m:.8,h:.55})}
  else{const w=.9,h=1.1,x0=cx-w/2,y0=TH-1-h,on=rnd()<.4;pmxM2(p,ppm,x0-.15,y0-.15,w+.3,h+.3,{c:'#b9b1a1',r:.85,h:.75});pmxM2(p,ppm,x0,y0,w,h,{c:on?'#3b2e22':'#161b20',r:.08,h:.35,e:on?'#e8a95e':'#000'});
   for(let k=1;k<6;k++)pmxM2(p,ppm,x0+k*w/6-.012,y0,.025,h,{c:'#151515',r:.45,m:.8,h:.62,e:'#000'});for(const q of [.25,.85])pmxM2(p,ppm,x0,y0+q,w,.025,{c:'#151515',r:.45,m:.8,h:.62,e:'#000'})}}
 return Object.assign(p.build(3),{tw:TW,th:TH})}
/* teja árabe, 3 × 3 m */
function pmxRoof(seed,S){const W=Math.round(1024*S),N=pmxNoise(seed),rnd=mulberry(seed),p=new PmxPainter(W,W,{base:'#a5552f',rough:.8,emissive:false}),cols=15,rows=7,tint=[];
 for(let i=0;i<cols*rows;i++)tint.push([.78+rnd()*.32,rnd()]);
 p.pixels('color',(x,y,u,v,px)=>{const cu=u*cols,rv=v*rows,ci=Math.floor(cu),ri=Math.floor(rv+(ci%2)*.5)%rows,[k,hue]=tint[(ri*cols+ci)%tint.length],n=N.fbm(u,v,8,4),li=N.fbm(u+7.1,v+2.3,6,3);
  let r=168*k,g=(82+hue*22)*k,b=(44+hue*10)*k;const f=1+(n-.5)*.35;r*=f;g*=f;b*=f;const ty=rv+(ci%2)*.5-Math.floor(rv+(ci%2)*.5);if(ty>.9){r*=.55;g*=.55;b*=.55}
  if(li>.71){const a=Math.min(.7,(li-.71)*5);r=r*(1-a)+130*a;g=g*(1-a)+118*a;b=b*(1-a)+80*a}px[0]=pmxC(r,0,255);px[1]=pmxC(g,0,255);px[2]=pmxC(b,0,255)});
 p.pixels('height',(x,y,u,v,px)=>{const cu=u*cols,ci=Math.floor(cu),t=cu-ci,rv=v*rows+(ci%2)*.5,ty=rv-Math.floor(rv),pr=ci%2===0?.55+.42*Math.sin(Math.PI*t):.42-.3*Math.sin(Math.PI*t);const c=(pr-ty*.12)*255;px[0]=px[1]=px[2]=pmxC(c,0,255)});
 p.pixels('orm',(x,y,u,v,px)=>{px[1]=190+N.fbm(u,v,6,3)*60});return p.build(5)}
/* arena con huellas, 5 × 5 m */
function pmxSand(seed,S){const W=Math.round(1024*S),ppm=W/5,N=pmxNoise(seed),rnd=mulberry(seed),p=new PmxPainter(W,W,{base:'#b39570',rough:.97,emissive:false});
 p.pixels('color',(x,y,u,v,px)=>{const n=N.fbm(u,v,6,5),big=N.fbm(u+.4,v+.9,2,3),g=rnd(),k=1+(n-.5)*.22+(big-.5)*.18+(g-.5)*.12;px[0]=pmxC(184*k,0,255);px[1]=pmxC(152*k,0,255);px[2]=pmxC(112*k,0,255);if(g>.993){const s=rnd()<.5?.55:1.25;px[0]*=s;px[1]*=s;px[2]*=s}});
 p.pixels('height',(x,y,u,v,px)=>{const c=128+(N.fbm(u,v,16,4)-.5)*50+(rnd()-.5)*22;px[0]=px[1]=px[2]=pmxC(c,0,255)});
 const h=p.L.height.ctx,c=p.L.color.ctx;
 const dent=(x,y,rx,ry,rot,dep,dark)=>{for(const ox of [-W,0,W])for(const oy of [-W,0,W]){h.save();h.translate(x+ox,y+oy);h.rotate(rot);h.scale(rx,ry);const gr=h.createRadialGradient(0,0,0,0,0,1);gr.addColorStop(0,`rgba(0,0,0,${dep})`);gr.addColorStop(.8,`rgba(0,0,0,${dep*.6})`);gr.addColorStop(1,'rgba(255,255,255,.18)');h.fillStyle=gr;h.beginPath();h.arc(0,0,1,0,7);h.fill();h.restore();
  c.save();c.translate(x+ox,y+oy);c.rotate(rot);c.scale(rx,ry);c.fillStyle=`rgba(70,50,30,${dark})`;c.beginPath();c.arc(0,0,1,0,7);c.fill();c.restore()}};
 for(let k=0;k<90;k++)dent(rnd()*W,rnd()*W,.05*ppm,.12*ppm,rnd()*6.28,.2+rnd()*.15,.04+rnd()*.04);
 for(let k=0;k<60;k++){const x=rnd()*W,y=rnd()*W,a=rnd()*6.28,cc=Math.cos(a),s=Math.sin(a);dent(x+cc*.03*ppm,y+s*.03*ppm,.028*ppm,.055*ppm,a,.35,.07);dent(x-cc*.03*ppm,y-s*.03*ppm,.028*ppm,.055*ppm,a,.35,.07)}
 return p.build(3.2)}
/* enlosado de granito, 4 × 4 m */
function pmxPaving(seed,S){const W=Math.round(1024*S),M_=4,ppm=W/M_,N=pmxNoise(seed),rnd=mulberry(seed),p=new PmxPainter(W,W,{base:'#5e5a53',rough:.85,emissive:false}),ctx=p.L.color.ctx,h=p.L.height.ctx;
 h.fillStyle='rgb(70,70,70)';h.fillRect(0,0,W,W);let y=0;
 while(y<M_-.01){let rh=.45+rnd()*.4;if(M_-(y+rh)<.4)rh=M_-y;let x=0;const off=rnd()*M_;
  while(x<M_-.01){let w=.6+rnd()*.7;if(M_-(x+w)<.5)w=M_-x;const k=.88+rnd()*.22,c=new THREE.Color().setRGB(.68*k,.665*k,.635*k),hv=140+rnd()*30,pad=.012*ppm;
   for(const OX of [((x+off)%M_)*ppm,((x+off)%M_-M_)*ppm]){ctx.fillStyle='#'+c.getHexString();ctx.fillRect(OX+pad,y*ppm+pad,w*ppm-2*pad,rh*ppm-2*pad);h.fillStyle=`rgb(${hv},${hv},${hv})`;h.fillRect(OX+pad*1.5,y*ppm+pad*1.5,w*ppm-3*pad,rh*ppm-3*pad)}x+=w}y+=rh}
 p.pixels('color',(x,yy,u,v,px)=>{const g=rnd(),k=1+(N.fbm(u,v,8,4)-.5)*.2+(g>.975?-.4:g<.025?.22:0);px[0]=pmxC(px[0]*k,0,255);px[1]=pmxC(px[1]*k,0,255);px[2]=pmxC(px[2]*k,0,255)});
 p.pixels('height',(x,yy,u,v,px)=>{const c=px[0]+(N.fbm(u,v,32,3)-.5)*30;px[0]=px[1]=px[2]=pmxC(c,0,255)});return p.build(3.5)}
/* granito labrado 1,5 m · pintura amarilla 2 m · madera 1,5 m */
function pmxGranite(seed,S){const W=Math.round(512*S),N=pmxNoise(seed),rnd=mulberry(seed),p=new PmxPainter(W,W,{base:'#a7a297',rough:.78,emissive:false});
 p.pixels('color',(x,y,u,v,px)=>{const g=rnd(),k=1+(N.fbm(u,v,4,4)-.5)*.18+(g>.94?-.45:g<.06?.2:0)-Math.max(0,N.fbm(u+3,v+1,3,3)-.6)*.8;px[0]=pmxC(167*k,0,255);px[1]=pmxC(162*k,0,255);px[2]=pmxC(151*k,0,255)});
 p.pixels('height',(x,y,u,v,px)=>{const c=128+(N.fbm(u,v,24,3)-.5)*60+(rnd()-.5)*30;px[0]=px[1]=px[2]=pmxC(c,0,255)});return p.build(2)}
function pmxYellow(seed,S){const W=Math.round(512*S),N=pmxNoise(seed),rnd=mulberry(seed),p=new PmxPainter(W,W,{base:'#e2bc3c',rough:.7,emissive:false});
 p.pixels('color',(x,y,u,v,px)=>{const ch=N.fbm(u+2,v+5,8,4),g=rnd();if(ch>.76){const k=.95+(g-.5)*.2;px[0]=150*k;px[1]=146*k;px[2]=136*k;return}const k=1+(N.fbm(u,v,4,4)-.5)*.16+(g-.5)*.04;px[0]=pmxC(226*k,0,255);px[1]=pmxC(186*k,0,255);px[2]=pmxC(58*k,0,255)});
 p.pixels('height',(x,y,u,v,px)=>{const ch=N.fbm(u+2,v+5,8,4),c=(ch>.76?100:140)+(N.fbm(u,v,30,2)-.5)*30;px[0]=px[1]=px[2]=c});return p.build(2.5)}
function pmxWood(seed,S){const W=Math.round(512*S),N=pmxNoise(seed),rnd=mulberry(seed),p=new PmxPainter(W,W,{base:'#5d4029',rough:.82,emissive:false}),pl=10,pk=[];for(let i=0;i<pl;i++)pk.push(.75+rnd()*.45);
 p.pixels('color',(x,y,u,v,px)=>{const i=Math.floor(u*pl),t=u*pl-i,gr=N.fbm(u*.5+i*.13,v,2,3)*.5+N.noise(u*pl*3,v*60,60)*.5;let f=pk[i]*(.85+gr*.3);if(t<.04||t>.96)f*=.45;px[0]=pmxC(108*f,0,255);px[1]=pmxC(76*f,0,255);px[2]=pmxC(50*f,0,255)});
 p.pixels('height',(x,y,u,v,px)=>{const t=u*pl-Math.floor(u*pl),c=(t<.04||t>.96)?70:140+(N.noise(u*pl*3,v*60,60)-.5)*50;px[0]=px[1]=px[2]=c});return p.build(2)}
function pmxTextures(){const S=W3&&W3.q==='alta'?.75:W3&&W3.q==='baja'?.375:.5;if(PMX.T&&PMX.S===S)return PMX.T;PMX.S=S;
 PMX.T={calA:pmxCal(101,S,{shutter:'#5a3b24'}),calB:pmxCal(202,S,{shutter:'#38573a'}),calC:pmxCal(303,S,{shutter:'#2f5378'}),calT:pmxCal(404,S,{shutter:'#4a3424',timber:true}),
  stone:pmxStone(505,S),roof:pmxRoof(606,S),sand:pmxSand(707,S),paving:pmxPaving(808,S),granite:pmxGranite(909,S),yellow:pmxYellow(1001,S),wood:pmxWood(1102,S)};return PMX.T}

/* ---------- geometría combinada por material ---------- */
class PmxGeo{constructor(){this.pos=[];this.nor=[];this.uv=[];this.col=[];this.idx=[];this.n=0}
 quad(a,b,c,d,uv,col=[1,1,1]){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
  for(const p of [a,b,c,d]){this.pos.push(p[0],p[1],p[2]);this.nor.push(nx,ny,nz);this.col.push(col[0],col[1],col[2])}this.uv.push(...uv);const n=this.n;this.idx.push(n,n+1,n+2,n,n+2,n+3);this.n+=4}
 // cuadrilátero orientado hacia «want»
 q(a,b,c,d,uv,col,want){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2];const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
  if(nx*want[0]+ny*want[1]+nz*want[2]>=0)this.quad(a,b,c,d,uv,col);else this.quad(a,d,c,b,[uv[0],uv[1],uv[6],uv[7],uv[4],uv[5],uv[2],uv[3]],col)}
 wall(p0,p1,y0,y1,tw,th,col,n,uOff=0,vBase=y0){const len=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),u0=uOff,u1=uOff+len/tw,v0=(y0-vBase)/th,v1=(y1-vBase)/th;
  this.q([p0[0],y0,p0[1]],[p1[0],y0,p1[1]],[p1[0],y1,p1[1]],[p0[0],y1,p0[1]],[u0,v0,u1,v0,u1,v1,u0,v1],col,[n[0],0,n[1]])}
 box(cx,cy,cz,w,h,d,s=1,col=[1,1,1]){const x0=cx-w/2,x1=cx+w/2,z0=cz-d/2,z1=cz+d/2,y0=cy-h/2,y1=cy+h/2;
  this.wall([x0,z1],[x1,z1],y0,y1,s,s,col,[0,1]);this.wall([x1,z0],[x0,z0],y0,y1,s,s,col,[0,-1]);this.wall([x1,z1],[x1,z0],y0,y1,s,s,col,[1,0]);this.wall([x0,z0],[x0,z1],y0,y1,s,s,col,[-1,0]);
  this.q([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[x0/s,-z1/s,x1/s,-z1/s,x1/s,-z0/s,x0/s,-z0/s],col,[0,1,0]);this.q([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,0,1,0,1,1,0,1],col,[0,-1,0])}
 top(x0,z0,x1,z1,y,s,col){this.q([x0,y,z1],[x1,y,z1],[x1,y,z0],[x0,y,z0],[x0/s,-z1/s,x1/s,-z1/s,x1/s,-z0/s,x0/s,-z0/s],col,[0,1,0])}
 build(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.nor,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(this.uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(this.col,3));g.setIndex(this.idx);g.computeBoundingSphere();return g}}
/* cara de fachada: origen, normal exterior n y dirección a lo largo d=(nz,-nx) */
class PmxFace{constructor(ox,oz,nx,nz){this.ox=ox;this.oz=oz;this.nx=nx;this.nz=nz;this.dx=nz;this.dz=-nx}
 pt(s,t){return [this.ox+this.dx*s+this.nx*t,this.oz+this.dz*s+this.nz*t]}
 box(G,s0,s1,t0,t1,y0,y1,col,sc=1){const a=this.pt(s0,t0),b=this.pt(s1,t1),x0=Math.min(a[0],b[0]),x1=Math.max(a[0],b[0]),z0=Math.min(a[1],b[1]),z1=Math.max(a[1],b[1]);G.box((x0+x1)/2,(y0+y1)/2,(z0+z1)/2,x1-x0,y1-y0,z1-z0,sc,col)}
 yaw(){return Math.atan2(this.nx,this.nz)}}
const pmxHex=h=>{const c=new THREE.Color(h);return [c.r,c.g,c.b]};

/* ---------- construcción de la escena ---------- */
buildCalle=function(night){
 const sc=new THREE.Scene(),G0=geos(),T=pmxTextures(),q=W3.q||'media',rnd=mulberry(12+(typeof locSeed==='function'?locSeed():0)+(night?9:0));
 const sky=night?'#0e1630':'#a9cbe6';sc.background=new THREE.Color(sky);sc.fog=new THREE.Fog(sky,night?40:70,night?140:220);
 sc.add(new THREE.HemisphereLight(night?'#5a6a9a':'#eef3f8',night?'#2a1e14':'#8a6a48',night?.38:.7));
 const sun=new THREE.DirectionalLight(night?'#9fb4e8':'#fff0d6',night?.35:1.3);sun.position.set(night?-30:38,60,night?20:26);sun.castShadow=true;sun.shadow.mapSize.set(q==='alta'?2048:1024,q==='alta'?2048:1024);
 Object.assign(sun.shadow.camera,{left:-70,right:70,top:50,bottom:-50,near:1,far:200});sun.shadow.bias=-.0006;sc.add(sun);sc.add(sun.target);
 if(night){const st=new THREE.BufferGeometry(),p=[],r=mulberry(3);for(let i=0;i<700;i++){const a=r()*6.28,e=.15+r()*1.3,R2=180;p.push(Math.cos(a)*Math.cos(e)*R2,Math.sin(e)*R2,Math.sin(a)*Math.cos(e)*R2)}st.setAttribute('position',new THREE.Float32BufferAttribute(p,3));sc.add(new THREE.Points(st,new THREE.PointsMaterial({color:'#ffffff',size:.9,sizeAttenuation:false})))}
 else{const dome=new THREE.Mesh(new THREE.SphereGeometry(240,24,12),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{},vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float h;void main(){vec3 a=vec3(.93,.95,.96),b=vec3(.36,.6,.86);gl_FragColor=vec4(mix(a,b,smoothstep(-.05,.55,h)),1.);}'}));dome.userData.dome=1;sc.add(dome)}
 // materiales
 const std=(t,x={})=>new THREE.MeshStandardMaterial(Object.assign({map:t.map,normalMap:t.normalMap,roughnessMap:t.orm,roughness:1,metalness:0,vertexColors:true},x));
 const MT={};for(const k of ['calA','calB','calC','calT','stone'])MT[k]=std(T[k],{emissive:new THREE.Color(1,1,1),emissiveMap:T[k].emissiveMap,emissiveIntensity:night?1:0});
 MT.roof=std(T.roof);MT.granite=std(T.granite);MT.yellow=std(T.yellow);MT.wood=std(T.wood);MT.paving=std(T.paving);
 MT.iron=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.5,metalness:.7,vertexColors:true});MT.paint=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.42,metalness:.35,vertexColors:true});
 MT.fabric=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.92,vertexColors:true,side:THREE.DoubleSide});MT.glow=new THREE.MeshBasicMaterial({color:night?'#ffd9a0':'#7a6e5c',vertexColors:true});
 const G={};for(const k in MT)G[k]=new PmxGeo();
 CL.balc=[];CL.lamps=[];const LAN=[];
 CL.pmxGLB=typeof PMXP!=='undefined'&&q!=='baja'&&!!THREE.GLTFLoader;CL.pmxProps={silla:[],gallinera:[],mesa:[],banco:[],jardinera:[],barrica:[],caja:[]};
 // suelo: enlosado de granito (el plano de 200 m conserva el relieve que añade texturas.js) y arena en todo el recorrido
 T.paving.map.repeat.set(50,30);T.paving.normalMap.repeat.set(50,30);T.paving.orm.repeat.set(50,30);
 const gnd=new THREE.Mesh(new THREE.PlaneGeometry(200,120),new THREE.MeshStandardMaterial({map:T.paving.map,roughnessMap:T.paving.orm,roughness:1,normalMap:T.paving.normalMap}));gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;sc.add(gnd);
 const sandM=new THREE.MeshStandardMaterial({map:T.sand.map,normalMap:T.sand.normalMap,roughnessMap:T.sand.orm,roughness:1,vertexColors:true});sandM.normalScale=new THREE.Vector2(1.2,1.2);
 const N=pmxNoise(4242);
 const sandRect=(x0,x1,z0,z1)=>{const w=x1-x0,d=z1-z0,g=new THREE.PlaneGeometry(w,d,Math.max(2,Math.round(w/.8)),Math.max(2,Math.round(d/.8)));g.rotateX(-Math.PI/2);g.translate((x0+x1)/2,0,(z0+z1)/2);
  const p=g.attributes.position,uv=g.attributes.uv,col=[];for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),edge=Math.min(x-x0,x1-x,z-z0,z1-z);
   p.setY(i,.035+(N.fbm(x/40+.5,z/40+.5,4,3)-.5)*.04+(edge<.6?(.6-edge)*.06:0));uv.setXY(i,x/5,-z/5);const wet=N.fbm(x/30+3.3,z/30+7.1,3,3),k=1-Math.max(0,wet-.58)*1.6-(edge<.8?(.8-edge)*.08:0);col.push(k,k*.98,k*.95)}
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.Mesh(g,sandM);m.receiveShadow=true;sc.add(m)};
 sandRect(-14.2,14.2,-11.2,11.2);sandRect(14.2,CL.o&&CL.o.tipo==='mar'&&typeof MAR!=='undefined'?MAR.x:64,-4,4);sandRect(-64,-14.2,-4,4);sandRect(-3.5,3.5,11.2,47);
 // ---------- casas ----------
 const PAL=typeof locPal==='function'?locPal():FACOL,styles=['calA','calA','calB','calC','calT','calA','calB'];
 const house=(a0,a1,line,axis,face,o={})=>{let a=a0;while(a<a1-.1){let w=[5.6,8.4,8.4,11.2][(rnd()*4)|0];if(a1-(a+w)<4.5)w=a1-a;pmxHouse(G,MT,T,rnd,a,a+w,line,axis,face,styles[(rnd()*styles.length)|0],pmxHex(PAL[(rnd()*PAL.length)|0]),o,LAN);a+=w}};
 // plaza: fondo con soportales (antes la iglesia), frente con salida al cajón y laterales con las calles
 house(-21,21,-11,'x',1,{arcade:1,plaza:1,fl:[2,3]});house(-21,-3.5,11,'x',-1,{plaza:1,fl:[2,3]});house(3.5,21,11,'x',-1,{plaza:1,fl:[2,3]});
 house(-11,-4,14,'z',-1,{plaza:1,fl:[2,3]});house(4,11,14,'z',-1,{plaza:1,fl:[2,3]});house(-11,-4,-14,'z',1,{plaza:1,fl:[2,3]});house(4,11,-14,'z',1,{plaza:1,fl:[2,3]});
 house(21,64,4,'x',-1);house(21,64,-4,'x',1);house(-64,-21,4,'x',-1);house(-64,-21,-4,'x',1);house(18,46,3.5,'z',-1);house(18,46,-3.5,'z',1);house(-4,4,66,'z',-1);house(-4,4,-66,'z',1);
 // ---------- cadafales en los refugios de la plaza ----------
 const PNT=[[.12,.3,.75],[.1,.45,.22],[.72,.08,.06],[.95,.72,.08],[.92,.92,.9],[.9,.35,.05],[.25,.55,.85]];
 const PEN=['PENYA EL BOU','LA TRONADA','ELS XICS','EL RACÓ','PENYA MIGJORN','LA CORDA','ELS DE SEMPRE','PENYA LA TRACA','EL CORRAL','ELS BOUERS'];let pi=(typeof locSeed==='function'?locSeed():0)%PEN.length;
 const BCOL=[['#c8102e','#ffffff'],['#ffffff','#1d3f8f'],['#f2c200','#1a1a1a'],['#0f5c2e','#ffffff'],['#1a1a1a','#f2c200'],['#ffffff','#c8102e']];
 CL.pmxDeck=[];
 // toda la plaza rodeada de cadafales: solo quedan abiertas las bocas de las tres calles
 if(!CLREF.some(r=>r.pm))CLREF.push({x0:-10.6,x1:7.8,z0:-10.9,z1:-7.6,cad:1,pm:1},{x0:10.6,x1:13.9,z0:4.2,z1:7.6,cad:1,pm:1},{x0:-13.9,x1:-10.6,z0:4.2,z1:7.6,cad:1,pm:1});
 for(const rf of CLREF.filter(r=>r.cad)){const w=rf.x1-rf.x0,d=rf.z1-rf.z0,long=w>d;let f,len,dep;
  if(long){dep=d;len=w;if((rf.z0+rf.z1)/2>0)f=new PmxFace(rf.x1,rf.z1,0,-1);else f=new PmxFace(rf.x0,rf.z0,0,1)}else{dep=w;len=d;if((rf.x0+rf.x1)/2>0)f=new PmxFace(rf.x1,rf.z0,-1,0);else f=new PmxFace(rf.x0,rf.z1,1,0)}
  // módulos de distinto color a lo largo del cadafal
  let s=0;while(s<len-.3){let m=Math.min(len-s,3+((rnd()*3)|0)*1.2);if(len-(s+m)<2)m=len-s;
   pmxCadafal(G,sc,f,s,s+m,dep,PNT[(rnd()*PNT.length)|0],rnd()<.65?{t:PEN[pi++%PEN.length],c:BCOL[(rnd()*BCOL.length)|0]}:null,rnd()<.35,rnd);s+=m}}
 // escaleras de acero azules que bajan de dos cadafales a la arena (también son refugio)
 if(!CLREF.some(r=>r.esc)){CLREF.push({x0:-7.45,x1:-5.85,z0:4.9,z1:7.6,cad:0,esc:1},{x0:7.9,x1:10.6,z0:-8.45,z1:-6.85,cad:0,esc:1})}
 for(const rf of CLREF.filter(r=>r.esc))pmxStair(G,sc,rf);
 // ---------- talanqueras de tubo en las calles y al final ----------
 for(const rf of CLREF.filter(r=>!r.cad&&!r.esc)){const vert=rf.bar,L=vert?rf.z1-rf.z0:rf.x1-rf.x0,ln=vert?(rf.x0>0?rf.x0:rf.x1):(rf.z0>0?rf.z0:rf.z1),col=vert?[.85,.12,.08]:rnd()<.5?[.1,.3,.75]:[.85,.12,.08];
  const at=(t,y,hw,hh,dd)=>{const x=vert?ln:rf.x0+t,z=vert?rf.z0+t:ln;G.paint.box(x,y,z,vert?dd:hw,hh,vert?hw:dd,1,col)};
  for(let t=.02;t<=L;t+=.26)at(t,1,.05,2,.05);for(const y of [.35,1.2,2])at(L/2,y,L,.07,.08);for(let t=0;t<=L+.01;t+=1.2)at(Math.min(t,L-.05),1.05,.09,2.1,.09);
  if(vert)for(let i=0;i<22;i++)CL.crowd.push([ln+(rf.x0>0?1:-1)*R(.6,3.2),0,R(rf.z0+.3,rf.z1-.3),rf.x0>0?-Math.PI/2:Math.PI/2,0])}
 // ---------- refugio amarillo y fuente de granito (CLCIRC) ----------
 pmxRefugio(G,CLCIRC[0],LAN);pmxFuente(sc,G,CLCIRC[1],MT,T);
 // ---------- cajón ----------
 const cj=new THREE.Group();cj.position.set(0,0,43.6);sc.add(cj);mesh(G0.box,M('#e6e2d6',.7),5.2,3.4,7,0,2.2,3,cj);mesh(G0.box,M('#2d2d2d'),5.2,.8,7,0,.4,3,cj,true);mesh(G0.box,M('#bf3a3f',.6),5.25,.5,7.05,0,3.2,3,cj,true);
 const door=mesh(G0.box,M('#4a4f55',.5,.5),2.2,2.6,.1,0,1.9,-.55,cj);CL.door=door;for(const s of [-1,1])mesh(G0.box,M('#4a4f55',.5,.5),.12,3,.12,s*1.2,1.5,-.55,cj);mesh(G0.box,M('#4a4f55',.5,.5),7,2.2,.12,0,1.1,6.8,cj);
 // ---------- combinar geometría ----------
 for(const k in G){const g=G[k];if(!g.n)continue;const m=new THREE.Mesh(g.build(),MT[k]);m.castShadow=!['glow'].includes(k);m.receiveShadow=k!=='glow';sc.add(m)}
 // faroles: charcos de luz de noche
 if(night&&LAN.length){const dt=new THREE.CanvasTexture((()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,214,160,.9)');g.addColorStop(1,'rgba(255,214,160,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return c})());
  const dm=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:dt,transparent:true,opacity:.32,blending:THREE.AdditiveBlending,depthWrite:false}),LAN.length),o=new THREE.Object3D();
  LAN.forEach((l,i)=>{o.position.set(l[0],.08,l[2]);o.scale.set(l[3]||6,1,l[3]||6);o.updateMatrix();dm.setMatrixAt(i,o.matrix)});dm.renderOrder=2;sc.add(dm)}
 for(const l of LAN)CL.lamps.push(new THREE.Vector3(l[0],l[1],l[2]));
 // ---------- banderines ----------
 const tri=new THREE.BufferGeometry();tri.setAttribute('position',new THREE.Float32BufferAttribute([-.14,0,0,.14,0,0,0,-.28,0],3));tri.computeVertexNormals();
 const fl=[];const strand=(ax,az,bx,bz,yy)=>{const n=Math.floor(Math.hypot(bx-ax,bz-az)/.36);for(let i=0;i<n;i++){const t=i/n;fl.push([ax+(bx-ax)*t,yy-Math.sin(t*Math.PI)*.9,az+(bz-az)*t,Math.atan2(bx-ax,bz-az)])}};
 for(let x=24;x<62;x+=7)strand(x,-4,x+2,4,6.4);for(let x=-24;x>-62;x-=7)strand(x,-4,x-2,4,6.4);for(let z=20;z<42;z+=6)strand(-3.5,z,3.5,z+1.5,6.2);
 strand(-14,-11,14,11,8.2);strand(-14,11,14,-11,8.2);strand(-14,-3,14,1,8.4);strand(-7,-11,-5,11,8.3);strand(7,-11,5,11,8.3);
 const fcol=['#c0303a','#e6bb55','#2b5aa0','#f4f0e6','#1f6b3a','#e06a10'].map(c=>new THREE.Color(c));
 const fim=new THREE.InstancedMesh(tri,new THREE.MeshStandardMaterial({side:THREE.DoubleSide,roughness:.8,emissive:night?'#332211':'#000000'}),fl.length),o=new THREE.Object3D();
 fl.forEach((f,i)=>{o.position.set(f[0],f[1],f[2]);o.rotation.set((rnd()-.5)*.3,f[3]+Math.PI/2,0);o.updateMatrix();fim.setMatrixAt(i,o.matrix);fim.setColorAt(i,fcol[i%fcol.length])});fim.castShadow=true;sc.add(fim);
 if(night){const bulbs=new THREE.InstancedMesh(new THREE.SphereGeometry(.06,6,4),new THREE.MeshBasicMaterial({color:'#ffd27a'}),Math.ceil(fl.length/3));let k=0;fl.forEach((f,i)=>{if(i%3)return;o.position.set(f[0],f[1]+.02,f[2]);o.rotation.set(0,0,0);o.updateMatrix();bulbs.setMatrixAt(k++,o.matrix)});sc.add(bulbs);
  for(const p of [[0,7,0],[9,6,6],[-9,6,-6],[30,6,0],[-30,6,0],[0,6,26],[48,6,0],[-48,6,0]]){const l=new THREE.PointLight('#ffc879',1.25,26,1.6);l.position.set(...p);sc.add(l)}sc.add(new THREE.AmbientLight('#3a4466',.35))}
 // ---------- público ----------
 const r2=mulberry(5);for(const b of CL.balc)CL.crowd.push([b[0],b[1],b[2],b[3],0]);
 for(let i=0;i<12;i++)CL.crowd.push([R(-12.5,12.5),.03,-11.45-r2()*.5,0,0]); // bajo los soportales
 const crowd=CL.crowd,pc=['#f4f2ee','#f4f2ee','#f4f2ee','#c42a2a','#f4f2ee','#b8232a','#3a4b6e','#262626','#efe7da','#2b5aa0','#1f6b3a','#e6bb55'].map(c=>new THREE.Color(c));
 const bodyI=new THREE.InstancedMesh(new THREE.CylinderGeometry(.2,.17,.62,10),new THREE.MeshStandardMaterial({roughness:.8}),crowd.length),headI=new THREE.InstancedMesh(new THREE.SphereGeometry(.12,10,8),M('#c79a74',.7),crowd.length),legI=new THREE.InstancedMesh(new THREE.BoxGeometry(.3,.75,.2),M('#2a2d36',.8),crowd.length);
 const hairI=new THREE.InstancedMesh(new THREE.SphereGeometry(.13,10,6,0,Math.PI*2,0,Math.PI*.5),M('#2a1c12',.9),crowd.length),armI=new THREE.InstancedMesh(new THREE.BoxGeometry(.09,.5,.1),new THREE.MeshStandardMaterial({roughness:.8}),crowd.length*2);
 const piel=['#e7bd98','#d6a37d','#c08a63','#a5734f','#f0caa6'].map(c=>new THREE.Color(c));
 crowd.forEach((c,i)=>{c.w=r2();const col=pc[Math.floor(c.w*977)%pc.length];bodyI.setColorAt(i,col);armI.setColorAt(i*2,col);armI.setColorAt(i*2+1,col);headI.setColorAt(i,piel[i%piel.length])});
 for(const im of [bodyI,headI,legI,hairI,armI])im.castShadow=true;CL.bodyI=bodyI;CL.headI=headI;CL.legI=legI;CL.hairI=hairI;CL.armI=armI;sc.add(bodyI,headI,legI,hairI,armI);crowdPose(0,0);
 // personajes reales del juego en primera fila de los tablados y bajo los soportales
 CL.pmxSpec=[];const nGL=q==='alta'?20:q==='media'?12:4,spots=CL.pmxDeck.slice();for(let i=spots.length-1;i>0;i--){const j=Math.floor(r2()*(i+1));[spots[i],spots[j]]=[spots[j],spots[i]]}
 const sp2=[...spots.slice(0,Math.max(0,nGL-2)),[-4.5,.04,-11.7,0],[5.5,.04,-11.9,0]];
 for(const s of sp2.slice(0,nGL)){try{const P=makePerson({gl:1,jacket:pick(['#f4f4f0','#c42a2a','#2b5aa0','#1f6b3a','#e6bb55','#f4f4f0','#3a3a3a']),mangas:r2()<.5?false:undefined,pants:pick(['#2c3e5c','#20242c','#3a4a6a','#d8d2c4']),belt:pick(['#c42a2a','#141414']),boots:'#ececec',hair:pick(['#231812','#3b2a1c','#151010','#8a6a48'])});
  P.root.position.set(s[0],s[1],s[2]);P.root.rotation.y=s[3]+(r2()-.5)*.4;sc.add(P.root);CL.pmxSpec.push({P,t:r2()*3,ch:0})}catch(e){}}
 try{pmxPropsPlace(sc,CL.pmxProps)}catch(e){console.warn('props',e)}
 CL.D=dustPool(sc);return sc};

/* casa de un lote: fachada, planta baja, tejado, balcones o galería, farol y soportales */
function pmxHouse(G,MT,T,rnd,a0,a1,line,axis,face,style,tint,o,LAN){const d=7,fl=o.fl?o.fl[0]-1+((rnd()*(o.fl[1]-o.fl[0]+1))|0):1+((rnd()*2)|0),GF=3.3,FH=2.9,H=.02+GF+fl*FH;
 let x0,x1,z0,z1;if(axis==='x'){x0=a0;x1=a1;z0=face>0?line-d:line;z1=face>0?line:line+d}else{z0=a0;z1=a1;x0=face>0?line-d:line;x1=face>0?line:line+d}
 const n=axis==='x'?[0,face]:[face,0];const arc=!!o.arcade,AD=2.4;
 const faces=[{p0:[x0,z1],p1:[x1,z1],n:[0,1]},{p0:[x1,z0],p1:[x0,z0],n:[0,-1]},{p0:[x1,z1],p1:[x1,z0],n:[1,0]},{p0:[x0,z0],p1:[x0,z1],n:[-1,0]}];
 const front=f=>f.n[0]===n[0]&&f.n[1]===n[1],uT=T[style],sT=T.stone;
 for(const f of faces){const fr=front(f);let p0=f.p0,p1=f.p1;
  if(arc&&fr){const b0=[p0[0]-f.n[0]*AD,p0[1]-f.n[1]*AD],b1=[p1[0]-f.n[0]*AD,p1[1]-f.n[1]*AD];G.stone.wall(b0,b1,.02,GF+.02,sT.tw,sT.th,[1,1,1],f.n,0,.02);
   G.wood.q([b0[0],GF+.02,b0[1]],[b1[0],GF+.02,b1[1]],[p1[0],GF+.02,p1[1]],[p0[0],GF+.02,p0[1]],[0,0,6,0,6,1.6,0,1.6],[.8,.8,.8],[0,-1,0]);
   G.paving.top(Math.min(p0[0],b1[0]),Math.min(p0[1],b1[1]),Math.max(p0[0],b1[0]),Math.max(p0[1],b1[1]),.025,4,[.92,.92,.92])}
  else{G.stone.wall(p0,p1,.02,GF+.02,sT.tw,sT.th,[1,1,1],f.n,fr?0:.37,.02);if(fr){const e=[f.n[0]*.04,f.n[1]*.04];G.granite.wall([p0[0]+e[0],p0[1]+e[1]],[p1[0]+e[0],p1[1]+e[1]],.02,.45,1.5,1.5,[.72,.7,.66],f.n)}}
  G[style].wall(p0,p1,GF+.02,H,uT.tw,uT.th,tint,f.n,fr?0:.5,GF+.02);
  const len=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),fc=new PmxFace(p0[0],p0[1],f.n[0],f.n[1]);fc.box(G.granite,0,len,-.02,.09,GF-.01,GF+.17,[.85,.83,.79])}
 // soportales: columnas de granito con zapatas, viga y mesas de café
 if(arc){const fz=n[1]>0?z1:z0,cnt=Math.max(2,Math.round((x1-x0)/3.2));for(let k=0;k<=cnt;k++){const x=x0+.25+(x1-x0-.5)*(k/cnt);if(Math.abs(x)>13.8)continue;const z=fz-n[1]*.3;
   G.granite.box(x,.17,z,.5,.3,.5,1.5,[.8,.78,.74]);pmxColumn(G.granite,x,z,.32,2.5);G.granite.box(x,2.88,z,.46,.12,.46,1.5,[.85,.83,.79]);G.wood.box(x,3.03,z,.9,.18,.38,1.5,[.75,.72,.7])}
  G.wood.box((x0+x1)/2,3.2,fz-n[1]*.3,x1-x0,.2,.3,1.5,[.7,.66,.62]);
  const PR_=CL.pmxProps;for(let x=x0+2;x<x1-1.5;x+=4.2){if(Math.abs(x)>12.5||rnd()<.25)continue;if(CL.pmxGLB)PR_.mesa.push({x,z:fz-n[1]*1.3,yaw:rnd()<.5?Math.PI/2:-Math.PI/2});else pmxTable(G,x,fz-n[1]*1.3)}
  // junto a la pared del soportal: bancos, sillas de anea y jardineras; barricas y cajas de la peña en los extremos
  for(let x=x0+1;x<x1-.8;x+=1.7){if(Math.abs(x)>12.8)continue;const z=fz-n[1]*2.08,k=rnd();if(k<.22)PR_.banco.push({x,z,yaw:n[1]>0?0:Math.PI});else if(k<.45)PR_.gallinera.push({x,z:z+n[1]*.15,yaw:(n[1]>0?0:Math.PI)+(rnd()-.5)*.5});else if(k<.6)PR_.jardinera.push({x,z,yaw:n[1]>0?0:Math.PI})}
  if(x0<-12)for(const [dx,k] of [[1.0,'barrica'],[1.85,'barrica'],[2.6,'caja']])PR_[k].push({x:-13.3+dx,z:fz-n[1]*1.95,yaw:rnd()*6})}
 pmxRoofGable(G,x0,z0,x1,z1,H,axis,style==='calT'?.8:.55,rnd);
 if(rnd()<.5){const fx=x0+(x1-x0)*(.25+rnd()*.5),fz=z0+(z1-z0)*(.3+rnd()*.4);G.granite.box(fx,H+2.1,fz,.65,2.4,.65,1.5,[1.05,1.03,1]);G.roof.box(fx,H+3.35,fz,.9,.14,.9,3,[.9,.9,.9])}
 // balcones o galería y faroles en la fachada
 const ff=faces.find(front),len=Math.hypot(ff.p1[0]-ff.p0[0],ff.p1[1]-ff.p0[1]),fc=new PmxFace(ff.p0[0],ff.p0[1],ff.n[0],ff.n[1]);
 const vis=s=>{const [x,z]=fc.pt(s,0);return !(o.plaza&&(Math.abs(x)>14.2||Math.abs(z)>11.2))};
 for(let k=0;k<fl;k++){const yb=GF+.02+k*FH;
  if(style==='calT'&&len>5)pmxGallery(G,fc,.15,len-.15,yb,vis,rnd);
  else for(let s=1.4;s<len-.7;s+=2.8){if(!vis(s)||rnd()<(o.plaza?.15:.45))continue;pmxBalcony(G,fc,s,yb,rnd()<.3?2.4:1.6,rnd);
   if(rnd()<.55){const [bx,bz]=fc.pt(s+(rnd()-.5)*.6,.35);CL.balc.push([bx,yb+.1,bz,fc.yaw()])}}}
 for(let s=2.8;s<len-1;s+=5.6){if(!vis(s)||rnd()<.4)continue;const y=GF+.02+.55,t=arc?.12:0,ir=[.06,.06,.065];
  fc.box(G.iron,s-.03,s+.03,t,t+.55,y+.62,y+.66,ir);fc.box(G.iron,s-.03,s+.03,t,t+.04,y+.3,y+.7,ir);fc.box(G.iron,s-.14,s+.14,t+.38,t+.66,y+.52,y+.6,ir);
  fc.box(G.glow,s-.1,s+.1,t+.42,t+.62,y+.2,y+.52,[1,.8,.5]);fc.box(G.iron,s-.13,s+.13,t+.39,t+.65,y+.16,y+.2,ir);const [lx,lz]=fc.pt(s,t+.52);LAN.push([lx,y+.36,lz,6])}}
function pmxColumn(Gr,x,z,y0,h){const g=new THREE.CylinderGeometry(.16,.19,h,14,1),p=g.attributes.position,nr=g.attributes.normal,uv=g.attributes.uv,idx=g.index.array,b=Gr.n;
 for(let i=0;i<p.count;i++){Gr.pos.push(p.getX(i)+x,p.getY(i)+y0+h/2,p.getZ(i)+z);Gr.nor.push(nr.getX(i),nr.getY(i),nr.getZ(i));Gr.uv.push(uv.getX(i)*.8,uv.getY(i)*h/1.5);Gr.col.push(.86,.84,.8)}for(let i=0;i<idx.length;i++)Gr.idx.push(b+idx[i]);Gr.n+=p.count}
function pmxRoofGable(G,x0,z0,x1,z1,H,axis,ov,rnd){const R_=G.roof,W=G.wood,pitch=.42,g=.25,col=[.92+rnd()*.1,.92,.92],C=G.calA,uv=[.22,0,.28,0,.25,.45,.25,.45],gc=[.95,.94,.92];
 if(axis==='x'){const zm=(z0+z1)/2,rise=(z1-z0)/2*pitch,yR=H+rise,yE=H-ov*pitch,len=x1-x0+2*g,sl=Math.hypot((z1-z0)/2+ov,rise+ov*pitch);
  R_.q([x0-g,yE,z1+ov],[x1+g,yE,z1+ov],[x1+g,yR,zm],[x0-g,yR,zm],[0,0,len/3,0,len/3,sl/3,0,sl/3],col,[0,1,1]);R_.q([x1+g,yE,z0-ov],[x0-g,yE,z0-ov],[x0-g,yR,zm],[x1+g,yR,zm],[0,0,len/3,0,len/3,sl/3,0,sl/3],col,[0,1,-1]);
  for(const [ze,zw] of [[z1+ov,z1],[z0-ov,z0]])W.q([x0-g,yE-.02,ze],[x1+g,yE-.02,ze],[x1+g,H,zw],[x0-g,H,zw],[0,0,len/1.5,0,len/1.5,.5,0,.5],[.7,.7,.7],[0,-1,0]);
  W.box((x0+x1)/2,yE-.07,z1+ov-.04,len,.14,.08,1.5,[.6,.6,.6]);W.box((x0+x1)/2,yE-.07,z0-ov+.04,len,.14,.08,1.5,[.6,.6,.6]);R_.box((x0+x1)/2,yR+.05,zm,len,.16,.32,3,[.85,.85,.85]);
  C.q([x0,H,z0],[x0,H,z1],[x0,yR,zm],[x0,yR,zm],uv,gc,[-1,0,0]);C.q([x1,H,z1],[x1,H,z0],[x1,yR,zm],[x1,yR,zm],uv,gc,[1,0,0])}
 else{const xm=(x0+x1)/2,rise=(x1-x0)/2*pitch,yR=H+rise,yE=H-ov*pitch,len=z1-z0+2*g,sl=Math.hypot((x1-x0)/2+ov,rise+ov*pitch);
  R_.q([x1+ov,yE,z0-g],[x1+ov,yE,z1+g],[xm,yR,z1+g],[xm,yR,z0-g],[0,0,len/3,0,len/3,sl/3,0,sl/3],col,[1,1,0]);R_.q([x0-ov,yE,z1+g],[x0-ov,yE,z0-g],[xm,yR,z0-g],[xm,yR,z1+g],[0,0,len/3,0,len/3,sl/3,0,sl/3],col,[-1,1,0]);
  for(const [xe,xw] of [[x1+ov,x1],[x0-ov,x0]])W.q([xe,yE-.02,z0-g],[xe,yE-.02,z1+g],[xw,H,z1+g],[xw,H,z0-g],[0,0,len/1.5,0,len/1.5,.5,0,.5],[.7,.7,.7],[0,-1,0]);
  W.box(x1+ov-.04,yE-.07,(z0+z1)/2,.08,.14,len,1.5,[.6,.6,.6]);W.box(x0-ov+.04,yE-.07,(z0+z1)/2,.08,.14,len,1.5,[.6,.6,.6]);R_.box(xm,yR+.05,(z0+z1)/2,.32,.16,len,3,[.85,.85,.85]);
  C.q([x1,H,z0],[x0,H,z0],[xm,yR,z0],[xm,yR,z0],uv,gc,[0,0,-1]);C.q([x0,H,z1],[x1,H,z1],[xm,yR,z1],[xm,yR,z1],uv,gc,[0,0,1])}}
function pmxBalcony(G,fc,s,yb,w,rnd){const d=.62,ir=[.09,.09,.1],n=Math.round(w/.12);fc.box(G.granite,s-w/2,s+w/2,0,d,yb-.02,yb+.1,[.82,.8,.76]);
 fc.box(G.iron,s-w/2+.02,s+w/2-.02,d-.04,d-.01,yb+1,yb+1.04,ir);fc.box(G.iron,s-w/2+.02,s+w/2-.02,d-.04,d-.01,yb+.16,yb+.19,ir);
 for(let k=0;k<=n;k++){const ss=s-w/2+.04+k*((w-.08)/n);fc.box(G.iron,ss-.008,ss+.008,d-.035,d-.02,yb+.1,yb+1,ir)}
 for(const e of [-1,1]){const ss=s+e*(w/2-.03);fc.box(G.iron,ss-.012,ss+.012,.02,d-.02,yb+1,yb+1.04,ir);for(let k=1;k<5;k++)fc.box(G.iron,ss-.008,ss+.008,k*d/5-.008,k*d/5+.008,yb+.1,yb+1,ir)}
 if(rnd()<.45)for(let k=0;k<3;k++){const ss=s-w/2+.3+k*(w-.6)/2;fc.box(G.paint,ss-.12,ss+.12,d-.2,d-.04,yb+.1,yb+.28,[.55,.25,.14]);fc.box(G.fabric,ss-.16,ss+.16,d-.24,d+.02,yb+.28,yb+.48,rnd()<.6?[.75,.05,.08]:[.1,.32,.08])}}
function pmxGallery(G,fc,s0,s1,yb,vis,rnd){const d=.95,wc=[.85,.8,.75];let a=s0;while(a<s1&&!vis(a))a+=.2;let b=s1;while(b>a&&!vis(b))b-=.2;if(b-a<1)return;
 fc.box(G.wood,a,b,0,d,yb-.04,yb+.1,wc);fc.box(G.wood,a,b,d-.1,d,yb+.98,yb+1.06,wc);fc.box(G.wood,a,b,d-.09,d-.01,yb+.14,yb+.22,wc);
 for(let s=a+.05;s<=b;s+=.16)fc.box(G.wood,s-.025,s+.025,d-.08,d-.03,yb+.22,yb+.98,wc);for(let s=a;s<=b+.01;s+=1.4)fc.box(G.wood,s-.07,s+.07,d-.14,d,yb+.1,yb+2.85,wc);
 for(let s=a+.3;s<b;s+=.7)fc.box(G.wood,s-.06,s+.06,0,d-.05,yb-.2,yb-.04,[.6,.55,.5]);
 for(let s=a+.6;s<b-.3;s+=1.1+rnd()){if(rnd()<.5){fc.box(G.paint,s-.1,s+.1,d-.02,d+.12,yb+.98,yb+1.12,[.55,.25,.14]);fc.box(G.fabric,s-.14,s+.14,d-.04,d+.16,yb+1.12,yb+1.3,rnd()<.7?[.72,.05,.08]:[.12,.34,.1])}else if(rnd()<.5){const [bx,bz]=fc.pt(s,.45);CL.balc.push([bx,yb+.1,bz,fc.yaw()])}}}
function pmxTable(G,x,z){const al=[.75,.76,.78];G.iron.box(x,.88,z,.7,.03,.7,1,al);G.iron.box(x,.52,z,.05,.72,.05,1,al);G.iron.box(x,.17,z,.45,.03,.45,1,al);
 for(const [dx,dz] of [[.6,0],[-.6,0],[0,-.6]]){const sx=x+dx,sz=z+dz;G.iron.box(sx,.6,sz,.42,.04,.42,1,al);for(const [ex,ez] of [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]])G.iron.box(sx+ex,.38,sz+ez,.025,.44,.025,1,al);
  const bx=dx?sx+Math.sign(dx)*.2:sx,bz=dz?sz+Math.sign(dz)*.2:sz;G.iron.box(bx,.85,bz,dx?.03:.42,.45,dx?.42:.03,1,al)}}
/* cadafal: jaula de barrotes (con huecos para colarse), tablado, barandilla, rótulo de peña y toldo */
function pmxCadafal(G,sc,f,s0,s1,dep,col,banner,awn,rnd){const H=2.1,P=.09,y0=0;
 const nP=Math.max(1,Math.round((s1-s0)/2));for(let i=0;i<=nP;i++){const s=pmxC(s0+(s1-s0)*i/nP,s0+P/2,s1-P/2);for(const t of [P/2+.05,dep-P/2])f.box(G.paint,s-P/2,s+P/2,t-P/2,t+P/2,y0,awn?(t>1?4.9:5.25):H+1.05,col)}
 f.box(G.wood,s0,s1,.05,dep,H-.08,H,[.9,.85,.8]);f.box(G.paint,s0,s1,dep-.12,dep,H-.22,H-.08,col);
 for(let s=s0+.2;s<s1-.1;s+=.42)f.box(G.paint,s-.028,s+.028,dep-.08,dep-.02,y0,H-.22,col);
 for(const y of [.45,1.25])f.box(G.paint,s0,s1,dep-.1,dep-.03,y,y+.06,col);
 f.box(G.paint,s0,s1,dep-.06,dep,H+1,H+1.06,col);f.box(G.paint,s0,s1,dep-.06,dep,H+.5,H+.55,col);for(const s of [s0+.03,s1-.03])f.box(G.paint,s-.03,s+.03,.05,dep,H+1,H+1.06,col);
 for(let s=s0+.15;s<s1-.1;s+=.22)if(!banner)f.box(G.paint,s-.012,s+.012,dep-.05,dep-.02,H+.06,H+1,col);
 if(banner){const tx=textPanelPmx(banner.t,banner.c[0],banner.c[1]);const mat=new THREE.MeshStandardMaterial({map:tx,roughness:.75});const w=Math.min(s1-s0-.2,5);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,.72),mat),[x,z]=f.pt((s0+s1)/2,dep+.03);m.position.set(x,H+.58,z);m.rotation.y=f.yaw();m.castShadow=true;sc.add(m)}
 if(awn){const c=[[.1,.5,.2],[.85,.85,.82],[.75,.1,.08],[.15,.3,.7]][(rnd()*4)|0],a=f.pt(s0,.05),b=f.pt(s1,.05),cc=f.pt(s1,dep+.2),dd=f.pt(s0,dep+.2);
  G.fabric.q([a[0],5.3,a[1]],[b[0],5.3,b[1]],[cc[0],4.9,cc[1]],[dd[0],4.9,dd[1]],[0,0,1,0,1,1,0,1],c,[0,1,0]);
  for(let s=s0;s<s1-.01;s+=.5){const p=f.pt(s,dep+.2),qq=f.pt(Math.min(s1,s+.5),dep+.2);G.fabric.q([p[0],4.9,p[1]],[qq[0],4.9,qq[1]],[(p[0]+qq[0])/2,4.66,(p[1]+qq[1])/2],[(p[0]+qq[0])/2,4.66,(p[1]+qq[1])/2],[0,0,1,0,.5,1,.5,1],c,[f.nx,0,f.nz])}}
 // público: primera fila sentada al borde, segunda de pie; abajo, en la jaula, de pie
 const yaw=f.yaw();for(let s=s0+.35;s<s1-.3;s+=.55+rnd()*.25){const [x,z]=f.pt(s,dep-.35);if(rnd()<.55){if(rnd()<.6)CL.crowd.push([x,H+.14,z,yaw,1]);else CL.pmxDeck.push([x,H,z,yaw])}
  if(dep>2&&rnd()<.6){const [x2,z2]=f.pt(s+(rnd()-.5)*.3,dep-1.2-rnd()*.6);CL.crowd.push([x2,H,z2,yaw+(rnd()-.5)*.6,0])}
  if(rnd()<.28){const [x3,z3]=f.pt(s,.5+rnd()*(dep-1.3));CL.crowd.push([x3,0,z3,yaw+(rnd()-.5)*.6,0])}
  if(CL.pmxGLB&&dep>2.2&&rnd()<.35){const [x4,z4]=f.pt(s+(rnd()-.5)*.2,.55+rnd()*.35);CL.pmxProps.silla.push({x:x4,y:H,z:z4,yaw:yaw+(rnd()-.5)*.6})}}
 if(CL.pmxGLB&&rnd()<.4){const m=(s0+s1)/2;for(const [ds,k] of [[-.9,'barrica'],[0,'caja'],[.8,'barrica']]){const [bx,bz]=f.pt(m+ds,.5);CL.pmxProps[k].push({x:bx,z:bz,yaw:rnd()*6})}}}
function textPanelPmx(text,bg,fg){const cv=document.createElement('canvas');cv.width=1024;cv.height=150;const c=cv.getContext('2d');c.fillStyle=bg;c.fillRect(0,0,1024,150);c.strokeStyle=fg;c.lineWidth=8;c.strokeRect(10,10,1004,130);
 c.fillStyle=fg;c.font='bold 88px "Barlow Condensed", Arial Black, Arial, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(text,512,80);const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
/* escalera de acero azul con zancas y paneles de las fiestas */
function pmxStair(G,sc,rf){const blue=[.1,.32,.72],alongX=rf.x1-rf.x0>rf.z1-rf.z0,H=2.1;let p0,p1,w;
 // p0 en la arena, p1 en el tablado (el lado del rectángulo pegado al cadafal)
 if(alongX){w=rf.z1-rf.z0;const zc=(rf.z0+rf.z1)/2,near=Math.abs(rf.x1)>Math.abs(rf.x0)?rf.x1:rf.x0,far=near===rf.x1?rf.x0:rf.x1;p0=[far,zc];p1=[near,zc]}else{w=rf.x1-rf.x0;const xc=(rf.x0+rf.x1)/2,near=Math.abs(rf.z1)>Math.abs(rf.z0)?rf.z1:rf.z0,far=near===rf.z1?rf.z0:rf.z1;p0=[xc,far];p1=[xc,near]}
 const dx=p1[0]-p0[0],dz=p1[1]-p0[1],run=Math.hypot(dx,dz),ux=dx/run,uz=dz/run,sx=-uz,sz=ux,n=10,tw=w-.2;
 for(let i=0;i<n;i++){const t=(i+.5)/n,x=p0[0]+dx*t,z=p0[1]+dz*t,y=H*(i+1)/n-.025;G.wood.box(x,y,z,Math.abs(ux)>.5?run/n+.04:tw,.05,Math.abs(ux)>.5?tw:run/n+.04,1.5,[.75,.7,.65])}
 for(const sd of [-1,1]){const ox=sx*sd*(tw/2+.04),oz=sz*sd*(tw/2+.04),a=[p0[0]+ox,0,p0[1]+oz],b=[p1[0]+ox,H,p1[1]+oz],nn=[sx*sd,0,sz*sd];
  G.paint.q([a[0],a[1]-.05,a[2]],[b[0],b[1]-.05,b[2]],[b[0],b[1]+.2,b[2]],[a[0],a[1]+.2,a[2]],[0,0,1,0,1,1,0,1],blue,nn);G.paint.q([b[0],b[1]-.05,b[2]],[a[0],a[1]-.05,a[2]],[a[0],a[1]+.2,a[2]],[b[0],b[1]+.2,b[2]],[0,0,1,0,1,1,0,1],blue,[-nn[0],0,-nn[2]]);
  G.paint.q([a[0],a[1]+.9,a[2]],[b[0],b[1]+.9,b[2]],[b[0],b[1]+.96,b[2]],[a[0],a[1]+.96,a[2]],[0,0,1,0,1,1,0,1],blue,nn);
  for(let i=0;i<=4;i++){const t=i/4;G.paint.box(a[0]+(b[0]-a[0])*t,H*t+.48,a[2]+(b[2]-a[2])*t,.06,.96,.06,1,blue)}
  const tx=textPanelPmx(sd<0?'FESTES 2026':'BOUS AL CARRER','#ffffff','#1d3f8f'),m=new THREE.Mesh(new THREE.PlaneGeometry(Math.hypot(run,H)*.75,.28),new THREE.MeshStandardMaterial({map:tx,roughness:.6}));
  m.position.set((a[0]+b[0])/2+nn[0]*.02,H/2+.55,(a[2]+b[2])/2+nn[2]*.02);m.rotation.order='YXZ';m.rotation.y=Math.atan2(nn[0],nn[2]);
  const lx=Math.cos(m.rotation.y)*ux-Math.sin(m.rotation.y)*uz;m.rotation.z=Math.atan2(H,run)*(lx>=0?1:-1);sc.add(m)}}
/* refugio amarillo: muro octogonal con cuatro accesos, torre central con cornisa y farol */
function pmxRefugio(G,c,LAN){const R_=c.r,n=12,h=1.1,th=.2,Y=[1,1,1];
 for(let i=0;i<n;i++){if(i%3===1)continue;const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2,p0=[c.x+Math.sin(a0)*R_,c.z+Math.cos(a0)*R_],p1=[c.x+Math.sin(a1)*R_,c.z+Math.cos(a1)*R_],am=(a0+a1)/2,nn=[Math.sin(am),Math.cos(am)],o=[nn[0]*th/2,nn[1]*th/2];
  G.yellow.wall([p0[0]+o[0],p0[1]+o[1]],[p1[0]+o[0],p1[1]+o[1]],0,h,2,2,Y,nn);G.yellow.wall([p1[0]-o[0],p1[1]-o[1]],[p0[0]-o[0],p0[1]-o[1]],0,h,2,2,Y,[-nn[0],-nn[1]]);
  G.granite.q([p0[0]+o[0]*1.4,h+.06,p0[1]+o[1]*1.4],[p1[0]+o[0]*1.4,h+.06,p1[1]+o[1]*1.4],[p1[0]-o[0]*1.4,h+.06,p1[1]-o[1]*1.4],[p0[0]-o[0]*1.4,h+.06,p0[1]-o[1]*1.4],[0,0,1,0,1,.2,0,.2],[.9,.88,.84],[0,1,0]);
  for(const pa of [p0,p1])G.yellow.box(pa[0],h/2+.03,pa[1],th*1.05,h+.06,th*1.05,2,Y)}
 const T=.6,ty=3.6;G.yellow.box(c.x,ty/2,c.z,T*2,ty,T*2,2,Y);G.granite.box(c.x,ty+.1,c.z,T*2+.3,.2,T*2+.3,1.5,[.9,.88,.84]);G.yellow.box(c.x,ty+.38,c.z,T*2-.2,.36,T*2-.2,2,Y);
 G.granite.box(c.x,.14,c.z,T*2+.5,.28,T*2+.5,1.5,[.85,.83,.79]);const ir=[.06,.06,.065];G.iron.box(c.x,ty+.9,c.z,.08,.7,.08,1,ir);G.iron.box(c.x,ty+1.27,c.z,.42,.06,.42,1,ir);G.glow.box(c.x,ty+1.56,c.z,.3,.48,.3,1,[1,.8,.5]);
 for(const [dx,dz] of [[-1,-1],[1,-1],[-1,1],[1,1]])G.iron.box(c.x+dx*.17,ty+1.56,c.z+dz*.17,.03,.54,.03,1,ir);G.iron.box(c.x,ty+1.86,c.z,.48,.06,.48,1,ir);G.iron.box(c.x,ty+1.97,c.z,.2,.16,.2,1,ir);
 LAN.push([c.x,ty+1.56,c.z,14]);for(let i=0;i<8;i++){const a=R(0,6.28),d=R(.95,c.r-.35);CL.crowd.push([c.x+Math.sin(a)*d,0,c.z+Math.cos(a)*d,a+Math.PI,0])}}
/* fuente de granito con caños y agua, protegida por una talanquera circular */
function pmxFuente(sc,G,c,MT,T){const gm=new THREE.MeshStandardMaterial({map:T.granite.map,normalMap:T.granite.normalMap,roughnessMap:T.granite.orm,roughness:1,color:'#d8d4cc',side:THREE.DoubleSide});
 const lathe=(pts,seg)=>{const g=new THREE.LatheGeometry(pts.map(([r,y])=>new THREE.Vector2(r,y)),seg);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*3,uv.getY(i));const m=new THREE.Mesh(g,gm);m.position.set(c.x,0,c.z);m.castShadow=true;m.receiveShadow=true;sc.add(m)};
 lathe([[.5,.02],[.72,.02],[.72,.12],[.7,.14]],32);lathe([[.5,.12],[.5,.7],[.54,.74],[.68,.74],[.7,.7],[.7,.12]],40);
 lathe([[0,.12],[.14,.12],[.14,.3],[.1,.36],[.08,1.2],[.11,1.28],[.12,1.32]],20);lathe([[.1,1.32],[.36,1.4],[.44,1.5],[.45,1.56],[.4,1.56],[.36,1.5],[.08,1.48]],28);
 lathe([[0,1.48],[.07,1.48],[.06,1.62],[.1,1.72],[.11,1.82],[.07,1.92],[.03,1.98],[.05,2.02],[0,2.06]],16);
 const wm=new THREE.MeshStandardMaterial({color:'#23383a',roughness:.05,metalness:.1,transparent:true,opacity:.86});
 const w=new THREE.Mesh(new THREE.CircleGeometry(.5,32),wm);w.rotation.x=-Math.PI/2;w.position.set(c.x,.64,c.z);sc.add(w);const w2=w.clone();w2.scale.setScalar(.72);w2.position.y=1.5;sc.add(w2);
 const jm=new THREE.MeshStandardMaterial({color:'#dfeef0',roughness:.05,transparent:true,opacity:.55,depthWrite:false});
 for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4,cc=Math.cos(a),s=Math.sin(a),pts=[];for(let i=0;i<=10;i++){const t=i/10;pts.push(new THREE.Vector3(c.x+cc*(.44+t*.12),1.54-t*t*.88,c.z+s*(.44+t*.12)))}sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),12,.014,6),jm))}
 const red=[.78,.1,.08],n=16;for(let i=0;i<n;i++){if(i%4===0)continue;const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2,p0=[c.x+Math.sin(a0)*c.r,c.z+Math.cos(a0)*c.r],p1=[c.x+Math.sin(a1)*c.r,c.z+Math.cos(a1)*c.r],am=(a0+a1)/2,nn=[Math.sin(am),Math.cos(am)];
  for(const y of [.4,.9,1.4]){const L=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);G.paint.wall([p0[0]+nn[0]*.03,p0[1]+nn[1]*.03],[p1[0]+nn[0]*.03,p1[1]+nn[1]*.03],y,y+.07,L,1,red,nn);G.paint.wall([p1[0]-nn[0]*.03,p1[1]-nn[1]*.03],[p0[0]-nn[0]*.03,p0[1]-nn[1]*.03],y,y+.07,L,1,red,[-nn[0],-nn[1]])}
  G.paint.box(p0[0],.72,p0[1],.08,1.44,.08,1,red)}
 for(let i=0;i<7;i++){const a=R(0,6.28),d=R(1.0,c.r-.3);CL.crowd.push([c.x+Math.sin(a)*d,0,c.z+Math.cos(a)*d,a+Math.PI,0])}}

/* ---------- público real animado: anima cuando la res embiste ---------- */
function pmxSpecTick(dt){if(!CL||!CL.pmxSpec||!CL.pmxSpec.length)return;const lev=CL.cheer||0;CL.pmxF=(CL.pmxF||0)+1;
 for(let i=0;i<CL.pmxSpec.length;i++){const s=CL.pmxSpec[i],P=s.P;s.t-=dt;if(s.t<=0){s.t=1.2+Math.random()*2.8;s.ch=lev>.3?Math.random()<.75:Math.random()<.05}
  if(P.gl){P.gl.want=s.ch?'Celebration':null;P.gl.wts=1;if((CL.pmxF+i)%2===0)modAnimPerson(P,dt*2,0)}
  else{const ar=P.arms;if(ar){ar[0].lock=ar[1].lock=s.ch?1:0;if(s.ch){const w=Math.sin(CL.t*9+i);ar[0].sh.rotation.set(-2.7+w*.25,0,.3);ar[1].sh.rotation.set(-2.7-w*.25,0,-.3)}}animPerson(P,dt,0)}}}
if(typeof calleTick==='function'){const _ctPmx=calleTick;calleTick=function(dt){_ctPmx(dt);try{if(CL&&!CL.plaza)pmxSpecTick(dt)}catch(e){}}}
