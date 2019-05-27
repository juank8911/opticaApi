let mysql = require('mysql');
let config = require('../config');
var rl = require('random-letter');
let ciclo = require('../controler/ciclos')

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let parentModule = {};

//retorna una lista de parentescos posibles de la base de datos
parentModule.darParent = (callback)=>{
if(connection)
{
connection.query('SELECT id_parentescos, nombre FROM parentescos where id_parentescos != 17 and id_parentescos != 18;',(err,row)=>{
if(err)
{
throw err;
}
else {
{
callback(null,row);
}
}
});
}
};


parentModule.prueba = (callback) => {
ciclo.generaSalt((err,res)=>{
  callback(null,res);
});

};

module.exports = parentModule;
