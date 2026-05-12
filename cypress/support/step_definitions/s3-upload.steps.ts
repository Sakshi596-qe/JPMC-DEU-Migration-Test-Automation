import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const BUCKET_NAME = "deu-poc-bucket-madinenipavan";

Given("I have a local test file {string}", (fileName: string) => {
  cy.readFile(fileName).should("exist"); 
});

When(
  "I upload the file to S3 bucket {string} with key {string}",
  (bucket: string, key: string) => {
    cy.task("s3Upload", {
      key,
      filePath: "sampledata.json",
      bucket,
    }).then((result: any) => {
      cy.wrap(result).its("Location").should("include", bucket);
      cy.log(`File uploaded successfully: ${result.Location}`);
    });
  }
);

Then("the file should exist in the S3 bucket", () => {
  cy.task("s3ListObjects", { bucket: BUCKET_NAME }).then((keys) => {
    expect(keys).to.include("cypress-tests/sampledata.json");
    cy.log("File verified in S3 bucket");
  });
});