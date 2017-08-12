/**
 * Add pagination for the grid widget
 *
 * @module Pagination
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    "widgets/dropDown/dropDownWidget",
    "../conf/rowsNumConfiguration"
],
    function(DropDownWidget, RowsNum) {

    /**
     * Pagination constructor
     *
     * @constructor
     * @class Pagination - Add pagination feature to the grid
     *
     * @param {Object} conf - User configuration object
     * @returns {Object} Current Pagination's object: this
     */
    var Pagination = function(conf){
        var paginationContainer, currentPage, gridTable, dropDown;

        /**
         * Adds support for pagination
         * @param {Object} $table - jQuery object with the table that will have pagination
         */
        this.buildPagination = function (gridContainer, grid, loadPage, addTreeChildren){
            paginationContainer = paginationContainer || gridContainer.find('.paginationContainer');
            currentPage = currentPage || paginationContainer.find('.currentPage');
            gridTable = grid;

            var btnNext = paginationContainer.find(".next"), 
                btnPrev = paginationContainer.find(".prev"),
                pageCount = paginationContainer.find('.pageCount'),
                numRows = conf.elements.numberOfRows || 50;
            
            dropDown = new DropDownWidget({
                container: paginationContainer.find('.selection_data'),
                data: RowsNum,
                onChange: function(e) {
                    var rowNum = this.value.split("-");
                    displayPage(loadPage, 1, rowNum[1], addTreeChildren);
                }
            }).build();

            $.each(RowsNum, function(k, row){
                var rowNum = row['id'].split("-");
                (parseInt(rowNum[1], 10) === parseInt(numRows, 10)) && dropDown.setValue("num-" + conf.elements.numberOfRows);
            });

            btnNext.on("click", function(e){
                var page = getCurrentPage();
                displayPage(loadPage, page + 1, null, addTreeChildren);
            });

            btnPrev.on("click", function(e){
                var page = getCurrentPage();
                displayPage(loadPage, page - 1, null, addTreeChildren);
            });

            pageCount.on("click", function(e){
                var numPages = getNumPages();
                displayPage(loadPage, numPages, null, addTreeChildren);
            });

            currentPage.on('keyup', function (e) {
                var key = e.which;

                if (key === 13){
                    var page = getCurrentPage(),
                        numPages = getNumPages();

                    page = (numPages >= page) ? page: numPages;
                    displayPage(loadPage, page, null, addTreeChildren);
                }
            });  
        };

        this.updatePagination = function(data){
            updatePages(data);
        };

        this.getNumRows = function(){
            if (dropDown){
                var rowNum = dropDown.getValue().split("-");
                return rowNum[1];
            }
            return conf.elements.numberOfRows;
        };

        var displayPage = function(loadPage, page, rowNum, addTreeChildren){
            if (paginationContainer){
                var numPages = getNumPages();

                var successCallBack = function(data){

                    if (gridTable){
                        var gridParam = gridTable.getGridParam("postData"),
                            numberOfRows = rowNum? rowNum :gridParam.rows,
                            records = conf.elements.jsonRecords? conf.elements.jsonRecords(data) : 0,
                            numPages = (records === 0)? 1: Math.ceil(records/numberOfRows);

                        gridTable.jqGrid('clearGridData');
                        data['total'] = numPages;
                        data['page'] = page;
                        addTreeChildren(data);
                        updatePages(data);
                    } 
                };
                numPages >= page && page > 0 && loadPage(page, rowNum, successCallBack);
            }
        },

        getCurrentPage = function(){
            if (currentPage){
                return parseInt(currentPage.val(), 10);
            }
            return 1;
        },

        getNumPages = function(){
            if (paginationContainer){
                return parseInt(paginationContainer.find('.pageCount').text(), 10);
            }
            return 1;
        },

        updatePages = function(data){
            if (paginationContainer){
                var btnNextIcon = paginationContainer.find('.next span'),
                    btnPrevIcon = paginationContainer.find('.prev span');

                paginationContainer.find('.pageCount').html(data['total']);
                currentPage && currentPage.val(data['page']);

                if (data['total'] === data['page']){
                    disableIcon(btnNextIcon);
                }else{
                    enableIcon(btnNextIcon);
                }

                if(data['page'] === 1){
                    disableIcon(btnPrevIcon);
                }else{
                    enableIcon(btnPrevIcon);
                }

                if (data['total'] === 1){
                    disableIcon(btnPrevIcon);
                    disableIcon(btnNextIcon);
                }
            }
        },

        disableIcon = function(icon){
            icon.removeClass("icon_nav_big_arrow_right_gray").addClass("icon_nav_big_arrow_right_disable");
        }, 

        enableIcon = function(icon){
            icon.removeClass("icon_nav_big_arrow_right_disable").addClass("icon_nav_big_arrow_right_gray");
        };
    };

    return Pagination;
});