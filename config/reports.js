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
		tables : [ {
		    sproc : 'reports_CategoryReport',
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
			align:'left',
			titlealign:'left',
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
			en : 'Donor Class Report',
			es : 'Informe resumido Equipo'
		    }
		},
		title : {
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Finalización'
			}
		    }
		}

	    }, {
		id : 3,
		name : {
		    locale_label : {
			en : 'Volunteer Report',
			es : 'Informe resumido Equipo'
		    }
		},
		title : {
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Finalización'
			}
		    }
		}
	    } ],
	    '/search' : [ {
		id : 4,
		name : {
		    locale_label : {
			en : 'Bag Search',
			es : 'Informe del historial de Bags'
		    }
		},
		title : {
		    logo : 'iSystemsNow-Logo-RGB-Black.png'
		},
		footer : {
		    logo : 'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Start Timesss'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'search_field' : {
			type : 'text',
			post_value : '',
			locale_label : {
			    en : 'IATA / Security ID',
			    es : 'IATA / Security ID'
			}

		    }
		}
	    } ]
	}
    }
};