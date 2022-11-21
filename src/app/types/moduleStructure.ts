/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {TopicStructure} from "./topicStructure";

export interface ModuleStructure {
  moduleId: number,
  moduleName: string,
  category: number,
  active : boolean,
  topics: TopicStructure[]
}
