

//_______________
//        PUERTO
//_______________

process.env.PORT = process.env.PORT || 3000;

//ENTORNO

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS

let urlDB;

if(process.env.NODE_ENV=== 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb://sovith:12345@cafe-shard-00-00-2bjvx.mongodb.net:27017,cafe-shard-00-01-2bjvx.mongodb.net:27017,cafe-shard-00-02-2bjvx.mongodb.net:27017/test?ssl=true&replicaSet=cafe-shard-0&authSource=admin&retryWrites=true'
}
process.env.URLDB = urlDB;