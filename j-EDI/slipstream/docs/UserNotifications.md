# Notifications

Slipstream supports the creation of non-persistent, user-level notifications that can be used to communicate the status of workflow actions or asynchronous operations.

Notifications are rendered at the top of the user interface's viewport and persist for 8 seconds or until they are explicitly dismissed.

A notification can be of one of the following types:

- "info"
- "warning"
- "error"
- "success"

Notifications can contain either plan text or HTML.

## Creating Notifications
Notifications are created using a simple [API](Notification.md):

```javascript
var text = "Notification message with a <a href'=#'>link</a>";

// Create and send an 'info' notification with embedded HTML
new Slipstream.SDK.Notification()
    .setText(text)
    .setType("info")
    .notify();
```
Note that method calls can be chained so that a notification can be built in one step.




