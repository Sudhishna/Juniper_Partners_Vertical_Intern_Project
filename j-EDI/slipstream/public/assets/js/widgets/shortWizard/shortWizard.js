/**
 * The ShortWizard is a wizard container that manages objects of type
 *  wizard page and implements the ShortWizard behavior.
 *
 * @module ShortWizard
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'widgets/shortWizard/views/wizardLayout',
    'widgets/shortWizard/views/trainStepView',
    'widgets/shortWizard/views/trainView',
    'widgets/shortWizard/views/wizardPageTitleView',
    'widgets/shortWizard/views/wizardTitleView',
    'widgets/shortWizard/views/buttonBarView',
    'widgets/shortWizard/views/cancelConfirmView',
    'widgets/shortWizard/views/pageView',
    'widgets/shortWizard/views/summaryView',
    'widgets/shortWizard/views/customSummaryView',
    'widgets/shortWizard/views/commitStatusPageView',
    'widgets/shortWizard/models/trainStepModel',
    'widgets/shortWizard/models/trainStepCollection',
    'widgets/shortWizard/models/wizardTitleModel',
    'widgets/confirmationDialog/confirmationDialogWidget', 
    'widgets/shortWizard/lib/tooltipBuilder',
    'foundation.core'
], /** @lends ShortWizard */ function(
    Marionette,
    WizardLayout,
    TrainStepView,
    TrainView,
    WizardPageTitleView,
    WizardTitleView,
    ButtonBarView,
    CancelConfirmView,
    PageView,
    SummaryView,
    CustomSummaryView,
    CommitStatusPageView,
    TrainStepModel,
    TrainStepCollection,
    WizardTitleModel,
    ConfirmationDialog,
    TooltipBuilder,
    foundation) {

    /**
     * ShortWizard constructor
     *
     * @constructor
     * @class ShortWizard
     * @param {Object} conf - The wizard's configuration object.
     */
    var ShortWizard = function(conf) {
        var pages = [],
            currentStep = -1,
            currentRelativeStepNo = 0,
            id = _.uniqueId("shortWizard"),
            rootSelector = "div[id=" + id + "]",
            that = this,
            vent = new Backbone.Wreqr.EventAggregator(),
            onDone = conf.onDone,
            onCancel = conf.onCancel,
            $container = $(conf.container);

        if(conf.relatedActivities){
          this.relatedActivities = conf.relatedActivities;
        }

        if(conf.onClickRelatedLinks){
          this.onClickRelatedLinks = conf.onClickRelatedLinks;
        }

        if(conf.customSuccessStatusFooter){
          this.customSuccessStatusFooter = conf.customSuccessStatusFooter;
        }

        if(conf.customErrorStatusFooter){
          this.customErrorStatusFooter = conf.customErrorStatusFooter;
        }

        var wizardTitleModel = new WizardTitleModel({
            title: conf.title,
            titleHelp: conf.titleHelp
        });

        var wizardPageTitleModel = new WizardTitleModel({
            title: conf.pageTitle
        });

        var trainStepCollection = new TrainStepCollection();

        var trainView = new TrainView({
            collection: trainStepCollection,
            vent: vent
        });

        var buttonView = new ButtonBarView({
            vent: vent
        });

        var titleView = new WizardTitleView({
            model: wizardTitleModel
        });

        var wizardPageTitleView = new WizardPageTitleView({
            model: wizardPageTitleModel,
            modelEvents: {
                "change": function() {
                    this.render();
                }
            }
        });

        addPages(conf.pages);

        if (hasSummaryPage()) {
          if (_.isBoolean(conf.showSummary) || typeof conf.showSummary === "undefined" ){

            var summaryPageConf = {
                title: 'Summary',
                view: new SummaryView({
                  pages: conf.pages,
                  vent: vent,
                  summaryTitle: conf.summaryTitle,
                  summaryEncode: conf.summaryEncode
              })
            };
            addPage(new PageView(summaryPageConf));
          }else{

            var summaryPageConf = {
                title: 'Summary',
                view: new CustomSummaryView({
                    pages: conf.pages,
                    view: conf.showSummary,
                    summaryTitle: conf.summaryTitle,
                    summaryEncode: conf.summaryEncode
                })
            };
            addPage(new PageView(summaryPageConf));
            
          }
            
        }

        // Add a commitStatus page
        var commitStatusPageConf = {
            view: new CommitStatusPageView({
                vent: vent,
                relatedActivities: that.relatedActivities,
                onClickRelatedLinks: that.onClickRelatedLinks,
                customSuccessStatusFooter: that.customSuccessStatusFooter,
                customErrorStatusFooter: that.customErrorStatusFooter
            })
        };

        addPage(new PageView(commitStatusPageConf));

        var wizardLayout = new WizardLayout();

        bindEvents();

        /**
         * Add a page to the wizard workflow.
         *
         * @param {Page} page - The page to be added.
         */
        function addPage(page) {
            var stepNumber = pages.length;
            pages.push(page);
            if (!(page.isIntro() || (page.getView() instanceof SummaryView) || (page.getView() instanceof CustomSummaryView)|| (page.getView() instanceof CommitStatusPageView))) {
                trainStepCollection.add(new TrainStepModel({
                    title: page.getTrainStepTitle(),
                    step: stepNumber,
                    relStep: currentRelativeStepNo++
                }));
            }
        };

        /**
         * Add a set of pages to the wizard workflow.
         *
         * @param {Object[]} pages - The array of pages to be added.
         */
        function addPages(pages){
            for(var i = 0; i < pages.length; i++){
                addPage(new PageView(pages[i]));
            };
        };

        /**
         * Destroy the wizard.
         */
        this.destroy = function() {
            unbindEvents();
            wizardLayout.close();
            buttonView.close();
            titleView.close();
            wizardPageTitleView.close();
            trainView.close();
            if (conf.onDestroy) {
                conf.onDestroy();
            }
        },

        /**
         * Get the current wizard page
         *
         * @returns {number} current wizard page number
         */
        this.getCurrentPage = function() {
            return currentStep;
        };

        /**
         * Move the wizard to the next page
         */
        this.nextPage = function(skipBeforePageChange) {
           vent.trigger("step:try_next", skipBeforePageChange);
        };

        /**
         * Move the wizard to the previous page
         */
        this.previousPage = function() {
            vent.trigger("step:try_previous");
        };

        /**
         * Go to a specified wizard page
         *
         * @param {number} page - The index of the page to which to move the wizard.
         */
        this.gotoPage = function(page) {
            vent.trigger("step:try_selected", page);
        };

        /**
         * Get the number of pages added to the wizard.
         *
         * @returns {number} The number of pages added to the wizard.
         */
        this.getNumPages = function() {
            return pages.length <= 1 ? 0 : pages.length - 1;
        };

         /**
         * Build the wizard in the specified container.
         *
         * @return The short wizard object instance
         */
        this.build = function() {
            wizardLayout.render();

            titleView.setElement($('.shortWizardTitle', wizardLayout.$el)).render();
            trainView.setElement($('.shortWizardTrain', wizardLayout.$el)).render();
            wizardPageTitleView.setElement($('.shortWizardPageTitle', wizardLayout.$el)).render();
            buttonView.setElement($('.shortWizardButtonBar', wizardLayout.$el)).render();

            vent.trigger("step:first", hasIntroPage());
            vent.trigger("step:try_selected", 0);
            $container.append(wizardLayout.el);
            var tooltipBuilder = new TooltipBuilder(wizardLayout.$el.find('.ua-field-help'), conf);
            tooltipBuilder.addHeaderTooltip();
            return this;
        };

        /**
         *  Perform the selection of a given step
         *  @param {Integer} step - the relative index of the step
         *  to be selected.
         */
        function doStep(step, skipBeforePageChange) {
            if (step == currentStep || step < 0 || step > pages.length - 1) {
                return;
            }
            
            if (currentStep != -1 && !skipBeforePageChange) {
                if (!pages[currentStep].beforePageChange(currentStep, step)) {
                    vent.trigger("step:changeBlocked", currentStep);
                    return;
                }
            }

            vent.trigger("step:selected", step);

            if (isLastStep(step)) {
                vent.trigger("step:last", hasSummaryPage());
            }
            else if (isFirstStep(step)) {
                vent.trigger("step:first", hasIntroPage());
            }
            else if (isSummaryStep(step)) {
                vent.trigger("step:summary");
            }
            else if (isCommitStatusStep(step)) {
                vent.trigger("step:commitStatus");
            }
            else {
                vent.trigger("step:other");
            }
            renderPage(step);
            currentStep = step;
        }

        /**
         *  Set up event handlers for coordinating updates with
         *  the various wizard sub-views.
         */
        function bindEvents() {
            vent.bind("step:try_selected", function(step, skipBeforePageChange) {
               doStep(step, skipBeforePageChange);
            });

            vent.bind("step:try_next", function(skipBeforePageChange) {
                if (isLastStep(currentStep)) {
                    return;
                }
                var step = currentStep + 1;
                vent.trigger("step:try_selected", step, skipBeforePageChange);
            });

            vent.bind("step:try_previous", function() {
                if (isFirstStep(currentStep)) {
                    return;
                }
                var step = currentStep - 1;
                vent.trigger("step:try_selected", step);
            });

            vent.bind("step:try_finish", function() {
                var step = pages.length - 2;
                vent.trigger("step:try_selected", step);
            });

            vent.bind("wizard:close", function() {
                onDone();
            });

            vent.bind("wizard:restart", function() {
                var step = (hasIntroPage()) ? 1 : 0;
                vent.trigger("step:try_selected", step);
            });

            vent.bind("wizard:commit", function() {
                var step = currentStep + 1;
                vent.trigger("step:try_selected", step);
                vent.trigger("committing:changes");
                conf.save({
                    success: function(message, relatedLinks) {
                        vent.trigger("committing:changes:success", message, relatedLinks);
                    },
                    /**
                     * errors can be an error string, or an array of error strings
                     */
                    error: function(errors) {
                        errors = (Array.isArray(errors)) ? errors : [ errors ];
                        errors = errors.map(function(message) {
                            return { response: message };
                        });

                        vent.trigger("committing:changes:error", errors);
                    }
                });
            });

            vent.bind("wizard:cancel", function() {
              var conf = {
                title: 'Exit Now?',
                question: 'Do you want to exit without making any changes?',
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered'
              };              
              var confirmationDialog =  new ConfirmationDialog(conf);
              confirmationDialog.build();
              confirmationDialog.vent.on('yesEventTriggered', function() {
                    confirmationDialog.destroy();
                    that.destroy();
                    if(onCancel){
                        onCancel();
                    } 
              });
              confirmationDialog.vent.on('noEventTriggered', function() {
                  confirmationDialog.destroy();
              });
            });
        }

        /**
         * Unbind all bound events
         */
        function unbindEvents() {
            vent.unbind();
        }

        /**
         * Check if a wizard step is the last defined step
         *
         * @returns {boolean} - true if the step is the last step, false otherwise.
         */
        function isLastStep(step) {
            if (hasSummaryPage()) {
                return step == pages.length - 3;
            } 

            return step == pages.length - 2;
        }

        /**
         * Check if a wizard step is the summary step
         *
         * @returns {boolean} - true if the step is the summary step, false otherwise.
         */
        function isSummaryStep(step) {
            return hasSummaryPage() && (step == pages.length - 2);
        }

        /**
         * Check if a wizard was built with an intro page
         *
         * @returns {boolean} - true if the first page is an intro page, false otherwise.
         */
        function hasIntroPage() {
            return pages[0].isIntro();
        }

        /**
         * Check if the wizard includes a summary page
         *
         * @returns {boolean} - true if the wizard contains a summary page
         */
        function hasSummaryPage() {
            return conf.showSummary !== false;
        }

        /**
         * Check if a wizard step is the first
         *
         * @returns {boolean} - true if the step is the first step, false otherwise.
         */
        function isFirstStep(step) {
            return step == 0;
        }

        function isCommitStatusStep(step) {
            return step == pages.length - 1;
        }

        /**
         *  Render a wizard page
         *
         *  @param {Integer} pageIndex - The 0-based index of the page to be rendered.
         */
        function renderPage(pageIndex) {
            var page = pages[pageIndex];
            var shortWizardContainer = wizardLayout.$el.find('.shortWizardContainer');

            page.getView().delegateEvents();
            wizardLayout.pageRegion.show(page);
            wizardPageTitleModel.set("title", page.getPageTitle());  // CHANGME: page.title
            

            // Adjust spacing for pages without the train
            if (isSummaryStep(pageIndex) || page.isIntro()) {
                shortWizardContainer.addClass('shortWizardNoTrain');
            } else {
                shortWizardContainer.removeClass('shortWizardNoTrain');
            }

            // Set focus on the first editable input element   
            var focusElem = shortWizardContainer.find("input[type='text']:not([disabled])")[0];
            if (focusElem) {
              focusElem.focus();          
            }
        }
    };

    return ShortWizard;
});
