/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {User} from "./user";

export interface AssessmentRequest {
  "assessmentName": string,
  "organisationName": string,
  "domain": string,
  "industry": string,
  "teamSize": number,
  "users": User[]

}
