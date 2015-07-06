/**
 * MaterialsController
 * 
 * @description :: Server-side logic for managing Materials
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    'get-categories' : function(req, res) {
	Database.dataSproc('INV_GetMatCategories', [], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"data" : response[0]
	    });
	});
    },
    'create-category' : function(req, res) {
	Database.dataSproc('INV_InsertMatCategory', [  req.body.categoryName ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : response
	    });
	});
    },
    'update-category' : function(req, res) {
	Database.dataSproc('INV_UpdateMatCategory', [ req.body.categoryId, req.body.categoryName ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : response
	    });
	});
    },
    'destroy-category' : function(req, res) {
	Database.dataSproc('INV_DeleteMatCategory', [ req.body.categoryID ], function(err, response2) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : 'deleted Category : ' + req.body.categoryID
	    });
	});
    },
    'get-brands' : function(req, res) {
	Database.dataSproc('INV_GetMatBrandsByCategory', [ req.body.categoryId ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"data" : response[0]
	    });
	});
    },
    'create-brand' : function(req, res) {
	Database.dataSproc('INV_InsertMatBrand', [ req.body.categoryId, req.body.brandName ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : response
	    });
	});
    },
    'update-brand' : function(req, res) {
	Database.dataSproc('INV_UpdateMatBrand', [ req.body.brandId, req.body.brandName ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : response
	    });
	});
    },
    'destroy-brand' : function(req, res) {
	Database.dataSproc('INV_DeleteMatTypeByBrand', [ req.body.brandID ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    Database.dataSproc('INV_DeleteMatBrand', [ req.body.brandID ], function(err, response2) {
		if (err) {
		    console.log(err.toString());
		    return res.json(500, err.toString());
		}
		return res.json({
		    "success" : 'deleted Brand : ' + req.body.brandID
		});
	    });
	});
    },
    'get-types' : function(req, res) {
	Database.dataSproc('INV_GetMatTypesByBrand', [ req.body.brandId ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"data" : response[0]
	    });
	});
    },
    'create-type' : function(req, res) {
	Database.dataSproc('INV_InsertMatType', [ req.body.brandId, req.body.typeName ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : response
	    });
	});
    },
    'update-type' : function(req, res) {
	Database.dataSproc('INV_UpdateMatType', [ req.body.typeId, req.body.typeName ], function(err, response) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : response
	    });
	});
    },
    'destroy-type' : function(req, res) {
	Database.dataSproc('INV_DeleteMatType', [ req.body.typeID ], function(err, response2) {
	    if (err) {
		console.log(err.toString());
		return res.json(500, err.toString());
	    }
	    return res.json({
		"success" : 'deleted Type : ' + req.body.typeID
	    });
	});
    }
};
