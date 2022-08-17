/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import appPackage  from '../../package.json';

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
  SAVE_ASSESSMENT_ANSWER_URI: "/v1/assessments/answers",
  SAVE_TOPIC_RECOMMENDATION_TEXT_URI:"/v1/assessments/topicRecommendationText",
  SAVE_TOPIC_RECOMMENDATION_FIELD_URI:"/v1/assessments/topicRecommendationFields",
  SAVE_PARAMETER_RECOMMENDATION_URI:"/v1/assessments/parameterRecommendation",
  SAVE_TOPIC_RATING_URI:"/v1/assessments/topicRating",
  SAVE_PARAMETER_RATING_URI:"/v1/assessments/parameterRating",
  VERSION: appPackage && appPackage.version,
  DELETE_TOPIC_RECOMMENDATION_URI: "/v1/assessments/deleteRecommendation",
  SAVE_PARAMETER_RECOMMENDATION_TEXT_URI: "/v1/assessments/parameterRecommendation",
  SAVE_PARAMETER_RECOMMENDATION_FIELD_URI:"/v1/assessments/parameterRecommendation",
  DELETE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/parameterRecommendation/deleteRecommendation",
};
