#  Slipstream.SDK.SearchProvider

Defines the interface between a search provider and the Slipstream framework.  A SearchProvider is the interface between the Slipstream framework and a search service that accepts queries and produces query results.  Search providers typically do not render views.


The *Slipstream.SDK.SearchProvider* function is the constructor for SearchProvider objects.

## Syntax

```javascript
    new Slipstream.SDK.SearchProvider()
```

## Description

A Slipstream search provider is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a no-argument Javascript constructor that extends from *Slipstream.SDK.SearchProvider*.  The framework will use this constructor to instantiate the provider.

```javascript
define(function() {
    function SearchProvider() {
       ...
    }
     
    // Inherit from the Slipstream SearchProvider class
    SearchProvider.prototype = Object.create(Slipstream.SDK.SearchProvider.prototype);
    
    // Return the constructor as the value of this module
    return SearchProvider;
});
```

### Provider Lifecycle

A SearchProvider has a well-defined lifecycle that takes it through a series of states including *create*,  *start*, and *destroy*.

        ┌─────────────────────┐
        │   Launch Provider   │
        └─────────────────────┘
                   ↓ 
        ┌─────────────────────┐
        │      onCreate()     │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │      onStart()      │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │  Provider active    │  
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │     onDestroy()     │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │ Provider Terminated │
        └─────────────────────┘

Each state of a search provider has a corresponding lifecycle method in a SearchProvider object: *onCreate()*, *onStart()*, *onDestroy()*.

When a search provider is first created its *onCreate()* method is called.  By default this method is a no-op but providers can override it to perform any operations necessary prior to the provider being started. Once the *onCreate()* method returns, the provider's onStart() method is immediately invoked.

When a provider is either no longer needed (eg. its associated plugin is removed from the system) it may be destroyed. Before a provider is destroyed its *onDestroy()* method is called. This allows the provider an opportunity to perform any cleanup operations prior to it being destroyed.
  

**Note**: The destroy state and it's corresponding *onDestroy()* method are not currently used by Slipstream but are reserved for future use.

## SearchProvider Instances
All SearchProvider instances inherit from SearchProvider.prototype.

### Properties

### Methods

- #### SDK.SearchProvider.prototype.query
Send a query request to the provider.

  The method in the SearchProvider prototype is a no-op and should be overridden by objects implementing a SearchProvider.

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

### Declaring a SearchProvider 

A plugin must declare the search provider that it exposes via its plugin.json file.  Only a single search provider can exist in an instance of the Slipstream framework.  If multiple provider definitions exist, then Slipstream will use the last definition found during plugin discovery.

A sample plugin.json with the relevant SearchProvider settings is shown below.

plugin.json:

```json
{
   ...
   
   providers: [
      {
          "uri": "search://",
          "module": "searchProvider"
      }
   ]
   
   ...
}
```
When a plugin is loaded and the configuration includes a search provider, the module identified will be instantiated and the *onCreate()* function called to initialize the provider.
  
## Example
  
```javascript
  define(function() {
    function SearchProvider() {
        Slipstream.SDK.SearchProvider.call(this);

         this.query = function(query, options) {
             $.ajax({
                 url: "/api/search/query",
                 data: {
                   qstr: query,
                   page: options.page.index,
                   pageSize: options.page.size
                 },
                 success: function(data) {
                    var results = data;
                    options.success(results);
                 }
             });
         }
    }

   SearchProvider.prototype = Object.create(Slipstream.SDK.SearchProvider.prototype);
   SearchProvider.prototype.constructor = SearchProvider;

    return SearchProvider;
});
  ```
