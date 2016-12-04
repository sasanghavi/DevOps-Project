# DevOps-Project *(MileStone - 3)*



### Introduction
<img width="1050" alt="screen shot 2016-11-11 at 12 43 32 am" src="https://cloud.githubusercontent.com/assets/4195083/20205567/ef1131b4-a7a7-11e6-8b87-5e2ae4d9c571.png">

For this milestone, we have created droplets on Digital Ocean that would act as different servers.
* Droplet 1: App server/Redis/Proxy server - Master
* Droplets - n number of droplets acting as proxies
* Droplet 3: Server for Jenkins

We have used the code from HW1 for spinning up digital ocean droplets using 'needle' api and creating the inventory file entry that is read by ansible playbook.

We have used Ansible as the Configuration Management Tool and Jenkins as the Build Server. We have used the node js app used in the queues workshop and added Jasmine Node Js Tests and performed Checkstyle analysis using JSHint.

### Tasks

#### Triggered, remote deployment
* We have used Jenkins as the Build Server and configured a job to track the local git repository for our node js application. We have used a on push Github Webhook for continuous integration. This hook tracks the status of the build. If the build fails due to either test failure or failure from Checkstyle (JSHint) analysis, an email notification is triggered to the user.
* We have used a package Jasmine with Node JS for testing our node js app. It is mentioned in package.json under scripts.  [package.json](https://github.com/sasanghavi/M3/tree/M3/App/package.json). As Jasmine requires the tests to be *Spec.js and the test file to be under the Spec directory, we have implemented it as shown. [spec](https://github.com/sasanghavi/M3/tree/M3/App/spec) directory
* We have used Checkstyle with JSHint which has been configured in the Jenkins job `jshint --reporter=checkstyle $WORKSPACE/app_server/app.js > checkstyle-result.xml`.
* On a successful build completion, Jenkins would trigger a deployment of the changes to the m3 or dev deployment server based on the repo the code is committed to. A curl request would be sent to the master server and if `/deploy` is requested, we would create a new production environment while if `/canary` is requested, we would deplot the changes to the canary build.

#### Automatic configuration of production environment
* We wrote two ansible yml script which :
 - One would run on local machine which would spin up master and deploy on production.
 - The other would run on master server and would be responsible to deploy canary builds by creating new droplets.

#### Metrics and alerts
* We have used NewRelic for monitoring purposes.
* Using servers monitoring and setting up alerts policies, we were able to configure metrics like CPU usage/ Memory usage/ Disk IO usage etc. We set alerts if CPU usage > 47% for 5 minutes and mem usage reached 90% for 5 minutes.
* Using New Relic channels, we were able to configure our email addresses in New Relic. Also, we set up a webhook on our master server which acts as a receiving webhook for the application from NewRelic. After configuring the hook on new relic, we were able to trigger deployments of the server based on the rules set for alerts.

#### Triggered Autoscaling of production environment
* As an extension of the monitoring scripts, we have included Autoscaling service inside the mon.sh file.
* Whenever there is an over-utilization of CPU/Memory, we make a curl request to `/deploy` in the master server. This would create a new vm with the code from M3 branch. This vm's entry would be added to load balancer which facilitates the Autoscaling functionality.

#### Feature Flags
* We have used a Global Redis Store to maintain the value of feature flag setting. We used another Digital Ocean droplet as the Redis Server by installing Redis as follows `apt-get install redis-server`. Further modified the file `/etc/redis/redis.conf` and updated the value `bind 127.0.0.1` to `bind 0.0.0.0` to set up remote access to redis server on port 6379
* We have created the feature flag functionality for both deploy and canary. We set the feature flag using redis cli and then, get the value of the flag inside the server. Based on the flag value, we display different messages to the user on accessing the / endpoint, which would toggle the message between `Hello World! Feature!!!` and `Hello World!`for application server and `Hello World! Feature!!! - Canary` and `Hello World! - Canary` for the canary branch.

#### Canary releasing
* We have a branch named 'canary' for canary release. The process for spinning up a droplet, automatic configuration management and triggered remote deployments for this server are identical to the actual master server as mentioned in first two steps
* Canary Release - Any changes in the branch displayed on the canary deployments. [app](https://github.com/sasanghavi/M3/tree/Canary/app-server/app.js)
* We have created a http proxy server on master droplet that would handle routing to Application server and Canary Servers based on the number of available servers in master.

### Screencast

[Milestone 3 - Demo - Part 1](https://youtu.be/Htp2a62VSJs)
[Milestone 3 - Demo - Part 2](https://youtu.be/Hzk7tUYMW3I)

