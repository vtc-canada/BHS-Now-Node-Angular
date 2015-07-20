/**
 * HistoryController
 * 
 * @description :: Server-side logic for managing histories
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    'get-operation-history' : function(req, res) {
	var date_MIN = req.body.date_MIN;
	var date_MAX = req.body.date_MAX;
	var lotID = req.body.lotID;

	Database.dataSproc('INV_GetLotOperationHistory', [lotID, date_MIN, date_MAX], function(err, response) {
	    if (err)
		return console.log(err.toString());

	    return res.json({
		"data" : response[0]
	    });
	});
    }
};
