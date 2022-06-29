import {AssessmentStructure} from "../types/assessmentStructure";
import {createAction, props} from '@ngrx/store';
import {UpdatedStatus} from "../types/UpdatedStatus";

export const getAssessmentData = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<{payload:AssessmentStructure}>())

export const getAssessmentId = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<{id:number}>())

export const getUpdatedAssessmentData = createAction("Assessment Updated data", props<{newData:AssessmentStructure}>())

export const setErrorMessage = createAction("Error message", props<{error:string}>());

export const setUpdatedInfo = createAction("Set updated info", props<{info:UpdatedStatus}>())

export const getUpdatedInfo = createAction("Get updated info", props<{info:UpdatedStatus}>());
