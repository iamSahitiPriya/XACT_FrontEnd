/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import appPackage from '../../package.json';

export const environment = {
  production: true,
  BaseURI:"https://api.xact.thoughtworks.net",
  ISSUER: '{ISSUER}',
  CLIENT_ID: '{CLIENT_ID}',
  REDIRECT_URI:"https://xact.thoughtworks.net/login/callback",
  OKTA_TESTING_DISABLEHTTPSCHECK: false,
  ASSESSMENT_URI: "/v1/assessments",
  CATEGORY_URI:"/v1/assessment-master-data/categories",
  SAVE_ASSESSMENT_URI: "/v1/assessments/notes",
  ASSESSMENT_REPORT_URI: "/v1/reports/assessments/",
  ASSESSMENT_STATUS_FINISH_URI: "/statuses/finish",
  ASSESSMENT_STATUS_OPEN_URI: "/statuses/open",
  SAVE_ASSESSMENT_ANSWER_URI: "/v1/assessments/answers",
  SAVE_TOPIC_RECOMMENDATION_TEXT_URI:"/v1/assessments/topicRecommendationText",
  SAVE_TOPIC_RECOMMENDATION_FIELD_URI:"/v1/assessments/topicRecommendationFields",
  SAVE_PARAMETER_RECOMMENDATION_URI:"/v1/assessments/parameterRecommendation",
  SAVE_TOPIC_RATING_URI:"/v1/assessments/topicRating",
  SAVE_PARAMETER_RATING_URI:"/v1/assessments/parameterRating",
  VERSION: appPackage && appPackage.version,
  ROLE_URI:"/v1/users/roles",
  DELETE_TOPIC_RECOMMENDATION_URI: "/v1/assessments/deleteRecommendation",
  DELETE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/deleteParameterRecommendation",
  IDLE_TIMEOUT: 60,  //in sec
  TIMEOUT: 600, // 10 min
  ALL_CATEGORY_URI: "/v1/admin/categories",
  SAVE_CATEGORY_URI: "/v1/admin/categories",
  GET_ADMIN_ASSESSMENTS: "/v1/assessments/admin",
  ASSESSMENT_ADMIN_REPORT_URI:"/v1/reports/admin",
  UPDATE_CATEGORY_URI : "/v1/admin/categories",
  REPORT_DATA_URI:"/v1/reports/sunburst",
  REPORT_TEMPLATE_URI: "/v1/reports/template",
  USER_ASSESSMENT_MODULE_URI: "/v1/assessments/user/modules"
};
