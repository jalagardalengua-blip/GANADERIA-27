# Créditos de los modelos 3D

Con calidad gráfica **Alta** o **Media**, el juego carga los modelos de la carpeta `modelos/`. Con **Baja**, o si un modelo no llega a cargar, se usan las figuras sencillas de siempre.

## Reses (`modelos/res_*.glb`, `modelos/pelo*/`)
- Toro, vaca y becerro hechos a partir del modelo de toro del propio autor del juego: rigging propio y 13 animaciones (paso, galope, embestida, derrote, comer, escarbar...).
- Cada res tiene dos versiones: una normal para la manada de la finca y otra de alta definición (35.000 triángulos, pelo de 2048 px) para la tienta y la plaza.
- Pelos: negro, cárdeno, entrepelado, colorado, castaño, jabonero, salinero y burraco.

## Hechos para el juego
- Cortijo, portería de la ganadería, abrevadero, comedero y pacas de paja (texturas fotográficas CC0 de Poly Haven).
- Placita de tientas y plazas: Las Ventas, la Maestranza, Valencia y Ronda.
  - Ronda se usa en las plazas de segunda y tercera.
  - Las plazas sin modelo propio usan la más parecida: Málaga y Bilbao → Valencia, Pamplona → Las Ventas, Córdoba → la Maestranza.

## Poly Haven — CC0 (dominio público), https://polyhaven.com
Barriles, cántaro, tinaja, maceteros, banco, faroles, cubo, carretilla, sacos, botas, escoba, hacha, hachuela, tocón, neumático, bombona y rocas.

## Sketchfab — CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
- «Petiolate oak tree», de Georgeous — https://sketchfab.com/3d-models/petiolate-oak-tree-748ebed1c5f244bb8f470c4ad5557431 (encinas de la dehesa)
- «Old olive tree», de massive-graphisme — https://sketchfab.com/3d-models/old-olive-tree-6328df8a0f214143a880a72b86db2ab4 (olivos)
- «Toyota Fortuner 2021», de Asadawut.Kaewma — https://sketchfab.com/3d-models/toyota-fortuner-2021-a70b997f11b7482e9affbf318a508f85 (camioneta del mayoral)

Los tres modelos se han reducido de polígonos y de tamaño de textura para el móvil.

## Mixamo (Adobe)
Aficionados de la tienta y visitas del cortijo, con sus animaciones: reposo, andar, correr, quiebro, recorte, saltos. Uso gratuito dentro del juego.

## Librerías
- three.js r128: `GLTFLoader` y `SkeletonUtils` (licencia MIT), en `js/vendor/`.
