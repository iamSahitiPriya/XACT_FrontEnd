/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */


import {Parameter} from "./Parameter";

export interface Topic {
  topicName : string
  topicId : number
  parameters : Parameter[]

}
