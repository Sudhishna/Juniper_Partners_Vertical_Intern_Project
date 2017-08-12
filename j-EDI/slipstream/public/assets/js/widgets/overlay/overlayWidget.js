/**
 * Overlay widget creates the overlays center aligned to the page.
 *
 * @module OverlayWidget
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @author Dennis Park   <dpark@juniper.net>
 * @author Arvind Kannan   <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone.modal',
    'backbone.marionette.modals',
    'widgets/overlay/overlaySingletonLayout',
    'text!widgets/overlay/templates/overlay.html',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
], /** @lends OverlayWidget */ function (backboneModal, backboneMarionetteModals, OverlaySingletonLayout, OverlayTemplate, render_template, i18n) {
    /**
     * OverlayWidget constructor
     *
     * @constructor
     * @class OverlayWidget
     * @param {Object} conf - OverlayWidget's configuration object
     * @return {Object} instance of OverlayWidget object
     *
     * conf object
     * @param {Object} view - Backbone view object with render() method
     * @param {boolean} okButton - okButton at bottom right corner | default : false
     * @param {boolean} cancelButton - cancelButton at bottom right corner | default : false
     * @param {string} type - Overlay type values - wide / large / medium / small | default : wide
     * @example
     * var conf={
             view: BackboneViewObj,
             okButton: true,
             cancelButton: true,
             type: 'small',
             class: 'pluginName'
             };
     */
    var OverlayWidget = function (conf) {

        var overlayLayoutManager;
        var overlayObj;
        var focusHandler = function (e) {
            if (overlayObj.$el.find(e.target).length > 0) {
                return true;
            }

            e.preventDefault();
            e.stopImmediatePropagation();
            var ownTabbable = overlayObj.$el.find(':tabbable');
            if (ownTabbable.length > 0) {
                ownTabbable[0].focus();
            }
            return false;
        };

        var OverlayModel = Backbone.Model.extend({
            defaults: {
                xIconEl: true,
                cancelButton: false,
                okButton: false,
                showScrollbar: false,
                showBottombar: false,
                ok_button: i18n.getMessage('ok_button_label'),
                cancel_button: i18n.getMessage('cancel_button_label'),
                onActive: function () {

                }
            }
        });

        var isInputElem = function (e) {
            return (($(e.target).is("input")) && ($(e.target).attr('type') !== 'submit') || ($(e.target).is("textarea")));
        };

        var Overlay = Backbone.Modal.extend({
            self: this,
            viewContainer: '.bbm-modal__section',
            submitEl: '.overlay-done',
            cancelEl: '.overlay-cancel',
            checkKey: function (e) {
                if (this.active) {
                    switch (e.keyCode) {
                        case 13:
                            return isInputElem(e);
                        case 27:
                            return this.triggerCancel();
                    }
                }
            },
            onRender: function () {
            },
            views: {
                "contentView": {
                    view: conf.view.render()
                }
            },
            beforeSubmit: function () {
                // expects true or false, accordingly submit method is executed.
                return (applicationCallback.call(this, conf.beforeSubmit));
            },
            submit: function () {
                applicationCallback.call(this, conf.submit);
            },
            beforeCancel: function () {
                // expects true or false, accordingly cancel method is executed.
                return (applicationCallback.call(this, conf.beforeCancel));
            },
            cancel: function () {
                var self = this;
                if (conf.view.close instanceof Function) {
                    $.proxy(conf.view.close, self.views.contentView.view)();
                }

                // This is overlay configuration callback
                applicationCallback.call(this, conf.cancel);
            },
            onClose: function () {
                // This is the last function to be called before overlays destroyed
                overlayObj.$el.off('keydown');
                //Stop listening for events before closing the overlay
                if (overlayLayoutManager.modals.modals.length <= 1) {
                    Backbone.$('body').off('.slipstreamOverlay');
                    removeModalContainer();
                }

                var bbmWrappers = $('.bbm-wrapper');
                if (bbmWrappers && bbmWrappers.length > 0) {
                    $(bbmWrappers[bbmWrappers.length - 1]).off('click');

                    // adjust the background according to number of stacked overlays
                    if (bbmWrappers.length >= 2) {
                        $(bbmWrappers[bbmWrappers.length - 2]).addClass("overlayBg");
                    }
                }

                setFocusToTopmost();
            },
            initialize: function () {
                // Work around to disable the 'close on clickoutside' behavior of Backbone.Modal.
                this.clickOutside = function (e) {};
                this.template = function (data) {
                    return render_template(OverlayTemplate, data);
                };

                // config elements is bind to template
                if ((conf.cancelButton == true) || (conf.okButton == true)) {
                    // show bottombar only if overlay - cancelButton / OkButton is used
                    conf.showBottombar = true;
                }
                var overlayModelData = new OverlayModel(conf);
                this.model = overlayModelData;

                // get the manager object from singleton class
                overlayLayoutManager = OverlaySingletonLayout.getInstance();

                // render layout container only once in beginning
                if ($('#overlay_content .modals-container').length == 0) {
                    $('#overlay_content').append(overlayLayoutManager.render().el);
                }
            }
        });

        /**
         * callback to executes configuration methods
         */
        var applicationCallback = function (functionName){
            var self = this;
            if (functionName instanceof Function) {
                return($.proxy(functionName, self.views.contentView.view)());
            }
        };

        /**
         * Removes the Modal container from DOM, if all the overlays are closed
         */
        var removeModalContainer = function () {
            $('#overlay_content .modals-container').parent().remove();
        };

        /**
         * Check if children exist before destroying overlay(s) and avoid destroy resulting from enter key event
         * @param  {boolean} destroyAllOverlays [description]
         */
        var destroyOverlay = function (destroyAllOverlays) {
            (destroyAllOverlays) ? overlayLayoutManager.modals.closeAll() : overlayLayoutManager.modals.close();
            if (overlayLayoutManager.modals.modals.length === 0) {
                removeModalContainer();
            }
            typeof(conf.view.close) == "function" && conf.view.close();
        };

        /**
         * Inserts the overlay in DOM.
         *
         * @return {Object} the OverlayWidget object
         */
        this.build = function () {
            overlayObj = new Overlay();
            overlayLayoutManager.modals.show(overlayObj);
            var containerClass = conf.class ? conf.class : "";

            overlayObj.$el.on('keydown', function (e) {
                if (e.keyCode === 9 || e.which === 9) {
                    var ownTabbable = overlayObj.$el.find(':tabbable');
                    // prevent default tab action
                    var current = $(document.activeElement)[0];
                    var inputTo = null;   // either next or first.
                    if (e.shiftKey) {   // account for reverse tabbing (Shift + Tab)
                        if (ownTabbable.length > 0 && current === ownTabbable[0]) {
                            e.preventDefault();
                            ownTabbable[ownTabbable.length - 1].focus();
                            return false;
                        }
                    }
                    else if (ownTabbable.length > 0 && current === ownTabbable[ownTabbable.length - 1]) {
                        e.preventDefault();
                        ownTabbable[0].focus();
                        return false;
                    }
                }
                return true;
            });

            var $bbmModalDiv = overlayObj.$el.find('.bbm-modal');
            switch (conf.type) {
                // @TODO - remove wide as a supported value in the future, when all apps have migrated
                case 'wide':
                case 'xlarge':
                case 'flexible':
                    $bbmModalDiv.addClass("overlay-xlarge " + containerClass);
                    break;
                case 'large':
                    $bbmModalDiv.addClass("overlay-large " + containerClass);
                    break;
                case 'medium':
                    $bbmModalDiv.addClass("overlay-medium " + containerClass);
                    break;
                case 'small':
                    $bbmModalDiv.addClass("overlay-small " + containerClass);
                    break;
                case 'xsmall':
                    $bbmModalDiv.addClass("overlay-xsmall " + containerClass);
                    break;
                // case 'flexible':
                //     $bbmModalDiv.addClass("overlay-flexible "+ containerClass);
                //     break;
                default :
                    // Will be null for user defined sizes
                    if (conf.height && conf.width) {
                        $bbmModalDiv.css({"height": conf.height, "width": conf.width});
                    }
            }
            // Remove vertical scroll bar from overlay
            if (!conf.showScrollbar) {
                var $bbmModalSectionDiv = overlayObj.$el.find('.bbm-modal_scrolldiv');
                $bbmModalSectionDiv.removeClass('bbm-modal_scrolldiv');
            }

            // // set height
            var $topBarDiv = overlayObj.$el.find('.bbm-modal__topbar');
            var $sectionDiv = overlayObj.$el.find('.bbm-modal__section');
            var $bottomBarDiv = overlayObj.$el.find('.bbm-modal__bottombar');

            var sectionHeight = 0;

            var $overlayForm = overlayObj.$el.find('form.onOverlay');
            if ($overlayForm.length > 0 && $overlayForm.children()) {
                for (var ii = 0; ii < $overlayForm.children().length; ii++) {
                    if (ii == 1) {
                        var _sectionHeight = $overlayForm.find('.slipstream-content-wrapper').outerHeight(true);
                        sectionHeight += _sectionHeight;
                    }
                    else {
                        var _height = $($overlayForm.children()[ii]).outerHeight(true);
                        sectionHeight += _height;
                    }
                }
                $sectionDiv.removeClass('contentPadding');
            } else {
                $sectionDiv.addClass('contentPadding');
                if ($sectionDiv.children().height() < 1) {
                    sectionHeight = $sectionDiv.height();
                } else {
                    sectionHeight = $sectionDiv.children().height();
                }
                sectionHeight += 10;   // padding for .contentPadding {padding-top: 10px;}
            }
            var contentHeight = ($topBarDiv.outerHeight() + 1) + $bottomBarDiv.outerHeight() + sectionHeight;   // +1 for the border on the topBarDiv.
            $bbmModalDiv.css({"height": (parseInt(contentHeight) + 10) + 'px'});  // +10 for vertical padding of content.

            typeof($bbmModalDiv.resizable) == "function" && $bbmModalDiv.resizable();

            var bbmWrappers = $('.bbm-wrapper');
            if (bbmWrappers && bbmWrappers.length > 0) {
                $(bbmWrappers[bbmWrappers.length - 1]).on('click', focusHandler);

                // adjust the background according to number of stacked overlays
                $(bbmWrappers[bbmWrappers.length - 1]).addClass("overlayBg");
                if (bbmWrappers.length >= 2) {
                    $(bbmWrappers[bbmWrappers.length - 2]).removeClass("overlayBg");
                }
            }
            setFocusToFirstTabbable();

            return this;
        };

        var setFocusToFirstTabbable = function () {
            var ownTabbableEl = overlayObj.$el.find(':tabbable');
            if (ownTabbableEl && ownTabbableEl.length > 0) {
                ownTabbableEl[0].focus();
            }
        };

        var setFocusToTopmost = function () {
            var bbmWrappers = $('.bbm-wrapper');
            if (bbmWrappers && bbmWrappers.length >= 2) {
                $(bbmWrappers[bbmWrappers.length - 2]).trigger('click');
            }
        };

        /**
         * Destroys current overlay.After bottom most overlay is closed - modal container is removed from the DOM.
         *
         * @return {Object} the OverlayWidget object
         */
        this.destroy = function () {
            destroyOverlay(false);
            return this;
        };

        /**
         * Destroys all nested overlays.After all overlays are closed - modal container is removed from the DOM.
         *
         * @return {Object} the OverlayWidget object
         */
        this.destroyAll = function () {
            destroyOverlay(true);
            return this;
        };

        /**
         * Method to get the most current overlay object.
         *
         * @return current Overlay object
         */
        this.getOverlay = function () {
            return overlayObj;
        };

        /**
         * Method to get the current overlay container.
         *
         * @return current Overlay container
         */
        this.getOverlayContainer = function () {
            var overlayContainer;
            if ($('#overlay_content .overlay-wrapper').length > 0) {
                overlayContainer = $('#overlay_content .overlay-wrapper');
            } else {
                throw new Error("The overlay widget has to be built first");
            }
            return overlayContainer;
        };
    };
    return OverlayWidget;
});