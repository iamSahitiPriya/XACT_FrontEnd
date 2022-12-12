import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "mochawesome",
    mochawesomeReporterOptions: {
      reportDir: "mochawesome-report",
      overwrite: false,
      html: true,
      json: false,
      timestamp: "mmddyyyy_HHMMss",
      showSkipped: true,
      charts: true,
      quiet: true,
      embeddedScreenshots: true,
      testFiles: "**/*.feature",
    },
  },

  retries: {
    runMode: 1,
  },

  screenshotOnRunFailure: true,
  screenshotsFolder: "mochawesome-report/assets/screenshots",
  videosFolder: "mochawesome-report/assets/videos",
  viewportWidth: 1920,
  viewportHeight: 1080,
  requestTimeout: 10000,
  responseTimeout: 10000,
  defaultCommandTimeout: 10000,
  redirectionLimit: 500,
  watchForFileChanges: false,
  chromeWebSecurity: false,


  env: {
    FOO: "bar",
  },

  projectId: "rjmg83",

  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-grep/src/plugin')(config);
      return config;
    },
    baseUrl: "https://dev.xact.thoughtworks.net/",
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },


});
