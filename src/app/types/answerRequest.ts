import {Notes} from "./notes";

export interface AnswerRequest {
  "assessmentId": number,
  "notes": Notes[]
}
