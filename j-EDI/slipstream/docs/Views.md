#  Slipstream Views

Views are objects that represent some portion of a workflow's user interface.  

## Description
Slipstream views are convention rather than definition.   Any object that has the following attributes is considered a view by Slipstream:

  - **el**
A DOM node that is the root of the DOM tree containing the nodes representing the view.

  - **render**
A no-argument function that will render the DOM nodes of the view to the DOM tree rooted at *el*.

  - **close**
A no-argument function that is called when the framework closes the view.  Alternatively this function can be named *remove*. 

  If a function with the name *close* is defined it will be called.  Otherwise, if a function with the name *remove* is defined it will be called.

  A view is closed when a new view is rendered into the content pane.


```javascript
function MyView() {
   this.el = document.createElement("div");
   
   this.render = function() {
      var text = document.createTextNode("Hello World!");
      this.el.appendChild(text);
   }
   
   this.close = function() {
      // optional cleanup here
   }
}
```
Optionally, a view object can define any or all of the following functions:

  - **beforeRender**
If defined, this function is called by the framework before the *render* method is called.

  - **afterRender**
If defined, this function is called by the framework after the *render* method is called.

  - **beforeClose/beforeRemove**
If defined, this function is called by the framework before the *close*/*remove* method is called.

  - **afterClose/afterRemove**
if defined, this function is called by the framework after the *close*/*remove* method is called.

## Rendering Views 
A view is rendered to Slipstream's content pane by calling the [setContentView()]() method of an [Activity](Activity.md).

activity.js:

```javascript
...
var view = new MyView();

// Render the view to the content pane
this.setContentView(view);
...
```
