/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface Question {
  questionId: number,
  questionText: string,
  parameter: number,
  status?:string,
  isEdit ?: boolean
}

