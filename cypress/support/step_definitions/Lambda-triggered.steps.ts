
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const bucketName = "sqs-postgresql-bucket";
const lambdaLogGroup = "/aws/lambda/deu-poc-s3-event-processor";

Given(
  "an AWS Lambda function is configured with an S3 trigger",
  () => {
    cy.log("Precondition: Lambda + S3 trigger configured");
  }
);

When(
  "I upload a file {string} to S3",
  (fileName: string) => {
    cy.wrap(Date.now()).as("uploadStartTime")

    cy.task("s3Upload", {
      bucket: bucketName,
      key: fileName,
      filePath: `cypress/fixtures/${fileName}`,
    })
  }
);

Then(
  "the Lambda function should be triggered",
  () => {
    cy.get<number>("@uploadStartTime").then((startTime) => {
      cy.wait(25000)

      cy.task("checkLambdaTriggered", {
        logGroupName: lambdaLogGroup,
        startTime,
      }).then((triggered) => {
        expect(triggered).to.equal(true)
      })
    })
  }
);
