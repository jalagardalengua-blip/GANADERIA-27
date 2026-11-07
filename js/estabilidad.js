/* ===================== FASE 1 · ESTABILIDAD Y GUARDADO =====================
   1. Memoria 3D: al cambiar de escena se liberan geometrías, materiales y texturas propias de la escena anterior.
   2. Guardado: escritura verificada, copia de seguridad automática, recuperación si la partida está dañada,
      tres ranuras manuales, exportar e importar la partida (JSON con suma de control).
   3. Segundo plano: el 3D, la música y el sonido se pausan al bloquear el móvil o cambiar de app.
   4. Registro de errores: los fallos se guardan para poder verlos y corregirlos, en vez de perderse. */
const SAVE_APP='hierro-y-divisa',BAK=KEY+'-bak',SLOT=n=>KEY+'-slot'+n,ERRK='hd-errores';
/* ---------- registro de errores ---------- */
function errLog(msg,src){try{const L=JSON.parse(localStorage.getItem(ERRK)||'[]');L.unshift({t:new Date().toISOString(),m:String(msg).slice(0,240),s:String(src||'').slice(0,120)});localStorage.setItem(ERRK,JSON.stringify(L.slice(0,30)))}catch(e){}}
window.addEventListener('error',e=>errLog(e.message,(e.filename||'').split('/').pop()+':'+e.lineno));
window.addEventListener('unhandledrejection',e=>errLog('Promesa: '+(e.reason&&e.reason.message||e.reason),''));
/* ---------- suma de control sencilla (FNV-1a) ---------- */
function hashStr(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16)}
function partidaValida(o){return !!(o&&typeof o==='object'&&o.g&&typeof o.g.name==='string'&&Array.isArray(o.animals)&&Number.isFinite(o.year)&&Number.isFinite(o.month)&&Number.isFinite(o.money)&&Array.isArray(o.offers))}
/* ---------- guardado verificado + copia de seguridad ---------- */
const SV={lastBak:0,lastKey:'',fail:false};
save=function(){if(!S)return false;let txt;try{txt=JSON.stringify(S)}catch(e){errLog('No se pudo serializar la partida: '+e.message,'save');return false}
 try{const prev=localStorage.getItem(KEY);const mk=S.year*12+S.month;
  // copia de seguridad: al cambiar de mes o cada 5 minutos, de la última partida buena
  if(prev&&(mk!==SV.lastKey||Date.now()-SV.lastBak>300000)){try{if(partidaValida(JSON.parse(prev))){localStorage.setItem(BAK,prev);SV.lastBak=Date.now();SV.lastKey=mk}}catch(e){}}
  localStorage.setItem(KEY,txt);
  if(localStorage.getItem(KEY).length!==txt.length)throw new Error('escritura incompleta');
  if(SV.fail){SV.fail=false;try{toast('Partida guardada de nuevo')}catch(e){}}return true}
 catch(e){errLog('Fallo al guardar: '+e.message,'save');if(!SV.fail){SV.fail=true;try{toast('¡No se pudo guardar! Libera espacio o exporta la partida en Ajustes.')}catch(e2){}}return false}};
load=function(){let o=null;try{const s=localStorage.getItem(KEY);if(s)o=JSON.parse(s)}catch(e){errLog('Partida principal dañada: '+e.message,'load')}
 if(o&&partidaValida(o))return o;
 // recuperar de la copia de seguridad sin borrar la dañada
 try{const b=localStorage.getItem(BAK);if(b){const ob=JSON.parse(b);if(partidaValida(ob)){if(o||localStorage.getItem(KEY))try{localStorage.setItem(KEY+'-danada',localStorage.getItem(KEY))}catch(e){}
  setTimeout(()=>{try{toast('Tu partida estaba dañada: se ha recuperado la copia de seguridad')}catch(e){}},600);return ob}}}catch(e){errLog('Copia de seguridad dañada: '+e.message,'load')}
 return o};
/* ---------- ranuras, exportar, importar ---------- */
function paquete(o){const data=JSON.stringify(o);return {app:SAVE_APP,schema:o.v||1,fecha:new Date().toISOString(),ganaderia:o.g.name,juego:`${MESES[o.month]} ${o.year}`,hash:hashStr(data),data}}
function desempaquetar(txt){let p;try{p=JSON.parse(txt)}catch(e){throw new Error('El archivo no es JSON válido')}
 if(p&&p.app===SAVE_APP&&typeof p.data==='string'){if(hashStr(p.data)!==p.hash)throw new Error('El archivo está modificado o incompleto (la suma de control no coincide)');p=JSON.parse(p.data)}
 if(!partidaValida(p))throw new Error('El archivo no contiene una partida de Hierro y Divisa');
 if(p.animals.length>5000)throw new Error('Partida demasiado grande');return p}
function slotInfo(n){try{const s=localStorage.getItem(SLOT(n));if(!s)return null;const p=JSON.parse(s);return {ganaderia:p.ganaderia,juego:p.juego,fecha:p.fecha}}catch(e){return {err:1}}}
function slotGuardar(n){const cur=S||load();if(!cur){toast('No hay partida que guardar');return}try{localStorage.setItem(SLOT(n),JSON.stringify(paquete(cur)));toast(`Guardado en la ranura ${n}`)}catch(e){errLog(e.message,'slot');toast('No hay espacio para otra ranura')}render()}
function slotCargar(n){try{const p=desempaquetar(localStorage.getItem(SLOT(n))||'');partidaReemplazar(p,`la ranura ${n}`)}catch(e){toast(e.message)}}
function slotBorrar(n){if(!(window.__noConfirm||confirm(`¿Borrar la ranura ${n}?`)))return;localStorage.removeItem(SLOT(n));render()}
function partidaReemplazar(p,desde){const cur=localStorage.getItem(KEY);
 if(cur&&!(window.__noConfirm||confirm(`Vas a cargar «${p.g.name}» (${MESES[p.month]} ${p.year}) desde ${desde}.\nTu partida actual se guarda como copia de seguridad. ¿Continuar?`)))return;
 try{if(cur)localStorage.setItem(BAK,cur);localStorage.setItem(KEY,JSON.stringify(p))}catch(e){toast('No se pudo cargar: falta espacio');return}
 S=null;if(typeof menuContinuar==='function'&&MENU){MENU.v='main';render();menuContinuar()}else{continuar()}}
function partidaExportar(){const cur=S||load();if(!cur){toast('No hay partida que exportar');return}
 const blob=new Blob([JSON.stringify(paquete(cur))],{type:'application/json'});const a=document.createElement('a');const d=new Date();
 a.href=URL.createObjectURL(blob);a.download=`hierro-y-divisa-${cur.g.name.toLowerCase().replace(/[^a-z0-9ñáéíóú]+/gi,'-')}-${d.toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);toast('Partida exportada')}
function partidaImportar(){const i=document.createElement('input');i.type='file';i.accept='.json,application/json';
 i.onchange=()=>{const f=i.files&&i.files[0];if(!f)return;if(f.size>8e6){toast('Archivo demasiado grande');return}const r=new FileReader();r.onload=()=>{try{const p=desempaquetar(String(r.result));partidaReemplazar(p,'el archivo')}catch(e){toast(e.message)}};r.readAsText(f)};i.click()}
function borrarTodo(){if(!(window.__noConfirm||confirm('Se borrarán la partida, las ranuras, la copia de seguridad y los ajustes de este dispositivo. Exporta antes si quieres conservarla. ¿Borrar todo?')))return;
 try{Object.keys(localStorage).filter(k=>/^hierro-divisa|^hd-/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}S=null;MENU.v='press';render();toast('Datos borrados')}
/* sección en Ajustes */
function partidasHTML(){const sv=load();const fecha=s=>{try{return new Date(s).toLocaleString('es-ES',{dateStyle:'short',timeStyle:'short'})}catch(e){return ''}};
 let errs=[];try{errs=JSON.parse(localStorage.getItem(ERRK)||'[]')}catch(e){}
 return `<section class="sect card goldline svSect"><header><h2>Partidas</h2></header>
  ${sv?`<small class="muted">En curso: <b>${esc(sv.g.name)}</b> · ${MESES[sv.month]} ${sv.year}</small>`:'<small class="muted">No hay partida en curso.</small>'}
  <div class="svSlots">${[1,2,3].map(n=>{const s=slotInfo(n);return `<div class="svSlot"><b>Ranura ${n}</b>${s&&!s.err?`<small>${esc(s.ganaderia)} · ${esc(s.juego)}<br>${fecha(s.fecha)}</small>`:`<small class="muted">${s&&s.err?'dañada':'vacía'}</small>`}
   <div class="svB"><button class="btn sm" ${sv?'':'disabled'} onclick="slotGuardar(${n})">Guardar</button>${s&&!s.err?`<button class="btn sm oro" onclick="slotCargar(${n})">Cargar</button><button class="btn sm" onclick="slotBorrar(${n})">✕</button>`:''}</div></div>`}).join('')}</div>
  <div class="svB"><button class="btn" ${sv?'':'disabled'} onclick="partidaExportar()">Exportar partida</button><button class="btn" onclick="partidaImportar()">Importar partida</button></div>
  <small class="muted">Copia de seguridad automática: ${localStorage.getItem(BAK)?'sí':'aún no'}. Exportar guarda un archivo con suma de control que puedes importar en otro dispositivo.</small>
  ${errs.length?`<details class="svErr"><summary>Registro de errores (${errs.length})</summary>${errs.slice(0,10).map(e=>`<small>${fecha(e.t)} · ${esc(e.m)} ${esc(e.s)}</small>`).join('')}<button class="btn sm" onclick="localStorage.removeItem('${ERRK}');render()">Vaciar</button></details>`:''}
  <button class="btn" onclick="borrarTodo()">Borrar todos los datos</button></section>`}
const _startScreenSv=startScreen;
startScreen=function(){let h=_startScreenSv.apply(this,arguments);if(MENU.v==='ajustes'){const i=h.indexOf('<section class="sect card"><header><h2>Créditos');if(i>0)h=h.slice(0,i)+partidasHTML()+h.slice(i);else h=h.replace(/<\/div><\/div>$/,partidasHTML()+'</div></div>')}return h};
/* ---------- memoria 3D: liberar la escena anterior ---------- */
function protegidos(){const P=new Set();try{for(const k in MC)P.add(MC[k])}catch(e){}try{const g=geos();for(const k in g)P.add(g[k])}catch(e){}try{if(typeof GX!=='undefined'&&GX.g)for(const k in GX.g)P.add(GX.g[k])}catch(e){}
 try{if(typeof TXR!=='undefined')for(const k in TXR.c)P.add(TXR.c[k])}catch(e){}return P}
function liberarEscena(sc){if(!sc||!sc.traverse)return 0;const P=protegidos(),done=new Set();let n=0;
 const dt=t=>{if(t&&t.isTexture&&!P.has(t)&&!done.has(t)){done.add(t);t.dispose();n++}};
 sc.traverse(o=>{if(o.geometry&&!P.has(o.geometry)&&!done.has(o.geometry)){done.add(o.geometry);o.geometry.dispose();n++}
  const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms){if(!m||P.has(m)||done.has(m))continue;done.add(m);for(const k in m){const v=m[k];if(v&&v.isTexture)dt(v)}if(m.uniforms)for(const k in m.uniforms){const v=m.uniforms[k]&&m.uniforms[k].value;if(v&&v.isTexture)dt(v)}m.dispose();n++}
  if(o.isSkinnedMesh&&o.skeleton&&o.skeleton.boneTexture){o.skeleton.dispose();n++}
  if(o.isLight&&o.shadow&&o.shadow.map){o.shadow.map.dispose();o.shadow.map=null;n++}
  if(o.isInstancedMesh&&o.dispose)try{o.dispose()}catch(e){}});
 if(sc.background&&sc.background.isTexture)dt(sc.background);return n}
(function(){let cur=W3.scene;Object.defineProperty(W3,'scene',{configurable:true,enumerable:true,get(){return cur},set(v){const old=cur;cur=v;if(old&&old!==v){setTimeout(()=>{if(cur!==old){try{liberarEscena(old);if(W3.R&&W3.R.renderLists)W3.R.renderLists.dispose()}catch(e){errLog('liberar escena: '+e.message,'3d')}}},0)}}})})();
/* ---------- segundo plano: pausar 3D y sonido ---------- */
const BG={w3:false,music:null};
document.addEventListener('visibilitychange',()=>{try{if(document.hidden){BG.w3=W3.on;W3.on=false;BG.music=AU.music&&typeof MZ!=='undefined'&&MZ?MZ.key:null;if(AU.music)musicStop();if(AU.ctx&&AU.ctx.state==='running')AU.ctx.suspend()}
 else{if(AU.ctx&&AU.ctx.state==='suspended'&&AU.on)AU.ctx.resume();if(BG.w3&&W3.root&&!W3.root.hidden)W3.on=true;BG.w3=false;if(BG.music&&AU.on){const k=BG.music;BG.music=null;setTimeout(()=>{try{musicStart(k)}catch(e){}},300)}}}catch(e){errLog(e.message,'visibilidad')}});
