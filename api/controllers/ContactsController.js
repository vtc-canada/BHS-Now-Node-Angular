/**
 * ContactsController
 * 
 * @description :: Server-side logic for managing contacts
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	gettitles : function(req,res){
	    Database.knex('dp_american').distinct('TITLE').select().exec(function(err,titles){
		if (err)
		    return res.json(err, 500);
		res.json({
			success : '',
			titles : titles
		    });
	    })
	},
    save : function(req, res) {
	var contact = req.body;

	if (contact.id == 'new') { // New Contact.
	    Database.knex('dp_american').insert({
		FNAME : contact.FNAME,
		LNAME : contact.LNAME,
		TITLE : contact.TITLE.id
	    }).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		Database.knex('dp_american').select('*').where({
		    id : response[0]
		}).exec(function(err, customer) {
		    if (err)
			return res.json(err, 500);
		    res.json({
			success : 'Donor has been saved.',
			contact : customer[0]
		    });
		});
	    });
	}else{
	    Database.knex('dp_american').where({
		    id : contact.id
		}).update({
		FNAME : contact.FNAME,
		LNAME : contact.LNAME,
		TITLE : contact.TITLE.id
	    }).exec(function(err, response) {
		if (err)
		    return res.json(err, 500);
		Database.knex('dp_american').select('*').where({
		    id : contact.id
		}).exec(function(err, customer) {
		    if (err)
			return res.json(err, 500);
		    res.json({
			success : 'Donor has been updated.',
			contact : customer[0]
		    });
		});
	    });
	}
    },
    getcontact : function(req, res) {
	Database.knex('dp_american').select('*').where({
	    id : req.body.id
	}).exec(function(err, customer) {
	    if (err)
		return res.json(err, 500);
	    res.json({
		success : 'Donor data.',
		contact : customer[0]
	    });
	});
    },

    ajax : function(req, res) {

	req.body.contact.id = Utilities.prepfulltext(req.body.contact.id);// ((req.body.contact.id
	// ==
	// '')?null:req.body.contact.id);//((req.body.contact.id
	// ==
	// ''||req.body.contact.id
	// ==
	// null)?'NULL':req.body.contact.id);

	// WHERE's for Search Contacts page
	function doWheres(selectIds) {
	    selectIds.whereRaw('true');
	    if (req.body.contact.id != null) {
		selectIds.andWhere(Database.knex.raw('MATCH (dp_american.FNAME, dp_american.LNAME) AGAINST ("?" IN BOOLEAN MODE)', [ req.body.contact.id ]));
	    }
	}

	// Select Data
	Database.knex.select('dp_american.id', 'FNAME', 'LNAME').from(function() {
	    var selectIds = this.select('id').from('dp_american');
	    // WHERE's
	    doWheres(selectIds);

	    // ORDER BY
	    selectIds.orderBy(req.body.columns[req.body.order[0].column].data, req.body.order[0].dir);
	    selectIds.limit(parseInt(req.body.length)).offset(parseInt(req.body.start));
	    selectIds.as('dpIds');
	}).leftJoin('dp_american', 'dpIds.id', 'dp_american.id').exec(function(err, response) {
	    if (err)
		return console.log(err.toString());

	    // Select Filtered Count
	    var filteredCountQuery = Database.knex.count('id as count').from('dp_american');
	    doWheres(filteredCountQuery);
	    filteredCountQuery.exec(function(err, countresponse) {
		if (err)
		    return console.log(err.toString());
		// Select Total Count
		Database.knex.count('id as count').from('dp_american').exec(function(err, totalcountresponse) {
		    if (err)
			return console.log(err.toString());

		    return res.json({
			"draw" : req.param('draw'),
			"recordsTotal" : totalcountresponse[0]['count'],
			"recordsFiltered" : countresponse[0]['count'],
			"data" : response
		    });
		});
	    });
	});
    }
};
