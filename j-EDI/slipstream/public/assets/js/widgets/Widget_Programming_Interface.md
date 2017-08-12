# Widget's Programming Interface

## Introduction
A Slipstream widget is a section of a user interface that can be reused across the framework. It can be part of a plugin or it can be called by other widgets.
This document describes the general guidelines for defining and using widget programmatic interfaces.


## Widgets

### File system structure
Each widget is located in a folder inside *public/assets/js/widgets* folder and follows the following file system structure:

```
   <widget_directory_name>/
      widgetMainFile.js
      widget_name.md
        conf/
          … all configuration files …
        models/
          … all model/collections files …
        views/
          … all view files …
        templates/
          … all HTML templates …
        tests/
           … all test files/directories …
```

### Programming interface
A widget should expose a configuration object with all inputs required to render the widget.
The configuration object should include a reference to the container from where the widget will be rendered.
For example, when a plugin or another widget needs to render a widget (for example: *WidgetName* widget), the widget will be used in the following way:

```javascript
var conf = {
        container: domElement //dom element where we will render the widget ($container.append(content))
        ... other configuration parameters
    }
var newWidget = new WidgetName(conf);
newWidget.build();
```

All widgets might include:
- **container** attribute: references a container where the widget will be rendered (optional attribute)
- **build** method: renders the content of the widget in the defined container (*container*) and returns "this". (required method)
- **destroy** method: removes views from DOM and unbinds event bindings and returns "this".(required method).

The following attribute could be included as part of the configuration object:
- **view** attribute: contains the view to be rendered. View definition is TBD.

### Namespace
TBD

### Styles and Images
The location of the style/css of a widget should be the *public/assets/css/widgets* folder and named widget_name.scss.
To avoid collisions with other styles defined in the framework, a name space should be added for any style defined in widget_name.scss

```
.widget_name{
    ...styles for widget_name
}
```

To include widget_name.scss in the framework, import it at *public/assets/css/app.scss* with:

```
@import "widgets/widget_name";
```

Images/assets for a widget can be added at *public/assets/images*.


### Testing and documentation
A description about the usage of the widget and other related documentation should be included under <widget_name>.md file
All widgets should include one or more files that exercise the widget's functionality and should be located at the tests directory.


### Guidelines
1. Do not include dependencies to other libraries for the exposed interface (*WidgetName*)
2. Do not include html in the views, create templates instead and add it to the *templates* folder of the widget.
3. Do not include reference to id or classes that are located outside of the widget you are defining.
4. Avoid using id internally in your widget, if you need to use it, follow an id name convention; example: nameOfWidget_id. html5 data attribute would be other option.
5. Avoid using inline style, use instead a class and have it included in the style file (*widget_name.scss*).

