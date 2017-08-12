/**
 * Sample test data to Dropdown unit test cases for local & remote calls
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {
    var sampleData = {};

    sampleData.confData = [
        {
            "id": "ftp",
            "text": "junos-ftp"
        },
        {
            "id": "tftp",
            "text": "junos-tftp",
            "disabled": true
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
            "text": "junos-smb-session",
            "selected": true
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

    sampleData.searchData = [
        {
            "id": "data1",
            "text": "searchData1"
        },
        {
            "id": "data2",
            "text": "searchData2"
        },
        {
            "id": "data3",
            "text": "searchData3"
        }
    ];

    sampleData.noTextField = [
        {
            "id": "ftpnew",
            //"text": "junos-ftp-new",
            "name": "junos-ftp-new"
        },
        {
            "id": "tftpnew",
            //"text": "junos-tftp-new",
            "name": "junos-tftp-new"
        }
    ];

    sampleData.testConfigData = [
        {
            "id": "12340",
            "text": "text1"
        },
        {
            "id": "12341",
            "text": "text2"
        },
        {
            "id": "12342",
            "text": "text3"
        },
        {
            "id": "12343",
            "text": "text4"
        }
    ];

    sampleData.addTestData = [
        {
            "id": "newData1",
            "text": "new-data-value-1"
        },
        {
            "id": "newData2",
            "text": "new-data-value-2"
        }
    ];

    return sampleData
});
