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

      if [ -d $INSTALLPATH"/"$PLUGIN_NAME"/css" ] ; then
          PLUGIN_CSSPATH=`ls $INSTALLPATH'/'$PLUGIN_NAME'/css/'`
          PLUGIN_IMPORT_CSSPATH=`echo '.'$PLUGIN_NAME' { '`

          for FILE in $PLUGIN_CSSPATH
          do
              PLUGIN_IMPORT_CSSPATH+=`echo '@import "../../installed_plugins/'$PLUGIN_NAME'/css/'$FILE'";'`
          done

          PLUGIN_IMPORT_CSSPATH+=`echo ' } '`
          echo $PLUGIN_IMPORT_CSSPATH >> $CSSFILEPATH
      fi


      # Add user assistance, if present
      if [ -d $INSTALLPATH"/"$PLUGIN_NAME"/help" ] ; then

          LOCALES=`ls $INSTALLPATH'/'$PLUGIN_NAME'/help/'`

          for LOCALE in $LOCALES
          do
             if which node >/dev/null; then
                echo "Merging User Assistance ToC.."
                node $SCRIPTPATH'/js/toc/TocMerge.js' $1 $INSTALLPATH $LOCALE
                echo "Done. User Assistance ToC merge complete!"

                echo "Merging User Assistance Alias.."
                node $SCRIPTPATH'/js/alias/AliasMerge.js' $1 $INSTALLPATH $LOCALE
                echo "Done. User Assistance Alias merge complete!"

                # echo "Merging User Assistance Search.."
                # node js/search/SearchMerge.js $1 $INSTALLPATH $LOCALE
                # echo "Done. User Assistance Search merge complete!"

                PLUGIN_NAME=`echo $1 | awk -F'/' '{print $NF}'`
                HELP_PATH=`echo $PUBLICPATH'/help/'$LOCALE`
                PLUGIN_PATH=`echo $INSTALLPATH'/'$PLUGIN_NAME'/help/'$LOCALE`

                if [ -d $PLUGIN_PATH'/Content/helpPanel' ]; then  
                    cp -r $PLUGIN_PATH'/Content/helpPanel' $HELP_PATH'/Content/'
                fi

                if [ -d $PLUGIN_PATH'/Content/helpSystem' ]; then  
                    cp -r $PLUGIN_PATH'/Content/helpSystem' $HELP_PATH'/Content/'
                fi

                if [ -d $PLUGIN_PATH'/Content/resources/Images' ]; then  
                    cp -r $PLUGIN_PATH'/Content/resources/Images' $HELP_PATH'/Content/resources/'
                fi

            else
                echo "Node.js version 0.10.x is required to install slipstream plugins."
                exit 1
            fi
        done
    fi

   else
      echo "Plugin already exists. Please use update option to update."
   fi
}

function update () {
   echo "Updating plugin $1..."

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
   else

   echo "Unmerging Plugin Help Content."
   if which node >/dev/null; then

      echo "Removing Plugin Help files."
      PLUGIN_NAME=`echo $1 | awk -F'/' '{print $NF}'`

      sed -i -bak "/.$PLUGIN_NAME{/d" $CSSFILEPATH

      LOCALES=`ls $INSTALLPATH'/'$PLUGIN_NAME'/help/'`

      for LOCALE in $LOCALES
         do
            HELP_PATH=`echo $INSTALLPATH'/'$PLUGIN_NAME'/help/'$LOCALE`

            echo "Unmerging User Assistance ToC.."
            node $SCRIPTPATH'/js/toc/TocUnmerge.js' $1 $INSTALLPATH $LOCALE
            echo "Done. User Assistance ToC unmerge complete!"

            echo "Unmerging User Assistance Alias.."
            node $SCRIPTPATH'/js/alias/AliasUnmerge.js' $1 $INSTALLPATH $LOCALE
            echo "Done. User Assistance Alias unmerge complete!"

            # echo "Unmerging User Assistance Search.."
            # node $SCRIPTPATH'/js/search/SearchUnmerge.js $1 $INSTALLPATH $LOCALE
            # echo "Done. User Assistance Search unmerge complete!"

            if [ -d $HELP_PATH'/Content/helpPanel' ]; then  
               HELP_PANEL_FILES=`ls $HELP_PATH'/Content/helpPanel'`
               for FILE in $HELP_PANEL_FILES
               do
                  rm $SCRIPTPATH'../public/help/'$LOCALE'/Content/helpPanel/'$FILE
               done
            fi

            if [ -d $HELP_PATH'/Content/helpSystem' ]; then
               HELP_SYSTEM_FILES=`ls $HELP_PATH'/Content/helpSystem'`
               for FILE in $HELP_SYSTEM_FILES
               do
                  rm $SCRIPTPATH'/../public/help/'$LOCALE'/Content/helpSystem/'$FILE
               done
            fi

            if [ -d $HELP_PATH'/Content/resources/Images' ]; then
               HELP_IMG_FILES=`ls $HELP_PATH'/Content/resources/Images'`
               for FILE in $HELP_IMG_FILES
               do
                  rm $SCRIPTPATH'/../public/help/'$LOCALE'/Content/resources/Images/'$FILE
               done
            fi
         done
   else
      echo "Node.js version 0.10.x is required to install slipstream plugins."
      exit 1
   fi

      rm -rf $2
      echo "Done. Please check for errors above."
   fi
}

function create () {
   echo "Creating plugin file $1.spi from directory $1..."

   if [ -d "$1" ] ; then
      zip -q -r $1".spi" $1
      echo "Done. Please check for errors above."
   else
      echo "Plugin directory does not exist. Plugin creation failed."
   fi
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
