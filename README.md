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
	

--


<br/>

#### 1. Trigger Builds on Commit

In order to trigger a build every time a commit is pushed to the GIT repo, we use Github Webhooks. The webhook is configured to send out a POST request to Jenkins' GIT plugin every time **push** event is observed by the GIT server.

![Github WebHook configuration](images/github-webhook.png)

Also, while configuring a project on Jenkins, we check the "Build when a change is pushed to GitHub" options. This completes the trigger configuration from the Jenkins' side and the GIT plugin handles the POST requests made by the webhook.

![Github WebHook configuration](images/jenkins-trigger.png)


--


#### 2. Clean Builds

Lorem Ipsum

#### 3. Handling build success/failures

Lorem Ipsum


#### 4. Branch specific builds

Lorem Ipsum


#### 5. Build Hisory

Lorem Ipsum