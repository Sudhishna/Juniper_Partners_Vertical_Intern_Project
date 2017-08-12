#!/usr/bin/env python

# Turn on debug mode.
import pycurl
import cgitb
import StringIO
import json
cgitb.enable()

post_data1 = '[{"eauth":"pam","username":"demo","password":"jnpr!123","client":"local","tgt":"*","fun":"test.versions_report"}]'

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
print "Content-Type: text/html\n"
print "%s" % (response1.getvalue())

response1.close()

