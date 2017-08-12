define([
	'widgets/tabContainer/tests/view/zonePolicyView',
    'widgets/tabContainer/tests/view/utmPolicyView',
    'widgets/tabContainer/tests/view/addressView',
    'widgets/tabContainer/tests/view/addView',
    'text!widgets/tabContainer/templates/tabContainer.html',
	'widgets/tabContainer/tabContainerWidget'
	],function(ZonePolicy, UTMPolicy, AddressView, CreateView, TabContainer, TabContainerWidget) {

		describe('Tab Container Widget - Unit tests:', function() {
            var $el = $('#test_widget'),
                        containerId = 0,
                        tabs = [{
                            id:"zone",
                            name:"Zone Policy",
                            isDefault: true,
                            content: new ZonePolicy()
                        },{
                            id:"utm",
                            name:"UTM Policiy",
                            content: new UTMPolicy()
                        }];

            var createContainer = function () {
                var tabContainerId = "tab-container-id" + containerId++;
                $el.append("<div id = " + tabContainerId + "></div>");
                return $el.find("#"+tabContainerId);
            };

            var cleanUp = function (thisObj) {
                thisObj.tabContainerWidget.destroy();
                thisObj.$tabContainer.remove();
            };

			describe('Widget Interface', function() {
                before(function(){
                    this.$tabContainer = createContainer();
                    this.tabContainerWidget = new TabContainerWidget({
                        "container": this.$tabContainer[0],
                        "tabs": tabs
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('should exist', function() {
					this.tabContainerWidget.should.exist;
				});
				it('build() should exist', function() {
                    assert.isFunction(this.tabContainerWidget.build, 'The tab widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.tabContainerWidget.destroy, 'The tab widget must have a function named destroy.');
                });
			});

            describe('TabContainer Widget Elements', function() {
                before(function(){
                    this.$tabContainer = createContainer();
                    this.tabContainerWidget = new TabContainerWidget({
                        "container": this.$tabContainer[0],
                        "tabs": tabs
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('should contain a tab container', function() {
                    assert.isTrue(this.$tabContainer.find('.ui-tabs').length > 0, "the tab container has been created and the container with ui-tabs class should has children");
                });
                it('should contain the titles of the tabs', function() {
                    assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matched the tabs parameter configuration");
                });
                it('should contain the content of the tabs', function() {
                    assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                });
            });

            describe('TabContainer Widget Layouts', function() {
                describe('Navigation Layout', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "navigation": true
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain a tab container', function() {
                        assert.isTrue(this.$tabContainer.hasClass('tabContainer-navigation'), "the tab container has been created and the container with tabContainer-navigation class has been added");
                    });
                    it('should contain the titles of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matches the tabs parameter configuration");
                    });
                    it('should contain the content of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                    });
                });
                describe('Vertical Layout', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "orientation": "vertical"
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain a tab container', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs').hasClass('ui-tabs-vertical'), "the tab container has been created and the container with ui-tabs-vertical class has been added");
                    });
                    it('should contain the titles of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matches the tabs parameter configuration");
                    });
                    it('should contain the content of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                    });
                });
                describe('Toggle Layout', function() {
                    before(function(){
                        this.$tabContainer = createContainer();
                        this.tabContainerWidget = new TabContainerWidget({
                            "container": this.$tabContainer[0],
                            "tabs": tabs,
                            "toggle": true
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('should contain a tab container', function() {
                        assert.isTrue(this.$tabContainer.hasClass('tabContainer-toggle'), "the tab container has been created and the container with tabContainer-toggle class has been added");
                    });
                    it('should contain the titles of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-tabs-nav li').length == tabs.length, "tab titles have been added and it matches the tabs parameter configuration");
                    });
                    it('should contain the content of the tabs', function() {
                        assert.isTrue(this.$tabContainer.find('.ui-widget-content').length > 0, "data has been rendered for the content of the tab container");
                    });
                });
            });

            describe('TabContainer Widget Methods', function() {
                var tab = {
                        id:"address",
                        name:"Address",
                        content: new AddressView()
                    },
                    newTabs = [{
                        id:"create",
                        name:"Create",
                        content: new CreateView()
                    },{
                        id:"address",
                        name:"Address",
                        content: new AddressView()
                    }];

                beforeEach(function(){
                    this.$tabContainer = createContainer();
                    this.tabContainerWidget = new TabContainerWidget({
                        "container": this.$tabContainer[0],
                        "tabs": tabs
                    }).build();
                });
                afterEach(function(){
                    cleanUp(this);
                });
                it('add a new tab dynamically', function() {
                    this.tabContainerWidget.addTab(tab);
                    assert(this.$tabContainer.find("#tabContainer-widget_tabLink_address").length === 1, "add a new tab dynamically");
                });
                it('remove the existing tab dynamically', function() {
                    this.tabContainerWidget.addTab(tab);
                    this.tabContainerWidget.removeTab('address');
                    assert(this.$tabContainer.find("#tabContainer-widget_tabLink_address").length === 0, 'remove the existing tab dynamically');
                });
                it('add mulitple tabs dynamically', function() {
                    var tabNum = tabs.length + newTabs.length;

                    this.tabContainerWidget.addTab(newTabs);
                    assert(this.$tabContainer.find("li").length === tabNum, "add mulitple tabs dynamically");
                });
                it('remove mulitple tabs dynamically', function() {
                    this.tabContainerWidget.addTab(newTabs);
                    this.tabContainerWidget.removeTab(['create', 'address']);
                    assert(this.$tabContainer.find("li").length === tabs.length, "remove mulitple tabs dynamically");
                });
                it('can not add duplicate tab multiple times', function() {
                    var self = this,
                        duplicateErrorFn = function () { 
                            self.tabContainerWidget.addTab(tab);
                            self.tabContainerWidget.addTab(tab);
                        };
                    
                    assert.throws(duplicateErrorFn, Error, "The ID is duplicated");
                });
                it('at least one tab exists', function() {
                    var self = this,
                        tabErrorFn = function () { 
                            self.tabContainerWidget.removeTab(['zone', 'address', 'utm']);
                        };
                    
                    assert.throws(tabErrorFn, Error, "The Tab Container widget must contain at least 1 tab");
                });
            });

		});

	});
