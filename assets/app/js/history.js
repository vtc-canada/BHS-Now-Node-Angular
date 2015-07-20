'use strict';
angular.module('xenon.controllers.history', [])

// .controller('InventorySection', function($scope, $rootScope, $timeout,
// $filter, $state, $modal, $sails, Utility) { // $contact,
// $scope.helpers = public_vars.helpers;
// // var vm = this;
// // vm.blockInventorySelectedModified = true;
//
// $rootScope.clearInventory = function() {
// // vm.watchEnabled = false;
//
// resetInventoryForms();
// }
//
// $scope.$watch('selectedLot', function(newValue, oldValue) {
// if (!angular.equals(newValue, oldValue)) {
// if ($rootScope.selectedLot == null) {
// $rootScope.selectedLotChanged = true;
// return;
// }
// if ($rootScope.selectedLotChanged) {
// $rootScope.selectedLotChanged = false;
// } else {
// $rootScope.changes_pending = true;
// }
//
// }
// }, true);
//
// $scope.saveInventory = function(tab) {
// $timeout(function() {
// var founderrors = false;
// $('#' + "fullinventory").valid(); // this was blocked at some
// // point for some reason..
// if ($rootScope.validator["fullinventory"].numberOfInvalids() > 0) { // error
// founderrors = true;
// }
//
// if (!founderrors) {
// $sails.post("/inventory/save", {
// lot : $rootScope.selectedLot
// }).success(function(data) {
// if (data.error != undefined) { // USER NO LONGER LOGGED
// location.reload(); // Will boot back to login
// }
// if (data.success) {
//			
// toastr.success('Lot <b>' + $rootScope.selectedLot.id + '</b> was updated.',
// 'Success', {
// "closeButton" : true,
// "debug" : false,
// "newestOnTop" : false,
// "progressBar" : false,
// "positionClass" : "toast-top-right",
// "preventDuplicates" : false,
// "showDuration" : "300",
// "hideDuration" : "1000",
// "timeOut" : "5000",
// "extendedTimeOut" : "1000",
// "showEasing" : "swing",
// "hideEasing" : "linear",
// "showMethod" : "fadeIn",
// "hideMethod" : "fadeOut"
// });
//			
// $rootScope.selectedLot.id = data.lot.id;
//
// $sails.post("/inventory/pushlot", {
// lot : data.lot
// }, function(data) {
// if (data.error != undefined) { // USER NO LONGER
// // LOGGED
// location.reload(); // Will boot back to login
// }
// });
//
// $timeout(function() {
// delete $scope.inventory_saving;
// resetInventoryForms();
// $rootScope.changes_pending = false;
// // Datatable is update via socket emit from this
// // update.
//
// }, 0);
// }
// }).error(function(data) {
// alert('err!');
// });
//
// $scope.inventory_saving = true;
// }
// }, 0);
// }
// function resetInventoryForms() {
// if ($('form#' + "fullinventory").length > 0 && $rootScope.validator &&
// $rootScope.validator["fullinventory"]) {
// $rootScope.validator["fullinventory"].resetForm();
// $('form#' + "fullinventory" + '
// .validate-has-error').removeClass('validate-has-error');
// }
// }
//
// })

.controller(
    'HistoryDatatable',
    function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder, $sails, $modal, $filter, $dropdowns, $user) {// $contact

	var vm = this;
	vm.pageReset = false;

	$scope.dropdowns = $dropdowns;

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

	var blankSearch = {
	    id : '',
	    // serial_no : '',
	    date_MIN : moment().subtract( 29, 'days').format('YYYY-MM-DD'),
	    date_MAX : moment().format('YYYY-MM-DD'),
	// user_name : '',
	// notes : ''
	};
	$scope.history_search = angular.copy(blankSearch);
//	{
//	    id : '',
//	    // serial_no : '',
//	    date_MIN : '2011-01-01',
//	    date_MAX : '2021-01-01',
//	// user_name : '',
//	// notes : ''
//	};
	
	//angular.copy(blankSearch);

	$scope.$watch('history_search', function() {
	    // $scope.historyDatatable.dataTable.api().search('PZERO').draw();
	    // $scope.historyDatatable.dataTable.columns('type').search('PZERO').draw();

	    // alert('changed');
	    // $scope.historyDatatable.dataTable.draw();
	    // $scope.tableId

	    $scope.historyDatatable.dataTable.api().ajax.reload(function() {
	    }, false);
	    //$scope.historyDatatable.dataTable.api().draw();
	}, true);

	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/history/get-operation-history',
	    type : 'POST'
	}).withOption('fnServerParams', function(aoData) {
	    aoData.push({name:'lotID' , value:$scope.history_search.id});
	    aoData.push({name:'date_MIN' , value:$scope.history_search.date_MIN});
	    aoData.push({name:'date_MAX' , value:$scope.history_search.date_MAX});

	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function(event) {
		vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
	    });
	    // $(nRow).removeClass('selected');
	    // if ($rootScope.selectedLot != null && aData.id ==
	    // $rootScope.selectedLot.id) {
	    // $(nRow).addClass('selected');
	    // }
	    return nRow;
	}).withOption('drawCallback', function(settings) {
	    $scope.index_aoData = {};
	    for ( var aoDataIndex in settings.aoData) {
		$scope.index_aoData[settings.aoData[aoDataIndex]['_aData'].id] = aoDataIndex;
	    }
	    // $timeout(function() {
	    // if ($rootScope.selectAll.persistpagemodemessage) {
	    // $rootScope.selectAll.persistpagemodemessage = false;
	    // } else {
	    // $rootScope.selectAll.pagemodemessagevisible = false;
	    // }
	    // }, 0);
	    // $scope.checkSelectAllState(); // check state on all draws
	    // alert('drawcallback');
	})
	// .withOption('stateSave', true)
	.withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"fl>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>'); // <"row"<"col-xs-12"fl>>
	// l length
	// r processing
	// f filtering
	// t table
	// i info
	// p pagination

	// $scope.historyDatatable.dataTable.fnGetData()

	vm.dtColumns = [ DTColumnBuilder.newColumn('lotID').withTitle('Lot ID'), DTColumnBuilder.newColumn('serial_no').withTitle('Serial #'), DTColumnBuilder.newColumn('operation').withTitle('Operation'),
	     	    DTColumnBuilder.newColumn('custom_property').withTitle('custom_property').notVisible(), DTColumnBuilder.newColumn('prev_value').withTitle('Previous Value'), DTColumnBuilder.newColumn('cur_value').withTitle('Current Value'), DTColumnBuilder.newColumn('user_name').withTitle('Username'),
		    DTColumnBuilder.newColumn('last_modified').withTitle('Last Modified') ];

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    var allowFilter = [ 'history' ];
	    if (data.id.indexOf(allowFilter) == -1) {
		return;
	    }
	    $scope.tableId = data.id; // Record table ID, for refreshes later.
	    $scope.historyDatatable = data;

	    // / Building column builder index
	    $scope.column_index = {};
	    var aoColumns = data.dataTable.api().context[0].aoColumns;
	    for ( var column in aoColumns) {
		$scope.column_index[aoColumns[column].mData] = parseInt(column);
	    }
	    return;

	    // $.fn.dataTable.ext.search
	    // .push(function(settings, data, dataIndex) {
	    // // Break out returning false if any of the filters do not
	    // // succeed.
	    // if ($.inArray(settings.nTable.getAttribute('id'), allowFilter) ==
	    // -1) {
	    // // if not table should be ignored
	    // return true;
	    // }
	    //
	    // for ( var sfield in $scope.inventory_search) {
	    // if (sfield == 'id') {
	    // if ($scope.inventory_search.id != '' &&
	    // $scope.inventory_search.id != null &&
	    // data[$scope.column_index['id']] != $scope.inventory_search.id) {
	    // return false;
	    // }
	    // } else if (sfield == 'brand' || sfield == 'type' || sfield ==
	    // 'uom' || sfield == 'lotStatus' || sfield == 'location') {
	    // if ($scope.inventory_search[sfield] instanceof Array &&
	    // $scope.inventory_search[sfield].length > 0 &&
	    // $scope.inventory_search[sfield].indexOf(parseInt(data[$scope.column_index[sfield
	    // + 'ID']])) == -1) {
	    // return false;
	    // }
	    // } else if (sfield == 'quantity_MIN' || sfield == 'quantity_MAX')
	    // {
	    // if (sfield == 'quantity_MIN' &&
	    // $scope.inventory_search.quantity_MIN !== '' &&
	    // $scope.inventory_search.quantity_MIN != null &&
	    // parseInt(data[$scope.column_index['quantity']]) <
	    // parseInt($scope.inventory_search.quantity_MIN)) {
	    // return false;
	    // } else if (sfield == 'quantity_MAX' &&
	    // $scope.inventory_search.quantity_MAX !== '' &&
	    // $scope.inventory_search.quantity_MAX != null &&
	    // parseInt(data[$scope.column_index['quantity']]) <
	    // parseInt($scope.inventory_search.quantity_MAX)) {
	    // return false;
	    // }
	    // } else if (sfield == 'date_added_MIN' || sfield ==
	    // 'date_added_MAX') {
	    // if (sfield == 'date_added_MIN' &&
	    // $scope.inventory_search.date_added_MIN !== '' &&
	    // $scope.inventory_search.date_added_MIN != null &&
	    // $scope.inventory_search.date_added_MIN !== null &&
	    // (data[$scope.column_index['date_added']]) <
	    // ($scope.inventory_search.date_added_MIN)) {
	    // return false;
	    // } else if (sfield == 'date_added_MAX' &&
	    // $scope.inventory_search.date_added_MAX !== '' &&
	    // $scope.inventory_search.date_added_MAX != null &&
	    // $scope.inventory_search.date_added_MAX !== null
	    // && (data[$scope.column_index['date_added']]) >
	    // ($scope.inventory_search.date_added_MAX)) {
	    // return false;
	    // }
	    // } else if (sfield == 'price_MIN' || sfield == 'price_MAX') {
	    // if (sfield == 'price_MIN' && $scope.inventory_search.price_MIN
	    // !== '' && $scope.inventory_search.price_MIN != null &&
	    // parseInt(data[$scope.column_index['price']].replace('$','')) <
	    // parseInt($scope.inventory_search.price_MIN)) {
	    // return false;
	    // } else if (sfield == 'price_MAX' &&
	    // $scope.inventory_search.price_MAX !== '' &&
	    // $scope.inventory_search.price_MAX != null &&
	    // parseInt(data[$scope.column_index['price']].replace('$','')) >
	    // parseInt($scope.inventory_search.price_MAX)) {
	    // return false;
	    // }
	    // } else if ($scope.inventory_search[sfield] instanceof Array &&
	    // $scope.inventory_search[sfield].length > 0 &&
	    // $scope.inventory_search[sfield].indexOf(data[$scope.column_index[sfield]])
	    // == -1) {
	    // return false;
	    // } else if (typeof ($scope.inventory_search[sfield]) == 'string'
	    // && $scope.inventory_search[sfield] != '' &&
	    // $scope.inventory_search[sfield] != null &&
	    // data[$scope.column_index[sfield]].indexOf($scope.inventory_search[sfield])
	    // == -1) {
	    // return false;
	    // }
	    // }
	    // return true;
	    // });
	    //
	});

	function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    //	    
	}
	;

	(function() {
	    // $sails.get('/inventorymanagementstudio/getinventoryattributes').success(function(data)
	    // {
	    //
	    // var data = data.result;
	    //
	    // $scope.brandNames = {};
	    // $scope.dropdowns.brands = [];
	    // for (var i = 0; i < data.brands.length; i++) {
	    // $scope.dropdowns.brands.push({
	    // id : data.brands[i].id,
	    // label : data.brands[i].brand
	    // });
	    // $scope.brandNames[data.brands[i].id] = data.brands[i].brand;
	    // }
	    // }).error(function(data) {
	    // alert('err!' + data.toString());
	    // });

	    $sails.get('/template/history').success(function(data) {
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

	$scope.$watch('template', function(newValue, oldValue) {
	    if (!angular.equals(newValue, oldValue)) {
		if (newValue == null) {
		    $scope.clearTemplates();
		} else {
		    for (var i = 0; i < $scope.search_templates.length; i++) {
			if ($scope.search_templates[i].id == $scope.template) { // matching
			    // one
			    angular.forEach($scope.history_search, function(value, key) {
				if (key == 'somesubtables') {
				    angular.forEach(value, function(innerValue, innerKey) {
					if ($scope.search_templates[i].data[key] && $scope.search_templates[i].data[key][innerKey]) {
					    $scope.history_search[key][innerKey] = $scope.search_templates[i].data[key][innerKey];

					} else {
					    $scope.history_search[key][innerKey] = null;
					}
				    });
				} else if ($scope.search_templates[i].data[key]) {
				    $scope.history_search[key] = $scope.search_templates[i].data[key];
				} else {
				    $scope.history_search[key] = null;
				}
			    });

			    // $rootScope.search_inventory = $scope.inventory;//
			    // =
			    // $scope.search_templates[i].data;
			    // $rootScope.search_orders hopefully will stay
			    // tied..
			    // $rootScope.newOrderTemplateModal.id =
			    // $scope.search_templates[i].id;
			    $rootScope.newInventoryTemplateModal.name = $scope.search_templates[i].label;
			    $rootScope.newInventoryTemplateModal.id = $scope.search_templates[i].id;
			}
		    }
		}
	    }
	});

	$scope.clearTemplates = function() {
	    $rootScope.newInventoryTemplateModal.name = null;
	    $rootScope.newInventoryTemplateModal.id = null;
	    $scope.template = null;
	    $scope.history_search = angular.copy(blankSearch); // clears
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
		templateUrl : 'save-history-template-modal',
		size : 'md',
		backdrop : true
	    });
	    $rootScope.currentModal.result.then(function(selectedItem) {
	    }, function(triggerElement) {
		if (triggerElement == 'save') {
		    $sails.post('/template/save', {
			id : $rootScope.newInventoryTemplateModal.id,
			location : 'history',
			name : $rootScope.newInventoryTemplateModal.name,
			data : $scope.history_search
		    }).success(function(data) {
			if (data.error != undefined) { // USER NO LONGER LOGGED
			    // IN!!!!!
			    location.reload(); // Will boot back to login
			    // screen
			}
			if (data.success) {
			    $rootScope.newInventoryTemplateModal.id = data.template.id;
			    $scope.template = data.template.id;
			    $timeout(function() {
				$sails.get('/template/history').success(function(data) {
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

    });