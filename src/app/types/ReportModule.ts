/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ReportTopic} from "./ReportTopic";

export interface ReportModule {
  "name": String,
  "rating": number,
  "children":ReportTopic[]
}
