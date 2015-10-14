/**
 * TemplateController
 *
 * @description :: Server-side logic for managing Templates
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  lineitems: function (req, res) {
    Database.knex('templates').select('*').where({
      userId: req.session.user.id,
      location: 'lineitems'
    }).exec(function (err, results) {
      // cb(err,results);
      if (err)
        return console.log('Error getting Templates');

      for (var i = 0; i < results.length; i++) {
        results[i].data = JSON.parse(results[i].data);
      }
      res.json(results);
    });

  },
  orders: function (req, res) {
    Database.knex('templates').select('*').where({
      userId: req.session.user.id,
      location: 'orders'
    }).exec(function (err, results) {
      // cb(err,results);
      if (err)
        return console.log('Error getting Templates');

      for (var i = 0; i < results.length; i++) {
        results[i].data = JSON.parse(results[i].data);
      }
      res.json(results);
    });
  },
  contacts: function (req, res) {
    // async.parallel({
    // contacts : function(cb){
    Database.knex('templates').select('*').where({
      userId: req.session.user.id,
      location: 'contacts'
    }).exec(function (err, results) {
      // cb(err,results);
      if (err)
        return console.log('Error getting Templates');

      for (var i = 0; i < results.length; i++) {
        results[i].data = JSON.parse(results[i].data);
      }
      res.json(results);
    });
    // }
    // },function(err,data){
    // if(err)
    // return console.log('Error getting Templates');
    // res.json(data);
    // })

  },
  save: function (req, res) {
    var template = req.body;
    template.userId = req.session.user.id;
    template.data = JSON.stringify(template.data);

    var templateId = template.id;
    delete template.id;

    if (templateId == null) {
      Database.knex('templates').insert(template, 'id').exec(function (err, response) {
        if (err)
          return console.log('Err' + err.toString());
        template.data = JSON.parse(template.data);// id = response[0];
        template.id = response[0];
        res.json({
          success: 'Success',
          template: template
        });
      });
    } else {
      Database.knex('templates').update(template).where({
        id: templateId,
        userId: req.session.user.id
      }).exec(function (err, response) {
        if (err)
          return console.log('Err' + err.toString());
        template.id = templateId; // repairs template id
        res.json({
          success: 'Success',
          template: template
        });
      });
    }
  },
  destroy: function (req, res) {
    var template = req.body;

    if (template.id) {
      Database.knex('templates').where({
        id: template.id,
        userId: req.session.user.id
      }).del().exec(function (err, response) {
        if (err)
          return console.log('Err' + err.toString());
        res.json({
          success: 'Success'
        });
      });
    }
  }
};
