/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import appPackage from '../../package.json';

export const environment = {
  production: false,
  BaseURI: "https://api-dev.xact.thoughtworks.net",
  ISSUER: '{ISSUER}',
  CLIENT_ID: '{CLIENT_ID}',
  REDIRECT_URI: "https://dev.xact.thoughtworks.net/login/callback",
  OKTA_TESTING_DISABLEHTTPSCHECK: false,
  ASSESSMENT_URI: "/v1/assessments",
  USER_URI: "/v1/users",
  CATEGORY_URI: "/v1/assessment-master-data/categories",
  SAVE_ASSESSMENT_URI: "/v1/assessments/notes",
  ASSESSMENT_REPORT_URI: "/v1/reports/assessments/",
  ASSESSMENT_STATUS_FINISH_URI: "/statuses/finish",
  ASSESSMENT_STATUS_OPEN_URI: "/statuses/open",
  SAVE_ASSESSMENT_ANSWER_URI: "/v1/assessments/answers",
  SAVE_TOPIC_RECOMMENDATION_URI: "/v1/assessments/topicRecommendation",
  SAVE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/parameterRecommendation",
  SAVE_TOPIC_RATING_URI: "/v1/assessments/topicRating",
  SAVE_PARAMETER_RATING_URI: "/v1/assessments/parameterRating",
  VERSION: appPackage && appPackage.version
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
