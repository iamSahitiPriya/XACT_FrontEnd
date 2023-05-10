/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ParameterStructure} from "./parameterStructure";
import {TopicReference} from "./topicReference";

export interface TopicStructure {
  topicId: number,
  topicName: string,
  active: boolean,
  module: number,
  updatedAt:number,
  comments?:string,
  topicLevelReference ?: boolean
  parameters: ParameterStructure[],
  references: TopicReference[]
}
