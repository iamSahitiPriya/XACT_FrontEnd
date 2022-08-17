import {ParameterLevelRecommendation} from "./parameterLevelRecommendation";

export interface ParameterRatingAndRecommendation {
  "parameterId": number;
  "rating"?: number;
  "parameterLevelRecommendation"?: ParameterLevelRecommendation[];
}
