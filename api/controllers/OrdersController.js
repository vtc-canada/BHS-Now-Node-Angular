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
	    async.each(entries, function(entry, entrycallback) {
		if (entry.id == 'new') {
		    Database.dataSproc('ODR_InsertOrderEntry', [ order.id, entry.inv_cfg_mat_types_id, entry.inv_cfg_mat_brands_id, entry.quantity, entry.inv_cfg_uom_id, '@outDummyParam' ], function(err, response) {
			entrycallback(err, response);
		    });
		} else if (entry.is_deleted) {
		    Database.dataSproc('ODR_DeleteOrderEntry', [ entry.id, req.session.user.username ], function(err, response) {
			entrycallback(err, response);
		    });
		} else {
		    Database.dataSproc('ODR_UpdateOrderEntry', [ entry.id, entry.inv_cfg_mat_types_id, entry.inv_cfg_mat_brands_id, entry.quantity, entry.inv_cfg_uom_id, req.session.user.username ], function(err, response) {
			entrycallback(null);
		    })
		}
	    }, function(err, result) {
		callback(err, result);
	    })
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
		res.json({success:true, data:response[0]});
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
		res.json({success:true, data:response[0]});
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
			Database.dataSproc('ODR_GetPickListMappings',[entry.id],function(err,result){
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
