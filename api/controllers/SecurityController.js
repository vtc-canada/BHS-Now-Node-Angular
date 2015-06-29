/**
 * SecurityGroupsController
 * 
 * @description :: Server-side logic for managing Securitygroups
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    join : function(req, res) {
	req.socket.join('user_' + req.session.user.id);
    },
    getsecuritygroups : function(req, res) {
	Database.localSproc('NMS_BASE_GetSecurityGroups', [], function(err, result) {
	    if (err) {
		console.log('Error Getting Security Groups:' + err);
		return res.json({
		    error : 'Error Getting Security Groups:' + err
		}, 500);
	    }
	    return res.json(result[0]);
	});
    },
    getresourcegroups : function(req, res) {
	Database.localSproc('NMS_BASE_GetResources', [], function(err, result) {
	    if (err) {
		console.log('Error Getting Resources:' + err);
		return res.json({
		    error : 'Error Getting Resources:' + err
		}, 500);
	    }
	    return res.json(result[0]);
	});

    },
    checkAndCreateBaseUsers : function(cb) {
	Database.localSproc('NMS_BASE_GetUsersCount', [], function(err, result) {
	    if (err) {
		console.log('getUsersCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		var username = sails.config.autogenerate.user.username;
		var hasher = require("password-hash");
		var password = hasher.generate(sails.config.autogenerate.user.password);
		Database.localSproc('NMS_BASE_CreateUser', [ username, password, null, 'First','Last', 1, 0, 'en', '@outCreateUser' ], function(err, user) {
		    if (err) {
			console.log('createUser Error' + err);
			return cb(err);
		    }
		    cb(null, user);
		});
	    }
	});
    },
    checkAndCreateBaseSecurityGroups : function(cb) {
	Database.localSproc('NMS_BASE_GetSecurityGroupsCount', [], function(err, result) {
	    if (err) {
		console.log('getSecurityGroupsCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		async.eachSeries(sails.config.autogenerate.securitygroups, function(securitygroup, callback) {
		    Database.localSproc('NMS_BASE_CreateSecurityGroup', [ securitygroup, '@outDummyParam' ], function(err, createdsecuritygroup) {
			if (err) {
			    console.log('createSecurityGroup Error' + err);
			    return callback(err);
			}
			callback(null, createdsecuritygroup);
		    });
		}, function(err, asyncresult) {
		    if (err) {
			console.log('SecurityGroup Startup Error:' + err.toString());
			return cb(err);
		    }
		    cb(null, asyncresult);
		});
	    } else { // returning as resources are already set up.
		cb(null, []);
	    }
	});
    },
    checkAndCreateBaseResources : function(cb) {
	Database.localSproc('NMS_BASE_GetResourcesCount', [], function(err, result) {
	    if (err) {
		console.log('getResourcesCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		async.eachSeries(sails.config.autogenerate.resources, function(resource, callback) {
		    Database.localSproc('NMS_BASE_CreateResource', [ resource, '@outResourceId' ], function(err, createdresource) {
			if (err) {
			    console.log('createResource Error' + err);
			    return callback(err);
			}
			callback(null, createdresource);
		    });
		}, function(err, asyncresult) {
		    if (err) {
			console.log('Resource Startup Error:' + err.toString());
			return cb(err);
		    }
		    cb(null, asyncresult);
		});
	    } else { // returning as resources are already set up.
		cb(null, []);
	    }
	});
    },
    checkAndCreateUserSecurityGroupMappings : function(cb) {
	Database.localSproc('NMS_BASE_GetUserSecurityGroupMappingsCount', [], function(err, result) {
	    if (err) {
		console.log('getUserSecurityGroupMappingsCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		Database.localSproc('NMS_BASE_GetUsers', [], function(err, users) {
		    if (err) {
			console.log('getUsers Error' + err);
			return cb(err);
		    }
		    if (users[0].length > 0) {
			async.eachSeries(users[0], function(user, callback) {
			    Database.localSproc('NMS_BASE_GetSecurityGroups', [], function(err, securitygroups) {
				if (err) {
				    console.log('getSecurityGroups Error' + err);
				    return callback(err);
				}
				if (securitygroups[0].length > 0) {
				    async.eachSeries(securitygroups[0], function(securitygroup, securitygroupcallback) {

					Database.localSproc('NMS_BASE_CreateUserSecurityGroupMapping', [ user.id, securitygroup.id ], function(err, createdusersecuritygroupmapping) {
					    if (err) {
						console.log('createUserSecurityGroupMapping Error' + err);
						return securitygroupcallback(err);
					    }
					    securitygroupcallback(null, createdusersecuritygroupmapping);
					});

				    }, function(err, asyncresult) {
					if (err) {
					    console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
					    return callback(err);
					}
					callback(null, asyncresult);
				    });
				} else { // no users to map.
				    callback(null, []);
				}
			    });
			}, function(err, asyncresult) {
			    if (err) {
				console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
				return cb(err);
			    }
			    cb(null, asyncresult);
			});
		    } else { // no users to map.
			cb(null, []);
		    }
		});
	    } else { // returning as mappings are already set up.
		cb(null, []);
	    }
	});
    },
    checkAndCreateResourceSecurityGroupMappings : function(cb) {
	Database.localSproc('NMS_BASE_GetResourceSecurityGroupMappingsCount', [], function(err, result) {
	    if (err) {
		console.log('getUserSecurityGroupMappingsCount Error' + err);
		return cb(err);
	    }
	    if (result[0][0].count == 0) {
		Database.localSproc('NMS_BASE_GetResources', [], function(err, resources) {
		    if (err) {
			console.log('getUsers Error' + err);
			return cb(err);
		    }
		    if (resources[0].length > 0) {
			async.eachSeries(resources[0], function(resource, callback) {
			    Database.localSproc('NMS_BASE_GetSecurityGroups', [], function(err, securitygroups) {
				if (err) {
				    console.log('getSecurityGroups Error' + err);
				    return callback(err);
				}
				if (securitygroups[0].length > 0) {
				    async.eachSeries(securitygroups[0], function(securitygroup, securitygroupcallback) {

					Database.localSproc('NMS_BASE_CreateResourceSecurityGroupMapping', [ resource.id, securitygroup.id, 1, 1, 1, 1 ], function(err, createdresourcesecuritygroupmapping) {
					    if (err) {
						console.log('createResourceSecurityGroupMapping Error' + err);
						return securitygroupcallback(err);
					    }
					    securitygroupcallback(null, createdresourcesecuritygroupmapping);
					});

				    }, function(err, asyncresult) {
					if (err) {
					    console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
					    return callback(err);
					}
					callback(null, asyncresult);
				    });
				} else { // no users to map.
				    callback(null, []);
				}
			    });
			}, function(err, asyncresult) {
			    if (err) {
				console.log('checkAndCreateUserSecurityGroupMappings Error:' + err.toString());
				return cb(err);
			    }
			    cb(null, asyncresult);
			});
		    } else { // no users to map.
			cb(null, []);
		    }
		});
	    } else { // returning as mappings are already set up.
		cb(null, []);
	    }
	});
    },
    createRoute : function(req, cb) {

	checkAndMakeResource(req.route.path, function(err, resourceId) {
	    if (err) {
		console.log('checkAndMakeResource Error' + err);
		cb(err);
	    }
	    Database.localSproc('NMS_BASE_GetUserSecurityGroups', [ req.session.user.id ], function(err, securitygroups) {
		if (err) {
		    console.log('createRoute getSecurityGroups Error' + err);
		    return cb(err);
		}
		if (securitygroups[0].length > 0) {
		    var isMember = false;
		    var isFirst = true;
		    var securitygroupstemp = securitygroups[0];

		    async.sortBy(securitygroupstemp, function(sg, sortcallback) {
			sortcallback(null, sg.id * -1);
		    }, function(err, securitygroups) {
			if (err) {
			    return cb(err);
			}

			async.eachSeries(securitygroups, function(securitygroup, securitygroupcallback) {
			    Database.localSproc('NMS_BASE_GetResourceSecurityGroupMapping', [ resourceId, securitygroup.id ], function(err, checkresourcesecuritygroup) {
				if (err) {
				    return securitygroupcallback(err);
				}
				if (checkresourcesecuritygroup[0].length == 0) {
				    var accesstemp = 0;
				    if (securitygroup.member) { // if they are a
					// member of this
					// group - add
					// permissions
					if (isFirst) {
					    isFirst = false;
					    accesstemp = 1;
					}
					isMember = true;
				    }
				    Database.localSproc('NMS_BASE_CreateResourceSecurityGroupMapping', [ resourceId, securitygroup.id, accesstemp, accesstemp, accesstemp, accesstemp ], function(err, createdresourcesecuritygroupmapping) {
					if (err) {
					    return securitygroupcallback(err);
					}
					securitygroupcallback(null, createdresourcesecuritygroupmapping);
				    });
				} else {
				    if (securitygroup.member && isFirst) {
					isFirst = false;
					isMember = true;
					Database.localSproc('NMS_BASE_UpdateResourceSecurityGroupMapping', [ checkresourcesecuritygroup[0][0].id, 1, 1, 1, 1 ], function(err, createdresourcesecuritygroupmapping) {
					    if (err) {
						return securitygroupcallback(err);
					    }
					    securitygroupcallback(null, createdresourcesecuritygroupmapping);
					});
				    } else {
					securitygroupcallback(null);
				    }
				}
			    });
			}, function(err, asyncresult) {
			    if (err) {
				console.log('createResource checkAndCreateResourceSecurityGroupMappings Error:' + err.toString());
				return cb(err);
			    }

			    if (!isMember) { // trying to build path with absolutely no groups were a part of.
				delete req.session.user;

				return cb('User is not a member of any security groups. Unable to create route');
			    }
			    if (req.session.user) {
				SecurityService.triggerUserPolicyRebuild(req.session.user.id);
			    }

			    cb(null, asyncresult);
			});

		    });

		} else { // no securitygroups to map to the new resource.
		    cb(null, []);
		}
	    });

	});

	function checkAndMakeResource(path, checkAndMakeResourceCallback) {
	    Database.localSproc('NMS_BASE_GetResourceByName', [ req.route.path ], function(err, checkingresources) {
		if (err) {
		    console.log('checkRoute NMS_BASE_GetResources Error' + err);
		    cb(err);
		}
		if (checkingresources[0].length == 0) {
		    var resourceId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		    Database.localSproc('NMS_BASE_CreateResource', [ req.route.path, resourceId ], function(err, createdresource) {
			if (err) {
			    console.log('createRoute createResource Error' + err);
			    cb(err);
			}
			checkAndMakeResourceCallback(null, createdresource[1][resourceId]);
		    });
		} else {
		    checkAndMakeResourceCallback(null, checkingresources[0][0].id);
		}
	    });
	}

    }
};
