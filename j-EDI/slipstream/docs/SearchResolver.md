#  Slipstream.SDK.SearchResolver

Defines the interface between a search client and a [search provider](SearchProvider.md).

The *Slipstream.SDK.SearchResolver* function is the constructor for SearchResolver objects.

## Syntax

```javascript
    new Slipstream.SDK.SearchResolver()
```

## SearchResolver Instances
All SearchProvider instances inherit from SearchResolver.prototype.

### Properties

### Methods

- #### SDK.SearchResolver.prototype.query
Execute a search query

    #### Parameters

    - **query**
      
      The query string to be executed

    - **options**
      
      An options hash to control query execution.  The options hash can contain the following keys:

        **success** - A callback to be called if execution of the query is successful.  This callback takes a single argument that is an object containing the query results.

        **error** - A callback to be called if execution of the query is unsuccessful. This callback takes a single argument that is an object containing the error response.

    - **page** - An object with the following attributes:

        - **index**: An integer value >= 1 representing the index into the set of results pages to be returned for the query.  Default is 1.

        - **size** - The size of result pages (in number of results) to be returned.  Default is 10.

  
## Example
  
```javascript

   var resolver = new Slipstream.SDK.SearchResolver();
   var query = "firewall policy";

   resolver.query(query, {
       success: function(results) {
           ...
       },       
       fail: function(error) {
          ...
       },
       page: {
           index: 1,
           size: 10
       }
   });
  ```
