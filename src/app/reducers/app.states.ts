/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {AssessmentStructure} from "../types/assessmentStructure";
import {TopicRatingResponse} from "../types/topicRatingResponse";
import {CategoryResponse} from "../types/categoryResponse";

export interface AppStates {
  assessmentState: AssessmentState;
  computedScore: ComputedScore
  masterData : MasterData
}

export interface AssessmentState {
  assessments: AssessmentStructure;

}

export interface ComputedScore {
  scoreDetails: TopicRatingResponse;
}

export interface MasterData {
  masterData : CategoryResponse[]
}





