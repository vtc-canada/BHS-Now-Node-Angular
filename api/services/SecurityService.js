var users = {};

module.exports = {
    triggerUserPolicyRebuild : function(userId) {
	users[userId] = true;
	sails.io.sockets.emit('user_' + userId, {
	    verb : 'reload'
	});
    },
    triggerAllUsersPolicyRebuild : function(userId) { // loops through socket
	// rooms, and rams
	// triggers updates
	for ( var key in sails.io.rooms) {
	    if (key.substring(0, 6) == '/user_') {
		users[parseInt(key.substring(6, key.length))] = true;
		sails.io.sockets.emit('user_' + parseInt(key.substring(6, key.length)), {
		    verb : 'reload'
		});
	    }
	}
    },
    sendMessage : function(userId, data) {
	if (userId == null) {
	    for ( var key in sails.io.rooms) {
		if (key.substring(0, 6) == '/user_') {
		    users[parseInt(key.substring(6, key.length))] = true;
		    sails.io.sockets.emit('user_' + parseInt(key.substring(6, key.length)),data);
			
//			{
//			verb : 'reload'
//		    });
		}
	    }
	}
    },
    updateRequired : function(userId) {
	return users[userId] || false;
    },
    clearUpdate : function(userId) {
	delete user[userId];
    }

}