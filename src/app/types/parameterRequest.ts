/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Notes} from "./answerRequest";
import {ParameterRatingAndRecommendation} from "./parameterRatingAndRecommendation";

export interface ParameterRequest {
  "answerRequest": Notes[];
  "parameterRatingAndRecommendation": ParameterRatingAndRecommendation;
}
