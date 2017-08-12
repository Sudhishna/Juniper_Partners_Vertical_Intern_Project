/**
 * A view that uses the Form Widget to render a form from a configuration object for the Application view
 *
 * @module ApplicationView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
//    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'widgets/listBuilder/listBuilderWidget',
    'widgets/donutChart/donutChartWidget'
], function(Backbone, FormWidget, formConfiguration, ListBuilderWidget, DonutChartWidget){
    var ApplicationView = Backbone.View.extend({

        events: {
            'click #show_device_details': 'getDeviceDetails'
            //'click #show_device_details': 'postData'
            //click button event --> calls function with quickview --overlay
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.Application,
                "container": this.el
            });
            this.form.build();
            this.getModelData();
            return this;
        },

        //parse through JSON data from Python API
        getModelData:function (){
            var self = this;
            this.model.fetch({success: function(collection) {
                var applications = [];
                collection.models.forEach(function(model){
                      // applications.push({
                      //     'label': "Up Devices", //returns ex2200 model information
                      //     'value': upDevices
                      //     // 'label': model.get('userId'),
                      //     // 'value': model.get('userId')
                      // });
                      var upDevices = [];
                      var downDevices = [];

                      upDevices.push("devicesUp", parseInt(model.get("DevicesUp")))
                      downDevices.push("devicesDown", parseInt(model.get("DevicesDown")))
                      applications.push(upDevices, downDevices)
                });
                self.addListBuilder('application',applications);
            }});
        },


        addListBuilder: function (id,myData){
          console.log(myData)
            var listContainer = this.$el.find('#'+id)
            var options = {
              donut: {
                name: "Devices Count",
                data: myData,
                showInLegend: true
              }
            };
            this.listBuilder = new DonutChartWidget({
                "options": options,
                "container": listContainer
            });
            this.listBuilder.build();
            listContainer.children().attr('id',id);
            listContainer.find('.donut-chart-widget').unwrap()
        },

        getViewData: function (){
            var viewData = {};
            if (this.form && this.form.isValidInput()){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    viewData[values[i].name] = values[i].value;
                }
                viewData['application'] = this.getListBuilderSelectedItems('application');
            }
            return viewData;
        },

        search: function (itemToFind){
          var viewData = {}
          if (this.form && this.form.isValidInput()){
            var values = this.form.getValues();
            for (var i=0; i<values.length; i++){
                viewData[values[i],name] = values[i].value;
            }
            viewData['application'] = this.getListBuilderSelectedItems('application');
            return viewData[itemToFind]
          }
        },

        getListBuilderSelectedItems: function(id){
            var listValues = [];
            var data = this.listBuilder.getSelectedItems();
            for (var i=0; i<data.length; i++){
                listValues.push(data[i].value);
            }
            return listValues;
        },

        isValidTabInput: function(){
            return this.form.isValidInput();
        },

        // postData: function (){
        //   var self = this;
        //   this.model.fetch({
        //     //url: "http://www.jsontest.com/",
        //     type: 'POST',
        //     //data: JSON.stringify({"name": "Kelcy"}),
        //     success: function (data){
        //       alert(JSON.parse(data))
        //     },
        //     error: function (data, status){
        //       alert(data.status)
        //     }
        //   })
        // }

    });

    return ApplicationView;
});
