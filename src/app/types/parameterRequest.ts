/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Notes} from "./answerRequest";
import {ParameterRatingAndRecommendation} from "./parameterRatingAndRecommendation";
import {UserQuestion} from "./UserQuestion";
import {UserQuestionRequest} from "./userQuestionRequest";
import {UserQuestionSaveRequest} from "./userQuestionSaveRequest";


export interface ParameterRequest {
  "answerRequest": Notes[];
  "userQuestionRequestList":UserQuestionSaveRequest[];
  "parameterRatingAndRecommendation": ParameterRatingAndRecommendation;
}
