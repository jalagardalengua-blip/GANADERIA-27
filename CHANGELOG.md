# Cambios

## Movimientos del torero nuevo más naturales
- Piel repartida por la superficie del cuerpo (distancia geodésica) y no en línea recta: el costado y la espalda de la chaquetilla ya no se van con el brazo al citar o dar el pase.
- Postura de enlace igual que la del modelo (brazos algo abiertos, pierna derecha adelantada) y hombros en su sitio: los brazos giran desde la articulación de verdad.
- Agujero del muslo izquierdo (donde iba pegada la muleta) tapado.
- La cabeza ya no mira al cielo; vaivén suave de la cabeza siguiendo al toro, respiración, peso cargado en una pierna y rodillas algo flexionadas al citar.

## Torero realista, cámara de la plaza de corro e imagen HDR
- **Torero nuevo en la corrida en directo** a partir del modelo 3D enviado por el jugador: se ha separado del toro, se le han quitado la muleta y el estoque que venían pegados a las manos y se le ha puesto el esqueleto del juego, así que anda, cita, da los pases y entra a matar con las animaciones de siempre (las telas y el estoque del juego van aparte). Malla reducida a unos 15.000 triángulos y textura de 1024 px para el móvil.
- **Plaza de corro (festejos populares):**
  - Cámara con el dedo: arrastra para girar alrededor de la acción, pellizca para acercar y doble toque para volver al plano del realizador.
  - Selector de planos claro: TV, cadafal, la res y libre (en el libre recorres la plaza a tu aire).
  - Flecha en el borde que señala dónde está la res cuando se sale del encuadre.
  - Revelado HDR como en la corrida: resplandor, curva ACES, color de tarde de fiestas, viñeta y grano (se apaga solo si el móvil no llega).
  - Luz ambiental real de una calle (HDRI «Pedestrian Overpass» de Poly Haven, CC0).
  - Modelos glTF gratuitos CC0: farolas de poste con farol («Lantern», Khronos) en las calles y radiocasetes («BoomBox», Microsoft) en los cadafales. Licencias en modelos/props/LICENCIAS.md.

## La Vall d'Uixó: plaza de bous hecha a partir de fotos reales
- Explanada de arena de 44 × 30 m (la plaza genérica es de 28 × 22) rodeada de cadafales de andamio de dos alturas pintados de azul, rosa, verde, negro, rojo, naranja y blanco, con los carteles de las peñas, la jaula de barrotes abajo y el tablado con barandilla arriba.
- Refugio amarillo en medio: muretes en laberinto, escalones y una torreta con tejadillo, con la gente dentro y cubos de agua.
- Escalera de madera de peldaños con armazón morado (también es refugio).
- Farolas negras de dos faroles en lo alto de los cadafales.
- Detrás, bloques de pisos de ladrillo de siete y ocho alturas con balcones blancos y un edificio moderno de fachada gris con lamas.
- Arena de playa, más clara. Los refugios funcionan igual para la res (test nuevo: plaza-vall.js).

## Divisas en los nombres y vida en la finca
- El nombre de cada ganadería se escribe en letra clásica con los **colores reales de su divisa** (Miura verde y negro, Victorino azul y encarnado…), en la cabecera, la elección de ganadería y el resto de pantallas. Fuera el estilo de cartel.
- Finca 3D con vida:
  - Vaquero a caballo rondando el ganado (uno de la casa y, además, cada vaquero contratado).
  - El personal contratado trabaja: el veterinario va de la clínica al mueco y a los corrales, el guarda recorre las cercas, el conocedor vigila la camada y el representante va y viene del cortijo. A todos se les puede hablar y cuentan algo útil (salud de la ganadería, el mejor macho, ofertas pendientes…).
  - Dos mastines: uno te sigue cuando andas y otro sestea en la puerta del cortijo. Se les puede acariciar.
  - Garcillas bueyeras entre las reses (levantan el vuelo si te acercas), nido de cigüeñas sobre un poste, cigüeñas planeando y bandadas de estorninos.

## Agenda y menús más claros
- Inicio: en lugar del cartel enorme con el nombre (que ya está en la cabecera) sale una **agenda** con lo que pide atención: cuándo te quedas sin dinero a este ritmo, finca saturada o casi llena, ofertas que caducan este mes y tareas pendientes. Cada aviso lleva a donde se arregla.
- Aviso al avanzar si la bancarrota está a menos de seis meses.
- Cabeceras de Ofertas, Mercado, Tareas y demás pestañas mucho más bajas: el contenido se ve sin bajar.
- El anillo de la cabecera dice «VAL» (valoración), para no confundirlo con el prestigio (★).
- El «Modo torero · próximamente» deja de salir en el menú hasta que esté terminado.

## Revisión de fallos
- Bancarrota definitiva: antes la ventana se podía cerrar y se seguía jugando con deudas sin fin (en una prueba de 4 años se llegó a −216.000 €). Ahora queda guardada, la ventana vuelve a salir y «Avanzar» no deja seguir.
- Ofertas: el plazo decía «Responde antes de Febrero» estando ya en febrero (en realidad se puede responder todo el mes). Ahora dice «Responde este mes» o «Tienes hasta final de …».
- Plaza a pantalla completa en el móvil: se pedía después de la pantalla de carga, cuando el navegador ya no lo permite (y daba un error). Ahora se pide en el mismo toque.
- Imágenes de la barra inferior y los iconos de la aplicación comprimidas sin pérdida visible: de 611 KB a 139 KB.

## Ganadería de corro: cada plaza con su tamaño y proporciones reales
- Hasta ahora todas las plazas medían 28 × 22 m. Ahora cada pueblo tiene las suyas:
  - Peníscola: 22 × 17 m, en lo alto del peñón;
  - Vila-real: 38 × 26 m, porticada;
  - Onda y Segorbe: 36 × 19 m, alargadas;
  - Xàbia y Cabanes: compactas;
  - Benicarló: 33 × 24 m; Vinaròs y Ontinyent: 34 × 24 m; Sagunt: 26 × 20 m…
- Las medidas salen de la guía de plazas o del contorno real de la plaza en OpenStreetMap; si no hay dato fiable, de lo típico de cada tipo de plaza.
- Con cada tamaño se adaptan la arena, los cadafales, los refugios, las escaleras, el pilón del embolat, las bocacalles, el recorrido del encierro, las casas, la iglesia o el ayuntamiento y los edificios reales.
- Las bocas de las tres calles y el cajón no se mueven, así que la res entra y sale igual.
- El test de físicas cubre 18 festejos, entre ellos la plaza más pequeña (Peníscola) y Xàbia: 0 fallos.

## Ganadería de corro: cámara de realizador y embolats mejorados
- La cámara general ya no mira las calles desde lo alto, donde solo se veían tejados iguales en todos los pueblos.
  - En la plaza encuadra desde el lado del cajón, con la iglesia, el campanario o el monumento de cada pueblo al fondo.
  - En las calles va a la altura de los balcones, entre las fachadas reales, mirando hacia la plaza.
  - Cambia de plano con cortes limpios y nunca se mete en el cajón.
- Bou embolat:
  - el ritual en el pilón se ve con calma: amarre, barro, hierros, encendido y suelta duran ahora entre 2,4 y 7,6 s cada uno;
  - al prender las bolas salta una lluvia de chispas, y al galopar o sacudir la cabeza el toro va soltando pavesas que caen y rebotan en el suelo;
  - suelto de noche, la cámara lo sigue de cerca y bajo para que el fuego llene el plano;
  - ya no hay plano aéreo al soltarlo.
- La res ya no se queda parada al trote: si en un segundo no avanza medio metro, remata y busca otra cosa.

## Ganadería de corro: también las calles del recorrido y las iglesias, distintas en cada pueblo
- Las calles del cajón y de salida ya no tienen las mismas casas en todos los pueblos.
  - Las bordean los edificios reales de cada uno, pegados a la calle y con sus alturas y tejados.
  - Donde el plano real deja hueco, hay casas en fila con balcones y gente.
- Cada iglesia tiene la fachada de su estilo:
  - gótica con rosetón: Borriana, Sagunt, Segorbe, Xàbia, Peníscola…;
  - barroca con remate curvo, hornacina y óculo: Benicarló, Vinaròs, Alcalà, Dénia…;
  - neoclásica con óculo y frontón liso: Nules, Moncofa, Benicàssim…

## Ganadería de corro: las 14 plazas de Castellón según la guía de entornos 3D
- Vila-real: cuatro alas porticadas alrededor de la plaza y torre-reloj del ayuntamiento.
- Nules: fuente-monumento en el eje entre la iglesia de cúpula azul y el ayuntamiento.
- Borriana: campanario de ladrillo, El Templat.
- Onda: el castillo domina justo detrás de la plaza, rodeada de soportales.
- Almassora: recinto porticado con barreras y cadafales de madera.
- Cabanes: iglesia de mampostería parda, campanario octogonal y sierra de bancales.
- Torreblanca: iglesia encalada y torre de piedra almenada exenta.
- Benicarló: campanario octogonal aislado en la explanada, que se rodea entero.
- Peníscola: el peñón rodeado de mar con el castillo encima.
- Segorbe: la catedral al fondo y torres medievales de piedra oscura.
- La Vall d'Uixó: la Serra d'Espadà escarpada y verde, justo detrás.
- Betxí: torreón central del Palau.
- Vinaròs y Moncofa ya seguían la guía.
- Las «torres» grandes del mapa ya no llevan un chapitel desproporcionado.

## Menús más cómodos
- La barra con la fecha, el dinero, el prestigio y «Avanzar» se queda fija arriba al bajar por cualquier pantalla.
- Tareas en una sola fila (punto, texto y botón); antes cada una ocupaba tres líneas.
- Listas largas plegadas: en la finca las obras salen de cuatro en cuatro con «Ver N más» (la pantalla pasa de unos 7.000 a unos 3.900 píxeles de alto).
- Las cifras del resumen ya no parten palabras («ESCALAFÓ-N», «CONFIANZ-A»); la cabecera de inicio es más baja.
- En la cabecera se lee el encaste («Encaste Albaserrada») en vez de cortarse.
- Botones desactivados legibles, toques sin retardo y aparición suave al cambiar de pestaña.

## Banderillas mejor realizadas
- Segunda cámara de tendido: si el peón sale del burladero justo debajo de la cámara principal, se corta a la del otro tendido en vez de quedarse mirando en picado sin encuadrar a nadie.
- Durante el tercio de banderillas el realizador normal ya no pisa los planos del peón.

## Ganadería de corro: la plaza real de cada pueblo, edificio a edificio
- Cada uno de los 34 pueblos se construye con los edificios reales que rodean su plaza de fiestas, sacados de OpenStreetMap: planta exacta, número de plantas o altura, iglesias y torres.
  - La iglesia o el ayuntamiento real queda al fondo de la arena.
  - Las calles que salen de la plaza son las de verdad.
- En los pueblos donde OpenStreetMap no tiene dibujados los edificios (Nules, la Vall d'Uixó, El Puig, Moncofa…), las casas se levantan en fila sobre las manzanas reales que forman sus calles.
- Fachadas con planta baja de piedra y zócalo, pisos con balcones y gente en las que dan a la plaza, faroles, cornisas, tejados a cuatro aguas o terrados.
- Solo se carga el pueblo del festejo (≤ 22 KB). La arena, el recorrido y el cajón no cambian, así que las físicas de la res son las mismas.
- Datos © colaboradores de OpenStreetMap (ODbL).

## Modo hiperrealista en la corrida en directo
- Botón «HD» en la barra de la corrida (encendido por defecto donde el móvil lo admite; se recuerda).
- La plaza se pinta en alto rango dinámico (HDR) con antialiasing 4× y pasa por un revelado de cine/TV: resplandor real de las luces, del sol y de los brillos del traje de luces (bloom), curva de color ACES, gradación cálida de tarde de toros, nitidez, viñeta suave, una pizca de aberración de lente y grano fino.
- Si el móvil va justo, el resplandor se apaga solo antes de bajar la resolución; en móviles sin WebGL2 sigue el modo normal.
- Test nuevo: hiper.js.

## Ganadería de corro: los edificios de cada plaza en su sitio
- La iglesia y el ayuntamiento, frente a frente como en la plaza real: Vinaròs, Xàbia, Nules, Borriana y Dénia. En Sueca preside el ayuntamiento y enfrente queda Sant Pere con su cúpula azul.
- Peñíscola: la plaza de Santa Maria al pie del castillo, en lo alto del peñón.

## Ganadería de corro: cada plaza se reconoce durante el festejo
- Al empezar el festejo, la cámara presenta la plaza desde lo alto durante unos segundos, con su nombre y lo que la distingue: campanario, castillo, palacio, monasterio, mar o sierra. Después sigue a la res.
- Cada pueblo tiene los colores y tejados de su zona:
  - costa encalada, con zócalos y muchos terrados;
  - piedra y teja oscura en el interior;
  - ocres y pasteles en l'Horta.
- El empedrado acaba en el pueblo: alrededor se ven campos de huerta, de secano o monte según la zona, en vez de un suelo de baldosas hasta el horizonte.
- Los cerros de los castillos tienen relieve de roca.

## Ganadería de corro: la plaza de cada pueblo en todo el juego
- Las ofertas de festejos muestran la foto de la plaza del pueblo (en penumbra si el festejo es de noche), con su nombre y lo que la distingue.
- Al crear la ganadería, el selector de pueblo enseña «La plaza de tus fiestas».
- La plaza aparece también en Contratados, en Últimos festejos, en el aviso del calendario el día del festejo y en la pantalla de resultados.

## Ganadería de corro: la plaza de fiestas de cada pueblo
- Los 30 pueblos del selector que aún usaban una plaza genérica tienen ahora su plaza propia, con nombre y elementos reconocibles. Junto con Vila-real, Nules, Burriana y Onda, son ya los 34.
- Castellón:
  - Benicarló: campanario octogonal exento junto a Sant Bartomeu.
  - Vinaròs: Plaça Parroquial con la Arxiprestal fortificada y su campanario exento.
  - Peñíscola: castillo sobre el peñón en el mar.
  - Segorbe: torres medievales y campanario de la catedral.
  - Betxí: Palau-Castell renacentista.
  - Alcalà de Xivert: el campanario más alto de la provincia.
  - Borriol: castillo en ruinas.
  - Benicàssim, Moncofa y Torreblanca: costa, palmeras y zócalos azules.
  - La Vall d'Uixó, L'Alcora, Cabanes y Almassora: sierras, azulejo o piedra.
- Valencia:
  - Ontinyent: el campanario más alto de la Comunitat, sobre la Plaça Major porticada.
  - Sagunt: Santa Maria gótica, plaza porticada y el castillo sobre el cerro.
  - El Puig: monasterio de cuatro torres.
  - Foios: su torre.
  - Puçol: el palacio.
  - Llíria: la Assumpció en lo alto.
  - Chiva: castillo en ruinas.
  - Sueca, Meliana, Museros, Massamagrell y Alboraia: plaza del ayuntamiento o de la iglesia, con cúpulas y campanarios de teja vidriada.
- Alicante:
  - Dénia: castillo, Montgó y puerto.
  - Xàbia: Sant Bertomeu, iglesia-fortaleza de piedra tosca bajo el Montgó.
  - Pedreguer y La Romana: sierras e iglesias.
- Los pueblos de costa abren la calle de levante al paseo marítimo, con el mar, barcas y faro.
- Todo lo nuevo queda tras las fachadas o en el horizonte: los recorridos y los refugios de la res no cambian.

## Resultados de la corrida, tres vistas de cámara y finca sin tirones
- Pantalla de resultados nueva al acabar la corrida: cabecera con el logo de la ganadería, cifras de la tarde (prestigio, ingresos, orejas, nota media) y una tarjeta por toro con el resultado, las orejas, la nota en un anillo y el juicio. El toro de la tarde va destacado. Desde ahí: ver otra vez en directo, repetición en dibujo o compartir.
- La repetición en dibujo tiene un aspecto renovado, con el progreso por toros arriba y los mandos agrupados.
- Tres vistas en la corrida en directo (botón «Vista»): realización de TV, desde el tendido y a pie de ruedo. Se recuerda la elegida.
- La cámara encuadra a los banderilleros durante el tercio de banderillas y abre el plano cuando la acción se acerca al tendido.
- Toro: el paso y el galope van sincronizados (sin patinar las patas al cambiar de aire) y levanta polvo con las pezuñas al galopar.
- Finca: en el móvil en vertical la cámara tiene más campo de visión, el texto de arriba ya no se monta y las tareas salen recogidas.
- Finca sin tirones: si un modelo o la vegetación terminan de descargarse con la finca abierta, se rehace tapado por la pantalla de carga (antes se congelaba); la vegetación se descarga antes. La resolución dinámica solo cambia tras varias mediciones seguidas y como mucho cada 8 s (cada cambio rehace el lienzo y daba tirones).
- Quitado el aviso «Texture marked for update but image is undefined».
- Test nuevo: vistas.js.

## Corrida en directo: más lidia, más rápida y salida que funciona
- El botón «Salir» funciona en el móvil: la vista ya no se mete bajo la barra de gestos, hay una «✕ Salir» fija arriba a la derecha (fuera del marco de la corrida) y el botón «atrás» del móvil y la tecla Esc también salen.
- Botones de la barra inferior más grandes (44 px) y más separados del borde.
- Más rápida: velocidades ×1, ×2, ×4 y ×8 (se recuerdan) y botón «⏭ A matar» para ir directamente a la suerte suprema.
- Tercio de banderillas: los peones salen del burladero, citan, se reúnen con el toro y clavan tres pares en el morrillo con los colores de la divisa; las banderillas se quedan puestas y se balancean el resto de la lidia.
- La cuadrilla asoma tras los burladeros con los capotes colgados y sigue al toro con la mirada.
- Rótulos de televisión en cada tercio (capa, banderillas, muleta y suerte suprema, cogida) y comentarista en directo que narra la salida del toro (nombre, número, kilos, pelo y ganadería), las tandas, los olés, los pares, la estocada y el arrastre.

## Bou embolat sin parones en el móvil
- Al encender las bolas aparecía una luz nueva y el móvil recompilaba 18 sombreados de golpe: un parón de segundos justo cuando el toro iba a soltarse, y parecía enganchado al pilón. Ahora el número de luces no cambia (se apaga una farola lejana) y solo se compila el material del fuego.
- Como mucho 4 luces puntuales en el móvil (antes 10), con las farolas más lejanas apagadas; las del toro y la antorcha siempre se quedan.
- Paso fijo en los festejos: con fotogramas lentos la res, la soga y los emboladors avanzan en pasos de 1/30 s como mucho.
- Las piezas pequeñas de la calle no proyectan sombra.
- Tests nuevos: embolat-luces.js y embolat-movil.js (fotogramas irregulares de móvil).

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
