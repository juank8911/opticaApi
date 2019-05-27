let mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let benefModule = {};

//agrega benedficiarios con los respectivos campos solicitados
benefModule.agregarBeneficiario = (benef,callback)=>{
if(connection)
{
var add = 'INSERT INTO usuarios (cedula, nombre, apellidos, telefono,telefonowatshapp,fecha_nacimiento,usuariosBf_id, parentescos_id_parentescos,id_pais) VALUES (?,?,?,?,?,?,?,?,?);';
// //console.lo.log(benef);
connection.query(add,[benef.ident,benef.nombre,benef.apellidos,benef.tel,benef.tel,benef.fecha_n,benef.id_usu,benef.parent,benef.pais],(err,res)=>{
if(err){callback(null,err)}
else {
{
  res = res.protocol41;
callback(null,res)
}
}
});
}
};

benefModule.darBenefId = (id,callback)=>{
var sel = 'SELECT usuarios.*, parentescos.nombre as parentesco FROM usuarios,parentescos WHERE usuarios.parentescos_id_parentescos = parentescos.id_parentescos and usuariosBf_id = ? and parentescos_id_parentescos != 17;'
if(connection)
{
connection.query(sel,[id],(err,row)=>{
if(err){callback(500,err)}
else{callback(null,row)}
});
}
};

module.exports = benefModule;
