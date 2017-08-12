/**
 * A module that builds a carousel widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the configuration required by the third party library: jQuery Slick.
 *
 * @module CarouselWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'slick'
],  /** @lends CarouselWidget*/
    function(slick) {

    var CarouselWidget= function(conf){
        /**
         * CarouselWidget constructor
         *
         * @constructor
         * @class CarouselWidget- Builds a carousel widget from a configuration object.
         * @param {Object} conf - It requires the container and the items parameters. The rest of the parameters are optional.
         * container: define the container where the widget will be rendered
         * items: define the content that will be rendered (slide of the carousel). It should be an array with objects that have the following parameters:
         * - id: id of the slide and represented by a string primitive data type. The id should be unique in the page.
         * - content: content of the slide and represented by a Slipstream view object data type.
         * height <optional>: defines a unique height for each slide. It could be represented as a string composed by the number of units and the type of unit (for example: 540px) or it could be represented by a number data type in which case, the height is assumed in pixels. If it is absent, the height of the slides will be 100px.
         * numberOfSlides <optional>: defines the number of slides that will be showed by default when the carousel is rendered while there is enough width in the container to show all the slides.
         * responsive <optional>: Defines the values required by the Slick library to make the carousel responsive. It allows to define the breakpoints that needs to be reached so the carousel starts showing less or more items
         * - breakpoint: maximum number of pixels that the container could have to keep its property settings
         * - settings: Object composed by the slidesToShow and slidesToScroll properties. Each of them represents the slides to show.
         * @returns {Object} Current CarouselWidget's object: this
         */

        var $container = $(conf.container),
            carouselBuilt = false,
            errorMessages = {
                'noConf': 'The configuration object for the carousel widget is missing',
                'noItems': 'The configuration for the carousel widget must include the items parameter',
                'insufficientItems': 'The configuration for the carousel widget must contain at least 2 items',
                'noBuilt': 'The carousel widget was not built'
            };

        /**
         * Defines the number of slides that will be showed the first time the carousel is rendered
         * @param {int} numberOfItems - Number of items that the carousel has to render
         * @inner
         */
        var getNumberOfSlides = function (numberOfItems) {
            if (conf.numberOfSlides)
                return conf.numberOfSlides
            return (numberOfItems > 4)? 4 : numberOfItems
        };

        /**
         * Appends to the carousel container the items (views) defined in the carousel widget configuration
         * @inner
         */
        var appendViews = function () {
            //appends views in the carousel container
            var $carouselItem;
            conf.items.forEach(function(item) {
                $carouselItem = $("<div class='carousel-item'>");
                $container.append($carouselItem.append(item.content.render().el));
            });
        };

        /**
         * Defines the responsive parameter required by the Slick library by defining the breakpoints where the carousel has to show less or more items
         * @param {int} numberOfItems - Number of items that the carousel has to render
         * @inner
         */
        var getResponsiveParameter = function (numberOfItems) {
            if (conf.responsive)
                return conf.responsive;

            $container.addClass('max-width-items');
            var minWidth = 410,
                responsiveParameter = [{
                    breakpoint: 1230,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },{
                    breakpoint: 930,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },{
                    breakpoint: 700,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }];
            for (var i=4; i<numberOfItems; i++){
                responsiveParameter.push({
                    breakpoint: minWidth*i,
                    settings: {
                        slidesToShow: i,
                        slidesToScroll: i
                    }
                });
            }
            return responsiveParameter;
        };

        /**
         * Builds the Carousel widget in the specified container
         * @returns {Object} "this" of the Carousel widget
         */
        this.build =  function () {
            if (conf && conf.items && conf.items.length > 1 ) {
                appendViews();
                $container
                        .addClass('carousel-widget')
                        .find('.carousel-item').height(conf.height || '100px'); //slide default height is 100px
                var numberOfItems =conf.items.length,
                    numberOfSlides = getNumberOfSlides(numberOfItems);
                $container.slick({
                    dots: false,
                    infinite: false,
                    speed: 300,
                    slidesToShow: numberOfSlides,
                    slidesToScroll: numberOfSlides,
                    responsive: getResponsiveParameter(numberOfItems)
                });
                carouselBuilt = true;
                return this;
            }  else {
                if (!_.isObject(conf))
                    throw new Error(errorMessages.noConf);
                else if (!_.isArray(conf.items))
                    throw new Error(errorMessages.noItems);
                else if (conf.items.length < 2)
                    throw new Error(errorMessages.insufficientItems);
                else //generic error
                    throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Destroys all elements created by the Carousel widget in the specified container
         * @returns {Object} Current Carousel object
         */
        this.destroy =  function () {
            if (carouselBuilt) {
                $container
                    .slick('unslick')
                    .removeClass('carousel-widget max-width-items')
                    .find('.carousel-item').remove();
                return this;
            }  else {
                throw new Error(errorMessages.noBuilt);
            }
        };

    };

    return CarouselWidget;
});