import {TopicLevelRecommendation} from "./topicLevelRecommendation";

export interface TopicLevelRecommendationTextRequest {
  "assessmentId": number,
  "topicId": number,
  "topicLevelRecommendation": TopicLevelRecommendation;
}
