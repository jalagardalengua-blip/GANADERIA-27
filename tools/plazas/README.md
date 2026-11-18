# Plazas reales de la ganadería de corro

Los edificios que rodean la plaza de fiestas de cada pueblo salen de OpenStreetMap
(© colaboradores de OpenStreetMap, licencia ODbL: https://www.openstreetmap.org/copyright).

1. `python3 osm_get.py` busca cada plaza en Nominatim y descarga con la API 0.6 todo lo que hay en ~280 m.
2. `python3 osm_build.py` (necesita `shapely`) prepara cada plaza y escribe `datos/plazas/<pueblo>.json`:
   - gira el plano para que la iglesia, o el ayuntamiento, real quede al fondo de la arena;
   - recorta solo la arena, el recorrido, el cajón y los edificios singulares del juego;
   - donde OSM no tiene edificios, levanta casas en fila sobre las manzanas que forman las calles reales.

Formato: `{rot, dx, dz, plaza, b:[[tipo, altura_dm, x0, z0, x1, z1, …], …]}`. Las coordenadas están en
decímetros del juego (x este, z sur). Los tipos son: 0 casa, 1 iglesia, 2 torre, 3 público, 4 almacén.
