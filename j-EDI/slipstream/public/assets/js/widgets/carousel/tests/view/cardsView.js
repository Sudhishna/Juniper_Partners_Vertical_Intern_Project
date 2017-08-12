/**
 * A set of views generated from templates and configuration object
 *
 * @module cardsView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'text!widgets/carousel/tests/templates/cardType1.html',
    'text!widgets/carousel/tests/templates/cardType2.html',
    //'widgets/tooltip/tooltipWidget'
], function(Backbone, cardsConfiguration, render_template, cardType1, cardType2, TooltipWidget){

    var CardsView = {};

    var addContent = function($container, template) {
        $container.append((render_template(template)));
        new TooltipWidget({
            "container": $container
        }).build();
    } ;

    CardsView.view1 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType1); //adds the html file
            new TooltipWidget({ //adds the widget iside the html, look in widgets main.js file for instantiationdwd

            })
            return this;
        }
    });

    CardsView.view2 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType1);
            return this;
        }
    });

    CardsView.view3 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType2);
            return this;
        }
    });

    CardsView.view4 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType2);
            return this;
        }
    });

    CardsView.view5 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType1,cardsConfiguration.card2);
            return this;
        }
    });

    CardsView.view6 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType2,cardsConfiguration.card3);
            return this;
        }
    });

    CardsView.view7 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType2,cardsConfiguration.card4);
            return this;
        }
    });

    CardsView.view8 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType1,cardsConfiguration.card1);
            return this;
        }
    });

    CardsView.view9 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType1,cardsConfiguration.card5);
            return this;
        }
    });

    CardsView.view10 = Backbone.View.extend({
        render: function () {
            addContent(this.$el, cardType1,cardsConfiguration.card6);
            return this;
        }
    });

    return CardsView;
});
