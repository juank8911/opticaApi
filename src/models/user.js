const mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb,
connectTimeout: 30000
});

let userModel={};
//devuelve los usuarios en un listado
userModel.getUsers = (callback) => {
if(connection)
{
// console.log('conexion a la base de datos');
connection.query(
'SELECT * FROM usuarios limit 1;',(err, row)=>
{
  // console.log('reliza consulta');
// console.log(err);
  if(err){
throw err;
}else{
callback(null,row);
}
}
)
}
else
{
// console.log('error en la conxion a la base de datos');
}
};


//registro de usuarios por facebook
userModel.registerFace = (usu, callback)=> {
if(connection)
{
var id = usu.id;
var correo = usu.email;
var nombre = usu.nombre;
var apellido = usu.apellido;
var avatar = usu.avatar;
// console.log('//////*/*/*/ID*/*/*/');
// console.log(id);
var sql = 'INSERT INTO usuarios(id,correo,avatar,nombre,apellidos,members_id,parentescos_id_parentescos,id_pais) VALUES (?,?,?,?,?,?,?,?);';
// console.log('Agregando ususario');
connection.query(sql,[id,correo,avatar,nombre,apellido,id,usu.parent,47],(err, row)=>{
if(err)
{
// console.log('no agregado ususario');
connection.query('DELETE FROM members WHERE id = ?',[id],(err,res)=>{
throw err
});
throw err
}
else
{
// console.log('Agregado el ususario');
var mensaje = {'mensaje':'usuario agregado con exito','existe':false,'id_usuario':id};
callback(null,mensaje);
}
});
}
else
{
callback(null,{'error':'error al comunicarse con la base de datos'});
}
};
// registra a los ususarios manualmmente
userModel.registerUsu = (usu, callback) =>{
if(connection)
{
var id = usu.id;
var cedula = usu.cedula;
var correo = usu.email;
var nombre = usu.nombre;
var apellido = usu.apellido;
var avatars =  usu.avatar;

// console.log(avatars);
var sql = 'INSERT INTO usuarios(id,cedula,correo,avatar,nombre,apellidos,members_id,parentescos_id_parentescos,id_pais) VALUES (?,?,?,?,?,?,?,?,?)';
connection.query(sql,[id,cedula,correo,avatars,nombre,apellido,id,usu.parent,47],(err, row)=>{
if(err)
{
connection.query('DELETE FROM members WHERE id = ?',[id],(err,res)=>{
//console.log('error al agregar ususario en user.js lineas 79')
callback(null,{'mensaje':'error al agregar el usuario'});
});
throw err
}
else
{
// console.log('Agregado el ususario');
var mensaje = {'mensaje':'usuario agregado con exito','existe':false,'id_usuario':id};
callback(null,mensaje);
}
});
}
};


// retorna los usuarios por su id
userModel.darUserId=(id,callback)=>{
if(connection)
{
var sql = "SELECT usuarios.*, CONCAT( usuarios.nombre,' ', usuarios.apellidos) as nombres, municipio.id_municipio,municipio.nombre as nomMuni,departamento.nombre as nomDepa, departamento.id_departamento FROM usuarios,municipio,departamento where usuarios.id_municipio = municipio.id_municipio AND departamento.id_departamento = municipio.id_departamento AND usuarios.id = ? ";
connection.query(sql,id,(err,row)=>{if(err){throw err}
else{
  console.log(row);
callback(null,row);
}
});
}
};

userModel.darFechaNId=(id,callback)=>{
if(connection)
{
var darF = 'SELECT cedula,fecha_nacimiento,telefono,telefonowatshapp FROM usuarios WHERE id = ?';
connection.query(darF,[id],(err,row)=>{
// console.log(id);
if(err){throw err}
else {
{
row = row[0];
// console.log(row);
if(row.fecha_nacimiento ==null || row.cedula==null || row.telefono==null )
{
//console.log({'datos':false});
callback(null,{'datos':false});
}
else
{
//console.log({'datos':true});
callback(null,{'datos':true});
}
}
}
});
}
};

userModel.setUsuario=(usu,callback)=>{
if(connection)
{
console.log(usu.id_municipio);
var sql = 'UPDATE usuarios SET cedula=?, nombre= ?, apellidos=?, direccion=?, telefono=?,telefonowatshapp=?,fecha_nacimiento=?,id_municipio=? WHERE id= ? and parentescos_id_parentescos = 17;'
connection.query(sql,[usu.cedula,usu.nombre,usu.apellidos,usu.direccion,usu.telefono,usu.telefonowatshapp,usu.fecha_nacimiento,usu.id_municipio,usu.id],(err,row)=>{
if(err){callback(null,{'update':false})}
else
{
// console.log({'update':true});
callback(null,{'update':true});
}
});

}
};

userModel.putAvatar = (avs,callback)=>{
if(connection)
{
var av = 'UPDATE usuarios SET avatar= ? WHERE id = ? ;';
connection.query(av,[avs.avatar,avs.id],(err,reqs)=>{
if(err){throw err}
else
{
callback(null,{'ok':true});
}
});
}
};


// retorna los usuarios por su id
userModel.darUsuario=(ced,callback)=>{
  if(connection)
  {
    var not = [];
  var sql = "SELECT usuarios.*, CONCAT( usuarios.nombre,' ', usuarios.apellidos) as nombres, municipio.id_municipio,municipio.nombre as nomMuni,departamento.nombre as nomDepa, departamento.id_departamento FROM usuarios,municipio,departamento where usuarios.id_municipio = municipio.id_municipio AND departamento.id_departamento = municipio.id_departamento AND usuarios.cedula = ? ";
  var citas = "SELECT events.* FROM events, usuarios WHERE events.usuarios_id = usuarios.id AND usuarios.id = ?";
  connection.query(sql,ced,(err,row)=>{if(err){throw err}
  else{

      row = row[0];
      not.push(row);
      console.log(not);
      
      connection.query(citas,[row.id],(err,rep)=>{
        if(err){throw err}
        else
        {
          not.push(rep);
          console.log(not);
          callback(null,not);
          
        }
      });
    
  }
  });
  }
  };

module.exports = userModel;
