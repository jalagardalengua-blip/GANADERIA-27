// Interfaz del modo carrera (estilo menú de juego de fútbol).
(function () {
  const P = id => G.C.world.players[id];
  const CL = id => G.C.world.clubs[id];
  const esc = G.esc;
  const ic = G.icon;
  const me = () => CL(G.C.user.club);
  const S = { view: 'inicio', newsIdx: 0, squadSort: 'pos', squadFilter: 'ALL', tacSel: null, mkTab: 'buscar', mk: { q: '', pos: 'ALL', league: 'ALL', ageMin: 15, ageMax: 40, ovrMin: 60, price: 0 }, compTab: 'liga', compLeague: null, statKey: 'g', calWeek: null, officeMsg: null, dbTab: 'jugadores', db: { q: '', league: 'ALL', pos: 'ALL' } };
  G.ui = { S };

  const POS_ORDER = { POR: 0, DFC: 1, LD: 2, LI: 3, MCD: 4, MC: 5, MCO: 6, ED: 7, EI: 8, DC: 9 };
  const grp = pos => G.POS_GROUP[pos];
  const posTag = pos => `<span class="pos pos-${grp(pos)}">${pos}</span>`;
  const ovrTag = v => `<span class="ovr ${G.ovrClass(v)}">${v}</span>`;
  const stars = rep => { const n = Math.max(1, Math.min(5, Math.round((rep - 55) / 7))); return `<span class="stars" title="Reputación ${rep}">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`; };
  const bar = (v, col) => `<span class="bar"><i style="width:${Math.max(0, Math.min(100, v))}%;background:${col || (v < 45 ? 'var(--bad)' : v < 65 ? 'var(--warn)' : 'var(--good)')}"></i></span>`;
  const money = G.fmtMoney;

  // ------------------------------------------------------------------ modales y avisos
  G.ui.modal = function (html, bind, sticky, cls) {
    const root = document.getElementById('modal-root');
    root.innerHTML = `<div class="modal-bg"><div class="modal ${cls || ''}" role="dialog" aria-modal="true">${html}</div></div>`;
    const bg = root.firstChild;
    if (!sticky) bg.addEventListener('click', e => { if (e.target === bg) G.ui.closeModal(); });
    root.querySelectorAll('[data-close]').forEach(b => b.onclick = () => G.ui.closeModal());
    if (bind) bind(bg.firstChild);
    return bg.firstChild;
  };
  G.ui.closeModal = () => { document.getElementById('modal-root').innerHTML = ''; };
  G.ui.toast = function (text, kind) {
    const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = text;
    document.getElementById('toast-root').appendChild(t);
    setTimeout(() => t.remove(), 3600);
  };
  const modal = G.ui.modal, closeModal = G.ui.closeModal, toast = G.ui.toast;
  const closeBtn = `<button class="icon-btn" data-close aria-label="Cerrar">${ic('x', 20)}</button>`;

  // ------------------------------------------------------------------ arranque
  function boot() {
    G.C = null;
    if (G.load()) { ensureDefaults(); renderShell(); return; }
    renderStart();
  }
  function ensureDefaults() {
    const c = G.C;
    c.settings = Object.assign({ camera: 'banquillo', speed: 1, replays: true, night: true }, c.settings || {});
    c.shortlist = c.shortlist || [];
  }

  function renderStart() {
    const app = document.getElementById('app');
    const has = G.hasSave();
    app.innerHTML = `<div class="start"><div class="hero-3d" id="starthero"></div><div class="start-inner">
      <h1>${G.logo(64)}ELITEMANAGER</h1><div class="tag">TU CLUB · TU HISTORIA</div>
      <div class="start-menu">
        ${has ? `<button class="btn primary" id="cont">${ic('play')} Continuar carrera</button>` : ''}
        <button class="btn ${has ? '' : 'primary'}" id="new">${ic('whistle')} Nueva carrera</button>
        <button class="btn" id="how">${ic('star')} Cómo se juega</button>
      </div>
      <p class="muted" style="max-width:52ch;margin-top:26px">10 ligas, 186 clubes y más de 4.700 jugadores, todos ficticios y con cualidades propias. Ficha, entrena, toma decisiones y dirige los partidos en 3D desde la banda.</p>
    </div></div>`;
    try { new G.HeroStadium(document.getElementById('starthero'), ['#1f6feb', '#ffffff'], 'ELITEMANAGER'); } catch (e) { /* sin WebGL */ }
    const cont = document.getElementById('cont');
    if (cont) cont.onclick = () => { if (G.load()) { ensureDefaults(); renderShell(); } else toast('No se pudo cargar la partida.', 'bad'); };
    document.getElementById('new').onclick = newCareerFlow;
    document.getElementById('how').onclick = howTo;
  }

  function howTo() {
    modal(`<div class="modal-h"><h2>Cómo se juega</h2>${closeBtn}</div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
        <div class="panel"><h3>1. Elige club</h3><p class="muted">Cada club tiene presupuesto, estadio, reputación y un objetivo de la directiva.</p></div>
        <div class="panel"><h3>2. Prepara la semana</h3><p class="muted">Plan de entrenamiento, alineación, táctica y respuestas a la prensa, los jugadores y la directiva.</p></div>
        <div class="panel"><h3>3. Juega</h3><p class="muted">Pulsa CONTINUAR. Mira el partido en 3D (cámara Banquillo para verlo como entrenador), grita órdenes, haz cambios desde la tablet y da la charla del descanso. O simúlalo.</p></div>
        <div class="panel"><h3>4. Mercado</h3><p class="muted">Ventanas en verano (jornadas 1-4) e invierno (19-22). Negocia el traspaso con el club y luego el contrato con el jugador.</p></div>
        <div class="panel"><h3>5. Temporada</h3><p class="muted">Liga, Copa Continental o Copa Libertad, y al final la gala: Balón Dorado, Bota Dorada, Guante Dorado y Premio Promesa.</p></div>
        <div class="panel"><h3>6. Base de datos</h3><p class="muted">Puedes editar nombres y medias de cualquier jugador o club, o importar plantillas desde un CSV.</p></div>
      </div>`);
  }

  function newCareerFlow() {
    const seed = Math.floor(Math.random() * 1e9);
    G.C = { world: G.generateWorld(seed) };
    let league = 'ESP', sel = null;
    const draw = () => {
      const clubs = G.C.world.leagues[league].clubs.map(CL).sort((a, b) => b.rep - a.rep);
      document.getElementById('app').innerHTML = `<div class="start"><div class="hero-3d" id="starthero"></div><div class="start-inner" style="max-width:1300px">
        <h1 style="font-size:46px">${G.logo(40)}NUEVA CARRERA</h1>
        <div class="row" style="margin:18px 0"><div class="field" style="margin:0"><label for="mgr">Tu nombre de entrenador</label><input type="text" id="mgr" maxlength="28" value="${esc(S.mgr || '')}" placeholder="Míster"></div></div>
        <div class="tabs">${G.LEAGUES.map(L => `<button class="tab ${L.id === league ? 'active' : ''}" data-lg="${L.id}">${esc(L.name)}</button>`).join('')}</div>
        <div class="club-pick">${clubs.map(c => `<button class="club-tile ${sel === c.id ? 'on' : ''}" data-club="${c.id}">${G.crest(c, 42)}<div style="min-width:0"><b>${esc(c.name)}</b>${stars(c.rep)}<div class="muted" style="font-size:12px">Media ${G.squadOvr(c)} · ${money(c.budget)}</div></div></button>`).join('')}</div>
        <div class="row" style="margin-top:18px"><button class="btn" id="back">${ic('left')} Volver</button><span class="spacer"></span><button class="btn primary" id="go" ${sel ? '' : 'disabled'}>Empezar con ${sel ? esc(CL(sel).name) : '…'} ${ic('arrow')}</button></div>
      </div></div>`;
      try { new G.HeroStadium(document.getElementById('starthero'), sel ? CL(sel).colors : ['#1f6feb', '#fff'], ''); } catch (e) { /* sin WebGL */ }
      const app = document.getElementById('app');
      app.querySelector('#mgr').oninput = e => { S.mgr = e.target.value; };
      app.querySelectorAll('[data-lg]').forEach(b => b.onclick = () => { league = b.dataset.lg; draw(); });
      app.querySelectorAll('[data-club]').forEach(b => b.onclick = () => { sel = +b.dataset.club; clubInfo(sel, draw); });
      app.querySelector('#back').onclick = renderStart;
      app.querySelector('#go').onclick = () => {
        if (!sel) return;
        G.newCareer(sel, (S.mgr || '').trim() || 'Míster', seed);
        ensureDefaults();
        if (!G.save()) toast('Tu navegador no permite guardar: la partida se perderá al cerrar.', 'bad');
        S.view = 'inicio';
        renderShell();
      };
    };
    function clubInfo(id, redraw) {
      const c = CL(id), lr = G.lineRatings(c);
      const best = c.players.map(P).sort((a, b) => b.ovr - a.ovr).slice(0, 5);
      modal(`<div class="modal-h"><div class="row">${G.crest(c, 54)}<div><h2>${esc(c.name)}</h2><div class="muted">${esc(G.leagueOf(c.league).name)} · ${esc(c.stadium)} (${c.capacity.toLocaleString('es-ES')})</div></div></div>${closeBtn}</div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
          <div class="panel"><div class="lines" style="justify-content:flex-start"><span>ATA <b>${lr.ata}</b></span><span>MED <b>${lr.med}</b></span><span>DEF <b>${lr.def}</b></span></div><p>Reputación ${stars(c.rep)}<br>Presupuesto: <b>${money(c.budget)}</b></p></div>
          <div class="panel"><div class="panel-h"><h3>Estrellas</h3></div>${best.map(p => `<div class="sub-row"><div class="player-cell">${G.face(p, 28, c.colors[0])}<span>${esc(G.fullName(p))}</span></div><span>${posTag(p.pos)} ${ovrTag(p.ovr)}</span></div>`).join('')}</div>
        </div>
        <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn primary" id="pickc">Elegir este club</button></div>`, mm => { mm.querySelector('#pickc').onclick = () => { closeModal(); sel = id; redraw(); }; });
    }
    draw();
  }

  // ------------------------------------------------------------------ estructura principal
  // Pestañas superiores (como LB/RB en el mando) y pantallas de fichas con foto.
  const SECTIONS = [
    ['inicio', 'Inicio', ['inicio']],
    ['plantilla', 'Plantilla', ['hub-plantilla', 'plantilla', 'tacticas', 'entrenamiento', 'cantera']],
    ['traspasos', 'Traspasos', ['hub-traspasos', 'traspasos', 'ojeo']],
    ['competiciones', 'Competiciones', ['hub-competiciones', 'competiciones', 'calendario']],
    ['club', 'Club', ['hub-club', 'oficina', 'club', 'basedatos', 'config']]
  ];
  const TITLES = { plantilla: 'Jugadores', tacticas: 'Tácticas', entrenamiento: 'Entrenamiento', cantera: 'Cantera', traspasos: 'Mercado de fichajes', ojeo: 'Ojeo', competiciones: 'Competiciones', calendario: 'Calendario', oficina: 'Oficina', club: 'Club', basedatos: 'Base de datos', config: 'Configuración' };
  const sectionOf = v => SECTIONS.find(s => s[2].includes(v)) || SECTIONS[0];
  const sectionHome = k => k === 'inicio' ? 'inicio' : 'hub-' + k;

  function renderShell() {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="shell2">
      <header class="hdr">
        <div class="brand">${G.logo(30)}<span>ELITEMANAGER</span></div>
        <nav class="toptabs" id="toptabs" aria-label="Menú principal"></nav>
        <div class="hdr-r" id="topbar"></div>
      </header>
      <main class="main" id="main"></main>
    </div>`;
    render();
  }

  function render() {
    renderTop(); renderNav();
    const main = document.getElementById('main');
    const v = VIEWS[S.view] || VIEWS.inicio;
    const sec = sectionOf(S.view);
    const detail = !S.view.startsWith('hub-') && S.view !== 'inicio';
    main.innerHTML = (detail ? `<div class="crumb"><button class="back" data-go="${sectionHome(sec[0])}">${ic('left', 18)} Volver</button><span>${esc(sec[1])}</span><span class="dim">/</span><b>${esc(TITLES[S.view] || '')}</b></div>` : '') + v.html();
    v.bind && v.bind(main);
    main.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { if (b.dataset.pre) { const [k, val] = b.dataset.pre.split(':'); S[k] = val; } go(b.dataset.go); });
    main.querySelectorAll('[data-player]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); playerModal(+b.dataset.player); }));
    main.querySelectorAll('[data-clubinfo]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); clubModal(+b.dataset.clubinfo); }));
    main.querySelectorAll('[data-act="play"]').forEach(b => b.onclick = e => { e.stopPropagation(); continueFlow(); });
    G.fillPhotos && G.fillPhotos(main, me());
  }
  G.ui.render = render;
  function go(v) { S.view = v; render(); document.getElementById('main').scrollTop = 0; }

  function weather() {
    const c = G.C, m = G.weekDate(c.week).getUTCMonth();
    const base = [10, 12, 15, 18, 22, 27, 30, 29, 25, 19, 14, 11][m];
    const t = base + ((c.week * 7 + c.season) % 7) - 3;
    return t + '°C';
  }

  function renderTop() {
    const c = G.C, club = me();
    const fxs = G.userFixtures();
    const label = fxs.length ? 'Jugar partido' : 'Continuar';
    document.getElementById('topbar').innerHTML = `
      <span class="tb-item dt">${ic('calendar')} ${esc(G.fmtDate(G.weekDate(c.week)))} · Sem. ${c.week + 1}</span>
      <span class="tb-item wx">${ic('cloud')} ${weather()}</span>
      <span class="tb-club">${G.crest(club, 28)}<div><b>${esc(club.name)}</b><small>${esc(c.user.name)} · Mánager</small></div></span>
      <button class="btn-continue" id="cont">${ic(fxs.length ? 'play' : 'ff', 18)} ${label}</button>
      <button class="icon-btn" id="exit" aria-label="Guardar y salir" title="Guardar y salir">${ic('power', 22)}</button>`;
    document.getElementById('cont').onclick = continueFlow;
    document.getElementById('exit').onclick = () => { G.save(); toast('Partida guardada.', 'good'); renderStart(); };
  }

  function renderNav() {
    const cur = sectionOf(S.view)[0];
    const unread = G.C.inbox.filter(m => !m.read).length;
    const el = document.getElementById('toptabs');
    el.innerHTML = `<button class="bumper" data-step="-1" aria-label="Pestaña anterior (Q)">Q</button>` +
      SECTIONS.map(([k, l]) => `<button class="ttab ${cur === k ? 'on' : ''}" data-sec="${k}">${l}${k === 'club' && unread ? ` <span class="badge">${unread}</span>` : ''}</button>`).join('') +
      `<button class="bumper" data-step="1" aria-label="Pestaña siguiente (E)">E</button>`;
    el.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => go(sectionHome(b.dataset.sec)));
    el.querySelectorAll('[data-step]').forEach(b => b.onclick = () => stepSection(+b.dataset.step));
    const on = el.querySelector('.ttab.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function stepSection(d) {
    const i = SECTIONS.indexOf(sectionOf(S.view));
    go(sectionHome(SECTIONS[(i + d + SECTIONS.length) % SECTIONS.length][0]));
  }
  // Q / E cambian de pestaña (como LB / RB); Escape vuelve atrás.
  document.addEventListener('keydown', e => {
    if (!G.C || !document.getElementById('toptabs') || document.querySelector('.match-screen') || document.querySelector('.modal-bg')) return;
    if (/input|select|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'q' || e.key === 'Q') stepSection(-1);
    else if (e.key === 'e' || e.key === 'E') stepSection(1);
    else if (e.key === 'Escape' && !S.view.startsWith('hub-') && S.view !== 'inicio') go(sectionHome(sectionOf(S.view)[0]));
  });

  // Ficha con foto (estilo menú de consola).
  function tile(o) {
    const attrs = o.go ? `data-go="${o.go}"${o.pre ? ` data-pre="${o.pre}"` : ''}` : o.player ? `data-player="${o.player}"` : o.act ? `data-act="${o.act}"` : '';
    return `<button class="tile ${o.cls || ''}" ${attrs}>${o.photo ? `<div class="tile-img" data-photo="${o.photo}"></div>` : `<div class="tile-img tile-ico">${ic(o.icon || 'star', 64)}</div>`}<div class="tile-shade"></div>${o.badge ? `<span class="tile-badge">${o.badge}</span>` : ''}<div class="tile-txt"><b>${o.title}</b>${o.sub ? `<small>${o.sub}</small>` : ''}${o.extra || ''}</div></button>`;
  }
  G.ui.tile = tile;

  // ------------------------------------------------------------------ avanzar
  function continueFlow() {
    const fxs = G.userFixtures();
    if (fxs.length) return prematch(fxs[0]);
    advance();
  }

  function advance() {
    const btn = document.getElementById('cont'); if (btn) { btn.disabled = true; btn.textContent = 'Simulando…'; }
    setTimeout(() => {
      const out = G.advanceWeek();
      if (!G.save()) toast('No se pudo guardar (almacenamiento lleno o bloqueado).', 'bad');
      render();
      if (out && out.seasonEnd) seasonEndModal(out.summary);
      else {
        const pending = G.C.inbox.filter(m => (m.kind === 'decision' || m.kind === 'oferta') && !m.done && !m.read);
        if (pending.length) toast('Tienes ' + pending.length + ' asunto(s) pendiente(s) en la Oficina.');
      }
    }, 30);
  }

  function prematch(fx) {
    const uid = G.C.user.club;
    const h = CL(fx.h), a = CL(fx.a), opp = fx.h === uid ? a : h;
    const ok = G.validLineup(me());
    const lh = G.lineRatings(h), la = G.lineRatings(a);
    const isCup = !G.LEAGUES.some(l => l.id === fx.comp);
    const cup = isCup && G.C.cups.find(x => x.id === fx.comp);
    const round = cup ? cup.roundNames[cup.weeks.indexOf(G.C.week)] : 'Jornada ' + (G.C.week + 1);
    const key = opp.players.map(P).sort((x, y) => y.ovr - x.ovr)[0];
    const injured = me().players.map(P).filter(p => p.inj);
    const tired = me().lineup.map(P).filter(p => p.fit < 70);
    const tm = (c, lr) => `<div class="tm">${G.crest(c, 72)}<h2>${esc(c.name)}</h2><div class="lines"><span>ATA <b>${lr.ata}</b></span><span>MED <b>${lr.med}</b></span><span>DEF <b>${lr.def}</b></span></div><div class="muted">${esc(c.formation)} · ${stars(c.rep)}</div></div>`;
    modal(`<div class="modal-h"><h2>${esc(G.compName(fx.comp))} · ${esc(round)}</h2>${closeBtn}</div>
      <div class="muted" style="text-align:center">${esc(h.stadium)} · ${esc(G.fmtDate(G.weekDate(G.C.week)))} · 21:00</div>
      <div class="prematch">${tm(h, lh)}<div class="vs">VS</div>${tm(a, la)}</div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-bottom:14px">
        <div class="panel"><div class="panel-h"><h3>Informe del rival</h3></div><p style="margin:0">Jugador a vigilar: <b>${esc(G.fullName(key))}</b> ${posTag(key.pos)} ${ovrTag(key.ovr)}</p><p class="muted" style="margin:6px 0 0">Forma: ${formDots(opp.id)}</p></div>
        <div class="panel"><div class="panel-h"><h3>Tu equipo</h3></div>
          <p style="margin:0">${me().formation} · Química ${Math.round(me().chem)}%</p>
          ${!ok ? '<p class="warn" style="margin:6px 0 0">Tu alineación tenía bajas: se ha recolocado automáticamente.</p>' : ''}
          ${injured.length ? `<p class="muted" style="margin:6px 0 0">Bajas: ${injured.map(p => esc(G.shortName(p))).join(', ')}</p>` : ''}
          ${tired.length ? `<p class="warn" style="margin:6px 0 0">Cansados en el once: ${tired.map(p => esc(G.shortName(p)) + ' (' + Math.round(p.fit) + '%)').join(', ')}</p>` : ''}
        </div>
      </div>
      <div class="play-btns">
        <button class="btn primary" id="p3d">${ic('cam', 22)}Ver en 3D<small>Dirige desde la banda: órdenes, cambios y charla</small></button>
        <button class="btn" id="psim">${ic('ff', 22)}Simular<small>Resultado al instante con el mismo motor</small></button>
        <button class="btn" id="ptac">${ic('tactics', 22)}Alineación<small>Ajusta el once y la táctica</small></button>
      </div>`, mm => {
      mm.querySelector('#p3d').onclick = () => {
        closeModal();
        if (!window.THREE) { toast('Tu navegador no puede mostrar 3D. Se simulará el partido.', 'bad'); return simulate(fx); }
        try { G.playMatch3D(fx, res => afterMatch(fx, res)); } catch (e) { toast('No se pudo iniciar el 3D: ' + e.message, 'bad'); simulate(fx); }
      };
      mm.querySelector('#psim').onclick = () => { closeModal(); simulate(fx); };
      mm.querySelector('#ptac').onclick = () => { closeModal(); go('tacticas'); };
    }, false, 'wide');
  }

  function simulate(fx) {
    const { m, res } = G.simulateUserMatch(fx);
    const uid = G.C.user.club;
    const goals = res.events.filter(e => e.type === 'goal');
    const s = res.stats;
    modal(`<div class="modal-h"><h2>Resultado</h2></div>
      <div class="prematch"><div class="tm">${G.crest(CL(fx.h), 56)}<h2>${esc(CL(fx.h).name)}</h2></div><div class="vs" style="color:var(--fg)">${res.hg} - ${res.ag}${res.pen ? `<div class="muted" style="font-size:16px">Penaltis ${res.pen[0]}-${res.pen[1]}</div>` : ''}</div><div class="tm">${G.crest(CL(fx.a), 56)}<h2>${esc(CL(fx.a).name)}</h2></div></div>
      <p class="muted" style="text-align:center">${goals.map(e => e.min + "' " + esc(G.shortName(P(e.pid)))).join(' · ') || 'Sin goles'}</p>
      <div class="panel"><div class="stat-cmp"><b>${res.poss[0]}%</b><span class="lbl">Posesión</span><b style="text-align:right">${res.poss[1]}%</b></div><div class="stat-cmp"><b>${s[0].shots}</b><span class="lbl">Tiros (a puerta)</span><b style="text-align:right">${s[1].shots}</b></div><div class="stat-cmp"><b>${s[0].onT}</b><span class="lbl">A puerta</span><b style="text-align:right">${s[1].onT}</b></div><div class="stat-cmp"><b>${s[0].xg.toFixed(2)}</b><span class="lbl">xG</span><b style="text-align:right">${s[1].xg.toFixed(2)}</b></div></div>
      <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn primary" id="sdone">Continuar</button></div>`, mm => { mm.querySelector('#sdone').onclick = () => { closeModal(); afterMatch(fx, res); }; }, true);
  }

  function afterMatch(fx, res) {
    G.playUserMatch(fx, res);
    const lr = G.C.user.lastResult;
    toast(lr.gf > lr.ga ? '¡Victoria! ' + lr.gf + '-' + lr.ga : lr.gf < lr.ga ? 'Derrota ' + lr.gf + '-' + lr.ga : 'Empate ' + lr.gf + '-' + lr.ga, lr.gf > lr.ga ? 'good' : lr.gf < lr.ga ? 'bad' : '');
    if (!G.userFixtures().length) advance(); else { G.save(); render(); }
  }

  function seasonEndModal(sum) {
    const a = sum.awards, uid = G.C.user.club;
    const award = (title, list, extra) => list && list[0] ? `<div class="panel award"><div>${G.face(P(list[0].id), 64, CL(P(list[0].id).club)?.colors[0])}</div><div><div class="muted" style="text-transform:uppercase;letter-spacing:.08em;font-size:12px">${title}</div><b style="font:700 22px var(--font-display)">${esc(G.fullName(P(list[0].id)))}</b><div class="muted">${esc(CL(P(list[0].id).club)?.name || '')}${extra ? ' · ' + extra(list[0]) : ''}</div></div></div>` : '';
    const obj = sum.objective, met = sum.pos <= obj.target;
    modal(`<div class="modal-h"><h2>Gala de fin de temporada ${sum.season}/${String(sum.season + 1).slice(2)}</h2></div>
      <div class="panel" style="margin-bottom:14px"><div class="row">${G.crest(CL(uid), 48)}<div><b style="font:700 22px var(--font-display)">${esc(CL(uid).name)}: ${sum.pos}º en ${esc(G.leagueOf(CL(uid).league).name)}</b><div class="${met ? 'good' : 'bad'}">Objetivo (${esc(obj.text)}): ${met ? 'cumplido' : 'no cumplido'} · Premio: ${money(sum.prize)}</div></div></div></div>
      <div class="panel" style="margin-bottom:14px"><div class="panel-h"><h3>${ic('star')} Balón Dorado</h3></div>
        ${a.balon.slice(0, 3).map((x, i) => { const p = P(x.id); return p ? `<div class="sub-row"><div class="player-cell"><b style="font:800 24px var(--font-display);width:26px">${i + 1}</b>${G.face(p, 44, CL(p.club)?.colors[0])}<div><b>${esc(G.fullName(p))}</b><div class="muted">${esc(CL(p.club)?.name || '')} · ${p.pos} · ${G.flag(p.nat)}</div></div></div>${ovrTag(p.ovr)}</div>` : ''; }).join('')}
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
        ${award('Bota Dorada', a.bota, x => x.g + ' goles')}
        ${award('Guante Dorado', a.guante, x => x.cs + ' porterías a cero')}
        ${award('Premio Promesa', a.promesa)}
        <div class="panel award"><div>${G.crest(CL(a.entrenador), 54)}</div><div><div class="muted" style="text-transform:uppercase;letter-spacing:.08em;font-size:12px">Entrenador del año</div><b style="font:700 22px var(--font-display)">${a.entrenador === uid ? esc(G.C.user.name) : 'Técnico de ' + esc(CL(a.entrenador).name)}</b></div></div>
      </div>
      <div class="panel" style="margin-top:14px"><div class="panel-h"><h3>Campeones</h3></div>${Object.entries(a.champions).map(([lid, cid]) => `<div class="sub-row"><span>${esc(G.leagueOf(lid).name)}</span><span class="team-cell">${G.crest(CL(cid), 20)}${esc(CL(cid).name)}</span></div>`).join('')}${a.cups.map(cp => `<div class="sub-row"><span>${esc(cp.name)}</span><span class="team-cell">${cp.champion ? G.crest(CL(cp.champion), 20) + esc(CL(cp.champion).name) : '-'}</span></div>`).join('')}</div>
      ${sum.retired.length ? `<p class="muted">Retirados: ${esc(sum.retired.join(', '))}</p>` : ''}
      ${sum.leaving.length ? `<p class="warn">Se marchan con el contrato terminado: ${esc(sum.leaving.join(', '))}</p>` : ''}
      <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn primary" id="sedone">${sum.sacked ? 'Hablar con el presidente' : 'Empezar nueva temporada'}</button></div>`, mm => {
      mm.querySelector('#sedone').onclick = () => { closeModal(); if (sum.sacked) sackedModal(); else render(); };
    }, true, 'wide');
  }

  function sackedModal() {
    const offers = G.jobOffers();
    modal(`<div class="modal-h"><h2>Destituido</h2></div><p>La directiva ha decidido prescindir de sus servicios. Estos clubes le ofrecen el banquillo:</p>
      <div class="club-pick">${offers.map(c => `<button class="club-tile" data-job="${c.id}">${G.crest(c, 40)}<div><b>${esc(c.name)}</b>${stars(c.rep)}<div class="muted" style="font-size:12px">${esc(G.leagueOf(c.league).name)}</div></div></button>`).join('')}</div>`, mm => {
      mm.querySelectorAll('[data-job]').forEach(b => b.onclick = () => { G.takeJob(+b.dataset.job); G.save(); closeModal(); render(); });
    }, true);
  }

  // ------------------------------------------------------------------ piezas comunes
  function formDots(cid) {
    const club = CL(cid), t = G.table(club.league).find(r => r.id === cid);
    return `<span class="form-dots">${(t ? t.form.slice(-5) : []).map(f => `<i class="f-${f}">${f}</i>`).join('')}</span>`;
  }
  function msgIcon(kind) { return { directiva: 'office', mercado: 'transfer', oferta: 'transfer', ojeo: 'scout', prensa: 'mega', medico: 'plus', entreno: 'training', decision: 'whistle', cantera: 'youth', premio: 'star', jugador: 'squad', copa: 'comps' }[kind] || 'mail'; }
  function ago(m) { const d = G.C.week - m.week + (G.C.season - m.season) * 40; return d <= 0 ? 'Esta semana' : d === 1 ? 'Hace 1 semana' : 'Hace ' + d + ' semanas'; }

  function playerRow(p, cols, cl) {
    return `<tr class="click ${cl || ''}" data-player="${p.id}">${cols.map(c => `<td class="${c.n ? 'n' : ''}">${c.f(p)}</td>`).join('')}</tr>`;
  }
  function pcell(p) { const club = CL(p.club); return `<div class="player-cell">${G.face(p, 30, club ? club.colors[0] : '#334')}<div><b>${esc(G.fullName(p))}</b>${p.traits && p.traits.length ? `<div class="dim" style="font-size:11px">${esc(p.traits.join(' · '))}</div>` : ''}</div></div>`; }
  function clubCell(cid) { const c = CL(cid); return c ? `<span class="team-cell" data-clubinfo="${c.id}">${G.crest(c, 18)}${esc(c.name)}</span>` : '<span class="muted">Libre</span>'; }

  // ------------------------------------------------------------------ VISTAS
  const VIEWS = {};

  // ---- Inicio (central del modo carrera)
  VIEWS.inicio = {
    html() {
      const c = G.C, club = me(), lid = club.league;
      const t = G.table(lid), row = t.find(r => r.id === club.id), pos = t.indexOf(row) + 1;
      const nx = G.nextUserFixture();
      const opp = nx ? CL(nx.h === club.id ? nx.a : nx.h) : null;
      const isNow = nx && nx.week === c.week;
      const unread = c.inbox.filter(m => !m.read).length;
      const pending = c.inbox.filter(m => (m.kind === 'decision' || m.kind === 'oferta') && !m.done).length;
      const n = c.news[0];
      const top = t.slice(0, 4); if (pos > 4) top.push(row);
      const best = club.players.map(P).sort((a, b) => b.ovr - a.ovr)[0];
      const T = club.tactics;
      const match = nx ? `<div class="nm-card">
          <div class="nm-comp">${esc(G.compName(nx.comp))} · ${esc(G.fmtDate(G.weekDate(nx.week)))} · 21:00</div>
          <div class="nm-vs"><div>${G.crest(CL(nx.h), 64)}<b>${esc(CL(nx.h).name)}</b></div><span>VS</span><div>${G.crest(CL(nx.a), 64)}<b>${esc(CL(nx.a).name)}</b></div></div>
          <div class="nm-foot"><span class="muted">${esc(CL(nx.h).stadium)}</span><span class="btn-continue nm-play">${ic(isNow ? 'play' : 'ff', 20)} ${isNow ? 'Jugar partido' : 'Avanzar hasta el partido'}</span></div>
        </div>` : `<div class="nm-card"><div class="nm-vs"><b>Temporada terminada</b></div><div class="nm-foot"><span class="btn-continue nm-play">${ic('ff', 20)} Continuar</span></div></div>`;
      return `<div class="welcome"><div><small>Bienvenido, ${esc(c.user.name)}</small><h1>${esc(club.name)}</h1></div>
          <div class="welcome-r"><span class="chip">${pos}º en ${esc(G.leagueOf(lid).name)}</span><span class="chip">${row.pts} pts</span><span class="chip">Objetivo: ${esc(c.board.objective.text)}</span><span class="chip ${c.board.conf >= 50 ? '' : 'warn'}">Directiva ${Math.round(c.board.conf)}%</span></div></div>
        <div class="central">
          <button class="tile tile-hero" data-act="play"><div class="tile-img" data-photo="partido"></div><div class="tile-shade"></div><div class="tile-txt"><b>Próximo partido</b></div>${match}</button>
          <button class="tile tile-side" data-go="oficina"><div class="tile-img" data-photo="estadio"></div><div class="tile-shade strong"></div>${unread ? `<span class="tile-badge">${unread}</span>` : ''}<div class="tile-txt"><b>Mensajes</b><small>${pending ? pending + ' decisión(es) pendiente(s)' : 'Todo al día'}</small>
            <div class="mini-msgs">${c.inbox.slice(0, 3).map(m => `<span class="${m.read ? '' : 'unread'}">${esc(m.from)}: ${esc(m.subject)}</span>`).join('')}</div></div></button>
          <button class="tile tile-side" data-go="competiciones" data-pre="compTab:liga"><div class="tile-img" data-photo="estadioDia"></div><div class="tile-shade strong"></div><div class="tile-txt"><b>Clasificación</b>
            <div class="mini-table">${top.map(r => `<span class="${r.id === club.id ? 'me' : ''}"><i>${t.indexOf(r) + 1}</i>${G.crest(CL(r.id), 16)}<em>${esc(CL(r.id).name)}</em><b>${r.pts}</b></span>`).join('')}</div></div></button>
        </div>
        <div class="hub hub-5">
          ${tile({ go: 'plantilla', photo: 'plantilla', title: 'Jugadores', sub: club.players.length + ' jugadores · Media ' + G.squadOvr(club) })}
          ${tile({ go: 'tacticas', photo: 'tacticas', title: 'Tácticas', sub: club.formation + ' · ' + ['Muy defensiva', 'Defensiva', 'Equilibrada', 'Ofensiva', 'Muy ofensiva'][T.ment + 2] })}
          ${tile({ go: 'entrenamiento', photo: 'entreno', title: 'Entrenamiento', sub: G.TRAINING_FOCUS[c.training.focus].name + ' · ' + ['', 'Suave', 'Normal', 'Intensa'][c.training.intensity] })}
          ${tile({ go: 'traspasos', photo: 'traspasos', title: 'Fichajes', sub: (G.isWindowOpen() ? 'Mercado abierto' : 'Mercado cerrado') + ' · ' + money(club.budget) })}
          ${tile({ go: 'competiciones', pre: 'compTab:premios', photo: 'celebracion', title: 'Noticias', sub: n ? n.title : 'Todo listo para empezar' })}
        </div>`;
    },
    bind(el) {
      el.querySelectorAll('.mini-table [data-clubinfo]').forEach(x => x.removeAttribute('data-clubinfo'));
    }
  };

  // ---- Pantallas de fichas de cada pestaña
  VIEWS['hub-plantilla'] = {
    html() {
      const c = G.C, club = me();
      const best = club.players.map(P).sort((a, b) => b.ovr - a.ovr)[0];
      const injured = club.players.map(P).filter(p => p.inj).length;
      return `<div class="hub-h"><h1>Plantilla</h1></div><div class="hub hub-3">
        ${tile({ go: 'plantilla', photo: 'plantilla', title: 'Jugadores', sub: club.players.length + ' jugadores · Media ' + G.squadOvr(club) + (injured ? ' · ' + injured + ' lesionado(s)' : ''), cls: 'big' })}
        ${tile({ go: 'tacticas', photo: 'tacticas', title: 'Tácticas y alineación', sub: club.formation + ' · Química ' + Math.round(club.chem) + '%' })}
        ${tile({ go: 'entrenamiento', photo: 'entreno', title: 'Entrenamiento', sub: G.TRAINING_FOCUS[c.training.focus].name })}
        ${tile({ player: best.id, photo: 'jugador', title: 'Estrella del equipo', sub: esc(G.fullName(best)) + ' · ' + best.pos + ' · ' + best.ovr })}
        ${tile({ go: 'cantera', photo: 'cantera', title: 'Cantera', sub: c.youth.length + ' juveniles' })}
      </div>`;
    }
  };
  VIEWS['hub-traspasos'] = {
    html() {
      const c = G.C, club = me();
      const offers = c.inbox.filter(m => m.kind === 'oferta' && !m.done).length;
      return `<div class="hub-h"><h1>Traspasos</h1><span class="chip ${G.isWindowOpen() ? 'on' : ''}">${G.isWindowOpen() ? 'Mercado abierto' : 'Mercado cerrado'}</span><span class="chip">Presupuesto ${money(club.budget)}</span></div><div class="hub hub-3">
        ${tile({ go: 'traspasos', pre: 'mkTab:buscar', photo: 'traspasos', title: 'Buscar jugadores', sub: 'Filtra por posición, edad, media y precio', cls: 'big' })}
        ${tile({ go: 'ojeo', photo: 'ojeo', title: 'Ojeo', sub: c.scouting.missions.length + '/3 ojeadores trabajando' })}
        ${tile({ go: 'traspasos', pre: 'mkTab:ofertas', photo: 'estadio', title: 'Ofertas recibidas', sub: offers ? offers + ' sin responder' : 'Sin ofertas nuevas', badge: offers || '' })}
        ${tile({ go: 'traspasos', pre: 'mkTab:seguimiento', photo: 'jugador', title: 'Seguimiento', sub: (c.shortlist || []).length + ' jugadores' })}
        ${tile({ go: 'traspasos', pre: 'mkTab:libres', photo: 'cantera', title: 'Agentes libres', sub: c.world.freeAgents.length + ' sin equipo' })}
        ${tile({ go: 'traspasos', pre: 'mkTab:historial', icon: 'transfer', title: 'Últimos traspasos', sub: c.transfers[0] ? esc(c.transfers[0].name) + ' · ' + (c.transfers[0].fee ? money(c.transfers[0].fee) : 'libre') : 'Aún ninguno' })}
      </div>`;
    }
  };
  VIEWS['hub-competiciones'] = {
    html() {
      const club = me(), t = G.table(club.league), pos = t.findIndex(r => r.id === club.id) + 1;
      const nx = G.nextUserFixture(), top = G.topScorers(club.league, 1)[0];
      return `<div class="hub-h"><h1>Competiciones</h1></div><div class="hub hub-3">
        ${tile({ go: 'competiciones', pre: 'compTab:liga', photo: 'estadioDia', title: 'Clasificación', sub: esc(G.leagueOf(club.league).name) + ' · ' + pos + 'º', cls: 'big' })}
        ${tile({ go: 'calendario', photo: 'partido', title: 'Calendario', sub: nx ? 'Próximo: ' + esc(CL(nx.h === club.id ? nx.a : nx.h).name) : 'Sin partidos' })}
        ${tile({ go: 'competiciones', pre: 'compTab:copas', photo: 'trofeo', title: 'Copas', sub: 'Continental y Libertad' })}
        ${tile({ go: 'competiciones', pre: 'compTab:stats', photo: 'celebracion', title: 'Estadísticas', sub: top && top.st.g ? 'Pichichi: ' + esc(G.shortName(top)) + ' (' + top.st.g + ')' : 'Goleadores, asistentes y notas' })}
        ${tile({ go: 'competiciones', pre: 'compTab:premios', photo: 'trofeo', title: 'Balón Dorado', sub: 'Carrera por los premios' })}
      </div>`;
    }
  };
  VIEWS['hub-club'] = {
    html() {
      const c = G.C, club = me();
      const unread = c.inbox.filter(m => !m.read).length;
      return `<div class="hub-h"><h1>Club</h1></div><div class="hub hub-3">
        ${tile({ go: 'oficina', photo: 'estadio', title: 'Oficina y mensajes', sub: unread ? unread + ' sin leer' : 'Directiva, finanzas y contratos', badge: unread || '', cls: 'big' })}
        ${tile({ go: 'club', photo: 'celebracion', title: 'Mi club', sub: esc(club.stadium) + ' · Palmarés' })}
        ${tile({ go: 'oficina', photo: 'estadioDia', title: 'Finanzas', sub: 'Balance ' + money(c.fin.balance) })}
        ${tile({ go: 'basedatos', icon: 'db', title: 'Base de datos', sub: 'Ranking, editor e importación' })}
        ${tile({ go: 'config', icon: 'settings', title: 'Configuración', sub: 'Partida y opciones del 3D' })}
      </div>`;
    }
  };

  function sparkSVG(vals) {
    if (vals.length < 2) return '<svg class="spark" viewBox="0 0 200 60"></svg>';
    const min = Math.min(...vals), max = Math.max(...vals), rng = max - min || 1;
    const pts = vals.map((v, i) => [i / (vals.length - 1) * 196 + 2, 54 - (v - min) / rng * 48]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const last = pts[pts.length - 1];
    return `<svg class="spark" viewBox="0 0 200 60" preserveAspectRatio="none" role="img" aria-label="Evolución del balance"><path d="M0 15H200M0 30H200M0 45H200" stroke="var(--line)" stroke-width=".6"/><path d="${d} L198 60 L2 60 Z" fill="rgba(31,111,235,.22)"/><path d="${d}" fill="none" stroke="var(--accent-hi)" stroke-width="1.8"/><circle cx="${last[0]}" cy="${last[1]}" r="3" fill="#fff"/></svg>`;
  }

  // ---- Plantilla
  VIEWS.plantilla = {
    html() {
      const club = me();
      let ps = club.players.map(P);
      if (S.squadFilter !== 'ALL') ps = ps.filter(p => grp(p.pos) === S.squadFilter);
      const sorters = { pos: (a, b) => POS_ORDER[a.pos] - POS_ORDER[b.pos] || b.ovr - a.ovr, ovr: (a, b) => b.ovr - a.ovr, pot: (a, b) => b.pot - a.pot, age: (a, b) => a.age - b.age, val: (a, b) => b.value - a.value, rt: (a, b) => G.avgRating(b) - G.avgRating(a), g: (a, b) => b.st.g - a.st.g, fit: (a, b) => a.fit - b.fit, mor: (a, b) => a.morale - b.morale };
      ps.sort(sorters[S.squadSort] || sorters.pos);
      const th = (k, l, n) => `<th class="${n ? 'n' : ''}"><button class="tab" style="padding:0;border:0;font-size:12px;${S.squadSort === k ? 'color:var(--fg)' : ''}" data-sort="${k}">${l}</button></th>`;
      const totalWage = club.players.reduce((s, id) => s + P(id).wage, 0);
      const mode = S.squadMode || 'cartas';
      const head = `<div class="page-h"><div><h1>Jugadores</h1><p>${club.players.length} jugadores · Media ${G.squadOvr(club)} · Masa salarial ${G.fmtWage(totalWage)} · Valor ${money(club.players.reduce((s, id) => s + P(id).value, 0))}</p></div>
        <div class="row"><div class="seg">${[['ALL', 'Todos'], ['POR', 'Porteros'], ['DEF', 'Defensas'], ['MED', 'Medios'], ['DEL', 'Delanteros']].map(([k, l]) => `<button data-f="${k}" class="${S.squadFilter === k ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div class="seg"><button data-mode="cartas" class="${mode === 'cartas' ? 'on' : ''}">Cartas</button><button data-mode="lista" class="${mode === 'lista' ? 'on' : ''}">Lista</button></div></div></div>`;
      if (mode === 'cartas') return head + `<div class="fcards">${ps.map(p => fcard(p, club)).join('')}</div>`;
      return head + `<div class="panel tbl-wrap"><table><thead><tr><th>#</th><th>Jugador</th>${th('pos', 'POS')}${th('age', 'Edad', 1)}${th('ovr', 'MED', 1)}${th('pot', 'POT', 1)}${th('rt', 'Nota', 1)}<th class="n">PJ</th>${th('g', 'G', 1)}<th class="n">A</th>${th('mor', 'Moral')}${th('fit', 'Físico')}${th('val', 'Valor', 1)}<th class="n">Sueldo</th><th class="n">Contrato</th><th>Estado</th></tr></thead><tbody>
        ${ps.map(p => playerRow(p, [
          { f: p => `<b>${p.num}</b>` }, { f: pcell }, { f: p => posTag(p.pos) }, { n: 1, f: p => p.age }, { n: 1, f: p => ovrTag(p.ovr) + (p.ovr0 && p.ovr > p.ovr0 ? ` <span class="good" style="font-size:11px">+${p.ovr - p.ovr0}</span>` : '') }, { n: 1, f: p => G.potText(p) },
          { n: 1, f: p => p.st.ap ? `<span class="rt ${G.ratingClass(G.avgRating(p))}">${G.avgRating(p).toFixed(1)}</span>` : '-' }, { n: 1, f: p => p.st.ap }, { n: 1, f: p => p.st.g }, { n: 1, f: p => p.st.a },
          { f: p => bar(p.morale) }, { f: p => bar(p.fit) }, { n: 1, f: p => money(p.value) }, { n: 1, f: p => G.fmtWage(p.wage) }, { n: 1, f: p => `<span class="${p.contract <= 1 ? 'warn' : ''}">${G.C.season + p.contract}</span>` },
          { f: p => p.inj ? `<span class="status-inj">Lesión (${p.inj} sem.)</span>` : p.susp ? '<span class="bad">Sancionado</span>' : p.listed ? '<span class="chip">Transferible</span>' : (me().captain === p.id ? '<span class="chip on">Capitán</span>' : '') }
        ])).join('')}</tbody></table></div>`;
    },
    bind(el) {
      el.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { S.squadFilter = b.dataset.f; render(); });
      el.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { S.squadMode = b.dataset.mode; render(); });
      el.querySelectorAll('[data-sort]').forEach(b => b.onclick = () => { S.squadSort = b.dataset.sort; render(); });
    }
  };

  // Carta de jugador (como las del modo Ultimate)
  function fcard(p, club) {
    const keys = p.pos === 'POR' ? ['gk', 'phy', 'pas', 'pac', 'def', 'dri'] : ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
    const state = p.inj ? `<span class="fc-flag bad">Lesión ${p.inj}s</span>` : p.susp ? '<span class="fc-flag bad">Sanción</span>' : p.listed ? '<span class="fc-flag">En venta</span>' : club.captain === p.id ? '<span class="fc-flag">C</span>' : '';
    return `<button class="fcard ${G.ovrClass(p.ovr)}" data-player="${p.id}">
      <span class="fc-top"><b>${p.ovr}</b><i>${p.pos}</i>${G.flag(p.nat)}</span>${state}
      <span class="fc-face">${G.face(p, 92, club.colors[0])}</span>
      <span class="fc-name">${esc(p.ln)}</span>
      <span class="fc-att">${keys.map(k => `<span><b>${p.att[k]}</b>${G.ATTR_SHORT[k]}</span>`).join('')}</span>
      <span class="fc-bars"><i style="width:${p.fit}%" title="Físico"></i><i style="width:${p.morale}%" title="Moral"></i></span>
    </button>`;
  }

  // ---- Ficha de jugador
  function playerModal(pid) {
    const p = P(pid); if (!p) return;
    const c = G.C, club = CL(p.club), mine = p.club === c.user.club, youth = c.youth.includes(p.id);
    let tab = 'attr';
    const draw = () => {
      const card = `<div class="pcard ${G.ovrClass(p.ovr)}"><div class="top"><div><div class="o">${p.ovr}</div><div class="p">${p.pos}</div><div style="margin-top:6px">${G.flag(p.nat)}</div>${club ? `<div style="margin-top:6px">${G.crest(club, 26)}</div>` : ''}</div></div>${G.face(p, 112, club ? club.colors[0] : '#334')}<div class="nm">${esc(p.ln)}</div>
        <div class="at">${p.pos === 'POR' ? ['gk', 'phy', 'pas', 'pac', 'def', 'dri'].map(k => `<span><b>${p.att[k]}</b>${G.ATTR_SHORT[k]}</span>`).join('') : ['pac', 'dri', 'sho', 'def', 'pas', 'phy'].map(k => `<span><b>${p.att[k]}</b>${G.ATTR_SHORT[k]}</span>`).join('')}</div></div>`;
      let body = '';
      if (tab === 'attr') {
        body = `<div class="attr-list">${G.ATTRS.filter(k => p.pos === 'POR' || k !== 'gk').map(k => `<div class="attr"><span>${G.ATTR_NAME[k]}</span><b class="${p.att[k] >= 80 ? 'good' : p.att[k] < 50 ? 'dim' : ''}">${p.att[k]}</b>${bar(p.att[k], p.att[k] >= 80 ? 'var(--good)' : p.att[k] >= 65 ? 'var(--accent-hi)' : 'var(--warn)')}</div>`).join('')}</div>
          <p class="muted" style="margin-top:14px">Posiciones: ${posTag(p.pos)} ${(p.alt || []).map(posTag).join(' ')} · Pie ${p.foot === 'D' ? 'derecho' : 'izquierdo'} · ${p.height} cm${p.traits.length ? ' · Rasgos: ' + esc(p.traits.join(', ')) : ''}</p>`;
      } else if (tab === 'stats') {
        const hist = (p.hist || []).slice().reverse();
        body = `<div class="lines" style="justify-content:flex-start;gap:22px"><span>Partidos <b>${p.st.ap}</b></span><span>Goles <b>${p.st.g}</b></span><span>Asist. <b>${p.st.a}</b></span><span>Nota <b>${G.avgRating(p).toFixed(2)}</b></span><span>MVP <b>${p.st.mvp}</b></span>${p.pos === 'POR' ? `<span>Imbatido <b>${p.st.cs}</b></span>` : ''}</div>
          <h4 style="margin:14px 0 6px">Carrera</h4><p class="muted" style="margin:0">${p.career.ap} partidos · ${p.career.g} goles · ${p.career.a} asistencias</p>
          ${hist.length ? `<div class="tbl-wrap"><table style="margin-top:8px"><thead><tr><th>Temporada</th><th>Club</th><th class="n">PJ</th><th class="n">G</th><th class="n">A</th><th class="n">Nota</th></tr></thead><tbody>${hist.map(h => `<tr><td>${h.s}/${String(h.s + 1).slice(2)}</td><td>${h.c ? clubCell(h.c) : '-'}</td><td class="n">${h.ap}</td><td class="n">${h.g}</td><td class="n">${h.a}</td><td class="n">${h.rt.toFixed(2)}</td></tr>`).join('')}</tbody></table></div>` : ''}
          ${p.trophies.length ? `<h4 style="margin:14px 0 6px">Títulos</h4><p class="gold">${esc(p.trophies.join(' · '))}</p>` : ''}`;
      } else if (tab === 'acc') {
        if (mine) {
          body = `<div class="field"><label for="pfocus">Entrenamiento individual</label><select id="pfocus"><option value="">Según el plan del equipo</option>${G.ATTRS.filter(k => p.pos === 'POR' || k !== 'gk').map(k => `<option value="${k}" ${p.focus === k ? 'selected' : ''}>${G.ATTR_NAME[k]}</option>`).join('')}</select></div>
            <div class="field"><span>Hablar con el jugador</span><div class="row"><button class="btn small" data-talk="elogiar">Elogiarle</button><button class="btn small" data-talk="exigir">Exigirle más</button><button class="btn small" data-talk="titular">Prometer titularidad</button></div></div>
            <div class="field"><span>Contrato: ${G.fmtWage(p.wage)} hasta ${c.season + p.contract}</span><div class="row"><input type="number" id="rwage" value="${Math.ceil(p.wage * 1.15)}" min="1" style="width:110px" aria-label="Sueldo semanal en miles"><span class="muted">mil €/sem</span><select id="ryears" aria-label="Años">${[1, 2, 3, 4, 5].map(y => `<option ${y === 3 ? 'selected' : ''}>${y}</option>`).join('')}</select><span class="muted">años</span><button class="btn small primary" id="renew">Renovar</button></div></div>
            <div class="row"><button class="btn small" id="list">${p.listed ? 'Quitar de transferibles' : 'Declarar transferible'}</button><button class="btn small" id="capt">Nombrar capitán</button><button class="btn small danger" id="release">Rescindir contrato</button></div>
            <p class="muted" id="pmsg" style="min-height:20px"></p>`;
        } else if (youth) {
          body = `<p>Juvenil de la cantera. ${G.potText(p) ? 'Potencial: <b>' + G.potText(p) + '</b>' : ''}</p><div class="row"><button class="btn primary" id="promote">Subir al primer equipo</button></div>`;
        } else {
          const sl = (c.shortlist || []).includes(p.id);
          body = `<p>${club ? `Juega en ${clubCell(club.id)}.` : 'Agente libre.'} Valor de mercado: <b>${money(p.value)}</b>${club ? ` · El club pide unos <b>${money(G.askingPrice(p))}</b>` : ''}</p>
            <p class="muted">Sueldo actual: ${G.fmtWage(p.wage)} · Contrato hasta ${c.season + p.contract} · Potencial ${G.potText(p)}</p>
            <div class="row"><button class="btn primary" id="buy">${club ? 'Hacer oferta' : 'Ofrecer contrato'}</button><button class="btn" id="short">${sl ? 'Quitar de seguimiento' : 'Añadir a seguimiento'}</button></div>`;
        }
      }
      return `<div class="modal-h"><div><h2>${esc(G.fullName(p))}</h2><div class="muted">${esc(G.POS_NAME[p.pos])} · ${p.age} años · ${esc(G.NATIONS[p.nat]?.name || p.nat)} · ${club ? esc(club.name) : youth ? 'Cantera' : 'Sin club'}</div></div>${closeBtn}</div>
        <div class="row" style="align-items:flex-start;gap:20px">${card}<div style="flex:1;min-width:260px">
          <div class="lines" style="justify-content:flex-start;gap:18px;margin:0 0 10px"><span>Valor <b>${money(p.value)}</b></span><span>Potencial <b>${G.potText(p)}</b></span><span>Moral <b>${Math.round(p.morale)}</b></span><span>Físico <b>${Math.round(p.fit)}%</b></span>${p.inj ? `<span class="bad">Lesionado ${p.inj} sem.</span>` : ''}</div>
          <div class="tabs">${[['attr', 'Atributos'], ['stats', 'Estadísticas'], ['acc', mine ? 'Gestión' : 'Fichar']].map(([k, l]) => `<button class="tab ${k === tab ? 'active' : ''}" data-ptab="${k}">${l}</button>`).join('')}<button class="tab" id="pedit">${ic('edit', 14)} Editar</button></div>
          ${body}</div></div>`;
    };
    const bind = mm => {
      mm.querySelectorAll('[data-ptab]').forEach(b => b.onclick = () => { tab = b.dataset.ptab; mm.innerHTML = draw(); bind(mm); mm.querySelector('[data-close]').onclick = closeModal; });
      mm.querySelector('[data-close]').onclick = closeModal;
      mm.querySelector('#pedit').onclick = () => editPlayer(p.id);
      mm.querySelectorAll('[data-clubinfo]').forEach(b => b.onclick = () => clubModal(+b.dataset.clubinfo));
      const msg = t => { const e = mm.querySelector('#pmsg'); if (e) e.textContent = t; };
      const f = mm.querySelector('#pfocus'); if (f) f.onchange = () => { p.focus = f.value || null; msg('Plan individual actualizado.'); G.save(); };
      mm.querySelectorAll('[data-talk]').forEach(b => b.onclick = () => {
        const k = b.dataset.talk;
        if (p.talkedWeek === G.C.week) return msg('Ya has hablado con él esta semana.');
        p.talkedWeek = G.C.week;
        if (k === 'elogiar') { const d = G.avgRating(p) >= 6.8 || !p.st.ap ? 8 : -2; p.morale = G.clamp(p.morale + d, 0, 100); msg(d > 0 ? 'Se siente valorado.' : 'No entiende el elogio tras sus últimas actuaciones.'); }
        if (k === 'exigir') { const d = p.traits.includes('Profesional') ? 6 : p.traits.includes('Conflictivo') ? -12 : (Math.random() < 0.5 ? 4 : -6); p.morale = G.clamp(p.morale + d, 0, 100); msg(d > 0 ? 'Responde bien a la exigencia.' : 'No le ha sentado bien.'); }
        if (k === 'titular') { p.morale = G.clamp(p.morale + 15, 0, 100); p.promised = G.C.week + 4; p.apAtPromise = p.st.ap; msg('Promesa hecha: debe jugar en las próximas 4 semanas.'); }
        G.save();
      });
      const rn = mm.querySelector('#renew'); if (rn) rn.onclick = () => { const r = G.renewContract(p.id, +mm.querySelector('#rwage').value, +mm.querySelector('#ryears').value); msg(r.msg); if (r.counter) mm.querySelector('#rwage').value = r.counter; if (r.ok) G.save(); };
      const ls = mm.querySelector('#list'); if (ls) ls.onclick = () => { p.listed = !p.listed; G.save(); mm.innerHTML = draw(); bind(mm); };
      const cp = mm.querySelector('#capt'); if (cp) cp.onclick = () => { me().captain = p.id; p.morale = G.clamp(p.morale + 10, 0, 100); msg(G.shortName(p) + ' es el nuevo capitán.'); G.save(); };
      const rl = mm.querySelector('#release'); if (rl) rl.onclick = () => {
        if (rl.dataset.confirm) { const cost = G.releasePlayer(p.id); G.save(); closeModal(); toast('Contrato rescindido. Indemnización: ' + money(cost) + '.'); render(); }
        else { rl.dataset.confirm = 1; rl.textContent = 'Confirmar: pagar ' + money(p.wage * 52 * p.contract / 1000 * 0.5); }
      };
      const pr = mm.querySelector('#promote'); if (pr) pr.onclick = () => { promoteYouth(p.id); closeModal(); render(); };
      const by = mm.querySelector('#buy'); if (by) by.onclick = () => offerModal(p.id);
      const sh = mm.querySelector('#short'); if (sh) sh.onclick = () => { const l = G.C.shortlist; const i = l.indexOf(p.id); if (i >= 0) l.splice(i, 1); else l.push(p.id); G.save(); mm.innerHTML = draw(); bind(mm); };
    };
    modal(draw(), bind, false, 'wide');
  }
  G.ui.player = playerModal;

  function promoteYouth(pid) {
    const c = G.C, p = P(pid), club = me();
    c.youth = c.youth.filter(x => x !== pid);
    p.youth = false; p.club = club.id; p.wage = Math.max(1, Math.round(G.calcWage(p) * 0.6)); p.contract = 3;
    club.players.push(pid); G.assignNumbers(c.world, club);
    G.news(G.fullName(p) + ' sube al primer equipo', 'El canterano de ' + p.age + ' años firma su primer contrato profesional.', 'club');
    G.save(); toast(G.shortName(p) + ' sube al primer equipo.', 'good');
  }

  // ---- Fichajes: negociación en dos pasos
  function offerModal(pid) {
    const p = P(pid), c = G.C, buyer = me();
    const from = p.club ? CL(p.club) : null;
    let step = from ? 1 : 2, fee = 0;
    const draw = () => {
      const wageRoom = buyer.wageBudget - buyer.players.reduce((s, id) => s + P(id).wage, 0);
      if (step === 1) return `<div class="modal-h"><h2>Oferta a ${esc(from.name)}</h2>${closeBtn}</div>
        <div class="row">${G.face(p, 54, from.colors[0])}<div><b style="font:700 20px var(--font-display)">${esc(G.fullName(p))}</b><div class="muted">${p.pos} · ${p.age} años · Media ${p.ovr} · Valor ${money(p.value)}</div></div></div>
        <p>Presupuesto disponible: <b>${money(buyer.budget)}</b>${G.isWindowOpen() ? '' : ' · <span class="bad">Mercado cerrado</span>'}</p>
        <div class="field"><label for="fee">Cantidad del traspaso (millones €)</label><input type="number" id="fee" step="0.5" min="0" value="${Math.round(G.askingPrice(p) * 0.9 * 2) / 2}"></div>
        <p class="muted" id="omsg" style="min-height:20px"></p>
        <div class="row"><span class="spacer"></span><button class="btn primary" id="send">Enviar oferta</button></div>`;
      return `<div class="modal-h"><h2>Contrato de ${esc(G.fullName(p))}</h2>${closeBtn}</div>
        <p class="muted">Sueldo actual: ${G.fmtWage(p.wage)} · Margen salarial: <b>${G.fmtWage(Math.max(0, wageRoom))}</b>${fee ? ' · Traspaso acordado: ' + money(fee) : ''}</p>
        <div class="row"><div class="field"><label for="wage">Sueldo (mil €/semana)</label><input type="number" id="wage" min="1" value="${Math.ceil(p.wage * 1.15)}"></div>
        <div class="field"><label for="years">Años</label><select id="years">${[1, 2, 3, 4, 5].map(y => `<option ${y === 3 ? 'selected' : ''}>${y}</option>`).join('')}</select></div>
        <div class="field"><label for="role">Papel en el equipo</label><select id="role"><option value="estrella">Estrella</option><option value="titular" selected>Titular</option><option value="rotacion">Rotación</option></select></div></div>
        <p class="muted" id="omsg" style="min-height:20px"></p>
        <div class="row"><span class="spacer"></span><button class="btn primary" id="sign">Proponer contrato</button></div>`;
    };
    const bind = mm => {
      mm.querySelector('[data-close]').onclick = closeModal;
      const msg = t => { mm.querySelector('#omsg').textContent = t; };
      const send = mm.querySelector('#send');
      if (send) send.onclick = () => {
        const v = +mm.querySelector('#fee').value;
        const r = G.makeOffer(p.id, v);
        msg(r.msg);
        if (r.counter) { mm.querySelector('#fee').value = r.counter; send.textContent = 'Aceptar ' + money(r.counter); }
        if (r.ok) { fee = v; setTimeout(() => { step = 2; mm.innerHTML = draw(); bind(mm); }, 700); }
      };
      const sign = mm.querySelector('#sign');
      if (sign) sign.onclick = () => {
        const w = +mm.querySelector('#wage').value, y = +mm.querySelector('#years').value, role = mm.querySelector('#role').value;
        const r = G.playerAccepts(p.id, w, y, role);
        msg(r.msg);
        if (r.counter) mm.querySelector('#wage').value = r.counter;
        if (r.ok) {
          G.completeTransfer(p.id, fee, w, y, buyer.id);
          G.C.shortlist = (G.C.shortlist || []).filter(x => x !== p.id);
          G.save(); closeModal(); toast('¡Fichaje cerrado! ' + G.fullName(p) + ' es nuevo jugador.', 'good'); render();
        }
      };
    };
    modal(draw(), bind, false, 'small');
  }

  // ---- Tácticas
  const MENT = [[-2, 'Muy def.'], [-1, 'Defensiva'], [0, 'Equilibrada'], [1, 'Ofensiva'], [2, 'Muy of.']];
  VIEWS.tacticas = {
    html() {
      const club = me(); G.validLineup(club);
      const F = G.FORMATIONS[club.formation], T = club.tactics;
      const slotTop = bx => 94 - (bx - 0.04) / 0.66 * 78;
      const slots = F.map((s, i) => {
        const p = P(club.lineup[i]); if (!p) return '';
        const v = G.ovrAt(p, s[0]);
        return `<button class="slot ${S.tacSel === 'x' + i ? 'sel' : ''}" data-slot="${i}" style="left:${(1 - s[2]) * 84 + 8}%;top:${slotTop(s[1])}%">${G.face(p, 46, club.colors[0])}<span class="meta">${posTag(s[0])}<span class="ovr ${G.ovrClass(v)}" style="height:20px;font-size:13px">${v}</span>${p.fit < 70 ? `<span class="warnf">${Math.round(p.fit)}%</span>` : ''}</span><span class="nm">${esc(p.ln)}</span></button>`;
      }).join('');
      const bench = club.bench.map(P), rest = club.players.filter(id => !club.lineup.includes(id) && !club.bench.includes(id)).map(P).sort((a, b) => POS_ORDER[a.pos] - POS_ORDER[b.pos] || b.ovr - a.ovr);
      const lr = G.lineRatings(club);
      const listRow = (p, key) => `<div class="sub-row" style="cursor:pointer;${S.tacSel === key + p.id ? 'background:rgba(232,199,112,.15)' : ''}" data-pick="${key + p.id}"><div class="player-cell">${G.face(p, 28, club.colors[0])}<span>${esc(G.shortName(p))} ${posTag(p.pos)}</span></div><span>${p.inj ? '<span class="status-inj">Les.</span> ' : p.susp ? '<span class="bad">Sanc.</span> ' : ''}${bar(p.fit)} ${ovrTag(p.ovr)}</span></div>`;
      const seg = (key, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-t="${key}" data-v="${v}" class="${T[key] === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
      return `<div class="page-h"><div><h1>Tácticas</h1><p>Toca un jugador del campo y después otro (del campo, del banquillo o de la reserva) para intercambiarlos.</p></div>
        <div class="row"><div class="lines"><span>ATA <b>${lr.ata}</b></span><span>MED <b>${lr.med}</b></span><span>DEF <b>${lr.def}</b></span></div><button class="btn" id="auto">Alineación automática</button></div></div>
        <div class="grid tactic-grid">
          <div class="panel"><div class="pitch">
            <div class="ln" style="left:0;right:0;top:50%;height:0"></div><div class="ln" style="left:50%;top:50%;width:22%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%"></div>
            <div class="ln" style="left:22%;right:22%;top:0;height:15%;border-top:0"></div><div class="ln" style="left:22%;right:22%;bottom:0;height:15%;border-bottom:0"></div>
            ${slots}</div></div>
          <div class="grid" style="gap:14px">
            <div class="panel"><div class="panel-h"><h3>Instrucciones</h3><span class="chem">Química ${bar(club.chem, 'var(--accent-hi)')} <b>${Math.round(club.chem)}%</b></span></div>
              <div class="field"><label for="form">Formación</label><select id="form">${Object.keys(G.FORMATIONS).map(f => `<option ${f === club.formation ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
              <div class="field"><span>Mentalidad</span>${seg('ment', MENT)}</div>
              <div class="field"><span>Presión</span>${seg('press', [[0, 'Baja'], [1, 'Media'], [2, 'Alta']])}</div>
              <div class="field"><span>Ritmo de juego</span>${seg('tempo', [[0, 'Pausado'], [1, 'Normal'], [2, 'Directo']])}</div>
              <div class="field"><span>Amplitud</span>${seg('width', [[0, 'Estrecho'], [1, 'Normal'], [2, 'Amplio']])}</div>
              <p class="muted" style="margin:0">Cambiar de formación baja la química durante unas semanas. El entrenamiento táctico la recupera.</p></div>
            <div class="panel"><div class="panel-h"><h3>Banquillo (${bench.length})</h3></div>${bench.map(p => listRow(p, 'b')).join('')}</div>
            <div class="panel"><div class="panel-h"><h3>Reservas</h3></div>${rest.map(p => listRow(p, 'r')).join('')}</div>
          </div>
        </div>`;
    },
    bind(el) {
      const club = me();
      el.querySelector('#auto').onclick = () => { club.lineup = G.autoLineup(club); club.bench = G.autoBench(club, club.lineup); S.tacSel = null; G.save(); render(); };
      el.querySelector('#form').onchange = e => {
        club.formation = e.target.value; G.C.formationChanged = true;
        club.lineup = G.autoLineup(club); club.bench = G.autoBench(club, club.lineup); G.save(); render();
      };
      el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { club.tactics[b.dataset.t] = +b.dataset.v; G.save(); render(); });
      const pickEl = key => {
        if (!S.tacSel) { S.tacSel = key; return render(); }
        if (S.tacSel === key) { S.tacSel = null; return render(); }
        const a = S.tacSel, b = key; S.tacSel = null;
        const loc = k => { if (k[0] === 'x') return { arr: club.lineup, i: +k.slice(1) }; const id = +k.slice(1); if (k[0] === 'b') return { arr: club.bench, i: club.bench.indexOf(id) }; return { arr: null, id }; };
        const A = loc(a), B = loc(b);
        const idOf = L => L.arr ? L.arr[L.i] : L.id;
        const ia = idOf(A), ib = idOf(B);
        if (A.arr) A.arr[A.i] = ib; if (B.arr) B.arr[B.i] = ia;
        if (!A.arr && !B.arr) return render();
        G.save(); render();
      };
      el.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => pickEl('x' + b.dataset.slot));
      el.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => pickEl(b.dataset.pick));
    }
  };

  // ---- Entrenamiento
  VIEWS.entrenamiento = {
    html() {
      const c = G.C, club = me(), T = c.training;
      const ps = club.players.map(P).sort((a, b) => POS_ORDER[a.pos] - POS_ORDER[b.pos] || b.ovr - a.ovr);
      const avgFit = Math.round(ps.reduce((s, p) => s + p.fit, 0) / ps.length);
      const avgMor = Math.round(ps.reduce((s, p) => s + p.morale, 0) / ps.length);
      const hist = T.history.slice(-6).reverse();
      return `<div class="page-h"><div><h1>Entrenamiento</h1><p>El plan se aplica cada semana al avanzar. Los jóvenes con potencial son los que más mejoran.</p></div>
        <div class="row"><span class="chip">Físico medio ${avgFit}%</span><span class="chip">Moral media ${avgMor}</span><span class="chip">Química ${Math.round(club.chem)}%</span></div></div>
        <div class="panel"><div class="panel-h"><h3>Enfoque de la semana</h3></div>
          <div class="focus-grid">${Object.entries(G.TRAINING_FOCUS).map(([k, f]) => `<button class="focus-card ${T.focus === k ? 'on' : ''}" data-focus="${k}"><b>${f.name}</b><small>${f.desc}</small>${f.attrs.length ? `<span class="row" style="gap:4px">${f.attrs.map(a => `<span class="chip">${G.ATTR_SHORT[a]}</span>`).join('')}</span>` : ''}</button>`).join('')}</div>
          <div class="row" style="margin-top:14px"><span class="muted">Intensidad</span><div class="seg">${[[1, 'Suave'], [2, 'Normal'], [3, 'Intensa']].map(([v, l]) => `<button data-int="${v}" class="${T.intensity === v ? 'on' : ''}">${l}</button>`).join('')}</div>
            <span class="muted">Riesgo de lesión</span><span class="risk">${[1, 2, 3].map(i => `<i class="${i <= T.intensity && T.focus !== 'descanso' ? 'on' : ''}"></i>`).join('')}</span>
            <span class="muted">Mejora</span><span class="risk">${[1, 2, 3].map(i => `<i class="${i <= (T.focus === 'descanso' ? 0 : T.intensity) ? 'on' : ''}" style="${i <= T.intensity ? 'background:var(--good)' : ''}"></i>`).join('')}</span></div>
        </div>
        <div class="panel tbl-wrap" style="margin-top:14px"><div class="panel-h"><h3>Plan individual</h3><span class="muted">Elige un atributo para cada jugador: recibirá parte de las mejoras.</span></div>
          <table><thead><tr><th>Jugador</th><th>POS</th><th class="n">Edad</th><th class="n">MED</th><th class="n">Progreso</th><th class="n">POT</th><th>Físico</th><th>Moral</th><th>Trabajo específico</th></tr></thead><tbody>
          ${ps.map(p => `<tr><td><span data-player="${p.id}" style="cursor:pointer">${pcell(p)}</span></td><td>${posTag(p.pos)}</td><td class="n">${p.age}</td><td class="n">${ovrTag(p.ovr)}</td><td class="n">${p.ovr0 != null ? (p.ovr - p.ovr0 > 0 ? `<span class="good">+${p.ovr - p.ovr0}</span>` : p.ovr - p.ovr0 < 0 ? `<span class="bad">${p.ovr - p.ovr0}</span>` : '<span class="dim">=</span>') : '-'}</td><td class="n">${p.pot}</td><td>${bar(p.fit)}</td><td>${bar(p.morale)}</td>
            <td><select data-ifocus="${p.id}" aria-label="Trabajo específico de ${esc(G.shortName(p))}"><option value="">Plan del equipo</option>${G.ATTRS.filter(k => p.pos === 'POR' || k !== 'gk').map(k => `<option value="${k}" ${p.focus === k ? 'selected' : ''}>${G.ATTR_NAME[k]}</option>`).join('')}</select></td></tr>`).join('')}
          </tbody></table></div>
        ${hist.length ? `<div class="panel" style="margin-top:14px"><div class="panel-h"><h3>Últimas semanas</h3></div><div class="row">${hist.map(h => `<span class="chip">Sem. ${h.week + 1}: ${G.TRAINING_FOCUS[h.focus].name} · ${['', 'Suave', 'Normal', 'Intensa'][h.intensity]}</span>`).join('')}</div></div>` : ''}`;
    },
    bind(el) {
      const T = G.C.training;
      el.querySelectorAll('[data-focus]').forEach(b => b.onclick = () => { T.focus = b.dataset.focus; G.save(); render(); });
      el.querySelectorAll('[data-int]').forEach(b => b.onclick = () => { T.intensity = +b.dataset.int; G.save(); render(); });
      el.querySelectorAll('[data-ifocus]').forEach(s => s.onchange = () => { P(+s.dataset.ifocus).focus = s.value || null; G.save(); });
    }
  };

  // ---- Traspasos
  VIEWS.traspasos = {
    html() {
      const c = G.C, club = me(), M = S.mk;
      const open = G.isWindowOpen();
      const wageUsed = club.players.reduce((s, id) => s + P(id).wage, 0);
      const tabs = [['buscar', 'Buscar'], ['seguimiento', 'Seguimiento'], ['ofertas', 'Ofertas recibidas'], ['libres', 'Agentes libres'], ['venta', 'Mis transferibles'], ['historial', 'Historial']];
      const cols = [{ f: pcell }, { f: p => posTag(p.pos) }, { n: 1, f: p => p.age }, { n: 1, f: p => ovrTag(p.ovr) }, { n: 1, f: p => G.potText(p) }, { f: p => clubCell(p.club) }, { n: 1, f: p => money(p.value) }, { n: 1, f: p => G.fmtWage(p.wage) }];
      const head = `<tr><th>Jugador</th><th>POS</th><th class="n">Edad</th><th class="n">MED</th><th class="n">POT</th><th>Club</th><th class="n">Valor</th><th class="n">Sueldo</th></tr>`;
      let body = '';
      if (S.mkTab === 'buscar') {
        const q = M.q.trim().toLowerCase();
        let res = Object.values(c.world.players).filter(p => p.club && p.club !== club.id && p.ovr >= M.ovrMin && p.age >= M.ageMin && p.age <= M.ageMax && (M.pos === 'ALL' || p.pos === M.pos) && (M.league === 'ALL' || CL(p.club).league === M.league) && (!M.price || p.value <= M.price) && (!q || (p.fn + ' ' + p.ln).toLowerCase().includes(q)));
        res.sort((a, b) => b.ovr - a.ovr);
        const total = res.length; res = res.slice(0, 60);
        body = `<div class="panel" style="margin-bottom:14px"><div class="row">
          <input type="search" id="mq" placeholder="Nombre" value="${esc(M.q)}" aria-label="Buscar por nombre">
          <select id="mpos" aria-label="Posición"><option value="ALL">Todas las posiciones</option>${G.POSITIONS.map(p => `<option ${M.pos === p ? 'selected' : ''}>${p}</option>`).join('')}</select>
          <select id="mlg" aria-label="Liga"><option value="ALL">Todas las ligas</option>${G.LEAGUES.map(l => `<option value="${l.id}" ${M.league === l.id ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</select>
          <label class="muted">Edad <input type="number" id="mamin" value="${M.ageMin}" style="width:60px"> - <input type="number" id="mamax" value="${M.ageMax}" style="width:60px"></label>
          <label class="muted">Media mín. <input type="number" id="movr" value="${M.ovrMin}" style="width:64px"></label>
          <label class="muted">Valor máx. (M€) <input type="number" id="mprice" value="${M.price || ''}" style="width:80px" placeholder="sin límite"></label>
          <button class="btn primary" id="msearch">Buscar</button></div></div>
          <p class="muted">${total} jugadores encontrados${total > 60 ? ' (se muestran los 60 mejores)' : ''}.</p>
          <div class="panel tbl-wrap"><table><thead>${head}</thead><tbody>${res.map(p => playerRow(p, cols)).join('')}</tbody></table></div>`;
      } else if (S.mkTab === 'seguimiento') {
        const l = (c.shortlist || []).map(P).filter(Boolean);
        body = l.length ? `<div class="panel tbl-wrap"><table><thead>${head}</thead><tbody>${l.map(p => playerRow(p, cols)).join('')}</tbody></table></div>` : '<p class="muted">Añade jugadores a seguimiento desde su ficha.</p>';
      } else if (S.mkTab === 'ofertas') {
        const offers = c.inbox.filter(m => m.kind === 'oferta');
        body = offers.length ? offers.map(m => `<div class="panel" style="margin-bottom:10px"><div class="row"><div style="flex:1;min-width:220px"><b>${esc(m.subject)}</b><div class="muted">${esc(m.body)}</div></div>${m.done ? '<span class="chip">Respondida</span>' : (m.choices || []).map((ch, i) => `<button class="btn small ${i === 0 ? 'primary' : ''}" data-offer="${m.id}" data-ch="${esc(ch)}">${esc(ch)}</button>`).join('')}</div></div>`).join('') : '<p class="muted">No has recibido ofertas. Declara jugadores transferibles para atraer compradores.</p>';
      } else if (S.mkTab === 'libres') {
        const l = c.world.freeAgents.map(P).filter(Boolean).sort((a, b) => b.ovr - a.ovr);
        body = `<p class="muted">Los agentes libres se pueden fichar en cualquier momento, sin pagar traspaso.</p><div class="panel tbl-wrap"><table><thead>${head}</thead><tbody>${l.map(p => playerRow(p, cols)).join('')}</tbody></table></div>`;
      } else if (S.mkTab === 'venta') {
        const l = club.players.map(P).filter(p => p.listed);
        body = l.length ? `<div class="panel tbl-wrap"><table><thead>${head}</thead><tbody>${l.map(p => playerRow(p, cols)).join('')}</tbody></table></div>` : '<p class="muted">No tienes jugadores en venta. Hazlo desde la ficha del jugador (pestaña Gestión).</p>';
      } else {
        body = `<div class="panel tbl-wrap"><table><thead><tr><th>Jugador</th><th>POS</th><th class="n">MED</th><th>De</th><th>A</th><th class="n">Traspaso</th><th>Fecha</th></tr></thead><tbody>${c.transfers.map(t => `<tr class="click" data-player="${t.pid}"><td>${esc(t.name)}</td><td>${posTag(t.pos)}</td><td class="n">${t.ovr}</td><td>${t.from ? clubCell(t.from) : 'Libre'}</td><td>${clubCell(t.to)}</td><td class="n">${t.fee ? money(t.fee) : 'Libre'}</td><td class="muted">Sem. ${t.week + 1} · ${t.season}</td></tr>`).join('')}</tbody></table></div>`;
      }
      return `<div class="page-h"><div><h1>Traspasos</h1><p><span class="chip ${open ? 'on' : ''}">${open ? 'Mercado abierto' : 'Mercado cerrado: abre en la semana 19'}</span> Presupuesto <b>${money(club.budget)}</b> · Masa salarial ${G.fmtWage(wageUsed)} de ${G.fmtWage(club.wageBudget)}</p></div></div>
        <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${S.mkTab === k ? 'active' : ''}" data-mt="${k}">${l}</button>`).join('')}</div>${body}`;
    },
    bind(el) {
      el.querySelectorAll('[data-mt]').forEach(b => b.onclick = () => { S.mkTab = b.dataset.mt; render(); });
      const s = el.querySelector('#msearch');
      if (s) {
        const doS = () => { const M = S.mk; M.q = el.querySelector('#mq').value; M.pos = el.querySelector('#mpos').value; M.league = el.querySelector('#mlg').value; M.ageMin = +el.querySelector('#mamin').value || 15; M.ageMax = +el.querySelector('#mamax').value || 45; M.ovrMin = +el.querySelector('#movr').value || 0; M.price = +el.querySelector('#mprice').value || 0; render(); };
        s.onclick = doS; el.querySelector('#mq').onkeydown = e => { if (e.key === 'Enter') doS(); };
      }
      el.querySelectorAll('[data-offer]').forEach(b => b.onclick = () => { const m = G.C.inbox.find(x => x.id === +b.dataset.offer); if (!m) return; toast(G.answerOffer(m, b.dataset.ch)); G.save(); render(); });
    }
  };

  // ---- Calendario
  VIEWS.calendario = {
    html() {
      const c = G.C, club = me(), lid = club.league;
      const all = []; const saveWeek = c.week;
      for (let w = 0; w <= c.lastWeek; w++) {
        for (const cup of c.cups) { const k = cup.weeks.indexOf(w); if (k >= 0 && cup.rounds[k]) for (const t of cup.rounds[k]) if (t.h === club.id || t.a === club.id) all.push({ w, comp: cup.id, round: cup.roundNames[k], h: t.h, a: t.a, res: t.hg !== null ? [t.hg, t.ag] : null, pen: t.pen }); }
        const lr = c.fixtures[lid][w]; const m = lr && lr.find(([h, a]) => h === club.id || a === club.id);
        if (m) { const r = c.results[lid][w].find(x => x.h === m[0] && x.a === m[1]); all.push({ w, comp: lid, round: 'Jornada ' + (w + 1), h: m[0], a: m[1], res: r ? [r.hg, r.ag] : null }); }
      }
      const wk = S.calWeek ?? Math.max(0, Math.min(c.week, c.fixtures[lid].length - 1));
      const round = c.fixtures[lid][wk] || [];
      const results = c.results[lid][wk] || [];
      return `<div class="page-h"><div><h1>Calendario</h1><p>Temporada ${c.season}/${String(c.season + 1).slice(2)}</p></div></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start">
          <div class="panel tbl-wrap"><div class="panel-h"><h3>Tus partidos</h3></div><table><tbody>${all.map(f => {
            const uh = f.h === club.id, r = f.res; const outc = r ? ((uh ? r[0] - r[1] : r[1] - r[0]) > 0 ? 'V' : (uh ? r[0] - r[1] : r[1] - r[0]) < 0 ? 'D' : 'E') : '';
            return `<tr class="${f.w === c.week ? 'me' : ''}"><td class="muted">${esc(G.fmtDate(G.weekDate(f.w)))}</td><td><span class="chip">${esc(G.LEAGUES.some(l => l.id === f.comp) ? f.round : G.CUPS.find(x => x.id === f.comp).short + ' · ' + f.round)}</span></td><td><span class="team-cell">${G.crest(CL(uh ? f.a : f.h), 18)}${uh ? '' : '@ '}${esc(CL(uh ? f.a : f.h).name)}</span></td><td class="n">${r ? `<b>${r[0]}-${r[1]}</b>${f.pen ? ` <span class="dim">(p. ${f.pen[0]}-${f.pen[1]})</span>` : ''} <span class="form-dots"><i class="f-${outc === 'E' && f.pen ? ((uh ? f.pen[0] > f.pen[1] : f.pen[1] > f.pen[0]) ? 'V' : 'D') : outc}">${outc}</i></span>` : '<span class="dim">21:00</span>'}</td></tr>`;
          }).join('')}</tbody></table></div>
          <div class="panel"><div class="panel-h"><h3>${esc(G.leagueOf(lid).name)}</h3><div class="row"><button class="icon-btn" id="wprev" aria-label="Jornada anterior">${ic('left')}</button><b>Jornada ${wk + 1}</b><button class="icon-btn" id="wnext" aria-label="Jornada siguiente">${ic('right')}</button></div></div>
            ${round.map(([h, a]) => { const r = results.find(x => x.h === h && x.a === a); return `<div class="sub-row"><span class="team-cell" style="min-width:0">${G.crest(CL(h), 18)}${esc(CL(h).name)} <span class="dim">vs</span> ${G.crest(CL(a), 18)}${esc(CL(a).name)}</span><b>${r ? r.hg + ' - ' + r.ag : '-'}</b></div>`; }).join('')}</div>
        </div>`;
    },
    bind(el) {
      const lid = me().league, max = G.C.fixtures[lid].length - 1;
      const cur = () => S.calWeek ?? Math.max(0, Math.min(G.C.week, max));
      el.querySelector('#wprev').onclick = () => { S.calWeek = Math.max(0, cur() - 1); render(); };
      el.querySelector('#wnext').onclick = () => { S.calWeek = Math.min(max, cur() + 1); render(); };
    }
  };

  // ---- Oficina: mensajes, directiva y finanzas
  VIEWS.oficina = {
    html() {
      const c = G.C, club = me();
      const sel = c.inbox.find(m => m.id === S.officeMsg) || c.inbox[0];
      if (sel) sel.read = true;
      const pos = G.position(club.league, club.id);
      const wageUsed = club.players.reduce((s, id) => s + P(id).wage, 0);
      const expiring = club.players.map(P).filter(p => p.contract <= 1).sort((a, b) => b.ovr - a.ovr);
      const conf = Math.round(c.board.conf);
      return `<div class="page-h"><div><h1>Oficina</h1><p>Mensajes, directiva, finanzas y contratos.</p></div></div>
        <div class="grid" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:start" id="office-grid">
          <div class="panel"><div class="panel-h"><h3>Mensajes</h3></div>
            <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.3fr)">
              <div class="list" style="max-height:540px;overflow:auto">${c.inbox.map(m => `<button class="msg-row ${m.read ? '' : 'unread'}" data-om="${m.id}" style="${sel && m.id === sel.id ? 'background:rgba(31,111,235,.14)' : ''}"><span class="msg-ico">${ic(msgIcon(m.kind), 16)}</span><span style="min-width:0"><b>${esc(m.from)}</b><div class="s">${esc(m.subject)}</div><div class="p">${ago(m)}${(m.kind === 'decision' || m.kind === 'oferta') && !m.done ? ' · <span class="warn">Pendiente</span>' : ''}</div></span></button>`).join('')}</div>
              <div>${sel ? `<div class="muted" style="font-size:12px">${esc(sel.from)} · ${ago(sel)}</div><h3 style="font-size:22px;margin:4px 0 10px">${esc(sel.subject)}</h3><p style="white-space:pre-line">${esc(sel.body)}</p>
                ${sel.choices && !sel.done ? `<div class="list">${sel.choices.map((ch, i) => `<button class="btn" style="justify-content:flex-start;margin-bottom:6px" data-choice="${i}">${esc(ch)}</button>`).join('')}</div>` : ''}
                ${sel.done && sel.answer ? `<p class="muted">Tu respuesta: <b>${esc(sel.answer)}</b></p>` : ''}${sel.outcome ? `<p class="good">${esc(sel.outcome)}</p>` : ''}
                ${sel.pid && P(sel.pid) ? `<button class="panel-link" data-player="${sel.pid}">Ver jugador ${ic('arrow', 14)}</button>` : ''}` : '<p class="muted">Sin mensajes.</p>'}</div>
            </div></div>
          <div class="grid" style="gap:14px">
            <div class="panel"><div class="panel-h"><h3>Directiva</h3></div>
              <p style="margin:0 0 6px">Confianza: <b class="${conf >= 60 ? 'good' : conf >= 35 ? 'warn' : 'bad'}">${conf}%</b></p>
              <div class="bar" style="width:100%;height:10px"><i style="width:${conf}%;background:${conf >= 60 ? 'var(--good)' : conf >= 35 ? 'var(--warn)' : 'var(--bad)'}"></i></div>
              <p class="muted">Objetivo: <b style="color:var(--fg)">${esc(c.board.objective.text)}</b> (puesto ${c.board.objective.target} o mejor). Ahora: <b style="color:var(--fg)">${pos}º</b></p>
              <p class="muted" style="margin:0">Afición: ${bar(club.fans || 60, 'var(--accent-hi)')} ${Math.round(club.fans || 60)}%</p></div>
            <div class="panel"><div class="panel-h"><h3>Finanzas</h3></div>
              <div class="fin-row"><span class="muted">Balance</span><b class="${c.fin.balance >= 0 ? '' : 'bad'}">${money(c.fin.balance)}</b></div>
              <div class="fin-row"><span class="muted">Presupuesto de fichajes</span><b>${money(club.budget)}</b></div>
              <div class="fin-row"><span class="muted">Masa salarial semanal</span><b>${G.fmtWage(wageUsed)}</b></div>
              <div class="fin-row"><span class="muted">Límite salarial</span><b>${G.fmtWage(club.wageBudget)}</b></div>
              <div class="fin-row"><span class="muted">Ingresos / gastos (temporada)</span><b>${money(c.fin.income)} / ${money(c.fin.expense)}</b></div>
              ${sparkSVG(c.fin.history.slice(-40))}
              <div class="row" style="margin-top:8px"><button class="btn small" id="tobudget">Pasar 5 M€ del presupuesto al límite salarial</button></div></div>
            <div class="panel"><div class="panel-h"><h3>Contratos que vencen</h3></div>${expiring.length ? expiring.map(p => `<div class="sub-row" data-player="${p.id}" style="cursor:pointer"><span>${esc(G.fullName(p))} ${posTag(p.pos)}</span><span>${ovrTag(p.ovr)} <span class="warn">${c.season + p.contract}</span></span></div>`).join('') : '<p class="muted">Ningún contrato vence esta temporada.</p>'}</div>
          </div>
        </div>`;
    },
    bind(el) {
      const c = G.C;
      el.querySelectorAll('[data-om]').forEach(b => b.onclick = () => { S.officeMsg = +b.dataset.om; render(); });
      el.querySelectorAll('[data-choice]').forEach(b => b.onclick = () => {
        const m = c.inbox.find(x => x.id === S.officeMsg) || c.inbox[0];
        const i = +b.dataset.choice;
        const txt = m.kind === 'oferta' ? G.answerOffer(m, m.choices[i]) : G.answerDecision(m, i);
        if (m.kind === 'oferta') { m.answer = m.choices[i]; m.outcome = txt; }
        G.save(); toast(txt || 'Decisión tomada.'); render();
      });
      const tb = el.querySelector('#tobudget');
      if (tb) tb.onclick = () => { const club = me(); if (club.budget < 5) return toast('No hay presupuesto suficiente.', 'bad'); club.budget -= 5; club.wageBudget += Math.round(5000 / 52); G.save(); render(); };
      if (window.innerWidth < 960) el.querySelector('#office-grid').style.gridTemplateColumns = 'minmax(0,1fr)';
    }
  };

  // ---- Club
  VIEWS.club = {
    html() {
      const c = G.C, club = me();
      const value = club.players.reduce((s, id) => s + P(id).value, 0);
      const cap = P(club.captain);
      return `<div class="page-h"><div class="row">${G.crest(club, 70)}<div><h1>${esc(club.name)}</h1><p>${esc(G.leagueOf(club.league).name)} · ${stars(club.rep)}</p></div></div></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));align-items:start">
          <div class="panel"><div class="panel-h"><h3>Instalaciones</h3></div>
            <div class="fin-row"><span class="muted">Estadio</span><b>${esc(club.stadium)}</b></div>
            <div class="fin-row"><span class="muted">Capacidad</span><b>${club.capacity.toLocaleString('es-ES')}</b></div>
            <div class="fin-row"><span class="muted">Valor de la plantilla</span><b>${money(value)}</b></div>
            <div class="fin-row"><span class="muted">Capitán</span><b>${cap ? esc(G.fullName(cap)) : 'Sin nombrar'}</b></div>
            <div class="fin-row"><span class="muted">Colores</span><span class="row"><i style="width:22px;height:14px;background:${club.colors[0]};border:1px solid var(--line2)"></i><i style="width:22px;height:14px;background:${club.colors[1]};border:1px solid var(--line2)"></i></span></div></div>
          <div class="panel"><div class="panel-h"><h3>${ic('comps')} Palmarés del club</h3></div>${club.trophies.length ? club.trophies.slice().reverse().map(t => `<div class="sub-row"><span class="trophy">${esc(t.name)}</span><span>${t.season}</span></div>`).join('') : '<p class="muted">Todavía sin títulos. Puedes ser el primero.</p>'}</div>
          <div class="panel"><div class="panel-h"><h3>Tu carrera: ${esc(c.user.name)}</h3></div>
            ${c.user.trophies.length ? c.user.trophies.map(t => `<div class="sub-row"><span class="trophy">${esc(t.name)}</span><span>${t.season}</span></div>`).join('') : '<p class="muted">Sin títulos todavía.</p>'}
            ${c.user.history.length ? `<h4 style="margin:12px 0 4px">Temporadas</h4>${c.user.history.map(h => `<div class="sub-row"><span class="team-cell">${G.crest(CL(h.club), 18)}${esc(CL(h.club).name)} · ${h.season}</span><b>${h.pos}º</b></div>`).join('')}` : ''}</div>
        </div>`;
    }
  };

  function clubModal(cid) {
    const club = CL(cid); if (!club) return;
    const ps = club.players.map(P).sort((a, b) => POS_ORDER[a.pos] - POS_ORDER[b.pos] || b.ovr - a.ovr);
    const lr = G.lineRatings(club);
    modal(`<div class="modal-h"><div class="row">${G.crest(club, 54)}<div><h2>${esc(club.name)}</h2><div class="muted">${esc(G.leagueOf(club.league).name)} · ${stars(club.rep)} · ATA ${lr.ata} · MED ${lr.med} · DEF ${lr.def}</div></div></div>${closeBtn}</div>
      <div class="tbl-wrap"><table><thead><tr><th>Jugador</th><th>POS</th><th class="n">Edad</th><th class="n">MED</th><th class="n">Valor</th><th class="n">PJ</th><th class="n">G</th></tr></thead><tbody>${ps.map(p => `<tr class="click" data-p="${p.id}"><td>${pcell(p)}</td><td>${posTag(p.pos)}</td><td class="n">${p.age}</td><td class="n">${ovrTag(p.ovr)}</td><td class="n">${money(p.value)}</td><td class="n">${p.st.ap}</td><td class="n">${p.st.g}</td></tr>`).join('')}</tbody></table></div>
      <div class="row" style="margin-top:10px"><button class="btn small" id="cedit">${ic('edit', 14)} Editar club</button></div>`, mm => {
      mm.querySelectorAll('[data-p]').forEach(r => r.onclick = () => playerModal(+r.dataset.p));
      mm.querySelector('#cedit').onclick = () => editClub(cid);
    }, false, 'wide');
  }

  // ---- Competiciones
  VIEWS.competiciones = {
    html() {
      const c = G.C, club = me();
      const lid = S.compLeague || club.league;
      const tabs = [['liga', 'Clasificación'], ['copas', 'Copas'], ['stats', 'Estadísticas'], ['premios', 'Premios']];
      let body = '';
      if (S.compTab === 'liga' || S.compTab === 'stats') {
        body += `<div class="row" style="margin-bottom:12px">${G.LEAGUES.map(l => `<button class="chip ${l.id === lid ? 'on' : ''}" data-lid="${l.id}">${esc(l.name)}</button>`).join('')}</div>`;
      }
      if (S.compTab === 'liga') {
        const t = G.table(lid), n = t.length;
        body += `<div class="panel tbl-wrap"><table><thead><tr><th>Pos</th><th>Equipo</th><th class="n">PJ</th><th class="n">G</th><th class="n">E</th><th class="n">P</th><th class="n">GF</th><th class="n">GC</th><th class="n">DG</th><th class="n">Pts</th><th>Forma</th></tr></thead><tbody>
          ${t.map((r, i) => `<tr class="${r.id === club.id ? 'me' : ''} ${i < 4 ? 'zone-ucl' : i >= n - 3 ? 'zone-rel' : ''}"><td>${i + 1}</td><td>${clubCell(r.id)}</td><td class="n">${r.p}</td><td class="n">${r.w}</td><td class="n">${r.d}</td><td class="n">${r.l}</td><td class="n">${r.gf}</td><td class="n">${r.ga}</td><td class="n">${r.gf - r.ga}</td><td class="n"><b>${r.pts}</b></td><td><span class="form-dots">${r.form.slice(-5).map(f => `<i class="f-${f}">${f}</i>`).join('')}</span></td></tr>`).join('')}
          </tbody></table><p class="muted" style="font-size:12px">Azul: plazas de Copa Continental/Libertad para la próxima temporada (según cupo de la liga).</p></div>`;
      } else if (S.compTab === 'copas') {
        body = c.cups.map(cup => `<div class="panel" style="margin-bottom:14px"><div class="panel-h"><h3>${ic('comps')} ${esc(cup.name)}</h3>${cup.champion ? `<span class="chip on">Campeón: ${esc(CL(cup.champion).name)}</span>` : ''}</div>
          <div class="bracket">${cup.roundNames.map((rn, k) => `<div class="col"><div class="muted" style="font:600 14px var(--font-display);text-transform:uppercase">${rn} · Sem. ${cup.weeks[k] + 1}</div>${(cup.rounds[k] || []).map(t => `<div class="tie">${[['h', 'hg'], ['a', 'ag']].map(([s, g]) => `<div class="${t.winner === t[s] ? 'w' : ''}">${G.crest(CL(t[s]), 16)}<span style="${t[s] === club.id ? 'color:var(--accent-hi)' : ''}">${esc(CL(t[s]).name)}</span><b>${t[g] ?? ''}${t.pen ? ' <span class="dim">(' + t.pen[s === 'h' ? 0 : 1] + ')</span>' : ''}</b></div>`).join('')}</div>`).join('') || '<span class="dim">Por decidir</span>'}</div>`).join('')}</div></div>`).join('');
      } else if (S.compTab === 'stats') {
        const keys = [['g', 'Goleadores'], ['a', 'Asistentes'], ['rt', 'Mejor nota'], ['cs', 'Porterías a cero'], ['mvp', 'MVP']];
        const scope = S.statScope || 'liga';
        let list = G.topBy(scope === 'liga' ? lid : null, S.statKey, 25);
        if (S.statKey === 'cs') list = list.filter(p => p.pos === 'POR');
        body += `<div class="row" style="margin-bottom:10px"><div class="seg">${keys.map(([k, l]) => `<button data-sk="${k}" class="${S.statKey === k ? 'on' : ''}">${l}</button>`).join('')}</div><div class="seg"><button data-scope="liga" class="${scope === 'liga' ? 'on' : ''}">Esta liga</button><button data-scope="mundo" class="${scope === 'mundo' ? 'on' : ''}">Todas las ligas</button></div></div>
          <div class="panel tbl-wrap"><table><thead><tr><th>#</th><th>Jugador</th><th>Club</th><th>POS</th><th class="n">PJ</th><th class="n">G</th><th class="n">A</th><th class="n">Nota</th>${S.statKey === 'cs' ? '<th class="n">Imb.</th>' : ''}</tr></thead><tbody>${list.map((p, i) => `<tr class="click" data-player="${p.id}"><td>${i + 1}</td><td>${pcell(p)}</td><td>${clubCell(p.club)}</td><td>${posTag(p.pos)}</td><td class="n">${p.st.ap}</td><td class="n">${p.st.g}</td><td class="n">${p.st.a}</td><td class="n">${G.avgRating(p).toFixed(2)}</td>${S.statKey === 'cs' ? `<td class="n">${p.st.cs}</td>` : ''}</tr>`).join('')}</tbody></table></div>`;
      } else {
        // Premios: clasificación provisional del Balón Dorado + historial
        const race = Object.values(c.world.players).filter(p => p.club && p.st.ap >= 3).map(p => ({ p, s: G.avgRating(p) * 9 + p.st.g * 1 + p.st.a * 0.6 + p.ovr * 0.35 + G.leagueOf(CL(p.club).league).rep * 0.15 })).sort((a, b) => b.s - a.s).slice(0, 10);
        body = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start">
          <div class="panel"><div class="panel-h"><h3>${ic('star')} Carrera por el Balón Dorado</h3><span class="muted">Provisional</span></div>${race.length ? race.map((x, i) => `<div class="sub-row" data-player="${x.p.id}" style="cursor:pointer"><span class="player-cell"><b style="width:22px">${i + 1}</b>${G.face(x.p, 30, CL(x.p.club).colors[0])}${esc(G.fullName(x.p))} <span class="dim">${esc(CL(x.p.club).code)}</span></span><span>${x.p.st.g} G · ${G.avgRating(x.p).toFixed(2)}</span></div>`).join('') : '<p class="muted">Se calcula a partir de la jornada 3.</p>'}</div>
          <div class="panel"><div class="panel-h"><h3>Historial de premios</h3></div>${c.awards.length ? c.awards.map(a => `<div style="margin-bottom:12px"><b class="gold">${a.season}/${String(a.season + 1).slice(2)}</b>
            ${[['balon', 'Balón Dorado'], ['bota', 'Bota Dorada'], ['guante', 'Guante Dorado'], ['promesa', 'Premio Promesa']].map(([k, l]) => a[k] && a[k][0] && P(a[k][0].id) ? `<div class="sub-row"><span class="muted">${l}</span><span data-player="${a[k][0].id}" style="cursor:pointer">${esc(G.fullName(P(a[k][0].id)))}</span></div>` : '').join('')}
            <div class="sub-row"><span class="muted">Entrenador del año</span><span>${a.entrenador === c.user.club ? esc(c.user.name) : esc(CL(a.entrenador).name)}</span></div></div>`).join('') : '<p class="muted">La primera gala se celebra al terminar la temporada.</p>'}</div></div>`;
      }
      return `<div class="page-h"><div><h1>Competiciones</h1><p>${G.LEAGUES.length} ligas y 2 copas internacionales</p></div></div>
        <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${S.compTab === k ? 'active' : ''}" data-ct="${k}">${l}</button>`).join('')}</div>${body}`;
    },
    bind(el) {
      el.querySelectorAll('[data-ct]').forEach(b => b.onclick = () => { S.compTab = b.dataset.ct; render(); });
      el.querySelectorAll('[data-lid]').forEach(b => b.onclick = () => { S.compLeague = b.dataset.lid; render(); });
      el.querySelectorAll('[data-sk]').forEach(b => b.onclick = () => { S.statKey = b.dataset.sk; render(); });
      el.querySelectorAll('[data-scope]').forEach(b => b.onclick = () => { S.statScope = b.dataset.scope; render(); });
    }
  };

  // ---- Ojeo
  VIEWS.ojeo = {
    html() {
      const c = G.C;
      const found = c.scouting.found.map(P).filter(Boolean).slice(0, 40);
      return `<div class="page-h"><div><h1>Ojeo</h1><p>Envía hasta 3 ojeadores. Los jugadores ojeados muestran su potencial exacto.</p></div></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start">
          <div class="panel"><div class="panel-h"><h3>Nueva misión</h3></div>
            <div class="field"><label for="sreg">Región</label><select id="sreg">${Object.entries(G.REGIONS).map(([k, r]) => `<option value="${k}">${r.name}</option>`).join('')}</select></div>
            <div class="field"><label for="spos">Posición</label><select id="spos"><option value="ALL">Cualquiera</option>${G.POSITIONS.map(p => `<option>${p}</option>`).join('')}</select></div>
            <div class="field"><label for="sprof">Perfil</label><select id="sprof"><option value="joven">Jóvenes con potencial</option><option value="top">Los mejores disponibles</option><option value="barato">Asequibles para mi presupuesto</option></select></div>
            <button class="btn primary" id="ssend">Enviar ojeador</button></div>
          <div class="panel"><div class="panel-h"><h3>Ojeadores trabajando (${c.scouting.missions.length}/3)</h3></div>${c.scouting.missions.length ? c.scouting.missions.map(m => `<div class="sub-row"><span>${G.REGIONS[m.region].name} · ${m.pos === 'ALL' ? 'Cualquier posición' : m.pos} · ${{ joven: 'Jóvenes', top: 'Los mejores', barato: 'Asequibles' }[m.profile]}</span><span class="chip">${m.weeks} sem.</span></div>`).join('') : '<p class="muted">Ningún ojeador en activo.</p>'}</div>
        </div>
        <div class="panel tbl-wrap" style="margin-top:14px"><div class="panel-h"><h3>Informes</h3></div>${found.length ? `<table><thead><tr><th>Jugador</th><th>POS</th><th class="n">Edad</th><th class="n">MED</th><th class="n">POT</th><th>Club</th><th class="n">Valor</th></tr></thead><tbody>${found.map(p => playerRow(p, [{ f: pcell }, { f: p => posTag(p.pos) }, { n: 1, f: p => p.age }, { n: 1, f: p => ovrTag(p.ovr) }, { n: 1, f: p => `<b class="good">${p.pot}</b>` }, { f: p => clubCell(p.club) }, { n: 1, f: p => money(p.value) }])).join('')}</tbody></table>` : '<p class="muted">Aún no hay informes.</p>'}</div>`;
    },
    bind(el) {
      el.querySelector('#ssend').onclick = () => { toast(G.sendScout(el.querySelector('#sreg').value, el.querySelector('#spos').value, el.querySelector('#sprof').value)); G.save(); render(); };
    }
  };

  // ---- Cantera
  VIEWS.cantera = {
    html() {
      const ys = G.C.youth.map(P).filter(Boolean).sort((a, b) => b.pot - a.pot);
      return `<div class="page-h"><div><h1>Cantera</h1><p>Juveniles de la academia. Cada verano llegan 4 nuevos y a veces aparece una joya.</p></div></div>
        <div class="panel tbl-wrap">${ys.length ? `<table><thead><tr><th>Jugador</th><th>POS</th><th class="n">Edad</th><th class="n">MED</th><th class="n">POT</th><th>Rasgos</th><th></th></tr></thead><tbody>${ys.map(p => `<tr><td><span data-player="${p.id}" style="cursor:pointer">${pcell(p)}</span></td><td>${posTag(p.pos)}</td><td class="n">${p.age}</td><td class="n">${ovrTag(p.ovr)}</td><td class="n"><b class="${p.pot >= 80 ? 'good' : ''}">${p.pot}</b></td><td class="muted">${esc(p.traits.join(', '))}</td><td class="n"><button class="btn small primary" data-promo="${p.id}">Subir</button> <button class="btn small danger" data-drop="${p.id}">Despedir</button></td></tr>`).join('')}</tbody></table>` : '<p class="muted">La cantera está vacía.</p>'}</div>`;
    },
    bind(el) {
      el.querySelectorAll('[data-promo]').forEach(b => b.onclick = () => { promoteYouth(+b.dataset.promo); render(); });
      el.querySelectorAll('[data-drop]').forEach(b => b.onclick = () => { if (!b.dataset.c) { b.dataset.c = 1; b.textContent = 'Confirmar'; return; } const id = +b.dataset.drop; G.C.youth = G.C.youth.filter(x => x !== id); delete G.C.world.players[id]; G.save(); render(); });
    }
  };

  // ---- Base de datos: ranking, editor e importación
  VIEWS.basedatos = {
    html() {
      const c = G.C, D = S.db;
      const tabs = [['jugadores', 'Ranking de jugadores'], ['clubes', 'Ranking de clubes'], ['ligas', 'Ligas'], ['importar', 'Importar CSV']];
      let body = '';
      if (S.dbTab === 'jugadores') {
        const q = D.q.trim().toLowerCase();
        let l = Object.values(c.world.players).filter(p => p.club && (D.league === 'ALL' || CL(p.club).league === D.league) && (D.pos === 'ALL' || p.pos === D.pos) && (!q || (p.fn + ' ' + p.ln).toLowerCase().includes(q) || CL(p.club).name.toLowerCase().includes(q)));
        l.sort((a, b) => b.ovr - a.ovr || b.pot - a.pot);
        const tot = l.length; l = l.slice(0, 100);
        body = `<div class="panel" style="margin-bottom:12px"><div class="row"><input type="search" id="dq" placeholder="Jugador o club" value="${esc(D.q)}" aria-label="Buscar"><select id="dlg" aria-label="Liga"><option value="ALL">Todas las ligas</option>${G.LEAGUES.map(x => `<option value="${x.id}" ${D.league === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select><select id="dpos" aria-label="Posición"><option value="ALL">Todas</option>${G.POSITIONS.map(p => `<option ${D.pos === p ? 'selected' : ''}>${p}</option>`).join('')}</select><button class="btn primary" id="dgo">Buscar</button></div></div>
          <p class="muted">${tot.toLocaleString('es-ES')} jugadores · top 100 por media. Toca un jugador para ver su ficha o editarlo.</p>
          <div class="panel tbl-wrap"><table><thead><tr><th>#</th><th>Jugador</th><th>Nac.</th><th>POS</th><th class="n">Edad</th><th class="n">MED</th><th class="n">POT</th>${G.ATTRS.slice(0, 6).map(k => `<th class="n">${G.ATTR_SHORT[k]}</th>`).join('')}<th>Club</th><th class="n">Valor</th></tr></thead><tbody>${l.map((p, i) => playerRow(p, [{ f: () => i + 1 }, { f: pcell }, { f: p => G.flag(p.nat) }, { f: p => posTag(p.pos) }, { n: 1, f: p => p.age }, { n: 1, f: p => ovrTag(p.ovr) }, { n: 1, f: p => G.potText(p) }, ...G.ATTRS.slice(0, 6).map(k => ({ n: 1, f: p => p.att[k] })), { f: p => clubCell(p.club) }, { n: 1, f: p => money(p.value) }])).join('')}</tbody></table></div>`;
      } else if (S.dbTab === 'clubes') {
        const l = Object.values(c.world.clubs).map(cl => ({ cl, s: G.teamStrength(cl), lr: G.lineRatings(cl) })).sort((a, b) => b.s - a.s);
        body = `<div class="panel tbl-wrap"><table><thead><tr><th>#</th><th>Club</th><th>Liga</th><th class="n">Media</th><th class="n">ATA</th><th class="n">MED</th><th class="n">DEF</th><th>Reputación</th><th class="n">Presupuesto</th><th class="n">Valor plantilla</th></tr></thead><tbody>${l.map((x, i) => `<tr class="click ${x.cl.id === c.user.club ? 'me' : ''}" data-clubinfo="${x.cl.id}"><td>${i + 1}</td><td><span class="team-cell">${G.crest(x.cl, 20)}${esc(x.cl.name)}</span></td><td class="muted">${esc(G.leagueOf(x.cl.league).name)}</td><td class="n">${ovrTag(G.squadOvr(x.cl))}</td><td class="n">${x.lr.ata}</td><td class="n">${x.lr.med}</td><td class="n">${x.lr.def}</td><td>${stars(x.cl.rep)}</td><td class="n">${money(x.cl.budget)}</td><td class="n">${money(x.cl.players.reduce((s, id) => s + P(id).value, 0))}</td></tr>`).join('')}</tbody></table></div>`;
      } else if (S.dbTab === 'ligas') {
        body = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${G.LEAGUES.map(L => { const ids = c.world.leagues[L.id].clubs; const avg = Math.round(ids.reduce((s, id) => s + G.squadOvr(CL(id)), 0) / ids.length); const best = Object.values(c.world.players).filter(p => p.club && CL(p.club).league === L.id).sort((a, b) => b.ovr - a.ovr)[0]; return `<div class="panel"><div class="panel-h"><h3>${esc(L.name)}</h3>${G.flag(L.nat)}</div><div class="fin-row"><span class="muted">Clubes</span><b>${ids.length}</b></div><div class="fin-row"><span class="muted">Media de los equipos</span><b>${avg}</b></div><div class="fin-row"><span class="muted">Mejor jugador</span><b data-player="${best.id}" style="cursor:pointer">${esc(G.shortName(best))} (${best.ovr})</b></div><button class="panel-link" data-lid2="${L.id}">Ver clasificación ${ic('arrow', 14)}</button></div>`; }).join('')}</div>`;
      } else {
        body = `<div class="panel"><div class="panel-h"><h3>Importar jugadores desde CSV</h3></div>
          <p class="muted">Una línea por jugador, separada por punto y coma. El club debe existir en el juego (puedes renombrar clubes desde su ficha con "Editar club"). Formato:</p>
          <pre style="background:var(--bg);padding:10px;border-radius:6px;overflow-x:auto;font-size:12px">club;nombre;apellido;nacionalidad;posicion;edad;RIT;TIR;PAS;REG;DEF;FIS;POR
${esc(me().name)};Nombre;Apellido;ESP;DC;24;85;88;75;84;40;78;10</pre>
          <p class="muted">Posiciones: ${G.POSITIONS.join(', ')}. Nacionalidad: código (${Object.keys(G.NATIONS).slice(0, 10).join(', ')}…) o nombre del país.</p>
          <label for="csv" class="muted">Pega aquí el contenido (o carga un archivo)</label>
          <textarea id="csv" placeholder="club;nombre;apellido;..."></textarea>
          <div class="row" style="margin-top:8px"><input type="file" id="csvfile" accept=".csv,.txt" aria-label="Archivo CSV"><span class="spacer"></span><button class="btn primary" id="csvgo">Importar</button></div>
          <p id="csvres" class="muted"></p></div>`;
      }
      return `<div class="page-h"><div><h1>Base de datos</h1><p>${Object.keys(c.world.clubs).length} clubes · ${Object.values(c.world.players).filter(p => p.club).length.toLocaleString('es-ES')} jugadores con club · ${c.world.freeAgents.length} libres</p></div></div>
        <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${S.dbTab === k ? 'active' : ''}" data-dt="${k}">${l}</button>`).join('')}</div>${body}`;
    },
    bind(el) {
      el.querySelectorAll('[data-dt]').forEach(b => b.onclick = () => { S.dbTab = b.dataset.dt; render(); });
      const g = el.querySelector('#dgo');
      if (g) { const doS = () => { S.db.q = el.querySelector('#dq').value; S.db.league = el.querySelector('#dlg').value; S.db.pos = el.querySelector('#dpos').value; render(); }; g.onclick = doS; el.querySelector('#dq').onkeydown = e => { if (e.key === 'Enter') doS(); }; }
      el.querySelectorAll('[data-lid2]').forEach(b => b.onclick = () => { S.compTab = 'liga'; S.compLeague = b.dataset.lid2; go('competiciones'); });
      const f = el.querySelector('#csvfile');
      if (f) f.onchange = () => { const file = f.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => { el.querySelector('#csv').value = r.result; }; r.readAsText(file); };
      const cg = el.querySelector('#csvgo');
      if (cg) cg.onclick = () => { const r = G.importCSV(el.querySelector('#csv').value); G.save(); el.querySelector('#csvres').innerHTML = `<span class="good">${r.added} jugadores importados.</span>${r.errors.length ? '<br><span class="bad">' + r.errors.slice(0, 8).map(esc).join('<br>') + '</span>' : ''}`; };
    }
  };

  function editPlayer(pid) {
    const p = P(pid);
    modal(`<div class="modal-h"><h2>Editar jugador</h2>${closeBtn}</div>
      <div class="row"><div class="field"><label for="efn">Nombre</label><input type="text" id="efn" value="${esc(p.fn)}"></div><div class="field"><label for="eln">Apellido</label><input type="text" id="eln" value="${esc(p.ln)}"></div>
      <div class="field"><label for="enat">Nacionalidad</label><select id="enat">${Object.entries(G.NATIONS).map(([k, n]) => `<option value="${k}" ${p.nat === k ? 'selected' : ''}>${esc(n.name)}</option>`).join('')}</select></div>
      <div class="field"><label for="epos">Posición</label><select id="epos">${G.POSITIONS.map(x => `<option ${p.pos === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="field"><label for="eage">Edad</label><input type="number" id="eage" value="${p.age}" min="15" max="45" style="width:80px"></div>
      <div class="field"><label for="epot">Potencial</label><input type="number" id="epot" value="${p.pot}" min="1" max="99" style="width:80px"></div></div>
      <div class="row">${G.ATTRS.map(k => `<div class="field"><label for="ea_${k}">${G.ATTR_NAME[k]}</label><input type="number" id="ea_${k}" value="${p.att[k]}" min="1" max="99" style="width:80px"></div>`).join('')}</div>
      <div class="row"><span class="muted">La media se recalcula sola según la posición.</span><span class="spacer"></span><button class="btn primary" id="esave">Guardar</button></div>`, mm => {
      mm.querySelector('#esave').onclick = () => {
        p.fn = mm.querySelector('#efn').value.trim() || p.fn; p.ln = mm.querySelector('#eln').value.trim() || p.ln;
        p.nat = mm.querySelector('#enat').value; p.pos = mm.querySelector('#epos').value; p.age = G.clamp(+mm.querySelector('#eage').value || p.age, 15, 45);
        for (const k of G.ATTRS) p.att[k] = G.clamp(+mm.querySelector('#ea_' + k).value || p.att[k], 1, 99);
        p.ovr = G.calcOvr(p.att, p.pos); p.pot = G.clamp(Math.max(p.ovr, +mm.querySelector('#epot').value || p.pot), 1, 99); p.value = G.calcValue(p);
        G.save(); closeModal(); toast('Jugador actualizado.', 'good'); render();
      };
    }, false, 'wide');
  }

  function editClub(cid) {
    const c = CL(cid);
    modal(`<div class="modal-h"><h2>Editar club</h2>${closeBtn}</div>
      <div class="row"><div class="field"><label for="cn">Nombre</label><input type="text" id="cn" value="${esc(c.name)}"></div><div class="field"><label for="cc">Abreviatura</label><input type="text" id="cc" maxlength="3" value="${esc(c.code)}" style="width:80px"></div>
      <div class="field"><label for="cst">Estadio</label><input type="text" id="cst" value="${esc(c.stadium)}"></div>
      <div class="field"><label for="c1">Color 1</label><input type="color" id="c1" value="${c.colors[0]}"></div><div class="field"><label for="c2">Color 2</label><input type="color" id="c2" value="${c.colors[1]}"></div></div>
      <div class="row"><span class="spacer"></span><button class="btn primary" id="csave">Guardar</button></div>`, mm => {
      mm.querySelector('#csave').onclick = () => {
        c.name = mm.querySelector('#cn').value.trim() || c.name; c.code = (mm.querySelector('#cc').value.trim() || c.code).toUpperCase().slice(0, 3);
        c.stadium = mm.querySelector('#cst').value.trim() || c.stadium; c.colors = [mm.querySelector('#c1').value, mm.querySelector('#c2').value];
        G.photoReset && G.photoReset();
        G.save(); closeModal(); toast('Club actualizado.', 'good'); render();
      };
    });
  }

  // ---- Configuración
  VIEWS.config = {
    html() {
      const st = G.C.settings;
      const seg = (key, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-set="${key}" data-v='${JSON.stringify(v)}' class="${st[key] === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
      return `<div class="page-h"><div><h1>Configuración</h1></div></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start">
          <div class="panel"><div class="panel-h"><h3>Partidos en 3D</h3></div>
            <div class="field"><span>Cámara inicial</span>${seg('camera', [['banquillo', 'Banquillo'], ['tv', 'TV'], ['aerea', 'Aérea'], ['detras', 'Detrás']])}</div>
            <div class="field"><span>Velocidad inicial</span>${seg('speed', [[1, '1x'], [2, '2x'], [4, '4x'], [8, '8x']])}</div>
            <div class="field"><span>Repeticiones de los goles</span>${seg('replays', [[true, 'Sí'], [false, 'No']])}</div>
            <div class="field"><span>Horario</span>${seg('night', [[true, 'Noche'], [false, 'Día']])}</div>
            <p class="muted" style="margin:0">A 1x un partido dura unos 12 minutos reales.</p></div>
          <div class="panel"><div class="panel-h"><h3>Partida</h3></div>
            <div class="row"><button class="btn primary" id="save">Guardar ahora</button><button class="btn" id="export">Copiar partida</button></div>
            <p class="muted">La partida se guarda en este navegador después de cada jornada. Usa "Copiar partida" para llevarla a otro dispositivo y pégala abajo para cargarla.</p>
            <textarea id="imp" placeholder="Pega aquí una partida copiada" aria-label="Partida para importar"></textarea>
            <div class="row" style="margin-top:8px"><button class="btn" id="import">Cargar partida pegada</button><span class="spacer"></span><button class="btn danger" id="reset">Borrar partida y empezar de cero</button></div>
            <p id="cfgmsg" class="muted"></p></div>
        </div>`;
    },
    bind(el) {
      el.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { G.C.settings[b.dataset.set] = JSON.parse(b.dataset.v); G.save(); render(); });
      const msg = t => { el.querySelector('#cfgmsg').textContent = t; };
      el.querySelector('#save').onclick = () => msg(G.save() ? 'Partida guardada.' : 'No se pudo guardar en este navegador.');
      el.querySelector('#export').onclick = () => {
        const txt = G.exportSave(); const ta = el.querySelector('#imp');
        navigator.clipboard?.writeText(txt).then(() => msg('Partida copiada al portapapeles (' + Math.round(txt.length / 1024) + ' KB).'), () => { ta.value = txt; ta.select(); msg('Copia el texto seleccionado.'); });
      };
      el.querySelector('#import').onclick = () => { try { G.importSave(el.querySelector('#imp').value); ensureDefaults(); G.save(); S.view = 'inicio'; renderShell(); toast('Partida cargada.', 'good'); } catch (e) { msg('No es una partida válida.'); } };
      const r = el.querySelector('#reset');
      r.onclick = () => { if (!r.dataset.c) { r.dataset.c = 1; r.textContent = 'Pulsa otra vez para confirmar'; return; } G.deleteSave(); renderStart(); };
    }
  };

  window.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();
})();
