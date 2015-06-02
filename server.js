var port = 8080;

var express = require('express')
  , app = module.exports = express()
  , cors = require('cors')
  , http = require('http')
  , request = require('request')
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


app.post('/send', function(req, res){
	var entrada = {
		servidores: req.body.servidores,
 		ordenamiento: req.body.ordenamiento,
  		archivo: req.body.archivo
	};

	var entradaString = JSON.stringify(entrada);

	var arreglo_salida=[];
	fs = require('fs'); 
	fs.readFile(req.body.archivo, 'utf8', 
	function(err,datos) {
		if (err) { 
			return console.log(err); 
		}; 
		var filas = datos.split("\n");
		filas_servidor =Math.floor(filas.length/req.body.servidores);
		filas_ultimo_servidor= filas.length -(filas_servidor*(req.body.servidores-1));
		var max_servidores= (req.body.servidores * 1)+1;
		var delta =0;
		var arreglo;
		var arr_servi= ["http://localhost:4568/solve","http://158.170.94.93:8085/solve","http://localhost:4568/solve","http://158.170.93.248:4567/solve"];
		for(i=1; i< max_servidores;i++){
			arreglo={"ordenamiento":req.body.ordenamiento,"datos":[]};
			if (i==max_servidores-1) {
				for(k=delta; k < filas_ultimo_servidor+delta; k++){
						arreglo.datos[k-delta] = {"id":filas[k]};
				}
				// console.log(" ");
				// console.log("Ultimo");
				// console.log(arreglo);
				// console.log(arr_servi[i-1]);
				request({ 
					url: arr_servi[i-1], 
					method: "POST", 
					headers: {'Content-Type': 'application/json'}, 
					json: true, 
					body: arreglo
				}, 
				function (error, response, body){ 
					for(m=delta; m < filas_ultimo_servidor+delta; m++){
						arreglo_salida.push(parseFloat(response.body.datos[m-delta].id));
					}	
				
				console.log(arreglo_salida);
				});

			}
			else{
				arreglo={"ordenamiento":req.body.ordenamiento,"datos":[]};
				for(j=delta; j < filas_servidor+delta; j++){
						arreglo.datos[j-delta] = {"id":filas[j]};
				}
				// console.log(" ");
				// console.log("Servidores");
				// console.log(arreglo);
				// console.log(arr_servi[i-1]);
				request({ 
					url: arr_servi[i-1], 
					method: "POST", 
					headers: {'Content-Type': 'application/json'}, 
					json: true, 
					body: arreglo
				}, 
				function (error, response, body){ 
					for(l=delta; l < filas_servidor+delta; l++){
						arreglo_salida.push(parseFloat(response.body.datos[l-delta].id));
					}
				console.log(arreglo_salida);
				merge_sort(arreglo_salida);
				console.log(arreglo_salida);
				// //Escritura del archivo
				// var fsalida = require('fs');
				// for(d=0;d<filas.length;d++){
				// 	if(d == filas.length-1){
				// 		fsalida.appendFile('./salida', arreglo_salida[d], function(err) {
				// 		    if( err ){
				// 		        console.log( err );
				// 		    }
				// 		});
				// 	}
				// 	fsalida.appendFile('./salida', arreglo_salida[d]+ '\n', function(err) {
				// 	    if( err ){
				// 	        console.log( err );
				// 	    }
				// 	});
				// }
				});
				delta=delta+filas_servidor;
			}

		}
});

res.redirect("/");
});

function merge(left, right, arr) {
	var a = 0;
	while (left.length && right.length)
		arr[a++] = right[0] < left[0] ? right.shift() : left.shift();
	while (left.length) arr[a++] = left.shift();
	while (right.length) arr[a++] = right.shift();
}
function mSort(arr, tmp, len) {
	if (len == 1) return;
	var 	m = Math.floor(len / 2),
		tmp_l = tmp.slice(0, m),
		tmp_r = tmp.slice(m);
	mSort(tmp_l, arr.slice(0, m), m);
	mSort(tmp_r, arr.slice(m), len - m);
	merge(tmp_l, tmp_r, arr);
}
function merge_sort(arr) {
	mSort(arr, arr.slice(), arr.length);
}