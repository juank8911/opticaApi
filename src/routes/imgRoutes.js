const img = require('../models/imagenes');
const jwts = require('../models/jwt');

module.exports=function(app)
{
//guarda las imagenes en el servido y en la base de datos
app.post('/images',(req, res)=>{
console.log(req.files.archivo);
var imagen = req.files.archivo;
img.subida(imagen,req);
//  var img = {
//  creador: res.locals.user_id
//  };

});

app.get('/images',(req,res)=>{img.ver((err,data)=>{res.json(data);});});
app.get('/',jwts.valida,(req, res) => {User.getUsers((err, data) => {res.json(data);});});
}
