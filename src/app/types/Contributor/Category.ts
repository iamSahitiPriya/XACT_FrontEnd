/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Module} from "./Module";

export interface Category {
  categoryName : string
  categoryId : number
  modules : Module[]
}
