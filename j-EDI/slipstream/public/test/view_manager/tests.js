define(['marionette'], function(Marionette) {
	describe('View Adapter Unit Tests', function() {
		it("callbacks must be called in correct order", function() {
	    	var close_called,
	            before_render_called,
	            after_render_called,
	            before_close_called,
	            after_close_called,
	            render_called;

	    	function initFlags() {
                close_called = false;
		        before_render_called = false;
		        after_render_called = false;
		        before_close_called = false;
		        after_close_called = false;
		        render_called = false;
	    	}

	        var MyView = function() {
	        	this.$el = $("<div>");
	        	this.el = this.$el[0];

	        	this.render = function() {
	        		assert(before_render_called == true, 'before_render must be called before render');
	        	    render_called = true;
                    this.$el.append("<span id='foo'></span>");
	        	}

	        	this.close = function() {
	        		assert(before_close_called == true, 'before_close must be called before close');
                    close_called = true;
	        	}

	        	this.beforeRender = function() {
	        		before_render_called = true;
	        	}

	        	this.afterRender = function() {
	        		assert(before_render_called == true, "beforeRender must be called before afterRender");
	        		assert(render_called == true, "render must be called before afterRender");
	        		after_render_called = true;
	        	}

	        	this.beforeClose = function() {
	        		assert(close_called == false, "beforeClose must be called before close");
	        		assert(after_close_called == false, "beforeClose must be called before afterClose");
	        		before_close_called = true;
	        	}

	        	this.afterClose = function() {
	        		assert(before_close_called == true, "beforeClose must be called before afterClose");
	        		after_close_called = true;
	        	}
	        }

	        initFlags();

            var myView = new MyView();

            Slipstream.vent.trigger("view:render", myView);
            assert(render_called == true, "render must be called");
            assert(before_render_called == true, "beforeRender must be called");
            assert(after_render_called == true, "afterRender must be called");

            initFlags();

            Slipstream.vent.trigger("view:render", myView); // re-render to test close callbacks
            assert(after_close_called == true, "afterClose must be called");
            assert(before_close_called == true, "beforeClose must be called");
            assert(close_called == true, "close must be called");
		});	
	});
});