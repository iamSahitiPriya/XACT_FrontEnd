/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ParameterStructure} from "./parameterStructure";
import {TopicReference} from "./topicReference";

export interface TopicStructure{
  topicId:number ,
  topicName:string,
  module:number,
  assessmentLevel:string,
  parameters:ParameterStructure[],
  references:TopicReference[]
}
