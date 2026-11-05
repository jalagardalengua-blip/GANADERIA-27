# Línea base de calidad (AUD-003, AUD-006, AUD-007)

Entorno de medida: Chromium sin cabeza (Playwright) con WebGL por software (SwiftShader), 390×844 móvil y 844×390 apaisado, servidor local. **No es un móvil real**: los FPS no son representativos; la medición en un Android de gama media queda pendiente (necesita el dispositivo del propietario).

## Carga
- DOMContentLoaded 0,9 s · load 1,8 s (local, sin latencia de red).
- Partida tras 3 meses: 96 KB en localStorage.

## Matriz de funcionalidades
Fuente: `tests/e2e/regresion.js` → 87 comprobaciones OK, 0 errores de página.

| Área | Estado | Evidencia |
|---|---|---|
| Portada, menú, continuar, nueva carrera (3 ganaderías), fundar | Funciona | `start *`, `fundar`, `continuar` |
| 7 pestañas de la ganadería principal | Funciona | `tab *` |
| Ficha, vender/tentar lote, obras (231 comprobaciones) | Funciona | `ficha`, `obras all` |
| Simulación de 36 meses | Funciona | `36 meses` (3 M €, 84 toros) |
| Finca 3D: 19 acciones, montar/acoso, camioneta, noche | Funciona | `finca 3D`, `acts` |
| Tienta (machos y hembras, y de corro) | Funciona | `tienta *` |
| Corrida en directo (6 toros) | Funciona | `tests/e2e/corrida.js` (la prueba integrada falla por falta de toros en la partida de prueba, no por el juego) |
| Ganadería de corro: crear, comprar, contratos, inversiones | Funciona | `crear corro` |
| Bous al carrer: embolat, capea, encierro, corda, cerril | Funciona | `calle * done:true` |
| Vaquillas, concurso, bous a la mar | **Parcial** | Llegan al tope de fotogramas sin terminar (R-12) |
| Calendario: semana, día de festejo, simular 4 meses | Funciona | prueba manual automatizada |
| Guardar / cargar | Funciona | `save/load` |
| Game over | Funciona | `gameover` |
| Modo torero | Bloqueado a propósito | menú |
| Offline sin haber cargado antes | **Roto para 3D** | R-01 |

## Ciclo de vida 3D (AUD-005)
Renderer único (`W3.R`) creado en `init3D` y reutilizado. Cada entrada a la finca reconstruye la escena (`rebuildFinca`) sin liberar la anterior → R-02. La plaza (`buildPlaza`) también se reconstruye en cada corrida. El bucle `requestAnimationFrame` corre siempre y solo dibuja con `W3.on`.

## Partida de referencia
`docs/qa/partida-referencia.json` (Miura + corro Germán Vidal, abril 2027). Capturas de las pantallas principales en `docs/qa/capturas/`.

## Flujos que nunca deben romperse
1. Portada → Continuar carrera → partida intacta.
2. Nueva carrera / fundar → guardar → recargar.
3. Avanzar (semana) y cierre de mes: gastos, crecimiento, paridera, ofertas.
4. Aceptar oferta → reseñar toros → día de la corrida → verla o simularla → cobro e historial.
5. Finca 3D: entrar, moverse, hacer una tarea, salir.
6. Corro: aceptar festejo → verlo → cobro.
7. Tienta → decidir vaca/semental.

## Cómo repetir
```
python3 -m http.server 8765        # en la raíz
node tests/e2e/regresion.js         # matriz de funcionalidades
node tests/e2e/corrida.js           # corrida completa
node tests/e2e/auditoria.js         # carga, esquema, memoria 3D, peso de recursos
```
(`THREE_JS=/ruta/three.min.js` si no hay acceso a cdnjs.)
