

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
    urlDB =  process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//SEED

process.env.SEED = process.env.SEED || 'seed';

//EXPIRACION

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//GOGLE

process.env.CLIENT_ID = process.env.CLIENT_ID || '582444226083-7g6uo58lrv5t9jcl0i9b3nef2qv4dfr0.apps.googleusercontent.com';