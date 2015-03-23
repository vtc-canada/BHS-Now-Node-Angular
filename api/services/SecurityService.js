var users = {};

module.exports = {
    triggerUserPolicyRebuild : function(userId){
	users[userId] = true;
	sails.io.sockets.emit('user_'+userId,{verb:'reload'});
    },
    updateRequired : function(userId){
	return users[userId]||false;
    },
    clearUpdate : function(userId){
	delete user[userId];
    }
	
}