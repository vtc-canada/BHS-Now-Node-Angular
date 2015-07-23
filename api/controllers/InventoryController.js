/**
 * InventoryController
 * 
 * @description :: Server-side logic for managing Inventory
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
    pushlot : function(req, res) {
	if (req.body.lot) {
	    SecurityService.sendMessage(null, {
		verb : 'lotUpdate',
		data : req.body.lot
	    });
	}
    },
    bulkmove : function(req, res) {
	var lots = req.body.lots;
	var value = req.body.value;
	var lotIDs = [];
	for (var i = 0; i < lots.length; i++) {
	    lotIDs.push(lots[i].id);
	}
	var lotIDsJoin = lotIDs.join(',');

	Database.dataSproc('INV_UpdateLotLocation', [ lotIDsJoin, value, req.session.user.username ], function(err, result) {
	    if (err)
		return console.log(err.toString())
		
	    res.json({
		success : true
	    });
	    console.log('pushing location lots update');
	    SecurityService.sendMessage(null, {
		verb : 'lotLocationUpdate',
		data : {lotIDs:lotIDs, locationID : value}
	    });
	})
    },
    bulkquantity : function(req,res){
	var lots = req.body.lots;
	var value = req.body.value;
	var lotIDs = [];
	for (var i = 0; i < lots.length; i++) {
	    lotIDs.push(lots[i].id);
	}
	var lotIDsJoin = lotIDs.join(',');

	Database.dataSproc('INV_UpdateLotQuantity', [ lotIDsJoin, value, req.session.user.username ], function(err, result) {
	    if (err)
		return console.log(err.toString())
		
	    res.json({
		success : true
	    });
	    console.log('pushing quantity lots update');
	    SecurityService.sendMessage(null, {
		verb : 'lotQuantityUpdate',
		data : {lotIDs:lotIDs, quantity : value}
	    });
	})
    },
    bulkstatus : function(req,res){
	var lots = req.body.lots;
	var value = req.body.value;
	var lotIDs = [];
	for (var i = 0; i < lots.length; i++) {
	    lotIDs.push(lots[i].id);
	}
	var lotIDsJoin = lotIDs.join(',');

	Database.dataSproc('INV_UpdateLotStatus', [ lotIDsJoin, value, req.session.user.username ], function(err, result) {
	    if (err)
		return console.log(err.toString())
		
	    res.json({
		success : true
	    });
	    console.log('pushing status lots update');
	    SecurityService.sendMessage(null, {
		verb : 'lotStatusUpdate',
		data : {lotIDs:lotIDs, lotStatusID : value}
	    });
	});
    },
    save : function(req, res) {
	var lot = req.body.lot;

	var cpcfg = CustomProperties.getCfg();
	var lotIDs = [];
	var propValsID = [];
	var propvals = [];
	for (var i = 0; i < cpcfg.length; i++) {
	    lotIDs.push(lot.id);
	    propValsID.push(cpcfg[i].id);
	    propvals.push(lot[cpcfg[i].property]);
	}
	lotIDs = lotIDs.join(',');
	propValsID = propValsID.join(',');
	propvals = propvals.join(',');

	if (lot.id == 'new') {
	    var paramCreateId = '@out' + Math.floor((Math.random() * 1000000) + 1);
	    Database.dataSproc('INV_InsertLot', [ lot.uomID, 1, 43, lot.brandID, lot.typeID, lot.serial_no, lot.quantity, lot.price, lot.date_added, null, req.session.user.username, lot.notes, propValsID, propvals, paramCreateId ], function(err, result) {
		if (err)
		    return console.log(err.toString());
		lot.id = result[1][paramCreateId];
		res.json({
		    success : true,
		    lot : lot
		});
	    });
	} else {
	    Database.dataSproc('INV_UpdateLot', [ lot.id, lot.uomID, lot.quantity, lot.price, lot.date_added, null, req.session.user.username, propValsID, propvals ], function(err, result) {
		if (err)
		    return console.log(err.toString());

		res.json({
		    success : true,
		    lot : lot
		});
	    });
	}
    },
    'get-lots-details' : function(req, res) {
	Database.dataSproc('INV_GetLots', [], function(err, response) {
	    if (err)
		return console.log(err.toString());

	    return res.json({
		"data" : response[0]
	    });
	});
    },
    'get-types-in-brands' : function(req, res) {
	var searchterm = null;
	if (req.body.brands instanceof Array && req.body.brands.length > 0) {
	    searchterm = req.body.brands.join(',');
	}
	Database.dataSproc('INV_GetMatTypesInBrands', [ searchterm ], function(err, result) {
	    if (err)
		return callback(err);
	    res.json({
		success : "success",
		data : result[0]
	    });
	});
    },
    'get-types-by-brand' : function(req, res) {
	Database.dataSproc('INV_GetMatTypesByBrand', [ req.body.brand || null ], function(err, result) {
	    if (err)
		return callback(err);
	    res.json({
		success : "success",
		data : result[0]
	    });
	});
    }

// ,
// search : function(req, res) {
// var mysql = require('mysql');
// var searchmode = (req.body.columns && req.body.inventory);
// var donorFullText =
// null;//Utilities.prepfulltext(req.body.orders.donor_search);
// var inventoryId = req.body.inventory.id == ''?null : req.body.inventory.id;
//
// var dpWheres = '';
// if (donorFullText != null) {
// if (isNaN(req.body.orders.donor_search)) {
// dpWheres = (dpWheres == '' ? '' : ' AND ') + 'MATCH (dpordersummary.FNAME,
// dpordersummary.LNAME) AGAINST ("' + donorFullText + '" IN BOOLEAN MODE)';
// } else {
// dpWheres = (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DONOR = ' +
// req.body.orders.donor_search;
// }
// }
// if(inventoryId!=null){
// dpWheres = (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.id = ' +
// inventoryId;
// }
//
// var innerOrderOffsetLimit = '';
// if (searchmode) {// req.body.columns && req.body.order) {
// innerOrderOffsetLimit = ' ORDER BY `' +
// req.body.columns[req.body.order[0].column].data + '` ' +
// req.body.order[0].dir + ' LIMIT ' + parseInt(req.body.length) + ' OFFSET ' +
// parseInt(req.body.start);
// }
//
// Object.keys(req.body.inventory).forEach(function(key) {
// var val = req.body.inventory[key];
// if (key == 'id' || key == 'donor_search') { // Skip these guys
// return;
// }
//
// if (val != null && val != '') {
// if (key == 'DATE_MIN') {
// dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE
// >= ' + mysql.escape(val);
// return;
// }
// if (key == 'DATE_MAX') {
// dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE
// <= ' + mysql.escape(val);
// return;
// }
// if( key == 'HASSHIPDATE' && val != null && val != ''&& val =='Y'){
// dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') +
// 'dpordersummary.SHIPDATE IS NOT NULL';
// return;
// }
// if( key == 'HASSHIPDATE' && val != null && val != ''&& val =='N'){
// dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') +
// 'dpordersummary.SHIPDATE IS NULL';
// return;
// }
// if (key == 'SHIPDATE_MIN') {
// dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') +
// 'dpordersummary.SHIPDATE >= ' + mysql.escape(val);
// return;
// }
// if (key == 'SHIPDATE_MAX') {
// dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') +
// 'dpordersummary.SHIPDATE <= ' + mysql.escape(val);
// return;
// }
//
// dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + "dpordersummary." +
// key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = "
// + mysql.escape(val));
// }
// });
// if (dpWheres != '') { // add initial WHERE command
// dpWheres = 'WHERE ' + dpWheres;
// }
//
// // Select Data
// Database.knex
// .raw(
// 'SELECT dpordersummary.id, dpordersummary.FUNDS, dpcodes.DESC AS `SHIPFROM` ,
// DATE_FORMAT(SHIPDATE,"%Y-%m-%d") AS `SHIPDATE`, DATE_FORMAT(DATE,"%Y-%m-%d")
// AS `DATE`,'
// + 'IF (dpordersummary.order_type = 1,"Sale",IF(dpordersummary.order_type =
// 2,"Free Gift",dpordersummary.order_type)) AS `order_type`,
// FORMAT(dpordersummary.GTOTAL,2) AS "GTOTAL" '
// + 'FROM ( SELECT dpordersummary.id FROM dpordersummary '
// + dpWheres
// + innerOrderOffsetLimit
// + ' ) `dpIds`'
// + ' LEFT JOIN dpordersummary ON `dpIds`.`id` = `dpordersummary`.`id`'
// + 'LEFT JOIN dpcodes ON (dpcodes.FIELD = \'SHIPFROM\' AND dpcodes.CODE =
// dpordersummary.SHIPFROM )'
// // + dpWheres +
// // dpexchange.currency_from) '
// // +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id =
// // dpexchange.currency_to) '
// // +"WHERE dpexchange.currency_from = '"+currency_from+"'"
// ).exec(function(err, response) {
// if (err)
// return console.log(err.toString());
//
// // Select Filtered Count
// Database.knex.raw('SELECT COUNT(*) AS `count` ' + 'FROM dpordersummary ' +
// dpWheres
// // +'INNER JOIN dpcurrency AS curr_from ON (curr_from.id =
// // dpexchange.currency_from) '
// // +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id =
// // dpexchange.currency_to) '
// // +"WHERE dpexchange.currency_from = '"+currency_from+"'"
// ).exec(function(err, countresponse) {
// if (err)
// return console.log(err.toString());
// // Select Total Count
// Database.knex.count('id as count').from('dpordersummary').exec(function(err,
// totalcountresponse) {
// if (err)
// return console.log(err.toString());
//
// return res.json({
// "draw" : req.param('draw'),
// "recordsTotal" : totalcountresponse[0]['count'],
// "recordsFiltered" : countresponse[0][0]['count'],
// "data" : response[0]
// });
// });
// });
// });
//
// // var orderFullText = Utilities.prepfulltext(req.body.orders.id);
// //
// // // WHERE's for Search Contacts page
// // function doWheres(selectIds) {
// // selectIds.whereRaw('true');
// // if (orderFullText != null) {
// // if (isNaN(req.body.orders.id)) {
// // // selectIds.andWhere(Database.knex.raw('MATCH (dpordersummary.id,
// // dpordersummary.DONOR, dpordersummary.DESC, dpordersummary.CATEGORY)
// // AGAINST ("?" IN BOOLEAN MODE)', [ orderFullText ]));
// // } else {
// // selectIds.andWhere(Database.knex.raw('dpordersummary.id = ?', [
// // req.body.orders.id ]));
// // }
// // }
// // if (req.body.orders.field != null && req.body.orders.field != '') {
// // //selectIds.andWhere(Database.knex.raw('dpcodes.FIELD = ?', [
// // req.body.orders.field ]));
// // }
// // }
// //
// // // Select Data
// // Database.knex.select('dpordersummary.id', 'dpordersummary.DONOR',
// // 'dpordersummary.DATE', 'dpordersummary.order_type',
// // 'dpordersummary.GTOTAL').from(function() {
// // var selectIds = this.select('id').from('dpordersummary');
// // // WHERE's
// // doWheres(selectIds);
// //
// // // ORDER BY
// // selectIds.orderBy(req.body.columns[req.body.order[0].column].data,
// // req.body.order[0].dir);
// //
// selectIds.limit(parseInt(req.body.length)).offset(parseInt(req.body.start));
// // selectIds.as('dpIds');
// // }).leftJoin('dpordersummary', 'dpIds.id',
// // 'dpordersummary.id').exec(function(err, response) {
// // if (err)
// // return console.log(err.toString());
// //
// // // Select Filtered Count
// // var filteredCountQuery = Database.knex.count('id as
// // count').from('dpordersummary');
// // doWheres(filteredCountQuery);
// // filteredCountQuery.exec(function(err, countresponse) {
// // if (err)
// // return console.log(err.toString());
// // // Select Total Count
// // Database.knex.count('id as
// // count').from('dpordersummary').exec(function(err, totalcountresponse)
// // {
// // if (err)
// // return console.log(err.toString());
// //
// // return res.json({
// // "draw" : req.param('draw'),
// // "recordsTotal" : totalcountresponse[0]['count'],
// // "recordsFiltered" : countresponse[0]['count'],
// // "data" : response
// // });
// // });
// // });
// // });
// }
};
