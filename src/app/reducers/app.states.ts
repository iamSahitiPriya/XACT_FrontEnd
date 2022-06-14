import {AssessmentStructure} from "../types/assessmentStructure";
import {CategoryState} from "./categoryState.states";

export interface AppStates{
   assessmentState:AssessmentState;
}

export interface AssessmentState{
  assessments:AssessmentStructure;
}
export interface AssessmentStatus{
  assessmentStatus:string
}


