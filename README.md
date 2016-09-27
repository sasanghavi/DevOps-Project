# DevOps-Project

###Team:
* Anand Varma Chekuri (ACHEKUR)
* Shrey Sanghavi (SSANGHA)

--

<br/>

### Build
---

#### The Setup Process

*Installing Jenkins:*

	sudo yum -y install java
	sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo
	sudo rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key
	sudo yum install jenkins
	sudo systemctl start jenkins.service
	
*Installing Dependencies:*
	
	sudo yum install -y git
	sudo yum install -y maven
	sudo yum install java-1.6.0-openjdk-devel
	sudo yum install mailx
	
	
*The project (gson), build-management (maven)* **TODO!**

--


<br/>

#### 1. Trigger Builds on Commit

In order to trigger a build every time a commit is pushed to the GIT repo, we use Github Webhooks. The webhook is configured to send out a POST request to Jenkins' GIT plugin every time **push** event is observed by the GIT server.

![Github WebHook configuration](images/github-webhook.png)

Also, while configuring a project on Jenkins, we check the "Build when a change is pushed to GitHub" options. This completes the trigger configuration from the Jenkins' side and the GIT plugin handles the POST requests made by the webhook.

![Github WebHook configuration](images/jenkins-trigger.png)


--


#### 2. Clean Builds, Build Management

To ensure that each build happens in a clean and controlled environment, we configured Jenkins to delete the workspace before a new build starts. This prevents running build jobs with stale artifacts from a previous builds.

![Clean workspace before building - Jenkins Config](images/clean-builds.png)

Also, the build script is written to execute **"mvn clean"** before building. This way, we can be sure that the build environment is always new.

![Clean workspace before building - Jenkins Config](images/build-sh.png)


--


#### 3. Handling build success/failures




#### 4. Branch specific builds

Lorem Ipsum


#### 5. Build Hisory

Lorem Ipsum