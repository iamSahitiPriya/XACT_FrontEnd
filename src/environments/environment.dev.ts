// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BaseURI:"https://api-dev.project-xact.in",
  ISSUER: '{ISSUER}',
  CLIENT_ID: '{CLIENT_ID}',
  REDIRECT_URI:"https://dev.project-xact.in/login/callback",
  OKTA_TESTING_DISABLEHTTPSCHECK: false,
  // GET_ASSESSMENT_URI:"/v1/assessments/12345"
  GET_ASSESSMENT_URI:"/v1/assessments/open/technicalbaba4u@thoughtworks.com",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
