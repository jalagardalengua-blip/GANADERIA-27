/* ===================== FASE 4 · CLIMA DE LA DEHESA POR SEMANAS =====================
   Tiempo visual que cambia cada semana según la estación: sol, nubes, lluvia y niebla de madrugada en invierno.
   Es solo ambiente (la economía sigue con sus propios eventos mensuales). */
const CLIMA_N={sol:'Despejado',nubes:'Nubes y claros',lluvia:'Lluvia',niebla:'Niebla'};
function climaSem(){if(!S)return 'sol';const m=S.month,w=Math.floor(((S.day||1)-1)/7);const r=mulberry(S.year*131+m*17+w*7+3)();
 const p={0:[.3,.35,.2],1:[.32,.33,.15],2:[.3,.3,.08],3:[.25,.3,.03],4:[.2,.15,.0],5:[.1,.05,0],6:[.05,.03,0],7:[.08,.04,0],8:[.2,.12,.02],9:[.3,.28,.1],10:[.35,.3,.18],11:[.3,.35,.22]}[m];
 return r<p[0]?'lluvia':r<p[0]+p[2]?'niebla':r<p[0]+p[2]+p[1]?'nubes':'sol'}

envolver('fincaTick','clima',_fincaTickC=>function(dt){_fincaTickC.apply(this,arguments);if(W3.mode!=='finca'||!W3.scene||!W3.sun)return;const c=W3.clima;
 if(c==='nubes'){W3.sun.intensity*=.55;W3.hemi.intensity*=1.05;W3.scene.background.lerp(W3.cG,.3);W3.scene.fog.color.copy(W3.scene.background)}
 else if(c==='niebla'){const h=((W3.tod||0)%1+1)%1,mañana=h<.45?1:Math.max(0,1-(h-.45)*5);W3.sun.intensity*=.5+.3*(1-mañana);W3.scene.background.lerp(W3.cG,.5*mañana+.2);W3.scene.fog.color.copy(W3.scene.background);W3.scene.fog.near=4+60*(1-mañana);W3.scene.fog.far=38+200*(1-mañana)}
 else if(W3.scene.fog){W3.scene.fog.near=90;W3.scene.fog.far=260}});

envolver('rebuildFinca','clima',_rebuildC=>function(){if(W3.mode==='finca'&&S)W3.clima=climaSem();_rebuildC.apply(this,arguments);if(W3.mode!=='finca'||!S)return;
},{segura:true});
if(typeof hudInfo==='function'){envolver('hudInfo','clima',_hi=>function(){_hi.apply(this,arguments);try{if(W3.mode!=='finca'||!W3.clima)return;const inf=$('#h3info');const ic={sol:'☀',nubes:'⛅',lluvia:'🌧',niebla:'🌫'}[W3.clima];if(inf&&!inf.querySelector('.clmT'))inf.insertAdjacentHTML('beforeend',`<span class="clmT"> · ${ic} ${CLIMA_N[W3.clima]}</span>`)}catch(e){}});}
