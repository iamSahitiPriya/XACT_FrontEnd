/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export interface ParameterRequest {
  parameterId ?: number
  parameterName : string
  topic : number
  active ?: boolean
  comments ?: string
}
