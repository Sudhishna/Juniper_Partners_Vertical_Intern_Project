/**
 * A module that locks the scrollbar of its container
 *
 * @module ScrollbarLocker
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
],  /** @lends ScrollbarLocker */
    function() {

    /**
     * ScrollbarLocker constructor
     *
     * @constructor
     * @class ScrollbarLocker - Locks the scrollbar of its container
     *
     * @param {Object} container - DOM object that will have a lock on its scrollbar
     * @returns {Object} Current ScrollbarLocker's object: this
     */
    var ScrollbarLocker = function(container){

        /**
         * Keycodes that this function will be listening
         * left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
         */

        var keys = [38, 40];

        /**
         * Implements prevent default method for an event
         * @param {Object} e - event
         */
        var preventDefault = function (e) {
            e = e || container.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        };

        /**
         * Prevents default behavior for the keyboard keys: 37 and 38
         * @param {Object} e - event
         */
        var keydown = function (e) {
            for (var i = keys.length; i--;) {
                if (e.keyCode === keys[i]) {
                    preventDefault(e);
                    return;
                }
            }
        }

        /**
         * Prevents the default behavior of a wheel in a mouse
         * @param {Object} e - event
         */
        var wheel = function (e) {
            preventDefault(e);
        }

        /**
         * Disables the scollbar of an assigned container
         * @param {Object} e - event
         */
        this.disableScroll = function (e) {
            if (container.addEventListener) {
                container.addEventListener('DOMMouseScroll', wheel, false);
            }
            container.onmousewheel = wheel;
            container.onkeydown = keydown;
        }

        /**
         * Enables the scollbar of an assigned container
         * @param {Object} e - event
         */
        this.enableScroll = function (e) {
            if (container.removeEventListener) {
                container.removeEventListener('DOMMouseScroll', wheel, false);
            }
            container.onmousewheel = container.onkeydown = null;
        }

    };

    return ScrollbarLocker;
});