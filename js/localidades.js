/* ===================== FASE 7 · LOCALIDADES CON IDENTIDAD PROPIA =====================
   Cada pueblo genera su propio callejero (semilla por nombre) y usa la paleta de su comarca:
   Plana y costa de Castellón con fachadas encaladas y zócalos azules; interior (Alto Palancia, Alcalatén)
   con tonos de piedra y ocre; Ribera y Horta con colores tierra. Son escenarios inspirados, no réplicas. */
const LOC_PAL={
 costa:['#f6f3ea','#f1ece0','#eef2f3','#f4efe4','#e9eef0','#f2e3c8','#f7f4ec'],
 interior:['#d9c09a','#cdb38e','#e2cfae','#c9b08a','#e7d7bb','#bda47e','#d3c3a5'],
 ribera:['#e7c9a0','#e9d3a8','#f0d9c6','#dfbf95','#ead7b6','#e3c39c','#f2e3c8'],
 general:null};
const LOC_COM={costa:['Burriana','Nules','Moncofa','Almassora','Vila-real','Benicarló','Vinaròs','Peníscola','Benicàssim','Orpesa','Castelló','Sagunt','Puçol','Dénia','Xàbia'],
 interior:['Segorbe','Onda','La Vall d\'Uixó','Vall d\'Uixó','Lucena','Vilafamés','Morella','Sant Mateu','Altura','Jérica','Requena','Utiel','Cheste','Xiva','Llíria'],
 ribera:['Algemesí','Alzira','Carcaixent','Sueca','Cullera','Ontinyent','Xàtiva','Albal','Silla','Catarroja','Picassent','Foios','Meliana','Massamagrell','Cabanes']};
function locPueblo(){try{return (CL&&CL.o&&CL.o.pueblo)||''}catch(e){return ''}}
function locComarca(p){p=p||locPueblo();for(const [k,L] of Object.entries(LOC_COM))if(L.some(x=>x.toLowerCase()===p.toLowerCase()))return k;let h=0;for(const ch of p)h=(h*31+ch.charCodeAt(0))>>>0;return ['costa','interior','ribera'][h%3]}
function locSeed(){const p=locPueblo();let h=0;for(const ch of p)h=(h*131+ch.charCodeAt(0))%9973;return h}
function locPal(){const c=locComarca();return LOC_PAL[c]||FACOL}
