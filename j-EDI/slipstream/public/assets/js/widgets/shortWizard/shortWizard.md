# Introduction
A guided workflow in Slipstream can be implemented using one of the framework's wizard widgets.  The *Short Wizard* is a good choice for a workflow that requires a small number of steps - typically six or less.

The Short Wizard is composed of a set of *pages* each of which represents a step in the wizard workflow.  The wizard provides button-based navigation through the set of pages (Next, Back) as well as a *train* that indicates the available steps in the wizard and provides a way to navigate to a given page in a non-sequential manner.

# API

### Constructor

```javascript
function ShortWizard(conf) {...}
```

Used to create a new short wizard instance where *conf* is of the format:

```javascript
{
    showSummary: <Boolean or Custom View to determine if a summary page should be displayed. Optional. Default: true>,
    summaryTitle: <String containing custom title for summary page>,
    summaryEncode: <Boolean used to indicate the summary page values be encoded. Optional. Default: false>,
    relatedActivities: <Array of follow on activities to the wizard>,
    customSuccessStatusFooter: <A custom view on the commit success page>,
    customErrorStatusFooter: <A custom view on the commit error page>,
    onClickRelatedLinks: <A function to be called when a related activity is selected>,
	container: <reference to the DOM element where the dashboard is to be rendered>,
	onDestroy: <function callback to be called when the wizard is destroyed>
    onDone: <function callback to be called when the wizard completes normally>,
    onCancel: <function callback to be called if the user cancels the wizard>,
    save: <function callback to be called when the user submits data. Signature includes options object with success and error methods to be called by the user>
}
```

### addPage

```javascript
function addPage(page)
```

Add a page to the wizard.  The view property is further explained [here](wizardPage.md).

Each page is represented by an object of the following form:

```javascript
{
    title: <A string representing the title of the page>,
    view: <A view representing the page>,
    intro: <true if the page is an introductory page, false otherwise>
}
```

### addPages

```javascript
function addPages(pages)
```
Add a set of pages to the wizard.

**pages** - An array of pages objects to be added to the wizard.


### build

```javascript
function build()
```
Render the wizard into the container specified in the wizard's configuration object.


### destroy

```javascript
function destroy()
```
Destroy the wizard elements and call the *onDestroy* method provided in the wizard's configuration object.


### getCurrentPage

```javascript
function getCurrentPage()
```

Get the page index of the currently active wizard page.


### nextPage

```javascript
function nextPage(skipBeforePageChange)
```
Move to the next page of the wizard.  This function has no effect if the wizard is currently on the last page.

**skipBeforePageChange** - A boolean value to decide if the wizard should bypass the beforePageChange callback. Passing true means the wizard won't trigger the beforePageChange callback. Otherwise, the wizard will operate as usual.


### previousPage

```javascript
function previousPage()
```
Move to the previous page of the wizard.  This function has no effect if the wizard is currently on the first page.


### gotoPage

```javascript
function gotoPage(page)
```
Move the wizard to the page with the specified page index.


### getNumPages

```javascript
function getNumPages()
```
Get the number of pages configured in the wizard.


