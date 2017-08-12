/**
 * A utility for ScheduleRecurrenceWidget
 *
 * @module ScheduleRecurrenceWidget
 * @author Vignesh K.
 * @copyright Juniper Networks, Inc. 2015
 */
define([], function() {
			
    var ScheduleRecurrenceUtil = function () {
        
        /**
         * Get the values of selected items of a check box collection.
         * @param $checkBoxColl - the jQuery wrapper for check box collection.
         * @param formatter - An optional method which will be used to format the values
         * @returns {Array} The array of values of selected check boxes
         */
         this.getCheckedItems = function($checkBoxColl, formatter) {
          var checkedColl = [];
          $checkBoxColl.each(function() {
            if(this.checked) {
              var value = formatter ? formatter(this.value) : this.value;
              checkedColl.push(value);
            }
          });
          return checkedColl;
         };
                 
         /**
          * Merges the given date object and the given time string.
          * @param dateObj date object
          * @param time time string
          * 
          * @returns {Object} Merged Date object 
          */
         this.mergeDateTime = function(dateObj, time) {
           if(dateObj) {
             time = this.to24HourFormat(time);
             var units = time.split(":");
             dateObj.setHours(parseInt(units[0]));
             dateObj.setMinutes(parseInt(units[1]));
             dateObj.setSeconds(parseInt(units[2]));
           }
           return dateObj;
          };
         
          /**
           * Converts the given time string to 24-hour format.
           * @param time time string in 12-hour format (e.g. "10:25:00 PM")
           * 
           * @returns {String} The time string in 24-hour format (e.g "10:25:00 PM" => "22:25:00")
           */
          this.to24HourFormat = function(time) {
            try {
              if (time) {
                time = time.trim().toUpperCase();
                var timeParts = time.split(" ");
                var numPart = timeParts[0];
                var ampm = timeParts[1];
                if(ampm) {
                   var numParts = numPart.split(":");
                   var hours = parseInt(numParts[0]);
                   var minutes = numParts[1];
                   var seconds = numParts[2];
                   
                   if (ampm === "PM") {
                     hours = (hours < 12) ? hours + 12 : hours;
                   } else if(hours == 12){
                     hours = 0;
                   }
                   hours = hours.toString();
                   hours = hours[1] ? hours : "0" + hours;
                   numPart = hours + ":" + minutes + ":" + seconds;
                }
                time = numPart;
             }
            } catch (e) {
              console.log("Error in converting time from 12 hour to 24 hour format : " + e);
              throw e;
            }

            return time;
          };
           
           /**
            * Converts the given time string to 12-hour format.
            * @param time time string in 24-hour format (e.g. "20:25:00")
            * 
            * @returns {String} The time string in 12-hour format (e.g "20:25:00" => "08:25:00 PM")
            */
           this.to12HourFormat = function(time) {

             try {
               var timeParts = time.split(":");
               var hours = parseInt(timeParts[0]);
               var minutes = timeParts[1];
               var seconds = timeParts[2];
               var ampm = (hours < 12) ? "AM" : "PM";
               hours = (hours > 12) ? hours % 12 : hours;
               if( hours == 0 ) {
                 hours = 12;
               }
               hours = hours.toString();
               hours = hours [ 1 ] ? hours : "0" + hours;
               time = hours + ":" + minutes + ":" + seconds + " " + ampm;
             }
             catch (e) {
               console.log("Error in converting time from 24 hour to 12 hour format : " + e);
               throw e;
             }
             return time;
           };
           
           /**
            * Converts given array of objects having name and value to an object with property as name and assigns the value to property.
            * @param formObjectArray The array of objects having the properties name and value.
            * @returns {Object} The object having the keys as the name and values assigned
            * 
            * e.g. : Converts [ \{name: "id",value: "2"\}, \{name: "time",value: "20:10:10"\} ]  to  \{id: "2", time: "20:10:10"\}
            */
           this.toKeyValueObj = function(formObjectArray) {
             var customObj = {};
             formObjectArray.forEach(function(item) {
               if (!customObj [ item.name ]) { // if not already present
                 customObj [ item.name ] = item.value;
               }
               else { // if present already make it an array
                 if ($.isArray(customObj [ item.name ])) {
                   customObj [ item.name ].push(item.value);
                 }
                 else {
                   var tempArray = new Array();
                   tempArray.push(customObj [ item.name ]);
                   tempArray.push(item.value);
                   customObj [ item.name ] = tempArray;
                 }
               }
             });
             return customObj;
           };
            
            /**
             * Validates the time string
             * @param time the time string
             * @returns {Boolean} The boolean value representing the validity of the time string
             */
            this.isValidTimeFormat = function(time) {
              var timeRegex=/(^(([0-1]?[0-9])|([2][0-3])):([0-5][0-9])(:([0-5][0-9]))?$)|(^(1[012]|[0]?[1-9]):([0-5][0-9])(:([0-5][0-9]))? (([aA]|[pP])[mM])$)/;
              return timeRegex.test(time);
            };
            
            /**
             * Get the matched list 
             * @param givenList The array list to be matched with the match list
             * @param matchList The array list to match with the given list
			 * @param defaultList The array list to return if matched item is none
             * @returns Array The array of matched items. If none of the item match then the specified default list will be returned
             */
            this.getMatchedItemsList = function(givenList, matchList, defaultList) {
            	                
                if( givenList && matchList )
                {
                	var resultList = [];
                	for (var ii in givenList) {
                		for ( var jj in matchList ) {
                		     if(givenList[ii] == matchList[jj])
                		     {
                		    	 resultList.push(givenList[ii]);
                		     }
                		 }
                	}
                	if(resultList.length > 0)
                	{
                		return resultList;
                	}
                }
                return defaultList;
            };
            
            
            /**
             * Converts given objects having name and value to an array with object values.
             * @param formObject The  objects having the properties name and value.
             * @returns Array The array having the values of object
             * 
             * e.g. : Converts [ \{name: "id",value: "2"\}, \{name: "time",value: "20:10:10"\} ]  to  ["2", "20:10:10"]
             */
            this.toValueArray = function(formObject) {
            	var valueArray = [];
                
                for ( var key in formObject) {
                	valueArray.push(formObject[key]);
            	 }
                return valueArray;
            };
            
            /**
             * Converts the time string in format HH:MM to HH:MM:SS
             * @param time The time string
             * @returns The time string in HH:MM:SS format (e.g. : "10:20 AM" => "10:20:00 AM" )
             */
            this.appendSeconds = function(time) {
              if(time) {
                var parts =  time.split(" ");
                var timePart = parts[0];
                var ampm = parts[1];
                if(! timePart.split(":")[2]) {
                  time = timePart + ":00" + (ampm ? " " + ampm : "");
                }
              }
              return time;
            };
            
            /**
             * Get the string format of the given date object.
             * 
             * @param date The date object
             * @returns {String} The date in "MM-DD-YYYY HH:MM:SS" or "MM-DD-YYYY hh:MM:SS AM/PM" format.
             */
            this.getDateTimeString = function(date, formatTo24Hr) {
              var dateTime = null;
              if (date) {
                var yyyy = date.getFullYear().toString();
                var mm = addPadding(date.getMonth() + 1);
                var dd = addPadding(date.getDate());
                
                var hours = date.getHours();
                var AMPM;
                if(!formatTo24Hr) {
                  AMPM = (hours < 12) ? "AM" : "PM";
                  hours = (hours > 12) ? hours % 12 : ((hours == 0) ? 12 : hours);
                }
                
                var HH = addPadding(hours);
                var MM = addPadding(date.getMinutes());
                var SS = addPadding(date.getSeconds());
                
                var dateString = mm + "-" + dd + "-" + yyyy;
                var timeString = HH + ":" + MM +":" + SS + (AMPM ? " " + AMPM : "");
                
                dateTime = dateString + " " + timeString;
              }
              return dateTime;
            };
        
         var addPadding = function(str) {
           str = String(str);
           return str[1] ? str : "0"+str[0];
         };
    };
			
    return ScheduleRecurrenceUtil;

});