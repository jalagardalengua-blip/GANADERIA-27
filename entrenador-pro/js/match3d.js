// Render 3D del estadio y del partido (Three.js r128).
// Ejes: x de la simulación → X, altura → Y, y de la simulación → Z (centrado).
(function () {
  const { L, W, GOAL_HW, BAR } = G.PITCH;
  const SKIN = ['#f1c9a5', '#e0ac85', '#c68863', '#8d5a3b', '#5c3a24'];
  const HAIR = ['#1b1410', '#3b2516', '#6b4423', '#b88a4a', '#d9c08a', '#0d0d0d'];
  const toX = x => x - L / 2, toZ = y => y - W / 2;

  function canvasTex(w, h, draw, repeat) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    draw(cv.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  }

  // ------------------------------------------------------------------ texturas
  function pitchTexture(renderer) {
    const PX = 20, M = 6; // píxeles por metro y margen alrededor de las líneas
    const w = (L + M * 2) * PX, h = (W + M * 2) * PX;
    const t = canvasTex(w, h, (g) => {
      // Césped con franjas de corte
      const stripes = 18;
      for (let i = 0; i < stripes; i++) {
        g.fillStyle = i % 2 ? '#3d7a2c' : '#468a33';
        g.fillRect(i * w / stripes, 0, w / stripes + 1, h);
      }
      // Ruido de césped
      const img = g.getImageData(0, 0, w, h), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * 18;
        d[i] += n * 0.6; d[i + 1] += n; d[i + 2] += n * 0.4;
      }
      g.putImageData(img, 0, 0);
      // Desgaste en las áreas
      for (const gx of [M, M + L]) {
        const grd = g.createRadialGradient(gx * PX, (M + W / 2) * PX, 0, gx * PX, (M + W / 2) * PX, 9 * PX);
        grd.addColorStop(0, 'rgba(120,105,60,0.35)'); grd.addColorStop(1, 'rgba(120,105,60,0)');
        g.fillStyle = grd; g.fillRect(0, 0, w, h);
      }
      g.strokeStyle = 'rgba(245,245,240,0.92)'; g.lineWidth = 0.12 * PX;
      const X = x => (M + x) * PX, Y = y => (M + y) * PX;
      g.strokeRect(X(0), Y(0), L * PX, W * PX);
      g.beginPath(); g.moveTo(X(L / 2), Y(0)); g.lineTo(X(L / 2), Y(W)); g.stroke();
      g.beginPath(); g.arc(X(L / 2), Y(W / 2), 9.15 * PX, 0, Math.PI * 2); g.stroke();
      const dot = (x, y) => { g.beginPath(); g.arc(X(x), Y(y), 0.22 * PX, 0, Math.PI * 2); g.fillStyle = 'rgba(245,245,240,0.92)'; g.fill(); };
      dot(L / 2, W / 2);
      for (const side of [0, 1]) {
        const x0 = side ? L : 0, s = side ? -1 : 1;
        g.strokeRect(side ? X(L - 16.5) : X(0), Y(W / 2 - 20.16), 16.5 * PX, 40.32 * PX);
        g.strokeRect(side ? X(L - 5.5) : X(0), Y(W / 2 - 9.16), 5.5 * PX, 18.32 * PX);
        dot(x0 + s * 11, W / 2);
        g.beginPath();
        const a = Math.acos(5.5 / 9.15);
        if (side) g.arc(X(L - 11), Y(W / 2), 9.15 * PX, Math.PI - a, Math.PI + a);
        else g.arc(X(11), Y(W / 2), 9.15 * PX, -a, a);
        g.stroke();
        // Esquinas
        for (const yy of [0, W]) { g.beginPath(); g.arc(X(x0), Y(yy), 1 * PX, 0, Math.PI * 2); g.stroke(); }
      }
    });
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return { tex: t, w: L + M * 2, h: W + M * 2 };
  }

  function crowdTexture(colors) {
    return canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#1a1d24'; g.fillRect(0, 0, w, h);
      const pal = colors.concat(['#e9e4da', '#2a2f3a', '#b23a3a', '#d8b26e', '#4a5a7a', '#f3f0e8', '#3c4250']);
      for (let row = 0; row < 32; row++) {
        g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, row * 8 + 6, w, 2);
        for (let x = 0; x < w; x += 6) {
          if (Math.random() < 0.06) continue;
          g.fillStyle = Math.random() < 0.55 ? colors[Math.floor(Math.random() * colors.length)] : pal[Math.floor(Math.random() * pal.length)];
          g.fillRect(x + Math.random(), row * 8 + 1, 4, 4);
          g.fillStyle = SKIN[Math.floor(Math.random() * 5)];
          g.fillRect(x + 1, row * 8, 2, 2);
        }
      }
    }, [8, 3]);
  }

  function boardTexture(lines) {
    return canvasTex(2048, 64, (g, w, h) => {
      const seg = w / lines.length;
      lines.forEach((ln, i) => {
        g.fillStyle = ln.bg; g.fillRect(i * seg, 0, seg, h);
        g.fillStyle = ln.fg; g.font = 'bold italic 34px "Barlow Condensed", Arial Narrow, sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(ln.text, i * seg + seg / 2, h / 2 + 2, seg - 24);
      });
    }, [2, 1]);
  }

  function netTexture() {
    return canvasTex(128, 128, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 2;
      for (let i = 0; i <= w; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
    }, [6, 2]);
  }

  function ballTexture() {
    return canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#f7f7f2'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#16181d';
      for (let i = 0; i < 12; i++) {
        const x = (i % 6) * w / 6 + (i > 5 ? w / 12 : 0), y = i > 5 ? h * 0.7 : h * 0.3;
        g.beginPath();
        for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; g.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13); }
        g.fill();
      }
    });
  }

  function numberTexture(num, shirt, textColor) {
    return canvasTex(64, 64, (g, w, h) => {
      g.fillStyle = shirt; g.fillRect(0, 0, w, h);
      g.fillStyle = textColor; g.font = 'bold 40px "Barlow Condensed", Arial Narrow, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(num), w / 2, h / 2 + 3);
    });
  }

  function lum(hex) { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 0.3 + (n >> 8 & 255) * 0.59 + (n & 255) * 0.11) / 255; }

  // ------------------------------------------------------------------ estadio
  G.buildStadium = function (scene, renderer, opts = {}) {
    const homeColors = opts.colors || ['#1f6feb', '#ffffff'];
    const group = new THREE.Group();
    scene.add(group);
    // Césped
    const pt = pitchTexture(renderer);
    const pitch = new THREE.Mesh(new THREE.PlaneGeometry(pt.w, pt.h), new THREE.MeshStandardMaterial({ map: pt.tex, roughness: 0.92, metalness: 0 }));
    pitch.rotation.x = -Math.PI / 2; pitch.receiveShadow = true;
    group.add(pitch);
    const apron = new THREE.Mesh(new THREE.PlaneGeometry(150, 110), new THREE.MeshStandardMaterial({ color: '#2f5f24', roughness: 1 }));
    apron.rotation.x = -Math.PI / 2; apron.position.y = -0.02; apron.receiveShadow = true;
    group.add(apron);
    // Pista alrededor
    const track = new THREE.Mesh(new THREE.RingGeometry(1, 1, 4), new THREE.MeshStandardMaterial({ color: '#2b3a2a' }));
    track.visible = false; group.add(track);

    // Porterías
    const postMat = new THREE.MeshStandardMaterial({ color: '#f4f4f4', roughness: 0.4 });
    const netMat = new THREE.MeshBasicMaterial({ map: netTexture(), transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0.8 });
    const goals = [];
    for (const side of [0, 1]) {
      const g = new THREE.Group();
      const s = side ? 1 : -1;
      const postGeo = new THREE.CylinderGeometry(0.06, 0.06, BAR, 12);
      for (const zz of [-GOAL_HW, GOAL_HW]) {
        const post = new THREE.Mesh(postGeo, postMat); post.position.set(0, BAR / 2, zz); post.castShadow = true; g.add(post);
      }
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, GOAL_HW * 2 + 0.12, 12), postMat);
      bar.rotation.x = Math.PI / 2; bar.position.set(0, BAR, 0); bar.castShadow = true; g.add(bar);
      const depth = 2.0;
      const back = new THREE.Mesh(new THREE.PlaneGeometry(GOAL_HW * 2, BAR), netMat); back.position.set(s * depth, BAR / 2, 0); back.rotation.y = Math.PI / 2; g.add(back);
      const top = new THREE.Mesh(new THREE.PlaneGeometry(depth, GOAL_HW * 2), netMat); top.rotation.x = Math.PI / 2; top.position.set(s * depth / 2, BAR, 0); g.add(top);
      for (const zz of [-GOAL_HW, GOAL_HW]) { const sideN = new THREE.Mesh(new THREE.PlaneGeometry(depth, BAR), netMat); sideN.position.set(s * depth / 2, BAR / 2, zz); g.add(sideN); }
      g.position.x = side ? L / 2 : -L / 2;
      g.userData.back = back;
      group.add(g); goals.push(g);
    }
    // Banderines de córner
    const flagMat = new THREE.MeshStandardMaterial({ color: '#ffd23f' });
    for (const x of [-L / 2, L / 2]) for (const z of [-W / 2, W / 2]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6), postMat); pole.position.set(x, 0.75, z); group.add(pole);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), flagMat); fl.position.set(x + 0.2, 1.35, z); fl.material.side = THREE.DoubleSide; group.add(fl);
    }
    // Vallas publicitarias LED
    const boards = boardTexture([
      { bg: '#0b1d3a', fg: '#ffffff', text: 'ELITEMANAGER' },
      { bg: homeColors[0], fg: lum(homeColors[0]) > 0.6 ? '#111' : '#fff', text: (opts.homeName || 'FÚTBOL').toUpperCase() },
      { bg: '#f2f2f2', fg: '#0b1d3a', text: 'TEMPORADA 2027' },
      { bg: '#1f6feb', fg: '#fff', text: 'TU CLUB · TU HISTORIA' }
    ]);
    const boardMat = new THREE.MeshBasicMaterial({ map: boards });
    const mkBoard = (len, x, z, ry) => { const b = new THREE.Mesh(new THREE.BoxGeometry(len, 0.9, 0.1), boardMat); b.position.set(x, 0.45, z); b.rotation.y = ry; group.add(b); return b; };
    const boardsList = [mkBoard(L + 6, 0, -W / 2 - 5, 0), mkBoard(L + 6, 0, W / 2 + 5, Math.PI), mkBoard(W - 4, -L / 2 - 5, 0, Math.PI / 2), mkBoard(W - 4, L / 2 + 5, 0, -Math.PI / 2)];

    // Gradas
    const crowd = crowdTexture(homeColors);
    const crowdMat = new THREE.MeshStandardMaterial({ map: crowd, roughness: 1 });
    const concrete = new THREE.MeshStandardMaterial({ color: '#2c313b', roughness: 0.9 });
    const roofMat = new THREE.MeshStandardMaterial({ color: '#cfd6df', roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide });
    function stand(len, dist, ry, tiers) {
      const s = new THREE.Group();
      let y = 0.5, d = dist;
      for (let t = 0; t < tiers; t++) {
        const depth = 18, rise = 11;
        const slope = new THREE.Mesh(new THREE.PlaneGeometry(len, Math.hypot(depth, rise)), crowdMat);
        slope.rotation.x = -Math.PI / 2 + Math.atan2(rise, depth);
        slope.position.set(0, y + rise / 2, -(d + depth / 2));
        s.add(slope);
        const front = new THREE.Mesh(new THREE.BoxGeometry(len, 1.4, 0.5), concrete);
        front.position.set(0, y + 0.3, -d); s.add(front);
        y += rise + 2.5; d += depth - 2;
      }
      const back = new THREE.Mesh(new THREE.BoxGeometry(len, y + 4, 1), concrete); back.position.set(0, (y + 4) / 2, -(d + 3)); s.add(back);
      const roofD = (d - dist) * 0.45 + 6;
      const roof = new THREE.Mesh(new THREE.PlaneGeometry(len + 4, roofD), roofMat);
      roof.rotation.x = Math.PI / 2 - 0.12; roof.position.set(0, y + 6, -(d + 3 - roofD / 2)); s.add(roof);
      // Iluminación bajo la cubierta
      const strip = new THREE.Mesh(new THREE.BoxGeometry(len, 0.3, 0.6), new THREE.MeshBasicMaterial({ color: '#fff7e0' }));
      strip.position.set(0, y + 4.2, -dist - 2); s.add(strip);
      s.rotation.y = ry;
      group.add(s);
    }
    stand(L + 10, W / 2 + 9, 0, 2);
    stand(L + 10, W / 2 + 9, Math.PI, 2);
    stand(W + 6, L / 2 + 9, -Math.PI / 2, 2);
    stand(W + 6, L / 2 + 9, Math.PI / 2, 2);
    // Esquinas de grada
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(26, 24, 26), concrete);
      c.position.set(sx * (L / 2 + 22), 12, sz * (W / 2 + 22)); group.add(c);
      // Torre de focos
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 48, 8), concrete);
      tower.position.set(sx * (L / 2 + 30), 24, sz * (W / 2 + 30)); group.add(tower);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 0.6), new THREE.MeshBasicMaterial({ color: '#fffbea' }));
      panel.position.set(sx * (L / 2 + 30), 49, sz * (W / 2 + 30)); panel.lookAt(0, 0, 0); group.add(panel);
    }
    // Banquillos (lado y negativo, junto a la línea de medio campo)
    const dugoutMat = new THREE.MeshStandardMaterial({ color: '#1d2633', roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#9fb6cf', transparent: true, opacity: 0.25, roughness: 0.1, side: THREE.DoubleSide });
    const seatMat = new THREE.MeshStandardMaterial({ color: homeColors[0], roughness: 0.6 });
    for (const sx of [-1, 1]) {
      const d = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(9, 0.3, 2.4), dugoutMat); base.position.y = 0.15; d.add(base);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.12, 2.8), glassMat); roof.position.y = 2.3; d.add(roof);
      const backw = new THREE.Mesh(new THREE.BoxGeometry(9.4, 2.3, 0.1), glassMat); backw.position.set(0, 1.15, -1.3); d.add(backw);
      for (let i = 0; i < 9; i++) { const seat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 0.55), seatMat); seat.position.set(-4 + i * 1, 0.55, -0.7); d.add(seat); }
      d.position.set(sx * 9, 0, -W / 2 - 3.6);
      group.add(d);
    }
    // Área técnica
    const techMat = new THREE.MeshBasicMaterial({ color: '#f5f5f0' });
    for (const sx of [-1, 1]) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.1), techMat); line.rotation.x = -Math.PI / 2; line.position.set(sx * 9, 0.01, -W / 2 - 1.2); group.add(line);
    }
    return { group, goals, boards: boardsList, boardTex: boards };
  };

  G.setupLights = function (scene, night) {
    scene.background = new THREE.Color(night ? '#0a1222' : '#7fa7d6');
    scene.fog = new THREE.Fog(night ? '#0a1222' : '#9fbbe0', 140, 330);
    const hemi = new THREE.HemisphereLight(night ? '#9fb4d8' : '#dbe9ff', '#2a3a1e', night ? 0.55 : 0.75);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(night ? '#fff6e6' : '#fff2dc', night ? 1.25 : 1.6);
    sun.position.set(-40, 80, -30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera; sc.left = -65; sc.right = 65; sc.top = 50; sc.bottom = -50; sc.near = 10; sc.far = 200;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    if (night) {
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        const l = new THREE.PointLight('#fff8e8', 0.35, 220, 1.2); l.position.set(sx * 80, 48, sz * 64); scene.add(l);
      }
    }
    return { sun, hemi };
  };

  // ------------------------------------------------------------------ jugadores
  function makePlayerMesh(kit, p, isGK, num) {
    const shirtC = isGK ? kit.gk : kit.shirt;
    const g = new THREE.Group();
    const sc = (p.height || 180) / 180;
    const shirt = new THREE.MeshStandardMaterial({ color: shirtC, roughness: 0.75 });
    const shorts = new THREE.MeshStandardMaterial({ color: isGK ? kit.gkShorts : kit.shorts, roughness: 0.8 });
    const socks = new THREE.MeshStandardMaterial({ color: isGK ? kit.gk : kit.socks, roughness: 0.8 });
    const skin = new THREE.MeshStandardMaterial({ color: SKIN[p.skin || 0], roughness: 0.7 });
    const hair = new THREE.MeshStandardMaterial({ color: HAIR[p.hair || 0], roughness: 0.9 });
    const boot = new THREE.MeshStandardMaterial({ color: ['#111', '#f4f4f4', '#ff3b30', '#1f6feb', '#ffd60a'][p.id % 5], roughness: 0.5 });
    const body = new THREE.Group(); g.add(body);
    const hips = new THREE.Group(); hips.position.y = 0.95; body.add(hips);
    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.17, 0.62, 12), shirt);
    torso.scale.set(1.1, 1, 0.68); torso.position.y = 0.42; torso.castShadow = true; hips.add(torso);
    const shorts1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.26, 12), shorts);
    shorts1.scale.set(1.1, 1, 0.75); shorts1.position.y = 0.04; shorts1.castShadow = true; hips.add(shorts1);
    // Dorsal
    const nt = numberTexture(num, shirtC, lum(shirtC) > 0.6 ? '#111' : '#fff');
    const back = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ map: nt }));
    back.position.set(0, 0.46, -0.125); back.rotation.y = Math.PI; hips.add(back);
    // Cabeza
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.1, 8), skin); neck.position.y = 0.77; hips.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 12), skin); head.scale.set(0.92, 1.08, 1); head.position.y = 0.9; head.castShadow = true; hips.add(head);
    const hairM = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI * (0.38 + (p.hair % 3) * 0.06)), hair); hairM.position.y = 0.915; hairM.scale.set(0.95, 1.05, 1.02); hips.add(hairM);
    // Brazos
    const arms = [];
    for (const s of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(s * 0.25, 0.68, 0); hips.add(sh);
      const up = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.3, 8), isGK ? shirt : (kit.longSleeve ? shirt : shirt)); up.position.y = -0.15; up.castShadow = true; sh.add(up);
      const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.28, 8), isGK ? shirt : skin); fore.position.y = -0.42; sh.add(fore);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(isGK ? 0.065 : 0.045, 8, 6), isGK ? new THREE.MeshStandardMaterial({ color: '#e8e8e8' }) : skin); hand.position.y = -0.58; sh.add(hand);
      arms.push(sh);
    }
    // Piernas
    const legs = [];
    for (const s of [-1, 1]) {
      const hip = new THREE.Group(); hip.position.set(s * 0.1, 0, 0); hips.add(hip);
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.44, 8), skin); thigh.position.y = -0.24; thigh.castShadow = true; hip.add(thigh);
      const knee = new THREE.Group(); knee.position.y = -0.46; hip.add(knee);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.42, 8), socks); shin.position.y = -0.21; shin.castShadow = true; knee.add(shin);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.24), boot); shoe.position.set(0, -0.44, 0.05); shoe.castShadow = true; knee.add(shoe);
      legs.push({ hip, knee });
    }
    g.scale.setScalar(sc);
    g.userData = { body, hips, arms, legs, phase: Math.random() * 6, sc };
    return g;
  }

  // ------------------------------------------------------------------ vista del partido
  class Match3D {
    constructor(container, match, opts = {}) {
      this.c = container; this.m = match; this.opts = opts;
      this.speed = 1; this.paused = false; this.cam = opts.camera || 'tv';
      this.replay = null; this.rec = []; this.recMax = 300;
      const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
      r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
      container.appendChild(r.domElement);
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 600);
      G.setupLights(this.scene, opts.night !== false);
      const home = match.sides[0];
      this.stadium = G.buildStadium(this.scene, r, { colors: home.club.colors, homeName: home.club.name });
      // Balón
      this.ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), new THREE.MeshStandardMaterial({ map: ballTexture(), roughness: 0.45 }));
      this.ballMesh.castShadow = true; this.scene.add(this.ballMesh);
      // Marcador del poseedor
      this.ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.7, 32), new THREE.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: 0.85 }));
      this.ring.rotation.x = -Math.PI / 2; this.ring.position.y = 0.02; this.scene.add(this.ring);
      this.meshes = new Map();
      this.benchMeshes = [];
      this.buildBench();
      this.camPos = new THREE.Vector3(0, 30, -70); this.camLook = new THREE.Vector3();
      this.label = document.createElement('div'); this.label.className = 'm3d-label'; container.appendChild(this.label);
      this.resize = this.resize.bind(this);
      window.addEventListener('resize', this.resize);
      this.resize();
      this.zoom = 1;
      r.domElement.addEventListener('wheel', e => { e.preventDefault(); this.zoom = Math.min(2.2, Math.max(0.5, this.zoom * (e.deltaY > 0 ? 1.08 : 0.93))); }, { passive: false });
      // Arrastrar para girar la cabeza en el banquillo / la cámara libre
      this.yaw = 0; let drag = null;
      r.domElement.addEventListener('pointerdown', e => { drag = { x: e.clientX, yaw: this.yaw }; });
      window.addEventListener('pointerup', () => { drag = null; });
      r.domElement.addEventListener('pointermove', e => { if (drag) this.yaw = drag.yaw + (e.clientX - drag.x) * 0.004; });
      this.last = performance.now(); this.acc = 0;
      this.loop = this.loop.bind(this);
      this.running = true;
      requestAnimationFrame(this.loop);
    }

    buildBench() {
      // Suplentes sentados en el banquillo
      for (const s of this.m.sides) {
        const sx = s.i === 0 ? -1 : 1;
        s.bench.slice(0, 9).forEach((p, k) => {
          const mesh = makePlayerMesh(s.kit, p, false, p.num || k + 12);
          const u = mesh.userData;
          u.legs.forEach(l => { l.hip.rotation.x = -1.4; l.knee.rotation.x = 1.4; });
          u.hips.position.y = 0.6;
          mesh.position.set(sx * 9 - 4 + k, 0.05, -W / 2 - 4.2);
          this.scene.add(mesh);
          this.benchMeshes.push({ mesh, p });
        });
      }
      // Entrenador del usuario de pie en el área técnica
      const us = this.m.sides.find(s => s.user) || this.m.sides[0];
      const coachKit = { shirt: '#14171d', shorts: '#14171d', socks: '#14171d', gk: '#14171d', gkShorts: '#14171d' };
      this.coach = makePlayerMesh(coachKit, { height: 182, skin: 1, hair: 1, id: 0 }, false, '');
      this.coach.position.set((us.i === 0 ? -1 : 1) * 9, 0, -W / 2 - 1.8);
      this.scene.add(this.coach);
      this.userDugoutX = (us.i === 0 ? -1 : 1) * 9;
    }

    refreshBench() {
      for (const b of this.benchMeshes) {
        const side = this.m.sides.find(s => s.bench.includes(b.p) || s.used.some(a => a.p === b.p));
        b.mesh.visible = !!this.m.sides.find(s => s.bench.includes(b.p));
      }
    }

    resize() {
      const w = this.c.clientWidth || 800, h = this.c.clientHeight || 450;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    }

    setCamera(c) { this.cam = c; this.yaw = 0; }

    dispose() {
      this.running = false;
      window.removeEventListener('resize', this.resize);
      this.renderer.dispose();
      this.renderer.forceContextLoss && this.renderer.forceContextLoss();
      this.c.innerHTML = '';
    }

    meshFor(a) {
      let m = this.meshes.get(a);
      if (!m) {
        const side = this.m.sides[a.side];
        m = makePlayerMesh(side.kit, a.p, a.role === 'POR', a.p.num || '');
        this.scene.add(m); this.meshes.set(a, m);
      }
      return m;
    }

    snapshot() {
      const ag = this.m.agents.map(a => [a.x, a.y, a.fx, a.fy, a.vx, a.vy, a.off ? 1 : 0, a.kick, a.dive, a.diveDir || 0, a.celebrate]);
      const b = this.m.ball;
      return { ag, b: [b.x, b.y, b.z, b.spin], own: b.owner ? this.m.agents.indexOf(b.owner) : -1 };
    }

    startReplay() {
      if (this.rec.length < 30) return;
      this.replay = { frames: this.rec.slice(-210), i: 0, cam: Math.random() < 0.5 ? 'replayGoal' : 'replaySide' };
      this.opts.onReplay && this.opts.onReplay(true);
    }

    loop(now) {
      if (!this.running) return;
      requestAnimationFrame(this.loop);
      let dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
      const STEP = 1 / 30;
      if (this.replay) {
        this.replay.i += dt * 30 * 0.55;
        const f = this.replay.frames[Math.floor(this.replay.i)];
        if (!f) { this.replay = null; this.opts.onReplay && this.opts.onReplay(false); }
        else { this.applyFrame(f, dt * 0.55); this.updateCamera(dt, f); this.renderer.render(this.scene, this.camera); return; }
      }
      if (!this.paused && this.m.state !== 'end') {
        this.acc += dt * this.speed;
        let n = 0;
        while (this.acc >= STEP && n < 12) {
          const prevState = this.m.state;
          this.m.step(STEP); this.acc -= STEP; n++;
          this.rec.push(this.snapshot()); if (this.rec.length > this.recMax) this.rec.shift();
          if (prevState === 'play' && this.m.state === 'goal' && this.opts.replays !== false) { this.pendingReplay = 1.6; }
          if (this.m.state === 'half' || this.m.state === 'end') break;
        }
        if (this.pendingReplay) { this.pendingReplay -= dt; if (this.pendingReplay <= 0) { this.pendingReplay = 0; this.startReplay(); } }
      }
      const f = this.snapshot();
      this.applyFrame(f, this.paused ? 0 : dt * this.speed);
      this.updateCamera(dt, f);
      this.renderer.render(this.scene, this.camera);
      this.opts.onFrame && this.opts.onFrame();
    }

    applyFrame(f, dt) {
      const ags = this.m.agents;
      f.ag.forEach((s, i) => {
        const a = ags[i]; if (!a) return;
        const mesh = this.meshFor(a);
        const [x, y, fx, fy, vx, vy, off, kick, dive, diveDir, cele] = s;
        mesh.visible = !off && x > -5;
        if (!mesh.visible) return;
        mesh.position.set(toX(x), 0, toZ(y));
        mesh.rotation.y = Math.atan2(fx, fy);
        this.animate(mesh, Math.hypot(vx, vy), dt, kick, dive, diveDir, cele, a);
      });
      const [bx, by, bz, spin] = f.b;
      this.ballMesh.position.set(toX(bx), bz + 0.02, toZ(by));
      this.ballMesh.rotation.x = spin; this.ballMesh.rotation.z = spin * 0.3;
      const owner = f.own >= 0 ? ags[f.own] : null;
      this.ring.visible = !!owner && !this.replay;
      if (owner) { this.ring.position.x = toX(f.ag[f.own][0]); this.ring.position.z = toZ(f.ag[f.own][1]); this.ring.material.color.set(owner.side === 0 ? '#ffd23f' : '#5ac8fa'); }
      // Etiqueta con el nombre
      if (owner && !this.replay && this.cam !== 'aerea') {
        const v = new THREE.Vector3(toX(f.ag[f.own][0]), 2.4, toZ(f.ag[f.own][1])).project(this.camera);
        if (v.z < 1) {
          this.label.style.display = 'block';
          this.label.style.transform = 'translate(' + ((v.x + 1) / 2 * this.c.clientWidth) + 'px,' + ((1 - v.y) / 2 * this.c.clientHeight) + 'px) translate(-50%,-100%)';
          this.label.textContent = owner.p.num + ' ' + owner.p.ln;
        } else this.label.style.display = 'none';
      } else this.label.style.display = 'none';
      // Red de la portería
      if (this.m.state === 'goal' && this.m.ball.flight === 'net') {
        const gi = this.m.ball.x > L / 2 ? 1 : 0;
        const back = this.stadium.goals[gi].userData.back;
        back.scale.x = 1 + Math.sin(performance.now() / 60) * 0.03;
      }
      // Entrenador: gesticula
      if (this.coach) {
        const u = this.coach.userData; const t = performance.now() / 1000;
        this.coach.rotation.y = Math.atan2(toX(this.m.ball.x) - this.coach.position.x, toZ(this.m.ball.y) - this.coach.position.z) * 0.8;
        const shout = this.shoutT > 0;
        u.arms[0].rotation.x = shout ? -2.4 + Math.sin(t * 12) * 0.3 : -0.1;
        u.arms[1].rotation.x = shout ? -1.2 : -0.1;
        if (this.shoutT > 0) this.shoutT -= dt;
      }
    }

    shout() { this.shoutT = 2.2; }

    animate(mesh, sp, dt, kick, dive, diveDir, cele, a) {
      const u = mesh.userData;
      u.phase += dt * (2.2 + sp * 1.55);
      const amp = Math.min(1, sp / 7);
      const sw = Math.sin(u.phase) * (0.25 + amp * 0.75);
      u.legs[0].hip.rotation.x = sw; u.legs[1].hip.rotation.x = -sw;
      u.legs[0].knee.rotation.x = Math.max(0, -Math.cos(u.phase)) * (0.3 + amp * 1.1);
      u.legs[1].knee.rotation.x = Math.max(0, Math.cos(u.phase)) * (0.3 + amp * 1.1);
      u.arms[0].rotation.x = -sw * 0.8; u.arms[1].rotation.x = sw * 0.8;
      u.arms[0].rotation.z = -0.12; u.arms[1].rotation.z = 0.12;
      u.body.rotation.x = amp * 0.22;
      u.body.position.y = Math.abs(Math.sin(u.phase)) * 0.05 * amp;
      u.body.rotation.z = 0; u.body.position.x = 0;
      if (kick > 0) { const k = 1 - kick / 0.35; u.legs[1].hip.rotation.x = -1.4 * Math.sin(k * Math.PI); u.legs[1].knee.rotation.x = 0.6 * (1 - k); }
      if (dive > 0 && a.role === 'POR') {
        const k = Math.min(1, (1.2 - dive) * 2.2);
        u.body.rotation.z = -diveDir * 1.35 * k; u.body.position.x = diveDir * 0.9 * k; u.body.position.y = 0.3 * Math.sin(k * Math.PI);
        u.arms[0].rotation.x = u.arms[1].rotation.x = -3 * k;
      }
      if (cele > 0) {
        u.arms[0].rotation.x = u.arms[1].rotation.x = -2.8; u.arms[0].rotation.z = -0.5; u.arms[1].rotation.z = 0.5;
        u.body.position.y = Math.abs(Math.sin(performance.now() / 160)) * 0.35;
      }
    }

    updateCamera(dt, f) {
      const cam = this.camera;
      const [bx, by, bz] = f.b;
      const X = toX(bx), Z = toZ(by);
      let pos, look, fov = 32;
      const mode = this.replay ? this.replay.cam : this.cam;
      const us = this.m.sides.find(s => s.user) || this.m.sides[0];
      const ud = this.m.dir(us.i);
      switch (mode) {
        case 'banquillo': {
          // Vista del entrenador desde el área técnica, a la altura de los ojos.
          pos = new THREE.Vector3(this.userDugoutX + 0.6, 1.72, -W / 2 - 1.5);
          const base = Math.atan2(X - pos.x, Z - pos.z) + this.yaw;
          const dist = Math.hypot(X - pos.x, Z - pos.z);
          look = new THREE.Vector3(pos.x + Math.sin(base) * dist, Math.max(0.3, bz * 0.6), pos.z + Math.cos(base) * dist);
          fov = 52 / this.zoom;
          if (this.coach) this.coach.visible = false;
          this.camPos.copy(pos);
          this.camLook.lerp(look, Math.min(1, dt * 5));
          break;
        }
        case 'aerea':
          pos = new THREE.Vector3(X * 0.5, 72 * this.zoom, Z * 0.3 - 26 * this.zoom); look = new THREE.Vector3(X * 0.5, 0, Z * 0.3); fov = 45; break;
        case 'detras':
          pos = new THREE.Vector3(X - ud * 22 * this.zoom, 9 * this.zoom, Z * 0.7); look = new THREE.Vector3(X + ud * 12, 0, Z); fov = 50; break;
        case 'jugador': {
          const own = f.own >= 0 ? f.ag[f.own] : null;
          const px = own ? toX(own[0]) : X, pz = own ? toZ(own[1]) : Z;
          const fx = own ? own[2] : ud, fz = own ? own[3] : 0;
          pos = new THREE.Vector3(px - fx * 8 * this.zoom, 3.8 * this.zoom, pz - fz * 8 * this.zoom); look = new THREE.Vector3(px + fx * 6, 1, pz + fz * 6); fov = 55; break;
        }
        case 'replayGoal': {
          const gx = bx > L / 2 ? L / 2 : -L / 2, s = Math.sign(gx);
          pos = new THREE.Vector3(gx + s * 9, 3.2, Z * 0.3); look = new THREE.Vector3(X, 1, Z); fov = 50; break;
        }
        case 'replaySide':
          pos = new THREE.Vector3(X - 4, 5, Z - 16); look = new THREE.Vector3(X, 0.8, Z); fov = 40; break;
        case 'hero': {
          const t = performance.now() / 9000;
          pos = new THREE.Vector3(Math.cos(t) * 90, 34, Math.sin(t) * 70); look = new THREE.Vector3(0, 0, 0); fov = 45; break;
        }
        default: // tv
          pos = new THREE.Vector3(X * 0.82, 19 * this.zoom, -W / 2 - 30 * this.zoom); look = new THREE.Vector3(X * 0.86, 0, Z * 0.55); fov = 34;
      }
      if (mode !== 'banquillo') {
        if (this.coach) this.coach.visible = true;
        const k = this.replay ? 1 : Math.min(1, dt * 3);
        this.camPos.lerp(pos, mode === 'aerea' ? Math.min(1, dt * 2) : k);
        this.camLook.lerp(look, Math.min(1, dt * 4));
      }
      cam.position.copy(this.camPos);
      cam.lookAt(this.camLook);
      if (Math.abs(cam.fov - fov) > 0.1) { cam.fov += (fov - cam.fov) * Math.min(1, dt * 4); cam.updateProjectionMatrix(); }
    }
  }
  G.Match3D = Match3D;
  G.makePlayerMesh = makePlayerMesh;

  // Escena decorativa del estadio que gira lentamente (portada y cabecera del menú).
  G.HeroStadium = class {
    constructor(container, colors, name) {
      this.c = container;
      const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.shadowMap.enabled = false;
      container.appendChild(r.domElement);
      this.scene = new THREE.Scene();
      G.setupLights(this.scene, true);
      G.buildStadium(this.scene, r, { colors, homeName: name });
      this.camera = new THREE.PerspectiveCamera(40, 1, 0.5, 600);
      this.resize = this.resize.bind(this); window.addEventListener('resize', this.resize); this.resize();
      this.running = true;
      const loop = t => {
        if (!this.running) return;
        requestAnimationFrame(loop);
        if (!this.c.isConnected) return; // fuera de pantalla: no dibujar
        const a = t / 14000;
        this.camera.position.set(Math.cos(a) * 165, 92, Math.sin(a) * 140);
        this.camera.lookAt(0, -6, 0);
        r.render(this.scene, this.camera);
      };
      requestAnimationFrame(loop);
    }
    resize() { const w = this.c.clientWidth || 600, h = this.c.clientHeight || 300; this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
    dispose() { this.running = false; window.removeEventListener('resize', this.resize); this.renderer.dispose(); }
  };
})();
