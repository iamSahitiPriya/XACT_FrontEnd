/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface CategoryRequest {
  categoryName : string
  active : boolean
  comments ?: string
  categoryId ?:number
}

