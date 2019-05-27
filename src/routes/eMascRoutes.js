const eventsm = require('../models/eventosMascotas');
const jwts = require('../models/jwt');

module.exports = function (app)
{
  app.get('/eventsm/:id',(req,res)=>{
    let id = req.params.id;
    eventsm.darEventsMasc(id,(err,resp)=>{
          res.json(resp);
    });
  });

}
