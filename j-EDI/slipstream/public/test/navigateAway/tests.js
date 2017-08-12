/** 
 * A test file that implements test cases for the Navigate Away Handler.
 * elements.
 *
 * @author Dennis Park <dpark@juniper.net> 
 * @copyright Juniper Networks, Inc. 2014
 */
define([], function() {
	describe('Navigate Away Handler Tests', function() {
      beforeEach(function() {
      });
      
      // describe('Test for existence of global functions on NavigateAwayHandler object', function() {
          // it('Global enable, disable, and isEnabled methods should be present', function() {
          //     assert.isFunction(Slipstream.SDK.NavigateAwayHandler.prototype.enable);
          //     assert.isFunction(Slipstream.SDK.NavigateAwayHandler.prototype.disable);
          //     assert.isFunction(Slipstream.SDK.NavigateAwayHandler.prototype.isEnabled);
          // });
      // });

      // describe('Manual Test for the adding of an event listener to the global window object - manual refresh', function(){
        //   it('Test that event listener added to global window object - should prompt for confirmation1.', function(){
        //       var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
        //       var isDirty = true;

        //       var isDirtyCallback = function(e) {
        //           if(isDirty){
        //             var confirmationMessage = "\o/";
        //             confirmationMessage = 'Hello'
        //             e.returnValue = confirmationMessage;     // Gecko and Trident
        //             return confirmationMessage;              // Gecko and WebKit        
        //           } else {
        //             return false;
        //           }  
        //       };

        //       navAwayHandler.enable(isDirtyCallback);
        //       navAwayHandler.disable();
        //       return true;   // or false if failed.
        //   });
        // });         

        //   it('Test that event listener added to global window object - should prompt for confirmation.', function(){
        //       var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
        //       var isDirty = true;
        //       navAwayHandler.enable(function(e){
        //           if(isDirty){
        //             var confirmationMessage = "\o/";
        //             confirmationMessage = 'Hello'
        //             e.returnValue = confirmationMessage;     // Gecko and Trident
        //             return confirmationMessage;              // Gecko and WebKit        
        //           } else {
        //             return false;
        //           }      
        //       });
        //       navAwayHandler.disable();              
        //       // window.location.reload();
        //       return true;   // or false if failed.
        //   });
        // // }); 

        // it('Test that event listener added to global window object - should not prompt for confirmation.', function(){
        //     // var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
        //     // navAwayHandler.enable();
        //     // navAwayHandler.disable();
        //     return true;   // or false if failed.
        // });
      // });       

      describe('Manual Test for the adding of an event listener to the global window object - debug mode', function(){
        it('Test that event listener added to global window object', function(){

            //  This test case is dependent on the Console API.  Must run these statements in the debugger.         
            // debugger;
            // var navAwayHandler = new Slipstream.SDK.NavigateAwayHandler();
            // var eventListenerList = getEventListers(window);
            // var events = Object.keys(eventListenerList);
            // assert(events.length === 1);
            // navAwayHandler.enable();
            // eventListenerList = getEventListers(window);
            // events = Object.keys(eventListenerList);            
            // assert(events.length === 2);
            // navAwayHandler.disable();
            // eventListenerList = getEventListers(window);
            // events = Object.keys(eventListenerList);
            // assert(events.length === 1);            
            return true;   // or false if failed.
        });
      });
    });
});