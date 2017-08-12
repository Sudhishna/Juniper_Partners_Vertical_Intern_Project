%define maintDir /usr/local/
%define ss_user  slipstream
%define ss_group slipstream
%define installed_plugis_location %{maintDir}/slipstream/public/installed_plugins
%define _binary_payload 1
%define _binary_filedigest_algorithm 1

Name: Slipstream
Summary: Framework Code for Slipstream
Epoch: 0
Version: %{ss_version_num}%{ss_release_num}
Release: %{ss_cl_num} 
License: Commercial
AutoReqProv: no
Group:	SBU Customer Experience
Requires: nodejs redis

%description
Framework Code for Slipstream

%prep
%setup -c -T

%build
echo "RPM_SOURCE_DIR=$RPM_SOURCE_DIR"
tar -C %{ss_top}/slipstream/dist --exclude='.git*' --exclude='grunt*' --exclude-tag-all=.rpmignore -cf slipstream.tar mini

%install
echo RPM_BUILD_ROOT=$RPM_BUILD_ROOT
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT%{maintDir}
tar -C $RPM_BUILD_ROOT%{maintDir}/ -xf slipstream.tar
mv $RPM_BUILD_ROOT%{maintDir}/mini $RPM_BUILD_ROOT%{maintDir}/slipstream
mkdir -p $RPM_BUILD_ROOT/etc/init.d/
cp $RPM_BUILD_ROOT%{maintDir}/slipstream/scripts/slipstream $RPM_BUILD_ROOT/etc/init.d/
mkdir -p $RPM_BUILD_ROOT/var/run/slipstream/
mkdir -p $RPM_BUILD_ROOT/var/log/slipstream/

%clean
echo "rm -rf $RPM_BUILD_ROOT"

%files
%attr(755, root, root) /etc/init.d/slipstream
%attr(755, %{ss_user}, %{ss_group}) /var/run/slipstream/
%attr(755, %{ss_user}, %{ss_group}) /var/log/slipstream/
%attr(755, %{ss_user}, %{ss_group}) %{maintDir}/*

%pre
chmod o+x /var/log
/usr/bin/getent group  %{ss_group} || /usr/sbin/groupadd -r %{ss_group}
/usr/bin/getent passwd %{ss_user}  || /usr/sbin/useradd -r -d %{maintDir}/slipstream/ -s /sbin/nologin -g %{ss_group} %{ss_user}

%preun
#In rpm is uninstalled for erase then stop slipstream. In case of upgrade post
#will handle with condrestart
if [ $1 -eq 0 ]; then
/etc/init.d/slipstream stop
chkconfig --del slipstream
fi

%postun
#In rpm is uninstalled for erase then remove the user. In case of upgrade user
#is not deleted.
if [ $1 -eq 0 ]; then
/usr/sbin/userdel %{ss_user}
fi

%post
#Update CSS for upgrade case
if [ $1 -eq 2 ]; then
cd %{installed_plugis_location}
APP_CSS=../assets/css/app.css
TMP_FILE=`mktemp`
for PLUGIN_NAME in `ls -1`; do
if [ -e ${PLUGIN_NAME}/css/${PLUGIN_NAME}.css ]; then
  CSS_IMPORT="@import url('/installed_plugins/"${PLUGIN_NAME}"/css/"${PLUGIN_NAME}".css');"
  # Add import to app.css
  awk '/@import/ && !done { print "'"$CSS_IMPORT"'"; done=1;}; 1;' $APP_CSS > ${TMP_FILE} && cat ${TMP_FILE} > $APP_CSS
fi
done
/etc/init.d/slipstream condrestart
fi
