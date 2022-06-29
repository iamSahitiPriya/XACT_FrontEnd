import {AnswerStructure} from "./answerStructure";

export interface AssessmentNotes {
  "assessmentId": number,
  "questionId"?:number,
  "notes"?:AnswerStructure
}
