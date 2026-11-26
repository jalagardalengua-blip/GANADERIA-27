#!/usr/bin/env python3
"""Localiza en OpenStreetMap (Nominatim) la plaza de fiestas de cada pueblo y descarga (API 0.6, /map) todo lo que
hay en ~280 m alrededor. Guarda /tmp/claude-0/osm/<clave>.xml y <clave>.json (resultado de la búsqueda)."""
import json, os, sys, time, urllib.parse, urllib.request

OUT = os.environ.get('OSM_DIR', '/tmp/osm-plazas')
os.makedirs(OUT, exist_ok=True)
UA = {'User-Agent': 'HierroYDivisa-juego/1.0 (plazas de bous al carrer)'}
# clave: (pueblo para la búsqueda, [nombres de la plaza a probar en orden])
P = {
 'vilareal': ('Vila-real', ['Plaça Major']), 'nules': ('Nules', ['Plaça Major']), 'borriana': ('Borriana', ['Plaça Major']),
 'onda': ('Onda', ["Plaça del Pla", 'Plaça Major']), 'almassora': ('Almassora', ['Plaça Pare Cabrera', 'Plaça Major', "Plaça de l'Església"]),
 'cabanes': ('Cabanes', ["Plaça de l'Església", 'Plaça Major']), 'torreblanca': ('Torreblanca, Castelló', ["Plaça de l'Església", 'Plaça Major', 'Plaça de la Constitució']),
 'benicarlo': ('Benicarló', ['Plaça de Sant Bartomeu']), 'vinaros': ('Vinaròs', ['Plaça Parroquial']),
 'peniscola': ('Peníscola', ['Plaça de Santa Maria', "Plaça d'Armes"]), 'segorbe': ('Segorbe', ['Plaza de la Cueva Santa', 'Plaza Agua Limpia']),
 'moncofa': ('Moncofa', ['Plaça de la Constitució', "Plaça de l'Església"]), 'lavall': ("la Vall d'Uixó", ['Plaça del Centre', "Plaça de l'Àngel"]),
 'betxi': ('Betxí', ['Plaça Major']), 'lalcora': ("l'Alcora", ["Plaça de l'Església", "Plaça de l'Ajuntament"]),
 'borriol': ('Borriol', ['Plaça de la Font', "Plaça de l'Església"]), 'alcala': ('Alcalà de Xivert', ["Plaça de l'Església", 'Plaça Major']),
 'benicassim': ('Benicàssim', ["Plaça de l'Església", 'Plaça de la Constitució']), 'meliana': ('Meliana', ["Plaça de l'Ajuntament", 'Plaça Major']),
 'museros': ('Museros, València', ["Plaça de l'Església", "Plaça de l'Ajuntament", 'Plaça del Castell']), 'pucol': ('Puçol', ['Plaça del País Valencià', "Plaça de l'Església"]),
 'massamagrell': ('Massamagrell', ["Plaça de l'Església", "Plaça de l'Ajuntament"]), 'foios': ('Foios', ['Plaça del Poble', "Plaça de l'Església"]),
 'alboraia': ('Alboraia', ["Plaça de l'Església", "Plaça de l'Ajuntament"]), 'lliria': ('Llíria', ['Plaça Major']),
 'chiva': ('Xiva', ['Plaza de la Villa', 'Plaza Mayor', "Plaza de la Iglesia"]), 'ontinyent': ('Ontinyent', ['Plaça Major']),
 'sueca': ('Sueca', ["Plaça de l'Ajuntament", "Plaça del Convent"]), 'elpuig': ('el Puig de Santa Maria', ['Plaça del Monestir', "Plaça de l'Ajuntament"]),
 'sagunt': ('Sagunt', ['Plaça Major']), 'denia': ('Dénia', ['Plaça de la Constitució']), 'pedreguer': ('Pedreguer', ["Plaça de l'Ajuntament", "Plaça de l'Església"]),
 'xabia': ('Xàbia', ["Plaça de l'Església"]), 'laromana': ('la Romana', ["Plaça de l'Església", "Plaça de l'Ajuntament"]),
}


def get(url, tries=4):
    last = None
    for t in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(3 + 3 * t)
    raise RuntimeError(f'{url}: {last}')


def nom(q):
    time.sleep(1.2)  # política de uso de Nominatim: 1 petición por segundo
    u = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({'q': q, 'format': 'jsonv2', 'limit': 5, 'countrycodes': 'es', 'polygon_geojson': 1, 'accept-language': 'ca'})
    return json.loads(get(u))


def main(keys):
    for k in keys:
        if os.path.exists(f'{OUT}/{k}.xml'):
            print(k, 'ya está'); continue
        town, names = P[k]
        hit = None
        for n in names:
            for r in nom(f'{n}, {town}'):
                if r.get('category') in ('place', 'highway', 'leisure', 'landuse', 'amenity') and (n.split()[-1].lower() in r.get('display_name', '').lower()):
                    hit = r; break
            if hit: break
        if not hit:  # plaza no encontrada: la iglesia principal o el centro del pueblo
            for r in nom(f'església, {town}') + nom(town):
                hit = r; break
        if not hit:
            print(k, 'SIN RESULTADO'); continue
        lat, lon = float(hit['lat']), float(hit['lon'])
        dlat, dlon = 280 / 111000, 280 / (111000 * 0.766)
        xml = get(f'https://api.openstreetmap.org/api/0.6/map?bbox={lon-dlon:.6f},{lat-dlat:.6f},{lon+dlon:.6f},{lat+dlat:.6f}')
        open(f'{OUT}/{k}.xml', 'wb').write(xml)
        json.dump({'k': k, 'town': town, 'hit': hit}, open(f'{OUT}/{k}.json', 'w'))
        print(k, '|', hit.get('name'), '|', hit.get('category'), hit.get('type'), '|', f'{lat:.5f},{lon:.5f}', '|', len(xml) // 1024, 'KB', flush=True)


if __name__ == '__main__':
    main(sys.argv[1:] or list(P))
