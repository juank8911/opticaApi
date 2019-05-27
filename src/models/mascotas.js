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

let mascotasModule = {};

//agrega benedficiarios con los respectivos campos solicitados
mascotasModule.agregarMascotas = (masc,callback)=>{
if(connection)
{
var add = 'INSERT INTO mascotas (especie, raza, color, nombre, sexo, fecha_nacimineto, esterilizado, id_usuarios) VALUES (?,?,?,?,?,?,?,?);';
// console.log(benef);
connection.query(add,[masc.especie,masc.raza,masc.color,masc.nombre,masc.sexo,masc.fechan,masc.esteril,masc.id_usu],(err,res)=>{
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

//mascotas por el id del usuario
mascotasModule.darMascotasId = (id,callback)=>{
var sel = "SELECT mascotas.*, concat(usuarios.nombre,' ',usuarios.apellidos) as dueño, usuarios.telefono FROM mascotas, usuarios WHERE mascotas.id_usuarios = usuarios.id AND usuarios.id = ? ;";
if(connection)
{
connection.query(sel,[id],(err,row)=>{
if(err){throw err}
else{callback(null,row)}
});
}
};

mascotasModule.darMascotaIDm = (id,callback)=>{
  var sel = "SELECT mascotas.*, concat(usuarios.nombre,' ',usuarios.apellidos) as dueño, usuarios.telefono FROM mascotas, usuarios WHERE mascotas.id_usuarios = usuarios.id AND mascotas.id_mascotas = ? ;";
  if(connection)
  {
  connection.query(sel,[id],(err,row)=>{
  if(err){throw err}
  else{callback(null,row)}
  });
  }
};


module.exports = mascotasModule;
