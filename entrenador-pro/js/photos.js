// "Fotos" del juego: imágenes generadas con el motor 3D (estadio, jugadores con la
// equipación del club, pizarra táctica, entrenamiento, trofeo…). Se renderizan una
// vez por club y se guardan en memoria.
(function () {
  const W = 800, H = 480;
  const cache = {};
  let R = null, scene = null, cam = null, stadium = null, stadiumFor = null, props = null, lights = null;
  const queue = [];
  let busy = false;

  function rnd(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  function init() {
    if (R) return true;
    if (!window.THREE) return false;
    try {
      R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    } catch (e) { return false; }
    R.setSize(W, H); R.setPixelRatio(1);
    R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping;
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    scene = new THREE.Scene();
    cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 700);
    const hemi = new THREE.HemisphereLight('#dbe9ff', '#2a3a1e', 0.7);
    const sun = new THREE.DirectionalLight('#fff2dc', 1.5);
    sun.position.set(-40, 80, -30); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 45, bottom: -45, near: 10, far: 200 });
    sun.shadow.bias = -0.0005;
    const spot = new THREE.SpotLight('#fff3d6', 0, 40, 0.5, 0.6, 1);
    spot.position.set(0, 12, 6); spot.castShadow = true;
    scene.add(hemi, sun, spot, spot.target);
    lights = { hemi, sun, spot };
    props = new THREE.Group(); scene.add(props);
    return true;
  }

  function setStadium(club) {
    if (stadium && stadiumFor === club.id) return;
    if (stadium) scene.remove(stadium.group);
    stadium = G.buildStadium(scene, R, { colors: club.colors, homeName: club.name });
    stadium.group.traverse(o => { if (o.isMesh) o.receiveShadow = true; });
    stadiumFor = club.id;
  }

  function mood(kind) {
    const night = kind === 'night', dark = kind === 'dark';
    scene.background = new THREE.Color(dark ? '#05080f' : night ? '#0a1222' : '#86acd9');
    scene.fog = dark ? null : new THREE.Fog(night ? '#0a1222' : '#a9c4e6', 150, 340);
    lights.hemi.intensity = dark ? 0.12 : night ? 0.55 : 0.8;
    lights.sun.intensity = dark ? 0 : night ? 1.2 : 1.6;
    lights.spot.intensity = dark ? 2.4 : 0;
    if (stadium) stadium.group.visible = !dark;
  }

  function clearProps() { while (props.children.length) props.remove(props.children[0]); }

  function kitOf(club) { return { shirt: club.colors[0], shorts: club.colors[1], socks: club.colors[0], gk: '#f5d000', gkShorts: '#14171d' }; }

  // Jugador de la plantilla real si existe; si no, uno inventado.
  function person(club, i, opts = {}) {
    const ids = club.players || [];
    const p = ids.length ? G.C.world.players[ids[(i * 7) % ids.length]] : null;
    return p || { id: i + 1, height: 178 + (i % 5) * 3, skin: i % 5, hair: i % 6 };
  }

  function addPlayer(kit, p, x, z, ry, pose, num) {
    const m = G.makePlayerMesh(kit, p, false, num == null ? (p.num || '') : num);
    m.position.set(x, 0, z); m.rotation.y = ry;
    const u = m.userData;
    if (pose === 'run') { u.legs[0].hip.rotation.x = 0.7; u.legs[1].hip.rotation.x = -0.6; u.legs[1].knee.rotation.x = 1.0; u.arms[0].rotation.x = -0.6; u.arms[1].rotation.x = 0.6; u.body.rotation.x = 0.18; }
    if (pose === 'arms') { u.arms[0].rotation.z = -0.25; u.arms[1].rotation.z = 0.25; }
    if (pose === 'cross') { u.arms[0].rotation.x = -1.2; u.arms[0].rotation.z = 0.9; u.arms[1].rotation.x = -1.2; u.arms[1].rotation.z = -0.9; }
    if (pose === 'celebrate') { u.arms[0].rotation.x = -2.8; u.arms[1].rotation.x = -2.8; u.arms[0].rotation.z = -0.4; u.arms[1].rotation.z = 0.4; }
    m.traverse(o => { if (o.isMesh) o.castShadow = true; });
    props.add(m);
    return m;
  }

  function cone(x, z, color) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 12), new THREE.MeshStandardMaterial({ color: color || '#ff7a00', roughness: 0.6 }));
    c.position.set(x, 0.2, z); c.castShadow = true; props.add(c);
  }
  function ball(x, z) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshStandardMaterial({ color: '#f4f4f4', roughness: 0.5 }));
    b.position.set(x, 0.12, z); b.castShadow = true; props.add(b);
  }

  function trophy() {
    const gold = new THREE.MeshStandardMaterial({ color: '#e3b341', metalness: 0.75, roughness: 0.22, emissive: '#3a2600', emissiveIntensity: 0.4 });
    const pts = [[0, 0], [0.55, 0], [0.55, 0.12], [0.32, 0.18], [0.22, 0.45], [0.12, 0.6], [0.1, 0.9], [0.22, 1.05], [0.55, 1.35], [0.72, 1.9], [0.74, 2.25], [0.68, 2.3], [0.62, 2.0], [0.48, 1.55], [0, 1.45]].map(([x, y]) => new THREE.Vector2(x, y));
    const cup = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), gold);
    cup.castShadow = true;
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 12, 32, Math.PI * 1.2), gold);
    const h2 = handle.clone();
    handle.position.set(0.78, 1.75, 0); handle.rotation.z = -Math.PI * 0.6;
    h2.position.set(-0.78, 1.75, 0); h2.rotation.z = Math.PI * 0.4; h2.rotation.y = Math.PI;
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.25, 1.2, 48), new THREE.MeshStandardMaterial({ color: '#0f1a2c', roughness: 0.35, metalness: 0.3 }));
    ped.position.y = -0.6; ped.receiveShadow = true;
    const g = new THREE.Group(); g.add(cup, handle, h2, ped); g.position.set(0, 1.2, 0);
    props.add(g);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(12, 48), new THREE.MeshStandardMaterial({ color: '#0b1220', roughness: 0.6 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; props.add(floor);
    const rim = new THREE.PointLight('#5c8dff', 1.2, 12); rim.position.set(-3, 3, -2); props.add(rim);
    const warm = new THREE.PointLight('#ffd27a', 1.0, 10); warm.position.set(2.5, 2.5, 3); props.add(warm);
  }

  // Cada "foto": prepara la escena, coloca la cámara y devuelve los ajustes.
  const SHOTS = {
    estadio(club) { mood('night'); cam.fov = 42; cam.position.set(-120, 85, 120); cam.lookAt(0, 0, 0); },
    estadioDia(club) { mood('day'); cam.fov = 40; cam.position.set(130, 70, -90); cam.lookAt(0, -4, 0); },
    partido(club) {
      mood('night');
      const r = rnd(club.id * 13), kit = kitOf(club), away = { shirt: '#f2f2f2', shorts: '#f2f2f2', socks: '#f2f2f2', gk: '#00b140', gkShorts: '#111' };
      for (let i = 0; i < 6; i++) addPlayer(kit, person(club, i), -2 - r() * 14, -8 + r() * 16, Math.PI / 2 + (r() - .5), i % 2 ? 'run' : 'arms');
      for (let i = 0; i < 6; i++) addPlayer(away, { id: 900 + i, height: 180, skin: i % 5, hair: i % 6 }, 2 + r() * 14, -8 + r() * 16, -Math.PI / 2 + (r() - .5), i % 2 ? 'run' : 'arms', 4 + i);
      ball(0, 0);
      cam.fov = 38; cam.position.set(-6, 3.2, -24); cam.lookAt(2, 1, 0);
    },
    plantilla(club) {
      mood('night');
      const kit = kitOf(club);
      const pos = [[-2.4, 0.6], [-1.2, -0.2], [0, 0.4], [1.2, -0.2], [2.4, 0.6]];
      pos.forEach(([x, z], i) => addPlayer(kit, person(club, i), x, z, Math.PI + (x * -0.08), i === 2 ? 'cross' : 'arms'));
      cam.fov = 34; cam.position.set(0, 1.5, -7.6); cam.lookAt(0, 1.15, 0);
      lights.spot.intensity = 1.4; lights.spot.position.set(0, 9, -6); lights.spot.target.position.set(0, 1, 0);
    },
    jugador(club) {
      mood('night');
      const p = (club.players || []).map(id => G.C.world.players[id]).sort((a, b) => b.ovr - a.ovr)[0] || person(club, 0);
      addPlayer(kitOf(club), p, 0.7, 0, Math.PI - 0.35, 'arms');
      cam.fov = 30; cam.position.set(-0.4, 1.6, -4.6); cam.lookAt(0.3, 1.35, 0);
      lights.spot.intensity = 1.6; lights.spot.position.set(-2, 6, -4); lights.spot.target.position.set(0.7, 1, 0);
    },
    tacticas(club) {
      mood('day');
      const kit = kitOf(club), F = G.FORMATIONS[club.formation || '4-3-3'];
      F.forEach(([role, bx, by], i) => addPlayer(kit, person(club, i), (bx - 0.5) * 70 - 6, (by - 0.5) * 60, Math.PI / 2, 'arms'));
      cam.fov = 50; cam.position.set(-4, 40, 13); cam.lookAt(-4, 0, 1);
    },
    entreno(club) {
      mood('day');
      const r = rnd(club.id * 7), bib = { shirt: '#ffd400', shorts: club.colors[1], socks: club.colors[0], gk: '#00b140', gkShorts: '#111' };
      for (let i = 0; i < 6; i++) cone(-30 + i * 2.2, -10, i % 2 ? '#ff7a00' : '#ffd400');
      for (let i = 0; i < 6; i++) cone(-30 + i * 2.2, -4, '#1f6feb');
      for (let i = 0; i < 7; i++) addPlayer(i % 2 ? bib : kitOf(club), person(club, i + 3), -31 + r() * 14, -12 + r() * 10, r() * 6, 'run');
      for (let i = 0; i < 5; i++) ball(-30 + r() * 12, -9 + r() * 6);
      cam.fov = 40; cam.position.set(-40, 5, -26); cam.lookAt(-24, 0.8, -6);
    },
    cantera(club) {
      mood('day');
      const r = rnd(club.id * 3), kit = { shirt: club.colors[1], shorts: club.colors[0], socks: club.colors[1], gk: '#00b140', gkShorts: '#111' };
      for (let i = 0; i < 8; i++) addPlayer(kit, { id: 500 + i + club.id, height: 166 + r() * 12, skin: Math.floor(r() * 5), hair: Math.floor(r() * 6) }, 22 + (i % 4) * 1.6, 8 + Math.floor(i / 4) * 1.8, Math.PI, 'arms', 20 + i);
      for (let i = 0; i < 4; i++) cone(18 + i * 2, 4, '#ff7a00');
      cam.fov = 36; cam.position.set(24.5, 2.4, -1.5); cam.lookAt(24.5, 1.1, 9);
    },
    traspasos(club) {
      mood('night');
      const r = rnd(club.id * 17);
      const kits = [{ shirt: '#f2f2f2', shorts: '#14171d', socks: '#f2f2f2' }, kitOf(club)];
      addPlayer(kits[0], { id: 77, height: 184, skin: 2, hair: 3 }, -0.9, 0, Math.PI - 0.3, 'arms', 10);
      addPlayer(kits[1], person(club, 4), 0.9, 0.2, Math.PI + 0.3, 'arms', 9);
      cam.fov = 32; cam.position.set(0, 1.55, -5.4); cam.lookAt(0, 1.25, 0);
      lights.spot.intensity = 1.5; lights.spot.position.set(0, 7, -5); lights.spot.target.position.set(0, 1, 0);
    },
    ojeo(club) { mood('day'); const kit = kitOf(club), r = rnd(club.id); for (let i = 0; i < 10; i++) addPlayer(i % 2 ? kit : { shirt: '#f2f2f2', shorts: '#f2f2f2', socks: '#f2f2f2' }, { id: 300 + i, height: 180, skin: i % 5, hair: i % 6 }, -20 + r() * 40, -15 + r() * 30, r() * 6, 'run'); cam.fov = 34; cam.position.set(0, 36, -56); cam.lookAt(0, 0, 4); },
    trofeo() { mood('dark'); trophy(); cam.fov = 34; cam.position.set(0, 2.6, 6.2); cam.lookAt(0, 2.1, 0); lights.spot.position.set(0.5, 10, 4); lights.spot.target.position.set(0, 2, 0); },
    celebracion(club) {
      mood('night');
      const kit = kitOf(club), r = rnd(club.id * 5);
      for (let i = 0; i < 5; i++) addPlayer(kit, person(club, i), -1.8 + i * 0.9 + (r() - .5) * 0.4, (r() - .5) * 1.4, Math.PI + (r() - .5) * 0.6, i === 2 ? 'celebrate' : (i % 2 ? 'celebrate' : 'arms'));
      cam.fov = 38; cam.position.set(0, 1.2, -5.5); cam.lookAt(0, 1.4, 0);
      lights.spot.intensity = 1.2; lights.spot.position.set(0, 8, -5); lights.spot.target.position.set(0, 1, 0);
    }
  };

  function renderShot(key, club) {
    clearProps();
    lights.spot.intensity = 0; lights.spot.position.set(0, 12, 6); lights.spot.target.position.set(0, 0, 0);
    setStadium(club);
    (SHOTS[key] || SHOTS.estadio)(club);
    cam.updateProjectionMatrix();
    R.render(scene, cam);
    return R.domElement.toDataURL('image/jpeg', 0.84);
  }

  function pump() {
    if (busy || !queue.length) return;
    busy = true;
    requestAnimationFrame(() => {
      const job = queue.shift();
      try {
        if (!cache[job.k]) cache[job.k] = renderShot(job.key, job.club);
        job.done.forEach(f => f(cache[job.k]));
      } catch (e) { cache[job.k] = ''; job.done.forEach(f => f('')); }
      busy = false; pump();
    });
  }

  // Devuelve la foto (dataURL) por callback; '' si no hay 3D.
  G.photo = function (key, club, cb) {
    const k = key + ':' + club.id + ':' + club.colors.join('') + ':' + (club.formation || '');
    if (cache[k] !== undefined) return cb(cache[k]);
    if (!init()) return cb('');
    const pending = queue.find(j => j.k === k);
    if (pending) pending.done.push(cb); else queue.push({ k, key, club, done: [cb] });
    pump();
  };
  G.photoReset = () => { for (const k in cache) delete cache[k]; };

  // Rellena todos los [data-photo] de un contenedor.
  G.fillPhotos = function (root, club) {
    root.querySelectorAll('[data-photo]').forEach(el => {
      G.photo(el.dataset.photo, club, url => { if (url && el.isConnected !== false) { el.style.backgroundImage = 'url(' + url + ')'; el.classList.add('loaded'); } });
    });
  };
})();
