/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {TopicRequest} from "./topicRequest";

export interface SaveRequest {
  "assessmentId": number,
  "topicRequest": TopicRequest
}
