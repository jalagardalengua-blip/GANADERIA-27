# Plaza Mayor para «Ver tu hierro en directo» (solo ganadería de corro)

Pega este texto en el otro chat junto con el archivo `plazamayor.js`.

---

**Encargo:** en el repositorio del juego de ganadería (Hierro y Divisa), sustituye el escenario 3D que se ve al contratar un festejo en la **ganadería de corro** y pulsar **ver tu hierro en directo** (función `irCalle` → `buildCalle` de `js/calle.js`) por el que viene en el archivo adjunto `plazamayor.js`. No toques nada más: ni la corrida de la ganadería principal, ni la finca, ni la tienta, ni el concurso de recortadores (que usa `buildPlaza`).

**Pasos:**
1. Copia el archivo adjunto a `js/plazamayor.js` tal cual.
2. En `index.html`, añade esta línea **justo después** de `<script src="js/calle3.js"></script>` (tiene que ir antes de `js/texturas.js`):
   ```html
   <script src="js/plazamayor.js"></script>
   ```
3. En `sw.js`, añade `'js/plazamayor.js'` a la lista `ARCHIVOS` (junto a `'js/calle3.js'`) y sube la versión de la caché `V` en uno (por ejemplo, `hierro-divisa-v55` → `hierro-divisa-v56`) para que los móviles descarguen el cambio.
4. No borres ni edites `js/calle.js`: `plazamayor.js` redefine `buildCalle` y añade un envoltorio a `calleTick` para animar al público. Todo lo demás (`CLRECT`, `CLREF`, `CLCIRC`, `envCalle`, cámaras, res, recortadores, `calle2.js`, `calle3.js`) se queda igual.
5. Comprueba: abre un festejo de corro de cada tipo (vaquillas, embolado, capea, encierro, corda, mar y cerril) y que termine sin errores en la consola. Si existe `tests/e2e/regresion.js`, ejecútalo con un servidor local (`python3 -m http.server 8765` y `BASE=http://localhost:8765/ node tests/e2e/regresion.js`); debe dar 0 errores.

**Qué hace el archivo:** plaza con casas de sillería y cal, balcones, galerías, soportales con terraza, tejados de teja árabe, arena con huellas, cadafales de tubo pintado con peñas y toldos, escaleras azules, talanqueras, refugio amarillo con torre y farol, fuente de granito, banderines e iluminación nocturna. El público usa los personajes del juego (`makePerson({gl:1})`, animación `Celebration`) y el público instanciado de siempre. Solo usa funciones que ya existen en el juego: `mulberry`, `geos`, `M`, `mesh`, `R`, `pick`, `makePerson`, `modAnimPerson`, `animPerson`, `crowdPose`, `dustPool`, `locSeed`, `locPal`, `FACOL` y `W3`.

**Alternativa:** el archivo `plaza-corro.patch` contiene los mismos cambios (archivo nuevo + `index.html` + `sw.js`) y se puede aplicar con `git apply plaza-corro.patch` desde la raíz del repositorio. Si da conflicto en `sw.js` porque la versión ya cambió, haz el paso 3 a mano.
