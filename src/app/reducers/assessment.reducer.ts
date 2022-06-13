import {createFeatureSelector, createSelector, createReducer, on, Action} from '@ngrx/store';
import {getAssessmentData} from "../actions/assessment_data.actions";

import {AssessmentState} from "./app.states";

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
  on(getAssessmentData, (state, {payload}) => (
    {assessments: payload})
  )
)

export function assessmentReducer(state: any, action: Action) {
  return _assessmentReducer(state, action)
}

export const getAssessmentState = createFeatureSelector<AssessmentState>('assessmentState')

export const getAssessments = createSelector(
  getAssessmentState, (state: AssessmentState) =>{
    return state && state.assessments
  }
)
