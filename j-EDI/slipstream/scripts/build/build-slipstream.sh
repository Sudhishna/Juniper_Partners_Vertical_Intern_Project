#!/bin/bash

# script to build slipstream 
#Copyright (c) 2014, Juniper Networks, Inc.
#All rights reserved.
#Author : Vijaya Mynam 

echo "Running `basename $0`: $@"

usage()
{
        cat <<EOF
Usage: `basename $0` [flag value]...

Flags:
        --hash:    Git Hash at which build is running 
        --time:    Build Time 
        --bldno:   Buldnumber
        --bldtyp:  Buldtype
        --ws: 	   workspace 
	--art:	   Artifacts folder
	--ver:	   Version

EOF
}
#####
# parse CLI
#####
while [ $# -gt 0 ]; do
        case $1 in 
                "-h")
                        usage
                        exit 0
                ;;
                "-help")
                        usage
                        exit 0
                ;;
                "--hash")
                        shift
                        GITHASH=$1
                ;;
                "--time")
                        shift
                        BLDTIME=$1
                ;;
                "--bldno")
                        shift
                        BLDNO=$1
                ;;
		"--bldtyp")
                        shift
                        TYPE=$1
                ;;
		"--ws")
                        shift
                        WKSPC=$1
                ;;
		"--ver")
                        shift
                        VRSN=$1
                ;;
		"--art")
                        shift
                        ARTDIR=$1
                ;;
                *)
                        echo "Unknown argument \"$1\""
                        echo "Remaining line: \"$@\""
                        echo
                        usage
                        exit 1
                ;;
        esac
        shift
done

#ARTDIR="/volume/slipstream/Nightly-Builds/slipstream"

if [ "$GITHASH" = "" ]; then
        GITHASH=`git log -1 | grep commit | cut -d' ' -f2`
fi

if [ "$BLDTIME" = "" ]; then
        BLDTIME=`date +"%m-%d-%y"`
fi

if [ "$BLDNO" = "" ]; then
        BLDNO=devbld
fi

if [ "$VRSN" = "" ]; then
        VRSN=dev
fi

if [ "$TYPE" = "" ]; then
        TYPE=oncheckin
fi


if [ "$ARTDIR" = "" ]; then
	ARTDIR=`pwd`
fi


if [ ! -d $ARTDIR ]; then
        echo "$ARTDIR does not exist"
        exit 1
fi

if [ ! -w $ARTDIR ]; then
        echo "Error: $ARTDIR is not writable"
        exit 1
fi

if [ "$TYPE" = "oncheckin" ]; then
    grunt createbldinfo
fi



echo Building $TYPE 
echo "Running the grunt Task"
grunt nodespog
echo "Git HASH is $GITHASH"
echo "Build Time is $BLDTIME"
echo "Build number is $BLDNO"
echo "Check if the build artifacts are built"

if [ ! -f ./SPoG_Framework.tar.gz ]; then
    "SPoG_Framework.tar.gz is not built"
    exit 1
fi

if [ ! -f ./slipstream_widgetlib.tar.gz ]; then
    "slipstream_widgetlib.tar.gz is not built"
    exit 1
fi

if [ "$TYPE" = "nightly" ]; then 
    echo "Upload files here"
    mkdir $ARTDIR/$VRSN.$BLDNO
    cp ./SPoG_Framework.tar.gz $ARTDIR/$VRSN.$BLDNO/.
    cp -r ./dist/documentation $ARTDIR/$VRSN.$BLDNO/.
    cp ./public/assets/js/build-info.json   $ARTDIR/$VRSN.${BLDNO}/.
    cp ./slipstream_widgetlib.tar.gz $ARTDIR/$VRSN.${BLDNO}/.
    rm $ARTDIR/latest
    ln -s ./$VRSN.${BLDNO} $ARTDIR/latest
    echo "Build images copied to $ARTDIR/$VRSN.${BLDNO}"
fi
