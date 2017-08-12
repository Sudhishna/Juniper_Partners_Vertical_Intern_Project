#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pycurl
import cgitb
import cgi
import StringIO
import json
import smtplib
import pprint
import time
import sys
import salt.client
import urllib2
import subprocess

from jnpr.jsnapy import SnapAdmin
from pprint import pprint
from jnpr.junos import Device

def replace_last(source_string, replace_what, replace_with):
    head, sep, tail = source_string.rpartition(replace_what)
    return head + replace_with + tail

form = cgi.FieldStorage()
devicesList = form.getvalue('devices')
config = form.getvalue('config')
email = form.getvalue('email')
prePostCheck = form.getvalue('prePostCheck')
if prePostCheck=="yes":
    prePostTests = form.getvalue('prePostTests')

cgitb.enable()

# Print necessary headers.
print "Access-Control-Allow-Origin: *"
print "Access-Control-Expose-Headers: Access-Control-Allow-Origin"
print "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
print "Content-Type: text/html\n"

with open("/var/www/pythonApi/tempFiles/SnapCheckResult.txt", 'w'): pass

with open("/srv/runners/jsnapy.py") as f:
    s = f.read()
with open("/srv/runners/jsnapy.py", 'w') as f:
    s = s.replace("ssendhil@juniper.net", email)
    f.write(s)

tests = "          - None"
if prePostCheck == "yes":
    prePostTests = prePostTests.split(",")
    tests = ""
    for test in prePostTests:
        tests += "          - " + test + "\n"

devicesList = devicesList.split(",")

# Create a new file or overwrite the existing file with the device details required to access it
timestamp = time.strftime("%Y%m%d-%H%M%S")
src = "/var/www/pythonApi/tempFiles/" + timestamp + ".sls"
fo = open(src, "w+")
fo.write(config);
fo.close()

output = "{\"ConfigOutput\":["
for index,device in enumerate(devicesList):
    if index==0:
	output += "{"
    else:
	output += ",{"

    devIp = device.split("_", 1)[1]
    deviceIp = devIp.replace("_", ".")

    post_data1 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":"%s","fun":"junos.ping"}]' % (device)

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
    status = False
    response = response1.getvalue()
    if device in response:
        json_obj2 = json.loads(response)
        status = json_obj2["return"][0][device]["message"]

    if not status:
        output += "\"device\":\"%s\",\"config_result\":\"Null\",\"snapcheck_result\":\"Null\",\"pre_post_result\":\"Null\",\"pre_post_details\":\"\"" % device
    else:
        js = SnapAdmin()

        # Configure the file with the required tests
        config_file = """
        hosts:
          - device: {0}
            username : root
            passwd: Juniper9
        tests:
{1} 
        """.format(deviceIp,tests)

        cgitb.enable()


        js.snap(config_file, "pre")

        post_data1 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":"%s","fun":"junos.install_config","arg":["%s", {"__kwarg__": true, "timeout": 60}]}]' % (device,src)

        response1 = StringIO.StringIO()
        c = pycurl.Curl()
        c.setopt(c.URL, 'http://localhost:8001')
        c.setopt(c.CUSTOMREQUEST, "POST")
        c.setopt(c.POSTFIELDS, post_data1)
        c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
        c.setopt(c.WRITEDATA, response1)
        c.perform()
        c.close()

        response = response1.getvalue()
        json_obj2 = json.loads(response)
        output += "\"device\":\"%s\",\"config_result\":\"%s\"," % (device,json_obj2["return"][0][device]["message"])

        response1.close()

	with open("/var/www/pythonApi/tempFiles/SnapCheckResult.txt") as f:
	    cnt = 0
	    while(cnt < 10):
	        s = f.read()
	        if s== "":
	            time.sleep(2)
	        else:
	            break
	        cnt += 1
	s = s.split("\n")
	for str in s:
	    if str == "Pass":
	        SnapCheckResult =  "Passed"
	        break
	    else:
	        SnapCheckResult = "Failed"
	        break
        output += "\"snapcheck_result\":\"%s\"," % SnapCheckResult

        js.snap(config_file, "post")

        chk = js.check(config_file, "pre", "post")

	checkResult = "Passed"
        for index,check in enumerate(chk):
	    if check.result == "Passed":
		checkResult = "Passed"
	    elif check.result is True:
		checkResult = "Null"
	    elif check.result == "Failed":
		checkResult ="Failed"

            output += "\"pre_post_result\":\"%s\"," % checkResult

            output += "\"pre_post_details\":"
            testDetails = json.dumps(dict(check.test_details))
            json_obj = json.loads(testDetails)
            keys = json_obj.keys()
            output += "\""
            new_key = ""
            for key in keys:
                result = json_obj[key][0]["result"]
                if result:
                    new_key ="<b><font color='green'>%s</font></b>" % key
                    #new_result = cgi.escape(result,True)
                else:
                    new_key = "<b><font color='red'>%s</font></b>" % key
                    #new_result = cgi.escape(result,True)
                testOperation = json_obj[key][0]["testoperation"]
                xpath = json_obj[key][0]["xpath"]
                expected_value = json_obj[key][0]["expected_node_value"]
                count = json_obj[key][0]["count"]
                passed = json_obj[key][0]["passed"]
                failed = json_obj[key][0]["failed"]

                string =  "Test Name: %s<br>Test Operation: %s<br>Expected Value: %s<br>Count: %s<br>Passed: %s<br>Failed: %s<br><br>" % (new_key,testOperation,expected_value,count,passed,failed)
                #new_string = cgi.escape(string,True)
                output += string
            output += "\""
    output += "}"
output += "]}"

output = output.replace("\n", " ")
print "%s" % output

with open("/srv/runners/jsnapy.py") as f:
    s = f.read()
with open("/srv/runners/jsnapy.py", 'w') as f:
    s = s.replace(email, "ssendhil@juniper.net")
    f.write(s)
with open("/var/www/pythonApi/tempFiles/SnapCheckResult.txt", 'w'): pass
