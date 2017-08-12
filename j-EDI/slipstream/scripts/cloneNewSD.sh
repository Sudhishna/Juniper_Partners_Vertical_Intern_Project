#!/bin/bash

###############################################################################
# Utility script to clone SLipstream and Secmgt - setup and launch Slipstream 
#  and SD
#
# Author: Dennis Park <dpark@juniper.net>
#
###############################################################################

echo '-------------------------'
echo 'Killing Redis-server..'
kill `ps -ef | grep 'redis-server' | grep -v grep | awk '{print $2}'` 2> /dev/null
echo
echo 'done'
echo
echo 'Killing node server..'
echo
kill `ps -ef | grep 'node app.js' | grep -v grep | awk '{print $2}'` 2> /dev/null
echo
echo 'done'
echo
echo 'Cloning slipstream...'
git clone git@ssd-git.juniper.net:spog/slipstream.git
echo 'Done cloning slipstream...'

echo 'Cloning secmgt...'
git clone git@ssd-git.juniper.net:secmgt/ui.git
echo 'Done cloning secmgt...'

cd ui
git checkout orpheus
cd ..

cd slipstream/public/installed_plugins
for filename in `ls ../../../ui/plugins/`; do
    `ln -s ../../../ui/plugins/"$filename" "$filename"`
done

cd ../../
grunt svg_sprite
grunt sass:inplace
say 'done'
echo
echo '------------------------'
echo

if which redis-server >/dev/null; then
    # Run the redis database
    echo "Starting up the Redis DB"
    redis-server &
    echo "Redis DB started"
fi

node app.js
