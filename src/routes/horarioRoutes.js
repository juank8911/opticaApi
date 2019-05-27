const hora = require('../models/horario');
const jwts = require('../models/jwt');

module.exports=function(app)
{

app.post('/horario',(req, res)=>{
var respuesta=[];
var p=0;
//console.log(req.body);
horarios = req.body.horarios;
console.log(horarios);
//id=horario.id;
//semana = horario.semana;
console.log(horarios.length);
//  console.log(id);
for (var i = 0; i < horarios.length; i++)
{
// console.log("horarios nuemro" + i);
// console.log(horarios[i]);
hora.agregarHorario(horarios[i],(err,resp)=>{
respuesta.push(resp);
console.log(p);
p++;
if(p>=horarios.length)
{
res.json(respuesta);
}

});

}

// hora.agregarHorario(horario,(err,resp)=>{
//   res.json(resp);
// })
});

// retorna las citas segun la fecha y el id del servicio
app.get('/citas/:fecha/:id/:masc',(req,res)=>{
  console.log(req.params);
serv = {
fecha:req.params.fecha,
id:req.params.id,
cate:req.params.masc
};
console.log(serv);
hora.darDia(serv,(err,resp)=>{
res.json(resp);
});
});


// retorna las citas segun la fecha y el id del servicio
app.get('/citaspr/:fecha/:id',(req,res)=>{
serv = {
fecha:req.params.fecha,
id:req.params.id
};
hora.darDiaPr(serv,(err,resp)=>{
res.json(resp);
});
});

app.get('/horariosed/:id',(req,res)=>{
  let id = req.params.id;
  hora.darHorariosed(id,(err,resp)=>{
    res.json(resp);
  });
});



// retorna las citas segun la fecha y el id del servicio para los provedores
app.get('/servcitas/:fecha/:id/:masc',(req,res)=>{
prov  = {
fecha:req.params.fecha,
id:req.params.id,
cat:req.params.masc
};
hora.darDiaOc(prov,(err,resp)=>{
res.json(resp);
});
});

app.post('/horariosed',(req,res)=>
{ let hor = req.body.horarios;
  let p = 0;
  hor = hor[0];
  hor=hor.horario;
  // console.log(hor);
// console.log(hor.length);
for (var i = 0; i < hor.length; i++)
{
// console.log(hor[i]);
hora.agregarHorarioEd(hor[i],(err,data)=>{
// console.log('P '+p);
// console.log('L '+hor.length);
    if(hor.length==p)
    {
      res.json(data);
    }

});
  p++
}

});

app.delete('/horariodel/:id',jwts.validaAdmin,(req,res)=>{
  let id = req.params.id;
  hora.eliminarHorarioEd(id,(err,resp)=>{
    res.json(resp);
  });
});


}
