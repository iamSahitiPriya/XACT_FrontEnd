import {TopicLevelRecommendation} from "./topicLevelRecommendation";

export interface TopicRecommendationResponse{
  "topicId":number,
  "topicLevelRecommendation"?: TopicLevelRecommendation[]
}
