define([
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/conf/configurationSampleTree',
    'widgets/grid/tests/dataSample/multiLevelTreeData',
    'mockjax'
],function(GridWidget, configurationSample, firewallPoliciesData, configurationTreeSample, firewallPoliciesTreeData, mockjax) {

    var $el = $('#test_widget'),
        containerId = 0;

    var createContainer = function () {
        var $container = $("<div id = grid-container-id" + containerId++ + "></div>");
        $el.append($container);
        return $container;
    };

    var cleanUp = function (thisObj) {
        thisObj.gridWidgetObj.destroy();
        thisObj.$gridContainer.remove();
    };

    /* mocks REST API response for remote validation of an input value */
    (function (){
        $.mockjax({
            url: '/api/get-data',
            dataType: 'json',
            response: function(settings) {
                console.log('parameters in the mockjack request: ' + settings.data);
                if (typeof settings.data == 'string'){
                    var urlHash = {},
                        seg = settings.data.split('&');
                    for (var i=0;i<seg.length;i++) {
                        if (!seg[i]) { continue; }
                        var s = seg[i].split('=');
                        urlHash[s[0]] = s[1];
                    }
                    switch(urlHash['_search']){
                        case "PSP":
                            this.responseText = firewallPoliciesData.firewallPoliciesFiltered;
                            break;
                        case "NoData":
                            this.responseText = firewallPoliciesData.noDataResponse;
                            break;
                        default:
                            this.responseText = firewallPoliciesData.firewallPoliciesAll;
                    }
                }
                else {
                    this.responseText = firewallPoliciesData.firewallPoliciesAll;
                }
            },
            responseTime: 10
        });
        $.mockjax({
            url: '/api/get-tree',
            response: function(settings) {
                var urlHash = {},
                    seg = settings.data.split('&');
                for (var i=0;i<seg.length;i++) {
                    if (!seg[i]) { continue; }
                    var s = seg[i].split('=');
                    urlHash[s[0]] = s[1];
                }
                if(urlHash.page == 2){
                    this.responseText = firewallPoliciesTreeData.firewallPoliciesPage2;
                } else {
                    switch(urlHash['_search']){
                        case "PSP":
                            this.responseText = firewallPoliciesTreeData.firewallPoliciesFiltered;
                            break;
                        case "NoData":
                            this.responseText = firewallPoliciesTreeData.noDataResponse;
                            break;
                        default:
                            if (urlHash.filter) {
                                this.responseText = firewallPoliciesTreeData.firewallPoliciesFiltered;
                            } else {
                                switch(urlHash.nodeid){
                                    case "11":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel11;
                                        break;
                                    case "15":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel15;
                                        break;
                                    case "25":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel25;
                                        break;
                                    case "4":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel4;
                                        break;
                                    case "55":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel55;
                                        break;
                                    default:
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesAll;
                                }
                            }
                    }
                }
            },
            responseTime: 10
        });
    })();

    describe('Grid Widget - Unit Tests:', function() {

        describe('Grid Widget Interface', function() {
            before(function(){
                this.$gridContainer = createContainer();
                this.gridWidgetObj = new GridWidget({
                    "elements": configurationSample.simpleGrid,
                    "container": this.$gridContainer[0]
                }).build();
            });
            after(function(){
                cleanUp(this);
            });
            it('should exist', function() {
                this.gridWidgetObj.should.exist;
            });
            it('build() should exist', function() {
                assert.isFunction(this.gridWidgetObj.build, 'The Grid widget must have a function named build.');
            });
            it('destroy() should exist', function() {
                assert.isFunction(this.gridWidgetObj.destroy, 'The Grid widget must have a function named destroy.');
            });
        });

        describe('Grid Widget Elements', function() {
            before(function(done){
                this.$gridContainer = createContainer();
                this.gridWidgetObj = new GridWidget({
                    "elements": configurationSample.simpleGrid,
                    "container": this.$gridContainer[0]
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
            });
            after(function(){
                cleanUp(this);
            });
            it('should contain a grid', function() {
                assert.equal(this.$gridContainer.find('.ui-jqgrid').length, 1, "the grid has been created and the container with ui-jqgrid class should have a child container");
            });
            it('should contain the header of the grid', function() {
                assert.isTrue(this.$gridContainer.find('.ui-jqgrid-labels th').length > 0, "column headers has been created and the grid widget should have added at least one column");
            });
            it('should contain the content of the grid', function() {
                assert.isTrue(this.$gridContainer.find('.ui-jqgrid-btable tr').length > 1, "data has been rendered and the grid widget should have created a least more than one row");
            });
        });

        describe('Grid Widget User Preferences for:', function() {

            describe('Simple Grid', function() {
                before(function(){
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid,
                        "container": this.$gridContainer[0],
                        "onConfigUpdate": function (updatedConf) {
                            self.updatedConfiguration = updatedConf;
                        }
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                });
                after(function(){
                    cleanUp(this);
                });
                it('should add a token and then the onConfigUpdate callback from the grid configuration should be invoked', function() {
                    //simulates that user adds a token
                    this.gridWidgetObj.search("test");
                    assert.isNotNull(this.updatedConfiguration.search, "the search parameter in the updatedConfiguration configuration gets updated from the onConfigUpdate callback");
                    assert.includeMembers(this.updatedConfiguration.search, ['test'], 'includes the "test" token');
                });
                it('should trigger column sort and onConfigUpdate callback from the grid configuration should be invoked', function() {
                    var sortingElementsOriginalLength = this.updatedConfiguration.elements.sorting ? this.updatedConfiguration.elements.sorting.length : 0;
                    //simulates that user triggers the sorting of a column
                    this.$gridTable.sortGrid('DestinationAddress',true).trigger('reloadGrid');
                    assert.lengthOf(this.updatedConfiguration.elements.sorting, sortingElementsOriginalLength + 1, 'includes the new sorted column');
                });
            });

            describe('Tree Grid', function() {
                before(function(){
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationTreeSample.treeGridPreselection,
                        "container": this.$gridContainer[0],
                        "onConfigUpdate": function (updatedConf) {
                            self.updatedConfiguration = updatedConf;
                        }
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                });
                after(function(){
                    cleanUp(this);
                });
                it('should add a token and then the onConfigUpdate callback from the grid configuration should be invoked', function() {
                    //simulates that user adds a token
                    this.gridWidgetObj.search("test");
                    assert.isNotNull(this.updatedConfiguration.search, "the search parameter in the updatedConfiguration configuration gets updated from the onConfigUpdate callback");
                    assert.includeMembers(this.updatedConfiguration.search, ['test'], 'includes the "test" token');
                });
                it('should trigger column sort and onConfigUpdate callback from the grid configuration should be invoked', function() {
                    var sortingElementsOriginalLength = this.updatedConfiguration.elements.sorting ? this.updatedConfiguration.elements.sorting.length : 0;
                    //simulates that user triggers the sorting of a column
                    this.$gridTable.sortGrid('name',true).trigger('reloadGrid');
                    assert.lengthOf(this.updatedConfiguration.elements.sorting, sortingElementsOriginalLength + 1, 'includes the new sorted column');
                });
            });

        });

        describe('Grid Footer for:', function() {

            describe('Simple Grid', function() {
                before(function(done){
                    var data = firewallPoliciesData.firewallPoliciesAll;
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.numbersOfRows = configurationSample.simpleGrid.jsonRecords(data);
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function(){
                    cleanUp(this);
                });
                it('should match the number of rows provided in the grid data and the one that getNumberOfRows method returns', function() {
                    assert.equal(this.gridWidgetObj.getNumberOfRows(), this.numbersOfRows, "numbers of rows from the getNumberOfRows method should match the numbers of rows provided in the grid configuration");
                });
                it('should show the number of rows provided in the grid data', function() {
                    assert.equal(this.$gridContainer.find('.gridTableFooter .totalRows').text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows provided in the grid configuration");
                });
            });

            describe('Tree Grid', function() {
                before(function(done){
                    var data = firewallPoliciesTreeData.firewallPoliciesAll;
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationTreeSample.treeGridPreselection,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.numbersOfRows = configurationTreeSample.treeGridPreselection.jsonRecords(data);
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function(){
                    cleanUp(this);
                });
                it('should match the number of rows provided in the grid data and the one that getNumberOfRows method returns', function() {
                    assert.equal(this.gridWidgetObj.getNumberOfRows(), this.numbersOfRows, "numbers of rows from the getNumberOfRows method should match the numbers of rows in the grid data");
                });
                it('should show the number of rows provided in the grid data', function() {
                    assert.equal(this.$gridContainer.find('.gridTableFooter .totalRows').text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows in the grid data");
                });
            });

        });

    });

});