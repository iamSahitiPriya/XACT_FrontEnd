/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {
  getAssessmentData,
  getUpdatedAssessmentData,
  setAverageComputedScore,
  setErrorMessage,
} from "../actions/assessment-data.actions";

import {AssessmentState, ComputedScore} from "./app.states";

export const initialState: AssessmentState = {
  assessments: {
    assessmentId: 0,
    assessmentName: "Hello",
    organisationName: "",
    assessmentPurpose:"",
    domain: "",
    industry: '',
    assessmentState:'',
    teamSize: 0,
    updatedAt: 0,
    assessmentStatus: "",
    answerResponseList: [],
    topicRatingAndRecommendation: [],
    parameterRatingAndRecommendation: [],
    userQuestionResponseList:[],
    users: []
  }
}
export const initialComputedScore: ComputedScore = {
  scoreDetails: {
    rating: 0,
    topicId: 0
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
const _scoreReducer = createReducer(
  initialComputedScore,
  on(setAverageComputedScore, (state, action) => {
    return {
      ...state,
      scoreDetails: action.averageScoreDetails
    }
  })
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

export function scoreReducer(state: any, action: Action) {
  return _scoreReducer(state, action)
}

export const getAverageRating = createFeatureSelector<ComputedScore>('computedScore')







