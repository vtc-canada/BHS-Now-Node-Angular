module.exports.views = {
    locals : {
	reportselects : {
	    eqp_ids : [{id:1,label:'EQP 1'},{id:2,label:'EQP 2'},{id:3,label:'EQP 3'},{id:4,label:'EQP 4'}]
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
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
		},
		parameters : {
		    'start_time' : {
			order: 0,
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Start Timesss'
			}
		    },
		    'end_time' : {
			order: 1,
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'eqp_id' : {
			order: 3,
			type : 'select',
			source : 'eqp_ids',
			dependant : {
			    'dev_id' : {
				'url' : '/reports/getdevicesbyeqpid'
			    }
			},
			locale_label : {
			    en : 'Equipment',
			    es : 'Equipo'
			}
		    },
		    'dev_id' : {
			order: 4,
			type : 'select',
			parents : ['eqp_id'],
			url : '/reports/testselect',
			locale_label : {
			    en : 'Device',
			    es : 'Dispositivo'
			}
		    }
		}
	    }, {
		id : 2,
		name : {
		    locale_label : {
			en : 'Equipment Summary Report',
			es : 'Informe resumido Equipo'
		    }
		},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
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
		    },
		    'eqp_id' : {
			type : 'select',
			dependant : {
			    'dev_id' : {
				'url' : '/reports/getdevicesbyeqpid'
			    }
			},
			source : 'eqp_ids',
			locale_label : {
			    en : 'Equipment',
			    es : 'Equipo'
			}
		    },
		    'dev_id' : {
			type : 'select',
			parent : 'eqp_id',
			locale_label : {
			    en : 'Device',
			    es : 'Dispositivo'
			}
		    },
		    'sections' : {
			type : 'checkboxes',
			locale_label : {
			    en : 'Device Types',
			    es : 'Secciones'
			},
			checkboxes : {
			    'tracking_photo_eyes' : {
				locale_label : {
				    en : 'Tracking Photo Eyes',
				    es : 'Seguimiento de Fotos Eyes'
				}
			    },
			    'jam_photo_eyes' : {
				locale_label : {
				    en : 'Jam Photo Eyes',
				    es : 'Jam Fotos Eyes'
				}
			    },
			    'diverters' : {
				locale_label : {
				    en : 'Diverters',
				    es : 'Desviadores'
				}
			    },
			    'vertical_sorters_mergers' : {
				locale_label : {
				    en : 'Vertical Sorters / Mergers',
				    es : 'Clasificadores / Fusiones verticales'
				}
			    }
			}
		    }
		}

	    }, {
		id : 3,
		name : {
		    locale_label : {
			en : 'Equipment Interval Report',
			es : 'Informe resumido Equipo'
		    }
		},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
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
		    },
		    'eqp_id' : {
			type : 'select',
			dependant : {
			    'dev_id' : {
				'url' : '/reports/getdevicesbyeqpid'
			    },
			    'interval' : {
				'disabled' : true
			    }
			},
			source : 'eqp_ids',
			locale_label : {
			    en : 'Equipment',
			    es : 'Equipo'
			}
		    },
		    'dev_id' : {
			type : 'select',
			parent : 'eqp_id',
			locale_label : {
			    en : 'Device',
			    es : 'Dispositivo'
			}
		    },
		    'interval' : {
			type : 'select',
			source : 'intervals',
			parent : 'eqp_id',
			limit : 1000,
			disabled : true,
			locale_label : {
			    en : 'Interval',
			    es : 'Interval'
			}
		    },
		    'sections' : {
			type : 'checkboxes',
			locale_label : {
			    en : 'Device Types',
			    es : 'Secciones'
			},
			checkboxes : {
			    'tracking_photo_eyes' : {
				locale_label : {
				    en : 'Tracking Photo Eyes',
				    es : 'Seguimiento de Fotos Eyes'
				}
			    },
			    'jam_photo_eyes' : {
				locale_label : {
				    en : 'Jam Photo Eyes',
				    es : 'Jam Fotos Eyes'
				}
			    },
			    'diverters' : {
				locale_label : {
				    en : 'Diverters',
				    es : 'Desviadores'
				}
			    },
			    'vertical_sorters_mergers' : {
				locale_label : {
				    en : 'Vertical Sorters / Mergers',
				    es : 'Clasificadores / Fusiones verticales'
				}
			    }
			}
		    }
		}
	    },
	    {
		id : 5,
		name : {
		    locale_label : {
			en : 'Throughput Report',
			es : 'Throughput Report'
		    }
		},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
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
		    },
		    'interval' : {
			type : 'select',
			source : 'intervals',
			limit : 1000,
			locale_label : {
			    en : 'Interval',
			    es : 'Interval'
			}
		    }
		}
	    },
	    {
		id : 6,
		name : {
		    locale_label : {
			en : 'Executive Summary Report',
			es : 'Executive Summary Report'
		    }
		},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
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
	    }],
	    '/search' : [ {
		id : 4,
		name : {
		    locale_label : {
			en : 'Bag Search',
			es : 'Informe del historial de Bags'
		    }
		},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
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