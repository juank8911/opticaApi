const mysql = require('mysql');
let config = require('../config');
let moment = require('moment');
let eject = require('./ejecucion');

connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let citasModel = {};

// cuenta las citas
citasModel.countCitas = (row,callback)=>{
var hora =0;
let p=1;
let jsonHd = [];
 // console.log('***************////CONTEO DE CITAS//');
// console.log(row);
var cate = row.cate;
//console.log(cate);
var serv = {};

for (var i = 0; i < row.length; i++)
{
hora=row[i];
// console.log(hora.hora);
serv = {
hora:hora.hora,
id:row.id,
cate:row.cate
};
////console.lo.log(serv);
eject.darLibres(serv,(err,resp)=> {
////console.lo.log(resp);
p++;
jsonHd.push(resp);
if(row.length==p)
{
////console.lo.log('jsonHd');
// console.log(jsonHd);
callback(null,jsonHd);
}
});

}

};

// retona las citas ocuapadas para la vista de los medicos
citasModel.countCitasOc = (row,callback)=>{
var hora =0;
let p=0;
let jsonHd = [];
console.log(row.id);
var serv = {};

for (var i = 0; i < row.length; i++)
{
hora=row[i];
console.log('/**************CONTeO DE CITAS');
console.log(hora.hora);
serv = {
hora:hora.hora,
id:row.id,
cate:row.cate
};
console.log(serv);
eject.darCitasOc(serv,(err,resp)=> {
console.log(resp);
p++;
jsonHd.push(resp);
if(p>=row.length)
{
console.log('jsonHd');
////console.lo.log(jsonHd);
callback(null,jsonHd);
}
});
}
};



// retorna las citas por el usuario
citasModel.darCitasUsu = (id,callback)=>{
if(connection)
{
var sql = 'SELECT servicios.nombre, servicios.id_servicios, events.start FROM servicios,events WHERE servicios.id_servicios = events.servicios_idservicios AND usuarios_id = ?';
connection.query(sql,[id],(err,row)=>{
if(err){throw err}
else
{
moment.locale('es');
//console.lo.log(moment().utc().format());
row = row[0];
row.start = moment(row.start).utc(-5).format();
//console.lo.log(row);
callback(null,row);
}
});
}
};

// retorna los eventos por cedula del pasiente.
citasModel.CitasUsuarioProv = (usu,callback)=>{
  // console.log(usu);
  let res = [];
  let res1 = [];
  let rest = [];
var sql = "SELECT events.start,events.id_eventos,events.usuarios_id,events.servicios_idservicios,servicios.nombre as servicio,concat(usuarios.nombre,' ',usuarios.apellidos) as paciente,usuarios.avatar, day(now()) as hoy,month(now()) as mes, day(events.start) as cita, month(events.start) as mescita, servicios_categoria.categoria_idcategoria as categoria FROM events, provedores, servicios, usuarios,servicios_categoria WHERE events.servicios_idservicios = servicios.id_servicios AND servicios.id_provedores = provedores.id_provedor AND events.usuarios_id = usuarios.id AND servicios.id_servicios = servicios_categoria.servicios_idservicios AND provedores.id_provedor = ? AND usuarios.cedula = ? ;";
  connection.query(sql,[usu.ser,usu.id],(err,row)=>{
    if(err){throw err}
    else
    {
      // console.log(row);


                    let act = 'SELECT citas_activas.*, servicios.nombre as servicio,concat(usuarios.nombre," ",usuarios.apellidos) as paciente,usuarios.avatar FROM citas_activas, usuarios, servicios WHERE citas_activas.usuarios_id = usuarios.id AND citas_activas.servicios_idservicios = servicios.id_servicios AND servicios.id_provedores = ? AND usuarios.cedula = ?;';
                    connection.query(act,[usu.ser, usu.id],(err,ress)=>{
                      if(err){throw err}
                      else
                      {
                        // console.log('/*/*/*/*/*/*/*/*/*/');
                        // console.log(ress);
                        if(JSON.stringify(ress)!='[]')
                        {
                          // row = {activas:true};
                          ress[0].activas = true;
                          console.log(ress);
                          res.push(ress[0]);
                          for (var i = 0; i < row.length; i++) {
                            res.push(row[i]);
                          }
                          // console.log('/*/*/*/*/Despues del if*/*/*/*/*/');
                          // console.log(res);

                        }
                        else
                        {
                          if(JSON.stringify(row)=='[]')
                          {
                              res.push( {activas:false});
                          }
                          else
                          {
                              res.push(row);
                          }

                        }
                      }
                    });


      var masc = 'SELECT events_masc.start,events_masc.id_eventos,events_masc.id_mascotas,events_masc.id_servicios,servicios.nombre as servicio, mascotas.nombre as paciente, mascotas.avatar, servicios.nombre, servicios_categoria.categoria_idcategoria, day(now()) as hoy,month(now()) as mes, day(events_masc.start) as cita, month(events_masc.start) as mescita FROM events_masc, mascotas, servicios, servicios_categoria, usuarios, provedores WHERE events_masc.id_mascotas = mascotas.id_mascotas AND events_masc.id_servicios = servicios.id_servicios AND servicios.id_servicios = servicios_categoria.servicios_idservicios AND mascotas.id_usuarios = usuarios.id AND servicios.id_provedores = provedores.id_provedor AND provedores.id_provedor = ? AND usuarios.cedula = ?;'
                  connection.query(masc,[usu.ser,usu.id],(err,row1)=>{
                    if(err){throw err}
                    else
                    {
                        let act = 'SELECT citas_activas_masc.*, servicios.nombre as servicio,mascotas.nombre as paciente, mascotas.avatar FROM citas_activas_masc, mascotas,usuarios, servicios WHERE citas_activas_masc.id_mascotas = mascotas.id_mascotas AND citas_activas_masc.id_servicios = servicios.id_servicios AND mascotas.id_usuarios = usuarios.id AND servicios.id_provedores = ? AND usuarios.cedula = ?;';
                        connection.query(act,[usu.ser, usu.id],(err,resm)=>{
                            if(err){throw err}
                            else
                            {
                              console.log('/*/*/*/*MASCOTAS/*/*/*/*/*/');
                              console.log(row1)
                              // console.log(resm);
                              if(JSON.stringify(resm)!='[]')
                              {
                                // row = {activas:true};
                                resm[0].activas = true;
                                // console.log(resm[0]);
                                res1.push(resm[0]);
                                for (var i = 0; i < row1.length; i++) {
                                  res1.push(row1[i]);
                                }
                                // console.log('/*/*/*/*/Despues del if*/*/*/*/*/');
                                // console.log(res1);

                              }
                              else
                              {
                                if(JSON.stringify(row1)=='[]')
                                {
                                    res1.push( {activas:false});
                                }
                                else
                                {
                                  for (var i = 0; i < row1.length; i++) {
                                    res1.push(row1[i]);
                                  }
                                }

                              }
                              // cont.masc = 'hola';
                              rest.push(res);
                              rest.push(res1);

                                // row.push({mascotas:res})
                                // row.file = [res];
                                callback(null,rest);

                            }
                        });

                    }
                  });

    }
  })

};




module.exports = citasModel;
