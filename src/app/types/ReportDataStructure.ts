/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ReportCategory} from "./ReportCategory";

export interface ReportDataStructure {
  "name": string,
  "children":ReportCategory[];
}
