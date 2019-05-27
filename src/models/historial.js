let mysql = require('mysql');
let config = require('../config');
let eject = require('./ejecucion');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let histModule = {};

histModule.darHistorialU = (id,callback)=>{
  let hist = [];
  let p = 1;
  let q = 1;
  let benefs = [parseInt(id)];
    if(connection)
  {
    // let benf = 'SELECT usuarios.id FROM usuarios WHERE usuariosBf_id = ? ;';
    let sel = 'SELECT historial.*,servicios.direccion, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombres, servicios.nombre as servicio FROM historial, usuarios, servicios WHERE usuarios.id = historial.usuarios_id AND servicios.id_servicios = historial.servicios_idservicios AND usuarios_id = ? ORDER BY historial.calificada asc, historial.start asc;';
    // connection.query(benf,[id],(err,benf)=>{
    //   if(err){throw err}
    //   else
    //   {
    //     console.log(benf.length);
    //     if(benf.length==0)
    //     {
          connection.query(sel,[id],(err,resp)=>{
            console.log('en historial ejecutando');
            // console.log(resp);
              callback(null,resp);
          });
    //     }
    //     else
    //     {
    //       for (var i = 0; i < benf.length; i++) {
    //       benefs.push(benf[i].id);
    //       console.log(i +' / '+ benf.length);
    //       if(p==benf.length)
    //       {
    //           console.log(benefs);
    //           eject.histrialBenf(benefs,(err,res)=>{
    //             callback(null,res);
    //           });
    //       }
    //       p++;
    //     }
    //   }
    //
    //   }
    // });

  }
};

histModule.darHistorialB = (id,callback)=>{
  let hist = [];
  let p = 1;
  let q = 1;
  let benefs = [];
    if(connection)
  {
    let benf = 'SELECT usuarios.id FROM usuarios WHERE usuariosBf_id = ? ;';
    let sel = 'SELECT historial.*,servicios.direccion, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombres, servicios.nombre as servicio FROM historial, usuarios, servicios WHERE usuarios.id = historial.usuarios_id AND servicios.id_servicios = historial.servicios_idservicios AND usuarios_id = ? ORDER BY historial.calificada asc, historial.start asc;;';
    connection.query(benf,[id],(err,benf)=>{
      if(err){throw err}
      else
      {
        console.log(benf.length);
        if(benf.length==0)
        {
          connection.query(sel,[id],(err,resp)=>{
            console.log('en historial ejecutando');
            // console.log(resp);
              callback(null,resp);
          });
        }
        else
        {
          for (var i = 0; i < benf.length; i++) {
          benefs.push(benf[i].id);
          console.log(i +' / '+ benf.length);
          if(p==benf.length)
          {
              console.log(benefs);
              eject.histrialBenf(benefs,(err,res)=>{
                callback(null,res);
              });
          }
          p++;
        }
      }

      }
    });

  }
};


histModule.historialPel = (id,callback)=>{
if(connection)
{
  let mas = 'SELECT historial_masc.*,historial_masc.id_servicios as servicios_idservicios, servicios.nombre as servicio, mascotas.nombre as nombres, servicios.direccion FROM mascotas, usuarios, historial_masc, servicios WHERE mascotas.id_usuarios = usuarios.id AND mascotas.id_mascotas = historial_masc.id_mascotas AND servicios.id_servicios = historial_masc.id_servicios AND usuarios.id = ? ORDER BY historial_masc.calificada asc, historial_masc.start asc;';
  connection.query(mas,[id],(err,row)=>{
    callback(null,row);
  });
}

};







module.exports = histModule;
