define([
    'widgets/tree/treeWidget', 
    'backbone'
], function(TreeWidget, Backbone) {
    describe('Tree Widget - Unit tests:', function() {
        describe('Tree Widget', function() {

            var treeObj = null;
            var selectCallbackCalled = false;
            var deselectCallbackCalled = false;
            var expandCallbackCalled = false;
            var collapseCallbackCalled = false;
            var $el = $('#test_widget');
            var el = $el[0];
            var multiselect = false;
            var onLoad = function() {};
            var treeData = {
                id: 1,
                text: "global",
                children: [
                    {
                        id: 2,
                        text: "orpheus",
                        children: [
                            {
                                id: 3,
                                text: "orpheus-dev"
                            },
                            {
                                id: 4,
                                text: "orpheus-qa"
                            }
                        ]
                    },
                    {
                        id: 5,
                        text: "argon"
                    },
                    {
                        id: 6,
                        text: "oban"
                    }
                ]
            };

            function createTree(config) {
                $el.empty();

                if (!config) {
                    treeObj = new TreeWidget({
                        container: el,
                        multiselect: multiselect,
                        data: treeData,
                        onSelect: function(selections) {
                            selectCallbackCalled = true;
                        },
                        onDeselect: function() {
                            deselectCallbackCalled = true;
                        },
                        onExpand: function() {
                            expandCallbackCalled = true;
                        },
                        onCollapse: function() {
                            collapseCallbackCalled = true;
                        },
                        onLoad: onLoad
                    });

                    return;
                }

                treeObj = new TreeWidget(config);
            }

            function reset() {
                treeObj = null;
                selectCallbackCalled = false;
                deselectCallbackCalled = false;
                expandCallbackCalled = false;
                collapseCallbackCalled = false;
                multiselect = false;
                onLoad = function() {};
            }

            beforeEach(function(){
                createTree();
            });

            afterEach(function(){
                reset();
            });

            it('After instantiating, the Tree Widget should exist', function() {
                treeObj.should.exist;
            });

            it('build must be a function', function() {
                assert.isFunction(treeObj.build, 'The tree widget instance must have a function named build.');
            });

            it('destroy must be a function', function() {
                assert.isFunction(treeObj.destroy, 'The tree widget instance must have a function named destroy.');
            });

            it('build() should return a tree instance', function() {
                var el = treeObj.build();
                assert.isTrue(el === treeObj, 'Tree widget build return value should be tree object.');
            });

            it('select should result in onSelect callback being called', function(done) {
                onLoad = function() {
                    assert.isTrue(selectCallbackCalled === false);
                    treeObj.selectNode('3');
                    assert.isTrue(selectCallbackCalled === true);

                    done();
                }

                createTree();
                treeObj.build();
            });

            it('deselect should result in onDeselect callback being called', function(done) {
                onLoad = function() {
                    treeObj.selectNode('3');
                    assert.isTrue(deselectCallbackCalled === false);
                    treeObj.deselectNode('3');
                    assert.isTrue(deselectCallbackCalled === true);

                    done();
                }

                createTree();
                treeObj.build();
            });

            it('expand should result in onExpand callback being called', function(done) {
                onLoad = function() {
                    assert.isTrue(expandCallbackCalled === false);
                    treeObj.expandNode('1');
                    assert.isTrue(expandCallbackCalled === true);

                    done();
                }

                createTree();
                treeObj.build();                    
            });

            it('collapse should result in onCollapse callback being called', function(done) {

                onLoad = function() {
                    treeObj.expandNode('1');
                    assert.isTrue(collapseCallbackCalled === false);
                    treeObj.collapseNode('1');
                    assert.isTrue(collapseCallbackCalled === true);

                    done();
                }

                createTree();
                treeObj.build();                    
            });

            it('addNode should result in a node that can be selected', function(done) {
                onLoad = function() {
                    // Confirm node with id 7 does not exist yet
                    var node = treeObj.getNode("7");
                    assert.isTrue(node == false);

                    // Add node with id 7 and confirm it exists now
                    treeObj.addNode("1", {id: "7", text: "Sample"});
                    node = treeObj.getNode("7");
                    assert.isTrue(node.id == "7");

                    done();
                }

                createTree();
                treeObj.build();                    
            });

            it('deleteNode should remove the node from the tree', function(done) {
                onLoad = function() {
                    // Confirm node with id 6 exists
                    var node = treeObj.getNode("6");
                    assert.isTrue(node.id == "6");
                    
                    // Remove the node and then confirm it is gone
                    treeObj.deleteNode("6");
                    node = treeObj.getNode("6");
                    assert.isTrue(node == false);

                    done();
                }

                createTree();
                treeObj.build();
            });

        });
    });
});
