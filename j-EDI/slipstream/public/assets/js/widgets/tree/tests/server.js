/**
 * Mock server side events for tree widget sample
 *
 * @module Server
 * @author Brian Duncan <bduncan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'mockjax'
], function() {

    var Server = {
        start : function() {
            // Mock collection response
            $.mockjax({
                url: '/api/space/domain-management/domains',
                dataType: 'json',
                response: function(settings) {
                    this.responseText = {
                        "domain": {
                            "@uri": "/api/space/domain-management/domains",
                            "@href": "/api/space/domain-management/domains/2",
                            "write-enabled": true,
                            "id": 2,
                            "child-count": 2,
                            "parent": {
                                "@href": "/api/space/domain-management/domains/1",
                                "id": 1,
                                "name": "SYSTEM"
                            },
                            "name": "Global",
                            "children": {
                                "@uri": "/api/space/domain-management/domains/children",
                                "domain": [
                                    {
                                        "@href": "/api/space/domain-management/domains/1017052",
                                        "@uri": "/api/space/domain-management/domains/children/1017052",
                                        "child-count": 0,
                                        "write-enabled": true,
                                        "id": 1017052,
                                        "name": "csp",
                                        "child-lock": true
                                    },
                                    {
                                        "@href": "/api/space/domain-management/domains/1016310",
                                        "@uri": "/api/space/domain-management/domains/children/1016310",
                                        "child-count": 2,
                                        "write-enabled": true,
                                        "id": 1016310,
                                        "name": "orpheus",
                                        "child-lock": true
                                    }
                                ]
                            },
                            "child-lock": true,
                            "users": {
                                "@href": "/api/space/domain-management/domains/2/users"
                            },
                            "profiles": {
                                "@href": "/api/space/domain-management/domains/2/profiles"
                            },
                            "devices": {
                                "@href": "/api/space/domain-management/domains/2/devices"
                            }
                        }
                    }
                },
                responseTime: 10
            });

            // Mock item response
            $.mockjax({
                url: '/api/space/domain-management/domains/1016310',
                dataType: 'json',
                response: function(settings) {
                    this.responseText = {
                        "domain": {
                            "@href": "/api/space/domain-management/domains/1016310",
                            "@uri": "/api/space/domain-management/domains/children/1016310",
                            "child-count": 2,
                            "write-enabled": true,
                            "id": 1016310,
                            "name": "orpheus",
                            "child-lock": true,
                            "children": {
                                "@uri": "/api/space/domain-management/domains/children",
                                "domain": [
                                    {
                                        "@href": "/api/space/domain-management/domains/91017052",
                                        "@uri": "/api/space/domain-management/domains/children/91017052",
                                        "child-count": 0,
                                        "write-enabled": true,
                                        "id": 91017052,
                                        "name": "orpheus-dev",
                                        "child-lock": true
                                    },
                                    {
                                        "@href": "/api/space/domain-management/domains/91016310",
                                        "@uri": "/api/space/domain-management/domains/children/91016310",
                                        "child-count": 0,
                                        "write-enabled": true,
                                        "id": 91016310,
                                        "name": "orpheus-qa",
                                        "child-lock": true
                                    }
                                ]
                            },
                            "users": {
                                "@href": "/api/space/domain-management/domains/1016310/users"
                            },
                            "profiles": {
                                "@href": "/api/space/domain-management/domains/1016310/profiles"
                            },
                            "devices": {
                                "@href": "/api/space/domain-management/domains/1016310/devices"
                            }
                        }
                    }
                },
                responseTime: 10
            });
        }
    };

    return Server;
});