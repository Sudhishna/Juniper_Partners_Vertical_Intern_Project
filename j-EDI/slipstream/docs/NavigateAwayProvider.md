#  NavigateAwayProvider

A Slipstream Message Provider that traps Navigate Away events.

## How to subscribe to the message provider - Start receiving navigate away events.

In your view you can implement code similar to code snippet below:

```javascript
var messageResolver =  new Slipstream.SDK.MessageResolver();
var pageIsDirty = true;      // represent the state of the view.
var subscription = messageResolver.subscribe('topics://navigateAway/','navigateAway', function(event_data){
                if(pageIsDirty) {
                    return  {
                         'message'   : 'The current firewall rules table has unsaved changes.',
                         'navAwayQuestion' :  'Are you sure you want to navigate away from this page?',
                        ' title'     :  'Caution'
                        }
                } else { 
                    return false;  // or null
                }
        });
```


Regarding the callback, it is important to note that the callback that is provided above must return a string message or false.  It should return false (or null) if the navigation request is allowed.  If the navigation request is not allowed, the return value should be an object that contains 3 attributes.

{
 'message'   : 'The current firewall rules table has unsaved changes.',
 'navAwayQuestion' :  'Are you sure you want to navigate away from this page?',
' title'     :  'Caution'
}

 The attributes will be used to compose a message to the end user that  describes why the navigation request could not be fulfilled.  For example, if a view contains a form that has transitioned into a 'dirty' state, then the function should return a string (to be consumed by the end user) that explains that the current page is 'dirty'.  The string will be sent to a confirmation dialog which will appear to the user and ask the user if s/he wants to continue with the navigation, given that the page is 'dirty'.

## How to unsubscribe to the message provider - Stop receiving navigate away events.

```javascript
if (subscription) {
    messageResolver.unsubscribe(subscription);
    subscription = null;
}
```
