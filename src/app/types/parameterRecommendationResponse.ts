/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface ParameterRecommendationResponse {
  "assessmentId": number;
  "parameterId": number;
  "recommendationId"?: number;
  "recommendation"?: string;
  "impact"?: string;
  "effort"?: string;
  "deliveryHorizon"?: string;
}
