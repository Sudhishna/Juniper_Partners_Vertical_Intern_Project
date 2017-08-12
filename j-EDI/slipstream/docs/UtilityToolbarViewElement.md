# ViewToolbarElement

The ViewToolbarElement is a plugin's interface to the Slipstream [Utility Toolbar](UtilityToolbar.md) for view-based elements.  A reference to a ViewToolbarElement is made available through the *context* object associated with the element's *activity*.


## Methods

- #### SDK.ViewToolbarElement.prototype.setEnabled(state)
Set the enabled state of the utility toolbar element.

   #### Parameters

   - **state**
      
      A boolean value indicating the enabled state of the view element.  If *true* the element will be enabled.  If *false* it will be disabled.
        
- #### SDK.ViewToolbarElement.prototype.setView(view)
Set the view to be used to render the toolbar element.

   #### Parameters
  
   - **view**
      
      A [view](View.md) to be used for rendering the toolbar element.

        
## Example

```javascript
define(function() {
    var ToolbarActivity = function() {
        this.onStart = function() {
        
           // Set the view for rendering the toolbar element
           var View = Backbone.View.extend({
                render: function() {...}
           });

           this.context.toolbarElement.setView(new View());   
        }
    };
    
    ToolbarActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    ToolbarActivity.prototype.constructor = ToolbarActivity;
    
    return ToolbarActivity;
});
```
