/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface TopicReference {
  referenceId ?: number,
  topic: number,
  rating: number,
  reference: string
  isEdit ?: boolean
}
