// Datos base del mundo: nacionalidades, nombres, ligas y ciudades.
// Todos los clubes y jugadores son ficticios.
window.G = window.G || {};

G.NATIONS = {
  ESP: { name: 'España', flag: 'ES',
    fn: ['Alejandro','Pablo','Hugo','Mario','Diego','Álvaro','Sergio','Iker','Javier','Adrián','Rubén','Marcos','Daniel','Raúl','Gonzalo','Unai','Aitor','Íñigo','Carlos','Víctor','Jorge','Óscar','Andrés','Nacho','Borja','Pedro','Ferran','Gavi','Mikel','Dani'],
    ln: ['García','Fernández','González','Rodríguez','López','Martínez','Sánchez','Pérez','Gómez','Martín','Jiménez','Ruiz','Hernández','Díaz','Moreno','Muñoz','Álvarez','Romero','Navarro','Torres','Domínguez','Vázquez','Ramos','Gil','Serrano','Molina','Blanco','Castro','Ortega','Rubio','Marín','Sanz','Iglesias','Medina','Garrido','Cortés','Lozano','Herrera','Peña','Aguirre','Etxeberria','Arrieta','Olano','Zubiri'] },
  ENG: { name: 'Inglaterra', flag: 'GB',
    fn: ['Harry','Jack','Oliver','George','Charlie','James','Thomas','Alfie','Mason','Callum','Declan','Jude','Bukayo','Reece','Jordan','Kyle','Ben','Luke','Aaron','Jamie','Marcus','Phil','Tyrone','Kieran','Ollie','Danny','Ross','Ryan','Lewis','Joe'],
    ln: ['Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Robinson','Wright','Thompson','Evans','Walker','White','Roberts','Green','Hall','Wood','Jackson','Clarke','Hughes','Edwards','Turner','Hill','Moore','Cooper','Ward','Morris','King','Baker','Harrison','Fletcher','Barnes','Mills','Stone','Ashworth'] },
  ITA: { name: 'Italia', flag: 'IT',
    fn: ['Lorenzo','Matteo','Alessandro','Federico','Nicolò','Gianluca','Marco','Andrea','Davide','Giorgio','Riccardo','Simone','Francesco','Luca','Tommaso','Daniele','Giovanni','Stefano','Paolo','Ciro','Sandro','Fabio','Manuel','Domenico','Pietro'],
    ln: ['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Conti','De Luca','Mancini','Costa','Giordano','Rizzo','Lombardi','Moretti','Barbieri','Fontana','Santoro','Mariani','Rinaldi','Caruso','Ferrara','Galli','Martini','Leone','Longo','Gentile','Vitale','Bellini'] },
  GER: { name: 'Alemania', flag: 'DE',
    fn: ['Lukas','Leon','Finn','Jonas','Niklas','Florian','Kai','Joshua','Leroy','Timo','Julian','Maximilian','Tobias','Felix','Jamal','Serge','Thomas','Manuel','Marc','Robin','Benjamin','Jannik','Moritz','Paul','Erik'],
    ln: ['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Schulz','Hoffmann','Koch','Richter','Klein','Wolf','Schröder','Neumann','Schwarz','Zimmermann','Braun','Krüger','Hofmann','Hartmann','Lange','Werner','Krause','Lehmann','Köhler','Brandt','Vogel','Kessler'] },
  FRA: { name: 'Francia', flag: 'FR',
    fn: ['Lucas','Hugo','Théo','Antoine','Kylian','Ousmane','Kingsley','Aurélien','Eduardo','Jules','Benjamin','Raphaël','Adrien','Mathis','Olivier','Randal','Ibrahima','Moussa','Wesley','Dayot','Mattéo','Nathan','Enzo','Louis','Maxence'],
    ln: ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garnier','Faure','Rousseau','Blanc','Guérin','Muller','Henry','Roussel','Nicolas','Perrin','Morin','Mathieu','Clément','Gauthier','Dumont','Lopez','Fontaine','Chevalier','Diallo','Camara','Koné','Traoré'] },
  POR: { name: 'Portugal', flag: 'PT',
    fn: ['João','Rúben','Bernardo','Diogo','Gonçalo','Rafael','Bruno','Nuno','Pedro','Tiago','André','Ricardo','Vitinha','Francisco','Rui','Hélder','Renato','Fábio','Otávio','Nélson'],
    ln: ['Silva','Santos','Ferreira','Pereira','Oliveira','Costa','Rodrigues','Martins','Jesus','Sousa','Fernandes','Gonçalves','Gomes','Lopes','Marques','Alves','Almeida','Ribeiro','Pinto','Carvalho','Teixeira','Moreira','Correia','Mendes','Nunes','Neves','Cancelo','Palhinha'] },
  NED: { name: 'Países Bajos', flag: 'NL',
    fn: ['Daan','Sem','Milan','Luuk','Bram','Frenkie','Matthijs','Virgil','Memphis','Denzel','Cody','Teun','Jurriën','Xavi','Steven','Wout','Joël','Ryan','Stefan','Jasper'],
    ln: ['de Jong','Jansen','de Vries','van den Berg','van Dijk','Bakker','Janssen','Visser','Smit','Meijer','de Boer','Mulder','de Groot','Bos','Vos','Peters','Hendriks','van Leeuwen','Dekker','Brouwer','de Wit','Dijkstra','Smits','de Graaf','van der Meer','Kramer','Timber','Koopmeiners'] },
  BRA: { name: 'Brasil', flag: 'BR',
    fn: ['Gabriel','Vinícius','Rodrygo','Lucas','Matheus','Pedro','Thiago','Bruno','Raphinha','Endrick','Casemiro','Éder','Marquinhos','Danilo','Fabinho','Richarlison','Antony','Gerson','Everton','Paulinho','Douglas','Wendel','Igor','Murilo','Luiz'],
    ln: ['Silva','Santos','Oliveira','Souza','Lima','Pereira','Ferreira','Costa','Rodrigues','Almeida','Nascimento','Carvalho','Araújo','Ribeiro','Barbosa','Rocha','Dias','Moura','Cardoso','Teixeira','Mendes','Freitas','Batista','Andrade','Vieira','Martinelli','Paquetá','Guimarães'] },
  ARG: { name: 'Argentina', flag: 'AR',
    fn: ['Lionel','Julián','Lautaro','Enzo','Alexis','Rodrigo','Nicolás','Emiliano','Ángel','Leandro','Gonzalo','Exequiel','Thiago','Valentín','Facundo','Nahuel','Agustín','Franco','Matías','Lisandro','Germán','Cristian','Marcos','Giovani'],
    ln: ['González','Rodríguez','Gómez','Fernández','López','Díaz','Martínez','Pérez','Romero','Sosa','Álvarez','Torres','Ruiz','Ramírez','Flores','Acosta','Benítez','Medina','Herrera','Suárez','Aguirre','Giménez','Molina','Paredes','Otamendi','Correa','Palacios','Almada','Barco','Echeverri'] },
  MEX: { name: 'México', flag: 'MX',
    fn: ['Santiago','Hirving','Raúl','Edson','Guillermo','Héctor','Jesús','Andrés','Luis','César','Orbelín','Alexis','Uriel','Diego','Jorge','Érick','Roberto','Carlos','Johan','Henry'],
    ln: ['Hernández','García','Martínez','López','González','Rodríguez','Pérez','Sánchez','Ramírez','Cruz','Flores','Gómez','Morales','Vázquez','Jiménez','Reyes','Díaz','Torres','Gutiérrez','Ruiz','Mendoza','Aguilar','Ortiz','Castillo','Lozano','Álvarez','Montes','Vega','Chávez','Romo'] },
  URU: { name: 'Uruguay', flag: 'UY', fn: ['Federico','Darwin','Ronald','Rodrigo','Manuel','Facundo','Matías','Sebastián','Agustín','Maximiliano'], ln: ['Valverde','Núñez','Araújo','Bentancur','Ugarte','Pellistri','Giménez','Olivera','Viña','Rochet','Cáceres','De Arrascaeta'] },
  COL: { name: 'Colombia', flag: 'CO', fn: ['James','Luis','Jhon','Davinson','Yerry','Juan','Richard','Rafael','Jefferson','Wilmar'], ln: ['Díaz','Sinisterra','Arias','Sánchez','Mina','Cuadrado','Ríos','Borré','Lerma','Muñoz','Barrios','Cuesta'] },
  BEL: { name: 'Bélgica', flag: 'BE', fn: ['Kevin','Romelu','Youri','Jérémy','Amadou','Leandro','Arthur','Charles','Lois','Zeno'], ln: ['Peeters','Janssens','Maes','Jacobs','Mertens','Willems','Claes','Goossens','Wouters','De Smet','Lambert','Dupont'] },
  CRO: { name: 'Croacia', flag: 'HR', fn: ['Luka','Mateo','Josko','Ivan','Andrej','Marcelo','Josip','Lovro','Mario','Nikola'], ln: ['Modrić','Kovačić','Gvardiol','Perišić','Kramarić','Brozović','Sučić','Majer','Juranović','Pašalić','Livaković','Stanišić'] },
  NGA: { name: 'Nigeria', flag: 'NG', fn: ['Victor','Samuel','Ademola','Wilfred','Alex','Kelechi','Calvin','Moses','Joe','Frank'], ln: ['Osimhen','Chukwueze','Lookman','Ndidi','Iwobi','Iheanacho','Bassey','Simon','Aribo','Onyeka','Okafor','Adeyemi'] },
  SEN: { name: 'Senegal', flag: 'SN', fn: ['Sadio','Kalidou','Ismaïla','Idrissa','Nicolas','Pape','Cheikhou','Boulaye','Iliman','Habib'], ln: ['Mané','Koulibaly','Sarr','Gueye','Jackson','Diatta','Ndiaye','Dia','Mendy','Diallo','Cissé','Faye'] },
  JPN: { name: 'Japón', flag: 'JP', fn: ['Takefusa','Kaoru','Takumi','Wataru','Daichi','Ritsu','Junya','Hiroki','Ko','Ayase'], ln: ['Kubo','Mitoma','Minamino','Endo','Kamada','Doan','Ito','Sakai','Itakura','Ueda','Tomiyasu','Morita'] },
  USA: { name: 'Estados Unidos', flag: 'US', fn: ['Christian','Weston','Tyler','Giovanni','Sergiño','Tim','Brenden','Antonee','Ricardo','Folarin'], ln: ['Pulisic','McKennie','Adams','Reyna','Dest','Weah','Aaronson','Robinson','Pepi','Balogun','Turner','Richards'] },
  MAR: { name: 'Marruecos', flag: 'MA', fn: ['Achraf','Hakim','Youssef','Sofyan','Noussair','Azzedine','Bilal','Brahim','Romain','Amine'], ln: ['Hakimi','Ziyech','En-Nesyri','Amrabat','Mazraoui','Ounahi','El Khannouss','Saïss','Bounou','Aguerd','Harit','Diaz'] },
  CIV: { name: 'Costa de Marfil', flag: 'CI', fn: ['Franck','Sébastien','Simon','Wilfried','Serge','Nicolas','Odilon','Ibrahim','Evan','Christian'], ln: ['Kessié','Haller','Adingra','Zaha','Aurier','Pépé','Kossounou','Sangaré','Ndicka','Fofana','Boly','Diomandé'] }
};

// Ligas. rep = nivel medio de los clubes (escala 0-100).
G.LEAGUES = [
  { id: 'ESP', name: 'Liga Primera', nat: 'ESP', size: 20, rep: 80, cont: 'EU',
    cities: ['Madrid','Barcelona','Valencia','Sevilla','Bilbao','Málaga','Zaragoza','Vigo','Gijón','Pamplona','Valladolid','Granada','Alicante','Córdoba','Oviedo','Santander','Cádiz','Almería','Getafe','Vitoria','Elche','Huesca','Murcia','Salamanca'],
    pre: ['Real','Atlético','Deportivo','CD','UD','Racing','Sporting','Unión','CF'], suf: ['CF','FC','Balompié','Club','SD'] },
  { id: 'ENG', name: 'Premier Division', nat: 'ENG', size: 20, rep: 82, cont: 'EU',
    cities: ['London','Manchester','Liverpool','Birmingham','Leeds','Newcastle','Sheffield','Bristol','Nottingham','Leicester','Southampton','Brighton','Portsmouth','Derby','Norwich','Coventry','Sunderland','Hull','Reading','Ipswich','Stoke','Plymouth','Wigan','Oxford'],
    pre: [], suf: ['United','City','Athletic','Rovers','Town','Wanderers','Albion','County','FC','Rangers'] },
  { id: 'ITA', name: 'Serie Maggiore', nat: 'ITA', size: 20, rep: 78, cont: 'EU',
    cities: ['Milano','Roma','Torino','Napoli','Firenze','Genova','Bologna','Bergamo','Verona','Udine','Lecce','Cagliari','Parma','Empoli','Salerno','Monza','Sassuolo','Venezia','Palermo','Bari','Como','Brescia'],
    pre: ['AC','US','SS','FC','Calcio','Sporting','Atletico','Virtus'], suf: ['Calcio','FC','1908','United'] },
  { id: 'GER', name: 'Erste Liga', nat: 'GER', size: 18, rep: 78, cont: 'EU',
    cities: ['München','Dortmund','Berlin','Hamburg','Köln','Frankfurt','Stuttgart','Leipzig','Bremen','Düsseldorf','Hannover','Freiburg','Mainz','Augsburg','Bochum','Nürnberg','Kiel','Darmstadt','Wolfsburg','Kassel'],
    pre: ['FC','SV','VfB','TSV','SC','FSV','Borussia','Eintracht','Union','Fortuna'], suf: ['FC','04','1899','SV','Kickers'] },
  { id: 'FRA', name: 'Ligue Élite', nat: 'FRA', size: 18, rep: 75, cont: 'EU',
    cities: ['Paris','Marseille','Lyon','Lille','Nice','Nantes','Bordeaux','Rennes','Toulouse','Montpellier','Strasbourg','Lens','Reims','Brest','Le Havre','Angers','Metz','Lorient','Auxerre','Caen'],
    pre: ['Olympique','AS','Stade','FC','Racing','RC','SC','Union'], suf: ['FC','Athlétique','Sporting','Club'] },
  { id: 'POR', name: 'Liga Lusa', nat: 'POR', size: 18, rep: 70, cont: 'EU',
    cities: ['Lisboa','Porto','Braga','Guimarães','Coimbra','Faro','Funchal','Aveiro','Setúbal','Viseu','Leiria','Évora','Chaves','Barcelos','Famalicão','Arouca','Estoril','Vizela','Portimão','Covilhã'],
    pre: ['Sporting','Académico','Vitória','União','CD','SC','Clube','Desportivo'], suf: ['FC','SC','Atlético'] },
  { id: 'NED', name: 'Hoofdklasse', nat: 'NED', size: 18, rep: 69, cont: 'EU',
    cities: ['Amsterdam','Rotterdam','Eindhoven','Utrecht','Den Haag','Groningen','Arnhem','Enschede','Alkmaar','Heerenveen','Tilburg','Nijmegen','Zwolle','Breda','Sittard','Almelo','Waalwijk','Deventer','Leeuwarden','Volendam'],
    pre: ['FC','SC','Sparta','Go Ahead','Vitesse','Willem','NEC','PEC','Fortuna'], suf: ['FC','Combinatie','\'08','United'] },
  { id: 'BRA', name: 'Campeonato Brasileño', nat: 'BRA', size: 20, rep: 70, cont: 'SA',
    cities: ['São Paulo','Rio de Janeiro','Belo Horizonte','Porto Alegre','Salvador','Recife','Fortaleza','Curitiba','Goiânia','Belém','Manaus','Florianópolis','Santos','Campinas','Natal','Cuiabá','Bragança','Maceió','Vitória','João Pessoa','Londrina','Juiz de Fora'],
    pre: ['Esporte Clube','Sport','Atlético','América','Clube','Grêmio','Ceará','Botafogo','Paraná'], suf: ['FC','EC','Futebol Clube','Atlético'] },
  { id: 'ARG', name: 'Primera Argentina', nat: 'ARG', size: 20, rep: 68, cont: 'SA',
    cities: ['Buenos Aires','Rosario','Córdoba','La Plata','Mendoza','Avellaneda','Santa Fe','Tucumán','Mar del Plata','Bahía Blanca','Lanús','Quilmes','Banfield','Salta','Paraná','San Juan','Junín','Rafaela','Tigre','Victoria','Formosa','Neuquén'],
    pre: ['Club Atlético','Deportivo','Sportivo','Racing','Unión','Estudiantes de','Gimnasia de','Talleres de','Atlético','Defensores de'], suf: ['FC','Juniors','Central','Athletic'] },
  { id: 'MEX', name: 'Liga Mexicana', nat: 'MEX', size: 18, rep: 66, cont: 'NA',
    cities: ['Ciudad de México','Guadalajara','Monterrey','Puebla','Toluca','León','Querétaro','Tijuana','Torreón','Pachuca','Mazatlán','San Luis','Aguascalientes','Juárez','Mérida','Veracruz','Morelia','Cancún','Oaxaca','Chihuahua'],
    pre: ['Club','Deportivo','Atlético','Real','Tiburones de','Leones de','Rayos de','Pumas de','Unión'], suf: ['FC','United','Atlético','CF'] }
];

// Combinaciones a evitar porque coinciden con clubes reales famosos.
G.BLOCKED_NAMES = ['Real Madrid','Atlético Madrid','Real Sociedad','Real Betis','Deportivo Alavés','Real Valladolid','Real Zaragoza','Real Oviedo','Racing Santander','Sporting Gijón','Manchester United','Manchester City','Leeds United','Newcastle United','Sheffield United','Leicester City','Norwich City','Coventry City','Hull City','Stoke City','Bristol City','Bristol Rovers','Birmingham City','Derby County','Brighton Albion','Oxford United','Ipswich Town','Reading FC','Wigan Athletic','AC Milano','SS Napoli','US Lecce','Venezia FC','Como 1908','FC Torino','Genova FC','Borussia Dortmund','Eintracht Frankfurt','VfB Stuttgart','Union Berlin','Fortuna Düsseldorf','SC Freiburg','FC Köln','Olympique Marseille','Olympique Lyon','Stade Rennes','Stade Brest','RC Lens','RC Strasbourg','FC Nantes','Vitória Guimarães','Sporting Lisboa','FC Porto','Sporting Braga','Vitória Setúbal','Sparta Rotterdam','FC Utrecht','FC Groningen','Willem Tilburg','Grêmio Porto Alegre','Atlético Belo Horizonte','Sport Recife','Ceará Fortaleza','Botafogo Rio de Janeiro','Santos FC','Racing Avellaneda','Estudiantes de La Plata','Gimnasia de La Plata','Talleres de Córdoba','Rosario Central','Club Atlético Tigre','Club Atlético Banfield','Club Atlético Lanús','Club Atlético Rosario','Club Atlético Tucumán','Pumas de Ciudad de México','Club Puebla','Club Toluca','Club León','Club Tijuana','Club Pachuca'];

G.POSITIONS = ['POR','DFC','LD','LI','MCD','MC','MCO','ED','EI','DC'];
G.POS_NAME = { POR:'Portero', DFC:'Defensa central', LD:'Lateral derecho', LI:'Lateral izquierdo', MCD:'Mediocentro defensivo', MC:'Mediocentro', MCO:'Mediapunta', ED:'Extremo derecho', EI:'Extremo izquierdo', DC:'Delantero centro' };
G.POS_GROUP = { POR:'POR', DFC:'DEF', LD:'DEF', LI:'DEF', MCD:'MED', MC:'MED', MCO:'MED', ED:'DEL', EI:'DEL', DC:'DEL' };

G.ATTRS = ['pac','sho','pas','dri','def','phy','gk'];
G.ATTR_NAME = { pac:'Ritmo', sho:'Tiro', pas:'Pase', dri:'Regate', def:'Defensa', phy:'Físico', gk:'Portería' };
G.ATTR_SHORT = { pac:'RIT', sho:'TIR', pas:'PAS', dri:'REG', def:'DEF', phy:'FÍS', gk:'POR' };

// Peso de cada atributo en la media según la posición.
G.POS_WEIGHTS = {
  POR: { gk: .88, phy: .06, pas: .06 },
  DFC: { def: .5, phy: .28, pac: .1, pas: .12 },
  LD:  { def: .34, pac: .3, pas: .2, phy: .1, dri: .06 },
  LI:  { def: .34, pac: .3, pas: .2, phy: .1, dri: .06 },
  MCD: { def: .4, pas: .3, phy: .2, dri: .1 },
  MC:  { pas: .45, dri: .2, def: .15, sho: .1, phy: .1 },
  MCO: { pas: .35, dri: .35, sho: .25, pac: .05 },
  ED:  { pac: .35, dri: .35, sho: .15, pas: .15 },
  EI:  { pac: .35, dri: .35, sho: .15, pas: .15 },
  DC:  { sho: .5, pac: .2, dri: .15, phy: .15 }
};

// Plantilla tipo de 25 jugadores.
G.SQUAD_TEMPLATE = ['POR','POR','POR','DFC','DFC','DFC','DFC','LD','LD','LI','LI','MCD','MCD','MC','MC','MC','MCO','MCO','ED','ED','EI','EI','DC','DC','DC'];

// Formaciones: coordenadas relativas (x: 0 propia portería → 1 rival; y: 0 derecha → 1 izquierda).
G.FORMATIONS = {
  '4-3-3':   [['POR',.04,.5],['LD',.25,.12],['DFC',.2,.37],['DFC',.2,.63],['LI',.25,.88],['MCD',.36,.5],['MC',.45,.3],['MC',.45,.7],['ED',.63,.14],['DC',.68,.5],['EI',.63,.86]],
  '4-4-2':   [['POR',.04,.5],['LD',.25,.12],['DFC',.2,.37],['DFC',.2,.63],['LI',.25,.88],['ED',.47,.13],['MC',.42,.38],['MC',.42,.62],['EI',.47,.87],['DC',.66,.4],['DC',.66,.6]],
  '4-2-3-1': [['POR',.04,.5],['LD',.25,.12],['DFC',.2,.37],['DFC',.2,.63],['LI',.25,.88],['MCD',.36,.38],['MCD',.36,.62],['ED',.55,.15],['MCO',.53,.5],['EI',.55,.85],['DC',.69,.5]],
  '4-1-4-1': [['POR',.04,.5],['LD',.25,.12],['DFC',.2,.37],['DFC',.2,.63],['LI',.25,.88],['MCD',.33,.5],['ED',.5,.13],['MC',.45,.37],['MC',.45,.63],['EI',.5,.87],['DC',.68,.5]],
  '3-5-2':   [['POR',.04,.5],['DFC',.2,.3],['DFC',.18,.5],['DFC',.2,.7],['LD',.42,.08],['MCD',.36,.5],['MC',.45,.32],['MC',.45,.68],['LI',.42,.92],['DC',.66,.4],['DC',.66,.6]],
  '5-3-2':   [['POR',.04,.5],['LD',.27,.08],['DFC',.19,.3],['DFC',.17,.5],['DFC',.19,.7],['LI',.27,.92],['MC',.42,.3],['MCD',.38,.5],['MC',.42,.7],['DC',.64,.4],['DC',.64,.6]]
};

// Entrenamiento semanal: enfoque → atributos que mejora y efecto sobre el estado.
G.TRAINING_FOCUS = {
  equilibrado: { name: 'Equilibrado', attrs: ['pac','sho','pas','dri','def','phy','gk'], desc: 'Un poco de todo. Mantiene el nivel sin riesgos.' },
  fisico:      { name: 'Físico', attrs: ['pac','phy'], desc: 'Resistencia y velocidad. Cansa mucho más.' },
  ataque:      { name: 'Finalización', attrs: ['sho','dri'], desc: 'Tiro y regate. Sube la moral de los delanteros.' },
  posesion:    { name: 'Posesión', attrs: ['pas','dri'], desc: 'Rondos y juego de posición. Sube la química del equipo.' },
  defensa:     { name: 'Defensa', attrs: ['def','phy'], desc: 'Repliegue, marcajes y entradas.' },
  tactico:     { name: 'Táctico', attrs: [], desc: 'Automatismos con tu formación. Mejora mucho la química.' },
  porteros:    { name: 'Porteros', attrs: ['gk'], desc: 'Sesión específica de porteros; el resto trabaja suave.' },
  descanso:    { name: 'Descanso', attrs: [], desc: 'Recuperación. Máxima frescura y menos lesiones.' }
};

G.COUNTRY_COLORS = ['#c8102e','#ffffff','#003da5','#ffd100','#00843d','#000000','#6cace4','#7a263a','#f47a20','#5c2d91','#00a3e0','#ef3340','#1b365d','#c99700','#009a44','#a6192e','#0057b8','#8a8d8f'];
