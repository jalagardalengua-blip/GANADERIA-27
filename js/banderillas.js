/* ===================== BANDERILLAS DE CADA GANADERÍA =====================
   Las ganaderías que todavía no tienen su hierro real trazado (HIERROS en hierros.js) y la que
   funda el jugador se identifican con un par de banderillas cruzadas forradas con el papel de su
   divisa. Las que sí tienen hierro trazado lo siguen mostrando. Va después de hierros.js. */
function banderillasSVG(cols,sz){const d=(cols&&cols.length?cols:['#e6bb55','#8d1420']).map(c=>esc(c));const id='bd'+(++banderillasSVG.n);
 const band=(y,c)=>`<path d="M-4.6 ${y}h9.2l-.9 3.4.9 3.4h-9.2l.9-3.4z" fill="${c}" stroke="#0b0710" stroke-width=".55"/>`;
 let papel='';for(let i=0;i<6;i++)papel+=band(6+i*6.2,d[i%d.length]);
 const una=`<g><rect x="-1.1" y="4" width="2.2" height="44" rx="1" fill="#e9dcc0"/>${papel}
  <path d="M-2.4 3.2c.8-2.2 4-2.2 4.8 0z" fill="${d[d.length>1?1:0]}" stroke="#0b0710" stroke-width=".5"/>
  <path d="M0 47.5l-1.5 0 0 6.5-3 2.6 3.4-.6L0 61l1.1-5 3.4.6-3-2.6v-6.5z" fill="url(#${id})" stroke="#0b0710" stroke-width=".45"/></g>`;
 return `<svg class="emb band" width="${sz}" height="${sz}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8f969e"/><stop offset=".5" stop-color="#f1f3f5"/><stop offset="1" stop-color="#7c838b"/></linearGradient></defs>
 <g transform="translate(32 0) rotate(-24 0 32) scale(1.18 1)">${una}</g><g transform="translate(32 0) rotate(24 0 32) scale(1.18 1)">${una}</g></svg>`}
banderillasSVG.n=0;
(function(){if(typeof emblem!=='function')return;const prev=emblem;
 emblem=function(g,sz){const traz=g&&g.name&&typeof HIERROS!=='undefined'&&HIERROS[g.name];
  if(!traz&&g&&g.div&&g.div.length)return banderillasSVG(g.div,sz||48);return prev.apply(this,arguments)}})();
