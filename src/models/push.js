let mysql =require('mysql');
let config = require('../config');
var FCM = require('fcm-node');
var sleep = require('system-sleep');
var serverKey = 'AAAAtPm79JA:APA91bGrapXQuteyB4S-Um89wdLXNv058NnLd-tsRNA2DMDZ5cgJX6G9bq2ojHjiCuh_RizGovsQMV_FcNA2_VOsIO9JDOdHL5aWMWMPjdAvErR65EEAf4iTC-4qV8hLpHZPFJngIHe4'; //put your server key here
var fcm = new FCM(serverKey);

connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let pushmodule = {};

pushmodule.addtoken = (token,callback)=>{
  if(connection)
  {
    console.log('Informacion desde la apk');
    console.log(token);
    if(token.admines==true && token.medico == false)
    {
      var sel = 'SELECT id, tokenpsh FROM members,provedores WHERE members.id = provedores.members_id AND id_provedor = ?;';
      connection.query(sel,[token.id],(err,res)=>{
        if(err){throw err}
        else
         {
           // sleep(1000);
            res = res[0];
            console.log('************/////////////////*************');
            console.log(res);
            console.log(token);
          if(res.tokenpsh != token.token)
          {
            console.log('dentro del if del token');

          // console.log('true 1');
          // console.log(res);

          var upd = 'UPDATE members SET tokenpsh = ? WHERE id = ?;';
          connection.query(upd,[token.token,token.id],(err,resp)=>{
            if(err){throw err}
            else
            {
              console.log(resp);
              callback(null,true);
            }
          });
          }
          else
          {
            callback(null,false)
          }
        }
      });

    }
    else if(token.admines==false && token.medico == false)
    {
      var sel = 'SELECT members.id, tokenpsh FROM members,usuarios WHERE members.id = usuarios.members_id AND usuarios.id = ?;';
      connection.query(sel,[token.id],(err,res)=>{
        if(err){throw err}
        else
         {
            // sleep(1000);
            res = res[0];
          if(res.tokenpsh != token.token)
          {
            console.log('dentro del if del token');

          console.log('true 1');
          console.log(res);

          var upd = 'UPDATE members SET tokenpsh = ? WHERE id = ?;';
          connection.query(upd,[token.token,res.id],(err,resp)=>{
            if(err){throw err}
            else
            {
              console.log('////////////************/////////////////');
              console.log('true 2');
              callback(null,true);
            }
          });
          }
          else {
            {
              callback(null,false)
            }
          }
        }
    });

  }
  else if(token.admines==false && token.medico == true)
  {
    console.log('es medico');
    var sel = 'SELECT members.id, tokenpsh FROM members,medicos WHERE members.id = medicos.members_id AND medicos.medico_id = ?;';
    connection.query(sel,[token.id],(err,res)=>{
      if(err){throw err}
      else
       {
          // sleep(1000);
          res = res[0];
          console.log(res);
        if(res.tokenpsh != token.token)
        {
          console.log('dentro del if del token');

        console.log('true 1');
        console.log(res);

        var upd = 'UPDATE members SET tokenpsh = ? WHERE id = ?;';
        connection.query(upd,[token.token,res.id],(err,resp)=>{
          if(err){throw err}
          else
          {
            console.log('////////////************/////////////////');
            console.log('true 2');
            callback(null,true);
          }
        });
        }
        else {
          {
            callback(null,false)
          }
        }
      }
  });

  }
}
};

pushmodule.sendPush = (disp,callback)=>{
// console.log(disp);
let p = true;
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
       to: disp.to,
       // to:'cDN3ljN80nY:APA91bE23ly2oG-rzVAI8i_oiPMZI_CBdU59a6dVznyjdK9FyGi2oPI_sQIQJTAV-xp6YQ6F7MlYYW_7Br0nGdbTIuicwIP4oR99Mf8KysM1ZEJiCmASeyxnOHO4ajgqTDIX6prWpQpG',
       // collapse_key: 'your_collapse_key',
      notification:{
				 body: disp.body,
				 title: disp.title,
				 content_available: true,
				 priority: "high"
					},
      data: {
		      sound: "default",
		      title: disp.title,
          led:'FFFFF',
		      content_available: true,
		      priority: "high"
			}
   };
    // console.log(message);
    fcm.send(message,(err,response)=>{
      if(err){
      console.log('no enviados'+ err);
      console.log(response);
      console.log(p);
      if(p==2)
      {
        console.log('ENTRE AL IF');
        callback(null,false);
      }
      p++
      }
      else
      {
        console.log(response);
        console.log(p);
        if(p==2)
        {
          console.log('ENTRE AL IF');
          callback(null,true);
        }
        p++
      }
      console.log('no e salido');
    });
    console.log('sali');

};




module.exports = pushmodule;
