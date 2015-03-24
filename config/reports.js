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
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		orientation:'landscape',
		tables : [ {
		    order : 0,
		    sproc : 'reports_CategoryReport',
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includesummary' ],
		    split:{
			mode:'like',
			column:0,
			against:{
			    'AC':{
				0:'Total for AC',
				1:'Address Change'
			    },
			}
		    },
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    toprowtableheader : true,
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
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includesummary' ],
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
			    toprowtableheader : true,
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
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includesummary' ],
		    section : {
			startrow : true,
			endrow : true,
			table : {
			    searchenabled : true,
			    toprowtableheader : true,
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
		    parameters : [ 'start_time', 'end_time', 'currency', 'solcodes', 'includesummary' ],
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
			    toprowtableheader : true,
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
			type : 'text',
			value : 1,
			hidden : true,
			locale_label : {
			    en : 'Currency'
			}
		    },
		    'solcodes' : {
			order : 3,
			type : 'text',
			prepfulltext : true,
			locale_label : {
			    en : 'Solicitation Codes'
			}
		    },
		    'includesummary' : {
			order : 4,
			type : 'text',
			value : 1,
			hidden : true,
			locale_label : {
			    en : 'Include Summary'
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
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		tables : [ {
		    order : 0,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'I', 'Country', '' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns:{id:0, ACTIVE:1, INACTIVE:2, NEW:3, LIMBO:4, REMOVED:5, ACTIVE_LAPSED:6, INACTIVE_LAPSED:7 , Total:8}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
		    } , {
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
		    } , {
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
		    } , {
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
		    }]
		},{
		    order : 1,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'G', 'Country', '' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns:{id:0, ACTIVE:1, INACTIVE:2, NEW:3, LIMBO:4, REMOVED:5, ACTIVE_LAPSED:6, INACTIVE_LAPSED:7 , Total:8}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
		    } , {
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
		    } , {
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
		    } , {
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
		    }]
		},{
		    order : 2,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'E', 'Country', '' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns:{id:0, ACTIVE:1, INACTIVE:2, NEW:3, LIMBO:4, REMOVED:5, ACTIVE_LAPSED:6, INACTIVE_LAPSED:7 , Total:8}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
		    } , {
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
		    } , {
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
		    } , {
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
		    }]
		},{
		    order : 3,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'C', 'Country', '' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns:{id:0, ACTIVE:1, INACTIVE:2, NEW:3, LIMBO:4, REMOVED:5, ACTIVE_LAPSED:6, INACTIVE_LAPSED:7 , Total:8}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
		    } , {
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
		    } , {
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
		    } , {
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
		    }]
		},{
		    order : 4,
		    sproc : 'reports_DonorClassReport',
		    parameters : [ 'A', 'Country', '' ],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns:{id:0, ACTIVE:1, INACTIVE:2, NEW:3, LIMBO:4, REMOVED:5, ACTIVE_LAPSED:6, INACTIVE_LAPSED:7 , Total:8}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
		    } , {
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
		    } , {
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
		    } , {
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
		    }]
		} ],
		parameters : {

		    'Country' : {
			order : 1,
			type : 'text',
			value : 'Canada',
			locale_label : {
			    en : 'Country'
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
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		footnotes : ['Footer 1', 'Footer 2'],
		orientation:'landscape',
		tables : [ {
		    order : 0,
		    sproc : 'reports_DailyMailComputerReport',
		    parameters : [ 'start_time', 'end_time', 'currency', 'includecountries', 'excludecountries' ],
		    section : {
			startrow : true,
			endrow : true,
			tableclass : 'wide',
			groupheading : {
			    spantype : 'col-xs-12',
			    grid : [ [ {
				val : 'ToDo some headings',
				bold : true
			    } ] ]
			},
			table : {
			    searchenabled : true,
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
		    } , {
			locale : {
			    en : "Name"
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
			    en : "State"
			},
			lastrow : {
			    type : 'custom',
			    value : '',
			    bold : true,
			    bordertop : true
			}
		    }, {
			locale : {
			    en : "Zip"
			},
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
		    }  ]
		} ],
		parameters : {
		    'start_time' : {
			order : 0,
			type : 'datetime',
			value : '2010-04-08',
			locale_label : {
			    en : 'Start Time'
			}
		    },
		    'end_time' : {
			order : 1,
			type : 'datetime',
			value : '2010-04-08',
			locale_label : {
			    en : 'End Time'
			}
		    },
		    'currency' : {
			order : 2,
			type : 'text',
			value : 1,
			hidden : true,
			locale_label : {
			    en : 'Currency'
			}
		    },
		    'includecountries' : {
			order : 3,
			type : 'text',
			value : null,
			hidden : true,
			locale_label : {
			    en : 'Include Countries'
			}
		    },
		    'excludecountries' : {
			order : 4,
			type : 'text',
			value : null,
			hidden : true,
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
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		footnotes : ['Footer 1', 'Footer 2', 'Footer 3', 'Footer 4', 'Footer 5', 'Footer 6', 'Footer 7', 'Footer 8', 'Footer 9'],
		orientation:'landscape',
		tables : [ {
		    order : 0,
		    sproc : 'reports_LapsedDonorReport',
		    parameters : [ 'includecountries', 'excludecountries', 'ACTIVE_LAPSED' ],
		    pivot : {
			id : 'Year',
			name : 'Class',
			value : 'Count',
			columns:{id:0, IA:1, IB:2, IC:3, ID:4, IE:5, IF:6, IG:7, IH:8, II:9, IJ:10, IK:11, Total:12}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		},{
		    order : 1,
		    sproc : 'reports_LapsedDonorReport',
		    parameters : [ 'includecountries', 'excludecountries', 'INACTIVE_LAPSED' ],
		    pivot : {
			id : 'Year',
			name : 'Class',
			value : 'Count',
			columns:{id:0, IA:1, IB:2, IC:3, ID:4, IE:5, IF:6, IG:7, IH:8, II:9, IJ:10, IK:11, Total:12}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'includecountries' : {
			order : 3,
			type : 'text',
			value : null,
			hidden : true,
			locale_label : {
			    en : 'Include Countries'
			}
		    },
		    'excludecountries' : {
			order : 4,
			type : 'text',
			value : null,
			hidden : true,
			locale_label : {
			    en : 'Exclude Countries'
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
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		tables : [ {
		    order : 0,
		    sproc : 'reports_MailoutReportActiveInactive',
		    parameters : [ 'includecountries', 'excludecountries'],
		    pivot : {
			id : 'CLASS',
			name : 'Status',
			value : 'Count',
			columns:{id:0, ACTIVE:1, INACTIVE:2, Total:3, CE:5, CO:6, XS:7, XY:8}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    value: '',
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    value: '',
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
			    value: '',
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
			    value: '',
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
			    value: '',
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
			    value: '',
			    bold : true,
			    bordertop : true
			}
		    } ]
		},{
		    order : 1,
		    sproc : 'reports_MailoutReportLapsed',
		    parameters : [ 'includecountries', 'excludecountries'],
		    pivot : {
			id : 'Year',
			name : 'Column',
			value : 'Count',
			columns:{id:0, ACTIVE_LAPSED:1, CE_ACTIVE_LAPSED:2, CO_ACTIVE_LAPSED:3, XS_ACTIVE_LAPSED:4, XY_ACTIVE_LAPSED:5, INACTIVE_LAPSED:7, CE_INACTIVE_LAPSED:8, CO_INACTIVE_LAPSED:9, XS_INACTIVE_LAPSED:10, XY_INACTIVE_LAPSED:11}
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
			    toprowtableheader : true,
			    spantype : 'col-xs-12',
			    bottomborder : true,
			    topborder : true
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    value: '',
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    decimalplaces: 0,
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
			    value: '',
			    bold : true,
			    bordertop : true
			}
		    } ]
		} ],
		parameters : {
		    'includecountries' : {
			order : 3,
			type : 'text',
			value : null,
			hidden : true,
			locale_label : {
			    en : 'Include Countries'
			}
		    },
		    'excludecountries' : {
			order : 4,
			type : 'text',
			value : null,
			hidden : true,
			locale_label : {
			    en : 'Exclude Countries'
			}
		    }
		}
	    }

	    ]
	}
    }
};