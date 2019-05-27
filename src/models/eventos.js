let mysql =require('mysql');
let config = require('../config');
var moment = require('moment');
var eject = require('./ejecucion');
var email = require('./email');
var pushs = require('./push');
var sleep = require('system-sleep');


connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let eventmodule = {};

// retorna todos los eventos
eventmodule.darEvents = (callback) =>{
if(connection)
{
var sql = 'SELECT events.*, servicios.nombre FROM events, servicios WHERE events.servicios_idservicios = servicios.id_servicios;';
connection.query(sql,(err,row)=>{
if(err){throw err}
else
{
callback(null,row);
}
});
}
};
//retorna una lista de eventos por ususario
eventmodule.darEventsIdUsuario=(id,callback)=>{
if(connection)
{
  var p = 1;
var sql = 'SELECT events.*, servicios.nombre, servicios.direccion FROM events, servicios WHERE events.servicios_idservicios = servicios.id_servicios AND events.usuarios_id = ? ORDER BY events.start asc;';
connection.query(sql,id,(err,row)=>{
if(err){throw err}
else
{
////console.lo.log('prueba de git');
//console.lo.log(moment().utc().format());
//console.lo.log(row.length);
//row = row[0];
////console.lo.log(row);
if(row.length==0)
{
  callback(null,row)
}
for (var i = 0; i < row.length; i++)
{
  var s = row[i];
  s.start =  moment(s.start).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
  s.end = moment(s.end).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
  //console.lo.log(s);
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

eventmodule.darEventsBenf = (id,callback)=>{
  if(connection)
  {
    //console.lo.log(id);
    var sql = "SELECT events.*, servicios.nombre as nombre, CONCAT(usuarios.nombre,' ',usuarios.apellidos) as nombreU, servicios.direccion  FROM events, servicios,usuarios WHERE events.servicios_idservicios = servicios.id_servicios AND usuarios.id = events.usuarios_id and usuarios.usuariosBf_id = ?"
    connection.query(sql,[id],(err,row)=>{
      if(err)
      {
        throw err
      }
      else
      {
        for (var i = 0; i < row.length; i++)
        {
          var s = row[i];
          s.start =  moment(s.start).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          s.end = moment(s.end).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          //console.lo.log(s);
        }
        callback(null,row);
      }
    });
  }
};

eventmodule.darEventsMasc = (id,callback)=>{
  if(connection)
  {
    //console.lo.log(id);
    var sql = 'SELECT events_masc.*, servicios.nombre as nombres, mascotas.nombre as nombreU FROM events_masc, servicios, mascotas WHERE events_masc.id_servicios = servicios.id_servicios and events_masc.id_mascotas = mascotas.id_mascotas AND mascotas.id_usuarios = ? ;';
    connection.query(sql,[id],(err,row)=>{
      if(err)
      {
        throw err
      }
      else
      {
        //console.lo.log('aqui llege');
        for (var i = 0; i < row.length; i++)
        {
          var s = row[i];
          s.start =  moment(s.start).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          s.end = moment(s.end).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          //console.lo.log(s);
        }
        callback(null,row);
      }
    });
  }
};



//retorna una lista de eventos por servicio
eventmodule.darEventsIdService = (ids,callback)=>{
if(connection)
{
var sql = 'SELECT events.*, servicios.nombre FROM events, servicios WHERE events.servicios_idservicios = servicios.id_servicios AND events.servicios_idservicios = ?;';
connection.query(sql,ids,(err,row)=>{
if(err){throw err}else{callback(null,row);}
})
}
};

//agrega los eventos a la base de datos
eventmodule.agregarEvento = (events,callback) =>{
if(connection){
  console.log('*/*/*/*/*/*/*/*/*/*');
console.log(events);
//console.lo.log(events.servicio+'///////////*************************');
if(events.mascota==true)
{
  var sql = 'INSERT INTO events_masc(color,start,end,id_mascotas,id_servicios) VALUES (?,?,?,?,?)';
  var valida = 'SELECT createdAT,start FROM events_masc where id_mascotas = ? and DATE(start) = DATE(?); ';
}
else
{
  var sql = 'INSERT INTO events(color,start,end,usuarios_id,servicios_idservicios) VALUES (?,?,?,?,?)';
  var valida = 'SELECT createdAT,start FROM events where usuarios_id = ? and DATE(start) = DATE(?); ';
}

connection.query(valida,[events.usuario,events.start],(err,res)=>{
if(err){throw err}
else {

// res = res[0];
console.log('/*/*/*/*/RESPUESTA DE AGREGAR CITASC /*/*/*/*/*/');
console.log(res);
if(JSON.stringify(res)=='[]')
{
connection.query(sql,[events.color,events.start,events.end,events.usuario,events.servicio],(err,row)=>{
if(err){throw err}
else
{
var corr = {
  id_serv: events.servicio,
  start: events.start,
  id_usu:events.usuario,
  masc:events.mascota

};
// eject.correCita(corr,(err,resps)=>{
var psh = 'SELECT members.tokenpsh, members.email, servicios.nombre FROM members,provedores,servicios WHERE provedores.members_id = members.id AND servicios.id_provedores = provedores.id_provedor AND servicios.id_servicios = ?;';
connection.query(psh,[events.servicio],(err,rowph)=>{
  if(err){throw err}
  else
{

  email.emailCitaPr(corr,(err,rowss)=>{
      // console.log(psh);
    // console.log('enviando e-mail');
    // console.log('/////////////////////*******************//////////////////');
    rowph = rowph[0];
    // console.log('cDN3ljN80nY:APA91bE23ly2oG-rzVAI8i_oiPMZI_CBdU59a6dVznyjdK9FyGi2oPI_sQIQJTAV-xp6YQ6F7MlYYW_7Br0nGdbTIuicwIP4oR99Mf8KysM1ZEJiCmASeyxnOHO4ajgqTDIX6prWpQpG');
    console.log('ROW DE LA BASE DE DATOS');
    console.log(rowph);
    var disp = {
      to:rowph.tokenpsh,
      body:'Tienes una nueva cita de '+rowph.nombre+', a traves de nuesta app de descuentos medicos para el: '+moment(events.start).format('DD-MM-YYYY')+' a las: '+moment(events.start).format('HH:mm a')+' por favor revisa tus citas en la aplicacion',
      title:'NUEVA CITA'
    };
    // console.log(disp);
  pushs.sendPush(disp,(err,respus)=>{
      sleep(1000);
    var med = 'SELECT members.tokenpsh, servicios.nombre FROM servicios,medicos,members WHERE servicios.medico_id = medicos.medico_id AND medicos.members_id = members.id AND servicios.id_servicios = ?;';
    connection.query(med,[events.servicio],(err,rowm)=>{
      if(err){throw err}
      else {
        rowm = rowm[0];
        disp = {
          to:rowm.tokenpsh,
          body:'Tienes una nueva cita de '+rowm.nombre+', a traves de nuesta app de descuentos medicos para el: '+moment(events.start).format('DD-MM-YYYY')+' a las: '+moment(events.start).format('HH:mm a')+' por favor revisa tus citas en la aplicacion',
          title:'NUEVA CITA'
        };
        pushs.sendPush(disp,(err,respus)=>{
          sleep(1000);
          console.log(respus);
          console.log('enviando respuesta');
          callback(null,[{'agregado':true, 'push':respus}]);
        });
      }
    });
  });

  });
}
});

// });

}
});

}
else{
  //console.lo.log('vacio');
callback(null,[{'reservado':true}]);}
}

});
}
};





// ELIMINA UN EVENTO DE LA BASE DE DATOS
eventmodule.eliminarEvento = (ev,callback) =>{
  let id = ev.id;
  let masc = ev.masc;
var now = moment().format('YYYY-MM-DD hh:mm:ss a');
//console.lo.log('hoy'+now);
if(connection)
{
if(masc == true || masc == 'true' )
{
  var valida = 'SELECT start FROM events_masc WHERE id_eventos = ?';
  var del = ' DELETE FROM events_masc where id_eventos = ?';
  var psh ='SELECT members.tokenpsh, servicios.nombre, events_masc.start FROM members, provedores, servicios, events_masc WHERE members.id = provedores.members_id AND servicios.id_provedores = provedores.id_provedor AND events_masc.id_servicios = servicios.id_servicios AND events_masc.id_eventos = ?;';
}
else
{
var valida = 'SELECT start FROM events WHERE id_eventos = ?';
var del = ' DELETE FROM events where id_eventos = ?';
var psh = 'SELECT members.tokenpsh, servicios.nombre, events.start FROM members, provedores, servicios, events WHERE members.id = provedores.members_id AND servicios.id_provedores = provedores.id_provedor AND events.servicios_idservicios = servicios.id_servicios AND events.id_eventos = ?;';
}
connection.query(valida,id,(err,resp)=>
{
resp = resp[0];
resp = resp.start
resp = moment(resp).format('YYYY-MM-DD hh:mm:ss a');
//console.lo.log('original'+resp);
resp =  moment(resp).subtract(1, 'day').format('YYYY-MM-DD hh:mm:ss a');
//console.lo.log('resta'+resp);
if(moment(now).isSameOrBefore(resp))
{
  let env = {
    id:id,
    sql:psh
  };
eject.eliminaNotifica(env,(err,rowss)=>{
  if(rowss.borrado==true)
  {
    connection.query(del,[id],(err,row)=>{
    if(err){throw err}
    else
    {
      // console.log('/*/*/*/*/*/*/*/*/*Respuesta la eliminacion de la cuita');
      // console.log(row);
        callback(null,{'borrado':true})
    }
    });

  }
});
}
else
{

callback(null,{'borrado':false})

}

});
}
};

eventmodule.delEventProv = (ev,callback)=>{
if(connection)
{
  //selecciona el id del servicio con el id de los provedores
  if(ev.cate == 20 || ev.cate == '20')
  {
    //console.lo.log('mascota');
    var sel = 'SELECT servicios.id_servicios FROM servicios,provedores, events_masc where servicios.id_provedores = provedores.id_provedor and servicios.id_servicios = events_masc.id_servicios and provedores.id_provedor = ? and events_masc.id_eventos = ? limit 1;';
    var sql = 'DELETE FROM events_masc where events_masc.id_eventos = ? AND events_masc.id_servicios = ? ;';
    var psh = 'SELECT members.tokenpsh, servicios.nombre, events_masc.start FROM events_masc, servicios, provedores, members WHERE  events_masc.id_servicios = servicios.id_servicios AND servicios.id_provedores = provedores.id_provedor AND provedores.members_id = members.id AND events_masc.id_eventos = ?;';
  }
  else
  {
    //console.lo.log('humano');
    var sel = 'SELECT servicios.id_servicios FROM servicios,provedores, events where servicios.id_provedores = provedores.id_provedor and servicios.id_servicios = events.servicios_idservicios and provedores.id_provedor = ? and events.id_eventos = ? limit 1 ';
    var sql = 'DELETE FROM events where events.id_eventos = ? AND servicios_idservicios = ? ;';
    var psh = 'SELECT events.start, servicios.nombre, provedores.nombre,members.tokenpsh FROM members, events,provedores, servicios, usuarios WHERE provedores.id_provedor = members.id AND provedores.id_provedor = servicios.id_provedores AND events.usuarios_id = usuarios.id AND events.servicios_idservicios = servicios.id_servicios and events.id_eventos = ?;';
  }

connection.query(sel,[ev.idp,ev.ide],(err,row)=>{
if(err){throw err}
else
{
row = row[0];
console.log(row);
let evs = {
  id:ev.ide,
  sql:psh
};
eject.eliminaNotifica(evs,(err,rowss)=>{
  if(rowss.borrado==true)
  {
    connection.query(sql,[ev.ide,row.id_servicios],(err,row)=>{
    if(err){throw err}
    else
    {
    callback(null,[{'borrado':true}])
    }
    });
  }
});
}
});

}
};


eventmodule.citaHistorial = (callback)=>{
if(connection)
{
var h = moment().format('YYYY-MM-DD HH:mm:ss');
var citas = 'insert into historial SELECT * FROM events WHERE end < ?;'
var del = 'DELETE FROM events WHERE end < ?;'
connection.query(citas,[h],(err,res)=>{
if(err){throw err}
else
{
connection.query(del,[h],(err,resp)=>{
if(err){throw err}
else
{
//console.lo.log(h);
callback(null,'eliminado');
}
});
}
});
}
};

eventmodule.citaHistorialM = (callback)=>{
if(connection)
{
var h = moment().format('YYYY-MM-DD HH:mm:ss');
var citas = 'insert into historial_masc SELECT * FROM events_masc WHERE end < ?;'
var del = 'DELETE FROM events_masc WHERE end < ?;'
connection.query(citas,[h],(err,res)=>{
if(err){throw err}
else
{
connection.query(del,[h],(err,resp)=>{
if(err){throw err}
else
{
//console.lo.log(h);
callback(null,'eliminado');
}
});
}
});
}
};



eventmodule.eventsCalendar = (ev,callback) =>{
  let res =[];
  if(connection)
  {
    //console.lo.log(ev.id_mascotas);
    if(ev.id_mascotas==20 || ev.id_mascotas=='20')
    {
      //console.log('dentro del if');
      var sql = 'SELECT  events_masc.id_eventos, mascotas.*,events_masc.id_mascotas, mascotas.nombre as title ,start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events_masc, mascotas WHERE events_masc.id_mascotas = mascotas.id_mascotas AND MONTH(start) = ? AND YEAR(start) = ? and id_servicios = ?'
    }
    else
    {
      //console.log('no entro al if');
      var sql = 'SELECT events.id_eventos, usuarios.*,events.usuarios_id, CONCAT(usuarios.nombre," ",usuarios.apellidos) as title, start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events, usuarios WHERE events.usuarios_id = usuarios.id AND MONTH(start) = ? AND YEAR(start) = ? and servicios_idservicios = ?;'
    }


  connection.query(sql,[ev.mes,ev.anio,ev.id_servicio],(err,row)=>{
    if(err)
    {
      throw err;
    }
    else
    {
      if(JSON.stringify(row)=='[]')
      {

      }
      else
      {
        for (var i = 0; i < row.length; i++) {
          console.log(row[i]);
          let vari = row[i];
          vari.start = moment(vari.start).utc(-5).format();
          vari.end =  moment(vari.end).utc(-5).format();
          res.push(vari);
        }
        callback(null,res);
      }

    }
  });
  }
};



module.exports = eventmodule;
