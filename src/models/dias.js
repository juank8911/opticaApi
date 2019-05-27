const mysql = require('mysql');
let config = require('../config');
let moment = require('moment');
let hora = require('./horario');

connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let diasModel={};

// agrega los dias la base de datos
diasModel.agregarDia=(dia,callback)=> {
var sql = 'INSERT INTO dias(dia,id_horario,servicios_id_servicios) value (?,?,?)';
semana=dia.semanas;
id = dia.id;
ids=dia.ids;
var fin = [];
var p=0;
for (var i = 0; i < semana.length; i++)
{
// //console.lo.log('dia '+semana[i]);
// //console.lo.log('id_horario '+id);
// //console.lo.log('id_servicio '+ids);
connection.query(sql,[semana[i],id,ids],(err,resp)=>{
if(err){throw err}
else
{
fin.push({id:resp.insertId});
// //console.lo.log(fin);
// //console.lo.log(p);
p++;
if(p>=semana.length)
{
callback(null,true);
}
}
});

}
};


// retorna los dias de la semana
diasModel.controlH=(horario,callback)=>{

////console.lo.log(req.body);
var id = horario.id;
horarios = horario[0];
horarios = horarios.horario;
//horarios = horarios.horario;
//console.lo.log(horarios);
//id=horario.id;
//semana = horario.semana;
////console.lo.log(horarios.length);
//  //console.lo.log(id);
for (var i = 0; i < horarios.length; i++)
{
// //console.lo.log("horarios nuemro" + i);
// //console.lo.log(horarios[i]);
var horas = horarios[i];
horas.id =   id;
//console.lo.log(horas.semana);
hora.darDia(horas,(err,resp)=>{
respuesta.push(resp);
//console.lo.log(p);
p++;
if(p>=horarios.length)
{
res.json(respuesta);
}
});
////////////////////////////////////////////////////
// hora.agregarHorario(horas,(err,resp)=>{
//      respuesta.push(resp);
//      //console.lo.log(p);
//       p++;
//      if(p>=horarios.length)
//      {
//        res.json(respuesta);
//      }
//
// });
/////////////////////////////////////////
}
};

diasModel.darDiasEd=(rows,callback)=>{
  let dias = 'SELECT dias.dia FROM dias where  id_horario = ?;';
  //console.lo.log(rows);
  let id_horario = rows.id_horario;
  connection.query(dias,[id_horario],(err,row2)=>{
    if(err){throw err}
    else
    {

      rows.dias = row2;
      //console.lo.log(rows);
      callback(null,rows);
      //varia.push({row2});
      //vars.push(row1[i]);

    //row1[i].dias = row2;
    ////console.lo.log(row1);
    // if(row1.length-1==i)
    // {
    //     callback(null,row1);
    // }
  }
  });
};

module.exports = diasModel;
