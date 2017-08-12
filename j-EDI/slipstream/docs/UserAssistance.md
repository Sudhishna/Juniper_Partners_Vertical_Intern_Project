# Slipstream External User Assistance


## About


The Slipstream framework has a User Assistance extension point that all plugin applications can use to make contributions to Slipstream User Assistance system.  The purpose of this document is to **(1)** explain how the User Assistance framework works and **(2)** explain how plugin applications can contribute their own help content to the User Assistance system for a seamless integrated end user experience.


#### For reference purposes


*  Help and user assistance can be used interchangeably.  The rest of this document will (attempt to be) consistent with terminology and refer to user assistance as help.

*  Directories will be in bold type while files will have a normal type face.

*  Vocabulary:  There is specific vocabulary that is used in the context of help.  These specific terms will be defined in the **Glossary** section.


## Contributing To User Assistance

### Plugins and the Programming Model
End user products that are built on top of Slipstream are meant to be composed of plugins (units of functionality or features).  These plugins that compose a product can be and should be written in a vacuum - meaning that one plugin has no knowledge or makes no assumption on the existence of other plugins.  Each plugin can be and should be its own independent ecosystem.  That being said it comes natural that each plugin should contain its own set of help content.

Just as all plugins that want to contribute themselves to the Slipframework must have a plugin manifest file, all plugins that want to contribute help content to the Slipstream help system must be have a help directory.  Within this help directory will live all of the help content.



#### Plugin directory structure


 *  **your_plugin_directory**  
  *  plugin.json     
    *  **nls**            
    *  **help**            

Plugins can be glued together (using the various Slipstream framework facilities) to create a seamless workflow or set of workflows.  

Moreover, the help system facilitates the composition and gluing together of these disparate help content (contributed by a varying set of plugins) into a single web help system.  

Specifically, when a plugin is installed - using the plugin_manager.sh script, the plugin's help content is extracted out of its own context and then merged with the Slipstream help system.  This involved parsing out the Alias keys, ToC content, etc and merging them into their respective counterparts in Slipstream.  Then the corresponding resource files in the plugin's help system are copied from the plugin's help directory and placed in slipstream's help directory.


#### Slipstream directory framework structure


  *  **slipstream_root_directory**
      *  **node_modules**
        *  **lib**
        *  **public**
          *  **installed_plugins**
          *  **help**



#### Madcap Flare


Help content will be authored using Madcap Flare.  This output will be provide by or acquired from an information experience expert in the format of WebHelp.  The output should be copied to the directory under help that describes the locale in which the content is formatted.  For example, help content that has been authored in English should be copied under **en**.

#### Internal directory structure of help directories

  *  **help**
    *  **en**
      *  **Content**
      *  **Data**
      *  index_CSH.html
      *  index.html
      *  index.js
      *  **Skin**
    *  **fr**
    *  **ja**
    *  **...**



#### Example


The purpose of this example is to take all the concepts thus far and provide a concrete use case that includes a complete lifecycle of using the help system (from the perspective of a plugin application developer).  We will start with a very basic plugin that has no help content.  From there we will go through the process of adding and linking help content, packaging the plugin, installing the plugin on a running instance of Slipstream, using the plugin feature, localization, and finally, uninstalling a plugin.

###### Adding and Linking Help content

Step 1:  Get the WebHelp output from Madcap Flare.  
A sample help output can be found here:
```bash
slipstream/test/resources/helpSample.spi
```

Unzip the spi file using any archiving tool.  The file extension is '.spi', however, the compression type is a zip.

Step 2:  At this point you should have an unarched folder named 'helpSample'.  From here, open the file:

```bash
helpSample/js/conf/helpSampleFormConfiguration.js
```

After line 12, declare this statement:

```
"ua-help" : "ua_sample_overview"
```

After line 20 (assuming you did the previous step - otherwise after line 19), declare this statement:
```
"ua-help" : "ua_page_enable"
```

Congratulations, you have now linked Help content.  Yes it is that simple.

What did you just do?  On the form widget, you declare various form input elements, as seen in the configuration file (helpSampleFormConfiguration.js).  For any input element that you declare on your form, you have the option to associate some help content with that form element.  In this case we have the form itself and a checkbox field on the form.  For the form, we have associated a help **alias** (See glossary for definition) with the form and form checkbox element - respectively as 'ua_sample_overview' and 'ua_page_enable'.  These aliases are binded with some help content.

One question arises - where do the aliases come from?  The answer to this question is:  they come from help content provider.  In our case, we look in:

```
helpSample/help/en/Data/Alias.xml
```

If you open this file, you will see these statements on lines 3 and 4:

```xml
    <Map Name="ua_page_enable" Link="helpSystem/ua_page_enable.htm" ResolvedId="1001" />
    <Map Name="ua_sample_overview" Link="helpSystem/ua_sample_overview.htm" ResolvedId="1000" />
```

Notice the 'Name' values are the Alias strings we entered above.  Notice, also, that each Alias is associated with an htm file which happens to be the value of the 'Link' attribute.

###### Packaging the Plugin

Step 1: Archive the plugin directory using the zip format.  
Step 2: Change the extension of the zip file from helpSample.zip to helpSample.spi

###### Installing the Plugin

Step 0: stop the slipstream server if it is running.  
Step 1: cd to the slipstream root directory.  
Step 2: at the slipstream root directory: 


```bash
scripts/plugin_manager.sh -i path/to/spi_filename_without_the_dot_spi_extension
```

Note that you should exclude the .spi file extension on the -i parameter.

In our case it would look like:

```bash
scripts/plugin_manager.sh -i test/resources/helpSample
```

###### Using the Plugin

Step 1: Launch the Slipstream server - in the 'slipstream' directory:

```bash
npm start
```

Step 2:  Open your browser to the Slipstream app - ie (http://localhost:3000)

Step 3:  Navigate to :  Other -> User Assistance External Help

Step 4:  Hover and click on either of the Question mark icons.  You should see the external help system open in a separate browser window.  Notice that click on each of the Question mark icons will launch a context sensitive help page.


###### Localization

Step 1:  In progress -- coming soon.

###### Uninstalling the Plugin

Step 1:  Stop the Slipstream server - in the 'slipstream' directory press Ctrl+C

Step 2:
```bash
scriopts/plugin_manager.sh -u helpSample
```


## Glossary

**Alias**:  A String value that behaves as a key.  This key is used to create an association with some Help content.

**ToC**:  Acronym - Table of Contents