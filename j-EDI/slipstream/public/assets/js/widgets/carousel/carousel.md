# Carousel Widget


## Introduction
The Carousel widget is a reusable graphical user interface that allows users to show multiple views in a carousel format. Each view represents a slide in the carousel.

## API
The Carousel widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any data required by the widget is passed by its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <DOM object that defines where the widget will be rendered>
    items: <Array of objects that defines the content that will be rendered (slide of the carousel). It should have the id and content parameters. id represents the id of the slide and it's represented by a string primitive data type. The id should be unique in the page. The content parameter represents the content of the slide and is represented by a Slipstream view object data type.>
    height: <String, optional. Defines a unique height for each slide. It could be represented as a string composed by the number of units and the type of unit (for example: 540px) or it could be represented by a number data type in which case, the height is assumed in pixels. If it is absent, the height of the slides will be 100px.>
    numberOfSlides: <Number, optional. Defines the number of slides that will be showed by default when the carousel is rendered while there is enough width in the container to show all the slides.>
    responsive: <Object that defines the values required to make the carousel responsive. It allows to define the breakpoints that needs to be reached so the carousel starts showing less or more items. It has two parameters: breakpoint and settings. breakpoint is the maximum number of pixels that the container could have to keep its property settings. settings is an Object composed by the slidesToShow and slidesToScroll properties. Each of them represents the slides to show.>
}
```

For example, a carousel widget could be instantiated with the following configuration:

```
    var carouselWidget = new CarouselWidget({
                                     "container":  this.$el,
                                     "items": itemsArray
                                 });
```

where the itemsArray variable for the items parameter is an array of objects. For example:

```
 var itemsArray = [{
            id:"card1",
            content: new CardView1()
        },{
            id:"card2",
            content: new CardView2()
        },{
            id:"card3",
            content: new CardView3()
        }];
```

### container
The container parameter represents the DOM element that will contain the carousel widget.

### items
The items parameter represents the parameters required to define a slide in the carousel. It should be an array with objects that have the following parameters:
- id: id of the slide and represented by a string primitive data type. The id should be unique in the page.
- content: content of the slide and represented by a Slipstream view [Slipstream view](docs/Views.md) object data type.

### height
Defines a unique height for each slide. It could be represented as a string composed by the number of units and the type of unit (for example: 540px) or it could be represented by a number data type in which case, the height is assumed in pixels. If it is absent, the height of the slides will be 100px.

### numberOfSlides
Optional parameter that defaults to 4. Defines the number of slides that will be showed by default when the carousel is rendered while there is enough width in the container to show all the slides.

### responsive
Optional parameter that defaults to a set of breakpoints that keep slides width in a range of 280px and 450px. It defines the values required to make the carousel responsive. It allows to define the breakpoints that needs to be reached so the carousel starts showing less or more items. It has the following parameters:
- breakpoint: maximum number of pixels that the container could have to use the settings defined in the settings property of this Object. When the browser is resized, the size of the container changes, and the carousel widget will listen for this change and compare the available width versus the breakpoint(number of pixels) defined in this property.
- settings: Object composed by the slidesToShow and slidesToScroll properties. Each of them represents the slides to show. For example:

```javascript
    new CarouselWidget({
         "container":  this.$el,
         "items": itemsArray,
         "height": "100px",
         "responsive": [{
               breakpoint: 1230,
               settings: {
                   slidesToShow: 3,
                   slidesToScroll: 3
               }
           },{
               breakpoint: 900,
               settings: {
                   slidesToShow: 2,
                   slidesToScroll: 2
               }
           },{
               breakpoint: 680,
               settings: {
                   slidesToShow: 1,
                   slidesToScroll: 1
               }
           }];
     }).build();
```

## build
Adds the dom elements and events of the Carousel widget in the specified container. For example:

```
    carouselWidget.build();
```

## destroy
Clean up the specified container from the resources created by the Carousel widget.

```
    carouselWidget.destroy();
```