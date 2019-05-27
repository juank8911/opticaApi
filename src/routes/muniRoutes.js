const municipios = require('../models/municipios');

module.exports = function (app)
{

//retona la lista de los municipios segun el id del departamento
app.get('/municipios/:id',(req,res)=>{

municipios.darMunicipioId(req.params.id,(err,resp)=>{

//console.log(resp);
res.json(resp);

});

});

}
