/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


import {Question} from "./Question";

export interface ContributorData {
  categoryId : number
  categoryName : string
  moduleId:number
  moduleName : string
  topicId : number
  topicName : string
  parameterId : number
  parameterName : string
  questions : Question[]
  isClicked?:boolean
  allSelected ?: boolean
}
