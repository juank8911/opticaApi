let mysql = require('mysql');
let config = require('../config');
let moment = require('moment');


connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let tituloModule = {};

tituloModule.agregarTitulos = (titulos,callback)=>{
  if(connection)
  {
    let p = 1;
    const f = [];
    let ins = 'INSERT INTO titulos (nombre, institucion, start, end, medico_id) VALUES (?, ?, ?, ?, ?);';
    for (var i = 0; i < titulos.length; i++) {
      let titulo = titulos[i];

      let dif = moment.duration(moment(titulo.end).diff(moment(titulo.start))).asYears();
      console.log(dif);
      if(dif<=0.0)
      {
        f.push({'fecha':false})
        if(p==titulos.length)
        {
          callback(null,f)
        }
        p++;
      }
      else
      {
        connection.query(ins,[titulo.nombreEstudio,titulo.nombreInstitucion,titulo.start,titulo.end,titulo.id],(err,res)=>{
          if(err){throw err}
          else
          {
            // console.log(res);
              f.push({'fecha':true})
              if(p==titulos.length)
              {
                callback(null,f)
              }
              p++;

          }
        });
      }


    }

  }
};


tituloModule.getTitulos = (id,callback)=>{
  if(connection)
  {
    let get = 'SELECT * FROM titulos WHERE medico_id = ?;';
    connection.query(get,[id],(err,row)=>{
      if(err){throw err}
      else
      {
        callback(null,row);
      }
    });
  }
};


module.exports = tituloModule;
