/**
 * OverlaySingletonLayout provides same instance of layoutManager to be used by nested overlays, which may be initiated from different
 * files in application
 *
 * @module OverlaySingletonLayout
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone.marionette.modals',
    'text!widgets/overlay/templates/overlayContainer.html', 
    'lib/template_renderer/template_renderer'
], /** @lends OverlaySingletonLayout */ function (backboneMarionetteModals, OverlayContainerTemplate, render_template) {
    /**
     * OverlaySingletonLayout constructor
     *
     * @constructor
     * @class OverlaySingletonLayout
     * @return {Object} instance OverlaySingletonLayout object
     */
    var OverlaySingletonLayout = (function () {
        // create Layout Manager object
        var Layout = Backbone.Marionette.Layout.extend({
            regions: {
                modals: {
                    selector: '.modals-container',
                    regionType: Backbone.Marionette.Modals
                }
            },
            initialize: function () {
                this.template = function (data) {
                    return render_template(OverlayContainerTemplate, data);
                };
            }
        });
        var instance;
        return {
            getInstance: function () {
                if (instance == null) {
                    instance = new Layout();
                    // Hide the constructor so the returned objected can't be new'd...
                    instance.constructor = null;
                }
                return instance;
            }
        };
    })();
    return OverlaySingletonLayout;
});


