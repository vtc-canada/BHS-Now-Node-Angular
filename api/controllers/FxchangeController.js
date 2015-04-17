/**
 * FxchangeController
 *
 * @description :: Server-side logic for managing fxchanges
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    save : function(req, res) {

	var dpCode = req.body;
	var codeId = dpCode.id;
	delete dpCode.id;

	if (codeId != null) {
	    Database.knex('dpexchange').where({
		id : codeId
	    }).update(dpCode).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		res.json({
		    success : 'Success'
		});
		Exchange.trigger();
	    });
	} else {
	    Database.knex('dpexchange').insert(dpCode).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		res.json({
		    success : 'Success'
		});
		Exchange.trigger();
	    });
	}
    },
    destroy : function(req, res) {
	var codeId = req.body.id;
	Database.knex('dpexchange').where({
	    id : codeId
	}).del().exec(function(err, response) {
	    if (err)
		return res.json(err, 500);
	    res.json({
		success : 'Success'
	    });
	})
    },
    getdpexchange : function(req, res) {
	var dpCodeId = req.body.id;
	Database.knex
	    .raw(
		'SELECT `id`, `currency_from`,`currency_to`,DATE_FORMAT(date,"%Y-%m-%d") AS `date`,`exchange_rate` FROM dpexchange WHERE id = '
		    + dpCodeId).exec(function(err, response) {
	    if (err || typeof (response[0]) == 'undefined'|| typeof (response[0][0]) == 'undefined') {
		console.log(err.toString() + ' or bad response length');
		return res.json({
		    error : err.toString()
		}, 500);
	    }
	    res.json({
		success : 'getdpexchange Retrieved',
		dpexchange : response[0][0]
	    });
	});
    },
    ajax : function(req, res) {

	var currency_from = req.body.fxsearch.currency_from;


	// Select Data
	Database.knex.raw('SELECT dpexchange.id, curr_from.name as `currency_from`, curr_to.name as `currency_to`, DATE_FORMAT(date,"%Y-%m-%d") AS `date`,dpexchange.exchange_rate '
	     +'FROM dpexchange '
	     +'INNER JOIN dpcurrency AS curr_from ON (curr_from.id = dpexchange.currency_from) '
	     +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id = dpexchange.currency_to) '
	     +"WHERE dpexchange.currency_from = '"+currency_from+"'").exec(function(err, response) {
	    if (err)
		return console.log(err.toString());

	    // Select Filtered Count
	    Database.knex.raw('SELECT COUNT(*) AS `count` '
		     +'FROM dpexchange '
		     +'INNER JOIN dpcurrency AS curr_from ON (curr_from.id = dpexchange.currency_from) '
		     +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id = dpexchange.currency_to) '
		     +"WHERE dpexchange.currency_from = '"+currency_from+"'").exec(function(err, countresponse) {
		if (err)
		    return console.log(err.toString());
		// Select Total Count
		Database.knex.count('id as count').from('dpexchange').exec(function(err, totalcountresponse) {
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
    }
};

