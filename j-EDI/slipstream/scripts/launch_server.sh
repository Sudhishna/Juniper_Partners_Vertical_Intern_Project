#!/bin/bash

###############################################################################
# Utility script to setup and launch the node application
#
# Author: Kiran Kashalkar
#
###############################################################################

# Kill app if already running
kill `ps -ef | grep 'node app.js' | grep -v grep | awk '{print $2}'` 2> /dev/null
kill `ps -ef | grep 'redis-server' | grep -v grep | awk '{print $2}'` 2> /dev/null

# Generate CSS from SCSS
echo "Running bundle to generate CSS from SCSS..."
sass public/assets/css/app.scss:public/assets/css/app.css
echo "Running bundle to generate CSS from SCSS...done"


if which redis-server >/dev/null; then
	# Run the redis database
	echo "Starting up the Redis DB"
	redis-server &
	echo "Redis DB started"
fi


# Run the app
echo "Running node app.js"
if which forever >/dev/null; then
	forever start app.js
else
	node app.js &
fi
