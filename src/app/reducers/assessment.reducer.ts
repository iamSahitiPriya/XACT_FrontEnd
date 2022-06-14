import {createFeatureSelector, createSelector, createReducer, on, Action} from '@ngrx/store';
import {
  getAssessmentData, getUpdatedAssessmentData,
} from "../actions/assessment_data.actions";

import {AssessmentState} from "./app.states";
import {CategoryStructure} from "../types/categoryStructure";
import {CategoryState} from "./categoryState.states";

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
export const initialCategoryState: CategoryState = {
  category:[]
}

const _assessmentReducer = createReducer(
  initialState,
  on(getAssessmentData, (state, {payload}) => {
    return{
      ...state,
    assessments: payload}
  }),
  on(getUpdatedAssessmentData, (state, action) =>{
    return {
      ...state,
      assessments:action.newData}
  }))
export function assessmentReducer(state: any, action: Action) {
  return _assessmentReducer(state, action)
}

export const getAssessmentState = createFeatureSelector<AssessmentState>('assessmentState')

export const getAssessments = createSelector(
  getAssessmentState, (state: AssessmentState) => {
    return state.assessments
  }
)





