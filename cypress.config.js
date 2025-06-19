const { defineConfig } = require("cypress");
const fs = require('fs');
const xml2js = require('xml2js');
const { MongoClient } = require('mongodb');

module.exports = defineConfig({
  video: true,
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {

      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on)
      on('task', {
        async clearMongoDB() {
          const uri = 'mongodb://localhost:27017/sports-management';
          const client = new MongoClient(uri);
          await client.connect();
          const db = client.db('test');
          await db.dropDatabase();
          await client.close();
          return null;
        },

        readXmlFile(filePath) {
          const xml = fs.readFileSync(filePath, 'utf8')
          return xml2js.parseStringPromise(xml)
        }

      });
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Delete video if all tests passed
          const allPassed = results.tests.every(test => test.state === 'passed');
          if (allPassed) {
            const fs = require('fs');
            fs.unlinkSync(results.video);
          }
        }
      });
    },
  },
  reporter: 'cypress-mochawesome-reporter',
  reporteroptions: {
    charts: true,
    reportDir: 'cypress/reports',
    reportPageTitle: 'Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: true,
    json: false
  }
});
