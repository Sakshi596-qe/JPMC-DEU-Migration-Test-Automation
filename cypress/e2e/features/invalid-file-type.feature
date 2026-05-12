Feature: Reject invalid file types uploaded to S3

  Scenario Outline: Invalid file type is rejected by Lambda
    When I upload an invalid file "sample-5s.mpg" to the S3 bucket
    Then the Lambda should log an error with code "INVALID_FILE_TYPE"