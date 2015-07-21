/**
 * OrdersController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    'get-orders-history' : function(req, res) {
	var date_MIN = req.body.date_MIN;
	var date_MAX = req.body.date_MAX;
	var lotID = req.body.lotID;

	Database.dataSproc('INV_GetOrdersHistory', [lotID==''?null:lotID, date_MIN==''?null:date_MIN, date_MAX==''?null:date_MAX], function(err, response) {
	    if (err)
		return console.log(err.toString());

	    return res.json({
		"data" : response[0]
	    });
	});
    }
};

