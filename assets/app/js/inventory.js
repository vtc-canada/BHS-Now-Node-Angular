'use strict';
angular.module('xenon.controllers.inventory', [])

.controller('InventorySection', function($scope, $rootScope, $timeout, $filter, $state, $modal, $sails, Utility) { // $contact,
    $scope.helpers = public_vars.helpers;
    // var vm = this;
    // vm.blockInventorySelectedModified = true;

    $rootScope.clearInventory = function() {
	// vm.watchEnabled = false;

	resetInventoryForms();
    }

    $scope.$watch('selectedLot', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    if ($rootScope.selectedLot == null) {
		$rootScope.selectedLotChanged = true;
		return;
	    }
	    if ($rootScope.selectedLotChanged) {
		$rootScope.selectedLotChanged = false;
	    } else {
		$rootScope.changes_pending = true;
	    }

	}
    }, true);

    $scope.saveInventory = function(tab) {
	$timeout(function() {
	    var founderrors = false;
	    $('#' + "fullinventory").valid(); // this was blocked at some
	    // point for some reason..
	    if ($rootScope.validator["fullinventory"].numberOfInvalids() > 0) { // error
		founderrors = true;
	    }

	    if (!founderrors) {
		$sails.post("/inventory/save", {
		    lot : $scope.selectedLot
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			location.reload(); // Will boot back to login
		    }
		    if (data.success) {
			$timeout(function() {

			    delete $scope.inventory_saving;
			    resetInventoryForms();
			    $rootScope.changes_pending = false;
			    // Datatable is update via socket emit from this
			    // update.

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});

		$scope.inventory_saving = true;
	    }
	}, 0);
    }
    function resetInventoryForms() {
	if ($('form#' + "fullinventory").length > 0 && $rootScope.validator && $rootScope.validator["fullinventory"]) {
	    $rootScope.validator["fullinventory"].resetForm();
	    $('form#' + "fullinventory" + ' .validate-has-error').removeClass('validate-has-error');
	}
    }

})

.controller('InventorySearch', function($scope, $rootScope, $modal, $sails, $timeout) { // $contact
    var vm = this;

    var blankSearch = {
	id : ''
    };

    $scope.inventory_search = angular.copy(blankSearch);

    // $rootScope.inventory_search = $scope.inventory;

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
    function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder, $sails, $modal, $filter, $dropdowns) {// $contact

	var vm = this;
	vm.pageReset = false;

	$scope.dropdowns = $dropdowns;

	$rootScope.changes_pending = false;

	$rootScope.lotUpdate = function(lot) {
	    // alert('anupdate');

	    $scope.inventoryDatatable.dataTable.fnUpdate(lot, $scope.index_aoData[lot.id], undefined, true);

	    // This update below really isn't necessary.. interupts/overwrites
	    // form fields other users when editing the same id.
	    if ($rootScope.selectedLot.id == lot.id && !angular.equals($rootScope.selectedLot, lot)) {
		$rootScope.selectedLot = angular.copy(lot);
		$rootScope.selectedLotChanged = true;
	    }
	};
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

	// Selected Lot
	$rootScope.selectedLot = null;
	$rootScope.selectedLotChanged = false;

	var blankSearch = {
	    id : '',
	    serial_no : '',
	    brand : '',
	    type : '',
	    quantity_MIN : '',
	    quantity_MAX : '',
	    uom : '',
	    tread_depth : '',
	    side_wall : '',
	    tire_type : '',
	    tire_size : '',
	    price_MIN : '',
	    price_MAX : '',
	    date_added_MIN : null,
	    date_added_MAX : null,
	    user_name : '',
	    notes : ''
	};
	$scope.inventory_search = angular.copy(blankSearch);

	$scope.$watch('inventory_search', function() {
	    // $scope.inventoryDatatable.dataTable.api().search('PZERO').draw();
	    // $scope.inventoryDatatable.dataTable.columns('type').search('PZERO').draw();

	    // alert('changed');
	    // $scope.inventoryDatatable.dataTable.draw();
	    // $scope.tableId
	    $scope.inventoryDatatable.dataTable.api().draw();
	}, true);

	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/inventory/get-lots-details',
	    type : 'POST'
	})
	// .withDataProp('data')
	// .withOption('serverSide', true).withOption('processing', true)
	.withOption('fnServerParams', function(aoData) {
	    // aoData.inventory = $rootScope.inventory_search;
	    // $timeout(function() { // Whenever the table searches, it clears
	    // // the selected
	    // if ($rootScope.getInventorySelectedInventory()) { // passes
	    // through
	    // // the
	    // // selectedOrder..
	    // $scope.selectedInventory =
	    // angular.copy($rootScope.getInventorySelectedInventory());
	    // // $scope.selectedOrder = $scope.retrieveId;
	    // $scope.retrieveId = null;
	    // } else {
	    // $scope.selectedInventory = null;
	    // }
	    // }, 0);
	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function() {
		// $scope.$apply(function() {
		vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
		// });
	    });
	    $(nRow).removeClass('selected');
	    if ($rootScope.selectedLot != null && aData.id == $rootScope.selectedLot.id) {
		$(nRow).addClass('selected');
	    }
	    return nRow;
	}).withOption('drawCallback', function(settings) {
	    $scope.index_aoData = {};
	    for ( var aoDataIndex in settings.aoData) {
		$scope.index_aoData[settings.aoData[aoDataIndex]['_aData'].id] = aoDataIndex;
	    }
	    // alert('drawcallback');
	}).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"fl>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
	// l length
	// r processing
	// f filtering
	// t table
	// i info
	// p pagination

	// $scope.inventoryDatatable.dataTable.fnGetData()

	vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('serial_no').withTitle('Serial #'), DTColumnBuilder.newColumn('brandID').withTitle('BrandID').notVisible(), DTColumnBuilder.newColumn('brand').withTitle('Brand'),
	    DTColumnBuilder.newColumn('typeID').withTitle('typeID').notVisible(), DTColumnBuilder.newColumn('type').withTitle('Type'), DTColumnBuilder.newColumn('quantity').withTitle('Quantity'), DTColumnBuilder.newColumn('uomID').withTitle('uomID').notVisible(),
	    DTColumnBuilder.newColumn('uom').withTitle('Unit'), DTColumnBuilder.newColumn('tread_depth').withTitle('Tread Depth'), DTColumnBuilder.newColumn('side_wall').withTitle('Side Wall'), DTColumnBuilder.newColumn('tire_type').withTitle('Tire Type'),
	    DTColumnBuilder.newColumn('tire_size').withTitle('Tire Size'), DTColumnBuilder.newColumn('price').withTitle('Price').renderWith(function(data, type, full, meta) {
		return '$' + $filter('number')(data, 2);
	    }), DTColumnBuilder.newColumn('date_added').withTitle('Date Added'), DTColumnBuilder.newColumn('user_name').withTitle('Username'), DTColumnBuilder.newColumn('notes').withTitle('Notes'), ];

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    $scope.tableId = data.id; // Record table ID, for refreshes later.
	    $scope.inventoryDatatable = data;

	    // / Building column builder index
	    $scope.column_index = {};
	    var aoColumns = data.dataTable.api().context[0].aoColumns;
	    for ( var column in aoColumns) {
		$scope.column_index[aoColumns[column].mData] = parseInt(column);
	    }

	    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
		// Break out returning false if any of the filters do not
		// succeed.

		for ( var sfield in $scope.inventory_search) {
		    if (sfield == 'id') {
			if ($scope.inventory_search.id != '' && $scope.inventory_search.id != null && data[$scope.column_index['id']] != $scope.inventory_search.id) {
			    return false;
			}
		    } else if (sfield == 'brand' || sfield == 'type' || sfield == 'uom') {
			if ($scope.inventory_search[sfield] instanceof Array && $scope.inventory_search[sfield].length > 0 && $scope.inventory_search[sfield].indexOf(parseInt(data[$scope.column_index[sfield + 'ID']])) == -1) {
			    return false;
			}
		    } else if (sfield == 'quantity_MIN' || sfield == 'quantity_MAX') {
			if (sfield == 'quantity_MIN' && $scope.inventory_search.quantity_MIN !== '' && $scope.inventory_search.quantity_MIN != null && parseInt(data[$scope.column_index['quantity']]) < parseInt($scope.inventory_search.quantity_MIN)) {
			    return false;
			} else if (sfield == 'quantity_MAX' && $scope.inventory_search.quantity_MAX !== '' && $scope.inventory_search.quantity_MAX != null && parseInt(data[$scope.column_index['quantity']]) < parseInt($scope.inventory_search.quantity_MAX)) {
			    return false;
			}
		    } else if (sfield == 'date_added_MIN' || sfield == 'date_added_MAX') {
			if (sfield == 'date_added_MIN' && $scope.inventory_search.date_added_MIN !== '' && $scope.inventory_search.date_added_MIN != null && $scope.inventory_search.date_added_MIN !== null && (data[$scope.column_index['date_added']]) < ($scope.inventory_search.date_added_MIN)) {
			    return false;
			} else if (sfield == 'date_added_MAX' && $scope.inventory_search.date_added_MAX !== '' && $scope.inventory_search.date_added_MAX != null && $scope.inventory_search.date_added_MAX !== null && (data[$scope.column_index['date_added']]) > ($scope.inventory_search.date_added_MAX)) {
			    return false;
			}
		    } else if (sfield == 'price_MIN' || sfield == 'price_MAX') {
			if (sfield == 'price_MIN' && $scope.inventory_search.price_MIN !== '' && $scope.inventory_search.price_MIN != null && parseInt(data[$scope.column_index['price']]) < parseInt($scope.inventory_search.price_MIN)) {
			    return false;
			} else if (sfield == 'price_MAX' && $scope.inventory_search.price_MAX !== '' && $scope.inventory_search.price_MAX != null && parseInt(data[$scope.column_index['price']]) > parseInt($scope.inventory_search.price_MAX)) {
			    return false;
			}
		    } else if ($scope.inventory_search[sfield] instanceof Array && $scope.inventory_search[sfield].length > 0 && $scope.inventory_search[sfield].indexOf(data[$scope.column_index[sfield]]) == -1) {
			return false;
		    } else if (typeof ($scope.inventory_search[sfield]) == 'string' && $scope.inventory_search[sfield] != '' && $scope.inventory_search[sfield] != null && data[$scope.column_index[sfield]].indexOf($scope.inventory_search[sfield]) == -1) {
			return false;
		    }
		}
		return true;
	    });

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
	    var unsavedMessage = 'You have unsaved changes pending. Are you sure you want to discard these changes? Press Cancel to go back and save your changes.';

	    if ($rootScope.changes_pending) {// $contact.is_modified) {
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
	    $timeout(function() {
		$rootScope.selectedLot = angular.copy(aData);
		$rootScope.selectedLot.price = isNaN(parseFloat($rootScope.selectedLot.price)) ? 0 : parseFloat($rootScope.selectedLot.price);
		$rootScope.selectedLot.quantity = isNaN(parseInt($rootScope.selectedLot.quantity)) ? 0 : parseInt($rootScope.selectedLot.quantity);
		$rootScope.selectedLotChanged = true;
		$rootScope.changes_pending = false;
		$scope.inventoryDatatable.dataTable.api().draw(false); // redrawing
		// it
		// makes
		// it
		// see
		// the
		// matched
		// selectedLot
		// id
		// and
		// draw
		// it
		// green.
	    }, 0);

	    // $rootScope.$broadcast("getinventory", {
	    // id : aData.id
	    // });
	    // // if(aData.id == $contact.id){
	    // $('tr').removeClass('selected');
	    // $(nRow).addClass('selected');
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

	};

	(function() {
	    $sails.get('/inventorymanagementstudio/getinventoryattributes').success(function(data) {

		var data = data.result;

		$scope.brandNames = {};
		$scope.dropdowns.brands = [];
		for (var i = 0; i < data.brands.length; i++) {
		    $scope.dropdowns.brands.push({
			id : data.brands[i].id,
			label : data.brands[i].brand
		    });
		    $scope.brandNames[data.brands[i].id] = data.brands[i].brand;
		}
		$scope.dropdowns.uoms = [];
		for (var i = 0; i < data.uoms.length; i++) {
		    $scope.dropdowns.uoms.push({
			id : data.uoms[i].id,
			label : data.uoms[i].uom
		    });
		}

	    }).error(function(data) {
		alert('err!' + data.toString());
	    });

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

	$scope.$watch('template', function(newValue, oldValue) {
	    if (!angular.equals(newValue, oldValue)) {
		if (newValue == null) {
		    $scope.clearTemplates();
		} else {
		    for (var i = 0; i < $scope.search_templates.length; i++) {
			if ($scope.search_templates[i].id == $scope.template) { // matching
			    // one
			    angular.forEach($scope.inventory_search, function(value, key) {
				if (key == 'somesubtables') {
				    angular.forEach(value, function(innerValue, innerKey) {
					if ($scope.search_templates[i].data[key] && $scope.search_templates[i].data[key][innerKey]) {
					    $scope.inventory_search[key][innerKey] = $scope.search_templates[i].data[key][innerKey];

					} else {
					    $scope.inventory_search[key][innerKey] = null;
					}
				    });
				} else if ($scope.search_templates[i].data[key]) {
				    $scope.inventory_search[key] = $scope.search_templates[i].data[key];
				} else {
				    $scope.inventory_search[key] = null;
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
	    $scope.inventory_search = angular.copy(blankSearch); // clears
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
			data : $scope.inventory_search
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

	$scope.$watch('inventory_search.brand', function(newValue, oldValue) {
	    if (!angular.equals(newValue, oldValue)) {
		$sails.post('/inventory/get-types-in-brands', {
		    brands : newValue
		}).success(function(data) {
		    if (data.success) {
			$timeout(function() {
			    var types = data.data;
			    $scope.dropdowns.types = [];
			    for (var i = 0; i < types.length; i++) {
				$scope.dropdowns.types.push({
				    id : types[i].id,
				    label : types[i].type
				});
			    }
			}, 0);
		    }
		});
	    }
	});

	$scope.$watch('selectedLot.brandID', function(newValue, oldValue) {
	    if (!angular.equals(newValue, oldValue)) {
		$rootScope.selectedLot.brand = $scope.brandNames[newValue];

		$sails.post('/inventory/get-types-by-brand', {
		    brand : newValue
		}).success(function(data) {
		    if (data.success) {
			$timeout(function() {
			    var hasType = false;
			    var types = data.data;
			    $scope.typeNames = {};
			    $scope.dropdowns.form_types = [];
			    for (var i = 0; i < types.length; i++) {
				$scope.dropdowns.form_types.push({
				    id : types[i].id,
				    label : types[i].type
				});
				if (types[i].id == $rootScope.selectedLot.typeID) {
				    hasType = true;
				}
				$scope.typeNames[types[i].id] = types[i].type;
			    }
			    if (!hasType) { // then clear out the bad value
				$rootScope.selectedLot.typeID = null;
			    }
			}, 0);
		    }
		});
	    }
	});

	$scope.$watch('selectedLot.typeID', function(newValue, oldValue) {
	    if (!angular.equals(newValue, oldValue)) {
		$rootScope.selectedLot.type = $scope.typeNames[newValue];
	    }
	});

    });