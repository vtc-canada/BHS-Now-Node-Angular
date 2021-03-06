/**
 * Utilities
 * 
 * @description ::
 */

module.exports = {
    prepfulltext : function(searchterms) {
	if (searchterms != null && searchterms != '') {

	    adr = searchterms.trim();
	    adr = adr.replace(/-/g, ' ').split(" ");

	    var result_search = '';
	    for (var i = 0; i < adr.length; i++) {

		// adr[i] = replaceAll(replaceAll(adr[i].trim(),'(',''),')','');
		adr[i] = adr[i].trim().replace(/[~@%*()\-+<>"]/g, "");// replace(/[|&;$%@"<>()+,]/g,
									// "");

		if (adr[i] != '') {
		    result_search = result_search + "+" + adr[i] + "* ";
		}
	    }
	    result_search = result_search.trim();
	    if (result_search == '') {
		result_search = null;
	    }
	    return result_search;
	} else {
	    return null;
	}
    },
    prepfulltextOR : function(searchterms) {
	if (searchterms != null && searchterms != '') {

	    adr = searchterms.trim();
	    adr = adr.replace(/-/g, ' ').split(" ");

	    var result_search = '';
	    for (var i = 0; i < adr.length; i++) {

		// adr[i] = replaceAll(replaceAll(adr[i].trim(),'(',''),')','');
		adr[i] = adr[i].trim().replace(/[~@%*()\-+<>"]/g, "");// replace(/[|&;$%@"<>()+,]/g,
									// "");

		if (adr[i] != '') {
		    result_search = result_search + "" + adr[i] + "* ";
		}
	    }
	    result_search = result_search.trim();
	    if (result_search == '') {
		result_search = null;
	    }
	    return result_search;
	} else {
	    return null;
	}
    },
    buildAddressString : function(data) {
	var ADD = '';
	var COUNTRY = '';
	var CITY = '';
	var ST = '';
	var ZIP = '';

	if (data.ADD != null) {
	    ADD = data.ADD;
	}
	if (data.CITY != null && data.CITY != '') {
	    CITY = (ADD!=''?',':'') + data.CITY;
	}
	if (data.ST != null && data.ST != '') {
	    ST = (ADD!=''||CITY!=''?',':'') + data.ST;
	}
	if (data.COUNTRY != null && data.COUNTRY != '') {
	    COUNTRY = (ADD!=''||CITY!=''||ST!=''?',':'') + data.COUNTRY;
	}
	if (data.ZIP != null && data.ZIP != '') {
	    ZIP = (ADD!=''||CITY!=''||ST!=''||COUNTRY!=''?',':'') + data.ZIP;
	}
	return ADD +  CITY + ST + COUNTRY + ZIP;
    }
};

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
