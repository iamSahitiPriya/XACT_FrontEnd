/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ParameterLevelRecommendation} from "./parameterLevelRecommendation";

export interface ParameterLevelRecommendationTextRequest {
  "assessmentId": number,
  "parameterId": number,
  "parameterLevelRecommendation": ParameterLevelRecommendation;
}