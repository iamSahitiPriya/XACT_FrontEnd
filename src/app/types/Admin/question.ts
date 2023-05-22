/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {QuestionReference} from "../QuestionReference";

export interface Question {
  questionId: number,
  questionText: string,
  parameter: number,
  status?:string,
  isEdit ?: boolean,
  comments?:string,
  isReferenceOpened ?: boolean
  references ?: QuestionReference[]
}

