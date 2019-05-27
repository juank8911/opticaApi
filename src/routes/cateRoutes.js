const cate = require('../models/categoria');

module.exports = function (app)
{

//devuelve listado de categorias
app.get('/categoria',(req,res)=>{
cate.darCategoria((err,data)=>{
res.json(data);
});
});



}
