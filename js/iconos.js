// Iconos ilustrados de la barra inferior (estilo juego de mundo abierto).
// Dibujos propios a dos tonos en SVG; los colores los pone el CSS con las clases:
//   .b cuerpo · .a acento (degradado de atardecer en la pestaña activa) · .d detalle oscuro · .l trazo
// No modifica juego.js: añade iconos nuevos a ICO y redirige las pestañas a ellos.
(function(){
  const S=(body)=>`<svg class="tico" viewBox="0 0 32 32" aria-hidden="true">${body}</svg>`;
  const T={
    // Inicio: cortijo andaluz con tejado de teja, arco de entrada y sol poniente
    t_inicio:S(`<circle class="a" cx="24.5" cy="7.5" r="3.6"/>
      <path class="a" d="M2.5 15.2 16 6.5l13.5 8.7-1.6 2.1L16 9.6 4.1 17.3z"/>
      <path class="b" d="M5.5 15.6 16 8.9l10.5 6.7V27h-21z"/>
      <path class="d" d="M12.8 27v-4.6a3.2 3.2 0 0 1 6.4 0V27z"/>
      <rect class="d" x="7.6" y="18" width="3" height="3.2" rx=".6"/><rect class="d" x="21.4" y="18" width="3" height="3.2" rx=".6"/>
      <rect class="a" x="1.5" y="27" width="29" height="2.2" rx="1.1"/>`),
    // Finca: dehesa con encina, loma y cerca de madera
    t_finca:S(`<path class="b" d="M1.5 27.5c4-6 9.5-7.8 15-5.2 4.4 2 8.8 1.2 14-1.6v8.8h-29z"/>
      <rect class="d" x="8.9" y="15.5" width="2.2" height="8.5" rx=".8"/>
      <circle class="a" cx="10" cy="11" r="5.2"/><circle class="a" cx="5.6" cy="13.6" r="3.6"/><circle class="a" cx="14.4" cy="13.6" r="3.6"/>
      <g class="l" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M19 17.5v7M23.5 16.6v7.2M28 15.4v7.4M18.2 19.4l10.6-2.4M18.2 22.6l10.6-2.4"/></g>`),
    // Ganadería: cabeza de toro de frente con encornadura
    t_camada:S(`<path class="a" d="M2.2 5.2c.6 5.6 4.2 8.2 8.6 8.2l.6-2.6C7.6 10.7 4.9 9 2.2 5.2zM29.8 5.2c-.6 5.6-4.2 8.2-8.6 8.2l-.6-2.6c3.8-.1 6.5-1.8 9.2-5.6z"/>
      <path class="n" d="M7.2 12.4c1.5-1.3 2.8-1.9 4.3-1.9h9c1.5 0 2.8.6 4.3 1.9l-2.5 1.8-1.2 8.8c-.5 3.2-2.6 5.4-5.1 5.4s-4.6-2.2-5.1-5.4l-1.2-8.8z"/>
      <ellipse class="b" cx="16" cy="24.6" rx="3.6" ry="2.6"/>
      <circle class="a" cx="12.6" cy="16.4" r="1.25"/><circle class="a" cx="19.4" cy="16.4" r="1.25"/>
      <circle class="d" cx="14.7" cy="24.8" r=".6"/><circle class="d" cx="17.3" cy="24.8" r=".6"/>`),
    // Ofertas: cartel de feria taurina
    t_ofertas:S(`<rect class="b" x="6.5" y="3.5" width="19" height="25" rx="1.8"/>
      <rect class="a" x="6.5" y="3.5" width="19" height="6.5" rx="1.8"/>
      <path class="d" d="M9 13.5c.3 1.8 1.4 2.6 2.7 2.6h4.8c1.3 0 2.4-.8 2.7-2.6-.8.9-1.7 1.2-2.7 1.2h-4.8c-1 0-1.9-.3-2.7-1.2zM11.9 16.6h4.4l-.8 3.8-1.4 1.6-1.4-1.6z" transform="translate(1.7 0)"/>
      <rect class="a" x="9.5" y="23" width="13" height="1.8" rx=".9"/><rect class="d" x="11.5" y="25.6" width="9" height="1.2" rx=".6"/>
      <circle class="l" cx="16" cy="6.7" r="1.2" fill="none" stroke-width="1.2"/>`),
    // Mercado: puesto con toldo festoneado y moneda
    t_mercado:S(`<path class="a" d="M3.5 11 6.8 4.5h18.4L28.5 11z"/>
      <path class="a" d="M3.5 11h25a3.1 3.1 0 0 1-6.25 0 3.1 3.1 0 0 1-6.25 0 3.1 3.1 0 0 1-6.25 0 3.1 3.1 0 0 1-6.25 0z"/>
      <path class="d" d="M9.4 4.5h1.4L9.9 11H8.4zM15.3 4.5h1.4V11h-1.4zM21.2 4.5h1.4l1 6.5h-1.5z" opacity=".35"/>
      <rect class="b" x="5.5" y="15" width="21" height="13" rx="1.4"/>
      <rect class="d" x="8.5" y="18" width="7" height="10" rx=".8"/>
      <circle class="a" cx="21.4" cy="21.2" r="3.4"/>
      <rect class="d" x="20.8" y="19.4" width="1.2" height="3.6" rx=".6"/>`),
    // Tareas: portapapeles con lista y marca de hecho
    t_tareas:S(`<rect class="b" x="6" y="5" width="20" height="24" rx="2.4"/>
      <rect class="a" x="11" y="3" width="10" height="5" rx="1.6"/>
      <g class="l" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.8 14.6 2.1 2.1 3.6-4"/></g>
      <rect class="d" x="17.5" y="13.6" width="5.5" height="2" rx="1"/>
      <rect class="d" x="9.8" y="19.4" width="13.2" height="2" rx="1"/><rect class="d" x="9.8" y="23.4" width="9" height="2" rx="1"/>`),
    // Perfil: ganadero con sombrero campero de ala ancha
    t_palmares:S(`<path class="b" d="M5 29.5c.8-5.6 5-8.6 11-8.6s10.2 3 11 8.6z"/>
      <circle class="b" cx="16" cy="14.6" r="5"/>
      <ellipse class="a" cx="16" cy="10.6" rx="12.5" ry="2.6"/>
      <path class="a" d="M10.2 10.2c.2-3.4 2.2-6.2 5.8-6.2s5.6 2.8 5.8 6.2z"/>
      <rect class="d" x="10.3" y="8.2" width="11.4" height="1.6" rx=".8"/>
      <path class="a" d="M13.4 21.2 16 25l2.6-3.8z"/>`)
  };
  if(typeof ICO==='object'&&ICO)Object.assign(ICO,T);
  if(typeof TABS!=='undefined'&&Array.isArray(TABS)){for(const t of TABS){if(T['t_'+t[0]])t[2]='t_'+t[0]}}
  // Degradado de atardecer reutilizable por los iconos activos (url(#g-sol))
  const defs=()=>{if(document.getElementById('g-sol-defs'))return;const d=document.createElement('div');d.id='g-sol-defs';d.setAttribute('aria-hidden','true');
    d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML='<svg width="0" height="0"><defs><linearGradient id="g-sol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd36b"/><stop offset=".5" stop-color="#ff7a3d"/><stop offset="1" stop-color="#ff3d7f"/></linearGradient></defs></svg>';
    document.body.prepend(d)};
  if(document.body)defs();else document.addEventListener('DOMContentLoaded',defs);
})();
