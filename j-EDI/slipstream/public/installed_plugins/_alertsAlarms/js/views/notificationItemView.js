define(['marionette', 
	'text!../../templates/notificationItem.tpl'], function(Marionette, notificationItemTemplate) {
        var severity_class_map = ['unknown', 'info', 'minor', 'major', 'critical'];
        var itemView = Marionette.ItemView.extend({
                template: notificationItemTemplate,
                serializeData: function() {
                	var serializedModel = this.model.toJSON(),
                	    generatedTime = Slipstream.SDK.DateFormatter.format(new Date(serializedModel["generated-time"]), "LLL"),
                            timeDuration = Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_time_duration"}),
                            threshold = Slipstream.reqres.request("nls:retrieve", {msg: "notification_center_threshold"});

                    if(serializedModel["source"] instanceof Object){//in case of alerts back end is sending serializedModel["source"] as an object, in case of alarms it is a string
                            serializedModel["source"]  = timeDuration + serializedModel["source"]["Time Duration"] + ", " +
                                                         threshold + serializedModel["source"]["Threshhold"];
                    };
                	_.extend(serializedModel, {
                		'generated-time': generatedTime,
                		'severity_class': severity_class_map[serializedModel.severity]
                	});

                	return serializedModel;
                }
	});
	return itemView;
});