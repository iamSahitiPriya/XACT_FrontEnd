/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export const environment = {
  production: true,
  BaseURI:"https://api.project-xact.in",
  ISSUER: '{ISSUER}',
  CLIENT_ID: '{CLIENT_ID}',
  REDIRECT_URI:"https://www.project-xact.in/login/callback",
  ASSESSMENT_URI:"/v1/assessments",
  USER_URI: "/v1/users",
  CATEGORY_URI:"/v1/assessment-master-data/categories",
  OKTA_TESTING_DISABLEHTTPSCHECK: false,
  SAVE_ASSESSMENT_URI: "/v1/notes",
  ASSESSMENT_REPORT_URI: "/v1/reports/assessments/"
};
