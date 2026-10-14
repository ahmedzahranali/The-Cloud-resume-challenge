# Cloud Resume Challenge

Ahmed Zahran Ali's portfolio combines a static HTML/CSS/JavaScript frontend with a Python AWS Lambda visitor counter backed by DynamoDB.

## Website

https://mydevopsresume.com

The frontend includes a dark aurora background, section navigation, a persistent background-motion preference, reduced-motion support, certification details, and a print layout. It uses system fonts without requiring local font downloads.

## Architecture and infrastructure coverage

The website uses S3 and CloudFront for delivery. The frontend sends visitor-counter requests to API Gateway, which invokes Lambda and updates DynamoDB atomically.

Terraform in this repository defines:

- The frontend S3 bucket in `us-east-2`.
- Lambda, its execution role and DynamoDB table in `us-east-1`.
- New Lambda error monitoring and SNS email notifications in `us-east-1`, with legacy `us-east-2` monitoring retained during migration.
- An encrypted S3 remote-state backend with state locking in `us-east-2`.

CloudFront, API Gateway, DNS/TLS, the GitHub OIDC provider and deployment role, the remote-state bucket, and the referenced Lambda logging policy are external prerequisites; they are not provisioned by the checked-in Terraform. This repository alone does not recreate the entire deployed environment.

## Repository layout

| Directory | Purpose |
|---|---|
| `frontend/` | Portfolio HTML, CSS and JavaScript |
| `backend/` | Python Lambda handler and mocked DynamoDB tests |
| `infra/` | Terraform resource definitions |
| `tests/` | Playwright browser tests |
| `.github/workflows/` | Validation and deployment workflows |

## Local checks

Use Python 3.12, Node.js 20 and Terraform 1.10 or newer (required for S3 lockfiles).

```sh
python -m venv .venv
. .venv/bin/activate
pip install pytest moto boto3
(cd backend && python -m pytest)
npm ci
npx playwright install --with-deps chromium
npm test
(cd infra && terraform init -backend=false && terraform fmt -check && terraform validate)
```

Playwright starts a local HTTP server and tests desktop and mobile layouts. The visitor API is mocked so tests do not modify the production counter. Checks cover counter success and failure, motion preference persistence, critical content, viewport overflow, and printing. Backend tests cover an empty database and existing counts.

To browse locally:

```sh
python3 -m http.server 8000 --directory frontend
```

Open http://localhost:8000. Browsing manually uses the real visitor API.

## CI/CD

Pull requests to `main` run backend tests, Terraform formatting/validation, and Playwright checks. Pushes to `main` run the same checks and deploy only after all quality gates pass.

Deployment authenticates through AWS OIDC, applies Terraform, syncs frontend assets to S3, invalidates CloudFront, then packages and updates Lambda. Configure `AWS_S3_BUCKET` and `CLOUDFRONT_DISTRIBUTION_ID` as GitHub Actions secrets and ensure the deployment role trusts the appropriate repository and branch.

Lambda code is deployed by the workflow rather than Terraform. Its Terraform resource ignores package changes and references `function.zip`; a fresh environment requires a valid package at the Terraform working directory before creation. The existing workflow is oriented toward an already provisioned environment.

Monitoring migration preserves the original resource addresses on the default Ohio provider and creates separate alarm, topic and subscription resources in N. Virginia. Review the Terraform plan: existing Ohio monitoring should remain, with three new Virginia monitoring resources added. Confirm the new SNS email subscription, then verify Virginia alerts before retiring Ohio monitoring in a separate change. No state removal or manual resource deletion is needed for this migration.

## About

Ahmed Zahran Ali is an AWS Certified Solutions Architect – Associate and AWS Certified Cloud Practitioner focused on DevOps, Linux, Kubernetes and OpenShift.

## Next improvements

- Bring CloudFront, API Gateway, OIDC and remaining prerequisites under Terraform.
- Package Lambda reproducibly before Terraform and remove account-specific policy dependencies.
- Add documented OpenShift lab projects, architecture diagrams and project links.
- Add API rate limiting and expand operational dashboards.
