# Créditos y licencias de recursos

| Recurso | Ruta | Autor / origen | Licencia | Modificación |
|---|---|---|---|---|
| three.js r128 | cdnjs | three.js authors | MIT | — |
| GLTFLoader, SkeletonUtils | `js/libs/` | three.js authors | MIT | — |
| Persona animada | `modelos/persona.*` | Quaternius, *Universal Animation Library* | CC0 1.0 | Recorte de animaciones y huesos de dedos, coloreado por zonas |
| Personas realistas (cuerpo, cara, ojos, cejas, peinados) | `modelos/persona2.gltf.json` | Quaternius, *Universal Base Characters* (vía espejo verificado por SHA-256 WaviestSun/atelier-packs) | CC0 1.0 | Ropa por zonas, texturas a 512 px, animaciones de la UAL |
| Caballo animado | `modelos/caballo.*` | Quaternius, *Farm Animals* | CC0 1.0 | Sombreado suave, recoloreado |
| Toro y vaca animados | `modelos/toro.glb`, `modelos/vaca.glb` | Quaternius, *Ultimate Animated Animals* (vía [danwahl/animasim](https://github.com/danwahl/animasim)) | CC0 1.0 | 10 animaciones, pistas constantes eliminadas; la vaca usa las animaciones del toro; cuernos originales ocultos y sustituidos por los procedurales; pelo pintado por vértice |
| Árbol, hierbas, flores, rocas | `modelos/natura.gltf.json` | Quaternius, *Stylized Nature MegaKit* | CC0 1.0 | Texturas reducidas a 256 px |
| Texturas de tierra y asfalto | `img/tex/` | Quaternius, *Downtown City MegaKit* | CC0 1.0 | Reducidas, albero teñido |
| Fuentes Barlow, Cinzel, IBM Plex Mono | Google Fonts | sus autores | SIL OFL 1.1 | — |
| Iconos de la barra inferior y emblema | `img/nav/`, `img/nav-toro.png` | propietario (imágenes propias generadas con IA) | propiedad del propietario | Recorte y transparencia |
| Fotografías de portada y toros | `img/*.jpg` | propietario (imágenes propias generadas con IA) | propiedad del propietario | — |
| Música y sonidos | `js/musica.js`, `js/sonido.js` | sintetizados en el propio juego | propios | — |

## Toro de lidia (Tripo)
- `modelos/toro-tripo.glb` y `modelos/toro-tripo-lo.glb`: modelo creado por el propietario del juego con Tripo3D, aligerado (16k y 5k triángulos) y con el esqueleto y animaciones del toro de Quaternius (CC0) transferidos por cercanía.

## Plaza en directo
- `ruedo.html`: plaza realista propia (Ruedo de Valdeoro) para ver en directo las corridas de tu hierro. Albero, tendidos, torero de luces, capote y muleta con tela simulada, cámara de realizador.
- Toro: `modelos/toro-ruedo.glb` (malla) y `modelos/toro-tripo.glb` (con esqueleto y animaciones), ambos del toro creado por el propietario con Tripo3D; pelo de cada res sobre su textura.
- Libs: OrbitControls y Sky de three.js r128 (MIT).

## Ganadería de corro: objetos de la Plaza Mayor
- `modelos/corro/*.glb`: modelos fotoescaneados de **Poly Haven** (polyhaven.com), licencia **CC0 1.0**: `plastic_monobloc_chair_01` → `silla-plastico`, `gallinera_chair` → `silla-gallinera`, `outdoor_table_chair_set_01` → `mesa-terraza`, `painted_wooden_bench` → `banco`, `planter_box_02` → `jardinera`, `wine_barrel_01` → `barrica`, `wooden_crate_01` → `caja-madera`.
- Modificación: mallas simplificadas con meshoptimizer (600–5.800 triángulos), texturas reducidas a 512 px en JPEG y mallas unidas por material (glTF-Transform). Se dibujan con instancias en `js/corro-props.js`.
- Plaza, casas, cadafales, refugio, fuente, pilón y soga: generados por código (`js/plazamayor.js`, `js/corro-fisicas.js`).
