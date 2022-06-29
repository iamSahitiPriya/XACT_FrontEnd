import {ParameterRecommendationStructure} from "./parameterRecommendationStructure";

export interface ParameterRecommendation{
  "assessmentId": number,
  "parameterId":number,
  "recommendation"?: ParameterRecommendationStructure
}
