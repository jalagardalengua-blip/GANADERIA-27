# Cambios

## Ganadería de corro: físicas sin errores y pilón del embolat en medio de la plaza
- El pilón del bou embolat está en medio de la plaza: el toro sale del cajón con la soga, baja la calle caminando con los emboladors, se resiste cerca del poste y queda amarrado en el centro.
- Al cortar la soga el toro arranca y se aleja del pilón, y corre libre por toda la plaza y las calles. El pilón es un poste físico real (ya no un refugio con margen) y la res lo rodea por el lado con más espacio.
- Movimientos de la res sin errores: rodeo inteligente de pilón, fuente y refugio central; sin teletransportes al desencajarse (sale caminando); giro limitado a ~260° por segundo, sin latigazos.
- Encierro: la manada toma las esquinas sin saltos ni cambios bruscos de dirección (también la cámara «la res»).
- Cada pueblo del selector tiene su plaza con su nombre (por ejemplo «Plaça de l'Església de Benicarló»).
- Test de física endurecido: falla con cualquier teletransporte, giro brusco, atasco, res dentro de una casa o embolat que no se despegue del pilón.

## Ganadería de corro: diferentes plazas según el pueblo
- Plaça Major (interior): soportales de piedra, casas de entramado, fuente de granito y cadafales de colores.
- Plaça de l'Església (costa): iglesia con portada de columnas, rosetón de vidriera y campanario con chapitel de azulejo azul; casas encaladas con zócalo azul y terrados; palmera con talanquera; refugio blanco y azul; cadafales azules, blancos y verdes.
- Plaça de l'Ajuntament (ribera): ayuntamiento con porches de arcos, balcón corrido con las banderas de España, la Comunitat y Europa, reloj y campana; casas más altas; farola monumental de hierro; refugio rojo y blanco; cadafales con los colores de la senyera.
- Plaça de la Vila (interior): casas de piedra con galerías de madera, porches de madera, cadafales de madera natural y refugio de madera.
- Las zonas de juego, los refugios y las físicas son las mismas en todas. El rótulo de entrada muestra el nombre de la plaza.
- Plazas de pueblos reales, con los elementos documentados de la plaza donde se celebran sus fiestas (inspiradas, no copias exactas: el recinto de juego es el mismo):
  - Plaça Major de Vila-real: plaza porticada con el Ajuntament en la propia plaza (allí se corre el bou embolat de Sant Pasqual).
  - Plaça Major de Nules: cadafales junto a la iglesia de Sant Bartomeu i Sant Jaume, con cúpula de media naranja sobre tambor y teja vidriada.
  - Plaça Major de Borriana: basílica gótica del Salvador con contrafuertes, portada apuntada y campanario de planta cuadrada («El Templat»).
  - Plaça del Pla d'Onda: iglesia de la Asunción con dos portadas y hornacina, y el Castell de les 300 torres sobre el cerro al fondo.
- Corregido un error que impedía construir las plazas con refugio amarillo.

## Menos tirones y toro más estable
- Corrida en directo: un 40 % menos de llamadas de dibujo por fotograma (733.000 → 494.000 triángulos, 156 → 82 piezas con sombra). Los flecos de las hombreras son una sola malla por hombro, los adornos pequeños no proyectan sombra y en el móvil el público usa figuras más ligeras y sombras más baratas.
- Las sombras ya no tiemblan: la caja de sombras del sol se mueve a saltos de un píxel de su mapa, en la plaza y en la finca.
- Finca: el encinar y los berrocales ya no desaparecen al mirar hacia otro lado (fallo de visibilidad de las mallas instanciadas). Las encinas llevan una sombra pintada en lugar de sombra en tiempo real: el pase de sombras baja de 457.000 a 215.000 triángulos.
- Herramienta tests/gpu.js para medir el coste de dibujo de cada escena.

## Ganadería de corro: físicas de la res, bou embolat real y plaza rodeada de cadafales
- Físicas: la res ya no atraviesa casas ni paredes ni se queda enganchada. Se comprueba el cuerpo entero (hocico, centro y grupa); resbala por las paredes, gira hacia el lado libre al chocar, se desencaja sola y va de la plaza a las calles por las bocacalles, también al recogerse y los cabestros. Los recortadores tampoco se meten en las fachadas al correr, esquivar o ser volteados (js/corro-fisicas.js).
- Bou embolat como en la vida real: la res sale del cajón lazada por los cuernos, la soga pasa por la anilla del pilón y los emboladors la recogen a tirones hasta amarrarla; le protegen las astas con barro, le colocan el armazón de hierro con las bolas de estopa, las encienden con la antorcha, se apagan las luces de la calle, se corta la soga y queda libre. Soga con física, planos de cámara del ritual y bolas que se van consumiendo.
- Fuego de verdad en el embolat (js/corro-fuego.js): llamas de partículas que dejan estela cuando el toro corre, humo negro de la brea, bolas de estopa incandescentes que se consumen, luz que parpadea y antorcha encendida. Número fijo de partículas para que no haya tirones.
- El embolador del rabo: mientras el toro está amarrado, uno le sujeta la cola desde atrás y tira de ella (la cola se dobla de verdad hacia su mano); al cortar la soga la suelta y corre.
- Toda la plaza central rodeada de cadafales (solo quedan abiertas las bocas de las calles).
- Objetos fotoescaneados de Poly Haven (CC0): sillas de plástico en los tablados, sillas gallinera, mesas de terraza, bancos, jardineras, barricas y cajas de las peñas. Optimizados y dibujados con instancias; en calidad media se colocan menos y en baja ninguno.
- Test nuevo: tests/e2e/fisicas-corro.js (la res no asoma dentro de las casas, no se atasca y el embolat sigue todas las fases).

## Finca más real, mando táctil moderno y realización de TV
- Dehesa: encinas de copa ancha y redondeada con la línea de ramoneo, tronco gris pardo con ramas maestras; berrocales de granito con líquenes; sierra azulada en el horizonte; sol más cálido y suelo con más color.
- Mando: joystick flotante en la mitad izquierda, correr al empujar a fondo, pellizco para el zoom y doble toque para poner la cámara a tu espalda. El botón de acción late y vibra cuando hay algo que hacer, y unas etiquetas flotantes señalan lo que tienes cerca (cortijo, mayoral, caballo, camioneta…).
- Corrida en directo: una sola realización de televisión (cámara principal del tendido, tele cerrado y cámara baja del callejón), con cortes entre series y sin botón de cámara.
- Tests nuevos: mando.js y tv.js.

## Ganadería de corro: nueva Plaza Mayor para ver tu hierro en directo
- El pueblo de los bous al carrer se sustituye por una plaza de calidad (js/plazamayor.js): casas con planta baja de sillería de granito, fachadas encaladas o de entramado, balcones de forja con geranios, galerías de madera, soportales con columnas de piedra y terraza, tejados de teja árabe con aleros y chimeneas, y faroles de pared.
- Texturas generadas con relieve y rugosidad (arena con huellas de pezuñas y pisadas en plaza y calles, enlosado de granito, sillería, teja, madera y pintura); de noche las ventanas y los faroles se encienden.
- Cadafales de tubo pintado con jaula, tablado, barandilla, rótulos de peñas y toldos; escaleras de acero azules hasta los tablados; talanqueras de tubo en las calles; refugio central amarillo con torre y farol; fuente de granito con caños y talanquera.
- Público: los personajes reales del juego en los tablados y bajo los soportales (animan cuando la res embiste) y el público instanciado en balcones, jaulas y barreras.
- Solo cambia el escenario de los festejos de la ganadería de corro: las zonas de juego, la res, los recortadores, las cámaras y todos los festejos (vaquillas, embolat, capea, encierro, corda, bous a la mar y cerril) funcionan igual. El concurso de recortadores sigue en la plaza de toros.

## Logos en todas las ganaderías, torero y público
- Todas las tarjetas de elegir ganadería muestran el logo (hierro sobre los colores de la divisa) en lugar del toro genérico. Victorino Martín lleva su hierro real; el resto lleva de forma provisional sus letras trazadas como un hierro de marcar, hasta tener la imagen de su hierro real.
- Torero: hombreras con flecos y borlas, camisa blanca y corbatín, oro más rico y cara más fina.
- Público: figuras sentadas con hombros y rodillas en lugar de cilindros, con el mismo coste para el móvil.

## Círculos negros en el iPhone, corregidos
- Causa: en su último fotograma cada partícula de polvo calculaba su transparencia con una potencia de un número negativo (NaN). Los iPhone pintan ese valor como un disco negro opaco; en ordenador no se veía.
- El polvo ya no envía nunca valores no válidos a la GPU y ahora se dibuja con cuadritos orientados a la cámara en lugar de puntos de GPU, que cada móvil trata a su manera.
- Corregidos cuatro sombreados con bordes de smoothstep invertidos (comportamiento indefinido en GPU de Apple).
- Test nuevo: polvo.js (cero valores no válidos durante la faena).

## Corrida en directo: tendido, toro y fallos de imagen en móvil
- Sin "círculos": las rayas de picadores se pintan en el propio albero con un grosor que se adapta a la distancia y al ángulo; ya no parpadean ni se cortan en el móvil.
- Polvo más suave: sin discos visibles cerca de la cámara.
- Cámara del tendido como la de televisión: más baja y cercana, sigue la acción con panorámica suave y zona muerta, zoom solo en cambios claros y sin ver sus propios asientos en vertical. El callejón también se suaviza.
- Toro: da pasos al revolverse en vez de girar como una estatua, y se inclina al arrancar y al frenar.
- Test nuevo: tendido.js (capturas en apaisado y vertical y suavidad de la cámara).

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
