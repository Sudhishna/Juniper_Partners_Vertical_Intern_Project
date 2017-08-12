# IconToolbarElement

The IconToolbarElement is a plugin's interface to the Slipstream [Utility Toolbar](UtilityToolbar.md) for icon-based elements.  A reference to a IconToolbarElement is made available through a toolbar activity's *context* object.


## Methods

- #### SDK.IconToolbarElement.prototype.setEnabled(state)
Set the enabled state of the utility toolbar element.

   #### Parameters

   - **state**
      
      A boolean value indicating the enabled state of the icon element.  If *true* the icon element will be enabled.  If *false* it will be disabled.

        
        
- #### SDK.IconToolbarElement.prototype.setIconBadge(badge)
Set the badge on the element's icon.  The badge can either be a numeric value or an icon.

   #### Parameters
  
   - **badge**
      
      A numeric value or a string.  If the value is a string, then it represents the relative path to the icon image to be used as the badge.  The path is relative to the "/img" directory associated with the plugin defining this utility toolbar element.  Otherwise, it is a numeric value to be used as the icon badge.


- #### SDK.IconToolbarElement.prototype.setIcon(iconPath)
Set the icon for the utility toolbar element.

   #### Parameters

   - **icon**
      The relative path to the icon image to use for this element.  The path is relative to the "/img" directory associated with the plugin defining this utility toolbar element.
        
## Example

```javascript
define(function() {
    var ToolbarActivity = function() {
        this.onStart = function() {
        
           // Set the element's icon badge to '5'
           this.context.toolbarElement.setIconBadge(5);

           // Set the element's icon to the image in 'img/someIcon.svg'
           this.context.toolbarElement.setIcon("someIcon.svg");

           // Set the element's icon badge to the image in 'img/iconBadge.svg'
           this.context.toolbarElement.setIconBadge("iconBadge.svg");

           // Disable the toolbar element
           this.context.toolbarElement.setEnabled(false);   
        }
    };
    
    ToolbarActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    ToolbarActivity.prototype.constructor = ToolbarActivity;
    
    return ToolbarActivity;
});
```
