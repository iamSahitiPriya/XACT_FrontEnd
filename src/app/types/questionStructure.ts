/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {QuestionReference} from "./QuestionReference";

export interface QuestionStructure {
  questionId: number,
  questionText: string,
  status?:string,
  parameter: number,
  comments?:string
  references ?: QuestionReference[]
}
