/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {TopicLevelRecommendation} from "./topicLevelRecommendation";

export interface TopicRatingAndRecommendation {
  "topicId": number;
  "rating"?: number;
  "topicLevelRecommendation"?: TopicLevelRecommendation[];
}
