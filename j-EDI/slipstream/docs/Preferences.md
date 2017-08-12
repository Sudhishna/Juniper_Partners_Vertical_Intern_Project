# User Preferences

Slipstream provides a *preferences* API that activities can use to read and write UI-related user preferences. For example, an activity could use this API to store the preferred sort order or visible subset of columns for a grid instance.

The API is very generic and provides a lot of flexibility in the format of the stored preference data.  The only requirement is that the object to be stored be serializable to JSON format and defines a unique object *namespace*.

## Methods

### SDK.Preferences.save(path, value)
Save a preference.

#### Parameters

**path**
The path to the preferences setting within the preferences store.  It takes the form:

*pathFrag_1:pathFrag_2:...pathFrag_n*

Where pathFrag~n~ is the n-th fragment of the preference's path in the preferences object.  

For example the path
      
*ui:nav:left:width*

represents the path to the attribute in the preferences store representing the width of the UI's left navigation pane.  The  preference will be stored at
         
*ui.nav.left.width*
        
in the user preferences store.

**val**
The new value for the preference.

#### SDK.Preferences.fetch(path)
Fetch a preference.

#### Parameters
  
**path**
The path to the preferences setting within the preferences store.  It takes the form:

*pathFrag_1:pathFrag_2:...pathFrag_n*

Where pathFrag~n~ is the n-th fragment of the preference's path in the preferences store.  
        
## Examples

Save a preference:

```javascript
// Set the sort order for the firewall policies grid to ascending.
var path = "firewall_policies:policies_grid:sort_order";
Slipstream.SDK.Preferences.save(path, "asc");
```

Fetch a preference:

```javascript
var path = "firewall_policies:policies_grid:sort_order";
var sort_order = Slipstream.SDK.Preferences.fetch(path);

console.log("sort order for firewall policies table is", sort_order);
```

Save and fetch the grid widget using the Preference API - Grid Widget:

```javascript
// inside a slipstream view
initialize: function () {
    this.mockApiResponse();
    var self = this;
    this.context = this.options.context;

    var id = 'someUniqueIdForThisGrid';
    var preferencesPath = self.context['ctx_name'] + ':' + id;

    var doWriteToPreferencesAPI = function(updatedConf) {
        Slipstream.SDK.Preferences.save(preferencesPath, updatedConf);
    };

    var updatedConfig = null;
    updatedConfig = Slipstream.SDK.Preferences.fetch(preferencesPath);
    if (updatedConfig) {
        SampleConfigurationElements.simpleGridElements = updatedConfig.elements;
        SampleConfigurationElements.simpleGridSearch = updatedConfig.search;
    }
    this.grid = new GridWidget({
        container: self.el,
        elements: SampleConfigurationElements.simpleGridElements,
        search: SampleConfigurationElements.simpleGridSearch,
        onConfigUpdate: doWriteToPreferencesAPI
    });
    return this;
},
```

See : test/resources/gridPrefsSamplePlugin.spi for full plugin reference implementation.