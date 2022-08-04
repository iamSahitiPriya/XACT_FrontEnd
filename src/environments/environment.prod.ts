/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import appPackage  from '../../package.json';

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
  SAVE_ASSESSMENT_URI: "/v1/assessments/notes",
  ASSESSMENT_REPORT_URI: "/v1/reports/assessments/",
  ASSESSMENT_STATUS_FINISH_URI: "/statuses/finish",
  ASSESSMENT_STATUS_OPEN_URI: "/statuses/open",
  SAVE_ASSESSMENT_ANSWER_URI: "/v1/assessments/answers",
  SAVE_TOPIC_RECOMMENDATION_TEXT_URI:"/v1/assessments/topicRecommendation",
  SAVE_PARAMETER_RECOMMENDATION_URI:"/v1/assessments/parameterRecommendation",
  SAVE_TOPIC_RATING_URI:"/v1/assessments/topicRating",
  SAVE_PARAMETER_RATING_URI:"/v1/assessments/parameterRating",
  VERSION: appPackage && appPackage.version
};
