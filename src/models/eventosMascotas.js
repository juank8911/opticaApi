let mysql =require('mysql');
let config = require('../config');
var moment = require('moment');


connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let eventMascModule = {};



eventMascModule.darEventsMasc = (id,callback)=>{
  if(connection)
  {
    var p = 1;
    // //console.log(.log(id);
    var sql = 'SELECT events_masc.id_eventos,events_masc.color,events_masc.start,events_masc.end,events_masc.id_mascotas as usuarios_id,events_masc.id_servicios,servicios.nombre as nombre,servicios.direccion, mascotas.nombre as nombreU FROM events_masc, servicios, mascotas WHERE events_masc.id_servicios = servicios.id_servicios and events_masc.id_mascotas = mascotas.id_mascotas AND mascotas.id_usuarios = ? ;';
    connection.query(sql,[id],(err,row)=>{
      if(err)
      {
        throw err
      }
      else
      {
        // //console.log(.log('***********///////////');
        // //console.log(.log(row);
        ////console.log(.log('aqui llege');
        //console.log(.log(row.length);
        if(row.length==0)
        {
          callback(null,row)
        }
        for (var i = 0; i < row.length; i++)
        {
          var s = row[i];
          // s.prueba = 'prueba';
          //s.usuarios_id = s.id_mascotas;
          s.start =  moment(s.start).utc(+5).format('YYYY-MM-DD hh:mm a');
          s.end = moment(s.end).utc(+5).format('YYYY-MM-DD hh:mm a');
          // //console.log(.log(s);
          row[i]=s;
          // //console.log(.log(s);
          if(row.length==p)
          {
            callback(null,row);
          }
          p++;
        }

      }
    });
  }
};

eventMascModule.pruebaMasc = (id,callback)=>{
  callback(true);
};

module.exports = eventMascModule;
