Feature: Upload file to S3 and validate Lambda trigger

  Scenario: Lambda should be triggered when a file is uploaded to S3
    Given an AWS Lambda function is configured with an S3 trigger
    When I upload a file "sampledata.json" to S3
    Then the Lambda function should be triggered