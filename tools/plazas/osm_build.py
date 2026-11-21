#!/usr/bin/env python3
"""Convierte los datos de OpenStreetMap de cada plaza en edificios para el juego.
- Origen en el centro de la plaza; giro para que la iglesia (o el ayuntamiento) quede al fondo, como el edificio del
  juego que la representa; desplazamiento para que su fachada coincida con el fondo de la arena.
- Se recortan los edificios reales solo donde estorban: arena, calles del recorrido, cajón y edificios singulares del juego.
- Alturas reales: building:levels o height; si no constan, valores típicos según el tipo.
Salida: js/plazas-osm.js con PMX_OSM[clave] = {d:[...], n:edificios}."""
import json, math, os, sys
import xml.etree.ElementTree as ET
from shapely.geometry import Polygon, box, Point, shape, LineString
import random
from shapely.ops import unary_union
from shapely import affinity

OSM = os.environ.get('OSM_DIR', '/tmp/osm-plazas')
OUTJS = sys.argv[1] if len(sys.argv) > 1 else '/home/user/ganaderia-27/js/plazas-osm.js'

FONDO = {k: 'iglesia' for k in ['nules', 'borriana', 'onda', 'almassora', 'cabanes', 'torreblanca', 'benicarlo', 'vinaros', 'peniscola', 'moncofa', 'lalcora', 'borriol',
                                'alcala', 'benicassim', 'museros', 'massamagrell', 'alboraia', 'sagunt', 'denia', 'pedreguer', 'xabia', 'laromana']}
FONDO.update({k: 'ajuntament' for k in ['vilareal', 'lavall', 'betxi', 'meliana', 'pucol', 'foios', 'lliria', 'ontinyent', 'sueca', 'elpuig']})
FONDO.update({k: 'arcade' for k in ['chiva']})
FONDO['segorbe'] = 'iglesia'  # guía de plazas: la catedral al fondo
EXENT = {'torreblanca': 1, 'vinaros': 1, 'alcala': 1}
NORTE = {'vinaros': 10.5, 'xabia': 10.5, 'nules': 10.5, 'borriana': 10.5, 'denia': 10.5, 'sueca': 16.5}
PALAU = {'pucol'}
TORRES = {'betxi': [(0, -19)], 'segorbe': [(-18, -17), (18, 17.5), (-34, -48)], 'foios': [(18, -17), (-24, -32)], 'lavall': [(22, -34)],
          'meliana': [(-24, -30)], 'pucol': [(-26, -32)], 'lliria': [(6, -44)], 'ontinyent': [(-20, -36)], 'sueca': [(22, -30)]}


def parse(path):
    root = ET.parse(path).getroot()
    nodes = {n.get('id'): (float(n.get('lat')), float(n.get('lon'))) for n in root.iter('node')}
    ways = []
    for w in root.iter('way'):
        tags = {t.get('k'): t.get('v') for t in w.iter('tag')}
        ref = [nd.get('ref') for nd in w.iter('nd')]
        ways.append((w.get('id'), tags, ref))
    rels = []
    for r in root.iter('relation'):
        tags = {t.get('k'): t.get('v') for t in r.iter('tag')}
        mem = [(m.get('type'), m.get('ref'), m.get('role')) for m in r.iter('member')]
        rels.append((tags, mem))
    return nodes, ways, rels


def levels(tags, kind):
    for key in ('building:levels',):
        try:
            v = float(tags[key].split(';')[0])
            if 0 < v < 20:
                return 3.3 + max(0, v - 1) * 2.9 + float(tags.get('roof:levels', 0) or 0) * 1.4
        except Exception:  # noqa: BLE001
            pass
    try:
        h = float(tags['height'].replace('m', '').split(';')[0])
        if 2 < h < 90:
            return h
    except Exception:  # noqa: BLE001
        pass
    return {1: 14.0, 2: 24.0, 3: 12.0, 4: 3.4}.get(kind, 9.1)


def kind_of(tags):
    b = tags.get('building', '') or tags.get('building:part', '')
    if b in ('church', 'cathedral', 'chapel', 'basilica') or tags.get('amenity') == 'place_of_worship':
        return 1
    if b in ('bell_tower', 'tower') or tags.get('man_made') == 'tower' or tags.get('tower:type') == 'bell_tower':
        return 2
    if b in ('public', 'civic', 'government', 'townhall', 'palace', 'castle', 'monastery') or tags.get('amenity') == 'townhall' or tags.get('historic') in ('castle', 'monastery'):
        return 3
    if b in ('garage', 'garages', 'shed', 'roof', 'carport', 'hut', 'kiosk', 'service'):
        return 4
    return 0


MEDIDAS = {'vilareal': (19, 13), 'benicarlo': (16.5, 12), 'peniscola': (11, 8.5), 'segorbe': (18, 9.5), 'onda': (18, 9.5), 'almassora': (15, 11),
           'betxi': (16, 12), 'lavall': (15, 12), 'nules': (14, 12), 'borriana': (16, 12.5), 'vinaros': (17, 12), 'sagunt': (13, 10), 'cabanes': (12, 9.5),
           'torreblanca': (15, 11.5), 'moncofa': (14.5, 11), 'denia': (15, 11), 'xabia': (12.5, 9.5), 'alcala': (14, 10.5), 'ontinyent': (17, 12), 'sueca': (16, 12)}


def medidas(k, poly, hit, fondo):
    if k in MEDIDAS:
        return MEDIDAS[k][0], MEDIDAS[k][1], 'guía'
    real = hit.get('category') == 'place' or (hit.get('category') == 'highway' and hit.get('type') == 'pedestrian')
    if poly is not None and real and 250 < poly.area < 3200:
        minx, minz, maxx, maxz = poly.bounds
        W = max(11, min(19, (maxx - minx) / 2 * .92)); D = max(8.5, min(14, (maxz - minz) / 2 * .92))
        if W < D:  # la arena es más ancha que honda: el lado largo a lo ancho
            W, D = max(W, D), min(W, D)
        return round(W, 1), round(D, 1), 'osm'
    # sin medida fiable: lo típico de cada plaza (las de iglesia, más recogidas; las mayores y de ayuntamiento, más amplias)
    return {'iglesia': (13.5, 10.5), 'ajuntament': (16, 12), 'arcade': (16, 11)}.get(fondo, (14, 11)) + ('tipo',)


def main():
    out = {}
    for f in sorted(os.listdir(OSM)):
        if not f.endswith('.xml'):
            continue
        k = f[:-4]
        meta = json.load(open(f'{OSM}/{k}.json'))
        hit = meta['hit']
        lat0, lon0 = float(hit['lat']), float(hit['lon'])
        kx, kz = 111320 * math.cos(math.radians(lat0)), 110540
        P = lambda la, lo: ((lo - lon0) * kx, -(la - lat0) * kz)  # (este, sur) = (x, z) del juego
        nodes, ways, rels = parse(f'{OSM}/{k}.xml')
        wayref = {wid: ref for wid, _, ref in ways}
        polys = []  # (Polygon, tags)
        for wid, tags, ref in ways:
            if not ('building' in tags or 'building:part' in tags or tags.get('man_made') == 'tower') or len(ref) < 4 or ref[0] != ref[-1]:
                continue
            try:
                pg = Polygon([P(*nodes[r]) for r in ref])
            except KeyError:
                continue
            if pg.is_valid and pg.area > 4:
                polys.append((pg, tags))
        for tags, mem in rels:  # edificios multipolígono: solo el anillo exterior
            if 'building' not in tags:
                continue
            for t, ref, role in mem:
                if t == 'way' and role == 'outer' and ref in wayref:
                    r = wayref[ref]
                    if len(r) > 3 and r[0] == r[-1] and all(x in nodes for x in r):
                        pg = Polygon([P(*nodes[x]) for x in r])
                        if pg.is_valid and pg.area > 4:
                            polys.append((pg, tags))
        # calles reales: con ellas se sacan las manzanas aunque OSM no tenga dibujados los edificios
        ANCHO = {'primary': 5, 'secondary': 4.6, 'tertiary': 4.2, 'unclassified': 3.6, 'residential': 3.4, 'living_street': 3.2, 'pedestrian': 3.2,
                 'service': 2.6, 'footway': 1.6, 'steps': 1.4, 'path': 1.2, 'trunk': 6}
        vias, abiertos = [], []
        for wid, tags, ref in ways:
            try:
                pts = [P(*nodes[r]) for r in ref]
            except KeyError:
                continue
            hw = tags.get('highway')
            if hw and len(pts) > 1:
                if tags.get('area') == 'yes' and len(pts) > 3 and ref[0] == ref[-1]:
                    abiertos.append(Polygon(pts).buffer(0))
                elif hw in ANCHO:
                    vias.append(LineString(pts).buffer(ANCHO[hw], cap_style=2, join_style=2))
            if (tags.get('place') == 'square' or tags.get('leisure') in ('park', 'garden', 'pitch', 'playground') or tags.get('landuse') in ('grass', 'farmland', 'orchard', 'meadow', 'construction')
                    or tags.get('amenity') == 'parking' or tags.get('natural') == 'water') and len(pts) > 3 and ref[0] == ref[-1]:
                abiertos.append(Polygon(pts).buffer(0))
        # centro de la plaza: polígono de la plaza si lo hay
        origin = Point(0, 0)
        try:
            g = shape(hit.get('geojson')) if hit.get('geojson') else None
            if g is not None and g.geom_type in ('Polygon', 'MultiPolygon') and g.area > 0:
                c = g.centroid; origin = Point(*P(c.y, c.x))
        except Exception:  # noqa: BLE001
            pass
        # si la búsqueda dio la iglesia o el ayuntamiento, la plaza está delante: se centra más tarde con el desplazamiento
        polys = [(affinity.translate(pg, -origin.x, -origin.y), t) for pg, t in polys]
        vias = [affinity.translate(v, -origin.x, -origin.y) for v in vias]; abiertos = [affinity.translate(v, -origin.x, -origin.y) for v in abiertos if v.is_valid]
        # manzanas = zona del pueblo menos calles y espacios abiertos; en su borde, casas en fila donde OSM no tiene edificio
        rnd = random.Random(k)
        hechos = unary_union([pg for pg, _ in polys]) if polys else Polygon()
        libre = unary_union(vias + abiertos) if (vias or abiertos) else Polygon()
        manz = box(-150, -150, 150, 150).difference(libre)
        gen = []
        for m in (getattr(manz, 'geoms', None) or [manz]):
            if m.geom_type != 'Polygon' or m.area < 60 or m.area > 25000:
                continue
            ring = list(m.exterior.coords)
            for i in range(len(ring) - 1):
                (ax, az), (bx, bz) = ring[i], ring[i + 1]
                L = math.hypot(bx - ax, bz - az)
                if L < 3:
                    continue
                ux, uz = (bx - ax) / L, (bz - az) / L
                nx, nz = -uz, ux  # hacia dentro de la manzana (comprobado abajo)
                mid = Point(ax + ux * L / 2 + nx * .5, az + uz * L / 2 + nz * .5)
                if not m.contains(mid):
                    nx, nz = -nx, -nz
                t = 0.0
                while t < L - 2.5:
                    w = min(L - t, rnd.uniform(5, 9)); dep = rnd.uniform(8, 12)
                    a = (ax + ux * t, az + uz * t); b = (ax + ux * (t + w), az + uz * (t + w))
                    pc = Polygon([a, b, (b[0] + nx * dep, b[1] + nz * dep), (a[0] + nx * dep, a[1] + nz * dep)]).intersection(m)
                    if not hechos.is_empty:
                        pc = pc.difference(hechos.buffer(.3))
                    if pc.geom_type == 'Polygon' and pc.area > 14:
                        gen.append((pc, {'building': 'house', 'building:levels': str(rnd.choice([2, 3, 3, 3, 4, 4]))}))
                    t += w
        polys += gen
        fondo = FONDO.get(k, 'iglesia')
        want = (1,) if fondo == 'iglesia' else (3, 1) if fondo == 'ajuntament' else ()
        target = None
        for kd in want:
            cands = [(pg.distance(Point(0, 0)), pg) for pg, t in polys if kind_of(t) == kd and pg.area > 60]
            cands = [c for c in cands if c[0] < 140]
            if cands:
                target = min(cands, key=lambda c: c[0])[1]; break
        # giro: el edificio del fondo hacia -z; sin él, el eje largo de la plaza a lo ancho
        if target is not None:
            c = target.centroid; ang = math.atan2(c.y, c.x); phi = -math.pi / 2 - ang
        else:
            phi = 0.0
        polys = [(affinity.rotate(pg, phi, origin=(0, 0), use_radians=True), t) for pg, t in polys]
        dx = dz = 0.0
        if target is not None:
            tg = affinity.rotate(target, phi, origin=(0, 0), use_radians=True)
            minx, minz, maxx, maxz = tg.bounds
            dz = max(-25, min(25, -11.6 - maxz)); dx = max(-10, min(10, -tg.centroid.x))
            polys = [(affinity.translate(pg, dx, dz), t) for pg, t in polys]
        # forma real de la plaza en el marco del juego
        sq = None
        try:
            g = shape(hit.get('geojson')) if hit.get('geojson') else None
            if g is not None and g.geom_type in ('Polygon', 'MultiPolygon') and g.area > 0:
                g = max(getattr(g, 'geoms', [g]), key=lambda x: x.area)
                sq = Polygon([P(la, lo) for lo, la in g.exterior.coords])
                sq = affinity.translate(affinity.rotate(affinity.translate(sq, -origin.x, -origin.y), phi, origin=(0, 0), use_radians=True), dx, dz)
        except Exception:  # noqa: BLE001
            sq = None
        W, D, fuente = medidas(k, sq, hit, fondo)
        # zonas reservadas del juego
        keep = [box(-W - .6, -D - .6, W + .6, D + .6), box(W, -4.4, 82, 4.4), box(-82, -4.4, -W, 4.4), box(-3.9, D, 3.9, 58)]
        CALLES = [box(14, -4.4, 82, 4.4), box(-82, -4.4, -14, 4.4), box(-3.9, 11, 3.9, 58)]
        if fondo == 'iglesia':
            keep.append(box(-8.6, -D - 17.6, 8.6, -D))
        elif fondo == 'ajuntament':
            keep.append(box(-9.2, -D - 10.2, 9.2, -D))
        if k in EXENT:
            s = EXENT[k]; keep.append(box(min(s * 8, s * 13.4), -D - 6.2, max(s * 8, s * 13.4), -D))
        if k in NORTE:
            keep.append(box(3, D, W + 7.6, D + NORTE[k]))
        if k in PALAU:
            keep += [box(-15.4, -D - 5.2, -8.6, -D + .2), box(8.6, -D - 5.2, 15.4, -D + .2)]
        if k == 'elpuig':
            keep.append(box(-15.6, -D - 18, 15.6, -D + .2))
        for (tx, tz) in TORRES.get(k, []):  # las torres del juego se mueven con la plaza
            keep.append(Point(tx * W / 14 if abs(tx) < 22 else tx, tz * D / 11 if abs(tz) < 22 else tz).buffer(3.6))
        KO = unary_union(keep)
        ocup = unary_union([pg for pg, _ in polys]).buffer(.3) if polys else Polygon()
        filas = []
        for (ax, az, bx, bz, nx, nz) in [(W + .6, 4.4, 82, 4.4, 0, 1), (W + .6, -4.4, 82, -4.4, 0, -1), (-82, 4.4, -W - .6, 4.4, 0, 1), (-82, -4.4, -W - .6, -4.4, 0, -1),
                                         (3.9, D + .6, 3.9, 58, 1, 0), (-3.9, D + .6, -3.9, 58, -1, 0)]:
            L = math.hypot(bx - ax, bz - az); ux, uz = (bx - ax) / L, (bz - az) / L; t = 0.0
            while t < L - 2:
                w = min(L - t, rnd.uniform(5, 9)); dep = rnd.uniform(8, 11)
                a = (ax + ux * t, az + uz * t); b = (ax + ux * (t + w), az + uz * (t + w))
                pc = Polygon([a, b, (b[0] + nx * dep, b[1] + nz * dep), (a[0] + nx * dep, a[1] + nz * dep)]).difference(ocup).difference(KO)
                if pc.geom_type == 'Polygon' and pc.area > 14:
                    filas.append((pc, {'building': 'house', 'building:levels': str(rnd.choice([2, 3, 3, 3, 4]))}))
                t += w
        polys = polys + filas
        res = []
        for pg, t in polys:
            if pg.centroid.distance(Point(0, 0)) > 100:
                continue
            kd = kind_of(t)
            h = levels(t, kd)
            g = pg.difference(KO)
            parts = [g] if g.geom_type == 'Polygon' else list(getattr(g, 'geoms', []))
            for q in parts:
                if q.geom_type != 'Polygon' or q.area < 7:
                    continue
                q = q.simplify(.15, preserve_topology=True)
                if not q.is_valid or q.area < 7:
                    continue
                ring = list(q.exterior.coords)[:-1]
                if Polygon(ring).exterior.is_ccw:  # sentido horario visto desde arriba (x este, z sur): normales hacia fuera
                    ring.reverse()
                res.append([kd, round(h * 10)] + [v for p in ring for v in (round(p[0] * 10), round(p[1] * 10))])
        out[k] = {'W': W, 'D': D, 'medida': fuente, 'rot': round(phi, 4), 'dx': round(dx, 2), 'dz': round(dz, 2), 'plaza': hit.get('name'), 'b': res}
        print(k, '|', 'W', W, 'D', D, fuente, '|', len(res), 'edificios')
    D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'datos', 'plazas'); os.makedirs(D, exist_ok=True)
    tot = 0
    for k, v in out.items():
        t = json.dumps(v, separators=(',', ':'), ensure_ascii=False); open(f'{D}/{k}.json', 'w').write(t); tot += len(t)
    print('json total', tot, 'max', max(len(json.dumps(v, separators=(',', ':'))) for v in out.values()))
    return
    js = ('/* Edificios reales de cada plaza (OpenStreetMap, © colaboradores de OpenStreetMap, licencia ODbL).\n'
          '   Generado por la herramienta de plazas: coordenadas en decímetros del juego (x este, z sur), ya giradas y recortadas.\n'
          '   Cada edificio: [tipo (0 casa, 1 iglesia, 2 torre, 3 edificio público, 4 almacén), altura en dm, x0,z0, x1,z1, …] */\n'
          'const PMX_OSM=' + json.dumps(out, separators=(',', ':'), ensure_ascii=False) + ';\n')
    open(OUTJS, 'w').write(js)
    print('bytes', len(js))


main()
