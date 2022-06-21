import {AssessmentStructure} from "../types/assessmentStructure";
import {createAction, props} from '@ngrx/store';

export const getAssessmentData = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<{payload:AssessmentStructure}>())

export const getAssessmentId = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<{id:number}>())

export const getUpdatedAssessmentData = createAction("Assessment Updated data", props<{newData:AssessmentStructure}>())

export const setErrorMessage = createAction("Error message", props<{error:string}>());
