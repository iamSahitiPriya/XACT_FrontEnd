/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';

import {getAllCategories, getAssessmentData, getAssessmentId, user} from "../actions/assessment-data.actions";
import {AppServiceService} from "../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponentComponent} from "../components/error-component/error-component.component";
import {NotificationSnackbarComponent} from "../components/notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AssessmentDataEffects {
  constructor(private actions: Actions, private appService: AppServiceService, private dialog: MatDialog, private _snackbar: MatSnackBar) {
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

  getCategories = createEffect(() => this.actions.pipe(
      ofType(user),
      switchMap((user1) => {
          return (user1.role === "admin" || user1.role === "contributor") ? this.appService.getAllCategories().pipe(
            map(result => getAllCategories({categories: result})),
            catchError(_error => {
              this.showError("Server Error")
              return of()
            })
          ) : of()
        }
      )
    )
  )
  public errorHandler = () => {
    const openConfirm = this.dialog.open(ErrorComponentComponent, {backdropClass: 'backdrop-bg-opaque'});
    openConfirm.componentInstance.headerText = "Error";
    openConfirm.componentInstance.bodyText = "We are facing problem accessing this assessment.";
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

}
