// Pantallas de carga a pantalla completa (retrato + consejo + barra de neón).
// Se muestra al abrir el juego y al entrar en la finca 3D mientras cargan los modelos.
// Va al principio de <body> para pintarse antes de que se descarguen los scripts pesados.
(function(){
  const IMGS=['img/carga-1.jpg','img/carga-2.jpg'];
  const TIPS=[
    'Tienta a las becerras a partir de los dos años: las de nota alta serán las mejores madres de tu camada.',
    'Un toro no se vende solo por su peso: la plaza de primera exige trapío y casta.',
    'Echar el pienso a mano en los comederos ahorra un 10 % del gasto del mes.',
    'Si la finca se queda pequeña, el gasto por cabeza se dispara. Amplía cercas o vende reses.',
    'La confianza de la propiedad se decide en diciembre: cumple los objetivos de la temporada.',
    'Un indulto en una plaza de primera vale más que una temporada entera de ovaciones.',
    'Los erales se acosan y derriban a caballo: así descubres su bravura antes de la tienta.',
    'Antes de la quiebra, el banco ofrece un préstamo. Úsalo solo si tienes un plan para devolverlo.',
    'Revisa la ficha de cada toro: la reata de la madre dice mucho de lo que dará en la plaza.'
  ];
  let idx=0;try{idx=(+localStorage.getItem('hd-carga')||0)}catch(e){}
  let el=null,t0=0,timer=null;
  function crear(){
    el=document.createElement('div');el.id='carga';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.innerHTML='<div class="cg-img"></div><div class="cg-vel"></div>'+
      '<div class="cg-txt"><div class="cg-k">Modo carrera · Ganadero de bravo</div><div class="cg-t">Hierro<br>y divisa</div>'+
      '<div class="cg-tip"><b>Consejo</b><span></span></div></div>'+
      '<div class="cg-bar"><i></i></div><div class="cg-skip">Toca para continuar</div>';
    el.addEventListener('click',()=>{if(performance.now()-t0>600)ocultar(true)});
    document.body.appendChild(el);
  }
  function mostrar(){
    if(!el)crear();clearTimeout(timer);
    const img=IMGS[idx%IMGS.length];idx++;try{localStorage.setItem('hd-carga',idx)}catch(e){}
    el.querySelector('.cg-img').style.backgroundImage=`url(${img})`;
    el.querySelector('.cg-tip span').textContent=TIPS[Math.floor(Math.random()*TIPS.length)];
    el.classList.remove('fuera');el.hidden=false;void el.offsetWidth;el.classList.add('on');t0=performance.now();
  }
  function ocultar(ya){
    if(!el||el.hidden)return;const min=ya?0:1700,rest=Math.max(0,min-(performance.now()-t0));
    clearTimeout(timer);timer=setTimeout(()=>{el.classList.add('fuera');setTimeout(()=>{el.hidden=true;el.classList.remove('on','fuera')},450)},rest);
  }
  window.Carga={mostrar,ocultar};
  // Arranque del juego
  mostrar();
  window.addEventListener('load',()=>{const f=document.fonts&&document.fonts.ready;(f||Promise.resolve()).then(()=>ocultar())});
  // Entrada al 3D: se mantiene hasta que los modelos estén listos (máx. 6 s)
  document.addEventListener('DOMContentLoaded',()=>{
    if(typeof window.enter3D!=='function')return;const orig=window.enter3D;
    window.enter3D=function(){mostrar();const r=orig.apply(this,arguments);const t=performance.now();
      const esperar=()=>{const st=typeof GLBM!=='undefined'?GLBM.st:null;if(st==='loading'||st==='idle'&&performance.now()-t<800){if(performance.now()-t<6000)return setTimeout(esperar,120)}ocultar()};
      esperar();return r};
  });
})();
