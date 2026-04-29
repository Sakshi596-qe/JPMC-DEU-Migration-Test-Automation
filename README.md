# Cypress Automation Framework

This repository contains an end-to-end automation framework built using Cypress, TypeScript, Cucumber (BDD), and AWS SDK, with HTML reporting via Mochawesome.

It is designed to validate AWS S3 file upload and verification scenarios following best practices for security, maintainability, and CI/CD readiness.

---

## Tech Stack

- Cypress (v15+)
- TypeScript
- Cucumber (BDD) – `.feature` files
- @badeball/cypress-cucumber-preprocessor
- AWS SDK
- Mochawesome HTML Reporter
- esbuild

---

## Project Structure

```
.
├── cypress/
│   ├── e2e/
│   │   └── features/
│   │       └── s3-upload.feature
│   │
│   ├── support/
│   │   └── step_definitions/
│   │       └── s3-upload.ts
│   │
│   ├── fixtures/
│   │   └── sample.txt
│   │
│   ├── reports/
│   │   └── mochawesome.html
│   │
│   └── screenshots/
│
├── cypress.config.ts
├── package.json
├── tsconfig.json
└── README.md

```

---

## Prerequisites

- Node.js >= 18
- npm
- AWS IAM user with S3 access

---

## AWS Environment Setup

Set AWS credentials as environment variables.

### Windows (PowerShell)

setx AWS_ACCESS_KEY_ID "YOUR_ACCESS_KEY"  
setx AWS_SECRET_ACCESS_KEY "YOUR_SECRET_KEY"  
setx AWS_REGION "us-east-1"

Restart the terminal after setting variables.

### macOS / Linux

export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"  
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY"  
export AWS_REGION="us-east-1"

---

## Required IAM Permissions

{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::<bucket-name>",
    "arn:aws:s3:::<bucket-name>/*"
  ]
}

---

## Install Dependencies

npm install

---

## Running Tests

Run all tests in headless mode:

npx cypress run

Open Cypress Test Runner:

npx cypress open

---

## Writing Tests (Cucumber)

### Feature File Example

Feature: Upload and Verify File in AWS S3

Scenario: Successfully upload a file to S3  
  Given I upload file "sample.txt" to S3 bucket "my-test-bucket"  
  Then the upload should succeed

---

## HTML Test Report

HTML reports are generated using Mochawesome.

Report location:

cypress/reports/mochawesome.html

The report includes:
- Feature and scenario results
- Pass/fail summary
- Execution duration
- Error stack traces
- Screenshots for failed tests

Open the HTML file in a browser to view the report.

---

## Best Practices

- AWS secrets are never committed to the repository
- Backend operations are handled using cy.task()
- Environment variables are used for sensitive data
- Framework is CI/CD ready

---

## Things to Avoid

- Do not hardcode AWS credentials
- Do not commit .env or credential files
- Do not use AWS SDK directly in Cypress test files

---

## Future Enhancements

- S3 object validation
- File download and content assertions
- Cleanup of test data from S3
- CI/CD pipeline integration
- Custom HTML report theming