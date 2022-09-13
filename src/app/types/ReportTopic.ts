import {ReportParameter} from "./ReportParameter";

export interface ReportTopic {
  "name": String,
  "rating"?: number,
  "values"?:number,
  "children"?:ReportParameter[]
}
