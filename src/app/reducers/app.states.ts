import {AssessmentStructure} from "../types/assessmentStructure";

export interface AppStates{
  readonly assessmentState:AssessmentState;
}

export interface AssessmentState{
  assessments:AssessmentStructure;
}
