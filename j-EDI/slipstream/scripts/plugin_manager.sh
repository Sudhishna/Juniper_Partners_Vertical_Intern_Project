#!/bin/bash

###############################################################################
# Utility script to manage plugin installation and uninstallation.
#
# Authors: Kiran Kashalkar <kkashalkar@juniper.net>
#        : Dennis Park     <dpark@juniper.net>
#        : Miriam Hadfield <mhadfield@juniper.net>
#
###############################################################################

SCRIPT=$0
SCRIPTPATH=$(dirname "$SCRIPT")
INSTALLPATH="$SCRIPTPATH/../public/installed_plugins"
PUBLICPATH="$SCRIPTPATH/../public"
CSSFILEPATH="$PUBLICPATH/assets/css/installed_plugins.scss"

function usage () {
   cat <<EOF
Run this script from the base directory
Usage: 
$SCRIPT [-h] | [[-i | -u | -d] plugin-name] | [-c plugin-directory]
   -i   installs a specified plugin; plugin-name.spi must exist.
   -u   updates a specified plugin, if found in system; 
        plugin-name.spi must exist.
   -d   uninstalls plugin, if found.
   -c   create a plugin package (.spi) from specified
        plugin-directory, if found.
        plugin-directory must exist in current working directory.
   -h   displays this help content.
EOF
   exit 0
}

function install () {
    echo "Installing plugin $1..."

    if [ ! -d "$2" ] ; then

        echo "Unpacking plugin..."
        unzip -q -n $1".spi" -d $INSTALLPATH
        echo "Done unpacking plugin..."
        PLUGIN_NAME=`echo $1 | awk -F'/' '{print $NF}'`

        # Check for plugin supplied CSS
        if [ -r $INSTALLPATH"/"$PLUGIN_NAME"/css/"$PLUGIN_NAME".css" ] ; then
            local CSS_IMPORT="@import url('/installed_plugins/"$PLUGIN_NAME"/css/"$PLUGIN_NAME".css');"
            local APP_CSS=$PUBLICPATH"/assets/css/app.css"
            # Add import to app.css
            awk '/@import/ && !done { print "'"$CSS_IMPORT"'"; done=1;}; 1;' $APP_CSS > tmp && mv tmp $APP_CSS
        fi
    else
        echo "Plugin already exists. Please use update option to update."
    fi
}

function update () {
    echo "Update not supported, delete and install again"

    if [ ! -d "$2" ] ; then
        echo "Plugin does not exist. Please use install option to install."
    else
        unzip -qq -u $1".spi" -d $INSTALLPATH

        PLUGIN_NAME=`echo $1 | awk -F'/' '{print $NF}'`
        sed -i -bak "/.$PLUGIN_NAME{/d" $CSSFILEPATH
        PLUGIN_CSSPATH=`ls $INSTALLPATH'/'$PLUGIN_NAME'/css/'`
        PLUGIN_IMPORT_CSSPATH=`echo '.'$PLUGIN_NAME'{'`
        for FILE in $PLUGIN_CSSPATH
        do
          PLUGIN_IMPORT_CSSPATH+=`echo '@import "../../installed_plugins/'$PLUGIN_NAME'/css/'$FILE'";'`
        done
        PLUGIN_IMPORT_CSSPATH+=`echo '}'`
        echo $PLUGIN_IMPORT_CSSPATH >> $CSSFILEPATH

        echo "Done. Please check for errors above."
    fi
}

function uninstall () {
    echo "Uninstalling plugin $1..."

    if [ ! -d "$2" ] ; then
        echo "Plugin does not exist. Uninstall failed."
        exit 1
    fi

    # Remove plugin provided css
    local CSS=$PUBLICPATH"/assets/css/app.css"
    echo "Removing plugin supplied CSS ..."
    grep -v $1".css" $CSS > tmp && mv tmp $CSS

    rm -rf $2
    echo "Done. Please check for errors above."
}

function create () {
    echo "Creating plugin file $1.spi from directory $1..."

    local SASS=`which sass`
    local SCSS="$1/css/$1.scss"
    local CSS="$1/css/$1.css"

    if [ $? -ne 0 ] ; then
        echo "sass command is required but not found in PATH. Please install sass or add it to your PATH"
        exit 1
    fi

    if [ ! -d "$1" ] ; then
        echo "Plugin directory does not exist. Plugin creation failed."
        exit 1
    fi

    # @TODO Move to a grunt process that is run at build time
    if [ -r $SCSS ] ; then
        # Add namespace
        cp $SCSS $SCSS".bak"
        sed -i '' "1s/^/\.$1 {/" $SCSS
        sed -i '' "\$s/\$/}/" $SCSS

        # Compile CSS
        $SASS "$SCSS:$CSS"
        if [ $? -ne 0 ] ; then
            echo "There were errors compiling scss"
            echo "Command $SASS \"$SCSS:$CSS\""
        fi

        # Remove namespace
        mv $SCSS".bak" $SCSS
    fi

    zip -q -r $1".spi" $1

    echo "Done. Please check for errors above."
}

if [ $# == 0 ] ; then
    usage
fi

while getopts ":hi:u:d:c:" opt; do
    case $opt in

    i )  install $OPTARG "$INSTALLPATH/$OPTARG" ;;
    u )  update $OPTARG "$INSTALLPATH/$OPTARG" ;;
    d )  uninstall $OPTARG "$INSTALLPATH/$OPTARG" ;;
    c )  create $OPTARG ;;
    h )  usage ;;
    \?)  usage ;;
    : )  usage ;;
    esac
done
