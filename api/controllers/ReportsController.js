/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    testselect : function(req,res){
	
	
	var params = req.body.params;
	
	res.json([{id:1,label:'label something'},{id:2,label:'label something'+params[0]},{id:3,label:'label something'+params[0]}])
    }
};

