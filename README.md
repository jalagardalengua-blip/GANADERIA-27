# Hierro y Divisa

Modo carrera de ganadero de bravo para el navegador y el móvil. Eliges una ganadería histórica o fundas la tuya, y la llevas mes a mes: cría, alimentación, tientas, herradero, reseñas para las ferias, ventas y corridas en una plaza 3D.

## Descargar

**Android:** [📲 Descargar la app (APK)](https://github.com/jalagardalengua-blip/GANADERIA-27/releases/latest/download/HierroYDivisa.apk)

1. Abre el enlace desde el móvil y descarga `HierroYDivisa.apk`.
2. Ábrelo. Si Android lo pide, permite que el navegador instale apps.
3. Pulsa «Instalar». Las versiones nuevas se instalan encima sin perder la partida.

**Sin instalar nada:** juega en el navegador en [jalagardalengua-blip.github.io/GANADERIA-27](https://jalagardalengua-blip.github.io/GANADERIA-27/).
En Android, menú ⋮ → «Instalar aplicación»; en iPhone, Compartir → «Añadir a pantalla de inicio».

## Qué incluye

- **Modo carrera**: escalafón ganadero contra nueve rivales, confianza de la propiedad, retos del mes con premios, valoración tipo carta en cada toro, vitrina de trofeos y buzón de noticias.
- **Gestión**: Inicio, Finca, Ganadería, Ofertas, Mercado, Tareas y Perfil, con interfaz negra y oro pensada para móvil.
- **Camada**: cada animal tiene genética, reata, hechuras y encornadura propias, y una calidad (de Común a Leyenda) que colorea su tarjeta.
- **Finca en 3D**: tu personaje a pie, a caballo con garrocha o en camioneta. Echas pienso, hierras becerros, curas lesionados, reparas cercas, devuelves reses escapadas, apartas y encierras toros, y tientas en la placita.
- **Tareas**: cada una se puede hacer en persona en la finca 3D (incluido el acoso y derribo a caballo) o delegar pagando al mayoral, vaqueros o veterinario.
- **Plaza en 3D**: cartel previo, marcador en directo, resumen con nota de cada toro y toro de la tarde; paseíllo, tercios de varas, banderillas y muleta, estilos de torero distintos, cogidas, estocada con pinchazos, descabellos y avisos, petición de oreja, mulillas, vuelta al ruedo e indultos. Clarín, pasodoble y público con sonido.

## Cómo jugar

Descarga la app o abre la web (arriba). En el ordenador también puedes abrir `index.html` en un navegador moderno. La partida se guarda en el propio dispositivo.

## Cómo se publica

- **Web:** cada cambio en la rama `main` se publica solo en GitHub Pages (`.github/workflows/pages.yml`).
- **App Android:** cada cambio en `main` compila un APK nuevo con Capacitor y lo sube a [Releases](https://github.com/jalagardalengua-blip/GANADERIA-27/releases) (`.github/workflows/android.yml`).

Para que las actualizaciones del APK se instalen encima, el APK debe firmarse siempre con la misma clave. Guárdala en **Settings → Secrets and variables → Actions** con estos nombres:

| Secreto | Contenido |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | el archivo `.jks` en base64 |
| `ANDROID_KEYSTORE_PASSWORD` | contraseña del almacén |
| `ANDROID_KEY_ALIAS` | alias de la clave |
| `ANDROID_KEY_PASSWORD` | contraseña de la clave (si es distinta) |

Sin esos secretos el APK se firma con una clave de depuración y, para actualizar, hay que desinstalar la versión anterior.

## Estructura

```
index.html            página principal
css/estilo.css        interfaz
js/juego.js           lógica de la ganadería y pantallas
js/mundo3d.js         finca, tienta y plaza en 3D (three.js)
js/libs/              three.js y cargadores 3D (incluidos, sin depender de internet)
img/                  fotografías y retratos
manifest.webmanifest  instalación como app
sw.js                 caché sin conexión
```

## Controles en 3D

- Joystick (o WASD) para moverte, arrastrar para mirar.
- Botón dorado para actuar; algunas acciones hay que mantenerlas pulsadas.
- En la tienta: «Citar» y «¡Templar!» en el momento justo (C y espacio en teclado).
- En Perfil puedes bajar la calidad gráfica si el móvil va lento.
