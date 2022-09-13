/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ParameterLevelRecommendation} from "./parameterLevelRecommendation";

export interface ParameterRatingAndRecommendation {
  "parameterId": number;
  "rating"?: number;
  "parameterLevelRecommendation"?: ParameterLevelRecommendation[];

}
