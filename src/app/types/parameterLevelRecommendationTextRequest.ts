import {ParameterLevelRecommendation} from "./parameterLevelRecommendation";

export interface ParameterLevelRecommendationTextRequest {
  "assessmentId": number,
  "parameterId": number,
  "parameterLevelRecommendation": ParameterLevelRecommendation;
}
