const benef = require('../models/beneficiarios');
const jwts = require('../models/jwt');
module.exports = function (app)
{

//devuelve los beneficiarios segun el id usuasrio
app.get('/benef/:id',(req,res)=>{
var idU = req.params.id;
benef.darBenefId(idU,(err,data)=>{
res.json(data);
});
});


app.post('/benef',jwts.valida,(req,res)=>{
  var bene = {
    ident: req.body.ident,
    nombre: req.body.nomb,
    apellidos: req.body.apellidos,
    tel: req.body.tel,
    fecha_n: req.body.fecha_n,
    id_usu: req.body.id_usu,
    parent: req.body.parent,
    pais: req.body.pais
  };
  // console.log(req.body);
  benef.agregarBeneficiario(bene,(err,resp)=>{
    res.json(resp);
  });
});



}
