/**
 * OrdersController
 * 
 * @description :: Server-side logic for managing orders
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    destroy : function(req, res) {
	var order = req.body.order;
	Database.dataSproc('ODR_DeleteOrder', [ order.id, req.session.user.username ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json({
		    error : err.toString()
		}, 500);
	    }
	    res.json({
		success : true,
		data : order
	    });
	});
    },
    save : function(req, res) {
	var order = req.body.order;
	var entries = order.entries;
	// order.odr_cfg_order_state_id,

	if (order.id == 'new') {
	    var paramCreateId = '@out' + Math.floor((Math.random() * 1000000) + 1);
	    Database.dataSproc('ODR_InsertOrder', [ order.nms_cur_contacts_id, req.session.user.username, 1, paramCreateId ], function(err, response) {
		if (err)
		    return console.log(err.toString());
		// PUT ON ORDER ID!! TODO!!!!
		processEntries(function(err) {
		    if (err) {
			console.log('Error processing entries:' + err.toString());
			return res.json({
			    error : err.toString()
			}, 500);
		    }
		    sails.controllers.orders.doGetOrder(response[1][paramCreateId], function(order) {
			return res.json({
			    success : true,
			    "data" : order
			});
		    });
		});

	    });
	} else {

	    Database.dataSproc('ODR_UpdateOrder', [ order.id, order.nms_cur_contacts_id, req.session.user.username ], function(err, response) {
		if (err)
		    return console.log(err.toString());

		Database.dataSproc('ODR_UpdateOrderStatus', [ order.id, order.odr_cfg_order_state_id, req.session.user.username ], function(err, response) {
		    if (err)
			return console.log(err.toString());

		    processEntries(function(err) {
			if (err) {
			    console.log('Error processing entries:' + err.toString());
			    return res.json({
				error : err.toString()
			    }, 500);
			}
			sails.controllers.orders.doGetOrder(order.id, function(neworder) {
			    return res.json({
				success : true,
				"data" : neworder
			    });
			});
		    });
		});
	    });
	}

	function processEntries(callback) {
	    async.eachSeries(entries, function(entry, entrycallback) {
		if (entry.id == 'new') { // New Entry
		    var paramCreateId = '@out' + Math.floor((Math.random() * 1000000) + 1);
		    Database.dataSproc('ODR_InsertOrderEntry', [ order.id, entry.inv_cfg_mat_types_id, entry.inv_cfg_mat_brands_id, entry.quantity, entry.inv_cfg_uom_id, paramCreateId ], function(err, response) {
			if (err) {
			    entrycallback(err)
			}
			// Sprocs only allow for searching for available
			// picklist options via order entryID
			entry.id = response[1][paramCreateId]; // copy entry so
			// that we can
			// pick items
			// processPickedItems(entry, function(err){
			entrycallback(err);
			// });
		    });
		} else if (entry.is_deleted) { // Delete Entry
		    Database.dataSproc('ODR_GetPickListMappings', [ entry.id ], function(err, picklistresponse) {
			if (err)
			    return entrycallback(err);
			async.each(picklistresponse[0], function(pickeditem, pickeditemcb) {
			    Database.dataSproc('ODR_DeletePickListMapping', [ pickeditem.id, req.session.user.username ], function(err, response) {
				pickeditemcb(err)
			    });
			}, function(err, response) {
			    if (err)
				return entrycallback(err);
			    Database.dataSproc('ODR_DeleteOrderEntry', [ entry.id, req.session.user.username ], function(err, response) {
				entrycallback(err, response);
			    });
			});

		    });

		} else { // Update Entry
		    Database.dataSproc('ODR_UpdateOrderEntry', [ entry.id, entry.inv_cfg_mat_types_id, entry.inv_cfg_mat_brands_id, entry.quantity, entry.inv_cfg_uom_id, req.session.user.username ], function(err, response) {
			processPickedItems(entry, entrycallback);
		    })
		}
	    }, function(err, result) {
		callback(err, result);
	    })
	}

	function processPickedItems(entry, pickeditemscallback) {
	    Database.dataSproc('ODR_GetPickListMappings', [ entry.id ], function(err, response) {
		if (err) {
		    pickeditemscallback(err);
		}

		async.parallel([ function(deleteAllCallback) {// Clear out
		    // ones that are
		    // already in
		    // the database
		    async.each(response[0], function(serverItem, deleteCallback) {
			var foundrow = false;
			for (var i = 0; i < entry.pickeditems.length; i++) {
			    if (entry.pickeditems[i].id == serverItem.id) {
				foundrow = true;
				break;
			    }
			}
			if (!foundrow) {
			    Database.dataSproc('ODR_DeletePickListMapping', [ serverItem.id, req.session.user.username ], function(err, response) {
				deleteCallback(err);
			    });
			    // deleting ones already there
			} else {
			    deleteCallback(null);
			}
		    }, deleteAllCallback);
		}, function(insertAllCallback) {// Insert records that are
		    // missing from the database
		    async.each(entry.pickeditems, function(clientItem, addCallback) {
			var foundrow = false;
			for (var i = 0; i < response[0].length; i++) {
			    if (response[0][i].id == clientItem.id) {
				foundrow = true;
				break;
			    }
			}
			if (!foundrow) {
			    Database.dataSproc('ODR_InsertPickListMapping', [ order.id, entry.id, clientItem.id, req.session.user.username ], function(err, response) {
				addCallback(err);
			    });
			    // inserting missing ones
			} else {
			    addCallback(null);
			}
		    }, insertAllCallback);
		} ], pickeditemscallback);
	    });
	}
    },
    getpicklistmappings : function(req, res) {
	if (req.body.entryID) {
	    Database.dataSproc('ODR_GetPickListMappings', [ req.body.entryID ], function(err, response) {
		if (err) {
		    console.log(err);
		    return res.json(500, {
			error : err.toString()
		    });
		}
		res.json({
		    success : true,
		    data : response[0]
		});
	    });
	}
    },
    getpicklistoptions : function(req, res) {
	if (req.body.entryID) {
	    Database.dataSproc('ODR_GetPickListOptions', [ req.body.entryID ], function(err, response) {
		if (err) {
		    console.log(err);
		    return res.json(500, {
			error : err.toString()
		    });
		}
		res.json({
		    success : true,
		    data : response[0]
		});
	    });
	}
    },
    pushdestroyorder : function(req, res) {
	if (req.body.order) {
	    req.body.order.is_deleted = true; // sets flag that pushes to
	    // clients to let them know to
	    // delete
	    console.log('pushing delete order:' + JSON.stringify(req.body.order));
	    SecurityService.sendMessage(null, {
		verb : 'orderUpdate',
		data : req.body.order
	    });
	}

    },
    pushorder : function(req, res) {
	if (req.body.orderId) {
	    Database.dataSproc('ODR_GetOrdersHistory', [ req.body.orderId, null, null, 1 ], function(err, response) {
		if (err)
		    return console.log(err.toString());
		if (response[0] && response[0][0]) {
		    console.log('pushing order:' + JSON.stringify(response[0][0]));
		    SecurityService.sendMessage(null, {
			verb : 'orderUpdate',
			data : response[0][0]
		    });
		}
	    });
	    // sails.controllers.orders.doGetOrder(req.body.orderId,
	    // function(order) {
	    // console.log(JSON.stringify(order));
	    //
	    // });
	}
    },
    'get-orders-history' : function(req, res) {
	var date_MIN = req.body.date_MIN;
	var date_MAX = req.body.date_MAX == '' ? null : req.body.date_MAX + ' 23:59:59';
	var order_id = req.body.id;

	Database.dataSproc('ODR_GetOrdersHistory', [ order_id == '' ? null : order_id, date_MIN == '' ? null : date_MIN, date_MAX, 1 ], function(err, response) {
	    if (err)
		return console.log(err.toString());

	    return res.json({
		"data" : response[0]
	    });
	});
    },
    doGetOrder : function(orderId, ordercallback) {
	Database.dataSproc('ODR_GetOrder', [ orderId ], function(err, response) {
	    if (err)
		return console.log(err.toString());
	    var order = response[0][0];
	    Database.dataSproc('ODR_GetOrderEntries', [ orderId ], function(err, entriesresponse) {
		if (err)
		    return console.log(err.toString());
		order.entries = entriesresponse[0];

		async.each(order.entries, function(entry, cb) {

		    async.parallel([ function(callback) {
			Database.dataSproc('INV_GetMatTypesByBrand', [ entry.inv_cfg_mat_brands_id ], function(err, result) {
			    if (err)
				return cb(err);
			    entry.types = result[0];
			    callback(null);
			});
		    }, function(callback) {
			Database.dataSproc('ODR_GetPickListMappings', [ entry.id ], function(err, result) {
			    if (err)
				return cb(err);
			    entry.pickeditems = result[0];
			    callback(null);
			});
		    } ], function(err, results) {
			cb(err, results);
		    });

		    // Database.dataSproc('INV_GetMatTypesByBrand', [
		    // entry.inv_cfg_mat_brands_id ], function(err, result) {
		    // if (err)
		    // return cb(err);
		    // entry.types = result[0];
		    // cb(null);
		    // });

		}, function(err, resultasync) {
		    if (err)
			return console.log(err.toString());
		    ordercallback(order);
		})

	    });
	});
    },
    'get-order' : function(req, res) {
	sails.controllers.orders.doGetOrder(req.body.id, function(order) {
	    return res.json({
		success : true,
		"data" : order
	    });
	});
    },
    'get-order-entries' : function(req, res) {
	// var orderId = req.body.id;

    }
};
