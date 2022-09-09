import {ReportModule} from "./ReportModule";

export interface ReportCategory {
  "name": String,
  "rating"?: number,
  "children"?:ReportModule[]
}
