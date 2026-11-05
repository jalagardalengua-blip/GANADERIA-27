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

## Fase 1 · Estabilidad y guardado (rama `desarrollo`)
| Tarea | Origen | Estado | Evidencia (`tests/e2e/fase1.js`) |
|---|---|---|---|
| three.js local y en la precaché | R-01 | ✅ | 3D carga con cdnjs bloqueado |
| Liberar geometrías, materiales, texturas, sombras y esqueletos al cambiar de escena | R-02 | ✅ | finca ×10: texturas 48 → 48 (antes 58 → 339) |
| Guardado verificado, copia de seguridad automática, recuperación de partida dañada | R-03 | ✅ | JSON roto → se recupera la copia y se conserva la dañada |
| 3 ranuras manuales, exportar/importar con suma de control y validación | R-03 | ✅ | manipulado o ajeno → rechazado |
| Pausar 3D, música y audio en segundo plano | R-04 | ✅ | `visibilitychange` |
| Registro de errores visible en Ajustes | R-07 | 🟡 | errores no capturados registrados; los `catch` vacíos existentes siguen |
| Precaché sin duplicados (−1,7 MB) | R-06 | ✅ | `sw.js` |
| Prueba de regresión de la corrida arreglada | — | ✅ | `regresion.js`: 0 errores, corrida y juicio OK |

## Fase 2 · Arquitectura y sistema visual
| Tarea | Estado | Evidencia |
|---|---|---|
| Bus de eventos (`SAVE_COMPLETED`, `MONTH_CLOSED`, `EVENT_COMPLETED`) | ✅ | `tests/e2e/fase2.js`, ADR 001 |
| Inicio: centro de avisos con acceso directo | ✅ | 10 tipos de aviso (corridas por ver, ofertas que caducan, reseñas incompletas, lesionados, capacidad, liquidez, semental, herradero, confianza, corro) |
| Inicio: agenda de próximos festejos | ✅ | enlazada con el calendario |
| Inicio: resumen económico de los últimos meses | ✅ | gráfico ingresos/gastos y saldo neto |
| Accesibilidad: tamaño de texto y reducir movimiento | ✅ | Ajustes → Accesibilidad |
| Tema visual de gala unificado | ✅ | hecho antes de la hoja de ruta |
| Módulos ES / separación completa de capas | ⏳ | aplazado (ADR 001) |

Fases 3–12: ⏳ (ver PDF).

## Peticiones del propietario en cola
- Toro de Tripo3D (enlace del 5 nov): pendiente de que el propietario exporte el GLB y confirme la licencia de su plan.
- Finca con recintos de ganadería real y texturas realistas gratuitas: fase 4.
