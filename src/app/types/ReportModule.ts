import {ReportTopic} from "./ReportTopic";

export interface ReportModule {
  "name": String,
  "rating": number,
  "children":ReportTopic[]
}
