/**
 * OrdersController
 * 
 * @description :: Server-side logic for managing orders
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    save : function(req, res) {
	var order = req.body.order;
	var entries = order.entries;
	// order.odr_cfg_order_state_id,

	if (order.id == 'new') {
	    var paramCreateId = '@out' + Math.floor((Math.random() * 1000000) + 1);
	    Database.dataSproc('ODR_InsertOrder', [ order.nms_cur_contacts_id, req.session.user.username, 1, paramCreateId ], function(err, response) {
		if (err)
		    return console.log(err.toString());

		sails.controllers.orders.doGetOrder(response[1][paramCreateId],function(order){
		    return res.json({
			success : true,
			"data" : order
		    });
		});
	    });
	}else{
	    Database.dataSproc('ODR_UpdateOrderStatus', [ order.id, order.odr_cfg_order_state_id, req.session.user.username ], function(err, response) {
		if (err)
		    return console.log(err.toString());
		sails.controllers.orders.doGetOrder(order.id,function(order){
		    return res.json({
			success : true,
			"data" : order
		    });
		});
	    });
	}

    },
    pushorder : function(req,res){
	
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
    doGetOrder : function(orderId, ordercallback){
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
			setTimeout(function() {
			    callback(null, 'two');
			}, 0);
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
	sails.controllers.orders.doGetOrder(req.body.id,function(order){
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
