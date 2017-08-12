define(['toastr'], function(toastr) {
	describe('Notification Tests', function() {
      toastr.options.timeOut = 0;

      beforeEach(function() {
          toastr.clear();
      })
      
      describe('Test for existence of global functions on Notification object', function() {
          it('Global setType, setText, and notify methods should be present', function() {
              assert.isFunction(Slipstream.SDK.Notification.prototype.setType);
              assert.isFunction(Slipstream.SDK.Notification.prototype.setText);
              assert.isFunction(Slipstream.SDK.Notification.prototype.notify);
          });
      }); 

      describe('Setting message type to info should result in an info message', function() { 
          var msg = new Slipstream.SDK.Notification();
          msg.setType("info");
          msg.setText("test");
          msg.notify();

          var toast = $('#toast-container .toast');

          it('notification should be of info type ', function() {
              assert(toast.hasClass('toast-info'));
          });
      });

      describe('Setting message type to error should result in an error message', function() { 
          var msg = new Slipstream.SDK.Notification();
          msg.setType("error");
          msg.setText("test");
          msg.notify();

          var toast = $('#toast-container .toast');

          it('notification should be of error type ', function() {
              assert(toast.hasClass('toast-error'));
          });
      });

      describe('Setting message type to success should result in a success message', function() { 
          var msg = new Slipstream.SDK.Notification();
          msg.setType("success");
          msg.setText("test");
          msg.notify();

          var toast = $('#toast-container .toast');

          it('notification should be of success type ', function() {
              assert(toast.hasClass('toast-success'));
          });
      });

      describe('Setting message type to warning should result in a warning message', function() { 
          var msg = new Slipstream.SDK.Notification();
          msg.setType("warning");
          msg.setText("test");
          msg.notify();

          var toast = $('#toast-container .toast');

          it('notification should be of warning type ', function() {
              assert(toast.hasClass('toast-warning'));
          });
      });

      describe('Method chaining should be allowed', function() { 
          new Slipstream.SDK.Notification().
                setType("warning").
                setText("test").
                notify();

          var toast = $('#toast-container .toast');

          it('notification should be generated correctly via method chaining ', function() {
              assert(toast.hasClass('toast-warning'));
          });
      });

      describe('Notification should be placed at the top of the viewport', function() { 
          new Slipstream.SDK.Notification().
                setType("warning").
                setText("test").
                notify();

          var toast = $('#toast-container');

          it('notification should be at the top of the viewport ', function() {
              assert(toast.hasClass('toast-top'));
          });
      });

      describe('Views should be supported as notification messages', function() {
          it ('a view should be rendered into the toast message with events intact', function(done) {
            var note = new Slipstream.SDK.Notification().setType("info");

            function eventHandler() {
                assert(true);
                done();
            }

            var View =  Backbone.View.extend({
                events: {
                    "click .foo": "doit"
                },
                template: "<div>hello <a href='#'' class='foo'>world</span></div>",
                doit: function() {
                    eventHandler();
                },
                render: function() {
                   this.$el.append(this.template);
                }
            });

            var view = new View();
            note.setText(view);
            note.notify();

            view.$el.find(".foo").click();
         });
      });
	});
});