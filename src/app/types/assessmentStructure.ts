/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {AssessmentAnswerResponse} from "./AssessmentAnswerResponse";
import {ParameterRatingAndRecommendation} from "./parameterRatingAndRecommendation";
import {TopicRatingAndRecommendation} from "./topicRatingAndRecommendation";

export interface AssessmentStructure {
  "assessmentId": number,
  "assessmentName": string,
  "organisationName": string,
  "assessmentStatus": string,
  "domain": string,
  "industry": string,
  "drafted":boolean,
  "teamSize"?: number,
  "users": string[];
  "updatedAt": number,
  "answerResponseList": AssessmentAnswerResponse[],
  "parameterRatingAndRecommendation": ParameterRatingAndRecommendation[],
  "topicRatingAndRecommendation": TopicRatingAndRecommendation[]
}

