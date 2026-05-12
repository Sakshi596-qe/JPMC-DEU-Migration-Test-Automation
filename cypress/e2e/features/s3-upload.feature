Feature: Upload and Verify File in AWS S3

  Scenario: Successfully upload a file to S3 and verify its presence
    Given I have a local test file "sampledata.json"
    When I upload the file to S3 bucket "deu-poc-bucket-madinenipavan" with key "cypress-tests/sampledata.json"
    Then the file should exist in the S3 bucket