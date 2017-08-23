import pyinotify
import re
from helpers import Helpers
from jnpr.junos.utils.config import Config

"""
Keeping this script simple by calling the functions written in the helper module
"""

helpers = Helpers()

wm = pyinotify.WatchManager()  # Watch Manager
mask = pyinotify.IN_MODIFY

known_macs = ["38:c9:86:f1:95:22"]
# Creating an ACTION to the EVENT of new device booting up
class EventHandler(pyinotify.ProcessEvent):

    # In Action to the DHCP Leases file Change (New IP Assign)
    def process_IN_MODIFY(self, event):
	print "Known Macs"
	print known_macs
	print "\n"

	# Fetch the new hosts to-be provisioned from the DHCP leases file
	host_mac = helpers.lease_read("/var/lib/dhcp/dhcpd.leases")
	print "host_mac MAP: "
	print host_mac
	print "\n"

	for mac,host in host_mac.iteritems():
	    if host and mac:
		if not mac in known_macs:
		    print "Provisioning Below Device:\nhost IP: " + host + "\n" "Host MAC: " + mac + "\n"

	            # Access the device using pyez netconf and fetch Serial Number
		    print "Connecting to the device....\n"
		    dev = helpers.device_connect(host)
		    dev.open()
		    on_box_serialnumber = dev.facts["serialnumber"]
		    on_box_version = dev.facts["version"]
		    on_box_model = dev.facts["model"] 
		    print "On Box Serialnumber: " + on_box_serialnumber + "\n On Box Version: " + on_box_version + "\n On Box Model: " + on_box_model + "\n"

	            # Fetch the IMAGE and CONFIG for the given Serial Number in the db 
	            sno,req_version,req_config = helpers.fetch_customer_requirements(on_box_serialnumber)
	            print "Req Version: " + req_version + "\nReq Config: " + req_config + "\n" 

		    # Version Check
		    status = helpers.junos_version_compare(on_box_version, req_version)
		    print "Version Status: " + str(status) + "\n"

		    # Fetch image file name
		    filename = helpers.junos_img_check(on_box_model, req_version)
		    print "Image File Name Fetched: " + filename + "\n"
		    print "Skipping Image Upgrade as its time consuming\n"

	            # Upgrade the Device to the image Specified and load the new config
		    #if filename:
			# Call PyEz to install that
			#dev = helpers.junos_auto_install(on_box_serial_number, "Junos/" + filename, dev)

		    # Push the new CONFIG Required
	            print("\n\nPushing down the device specific configuration file now ")

		    on_box_model = "EX2200-24P-4G"
		    on_box_hostname = "EX2200-Spine"
		    on_box_version = "12.3R6.6"

	            dict = helpers.load_config(on_box_model, on_box_hostname, on_box_version)

        	    config = Config(dev)
        	    config.load(template_path="Config/EX_template.conf", template_vars=dict, merge=True)
        	    config.commit()

		    # Mark the host as known
		    known_macs.append(mac)
		    print "Known Macs"
		    print known_macs
		    print "\n"

# Creating an Event Trigger to detect new device booting up
handler = EventHandler()
notifier = pyinotify.Notifier(wm, handler)
wdd = wm.add_watch('/var/lib/dhcp/dhcpd.leases', mask, rec=True)

notifier.loop()
