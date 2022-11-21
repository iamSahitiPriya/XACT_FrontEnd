/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ModuleStructure} from "./moduleStructure";


export interface CategoryResponse {
  categoryId:number,
  categoryName:string,
  active:boolean,
  updatedAt : number,
  comments ?: string,
  modules:ModuleStructure[]
}
