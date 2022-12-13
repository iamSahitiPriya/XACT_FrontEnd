/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {TopicStructure} from "./topicStructure";

export  interface AssessmentModuleStructure {
  moduleId: number,
  moduleName: string,
  category: number,
  active:boolean,
  updatedAt : number,
  comments ?: string,
  selected : boolean,
  topics: TopicStructure[]
}

