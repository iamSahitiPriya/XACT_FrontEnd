import {AssessmentStructure} from "../types/assessmentStructure";
import {TopicRatingResponse} from "../types/topicRatingResponse";

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
  scoreDetails: TopicRatingResponse;
}





