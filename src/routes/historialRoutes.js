const hist = require('../models/historial');
let comen = require('../models/comentarios');
const jwts = require('../models/jwt');

module.exports=function(app)
{

app.get('/hist/:id',(req,res)=>{
  let id = req.params.id;
  hist.darHistorialU(id,(err,row)=>{
    res.json(row);
  });
});

app.get('/histb/:id',(req,res)=>{
  let id = req.params.id;
  hist.darHistorialB(id,(err,row)=>{
    res.json(row);
  });
});

app.get('/histm/:id',(req,res)=>{
  let id = req.params.id;
  hist.historialPel(id,(err,resp)=>{
    res.json(resp)
  });
});


app.post('/coment',(req,res)=>{
  let comm = {
    comentario:req.body.coment,
    califica:req.body.califica,
    id_servicio:req.body.ids,
    id_usuario:req.body.idU,
    id_historial:req.body.idh
  };
  let masc = req.body.masc;
  console.log(comm);
  console.log(masc);
  if(masc==true)
  {
    comen.agregarComentarioM(comm,(err,resp)=>{
      res.json(resp);
    });
  }
  else
  {
    comen.agregarComentario(comm,(err,resp)=>{
      res.json(resp);
    });
  }

});


}
