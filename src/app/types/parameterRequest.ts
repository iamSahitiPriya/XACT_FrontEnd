import {Notes} from "./answerRequest";
import {ParameterRatingAndRecommendation} from "./parameterRatingAndRecommendation";

export interface ParameterRequest {
  "answerRequest": Notes[];
  "parameterRatingAndRecommendation": ParameterRatingAndRecommendation;
}