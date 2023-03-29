/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


import {Question} from "./Question";

export interface Parameter {
  parameterName : string
  parameterId : number
  questions : Question[]
}
