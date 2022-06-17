import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {debounceTime, map, switchMap} from 'rxjs/operators';

import {getAssessmentData, getAssessmentId} from "../actions/assessment_data.actions";
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

}
