/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import appPackage from '../../package.json';

export const environment = {
  production: false,
  BaseURI: "https://api-dev.xact.thoughtworks.net",
  ISSUER: '{ISSUER}',
  CLIENT_ID: '{CLIENT_ID}',
  REDIRECT_URI: "https://dev.xact.thoughtworks.net/login/callback",
  OKTA_TESTING_DISABLEHTTPSCHECK: false,
  ASSESSMENT_URI: "/v1/assessments",
  SAVE_ASSESSMENT_URI: "/v1/assessments/${assessmentId}/notes",
  ASSESSMENT_REPORT_URI: "/v1/reports/",
  ASSESSMENT_STATUS_FINISH_URI: "/finish",
  ASSESSMENT_STATUS_OPEN_URI: "/open",
  SAVE_ASSESSMENT_ANSWER_URI: "/v1/assessments",
  SAVE_TOPIC_RECOMMENDATION_TEXT_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/recommendations-text",
  SAVE_TOPIC_RECOMMENDATION_FIELD_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/recommendations-fields",
  SAVE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/${assessmentId}/parameters/${parameterId}/recommendations",
  SAVE_TOPIC_RATING_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/ratings",
  SAVE_PARAMETER_RATING_URI: "/v1/assessments/${assessmentId}/parameters/${parameterId}/ratings",
  VERSION: appPackage && appPackage.version,
  ROLE_URI:"/v1/users/roles",
  DELETE_TOPIC_RECOMMENDATION_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/recommendations/${recommendationId}",
  DELETE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/${assessmentId}/parameters/${parameterId}/recommendations/${recommendationId}",
  IDLE_TIMEOUT: 60,  //in sec
  TIMEOUT: 600, // 10 min
  ALL_CATEGORY_URI: "/v1/categories",
  SAVE_CATEGORY_URI: "/v1/admin/categories",
  GET_ADMIN_ASSESSMENTS: "/v1/admin/assessments",
  ASSESSMENT_ADMIN_REPORT_URI:"/v1/reports/admin",
  UPDATE_CATEGORY_URI : "/v1/admin/categories",
  REPORT_DATA_URI: "/charts/sunburst",
  REPORT_TEMPLATE_URI: "/v1/reports/template",
  USER_ASSESSMENT_MODULE_URI: "/modules",
  ACCOUNT_URI : "/v1/accounts",
  CREATE_UPDATE_DELETE_USER_QUESTION_URI:"/v1/assessments",
  SAVE_TOPIC_URI :"/v1/admin/topics",
  UPDATE_TOPIC_URI : "/v1/admin/topics",
  SAVE_TOPIC_REFERENCE_URI : "/v1/admin/topic-references",
  DELETE_TOPIC_REFERENCE_URI : "/v1/admin/topic-references",
  UPDATE_TOPIC_REFERENCE_URI : "/v1/admin/topic-references",
  SAVE_PARAMETER_REFERENCE_URI: "/v1/admin/parameter-references",
  DELETE_PARAMETER_REFERENCE_URI: "/v1/admin/parameter-references",
  UPDATE_PARAMETER_REFERENCE_URI: "/v1/admin/parameter-references",

  okta: {
    cookies: {
      secured: true
    },
    storage: {
      sessionStorage: 'sessionStorage'
    }
  },
  SAVE_MODULE_URI: "/v1/admin/modules",
  SAVE_PARAMETER_URI: "/v1/admin/parameters",
  UPDATE_QUESTION:"/v1/admin/questions",
  SAVE_QUESTION:"/v1/admin/questions",
  SUMMARY_DATA:"/v1/reports/summary"
};
