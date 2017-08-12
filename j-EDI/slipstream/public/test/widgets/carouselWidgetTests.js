define([
    'widgets/carousel/carouselWidget',
    'widgets/carousel/tests/view/cardsView'
], function(CarouselWidget, CardsView){

		describe('CarouselWidget - Unit tests:', function() {

            var $el = $('#test_widget'),
                containerId = 0,
                cards = [{
                    id:"card1",
                    content: new CardsView.view1()
                },{
                    id:"card2",
                    content: new CardsView.view3()
                }];

            var createContainer = function () {
                var $container = $("<div id = carousel-container-id" + containerId++ + "></div>");
                $el.append($container);
                return $container;
            };

            describe('Widget Interface', function() {
                before(function(){
                    this.$carouselContainer = createContainer();
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": cards,
                        "height": "100px"
                    }).build();
                });
                after(function(){
                    this.carouselWidgetObj.destroy();
                });
                it('should exist', function() {
                    this.carouselWidgetObj.should.exist;
                });
                it('build() should exist', function() {
                    assert.isFunction(this.carouselWidgetObj.build, 'The carousel widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.carouselWidgetObj.destroy, 'The carousel widget must have a function named destroy.');
                });
            });

            describe('Template', function() {
                before(function(){
                    this.$carouselContainer = createContainer();
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": cards,
                        "height": "100px"
                    }).build();
                });
                after(function(){
                   this. carouselWidgetObj.destroy();
                });
                it('should contain the carousel-widget class for carousel container', function() {
                    this.$carouselContainer.hasClass('carousel-widget').should.be.true;
                });
                it('should contain the slick-initialized class after the the slick library is used to build the carousel widget', function() {
                    this.$carouselContainer.hasClass('slick-initialized').should.be.true;
                });
                it('should contain a carousel with slides', function() {
                    assert.equal(this.$carouselContainer.find('.carousel-item').length, cards.length, "the carousel has been created and the containers with carousel-item class have been added");
                });
            });

        });
	});
