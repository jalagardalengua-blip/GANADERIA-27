/* ===================== HIERROS REALES =====================
   Trazado vectorial del hierro de cada ganadería (caja 100x100), sacado de la imagen real con tools/hierro_svg.py.
   El logo de cada ganadería es su hierro en negro sobre los colores de su divisa, como en los carteles.
   Las ganaderías que todavía no tienen su hierro trazado siguen con la fotografía. */
const HIERROS={
"Victorino Martín": "M21.6 29.0 L20.9 28.6 L19.9 26.6 L16.2 17.9 L16.0 16.9 L16.2 16.3 L18.4 14.9 L20.3 14.1 L21.6 14.0 L22.3 14.5 L24.2 18.7 L25.1 19.6 L25.9 19.6 L28.8 18.5 L30.7 18.2 L32.2 17.4 L32.5 16.7 L31.3 12.9 L31.5 11.0 L32.1 10.5 L33.4 10.3 L36.9 9.2 L37.8 9.9 L39.4 15.5 L40.3 16.2 L43.5 15.6 L45.5 15.6 L46.3 15.1 L46.7 14.2 L46.8 8.8 L47.1 7.5 L47.6 7.1 L49.7 7.0 L52.6 7.1 L53.4 7.6 L53.6 8.4 L53.6 14.3 L54.0 15.0 L55.0 15.6 L60.6 16.2 L63.1 16.1 L64.1 14.7 L65.3 9.9 L66.2 9.3 L70.9 10.6 L71.5 11.2 L71.3 13.9 L70.4 17.2 L70.6 18.0 L71.1 18.5 L73.3 19.0 L75.3 18.9 L77.6 14.7 L78.6 13.8 L79.9 14.1 L83.4 16.0 L84.0 16.7 L79.7 25.5 L78.5 27.6 L77.7 28.1 L75.5 27.6 L74.3 26.8 L70.3 25.3 L62.8 23.3 L57.4 22.4 L48.6 22.3 L47.1 22.6 L41.2 22.8 L39.8 23.3 L37.7 23.4 L33.9 24.2 L32.9 24.7 L31.8 24.9 L30.9 25.4 L27.3 26.4 L21.6 29.0ZM24.9 93.0 L24.3 92.9 L19.8 90.8 L19.2 90.1 L19.3 89.4 L28.5 69.5 L30.6 65.6 L31.9 62.3 L34.0 58.3 L38.6 48.1 L41.1 43.1 L42.9 38.8 L44.0 36.9 L48.7 26.3 L49.7 25.3 L51.4 27.4 L54.9 35.0 L57.0 38.5 L57.7 40.2 L68.6 61.9 L81.4 86.9 L81.9 88.8 L80.4 90.0 L77.2 91.6 L76.5 91.7 L76.1 91.4 L67.0 73.6 L66.4 72.7 L65.7 72.2 L36.0 72.3 L35.2 72.5 L34.4 73.5 L26.8 89.9 L25.4 92.6 L24.9 93.0ZM61.6 65.0 L62.1 64.5 L62.0 63.9 L60.2 60.5 L58.6 56.8 L57.3 54.8 L55.7 51.1 L54.4 49.0 L50.9 41.8 L50.3 41.3 L49.9 41.4 L48.7 42.9 L44.1 53.2 L41.4 58.3 L38.9 64.0 L38.9 64.7 L39.8 65.1 L61.6 65.0Z"
};
function hierroDe(g){return g&&HIERROS[g.name]||null}
function ganLogoSVG(g,o={}){const h=hierroDe(g);if(!h)return '';const c=(g.div&&g.div.length?g.div:['#777']),n=c.length,id='hl'+Math.abs([...g.name].reduce((a,ch)=>a*31+ch.charCodeAt(0)|0,7));
 const franjas=c.map((col,i)=>`<rect x="${(i*100/n).toFixed(2)}" y="0" width="${(100/n+.4).toFixed(2)}" height="100" fill="${col}"/>`).join('');
 return `<svg class="ganLogo" viewBox="0 0 100 100" role="img" aria-label="Hierro de ${esc(g.name)}"${o.size?` width="${o.size}" height="${o.size}"`:''}><defs><clipPath id="${id}c"><rect width="100" height="100" rx="${o.r!=null?o.r:0}"/></clipPath>
  <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>
  <g clip-path="url(#${id}c)">${franjas}<rect width="100" height="100" fill="url(#${id}g)"/>
  <g transform="translate(50 50) scale(${o.k||.78}) translate(-50 -50)"><path d="${h}" fill="#000" fill-opacity=".28" fill-rule="evenodd" transform="translate(.8 1.4)"/><path d="${h}" fill="#141210" fill-rule="evenodd"/></g></g></svg>`}
/* el emblema de la ganadería (cabecera, listas, cartel) usa el hierro real cuando lo hay */
const _emblemH=emblem;
emblem=function(g,sz){if(g&&g.name&&hierroDe(g)){const s=sz||48;return `<span class="emb ganLogoW" style="width:${s}px;height:${s}px">${ganLogoSVG(g,{size:s,r:16,k:.8})}</span>`}return _emblemH.apply(this,arguments)};
