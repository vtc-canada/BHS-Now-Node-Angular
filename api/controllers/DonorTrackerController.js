/**
 * DonorTrackerController
 * 
 * @description :: Server-side logic for managing Donortrackers
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
    getfxechangeattributes : function(req, res) {
	async.parallel({
	    currencies : function(callback) {
		Database.knex('dpcurrency').select('id', 'name', 'code', 'symbol').orderBy('order', 'asc').exec(function(err, titles) {
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
    getreportattributes : function(req, res) {
	async.parallel({
	    countries : function(callback) {
		Database.knex('dp').distinct('COUNTRY').select().whereNotNull('COUNTRY').exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		});
	    },
	    currencies : function(callback) {
		Database.knex('dpcurrency').select('id', 'name', 'code', 'symbol').orderBy('order', 'asc').exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		});
	    },
	    ship_from : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'SHIPFROM'
		}).exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		})
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
    getsearchattributes : function(req, res) {

	async.parallel({

	    lists : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'LIST'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    sols : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'SOL'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    demands : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'DEMAND'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    modes : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'MODE'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    tba_requests : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'TBAREQS'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    requests_plural : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'REQUESTS'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    pledgegroups : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'GL'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    transacts : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'TRANSACT'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
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

	    mtypes : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'MTYPE'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    litems : function(callback) {
		Database.knex('dpcodes').select('DESC', 'OTHER').distinct('CODE').where({
		    FIELD : 'LITEMP'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    sources : function(callback) {
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'SOURCE'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    exchange : function(callback) {
		Database.knex.raw('SELECT `currency_from`, `exchange_rate`, DATE_FORMAT(date,"%Y-%m-%d") AS `date`  FROM dpexchange').exec(function(err, dpexchange) {
		    if (err) {
			return console.log('SERVICE ERROR. Failed getting DPExchange on BOOT. ' + err);
		    }
		    var exchange = {};
		    dpexchange = dpexchange[0];
		    for (row in dpexchange) {
			if (typeof (exchange[dpexchange[row].currency_from]) == 'undefined') {
			    exchange[dpexchange[row].currency_from] = {};
			}
			exchange[dpexchange[row].currency_from][dpexchange[row].date] = dpexchange[row].exchange_rate;
		    }
		    callback(null, exchange);
		});
	    },
	    ship_from : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'SHIPFROM'
		}).exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		})
	    },
	    titles : function(callback) {
		Database.knex('dp').distinct('TITLE').select().exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		});
	    },
	    currencies : function(callback) {
		Database.knex('dpcurrency').select('id', 'name', 'code', 'symbol').orderBy('order', 'asc').exec(function(err, titles) {
		    if (err)
			return callback(err);
		    callback(null, titles);
		});
	    },
	    languages : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'LANGUAGE'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    
	    
	    relationships : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'LINK'
		}).exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    
	    reasons : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'NM_REASON'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    cfns : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'CFN'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    genders : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'GENDER'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    dioceses : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'DIOCESE'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    groups : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'GROUP'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    pledgors : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'PLEDGOR'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    accounts_received : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'AR'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    types : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'TYPE'
		}).exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    states : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'ST'
		}).exec(function(err, results) {
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
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'COUNTRY'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    county_codes : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC', 'MCAT_LO').where({
		    FIELD : 'COUNTY'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    phone_types : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'PHTYPE'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    address_types : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'ADDTYPE'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    languages : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'LANGUAGE'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    english : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'ENGLISH'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    decision : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'DECIS'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    mass_said : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'Q17'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    billing_schedules : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'MQA'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    designates : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'DESIGNATE'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    
	    /*
	     * , donor_classes : function(callback){
	     * Database.knex('dpcodes').distinct('CODE').select('DESC').where({
	     * FIELD : 'CLASS' }).exec(function(err, results) { if (err) return
	     * callback(err); callback(null, results); }); }
	     */
	    willsaymass : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'SAYMASS'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    values_traditional : function(callback) {
		Database.knex('dpcodes').distinct('CODE').select('DESC').where({
		    FIELD : 'Q18'
		}).exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    dtvols1 : function(callback) {
		async.parallel({
		    origin : function(dtvols1callback) {
			Database.knex('dpcodes').distinct('CODE').select('DESC').where({
			    FIELD : 'ORIGIN'
			}).exec(function(err, results) {
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
