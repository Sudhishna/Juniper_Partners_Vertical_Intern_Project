# Adding Help Support

Slipstream provides help support for views by

1. Allowing plugins to define the context to load the help files 
2. Providing an API to fetch the help url for given identifier 

The help file is packaged in a plugin's *help* directory.  The file provides an XML mapping where each unique help identifier is bound to a url .

```javascript
<Map Name="FIREWALL_POLICY_OVERVIEW" Link="firewall-policies/helpSystem/firewall-policy-overview.htm"/>
```

The help identifier has to be substituted into an object having the namespace and fully qualified path via the Slipstream getHelpKey API.

```javascript
var obj = getHelpKey('FIREWALL_POLICY_OVERVIEW')
```

## Help file naming
Help file name should be 

*Alias.xml*


## Accessing help files
Plugins can access their help file via the runtime [context](ActivityContext.md) attribute in an  [Activity](Activity.md) object.  The runtime context contains a function called *getHelpKey()* that can be used to retrieve help identifier with namespace. This key will then be used by Slipstream to retrieve the help url, on clicking the help icon.

##Example:

This example describes the steps to add the help support from plugin:


1. Name the mapping file as Alias.xml
2. Include the mapping file in a directory named 'help'

Use getHelpKey API to retrieve the key with namespace

For example, to open the help page for firewall policy form, identify the corresponding help identifier from given mapping file.

If the identifier is "FIREWALL_POLICY_OVERVIEW", it can be used in this way

```javascript
"title-help": {
	"content": context.getMessage("fw_policy_create"),
	"ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_OVERVIEW")
}
```



