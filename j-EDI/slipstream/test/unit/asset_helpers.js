var config = {
    plugins_base: "base",
    context: {
        name: "unit-test"
    },
    asset_host: "http://cdn.juniper.net:8080"
},

helpers = require('../../modules/hogan_asset_helpers')(config),
hogan = require('hogan.js'), 
assert = require('assert');

describe('asset_helpers', function() {
    describe('asset_img_path_unqualified', function() {
        var template;
        it('should produce a fully-resolved path, absolute', function() { 
            template = "{{#img_path}}foo.jpg{{/img_path}}";    
            var data = hogan.compile(template).render(helpers);
            assert.equal(data, "/base/unit-test/img/foo.jpg");
        });
        it('should produce a fully-resolved path, relative', function() {   
            template = "{{#img_path}}../foo.jpg{{/img_path}}";  
            var data = hogan.compile(template).render(helpers);
            assert.equal(data, "/base/unit-test/img/../foo.jpg");
        });
    });

    describe('asset_img_path_qualified', function() {
        var template = "{{#img_path}}/foo.jpg{{/img_path}}";
        it('should pass through the original path', function() {     
            var data = hogan.compile(template).render(helpers);
            assert.equal(data, "/foo.jpg");
        });
    });

    describe('asset_img_url_unqualified', function() {
        var template = "{{#img_url}}foo.jpg{{/img_url}}";
        it('should produce a fully resolved url', function() {     
            var data = hogan.compile(template).render(helpers);
            assert.equal(data, "http://cdn.juniper.net:8080/base/unit-test/img/foo.jpg");
        });
    });

    describe('asset_img_url_qualified', function() {
        var template = "{{#img_url}}http://localhost:3000/foo.jpg{{/img_url}}";
        it('should pass through original qualified url', function() {     
            var data = hogan.compile(template).render(helpers);
            assert.equal(data, "http://localhost:3000/foo.jpg");
        });
    });
});