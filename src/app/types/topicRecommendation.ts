import {TopicLevelRecommendation} from "./topicLevelRecommendation";

export interface TopicRecommendation {
  "assessmentId": number,
  "topicId": number,
  "topicLevelRecommendation"?: TopicLevelRecommendation[]
}
