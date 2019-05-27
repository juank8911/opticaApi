let mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let municipioModel = {};

//retorna una lista de municipios por el id del depattamento
municipioModel.darMunicipioId = (id ,callback)=>
{
if(connection)
{
var sql = 'SELECT id_municipio,nombre FROM municipio WHERE id_departamento = ?'
connection.query(sql,[id],(err,row)=>{
if(err)
{
// console.log(err);
callback(null,'error al buscar en la base de datos');
}
else
{
//console.log(row);
callback(null,row);
}
});
}
}


module.exports = municipioModel;
