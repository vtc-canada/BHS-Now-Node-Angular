var cache = {};

var cachestamps = {};
var monitorRate = 60000; // 1 minute
var cacheperiod = 300000; // 5 minutes

module.exports = {
    save : function(id, key, cachet){
	if(typeof(cache[id])=='undefined'){
	    cache[id] = {};
	}
	cache[id][key] = cachet;
	cachestamps[id] = new Date().getTime();
    }, 
    get : function (id, key){
	if(typeof(cache[id])=='undefined'){
	    return undefined;
	}
	return cache[id][key];
    },
    destroy :function(id){
	if(typeof(cache[id])!='undefined'){
	    delete cache[id];
	    delete cachestamps[id];
	}
    }
}

function doInterval(){
    for(var key in cachestamps){
        if(new Date().getTime() > (cachestamps[key] + cacheperiod)){
 	   console.log('Deleting Cached Report Data: '+key);
 	   delete cache[key];
 	   delete cachestamps[key];
        }
    }
 }


var intervaltimer = setInterval(doInterval,monitorRate);



