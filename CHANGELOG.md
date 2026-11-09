# Cambios

## Plaza en directo y fiestas de pueblo con más ambiente
- **Público realista** (nuevo `js/publico.js`), en la plaza y en las fiestas de pueblo:
  - Miles de espectadores con ropa, piel y pelo variados.
  - Siguen la lidia con la cabeza.
  - Se levantan y alzan los brazos en los olés y aplauden en los remates.
  - Sacan pañuelos blancos para pedir la oreja, mientras el presidente saca el suyo del color que toca: blanco, azul, naranja o verde.
  - Pitan a los toros malos.
  - Abanicos y sombreros de paja al sol.
- **Plaza en directo**:
  - Palco presidencial, andanadas llenas, mozos y areneros en el callejón, y galería encalada con sus vomitorios.
  - Albero sin repeticiones de textura y con huellas: pezuñas, zapatillas y surcos que se rastrillan entre toro y toro.
  - La divisa cuelga sobre el morrillo; antes salía hacia delante como un cuerno.
  - Al final de cada toro, la cámara enseña los pañuelos y el palco antes de la tarjeta del resultado.
  - Suena con el audio del juego, sin tener que tocar la pantalla:
    - la banda toca en las buenas faenas de muleta y calla al entrar a matar;
    - aplausos en los remates y tras la estocada;
    - pasodoble de puerta grande con dos orejas o indulto;
    - pitos en los toros malos.
- **Rendimiento de la plaza en directo**:
  - La resolución se ajusta sola si va a menos de ~38 fps.
  - Solo se dibuja el público que ve la cámara.
  - Las sombras de los tendidos salen de una silueta de ~400 triángulos.
  - Sombras más ligeras en el móvil.
  - Sin filtros, grano ni desenfoques sobre la imagen 3D en el móvil.
  - Unos 140 triángulos por espectador.
  - En el emulador por software, el fotograma cuesta un 43 % menos.
- **Fiestas de pueblo** (nuevo `js/pueblo.js`):
  - Cadafales de madera de verdad: postes, vigas, cruces, tarima, barandilla, escalera y gradas con sillas de plástico.
  - Toldo de lona a rayas con fleco y la pancarta de la peña; de noche, bombillas.
  - En cada cadafal, la peña con su camiseta y el pañuelo rojo al cuello.
  - Más senyeras en los balcones.
  - Cohete al abrir el cajón: silbido, estampido y humo.
- **Fallo corregido**: las personas animadas de la calle salían «explotadas» en pinchos. El GLB de `persona2` de la auditoría tenía los índices de hueso corruptos; ahora se reempaqueta sin tocar los datos. El APK vuelve a incluir la vegetación.
- Nueva prueba `tests/e2e/publico.js`.
- **Barra inferior sencilla**: botones pequeños abajo con la velocidad (×1, ×2, ×4), la cámara, «Siguiente toro» y «Acabar corrida», que salta al resumen final. A ×4 la simulación va por subpasos y no da saltos.
- **Toro con más movimiento**:
  - Menudillos que se recogen al galopar y al andar.
  - El cuello se dobla para humillar y mirar.
  - Da pasos al girar.
  - Cola más viva cuando tiene casta.
  - Acciones nuevas: escarbar con cualquier mano y la cabeza baja, resoplar (con sonido), cabecear, derrotar al final del pase (más fuerte si tiene casta) y perder las manos si es flojo.
  - Respira más fuerte según avanza la faena.
- **Más calidad de imagen**: hasta 2× la resolución de la pantalla, sombras de 2048 y texturas más nítidas en el móvil. La resolución solo baja si va a menos de ~33 fps, y nunca por debajo de 0,85.

## Auditoría: fallos corregidos
- **Bancarrota definitiva**: al bajar de −90.000 € (o si la propiedad te pierde la confianza) la ventana ya no se puede cerrar, la partida queda marcada, no se puede avanzar y al recargar vuelve a salir. «Empezar otra carrera» borra también la copia automática (las ranuras guardadas a mano se conservan).
- **Equilibrio**:
  - Personal proporcional al tamaño de la camada (1.200 € + 18 €/cabeza en vez de 2.500 € + 10 €/cabeza).
  - Finca saturada: castigo de salud proporcional al exceso, menos partos y pastos arrendados (35 €/cabeza de más). La tienta solo preselecciona las vacas que caben.
  - Hierros nuevos: 240.000 € y algo más de ganado al empezar, más ofertas de plazas de tercera y pueblos, mejores precios en segunda y tercera, prestigio por darse a conocer en plazas pequeñas y un suelo de prestigio de 8.
- Las corridas ya lidiadas salen de la lista de ofertas pasado un año (siguen en el historial).
- `persona2` en formato GLB (más ligero de descargar, reempaquetado sin tocar el esqueleto); el APK ya no incluye los modelos JSON que tienen versión GLB, ni documentación ni pruebas (la vegetación sigue incluida).
- Cabecera: en móviles estrechos el nombre y el subtítulo de la ganadería pasan a dos líneas en vez de cortarse.
- Corrida en directo: la pantalla completa solo se pide al tocar (antes salía un error en la consola) y ya no se marcan para subir a la gráfica texturas que aún no han cargado.
- Código: las 123 ampliaciones de funciones del núcleo pasan por `envolver()` (registro en `GANCHOS`, errores aislados y anotados); `esc()` escapa el apóstrofo y `jsq()` protege textos dentro de `onclick`.

## Toro mejorado
- Superficie suavizada: se acabaron las facetas del modelo.
- Hechuras de toro de lidia esculpidas: morrillo alto, pecho hondo con papada, cuerpo más redondo y cara más corta.
- Pelo con la luminosidad correcta bajo la luz de la plaza (el cárdeno ya no sale blanco) y menos brillo.

## Personas realistas
- Recortadores y personal de la finca con cuerpo humano real, cara, ojos, cejas y pelo (Quaternius, CC0), con ropa de colores por zonas, cuatro tonos de piel y dos peinados.
- Toros y vacas animados (PR #21).

## Interfaz profesional
- Cabecera cinematográfica en cada pantalla con sus datos clave en vivo.
- Inicio con hub de grandes accesos ilustrados (Finca 3D, Ganadería, Ofertas, Mercado, Tareas, Bous al carrer).
- Cifras con tipografía deportiva, transiciones al cambiar de pestaña y brillo en los accesos.
- Imágenes confirmadas como propias del propietario (generadas con IA).

## Fases 4 a 12
- Finca: paredes de piedra seca, charcas con juncos, abrevaderos, manga y mueco; inspección de instalaciones.
- Ganadería: árbol genealógico, buscador, orden y comparador.
- Libro de cuentas mensual exportable a CSV.
- Cada pueblo de bous al carrer con su propio callejero y colores de su comarca.
- Calidad gráfica automática y resolución dinámica; contador de FPS opcional.
- Compartir el resultado de una corrida.
- LICENSES.md y README de desarrollo.

## Fase 4 (parcial) · clima
- El tiempo de la dehesa cambia cada semana según la estación: sol, nubes, lluvia o niebla por la mañana, con indicador en la finca.

## Fase 2 · panel de mando y accesibilidad
- Inicio con avisos (lo urgente en rojo), agenda de festejos y gráfico de cuentas.
- Ajustes → Accesibilidad: texto grande o muy grande y modo «reducir movimiento».
- Bus de eventos interno para que las funciones nuevas no se pisen.

## Fase 1 · estabilidad y guardado (rama `desarrollo`)
- El 3D ya no depende de internet: three.js va dentro del juego.
- Se acabó la fuga de memoria al entrar y salir de la finca, la plaza o la calle.
- Guardado con comprobación, copia de seguridad automática y recuperación si la partida se daña.
- Ajustes → Partidas: 3 ranuras, exportar e importar la partida, registro de errores y borrar todos los datos.
- El juego se pausa (3D, música y sonido) al bloquear el móvil o cambiar de app.

## Fase 0 · auditoría (5 nov 2026, rama `fase-0-auditoria`)
- Sin cambios en el juego.
- Documentación: inventario, esquema de partida, línea base de calidad, riesgos, créditos y estado de la hoja de ruta.
- Pruebas reproducibles en `tests/e2e/`, partida de referencia y capturas.

## Hasta el 5 nov 2026 (publicado)
Calendario por semanas al estilo FIFA, barra de gala y pantallas a juego, sonido de plaza sin zumbidos, modelos animados CC0, ganadería de corro y bous al carrer, finca 3D con obras y personal, música de banda.

## Divisas reales
- Las 34 ganaderías históricas llevan su divisa real (33 verificadas en las fichas de Servitoro; Conde de la Corte conserva la del juego). Divisas de 1, 2 o 3 colores en tarjetas, escalafón y en el morrillo del toro en 3D. Fincas corregidas.
## Finca 3D más real
- Vaquero y mayoral con cuerpo humano realista; herramientas en las manos y piernas abiertas a caballo.
- Pasto alto que se mece con el viento alrededor del jugador, con el color de cada estación.
- Suelo de dehesa con manchas de hierba verde, pasto seco y calvas de tierra.
- Solares sin construir con estacas, cuerda y cartel de madera.

## Pulido visual
- Vitrina 3D en la ficha: el animal real girando sobre albero, se puede arrastrar.
- Cartel de toros clásico al entrar en la plaza (papel crema, hierro, divisa, terna y reseña).
- Público de la plaza con siluetas de persona sentada, pelo y tonos de piel variados.

## Toro realista y jinetes
- Toro de lidia propio (Tripo) con esqueleto y animaciones; pelos y señas pintados sobre su textura. Versión ligera para la finca.
- Alguacilillos y picadores con cuerpo realista montados, vara en la mano.
- Tarjetas de ganadería sin textos de descripción ni colores escritos; foto distinta para cada una según su pelo.

## Interfaz moderna
- Capa `css/moderno.css`: paneles de cristal con filo fino, cabeceras de sección limpias, barra superior compacta, pestañas segmentadas, botones y ventanas redondeados.
- Fuentes alojadas en el juego (funcionan sin conexión y se ven igual en todos los móviles).
- La vitrina de la ficha usa siempre el toro detallado.

## Corrida en directo realista
- Ver en directo abre la plaza realista. La faena se compone con la bravura, nobleza, casta, fuerza, encaste y pelo del toro y el estilo del matador; la presidencia saca los pañuelos según el resultado del juego (orejas, vuelta, indulto, silencio, pitos, devuelto). Botón “Vista clásica” para la plaza de antes.

## Estocada y corridas distintas
- Suerte suprema animada: perfilarse, entrar a matar, pinchazos, media o entera, descabellos, avisos con clarín, toro que se amorcilla y cae; indulto con simulacro y vuelta a toriles.
- Cada corrida distinta: luz (tarde, ocaso, noche) según orden y feria, albero y barrera por plaza, entrada de público según categoría, repertorio por estilo del matador (delantal, tafallera, revolera, manoletina, molinete, trincherazo, firma).
