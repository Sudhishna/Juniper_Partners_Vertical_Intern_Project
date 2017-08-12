#!/usr/bin/env python

# Turn on debug mode.
import pycurl
import cgitb
import StringIO
import subprocess
import json
cgitb.enable()

targets = "*"
post_data1 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":\"%s\","fun":"junos.ping"}]' % (targets)
post_data2 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local_async","tgt":"*","fun":"junos.ping"}]'

response1 = StringIO.StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://localhost:8001')
c.setopt(c.CUSTOMREQUEST, "POST")
c.setopt(c.POSTFIELDS, post_data1)
c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
c.setopt(c.WRITEDATA, response1)
c.perform()
c.close()

response2 = StringIO.StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://localhost:8001')
c.setopt(c.CUSTOMREQUEST, "POST")
c.setopt(c.POSTFIELDS, post_data2)
c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
c.setopt(c.WRITEDATA, response2)
c.perform()
c.close()

# Print necessary headers.
print "Access-Control-Allow-Origin: *"
print "Access-Control-Expose-Headers: Access-Control-Allow-Origin"
print "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
print "Content-Type: text/html\n"

deviceStatuses = response1.getvalue()
json_obj1 = json.loads(deviceStatuses)
Statuses = json_obj1['return'][0]

deviceList = response2.getvalue()
json_obj2 = json.loads(deviceList)
devices = json_obj2['return'][0]["minions"]

devicesUp = 0
devicesDown = 0

for index,device in enumerate(devices):
    if device not in Statuses:
	devicesDown += 1
    else:
        status = json_obj1['return'][0][device]
        if "message" in status:
            deviceStatus = json_obj1['return'][0][device]["message"]
            if deviceStatus is True:
		devicesUp += 1
	    else:
		devicesDown += 1

print "{\"DevicesUp\":\"%s\",\"DevicesDown\":\"%s\"}" % (devicesUp,devicesDown)

response1.close()
response2.close()

