#!/usr/bin/env python

# Imports
import pycurl
import cgitb
import StringIO
import subprocess
import json
cgitb.enable()

# Execute the curl command to fetch the list of minions in the Salt Stack
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

# Execute the curl command to fetch the status of the minions in the Salt Stack
targets = "*"
post_data1 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":\"%s\","fun":"junos.ping"}]' % (targets)
response1 = StringIO.StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://localhost:8001')
c.setopt(c.CUSTOMREQUEST, "POST")
c.setopt(c.POSTFIELDS, post_data1)
c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
c.setopt(c.WRITEDATA, response1)
c.perform()
c.close()

# Print necessary headers.
print "Access-Control-Allow-Origin: *"
print "Access-Control-Expose-Headers: Access-Control-Allow-Origin"
print "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
print "Content-Type: text/html\n"

# Extract the minions list from the curl execution
deviceList = response2.getvalue()
json_obj2 = json.loads(deviceList)
devices = json_obj2['return'][0]["minions"]

# Extract the status of the minions from the curl execution
deviceStatuses = response1.getvalue()
json_obj1 = json.loads(deviceStatuses)
Statuses = json_obj1['return'][0]

# For each device fetch the outputs and formulate them in the required JSON format
print "{\"devices\":["
for index,device in enumerate(devices):
    if "Minion" in device:
        print "" 
    else:
        if device not in Statuses:
            if index==0:
                print "{" 
            else:
                print ",{" 
            devIp = device.split("_", 1)[1]
            ip = devIp.replace("_", ".")
		# model hostname
            print "\"device\":\"%s\",\"ip\":\"%s\",\"status\":\"False\",\"version\":\"Null\",\"sno\":\"Null\"" % (device,ip)
            print "}"
        else:
            status = json_obj1['return'][0][device]
            if "message" in status:
                deviceStatus = json_obj1['return'][0][device]["message"]
                if deviceStatus is True:
                    post_data3 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":\"%s\","fun":"junos.facts"}]' % (device)
                    response3 = StringIO.StringIO()
                    c = pycurl.Curl()
                    c.setopt(c.URL, 'http://localhost:8001')
                    c.setopt(c.CUSTOMREQUEST, "POST")
                    c.setopt(c.POSTFIELDS, post_data3)
                    c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
                    c.setopt(c.WRITEDATA, response3)
                    c.perform()
                    c.close()
                    deviceVersion = response3.getvalue()
                    json_obj3 = json.loads(deviceVersion)
                    devIp = device.split("_", 1)[1]
                    ip = devIp.replace("_", ".")
                    version = json_obj3["return"][0][device]["message"]
                    json_obj4 = json.loads(version)
                    ver = json_obj4["version"]
                    sno = json_obj4["serialnumber"]
                    if index==0:
                        print "{"
                    else:
                        print ",{"
                    print "\"device\":\"%s\",\"ip\":\"%s\",\"status\":\"True\",\"version\":\"%s\",\"sno\":\"%s\"" % (device,ip,ver,sno)
                    print "}"
                    response3.close()
print "]}"


response1.close()
response2.close()


