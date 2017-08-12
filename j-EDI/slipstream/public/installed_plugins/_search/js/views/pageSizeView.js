/** 
 * A module that implements a view for displaying and modifying the
 * query result page size.
 *
 * @module Slipstream/PageSizeView
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(["widgets/dropDown/dropDownWidget", 
        "lib/template_renderer/template_renderer", 
        "text!../../templates/pageSize.tpl"], function(DropDown, template_renderer, pageSizeTemplate) {

	var PageSizeView = Marionette.ItemView.extend({
        initialize: function(options) {
            this.context = options.context;
        },
        render: function() {
            var self = this;
            var $pagesizeEl = $(template_renderer(pageSizeTemplate, {
                pagesize_dropdown_label: this.context.getMessage("pagesize_dropdown_label"),
                pagesize_10: this.context.getMessage("pagesize_10"),
                pagesize_15: this.context.getMessage("pagesize_15"),
                pagesize_20: this.context.getMessage("pagesize_20"),
                pagesize_25: this.context.getMessage("pagesize_25")
            }));

            var pageSizeContainer = $pagesizeEl.find("select.pageSize")[0];

            var pageSizeDropDown = new DropDown({
                container: pageSizeContainer,
                initValue: {
                    id: self.model.get("pageSize"), 
                    text: self.context.getMessage("pagesize_" + self.model.get("pageSize"))
                },
                onChange: function(e) {
                    var newPageSize = parseInt($(this).val());
                    self.model.set({pageSize: newPageSize});
                    e.stopPropagation();
                }
            });
            
            pageSizeDropDown.build();
            this.$el.append($pagesizeEl);
        }
    });

    return PageSizeView;
});