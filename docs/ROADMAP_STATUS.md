# Estado de la hoja de ruta

Leyenda: ✅ hecho y verificado · 🟡 parcial · ⏳ pendiente · ⛔ bloqueado

## Fase 0 · Auditoría (rama `fase-0-auditoria`, sin cambios de producto)
| ID | Tarea | Estado | Evidencia |
|---|---|---|---|
| AUD-001 | Copia y rama de trabajo | ✅ | rama `fase-0-auditoria` desde `main@46550cb`; producción intacta |
| AUD-002 | Inventario | ✅ | `docs/PROJECT_INVENTORY.md` |
| AUD-003 | Mapa de funcionalidades | ✅ | `docs/QA_BASELINE.md` |
| AUD-004 | Estado y persistencia | ✅ | `docs/SAVE_SCHEMA.md` |
| AUD-005 | Renderizado 3D | ✅ | `QA_BASELINE.md` § ciclo de vida, R-02 |
| AUD-006 | Rendimiento base | 🟡 | medido en navegador sin cabeza; **falta móvil Android real** |
| AUD-007 | Regresión inicial | ✅ | `tests/e2e/*.js`, `docs/qa/partida-referencia.json`, `docs/qa/capturas/` |
| AUD-008 | Riesgos | ✅ | `docs/RISKS.md` |

## Fase 1 · Estabilidad y guardado (siguiente, pendiente de aprobación)
| Tarea | Origen | Estado |
|---|---|---|
| three.js local y en la precaché | R-01 | ⏳ |
| Liberar geometrías/texturas al salir de escenas | R-02 | ⏳ |
| Copia de seguridad, 3 ranuras + autoguardado, exportar/importar JSON, validación | R-03 | ⏳ |
| Pausar 3D y audio en segundo plano | R-04 | ⏳ |
| Registrar errores en lugar de silenciarlos | R-07 | ⏳ |

Fases 2–12: ⏳ (ver PDF).

## Peticiones del propietario en cola
- Toro de Tripo3D (enlace del 5 nov): pendiente de que el propietario exporte el GLB y confirme la licencia de su plan.
- Finca con recintos de ganadería real y texturas realistas gratuitas: fase 4.
