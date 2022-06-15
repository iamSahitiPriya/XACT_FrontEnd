import {AssessmentStructure} from "../types/assessmentStructure";
import { createAction, props } from '@ngrx/store';
import {CategoryStructure} from "../types/categoryStructure";
import {TopicRequest} from "../types/topicRequest";

export const getAssessmentData = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<{payload:AssessmentStructure}>())

export const getAssessmentId = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<{id:number}>())

export const getCategories = createAction('[CATEGORY STRUCTURE] Get categories',props<{payload:CategoryStructure[]}>());

export const getUpdatedAssessmentData = createAction("Assessment Updated data", props<{newData:AssessmentStructure}>())

export const getTopicRequest = createAction("Topic request", props<{topicRequest:TopicRequest}>());
