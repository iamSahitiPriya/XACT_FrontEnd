import {ParameterLevelRecommendation} from "./parameterLevelRecommendation";

export interface ParameterRecommendation {
  "assessmentId": number,
  "parameterId": number,
  "parameterLevelRecommendation"?: ParameterLevelRecommendation[]
}
