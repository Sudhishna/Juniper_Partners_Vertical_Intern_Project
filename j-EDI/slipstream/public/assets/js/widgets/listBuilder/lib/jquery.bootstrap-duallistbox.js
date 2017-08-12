/**
 * A library that creates a list builder widget, which is composed by two columns and a set of buttons.
 * Elements from the first column can be moved to the second column and viceversa using the provided left and right buttons.
 * It also provides filtering option to narrowed the list of elements to be moved around the lists.
 * It relies on the configuration parameters like container where the list will be rendered and the list of elements that will
 * be showed on the list.
 * This library was rewritten to use checkboxes instead of selects for the list of elements, and to include the specific
 * pattern defined in Slipstream. It's based on Bootstrap Dual Listbox
 *
 * @module jquery.bootstrap-dualistbox
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'lib/template_renderer/template_renderer',
    'text!widgets/listBuilder/templates/listContainer.html',
    'text!widgets/listBuilder/templates/listElement.html',
    'text!widgets/listBuilder/templates/listTitle.html',
    'widgets/tooltip/tooltipWidget',
    'widgets/listBuilder/conf/tooltipConfiguration'
], function(render_template, listContainer, listElement, listTitle,  TooltipWidget, tooltipConfiguration){

  // Create the defaults once
  var pluginName = 'bootstrapDualListbox',
    defaults = {
      filterTextClear: '',
      filterPlaceHolder: 'Filter',
      moveSelectedLabel: 'Move selected',
      moveAllLabel: 'Move all',
      removeSelectedLabel: 'Remove selected',
      removeAllLabel: 'Remove all',
      moveOnSelect: true,                                                                 // true/false (forced true on androids, see the comment later)
      preserveSelectionOnMove: false,                                                     // 'all' / 'moved' / false
      selectedListLabel: false,                                                           // 'string', false
      nonSelectedListLabel: false,                                                        // 'string', false
      helperSelectNamePostfix: '_helper',                                                 // 'string_of_postfix' / false
      selectOrMinimalHeight: 100,
      showFilterInputs: true,                                                             // whether to show filter inputs
      nonSelectedFilter: '',                                                              // string, filter the non selected options
      selectedFilter: '',                                                                 // string, filter the selected options
      infoTextEnd: 'items',                                                               // end text for infoText, infoTextFiltered and infoTextEmpty
      infoText: '{0} ',                                                                   // text when all options are visible / false for no info text
      infoTextFiltered: '<span class="label label-warning">Filtered</span> {0} of {1} ',  // when not all of the options are visible due to the filter
      infoTextEmpty: '0 ',                                                                // when there are no options present in the list
      filterOnValues: false                                                               // filter by selector's values, boolean
    };

  // The actual plugin constructor
  function BootstrapDualListbox(element, options) {
    this.element = $(element);
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  function triggerChangeEvent(dualListbox) {
    dualListbox.element.trigger('change');
  }

  function triggerSelectedChangeEvent(dualListbox, list) {
    dualListbox.elements.select2.trigger('selectedChangeEvent', list);
    console.log(list);
  }

  function updateSelectionStates(dualListbox) {
    var setElementSelectionState = function (item,elementCount,selected){
      var $item = $(item);

      $item.data('original-index', elementCount);
      if (typeof($item.attr('selected')) === 'undefined' && typeof($item.attr('is_existing')) === 'undefined') {
        $item.attr('selected', selected);
      }
      if (typeof($item.attr('is_existing')) === 'undefined') {
        $item.attr('is_existing', true);
      }
    };
    dualListbox.elementCount = 0;
    dualListbox.element.find('.box1 .list-group-item').each(function(index, item) {
        setElementSelectionState(item,dualListbox.elementCount++,false);
    });
    dualListbox.element.find('.box2 .list-group-item').each(function(index, item) {
        setElementSelectionState(item,dualListbox.elementCount++,true);
    });
  }

  function changeSelectionState(dualListbox, original_index, selected) {
    var isChanged = false;

    dualListbox.element.find('.list-group-item').each(function(index, item) {
      var $item = $(item);
      if ($item.data('original-index') === original_index) {
        $item.attr('selected', selected);
        isChanged = true;
      }
    });
    return isChanged;
  }

  function formatString(s, args) {
    return s.replace(/\{(\d+)\}/g, function(match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  }

  function updateFilterIcon(dualListbox, selectIndex, value) {
      if(value){
          dualListbox.elements['filterIcon'+selectIndex].removeClass('search-icon');
          dualListbox.elements['filterIcon'+selectIndex].addClass('show-all-icon');
      }else{
          dualListbox.elements['filterIcon'+selectIndex].removeClass('show-all-icon');
          dualListbox.elements['filterIcon'+selectIndex].addClass('search-icon');
      }
  }

  function refreshInfo(dualListbox) {
    if (!dualListbox.settings.infoText) {
      return;
    }
    var visible1 = dualListbox.elements.box1.find('.list-group-item input[type=checkbox]').length,
      visible2 = dualListbox.elements.box2.find('.list-group-item input[type=checkbox]').length,
      all1 = dualListbox.element.find('.list-group-item input[type=checkbox]').length - dualListbox.selectedElements,
      all2 = dualListbox.selectedElements,
      content = '';
    if (all1 === 0) {
      content = dualListbox.settings.infoTextEmpty;
    } else if (visible1 === all1) {
      content = formatString(dualListbox.settings.infoText, [visible1, all1]);
    } else {
      content = formatString(dualListbox.settings.infoTextFiltered, [visible1, all1]);
    }

    dualListbox.elements.info1.html(content);
    dualListbox.elements.box1.toggleClass('filtered', !(visible1 === all1 || all1 === 0));

    if (all2 === 0) {
      content = dualListbox.settings.infoTextEmpty;
    } else if (visible2 === all2) {
      content = formatString(dualListbox.settings.infoText, [visible2, all2]);
    } else {
      content = formatString(dualListbox.settings.infoTextFiltered, [visible2, all2]);
    }

    dualListbox.elements.info2.html(content);
    dualListbox.elements.box2.toggleClass('filtered', !(visible2 === all2 || all2 === 0));
    dualListbox.elements.selectAll1.prop('checked',false);
    dualListbox.elements.selectAll2.prop('checked',false);

    dualListbox.tooltipBox1.build();
    dualListbox.tooltipBox2.build();
  }

  function refreshSelects(dualListbox) {
    dualListbox.selectedElements = 0;

    dualListbox.element =dualListbox.element.clone(true);
    dualListbox.elements.select1.empty();
    dualListbox.elements.select2.empty();

    dualListbox.element.find('.list-group-item').each(function(index, item) {
      var $item = $(item).clone(true);
      if ($item.attr('selected')) {
        dualListbox.selectedElements++;
        dualListbox.elements.select2.append($item.attr('selected', $item.data('_selected')));
      } else {
        dualListbox.elements.select1.append($item.attr('selected', $item.data('_selected')));
      }

    });

    if (dualListbox.settings.showFilterInputs) {
      filter(dualListbox, 1);
      filter(dualListbox, 2);
    }
    refreshInfo(dualListbox);
  }

  function filter(dualListbox, selectIndex) {
    if (!dualListbox.settings.showFilterInputs) {
      return;
    }

    saveSelections(dualListbox, selectIndex);

    dualListbox.elements['box'+selectIndex].find('.list-group').empty();
    var filterValue = $.trim(dualListbox.elements['filterInput'+selectIndex].val());
    updateFilterIcon(dualListbox, selectIndex, filterValue);
    var regex = new RegExp(filterValue, 'gi'),
    options = dualListbox.element.clone(true);

    if (selectIndex === 1) {
      options = options.find('.list-group-item[selected!="selected"]');
    } else  {
      options = options.find('.list-group-item[selected="selected"]');
    }

    options.each(function(index, item) {
      var $item = $(item),
          value = $item.find('input').attr('value'),
          isFiltered = true;
      if (value.match(regex) || (dualListbox.settings.filterOnValues && value.match(regex) ) ) {
        isFiltered = false;
        dualListbox.elements['select'+selectIndex].append($item.clone(true).attr('selected', $item.data('_selected')));
      }
      dualListbox.element.find('.list-group-item').eq($item.data('original-index')).data('filtered'+selectIndex, isFiltered);
    });

    refreshInfo(dualListbox);
  }

  function saveSelections(dualListbox, selectIndex) {
    dualListbox.element.find('select'+selectIndex +' .list-group-item').each(function(index, item) {
        var $item = $(item);
        dualListbox.element.find('.list-group-item').eq($item.data('original-index')).data('_selected', $item.attr('selected'));
    });
  }

  function sortOptions(select) {
    select.find('.list-group-item').sort(function(a, b) {
      return ($(a).find('label').text() > $(b).find('label').text()) ? 1 : -1;
    }).appendTo(select);
  }

  function sortBothBoxes(dualListbox) {
    sortOptions(dualListbox.elements.select1);
    sortOptions(dualListbox.elements.select2);
  }

  function clearSelections(dualListbox) {
    dualListbox.elements.select1.find('.list-group-item input').each(function() {
      dualListbox.element.find('.list-group-item input').data('_selected', false);
    });
  }

  function move(dualListbox) {
    var changedItems = [];

    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
    }

    dualListbox.elements.select1.find('.list-group-item input:checked').each(function(index, item) {
      var $item = $(item).parent(), isChanged;
      if (!$item.data('filtered1')) {
        isChanged = changeSelectionState(dualListbox, $item.data('original-index'), true);

        if (isChanged){
          changedItems.push({
            "label": $item.find('label').text(),
            "value": $item.find('input').val(),
            "valueDetails": $item.find('span').text(),
            "moreInfo": $item.find('.more-info').text(),
            "img_src": $item.find('img').attr('src'),
            "tooltip": $item.attr('data-tooltip'),
            "extraData": $item.attr('data-extra')
          });

        } 
      }
    });
    dualListbox.refresh(true);   
    sortBothBoxes(dualListbox);
    triggerChangeEvent(dualListbox);
    triggerSelectedChangeEvent(dualListbox, {data: changedItems, event: 'select'});
  }

  function remove(dualListbox) {
    var changedItems = [];

    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 2);
    }

    dualListbox.elements.select2.find('.list-group-item input:checked').each(function(index, item) {
      var $item = $(item).parent(), isChanged;
      if (!$item.data('filtered2')) {
        isChanged = changeSelectionState(dualListbox, $item.data('original-index'), false);

        if (isChanged){
          changedItems.push({
            "label": $item.find('label').text(),
            "value": $item.find('input').val(),
            "valueDetails": $item.find('span').text(),
            "moreInfo": $item.find('.more-info').text(),
            "img_src": $item.find('img').attr('src'),
            "tooltip": $item.attr('data-tooltip'),
            "extraData": $item.attr('data-extra')
          });
        } 
      }
    });
    dualListbox.refresh(true);   
    sortBothBoxes(dualListbox);
    triggerChangeEvent(dualListbox);
    triggerSelectedChangeEvent(dualListbox, {data: changedItems, event: 'unselect'});
  }

  function moveAll(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
    }

    dualListbox.element.find('.list-group-item').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered1')) {
        $item.attr('selected', true);
      }
    });

    refreshSelects(dualListbox);
    sortOptions(dualListbox.elements.select2);
    triggerChangeEvent(dualListbox);
  }

  function removeAll(dualListbox) {
    if (dualListbox.settings.preserveSelectionOnMove === 'all' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 1);
      saveSelections(dualListbox, 2);
    } else if (dualListbox.settings.preserveSelectionOnMove === 'moved' && !dualListbox.settings.moveOnSelect) {
      saveSelections(dualListbox, 2);
    }

    dualListbox.element.find('.list-group-item').each(function(index, item) {
      var $item = $(item);
      if (!$item.data('filtered2')) {
        $item.attr('selected', false);
      }
    });

    refreshSelects(dualListbox);
    sortOptions(dualListbox.elements.select1);
    triggerChangeEvent(dualListbox);
  }

  function toggleAll(dualListbox, box, status) {
      dualListbox.elements[box].find('.list-group-item input[type=checkbox]').prop('checked',status);
  }

  function toggleSelectAll(dualListbox, target, select, listGroup){
    var $target = $(target);
    var isCheckbox = $target.is('input[type=checkbox]'),
        checkedItems = dualListbox.elements[select].find('.list-group-item input:not(:checked) ').length;
      if (isCheckbox && checkedItems>0){
        dualListbox.elements[listGroup].prop('checked',false);
      } else {
        dualListbox.elements[listGroup].prop('checked',true);
      }
  }

  function getAvailableItems(dualListbox){
    var availableItems = [];
    dualListbox.elements.box1.find('.list-group-item').each(function(index, item) {
      var $item = $(item);
      availableItems.push({
        "label": $item.find('label').text(),
        "value": $item.find('input').val(),
        "valueDetails": $item.find('span').text(),
        "moreInfo": $item.find('.more-info').text(),
        "img_src": $item.find('img').attr('src'),
        "tooltip": $item.attr('data-tooltip'),
        "extraData": $item.attr('data-extra')
      });
    });
    return availableItems;
  }

  function addAvailableItems(dualListbox,list){
    $.each( list, function( key, value ) {
      dualListbox.element.find('.box1 .list-group').append(render_template(listElement,value));
    });
    
    dualListbox.refresh(true);   
    sortBothBoxes(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function setAvailableItems(dualListbox,list){
    
    var listHash = {};
    for (var i=0; i<list.length; i++){
        listHash[list[i]]=list[i];
    }

    dualListbox.element.find('.box2 .list-group-item').each(function(index, item) {
        var $item = $(item);
        var value = $item.find('input').val();
        if(listHash[value]){
          $item.attr('selected', false);
        }
    });
    refreshSelects(dualListbox);
    sortBothBoxes(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function removeItems(dualListbox,list){
    var listHash = {}, removedItems = [];
    for (var i=0; i<list.length; i++){
        listHash[list[i]]=list[i];
    }

    removedItems = removeItem(dualListbox.element.find('.box1 .list-group-item'), listHash, removedItems);
    removedItems = removeItem(dualListbox.element.find('.box2 .list-group-item'), listHash, removedItems);

    dualListbox.refresh(true);
    sortBothBoxes(dualListbox);
    triggerChangeEvent(dualListbox);

    return removedItems;
  }

  function getSelectedItems(dualListbox){
    var selectedItems = [];
      dualListbox.elements.box2.find('.list-group-item').each(function(index, item) {
        var $item = $(item);
        selectedItems.push({
          "label": $item.find('label').text(),
          "value": $item.find('input').val(),
          "valueDetails": $item.find('span').text(),
          "moreInfo": $item.find('.more-info').text(),
          "img_src": $item.find('img').attr('src'),
          "tooltip": $item.attr('data-tooltip'),
          "extraData": $item.attr('data-extra')
        });
    });
    return selectedItems;
  }

  function addSelectedItems(dualListbox,list){
    $.each( list, function( key, value ) {
      dualListbox.element.find('.box2 .list-group').append(render_template(listElement,value));
    });
    
    dualListbox.refresh(true);
    sortBothBoxes(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function setSelectedItems(dualListbox,list){
    var listHash = {};
    for (var i=0; i<list.length; i++){
        listHash[list[i]]=list[i];
    }
    dualListbox.element.find('.box1 .list-group-item').each(function(index, item) {
        var $item = $(item);
        var value = $item.find('input').val();
        if(listHash[value]){
          $item.attr('selected', true);
        }
    });
    refreshSelects(dualListbox);
    sortBothBoxes(dualListbox);
    triggerChangeEvent(dualListbox);
  }

  function removeItem(box, listHash, removedItems){
    box.each(function(index, item) {
        var $item = $(item);
        var value = $item.find('input').val();
        if(listHash[value]){
          removedItems.push({
            "label": $item.find('label').text(),
            "value": $item.find('input').val(),
            "valueDetails": $item.find('span').text(),
            "moreInfo": $item.find('.more-info').text(),
            "img_src": $item.find('img').attr('src'),
            "tooltip": $item.attr('data-tooltip'),
            "extraData": $item.attr('data-extra')
          });
          $item.remove();
        }
    });
    return removedItems
  }


  function bindEvents(dualListbox) {
    dualListbox.element.on('bootstrapDualListbox.refresh', function(e, mustClearSelections){
      dualListbox.refresh(mustClearSelections);
    });

    dualListbox.elements.filterClear1.on('click', function() {
      dualListbox.setNonSelectedFilter('', true);
    });

    dualListbox.elements.filterClear2.on('click', function() {
      dualListbox.setSelectedFilter('', true);
    });

    dualListbox.elements.selectAll1.on('click', function() {
        var status = $(this).prop('checked');
        toggleAll(dualListbox, 'box1', status);
    });

    dualListbox.elements.selectAll2.on('click', function() {
        var status = $(this).prop('checked');
        toggleAll(dualListbox, 'box2', status);
    });

    dualListbox.elements.listGroup1.on('click', function(e) {
        toggleSelectAll(dualListbox, e.target,'select1','selectAll1');
    });

    dualListbox.elements.listGroup2.on('click', function(e) {
      toggleSelectAll(dualListbox, e.target,'select2','selectAll2');
    });

    dualListbox.elements.moveButton.on('click', function() {
      move(dualListbox);
    });

    dualListbox.elements.moveAllButton.on('click', function() {
      moveAll(dualListbox);
    });

    dualListbox.elements.removeButton.on('click', function() {
      remove(dualListbox);
    });

    dualListbox.elements.removeAllButton.on('click', function() {
      removeAll(dualListbox);
    });

    dualListbox.elements.filterInput1.on('change keyup', function() {
      filter(dualListbox, 1);
    });

    dualListbox.elements.filterInput2.on('change keyup', function() {
      filter(dualListbox, 2);
    });
  }

  BootstrapDualListbox.prototype = {

    init: function () {
      // Add custom HTML templates
      var elementsTemplateHtml = render_template(listContainer,{
          'available':this.settings.jsonList.availableElements,
          'selected':this.settings.jsonList.selectedElements
        },{
          'element':listElement,
          'title':listTitle
        });
      this.container = this.element.append(elementsTemplateHtml);

      // Cache the inner elements
      this.elements = {
        originalSelect: this.element,
        box1: $('.box1', this.container),
        box2: $('.box2', this.container),
        filterIcon1: $('.box1 .filter-icon', this.container),
        filterIcon2: $('.box2 .filter-icon', this.container),
        filterInput1: $('.box1 .filter', this.container),
        filterInput2: $('.box2 .filter', this.container),
        filterClear1: $('.box1 .show-all-icon', this.container),
        filterClear2: $('.box2 .show-all-icon', this.container),
        selectAll1: $('.box1 .select-all', this.container),
        selectAll2: $('.box2 .select-all', this.container),
        listGroup1: $('.box1 .list-group', this.container),
        listGroup2: $('.box2 .list-group', this.container),
        label1: $('.box1 .list-title', this.container),
        label2: $('.box2 .list-title', this.container),
        info1: $('.box1 .items-info', this.container),
        info2: $('.box2 .items-info', this.container),
        select1: $('.box1 .list-group', this.container),
        select2: $('.box2 .list-group', this.container),
        moveButton: $('.btn-group .move', this.container),
        removeButton: $('.btn-group .remove', this.container),
        moveAllButton: $('.btn-group .moveall', this.container),
        removeAllButton: $('.btn-group .removeall', this.container)
      };

        //Adds support for tooltips
        this.tooltipBox1 = new TooltipWidget({
            "elements": tooltipConfiguration.left,
            "container": this.elements.box1
        });
        this.tooltipBox2 = new TooltipWidget({
            "elements": tooltipConfiguration.right,
            "container": this.elements.box2
        });

      // Set select IDs
      this.originalSelectName = this.element.attr('name') || '';
      var select1Id = 'duallistbox-nonselected-list_' + this.originalSelectName,
        select2Id = 'duallistbox-selected-list_' + this.originalSelectName;
      this.elements.select1.attr('id', select1Id);
      this.elements.select2.attr('id', select2Id);
      this.elements.label1.attr('for', select1Id);
      this.elements.label2.attr('for', select2Id);

      // Apply all settings
      this.selectedElements = 0;
      this.elementCount = 0;
      this.setFilterTextClear(this.settings.filterTextClear);
      this.setFilterPlaceHolder(this.settings.filterPlaceHolder);
      this.setMoveSelectedLabel(this.settings.moveSelectedLabel);
      this.setMoveAllLabel(this.settings.moveAllLabel);
      this.setRemoveSelectedLabel(this.settings.removeSelectedLabel);
      this.setRemoveAllLabel(this.settings.removeAllLabel);
      this.setMoveOnSelect(this.settings.moveOnSelect);
      this.setPreserveSelectionOnMove(this.settings.preserveSelectionOnMove);
      this.setSelectedListLabel(this.settings.selectedListLabel);
      this.setNonSelectedListLabel(this.settings.nonSelectedListLabel);
      this.setHelperSelectNamePostfix(this.settings.helperSelectNamePostfix);
      this.setSelectOrMinimalHeight(this.settings.selectOrMinimalHeight);

      updateSelectionStates(this);

      this.setShowFilterInputs(this.settings.showFilterInputs);
      this.setNonSelectedFilter(this.settings.nonSelectedFilter);
      this.setSelectedFilter(this.settings.selectedFilter);
      this.setInfoText(this.settings.infoText + this.settings.infoTextEnd);
      this.setInfoTextFiltered(this.settings.infoTextFiltered + this.settings.infoTextEnd);
      this.setInfoTextEmpty(this.settings.infoTextEmpty + this.settings.infoTextEnd);
      this.setFilterOnValues(this.settings.filterOnValues);

      bindEvents(this);
      refreshSelects(this);

      return this.element;
    },
    setFilterTextClear: function(value, refresh) {
      this.settings.filterTextClear = value;
      this.elements.filterClear1.html(value);
      this.elements.filterClear2.html(value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterPlaceHolder: function(value, refresh) {
      this.settings.filterPlaceHolder = value;
      this.elements.filterInput1.attr('placeholder', value);
      this.elements.filterInput2.attr('placeholder', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveSelectedLabel: function(value, refresh) {
      this.settings.moveSelectedLabel = value;
      this.elements.moveButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveAllLabel: function(value, refresh) {
      this.settings.moveAllLabel = value;
      this.elements.moveAllButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setRemoveSelectedLabel: function(value, refresh) {
      this.settings.removeSelectedLabel = value;
      this.elements.removeButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setRemoveAllLabel: function(value, refresh) {
      this.settings.removeAllLabel = value;
      this.elements.removeAllButton.attr('title', value);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setMoveOnSelect: function(value, refresh) {
      this.settings.moveOnSelect = value;
      if (this.settings.moveOnSelect) {
        this.container.addClass('moveonselect');
        var self = this;
        this.elements.select1.on('change', function() {
          move(self);
        });
        this.elements.select2.on('change', function() {
          remove(self);
        });
      } else {
        this.container.removeClass('moveonselect');
        this.elements.select1.off('change');
        this.elements.select2.off('change');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setPreserveSelectionOnMove: function(value, refresh) {
      this.settings.preserveSelectionOnMove = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    getAvailableItems : function(){
        return getAvailableItems(this);
    },
    addAvailableItems: function(list){
      addAvailableItems(this, list);
    },
    setAvailableItems : function(list){
        setAvailableItems(this, list);
    },
    removeAvailableItems : function(list){
        return removeItems(this, list);
    },
    getSelectedItems : function(){
        return getSelectedItems(this);
    },
    addSelectedItems : function(list){
        addSelectedItems(this, list);
    },
    setSelectedItems : function(list){
        setSelectedItems(this, list);
    },
    removeSelectedItems : function(list){
        return removeItems(this, list);
    },
    setSelectedListLabel: function(value, refresh) {
      this.settings.selectedListLabel = value;
      if (value) {
        this.elements.label2.show().html(value);
      } else {
        this.elements.label2.hide().html(value);
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setNonSelectedListLabel: function(value, refresh) {
      this.settings.nonSelectedListLabel = value;
      if (value) {
        this.elements.label1.show().html(value);
      } else {
        this.elements.label1.hide().html(value);
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setHelperSelectNamePostfix: function(value, refresh) {
      this.settings.helperSelectNamePostfix = value;
      if (value) {
        this.elements.select1.attr('name', this.originalSelectName + value + '1');
        this.elements.select2.attr('name', this.originalSelectName + value + '2');
      } else {
        this.elements.select1.removeAttr('name');
        this.elements.select2.removeAttr('name');
      }
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setSelectOrMinimalHeight: function(value, refresh) {
      this.settings.selectOrMinimalHeight = value;
      var height = this.element.height();
      if (this.element.height() < value) {
        height = value;
      }
      this.elements.select1.height(height);
      this.elements.select2.height(height);
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setShowFilterInputs: function(value, refresh) {
      if (!value) {
        this.setNonSelectedFilter('');
        this.setSelectedFilter('');
        refreshSelects(this);
        this.elements.filterInput1.hide();
        this.elements.filterInput2.hide();
      } else {
        this.elements.filterInput1.show();
        this.elements.filterInput2.show();
      }
      this.settings.showFilterInputs = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setNonSelectedFilter: function(value, refresh) {
      if (this.settings.showFilterInputs) {
        this.settings.nonSelectedFilter = value;
        this.elements.filterInput1.val(value);
        if (refresh) {
          refreshSelects(this);
        }
        return this.element;
      }
    },
    setSelectedFilter: function(value, refresh) {
      if (this.settings.showFilterInputs) {
        this.settings.selectedFilter = value;
        this.elements.filterInput2.val(value);
        if (refresh) {
          refreshSelects(this);
        }
        return this.element;
      }
    },
    setInfoText: function(value, refresh) {
      this.settings.infoText = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setInfoTextFiltered: function(value, refresh) {
      this.settings.infoTextFiltered = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setInfoTextEmpty: function(value, refresh) {
      this.settings.infoTextEmpty = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    setFilterOnValues: function(value, refresh) {
      this.settings.filterOnValues = value;
      if (refresh) {
        refreshSelects(this);
      }
      return this.element;
    },
    getContainer: function() {
      return this.container;
    },
    refresh: function(mustClearSelections) {
      updateSelectionStates(this);

      if (!mustClearSelections) {
        saveSelections(this, 1);
        saveSelections(this, 2);
      } else {
        clearSelections(this);
      }

      refreshSelects(this);
    },
    destroy: function() {
      this.container.remove();
      this.element.show();
      $.data(this, 'plugin_' + pluginName, null);
      return this.element;
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function (options) {
    var args = arguments;

    // Is the first parameter an object (options), or was omitted, instantiate a new instance of the plugin.
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        // If this is not a select
        if (!$(this).is('select')) {
          $(this).find('select').each(function(index, item) {
            // For each nested select, instantiate the Dual List Box
            $(item).bootstrapDualListbox(options);
          });
        } else if (!$.data(this, 'plugin_' + pluginName)) {
          // Only allow the plugin to be instantiated once so we check that the element has no plugin instantiation yet

          // if it has no instance, create a new one, pass options to our plugin constructor,
          // and store the plugin instance in the elements jQuery data object.
          $.data(this, 'plugin_' + pluginName, new BootstrapDualListbox(this, options));
        }
      });
      // If the first parameter is a string and it doesn't start with an underscore or "contains" the `init`-function,
      // treat this as a call to a public method.
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      // Cache the method call to make it possible to return a value
      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        // Tests that there's already a plugin-instance and checks that the requested public method exists
        if (instance instanceof BootstrapDualListbox && typeof instance[options] === 'function') {
          // Call the method of our plugin instance, and pass it the supplied arguments.
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }
      });

      // If the earlier cached method gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }

  };

    return BootstrapDualListbox;
});
