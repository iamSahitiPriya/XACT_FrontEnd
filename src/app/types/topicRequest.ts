import {TopicRatingAndRecommendation} from "./topicRatingAndRecommendation";
import {ParameterRequest} from "./parameterRequest";



export interface TopicRequest {
  "parameterRequest": ParameterRequest[];
  "topicRatingAndRecommendation": TopicRatingAndRecommendation;
}
