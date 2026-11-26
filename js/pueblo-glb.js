/* ===================== MODELOS 3D DEL PUEBLO (enviados por el jugador) =====================
   Se usan en las calles y plazas de los festejos populares, cada uno donde le toca:
   · cadafal / cadafal con toldo: tablados de madera, alternando con los de tubo pintado de las peñas
     (se conservan los carteles de peña y el público arriba y abajo).
   · iglesia y ayuntamiento: el fondo de la plaza en los pueblos sin plaza propia hecha a mano ni plano real
     (Nules, Borriana, Onda, Vila-real y La Vall, con plaza propia, no cambian).
   · bolas de embolar (apagadas y encendidas): el armazón de hierro con las bolas de estopa del bou embolat.
   · pilar de madera / pilar de piedra: el pilón al que se amarra el toro embolado (según el pueblo).
   Se descargan en segundo plano; mientras no han llegado, se ve lo de siempre. */
const PGLB={m:{},pend:{},err:{}};
const PGLB_ARCH=['cadafal','cadafal_toldo','iglesia','ayuntamiento','bolas_embolar','bolas_embolar_encendidas','pilar_madera','pilar_piedra'];
function pglbCarga(n){if(PGLB.m[n]||PGLB.pend[n]||PGLB.err[n]||typeof THREE==='undefined'||!THREE.GLTFLoader)return;PGLB.pend[n]=1;
 new THREE.GLTFLoader().load('modelos/pueblo/'+n+'.glb',g=>{const s=g.scene;s.updateMatrixWorld(true);s.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;for(const m of [].concat(o.material))if(m){m.envMapIntensity=.8;if(m.map)m.map.anisotropy=4}}});
  const bb=new THREE.Box3().setFromObject(s);PGLB.m[n]={s,bb};PGLB.pend[n]=0},undefined,()=>{PGLB.err[n]=1;PGLB.pend[n]=0})}
function pglbTodos(){for(const n of PGLB_ARCH)pglbCarga(n)}
function pglb(n){const r=PGLB.m[n];if(!r){pglbCarga(n);return null}return r}
// clon con la matriz dada (las mallas comparten geometría y material)
function pglbClon(n,mat){const r=pglb(n);if(!r)return null;const g=r.s.clone(true);g.matrixAutoUpdate=false;g.matrix.copy(mat);g.matrixWorldNeedsUpdate=true;return g}
// descarga en cuanto el juego está quieto (y al entrar en el corro)
(function(){const go=()=>{try{pglbTodos()}catch(e){}};if('requestIdleCallback' in window)requestIdleCallback(()=>setTimeout(go,3000),{timeout:9000});else setTimeout(go,6000)})();
if(typeof irCalle==='function'){const _icG=irCalle;irCalle=function(){try{pglbTodos()}catch(e){}return _icG.apply(this,arguments)}}

/* plaza sin diseño propio (no son Nules, Borriana, Onda, Vila-real ni La Vall) y sin iglesia singular (cúpula, gótica, castillo):
   allí la iglesia o el ayuntamiento del fondo eran genéricos dibujados por código */
function pglbGenerica(PT){try{const o=CL&&CL.o,pu=((o&&o.pueblo)||'').toLowerCase().trim();if(o&&o.plaza)return false;if(['vila-real','villarreal','nules','burriana','borriana','onda'].includes(pu))return false;
 if(typeof vallEs==='function'&&vallEs())return false; return !!PT&&(PT.fondo==='iglesia'||PT.fondo==='ajuntament')&&!PT.cupula&&!PT.gotic&&!PT.castell}catch(e){return false}}
const pglbSemilla=()=>{try{return typeof locSeed==='function'?locSeed():0}catch(e){return 0}};

/* ---------- cadafales de madera ---------- */
if(typeof pmxCadafal==='function'){const _pcG=pmxCadafal;pmxCadafal=function(G,sc,f,s0,s1,dep,col,banner,awn,rnd){
 const vall=typeof vallEs==='function'&&vallEs();const n=awn?'cadafal_toldo':'cadafal';
 // la mitad (más o menos) de los módulos son de madera; los de la peña con colores siguen siendo de tubo
 if(vall||!pglb(n)||rnd()>.55)return _pcG.apply(this,arguments);
 // se aprovecha el original para el cartel y el público, pero sin dibujar su armazón
 const nada={box(){},q(){}},G2=new Proxy(G,{get:(t,k)=>k==='paint'||k==='wood'||k==='fabric'?nada:t[k]});
 _pcG.call(this,G2,sc,f,s0,s1,dep,col,banner,false,rnd);
 // modelo: x 0..6.2 a lo largo, z -2.75 (casa) … +0.25 (calle), tablado a 2.2 m → aquí a 2.1 m
 const o=f.pt(s0,0),ps=f.pt(s0+1,0),pt=f.pt(s0,1),m=s1-s0;
 const sx=[(ps[0]-o[0])*m/6.2,0,(ps[1]-o[1])*m/6.2],sz=[(pt[0]-o[0])*dep/3,0,(pt[1]-o[1])*dep/3],sy=2.1/2.2;
 const M=new THREE.Matrix4().set(sx[0],0,sz[0],o[0]+sz[0]*2.75, 0,sy,0,0, sx[2],0,sz[2],o[1]+sz[2]*2.75, 0,0,0,1);
 const g=pglbClon(n,M);if(g){sc.add(g);CL.pglbCad=(CL.pglbCad||0)+1}}}

/* ---------- iglesia y ayuntamiento de fondo ---------- */
if(typeof pmxIglesia==='function'){const _piG=pmxIglesia;pmxIglesia=function(G,sc,a0,a1,line,PT,LAN){const r=pglb('iglesia');
 if(!r||!pglbGenerica(PT))return _piG.apply(this,arguments);
 // la puerta del modelo mira a -z: se gira media vuelta y se planta con la fachada en la línea de la plaza
 const s=(a1-a0)/18.1,fz=line-1,cx=(a0+a1)/2;const M=new THREE.Matrix4().makeRotationY(Math.PI).premultiply(new THREE.Matrix4().makeScale(s,s,s));
 const bb=r.bb,x0=-bb.max.x*s,x1=-bb.min.x*s,zf=-bb.min.z*s;M.setPosition(cx-(x0+x1)/2,0,fz-zf);const g=pglbClon('iglesia',M);if(g)sc.add(g);CL.pglbFondo='iglesia'}}
if(typeof pmxAjuntament==='function'){const _paG=pmxAjuntament;pmxAjuntament=function(G,sc,a0,a1,line,PT,LAN){const r=pglb('ayuntamiento');
 if(!r||!pglbGenerica(PT))return _paG.apply(this,arguments);
 const s=(a1-a0)/(r.bb.max.x-r.bb.min.x),bb=r.bb;const M=new THREE.Matrix4().makeScale(s,s,s);M.setPosition((a0+a1)/2-(bb.min.x+bb.max.x)/2*s,-bb.min.y*s,line-bb.max.z*s);
 const g=pglbClon('ayuntamiento',M);if(g)sc.add(g);CL.pglbFondo='ayuntamiento'}}

/* ---------- bou embolat: pilón y bolas ---------- */
if(typeof embStart==='function'){const _esG=embStart;embStart=function(r){const out=_esG.apply(this,arguments);try{const e=CL.emb,post=e&&e.objs&&e.objs[0];
 const piedra=(pglbSemilla()%5)<2,n=piedra&&pglb('pilar_piedra')?'pilar_piedra':'pilar_madera',m=pglb(n);
 if(post&&m){const bb=m.bb,h=bb.max.y-bb.min.y,w=Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z);
  // madera: el poste de 2,2 m; piedra: un pilar de unos 50 cm de ancho, sin la base de piedra del de madera
  const sy=2.25/h,sxz=n==='pilar_piedra'?.5/w:sy;post.children[0].visible=false;if(n==='pilar_piedra'){post.children[1].visible=false;for(let i=2;i<4&&post.children[i];i++)post.children[i].visible=false}
  const g=pglbClon(n,new THREE.Matrix4().makeScale(sxz,sy,sxz).setPosition(0,-bb.min.y*sy,0));if(g){post.add(g);e.pilar=n}}
 /* las dos versiones de las bolas van ya en la cabeza desde el principio, diminutas: así sus sombreados se compilan
    mientras la amarran y no hay parón al colocarlas ni al encenderlas */
 if(e&&r&&r.b){e.bolasPre={};for(const k of ['bolas_embolar','bolas_embolar_encendidas']){const g2=pglbClon(k,new THREE.Matrix4().makeScale(1e-4,1e-4,1e-4));if(g2){g2.traverse(o=>{if(o.isMesh&&/llama/i.test(o.name))o.visible=false});r.b.hp.add(g2);e.bolasPre[k]=g2}}}
 }catch(x){console.warn('pilón',x)}return out}}
function pglbBolas(e,b,n){const g=e.bolasPre&&e.bolasPre[n];if(!g)return false;if(e.bolasG&&e.bolasG!==g)e.bolasG.visible=false;
 // en el modelo las bolas están a ±0,58 m y 0,5 m de alto; en la res, a ±0,62 m, 0,62 m y 0,2 m hacia delante
 g.matrix.copy(new THREE.Matrix4().makeScale(1.07,1,1).setPosition(0,.12,.18));g.matrixWorldNeedsUpdate=true;g.visible=true;e.bolasG=g;return true}
if(typeof embTick==='function'){const _etG=embTick;embTick=function(r,dt){const out=_etG.apply(this,arguments);try{const e=CL&&CL.emb;if(!e||!r||!r.b)return out;
 if(e.ferros&&!e.bolasOk){e.bolasOk=1;if(pglbBolas(e,r.b,'bolas_embolar')){e.ferros.visible=false;
   /* las bolas dibujadas se quedan: coinciden con las del modelo y son las que arden (el fuego sale de ellas);
      solo se quita la estopa de debajo, que ahora es la del modelo */
   const F=e.fireObj;if(F&&F.bolas)F.bolas.forEach(o=>{if(!(F.balls||[]).includes(o))o.visible=false})}}
 if(r.fire&&e.bolasG&&!e.encendidas){e.encendidas=1;pglbBolas(e,r.b,'bolas_embolar_encendidas')}}catch(x){}return out}}
// las esferas que dibuja embolar() (para poder ocultarlas cuando hay modelo)
if(typeof embolar==='function'){const _ebG=embolar;embolar=function(b){const antes=new Set(b.hp.children);const F=_ebG.apply(this,arguments);try{F.bolas=b.hp.children.filter(o=>!antes.has(o)&&o.isMesh&&!F.fires.includes(o))}catch(e){}return F}}
