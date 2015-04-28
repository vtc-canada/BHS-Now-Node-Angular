/**
 * ImportController
 * 
 * @description :: Server-side logic for managing imports
 * @help :: See http://links.sailsjs.org/docs/controllers
 */
var databases = [ {
    name : 'fatima_american',
    database_origin : 1,
    database_offset : 1000000
}, {
    name : 'fatima_canadian',
    database_origin : 2,
    database_offset : 3000000
}, {
    name : 'fatima_ecclesiastical',
    database_origin : 3,
    database_offset : 4000000
}, {
    name : 'fatima_foreign',
    database_origin : 4,
    database_offset : 5000000
}, {
    name : 'fatima_marketing',
    database_origin : 5,
    database_offset : 6000000
}, {
    name : 'fatima_livingrosary',
    database_origin : 6,
    database_offset : 7000000
}, {
    name : 'fatima_indialay',
    database_origin : 7,
    database_offset : 8000000
}, {
    name : 'fatima_indiaecc',
    database_origin : 8,
    database_offset : 9000000
}, {
    name : 'fatima_italylay',
    database_origin : 9,
    database_offset : 10000000
}, {
    name : 'fatima_italyecc',
    database_origin : 10,
    database_offset : 11000000
}, {
    name : 'fatima_philippineslay',
    database_origin : 11,
    database_offset : 12000000
}, {
    name : 'fatima_philippinesecc',
    database_origin : 12,
    database_offset : 13000000
}
// ,{name:'fatima_foreign'}

];

var tables = [ {
    name : 'dp',
    columns : {}
}, {
    name : 'dpcodes',
    columns : {}
}, {
    name : 'dpgift',
    columns : {}
}, {
    name : 'dplink',
    columns : {}
}, {
    name : 'dpmisc',
    columns : {}
}, {
    name : 'dpothadd',
    columns : {}
}, {
    name : 'dpother',
    columns : {}
}, {
    name : 'dpplg',
    columns : {}
}, {
    name : 'dpplg2',
    columns : {}
}, {
    name : 'dtbishop',
    columns : {}
}, {
    name : 'dtdondet',
    columns : {}
}, {
    name : 'dtdonmas',
    columns : {}
}, {
    name : 'dtdonsum',
    columns : {}
}, {
    name : 'dtmail',
    columns : {}
}, {
    name : 'dtmajor',
    columns : {}
}, {
    name : 'dtvolmas',
    columns : {}
}, {
    name : 'dtvolord',
    columns : {}
}, {
    name : 'dtvols1',
    columns : {}
}, {
    name : 'maildrop',
    columns : {}
}, {
    name : 'dpmyst',
    columns : {}
} ];

var insertTables = [];

var destination = 'fatima_center_donor_tracker_v2'; // Remember. this drops the
// database.
var destroy_database_BEWARE = false;

var currencies = [ 'C', 'E', 'P', 'R', 'U' ];

module.exports = {
    

    paddexchange : function(req, res, cb) {
	Database.knex.raw('SELECT `id`, `currency_from`, `currency_to`, `exchange_rate`, DATE_FORMAT(date,"%Y-%m-%d") AS `date`  FROM dpexchange_history').exec(function(err, dpexchange) {
	    if (err) {
		return console.log('Failed getting DPExchange. ' + err);
	    }
	    var i = 0;
	    var exchange = {};
	    for ( var row in dpexchange[0]) {

		i++;
		if (typeof (exchange[dpexchange[0][row]['date']]) == 'undefined') {
		    exchange[dpexchange[0][row]['date']] = {};
		}
		if (typeof (exchange[dpexchange[0][row]['date']][dpexchange[0][row]['currency_from']]) == 'undefined') {
		    exchange[dpexchange[0][row]['date']][dpexchange[0][row]['currency_from']] = {};
		}
		exchange[dpexchange[0][row]['date']][dpexchange[0][row]['currency_from']][dpexchange[0][row]['currency_to']] = dpexchange[0][row]['exchange_rate'];
		if (i % 100 == 0) {
		    console.log(i);
		}

	    }// ,function(err,result){
	    // console.log(JSON.stringify(exchange['2008-02-03']));

	    setTimeout(function() {

		var newobj = [];
		var i = 0;
		var j = 0;

		for ( var date in exchange) {
		    for ( var cFrom in currencies) {
			for ( var cTo in currencies) {
			    if (typeof (exchange[date][currencies[cFrom]]) == 'undefined' || typeof (exchange[date][currencies[cFrom]][currencies[cTo]]) == 'undefined') { // missing
				var rate = 1;
				if (currencies[cTo] != 'U') { // not to US
								// //What about
								// US to non-US
				    if (currencies[cFrom] == 'U') {
					rate = 1 / exchange[date][currencies[cTo]]['U']; // inverts
											    // original
				    } else {
					rate = exchange[date][currencies[cFrom]]['U'] / exchange[date][currencies[cTo]]['U'];
				    }
				}
				i++;
				if(i>=10000){
				    j++;
				    i=0;
				}
				if (typeof (newobj[j]) == 'undefined') {
				    newobj[j] = [];
				}
				    newobj[j].push({
					currency_from : currencies[cFrom],
					currency_to : currencies[cTo],
					date : date,
					exchange_rate : rate
				    });
			    }
			}
		    }
		}

		console.log('trying bulk insert ' + i + ' ' + j);

		setTimeout(function() {
		    async.eachSeries(newobj,function(obj,callback){
			Database.knex('dpexchange_history').insert(obj).exec(function(err, response) {
				callback(err,response);
			    });
		    },function(err,response){
			if (err){
			    console.log(err.toString());
			}
			    
			//res.json({
			//    loaded : 'Success'
			//});
			
			if(cb){
			    cb(err,response);
			}
		    });

		}, 500);
	    }, 1000)

	});

    },
    languages : function(req, res) {
	Database.knex('dp').select('id', 'LANGUAGE', 'ENGLISH', 'database_origin').exec(function(err, results) {
	    if (err) {
		console.log('error' + err.toString());
	    }
	    results = results[0];
	    var i = 0;
	    async.eachSeries(results, function(row, cb) {
		i++;
		if (i == 100) {
		    i = 0;
		    console.log(row.id);
		}
		Database.knex('dplang').insert({
		    DONOR : row.id,
		    LANGUAGE : row.LANGUAGE,
		    database_origin : row.database_origin
		}).exec(function(err, pr) {
		    if (err)
			return cb(err);
		    if (row.LANGUAGE != 'E' && row.ENGLISH == 'Y') {
			Database.knex('dplang').insert({
			    DONOR : row.id,
			    LANGUAGE : 'E',
			    database_origin : row.database_origin
			}).exec(function(err, pr) {
			    if (err)
				return cb(err);
			    cb(null);
			});
		    } else {
			cb(null);
		    }
		});

	    }, function(err, results) {
		if (err)
		    console.log(err);

		console.log('completed');
	    });
	    console.log('gotall');
	});
	res.json('processing');
    },

    data : function(req, res) {
	res.json({
	    message : 'processing'
	});

	async.eachSeries(databases, function(database, databasecallback) { // Iterating
	    // through
	    // each
	    // database
	    for (var i = 0; i < tables.length; i++) {
		tables[i].columns = {};// CLEAR TABLE COLUMNS!!!!
	    }

	    var dbknex = getDb(database.name, database.database_origin, database.database_offset);

	    buildTables(dbknex, function() { // Tables array is now prepped.
		// //

		insertTables = [];
		for (var i = 0; i < tables.length; i++) {
		    if (typeof (tables[i].cols) != 'undefined') {
			insertTables.push(tables[i]);
		    }
		}
		async.eachSeries(insertTables, function(table, tablescallback) {
		    var columns = '';
		    var columnvalues = '';

		    if (table.name == 'dp') {// for DP table.. we want to add
			// the id to the insert values.
			columns = '`id`';
			columnvalues = 'CAST(`DONOR2` AS UNSIGNED) + ' + dbknex.database_offset;
		    }

		    for ( var column in table.columns) {
			if (table.columns.hasOwnProperty(column)) {
			    var column = table.columns[column];
			    // do stuff

			    if (column.Field != 'database_origin') {
				if (columns != '') {
				    columns += ', ';
				    columnvalues += ', ';
				}
				columns += '`' + column.Field + '`';
				if (column.Type == 'date') {
				    columnvalues += 'IF(`' + column.Field + '` = "1899-12-30", NULL, `' + column.Field + '` )';
				} else if ((column.Field == 'DONOR2' && table.name != 'dp') || column.Field == 'DONOR' || column.Field == 'ID1' || column.Field == 'ID2' || column.Field == 'G_ID2' || column.Field == 'ORDNUMD' || column.Field == 'DONORD') {
				    columnvalues += 'IF(`' + column.Field + '` = "", NULL, CAST(`' + column.Field + '` AS UNSIGNED) + ' + dbknex.database_offset + ' )';
				} else if (column.Type.indexOf('char') == 0 || column.Type.indexOf('longtext') == 0) {
				    columnvalues += 'IF(TRIM(`' + column.Field + '`) = "",NULL,`' + column.Field + '`)';
				} else {
				    columnvalues += '`' + column.Field + '`';
				}
			    }
			}
		    }
		    // dbknex = null;
		    // tablescallback();
		    //
		    // console.log('origin:'+dbknex.database_origin);//should be
		    // integer

		    dbknex.raw('INSERT INTO `' + destination + '`.`' + table.name + '` (' + columns + ', `database_origin`) SELECT ' + columnvalues + ', ' + dbknex.database_origin + '  FROM `' + dbknex.database_name + '`.`' + table.name + '` ').exec( // LIMIT
																															    // 50000
		    function(err, inserted) {
			if (err) {
			    console.log('ERROR:' + err.toString());
			    console.log('INSERT INTO `' + destination + '`.`' + table.name + '` (' + columns + ', `database_origin`) SELECT ' + columnvalues + ', ' + dbknex.database_origin + '  FROM `' + dbknex.database_name + '`.`' + table.name + '` ');
			    console.log(JSON.stringify(columns));
			}

			tablescallback();
		    });
		}, function(err) {
		    databasecallback();
		});
		// iterate and DO INSERT BASED OFF insertTables // return -> run
		// databasecallback()

	    });
	}, function(err) {
	    console.log('done iterating databases');
	});
    },

    schema : function(req, res) {
	res.json({
	    message : 'processing'
	});

	function doCreates() { // Runs after creating the tables structures
	    // array.
	    var dbknex = getDb(destination); // Just get the created database
	    async.eachSeries(tables, function(table, tablecallback) { // Table
		// iterations
		dbknex.schema.createTable(table.name, function(knextable) {
		    knextable.increments();
		    for ( var column in table.columns) {
			if (table.columns.hasOwnProperty(column)) {
			    // do stuff
			    var column = table.columns[column];

			    if (column.Type.indexOf('char') == 0) { // varchars
				knextable.string(column.Field);
			    } else if (column.Type.indexOf('int') == 0) { // INTEGER
				knextable.integer(column.Field);
			    } else if (column.Type.indexOf('float') == 0) { // Float
				knextable.float(column.Field);
			    } else if (column.Type.indexOf('date') == 0) { // date
				knextable.date(column.Field);
			    } else if (column.Type.indexOf('tinyint') == 0) { // INTEGER
				knextable.specificType(column.Field, 'TINYINT(4)');
			    } else if (column.Type.indexOf('longtext') == 0) {
				knextable.text(column.Field, 'longtext');
			    } else {
				console.log('missing type:' + column.Type);
			    }

			}
		    }
		}).exec(function(err, result) {
		    tablecallback(); // done with a table
		});
	    }, function(err) { // Finished iterating all tables
		console.log('created tables');
	    });
	}

	function doSchema() { // Runs after creating the tables structures
	    // array.
	    var dbknex = getDb(databases[0].name); // Just get any database.
	    // Now creating the scheme.
	    // fatima_center_donor_tracker
	    if (destroy_database_BEWARE) {
		dbknex.raw('DROP DATABASE ' + destination).exec(function(err, dropped) { // Drops
		    // it..
		    // be
		    // careful
		    dbknex.raw('CREATE SCHEMA ' + destination).exec(function(err, created) {
			if (err)
			    return res.json(err, 500);
			doCreates();
		    });
		});
	    } else {
		doCreates();
	    }

	}

	async.eachSeries(databases, function(database, databasecallback) { // Iterating
	    // through
	    // each
	    // database

	    var dbknex = getDb(database.name, database.database_origin, database.database_offset);

	    buildTables(dbknex, function() {
		databasecallback(); // finishes this database iteration
	    });

	}, function(err) { // Finished iterating each database.
	    console.log('here');
	    // if any of the saves produced an error, err would equal that error

	    doSchema();
	});
    }

};

function getDb(dbname, origin, offset) {
    var dbken = require('knex')({
	client : 'mysql',
	connection : {
	    adapter : 'sails-mysql',
	    host : '10.1.1.60',
	    user : 'root',
	    password : 'Glasgow931',
	    database : dbname,
	    timezone : 'utc'
	},
	pool : {
	    min : 0,
	    max : 7
	},
	debug : true
    });
    dbken.database_name = dbname;
    dbken.database_origin = origin;
    dbken.database_offset = offset;
    return dbken;
}

function buildTables(dbknex, buildtablescallback) {
    async.eachSeries(tables, function(table, tablecallback) { // Table
	// iterations

	dbknex.raw('DESCRIBE ' + table.name).exec(function(err, describe) { // WHAT
	    // IF
	    // THE
	    // TABLE
	    // DOESNT
	    // EXIST?
	    if (err) { // No such table probably.
		return tablecallback();
	    }
	    describe = describe[0];

	    for (var i = 0; i < describe.length; i++) {
		if (typeof (table.columns[describe[i].Field]) == 'undefined') {
		    var dtemp = describe[i];
		    // if(dtemp.FIELD)
		    // if(dtemp.Type)
		    if (dtemp.Field == 'DONOR2' || dtemp.Field == 'DONOR' || dtemp.Field == 'ID1' || dtemp.Field == 'ID2' || dtemp.Field == 'G_ID2' || dtemp.Field == 'ORDNUMD' || dtemp.Field == 'DONORD') {
			dtemp.Type = 'int(11)'
		    }
		    // if(dtemp.Type.indexOf('char')==0){ // if it's
		    // Char
		    // // type
		    // dtemp.Type = 'varchar(255)';
		    // }
		    table.columns[dtemp.Field] = dtemp;
		    if (typeof (table.cols) == 'undefined') {
			table.cols = 0;
		    }
		    table.cols++; // incrememnt number of columns
		}
	    }

	    if (typeof (table.cols) != 'undefined' && typeof (table.columns['database_origin']) == 'undefined') {
		table.columns['database_origin'] = {
		    Field : 'database_origin',
		    Type : 'tinyint(4)'
		};
		table.cols++;
	    }

	    tablecallback(); // We've finished iterating through this
	    // table.
	});

    }, function(err, data) { // we've finished iterating through all the
	// tables
	buildtablescallback(); // finishes this database iteration
    });
}
