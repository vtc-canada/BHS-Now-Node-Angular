/**
 * DataMaintenanceController
 *
 * @description :: Server-side logic for managing utilities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var varStartYear = 2014;
var varStartMonth = 0; // 0 to 11

module.exports = {
    
    UpdateDonorClass : function(req,res){
	
	
    },

    UpdateDonorStatus : function(req, res) { // checks for and does monthly maintenance
	//Database.knex.raw('call update_ContactStatus(null)').exec(function(err,results){
	//    if (err)
	//	return console.log(err);

	var dataYear;
	var dataMonth;

	var dateObj = new Date();
	var nowYear = dateObj.getFullYear();
	var nowMonth = dateObj.getMonth();

	//var runmonths = [];
	// while()

	//var startMonthDate = new Date(dateObj.getFullYear() + '-' + padLeft(dateObj.getMonth()+1 ,2) + '-' + padLeft(dateObj.getDate(),2));

	Database.knex.raw("SELECT MAX(month) AS 'month' FROM dpdonorstatushistory").exec(function(err, result) {
	    if (err)
		return console.log(err);

	    var doStatusChanges = false;
	    if (result[0].length == 0) {
		dataYear = varStartYear;
		dataMonth = varStartMonth;
	    } else {
		dataYear = result[0][0].month.getUTCFullYear();
		dataMonth = result[0][0].month.getUTCMonth();
		if (dataMonth < 11) {
		    dataMonth++;
		} else {
		    dataYear++;
		    dataMonth = 0;
		}
		console.log('last history : ' + result[0][0].month);
		doStatusChanges = true;
	    }
	    var monthJobs = [];
	    while (dataYear < nowYear || dataMonth <= nowMonth) {
		monthJobs.push({
		    year : dataYear,
		    month : dataMonth,
		    doStatusChanges : doStatusChanges
		});
		doStatusChanges = true;
		if (dataMonth < 11) {
		    dataMonth++;
		} else {
		    dataYear++;
		    dataMonth = 0;
		}
	    }

	    // monthJobs prepared - with doStatusChanges

	    async.eachSeries(monthJobs, function(monthJob, callback) {
		Database.knex.raw("call update_DonorStatusHistory('" + monthJob.year + "-" + padLeft(monthJob.month+1, 2) + "-01')").exec(function(err, result) {
		    if (err)
			callback(err);

		    if (monthJob.doStatusChanges) {
			Database.knex.raw("call update_DonorStatusHistoryChanges('" + monthJob.year + "-" + padLeft(monthJob.month+1, 2) + "-01')").exec(function(err, result) {
			    if (err)
				callback(err);
			    callback(null);
			});
		    } else {
			callback(null);
		    }
		});
	    }, function(err, results) {
		if (err) {
		    return console.log(err.toString());
		}
		console.log('completed');
	    });
	    

		res.json({'Working Jobs' : monthJobs});
		
		
	});

	//});

    }
};

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}
