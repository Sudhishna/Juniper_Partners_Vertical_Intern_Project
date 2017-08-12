define([
    "jquery", 
    "Slipstream", 
    "sdk/URI", 
    "marionette", 
    "text!../../assets/js/apps/ui/show/templates/full_chrome.tpl", 
    "text!../../assets/js/apps/ui/show/templates/global_search.tpl"], 
function($, Slipstream, URI, Marionette, chromeTemplate, globalSearchTemplate) {
    describe('Global Search Unit Tests', function() {
        var checkSearchInDom = function(hasSearch){
            var html = Marionette.Renderer.render(chromeTemplate, {
                    search: "chrome_header_search",
                    advanced: "chrome_header_advanced",
                    globalSearch: hasSearch,
                    global_search_placeholder: "global_search_placeholder",
                    logo_link: "/mainui",
                    logo_src: "/assets/images/icon_logoSD.svg",
                    logo_width: "144px",
                    logo_height: "24px",
                    global_help_id: '#cshid=1035'
                },{
                    globalSearchContainer: globalSearchTemplate
                });

            if ($(html).find(".search-section").length){
                assert(hasSearch == true, "searchProvider is discovered");
            }else{
                assert(hasSearch == false, "searchProvider is not discovered");
            }
        };

        it('searchProvider is discovered', function() {
            
            var provider = {
                "name": "search",
                "description": "Search provider",
                "publisher": "Juniper Networks, Inc.",
                "version": "0.0.1",
                "release_date": "02.24.2015",
                "min_platform_version": "0.0.1",
                "providers": [
                    {
                        "uri": "search://",
                        "module": "searchProvider"
                    }
                ],
                "module": "searchProvider",
                "context": "unit_test_plugin",
                "uri": new URI("search://")
            };

            Slipstream.vent.on("search_provider:discovered", function(provider) {
                checkSearchInDom(true);                
            });

            Slipstream.vent.trigger("search_provider:discovered", provider);   
        });
        it('searchProvider is not discovered', function() {  
            checkSearchInDom(false);
        });
    });
});