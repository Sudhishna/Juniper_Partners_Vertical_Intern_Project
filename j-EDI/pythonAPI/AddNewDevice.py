#!/usr/bin/env python

import sys
import stat
import salt.client
import json
import urllib2
import subprocess
import os
import pycurl
import cgi
import cgitb
import StringIO
import time
from shutil import copyfile
from subprocess import check_call,CalledProcessError,check_output 

cgitb.enable()

# Fetch the arguments passed from the event sent
form = cgi.FieldStorage()
model = form.getvalue('model')
ip  = form.getvalue('ip')
username = form.getvalue('username')
passwd = form.getvalue('password')

# Print necessary headers for python output to be displayed in a browser
print "Access-Control-Allow-Origin: *"
print "Access-Control-Expose-Headers: Access-Control-Allow-Origin"
print "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
print "Content-Type: text/html\n"

# Create a unique device type+ip name for unique identification
deviceIpAddress = ip.replace(".", "_")
devFileName = model + "_" + deviceIpAddress
devPathFileName = "/srv/pillar/" + devFileName + ".sls"

# Execute the required curl command to fetch the list of minions
targets = "*"
post_data1 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local_async","tgt":"*","fun":"junos.ping"}]'
response1 = StringIO.StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://localhost:8001')
c.setopt(c.CUSTOMREQUEST, "POST")
c.setopt(c.POSTFIELDS, post_data1)
c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
c.setopt(c.WRITEDATA, response1)
c.perform()
c.close()

# Fetch the output and formulate them in the required JSON format
deviceList = response1.getvalue()
json_obj1 = json.loads(deviceList)
devices = json_obj1['return'][0]["minions"]

if devFileName not in devices:
  # Add a new entry for the device in top.sls, if it doesnt exist before
  if not devFileName in open("/srv/pillar/top.sls").read():
      fo = open("/srv/pillar/top.sls", "a")
      fo.write( "  '{0}':\n    - {1}\n".format(devFileName,devFileName));
      fo.close()

  # Create a new file or overwrite the existing file with the device details required to access it
  src = "/var/www/pythonApi/tempFiles/" + devFileName + ".sls" 
  fo = open(src, "w+")
  fo.write( "proxy:\n  proxytype: junos\n  host: {0}\n  username: {1}\n  passwd: {2}\n".format(ip,username,passwd));
  fo.close()
  dst = "/srv/pillar/" + devFileName + ".sls"
  copyfile(src, dst)

  # Start the proxy minion
  command = "sudo salt-proxy --proxyid=" + devFileName + " start -d"
  check_output(command,shell=True,stderr=subprocess.STDOUT)

  # Accept the new proxy minion key
  command = "sudo salt-key -y -a " + devFileName
  try:
      check_output(command,shell=True,stderr=subprocess.STDOUT)
  except CalledProcessError as e:
      print "" 
  time.sleep(10)

# Execute the curl command to fetch the status of the minions in the Salt Stack
post_data2 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local_async","tgt":\"%s\","fun":"junos.ping"}]' % (devFileName)
response2 = StringIO.StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://localhost:8001')
c.setopt(c.CUSTOMREQUEST, "POST")
c.setopt(c.POSTFIELDS, post_data2)
c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
c.setopt(c.WRITEDATA, response2)
c.perform()
c.close()

deviceList = response2.getvalue()
json_obj2 = json.loads(deviceList)
devices = json_obj2['return'][0]["minions"]

for index,device in enumerate(devices):
    if devFileName not in device:
        print "{\"device\": \"%s\", \"message\": \"Failed\"}" % devFileName 
    else:
        print "{\"device\": \"%s\", \"message\": \"Success\"}" % devFileName

post_data3 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":"%s","fun":"junos.install_config","arg":["/var/www/pythonApi/tempFiles/ConfigFiles/Config_Syslog.txt", {"__kwarg__": true, "timeout": 60}]}]' % (devFileName)

response3 = StringIO.StringIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://localhost:8001')
c.setopt(c.CUSTOMREQUEST, "POST")
c.setopt(c.POSTFIELDS, post_data3)
c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
c.setopt(c.WRITEDATA, response3)
c.perform()
c.close()
response = response3.getvalue()

response1.close()
response2.close()
response3.close()
