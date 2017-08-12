define(['sdk/analytics'], function(Analytics) {
	describe('Analytics Tests', function() {
      
      describe('Validate SDK interface', function() {
          it('All SDK tracking methods should exist', function() {
              assert.isFunction(Analytics.trackEvent);
              assert.isFunction(Analytics.trackLink);
              assert.isFunction(Analytics.trackContentImpressionsWithinNode);
              assert.isFunction(Analytics.trackContentImpression);
              assert.isFunction(Analytics.trackContentInteractionNode);
              assert.isFunction(Analytics.trackContentInteraction);
              assert.isFunction(Analytics.addListener);
              assert.isFunction(Analytics.trackSearch);
              assert.isFunction(Analytics.setUserId);
          });
      }); 

      describe('Ensure that SDK methods trigger the correct events', function() { 
          Slipstream.commands.setHandler("analytics_provider:trackEvent", function(category, action, name, value) {
              it('trackEvent event should be triggered with correct arguments', function() {
                  assert.equal(category, "1");
                  assert.equal(action, "2");
                  assert.equal(name, "3");
                  assert.equal(value, "4");
              });
          });
          Analytics.trackEvent("1", "2", "3", "4");

          Slipstream.commands.setHandler("analytics_provider:trackLink", function(url, urlType) {
              it('trackLink event should be triggered with correct arguments', function() {
                  assert.equal(url, "/foobar");
                  assert.equal(urlType, "link")
              });
          });
          Analytics.trackLink("/foobar", "link");

          Slipstream.commands.setHandler("analytics_provider:setUserId", function(userid) {
              it('setUserId event should be triggered with correct arguments', function() {
                  assert.equal(userid, "super");
              });
          });
          Analytics.setUserId("super");

          Slipstream.commands.setHandler("analytics_provider:trackContentImpressionsWithinNode", function(domNode) {
              if (domNode instanceof $) {
                it('trackContentImpressionsWithinNode event should be triggered with correct arguments', function() { 
                    assert.equal(domNode.attr("id"), "foo");
                });
              }
          });
          Analytics.trackContentImpressionsWithinNode($("<span id='foo'>"));

          Slipstream.commands.setHandler("analytics_provider:trackContentImpression", function(contentName, contentPiece, contentTarget) {
              it('trackContentImpression event should be triggered with correct arguments', function() {
                  assert.equal(contentName, "foo");
                  assert.equal(contentPiece, "bar");
                  assert.equal(contentTarget, "/foobar");
              });
          });
          Analytics.trackContentImpression("foo", "bar", "/foobar");

          Slipstream.commands.setHandler("analytics_provider:trackContentInteractionNode", function(domNode, contentInteraction) {
              it('trackContentInteractionNode event should be triggered with correct arguments', function() {
                  assert.equal(domNode.attr("id"), "foo");
                  assert.equal(contentInteraction, "click");
              });
          });
          Analytics.trackContentInteractionNode($("<div id='foo'>"), "click");

          Slipstream.commands.setHandler("analytics_provider:trackContentInteraction", function(contentInteraction, contentName, contentPiece, contentTarget) {
              it('trackContentInteraction event should be triggered with correct arguments', function() {
                  assert.equal(contentInteraction, "click");
                  assert.equal(contentName, "foo");
                  assert.equal(contentPiece, "bar");
                  assert.equal(contentTarget, "/foobar");
              });
          });
          Analytics.trackContentInteraction("click", "foo", "bar", "/foobar");

          Slipstream.commands.setHandler("analytics_provider:addListener", function(element) {
              it('addListener event should be triggered with correct arguments', function() {
                  assert.equal(element.attr("href"), "/foo");
              });
          });
          Analytics.addListener($("<a href='/foo'/>"));

          Slipstream.commands.setHandler("analytics_provider:trackSearch", function(query, category, resultCount) {
              it('trackSearch event should be triggered with correct arguments', function() {
                  assert.equal(query, "foo AND bar");
                  assert.equal(category, "global");
                  assert.equal(resultCount, 5);
              });
          });
          Analytics.trackSearch("foo AND bar", "global", 5);


      });
	});
});