

module.exports = function(req,res,next) {
    
    function checkAndUpdateUserPolicy(userId,cb){  // Checks and updates User
						    // Policy
	if(SecurityService.updateRequired(userId)||typeof(req.session.user.policy[req.route.path])=='undefined'){  // Either
														    // needs
														    // an
														    // update,
														    // or
														    // missing
														    // a
														    // route
														    // to
														    // try,
	    
	    Database.localSproc('NMS_BASE_GetUser',[req.session.user.id],function(err,user){
		    if(err){
	                console.log("Database Error."+err);
			return failResponse();
		    }
		    if(!(user[0]&&user[0][0])){ // if cant find
			// user or user
			// inactive.
			return failResponse();
                    }
		    req.session.user = user[0][0];
		    Database.localSproc("NMS_BASE_GetUserPolicies", [ req.session.user.id], function(err,policies) {
		            if(err){
		                return failResponse();
		            }
		            if(policies[0]){ // Good result- rebuild all policies.
		        	policies = policies[0];
		            	delete req.session.user.policy;
		            	req.session.user.policy = {};
		            	for(var i =0;i<policies.length;i++){
		            	    req.session.user.policy[policies[i].name]=policies[i];
		            	}
		            	cb(null);
		            }else{
		        	console.log('Policy Missing!@'+req.session.user.id+':'+path);
		            	if(sails.config.environment=='development'){// }&&req.session.user.username==sails.config.autogenerate.user.username){
		                		return autoGenRoute();
		            	}
		            	failResponse();// res.json(500,{error:'Policy
		    				// Missing!@'+req.session.user.id+':'+path});
		            }
			});
	    });
	    
	}else{  // policy stillll good.
	    cb(null);
	}
    }
    function authorizeResourcePolicy(){
	var path = req.route.path;
	checkAndUpdateUserPolicy(req.session.user.id, function(err, policy){
	    if(typeof(req.session.user.policy[path])=='undefined'){ // Didn't
								    // find the
								    // specific
								    // policy.
        	console.log('Policy Missing!@'+req.session.user.id+':'+path);
        	if(sails.config.environment=='development'){// }&&req.session.user.username==sails.config.autogenerate.user.username){
            		return autoGenRoute();
        	}
        	failResponse();// res.json(500,{error:'Policy
				// Missing!@'+req.session.user.id+':'+path});
	    }else{
		console.log(JSON.stringify(req.session.user));
            	if(req.session.user.active!=1 || (req.session.user.policy[path].create==0&&req.session.user.policy[path].read==0&&req.session.user.policy[path].update==0&&req.session.user.policy[path].delete==0)){
            	    //req.flash('errormessage',req.__('Invalid Access')); //TODO- this may need to be enabled. 
                    req.flash('errordebug','UserId:'+req.session.user.id+' @Path:'+req.route.path);
                    failResponse();
                        
                        //res.json(403,{error:'Invalid Access! UserId:'+req.session.user.id+' @Path:'+path});
                    return;
            	}
            	req.setLocale(req.session.user.locale); // Sets the locale!
                next();  
	    }
	});
    }
    
    
    function autoGenRoute(){
	sails.controllers.security.createRoute(req,function(err,result){
	    if(err){
		console.log('Failed creating Route'+err);
		return failResponse();
	    }
	    authorizeResourcePolicy(); // try again!
	});
    }
    
    function failResponse(){
	 if (typeof (req.route) == 'undefined') {
             res.json({
                 error : "Session not found"
             }, 403);
         } else {
             try{
                 res.writeHead(302,{
              	'Location':'/auth'
                  });
                 if(req.flash('errormessage').length==0){
                     if(req.session.user&&req.session.user.active==0){
                         req.flash('errormessage',req.__('Your account is locked.'));
                     }else{
                         req.flash('errormessage',req.__('You are not logged into the system. Please log in.'));
                	 
                     }
                 }   
                 res.end();
             }
             catch(err){
        	 console.log('Error sending fail Response.'+err);
                 //res.json({error:'Invalid Access!@'},403);
                 res.json(403,{error:'Invalid Access! UserId:'+req.session.user.id+' @Path:'+req.route.path});
// res.json({
// error : "Session not found"
// }, 403);
             }
             
             // res.view('auth/loginpage', {
             // layout : false,
             // errormessage : ''
             // });
         }
    }
    
    if (req.session.user) {
	// Database.localSproc('NMS_BASE_GetUser',[req.session.user.id],function(err,user){
	// if(err){
        // console.log("Database Error."+err);
	// return failResponse();
	// }
	// if(!(user[0]&&user[0][0]&&user[0][0].active==1)){ // if cant find
								// user or user
								// inactive.
	// if(user[0]&&user[0][0]&&user[0][0].active==0){
	// delete req.session.user;
	// }
	// return failResponse();
	// }
	    authorizeResourcePolicy();
	// });
    } else {
	return failResponse();
    }
};
