/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {QuestionStructure} from "./questionStructure";
import {ParameterReference} from "./parameterReference";

export interface ParameterStructure {
  parameterId: number,
  parameterName: string,
  topic: number,
  active:boolean,
  updatedAt:number,
  comments?:string,
  questions: QuestionStructure[],
  references: ParameterReference[]
}
