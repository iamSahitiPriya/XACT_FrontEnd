/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';

import {getAssessmentData, getAssessmentId} from "../actions/assessment-data.actions";
import {AppServiceService} from "../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponentComponent} from "../components/error-component/error-component.component";

@Injectable()
export class AssessmentDataEffects {
  constructor(private actions: Actions, private appService: AppServiceService, private dialog: MatDialog) {
  }

  getAssessments = createEffect(() => this.actions.pipe(
    ofType(getAssessmentId),
    switchMap((assessmentId) => {
        return assessmentId.id ? this.appService.getAssessment(assessmentId.id).pipe(
          map(res => getAssessmentData({payload: res})),
          catchError(_error => {
            this.errorHandler()
            return of()
          })
        ) : of()
      }
    ))
  )
  public errorHandler = () => {
    const openConfirm = this.dialog.open(ErrorComponentComponent, {backdropClass: 'backdrop-bg-opaque'});
    openConfirm.componentInstance.headerText = "Error";
    openConfirm.componentInstance.bodyText = "We are facing problem accessing this assessment.";
  }

}
