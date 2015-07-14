/**
 * SecurityGroupsController
 * 
 * @description :: Server-side logic for managing Securitygroups
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    ajax: function(req,res){
	Database.localSproc('NMS_BASE_GetSecurityGroups', [], function(err, securitygroups) {
	    if (err) {
		console.log('getSecurityGroups Error: ' + err);
		return res.json(err);

	    }
	    if (securitygroups[0]) {
		return res.json({
		    "data" : securitygroups[0]
		});
	    }
	});
    },
    findAll : function(req, res) {
	Database.localSproc('NMS_BASE_GetSecurityGroups', [], function(err, securitygroups) {
	    if (err) {
		console.log('getSecurityGroups Error: ' + err);
		return res.json(err);
	    }
	    if (securitygroups[0]) {
		res.json({
		    'data' : securitygroups[0]
		});
	    }
	});
    },
    destroy : function(req,res){
	Database.localSproc('NMS_BASE_DeleteSecurityGroup',[req.body.id],function(err,resposne){
	    if(err){
		console.log('Error Deleting User:'+err);
		return res.json({error:'Error Deleting User:'+err},500);
	    } 
	    return res.json({success:true});
	});
    },
    getsecuritygroupandresources : function(req, res) {
	Database.localSproc('NMS_BASE_GetSecurityGroup', [ req.body.id ], function(err, securitygroup) {
	    if (err) {
		console.log('getSecurityGroup Error: ' + err);
		return res.json(err);
	    }
	    Database.localSproc('NMS_BASE_GetSecurityGroupResources', [req.body.id], function(err, securitygroupresources) {
		if (err || securitygroup[0].length==0) {
		    console.log('getSecurityGroupResources Error: ' + err);
		    return res.json(err);
		}
		securitygroup[0][0].resources = securitygroupresources[0];
		res.json(securitygroup[0][0]);
	    });
	});
    },
    savesecuritygroupandresources:function(req,res){
	var securitygroup = req.body.securitygroup;


	async.series([
	              function(callback){ // NEW user
	        	  if(securitygroup.id!=null){
	        	      return callback(null);// skip out otherwise
	        	  }
	        	  var paramCreateId = '@out' + Math.floor((Math.random() * 1000000) + 1);
	        	  Database.localSproc('NMS_BASE_CreateSecurityGroup',[securitygroup.name,paramCreateId],function(err,responsesecuritygroup){
	        	      if(err){
	        		  return callback(err);
	        	      }
	        	      securitygroup.newid = responsesecuritygroup[1][paramCreateId];
	        	      callback(null);
	        	  });
	              },
	              function(callback){ // Existing user
	        	  if(securitygroup.id==null){ 
	        	      securitygroup.id = securitygroup.newid;
	        	      delete securitygroup.newid;
	        	      return callback(null);// skip out otherwise
	        	  }
	        	  Database.localSproc('NMS_BASE_UpdateSecurityGroup',[securitygroup.id, securitygroup.name],function(err,responsesecuritygroup){
	        	      if(err){
	        		  return callback(err);
	        	      }
	        	      callback(null);
	        	  });
	              }
	              ],
	              function(err){
	    if(err){
		console.log('Error Saving Security Group'+err);
		return res.json({error:'Error Saving Security Group:'+err},500);
	    }
	    Database.localSproc('NMS_BASE_GetResources',[],function(err,dbresources){
		if(err){
		    console.log('getResources Error'+err);
		    return res.json({error:'getResources Error:'+err},500);
		}
		dbresources = dbresources[0];
		var keys = [];
		var clientresourceset = {};
		for(group in securitygroup.resources){  
// security group.resources should be unioned with FULL set. A new resource may
// exist at this point, The ajax may not have ALL the resources included as
// parameters.
		    keys.push(group);
		    clientresourceset[securitygroup.resources[group].id]= true; 
// records the id in an associative array.
		}
		for(dbgroup in dbresources){
		    if(typeof(clientresourceset[dbresources[dbgroup].id])=='undefined'){ 
			// missing a resource
			keys.push(''+securitygroup.resources.length);
			securitygroup.resources.push({id:dbresources[dbgroup].id,create:0,read:0,update:0,delete:0});
		    }
		}
		// Now delete 'is_deleted' resources
		async.eachSeries(keys,function(key,deletecallback){
		    var resourceObj = securitygroup.resources[key];
		    if(!resourceObj.is_deleted){ // not to be deleted
			return deletecallback(null);
		    }
		    Database.localSproc('NMS_BASE_DeleteResourceAndResourceSecurityGroupMappings',[resourceObj.id], function(err, deletingresources) {
			if (err) {
			    console.log('NMS_BASE_DeleteResourceAndResourceSecurityGroupMappings Error' + err);
			    return deletecallback(err);
			}
			return deletecallback(null);
		    });

		},function(err,delresult){
		    if (err) {
			console.log('Error deleting resource Error' + err);
			return res.json({error:'Error Saving Mappings:'+err},500);
		    }
		    // Now add 'new' resources
		    async.eachSeries(keys,function(key,callback){
			var resourceObj = securitygroup.resources[key];
			if(resourceObj.id != null){ // new
			    return callback(null);
			}

			Database.localSproc('NMS_BASE_GetResourceByName', [ resourceObj.name ], function(err, checkingresources) {
			    if (err) {
				console.log('checkRoute NMS_BASE_GetResources Error' + err);
				return cb(err);
			    }
			    if (checkingresources[0].length != 0) {
				return callback(null);
			    }
			    var resourceId = '@out' + Math.floor((Math.random() * 1000000) + 1);
			    Database.localSproc('NMS_BASE_CreateResource', [ resourceObj.name, resourceId ], function(err, createdresource) {
				if (err) {
				    console.log('createRoute createResource Error' + err);
				    return cb(err);
				}
				resourceObj.id = createdresource[1][resourceId];

				Database.localSproc('NMS_BASE_GetSecurityGroups', [], function(err, securitygroups) {
				    if (err) {
					console.log('Error Getting Security Groups:' + err);
					return cb(err);
				    }
				    // fill blank privilege id's for ALL groups-
				    // (skipping active group - will save
				    // manually)
				    async.eachSeries(securitygroups[0],function(sgroup,sgcallback){
					if(sgroup.id==securitygroup.id){
					    return sgcallback(null);
					}
					var addPolicy = 0;
					if(sgroup.id==1&&sails.config.environment=='development'){ //Adiministrator group
					    addPolicy = 1;
					}
					Database.localSproc('NMS_BASE_CreateResourceSecurityGroupMapping',[resourceObj.id,sgroup.id,addPolicy,addPolicy,addPolicy,addPolicy],function(err,newmapping){
					    if(err){
						return callback(err);
					    }
					    sgcallback(null);
					});
				    },function(err,result){
					if(err){
					    return callback(err);
					}
					callback(null);
				    });
				});

			    });
			});
		    },function(err,result){
			if(err){
			    console.log('Error Making New Securitygroup/Mappings:'+err);
			    return res.json({error:'Error Saving Mappings:'+err},500);
			}

			Database.localSproc('NMS_BASE_DeleteResourceSecurityGroupMappings',[securitygroup.id],function(err,result){
			    if(err){
				console.log('Error Clearing Resource Security Group Mappings'+err);
				return res.json({error:'Error Clearing Resource Security Group Mappings'+err},500);
			    }
			    async.eachSeries(keys,function(key,callback){
				var resourceObj = securitygroup.resources[key];
				Database.localSproc('NMS_BASE_CreateResourceSecurityGroupMapping',[resourceObj.id,securitygroup.id,resourceObj.create,resourceObj.read,resourceObj.update,resourceObj.delete],function(err,newmapping){
				    if(err){
					return callback(err);
				    }
				    // if(resourceObj.id==null){

				    // }

				    callback(null);
				});
			    },function(err,result){
				if(err){
				    console.log('Error Saving Mappings:'+err);
				    return res.json({error:'Error Saving Mappings:'+err},500);
				}

				SecurityService.triggerAllUsersPolicyRebuild(); // triggers
				// rebuilding
				// everyones
				// policy.
				// Very
				// aggressive.
				res.json({success:true, id:securitygroup.id});
			    });
			});
		    });
		});


	    });
	});
    }
};
