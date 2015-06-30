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
    
    search : function(req, res) {
	var mysql = require('mysql');
	var searchmode = (req.body.columns && req.body.inventory);
	var donorFullText = null;//Utilities.prepfulltext(req.body.orders.donor_search);
	var inventoryId = req.body.inventory.id == ''?null : req.body.inventory.id;

	var dpWheres = '';
	if (donorFullText != null) {
	    if (isNaN(req.body.orders.donor_search)) {
		dpWheres = (dpWheres == '' ? '' : ' AND ') + 'MATCH (dpordersummary.FNAME, dpordersummary.LNAME) AGAINST ("' + donorFullText + '" IN BOOLEAN MODE)';
	    } else {
		dpWheres = (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DONOR = ' + req.body.orders.donor_search;
	    }
	}
	if(inventoryId!=null){
	    dpWheres = (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.id = ' + inventoryId;
	}

	var innerOrderOffsetLimit = '';
	if (searchmode) {// req.body.columns && req.body.order) {
	    innerOrderOffsetLimit = ' ORDER BY `' + req.body.columns[req.body.order[0].column].data + '` ' + req.body.order[0].dir + ' LIMIT ' + parseInt(req.body.length) + ' OFFSET ' + parseInt(req.body.start);
	}

	Object.keys(req.body.inventory).forEach(function(key) {
	    var val = req.body.inventory[key];
	    if (key == 'id' || key == 'donor_search') { // Skip these guys
		return;
	    }

	    if (val != null && val != '') {
		if (key == 'DATE_MIN') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE >= ' + mysql.escape(val);
		    return;
		}
		if (key == 'DATE_MAX') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE <= ' + mysql.escape(val);
		    return;
		}
		if( key == 'HASSHIPDATE' && val != null && val != ''&& val =='Y'){
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE IS NOT NULL';
		    return;
		}
		if( key == 'HASSHIPDATE' && val != null && val != ''&& val =='N'){
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE IS NULL';
		    return;
		}
		if (key == 'SHIPDATE_MIN') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE >= ' + mysql.escape(val);
		    return;
		}
		if (key == 'SHIPDATE_MAX') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE <= ' + mysql.escape(val);
		    return;
		}

		dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + "dpordersummary." + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
	    }
	});
	if (dpWheres != '') { // add initial WHERE command
	    dpWheres = 'WHERE ' + dpWheres;
	}

	// Select Data
	Database.knex
	    .raw(
		'SELECT dpordersummary.id, dpordersummary.FUNDS, dpcodes.DESC AS `SHIPFROM` ,  DATE_FORMAT(SHIPDATE,"%Y-%m-%d") AS `SHIPDATE`,  DATE_FORMAT(DATE,"%Y-%m-%d") AS `DATE`,'
	        + 'IF (dpordersummary.order_type = 1,"Sale",IF(dpordersummary.order_type = 2,"Free Gift",dpordersummary.order_type)) AS `order_type`, FORMAT(dpordersummary.GTOTAL,2) AS "GTOTAL" '
		    + 'FROM ( SELECT dpordersummary.id FROM dpordersummary '
		    + dpWheres
		    + innerOrderOffsetLimit
		    + ' ) `dpIds`'
		    + ' LEFT JOIN dpordersummary ON `dpIds`.`id` = `dpordersummary`.`id`'
		    + 'LEFT JOIN dpcodes ON (dpcodes.FIELD = \'SHIPFROM\' AND dpcodes.CODE = dpordersummary.SHIPFROM )'
	    // + dpWheres +
	    // dpexchange.currency_from) '
	    // +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id =
	    // dpexchange.currency_to) '
	    // +"WHERE dpexchange.currency_from = '"+currency_from+"'"
	    ).exec(function(err, response) {
		if (err)
		    return console.log(err.toString());

		// Select Filtered Count
		Database.knex.raw('SELECT COUNT(*) AS `count` ' + 'FROM dpordersummary ' + dpWheres
		// +'INNER JOIN dpcurrency AS curr_from ON (curr_from.id =
		// dpexchange.currency_from) '
		// +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id =
		// dpexchange.currency_to) '
		// +"WHERE dpexchange.currency_from = '"+currency_from+"'"
		).exec(function(err, countresponse) {
		    if (err)
			return console.log(err.toString());
		    // Select Total Count
		    Database.knex.count('id as count').from('dpordersummary').exec(function(err, totalcountresponse) {
			if (err)
			    return console.log(err.toString());

			return res.json({
			    "draw" : req.param('draw'),
			    "recordsTotal" : totalcountresponse[0]['count'],
			    "recordsFiltered" : countresponse[0][0]['count'],
			    "data" : response[0]
			});
		    });
		});
	    });

	// var orderFullText = Utilities.prepfulltext(req.body.orders.id);
	//
	// // WHERE's for Search Contacts page
	// function doWheres(selectIds) {
	// selectIds.whereRaw('true');
	// if (orderFullText != null) {
	// if (isNaN(req.body.orders.id)) {
	// // selectIds.andWhere(Database.knex.raw('MATCH (dpordersummary.id,
	// dpordersummary.DONOR, dpordersummary.DESC, dpordersummary.CATEGORY)
	// AGAINST ("?" IN BOOLEAN MODE)', [ orderFullText ]));
	// } else {
	// selectIds.andWhere(Database.knex.raw('dpordersummary.id = ?', [
	// req.body.orders.id ]));
	// }
	// }
	// if (req.body.orders.field != null && req.body.orders.field != '') {
	// //selectIds.andWhere(Database.knex.raw('dpcodes.FIELD = ?', [
	// req.body.orders.field ]));
	// }
	// }
	//
	// // Select Data
	// Database.knex.select('dpordersummary.id', 'dpordersummary.DONOR',
	// 'dpordersummary.DATE', 'dpordersummary.order_type',
	// 'dpordersummary.GTOTAL').from(function() {
	// var selectIds = this.select('id').from('dpordersummary');
	// // WHERE's
	// doWheres(selectIds);
	//
	// // ORDER BY
	// selectIds.orderBy(req.body.columns[req.body.order[0].column].data,
	// req.body.order[0].dir);
	// selectIds.limit(parseInt(req.body.length)).offset(parseInt(req.body.start));
	// selectIds.as('dpIds');
	// }).leftJoin('dpordersummary', 'dpIds.id',
	// 'dpordersummary.id').exec(function(err, response) {
	// if (err)
	// return console.log(err.toString());
	//
	// // Select Filtered Count
	// var filteredCountQuery = Database.knex.count('id as
	// count').from('dpordersummary');
	// doWheres(filteredCountQuery);
	// filteredCountQuery.exec(function(err, countresponse) {
	// if (err)
	// return console.log(err.toString());
	// // Select Total Count
	// Database.knex.count('id as
	// count').from('dpordersummary').exec(function(err, totalcountresponse)
	// {
	// if (err)
	// return console.log(err.toString());
	//
	// return res.json({
	// "draw" : req.param('draw'),
	// "recordsTotal" : totalcountresponse[0]['count'],
	// "recordsFiltered" : countresponse[0]['count'],
	// "data" : response
	// });
	// });
	// });
	// });
    }
};