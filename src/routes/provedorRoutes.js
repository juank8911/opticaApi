const jwts = require('../models/jwt');
const users = require('../models/user');
const provers = require('../models/provedores');


module.exports = function(app){

//retorna una lista de provedores
app.get('/provedores',(req,res)=>{
provers.darProvedor((err,data)=>{res.json(data)});
});

// retorna a informacion del provedor segun su id
app.get('/provedores/:id',(req,res)=>{
var idprov = req.params.id;
console.log('ES PROVEDOR');
provers.darProvedorid(idprov,(err,data)=>{
console.log(data);
res.json(data)});
});


app.get('/perprovedor/:id',(req,res)=>{
  let id = req.params.id;
  provers.darPerProveid(id,(err,prov)=>{
    res.json(prov);
  });
});

app.put('/provedores',jwts.validaAdmin,(req,res)=>{
//prov.nit,prov.nombre,prov.direccion,prov.telefono,prov.whatsapp,prov.link,prov.video,,prov.id
let prov = {
nit: req.body.nit,
nombre:req.body.nombre,
direccion:req.body.direccion,
telefono:req.body.telefono,
whatsapp: req.body.whatsapp,
link:req.body.link,
video:req.body.video,
descripcion: req.body.descripcion,
id:req.body.id
};
provers.setProvedor(prov,(err,resp)=>{
res.json(resp);
});
});

}
