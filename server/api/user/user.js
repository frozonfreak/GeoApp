var MongoClient = require('mongodb').MongoClient, 
	DBtools   = require('../../components/db/dbFunction'), 
	global   = require('../../components/globalFunctions'), 
	fs        = require('fs');
var uuid = require('node-uuid');
var redis = require("redis"),
        client = redis.createClient();

module.exports.registerUser = function(req, res){	
	
	global.checkKey(req, res, function(err, result){
		//If Key valid
		if(result){
			DBtools.findUser(req, res, function(err, result){
				if(err){
		          console.log(err);
		          return;
		        }
		        if(result.length === 0){
		        	DBtools.updateUserDetails(req, res, function(err, result){
						if(err){
				          console.log(err);
				          return;
				        }
				        
				        if(result.result.ok === 1){
		        				//Hardcoded Updated of Admin User
		        	        	DBtools.updateAdminUserDetails(req, res, function(err, result){
		        					if(err){
		        			          console.log(err);
		        			          return;
		        			        }
		        			        
		        			        if(result.result.ok === 1){
		        			        	
		        			        	client.get("location", function(err, reply) {
		        			        	    // reply is null when the key is missing
		        			        		
		        			        	    console.log(JSON.stringify(result.ops[0]));
		        			        		client.set("location", JSON.stringify(result.ops[0]));    	
		        			        	});
		        			        	
		        			        	
		        			        	res.contentType('json');
		        			        	res.write(JSON.stringify({success:true}));
		        			        }
		        			        else{
		        			        	res.contentType('json');
		        			        	res.write(JSON.stringify({success:false}));
		        			        }
		        		   			res.end();
		        				});
				        }
				        else{
				        	res.contentType('json');
				        	res.write(JSON.stringify({success:false}));
				        	res.end();
				        }
			   			
					});
		        }
		        else{
    				res.contentType('json');
    		        res.write(JSON.stringify({success:false, error:'User exists'}));
    		        
    	   			res.end();
		        }
			});
		}
		else{
			res.contentType('json');
	        res.write(JSON.stringify({success:false, error:'Invalid Key'}));
	        
   			res.end();
		}
	});
};

module.exports.authUser = function(req, res){
		global.checkKey(req, res, function(err, result){
			//If Key valid
			if(result){
				DBtools.authUser(req, res, function(err, result){
					if(err){
			          console.log(err);
			          return;
			        }
			        if(result.length > 0){
			        	res.contentType('json');
	    		        res.write(JSON.stringify({success:true}));
	    		        
	    	   			res.end();
			        }
			        else{
	    				res.contentType('json');
	    		        res.write(JSON.stringify({success:false, error:'User not found'}));
	    		        
	    	   			res.end();
			        }
				});
			}
			else{
				res.contentType('json');
		        res.write(JSON.stringify({success:false, error:'Invalid Key'}));
		        
	   			res.end();
			}
		});
};

module.exports.authAdminUser = function(req, res){
	global.checkKey(req, res, function(err, result){
			//If Key valid
			if(result){
				DBtools.authAdminUser(req, res, function(err, result){
					if(err){
			          console.log(err);
			          return;
			        }
			        
			        if(result.length > 0){
			        	
			        	//Create a session ID and update to database
			        	var sessionID = uuid.v1();
			        	DBtools.updateSessionToDB(req, res, sessionID, function(err, result){
        					if(err){
        			          console.log(err);
        			          return;
        			        }
        			        
        			        if(result.result.ok === 1){
        			        	res.contentType('json');
        			        	res.write(JSON.stringify({success:true, 
        			        							  session_id:sessionID}));
        			        }
        			        else{
        			        	res.contentType('json');
        			        	res.write(JSON.stringify({success:false}));
        			        }
        		   			res.end();
			        	});
			        }
			        else{
	    				res.contentType('json');
	    		        res.write(JSON.stringify({success:false, error:'User not found'}));
	    		        
	    	   			res.end();
			        }
				});
			}
			else{
				res.contentType('json');
		        res.write(JSON.stringify({success:false, error:'Invalid Key'}));
		        
	   			res.end();
			}
		});	
};

module.exports.checkSession = function(req, res){
	global.checkKey(req, res, function(err, result){
			//If Key valid
			if(result){
				DBtools.getSessionDetail(req, res, function(err, result){
					if(err){
			          console.log(err);
			          return;
			        }
			        if(result.length > 0){
			        	
			        	if(Math.floor(Date.now() / 1000) - result[0].timestamp <1800){//session for 30 mins
			        		res.contentType('json');
	    		        	res.write(JSON.stringify({success:true}));
	    	   				res.end();	
			        	} 
			        	else{
        					res.contentType('json');
        			        res.write(JSON.stringify({success:false, error:'Invalid Session'}));
        		   			res.end();	
			        	}
			        }
			        else{
	    				res.contentType('json');
	    		        res.write(JSON.stringify({success:false, error:'User not found'}));
	    	   			res.end();
			        }
				});
			}
			else{
				res.contentType('json');
		        res.write(JSON.stringify({success:false, error:'Invalid Key'}));
		        
	   			res.end();
			}
		});	
};


module.exports.getUserLocationDetails = function(req, res){
	global.checkKey(req, res, function(err, result){
			//If Key valid
			if(result){
				DBtools.getSessionDetail(req, res, function(err, result){
					if(err){
			          console.log(err);
			          return;
			        }
			        if(result.length > 0){
			        	if(Math.floor(Date.now() / 1000) - result[0].timestamp <1800){//session for 30 mins
			        		

			        		//Switch between redis and DB
			        		client.get("location", function(err, reply) {
			        		    console.log(JSON.parse(reply));
			        		    if(JSON.parse(reply) !== ''){
			        		    	var arrResponse = [];
			        		    	arrResponse[0] = JSON.parse(reply);
			        		    	res.contentType('json');
	       		    		        res.write(JSON.stringify({success:true, data:arrResponse}));
	       		    	   			res.end();
			        		    }
			        		    else{
	    			        		//Valid Session. 
	    			        		//Get User details now. 
	    		        			DBtools.getUserLocationDetails(req, res, function(err, result){
	    		        				if(err){
	    		        		          console.log(err);
	    		        		          return;
	    		        		        }
	    	       				        if(result.length > 0){
	    	       				        	res.contentType('json');
	    	       		    		        res.write(JSON.stringify({success:true, data:result}));
	    	       		    	   			res.end();
	    	       				        }
	    	       				        else{
	    	       		    				res.contentType('json');
	    	       		    		        res.write(JSON.stringify({success:false, error:'User not found'}));
	    	       		    	   			res.end();
	    	       				        } 
	    		        		    });
			        		    }
			        		});
			        		
			        	} 
			        	else{
        					res.contentType('json');
        			        res.write(JSON.stringify({success:false, error:'Invalid Session'}));
        		   			res.end();	
			        	}
			        }
			        else{
	    				res.contentType('json');
	    		        res.write(JSON.stringify({success:false, error:'User not found'}));
	    	   			res.end();
			        }
				});
			}
			else{
				res.contentType('json');
		        res.write(JSON.stringify({success:false, error:'Invalid Key'}));
		        
	   			res.end();
			}
		});	
};

