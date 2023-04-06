/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


import {Topic} from "./Topic";

export interface Module {
  categoryId : number
  categoryName : string
  moduleName : string
  moduleId:number
  topics : Topic[]
}
