/* ===================== PANTALLA DE CARGA =====================
   Sale al abrir el juego y al entrar en cada escena 3D (finca, plaza, tienta, festejos, carrera de torero).
   - Al tocar un botón que entra en 3D, primero se pinta la pantalla de carga y después se monta la escena,
     así nunca se ve el menú congelado.
   - Tras montar la escena se precompilan los sombreados para que el primer movimiento no dé tirones.
   - Las llamadas desde código siguen siendo síncronas: nada cambia para el resto del juego. */
const CG={on:false,t0:0,id:0,sale:null,
 tips:['La bravura se hereda sobre todo por la madre: tienta bien a tus vacas antes de echarlas al semental.',
  'Un toro noble repite en la muleta y deja lucirse al torero; uno con casta pone la emoción.',
  'La fuerza importa: un toro que se cae en el primer tercio difícilmente dará una gran faena.',
  'Las plazas de primera dan más prestigio, pero el público es mucho más exigente.',
  'Cuida el pasto y el agua de la finca: un toro bien criado llega a la plaza en su peso.',
  'Elige con cabeza los sementales: cada encaste aporta un comportamiento distinto en el ruedo.',
  'Un indulto es el mayor premio para una ganadería: el toro vuelve a la finca como semental.',
  'Si el presidente saca dos pañuelos, las orejas se pasean en la vuelta al ruedo.',
  'Reseña bien la corrida: un lote desigual perjudica a los toreros y a tu cartel.',
  'Con la velocidad x4 puedes ver la lidia más deprisa sin perder ningún momento.'],
 dest:'',rx:/\b(enter3D|enterPlaza|irA3D|faenaYo|irCalle|irPlaza|corroTienta|tcGo|hacerFestival)\(|\b(calCorrida|calCorro)\([^)]*,\s*(true|1)\)/};
function cgEl(){let e=document.getElementById('carga');if(e)return e;e=document.createElement('div');e.id='carga';e.setAttribute('role','status');e.setAttribute('aria-live','polite');
 e.innerHTML='<div class="cg-bg"></div><img class="cg-img" src="img/carga.jpg" alt="" decoding="async"><div class="cg-vig"></div><div class="cg-info"><h1 class="cg-t">Hierro y Divisa</h1><p class="cg-d"></p><div class="cg-bar"><i></i></div><p class="cg-tip"></p></div>';
 document.body.appendChild(e);return e}
function cargaProg(p){const i=cgEl().querySelector('.cg-bar i');if(i)i.style.width=Math.round(Math.max(0,Math.min(1,p))*100)+'%'}
function cargaMostrar(dest){const e=cgEl();clearTimeout(CG.sale);e.classList.remove('sale');CG.on=true;CG.t0=performance.now();CG.id++;
 e.querySelector('.cg-d').textContent=dest||'';const tip=CG.tips[Math.floor(Math.random()*CG.tips.length)];e.querySelector('.cg-tip').innerHTML='<b>Consejo</b>'+tip.replace(/</g,'&lt;');
 const img=e.querySelector('.cg-img');if(img){img.style.animation='none';void img.offsetWidth;img.style.animation=''}
 cargaProg(.08);e.classList.add('on');requestAnimationFrame(()=>cargaProg(.35))}
function cargaOcultar(min){if(!CG.on)return;const e=cgEl(),id=CG.id;const resta=Math.max(0,(min==null?1100:min)-(performance.now()-CG.t0));cargaProg(1);
 clearTimeout(CG.sale);CG.sale=setTimeout(()=>{if(id!==CG.id)return;e.classList.add('sale');CG.sale=setTimeout(()=>{if(id!==CG.id)return;e.classList.remove('on','sale');CG.on=false},560)},resta+(min===0?0:180))}
function cargaTrasEscena(){const id=CG.id;cargaProg(.72);requestAnimationFrame(()=>{if(id!==CG.id)return;try{if(W3.R&&W3.scene&&W3.cam)W3.R.compile(W3.scene,W3.cam)}catch(e){}cargaProg(.92);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{if(id===CG.id)cargaOcultar()}))})}
/* destino que se lee en la pantalla */
function cgDestino(n,a){try{
 if(n==='enterPlaza'){const r=S.hist.find(h=>h.id===a[0]);return r?r.plaza+(r.feria?' · '+r.feria:''):'Plaza de toros'}
 if(n==='enterTorero'){const o=a[0];return o&&o.plaza?o.plaza:'Plaza de toros'}
 if(n==='startTienta')return 'Tentadero · '+(S&&S.g?S.g.name:'');
 if(n==='irCalle')return 'Festejo popular';
 return 'La finca · '+(S&&S.g?S.g.name:'')}catch(e){return ''}}
function cgEnvolver(n){const f=window[n];if(typeof f!=='function'||f.__cg)return;const w=function(){const nuevo=!CG.on;if(nuevo)cargaMostrar(cgDestino(n,arguments));else if(!CG.dest)cgEl().querySelector('.cg-d').textContent=cgDestino(n,arguments);CG.dest=1;
 let r;try{r=f.apply(this,arguments)}catch(err){CG.dest=0;cargaOcultar(0);throw err}
 CG.dest=0;if(typeof RD!=='undefined'&&RD.on)cargaOcultar(0);else if(typeof W3!=='undefined'&&W3.on)cargaTrasEscena();else cargaOcultar(0);return r};w.__cg=1;window[n]=w}
['enterFinca','enterPlaza','enterTorero','startTienta','irCalle'].forEach(cgEnvolver);
/* botones que entran en 3D: primero se pinta la pantalla de carga y luego se monta la escena */
document.addEventListener('click',e=>{if(!e.isTrusted||CG.on||e.__cg)return;const el=e.target&&e.target.closest&&e.target.closest('[onclick]');if(!el)return;
 const s=el.getAttribute('onclick')||'';if(!CG.rx.test(s)||typeof el.onclick!=='function')return;
 e.stopPropagation();e.preventDefault();const m=/enterPlaza\((\d+)\)/.exec(s);cargaMostrar(m?cgDestino('enterPlaza',[+m[1]]):/calCorrida|irPlaza/.test(s)?'Plaza de toros':/irCalle|calCorro/.test(s)?'Festejo popular':cgDestino('enterFinca',[]));CG.dest=1;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{CG.dest=0;try{el.onclick.call(el,e)}catch(err){console.error(err)}
  if(!(typeof W3!=='undefined'&&W3.on)&&!(typeof RD!=='undefined'&&RD.on))cargaOcultar(0)}))},true);
/* al abrir el juego */
(function cgArranque(){const e=document.getElementById('carga');if(!e||!e.classList.contains('on'))return;CG.on=true;CG.t0=0;CG.id++;
 const tip=CG.tips[Math.floor(Math.random()*CG.tips.length)];e.querySelector('.cg-tip').innerHTML='<b>Consejo</b>'+tip;cargaProg(.45);
 let listo=0;const paso=()=>{listo++;cargaProg(.45+listo*.25);if(listo>=2)cargaOcultar(1700)};
 if(document.readyState==='complete')paso();else addEventListener('load',paso,{once:true});
 (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(paso,paso);
 setTimeout(()=>{if(CG.on&&CG.id===1)cargaOcultar(0)},6000)})();
