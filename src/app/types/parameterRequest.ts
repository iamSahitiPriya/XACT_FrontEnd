/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Notes} from "./answerNotes";
import {ParameterRatingAndRecommendation} from "./parameterRatingAndRecommendation";
import {UserQuestionSaveRequest} from "./userQuestionSaveRequest";


export interface ParameterRequest {
  "answerRequest": Notes[];
  "userQuestionRequestList":UserQuestionSaveRequest[];
  "parameterRatingAndRecommendation": ParameterRatingAndRecommendation;
}
