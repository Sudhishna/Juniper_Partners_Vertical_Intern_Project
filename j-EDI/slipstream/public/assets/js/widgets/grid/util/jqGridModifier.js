/**
 * A module that overrides the default functionalities of jqGrid library
 *
 * @module JqGridModifier
 * @author Sanket Desai<sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
],  /** @lends JqGridModifier */
    function() {

    /**
     * JqGridModifier constructor
     *
     * @constructor
     * @class JqGridModifier - Overrides the functionalities of jqGrid library
     *
     */
    var JqGridModifier = function(){

        /**
         *Function to override htmlDecode and htmlEncode methods
         *
         */
            this.modifyEncoder = function() {

                $.jgrid.htmlDecode = function(value){
                  if(typeof value !== "object") {   //Only decode the value if it is not an object
                    if(value && (value==='&nbsp;' || value==='&#160;' || (value.length===1 && value.charCodeAt(0)===160))) { return "";}
                        return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");       
                   } else{
                        return value;
                    }
                 }

                $.jgrid.htmlEncode = function(value){
                    if(typeof value !== "object"){   //To preserve the state of the object after 'inline edit mode' is removed
                        return !value ? value : String(value).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    } else {
                        return value;
                    }
                }
            }

        };

    return JqGridModifier;
});