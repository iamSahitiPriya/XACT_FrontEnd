/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Action, createReducer, on} from '@ngrx/store';
import {
  getAllCategories,
  getAssessmentData,
  getUpdatedAssessmentData,
  getUpdatedCategories,
  loggedInUserEmail,
  setAverageComputedScore,
  setErrorMessage,
} from "../actions/assessment-data.actions";

import {AssessmentState, ComputedScore, MasterData, User} from "./app.states";

export let loggedInUserInitialState: User = {email: ""};


export const initialState: AssessmentState = {
  assessments: {
    assessmentId: 0,
    assessmentName: "Hello",
    organisationName: "",
    assessmentPurpose: "",
    assessmentDescription: "",
    domain: "",
    industry: '',
    assessmentState: '',
    teamSize: 0,
    updatedAt: 0,
    assessmentStatus: "",
    answerResponseList: [],
    topicRatingAndRecommendation: [],
    parameterRatingAndRecommendation: [],
    userQuestionResponseList: [],
    users: [],
    owner: false
  }
}

export const initialMasterData: MasterData = {
  masterData: []
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
const _masterDataReducer = createReducer(
  initialMasterData,
  on(getAllCategories, (state, action) => {
    return {
      ...state,
      masterData: action.categories
    }
  }),
  on(getUpdatedCategories, (state, action) => {
    return {
      ...state,
      masterData: action.newMasterData
    }
  })
)

const _loggedInReducer = createReducer(
  loggedInUserInitialState,
  on(loggedInUserEmail, (state, action) => {
    return {
      ...state,
      email: action.email
    }
  })
)
export  function loggedInUserReducer(state:any, action:Action){
  return _loggedInReducer(state,action)
}

export function assessmentReducer(state: any, action: Action) {
  return _assessmentReducer(state, action)
}

export function scoreReducer(state: any, action: Action) {
  return _scoreReducer(state, action)
}

export function masterDataReducer(state: any, action: Action) {
  return _masterDataReducer(state, action)
}







