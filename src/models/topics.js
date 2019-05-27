let mysql =require('mysql');
let config = require('../config');


connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let topicmodule = {};

topicmodule.topicsProvedor=(id,callback)=>{
  let tp = ["GLOBAL","ADMIN"];
  let p = 1;
  if(connection)
  {
    var sql = 'SELECT categoria.nombre FROM provedores,servicios,servicios_categoria,categoria WHERE provedores.id_provedor = servicios.id_provedores AND servicios.id_servicios = servicios_categoria.servicios_idservicios AND servicios_categoria.categoria_idcategoria = categoria.id_categoria AND provedores.id_provedor = ?;';
    connection.query(sql,id,(err,cls)=>{
      if(err){throw err}
      else{
        for (var i = 0; i < cls.length; i++) {
          // cls[i]
          tp.push("'"+cls[i].nombre+"'");
          if(p==cls.length)
          {
            // console.log(tp);
          callback(null,tp);
          }
          p++;
        }

      }
    });
  }
};


module.exports = topicmodule;
