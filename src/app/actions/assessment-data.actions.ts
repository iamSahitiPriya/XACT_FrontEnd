/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {AssessmentStructure} from "../types/assessmentStructure";
import {createAction, props} from '@ngrx/store';
import {TopicRatingResponse} from "../types/topicRatingResponse";
import {CategoryResponse} from "../types/categoryResponse";

export const getAssessmentData = createAction('[ASSESSMENT STRUCTURE] Get assessment', props<{ payload: AssessmentStructure }>())

export const getAssessmentId = createAction('[ASSESSMENT STRUCTURE] Get assessment', props<{ id: number }>())

export const getUpdatedAssessmentData = createAction("Assessment Updated data", props<{ newData: AssessmentStructure }>())

export const setErrorMessage = createAction("Error message", props<{ error: string }>());

export const setAverageComputedScore = createAction("Set Average Score", props<{ averageScoreDetails: TopicRatingResponse }>())

export const getAllCategories = createAction("Get master data", props<{ categories: CategoryResponse[] }>())

export const getUpdatedCategories = createAction("Get updated master data", props<{ newMasterData: CategoryResponse[] }>())

export const loggedInUser = createAction("validate the user", props<{ role: string }>())

export const loggedInUserEmail = createAction("User email from okta", props<{ email: string }>())

export const loggedInUserRole = createAction("Roles for the logged in user", props<{ roles: string[] }>())


