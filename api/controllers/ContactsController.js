/**
 * ContactsController
 * 
 * @description :: Server-side logic for managing contacts
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

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
		Database.knex('dpcodes').distinct('CODE').where({
		    FIELD : 'SOL'
		}).select().exec(function(err, sols) {
		    if (err)
			return callback(err);
		    callback(null, sols);
		});
	    },
	    types : function(callback) {
		Database.knex('dpcodes').distinct('CODE').where({
		    FIELD : 'TYPE'
		}).select().exec(function(err, types) {
		    if (err)
			return callback(err);
		    callback(null, types);
		});
	    },
	    states : function(callback) {
		Database.knex('dpcodes').distinct('CODE').where({
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
		Database.knex('dpcodes').distinct('CODE').where({
		    FIELD : 'COUNTRY'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    county_codes : function(callback) {
		Database.knex('dpcodes').distinct('CODE').where({
		    FIELD : 'COUNTY'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    phone_types : function(callback) {
		Database.knex('dpcodes').distinct('CODE').where({
		    FIELD : 'PHTYPE'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    },
	    address_types : function(callback) {
		Database.knex('dpcodes').distinct('CODE').where({
		    FIELD : 'ADDTYPE'
		}).select().exec(function(err, results) {
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
    save : function(req, res) {
	var contact = req.body;

	if (contact.id == 'new') { // New Contact.

	    Database.knex('dp').insert({
		FNAME : contact.FNAME,
		LNAME : contact.LNAME,
		TITLE : contact.TITLE.id,
		PTITLE : contact.PTITLE,
		PETSIGN : contact.PETSIGN,
		LASTCONT : contact.LASTCONT_DATE,
		SAL : contact.SAL,
		SUFF : contact.SUFF
	    }).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		Database.knex('dp').select('*').where({
		    id : response[0]
		}).exec(function(err, customer) {
		    if (err)
			return res.json(err, 500);
		    res.json({
			success : 'Donor has been saved.',
			contact : customer[0]
		    });
		});
	    });
	} else {
	    var contactId = contact.id;
	    contact.LASTCONT = contact.LASTCONT_DATE;
	    contact.TITLE = contact.TITLE.id;
	    // contact.ST = contact.ST.id;
	    delete contact.LASTCONT_DATE;
	    delete contact.id;
	    delete contact.is_modified;

	    var otherAddresses = contact.otherAddresses;
	    var dtmail = contact.dtmail;
	    var dtmajor = contact.dtmajor;
	    delete contact.otherAddresses;
	    delete contact.dtmail;
	    delete contact.dtmajor;

	    Database.knex('dp').where({
		id : contactId
	    }).update(contact).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		updateOtherAddresses(contactId, otherAddresses, function(err, data) {
		    if (err)
			return res.json(err, 500);
		    updateChildElements('dtmajor', contactId, dtmajor, function(err, data) {
			if (err)
			    return res.json(err, 500);
			updateDtmail(contactId, dtmail, function(err, data) {
			    if (err)
				return res.json(err, 500);
			    req.body.id = contactId;
			    sails.controllers.contacts.getcontact(req, res);
			});
		    });
		});
	    });
	}

	// / Updates all.. even if not modified.
	function updateChildElements(tablename, contactId, childElements, updateChildElementsCallback) {
	    async.each(childElements, function(childElement, cb) {
		delete childElement.$$hashKey;
		if (childElement.id == 'new') {
		    childElement.DONOR = contactId;
		    delete childElement.id;
		    delete childElement.tempId;
		    Database.knex(tablename).insert(childElement).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		} else if (childElement.is_deleted) {
		    Database.knex(tablename).where({
			id : childElement.id
		    }).del().exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    })
		} else { // an update -- even if not modified!
		    var childElementId = childElement.id;
		    delete childElement.id;
		    Database.knex(tablename).where({
			id : childElementId
		    }).update(childElement).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		}

	    }, function(err, data) {
		if (err)
		    updateChildElementsCallback(err);
		updateChildElementsCallback(null, data);
	    });
	}

	function updateOtherAddresses(contactId, otherAddresses, updateOtherAddressesCallback) {
	    async.each(otherAddresses, function(address, cb) {
		delete address.$$hashKey;
		if (address.id == 'new') {
		    address.DONOR = contactId;
		    delete address.id;
		    delete address.tempId;
		    Database.knex('dpothadd').insert(address).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		} else if (address.is_deleted) {
		    Database.knex('dpothadd').where({
			id : address.id
		    }).del().exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    })
		} else { // an update
		    var addressId = address.id;
		    delete address.id;
		    Database.knex('dpothadd').where({
			id : addressId
		    }).update(address).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		}

	    }, function(err, data) {
		if (err)
		    updateOtherAddressesCallback(err);
		updateOtherAddressesCallback(null, data);
	    });
	}

	function updateDtmail(contactId, transactions, updateDtmailCallback) {
	    async.each(transactions, function(transaction, cb) {
		delete transaction.DESC;
		delete transaction.DROP_CNT;
		delete transaction.DROP_DATE;
		delete transaction.$$hashKey;
		if (transaction.id == 'new') {
		    transaction.DONOR = contactId;
		    delete transaction.id;
		    delete transaction.tempId;
		    delete transaction.is_modified;
		    Database.knex('dtmail').insert(transaction).exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response);
		    });
		} else if (transaction.is_deleted) {
		    Database.knex('dtmail').where({
			id : transaction.id
		    }).del().exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response);
		    })
		} else if (transaction.is_modified) { // an update
		    var transactionId = transaction.id;
		    delete transaction.DONOR;
		    delete transaction.id;
		    delete transaction.is_modified;
		    Database.knex('dtmail').where({
			id : transactionId
		    }).update(transaction).exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response);
		    });
		} else {
		    cb(null);
		}

	    }, function(err, data) {
		if (err)
		    return updateDtmailCallback(err);
		updateDtmailCallback(null, data);
	    });
	}

    },
    getcontact : function(req, res) {
	var contactId = req.body.id;
	Database.knex
		.raw('SELECT *, DATE_FORMAT(LASTCONT,"%Y-%m-%d") AS LASTCONT_DATE FROM dp WHERE id = ' + contactId)
		.exec(
			function(err, customer) {
			    if (err)
				return res.json(err, 500);
			    Database.knex
				    .raw('SELECT * FROM dpothadd WHERE DONOR = ' + contactId)
				    .exec(
					    function(err, dpothadd) {
						if (err)
						    return res.json(err, 500);
						customer[0][0].otherAddresses = dpothadd[0];
						Database.knex
							.raw(
								"SELECT dtmail.*, dpcodes.DESC, maildrop.DROP_DATE, maildrop.DROP_CNT  FROM dtmail LEFT JOIN dpcodes ON (dpcodes.FIELD = 'SOL' AND dpcodes.CODE = dtmail.SOL AND dtmail.database_origin = dpcodes.database_origin)"
									+ " LEFT JOIN maildrop ON (maildrop.PROVCODE = CONCAT(dtmail.SOL,dtmail.LIST) AND maildrop.database_origin = dtmail.database_origin ) WHERE DONOR = "
									+ contactId).exec(function(err, dtmail) {
							    if (err)
								return res.json(err, 500);
							    customer[0][0].dtmail = dtmail[0];

							    Database.knex('dtmajor').select('*').where({
								DONOR : contactId
							    }).exec(function(err, dtmajor) {
								if (err)
								    return res.json(err, 500);
								customer[0][0].dtmajor = dtmajor;
								res.json({
								    success : 'Donor data.',
								    contact : customer[0][0]
								});
							    });
							});
					    });
			});
    },

    ajax : function(req, res) {

	req.body.contact.id = Utilities.prepfulltext(req.body.contact.id);// ((req.body.contact.id
	// ==
	// '')?null:req.body.contact.id);//((req.body.contact.id
	// ==
	// ''||req.body.contact.id
	// ==
	// null)?'NULL':req.body.contact.id);

	// WHERE's for Search Contacts page
	function doWheres(selectIds) {
	    selectIds.whereRaw('true');
	    if (req.body.contact.id != null) {
		selectIds.andWhere(Database.knex.raw('MATCH (dp.FNAME, dp.LNAME) AGAINST ("?" IN BOOLEAN MODE)', [ req.body.contact.id ]));
	    }
	}

	// Select Data
	Database.knex.select('dp.id', 'FNAME', 'LNAME').from(function() {
	    var selectIds = this.select('id').from('dp');
	    // WHERE's
	    doWheres(selectIds);

	    // ORDER BY
	    selectIds.orderBy(req.body.columns[req.body.order[0].column].data, req.body.order[0].dir);
	    selectIds.limit(parseInt(req.body.length)).offset(parseInt(req.body.start));
	    selectIds.as('dpIds');
	}).leftJoin('dp', 'dpIds.id', 'dp.id').exec(function(err, response) {
	    if (err)
		return console.log(err.toString());

	    // Select Filtered Count
	    var filteredCountQuery = Database.knex.count('id as count').from('dp');
	    doWheres(filteredCountQuery);
	    filteredCountQuery.exec(function(err, countresponse) {
		if (err)
		    return console.log(err.toString());
		// Select Total Count
		Database.knex.count('id as count').from('dp').exec(function(err, totalcountresponse) {
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
