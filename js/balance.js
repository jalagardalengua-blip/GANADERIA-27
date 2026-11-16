/* ============ BALANCE: todos los números ajustables del juego ============
   Cambia aquí la economía, la progresión y el feedback sin tocar la lógica.
   Lo leen juego.js y carrera.js (y, en el futuro, mundo3d.js). */
const BAL={
 // Guardado
 save:{version:2,key:'hierro-divisa-v1',bak:'hierro-divisa-v1.bak'},

 // Arranque de partida
 inicio:{
  real:{money:260000,vacas:40,machos:12,hembras:10,sementales:2,maxEdadM:5,bonus:2},
  fundada:{money:180000,pres:12,vacas:30,machos:7,hembras:7,sementales:1,maxEdadM:4,bonus:-5}
 },

 // Unidades ganaderas (UG): lo que come y ocupa cada animal frente a un toro adulto
 ug:{becerro:.3,anojo:.5,eral:.7,utrero:.85,toro:1,hembraJoven:.6,vaca:.8,semental:1.2},

 // Gastos mensuales
 gastos:{personalFijo:1500,personalCabeza:8,saneamientoCabeza:8,herradero:35},

 // Capacidad de la finca en UG y sobrecarga
 capacidad:{real:150,fundada:80,obras:{cercas:25,abrev:15,nave:10,comederos:5},sobrecoste:1.2,saludSobrecarga:-1.2},

 // Ayudas anuales (enero): pago por vaca de vientre y pago básico de la explotación
 ayudas:{porVaca:110,fija:4000},

 // Precio por cabeza según categoría: base + k * prestigio
 precio:{1:{base:6000,k:95},2:{base:3400,k:45},3:{base:2600,k:30},novillada:.45,azar:[.9,1.1]},

 // Ofertas
 ofertas:{purgaMeses:3,
  tercera:{prob:.5,probNovato:.75,presNovato:30,nCuatroNovato:.8},
  segunda:{prob:.35,presMin:15},
  tutorial:{meses:2,n:4,cat:3,plaza:'Plaza de tercera · Campo charro',feria:'Feria de primavera',precioExtra:1.15}},

 // Pienso a mano y clima
 pienso:{sacos:4,ahorro:.9,salud:.6},
 eventos:{prob:.42,
  lluvia:{meses:[1,2,3,9,10],mul:.72,salud:1.5},
  sequia:{meses:[5,6,7,8],mul:1.35,salud:-.8}},

 // Deuda, préstamo y quiebra
 deuda:{interesMensual:.01,limite:-90000,aviso:-45000,
  prestamo:{importe:90000,meses:36,interes:.12,confianza:-10}},

 // Prestigio: rendimientos decrecientes y desgaste
 prestigio:{umbral:40,desgaste:.03,techo:115,minGanancia:.12},

 // Confianza de la propiedad
 confianza:{inicial:60,porObjetivo:12,porFallo:10,rojos:2,ultimatum:20},

 // Objetivos de la temporada
 objetivos:{cashFrac:.9,cashMin:0,premioBase:8000,premioPres:120},

 // Escalafón: los rivales lidian una cantidad comparable a la tuya
 rivales:{meses:[2,9],probLidia:.62,toros:6,dobleProb:.12,deriva:.6,presMin:20,presMax:95},

 // Feedback (vibración en ms, sonidos opcionales del motor 3D)
 fx:{tap:6,ok:[18,30,18],reto:[20,40,20,40,60],cobro:[12,24,12],error:[60,40,60],golpe:[60,40,120],ole:25,hold:12,pulso:450}
};
