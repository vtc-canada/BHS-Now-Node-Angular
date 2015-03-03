/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    testselect : function(req,res){
	var params = req.body.params;
	res.json([{id:1,label:'label something'},{id:2,label:'label something'+params[0]},{id:3,label:'label something'+params[0]}])
    },



    view : function(req,res){
	var report;
	var pass_locale;
	var phantom_bool;
	if (typeof (req.query) != 'undefined' && typeof (req.query.report_parameters) != 'undefined') { // see if we're passing in the report stuff as GET parameters
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
    if (typeof (report) == 'undefined' || typeof (report.parameters) == 'undefined') {
	cb(null);
	return;
    }
    if (typeof (report.parameters.start_time) == 'undefined' || typeof (report.parameters.start_time.value) == 'undefined'
	    || report.parameters.start_time.value == '') {
	cb(null);
	return;
    }
    if (typeof (report.parameters.end_time) == 'undefined' || typeof (report.parameters.end_time.value) == 'undefined'
	    || report.parameters.end_time.value == '') {
	cb(null);
	return;
    }
    var data = new Array();
    data.timezoneoffset = report.timezoneoffset;
    var start_datetime = new Date(report.parameters.start_time.value);
    var start_label = report.parameters.start_time.locale_label[report.locale];
    var end_datetime = new Date(report.parameters.end_time.value);
    var end_label = report.parameters.end_time.locale_label[report.locale];
    var system_name = report.system_name;
    
    var header = new Object();
    header.url =  '/reports/title/' + report.title.logo;
    
    if (report.id == 1) { // / TYPE Alarm History Report

	var line = [];
	line.push(system_name);
	line.push(report.name.locale_label[report.locale]);
	line.push(start_label + ': ' + toClientDateTimeString(start_datetime, report.timezoneoffset));
	line.push(end_label + ': ' + toClientDateTimeString(end_datetime, report.timezoneoffset));

	header.line = line;

	data.header = header;
	data.css = "isystemsnowreports.css";
	data.landscape = false;
	
	
	async.eachSeries(report.tables,function(table, tablescallback){
	    var parameters = [];
	    
	    for(var i=0;i<table.parameters.length;i++){
		if(typeof(report.parameters[table.parameters[i]].prepfulltext)!='undefined'&&report.parameters[table.parameters[i]].prepfulltext){
		    parameters.push(sails.controllers.utilities.prepfulltext(report.parameters[table.parameters[i]].value));
		}else{
		    parameters.push(report.parameters[table.parameters[i]].value);
		}
		//console.log(report[table.parameters[i]]);
	    }
	    Database.dataSproc(table.sproc, parameters, function(err, result) {
		if (err || result.length < 1 || result[0].length < 1) {
		    console.log(err);
		    return tablescallback(null);
		}
		result = result[0];
		
		//var section = new Object();
		//section.startrow = true;
		//section.endrow = true;

		section = table.section;
		
		/*
		section.groupheading = new Array();
		section.groupheading.spantype = 'col-xs-12';

		section.groupheading[0] = new Array();
		section.groupheading[0][0] = new Object();
		section.groupheading[0][0].val = 'Category Report';
		section.groupheading[0][0].bold = true;
*/
		
		section.data = new Array();
		section.data.topborder = section.table.topborder;
		section.data.bottomborder = section.table.bottomborder;
		section.data.spantype = section.table.spantype;
		section.data.toprowtableheader = section.table.toprowtableheader;
		section.data.searchenabled = section.table.searchenabled;

		section.data[0] = new Array();

		// Makes Headings
		for (var i = 0; i < table.columns.length; i++) {
		    section.data[0][i] = new Object();
		    section.data[0][i].val = table.columns[i].locale[report.locale];
		    section.data[0][i].bold = true;
		    section.data[0][i].bordertop = false;
		    section.data[0][i].width = table.columns[i].width;
		    section.data[0][i].lastrow = table.columns[i].lastrow;
		    section.data[0][i].hidden = table.columns[i].hidden;
		    section.data[0][i].align = table.columns[i].align;
		    section.data[0][i].titlealign = table.columns[i].titlealign;
		}

		// Fills Data     
		 //function(section) {
		//	    if (section != null) {
		data[data.length] = addSectionData(section, result, report.timezoneoffset, table);
		tablescallback(null);
		
	    });
	},function(err,results){
	    cb(data);
	});
	
	
/*
	if (typeof (report.parameters.eqp_id.text) != 'undefined') {
	    line.push(report.parameters.eqp_id.locale_label[report.locale] + ': ' + report.parameters.eqp_id.text);
	    eqp_ID = report.parameters.eqp_id.value;
	}
	if (typeof (report.parameters.dev_id.text) != 'undefined') {
	    line.push(report.parameters.dev_id.locale_label[report.locale] + ': ' + report.parameters.dev_id.text);
	    dev_ID = report.parameters.dev_id.value;
	}*/

	//addAlarmFaultHistory(start_datetime, end_datetime, fault_type, eqp_ID, dev_ID, report.locale, report.timezoneoffset, function(section) {
	//    if (section != null) {
	//	data[data.length] = section;
	//    }
	   // cb(data);
	//});

    } // END OF REPORT 1
}


function addSectionData(section, adddata, timezoneoffset, jsonData) {
    for (var i = 0; i < adddata.length; i++) {
	var j = i + 1;
	section.data[j] = new Array();
	var k = 0;
	for ( var key in adddata[i]) {
	    if (adddata[i].hasOwnProperty(key)) {
		section.data[j][k] = new Object();
		if (typeof (jsonData.columns[k].modifier) != 'undefined') {
		    if (jsonData.columns[k].modifier == "localdatetime") {
			section.data[j][k].val = toClientDateTimeString(adddata[i][key], timezoneoffset);
		    } else if (jsonData.columns[k].modifier == "secondsString") {
			section.data[j][k].val = secondsToString(adddata[i][key]);
		    } else if (jsonData.columns[k].modifier == "norepeat") {
			section.data[j][k].val = (j == 1 || adddata[i][key] != adddata[i - 1][key]) ? adddata[i][key] : '';
		    }
		} else {
		    section.data[j][k].val = adddata[i][key];
		}
		section.data[j][k].bold = false;
		section.data[j][k].bordertop = false;
		k++;
	    }
	}
    }
    return section;
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
    tdate = new Date(tdate.setMinutes(tdate.getMinutes() - offset)); // SHIFTING HERE!!!
    return tdate.getUTCFullYear() + '-' + padLeft((tdate.getUTCMonth() + 1).toString(), 2) + '-' + padLeft(tdate.getUTCDate(), 2) + ' '
	    + padLeft(tdate.getUTCHours(), 2) + ':' + padLeft(tdate.getUTCMinutes(), 2) + ':' + padLeft(tdate.getUTCSeconds(), 2);
}

function padLeft(nr, n, str) {
    if (String(nr).length >= n) {
	return String(nr);
    }
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}
function toLocaleDateTimeString(date) {
    return date.getFullYear() + '-' + padLeft((date.getMonth() + 1).toString(), 2) + '-' + padLeft(date.getDate(), 2) + ' ' + padLeft(date.getHours(), 2) + ':'
	    + padLeft(date.getMinutes(), 2) + ':' + padLeft(date.getSeconds(), 2);
}

function toUTCDateTimeString(date) {
    var tdate = new Date(date.getTime());
    tdate = new Date(tdate.setMinutes(tdate.getMinutes() - tdate.getTimezoneOffset())); // SHIFTING HERE!!!
    return tdate.getUTCFullYear() + '-' + padLeft((tdate.getUTCMonth() + 1).toString(), 2) + '-' + padLeft(tdate.getUTCDate(), 2) + ' '
	    + padLeft(tdate.getUTCHours(), 2) + ':' + padLeft(tdate.getUTCMinutes(), 2) + ':' + padLeft(tdate.getUTCSeconds(), 2);
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

