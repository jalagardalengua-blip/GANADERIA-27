/* ===================== NOMBRES CON LOS COLORES DE SU DIVISA =====================
   El nombre de cada ganadería se escribe en letra clásica (Cinzel) con los colores reales de su divisa:
   la cinta de arriba y la de abajo, como cuando el toro sale al ruedo con la divisa en el morrillo.
   Un filo crema y una sombra suave hacen que se lea aunque la divisa sea oscura (negro, azul, granate).
   Se aplica en la cabecera, la elección de ganadería, el perfil, los resultados y las listas. */
const NDV={mapa:null,t:0};
function ndvMapa(){if(NDV.mapa)return NDV.mapa;const m=new Map();try{for(const g of (typeof GANADERIAS!=='undefined'?GANADERIAS:[])){const d=(typeof divReal==='function'&&divReal(g.name))||g.div;if(d&&d.length)m.set(g.name.toLowerCase(),d)}}catch(e){}NDV.mapa=m;return m}
function ndvColores(nombre){const k=String(nombre||'').trim().toLowerCase();if(typeof S!=='undefined'&&S&&S.g&&S.g.name&&S.g.name.toLowerCase()===k&&S.g.div)return S.g.div;
 const m=ndvMapa();if(m.has(k))return m.get(k);try{for(const r of (S&&S.rivals)||[])if(r.name&&r.name.toLowerCase()===k&&r.div)return r.div}catch(e){}return null}
function ndvPon(el,d){const a=d[0]||'#c9a033',b=d[1]||d[0]||'#c9a033';if(el.dataset.ndv===a+b)return;el.dataset.ndv=a+b;el.classList.add('divN');el.style.setProperty('--d1',a);el.style.setProperty('--d2',b)}
function ndvAplicar(root){root=root||document.body;if(!root)return;
 // la cabecera de la partida
 try{const h=document.querySelector('.hdr .gname');if(h&&S&&S.g&&S.g.div)ndvPon(h,S.g.div)}catch(e){}
 // cualquier texto que sea exactamente el nombre de una ganadería y tenga tamaño de título
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const vistos=new Set();
 while(n=w.nextNode()){const t=n.textContent.trim();if(t.length<4||t.length>40)continue;const el=n.parentElement;if(!el||vistos.has(el)||el.closest('svg,option,textarea,input,.agenda,table'))continue;
  if(el.childElementCount)continue;const d=ndvColores(t);if(!d)continue;vistos.add(el);const fs=parseFloat(getComputedStyle(el).fontSize)||0;if(fs<15)continue;ndvPon(el,d)}}
function ndvPronto(){clearTimeout(NDV.t);NDV.t=setTimeout(()=>{try{ndvAplicar()}catch(e){}},30)}
new MutationObserver(ms=>{for(const m of ms)if(m.addedNodes.length){ndvPronto();break}}).observe(document.documentElement,{childList:true,subtree:true});
addEventListener('load',ndvPronto);
