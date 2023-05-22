/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ParameterReference} from "../parameterReference";
import {QuestionStructure} from "../questionStructure";

export interface ParameterResponse {
  moduleId : number;
  topicId : number;
  parameterId : number;
  parameterName : string;
  categoryId : number;
  updatedAt : number;
  comments ?: string
  active : boolean;
  parameterLevelReference ?: boolean,
  references ?: ParameterReference[]
  questions ?: QuestionStructure[]
}
