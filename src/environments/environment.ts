/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export const environment = {
  production: false,
  BaseURI: "http://localhost:8000",
  ISSUER: "https://dev-47045452.okta.com/oauth2/default",
  CLIENT_ID: "0oa443ktg7gLqvg6X5d7",
  REDIRECT_URI: "http://localhost:4200/login/callback",
  ASSESSMENT_URI: "/v1/assessments",
  CATEGORY_URI:"/v1/assessment-master-data/categories",
  USER_URI: "/v1/users",
  OKTA_TESTING_DISABLEHTTPSCHECK: true,
  SAVE_ASSESSMENT_URI: "/v1/assessments/notes",
  ASSESSMENT_REPORT_URI: "/v1/reports/assessments/",
  ASSESSMENT_STATUS_FINISH_URI: "/statuses/finish",
  ASSESSMENT_STATUS_OPEN_URI: "/statuses/open",
};
