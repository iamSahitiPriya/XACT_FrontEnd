/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {AssessmentAnswerResponse} from "./AssessmentAnswerResponse";
import {ParameterRatingAndRecommendation} from "./parameterRatingAndRecommendation";
import {TopicRatingAndRecommendation} from "./topicRatingAndRecommendation";
import {UserQuestionResponse} from "./userQuestionResponse";

export interface AssessmentStructure {
  "assessmentId": number,
  "assessmentName": string,
  "assessmentPurpose":string,
  "assessmentDescription": string;
  "organisationName": string,
  "assessmentStatus": string,
  "domain": string,
  "industry": string,
  "assessmentState":string,
  "teamSize"?: number,
  "users": string[];
  "updatedAt": number,
  "answerResponseList": AssessmentAnswerResponse[],
  "parameterRatingAndRecommendation": ParameterRatingAndRecommendation[],
  "topicRatingAndRecommendation": TopicRatingAndRecommendation[],
  "userQuestionResponseList":UserQuestionResponse[]
  "owner":boolean
}

