import sys
import salt.client
import urllib2
import subprocess
import pycurl
import cgitb
import cgi
import StringIO
import json
import smtplib
import re
from jnpr.jsnapy import SnapAdmin
from pprint import pprint
from jnpr.junos import Device

def invokeTests(event_data):

  emailAddress = []
  emailAddress.insert(0,"ssendhil@juniper.net")

  line = subprocess.check_output(['tail', '-1', "/var/log/juniper_device.log"])
  ip = re.findall( '[0-9]+(?:\.[0-9]+){3}', line )
  deviceIp = ip[0] 

  # Initialize the JSNAPy Admin
  js = SnapAdmin()

  # Configure the file with the required tests
  config_file = """
  hosts:
    - device: {0}
      username : root
      passwd: Juniper9
  tests:
    - test_is_gt.yml
    - test_exists.yml
    - test_contains.yml
  """.format(deviceIp)

  # Perform the SNAP check on the device
  snapValue = js.snapcheck(config_file, "pre")

  # Fetch the test details if the test cases have failed
  output =""
  for index,check in enumerate(snapValue):
      testDetails = json.dumps(dict(check.test_details))
      json_obj = json.loads(testDetails)
      keys = json_obj.keys()
      new_key = ""
      for key in keys:
          result = json_obj[key][0]["result"]
          if result:
              new_key ="%s" % key
              #new_result = cgi.escape(result,True)
          else:
              new_key = "%s" % key
              #new_result = cgi.escape(result,True)
          testOperation = json_obj[key][0]["testoperation"]
          xpath = json_obj[key][0]["xpath"]
          expected_value = json_obj[key][0]["expected_node_value"]
          count = json_obj[key][0]["count"]
          passed = json_obj[key][0]["passed"]
          failed = json_obj[key][0]["failed"]

          string =  "\n          Test Name: %s\n          Test Operation: %s\n          Expected Value: %s\n          Count: %s\n          Passed: %s\n          Failed: %s\n\n" % (new_key,testOperation,expected_value,count,passed,failed)
          #new_string = cgi.escape(string,True)
          output += string

  jsnapyResult = "Pass"
  for check in snapValue:
      if check.result == "Failed":
          jsnapyResult = "Fail"
          body = """
	  Hi,

	  The Changes you've committed on the device listed below were not correct. Please revert the changes that you've made on the device.

          Test Performed on Device: %s
	  ========================
          Overall Result:
          Final Result: TEST %s !!
          Total Tests Passed: %s
          Total Tests Failed: %s
          Test Details: \n%s \n\n

          """ % (check.device,check.result,check.no_passed,check.no_failed,output)

  with open("/var/www/pythonApi/tempFiles/SnapCheckResult.txt", 'w') as f:
      f.write(jsnapyResult)

  # Send out an email to the user with the test details during failure
  if jsnapyResult == "Fail":
      # Email configurations
      gmail_user = "jedijsnapy@gmail.com"
      gmail_pwd = "Juniper9"
      FROM = "jedijsnapy@gmail.com"
      TO = emailAddress 
      SUBJECT = "JSNAPy Test Result : Failed"
      TEXT = body

      # Prepare actual message
      message = """From: %s\nTo: %s\nSubject: %s\n\n%s
      """ % (FROM, ", ".join(TO), SUBJECT, TEXT)

      # Send out the email
      server = smtplib.SMTP("smtp.gmail.com")
      server.ehlo()
      server.starttls()
      server.login(gmail_user, gmail_pwd)
      server.sendmail(FROM, TO, message)
      server.close()
