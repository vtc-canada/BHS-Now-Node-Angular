/**
 * DonorTrackerController
 *
 * @description :: Server-side logic for managing Donortrackers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
	res.view({preloaded:{first:'value'}});
    },
    getdpcodeattributes : function(req, res) {

	async.parallel({
	    dpcodefields : function(callback) {
		Database.knex('dpcodes').distinct('FIELD').select().exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		});
	    }
	}, function(err, result) {
	    if (err)
		return res.json(err.toString(), 500);
	    return res.json({
		success : "success",
		result : result
	    });
	});
    },
    
    getattributes : function(req, res) {

	async.parallel({
	    titles : function(callback) {
		Database.knex('dp').distinct('TITLE').select().exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		});
	    },
	    sols : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'SOL'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    lists : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'LIST'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    languages : function(callback){
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'LANGUAGE'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    tba_requests : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'TBAREQS'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    demands : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'DEMAND'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    relationships : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'LINK'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    requests_plural : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'REQUESTS'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    pledgegroups : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'GL'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    reasons : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'NM_REASON'
		}).select().exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    cfns : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'CFN'
		}).select().exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    pledgors : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'PLEDGOR'
		}).select().exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    accounts_received : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'AR'
		}).select().exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    types : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'TYPE'
		}).select().exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    states : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'ST'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    pledge_schedule : function(callback) {
		callback(null, [ {
		    id : 1,
		    label : 'Not a Pledge'
		}, {
		    id : 2,
		    label : 'Monthly'
		}, {
		    id : 3,
		    label : 'Quarterly'
		}, {
		    id : 4,
		    label : 'Semi-anually'
		}, {
		    id : 5,
		    label : 'Anually'
		} ])
	    },
	    major_donation_types : function(callback) {
		callback(null, [ {
		    id : 'A',
		    label : 'Capital Campaign - The Hasten Her Triumph'
		}, {
		    id : 'B',
		    label : 'Peace Pledge Campaign'
		} ]);
	    },
	    countries : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'COUNTRY'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    county_codes : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'COUNTY'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    phone_types : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'PHTYPE'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    address_types : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'ADDTYPE'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    languages : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'LANGUAGE'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    english : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'ENGLISH'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    decision : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'DECIS'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    mass_said : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'Q17'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    billing_schedules : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'MQA'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    transacts : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'TRANSACT'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    designates : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'DESIGNATE'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    modes : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'MODE'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    /*
	     * , donor_classes : function(callback){
	     * Database.knex('dpcodes').select('DESC').distinct('CODE').where({
	     * FIELD : 'CLASS' }).select().exec(function(err, results) { if
	     * (err) return callback(err); callback(null, results); }); }
	     */
	    willsaymass : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'SAYMASS'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    values_traditional : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'Q18'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    dtvols1 : function(callback) {
		async.parallel({
		    origin : function(dtvols1callback) {
			Database.knex('dpcodes').select('DESC').distinct('CODE').where({
			    FIELD : 'ORIGIN'
			}).select().exec(function(err, results) {
			    if (err)
				return dtvols1callback(err);
			    dtvols1callback(null, results);
			});
		    }
		}, function(err, result) {
		    callback(err, result);
		});

	    }
	}, function(err, result) {
	    if (err)
		return res.json(err.toString(), 500);
	    return res.json({
		success : "success",
		result : result
	    });
	});
    }
};

