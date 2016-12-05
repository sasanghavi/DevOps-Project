# DevOps-Project *(MileStone - 4)*

Team:

* **Anand Varma Chekuri** (ACHEKUR)
* **Shrey Sanghavi** (SSANGHA)

---

### Special Milestone - DDoS Sentry

For the implementation of our special milestone, we implemented "DDoS Sentry", a continuous monitoring framework that is capable of identifying possible DDOS attacks by analyzing at the load-balancer layer, the various HTTP requests that are being made to the application servers.

#####*DDoS Attacks and associated Pain-points:*
DDoS or Distributed Denial of Service attacks are orchestrated/timed attacks that often originate from various compromised machines all across the internet. With the advent of the Internet-of-Things and the large number of devices that are connected to the Internet, this problem only gets more worse. 

* Random nature of source of origin makes it really difficult to pin-point and thereby difficult to block individual sources to mitigate the attack.
* Attackers often target a single IO bound end-point of an application *(eg: a large pdf on a website)* in order to saturate system resources and prevent legitimate users access to the service.
* Attacks often happen at off-hours when immediate action cannot always be taken.

![](images/ddos_sentry.png)


### Screencast

[Milestone 4 - DDoS Sentry Demo](https://youtu.be/35gJQhzFBS8)

