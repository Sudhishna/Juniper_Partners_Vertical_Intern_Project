#!/usr/bin/env /usr/local/bin/python
"""
Copyright (c) 2014-2015, Juniper Networks, Inc.
All rights reserved.
Author: Naran Babhu Kannan
Edited: Sumer Joshi
Description: Slipstream Export Using Maven
"""
import sys

if sys.hexversion < 0x02070000:
    print 'Error: Need python version 2.7 or greater to run jgit'
    sys.exit(1)

import argparse
import glob
import os
import re
import shutil
import shlex
import subprocess
import ConfigParser
from datetime import datetime


class Pipeline(object):
    """ Build CI Pipeline Class  """

    def __init__(self, options):
        self.opt = options
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.workspace = os.path.dirname(os.path.dirname(script_dir))
        os.chdir(self.workspace)
        config = ConfigParser.RawConfigParser()
        config.read('slipstream/scripts/build.cfg')
        self.version = config.get('release-info', 'version')
        self.release = config.get('release-info', 'release')
        self.mvn_repo = config.get('maven-repo', 'url')
        self.mvn_groupId = config.get('maven-repo', 'groupId')
        self.mvn_artifactId = config.get('maven-repo', 'artifactId')
        self.mvn = '/usr/local/apache-maven-3.3.3/bin/mvn'
        self.plugin_manager = script_dir + '/plugin_manager.sh'
        print 'Current Dir  %s' % (self.plugin_manager)

        if not os.path.isfile(self.mvn):
            print 'Error: Maven is not installed'
            sys.exit(1)

        """ Change HOME to avoid mounted loaction on build machine """
        os.environ["HOME"] = self.workspace
        """ Change maven repo location to keep it Slipstream specific """
        self.mvn = self.mvn + " -V -B "

    def precompile(self):
        """ Compilation step for Nodespog """
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'echo Building Type %s' % self.opt.type
        execute(command, self.opt.debug)

        command = 'npm install'
        execute(command, self.opt.debug)

        command = 'echo Git Hash is %s' % self.opt.git_commit
        execute(command, self.opt.debug)

        command = 'echo Build ID is %s' % self.opt.build_id
        execute(command, self.opt.debug)

        command = 'echo Build Number is %s' % self.opt.build_number
        execute(command, self.opt.debug)

        command = 'grunt createbldinfo --bldno=%s --bldhash=%s --bldtime=%s' % \
                  (self.opt.build_number, self.opt.git_commit, self.opt.build_id)
        execute(command, self.opt.debug)

    def compile(self):
        """ Compilation step for Slipstream """
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt jenkins'
        execute(command, self.opt.debug)

    def copy(self):
        """ Copy step In GruntFile """
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt copy'
        execute(command, self.opt.debug)

    def compile_orpheus_plugins(self):
        """Compilation Step for Orpheus Plugins and Copy to Minified Directory"""

        print 'Current Dir %s' % (self.workspace)

        os.chdir('%s/orpheus/plugins' % self.workspace)

        command = 'zip -r security-management.spi security-management'
        execute(command, self.opt.debug)

        command = 'zip -r dashboard.spi dashboard'
        execute(command, self.opt.debug)

        command = 'zip -r security-dashboard.spi security-dashboard'
        execute(command, self.opt.debug)

        command = 'sh %s -i security-management' % self.plugin_manager
        execute(command, self.opt.debug)

        command = 'sh %s -i dashboard' % self.plugin_manager
        execute(command, self.opt.debug)

        command = 'sh %s -i security-dashboard' % self.plugin_manager
        execute(command, self.opt.debug)

        command = 'rm -r %s/orpheus/plugins' % self.workspace
        execute(command, self.opt.debug)

    def framework_server_functional_tests(self):
        """Framework Server Functional Tests"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt mochaTest:ci-framework-server-functional-tests'
        execute(command, self.opt.debug)

    def framework_server_unit_tests(self):
        """Framework Server Unit Tests"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt mochaTest:ci-framework-server-unit-tests'
        execute(command, self.opt.debug)

    def framework_client_unit_tests(self):
        """Framework Client Unit Tests"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt ci-framework-client-unit-tests'
        execute(command, self.opt.debug)

    def orpheus_client_unit_tests(self):
        """Framework Client Unit Tests"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/orpheus/plugins_unit_test' % self.workspace)

        command = 'npm install'
        execute(command, self.opt.debug)

        command = 'grunt run-unit-tests-ci'
        execute(command, self.opt.debug)

    def export(self):
        """ Export step """
        print 'Current Dir  %s' % (self.workspace)
        print 'Build number %s' % (self.opt.seq_no)

        os.chdir('%s/slipstream/scripts' % self.workspace)

        """ Package artifacts """
        # command = self.mvn + ' package'
        # execute(command, self.opt.debug)

        """ Create .rpm """
        buildRpm('slipstream', self.version, self.release, self.opt.seq_no, self.opt.debug)

        """ Upload to repo """
        os.chdir('/tmp/')
        fullVersion = '%s%s-%s' % (self.version, self.release, self.opt.seq_no)
	#buildType= '%s' % (self.opt.build)
        command = self.mvn + ' deploy:deploy-file \
                   -Durl=%s \
                   -Dfile=/tmp/slipstream-rpms/rpms/Slipstream-%s.x86_64.rpm -DgroupId=%s -DartifactId=%s \
                   -Dversion=%s -DgeneratePom=false' % (self.mvn_repo, fullVersion, self.mvn_groupId, self.mvn_artifactId, fullVersion)
        execute(command, self.opt.debug)

    def export_widget(self):
	""" Exporting Widget """
        print 'Current Dir:  %s' % (self.workspace)
        print 'Build Number: %s' % (self.opt.build_number)
        print 'Build ID: %s' % (self.opt.build_id)
        print 'Slipstream Workspace: %s' % (self.opt.workspace_path)
        print 'Version: %d' % (self.opt.version)
        print 'ArtDir: %s' % (self.opt.artdir)
        print 'Type: %s' % (self.opt.type)
        fullVersion = '%s%s-%s' % (self.version, self.release, self.opt.build_number)
        print fullVersion

        os.chdir('%s/slipstream/' % self.workspace)
        
        """ Build Widgets """
        command = './scripts/build/build-slipstream.sh --time %s --bldno %s --ws %s --ver %d --art %s --bldtyp %s' % \
		(self.opt.build_id, self.opt.build_number, self.opt.workspace_path, self.opt.version, self.opt.artdir, self.opt.type)
        execute(command, self.opt.debug)

        """ Upload Widgets """
        command = self.mvn + ' deploy:deploy-file \
                    -Durl=%s \
                    -Dfile=%s/%d.%s/slipstream_widgetlib.tar.gz  -DgroupId=widgets -DartifactId=slipstream_widgetlib \
                    -Dversion=%s -DgeneratePom=false' % (self.mvn_repo, self.opt.artdir, self.opt.version, self.opt.build_number, fullVersion)
        execute(command, self.opt.debug)
        
    def slipstream_tar_and_link(self):
        """ Generate Slipstream Framework Tar"""
        print 'Current Dir  %s' % (self.workspace)

        command = 'tar -czf /volume/slipstream/Slipstream/%s-Builds/%s/slipstream/slipstream_framework_only_%s_1.0.%s_build.tgz slipstream' % \
                  (self.opt.type, self.mvn_groupId, self.opt.type, self.opt.build_number)
        execute(command, self.opt.debug)

        os.chdir('/volume/slipstream/Slipstream/%s-Builds/%s/slipstream' % (self.opt.type, self.mvn_groupId))
        command = 'rm -f /volume/slipstream/Slipstream/%s-Builds/%s/slipstream/latest_slipstream_framework_only_%s_build.tgz' % \
                  (self.opt.type, self.mvn_groupId, self.opt.type)
        execute(command, self.opt.debug)

        command = 'ln -s /volume/slipstream/Slipstream/%s-Builds/%s/slipstream/slipstream_framework_only_%s_1.0.%s_build.tgz latest_slipstream_framework_only_%s_build.tgz' % \
	(self.opt.type, self.mvn_groupId, self.opt.type, self.opt.build_number, self.opt.type)
        execute(command, self.opt.debug)

    def orpheus_tar_and_link(self):
        """ Generate Slipstream Framework Tar"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s' % self.workspace)

        command = 'tar -czf /volume/slipstream/Slipstream/%s-Builds/%s/orpheus/orpheus_slipstream_%s_1.0.%s_build.tgz slipstream' % \
                  (self.opt.type, self.mvn_groupId, self.opt.type, self.opt.build_number)
        execute(command, self.opt.debug)

        os.chdir('/volume/slipstream/Slipstream/%s-Builds/%s/orpheus' % (self.opt.type, self.mvn_groupId))
        command = 'rm -f /volume/slipstream/Slipstream/%s-Builds/%s/orpheus/latest_orpheus_slipstream_%s_build.tgz' % \
                  (self.opt.type, self.mvn_groupId, self.opt.type)
        execute(command, self.opt.debug)

        command = 'ln -s /volume/slipstream/Slipstream/%s-Builds/%s/orpheus/orpheus_slipstream_%s_1.0.%s_build.tgz latest_orpheus_slipstream_%s_build.tgz' % \
                  (self.opt.type, self.mvn_groupId, self.opt.type, self.opt.build_number, self.opt.type)
        execute(command, self.opt.debug)

def buildRpm(appname, version, release, seq_no, debug):
    """ Function to build app rpm """
    command = './buildAppsRpms.sh \
                -appname %s \
                -buildroot /tmp/slipstream-rpms \
                -version %s \
                -release %s \
                -vcsno %s' % (appname, version, release, seq_no)
    execute(command, debug)


def execute(command, debug):
    """ Function to execute shell command and return the output """

    if debug:
        print 'DEBUG: %s' % (command)
    pipe = subprocess.Popen(shlex.split(command),
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT,
                            close_fds=True)

    for line in iter(pipe.stdout.readline, b''):
        print line.rstrip()
    rc = pipe.wait()

    if rc:
        print 'Error: Working directory: %s' % (os.getcwd())
        print 'Error: Failed to execute command: %s' % (command,)
        sys.exit(1)


def parse_options(args):
    """ Parse command line arguments """
    parser = argparse.ArgumentParser(description='Slipstream Product Pipeline Script')
    parser.add_argument('-v', dest='debug', action='store_true', help='Enable verbose mode')

    subparsers = parser.add_subparsers(title='Pipeline sub-commands',
                                       description='Select one sub-command',
                                       dest='command')

    parser_precompile = subparsers.add_parser('precompile', description='Compilation step for Nodespog')
    parser_precompile.add_argument('-t', dest='type', type=str, required=True, help='$type variable from Jenkins')
    parser_precompile.add_argument('-c', dest='git_commit', type=str, required=True, help='Git Commit from Jenkins')
    parser_precompile.add_argument('-i', dest='build_id', type=str, required=True, help='Build ID from Jenkins')
    parser_precompile.add_argument('-b', dest='build_number', type=str, required=True, help='Build Number from Jenkins')

    parser_compile = subparsers.add_parser('compile', description='Compilation step for Slipstream')
    parser_copy = subparsers.add_parser('copy', description='Grunt Copy Step of Build')
    parser_framework_server_functional_tests = subparsers.add_parser('framework_server_functional_tests', description='Slipstream Test Step 1 - Server Test')

    parser_framework_server_unit_tests = subparsers.add_parser('framework_server_unit_tests', description='Slipstream Test Step 2 - Server Unit Test')

    parser_framework_client_unit_tests = subparsers.add_parser('framework_client_unit_tests', description='Slipstream Test Step 3 - Client Test')

    parser_compile_orpheus_plugins = subparsers.add_parser('compile_orpheus_plugins', description='Compilation step for Orpheus')

    parser_orpheus_client_unit_tests = subparsers.add_parser('orpheus_client_unit_tests', description='Orpheus Test Step 1 - Client Test')

    parser_slipstream_tar_and_link = subparsers.add_parser('slipstream_tar_and_link', description='Tar and link for Slipstream TGZ')
    parser_slipstream_tar_and_link.add_argument('-t', dest='type', type=str, required=True, help='$type variable from Jenkins')
    parser_slipstream_tar_and_link.add_argument('-b', dest='build_number', type=str, required=True, help='Build Number from Jenkins')
    #parser_slipstream_tar_and_link.add_argument('-x', dest='build_type', type=str, required=True, help='Build Type for different types of builds')

    parser_orpheus_tar_and_link = subparsers.add_parser('orpheus_tar_and_link', description='Tar and link for Orpheus TGZ')
    parser_orpheus_tar_and_link.add_argument('-t', dest='type', type=str, required=True, help='$type variable from Jenkins')
    parser_orpheus_tar_and_link.add_argument('-b', dest='build_number', type=str, required=True, help='Build Number from Jenkins')
    #parser_orpheus_tar_and_link.add_argument('-x', dest='build_type', type=str, required=True, help='Build Type for different types of builds')

    parser_export = subparsers.add_parser('export', description='Export artifacts to binary repo')
    parser_export.add_argument('-n', dest='seq_no', type=int, required=True,
                               help='Sequence number used to export binary artifact')

    parser_export_widget = subparsers.add_parser('export_widget', description='Export slipstream widgets to binary repo')
    parser_export_widget.add_argument('-b', dest='build_number', type=str, required=True, help='Sequence number used to export binary artifact')
    parser_export_widget.add_argument('-i', dest='build_id', type=str, required=True, help='Build ID used to export binary artifact')
    parser_export_widget.add_argument('-w', dest='workspace_path', type=str, required=True, help='Workspace Path')
    parser_export_widget.add_argument('-v', dest='version', type=int, required=True, help='Version Number')
    parser_export_widget.add_argument('-a', dest='artdir', type=str, required=True, help='Framework Directory')
    parser_export_widget.add_argument('-t', dest='type', type=str, required=True, help='Type of Build')     

    opt = parser.parse_args(args)
    return opt


if __name__ == '__main__':
    options = parse_options(sys.argv[1:])
    pipeline = Pipeline(options)
    start = datetime.now()
    print 'Start  %s ...' % options.command
    getattr(pipeline, options.command)()
    print 'End  %s ...' % options.command
    delta = datetime.now() - start
    print 'Duration of %s step : %d days, %d hours and %0.3f minutes' % (options.command, delta.days, delta.seconds // 3600, delta.seconds % 3600 / 60.0)
