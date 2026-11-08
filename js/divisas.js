/* ===================== DIVISAS REALES DE LAS GANADERÍAS =====================
   Colores de la divisa (las cintas que lleva el toro en el morrillo al salir al ruedo) y finca de cada
   ganadería histórica del juego, según las fichas de ganaderías de Servitoro (consultadas en noviembre de 2026).
   Se aplican a la lista de ganaderías, a los rivales del escalafón ya guardados y a la propia ganadería
   si el jugador lleva una real. Para Conde de la Corte no se encontró la divisa y se mantiene la del juego. */
const DCOL={verde:'#1d6b3a',negro:'#141414',granate:'#6b1d2b',azul:'#1f3f8a',celeste:'#79b6e0',encarnado:'#c0242f',
 blanco:'#f3efe4',amarillo:'#ecc531',oro:'#c9a033',rosa:'#e892b4',morado:'#5d2a74',paja:'#e9d898'};
const DIVISAS={
 'Miura':{c:['verde','negro'],t:'verde y negra en Madrid; verde y grana en provincias',loc:'Lora del Río, Sevilla'},
 'Victorino Martín':{c:['azul','encarnado'],t:'azul y encarnada'},
 'Juan Pedro Domecq':{c:['encarnado','blanco'],t:'encarnada y blanca',loc:'El Castillo de las Guardas, Sevilla'},
 'Garcigrande':{c:['blanco','encarnado'],t:'blanca y encarnada'},
 'Victoriano del Río':{c:['negro','amarillo'],t:'negra y amarilla'},
 'Fuente Ymbro':{c:['verde'],t:'verde'},
 'Adolfo Martín':{c:['verde','encarnado'],t:'verde y encarnada'},
 'La Quinta':{c:['encarnado','amarillo'],t:'encarnada y amarilla',loc:'Hornachuelos, Córdoba'},
 'Cuadri':{c:['morado','amarillo','blanco'],t:'morada, amarilla y blanca'},
 'Dolores Aguirre':{c:['amarillo','azul'],t:'amarilla y azul',loc:'Constantina, Sevilla'},
 'Jandilla':{c:['azul'],t:'azul'},
 'Núñez del Cuvillo':{c:['blanco','verde','encarnado'],t:'blanca, verde y encarnada'},
 'Alcurrucén':{c:['celeste','negro'],t:'celeste y negra'},
 'Torrestrella':{c:['azul','oro'],t:'azul y oro'},
 'Partido de Resina':{c:['celeste','blanco'],t:'azul celeste y blanca'},
 'Santiago Domecq':{c:['azul','blanco'],t:'azul y blanca'},
 'El Pilar':{c:['verde','blanco'],t:'verde y blanca'},
 'Zalduendo':{c:['encarnado','azul'],t:'encarnada y azul',loc:'Moheda de Zalduendo, Cáceres'},
 'Daniel Ruiz':{c:['amarillo','verde'],t:'amarilla y verde',loc:'Alcaraz, Albacete'},
 'Domingo Hernández':{c:['azul','encarnado','verde'],t:'azul, encarnada y verde',loc:'Pozos de Hinojo, Salamanca'},
 'El Torero':{c:['azul','encarnado'],t:'azul y encarnada',loc:'El Bosque, Cádiz'},
 'Salvador Domecq':{c:['negro','verde','blanco'],t:'negra, verde y blanca',loc:'Arcos de la Frontera, Cádiz'},
 'Pedraza de Yeltes':{c:['blanco','verde'],t:'blanca y verde',loc:'Castraz de Yeltes, Salamanca'},
 'Hermanos García Jiménez':{c:['rosa','azul'],t:'rosa y azul',loc:'El Cabaco, Salamanca'},
 'Montalvo':{c:['azul','amarillo'],t:'azul y amarilla',loc:'Matilla de los Caños, Salamanca'},
 'Puerto de San Lorenzo':{c:['encarnado','amarillo'],t:'encarnada y amarilla',loc:'Tamames, Salamanca'},
 'Valdefresno':{c:['encarnado','amarillo'],t:'encarnada y amarilla',loc:'Tabera de Abajo, Salamanca'},
 'José Escolar':{c:['blanco','encarnado'],t:'blanca y encarnada',loc:'Lanzahíta, Ávila'},
 'Baltasar Ibán':{c:['rosa','verde'],t:'rosa y verde',loc:'El Escorial, Madrid'},
 'Prieto de la Cal':{c:['encarnado','oro'],t:'grana y oro',loc:'San Juan del Puerto, Huelva'},
 'Murube':{c:['granate','negro'],t:'granate y negra',loc:'Utrera, Sevilla'},
 'Fermín Bohórquez':{c:['verde','encarnado'],t:'verde y encarnada'},
 'Ana Romero':{c:['paja','celeste'],t:'paja y celeste',loc:'Alcalá de los Gazules, Cádiz'}};
function divReal(n){const d=DIVISAS[n];return d?d.c.map(k=>DCOL[k]):null}
for(const g of GANADERIAS){const d=DIVISAS[g.name];if(!d)continue;g.div=divReal(g.name);g.divT=d.t;if(d.loc)g.loc=d.loc}
/* partidas ya empezadas: rivales y ganadería propia real con la divisa correcta */
function divFix(s){if(!s)return;try{for(const r of s.rivals||[]){const d=divReal(r.name);if(d)r.div=d}if(s.g&&s.g.real){const d=divReal(s.g.name);if(d)s.g.div=d}}catch(e){}}
{envolver('load','divisas',_load=>function(){const s=_load.apply(this,arguments);divFix(s);return s},{segura:true});}
/* el nombre de los colores, visible al elegir ganadería y en el perfil */

envolver('startScreen','divisas',_startScreenDv=>function(){let h=_startScreenDv.apply(this,arguments);try{for(const g of GANADERIAS){if(!g.divT)continue;const k=`<b>${esc(g.name)}</b><br><small class="muted">Encaste ${g.enc}`;if(h.includes(k))h=h.replace(k,`${k} · divisa ${g.divT}`)}}catch(e){}return h},{segura:true});
