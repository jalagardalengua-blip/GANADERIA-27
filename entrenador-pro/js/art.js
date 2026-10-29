// Gráficos generados: escudos, caras de jugadores, iconos y banderas.
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  G.esc = esc;
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 0.3 + (n >> 8 & 255) * 0.59 + (n & 255) * 0.11) / 255; };
  G.lum = lum;

  // Escudo SVG a partir de los colores del club (forma y dibujo según su id).
  G.crest = function (club, size = 40) {
    if (!club) return '';
    const [a, b] = club.colors;
    const shape = club.id % 4, pattern = Math.floor(club.id / 4) % 5;
    const id = 'cr' + club.id + '_' + size;
    const paths = [
      'M50 4 L92 16 L88 62 Q82 92 50 112 Q18 92 12 62 L8 16 Z',
      'M50 4 A54 54 0 1 1 49.9 4 Z',
      'M14 6 H86 V60 Q86 96 50 114 Q14 96 14 60 Z',
      'M50 2 L96 26 L86 86 L50 114 L14 86 L4 26 Z'
    ];
    const pats = [
      `<rect x="0" y="0" width="100" height="120" fill="${a}"/>`,
      `<rect width="100" height="120" fill="${a}"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${10 + i * 20}" y="0" width="10" height="120" fill="${b}"/>`).join('')}`,
      `<rect width="100" height="120" fill="${a}"/><rect x="0" y="0" width="50" height="120" fill="${b}"/>`,
      `<rect width="100" height="120" fill="${a}"/><path d="M0 30 L100 80 L100 100 L0 50 Z" fill="${b}"/>`,
      `<rect width="100" height="120" fill="${a}"/><rect x="0" y="44" width="100" height="22" fill="${b}"/>`
    ];
    const txt = lum(pattern === 0 ? a : pattern === 4 ? b : a) > 0.6 ? '#0b1528' : '#ffffff';
    const code = esc(club.code);
    return `<svg class="crest" viewBox="0 0 100 120" width="${size}" height="${size * 1.2}" aria-label="Escudo de ${esc(club.name)}"><defs><clipPath id="${id}"><path d="${paths[shape]}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g clip-path="url(#${id})">${pats[pattern]}<rect width="100" height="120" fill="url(#${id}g)"/></g><path d="${paths[shape]}" fill="none" stroke="#e8c770" stroke-width="5"/>${pattern === 4 ? `<text x="50" y="62" text-anchor="middle" dominant-baseline="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="20" fill="${txt}">${code}</text>` : `<circle cx="50" cy="60" r="21" fill="#0b1528" opacity=".85"/><text x="50" y="61" text-anchor="middle" dominant-baseline="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="17" fill="#fff">${code}</text>`}</svg>`;
  };

  // Cara del jugador (avatar ilustrado, distinto para cada id).
  const SKIN = ['#f1c9a5', '#e0ac85', '#c68863', '#8d5a3b', '#5c3a24'];
  const HAIR = ['#1b1410', '#3b2516', '#6b4423', '#b88a4a', '#d9c08a', '#0d0d0d'];
  G.face = function (p, size = 40, shirt) {
    if (!p) return '';
    const s = SKIN[p.skin || 0], h = HAIR[p.hair || 0];
    const k = p.id * 2654435761 >>> 0;
    const hairStyle = k % 6, beard = (k >>> 3) % 5, brow = (k >>> 6) % 3, jaw = (k >>> 9) % 3;
    const eyeY = 52, shade = 'rgba(0,0,0,.18)';
    const shirtC = shirt || '#1f6feb';
    const faceW = [26, 28, 25][jaw];
    const hairs = [
      `<path d="M${50 - faceW} 46 Q50 8 ${50 + faceW} 46 Q${50 + faceW} 26 50 22 Q${50 - faceW} 26 ${50 - faceW} 46Z" fill="${h}"/>`,
      `<path d="M${50 - faceW - 2} 50 Q46 6 ${50 + faceW + 2} 50 L${50 + faceW} 38 Q50 30 ${50 - faceW} 38Z" fill="${h}"/>`,
      `<path d="M${50 - faceW} 42 Q50 20 ${50 + faceW} 42 Q50 30 ${50 - faceW} 42Z" fill="${h}" opacity=".9"/>`,
      `<circle cx="50" cy="34" r="${faceW + 4}" fill="${h}"/><circle cx="50" cy="28" r="${faceW}" fill="${h}"/>`,
      `<path d="M${50 - faceW} 44 Q40 12 62 16 Q${50 + faceW + 4} 22 ${50 + faceW} 44 Q56 30 ${50 - faceW} 44Z" fill="${h}"/>`,
      `<path d="M${50 - faceW + 2} 40 Q50 24 ${50 + faceW - 2} 40" stroke="${h}" stroke-width="3" fill="none" opacity=".6"/>`
    ];
    const beards = ['', `<path d="M${50 - faceW + 3} 60 Q50 92 ${50 + faceW - 3} 60 Q${50 + faceW - 4} 76 50 80 Q${50 - faceW + 4} 76 ${50 - faceW + 3} 60Z" fill="${h}" opacity=".85"/>`, `<path d="M40 70 Q50 76 60 70" stroke="${h}" stroke-width="4" fill="none" opacity=".75"/>`, `<path d="M${50 - faceW + 4} 62 Q50 84 ${50 + faceW - 4} 62" stroke="${h}" stroke-width="2" fill="none" opacity=".4"/>`, ''];
    return `<svg class="face" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><rect width="100" height="100" fill="#0e1b30"/><path d="M14 100 Q16 78 50 76 Q84 78 86 100Z" fill="${shirtC}"/><path d="M40 78 L50 88 L60 78" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/><rect x="43" y="64" width="14" height="16" fill="${s}"/><ellipse cx="50" cy="${eyeY}" rx="${faceW}" ry="31" fill="${s}"/><ellipse cx="${50 - faceW}" cy="${eyeY + 2}" rx="4" ry="7" fill="${s}"/><ellipse cx="${50 + faceW}" cy="${eyeY + 2}" rx="4" ry="7" fill="${s}"/><path d="M${50 - faceW} ${eyeY + 6} Q50 ${eyeY + 40} ${50 + faceW} ${eyeY + 6}" fill="${shade}" opacity=".35"/>${hairs[hairStyle]}<path d="M36 ${eyeY - 6 - brow} L45 ${eyeY - 7}" stroke="${h}" stroke-width="2.6" stroke-linecap="round"/><path d="M55 ${eyeY - 7} L64 ${eyeY - 6 - brow}" stroke="${h}" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="41" cy="${eyeY}" rx="3.2" ry="2.4" fill="#fff"/><ellipse cx="59" cy="${eyeY}" rx="3.2" ry="2.4" fill="#fff"/><circle cx="41" cy="${eyeY}" r="1.7" fill="#1b1410"/><circle cx="59" cy="${eyeY}" r="1.7" fill="#1b1410"/><path d="M50 ${eyeY + 2} L47 ${eyeY + 13} Q50 ${eyeY + 15} 53 ${eyeY + 13}" fill="none" stroke="${shade}" stroke-width="2"/><path d="M43 ${eyeY + 20} Q50 ${eyeY + 23} 57 ${eyeY + 20}" stroke="#7a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>${beards[beard]}</svg>`;
  };

  G.flag = function (nat) {
    const n = G.NATIONS[nat];
    return `<span class="flag" title="${n ? esc(n.name) : ''}">${esc(n ? n.flag : nat)}</span>`;
  };

  // Iconos de línea (24x24)
  const I = {
    home: 'M3 11 12 3l9 8v10h-6v-6H9v6H3z',
    squad: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M12 20c0-3 2-5 4-5 3 0 6 2 6 5',
    tactics: 'M4 4h16v16H4zM12 4v16M4 12h4m8 0h4M9 8l2 2m0-2-2 2M15 15l2 2m0-2-2 2',
    training: 'M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12',
    transfer: 'M4 8h14l-4-4M20 16H6l4 4',
    calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h2m3 0h2m-7 3h2',
    office: 'M3 8h18v12H3zM8 8V5h8v3M3 13h18',
    club: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    comps: 'M8 4h8v4a4 4 0 0 1-8 0zM6 4H3v2a3 3 0 0 0 3 3M18 4h3v2a3 3 0 0 1-3 3M12 12v4M8 20h8M9 16h6v4H9z',
    scout: 'M5 14a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm8 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM8 11V6h2l1 3M16 11V6h-2l-1 3M11 14h2',
    youth: 'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 22v-6a6 6 0 0 1 12 0v6M9 22v-4h6v4',
    db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
    power: 'M12 3v8M6.3 6.3a8 8 0 1 0 11.4 0',
    play: 'M7 4l13 8-13 8z',
    pause: 'M7 4h4v16H7zM13 4h4v16h-4z',
    cam: 'M3 7h4l2-3h6l2 3h4v12H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    tablet: 'M5 3h14v18H5zM10 18h4',
    mega: 'M3 10v4h3l7 5V5L6 10zM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14',
    sub: 'M7 4v12l-3-3M17 20V8l3 3',
    chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    cloud: 'M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z',
    ff: 'M3 5l9 7-9 7zM12 5l9 7-9 7z',
    x: 'M5 5l14 14M19 5L5 19',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    left: 'M15 6l-6 6 6 6', right: 'M9 6l6 6-6 6',
    edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
    whistle: 'M3 12a6 6 0 1 0 12 0 6 6 0 0 0-12 0zM15 10h6v4h-6M9 12h.01'
  };
  G.icon = (name, size = 20) => `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${I[name] || I.star}"/></svg>`;

  G.logo = size => `<svg viewBox="0 0 48 40" width="${size}" height="${size * 0.83}" aria-hidden="true"><path d="M4 32 L2 10 L14 20 L24 4 L34 20 L46 10 L44 32 Z" fill="currentColor"/><rect x="4" y="34" width="40" height="4" rx="1" fill="currentColor"/><circle cx="24" cy="22" r="4" fill="var(--bg)"/></svg>`;

  // Color de la media al estilo de las cartas.
  G.ovrClass = v => v >= 85 ? 'o-elite' : v >= 78 ? 'o-gold' : v >= 70 ? 'o-silver' : v >= 60 ? 'o-bronze' : 'o-low';
  G.ratingClass = r => r >= 8 ? 'r-top' : r >= 7 ? 'r-good' : r >= 6 ? 'r-ok' : 'r-bad';
})();
