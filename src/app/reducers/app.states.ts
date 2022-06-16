import {AssessmentStructure} from "../types/assessmentStructure";
import {TopicRequest} from "../types/topicRequest";

export interface AppStates{
   assessmentState:AssessmentState;
   topicState:TopicState
}

export interface AssessmentState{
  assessments:AssessmentStructure;
}
export interface AssessmentStatus{
  assessmentStatus:string
}

export interface TopicState{
  topicReq:TopicRequest
}


