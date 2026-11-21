# Esquema de partida (AUD-004)

Una sola ranura: `localStorage['hierro-divisa-v1']`, JSON del objeto global `S`. `save()` escribe en cada acción relevante; `load()` + `migrate(S)` al continuar. No hay copia de seguridad, exportación, suma de control ni ranuras múltiples.

## Campos de primer nivel
| Campo | Tipo | Notas |
|---|---|---|
| `v` | número | Versión de esquema (la usa `migrate`). |
| `g` | `{real,name,enc,pres,div,hierro,prov}` | Identidad de la ganadería. |
| `year`, `month` | número | Fecha de juego; `absNow()=year*12+month`. |
| `day` | número | Día del mes (añadido por `calendario.js`; si falta vale 1). |
| `money`, `pres`, `conf`, `xp` | número | Saldo, prestigio, confianza de la propiedad, experiencia. |
| `feed` | texto | Tipo de pienso. |
| `animals` | array | Ver abajo. `nid` = siguiente id. |
| `nums` | `{año: contador}` | Numeración de crotales por año. |
| `offers` | array `{id,fid,plaza,feria,cat,tipo,abs,n,precio,st,toros,nuevo,dia?}` | `st`: nueva/aceptada/lidiada/rechazada/caducada. `oid` = siguiente id. |
| `hist`, `porVer` | array | Corridas celebradas y pendientes de ver. |
| `mej` | `{clave: nivel}` | Obras de la finca. |
| `staff` | `{clave: n}` | Personal contratado (si existe). |
| `season`, `objs`, `presHist`, `stats`, `trofeos` | | Temporada, objetivos, histórico, palmarés. |
| `mkt` | `{sem,lotes}` | Mercado del mes. |
| `rivals`, `retos`, `retosM`, `news`, `log`, `mes` | | Carrera y noticias. |
| `fedM`, `feedSpots`, `roto`, `escapado`, `vela`, `doma`, `festival`, `pesado`, `tor` | | Estado de tareas y obras. |
| `corro` | objeto o `null` | Ganadería de corro: `{name,l,div,pueblo,real,pres,an,nid,inv,of,hist,st,oid,mkt,fund}`. |

## Animal (bravo)
`{id,sex,born,enc,g{bra,nob,fue,cas,…},salud,pelo,name,num,herrado,role,tentado,known,rev,nota,ind,res,madre{id,name,num},padre{id,name,num},reata,hijos,peso,st,dec,lesion}` — `st`: campo/vendido/lidiado; `role`: vaca/semental/null.

## Res de corro
`{id,name,num,sex,tipo,born,pelo,g,fama,sal,salMes,salud,lesion,peso,nota,tentado,cerril,anillas,orig}`.

## Referencia
`docs/qa/partida-referencia.json`: partida Miura + corro (Germán Vidal) tras 3 meses, para pruebas de regresión y migración.

## Campos sensibles a pérdida
`animals` (genealogía por `id`), `offers.toros` (referencias a ids), `corro.an`, `hist`. Un JSON truncado hoy hace que `load()` devuelva `null` y el jugador vea la partida como perdida.
