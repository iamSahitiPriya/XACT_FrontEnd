/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface Recommendation {
  recommendationId: number;
  recommendation: string;
  deliveryHorizon: string;
  impact: string;
  effort: string;
  categoryName: string;
  updatedAt: number;
  category: number;
  module: number;
  topic: number;
}

