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
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'SOL'
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
	    }
	    /*,
	    donor_classes : function(callback){
		Database.knex('dpcodes').select('DESC').distinct('CODE').where({
		    FIELD : 'CLASS'
		}).select().exec(function(err, results) {
		    if (err)
			return callback(err);
		    callback(null, results);
		});
	    }*/,
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
		LASTCONT : contact.LASTCONT,
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
	    // contact.LASTCONT = contact.LASTCONT_DATE;
	    contact.TITLE = contact.TITLE.id;
	    // contact.ST = contact.ST.id;
	    // delete contact.LASTCONT_DATE;
	    delete contact.id;
	    delete contact.is_modified;

	    var otherAddresses = contact.otherAddresses;
	    var dtmail = contact.dtmail;
	    var dtmajor = contact.dtmajor;
	    var dtvols1 = contact.dtvols1;
	    var dtbishop = contact.dtbishop;
	    var notes =  contact.notes.layman.concat(contact.notes.ecclesiastical).concat(contact.notes.volunteer).concat(contact.notes.orders);
	    delete contact.otherAddresses;
	    delete contact.dtmail;
	    delete contact.dtmajor;
	    delete contact.dtvols1;
	    delete contact.dtbishop;
	    delete contact.notes;

	    Database.knex('dp').where({
		id : contactId
	    }).update(contact).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		updateOtherAddresses(contactId, otherAddresses, function(err, data) {
		    if (err)
			return res.json(err, 500);
		    updateAllChildElements('dtmajor', contactId, dtmajor, function(err, data) {
			if (err)
			    return res.json(err, 500);
			updateDtmail(contactId, dtmail, function(err, data) {
			    if (err)
				return res.json(err, 500);
			    updateDtVols1(contactId, dtvols1, function(err, data) {
				if (err)
				    return res.json(err, 500);
				updateBishop(contactId, dtbishop, function(err, data) {
				    if (err)
					return res.json(err, 500);
				    updateChildElements('notes',contactId, notes, function(err, data) {
					if (err)
					    return res.json(err, 500);
					req.body.id = contactId;
					sails.controllers.contacts.getcontact(req, res);
				    });
				});
			    });
			});
		    });
		});
	    });
	}
	

	function updateBishop(contactId, dtbishop, cb) {
	    var isEnabled = dtbishop.enabled;
	    var bishId = dtbishop.id;
	    delete dtbishop.enabled;
	    delete dtbishop.id;

	    console.log('bishId : ' + bishId + bishId == null ? ' :null' : '');

	    if (isEnabled && bishId != null && !isNaN(bishId)) { // UPDATE
		Database.knex('dtbishop').where({
		    id : bishId
		}).update(dtbishop).exec(function(err, response) {
		    if (err)
			return cb(err);
		    cb(null, response);
		});
	    } else if (isEnabled && (bishId == null || isNaN(bishId))) { // CREATE
		dtbishop.DONOR = contactId;
		Database.knex('dtbishop').insert(dtbishop).exec(function(err, response) {
		    if (err)
			return cb(err);
		    cb(null, response);
		});
	    } else if (isEnabled == false && bishId != null && !isNaN(bishId)) { // DELETE
		Database.knex('dtbishop').where({
		    id : bishId
		}).del().exec(function(err, response) {
		    if (err)
			return cb(err);
		    cb(null, response);
		});
	    }
	}

	function updateDtVols1(contactId, dtvols1, cb) {
	    var isEnabled = dtvols1.enabled;
	    var volId = dtvols1.id;
	    delete dtvols1.enabled;
	    delete dtvols1.id;

	    console.log('volId : ' + volId + volId == null ? ' :null' : '');

	    if (isEnabled && volId != null && !isNaN(volId)) { // if enabled
		// and already
		// has an ID
		// //UPDATE
		Database.knex('dtvols1').where({
		    id : volId
		}).update(dtvols1).exec(function(err, response) {
		    if (err)
			return cb(err);
		    cb(null, response);
		});
	    } else if (isEnabled && (volId == null || isNaN(volId))) { // if
		// enabled
		// and
		// doesnt
		// have
		// an ID
		// ..
		// create
		// it.
		// /CREATE
		dtvols1.DONOR = contactId;
		Database.knex('dtvols1').insert(dtvols1).exec(function(err, response) {
		    if (err)
			return cb(err);
		    cb(null, response);
		});
	    } else if (isEnabled == false && volId != null && !isNaN(volId)) { // if
		// disabled
		// and
		// HAD
		// an
		// id
		// //
		// DELETE
		Database.knex('dtvols1').where({
		    id : volId
		}).del().exec(function(err, response) {
		    if (err)
			return cb(err);
		    cb(null, response);
		});
	    }
	}
	
	function updateChildElements(tablename, contactId, childElements, updateChildElementsCallback) {
	    async.each(childElements, function(childElement, cb) {
		delete childElement.$$hashKey;
		delete childElement.focused;  // simply dont care if it's focused
		delete childElement.modify_text; // delete modify_text
		
		if (childElement.id == null) {  // create a new one
		    childElement.DONOR = contactId;
		    delete childElement.id;
		    delete childElement.tempId;
		    Database.knex(tablename).insert(childElement).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		} else if (childElement.is_deleted) {  // delete it
		    Database.knex(tablename).where({
			id : childElement.id
		    }).del().exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    })
		} else { // an update -- even if not modified! // prolly fix this with a is_modified check.
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

	// / Updates all.. even if not modified.
	function updateAllChildElements(tablename, contactId, childElements, updateAllChildElementsCallback) {
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
		    updateAllChildElementsCallback(err);
		updateAllChildElementsCallback(null, data);
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
	    .raw(
		'SELECT `id`,`IDNUMB1`,`DONOR2`,`FNAME`,`LNAME`,`SUFF`,`TITLE`,`SAL`,`PTITLE`,`SECLN`,`ADD`,`CITY`,`ST`,`ZIP`,`COUNTRY`,`COUNTY`,`NOMAIL`,`TYPE`,`FLAGS`,`SOURCE`,`NARR`,`PHONE`,`PHON2`,`PHON3`,`PHTYPE1`,`PHTYPE2`,`PHTYPE3`,`IN_DT`,`LS_DT`,`LS_AMT`,`YTD`,`LY_YTD`,`LY2_YTD`,`LY3_YTD`,`LY4_YTD`,`GTOT`,`GIFTS`,`ENT_DT`,`UP_DT`,`MAX_DT`,`MAX_AMT`,`SIZE`,`GIVINTS`,`GIFTTYPES`,`INCLEV`,`PG_AMT`,`ACTIVE`,`LANGUAGE`,`CLASS`,`CALL`,`NM_REASON`,`PLEDGOR`,`AR`,`CFN`,`ARCDATE`,`ACDON`,`ADDON`,`AADON`,`ALDON`,`ALDDON`,`ACSALES`,`ADSALES`,`ACMASS`,`ADMASS`,`ACCONT`,`AFTRAN`,`ENGLISH`,`USER_ID`,`LAPSED`,`OCCUPATION`,`VOLUNTEER`,`DON250`,`MAILZONE`,`SLUSH`,`BUSINESS`,`CFNID`,`PUBSIG`,`TSRECID`,`TSDATE`,`TSTIME`,`TSCHG`,`TSBASE`,`TSLOCAT`,`TSIDCODE`,`TESTFLG1`,`TESTFLG2`,`TESTFLG3`,`TESTFLG4`,`TESTFLG5`,`GIFTCNT`,`OTHRCNT`,`PLEDCNT`,`LINKCNT`,`MAILCNT`,`MISCCNT`,`LASTDON`,`LARDONDT`,`LARDONAM`,`LASTSALE`, DATE_FORMAT(LASTCONT,"%Y-%m-%d") AS LASTCONT,`LASTREF`,`PETSIGN`,`database_origin`,`ecc_enabled`,`GENDER`,`RELIGIOUS`,`DIOCESE`,`GROUP`,`Q01`,`Q02`,`Q03`,`Q04`,`Q05`,`Q06`,`Q07`,`Q08`,`Q09`,`Q10`,`Q11`,`Q12`,`Q13`,`Q14`,`Q15`,`Q16`,`Q17`,`Q18`,`Q19`,`Q20`,`Q21`,`Q22`,`Q23`,DATE_FORMAT(BIRTHDATE,"%Y-%m-%d") AS BIRTHDATE,DATE_FORMAT(`ORDINATION`,"%Y-%m-%d") AS `ORDINATION`,`SAYMASS`,`DECIS`,`VOL_TRADE`,`PPRIEST`,`EP020`,DATE_FORMAT(`CONSECRATE`,"%Y-%m-%d") AS `CONSECRATE`,`SOLS`,`PERM_SOLS` FROM dp WHERE id = '
		    + contactId)
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
					    + " LEFT JOIN maildrop ON (maildrop.PROVCODE = CONCAT(dtmail.SOL,dtmail.LIST) AND maildrop.database_origin = dtmail.database_origin ) WHERE DONOR = " + contactId)
				    .exec(
					function(err, dtmail) {
					    if (err)
						return res.json(err, 500);
					    customer[0][0].dtmail = dtmail[0];

					    Database
						.knex('dtmajor')
						.select('*')
						.where({
						    DONOR : contactId
						})
						.exec(
						    function(err, dtmajor) {
							if (err)
							    return res.json(err, 500);
							customer[0][0].dtmajor = dtmajor;
							Database.knex
							    .raw(
								'SELECT `id`, `DONOR`, `VORIGIN`, DATE_FORMAT(`VSDATE`,"%Y-%m-%d") AS `VSDATE`, `VCATEG`, `VGRADE01`, `VGRADE02`, `VGRADE03`, `VGRADE04`, `VGRADE05`, `VGRADE06`, `VGRADE07`, `VGRADE08`, `VGRADE09`, `VGRADE10`, `VGRADE11`, `VGRADE12`, `VGRADE13`, `VGRADE14`, `VGRADE15`, `VGRADE16`, `VGRADE17`, `VGRADE18`, `VGRADE19`, `VGRADE20`, `VGRADE21`, `VGRADE22`, `VGRADE23`, `VLANOTH`, `VSPECTAL`, `VNOTES`, `database_origin`, `TSRECID`, `TSDATE`, `TSTIME`, `TSCHG`, `TSBASE`, `TSLOCAT`, `TSIDCODE` FROM `dtvols1` WHERE `DONOR` = '
								    + contactId)
							    .exec(
								function(err, dtvols1) {
								    if (err)
									return res.json(err, 500);
								    if (dtvols1[0] && dtvols1[0][0]) {
									customer[0][0].dtvols1 = dtvols1[0][0]; //
									customer[0][0].dtvols1.enabled = true;
								    } else {
									customer[0][0].dtvols1 = null;
								    }

								    Database.knex
									.raw(
									    'SELECT `id`,`DONOR`,`CONTPERS`,`FOLLOWUP`,`BISHPRES`,DATE_FORMAT(`LETTER1`,"%Y-%m-%d") AS `LETTER1`,DATE_FORMAT(`PHONEC1`,"%Y-%m-%d") AS `PHONEC1`,DATE_FORMAT(`LETTER2`,"%Y-%m-%d") AS `LETTER2`,DATE_FORMAT(`VISREF`,"%Y-%m-%d") AS `VISREF`,DATE_FORMAT(`VISITD`,"%Y-%m-%d") AS `VISITD`,`PERSONV1`,`PERSONV2`,`PERSONV3`,`PERSONV4`,DATE_FORMAT(`FOLUPLET`,"%Y-%m-%d") AS `FOLUPLET`,DATE_FORMAT(`FOLUPVIS`,"%Y-%m-%d") AS `FOLUPVIS`,`REPFILED`,`RESPONSE`,`BISNOTES`,`FILEDYN`,`database_origin` FROM `dtbishop` WHERE `DONOR` = '
										+ contactId).exec(function(err, dtbishop) {
									    if (err)
										return res.json(err, 500);
									    if (dtbishop[0] && dtbishop[0][0]) {
										customer[0][0].dtbishop = dtbishop[0][0]; //
										customer[0][0].dtbishop.enabled = true;
									    } else {
										customer[0][0].dtbishop = null;
									    }

									    getNotes(customer[0][0].id, function(err, notes) {
										if (err)
										    return res.json(err, 500);

										customer[0][0].notes = notes;
										res.json({
										    success : 'Donor data.',
										    contact : customer[0][0]
										});
									    })

									});
								});
						    });
					});
			    });
		});

	function getNotes(contactId, cb) {
	    async.parallel({
		layman : function(notescallback) {
		    Database.knex('notes').where({
			DONOR : contactId,
			type : 'layman'
		    }).exec(function(err, result) {
			if (err)
			    return notescallback(err);
			notescallback(null, result);
		    });
		},
		ecclesiastical : function(notescallback) {
		    Database.knex('notes').where({
			DONOR : contactId,
			type : 'ecclesiastical'
		    }).exec(function(err, result) {
			if (err)
			    return notescallback(err);
			notescallback(null, result);
		    });
		},
		volunteer : function(notescallback) {
		    Database.knex('notes').where({
			DONOR : contactId,
			type : 'volunteer'
		    }).exec(function(err, result) {
			if (err)
			    return notescallback(err);
			notescallback(null, result);
		    });
		},
		orders : function(notescallback) {
		    Database.knex('notes').where({
			DONOR : contactId,
			type : 'orders'
		    }).exec(function(err, result) {
			if (err)
			    return notescallback(err);
			notescallback(null, result);
		    });
		}
	    }, function(err, results) {
		if (err)
		    return cb(err);
		cb(null, results);
	    })
	}
    },

    ajax : function(req, res) {

	var donorFullText = Utilities.prepfulltext(req.body.contact.id);
	// req.body.contact.id = Utilities.prepfulltext(req.body.contact.id);//
	// ((req.body.contact.id
	// ==
	// '')?null:req.body.contact.id);//((req.body.contact.id
	// ==
	// ''||req.body.contact.id
	// ==
	// null)?'NULL':req.body.contact.id);

	// WHERE's for Search Contacts page
	function doWheres(selectIds) {
	    selectIds.whereRaw('true');
	    if (donorFullText != null) {
		if (isNaN(req.body.contact.id)) {
		    selectIds.andWhere(Database.knex.raw('MATCH (dp.FNAME, dp.LNAME) AGAINST ("?" IN BOOLEAN MODE)', [ donorFullText ]));
		} else {
		    selectIds.andWhere(Database.knex.raw('dp.id = ?', [ req.body.contact.id ]));
		}
	    }
	    if(req.body.contact.ADD!=null&&req.body.contact.ADD!=''){
		selectIds.andWhere(Database.knex.raw('dp.ADD = ?', [ req.body.contact.ADD ]));
	    }
	    if(req.body.contact.CITY!=null&&req.body.contact.CITY!=''){
		selectIds.andWhere(Database.knex.raw('dp.CITY = ?', [ req.body.contact.CITY ]));
	    }
	    if(req.body.contact.ST!=null&&req.body.contact.ST!=''){
		selectIds.andWhere(Database.knex.raw('dp.ST = ?', [ req.body.contact.ST ]));
	    }
	    if(req.body.contact.COUNTRY!=null&&req.body.contact.COUNTRY!=''){
		selectIds.andWhere(Database.knex.raw('dp.COUNTRY = ?', [ req.body.contact.COUNTRY ]));
	    }
	    if(req.body.contact.ZIP!=null&&req.body.contact.ZIP!=''){
		selectIds.andWhere(Database.knex.raw('dp.ZIP = ?', [ req.body.contact.ZIP ]));
	    }
	    if(req.body.contact.CHECKBOX!=null&&req.body.contact.CHECKBOX=='Y'){
		selectIds.andWhere(Database.knex.raw('dp.database_origin = 3'));
	    }
	    if(req.body.contact.CHECKBOX!=null&&req.body.contact.CHECKBOX=='N'){
		selectIds.andWhere(Database.knex.raw('dp.database_origin != 3'));
	    }
	    if(req.body.contact.CLASS!=null&&req.body.contact.CLASS.length>0){
		var passtring = '';
		for(var i=0;i<req.body.contact.CLASS.length;i++){
		    if(passtring!=''){
			passtring += ','
		    }
		    passtring += "'"+req.body.contact.CLASS[i]+"'";
		}
		selectIds.andWhere(Database.knex.raw("dp.CLASS IN ("+passtring+")"));
	    }
	}

	// Select Data
	Database.knex.select('dp.id', 'dp.FNAME', 'dp.LNAME', 'dp.ADD', 'dp.CITY', 'dp.ST','dp.COUNTRY', 'dp.ZIP').from(function() {
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
