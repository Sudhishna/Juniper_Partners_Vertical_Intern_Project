#  Using Slipstream UI Widgets Outside the Framework

The Slipstream UI widgets are typically used by Slipstream workflows, but the widgets can be used outside the framework as well.

## Installing the Standalone Widget Library 

Slipstream build images contain a directory called *widgetlib* in the *dist* directory.  This directory contains the Slipstream widget library.  To install the library on your web server, follow these steps:

1. Copy the *widgetlib* folder to any directory under the document root directory of your web server.
2. Copy the *widgetlib/assets* folder to the document root directory of your web server.  Your document root directory should now look like this:

  ```
  /docroot
     ...
     /widgetlib
     /assets
     ...
  ```
  

## Using the Widget Library

To use the widget library you'll need to import it into your application.  

All of the Slipstream library modules are [AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) enabled and must be loaded using [requireJS](http://requirejs.org/).  The require.js library packaged with the widget library must be included prior to inclusion of the widget library:

```javascript
<script src="/path/to/widgetlib/js/vendor/require/require.js"></script>
<script src="/path/to/widgetlib/js/slipstream.js"></script>
```
Once the library is imported, it must be initialized:

```javascript
slipstream.initialize({
    onInit: function() {
       // library initialized, start using widgets
    }
});
```
The *initialize()* method accepts an options object.  This object must contain an attribute called *onInit* that is of function type.  The *onInit* function is called by the library when initialization is complete.  It is unsafe to use the widget library until *onInit* has been called.

Once the library is initialized, the widgets can be used:

```javascript
require(['widgets/barChar/barChartWidget'], function (BarChartWidget) {
    var options = {
        title: 'Top 10 Source IP Addresses',
        xAxisTitle: 'Source IP Addresses',
        yAxisTitle: 'Count',
        categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3',
                     '192.168.1.4', '192.168.1.5', '192.168.1.6', 
                     '192.168.1.7', '192.168.1.8', '192.168.1.9', 
                     '192.168.1.10'
                    ],
        tooltip: ['hostname-1', 'hostname-2', 'hostname-3', 
                  'hostname-4', 'hostname-5', 'hostname-6', 
                  'hostname-7', 'hostname-8', 'hostname-9' ,'hostname-10'
                 ],
        data: [88, 81, 75, 73, 72, 63, 39, 32, 21, 1]                   
    };

    var conf = {
        container: '#barChartContainer',
        options: options
    }
            
    var barChart = new BarChartWidget(conf);
    barChart.build();
}
```

See [the Slipstream widget documentation](Widgets.md) for further details on the use of individual Slipstream widgets.