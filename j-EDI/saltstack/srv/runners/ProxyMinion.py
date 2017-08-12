import sys
import salt.client
import json
import urllib2
import subprocess
import os
import pycurl
import StringIO
import time

def create(event_data):
  # Fetch the arguments passed from the event sent
  events = event_data["data"]
  deviceType = events["devType"]
  deviceIp = events["devIp"]
  username = events["username"]
  passwd = events["passwd"]

  # Create a unique device type+ip name for unique identification
  deviceIpAddress = deviceIp.replace(".", "_")
  devFileName = deviceType + "_" + deviceIpAddress
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
  json_obj2 = json.loads(deviceList)
  devices = json_obj2['return'][0]["minions"]

  if devFileName not in devices:
    # Add a new entry for the device in top.sls, if it doesnt exist before
    if not devFileName in open("/srv/pillar/top.sls").read():
      fo = open("/srv/pillar/top.sls", "a")
      fo.write( "  '{0}':\n    - {1}\n".format(devFileName,devFileName));
      fo.close()

    # Create a new file or overwrite the existing file with the device details required to access it
    fo = open(devPathFileName, "w+")
    fo.write( "proxy:\n  proxytype: junos\n  host: {0}\n  username: {1}\n  passwd: {2}\n".format(deviceIp,username,passwd));
    fo.close()

    # Start the proxy minion
    command = "salt-proxy --proxyid=" + devFileName + " start -d"
    os.system(command)

    # Accept the new proxy minion key
    command = "salt-key -y -a " + devFileName
    os.system(command)
    time.sleep(10)

  post_data2 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":"%s","fun":"junos.install_config","arg":["/var/www/pythonApi/tempFiles/ConfigFiles/Config_Syslog.txt", {"__kwarg__": true, "timeout": 100}]}]' % (devFileName)

  response2 = StringIO.StringIO()
  c = pycurl.Curl()
  c.setopt(c.URL, 'http://localhost:8001')
  c.setopt(c.CUSTOMREQUEST, "POST")
  c.setopt(c.POSTFIELDS, post_data2)
  c.setopt(c.HTTPHEADER, ['Content-Type: application/json'])
  c.setopt(c.WRITEDATA, response2)
  c.perform()
  c.close()
  response = response2.getvalue()

  response1.close()
  response2.close()
