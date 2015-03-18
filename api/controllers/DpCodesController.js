/**
 * DpCodesController
 *
 * @description :: Server-side logic for managing Dpcodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    getdpcode : function(req,res){
	var dpCodeId = req.body.id;
	Database.knex('dpcodes').select('*').where({id:dpCodeId}).exec(function(err,response){
	   if(err||typeof(response[0])=='undefined'){
	       console.log(err.toString()+' or bad response length');
	       return res.json({error:err.toString()},500);
	   } 
	   res.json({success:'Dp Code Retrieved',dpcode:response[0]});
	});
    },
    ajax : function(req, res) {
	
	var donorFullText = Utilities.prepfulltext(req.body.dpsearch.id);

	// WHERE's for Search Contacts page
	function doWheres(selectIds) {
	    selectIds.whereRaw('true');
	    if (donorFullText != null) {
		if (isNaN(req.body.dpsearch.id)) {
		    selectIds.andWhere(Database.knex.raw('MATCH (dpcodes.FIELD, dpcodes.CODE, dpcodes.DESC, dpcodes.CATEGORY) AGAINST ("?" IN BOOLEAN MODE)', [ donorFullText ]));
		} else {
		    selectIds.andWhere(Database.knex.raw('dpcodes.id = ?', [ req.body.dpsearch.id ]));
		}
	    }
	    if (req.body.dpsearch.field != null && req.body.dpsearch.field != '') {
		selectIds.andWhere(Database.knex.raw('dpcodes.FIELD = ?', [ req.body.dpsearch.field ]));
	    }/*
	    if (req.body.dpsearch.CITY != null && req.body.dpsearch.CITY != '') {
		selectIds.andWhere(Database.knex.raw('dpcodes.CITY = ?', [ req.body.dpsearch.CITY ]));
	    }
	    if (req.body.dpsearch.ST != null && req.body.dpsearch.ST != '') {
		selectIds.andWhere(Database.knex.raw('dpcodes.ST = ?', [ req.body.dpsearch.ST ]));
	    }
	    if (req.body.dpsearch.COUNTRY != null && req.body.dpsearch.COUNTRY != '') {
		selectIds.andWhere(Database.knex.raw('dpcodes.COUNTRY = ?', [ req.body.dpsearch.COUNTRY ]));
	    }
	    if (req.body.dpsearch.ZIP != null && req.body.dpsearch.ZIP != '') {
		selectIds.andWhere(Database.knex.raw('dpcodes.ZIP = ?', [ req.body.dpsearch.ZIP ]));
	    }
	    if (req.body.dpsearch.CHECKBOX != null && req.body.dpsearch.CHECKBOX == 'Y') {
		selectIds.andWhere(Database.knex.raw('dpcodes.database_origin = 3'));
	    }
	    if (req.body.dpsearch.CHECKBOX != null && req.body.dpsearch.CHECKBOX == 'N') {
		selectIds.andWhere(Database.knex.raw('dpcodes.database_origin != 3'));
	    }
	    if (req.body.dpsearch.CLASS != null && req.body.dpsearch.CLASS.length > 0) {
		var passtring = '';
		for (var i = 0; i < req.body.dpsearch.CLASS.length; i++) {
		    if (passtring != '') {
			passtring += ','
		    }
		    passtring += "'" + req.body.dpsearch.CLASS[i] + "'";
		}
		selectIds.andWhere(Database.knex.raw("dpcodes.CLASS IN (" + passtring + ")"));
	    }*/
	}

	// Select Data
	Database.knex.select('dpcodes.id', 'dpcodes.FIELD', 'dpcodes.CODE', 'dpcodes.DESC', 'dpcodes.CATEGORY').from(function() {
	    var selectIds = this.select('id').from('dpcodes');
	    // WHERE's
	    doWheres(selectIds);

	    // ORDER BY
	    selectIds.orderBy(req.body.columns[req.body.order[0].column].data, req.body.order[0].dir);
	    selectIds.limit(parseInt(req.body.length)).offset(parseInt(req.body.start));
	    selectIds.as('dpIds');
	}).leftJoin('dpcodes', 'dpIds.id', 'dpcodes.id').exec(function(err, response) {
	    if (err)
		return console.log(err.toString());

	    // Select Filtered Count
	    var filteredCountQuery = Database.knex.count('id as count').from('dpcodes');
	    doWheres(filteredCountQuery);
	    filteredCountQuery.exec(function(err, countresponse) {
		if (err)
		    return console.log(err.toString());
		// Select Total Count
		Database.knex.count('id as count').from('dpcodes').exec(function(err, totalcountresponse) {
		    if (err)
			return console.log(err.toString());

		    return res.json({
			"draw" : req.param('draw'),
			"recordsTotal" : totalcountresponse[0]['count'],
			"recordsFiltered" : countresponse[0]['count'],
			"data" : response
		    });
		});
	    });
	});
    }
};

