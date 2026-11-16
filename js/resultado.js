/* ===================== RESULTADO DE LA CORRIDA =====================
   Al acabar la corrida en directo (o al pulsar «Resumen») sale una pantalla de resultados como la de un
   juego de hoy: cabecera con el logo de la ganadería y el resultado, cifras de la tarde y una tarjeta por toro
   con su arrastre, las orejas, la nota y el juicio. El toro de la tarde va destacado.
   La repetición en dibujo (2D) sigue disponible desde aquí. */
const RS_COL={indulto:'#ffb35c',vuelta:'#8fb7ff',ovacion:'#7fd19b',silencio:'#9aa0ab',pitos:'#e0454c',devuelto:'#7fd19b'};
function rsOreja(n){const o='<svg viewBox="0 0 20 28" class="rsO" aria-hidden="true"><path d="M10 1C3 6 1 14 4 21c2 4 5 6 6 6s4-2 6-6c3-7 1-15-6-20Z" fill="currentColor"/><path d="M10 6c-3 4-4 9-2 14" stroke="#0008" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';return o.repeat(n)}
function rsNota(t){const v=parseFloat(nota10(t));if(isNaN(v))return '<div class="rsNota sin">—</div>';const p=Math.max(0,Math.min(1,v/10)),c=v>=8?'#f3d68b':v>=6?'#e6bb55':v>=4?'#9aa0ab':'#e0454c';
 return `<div class="rsNota" style="--p:${p};--c:${c}"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" class="f"/><circle cx="18" cy="18" r="15.5" class="v" stroke-dasharray="${(p*97.4).toFixed(1)} 97.4"/></svg><b>${v.toFixed(1)}</b></div>`}
function resultadoCorrida(id){const r=S.hist.find(h=>h.id===id);if(!r||!r.toros)return;S.porVer=(S.porVer||[]).filter(x=>x!==id);r.visto=true;save();
 const ts=r.toros,trof=ts.reduce((a,t)=>a+(t.trof||0),0),indul=ts.filter(t=>t.res==='indulto').length;
 const notas=ts.map(t=>parseFloat(nota10(t))).filter(v=>!isNaN(v));const media=r.notaMedia!=null?(+r.notaMedia).toFixed(1):notas.length?(notas.reduce((a,b)=>a+b,0)/notas.length).toFixed(1):'—';
 let mejor=-1,mv=-1;ts.forEach((t,i)=>{const v=parseFloat(nota10(t));if(!isNaN(v)&&v>mv){mv=v;mejor=i}});
 const g=S.g,logo=typeof ganLogoSVG==='function'?ganLogoSVG(g,{r:12,k:.8}):'';const cat=r.cat===1?'Plaza de primera':r.cat===2?'Plaza de segunda':'Plaza de tercera';
 const tono=indul?'indulto':trof>=3?'triunfo':trof>=1?'oreja':ts.some(t=>t.res==='pitos')?'pitos':'gris';
 const cards=ts.map((t,i)=>{const col=RS_COL[t.res]||'#9aa0ab';const orejas=t.res==='indulto'?'<span class="rsInd">Indultado</span>':t.trof?rsOreja(Math.min(3,t.trof)):'';
  return `<article class="rsT${i===mejor&&mv>=6?' top':''}" style="--rc:${col}">
   <div class="rsN">${i+1}</div>
   <div class="rsI"><div class="rsNom">${esc(t.name)}${t.num!=null?` <small>nº ${t.num}</small>`:''}</div>
    <div class="rsSub">${t.peso} kg · ${esc(t.pelo||'')}${t.enc?` · ${esc(t.enc)}`:''}</div>
    <div class="rsMat">${esc(t.cogida&&t.sust?t.sust.n+' (sustituto)':t.mat||'')}</div>
    <div class="rsRes"><span class="rsChip">${RESTXT[t.res]||t.res}</span>${orejas}</div>
    ${t.juicio?`<div class="rsJ">${esc(t.juicio)}</div>`:''}</div>
   ${rsNota(t)}${i===mejor&&mv>=6?'<div class="rsTop">Toro de la tarde</div>':''}</article>`}).join('');
 modal(r.plaza,`<div class="rsW rs-${tono}">
  <header class="rsH"><div class="rsLogo">${logo}</div><div class="rsHT"><div class="rsK">${esc(cat)} · ${esc(r.feria||'')}</div><div class="rsG">${esc(g.name)}</div><div class="rsR">${esc(r.resumen||'')}</div></div></header>
  <div class="rsS"><div><b>${r.dp>=0?'+':''}${r.dp??0}</b><span>Prestigio</span></div><div><b>${eur(r.ingreso||0)}</b><span>Ingresos</span></div><div><b>${trof}${indul?` <small>+${indul} ind.</small>`:''}</b><span>Orejas</span></div><div><b>${media}</b><span>Nota media</span></div></div>
  ${r.premio?`<div class="rsP">🏆 ${esc(r.premio)} gana el premio al toro más bravo de la feria</div>`:''}
  <div class="rsL">${cards}</div>
  <p class="rsNote">Las madres de cada toro guardan su resultado en la ficha: úsalo para decidir qué vacas siguen en la ganadería.</p>
  <div class="rsA"><button class="btn oro" onclick="closeModal();enterPlaza(${r.id})">Ver otra vez en directo</button>
   <button class="btn" onclick="closeModal();rsRepeticion(${r.id})">Repetición en dibujo</button>
   <button class="btn" onclick="compartirCorrida(${r.id})">Compartir</button></div></div>`);
 const sh=$('#ov .sheet');if(sh)sh.classList.add('rsSheet')}
/* la repetición en dibujo de siempre, con su aspecto renovado */
function rsRepeticion(id){RS.rep=true;try{verCorrida(id)}finally{RS.rep=false}}
const RS={rep:false};
/* «Resumen» en la repetición 2D lleva a la pantalla nueva */
{const _ec=endCorrida;endCorrida=function(){const P=PLAY;const r=_ec.apply(this,arguments);try{if(P&&P.r&&!RS.rep){const id=P.r.id;closeModal(true);PLAY=null;resultadoCorrida(id)}}catch(e){}return r}}
/* la repetición 2D: cabecera con progreso por toros y mandos agrupados */
{const _vcR=verCorrida;verCorrida=function(id){const out=_vcR.apply(this,arguments);try{const sh=$('#ov .sheet');if(sh){sh.classList.add('vcSheet');const r=S.hist.find(h=>h.id===id);
  const row=sh.querySelector('#ppause')&&sh.querySelector('#ppause').parentElement;if(row)row.classList.add('vcBar');
  const top=sh.querySelector('.ring-wrap');if(top&&r&&!sh.querySelector('.vcDots')){const d=document.createElement('div');d.className='vcDots';d.innerHTML=r.toros.map((t,i)=>`<i data-i="${i}"></i>`).join('');top.before(d)}}}catch(e){}return out}}
/* marca el toro que se está viendo en la repetición */
setInterval(()=>{try{if(!PLAY||!PLAY.cv||!PLAY.cv.isConnected)return;document.querySelectorAll('.vcDots i').forEach((e,i)=>{e.classList.toggle('on',i===PLAY.i);e.classList.toggle('ya',i<PLAY.i)})}catch(e){}},400);
