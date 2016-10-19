# DevOps-Project *(MileStone - 2)*


###Team & Contributions:
* **Anand Varma Chekuri (ACHEKUR)**
	* x
	* y
	* z
* **Shrey Sanghavi (SSANGHA)**
	* a
	* b
	* c

<br/>
#### System under Test
For the purpose of the project-deliverable, we decided to use the Google's [**gson**](https://github.com/google/gson) (JSON library for Java) as the source code to build and test our CI system with. The configuration management software of choice for the project was **Maven** and Jenkins was configured to demonstrate maven builds on a clone of this code-base.

<br/>
### Test
---

#### Test Suites

The GSON project comes with it's own JUnit test cases *(nearly 1000 individual tests)* and we used the **Surefire** Maven Plugin to generate XML reports of the results of these test cases. The reports generated were published using the JUnit plugin and displayed in a tabular fashion using the Test Result Analyzer plugin.

#### Advanced Testing

We have decided to demonstrate this section using the **Randoop** Test Generation tool for Java. This tool generates JUnit test cases for a given project which can be used to find Errors and to extend Regression Tests to improved coverage.

We ran the randoop tool on our "gson" project and were able to boost the already good test-coverage of this project.

<br/>
### Analysis
---

#### Basic Analysis

To demonstrate the ability to run static-analysis tools on the codebase, we decided to use PMD, which we learnt was widely used in the industry. To enable PMD analysis of our gson project, we used the Maven PMD plugin. The plugin generates XML reports for each run which were setup to be consumed by the PMD Jenkins plugin and displayed on the Jenkins web console.

We also configured our test-pipeline and Jenkins framework to run the Findbugs and CheckStyle tools along with PMD.

#### Custom Metrics

We have decided to implement some of our custom metrics reporting using the CheckStyle tool and the CheckStyle Jenkins interface that we already setup. This tool allowed us to easily write custom rules and integrate them into our pipeline:

* Max Condition
* Long Method

The rest of the custom metrics were implemented as command line scripts that were added as part of the build process:

* Free Style (Security Token Detection)
* Duplicate Code Detection


#### Gates

To implement gating of builds that do not pass our static-analysis checks, we have configured our Jenkins system to fail builds that violate certain thresholds set on these checks. Through a post-build script, we capture the outcome of a given build and in case of a failure, inform the user via mail and also revert the top most commit off of the git tree.

