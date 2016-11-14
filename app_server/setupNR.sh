rpm -Uvh https://download.newrelic.com/pub/newrelic/el5/i386/newrelic-repo-5-3.noarch.rpm
yum install -y newrelic-sysmond
nrsysmond-config --set license_key=de6aa67291303641a6bc486f90545d3eb5af4e83
/etc/init.d/newrelic-sysmond start