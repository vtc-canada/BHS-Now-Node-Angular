'use strict';
angular.module('xenon.controllers', [])
.controller('UserSection', function($scope, $rootScope, $timeout, $state, $modal, $sails, Utility) {
    $scope.helpers = public_vars.helpers;
    var vm = this;

}).controller('ReportSearch', function($scope, $rootScope, $sce, $timeout, $filter, $reports, $reportselects, $sails, $http, $modal) {
    var vm = this;
    vm.$scope = $scope;
    $scope.reportselects = {};

    $scope.longSelectOptionsLen = function(length) {
	return {
	    minimumInputLength : length
	}
    };

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
		$timeout(function() {
		    // $rootScope.updateContactsTable();
		    // alert('searchReports');
		    $scope.reporthtml = null;
		}, 0);
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

	$sails.post('/reports/view', {
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
	    if (html.emit) {
		return;
	    }
	    $timeout(function() {
		delete $scope.loading;
		$scope.reporthtml = $sce.trustAsHtml(html);
	    }, 0);
	}).error(function(data) {
	    alert('err!');
	});

    };

    $rootScope.reportHandler = function(html) {
	$timeout(function() {
	    delete $scope.loading;
	    $scope.reporthtml = $sce.trustAsHtml(html);
	}, 0);
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

	    $scope.reportselects.sols = [];
	    // for (var i = 0; i < data.sols.length; i++) {
	    // $scope.reportselects.sols.push({
	    // id : data.currencies[i].id,
	    // label : data.currencies[i].name,
	    // code : data.currencies[i].code
	    // });
	    // }
	    // $rootScope.label_sols = {};
	    // $rootScope.sols = [];
	    for (var i = 0; i < data.sols.length; i++) {
		$scope.reportselects.sols.push({
		    id : data.sols[i].CODE,
		    label : data.sols[i].CODE
		});
		// $rootScope.label_sols[data.sols[i].CODE] = data.sols[i].CODE
		// + ' - ' + data.sols[i].DESC;
	    }

	    $scope.reportselects.countries = [];
	    for (var i = 0; i < data.countries.length; i++) {
		$scope.reportselects.countries.push({
		    id : data.countries[i].CODE,
		    label : data.countries[i].CODE
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

    $scope.removeResource = function(resource){
	$timeout(function(){
        	if(resource.id==null){
        	    $scope.group.resources.splice($scope.group.resources.indexOf(resource),1);
        	}else{
        	    resource.is_deleted = true;
        	}
	},0);
    }

    $scope.restoreResource = function(resource){
	$timeout(function(){
	    delete resource.is_deleted;
	},0);
    }
    
    $scope.addResourceRoute = function(){
	$timeout(function(){
		$scope.group.resources.push({id:null, tempId:Math.floor((Math.random() * 100000) + 1), createdAt : new Date(), updatedAt : new Date(), name : null, create:0,read:0,update:0,delete:0});
	},0);
	
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
		resources[key].create = 0;
		resources[key].read = 0;
		resources[key].update = 0;
		resources[key]['delete'] = 0;
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
	$rootScope.deleteModalText = $scope.selectedGroup.name; // $scope.selectedGroup.id
	// + ' ' +
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
	$scope.updateUserSuccess = false;
	$scope.updateUserSuccessMessage = null;
	$scope.updateUserPasswordMatchError = false;

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
	    $scope.updateUserSuccess = false;
	    $scope.updateUserPasswordMatchError = false;
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
	    $scope.updateUserSuccess = false;
	    $scope.updateUserPasswordMatchError = false;

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
	    $rootScope.deleteModalText = $scope.selectedUser.username; // $scope.selectedUser.id
	    // + ' '
	    // +
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

		$scope.updateUserSuccess = false;
		$scope.updateUserPasswordMatchError = false;
		$rootScope.user_modified = false;
		$scope.selectedUser = null;
	    }, 0);
	}

	$scope.saveUser = function() {

	    $scope.updateUserSuccess = false;
	    $scope.updateUserPasswordMatchError = false;

	    $('#' + (($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form').valid();
	    if ($rootScope.validator[(($scope.selectedUser == null || $scope.selectedUser.id == null) ? 'new_' : '') + 'users_form'].numberOfInvalids() > 0) { // error
		return;
	    }

	    if ($scope.user.password && $scope.user.password != null && $scope.user.password != '') {
		if ($scope.user.confirm_password && $scope.user.confirm_password != null && $scope.user.confirm_password != '' && $scope.user.password == $scope.user.confirm_password) { // check
		    // if
		    // confirm_password
		    // is
		    // good

		} else {
		    $scope.updateUserPasswordMatchError = true;
		    return;
		}
	    }

	    if ($scope.selectedUser == null || $scope.selectedUser.id == null) { // new
		$scope.updateUserSuccessMessage = 'User Successfully Created!';
	    } else {
		$scope.updateUserSuccessMessage = 'User Successfully Updated!';
	    }

	    $sails.post('/users/saveuserandgroups', {
		user : $scope.user
	    }).success(function(data) {
		if (data.error != undefined) { // USER NO LONGER LOGGED IN!!!!!
		    location.reload(); // Will boot back to login screen
		}
		if (data.success) {
		    $timeout(function() {
			$scope.updateUserSuccess = true;
		    }, 0);

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
}).controller('MainCtrl', function($preloaded, $user, $scope, $rootScope, $location, $layout, $layoutToggles, $pageLoadingBar, Fullscreen){// },
																	    // $contact)
																	    // {
    $rootScope.isLoginPage = false;
    $rootScope.isLightLoginPage = false;
    $rootScope.isLockscreenPage = false;
    $rootScope.isMainPage = true;
    // $rootScope.policy = $user.policy; // copy in policy for pages to do
    // security off of.
    
    $rootScope.checkPolicy = function(policy,create,read,update,destroy){
	if($user.policy[policy]&&$user.policy[policy].create>=create&&$user.policy[policy].read>=read&&$user.policy[policy].update>=update&&$user.policy[policy].delete>=destroy){
	    return true;
	}
	return false;
    }

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
	if (false){// $contact.is_modified) { // still modified-
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
