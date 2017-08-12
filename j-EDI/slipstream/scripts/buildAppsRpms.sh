#!/bin/bash

# script to build the application rpms 
# Original Author: Vijaya Mynam
SS_PATH="/usr/local"
SS_CFG_PATH="$SS_PATH/server/all"

usage() {
        cat << EOF
Usage: `basename $0` [flag value]...

Flags:
  -buildroot:   directory for building
  -depot:       path to top of p4 client root 

EOF
}
debug() {
        if [ "$DEBUG" = "1" ]; then
                eval "${@}"
        fi
}

while [ $# -gt 0 ]; do
        case $1 in
                "-version")
                        shift
                        VERSION=$1
                ;;
                "-release")
                        shift
                        REL=$1
                ;;
                "-appname")
                        shift
                        APP_NAME=$1
                ;;
                "-buildroot")
                        shift
                        RUNDIR=$1
                ;;
                "-vcsno")
                        shift
                        BUILD_VCS_NUMBER=$1
                ;;
                *)
                        echo "Unknown argument \"$1\""
                        echo "Remaining line: \"$@\""
                        echo
                        exit 1
                ;;
        esac
        shift
done


MYDIR=`dirname $0`
APPDIR=${MYDIR}/../../${APP_NAME}
cd $APPDIR
BUILD_NUMBER=${VERSION}${REL}-${BUILD_VCS_NUMBER}
echo "Starting rpm compile with ${BUILD_NUMBER}"
TOPDIR=${PWD}/..
echo $TOPDIR
TMPDIR=$RUNDIR

# given a directory as $1, echo the absolute path
dir_rel_to_abs() {
        pushd $1 >/dev/null
        if [ $? -ne 0 ]; then 
                echo "Not a valid directory: $1" >&2
                exit 1
        fi
        echo `pwd`
        debug echo \"Translated $1 to `pwd` \" >&2
        popd >/dev/null
}

export PATH=/usr/local/bin:/bin:/usr/bin
export LD_LIBRARY_PATH=''

# config variables
debug echo \"TMPDIR=${TMPDIR:=/tmp/slipstream-rpms}\"
debug echo \"JOSDIR=${JOSDIR:=`dirname $0`/rpms}\"
debug echo \"TOPDIR=${TOPDIR:=`dirname $0`/..}\"
debug echo \"PATH=$PATH\"

rm -rf $TMPDIR/srpms
mkdir -p $TMPDIR/srpms
JOSDIR=`dir_rel_to_abs $JOSDIR`
TOPDIR=`dir_rel_to_abs $TOPDIR`


rpmMapWrite()
{
        # args
        # 1 - flag
        # - [ rpm ]
        #   2 - srpm-name
        #   3 - rpm-name
        # - [ path ]
        #   2 - srpm-name
        #   3 - srpm-path
        # - [ patch ]
        #   2 - srpm-name
        #   3 - patch-path
        if [ "$CACHE" != "1" ]; then
                return 0
        fi
        if [ $# -ne 3 ]; then
                return 1
        fi
        tmpFile=`mktemp`
        retval=0
        srpm=$2
        if [ "$1" = "rpm" ]; then
                srpm_rpm=$3
                grep -v "^$srpm:$srpm_rpm$" $rpmSrcMap > $tmpFile
                cat $tmpFile > $rpmSrcMap
                echo "$srpm:$srpm_rpm" >> $rpmSrcMap
        else
                # unpack values from file
                path=`grep -m 1 "^$srpm|" $rpmSrcMap | cut -d'|' -f 2`
                patch=`grep -m 1 "^$srpm|" $rpmSrcMap | cut -d'|' -f 3`
                # flush line
                grep -v "^$srpm|" $rpmSrcMap > $tmpFile
                cat $tmpFile > $rpmSrcMap
                # re-generate new line
                case $1 in
                        "path")
                                path=$3
                        ;;
                        "patch")
                                patch=$3
                        ;;
                esac
                echo "$srpm|$path|$patch" >> $rpmSrcMap
        fi
        rm -f $tmpFile
}

rpmMapRead()
{
        # args
        # 1 - flag = [srpm-of] [rpms-of] [path-of]
        # 2 - arg
        if [ "$CACHE" != "1" ]; then
                return 1
        fi
        if [ $# -lt 1 ]; then
                return 1
        fi
        case $1 in
                "srpm-of")
                        echo `grep ":$2$" $rpmSrcMap | cut -d':' -f 1`
                ;;
                "rpms-of")
                        echo `grep "^$2:" $rpmSrcMap | cut -d':' -f 2`
                ;;
                "path-of")
                        echo `grep "^$2|" $rpmSrcMap | cut -d'|' -f 2`
        esac
}

rpmMapClear()
{
        # args:
        # -1: srmp
        if [ "$CACHE" != "1" ]; then
                return 0
        fi
        if [ $# -ne 1 ]; then
                return 1
        fi
        tmpFile=`mktemp`
        grep -v "^$1|" $rpmSrcMap > $tmpFile
        cat $tmpFile > $rpmSrcMap
        grep -v "^$1:" $rpmSrcMap > $tmpFile
        cat $tmpFile > $rpmSrcMap
        rm -f $tmpFile
        return 0
}

mkSymLink()
{
        # input:
        # 1: filename, contents = rel path to target
        # result:
        # create symlink to target w/ same name in input file's directory

        local rv=0
        local symFile=$1
        local tgtFileRaw=`cat $1`
        rv=`expr $rv + $?`


        pushd `dirname $symFile` >/dev/null
                rv=`expr $rv + $?`
                pushd `dirname $tgtFileRaw` >/dev/null
                        rv=`expr $rv + $?`
                        tgtFile=`pwd`
                        tgtFile="$tgtFile/`basename $tgtFileRaw`"
                popd >/dev/null
                ln -s $tgtFile .
                rv=`expr $rv + $?`
        popd >/dev/null
        rv=`expr $rv + $?`

        if [ $rv -eq 0 ]; then
                rm -f $symFile
                rv=`expr $rv + $?`
        fi

        return $rv
}

rpmBuild()
{
        bRrpm=$1
        rpmBuildCalledDir=`pwd`
        unKnown=1
        if [ -f "$bRrpm" ]; then
                ftype=`file -b $bRrpm`
                if [ "${ftype:0:3}" = "RPM" ]; then
                        # srpm, rebuild
                        rpmName=`rpm -qp $bRrpm --qf='%{NAME}'`
                        topdir="$rpmBuildBase/$rpmBuildDir/$rpmName.rpmbuild"
                        rBBR="$topdir/$rpmName.buildroot"
                        echo "Unpacking and building srpm $rpmName"
                        mkdir -p $topdir/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
                        #sudo yum-builddep -y $bRrpm 1>>$topdir/$rpmName.log 2>>$topdir/$rpmName.err
                        pushd $topdir/SOURCES >/dev/null
                        rpm2cpio $rpmBuildCalledDir/$bRrpm | cpio -id --quiet
                        popd >/dev/null
                        specFile=`find $topdir/SOURCES -name "*.spec"`
                        unKnown=0
                else
                        echo "File $bRrpm is unknown type $ftype"
                fi
        elif [ -d "$bRrpm" ]; then
                rpmName=`basename $bRrpm`
                topdir="$rpmBuildBase/$rpmBuildDir/$rpmName.rpmbuild"
                rBBR="$topdir/$rpmName.buildroot"
                mkdir -p $topdir/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
                # directory: build w/ patches
                specFile=`find $bRrpm -name "*.spec"`
                echo "Building source dir $rpmName with spec `basename $specFile`"
                # copy source to build directory
                pushd $bRrpm >/dev/null
                        find . -depth -print | cpio -pamd --quiet $topdir/SOURCES/
                popd >/dev/null
                unKnown=0
                # TODO: add auto-prereq download loop, since yum-builddep doesn't understand specfiles, and rpm is stingy about the BuildReq info
        fi

        # error handler
        if [ $unKnown -eq 1 ]; then
                echo "-------------------------------------------------"
                echo "I don't know what to do with $bRrpm"
                echo "-------------------------------------------------"
                exit 1
        fi

#       if [ "$rpmName" = "glibc" ]; then
#               # need to remove . from LD_LIBRARY_PATH
#               unset LD_LIBRARY_PATH
#       fi

        helpPfx="ss-help"
        helpDir="/var/www/html/${helpPfx}"
        BUILD_SPIN_NUMBER=`echo $BUILD_NUMBER | awk -F. '{print $NF}'`
     
        rpmbuild --define "_topdir $topdir"\
                --define "buildroot $rBBR"\
                --define "dist .ss" \
                --define "ss_version_num $VERSION" \
                --define "ss_release_num $REL" \
                --define "ss_cl_num ${BUILD_VCS_NUMBER}" \
                --define "ss_bld_num ${BUILD_NUMBER}" \
                --define "ss_top $TOPDIR" \
                --define "ss_path $SS_PATH" \
                --define "ss_set $SS_CFG_PATH" \
                --define "ss_deploy $SS_PATH/standalone/deployments" \
                --define "spaceconfroot /etc/sysconfig/JunosSlipstream" \
                --define "help_pfx $helpPfx" \
                --define "helpdir $helpDir" \
                --define "helpsrc replace" \
                -bb $specFile \
                1>>$topdir/$rpmName.log 2>>$topdir/$rpmName.log

        if [ $? -ne 0 ]; then
                touch $topdir/$rpmName.build-result.1
                echo "-------------------------------------------------"
                echo "warning: Failure result for $rpmName" >&2
                echo "$rpmName recent build log:"
                echo "-------------------------------------------------"
                tail -20 $topdir/$rpmName.log
                exit 1
        else
                touch $topdir/$rpmName.build-result.0
                find $topdir/RPMS -name "*.rpm" -exec mv '{}' $basedir/rpms/ \;
                mv $topdir/$rpmName.log $basedir/logs/
                rm -rf $topdir
                echo "rpm $1 built successfully"
        fi
}


# we need to have this to know the working directory, I think
DATE=${DATE:=`date "+%F_%T" | sed -e 's/:/-/g'`}

# end of config variables

# apply Juniper patches and home-grown code
cd $TMPDIR/srpms
echo "Applying Juniper patches"
for pkgDir in $JOSDIR
do
        for rpmName in `find $pkgDir -maxdepth 1`
        do
                if [ "$rpmName" = "$pkgDir" ]; then
                        continue
                elif [ "$rpmName" = "." ]; then
                        continue
                else
                        rpmName=`basename $rpmName`
                fi
                echo "Found $pkgDir/$rpmName"
                mkdir $rpmName
                cd $rpmName
                rpmSrpm=`rpmMapRead path-of $rpmName`
                debug echo \"Looking for srpm for $rpmName in $rpmSrpm\"
                if [ "" != "$rpmSrpm" ]; then
                        rpmSrpm=`basename $rpmSrpm`
                        debug echo \"SRPM is $rpmSrpm\"
                        rpm2cpio ../$rpmSrpm | cpio -id --quiet
                        rm -f ../$rpmSrpm
                fi
                symList=`find $pkgDir/$rpmName -name "symlink\.*\.symlink"`
                for tsl in $symList; do
                        mkSymLink $tsl
                done
                cp -a $pkgDir/$rpmName/* .
                if [ -d "Juniper" ]; then
                        mv Juniper/* .
                        rmdir Juniper
                fi
                cd ..
        done
done

debug echo \"Found all of the patches, ready to build\"

echo "Starting RPM compiles"

# now build rpms
cd $TMPDIR

basedir=`pwd`
rpmBuildDir=$DATE
rpmBuildBase=`mktemp`
rm -f $rpmBuildBase
mkdir -p $rpmBuildBase/$rpmBuildDir
mkdir -p rpms
mkdir -p logs
cd rpms
for trpm in ../srpms/*
do
                echo "Starting build for $trpm"
                rpmBuild $trpm 
                echo "Completed build for $trpm"
done


badBuilds=0
for resFile in `find $rpmBuildBase/$rpmBuildDir -maxdepth 2 -name "*.build-result.1"`
do
        mkdir -p $basedir/errors
        (( badBuilds++ ))
        resName=`echo \`basename $resFile\` | cut -d. -f 1`
        echo "error: Build failed for $resName in `dirname $resFile`"
        cp `dirname $resFile`/$resName.log $basedir/errors/
done
if [ $badBuilds -ne 0 ]; then
        echo "Error running create-sm-rpms, returned $badBuilds"
        exit $badBuilds
else
        echo "All rpms built successfully"
        echo "Cleaning up build space"
        rm -rf $rpmBuildBase
fi
retVal=$?
