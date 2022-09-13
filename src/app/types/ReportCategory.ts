/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ReportModule} from "./ReportModule";

export interface ReportCategory {
  "name": String,
  "rating"?: number,
  "children"?:ReportModule[]
}
