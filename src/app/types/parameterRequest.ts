/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Notes} from "./answerRequest";
import {ParameterRatingAndRecommendation} from "./parameterRatingAndRecommendation";
import {UserQuestion} from "./UserQuestion";


export interface ParameterRequest {
  "answerRequest": Notes[];
  "userQuestionRequestList":UserQuestion[];
  "parameterRatingAndRecommendation": ParameterRatingAndRecommendation;
}
