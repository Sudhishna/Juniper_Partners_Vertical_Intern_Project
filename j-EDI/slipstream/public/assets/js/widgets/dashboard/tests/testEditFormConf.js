define([], function () {
    var top10EditFormConf = {
        chartTypeSizeMapping: {
            'BAR': 'double',
            'TIMESERIES': 'double',
            'LIST': 'single'
        },
        formSections: {
            sections: {
                'section_id': 'top10_settings',
                'section_class': 'section_class',
                'elements': [
                    {
                        'element_dropdown': true,
                        'id': 'chartType',
                        'name': 'chartType',
                        'label': 'Chart Type',
                        'required': true,
                        'values': [
                            {
                                'value': 'BAR', 
                                'label': 'Bar',
                                'selected': true
                            },
                            {
                                'value': 'TIMESERIES',
                                'label': 'Time Series'
                            },
                            {
                                'value': 'LIST',
                                'label': 'List'
                            }
                        ]
                    },
                    {
                        'element_dropdown': true,
                        'id': 'auto_refresh',
                        'name': 'auto_refresh',
                        'label': 'Auto Refresh Intervals',
                        'required': true,
                        'values': [
                            {
                                'label': '5 minutes',
                                'value': 5
                            },
                            {
                                'label': '10 minutes',
                                'value': 10
                            },
                            {
                                'label': '15 minutes',
                                'value': 15
                            },
                            {
                                'label': '20 minutes',
                                'value': 20
                            },
                            {
                                'label': '25 minutes',
                                'value': 25
                            },
                            {
                                'label': '30 minutes',
                                'value': 30,
                                'selected': true
                            }
                        ]
                    },
                    {
                        'element_dropdown': true,
                        'id': 'show_top',
                        'name': 'show_top',
                        'label': 'Show Top',
                        'required': true,
                        'values': [
                            {
                                'label': '1',
                                'value': 1
                            },
                            {
                                'label': '2',
                                'value': 2
                            },
                            {
                                'label': '3',
                                'value': 3
                            },
                            {
                                'label': '4',
                                'value': 4
                            },
                            {
                                'label': '5',
                                'value': 5
                            },
                            {
                                'label': '6',
                                'value': 6
                            },
                            {
                                'label': '7',
                                'value': 7
                            },
                            {
                                'label': '8',
                                'value': 8
                            },
                            {
                                'label': '9',
                                'value': 9
                            },
                            {
                                'label': '10',
                                'value': 10,
                                'selected': true
                            }
                        ]
                    }
                ]
            }
        }
    };
    return top10EditFormConf;
});
