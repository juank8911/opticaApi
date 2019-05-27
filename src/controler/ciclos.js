let mysql =require('mysql');
let config = require('../config');
let jwts = require('jsonwebtoken');
let fs = require('fs');
let rl = require('random-letter');
var rn = require('random-number');
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'prevenirexpres'
});

let cicloModule = {};

cicloModule.imges  = (id,callback)=>
{
  var ids = id;
  if(connection)
  {
    var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
    connection.query(sql,[id],(err,row)=>{
      if(err)
      {

      }
      else
      {
        console.log(row);
        callback(null,row);
      }
    });
  }

};



cicloModule.generaSalt = (callback) =>
{
  var options = {
  min:  0000001
  , max:  9999999
  , integer: true
  }
  var rand0 = rn(options)
  var name = rand0;
  console.log(name);
  callback(null,name)

};

module.exports = cicloModule;
