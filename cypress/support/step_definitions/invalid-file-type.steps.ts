import {When, Then } from "@badeball/cypress-cucumber-preprocessor";

const bucketName = "sqs-postgresql-bucket";
const lambdaLogGroup = "/aws/lambda/your-lambda-function-name";

let uploadStartTime: number;


When(
  "I upload an invalid file {string} to the S3 bucket",
  (fileName: string) => {
    cy.wrap(Date.now()).as("uploadStartTime");

    cy.task("s3Upload", {
      bucket: bucketName,
      key: fileName,
      filePath: `cypress/fixtures/${fileName}`,
    });
  }
);


Then(
  "the Lambda should log an error with code {string}",
  (errorCode: string) => {
    cy.get<number>("@uploadStartTime").then((startTime) => {
      cy.wait(15000);

      cy.task("checkLambdaErrorLog", {
        logGroupName: lambdaLogGroup,
        startTime,
        errorCode,
      }).then((found: unknown) => {
        expect(found as boolean).to.eq(true);
        cy.log(`Verified Lambda logged error with code: ${errorCode}`);
        cy.log("Upload File not allowed as expected - Lambda error logged successfully");
      });
    });
  }
);