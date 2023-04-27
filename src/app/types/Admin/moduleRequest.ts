/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ContributorStructure} from "../Contributor/ContributorStructure";

export interface ModuleRequest {
  moduleId ?: number
  moduleName: string
  category : number
  active : boolean
  contributors?:ContributorStructure[]
  comments ?: string
}

