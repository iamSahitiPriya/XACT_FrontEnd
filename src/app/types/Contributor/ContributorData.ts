/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


import {Question} from "./Question";

export interface ContributorData {
  categoryName : string
  moduleName : string
  topicName : string
  parameterName : string
  questions : Question[]
  isClicked?:boolean
}
