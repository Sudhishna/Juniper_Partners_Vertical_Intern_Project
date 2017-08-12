# Introduction
The Short Wizard is composed of a set of *pages* each of which represents a step in the wizard workflow.  The view added to a page object should have a render method at a minimum.  Additionally, methods to control the step title, summary page, and page change behavior can be added.

# API

### getTitle

```javascript
function getTitle()
```

Returns the title that will be used for this step of the wizard.

### getSummary

```javascript
function getSummary()
```

Returns an array of items that should be added to summary page. Each object in the array should be of the format:

```javascript
{
    label: <The label that will be displayed in the right column of the summary>,
    value: <The value that will be displayed in the left column of the summary>
}
```

### beforePageChange

```javascript
function beforePageChange(currentStep, requestedStep)
```

A callback that will execute before a page change occurs.  Returning false will prevent the change from happening.  Returning true allows the change to take place.  The currentStep and requestedStep arguments can be used to determine things such as the direction of the movement and whether or not the requested page is the summary page.


### render

```javascript
function render()
```
Called by the wizard to render the content of the step.




