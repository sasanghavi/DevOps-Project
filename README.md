# DevOps-Project

**Team:**

* Anand Varma Chekuri (ACHEKUR)
* Shrey Sanghavi (SSANGHA)

-------

### Build

#### Trigger Builds on Commit

In order to trigger a build every time a commit is pushed to the GIT repo, we use Github Webhooks. The webhook is configured to send out a POST request to Jenkins' GIT plugin every time **push** event is observed by the GIT server.

![Github WebHook configuration](images/github-webhook.png)

Also, while configuring a project on Jenkins, we check the "Build when a change is pushed to GitHub" options. This completes the trigger configuration from the Jenkins' side and the GIT plugin handles the POST requests made by the webhook.

![Github WebHook configuration](images/jenkins-trigger.png)

---

#### Clean Builds

Lorem Ipsum

#### Handling build success/failures

Lorem Ipsum


#### Trigger Builds on Commit

Lorem Ipsum


#### Branch specific builds

Lorem Ipsum


#### Build Hisory

Lorem Ipsum