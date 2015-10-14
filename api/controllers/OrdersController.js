/**
 * OrdersController
 *
 * @description :: Server-side logic for managing Orders
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  save: function (req, res) {

    var selectedOrderSummary = req.body;
    var contactId = req.body.DONOR;

    updateDpOrders(contactId, [selectedOrderSummary], function (err, response) {
      if (err) {
        console.log(err.toString());
        return res.json(500, {
          error: 'Failed saving ' + err.toString()
        });
      }
      res.json({
        success: 'Saved the Order'
      });

    });
    // var dpCode = req.body;
    // var codeId = dpCode.id;
    // delete dpCode.id;
    //
    // if (codeId != null) {
    // Database.knex('dpcodes').where({
    // id : codeId
    // }).update(dpCode).exec(function(err, response) {
    // if (err)
    // return res.json(err, 500);
    // res.json({
    // success : 'Success'
    // });
    // });
    // } else {
    // Database.knex('dpcodes').insert(dpCode).exec(function(err, response)
    // {
    // if (err)
    // return res.json(err, 500);
    // res.json({
    // success : 'Success'
    // });
    // });
    // }

    function updateDpOrders(contactId, orders, updateDpOrdersCallback) {
      async.each(orders, function (order, cb) {
        delete order.$$hashKey;

        var dporderdetails = order.dporderdetails;
        delete order.dporderdetails;

        if (order.id == "new") { // create a new one
          order.DONOR = contactId;
          delete order.id;
          delete order.is_modified;
          delete order.tempId;
          Database.knex('dpordersummary').insert(order, 'id').exec(function (err, response) {
            if (err) {
              return cb(err);
            }
            updateDpDetails(contactId, response[0], dporderdetails, function (err) {
              if (err) {
                return cb(err);
              }
              cb(null, response);
            });
          });

        } else if (order.is_deleted) { // delete it

          Database.knex('dporderdetails').where({
            ORDNUMD: order.id
          }).del().exec(function (err, response) {
            if (err)
              cb(err);
            Database.knex('dpordersummary').where({
              id: order.id
            }).del().exec(function (err, response) {
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
            id: orderId
          }).update(order).exec(function (err, response) {
            if (err)
              return cb(err);
            updateDpDetails(contactId, orderId, dporderdetails, function (err) {
              if (err) {
                return cb(err);
              }
              cb(null, response);
            });
          });
        } else { // no event.
          cb(null);
        }
      }, function (err, data) {
        if (err)
          return updateDpOrdersCallback(err);
        updateDpOrdersCallback(null, data);
      });
    }

    function updateDpDetails(contactId, orderId, dporderdetails, cbdetails) {
      // / Updates all.. even if not modified. // Fine for only orders
      // that
      // are modified.
      async.each(dporderdetails, function (dporderdetail, cb) {
        delete dporderdetail.$$hashKey;
        if (dporderdetail.id == null) {
          dporderdetail.DONORD = contactId;
          dporderdetail.ORDNUMD = orderId;
          delete dporderdetail.id;
          Database.knex('dporderdetails').insert(dporderdetail).exec(function (err, response) {
            if (err)
              cb(err);
            cb(null, response);
          });
        } else if (dporderdetail.is_deleted) {
          Database.knex('dporderdetails').where({
            id: dporderdetail.id
          }).del().exec(function (err, response) {
            if (err)
              cb(err);
            cb(null, response);
          })
        } else { // an update -- even if not modified!
          var dporderdetailId = dporderdetail.id;
          delete dporderdetail.id;
          Database.knex('dporderdetails').where({
            id: dporderdetailId
          }).update(dporderdetail).exec(function (err, response) {
            if (err)
              cb(err);
            cb(null, response);
          });
        }

      }, function (err, data) {
        if (err)
          cbdetails(err);
        cbdetails(null, data);
      });
    }
  },
  destroy: function (req, res) {
    // var codeId = req.body.id;
    // Database.knex('dpcodes').where({
    // id : codeId
    // }).del().exec(function(err, response) {
    // if (err)
    // return res.json(err, 500);
    // res.json({
    // success : 'Success'
    // });
    // })
  },
  getorder: function (req, res) {

    sails.controllers.orders.doGetOrder(req, res, function (err, order) {
      if (err) {
        return res.json(err, 500);
      }
      res.json({
        success: 'Order data.',
        order: order
      });
    });
  },
  doGetOrder: function (req, res, getOrderCallback) {
    var orderId = req.body.id;
    Database.knex
      .raw(
      'SELECT `id`, `DONOR`,`SOL`,DATE_FORMAT(DATE,"%Y-%m-%d") AS `DATE`,`ORDNUM`,`SHIPFROM`,`OPER`,DATE_FORMAT(SHIPDATE,"%Y-%m-%d") AS `SHIPDATE`,DATE_FORMAT(`ORIGDATE`,"%Y-%m-%d") AS `ORIGDATE`,`ORIGENV`,`IPAID`,`SANDH`,`SANDHAMT`,`CREDITCD`,`CASHONLY`,`CASH`,`CREDIT`,`ETOTAL`,`ECONV`,`ESHIP`,`PSTCALC`,`GSTCALC`,`HSTCALC`,`NYTCALC`,`GTOTAL`,`VNOTE`,`BATCHED`,`PST`,`GST`,`HST`,`NYTAX`,`COUNTY`,`COUNTYNM`,`ENT_DT`,`FUNDS`,`GFUNDS`,`CURCONV`,`TITLE`,`FNAME`,`LNAME`,`SUFF`,`SECLN`,`ADD`,`CITY`,`ST`,`ZIP`,`COUNTRY`,`PHTYPE1`,`PHTYPE2`,`PHTYPE3`,`PHONE`,`PHON2`,`PHON3`,`LASTPAGE`,`PRINFLAG`,`TSRECID`,`TSDATE`,`TSTIME`,`TSCHG`,`TSBASE`,`TSLOCAT`,`TSIDCODE`,`SURFCOST`,`MBAGCOST`,`OTHCOST`,`MAILFLAG`,`PRINREM`,`RETURNED`, `order_type` FROM dpordersummary WHERE id = '
      + orderId).exec(function (err, data) {
        if (err)
          return callback(err)

        async.each(Object.keys(data[0]), function (key, cbdetails) {
          Database.knex('dporderdetails').select('*').where({
            ORDNUMD: data[0][key].id
          }).exec(function (err, detailsdata) {
            if (err)
              return cbdetails(err);

            data[0][key].dporderdetails = detailsdata;
            cbdetails(null);
          });
        }, function (err, results) {
          if (err)
            return getOrderCallback(err);
          getOrderCallback(null, data[0][0]);
        });
      });
  },
  ajax: function (req, res) {
    var mysql = require('mysql');
    var searchmode = (req.body.columns && req.body.order);
    var donorFullText = Utilities.prepfulltext(req.body.orders.donor_search);
    var orderId = req.body.orders.id == '' ? null : req.body.orders.id;

    var dpWheres = '';
    if (donorFullText != null) {
      if (isNaN(req.body.orders.donor_search)) {
        dpWheres = (dpWheres == '' ? '' : ' AND ') + 'MATCH (dpordersummary.FNAME, dpordersummary.LNAME) AGAINST ("' + donorFullText + '" IN BOOLEAN MODE)';
      } else {
        dpWheres = (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DONOR = ' + req.body.orders.donor_search;
      }
    }
    if (orderId != null) {
      dpWheres = (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.id = ' + orderId;
    }

    var innerOrderOffsetLimit = '';
    if (searchmode) {// req.body.columns && req.body.order) {
      innerOrderOffsetLimit = ' ORDER BY `' + req.body.columns[req.body.order[0].column].data + '` ' + req.body.order[0].dir + ' LIMIT ' + parseInt(req.body.length) + ' OFFSET ' + parseInt(req.body.start);
    }

    Object.keys(req.body.orders).forEach(function (key) {
      var val = req.body.orders[key];
      if (key == 'id' || key == 'donor_search') { // Skip these guys
        return;
      }

      if (val != null && val != '') {
        if (key == 'DATE_MIN') {
          dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE >= ' + mysql.escape(val);
          return;
        }
        if (key == 'DATE_MAX') {
          dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.DATE <= ' + mysql.escape(val);
          return;
        }
        if (key == 'HASSHIPDATE' && val != null && val != '' && val == 'Y') {
          dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE IS NOT NULL';
          return;
        }
        if (key == 'HASSHIPDATE' && val != null && val != '' && val == 'N') {
          dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE IS NULL';
          return;
        }
        if (key == 'SHIPDATE_MIN') {
          dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE >= ' + mysql.escape(val);
          return;
        }
        if (key == 'SHIPDATE_MAX') {
          dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + 'dpordersummary.SHIPDATE <= ' + mysql.escape(val);
          return;
        }

        dpWheres = dpWheres + (dpWheres == '' ? '' : ' AND ') + "dpordersummary." + key + (val.constructor === Array ? " IN ('" + val.join("','") + "')" : " = " + mysql.escape(val));
      }
    });
    if (dpWheres != '') { // add initial WHERE command
      dpWheres = 'WHERE ' + dpWheres;
    }

    // Select Data
    Database.knex
      .raw(
      'SELECT dpordersummary.id, dpordersummary.FUNDS, dpcodes.DESC AS `SHIPFROM` ,  DATE_FORMAT(SHIPDATE,"%Y-%m-%d") AS `SHIPDATE`,  DATE_FORMAT(DATE,"%Y-%m-%d") AS `DATE`,'
      + 'IF (dpordersummary.order_type = 1,"Sale",IF(dpordersummary.order_type = 2,"Free Gift",dpordersummary.order_type)) AS `order_type`, FORMAT(dpordersummary.GTOTAL,2) AS "GTOTAL" '
      + 'FROM ( SELECT dpordersummary.id FROM dpordersummary '
      + dpWheres
      + innerOrderOffsetLimit
      + ' ) `dpIds`'
      + ' LEFT JOIN dpordersummary ON `dpIds`.`id` = `dpordersummary`.`id`'
      + 'LEFT JOIN dpcodes ON (dpcodes.FIELD = \'SHIPFROM\' AND dpcodes.CODE = dpordersummary.SHIPFROM )'
      // + dpWheres +
      // dpexchange.currency_from) '
      // +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id =
      // dpexchange.currency_to) '
      // +"WHERE dpexchange.currency_from = '"+currency_from+"'"
    ).exec(function (err, response) {
        if (err)
          return console.log(err.toString());

        // Select Filtered Count
        Database.knex.raw('SELECT COUNT(*) AS `count` ' + 'FROM dpordersummary ' + dpWheres
          // +'INNER JOIN dpcurrency AS curr_from ON (curr_from.id =
          // dpexchange.currency_from) '
          // +'INNER JOIN dpcurrency AS curr_to ON (curr_to.id =
          // dpexchange.currency_to) '
          // +"WHERE dpexchange.currency_from = '"+currency_from+"'"
        ).exec(function (err, countresponse) {
            if (err)
              return console.log(err.toString());
            // Select Total Count
            Database.knex.count('id as count').from('dpordersummary').exec(function (err, totalcountresponse) {
              if (err)
                return console.log(err.toString());

              return res.json({
                "draw": req.param('draw'),
                "recordsTotal": totalcountresponse[0]['count'],
                "recordsFiltered": countresponse[0][0]['count'],
                "data": response[0]
              });
            });
          });
      });

    // var orderFullText = Utilities.prepfulltext(req.body.orders.id);
    //
    // // WHERE's for Search Contacts page
    // function doWheres(selectIds) {
    // selectIds.whereRaw('true');
    // if (orderFullText != null) {
    // if (isNaN(req.body.orders.id)) {
    // // selectIds.andWhere(Database.knex.raw('MATCH (dpordersummary.id,
    // dpordersummary.DONOR, dpordersummary.DESC, dpordersummary.CATEGORY)
    // AGAINST ("?" IN BOOLEAN MODE)', [ orderFullText ]));
    // } else {
    // selectIds.andWhere(Database.knex.raw('dpordersummary.id = ?', [
    // req.body.orders.id ]));
    // }
    // }
    // if (req.body.orders.field != null && req.body.orders.field != '') {
    // //selectIds.andWhere(Database.knex.raw('dpcodes.FIELD = ?', [
    // req.body.orders.field ]));
    // }
    // }
    //
    // // Select Data
    // Database.knex.select('dpordersummary.id', 'dpordersummary.DONOR',
    // 'dpordersummary.DATE', 'dpordersummary.order_type',
    // 'dpordersummary.GTOTAL').from(function() {
    // var selectIds = this.select('id').from('dpordersummary');
    // // WHERE's
    // doWheres(selectIds);
    //
    // // ORDER BY
    // selectIds.orderBy(req.body.columns[req.body.order[0].column].data,
    // req.body.order[0].dir);
    // selectIds.limit(parseInt(req.body.length)).offset(parseInt(req.body.start));
    // selectIds.as('dpIds');
    // }).leftJoin('dpordersummary', 'dpIds.id',
    // 'dpordersummary.id').exec(function(err, response) {
    // if (err)
    // return console.log(err.toString());
    //
    // // Select Filtered Count
    // var filteredCountQuery = Database.knex.count('id as
    // count').from('dpordersummary');
    // doWheres(filteredCountQuery);
    // filteredCountQuery.exec(function(err, countresponse) {
    // if (err)
    // return console.log(err.toString());
    // // Select Total Count
    // Database.knex.count('id as
    // count').from('dpordersummary').exec(function(err, totalcountresponse)
    // {
    // if (err)
    // return console.log(err.toString());
    //
    // return res.json({
    // "draw" : req.param('draw'),
    // "recordsTotal" : totalcountresponse[0]['count'],
    // "recordsFiltered" : countresponse[0]['count'],
    // "data" : response
    // });
    // });
    // });
    // });
  }
};
