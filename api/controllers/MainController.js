/**
 * MainController
 * 
 * @description :: Server-side logic for managing mains
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
	res.view({preloaded:{first:'value'}});
    }
};
