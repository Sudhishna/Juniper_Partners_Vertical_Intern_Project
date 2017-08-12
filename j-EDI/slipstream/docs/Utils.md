#  Slipstream.SDK.Utils

Defines a set of utility functions for use by Slipstream plugins.


## Description

The Utils module contains a set of common utility functions that can be used by plugin developers.


### Methods

- #### Slipstream.SDK.Utils.uuid()
Generate a univerally unique identifier

    #### Parameters
    None

- #### Slipstream.SDK.Utils.url_safe_uuid()
Generate a UUID that is URL-safe.

    #### Returns
    A UUID that can be safely used in URLs. 
    
    #### Parameters
    None
  
## Example
  
```javascript
var uuid = Slipstream.SDK.Utils.uuid();
var url_safe_uuid = Slipstream.SDK.Utils.url_safe_uuid();
  ```
