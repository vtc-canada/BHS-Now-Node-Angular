/**
 * DonorTrackerController
 *
 * @description :: Server-side logic for managing Donortrackers
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function (req, res) {
    res.view({
      preloaded: {
        first: 'value'
      }
    });
  },
  getdpupdateattributes: function (req, res) {
    async.parallel({
      campaign_types: function (callback) {
        Database.knex('dpcodes').select('CODE', 'DESC').where({
          FIELD: 'CAMPTYPE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      }
    }, function (err, result) {
      if (err)
        return res.json(err.toString(), 500);
      return res.json({
        success: "success",
        result: result
      });
    });
  },
  getfxechangeattributes: function (req, res) {
    async.parallel({
      currencies: function (callback) {
        Database.knex('dpcurrency').select('id', 'name', 'code', 'symbol').orderBy('order', 'asc').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      }
    }, function (err, result) {
      if (err)
        return res.json(err.toString(), 500);
      return res.json({
        success: "success",
        result: result
      });
    });
  },
  getreportattributes: function (req, res) {
    async.parallel({
      countries: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'COUNTRY'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      sols: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SOL'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      currencies: function (callback) {
        Database.knex('dpcurrency').select('id', 'name', 'code', 'symbol').orderBy('order', 'asc').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      ship_from: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SHIPFROM'
        }).orderBy('CODE', 'ASC').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        })
      }
    }, function (err, result) {
      if (err)
        return res.json(err.toString(), 500);
      return res.json({
        success: "success",
        result: result
      });
    });
  },
  getdpcodeattributes: function (req, res) {

    async.parallel({
      dpcodefields: function (callback) {
        Database.knex('dpcodes').distinct('FIELD').select().orderBy('FIELD', 'ASC').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      }
    }, function (err, result) {
      if (err)
        return res.json(err.toString(), 500);
      return res.json({
        success: "success",
        result: result
      });
    });
  },
  getordersattributes: function (req, res) {
    async.parallel({
      sols: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SOL'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      ship_from: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SHIPFROM'
        }).orderBy('CODE', 'ASC').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        })
      },
      titles: function (callback) {
        Database.knex('dp').distinct('TITLE').select().exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      address_types: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'ADDTYPE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      states: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'ST'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      sols: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SOL'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      exchange: function (callback) {
        Database.knex.raw('SELECT `currency_from`, `exchange_rate`, DATE_FORMAT(date,"%Y-%m-%d") AS `date`  FROM dpexchange').exec(function (err, dpexchange) {
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
      countries: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'COUNTRY'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      county_codes: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC', 'MCAT_LO').where({
          FIELD: 'COUNTY'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      phone_types: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'PHTYPE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      currencies: function (callback) {
        Database.knex('dpcurrency').select('id', 'name', 'code', 'symbol').orderBy('order', 'asc').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      litems: function (callback) {
        Database.knex('dpcodes').select('DESC', 'OTHER').distinct('CODE').where({
          FIELD: 'LITEMP'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      }

    }, function (err, result) {
      if (err)
        return res.json(err.toString(), 500);
      return res.json({
        success: "success",
        result: result
      });
    });
  },
  getsearchattributes: function (req, res) {

    async.parallel({
      english: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'ENGLISH'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      donor_classes: function (callback) {
        Database.knex.raw("select distinct `CODE` ,  `DESC` from `dpcodes` where `FIELD` = 'CLASS' order by IF(SUBSTRING(`CODE`, 1,1) = 'U','0',SUBSTRING(`CODE`, 1,1)) DESC, IF(SUBSTRING(`CODE`, 2,length(`CODE`)-1) REGEXP '[0-9]+', CONCAT('Z',SUBSTRING(`CODE`, 2,length(`CODE`)-1)), SUBSTRING(`CODE`, 2,length(`CODE`)-1) ) DESC").exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results[0]);
        });
      },
      flags: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'FLAGS'
        }).orderBy('CODE', 'ASC').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      pledgors: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'PLEDGOR'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },
      volunteers: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'VOLUNTEER'
        }).orderBy('CODE', 'ASC').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      ship_from: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SHIPFROM'
        }).orderBy('CODE', 'ASC').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      currencies: function (callback) {
        Database.knex('dpcurrency').select('id', 'name', 'code', 'symbol').orderBy('order', 'asc').exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      languages: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'LANGUAGE'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      titles: function (callback) {
        Database.knex('dp').distinct('TITLE').select().exec(function (err, titles) {
          if (err)
            return callback(err);
          callback(null, titles);
        });
      },
      address_types: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'ADDTYPE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      states: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'ST'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      major_donation_types: function (callback) {
        callback(null, [{
          id: 'A',
          label: 'Capital Campaign - The Hasten Her Triumph'
        }, {
          id: 'B',
          label: 'Peace Pledge Campaign'
        }]);
      },
      pledge_schedule: function (callback) {
        callback(null, [{
          id: 1,
          label: 'Not a Pledge'
        }, {
          id: 2,
          label: 'Monthly'
        }, {
          id: 3,
          label: 'Quarterly'
        }, {
          id: 4,
          label: 'Semi-anually'
        }, {
          id: 5,
          label: 'Anually'
        }])
      },
      lists: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'LIST'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      decision: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'DECIS'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      willsaymass: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SAYMASS'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      mass_said: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'Q17'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      values_traditional: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'Q18'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      billing_schedules: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'MQA'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      origins: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'ORIGIN'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      sols: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'SOL'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      demands: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'DEMAND'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      modes: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'MODE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      tba_requests: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'TBAREQS'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      requests_plural: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'REQUESTS'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      pledgegroups: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'GL'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },
      transacts: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'TRANSACT'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      }
    }, function (err, result) {
      if (err)
        return res.json(err.toString(), 500);
      return res.json({
        success: "success",
        result: result
      });
    });

  },
  getattributes: function (req, res) {

    async.parallel({

      mtypes: function (callback) {
        Database.knex('dpcodes').select('DESC').distinct('CODE').where({
          FIELD: 'MTYPE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      litems: function (callback) {
        Database.knex('dpcodes').select('DESC', 'OTHER').distinct('CODE').where({
          FIELD: 'LITEMP'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      sources: function (callback) {
        Database.knex('dpcodes').select('DESC').distinct('CODE').where({
          FIELD: 'SOURCE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      exchange: function (callback) {
        Database.knex.raw('SELECT `currency_from`, `exchange_rate`, DATE_FORMAT(date,"%Y-%m-%d") AS `date`  FROM dpexchange').exec(function (err, dpexchange) {
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

      relationships: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'LINK'
        }).orderBy('CODE', 'ASC').exec(function (err, sols) {
          if (err)
            return callback(err);
          callback(null, sols);
        });
      },

      reasons: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'NM_REASON'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },
      cfns: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'CFN'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },
      genders: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'GENDER'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },
      dioceses: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'DIOCESE'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },
      groups: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'GROUP'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },

      accounts_received: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'AR'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },
      types: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'TYPE'
        }).orderBy('CODE', 'ASC').exec(function (err, types) {
          if (err)
            return callback(err);
          callback(null, types);
        });
      },

      countries: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'COUNTRY'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      county_codes: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC', 'MCAT_LO').where({
          FIELD: 'COUNTY'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },
      phone_types: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'PHTYPE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },

      languages: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'LANGUAGE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },

      designates: function (callback) {
        Database.knex('dpcodes').distinct('CODE').select('DESC').where({
          FIELD: 'DESIGNATE'
        }).orderBy('CODE', 'ASC').exec(function (err, results) {
          if (err)
            return callback(err);
          callback(null, results);
        });
      },

      dtvols1: function (callback) {
        async.parallel({
          origins: function (dtvols1callback) {
            Database.knex('dpcodes').distinct('CODE').select('DESC').where({
              FIELD: 'ORIGIN'
            }).exec(function (err, results) {
              if (err)
                return dtvols1callback(err);
              dtvols1callback(null, results);
            });
          }
        }, function (err, result) {
          callback(err, result);
        });

      }
    }, function (err, result) {
      if (err)
        return res.json(err.toString(), 500);
      return res.json({
        success: "success",
        result: result
      });
    });
  }
};
