/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ReportParameter} from "./ReportParameter";

export interface ReportTopic {
  "name": string,
  "rating"?: number,
  "values"?:number,
  "children"?:ReportParameter[]
}
