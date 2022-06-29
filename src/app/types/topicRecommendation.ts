import {TopicRecommendationStructure} from "./topicRecommendationStructure";

export interface TopicRecommendation {
  "assessmentId": number,
  "topicId":number,
  "recommendation"?: TopicRecommendationStructure
}
