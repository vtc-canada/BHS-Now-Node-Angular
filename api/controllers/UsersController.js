var deepequal = require('deep-equal');

/**
 * UsersController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    ajax : function(req, res) {

	Database.localSproc('NMS_BASE_GetUsers', [], function(err, users) {
	    if (err) {
		console.log('getUsers Error: ' + err);
		return res.json(err);

	    }
	    if (users[0]) {
		return res.json({
		    "data" : users[0]
		});
	    }
	});
    },
    findAll : function(req, res) {
	Database.localSproc('NMS_BASE_GetUsers', [], function(err, users) {
	    if (err) {
		console.log('getUsers Error: ' + err);
		return res.json(err);
	    }
	    if (users[0]) {
		res.json(users[0]);
	    }
	});
    },
    getUsersAndStatus : function(req, res) {
	Database.localSproc('NMS_BASE_GetUsers', [], function(err, users) {
	    if (err) {
		console.log('getUsers Error: ' + err);
		return res.json(err);
	    }
	    if (users[0]) {
		users = users[0];
		for (var i = 0; i < users.length; i++) {
		    if (typeof (sails.io.rooms['/' + users[i].id]) != 'undefined' && sails.io.rooms['/' + users[i].id].length > 0) {
			users[i].online = true;
		    } else {
			users[i].online = false;
		    }
		}
		res.json(users);
	    }
	});
    },
    datatables : function(req, res) {
	Database.localSproc('NMS_BASE_GetUsers', [], function(err, users) {
	    if (err) {
		console.log('getUsers Error: ' + err);
		return res.json(err);
	    }
	    if (users[0]) {
		res.json({
		    'data' : users[0]
		});
	    }
	});
    },
    destroy : function(req, res) {
	Database.localSproc('NMS_BASE_DeleteUser', [ req.body.id ], function(err, resposne) {
	    if (err) {
		console.log('Error Deleting User:' + err);
		return res.json({
		    error : 'Error Deleting User:' + err
		}, 500);
	    }
	    return res.json({
		success : true
	    });
	});
    },
    getuserandgroups : function(req, res) {
	if (isNaN(parseInt(req.body.id))) {
	    return null;
	}
	Database.localSproc('NMS_BASE_GetUser', [ parseInt(req.body.id) ], function(err, user) {
	    if (err) {
		return res.json(err);
	    }
	    user[0][0].password = null; // hides the password
	    Database.localSproc('NMS_BASE_GetUserSecurityGroups', [ parseInt(req.body.id) ], function(err, groups) {
		if (err) {
		    return res.json(err);
		}
		user[0][0].groups = groups[0];
		res.json(user[0][0]);
	    });
	});
    },
    saveuserandgroups : function(req, res) {

	var user = req.body.user;

	async.series([ function(callback) { // NEW user
	    if (user.id != null) {
		return callback(null);// skip out otherwise
	    }
	    var hasher = require("password-hash");
	    user.password = hasher.generate(user.password);
	    var paramCreateId = '@out' + Math.floor((Math.random() * 1000000) + 1);
	    Database.localSproc('NMS_BASE_CreateUser', [ user.username, user.password, user.email, user.firstname, user.lastname, user.active, user.active == 1 ? 0 : user.loginattempts, user.locale, paramCreateId ], function(err, responseuser) {
		if (err) {
		    return callback(err);
		}
		user.password = null;
		user.newid = responseuser[1][paramCreateId];
		callback(null);
	    });
	}, function(callback) { // Existing user
	    if (user.id == null) {
		user.id = user.newid;
		delete user.newid;
		return callback(null);// skip out otherwise
	    }
	    if (user.password != null) {
		var hasher = require("password-hash");
		user.password = hasher.generate(user.password);
	    }
	    Database.localSproc('NMS_BASE_UpdateUser', [ user.id, user.password, user.email, user.firstname, user.lastname, user.active, user.active == 1 ? 0 : user.loginattempts, user.locale ], function(err, responseuser) {
		if (err) {
		    return callback(err);
		}
		user.password = null;
		callback(null);
	    });
	} ], function(err) {
	    if (err) {
		console.log('Error Saving User' + err);
		return res.json({
		    error : 'Error Saving User' + err
		}, 500);
	    }
	    var keys = [];
	    for (group in user.groups) {
		keys.push(group);
	    }
	    Database.localSproc('NMS_BASE_DeleteUserSecurityGroupMappings', [ user.id ], function(err, result) {
		if (err) {
		    console.log('Error Clearing Security Group Mappings' + err);
		    return res.json({
			error : 'Error Clearing Security Group Mappings' + err
		    }, 500);
		}
		async.eachSeries(keys, function(key, callback) {
		    var securityGroupObj = user.groups[key];
		    if (securityGroupObj.member != 1) {
			return callback(null);
		    }
		    Database.localSproc('NMS_BASE_CreateUserSecurityGroupMapping', [ user.id, securityGroupObj.id ], function(err, newmapping) {
			if (err) {
			    return callback(err);
			}
			callback(null);
		    });
		}, function(err, result) {
		    if (err) {
			console.log('Error Saving Mappings:' + err);
			return res.json({
			    error : 'Error Saving Mappings:' + err
			}, 500);
		    }

		    // var currentSesssions = [];
		    async.each(Object.keys(sails.io.sockets.sockets), function(key, cb) {
			var socket = sails.io.sockets.sockets[key];
			sails.hooks.session.fromSocket(socket, function(err, data) {// goes
			    // through
			    // ALL
			    // the
			    // current
			    // sessions.
			    if (err) {
				console.log(err.toString());
				return cb(err);
			    }
			    if (typeof (data) == 'undefined') {
				console.log('coundnt find session from socket..');
				return cb(null);
			    }
			    console.log('getting User and policies:' + data.user.id);
			    Database.localSproc('NMS_BASE_GetUser', [ data.user.id ], function(err, users) {
				if (err) {
				    console.log("Database Error." + err);
				    cb(err);
				}
				if(typeof(users[0])=='undefined'||typeof(users[0][0])=='undefined'){
				    console.log('Attempting to check socket changes on inexistant user in database - skipping iteration');
				    return cb(null);
				}
				var user = users[0][0];
				Database.localSproc("NMS_BASE_GetUserPolicies", [ data.user.id ], function(err, policiesarray) {
				    if (err) {
					console.log('error' + err.toString());
				    }
				    policiesarray = policiesarray[0];
				    
				    var policy = {};
				    for (var i = 0; i < policiesarray.length; i++) {
					policy[policiesarray[i].name] = policiesarray[i];
				    }
				    user.policy = policy;
				    delete user.createdAt;  // Removes and ignores created/updated dates.
				    delete user.updatedAt;
				    delete data.user.createdAt;
				    delete data.user.updatedAt;
				    

				    if (!deepequal(data.user, user)) { // Check
					// to
					// see
					// if
					// there's
					// a
					// change!
					console.log('Pushing Security Update to User:' + data.user.id);
					SecurityService.triggerUserPolicyRebuild(data.user.id);
				    }
				    cb(null);
				});
			    });
			});
		    }, function(err, sessions) {
			if (err)
			    return console.log(err.toString());
		    });

		    UsersService.pushNewUser();
		    res.json({
			success : true,
			userId : user.id
		    });
		});
	    });
	});
    }
};
