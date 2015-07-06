'use strict';
angular.module('xenon.controllers.materials', [])

.controller('CategoriesDatatable', function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder, $sails, $modal) {// $contact

    var vm = this;
    vm.pageReset = false;

    $scope.selectedCategory = null;
    // $scope.orders = [];

    vm.rowClicked = rowClicked;
    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	dataSrc : 'data',
	url : '/materials/get-categories',// search',
	type : 'POST'
    }).withOption('fnServerParams', function(aoData) {
	// aoData.inventory = $rootScope.inventory_search;
	// $timeout(function() { // Whenever the table searches, it clears
	// // the selected
	// if ($rootScope.getInventorySelectedInventory()) { // passes through
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
	if ($scope.selectedCategory != null && aData.id == $scope.selectedCategory.id) {
	    $(nRow).addClass('selected');
	}
	return nRow;
    }).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"fl>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
    // l length
    // r processing
    // f filtering
    // t table
    // i info
    // p pagination
    vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('category').withTitle('Category') ];

    $scope.$on('event:dataTableLoaded', function(event, data) {
	if ($('#' + data.id).parent().parent().attr('id') == 'categories_panel') {
	    $scope.tableId = data.id; // Record table ID, for refreshes
	    // later.
	} else if ($('#' + data.id).parent().parent().attr('id') == 'types_panel') {
	    $scope.typesTableId = data.id; // Record table ID, for refreshes
	    // later.
	} else if ($('#' + data.id).parent().parent().attr('id') == 'brands_panel') {
	    $scope.brandsTableId = data.id; // Record table ID, for refreshes
	    // later.
	}
    });

    $rootScope.updateCategoriesDataTable = function(selectedInventory, event, args) {
	if ($scope.tableId) {
	    // if ($rootScope.getInventorySelectedInventory) {
	    // $scope.selectedInventory =
	    // angular.copy($rootScope.getInventorySelectedInventory());
	    // }
	    $('#' + $scope.tableId).DataTable().ajax.reload(function() {
	    }, vm.pageReset);
	    vm.pageReset = false;
	}
    }

    $scope.resetCategoriesPageNumber = function() {
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
    // $scope.exportList = function() {
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
    // }
    /*
     * $scope.$on('refreshContactsx', function(event, args){
     * //console.log('deb'); vm.contact = args;
     * $timeout(vm.dtOptions.reloadData,500); //(); });
     */

    function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {

	$scope.$apply(function() {
	    $scope.selectedCategory = angular.copy(aData);
	});

	$(nRow).closest('table').find('tr').removeClass('selected');
	$(nRow).addClass('selected');
    }

    $scope.isCategorySelected = function() {
	return $scope.selectedCategory != null;
    }

    $scope.addCategory = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'add-category-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.category = '';
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/materials/create-category', {
		    categoryName : $rootScope.currentModal.category
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO
			// LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to
			// login screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedCategory = null;
			    $scope.resetCategoriesPageNumber();
			    $scope.updateCategoriesDataTable();

			}, 0);
			// $scope.retrieveId = $scope.selectedCode;
			// $rootScope.updateDpCodesDataTable();
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.editCategory = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'edit-category-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.category = $scope.selectedCategory.category;
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/materials/update-category', {
		    categoryId : $scope.selectedCategory.id,
		    categoryName : $rootScope.currentModal.category
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO
			// LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to
			// login screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedCategory.category = $rootScope.currentModal.category;  // triggers change on watching 'selectedBrand'  Types datatable
			    // $scope.resetCategorysPageNumber();
			    $scope.updateCategoriesDataTable();

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.deleteCategory = function() {

	$rootScope.modalPopup({
	    title : 'Confirm Delete',
	    size : 'sm',
	    message : 'Are you sure you want to delete <b>' + $scope.selectedCategory.category + '</b> and all of it\'s Types?',
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
		$sails.post('/materials/destroy-category', {
		    categoryID : $scope.selectedCategory.id
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedCategory = null;
			    // $scope.resetCategorysPageNumber();
			    $scope.updateCategoriesDataTable();

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    } else {
	    }
	});

    }
    
    // $scope.editDatatableRow = function(modal_id, modal_size, modal_backdrop)
    // {
    // $sails.post("/inventory/getinventory", {
    // id : $scope.selectedInventory.id
    // }).success(function(data) {
    // if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
    // location.reload(); // Will boot back to login screen
    // }
    // if (data.success) {
    // // $rootScope.modalSelectedOrder =
    // // angular.copy(data.dpcode);
    // // $rootScope.currentModal = $modal.open({
    // // templateUrl : modal_id,
    // // size : modal_size,
    // // backdrop : typeof modal_backdrop == 'undefined' ? true :
    // // modal_backdrop
    // // });
    // // $rootScope.currentModal.result.then(function(selectedItem)
    // // {
    // // }, function(triggerElement) {
    // // if (triggerElement == 'save') {
    // // $sails.post('/dpcodes/save',
    // // $rootScope.modalSelectedCode).success(function(data) {
    // // if (data.error != undefined) { // USER NO
    // // // LONGER LOGGED
    // // // IN!!!!!
    // // location.reload(); // Will boot back to
    // // // login screen
    // // }
    // // if (data.success) {
    // // $scope.retrieveId = $scope.selectedCode;
    // // $rootScope.updateDpCodesDataTable();
    // // }
    // // }).error(function(data) {
    // // alert('err!');
    // // });
    // // }
    // // });
    // }
    // }).error(function(data) {
    // alert('err!');
    // });
    // };

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
}).controller('BrandsDatatable', function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder, $sails, $modal) {// $contact

    var vm = this;
    vm.pageReset = false;

    $scope.selectedBrand = null;
    // $scope.orders = [];

    $scope.$watch('selectedCategory', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    $timeout(function() {
		$scope.selectedBrand = null;
		// $scope.user.is_modified = true;
		// $rootScope.user_modified = true;
		// alert('changedCategory');
		$scope.resetBrandsPageNumber();
		$scope.updateBrandsDataTable();
	    }, 0);
	}
    }, true);

    vm.rowClicked = rowClicked;
    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	dataSrc : 'data',
	url : '/materials/get-brands',// search',
	type : 'POST'
    }).withOption('fnServerParams', function(aoData) {
	aoData.push({
	    'name' : 'categoryId',
	    'value' : ($scope.selectedCategory ? $scope.selectedCategory.id : undefined)
	});
	// $timeout(function() { // Whenever the table searches, it clears
	// // the selected
	// if ($rootScope.getInventorySelectedInventory()) { // passes through
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
	if ($scope.selectedBrand != null && aData.id == $scope.selectedBrand.id) {
	    $(nRow).addClass('selected');
	}
	return nRow;
    }).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"fl>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
    // l length
    // r processing
    // f filtering
    // t table
    // i info
    // p pagination
    vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('brand').withTitle('Brand') ];

    $scope.updateBrandsDataTable = function(selectedInventory, event, args) {
	if ($scope.brandsTableId) {
	    // if ($rootScope.getInventorySelectedInventory) {
	    // $scope.selectedInventory =
	    // angular.copy($rootScope.getInventorySelectedInventory());
	    // }
	    $('#' + $scope.brandsTableId).DataTable().ajax.reload(function() {
	    }, vm.pageReset);
	    vm.pageReset = false;
	}
    }

    $scope.resetBrandsPageNumber = function() {
	vm.pageReset = true;
    }

    function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {

	$scope.$apply(function() {
	    $scope.selectedBrand = angular.copy(aData);
	});
	$(nRow).closest('table').find('tr').removeClass('selected');
	$(nRow).addClass('selected');
    }

    $scope.isBrandSelected = function() {
	return $scope.selectedBrand != null;
    }

    $scope.addBrand = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'add-brand-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.brand = '';
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/materials/create-brand', {
		    categoryId : $scope.selectedCategory.id,
		    brandName : $rootScope.currentModal.brand
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO
			// LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to
			// login screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedBrand = null;
			    $scope.resetBrandsPageNumber();
			    $scope.updateBrandsDataTable();

			}, 0);
			// $scope.retrieveId = $scope.selectedCode;
			// $rootScope.updateDpCodesDataTable();
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.editBrand = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'edit-brand-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.brand = $scope.selectedBrand.brand;
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/materials/update-brand', {
		    brandId : $scope.selectedBrand.id,
		    brandName : $rootScope.currentModal.brand
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO
			// LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to
			// login screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedBrand.brand = $rootScope.currentModal.brand;  // triggers change on watching 'selectedBrand'  Types datatable
			    // $scope.resetBrandsPageNumber();
			    $scope.updateBrandsDataTable();

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.deleteBrand = function() {

	$rootScope.modalPopup({
	    title : 'Confirm Delete',
	    size : 'sm',
	    message : 'Are you sure you want to delete <b>' + $scope.selectedBrand.brand + '</b> and all of it\'s Types?',
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
		$sails.post('/materials/destroy-brand', {
		    brandID : $scope.selectedBrand.id
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedBrand = null;
			    // $scope.resetBrandsPageNumber();
			    $scope.updateBrandsDataTable();

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    } else {
	    }
	});

    }

}).controller('TypesDatatable', function($scope, $rootScope, $timeout, DTOptionsBuilder, DTColumnBuilder, $sails, $modal) {// $contact

    var vm = this;
    vm.pageReset = false;

    $scope.selectedType = null;
    // $scope.orders = [];

    $scope.$watch('selectedBrand', function(newValue, oldValue) {
	if (!angular.equals(newValue, oldValue)) {
	    $timeout(function() {
		$scope.selectedType = null;
		// $scope.user.is_modified = true;
		// $rootScope.user_modified = true;
		// alert('changedCategory');
		$scope.resetTypesPageNumber();
		$scope.updateTypesDataTable();
	    }, 0);
	}
    }, true);

    vm.rowClicked = rowClicked;
    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
	dataSrc : 'data',
	url : '/materials/get-types',// search',
	type : 'POST'
    }).withOption('fnServerParams', function(aoData) {
	aoData.push({
	    'name' : 'brandId',
	    'value' : ($scope.selectedBrand ? $scope.selectedBrand.id : undefined)
	});
	// $timeout(function() { // Whenever the table searches, it clears
	// // the selected
	// if ($rootScope.getInventorySelectedInventory()) { // passes through
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
	if ($scope.selectedType != null && aData.id == $scope.selectedType.id) {
	    $(nRow).addClass('selected');
	}
	return nRow;
    }).withPaginationType('full_numbers').withDOM('<"row"<"col-xs-12"fl>>rt<"row"<"col-lg-4"i><"col-lg-8"p>>');
    // l length
    // r processing
    // f filtering
    // t table
    // i info
    // p pagination
    vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('type').withTitle('Type') ];

    $scope.updateTypesDataTable = function(selectedInventory, event, args) {
	if ($scope.typesTableId) {
	    // if ($rootScope.getInventorySelectedInventory) {
	    // $scope.selectedInventory =
	    // angular.copy($rootScope.getInventorySelectedInventory());
	    // }
	    $('#' + $scope.typesTableId).DataTable().ajax.reload(function() {
	    }, vm.pageReset);
	    vm.pageReset = false;
	}
    }

    $scope.resetTypesPageNumber = function() {
	vm.pageReset = true;
    }

    function rowClicked(nRow, aData, iDisplayIndex, iDisplayIndexFull) {

	$scope.$apply(function() {
	    $scope.selectedType = angular.copy(aData);
	});
	$(nRow).closest('table').find('tr').removeClass('selected');
	$(nRow).addClass('selected');
    }

    $scope.isTypeSelected = function() {
	return $scope.selectedType != null;
    }

    $scope.addType = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'add-type-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.type = '';
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/materials/create-type', {
		    brandId : $scope.selectedBrand.id,
		    typeName : $rootScope.currentModal.type
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO
			// LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to
			// login screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedType = null;
			    $scope.resetTypesPageNumber();
			    $scope.updateTypesDataTable();

			}, 0);
			// $scope.retrieveId = $scope.selectedCode;
			// $rootScope.updateDpCodesDataTable();
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.editType = function() {
	$rootScope.currentModal = $modal.open({
	    templateUrl : 'edit-type-modal',
	    size : 'md',
	    backdrop : true
	});
	$rootScope.currentModal.type = $scope.selectedType.type;
	$rootScope.currentModal.result.then(function(selectedItem) {
	}, function(triggerElement) {
	    if (triggerElement == 'save') {
		$sails.post('/materials/update-type', {
		    typeId : $scope.selectedType.id,
		    typeName : $rootScope.currentModal.type
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO
			// LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to
			// login screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedType.type = $rootScope.currentModal.type;
			    // $scope.resetTypesPageNumber();
			    $scope.updateTypesDataTable();

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    }
	});
    }

    $scope.deleteType = function() {

	$rootScope.modalPopup({
	    title : 'Confirm Delete',
	    size : 'sm',
	    message : 'Are you sure you want to delete type <b>' + $scope.selectedType.type + '</b>?',
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
		$sails.post('/materials/destroy-type', {
		    typeID : $scope.selectedType.id
		}).success(function(data) {
		    if (data.error != undefined) { // USER NO LONGER LOGGED
			// IN!!!!!
			location.reload(); // Will boot back to login
			// screen
		    }
		    if (data.success) {
			$timeout(function() {
			    $scope.selectedType = null;
			    // $scope.resetTypesPageNumber();
			    $scope.updateTypesDataTable();

			}, 0);
		    }
		}).error(function(data) {
		    alert('err!');
		});
	    } else {
	    }
	});

    }

});