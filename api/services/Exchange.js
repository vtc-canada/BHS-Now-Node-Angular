//var exchange = {};
//
//
//var once = true;
//
//module.exports = {
//    get : function (){
//	return exchange;
//    },
//    update :function(){
//	doUpdate();
//    }
//}
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
