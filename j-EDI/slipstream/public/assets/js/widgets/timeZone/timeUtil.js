/** 
 * A js utility for time related stuff.
 * @module TimeUtil
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([], /** @lends TimeUtil */ function() {
    /**
     * Construct a TimeUtil
     * @constructor
     * @class TimeUtil
     */
    var TimeUtil = function() {
    };

    /**
     * Extends stdTimezoneOffset() to the Date.
     * @returns {Number} offset in minutes, like 240 (for EST with DST), 300 (for EST only) and -330 (for IST only)  
     */
    Date.prototype.stdTimezoneOffset = function() {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };

    /**
     * Extends dst() to the Date.
     * @returns {Boolean} true if DST enabled
     */
    Date.prototype.dst = function() {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    };


    /**
     * Returns true if client machine is running with DST enabled.
     * @returns {Boolean} true if DST enabled
     */
    TimeUtil.IsClientDSTEnabled = function() {
        return (new Date()).dst();
    };

    /**
     * Returns offset (in minutes) from GMT for the client machine.
     * For EST, it will return -240 (DST on) or -300 (DST off).
     * For IST, it will return 330
     * @returns {Number} the offset in minutes from GMT
     */
    TimeUtil.GetClientTimezoneOffset = function() {
        var date = new Date();

        var tzo = date.getTimezoneOffset();    // this return -240 (for EST with DST), 300 (for EST only) and -330 (for IST only)  
        tzo *= -1;    // negate it for better readability
        
        return tzo;
    };

    /**
     * Returns timezone string (like UTC -5:00 for EST) from GMT for the specified datetime.
     * @param {Object} offset - If no offset is specified, then client's current offset is used.
     * @param {Object} dst - If dst is specified, then offset is adjusted by 60 minutes.
     * @returns {String} the timezone string
     */
    TimeUtil.GetTimezoneString = function(offset, dst) {
        if (offset == undefined) {
            offset = TimeUtil.GetClientTimezoneOffset()
        }
        
        if (dst == undefined || dst == true) {
            if (TimeUtil.IsClientDSTEnabled()) {
                offset -= 60; 
            }
        }
        
        var hrs = Math.floor(offset / 60);
        if (hrs < 0) { hrs *= -1; }
        
        var mins = offset % 60;
        if (mins < 0) { mins *= -1; }
        
        var minutes = (mins<=9)?"00":"" + mins;
        
        var tzs;
        if (offset < 0) {
            // we are behind GMT
            tzs = "UTC -" + hrs + ":" + minutes;
        } else if (offset > 0) {
            // we are ahead GMT
            tzs = "UTC +" + hrs + ":" + minutes;
        } else {
            // we are at GMT
            tzs = "UTC +/-0:00"; 
        }
          
        return tzs;    
    };

    return TimeUtil;
});