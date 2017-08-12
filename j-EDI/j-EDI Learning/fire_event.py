import salt.client
import argparse

print ‘fire_event.py called'
parser = argparse.ArgumentParser(description='saltstack event system')

#parse the device details from JEAP
parser.add_argument('device_ip', type=str, help='IP of Juniper Device')
parser.add_argument('device_model', type=str, help='Juniper Device Model')
parser.add_argument('device_username', type=str, help='username to log into device')
parser.add_argument('device_pw', type=str, help='pw to log into device')

args=parser.parse_args()
print 'device ip: ' + args.device_ip
print 'device model: ' + args.device_model
print 'device username: ' + args.device_username
print 'device password: ' + args.device_pw

print 'firing event to salt master!'

#fire the event with the detauls of the new device to the salt master
caller=salt.client.Caller()
caller.sminion.functions['event.send'](
	'jnpr/jeap/newdev', #sending for this specific tag
	{
		'message': 'Event Data from JEAP',
		'devIp': args.device_ip,
		'devType': args.device_model,
		'username': args.device_username,
		'passwd': args. device_pw
	})

print 'DONE SENDING TO SALT MASTER'
