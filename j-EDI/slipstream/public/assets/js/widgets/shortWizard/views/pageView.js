/*
 * new AppOverlayShortWizard({
 *      pages: {[
 *                  view: new welcomeView(),
 *                  intro: true
 *               ],
 *               [
 *                  view: new addAccountsView(),
 *                  isValid: validateForm
 *              ]
 *      }
 * });
 *
*/

define(['backbone'], function(){
    var PageView = Backbone.View.extend({

        getTrainStepTitle: function(){
            return this.options.title;
        },

        getPageTitle: function(){
            if(!this.options.view.getTitle)
                return "Untitled";
            return this.options.view.getTitle();
        },

        render: function(){
            return this.$el.append(this.options.view.render().$el);
        },

        isIntro: function(){
            return this.options.intro;
        },

        getView: function() {
            return this.options.view;
        },

        getSummary: function(){
            return this.view.getSummary();
        },

        isValid : function(){
            return this.validation();
        },

        beforePageChange: function(currentStep, step) {
            var allowChange = true;
            if (this.options.view && this.options.view.beforePageChange) {
                allowChange = this.options.view.beforePageChange(currentStep, step);
            }
            return allowChange;
        }
	});

    return PageView;
});

