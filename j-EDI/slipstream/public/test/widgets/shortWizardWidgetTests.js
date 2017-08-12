define([
	'widgets/shortWizard/shortWizard', 
	'backbone'
	],function(ShortWizard, Backbone) {
		describe('Short Wizard - Unit tests:', function() {
			describe('Short Wizard', function() {
				var shortWizardWidgetObj = null;
				var myPage1 = null;
				var myPage2 =  null;
				var myPage3 = null;
				var myPage4 = null;
				var myIntroPage = null;
				var pageChangeCallbackCalled = false;
				var pageChangeCallbackArg1 = false;
				var pageChangeCallbackArg2 = false;
				var destroyCallbackCalled = false;
				//var $el = $('#main_content');
				var $el = $('#test_widget');
				var el = $el[0];

				MyIntroPageView = Backbone.View.extend({
				    getTitle : function() {
					    return 'My Intro Page Title';
				    },
				    getDescription: function(){
					    return 'My Intro Page description.';
				    },
				    render: function(){
					    this.$el.html('<h3>This is is the intro page content</h3>');
					    return this;
				    }
				});

				MyObjView = Backbone.View.extend({
                    render: function(){
						this.$el.html(this.options.name);
						return this;
					},
					getTitle: function() {
						return this.options.name;
					},
					getDescription: function() {
						return this.options.name + ' should completely fill out form.';
					},
					beforePageChange: function(currentPage, requestedPage) {
						pageChangeCallbackCalled = true;
						pageChangeCallbackArg1 = currentPage;
						pageChangeCallbackArg2 = requestedPage;
						return true;
					}
				});

				MyCustomView = Backbone.View.extend({
			        initialize: function(pages){
			            console.log(pages);
			        },
			        render: function(){
			            this.formWidget = new FormWidget({
			                "elements": customSummarySample.elements,
			                "container": this.$el
			            });
			            this.formWidget.build();

			            this.grid = new GridWidget({
			                container: this.$el,
			                elements: customSummarySample.smallGrid
			            });
			            this.grid.build();
			            return this;
			        }
			    });

				beforeEach(function(){
					myIntroPage = {title: "Intro", view: new MyIntroPageView(), intro: true};
					myPage1 = {title: "Page 1", view: new MyObjView({name: "myWizardPage1"})};
					myPage2 = {title: "Page 2", view: new MyObjView({name: "myWizardPage2"})};
					myPage3 = {title: "Page 3", view: new MyObjView({name: "myWizardPage3"})};
					myPage4 = {title: "Page 4", view: new MyObjView({name: "myWizardPage4"})};
					myPage5 = {title: "Page 5", view: new MyObjView({name: "myWizardPage5"})};
					myPage5.view.beforePageChange = function() {
						return false;
					}

                    $el.empty();
					shortWizardWidgetObj = new ShortWizard({
						container: el,
						title: 'myTitle',
						onDestroy: function() {
                            destroyCallbackCalled = true;
						},
						pages: [myIntroPage, myPage1, myPage2, myPage3, myPage4, myPage5]
					})
				});

				afterEach(function(){
					shortWizardWidgetObj = null;
					myIntroPage = null;
					myPage1 = null;
					myPage2 =  null;
					myPage3 = null;
					myPage4 = null;
					pageChangeCallbackCalled = false;
				    pageChangeCallbackArg1 = false;
				    pageChangeCallbackArg2 = false;
					destroyCallbackCalled = false;
				});

				it('After instantiating, the Short Wizard should exist', function() {
					shortWizardWidgetObj.should.exist;
				});

				it('build must be a function on the Short Wizard', function() {
					assert.isFunction(shortWizardWidgetObj.build, 'The short wizard must have a function named build.');
				});

				it('destroy must be a function on the Short Wizard', function() {
					assert.isFunction(shortWizardWidgetObj.destroy, 'The short wizard must have a function named destroy.');
				});

				it('getCurrentPage must be a function on the Short Wizard', function() {
					assert.isFunction(shortWizardWidgetObj.getCurrentPage, 'The short wizard must have a function named getCurrentPage.');
				});

				it('nextPage must be a function on the Short Wizard', function() {
					assert.isFunction(shortWizardWidgetObj.nextPage, 'The short wizard must have a function named nextPage.');
				});

				it('previousPage must be a function on the Short Wizard', function() {
					assert.isFunction(shortWizardWidgetObj.previousPage, 'The short wizard must have a function named previousPage.');
				});

				it('gotoPage must be a function on the Short Wizard', function() {
					assert.isFunction(shortWizardWidgetObj.gotoPage, 'The short wizard must have a function named gotoPage.');
				});

				it('getNumPages must be a function on the Short Wizard', function() {
					assert.isFunction(shortWizardWidgetObj.getNumPages, 'The short wizard must have a function named getNumPages.');
				});

				it('build() should return the wizard instance', function() {
					var el = shortWizardWidgetObj.build();
					assert.isTrue(el === shortWizardWidgetObj, 'Short Wizard build return value should be wizard object.');
				});

				it('After instantiating, the Short Wizard current page should be -1', function() {
					shortWizardWidgetObj.getCurrentPage().should.be.equal(-1);
				});

				it('After instantiating there should be 7 pages in the wizard', function() {
					shortWizardWidgetObj.getNumPages().should.be.equal(7);
				});

				it('nextPage() should cause getCurrentPage to increment', function() {
					shortWizardWidgetObj.build();

					var currentPage = shortWizardWidgetObj.getCurrentPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(currentPage + 1);
				});

				it('nextPage() should stop incrementing when last page is reached', function() {
					shortWizardWidgetObj.build();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(0);
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(1);
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(5);
				});

				it('previousPage() should cause the getCurrentPage to decrement', function() {
					shortWizardWidgetObj.build();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(0);
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(1);
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(2);
					shortWizardWidgetObj.previousPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(1);
					shortWizardWidgetObj.previousPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(0);
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(1);
					shortWizardWidgetObj.previousPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(0);
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.nextPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(4);
					shortWizardWidgetObj.previousPage();
					shortWizardWidgetObj.getCurrentPage().should.be.equal(3);
				});
				
				it('when build is called on shortWizard, intro page should be rendered', function() {
					shortWizardWidgetObj.build();
					var title = $el.find('.shortWizardContainer h3').html();
					assert.equal(title, "This is is the intro page content");
				});

				it('when nextPage is called on shortWizard, the associated train step should have the proper class (current or visited) .', function() {
					shortWizardWidgetObj.build();
					var $trainElement = $($el.find(".shortWizardTrain .trainCircle")[0]);
					assert.isTrue(!$trainElement.hasClass('current'));
					assert.isTrue(!$trainElement.hasClass('visited'));
					
					shortWizardWidgetObj.nextPage();

					assert.isTrue($trainElement.hasClass('current'));
					assert.isTrue(!$trainElement.hasClass('visited'));

					shortWizardWidgetObj.nextPage();	
					assert.isTrue(!$trainElement.hasClass('current'));
					assert.isTrue($trainElement.hasClass('visited'));
				});

				it('when previousPage is called on shortWizard, the associated train step should have the proper class (current or visited) .', function() {
					shortWizardWidgetObj.build();
					var $trainElement = $($el.find(".shortWizardTrain .trainCircle")[1]);
					assert.isTrue(!$trainElement.hasClass('current'));
					assert.isTrue(!$trainElement.hasClass('visited'));

					shortWizardWidgetObj.nextPage();	
					shortWizardWidgetObj.nextPage();

					assert.isTrue($trainElement.hasClass('current'));
					assert.isTrue(!$trainElement.hasClass('visited'));

					shortWizardWidgetObj.previousPage();	
					assert.isTrue(!$trainElement.hasClass('current'));
					assert.isTrue($trainElement.hasClass('visited'));
				});

				it('when gotoPage is called on shortWizard, the associated train step should have the proper class (current or visited) .', function() {
					shortWizardWidgetObj.build();
					var $trainElement = $($el.find(".shortWizardTrain .trainCircle")[1]);
					assert.isTrue(!$trainElement.hasClass('current'));
					assert.isTrue(!$trainElement.hasClass('visited'));

					shortWizardWidgetObj.gotoPage(2);

					assert.isTrue($trainElement.hasClass('current'));
					assert.isTrue(!$trainElement.hasClass('visited'));
				});

				it ('trying to change steps when beforePageChange() returns false should not change the page', function() {
                    shortWizardWidgetObj.build(); 
                    shortWizardWidgetObj.gotoPage(5);  
                    var $trainElement = $($el.find(".shortWizardTrain .trainCircle")[4]); 
                    assert.isTrue($trainElement.hasClass('current'));
                    shortWizardWidgetObj.gotoPage(2);  
                    assert.isTrue($trainElement.hasClass('current'));
				});

				it('should include page information in beforePageChange callback', function() {
					shortWizardWidgetObj.build();
					assert.isFalse(pageChangeCallbackCalled);
					assert.isFalse(pageChangeCallbackArg1);
					assert.isFalse(pageChangeCallbackArg2);
					shortWizardWidgetObj.nextPage();
					assert.isFalse(pageChangeCallbackCalled);
					shortWizardWidgetObj.nextPage();
					assert.isTrue(pageChangeCallbackCalled);
					assert.isTrue(pageChangeCallbackArg1 === 1);
					assert.isTrue(pageChangeCallbackArg2 === 2);
					shortWizardWidgetObj.nextPage();
					assert.isTrue(pageChangeCallbackArg1 === 2);
					assert.isTrue(pageChangeCallbackArg2 === 3);
					shortWizardWidgetObj.previousPage();
					assert.isTrue(pageChangeCallbackArg1 === 3);
					assert.isTrue(pageChangeCallbackArg2 === 2);
					shortWizardWidgetObj.gotoPage(4);
					assert.isTrue(pageChangeCallbackArg1 === 2);
					assert.isTrue(pageChangeCallbackArg2 === 4);
				});

				it('calling destroy on the shortWizard should trigger the onDestroy callback if it is provided', function() {
					assert.isFalse(destroyCallbackCalled);
					shortWizardWidgetObj.destroy();
					assert.isTrue(destroyCallbackCalled);
				});
			});

			describe('nextPage Method', function() {
                var shortWizardWidgetObj = null;
				var myPage1 = null;
				var myPage2 =  null;
				var pageChangeCallbackCalled = false;
				var pageChangeCallbackCalledCount = 0;
				var pageChangeCallbackArg1 = false;
				var pageChangeCallbackArg2 = false;
				var destroyCallbackCalled = false;
				var $el = $('#test_widget');
				var el = $el[0];

				myPageView = Backbone.View.extend({
                    render: function(){
						this.$el.html(this.options.name);
						return this;
					},
					beforePageChange: function(currentPage, requestedPage) {
						return false;
					}
				});

				beforeEach(function(){
					myPage1 = {title: "Page 1", view: new myPageView({name: "myWizardPage1"})};
					myPage2 = {title: "Page 2", view: new myPageView({name: "myWizardPage2"})};
					myPage1.view.beforePageChange = function(currentPage, requestedPage) {
						pageChangeCallbackCalled = true;
						pageChangeCallbackArg1 = currentPage;
						pageChangeCallbackArg2 = requestedPage;
						pageChangeCallbackCalledCount+=1;
						return false;
					};

                    $el.empty();

					shortWizardWidgetObj = new ShortWizard({
						container: el,
						title: 'myTitle',
						onDestroy: function() {
                            destroyCallbackCalled = true;
						},
						pages: [myPage1, myPage2]
					});
				});

				afterEach(function(){
					shortWizardWidgetObj = null;
					myPage1 = null;
					myPage2 =  null;
					pageChangeCallbackCalled = false;
				    pageChangeCallbackArg1 = false;
				    pageChangeCallbackArg2 = false;
					destroyCallbackCalled = false;
					pageChangeCallbackCalledCount = 0;
				});    
                it('trigger beforePageChange', function() {
					shortWizardWidgetObj.build(); 
					assert.isFalse(pageChangeCallbackCalled);
					shortWizardWidgetObj.nextPage();
					assert.isTrue(pageChangeCallbackCalled);
				});
				it('bypass beforePageChange', function() {
					shortWizardWidgetObj.build(); 
					assert.isFalse(pageChangeCallbackCalled);
					shortWizardWidgetObj.nextPage();
					assert.isTrue(pageChangeCallbackCalled);
					assert.isTrue(pageChangeCallbackArg1 === 0);
					assert.isTrue(pageChangeCallbackArg2 === 1);
					assert.isTrue(pageChangeCallbackCalledCount === 1);
					shortWizardWidgetObj.nextPage(true);
					assert.isTrue(pageChangeCallbackArg1 === 0);
					assert.isTrue(pageChangeCallbackArg2 === 1);
					assert.isTrue(pageChangeCallbackCalledCount === 1);
				});
            });
		});
	});
