var MongoClient = require('mongodb').MongoClient;

module.exports = {
  
  checkKey : function(req, res, callback){
     if(req.body.key === '1234567890'){
      return callback(null,true);
     }
     else{
      return callback(null,false);
     }
     
  }

};