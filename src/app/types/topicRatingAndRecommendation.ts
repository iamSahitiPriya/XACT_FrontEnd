import {TopicLevelRecommendation} from "./topicLevelRecommendation";

export interface TopicRatingAndRecommendation {
  "topicId": number;
  "rating"?: number;
  "topicLevelRecommendation"?: TopicLevelRecommendation[];
}
