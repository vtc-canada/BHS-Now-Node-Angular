/**
 * UtilitiesController
 *
 * @description :: Server-side logic for managing utilities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    builddropdownjson : function(req,res) {

	var distinct = [ 'P245/60R18', 'P245/45R19', 'P225/65R17', 'P225/60R18', 'P225/45R18', 'P235/65R16', 'P225/40R18', 'P305/35R20', 'P265/50R20', 'P275/40R20', 'P265/35R20', 'P275/35R19', 'P265/60R18', 'P275/65R18', 'P235/65R18', 'P225/55R17', 'P215/50R17', 'P245/45R18', 'P235/65R17',
	    'P245/40R19', 'P235/55R18', 'P205/55R16', 'P205/60R15', 'P245/65R17', 'P215/40R18', 'P205/55R17', 'P205/45R17', 'P195/65R15', 'P205/60R16', 'P225/60R16', 'P245/55R18', 'P205/75R15', 'P215/55R17', 'P215/75R15', 'LT245/75R16', 'P205/65R15', 'P195/70R14', 'P215/60R15', 'P195/60R15',
	    'P185/65R14', 'P225/45R17', 'P205/70R15', 'P215/70R15', 'P205/50R16', 'P185/65R15', 'P225/50R16', 'P275/60R20', 'P215/60R16', 'P215/65R16', 'P215/45R17', 'P255/60R19', 'P265/70R17', 'P225/65R16', 'P255/55R18', 'P235/55R17', 'P215/70R16', 'P225/50R17', 'P235/50R18', 'P255/45R19',
	    'P225/55R19', 'P235/55R19', 'LT265/70R17', 'P225/50R18', 'P215/65R15', 'P205/50R17', 'P305/30R20', 'P315/35R20', 'P205/70R16', 'P235/75R15', 'P245/40R17', 'P235/70R16', 'P215/55R18', 'P215/65R17', 'P225/65R19', 'P245/55R19', 'P245/50R18', 'P225/55R18', 'P225/55R16', 'P255/70R16',
	    'LT215/85R16', 'P225/75R15', 'P185/70R14', 'P265/50R15', 'P225/60R15', 'P225/60R17', 'P235/50R19', 'P225/70R16', 'P255/65R16', 'P195/50R16', 'P195/55R15', 'P235/60R16', 'P31/10.5R15', 'P245/75R16', 'P215/60R17', 'P275/45R20', 'P185/60R15', 'P175/65R14', 'P245/70R17', 'P245/50R20',
	    'P235/60R18', 'P235/50R17', 'P225/70R15', 'P225/45R19', 'P255/50R19', 'P195/60R14', 'P185/60R14', 'P205/55R15', 'P255/30R18', 'P255/30R20', 'P255/35R18', 'P205/75R14', 'P185/75R14', 'P245/70R16', 'LT225/75R16', 'P235/45R18', 'P235/40R18', 'P235/45R17', 'P265/60R17', 'P275/55R20',
	    'P235/55R20', 'LT265/75R16', 'P275/45R19', 'P245/35R20', 'P255/40R19', 'P255/55R20', 'P295/45R20', 'P255/55R17', 'P235/75R16', 'P255/65R15', 'P255/35R19', 'P265/65R18', 'P255/50R20', 'P215/70R17', 'P275/40R22', 'P265/70R16', 'P185/55R15', 'P255/60R16', 'P255/60R15', 'P275/40R19',
	    'LT8/-----R16.5', 'P245/40R18', 'P235/60R17', 'LT245/70R16', 'P175/70R14', 'P225/75R16', 'P255/30R19', 'P225/40R19', 'P295/35R21', 'P255/40R20', 'P255/70R18', 'P255/70R17', 'P265/50R19', 'P195/65R16', 'P205/65R16', 'LT265/60R20', 'P205/45R16', 'LT235/65R16', 'P265/70R15', 'P245/45R17',
	    'P235/35R19', 'P225/65R18', 'P215/55R16', 'P225/35R19', 'P195/55R16', 'P215/75R14' ];
	
	var outjson = [];
	for(var dis in distinct){
	    outjson.push({ id : distinct[dis], label : distinct[dis]});
	}
	
	res.json(outjson);

    },

    prepfulltext : function(searchterms) {
	if (searchterms != null && searchterms != '') {
	    adr = searchterms.trim().split(" ");
	    var result_search = '';
	    for (var i = 0; i < adr.length; i++) {

		//adr[i] = replaceAll(replaceAll(adr[i].trim(),'(',''),')','');
		adr[i] = adr[i].trim().replace(/[~@%*()\-+<>"]/g, "");//replace(/[|&;$%@"<>()+,]/g, "");

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
    }
};

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
