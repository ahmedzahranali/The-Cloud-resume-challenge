# The-Cloud-resume-challenge

This project is a high-availability, globally distributed professional portfolio designed to showcase cloud-native engineering skills. It features a dual-theme frontend, a serverless backend for visitor tracking, and a robust automation pipeline that ensures production stability through End-to-End (E2E) testing.
## Key Features

    Dual-Theme Interface: A professional UI featuring a "Tokyo Night" inspired Terminal theme for a low-eye-strain developer look and a modern "Floating Cloud" theme for a corporate aesthetic.

    Live Visitor Counter: A serverless integration using AWS Lambda and DynamoDB to track and display real-time site traffic.

    Quality Gate Automation: A CI/CD pipeline that blocks broken code from reaching production by running headless browser tests on every commit.

    Zero-Trust Deployment: Secure, secret-less authentication between GitHub Actions and AWS using OpenID Connect (OIDC).

    Professional Summary: Highlights a candidate for Junior Site Reliability Engineer (SRE) and DevOps roles with C1 English proficiency.

## Technical Architecture

The architecture follows AWS best practices for scalability, security, and cost-efficiency:

    Frontend Hosting: Static assets (HTML, CSS, JS) are hosted in an Amazon S3 bucket and served globally via Amazon CloudFront for low-latency delivery.

    Serverless API: A JavaScript-based visitor counter triggers an AWS Lambda function via API Gateway.

    Database: Amazon DynamoDB serves as a NoSQL data store to maintain the visitor count with high availability.

    Observability: Proactive monitoring is established using Amazon CloudWatch alarms and SNS notifications to alert on system errors or billing thresholds.

    Infrastructure as Code (IaC): All cloud resources are provisioned and managed using Terraform to ensure environment consistency and repeatability.

## Project Structure

The repository is organized into distinct sub-directories to maintain a clear separation of concerns, reflecting a production-grade DevOps environment:
Plaintext

.
├── .github/workflows/   # CI/CD pipeline definitions (GitHub Actions)
├── backend/             # Serverless logic (Python/Node.js) and DB schemas
├── frontend/            # Web assets (index.html, style.css, main.js)
├── infra/               # Infrastructure as Code (Terraform)
├── tests/               # Playwright End-to-End (E2E) test scripts
├── .gitignore           # Optimized to exclude node_modules and local artifacts
├── package.json         # Root configuration for the automated testing suite
└── README.md            # Project documentation

## CI/CD Pipeline & Quality Gate

The project utilizes GitHub Actions to automate the entire lifecycle. The pipeline is divided into two mandatory stages:
### 1. The Quality Gate (Testing)

Before any code is deployed, the pipeline initializes a Linux runner to:

    Install project dependencies and Playwright browser binaries.

    Execute E2E tests against the frontend/ directory.

    Verify that critical UI elements (e.g., the visitor counter and theme toggle) are present and functional.

    Capture Evidence: On failure, the pipeline automatically uploads screenshots and videos as artifacts for rapid Root Cause Analysis (RCA).

### 2. The Deployment

Only if the Quality Gate passes, the pipeline proceeds to:

    Assume an IAM Role via OIDC (Zero-Trust).

    Sync the frontend/ directory to the production S3 bucket.

    Invalidate the CloudFront cache to ensure immediate global updates.

## Future Roadmap

    Containerization: Develop a Dockerfile for the frontend to explore portability with Kubernetes (K8s) or OpenShift.

    Advanced WAF Rules: Implement AWS Web Application Firewall (WAF) to add rate limiting and bot protection.

    Enhanced Observability: Build a custom CloudWatch dashboard to visualize Lambda execution times and error rates in real-time.

## About the Author

Ahmed Zahran is an emerging Cloud DevOps Engineer and Junior SRE candidate with a strong technical foundation in AWS, Linux Administration, and CI/CD automation. Currently pursuing AWS Certified Solutions Architect Associate and Certified Kubernetes Administrator (CKA) certifications to deepen expertise in orchestrating scalable, resilient cloud infrastructures.
