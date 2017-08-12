/**
 * A  configuration object with the parameters required to build a dropdown widget in the Grid wdiget
 *
 * @module rowsNumConfiguration
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var rowsNumConfiguration = {};

    rowsNumConfiguration = [{
      "id": "num-20",
      "text": "20"
    },
    {
      "id": "num-50",
      "text": "50",
      "selected": true
    },
    {
      "id": "num-100",
      "text": "100"
    }];

    return rowsNumConfiguration;

});
