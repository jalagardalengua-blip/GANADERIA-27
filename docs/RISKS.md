# Riesgos y deuda técnica (AUD-008)

Prioridad = impacto × probabilidad / coste. Evidencia: `tests/e2e/auditoria.js` (5 nov 2026).

| ID | Riesgo | Evidencia | Impacto | Prob. | Coste | Prioridad | Fase |
|---|---|---|---|---|---|---|---|
| R-01 | three.js se carga desde cdnjs; sin red y sin caché previa no hay 3D. | `index.html` | Alto | Media | Bajo | **P1** | 1 |
| R-02 | Fuga de memoria 3D: no se libera nada al salir de escenas (0 llamadas a `dispose`). Entrar y salir de la finca 10 veces: texturas 58 → 339, geometrías 90 → 224. | auditoría `mem` | Alto (cierres en móvil) | Alta | Medio | **P1** | 1 |
| R-03 | Una sola ranura de guardado, sin copia de seguridad ni exportación; un JSON dañado deja la partida inaccesible. | `save/load` en `juego.js` | Muy alto | Baja | Bajo | **P1** | 1 |
| R-04 | El 3D y el audio siguen al cambiar de pestaña o bloquear el móvil (no hay `visibilitychange`). | auditoría `hidden` | Medio (batería) | Alta | Bajo | **P1** | 1 |
| R-05 | ~120 reasignaciones de funciones globales en cadena (`render` ×7). Orden de scripts frágil. | grep | Medio | Media | Alto | P2 | 2 |
| R-06 | 26 % del peso inicial son modelos (persona 0,9 MB, vegetación 0,9 MB, caballo 0,45 MB) y además existen copias `.gltf.json` duplicadas en el repo. | auditoría `reqs` | Medio | Alta | Bajo | P2 | 10 |
| R-07 | ~60 `catch(e){}` vacíos: errores silenciosos. | grep | Medio | Media | Medio | P2 | 1 |
| R-08 | Aviso «Texture marked for update but image is undefined» al entrar en 3D. | consola | Bajo | Alta | Bajo | P3 | 3 |
| R-09 | Las fotografías de `img/` no tienen origen ni licencia documentados. | historial git | Medio (legal) | — | Bajo | P2 | 11 |
| R-10 | Los iconos de `img/nav/` salen de las imágenes de referencia del propietario: confirmar que tiene derechos sobre ellas. | — | Medio | — | Bajo | P2 | 11 |
| R-11 | Modo torero completo pero bloqueado en el menú. | `torero.js` `TR_LOCK` | Bajo | — | — | P3 | — |
| R-12 | Vaquillas, concurso y bous a la mar no terminan solos en la prueba automática (llegan al tope de 20 000 fotogramas); hay que comprobar si la tarde termina en partidas reales. | `regresion.js` | Medio | Media | Bajo | P2 | 7 |
| R-13 | Workflow `blank.yml` de plantilla sin utilidad. | `.github/workflows` | Bajo | — | Bajo | P3 | 11 |
| R-14 | `main` se publica sola en Pages y genera APK en cada push: cualquier unión es producción inmediata. | `pages.yml`, `android.yml` | Alto | — | — | Proceso: trabajar en ramas y unir solo con aprobación. | — |
