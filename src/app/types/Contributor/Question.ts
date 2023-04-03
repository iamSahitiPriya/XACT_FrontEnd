/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


export interface Question {
  questionId : number
  question : string
  comments : string
  status ?: string
  isEdit?: boolean
  isSelected ?: boolean
}
