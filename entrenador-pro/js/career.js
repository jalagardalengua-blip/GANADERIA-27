// Modo carrera: calendario, simulación de jornadas, entrenamiento, mercado,
// decisiones, finanzas, premios y fin de temporada.
(function () {
  const R = Math.random;
  const rnd = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const clamp = G.clamp;
  const MONTHS = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];

  // ------------------------------------------------------------------ utilidades
  const C = () => G.C;
  const P = id => G.C.world.players[id];
  const CL = id => G.C.world.clubs[id];
  G.P = P; G.CL = CL;

  G.leagueOf = id => G.LEAGUES.find(l => l.id === id);
  G.isWindowOpen = () => { const w = C().week; return w <= 3 || (w >= 18 && w <= 21); };
  G.weekDate = function (w, season) {
    // Jornada semanal desde mediados de agosto.
    const d = new Date(Date.UTC(season || C().season, 7, 16));
    d.setUTCDate(d.getUTCDate() + w * 7 + (w > 17 ? 7 : 0));
    return d;
  };
  G.fmtDate = d => d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

  // Mejor once según formación. Devuelve ids en el orden de los huecos.
  G.autoLineup = function (club, formation) {
    const F = G.FORMATIONS[formation || club.formation];
    const avail = club.players.map(P).filter(p => !p.inj && !p.susp);
    const used = new Set(), xi = new Array(F.length);
    const order = F.map((s, i) => i).sort((a, b) => (F[a][0] === 'POR' ? -1 : 0) - (F[b][0] === 'POR' ? -1 : 0));
    for (const i of order) {
      let best = null, bv = -1;
      for (const p of avail) {
        if (used.has(p.id)) continue;
        const v = G.ovrAt(p, F[i][0]) * (0.75 + 0.25 * p.fit / 100);
        if (v > bv) { bv = v; best = p; }
      }
      if (best) { used.add(best.id); xi[i] = best.id; }
    }
    return xi.filter(Boolean);
  };
  G.autoBench = function (club, xi) {
    const rest = club.players.map(P).filter(p => !xi.includes(p.id) && !p.inj && !p.susp).sort((a, b) => b.ovr - a.ovr);
    const gk = rest.find(p => p.pos === 'POR');
    const bench = gk ? [gk] : [];
    for (const p of rest) { if (bench.length >= 9) break; if (p !== gk) bench.push(p); }
    return bench.map(p => p.id);
  };

  G.teamStrength = function (club) {
    const xi = club.lineup && club.lineup.length === 11 && club.lineup.every(id => { const p = P(id); return p && p.club === club.id && !p.inj && !p.susp; }) ? club.lineup : G.autoLineup(club);
    const F = G.FORMATIONS[club.formation];
    let s = 0;
    xi.forEach((id, i) => { const p = P(id); s += G.ovrAt(p, F[i] ? F[i][0] : p.pos) * (0.85 + 0.15 * p.fit / 100) * (0.96 + p.morale / 1250); });
    return s / Math.max(1, xi.length) + (club.chem - 60) * 0.04;
  };
  G.squadOvr = club => {
    const xi = G.autoLineup(club);
    return Math.round(xi.reduce((s, id) => s + P(id).ovr, 0) / Math.max(1, xi.length));
  };

  // Valoraciones de la plantilla en estilo "ATA / MED / DEF".
  G.lineRatings = function (club) {
    const xi = G.autoLineup(club).map(P);
    const avg = arr => arr.length ? Math.round(arr.reduce((s, p) => s + p.ovr, 0) / arr.length) : 0;
    return { ata: avg(xi.filter(p => G.POS_GROUP[p.pos] === 'DEL')), med: avg(xi.filter(p => G.POS_GROUP[p.pos] === 'MED')), def: avg(xi.filter(p => ['DEF', 'POR'].includes(G.POS_GROUP[p.pos]))) };
  };

  // ------------------------------------------------------------------ calendario
  function roundRobin(ids) {
    const t = ids.slice(); if (t.length % 2) t.push(null);
    const n = t.length, rounds = [];
    for (let r = 0; r < n - 1; r++) {
      const m = [];
      for (let i = 0; i < n / 2; i++) {
        const a = t[i], b = t[n - 1 - i];
        if (a && b) m.push(r % 2 ? [b, a] : [a, b]);
      }
      rounds.push(m);
      t.splice(1, 0, t.pop());
    }
    const second = rounds.map(r => r.map(([a, b]) => [b, a]));
    return rounds.concat(second);
  }

  G.newSeasonSchedule = function () {
    const c = C();
    c.fixtures = {}; c.results = {};
    for (const L of G.LEAGUES) {
      const ids = c.world.leagues[L.id].clubs.slice().sort(() => R() - .5);
      c.fixtures[L.id] = roundRobin(ids);
      c.results[L.id] = c.fixtures[L.id].map(() => []);
    }
    c.lastWeek = Math.max(...Object.values(c.fixtures).map(f => f.length)) - 1;
    for (const id in c.world.players) c.world.players[id].ovr0 = c.world.players[id].ovr;
    setupCups();
  };

  const CUPS = [
    { id: 'CON', name: 'Copa Continental', short: 'Continental', weeks: [5, 12, 23, 31], rounds: ['Octavos', 'Cuartos', 'Semifinal', 'Final'], quota: { ESP: 3, ENG: 4, ITA: 3, GER: 2, FRA: 2, POR: 1, NED: 1 }, prize: 30 },
    { id: 'AME', name: 'Copa Libertad', short: 'Libertad', weeks: [9, 20, 30], rounds: ['Cuartos', 'Semifinal', 'Final'], quota: { BRA: 3, ARG: 3, MEX: 2 }, prize: 12 }
  ];
  G.CUPS = CUPS;

  function setupCups() {
    const c = C();
    c.cups = CUPS.map(def => {
      let teams = [];
      for (const lid in def.quota) {
        const prev = c.lastTables && c.lastTables[lid];
        const ranked = prev ? prev.map(r => r.id) : c.world.leagues[lid].clubs.slice().sort((a, b) => CL(b).rep - CL(a).rep);
        teams = teams.concat(ranked.slice(0, def.quota[lid]));
      }
      teams.sort(() => R() - .5);
      const ties = [];
      for (let i = 0; i < teams.length; i += 2) ties.push({ h: teams[i], a: teams[i + 1], hg: null, ag: null });
      return { id: def.id, name: def.name, weeks: def.weeks, roundNames: def.rounds, prize: def.prize, rounds: [ties], champion: null, alive: teams.slice() };
    });
  }

  // Partidos del usuario en la semana actual.
  G.userFixtures = function () {
    const c = C(), uid = c.user.club, w = c.week, list = [];
    const club = CL(uid);
    const lr = c.fixtures[club.league][w];
    if (lr) {
      const m = lr.find(([h, a]) => h === uid || a === uid);
      if (m && !c.results[club.league][w].some(r => r.h === m[0] && r.a === m[1])) list.push({ comp: club.league, h: m[0], a: m[1] });
    }
    for (const cup of c.cups) {
      const k = cup.weeks.indexOf(w);
      if (k < 0 || !cup.rounds[k]) continue;
      for (const t of cup.rounds[k]) if ((t.h === uid || t.a === uid) && t.hg === null) list.push({ comp: cup.id, h: t.h, a: t.a, tie: t, final: k === cup.weeks.length - 1 });
    }
    return list;
  };

  G.nextUserFixture = function () {
    const c = C(), uid = c.user.club, club = CL(uid);
    for (let w = c.week; w <= c.lastWeek; w++) {
      const lr = c.fixtures[club.league][w];
      const m = lr && lr.find(([h, a]) => h === uid || a === uid);
      const cupM = [];
      for (const cup of c.cups) { const k = cup.weeks.indexOf(w); if (k >= 0 && cup.rounds[k]) for (const t of cup.rounds[k]) if ((t.h === uid || t.a === uid) && t.hg === null) cupM.push({ comp: cup.id, h: t.h, a: t.a, week: w }); }
      if (cupM.length && w === c.week) return cupM[0];
      if (m && !(w === c.week && c.results[club.league][w].some(r => r.h === m[0] && r.a === m[1]))) return { comp: club.league, h: m[0], a: m[1], week: w };
      if (cupM.length) return cupM[0];
    }
    return null;
  };

  G.upcoming = function (n) {
    const c = C(), uid = c.user.club, club = CL(uid), out = [];
    for (let w = c.week; w <= c.lastWeek && out.length < n; w++) {
      for (const cup of c.cups) { const k = cup.weeks.indexOf(w); if (k >= 0 && cup.rounds[k]) for (const t of cup.rounds[k]) if (t.h === uid || t.a === uid) out.push({ comp: cup.id, h: t.h, a: t.a, week: w, res: t.hg !== null ? [t.hg, t.ag] : null, round: cup.roundNames[k] }); }
      const lr = c.fixtures[club.league][w];
      const m = lr && lr.find(([h, a]) => h === uid || a === uid);
      if (m) { const r = c.results[club.league][w].find(x => x.h === m[0] && x.a === m[1]); out.push({ comp: club.league, h: m[0], a: m[1], week: w, res: r ? [r.hg, r.ag] : null }); }
    }
    return out.slice(0, n);
  };

  G.compName = id => { const L = G.leagueOf(id); if (L) return L.name; const cup = CUPS.find(c => c.id === id); return cup ? cup.name : id; };

  // ------------------------------------------------------------------ tablas
  G.table = function (lid) {
    const c = C(), rows = {};
    for (const id of c.world.leagues[lid].clubs) rows[id] = { id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] };
    for (const round of c.results[lid]) for (const r of round) {
      const h = rows[r.h], a = rows[r.a];
      h.p++; a.p++; h.gf += r.hg; h.ga += r.ag; a.gf += r.ag; a.ga += r.hg;
      if (r.hg > r.ag) { h.w++; a.l++; h.pts += 3; h.form.push('V'); a.form.push('D'); }
      else if (r.hg < r.ag) { a.w++; h.l++; a.pts += 3; h.form.push('D'); a.form.push('V'); }
      else { h.d++; a.d++; h.pts++; a.pts++; h.form.push('E'); a.form.push('E'); }
    }
    return Object.values(rows).sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || CL(y.id).rep - CL(x.id).rep);
  };
  G.position = (lid, cid) => G.table(lid).findIndex(r => r.id === cid) + 1;

  // ------------------------------------------------------------------ simulación rápida
  function poisson(l) { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= R(); } while (p > L); return k - 1; }

  function quickMatch(hid, aid, neutral) {
    const h = CL(hid), a = CL(aid);
    const sh = G.teamStrength(h) + (neutral ? 0 : 1.6), sa = G.teamStrength(a);
    const d = sh - sa;
    const lh = clamp(1.42 * Math.exp(d * 0.04), 0.3, 3.4), la = clamp(1.18 * Math.exp(-d * 0.04), 0.2, 3.4);
    const hg = poisson(lh), ag = poisson(la);
    const res = { hg, ag, players: [], events: [] };
    const make = (club, gf, ga, side) => {
      const xi = G.autoLineup(club).map(P);
      const avg = xi.reduce((s, p) => s + p.ovr, 0) / xi.length;
      const scorers = [], assists = [];
      const wS = p => ({ DC: 3.2, EI: 2.4, ED: 2.4, MCO: 2, MC: 1, MCD: .45, LD: .4, LI: .4, DFC: .55, POR: 0 }[p.pos]) * Math.pow(p.att.sho / 70, 1.6);
      const wA = p => ({ DC: 1.5, EI: 2.6, ED: 2.6, MCO: 3, MC: 2, MCD: .8, LD: 1.2, LI: 1.2, DFC: .3, POR: .05 }[p.pos]) * Math.pow(p.att.pas / 70, 2);
      const wpick = (arr, wf, excl) => { const ws = arr.map(p => p === excl ? 0 : wf(p)); const t = ws.reduce((a, b) => a + b, 0); let r = R() * t; for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; } return arr[0]; };
      for (let g = 0; g < gf; g++) {
        const sc = wpick(xi, wS); scorers.push(sc);
        const as = R() < 0.72 ? wpick(xi, wA, sc) : null; if (as) assists.push(as);
        res.events.push({ min: rnd(1, 90), type: 'goal', side, pid: sc.id, aid: as && as.id });
      }
      for (const p of xi) {
        let rt = 6.4 + (gf - ga) * 0.22 + (p.ovr - avg) * 0.03 + (R() - .5) * 1.2;
        const g = scorers.filter(x => x === p).length, as = assists.filter(x => x === p).length;
        rt += g * 1.0 + as * 0.6;
        if (ga === 0 && ['POR', 'DFC', 'LD', 'LI'].includes(p.pos)) rt += 0.5;
        res.players.push({ id: p.id, side, rating: clamp(Math.round(rt * 10) / 10, 4, 10), g, a: as, mins: 90 });
      }
    };
    make(h, hg, ag, 0); make(a, ag, hg, 1);
    res.events.sort((x, y) => x.min - y.min);
    return res;
  }
  G.quickMatch = quickMatch;

  // Aplica a los jugadores el resultado de un partido (de cualquier origen).
  function applyResult(hid, aid, res, comp) {
    const c = C();
    let best = null;
    for (const pr of res.players) {
      const p = P(pr.id); if (!p) continue;
      p.st.ap++; p.st.g += pr.g || 0; p.st.a += pr.a || 0; p.st.rt += pr.rating;
      p.career.ap++; p.career.g += pr.g || 0; p.career.a += pr.a || 0;
      p.form = Math.round((p.form * 0.6 + pr.rating * 0.4) * 10) / 10;
      p.played = true;
      const ga = pr.side === 0 ? res.ag : res.hg;
      if (p.pos === 'POR' && ga === 0 && (pr.mins || 90) >= 60) p.st.cs++;
      if (pr.yc) p.st.yc += pr.yc;
      if (pr.red) p.susp = 1;
      // Cansancio del partido
      p.fit = Math.max(30, p.fit - (pr.mins || 90) / 90 * (16 - p.att.phy / 12));
      if (pr.inj || R() < 0.012) { p.inj = rnd(1, 6); if (CL(p.club) && p.club === c.user.club) inbox('Servicios médicos', G.fullName(p) + ' estará de baja', 'Lesión durante el partido. Tiempo estimado de baja: ' + p.inj + ' semana' + (p.inj > 1 ? 's' : '') + '.', 'medico'); }
      if (!best || pr.rating > best.rating) best = pr;
      if (p.club === c.user.club) p.morale = clamp(p.morale + (pr.rating >= 7 ? 3 : pr.rating < 5.8 ? -3 : 0) + 2, 0, 100);
    }
    if (best) P(best.id).st.mvp++;
    // Moral según resultado
    for (const [cid, gf, ga] of [[hid, res.hg, res.ag], [aid, res.ag, res.hg]]) {
      const club = CL(cid);
      const d = gf > ga ? 5 : gf < ga ? -6 : 0;
      for (const id of club.players) { const p = P(id); p.morale = clamp(p.morale + d * 0.6 + (p.played ? 0 : -1.2), 5, 100); }
    }
    for (const pr of res.players) { const p = P(pr.id); if (p) p.played = false; }
  }

  // ------------------------------------------------------------------ bandeja de entrada
  function inbox(from, subject, body, kind, extra) {
    const c = C();
    const msg = { id: Date.now() + R(), from, subject, body, kind: kind || 'info', week: c.week, season: c.season, read: false, ...extra };
    c.inbox.unshift(msg);
    if (c.inbox.length > 80) c.inbox.length = 80;
    return msg;
  }
  G.inbox = inbox;
  function news(title, body, kind) {
    const c = C();
    c.news.unshift({ title, body, kind: kind || 'liga', week: c.week, season: c.season });
    if (c.news.length > 60) c.news.length = 60;
  }
  G.news = news;

  // ------------------------------------------------------------------ nueva carrera
  G.newCareer = function (clubId, managerName, seed) {
    const c = G.C;
    c.user = { club: clubId, name: managerName || 'Míster', rep: 50, history: [], trophies: [], sackings: 0 };
    const club = CL(clubId);
    c.season = 2027; c.week = 0;
    c.inbox = []; c.news = []; c.transfers = []; c.awards = []; c.decisions = []; c.scouting = { missions: [], found: [] };
    c.training = { focus: 'equilibrado', intensity: 2, history: [] };
    c.board = { conf: 65 };
    c.fin = { balance: Math.round(club.budget * 1.6 * 10) / 10, history: [], income: 0, expense: 0 };
    club.wageBudget = Math.round(club.players.reduce((s, id) => s + P(id).wage, 0) * 1.12);
    c.youth = [];
    for (let i = 0; i < 6; i++) c.youth.push(makeYouth(club));
    G.newSeasonSchedule();
    setObjective();
    club.lineup = G.autoLineup(club); club.bench = G.autoBench(club, club.lineup);
    inbox('Presidente', 'Bienvenido a ' + club.name, 'Toda la directiva le da la bienvenida, míster ' + c.user.name + '. Nuestro objetivo esta temporada: ' + c.board.objective.text + '. Dispone de ' + G.fmtMoney(club.budget) + ' para fichajes.', 'directiva');
    inbox('Director deportivo', 'Mercado de verano abierto', 'El mercado de fichajes está abierto hasta la jornada 4. Puede buscar jugadores en Traspasos o enviar ojeadores desde Ojeo.', 'mercado');
    inbox('Preparador físico', 'Plan de entrenamiento', 'Revise el plan semanal en Entrenamiento. Las sesiones intensas mejoran a los jóvenes pero aumentan el riesgo de lesión.', 'entreno');
    news(club.name + ' presenta a su nuevo entrenador', 'El club confía en ' + c.user.name + ' para una temporada en la que el objetivo es ' + c.board.objective.text.toLowerCase() + '.', 'club');
  };

  function setObjective() {
    const c = C(), club = CL(c.user.club);
    const ranked = c.world.leagues[club.league].clubs.slice().sort((a, b) => G.teamStrength(CL(b)) - G.teamStrength(CL(a)));
    const r = ranked.indexOf(club.id) + 1;
    const n = ranked.length;
    let target, text;
    if (r <= 1) { target = 1; text = 'Ganar la liga'; }
    else if (r <= 3) { target = 3; text = 'Terminar entre los 3 primeros'; }
    else if (r <= 6) { target = 6; text = 'Clasificar entre los 6 primeros'; }
    else if (r <= 10) { target = 10; text = 'Terminar en la mitad alta'; }
    else if (r <= n - 5) { target = n - 4; text = 'Asentarse en mitad de tabla'; }
    else { target = n - 3; text = 'Evitar los puestos de descenso'; }
    c.board.objective = { target, text, expected: r };
  }

  function makeYouth(club) {
    const L = G.leagueOf(club.league);
    const pos = pick(G.SQUAD_TEMPLATE);
    const nat = R() < 0.8 ? L.nat : pick(Object.keys(G.NATIONS));
    const p = G.makePlayer(nat, pos, rnd(44, 58) + Math.round((club.rep - 65) / 6), rnd(15, 17), { wonderkid: R() < 0.12 });
    p.contract = 3; p.youth = true; p.club = null;
    G.C.world.players[p.id] = p;
    return p.id;
  }
  G.makeYouth = makeYouth;

  // ------------------------------------------------------------------ jugar la semana
  // userResults: [{fx, res}] resultados de los partidos del usuario ya jugados.
  G.playUserMatch = function (fx, res) {
    const c = C();
    if (G.LEAGUES.some(l => l.id === fx.comp)) {
      c.results[fx.comp][c.week].push({ h: fx.h, a: fx.a, hg: res.hg, ag: res.ag, ev: res.events, user: true });
    } else {
      const t = fx.tie;
      const cup = c.cups.find(x => x.id === fx.comp);
      const real = cup.rounds[cup.weeks.indexOf(c.week)].find(x => x.h === fx.h && x.a === fx.a);
      real.hg = res.hg; real.ag = res.ag; real.ev = res.events;
      if (res.hg === res.ag) real.pen = res.pen || G.penaltyShootout(sideFor(CL(fx.h)), sideFor(CL(fx.a)));
      real.winner = winnerOf(real);
    }
    applyResult(fx.h, fx.a, res, fx.comp);
    const uid = c.user.club;
    const gf = fx.h === uid ? res.hg : res.ag, ga = fx.h === uid ? res.ag : res.hg;
    c.user.lastResult = { gf, ga, opp: fx.h === uid ? fx.a : fx.h, comp: fx.comp };
    c.board.conf = clamp(c.board.conf + (gf > ga ? 2.5 : gf < ga ? -3 : 0) + (gf - ga) * 0.3, 0, 100);
    CL(uid).fans = clamp((CL(uid).fans || 60) + (gf > ga ? 2 : gf < ga ? -2 : 0), 0, 100);
    if (c.pendingPress && c.pendingPress.fx === fx.comp + fx.h + fx.a) resolvePress(gf, ga);
    // Ingresos de taquilla
    if (fx.h === uid) { const club = CL(uid); const gate = club.capacity * (0.6 + club.fans / 250) * (35 + club.rep * 0.6) / 1e6; c.fin.balance += gate; c.fin.income += gate; }
  };

  function sideFor(club) { return { xi: G.autoLineup(club).map(P) }; }
  function winnerOf(t) { if (t.hg > t.ag) return t.h; if (t.ag > t.hg) return t.a; return t.pen[0] > t.pen[1] ? t.h : t.a; }

  G.advanceWeek = function () {
    const c = C(), w = c.week, uid = c.user.club;
    const summary = { results: [], userGames: [] };
    // Ligas
    for (const L of G.LEAGUES) {
      const round = c.fixtures[L.id][w];
      if (!round) continue;
      for (const [h, a] of round) {
        if (c.results[L.id][w].some(r => r.h === h && r.a === a)) continue;
        const res = quickMatch(h, a);
        c.results[L.id][w].push({ h, a, hg: res.hg, ag: res.ag });
        applyResult(h, a, res, L.id);
      }
    }
    // Copas
    for (const cup of c.cups) {
      const k = cup.weeks.indexOf(w);
      if (k < 0 || !cup.rounds[k]) continue;
      for (const t of cup.rounds[k]) {
        if (t.hg === null) {
          const res = quickMatch(t.h, t.a, k === cup.weeks.length - 1);
          t.hg = res.hg; t.ag = res.ag; t.ev = res.events;
          if (t.hg === t.ag) t.pen = G.penaltyShootout(sideFor(CL(t.h)), sideFor(CL(t.a)));
          t.winner = winnerOf(t);
          applyResult(t.h, t.a, res, cup.id);
        }
      }
      const winners = cup.rounds[k].map(t => t.winner);
      for (const t of cup.rounds[k]) { const loser = t.winner === t.h ? t.a : t.h; cup.alive = cup.alive.filter(x => x !== loser); if (loser === uid) inbox('Prensa', 'Eliminados de la ' + cup.name, 'El equipo cae en ' + cup.roundNames[k].toLowerCase() + ' ante ' + CL(t.winner).name + '.', 'prensa'); }
      if (winners.length === 1) {
        cup.champion = winners[0];
        CL(winners[0]).trophies.push({ name: cup.name, season: c.season });
        news(CL(winners[0]).name + ' gana la ' + cup.name, 'Final: ' + CL(cup.rounds[k][0].h).name + ' ' + cup.rounds[k][0].hg + '-' + cup.rounds[k][0].ag + ' ' + CL(cup.rounds[k][0].a).name + (cup.rounds[k][0].pen ? ' (penaltis ' + cup.rounds[k][0].pen.join('-') + ')' : '') + '.', 'copa');
        if (winners[0] === uid) { c.user.trophies.push({ name: cup.name, season: c.season }); c.board.conf = clamp(c.board.conf + 20, 0, 100); c.fin.balance += cup.prize; c.fin.income += cup.prize; for (const id of CL(uid).players) P(id).trophies.push(cup.name + ' ' + c.season); }
      } else {
        const next = [];
        const sh = winners.slice().sort(() => R() - .5);
        for (let i = 0; i < sh.length; i += 2) next.push({ h: sh[i], a: sh[i + 1], hg: null, ag: null });
        cup.rounds[k + 1] = next;
        if (next.some(t => t.h === uid || t.a === uid)) {
          const t = next.find(t => t.h === uid || t.a === uid);
          inbox('Director deportivo', 'Sorteo de la ' + cup.name, 'Próxima ronda (' + cup.roundNames[k + 1].toLowerCase() + '): ' + CL(t.h).name + ' vs ' + CL(t.a).name + ' en la semana ' + (cup.weeks[k + 1] + 1) + '.', 'copa');
        }
      }
    }
    weeklyTraining();
    weeklyRecovery();
    weeklyFinances();
    weeklyTransfers();
    weeklyScouting();
    weeklyDecisions();
    weeklyNews(w);
    // Suspensiones
    for (const id in c.world.players) { const p = c.world.players[id]; if (p.susp && !p.suspNew) p.susp = 0; p.suspNew = false; }
    c.week++;
    if (c.week > c.lastWeek) return G.endSeason();
    if (c.week === 18) inbox('Director deportivo', 'Mercado de invierno abierto', 'El mercado de invierno está abierto hasta la jornada 22.', 'mercado');
    if (c.week === 4) inbox('Director deportivo', 'Cierre del mercado', 'Se ha cerrado el mercado de verano. Solo se pueden fichar agentes libres hasta enero.', 'mercado');
    return summary;
  };

  // ------------------------------------------------------------------ entrenamiento
  function weeklyTraining() {
    const c = C(), uid = c.user.club;
    const T = G.TRAINING_FOCUS[c.training.focus];
    const inten = c.training.intensity; // 1 suave, 2 normal, 3 intensa
    const userClub = CL(uid);
    for (const id in c.world.players) {
      const p = c.world.players[id];
      if (!p.club && !p.youth) continue;
      const mine = p.club === uid || (p.youth && c.youth.includes(p.id));
      let growth = p.age <= 20 ? 0.16 : p.age <= 23 ? 0.11 : p.age <= 27 ? 0.05 : p.age <= 30 ? 0.015 : 0;
      if (p.ovr >= p.pot) growth *= 0.1;
      if (p.traits.includes('Profesional')) growth *= 1.25;
      let decline = p.age >= 31 ? 0.02 + (p.age - 31) * 0.018 : 0;
      if (mine) {
        if (c.training.focus === 'descanso') growth *= 0.3; else growth *= 0.6 + inten * 0.25;
        if (p.st.ap > 0 && p.lastWeekPlayed !== false) growth *= 1.15;
        decline *= c.training.focus === 'fisico' ? 0.6 : 1;
      }
      if (p.inj) growth *= 0.2;
      if (R() < growth) {
        let pool = mine && T.attrs.length ? T.attrs.filter(a => p.pos === 'POR' ? true : a !== 'gk') : Object.keys(G.POS_WEIGHTS[p.pos]);
        if (mine && p.focus && R() < 0.6) pool = [p.focus];
        if (!pool.length) pool = Object.keys(G.POS_WEIGHTS[p.pos]);
        const k = pick(pool);
        if (p.att[k] < 99) { p.att[k]++; if (mine && R() < 0.5 && p.att[k] < 99) p.att[k]++; }
        recompute(p);
      }
      if (R() < decline) { const k = pick(['pac', 'phy', p.pos === 'POR' ? 'gk' : 'pac']); p.att[k] = Math.max(20, p.att[k] - 1); recompute(p); }
    }
    // Química, forma física y moral del equipo del usuario
    const f = c.training.focus;
    userClub.chem = clamp(userClub.chem + (f === 'tactico' ? 4 : f === 'posesion' ? 2.5 : 0.8) - (c.formationChanged ? 3 : 0), 20, 100);
    c.formationChanged = false;
    for (const id of userClub.players) {
      const p = P(id);
      const fatigue = f === 'descanso' ? -14 : f === 'fisico' ? 6 + inten * 2 : (inten - 1) * 4;
      p.fit = clamp(p.fit - fatigue, 30, 100);
      if (f !== 'descanso' && !p.inj && R() < 0.003 * inten * inten * (p.fit < 70 ? 2 : 1)) { p.inj = rnd(1, 3); inbox('Servicios médicos', G.fullName(p) + ' se lesiona entrenando', 'Molestias musculares en la sesión de esta semana. Baja estimada: ' + p.inj + ' semana(s).', 'medico'); }
      if (f === 'ataque' && G.POS_GROUP[p.pos] === 'DEL') p.morale = clamp(p.morale + 2, 0, 100);
      if (f === 'descanso') p.morale = clamp(p.morale + 1, 0, 100);
      if (inten === 3) p.morale = clamp(p.morale - 0.8, 0, 100);
    }
    c.training.history.push({ week: c.week, focus: f, intensity: inten });
  }

  function recompute(p) {
    const old = p.ovr;
    p.ovr = G.calcOvr(p.att, p.pos);
    if (p.ovr > p.pot) p.pot = p.ovr;
    p.value = G.calcValue(p);
    if (p.ovr > old && p.club === G.C.user.club && p.ovr >= 70 && (p.ovr % 2 === 0)) news(G.fullName(p) + ' sigue creciendo', 'El ' + G.POS_NAME[p.pos].toLowerCase() + ' sube a ' + p.ovr + ' de media gracias al trabajo semanal.', 'club');
  }
  G.recompute = recompute;

  function weeklyRecovery() {
    const c = C();
    for (const id in c.world.players) {
      const p = c.world.players[id];
      if (p.club !== c.user.club) p.fit = clamp(p.fit + 18 + p.att.phy / 15, 0, 100);
      else p.fit = clamp(p.fit + 14 + p.att.phy / 20, 0, 100);
      if (p.inj) { p.inj--; if (!p.inj && p.club === c.user.club) inbox('Servicios médicos', G.fullName(p) + ' recibe el alta', 'Ya está disponible para jugar.', 'medico'); }
      if (p.club === c.user.club) p.morale = clamp(p.morale + (70 - p.morale) * 0.05, 0, 100);
    }
  }

  function weeklyFinances() {
    const c = C(), club = CL(c.user.club);
    const wages = club.players.reduce((s, id) => s + P(id).wage, 0) / 1000; // M€
    const tv = Math.pow(10, (club.rep - 50) / 30) * 0.45;
    const comm = Math.pow(10, (club.rep - 50) / 28) * 0.2;
    c.fin.balance += tv + comm - wages;
    c.fin.income += tv + comm; c.fin.expense += wages;
    c.fin.history.push(Math.round(c.fin.balance * 10) / 10);
    if (c.fin.history.length > 60) c.fin.history.shift();
    if (c.fin.balance < -20 && c.week % 4 === 0) { c.board.conf = clamp(c.board.conf - 4, 0, 100); inbox('Presidente', 'Preocupación por las cuentas', 'El club está en números rojos (' + G.fmtMoney(c.fin.balance) + '). Reduzca la masa salarial o venda jugadores.', 'directiva'); }
  }

  // ------------------------------------------------------------------ mercado
  G.askingPrice = function (p) {
    const club = CL(p.club);
    if (!club) return 0;
    const rankInSquad = club.players.map(P).sort((a, b) => b.ovr - a.ovr).indexOf(p);
    let f = 1.15 + (rankInSquad < 3 ? 0.35 : rankInSquad < 11 ? 0.15 : -0.1) + (p.contract >= 4 ? 0.15 : p.contract <= 1 ? -0.3 : 0);
    if (p.listed) f -= 0.25;
    return Math.max(0.1, Math.round(p.value * f * 10) / 10);
  };

  // Negociación con el club vendedor. Devuelve {ok, msg, counter}
  G.makeOffer = function (pid, amount) {
    const c = C(), p = P(pid), buyer = CL(c.user.club);
    if (!G.isWindowOpen() && p.club) return { ok: false, msg: 'El mercado está cerrado. Vuelve a abrir en la jornada 19.' };
    if (amount > buyer.budget) return { ok: false, msg: 'No tienes presupuesto suficiente (' + G.fmtMoney(buyer.budget) + ').' };
    const ask = G.askingPrice(p);
    if (amount >= ask) return { ok: true, msg: CL(p.club).name + ' acepta la oferta. Ahora negocia el contrato con el jugador.' };
    if (amount >= ask * 0.85) return { ok: false, counter: Math.round(ask * 10) / 10, msg: CL(p.club).name + ' pide ' + G.fmtMoney(ask) + '.' };
    return { ok: false, msg: CL(p.club).name + ' rechaza la oferta: está muy lejos de lo que piden.' };
  };

  // Negociación con el jugador. wage en miles €/semana.
  G.playerAccepts = function (pid, wage, years, role) {
    const c = C(), p = P(pid), buyer = CL(c.user.club);
    const from = p.club ? CL(p.club) : null;
    const repGap = (from ? from.rep : 55) - buyer.rep;
    let want = p.wage * (1.1 + Math.max(0, repGap) * 0.04) * (role === 'estrella' ? 1.25 : role === 'rotacion' ? 0.95 : 1.05);
    if (p.age > 31 && years > 2) want *= 1.1;
    const wageRoom = buyer.wageBudget - buyer.players.reduce((s, id) => s + P(id).wage, 0);
    if (wage > wageRoom) return { ok: false, msg: 'Supera tu límite salarial (te quedan ' + G.fmtWage(Math.max(0, wageRoom)) + ').' };
    if (repGap > 18) return { ok: false, msg: G.fullName(p) + ' no quiere bajar tanto de nivel de club.' };
    if (role === 'estrella' && G.squadOvr(buyer) > p.ovr + 4) return { ok: false, msg: 'El agente no se cree que vaya a ser titular indiscutible.' };
    if (wage >= want) return { ok: true, msg: G.fullName(p) + ' acepta: ' + G.fmtWage(wage) + ', ' + years + ' años.' };
    return { ok: false, counter: Math.ceil(want), msg: 'El agente pide al menos ' + G.fmtWage(Math.ceil(want)) + '.' };
  };

  G.completeTransfer = function (pid, fee, wage, years, toId) {
    const c = C(), p = P(pid);
    const from = p.club ? CL(p.club) : null, to = CL(toId);
    if (from) { from.players = from.players.filter(x => x !== pid); from.budget += fee; if (from.lineup) from.lineup = from.lineup.filter(x => x !== pid); }
    else c.world.freeAgents = c.world.freeAgents.filter(x => x !== pid);
    to.players.push(pid); to.budget -= fee;
    if (to.lineup && to.id !== c.user.club) to.lineup = null;
    p.club = toId; p.wage = wage; p.contract = years; p.listed = false; p.morale = 80; p.num = 0;
    G.assignNumbers(c.world, to);
    if (from && from.id === c.user.club) { c.fin.balance += fee; c.fin.income += fee; }
    if (toId === c.user.club) { c.fin.balance -= fee; c.fin.expense += fee; }
    c.transfers.unshift({ pid, name: G.fullName(p), pos: p.pos, ovr: p.ovr, from: from ? from.id : null, to: toId, fee, week: c.week, season: c.season });
    if (c.transfers.length > 150) c.transfers.length = 150;
    const big = fee >= 25 || toId === c.user.club || (from && from.id === c.user.club);
    if (big) news((toId === c.user.club ? 'OFICIAL: ' : '') + G.fullName(p) + ' ficha por ' + to.name, (from ? 'Llega desde ' + from.name + ' por ' + G.fmtMoney(fee) : 'Llega con la carta de libertad') + '. Contrato de ' + years + ' años.', 'fichaje');
    if (from && from.id === c.user.club && from.lineup) from.bench = (from.bench || []).filter(x => x !== pid);
  };

  G.renewContract = function (pid, wage, years) {
    const p = P(pid);
    const want = Math.ceil(p.wage * (p.ovr >= 80 ? 1.25 : 1.1) * (p.morale < 50 ? 1.2 : 1));
    if (p.age >= 34 && years > 1) return { ok: false, msg: 'A su edad solo acepta 1 año.' };
    if (wage < want) return { ok: false, counter: want, msg: 'Pide ' + G.fmtWage(want) + '.' };
    p.wage = wage; p.contract = years; p.morale = clamp(p.morale + 10, 0, 100);
    return { ok: true, msg: G.fullName(p) + ' renueva hasta ' + (C().season + years) + '.' };
  };

  G.releasePlayer = function (pid) {
    const c = C(), p = P(pid), club = CL(p.club);
    const cost = p.wage * 52 * p.contract / 1000 * 0.5;
    club.players = club.players.filter(x => x !== pid);
    if (club.lineup) club.lineup = club.lineup.filter(x => x !== pid);
    p.club = null; c.world.freeAgents.push(pid);
    c.fin.balance -= cost; c.fin.expense += cost;
    return cost;
  };

  function weeklyTransfers() {
    const c = C(), uid = c.user.club, user = CL(uid);
    if (!G.isWindowOpen()) return;
    // Ofertas por jugadores del usuario
    const mine = user.players.map(P);
    for (const p of mine) {
      const interest = (p.listed ? 0.35 : 0.025) * (p.ovr >= 78 ? 1.5 : 1);
      if (R() > interest) continue;
      const buyers = Object.values(c.world.clubs).filter(cl => cl.id !== uid && cl.rep >= p.ovr - 12 && cl.budget > p.value * 0.8);
      if (!buyers.length) continue;
      const b = pick(buyers);
      const fee = Math.round(p.value * (p.listed ? 0.8 + R() * 0.3 : 1.05 + R() * 0.4) * 10) / 10;
      if (c.inbox.some(m => m.kind === 'oferta' && m.pid === p.id && !m.done)) continue;
      inbox('Director deportivo', 'Oferta de ' + b.name + ' por ' + G.shortName(p), b.name + ' ofrece ' + G.fmtMoney(fee) + ' por ' + G.fullName(p) + ' (' + p.ovr + ', ' + p.pos + '). Valor de mercado: ' + G.fmtMoney(p.value) + '.', 'oferta', { pid: p.id, buyer: b.id, fee, choices: ['Aceptar', 'Pedir más', 'Rechazar'] });
    }
    // Movimientos entre clubes de la IA
    const n = c.week <= 3 ? 14 : 7;
    const all = Object.values(c.world.clubs).filter(cl => cl.id !== uid);
    for (let i = 0; i < n; i++) {
      const buyer = pick(all);
      const need = needPosition(buyer);
      const targets = Object.values(c.world.players).filter(p => p.club && p.club !== buyer.id && p.club !== uid && p.pos === need && p.ovr > G.squadOvr(buyer) - 2 && p.ovr < buyer.rep + 6 && CL(p.club).rep < buyer.rep + 4 && p.value < buyer.budget);
      if (!targets.length) continue;
      const p = pick(targets);
      const fee = Math.round(G.askingPrice(p) * 10) / 10;
      if (fee > buyer.budget) continue;
      const seller = CL(p.club);
      if (seller.players.length <= 20) continue;
      G.completeTransfer(p.id, fee, Math.round(p.wage * 1.15), rnd(2, 5), buyer.id);
      if (buyer.players.length > 28) { const worst = buyer.players.map(P).filter(x => x.pos === need).sort((a, b) => a.ovr - b.ovr)[0]; if (worst && worst.id !== p.id) { G.releasePlayerAI(worst.id); } }
    }
    // Agentes libres firmados por la IA
    for (const pid of c.world.freeAgents.slice()) {
      if (R() > 0.05) continue;
      const p = P(pid);
      const club = pick(all.filter(cl => cl.players.length < 26 && cl.rep < p.ovr + 12));
      if (club) G.completeTransfer(pid, 0, p.wage, rnd(1, 2), club.id);
    }
  }
  G.releasePlayerAI = function (pid) {
    const c = C(), p = P(pid), club = CL(p.club);
    club.players = club.players.filter(x => x !== pid); p.club = null; c.world.freeAgents.push(pid);
  };

  function needPosition(club) {
    const counts = {}; for (const pos of G.SQUAD_TEMPLATE) counts[pos] = (counts[pos] || 0) + 1;
    const have = {}; for (const id of club.players) { const p = P(id); have[p.pos] = (have[p.pos] || 0) + 1; }
    let worst = null, wv = 99;
    for (const pos in counts) {
      const best = club.players.map(P).filter(p => p.pos === pos).sort((a, b) => b.ovr - a.ovr)[0];
      const v = (best ? best.ovr : 0) - club.rep + ((have[pos] || 0) - counts[pos]) * 3 + R() * 6;
      if (v < wv) { wv = v; worst = pos; }
    }
    return worst;
  }

  G.answerOffer = function (msg, choice) {
    const c = C(), p = P(msg.pid);
    msg.done = true; msg.read = true;
    if (!p || p.club !== c.user.club) return 'El jugador ya no está en el club.';
    if (choice === 'Aceptar') {
      G.completeTransfer(p.id, msg.fee, Math.round(p.wage * 1.2), rnd(2, 5), msg.buyer);
      CL(c.user.club).budget += 0; // la venta ya suma al presupuesto en completeTransfer
      return 'Traspaso cerrado: ' + G.fullName(p) + ' se marcha por ' + G.fmtMoney(msg.fee) + '.';
    }
    if (choice === 'Pedir más') {
      if (R() < 0.5) {
        const fee = Math.round(msg.fee * (1.1 + R() * 0.15) * 10) / 10;
        G.completeTransfer(p.id, fee, Math.round(p.wage * 1.2), rnd(2, 5), msg.buyer);
        return CL(msg.buyer).name + ' acepta pagar ' + G.fmtMoney(fee) + '. ' + G.fullName(p) + ' se marcha.';
      }
      return CL(msg.buyer).name + ' se retira de la negociación.';
    }
    if (p.ovr >= 75 && !p.listed) p.morale = clamp(p.morale - 6, 0, 100);
    return 'Oferta rechazada.';
  };

  // ------------------------------------------------------------------ ojeo
  G.REGIONS = { EU: { name: 'Europa', nats: ['ESP', 'ENG', 'ITA', 'GER', 'FRA', 'POR', 'NED', 'BEL', 'CRO'] }, SA: { name: 'Sudamérica', nats: ['BRA', 'ARG', 'URU', 'COL'] }, AF: { name: 'África', nats: ['NGA', 'SEN', 'MAR', 'CIV'] }, AS: { name: 'Asia y Norteamérica', nats: ['JPN', 'USA', 'MEX'] } };
  G.sendScout = function (region, pos, profile) {
    const c = C();
    if (c.scouting.missions.length >= 3) return 'Ya tienes 3 ojeadores trabajando.';
    c.scouting.missions.push({ region, pos, profile, weeks: 3 });
    return 'Ojeador enviado a ' + G.REGIONS[region].name + '. Informe en 3 semanas.';
  };
  function weeklyScouting() {
    const c = C();
    for (const m of c.scouting.missions) {
      m.weeks--;
      if (m.weeks > 0) continue;
      const nats = G.REGIONS[m.region].nats;
      let pool = Object.values(c.world.players).filter(p => nats.includes(p.nat) && p.club !== c.user.club && (!m.pos || m.pos === 'ALL' || p.pos === m.pos));
      if (m.profile === 'joven') pool = pool.filter(p => p.age <= 21).sort((a, b) => b.pot - a.pot);
      else if (m.profile === 'barato') pool = pool.filter(p => p.value < CL(c.user.club).budget * 0.5).sort((a, b) => b.ovr - a.ovr);
      else pool.sort((a, b) => b.ovr - a.ovr);
      const found = pool.slice(0, 25).sort(() => R() - .5).slice(0, 5);
      for (const p of found) { p.scouted = true; if (!c.scouting.found.includes(p.id)) c.scouting.found.unshift(p.id); }
      inbox('Ojeador jefe', 'Informe: ' + found.length + ' jugadores recomendados', 'Hemos seguido a varios jugadores en ' + G.REGIONS[m.region].name + ': ' + found.map(p => G.shortName(p) + ' (' + p.pos + ', ' + p.age + ' años, POT ' + p.pot + ')').join('; ') + '.', 'ojeo');
    }
    c.scouting.missions = c.scouting.missions.filter(m => m.weeks > 0);
  }
  // Potencial visible: exacto si es tuyo u ojeado; rango si no.
  G.potText = p => (p.club === C().user.club || p.scouted || C().youth.includes(p.id)) ? String(p.pot) : (Math.max(p.ovr, p.pot - 4 - (p.id % 3)) + '-' + Math.min(99, p.pot + 3 + (p.id % 4)));

  // ------------------------------------------------------------------ decisiones del entrenador
  const DECISIONS = [
    {
      id: 'prensa', when: c => !!G.nextUserFixture(),
      make: c => {
        const fx = G.nextUserFixture(); const opp = CL(fx.h === c.user.club ? fx.a : fx.h);
        return { from: 'Prensa', subject: 'Rueda de prensa antes de jugar contra ' + opp.name, body: 'Los periodistas preguntan: "¿Cómo ve el partido ante ' + opp.name + '?"', choices: ['Confío plenamente en ganar', 'Respeto al rival, será difícil', 'Mis jugadores están por encima'], data: { fx: fx.comp + fx.h + fx.a } };
      },
      resolve: (c, i, d) => { c.pendingPress = { choice: i, fx: d.fx }; return ['Titulares: el míster se muestra convencido de la victoria.', 'Mensaje prudente; el vestuario lo valora.', 'Tus palabras motivan al grupo, pero aumentan la presión.'][i]; }
    },
    {
      id: 'minutos', when: c => unhappyPlayer(c),
      make: c => { const p = unhappyPlayer(c); return { from: G.fullName(p), subject: 'Quiero jugar más', body: 'Míster, llevo semanas sin minutos y no estoy contento. Necesito saber qué piensa de mí.', choices: ['Te prometo más minutos', 'Tienes que ganarte el puesto', 'Te pondremos en venta'], data: { pid: p.id } }; },
      resolve: (c, i, d) => { const p = P(d.pid); if (!p) return ''; if (i === 0) { p.morale = clamp(p.morale + 20, 0, 100); p.promised = c.week + 4; return G.shortName(p) + ' agradece la confianza. Tiene que jugar en las próximas 4 semanas.'; } if (i === 1) { p.morale = clamp(p.morale - 8, 0, 100); if (p.traits.includes('Conflictivo')) CL(c.user.club).chem -= 4; return G.shortName(p) + ' acepta el reto a regañadientes.'; } p.listed = true; p.morale = clamp(p.morale - 15, 0, 100); return G.shortName(p) + ' queda en la lista de transferibles.'; }
    },
    {
      id: 'vestuario', when: c => CL(c.user.club).players.map(P).some(p => p.traits.includes('Conflictivo')) && R() < 0.5,
      make: c => { const p = CL(c.user.club).players.map(P).find(p => p.traits.includes('Conflictivo')); return { from: 'Capitán', subject: 'Tensión en el vestuario', body: G.fullName(p) + ' ha discutido con varios compañeros durante el entrenamiento.', choices: ['Multarle', 'Hablar con él en privado', 'Apartarle una semana'], data: { pid: p.id } }; },
      resolve: (c, i, d) => { const p = P(d.pid), club = CL(c.user.club); if (!p) return ''; if (i === 0) { p.morale -= 15; club.chem = clamp(club.chem + 4, 0, 100); return 'Multa impuesta. El vestuario respalda la decisión.'; } if (i === 1) { p.morale = clamp(p.morale + 5, 0, 100); club.chem = clamp(club.chem + 1, 0, 100); return 'Conversación tranquila. Parece que el ambiente mejora.'; } p.susp = 1; p.suspNew = true; club.chem = clamp(club.chem + 6, 0, 100); p.morale -= 20; return G.shortName(p) + ' no estará disponible esta semana.'; }
    },
    {
      id: 'gira', when: c => c.week === 1 || c.week === 17,
      make: c => ({ from: 'Director comercial', subject: 'Propuesta de gira de patrocinio', body: 'Un patrocinador ofrece 4 M€ por jugar un amistoso en el extranjero esta semana. Supone un viaje largo.', choices: ['Aceptar la gira', 'Rechazar'], data: {} }),
      resolve: (c, i) => { if (i === 0) { c.fin.balance += 4; c.fin.income += 4; for (const id of CL(c.user.club).players) P(id).fit = Math.max(40, P(id).fit - 12); c.board.conf = clamp(c.board.conf + 3, 0, 100); return 'Gira aceptada: +4 M€, pero la plantilla llega cansada.'; } return 'Gira rechazada. La plantilla descansa.'; }
    },
    {
      id: 'cantera', when: c => c.week % 9 === 4,
      make: c => { const id = makeYouth(CL(c.user.club)); const p = P(id); p.pot = Math.max(p.pot, 80 + rnd(0, 10)); p.scouted = true; return { from: 'Director de cantera', subject: 'Una joya en la cantera', body: G.fullName(p) + ' (' + p.age + ' años, ' + p.pos + ') destaca en el juvenil. Potencial estimado: ' + p.pot + '.', choices: ['Subirlo al primer equipo', 'Mantenerlo en la cantera', 'Cederlo a otro club'], data: { pid: id } }; },
      resolve: (c, i, d) => { const p = P(d.pid), club = CL(c.user.club); if (i === 0) { p.club = club.id; p.youth = false; club.players.push(p.id); p.wage = 2; G.assignNumbers(c.world, club); return G.shortName(p) + ' entrena ya con el primer equipo.'; } if (i === 1) { c.youth.push(p.id); return G.shortName(p) + ' sigue en la cantera.'; } p.age = p.age; p.att.pas += 1; c.youth.push(p.id); return 'Cesión acordada. Volverá con más experiencia.'; }
    },
    {
      id: 'directiva', when: c => c.board.conf < 45 && c.week > 6,
      make: c => ({ from: 'Presidente', subject: 'Reunión urgente con la directiva', body: 'Los resultados no acompañan (confianza: ' + Math.round(c.board.conf) + '%). ¿Qué propone?', choices: ['Pido tiempo, el proyecto va bien', 'Necesito refuerzos', 'Asumo la responsabilidad'], data: {} }),
      resolve: (c, i) => { if (i === 0) { c.board.conf = clamp(c.board.conf + (R() < 0.5 ? 6 : -4), 0, 100); return 'La directiva le concede algo de margen.'; } if (i === 1) { const club = CL(c.user.club); if (R() < 0.5) { club.budget += 8; return 'La directiva libera 8 M€ extra para fichajes.'; } c.board.conf -= 5; return 'La directiva se niega y le pide resultados ya.'; } c.board.conf = clamp(c.board.conf + 3, 0, 100); return 'Su honestidad gusta en el palco.'; }
    },
    {
      id: 'capitan', when: c => c.week === 0,
      make: c => { const ps = CL(c.user.club).players.map(P).sort((a, b) => (b.traits.includes('Líder') * 20 + b.ovr + b.age / 2) - (a.traits.includes('Líder') * 20 + a.ovr + a.age / 2)).slice(0, 3); return { from: 'Cuerpo técnico', subject: 'Elegir capitán', body: 'Hay que nombrar al capitán para esta temporada.', choices: ps.map(p => G.shortName(p) + ' (' + p.ovr + (p.traits.includes('Líder') ? ', Líder' : '') + ')'), data: { ids: ps.map(p => p.id) } }; },
      resolve: (c, i, d) => { const p = P(d.ids[i]), club = CL(c.user.club); club.captain = p.id; p.morale = clamp(p.morale + 15, 0, 100); club.chem = clamp(club.chem + (p.traits.includes('Líder') ? 8 : 3), 0, 100); return G.shortName(p) + ' llevará el brazalete.'; }
    },
    {
      id: 'aficion', when: c => c.user.lastResult && c.user.lastResult.gf < c.user.lastResult.ga && R() < 0.4,
      make: c => ({ from: 'Peña de aficionados', subject: 'La afición está molesta', body: 'Tras la última derrota, los aficionados piden explicaciones.', choices: ['Pedir disculpas públicamente', 'Defender a los jugadores', 'No hacer declaraciones'], data: {} }),
      resolve: (c, i) => { const club = CL(c.user.club); if (i === 0) { club.fans = clamp(club.fans + 6, 0, 100); return 'La afición agradece el gesto.'; } if (i === 1) { for (const id of club.players) P(id).morale = clamp(P(id).morale + 4, 0, 100); club.fans -= 2; return 'El vestuario se siente respaldado.'; } return 'Silencio en la sala de prensa.'; }
    },
    {
      id: 'lesion', when: c => CL(c.user.club).players.map(P).some(p => p.inj === 1 && p.ovr >= G.squadOvr(CL(c.user.club))),
      make: c => { const p = CL(c.user.club).players.map(P).find(p => p.inj === 1 && p.ovr >= G.squadOvr(CL(c.user.club))); return { from: 'Servicios médicos', subject: '¿Forzamos a ' + G.shortName(p) + '?', body: 'Está casi recuperado. Podría jugar esta semana con riesgo de recaída.', choices: ['Forzar y que juegue', 'Darle una semana más'], data: { pid: p.id } }; },
      resolve: (c, i, d) => { const p = P(d.pid); if (i === 0) { if (R() < 0.3) { p.inj = rnd(3, 6); return 'Recaída. ' + G.shortName(p) + ' estará fuera ' + p.inj + ' semanas.'; } p.inj = 0; p.fit = 75; return G.shortName(p) + ' recibe el alta anticipada.'; } return 'Seguirá con su recuperación.'; }
    }
  ];

  function unhappyPlayer(c) {
    const club = CL(c.user.club);
    if (c.week < 5) return null;
    return club.players.map(P).find(p => p.ovr >= G.squadOvr(club) - 2 && p.st.ap < c.week * 0.35 && !p.inj && p.morale < 60 && !p.listed && !p.promised) || null;
  }

  function weeklyDecisions() {
    const c = C();
    // Promesas incumplidas
    for (const id of CL(c.user.club).players) {
      const p = P(id);
      if (p.promised && c.week >= p.promised) { if (p.st.ap < 2 + (p.apAtPromise || 0)) { p.morale = clamp(p.morale - 30, 0, 100); inbox(G.fullName(p), 'No has cumplido tu promesa', 'Me prometiste minutos y no los he tenido. Quiero salir del club.', 'jugador'); p.listed = true; } p.promised = 0; }
    }
    const open = c.inbox.filter(m => m.kind === 'decision' && !m.done).length;
    if (open >= 2) return;
    const pool = DECISIONS.filter(d => { try { return d.when(c) && !c.inbox.some(m => m.decision === d.id && !m.done); } catch (e) { return false; } });
    if (!pool.length || R() > 0.75) return;
    const pri = pool.find(d => d.id === 'capitan' || d.id === 'cantera');
    const d = pri || pick(pool);
    const m = d.make(c);
    inbox(m.from, m.subject, m.body, 'decision', { decision: d.id, choices: m.choices, data: m.data });
  }

  G.answerDecision = function (msg, i) {
    const c = C();
    const d = DECISIONS.find(x => x.id === msg.decision);
    msg.done = true; msg.read = true; msg.answer = msg.choices[i];
    const txt = d ? d.resolve(c, i, msg.data || {}) : '';
    msg.outcome = txt;
    return txt;
  };

  // Antes del partido se puede dar una rueda de prensa; su efecto se aplica tras jugar.
  function resolvePress(gf, ga) {
    const c = C(), pp = c.pendingPress; c.pendingPress = null;
    const club = CL(c.user.club);
    const won = gf > ga, lost = gf < ga;
    let delta = 0;
    if (pp.choice === 0) delta = won ? 6 : lost ? -8 : -2;
    if (pp.choice === 1) delta = won ? 3 : lost ? 0 : 1;
    if (pp.choice === 2) delta = won ? 5 : lost ? -6 : 0;
    c.board.conf = clamp(c.board.conf + delta * 0.5, 0, 100);
    club.fans = clamp(club.fans + delta, 0, 100);
    for (const id of club.players) P(id).morale = clamp(P(id).morale + delta * 0.6, 0, 100);
  }
  G.pressMoraleBoost = () => { const pp = C().pendingPress; return pp ? [1.02, 1.0, 1.035][pp.choice] : 1; };

  // ------------------------------------------------------------------ noticias semanales
  function weeklyNews(w) {
    const c = C();
    // Resultado destacado de la liga del usuario
    const lid = CL(c.user.club).league;
    const res = c.results[lid][w] || [];
    const big = res.filter(r => !r.user).sort((a, b) => (Math.abs(b.hg - b.ag) + b.hg + b.ag) - (Math.abs(a.hg - a.ag) + a.hg + a.ag))[0];
    if (big && R() < 0.7) news(CL(big.h).name + ' ' + big.hg + '-' + big.ag + ' ' + CL(big.a).name, 'Resultado destacado de la jornada ' + (w + 1) + ' de ' + G.leagueOf(lid).name + '.', 'liga');
    const t = G.table(lid);
    if (w >= 5 && R() < 0.4) news(CL(t[0].id).name + ' lidera ' + G.leagueOf(lid).name, 'Suma ' + t[0].pts + ' puntos tras ' + t[0].p + ' jornadas, ' + (t[0].pts - t[1].pts) + ' más que ' + CL(t[1].id).name + '.', 'liga');
    // Pichichi
    if (w % 6 === 5) {
      const top = topScorers(lid, 1)[0];
      if (top) news(G.fullName(top) + ' manda en la tabla de goleadores', top.st.g + ' goles en ' + top.st.ap + ' partidos con ' + CL(top.club).name + '.', 'liga');
    }
  }

  function topScorers(lid, n) {
    const ids = lid ? C().world.leagues[lid].clubs : Object.keys(C().world.clubs).map(Number);
    const ps = [];
    for (const cid of ids) for (const id of CL(cid).players) ps.push(P(id));
    return ps.sort((a, b) => b.st.g - a.st.g || b.st.a - a.st.a).slice(0, n);
  }
  G.topScorers = topScorers;
  G.topBy = function (lid, key, n, minAp = 5) {
    const ids = lid ? C().world.leagues[lid].clubs : Object.keys(C().world.clubs).map(Number);
    const ps = [];
    for (const cid of ids) for (const id of CL(cid).players) { const p = P(id); if (p.st.ap >= minAp || key !== 'rt') ps.push(p); }
    const val = p => key === 'rt' ? (p.st.ap ? p.st.rt / p.st.ap : 0) : p.st[key];
    return ps.sort((a, b) => val(b) - val(a)).slice(0, n);
  };
  G.avgRating = p => p.st.ap ? Math.round(p.st.rt / p.st.ap * 100) / 100 : 0;

  // ------------------------------------------------------------------ fin de temporada
  G.endSeason = function () {
    const c = C(), uid = c.user.club, club = CL(uid);
    const summary = { season: c.season, champions: {}, awards: null };
    c.lastTables = {};
    for (const L of G.LEAGUES) {
      const t = G.table(L.id);
      c.lastTables[L.id] = t.map(r => ({ id: r.id, pts: r.pts }));
      const champ = CL(t[0].id);
      champ.trophies.push({ name: L.name, season: c.season });
      summary.champions[L.id] = champ.id;
      if (champ.id === uid) { c.user.trophies.push({ name: L.name, season: c.season }); for (const id of club.players) P(id).trophies.push(L.name + ' ' + c.season); }
      // Reputación de clubes según la posición
      t.forEach((r, i) => { const cl = CL(r.id); const exp = t.length * (1 - (cl.rep - L.rep + 12) / 24); cl.rep = clamp(Math.round(cl.rep + (exp - i) * 0.12), L.rep - 14, L.rep + 16); });
    }
    const pos = G.position(club.league, uid);
    const obj = c.board.objective;
    const delta = obj.target - pos;
    c.board.conf = clamp(c.board.conf + delta * 5 + (pos === 1 ? 15 : 0), 0, 100);
    const prize = Math.round((G.leagueOf(club.league).rep - 50) * (1 - (pos - 1) / 20) * 0.8 * 10) / 10;
    c.fin.balance += prize; c.fin.income += prize;
    summary.pos = pos; summary.objective = obj; summary.prize = prize;
    // Premios
    const awards = computeAwards(summary);
    c.awards.unshift(awards); summary.awards = awards;
    for (const k of ['balon', 'bota', 'guante', 'promesa']) { const a = awards[k]; if (a && a[0]) { const p = P(a[0].id); p.trophies.push(awards.names[k] + ' ' + c.season); if (p.club === uid) inbox('Prensa', G.fullName(p) + ' gana el ' + awards.names[k], 'Un premio individual para el club en la gala de fin de temporada.', 'premio'); } }
    if (awards.entrenador === uid) c.user.trophies.push({ name: 'Entrenador del Año', season: c.season });
    // Historial del entrenador
    c.user.history.unshift({ season: c.season, club: uid, pos, league: club.league, conf: Math.round(c.board.conf), w: G.table(club.league).find(r => r.id === uid).w });
    // ¿Despido?
    summary.sacked = c.board.conf < 20;
    // Envejecer, retirar, contratos, cantera
    progressPlayers(summary);
    c.season++;
    c.week = 0;
    G.newSeasonSchedule();
    setObjective();
    club.budget = Math.round((Math.pow(10, (club.rep - 50) / 22) * 1.2 + Math.max(0, club.budget) * 0.5 + prize * 0.5) * 10) / 10;
    for (const cl of Object.values(c.world.clubs)) if (cl.id !== uid) cl.budget = Math.round(Math.pow(10, (cl.rep - 50) / 22) * 1.2 * (0.8 + R() * 0.5) * 10) / 10;
    club.wageBudget = Math.round(Math.max(club.wageBudget, club.players.reduce((s, id) => s + P(id).wage, 0) * 1.08));
    c.board.conf = summary.sacked ? 50 : clamp(c.board.conf * 0.6 + 26, 0, 100);
    club.lineup = G.autoLineup(club); club.bench = G.autoBench(club, club.lineup);
    inbox('Presidente', 'Objetivos de la temporada ' + c.season + '/' + String(c.season + 1).slice(2), 'Nuevo curso. La directiva espera: ' + c.board.objective.text.toLowerCase() + '. Presupuesto de fichajes: ' + G.fmtMoney(club.budget) + '.', 'directiva');
    c.lastSummary = summary;
    return { seasonEnd: true, summary };
  };

  function computeAwards(summary) {
    const c = C();
    const all = Object.values(c.world.players).filter(p => p.club && p.st.ap >= 10);
    const cupBonus = {};
    for (const cup of c.cups) {
      if (cup.champion) cupBonus[cup.champion] = (cupBonus[cup.champion] || 0) + (cup.id === 'CON' ? 22 : 12);
      const fin = cup.rounds[cup.rounds.length - 1];
      if (fin && fin[0] && fin[0].winner) { const l = fin[0].winner === fin[0].h ? fin[0].a : fin[0].h; cupBonus[l] = (cupBonus[l] || 0) + 6; }
    }
    const leagueBonus = {};
    for (const L of G.LEAGUES) { const t = G.table(L.id); t.forEach((r, i) => { leagueBonus[r.id] = (i === 0 ? 14 : i < 4 ? 5 : 0) * (L.rep / 80); }); }
    const score = p => {
      const rt = G.avgRating(p);
      const grp = G.POS_GROUP[p.pos];
      return rt * 9 + p.st.g * (grp === 'DEL' ? 0.9 : 1.2) + p.st.a * 0.6 + (grp === 'POR' || grp === 'DEF' ? p.st.cs * 0.25 + 4 : 0) + (leagueBonus[p.club] || 0) + (cupBonus[p.club] || 0) + p.ovr * 0.35 + p.st.mvp * 0.4 + G.leagueOf(CL(p.club).league).rep * 0.15;
    };
    const ranked = all.map(p => ({ id: p.id, s: score(p) })).sort((a, b) => b.s - a.s);
    const balon = ranked.slice(0, 10).map(x => ({ id: x.id, s: Math.round(x.s) }));
    const bota = all.slice().sort((a, b) => b.st.g - a.st.g || G.avgRating(b) - G.avgRating(a)).slice(0, 3).map(p => ({ id: p.id, g: p.st.g }));
    const guante = all.filter(p => p.pos === 'POR').sort((a, b) => (b.st.cs * 2 + G.avgRating(b) * 5) - (a.st.cs * 2 + G.avgRating(a) * 5)).slice(0, 3).map(p => ({ id: p.id, cs: p.st.cs }));
    const promesa = ranked.filter(x => P(x.id).age <= 21).slice(0, 3).map(x => ({ id: x.id }));
    // Entrenador del año: mayor sobre-rendimiento respecto al nivel de la plantilla
    let entrenador = null, best = -99;
    for (const L of G.LEAGUES) {
      const t = G.table(L.id);
      const exp = c.world.leagues[L.id].clubs.slice().sort((a, b) => G.teamStrength(CL(b)) - G.teamStrength(CL(a)));
      t.forEach((r, i) => { const v = (exp.indexOf(r.id) - i) + (i === 0 ? 3 : 0) + (cupBonus[r.id] || 0) / 8 + L.rep / 40; if (v > best) { best = v; entrenador = r.id; } });
    }
    // Once ideal 4-3-3
    const xiSlots = G.FORMATIONS['4-3-3'].map(s => s[0]);
    const used = new Set(), xi = [];
    for (const pos of xiSlots) { const p = ranked.map(x => P(x.id)).find(p => !used.has(p.id) && p.pos === pos); if (p) { used.add(p.id); xi.push(p.id); } }
    return { season: c.season, balon, bota, guante, promesa, entrenador, xi, champions: summary.champions, cups: c.cups.map(x => ({ id: x.id, name: x.name, champion: x.champion })), names: { balon: 'Balón Dorado', bota: 'Bota Dorada', guante: 'Guante Dorado', promesa: 'Premio Promesa' } };
  }

  function progressPlayers(summary) {
    const c = C(), uid = c.user.club;
    summary.retired = []; summary.leaving = [];
    for (const id in c.world.players) {
      const p = c.world.players[id];
      if (p.st.ap) (p.hist = p.hist || []).push({ s: c.season, c: p.club, ap: p.st.ap, g: p.st.g, a: p.st.a, rt: G.avgRating(p) });
      p.st = { ap: 0, g: 0, a: 0, rt: 0, cs: 0, mvp: 0, yc: 0 };
      p.age++;
      p.fit = 100; p.inj = 0; p.susp = 0; p.promised = 0;
      if (!p.club) { if (!p.youth && p.age > 33) delete c.world.players[id]; continue; }
      // Retirada
      if (p.age >= 34 && (R() < (p.age - 32) * 0.22 || p.ovr < 62)) {
        const club = CL(p.club);
        club.players = club.players.filter(x => x !== p.id);
        if (club.lineup) club.lineup = club.lineup.filter(x => x !== p.id);
        if (p.club === uid || p.ovr >= 82) summary.retired.push(G.fullName(p) + ' (' + p.ovr + ')');
        if (p.ovr >= 82) news(G.fullName(p) + ' anuncia su retirada', 'Cuelga las botas a los ' + p.age + ' años tras una gran carrera: ' + p.career.g + ' goles en ' + p.career.ap + ' partidos.', 'general');
        delete c.world.players[id];
        continue;
      }
      // Contratos
      p.contract--;
      if (p.contract <= 0) {
        if (p.club === uid) {
          summary.leaving.push(G.fullName(p));
          G.releasePlayerAI(p.id); p.contract = 0;
        } else if (R() < 0.75) p.contract = rnd(1, 4);
        else { G.releasePlayerAI(p.id); p.contract = 0; }
      }
      p.value = G.calcValue(p); p.wage = Math.max(p.wage, Math.round(G.calcWage(p) * 0.8));
    }
    // Rellenar plantillas con canteranos
    for (const club of Object.values(c.world.clubs)) {
      if (club.id === uid) continue;
      while (club.players.length < 23) {
        const pos = needPosition(club);
        const L = G.leagueOf(club.league);
        const p = G.makePlayer(R() < 0.75 ? L.nat : pick(Object.keys(G.NATIONS)), pos, rnd(50, 60) + Math.round((club.rep - 65) / 4), rnd(17, 19), { wonderkid: R() < 0.08 });
        p.club = club.id; c.world.players[p.id] = p; club.players.push(p.id);
      }
      while (club.players.length > 28) G.releasePlayerAI(club.players.map(P).sort((a, b) => a.ovr - b.ovr)[0].id);
      G.assignNumbers(c.world, club);
      club.lineup = null;
    }
    // Cantera del usuario
    const user = CL(uid);
    c.youth = c.youth.filter(id => P(id));
    for (const id of c.youth) { const p = P(id); if (p.age > 19) { c.youth = c.youth.filter(x => x !== id); p.youth = false; c.world.freeAgents.push(id); } }
    for (let i = 0; i < 4; i++) c.youth.push(makeYouth(user));
    inbox('Director de cantera', 'Nueva generación en la cantera', 'Han llegado 4 nuevos juveniles a la academia. Revíselos en Cantera.', 'cantera');
    // Nuevos agentes libres
    for (let i = 0; i < 20; i++) { const p = G.makePlayer(pick(Object.keys(G.NATIONS)), pick(G.SQUAD_TEMPLATE), rnd(56, 74), rnd(22, 33)); p.contract = 0; c.world.players[p.id] = p; c.world.freeAgents.push(p.id); }
    c.world.freeAgents = c.world.freeAgents.filter(id => P(id) && !P(id).club);
  }

  // Ofertas de trabajo tras un despido.
  G.jobOffers = function () {
    const c = C(), rep = c.user.rep;
    return Object.values(c.world.clubs).filter(cl => cl.id !== c.user.club && cl.rep < CL(c.user.club).rep - 2).sort(() => R() - .5).slice(0, 4);
  };
  G.takeJob = function (cid) {
    const c = C();
    c.user.club = cid;
    const club = CL(cid);
    c.board = { conf: 60 }; setObjective();
    club.wageBudget = Math.round(club.players.reduce((s, id) => s + P(id).wage, 0) * 1.12);
    c.youth = []; for (let i = 0; i < 5; i++) c.youth.push(makeYouth(club));
    club.lineup = G.autoLineup(club); club.bench = G.autoBench(club, club.lineup);
    c.fin.balance = club.budget * 1.6;
    inbox('Presidente', 'Bienvenido a ' + club.name, 'Objetivo: ' + c.board.objective.text + '.', 'directiva');
  };

  // ------------------------------------------------------------------ guardado
  const KEY = 'elitemanager.save.v1';
  G.save = function () {
    try { const c = Object.assign({}, G.C, { nextPid: G.getNextPid() }); localStorage.setItem(KEY, JSON.stringify(c)); return true; } catch (e) { return false; }
  };
  G.load = function () {
    try { const s = localStorage.getItem(KEY); if (!s) return false; G.C = JSON.parse(s); G.setNextPid(G.C.nextPid || 99999); return true; } catch (e) { return false; }
  };
  G.hasSave = function () { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } };
  G.deleteSave = function () { try { localStorage.removeItem(KEY); } catch (e) { /* sin almacenamiento */ } };
  G.exportSave = () => JSON.stringify(Object.assign({}, G.C, { nextPid: G.getNextPid() }));
  G.importSave = txt => { const c = JSON.parse(txt); if (!c.world || !c.user) throw new Error('Archivo no válido'); G.C = c; G.setNextPid(c.nextPid || 99999); };

  // ------------------------------------------------------------------ editor / importación CSV
  // Formato: club;nombre;apellido;nacionalidad;posicion;edad;RIT;TIR;PAS;REG;DEF;FIS;POR
  G.importCSV = function (text) {
    const c = C();
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let added = 0, errors = [];
    for (const [i, line] of lines.entries()) {
      const f = line.split(/[;,\t]/).map(x => x.trim());
      if (i === 0 && /club/i.test(f[0])) continue;
      if (f.length < 12) { errors.push('Línea ' + (i + 1) + ': faltan columnas'); continue; }
      const club = Object.values(c.world.clubs).find(cl => cl.name.toLowerCase() === f[0].toLowerCase());
      if (!club) { errors.push('Línea ' + (i + 1) + ': no existe el club "' + f[0] + '"'); continue; }
      const pos = f[4].toUpperCase();
      if (!G.POSITIONS.includes(pos)) { errors.push('Línea ' + (i + 1) + ': posición "' + f[4] + '" no válida'); continue; }
      const nat = Object.keys(G.NATIONS).find(k => k === f[3].toUpperCase() || G.NATIONS[k].name.toLowerCase() === f[3].toLowerCase()) || 'ESP';
      const p = G.makePlayer(nat, pos, 60, +f[5] || 25);
      p.fn = f[1]; p.ln = f[2];
      ['pac', 'sho', 'pas', 'dri', 'def', 'phy', 'gk'].forEach((k, j) => { const v = +f[6 + j]; if (v) p.att[k] = clamp(v, 1, 99); });
      p.ovr = G.calcOvr(p.att, pos); p.pot = Math.max(p.pot, p.ovr); p.value = G.calcValue(p); p.wage = G.calcWage(p);
      p.club = club.id; c.world.players[p.id] = p; club.players.push(p.id);
      G.assignNumbers(c.world, club);
      added++;
    }
    return { added, errors };
  };

  G.MONTHS = MONTHS;
})();
