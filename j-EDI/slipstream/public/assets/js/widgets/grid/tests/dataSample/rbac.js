/**
 * A rbac sample object 
 *
 * @module rbacSample
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var rbacSample =  {
			createEvent: true,
			updateEvent: true,
			deleteEvent: false,
			copyEvent: true,
			pasteEvent: false,
			statusEvent: false,
			moveEvent: false,
			quickViewEvent: false,
			resetHitEvent: false,
			disableHitEvent: true,
			printGrid: false,
			subMenu: true,
            subMenu3: true,
			testPublishGrid: false,
			testCloseGrid: false
	};

    return rbacSample;

});
