#!/bin/bash

###############################################################################
# A script to executed after an installation of Slipstream.  This script
#  will replace the navigation schema files and configure the branding.  
#  This script should be run from the Slipstream/scripts directory.
#
# Author: Dennis Park <dpark@juniper.net>
#
#
###############################################################################

echo '-------------------------'
echo
echo 'Unzipping post install archive'
unzip PostInstall.zip .
echo 'Unzipped'
echo
echo 'Copying schema.js'
cp schema.js ../public/assets/js/conf/navigation/schema.js
echo 'Done copying schema.js'
echo
echo 'Copying global_config.js'
cp global_config.js ../public/assets/js/conf/global_config.js
echo 'Done copying global_config.js'
echo
echo 'Copying index.html'
cp index.html ../views/index.html
echo
echo 'Done copying index.html'
echo
echo 'Copying message properties'
cp msgs.properties ../public/assets/js/conf/navigation/nls/msgs.properties
echo
echo 'Done copying msgs.properties'
echo
echo '------------------------'
echo