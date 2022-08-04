import {TopicLevelRecommendation} from "./topicLevelRecommendation";

export interface TopicRecommendationResponse{
  "assessmentId":number;
  "topicId":number;
  "recommendationId"?:number;
  "recommendation"?:string;
}
