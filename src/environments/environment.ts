/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import appPackage from '../../package.json';

export const environment = {
  production: false,
  BaseURI: "http://localhost:8000",
  ISSUER: "https://dev-47045452.okta.com/oauth2/default",
  CLIENT_ID: "0oa443ktg7gLqvg6X5d7",
  REDIRECT_URI: "http://localhost:4200/login/callback",
  OKTA_TESTING_DISABLEHTTPSCHECK: false,
  ASSESSMENT_URI: "/v1/assessments",
  CATEGORY_URI: "/v1/assessment-master-data",
  SAVE_ASSESSMENT_URI: "/v1/assessments/notes",
  ASSESSMENT_REPORT_URI: "/v1/reports/assessments/",
  ASSESSMENT_STATUS_FINISH_URI: "/statuses/finish",
  ASSESSMENT_STATUS_OPEN_URI: "/statuses/open",
  SAVE_ASSESSMENT_ANSWER_URI: "/v1/assessments/answers",
  SAVE_TOPIC_RECOMMENDATION_TEXT_URI: "/v1/assessments/topicRecommendationText",
  SAVE_TOPIC_RECOMMENDATION_FIELD_URI: "/v1/assessments/topicRecommendationFields",
  SAVE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/parameterRecommendation",
  SAVE_TOPIC_RATING_URI: "/v1/assessments/topicRating",
  SAVE_PARAMETER_RATING_URI: "/v1/assessments/parameterRating",
  VERSION: appPackage && appPackage.version,
  ROLE_URI: "/v1/users/roles",
  GET_ADMIN_ASSESSMENTS: "/v1/admin/assessments",
  ASSESSMENT_ADMIN_REPORT_URI: "/v1/reports/admin",
  DELETE_TOPIC_RECOMMENDATION_URI: "/v1/assessments/deleteRecommendation",
  DELETE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/deleteParameterRecommendation",
  ALL_CATEGORY_URI: "/v1/admin/categories",
  SAVE_CATEGORY_URI: "/v1/admin/categories",
  UPDATE_CATEGORY_URI: "/v1/admin/categories",
  IDLE_TIMEOUT: 10,  //in sec
  TIMEOUT: 12000, // 2 min
  REPORT_DATA_URI: "/v1/reports/sunburst",
  REPORT_TEMPLATE_URI: "/v1/reports/template",
  USER_ASSESSMENT_MODULE_URI: "/modules",
  ACCOUNT_URI : "/v1/accounts",
  CREATE_USER_QUESTION_URI:"/v1/assessments/user_question",
  DELETE_USER_QUESTION_URI:"/v1/assessments/deleteUserQuestion",

  okta: {
    cookies: {
      secured: false
    },
    storage: {
      sessionStorage: 'sessionStorage'
    }
  },
  ALL_MODULE_URI: "/v1/admin/modules",

};
