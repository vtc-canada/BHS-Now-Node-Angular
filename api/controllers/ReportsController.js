/**
 * ReportsController
 * 
 * @description :: Server-side logic for managing Reports
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    testselect : function(req, res) {
	var params = req.body.params;
	res.json([ {
	    id : 1,
	    label : 'label something'
	}, {
	    id : 2,
	    label : 'label something' + params[0]
	}, {
	    id : 3,
	    label : 'label something' + params[0]
	} ])
    },

    view : function(req, res) {
	var report;
	var pass_locale;
	var phantom_bool;
	if (typeof (req.query) != 'undefined' && typeof (req.query.report_parameters) != 'undefined') { // see
	    // if
	    // we're
	    // passing
	    // in
	    // the
	    // report
	    // stuff
	    // as
	    // GET
	    // parameters
	    report = JSON.parse(req.query.report_parameters);
	    // pass_locale = report.locale;
	    phantom_bool = true;
	} else { // Otherwise, we expect the parameters to be POSTED
	    report = req.body.report;
	    if (typeof (req.session.user) != 'undefined') {
		report.locale = req.session.user.locale || 'en';
	    } else {
		report.locale = 'en';
	    }
	    phantom_bool = false;
	}

	buildReportData(report, phantom_bool, function(data) {
	    if (typeof (data) == 'undefined' || data == null) {
		res.view('reports/failure.ejs', {
		    layout : false,
		    locale : report.locale,
		    message : 'An error occurred while generating the report.'
		});
		return;
	    }
	    if (data.length == 0) {
		res.view('reports/noresults.ejs', {
		    phantom : phantom_bool,
		    locale : report.locale,
		    layout : false,
		    noresults : 'noresults',
		    title : 'No Results',
		    data : data
		});
	    } else {
		res.view('reports/generate.ejs', {
		    phantom : phantom_bool,
		    layout : false,
		    title : '',
		    data : data
		});
	    }
	});
    }
};

function buildReportData(report, phantom_bool, cb) {
    // Generating report stuff
    // safety checks
    var startTime = true;
    var endTime = true;
    if (typeof (report) == 'undefined' || typeof (report.parameters) == 'undefined') {
	cb(null);
	return;
    }
    if (typeof (report.parameters.start_time) == 'undefined' || typeof (report.parameters.start_time.value) == 'undefined' || report.parameters.start_time.value == '') {
	startTime = false;
    }
    if (typeof (report.parameters.end_time) == 'undefined' || typeof (report.parameters.end_time.value) == 'undefined' || report.parameters.end_time.value == '') {
	endTime = false;
    }
    var data = new Array();
    data.timezoneoffset = report.timezoneoffset;
    if (startTime) {
	var start_datetime = new Date(report.parameters.start_time.value);
	var start_label = report.parameters.start_time.locale_label[report.locale];
    }
    if (endTime) {
	var end_datetime = new Date(report.parameters.end_time.value);
	var end_label = report.parameters.end_time.locale_label[report.locale];
    }
    var system_name = report.system_name;

    var header = new Object();
    header.url = '/reports/title/' + report.title.logo;

    // if (report.id == 1) { // / TYPE Alarm History Report

    var line = [];
    line.push(system_name);
    line.push(report.name.locale_label[report.locale]);
    if (typeof (start_label) != 'undefined') {
	line.push(start_label + ': ' + toClientDateTimeString(start_datetime, report.timezoneoffset));
    } else if (typeof (end_label) != 'undefined') {
	line.push(end_label + ': ' + toClientDateTimeString(end_datetime, report.timezoneoffset));
    }

    header.line = line;

    data.header = header;
    data.css = "isystemsnowreports.css";
    data.landscape = false;

    async.each(report.tables, function(table, tablescallback) {
	var parameters = [];
	var result = null;

	for (var i = 0; i < table.parameters.length; i++) {
	    if (typeof (report.parameters[table.parameters[i]]) == 'undefined') { // a
		// constant..
		parameters.push(table.parameters[i]);
	    } else if (typeof (report.parameters[table.parameters[i]].prepfulltext) != 'undefined' && report.parameters[table.parameters[i]].prepfulltext) {
		parameters.push(sails.controllers.utilities.prepfulltext(report.parameters[table.parameters[i]].value));
	    } else {
		parameters.push(report.parameters[table.parameters[i]].value);
	    }
	    // console.log(report[table.parameters[i]]);
	}
	// function getSproc(getSprocCb){
	// Database.dataSproc(table.sproc, parameters, function(err, dresult) {
	// if (err || dresult.length < 1 ) {
	// console.log(err);
	// return tablescallback(null);
	// }
	// getSprocCb(dresult[0]);
	// });
	// }

	// if(table.join&&table.join=='left'){ // continuing a data set with a
	// second sproc. Only for Pivot tables as of 3/13/2015

	// }

	Database.dataSproc(table.sproc, parameters, function(err, result) {
	    if (err || result.length < 1) {
		console.log(err);
		return tablescallback(null);
	    }
	    result = result[0];
	    if (result.length == 0) { // No results...
		return tablescallback(null);
	    }

	    if (typeof (data[table.order]) == 'undefined' || data[table.order] == null) { // if
		// output
		// isnt
		// prepped..
		// do
		// the
		// prep
		// (group
		// headers
		// from
		// config,
		// table
		// result
		// setup)
		data[table.order] = table.section;

		data[table.order].data = new Array();

		/*
		 * data[table.order].data.topborder =
		 * table.section.table.topborder;
		 * data[table.order].data.bottomborder =
		 * table.section.table.bottomborder;
		 * data[table.order].data.spantype =
		 * table.section.table.spantype;
		 * data[table.order].data.toprowtableheader =
		 * table.section.table.toprowtableheader;
		 * data[table.order].data.searchenabled =
		 * table.section.table.searchenabled;
		 */
		data[table.order].header = new Array();

		// Makes Headings
		for (var i = 0; i < table.columns.length; i++) {
		    data[table.order].header[i] = new Object();
		    data[table.order].header[i].val = table.columns[i].locale[report.locale];
		    data[table.order].header[i].bold = true;
		    data[table.order].header[i].bordertop = false;
		    data[table.order].header[i].width = table.columns[i].width;
		    data[table.order].header[i].lastrow = table.columns[i].lastrow;
		    data[table.order].header[i].hidden = table.columns[i].hidden;
		    data[table.order].header[i].align = table.columns[i].align;
		    data[table.order].header[i].titlealign = table.columns[i].titlealign;
		}
	    }

	    // Fills Data
	    // function(section) {
	    // if (section != null) {
	    // data[data.length] =
	    if (table.pivot) {
		addPivotData(data[table.order], result, report.timezoneoffset, table);
	    } else {
		addSectionData(data[table.order], result, report.timezoneoffset, table);
	    }

	    tablescallback(null);

	});
    }, function(err, results) {
	cb(data);
    });

    /*
     * if (typeof (report.parameters.eqp_id.text) != 'undefined') {
     * line.push(report.parameters.eqp_id.locale_label[report.locale] + ': ' +
     * report.parameters.eqp_id.text); eqp_ID = report.parameters.eqp_id.value; }
     * if (typeof (report.parameters.dev_id.text) != 'undefined') {
     * line.push(report.parameters.dev_id.locale_label[report.locale] + ': ' +
     * report.parameters.dev_id.text); dev_ID = report.parameters.dev_id.value; }
     */

    // addAlarmFaultHistory(start_datetime, end_datetime, fault_type,
    // eqp_ID, dev_ID, report.locale, report.timezoneoffset,
    // function(section) {
    // if (section != null) {
    // data[data.length] = section;
    // }
    // cb(data);
    // });
    // } // END OF REPORT 1
}

function addPivotData(section, adddata, timezoneoffset, table) {

    var pivotindex = {};

    for (var i = 0; i < adddata.length; i++) {

	if (pivotindex[adddata[i][table.pivot.id]] == undefined) { // new
	    // pivotindex
	    // for(var sc = 0; sc < section.data.length; sc++){

	    // }
	    pivotindex[adddata[i][table.pivot.id]] = section.data.length;
	    section.data[pivotindex[adddata[i][table.pivot.id]]] = new Array();
	    section.data[pivotindex[adddata[i][table.pivot.id]]][table.columns.length - 1] = undefined; // initializes empty array

	    for (var initcol = 0; initcol < table.columns.length; initcol++) { // Applies any 'value' fields- initialization - can overwrite these.
		if (typeof(table.columns[initcol].value)!='undefined'&&initcol!=table.pivot.columns['id']&&initcol!=table.pivot.columns[adddata[i][table.pivot.name]]) { 
		    section.data[pivotindex[adddata[i][table.pivot.id]]][initcol] = new Object();
		    section.data[pivotindex[adddata[i][table.pivot.id]]][initcol].val = table.columns[initcol].value;
		    section.data[pivotindex[adddata[i][table.pivot.id]]][initcol].bold = false;
		    section.data[pivotindex[adddata[i][table.pivot.id]]][initcol].bordertop = false;
		}
	    }

	    section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns['id']] = new Object();

	    if (typeof (table.columns[table.pivot.columns['id']].modifier) != 'undefined') {
		if (table.columns[table.pivot.columns['id']].modifier == "localdatetime") {
		    section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns['id']].val = toClientDateTimeString(adddata[i][table.pivot.id], timezoneoffset);
		} else if (table.columns[table.pivot.columns['id']].modifier == "secondsString") {
		    section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns['id']].val = secondsToString(adddata[i][table.pivot.id]);
		}
	    } else {
		section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns['id']].val = adddata[i][table.pivot.id];
	    }
	    section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns['id']].bold = false;
	    section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns['id']].bordertop = false;

	    // adddata[i][table.pivot.id];
	}
	section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns[adddata[i][table.pivot.name]]] = new Object();
	//console.log(adddata[i][table.pivot.id] + ' ' + adddata[i][table.pivot.name] + ' ' + adddata[i][table.pivot.value]);
	//if ('EZ ACTIVE_LAPSED 253' == adddata[i][table.pivot.id] + ' ' + adddata[i][table.pivot.name] + ' ' + adddata[i][table.pivot.value]) {
	//    console.log('here');
	//}

	if (typeof (table.columns[table.pivot.columns[adddata[i][table.pivot.name]]].modifier) != 'undefined') {
	    if (table.columns[table.pivot.columns[adddata[i][table.pivot.name]]].modifier == "localdatetime") {
		section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns[adddata[i][table.pivot.name]]].val = toClientDateTimeString(adddata[i][table.pivot.value], timezoneoffset);
	    } else if (table.columns[table.pivot.columns[adddata[i][table.pivot.name]]].modifier == "secondsString") {
		section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns[adddata[i][table.pivot.name]]].val = secondsToString(adddata[i][table.pivot.value]);
	    }
	} else {
	    section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns[adddata[i][table.pivot.name]]].val = adddata[i][table.pivot.value];
	}
	section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns[adddata[i][table.pivot.name]]].bold = false;
	section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns[adddata[i][table.pivot.name]]].bordertop = false;
	// section.data[pivotindex[adddata[i][table.pivot.id]]][table.pivot.columns[adddata[i][table.pivot.name]]]
	// = adddata[i][table.pivot.value];

    }
    // section.data[i] = new Array();
    // var k = 0;
    /*
     * adddata[i] = if() pivot : { id : 'CLASS', name : 'Country', value :
     * 'Count', columns:{id:0, Canada:1, Total:2} },
     */
    /*
     * for ( var key in adddata[i]) { if (adddata[i].hasOwnProperty(key)) {
     * section.data[i][k] = new Object(); if (typeof (table.columns[k].modifier) !=
     * 'undefined') { if (table.columns[k].modifier == "localdatetime") {
     * section.data[i][k].val = toClientDateTimeString(adddata[i][key],
     * timezoneoffset); } else if (table.columns[k].modifier == "secondsString") {
     * section.data[i][k].val = secondsToString(adddata[i][key]); } else if
     * (table.columns[k].modifier == "norepeat") { section.data[i][k].val = (i ==
     * 0 || adddata[i][key] != adddata[i - 1][key]) ? adddata[i][key] : ''; } }
     * else { section.data[i][k].val = adddata[i][key]; }
     * section.data[i][k].bold = false; section.data[i][k].bordertop = false;
     * k++; } }
     */
}

function addSectionData(section, adddata, timezoneoffset, jsonData) {
    for (var i = 0; i < adddata.length; i++) {
	section.data[i] = new Array();
	var k = 0;
	for ( var key in adddata[i]) {
	    if (adddata[i].hasOwnProperty(key)) {
		section.data[i][k] = new Object();
		if (typeof (jsonData.columns[k].modifier) != 'undefined') {
		    if (jsonData.columns[k].modifier == "localdatetime") {
			section.data[i][k].val = toClientDateTimeString(adddata[i][key], timezoneoffset);
		    } else if (jsonData.columns[k].modifier == "secondsString") {
			section.data[i][k].val = secondsToString(adddata[i][key]);
		    } else if (jsonData.columns[k].modifier == "norepeat") {
			section.data[i][k].val = (i == 0 || adddata[i][key] != adddata[i - 1][key]) ? adddata[i][key] : '';
		    }
		} else {
		    section.data[i][k].val = adddata[i][key];
		}
		section.data[i][k].bold = false;
		section.data[i][k].bordertop = false;
		k++;
	    }
	}
    }
}

function secondsToString(seconds) {

    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;

    return padLeft(numdays, 2) + ":" + padLeft(numhours, 2) + ":" + padLeft(numminutes, 2) + ":" + padLeft(numseconds, 2);

}

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
function toLocaleDateTimeString(date) {
    return date.getFullYear() + '-' + padLeft((date.getMonth() + 1).toString(), 2) + '-' + padLeft(date.getDate(), 2) + ' ' + padLeft(date.getHours(), 2) + ':' + padLeft(date.getMinutes(), 2) + ':' + padLeft(date.getSeconds(), 2);
}

function toUTCDateTimeString(date) {
    var tdate = new Date(date.getTime());
    tdate = new Date(tdate.setMinutes(tdate.getMinutes() - tdate.getTimezoneOffset())); // SHIFTING
    // HERE!!!
    return tdate.getUTCFullYear() + '-' + padLeft((tdate.getUTCMonth() + 1).toString(), 2) + '-' + padLeft(tdate.getUTCDate(), 2) + ' ' + padLeft(tdate.getUTCHours(), 2) + ':' + padLeft(tdate.getUTCMinutes(), 2) + ':' + padLeft(tdate.getUTCSeconds(), 2);
}

var serialiseObject = function(obj) {
    var pairs = [];
    for ( var prop in obj) {
	if (!obj.hasOwnProperty(prop)) {
	    continue;
	}

	if (Object.prototype.toString.call(obj[prop]) == '[object Object]') {
	    pairs.push(serialiseObject(obj[prop]));
	    continue;
	}

	pairs.push(prop + '=' + obj[prop]);
    }
    return pairs.join('&');
}

function toLocalISOString(date) {
    date = new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()));
    return date.toISOString();
}

function getJSONData(obj) {
    obj = obj[0][0];
    var str = '';
    for ( var p in obj) {
	if (obj.hasOwnProperty(p)) {
	    return JSON.parse(obj[p]);
	}
    }
}

function getJSONTitles(obj) {
    obj = obj[0];
    var str = '';
    for ( var p in obj) {
	if (obj.hasOwnProperty(p)) {
	    return JSON.parse(obj[p]);
	}
    }
}
