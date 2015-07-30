var MongoClient = require('mongodb').MongoClient;

module.exports = {
  
  updateUserDetails : function(req, res, callback){
     MongoClient.connect('mongodb://localhost:27017/'+'geoapp-dev', function(err, db) {
       if(err){
        db.close();
         return callback(new Error("Unable to Connect to DB"));
       }
       var collection = db.collection('things');
       collection.insert([
           {id : req.body.uuid, uuid : req.body.uuid, email:req.body.email, pass:req.body.pass, lat:req.body.lat, lng:req.body.lng, acc:req.body.accuracy, role:'MEMBER'}
         ], function(err, result) {
           return callback(null, result);
         });
       
     });
  },
  findUser: function(req, res, callback){
    MongoClient.connect('mongodb://localhost:27017/'+'geoapp-dev', function(err, db) {
       if(err){
        db.close();
         return callback(new Error("Unable to Connect to DB"));
       }

       var collection = db.collection('things');
       collection.find({email:req.body.email}).toArray(function(err, docs) {
           return callback(null, docs);
         });
     });
  },
  authUser: function(req, res, callback){
    MongoClient.connect('mongodb://localhost:27017/'+'geoapp-dev', function(err, db) {
       if(err){
        db.close();
         return callback(new Error("Unable to Connect to DB"));
       }

       var collection = db.collection('things');
       collection.find({uuid:req.body.uuid, pass:req.body.pass, role:'MEMBER'}).toArray(function(err, docs) {
           return callback(null, docs);
         });
     });
  },
  authAdminUser: function(req, res, callback){
    MongoClient.connect('mongodb://localhost:27017/'+'geoapp-dev', function(err, db) {
       if(err){
        db.close();
         return callback(new Error("Unable to Connect to DB"));
       }

       var collection = db.collection('things');
       collection.find({email:req.body.email, pass:req.body.pass, role:'ADMIN'}).toArray(function(err, docs) {
           return callback(null, docs);
         });
     });
  },
  updateSessionToDB : function(req, res, sessionid, callback){
     MongoClient.connect('mongodb://localhost:27017/'+'geoapp-dev', function(err, db) {
       if(err){
        db.close();
         return callback(new Error("Unable to Connect to DB"));
       }
       var collection = db.collection('session');
       collection.insert([
           {sessionid:sessionid, timestamp:Math.floor(Date.now() / 1000)}
         ], function(err, result) {
           return callback(null, result);
         });
       
     });
  },
  getSessionDetail: function(req, res, callback){
    MongoClient.connect('mongodb://localhost:27017/'+'geoapp-dev', function(err, db) {
       if(err){
        db.close();
         return callback(new Error("Unable to Connect to DB"));
       }

       var collection = db.collection('session');
       collection.find({sessionid:req.body.session_id}).toArray(function(err, docs) {
           return callback(null, docs);
         });
     });
  },
  getUserLocationDetails: function(req, res, callback){
    MongoClient.connect('mongodb://localhost:27017/'+'geoapp-dev', function(err, db) {
       if(err){
        db.close();
         return callback(new Error("Unable to Connect to DB"));
       }

       var collection = db.collection('things');
       collection.find({}, {fields:{email:1, lat:1, lng:1, acc:1}}).toArray(function(err, docs) {
           return callback(null, docs);
         });
     });
  }

};

