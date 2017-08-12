#!/usr/bin/env python

# Turn on debug mode.
import pycurl
import cgitb
import StringIO
import subprocess
import json
cgitb.enable()

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

# Print necessary headers.
print "Access-Control-Allow-Origin: *"
print "Access-Control-Expose-Headers: Access-Control-Allow-Origin"
print "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
print "Content-Type: text/html\n"

deviceList = response2.getvalue()
json_obj2 = json.loads(deviceList)
devices = json_obj2['return'][0]["minions"]

exCount = 0
srxCount = 0
mxCount = 0
vmxCount = 0
vsrxCount = 0

for index,device in enumerate(devices):
    devTypes = response2.getvalue()
    json_obj3 = json.loads(devTypes)
    devType = device.split("_", 1)[0]
    if "ex" in devType or "EX" in devType:
	exCount += 1
    if "vsrx" in devType or "vSRX" in devType or "VSRX" in devType:
        vsrxCount += 1
    elif "srx" in devType or "SRX" in devType:
        srxCount += 1
    if "vmx" in devType or "vMX" in devType or "VMX" in devType:
        vmxCount += 1
    elif "mx" in devType or "MX" in devType:
        mxCount += 1

print "{\"EX\": \"%s\",\"SRX\": \"%s\",\"MX\": \"%s\",\"VSRX\":\"%s\",\"VMX\": \"%s\"}" % (exCount,srxCount,mxCount,vsrxCount,vmxCount) 


response2.close()


