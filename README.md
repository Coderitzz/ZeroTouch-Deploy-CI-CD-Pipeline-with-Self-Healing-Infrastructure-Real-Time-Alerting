# ZeroTouch Deploy — CI/CD Pipeline with Self-Healing Infrastructure & Real-Time Alerting

This project automates the build, test, and deployment of a **Dockerized full-stack application** (Flask API + React frontend) onto **AWS**, triggered automatically on every GitHub commit. Infrastructure is fully codified with **Terraform**, orchestration is handled by a self-hosted **Jenkins** server, and — the core focus of this project — deployment health is continuously monitored in real time with **CloudWatch alarms and SNS alerts**, layered on top of an Auto Scaling Group that self-heals by automatically replacing any instance that fails health checks.

Repository: [ZeroTouch-Deploy-CI-CD-Pipeline-with-Self-Healing-Infrastructure-Real-Time-Alerting](https://github.com/Coderitzz/ZeroTouch-Deploy-CI-CD-Pipeline-with-Self-Healing-Infrastructure-Real-Time-Alerting.git)

The application consists of:

* **Frontend → React (served via Nginx)**
* **Backend → Flask API (Dockerized, Gunicorn)**
* **Registry → Amazon ECR**
* **Orchestration → Jenkins (self-hosted on EC2)**

---

## Architecture Overview

```text
                          GitHub (push to main)
                                 │
                                 ▼
                    Jenkins SCM Polling (schedule)
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │   Jenkins Server     │
                    │   (EC2, public       │
                    │    subnet)           │
                    │-----------------------│
                    │ 1. Checkout           │
                    │ 2. Build images       │
                    │ 3. Push to ECR        │
                    │ 4. Trigger ASG        │
                    │    Instance Refresh   │
                    └──────────┬────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Application Load    │
                    │  Balancer (public)   │
                    │-----------------------│
                    │ /api/*  → Backend TG  │
                    │ /*      → Frontend TG │
                    └──────────┬────────────┘
                               │
                               ▼
                ┌───────────────────────────┐
                │   Auto Scaling Group       │
                │   (private subnets, 2 AZs) │
                │-----------------------------│
                │  EC2 instance(s)            │
                │  ├── nginx  (frontend :80)  │
                │  └── gunicorn (backend:5000)│
                └──────────────┬──────────────┘
                               │
                               ▼
                  CloudWatch Alarms (target health)
                               │
                               ▼
                        SNS → Email Alerts

Terraform → Infrastructure Provisioning (VPC, IAM, ASG, ALB, ECR, Jenkins)
Docker    → Application Containerization
Jenkins   → CI/CD Orchestration
CloudWatch/SNS → Health Monitoring & Alerting
S3        → Terraform Remote State
```

---

## Technologies Used

| Layer               | Technology                              |
| -------------------- | ---------------------------------------- |
| Infrastructure        | Terraform (modular)                      |
| Cloud Provider         | AWS                                       |
| Networking             | VPC, Public & Private Subnets, NAT Gateway |
| Compute                | EC2, Auto Scaling Group, Launch Templates |
| Load Balancing         | Application Load Balancer (path-based routing) |
| Containerization       | Docker, Docker Compose                    |
| Container Registry      | Amazon ECR                                |
| CI/CD                  | Jenkins (self-hosted on EC2)              |
| Backend                 | Flask (Python), Gunicorn                  |
| Frontend                | React, served via Nginx                   |
| Monitoring & Alerting    | Amazon CloudWatch Alarms, SNS             |
| IAM                     | Least-privilege instance roles (App, Jenkins) |
| State Management         | AWS S3 (remote Terraform state)           |

---

## Project Structure

```plaintext
zerotouch-deploy/
│
├── main.tf
├── variables.tf
├── output.tf
├── terraform.tfvars
├── Jenkinsfile
├── health_check.py
│
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   └── outputs.tf
│   │
│   ├── security_group/
│   │   ├── security.tf
│   │   ├── output.tf
│   │   └── variable.tf
│   │
│   ├── iam/
│   │   ├── main.tf
│   │   └── output.tf
│   │
│   ├── ecr/
│   │   ├── main.tf
│   │   ├── output.tf
│   │   └── variable.tf
│   │
│   ├── Launch_Template/
│   │   ├── main.tf
│   │   ├── output.tf
│   │   ├── variable.tf
│   │   └── user_data.sh
│   │
│   ├── asg/
│   │   ├── main.tf
│   │   └── variable.tf
│   │
│   ├── alb/
│   │   ├── main.tf
│   │   ├── monitor.tf
│   │   ├── output.tf
│   │   └── variable.tf
│   │
│   ├── jenkins/
│   │   ├── jenkins.tf
│   │   ├── jenkins_user_data.sh
│   │   └── variable.tf
│   │
│   └── s3/
│       └── backend.tf
│
└── sportshub/                      (application source)
    ├── README.md
    ├── docker-compose.yml
    │
    ├── backend/
    │   ├── Dockerfile
    │   ├── run.py
    │   ├── wsgi.py
    │   ├── config.py
    │   ├── seed.py
    │   ├── requirements.txt
    │   └── app/
    │       ├── __init__.py
    │       ├── models/
    │       │   └── models.py
    │       └── routes/
    │           ├── auth.py
    │           ├── cart.py
    │           ├── orders.py
    │           └── products.py
    │
    ├── frontend/
    │   ├── Dockerfile
    │   ├── nginx.docker.conf
    │   ├── vite.config.js
    │   ├── tailwind.config.js
    │   ├── package.json
    │   └── src/
    │
    └── deploy/
        ├── nginx.conf
        └── sportshub.service
```

---

## Features

✔ Infrastructure as Code using modular Terraform
✔ VPC with public & private subnet design across 2 AZs
✔ Auto Scaling Group with ELB-based health checks and automatic instance replacement
✔ Application Load Balancer with path-based routing (`/api/*` → backend, `/*` → frontend)
✔ Least-privilege IAM roles, separated for app instances vs. Jenkins
✔ Self-hosted Jenkins CI/CD server, provisioned via Terraform
✔ Automated Docker image build, tag (by Jenkins build number), and push to ECR on every push
✔ SCM polling-triggered pipeline — fully automated from `git push` to live deployment
✔ Automated instance refresh on every successful build
✔ CloudWatch alarms on target group health, with SNS email alerting
✔ Remote Terraform state in S3

---

## Prerequisites

Install locally:

* Terraform
* AWS CLI (configured with credentials that can provision the above resources)
* Docker
* Git
* An SSH key pair for EC2 access

---

## Step 1 — Clone Repositories

```bash
git clone https://github.com/Coderitzz/ZeroTouch-Deploy-CI-CD-Pipeline-with-Self-Healing-Infrastructure-Real-Time-Alerting.git
cd ZeroTouch-Deploy-CI-CD-Pipeline-with-Self-Healing-Infrastructure-Real-Time-Alerting
```

---

## Step 2 — Configure Terraform Variables

Create `terraform.tfvars`:

```hcl
my_ip     = "YOUR_PUBLIC_IP/32"
key_name  = "jenkins-key"
```

---

## Step 3 — Provision Infrastructure

```bash
terraform init
terraform plan
terraform apply
```

This provisions:

* VPC, public & private subnets, IGW, NAT Gateway
* Security groups (ALB, EC2, Jenkins)
* IAM roles & instance profiles (App, Jenkins)
* ECR repositories (frontend, backend)
* Launch Template + Auto Scaling Group
* Application Load Balancer, target groups, listener rules
* Jenkins EC2 instance (with Jenkins, Docker, AWS CLI auto-installed via user-data)
* CloudWatch alarms + SNS topic

---

## Step 4 — Configure Jenkins

1. Get the Jenkins server's public IP:

   ```bash
   terraform output jenkins_public_ip
   ```

2. SSH in and retrieve the initial admin password:

   ```bash
   ssh -i ~/.ssh/jenkins-key ubuntu@<jenkins-public-ip>
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```

3. Open `http://<jenkins-public-ip>:8080`, complete setup, install suggested plugins plus **Docker Pipeline** and **GitHub Integration**.

4. Create a new **Pipeline** job, pointing at this repo's `Jenkinsfile`. Under **Build Triggers**, enable **"Poll SCM"** and set a schedule (e.g., `H/5 * * * *` to check for new commits every 5 minutes). Jenkins compares the latest commit on `main` against its last build on each poll and automatically starts a new build if changes are found — no inbound access to Jenkins from GitHub is required.

---

## Step 5 — Subscribe to Alerts

SNS topic `sportshub-alerts` is created via Terraform. Subscribe manually via the AWS Console (SNS → Topics → `sportshub-alerts` → Create subscription → Email) to avoid confirmation-link race conditions with automated spam scanners.

---

## Step 6 — Deploy

Push to `main` in the application repository. Jenkins will automatically:

1. Check out the latest code
2. Build backend and frontend Docker images, tagged with the Jenkins build number and `latest`
3. Push both to ECR
4. Trigger an Auto Scaling Group instance refresh
5. Wait for the refresh to complete

---

## Step 7 — Access the Application

```text
http://<alb-dns-name>/
```

### Health Check

```text
GET /api/health
```

```json
{ "status": "ok" }
```

---

## Terraform Outputs

```bash
terraform output alb_dns_name
terraform output jenkins_public_ip
```

---

## Security Design

### Application Load Balancer

* Inbound: HTTP (80) from `0.0.0.0/0`

### App Instances (private subnets)

* Inbound: port 80 & 5000 from ALB security group only
* Inbound: SSH (22) restricted to a single IP variable
* Outbound: all (for ECR pulls, package installs via NAT Gateway)

### Jenkins Server (public subnet)

* Inbound: SSH (22) and 8080 — currently open for development; scoped to a single IP recommended for production
* Attached IAM role scoped to ECR push/pull, ASG describe/update, ALB describe, SSM parameter access

### IAM

* Two distinct roles: `app_instance_role` (ECR read-only) and `jenkins_role` (broader CI/CD permissions) — deliberately separated so app instances never hold deployment-level permissions

---

## Monitoring & Self-Healing Design

Real-time visibility into deployment health is the core focus of this project, built on a combination of AWS-native mechanisms:

* **Auto Scaling Group** — `health_check_type = "ELB"` continuously verifies real application health (via `/api/health`) rather than just instance-level status. Any instance that fails health checks is automatically terminated and replaced, keeping the fleet self-healing with no manual intervention.
* **CloudWatch Alarms** — monitor `UnHealthyHostCount` on both the frontend and backend target groups, evaluated over 2-minute windows, giving a clear, queryable signal of deployment health at all times.
* **SNS** — delivers immediate email alerts on both alarm (`ALARM`) and recovery (`OK`) state transitions, so health events are known the moment they happen, without needing to poll dashboards.

This was tested end-to-end by deliberately freezing a running container (`docker pause`) and confirming the full loop: target health transitioned to unhealthy, the ASG's self-healing replacement engaged, the CloudWatch alarm fired, and an SNS email alert was received — then verifying full recovery and an "OK" notification once resolved.

---

## Cleanup

```bash
terraform destroy
```

---

## Project Purpose

This project demonstrates:

* Infrastructure as Code with modular, reusable Terraform
* Secure, layered AWS networking (public/private subnets, least-privilege security groups and IAM)
* Full CI/CD automation from source push to live deployment
* Container-based application delivery via ECR
* Real-time, production-style health monitoring and alerting on top of self-healing infrastructure

---

## Outcome

After successful deployment:

✔ Public Application Load Balancer routing to a Dockerized React + Flask application
✔ Auto Scaling Group maintaining healthy, self-healing capacity across 2 AZs
✔ Fully automated Jenkins pipeline — every push to `main` results in a new, verified deployment
✔ CloudWatch + SNS providing real-time visibility into deployment health
✔ End-to-end infrastructure reproducible from Terraform code alone
