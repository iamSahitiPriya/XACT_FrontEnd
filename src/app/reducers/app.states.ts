import {AssessmentStructure} from "../types/assessmentStructure";

export interface AppStates{
   assessmentState:AssessmentState;
   computedScore:ComputedScore
}

export interface AssessmentState{
  assessments:AssessmentStructure;

}
export interface AssessmentStatus{
  assessmentStatus:string
}

export interface ComputedScore{
  computedScore:string
}





