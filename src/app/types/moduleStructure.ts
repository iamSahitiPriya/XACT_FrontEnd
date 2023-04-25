/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {TopicStructure} from "./topicStructure";
import {ContributorStructure} from "./Contributor/ContributorStructure";

export interface ModuleStructure {
  moduleId: number,
  moduleName: string,
  category: number,
  active:boolean,
  updatedAt : number,
  comments ?: string,
  contributors:ContributorStructure[]
  topics: TopicStructure[]
}
