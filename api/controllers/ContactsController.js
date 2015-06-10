/**
 * ContactsController
 * 
 * @description :: Server-side logic for managing contacts
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    export_order : function(req, res) {
	var order = req.body.order;
	var phantom = require('node-phantom');
	var fs = require("fs");
	var footnotes = order.footnotes || [];
	var orientation = order.orientation || 'portrait';
	order.locale = req.session.user.locale || 'en';
	order.footer = {
	    logo : 'default.png'
	};

	phantom.create(function(err, ph) {
	    ph.createPage(function(err, page) {
		page.set('viewportSize', {
		    width : 1024,
		    height : 480
		});
		var path = sails.config.appPath + '\\assets\\reports\\footer\\' + order.footer.logo;
		fs.readFile(path, function(err, original_data) {
		    var base64Image = original_data.toString('base64');

		    footerheight = (orientation == 'landscape' ? 15 : 30) + (4 * footnotes.length) + (footnotes.length > 0 ? 5 : 0);
		    page.set('paperSize', {
			format : 'A4',
			orientation : orientation,
			header : {

			    height : "1cm",
			    contents : ''
			},
			footer : {
			    height : footerheight + "mm", // 30mm
			    footnotes : footnotes,
			    logo : 'data:image/png;base64,' + base64Image,
			    bot_left : toClientDateTimeString(new Date(), order.timezoneoffset),
			    orientation : orientation
			}
		    }, function() {
			var start = new Date().getTime();
			console.log(sails.getBaseurl() + '/contacts/view_order?order=' + encodeURIComponent(JSON.stringify(order)));
			page.open(sails.getBaseurl() + '/contacts/view_order?order=' + encodeURIComponent(JSON.stringify(order)), function() {
			    var reportName = 'invoice_' + new Date().getTime(); // report.name.locale_label[report.locale]
			    // +
			    var filename = '.tmp\\public\\data\\' + reportName + '.pdf';
			    var url = '/data/' + reportName + '.pdf'; // sails.config.siteurl+

			    page.render(filename, function() {
				var end = new Date().getTime();
				console.log('Page Rendered in ' + (end - start).toString() + 'ms.');
				ph.exit();

				res.json({
				    pdfurl : url,
				});
			    });
			});
		    });
		});
	    })
	});

	// res.json({
	// success : 'Test',
	// pdfurl : '/test/url/'
	// });

    },
    view_contact : function(req, res) {
	var contact;
	// var pass_locale;
	// var phantom_bool;
	if (typeof (req.query) != 'undefined' && typeof (req.query.contact) != 'undefined') {
	    // see if we're passing in the report stuff as GET parameters
	    contact = JSON.parse(req.query.contact);
	    // pass_locale = report.locale;
	    // phantom_bool = true;
	}
	res.view('reports/contact.ejs', {
	    phantom : true,
	    layout : false,
	    title : '',
	    contact : contact
	});
    },
    view_order : function(req, res) {
	var order;
	// var pass_locale;
	// var phantom_bool;
	if (typeof (req.query) != 'undefined' && typeof (req.query.order) != 'undefined') {
	    // see if we're passing in the report stuff as GET parameters
	    order = JSON.parse(req.query.order);
	    // pass_locale = report.locale;
	    // phantom_bool = true;
	}
	res.view('reports/invoice.ejs', {
	    phantom : true,
	    layout : false,
	    title : '',
	    order : order
	});
    },
    save : function(req, res) {
	var contact = req.body;
	var contactId = contact.id;

	delete contact.id;
	delete contact.is_modified;

	var otherAddresses = contact.otherAddresses;
	var dtmail = contact.dtmail;
	var dpgift = contact.dpgift;
	var dpmisc = contact.dpmisc;
	var dpordersummary = contact.dpordersummary;
	var dpplg = contact.dpplg;
	var dplink = contact.dplink;
	var dplang = contact.dplang;
	var dplang_modified = contact.dplang_modified;
	var dptrans = contact.dptrans;
	var dptrans_modified = contact.dptrans_modified;
	var dpother = contact.dpother;
	var dtmajor = contact.dtmajor;
	var dtvols1 = contact.dtvols1;
	var dtbishop = contact.dtbishop;
	var notes = contact.notes.layman.concat(contact.notes.ecclesiastical).concat(contact.notes.volunteer).concat(contact.notes.orders);
	delete contact.otherAddresses;
	delete contact.dtmail;
	delete contact.dpgift;
	delete contact.dpmisc;
	delete contact.dpordersummary;
	delete contact.dpplg;
	delete contact.dplink;
	delete contact.dplang;
	delete contact.dplang_modified;
	delete contact.dptrans;
	delete contact.dptrans_modified;
	delete contact.dpother;
	delete contact.dtmajor;
	delete contact.dtvols1;
	delete contact.dtbishop;
	delete contact.notes;

	if (contact.FLAGS != null) {
	    contact.FLAGS = contact.FLAGS.join();
	    // for(var i=0;i<contact.FLAGS.length; i++){
	    //		
	    // }
	}

	if (contactId == 'new') { // New Contact.

	    Database.knex('dp').insert(contact).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		contactId = response[0]; // copies in new contactId
		updateContactTables();

		// Database.knex('dp').select('*').where({
		// id : response[0]
		// }).exec(function(err, customer) {
		// if (err)
		// return res.json(err, 500);
		// res.json({
		// success : 'Donor has been saved.',
		// contact : customer[0]
		// });
		// });

	    });
	} else {

	    // contact.LASTCONT = contact.LASTCONT_DATE;
	    // contact.TITLE = contact.TITLE;
	    // contact.ST = contact.ST.id;
	    // delete contact.LASTCONT_DATE;

	    Database.knex('dp').where({
		id : contactId
	    }).update(contact).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		updateContactTables();
	    });
	}

	function updateContactTables() {
	    async.parallel([ function(callback) {
		updateOtherAddresses(contactId, otherAddresses, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateAllChildElements('dtmajor', contactId, dtmajor, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateDpTable('dtmail', contactId, dtmail, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateDpOrders(contactId, dpordersummary, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateDpTable('dpgift', contactId, dpgift, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateDpTable('dpmisc', contactId, dpmisc, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateDpTable('dpother', contactId, dpother, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateDpTable('dpplg', contactId, dpplg, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateLinks(contactId, dplink, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		if (dplang_modified) {
		    updateMultiSelect('dplang', 'LANGUAGE', contactId, dplang, function(err, data) {
			if (err)
			    return callback(err);
			callback(null);
		    });
		} else {
		    callback(null);
		}
	    }, function(callback) {
		if (dptrans_modified) {
		    updateMultiSelect('dptrans', 'LANGUAGE', contactId, dptrans, function(err, data) {
			if (err)
			    return callback(err);
			callback(null);
		    });
		} else {
		    callback(null);
		}
	    }, function(callback) {
		updateDtVols1(contactId, dtvols1, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateBishop(contactId, dtbishop, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, function(callback) {
		updateChildElements('notes', contactId, notes, function(err, data) {
		    if (err)
			return callback(err);
		    callback(null);
		});
	    }, ], function(err, result) {
		if (err)
		    return res.json(err, 500);
		updateDonorTotals(contactId, function(err, result) {
		    if (err)
			return res.json(err, 500);
		    req.body.id = contactId;
		    sails.controllers.contacts.getcontact(req, res);
		});

	    });
	}
	
	function updateDonorTotals(contactId,callback){
	    Database.knex.raw('call update_DonationTotals('+contactId+')').exec(function(err,result){
		callback(err,result);
	    });
	}

	function updateMultiSelect(table_name, field_name, contactId, data, multiselectcallback) {

	    Database.knex(table_name).where({
		DONOR : contactId
	    }).del().exec(function(err, response) {
		if (err)
		    return multiselectcallback(err);

		async.each(data, function(row, cb) {
		    var insert_obj = {
			DONOR : contactId
		    }
		    insert_obj[field_name] = row;
		    Database.knex(table_name).insert(insert_obj).exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response);
		    });
		}, function(err, result) {
		    if (err)
			return multiselectcallback(err);
		    multiselectcallback(null, result);
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
	    } else { // no bishop, no new one, do nothing
		cb(null);
	    }
	}

	function updateLinks(contactId, dplink, linkcb) {
	    async.each(dplink, function(row, cb) {
		delete row.DESC;
		delete row.$$hashKey;
		delete row.errors;
		delete row.NAME;
		if (row.id == 'new') {
		    row.ID1 = contactId;
		    delete row.id;
		    delete row.tempId;
		    delete row.is_modified;
		    Database.knex('dplink').insert(row).exec(function(err, response) {
			if (err)
			    return cb(err);
			row.ID1 = row.ID2;
			row.ID2 = contactId;
			if (row.LINK == 'PT') {
			    row.LINK = 'CH';
			} else if (row.LINK == 'CH') {
			    row.LINK = 'PT';
			} else if (row.LINK == 'EB') {
			    row.LINK = 'EM';
			} else if (row.LINK == 'EM') {
			    row.LINK = 'EB';
			} else if (row.LINK == 'GC') {
			    row.LINK = 'GP';
			} else if (row.LINK == 'GP') {
			    row.LINK = 'GC';
			}

			Database.knex('dplink').insert(row).exec(function(err, response) {
			    if (err)
				return cb(err);
			    cb(null, response);
			});
		    });
		} else if (row.is_deleted) {
		    Database.knex('dplink').where({
			id : row.id
		    }).del().exec(function(err, response) {
			if (err)
			    return cb(err);
			var LINKwhere = row.LINK; // copies
			if (LINKwhere == 'PT') {
			    LINKwhere = 'CH';
			} else if (LINKwhere == 'CH') {
			    LINKwhere = 'PT';
			} else if (LINKwhere == 'EB') {
			    LINKwhere = 'EM';
			} else if (LINKwhere == 'EM') {
			    LINKwhere = 'EB';
			} else if (LINKwhere == 'GC') {
			    LINKwhere = 'GP';
			} else if (LINKwhere == 'GP') {
			    LINKwhere = 'GC';
			}

			Database.knex('dplink').where({
			    ID1 : row.ID2,
			    ID2 : row.ID1,
			    LINK : LINKwhere
			}).del().exec(function(err, response) {
			    if (err)
				return cb(err);
			    cb(null, response);

			});
		    })
		} else {
		    cb(null);
		}
	    }, function(err, data) {
		if (err)
		    return linkcb(err);
		linkcb(null, data);
	    });

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
	    } else {
		cb(null);
	    }
	}

	function updateChildElements(tablename, contactId, childElements, updateChildElementsCallback) {
	    async.each(childElements, function(childElement, cb) {
		delete childElement.$$hashKey;
		delete childElement.focused; // simply dont care if it's
		// focused
		delete childElement.modify_text; // delete modify_text

		if (childElement.id == null) { // create a new one
		    childElement.DONOR = contactId;
		    delete childElement.id;
		    delete childElement.tempId;
		    Database.knex(tablename).insert(childElement).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		} else if (childElement.is_deleted) { // delete it
		    Database.knex(tablename).where({
			id : childElement.id
		    }).del().exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    })
		} else { // an update -- even if not modified! // prolly fix
		    // this with a is_modified check.
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

	function updateDpOrders(contactId, orders, updateDpOrdersCallback) {
	    async.each(orders, function(order, cb) {
		delete order.$$hashKey;

		var dporderdetails = order.dporderdetails;
		delete order.dporderdetails;

		if (order.id == "new") { // create a new one
		    order.DONOR = contactId;
		    delete order.id;
		    delete order.is_modified;
		    delete order.tempId;
		    Database.knex('dpordersummary').insert(order, 'id').exec(function(err, response) {
			if (err) {
			    return cb(err);
			}
			updateDpDetails(contactId, response[0], dporderdetails, function(err) {
			    if (err) {
				return cb(err);
			    }
			    cb(null, response);
			});
		    });

		} else if (order.is_deleted) { // delete it

		    Database.knex('dporderdetails').where({
			ORDNUMD : order.id
		    }).del().exec(function(err, response) {
			if (err)
			    cb(err);
			Database.knex('dpordersummary').where({
			    id : order.id
			}).del().exec(function(err, response) {
			    if (err)
				cb(err);
			    cb(null, response);
			})
		    })

		} else if (order.is_modified) {
		    delete order.is_modified;
		    var orderId = order.id;
		    delete order.id;

		    Database.knex('dpordersummary').where({
			id : orderId
		    }).update(order).exec(function(err, response) {
			if (err)
			    return cb(err);
			updateDpDetails(contactId, orderId, dporderdetails, function(err) {
			    if (err) {
				return cb(err);
			    }
			    cb(null, response);
			});
		    });
		} else { // no event.
		    cb(null);
		}
	    }, function(err, data) {
		if (err)
		    return updateDpOrdersCallback(err);
		updateDpOrdersCallback(null, data);
	    });
	}

	function updateDpDetails(contactId, orderId, dporderdetails, cbdetails) {
	    // / Updates all.. even if not modified. // Fine for only orders
	    // that
	    // are modified.
	    async.each(dporderdetails, function(dporderdetail, cb) {
		delete dporderdetail.$$hashKey;
		if (dporderdetail.id == null) {
		    dporderdetail.DONORD = contactId;
		    dporderdetail.ORDNUMD = orderId;
		    delete dporderdetail.id;
		    Database.knex('dporderdetails').insert(dporderdetail).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		} else if (dporderdetail.is_deleted) {
		    Database.knex('dporderdetails').where({
			id : dporderdetail.id
		    }).del().exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    })
		} else { // an update -- even if not modified!
		    var dporderdetailId = dporderdetail.id;
		    delete dporderdetail.id;
		    Database.knex('dporderdetails').where({
			id : dporderdetailId
		    }).update(dporderdetail).exec(function(err, response) {
			if (err)
			    cb(err);
			cb(null, response);
		    });
		}

	    }, function(err, data) {
		if (err)
		    cbdetails(err);
		cbdetails(null, data);
	    });
	}

	/*
	 * Updates generic DP/DT tables.. deletes the union of all extra
	 * junk-columns from any possible table running through. no harm in
	 * deleting something that doesnt exist
	 */
	function updateDpTable(tablename, contactId, rows, updateDpCallback) {
	    async.each(rows, function(row, cb) {
		delete row.DESC;
		delete row.DROP_CNT;
		delete row.DROP_DATE;
		delete row.$$hashKey;
		if (row.id == 'new') {
		    row.DONOR = contactId;
		    delete row.id;
		    delete row.tempId;
		    delete row.is_modified;
		    Database.knex(tablename).insert(row).exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response);
		    });
		} else if (row.is_deleted) {
		    Database.knex(tablename).where({
			id : row.id
		    }).del().exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response);
		    })
		} else if (row.is_modified) { // an update
		    var rowId = row.id;
		    delete row.DONOR;
		    delete row.id;
		    delete row.is_modified;
		    Database.knex(tablename).where({
			id : rowId
		    }).update(row).exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response);
		    });
		} else {
		    cb(null);
		}
	    }, function(err, data) {
		if (err)
		    return updateDpCallback(err);
		updateDpCallback(null, data);
	    });
	}
    },
    export_contact : function(req, res) {
	// sails.cont
	sails.controllers.contacts.doGetContact(req, res, function(err, results) {
	    if (err) {
		return res.json(err, 500);
	    }
	    var contact = results['contact'];
	    contact.timezoneoffset = req.body.timezoneoffset;
	    for (var i = 0; i < contact.notes.layman.length; i++) {
		contact.notes.layman[i].last_modified = toClientDateTimeString(contact.notes.layman[i].last_modified, contact.timezoneoffset);

	    }

	    var phantom = require('node-phantom');
	    var fs = require("fs");
	    var footnotes = [];
	    var orientation = 'portrait';
	    contact.locale = req.session.user.locale || 'en';
	    contact.footer = {
		logo : 'default.png'
	    };

	    phantom.create(function(err, ph) {
		ph.createPage(function(err, page) {
		    page.set('viewportSize', {
			width : 1024,
			height : 480
		    });
		    var path = sails.config.appPath + '\\assets\\reports\\footer\\' + contact.footer.logo;
		    fs.readFile(path, function(err, original_data) {
			var base64Image = original_data.toString('base64');

			footerheight = (orientation == 'landscape' ? 15 : 30) + (4 * footnotes.length) + (footnotes.length > 0 ? 5 : 0);
			page.set('paperSize', {
			    format : 'A4',
			    orientation : orientation,
			    header : {

				height : "1cm",
				contents : ''
			    },
			    footer : {
				height : footerheight + "mm", // 30mm
				footnotes : footnotes,
				logo : 'data:image/png;base64,' + base64Image,
				bot_left : toClientDateTimeString(new Date(), contact.timezoneoffset),
				orientation : orientation
			    }
			}, function() {
			    var start = new Date().getTime();
			    console.log(sails.getBaseurl() + '/contacts/view_contact?contact=' + encodeURIComponent(JSON.stringify(contact)));
			    page.open(sails.getBaseurl() + '/contacts/view_contact?contact=' + encodeURIComponent(JSON.stringify(contact)), function() {
				var reportName = 'contact_' + new Date().getTime(); // report.name.locale_label[report.locale]
				// +
				var filename = '.tmp\\public\\data\\' + reportName + '.pdf';
				var url = '/data/' + reportName + '.pdf'; // sails.config.siteurl+

				page.render(filename, function() {
				    var end = new Date().getTime();
				    console.log('Page Rendered in ' + (end - start).toString() + 'ms.');
				    ph.exit();

				    res.json({
					pdfurl : url,
				    });
				});
			    });
			});
		    });
		})
	    });

	});
    },
    getcontact : function(req, res) {

	sails.controllers.contacts.doGetContact(req, res, function(err, results) {
	    if (err) {
		console.log(err.toString());
		return res.json(err, 500);
	    }
	    res.json({
		success : 'Donor data.',
		contact : results['contact']
	    });
	});
    },
    destroy : function(req, res) {
	var contact = req.body;
	if (isNaN(parseInt(contact.id))) {
	    return console.log('attempt to delete NON-Integer Contact ID: POSTed-' + JSON.stringify(contact));
	}
	async.parallel({
	    dpordersummary : function(callback) {
		Database.knex('dporderdetails').where('DONORD', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    Database.knex('dpordersummary').where('DONOR', contact.id).del().exec(function(err, data) {
			if (err) {
			    return callback(err);
			}
			callback(null, data);
		    });
		});
	    },

	    otherAddresses : function(callback) {
		Database.knex('dpothadd').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dtmail : function(callback) {
		Database.knex('dtmail').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dpgift : function(callback) {
		Database.knex('dpgift').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dpmisc : function(callback) {
		Database.knex('dpmisc').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dpother : function(callback) {
		Database.knex('dpother').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dpplg : function(callback) {
		Database.knex('dpplg').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dplink : function(callback) {
		Database.knex('dplink').where('ID1', contact.id).orWhere('ID2', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dplang : function(callback) {
		Database.knex('dplang').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dptrans : function(callback) {
		Database.knex('dptrans').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dtmajor : function(callback) {
		Database.knex('dtmajor').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dtvols1 : function(callback) {
		Database.knex('dtvols1').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    dtbishop : function(callback) {
		Database.knex('dtbishop').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    },
	    notes : function(callback) {
		Database.knex('notes').where('DONOR', contact.id).del().exec(function(err, data) {
		    if (err) {
			return callback(err);
		    }
		    callback(null, data);
		});
	    }
	}, function(err, results) {
	    if (err) {
		console.log(JSON.stringify(err));
		return res.json({
		    error : JSON.stringify(err)
		}, 500);
	    }
	    Database.knex('dp').where('id', contact.id).del().exec(function(err, data) {
		if (err) {
		    console.log(JSON.stringify(err));
		    return res.json({
			error : JSON.stringify(err)
		    }, 500);
		}
		return res.json({
		    success : 'Deleted Contact ' + contact.id
		});
	    });

	});
    },
    doGetContact : function(req, res, getContactCallback) {
	var contactId = req.body.id;
	// Database.knex
	// .raw()

	// .exec(
	// function(err, customer) {
	// if (err)
	// return res.json(err, 500);

	async
	    .parallel(
		{
		    dpordersummary : function(callback) {
			Database.knex
			    .raw(
				'SELECT `id`, `DONOR`,`SOL`,DATE_FORMAT(DATE,"%Y-%m-%d") AS `DATE`,`ORDNUM`,`SHIPFROM`,`OPER`,DATE_FORMAT(SHIPDATE,"%Y-%m-%d") AS `SHIPDATE`,DATE_FORMAT(`ORIGDATE`,"%Y-%m-%d") AS `ORIGDATE`,`ORIGENV`,`IPAID`,`SANDH`,`SANDHAMT`,`CREDITCD`,`CASHONLY`,`CASH`,`CREDIT`,`ETOTAL`,`ECONV`,`ESHIP`,`PSTCALC`,`GSTCALC`,`HSTCALC`,`NYTCALC`,`GTOTAL`,`VNOTE`,`BATCHED`,`PST`,`GST`,`HST`,`NYTAX`,`COUNTY`,`COUNTYNM`,`ENT_DT`,`FUNDS`,`GFUNDS`,`CURCONV`,`TITLE`,`FNAME`,`LNAME`,`SUFF`,`SECLN`,`ADD`,`CITY`,`ST`,`ZIP`,`COUNTRY`,`PHTYPE1`,`PHTYPE2`,`PHTYPE3`,`PHONE`,`PHON2`,`PHON3`,`LASTPAGE`,`PRINFLAG`,`TSRECID`,`TSDATE`,`TSTIME`,`TSCHG`,`TSBASE`,`TSLOCAT`,`TSIDCODE`,`SURFCOST`,`MBAGCOST`,`OTHCOST`,`MAILFLAG`,`PRINREM`,`RETURNED`, `order_type` FROM dpordersummary WHERE DONOR = '
				    + contactId).exec(function(err, data) {
				if (err)
				    return callback(err)

				async.each(Object.keys(data[0]), function(key, cbdetails) {
				    Database.knex('dporderdetails').select('*').where({
					ORDNUMD : data[0][key].id
				    }).exec(function(err, detailsdata) {
					if (err)
					    return cbdetails(err);

					data[0][key].dporderdetails = detailsdata;
					cbdetails(null);
				    });
				}, function(err, results) {
				    if (err)
					return callback(err);
				    callback(null, data[0]);
				});

			    });
		    },
		    contact : function(callback) {
			Database.knex
			    .raw(
				'SELECT `id`,`IDNUMB1`,`DONOR2`,`FNAME`,`LNAME`,`SUFF`,`TITLE`,`SAL`,`PTITLE`,`SECLN`,`ADD`,`CITY`,`ST`,`ZIP`,`COUNTRY`,`COUNTY`,`NOMAIL`,`TYPE`,`FLAGS`,`SOURCE`,`NARR`,`PHONE`,`PHON2`,`PHON3`,`PHTYPE1`,`PHTYPE2`,`PHTYPE3`,`IN_DT`,`LS_DT`,`LS_AMT`,`YTD`,`LY_YTD`,`LY2_YTD`,`LY3_YTD`,`LY4_YTD`,`GTOT`,`GIFTS`,`ENT_DT`,`UP_DT`,`MAX_DT`,`MAX_AMT`,`SIZE`,`GIVINTS`,`GIFTTYPES`,`INCLEV`,`PG_AMT`,`ACTIVE`,`LANGUAGE`,`CLASS`,`CALL`,`NM_REASON`,`PLEDGOR`,`AR`,`CFN`,`ARCDATE`,`ACDON`,`ADDON`,`AADON`,`ALDON`,`ALDDON`,`ACSALES`,`ADSALES`,`ACMASS`,`ADMASS`,`ACCONT`,`AFTRAN`,`ENGLISH`,`USER_ID`,`LAPSED`,`OCCUPATION`,`VOLUNTEER`,`DON250`,`MAILZONE`,`SLUSH`,`BUSINESS`,`CFNID`,`PUBSIG`,`TSRECID`,`TSDATE`,`TSTIME`,`TSCHG`,`TSBASE`,`TSLOCAT`,`TSIDCODE`,`TESTFLG1`,`TESTFLG2`,`TESTFLG3`,`TESTFLG4`,`TESTFLG5`,`GIFTCNT`,`OTHRCNT`,`PLEDCNT`,`LINKCNT`,`MAILCNT`,`MISCCNT`,`LASTDON`,`LARDONDT`,`LARDONAM`,`LASTSALE`, DATE_FORMAT(LASTCONT,"%Y-%m-%d") AS LASTCONT,`LASTREF`,`PETSIGN`,`ecc_enabled`,`GENDER`,`RELIGIOUS`,`DIOCESE`,`GROUP`,`Q01`,`Q02`,`Q03`,`Q04`,`Q05`,`Q06`,`Q07`,`Q08`,`Q09`,`Q10`,`Q11`,`Q12`,`Q13`,`Q14`,`Q15`,`Q16`,`Q17`,`Q18`,`Q19`,`Q20`,`Q21`,`Q22`,`Q23`,DATE_FORMAT(BIRTHDATE,"%Y-%m-%d") AS BIRTHDATE,DATE_FORMAT(`ORDINATION`,"%Y-%m-%d") AS `ORDINATION`,`SAYMASS`,`DECIS`,`VOL_TRADE`,`PPRIEST`,`EP020`,DATE_FORMAT(`CONSECRATE`,"%Y-%m-%d") AS `CONSECRATE`,`SOLS`,`PERM_SOLS`,`total_donation_amount`,`total_donation_records` FROM dp WHERE id = '
				    + contactId).exec(function(err, data) {
				if (err)
				    return callback(err)

				if (data[0][0].FLAGS != null) {
				    data[0][0].FLAGS = data[0][0].FLAGS.split(",");
				    for (var i = 0; i < data[0][0].FLAGS.length; i++) {
					data[0][0].FLAGS[i] = data[0][0].FLAGS[i].trim();
				    }
				}

				return callback(null, data[0][0]);
			    });
		    },
		    otherAddresses : function(callback) {
			Database.knex.raw('SELECT * FROM dpothadd WHERE DONOR = ' + contactId).exec(function(err, data) {
			    if (err)
				return callback(err)
			    return callback(null, data[0]);
			});
		    },
		    dtmail : function(callback) {
			Database.knex.raw(
			    "SELECT dtmail.*, dpcodes.DESC,  DATE_FORMAT(MAX(maildrop.DROP_DATE),'%Y-%m-%d')  AS `DROP_DATE`, SUM(maildrop.DROP_CNT) AS `DROP_CNT`  FROM dtmail LEFT JOIN dpcodes ON (dpcodes.FIELD = 'SOL' AND dpcodes.CODE = dtmail.SOL )"
				+ " LEFT JOIN maildrop ON (maildrop.PROVCODE = CONCAT(dtmail.SOL,dtmail.LIST)  ) WHERE DONOR = " + contactId + " GROUP BY dtmail.id").exec(function(err, data) {
			    if (err)
				return callback(err)
			    return callback(null, data[0]);
			});
		    },
		    dpgift : function(callback) {
			Database.knex.raw("SELECT dpgift.*, dpcodes.DESC FROM   dpgift LEFT JOIN dpcodes ON ( dpcodes.FIELD = 'SOL' AND dpcodes.CODE = dpgift.SOL  ) WHERE  DONOR = " + contactId).exec(function(err, data) {
			    if (err)
				return callback(err)
			    return callback(null, data[0]);
			});
		    },
		    dpmisc : function(callback) {
			Database.knex
			    .raw(
				'SELECT `dpmisc`.`id`,`dpmisc`.`DONOR`,`dpmisc`.`SOL`, DATE_FORMAT(`MDATE`,"%Y-%m-%d") AS `MDATE`, `dpmisc`.`MTYPE`,`dpmisc`.`MYEAR`,`dpmisc`.`MCOUNT`,`dpmisc`.`MAMT`,`dpmisc`.`MNOTES`,`dpmisc`.`TSRECID`,`dpmisc`.`TSDATE`,`dpmisc`.`TSTIME`,`dpmisc`.`TSCHG`,`dpmisc`.`TSBASE`,`dpmisc`.`TSLOCAT`,`dpmisc`.`TSIDCODE`, dpcodes.DESC FROM   dpmisc LEFT JOIN dpcodes ON ( dpcodes.FIELD = "SOL" AND dpcodes.CODE = dpmisc.SOL  ) WHERE  DONOR = '
				    + contactId).exec(function(err, data) {
				if (err)
				    return callback(err)
				return callback(null, data[0]);
			    });
		    },
		    dpother : function(callback) {
			Database.knex
			    .raw(
				'SELECT `dpother`.`id`,`dpother`.`DONOR`,DATE_FORMAT(`dpother`.`DATE`,"%Y-%m-%d") AS `DATE` ,`dpother`.`SURVEY`,`dpother`.`SURV_ANS`,`dpother`.`TRANSACT`,`dpother`.`ENVNO`,`dpother`.`LIST`,`dpother`.`NARRA`,`dpother`.`AMT`,`dpother`.`CURR`,`dpother`.`SOL`,`dpother`.`CASH`,`dpother`.`DEMAND`,`dpother`.`LABEL`,`dpother`.`MODE`,`dpother`.`GL`,`dpother`.`WEB`,`dpother`.`CAMP_TYPE`,`dpother`.`REQUESTS`,`dpother`.`TBAREQS`,`dpother`.`TSRECID`,`dpother`.`TSDATE`,`dpother`.`TSTIME`,`dpother`.`TSCHG`,`dpother`.`TSBASE`,`dpother`.`TSLOCAT`,`dpother`.`TSIDCODE`, dpcodes.DESC FROM   dpother LEFT JOIN dpcodes ON ( dpcodes.FIELD = "SOL" AND dpcodes.CODE = dpother.SOL ) WHERE  DONOR = '
				    + contactId).exec(function(err, data) {
				if (err)
				    return callback(err)
				return callback(null, data[0]);
			    });
		    },
		    dpplg : function(callback) {
			Database.knex.raw("SELECT dpplg.*, dpcodes.DESC FROM   dpplg LEFT JOIN dpcodes ON ( dpcodes.FIELD = 'SOL' AND dpcodes.CODE = dpplg.SOL  ) WHERE  DONOR = " + contactId).exec(function(err, data) {
			    if (err)
				return callback(err)
			    return callback(null, data[0]);
			});
		    },
		    dplink : function(callback) {
			Database.knex
			    .raw(
				"SELECT dplink.id, dplink.ID1, dplink.ID2, dplink.LINK, CONCAT ( dp.FNAME , ' ' , dp.LNAME ) as 'NAME', dpcodes.DESC FROM dplink LEFT JOIN dpcodes ON ( dpcodes.FIELD = 'LINK' AND dpcodes.CODE = dplink.LINK ) INNER JOIN dp ON (dplink.ID2 = dp.id) WHERE ID1 = "
				    + contactId).exec(function(err, data) {
				if (err)
				    return callback(err)
				return callback(null, data[0]);
			    });
		    },
		    dplang : function(callback) {
			Database.knex.raw("SELECT dplang.LANGUAGE FROM dplang LEFT JOIN dpcodes ON ( dpcodes.FIELD = 'LANGUAGE' AND dpcodes.CODE = dplang.LANGUAGE ) WHERE DONOR = " + contactId).exec(function(err, data) {
			    if (err)
				return callback(err);

			    var dplang = [];
			    for ( var lang in data[0]) {
				dplang.push(data[0][lang]['LANGUAGE']);
			    }
			    return callback(null, dplang);
			});
		    },
		    dptrans : function(callback) {
			Database.knex.raw("SELECT dptrans.LANGUAGE FROM dptrans LEFT JOIN dpcodes ON ( dpcodes.FIELD = 'LANGUAGE' AND dpcodes.CODE = dptrans.LANGUAGE ) WHERE DONOR = " + contactId).exec(function(err, data) {
			    if (err)
				return callback(err);
			    var dptrans = [];
			    for ( var lang in data[0]) {
				dptrans.push(data[0][lang]['LANGUAGE']);
			    }
			    return callback(null, dptrans);
			});
		    },
		    dtmajor : function(callback) {
			Database.knex('dtmajor').select('*').where({
			    DONOR : contactId
			}).exec(function(err, data) {
			    if (err)
				return callback(err)
			    return callback(null, data);
			});
		    },
		    dtvols1 : function(callback) {
			Database.knex
			    .raw(
				'SELECT `id`, `DONOR`, `VORIGIN`, DATE_FORMAT(`VSDATE`,"%Y-%m-%d") AS `VSDATE`, `VCATEG`, `VGRADE01`, `VGRADE02`, `VGRADE03`, `VGRADE04`, `VGRADE05`, `VGRADE06`, `VGRADE07`, `VGRADE08`, `VGRADE09`, `VGRADE10`, `VGRADE11`, `VGRADE12`, `VGRADE13`, `VGRADE14`, `VGRADE15`, `VGRADE16`, `VGRADE17`, `VGRADE18`, `VGRADE19`, `VGRADE20`, `VGRADE21`, `VGRADE22`, `VGRADE23`, `VLANOTH`, `VSPECTAL`, `VNOTES`, `TSRECID`, `TSDATE`, `TSTIME`, `TSCHG`, `TSBASE`, `TSLOCAT`, `TSIDCODE` FROM `dtvols1` WHERE `DONOR` = '
				    + contactId).exec(function(err, data) {
				if (err)
				    return callback(err)

				if (data[0] && data[0][0]) {
				    data[0][0].enabled = true;
				    return callback(null, data[0][0]);
				}
				return callback(null, null);

			    });
		    },
		    dtbishop : function(callback) {
			Database.knex
			    .raw(
				'SELECT `id`,`DONOR`,`CONTPERS`,`FOLLOWUP`,`BISHPRES`,DATE_FORMAT(`LETTER1`,"%Y-%m-%d") AS `LETTER1`,DATE_FORMAT(`PHONEC1`,"%Y-%m-%d") AS `PHONEC1`,DATE_FORMAT(`LETTER2`,"%Y-%m-%d") AS `LETTER2`,DATE_FORMAT(`VISREF`,"%Y-%m-%d") AS `VISREF`,DATE_FORMAT(`VISITD`,"%Y-%m-%d") AS `VISITD`,`PERSONV1`,`PERSONV2`,`PERSONV3`,`PERSONV4`,DATE_FORMAT(`FOLUPLET`,"%Y-%m-%d") AS `FOLUPLET`,DATE_FORMAT(`FOLUPVIS`,"%Y-%m-%d") AS `FOLUPVIS`,`REPFILED`,`RESPONSE`,`BISNOTES`,`FILEDYN` FROM `dtbishop` WHERE `DONOR` = '
				    + contactId).exec(function(err, data) {
				if (err)
				    return callback(err)
				if (data[0] && data[0][0]) {
				    data[0][0].enabled = true;
				    return callback(null, data[0][0]);
				}
				return callback(null, null);
			    });
		    },
		    notes : function(callback) {
			getNotes(contactId, function(err, notes) {
			    if (err)
				return callback(err);

			    return callback(null, notes);
			});
		    }
		}, function(err, results) {
		    if (err)
			return getContactCallback(err);
		    // return res.json(err, 500);
		    for ( var key in results) {
			if (key != 'contact') {
			    results['contact'][key] = results[key];
			}
		    }
		    getContactCallback(null, results);

		});
	// });

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
    export : function(req, res) {

	sails.controllers.contacts.querycontacts(req, res, function(err, response) {
	    if (err) {
		return console.log('exportContacts:' + err.toString());
	    }
	    var results = response.data;

	    var bodystring = 'id,FNAME,LNAME,ADD,CITY,ST,COUNTRY,ZIP,TITLE,SECLN,SAL\r\n';
	    var dbfstructure = [];
	    for (var i = 0; i < results.length; i++) {
		if (i % 10000 == 0) {
		    console.log(i);
		}
		bodystring += '"' + (results[i].id == null ? '' : results[i].id) + '"';
		bodystring += ',"' + (results[i].FNAME == null ? '' : results[i].FNAME) + '"';
		bodystring += ',"' + (results[i].LNAME == null ? '' : results[i].LNAME) + '"';
		bodystring += ',"' + (results[i].ADD == null ? '' : results[i].ADD) + '"';
		bodystring += ',"' + (results[i].CITY == null ? '' : results[i].CITY) + '"';
		bodystring += ',"' + (results[i].ST == null ? '' : results[i].ST) + '"';
		bodystring += ',"' + (results[i].COUNTRY == null ? '' : results[i].COUNTRY) + '"';
		bodystring += ',"' + (results[i].ZIP == null ? '' : results[i].ZIP) + '"';
		bodystring += ',"' + (results[i].TITLE == null ? '' : results[i].TITLE) + '"';
		bodystring += ',"' + (results[i].SECLN == null ? '' : results[i].SECLN) + '"';
		bodystring += ',"' + (results[i].SAL == null ? '' : results[i].SAL) + '"';

		bodystring += '\r\n';

		dbfstructure.push({
		    id : results[i].id,
		    FNAME : results[i].FNAME || '',
		    LNAME : results[i].LNAME || '',
		    ADD : results[i].ADD || '',
		    CITY : results[i].CITY || '',
		    ST : results[i].ST || '',
		    COUNTRY : results[i].COUNTRY || '',
		    ZIP : results[i].ZIP || '',
		    TITLE : results[i].TITLE || '',
		    SECLN : results[i].SECLN || '',
		    SAL : results[i].SAL || ''
		});
	    }
	    // console.log(bodystring);

	    var exportName = 'contacts_' + new Date().getTime();
	    var filenamecsv = '.tmp\\public\\data\\' + exportName + '.csv';
	    var filenamedbf = '.tmp\\public\\data\\' + exportName + '.dbf';
	    var urlcsv = '/data/' + exportName + '.csv';
	    var urldbf = '/data/' + exportName + '.dbf';

	    var fs = require('fs');
	    var dbf = require('dbf');
	    async.parallel({
		urlcsv : function(cb) {
		    fs.writeFile(filenamecsv, bodystring, function(err) {
			if (err) {
			    return console.log(err);
			}
			cb(null, urlcsv);
		    });
		},
		urldbf : function(cb) {
		    var buf = dbf.structure(dbfstructure);
		    fs.writeFile(filenamedbf, toBuffer(buf.buffer), function(err) {
			if (err) {
			    return console.log(err);
			}
			cb(null, urldbf);
		    });
		}
	    }, function(err, result) {
		res.json({
		    csvurl : result.urlcsv,
		    dbfurl : result.urldbf
		});
	    });

	});
	function toBuffer(ab) {
	    var buffer = new Buffer(ab.byteLength);
	    var view = new Uint8Array(ab);
	    for (var i = 0; i < buffer.length; ++i) {
		buffer[i] = view[i];
	    }
	    return buffer;
	}
    },
    search : function(req, res) {
	sails.controllers.contacts.querycontacts(req, res, function(err, response) {
	    if (err) {
		return console.log('searchContacts:' + err.toString());
	    }
	    res.json({
		draw : req.query.draw,
		recordsTotal : response.recordsTotal,
		recordsFiltered : response.recordsFiltered,
		data : response.data
	    });
	});
    },
    querycontacts : function(req, res, contactsCallback) {
	var mysql = require('mysql');

	var searchmode = (req.body.columns && req.body.order);

	var mode = req.body.contact.mode == 'true' ? 'and' : 'or';

	var dpothadd = req.body.contact.dpothadd;
	var dpordersummary = req.body.contact.dpordersummary;
	var dplang = req.body.contact.dplang;
	var dptrans = req.body.contact.dptrans;
	var dtmajor = req.body.contact.dtmajor;
	var dtbishop = req.body.contact.dtbishop;
	var dpgift = req.body.contact.dpgift;
	var dpother = req.body.contact.dpother;
	var dtmail = req.body.contact.dtmail;
	var dpplg = req.body.contact.dpplg;
	var dpmisc = req.body.contact.dpmisc;
	var dtvols1 = req.body.contact.dtvols1;
	var notes = req.body.contact.notes;

	delete req.body.contact.dpothadd;
	delete req.body.contact.dpordersummary;
	delete req.body.contact.dplang;
	delete req.body.contact.dptrans;
	delete req.body.contact.dtmajor;
	delete req.body.contact.dtbishop;

	delete req.body.contact.dpgift;
	delete req.body.contact.dpother;
	delete req.body.contact.dtmail;
	delete req.body.contact.dpplg;
	delete req.body.contact.dpmisc;
	delete req.body.contact.dtvols1;
	delete req.body.contact.notes;

	var dpothaddFlag = false;
	var dpordersummaryFlag = false;
	var dplangFlag = false;
	var dptransFlag = false;
	var dtmajorFlag = false;
	var dtbishopFlag = false;

	var dpgiftFlag = false; // Flag for dpgift join
	var dpotherFlag = false; // Flag for dpother join
	var dtmailFlag = false;
	var dpplgFlag = false;
	var dpmiscFlag = false;
	var dtvols1Flag = false;
	var notesFlag = false;

	var joinCount = 0; // Pre-Count of total number of innerSelect Joins
	var dpWheres = '';
	addDpWheres();

	var dpothaddWheres = '';
	var dpordersummaryWheres = '';
	var dplangWheres = '';
	var dptransWheres = '';
	var dtmajorWheres = '';
	var dtbishopWheres = '';

	var dpGiftWheres = '';
	var dpOtherWheres = '';
	var dtMailWheres = '';
	var dpPlgWheres = '';
	var dpMiscWheres = '';
	var dtVols1Wheres = '';
	var notesWheres = '';

	determineJoinsAndWheres(); // Sets up joinCount, dpgift flag,
	// dpGiftWheres, dpother flag, dpOtherWheres

	var innerSelect = ''; // Inner select builds on this variable

	var selectItems = '`dp`.`id`, `dp`.`FNAME`, `dp`.`LNAME`, `dp`.`ADD`, `dp`.`CITY`, `dp`.`ST`, `dp`.`COUNTRY`, `dp`.`ZIP` '; // Outer
	// Select
	if (!searchmode) {
	    selectItems = '`dp`.`id`, `dp`.`FNAME`, `dp`.`LNAME`, `dp`.`ADD`, `dp`.`CITY`, `dp`.`ST`, `dp`.`COUNTRY`, `dp`.`ZIP`, `TITLE`, `SECLN`, `SAL`';
	}

	var innerOrderOffsetLimit = '';
	if (searchmode) {// req.body.columns && req.body.order) {
	    innerOrderOffsetLimit = ' ORDER BY `' + req.body.columns[req.body.order[0].column].data + '` ' + req.body.order[0].dir + ' LIMIT ' + parseInt(req.body.length) + ' OFFSET ' + parseInt(req.body.start);
	}

	if (joinCount == 0) {
	    innerSelect = 'SELECT `dp`.`id` from `dp`' + (mode == 'and' && dpWheres != '' ? 'WHERE ' : ' ') + dpWheres;
	} else {
	    if (mode == 'or') {
		if (dpgiftFlag) {
		    innerSelect = (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dpgift` ON `dp`.`id` = `dpgift`.`DONOR` ' + dpGiftWheres + (joinCount > 1 ? ')' : '');// +;
		}
		if (dpotherFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dpother` ON `dp`.`id` = `dpother`.`DONOR` ' + dpOtherWheres + (joinCount > 1 ? ')' : '');
		}
		if (dtmailFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dtmail` ON `dp`.`id` = `dtmail`.`DONOR` ' + dtMailWheres + (joinCount > 1 ? ')' : '');
		}
		if (dpplgFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dpplg` ON `dp`.`id` = `dpplg`.`DONOR` ' + dpPlgWheres + (joinCount > 1 ? ')' : '');
		}
		if (dpmiscFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dpmisc` ON `dp`.`id` = `dpmisc`.`DONOR` ' + dpMiscWheres + (joinCount > 1 ? ')' : '');
		}
		if (dtvols1Flag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dtvols1` ON `dp`.`id` = `dtvols1`.`DONOR` ' + dtVols1Wheres + (joinCount > 1 ? ')' : '');
		}
		if (dpothaddFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dpothadd` ON `dp`.`id` = `dpothadd`.`DONOR` ' + dpothaddWheres + (joinCount > 1 ? ')' : '');
		}
		if (dpordersummaryFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dpordersummary` ON `dp`.`id` = `dpordersummary`.`DONOR` ' + dpordersummaryWheres
			+ (joinCount > 1 ? ')' : '');
		}
		if (dplangFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dplang` ON `dp`.`id` = `dplang`.`DONOR` ' + dplangWheres + (joinCount > 1 ? ')' : '');
		}
		if (dptransFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dptrans` ON `dp`.`id` = `dptrans`.`DONOR` ' + dptransWheres + (joinCount > 1 ? ')' : '');
		}
		if (dtmajorFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dtmajor` ON `dp`.`id` = `dtmajor`.`DONOR` ' + dtmajorWheres + (joinCount > 1 ? ')' : '');
		}
		if (dtbishopFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `dtbishop` ON `dp`.`id` = `dtbishop`.`DONOR` ' + dtbishopWheres + (joinCount > 1 ? ')' : '');
		}
		if (notesFlag) {
		    innerSelect = innerSelect + (innerSelect == '' ? '' : ' UNION ') + (joinCount > 1 ? '(' : '') + 'SELECT ' + (joinCount == 1 ? 'DISTINCT' : '') + ' `dp`.`id` from `dp` inner join `notes` ON `dp`.`id` = `notes`.`DONOR` ' + notesWheres + (joinCount > 1 ? ')' : '');
		}

	    } else if (mode == 'and') {
		innerSelect = 'SELECT DISTINCT `dp`.`id` from `dp`';

		if (dpgiftFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dpgift` ON `dp`.`id` =  `dpgift`.`DONOR`' + (dpGiftWheres == '' ? '' : ' AND ') + dpGiftWheres;
		}
		if (dpotherFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dpother` ON `dp`.`id` =  `dpother`.`DONOR`' + (dpOtherWheres == '' ? '' : ' AND ') + dpOtherWheres;
		}
		if (dtmailFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dtmail` ON `dp`.`id` =  `dtmail`.`DONOR`' + (dtMailWheres == '' ? '' : ' AND ') + dtMailWheres;
		}
		if (dpplgFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dpplg` ON `dp`.`id` =  `dpplg`.`DONOR`' + (dpPlgWheres == '' ? '' : ' AND ') + dpPlgWheres;
		}
		if (dpmiscFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dpmisc` ON `dp`.`id` =  `dpmisc`.`DONOR`' + (dpMiscWheres == '' ? '' : ' AND ') + dpMiscWheres;
		}
		if (dtvols1Flag) {
		    innerSelect = innerSelect + ' INNER JOIN `dtvols1` ON `dp`.`id` =  `dtvols1`.`DONOR`' + (dtVols1Wheres == '' ? '' : ' AND ') + dtVols1Wheres;
		}
		if (dpothaddFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dpothadd` ON `dp`.`id` =  `dpothadd`.`DONOR`' + (dpothaddWheres == '' ? '' : ' AND ') + dpothaddWheres;
		}
		if (dpordersummaryFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dpordersummary` ON `dp`.`id` =  `dpordersummary`.`DONOR`' + (dpordersummaryWheres == '' ? '' : ' AND ') + dpordersummaryWheres;
		}
		if (dplangFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dplang` ON `dp`.`id` =  `dplang`.`DONOR`' + (dplangWheres == '' ? '' : ' AND ') + dplangWheres;
		}
		if (dptransFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dptrans` ON `dp`.`id` =  `dptrans`.`DONOR`' + (dptransWheres == '' ? '' : ' AND ') + dptransWheres;
		}
		if (dtmajorFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dtmajor` ON `dp`.`id` =  `dtmajor`.`DONOR`' + (dtmajorWheres == '' ? '' : ' AND ') + dtmajorWheres;
		}
		if (dtbishopFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `dtbishop` ON `dp`.`id` =  `dtbishop`.`DONOR`' + (dtbishopWheres == '' ? '' : ' AND ') + dtbishopWheres;
		}
		if (notesFlag) {
		    innerSelect = innerSelect + ' INNER JOIN `notes` ON `dp`.`id` =  `notes`.`DONOR`' + (notesWheres == '' ? '' : ' AND ') + notesWheres;
		}
	    }
	}

	console.log('SELECT ' + selectItems + ' FROM (' + innerSelect + innerOrderOffsetLimit + ') AS `dpIds` LEFT JOIN `dp` on `dpIds`.`id` = `dp`.`id`');

	if (searchmode) {
	    async.parallel({
		data : function(cb) {
		    Database.knex.raw('SELECT ' + selectItems + ' FROM (' + innerSelect + innerOrderOffsetLimit + ') AS `dpIds` LEFT JOIN `dp` on `dpIds`.`id` = `dp`.`id`').exec(function(err, response) {
			if (err)
			    return cb(err);
			cb(null, response[0]);
		    });
		},
		recordsFiltered : function(cb) {
		    Database.knex.raw('SELECT COUNT(*) AS count FROM (' + innerSelect + ') AS `dpIds`').exec(function(err, countresponse) {
			if (err)
			    return cb(err);
			cb(null, countresponse[0][0].count);
		    });
		},
		recordsTotal : function(cb) {
		    Database.knex.count('id as count').from('dp').exec(function(err, totalcountresponse) {
			if (err)
			    return cb(err);
			cb(null, totalcountresponse[0].count);
		    });
		},
	    }, function(err, results) {
		if (err)
		    return contactsCallback(err);
		contactsCallback(null, results);

	    });
	} else { // export mode
	    Database.knex.raw('SELECT COUNT(*) AS count FROM (' + innerSelect + ') AS `dpIds`').exec(function(err, countresponse) {
		if (err)
		    return contactsCallback(err);

		if (countresponse[0][0].count > 100000) {
		    return res.json({
			oversize : 'Too many records',
			recordsFiltered : countresponse[0][0].count
		    });
		}
		async.parallel({
		    data : function(cb) {
			Database.knex.raw('SELECT ' + selectItems + ' FROM (' + innerSelect + innerOrderOffsetLimit + ') AS `dpIds` LEFT JOIN `dp` on `dpIds`.`id` = `dp`.`id`').exec(function(err, response) {
			    if (err)
				return cb(err);
			    cb(null, response[0]);
			});
		    },
		    recordsTotal : function(cb) {
			Database.knex.count('id as count').from('dp').exec(function(err, totalcountresponse) {
			    if (err)
				return cb(err);
			    cb(null, totalcountresponse[0].count);
			});
		    },
		}, function(err, results) {
		    if (err)
			return contactsCallback(err);
		    results.recordsFiltered = countresponse[0][0].count;
		    contactsCallback(null, results);
		});
	    });
	}

	function addDpWheres() {
	    var donorFullText = Utilities.prepfulltext(req.body.contact.id);
	    dpWheres = '';
	    if (donorFullText != null) {
		if (isNaN(req.body.contact.id)) {
		    dpWheres = (dpWheres == '' ? '' : ' AND ') + 'MATCH (dp.FNAME, dp.LNAME) AGAINST ("' + donorFullText + '" IN BOOLEAN MODE)';
		} else {
		    dpWheres = (dpWheres == '' ? '' : ' AND ') + 'dp.id = ' + req.body.contact.id;
		}
	    }

	    Object.keys(req.body.contact).forEach(function(key) {
		var val = req.body.contact[key];
		if (key == 'id' || key == 'mode') { // Skip these guys
		    return;
		}
		if (key == 'PHONE' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + '( dp.PHONE LIKE ' + wrapPercents(mysql.escape(val)) + ' OR ' + 'dp.PHON2 LIKE ' + wrapPercents(mysql.escape(val)) + ' OR ' + 'dp.PHON3 LIKE ' + wrapPercents(mysql.escape(val)) + ')';
		    return;
		}
		if (key == 'CLASS' && req.body.contact.CLASS != null && req.body.contact.CLASS.length > 0) {
		    var passtring = '';
		    for (var i = 0; i < req.body.contact.CLASS.length; i++) {
			if (passtring != '') {
			    passtring += ','
			}
			passtring += "'" + req.body.contact.CLASS[i] + "'";
		    }
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + "dp.CLASS IN (" + passtring + ")";
		    return;
		}
		if (key == 'FLAGS' && val != null && val != '') {

		    var littleWheres = '';
		    for (i = 0; i < val.length; i++) {
			littleWheres = littleWheres + (littleWheres == '' ? '' : ' OR ') + 'dp.FLAGS LIKE ' + wrapPercents(mysql.escape(val[i]));

		    }
		    if (littleWheres != '') {
			littleWheres = '(' + littleWheres + ')';
			dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + littleWheres;
		    }
		    return;
		}

		if (key == 'total_donation_amount_MIN'&& val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.total_donation_amount >= ' + val;
		    return;
		}
		if (key == 'total_donation_amount_MAX'&& val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.total_donation_amount <= ' + val;
		    return;
		}
		if (key == 'ZIP' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.ZIP LIKE ' + wrapPercents(mysql.escape(val));
		    return;
		}
		if (key == 'CFNID' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.CFNID LIKE ' + wrapPercents(mysql.escape(val));
		    return;
		}
		if (key == 'BIRTHDATE_MIN' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.BIRTHDATE >= ' + mysql.escape(val);
		    return;
		}
		if (key == 'BIRTHDATE_MAX' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.BIRTHDATE <= ' + mysql.escape(val);
		    return;
		}
		if (key == 'ORDINATION_MIN' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.ORDINATION >= ' + mysql.escape(val);
		    return;
		}
		if (key == 'ORDINATION_MAX' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.ORDINATION <= ' + mysql.escape(val);
		    return;
		}
		if (key == 'CONSECRATE_MIN' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.CONSECRATE >= ' + mysql.escape(val);
		    return;
		}
		if (key == 'CONSECRATE_MAX' && val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dp.CONSECRATE <= ' + mysql.escape(val);
		    return;
		}

		if (val != null && val != '') {
		    dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + "dp." + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		}
	    });

	    console.log('mode:' + mode);
	    if (dpWheres != '' && mode == 'or') { // add initial WHERE command
		dpWheres = 'WHERE ' + dpWheres;
	    }
	}

	function determineJoinsAndWheres() {
	    if (notes) {
		Object.keys(notes).forEach(function(key) {
		    var val = notes[key];

		    if (val != null && val != '') {
			if (!notesFlag) {
			    joinCount++;
			}

			notesFlag = true;

			if (key == 'text') {
			    notesWheres = notesWheres + (notesWheres == '' ? '' : ' AND ') + 'notes.text LIKE ' + wrapPercents(mysql.escape(val));
			    return;
			}

			notesWheres = notesWheres + (notesWheres == '' ? '' : ' AND ') + 'notes.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    notesWheres = dpWheres + (notesWheres == '' ? '' : ' AND ') + notesWheres;
		} else if (notesWheres != '') {
		    notesWheres = (mode == 'or' ? 'WHERE ' : '') + notesWheres;
		}
	    }

	    if (dpother) {
		Object.keys(dpother).forEach(function(key) {
		    var val = dpother[key];

		    if (val != null && val != '') {
			if (!dpotherFlag) {
			    joinCount++;
			}

			dpotherFlag = true;

			if (key == 'AMT_MIN') {
			    dpOtherWheres = dpOtherWheres + (dpOtherWheres == '' ? '' : ' AND ') + 'dpother.AMT >= ' + val;
			    return;
			}
			if (key == 'AMT_MAX') {
			    dpOtherWheres = dpOtherWheres + (dpOtherWheres == '' ? '' : ' AND ') + 'dpother.AMT <= ' + val;
			    return;
			}
			if (key == 'DATE_MIN') {
			    dpOtherWheres = dpOtherWheres + (dpOtherWheres == '' ? '' : ' AND ') + 'dpother.DATE >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'DATE_MAX') {
			    dpOtherWheres = dpOtherWheres + (dpOtherWheres == '' ? '' : ' AND ') + 'dpother.DATE <= ' + mysql.escape(val);
			    return;
			}

			if (key == 'NARRA') {
			    dpOtherWheres = dpOtherWheres + (dpOtherWheres == '' ? '' : ' AND ') + 'dpother.NARRA LIKE ' + wrapPercents(mysql.escape(val));
			    return;
			}
			dpOtherWheres = dpOtherWheres + (dpOtherWheres == '' ? '' : ' AND ') + 'dpother.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));

			// ' = ' + "'" + val + "'";
		    }
		});
		if (dpWheres != '') {
		    dpOtherWheres = dpWheres + (dpOtherWheres == '' ? '' : ' AND ') + dpOtherWheres;
		} else if (dpOtherWheres != '') {
		    dpOtherWheres = (mode == 'or' ? 'WHERE ' : '') + dpOtherWheres;
		}
	    }

	    if (dpgift) {
		Object.keys(dpgift).forEach(function(key) {
		    var val = dpgift[key];
		    if (val != null && val != '') {
			if (!dpgiftFlag) {
			    joinCount++;
			}
			dpgiftFlag = true;

			if (key == 'AMT_MIN') {
			    dpGiftWheres = dpGiftWheres + (dpGiftWheres == '' ? '' : ' AND ') + 'dpgift.AMT >= ' + val;
			    return;
			}
			if (key == 'AMT_MAX') {
			    dpGiftWheres = dpGiftWheres + (dpGiftWheres == '' ? '' : ' AND ') + 'dpgift.AMT <= ' + val;
			    return;
			}
			if (key == 'DATE_MIN') {
			    dpGiftWheres = dpGiftWheres + (dpGiftWheres == '' ? '' : ' AND ') + 'dpgift.DATE >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'DATE_MAX') {
			    dpGiftWheres = dpGiftWheres + (dpGiftWheres == '' ? '' : ' AND ') + 'dpgift.DATE <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'GIFTMEMO') {
			    dpGiftWheres = dpGiftWheres + (dpGiftWheres == '' ? '' : ' AND ') + 'dpgift.GIFTMEMO LIKE ' + wrapPercents(mysql.escape(val));
			    return;
			}
			dpGiftWheres = dpGiftWheres + (dpGiftWheres == '' ? '' : ' AND ') + 'dpgift.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
			// ' = ' + "'" + val + "'";
		    }
		});
		if (dpWheres != '') {
		    dpGiftWheres = dpWheres + (dpGiftWheres == '' ? '' : ' AND ') + dpGiftWheres;
		} else if (dpGiftWheres != '') {
		    dpGiftWheres = (mode == 'or' ? 'WHERE ' : '') + dpGiftWheres;
		}
	    }

	    if (dpplg) {
		Object.keys(dpplg).forEach(function(key) {
		    var val = dpplg[key];
		    if (val != null && val != '' && (key != 'PLEDGOR' || val == 'Y')) {
			if (!dpplgFlag) {
			    joinCount++;
			}
			dpplgFlag = true;
			if (key == 'PLEDGOR') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'TRUE';
			    return;
			}

			if (key == 'AMT_MIN') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.AMT >= ' + val;
			    return;
			}
			if (key == 'AMT_MAX') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.AMT <= ' + val;
			    return;
			}
			if (key == 'START_DT_MIN') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.START_DT >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'START_DT_MAX') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.START_DT <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'MADE_DT_MIN') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.MADE_DT >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'MADE_DT_MAX') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.MADE_DT <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'CHANGE_DT_MIN') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.CHANGE_DT >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'CHANGE_DT_MAX') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.CHANGE_DT <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'BILL_MIN') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.BILL >= ' + val;
			    return;
			}
			if (key == 'BILL_MAX') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.BILL <= ' + val;
			    return;
			}
			if (key == 'TOTAL_MIN') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.TOTAL >= ' + val;
			    return;
			}
			if (key == 'TOTAL_MAX') {
			    dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.TOTAL <= ' + val;
			    return;
			}
			dpPlgWheres = dpPlgWheres + (dpPlgWheres == '' ? '' : ' AND ') + 'dpplg.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
			// ' = ' + "'" + val + "'";
		    }
		});
		if (dpWheres != '') {
		    dpPlgWheres = dpWheres + (dpPlgWheres == '' ? '' : ' AND ') + dpPlgWheres;
		} else if (dpPlgWheres != '') {
		    dpPlgWheres = (mode == 'or' ? 'WHERE ' : '') + dpPlgWheres;
		}
	    }

	    if (dtmail) {
		Object.keys(dtmail).forEach(function(key) {
		    var val = dtmail[key];
		    if (val != null && val != '') {
			if (!dtmailFlag) {
			    joinCount++;
			}
			dtmailFlag = true;
			dtMailWheres = dtMailWheres + (dtMailWheres == '' ? '' : ' AND ') + 'dtmail.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
			// ' = ' + "'" + val + "'";
		    }
		});
		if (dpWheres != '') {
		    dtMailWheres = dpWheres + (dtMailWheres == '' ? '' : ' AND ') + dtMailWheres;
		} else if (dtMailWheres != '') {
		    dtMailWheres = (mode == 'or' ? 'WHERE ' : '') + dtMailWheres;
		}
	    }

	    if (dpmisc) {
		Object.keys(dpmisc).forEach(function(key) {
		    var val = dpmisc[key];
		    if (val != null && val != '') {
			if (!dpmiscFlag) {
			    joinCount++;
			}
			dpmiscFlag = true;
			if (key == 'MDATE_MIN') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MDATE >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'MDATE_MAX') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MDATE <= ' + mysql.escape(val);
			    return;
			}

			if (key == 'MCOUNT_MIN') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MCOUNT >= ' + val;
			    return;
			}
			if (key == 'MCOUNT_MAX') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MCOUNT <= ' + val;
			    return;
			}

			if (key == 'MAMT_MIN') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MAMT >= ' + val;
			    return;
			}
			if (key == 'MAMT_MAX') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MAMT <= ' + val;
			    return;
			}
			if (key == 'MYEAR_MIN') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MYEAR >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'MYEAR_MAX') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MYEAR <= ' + mysql.escape(val);
			    return;
			}

			if (key == 'MNOTES') {
			    dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.MNOTES LIKE ' + wrapPercents(mysql.escape(val));
			    return;
			}
			dpMiscWheres = dpMiscWheres + (dpMiscWheres == '' ? '' : ' AND ') + 'dpmisc.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dpMiscWheres = dpWheres + (dpMiscWheres == '' ? '' : ' AND ') + dpMiscWheres;
		} else if (dpMiscWheres != '') {
		    dpMiscWheres = (mode == 'or' ? 'WHERE ' : '') + dpMiscWheres;
		}
	    }

	    if (dtvols1) {
		Object.keys(dtvols1).forEach(function(key) {
		    var val = dtvols1[key];
		    if (val != null && val != '' && (key != 'VOLUNTEER' || val == 'Y')) {
			if (!dtvols1Flag) {
			    joinCount++;
			}
			dtvols1Flag = true;
			if (key == 'VOLUNTEER') {
			    dtVols1Wheres = dtVols1Wheres + (dtVols1Wheres == '' ? '' : ' AND ') + 'TRUE';
			    return;
			}
			if (key == 'VSDATE_MIN') {
			    dtVols1Wheres = dtVols1Wheres + (dtVols1Wheres == '' ? '' : ' AND ') + 'dtvols1.VSDATE >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VSDATE_MAX') {
			    dtVols1Wheres = dtVols1Wheres + (dtVols1Wheres == '' ? '' : ' AND ') + 'dtvols1.VSDATE <= ' + mysql.escape(val);
			    return;
			}
			dtVols1Wheres = dtVols1Wheres + (dtVols1Wheres == '' ? '' : ' AND ') + 'dtvols1.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dtVols1Wheres = dpWheres + (dtVols1Wheres == '' ? '' : ' AND ') + dtVols1Wheres;
		} else if (dtVols1Wheres != '') {
		    dtVols1Wheres = (mode == 'or' ? 'WHERE ' : '') + dtVols1Wheres;
		}
	    }

	    if (dpothadd) {
		Object.keys(dpothadd).forEach(function(key) {
		    var val = dpothadd[key];
		    if (val != null && val != '') {
			if (!dpothaddFlag) {
			    joinCount++;
			}
			dpothaddFlag = true;
			dpothaddWheres = dpothaddWheres + (dpothaddWheres == '' ? '' : ' AND ') + 'dpothadd.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dpothaddWheres = dpWheres + (dpothaddWheres == '' ? '' : ' AND ') + dpothaddWheres;
		} else if (dpothaddWheres != '') {
		    dpothaddWheres = (mode == 'or' ? 'WHERE ' : '') + dpothaddWheres;
		}
	    }

	    if (dpordersummary) {
		Object.keys(dpordersummary).forEach(function(key) {
		    var val = dpordersummary[key];
		    if (val != null && val != '') {
			if (!dpordersummaryFlag) {
			    joinCount++;
			}
			dpordersummaryFlag = true;
			if (key == 'DATE_MIN') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'DATE_MAX') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'ORIGDATE_MIN') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.ORIGDATE >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'ORIGDATE_MAX') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.ORIGDATE <= ' + mysql.escape(val);
			    return;
			}

			if (key == 'CASH_MIN') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.CASH >= ' + val;
			    return;
			}
			if (key == 'CASH_MAX') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.CASH <= ' + val;
			    return;
			}
			if (key == 'CREDIT_MIN') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.CREDIT >= ' + val;
			    return;
			}
			if (key == 'CREDIT_MAX') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.CREDIT <= ' + val;
			    return;
			}
			if (key == 'GTOTAL_MIN') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.GTOTAL >= ' + val;
			    return;
			}
			if (key == 'GTOTAL_MAX') {
			    dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.GTOTAL <= ' + val;
			    return;
			}

			dpordersummaryWheres = dpordersummaryWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + 'dpordersummary.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dpordersummaryWheres = dpWheres + (dpordersummaryWheres == '' ? '' : ' AND ') + dpordersummaryWheres;
		} else if (dpordersummaryWheres != '') {
		    dpordersummaryWheres = (mode == 'or' ? 'WHERE ' : '') + dpordersummaryWheres;
		}
	    }

	    if (dplang) {
		Object.keys(dplang).forEach(function(key) {
		    var val = dplang[key];
		    if (val != null && val != '') {
			if (!dplangFlag) {
			    joinCount++;
			}
			dplangFlag = true;
			dplangWheres = dplangWheres + (dplangWheres == '' ? '' : ' AND ') + 'dplang.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dplangWheres = dpWheres + (dplangWheres == '' ? '' : ' AND ') + dplangWheres;
		} else if (dplangWheres != '') {
		    dplangWheres = (mode == 'or' ? 'WHERE ' : '') + dplangWheres;
		}
	    }

	    if (dptrans) {
		Object.keys(dptrans).forEach(function(key) {
		    var val = dptrans[key];
		    if (val != null && val != '') {
			if (!dptransFlag) {
			    joinCount++;
			}
			dptransFlag = true;
			dptransWheres = dptransWheres + (dptransWheres == '' ? '' : ' AND ') + 'dptrans.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dptransWheres = dpWheres + (dptransWheres == '' ? '' : ' AND ') + dptransWheres;
		} else if (dptransWheres != '') {
		    dptransWheres = (mode == 'or' ? 'WHERE ' : '') + dptransWheres;
		}
	    }

	    if (dtmajor) {
		Object.keys(dtmajor).forEach(function(key) {
		    var val = dtmajor[key];
		    if (val != null && val != '' && (key != 'FORCEJOIN' || val == 'Y')) {
			if (!dtmajorFlag) {
			    joinCount++;
			}
			dtmajorFlag = true;
			if (key == 'FORCEJOIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'TRUE';
			    return;
			}

			if (key == 'ASKAMT_MIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.ASKAMT >= ' + val;
			    return;
			}
			if (key == 'ASKAMT_MAX') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.ASKAMT <= ' + val;
			    return;
			}
			if (key == 'PLEDAMT_MIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.PLEDAMT >= ' + val;
			    return;
			}
			if (key == 'PLEDAMT_MAX') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.PLEDAMT <= ' + val;
			    return;
			}

			if (key == 'PAIDAMT_MIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.PAIDAMT >= ' + val;
			    return;
			}
			if (key == 'PAIDAMT_MAX') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.PAIDAMT <= ' + val;
			    return;
			}

			if (key == 'VISDATE1_MIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE1 >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VISDATE1_MAX') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE1 <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VISDATE2_MIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE2 >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VISDATE2_MAX') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE2 <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VISDATE3_MIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE3 >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VISDATE3_MAX') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE3 <= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VISDATE4_MIN') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE4 >= ' + mysql.escape(val);
			    return;
			}
			if (key == 'VISDATE4_MAX') {
			    dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.VISDATE4 <= ' + mysql.escape(val);
			    return;
			}
			dtmajorWheres = dtmajorWheres + (dtmajorWheres == '' ? '' : ' AND ') + 'dtmajor.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dtmajorWheres = dpWheres + (dtmajorWheres == '' ? '' : ' AND ') + dtmajorWheres;
		} else if (dtmajorWheres != '') {
		    dtmajorWheres = (mode == 'or' ? 'WHERE ' : '') + dtmajorWheres;
		}
	    }

	    if (dtbishop) {
		Object.keys(dtbishop).forEach(function(key) {
		    var val = dtbishop[key];
		    if (val != null && val != '' && (key != 'FORCEJOIN' || val == 'Y')) {
			if (!dtbishopFlag) {
			    joinCount++;
			}
			dtbishopFlag = true;
			if (key == 'FORCEJOIN') {
			    dtbishopWheres = dtbishopWheres + (dtbishopWheres == '' ? '' : ' AND ') + 'TRUE';
			    return;
			}
			dtbishopWheres = dtbishopWheres + (dtbishopWheres == '' ? '' : ' AND ') + 'dtbishop.' + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
		    }
		});
		if (dpWheres != '') {
		    dtbishopWheres = dpWheres + (dtbishopWheres == '' ? '' : ' AND ') + dtbishopWheres;
		} else if (dtbishopWheres != '') {
		    dtbishopWheres = (mode == 'or' ? 'WHERE ' : '') + dtbishopWheres;
		}
	    }

	}

    }
};

function toClientDateTimeString(date, offset) {
    var tdate = new Date(date.getTime());
    tdate = new Date(tdate.setMinutes(tdate.getMinutes() - offset)); // SHIFTING
    // HERE!!!
    return tdate.getUTCFullYear() + '-' + padLeft((tdate.getUTCMonth() + 1).toString(), 2) + '-' + padLeft(tdate.getUTCDate(), 2) + ' ' + padLeft(tdate.getUTCHours(), 2) + ':' + padLeft(tdate.getUTCMinutes(), 2) + ':' + padLeft(tdate.getUTCSeconds(), 2);
}

function padLeft(nr, n, str) {
    if (String(nr).length >= n) {
	return String(nr);
    }
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

function wrapPercents(str) {
    return str.substr(0, 1) + '%' + str.substring(1, str.length - 1) + '%' + str.substr(str.length - 1, 1)
}