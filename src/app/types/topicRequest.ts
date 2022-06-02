import {TopicRatingAndRecommendation} from "./topicRatingAndRecommendation";
import {ParameterRequest} from "./parameterRequest";


export interface TopicRequest {
  "parameterLevel": ParameterRequest[];
  "topicRatingAndRecommendation": TopicRatingAndRecommendation;
}
