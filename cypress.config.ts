import 'dotenv/config'
import { defineConfig } from 'cypress'
import type * as AWS from 'aws-sdk'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import {
  addCucumberPreprocessorPlugin,
} from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from
  '@badeball/cypress-cucumber-preprocessor/esbuild'

export default defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
  },

  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: false,
    taskTimeout: 120000,

    async setupNodeEvents(on, config) {
      const AWS = require("aws-sdk")
      await addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      )

      on('task', {
        async s3Upload({
          key,
          filePath,
          bucket,
        }: {
          key: string
          filePath: string
          bucket: string
        }) {
          const AWS = require('aws-sdk')
          const fs = require('fs')

          const s3 = new AWS.S3()
          const fileContent = fs.readFileSync(filePath)


          const params = {
            Bucket: bucket,
            Key: key,
            Body: fileContent,
          }

          return new Promise((resolve, reject) => {
            s3.upload(params, (err: any, data: any) => {
              if (err) reject(err)
              else resolve(data)
            })
          })
        },

        async s3ListObjects({ bucket }: { bucket: string }) {
          const AWS = require('aws-sdk')
          const s3 = new AWS.S3()

          return new Promise((resolve, reject) => {
            s3.listObjectsV2(
              { Bucket: bucket },
              (err: any, data: any) => {
                if (err) reject(err)
                else
                  resolve(
                    data.Contents?.map((item: any) => item.Key) || []
                  )
              }
            )
          })
        },

        //---------- LAMBDA TRIGGER VALIDATION ----------


        async checkLambdaTriggered({ logGroupName, startTime }) {
          const cloudWatch = new AWS.CloudWatchLogs()

          const response = await cloudWatch.filterLogEvents({
            logGroupName,
            startTime,
          }).promise()

          return Boolean(response.events && response.events.length > 0)
        },

        async checkLambdaErrorLog({
          logGroupName,
          startTime,
          errorCode,
        }) {
          const AWS = require("aws-sdk");
          const cloudWatch = new AWS.CloudWatchLogs();

          try {
            const response = await cloudWatch.filterLogEvents({
              logGroupName,
              startTime,
              limit: 20,
            }).promise();

            if (!response.events) return false;

            return response.events.some((event: { message?: string }) =>
              event.message && event.message.includes(errorCode)
            );
          } catch (error) {
            if ((error as any).code === "ResourceNotFoundException") {
              return false;
            }
            throw error;
          }
        }
      })

      return config
    },
  },

  allowCypressEnv: true,
})