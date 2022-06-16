import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {getAssessmentData, getTopicRequest, getUpdatedAssessmentData,} from "../actions/assessment_data.actions";

import {AssessmentState, TopicState} from "./app.states";
import {TopicRequest} from "../types/topicRequest";

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
export const initialTopicState: TopicState = {
  topicReq:{
  parameterLevel:[],
  topicRatingAndRecommendation:{topicId:0,recommendation:"",rating:"0"}}
}

const _topicReducer = createReducer(
  initialTopicState,
  on(getTopicRequest,(state,action) => {
    console.log(state.topicReq)
    return{
      ...state,
      topicReq:action.topicRequest
    }
  })
)
const _assessmentReducer = createReducer(
  initialState,
  on(getAssessmentData, (state, {payload}) => {
    console.log(state.assessments)
    return{
      ...state,
    assessments: payload}
  }),
  on(getUpdatedAssessmentData, (state, action) =>{
    return {
      ...state,
      assessments:action.newData}
  }),
)
export function assessmentReducer(state: any, action: Action) {
  return _assessmentReducer(state, action)
}
export function topicReducer(state:any, action:Action){
  return _topicReducer(state,action)
}
export const getAssessmentState = createFeatureSelector<AssessmentState>('assessmentState')
export const getTopicState = createFeatureSelector<TopicState>('topicState')

export const getAssessments = createSelector(
  getAssessmentState, (state: AssessmentState) => {
    return state && state.assessments
  },
)
export const getTopicRequestSelector = createSelector(
  getTopicState,(state:TopicState) =>{
    return state.topicReq
  }

)





