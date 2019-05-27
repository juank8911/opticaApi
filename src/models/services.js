let mysql = require('mysql');
let config = require('../config');
let jwts = require('jsonwebtoken');
let fs = require('fs');
let imgmodule = require('./imagenes')
var rn = require('random-number');
var ba64 = require("ba64");
var regH = require("./horario");
var diasH = require("./dias");
var hora = require('./horario');
var fotoss = require('./fotos');
var eject = require('./ejecucion');
var async = require("async");

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let servmodule = {};

// guardaba servicios pero no funciona
servmodule.save = (data , callback ) => {
  // console.log('adentro del save nuevo vamo a ver');
  console.log(data.medico_id);
  img = data.foto64;
  nombre = data.nombre;
  horario = data.horario;
  var idInd = 0;
  var respuesta = [];
  var horarios;
  var p=0;
  var mensaje = [];
  var cliente = data.precio*((100-data.descuento)/100);
  var sql = 'INSERT INTO servicios(nombre,descripcion,duracion,max_citas_ves,video,precio,descuento,precio_cliente_prevenir,direccion,id_provedores,municipio_id_municipio,medico_id) values (?,?,?,?,?,?,?,?,?,?,?,?);';
  connection.query(sql,[data.nombre,data.descripcion,data.duracion,data.max_citas,data.video,data.precio,data.descuento,cliente,data.direccion,data.id_prov,data.muni,data.medico_id],(err,res)=>{
  if(err)
  {
  throw err
  }
  else
  {
    // id de insercion de el servicios
    var idinsert = res.insertId;
    idInd = res.insertId;
    //obteniendo el horario
    horarios = horario[0];
    horarios = horarios.horario;
    // console.log(horarios);
        for (var i = 0; i < horarios.length; i++)
          {
              var horas = horarios[i];
                //console.log(horas.length);
                if(horas.m_de!=null || horas.t_de!=null )
                {
                  horas.id=idinsert;
                  // console.log('/////////////////******************Horario******************////');
                  // console.log(horas);
                    regH.agregarHorario(horas,(err,resp)=>{
                    //console.log('////////////////*************HORARIO AGREGADO////////////*****************');
                    respuesta.push(resp);
                    });
                }
          }
          sqlss = 'INSERT INTO servicios_categoria (servicios_idservicios, categoria_idcategoria) VALUES (?, ?)';
          console.log('id_Servicio'+idInd+'/*/*/*'+'Id Cate'+data.categoria);
          connection.query(sqlss,[idInd,data.categoria],(err,row)=>{
          if(err)
          {
          throw err;
          }
          else
          {
            var p = 1;
            var respons = [];
            for (var i = 0; i < img.length; i++)
            {
            var foto = img[i];
            var options = {
            min:  00001
            , max:  999999
            , integer: true
            }
            var rand = rn(options);
            var name = data.nombre +'_'+rand+data.duracion+'_'+idinsert+rand
            var fotos = foto.base64Image;
            var pathView = "/servicios/"+name;
            var newPath = "src/public/servicios/"+name;
            pathView = pathView+".jpeg";
            ba64.writeImageSync(newPath, fotos);
            var fotoe = {
              nombre:name,
              id:idinsert,
              pathV:pathView,
              pathI:newPath
            };
            // console.log(fotoe);
            fotoss.fotosSer(fotoe,(err,res)=>{
                  // console.log(res);
                  if(p==img.length)
                  {
                  // console.log(respons[1]);
                  var mensaje = [{'agregado':true}];
                  mensaje.fotos = respons;

                  callback(null,mensaje);
                  }
                  p++;
            });
          }
          }
  });
}
});
};



//da servicios por provedor para el listado de el provedor al agregar un servicio o listarlos
servmodule.DarServiceUsu = (ids,callback) => {
// console.log('prueba de servicios')
if(connection)
{
var sql = 'SELECT servicios.*, categoria.nombre as categoria,categoria.id_categoria FROM servicios,servicios_categoria,categoria WHERE servicios_categoria.servicios_idservicios = servicios.id_servicios and servicios_categoria.categoria_idcategoria = categoria.id_categoria and id_provedores = ? ORDER BY createdupdate';
var sel = 'SELECT comentarios.*,usuarios.avatar, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombre FROM comentarios,servicios,usuarios WHERE comentarios.servicios_idservicios = servicios.id_servicios AND usuarios.id = comentarios.usuarios_id AND servicios.id_servicios = ? ORDER BY comentarios.createdAt asc LIMIT 3;';
connection.query(sql,[ids],(err,row)=>{
if(err)
{

}
else
{
  if (JSON.stringify(row)!='[]')
  {

  var p =1;
  var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
  var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
  var jsonServ = [];
  //  console.log('fuera de la consulta')
  var jsonServ = [];
  row.forEach((serv)=>{
  // console.log(serv.idservicios)
  var id = serv.id_servicios;
  console.log(id);
  connection.query(sql1,[id],(err,ft)=>{
    if(err){throw err}
    else
    {
      console.log(ft);
      ft = ft[0];
      serv.foto = ft.ruta;
    }
    });
  connection.query(sql,[id],(err,resp)=>{
  // console.log('dentro de la consulta '+id)
  if(err)
  {
    throw err
  }
  else
  {
  serv.fotos = resp;
  //console.log(resp);
  connection.query(sel,[id],(err,com)=>{
    if(err){throw err}
    else
    {
      serv.coment = com;
      jsonServ.push(serv);
      if(p>=row.length)
      {
      callback(null,jsonServ);
      //console.log('find de la consulta');
      }
      p++
    }
  });
  }
  });
  });
  }
  else
  {
  callback(null,[{'vacio':true}])
  }
}
});

}
// console.log('prueba');

};




// devuelve los servicios para el ususario
servmodule.pruebaServicio = (callback)=>{
// console.log('prueba de servicios')
if(connection)
{
  // console.log('************///**/*/*///////////////*/*/*/*/*/*/*/*/*/*/*/');
var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria  FROM servicios, categoria, servicios_categoria WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios and categoria.id_categoria = servicios_categoria.categoria_idcategoria';
connection.query(sql,(err,row)=>{
if(err)
{

}
else
{
var p =1;
var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';

var jsonServ = [];
//  console.log('fuera de la consulta')
var jsonServ = [];
row.forEach((serv)=>{
// console.log(serv.idservicios)
var id = serv.id_servicios;
//console.log(id);
connection.query(sql,[id],(err,resp)=>{
// console.log('dentro de la consulta '+id)
if(err)
{
 throw err;
}
else
{
serv.foto = resp;
//console.log(resp);
// console.log('/////////******* valor p '+p)
//console.log('/////////******* valor row '+row.length);
connection.query(sel,[id],(err,com)=>{
  if(err){throw err}
  else
  {
    serv.coment = com;
    jsonServ.push(serv);
    if(p>=row.length)
    {
    callback(null,jsonServ);
    //console.log('find de la consulta');
    }
    p++
  }
});

}
});
});

}
});

}
//  console.log('prueba');
};


// da los servicios para el ususario
servmodule.darServicios = (callback)=>{
var jsonServicios=[];
if(connection)
{
// console.log('servicios/2do rchivo');
var sql = 'SELECT servicios.* FROM servicios ';
connection.query('SELECT servicios.* FROM servicios',(err,row)=>{
if(err)
{
// console.log('error');
var mensaje = {'mensaje':'error al cargar servicios','carga':'false'};
callback(null,mensaje);
}
else
{
//jsonServicios = row;
if(row.length>=1)
{
imgmodule.darImagenesServ(row,(err,resp)=>
{
//console.log(resp);
callback(null,resp);

});
}
}
});

}

};
// da servicios por el id de del servicio
servmodule.darServiciosIdS = (id,callback)=>{
 console.log('prueba de servicios')
if(connection)
{
var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria, municipio WHERE municipio.id_municipio = servicios.municipio_id_municipio and servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria and servicios.id_servicios = ?';
var sel = 'SELECT comentarios.*,usuarios.avatar, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombre FROM comentarios,servicios,usuarios WHERE comentarios.servicios_idservicios = servicios.id_servicios AND usuarios.id = comentarios.usuarios_id AND servicios.id_servicios = ? ORDER BY comentarios.createdAt asc LIMIT 3;';
connection.query(sql,[id],(err,row)=>{
if(err)
{
throw err;
}
else
{
console.log(row);
var p =1;
var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
var jsonServ = [];
//  console.log('fuera de la consulta')
var jsonServ = [];
row.forEach((serv)=>{
// console.log(serv.idservicios)
var id = serv.id_servicios;
//console.log(id);
connection.query(sql,[id],(err,resp)=>{
// console.log('dentro de la consulta '+id)
if(err)
{
throw err
}
else
{
  // console.log(row);
  if (JSON.stringify(row)!='[]')
  {
  var p =1;
  var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
  var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
  var jsonServ = [];
  //  console.log('fuera de la consulta')
  var jsonServ = [];
  row.forEach((serv)=>{
  // console.log(serv.idservicios)
  var id = serv.id_servicios;
  //console.log(id);
  connection.query(sql1,[id],(err,ft)=>{
    if(err){throw err}
    else
    {
      ft = ft[0];
      serv.foto = ft.ruta;
    }
    });
  connection.query(sql,[id],(err,resp)=>{
  // console.log('dentro de la consulta '+id)
  if(err)
  {

  }
  else
  {
  serv.fotos = resp;
  //console.log(resp);
  connection.query(sel,[id],(err,com)=>{
    if(err){throw err}
    else
    {
      serv.coment = com;
      jsonServ.push(serv);
      if(p>=row.length)
      {
      callback(null,jsonServ);
      //console.log('find de la consulta');
      }
      p++
    }
  });
  }
  });
  });
  }
  else
  {
  callback(null,[{'vacio':true}])
  }
}
});
});

}
});

}
};


// da servicios por el id de del servicio
servmodule.darServiciosMunCat = (ids,callback)=>{
//console.log('////////////////Servicios ')
var idm = ids.idm;
var idc = ids.idc;

if(connection)
{
if(idc==0)
{
//console.log('////////////////Servicios por muunicipios/////////// ')

if(idc!=20)
{
  var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria, municipio WHERE municipio.id_municipio = servicios.municipio_id_municipio and servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND municipio.id_municipio= ? AND categoria_idcategoria != 20;';
  var sel = 'SELECT comentarios.*,usuarios.avatar, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombre FROM comentarios,servicios,usuarios WHERE comentarios.servicios_idservicios = servicios.id_servicios AND usuarios.id = comentarios.usuarios_id AND servicios.id_servicios = ? ORDER BY comentarios.createdAt asc LIMIT 3;';
}
else
{
  var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria, municipio WHERE municipio.id_municipio = servicios.municipio_id_municipio and servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND municipio.id_municipio= ?;';
  var sel ='SELECT comentarios_masc.*,mascotas.avatar, mascotas.nombre FROM comentarios_masc,servicios,mascotas WHERE comentarios_masc.id_servicios = servicios.id_servicios AND mascotas.id_mascotas = comentarios_masc.id_mascotas AND servicios.id_servicios = ?  ORDER BY comentarios_masc.createdAt asc LIMIT 3;';
}

connection.query(sql,[idm],(err,row)=>{
if(err)
{
throw err
}
else
{
// console.log(row);
if (JSON.stringify(row)!='[]')
{
var p =1;
var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
var jsonServ = [];
//  console.log('fuera de la consulta')
var jsonServ = [];
row.forEach((serv)=>{
// console.log(serv.idservicios)
var id = serv.id_servicios;
//console.log(id);
connection.query(sql1,[id],(err,ft)=>{
  if(err){throw err}
  else
  {
    ft = ft[0];
    serv.foto = ft.ruta;
  }
  });
connection.query(sql,[id],(err,resp)=>{
// console.log('dentro de la consulta '+id)
if(err)
{

}
else
{
serv.fotos = resp;
//console.log(resp);
connection.query(sel,[id],(err,com)=>{
  if(err){throw err}
  else
  {
    serv.coment = com;
    jsonServ.push(serv);
    if(p>=row.length)
    {
    callback(null,jsonServ);
    //console.log('find de la consulta');
    }
    p++
  }
});
}
});
});
}
else
{
callback(null,[{'vacio':true}])
}
}
});
}
else
{
  if(idc!=20)
  {
    var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria, municipio WHERE municipio.id_municipio = servicios.municipio_id_municipio and servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND municipio.id_municipio= ? and  categoria.id_categoria = ? AND categoria_idcategoria != 20;';
    var sel = 'SELECT comentarios.*,usuarios.avatar, usuarios.nombre FROM comentarios,servicios,usuarios WHERE comentarios.servicios_idservicios = servicios.id_servicios AND usuarios.id = comentarios.usuarios_id AND servicios.id_servicios = ? ORDER BY comentarios.createdAt asc LIMIT 3;';
  }
  else
  {
    var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria, municipio WHERE municipio.id_municipio = servicios.municipio_id_municipio and servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND municipio.id_municipio= ? and  categoria.id_categoria = ?  ;';
    var sel ='SELECT comentarios_masc.*,mascotas.avatar, mascotas.nombre FROM comentarios_masc,servicios,mascotas WHERE comentarios_masc.id_servicios = servicios.id_servicios AND mascotas.id_mascotas = comentarios_masc.id_mascotas AND servicios.id_servicios = ?  ORDER BY comentarios_masc.createdAt asc LIMIT 3;';
  }
//console.log('////////////////Servicios por municipos y categorias ')
connection.query(sql,[idm,idc],(err,row)=>{
if(err)
{
throw err
}
else
{
// console.log(row);
if (JSON.stringify(row)!='[]')
{  var p =1;
var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
var jsonServ = [];
//  console.log('fuera de la consulta')
var jsonServ = [];
row.forEach((serv)=>{
// console.log(serv.idservicios)
var id = serv.id_servicios;
//console.log(id);

connection.query(sql1,[id],(err,ft)=>{
  if(err){throw err}
  else
  {
    ft = ft[0];
    serv.foto = ft.ruta;
  }
  });
connection.query(sql,[id],(err,resp)=>{
// console.log('dentro de la consulta '+id)
if(err)
{

}
else
{
serv.fotos = resp;
//console.log(resp);
connection.query(sel,[id],(err,com)=>{
  if(err){throw err}
  else
  {
    serv.coment = com;
    jsonServ.push(serv);
    if(p>=row.length)
    {
    callback(null,jsonServ);
    //console.log('find de la consulta');
    }
    p++
  }
});
}
});
});
}
else
{
callback(null,[{'vacio':true}])
}

}
});
}
}
};




// elimina un servicio de la base de datos
servmodule.deleteServ = (id,callback)=>{
if(connection)
{
  var sql4 = 'SELECT COUNT(id_eventos) as citas from events WHERE servicios_idservicios = ?';
  connection.query(sql4,[id],(err,row)=>{
    if(err){throw err}
    else
    {
      // console.log(row)
      row = row[0]
      if(row.citas>=1)
      {
        // console.log('no eliminado');
        callback(null,false);
      }
      else
      {
        hora.eliminarHorario(id,(err,res)=>{
        var sql1 = 'DELETE FROM fotos where servicios_idservicios = ?';
        var sql2 = 'DELETE FROM servicios_categoria WHERE servicios_idservicios = ?';
        var sql = 'DELETE FROM servicios WHERE id_servicios = ?';
        var sql3 = 'DELETE FROM medicos WHERE servicios_idservicios = ?';


        console.log('borrando fotos');
        connection.query(sql1,[id],(err,res)=>{
        if(err){throw err;}
        else {
        {
          console.log('borrando categoria');
        connection.query(sql2,[id],(err,res2)=>{
        if(err){throw err;}
        else
        {
          console.log('borrando servicio');
        connection.query(sql,[id],(err,row)=>{
        if(err)
        {
        callback(null,false);
        }
        else
        {
        callback(null,true);
        }
        });
        }
        });
        }
        }
        });
        });
      }
    }
  });
}
};

servmodule.onlyservicio = (id,callback) =>{
  let sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_cate, municipio.id_municipio as id_muni, departamento.id_departamento, departamento.nombre as depar, municipio.nombre as muni FROM servicios, servicios_categoria, categoria, municipio, departamento WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND municipio.id_departamento = departamento.id_departamento AND servicios.municipio_id_municipio = municipio.id_municipio AND servicios.id_servicios = ? ';
  connection.query(sql,[id],(err,row)=>{
    if(err){throw err}
    else
    {

      row = row[0];
      if(row.video !='')
      {
      // console.log(row);
      let video = 'https://youtu.be/'+row.video;
      row.video = video;
      }
      else
      {
        row.video = 'https://youtu.be/4Z4TxFh1tO8';
      }
      callback(200,row);
    }
  });
};

servmodule.updateServ = (serv,callback)=>{
if(connection)
{
  // console.log('////////***********');
  // console.log(serv);
var sql = 'UPDATE servicios SET nombre=?,descripcion=?,duracion=?,max_citas_ves =?,video=?,precio=?,descuento=?,precio_cliente_prevenir=?,direccion=? WHERE id_servicios=?;'
let sql1 = 'UPDATE servicios_categoria set categoria_idcategoria = ? where servicios_idservicios = ?';
connection.query(sql,[serv.nombre,serv.descripcion,serv.duracion,serv.max_citas,serv.video,serv.precio,serv.descuento,serv.precio_cliente_prevenir,serv.direccion,serv.id],(err,resp)=>{if(err){throw err}
else
{
connection.query(sql1,[serv.categoria,serv.id],(err,row)=>{
  if(err){throw err}
  else
  {
    callback(200,true);
  }
});
}
});
}
};


servmodule.serviciosMedicoProv = (ids,callback) =>{
  if(connection)
  {
    console.log('id uno a uno');
    // console.log(ids);
    let idser = 0;
    var servi
    var p =1;
    let respu = [];
    let serv = 'SELECT servicios.nombre,servicios.id_servicios,servicios.*, servicios_categoria.categoria_idcategoria FROM servicios, provedores, medicos, servicios_categoria  WHERE servicios.medico_id = medicos.medico_id AND servicios.id_provedores = provedores.id_provedor AND servicios_categoria.servicios_idservicios = servicios.id_servicios AND medicos.medico_id = ? AND provedores.id_provedor = ?;';
    var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
    connection.query(serv,[ids.id,ids.idp],(err,ser)=>{
      // console.log(ser);
      if(err){throw err}
      else
      {
        // ids.serv = ser;
        console.log(ser);
        // for (var i = 0; i < ser.length; i++) {
        //   idser = ser[i].id_servicios;
        //   servi = ser[i];
        //   // console.log(idser);
        //   connection.query(sql,[idser],(err,reft)=>{
        //     if(err){throw err}
        //     else
        //     {
        //       console.log(reft);
        //       // servi.foto = (retf);
        //       console.log(servi);
        //       console.log(p);
        //       console.log(ser.length);
        //       servi.foto = reft;
        //       respu.push(servi);
        //       if(p>=ser.length)
        //       {
        //         console.log('RESPUESTA');
        //         console.log(respu);
        //         callback(null,respu);
        //       }
        //         p++
        //     }
        //   });
        // }



        ser.forEach((data)=>{

          // console.log(data.id_servicios);
          connection.query(sql,[data.id_servicios],(err,row1)=>{
              // console.log('PRUEBOTA');
            data.fotos = row1;
            respu.push(data);
            console.log(respu.length);
          });
        });
        console.log('respuesta');
          callback(null,respu);

      }
    });
  }
};


servmodule.serviciosMedicoProvedor = (pr,callback) =>{
  if(connection)
  {
    let p = 1;
    // console.log('id uno a uno');
    // console.log(prs);
    let servi = [];
    let serv = 'SELECT servicios.nombre,servicios.id_servicios,servicios.*, servicios_categoria.categoria_idcategoria FROM servicios, provedores, medicos, servicios_categoria  WHERE servicios.medico_id = medicos.medico_id AND servicios.id_provedores = provedores.id_provedor AND servicios_categoria.servicios_idservicios = servicios.id_servicios AND medicos.medico_id = ? AND provedores.id_provedor = ?;';
          // console.log(pr);
          connection.query(serv,[pr.id,pr.idp],(err,row)=>{
            if(err){throw err}
            else
            {

              if (JSON.stringify(row)=='[]')
              {
                pr.serv = [];
                callback(null,pr)
              }
              else
                {

                for (var i = 0; i < row.length; i++)
                {

                  eject.fotosSer(row[i],(err,resp)=>{
                            // console.log(resp);
                              servi.push(resp);
                              // p++;
                              // console.log(p);
                              if(p>=row.length)
                              {
                                // console.log(servi);
                                pr.serv = servi;
                                callback(null,pr);
                              }
                              else
                              {
                                p++
                                // console.log(servi);
                                // console.log(p);
                              }
                          });

                }
                      //fin else
                }
            }


          });



          // async.mapLimit(urls, 5, async function(url) {
          //     const response = await fetch(url)
          //     return response.body
          // }, (err, results) => {
          //     if (err) throw err
          //     // results is now an array of the response bodies
          //     console.log(results)
          // })
//           // for use with Node-style callbacks...
//
//
// var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
// var configs = {};
//
// async.forEachOf(obj, (value, key, callback) => {
// fs.readFile(__dirname + value, "utf8", (err, data) => {
//   if (err) return callback(err);
//   try {
//       configs[key] = JSON.parse(data);
//   } catch (e) {
//       return callback(e);
//   }
//   callback();
// });
// }, err => {
// if (err) console.error(err.message);
// // configs is now a map of JSON data
// doSomethingWith(configs);
// });



  }
};


module.exports = servmodule;
