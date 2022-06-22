import {AssessmentStructure} from "../types/assessmentStructure";
import {TopicRequest} from "../types/topicRequest";
import {TopicStructure} from "../types/topicStructure";

export interface AppStates{
   assessmentState:AssessmentState;
}

export interface AssessmentState{
  assessments:AssessmentStructure;

}
export interface AssessmentStatus{
  assessmentStatus:string
}



