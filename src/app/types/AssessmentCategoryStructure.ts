/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


import {AssessmentModuleStructure} from "./AssessmentModuleStructure";

export interface AssessmentCategoryStructure {
  categoryId: number,
  categoryName: string,
  active : boolean;
  allComplete : boolean;
  modules: AssessmentModuleStructure[]
}

