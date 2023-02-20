/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface TopicRequest {
  module : number
  topicName : string
  active : boolean
  comments ?: string
  topicId ?: number
}
