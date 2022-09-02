/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ModuleStructure} from "./moduleStructure";

export interface CategoryStructure {
  categoryId: number,
  categoryName: string,
  modules: ModuleStructure[]

}
