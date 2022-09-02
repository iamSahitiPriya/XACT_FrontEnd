import {ActionReducerMap} from '@ngrx/store';
import {AppStates} from "./app.states";
import * as fromReducer from './assessment.reducer';

export const reducers: ActionReducerMap<AppStates> = {
  assessmentState: fromReducer.assessmentReducer,
  computedScore: fromReducer.scoreReducer
}

