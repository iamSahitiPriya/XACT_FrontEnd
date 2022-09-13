/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface TopicRecommendationResponse {
  "assessmentId": number;
  "topicId": number;
  "recommendationId"?: number;
  "recommendation"?: string;
  "impact"?: string;
  "effort"?: string;
  "deliveryHorizon"?: string;
}
