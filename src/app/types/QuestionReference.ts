/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface QuestionReference {
  referenceId ?: number,
  question: number,
  rating: number,
  reference: string
  isEdit ?: boolean
}
