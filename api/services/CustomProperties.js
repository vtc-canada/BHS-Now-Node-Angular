var mysql = require('mysql');

// var localPool =

var inv_cfg_custom_props = null;

module.exports = {
    
    getCfg : function(){
	return inv_cfg_custom_props;
	
    }
}

setTimeout(function(){ // Just throwing it later in the execution stack is enough for Database.js service to warm up. (0ms)
    Database.knex('inv_cfg_custom_props').select('id','property','last_modified').exec(function(err,response){
	   if(err){
	       console.log('Cannot get inv_cfg_custom_props:'+ err.toString());
	   } 
	   inv_cfg_custom_props = response;
	    
	});
},0);
