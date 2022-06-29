import {AssessmentStructure} from "../types/assessmentStructure";

export interface AppStates{
   assessmentState:AssessmentState;
}

export interface AssessmentState{
  assessments:AssessmentStructure;

}
export interface AssessmentStatus{
  assessmentStatus:string
}





