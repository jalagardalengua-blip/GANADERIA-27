#!/usr/bin/env node
// Convierte un .gltf con buffers base64 en un .glb compacto, sin dependencias.
// Conserva solo las animaciones indicadas y elimina accessors y bufferViews que queden sin usar.
// Uso: node tools/gltf-a-glb.js entrada.gltf salida.glb Idle,Walk,Gallop [paso]
// paso: conserva 1 de cada N fotogramas clave de animación (2 = la mitad de datos). Por defecto 1.
'use strict';
const fs = require('fs');
const [,, inp, out, keepArg, pasoArg] = process.argv;
const PASO = Math.max(1, parseInt(pasoArg || '1', 10));
if (!inp || !out) { console.error('Uso: node tools/gltf-a-glb.js entrada.gltf salida.glb [Clip1,Clip2]'); process.exit(1); }
const g = JSON.parse(fs.readFileSync(inp, 'utf8'));
const keep = keepArg ? new Set(keepArg.split(',')) : null;

// 1. Decodificar buffers (data URI base64)
const bufs = g.buffers.map(b => {
  const m = /^data:.*?;base64,(.*)$/.exec(b.uri || '');
  if (!m) throw new Error('Solo se admiten buffers base64 incrustados');
  return Buffer.from(m[1], 'base64');
});

// 2. Filtrar animaciones
if (g.animations && keep) {
  const missing = [...keep].filter(n => !g.animations.some(a => a.name === n));
  if (missing.length) throw new Error('Clips inexistentes: ' + missing.join(', ') + ' · disponibles: ' + g.animations.map(a => a.name).join(', '));
  g.animations = g.animations.filter(a => keep.has(a.name));
}


// 2b. Diezmar fotogramas clave: crea accessors nuevos (al final) con 1 de cada PASO claves
const extra = []; // {acc, data:Buffer}
if (g.animations && PASO > 1) {
  const COMP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
  const read = (i) => { const a = g.accessors[i], bv = g.bufferViews[a.bufferView];
    if (a.componentType !== 5126 || bv.byteStride) return null;
    const b = bufs[bv.buffer], o = (bv.byteOffset || 0) + (a.byteOffset || 0);
    return new Float32Array(b.buffer.slice(b.byteOffset + o, b.byteOffset + o + a.count * COMP[a.type] * 4)); };
  const cache = new Map();
  for (const an of g.animations) for (const sm of an.samplers) {
    if ((sm.interpolation || 'LINEAR') !== 'LINEAR') continue;
    const tin = read(sm.input), tout = read(sm.output); if (!tin || !tout || tin.length < 4) continue;
    const n = tin.length, w = tout.length / n, idx = [];
    for (let i = 0; i < n; i++) if (i % PASO === 0 || i === n - 1) idx.push(i);
    const key = sm.input + ':' + idx.length;
    if (!cache.has(key)) {
      const t = Float32Array.from(idx, i => tin[i]);
      g.accessors.push({ ...g.accessors[sm.input], count: idx.length, bufferView: -1, byteOffset: 0, min: [t[0]], max: [t[t.length - 1]] });
      extra.push({ acc: g.accessors.length - 1, data: Buffer.from(t.buffer) }); cache.set(key, g.accessors.length - 1);
    }
    const o = new Float32Array(idx.length * w); idx.forEach((i, k) => { for (let c = 0; c < w; c++) o[k * w + c] = tout[i * w + c]; });
    const oa = { ...g.accessors[sm.output], count: idx.length, bufferView: -1, byteOffset: 0 }; delete oa.min; delete oa.max;
    g.accessors.push(oa); extra.push({ acc: g.accessors.length - 1, data: Buffer.from(o.buffer) });
    sm.input = cache.get(key); sm.output = g.accessors.length - 1;
  }
}

// 3. Recoger accessors referenciados
const used = new Set();
const walk = (o) => {
  if (Array.isArray(o)) return o.forEach(walk);
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (['indices', 'inverseBindMatrices', 'input', 'output'].includes(k) && typeof v === 'number') used.add(v);
    else if (k === 'attributes' && v) Object.values(v).forEach(i => used.add(i));
    else if (k === 'targets' && Array.isArray(v)) v.forEach(t => Object.values(t).forEach(i => used.add(i)));
    else walk(v);
  }
};
walk(g.meshes); walk(g.skins); walk(g.animations);

// 4. Reconstruir un único buffer con los bufferViews usados (alineados a 4 bytes)
const accMap = new Map(), bvMap = new Map();
const newAcc = [], newBV = [], chunks = [];
let off = 0;
[...used].sort((a, b) => a - b).forEach(i => {
  const a = { ...g.accessors[i] };
  const ex = extra.find(e => e.acc === i);
  if (ex) {
    const pad = (4 - (off % 4)) % 4; if (pad) { chunks.push(Buffer.alloc(pad)); off += pad; }
    newBV.push({ buffer: 0, byteOffset: off, byteLength: ex.data.length }); chunks.push(ex.data); off += ex.data.length;
    a.bufferView = newBV.length - 1; a.byteOffset = 0;
  } else if (a.bufferView !== undefined) {
    if (!bvMap.has(a.bufferView)) {
      const bv = g.bufferViews[a.bufferView];
      const src = bufs[bv.buffer].subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
      const pad = (4 - (off % 4)) % 4;
      if (pad) { chunks.push(Buffer.alloc(pad)); off += pad; }
      const nbv = { buffer: 0, byteOffset: off, byteLength: bv.byteLength };
      if (bv.byteStride) nbv.byteStride = bv.byteStride;
      if (bv.target) nbv.target = bv.target;
      chunks.push(src); off += src.length;
      bvMap.set(a.bufferView, newBV.length); newBV.push(nbv);
    }
    a.bufferView = bvMap.get(a.bufferView);
  }
  accMap.set(i, newAcc.length); newAcc.push(a);
});
const remap = (o) => {
  if (Array.isArray(o)) return o.forEach(remap);
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (['indices', 'inverseBindMatrices', 'input', 'output'].includes(k) && typeof v === 'number') o[k] = accMap.get(v);
    else if (k === 'attributes' && v) for (const n in v) v[n] = accMap.get(v[n]);
    else if (k === 'targets' && Array.isArray(v)) v.forEach(t => { for (const n in t) t[n] = accMap.get(t[n]); });
    else remap(v);
  }
};
remap(g.meshes); remap(g.skins); remap(g.animations);
g.accessors = newAcc; g.bufferViews = newBV;
const bin = Buffer.concat(chunks);
g.buffers = [{ byteLength: bin.length }];
delete g.images; // los packs usados no llevan texturas
g.asset = { ...g.asset, generator: 'gltf-a-glb (Hierro y Divisa)' };

// 5. Empaquetar GLB
let json = Buffer.from(JSON.stringify(g), 'utf8');
json = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]);
const binP = Buffer.concat([bin, Buffer.alloc((4 - bin.length % 4) % 4)]);
const hdr = Buffer.alloc(12); hdr.writeUInt32LE(0x46546C67, 0); hdr.writeUInt32LE(2, 4);
hdr.writeUInt32LE(12 + 8 + json.length + 8 + binP.length, 8);
const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; };
fs.writeFileSync(out, Buffer.concat([hdr, ch(json.length, 0x4E4F534A), json, ch(binP.length, 0x004E4942), binP]));
console.log(`${out}: ${(fs.statSync(out).size / 1024).toFixed(0)} KB · clips: ${(g.animations || []).map(a => a.name).join(', ') || '—'}`);
