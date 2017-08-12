define([
    'widgets/dropDown/dropDownWidget',
    'text!../../test/templates/dropDownWidgetTemplate.html',
    'text!widgets/dropDown/tests/dataSample/application.json',
    '../../test/testData/dropDownWidgetTestData.js',
    'mockjax'
], function (DropDownWidget, dropDownTemplate, application, SampleData, mockjax) {

    (function () {
        $.mockjax({
            url: '/api/dropdown/getRemoteData',
            dataType: 'json',
            responseTime: 700,
            response: function (settings) {
                this.responseText = {};
                if (settings.data._search == "searchData") {
                    this.responseText.data = SampleData.searchData;
                } else {
                    this.responseText.data = SampleData.confData;
                }
            },
            success: function () {
                console.log("Remote API call success happened")
            },
            error: function () {
                console.log("Remote API call error happened")
            }
        });
    })();


    describe('DropDownWidget - Unit tests:', function () {

        var $el = $('#test_widget');
        var dropDownContainer = $el.append(dropDownTemplate);


        describe('Simple DropDownWidget', function () {
            var dropDownWidgetObj = new DropDownWidget({
                "container": $el.find('.basic-selection-nodata')
            });

            it('should exist', function () {
                dropDownWidgetObj.should.exist;
            });

            it('build() should exist', function () {
                assert.isFunction(dropDownWidgetObj.build, 'The Drop Down widget must have a function named build.');
            });

            it('destroy() should exist', function () {
                assert.isFunction(dropDownWidgetObj.destroy, 'The Drop Down widget must have a function named destroy.');
            });

            it('addData() should exist', function () {
                assert.isFunction(dropDownWidgetObj.addData, 'The Drop Down widget must have a function named addData.');
            });

            it('getValue() should exist', function () {
                assert.isFunction(dropDownWidgetObj.getValue, 'The Drop Down widget must have a function named getValue.');
            });
            it('setValue() should exist', function () {
                assert.isFunction(dropDownWidgetObj.setValue, 'The Drop Down widget must have a function named setValue.');
            });

            describe('Simple Drop Down Widget Elements', function () {
                before(function () {
                    dropDownWidgetObj.build();
                });

                after(function () {
                    dropDownWidgetObj.destroy();
                });

                it('should add the dropdown widget namespace', function () {
                    dropDownWidgetObj.conf.$container.parent().hasClass('dropdown-widget').should.be.true;
                });

                it('should contain a new container that adds searchable capabilities', function () {
                    dropDownWidgetObj.conf.$container.siblings().hasClass('select2-container').should.be.true;
                });

            });
        });

        describe('DropDownWidget with local data JSON', function () {
            var dropdownElement = $el.find('.basic-selection-data');

            var dropDownWidgetObj = new DropDownWidget({
                "container": dropdownElement,
                "data": SampleData.confData
            });

            it('data should exist', function () {
                assert.isDefined(dropDownWidgetObj.conf.data, 'The Drop Down widget must have JSON data.');
            });

            describe('JSON Drop Down Widget Elements', function () {
                beforeEach(function () {
                    dropDownWidgetObj.build();
                    dropDownWidgetObj.conf.$container.select2("open");
                });

                afterEach(function () {
                    dropDownWidgetObj.destroy();
                });

                it('should contain DOM elements that correspond to the dropdown', function () {
                    assert.isDefined($(".select2-results__option"));
                });

                it('the elements in the dropdown should match dropdown options from the JSON', function () {
                    $(".select2-results__option").length.should.equal(SampleData.confData.length);
                });

                it('should be able to set string Data', function () {
                    var data = "tcp";
                    dropDownWidgetObj.setValue(data);
                    dropDownWidgetObj.getValue().should.equal(data);
                });

                it('should be able to set an object', function () {
                    var self = this;
                    var data = ["ftp", "tftp", "rtsp"];
                    dropDownWidgetObj.setValue(data);
                    dropDownWidgetObj.getValue().should.equal(data[0]);
                });

                it('should be able to set an object', function () {
                    var self = this;
                    var data = [
                        {
                            "id": "junos_ssh",
                            "text": "junos-ssh"
                        }
                    ];
                    dropDownWidgetObj.setValue(data);
                    dropDownWidgetObj.getValue(data).should.equal(data[0].id);
                });

                it('should be able to add Data', function () {
                    dropDownWidgetObj.addData(SampleData.addTestData);
                    dropDownWidgetObj.conf.$container.select2("open");
                    assert.equal($(".select2-results__option").length, SampleData.confData.length + SampleData.addTestData.length, "addData did not append the data");
                });

                it('should be able to reset data', function () {
                    dropDownWidgetObj.addData(SampleData.addTestData, true);
                    dropDownWidgetObj.conf.$container.select2("open");
                    assert.equal($(".select2-results__option").length, SampleData.addTestData.length, "resetData did not reste the data");
                });
            });

        });

        describe('DropDownWidget with Remote Data', function () {
            var remoteCall = {}, remoteSearchCall = {};
            var defer1 = $.Deferred(), defer2 = $.Deferred();

            var searchTest;

            var dropDownWidgetObj = new DropDownWidget({
                "container": $el.find('.test-remote-data'),
                "enableSearch": true,
                "initValue": {
                    "id": "12340",
                    "text": "initValue"
                },
                "remoteData": {
                    "url": "/api/dropdown/getRemoteData",
                    "numberOfRows": 10,
                    "jsonRoot": "data",
                    "jsonRecords": function (data) {
                        return data.data;
                    },
                    "success": function (data) {
                        console.log("succeeded in getting remote data");
                        if (searchTest) {
                            remoteSearchCall.apiData = data;
                            defer2.resolve(remoteSearchCall);
                        } else {
                            remoteCall.apiData = data;
                            defer1.resolve(remoteCall);
                        }
                    },
                    "error": function () {
                        console.log("error while fetching data for remote API call")
                    }
                }
            });


            before(function () {
                dropDownWidgetObj.build();
            });

            after(function () {
                dropDownWidgetObj.destroy();
            });

            it('should exist', function () {
                dropDownWidgetObj.should.exist;
            });

            it('should be able to set Data', function () {
                var newData = {"id": "23450", "text": "newDataText"};
                dropDownWidgetObj.setValue(newData);
                dropDownWidgetObj.getValue(newData).should.equal(newData.id);
            });

            it('should be able to get remote data with api call', function (done) {
                defer1.promise(remoteCall);
                dropDownWidgetObj.conf.$container.select2("open");
                remoteCall.done(function (data) {
                    assert.equal(data.apiData.data.length, SampleData.confData.length, "Remote data call failed to retrieve data");
                    done();
                });
            });

            it('should be able to do the search on remote data', function (done) {
                defer2.promise(remoteSearchCall);
                searchTest = true;
                dropDownWidgetObj.conf.$container.select2("open");
                $(".select2-search__field").val("searchData");
                $(".select2-search__field").trigger("keyup");
                remoteSearchCall.done(function (data) {
                    assert.equal(data.apiData.data.length, SampleData.searchData.length, "Remote data call failed to search remote data");
                    done();
                });
            });
        });

        describe('DropDownWidget with callbacks', function () {
            var dropDownWidgetObj;
            var templateResultCallback = 0;
            var templateSelectionCallback = 0;
            var onChangeCallback = 0;

            var dropDownWidgetObj = new DropDownWidget({
                "container": $el.find('.test-callbacks'),
                "data": SampleData.noTextField,
                "templateResult": function (data) {
                    ++templateResultCallback;
                },
                "templateSelection": function (data) {
                    ++templateSelectionCallback;
                },
                "onChange": function (data) {
                    ++onChangeCallback;
                }
            });

            before(function () {
                dropDownWidgetObj.build();
            });

            after(function () {
                dropDownWidgetObj.destroy();
            });

            it('should exist', function () {
                dropDownWidgetObj.should.exist;
            });

            it('templateResult be executed on open of dropdown', function () {
                dropDownWidgetObj.conf.$container.select2("open");
                assert.equal(templateResultCallback, SampleData.noTextField.length + 1, "templateResult callback not executed");
            });

            it('templateSelection be executed on open of dropdown', function () {
                assert.equal(templateSelectionCallback, SampleData.noTextField.length, "templateSelection callback not executed");
            });

            it('onChange is executed on setting of value', function () {
                dropDownWidgetObj.setValue({"id": "12345", "text": "onChangeCallBack"});
                assert.equal(onChangeCallback, 1, "onChange callback not executed");
            });


        });

        describe('DropDownWidget with Configuration parameters', function () {
            var conf = {
                "container": $el.find('.test-config'),
                "data": SampleData.testConfigData,
                "showCheckboxes": true,
                "multipleSelection": {
                    allowClearSelection: true
                }
            };

            var dropDownWidgetObj = new DropDownWidget(conf);

            before(function () {
                dropDownWidgetObj.build();
            });

            after(function () {
                dropDownWidgetObj.destroy();
            });

            it('should exist', function () {
                dropDownWidgetObj.should.exist;
            });

            it('showCheckboxes conf element prepends the checkboxes', function () {
                dropDownWidgetObj.conf.$container.select2("open");
                assert.equal($(".select2-results__option > span > input:checkbox").length, SampleData.testConfigData.length, "Checkbox are not prepended");
                dropDownWidgetObj.conf.$container.select2("close");
            });

            it('multipleSelection conf element sets the attribute', function () {
                assert.equal(dropDownWidgetObj.conf.$container.attr('multiple'), 'multiple', "Attribute not set for multipleSelection");
            });

            it('multipleSelection createTags are configured', function () {
                // Needs to rebuild the widget to cover the test case for createTags as true condition.
                conf.multipleSelection.createTags = true;
                dropDownWidgetObj = new DropDownWidget(conf).build();
                conf.multipleSelection.createTags = false; // reset to original config
            });

            it('multipleSelection maximumSelectionLength is defined', function () {
                // Needs to rebuild the widget to cover the test case for defined maximumSelectionLength condition.
                conf.multipleSelection.maximumSelectionLength = 3;
                dropDownWidgetObj = new DropDownWidget(conf).build();
                var data = ["12340", "12341", "12342"];
                dropDownWidgetObj.setValue(data);
                dropDownWidgetObj.conf.$container.val(data).trigger("change");
                dropDownWidgetObj.conf.$container.trigger("select2:selecting");
            });
        });
    });
});