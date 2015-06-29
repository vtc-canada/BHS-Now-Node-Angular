'use strict';
angular.module('xenon.controllers.inventory', [])

.controller('InventorySection', function($scope, $rootScope, $timeout, $filter, $state, $modal, $sails, Utility) { // $contact,
    $scope.helpers = public_vars.helpers;
    var vm = this;
    vm.blockInventorySelectedModified = false;

    $scope.getPledgeBalance = function(donation) {
	if ($scope.showPledgeBalance(donation)) {
	    return (donation.PLEDAMT - donation.PAIDAMT);
	}
	return '';
    }
    $scope.showPledgeBalance = function(donation) {
	return (donation.PLEDSCHED == 2 || donation.PLEDSCHED == 3 || donation.PLEDSCHED == 4 || donation.PLEDSCHED == 5);
    }

    $rootScope.clearInventory = function() {
	vm.watchEnabled = false;
	$scope.selectedInventory = null; // sets is_saving and is_deleting to
	// false.
//	$contact.is_modified = false;
	// $scope.contact = $contact; // copies in blank contact when changing
	// search parameters

	resetInventoryForms();
    }

    $scope.getInventorySummaryButtonText = function() {

	if ($scope.selectedInventory == null || !$scope.isDpInventorySummaryDeleted()) {
	    return 'Delete';
	}
	return 'Restore';
    }

    $scope.addInventorySummary = function() {
	// $scope.selectedInventory

	var newInventory = {
	    id : "new",
	    
	};

	// $scope.tryDestroyDataTable('dpordersummary');
	// $scope.contact.dpordersummary.push(newOrder);//
	// $scope.selectedInventory);

	$scope.selectedInventory = newInventory;
	// $scope.rebindOrderSummaryDataTable();

	// "LASTPAGE":null,"PRINFLAG":1,"TSRECID":"C00012220","TSDATE":"20120626","TSTIME":"132058","TSCHG":"A","TSBASE":"A","TSLOCAT":"C","TSIDCODE":"KJ",

	// "DONOR":1000004 set donor in controller..

	// $scope.dpordersummary.
	// alert('a');
    }

    $scope.getLEXT = function(row) {
	return $filter('currency')(row.LPRICE * row.LQTY, '$', 2);

    };

   
	// "TSRECID":"C00019635","TSDATE":"20041028","TSTIME":"134819","TSCHG":"A","TSBASE":"A","TSLOCAT":"C","TSIDCODE":"HMC"})
	// non-use columns
	// ORDNUMD:null,"PAGED":"01","LINED":"01","DONORD":1000004,"SQTY":1,"BQTY":0,

	// id : 'new',
	// tempId : Math.floor((Math.random() * 100000) + 1),
//    }

    

    $scope.$watch('selectedInventory', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    if ($rootScope.currencies && $scope.selectedInventory != null && $rootScope.currencies[$scope.selectedInventory.FUNDS]) {
		$scope.fundsSymbol = $rootScope.currencies[$scope.selectedInventory.FUNDS].symbol;
	    }
	    if (vm.blockInventorySelectedModified) {
		vm.blockInventorySelectedModified = false;
	    } else {
		if ($scope.selectedInventory) {
		    $scope.selectedInventory.is_modified = true;
		}

		// TODO : BLOCK THIS IF IT's opening some old order with
		// previous
		// shipping calculating values..- based on date basically....
		if ($scope.selectedInventory != null) {
//		    var etotal = 0;
//		    var hstcalc = 0;
//		    var gstcalc = 0;
//		    var pstcalc = 0;
//		    var shiptax = 0;
//
//		    var exchangerate = 1;
//		    if ($scope.selectedInventory.FUNDS != null) {
//			for ( var key in $rootScope.exchange[$scope.selectedInventory.FUNDS]) {
//			    if ($rootScope.exchange[$scope.selectedInventory.FUNDS].hasOwnProperty(key)) {
//				//
//				if (new Date(key).getTime() >= new Date($scope.selectedInventory.DATE).getTime()) {
//				    exchangerate = $rootScope.exchange[$scope.selectedInventory.FUNDS][key];
//				    break;
//				}
//
//			    }
//			}
//		    }
//
//		    if ($scope.selectedInventory.FUNDS != 'C') { // forces
//			// canadian
//			// taxes off
//			$scope.selectedInventory.HST = 'N';
//			$scope.selectedInventory.GST = 'N';
//			$scope.selectedInventory.PST = 'N';
//		    } else if ($scope.lastOrderFunds != 'C') { // from another
//			// currency
//			$scope.selectedInventory.HST = 'Y';
//			$scope.selectedInventory.GST = 'N';
//			$scope.selectedInventory.PST = 'N';
//		    }
//		    if ($scope.lastOrderFunds != $scope.selectedInventory.FUNDS && $scope.selectedInventory.FUNDS != 'C' && $scope.selectedInventory.FUNDS != 'U') { // foreign
//			$scope.selectedInventory.SANDH = 'N'; // manual
//		    } else if ($scope.lastOrderFunds != $scope.selectedInventory.FUNDS && ($scope.selectedInventory.FUNDS == 'C' || $scope.selectedInventory.FUNDS == 'U')) { // american/canadian
//			$scope.selectedInventory.SANDH = 'Y'; // auto
//		    }
//
//		    $scope.lastOrderFunds = $scope.selectedInventory.FUNDS;
//
//		    angular.forEach($scope.selectedInventory.dporderdetails, function(detail) {
//
//			var itemp = parseInt(detail.LQTY) * parseFloat(detail.LPRICE) * (1 - (parseInt(detail.LDISC) / 100));
//
//			etotal += itemp; // sums up item price
//
//			var hstrate = $scope.selectedInventory.HST == 'Y' ? 0.13 : 0;
//			var gstrate = $scope.selectedInventory.GST == 'Y' ? 0.08 : 0;
//			var pstrate = $scope.selectedInventory.PST == 'Y' ? 0.07 : 0;
//			if (detail.LITEMP != null && detail.LITEMP.indexOf('B') === 0) {
//			    hstrate = $scope.selectedInventory.HST == 'Y' ? 0.05 : 0; // GST
//			    // portion
//			    // (8%)
//			    // reduced
//			    // off,
//			    // leaving
//			    // it
//			    // 5%
//			    // as
//			    // before.
//			    gstrate = 0; // GST not counted on books
//			    pstrate = $scope.selectedInventory.PST == 'Y' ? 0.05 : 0; // PST
//			    // used
//			    // to
//			    // be
//			    // reduced
//			    // to
//			    // .05
//			    // i
//			    // believe
//			    // for
//			    // books
//			}
//
//			hstcalc += (itemp / exchangerate) * hstrate; // sums
//			// up
//			// item
//			// taxes
//			gstcalc += (itemp / exchangerate) * gstrate;
//			pstcalc += (itemp / exchangerate) * pstrate;
//
//		    });
//
//		    $scope.selectedInventory.ETOTAL = etotal;
//
//		    $scope.selectedInventory.ECONV = etotal / parseFloat(exchangerate);
//
//		    var eship = 0;
//		    if ($scope.selectedInventory.SANDH == 'Y') {
//			if ($scope.selectedInventory.FUNDS == 'C') {
//			    if ($scope.selectedInventory.ETOTAL < 10) {
//				eship = 4.50;
//			    } else if ($scope.selectedInventory.ETOTAL < 25) {
//				eship = 6.50;
//			    } else if ($scope.selectedInventory.ETOTAL < 50) {
//				eship = 8.50;
//			    } else if ($scope.selectedInventory.ETOTAL < 75) {
//				eship = 10.50;
//			    } else if ($scope.selectedInventory.ETOTAL < 100) {
//				eship = 12.00;
//			    } else {
//				eship = $scope.selectedInventory.ECONV * 0.15;
//			    }
//			} else if ($scope.selectedInventory.FUNDS == 'U') {
//			    if ($scope.selectedInventory.ETOTAL < 10) {
//				eship = 4.50;
//			    } else if ($scope.selectedInventory.ETOTAL < 25) {
//				eship = 6.00;
//			    } else if ($scope.selectedInventory.ETOTAL < 50) {
//				eship = 7.00;
//			    } else if ($scope.selectedInventory.ETOTAL < 75) {
//				eship = 9.00;
//			    } else if ($scope.selectedInventory.ETOTAL < 100) {
//				eship = 10.00;
//			    } else {
//				eship = $scope.selectedInventory.ECONV * 0.12;
//			    }
//			}
//			$scope.selectedInventory.SANDHAMT = 0;
//		    } else {
//			eship = $scope.selectedInventory.SANDHAMT;
//		    }
//
//		    $scope.selectedInventory.ESHIP = eship;
//
//		    // Add tax to shipping component.
//		    var hstrate = $scope.selectedInventory.HST == 'Y' ? 0.13 : 0;
//		    var gstrate = $scope.selectedInventory.GST == 'Y' ? 0.08 : 0;
//		    var pstrate = $scope.selectedInventory.PST == 'Y' ? 0.07 : 0;
//
//		    hstcalc += eship * hstrate;
//		    gstcalc += eship * gstrate;
//		    pstcalc += eship * pstrate;
//
//		    $scope.selectedInventory.HSTCALC = hstcalc;
//		    $scope.selectedInventory.GSTCALC = gstcalc;
//		    $scope.selectedInventory.PSTCALC = pstcalc;
//
//		    // Currency has to be in US dollars and COUNTY must be set
//		    // to have NY tax
//		    $scope.selectedInventory.NYTAX = ($scope.selectedInventory.COUNTY == null || $scope.selectedInventory.FUNDS != 'U' ? 0 : $rootScope.county_rates[$scope.selectedInventory.COUNTY]);
//		    $scope.selectedInventory.NYTCALC = ($scope.selectedInventory.ECONV + $scope.selectedInventory.ESHIP) * ($scope.selectedInventory.NYTAX / 100);
//
//		    $scope.selectedInventory.GTOTAL = $scope.selectedInventory.ECONV + $scope.selectedInventory.ESHIP + $scope.selectedInventory.HSTCALC + $scope.selectedInventory.GSTCALC + $scope.selectedInventory.PSTCALC + $scope.selectedInventory.NYTCALC;

		}
	    }

	}

    }, true);

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
		    if ($state.current.name == 'app.inventory') { // blocks
			// lagging
			// updates
			// when
			// we've
			// already
			// left the
			// screen.
			
			//$contact.is_modified = $scope.is_modified = true;
		    }
		}, 0);
	    }, 10);

	}
    }

    // $scope.$watchCollection('contact', $scope.tryModified,true);
    // $scope.$watch('contact.otherAddresses', $scope.tryModified,true);
    // $scope.$watchCollection('otherAddresses', $scope.tryModified);
    $scope.$watch('selectedInventory', $scope.tryModified, true);

    $rootScope.$on("getinventory", function(args, message) {
	$timeout(function() {
	    vm.watchEnabled = false;
	    if (message.id == 'new') {
		// $scope.selectedTransaction = null; // wipes
		// for ( var key in $scope.selectedDataTableRow) { // iterate
		// // destroying
		// // datatables!
		// $scope.tryDestroyDataTable(key);
		// }
		// $contact.init();
		// $contact.id = 'new';
		// resetOrderForms();
		// $timeout(function() {
		// $(window).scrollTop($('.order-form').offset().top - 8);
		// for ( var key in $scope.selectedDataTableRow) { // iterate
		// // destroying
		// // datatables!
		// $scope.rebindDataTable(key);
		// }
		// }, 0);
	    } else {
		$sails.post("/inventory/getinventory", {
		    id : message.id
		}).success(function(data) {

		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedInventory = angular.copy(data.inventory);
//			    $scope.selectedInventory.is_modified = $contact.is_modified = false;
			    vm.blockInventorySelectedModified = true; // blocks
			    // change
			    // event on

			    // selectedInventory watcher

			    // $contact.set(data.contact);
			    // resetInventoryForms();
			    $timeout(function() {
				$(window).scrollTop($('.inventory-form').offset().top - 8);
			    }, 100);
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    });

    $scope.exportInventory = function() {
	if (typeof ($rootScope.ship_name) == 'undefined') {
	    return;
	}

	$rootScope.currentModal = $modal.open({
	    templateUrl : 'export-inventory-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.exporting_inventory = true;
	var exportInventory = angular.copy($scope.selectedInventory);
	exportInventory.timezoneoffset = new Date().getTimezoneOffset(); // gets
	// client
	// timezone
	
	
	$sails.post('/inventory/export_inventory', {
	    inventory : exportInventory
	}).success(function(response) {
	    if (response.error != undefined) { // USER NO LONGER
		// LOGGEDIN!!!!!
		location.reload(); // Will boot back to login screen
	    }
	    $timeout(function() {
		// $rootScope.pdfurl = response.pdfurl;
		$rootScope.inventory_export_pdf = response.pdfurl;
		delete $rootScope.exporting_inventory;
	    }, 0);
	});
    }

    $scope.saveInventory = function(tab) {
	$timeout(function() {
	    // Order it, so we check the tabs in a sensible manner.

	    var founderrors = false;
	    $('#' + "fullinventory").valid(); // this was blocked at some
	    // point for some reason..
	    // }
	    if ($rootScope.validator["fullinventory"].numberOfInvalids() > 0) { // error
		founderrors = true;
		// error'd tab
	    }

	    if (!founderrors) {
		// $scope.contact.otherAddresses =
		// $scope.otherAddresses;
		// delete $scope.contact.initDtVols1;
		delete $scope.selectedInventory.is_saving;
		delete $scope.selectedInventory.is_deleting;
		$sails.post("/inventory/save", $scope.selectedInventory).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			// for ( var key in $scope.selectedDataTableRow) { //
			// iterate
			// // destroying
			// // datatables!
			// $scope.tryDestroyDataTable(key);
			// }
			// $scope.tryDestroyDataTable('dpordersummary');

			$timeout(function() {

			    // $scope.selectedInventory =
			    // angular.copy(data.order);
			    delete $scope.selectedInventory.is_saving;
//			    $contact.is_modified = $scope.selectedInventory.is_modified = false;// .set(data.contact);
			    // //
			    // sets
			    // is_saving
			    // to
			    vm.blockInventorySelectedModified = true; // ?? not
			    // sure if
			    // this
			    // needs to
			    // be here.

			    // false.
			    resetInventoryForms();
			    $rootScope.updateInventoryDataTable();
			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});

		$scope.selectedInventory.is_saving = true;
	    }
	}, 0);
    }
    function resetInventoryForms() {
	// $scope.$apply(function() {
	vm.watchEnabled = false;
	// $scope.contact = $contact; // this applies the contact to the
	// scope..
	// seems needed a bunch verified.
	// $scope.otherAddresses = $contact.otherAddresses;
	// if (vm.screenLoaded) {
	// angular.forEach(vm.tabs, function(tabval) {
	if ($('form#' + "fullinventory").length > 0 && $rootScope.validator && $rootScope.validator["fullinventory"]) {
	    $rootScope.validator["fullinventory"].resetForm();
	    $('form#' + "fullinventory" + ' .validate-has-error').removeClass('validate-has-error');
	}
	// });

	// } else {
	// vm.screenLoaded = true;
	// }
    }

    $rootScope.getInventorySelectedInventory = function() {
	return $scope.selectedInventory;
    };

})

.controller('InventorySearch', function($scope, $rootScope, $modal, $sails, $timeout) { //$contact
    var vm = this;

    var blankSearch = { // #ORDER_SEARCH_PARAMETER
	id : ''
    };

    $scope.inventory = angular.copy(blankSearch);

    $scope.template = null;
    $rootScope.newInventoryTemplateModal = {
	name : null
    };
    $rootScope.shortSelectOptions = {
	minimumInputLength : 1
    };
    $rootScope.longSelectOptions = {
	minimumInputLength : 2
    };

    // initialization routine.
    (function() {

//	$rootScope.staticyesno = [ {
//	    id : 'Y',
//	    label : 'Yes'
//	}, {
//	    id : 'N',
//	    label : 'No'
//	} ];
//	$rootScope.order_types = [ {
//	    id : 1,
//	    label : 'Sale'
//	}, {
//	    id : 2,
//	    label : 'Free Gift'
//	} ];
//
//	$sails.get('/donortracker/getordersattributes').success(function(data) {
//	    if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
//		location.reload(); // Will boot back to login screen
//	    }
//	    var data = data.result;
//
//	    $rootScope.litems = [];
//	    $rootScope.litemdetails = {};
//	    for (var i = 0; i < data.litems.length; i++) {
//		$rootScope.litems.push({
//		    id : data.litems[i].CODE,
//		    label : data.litems[i].CODE + " - " + data.litems[i].DESC
//		});
//		$rootScope.litemdetails[data.litems[i].CODE] = {
//		    description : data.litems[i].DESC,
//		    price : data.litems[i].OTHER
//		};
//	    }
//
//	    $rootScope.label_sols = {};
//	    $rootScope.sols = [];
//	    for (var i = 0; i < data.sols.length; i++) {
//		$rootScope.sols.push({
//		    id : data.sols[i].CODE,
//		    label : data.sols[i].CODE
//		});
//		$rootScope.label_sols[data.sols[i].CODE] = data.sols[i].CODE + ' - ' + data.sols[i].DESC;
//	    }
//
//	    $rootScope.ship_from = [];
//	    $rootScope.ship_name = {};
//	    for (var i = 0; i < data.ship_from.length; i++) {
//		$rootScope.ship_from.push({
//		    id : data.ship_from[i].CODE,
//		    label : data.ship_from[i].CODE + " - " + data.ship_from[i].DESC
//		});
//		$scope.ship_name[data.ship_from[i].CODE] = data.ship_from[i].DESC;
//	    }
//
//	    $rootScope.exchange = angular.copy(data.exchange);
//
//	    $rootScope.titles = [];
//	    for (var i = 0; i < data.titles.length; i++) {
//		$rootScope.titles.push({
//		    id : data.titles[i].TITLE,
//		    label : data.titles[i].TITLE
//		});
//	    }
//	    $rootScope.states = [];
//	    for (var i = 0; i < data.states.length; i++) {
//		$rootScope.states.push({
//		    id : data.states[i].CODE,
//		    label : data.states[i].CODE
//		});
//	    }
//
//	    $rootScope.address_types = [];
//	    for (var i = 0; i < data.address_types.length; i++) {
//		$rootScope.address_types.push({
//		    id : data.address_types[i].CODE,
//		    label : data.address_types[i].CODE
//		});
//	    }
//	    $rootScope.countries = [];
//	    for (var i = 0; i < data.countries.length; i++) {
//		$rootScope.countries.push({
//		    id : data.countries[i].CODE,
//		    label : data.countries[i].CODE
//		});
//	    }
//	    $rootScope.county_rates = {};
//
//	    $rootScope.county_codes = [];
//	    for (var i = 0; i < data.county_codes.length; i++) {
//		$rootScope.county_codes.push({
//		    id : data.county_codes[i].CODE,
//		    label : data.county_codes[i].CODE
//		});
//		$rootScope.county_rates[data.county_codes[i].CODE] = data.county_codes[i].MCAT_LO;
//	    }
//	    $rootScope.phone_types = [];
//	    for (var i = 0; i < data.phone_types.length; i++) {
//		$rootScope.phone_types.push({
//		    id : data.phone_types[i].CODE,
//		    label : data.phone_types[i].CODE
//		});
//	    }
//
//	    $rootScope.currency_format = {};
//
//	    $rootScope.all_currencies = [];
//	    $rootScope.non_us_currencies = [];
//	    $rootScope.currencies = {};
//	    for (var i = 0; i < data.currencies.length; i++) {
//		$rootScope.currencies[data.currencies[i].id] = {
//		    name : data.currencies[i].name,
//		    code : data.currencies[i].code,
//		    symbol : data.currencies[i].symbol
//		}
//		$rootScope.currency_format[data.currencies[i].id] = {
//		    name : data.currencies[i].name,
//		    code : data.currencies[i].code
//		};
//		$rootScope.all_currencies.push({
//		    id : data.currencies[i].id,
//		    label : data.currencies[i].name
//		});
//		if (data.currencies[i].id == 'U') {
//		    continue;
//		}
//		$rootScope.non_us_currencies.push({
//		    id : data.currencies[i].id,
//		    selector_label : data.currencies[i].name + ' to United States Dollar',
//		    label : data.currencies[i].name
//		});
//
//	    }
//
//	});

	$sails.get('/template/inventory').success(function(data) {
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

    $scope.searchInventory = function() {
	var unsavedMessage = 'You have unsaved changes pending.  Are you sure you want to discard these changes? Press Cancel to go back and save your changes.';

	if (false){//$contact.is_modified) {
	    if (!confirm(unsavedMessage)) {
		// $contact.is_modified = false;
		// } else {
		var obj = {
		    pos : $(window).scrollTop()
		};
		TweenLite.to(obj, 0.3, {
		    pos : ($('#inventory_form').length < 1) ? 0 : ($('#inventory_form').offset().top - 8),
		    ease : Power4.easeOut,
		    onUpdate : function() {
			$(window).scrollTop(obj.pos);
		    }
		});
		return;
	    }
	}
	if ($rootScope.clearInventory) {
	    $rootScope.clearInventory();
	}
	if ($rootScope.resetInventoryPageNumber) {
	    $rootScope.resetInventoryPageNumber();
	}
	$rootScope.updateInventoryDataTable();
    }

    $scope.$watch('template', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    for (var i = 0; i < $scope.search_templates.length; i++) {
		if ($scope.search_templates[i].id == $scope.template) { // matching
		    // one
		    angular.forEach($scope.inventory, function(value, key) {
			if (key == 'somesubtables') {
			    angular.forEach(value, function(innerValue, innerKey) {
				if ($scope.search_templates[i].data[key] && $scope.search_templates[i].data[key][innerKey]) {
				    $scope.inventory[key][innerKey] = $scope.search_templates[i].data[key][innerKey];

				} else {
				    $scope.inventory[key][innerKey] = null;
				}
			    });
			} else if ($scope.search_templates[i].data[key]) {
			    $scope.inventory[key] = $scope.search_templates[i].data[key];
			} else {
			    $scope.inventory[key] = null;
			}
		    });

		    $rootScope.search_inventory = $scope.inventory;// =
		    // $scope.search_templates[i].data;
		    // $rootScope.search_orders hopefully will stay tied..
		    // $rootScope.newOrderTemplateModal.id =
		    // $scope.search_templates[i].id;
		    $rootScope.newInventoryTemplateModal.name = $scope.search_templates[i].label;
		    $rootScope.newInventoryTemplateModal.id = $scope.search_templates[i].id;
		}
	    }
	}
    });

    $scope.clearTemplates = function() {
	$rootScope.newInventoryTemplateModal.name = null;
	$rootScope.newInventoryTemplateModal.id = null;
	$scope.template = null;
	$rootScope.search_inventory = $scope.inventory = angular.copy(blankSearch); // clears
	// the
	// order
	// search
	// parameters
    }

    $scope.deleteTemplate = function() {
	$rootScope.modalPopup({
	    title : 'Confirm Delete',
	    size : 'sm',
	    message : 'Are you sure you want to delete the template: <b>' + $rootScope.newInventoryTemplateModal.name + '</b>',
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
		    id : $rootScope.newInventoryTemplateModal.id,
		    location : 'inventory'
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$scope.template = null;
			$rootScope.newInventoryTemplateModal.id = null;
			$rootScope.newInventoryTemplateModal.name = null;
			$rootScope.search_inventory = $scope.inventory = angular.copy(blankSearch);
			$timeout(function() {
			    $sails.get('/template/inventory').success(function(data) {
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

    $rootScope.saveInventoryTemplate = function() {
	$rootScope.newInventoryTemplateModal.id = null;
	for (var i = 0; i < $scope.search_templates.length; i++) {
	    if ($scope.search_templates[i].label == $rootScope.newInventoryTemplateModal.name) { // matching
		// up
		// against
		// existing
		// template
		// name
		$rootScope.newInventoryTemplateModal.id = $scope.search_templates[i].id;
	    }
	}
	if ($rootScope.newInventoryTemplateModal.id == null) {
	    $rootScope.currentModal.dismiss('save');
	} else {
	    $rootScope.modalPopup({
		title : 'Confirm Overwrite',
		size : 'sm',
		message : 'Are you sure you want to save over the existing template: <b>' + $rootScope.newInventoryTemplateModal.name + '</b>',
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

    $scope.saveTemplateModal = function() {
	// $rootScope.newInventoryTemplateModal.name = null;
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'save-inventory-template-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/template/save', {
		    id : $rootScope.newInventoryTemplateModal.id,
		    location : 'inventory',
		    name : $rootScope.newInventoryTemplateModal.name,
		    data : $scope.inventory
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$scope.template = data.template.id;
			$timeout(function() {
			    $sails.get('/template/inventory').success(function(data) {
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

    $rootScope.inventory_search = $scope.inventory;

    $scope.$watchCollection('inventory', function() {
	return;
	if (vm.updateTable) {
	    clearTimeout(vm.updateTable);
	}
	vm.updateTable = setTimeout(function() {
	    $rootScope.updateInventoryDataTable();
	}, 300);
    });

})

.controller(
    'InventoryDatatable',
    function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder, $sails, $modal) {//$contact

	var vm = this;
	vm.pageReset = false;

	$scope.selectedInventory = null;
	//$scope.orders = [];

	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/inventory/search',
	    type : 'POST'
	})
	// .withDataProp('data')
	.withOption('serverSide', true).withOption('processing', true).withOption('fnServerParams', function(aoData) {
	    aoData.inventory = $rootScope.inventory_search;
	    $timeout(function() { // Whenever the table searches, it clears
		// the selected
		if ($rootScope.getInventorySelectedInventory()) { // passes through
		    // the
		    // selectedOrder..
		    $scope.selectedInventory = angular.copy($rootScope.getInventorySelectedInventory());
		    // $scope.selectedOrder = $scope.retrieveId;
		    $scope.retrieveId = null;
		} else {
		    $scope.selectedInventory = null;
		}
	    }, 0);
	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function() {
		// $scope.$apply(function() {
		vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
		// });
	    });
	    if ($scope.selectedInventory != null && aData.id == $scope.selectedInventory.id) {
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
	vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('SHIPFROM').withTitle('Shipped From'), DTColumnBuilder.newColumn('SHIPDATE').withTitle(' Shipped Date'), DTColumnBuilder.newColumn('DATE').withTitle('Order Placed'),
	    DTColumnBuilder.newColumn('order_type').withTitle('Order Type'), DTColumnBuilder.newColumn('GTOTAL').withTitle('Grand Total').renderWith(function(data, type, full, meta) {
		if ($scope.currencies != null && $rootScope.currencies[full.FUNDS]) {
		    return $rootScope.currencies[full.FUNDS].symbol + data;
		} else {
		    return data;
		}
	    }) ];

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    $scope.tableId = data.id; // Record table ID, for refreshes
	    // later.
	});
	$rootScope.updateInventoryDataTable = function(selectedInventory, event, args) {
	    if ($scope.tableId) {
		if ($rootScope.getInventorySelectedInventory) {
		    $scope.selectedInventory = angular.copy($rootScope.getInventorySelectedInventory());
		}
		$('#' + $scope.tableId).DataTable().ajax.reload(function() {
		}, vm.pageReset);
		vm.pageReset = false;
	    }
	}

	$rootScope.resetInventoryPageNumber = function() {
	    vm.pageReset = true;
	}

	/*
	 * $scope.$on('refreshContactsx', function(event, args){
	 * //console.log('deb'); vm.contact = args;
	 * $timeout(vm.dtOptions.reloadData,500); //(); });
	 */

	// $scope.newOrder = function() {
	// $rootScope.$broadcast("getorder", {
	// id : "new"
	// });
	// }
	$scope.exportList = function() {
	    // $rootScope.currentModal = $modal.open({
	    // templateUrl : 'export-contacts-modal',
	    // size : 'md',
	    // backdrop : true
	    // });
	    // $rootScope.exporting_contacts = true;
	    //
	    // $sails.post('/contacts/export', {
	    // contact : $rootScope.search_contact
	    // }).success(function(response) {
	    // if (response.error != undefined) { // USER NO LONGER
	    // // LOGGEDIN!!!!!
	    // location.reload(); // Will boot back to login screen
	    // }
	    // if (response.oversize) {
	    // $rootScope.currentModal.dismiss('oversize');
	    // return alert('Unable to export ' + response.recordsFiltered + '
	    // records. The system can export a maximum of 100,000 records.');
	    //
	    // }
	    // $timeout(function() {
	    // // $rootScope.pdfurl = response.pdfurl;
	    // $rootScope.contact_export_csvurl = response.csvurl;
	    // $rootScope.contact_export_dbfurl = response.dbfurl;
	    // delete $rootScope.exporting_contacts;
	    // }, 0);
	    // });
	}

	/*
	 * $scope.$on('refreshContactsx', function(event, args){
	 * //console.log('deb'); vm.contact = args;
	 * $timeout(vm.dtOptions.reloadData,500); //(); });
	 */

	function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    var unsavedMessage = 'You have unsaved changes pending.  Are you sure you want to discard these changes? Press Cancel to go back and save your changes.';

	    if (false){//$contact.is_modified) {
		if (!confirm(unsavedMessage)) {
		    // $contact.is_modified = false;
		    // } else {
		    var obj = {
			pos : $(window).scrollTop()
		    };
		    TweenLite.to(obj, 0.3, {
			pos : ($('#inventory_form').length < 1) ? 0 : ($('#inventory_form').offset().top - 8),
			ease : Power4.easeOut,
			onUpdate : function() {
			    $(window).scrollTop(obj.pos);
			}
		    });
		    return;
		}
	    }
	    $rootScope.$broadcast("getinventory", {
		id : aData.id
	    });
	    // if(aData.id == $contact.id){
	    $('tr').removeClass('selected');
	    $(nRow).addClass('selected');
	    // }
	    // console.log('here');
	    // vm.message = info.DONOR2 + ' - ' + info.FNAME;
	}

	// function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	// $('tr').removeClass('selected');
	// $(nRow).addClass('selected');
	// $timeout(function() {
	// $scope.selectedOrder = aData;
	// }, 0);
	// }

	$scope.isDatatableEditDisabled = function() {
	    return $scope.selectedInventory == null;
	}

	$scope.editDatatableRow = function(modal_id, modal_size, modal_backdrop) {
	    $sails.post("/inventory/getinventory", {
		id : $scope.selectedInventory.id
	    }).success(function(data) {
		if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		    location.reload(); // Will boot back to login screen
		}
		if (data.success) {
		    // $rootScope.modalSelectedOrder =
		    // angular.copy(data.dpcode);
		    // $rootScope.currentModal = $modal.open({
		    // templateUrl : modal_id,
		    // size : modal_size,
		    // backdrop : typeof modal_backdrop == 'undefined' ? true :
		    // modal_backdrop
		    // });
		    // $rootScope.currentModal.result.then(function(selectedItem)
		    // {
		    // }, function(triggerElement) {
		    // if (triggerElement == 'save') {
		    // $sails.post('/dpcodes/save',
		    // $rootScope.modalSelectedCode).success(function(data) {
		    // if (data.error != undefined) { // USER NO
		    // // LONGER LOGGED
		    // // IN!!!!!
		    // location.reload(); // Will boot back to
		    // // login screen
		    // }
		    // if (data.success) {
		    // $scope.retrieveId = $scope.selectedCode;
		    // $rootScope.updateDpCodesDataTable();
		    // }
		    // }).error(function(data) {
		    // alert('err!');
		    // });
		    // }
		    // });
		}
	    }).error(function(data) {
		alert('err!');
	    });
	};

	$scope.deleteDatatableRow = function(modal_id, modal_size) {
	    // $rootScope.currentModal = $modal.open({
	    // templateUrl : modal_id,
	    // size : modal_size,
	    // backdrop : true
	    // });
	    // $rootScope.deleteModalText = $scope.selectedCode.id + ' ' +
	    // $scope.selectedCode.FIELD + ' ' + $scope.selectedCode.CODE + ' '
	    // + $scope.selectedCode.DESC;
	    // $rootScope.currentModal.result.then(function(selectedItem) {
	    // }, function(triggerElement) {
	    // if (triggerElement == 'delete') {
	    // $sails.post('/dpcodes/destroy',
	    // $scope.selectedCode).success(function(data) {
	    // if (data.error != undefined) { // USER NO LONGER LOGGED
	    // // IN!!!!!
	    // location.reload(); // Will boot back to login
	    // // screen
	    // }
	    // if (data.success) {
	    // // $scope.retrieveId = $scope.selectedCode;
	    // $rootScope.updateDpCodesDataTable();
	    // }
	    // }).error(function(data) {
	    // alert('err!');
	    // });
	    // }
	    // });
	}

	$scope.addDatatableRow = function(modal_id, modal_size) {
	    // $('#' +
	    // $scope.tableId).find('tr.selected').removeClass('selected');
	    // $scope.selectedCode = null;
	    // $rootScope.modalSelectedCode = {
	    // id : null,
	    // FIELD : $rootScope.dpsearch.field,
	    // CODE : null,
	    // DESC : null,
	    // CATEGORY : null
	    // };
	    // $rootScope.currentModal = $modal.open({
	    // templateUrl : modal_id,
	    // size : modal_size,
	    // backdrop : typeof modal_backdrop == 'undefined' ? true :
	    // modal_backdrop
	    // });
	    // $rootScope.currentModal.result.then(function(selectedItem) {
	    // }, function(triggerElement) {
	    // if (triggerElement == 'save') {
	    // $sails.post('/dpcodes/save',
	    // $rootScope.modalSelectedCode).success(function(data) {
	    // if (data.error != undefined) { // USER NO LONGER LOGGED
	    // // IN!!!!!
	    // location.reload(); // Will boot back to login
	    // // screen
	    // }
	    // if (data.success) {
	    // // $scope.retrieveId = $scope.selectedCode;
	    // $rootScope.updateDpCodesDataTable();
	    // }
	    // }).error(function(data) {
	    // alert('err!');
	    // });
	    // }
	    // });
	}
    });