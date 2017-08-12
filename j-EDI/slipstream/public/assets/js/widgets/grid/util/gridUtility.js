/**
 * A module contailns the utitly method
 *
 * @module gridUtility
 * @author Eva Wang<iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
],  /** @lends GridUtility */
    function() {

    /**
     * GridUtility constructor
     *
     * @returns {Object} Current GridUtility's object: this
     */
    var GridUtility = function() {

        //We use this method to generate unique key for the grid
        this.generateRandomKey = function () {
            var key;
            if (Slipstream && Slipstream.SDK && Slipstream.SDK.Utils && Slipstream.SDK.Utils.uuid){
                key = Slipstream.SDK.Utils.uuid();
            }else{
                key = Math.ceil(Math.random() * 1000000);
            }
            return key;
        };
    };

   return GridUtility;
});