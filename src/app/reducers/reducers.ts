/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ActionReducerMap} from '@ngrx/store';
import {AppStates} from "./app.states";
import * as fromReducer from './assessment.reducer';

export const reducers: ActionReducerMap<AppStates> = {
  assessmentState: fromReducer.assessmentReducer,
  computedScore: fromReducer.scoreReducer,
  masterData : fromReducer.masterDataReducer,
  loggedInUserEmail:fromReducer.loggedInUserReducer,
  loggedInUserRole:fromReducer.loggedInUserRoleReducer
}

