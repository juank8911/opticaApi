const med = require('../models/medicos');
const jwt = require('../models/jwt');

module.exports = function (app)
{

app.get('/medicosc/:id',(req,res)=>{
  let id = req.params.id;
  med.buscarMedicoCedu(id,(err,medi)=>{
    res.json(medi);
  });
});

app.get('/medicosi/:id',(req,res)=>{
  let id = req.params.id;
  med.buscarMedicoId(id,(err,medi)=>{
    res.json(medi);
  });
});

//devuelve listado de categorias
app.get('/medicos/:id',(req,res)=>{
  let idm = req.params.id;
med.darMedicosProv(idm,(err,data)=>{
res.json(data);
});
});

app.get('/medicosm/:id',(req,res)=>{
  let idm = req.params.id;
  console.log('ES MEDICO');
med.getMedicoMem(idm,(err,data)=>{
res.json(data);
});
});

app.get('/medicospr/:id',(req,res)=>{
  let id = req.params.id;
  // console.log(id);
  // console.log('MEDICOS Y PROVEDORES');
  med.provedorServicios(id,(err,rp)=>{
    res.json(rp)
  });
});




app.post('/medicos',jwt.valida,(req,res)=>{
  let medico = req.body;
  // console.log(req.body);
  let existe = req.body.existe;
  // console.log(existe);
  if(existe==false)
  {
    // console.log(medico);
    // medico = medico[0];
    med.agregarMedico(medico,(err,resps)=>{
      res.json(resps);
    });
  }
  else
  {
    med.agregarProvedor(medico,(err,resp)=>{
      res.json(resp);
    });
  }
});

app.put('/medico',jwt.valida,(req,res)=>{
  let medico = req.body;
  med.setMedico(medico,(err,resp)=>{
    res.json(resp);
  });
});

app.delete('/medico/:med/:prov',jwt.validaAdmin,(req,res)=>{
  let ids = {medico:req.params.med,
             prov:req.params.prov};
med.deleteMedico(ids,(err,row)=>{
  res.json(row);
});
});


}
