# Cambios

## Pantalla de carga y hierros reales
- Pantalla de carga profesional con la imagen de cartel: al abrir el juego, al entrar en la finca, la plaza, la tienta o un festejo, y en la corrida en directo. Zoom lento, título, destino, barra de progreso y un consejo.
- Al tocar un botón que entra en 3D, primero aparece la pantalla de carga y después se monta la escena; los sombreados se precompilan para que el primer movimiento no dé tirones.
- Logo de cada ganadería: su hierro real en negro sobre los colores de su divisa, en la elección de ganadería y en el emblema del juego. Victorino Martín ya tiene su hierro (A coronada) trazado de la imagen real.
- Herramienta tools/hierro_svg.py para vectorizar cada hierro a partir de su imagen.

## Esqueleto del toro, arrastre y calidad de imagen
- El toro muerto ya no queda patas arriba ni hundido en el albero: la animación de muerte lo tumba de costado sin el giro extra.
- Arrastre real: las mulillas se enganchan del lado de la puerta y tiran del toro por los pitones con cuerda, sin hacerlo girar ni pasar por debajo de ellas.
- Mulillas con el caballo animado, collera con cascabeles y madroños de colores.
- Corrida en directo: la cabeza del toro ya no da bandazos de un lado a otro cuando el torero queda a su espalda; el giro del cuello es más suave y contenido.
- Calidad de imagen: texturas nítidas en ángulos rasantes y resolución que sube sola hasta 2x si el móvil va sobrado (y baja si se resiente).
- Tests nuevos: arrastre y esqueleto del toro.

## Cogidas en la corrida en directo
- Cuando el juego decide que hay cogida, en la plaza realista el toro prende al torero en mitad de un pase, lo voltea en el aire y lo deja en el albero, con polvo, aviso "¡Cogida!", vibración en el móvil y cambio de cámara.
- Cogida leve: el toro se aleja, el matador se levanta y sigue la faena.
- Cogida grave (con sustituto): se lo llevan a la enfermería y el resultado dice quién mata al toro.
- Auditoría: sin errores de JavaScript ni archivos rotos, sin fugas de memoria al entrar y salir de la finca y un año de simulación limpio.

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

## Toro con esqueleto en la plaza en directo
- Animaciones reales de paso, galope y muerte; humilla, derrota, sigue la tela, rabo vivo, respiración con cansancio, escarba si es manso, se raja a tablas y se aploma antes de la estocada. Estoque clavado en el morrillo.
- Catálogo de modelos revisados en docs/CATALOGO_MODELOS.md.

## Física y choques
- Finca: las reses ya no atraviesan árboles, abrevaderos, comederos ni muros; ni tú ni el caballo atravesáis a los animales; la separación entre reses ya no las saca del cercado.
- Corro: el mozo volteado ya no atraviesa fachadas.
- Plaza en directo: toro y torero no cruzan la barrera y el toro no se monta sobre el torero fuera del embroque.

## Corrida en directo con acabado del juego
- Sin mando inferior: barra mínima como en el corro (cámara, velocidad, siguiente, vista clásica, salir).
- Cartel y resultado con la tipografía y paneles del juego; sin grano ni franjas negras.
- Público con siluetas sentadas y colores sobrios; cámara del callejón por encima de la barrera; pelo cárdeno natural.
- Más ritmo (citas, paseos y estocada más ágiles) y giros del toro en arco según su velocidad.

## Corrida en directo: imagen limpia
- Sin cartel arriba: solo la plaza y la barra de botones.
- Cabeza del toro suave: sigue la tela sin sacudidas y el derrote es natural.
- Arreglos de imagen en móviles: sin parpadeo en el pelo, rayas del albero y barrera sin parpadeos, sombras más estables.

## Rendimiento y fallos de la plaza en directo
- 80% menos triángulos (de 2,8 M a 540 k): público ligero.
- Calidad automática: baja resolución, sombras y sombreros si el móvil no llega a ~38 FPS.
- Polvo sin discos grandes; rayas de picadores finas y gastadas.
- Pesos del esqueleto del toro alisados y soldados en costuras: sin roturas en cuello, patas ni costuras al moverse.

## Plaza en directo: física, cámara, velocidad y público
- Capote y muleta chocan con todo el toro (cabeza, cuello, morrillo, costillar, cuartos) en cada iteración: ya no lo atraviesan.
- La cámara nunca se mete dentro del toro, del torero ni bajo el albero; la del tendido va por encima de las gradas.
- Velocidad hasta ×4 con subpasos de física.
- Público: pañuelos blancos al pedir la oreja o el indulto antes de que decida la presidencia.
- Sin cálculo oculto de grano en cada fotograma.

## Móvil (Android e iOS)
- Pantalla completa solo donde el navegador la admite (oculta en iPhone).
- Tareas de la finca plegadas en pantallas bajas y ocultas si están vacías.
- Sin zoom automático de iOS en buscadores y desplegables.
- Plaza en directo en vertical con encuadre más abierto; vibración breve en los grandes momentos (Android); vibración en la cogida en la finca.
- Pasto alto sin manchas negras (sin mezcla de bordes transparentes con negro).
