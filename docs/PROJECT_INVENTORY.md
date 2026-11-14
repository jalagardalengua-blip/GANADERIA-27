# Inventario del proyecto (AUD-002)

Fecha: 5 nov 2026 · Rama auditada: `main` @ `46550cb` · Publicación: https://jalagardalengua-blip.github.io/GANADERIA-27/

## Arranque y plataforma
| Ruta | Función |
|---|---|
| `index.html` | Entrada de GitHub Pages / APK. Carga todos los scripts en orden fijo (clásicos, sin módulos) y registra `sw.js`. Oculta `#app` hasta el primer `render()`. |
| `.artifact.html` | Misma entrada para la vista previa en claude.ai (sin service worker). |
| `sw.js` | Service worker: red primero para html/js/css/json, caché primero para imágenes. Versión `hierro-divisa-v23`. |
| `manifest.webmanifest` | PWA: name, short_name, start_url `./`, scope `./`, standalone, iconos 192/512. |
| `.github/workflows/pages.yml` | Publica la raíz en Pages en cada push a `main`. |
| `.github/workflows/android.yml` | Empaqueta con Capacitor 7 y publica `HierroYDivisa.apk` en Releases. Firma con secretos `ANDROID_*` (no están en el repo). |
| `.github/workflows/blank.yml` | Plantilla vacía de GitHub ("Hello, world"); no hace nada útil. |

## Dependencias externas
| Recurso | Origen | Licencia | Nota |
|---|---|---|---|
| three.js r128 | `cdnjs.cloudflare.com` (en tiempo de carga) | MIT | **Sin copia local**: sin red y sin caché, no hay 3D (ver RISKS R-01). |
| GLTFLoader, SkeletonUtils (r128) | `js/libs/` | MIT | Copias locales. |
| Barlow, Barlow Condensed, Cinzel, IBM Plex Mono | Google Fonts (en tiempo de carga) | OFL | Sin copia local; hay fuentes de respaldo del sistema. |

No hay `package.json`, compilador ni dependencias npm en el juego.

## Módulos JS (orden de carga)
Arquitectura: scripts clásicos con estado global (`S`, `UI`, `W3`, `CP`, `CL`, `TR`, `AU`). Los módulos posteriores **reasignan funciones globales** envolviendo la anterior (`const _f=f; f=function(){…}`). Hay ~120 envolturas; `render` está envuelta 7 veces.

| Archivo | Bytes | Responsabilidad |
|---|---:|---|
| `mundo3d.js` | 158 097 | Motor 3D: renderer, HUD, joystick, finca (`rebuildFinca`, `fincaTick`), plaza (`buildPlaza`, `enterPlaza`, `plazaTick`), toros/personas/caballos procedurales, tienta, audio base (`AU`, `crowd*`). |
| `juego.js` | 96 736 | Núcleo: datos (ganaderías, encastes, ferias), estado `S`, `save/load`, `advance()` mensual, ofertas, corridas (`celebrar`, `lidiar`), mercado, pestañas y `render()`. |
| `carrera.js` | 19 572 | Valoración, escalafón y rivales, retos, noticias (`newsToast`). |
| `corro.js` | 45 771 | Ganadería de corro: casas reales, pueblos, festejos (`FEST`), mercado, inversiones, `cResolver`, `corroMes`. |
| `calle.js` / `calle2.js` / `calle3.js` | 46 336 / 12 353 / 8 727 | Bous al carrer 3D: calles valencianas, plaza de concurso, mar, corda, encierro; retransmisión automática y cogidas. |
| `musica.js` / `sonido.js` | 9 575 / 6 496 | Banda sintetizada (pasodobles, clarín, timbales); palmas, murmullo y timbres sin zumbidos. |
| `gfx.js` | 8 899 | Personas detalladas, gestión de color sRGB/ACES, cielo. |
| `extras.js` | 17 639 | Más encastes, pelajes, ganaderías (34), toreros (51), faenas del calendario, arreglos de tienta. |
| `casa.js` | 3 023 | Selector Ganadería principal / Ganadería de corro. |
| `finca2.js` | 17 474 | Obras taurinas (ermita, báscula, picadero, coso, monumento, mirador) y personal contratado. |
| `lidia.js` | 13 509 | Juicio del toro (nota 0–10), prestigio de toreros, sello de faena. |
| `fx.js` | 8 394 | Efectos: subtítulos, sacudidas, cámara lenta, confeti, transiciones, sonidos de UI. |
| `modelos.js` | 9 152 | Carga GLB de persona y caballo animados (Quaternius CC0) con respaldo procedural. |
| `texturas.js` | 5 961 | Albero, relieve de calles y suelo; vegetación instanciada de la dehesa. |
| `menu.js` | 10 478 | Portada, menú principal, carrusel de ganaderías, fundar, modos, ajustes. |
| `navbar.js` | 1 771 | Barra inferior de gala (iconos y emblema). |
| `calendario.js` | 10 586 | Día dentro del mes, avance semanal, calendario y simulación hasta fecha. |
| `torero.js` | 47 595 | Modo torero (bloqueado en el menú). |
| `css/estilo.css` | 124 280 | Hoja única; capas añadidas por secciones al final. |

## Recursos
| Carpeta | Tamaño | Contenido |
|---|---:|---|
| `modelos/` | 3,8 MB | `persona.glb` (910 KB) y `caballo.glb` (452 KB) + copias `.gltf.json` incrustadas; `natura.gltf.json` (916 KB, vegetación). |
| `img/` | 2,2 MB | Fotografías de portada y toros (`toro-<pelo>-<n>.jpg`), iconos de app, `nav/` (iconos de barra), `tex/` (texturas). |

## Almacenamiento
| Clave localStorage | Contenido |
|---|---|
| `hierro-divisa-v1` | Partida completa (`S`) en JSON, ~96 KB tras 3 meses. Ver `SAVE_SCHEMA.md`. |
| `hierro-divisa-torero` | Carrera del modo torero (módulo bloqueado). |
| `hd-qual` | Calidad gráfica elegida (`alta`/`media`/`baja`). |

No se usa IndexedDB ni ningún servidor.
