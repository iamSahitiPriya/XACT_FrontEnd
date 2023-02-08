/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ReportParameter} from "./ReportParameter";

export interface ReportTopic {
  "name": string,
  "rating"?: number,
  "value"?:number,
  "children"?:ReportParameter[]
}
