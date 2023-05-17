/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit} from '@angular/core';
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
import {data_local} from "../../../messages";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import * as fromActions from "../../../actions/assessment-data.actions";
import {Question} from "../../../types/Admin/question";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-admin-question-reference',
  templateUrl: './admin-question-reference.component.html',
  styleUrls: ['./admin-question-reference.component.css']
})

export class AdminQuestionReferenceComponent implements OnInit {
  @Input() question: Question
  @Input() category: number
  @Input() module: number
  @Input() topic: number
  @Input() role: string

  masterData: Observable<CategoryResponse[]>
  categories: CategoryResponse[]
  selectedReference: null | QuestionReference;
  questionReferences: QuestionReference[] | undefined
  unsavedChanges: QuestionReference | null
  unsavedReferences: QuestionReference[] | undefined
  rating: Rating [] = []
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  private referenceToSend: QuestionReference | null;
  duplicateRatingMessage = data_local.ADMIN.REFERENCES.DUPLICATE_RATING_ERROR_MESSAGE
  duplicateReferenceMessage = data_local.ADMIN.REFERENCES.DUPLICATE_REFERENCE_ERROR_MESSAGE
  dataNotSaved = data_local.ADMIN.REFERENCES.DATA_NOT_SAVED
  private destroy$: Subject<void> = new Subject<void>();
  save = data_local.ADMIN.SAVE
  addReference = data_local.ADMIN.REFERENCES.ADD_REFERENCE_BUTTON
  update = data_local.ADMIN.UPDATE
  edit = data_local.ADMIN.EDIT
  header = data_local.ADMIN.REFERENCES.HEADER
  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;

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
      this.disableSavedRatings()
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
    this.deleteUnSavedReferences()
    this.resetUnsavedChanges()
    if (this.question.questionId !== undefined) {
      let reference: QuestionReference = {
        referenceId: -1,
        reference: "",
        rating: -1,
        question: this.question.questionId,
        isEdit: true
      }
      this.selectedReference = this.selectedReference == reference ? null : reference
      this.questionReferences?.unshift(reference)
    }

  }

  private setQuestionReferences() {
    let references = this.getReferenceFromQuestion()
    if (references !== undefined) {
      references?.forEach(reference => {
        let eachReference: QuestionReference = reference
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
    this.questionReferences?.sort((reference1, reference2) => reference1.rating - reference2.rating)
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

  private referenceRequest(reference: QuestionReference): QuestionReference | null {
    if (this.question.questionId) {
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
    if (this.unsavedReferences !== undefined) {
      this.unsavedReferences.forEach(eachReference => {
        if (eachReference.referenceId !== reference.referenceId && eachReference.rating === reference.rating) {
          this.showError(this.duplicateRatingMessage)
          flag = false
        }
      })
    }
    return flag
  }

  private isReferenceUnique(reference: QuestionReference) {
    let flag = true
    if (this.unsavedReferences !== undefined) {
      this.unsavedReferences.forEach(eachReference => {
        if (eachReference.referenceId !== reference.referenceId && eachReference.reference.trim() === reference.reference.trim()) {
          this.showError(this.duplicateReferenceMessage)
          flag = false
        }
      })
    }
    return flag
  }

  deleteUnSavedReferences() {
    if (this.questionReferences !== undefined && this.questionReferences.length !== 0) {
      if (this.questionReferences[0].referenceId === -1)
        this.questionReferences.splice(0, 1)
    }
  }

  isInputValid(reference: QuestionReference) {
    let newReference: string = reference.reference;
    if (newReference.length !== 0) newReference = newReference.trim()
    return ((reference.rating === -1) || (newReference.length === 0))
  }

  isReferenceArrayFull(): boolean {
    if (this.questionReferences === undefined)
      return false;
    else
      return this.questionReferences.length === 5;

  }

  updateQuestionReference(reference: QuestionReference) {
    this.referenceToSend = this.referenceRequest(reference)
    if (this.isRatingUnique(reference) && this.isReferenceUnique(reference) && reference.referenceId && this.referenceToSend !== null) {
      this.referenceToSend.referenceId = reference.referenceId
      this.appService.updateQuestionReference(reference.referenceId, this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          reference.isEdit = false
          this.updateStore(_data)
          this.selectedReference = null
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  cancelChanges(reference: QuestionReference) {
    this.selectedReference = this.selectedReference == reference ? null : reference
    this.resetReference(reference);

  }

  private resetReference(reference: QuestionReference | undefined) {
    if (this.unsavedChanges !== null && reference !== undefined) {
      reference.reference = this.unsavedChanges.reference
      reference.referenceId = this.unsavedChanges.referenceId
      reference.rating = this.unsavedChanges.rating
      reference.isEdit = false
    }
  }

  private disableSavedRatings() {
    this.unsavedReferences?.forEach(reference => {
      let rating = this.rating.find(eachRating => eachRating.rating === reference.rating)
      if (rating) rating.selected = true
    })
  }

  setIsEdit(reference: QuestionReference) {
    this.deleteUnSavedReferences()
    this.resetUnsavedChanges()
    if (this.question.questionId) {
      let selectedReference: QuestionReference = {
        question: this.question.questionId,
        reference: reference.reference,
        referenceId: reference.referenceId,
        rating: reference.rating
      }
      if (this.selectedReference !== null && this.selectedReference !== undefined) this.selectedReference.isEdit = false
      reference.isEdit = true
      this.unsavedChanges = cloneDeep(selectedReference)
      this.selectedReference = this.selectedReference === reference ? null : reference
    }
  }

  private resetUnsavedChanges() {
    if (this.unsavedChanges !== null) {
      let reference = this.questionReferences?.find(eachReference => eachReference.referenceId === this.unsavedChanges?.referenceId)
      this.resetReference(reference)
    }
  }

  deleteMaturityReference(reference: QuestionReference) {
    if (this.questionReferences !== undefined) {
      let index = this.questionReferences.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      this.deleteQuestionReference(reference)
      this.questionReferences.splice(index, 1)
    }
  }

  private deleteQuestionReference(reference: QuestionReference) {
    if (reference.referenceId) {
      this.appService.deleteQuestionReference(reference.referenceId).pipe().subscribe({
        next: () => {
          this.deleteFromStore(reference)
          this.selectedReference = null
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  private updateStore(reference: QuestionReference) {
    let references = this.getReferenceFromQuestion();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1, reference)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  private deleteFromStore(reference: QuestionReference) {
    let references = this.getReferenceFromQuestion();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  private sendReferenceToStore(data: QuestionReference) {
    let reference: QuestionReference = {
      referenceId: data.referenceId, rating: data.rating, question: data.question, reference: data.reference
    }
    let references = this.categories.find(category => category.categoryId === this.category)
      ?.modules.find(module => module.moduleId === this.module)
      ?.topics.find(topic => topic.topicId === this.topic)
      ?.parameters.find(parameter => parameter.parameterId === this.question.parameter)
      ?.questions.find(eachQuestion => eachQuestion.questionId === this.question.questionId)?.references
    if (references === undefined) references = []
    references.push(reference)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  close() {
    this.updateUnsavedChangesToStore()
    this.questionReferences = this.unsavedReferences
    this.closePopUp();
  }

  private closePopUp() {
    this.dialog.closeAll();
  }


  private updateUnsavedChangesToStore() {
    let references = this.getReferenceFromQuestion()
    references?.splice(0,references?.length)
    if(this.unsavedReferences !== undefined)
      this.unsavedReferences.forEach(reference => references?.push(reference))

    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))

  }
}
