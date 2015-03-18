'use strict';

angular.module('xenon.controllers', []).controller('ContactSections', function($scope, $rootScope, $timeout, $state, $modal, $contact, $sails, Utility) {
    $scope.helpers = public_vars.helpers;
    var vm = this;
    vm.mail = {};
    $scope.contact = $contact;// .init();
    $scope.contact.id = $contact.id = null;
    $scope.selectedTransaction = null;

    $scope.selectedDataTableRow = {
	'dpgift' : null,
	'dpplg' : null,
	'dtmail' : null,
	'dpother' : null,
	'dplink' : null
    }
    $rootScope.modalDataSet = angular.copy($scope.selectedDataTableRow);

    vm.watchEnabled = false;
    vm.screenLoaded = false;

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
	'dpgift' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"col-xs-12"f>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
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
	'dpplg' : {
	    "autoWidth" : true,
	    "bDestroy" : true,
	    'dom' : '<"col-xs-12"f>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
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
	    'dom' : '<"col-xs-12"f>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
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
	    'dom' : '<"col-xs-12"f>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
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
	    'dom' : '<"col-xs-12"f>rt<"row"<"col-lg-4"i><"col-lg-8"p>>',
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
	    } else { // do nothing
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
    $scope.modifyNote = function($event, note) {
	note.focused = true;
	note.modify_text = note.text == null ? '' : note.text;
	$timeout(function() {
	    $($event.currentTarget).parent().parent().find('textarea').focus();
	}, 0);
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
	$scope.$apply(function() {
	    vm.watchEnabled = false;
	    if (message.id == 'new') {
		$contact.init();
		resetContactForms();
	    } else {
		$sails.post("/contacts/getcontact", {
		    id : message.id
		}).success(function(data) {
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
			;
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
		$sails.post("/contacts/save", $scope.contact).success(function(data) {
		    if (data.success) {
			for ( var key in $scope.selectedDataTableRow) { // iterate
			    // destroying
			    // datatables!
			    $scope.tryDestroyDataTable(key);
			}
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
	if (typeof (vm.gotattributes) == 'undefined') {// get an existing
	    // object
	    vm.gotattributes = true;
	    $sails.get('/donortracker/getattributes').success(function(data) {
		var data = data.result;

		$scope.response = [ {
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

		$rootScope.currencies = [ {
		    id : 'U',
		    label : 'USD - United States'
		}, {
		    id : 'C',
		    label : 'CAD - Canadian Dollars'
		} ];

		$rootScope.pledgegroups = [];
		for (var i = 0; i < data.pledgegroups.length; i++) {
		    $scope.pledgegroups.push({
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

		$rootScope.lists = [];
		for (var i = 0; i < data.lists.length; i++) {
		    $scope.lists.push({
			id : data.lists[i].CODE,
			label : data.lists[i].CODE + " - " + data.lists[i].DESC
		    });
		}
		$rootScope.demands = [];
		for (var i = 0; i < data.demands.length; i++) {
		    $scope.demands.push({
			id : data.demands[i].CODE,
			label : data.demands[i].CODE + " - " + data.demands[i].DESC
		    });
		}
		$rootScope.relationships = [];
		for (var i = 0; i < data.relationships.length; i++) {
		    $scope.relationships.push({
			id : data.relationships[i].CODE,
			label : data.relationships[i].CODE + " - " + data.relationships[i].DESC
		    });
		}
		$rootScope.requests_plural = [];
		for (var i = 0; i < data.requests_plural.length; i++) {
		    $scope.requests_plural.push({
			id : data.requests_plural[i].CODE,
			label : data.requests_plural[i].CODE + " - " + data.requests_plural[i].DESC
		    });
		}

		$scope.transaction_type = 'dpplg';

		$scope.transaction_types = [ {
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
		    id : 6,
		    label : 'Myst'
		} ];

		$scope.staticyesnounknown = [ {
		    id : 'Y',
		    label : 'Yes'
		}, {
		    id : 'U',
		    label : 'Unknown'
		}, {
		    id : 'N',
		    label : 'No'
		} ];

		/*
		 * for (var i = 0; i < data.donor_classes.length; i++) {
		 * $scope.donor_classes.push({ id : data.donor_classes[i].CODE,
		 * label : data.donor_classes[i].CODE + " - " +
		 * data.donor_classes[i].DESC }); }
		 */

		/*
		 * angular.forEach(data.result,function(atts,key){
		 * $scope[key]=[]; for(var i=0;i<atts.length;i++){
		 * $scope[key].push({ id : atts[i]. }); } ) })
		 */
		$scope.titles = [];
		for (var i = 0; i < data.titles.length; i++) {
		    $scope.titles.push({
			id : data.titles[i].TITLE,
			label : data.titles[i].TITLE
		    });
		}
		$scope.languages = [];
		for (var i = 0; i < data.languages.length; i++) {
		    $scope.languages.push({
			id : data.languages[i].CODE,
			label : data.languages[i].CODE + " - " + data.languages[i].DESC
		    });
		}
		$scope.values_traditional = [];
		for (var i = 0; i < data.values_traditional.length; i++) {
		    $scope.values_traditional.push({
			id : data.values_traditional[i].CODE,
			label : data.values_traditional[i].CODE + " - " + data.values_traditional[i].DESC
		    });
		}
		$scope.decision = [];
		for (var i = 0; i < data.decision.length; i++) {
		    $scope.decision.push({
			id : data.decision[i].CODE,
			label : data.decision[i].CODE + " - " + data.decision[i].DESC
		    });
		}
		$scope.mass_said = [];
		for (var i = 0; i < data.mass_said.length; i++) {
		    $scope.mass_said.push({
			id : data.mass_said[i].CODE,
			label : data.mass_said[i].CODE + " - " + data.mass_said[i].DESC
		    });
		}

		$scope.willsaymass = [];
		for (var i = 0; i < data.willsaymass.length; i++) {
		    $scope.willsaymass.push({
			id : data.willsaymass[i].CODE,
			label : data.willsaymass[i].CODE + " - " + data.willsaymass[i].DESC
		    });
		}
		$scope.english = [];
		for (var i = 0; i < data.english.length; i++) {
		    $scope.english.push({
			id : data.english[i].CODE,
			label : data.english[i].CODE + " - " + data.english[i].DESC
		    });
		}
		$scope.accounts_received = [];
		for (var i = 0; i < data.accounts_received.length; i++) {
		    $scope.accounts_received.push({
			id : data.accounts_received[i].CODE,
			label : data.accounts_received[i].CODE + " - " + data.accounts_received[i].DESC
		    });
		}
		$scope.reasons = [];
		for (var i = 0; i < data.reasons.length; i++) {
		    $scope.reasons.push({
			id : data.reasons[i].CODE,
			label : data.reasons[i].CODE
		    });
		}
		$scope.cfns = [];
		for (var i = 0; i < data.cfns.length; i++) {
		    $scope.cfns.push({
			id : data.cfns[i].CODE,
			label : data.cfns[i].CODE + " - " + data.cfns[i].DESC
		    });
		}
		$scope.pledgors = [];
		for (var i = 0; i < data.pledgors.length; i++) {
		    $scope.pledgors.push({
			id : data.pledgors[i].CODE,
			label : data.pledgors[i].CODE + " - " + data.pledgors[i].DESC
		    });
		}
		$scope.types = [];
		for (var i = 0; i < data.types.length; i++) {
		    $scope.types.push({
			id : data.types[i].CODE,
			label : data.types[i].CODE
		    });
		}
		$scope.sols = [];
		for (var i = 0; i < data.sols.length; i++) {
		    $scope.sols.push({
			id : data.sols[i].CODE,
			label : data.sols[i].CODE
		    });
		}
		$rootScope.sols = [];
		for (var i = 0; i < data.sols.length; i++) {
		    $rootScope.sols.push({
			id : data.sols[i].CODE,
			label : data.sols[i].CODE
		    });
		}
		$rootScope.billing_schedules = [];
		for (var i = 0; i < data.billing_schedules.length; i++) {
		    $rootScope.billing_schedules.push({
			id : data.billing_schedules[i].CODE,
			label : data.billing_schedules[i].CODE + " - " + data.billing_schedules[i].DESC
		    });
		}

		$rootScope.transacts = [];
		for (var i = 0; i < data.transacts.length; i++) {
		    $rootScope.transacts.push({
			id : data.transacts[i].CODE,
			label : data.transacts[i].CODE + " - " + data.transacts[i].DESC
		    });
		}
		$rootScope.designates = [];
		for (var i = 0; i < data.designates.length; i++) {
		    $rootScope.designates.push({
			id : data.designates[i].CODE,
			label : data.designates[i].CODE + " - " + data.designates[i].DESC
		    });
		}
		$rootScope.modes = [];
		for (var i = 0; i < data.modes.length; i++) {
		    $rootScope.modes.push({
			id : data.modes[i].CODE,
			label : data.modes[i].CODE + " - " + data.modes[i].DESC
		    });
		}

		$scope.states = [];
		for (var i = 0; i < data.states.length; i++) {
		    $scope.states.push({
			id : data.states[i].CODE,
			label : data.states[i].CODE
		    });
		}
		$scope.pledge_schedule = data.pledge_schedule;
		$scope.major_donation_types = data.major_donation_types;

		$scope.countries = [];
		for (var i = 0; i < data.countries.length; i++) {
		    $scope.countries.push({
			id : data.countries[i].CODE,
			label : data.countries[i].CODE
		    });
		}
		$scope.county_codes = [];
		for (var i = 0; i < data.county_codes.length; i++) {
		    $scope.county_codes.push({
			id : data.county_codes[i].CODE,
			label : data.county_codes[i].CODE
		    });
		}
		$scope.phone_types = [];
		for (var i = 0; i < data.phone_types.length; i++) {
		    $scope.phone_types.push({
			id : data.phone_types[i].CODE,
			label : data.phone_types[i].CODE
		    });
		}
		$scope.address_types = [];
		for (var i = 0; i < data.address_types.length; i++) {
		    $scope.address_types.push({
			id : data.address_types[i].CODE,
			label : data.address_types[i].CODE
		    });
		}

		// DTVOLS1
		$scope.dtvols1 = {};
		$scope.dtvols1.origin = [];
		$rootScope.origin = [];
		for (var i = 0; i < data.dtvols1.origin.length; i++) {
		    $scope.dtvols1.origin.push({
			id : data.dtvols1.origin[i].CODE,
			label : data.dtvols1.origin[i].CODE + ' - ' + data.dtvols1.origin[i].DESC
		    });
		}

		$rootScope.origin = angular.copy($scope.dtvols1.origin);

	    }).error(function(data) {
		alert('err!');
	    });
	    /*
	     * $scope.titles = [{ //create a new object id: 'Mr', label: 'Mr.' }, {
	     * id: 'Mrs', label: 'Mrs.' }];
	     */
	}
    })()
}).controller('ReportSearch', function($scope, $rootScope, $sce, $timeout, $http, $reports, $reportselects, $sails) {
    var vm = this;
    vm.$scope = $scope;
    $scope.reports = $reports;
    $scope.report = $reports[0];
    $scope.reporthtml = null;
    angular.forEach($scope.report.parameters, function(parameter, key) {
	if (parameter.type == 'datetime') {
	    parameter.value = '2013-01-01';
	}
	if (key == 'end_time') {
	    parameter.value = '2013-01-03';
	}
    });

    $scope.report_id = $scope.report.id; // first ID
    $rootScope.report = $scope.report; // links report through $rootScope.

    $scope.$watch('report_id', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    for ( var key in $reports) {
		if ($reports[key].id == $scope.report_id) {
		    $scope.report = $reports[key];
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
	    return $reportselects[parameter.source];
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
	return svm.ajax_results; // returns this variable- we will set this
	// after in async callback.- thus updating
	// it.

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
    }

    $scope.runReport = function() {
	$scope.report.system_name = 'The Fatima Center'; // saves the system
	// name
	$scope.report.timezoneoffset = new Date().getTimezoneOffset();
	$scope.report.loading = true;
	$http.post('/reports/view', {
	    report : $scope.report
	}).success(function(html) {
	    $timeout(function() {
		delete $scope.report.loading;
		$scope.reporthtml = $sce.trustAsHtml(html);// '"<!DOCTYPE
		// html><html
		// lang="en"><head><meta
		// charset="utf-8"><meta
		// content="width=300,
		// initial-scale=1"
		// name="viewport"><meta
		// name="description"
		// content=""><title>undefined</title><link
		// rel="apple-touch-icon-precomposed"
		// sizes="144x144"
		// href="/img/favicon.ico"><link
		// rel="apple-touch-icon-precomposed"
		// sizes="114x114"
		// href="/img/favicon.ico"><link
		// rel="apple-touch-icon-precomposed"
		// sizes="72x72"
		// href="/img/favicon.ico"><link
		// rel="apple-touch-icon-precomposed"
		// href="/img/favicon.png"><link
		// rel="shortcut
		// icon"
		// href="/img/favicon.ico"><link
		// rel="icon"
		// href="/img/favicon.ico"
		// type="image/x-icon"><link
		// rel="shortcut
		// icon"
		// href="/img/favicon.ico"
		// type="image/x-icon">
		// <!--<script
		// type="text/javascript"
		// src="/js/jquery.js"></script><script
		// type="text/javascript"
		// src="/js/dependencies/sails.io.js"></script><script
		// type="text/javascript"
		// src="/js/bootstrap-combobox.js"></script><script
		// type="text/javascript"
		// src="/js/bootstrap.js"></script><script
		// type="text/javascript"
		// src="/js/jquery-ui-1.10.3.custom.min.js"></script><script
		// type="text/javascript"
		// src="/js/jquery.ui.chatbox.js"></script><script
		// type="text/javascript"
		// src="/js/jquery.ui.chatboxManager.js"></script>
		// --></head><body><div
		// class="wrapper">
		// <!--<div
		// class="google-header-bar
		// centered"> <div
		// class="header
		// content
		// clearfix"> <img
		// alt="iSystemsNow"
		// class="logo"
		// src="/img/iSystemsNow-Logo-RGB-Black.png">
		// </div> </div>-->
		// <div class="main
		// content
		// clearfix"> <div
		// class="banner">
		// <h5
		// style="margin-left:10px;">
		// No results have
		// been found. </h5>
		// </div>
		// </div></div></body></html>"';
		// console.log(html);
	    }, 0);
	});
    }

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

}).controller('ContactsSearch', function($scope, $rootScope) {
    var vm = this;

    $scope.contact = {};
    $scope.contact.id = '';
    $scope.contact.ADD = null;
    $scope.contact.CITY = null;
    $scope.contact.ST = null;
    $scope.contact.COUNTRY = null;
    $scope.contact.ZIP = null;
    $scope.contact.CHECKBOX = null;
    $scope.contact.CLASS = null;

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

    $scope.$watchCollection('contact', function() {
	if (vm.updateTable) {
	    clearTimeout(vm.updateTable);
	}
	vm.updateTable = setTimeout(function() {
	    $rootScope.updateContactsTable();
	}, 300);
    });

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
	if (typeof (vm.gotattributes) == 'undefined') {// get an existing
	    // object
	    vm.gotattributes = true;
	    $sails.get('/donortracker/getdpcodeattributes').success(function(data) {
		var data = data.result;

		$scope.response = [ {
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

		$rootScope.currencies = [ {
		    id : 'U',
		    label : 'USD - United States'
		}, {
		    id : 'C',
		    label : 'CAD - Canadian Dollars'
		} ];

		$scope.dpcodefields = [];
		$scope.dpcodefields.push({
		    id : null,
		    label : 'All'
		});
		for (var i = 0; i < data.dpcodefields.length; i++) {
		    if (data.dpcodefields[i].FIELD == null) {
			continue;
		    }
		    $scope.dpcodefields.push({
			id : data.dpcodefields[i].FIELD,
			label : data.dpcodefields[i].FIELD
		    });
		}
	    });
	}
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

}).controller(
    'AddContactDatatable',
    function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder) {
	var vm = this;
	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/contacts/ajax',
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
	    // if (aData.id == $contact.id) {
	    // $(nRow).addClass('selected');
	    // }
	    return nRow;
	}).withPaginationType('full_numbers').withDOM('<"col-xs-12"l>rt<"col-xs-12"<"row"<"col-lg-4"i><"col-lg-8"p>>>');
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
    function($scope, $rootScope, $timeout, $contact, DTOptionsBuilder, DTColumnBuilder) {
	var vm = this;
	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/contacts/ajax',
	    type : 'POST'
	})
	// .withDataProp('data')
	.withOption('serverSide', true).withOption('processing', true).withOption('fnServerParams', function(aoData) {
	    aoData.contact = $rootScope.search_contact;
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
	}).withPaginationType('full_numbers').withDOM('<"col-xs-12"l>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
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
	$rootScope.updateContactsTable = function(event, args) {
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
	    var unsavedMessage = 'You have unsaved changes pending.  Are you sure you want to discard these changes? Press Cancel to go back and save your changes.';

	    if ($contact.is_modified) {
		if (confirm(unsavedMessage)) {
		    // $contact.is_modified = false;
		} else {
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
		$scope.selectedCode = null;
	    }, 0);
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
	}).withPaginationType('full_numbers').withDOM('<"col-xs-12"l>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
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
	    // var unsavedMessage = 'You have unsaved changes pending. Are you
	    // sure you want to discard these changes? Press Cancel to go back
	    // and save your changes.';

	    

	    // $rootScope.$broadcast("getcontact", {
	    // id : aData.id
	    // });
	    // if(aData.id == $contact.id){
	    $('tr').removeClass('selected');
	    $(nRow).addClass('selected');
	    $timeout(function() {
		$scope.selectedCode = aData.id;
	    }, 0);

	    // }
	    // console.log('here');
	    // vm.message = info.DONOR2 + ' - ' + info.FNAME;
	}

	$scope.isDatatableEditDisabled = function() {
	    return $scope.selectedCode == null;
	}

	// $scope.resetSelectedDataTableRow = function() {
	// $timeout(function() {
	// $scope.selectedCode = null;
	// }, 0);
	// }
	// selected modal
	$scope.editDatatableRow = function(modal_id, modal_size, modal_backdrop) {
	    $sails.post("/dpcodes/getdpcode", {
		id : $scope.selectedCode
	    }).success(function(data) {
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
			    // $contact.updateElementObject(table_name,
			    // $rootScope.modalDataSet[table_name]);
			    $timeout(function() {
				alert('save');
				// $scope.contact = $contact;
			    }, 0);
			}
		    });
		}
	    }).error(function(data) {
		alert('err!');
	    });
	};

	$scope.addDatatableRow = function(table_name, modal_id, modal_size) {
	    /*
	     * // Wipe selected, create new.
	     * $scope.selectedDataTableRow[table_name] = {};
	     * $scope.selectedDataTableRow[table_name].id = 'new';
	     * $scope.selectedDataTableRow[table_name].tempId =
	     * Math.floor((Math.random() * 100000) + 1);
	     * 
	     * if (table_name == 'dpgift') { $rootScope.modalDataSet[table_name] = {
	     * id : $scope.selectedDataTableRow[table_name].id, tempId :
	     * $scope.selectedDataTableRow[table_name].tempId, DONOR :
	     * $contact.id, SOL : null, MODE : null, database_origin :
	     * $contact.database_origin, ENVNO : null, AMT : null, DATE : null,
	     * TRANSACT : null, DESIGNATE : null, LABEL : null, LIST : null,
	     * CAMP_TYPE : null, DEMAND : null, REQUESTS : null, CURR : null, GL :
	     * null, PLEDGE : null, RECEIPT : null, REF : null, TBAREQS : null }; }
	     * else if (table_name == 'dpother') {
	     * $rootScope.modalDataSet[table_name] = { id :
	     * $scope.selectedDataTableRow[table_name].id, tempId :
	     * $scope.selectedDataTableRow[table_name].tempId, DONOR :
	     * $contact.id, SOL : null, MODE : null, database_origin :
	     * $contact.database_origin, ENVNO : null, AMT : null, DATE : null,
	     * TRANSACT : null, LABEL : null, LIST : null, CAMP_TYPE : null,
	     * DEMAND : null, REQUESTS : null, CURR : null, GL : null, SURVEY :
	     * null, SURV_ANS : null, TBAREQS : null }; } else if (table_name ==
	     * 'dpplg') { $rootScope.modalDataSet[table_name] = { id :
	     * $scope.selectedDataTableRow[table_name].id, tempId :
	     * $scope.selectedDataTableRow[table_name].tempId, DONOR :
	     * $contact.id, SOL : null }; } else if (table_name == 'dplink') {
	     * $rootScope.modalDataSet[table_name] = { id :
	     * $scope.selectedDataTableRow[table_name].id, tempId :
	     * $scope.selectedDataTableRow[table_name].tempId, ID1 :
	     * $contact.id, ID2 : null, LINK : null, TSDATE : null, errors : {} }; }
	     * 
	     * $rootScope.currentModal = $modal.open({ templateUrl : modal_id,
	     * size : modal_size, backdrop : true });
	     * 
	     * $rootScope.currentModal.result.then(function(selectedItem) {
	     * $scope.selectedDataTableRow[table_name] = null; },
	     * function(triggerElement) {
	     * 
	     * $scope.selectedDataTableRow[table_name] = null; //
	     * $scope.selectedGiftTemp = null; if (triggerElement == 'save') {
	     * 
	     * $scope.tryDestroyDataTable(table_name);
	     * $contact.updateElementObject(table_name,
	     * $rootScope.modalDataSet[table_name]); $timeout(function() {
	     * $scope.contact = $contact; $scope.rebindDataTable(table_name); },
	     * 0); } else { // do nothing } });
	     * 
	     * $rootScope.currentModal.saveLink = function() { if (table_name ==
	     * 'dplink') { //$rootScope.modalDataSet[table_name].errors if
	     * ($rootScope.modalDataSet[table_name].ID2 == null) { return
	     * $timeout(function() {
	     * $rootScope.modalDataSet[table_name].errors.ID2 = true; }, 0); }
	     * if ($rootScope.modalDataSet[table_name].LINK == null) { return
	     * $timeout(function() {
	     * $rootScope.modalDataSet[table_name].errors.LINK = true; }, 0); } }
	     * $rootScope.currentModal.dismiss('save'); };
	     */
	}
	/*
	 * $scope.tryDestroyDataTable = function() {
	 * $('#dpcodes_datatable').css('visibility', 'hidden'); if
	 * ($.fn.DataTable.isDataTable('#dpcodes_datatable')) {
	 * $('#dpcodes_datatable').dataTable().fnDestroy(); } }
	 * $scope.rebindDataTable = function() { if
	 * (!$.fn.DataTable.isDataTable('#dpcodes_datatable')) {
	 * $('#dpcodes_datatable').dataTable(vm.dataTableOptions).on('page.dt',
	 * $scope.resetSelectedDataTableRow()).on('length.dt',
	 * $scope.resetSelectedDataTableRow()).on('search.dt',
	 * $scope.resetSelectedDataTableRow());
	 * $('#dpcodes_datatable').css('visibility', '');
	 * $('#dpcodes_datatable').next().find('ul.pagination li.paginate_button
	 * a').click(function() { $timeout(function() { $scope.selectedCode =
	 * null; }, 0); }); } }
	 */
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