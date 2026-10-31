/* ===================== MENÚ PRINCIPAL · pantalla de título de alto nivel ===================== */
const MENU={v:'press',i:0,slide:0};
const _startScreenOrig=startScreen;
const MENU_BG=['hero','calle','plaza-1','palco','calle-nit','dehesa'];
function encImg(g,i){const p=(g.pelos&&g.pelos[0])||(ENC[g.enc]&&ENC[g.enc].pelos[0])||'negro';return `img/toro-${FAMP[p]||'negro'}-${(i*3+1)%8}.jpg`}
function menuBg(){return `<div class="mBg">${MENU_BG.map((s,i)=>`<i style="background-image:url(img/${s}.jpg);animation-delay:${i*6}s"></i>`).join('')}</div><canvas id="mFx" class="mFx"></canvas><div class="mVig"></div><div class="mSweep"></div>`}
function menuLogo(sm){return `<div class="mLogo ${sm?'sm':''}"><svg class="mHorns" viewBox="0 0 120 60"><defs><linearGradient id="mg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset=".45" stop-color="#e6bb55"/><stop offset="1" stop-color="#8a6420"/></linearGradient></defs><path fill="url(#mg)" d="M6 6c4 16 16 26 34 27l6 10h28l6-10c18-1 30-11 34-27-7 9-17 14-30 14H66l-6 5-6-5H36C23 20 13 15 6 6z"/><path fill="url(#mg)" d="M48 44h24l-12 14z"/></svg>
 <h1><span>Hierro</span><em>y</em><span>Divisa</span></h1><div class="mTag">Modo carrera · Ganadero de bravo</div></div>`}
startScreen=function(){const sv=load();const v=MENU.v;
 if(v==='press')return `<div class="menu mPress" onclick="menuGo('main',1)">${menuBg()}<div class="mCenter">${menuLogo()}<div class="mPressT">Toca para empezar</div></div><div class="mFoot">Tradición · Pasión · Toros</div></div>`;
 if(v==='main')return `<div class="menu">${menuBg()}<div class="mCenter mMain">${menuLogo(1)}
  <nav class="mList">
   ${sv&&sv.g?`<button class="mItem prim" onclick="menuContinuar()"><b>Continuar carrera</b><small>${esc(sv.g.name)} · ${MESES[sv.month]} ${sv.year} · ${eur(sv.money)}${sv.corro?' · corro '+esc(sv.corro.name):''}</small><span class="mArr">${ICO.chev}</span></button>`:''}
   <button class="mItem ${sv&&sv.g?'':'prim'}" onclick="menuGo('hist')"><b>Nueva carrera</b><small>Ponte al frente de una de las ${GANADERIAS.length} ganaderías históricas</small><span class="mArr">${ICO.chev}</span></button>
   <button class="mItem" onclick="menuGo('fundar')"><b>Funda tu ganadería</b><small>Tu hierro, tu divisa y tu encaste desde cero</small><span class="mArr">${ICO.chev}</span></button>
   <button class="mItem" onclick="menuGo('modos')"><b>Modos de juego</b><small>Finca 3D · tientas · corridas · bous al carrer</small><span class="mArr">${ICO.chev}</span></button>
   <button class="mItem" onclick="menuGo('ajustes')"><b>Ajustes</b><small>Gráficos y sonido</small><span class="mArr">${ICO.chev}</span></button>
  </nav></div><div class="mFoot">v2 · ${GANADERIAS.length} ganaderías · ${MATADORES.length} toreros · ${CORRO_REAL.length} casas de corro</div></div>`;
 if(v==='hist'){const i=MENU.i;
  return `<div class="menu mSel">${menuBg()}<div class="mTop"><button class="mBack" onclick="menuGo('main')">${ICO.chev}<span>Volver</span></button><b>Elige tu ganadería</b><span class="mCnt">${i+1} / ${GANADERIAS.length}</span></div>
  <div class="mCar" id="mCar" onscroll="menuScroll(this)">${GANADERIAS.map((g,k)=>{const e=ENC[g.enc]||ENC.Domecq;const bar=(n,v)=>`<div class="mSt"><span>${n}</span><i><u style="width:${v}%"></u></i><b>${v}</b></div>`;
   return `<article class="mCard"><div class="mPh" style="background-image:url(${encImg(g,k)})"></div><div class="mDiv" style="background:linear-gradient(90deg,${g.div[0]} 0 50%,${g.div[1]} 50% 100%)"></div>
    <div class="mCt"><div class="mHd">${emblem({hierro:{l:g.name[0]}},52)}<div class="mVal"><b>${g.pres}</b><small>VAL</small></div></div>
    <h2>${esc(g.name)}</h2><div class="mLoc">${esc(g.loc||'España')}</div><div class="mStars">${estrellas(g.pres)}<span class="mEnc">Encaste ${esc(g.enc)}</span></div>
    <p>${esc(g.d||e.d)}</p><div class="mStats">${bar('Bravura',e.bra)}${bar('Nobleza',e.nob)}${bar('Fuerza',e.fue)}${bar('Casta',e.cas)}</div>
    <button class="btn oro adv" onclick="menuElegir(${k})">Dirigir ${esc(g.name)}${ICO.chev}</button></div></article>`}).join('')}</div>
  <div class="mDots">${GANADERIAS.map((g,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div>
  <div class="mNav"><button class="mBtn" onclick="menuMove(-1)" aria-label="Anterior">‹</button><button class="mBtn" onclick="menuMove(1)" aria-label="Siguiente">›</button></div></div>`}
 if(v==='fundar'){NEWG.prov=NEWG.prov||PROVINCIAS[0];return `<div class="menu mForm">${menuBg()}<div class="mTop"><button class="mBack" onclick="menuGo('main')">${ICO.chev}<span>Volver</span></button><b>Funda tu ganadería</b><span></span></div><div class="mPanel">${_startScreenOrig().replace(/^[\s\S]*?(<section class="sect card goldline">)/,'$1').replace(/<\/div><\/main>\s*$/,'')}</div></div>`}
 if(v==='modos')return `<div class="menu mForm">${menuBg()}<div class="mTop"><button class="mBack" onclick="menuGo('main')">${ICO.chev}<span>Volver</span></button><b>Modos de juego</b><span></span></div><div class="mPanel mModos">
  ${[['dehesa','Finca en 3D','Recorre tu dehesa a pie, a caballo o en camioneta. Echa de comer, hierra, cura, repara cercas, acosa y derriba, y haz las faenas del calendario.'],
     ['cuerno','Tienta en la placita','Mide la bravura de tus vacas y machos con el picador y la muleta. Tú eliges quién se queda de vientre o de semental.'],
     ['plaza-1','Corridas en directo','Tu hierro en las grandes ferias: cada toro y cada torero son distintos, con cámaras de televisión, cogidas, avisos e indultos.'],
     ['calle','Bous al carrer','Tu ganadería de corro en las fiestas de los pueblos valencianos: vaquillas, bou embolat, capeas y concursos de recortadores.'],
     ['palco','Carrera e imperio','Escalafón de ganaderías, retos del mes, obras de la finca y un patrimonio que crece temporada a temporada.']].map(([im,t,d])=>`<div class="mMode"><i style="background-image:url(img/${im}.jpg)"></i><div><b>${t}</b><p>${d}</p></div></div>`).join('')}</div></div>`;
 if(v==='ajustes'){const q=getQual();return `<div class="menu mForm">${menuBg()}<div class="mTop"><button class="mBack" onclick="menuGo('main')">${ICO.chev}<span>Volver</span></button><b>Ajustes</b><span></span></div><div class="mPanel">
  <section class="sect card goldline"><header><h2>Gráficos 3D</h2></header><div class="seg">${[['alta','Alta','Sombras finas y máxima nitidez'],['media','Media','Equilibrio para móviles'],['baja','Baja','Móviles antiguos']].map(([k,n,d])=>`<button aria-pressed="${q===k}" onclick="setQual('${k}');render()"><b>${n}</b><span>${d}</span></button>`).join('')}</div></section>
  <section class="sect card goldline"><header><h2>Sonido</h2></header><div class="seg"><button aria-pressed="${AU.on}" onclick="if(!AU.on)auToggle();render()"><b>Activado</b><span>Clarines, público y campo</span></button><button aria-pressed="${!AU.on}" onclick="if(AU.on)auToggle();render()"><b>Silencio</b><span>Sin sonido</span></button></div></section>
  ${sv&&sv.g?`<section class="sect card"><header><h2>Partida guardada</h2></header><small class="muted">${esc(sv.g.name)} · ${MESES[sv.month]} ${sv.year}</small><button class="btn" style="margin-top:.6rem" onclick="if(confirmar())resetGame()">Borrar la partida</button></section>`:''}</div></div>`}
 return ''};
function confirmar(){return window.__noConfirm||confirm('¿Seguro que quieres borrar la partida guardada?')}
function menuGo(v,snd){MENU.v=v;if(snd){try{auInit();clarin();clearTimeout(MENU.mt);MENU.mt=setTimeout(()=>{if(!S)musicStart()},2600)}catch(e){}}try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}const app=$('#app');app.classList.remove('mIn');void app.offsetWidth;app.classList.add('mIn');render();window.scrollTo(0,0);if(v==='hist')requestAnimationFrame(()=>{const c=$('#mCar');if(c)c.scrollLeft=MENU.i*c.clientWidth*.86})}
function menuScroll(el){const w=el.firstElementChild?el.firstElementChild.getBoundingClientRect().width+14:1;const i=clamp(Math.round(el.scrollLeft/w),0,GANADERIAS.length-1);if(i!==MENU.i){MENU.i=i;document.querySelectorAll('.mDots i').forEach((d,k)=>d.classList.toggle('on',k===i));const c=$('.mCnt');if(c)c.textContent=`${i+1} / ${GANADERIAS.length}`}}
function menuMove(d){const c=$('#mCar');if(!c)return;const w=c.firstElementChild.getBoundingClientRect().width+14;c.scrollTo({left:clamp(MENU.i+d,0,GANADERIAS.length-1)*w,behavior:'smooth'})}
function menuIntro(name,sub,then){const d=document.createElement('div');d.className='mIntro';d.innerHTML=`<div>${menuLogo(1)}<b>${esc(name)}</b><small>${esc(sub)}</small></div>`;document.body.appendChild(d);try{auInit();clarin()}catch(e){}
 clearTimeout(MENU.mt);try{musicStop()}catch(e){}setTimeout(()=>{then();MENU.v='main'},900);setTimeout(()=>d.classList.add('out'),1500);setTimeout(()=>d.remove(),2300)}
function menuElegir(k){const g=GANADERIAS[k];menuIntro(g.name,`${g.loc||'España'} · encaste ${g.enc}`,()=>startReal(k))}
function menuContinuar(){const sv=load();menuIntro(sv.g.name,`${MESES[sv.month]} ${sv.year}`,()=>continuar())}
const _startNewM=startNew;startNew=function(){const n=NEWG.name.trim();if(!n){toast('Ponle nombre a tu ganadería');return}menuIntro(n,`Encaste ${NEWG.enc} · ${NEWG.prov}`,()=>_startNewM())};
/* partículas doradas y polvo de albero en el fondo del menú */
let MFX=null;
function menuFx(){const cv=$('#mFx');if(!cv){MFX=null;return}if(MFX&&MFX.cv===cv)return;const c=cv.getContext('2d');const P=[];for(let i=0;i<70;i++)P.push({x:Math.random(),y:Math.random(),r:.5+Math.random()*2.2,v:.008+Math.random()*.03,a:Math.random()*6,g:Math.random()<.6});
 MFX={cv};const loop=()=>{if(!MFX||MFX.cv!==cv||!document.body.contains(cv))return;const W=cv.width=cv.clientWidth,H=cv.height=cv.clientHeight;c.clearRect(0,0,W,H);
  for(const p of P){p.y-=p.v/60;p.a+=.01;if(p.y<-.02){p.y=1.02;p.x=Math.random()}const x=(p.x+Math.sin(p.a)*.02)*W,y=p.y*H,al=.25+.45*Math.abs(Math.sin(p.a*2));c.beginPath();c.fillStyle=p.g?`rgba(240,200,110,${al})`:`rgba(255,240,220,${al*.6})`;c.arc(x,y,p.r,0,7);c.fill()}
  requestAnimationFrame(loop)};requestAnimationFrame(loop)}
const _renderM=render;render=function(){_renderM();if(!S)menuFx()};
if(!S){render()}
