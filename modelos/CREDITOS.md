# Modelos 3D: créditos y licencias

Todos los modelos son gratuitos, con licencia **CC0 1.0 (dominio público)**: se pueden usar, modificar y redistribuir sin pedir permiso. La atribución no es obligatoria, pero la dejamos por cortesía.

| Archivo | Origen | Autor | Licencia |
|---|---|---|---|
| `toro.glb` (Bull), `vaca.glb` (Cow), `caballo.glb` (Horse) | Ultimate Animated Animals (julio 2021), https://quaternius.com/packs/ultimateanimatedanimals.html | Quaternius | CC0 1.0 |
| `vaquero.glb` (Cowboy_Male) | Ultimate Animated Character Pack (nov. 2019), https://quaternius.com | Quaternius | CC0 1.0 |
| `camioneta.glb` (vehicle-truck-green) y `Textures/colormap.png` | Starter Kit Racing, https://github.com/KenneyNL/Starter-Kit-Racing | Kenney | CC0 1.0 |
| `encina.glb` (tree_oak) | Nature Kit, https://kenney.nl/assets/nature-kit | Kenney | CC0 1.0 |
| `valla.glb` (fence) | Fantasy Town Kit 2.0, https://kenney.nl/assets/fantasy-town-kit | Kenney | CC0 1.0 |

Los modelos de Quaternius se convirtieron de `.gltf` a `.glb` con `tools/gltf-a-glb.js`. Se conservaron solo las animaciones que usa el juego y se redujeron los fotogramas clave para que pesen menos en el móvil.

`js/vendor/three.min.js`, `GLTFLoader.js`, `SkeletonUtils.js` y `Sky.js`: three.js r128, licencia MIT (ver `js/vendor/THREE-LICENSE.txt`).
