/* ===================== FASE 5 · GENEALOGÍA, BÚSQUEDA Y COMPARADOR =====================
   - Árbol genealógico navegable de tres generaciones con descendencia en el campo y resultados en plaza.
   - Buscador y orden en la pestaña Ganadería (nombre, número, pelo, encaste; por calidad, peso, edad o nombre).
   - Comparador de hasta 3 animales con sus atributos conocidos. */
const GEN={cmp:[]};
function genNodo(ref,rol){if(!ref)return `<div class="gnN vacio"><small>${rol}</small><b>Desconocido</b></div>`;const a=ref.id!=null?byId(ref.id):null;
 const nombre=a?a.name:ref.name||'—',num=a?a.num:ref.num;const vivo=a&&a.st==='campo';
 return `<button class="gnN ${vivo?'vivo':''}" ${a?`onclick="arbol(${a.id})"`:'disabled'}><small>${rol}</small><b>${esc(nombre||'—')}</b><span>${num!=null?'nº '+num:''}${a?` · ${a.pelo} · ${ageY(a)} años`:' · fuera de la ganadería'}</span>${a&&a.nota!=null?`<i>nota ${a.nota}</i>`:''}</button>`}
function arbol(id){const a=byId(id);if(!a)return;const ma=a.madre&&a.madre.id!=null?byId(a.madre.id):null,pa=a.padre&&a.padre.id!=null?byId(a.padre.id):null;
 const hijosCampo=S.animals.filter(x=>x.st==='campo'&&((x.madre&&x.madre.id===a.id)||(x.padre&&x.padre.id===a.id)));const hp=a.hijos||[];
 const sem=hijosCampo.filter(x=>x.role==='semental').length,vac=hijosCampo.filter(x=>x.role==='vaca').length;
 modal(`Reata de ${a.name} nº ${a.num??'s/n'}`,`<div class="stack gnW">
  <div class="gnG g3">${genNodo(ma&&ma.padre,'Abuelo materno')}${genNodo(ma&&ma.madre,'Abuela materna')}${genNodo(pa&&pa.padre,'Abuelo paterno')}${genNodo(pa&&pa.madre,'Abuela paterna')}</div>
  <div class="gnG g2">${genNodo(a.madre,'Madre')}${genNodo(a.padre,'Padre')}</div>
  <div class="gnG g1"><div class="gnN yo"><small>${a.sex==='H'?'Hembra':'Macho'}${a.role?' · '+a.role:''}</small><b>${esc(a.name)}</b><span>nº ${a.num??'s/n'} · ${a.enc} · ${a.pelo} · ${ageY(a)} años</span>${a.reata?`<i>reata: bravura ${a.reata.bra} · casta ${a.reata.cas}</i>`:''}</div></div>
  <section class="sect"><header><h2>Descendencia</h2></header>
   <div class="kv"><span>En el campo <b>${hijosCampo.length}</b></span><span>Sementales <b>${sem}</b></span><span>Vacas de vientre <b>${vac}</b></span><span>Lidiados <b>${hp.length}</b></span>${hp.length?`<span>Nota media en plaza <b>${Math.round(hp.reduce((s,h)=>s+(h.score||0),0)/hp.length)}</b></span>`:''}</div>
   ${hijosCampo.length?`<div class="gnH">${hijosCampo.slice(0,12).map(h=>`<button class="chip" onclick="arbol(${h.id})">${esc(h.name)} ${h.num??''}</button>`).join('')}</div>`:''}
   ${hp.length?`<div class="list">${hp.slice(-6).reverse().map(h=>`<div class="task"><span class="t"><b>${esc(h.name)}</b> ${h.num??''}<br><small class="muted">${h.y||''} · ${esc(h.res||'')}</small></span><b>${h.score??''}</b></div>`).join('')}</div>`:''}</section>
  <div class="row" style="gap:8px"><button class="btn" onclick="closeModal(true);openFicha(${a.id})">Ver ficha</button><button class="btn" onclick="cmpAdd(${a.id})">${GEN.cmp.includes(a.id)?'En el comparador':'Comparar'}</button></div></div>`)}
/* comparador */
function cmpAdd(id){if(!GEN.cmp.includes(id)){GEN.cmp.push(id);if(GEN.cmp.length>3)GEN.cmp.shift()}GEN.cmp=GEN.cmp.filter(i=>byId(i));if(GEN.cmp.length<2){toast('Añade otro animal para comparar');closeModal(true);return}cmpVer()}
function cmpVer(){const L=GEN.cmp.map(byId).filter(Boolean);const k=a=>a.known||a.tentado;const fila=(n,f)=>`<tr><th>${n}</th>${L.map(a=>`<td>${f(a)}</td>`).join('')}</tr>`;
 modal('Comparador',`<div class="tw"><table class="t cmpT"><tr><th></th>${L.map(a=>`<th>${esc(a.name)}<br><small>${a.num??''}</small></th>`).join('')}</tr>
  ${fila('Edad',a=>ageY(a)+' años')}${fila('Peso',a=>a.peso+' kg')}${fila('Pelo',a=>a.pelo)}${fila('Encaste',a=>a.enc)}${fila('Salud',a=>Math.round(a.salud))}
  ${fila('Calidad',a=>{try{return calidad(a).q}catch(e){return '—'}})}${fila('Nota de tienta',a=>a.nota??'—')}
  ${['bra','nob','fue','cas'].map(g=>fila({bra:'Bravura',nob:'Nobleza',fue:'Fuerza',cas:'Casta'}[g],a=>{const r=a.rev&&a.rev[g];return r!=null?r:'?'})).join('')}
  ${fila('Hijos lidiados',a=>(a.hijos||[]).length)}</table></div><div class="row" style="gap:8px;margin-top:10px"><button class="btn" onclick="GEN.cmp=[];closeModal()">Vaciar comparador</button></div>`)}
/* ficha: botones de reata y comparar */
const _openFichaG=openFicha;
openFicha=function(id){const r=_openFichaG.apply(this,arguments);try{const sh=$('#ov .sheet')||$('#ov');if(sh&&!sh.querySelector('.gnBtns')){const d=document.createElement('div');d.className='gnBtns row';d.innerHTML=`<button class="btn" onclick="arbol(${id})">Árbol genealógico</button><button class="btn" onclick="cmpAdd(${id})">Comparar</button>`;(sh.querySelector('.stack')||sh).appendChild(d)}}catch(e){}return r};
/* ganadería: buscar y ordenar */
UI.q=UI.q||'';UI.ord=UI.ord||'cal';
const _renderCamadaG=renderCamada;
renderCamada=function(el){_renderCamadaG.apply(this,arguments);try{const st=el.querySelector('.stack')||el,lst=el.querySelector('.alist');if(!lst)return;
 const bar=document.createElement('div');bar.className='gnBar';bar.innerHTML=`<input id="gnQ" type="search" placeholder="Buscar nombre, número, pelo o encaste" value="${esc(UI.q)}" aria-label="Buscar en la ganadería"><select id="gnO" aria-label="Ordenar">${[['cal','Calidad'],['peso','Peso'],['edad','Edad'],['nom','Nombre'],['num','Número']].map(([k,n])=>`<option value="${k}" ${UI.ord===k?'selected':''}>${n}</option>`).join('')}</select>`;
 const lg=st.querySelector('.legend');(lg||lst).before(bar);
 const rows=[...lst.children].map(r=>{const m=(r.getAttribute('onclick')||r.innerHTML).match(/openFicha\((\d+)\)/);const a=m&&byId(+m[1]);return {r,a,t:a?`${a.name} ${a.num} ${a.pelo} ${a.enc}`.toLowerCase():r.textContent.toLowerCase()}});
 const apply=()=>{const q=UI.q.trim().toLowerCase();const o=UI.ord;const cmp={peso:(x,y)=>y.a.peso-x.a.peso,edad:(x,y)=>x.a.born-y.a.born,nom:(x,y)=>x.a.name.localeCompare(y.a.name),num:(x,y)=>(x.a.num||0)-(y.a.num||0)}[o];
  const vis=rows.filter(x=>!q||x.t.includes(q));if(cmp)vis.filter(x=>x.a).sort(cmp).forEach(x=>lst.appendChild(x.r));rows.forEach(x=>x.r.style.display=vis.includes(x)?'':'none');
  let e=el.querySelector('.gnNone');if(!vis.length){if(!e){e=document.createElement('div');e.className='card muted gnNone';e.textContent='Ningún animal coincide con la búsqueda.';lst.after(e)}}else if(e)e.remove()};
 bar.querySelector('#gnQ').oninput=e=>{UI.q=e.target.value;apply()};bar.querySelector('#gnO').onchange=e=>{UI.ord=e.target.value;apply()};apply()}catch(e){try{errLog('buscar: '+e.message,'genetica')}catch(e2){}}};
