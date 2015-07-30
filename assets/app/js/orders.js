'use strict';
angular.module('xenon.controllers.orders', [])

.controller('OrderSection', function($scope, $rootScope, $timeout, $filter, $state, $modal, $sails, Utility) { // $contact,
    $scope.helpers = public_vars.helpers;
    $rootScope.formPicklist = [];

    $scope.removeEntry = function(index) {
	if ($scope.$parent.selectedOrder.entries[index].id == 'new') {
	    $scope.$parent.selectedOrder.entries.splice(index, 1);
	} else {
	    $scope.$parent.selectedOrder.entries[index].is_deleted = true;
	}
    }

    $scope.focusPickedItem = function(tableIndex, index) {
	$scope.focusLotId = $scope.pickedItems[tableIndex][index].id;
    }

    $scope.getItemsPicked = function() {
	var pickedcount = 0;
	for (var i = 0; i < $rootScope.formPicklist.length; i++) {
	    if ($rootScope.formPicklist[i].quantity) {
		pickedcount = pickedcount + parseInt($rootScope.formPicklist[i].quantity);
	    }
	}
	return '(' + pickedcount + '/' + $scope.formPicklistTotalQuantity + ')';

    }

    $scope.getEntryPickedCount = function(row) {
	var pickedCount = 0;
	for (var i = 0; i < row.pickeditems.length; i++) {
	    pickedCount += parseInt(row.pickeditems[i].quantity);
	}
	return pickedCount;

    }

    $scope.isPicked = function(row) {
	return $scope.getEntryPickedCount(row) >= row.quantity;
    }

    $scope.isOverPicked = function(row) {
	return $scope.getEntryPickedCount(row) > row.quantity;
    }
    
    $scope.getItemTitleColorClass = function(){
	if(!$scope.formPicklist){
	    return '';
	}
	var pickedCount = 0;
	for(var i=0; i<$scope.formPicklist.length;i++){
	    if(!isNaN(parseInt($scope.formPicklist[i].quantity))){
		    pickedCount += parseInt($scope.formPicklist[i].quantity);
	    }
	}
	if(pickedCount > $scope.formPicklistTotalQuantity){
	    return 'lotCountOverPicked';
	}else if(pickedCount ==$scope.formPicklistTotalQuantity){
	    return 'lotFullyPicked';
	}
    }

    $scope.pickListFraction = function(row) {
	//	var pickedCount = 0;
	//	for (var i = 0; i < row.pickeditems.length; i++) {
	//	    pickedCount += parseInt(row.pickeditems[i].quantity);
	//	}
	return $scope.getEntryPickedCount(row) + '/' + row.quantity;

    }

    $scope.editPicklist = function(index) {

	$sails.post('/orders/getpicklistoptions', {
	    entryID : $scope.$parent.selectedOrder.entries[index].id
	}).success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED
		// IN!!!!!
		location.reload(); // Will boot back to login
		// screen
	    }
	    if (data.success) {
		var mappings = data.data;

		$rootScope.currentModal = $modal.open({
		    templateUrl : 'edit-picked-items-modal',
		    size : 'xl',
		    backdrop : true,
		    scope : $scope
		});
		// empty and options entries

		var picklistoptions = data.data;

		/// Need to check picklists so that they block out ID's..
		//  A lot may have been taken from 
		// This is to work around not having ODR_GetPickListOptions return non-available lots (flagged as such)

		// The inverse problem is NOT solved.  There is an issue right now with the interface
		//  If you are moving a picked item from one entry to another on the same order, you will need to:
		// Remove it, save it
		// Add it, save it
		// Implementing this clientside will require serverside ordering operations carefully.
		var pickeditemslists = [];
		for (var i = 0; i < $scope.$parent.selectedOrder.entries.length; i++) {
		    for (var j = 0; j < $scope.$parent.selectedOrder.entries[i].pickeditems.length; j++) {
			if (!isNaN(parseInt($scope.$parent.selectedOrder.entries[i].pickeditems[j].id))) {
			    pickeditemslists.push($scope.$parent.selectedOrder.entries[i].pickeditems[j].id);
			}
		    }
		}

		// Clear out options that are already picked (By ID)
		var i = picklistoptions.length;
		while (i--) {
		    //for (var j = 0; j < $scope.$parent.selectedOrder.entries[i].pickeditems.length; j++) {
		    if (pickeditemslists.indexOf(picklistoptions[i].id) != -1) { // ||picklistoptions[i].id == $scope.$parent.selectedOrder.entries[index].pickeditems[j].id
			picklistoptions.splice(i, 1);
		    }
		    //}
		}

		picklistoptions.push({
		    hiddendroprow : true
		});

		$rootScope.formPicklist = angular.copy($scope.$parent.selectedOrder.entries[index].pickeditems);
		$rootScope.formPicklist.push({
		    hiddendroprow : true
		});
		$scope.formPicklistTotalQuantity = $scope.$parent.selectedOrder.entries[index].quantity;
		$scope.selectedOrderEntryIndex = index;

		$scope.pickedItems = [ picklistoptions, $rootScope.formPicklist ]; // currentModal.picklistoptions
		// =
		// data.data;
		$scope.pickedItemsTables = [ $scope.createOptions('A'), $scope.createOptions('B') ];

		$rootScope.currentModal.result.then(function(selectedItem) {
		}, function(triggerElement) {
		    if (triggerElement == 'save') {
			// $sails.post('/template/save', {
			// id : $rootScope.newOrderTemplateModal.id,
			// location : 'orders',
			// name : $rootScope.newOrderTemplateModal.name,
			// data : $scope.orders_search
			// }).success(function(data) {
			// if (data.error != undefined) { // USER NO LONGER
			// LOGGED
			// // IN!!!!!
			// location.reload(); // Will boot back to login
			// // screen
			// }
			// if (data.success) {
			// $rootScope.newOrderTemplateModal.id =
			// data.template.id;
			// $scope.template = data.template.id;
			// $timeout(function() {
			// $sails.get('/template/orders').success(function(data)
			// {
			// if (data.error != undefined) { // USER NO
			// // LONGER LOGGED
			// // IN!!!!!
			// location.reload(); // Will boot back to
			// // login
			// // screen
			// }
			// $scope.search_templates = [];
			// for (var i = 0; i < data.length; i++) {
			// $scope.search_templates.push({
			// id : data[i].id,
			// label : data[i].name,
			// data : data[i].data
			// });
			// }
			// });
			// }, 0);
			// }
			// }).error(function(data) {
			// alert('err!');
			// });
		    }
		});
	    }
	});
    }

    $scope.pickedItemsFormOkay = function() {
	var i = $rootScope.formPicklist.length;
	var formLots = angular.copy($rootScope.formPicklist);
	while (i--) { // Strip out Dropspacer record.
	    if (!formLots[i].id) {
		formLots.splice(i, 1);
	    }
	}

	// Now must go through the new picked lots and apply them to the actual set
	// This means we must figure out 'new', 'is_deleted'.

	// First generate index to use;

	//	
	//	for(var i=0; i<formLots.length; i++){
	//	    
	//	    
	//	}
	//	
	//	
	//	var i=formLots.length;
	//	while(i--){ // Strip out Dropspacer record.
	//	    if(!formLots[i].id){
	//		formLots.splice(i,1);
	//	    }
	//	}

	$scope.$parent.selectedOrder.entries[$scope.selectedOrderEntryIndex].pickeditems = formLots;

	$rootScope.currentModal.dismiss();
    }

    $scope.isSortDisabled = function() {
	var pickedcount = 0;
	for (var i = 0; i < $rootScope.formPicklist.length; i++) {
	    if ($rootScope.formPicklist[i].quantity) {
		pickedcount = pickedcount + parseInt($rootScope.formPicklist[i].quantity);
	    }
	}
	if (pickedcount >= $scope.formPicklistTotalQuantity) {
	    return true;
	}
	return false;
	//'(' + pickedcount + '/' + $scope.formPicklistTotalQuantity + ')';
    }

    $scope.createOptions = function(listName) {
	var _listName = listName;
	var options = {
	    placeholder : "pickeditemsplaceholder",
	    connectWith : ".pickeditems-wrapper",
	    'ui-floating' : true,
	    items : ">*:not(.sortdisabled)",
	    activate : function(event, object) {
		// Seem to have to manually style object. Must have been
		// disconnected from angular during drag.
		// if(_listName == 'A'){
		// $scope.pickedItems[0][parseInt(object.item.attr('pickedindex'))].is_seleted
		// = null; // will hopefully be realized when dropped.
		// }
		console.log("list " + _listName + ": activate");
	    },
	    beforeStop : function() {
		console.log("list " + _listName + ": beforeStop");
	    },
	    change : function() {
		console.log("list " + _listName + ": change");
	    },
	    create : function() {
		console.log("list " + _listName + ": create");
	    },
	    deactivate : function() {
		console.log("list " + _listName + ": deactivate");
	    },
	    out : function() {
		console.log("list " + _listName + ": out");
	    },
	    over : function() {
		console.log("list " + _listName + ": over");
	    },
	    receive : function(event, object) {
		console.log("list " + _listName + ": receive");
	    },
	    remove : function() {
		console.log("list " + _listName + ": remove");
	    },
	    sort : function() {
		console.log("list " + _listName + ": sort");
	    },
	    start : function(event, object) {
		$scope.focusLotId = null;
		$(object.item).removeClass('selected');
		$(object.item).addClass('dragging');
		$(object.item).css('width', 'auto');
		$(object.item).css('height', 'auto');

		console.log("list " + _listName + ": start");
	    },
	    stop : function(event, object) {
		if (_listName == 'A') {
		    // $scope.pickedItems[0][parseInt(object.item.attr('pickedindex'))].is_seleted
		    // = null; // clear any selected states when they are
		    // dropped
		    $scope.pickedItems[0] = angular.copy($scope.pickedItems[0]);
		    
		}
		$(object.item).removeClass('dragging');
		console.log("list " + _listName + ": stop");// ,
		// INDEX:"+object.item.attr('pickedindex'));
	    },
	    update : function(event, object) {
		console.log("list " + _listName + ": update");
	    }
	};
	return options;
    };

    $scope.addEntry = function() {
	$scope.$parent.selectedOrder.entries.push({
	    id : 'new',
	    tempId : Math.floor((Math.random() * 1000000000) + 1),
	    odr_cur_orders_id : null,
	    inv_cfg_mat_types_id : null,
	    inv_cfg_mat_brands_id : null,
	    quantity : 1,
	    types : [],
	    pickeditems : [],
	    // pick_list_quantity : 0,
	    inv_cfg_uom_id : 1
	});
    }

    // Watch and update order changes.
    $scope.$watch('selectedOrder', function(newValue, oldValue) {

	if (!angular.equals(newValue, oldValue)) {
	    if (typeof (oldValue) == 'undefined' || oldValue == null || newValue.id != oldValue.id) {// $scope.$parent.lastSelectedOrderId){//
		// typeof(oldValue)!='undefined'&&typeof(oldValue.id)!='undefined'
		// $scope.lastSelectedOrderId
		// ==
		// null
		// || )
		// { //
		// reads
		// parent
		// $scope.$parent.lastSelectedOrderId = newValue.id
		// $scope.$parent.selectedOrderChanged = false; // writes parent
		$scope.idChanged = true;

		if ($scope.selectedOrderTimeout) {
		    clearTimeout($scope.selectedOrderTimeout);
		}
		$scope.selectedOrderTimeout = setTimeout(function() {
		    // additional block latch
		    $scope.idChanged = false;
		}, 100);
		return;
	    }
	    if ($scope.idChanged) { // block all change actions if 100 ms within
		// id change event.
		return;
	    }
	    var newEntries = newValue.entries;
	    var oldEntries = oldValue.entries;
	    for (var iEntries = 0; iEntries < newEntries.length; iEntries++) {
		if (typeof (oldEntries[iEntries]) == 'undefined' || newEntries[iEntries]['inv_cfg_mat_brands_id'] != oldEntries[iEntries]['inv_cfg_mat_brands_id']) {
		    (function(ihold) {
			newEntries[ihold]['inv_cfg_mat_types_id'] = null; // Responsible
			// for
			// detatching
			// Orders

			$sails.post('/inventory/get-types-by-brand', {
			    brand : newEntries[ihold]['inv_cfg_mat_brands_id']
			}).success(function(data) {
			    if (data.success) {
				var types = data.data;
				$timeout(function() {
				    newEntries[ihold].types = [];
				    for (var i = 0; i < types.length; i++) {
					newEntries[ihold].types.push({
					    id : types[i].id,
					    type : types[i].type
					});
				    }
				}, 0);
			    }
			});
		    })(iEntries);
		}
	    }

	    $rootScope.changes_pending = true;

	    // if($('#selectedOrder_nms_cur_contacts_id').hasClass('ng-dirty')){
	    // $('#selectedOrder_nms_cur_contacts_id').valid();
	    // alert('somedirty');
	    // }

	    // $('#' + "fullorder").valid();
	}
    }, true);

    // Watch and update types comboboxes
    // $scope.$watch('$parent.selectedOrder.entries', function(newValue,
    // oldValue) {
    // if (!angular.equals(newValue, oldValue) && typeof (oldValue) !=
    // 'undefined') {
    //
    //	    
    //
    // }
    // }, true);

    $scope.deleteOrder = function() {
	$sails.post('/orders/destroy', {
	    order : $scope.$parent.selectedOrder
	}).success(function(data) {
	    if (data.error != undefined) { // USER NO LONGER LOGGED
		location.reload(); // Will boot back to login
	    }
	    if (data.success) {
		$sails.post("/orders/pushdestroyorder", {
		    order : $scope.$parent.selectedOrder
		}, function(data) {
		    if (data.error != undefined) { // USER NO LONGER
			// LOGGED
			location.reload(); // Will boot back to login
		    }
		});
		$timeout(function() {
		    $scope.$parent.selectedOrder = null;
		}, 0);
	    }
	}).error(function(data) {
	    alert('err!');
	});
    }

    $scope.saveOrder = function(tab) {
	$timeout(function() {
	    var founderrors = false;
	    $('#' + "fullorder").valid(); // this was blocked at some
	    // point for some reason..
	    if ($rootScope.validator["fullorder"].numberOfInvalids() > 0) { // error
		founderrors = true;
	    }
	    // $('#entries_datatable').find('.rowquantity').valid();

	    if (!founderrors) {
		// TODO- maybe clone and strip "types" excessive data
		$sails.post("/orders/save", {
		    order : $scope.$parent.selectedOrder
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			location.reload(); // Will boot back to login
		    }
		    if (data.success) {
			var order = data.data;
			$scope.$parent.selectedOrder = order;
			toastr.success('Order <b>' + $scope.selectedOrder.id + '</b> was updated.', 'Success', {
			    "closeButton" : true,
			    "debug" : false,
			    "newestOnTop" : false,
			    "progressBar" : false,
			    "positionClass" : "toast-top-right",
			    "preventDuplicates" : false,
			    "showDuration" : "300",
			    "hideDuration" : "1000",
			    "timeOut" : "5000",
			    "extendedTimeOut" : "1000",
			    "showEasing" : "swing",
			    "hideEasing" : "linear",
			    "showMethod" : "fadeIn",
			    "hideMethod" : "fadeOut"
			});

			// $scope.$parent.selectedOrder.id = null;// ensures
			// changed value. = null;//.id = order.id;// =
			// null;//.id = order.id;

			$sails.post("/orders/pushorder", {
			    orderId : order.id
			}, function(data) {
			    if (data.error != undefined) { // USER NO LONGER
				// LOGGED
				location.reload(); // Will boot back to login
			    }
			});

			$timeout(function() {
			    delete $scope.order_saving;
			    resetOrderForms();
			    $scope.$parent.selectedOrder = order; // may or
			    // may not
			    // trigger
			    // change
			    // because
			    // of
			    // updating
			    // ID's on
			    // entries

			    // $scope.$parent.lastSelectedOrderId = null; //
			    // should ensure blocked change event
			    $rootScope.changes_pending = false;
			    // Datatable is update via socket emit from this
			    // update.

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});

		$scope.order_saving = true;
	    }
	}, 0);
    };

    // var vm = this;
    // vm.blockOrderSelectedModified = true;

    // $rootScope.clearOrder = function() {
    // // vm.watchEnabled = false;
    //
    // resetOrderForms();
    // }
    //
    // $scope.$watch('selectedOrder', function(newValue, oldValue) {
    // if (!angular.equals(newValue, oldValue)) {
    // if ($scope.selectedOrder == null) {
    // $scope.selectedOrderChanged = true;
    // return;
    // }
    // if ($scope.selectedOrderChanged) {
    // $scope.selectedOrderChanged = false;
    // } else {
    // $rootScope.changes_pending = true;
    // }
    //
    // }
    // }, true);
    //

    function resetOrderForms() {
	if ($('form#' + "fullorder").length > 0 && $rootScope.validator && $rootScope.validator["fullorder"]) {
	    $rootScope.validator["fullorder"].resetForm();
	    $('form#' + "fullorder" + '.validate-has-error').removeClass('validate-has-error');
	}
    }

})

.controller(
    'OrdersDatatable',
    function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder, $sails, $modal, $filter, $dropdowns, $user) {// $contact

	var vm = this;
	vm.pageReset = false;

	$scope.dropdowns = $dropdowns;

	$rootScope.changes_pending = false;
	$rootScope.selectAll = {
	    checked : false,
	    pagemode : true,
	    pagecount : 0,
	    filteredcount : 0,
	    persistpagemodemessage : false,
	    pagemodemessagevisible : false,
	    count : 0

	};

	$scope.selectAllDropdownSelectCustom0Qty = function() {
	    $rootScope.selectAll.checked = null;
	};

	$scope.selectAllPages = function() {
	    $rootScope.selectAll.pagemode = false;
	    $scope.doSelectAllDropdownSelectAll();
	    $scope.ordersDatatable.dataTable.api().draw(false);
	};

	$scope.checkSelectAllState = function() {
	    if (!$scope.ordersDatatable) {
		return;
	    }
	    var selectedCount = 0;
	    var areSelected = false;
	    var allSelected = true;

	    var tempSelected = $scope.ordersDatatable.dataTable.fnGetData();
	    for (var i = 0; i < tempSelected.length; ++i) {
		if (tempSelected[i].selected === true) {
		    selectedCount++;
		}
	    }

	    if ($rootScope.selectAll.pagemode) {
		var anNodes = $scope.ordersDatatable.dataTable.find('tbody tr');
		for (var i = 0; i < anNodes.length; ++i) {
		    var tempRow = $scope.ordersDatatable.dataTable.fnGetData(anNodes[i]);
		    if (tempRow == null) {
			continue;
		    }
		    if (tempRow.selected !== true) {
			allSelected = false;
		    } else {
			areSelected = true;
		    }
		}

	    } else {

		// / from FILTERED data
		var tempData = $scope.ordersDatatable.dataTable._('tr', {
		    "filter" : "applied"
		}); // $scope.ordersDatatable.dataTable.fnGetData();
		for (var i = 0; i < tempData.length; i++) {
		    if (tempData[i].selected !== true) {
			allSelected = false;
		    } else {
			// selectedCount++;
			areSelected = true;
		    }
		    // var tempRow = tempData[i];
		    // tempRow.selected = true;
		    // $scope.ordersDatatable.dataTable.fnUpdate(true,
		    // $scope.index_aoData[tempRow.id], 0, false, false);
		    // }
		}

		// $rootScope.selectAll.pagecount = tempData.length;

		// var tempData =
		// $scope.ordersDatatable.dataTable.fnGetData();
		// for (var i = 0; i < tempData.length; i++) {
		// if (tempData[i].selected !== true) {
		// allSelected = false;
		// } else {
		// areSelected = true;
		// }
		// }
	    }
	    $timeout(function() {
		if (areSelected == false) { // All unchecked - SUBSEARCH?
		    $rootScope.selectAll.checked = false;
		} else if (allSelected == true) {
		    $rootScope.selectAll.checked = true;
		} else {
		    $rootScope.selectAll.checked = null;
		}
		$rootScope.selectAll.count = selectedCount;
	    }, 0);
	    // $scope.ordersDatatable.dataTable.api().draw(false);
	}

	$scope.clickSelectAllCheckbox = function() {
	    if ($rootScope.selectAll.checked === false) { // if NONE are
		// checked - check
		// all
		$scope.selectAllDropdownSelectAll();
	    } else { // otherwise check nothing - clearing partials
		$scope.selectAllDropdownUncheck();
	    }
	}

	$scope.selectAllDropdownSelectAll = function() {
	    $timeout(function() {
		$rootScope.selectAll.checked = true;
		$rootScope.selectAll.pagemode = true;
		$rootScope.selectAll.persistpagemodemessage = true;
		$rootScope.selectAll.pagemodemessagevisible = true;
		$scope.doSelectAllDropdownSelectAll();

		$scope.ordersDatatable.dataTable.api().draw(false);
	    }, 0);
	}

	$scope.doSelectAllDropdownSelectAll = function() {

	    if ($rootScope.selectAll.pagemode) { // 1 page mode
		var anNodes = $scope.ordersDatatable.dataTable.find('tbody tr');
		for (var i = 0; i < anNodes.length; ++i) {
		    var tempRow = $scope.ordersDatatable.dataTable.fnGetData(anNodes[i]);
		    if (tempRow.selected !== true) {
			tempRow.selected = true;
			$scope.ordersDatatable.dataTable.fnUpdate(true, $scope.index_aoData[tempRow.id], 0, false, false);
		    }

		}
		$rootScope.selectAll.pagecount = anNodes.length;
		$rootScope.selectAll.filteredcount = $scope.ordersDatatable.dataTable._('tr', {
		    "filter" : "applied"
		}).length;
	    } else {
		// var anNodes = $scope.ordersDatatable.dataTable.find('tbody
		// tr');
		// $scope.ordersDatatable.dataTable.fnGetData($scope.index_aoData[[0].id])
		//		 
		//		 
		// var data = '';

		var tempData = $scope.ordersDatatable.dataTable._('tr', {
		    "filter" : "applied"
		}); // $scope.ordersDatatable.dataTable.fnGetData();
		for (var i = 0; i < tempData.length; i++) {
		    if (!tempData[i].selected) {
			var tempRow = tempData[i];
			tempRow.selected = true;
			$scope.ordersDatatable.dataTable.fnUpdate(true, $scope.index_aoData[tempRow.id], 0, false, false);
		    }
		}
		$rootScope.selectAll.pagecount = tempData.length;

	    }

	}

	$scope.selectAllDropdownUncheck = function() {
	    if ($rootScope.selectAll.pagemode) { // 1 page
		var anNodes = $scope.ordersDatatable.dataTable.find('tbody tr');
		for (var i = 0; i < anNodes.length; ++i) {
		    var tempRow = $scope.ordersDatatable.dataTable.fnGetData(anNodes[i]);
		    if (tempRow.selected === true) {
			tempRow.selected = false;
			$scope.ordersDatatable.dataTable.fnUpdate(false, $scope.index_aoData[tempRow.id], 0, false, false);
		    }
		}
	    } else {
		var tempData = $scope.ordersDatatable.dataTable.fnGetData();
		for (var i = 0; i < tempData.length; i++) {
		    if (tempData[i].selected) {
			var tempRow = tempData[i];
			tempRow.selected = false;
			$scope.ordersDatatable.dataTable.fnUpdate(false, i, 0, false, false);
		    }
		}
	    }

	    $timeout(function() {
		$rootScope.selectAll.checked = false;

		$scope.ordersDatatable.dataTable.api().draw(false);
	    }, 0);
	}

	$scope.selectAllDropdownSelectNone = function() {
	    $timeout(function() {
		$rootScope.selectAll.checked = false;
		$rootScope.selectAll.pagemode = true;
		var tempData = $scope.ordersDatatable.dataTable.fnGetData();
		for (var i = 0; i < tempData.length; i++) {
		    if (tempData[i].selected) {
			var tempRow = tempData[i];
			tempRow.selected = false;
			$scope.ordersDatatable.dataTable.fnUpdate(false, i, 0, false, false);
			// $scope.ordersDatatable.dataTable.fnUpdate(tempRow,
			// i, undefined, false, false);
		    }
		}
		$scope.ordersDatatable.dataTable.api().draw(false);
	    }, 0);
	}

	$scope.outerSelectCheckboxButton = function(event) {
	    // alert('inside');
	    if (!$(event.target).hasClass('block-dropdown')) {
		$timeout(function() {
		    // $('#select_lots_dropdown').addClass('open');
		    $('#select_lots_dropdown_caret').click();
		}, 0);
	    }
	}

	$rootScope.orderUpdate = function(order) {
	    // alert('anupdate');
	    $timeout(function() {
		if ($scope.index_aoData[order.id] == undefined) { // NEW
		    $scope.ordersDatatable.dataTable.fnAddData(order, false);// ,
		    // $scope.index_aoData[order.id],
		    // undefined,
		    // true);
		} else if (order.is_deleted) { // DELETED
		    var tempRow = $scope.ordersDatatable.dataTable.fnGetData($scope.index_aoData[order.id]);
		    if (tempRow) {
			$scope.ordersDatatable.dataTable.fnDeleteRow($scope.index_aoData[order.id], null, false);

			if ($scope.selectedOrder != null && $scope.selectedOrder.id == order.id) {
			    $scope.selectedOrder = null; //
			}
		    }
		} else { // UPDATED
		    var tempRow = $scope.ordersDatatable.dataTable.fnGetData($scope.index_aoData[order.id]);
		    if (tempRow) {
			order.selected = tempRow.selected;
			$scope.ordersDatatable.dataTable.fnUpdate(order, $scope.index_aoData[order.id], undefined, false);
		    }
		}
		$scope.ordersDatatable.dataTable.api().draw(false);
		$scope.checkSelectAllState();

		// This update below really isn't necessary.. Beware- this will
		// need to maintain entry is_deleted states otherwise it might
		// be whacko
		// interupts/overwrites
		// form fields other users when editing the same id.
		// if ($scope.selectedOrder != null && $scope.selectedOrder.id
		// == order.id && !angular.equals($scope.selectedOrder, order))
		// {
		// $scope.selectedOrder = angular.copy(order);
		// $scope.lastSelectedOrderId = true;
		// }
	    }, 0);
	};
	$scope.template = null;
	$rootScope.newOrderTemplateModal = {
	    name : null
	};
	$rootScope.shortSelectOptions = {
	    minimumInputLength : 1
	};
	$rootScope.longSelectOptions = {
	    minimumInputLength : 2
	};

	// Selected Order
	$scope.selectedOrder = null;
	// $scope.selectedOrderChanged = false;

	var blankSearch = {
	    id : '',
	    date_MIN : moment().subtract(29, 'days').format('YYYY-MM-DD'),
	    date_MAX : moment().format('YYYY-MM-DD'),
	};
	$scope.orders_search = angular.copy(blankSearch);

	$scope.$watch('orders_search', function() {
	    // $scope.ordersDatatable.dataTable.api().search('PZERO').draw();
	    // $scope.ordersDatatable.dataTable.columns('type').search('PZERO').draw();

	    // $scope.ordersDatatable.dataTable.draw();
	    // $scope.tableId
	    if ($scope.ordersDatatable) {
		$scope.ordersDatatable.dataTable.api().draw();
	    }
	}, true);

	vm.rowClicked = rowClicked;
	vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	    dataSrc : 'data',
	    url : '/orders/get-orders-history',
	    type : 'POST'
	}).withOption('fnServerParams', function(aoData) {
	    aoData.push({
		name : 'id',
		value : $scope.orders_search.id
	    });
	    aoData.push({
		name : 'date_MIN',
		value : $scope.orders_search.date_MIN
	    });
	    aoData.push({
		name : 'date_MAX',
		value : $scope.orders_search.date_MAX
	    });
	}).withOption('rowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    $('td', nRow).unbind('click');
	    $('td', nRow).bind('click', function(event) {
		// $scope.$apply(function() {
		if (($(event.target).prop('tagName') == 'INPUT' && $(event.target).attr('type') == 'checkbox')) {
		    if ($(event.target).is(':checked')) {
			aData.selected = true;
		    } else {
			delete aData.selected;// = false;
		    }

		    $rootScope.selectAll.persistpagemodemessage = false;
		    $rootScope.selectAll.pagemodemessagevisible = false;
		    $scope.checkSelectAllState();
		} else {
		    vm.rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull);
		}
		// });
	    });
	    $(nRow).removeClass('selected');
	    if ($scope.selectedOrder != null && aData.id == $scope.selectedOrder.id) {
		$(nRow).addClass('selected');
	    }
	    return nRow;
	}).withOption('drawCallback', function(settings) {
	    $scope.index_aoData = {};
	    for ( var aoDataIndex in settings.aoData) {
		$scope.index_aoData[settings.aoData[aoDataIndex]['_aData'].id] = aoDataIndex;
	    }
	    $timeout(function() {
		if ($rootScope.selectAll.persistpagemodemessage) {
		    $rootScope.selectAll.persistpagemodemessage = false;
		} else {
		    $rootScope.selectAll.pagemodemessagevisible = false;
		}
	    }, 0);
	    $scope.checkSelectAllState(); // check state on all draws
	    // alert('drawcallback');
	})
	// .withOption('stateSave', true)
	.withPaginationType('full_numbers').withDOM('rt<"row"<"col-lg-4"i><"col-lg-8"p>>'); // <"row"<"col-xs-12"fl>>
	// l length
	// r processing
	// f filtering
	// t table
	// i info
	// p pagination

	// $scope.ordersDatatable.dataTable.fnGetData()

	vm.dtColumns = [

	DTColumnBuilder.newColumn('selected').withTitle('&nbsp').notSortable().renderWith(function(data, type, full, meta) {
	    return '<input type="checkbox" ' + (full.selected ? 'checked="checked"' : '') + '>';
	}), DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('nms_cur_contacts_id').withTitle('Contact ID').notVisible(), DTColumnBuilder.newColumn('name').withTitle('Customer'), DTColumnBuilder.newColumn('odr_cfg_order_state_id').withTitle('State ID').notVisible(),
	    DTColumnBuilder.newColumn('state').withTitle('State'), DTColumnBuilder.newColumn('last_modified').withTitle('Last Modified'), DTColumnBuilder.newColumn('user_name').withTitle('Username') ];

	//

	$scope.$on('event:dataTableLoaded', function(event, data) {
	    var allowFilter = [ 'orders' ];
	    if (data.id.indexOf(allowFilter) == -1) {
		return;
	    }
	    $scope.tableId = data.id; // Record table ID, for refreshes later.
	    $scope.ordersDatatable = data;

	    // / Building column builder index
	    $scope.column_index = {};
	    var aoColumns = data.dataTable.api().context[0].aoColumns;
	    for ( var column in aoColumns) {
		$scope.column_index[aoColumns[column].mData] = parseInt(column);
	    }

	    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
		// Break out returning false if any of the filters do not
		// succeed.
		if ($.inArray(settings.nTable.getAttribute('id'), allowFilter) == -1) {
		    // if not table should be ignored
		    return true;
		}

		for ( var sfield in $scope.orders_search) {
		    // if (sfield == 'id') {
		    // if ($scope.orders_search.id != '' &&
		    // $scope.orders_search.id != null &&
		    // data[$scope.column_index['id']] !=
		    // $scope.orders_search.id) {
		    // return false;
		    // }
		    // } else if (sfield == 'brand' || sfield == 'type' ||
		    // sfield == 'uom' || sfield == 'lotStatus' || sfield ==
		    // 'location') {
		    // if ($scope.orders_search[sfield] instanceof Array &&
		    // $scope.orders_search[sfield].length > 0 &&
		    // $scope.orders_search[sfield].indexOf(parseInt(data[$scope.column_index[sfield
		    // + 'ID']])) == -1) {
		    // return false;
		    // }
		    // } else if (sfield == 'quantity_MIN' || sfield ==
		    // 'quantity_MAX') {
		    // if (sfield == 'quantity_MIN' &&
		    // $scope.orders_search.quantity_MIN !== '' &&
		    // $scope.orders_search.quantity_MIN != null &&
		    // parseInt(data[$scope.column_index['quantity']]) <
		    // parseInt($scope.orders_search.quantity_MIN)) {
		    // return false;
		    // } else if (sfield == 'quantity_MAX' &&
		    // $scope.orders_search.quantity_MAX !== '' &&
		    // $scope.orders_search.quantity_MAX != null &&
		    // parseInt(data[$scope.column_index['quantity']]) <
		    // parseInt($scope.orders_search.quantity_MAX)) {
		    // return false;
		    // }
		    // } else if (sfield == 'date_added_MIN' || sfield ==
		    // 'date_added_MAX') {
		    // if (sfield == 'date_added_MIN' &&
		    // $scope.orders_search.date_added_MIN !== '' &&
		    // $scope.orders_search.date_added_MIN != null &&
		    // $scope.orders_search.date_added_MIN !== null &&
		    // (data[$scope.column_index['date_added']]) <
		    // ($scope.orders_search.date_added_MIN)) {
		    // return false;
		    // } else if (sfield == 'date_added_MAX' &&
		    // $scope.orders_search.date_added_MAX !== '' &&
		    // $scope.orders_search.date_added_MAX != null &&
		    // $scope.orders_search.date_added_MAX !== null
		    // && (data[$scope.column_index['date_added']]) >
		    // ($scope.orders_search.date_added_MAX)) {
		    // return false;
		    // }
		    // } else if (sfield == 'price_MIN' || sfield ==
		    // 'price_MAX') {
		    // if (sfield == 'price_MIN' &&
		    // $scope.orders_search.price_MIN !== '' &&
		    // $scope.orders_search.price_MIN != null &&
		    // parseInt(data[$scope.column_index['price']].replace('$',''))
		    // < parseInt($scope.orders_search.price_MIN)) {
		    // return false;
		    // } else if (sfield == 'price_MAX' &&
		    // $scope.orders_search.price_MAX !== '' &&
		    // $scope.orders_search.price_MAX != null &&
		    // parseInt(data[$scope.column_index['price']].replace('$',''))
		    // > parseInt($scope.orders_search.price_MAX)) {
		    // return false;
		    // }
		    // } else if ($scope.orders_search[sfield] instanceof Array
		    // && $scope.orders_search[sfield].length > 0 &&
		    // $scope.orders_search[sfield].indexOf(data[$scope.column_index[sfield]])
		    // == -1) {
		    // return false;
		    // } else if (typeof ($scope.orders_search[sfield]) ==
		    // 'string' && $scope.orders_search[sfield] != '' &&
		    // $scope.orders_search[sfield] != null &&
		    // data[$scope.column_index[sfield]].indexOf($scope.orders_search[sfield])
		    // == -1) {
		    // return false;
		    // }
		}
		return true;
	    });

	});

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
			pos : ($('#order_form').length < 1) ? 0 : ($('#order_form').offset().top - 8),
			ease : Power4.easeOut,
			onUpdate : function() {
			    $(window).scrollTop(obj.pos);
			}
		    });

		    return;
		}
	    }

	    $sails.post("/orders/get-order", {
		id : aData.id
	    }).success(function(data) {
		if (data.error != undefined) { // USER NO LONGER LOGGED
		    location.reload(); // Will boot back to login
		}
		if (data.success) {
		    $timeout(function() {
			$scope.selectedOrder = angular.copy(data.data);
			// $scope.selectedOrder.price =
			// isNaN(parseFloat($scope.selectedOrder.price)) ? 0 :
			// parseFloat($scope.selectedOrder.price);
			// $scope.selectedOrder.quantity =
			// isNaN(parseInt($scope.selectedOrder.quantity)) ? 0 :
			// parseInt($scope.selectedOrder.quantity);
			// $scope.selectedOrder.entries = [];
			$rootScope.changes_pending = false;
			$scope.ordersDatatable.dataTable.api().draw(false); // redrawing
		    }, 0);

		}
	    });

	    // it
	    // makes
	    // it
	    // see
	    // the
	    // matched
	    // selectedOrder
	    // id
	    // and
	    // draw
	    // it
	    // green.
	}

	$scope.addOrder = function() {
	    var blankOrder = {
		"id" : 'new',
		nms_cur_contacts_id : null,
		odr_cfg_order_state_id : null,
		entries : [],
		"user_name" : $user.username,
	    };
	    $scope.selectedOrder = null; // hopefully trips any oldValues to
	    // be null on change watchers
	    $scope.selectedOrder = angular.copy(blankOrder);
	    $rootScope.changes_pending = false;

	    $scope.ordersDatatable.dataTable.api().draw(false);
	    var obj = {
		pos : $(window).scrollTop()
	    };
	    TweenLite.to(obj, 0.3, {
		pos : ($('#order_form').length < 1) ? 0 : ($('#order_form').offset().top - 8),
		ease : Power4.easeOut,
		onUpdate : function() {
		    $(window).scrollTop(obj.pos);
		}
	    });
	};

	(function() {
	    $sails.get('/inventorymanagementstudio/getordersattributes').success(function(data) {

		var data = data.result;

		$scope.contacts = [];
		for (var i = 0; i < data.contacts.length; i++) {
		    $scope.contacts.push({
			id : data.contacts[i].id,
			label : data.contacts[i].name
		    });
		}

		$scope.dropdowns = {};

		$scope.dropdowns.odr_cfg_order_states = [];
		for (var i = 0; i < data.odr_cfg_order_states.length; i++) {
		    $scope.dropdowns.odr_cfg_order_states.push({
			id : data.odr_cfg_order_states[i].id,
			label : data.odr_cfg_order_states[i].state
		    });
		}

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

	    $sails.get('/template/orders').success(function(data) {
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
			    angular.forEach($scope.orders_search, function(value, key) {
				if (key == 'somesubtables') {
				    angular.forEach(value, function(innerValue, innerKey) {
					if ($scope.search_templates[i].data[key] && $scope.search_templates[i].data[key][innerKey]) {
					    $scope.orders_search[key][innerKey] = $scope.search_templates[i].data[key][innerKey];

					} else {
					    $scope.orders_search[key][innerKey] = null;
					}
				    });
				} else if ($scope.search_templates[i].data[key]) {
				    $scope.orders_search[key] = $scope.search_templates[i].data[key];
				} else {
				    $scope.orders_search[key] = null;
				}
			    });

			    // $rootScope.search_inventory = $scope.inventory;//
			    // =
			    // $scope.search_templates[i].data;
			    // $rootScope.search_orders hopefully will stay
			    // tied..
			    // $rootScope.newOrderTemplateModal.id =
			    // $scope.search_templates[i].id;
			    $rootScope.newOrderTemplateModal.name = $scope.search_templates[i].label;
			    $rootScope.newOrderTemplateModal.id = $scope.search_templates[i].id;
			}
		    }
		}
	    }
	});

	$scope.clearTemplates = function() {
	    $rootScope.newOrderTemplateModal.name = null;
	    $rootScope.newOrderTemplateModal.id = null;
	    $scope.template = null;
	    $scope.orders_search = angular.copy(blankSearch); // clears
	    // the
	    // order
	    // search
	    // parameters
	}

	$scope.deleteTemplate = function() {
	    $rootScope.modalPopup({
		title : 'Confirm Delete',
		size : 'sm',
		message : 'Are you sure you want to delete the template: <b>' + $rootScope.newOrderTemplateModal.name + '</b>',
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
			id : $rootScope.newOrderTemplateModal.id,
			location : 'orders'
		    }).success(function(data) {
			if (data.error != undefined) { // USER NO LONGER LOGGED
			    // IN!!!!!
			    location.reload(); // Will boot back to login
			    // screen
			}
			if (data.success) {
			    $scope.template = null;
			    $rootScope.newOrderTemplateModal.id = null;
			    $rootScope.newOrderTemplateModal.name = null;
			    $scope.orders_search = angular.copy(blankSearch);
			    $timeout(function() {
				$sails.get('/template/orders').success(function(data) {
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

	$rootScope.saveOrderTemplate = function() {
	    $rootScope.newOrderTemplateModal.id = null;
	    for (var i = 0; i < $scope.search_templates.length; i++) {
		if ($scope.search_templates[i].label == $rootScope.newOrderTemplateModal.name) { // matching
		    // up
		    // against
		    // existing
		    // template
		    // name
		    $rootScope.newOrderTemplateModal.id = $scope.search_templates[i].id;
		}
	    }
	    if ($rootScope.newOrderTemplateModal.id == null) {
		$rootScope.currentModal.dismiss('save');
	    } else {
		$rootScope.modalPopup({
		    title : 'Confirm Overwrite',
		    size : 'sm',
		    message : 'Are you sure you want to save over the existing template: <b>' + $rootScope.newOrderTemplateModal.name + '</b>',
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
	    // $rootScope.newOrderTemplateModal.name = null;
	    $rootScope.currentModal = $modal.open({
		templateUrl : 'save-orders-template-modal',
		size : 'md',
		backdrop : true
	    });
	    $rootScope.currentModal.result.then(function(selectedItem) {
	    }, function(triggerElement) {
		if (triggerElement == 'save') {
		    $sails.post('/template/save', {
			id : $rootScope.newOrderTemplateModal.id,
			location : 'orders',
			name : $rootScope.newOrderTemplateModal.name,
			data : $scope.orders_search
		    }).success(function(data) {
			if (data.error != undefined) { // USER NO LONGER LOGGED
			    // IN!!!!!
			    location.reload(); // Will boot back to login
			    // screen
			}
			if (data.success) {
			    $rootScope.newOrderTemplateModal.id = data.template.id;
			    $scope.template = data.template.id;
			    $timeout(function() {
				$sails.get('/template/orders').success(function(data) {
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

	// $scope.$watch('orders_search.brand', function(newValue, oldValue) {
	// if (!angular.equals(newValue, oldValue)) {
	// $sails.post('/orders/get-types-in-brands', {
	// brands : newValue
	// }).success(function(data) {
	// if (data.success) {
	// $timeout(function() {
	// var types = data.data;
	// $scope.dropdowns.types = [];
	// for (var i = 0; i < types.length; i++) {
	// $scope.dropdowns.types.push({
	// id : types[i].id,
	// label : types[i].type
	// });
	// }
	// }, 0);
	// }
	// });
	// }
	// });

    });