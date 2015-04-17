//var exchange = {};
//
//
//var once = true;
//
var exchangeUpdateTimer = null;



module.exports = {
    trigger : function (){
	console.log('Fx Update Trigger');
	if(exchangeUpdateTimer){
	    clearTimeout(exchangeUpdateTimer);
	}
	exchangeUpdateTimer = setTimeout(doFxUpdate,60000);
    }
}

function doFxUpdate(){
    Database.knex('dpexchange_history').truncate().exec(function(err,result){
	if(err){
	    return console.log('Error- unable to truncate dpexchange_history');
	}
	async.parallel([function(cb){
	    Database.dataSproc('filldates_dpexchange_history', ['1980-01-01','2050-12-31','C','U'], function(err, result){
		if(err){
		    return cb(err);
		}
		cb(null,result);    
	    });
	},function(cb){
	    Database.dataSproc('filldates_dpexchange_history', ['1980-01-01','2050-12-31','P','U'], function(err, result){
		if(err){
		    return cb(err);
		}
		cb(null,result);    
	    });
	},function(cb){
	    Database.dataSproc('filldates_dpexchange_history', ['1980-01-01','2050-12-31','R','U'], function(err, result){
		if(err){
		    return cb(err);
		}
		cb(null,result);    
	    });
	},function(cb){
	    Database.dataSproc('filldates_dpexchange_history', ['1980-01-01','2050-12-31','E','U'], function(err, result){
		if(err){
		    return cb(err);
		}
		cb(null,result);    
	    });
	}],function(err,results){
	    if(err){
		return console.log('Error- unable to fill dp_exchange_history');
	    }
	    Database.dataSproc('update_dpexchange_history', [], function(err, result){
		if(err){
		    return cb(err);
		}
		sails.controllers.import.paddexchange();   
	    });
	})

    });
}



//
//function doUpdate(){
//    Database.knex.raw('SELECT `currency_from`, `exchange_rate`, DATE_FORMAT(date,"%Y-%m-%d") AS `date`  FROM dpexchange_history').exec(function(err,dpexchange_history){
//        if(err){
//    	return console.log('SERVICE ERROR. Failed getting DPExchange on BOOT. ' + err);
//        }
//        dpexchange_history = dpexchange_history[0];
//        for(row in dpexchange_history){
//    	if(typeof(exchange[dpexchange_history[row].currency_from])=='undefined'){
//    	    exchange[dpexchange_history[row].currency_from] = {};
//    	}
//    	//console.log(typeof(dpexchange_history[row].date));
//    	exchange[dpexchange_history[row].currency_from][dpexchange_history[row].date] = dpexchange_history[row].exchange_rate;
//        }
//    });
//}
//setTimeout(function(){
//
//    doUpdate();
//},1000);
////
////
////function doInterval(){
////    for(var key in cachestamps){
////        if(new Date().getTime() > (cachestamps[key] + cacheperiod)){
//// 	   console.log('Deleting Cached Report Data: '+key);
//// 	   delete cache[key];
//// 	   delete cachestamps[key];
////        }
////    }
//// }
////
////
////var intervaltimer = setInterval(doInterval,monitorRate);
////
//
//
