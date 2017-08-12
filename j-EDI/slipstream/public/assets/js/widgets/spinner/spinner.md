# Spinner Widget


## Introduction
The spinner widget is a reusable graphical interface that allows users to show the spinner while loading a page or file. 

## API
The spinner widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor.


###Configuration
The configuration object has two variables:

```
{
    container: <define the container where the widget will be rendered>,
    hasPercentRate: <define if the spinner has to show the percentage progress, then the value is true. Default: false.(optional)>
    statusText: <define the status text. If not defined, there is default label in widget.>
}
```

For example:

```
{
    var spinner = new SpinnerWidget({
                    "container": this.el,
                    "hasPercentRate": true,
                    "statusText": 'Current stage of operation...'
                });
}
```

###Build
Adds the dom elements and events of the spinner in the specified container. For example:

```
{
    spinner.build();
}
```

###Destroy
Clean up the specified container from the resources created by the spinner widget.

```
{
    spinner.destroy();
}
```

## Usage
To add a spinner in a container, follow these steps:
1. Instantiate the spinner widget and provide the container where the spinner will be rendered and the hasPercentRate value. If the spinner contains percentage rate, the value of hasPercentRate should be true. Otherwise, the default is false. 
2. Call the build method of the spinner widget

Optionally, the destroy method can be called to clean up resources created by the spinner widget.

```
{
    var spinner = new spinner({
                                "container": this.el,
                                "hasPercentRate": true,
                                "statusText": 'Current stage of operation...'
                            }).build();
}
```

## Methods

### setSpinnerProgress
Sets progress instantly without animation. For example:
@param Number: how much percent the progress bar should display.
Note: Only apply while you use the percentage spinner.

```
   spinner.setSpinnerProgress(1.0); // range from 0.0-1.0
```

### hideTimeRemaining
Hides time remaining. For example:
Note: Only apply while you use the percentage spinner.

```
   spinner.hideTimeRemaining(); 
```

### setTimeRemaining
Sets time remaining. For example:
@param Millionseconds: how long the file will be loaded completely.
Note: Only apply while you use the percentage spinner.

```
   spinner.setTimeRemaining(millionseconds); 
```

### setStatusText
Sets spinner status text. For example:
@param String: the text

```
   spinner.setStatusText("Complete"); 
```

