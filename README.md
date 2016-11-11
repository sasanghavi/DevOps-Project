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
* The folder named [Monitor](https://github.com/sasanghavi/M3/tree/M3/Monitor) contains the scripts that deal with metrics monitoring
* We are monitoring two metrics - CPU Utilization and Memory Utilization using psutils library of python. We have two python scripts named [cpu.py](https://github.com/sasanghavi/M3/tree/M3/Monitor/cpuMonitor.py) and [mem.py](https://github.com/sasanghavi/M3/tree/M3/Monitor/memoryMonitor.py)
* We have set 45% as threshold values for cpu and memory utilization as found [here](https://github.com/sasanghavi/M3/tree/M3/Monitor/mon.sh)
* We have used SMTP mail for the ability to send email notifications when the metrics exceed threshold values

#### Triggered Autoscaling of production environment
* As an extension of the monitoring scripts, we have included Autoscaling service inside the mon.sh file.
* Whenever there is an over-utilization of CPU/Memory, we make a curl request to `/deploy` in the master server. This would create a new vm with the code from M3 branch. This vm's entry would be added to load balancer which facilitates the Autoscaling functionality.

#### Feature Flags
* We have used a Global Redis Store to maintain the value of feature flag setting. We used another Digital Ocean droplet as the Redis Server by installing Redis as follows `apt-get install redis-server`. Further modified the file `/etc/redis/redis.conf` and updated the value `bind 127.0.0.1` to `bind 0.0.0.0` to set up remote access to redis server on port 6379
* We have created another [node js app](https://github.com/sasanghavi/M3/tree/M3/FeatureFlag) running at http://< REDIS_IP>:3001` would toggle the value of feature flag. This flag value will be accessed in Production Server by our [app](https://github.com/sasanghavi/M3/tree/M3/app-server/app.js) to provide access to the functionality of `set/get tokens`
* By default, the feature flag would be set to true, thus giving access to set/get functionality on prod server
* Every request sent to http://< REDIS_IP>:3001/feature would toggle the flag value, thereby enabling or disabling the feature in production

#### Canary releasing
* We have a master server which can create canary instances. We have a branch named 'canary' for canary release. The process for spinning up a droplet, automatic configuration management and triggered remote deployments for this server are identical to the actual master server as mentioned in first two steps. The branch contents can be viewed [here](https://github.com/sasanghavi/M3/tree/canary)
* Canary Release - Any changes in the branch displayed on the canary deployments. [app](https://github.com/sasanghavi/M3/tree/Canary/app-server/app.js)
* We created an http proxy server on master droplet that would handle routing to Master and Canary Servers in a ratio of 2:1.
* Further, we have used the same global redis store to store the value of whether an alert has been raised or not on the canary server. When the [monitoring script](https://github.com/sasanghavi/M3/tree/M3/Monitor/mon.sh) is invoked, it checks if values are above threshold. If yes, the value is stored in redis through [redis client](https://github.com/sasanghavi/M3/tree/M3/redisAlert.js). This value is used by the proxy server to determine if alert is yes or no. If alert is yes, then traffic will be routed to master server instead of Canary, thus sending all requests to only master

### Screencast

[Milestone 3 - Demo](https://youtu.be/)
