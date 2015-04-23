'use strict';
angular.module('xenon.controllers', []).controller('ContactSections', function($scope, $rootScope, $timeout, $filter, $state, $modal, $contact, $sails, Utility) {
    $scope.helpers = public_vars.helpers;
    var vm = this;
    vm.mail = {};
    $scope.contact = $contact;// .init();
    $scope.contact.id = $contact.id = null;
    $scope.selectedTransaction = null;
    $scope.selectedOrderSummary = null;
    $scope.selectedOrderDetails = null;

    $scope.lastOrderFunds = null;

    $scope.selectedDataTableRow = {
	'dpgift' : null,
	'dpplg' : null,
	'dtmail' : null,
	'dpother' : null,
	'dplink' : null,
	'dpmisc' : null
    };

    $rootScope.longSelectOptions = {
	minimumInputLength : 2
    };

    $rootScope.modalDataSet = angular.copy($scope.selectedDataTableRow);

    vm.watchEnabled = false;
    vm.screenLoaded = false;
    vm.blockOrderSelectedModified = false;

    vm.tabs = [ 'layman', 'ecclesiastical', 'volunteer', 'orders' ];

    $scope.$watch('contact.dplang', function(oldValue, newValue) {
	if (!angular.equals(newValue, oldValue)) {
	    $scope.contact.dplang_modified = true;
	}
    });
    $scope.$watch('contact.dptrans', function(oldValue, newValue) {
	if (!angular.equals(newValue, oldValue)) {
	    $scope.contact.dptrans_modified = true;
	}
    });

    $scope.countyEnabled = function() {
	return $scope.contact.ST != 'NY';
    }

    // Elements Common

    $scope.toggleDeleted = function(elementType, element) {
	$contact.toggleDeleted(elementType, element);
	$timeout(function() {
	    $scope.contact = $contact;
	}, 0);
    }

    // DT Major
    $scope.addNewDtMajor = function() {
	$contact.addNewDtMajor();
	$timeout(function() {
	    $scope.contact = $contact;
	}, 0);
    }
    $scope.getPledgeBalance = function(donation) {
	if ($scope.showPledgeBalance(donation)) {
	    return (donation.PLEDAMT - donation.PAIDAMT);
	}
	return '';
    }
    $scope.showPledgeBalance = function(donation) {
	return (donation.PLEDSCHED == 2 || donation.PLEDSCHED == 3 || donation.PLEDSCHED == 4 || donation.PLEDSCHED == 5);
    }

    // dataTable SubSets - Manages form datatable subsets- modals/ subchanges
    // /////////////////////////////
    $scope.dataTableOptions = {
	'dpordersummary' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"row"<"col-xs-12"f>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
	    "columns" : [ {
		"width" : "25%" // id
	    }, {
		"width" : "25%" // Sol
	    }, {
		"width" : "25%" // Date
	    }, {
		"width" : "25%" // Total #
	    } ]
	},
	'dpgift' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"row"<"col-xs-12"f>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
	    "columns" : [ {
		"width" : "10%" // id
	    }, {
		"width" : "15%" // ProvCode
	    }, {
		"width" : "15%" // Mode
	    }, {
		"width" : "15%" // Envelope #
	    }, {
		"width" : "15%" // Amount
	    }, {
		"width" : "30%" // Date
	    } ]
	},
	'dpmisc' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"row"<"col-xs-12"f>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
	    "columns" : [ {
		"width" : "10%" // id
	    }, {
		"width" : "15%" // ProvCode
	    }, {
		"width" : "15%" // MType
	    }, {
		"width" : "15%" // `MCOUNT`
	    }, {
		"width" : "15%" // `MAMT`,
	    }, {
		"width" : "30%" // `MDATE`,
	    } ]
	},
	'dpplg' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"row"<"col-xs-12"f>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
	    "columns" : [ {
		"width" : "10%" // id
	    }, {
		"width" : "15%" // ProvCode
	    }, {
		"width" : "15%" // Mode
	    }, {
		"width" : "15%" // Envelope #
	    }, {
		"width" : "15%" // Amount
	    }, {
		"width" : "30%" // Date
	    } ]
	},
	'dplink' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"row"<"col-xs-12"f>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
	    "columns" : [ {
		"width" : "20%" // id
	    }, {
		"width" : "30%" // Name
	    }, {
		"width" : "25%" // Link Code
	    }, {
		"width" : "25%" // TSDATE
	    } ]
	},
	'dtmail' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"row"<"col-xs-12"f>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
	    "columns" : [ {
		"width" : "10%"
	    }, {
		"width" : "15%"
	    }, {
		"width" : "15%"
	    }, {
		"width" : "15%"
	    }, {
		"width" : "30%"
	    }, {
		"width" : "15%"
	    } ]
	},
	'dpother' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"row"<"col-xs-12"f>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
	    "columns" : [ {
		"width" : "10%" // id
	    }, {
		"width" : "15%" // ProvCode
	    }, {
		"width" : "15%" // Mode
	    }, {
		"width" : "15%" // Envelope #
	    }, {
		"width" : "15%" // Amount
	    }, {
		"width" : "30%" // Date
	    } ]
	}
    };

    $scope.resetOrderSummaryRow = function(table_name) {
	$timeout(function() {
	    $scope.selectedOrderSummary = null;
	}, 0);
    }

    $scope.getFullSol = function(sol) {
	if ($rootScope.label_sols) {
	    return $rootScope.label_sols[sol];
	}
	return '';

    }
    $scope.getFullType = function(mtype) {
	if ($rootScope.label_mtypes) {
	    return $rootScope.label_mtypes[mtype];
	}
	return '';
    }

    $scope.resetSelectedDataTableRow = function(table_name) {
	$timeout(function() {
	    $scope.selectedDataTableRow[table_name] = null;
	}, 0);
    }
    // selected modal
    $scope.editDatatableRow = function(table_name, modal_id, modal_size, modal_backdrop) {
	var selectedRow = $contact.getElementObject(table_name, $scope.selectedDataTableRow[table_name].id, $scope.selectedDataTableRow[table_name].tempId);
	$rootScope.modalDataSet[table_name] = angular.copy(selectedRow);
	$rootScope.currentModal = $modal.open({
	    templateUrl : modal_id,
	    size : modal_size,
	    backdrop : typeof modal_backdrop == 'undefined' ? true : modal_backdrop
	});
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$contact.updateElementObject(table_name, $rootScope.modalDataSet[table_name]);
		$timeout(function() {
		    $scope.contact = $contact;
		}, 0);
	    }
	});
    };

    $scope.addDatatableRow = function(table_name, modal_id, modal_size) {
	// Wipe selected, create new.
	$scope.selectedDataTableRow[table_name] = {};
	$scope.selectedDataTableRow[table_name].id = 'new';
	$scope.selectedDataTableRow[table_name].tempId = Math.floor((Math.random() * 100000) + 1);

	if (table_name == 'dpgift') {
	    $rootScope.modalDataSet[table_name] = {
		id : $scope.selectedDataTableRow[table_name].id,
		tempId : $scope.selectedDataTableRow[table_name].tempId,
		DONOR : $contact.id,
		SOL : null,
		MODE : null,
		database_origin : $contact.database_origin,
		ENVNO : null,
		AMT : null,
		DATE : null,
		TRANSACT : null,
		DESIGNATE : null,
		LABEL : null,
		LIST : null,
		CAMP_TYPE : null,
		DEMAND : null,
		REQUESTS : null,
		CURR : null,
		GL : null,
		PLEDGE : null,
		RECEIPT : null,
		REF : null,
		TBAREQS : null
	    };

	} else if (table_name == 'dpmisc') {
	    $rootScope.modalDataSet[table_name] = {
		id : $scope.selectedDataTableRow[table_name].id,
		tempId : $scope.selectedDataTableRow[table_name].tempId,
		DONOR : $contact.id,
		SOL : null,
		MDATE : null,
		MTYPE : null,
		MYEAR : null,
		MCOUNT : null,
		MAMT : null,
		MNOTES : null,
		TSRECID : null,
		TSDATE : null,
		TSTIME : null,
		TSCHG : null,
		TSBASE : null,
		TSLOCAT : null,
		TSIDCODE : null,
		database_origin : $contact.database_origin
	    };

	} else if (table_name == 'dpother') {
	    $rootScope.modalDataSet[table_name] = {
		id : $scope.selectedDataTableRow[table_name].id,
		tempId : $scope.selectedDataTableRow[table_name].tempId,
		DONOR : $contact.id,
		SOL : null,
		MODE : null,
		database_origin : $contact.database_origin,
		ENVNO : null,
		AMT : null,
		DATE : null,
		TRANSACT : null,
		LABEL : null,
		LIST : null,
		CAMP_TYPE : null,
		DEMAND : null,
		REQUESTS : null,
		CURR : null,
		GL : null,
		SURVEY : null,
		SURV_ANS : null,
		TBAREQS : null
	    };

	} else if (table_name == 'dpplg') {
	    $rootScope.modalDataSet[table_name] = {
		id : $scope.selectedDataTableRow[table_name].id,
		tempId : $scope.selectedDataTableRow[table_name].tempId,
		DONOR : $contact.id,
		SOL : null
	    };
	} else if (table_name == 'dplink') {
	    $rootScope.modalDataSet[table_name] = {
		id : $scope.selectedDataTableRow[table_name].id,
		tempId : $scope.selectedDataTableRow[table_name].tempId,
		ID1 : $contact.id,
		ID2 : null,
		LINK : null,
		TSDATE : null,
		errors : {}
	    };
	}

	$rootScope.currentModal = $modal.open({
	    templateUrl : modal_id,
	    size : modal_size,
	    backdrop : true
	});

	$rootScope.currentModal.result.then(function(selectedItem) {
	    $scope.selectedDataTableRow[table_name] = null;
	}, function(triggerElement) {

	    $scope.selectedDataTableRow[table_name] = null;
	    // $scope.selectedGiftTemp = null;
	    if (triggerElement == 'save') {

		$scope.tryDestroyDataTable(table_name);
		$contact.updateElementObject(table_name, $rootScope.modalDataSet[table_name]);
		$timeout(function() {
		    $scope.contact = $contact;
		    $scope.rebindDataTable(table_name);
		}, 0);
	    }
	});

	$rootScope.currentModal.saveLink = function() {
	    if (table_name == 'dplink') { // $rootScope.modalDataSet[table_name].errors
		if ($rootScope.modalDataSet[table_name].ID2 == null) {
		    return $timeout(function() {
			$rootScope.modalDataSet[table_name].errors.ID2 = true;
		    }, 0);
		}
		if ($rootScope.modalDataSet[table_name].LINK == null) {
		    return $timeout(function() {
			$rootScope.modalDataSet[table_name].errors.LINK = true;
		    }, 0);
		}
	    }
	    $rootScope.currentModal.dismiss('save');
	    return null;
	};

    }

    $scope.tryDestroyDataTable = function(table_name) {
	$('#' + table_name + '_datatable').css('visibility', 'hidden');
	if ($.fn.DataTable.isDataTable('#' + table_name + '_datatable')) {
	    $('#' + table_name + '_datatable').dataTable().fnDestroy();
	}
    }
    $scope.rebindDataTable = function(table_name) {
	if (!$.fn.DataTable.isDataTable('#' + table_name + '_datatable')) {
	    $('#' + table_name + '_datatable').dataTable($scope.dataTableOptions[table_name]).on('page.dt', $scope.resetSelectedDataTableRow(table_name)).on('length.dt', $scope.resetSelectedDataTableRow(table_name)).on('search.dt', $scope.resetSelectedDataTableRow(table_name));
	    $('#' + table_name + '_datatable').css('visibility', '');
	    $('#' + table_name + '_datatable').next().find('ul.pagination li.paginate_button a').click(function() {
		$timeout(function() {
		    $scope.selectedDataTableRow[table_name] = null;
		}, 0);
	    });
	}
    }
    $scope.rebindOrderSummaryDataTable = function() {
	if (!$.fn.DataTable.isDataTable('#dpordersummary_datatable')) {
	    $('#dpordersummary_datatable').dataTable($scope.dataTableOptions['dpordersummary']).on('page.dt', $scope.resetOrderSummaryRow()).on('length.dt', $scope.resetOrderSummaryRow()).on('search.dt', $scope.resetOrderSummaryRow());
	    $('#dpordersummary_datatable').css('visibility', '');
	    $('#dpordersummary_datatable').next().find('ul.pagination li.paginate_button a').click(function() {
		$timeout(function() {
		    $scope.selectedOrderSummary = null;
		}, 0);
	    });
	}
    }
    // Order Details

    $scope.isDpOrderSummaryDeleted = function() {
	if ($scope.selectedOrderSummary && $scope.selectedOrderSummary.is_deleted) {
	    return true;
	}
	return false;
    }

    $scope.isDpOrderSummarySelected = function() {
	return ($scope.selectedOrderSummary == null);
    }

    $scope.doDeleteDpOrderSummary = function() {
	// $scope.tryDestroyDataTable('dpordersummary');
	$timeout(function() {
	    if ($scope.selectedOrderSummary.is_deleted) { // undelete it!
		delete $scope.selectedOrderSummary.is_deleted;
	    } else { // Delete it!
		if ($scope.selectedOrderSummary.id == "new") { // will
		    // destroy it cuz it's new
		    $scope.contact.dpordersummary.splice($scope.contact.dpordersummary.indexOf($scope.selectedOrderSummary), 1)
		} else {
		    $scope.selectedOrderSummary.is_deleted = true;
		}
	    }
	    // $scope.rebindOrderSummaryDataTable();
	}, 0);
    }

    $scope.getDpOrderSummaryButtonText = function() {

	if ($scope.selectedOrderSummary == null || !$scope.isDpOrderSummaryDeleted()) {
	    return 'Delete';
	}
	return 'Restore';
    }

    $scope.addDpOrderSummary = function() {
	// $scope.selectedOrderSummary

	var newOrder = {
	    id : "new",
	    tempId : Math.floor((Math.random() * 10000000) + 1),
	    order_type : 1, // TODO- seelect mode based on logged in USER type.
	    SOL : null,
	    DATE : $filter('date')(new Date(), 'yyyy-MM-dd'),
	    ORDNUM : null,
	    SHIPFROM : null, // Add select2 for this TODO
	    OPER : null,
	    SHIPDATE : null,
	    ORIGDATE : null,
	    ORIGENV : null,
	    IPAID : null,
	    SANDH : true, // S+H
	    SANDHAMT : 0, // S+h amount
	    CREDITCD : null, // 
	    CASHONLY : null, // / ??
	    CASH : 0,
	    CREDIT : 0,
	    ETOTAL : 0, // ETOTAL is in american
	    ECONV : 0, // ECONV in local currency
	    ESHIP : 0, // TODO: Calculate shipping price from LITEMS
	    // litemdetails.price
	    GTOTAL : 0,

	    PST : 'N',
	    GST : 'N',
	    HST : 'N',
	    PSTCALC : 0,
	    GSTCALC : 0,
	    HSTCALC : 0,
	    NYTCALC : 0,
	    NYTAX : 0,
	    COUNTY : null,
	    COUNTYNM : null,
	    // "ENT_DT":"1993-12-22T00:00:00.000Z", // TODO- currency conversion
	    // "FUNDS":"U","GFUNDS":"U.S. Dollars","CURCONV":1.5,
	    TITLE : $scope.contact.TITLE,
	    FNAME : $scope.contact.FNAME,
	    LNAME : $scope.contact.LNAME,
	    SUFF : $scope.contact.SUFF,
	    SECLN : $scope.contact.SECLN,
	    ADD : $scope.contact.ADD,
	    CITY : $scope.contact.CITY,
	    ST : $scope.contact.ST,
	    ZIP : $scope.contact.ZIP,
	    COUNTRY : $scope.contact.COUNTRY,
	    PHTYPE1 : $scope.contact.PHTYPE1,
	    PHTYPE2 : $scope.contact.PHTYPE2,
	    PHTYPE3 : $scope.contact.PHTYPE3,
	    PHONE : $scope.contact.PHONE,
	    PHON2 : $scope.contact.PHON2,
	    PHON3 : $scope.contact.PHON3,
	    database_origin : $scope.contact.database_origin,
	    dporderdetails : [],
	    SURFCOST : 0,
	    MBAGCOST : 0,
	    OTHCOST : 0,
	    RETURNED : null,
	    MAILFLAG : null,
	    PRINREM : null
	};

	// $scope.tryDestroyDataTable('dpordersummary');
	$scope.contact.dpordersummary.push(newOrder);// $scope.selectedOrderSummary);

	$scope.selectedOrderSummary = $scope.contact.dpordersummary[$scope.contact.dpordersummary.length - 1];
	// $scope.rebindOrderSummaryDataTable();

	// "LASTPAGE":null,"PRINFLAG":1,"TSRECID":"C00012220","TSDATE":"20120626","TSTIME":"132058","TSCHG":"A","TSBASE":"A","TSLOCAT":"C","TSIDCODE":"KJ",

	// "DONOR":1000004 set donor in controller..

	// $scope.dpordersummary.
	// alert('a');
    }

    $scope.getLEXT = function(row) {
	return $filter('currency')(row.LPRICE * row.LQTY, '$', 2);

    };

    $scope.addDpDetail = function() {
	// $scope.contact.
	// TODO- currency?? LCURR
	$scope.selectedOrderSummary.dporderdetails.push({
	    id : null,
	    LQTY : 1,
	    LITEMP : null,
	    LITEMD : null,
	    LPRICE : 0,
	    LDISC : 0,
	    LCURR : null,
	    LEXT : 0,
	    LSTOC : null
	});

	// "TSRECID":"C00019635","TSDATE":"20041028","TSTIME":"134819","TSCHG":"A","TSBASE":"A","TSLOCAT":"C","TSIDCODE":"HMC","database_origin":1})
	// non-use columns
	// ORDNUMD:null,"PAGED":"01","LINED":"01","DONORD":1000004,"SQTY":1,"BQTY":0,

	// id : 'new',
	// tempId : Math.floor((Math.random() * 100000) + 1),
    }

    $scope.deleteDpDetail = function(item) {
	if (item.id == null) {
	    var index = $scope.selectedOrderSummary.dporderdetails.indexOf(item);
	    $scope.selectedOrderSummary.dporderdetails.splice(index, 1);
	} else {
	    item.is_deleted = true;
	}
    }

    $scope.$watch('selectedOrderSummary.dporderdetails', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    angular.forEach(newValue, function(row) {
		// Update descriptions
		if (typeof ($scope.litemdetails) != 'undefined' && typeof ($scope.litemdetails[row.LITEMP]) != 'undefined' && angular.lowercase(row.LITEMD) != angular.lowercase($scope.litemdetails[row.LITEMP].description)) {
		    row.LITEMD = $scope.litemdetails[row.LITEMP].description;
		    row.LPRICE = $scope.litemdetails[row.LITEMP].price;
		    // $scope.selectedOrderSummary.is_modified = true;
		}
		// if(row.LITEMP)

	    });
	}
    }, true);

    $scope.$watch('selectedOrderSummary', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    if ($rootScope.currencies && $scope.selectedOrderSummary != null && $rootScope.currencies[$scope.selectedOrderSummary.FUNDS]) {
		$scope.fundsSymbol = $rootScope.currencies[$scope.selectedOrderSummary.FUNDS].symbol;
	    }
	    if (vm.blockOrderSelectedModified) {
		vm.blockOrderSelectedModified = false;
		$scope.lastOrderFunds = $scope.selectedOrderSummary.FUNDS; // Backs
		// up
		// last
		// funds
	    } else {
		if ($scope.selectedOrderSummary) {
		    $scope.selectedOrderSummary.is_modified = true;
		}

		// TODO : BLOCK THIS IF IT's opening some old order with
		// previous
		// shipping calculating values..- based on date basically....
		if ($scope.selectedOrderSummary != null) {
		    var etotal = 0;
		    var hstcalc = 0;
		    var gstcalc = 0;
		    var pstcalc = 0;
		    var shiptax = 0;

		    var exchangerate = 1;
		    if ($scope.selectedOrderSummary.FUNDS != null) {
			for ( var key in $scope.exchange[$scope.selectedOrderSummary.FUNDS]) {
			    if ($scope.exchange[$scope.selectedOrderSummary.FUNDS].hasOwnProperty(key)) {
				//
				if (new Date(key).getTime() >= new Date($scope.selectedOrderSummary.DATE).getTime()) {
				    exchangerate = $scope.exchange[$scope.selectedOrderSummary.FUNDS][key];
				    break;
				}

			    }
			}
		    }

		    if ($scope.selectedOrderSummary.FUNDS != 'C') { // forces
			// canadian
			// taxes off
			$scope.selectedOrderSummary.HST = 'N';
			$scope.selectedOrderSummary.GST = 'N';
			$scope.selectedOrderSummary.PST = 'N';
		    } else if ($scope.lastOrderFunds != 'C') { // from another
			// currency
			$scope.selectedOrderSummary.HST = 'Y';
			$scope.selectedOrderSummary.GST = 'N';
			$scope.selectedOrderSummary.PST = 'N';
		    }
		    if ($scope.lastOrderFunds != $scope.selectedOrderSummary.FUNDS && $scope.selectedOrderSummary.FUNDS != 'C' && $scope.selectedOrderSummary.FUNDS != 'U') { // foreign
			$scope.selectedOrderSummary.SANDH = 'N'; // manual
		    } else if ($scope.lastOrderFunds != $scope.selectedOrderSummary.FUNDS && ($scope.selectedOrderSummary.FUNDS == 'C' || $scope.selectedOrderSummary.FUNDS == 'U')) { // american/canadian
			$scope.selectedOrderSummary.SANDH = 'Y'; // auto
		    }

		    $scope.lastOrderFunds = $scope.selectedOrderSummary.FUNDS;

		    angular.forEach($scope.selectedOrderSummary.dporderdetails, function(detail) {
			var itemp = parseInt(detail.LQTY) * parseInt(detail.LPRICE) * (1 - (parseInt(detail.LDISC) / 100));

			etotal += itemp; // sums up item price

			var hstrate = $scope.selectedOrderSummary.HST == 'Y' ? 0.13 : 0;
			var gstrate = $scope.selectedOrderSummary.GST == 'Y' ? 0.08 : 0;
			var pstrate = $scope.selectedOrderSummary.PST == 'Y' ? 0.07 : 0;
			if (detail.LITEMP.indexOf('B') === 0) {
			    hstrate = $scope.selectedOrderSummary.HST == 'Y' ? 0.05 : 0; // GST
			    // portion
			    // (8%)
			    // reduced
			    // off,
			    // leaving
			    // it
			    // 5%
			    // as
			    // before.
			    gstrate = 0; // GST not counted on books
			    pstrate = $scope.selectedOrderSummary.PST == 'Y' ? 0.05 : 0; // PST
			    // used
			    // to
			    // be
			    // reduced
			    // to
			    // .05
			    // i
			    // believe
			    // for
			    // books
			}

			hstcalc += (itemp / exchangerate) * hstrate; // sums
			// up
			// item
			// taxes
			gstcalc += (itemp / exchangerate) * gstrate;
			pstcalc += (itemp / exchangerate) * pstrate;

		    });

		    $scope.selectedOrderSummary.ETOTAL = etotal;

		    $scope.selectedOrderSummary.ECONV = etotal / parseFloat(exchangerate);

		    var eship = 0;
		    if ($scope.selectedOrderSummary.SANDH == 'Y') {
			if ($scope.selectedOrderSummary.FUNDS == 'C') {
			    if ($scope.selectedOrderSummary.ETOTAL < 10) {
				eship = 4.50;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 25) {
				eship = 6.50;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 50) {
				eship = 8.50;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 75) {
				eship = 10.50;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 100) {
				eship = 12.00;
			    } else {
				eship = $scope.selectedOrderSummary.ECONV * 0.15;
			    }
			} else if ($scope.selectedOrderSummary.FUNDS == 'U') {
			    if ($scope.selectedOrderSummary.ETOTAL < 10) {
				eship = 4.50;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 25) {
				eship = 6.00;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 50) {
				eship = 7.00;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 75) {
				eship = 9.00;
			    } else if ($scope.selectedOrderSummary.ETOTAL < 100) {
				eship = 10.00;
			    } else {
				eship = $scope.selectedOrderSummary.ECONV * 0.12;
			    }
			}
			$scope.selectedOrderSummary.SANDHAMT = 0;
		    } else {
			eship = $scope.selectedOrderSummary.SANDHAMT;
		    }

		    $scope.selectedOrderSummary.ESHIP = eship;

		    // Add tax to shipping component.
		    var hstrate = $scope.selectedOrderSummary.HST == 'Y' ? 0.13 : 0;
		    var gstrate = $scope.selectedOrderSummary.GST == 'Y' ? 0.08 : 0;
		    var pstrate = $scope.selectedOrderSummary.PST == 'Y' ? 0.07 : 0;

		    hstcalc += eship * hstrate;
		    gstcalc += eship * gstrate;
		    pstcalc += eship * pstrate;

		    $scope.selectedOrderSummary.HSTCALC = hstcalc;
		    $scope.selectedOrderSummary.GSTCALC = gstcalc;
		    $scope.selectedOrderSummary.PSTCALC = pstcalc;

		    // Currency has to be in US dollars and COUNTY must be set
		    // to have NY tax
		    $scope.selectedOrderSummary.NYTAX = ($scope.selectedOrderSummary.COUNTY == null || $scope.selectedOrderSummary.FUNDS != 'U' ? 0 : $rootScope.county_rates[$scope.selectedOrderSummary.COUNTY]);
		    $scope.selectedOrderSummary.NYTCALC = ($scope.selectedOrderSummary.ECONV + $scope.selectedOrderSummary.ESHIP) * ($scope.selectedOrderSummary.NYTAX / 100);

		    $scope.selectedOrderSummary.GTOTAL = $scope.selectedOrderSummary.ECONV + $scope.selectedOrderSummary.ESHIP + $scope.selectedOrderSummary.HSTCALC + $scope.selectedOrderSummary.GSTCALC + $scope.selectedOrderSummary.PSTCALC + $scope.selectedOrderSummary.NYTCALC;

		}
	    }

	}
	function getNYTAX() {
	    if ($scope.selectedOrderSummary.COUNTY == null) {
		return 0;
	    }

	}

    }, true);

    $scope.getNYTaxLabel = function(county_c) {
	if (typeof (county_c) == 'undefined' || typeof ($rootScope.county_rates) == 'undefined') {
	    return null;
	}
	return $rootScope.county_rates[county_c] + '%';
    }

    $rootScope.doDeleteContact = function() {
	delete $scope.contact.is_saving;
	delete $rootScope.is_contact_deleting;
	$sails.post("/contacts/destroy", $scope.contact).success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED
		// IN!!!!!
		location.reload(); // Will boot back to login
		// screen
	    }
	    if (data.success) {
		for ( var key in $scope.selectedDataTableRow) { // iterate
		    // destroying
		    // datatables!
		    $scope.tryDestroyDataTable(key);
		}
		$timeout(function() {

		    $contact.init(); // sets is_saving and is_deleting to
		    // false.
		    resetContactForms();
		    $rootScope.updateContactsTable(); // main contacts
		    $rootScope.currentModal.dismiss();
		    // table at the
		    // top!
		    // $timeout(function() {
		    // for ( var key in $scope.selectedDataTableRow) { //
		    // iterate
		    // // destroying
		    // // datatables!
		    // //$scope.rebindDataTable(key); //probably unnecessary
		    // here
		    // }
		    // }, 0);
		}, 0);
	    }
	}).error(function(data) {
	    alert('err!');
	});

	$rootScope.is_contact_deleting = true;
    }

    $scope.deleteContact = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'delete-contact-modal',
	    size : 'sm',
	    backdrop : true
	});
	$rootScope.deleteContactMessage = 'Are you sure you want to delete this contact: <b>' + $scope.contact.FNAME + ' ' + $scope.contact.LNAME + '</b>';
    }

    $scope.exportContact = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'export-contact-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.exporting_contact = true;

	$sails.post('/contacts/export_contact', {
	    id : $scope.contact.id,
	    timezoneoffset : new Date().getTimezoneOffset()
	}).success(function(response) {
	    if (response.error != undefined) { // USER NO LONGER
		// LOGGEDIN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    $timeout(function() {
		// $rootScope.pdfurl = response.pdfurl;
		$rootScope.contact_export_pdfurl = response.pdfurl;
		delete $rootScope.exporting_contact;
	    }, 0);
	});
    }

    $scope.exportOrder = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'export-order-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.exporting_order = true;
	var exportOrder = angular.copy($scope.selectedOrderSummary);
	exportOrder.timezoneoffset = new Date().getTimezoneOffset(); // gets
	// client
	// timezone
	exportOrder.SHIPFROM = $rootScope.ship_name[exportOrder.SHIPFROM];
	exportOrder.FUNDS = $scope.fundsFormat(exportOrder.FUNDS);
	exportOrder.fundsSymbol = $scope.fundsSymbol;
	$sails.post('/contacts/export_order', {
	    order : exportOrder
	}).success(function(response) {
	    if (response.error != undefined) { // USER NO LONGER
		// LOGGEDIN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    $timeout(function() {
		// $rootScope.pdfurl = response.pdfurl;
		$rootScope.order_export_pdf = response.pdfurl;
		delete $rootScope.exporting_order;
	    }, 0);
	});
    }

    $scope.fundsFormat = function(fund) {
	if (typeof (fund) == 'undefined' || fund==null|| typeof ($rootScope.currency_format) == 'undefined') {
	    return null;
	}
	return $rootScope.currency_format[fund].code;
    }

    $scope.getDatatableDeleteButtonDisabled = function(table_name) {
	return ($scope.selectedDataTableRow[table_name] == null);
    }
    $scope.isDatatableEditDisabled = function(table_name) {
	if ($scope.selectedDataTableRow[table_name] == null || $scope.selectedDataTableRow[table_name].is_deleted) {
	    return true;
	}
	return false;
    }

    $scope.isDatatableDeleteRestoreDisabled = function(table_name) { // is
	// one
	// selected
	// AND
	// deleted..
	if ($scope.selectedDataTableRow[table_name] == null) {
	    return true;
	}
	return false;
    }

    $scope.isDatatableDeleteButtonText = function(table_name) { // is one
	// selected AND
	// deleted..
	if ($scope.selectedDataTableRow[table_name] != null && $scope.selectedDataTableRow[table_name].is_deleted) {
	    return true;
	}
	return false;
    }
    $scope.getDatatableDeleteButtonText = function(table_name) {
	if ($scope.isDatatableDeleteButtonText(table_name)) {
	    return 'Restore';
	}
	return 'Delete';
    }
    $scope.doDeleteDataTable = function(table_name) {
	var deleteNew = false;
	if ($scope.selectedDataTableRow[table_name].id == 'new') { // will
	    // destroy
	    // cuz it's new
	    deleteNew = true;
	    $scope.tryDestroyDataTable(table_name);
	}
	$contact.toggleDeleted(table_name, $scope.selectedDataTableRow[table_name]);
	$timeout(function() {
	    $scope.contact = $contact;
	    $scope.selectedDataTableRow[table_name] = null;
	    if (deleteNew) { // was a new one.. being deleted clearly
		$scope.rebindDataTable(table_name);
	    }
	}, 0);
    }
    /*
     * $scope.isRowDeletedAndFocused = function(row){ return (row.tempId ==
     * $scope.selectedGift.tempId && row.tempId != null) || (row.id ==
     * $scope.selectedGift.id && row.id != 'new'); }
     */
    $scope.isDatatableRowFocused = function(table_name, row) {
	if ($scope.selectedDataTableRow[table_name] == null) {
	    return false;
	}
	return (row.tempId == $scope.selectedDataTableRow[table_name].tempId && row.tempId != null) || (row.id == $scope.selectedDataTableRow[table_name].id && row.id != 'new');
    }

    $scope.selectDataTableRow = function(table_name, row) {// transactionId,
	// tempId,
	// is_deleted) {
	$scope.selectedDataTableRow[table_name] = row;
    }

    $scope.selectOrderSummaryDataTableRow = function(row) {// transactionId,
	// tempId,
	// is_deleted) {
	vm.blockOrderSelectedModified = true; // blocks change event on
	// selectedOrderSummary watcher
	// once.
	$scope.selectedOrderSummary = row;
    }

    $scope.isOrderSummaryDatatableRowFocused = function(row) {
	if (typeof (row) == 'undefined' || row == null) {
	    return $scope.selectedOrderSummary != null;
	}
	if ($scope.selectedOrderSummary == null) {
	    return false;
	}
	return (row.tempId == $scope.selectedOrderSummary.tempId && row.tempId != null) || (row.id == $scope.selectedOrderSummary.id && row.id != "new");
    }

    $scope.selectOrderDetailsDataTableRow = function(row) {// transactionId,
	// tempId,
	// is_deleted) {
	$scope.selectedOrderDetails = row;
    }
    $scope.isOrderDetailsDatatableRowFocused = function(row) {
	if (typeof (row) == 'undefined' || row == null) {
	    return $scope.selectedOrderDetails != null;
	}
	if ($scope.selectedOrderDetails == null) {
	    return false;
	}
	return (row.tempId == $scope.selectedOrderDetails.tempId && row.tempId != null) || (row.id == $scope.selectedOrderDetails.id && row.id != 'new');
    }

    // /////////////////////////////////////////////// dynamic sub-datatables/
    // modals

    // OTHER ADDRESSES
    $scope.addOtherAddress = function() {
	$scope.contact.otherAddresses = $contact.addOtherAddress();
	$scope.is_modified = $contact.is_modified = true;

    }

    $scope.deleteOtherAddress = function(otherAddressId, tempId, is_deleted) {
	if (!is_deleted) { // then delete it
	    $contact.setElementDeleted('otherAddresses', otherAddressId, tempId);
	    $timeout(function() {
		$scope.contact = $contact;
	    }, 0);
	} else { // then undelete it
	    $contact.setElementUndeleted('otherAddresses', otherAddressId);
	    $timeout(function() {
		$scope.contact = $contact;
	    }, 0);
	}
    }

    // Ecclesiastical
    $scope.isValEnabled = function(value) {
	if (value == 'Y') {
	    return true;
	}
	return false;
    }

    $scope.$watch('contact.dtvols1.VGRADE23', function(oldValue, newValue) {
	if (oldValue != newValue && $scope.contact.dtvols1.VGRADE23 != 'Y') {
	    $scope.contact.dtvols1.VSPECTAL = null;
	}
    });

    $scope.getEcclesiasticalAge = function(a, b, c) {
	return 21;
    }

    // End Ecclesiastical

    // Notes
    $scope.addNote = function(noteType) {
	$scope.contact.notes[noteType] = $contact.addNote(noteType);
	$scope.is_modified = $contact.is_modified = true;
	$timeout(function() {
	    $('#' + noteType).find('.note-row textarea:not(.ng-hide)').focus();
	    // $('div[ng-repeat=contact.notes.'+noteType+']').find('textarea[ng-show=note.focused]')
	}, 0);
    }

    $scope.toggleNote = function(note) {
	// if (note.id == null) {
	$contact.toggleNote(note);

	// }
    }

    $scope.blurNote = function(note) {
	note.focused = false;
    }

    $scope.changeNote = function(note) {
	$scope.contact.notes[note.type].text = $scope.contact.notes[note.type].text;
    }
    $scope.modifyNote = function($event, note, noteType) {
	note.focused = true;
	note.modify_text = note.text == null ? '' : note.text;
	$timeout(function() {
	    $('#' + noteType).find('.note-row textarea:not(.ng-hide)').focus();

	    // $($event.currentTarget).parent().parent().find('textarea').focus();
	}, 5);
    }
    $scope.saveNote = function(note) {
	note.focused = false;
	note.text = note.modify_text || '';
    }
    $scope.cancelNote = function(note) {
	if (note.modify_text == '' && note.id == null && note.text == null) {
	    $contact.toggleNote(note);
	}
	// if(note.modify_text == '')
	// note.focused = false;
	// note.text = note.modify_text || '';
    }

    // End Notes

    $scope.tryModified = function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {// newValue !== oldValue) {
	    if (vm.updateModified) {
		clearTimeout(vm.updateModified);
	    }
	    vm.updateModified = setTimeout(function() {
		if (!vm.watchEnabled) { // Latch. Make watchEnabled
		    // False to
		    // make it ignore one update.
		    vm.watchEnabled = true;
		    return;
		}
		$timeout(function() {
		    if ($state.current.name == 'app.contacts') { // blocks
			// lagging
			// updates
			// when
			// we've
			// already
			// left the
			// screen.
			$contact.is_modified = $scope.is_modified = true;
		    }
		}, 0);
	    }, 10);

	}
    }

    // $scope.$watchCollection('contact', $scope.tryModified,true);
    $scope.$watch('contact', $scope.tryModified, true);
    // $scope.$watch('contact.otherAddresses', $scope.tryModified,true);
    // $scope.$watchCollection('otherAddresses', $scope.tryModified);

    $rootScope.$on("getcontact", function(args, message) {
	$timeout(function() {
	    vm.watchEnabled = false;
	    if (message.id == 'new') {
		$scope.selectedTransaction = null; // wipes
		for ( var key in $scope.selectedDataTableRow) { // iterate
		    // destroying
		    // datatables!
		    $scope.tryDestroyDataTable(key);
		}
		$contact.init();
		$contact.id = 'new';
		resetContactForms();
		$timeout(function() {
		    $(window).scrollTop($('.nav-tabs').offset().top - 8);
		    for ( var key in $scope.selectedDataTableRow) { // iterate
			// destroying
			// datatables!
			$scope.rebindDataTable(key);
		    }
		}, 0);
	    } else {
		$sails.post("/contacts/getcontact", {
		    id : message.id
		}).success(function(data) {

		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    $scope.selectedTransaction = null; // wipes
		    // out
		    // selected
		    // Transaction
		    if (data.success) {
			for ( var key in $scope.selectedDataTableRow) { // iterate
			    // destroying
			    // datatables!
			    $scope.tryDestroyDataTable(key);
			}
			// $scope.tryDestroyDataTable('dpordersummary');
			$timeout(function() {
			    $contact.set(data.contact);
			    resetContactForms();
			    $timeout(function() {
				$(window).scrollTop($('.nav-tabs').offset().top - 8);
				for ( var key in $scope.selectedDataTableRow) { // iterate
				    // destroying
				    // datatables!
				    $scope.rebindDataTable(key);
				}
				// $scope.rebindOrderSummaryDataTable();
			    }, 0);
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    });

    $scope.saveContact = function(tab) {
	$timeout(function() {
	    // Order it, so we check the tabs in a sensible manner.
	    Utility.remove(vm.tabs, tab);
	    vm.tabs.splice(0, 0, tab);

	    var founderrors = false;
	    angular.forEach(vm.tabs, function(tabval) {
		if (!founderrors) {
		    // if (tabval != tab) { // make sure to check the
		    // validity
		    // of other tabs.
		    $('#' + tabval).valid(); // this was blocked at some
		    // point for some reason..
		    // }
		    if ($rootScope.validator[tabval].numberOfInvalids() > 0) { // error
			founderrors = true;
			$('#' + tabval + '_tab a').click(); // Switches
			// to
			// error'd tab
		    }
		}
	    });

	    if (!founderrors) {
		// $scope.contact.otherAddresses =
		// $scope.otherAddresses;
		// delete $scope.contact.initDtVols1;
		delete $scope.contact.is_saving;
		delete $scope.contact.is_deleting;
		$sails.post("/contacts/save", $scope.contact).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			for ( var key in $scope.selectedDataTableRow) { // iterate
			    // destroying
			    // datatables!
			    $scope.tryDestroyDataTable(key);
			}
			// $scope.tryDestroyDataTable('dpordersummary');

			$timeout(function() {
			    $contact.set(data.contact); // sets is_saving to
			    // false.
			    resetContactForms();
			    $rootScope.updateContactsTable(); // main contacts
			    // table at the
			    // top!
			    $timeout(function() {
				for ( var key in $scope.selectedDataTableRow) { // iterate
				    // destroying
				    // datatables!
				    $scope.rebindDataTable(key);
				}
				// $scope.rebindOrderSummaryDataTable();
			    }, 0);
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});

		$scope.contact.is_saving = true;
	    }
	}, 0);
    }
    function resetContactForms() {
	// $scope.$apply(function() {
	vm.watchEnabled = false;
	$scope.contact = $contact; // this applies the contact to the
	// scope..
	// seems needed a bunch verified.
	// $scope.otherAddresses = $contact.otherAddresses;
	if (vm.screenLoaded) {
	    angular.forEach(vm.tabs, function(tabval) {
		if ($rootScope.validator && $rootScope.validator[tabval]) {
		    $rootScope.validator[tabval].resetForm();
		    $('form#' + tabval + ' .validate-has-error').removeClass('validate-has-error');
		}
	    });

	} else {
	    vm.screenLoaded = true;
	}
    }

    // initialization routine.
    (function() {

	$sails.get('/donortracker/getattributes').success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    var data = data.result;

	    $rootScope.staticyesno = [ {
		id : 'Y',
		label : 'Yes'
	    }, {
		id : 'N',
		label : 'No'
	    } ];

	    $rootScope.currencies = [ {
		id : 'U',
		label : 'USD - United States'
	    }, {
		id : 'C',
		label : 'CAD - Canadian Dollars'
	    } ];

	    $rootScope.label_mtypes = {};
	    $rootScope.mtypes = [];
	    for (var i = 0; i < data.mtypes.length; i++) {
		$rootScope.mtypes.push({
		    id : data.mtypes[i].CODE,
		    label : data.mtypes[i].CODE + " - " + data.mtypes[i].DESC
		});
		$rootScope.label_mtypes[data.mtypes[i].CODE] = data.mtypes[i].CODE + " - " + data.mtypes[i].DESC;
	    }

	    $scope.litems = [];
	    $scope.litemdetails = {};
	    for (var i = 0; i < data.litems.length; i++) {
		$scope.litems.push({
		    id : data.litems[i].CODE,
		    label : data.litems[i].CODE + " - " + data.litems[i].DESC
		});
		$scope.litemdetails[data.litems[i].CODE] = {
		    description : data.litems[i].DESC,
		    price : data.litems[i].OTHER
		};
	    }

	    $rootScope.sources = [];
	    for (var i = 0; i < data.sources.length; i++) {
		$rootScope.sources.push({
		    id : data.sources[i].CODE,
		    label : data.sources[i].CODE + " - " + data.sources[i].DESC
		});
	    }

	    $scope.exchange = angular.copy(data.exchange);

	    

	    $rootScope.relationships = [];
	    for (var i = 0; i < data.relationships.length; i++) {
		$rootScope.relationships.push({
		    id : data.relationships[i].CODE,
		    label : data.relationships[i].CODE + " - " + data.relationships[i].DESC
		});
	    }

	    $rootScope.transaction_type = 'dpplg';

	    $rootScope.transaction_types = [ {
		id : 'dpgift',
		label : 'Gift'
	    }, {
		id : 'dtmail',
		label : 'Mail'
	    }, {
		id : 'dpplg',
		label : 'Pledge'
	    }, {
		id : 'dpother',
		label : 'Other'
	    }, {
		id : 'dplink',
		label : 'Links'
	    }, {
		id : 'dpmisc',
		label : 'Misc'
	    } ];

	    /*
	     * for (var i = 0; i < data.donor_classes.length; i++) {
	     * $scope.donor_classes.push({ id : data.donor_classes[i].CODE,
	     * label : data.donor_classes[i].CODE + " - " +
	     * data.donor_classes[i].DESC }); }
	     */

	    /*
	     * angular.forEach(data.result,function(atts,key){ $scope[key]=[];
	     * for(var i=0;i<atts.length;i++){ $scope[key].push({ id : atts[i].
	     * }); } ) })
	     */
	    $rootScope.accounts_received = [];
	    for (var i = 0; i < data.accounts_received.length; i++) {
		$rootScope.accounts_received.push({
		    id : data.accounts_received[i].CODE,
		    label : data.accounts_received[i].CODE + " - " + data.accounts_received[i].DESC
		});
	    }
	    $rootScope.reasons = [];
	    for (var i = 0; i < data.reasons.length; i++) {
		$rootScope.reasons.push({
		    id : data.reasons[i].CODE,
		    label : data.reasons[i].CODE
		});
	    }
	    $rootScope.cfns = [];
	    for (var i = 0; i < data.cfns.length; i++) {
		$rootScope.cfns.push({
		    id : data.cfns[i].CODE,
		    label : data.cfns[i].CODE + " - " + data.cfns[i].DESC
		});
	    }
	    $rootScope.genders = [];
	    for (var i = 0; i < data.genders.length; i++) {
		$rootScope.genders.push({
		    id : data.genders[i].CODE,
		    label : data.genders[i].CODE + " - " + data.genders[i].DESC
		});
	    }
	    $rootScope.dioceses = [];
	    for (var i = 0; i < data.dioceses.length; i++) {
		$rootScope.dioceses.push({
		    id : data.dioceses[i].CODE,
		    label : data.dioceses[i].CODE + " - " + data.dioceses[i].DESC
		});
	    }
	    $rootScope.groups = [];
	    for (var i = 0; i < data.groups.length; i++) {
		$rootScope.groups.push({
		    id : data.groups[i].CODE,
		    label : data.groups[i].CODE + " - " + data.groups[i].DESC
		});
	    }
	    $rootScope.pledgors = [];
	    for (var i = 0; i < data.pledgors.length; i++) {
		$rootScope.pledgors.push({
		    id : data.pledgors[i].CODE,
		    label : data.pledgors[i].CODE + " - " + data.pledgors[i].DESC
		});
	    }
	    $rootScope.types = [];
	    for (var i = 0; i < data.types.length; i++) {
		$rootScope.types.push({
		    id : data.types[i].CODE,
		    label : data.types[i].CODE
		});
	    }

	    $rootScope.designates = [];
	    for (var i = 0; i < data.designates.length; i++) {
		$rootScope.designates.push({
		    id : data.designates[i].CODE,
		    label : data.designates[i].CODE + " - " + data.designates[i].DESC
		});
	    }

	    $rootScope.countries = [];
	    for (var i = 0; i < data.countries.length; i++) {
		$rootScope.countries.push({
		    id : data.countries[i].CODE,
		    label : data.countries[i].CODE
		});
	    }
	    $rootScope.county_rates = {};

	    $rootScope.county_codes = [];
	    for (var i = 0; i < data.county_codes.length; i++) {
		$rootScope.county_codes.push({
		    id : data.county_codes[i].CODE,
		    label : data.county_codes[i].CODE
		});
		$rootScope.county_rates[data.county_codes[i].CODE] = data.county_codes[i].MCAT_LO;
	    }
	    $rootScope.phone_types = [];
	    for (var i = 0; i < data.phone_types.length; i++) {
		$rootScope.phone_types.push({
		    id : data.phone_types[i].CODE,
		    label : data.phone_types[i].CODE
		});
	    }

	    // DTVOLS1
	    $rootScope.dtvols1 = {};
	    $rootScope.dtvols1.origins = [];
	    // $rootScope.origin = [];
	    for (var i = 0; i < data.dtvols1.origins.length; i++) {
		$rootScope.dtvols1.origins.push({
		    id : data.dtvols1.origins[i].CODE,
		    label : data.dtvols1.origins[i].CODE + ' - ' + data.dtvols1.origins[i].DESC
		});
	    }

	}).error(function(data) {
	    alert('err!');
	});

    })();

}).controller('UserSection', function($scope, $rootScope, $timeout, $state, $modal, $sails, Utility) {
    $scope.helpers = public_vars.helpers;
    var vm = this;

}).controller('ReportSearch', function($scope, $rootScope, $sce, $timeout, $filter, $reports, $reportselects, $sails, $http, $modal) {
    var vm = this;
    vm.$scope = $scope;
    $scope.reportselects = {};

    $scope.reports = $reports;
    $scope.report = $reports[0];
    $scope.reporthtml = null;
    angular.forEach($scope.report.parameters, function(parameter, key) {
	if (parameter.type == 'datetime') {
	    parameter.value = $filter('date')(new Date(), 'yyyy-MM-dd');// '2013-01-01';
	}
    });

    $scope.report_id = $scope.report.id; // first ID
    $rootScope.report = $scope.report; // links report through $rootScope.

    $scope.$watch('report_id', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    for ( var key in $reports) {
		if ($reports[key].id == $scope.report_id) {
		    $scope.report = $reports[key];
		    angular.forEach($scope.report.parameters, function(parameter, key) {
			if (parameter.type == 'datetime') {
			    parameter.value = $filter('date')(new Date(), 'yyyy-MM-dd');// '2013-01-01';
			}
		    });
		    $rootScope.report = $scope.report;
		    return;
		}
	    }
	}
    });

    // Watch report -
    $scope.$watch('report', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    if (vm.updateTable) {
		clearTimeout(vm.updateTable(newValue));
	    }
	    vm.updateTable = function(event) {
		setTimeout(function() {
		    // $rootScope.updateContactsTable();
		    // alert('searchReports');
		    $scope.reporthtml = null;
		}, 10);
	    }
	}
    }, true);

    // Select Fuction Generic Function- Factor this out eventually.
    $scope.selectArray = function(parameter) {
	var svm = this;
	svm.ajax_results = svm.ajax_results || [];
	svm.parents = svm.parents || [];

	if (parameter.source) {// }&&typeof(svm.source)=='undefined'){ // means
	    // its simply some source - just load it once.
	    // svm.source = true; // flag as loaded
	    // svm.data =
	    return $scope.reportselects[parameter.source];
	}

	// / Otherwise, we assume it's an ajax source.
	if (parameter.parents && deepCheckParentValues()) { // if parents, and
	    // changed.. does local
	    // cache updates and
	    // checks if it indeed
	    // changed.

	    $sails.get(parameter.url, {
		params : svm.parents
	    }, function(result) {
		svm.ajax_results = result;
		$scope.report.parameters[parameter.key].value = null;

	    });
	}

	function deepCheckParentValues() {
	    var changed = false;
	    for (var i = 0; i < parameter.parents.length; i++) {
		if (typeof (svm.parents[i]) == 'undefined' || svm.parents[i] != vm.$scope.report.parameters[parameter.parents[i]].value) {
		    svm.parents[i] = vm.$scope.report.parameters[parameter.parents[i]].value;
		    changed = true;
		}
	    }
	    return changed;
	}

	return svm.ajax_results; // returns this variable- we will set this
	// after in async callback.- thus updating
	// it.

    }

    $scope.saveReport = function() {
	// $scope.saving = true;

	$rootScope.currentModal = $modal.open({
	    templateUrl : 'save-report-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.saving_report = true;

	$http.post('/reports/promptsave', {
	    report : $scope.report
	}).success(function(response) {
	    if (response.error != undefined) { // USER NO LONGER
		// LOGGEDIN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    $timeout(function() {
		// delete $scope.saving;
		$rootScope.pdfurl = response.pdfurl;
		$rootScope.csvurl = response.csvurl;
		delete $rootScope.saving_report;
	    }, 0);
	});
    }

    $scope.runReport = function() {
	$scope.report.system_name = 'The Fatima Center'; // saves the system
	// name
	$scope.report.timezoneoffset = new Date().getTimezoneOffset();
	$scope.report.cacheId = Math.floor((Math.random() * 1000000000) + 1);
	$scope.loading = true;
	$http.post('/reports/view', {
	    report : $scope.report
	}).success(function(html) {
	    if (html.error != undefined) { // USER NO
		// LONGER
		// LOGGED
		// IN!!!!!
		location.reload(); // Will boot back to
		// login
		// screen
	    }
	    $timeout(function() {
		delete $scope.loading;
		$scope.reporthtml = $sce.trustAsHtml(html);
	    }, 0);
	});
    };

    (function() {
	$sails.get('/donortracker/getreportattributes').success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    var data = data.result;

	    $scope.reportselects.currencies = [];
	    for (var i = 0; i < data.currencies.length; i++) {
		$scope.reportselects.currencies.push({
		    id : data.currencies[i].id,
		    label : data.currencies[i].name,
		    code : data.currencies[i].code
		});
	    }

	    $scope.reportselects.countries = [];
	    for (var i = 0; i < data.countries.length; i++) {
		$scope.reportselects.countries.push({
		    id : data.countries[i].COUNTRY,
		    label : data.countries[i].COUNTRY
		});
	    }

	    $scope.reportselects.ship_from = [];
	    for (var i = 0; i < data.ship_from.length; i++) {
		$scope.reportselects.ship_from.push({
		    id : data.ship_from[i].CODE,
		    label : data.ship_from[i].DESC
		});
	    }

	}).error(function(data) {
	    alert('err!' + data.toString());
	});
    })();

}).controller('ModalCtrl', function($scope, $rootScope) {
    var vm = this;
}).controller('ContactsLinkSearch', function($scope, $rootScope) {
    var vm = this;

    $scope.link_contact = {};
    $scope.link_contact.id = '';
    $scope.link_contact.ADD = null;
    $scope.link_contact.CITY = null;
    $scope.link_contact.ST = null;
    $scope.link_contact.COUNTRY = null;
    $scope.link_contact.ZIP = null;
    $scope.link_contact.CHECKBOX = null;
    $scope.link_contact.CLASS = null;

    /*
     * $scope.staticyesno = [ { id : 'Y', label : 'Yes' }, { id : 'N', label :
     * 'No' } ];
     */
    $scope.donor_classes = [ {
	id : "AA",
	label : "AA - Prospect-88"
    }, {
	id : "AB",
	label : "AB - Prospect-89"
    }, {
	"id" : "AC",
	"label" : "AC - Prospect-90"
    }, {
	"id" : "AD",
	"label" : "AD - Prospect-91"
    }, {
	"id" : "AE",
	"label" : "AE - Prospect-92"
    }, {
	"id" : "AF",
	"label" : "AF - Prospect-93"
    }, {
	"id" : "AG",
	"label" : "AG - Prospect-94"
    }, {
	"id" : "CA",
	"label" : "CA - Referrals-88"
    }, {
	"id" : "CB",
	"label" : "CB - Referrals-89"
    }, {
	"id" : "CC",
	"label" : "CC - Referrals-90"
    }, {
	"id" : "CD",
	"label" : "CD - Referrals-91"
    }, {
	"id" : "CE",
	"label" : "CE - Referrals-92"
    }, {
	"id" : "CF",
	"label" : "CF - Referrals-93"
    }, {
	"id" : "CG",
	"label" : "CG - Referrals-94"
    }, {
	"id" : "EA",
	"label" : "EA - Contacts-88"
    }, {
	"id" : "EB",
	"label" : "EB - Contacts-89"
    }, {
	"id" : "EC",
	"label" : "EC - Contacts-90"
    }, {
	"id" : "ED",
	"label" : "ED - Contacts-91"
    }, {
	"id" : "EE",
	"label" : "EE - Contacts-92"
    }, {
	"id" : "EF",
	"label" : "EF - Contacts-93"
    }, {
	"id" : "EG",
	"label" : "EG - Contacts-94"
    }, {
	"id" : "GA",
	"label" : "GA - Buyers-88"
    }, {
	"id" : "GB",
	"label" : "GB - Buyers-89"
    }, {
	"id" : "GC",
	"label" : "GC - Buyers-90"
    }, {
	"id" : "GD",
	"label" : "GD - Buyers-91"
    }, {
	"id" : "GE",
	"label" : "GE - Buyers-92"
    }, {
	"id" : "GF",
	"label" : "GF - Buyers-93"
    }, {
	"id" : "GG",
	"label" : "GG - Buyers-94"
    }, {
	"id" : "IA",
	"label" : "IA - Donor - 0.01+"
    }, {
	"id" : "IB",
	"label" : "IB - Donor - 5+"
    }, {
	"id" : "IC",
	"label" : "IC - Donor - 10+"
    }, {
	"id" : "ID",
	"label" : "ID - Donor - 25+"
    }, {
	"id" : "IE",
	"label" : "IE - Donor - 50+"
    }, {
	"id" : "IF",
	"label" : "IF - Donor - 75+"
    }, {
	"id" : "IG",
	"label" : "IG - Donor - 100+"
    }, {
	"id" : "IH",
	"label" : "IH - Donor - 250+"
    }, {
	"id" : "II",
	"label" : "II - Donor - 500+"
    }, {
	"id" : "IJ",
	"label" : "IJ - Donor - 1000+"
    }, {
	"id" : "IK",
	"label" : "IK - Donor - 5000+"
    }, {
	"id" : "AH",
	"label" : "AH - Prospect-95"
    }, {
	"id" : "CH",
	"label" : "CH - Referrals-95"
    }, {
	"id" : "GH",
	"label" : "GH - Buyers-95"
    }, {
	"id" : "EH",
	"label" : "EH - Contacts-95"
    }, {
	"id" : "AI",
	"label" : "AI - Prospect-96"
    }, {
	"id" : "AJ",
	"label" : "AJ - Prospect-97"
    }, {
	"id" : "AK",
	"label" : "AK - Prospect-98"
    }, {
	"id" : "AL",
	"label" : "AL - Prospect-99"
    }, {
	"id" : "AM",
	"label" : "AM - Prospect-00"
    }, {
	"id" : "AN",
	"label" : "AN - Prospect-01"
    }, {
	"id" : "EI",
	"label" : "EI - Contacts-96"
    }, {
	"id" : "EJ",
	"label" : "EJ - Contacts-97"
    }, {
	"id" : "EK",
	"label" : "EK - Contacts-98"
    }, {
	"id" : "EL",
	"label" : "EL - Contacts-99"
    }, {
	"id" : "EM",
	"label" : "EM - Contacts-00"
    }, {
	"id" : "EN",
	"label" : "EN - Contacts-01"
    }, {
	"id" : "CI",
	"label" : "CI - Referrals-96"
    }, {
	"id" : "CJ",
	"label" : "CJ - Referrals-97"
    }, {
	"id" : "CK",
	"label" : "CK - Referrals-98"
    }, {
	"id" : "CL",
	"label" : "CL - Referrals-99"
    }, {
	"id" : "CM",
	"label" : "CM - Referrals-00"
    }, {
	"id" : "CN",
	"label" : "CN - Referrals-01"
    }, {
	"id" : "GI",
	"label" : "GI - Buyers-96"
    }, {
	"id" : "GJ",
	"label" : "GJ - Buyers-97"
    }, {
	"id" : "GK",
	"label" : "GK - Buyers-98"
    }, {
	"id" : "GL",
	"label" : "GL - Buyers-99"
    }, {
	"id" : "GM",
	"label" : "GM - Buyers-00"
    }, {
	"id" : "GN",
	"label" : "GN - Buyers-01"
    }, {
	"id" : "AO",
	"label" : "AO - Prospect-02"
    }, {
	"id" : "CO",
	"label" : "CO - Referrals-02"
    }, {
	"id" : "EO",
	"label" : "EO - Contacts-02"
    }, {
	"id" : "GO",
	"label" : "GO - Buyers-02"
    }, {
	"id" : "AP",
	"label" : "AP - Prospect-03"
    }, {
	"id" : "CP",
	"label" : "CP - Referrals-03"
    }, {
	"id" : "EP",
	"label" : "EP - Contacts-03"
    }, {
	"id" : "GP",
	"label" : "GP - Buyers-03"
    }, {
	"id" : "UN",
	"label" : "UN - Unknown"
    }, {
	"id" : "EH",
	"label" : "EH - Contact-95"
    }, {
	"id" : "CN",
	"label" : "CN - Refferal 2001"
    }, {
	"id" : "AO",
	"label" : "AO - Tour"
    } ];

    $rootScope.search_link_contact = $scope.link_contact;

    $scope.$watchCollection('link_contact', function() {
	if (vm.updateTable) {
	    clearTimeout(vm.updateTable);
	}
	vm.updateTable = setTimeout(function() {
	    $rootScope.updateLinkContactsTable();
	}, 300);
    });

}).controller('ContactsSearch', function($scope, $rootScope, $sails, $modal, $timeout) {
    var vm = this;

    $scope.longSelectOptions = {
	minimumInputLength : 2
    };

    var blankSearch = { // #CONTACT_SEARCH_PARAMETER
	id : '',
	PHONE : null,
	mode : false,
	ADD : null,
	CITY : null,
	ST : null,
	COUNTRY : null,
	ZIP : null,
	COUNTY : null,
	NOMAIL : null,
	TYPE : null,
	SOURCE : null,
	CLASS : null,
	CALL : null,
	NM_REASON : null,
	CFN : null,
	CFNID : null,
	STATUS : null,
	OCCUPATION : null,
	GENDER : null,
	DIOCESE : null,
	GROUP : null,

	// Ecclesiastical -
	ecc_enabled : null,
	RELIGIOUS : null,
	Q01 : null,
	Q02 : null,
	Q03 : null,
	Q04 : null,
	Q05 : null,
	Q06 : null,
	Q07 : null,
	Q08 : null,
	Q09 : null,
	Q10 : null,
	Q11 : null,
	Q12 : null,
	Q13 : null,
	Q14 : null,
	Q15 : null,
	Q16 : null,
	Q17 : null,
	Q18 : null,
	Q19 : null,
	Q20 : null,
	Q21 : null,
	Q22 : null,
	Q23 : null,
	BIRTHDATE : null,
	ORDINATION : null,
	SAYMASS : null,
	DECIS : null,
	PPRIEST : null,
	CONSECRATE : null,
	EP020 : null,

	// DPOTHER
	dpother : {
	    TRANSACT : null,
	    LIST : null,
	    AMT_MIN : null,
	    AMT_MAX : null,
	    DATE_MIN : null,
	    DATE_MAX : null,
	    SOL : null,
	    DEMAND : null,
	    MODE : null,
	    GL : null,
	    REQUESTS : null,
	    TBAREQS : null
	//	    
	//	    
	//	    
	// date date range Transaction Date
	// transact multi select Transact Code
	// list multi select List Code
	// amt numeric range Amount Code
	// sol multi select Prov Code
	// demand multi select Demand Code
	// mode multi select Mode
	// gl multi select Pledge Group
	// requests multi select Requests
	// tbareqs multi select TBA Requests

	},
	dpgift : {
	    DATE_MIN : null,
	    DATE_MAX : null,
	    AMT_MIN : null,
	    AMT_MAX : null,
	    GL : null,
	    SOL : null,
	    PLEDGE : null,
	    LIST : null,
	    TRANSACT : null,
	    DEMAND : null,
	    MODE : null,
	    REQUESTS : null,
	    TBAREQS : null,
	    CAMP_TYPE : null
	// ms
	},
	dtmail : {
	    SOL : null
	},
	dpplg : {
	    PLEDGOR : 'ANY',
	    MADE_DT_MIN : null,
	    MADE_DT_MAX : null,
	    START_DT_MIN : null,
	    START_DT_MAX : null,
	    TOTAL_MIN : null,
	    TOTAL_MAX : null,
	    BILL_MIN : null,
	    BILL_MAX : null,
	    MQA : null,
	    REMIND : null,
	    CHANGE_DT_MIN : null,
	    CHANGE_DT_MAX : null,
	    GL : null,
	    ORIGIN : null,
	    SOL : null
	},
	dpmisc : {
	    MDATE_MIN : null,
	    MDATE_MAX : null,
	    SOL : null,
	    MTYPE : null,
	    MCOUNT_MIN : null,
	    MCOUNT_MAX : null,
	    MAMT_MIN : null,
	    MAMT_MAX : null,
	    MYEAR_MIN : null,
	    MYEAR_MAX : null
	},
	dtvols1 : {
	    VOLUNTEER : null,

	    VORIGIN : null,
	    VSDATE_MIN : null,
	    VSDATE_MAX : null,
	    VCATEG : null,
	    VGRADE01 : null,
	    VGRADE02 : null,
	    VGRADE03 : null,
	    VGRADE04 : null,
	    VGRADE05 : null,
	    VGRADE06 : null,
	    VGRADE07 : null,
	    VGRADE08 : null,
	    VGRADE09 : null,
	    VGRADE10 : null,
	    VGRADE11 : null,
	    VGRADE12 : null,
	    VGRADE13 : null,
	    VGRADE14 : null,
	    VGRADE15 : null,
	    VGRADE16 : null,
	    VSPECTAL : null
	},
	dpothadd : {
	    ADDTYPE : null,
	    ADD : null,
	    CITY : null,
	    ST : null,
	    ZIP : null
	},
	dpordersummary : {
	    order_type : null,
	    SOL : null,
	    DATE_MIN : null,
	    DATE_MAX : null,
	    IPAID : null,
	    ORIGENV : null,
	    ORIGDATE_MIN : null,
	    ORIGDATE_MAX : null,
	    FUNDS : null,
	    SHIPFROM : null,
	    CASH_MIN : null,
	    CASH_MAX : null,
	    CREDIT_MIN : null,
	    CREDIT_MAX : null,
	    GTOTAL_MIN : null,
	    GTOTAL_MAX : null
	},
	dptrans : {
	    LANGUAGE : null
	},
	dplang : {
	    LANGUAGE : null
	},
	dtmajor : {
	    FORCEJOIN : null,
	    TYPE : null,
	    ASKAMT_MIN : null,
	    ASKAMT_MAX : null,
	    PLEDAMT_MIN : null,
	    PLEDAMT_MAX : null,
	    PAIDAMT_MIN : null,
	    PAIDAMT_MAX : null,
	    PLEDSCHED : null,
	    GIFTOFF : null,
	    WEALTHID : null,
	    STATUS : null,
	    ANNTRUST : null,
	    INSURANC : null,
	    VISDATE1_MIN : null,
	    VISDATE1_MAX : null,
	    VISDATE2_MIN : null,
	    VISDATE2_MAX : null,
	    VISDATE3_MIN : null,
	    VISDATE3_MAX : null,
	    VISDATE4_MIN : null,
	    VISDATE4_MAX : null

	},
	dtbishop : {
	    FORCEJOIN : null

	}

    };

    $scope.contact = angular.copy(blankSearch);

    $scope.template = null;
    $rootScope.newTemplateModal = {
	name : null
    };

    $scope.clearVars = function(vars) {
	$timeout(function() {
	    angular.forEach(vars, function(value, key) {
		vars[key] = null;
	    });
	    $scope.contact.dtvols1.VSDATE_MIN = null;
	    $scope.contact.dtvols1.VSDATE_MAX = null;

	}, 0);
    };

    (function() {

	$rootScope.staticyes = [ {
	    id : 'Y',
	    label : 'Yes'
	} ];
	$rootScope.staticyesno = [ {
	    id : 'Y',
	    label : 'Yes'
	}, {
	    id : 'N',
	    label : 'No'
	} ];

	$rootScope.staticyesnobool = [ {
	    id : 1,
	    label : 'Yes'
	}, {
	    id : 0,
	    label : 'No'
	} ];
	$rootScope.staticyesnounknown = [ {
	    id : 'Y',
	    label : 'Yes'
	}, {
	    id : 'U',
	    label : 'Unknown'
	}, {
	    id : 'N',
	    label : 'No'
	} ];

	$rootScope.responses = [ {
	    id : '1',
	    label : 'Not yet known'
	}, {
	    id : '2',
	    label : 'Positive'
	}, {
	    id : '3',
	    label : 'Negative'
	} ];

	$rootScope.order_types = [ {
	    id : 1,
	    label : 'Sale'
	}, {
	    id : 2,
	    label : 'Free Gift'
	} ];

	$sails.get('/donortracker/getsearchattributes').success(function(data) {

	    data = data.result;
	    
	    
	    $rootScope.ship_from = [];
	    $rootScope.ship_name = {};
	    for (var i = 0; i < data.ship_from.length; i++) {
		$rootScope.ship_from.push({
		    id : data.ship_from[i].CODE,
		    label : data.ship_from[i].CODE + " - " + data.ship_from[i].DESC
		});
		$scope.ship_name[data.ship_from[i].CODE] = data.ship_from[i].DESC;
	    }

	    $rootScope.currency_format = {};

	    $rootScope.all_currencies = [];
	    $rootScope.non_us_currencies = [];
	    $rootScope.currencies = {};
	    for (var i = 0; i < data.currencies.length; i++) {
		$rootScope.currencies[data.currencies[i].id] = {
		    name : data.currencies[i].name,
		    code : data.currencies[i].code,
		    symbol : data.currencies[i].symbol
		}
		$rootScope.currency_format[data.currencies[i].id] = {
		    name : data.currencies[i].name,
		    code : data.currencies[i].code
		};
		$rootScope.all_currencies.push({
		    id : data.currencies[i].id,
		    label : data.currencies[i].name
		});
		if (data.currencies[i].id == 'U') {
		    continue;
		}
		$rootScope.non_us_currencies.push({
		    id : data.currencies[i].id,
		    selector_label : data.currencies[i].name + ' to United States Dollar',
		    label : data.currencies[i].name
		});

	    }
	    
	    $rootScope.transacts = [];
	    for (var i = 0; i < data.transacts.length; i++) {
		$rootScope.transacts.push({
		    id : data.transacts[i].CODE,
		    label : data.transacts[i].CODE + " - " + data.transacts[i].DESC
		});
	    }

	    $rootScope.titles = [];
	    for (var i = 0; i < data.titles.length; i++) {
		$rootScope.titles.push({
		    id : data.titles[i].TITLE,
		    label : data.titles[i].TITLE
		});
	    }
	    $rootScope.languages = [];
	    for (var i = 0; i < data.languages.length; i++) {
		$rootScope.languages.push({
		    id : data.languages[i].CODE,
		    label : data.languages[i].CODE + " - " + data.languages[i].DESC
		});
	    }
	    $rootScope.english = [];
	    for (var i = 0; i < data.english.length; i++) {
		$rootScope.english.push({
		    id : data.english[i].CODE,
		    label : data.english[i].CODE + " - " + data.english[i].DESC
		});
	    }

	    $rootScope.states = [];
	    for (var i = 0; i < data.states.length; i++) {
		$rootScope.states.push({
		    id : data.states[i].CODE,
		    label : data.states[i].CODE
		});
	    }

	    $rootScope.address_types = [];
	    for (var i = 0; i < data.address_types.length; i++) {
		$rootScope.address_types.push({
		    id : data.address_types[i].CODE,
		    label : data.address_types[i].CODE
		});
	    }

	    $rootScope.pledge_schedule = data.pledge_schedule;
	    $rootScope.major_donation_types = data.major_donation_types;

	    $rootScope.decision = [];
	    for (var i = 0; i < data.decision.length; i++) {
		$rootScope.decision.push({
		    id : data.decision[i].CODE,
		    label : data.decision[i].CODE + " - " + data.decision[i].DESC
		});
	    }

	    $rootScope.willsaymass = [];
	    for (var i = 0; i < data.willsaymass.length; i++) {
		$rootScope.willsaymass.push({
		    id : data.willsaymass[i].CODE,
		    label : data.willsaymass[i].CODE + " - " + data.willsaymass[i].DESC
		});
	    }

	    $rootScope.mass_said = [];
	    for (var i = 0; i < data.mass_said.length; i++) {
		$rootScope.mass_said.push({
		    id : data.mass_said[i].CODE,
		    label : data.mass_said[i].CODE + " - " + data.mass_said[i].DESC
		});
	    }

	    $rootScope.values_traditional = [];
	    for (var i = 0; i < data.values_traditional.length; i++) {
		$rootScope.values_traditional.push({
		    id : data.values_traditional[i].CODE,
		    label : data.values_traditional[i].CODE + " - " + data.values_traditional[i].DESC
		});
	    }

	    $rootScope.billing_schedules = [];
	    for (var i = 0; i < data.billing_schedules.length; i++) {
		$rootScope.billing_schedules.push({
		    id : data.billing_schedules[i].CODE,
		    label : data.billing_schedules[i].CODE + " - " + data.billing_schedules[i].DESC
		});
	    }

	    $rootScope.origins = [];
	    for (var i = 0; i < data.origins.length; i++) {
		$rootScope.origins.push({
		    id : data.origins[i].CODE,
		    label : data.origins[i].CODE + " - " + data.origins[i].DESC
		});
	    }

	    $rootScope.lists = [];
	    for (var i = 0; i < data.lists.length; i++) {
		$rootScope.lists.push({
		    id : data.lists[i].CODE,
		    label : data.lists[i].CODE + " - " + data.lists[i].DESC
		});
	    }

	    $rootScope.label_sols = {};
	    $rootScope.sols = [];
	    for (var i = 0; i < data.sols.length; i++) {
		$rootScope.sols.push({
		    id : data.sols[i].CODE,
		    label : data.sols[i].CODE
		});
		$rootScope.label_sols[data.sols[i].CODE] = data.sols[i].CODE + ' - ' + data.sols[i].DESC;
	    }

	    $rootScope.demands = [];
	    for (var i = 0; i < data.demands.length; i++) {
		$rootScope.demands.push({
		    id : data.demands[i].CODE,
		    label : data.demands[i].CODE + " - " + data.demands[i].DESC
		});
	    }

	    $rootScope.modes = [];
	    for (var i = 0; i < data.modes.length; i++) {
		$rootScope.modes.push({
		    id : data.modes[i].CODE,
		    label : data.modes[i].CODE + " - " + data.modes[i].DESC
		});
	    }

	    $rootScope.pledgegroups = [];
	    for (var i = 0; i < data.pledgegroups.length; i++) {
		$rootScope.pledgegroups.push({
		    id : data.pledgegroups[i].CODE,
		    label : data.pledgegroups[i].CODE + " - " + data.pledgegroups[i].DESC
		});
	    }

	    $rootScope.tba_requests = [];
	    for (var i = 0; i < data.tba_requests.length; i++) {
		$rootScope.tba_requests.push({
		    id : data.tba_requests[i].CODE,
		    label : data.tba_requests[i].CODE + " - " + data.tba_requests[i].DESC
		});
	    }

	    $rootScope.requests_plural = [];
	    for (var i = 0; i < data.requests_plural.length; i++) {
		$rootScope.requests_plural.push({
		    id : data.requests_plural[i].CODE,
		    label : data.requests_plural[i].CODE + " - " + data.requests_plural[i].DESC
		});
	    }

	})

	$sails.get('/template/contacts').success(function(data) {
	    $scope.search_templates = [];
	    for (var i = 0; i < data.length; i++) {
		$scope.search_templates.push({
		    id : data[i].id,
		    label : data[i].name,
		    data : data[i].data
		});
	    }

	}).error(function(data) {
	    alert('err!' + data.toString());
	});
    })();
    /*
     * $scope.staticyesno = [ { id : 'Y', label : 'Yes' }, { id : 'N', label :
     * 'No' } ];
     */
    $scope.donor_classes = [ {
	id : "AA",
	label : "AA - Prospect-88"
    }, {
	id : "AB",
	label : "AB - Prospect-89"
    }, {
	"id" : "AC",
	"label" : "AC - Prospect-90"
    }, {
	"id" : "AD",
	"label" : "AD - Prospect-91"
    }, {
	"id" : "AE",
	"label" : "AE - Prospect-92"
    }, {
	"id" : "AF",
	"label" : "AF - Prospect-93"
    }, {
	"id" : "AG",
	"label" : "AG - Prospect-94"
    }, {
	"id" : "CA",
	"label" : "CA - Referrals-88"
    }, {
	"id" : "CB",
	"label" : "CB - Referrals-89"
    }, {
	"id" : "CC",
	"label" : "CC - Referrals-90"
    }, {
	"id" : "CD",
	"label" : "CD - Referrals-91"
    }, {
	"id" : "CE",
	"label" : "CE - Referrals-92"
    }, {
	"id" : "CF",
	"label" : "CF - Referrals-93"
    }, {
	"id" : "CG",
	"label" : "CG - Referrals-94"
    }, {
	"id" : "EA",
	"label" : "EA - Contacts-88"
    }, {
	"id" : "EB",
	"label" : "EB - Contacts-89"
    }, {
	"id" : "EC",
	"label" : "EC - Contacts-90"
    }, {
	"id" : "ED",
	"label" : "ED - Contacts-91"
    }, {
	"id" : "EE",
	"label" : "EE - Contacts-92"
    }, {
	"id" : "EF",
	"label" : "EF - Contacts-93"
    }, {
	"id" : "EG",
	"label" : "EG - Contacts-94"
    }, {
	"id" : "GA",
	"label" : "GA - Buyers-88"
    }, {
	"id" : "GB",
	"label" : "GB - Buyers-89"
    }, {
	"id" : "GC",
	"label" : "GC - Buyers-90"
    }, {
	"id" : "GD",
	"label" : "GD - Buyers-91"
    }, {
	"id" : "GE",
	"label" : "GE - Buyers-92"
    }, {
	"id" : "GF",
	"label" : "GF - Buyers-93"
    }, {
	"id" : "GG",
	"label" : "GG - Buyers-94"
    }, {
	"id" : "IA",
	"label" : "IA - Donor - 0.01+"
    }, {
	"id" : "IB",
	"label" : "IB - Donor - 5+"
    }, {
	"id" : "IC",
	"label" : "IC - Donor - 10+"
    }, {
	"id" : "ID",
	"label" : "ID - Donor - 25+"
    }, {
	"id" : "IE",
	"label" : "IE - Donor - 50+"
    }, {
	"id" : "IF",
	"label" : "IF - Donor - 75+"
    }, {
	"id" : "IG",
	"label" : "IG - Donor - 100+"
    }, {
	"id" : "IH",
	"label" : "IH - Donor - 250+"
    }, {
	"id" : "II",
	"label" : "II - Donor - 500+"
    }, {
	"id" : "IJ",
	"label" : "IJ - Donor - 1000+"
    }, {
	"id" : "IK",
	"label" : "IK - Donor - 5000+"
    }, {
	"id" : "AH",
	"label" : "AH - Prospect-95"
    }, {
	"id" : "CH",
	"label" : "CH - Referrals-95"
    }, {
	"id" : "GH",
	"label" : "GH - Buyers-95"
    }, {
	"id" : "EH",
	"label" : "EH - Contacts-95"
    }, {
	"id" : "AI",
	"label" : "AI - Prospect-96"
    }, {
	"id" : "AJ",
	"label" : "AJ - Prospect-97"
    }, {
	"id" : "AK",
	"label" : "AK - Prospect-98"
    }, {
	"id" : "AL",
	"label" : "AL - Prospect-99"
    }, {
	"id" : "AM",
	"label" : "AM - Prospect-00"
    }, {
	"id" : "AN",
	"label" : "AN - Prospect-01"
    }, {
	"id" : "EI",
	"label" : "EI - Contacts-96"
    }, {
	"id" : "EJ",
	"label" : "EJ - Contacts-97"
    }, {
	"id" : "EK",
	"label" : "EK - Contacts-98"
    }, {
	"id" : "EL",
	"label" : "EL - Contacts-99"
    }, {
	"id" : "EM",
	"label" : "EM - Contacts-00"
    }, {
	"id" : "EN",
	"label" : "EN - Contacts-01"
    }, {
	"id" : "CI",
	"label" : "CI - Referrals-96"
    }, {
	"id" : "CJ",
	"label" : "CJ - Referrals-97"
    }, {
	"id" : "CK",
	"label" : "CK - Referrals-98"
    }, {
	"id" : "CL",
	"label" : "CL - Referrals-99"
    }, {
	"id" : "CM",
	"label" : "CM - Referrals-00"
    }, {
	"id" : "CN",
	"label" : "CN - Referrals-01"
    }, {
	"id" : "GI",
	"label" : "GI - Buyers-96"
    }, {
	"id" : "GJ",
	"label" : "GJ - Buyers-97"
    }, {
	"id" : "GK",
	"label" : "GK - Buyers-98"
    }, {
	"id" : "GL",
	"label" : "GL - Buyers-99"
    }, {
	"id" : "GM",
	"label" : "GM - Buyers-00"
    }, {
	"id" : "GN",
	"label" : "GN - Buyers-01"
    }, {
	"id" : "AO",
	"label" : "AO - Prospect-02"
    }, {
	"id" : "CO",
	"label" : "CO - Referrals-02"
    }, {
	"id" : "EO",
	"label" : "EO - Contacts-02"
    }, {
	"id" : "GO",
	"label" : "GO - Buyers-02"
    }, {
	"id" : "AP",
	"label" : "AP - Prospect-03"
    }, {
	"id" : "CP",
	"label" : "CP - Referrals-03"
    }, {
	"id" : "EP",
	"label" : "EP - Contacts-03"
    }, {
	"id" : "GP",
	"label" : "GP - Buyers-03"
    }, {
	"id" : "UN",
	"label" : "UN - Unknown"
    }, {
	"id" : "EH",
	"label" : "EH - Contact-95"
    }, {
	"id" : "CN",
	"label" : "CN - Refferal 2001"
    }, {
	"id" : "AO",
	"label" : "AO - Tour"
    } ];

    $rootScope.search_contact = $scope.contact;

    $scope.searchContacts = function() {
	$rootScope.updateContactsTable();
    }

    $scope.$watch('contact', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    if (vm.updateTable) {
		clearTimeout(vm.updateTable);
	    }
	    vm.updateTable = setTimeout(function() {
		$rootScope.updateContactsTable();
		// AutoUpdate

		// $rootScope.newTemplateModal.name = null;
		/*
		 * if ($scope.template == null) { $scope.template = 'new'; }
		 * else { $scope.template = null; }
		 */
	    }, 300);
	}
    }, true);// //Collection

    $rootScope.saveTemplate = function() {
	$rootScope.newTemplateModal.id = null;
	for (var i = 0; i < $scope.search_templates.length; i++) {
	    if ($scope.search_templates[i].label == $rootScope.newTemplateModal.name) { // matching
		// up
		// against
		// existing
		// template
		// name
		$rootScope.newTemplateModal.id = $scope.search_templates[i].id;
	    }
	}
	if ($rootScope.newTemplateModal.id == null) {
	    $rootScope.currentModal.dismiss('save');
	} else {
	    $rootScope.modalPopup({
		title : 'Confirm Overwrite',
		size : 'sm',
		message : 'Are you sure you want to save over the existing template: <b>' + $rootScope.newTemplateModal.name + '</b>',
		buttons : [ {
		    name : 'Cancel',
		    class : 'btn-white',
		    dismiss : 'cancel'
		}, {
		    name : 'Save',
		    class : 'btn-danger',
		    dismiss : 'save'
		} ]
	    }, function(dismiss) {
		if (dismiss == 'save') {
		    $rootScope.currentModal.dismiss('save');
		} else {
		    // $rootScope.currentModal.dismiss();
		}
	    });
	}
    };

    $scope.$watch('template', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    for (var i = 0; i < $scope.search_templates.length; i++) {
		if ($scope.search_templates[i].id == $scope.template) { // matching
		    // one

		    angular.forEach($scope.contact, function(value, key) {

			if (key == 'dpother' || key == 'dpgift' || key == 'dpplg' || key == 'dtvols1' || key == 'dpmisc' || key == 'dtmail' || key == 'dpothadd' || key == 'dpordersummary' || key == 'dplang' || key == 'dptrans' || key == 'dtmajor' || key == 'dtbishop') {
			    angular.forEach(value, function(innerValue, innerKey) {
				if ($scope.search_templates[i].data[key][innerKey]) {
				    $scope.contact[key][innerKey] = $scope.search_templates[i].data[key][innerKey];

				} else {
				    $scope.contact[key][innerKey] = null;
				}
			    });
			} else if ($scope.search_templates[i].data[key]) {
			    $scope.contact[key] = $scope.search_templates[i].data[key];
			} else {
			    $scope.contact[key] = null;
			}
		    });

		    $rootScope.search_contact = $scope.contact;// =
		    // $scope.search_templates[i].data;
		    // $rootScope.search_contact hopefully will stay tied..
		    // $rootScope.newTemplateModal.id =
		    // $scope.search_templates[i].id;
		    $rootScope.newTemplateModal.name = $scope.search_templates[i].label;
		    $rootScope.newTemplateModal.id = $scope.search_templates[i].id;
		}
	    }
	}
    });

    $scope.clearTemplates = function() {
	$rootScope.newTemplateModal.name = null;
	$rootScope.newTemplateModal.id = null;
	$scope.template = null;
	$rootScope.search_contact = $scope.contact = angular.copy(blankSearch); // clears
	// the
	// contact
	// search
	// parameters
    }

    $scope.deleteTemplate = function() {
	$rootScope.modalPopup({
	    title : 'Confirm Delete',
	    size : 'sm',
	    message : 'Are you sure you want to delete the template: <b>' + $rootScope.newTemplateModal.name + '</b>',
	    buttons : [ {
		name : 'Cancel',
		class : 'btn-white',
		dismiss : 'cancel'
	    }, {
		name : 'Delete',
		class : 'btn-danger',
		dismiss : 'delete'
	    } ]
	}, function(dismiss) {
	    if (dismiss == 'delete') {
		$sails.post('/template/destroy', {
		    id : $rootScope.newTemplateModal.id,
		    location : 'contacts'
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$scope.template = null;
			$rootScope.newTemplateModal.id = null;
			$rootScope.newTemplateModal.name = null;
			$rootScope.search_contact = $scope.contact = angular.copy(blankSearch);
			$timeout(function() {
			    $sails.get('/template/contacts').success(function(data) {
				if (data.error != undefined) { // USER NO
				    // LONGER LOGGED
				    // IN!!!!!
				    location.reload(); // Will boot back to
				    // login
				    // screen
				}
				$scope.search_templates = [];
				for (var i = 0; i < data.length; i++) {
				    $scope.search_templates.push({
					id : data[i].id,
					label : data[i].name,
					data : data[i].data
				    });
				}
			    });
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    } else {
	    }
	});
    }

    $scope.saveTemplateModal = function() {
	// $rootScope.newTemplateModal.name = null;
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'save-template-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/template/save', {
		    id : $rootScope.newTemplateModal.id,
		    location : 'contacts',
		    name : $rootScope.newTemplateModal.name,
		    data : $scope.contact
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$scope.template = data.template.id;
			$timeout(function() {
			    $sails.get('/template/contacts').success(function(data) {
				if (data.error != undefined) { // USER NO
				    // LONGER LOGGED
				    // IN!!!!!
				    location.reload(); // Will boot back to
				    // login
				    // screen
				}
				$scope.search_templates = [];
				for (var i = 0; i < data.length; i++) {
				    $scope.search_templates.push({
					id : data[i].id,
					label : data[i].name,
					data : data[i].data
				    });
				}
			    });
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

}).controller('DpCodesSearch', function($scope, $rootScope, $sails) {
    var vm = this;

    $scope.dpsearch = {};
    $scope.dpsearch.id = '';
    $scope.dpsearch.field = null;

    /*
     * $scope.staticyesno = [ { id : 'Y', label : 'Yes' }, { id : 'N', label :
     * 'No' } ];
     */

    // initialization routine.
    (function() {
	$sails.get('/donortracker/getdpcodeattributes').success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    var data = data.result;

	    $rootScope.response = [ {
		id : '1',
		label : 'Not yet known'
	    }, {
		id : '2',
		label : 'Positive'
	    }, {
		id : '3',
		label : 'Negative'
	    } ]

	    $rootScope.staticyesno = [ {
		id : 'Y',
		label : 'Yes'
	    }, {
		id : 'N',
		label : 'No'
	    } ];


	    $rootScope.dpcodefields = [];
	    $rootScope.dpcodefields.push({
		id : null,
		label : 'All'
	    });
	    for (var i = 0; i < data.dpcodefields.length; i++) {
		if (data.dpcodefields[i].FIELD == null) {
		    continue;
		}
		$rootScope.dpcodefields.push({
		    id : data.dpcodefields[i].FIELD,
		    label : data.dpcodefields[i].FIELD
		});
	    }
	});

    })();

    $rootScope.dpsearch = $scope.dpsearch;

    $scope.$watchCollection('dpsearch', function() {
	if (vm.updateTable) {
	    clearTimeout(vm.updateTable);
	}
	vm.updateTable = setTimeout(function() {
	    $rootScope.updateDpCodesDataTable();
	}, 300);
    });

}).controller('FxChangeSearch', function($scope, $rootScope, $sails) {
    var vm = this;

    $scope.fxsearch = {};
    $scope.fxsearch.currency_from = "C";

    /*
     * $scope.staticyesno = [ { id : 'Y', label : 'Yes' }, { id : 'N', label :
     * 'No' } ];
     */

    // initialization routine.
    (function() {
	$sails.get('/donortracker/getfxechangeattributes').success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    var data = data.result;

	    $rootScope.all_currencies = [];
	    $rootScope.non_us_currencies = [];

	    for (var i = 0; i < data.currencies.length; i++) {
		$rootScope.all_currencies.push({
		    id : data.currencies[i].id,
		    label : data.currencies[i].name
		});
		if (data.currencies[i].id == 'U') {
		    continue;
		}
		$rootScope.non_us_currencies.push({
		    id : data.currencies[i].id,
		    selector_label : data.currencies[i].name + ' to United States Dollar',
		    label : data.currencies[i].name
		});

	    }
	});

    })();

    $rootScope.fxsearch = $scope.fxsearch;

    $scope.$watchCollection('fxsearch', function() {
	if (vm.updateTable) {
	    clearTimeout(vm.updateTable);
	}
	vm.updateTable = setTimeout(function() {
	    $rootScope.updateFxChangeDataTable();
	}, 300);
    });

}).controller(
    'AddContactDatatable',
    function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder) {
	var vm = this;
	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/contacts/search',
	    type : 'POST'
	}).withOption('responsive').withOption('serverSide', true).withOption('processing', true).withOption('fnServerParams', function(aoData) {
	    aoData.contact = $rootScope.search_link_contact;
	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function() {
		$scope.$apply(function() {
		    vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
		});
	    });
	    return nRow;
	}).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"l>>rt<"col-xs-12"<"row"<"col-lg-4"i><"col-lg-8"p>>>');
	// l length
	// r processing
	// f filtering
	// t table
	// i info
	// p pagination
	vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('FNAME').withTitle('First name'), DTColumnBuilder.newColumn('LNAME').withTitle('Last name'), DTColumnBuilder.newColumn('ADD').withTitle('Address'),
	    DTColumnBuilder.newColumn('CITY').withTitle('City'), DTColumnBuilder.newColumn('ST').withTitle('State'), DTColumnBuilder.newColumn('COUNTRY').withTitle('Country'), DTColumnBuilder.newColumn('ZIP').withTitle('Zip') ];

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    $scope.tableId = data.id; // Record table ID, for refreshes
	    // later.
	});

	$rootScope.updateLinkContactsTable = function(event, args) {
	    if ($scope.tableId) {
		$('#' + $scope.tableId).DataTable().ajax.reload(function() {
		}, false);
		$rootScope.modalDataSet['dplink'].errors = {}; // empties
		// errors
	    }
	}

	function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    // $rootScope.$broadcast("selectLinkContact", {
	    // id : aData
	    // });
	    $rootScope.modalDataSet.dplink.errors = {}; // empty errors
	    $timeout(function() {
		$rootScope.modalDataSet.dplink.ID2 = aData.id;
	    }, 0);

	    // if(aData.id == $contact.id){
	    $('tr').removeClass('selected');
	    $(nRow).addClass('selected');
	}

    }).controller(
    'ContactsDatatable',
    function($scope, $rootScope, $timeout, $sails, $modal, $contact, DTOptionsBuilder, DTColumnBuilder) {
	$scope.exportDisabled = false;

	var vm = this;
	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/contacts/search',
	    type : 'POST'
	})
	// .withDataProp('data')
	.withOption('serverSide', true).withOption('processing', true).withOption('fnServerParams', function(aoData) {
	    var searcht = angular.copy($rootScope.search_contact);
	    // delete searcht.AMT_MIN;
	    // delete searcht.AMT_MAX;
	    aoData.contact = searcht;
	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function() {
		// $scope.$apply(function() {
		vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
		// });
	    });
	    if (aData.id == $contact.id) {
		$(nRow).addClass('selected');
	    }
	    return nRow;
	}).withOption('drawCallback', function rowCallback(settings) {
	    if (settings._iRecordsDisplay > 100000) {
		$timeout(function() {
		    $scope.exportDisabled = true;
		}, 0);
	    } else {
		$timeout(function() {
		    $scope.exportDisabled = false;
		}, 0);
	    }
	}).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"l>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
	// l length
	// r processing
	// f filtering
	// t table
	// i info
	// p pagination
	vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('FNAME').withTitle('First name'), DTColumnBuilder.newColumn('LNAME').withTitle('Last name'), DTColumnBuilder.newColumn('ADD').withTitle('Address'),
	    DTColumnBuilder.newColumn('CITY').withTitle('City'), DTColumnBuilder.newColumn('ST').withTitle('State'), DTColumnBuilder.newColumn('COUNTRY').withTitle('Country'), DTColumnBuilder.newColumn('ZIP').withTitle('Zip') ];

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    $scope.tableId = data.id; // Record table ID, for refreshes
	    // later.
	    // alert('loaded');
	});
	$rootScope.updateContactsTable = function(event, args) {
	    if ($scope.tableId) {
		$('#' + $scope.tableId).DataTable().ajax.reload(function() {
		}, false);
	    }
	}

	$scope.newContact = function() {
	    $rootScope.$broadcast("getcontact", {
		id : "new"
	    });
	}

	$scope.exportList = function() {
	    $rootScope.currentModal = $modal.open({
		templateUrl : 'export-contacts-modal',
		size : 'md',
		backdrop : true
	    });
	    $rootScope.exporting_contacts = true;

	    $sails.post('/contacts/export', {
		contact : $rootScope.search_contact
	    }).success(function(response) {
		if (response.error != undefined) { // USER NO LONGER
		    // LOGGEDIN!!!!!
		    location.reload(); // Will boot back to login screen
		}
		if (response.oversize) {
		    $rootScope.currentModal.dismiss('oversize');
		    return alert('Unable to export ' + response.recordsFiltered + ' records. The system can export a maximum of 100,000 records.');

		}
		$timeout(function() {
		    // $rootScope.pdfurl = response.pdfurl;
		    $rootScope.contact_export_csvurl = response.csvurl;
		    $rootScope.contact_export_dbfurl = response.dbfurl;
		    delete $rootScope.exporting_contacts;
		}, 0);
	    });
	}

	/*
	 * $scope.$on('refreshContactsx', function(event, args){
	 * //console.log('deb'); vm.contact = args;
	 * $timeout(vm.dtOptions.reloadData,500); //(); });
	 */

	function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    var unsavedMessage = 'You have unsaved changes pending.  Are you sure you want to discard these changes? Press Cancel to go back and save your changes.';

	    if ($contact.is_modified) {
		if (!confirm(unsavedMessage)) {
		    // $contact.is_modified = false;
		    // } else {
		    var obj = {
			pos : $(window).scrollTop()
		    };
		    TweenLite.to(obj, 0.3, {
			pos : ($('#contact_form').length < 1) ? 0 : ($('#contact_form').offset().top - 8),
			ease : Power4.easeOut,
			onUpdate : function() {
			    $(window).scrollTop(obj.pos);
			}
		    });
		    return;
		}
	    }
	    $rootScope.$broadcast("getcontact", {
		id : aData.id
	    });
	    // if(aData.id == $contact.id){
	    $('tr').removeClass('selected');
	    $(nRow).addClass('selected');
	    // }
	    // console.log('here');
	    // vm.message = info.DONOR2 + ' - ' + info.FNAME;
	}

    }).controller('SecurityGroups', function($scope, $rootScope, $timeout, $sails, $modal, DTOptionsBuilder, DTColumnBuilder) {
    this.blank_group = {
	id : null,
	name : null,
	resources : []
    };
    $scope.group = angular.copy(this.blank_group);
    $rootScope.group_modified = false;
    $scope.selectedGroup = null;
    var vm = this;
    var groupWatcher = null;
    vm.rowClicked = rowClicked;
    vm.getWatcher = getWatcher;
    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	dataSrc : 'data',
	url : '/securitygroups/ajax',
	type : 'POST'
    }).withOption('serverSide', false).withOption('processing', false).withOption('fnServerParams', function(aoData) {
	// aoData.contact = $rootScope.search_contact;
    }).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	$('td', nRow).unbind('click');
	$('td', nRow).bind('click', function() {
	    // $scope.$apply(function() {
	    vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
	    // });
	});
	if ($scope.selectedGroup != null && aData.id == $scope.selectedGroup.id) {
	    $(nRow).addClass('selected');
	}

	return nRow;
    }).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"l>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
    // l length
    // r processing
    // f filtering
    // t table
    // i info
    // p pagination
    vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('name').withTitle('Name') ];

    $scope.$on('event:dataTableLoaded', function(event, data) {
	$scope.tableId = data.id; // Record table ID, for refreshes later.
    });

    function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	if (vm.groupWatcher != null) {
	    vm.groupWatcher();
	}
	$sails.post('/securitygroups/getsecuritygroupandresources', {
	    id : aData.id
	}).success(function(response) {
	    if (response.error != undefined) { // USER NO
		// LONGER
		// LOGGED
		// IN!!!!!
		location.reload(); // Will boot back to
		// login
		// screen
	    }
	    $timeout(function() {
		$scope.group = response;
		$rootScope.group_modified = false;
		$scope.selectedGroup = angular.copy(response);
		$rootScope.validator['securitygroup_form'].resetForm();
		$('form#securitygroup_form .validate-has-error').removeClass('validate-has-error');

		vm.groupWatcher = vm.getWatcher();
	    }, 0);
	}).error(function(data) {
	    alert('err!');
	});

	$('tr').removeClass('selected');
	$(nRow).addClass('selected');
    }

    function getWatcher() {
	return $scope.$watch('group', function(newValue, oldValue) {
	    if (!angular.equals(newValue, oldValue)) {
		$timeout(function() {
		    $rootScope.group_modified = true;
		}, 0)
	    }
	}, true);
    }

    $scope.cancelGroup = function() {
	$timeout(function() {
	    if (vm.groupWatcher != null) {
		vm.groupWatcher();
	    }
	    $scope.selectedGroup = null;
	    $('tr').removeClass('selected');
	}, 0);
    }

    $scope.newGroup = function() {
	$sails.get('/security/getresourcegroups').success(function(resources) {
	    if (resources.error != undefined) { // USER NO
		// LONGER
		// LOGGED
		// IN!!!!!
		location.reload(); // Will boot back to
		// login
		// screen
	    }
	    if (vm.groupWatcher != null) {
		vm.groupWatcher();
	    }
	    for ( var key in resources) {
		resources[key].create = 1;
		resources[key].read = 1;
		resources[key].update = 1;
		resources[key]['delete'] = 1;
	    }
	    $timeout(function() {
		$scope.selectedGroup = null;
		$('tr').removeClass('selected');
		$scope.group = angular.copy(vm.blank_group);
		$scope.group.resources = resources;
		$rootScope.group_modified = false;
		$rootScope.validator['securitygroup_form'].resetForm();
		$('form#securitygroup_form .validate-has-error').removeClass('validate-has-error');
		$scope.selectedGroup = angular.copy($scope.group);
		vm.groupWatcher = vm.getWatcher();
	    }, 0);

	});

    }

    $scope.isRequired = function() {
	return 'required';
    }

    $scope.isNew = function() {
	return ($scope.selectedGroup == null || $scope.selectedGroup.id == null);
    }

    $scope.deleteGroup = function(modal_id, modal_size) {
	$rootScope.currentModal = $modal.open({
	    templateUrl : modal_id,
	    size : modal_size,
	    backdrop : true
	});
	$rootScope.deleteModalText = $scope.selectedGroup.id + ' ' + $scope.selectedGroup.name;
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'delete') {
		$sails.post('/securitygroups/destroy', {
		    id : $scope.selectedGroup.id
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedGroup = null;
			    $rootScope.group_modified = false;
			    $('#' + $scope.tableId).DataTable().ajax.reload(function() {
			    }, false);
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.saveGroup = function() {
	$('#securitygroup_form').valid();
	if ($rootScope.validator['securitygroup_form'].numberOfInvalids() > 0) { // error
	    return;
	}

	$sails.post('/securitygroups/savesecuritygroupandresources', {
	    securitygroup : $scope.group
	}).success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    if (data.success) {

		if (vm.groupWatcher != null) { // clears watcher.
		    vm.groupWatcher();
		}

		// $scope.group = angular.copy(vm.blank_group);
		// $scope.group.resources = resources;
		$scope.group.id = data.id;
		$scope.selectedGroup = angular.copy($scope.group);
		$rootScope.group_modified = false;
		$rootScope.validator['securitygroup_form'].resetForm();
		$('form#securitygroup_form .validate-has-error').removeClass('validate-has-error');
		$('#' + $scope.tableId).DataTable().ajax.reload(function() {
		}, false);
		$timeout(function() {
		    $rootScope.group_modified = false;
		    vm.groupWatcher = vm.getWatcher();
		}, 0);

	    }
	}).error(function(data) {
	    alert('err!');
	});
    }
}).controller(
    'UsersDatatable',
    function($scope, $rootScope, $timeout, $sails, $modal, DTOptionsBuilder, DTColumnBuilder) {
	this.blank_user = {
	    id : null,
	    username : null,
	    email : null,
	    firstname : null,
	    lastname : null,
	    active : true,
	    loginattempts : 0,
	    locale : 'en',
	    groups : []
	};
	$scope.user = angular.copy(this.blank_user);
	$rootScope.user_modified = false;
	$scope.selectedUser = null;
	var vm = this;
	var userWatcher = null;
	vm.rowClicked = rowClicked;
	vm.getWatcher = getWatcher;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/users/ajax',
	    type : 'POST'
	})
	// .withDataProp('data')
	.withOption('serverSide', false).withOption('processing', false).withOption('fnServerParams', function(aoData) {
	    // aoData.contact = $rootScope.search_contact;
	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function() {
		// $scope.$apply(function() {
		vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
		// });
	    });
	    if ($scope.selectedUser != null && aData.id == $scope.selectedUser.id) {
		$(nRow).addClass('selected');
	    }

	    return nRow;
	}).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"l>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
	// l length
	// r processing
	// f filtering
	// t table
	// i info
	// p pagination
	vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('username').withTitle('Username'), DTColumnBuilder.newColumn('email').withTitle('Email'), DTColumnBuilder.newColumn('firstname').withTitle('First Name'),
	    DTColumnBuilder.newColumn('lastname').withTitle('Last Name'), DTColumnBuilder.newColumn('active').withTitle('Active'), DTColumnBuilder.newColumn('loginattempts').withTitle('Login Attempts'), DTColumnBuilder.newColumn('locale').withTitle('Locale') ];

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    $scope.tableId = data.id; // Record table ID, for refreshes
	    // later.
	});

	function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    if (vm.userWatcher != null) {
		vm.userWatcher();
	    }
	    $sails.post('/users/getuserandgroups', {
		id : aData.id
	    }).success(function(response) {
		if (response.error != undefined) { // USER NO
		    // LONGER
		    // LOGGED
		    // IN!!!!!
		    location.reload(); // Will boot back to
		    // login
		    // screen
		}
		$timeout(function() {
		    $scope.user = response;
		    $rootScope.user_modified = false;
		    $scope.selectedUser = angular.copy(response);
		    $rootScope.validator[(($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form'].resetForm();
		    $('form#' + (($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form .validate-has-error').removeClass('validate-has-error');

		    vm.userWatcher = vm.getWatcher();
		}, 0);
	    }).error(function(data) {
		alert('err!');
	    });

	    $('tr').removeClass('selected');
	    $(nRow).addClass('selected');
	}

	function getWatcher() {
	    return $scope.$watch('user', function(newValue, oldValue) {
		if (!angular.equals(newValue, oldValue)) {
		    $timeout(function() {
			// $scope.user.is_modified = true;
			$rootScope.user_modified = true;
		    }, 0)
		}
	    }, true);
	}

	$scope.newUser = function() {
	    $sails.get('/security/getsecuritygroups').success(function(securitygroups) {
		if (securitygroups.error != undefined) { // USER NO
		    // LONGER
		    // LOGGED
		    // IN!!!!!
		    location.reload(); // Will boot back to
		    // login
		    // screen
		}
		if (vm.userWatcher != null) {
		    vm.userWatcher();
		}
		for ( var key in securitygroups) {
		    securitygroups[key].member = 0;
		}
		$timeout(function() {
		    $scope.selectedUser = null;
		    $('tr').removeClass('selected');
		    $scope.user = angular.copy(vm.blank_user);
		    $scope.user.groups = securitygroups;
		    $rootScope.user_modified = false;
		    $rootScope.validator[(($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form'].resetForm();
		    $('form#' + (($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form .validate-has-error').removeClass('validate-has-error');
		    $scope.selectedUser = angular.copy($scope.user);
		    vm.userWatcher = vm.getWatcher();
		}, 0);

	    });

	}

	$scope.isRequired = function() {
	    return 'required';
	}

	$scope.isNew = function() {
	    return ($scope.selectedUser == null || $scope.selectedUser.id == null);
	}

	$scope.deleteUser = function(modal_id, modal_size) {
	    $rootScope.currentModal = $modal.open({
		templateUrl : modal_id,
		size : modal_size,
		backdrop : true
	    });
	    $rootScope.deleteModalText = $scope.selectedUser.id + ' ' + $scope.selectedUser.username;
	    $rootScope.currentModal.result.then(function(selectedItem) {
	    }, function(triggerElement) {
		if (triggerElement == 'delete') {
		    $sails.post('/users/destroy', {
			id : $scope.selectedUser.id
		    }).success(function(data) {
			if (data.error != undefined) { // USER NO LONGER LOGGED
			    // IN!!!!!
			    location.reload(); // Will boot back to login
			    // screen
			}
			if (data.success) {
			    $timeout(function() {
				$scope.selectedUser = null;
				$rootScope.user_modified = false;
				$('#' + $scope.tableId).DataTable().ajax.reload(function() {
				}, false);
			    }, 0);
			}
		    }).error(function(data) {
			alert('err!');
		    });
		}
	    });
	}

	$scope.cancelUser = function() {
	    if (vm.userWatcher != null) {
		vm.userWatcher();
	    }
	    $('#users_table tr').removeClass('selected');
	    $timeout(function() {
		$rootScope.user_modified = false;
		$scope.selectedUser = null;
	    }, 0);
	}

	$scope.saveUser = function() {
	    $('#' + (($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form').valid();
	    if ($rootScope.validator[(($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form'].numberOfInvalids() > 0) { // error
		return;
	    }

	    $sails.post('/users/saveuserandgroups', {
		user : $scope.user
	    }).success(function(data) {
		if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		    location.reload(); // Will boot back to login screen
		}
		if (data.success) {
		    if ($scope.selectedUser.id == null) {
			if (vm.userWatcher != null) {
			    vm.userWatcher();
			}
			$sails.post('/users/getuserandgroups', {
			    id : data.userId
			}).success(function(response) {
			    if (response.error != undefined) { // USER NO
				// LONGER
				// LOGGED
				// IN!!!!!
				location.reload(); // Will boot back to
				// login
				// screen
			    }
			    $timeout(function() {
				$scope.user = response;
				$rootScope.user_modified = false;
				$scope.selectedUser = angular.copy(response);
				$rootScope.validator[(($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form'].resetForm();
				$('form#' + (($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form .validate-has-error').removeClass('validate-has-error');
				vm.userWatcher = vm.getWatcher();
				$('#' + $scope.tableId).DataTable().ajax.reload(function() {
				}, false);
				$timeout(function() {
				    $rootScope.user_modified = false;
				}, 0);
			    }, 0);
			}).error(function(data) {
			    alert('err!');
			});

			// $scope.selectedUser = angular.copy(vm.blank_user);
			// $scope.selectedUser.id = data.id;
		    } else {

			$('#' + $scope.tableId).DataTable().ajax.reload(function() {
			}, false);
			$timeout(function() {
			    $rootScope.user_modified = false;
			}, 0);
		    }

		}
	    }).error(function(data) {
		alert('err!');
	    });
	}

    }).controller('LoginCtrl', function($scope, $rootScope) {
    $rootScope.isLoginPage = true;
    $rootScope.isLightLoginPage = false;
    $rootScope.isLockscreenPage = false;
    $rootScope.isMainPage = false;
}).controller('FxChangeDatatable', function($scope, $rootScope, $timeout, $contact, DTOptionsBuilder, DTColumnBuilder, $sails, $modal) {

    var vm = this;
    $scope.selectedExChange = null;

    $rootScope.updateFxSuccess = false;

    vm.rowClicked = rowClicked;
    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	dataSrc : 'data',
	url : '/fxchange/ajax',
	type : 'POST'
    }).withOption('pageLength', 100).withOption('order', [ [ 3, "asc" ] ]).withOption('serverSide', true).withOption('processing', true).withOption('fnServerParams', function(aoData) {
	aoData.fxsearch = $rootScope.fxsearch;
	$timeout(function() { // Whenever the table searches, it clears
	    // the selected
	    if ($scope.retrieveId) { // passes through the selectedCode..
		$scope.selectedExChange = $scope.retrieveId;
		$scope.retrieveId = null;
	    } else {
		$scope.selectedExChange = null;
	    }
	}, 0);
    }).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	$('td', nRow).unbind('click');
	$('td', nRow).bind('click', function() {
	    // $scope.$apply(function() {
	    vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
	    // });
	});
	if ($scope.selectedExChange != null && aData.id == $scope.selectedExChange.id) {
	    $(nRow).addClass('selected');
	}
	return nRow;
    }).withPaginationType('full_numbers').withDOM('rt<"row"<"col-lg-4"i><"col-lg-8"p>>'); // <"row"<"col-xs-12"l>>
    // l length
    // r processing
    // f filtering
    // t table
    // i info
    // p pagination
    // DTColumnBuilder.newColumn('id').withTitle('ID'),
    vm.dtColumns = [ DTColumnBuilder.newColumn('currency_from').withTitle('From'), DTColumnBuilder.newColumn('currency_to').withTitle('To'), DTColumnBuilder.newColumn('exchange_rate').withTitle('Rate'), DTColumnBuilder.newColumn('date').withTitle('Date') ];

    $scope.$on('event:dataTableLoaded', function(event, data) {
	$scope.tableId = data.id; // Record table ID, for refreshes
	// later.
    });
    $rootScope.updateFxChangeDataTable = function(event, args) {
	if ($scope.tableId) {
	    $('#' + $scope.tableId).DataTable().ajax.reload(function() {
	    }, false);
	}
    }

    /*
     * $scope.$on('refreshContactsx', function(event, args){
     * //console.log('deb'); vm.contact = args;
     * $timeout(vm.dtOptions.reloadData,500); //(); });
     */

    function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	$('tr').removeClass('selected');
	$(nRow).addClass('selected');
	$timeout(function() {
	    $scope.selectedExChange = aData;
	}, 0);
    }

    $scope.isDatatableEditDisabled = function() {
	return $scope.selectedExChange == null;
    }

    $scope.editDatatableRow = function(modal_id, modal_size, modal_backdrop) {
	$sails.post("/fxchange/getdpexchange", {
	    id : $scope.selectedExChange.id
	}).success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    if (data.success) {
		// $rootScope.updateFxSuccess = false;
		$rootScope.modalSelectedExChange = angular.copy(data.dpexchange);
		$rootScope.currentModal = $modal.open({
		    templateUrl : modal_id,
		    size : modal_size,
		    backdrop : typeof modal_backdrop == 'undefined' ? true : modal_backdrop
		});
		$rootScope.currentModal.result.then(function(selectedItem) {
		}, function(triggerElement) {
		    if (triggerElement == 'save') {
			$sails.post('/fxchange/save', $rootScope.modalSelectedExChange).success(function(data) {
			    if (data.error != undefined) { // USER NO
				// LONGER LOGGED
				// IN!!!!!
				location.reload(); // Will boot back to
				// login screen
			    }
			    if (data.success) {
				$rootScope.updateFxSuccess = true;
				$scope.retrieveId = $scope.selectedExChange;
				$rootScope.updateFxChangeDataTable();
				$timeout(function() {
				    $rootScope.updateFxSuccess = false;
				}, 3000);
			    }
			}).error(function(data) {
			    alert('err!');
			});
		    }
		});
	    }
	}).error(function(data) {
	    alert('err!');
	});
    };

    $scope.deleteDatatableRow = function(modal_id, modal_size) {
	$rootScope.currentModal = $modal.open({
	    templateUrl : modal_id,
	    size : modal_size,
	    backdrop : true
	});
	$rootScope.deleteModalText = $scope.selectedExChange.id;// + ' ' +
	// $scope.selectedExChange.FIELD
	// + ' ' +
	// $scope.selectedCode.CODE
	// + ' ' +
	// $scope.selectedCode.DESC;
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'delete') {
		$sails.post('/fxchange/destroy', $scope.selectedExChange).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $rootScope.updateFxSuccess = true;
			    // $scope.retrieveId = $scope.selectedCode;
			    $rootScope.updateFxChangeDataTable();
			    $timeout(function() {
				$rootScope.updateFxSuccess = false;
			    }, 3000);
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.addDatatableRow = function(modal_id, modal_size) {
	$('#' + $scope.tableId).find('tr.selected').removeClass('selected');
	$scope.selectedExChange = null;
	$rootScope.modalSelectedExChange = {
	    id : null,
	    currency_from : $rootScope.fxsearch.field,
	    currency_to : 'U',
	    date : null,
	    exchange_rate : null
	};
	$rootScope.currentModal = $modal.open({
	    templateUrl : modal_id,
	    size : modal_size,
	    backdrop : typeof modal_backdrop == 'undefined' ? true : modal_backdrop
	});
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/fxchange/save', $rootScope.modalSelectedExChange).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $rootScope.updateFxSuccess = true;
			    // $scope.retrieveId = $scope.selectedCode;
			    $rootScope.updateFxChangeDataTable();
			    $timeout(function() {
				$rootScope.updateFxSuccess = false;
			    }, 3000);
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }
}).controller('LoginCtrl', function($scope, $rootScope) {
    $rootScope.isLoginPage = true;
    $rootScope.isLightLoginPage = false;
    $rootScope.isLockscreenPage = false;
    $rootScope.isMainPage = false;
}).controller(
    'DpCodesDatatable',
    function($scope, $rootScope, $timeout, $contact, DTOptionsBuilder, DTColumnBuilder, $sails, $modal) {

	var vm = this;
	$scope.selectedCode = null;
	$scope.dpcodes = [];

	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/dpcodes/ajax',
	    type : 'POST'
	})
	// .withDataProp('data')
	.withOption('serverSide', true).withOption('processing', true).withOption('fnServerParams', function(aoData) {
	    aoData.dpsearch = $rootScope.dpsearch;
	    $timeout(function() { // Whenever the table searches, it clears
		// the selected
		if ($scope.retrieveId) { // passes through the selectedCode..
		    $scope.selectedCode = $scope.retrieveId;
		    $scope.retrieveId = null;
		} else {
		    $scope.selectedCode = null;
		}
	    }, 0);
	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function() {
		// $scope.$apply(function() {
		vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
		// });
	    });
	    if ($scope.selectedCode != null && aData.id == $scope.selectedCode.id) {
		$(nRow).addClass('selected');
	    }
	    return nRow;
	}).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"l>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
	// l length
	// r processing
	// f filtering
	// t table
	// i info
	// p pagination
	vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('FIELD').withTitle('Field'), DTColumnBuilder.newColumn('CODE').withTitle('Code'), DTColumnBuilder.newColumn('DESC').withTitle('Description'),
	    DTColumnBuilder.newColumn('CATEGORY').withTitle('Category') ];

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    $scope.tableId = data.id; // Record table ID, for refreshes
	    // later.
	});
	$rootScope.updateDpCodesDataTable = function(event, args) {
	    if ($scope.tableId) {
		$('#' + $scope.tableId).DataTable().ajax.reload(function() {
		}, false);
	    }
	}

	/*
	 * $scope.$on('refreshContactsx', function(event, args){
	 * //console.log('deb'); vm.contact = args;
	 * $timeout(vm.dtOptions.reloadData,500); //(); });
	 */

	function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('tr').removeClass('selected');
	    $(nRow).addClass('selected');
	    $timeout(function() {
		$scope.selectedCode = aData;
	    }, 0);
	}

	$scope.isDatatableEditDisabled = function() {
	    return $scope.selectedCode == null;
	}

	$scope.editDatatableRow = function(modal_id, modal_size, modal_backdrop) {
	    $sails.post("/dpcodes/getdpcode", {
		id : $scope.selectedCode.id
	    }).success(function(data) {
		if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		    location.reload(); // Will boot back to login screen
		}
		if (data.success) {
		    $rootScope.modalSelectedCode = angular.copy(data.dpcode);
		    $rootScope.currentModal = $modal.open({
			templateUrl : modal_id,
			size : modal_size,
			backdrop : typeof modal_backdrop == 'undefined' ? true : modal_backdrop
		    });
		    $rootScope.currentModal.result.then(function(selectedItem) {
		    }, function(triggerElement) {
			if (triggerElement == 'save') {
			    $sails.post('/dpcodes/save', $rootScope.modalSelectedCode).success(function(data) {
				if (data.error != undefined) { // USER NO
				    // LONGER LOGGED
				    // IN!!!!!
				    location.reload(); // Will boot back to
				    // login screen
				}
				if (data.success) {
				    $scope.retrieveId = $scope.selectedCode;
				    $rootScope.updateDpCodesDataTable();
				}
			    }).error(function(data) {
				alert('err!');
			    });
			}
		    });
		}
	    }).error(function(data) {
		alert('err!');
	    });
	};

	$scope.deleteDatatableRow = function(modal_id, modal_size) {
	    $rootScope.currentModal = $modal.open({
		templateUrl : modal_id,
		size : modal_size,
		backdrop : true
	    });
	    $rootScope.deleteModalText = $scope.selectedCode.id + ' ' + $scope.selectedCode.FIELD + ' ' + $scope.selectedCode.CODE + ' ' + $scope.selectedCode.DESC;
	    $rootScope.currentModal.result.then(function(selectedItem) {
	    }, function(triggerElement) {
		if (triggerElement == 'delete') {
		    $sails.post('/dpcodes/destroy', $scope.selectedCode).success(function(data) {
			if (data.error != undefined) { // USER NO LONGER LOGGED
			    // IN!!!!!
			    location.reload(); // Will boot back to login
			    // screen
			}
			if (data.success) {
			    // $scope.retrieveId = $scope.selectedCode;
			    $rootScope.updateDpCodesDataTable();
			}
		    }).error(function(data) {
			alert('err!');
		    });
		}
	    });
	}

	$scope.addDatatableRow = function(modal_id, modal_size) {
	    $('#' + $scope.tableId).find('tr.selected').removeClass('selected');
	    $scope.selectedCode = null;
	    $rootScope.modalSelectedCode = {
		id : null,
		FIELD : $rootScope.dpsearch.field,
		CODE : null,
		DESC : null,
		CATEGORY : null
	    };
	    $rootScope.currentModal = $modal.open({
		templateUrl : modal_id,
		size : modal_size,
		backdrop : typeof modal_backdrop == 'undefined' ? true : modal_backdrop
	    });
	    $rootScope.currentModal.result.then(function(selectedItem) {
	    }, function(triggerElement) {
		if (triggerElement == 'save') {
		    $sails.post('/dpcodes/save', $rootScope.modalSelectedCode).success(function(data) {
			if (data.error != undefined) { // USER NO LONGER LOGGED
			    // IN!!!!!
			    location.reload(); // Will boot back to login
			    // screen
			}
			if (data.success) {
			    // $scope.retrieveId = $scope.selectedCode;
			    $rootScope.updateDpCodesDataTable();
			}
		    }).error(function(data) {
			alert('err!');
		    });
		}
	    });
	}
    }).controller('LoginCtrl', function($scope, $rootScope) {
    $rootScope.isLoginPage = true;
    $rootScope.isLightLoginPage = false;
    $rootScope.isLockscreenPage = false;
    $rootScope.isMainPage = false;
}).controller('LoginLightCtrl', function($scope, $rootScope) {
    $rootScope.isLoginPage = true;
    $rootScope.isLightLoginPage = true;
    $rootScope.isLockscreenPage = false;
    $rootScope.isMainPage = false;
}).controller('LockscreenCtrl', function($scope, $rootScope) {
    $rootScope.isLoginPage = false;
    $rootScope.isLightLoginPage = false;
    $rootScope.isLockscreenPage = true;
    $rootScope.isMainPage = false;
}).controller('MainCtrl', function($preloaded, $scope, $rootScope, $location, $layout, $layoutToggles, $pageLoadingBar, Fullscreen, $contact) {
    $rootScope.isLoginPage = false;
    $rootScope.isLightLoginPage = false;
    $rootScope.isLockscreenPage = false;
    $rootScope.isMainPage = true;

    $rootScope.layoutOptions = {
	horizontalMenu : {
	    isVisible : false,
	    isFixed : true,
	    minimal : false,
	    clickToExpand : false,

	    isMenuOpenMobile : false
	},
	sidebar : {
	    isVisible : true,
	    isCollapsed : false,
	    toggleOthers : true,
	    isFixed : true,
	    isRight : false,

	    isMenuOpenMobile : false,

	    // Added in v1.3
	    userProfile : true
	},
	chat : {
	    isOpen : false,
	},
	settingsPane : {
	    isOpen : false,
	    useAnimation : true
	},
	container : {
	    isBoxed : false
	},
	skins : {
	    sidebarMenu : '',
	    horizontalMenu : '',
	    userInfoNavbar : ''
	},
	pageTitles : true,
	userInfoNavVisible : false
    };

    $layout.loadOptionsFromCookies(); // remove this line if you don't want to
    // support cookies that remember layout
    // changes

    $scope.updatePsScrollbars = function() {
	var $scrollbars = jQuery(".ps-scrollbar:visible");

	$scrollbars.each(function(i, el) {
	    if (typeof jQuery(el).data('perfectScrollbar') == 'undefined') {
		jQuery(el).perfectScrollbar();
	    } else {
		jQuery(el).perfectScrollbar('update');
	    }
	})
    };

    // Define Public Vars
    public_vars.$body = jQuery("body");

    // Init Layout Toggles
    $layoutToggles.initToggles();

    // Other methods
    $scope.setFocusOnSearchField = function() {
	public_vars.$body.find('.search-form input[name="s"]').focus();

	setTimeout(function() {
	    public_vars.$body.find('.search-form input[name="s"]').focus()
	}, 100);
    };

    // Watch changes to replace checkboxes
    $scope.$watch(function() {
	cbr_replace();
    });

    // Watch sidebar status to remove the psScrollbar
    $rootScope.$watch('layoutOptions.sidebar.isCollapsed', function(newValue, oldValue) {
	if (newValue != oldValue) {
	    if (newValue == true) {
		public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('destroy')
	    } else {
		public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar({
		    wheelPropagation : public_vars.wheelPropagation
		});
	    }
	}
    });

    // Page Loading Progress (remove/comment this line to disable it)
    $pageLoadingBar.init();

    $scope.showLoadingBar = showLoadingBar;
    $scope.hideLoadingBar = hideLoadingBar;

    // Set Scroll to 0 When page is changed
    $rootScope.$on('$stateChangeStart', function() {
	if ($contact.is_modified) { // still modified-
	    // if(!confirm(unsavedMessage)){
	    var obj = {
		pos : $(window).scrollTop()
	    };
	    TweenLite.to(obj, .3, {
		pos : ($('#contact_form').length < 1) ? 0 : ($('#contact_form').offset().top - 8),
		ease : Power4.easeOut,
		onUpdate : function() {
		    $(window).scrollTop(obj.pos);
		}
	    });
	    // return;
	    // }else{
	    // $contact.is_modified = false;
	    // }
	} else if ($rootScope.user_modified) {
	    var obj = {
		pos : $(window).scrollTop()
	    };
	    TweenLite.to(obj, .3, {
		pos : ($('#' + (($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form').length < 1) ? 0 : ($('#' + (($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form').offset().top - 8),
		ease : Power4.easeOut,
		onUpdate : function() {
		    $(window).scrollTop(obj.pos);
		}
	    });
	}
    });

    // Full screen feature added in v1.3
    $scope.isFullscreenSupported = Fullscreen.isSupported();
    $scope.isFullscreen = Fullscreen.isEnabled() ? true : false;

    $scope.goFullscreen = function() {
	if (Fullscreen.isEnabled())
	    Fullscreen.cancel();
	else
	    Fullscreen.all();

	$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;
    }

}).controller('popupController', function($scope, $rootScope, $modal) {
    $rootScope.modalPopup = function(popup, cb) {
	$rootScope.popup = popup;
	$rootScope.popupModal = $modal.open({
	    templateUrl : 'popup-modal',
	    size : popup.size,
	    backdrop : true
	});
	$rootScope.popupModal.result.then(function(selectedItem) {
	}, cb);
    }
}).controller('SidebarMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state, $layout) {

    // Menu Items
    var $sidebarMenuItems = $menuItems.instantiate();

    $scope.menuItems = $sidebarMenuItems.prepareSidebarMenu().getAll();

    // Set Active Menu Item
    $sidebarMenuItems.setActive($location.path());

    $rootScope.$on('$stateChangeSuccess', function() {
	$sidebarMenuItems.setActive($state.current.name);
    });

    // Trigger menu setup
    public_vars.$sidebarMenu = public_vars.$body.find('.sidebar-menu');
    $timeout(setup_sidebar_menu, .1);

    ps_init(); // perfect scrollbar for sidebar
}).controller('HorizontalMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state) {
    var $horizontalMenuItems = $menuItems.instantiate();

    $scope.menuItems = $horizontalMenuItems.prepareHorizontalMenu().getAll();

    // Set Active Menu Item
    $horizontalMenuItems.setActive($location.path());

    $rootScope.$on('$stateChangeSuccess', function() {
	$horizontalMenuItems.setActive($state.current.name);

	$(".navbar.horizontal-menu .navbar-nav .hover").removeClass('hover'); // Close
	// Submenus
	// when
	// item
	// is
	// selected
    });

    // Trigger menu setup
    $timeout(setup_horizontal_menu, 1);
}).controller('SettingsPaneCtrl', function($rootScope) {
    // Define Settings Pane Public Variable
    public_vars.$settingsPane = public_vars.$body.find('.settings-pane');
    public_vars.$settingsPaneIn = public_vars.$settingsPane.find('.settings-pane-inner');
}).controller('ChatCtrl', function($scope, $element) {
    var $chat = jQuery($element), $chat_conv = $chat.find('.chat-conversation');

    $chat.find('.chat-inner').perfectScrollbar(); // perfect scrollbar for
    // chat container

    // Chat Conversation Window (sample)
    $chat.on('click', '.chat-group a', function(ev) {
	ev.preventDefault();

	$chat_conv.toggleClass('is-open');

	if ($chat_conv.is(':visible')) {
	    $chat.find('.chat-inner').perfectScrollbar('update');
	    $chat_conv.find('textarea').autosize();
	}
    });

    $chat_conv.on('click', '.conversation-close', function(ev) {
	ev.preventDefault();

	$chat_conv.removeClass('is-open');
    });
}).controller('UIModalsCtrl', function($scope, $rootScope, $modal, $sce) {
    // Open Simple Modal
    $scope.openModal = function(modal_id, modal_size, modal_backdrop) {
	$rootScope.currentModal = $modal.open({
	    templateUrl : modal_id,
	    size : modal_size,
	    backdrop : typeof modal_backdrop == 'undefined' ? true : modal_backdrop
	});
    };

    // Loading AJAX Content
    $scope.openAjaxModal = function(modal_id, url_location) {
	$rootScope.currentModal = $modal.open({
	    templateUrl : modal_id,
	    resolve : {
		ajaxContent : function($http) {
		    return $http.get(url_location).then(function(response) {
			$rootScope.modalContent = $sce.trustAsHtml(response.data);
		    }, function(response) {
			$rootScope.modalContent = $sce.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>');
		    });
		}
	    }
	});

	$rootScope.modalContent = $sce.trustAsHtml('Modal content is loading...');
    }
}).controller('PaginationDemoCtrl', function($scope) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function(pageNo) {
	$scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
	console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
}).controller('LayoutVariantsCtrl', function($scope, $layout, $cookies) {
    $scope.opts = {
	sidebarType : null,
	fixedSidebar : null,
	sidebarToggleOthers : null,
	sidebarVisible : null,
	sidebarPosition : null,

	horizontalVisible : null,
	fixedHorizontalMenu : null,
	horizontalOpenOnClick : null,
	minimalHorizontalMenu : null,

	sidebarProfile : null
    };

    $scope.sidebarTypes = [ {
	value : [ 'sidebar.isCollapsed', false ],
	text : 'Expanded',
	selected : $layout.is('sidebar.isCollapsed', false)
    }, {
	value : [ 'sidebar.isCollapsed', true ],
	text : 'Collapsed',
	selected : $layout.is('sidebar.isCollapsed', true)
    }, ];

    $scope.fixedSidebar = [ {
	value : [ 'sidebar.isFixed', true ],
	text : 'Fixed',
	selected : $layout.is('sidebar.isFixed', true)
    }, {
	value : [ 'sidebar.isFixed', false ],
	text : 'Static',
	selected : $layout.is('sidebar.isFixed', false)
    }, ];

    $scope.sidebarToggleOthers = [ {
	value : [ 'sidebar.toggleOthers', true ],
	text : 'Yes',
	selected : $layout.is('sidebar.toggleOthers', true)
    }, {
	value : [ 'sidebar.toggleOthers', false ],
	text : 'No',
	selected : $layout.is('sidebar.toggleOthers', false)
    }, ];

    $scope.sidebarVisible = [ {
	value : [ 'sidebar.isVisible', true ],
	text : 'Visible',
	selected : $layout.is('sidebar.isVisible', true)
    }, {
	value : [ 'sidebar.isVisible', false ],
	text : 'Hidden',
	selected : $layout.is('sidebar.isVisible', false)
    }, ];

    $scope.sidebarPosition = [ {
	value : [ 'sidebar.isRight', false ],
	text : 'Left',
	selected : $layout.is('sidebar.isRight', false)
    }, {
	value : [ 'sidebar.isRight', true ],
	text : 'Right',
	selected : $layout.is('sidebar.isRight', true)
    }, ];

    $scope.horizontalVisible = [ {
	value : [ 'horizontalMenu.isVisible', true ],
	text : 'Visible',
	selected : $layout.is('horizontalMenu.isVisible', true)
    }, {
	value : [ 'horizontalMenu.isVisible', false ],
	text : 'Hidden',
	selected : $layout.is('horizontalMenu.isVisible', false)
    }, ];

    $scope.fixedHorizontalMenu = [ {
	value : [ 'horizontalMenu.isFixed', true ],
	text : 'Fixed',
	selected : $layout.is('horizontalMenu.isFixed', true)
    }, {
	value : [ 'horizontalMenu.isFixed', false ],
	text : 'Static',
	selected : $layout.is('horizontalMenu.isFixed', false)
    }, ];

    $scope.horizontalOpenOnClick = [ {
	value : [ 'horizontalMenu.clickToExpand', false ],
	text : 'No',
	selected : $layout.is('horizontalMenu.clickToExpand', false)
    }, {
	value : [ 'horizontalMenu.clickToExpand', true ],
	text : 'Yes',
	selected : $layout.is('horizontalMenu.clickToExpand', true)
    }, ];

    $scope.minimalHorizontalMenu = [ {
	value : [ 'horizontalMenu.minimal', false ],
	text : 'No',
	selected : $layout.is('horizontalMenu.minimal', false)
    }, {
	value : [ 'horizontalMenu.minimal', true ],
	text : 'Yes',
	selected : $layout.is('horizontalMenu.minimal', true)
    }, ];

    $scope.chatVisibility = [ {
	value : [ 'chat.isOpen', false ],
	text : 'No',
	selected : $layout.is('chat.isOpen', false)
    }, {
	value : [ 'chat.isOpen', true ],
	text : 'Yes',
	selected : $layout.is('chat.isOpen', true)
    }, ];

    $scope.boxedContainer = [ {
	value : [ 'container.isBoxed', false ],
	text : 'No',
	selected : $layout.is('container.isBoxed', false)
    }, {
	value : [ 'container.isBoxed', true ],
	text : 'Yes',
	selected : $layout.is('container.isBoxed', true)
    }, ];

    $scope.sidebarProfile = [ {
	value : [ 'sidebar.userProfile', false ],
	text : 'No',
	selected : $layout.is('sidebar.userProfile', false)
    }, {
	value : [ 'sidebar.userProfile', true ],
	text : 'Yes',
	selected : $layout.is('sidebar.userProfile', true)
    }, ];

    $scope.resetOptions = function() {
	$layout.resetCookies();
	window.location.reload();
    };

    var setValue = function(val) {
	if (val != null) {
	    val = eval(val);
	    $layout.setOptions(val[0], val[1]);
	}
    };

    $scope.$watch('opts.sidebarType', setValue);
    $scope.$watch('opts.fixedSidebar', setValue);
    $scope.$watch('opts.sidebarToggleOthers', setValue);
    $scope.$watch('opts.sidebarVisible', setValue);
    $scope.$watch('opts.sidebarPosition', setValue);

    $scope.$watch('opts.horizontalVisible', setValue);
    $scope.$watch('opts.fixedHorizontalMenu', setValue);
    $scope.$watch('opts.horizontalOpenOnClick', setValue);
    $scope.$watch('opts.minimalHorizontalMenu', setValue);

    $scope.$watch('opts.chatVisibility', setValue);

    $scope.$watch('opts.boxedContainer', setValue);

    $scope.$watch('opts.sidebarProfile', setValue);
}).controller('ThemeSkinsCtrl', function($scope, $layout) {
    var $body = jQuery("body");

    $scope.opts = {
	sidebarSkin : $layout.get('skins.sidebarMenu'),
	horizontalMenuSkin : $layout.get('skins.horizontalMenu'),
	userInfoNavbarSkin : $layout.get('skins.userInfoNavbar')
    };

    $scope.skins = [ {
	value : '',
	name : 'Default',
	palette : [ '#2c2e2f', '#EEEEEE', '#FFFFFF', '#68b828', '#27292a', '#323435' ]
    }, {
	value : 'aero',
	name : 'Aero',
	palette : [ '#558C89', '#ECECEA', '#FFFFFF', '#5F9A97', '#558C89', '#255E5b' ]
    }, {
	value : 'navy',
	name : 'Navy',
	palette : [ '#2c3e50', '#a7bfd6', '#FFFFFF', '#34495e', '#2c3e50', '#ff4e50' ]
    }, {
	value : 'facebook',
	name : 'Facebook',
	palette : [ '#3b5998', '#8b9dc3', '#FFFFFF', '#4160a0', '#3b5998', '#8b9dc3' ]
    }, {
	value : 'turquoise',
	name : 'Truquoise',
	palette : [ '#16a085', '#96ead9', '#FFFFFF', '#1daf92', '#16a085', '#0f7e68' ]
    }, {
	value : 'lime',
	name : 'Lime',
	palette : [ '#8cc657', '#ffffff', '#FFFFFF', '#95cd62', '#8cc657', '#70a93c' ]
    }, {
	value : 'green',
	name : 'Green',
	palette : [ '#27ae60', '#a2f9c7', '#FFFFFF', '#2fbd6b', '#27ae60', '#1c954f' ]
    }, {
	value : 'purple',
	name : 'Purple',
	palette : [ '#795b95', '#c2afd4', '#FFFFFF', '#795b95', '#27ae60', '#5f3d7e' ]
    }, {
	value : 'white',
	name : 'White',
	palette : [ '#FFFFFF', '#666666', '#95cd62', '#EEEEEE', '#95cd62', '#555555' ]
    }, {
	value : 'concrete',
	name : 'Concrete',
	palette : [ '#a8aba2', '#666666', '#a40f37', '#b8bbb3', '#a40f37', '#323232' ]
    }, {
	value : 'watermelon',
	name : 'Watermelon',
	palette : [ '#b63131', '#f7b2b2', '#FFFFFF', '#c03737', '#b63131', '#32932e' ]
    }, {
	value : 'lemonade',
	name : 'Lemonade',
	palette : [ '#f5c150', '#ffeec9', '#FFFFFF', '#ffcf67', '#f5c150', '#d9a940' ]
    }, ];

    $scope.$watch('opts.sidebarSkin', function(val) {
	if (val != null) {
	    $layout.setOptions('skins.sidebarMenu', val);

	    $body.attr('class', $body.attr('class').replace(/\sskin-[a-z]+/)).addClass('skin-' + val);
	}
    });

    $scope.$watch('opts.horizontalMenuSkin', function(val) {
	if (val != null) {
	    $layout.setOptions('skins.horizontalMenu', val);

	    $body.attr('class', $body.attr('class').replace(/\shorizontal-menu-skin-[a-z]+/)).addClass('horizontal-menu-skin-' + val);
	}
    });

    $scope.$watch('opts.userInfoNavbarSkin', function(val) {
	if (val != null) {
	    $layout.setOptions('skins.userInfoNavbar', val);

	    $body.attr('class', $body.attr('class').replace(/\suser-info-navbar-skin-[a-z]+/)).addClass('user-info-navbar-skin-' + val);
	}
    });
}).
// Added in v1.3
controller('FooterChatCtrl', function($scope, $element) {
    $scope.isConversationVisible = false;

    $scope.toggleChatConversation = function() {
	$scope.isConversationVisible = !$scope.isConversationVisible;

	if ($scope.isConversationVisible) {
	    setTimeout(function() {
		var $el = $element.find('.ps-scrollbar');

		if ($el.hasClass('ps-scroll-down')) {
		    $el.scrollTop($el.prop('scrollHeight'));
		}

		$el.perfectScrollbar({
		    wheelPropagation : false
		});

		$element.find('.form-control').focus();

	    }, 300);
	}
    }
});