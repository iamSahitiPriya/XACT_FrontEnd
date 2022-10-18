/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {TopicRatingAndRecommendation} from "./topicRatingAndRecommendation";
import {ParameterRequest} from "./parameterRequest";


export interface TopicRequest {
  "parameterLevel": ParameterRequest[];
  "topicRatingAndRecommendation": TopicRatingAndRecommendation;
}
