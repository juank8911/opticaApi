const mysql = require('mysql');
let config = require('../config');
let moment = require('moment');
let pushs = require('./push')
var sleep = require('system-sleep');
let ciclo = require('../controler/ciclos')
let email = require('./email');

connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let ejectModel = {};

//retorna una lista de horarios libres para la citas medicas
ejectModel.darLibres = (serv,callback)=>
{
console.log(serv);
if(connection)
{
var sql = 'SELECT servicios.max_citas_ves-count(events.id_eventos) as libres  FROM servicios, events WHERE servicios.id_servicios = events.servicios_idservicios and start = ? AND servicios_idservicios = ? ;'
connection.query(sql,[serv.hora,serv.id],(err,res)=>{
res = res[0];
res=res.libres;
console.log('///////////****//////////');
console.log(res);
serv.libres = res;
serv.disponible = true;
serv.hora = moment(serv.hora).format('hh:mm a');

console.log(serv);
callback(null,serv);
});

}
};

// retorna las citas por servicio cuando ahy una cita separada
ejectModel.darCitasOc = (serv,callback)=>
{
  console.log('************////////////////////');
console.log(serv);
if(connection)
{
  if(serv.cate==20)
  {
    console.log('Mascotas');
    var sql = "SELECT events_masc.id_eventos,events_masc.id_mascotas as usuarios_id,events_masc.id_servicios as servicios_idservicios,events_masc.start,events_masc.end, mascotas.nombre as nombres FROM events_masc, mascotas, servicios WHERE mascotas.id_mascotas = events_masc.id_mascotas AND servicios.id_servicios = events_masc.id_servicios AND start = ? AND events_masc.id_servicios = ?;"
  }
  else
  {
    console.log('usuario');
    var sql = "SELECT events.* ,concat(usuarios.nombre,' ',usuarios.apellidos) as nombres FROM servicios, events, usuarios WHERE servicios.id_servicios = events.servicios_idservicios and usuarios.id = events.usuarios_id and start = ? AND servicios_idservicios = ? ;"
  }

////console.lo.log(sql);
connection.query(sql,[serv.hora,serv.id],(err,res)=>{
//res;
//res=res.libres;
////console.lo.log('///////////****//////////');
////console.lo.log(res);
if(serv.cate==20)
{
  console.log('Contando mascotas');
  var sql1 = 'SELECT count(events_masc.id_eventos) as echas, servicios.max_citas_ves-count(events_masc.id_eventos) as libres  FROM servicios, events_masc WHERE servicios.id_servicios = events_masc.id_servicios and start = ? AND events_masc.id_servicios = ?;';
}
else
{
var sql1 = 'SELECT count(events.id_eventos) as echas, servicios.max_citas_ves-count(events.id_eventos) as libres  FROM servicios, events WHERE servicios.id_servicios = events.servicios_idservicios and start = ? AND servicios_idservicios = ? ';
}
connection.query(sql1,[serv.hora,serv.id],(err,resp)=>{
  console.log(resp);
resp = resp[0];
respu = resp.libres
console.log('*-4+4**/*/*/*/*/*/*/*/*/* respuesta de conteo');
console.log(resp);
// serv.echas = resp;
serv.citas = res;
if(respu<=0)
{
serv.disponible = false;
serv.echas =  resp.echas;

}
else
{
serv.disponible = true;
serv.echas =  resp.echas;
}
serv.hora = moment(serv.hora).format('hh:mm a');
////console.lo.log(serv);
callback(null,serv);
});
});

}
}

ejectModel.pruebas = (callback)=>{
var fecha1 = moment('1989-11-11'); //fecha de nacimiento
var fecha2 = moment('2018-11-12');  //fecha actual

//console.lo.log(fecha2.diff(fecha1, 'years.days'), ' años de diferencia');
};


ejectModel.eliminaNotifica = (env,callback) =>
{
  console.log(env);
  // sleep(5000);
  connection.query(env.sql,[env.id],(err,rowph)=>{
    if(err){throw err}
    else
    {
        console.log(rowph);
        // console.log('enviando e-mail');
        // console.log('/////////////////////*******************//////////////////');
        rowph = rowph[0];
        // console.log('cDN3ljN80nY:APA91bE23ly2oG-rzVAI8i_oiPMZI_CBdU59a6dVznyjdK9FyGi2oPI_sQIQJTAV-xp6YQ6F7MlYYW_7Br0nGdbTIuicwIP4oR99Mf8KysM1ZEJiCmASeyxnOHO4ajgqTDIX6prWpQpG');
        console.log('ROW DE LA BASE DE DATOS');
        console.log(rowph);
        var disp = {
          to:rowph.tokenpsh,
          body:'Su cita de '+rowph.nombre+', separada para el dia: '+moment(rowph.start).format('DD-MM-YYYY')+' a las: '+moment(rowph.start).format('HH:mm a')+' fue cancelada por inconvenientes ajenos a nostros por favor revisa tus citas',
          title:'CITA CANCELADA'
        };
        // console.log(disp);
      pushs.sendPush(disp,(err,respus)=>{

        console.log(respus);
        console.log('enviando respuesta');
        callback(null,{'borrado':true});
      });


    }
  });
};


ejectModel.notificaCitaHumanos = (callback) =>{
if(connection)
{
    var disp = {};
  let hora = moment().add(3,'hours').format('YYYY-MM-DD HH:mm:ss');

  // let hora = '2018-11-19 16:00:00';
  console.log('Inicio de notificaciones a los usuarios ////////////********************');
  console.log(hora);
  var sele = 'SELECT events.usuarios_id, events.start, CONCAT(jhg.nombre," ",jhg.apellidos) as nombres,servicios.nombre, if(jhg.usuariosBf_id !="",(SELECT members.tokenpsh FROM usuarios as pr, usuarios as bf,members WHERE pr.id = bf.usuariosBf_id AND members.id = pr.members_id AND bf.id = jhg.id ), (SELECT members.tokenpsh FROM members,usuarios WHERE members.id = usuarios.id AND usuarios.id = jhg.id)) as tokenpsh  FROM events, usuarios as jhg, servicios where jhg.id = events.usuarios_id AND servicios.id_servicios = events.servicios_idservicios AND start = ?;';
  connection.query(sele,[hora],(err,row)=>{
    if(err){throw err}
    else
    {
      for (var i = 0; i < row.length; i++) {
        // console.log('eject de row');
      // console.log(row[i]);
      let rowps = row[i];
      disp = {
        to:rowps.tokenpsh,
        body:'No olvide su cita de '+rowps.nombre+' para '+rowps.nombres+', separada para el dia: '+moment(rowps.start).format('DD-MM-YYYY')+' a las: '+moment(rowps.start).format('hh:mm a')+' por favor verifique su horario en la aplicacion y en caso de no asisitir comuniquese con el centro prestador del servicio',
        title:'RECORDATORIO DE CITA'
      };
      // console.log(disp);
      pushs.sendPush(disp,(err,respus)=>{
        console.log(respus);
        // console.log('enviando respuesta');
      });

      }
      callback(null,{'notificado':true});
      // console.log(hora);
    }
  });

}

};

ejectModel.notiCitasPeluditos = (callback)=>{
if(connection)
{
  let disp = {};

  let hora = moment().add(3,'hours').format('YYYY-MM-DD HH:mm:ss');

  // let hora = '2018-11-19 16:00:00';
  console.log(hora);
  var sele ='SELECT events_masc.start, mascotas.nombre as peludito, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombres ,servicios.nombre , members.tokenpsh FROM events_masc, mascotas, usuarios, members, servicios WHERE mascotas.id_mascotas = events_masc.id_mascotas AND mascotas.id_usuarios = usuarios.id AND usuarios.members_id = members.id AND servicios.id_servicios = events_masc.id_servicios AND events_masc.start = ?;';
  connection.query(sele,[hora],(err,row)=>{
    if(err){throw err}
    else
    {
      if(row.length>0)
      {
        for (var i = 0; i < row.length; i++)
        {
          let rowps = row[i];
          disp = {
            to:rowps.tokenpsh,
            body:'Señor@ '+rowps.nombres+' no olvide su cita de '+rowps.nombre+' a para su peludit@ '+rowps.peludito+', separada para el dia: '+moment(rowps.start).format('DD-MM-YYYY')+' a las: '+moment(rowps.start).format('hh:mm a')+' por favor verifique su horario en la aplicacion y en caso de no asisitir comuniquese con el centro prestador del servicio',
            title:'RECORDATORIO DE CITA'
          };
          pushs.sendPush(disp,(err,respus)=>{
            console.log(respus);
            // console.log('enviando respuesta');
          });
        }
      }
      callback(null,{'notificado':true});
    }
  });

}

};

ejectModel.histrialBenf = (row,callback)=>{
  console.log(row);
  let pens = [];
  let p = 1;
  if(connection)
  {
    let sel = 'SELECT historial.*, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombres, servicios.nombre as servicio FROM historial, usuarios, servicios WHERE usuarios.id = historial.usuarios_id AND servicios.id_servicios = historial.servicios_idservicios AND usuarios_id = ? ORDER BY historial.calificada asc, historial.start asc; ;';
    for (var i = 0; i < row.length; i++) {
      console.log(row[i]);
      connection.query(sel,[row[i]],(err,resp)=>{
        console.log('en historial ejecutando');
        // console.log(resp);
        for (var k = 0; k < resp.length; k++) {
          resp[k]
          pens.push(resp[k]);
          console.log(p+'  '+row.length);
          if(p==row.length)
          {
            console.log(pens);
            callback(null,pens);
          }
        }
    p++;

      });

    }
  }

};

ejectModel.cambioSalt = (id,callback)=>{
  if(connection)
  {
    var sel = 'SELECT * FROM members WHERE id = ? ;';
    var upd = 'UPDATE members SET salt = ? WHERE (id = ?);';
    connection.query(sel,[id],(err,res)=>{
      if(err){throw err}
      else
      {
      res = res[0];
      ciclo.generaSalt((err,gen)=>{
        cod = gen;
      });
      var usu = {
        to:res.email,
        pss: cod,
        id:res.id
      };
      email.cuentaBlock (usu,(err,ressp)=>{
        connection.query(upd,[cod,res.id],(err,resp)=>{
          if(err){throw err}
          else
          {
            callback(null,true)
          }
        });
      });
      }
    });
  }
};

ejectModel.cambioContra = (id,callback)=>{
  if(connection)
  {
    var sel = 'SELECT * FROM members WHERE email = ? ;';
    var upd = 'UPDATE members SET salt_contra = ? WHERE (id = ?);';
    connection.query(sel,[id],(err,res)=>{
      if(err){throw err}
      else
      {
      if (JSON.stringify(res)=='[]')
      {
          callback(null,false)
      }
      else
       {
      res = res[0];
      ciclo.generaSalt((err,gen)=>{
        cod = gen;
      });
      var usu = {
        to:res.email,
        pss: cod,
        id:res.id
      };
      email.cuentaBlock (usu,(err,ressp)=>{
        connection.query(upd,[cod,res.id],(err,resp)=>{
          if(err){throw err}
          else
          {
            callback(null,true)
          }
        });
      });
      }
      }
    });
  }
};

ejectModel.aceptaContra = (dts,callback)=>{
  if(connection)
  {
    console.log('Cambio de contrseña');
    var upt = 'UPDATE members SET password = ? WHERE salt_contra = ?;';
    connection.query(upt,[dts.pssw,dts.salt],(err,row)=>{
      if(err){throw err}
      else
      {
        // console.log(row);
        console.log(row.affectedRows);
        if(row.affectedRows>=1)
        {
                  callback(null,true);
        }
        else {
          callback(null,false);
        }

      }
    });
  }
};

ejectModel.fotosSer = async (ser,callback) =>{
if(connection)
{
  var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
  // console.log(ser);
  connection.query(sql,[ser.id_servicios],(err,res)=>{
    ser.fotos = res;
    // console.log(ser);
    callback(null,ser)
  });
}

};




module.exports = ejectModel;
