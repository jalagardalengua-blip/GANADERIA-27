// Día de partido: preparar equipos, ver el partido en 3D con órdenes desde la banda,
// o simularlo. Devuelve el resultado al modo carrera.
(function () {
  const P = id => G.C.world.players[id];
  const CL = id => G.C.world.clubs[id];
  const GK_COLORS = ['#f5d000', '#00b140', '#ff5fa2', '#222222', '#7d3cff', '#ff7a00'];

  function kitsFor(home, away) {
    const hk = { shirt: home.colors[0], shorts: home.colors[1], socks: home.colors[0] };
    let ak = { shirt: away.colors[0], shorts: away.colors[1], socks: away.colors[0] };
    if (G.colorDist(ak.shirt, hk.shirt) < 170) ak = { shirt: away.colors[1], shorts: away.colors[0], socks: away.colors[1] };
    if (G.colorDist(ak.shirt, hk.shirt) < 170) ak = G.lum(hk.shirt) > 0.5 ? { shirt: '#14171d', shorts: '#14171d', socks: '#14171d' } : { shirt: '#f2f2f2', shorts: '#f2f2f2', socks: '#f2f2f2' };
    const gks = GK_COLORS.filter(c => G.colorDist(c, hk.shirt) > 160 && G.colorDist(c, ak.shirt) > 160);
    hk.gk = gks[0] || '#f5d000'; ak.gk = gks[1] || gks[0] || '#00b140';
    hk.gkShorts = '#14171d'; ak.gkShorts = '#14171d';
    return [hk, ak];
  }

  // Comprueba la alineación del usuario y la repara si hace falta.
  G.validLineup = function (club) {
    const F = G.FORMATIONS[club.formation];
    const ok = club.lineup && club.lineup.length === F.length && club.lineup.every(id => { const p = P(id); return p && p.club === club.id && !p.inj && !p.susp; }) && new Set(club.lineup).size === F.length;
    if (!ok) { club.lineup = G.autoLineup(club); }
    club.bench = (club.bench || []).filter(id => { const p = P(id); return p && p.club === club.id && !p.inj && !p.susp && !club.lineup.includes(id); });
    if (club.bench.length < 7) club.bench = G.autoBench(club, club.lineup);
    return ok;
  };

  function sideFor(club, isUser, kit) {
    if (isUser) G.validLineup(club);
    const xi = (isUser ? club.lineup : G.autoLineup(club)).map(P);
    const bench = (isUser ? club.bench : G.autoBench(club, xi.map(p => p.id))).map(P);
    let tactics = { ...club.tactics };
    if (!isUser) {
      // La IA se adapta: los grandes salen a por el partido, los pequeños se cierran.
      const user = CL(G.C.user.club);
      const diff = G.teamStrength(club) - G.teamStrength(user);
      tactics = { ment: diff > 3 ? 1 : diff < -4 ? -1 : 0, press: diff > 2 ? 2 : 1, tempo: 1, width: 1 };
    }
    return { club, xi, bench, formation: club.formation, tactics, kit, user: isUser, boost: isUser ? G.pressMoraleBoost() : 1 };
  }

  G.buildMatch = function (fx, opts = {}) {
    const h = CL(fx.h), a = CL(fx.a);
    const [hk, ak] = kitsFor(h, a);
    const uid = G.C.user.club;
    const m = new G.Match(sideFor(h, h.id === uid, hk), sideFor(a, a.id === uid, ak), { neutral: !!fx.final, cup: !G.LEAGUES.some(l => l.id === fx.comp) });
    return m;
  };

  function withPens(m, res, fx) {
    const isCup = !G.LEAGUES.some(l => l.id === fx.comp);
    if (isCup && res.hg === res.ag) {
      res.pen = G.penaltyShootout({ xi: m.agents.filter(x => x.side === 0 && !x.off).map(x => x.p) }, { xi: m.agents.filter(x => x.side === 1 && !x.off).map(x => x.p) });
    }
    return res;
  }

  G.simulateUserMatch = function (fx) {
    const m = G.buildMatch(fx);
    const res = m.simulateToEnd();
    return { m, res: withPens(m, res, fx) };
  };

  // ------------------------------------------------------------------ pantalla del partido
  const SHOUTS = [
    { id: 'presion', label: '¡Presión arriba!', t: { press: 2 } },
    { id: 'atras', label: '¡Atrás, cerrad líneas!', t: { ment: -1, press: 0 } },
    { id: 'bandas', label: '¡Por las bandas!', t: { width: 2 } },
    { id: 'largo', label: '¡Balones largos!', t: { tempo: 2 } },
    { id: 'calma', label: '¡Calma, tocad!', t: { tempo: 0, ment: 0 } },
    { id: 'ataque', label: '¡A por ellos!', t: { ment: 2, press: 2 } }
  ];
  const CAMS = [['banquillo', 'Banquillo'], ['tv', 'TV'], ['aerea', 'Aérea'], ['detras', 'Detrás'], ['jugador', 'Jugador']];
  const MENT = [[-2, 'Muy defensiva'], [-1, 'Defensiva'], [0, 'Equilibrada'], [1, 'Ofensiva'], [2, 'Muy ofensiva']];

  G.playMatch3D = function (fx, onDone) {
    const root = document.createElement('div');
    root.className = 'match-screen';
    document.body.appendChild(root);
    const m = G.buildMatch(fx);
    G.liveMatch = m;
    const us = m.sides.find(s => s.user), ui = us.i;
    const settings = G.C.settings || {};
    root.innerHTML = `
      <div class="m3d"></div>
      <div class="hud-score">
        <div class="tm"><i class="kit" style="background:${m.sides[0].kit.shirt}"></i>${G.esc(m.sides[0].club.code)}</div>
        <div class="sc" id="hs">0 - 0</div>
        <div class="tm">${G.esc(m.sides[1].club.code)}<i class="kit" style="background:${m.sides[1].kit.shirt}"></i></div>
        <div class="clk" id="hc">00:00</div>
      </div>
      <div class="hud-top-r" id="cams">${CAMS.map(([k, l]) => `<button class="hud-btn" data-cam="${k}">${l}</button>`).join('')}</div>
      <div class="hud-feed" id="feed"></div>
      <div class="hud-bottom">
        <div class="shouts">${SHOUTS.map(s => `<button class="shout" data-shout="${s.id}">${G.icon('mega', 16)}${s.label}</button>`).join('')}</div>
        <div class="ctrl">
          <button class="hud-btn" id="pp">${G.icon('pause', 16)}<span>Pausa</span></button>
          ${[1, 2, 4, 8].map(s => `<button class="hud-btn" data-speed="${s}">${s}x</button>`).join('')}
          <button class="hud-btn" id="tab">${G.icon('tablet', 16)}Tablet</button>
          <span class="spacer"></span>
          <button class="hud-btn" id="simend">${G.icon('ff', 16)}Simular resto</button>
        </div>
      </div>`;
    const $ = s => root.querySelector(s);
    const view = new G.Match3D($('.m3d'), m, {
      camera: settings.camera || 'banquillo', night: settings.night !== false, replays: settings.replays !== false,
      onFrame, onReplay: on => { let b = root.querySelector('.replay-badge'); if (on && !b) { b = document.createElement('div'); b.className = 'replay-badge'; b.textContent = 'REPETICIÓN'; root.appendChild(b); } if (!on && b) b.remove(); }
    });
    view.speed = settings.speed || 1;
    const setCamUI = () => root.querySelectorAll('[data-cam]').forEach(b => b.classList.toggle('on', b.dataset.cam === view.cam));
    const setSpeedUI = () => root.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('on', +b.dataset.speed === view.speed));
    setCamUI(); setSpeedUI();
    root.querySelectorAll('[data-cam]').forEach(b => b.onclick = () => { view.setCamera(b.dataset.cam); setCamUI(); });
    root.querySelectorAll('[data-speed]').forEach(b => b.onclick = () => { view.speed = +b.dataset.speed; setSpeedUI(); });
    const setPaused = p => { view.paused = p; $('#pp').innerHTML = (p ? G.icon('play', 16) + '<span>Seguir</span>' : G.icon('pause', 16) + '<span>Pausa</span>'); };
    $('#pp').onclick = () => setPaused(!view.paused);
    $('#tab').onclick = () => toggleTablet();
    $('#simend').onclick = () => { closeTablet(); view.paused = true; m.simulateToEnd(); finish(); };
    root.querySelectorAll('[data-shout]').forEach(b => b.onclick = () => {
      const s = SHOUTS.find(x => x.id === b.dataset.shout);
      m.setTactics(ui, s.t);
      view.shout();
      speech(s.label);
      root.querySelectorAll('[data-shout]').forEach(x => x.classList.toggle('on', x === b));
      feed({ type: 'tactic', text: 'Orden del míster: ' + s.label });
      if (tabletOpen && tabletTab === 'tac') renderTablet();
    });

    // Comentarios
    const feedEl = $('#feed');
    function feed(ev) {
      const d = document.createElement('div');
      d.className = ev.type;
      d.textContent = (ev.min != null ? ev.min + "' " : '') + ev.text;
      feedEl.appendChild(d);
      while (feedEl.children.length > 5) feedEl.firstChild.remove();
      setTimeout(() => d.remove(), 9000);
    }
    function speech(txt) {
      const s = document.createElement('div'); s.className = 'speech'; s.textContent = txt; root.appendChild(s);
      setTimeout(() => s.remove(), 1800);
    }
    const SHOW = ['goal', 'save', 'yellow', 'red', 'sub', 'injury', 'penalty', 'corner', 'shot', 'miss', 'block', 'half', 'info', 'tactic'];
    m.on(ev => {
      if (!SHOW.includes(ev.type)) return;
      if (ev.type === 'shot' && Math.random() < 0.4) return;
      feed(ev);
      if (ev.type === 'goal') {
        const b = document.createElement('div'); b.className = 'goal-banner';
        b.innerHTML = `<b>¡GOL!</b><div>${G.esc(ev.agent ? ev.agent.p.fn + ' ' + ev.agent.p.ln : '')}${ev.own ? ' (p.p.)' : ''} · ${G.esc(m.sides[ev.side].club.name)}</div>`;
        root.appendChild(b); setTimeout(() => b.remove(), 3200);
      }
      if (ev.type === 'injury' && ev.side === ui) { toast(G.shortName(ev.agent.p) + ' está lesionado. Haz un cambio desde la tablet.', 'bad'); }
      if (ev.type === 'red' && ev.side === ui) toast('Expulsión: te quedas con diez.', 'bad');
    });

    // IA del rival durante el partido
    let aiAdjusted = 0;
    let lastScore = '', lastClock = '';
    let halfShown = false, ended = false;
    function onFrame() {
      const sc = m.sides[0].score + ' - ' + m.sides[1].score;
      if (sc !== lastScore) { $('#hs').textContent = sc; lastScore = sc; }
      const ck = m.clockText();
      if (ck !== lastClock) { $('#hc').textContent = m.state === 'half' ? 'DESC.' : ck; lastClock = ck; }
      const min = m.minute(), ai = 1 - ui, diff = m.sides[ai].score - m.sides[ui].score;
      if (m.half === 2 && min >= 65 && aiAdjusted === 0 && diff < 0) { m.setTactics(ai, { ment: 2, press: 2 }); aiAdjusted = 1; feed({ min, type: 'tactic', text: m.sides[ai].club.name + ' se vuelca al ataque.' }); }
      if (m.half === 2 && min >= 78 && aiAdjusted === 0 && diff > 0) { m.setTactics(ai, { ment: -1, press: 0 }); aiAdjusted = 1; feed({ min, type: 'tactic', text: m.sides[ai].club.name + ' se encierra atrás para defender el resultado.' }); }
      if (m.state === 'half' && !halfShown) { halfShown = true; view.paused = true; halfTime(); }
      if (m.state === 'end' && !ended) finish();
      if (tabletOpen && tabletTab === 'sub' && Math.random() < 0.02) renderTablet();
    }

    // ---------------------------------------------------------------- tablet
    let tabletOpen = false, tabletTab = 'tac', subOut = null;
    function toggleTablet() { if (tabletOpen) closeTablet(); else openTablet(); }
    function closeTablet() { const t = root.querySelector('.tablet'); if (t) t.remove(); tabletOpen = false; $('#tab').classList.remove('on'); }
    function openTablet(tab) { tabletOpen = true; if (tab) tabletTab = tab; $('#tab').classList.add('on'); renderTablet(); }
    function renderTablet() {
      let t = root.querySelector('.tablet');
      if (!t) { t = document.createElement('div'); t.className = 'tablet'; root.appendChild(t); }
      const side = m.sides[ui], T = side.tactics;
      const tabs = [['tac', 'Tácticas'], ['sub', 'Cambios (' + side.subsLeft + ')'], ['est', 'Estadísticas'], ['not', 'Notas']];
      let body = '';
      if (tabletTab === 'tac') {
        const seg = (key, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-t="${key}" data-v="${v}" class="${T[key] === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
        body = `<div class="field"><span>Formación</span><select id="tform">${Object.keys(G.FORMATIONS).map(f => `<option ${f === side.formation ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
          <div class="field"><span>Mentalidad</span>${seg('ment', MENT)}</div>
          <div class="field"><span>Presión</span>${seg('press', [[0, 'Baja'], [1, 'Media'], [2, 'Alta']])}</div>
          <div class="field"><span>Ritmo</span>${seg('tempo', [[0, 'Lento'], [1, 'Normal'], [2, 'Rápido']])}</div>
          <div class="field"><span>Amplitud</span>${seg('width', [[0, 'Estrecho'], [1, 'Normal'], [2, 'Amplio']])}</div>`;
      } else if (tabletTab === 'sub') {
        const field = m.agents.filter(a => a.side === ui && !a.off);
        if (!subOut) {
          body = `<p class="muted" style="margin:0 0 6px">Elige quién sale:</p>` + field.map(a => `<div class="sub-row"><div class="player-cell">${G.face(a.p, 30, side.kit.shirt)}<div><b>${G.esc(G.shortName(a.p))}</b> <span class="pos">${a.role}</span>${a.inj ? ' <span class="status-inj">Lesionado</span>' : ''}<br><span class="bar"><i style="width:${a.stam}%;background:${a.stam < 45 ? 'var(--bad)' : a.stam < 65 ? 'var(--warn)' : 'var(--good)'}"></i></span> <span class="rt ${G.ratingClass(a.rating)}">${a.rating.toFixed(1)}</span></div></div><button class="btn small" data-out="${m.agents.indexOf(a)}" ${side.subsLeft <= 0 ? 'disabled' : ''}>Sustituir</button></div>`).join('');
        } else {
          const out = m.agents[subOut];
          body = `<p style="margin:0 0 6px">Sale <b>${G.esc(G.shortName(out.p))}</b> (${out.role}). ¿Quién entra?</p><button class="btn small" id="subcancel">Cancelar</button>` +
            side.bench.filter(p => !p.inj).map(p => `<div class="sub-row"><div class="player-cell">${G.face(p, 30, side.kit.shirt)}<div><b>${G.esc(G.shortName(p))}</b> <span class="pos">${p.pos}</span><br><span class="muted">En ${out.role}: </span><span class="ovr ${G.ovrClass(G.ovrAt(p, out.role))}">${G.ovrAt(p, out.role)}</span></div></div><button class="btn small primary" data-in="${p.id}">Entra</button></div>`).join('');
        }
      } else if (tabletTab === 'est') {
        body = statsHTML();
      } else {
        body = m.sides.map(s => `<h4 style="margin:8px 0 4px">${G.esc(s.club.name)}</h4>` + m.agents.filter(a => a.side === s.i).map(a => `<div class="sub-row"><div>${G.esc(G.shortName(a.p))} <span class="dim">${a.role}</span>${a.ev.g ? ' ⚽'.repeat(a.ev.g) : ''}${a.off && a.subbedOff ? ' <span class="dim">(cambiado)</span>' : ''}${a.sentOff ? ' <span class="bad">(expulsado)</span>' : ''}</div><span class="rt ${G.ratingClass(a.rating)}">${a.rating.toFixed(1)}</span></div>`).join('')).join('');
      }
      t.innerHTML = `<div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${k === tabletTab ? 'active' : ''}" data-tt="${k}">${l}</button>`).join('')}<span class="spacer"></span><button class="icon-btn" id="tclose" aria-label="Cerrar">${G.icon('x', 18)}</button></div><div class="tablet-body">${body}</div>`;
      t.querySelector('#tclose').onclick = closeTablet;
      t.querySelectorAll('[data-tt]').forEach(b => b.onclick = () => { tabletTab = b.dataset.tt; subOut = null; renderTablet(); });
      t.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { m.setTactics(ui, { [b.dataset.t]: +b.dataset.v }); renderTablet(); });
      const tf = t.querySelector('#tform'); if (tf) tf.onchange = () => { m.setFormation(ui, tf.value); };
      t.querySelectorAll('[data-out]').forEach(b => b.onclick = () => { subOut = +b.dataset.out; renderTablet(); });
      t.querySelectorAll('[data-in]').forEach(b => b.onclick = () => {
        const out = m.agents[subOut]; const p = side.bench.find(x => x.id === +b.dataset.in);
        if (m.substitute(ui, out, p)) { view.refreshBench(); toast('Cambio: entra ' + G.shortName(p) + '.', 'good'); }
        subOut = null; renderTablet();
      });
      const sc = t.querySelector('#subcancel'); if (sc) sc.onclick = () => { subOut = null; renderTablet(); };
    }

    function statsHTML() {
      const [a, b] = m.sides.map(s => s.stats);
      const tot = a.poss + b.poss || 1;
      const rows = [['Posesión', Math.round(a.poss / tot * 100) + '%', Math.round(b.poss / tot * 100) + '%', a.poss, b.poss], ['Tiros', a.shots, b.shots], ['A puerta', a.onT, b.onT], ['xG', a.xg.toFixed(2), b.xg.toFixed(2), a.xg, b.xg], ['Pases', a.passes, b.passes], ['Precisión de pase', pct(a), pct(b), a.passOk / (a.passes || 1), b.passOk / (b.passes || 1)], ['Entradas ganadas', a.tackles, b.tackles], ['Paradas', a.saves, b.saves], ['Córners', a.corners, b.corners], ['Faltas', a.fouls, b.fouls], ['Amarillas', a.yc, b.yc], ['Rojas', a.rc, b.rc]];
      return `<div class="row" style="justify-content:space-between"><b>${G.esc(m.sides[0].club.code)}</b><b>${G.esc(m.sides[1].club.code)}</b></div>` + rows.map(r => { const x = +(r[3] ?? r[1]) || 0, y = +(r[4] ?? r[2]) || 0, t = x + y || 1; return `<div class="stat-cmp"><b>${r[1]}</b><span class="lbl">${r[0]}</span><b style="text-align:right">${r[2]}</b><div class="b"><i style="width:${x / t * 100}%"></i><i style="width:${y / t * 100}%"></i></div></div>`; }).join('');
    }
    const pct = s => Math.round(s.passOk / (s.passes || 1) * 100) + '%';

    // ---------------------------------------------------------------- descanso
    function halfTime() {
      closeTablet();
      const talks = [['calma', 'Mantened la calma', 'Recupera piernas; bueno si vas ganando o empatando.'], ['exigir', 'Exigir más', 'Sacude al equipo; funciona si vas perdiendo.'], ['animar', 'Animar al equipo', 'Mensaje positivo, efecto moderado siempre.'], ['felicitar', 'Felicitar', 'Premia el buen trabajo; si vais perdiendo, molesta.']];
      modal(`<div class="modal-h"><h2>Descanso · ${m.sides[0].score} - ${m.sides[1].score}</h2></div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
          <div class="panel"><div class="panel-h"><h3>Estadísticas</h3></div>${statsHTML()}</div>
          <div class="panel"><div class="panel-h"><h3>Charla en el vestuario</h3></div>
            <div class="list">${talks.map(([k, l, d]) => `<button class="msg-row" data-talk="${k}" style="grid-template-columns:1fr"><span><span class="s">${l}</span><br><span class="muted" style="font-size:12px">${d}</span></span></button>`).join('')}</div>
            <p class="muted" id="talkres" style="min-height:20px"></p>
            <div class="row"><button class="btn" id="htsubs">${G.icon('sub', 16)} Cambios y táctica</button><span class="spacer"></span><button class="btn primary" id="ht2">Segunda parte</button></div>
          </div>
        </div>`, mm => {
        let talked = false;
        mm.querySelectorAll('[data-talk]').forEach(b => b.onclick = () => {
          if (talked) return; talked = true;
          const eff = m.teamTalk(ui, b.dataset.talk);
          b.style.borderColor = 'var(--accent-hi)';
          mm.querySelector('#talkres').textContent = eff > 1.02 ? 'Los jugadores salen muy enchufados.' : eff >= 1 ? 'El mensaje cala en el vestuario.' : 'Algunos jugadores no se lo toman bien.';
        });
        mm.querySelector('#htsubs').onclick = () => { closeModal(); openTablet('sub'); const b = document.createElement('button'); b.className = 'hud-btn on'; b.id = 'resume2'; b.textContent = 'Empezar 2ª parte'; b.style.cssText = 'position:absolute;left:50%;top:45%;transform:translateX(-50%);z-index:6;padding:14px 22px;font-size:20px'; root.appendChild(b); b.onclick = () => { b.remove(); closeTablet(); setPaused(false); }; };
        mm.querySelector('#ht2').onclick = () => { closeModal(); setPaused(false); };
      });
    }

    // ---------------------------------------------------------------- final
    function finish() {
      if (ended) return; ended = true;
      view.paused = true; closeTablet();
      const res = withPens(m, m.result, fx);
      const uIsHome = ui === 0;
      const gf = uIsHome ? res.hg : res.ag, ga = uIsHome ? res.ag : res.hg;
      const verdict = gf > ga || (res.pen && (uIsHome ? res.pen[0] > res.pen[1] : res.pen[1] > res.pen[0])) ? 'Victoria' : gf < ga || res.pen ? 'Derrota' : 'Empate';
      const mvp = m.agents.find(a => a.p.id === res.mvp);
      const goals = res.events.filter(e => e.type === 'goal');
      modal(`<div class="modal-h"><h2>Final · ${verdict}</h2></div>
        <div class="prematch" style="padding:6px 0 14px">
          <div class="tm">${G.crest(m.sides[0].club, 56)}<h2>${G.esc(m.sides[0].club.name)}</h2></div>
          <div class="vs" style="color:var(--fg)">${res.hg} - ${res.ag}${res.pen ? `<div style="font-size:16px" class="muted">Penaltis ${res.pen[0]}-${res.pen[1]}</div>` : ''}</div>
          <div class="tm">${G.crest(m.sides[1].club, 56)}<h2>${G.esc(m.sides[1].club.name)}</h2></div>
        </div>
        <p class="muted" style="text-align:center;margin-top:0">${goals.map(e => e.min + "' " + G.esc(G.shortName(P(e.pid) || { fn: '?', ln: '' })) + (e.own ? ' (p.p.)' : '')).join(' · ') || 'Sin goles'}</p>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
          <div class="panel"><div class="panel-h"><h3>Estadísticas</h3></div>${statsHTML()}</div>
          <div class="panel"><div class="panel-h"><h3>Mejor jugador</h3></div>${mvp ? `<div class="player-cell">${G.face(mvp.p, 54, m.sides[mvp.side].kit.shirt)}<div><b style="font-size:18px">${G.esc(G.fullName(mvp.p))}</b><br><span class="rt ${G.ratingClass(mvp.rating)}">${mvp.rating.toFixed(1)}</span> <span class="muted">${G.esc(m.sides[mvp.side].club.name)}</span></div></div>` : ''}
            <div class="panel-h" style="margin-top:14px"><h3>Tus notas</h3></div>
            ${m.agents.filter(a => a.side === ui).sort((x, y) => y.rating - x.rating).map(a => `<div class="sub-row"><span>${G.esc(G.shortName(a.p))} <span class="dim">${a.role}</span></span><span class="rt ${G.ratingClass(a.rating)}">${a.rating.toFixed(1)}</span></div>`).join('')}
          </div>
        </div>
        <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn primary" id="fdone">Continuar</button></div>`, mm => {
        mm.querySelector('#fdone').onclick = () => { closeModal(); view.dispose(); root.remove(); onDone(res); };
      });
    }
  };

  // Ayudas de interfaz compartidas (definidas en ui.js; aquí referencias perezosas)
  function modal(html, bind) { return G.ui.modal(html, bind, true); }
  function closeModal() { G.ui.closeModal(); }
  function toast(t, k) { G.ui.toast(t, k); }
})();
