# EliteManager

Juego de entrenador de fútbol con modo carrera y partidos en 3D. Funciona en el navegador, sin instalación.

## Cómo jugar

Abre `index.html` con un servidor web local (los navegadores bloquean algunos archivos si se abre con doble clic):

```bash
cd entrenador-pro
python3 -m http.server 8000
# y abre http://localhost:8000
```

También se puede publicar tal cual en GitHub Pages.

## Qué incluye

- **Mundo ficticio:** 10 ligas (España, Inglaterra, Italia, Alemania, Francia, Portugal, Países Bajos, Brasil, Argentina y México), 186 clubes y unos 4.700 jugadores. Cada jugador tiene nombre, nacionalidad, edad, posición, siete atributos (ritmo, tiro, pase, regate, defensa, físico y portería), media, potencial, rasgos, valor, sueldo y contrato.
- **Modo carrera:** calendario de liga a doble vuelta, Copa Continental y Copa Libertad, clasificaciones, estadísticas, objetivos de la directiva, despidos y ofertas de otros clubes.
- **Partidos en 3D:** estadio con gradas, focos, vallas y banquillos; jugadores animados; repeticiones de los goles. Hay cinco cámaras: Banquillo (vista del entrenador desde el área técnica), TV, Aérea, Detrás y Jugador.
- **Dirección desde la banda:** órdenes a gritos que cambian el juego al momento, tablet con tácticas, cambios, estadísticas y notas, y charla en el descanso.
- **Entrenamiento:** enfoque semanal, intensidad (con riesgo de lesión) y trabajo específico por jugador. Los jóvenes con potencial mejoran más.
- **Decisiones:** ruedas de prensa, jugadores que piden minutos, conflictos en el vestuario, giras de patrocinio, elección de capitán, joyas de la cantera, reuniones con la directiva y protestas de la afición.
- **Mercado:** búsqueda con filtros, negociación con el club y después con el jugador, ofertas por tus jugadores, agentes libres, lista de seguimiento, renovaciones y rescisiones.
- **Ojeo y cantera:** ojeadores por regiones y nuevos juveniles cada verano.
- **Premios:** Balón Dorado, Bota Dorada, Guante Dorado, Premio Promesa, Entrenador del Año y once ideal.
- **Base de datos y editor:** ranking de jugadores y clubes, edición de cualquier jugador o club e importación desde CSV.

## Importar jugadores (CSV)

Una línea por jugador, separada por punto y coma:

```
club;nombre;apellido;nacionalidad;posicion;edad;RIT;TIR;PAS;REG;DEF;FIS;POR
```

El club debe existir en el juego. Si quieres usar otro nombre, renombra antes el club con "Editar club".

## Estructura

| Archivo | Contenido |
| --- | --- |
| `js/data.js` | Nacionalidades, nombres, ligas, posiciones, formaciones y planes de entrenamiento |
| `js/world.js` | Generación de jugadores y clubes, medias y valores |
| `js/engine.js` | Motor del partido: simulación física de 22 jugadores con IA (el mismo motor sirve para ver el partido o simularlo) |
| `js/career.js` | Modo carrera: jornadas, copas, entrenamiento, mercado, decisiones, finanzas, premios y guardado |
| `js/match3d.js` | Render 3D del estadio y del partido (Three.js r128) |
| `js/matchday.js` | Pantalla del partido: marcador, cámaras, órdenes, tablet y descanso |
| `js/art.js` | Escudos, caras de jugadores e iconos generados |
| `js/ui.js` | Menús del modo carrera |

Todos los nombres de clubes, jugadores y premios son ficticios.
