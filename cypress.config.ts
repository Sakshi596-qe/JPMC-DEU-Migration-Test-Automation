import 'dotenv/config'
import { defineConfig } from 'cypress'
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
    specPattern: '**/*.feature',
    supportFile: false,

    async setupNodeEvents(on, config) {
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
      })

      return config
    },
  },

  allowCypressEnv: true,
})