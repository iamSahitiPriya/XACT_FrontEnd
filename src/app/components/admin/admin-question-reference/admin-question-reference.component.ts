/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit} from '@angular/core';
import {ParameterReference} from "../../../types/parameterReference";
import {QuestionReference} from "../../../types/QuestionReference";
import {cloneDeep} from "lodash";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Rating} from "../../../types/Admin/rating";
import {Observable, Subject, takeUntil} from "rxjs";
import {CategoryResponse} from "../../../types/categoryResponse";
import {ParameterData} from "../../../types/ParameterData";
import {QuestionStructure} from "../../../types/questionStructure";
import {data_local} from "../../../messages";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import * as fromActions from "../../../actions/assessment-data.actions";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-admin-question-reference',
  templateUrl: './admin-question-reference.component.html',
  styleUrls: ['./admin-question-reference.component.css']
})

export class AdminQuestionReferenceComponent implements OnInit {
  @Input() question : QuestionStructure
  @Input() category : number
  @Input() module : number
  @Input() topic : number
  @Input() role:string

  masterData : Observable<CategoryResponse[]>
  categories : CategoryResponse[]
  selectedReference: null | QuestionReference;
  questionReferences : QuestionReference[] | undefined
  unsavedChanges : QuestionReference[] | null
  unsavedReferences : QuestionReference[] | undefined
  rating: Rating [] = []
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  private referenceToSend: QuestionReference | null;
  duplicateRatingMessage = data_local.ADMIN.REFERENCES.DUPLICATE_RATING_ERROR_MESSAGE
  duplicateReferenceMessage = data_local.ADMIN.REFERENCES.DUPLICATE_REFERENCE_ERROR_MESSAGE
  dataNotSaved = data_local.ADMIN.REFERENCES.DATA_NOT_SAVED
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private appService: AppServiceService, public dialog: MatDialog, private store: Store<AppStates>, private _snackBar: MatSnackBar) {
    this.masterData = this.store.select((masterStore) => masterStore.masterData.masterData)
  }

  ngOnInit(): void {
    this.rating = [{rating: 1, selected: false}, {rating: 2, selected: false}, {rating: 3, selected: false},
      {rating: 4, selected: false}, {rating: 5, selected: false}]
    this.questionReferences = []
    this.unsavedChanges = null
    this.unsavedReferences = []
    this.masterData.subscribe(data => {
      this.categories = data
      this.setQuestionReferences()
      this.unsavedReferences = cloneDeep(this.getReferenceFromQuestion())
      // this.disableSavedRatings()
    })
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  addMaturityReference() {
    if (this.selectedReference !== null && this.selectedReference !== undefined)
      this.selectedReference.isEdit = false
    // this.deleteUnSavedReferences()
    // this.resetUnsavedChanges()
    if(this.question.questionId !== undefined) {
      let reference: QuestionReference = {
        referenceId: -1,
        reference: "",
        rating: -1,
        question : this.question.questionId,
        isEdit: true
      }
      this.selectedReference = this.selectedReference == reference ? null : reference
      this.questionReferences?.unshift(reference)
    }

  }

  // deleteUnSavedReferences() {
  //   if (this.parameterReferences !== undefined && this.parameterReferences.length !== 0) {
  //     if (this.parameterReferences[0].referenceId === -1)
  //       this.parameterReferences.splice(0, 1)
  //   }
  // }
  //
  private setQuestionReferences() {
    let references = this.getReferenceFromQuestion()
    if (references !== undefined) {
      references?.forEach(reference => {
        let eachReference : QuestionReference = reference
        eachReference.isEdit = false
        this.questionReferences?.unshift(eachReference)
      })
    }
    this.sortReferences()
  }

  private getReferenceFromQuestion() {
    return this.categories.find(category => category.categoryId === this.category)
      ?.modules.find(module => module.moduleId === this.module)
      ?.topics.find(topic => topic.topicId === this.topic)
      ?.parameters.find(parameter => parameter.parameterId === this.question.parameter)
      ?.questions.find(eachQuestion => eachQuestion.questionId === this.question.questionId)?.references
  }

  private sortReferences() {
    this.questionReferences?.sort((reference1,reference2) => reference1.rating - reference2.rating)
  }

  saveQuestionReference(reference: QuestionReference) {
    this.referenceToSend = this.referenceRequest(reference)
    if (this.isRatingUnique(reference) && this.isReferenceUnique(reference) && this.referenceToSend !== null) {
      this.appService.saveQuestionReference(this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          reference.isEdit = false
          reference.referenceId = _data.referenceId
          this.selectedReference = null
          this.sendReferenceToStore(_data)
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }

  }

  private referenceRequest(reference: QuestionReference) : QuestionReference | null {
    if(this.question.questionId) {
      this.referenceToSend = {
        reference: reference.reference.trim(),
        rating: reference.rating - 1,
        question: this.question.questionId
      }
      return this.referenceToSend
    }
    return null;
  }

  private isRatingUnique(reference: QuestionReference) {
    let flag = true
    if(this.unsavedReferences !== undefined) {
      this.unsavedReferences.forEach(eachReference => {
        if(eachReference.referenceId !== reference.referenceId && eachReference.rating === reference.rating) {
          this.showError(this.duplicateRatingMessage)
          flag = false
        }
      })
    }
    return flag
  }

  private isReferenceUnique(reference: QuestionReference) {
    let flag = true
    if(this.unsavedReferences !== undefined) {
      this.unsavedReferences.forEach(eachReference => {
        if(eachReference.referenceId !== reference.referenceId && eachReference.reference.trim() === reference.reference.trim()) {
          this.showError(this.duplicateReferenceMessage)
          flag = false
        }
      })
    }
    return flag  }

  private sendReferenceToStore(data: QuestionReference) {
    let reference : QuestionReference = {
      referenceId : data.referenceId, rating : data.rating, question:data.question, reference:data.reference}
    let references = this.getReferenceFromQuestion();
    if(references === undefined) references = []

    references.push(reference)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))


  }

  deleteUnSavedReferences() {
    if (this.questionReferences !== undefined && this.questionReferences.length !== 0) {
      if (this.questionReferences[0].referenceId === -1)
        this.questionReferences.splice(0, 1)
    }
  }
}
