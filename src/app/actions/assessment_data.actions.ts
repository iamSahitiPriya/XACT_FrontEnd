import {AssessmentStructure} from "../types/assessmentStructure";
import { createAction, props } from '@ngrx/store';

export const getAssessmentData = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<{payload:AssessmentStructure}>())

export const getAssessmentId = createAction('[ASSESSMENT STRUCTURE] Get assessment',props<any>())
