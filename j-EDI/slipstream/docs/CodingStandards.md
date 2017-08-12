# Slipstream Coding Standards

This document outlines a set of basic coding standards and guidelines, intended to make Slipstream framework and app code cleaner and more consistent, and improve ease of maintenance. As more parties begin to work with, and contribute to Slipstream, it will be increasingly necessary to ensure a minimum standard of code quality. All code contributed to the Slipstream repositories is expected to follow these conventions.

This document is based on [Javascript conventions described by Douglas Crockford](http://javascript.crockford.com/code.html)

### Formatting

All code, including Javascript, CSS, and HTML, should follow these basic conventions, and be consistently well formatted throughout.

#### Indentation

Code shall be indented in units of *four* spaces. Tab characters should be avoided at all times, as there is no standard for the placement of tabstops.

##### Tabs in VI
Add these values to your .vimrc file:
```
set expandtab
set sw=4
set tabstop=4
set softtabstop=4
```

##### Tabs in Sublime Text
Add these values to Sublime Text's User Settings:
```
“tab_size”: 4,
“translate_tabs_to_spaces”: true
```

##### Tabs in WebStorm
See this link for detailed information on using code style controls in WebStorm:
https://www.jetbrains.com/webstorm/help/code-style.html

At a minimum, uncheck the ‘Use tab character’ checkbox, and set the ‘Tab size’ setting to 4.

##### Tabs in Eclipse
When using Eclipse, tab settings can be changed by editing the code formatter.
1. Click **Window** > **Preferences**
2. Expand the **Java** item on the left, and click on **Code Style**
3. Click **Formatter**
4. Click the **Edit** button
5. Click the **Indentation** tab
6. Set **Tab Policy** to “Spaces only”
7. Set **Tab size** to 4

### Braces

No strict bracing style will be enforced (i.e., opening curly brace on the same line as function declaration, or on the next line), except that it should remain consistent throughout a single file. Wherever braces are placed, they should adhere to the previously mentioned indentation standard of four spaces per unit of indentation.

### Naming Conventions

File, function, variable, and class names should be named using [“camel case”](http://en.wikipedia.org/wiki/CamelCase), unless otherwise noted.

All names should be formed from the 26 upper and lower case letters (A-Z, a-z) and the 10 digits (0-9). Avoid using punctuation, and special or international characters.

Variables and functions should be declared before being used, and must begin with a lowercase character.

Javascript classes (or constructor functions that must be used with the ‘new’ prefix) should start with a capital letter.

### Plugins

Plugin folder names, which become part of the URL for accessing the plugins themselves, must be named using all lower case characters, separated by hyphen characters “-“ when necessary. In this case, camel case should not be used.

#### Plugin Directory Structure
The root directory for Each plugin is required to be laid out in specific format, which is documented in the [Plugin documentation](Plugins.md#5-package-the-plugin-for-distribution), or it may not be compatible with the Slipstream framework. Beyond these requirements, all plugin Javascript code should be organized as follows:
- my-plugin/
  - css/ - *CSS file*
  - help/ - *Help files*
  - img/ - *Image resources*
  - **js/** - *Plugin activities and utility javascript*
      - conf/ - *Plugin configuration file*
      - models/ - *Backbone data model definitions*
      - views/ - *Backbone view definitions*
  - nls/ - *Localization files*
  - templates/  - *HTML templates*

A plugin may encompass several different features or components, where you may find it necessary to further organize the code. In these cases, create a subdirectory in the **js/** directory, and mirror the above mentioned Javascript structure within it. Code that can or will be shared between components of the same plugin should be placed into a **common/** directory. All other files such as CSS, images, and HTML templates should remain in their respective directories. If feature-specific CSS is required, it can be placed in a separate file. Further organization into more subdirectories is up to the developer's discretion. Help and localization files are shared throughout the plugin.
- my-plugin/
  - css/
      - myPlugin.css
      - myFeature.css
  - js/
      - common/
          - conf/
          - models/
          - views/
      - myFeature/
          - conf/
          - models/
          - views/
  - templates/
      - myPluginTemplate.html
      - myFeatureTemplate.html

### CSS

All CSS files should adhere to the previously mentioned indentation standard.

### Best Practices

Besides the basic coding standards and naming conventions noted in this document, these items are intended to serve as recommendations, not strict requirements.

##### REST Calls

Use Backbone data models to make REST API calls, unless it is for some reason not feasible.

##### Loop counters

When using numeric iterators in loops, use double character combinations, e.g., “ii”, “jj”, or “kk” instead of “i”, “j”, or “k” respectively. The purpose of this is to make code more easily searchable. When searching (via grep, find & replace, regular expressions, or just visually skimming) a file for one of these tokens, an “i” is nearly impossible to find, whereas “ii” is easy. This is a simple rule that is easy to follow, and makes coding and maintenance easier.
