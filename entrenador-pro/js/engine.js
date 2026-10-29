// Motor de partido: simulación física por agentes. Se usa tanto para ver el partido
// en 3D como para simular el partido del usuario sin verlo (mismo resultado posible).
(function () {
  const L = 105, W = 68, GOAL_HW = 3.66, BAR = 2.44, GRAV = 9.8;
  const CLOCK = 7.5;           // 1 segundo simulado = 7,5 segundos de partido (12 min reales a 1x)
  const HALF_SECS = 45 * 60 / CLOCK;
  const R = Math.random;
  const pick = a => a[Math.floor(R() * a.length)];
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

  function segDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
    const t = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
    return { d: Math.hypot(px - ax - t * dx, py - ay - t * dy), t };
  }

  const DEF_ROLES = ['DFC', 'LD', 'LI'];

  class Match {
    // home / away: { club, xi:[player], bench:[player], formation, tactics, kit, gkKit, user:bool }
    constructor(home, away, opts = {}) {
      this.opts = opts;
      this.sides = [home, away].map((s, i) => ({
        ...s, i, score: 0, subsLeft: 5, subsUsed: 0,
        stats: { shots: 0, onT: 0, poss: 0, passes: 0, passOk: 0, fouls: 0, corners: 0, yc: 0, rc: 0, tackles: 0, saves: 0, xg: 0, offs: 0 },
        bench: s.bench.slice(), used: []
      }));
      this.agents = [];
      for (const s of this.sides) this.buildAgents(s);
      this.ball = { x: L / 2, y: W / 2, z: 0, vx: 0, vy: 0, vz: 0, owner: null, last: null, passer: null, passT: -99, flight: null, spin: 0 };
      this.t = 0; this.half = 1; this.extra = [2 + Math.floor(R() * 3), 3 + Math.floor(R() * 4)];
      this.events = []; this.listeners = [];
      this.state = 'pre'; this.timer = 0; this.restart = null;
      this.possSide = 0; this.goalFlash = null;
      this.isCup = !!opts.cup;
      this.setKickoff(0);
      this.state = 'kickoff'; this.timer = 1.2;
    }

    on(fn) { this.listeners.push(fn); }
    emit(ev) { ev.min = this.minute(); this.events.push(ev); for (const f of this.listeners) f(ev); }

    minute() {
      const m = Math.floor(this.t * CLOCK / 60);
      return this.half === 1 ? Math.min(m, 45 + this.extra[0]) : Math.min(45 + m, 90 + this.extra[1]);
    }
    clockText() {
      const secs = Math.floor(this.t * CLOCK);
      let m = Math.floor(secs / 60), s = secs % 60;
      if (this.half === 2) m += 45;
      const cap = this.half === 1 ? 45 : 90;
      if (m >= cap) return cap + '+' + (m - cap + 1) + "'";
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    buildAgents(side) {
      const F = G.FORMATIONS[side.formation];
      side.xi.forEach((p, k) => {
        const slot = F[k];
        this.agents.push(this.makeAgent(side, p, slot));
      });
    }
    makeAgent(side, p, slot) {
      return {
        side: side.i, p, role: slot[0], bx: slot[1], by: slot[2], x: 0, y: 0, vx: 0, vy: 0, fx: 1, fy: 0,
        stam: Math.min(100, p.fit), cool: R() * 0.3, tkCd: 0, slow: 0, recv: false, holdT: 0,
        rating: 6.0, ev: { g: 0, a: 0, sh: 0, pa: 0, pok: 0, tk: 0, sv: 0, kp: 0, drb: 0, err: 0, yc: 0 },
        off: false, inj: false, dive: 0, kick: 0, celebrate: 0, minIn: 0,
        mf: (0.95 + (p.morale ?? 70) / 1000) * (side.i === 0 && !this.opts.neutral ? 1.03 : 1) * (side.boost || 1)
      };
    }

    dir(s) { return (s === 0 ? 1 : -1) * (this.half === 2 ? -1 : 1); }
    fwd(s, x) { return this.dir(s) > 0 ? x : L - x; }
    oppGoalX(s) { return this.dir(s) > 0 ? L : 0; }
    ownGoalX(s) { return this.dir(s) > 0 ? 0 : L; }
    active(s) { return this.agents.filter(a => a.side === s && !a.off); }
    gk(s) { return this.agents.find(a => a.side === s && !a.off && a.role === 'POR'); }

    setKickoff(kickSide) {
      for (const a of this.agents) {
        if (a.off) continue;
        const d = this.dir(a.side);
        let fx = 52.5 + (a.bx - 0.5) * 73.5 - 14;
        if (a.role === 'POR') fx = 4;
        fx = Math.min(fx, 50);
        let fy = a.by * W;
        a.x = d > 0 ? fx : L - fx; a.y = d > 0 ? fy : W - fy; a.vx = a.vy = 0;
        a.fx = d; a.fy = 0;
      }
      const kickers = this.active(kickSide).filter(a => a.role !== 'POR').sort((p, q) => q.bx - p.bx);
      const k1 = kickers[0], k2 = kickers[1];
      const d = this.dir(kickSide);
      k1.x = L / 2 - d * 0.3; k1.y = W / 2;
      if (k2) { k2.x = L / 2 - d * 1.5; k2.y = W / 2 + 6; }
      Object.assign(this.ball, { x: L / 2, y: W / 2, z: 0, vx: 0, vy: 0, vz: 0, owner: k1, flight: null, last: k1 });
      k1.holdT = 0.4; k1.cool = 0.6;
      this.possSide = kickSide;
    }

    // ------------------------------------------------------------------ bucle
    step(dt) {
      if (this.state === 'end') return;
      if (this.state !== 'play') {
        this.timer -= dt;
        for (const a of this.agents) { a.vx *= 0.9; a.vy *= 0.9; a.x += a.vx * dt; a.y += a.vy * dt; if (a.celebrate > 0) a.celebrate -= dt; }
        if (this.state === 'goal' && this.ball.flight === 'net') this.ballPhysics(dt);
        if (this.timer <= 0) this.resume();
        return;
      }
      this.t += dt;
      const limit = HALF_SECS + this.extra[this.half - 1] * 60 / CLOCK;
      if (this.t >= limit) {
        if (this.half === 1) { this.half = 2; this.t = 0; this.state = 'half'; this.timer = 0.1; this.emit({ type: 'half', text: 'Descanso. ' + this.scoreText() }); return; }
        this.state = 'end'; this.finish(); return;
      }
      const b = this.ball;
      const owner = b.owner;
      if (owner) this.possSide = owner.side;
      this.sides[this.possSide].stats.poss += dt;

      this.buildCache();
      for (const a of this.agents) {
        if (a.off) continue;
        if (a.tkCd > 0) a.tkCd -= dt;
        if (a.slow > 0) a.slow -= dt;
        if (a.dive > 0) a.dive -= dt;
        if (a.kick > 0) a.kick -= dt;
        this.think(a, dt);
      }
      this.moveAgents(dt);
      if (b.owner) {
        const o = b.owner;
        const sp = Math.hypot(o.vx, o.vy);
        const lead = 0.45 + sp * 0.05;
        b.x = o.x + o.fx * lead; b.y = o.y + o.fy * lead; b.z = 0.11; b.vx = o.vx; b.vy = o.vy; b.vz = 0;
        b.spin += sp * dt * 3;
      } else this.ballPhysics(dt);
      if (this.state === 'play') this.checkControl();
      if (this.state === 'play') this.checkBounds();
      // Cansancio
      for (const a of this.agents) {
        if (a.off) continue;
        const sp = Math.hypot(a.vx, a.vy);
        const pressCost = this.sides[a.side].tactics.press * 0.012;
        const drain = (0.05 + (sp > 6 ? 0.1 : sp > 3.5 ? 0.04 : 0) + pressCost) * (1.25 - a.p.att.phy / 200) * (a.role === 'POR' ? 0.3 : 1);
        a.stam = Math.max(5, a.stam - drain * dt);
      }
      this.aiSubs();
    }

    buildCache() {
      const b = this.ball, px = b.x + b.vx * 0.35, py = b.y + b.vy * 0.35;
      this.cache = [0, 1].map(s => {
        const field = this.agents.filter(m => m.side === s && !m.off && m.role !== 'POR');
        const byBall = field.slice().sort((p, q) => dist(p.x, p.y, b.x, b.y) - dist(q.x, q.y, b.x, b.y));
        const byPred = field.slice().sort((p, q) => dist(p.x, p.y, px, py) - dist(q.x, q.y, px, py));
        return { byBall, byPred, px, py };
      });
    }

    scoreText() { return this.sides[0].club.name + ' ' + this.sides[0].score + ' - ' + this.sides[1].score + ' ' + this.sides[1].club.name; }

    resume() {
      if (this.state === 'half') {
        this.setKickoff(1); this.state = 'kickoff'; this.timer = 1.0;
        this.emit({ type: 'info', text: '¡Comienza la segunda parte!' });
        return;
      }
      if (this.state === 'goal') {
        const conceding = this.goalFlash.side === 0 ? 1 : 0;
        this.setKickoff(conceding); this.state = 'kickoff'; this.timer = 0.8; this.goalFlash = null; return;
      }
      if (this.state === 'setpiece' && this.restart) { this.restart(); this.restart = null; }
      this.state = 'play';
    }

    // ------------------------------------------------------------------ IA
    think(a, dt) {
      const b = this.ball;
      if (b.owner === a) return this.thinkCarrier(a, dt);
      const s = a.side, poss = b.owner ? b.owner.side === s : null;
      let tx, ty, run = 0.62;
      if (a.role === 'POR') {
        [tx, ty, run] = this.gkTarget(a);
      } else if (a.recv && b.flight === 'pass') {
        tx = b.tx; ty = b.ty; run = 1;
        if (dist(a.x, a.y, b.x, b.y) < 6) { tx = b.x + b.vx * 0.15; ty = b.y + b.vy * 0.15; }
      } else if (!b.owner) {
        // Balón suelto: los dos más cercanos de cada equipo lo persiguen.
        const { byPred: mates, px, py } = this.cache[s];
        if (mates[0] === a || (mates[1] === a && dist(a.x, a.y, px, py) < 12)) { tx = px; ty = py; run = 1; }
        else [tx, ty] = this.shapeTarget(a, this.possSide === s);
      } else if (poss) {
        [tx, ty] = this.shapeTarget(a, true);
        // Desmarques: se alejan del rival más cercano
        const near = this.nearestOpp(a, a.x, a.y);
        if (near && near.d < 4) { tx += (a.x - near.a.x) * 0.8; ty += (a.y - near.a.y) * 0.8; }
        if (Math.random() < 0.002) a.runT = 2.5;
        if (a.runT > 0 && ['DC', 'ED', 'EI', 'MCO'].includes(a.role)) {
          a.runT -= dt; run = 0.95;
          tx = this.offsideLine(s) - this.dir(s) * 0.6; // carrera al límite del fuera de juego
        }
      } else {
        // Defendiendo
        const press = this.sides[s].tactics.press; // 0..2
        const pressers = this.cache[s].byBall.slice(0, 1 + press);
        const k = pressers.indexOf(a);
        const carrier = b.owner;
        if (k === 0 || (k > 0 && dist(a.x, a.y, b.x, b.y) < 10 + press * 6)) {
          // Entrar al poseedor, cerrando hacia la portería propia
          const gx = this.ownGoalX(s);
          const ang = Math.atan2(W / 2 - carrier.y, gx - carrier.x);
          const off = k === 0 ? 0.9 : 3.5;
          tx = carrier.x + Math.cos(ang) * off + carrier.vx * 0.25;
          ty = carrier.y + Math.sin(ang) * off + carrier.vy * 0.25;
          run = k === 0 ? 0.95 : 0.8;
          if (k === 0) this.tryTackle(a, carrier);
        } else {
          [tx, ty] = this.shapeTarget(a, false);
          // Marcaje al atacante más cercano a su zona
          const opp = this.nearestOpp(a, tx, ty);
          if (opp && opp.d < 9) {
            const g = this.ownGoalX(s);
            tx = opp.a.x + (g - opp.a.x) * 0.08; ty = opp.a.y + (W / 2 - opp.a.y) * 0.08;
          }
        }
      }
      a.tx = tx; a.ty = ty; a.run = run;
    }

    offsideLine(s) {
      // Coordenada x del penúltimo rival (línea de fuera de juego) en ejes del mundo.
      const opp = this.active(1 - s).map(o => this.fwd(s, o.x)).sort((p, q) => q - p);
      const lineF = Math.max(opp[1] || 52.5, 52.5, this.fwd(s, this.ball.x));
      return this.dir(s) > 0 ? lineF : L - lineF;
    }

    shapeTarget(a, poss) {
      const s = a.side, d = this.dir(s), T = this.sides[s].tactics;
      const b = this.ball;
      const ballF = this.fwd(s, b.x);
      const ballY = d > 0 ? b.y : W - b.y;
      let shift = (poss ? 9 : -5) + T.ment * 3.5 + (ballF - 52.5) * 0.45;
      let fx = 52.5 + (a.bx - 0.5) * 73.5 + shift;
      if (!poss && DEF_ROLES.includes(a.role)) fx = Math.max(4, Math.min(fx, ballF - 3));
      if (poss && a.bx > 0.5) {
        const line = this.fwd(s, this.offsideLine(s));
        fx = Math.min(fx, line - 0.5);
      }
      fx = clamp(fx, 3, 101);
      const spread = (0.8 + T.width * 0.12) * (poss ? 1 : 0.72);
      let fy = W / 2 + (a.by - 0.5) * W * spread + (ballY - W / 2) * (poss ? 0.2 : 0.35);
      fy = clamp(fy, 2, W - 2);
      return d > 0 ? [fx, fy] : [L - fx, W - fy];
    }

    gkTarget(a) {
      const b = this.ball, s = a.side, gx = this.ownGoalX(s), d = this.dir(s);
      const db = dist(b.x, b.y, gx, W / 2);
      if (b.flight === 'shot' && b.shotSide !== s) return [b.gkX, b.gkY, 1];
      // Salir a por un balón suelto dentro del área
      if (!b.owner && db < 16 && Math.abs(b.y - W / 2) < 20 && b.z < 2.5) {
        const mates = this.active(s).filter(m => m !== a);
        const myD = dist(a.x, a.y, b.x, b.y);
        if (!mates.some(m => dist(m.x, m.y, b.x, b.y) < myD - 2)) return [b.x, b.y, 1];
      }
      const k = Math.min(5.5, db * 0.12 + 0.8);
      const ang = Math.atan2(b.y - W / 2, b.x - gx);
      let tx = gx + Math.cos(ang) * k, ty = W / 2 + Math.sin(ang) * k * 0.8;
      if (this.possSide === s && this.fwd(s, b.x) > 60) tx = gx + d * 11; // portero adelantado
      return [tx, clamp(ty, W / 2 - 3, W / 2 + 3), 0.7];
    }

    nearestOpp(a, x, y) {
      let best = null, bd = 1e9;
      for (const o of this.agents) {
        if (o.off || o.side === a.side) continue;
        const d = dist(o.x, o.y, x, y);
        if (d < bd) { bd = d; best = o; }
      }
      return best ? { a: best, d: bd } : null;
    }

    pressureOn(a) {
      let n = 0, min = 99;
      for (const o of this.agents) {
        if (o.off || o.side === a.side) continue;
        const d = dist(o.x, o.y, a.x, a.y);
        if (d < min) min = d;
        if (d < 3) n++;
      }
      return { n, min };
    }

    tryTackle(a, carrier) {
      if (a.tkCd > 0 || this.state !== 'play') return;
      const d = dist(a.x, a.y, carrier.x, carrier.y);
      if (d > 1.7) return;
      if (carrier.holdT > 0 && carrier.role === 'POR') return;
      a.tkCd = 0.9 + R() * 0.5;
      const T = this.sides[a.side].tactics;
      const def = a.p.att.def * (0.75 + a.stam / 400), dri = carrier.p.att.dri * (0.75 + carrier.stam / 400);
      let pWin = clamp(0.3 + (def * a.mf - dri * carrier.mf) / 100 * 0.9, 0.08, 0.75);
      if (a.p.traits.includes('Muro')) pWin += 0.06;
      const pFoul = 0.05 + T.press * 0.025 + (a.p.traits.includes('Conflictivo') ? 0.04 : 0);
      const r = R();
      if (r < pFoul) return this.foul(a, carrier);
      if (r < pFoul + pWin) {
        a.ev.tk++; this.sides[a.side].stats.tackles++;
        const b = this.ball;
        if (R() < 0.55) { this.giveBall(a); a.cool = 0.25; }
        else {
          b.owner = null; b.flight = null;
          const ang = R() * Math.PI * 2;
          b.vx = Math.cos(ang) * 5; b.vy = Math.sin(ang) * 5; b.vz = 0.5;
          carrier.cool = 0.3;
        }
        carrier.slow = 0.6;
        if (R() < 0.012) this.injure(carrier);
      } else {
        a.slow = 1.0; carrier.ev.drb++;
      }
    }

    foul(a, victim) {
      const s = a.side, st = this.sides[s].stats;
      st.fouls++;
      a.slow = 1;
      let card = null;
      const yr = R();
      if (yr < 0.01) card = 'red';
      else if (yr < 0.2) card = 'yellow';
      if (card === 'yellow') {
        a.ev.yc++; st.yc++;
        if (a.ev.yc >= 2) card = 'red2';
      }
      const inBox = this.fwd(victim.side, victim.x) > L - 16.5 && Math.abs(victim.y - W / 2) < 20.16;
      this.emit({ type: 'foul', side: s, agent: a, text: 'Falta de ' + G.shortName(a.p) + (card === 'yellow' ? '. Tarjeta amarilla.' : '.') });
      if (card === 'red' || card === 'red2') {
        st.rc++; a.off = true; a.sentOff = true; a.rating -= 1.5;
        this.emit({ type: 'red', side: s, agent: a, text: '¡Tarjeta roja para ' + G.shortName(a.p) + '! ' + (card === 'red2' ? 'Segunda amarilla.' : 'Expulsión directa.') });
        a.x = -10; a.y = -10;
      } else if (card === 'yellow') this.emit({ type: 'yellow', side: s, agent: a, text: 'Amarilla para ' + G.shortName(a.p) + '.' });
      if (R() < 0.02) this.injure(victim);
      if (inBox) return this.setPenalty(victim.side);
      // Tiro libre
      const fx = victim.x, fy = victim.y, vs = victim.side;
      this.freeze('setpiece', 1.6, () => {
        const taker = victim.off ? this.bestOf(vs, 'pas') : victim;
        this.placeFor(vs, fx, fy, taker);
        taker.setPiece = 'fk';
      });
    }

    injure(a) {
      if (a.inj || a.off) return;
      a.inj = true;
      a.stam = Math.min(a.stam, 30);
      this.emit({ type: 'injury', side: a.side, agent: a, text: G.shortName(a.p) + ' se ha lesionado y pide el cambio.' });
    }

    bestOf(s, attr) {
      return this.active(s).filter(x => x.role !== 'POR').sort((p, q) => q.p.att[attr] - p.p.att[attr])[0];
    }

    setPenalty(s) {
      this.emit({ type: 'penalty', side: s, text: '¡PENALTI! El árbitro señala el punto fatídico.' });
      const taker = this.active(s).filter(a => a.role !== 'POR').sort((p, q) => q.p.att.sho - p.p.att.sho)[0];
      this.freeze('setpiece', 2.2, () => {
        const px = this.oppGoalX(s) - this.dir(s) * 11;
        // Despejar el área
        for (const a of this.agents) {
          if (a.off || a === taker) continue;
          if (a.role === 'POR' && a.side !== s) { a.x = this.oppGoalX(s) - this.dir(s) * 0.3; a.y = W / 2; continue; }
          if (Math.abs(a.x - this.oppGoalX(s)) < 18) a.x = this.oppGoalX(s) - this.dir(s) * (19 + R() * 4);
        }
        taker.x = px - this.dir(s) * 1.5; taker.y = W / 2;
        this.giveBall(taker); taker.fx = this.dir(s); taker.fy = 0;
        taker.setPiece = 'pen'; taker.holdT = 0.5; taker.cool = 0.5;
      });
    }

    freeze(state, time, fn) {
      this.state = state; this.timer = time; this.restart = fn;
      const b = this.ball; b.owner = null; b.flight = null; b.vx = b.vy = b.vz = 0;
    }

    placeFor(s, x, y, taker) {
      const b = this.ball;
      x = clamp(x, 0.5, L - 0.5); y = clamp(y, 0.3, W - 0.3);
      // Separar rivales 9 m
      for (const a of this.agents) {
        if (a.off || a.side === s) continue;
        const d = dist(a.x, a.y, x, y);
        if (d < 9) { const k = 9.2 / (d || 1); a.x = clamp(x + (a.x - x) * k, 0, L); a.y = clamp(y + (a.y - y) * k, 0, W); }
      }
      taker.x = x - this.dir(s) * 0.6; taker.y = y;
      Object.assign(b, { x, y, z: 0, vx: 0, vy: 0, vz: 0, flight: null });
      this.giveBall(taker);
      taker.holdT = 0.5; taker.cool = 0.4;
    }

    giveBall(a) {
      const b = this.ball;
      if (b.owner !== a && b.last && b.last.side !== a.side) this.possSide = a.side;
      b.owner = a; b.last = a; b.flight = null; b.vz = 0;
      for (const x of this.agents) x.recv = false;
      a.cool = Math.max(a.cool, 0.25 + (2 - this.sides[a.side].tactics.tempo) * 0.12);
    }

    thinkCarrier(a, dt) {
      const s = a.side, d = this.dir(s), T = this.sides[s].tactics;
      a.cool -= dt;
      if (a.holdT > 0) { a.holdT -= dt; a.tx = a.x; a.ty = a.y; a.run = 0; if (a.setPiece !== 'pen') return; }
      const gx = this.oppGoalX(s);
      const dg = dist(a.x, a.y, gx, W / 2);
      if (a.setPiece === 'pen') { if (a.holdT <= 0) { a.setPiece = null; this.shoot(a, true); } return; }
      if (a.setPiece === 'corner') { a.setPiece = null; return this.cross(a); }
      const pr = this.pressureOn(a);
      if (a.role === 'POR') {
        a.tx = a.x; a.ty = a.y; a.run = 0;
        if (a.cool > 0) return;
        return this.pass(a, true);
      }
      // Avanzar con balón por defecto
      const ahead = this.spaceAhead(a);
      let mx = d, my = 0;
      const nearO = this.nearestOpp(a, a.x + d * 3, a.y);
      if (nearO && nearO.d < 5) my = a.y > nearO.a.y ? 0.8 : -0.8;
      if (dg < 32) { mx = (gx - a.x) / dg; my = (W / 2 - a.y) / dg; }
      if (a.y < 3) my = Math.abs(my) + 0.3; if (a.y > W - 3) my = -Math.abs(my) - 0.3;
      const ml = Math.hypot(mx, my) || 1;
      a.tx = a.x + mx / ml * 5; a.ty = a.y + my / ml * 5;
      a.run = 0.8 + a.p.att.dri / 500;
      if (a.cool > 0) return;
      a.cool = 0.18 + (2 - T.tempo) * 0.14 + R() * 0.15;

      // ¿Tiro?
      if (dg < 30) {
        const xg = this.estXG(a, a.x, a.y);
        const want = 0.024 - T.ment * 0.007 - (a.p.traits.includes('Cazagoles') ? 0.012 : 0);
        if ((xg > want && R() < 0.5 + xg * 2) || (dg < 9 && R() < 0.7) || (pr.min < 1.6 && xg > 0.03 && R() < 0.4)) return this.shoot(a);
      }
      // Pase
      const best = this.bestPass(a);
      const dribScore = (Math.min(ahead, 14) * 0.2) + (a.p.att.dri - 60) * 0.035 - pr.n * 0.9 + (this.fwd(s, a.x) > 68 ? 0.9 : 0) + T.ment * 0.15;
      const ownBox = this.fwd(s, a.x) < 20;
      if (ownBox && pr.min < 3 && DEF_ROLES.includes(a.role) && R() < 0.6) return this.clear(a);
      if (best && (best.score > dribScore || pr.min < 1.4 && best.score > dribScore - 1.2)) return this.pass(a, false, best);
      if (pr.min < 1.2 && R() < 0.3 && best) return this.pass(a, false, best);
    }

    spaceAhead(a) {
      const d = this.dir(a.side);
      let min = 40;
      for (const o of this.agents) {
        if (o.off || o.side === a.side) continue;
        const dx = (o.x - a.x) * d;
        if (dx < 0) continue;
        const dy = Math.abs(o.y - a.y);
        if (dy < dx * 0.8 + 2) min = Math.min(min, Math.hypot(dx, dy));
      }
      return min;
    }

    estXG(a, x, y) {
      const s = a.side, gx = this.oppGoalX(s);
      const dg = dist(x, y, gx, W / 2);
      const ang = Math.abs(Math.atan2(y - W / 2, Math.abs(gx - x)));
      const angF = Math.max(0.15, Math.cos(ang) ** 2);
      let xg = 0.95 * Math.exp(-dg / 6.2) * angF;
      const pr = this.pressureOn(a);
      if (pr.min < 1.5) xg *= 0.62; else if (pr.min < 3) xg *= 0.82;
      // Defensas en la línea de tiro
      for (const o of this.agents) {
        if (o.off || o.side === s || o.role === 'POR') continue;
        const sd = segDist(o.x, o.y, x, y, gx, W / 2);
        if (sd.d < 1.2 && sd.t > 0.05) xg *= 0.7;
      }
      return xg;
    }

    shoot(a, penalty) {
      const s = a.side, side = this.sides[s], gx = this.oppGoalX(s), d = this.dir(s);
      const b = this.ball;
      const gk = this.gk(1 - s);
      let xg = penalty ? 0.76 : this.estXG(a, a.x, a.y);
      const sho = a.p.att.sho * (0.8 + a.stam / 500);
      let pGoal = xg * (0.55 + sho / 100 * 0.75) * a.mf;
      const gkv = gk ? gk.p.att.gk : 30;
      pGoal *= (1.28 - gkv / 100 * 0.55) * 1.3;
      if (penalty) pGoal = clamp(0.62 + (sho - gkv) / 250, 0.55, 0.88);
      pGoal = clamp(pGoal, 0.005, 0.92);
      const dg = dist(a.x, a.y, gx, W / 2);
      const pOnT = penalty ? 0.93 : clamp(0.33 + sho / 100 * 0.38 - dg / 90, 0.15, 0.85);
      side.stats.shots++; side.stats.xg += penalty ? 0.76 : xg; a.ev.sh++;
      let outcome;
      const r = R();
      if (r < pGoal) outcome = 'goal';
      else if (R() < Math.max(0, (pOnT - pGoal) / (1 - pGoal))) outcome = 'save';
      else outcome = 'miss';
      // Bloqueo por un defensa en la línea de tiro
      if (!penalty && outcome !== 'goal') {
        for (const o of this.agents) {
          if (o.off || o.side === s || o.role === 'POR') continue;
          const sd = segDist(o.x, o.y, a.x, a.y, gx, W / 2);
          if (sd.d < 1.0 && sd.t > 0.05 && sd.t < 0.7 && R() < 0.5) { outcome = 'block'; b.blocker = o; break; }
        }
      }
      if (outcome !== 'miss' && outcome !== 'block') side.stats.onT++;
      // Punto de destino
      let ty, tz;
      if (outcome === 'goal') { ty = W / 2 + (R() < .5 ? -1 : 1) * (1.2 + R() * 2.2); tz = R() * 2.1 + 0.1; }
      else if (outcome === 'save') { ty = W / 2 + (R() - .5) * 5; tz = R() * 1.9 + 0.2; }
      else { const over = R() < 0.45; ty = over ? W / 2 + (R() - .5) * 7 : W / 2 + (R() < .5 ? -1 : 1) * (GOAL_HW + 0.4 + R() * 3); tz = over ? BAR + 0.3 + R() * 2.5 : R() * 1.5; }
      const tx = gx + d * (outcome === 'goal' ? 1.2 : outcome === 'miss' ? 2 : 0);
      const speed = penalty ? 24 : 21 + sho / 100 * 9;
      const hd = dist(a.x, a.y, tx, ty);
      const T = hd / speed;
      b.owner = null; b.flight = 'shot'; b.shotSide = s; b.outcome = outcome; b.shooter = a; b.last = a;
      b.vx = (tx - a.x) / T; b.vy = (ty - a.y) / T; b.vz = (tz - 0.11 + 0.5 * GRAV * T * T) / T; b.z = 0.11;
      b.shotT = 0; b.shotDur = T;
      // Hacia dónde se tira el portero
      if (gk) {
        if (outcome === 'save') { b.gkX = gx - d * 0.6; b.gkY = ty; }
        else { b.gkX = gx - d * 0.8; b.gkY = W / 2 + (ty - W / 2) * (outcome === 'goal' ? 0.45 : 0.3); }
        gk.dive = Math.min(1.2, T + 0.4); gk.diveDir = Math.sign(ty - gk.y) || 1; gk.diveH = tz;
      }
      a.kick = 0.35;
      for (const x of this.agents) x.recv = false;
      const name = G.shortName(a.p);
      if (penalty) this.emit({ type: 'shot', side: s, agent: a, text: name + ' lanza el penalti...' });
      else if (dg > 22) this.emit({ type: 'shot', side: s, agent: a, text: '¡Disparo lejano de ' + name + '!' });
      else this.emit({ type: 'shot', side: s, agent: a, text: name + ' dispara...' });
    }

    resolveShot() {
      const b = this.ball, s = b.shotSide, gx = this.oppGoalX(s), d = this.dir(s);
      const shooter = b.shooter, gk = this.gk(1 - s);
      const o = b.outcome;
      if (o === 'block') {
        const bl = b.blocker; b.flight = null;
        b.vx = -b.vx * 0.3 + (R() - .5) * 8; b.vy = (R() - .5) * 10; b.vz = 2;
        if (bl) { bl.rating += 0.2; b.last = bl; }
        this.emit({ type: 'block', side: 1 - s, text: 'Disparo bloqueado' + (bl ? ' por ' + G.shortName(bl.p) : '') + '.' });
        if (R() < 0.4) return this.setCorner(s, b.y < W / 2 ? 0.5 : W - 0.5);
        return;
      }
      if (o === 'goal') return this.goal(s, shooter);
      if (o === 'save') {
        this.sides[1 - s].stats.saves++;
        if (gk) { gk.ev.sv++; gk.rating += 0.35; }
        const catchIt = R() < 0.45 + (gk ? gk.p.att.gk / 400 : 0);
        b.flight = null;
        if (catchIt && gk) { b.x = gk.x; b.y = gk.y; this.giveBall(gk); gk.holdT = 1.6; gk.cool = 1.6; this.emit({ type: 'save', side: 1 - s, text: '¡Parada de ' + G.shortName(gk.p) + '! Atrapa el balón.' }); return; }
        if (R() < 0.5) {
          this.emit({ type: 'save', side: 1 - s, text: '¡Paradón de ' + (gk ? G.shortName(gk.p) : 'el portero') + '! Saque de esquina.' });
          return this.setCorner(s, b.y < W / 2 ? 0.5 : W - 0.5);
        }
        b.x = gx - d * 0.8; b.vx = -d * (4 + R() * 6); b.vy = (R() - .5) * 12; b.vz = 1.5 + R() * 2;
        this.emit({ type: 'save', side: 1 - s, text: '¡Rechace de ' + (gk ? G.shortName(gk.p) : 'el portero') + '!' });
        return;
      }
    }

    goal(s, scorer) {
      const side = this.sides[s], b = this.ball;
      side.score++;
      const own = scorer && scorer.side !== s;
      if (scorer && !own) { scorer.ev.g++; scorer.rating += 1.1; }
      let assist = null;
      if (b.passer && b.passer.side === s && b.passer !== scorer && this.t - b.passT < 6) { assist = b.passer; assist.ev.a++; assist.rating += 0.7; }
      const gk = this.gk(1 - s); if (gk) gk.rating -= 0.35;
      for (const a of this.active(1 - s)) if (DEF_ROLES.includes(a.role)) a.rating -= 0.15;
      b.flight = 'net'; b.vx *= 0.25; b.vy *= 0.25; b.vz *= 0.2;
      this.goalFlash = { side: s, scorer, assist, own };
      if (scorer) scorer.celebrate = 3;
      for (const a of this.active(s)) a.celebrate = 3;
      this.state = 'goal'; this.timer = 3.4;
      this.emit({ type: 'goal', side: s, agent: scorer, assist, own,
        text: own ? '¡Gol en propia puerta de ' + G.shortName(scorer.p) + '!' : '¡GOOOOL de ' + (scorer ? G.shortName(scorer.p) : '') + '!' + (assist ? ' Asistencia de ' + G.shortName(assist.p) + '.' : '') });
      for (const x of this.agents) x.recv = false;
      b.owner = null;
    }

    bestPass(a) {
      const s = a.side, d = this.dir(s), T = this.sides[s].tactics;
      let best = null;
      const myF = this.fwd(s, a.x);
      for (const m of this.agents) {
        if (m.off || m.side !== s || m === a) continue;
        const dd = dist(a.x, a.y, m.x, m.y);
        if (dd < 4 || dd > 50) continue;
        if (m.role === 'POR' && myF > 35) continue;
        let lane = 99, recvSpace = 99;
        for (const o of this.agents) {
          if (o.off || o.side === s) continue;
          const sd = segDist(o.x, o.y, a.x, a.y, m.x, m.y);
          if (sd.t > 0.08) lane = Math.min(lane, sd.d / (0.4 + sd.t));
          recvSpace = Math.min(recvSpace, dist(o.x, o.y, m.x, m.y));
        }
        const prog = this.fwd(s, m.x) - myF;
        const lofted = lane < 2.2 && dd > 15;
        let score = prog * 0.07 * (1 + T.ment * 0.25) + Math.min(lane, 5) * 0.35 + Math.min(recvSpace, 8) * 0.18 - dd * 0.025;
        if (lane < 1.3 && !lofted) score -= 3;
        if (lofted) score -= 0.9 - T.tempo * 0.2;
        if (this.fwd(s, m.x) > 85 && Math.abs(m.y - W / 2) < 15) score += 0.6; // zona de remate
        if (m.role === 'POR') score -= 1.2;
        if (prog < -5) score -= 0.4 * (1 + T.ment * 0.3);
        score += R() * 0.6;
        if (!best || score > best.score) best = { m, score, lofted, dd };
      }
      return best;
    }

    pass(a, isGK, choice) {
      const s = a.side, side = this.sides[s];
      if (!choice) choice = this.bestPass(a);
      if (!choice) return this.clear(a);
      const m = choice.m, b = this.ball;
      const dd = choice.dd;
      const passAttr = a.p.att.pas * (0.8 + a.stam / 500) + (a.p.traits.includes('Visión de juego') ? 4 : 0);
      const pr = this.pressureOn(a);
      const err = (1 - passAttr * a.mf / 110) * dd * 0.11 * (pr.min < 2 ? 1.6 : 1) + 0.2;
      const lofted = choice.lofted || isGK && dd > 30;
      const hs = lofted ? 15 + dd * 0.12 : null;
      let lead = lofted ? dd / hs : dd / 16;
      let tx = m.x + m.vx * lead * 0.8 + (R() - .5) * 2 * err;
      let ty = m.y + m.vy * lead * 0.8 + (R() - .5) * 2 * err;
      tx = clamp(tx, -1, L + 1); ty = clamp(ty, -1, W + 1);
      const pd = dist(a.x, a.y, tx, ty);
      const ux = (tx - a.x) / (pd || 1), uy = (ty - a.y) / (pd || 1);
      b.owner = null; b.flight = 'pass'; b.tx = tx; b.ty = ty; b.passer = a; b.passT = this.t; b.last = a;
      b.target = m; b.lofted = lofted;
      if (lofted) {
        const T = pd / hs;
        b.vx = ux * hs; b.vy = uy * hs; b.vz = 0.5 * GRAV * T; b.z = 0.11;
      } else {
        const v0 = Math.min(26, pd * 0.62 + 5);
        b.vx = ux * v0; b.vy = uy * v0; b.vz = 0;
      }
      for (const x of this.agents) x.recv = false;
      m.recv = true;
      a.kick = 0.3; a.cool = 0.5;
      side.stats.passes++; a.ev.pa++;
    }

    clear(a) {
      const s = a.side, d = this.dir(s), b = this.ball;
      const tx = a.x + d * (35 + R() * 15), ty = clamp(a.y + (R() - .5) * 40, 2, W - 2);
      const pd = dist(a.x, a.y, tx, ty), hs = 20, T = pd / hs;
      b.owner = null; b.flight = 'clear'; b.passer = null; b.last = a;
      b.vx = (tx - a.x) / T; b.vy = (ty - a.y) / T; b.vz = 0.5 * GRAV * T; b.z = 0.11;
      a.kick = 0.3; a.cool = 0.6;
      for (const x of this.agents) x.recv = false;
    }

    cross(a) {
      const s = a.side, gx = this.oppGoalX(s), d = this.dir(s);
      const targets = this.active(s).filter(m => m !== a && Math.abs(m.x - gx) < 18 && Math.abs(m.y - W / 2) < 14);
      const m = targets.length ? pick(targets) : this.active(s).filter(x => x !== a && x.role !== 'POR').sort((p, q) => this.fwd(s, q.x) - this.fwd(s, p.x))[0];
      const tx = gx - d * (6 + R() * 6), ty = W / 2 + (R() - .5) * 10;
      const b = this.ball, pd = dist(a.x, a.y, tx, ty), hs = 17, T = pd / hs;
      b.owner = null; b.flight = 'pass'; b.tx = tx; b.ty = ty; b.passer = a; b.passT = this.t; b.last = a; b.target = m; b.lofted = true;
      b.vx = (tx - a.x) / T; b.vy = (ty - a.y) / T; b.vz = 0.5 * GRAV * T + 0.8; b.z = 0.11;
      for (const x of this.agents) x.recv = false;
      if (m) m.recv = true;
      a.kick = 0.3;
      this.sides[s].stats.passes++; a.ev.pa++;
    }

    // ------------------------------------------------------------------ física
    moveAgents(dt) {
      for (const a of this.agents) {
        if (a.off) continue;
        let dx = a.tx - a.x, dy = a.ty - a.y;
        const dd = Math.hypot(dx, dy);
        const max = (5.3 + a.p.att.pac * 0.034 + (a.p.traits.includes('Velocista') ? 0.3 : 0)) * (0.68 + 0.32 * a.stam / 100) * (a.slow > 0 ? 0.55 : 1) * (a.inj ? 0.5 : 1) * (this.ball.owner === a ? 0.86 : 1);
        let sp = dd > 2.5 ? max * a.run : max * a.run * dd / 2.5;
        if (a.run < 0.7 && dd > 12) sp = max * 0.85;
        let vx = dd > 0.05 ? dx / dd * sp : 0, vy = dd > 0.05 ? dy / dd * sp : 0;
        // Separación entre jugadores
        for (const o of this.agents) {
          if (o === a || o.off) continue;
          const ox = a.x - o.x, oy = a.y - o.y, od = ox * ox + oy * oy;
          if (od < 1.4 && od > 0.0001) { const k = (1.2 - Math.sqrt(od)) * 2.5; vx += ox * k; vy += oy * k; }
        }
        const acc = 7 * dt;
        const ddx = vx - a.vx, ddy = vy - a.vy, dv = Math.hypot(ddx, ddy);
        if (dv > acc) { a.vx += ddx / dv * acc; a.vy += ddy / dv * acc; } else { a.vx = vx; a.vy = vy; }
        a.x += a.vx * dt; a.y += a.vy * dt;
        a.x = clamp(a.x, -3, L + 3); a.y = clamp(a.y, -3, W + 3);
        // Orientación: hacia donde corre, o hacia el balón si está parado
        const v = Math.hypot(a.vx, a.vy);
        let fx, fy;
        if (v > 0.6) { fx = a.vx / v; fy = a.vy / v; }
        else { const bx = this.ball.x - a.x, by = this.ball.y - a.y, bl = Math.hypot(bx, by) || 1; fx = bx / bl; fy = by / bl; }
        const turn = Math.min(1, dt * 8);
        a.fx += (fx - a.fx) * turn; a.fy += (fy - a.fy) * turn;
        const fl = Math.hypot(a.fx, a.fy) || 1; a.fx /= fl; a.fy /= fl;
      }
    }

    ballPhysics(dt) {
      const b = this.ball;
      if (b.flight === 'net') {
        b.x += b.vx * dt; b.y += b.vy * dt; b.z = Math.max(0.11, b.z + b.vz * dt); b.vz -= GRAV * dt;
        b.vx *= 0.92; b.vy *= 0.92;
        const gx = b.x > L / 2 ? L : 0;
        if (Math.abs(b.x - gx) > 1.9) b.x = gx + Math.sign(b.x - gx) * 1.9;
        if (b.z <= 0.11) { b.z = 0.11; b.vz = Math.abs(b.vz) * 0.3; }
        return;
      }
      const prevX = b.x;
      b.px = b.x; b.py = b.y;
      b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
      if (b.z > 0.11 || b.vz > 0) {
        b.vz -= GRAV * dt;
        b.vx *= (1 - 0.05 * dt); b.vy *= (1 - 0.05 * dt);
        if (b.z <= 0.11) {
          b.z = 0.11;
          if (Math.abs(b.vz) > 1.5) { b.vz = -b.vz * 0.48; b.vx *= 0.8; b.vy *= 0.8; } else b.vz = 0;
        }
      } else {
        const k = Math.exp(-0.6 * dt);
        b.vx *= k; b.vy *= k;
        if (Math.hypot(b.vx, b.vy) < 0.3) { b.vx = b.vy = 0; }
      }
      b.spin += Math.hypot(b.vx, b.vy) * dt * 3;
      if (b.flight === 'shot') {
        const gx = this.oppGoalX(b.shotSide);
        b.shotT += dt;
        if (b.outcome === 'block' && b.shotT > b.shotDur * 0.3) return this.resolveShot();
        const crossed = (prevX - gx) * (b.x - gx) <= 0 || Math.abs(b.x - gx) < 0.7;
        if (crossed && (b.outcome === 'goal' || b.outcome === 'save')) return this.resolveShot();
      }
    }

    checkControl() {
      const b = this.ball;
      if (b.owner || b.flight === 'shot') return;
      if (b.z > 2.6) return;
      const speed = Math.hypot(b.vx, b.vy);
      let best = null, bd = 99;
      for (const a of this.agents) {
        if (a.off) continue;
        const reach = a.role === 'POR' && this.inOwnBox(a) ? 1.7 : 1.1;
        const d = b.px !== undefined ? segDist(a.x, a.y, b.px, b.py, b.x, b.y).d : dist(a.x, a.y, b.x, b.y);
        if (d > reach) continue;
        if (b.z > 1.9 && !(a.role === 'POR' && this.inOwnBox(a))) {
          // Cabezazo
          if (b.flight === 'pass' && a.side === b.passer?.side && this.fwd(a.side, a.x) > L - 16) { this.header(a); return; }
          if (R() < 0.25) { this.headClear(a); return; }
          continue;
        }
        if (b.passer && a === b.passer && this.t - b.passT < 0.4) continue;
        if (d < bd) { bd = d; best = a; }
      }
      if (!best) return;
      const a = best;
      const intended = b.flight === 'pass' && b.target === a;
      const sameSide = b.passer && b.passer.side === a.side;
      if (b.flight === 'pass' && !sameSide) {
        // Intercepción: depende de la defensa del rival y de la velocidad del balón
        const p = clamp(0.04 + a.p.att.def / 450 - speed / 90, 0.015, 0.3) * (b.z > 0.8 ? 0.5 : 1);
        if (R() > p) return;
        a.ev.tk++; a.rating += 0.12;
        b.passer.ev.err++;
        this.giveBall(a);
        return;
      }
      if (b.flight === 'pass' && sameSide) {
        // Control: un mal control puede escaparse
        const ctrl = (a.p.att.dri + a.p.att.pas) / 2;
        const pMiss = clamp((speed - 9) / 60 + (80 - ctrl) / 500, 0, 0.25);
        if (!intended || R() > pMiss) {
          b.passer.ev.pok++; this.sides[a.side].stats.passOk++;
          if (this.fwd(a.side, a.x) > L - 25) b.passer.ev.kp++;
          b.passer.rating += 0.008;
          if (b.lofted && b.z > 1.2 && this.fwd(a.side, a.x) > L - 15 && a.role !== 'POR') { this.header(a); return; }
          this.giveBall(a);
          a.cool = Math.max(a.cool, 0.15);
        } else { b.vx *= -0.2; b.vy *= -0.2; b.flight = null; }
        return;
      }
      this.giveBall(a);
    }

    inOwnBox(a) { return this.fwd(a.side, a.x) < 16.5 && Math.abs(a.y - W / 2) < 20.16; }

    header(a) {
      const s = a.side, gx = this.oppGoalX(s);
      const dg = dist(a.x, a.y, gx, W / 2);
      if (dg > 16) return this.headClear(a);
      // Remate de cabeza: calidad según físico/altura
      const b = this.ball;
      b.owner = a; // momentáneo para el disparo
      const xgBase = this.estXG(a, a.x, a.y) * 0.6 * (0.7 + (a.p.att.phy + (a.p.height - 175) * 1.5) / 200);
      const gk = this.gk(1 - s);
      const side = this.sides[s];
      side.stats.shots++; side.stats.xg += xgBase; a.ev.sh++;
      let pGoal = clamp(xgBase * (0.6 + a.p.att.sho / 200) * (1.28 - (gk ? gk.p.att.gk : 30) / 180), 0.01, 0.5);
      const outcome = R() < pGoal ? 'goal' : R() < 0.45 ? 'save' : 'miss';
      if (outcome !== 'miss') side.stats.onT++;
      const d = this.dir(s);
      const ty = outcome === 'goal' ? W / 2 + (R() - .5) * 6 : outcome === 'save' ? W / 2 + (R() - .5) * 4 : W / 2 + (R() < .5 ? -1 : 1) * (GOAL_HW + 0.5 + R() * 2);
      const tz = outcome === 'miss' && R() < .5 ? BAR + 0.4 : 0.4 + R() * 1.6;
      const tx = gx + d * (outcome === 'goal' ? 1 : outcome === 'miss' ? 2 : 0);
      const T = dist(a.x, a.y, tx, ty) / 15;
      b.owner = null; b.flight = 'shot'; b.shotSide = s; b.outcome = outcome; b.shooter = a; b.last = a;
      b.vx = (tx - b.x) / T; b.vy = (ty - b.y) / T; b.vz = (tz - b.z + 0.5 * GRAV * T * T) / T; b.shotT = 0; b.shotDur = T;
      if (gk) { b.gkX = gx - d * 0.6; b.gkY = outcome === 'save' ? ty : W / 2 + (ty - W / 2) * 0.4; gk.dive = T + 0.4; gk.diveDir = Math.sign(ty - gk.y) || 1; gk.diveH = tz; }
      a.header = 0.5;
      for (const x of this.agents) x.recv = false;
      this.emit({ type: 'shot', side: s, agent: a, text: '¡Remate de cabeza de ' + G.shortName(a.p) + '!' });
    }

    headClear(a) {
      const b = this.ball, d = this.dir(a.side);
      b.owner = null; b.flight = null; b.last = a; b.passer = null;
      b.vx = d * (8 + R() * 8); b.vy = (R() - .5) * 12; b.vz = 4 + R() * 3;
      a.header = 0.5;
    }

    checkBounds() {
      const b = this.ball;
      if (b.owner && b.owner.role === 'POR') return;
      const out = b.y < -0.11 || b.y > W + 0.11;
      if (out) {
        const s = b.last ? 1 - b.last.side : 0;
        const x = clamp(b.x, 1, L - 1), y = b.y < 0 ? 0.2 : W - 0.2;
        if (b.flight === 'pass' && b.passer) b.passer.ev.err++;
        this.freeze('setpiece', 1.2, () => {
          const taker = this.active(s).filter(a => a.role !== 'POR').sort((p, q) => dist(p.x, p.y, x, y) - dist(q.x, q.y, x, y))[0];
          this.placeFor(s, x, y, taker);
          taker.fx = 0; taker.fy = y < 1 ? 1 : -1;
        });
        return;
      }
      if (b.x < 0 || b.x > L) {
        const gx = b.x < 0 ? 0 : L;
        // ¿Gol no previsto (rebote dentro de la portería)?
        if (Math.abs(b.y - W / 2) < GOAL_HW && b.z < BAR && b.flight !== 'shot') {
          const scoringSide = this.ownGoalX(0) === gx ? 1 : 0;
          return this.goal(scoringSide, b.last && b.last.side === scoringSide ? b.last : b.last);
        }
        const defSide = this.ownGoalX(0) === gx ? 0 : 1;
        const lastWasDef = b.last && b.last.side === defSide;
        if (b.flight === 'shot' && b.outcome === 'miss') {
          if (R() < 0.25) { this.emit({ type: 'miss', side: b.shotSide, text: 'El disparo toca en un defensa y sale a córner.' }); return this.setCorner(b.shotSide, b.y < W / 2 ? 0.5 : W - 0.5); }
          this.emit({ type: 'miss', side: b.shotSide, text: 'El disparo se marcha fuera.' });
        }
        if (lastWasDef && b.flight !== 'shot') return this.setCorner(1 - defSide, b.y < W / 2 ? 0.5 : W - 0.5);
        // Saque de puerta
        const gk = this.gk(defSide);
        this.freeze('setpiece', 1.5, () => {
          if (!gk) return;
          gk.x = gx + (gx === 0 ? 5 : -5); gk.y = W / 2 + (R() - .5) * 8;
          Object.assign(b, { x: gk.x, y: gk.y, z: 0 });
          this.giveBall(gk); gk.holdT = 0.8; gk.cool = 0.9;
        });
      }
    }

    setCorner(s, y) {
      this.sides[s].stats.corners++;
      this.emit({ type: 'corner', side: s, text: 'Saque de esquina para ' + this.sides[s].club.name + '.' });
      const gx = this.oppGoalX(s);
      this.freeze('setpiece', 1.8, () => {
        // Subir rematadores al área
        const d = this.dir(s);
        const attackers = this.active(s).filter(a => a.role !== 'POR').sort((p, q) => (q.p.att.phy + q.p.height / 3) - (p.p.att.phy + p.p.height / 3));
        attackers.slice(0, 5).forEach((a, k) => { a.x = gx - d * (5 + R() * 9); a.y = W / 2 + (k - 2) * 3 + (R() - .5) * 2; });
        for (const o of this.active(1 - s)) if (o.role !== 'POR' && DEF_ROLES.concat(['MCD']).includes(o.role)) { o.x = gx - d * (3 + R() * 9); o.y = W / 2 + (R() - .5) * 16; }
        const taker = this.bestOf(s, 'pas');
        this.placeFor(s, gx - d * 0.4, y, taker);
        taker.setPiece = 'corner'; taker.holdT = 0.6; taker.cool = 0.6;
      });
    }

    // ------------------------------------------------------------------ cambios y tácticas
    // Charla: modifica el rendimiento del equipo durante el resto del partido.
    teamTalk(si, kind) {
      const side = this.sides[si];
      const diff = side.score - this.sides[1 - si].score;
      const eff = { calma: diff >= 0 ? 1.02 : 1.0, exigir: diff < 0 ? 1.05 : 0.99, animar: 1.025, felicitar: diff > 0 ? 1.03 : 0.97 }[kind] || 1;
      side.boost = (side.boost || 1) * eff;
      for (const a of this.agents) if (a.side === si) { a.mf *= eff; if (kind === 'calma') a.stam = Math.min(100, a.stam + 4); }
      return eff;
    }

    setTactics(si, t) { Object.assign(this.sides[si].tactics, t); }

    setFormation(si, f) {
      const side = this.sides[si];
      side.formation = f;
      const F = G.FORMATIONS[f].slice();
      const ags = this.agents.filter(a => a.side === si && !a.off);
      // Asignación voraz por idoneidad
      const slots = F.map((sl, k) => ({ sl, k, taken: false }));
      const order = ags.slice().sort((p, q) => (p.role === 'POR' ? -1 : 0) - (q.role === 'POR' ? -1 : 0));
      for (const a of order) {
        let best = null, bv = -1;
        for (const sl of slots) {
          if (sl.taken) continue;
          const v = G.ovrAt(a.p, sl.sl[0]) + (sl.sl[0] === a.role ? 3 : 0);
          if (v > bv) { bv = v; best = sl; }
        }
        if (!best) continue;
        best.taken = true; a.role = best.sl[0]; a.bx = best.sl[1]; a.by = best.sl[2];
      }
      this.emit({ type: 'tactic', side: si, text: side.club.name + ' cambia a ' + f + '.' });
    }

    substitute(si, outAgent, inPlayer) {
      const side = this.sides[si];
      if (side.subsLeft <= 0 || outAgent.off) return false;
      const idx = side.bench.indexOf(inPlayer);
      if (idx < 0) return false;
      side.bench.splice(idx, 1);
      side.used.push(outAgent);
      const na = this.makeAgent(side, inPlayer, [outAgent.role, outAgent.bx, outAgent.by]);
      na.x = outAgent.x; na.y = clamp(outAgent.y, 0, W); na.sub = true; na.minIn = this.minute();
      outAgent.off = true; outAgent.subbedOff = true; outAgent.minOut = this.minute();
      if (this.ball.owner === outAgent) { this.ball.owner = null; }
      na.x = this.ball.x < L / 2 ? L / 2 + 5 : L / 2 - 5; na.y = -1;
      this.agents.push(na);
      side.subsLeft--; side.subsUsed++;
      this.emit({ type: 'sub', side: si, text: 'Cambio en ' + side.club.name + ': entra ' + G.shortName(inPlayer.p || inPlayer) + ', sale ' + G.shortName(outAgent.p) + '.' });
      return na;
    }

    aiSubs() {
      const m = this.minute();
      if (m < 55) return;
      for (const side of this.sides) {
        if (side.user || side.subsLeft <= 0 || side.subsUsed >= 4) continue;
        const ags = this.agents.filter(a => a.side === side.i && !a.off && a.role !== 'POR');
        for (const a of ags) {
          if (side.subsLeft <= 0) break;
          if (!(a.inj || a.stam < 48 || (m > 65 && a.rating < 5.6 && R() < 0.01))) continue;
          const cand = side.bench.filter(p => p.pos !== 'POR' && !p.inj).sort((p, q) => G.ovrAt(q, a.role) - G.ovrAt(p, a.role))[0];
          if (cand) this.substitute(side.i, a, cand);
        }
      }
      // Lesionados en el equipo del usuario: aviso (el usuario decide)
    }

    // ------------------------------------------------------------------ final
    finish() {
      const [h, a] = this.sides;
      this.emit({ type: 'end', text: 'Final del partido. ' + this.scoreText() });
      for (const ag of this.agents) {
        const side = this.sides[ag.side], opp = this.sides[1 - ag.side];
        const passPct = ag.ev.pa ? ag.ev.pok / ag.ev.pa : 0.75;
        ag.rating += (passPct - 0.8) * 1.2 + Math.min(ag.ev.kp * 0.1, 0.5) + Math.min(ag.ev.drb * 0.03, 0.3) + Math.min(ag.ev.sh * 0.04, 0.2) + Math.min(ag.ev.tk * 0.04, 0.4) - ag.ev.err * 0.06;
        if (ag.rating > 7) ag.rating = 7 + (ag.rating - 7) * 0.7;
        if (opp.score === 0 && ['POR', 'DFC', 'LD', 'LI'].includes(ag.role)) ag.rating += 0.6;
        if (side.score > opp.score) ag.rating += 0.3; else if (side.score < opp.score) ag.rating -= 0.25;
        ag.rating = clamp(Math.round((ag.rating + (R() - 0.5) * 0.4) * 10) / 10, 3, 10);
      }
      this.result = this.buildResult();
    }

    buildResult() {
      const total = this.sides[0].stats.poss + this.sides[1].stats.poss || 1;
      const players = this.agents.map(a => ({
        id: a.p.id, side: a.side, rating: a.rating, g: a.ev.g, a: a.ev.a, yc: a.ev.yc, red: !!a.sentOff, inj: a.inj,
        mins: a.sub ? 90 - (a.minIn || 0) : a.subbedOff ? (a.minOut || 0) : 90, stam: a.stam
      }));
      let mvp = players.slice().sort((p, q) => q.rating - p.rating)[0];
      return {
        hg: this.sides[0].score, ag: this.sides[1].score,
        poss: [Math.round(this.sides[0].stats.poss / total * 100), 100 - Math.round(this.sides[0].stats.poss / total * 100)],
        stats: this.sides.map(s => ({ ...s.stats })),
        players, mvp: mvp && mvp.id,
        events: this.events.filter(e => ['goal', 'red', 'yellow', 'sub', 'injury', 'penalty'].includes(e.type)).map(e => ({ min: e.min, type: e.type, side: e.side, text: e.text, pid: e.agent && e.agent.p.id, aid: e.assist && e.assist.p.id, own: e.own }))
      };
    }

    // Simular el resto del partido sin dibujar.
    simulateToEnd(onHalf) {
      let guard = 0;
      while (this.state !== 'end' && guard++ < 200000) {
        this.step(1 / 20);
        if (this.state === 'half' && onHalf) { onHalf(this); onHalf = null; }
      }
      return this.result;
    }
  }

  G.Match = Match;
  G.PITCH = { L, W, GOAL_HW, BAR };

  // Tanda de penaltis (para eliminatorias).
  G.penaltyShootout = function (home, away) {
    const takers = s => s.xi.filter(p => p.pos !== 'POR').sort((a, b) => b.att.sho - a.att.sho);
    const gkOf = s => s.xi.find(p => p.pos === 'POR') || s.xi[0];
    const th = takers(home), ta = takers(away);
    const gh = gkOf(home), ga = gkOf(away);
    let sh = 0, sa = 0;
    const p = (sho, gk) => clamp(0.74 + (sho - gk) / 300, 0.55, 0.9);
    for (let i = 0; i < 5; i++) {
      if (R() < p(th[i % th.length].att.sho, ga.att.gk)) sh++;
      if (R() < p(ta[i % ta.length].att.sho, gh.att.gk)) sa++;
    }
    let k = 5;
    while (sh === sa && k < 30) {
      const a = R() < p(th[k % th.length].att.sho, ga.att.gk), b = R() < p(ta[k % ta.length].att.sho, gh.att.gk);
      sh += a; sa += b; k++;
    }
    return [sh, sa];
  };
})();
