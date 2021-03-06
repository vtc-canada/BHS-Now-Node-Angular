module.exports.views = {
    locals : {
	reportselects : {
	    eqp_ids : [ {
		id : 1,
		label : 'EQP 1'
	    }, {
		id : 2,
		label : 'EQP 2'
	    }, {
		id : 3,
		label : 'EQP 3'
	    }, {
		id : 4,
		label : 'EQP 4'
	    } ]
	},
	reports : {
	    '/reports' : [ {
		id : 1,
		name : {
		    locale_label : {
			en : 'Category Report',
			es : 'Informe del historial de alarmas'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation : 'landscape',
		tables : [ {
		    order : 0,
		    sproc : 'reports_CategoryReport',
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includecountries', 'excludecountries' ],
		    split : {
			mode : 'like',
			column : 0,
			against : {
			    'AC' : {
				0 : 'Total for AC',
				1 : 'Address Change'
			    },
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Code"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Description"
			},
			align : 'left',
			titlealign : 'left',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "# of Donors"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total Donations"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "# of Sales"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total Sales"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "# of Pledges"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Pledge Payments"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "# of M & T"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total M & T"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "# of Masses"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total Masses"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Nil Contacts"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Counts"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Totals"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Avg"
			},
			lastrow : {
			    type : 'average',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 1,
		    sproc : 'reports_CategoryReportSummary',
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includecountries', 'excludecountries' ],
		    section : {
			startrow : true,
			endrow : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Category Report Summary',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Country"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "January"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "February"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "March"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "April"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "May"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "June"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "July"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "August"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "September"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "October"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "November"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "December"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 2,
		    sproc : 'reports_CategoryReportSummaryNil',
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includecountries', 'excludecountries' ],
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Type"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "January"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "February"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "March"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "April"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "May"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "June"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "July"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "August"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "September"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "October"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "November"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "December"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 3,
		    sproc : 'reports_CategoryReportGT',
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includecountries', 'excludecountries' ],
		    section : {
			startrow : true,
			endrow : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Grand Totals',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : false,
			    spantype : 'col-xs-6',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Type"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Count"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'start_time' : {
			order : 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time'
			}
		    },
		    'currency' : {
			order : 2,
			type : 'select',
			source : 'currencies',
			value : 'U',
			hidden : false,
			locale_label : {
			    en : 'Currency'
			}
		    },
		    'solcodes' : {
			order : 3,
			type : 'multiselect',
			source : 'sols',
			multi_min_length : 2,
			locale_label : {
			    en : 'SOL Codes'
			}
		    },
		    'includecountries' : {
			order : 4,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountries' : {
			order : 5,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 2,
		name : {
		    locale_label : {
			en : 'Donor Class Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		tables : [ {
		    order : 0,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'I', 'includecountry', 'excludecountry' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE : 1,
			    INACTIVE : 2,
			    NEW : 3,
			    LIMBO : 4,
			    REMOVED : 5,
			    ACTIVE_LAPSED : 6,
			    INACTIVE_LAPSED : 7,
			    Total : 8
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			unbreakable : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Donors',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Class"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "New"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Limbo"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Removed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 1,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'G', 'includecountry', 'excludecountry' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE : 1,
			    INACTIVE : 2,
			    NEW : 3,
			    LIMBO : 4,
			    REMOVED : 5,
			    ACTIVE_LAPSED : 6,
			    INACTIVE_LAPSED : 7,
			    Total : 8
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			unbreakable : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Buyers',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Class"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "New"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Limbo"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Removed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 2,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'E', 'includecountry', 'excludecountry' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE : 1,
			    INACTIVE : 2,
			    NEW : 3,
			    LIMBO : 4,
			    REMOVED : 5,
			    ACTIVE_LAPSED : 6,
			    INACTIVE_LAPSED : 7,
			    Total : 8
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			unbreakable : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Contacts',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Class"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "New"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Limbo"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Removed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 3,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'C', 'includecountry', 'excludecountry' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE : 1,
			    INACTIVE : 2,
			    NEW : 3,
			    LIMBO : 4,
			    REMOVED : 5,
			    ACTIVE_LAPSED : 6,
			    INACTIVE_LAPSED : 7,
			    Total : 8
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			unbreakable : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Referrals',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Class"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "New"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Limbo"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Removed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 4,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'A', 'includecountry', 'excludecountry' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE : 1,
			    INACTIVE : 2,
			    NEW : 3,
			    LIMBO : 4,
			    REMOVED : 5,
			    ACTIVE_LAPSED : 6,
			    INACTIVE_LAPSED : 7,
			    Total : 8
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			unbreakable : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Prospects',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Class"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "New"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Limbo"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Removed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {

		    'includecountry' : {
			order : 0,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountry' : {
			order : 1,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 3,
		name : {
		    locale_label : {
			en : 'Daily Mail Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		footnotes : [ 'Footer 1', 'Footer 2' ],
		orientation : 'landscape',
		tables : [ {
		    order : 0,
		    sproc : 'reports_DailyMailComputerReport',
		    parameters : [ 'start_time', 'end_time', 'currency', 'includecountries', 'excludecountries' ],
		    section : {
			startrow : true,
			endrow : true,
			tableclass : 'wide',
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Envelope #"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Donor #"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Class"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Name"
			},
			phantom_white_space : 'normal',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Address"
			},
			phantom_white_space : 'normal',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Country"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Provcode"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Dem"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Trans"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Mode"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Amount"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Receipt #"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Vol"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "VIP"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'start_time' : {
			order : 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time'
			}
		    },
		    'currency' : {
			order : 2,
			type : 'select',
			source : 'currencies',
			value : 'U',
			hidden : false,
			locale_label : {
			    en : 'Currency'
			}
		    },
		    'includecountries' : {
			order : 3,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Include Countries'
			}
		    },
		    'excludecountries' : {
			order : 4,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Exclude Countries'
			}
		    }
		}
	    }, {
		id : 4,
		name : {
		    locale_label : {
			en : 'Lapsed Donor Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		footnotes : [ 'Footer 1', 'Footer 2', 'Footer 3', 'Footer 4', 'Footer 5', 'Footer 6', 'Footer 7', 'Footer 8', 'Footer 9' ],
		orientation : 'landscape',
		tables : [ {
		    order : 0,
		    sproc : 'reports_LapsedDonorReport',
		    parameters : [ 'includecountries', 'excludecountries', 'ACTIVE_LAPSED' ],
		    pivot : {
			id : 'Year',
			name : 'Class',
			value : 'Count',
			columns : {
			    id : 0,
			    IA : 1,
			    IB : 2,
			    IC : 3,
			    ID : 4,
			    IE : 5,
			    IF : 6,
			    IG : 7,
			    IH : 8,
			    II : 9,
			    IJ : 10,
			    IK : 11,
			    Total : 12
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			tableclass : 'wide',
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Active Lapsed',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Year"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IA"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IB"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IC"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "ID"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IE"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IF"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IG"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IH"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "II"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IJ"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IK"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Totals"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 1,
		    sproc : 'reports_LapsedDonorReport',
		    parameters : [ 'includecountries', 'excludecountries', 'INACTIVE_LAPSED' ],
		    pivot : {
			id : 'Year',
			name : 'Class',
			value : 'Count',
			columns : {
			    id : 0,
			    IA : 1,
			    IB : 2,
			    IC : 3,
			    ID : 4,
			    IE : 5,
			    IF : 6,
			    IG : 7,
			    IH : 8,
			    II : 9,
			    IJ : 10,
			    IK : 11,
			    Total : 12
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			tableclass : 'wide',
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Inactive Lapsed',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Year"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IA"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IB"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IC"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "ID"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IE"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IF"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IG"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IH"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "II"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IJ"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "IK"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Totals"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'includecountries' : {
			order : 0,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountries' : {
			order : 1,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 5,
		name : {
		    locale_label : {
			en : 'Mailout Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		tables : [ {
		    order : 0,
		    sproc : 'reports_MailoutReportActiveInactive',
		    parameters : [ 'includecountries', 'excludecountries' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE : 1,
			    INACTIVE : 2,
			    Total : 3,
			    CE : 5,
			    CO : 6,
			    XS : 7,
			    XY : 8
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			tableclass : 'wide',
			gridlines : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Active and Inactive Donors',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Class"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Actual Total"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CE"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CO"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XS"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XY"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CE"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CO"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XS"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XY"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total to Mail"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    } ]
		}, {
		    order : 1,
		    sproc : 'reports_MailoutReportLapsed',
		    parameters : [ 'includecountries', 'excludecountries' ],
		    pivot : {
			id : 'Year',
			name : 'Column',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE_LAPSED : 1,
			    CE_ACTIVE_LAPSED : 2,
			    CO_ACTIVE_LAPSED : 3,
			    XS_ACTIVE_LAPSED : 4,
			    XY_ACTIVE_LAPSED : 5,
			    INACTIVE_LAPSED : 7,
			    CE_INACTIVE_LAPSED : 8,
			    CO_INACTIVE_LAPSED : 9,
			    XS_INACTIVE_LAPSED : 10,
			    XY_INACTIVE_LAPSED : 11
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			tableclass : 'wide',
			gridlines : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Lapsed Donors',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : [ {
			locale : {
			    en : "Year"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active Lapsed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CE"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CO"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XS"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XY"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active Total"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive Lapsed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CE"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "CO"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XS"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "XY"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive Total"
			},
			value : '',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'includecountries' : {
			order : 0,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountries' : {
			order : 1,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 6,
		name : {
		    locale_label : {
			en : 'Volunteer Inventory Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation : 'portrait',
		tables : [ {
		    order : 0,
		    sproc : 'reports_VolunteerInventoryReport',
		    parameters : [ 'start_time', 'end_time', 'start_ship_time', 'end_ship_time', 'ship_from_codes', 'includecountries', 'excludecountries' ],
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Item #"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Description"
			},
			align : 'left',
			titlealign : 'left',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Order Quantity"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'start_time' : {
			order : 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time'
			}
		    },
		    'start_ship_time' : {
			order : 2,
			type : 'datetime',
			locale_label : {
			    en : 'Start Ship Time'
			}
		    },
		    'end_ship_time' : {
			order : 3,
			type : 'datetime',
			locale_label : {
			    en : 'End Ship Time'
			}
		    },
		    'ship_from_codes' : {
			order : 4,
			type : 'multiselect',
			source : 'ship_from',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Ship From'
			}
		    },
		    'includecountries' : {
			order : 5,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountries' : {
			order : 6,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 7,
		name : {
		    locale_label : {
			en : 'Donor History Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		tables : [ {
		    order : 0,
		    sproc : 'reports_DonorHistoryReport',
		    parameters : [ 'includecountry', 'excludecountry' ],
		    pivot : {
			id : 'Date',
			name : 'Donor Status',
			value : 'Count',
			columns : {
			    id : 0,
			    ACTIVE : 1,
			    INACTIVE : 2,
			    NEW : 3,
			    TOTAL : 4,
			    'Inactive to Lapsed' : 5,
			    'Lapsed to Active' : 6,
			    'Reinstated' : 7,
			    'Removed' : 8,
			    'Active to Inactive' : 9,
			    'Inactive to Active' : 10
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			unbreakable : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Donors',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Date"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "New"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Total"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive to Lapsed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Lapsed to Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Reinstated"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Removed"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Active to Inactive"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Inactive to Active"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {

		    'includecountry' : {
			order : 0,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountry' : {
			order : 1,
			type : 'multiselect',
			source : 'countries',
			value : null,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 8,
		name : {
		    locale_label : {
			en : 'Pledge Delinquent Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation : 'portrait',
		tables : [ {
		    order : 0,
		    sproc : 'reports_PledgeDelinquentReport',
		    parameters : [ 'includecountries', 'excludecountries' ],
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Donor #"
			}
		    }, {
			locale : {
			    en : "Name"
			},
			align : 'left',
			titlealign : 'left'
		    }, {
			locale : {
			    en : "Address"
			}
		    }, {
			locale : {
			    en : "Last Pledge Payment"
			}
		    } ]
		} ],
		parameters : {
		    'includecountries' : {
			order : 0,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountries' : {
			order : 1,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 9,
		name : {
		    locale_label : {
			en : 'Order Item Distribution Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation : 'portrait',
		tables : [ {
		    order : 0,
		    sproc : 'reports_OrderItemDistributionReport',
		    parameters : [ 'start_time', 'end_time', 'start_ship_time', 'end_ship_time', 'ship_from_codes', 'includecountries', 'excludecountries' ],
		    pivot : {
			id : 'Item # - Description',
			name : 'Column',
			value : 'Value',
			columns : {
			    id : 0,
			    'Sales Qty' : 1,
			    'Sales Orders' : 2,
			    'Donated Qty' : 3,
			    'Donated Orders' : 4
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Item # - Description"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Sales Qty"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    value : '0',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Sales Orders"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    value : '0',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Donated Qty"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    value : '0',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Donated Orders"
			},
			value : '0',
			lastrow : {
			    type : 'sum',
			    value : '0',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'start_time' : {
			order : 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time'
			}
		    },
		    'start_ship_time' : {
			order : 2,
			type : 'datetime',
			locale_label : {
			    en : 'Start Ship Time'
			}
		    },
		    'end_ship_time' : {
			order : 3,
			type : 'datetime',
			locale_label : {
			    en : 'End Ship Time'
			}
		    },
		    'ship_from_codes' : {
			order : 4,
			type : 'multiselect',
			source : 'ship_from',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Ship From'
			}
		    },
		    'includecountries' : {
			order : 5,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Include Country'
			}
		    },
		    'excludecountries' : {
			order : 6,
			type : 'multiselect',
			source : 'countries',
			value : null,
			hidden : false,
			locale_label : {
			    en : 'Exclude Country'
			}
		    }
		}
	    }, {
		id : 10,
		name : {
		    locale_label : {
			en : 'Mail Drop Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation : 'portrait',
		tables : [ {
		    order : 0,
		    sproc : 'reports_MailDropReport',
		    parameters : [ 'start_time', 'end_time' ],
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "Sol+List/GL"
			},
			lastrow : {
			    type : 'custom',
			    value : 'Totals',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Description"
			},
			align : 'left',
			titlealign : 'left',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Package Items"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Date"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Ship From"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Count"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Postage"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Package"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Labour"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'start_time' : {
			order : 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time'
			}
		    }
		}
	    }, {
		id : 11,
		name : {
		    locale_label : {
			en : 'Duplicate Contact Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation : 'portrait',
		tables : [ {
		    order : 0,
		    sproc : 'reports_DuplicateContactReport',
		    parameters : [],
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
			}
		    },
		    columns : [ {
			locale : {
			    en : "First Name"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Last Name"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Address"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "City"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "ZIP"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Count"
			},
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {

		}
	    }, {
		id : 12,
		name : {
		    locale_label : {
			en : 'PopeName'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation : 'landscape',
		tables : [ {
		    order : 0,
		    sproc : 'reports_PopeName',
		    parameters : ['start_time','end_time','type_code', 'sol_code'],
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    grouping : [ {
			column : 'MTYPE',
			footer : {
			    columns : [ {
				type : 'column',
				column : 'MTYPE'
			    }, // will
			    // use
			    // cached
			    // 'value'
			    {
				type : 'custom',
				value : ''
			    }, {
				type : 'custom',
				value : ''
			    }, {
				type : 'custom',
				value : ''
			    }, {
				type : 'column',
				column : 'DESC'
			    }, {
				type : 'count'
			    }, {
				type : 'sum',
				column : 'MCOUNT'
			    } ]
			}
		    },{
			column : 'MYEAR',
			footer : {
			    columns : [ {
				type : 'column',
				column : 'MTYPE'
			    },
			    {
				type : 'column',
				column : 'MYEAR'
			    }, {
				type : 'custom',
				value : ''
			    }, {
				type : 'custom',
				value : ''
			    }, {

				type : 'custom',
				value : ''
			    }, {
				type : 'count'
			    }, {
				type : 'sum',
				column : 'MCOUNT'
			    } ]
			}
		    },{
			column : 'SOL',
			footer : {
			    columns : [ {
				type : 'column',
				column : 'MTYPE'
			    }, // will
			    // use
			    // cached
			    // 'value'
			    {
				type : 'column',
				column : 'MYEAR'
			    }, {
				type : 'column',
				column : 'SOL'
			    }, {
				type : 'custom',
				value : ''
			    }, {
				type : 'column',
				column : 'SOL'
				    
				//type : 'custom',
				//value : ''
				//type : 'column',
				//column : 'SOLDESC'
			    }, {
				type : 'count'
			    }, {
				type : 'sum',
				column : 'MCOUNT'
			    } ]
			}
		    } ],
		    columns : {
			MTYPE : {
			    locale : {
				en : "TYPE"
			    },
			    lastrow : {
				type : 'custom',
				value : 'Totals',
				bold : true,
				bordertop : true
			    }
			},
			MYEAR : {
			    locale : {
				en : "YEAR"
			    },
			    lastrow : {
				type : 'custom',
				value : '',
				bold : true,
				bordertop : true
			    }
			},
			SOL : {
			    locale : {
				en : "SOL"
			    },
			    lastrow : {
				type : 'custom',
				value : '',
				bold : true,
				bordertop : true
			    }
			},
			DONOR : {
			    locale : {
				en : "Donor"
			    },
			    lastrow : {
				type : 'custom',
				value : '',
				bold : true,
				bordertop : true
			    }
			},
			FULLNAME : {
			    locale : {
				en : "Full Name"
			    },
			    lastrow : {
				type : 'custom',
				value : '',
				bold : true,
				bordertop : true
			    }
			},
			DCOUNT : {
			    locale : {
				en : "Donor Count"
			    },
			    lastrow : {
				type : 'count',
				decimalplaces : 0,
				bold : true,
				bordertop : true
			    }
			},
			MCOUNT : {
			    locale : {
				en : "Misc Count"
			    },
			    lastrow : {
				type : 'sum',
				decimalplaces : 0,
				bold : true,
				bordertop : true
			    }
			}
		    }
		} ],
		parameters : {
		    'start_time' : {
			order : 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time'
			}
		    },
		    'type_code' : {
			order : 2,
			type : 'text',
			locale_label : {
			    en : 'Type Code'
			}
		    },
		    'sol_code' : {
			order : 3,
			type : 'text',
			locale_label : {
			    en : 'SOL Code'
			}
		    }
		}
	    }, {
		id : 13,
		name : {
		    locale_label : {
			en : 'PledMon Report'
		    }
		},
		title : {
		    logo : 'Fatima-Center-Logo.png'
		},
		footer : {
		    logo : 'default.png'
		},
		tables : [ {
		    order : 0,
		    sproc : 'reports_PledMon',
		    parameters : [ 'start_time', 'end_time' ],
		    
		    pivot : {
			id : ['group','month'],
			name : 'status',
			value : 'value'
		    },
		    grouping : [ {
			column : 'group',
			footer : {
			    columns : [ {
				type : 'column',
				column : 'group'
			    },
			    {
				type : 'custom',
				value : ''
			    }, {
				type : 'custom',
				value : ''
			    }, {
				type : 'sum',
				column : 'RENEWED'
			    }, {
				type : 'sum',
				column : 'CANCELLED'
			    },{
				type : 'sum',
				column : 'NEW'
			    },{
				type : 'custom',
				value : ''
			    },{
				type : 'custom',
				value : ''
			    }, {
				type : 'sum',
				column : 'COUNT'
			    }, {
				type : 'sum',
				column : 'AMOUNT'
			    }, {
				type : 'custom',
				value : ''
			    } ]
			}
		    }
		    ],
		    section : {
			startrow : true,
			endrow : true,
			unbreakable : true,
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'Pledges by Group',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true,
			    sorting : false
			}
		    },
		    columns : { 
			group: {
			locale : {
			    en : "Campaign Type"
			},
			order : 0,
			type : 'column',
			column : 'group',
			lastrow : {
			    type : 'custom',
			    value : 'Total',
			    bold : true,
			    bordertop : true
			}
		    },month: {
			locale : {
			    en : "Date"
			},
			order : 1,
			type : 'column',
			column : 'month',
			modifier : 'UTCDate',
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    },PLEDGOR: {
			locale : {
			    en : "Start of Period"
			},
			order : 2,
			type:'pivot',
			column : 'PLEDGOR',
			value : '0',
			lastrow : {
			    type : 'custom',
			    value : '',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    },NEW: {
			locale : {
			    en : "New"
			},
			order : 5,
			value : '0',
			type:'pivot',
			column : 'NEW',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    },CANCELLED: {
			locale : {
			    en : "Canc & Non-Ren"
			},
			order : 4,
			value : '0',
			type:'pivot',
			column : 'CANCELLED',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    }, 
		    RENEWED:{
			locale : {
			    en : "Renews"
			},
			order : 3,
			value : '0',
			type:'pivot',
			column : 'RENEWED',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    },ENDOFPERIOD: {
			locale : {
			    en : "End of Period"
			},
			order : 6,
			value : '0',
			type:'method',
			parameters : ['PLEDGOR','NEW','CANCELLED','RENEWED'],
			method : function(args){//start, newval, cancelled, renews){
			    return parseInt(args[0]) + parseInt(args[1]) - parseInt(args[2]) + parseInt(args[3]);
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    },DELINQUENT: {
			locale : {
			    en : "Current Delinq"
			},
			order : 7,
			value : '0',
			type:'pivot',
			column : 'DELINQUENT',
			lastrow : {
			    type : 'custom',
			    value : '',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    },COUNT: {
			locale : {
			    en : "Count"
			},
			order : 8,
			value : '0',
			type:'pivot',
			column : 'COUNT',
			lastrow : {
			    type : 'sum',
			    decimalplaces : 0,
			    bold : true,
			    bordertop : true
			}
		    },AMOUNT: {
			locale : {
			    en : "Amount"
			},
			order : 9,
			value : '0',
			type:'pivot',
			column : 'AMOUNT',
			decimalplaces : 2,
			lastrow : {
			    type : 'sum',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    },AVERAGE: {
			locale : {
			    en : "Average"
			},
			order : 10,
			value : '',
			type:'method',
			parameters : ['COUNT','AMOUNT'],
			method : function(args){//start, newval, cancelled, renews){
			    if(args[0]==0){
				return '0.00';
			    }
			    return parseFloat(args[1]) /parseInt(args[0]);
			},
			decimalplaces : 2,
			lastrow : {
			    type : 'custom',
			    value : '',
			    decimalplaces : 2,
			    bold : true,
			    bordertop : true
			}
		    }}
		} ],
		parameters : {
//
//		    'includecountry' : {
//			order : 0,
//			type : 'multiselect',
//			source : 'countries',
//			value : null,
//			locale_label : {
//			    en : 'Include Country'
//			}
//		    },
//		    'excludecountry' : {
//			order : 1,
//			type : 'multiselect',
//			source : 'countries',
//			value : null,
//			locale_label : {
//			    en : 'Exclude Country'
//			}
//		    },
		    'start_time' : {
			order : 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time'
			}
		    }
		}
	    } ]
	}
    }
};