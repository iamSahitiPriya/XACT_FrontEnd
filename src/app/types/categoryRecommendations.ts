/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Recommendation} from "./recommendation";

export interface CategoryRecommendations {
  categoryName : string
  recommendations : Recommendation [];
}
