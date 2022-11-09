/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {AssessmentStructure} from "../types/assessmentStructure";
import {TopicRatingResponse} from "../types/topicRatingResponse";

export interface AppStates {
  assessmentState: AssessmentState;
  computedScore: ComputedScore
}

export interface AssessmentState {
  assessments: AssessmentStructure;

}

export interface ComputedScore {
  scoreDetails: TopicRatingResponse;
}





