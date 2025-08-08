# PerformanceTesting-JPetStore-JMeter-Jenkins
# 🐾 JPetStore Performance Testing using JMeter, Jenkins & AppDynamics

This project demonstrates end-to-end performance testing of the JPetStore application using **Apache JMeter**, **Jenkins** for CI, and **AppDynamics** for real-time application monitoring. The goal is to analyze application behavior under load and ensure stability across different scenarios.

---

## 🔧 Tools & Technologies Used

- 🧪 **Apache JMeter 5.6.3** – Load Test Execution
- ⚙️ **Jenkins** – Continuous Integration (CI)
- 📊 **AppDynamics** – Performance Monitoring (APM)
- 🌐 **Apache Tomcat** – Local Web Application Deployment
- 🐙 **GitHub** – Version Control & Collaboration
- 🧾 **CSV** – Parameterized Input Data

---

## 📁 Project Structure

```bash
PerformanceTesting-JPetStore-JMeter-Jenkins/
│
├── JMeterTestPlans/
│   └── ProjectPetStoreTestScript.jmx
│
├── JenkinsPipelines/
│   └── jmeter-performance-job-config.txt
│
├── TestReports/
│   └── report_<timestamp>/ (Auto-generated HTML reports)
│
├── TestResults/
│   └── testresult.csv
│
├── AppDynamicsScreenshots/
│   └── response-time.png
│   └── throughput-graph.png
│
└── README.md

