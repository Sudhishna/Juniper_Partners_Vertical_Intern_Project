/*
 * jQuery UI Tag-it!
 *
 * @version v2.0 (06/2011)
 *
 * Copyright 2011, Levy Carneiro Jr.
 * Released under the MIT license.
 * http://aehlke.github.com/tag-it/LICENSE
 *
 * Homepage:
 *   http://aehlke.github.com/tag-it/
 *
 * Authors:
 *   Levy Carneiro Jr.
 *   Martin Rehfeld
 *   Tobias Schmidt
 *   Skylar Challand
 *   Alex Ehlke
 *
 * Maintainer:
 *   Alex Ehlke - Twitter: @aehlke
 *
 * Dependencies:
 *   jQuery v1.4+
 *   jQuery UI v1.8+
 */
/* Updated by Miriam Hadfield */
/* Updated by Vidushi Gupta */

(function ($) {

    $.widget('ui.tagit', {
        options: {
            allowDuplicates: false,
            caseSensitive: true,
            fieldName: 'tags',
            placeholderText: null,   // Sets `placeholder` attr on input field.
            readOnly: false,  // Disables editing.
//            readListOnly      : false,  //MH: Disables adding new elements to the list
            removeConfirmation: false,  // Require confirmation to remove tags.
            tagLimit: null,   // Max number of tags allowed (null for unlimited).

            source: [],
            originalSource: [],
            logicSource: [],

            // Used for autocomplete, unless you override `autocomplete.source`.
            availableTags: [],

            // Use to override or add any options to the autocomplete widget.
            //
            // By default, autocomplete.source will map to availableTags,
            // unless overridden.
            autocomplete: {},

            // Shows autocomplete before the user even types anything.
            showAutocompleteOnFocus: false,

            // When enabled, quotes are unneccesary for inputting multi-word tags.
            allowSpaces: false,

            // The below options are for using a single field instead of several
            // for our form values.
            //
            // When enabled, will use a single hidden field for the form,
            // rather than one per tag. It will delimit tags in the field
            // with singleFieldDelimiter.
            //
            // The easiest way to use singleField is to just instantiate tag-it
            // on an INPUT element, in which case singleField is automatically
            // set to true, and singleFieldNode is set to that element. This
            // way, you don't need to fiddle with these options.
            singleField: false,

            // This is just used when preloading data from the field, and for
            // populating the field with delimited tags as the user adds them.
            singleFieldDelimiter: ',',

            // Set this to an input DOM node to use an existing form field.
            // Any text in it will be erased on init. But it will be
            // populated with the text of tags as they are created,
            // delimited by singleFieldDelimiter.
            //
            // If this is not set, we create an input node for it,
            // with the name given in settings.fieldName.
            singleFieldNode: null,

            // Whether to animate tag removals or not.
            animate: true,

            // Optionally set a tabindex attribute on the input that gets
            // created for tag-it.
            tabIndex: null,

            // Define a filter as a key-value set. Possible values:
            // BACKSPACE: 8, TAB: 9, ENTER: 13, ESCAPE: 27, SPACE: 32, PAGE_UP: 33, PAGE_DOWN: 34, END: 35, HOME: 36,
            // LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, NUMPAD_ENTER: 108, COMMA: 188, COLON: 187
            tagDelimiter: 188, //comma

            // Event callbacks.
            beforeTagAdded: null,
            afterTagAdded: null,

            beforeTagRemoved: null,
            afterTagRemoved: null,

            onTagClicked: null,
            onTagLimitExceeded: null,

            tagCompleted: false,
            incompleteTagName: null,
            filterMenuHash: {},

            // DEPRECATED:
            //
            // /!\ These event callbacks are deprecated and WILL BE REMOVED at some
            // point in the future. They're here for backwards-compatibility.
            // Use the above before/after event callbacks instead.
            onTagAdded: null,
            onTagRemoved: null,
            // `autocomplete.source` is the replacement for tagSource.
            tagSource: null
            // Do not use the above deprecated options.
        },

        _create: function () {
            // for handling static scoping inside callbacks
            var that = this;

            // There are 2 kinds of DOM nodes this widget can be instantiated on:
            //     1. UL, OL, or some element containing either of these.
            //     2. INPUT, in which case 'singleField' is overridden to true,
            //        a UL is created and the INPUT is hidden.
            if (this.element.is('input')) {
                this.tagList = $('<ul></ul>').insertAfter(this.element);
                this.options.singleField = true;
                this.options.singleFieldNode = this.element;
                this.element.addClass('tagit-hidden-field');
            } else {
                this.tagList = this.element.find('ul, ol').andSelf().last();

                // Create the logical operator menu
                var selectTag = $('<ul id="logicOperatorMenu"></ul>')
                    .addClass('hideMenu ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all tagit-autocomplete')
                    .click(function (e) {
                        that._updateLogicTag(e);
                    });
                var dropDownValues = "";
                for (var j = 0; j < this.options.logicSource.length; j++) {
                    dropDownValues += '<li class="ui-menu-item" role="presentation"> <a class="ui-corner-all" tabindex="-1">' + that.options.logicSource[j] + '</a></li>';
                }
                this.element.closest('.search-widget').append($(selectTag).append(dropDownValues));
            }

            this.tagInput = $('<input type="text" />').addClass('ui-widget-content');

            if (this.options.readOnly) this.tagInput.attr('disabled', 'disabled');

            if (this.options.tabIndex) {
                this.tagInput.attr('tabindex', this.options.tabIndex);
            }

            if (this.options.placeholderText) {
                this.tagInput.attr('placeholder', this.options.placeholderText);
            }

            if (!this.options.autocomplete.source) {
                this.options.autocomplete.source = function (search, showChoices) {
                    var filter = search.term.toLowerCase();

                    var sourceArray = this.options.availableTags;
                    if (sourceArray.length == 0) {
                        if (this.options.source instanceof Array) {
                            sourceArray = this.options.source;
                        } else {
                            sourceArray = $.map(this.options.source, function (value, index) {
                                return [value.label];
                            });
                        }
                        if (this.options.originalSource.length == 0)
                            this.options.originalSource = this.options.source;
                    }

                    var choices = $.grep(sourceArray, function (element) {
                        // Only match autocomplete options that begin with the search term.
                        // (Case insensitive.)
                        return (element.toLowerCase().indexOf(filter) === 0);
                    });
                    if (!this.options.allowDuplicates) {
                        choices = this._subtractArray(choices, this.assignedTags());
                    }
                    showChoices(choices);
                };
            }

            if (this.options.showAutocompleteOnFocus) {
                this.tagInput.focus(function (event, ui) {
                    that._showAutocomplete();
                });

                if (typeof this.options.autocomplete.minLength === 'undefined') {
                    this.options.autocomplete.minLength = 0;
                }
            }

            // Bind autocomplete.source callback functions to this context.
            if ($.isFunction(this.options.autocomplete.source)) {
                this.options.autocomplete.source = $.proxy(this.options.autocomplete.source, this);
            }

            // DEPRECATED.
            if ($.isFunction(this.options.tagSource)) {
                this.options.tagSource = $.proxy(this.options.tagSource, this);
            }

            this.tagList
                .addClass('tagit')
                .addClass('ui-widget ui-widget-content ui-corner-all')
                // Create the input field.
                .append($('<li class="tagit-new"></li>').append(this.tagInput))
                .click(function (e) {
                    var $target = $(e.target);

                    if ($target.hasClass('tagit-label')) {
                        var tag = $target.closest('.tagit-choice');
                        if (!tag.hasClass('removed')) {
                            that._trigger('onTagClicked', e, {tag: tag, tagLabel: that.tagLabel(tag)});
                        }
                    } else {
                        // Sets the focus() to the input field, if the user
                        // clicks anywhere inside the UL. This is needed
                        // because the input field needs to be of a small size.
                        if (this.tablist) {
                            var tag = this.tablist;
                            $(tag).children(0).text($(tag).text() + " = ");
                        }
                        that.tagInput.focus();

                    }
                });

            // Single field support.
            var addedExistingFromSingleFieldNode = false;
            if (this.options.singleField) {
                if (this.options.singleFieldNode) {
                    // Add existing tags from the input field.
                    var node = $(this.options.singleFieldNode);
                    var tags = node.val().split(this.options.singleFieldDelimiter);
                    node.val('');
                    $.each(tags, function (index, tag) {
                        that.createTag(tag, null, true);
                        addedExistingFromSingleFieldNode = true;
                    });
                } else {
                    // Create our single field input after our list.
                    this.options.singleFieldNode = $('<input id=filtervalue" type="hidden" style="display:none;" value="" name="' + this.options.fieldName + '" />');
                    this.tagList.after(this.options.singleFieldNode);
                }
            }

            // Add existing tags from the list, if any.
            if (!addedExistingFromSingleFieldNode) {
                this.tagList.children('li').each(function () {
                    if (!$(this).hasClass('tagit-new')) {
                        that.createTag($(this).text(), $(this).attr('class'), true);
                        $(this).remove();
                    }
                });
            }

            // Events.
            this.tagInput
                .keydown(function (event) {
                    // Backspace is not detected within a keypress, so it must use keydown.
                    if (event.which == $.ui.keyCode.BACKSPACE && that.tagInput.val() === '') {
                        var tag = that._lastTag();
                        if (!that.options.removeConfirmation || tag.hasClass('remove')) {
                            // When backspace is pressed, the last tag is deleted.
                            that._removeToken(tag);
                            // reset the auto complete with keys
                            var autoCompleteArray = $.map(that.options.originalSource, function (value, index) {
                                return [value.label];
                            });
                            that._setOption("source", autoCompleteArray);
                            // reset the tag completed to true
                            that._setTagComplete(true, null);
                        } else if (that.options.removeConfirmation) {
                            tag.addClass('remove ui-state-highlight');
                        }
                    } else if (that.options.removeConfirmation) {
                        that._lastTag().removeClass('remove ui-state-highlight');
                    }

                    var targetTag = event;

                    // Comma/Space/Enter are all valid delimiters for new tags,
                    // except when there is an open quote or if setting allowSpaces = true.
                    // Tab will also create a tag, unless the tag input is empty,
                    // in which case it isn't caught.
                    if (
                        (event.which === that.options.tagDelimiter && event.shiftKey === false) ||
                        event.which === $.ui.keyCode.ENTER ||
                        (
                            event.which == $.ui.keyCode.TAB &&
                            that.tagInput.val() !== ''
                        ) ||
                        (
                            event.which == $.ui.keyCode.SPACE &&
                            that.options.allowSpaces !== true &&
                            (
                                $.trim(that.tagInput.val()).replace( /^s*/, '' ).charAt(0) != '"' ||
                                (
                                    $.trim(that.tagInput.val()).charAt(0) == '"' &&
                                    $.trim(that.tagInput.val()).charAt($.trim(that.tagInput.val()).length - 1) == '"' &&
                                    $.trim(that.tagInput.val()).length - 1 !== 0
                                )
                            )
                        )
                    ) {
                        // Enter submits the form if there's no text in the input.
                        if (!(event.which === $.ui.keyCode.ENTER && that.tagInput.val() === '')) {
                            event.preventDefault();
                        }

                        //MH
                        if (event.which === $.ui.keyCode.ENTER || event.which === that.options.tagDelimiter) {
                            //  Hit enter on input field

                            var $lastTag = that._lastTag();
                            var lastTagText = $lastTag.text().trim();

                            if (event.which === that.options.tagDelimiter) {
                                // if '=' is pressed on keyboard
                                var tagKey = that._cleanedInput();
                                var $logicTag;
                                if (that._keyValueTokenExists(tagKey).index < 0) {
                                    if (lastTagText != "") {
                                        // indicates no token added yet hence avoid the logic operator creation in UI
                                        $logicTag = that.createLogicTag();
                                    }
                                }
                                var $newTag = that.createTag(tagKey + " = ", null, null, true);
                                if ($newTag && $logicTag) {
                                    that._addLogicTag($newTag, $logicTag);
                                } else {
                                    return false;
                                }
                                $newTag.next().addClass("tagit-input");
                                that._setOption("source", []);
                            } else {
                                // if keyboard Enter is pressed
                                if (lastTagText != "" && (lastTagText.length - 1) == lastTagText.lastIndexOf("=")) {
                                    //  lastTagText value is "sourcekey =" & value is manually input
                                    that._updateKeyValueToken(that._cleanedInput());
                                } else {
                                    // if token is without '=' sign e:g: 'test'
                                    that._updateSingleToken();
                                }
                            }
                        }
                        // Autocomplete will create its own tag from a selection and close automatically. MH
                        if (!(that.options.autocomplete.autoFocus && that.tagInput.data('autocomplete-open'))) {
                            that.tagInput.autocomplete('close');

                            var $lastTag = that._lastTag();
                            var lastTagText = $lastTag.text().trim();

                            if ((lastTagText.length - 1) != lastTagText.lastIndexOf("=")) {
                                that.createTag(that._cleanedInput());
                            } else {
                                var value = $lastTag.text() + " " + that._cleanedInput();
                                $lastTag.children(0).text(value);

                                //update the suggested value in token
                                that._reviveTagsList(value);

                                that.tagInput.val("");
                                that._showAutocomplete();
                            }
                        }
                    }
                })
                .blur(function (e, ui) {
                    // Create a tag when the element loses focus.
                    var value = that._cleanedInput();
                    if (value != "") {
                        // value is in input field & out of focus happened
                        // two scenarios for blur either 'key = value' OR 'singlekey'
                        if (!that.options.tagCompleted) {
                            var $lastTag = that._lastTag();
                            var lastTagText = $lastTag.text().trim();
                            if (lastTagText != "" && (lastTagText.length - 1) == lastTagText.lastIndexOf("=")) {
                                that._updateKeyValueToken(that._cleanedInput());
                            } else {
                                that._updateSingleToken();
                            }
                        }
                    }
                });

            // Autocomplete.
            if (this.options.source || this.options.availableTags || this.options.tagSource || this.options.autocomplete.source) {
                var autocompleteOptions = {
                    select: function (event, ui) {

                        var $lastTag = that._lastTag();
                        var lastTagText = $lastTag.text().trim();

                        if (lastTagText.length == 0 || ((lastTagText.length - 1) != lastTagText.lastIndexOf("="))) {
                            // when key selected from auto drop down options
                            var $logicTag;
                            if (that._keyValueTokenExists(ui.item.value.trim() + " =").index < 0) {
                                // Not duplicate, key is not created yet, add the logical operator
                                if (lastTagText != "") {
                                    // indicates no token added yet hence avoid the logic operator creation in UI
                                    $logicTag = that.createLogicTag();
                                }
                            }
                            var $newTag = that.createTag(ui.item.value.trim() + " =", null, null, true);

                            // update the filter source
                            $newTag.next().addClass("tagit-input");
                            var filterSource = $.map(that.options.originalSource, function (obj) {
                                if (obj.label === ui.item.value)
                                    return obj.value;
                            });
                            that._setOption("source", filterSource);
                            that._setTagComplete(false, ui.item.value);

                            if ($logicTag) {
                                that._addLogicTag($newTag, $logicTag);
                            }
                        } else {
                            // value selected from auto suggestions drop down
                            that._updateKeyValueToken(ui.item.value);
                        }

                        // Preventing the tag input to be updated with the chosen value.
                        return false;
                    },

                    appendTo: this.tagInput.closest('.search-widget')
                };

                $.extend(autocompleteOptions, this.options.autocomplete);

                // tagSource is deprecated, but takes precedence here since autocomplete.source is set by default,
                // while tagSource is left null by default.
                autocompleteOptions.source = this.options.tagSource || autocompleteOptions.source;

                this.tagInput.autocomplete(autocompleteOptions).bind('autocompleteopen.tagit', function (event, ui) {
                    that.tagInput.data('autocomplete-open', true);
                }).bind('autocompleteclose.tagit', function (event, ui) {
                    that.tagInput.data('autocomplete-open', false);
                });

                this.tagInput.autocomplete('widget').addClass('tagit-autocomplete search-widget');
            }

            //used to create the hash for filter menu config with associated keys
            this._createFilterMenuHash();

        },

        _setOption: function (key, value) {
            this._super(key, value);
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);

            this.element.unbind('.tagit');
            this.tagList.unbind('.tagit');

            this.tagInput.removeData('autocomplete-open');

            this.tagList.removeClass([
                'tagit',
                'ui-widget',
                'ui-widget-content',
                'ui-corner-all',
                'tagit-hidden-field'
            ].join(' '));

            if (this.element.is('input')) {
                this.element.removeClass('tagit-hidden-field');
                this.tagList.remove();
            } else {
                this.element.children('li').each(function () {
                    if ($(this).hasClass('tagit-new')) {
                        $(this).remove();
                    } else {
                        $(this).removeClass([
                            'tagit-choice',
                            'ui-widget-content',
                            'ui-state-default',
                            'ui-state-highlight',
                            'ui-corner-all',
                            'remove',
                            'tagit-choice-editable',
                            'tagit-choice-read-only'
                        ].join(' '));

                        $(this).text($(this).children('.tagit-label').text());
                    }
                });

                if (this.singleFieldNode) {
                    this.singleFieldNode.remove();
                }
            }

            return this;
        },

        _cleanedInput: function () {
            // Returns the contents of the tag input, cleaned and ready to be passed to createTag
            return $.trim(this.tagInput.val().replace(/^"(.*)"$/, '$1'));
        },

        _lastTag: function () {
            return this.tagList.find('.tagit-choice:last:not(.removed)');
        },

        _tags: function () {
            return this.tagList.find('.tagit-choice:not(.removed)');
        },

        assignedTags: function () {
            // Returns an array of tag string values
            var that = this;
            var tags = [];
            if (this.options.singleField) {
                tags = $(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter);
                if (tags[0] === '') {
                    tags = [];
                }
            } else {
                this._tags().each(function () {
                    tags.push(that.tagLabel(this));
                });
            }
            return tags;
        },

        assignedTagsWithKeys: function () {
            // this is used to provide associated keys to the labels for each tag
            // if there is no associated key in the config, token is returned as is.
            var tagsWithKeys = [];
            var tags = this.assignedTags(); // get all the tokens
            // associate the config keys to labels
            for (var index in tags) {
                var insertTag = tags[index];
                if (insertTag.indexOf("=") >= 0) {
                    // key:value pair detected
                    var currentLabel = insertTag.substring(0, insertTag.indexOf("=") - 1).trim();
                    if (this.options.filterMenuHash[currentLabel] != undefined) {
                        // associated key found for label in the config file
                        insertTag = insertTag.replace(currentLabel, this.options.filterMenuHash[currentLabel]);
                    }
                }
                tagsWithKeys.push(insertTag);
            }
            return tagsWithKeys;
        },

        _updateSingleTagsField: function (tags) {
            // Takes a list of tag string values, updates this.options.singleFieldNode.val to the tags delimited by this.options.singleFieldDelimiter
            $(this.options.singleFieldNode).val(tags.join(this.options.singleFieldDelimiter)).trigger('change');
        },

        _subtractArray: function (a1, a2) {
            var result = [];
            for (var i = 0; i < a1.length; i++) {
                if ($.inArray(a1[i], a2) == -1) {
                    result.push(a1[i]);
                }
            }
            return result;
        },

        tagLabel: function (tag) {
            // Returns the tag's string label.
            if (this.options.singleField) {
                return $(tag).find('.tagit-label:first').text();
            } else {
                return $(tag).find('input:first').val();
            }
        },

        _showAutocomplete: function () {
            this.tagInput.autocomplete('search', '');
            //    $('.ui-menu-item:first').children(0).addClass('ui-state-hover'); problem: stay on
        },

        _findTagByLabel: function (name) {
            var that = this;
            var tag = null;
            this._tags().each(function (i) {
                if (that._formatStr(name) == that._formatStr(that.tagLabel(this))) {
                    tag = $(this);
                    return false;
                }
            });
            return tag;
        },

        _isNew: function (name) {
            return !this._findTagByLabel(name);
        },

        _formatStr: function (str) {
            if (this.options.caseSensitive) {
                return str;
            }
            return $.trim(str.toLowerCase());
        },

        _effectExists: function (name) {
            return Boolean($.effects && ($.effects[name] || ($.effects.effect && $.effects.effect[name])));
        },

        showAutocomplete: function () {
            this._showAutocomplete();
        },

        createTag: function (value, additionalClass, duringInitialization, isPartialTag, isLogicTag) {
            var that = this;

            value = $.trim(value);

            if (this.options.preprocessTag) {
                value = this.options.preprocessTag(value);
            }

            if (value === '') {
                return false;
            }

            // let duplicate logical operators be created, restrict creating duplicate token
            if (!isLogicTag) {
                if (!this.options.allowDuplicates && !this._isNew(value)) {
                    var $existingTag = this._findTagByLabel(value);
                    if (this._trigger('onTagExists', null, {
                            existingTag: $existingTag,
                            duringInitialization: duringInitialization
                        }) !== false) {
                        // if duplicate token, remove the extra added logic tag
                        var $lastTag = that._lastTag();
                        var lastTagText = $lastTag.text().trim();
                        if (that.options.logicSource.indexOf(lastTagText) != -1) {
                            // must be logic tag, remove extra logic tag
                            if (that.options.singleField) {
                                var tags = that.assignedTags();
                                tags.pop();
                                $lastTag.remove(); // extra logic tag remove from UI
                                that.tagInput.val("");
                                that._updateSingleTagsField(tags);
                            }
                        }

                        if (this._effectExists('bounce')) {
                            $existingTag.effect('bounce');
                        }
                    }
                    return false;
                } else {
                    // update the data attribute of logical operator
                    var $lastTag = that._lastTag();  // must be logic tag
                    var attrValue = value.indexOf('=') != -1 ? value.substring(0, value.indexOf('=')) + '=' : value;
                    // Scenario-1 : New Token is selected from auto select
                    // Scenario-2 : Already existing token in search bar is auto selected or manually input
                    // Make sure to only update the last tag if it is logical operator.
                    if(~($.inArray($lastTag.text(),this.options.logicSource))){
                        $lastTag.find(".tagit-label").attr('data-logic-tag', attrValue);
                    }
                }
            }

            if (this.options.tagLimit && this._tags().length >= this.options.tagLimit) {
                this._trigger('onTagLimitExceeded', null, {duringInitialization: duringInitialization});
                return false;
            }

            var label = $(this.options.onTagClicked ? '<a class="tagit-label"></a>' : '<span class="tagit-label"></span>').text(value);

            // Create tag.
            var tag = $('<li></li>')
                .addClass('tagit-choice ui-widget-content ui-state-default ui-corner-all')
                .addClass(additionalClass)
                .append(label);

            if (this.options.readOnly) {
                tag.addClass('tagit-choice-read-only');
                tag.addClass('tagit-color');
                tag.next().removeClass("tagit-input");
                that.insertRemoveIcon(tag);
            } else {
                tag.addClass('tagit-choice-editable');
                if (!isPartialTag) {
                    tag.addClass('tagit-color'); //ok for all except when 'key ='
                    tag.next().removeClass("tagit-input"); //no issues
                    that.insertRemoveIcon(tag); //offender!
                }
            }
            /*            } else {
             console.log($(keyTag).text());
             $(keyTag).text($(keyTag).text() + label);
             }
             */
            // Unless options.singleField is set, each tag has a hidden input field inline.
            if (!this.options.singleField) {
                var escapedValue = label.html();
                tag.append('<input id="filtervalue" type="hidden" value="' + escapedValue + '" name="' + this.options.fieldName + '" class="tagit-hidden-field" />');
            }

            if (this._trigger('beforeTagAdded', null, {
                    tag: tag,
                    tagLabel: this.tagLabel(tag),
                    duringInitialization: duringInitialization
                }) === false) {
                return;
            }

            if (this.options.singleField) {
                var tags = this.assignedTags();
                tags.push(value);
                this._updateSingleTagsField(tags);
            }

            // DEPRECATED.
            this._trigger('onTagAdded', null, tag);

            this.tagInput.val('');

            // Insert tag.
            this.tagInput.parent().before(tag);

            // trigger the event only if token is complete with value
            if (!isLogicTag && !isPartialTag) {
                this._trigger('afterTagAdded', null, {
                    tag: tag,
                    tagLabel: this.tagLabel(tag),
                    duringInitialization: duringInitialization
                });
            }

            if (this.options.showAutocompleteOnFocus && !duringInitialization) {
                setTimeout(function () {  }, 0);
            }

            return tag;
        },

        //This inserts the X mark delete icon next to tokens for deletion of tokens
        insertRemoveIcon: function (tag) {
            var that = this;
            // Button for removing the tag.
            var $removeTag = $('<a></a>') // \xd7 is an X
                .addClass('tagit-close')
                .click(function (e) {
                    // Removes a tag when the little 'x' is clicked.
                    that._removeToken(tag);
                });
            var $removeIcon = $('<span></span>')
                .addClass('tag-it-close-span')
                .append($removeTag);
            if (tag)
                tag.append($removeIcon);

        },

        removeTag: function (tag, animate) {
            animate = typeof animate === 'undefined' ? this.options.animate : animate;

            tag = $(tag);

            // DEPRECATED.
            this._trigger('onTagRemoved', null, tag);

            if (this._trigger('beforeTagRemoved', null, {tag: tag, tagLabel: this.tagLabel(tag)}) === false) {
                return;
            }

            if (this.options.singleField) {
                var tags = this.assignedTags();
                var removedTagLabel = this.tagLabel(tag);
                tags = $.grep(tags, function (el) {
                    return el != removedTagLabel;
                });
                this._updateSingleTagsField(tags);
            }

            if (animate) {
                tag.addClass('removed'); // Excludes this tag from _tags.
                var hide_args = this._effectExists('blind') ? ['blind', {direction: 'horizontal'}, 'fast'] : ['fast'];

                var thisTag = this;
                hide_args.push(function () {
                    tag.remove();
                    thisTag._trigger('afterTagRemoved', null, {tag: tag, tagLabel: thisTag.tagLabel(tag)});
                });

                tag.fadeOut('fast').hide.apply(tag, hide_args).dequeue();
            } else {
                tag.remove();
                this._trigger('afterTagRemoved', null, {tag: tag, tagLabel: this.tagLabel(tag)});
            }
        },

        removeTagByLabel: function (tagLabel, animate) {
            var toRemove = this._findTagByLabel(tagLabel);
            if (!toRemove) {
                throw "No such tag exists with the name '" + tagLabel + "'";
            }
            this.removeTag(toRemove, animate);
        },

        removeAll: function () {
            // Removes all tags.
            var that = this;
            this._tags().each(function (index, tag) {
                that.removeTag(tag, false);
            });

            if (this.options.originalSource.length == 0) {
                this.options.originalSource = this.options.source;
            }
            var originalSourceArray = $.map(that.options.originalSource, function (value, index) {
                return [value.label];
            });
            this._setOption("source", originalSourceArray);
        },


        createLogicTag: function (value) {
            if (!value) {
                value = this.options.logicSource[0];
            }
            var $logicTag = this.createTag(value, null, null, true, true);
            return $logicTag;
        },

        appendLogicTag: function (newTag, logicTag) {
            this._addLogicTag(newTag, logicTag);
        },

        _addLogicTag: function (newTag, logicTag) {

            var $newTag = typeof(newTag) != "undefined" ? newTag : this.tagList.find(newTag);
            var $logicTag = typeof(logicTag) != "undefined" ? logicTag : this.tagList.find(logicTag);

            var $currentTags = this.tagList.find(".tagit-choice");
            if ($currentTags.length > 1) {
                var newTagText = $newTag.find(".tagit-label").text();
                var attrValue = newTagText.indexOf('=') != -1 ? newTagText.substring(0, newTagText.indexOf('=')) + '=' : newTagText;
                $logicTag.find(".tagit-label").attr('data-logic-tag', attrValue);
                $newTag.before($logicTag);
                $logicTag.addClass('tagit-color');

                var that = this;
                var $tagMenu = that.element.find("#logicOperatorMenu");
                var selectTag = $('<a></a>') // \xd7 is an X
                    .addClass('tag-it-select')
                    .click(function (e) {
                        that._setOption("source", []);
                        if($(this).closest(".bbm-modal__section").length > 0){
                            $(this).closest(".search-widget").parent().css("position","relative");
                            $(this).closest(".search-widget").css("position","static");
                        }
                        var $parentPos = $(this).parent().parent().position();
                        var leftPosition = $parentPos.left;
                        var topPosition = $parentPos.top + 20;
                        var keyForLogicTag = $(this).parent().parent().find(".tagit-label").attr('data-logic-tag');
                        // add a temporary id to be referenced later
                        $tagMenu.attr('data-temp-logic-key', keyForLogicTag);
                        $tagMenu.css("left", leftPosition);
                        $tagMenu.css("top", topPosition);
                        $tagMenu.removeClass("hideMenu");
                        that.tagInput.removeData('autocomplete-open');
                        that.tagInput.autocomplete('close');
                    })
                    .blur(function (e) {
                        $tagMenu.addClass("hideMenu");
                        console.log($(this));
                    });

                var selectTagIcon = $('<span></span>')
                    .addClass('tag-it-open-span')
                    .append(selectTag);

                $logicTag.append(selectTagIcon);
            }
        },

        _removeLogicTag: function (tag) {
            var $tag = tag;
            // remove the logical tag from tag list
            var currentTag = this.tagLabel($tag);
            var tags = this.assignedTags();
            var currentTagIndex = tags.indexOf(currentTag);
            if (currentTagIndex > 0) {
                // delete the logical operator from the tags list
                var logicalOperatorIndex = currentTagIndex - 1;
                tags.splice(logicalOperatorIndex, 1); // delete from tags array
                this._updateSingleTagsField(tags);
                // remove the previous logical tag from input field on UI
                $tag.prev().remove();
            } else {
                // if first token is deleted, remove the next logical operator if exists
                var logicalOperatorIndex = currentTagIndex + 1;
                if (logicalOperatorIndex < tags.length) {
                    tags.splice(logicalOperatorIndex, 1); // delete from tags array
                    this._updateSingleTagsField(tags);
                    // remove the next logical tag from input field on UI
                    $tag.next().remove();
                }
            }
        },

        _removeToken: function (tag) {
            if (!this.options.readOnly) {
                this._removeLogicTag(tag);
            }
            this.removeTag(tag);
        },

        _reviveTagsList: function (updateTagValue, position) {
            // update the tags list with appropriate value
            if (this.options.singleField) {
                var tags = this.assignedTags();
                if (position >= 0) {
                    tags[position] = updateTagValue;
                }
                else {
                    // update the top most value for the token
                    tags.pop();
                    tags.push(updateTagValue);
                }
                this._updateSingleTagsField(tags);
            }
        },

        createToken: function (tokens) {
            var that = this;

            var addToken = function (token) {
                that.createTag(token);
            };

            if (_.isArray(tokens)) {
                tokens.forEach(function (token) {
                    addToken(token);
                });
            } else {
                addToken(tokens);
            }
        },

        createAdvanceTokens: function (tokens) {
            // creates the token along with logical operator insertion
            var that = this;

            var addToken = function (token) {
                var allTokens = that.assignedTags();
                var $logicTag;
                var $addedToken;

                if (!that.options.readOnly && allTokens.length && ~that.options.logicSource.indexOf(token)) {
                    $logicTag = that.createLogicTag(token);
                } else {
                    $addedToken = that.createTag(token);
                }

                if ($logicTag) {
                    that._addLogicTag($addedToken, $logicTag);
                }
            };
            if (_.isArray(tokens)) {
                tokens.forEach(function (token) {
                    addToken(token);
                });
            } else {
                addToken(tokens);
            }

            this._setTagComplete(true, null);
        },

        _updateKeyValueToken: function (newValue) {
            // If there is no value to add, return
            if(!newValue){ return false;}
            // update the token & club the values for same key with comma in between
            var $lastTag = this._lastTag();
            //var lastTagText = $lastTag.text().trim();
            var duplicateToken = this._keyValueTokenExists($lastTag.text());
            var duplicateTokenIndex = duplicateToken.index;
            var duplicateTokenValue = duplicateToken.existingValue.trim();
            if (duplicateTokenValue != "") {
                //token already exists, update the existing token & delete the temporary created token
                var tags = this.assignedTags();
                var updatedValue = tags[duplicateTokenIndex] + ", " + newValue;
                this._findTagByLabel(tags[duplicateTokenIndex]).children().first().text(updatedValue);
                $lastTag.remove(); // remove the temporary tag from UI
                tags[duplicateTokenIndex] = updatedValue;
                tags.pop(); // remove the temporary tag from tag list
                this._updateSingleTagsField(tags);
            } else {
                // new Key, hence add in taglist & UI
                $lastTag.children(0).text($lastTag.text() + " " + newValue);
                $lastTag.addClass('tagit-color');
                $lastTag.next().removeClass("tagit-input");
                this.insertRemoveIcon($lastTag);
                this._reviveTagsList($lastTag.text()); //update the suggested value in token tag list
            }
            this.tagInput.val("");
            var origSourceArray = $.map(this.options.originalSource, function (value, index) {
                return [value.label];
            });
            this._setOption("source", origSourceArray);
            this._setTagComplete(true, null);

            this._trigger('afterTagAdded', null, {
                tag: $lastTag,
                tagLabel: this.tagLabel($lastTag),
                duringInitialization: null
            });
        },

        _keyValueTokenExists: function (key) {
            // find in tag list if the 'key =' is already existing
            var existingTags = this.assignedTags();
            for (var index = 0; index < existingTags.length; index++) {
                if (existingTags[index].indexOf(key) >= 0) {
                    // var allTags = that.assignedTags();
                    var existingKeyValue = existingTags[index].split("=");
                    //var existingValue= existingKeyValue[1];
                    return {
                        index: index,
                        existingValue: existingKeyValue[1]
                    };
                }
            }
            return {
                index: -1,
                existingValue: ""
            };
        },

        _updateSingleToken: function () {
            var $lastTag = this._lastTag();
            var lastTagText = $lastTag.text().trim();

            var tagKey = this._cleanedInput();
            if (tagKey == "") {
                return false;
            }

            var $logicTag;
            if (lastTagText != "") {
                // indicates no token added yet hence avoid the logic operator creation in UI
                $logicTag = this.createLogicTag();
            }
            var $newTag = this.createTag(tagKey);
            if ($newTag && $logicTag) {
                this._addLogicTag($newTag, $logicTag);
            } else {
                return false;
            }
            $lastTag = $newTag;
            this._reviveTagsList($lastTag.text());

            $lastTag.addClass('tagit-color');
            $lastTag.next().removeClass("tagit-input");
            this.insertRemoveIcon($lastTag);
            var originalSourceArray = $.map(this.options.originalSource, function (value, index) {
                return [value.label];
            });
            this._setOption("source", originalSourceArray);
            this._setTagComplete(true, null);
        },

        _updateLogicTag: function (e) {
            var self = this;
            var $target = $(e.target);
            var $currentTarget = $(e.currentTarget);
            var valueSelectedFromMenu = $target.text();
            var logicTagKeyValue = $currentTarget.attr("data-temp-logic-key");


            // replace selected menu item in ui
            var $clickedLogicalTag = $currentTarget.parent().find("span[data-logic-tag*='" + logicTagKeyValue + "']");
            $clickedLogicalTag.text(valueSelectedFromMenu);
            $currentTarget.removeAttr("data-temp-logic-key");
            // hide the logic menu
            var $tagMenu = $target.parent().parent();
            $tagMenu.addClass("hideMenu");

            // replace value in token tag list
            var index = this._keyValueTokenExists(logicTagKeyValue).index;
            this._reviveTagsList(valueSelectedFromMenu, index - 1);

            var autoCompleteArray;
            if (this.options.tagCompleted) {
                // fill with key array
                autoCompleteArray = $.map(this.options.originalSource, function (value, index) {
                    return [value.label];
                });
            } else {
                // fill with values array associated with keys
                autoCompleteArray = $.map(this.options.originalSource, function (obj) {
                    if (obj.label === self.options.incompleteTagName)
                        return obj.value;
                });
            }
            this._setOption("source", autoCompleteArray);

            this._trigger('afterTagAdded', null, {});
            $clickedLogicalTag.closest(".search-widget").parent().css('position','');
            $clickedLogicalTag.closest(".search-widget").css('position','');
        },

        _createFilterMenuHash: function () {
            // create a pair of keys & label of filter menu config
            for (var obj in this.options.source) {
                this.options.filterMenuHash[this.options.source[obj].label] = obj;
            }
        },

        _setTagComplete: function (tagCompleted, incompleteTagName) {
            this.options.tagCompleted = tagCompleted;
            this.options.incompleteTagName = incompleteTagName;
        }
    });
})(jQuery);

