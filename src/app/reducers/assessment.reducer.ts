import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {getAssessmentData, getUpdatedAssessmentData, setErrorMessage,} from "../actions/assessment-data.actions";

import {AssessmentState} from "./app.states";
import {UpdatedStatus} from "../types/UpdatedStatus";

export const initialState: AssessmentState = {
  assessments: {
    assessmentId: 0,
    assessmentName: "Hello",
    organisationName: "",
    domain: "",
    industry: '',
    teamSize: 0,
    updatedAt: 0,
    assessmentStatus: "",
    answerResponseList: [],
    topicRatingAndRecommendation: [],
    parameterRatingAndRecommendation: [],
    users: []
  }
}

const _assessmentReducer = createReducer(
  initialState,
  on(getAssessmentData, (state, {payload}) => {
    return {
      ...state,
      assessments: payload
    }
  }),
  on(getUpdatedAssessmentData, (state, action) => {
    return {
      ...state,
      assessments: action.newData
    }
  }),
  on(setErrorMessage, (state, action) => {
    return {
      ...state,
      errorMessage: action.error
    }
  }),
)

export function assessmentReducer(state: any, action: Action) {
  return _assessmentReducer(state, action)
}

export const getAssessmentState = createFeatureSelector<AssessmentState>('assessmentState')

export const getAssessments = createSelector(
  getAssessmentState, (state: AssessmentState) => {
    return state && state.assessments
  },
)






