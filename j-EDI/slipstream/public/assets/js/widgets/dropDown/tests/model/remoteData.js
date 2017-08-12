/**
 * Model that spawns mockjax instances for getting and setting data remotely. Dropdown Widget view example uses this to get remote data and to put new data.
 * The models uses an array of objects which is returned in response to ajax requests
 *
 * @module DropDown View
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */


define([
    'backbone',
    'mockjax'
    
], function(Backbone, mockjax) {

    var dropDownData = [
    {
        "id": "ftp",
        "text": "junos-ftp"
    },
    {
        "id": "tftp",
        "text": "junos-tftp"
    },
    {
        "id": "rtsp",
        "text": "junos-rtsp"
    },
    {
        "id": "netbios",
        "text": "junos-netbios-session"
    },
    {
        "id": "smb",
        "text": "junos-smb-session"
    },

    {
        "id": "esp",
        "text": "esp"
    },
    {
        "id": "ike",
        "text": "ike"
    },
    {
        "id": "ike_nat",
        "text": "ike_nat_traversal"
    },
    {
        "id": "tcp",
        "text": "tcp"
    },
    {
        "id": "ssh",
        "text": "ssh_state_synch"
    },
    {
        "id": "gre",
        "text": "gre"
    },
    {
        "id": "udp",
        "text": "udp"
    },
    {
        "id": "pptp",
        "text": "pptp"
    },
    {
        "id": "junos_ssh",
        "text": "junos-ssh"
    },
    {
        "id": "junos_telnet",
        "text": "junos-telnet"
    },
    {
        "id": "junos_smtp",
        "text": "junos-smtp"
    },
    {
        "id": "junos_tacacs",
        "text": "junos-tacacs"
    },
    {
        "id": "junos_tacacs_ds",
        "text": "junos-tacacs-ds"
    }
];
    
    var remoteCall = Backbone.Model.extend({
        initialize: function (){            

            $.mockjax({
                url: '/api/dropdown/getRemoteData',
                dataType: 'json',
                responseTime: 700,
                responseText: {
                    data: dropDownData
                }
            });

            $.mockjax({
                url: '/api/dropdown/updateData',
                dataType: 'jsonp',
                responseTime: 100,
                response: function (settings) {
                    dropDownData.push(settings.data);                    
                }
            });

        } 
    });

    return remoteCall;

});