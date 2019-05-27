const comentarios = require('../models/comentarios');

module.exports = function (app)
{

//devuelve listado de categorias
app.get('/comentmed/:id/:cate',(req,res)=>{
  console.log('ruta');
  let ids = { id: req.params.id,
             cate: req.params.cate};
             console.log(ids);
comentarios.respuestasFaltaMed(ids,(err,data)=>{
res.json(data);
});
});


app.put('/comentmed',(req,res)=>{
  let coment = req.body;
  console.log(coment);
  comentarios.UpdateComentMed(coment,(err,data)=>{
    res.json(data);
  });
});



}
