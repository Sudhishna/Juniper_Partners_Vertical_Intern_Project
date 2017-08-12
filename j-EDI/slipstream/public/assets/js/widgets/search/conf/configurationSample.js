/**
 * A sample configuration object that shows the parameters required to build a Search widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
], function () {

    var searchConf = {};

    searchConf.filterMenu = {
        'OSVersionKey': {
            'label':'OSVersion',
            'value':['12.1','12.2','12.3','12.4','13.1','13.3','13.3','13.4']
        },
        'DeviceFamilyKey': {
            'label':'DeviceFamily',
            'value':['SRX','MX','EX']
        },
        'PlatformKey': {
            'label':'Platform',
            'value':['srx650', 'srx5800', 'mx2020', 'ex2200']
        },
        'ManagedStatusKey': {
            'label':'ManagedStatus',
            'value':['In Sync','Out of Sync','Connecting']
        },
        'ConnectionStatusKey': {
            'label':'ConnectionStatus',
            'value':['Down', 'Up']
        },
        'NameKey': {
            'label':'Name',
            'value':['']
        },
        'IPAddressKey': {
            'label':'IPAddress',
            'value':['']
        }
    };

    searchConf.logicMenu = ['AND','OR','NOT'];

    return searchConf;

});
