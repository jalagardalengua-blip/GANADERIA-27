# ADR 001 · Bus de eventos en lugar de reescribir la arquitectura

**Contexto.** El juego son ~25 scripts clásicos con estado global y ~120 funciones globales envueltas en cadena. La hoja de ruta (cap. 04) pide separar dominio, UI, 3D y persistencia, pero prohíbe rehacer el juego desde cero o perder funciones.

**Decisión.** Mantener los scripts clásicos (sin compilador ni módulos ES) e introducir `Bus.on/emit` (`js/panel.js`) con eventos `SAVE_COMPLETED`, `MONTH_CLOSED`, `EVENT_COMPLETED`. Las funciones nuevas se suscriben al bus en vez de añadir otra envoltura de `render`/`advance`. El guardado queda centralizado en `js/estabilidad.js`.

**Consecuencias.** Sin riesgo para las partidas ni para GitHub Pages. La migración a módulos ES (Vite) queda como posible paso futuro, solo si una prueba demuestra que no rompe Pages, el APK ni el modo sin conexión.
