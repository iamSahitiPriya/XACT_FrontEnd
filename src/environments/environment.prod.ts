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
  ASSESSMENT_REPORT_URI: "/v1/reports/",
  ASSESSMENT_STATUS_FINISH_URI: "/finish",
  ASSESSMENT_STATUS_OPEN_URI: "/open",
  SAVE_ASSESSMENT_ANSWER_URI: "/v1/assessments",
  SAVE_TOPIC_RECOMMENDATION_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/recommendations",
  SAVE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/${assessmentId}/parameters/${parameterId}/recommendations",
  SAVE_TOPIC_RATING_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/ratings",
  SAVE_PARAMETER_RATING_URI: "/v1/assessments/${assessmentId}/parameters/${parameterId}/ratings",
  VERSION: appPackage && appPackage.version,
  ROLE_URI:"/v1/users/roles",
  LOGIN_URI: "/v1/users/login",
  DELETE_TOPIC_RECOMMENDATION_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/recommendations/${recommendationId}",
  DELETE_PARAMETER_RECOMMENDATION_URI: "/v1/assessments/${assessmentId}/parameters/${parameterId}/recommendations/${recommendationId}",
  IDLE_TIMEOUT: 60,  //in sec
  TIMEOUT: 900, // 15 min
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
  SAVE_TOPIC_URI :"/v1/contributor/topics",
  UPDATE_TOPIC_URI : "/v1/contributor/topics",
  SAVE_TOPIC_REFERENCE_URI : "/v1/contributor/topic-references",
  DELETE_TOPIC_REFERENCE_URI : "/v1/contributor/topic-references",
  UPDATE_TOPIC_REFERENCE_URI : "/v1/contributor/topic-references",
  SAVE_PARAMETER_REFERENCE_URI: "/v1/contributor/parameter-references",
  DELETE_PARAMETER_REFERENCE_URI: "/v1/contributor/parameter-references",
  UPDATE_PARAMETER_REFERENCE_URI: "/v1/contributor/parameter-references",

  okta: {
    cookies: {
      secured: true
    },
    storage: {
      sessionStorage: 'sessionStorage'
    }
  },
  SAVE_MODULE_URI: "/v1/admin/modules",
  SAVE_PARAMETER_URI: "/v1/contributor/parameters",
  SAVE_QUESTION:"/v1/contributor/questions",
  SUMMARY_DATA:"/v1/reports/${assessmentId}/summary",
  RECOMMENDATIONS_URI:"/v1/reports/${assessmentId}/charts/roadmap",
  ACTIVITY_LOGS_URI: "/v1/assessments/${assessmentId}/topics/${topicId}/activities",
  CONTRIBUTOR_QUESTIONS_URI: "/v1/contributor/questions",
  UPDATE_CONTRIBUTOR_QUESTION : "/v1/contributor/questions/${questionId}",
  UPDATE_CONTRIBUTOR_STATUS_URI: "/v1/contributor/modules/${moduleId}/questions",
  DELETE_CONTRIBUTOR_QUESTION : "/v1/contributor/questions/${questionId}",
  SAVE_CONTRIBUTOR_URI: "/v1/admin/modules/${moduleId}/contributors",
  GET_ALL_USER_INFO_URI: "/v1/users",
  GET_ACCESS_CONTROL_URI: "/v1/admin",
  ADD_USER_URI: "/v1/admin/user"
};
