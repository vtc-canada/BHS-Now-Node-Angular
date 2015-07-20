/**
 * TemplateController
 * 
 * @description :: Server-side logic for managing Templates
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    inventory : function(req,res){
	Database.knex('inv_cur_templates').select('*').where({
	    userId : req.session.user.id,
	    location : 'inventory'
	}).exec(function(err, results) {
	    if (err)
		return console.log('Error getting Templates');

	    for (var i = 0; i < results.length; i++) {
		results[i].data = JSON.parse(results[i].data);
	    }
	    res.json(results);
	});
	
    },
    history : function(req,res){
	Database.knex('inv_cur_templates').select('*').where({
	    userId : req.session.user.id,
	    location : 'history'
	}).exec(function(err, results) {
	    if (err)
		return console.log('Error getting Templates');

	    for (var i = 0; i < results.length; i++) {
		results[i].data = JSON.parse(results[i].data);
	    }
	    res.json(results);
	});
	
    },
    save : function(req, res) {
	var template = req.body;
	template.userId = req.session.user.id;
	template.data = JSON.stringify(template.data);

	var templateId = template.id;
	delete template.id;

	if (templateId == null) {
	    Database.knex('inv_cur_templates').insert(template, 'id').exec(function(err, response) {
		if (err)
		    return console.log('Err' + err.toString());
		template.data = JSON.parse(template.data);// id = response[0];
		template.id = response[0];
		res.json({
		    success : 'Success',
		    template : template
		});
	    });
	} else {
	    Database.knex('inv_cur_templates').update(template).where({
		id : templateId,
		userId : req.session.user.id
	    }).exec(function(err, response) {
		if (err)
		    return console.log('Err' + err.toString());
		template.id = templateId; // repairs template id
		res.json({
		    success : 'Success',
		    template : template
		});
	    });
	}
    },
    destroy : function(req, res) {
	var template = req.body;

	if (template.id) {
	    Database.knex('inv_cur_templates').where({id:template.id, userId : req.session.user.id}).del().exec(function(err, response) {
		if (err)
		    return console.log('Err' + err.toString());
		res.json({
		    success : 'Success'
		});
	    });
	}
    }
};
