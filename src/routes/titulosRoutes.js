const titu = require('../models/titulos');

module.exports = function (app)
{

//devuelve listado de categorias
app.post('/titulos',(req,res)=>{
let titulos = req.body;
console.log(titulos);
titu.agregarTitulos((err,data)=>{
res.json(data);
});
});



}
