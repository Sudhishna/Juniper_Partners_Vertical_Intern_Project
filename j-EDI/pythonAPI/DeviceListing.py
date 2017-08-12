#!/usr/bin/env python

# Turn on debug mode.
import pycurl
import cgitb
import StringIO
import subprocess
import json
cgitb.enable()


# Execute the required curl command to fetch the list of minions
targets = "*"
post_data2 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local_async","tgt":"*","fun":"junos.ping"}]'
response2 = StringIO.StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://localhost:8001')
c.setopt(c.CUSTOMREQUEST, "POST")
c.setopt(c.POSTFIELDS, post_data2)
c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
c.setopt(c.WRITEDATA, response2)
c.perform()
c.close()

# Print necessary headers for python output to be displayed in a browser
print "Access-Control-Allow-Origin: *"
print "Access-Control-Expose-Headers: Access-Control-Allow-Origin"
print "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
print "Content-Type: text/html\n"

# Fetch the output and formulate them in the required JSON format
deviceList = response2.getvalue()
json_obj2 = json.loads(deviceList)
devices = json_obj2['return'][0]["minions"]

print "{\"devices\":["
for index,device in enumerate(devices):
    if "Minion" not in device:
        if index==0:
            print "{"
        else:
            print ",{"
        print "\"device\":\"%s\"" % (device)
        print "}"
print "]}"

response2.close()


