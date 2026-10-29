// Generación del mundo: jugadores, clubes, ligas y utilidades comunes.
(function () {
  // Generador aleatorio con semilla (para que el mundo se pueda reproducir).
  let seed = 1;
  function srand(s) { seed = s >>> 0 || 1; }
  function rnd() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  const R = {
    f: () => rnd(),
    i: (a, b) => a + Math.floor(rnd() * (b - a + 1)),
    pick: arr => arr[Math.floor(rnd() * arr.length)],
    norm: (m, s) => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); },
    chance: p => rnd() < p
  };
  G.R = R; G.srand = srand;

  G.clamp = (v, a, b) => v < a ? a : v > b ? b : v;

  G.calcOvr = function (att, pos) {
    const w = G.POS_WEIGHTS[pos]; let s = 0;
    for (const k in w) s += att[k] * w[k];
    return Math.round(s);
  };

  // Media en otra posición (jugar fuera de sitio penaliza).
  G.ovrAt = function (p, pos) {
    if (p.pos === pos) return p.ovr;
    const base = G.calcOvr(p.att, pos);
    const sameGroup = G.POS_GROUP[p.pos] === G.POS_GROUP[pos];
    const near = (p.alt || []).includes(pos);
    const pen = near ? 2 : sameGroup ? 6 : (pos === 'POR' || p.pos === 'POR') ? 40 : 14;
    return Math.max(10, Math.min(base, p.ovr) - pen);
  };

  G.calcValue = function (p) {
    const ageF = p.age <= 20 ? 1.7 : p.age <= 23 ? 1.45 : p.age <= 27 ? 1.15 : p.age <= 30 ? 0.85 : p.age <= 32 ? 0.55 : 0.3;
    const potF = 1 + Math.max(0, p.pot - p.ovr) * 0.035;
    let v = Math.pow(10, (p.ovr - 45) / 13.5) * 0.06 * ageF * potF; // millones
    if (p.contract <= 1) v *= 0.7;
    return Math.max(0.05, Math.round(v * 20) / 20);
  };
  G.calcWage = function (p) { // miles de € por semana
    return Math.max(1, Math.round(Math.pow(10, (p.ovr - 45) / 15) * 0.9 * (p.age > 30 ? 1.1 : 1)));
  };

  const ALT_POS = { DFC: ['MCD'], LD: ['ED','LI'], LI: ['EI','LD'], MCD: ['MC','DFC'], MC: ['MCD','MCO'], MCO: ['MC','DC'], ED: ['EI','MCO'], EI: ['ED','MCO'], DC: ['MCO'], POR: [] };

  let nextPid = 1;
  G.setNextPid = n => { nextPid = n; };
  G.getNextPid = () => nextPid;

  G.makePlayer = function (nat, pos, target, age, opts = {}) {
    const N = G.NATIONS[nat];
    const w = G.POS_WEIGHTS[pos];
    const att = {};
    for (const k of G.ATTRS) {
      if (k === 'gk') att[k] = pos === 'POR' ? target + R.i(-3, 4) : R.i(8, 22);
      else if (w[k] >= .2) att[k] = target + R.i(-5, 7);
      else if (w[k]) att[k] = target + R.i(-12, 3);
      else att[k] = target - R.i(8, 28);
    }
    if (pos === 'POR') { att.sho = R.i(15, 40); att.dri = R.i(20, 50); }
    const ovr0 = G.calcOvr(att, pos);
    for (const k of G.ATTRS) {
      if (pos !== 'POR' && k === 'gk') continue;
      att[k] = G.clamp(att[k] + (target - ovr0), 15, 99);
    }
    const p = {
      id: nextPid++, fn: R.pick(N.fn), ln: R.pick(N.ln), nat, pos,
      alt: R.chance(.55) ? [R.pick(ALT_POS[pos] || [])].filter(Boolean) : [],
      age, att, ovr: 0, pot: 0, club: null,
      foot: R.chance(.75) ? 'D' : 'I',
      height: pos === 'POR' || pos === 'DFC' ? R.i(182, 198) : R.i(168, 190),
      skin: R.i(0, 4), hair: R.i(0, 5),
      morale: 70, fit: 100, form: 6.5, inj: 0, contract: R.i(1, 5),
      st: { ap: 0, g: 0, a: 0, rt: 0, cs: 0, mvp: 0, yc: 0 },
      career: { ap: 0, g: 0, a: 0 }, trophies: [], focus: null, listed: false,
      traits: []
    };
    if (pos === 'DC' && R.chance(.3)) p.traits.push('Cazagoles');
    if ((pos === 'MC' || pos === 'MCO') && R.chance(.25)) p.traits.push('Visión de juego');
    if ((pos === 'ED' || pos === 'EI') && R.chance(.3)) p.traits.push('Velocista');
    if (pos === 'DFC' && R.chance(.25)) p.traits.push('Muro');
    if (R.chance(.08)) p.traits.push('Líder');
    if (R.chance(.06)) p.traits.push('Conflictivo');
    if (R.chance(.1)) p.traits.push('Profesional');
    p.ovr = G.calcOvr(att, pos);
    const youngBoost = age <= 19 ? R.i(8, 26) : age <= 22 ? R.i(4, 18) : age <= 25 ? R.i(0, 8) : age <= 28 ? R.i(0, 3) : 0;
    p.pot = G.clamp(p.ovr + youngBoost, p.ovr, 97);
    if (opts.wonderkid) p.pot = G.clamp(p.ovr + R.i(18, 30), p.ovr, 95);
    p.value = G.calcValue(p);
    p.wage = G.calcWage(p);
    return p;
  };

  function contrast(a, b) {
    const h = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
    const x = h(a), y = h(b);
    return Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]);
  }
  G.colorDist = contrast;

  function clubName(L, used) {
    for (let tries = 0; tries < 60; tries++) {
      const city = R.pick(L.cities);
      let name;
      if (L.pre.length && R.chance(.65)) name = R.pick(L.pre) + ' ' + city;
      else name = city + ' ' + R.pick(L.suf);
      if (G.BLOCKED_NAMES.includes(name) || used.has(name) || [...used].some(u => u.includes(city) && tries < 30)) continue;
      used.add(name);
      return { name, city };
    }
    const city = R.pick(L.cities) + ' ' + R.i(2, 9);
    return { name: city + ' FC', city };
  }

  function shortCode(name, used) {
    const words = name.replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ').filter(w => w.length > 2 && !['Club','Real','Atlético','Deportivo','Sporting','Atletico','Calcio','United','City','Clube','Esporte','Futebol'].includes(w));
    const base = (words[0] || name).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    let code = base.slice(0, 3);
    let i = 3;
    while (used.has(code) && i < base.length) { code = base.slice(0, 2) + base[i]; i++; }
    while (used.has(code)) code = base.slice(0, 2) + String.fromCharCode(65 + R.i(0, 25));
    used.add(code);
    return code;
  }

  const STADIUM_WORDS = ['Estadio Municipal', 'Estadio del Centenario', 'Arena', 'Park', 'Stadium', 'Coliseo', 'Campo Nuevo', 'Estadio Olímpico'];

  G.generateWorld = function (worldSeed) {
    srand(worldSeed || Date.now());
    nextPid = 1;
    const W = { seed: worldSeed, clubs: {}, players: {}, leagues: {}, freeAgents: [] };
    const usedNames = new Set(), usedCodes = new Set();
    let cid = 1;
    for (const L of G.LEAGUES) {
      const ids = [];
      for (let i = 0; i < L.size; i++) {
        // Distribución de nivel: pocos grandes, clase media y equipos modestos.
        const tier = i / (L.size - 1);
        const rep = Math.round(L.rep + 12 - Math.pow(tier, 0.8) * 22 + R.i(-2, 2));
        const { name, city } = clubName(L, usedNames);
        let c1 = R.pick(G.COUNTRY_COLORS), c2 = R.pick(G.COUNTRY_COLORS);
        while (contrast(c1, c2) < 200) c2 = R.pick(G.COUNTRY_COLORS);
        const club = {
          id: cid++, name, city, code: shortCode(name, usedCodes), league: L.id, rep,
          colors: [c1, c2], stadium: (R.chance(.5) ? STADIUM_WORDS[R.i(0, 1)] + ' de ' + city : city + ' ' + R.pick(STADIUM_WORDS.slice(2))),
          capacity: Math.round((15 + (rep - 55) * 1.6 + R.i(-5, 10)) * 1000),
          budget: Math.round(Math.max(1, Math.pow(10, (rep - 50) / 22) * 1.2) * 10) / 10,
          players: [], formation: R.pick(Object.keys(G.FORMATIONS)),
          tactics: { ment: 0, press: 1, tempo: 1, width: 1 },
          lineup: null, chem: 60, trophies: [], fans: 60
        };
        W.clubs[club.id] = club;
        ids.push(club.id);
        // Plantilla
        for (const pos of G.SQUAD_TEMPLATE) {
          const nat = R.chance(L.rep > 74 ? .58 : .72) ? L.nat : R.pick(Object.keys(G.NATIONS));
          const age = G.clamp(Math.round(R.norm(26, 4.2)), 17, 36);
          let target = Math.round(R.norm(rep - 6, 4.5));
          if (age < 21) target -= R.i(4, 10);
          if (age > 32) target -= R.i(0, 5);
          if (R.chance(.06)) target += R.i(4, 9); // estrella del equipo
          const p = G.makePlayer(nat, pos, G.clamp(target, 42, 93), age, { wonderkid: age < 20 && R.chance(.08) });
          p.club = club.id;
          W.players[p.id] = p;
          club.players.push(p.id);
        }
      }
      W.leagues[L.id] = { id: L.id, clubs: ids };
    }
    // Agentes libres
    for (let i = 0; i < 60; i++) {
      const pos = R.pick(G.SQUAD_TEMPLATE);
      const p = G.makePlayer(R.pick(Object.keys(G.NATIONS)), pos, R.i(55, 74), R.i(21, 34));
      p.contract = 0; p.club = null;
      W.players[p.id] = p;
      W.freeAgents.push(p.id);
    }
    numberSquads(W);
    return W;
  };

  function numberSquads(W) {
    for (const id in W.clubs) G.assignNumbers(W, W.clubs[id]);
  }
  G.assignNumbers = function (W, club) {
    const pref = { POR: [1, 13, 25], DFC: [4, 5, 3, 15, 24], LD: [2, 12, 22], LI: [3, 18, 26], MCD: [6, 16, 5], MC: [8, 14, 20], MCO: [10, 21, 19], ED: [7, 17, 11], EI: [11, 7, 27], DC: [9, 19, 29] };
    const used = new Set();
    const ps = club.players.map(id => W.players[id]).sort((a, b) => b.ovr - a.ovr);
    for (const p of ps) if (p.num && !used.has(p.num)) used.add(p.num); else p.num = 0;
    for (const p of ps) {
      if (p.num) continue;
      let n = (pref[p.pos] || []).find(x => !used.has(x));
      if (!n) { n = 2; while (used.has(n)) n++; }
      p.num = n; used.add(n);
    }
  };

  G.fullName = p => p.fn + ' ' + p.ln;
  G.shortName = p => p.fn[0] + '. ' + p.ln;
  G.fmtMoney = m => m >= 1 ? (Math.round(m * 10) / 10).toLocaleString('es-ES') + ' M€' : Math.round(m * 1000).toLocaleString('es-ES') + ' mil €';
  G.fmtWage = k => (k >= 1000 ? (k / 1000).toFixed(1).replace('.', ',') + ' M€' : Math.round(k) + ' mil €') + '/sem';
})();
