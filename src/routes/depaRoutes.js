const dpart = require('../models/departamentos');

module.exports = function (app)
{

//devuelve los departamentos segun el id del pais
app.get('/departamentos/:id',(req,res)=>{
var id = 47;
var idPar = req.params.id;
dpart.darDepartamentos(idPar,(err,data)=>{
res.json(data);
});
});

//elimina departamentos segun el id del departamento
app.delete('/departamentos/:id',(req,res)=>{

console.log('borrando departamento con id= '+req.params.id)
res.json(req.params.id);
});

app.get('/pais',(req,res)=>{
  dpart.darPais((err,data)=>{
        res.json(data);
  });
});

}
