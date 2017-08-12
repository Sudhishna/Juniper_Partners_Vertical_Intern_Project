# Progress Bar Widget


## Introduction
The progress bar widget is a reusable graphical interface that allows users to show the progress bar while loading a page or file. 

## API
The progress bar widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor.


###Configuration
The configuration object has three variables:

```
{
	container: <define the container where the widget will be rendered>,
	hasPercentRate: <define if the progress bar has to show the percentage progress, then the value is true. Default: false.(optional)>
  statusText: <define the status text. If not defined, there is default label in widget.>
}
```

For example:

```
{
    var progressBar = new ProgressBarWidget({
                    "container": this.el,
                    "hasPercentRate": true,
                    "statusText": 'Loading'
                });
}
```

###Build
Adds the dom elements and events of the progress bar in the specified container. For example:

```
{
    progressBar.build();
}
```

###Destroy
Clean up the specified container from the resources created by the progress bar widget.

```
{
    progressBar.destroy();
}
```

## Usage
To add a progress bar in a container, follow these steps:
1. Instantiate the progress bar widget and provide the container where the progress bar will be rendered and the hasPercentRate value. If the progress bar contains percentage rate, the value of hasPercentRate should be true. Otherwise, the default is false.
2. Call the build method of the progress bar widget

Optionally, the destroy method can be called to clean up resources created by the progress bar widget.

```
{
    var progressBar = new ProgressBarWidget({
                                "container": this.el,
                                "hasPercentRate": true,
                                "statusText": 'Current stage of operation...'
                            }).build();
}
```

## Methods

### setProgressBar
Sets progress instantly without animation. For example:
@param Number: how much percent the progress bar should display.
Note: Only apply while you use the percentage progress bar.

```
   progressBar.setProgressBar(1.0); // range from 0.0-1.0
```

### hideTimeRemaining
Hides time remaining. For example:
Note: Only apply while you use the percentage progress bar.

```
   progressBar.hideTimeRemaining(); 
```

### setTimeRemaining
Sets time remaining. For example:
@param Millionseconds: how long the file will be loaded completely.
Note: Only apply while you use the percentage progress bar.

```
   progressBar.setTimeRemaining(millionseconds); 
```

### setStatusText
Sets progress bar status text. For example:
@param String: the text

```
   progressBar.setStatusText("Complete"); 
```
