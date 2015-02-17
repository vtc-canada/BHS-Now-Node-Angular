'use strict';

angular.module('xenon.controllers', []).controller(
	'ContactSections',
	function($scope, $rootScope, $timeout, $modal, $contact, $sails, Utility) {
	    var vm = this;
	    vm.mail = {};
	    $scope.contact = $contact;
	    $scope.selectedTransaction = null;

	    vm.watchEnabled = false;

	    vm.tabs = [ 'layman', 'ecclesiastical', 'volunteer', 'orders' ];

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

	    // DTMAIL /////////////////////////////
	    $scope.mailDataTableId = 'dtmail_datatable';
	    $scope.mailDataTableOptions = {
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
	    };
	    $scope.mailDataTableChange = function() {
		$timeout(function() {
		    $scope.selectedTransaction = null;
		    // $scope.selectedTransactionTemp = null;
		}, 0);
	    }

	    // selected modal

	    $scope.editMail = function(modal_id, modal_size, modal_backdrop) {

		var selectedMail = $contact.getElementObject('dtmail', $scope.selectedTransaction.id, $scope.selectedTransaction.tempId);

		$rootScope.selectedMail = selectedMail;
		/*
		 * { id : $scope.selectedTransaction, tempId :
		 * $scope.selectedTransactionTemp, SOL : selectedMail.SOL, LIST :
		 * selectedMail.LIST }
		 */
		$rootScope.currentModal = $modal.open({
		    templateUrl : modal_id,
		    size : modal_size,
		    backdrop : typeof modal_backdrop == 'undefined' ? true : modal_backdrop
		});
		$rootScope.currentModal.result.then(function(selectedItem) {
		}, function(triggerElement) {
		    if (triggerElement == 'save') {
			$contact.updateElementObject('dtmail', $rootScope.selectedMail);
			$timeout(function() {
			    $scope.contact = $contact;
			}, 0);
		    }
		});
	    };

	    $scope.addMail = function(modal_id, modal_size) {
		// Wipe selected, create new.
		$scope.selectedTransaction = {};
		$scope.selectedTransaction.id = 'new';
		$scope.selectedTransaction.tempId = Math.floor((Math.random() * 100000) + 1);
		$rootScope.selectedMail = {
		    id : $scope.selectedTransaction.id,
		    tempId : $scope.selectedTransaction.tempId,
		    DONOR : $contact.id,
		    SOL : null,
		    LIST : null,
		    database_origin : $contact.database_origin,
		    DESC : null,
		    DROP_DATE : null,
		    DROP_CNT : null
		}
		$rootScope.currentModal = $modal.open({
		    templateUrl : modal_id,
		    size : modal_size,
		    backdrop : true
		});
		$rootScope.currentModal.result.then(function(selectedItem) {
		    $scope.selectedTransaction = null;
		}, function(triggerElement) {

		    $scope.selectedTransaction = null;
		    // $scope.selectedTransactionTemp = null;
		    if (triggerElement == 'save') {
			// if($rootScope.)
			$scope.tryDestroyMailDataTable();
			$contact.updateElementObject('dtmail', $rootScope.selectedMail);
			$timeout(function() {
			    $scope.contact = $contact;
			    $scope.rebindMailDataTables();
			}, 0);
		    } else { // do nothing
		    }
		});
	    }
	    $scope.tryDestroyMailDataTable = function() {
		$('#' + $scope.mailDataTableId).css('visibility', 'hidden');
		if ($.fn.DataTable.isDataTable('#' + $scope.mailDataTableId)) {
		    $('#' + $scope.mailDataTableId).dataTable().fnDestroy();
		}
	    }
	    $scope.rebindMailDataTables = function() {
		if (!$.fn.DataTable.isDataTable('#' + $scope.mailDataTableId)) {
		    $('#' + $scope.mailDataTableId).dataTable($scope.mailDataTableOptions).on('page.dt', $scope.mailDataTableChange).on('length.dt',
			    $scope.mailDataTableChange).on('search.dt', $scope.mailDataTableChange);
		    $('#' + $scope.mailDataTableId).css('visibility', '');
		    $('#' + $scope.mailDataTableId).next().find('ul.pagination li.paginate_button a').click(function() {
			$timeout(function() {
			    $scope.selectedTransaction = null;
			    // $scope.selectedTransactionTemp = null;
			}, 0);
		    });
		}
	    }

	    $scope.getDeleteMailButtonDisabled = function() {
		return ($scope.selectedTransaction == null);
	    }

	    $scope.isDeleteMailButtonText = function() {
		if ($scope.selectedTransaction != null && $scope.selectedTransaction.is_deleted) {
		    return true;
		}
		return false;
	    }
	    $scope.getDeleteMailButtonText = function() {
		if ($scope.isDeleteMailButtonText()) {
		    return 'Restore';
		}
		return 'Delete';

	    }

	    $scope.deleteMail = function() {
		var deleteNew = false;
		if ($scope.selectedTransaction.id == 'new') { // will destroy
								// cuz it's new
		    deleteNew = true;
		    $scope.tryDestroyMailDataTable();
		}
		$contact.toggleDeleted('dtmail', $scope.selectedTransaction);
		$timeout(function() {
		    $scope.contact = $contact;
		    $scope.selectedTransaction = null;
		    if (deleteNew) { // was a new one.. being deleted clearly
			$scope.rebindMailDataTables();
		    }
		}, 0);
	    }
	    /*
	     * $scope.isRowDeletedAndFocused = function(row){ return (row.tempId ==
	     * $scope.selectedTransaction.tempId && row.tempId != null) ||
	     * (row.id == $scope.selectedTransaction.id && row.id != 'new'); }
	     */
	    $scope.isRowFocused = function(row) {
		if ($scope.selectedTransaction == null) {
		    return false;
		}
		return (row.tempId == $scope.selectedTransaction.tempId && row.tempId != null) || (row.id == $scope.selectedTransaction.id && row.id != 'new');
	    }

	    $scope.selectTransaction = function(transaction) {// transactionId,
								// tempId,
								// is_deleted) {
		$scope.selectedTransaction = transaction;
		// $scope.selectedTransactionTemp = transaction.tempId;

	    }

	    // /////////////////////////////////////////////// END MAIL

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

	    $scope.tryModified = function(newValue, oldValue) {
		if (newValue !== oldValue) {
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
			    $contact.is_modified = $scope.is_modified = true;
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
				$scope.tryDestroyMailDataTable();
				$timeout(function() {
				    $contact.set(data.contact);
				    resetContactForms();
				    $timeout(function() {
					$(window).scrollTop($('.nav-tabs').offset().top - 8);
					$scope.rebindMailDataTables();

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
			    if (tabval != tab) { // make sure to check the
				// validity
				// of other tabs.
				$('#' + tabval).valid();
			    }
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
			$sails.post("/contacts/save", $scope.contact).success(function(data) {
			    if (data.success) {
				$scope.tryDestroyMailDataTable();
				$timeout(function() {
				    $contact.set(data.contact);
				    resetContactForms();
				    $rootScope.updateContactsTable();
				    $timeout(function() {
					$scope.rebindMailDataTables();
				    }, 0);
				}, 0);
			    }
			}).error(function(data) {
			    alert('err!');
			});
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
		angular.forEach(vm.tabs, function(tabval) {
		    if ($rootScope.validator && $rootScope.validator[tabval]) {
			$rootScope.validator[tabval].resetForm();
			$('form#' + tabval + ' .validate-has-error').removeClass('validate-has-error');
		    }
		});
	    }

	    // initialization routine.
	    (function() {
		if ($scope.titles) {
		    // get an existing object
		} else {

		    $sails.get('/contacts/getattributes').success(function(data) {
			var data = data.result;

			$scope.response = [{
			    id : '1',
			    label : 'Not yet known'
			}, {
			    id : '2',
			    label : 'Positive'
			}, {
			    id : '3',
			    label : 'Negative'
			}]
			
			$scope.staticyesno = [ {
			    id : 'Y',
			    label : 'Yes'
			}, {
			    id : 'N',
			    label : 'No'
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
			for (var i = 0; i < data.dtvols1.origin.length; i++) {
			    $scope.dtvols1.origin.push({
				id : data.dtvols1.origin[i].CODE,
				label : data.dtvols1.origin[i].CODE + ' - ' + data.dtvols1.origin[i].DESC
			    });
			}

		    }).error(function(data) {
			alert('err!');
		    });
		    /*
		     * $scope.titles = [{ //create a new object id: 'Mr', label:
		     * 'Mr.' }, { id: 'Mrs', label: 'Mrs.' }];
		     */
		}
	    })()
	}).controller('ContactsSearch', function($scope, $rootScope) {
    var vm = this;

    $scope.contact = {};
    $scope.contact.id = '';
    $scope.contact.donor2 = '';
    $rootScope.search_contact = $scope.contact;

    $scope.$watchCollection('contact', function() {
	if (vm.updateTable) {
	    clearTimeout(vm.updateTable);
	}
	vm.updateTable = setTimeout(function() {
	    $rootScope.updateContactsTable();
	}, 300);
    });

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
	    vm.dtColumns = [ DTColumnBuilder.newColumn('id').withTitle('ID'), DTColumnBuilder.newColumn('FNAME').withTitle('First name'),
		    DTColumnBuilder.newColumn('LNAME').withTitle('Last name') ];

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
	if ($contact.is_modified) {
	    return;
	}
	var obj = {
	    pos : jQuery(window).scrollTop()
	};

	TweenLite.to(obj, .25, {
	    pos : 0,
	    ease : Power4.easeOut,
	    onUpdate : function() {
		$(window).scrollTop(obj.pos);
	    }
	});
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
}).controller(
	'UIModalsCtrl',
	function($scope, $rootScope, $modal, $sce) {
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
			    return $http.get(url_location).then(
				    function(response) {
					$rootScope.modalContent = $sce.trustAsHtml(response.data);
				    },
				    function(response) {
					$rootScope.modalContent = $sce
						.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>');
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