var cache = {};

module.exports = {
    save : function(id, key, cachet){
	if(typeof(cache[id])=='undefined'){
	    cache[id] = {};
	}
	cache[id][key] = cachet;
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
	}
    }
}