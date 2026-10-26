# Hierro y Divisa

Modo carrera de ganadero de bravo para el navegador y el móvil. Eliges una ganadería histórica o fundas la tuya, y la llevas mes a mes: cría, alimentación, tientas, herradero, reseñas para las ferias, ventas y corridas en una plaza 3D.

## Qué incluye

- **Gestión**: Inicio, Finca, Ganadería, Ofertas, Mercado, Tareas y Perfil, con interfaz negra y oro pensada para móvil.
- **Camada**: cada animal tiene genética, reata, hechuras y encornadura propias, y una calidad (de Común a Leyenda) que colorea su tarjeta.
- **Finca en 3D**: tu personaje a pie, a caballo con garrocha o en camioneta. Echas pienso, hierras becerros, curas lesionados, reparas cercas, devuelves reses escapadas, apartas y encierras toros, y tientas en la placita.
- **Plaza en 3D**: paseíllo, tercios de varas, banderillas y muleta, estilos de torero distintos, cogidas, estocada con pinchazos, descabellos y avisos, petición de oreja, mulillas, vuelta al ruedo e indultos. Clarín, pasodoble y público con sonido.

## Cómo jugar

Abre `index.html` en un navegador moderno. La partida se guarda en el propio navegador.

Para jugar desde el móvil como una app:

1. En GitHub, ve a **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`, y guarda.
2. Abre en el móvil la dirección que te da GitHub Pages.
3. iPhone: Compartir → «Añadir a pantalla de inicio». Android: menú ⋮ → «Instalar aplicación».

La primera carga necesita conexión (motor 3D y tipografías). Después funciona sin conexión.

## Estructura

```
index.html            página principal
css/estilo.css        interfaz
js/juego.js           lógica de la ganadería y pantallas
js/mundo3d.js         finca, tienta y plaza en 3D (three.js)
img/                  fotografías y retratos
manifest.webmanifest  instalación como app
sw.js                 caché sin conexión
```

## Controles en 3D

- Joystick (o WASD) para moverte, arrastrar para mirar.
- Botón dorado para actuar; algunas acciones hay que mantenerlas pulsadas.
- En la tienta: «Citar» y «¡Templar!» en el momento justo (C y espacio en teclado).
- En Perfil puedes bajar la calidad gráfica si el móvil va lento.
