#!/usr/bin/env python

import pycurl
import cgi
import cgitb
import StringIO
import json
import sys
cgitb.enable()

form = cgi.FieldStorage()
devicesList = form.getvalue('devices')
command = form.getvalue('command')
 
# Print necessary headers.
print "Access-Control-Allow-Origin: *"
print "Access-Control-Expose-Headers: Access-Control-Allow-Origin"
print "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
print "Content-Type: text/html\n"

devicesList = devicesList.split(",")

print "{\"CliOutput\":["
for index,device in enumerate(devicesList):
    post_data1 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":\"%s\","fun":"junos.cli","arg":[\"%s\"]}]' % (device,command)

    response = StringIO.StringIO()
    c = pycurl.Curl()
    c.setopt(c.URL, 'http://localhost:8001')
    c.setopt(c.CUSTOMREQUEST, "POST")
    c.setopt(c.POSTFIELDS, post_data1)
    c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
    c.setopt(c.WRITEDATA, response)
    c.perform()
    c.close()

    data = response.getvalue()

    if device not in data:
        if index==0:
            print "{"
        else:
            print ",{"
        print "\"device\":\"%s\",\"command\":\"%s\",\"output\":\"Null\"" % (device,command)
        print "}"
    else:
        json_obj = json.loads(data)
        json_data = json_obj['return'][0][device]
        cliMessage = json_data["message"]
	cliOutput = cliMessage.replace('\n', '<br>')

        if index==0:
            print "{"
        else:
            print ",{"
        print "\"device\":\"%s\",\"command\":\"%s\",\"output\":\"%s\"" % (device,command,cliOutput)
        print "}"

    response.close()
print "]}"
