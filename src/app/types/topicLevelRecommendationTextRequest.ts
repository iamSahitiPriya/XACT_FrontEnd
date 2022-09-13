/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {TopicLevelRecommendation} from "./topicLevelRecommendation";

export interface TopicLevelRecommendationTextRequest {
  "assessmentId": number,
  "topicId": number,
  "topicLevelRecommendation": TopicLevelRecommendation;
}
