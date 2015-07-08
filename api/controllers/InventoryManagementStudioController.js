/**
 * InventoryManagementStudioController
 * 
 * @description :: Server-side logic for managing InventoryManagementStudio
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
	res.view({
	    preloaded : {
		first : 'value'
	    }
	});
    },
    getinventoryattributes : function(req,res){
	async.parallel({
	    brands : function(callback) {
		Database.dataSproc('INV_GetMatBrandsByCategory',[1],function(err,result){
		    if (err)
			return callback(err);
		    callback(null,result[0]);
		});
	    }
	}, function(err, results) {
	    if (err)
		return res.json(err.toString(), 500);
	    return res.json({
		success : "success",
		result : results
	    });
	});
    }
};
