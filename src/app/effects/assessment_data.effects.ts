import {Injectable} from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {map, switchMap, mergeMap, catchError, debounceTime} from 'rxjs/operators';

import {getAssessmentData, getAssessmentId, getCategories} from "../actions/assessment_data.actions";
import {AppServiceService} from "../services/app-service/app-service.service";

@Injectable()
export class Assessment_dataEffects {
  constructor(private actions: Actions, private appService: AppServiceService) {
  }

  getAssessments = createEffect(() => this.actions.pipe(
    ofType(getAssessmentId),
    debounceTime(500),
    switchMap(({id}) => this.appService.getAssessment(id).pipe(
      map(res => getAssessmentData({payload: res}))
    )))
  )

  getCategories = createEffect(() => this.actions.pipe(
    ofType(getCategories),
    debounceTime(500),
    switchMap(() => this.appService.getCategories().pipe(
      map(res => getCategories({payload:res}))
    ))
  ))
}
