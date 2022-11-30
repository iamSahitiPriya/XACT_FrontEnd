/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {QuestionStructure} from "./questionStructure";
import {ParameterReference} from "./parameterReference";
import {UserQuestion} from "./UserQuestion";

export interface ParameterStructure {
  parameterId: number,
  parameterName: string,
  topic: number,
  questions: QuestionStructure[],
  userQuestions: UserQuestion[],
  references: ParameterReference[]
}
