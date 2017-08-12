define(function() {
	describe('i18n Unit tests:', function() {
		describe('English version', function() {
	        Slipstream.commands.execute("nls:loadBundle", {
	            ctx_name: 'unit_test',
	            ctx_root: 'i18n'
	        });
				
			it('message should be fetched correctly with no substitution values', function() {
				var msg = Slipstream.request("nls:retrieve", "unit_test.msg_with_no_subs");
				assert.equal(msg, 'A message with no substitution values');
			});

			it('fetch of message without substitution values should ignore sub values', function() {
				var msg = Slipstream.request("nls:retrieve", "unit_test.msg_with_no_subs", ["ignore me"]);
				assert.equal(msg, 'A message with no substitution values');
			});

			it('message should be fetched correctly and a substitution value included', function() {
				var msg = Slipstream.request("nls:retrieve", {
					msg: "unit_test.msg_with_sub", 
					sub_values: ["substitution"]
				});
				assert.equal(msg, 'A message with a substitution value');
			});

			it('message should be fetched correctly and multiple substitution values included', function() {
				var msg = Slipstream.request("nls:retrieve", {
					msg: "unit_test.msg_with_multiple_subs", 
					sub_values: ["more", "than", "one"]
				});
				assert.equal(msg, 'A message with more than one substitution value');
			});
		});

		describe('French version', function() {
	        Slipstream.commands.execute("nls:loadBundle", {
	            ctx_name: 'unit_test_fr',
	            ctx_root: 'i18n',
	            ctx_lang: 'fr'
	        });
				
			it('message should be fetched correctly with no substitution values', function() {
				var msg = Slipstream.request("nls:retrieve", "unit_test_fr.msg_with_no_subs");
				assert.equal(msg, 'Un message sans valeurs de substitution');
			});

			it('fetch of message without substitution values should ignore sub values', function() {
				var msg = Slipstream.request("nls:retrieve", "unit_test_fr.msg_with_no_subs", ["ignore me"]);
				assert.equal(msg, 'Un message sans valeurs de substitution');
			});

			it('message should be fetched correctly and a substitution value included', function() {
				var msg = Slipstream.request("nls:retrieve", {
					msg: "unit_test_fr.msg_with_sub", 
					sub_values: ["substitution"]
				});
				assert.equal(msg, 'Un message avec une substitution valeur');
			});

			it('message should be fetched correctly and multiple substitution values included', function() {
				var msg = Slipstream.request("nls:retrieve", {
					msg: "unit_test_fr.msg_with_multiple_subs", 
					sub_values: ["more", "than", "one"]
				});
				assert.equal(msg, 'Un message avec more than one valeur de substitution');
			});
		});
	
		describe('Spanish version', function() {
	        Slipstream.commands.execute("nls:loadBundle", {
	            ctx_name: 'unit_test_es',
	            ctx_root: 'i18n',
	            ctx_lang: 'es'
	        });
				
			it('message should be fetched correctly with no substitution values', function() {
				var msg = Slipstream.request("nls:retrieve", "unit_test_es.msg_with_no_subs");
				assert.equal(msg, 'Un mensaje sin ningun valor de sustitucion');
			});

			it('fetch of message without substitution values should ignore sub values', function() {
				var msg = Slipstream.request("nls:retrieve", "unit_test_es.msg_with_no_subs", ["ignore me"]);
				assert.equal(msg, 'Un mensaje sin ningun valor de sustitucion');
			});

			it('message should be fetched correctly and a substitution value included', function() {
				var msg = Slipstream.request("nls:retrieve", {
					msg: "unit_test_es.msg_with_sub", 
					sub_values: ["substitution"]
				});
				assert.equal(msg, 'Un mensaje con una substitution valor');
			});

			it('message should be fetched correctly and multiple substitution values included', function() {
				var msg = Slipstream.request("nls:retrieve", {
					msg: "unit_test_es.msg_with_multiple_subs", 
					sub_values: ["more", "than", "one"]
				});
				assert.equal(msg, 'Un mensaje con more than one valor de sustitucion');
			});
		});
	});
});