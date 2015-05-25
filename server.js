var port = 8080;

var express = require('express')
  , app = module.exports = express()
  , cors = require('cors')
  , http = require('http')
  , server = http.createServer(app)
  , bodyParser = require('body-parser');
  server.listen(port);

var databaseUrl = "TSD"; //Name db MongoDB

//Usado para Routing
app.use("/function", express.static(__dirname + '/function'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/css/", express.static(__dirname + '/css/'));
app.use("/fonts/", express.static(__dirname + '/fonts/'));
app.use("/", express.static(__dirname + '/view/'));
app.use("/", express.static(__dirname + '/'));
//Usado para realizar el Post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

console.log('Web Services Online in Port ' + port);

//Routing view
app.get('/', function(req, res){
	res.redirect("/view/index.html");
});

//Devuelve el N tweet
app.get('/tweet/:number', function(req, res){
	var collec = ['tweetList'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('tweetList');

	collection.count(function(error, numTweet) {
    	if(error) res.send('Error connection')
    	if(req.params.number >= numTweet){
    		res.send('Error length');
    	} else {
    		collection.find().skip(parseInt(req.params.number)).limit(1).toArray(function(e, results){
			    if (e) res.send('Error');
			    res.send('{"tweet":"'+results[0].tweet+" algoritmo :"+results[0].ordenamiento+" servidores :"+results[0].servidores+'"}');
				db.close();
		  	})
    	}
	});
});

//Devuelve la cantidad de tweet que se poseen en la base de datos
app.get('/tweetCount/', function(req, res){
	//console.log('tweetClassifier');
	var collec = ['tweetList'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('tweetList');

	collection.count(function(error, countTweet) {
    	if(error) res.send('Error connection');
    	//console.log(numTweet);
    	res.send('{"countTweet":"'+countTweet+'"}');
	});
});




//Guardar un tweet en base a un método POST
app.post('/send', function(req, res){
	console.log('Send Entrada');
	var entrada = {
		servidores: req.body.servidores,
 		ordenamiento: req.body.ordenamiento,
  		archivo: req.body.archivo
	};

var entradaString = JSON.stringify(entrada);

console.log(entradaString);

fs = require('fs'); 
fs.readFile(req.body.archivo, 'utf8', 
function(err,datos) {
	if (err) { 
		return console.log(err); 
	}; 
	var filas = datos.split("\n");
	filas_servidor =Math.floor(filas.length/req.body.servidores);
	filas_ultimo_servidor= filas.length -(filas_servidor*(req.body.servidores-1));
	console.log(filas_ultimo_servidor);
	console.log(filas_servidor);
	var max_servidores= (req.body.servidores * 1)+1;
	var delta =0;
	for(i=1; i< max_servidores;i++){
		if (i==max_servidores-1) {
			for(k=delta; k < filas_ultimo_servidor+delta; k++){
					var cachos = filas[k].split(".");
					var linea = { 
						id: cachos[0], 
						contenido: cachos[1],
						servidor: i,
						posicion:k,
						algoritmo:req.body.ordenamiento
					}; 
					console.log(JSON.stringify(linea)); 
			}
		}
		else{
			for(j=delta; j < filas_servidor+delta; j++){
					var cachos = filas[j].split(".");
					var linea = { 
						id: cachos[0], 
						contenido: cachos[1],
						servidor: i,
						posicion:j,
						algoritmo:req.body.ordenamiento
					}; 
					console.log(JSON.stringify(linea)); 
			}
			delta=delta+filas_servidor;
		}
	}

});

res.redirect("/");
});