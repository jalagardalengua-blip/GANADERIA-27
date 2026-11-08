# Cambios

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
