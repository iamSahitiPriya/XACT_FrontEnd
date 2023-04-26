/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {data_local} from "../../../messages";
import {MatDialog} from "@angular/material/dialog";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {Observable, Subject, takeUntil} from "rxjs";
import {TopicReference} from "../../../types/topicReference";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as fromActions from "../../../actions/assessment-data.actions";
import {cloneDeep} from "lodash";
import {TopicData} from "../../../types/topicData";
import {Rating} from "../../../types/Admin/rating";
import {TopicStructure} from "../../../types/topicStructure";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-admin-reference',
  templateUrl: './admin-reference.component.html',
  styleUrls: ['./admin-reference.component.css']
})
export class AdminReferenceComponent implements OnInit, OnDestroy {

  @Input() topic: TopicData;
  @Input() category: number
  @Input() module: number
  @Input() role:string

  categories: CategoryResponse[]
  topicId: number | undefined
  masterData: Observable<CategoryResponse[]>
  topicReferences: TopicReference[] | undefined
  unsavedReferences: TopicReference[] | undefined
  unsavedChanges: TopicReference | null
  selectedReference: TopicReference | null
  rating: Rating [] = []
  referenceToSend: TopicReference | null
  private destroy$: Subject<void> = new Subject<void>();

  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  header = data_local.ADMIN.REFERENCES.HEADER
  scoreCard = data_local.ADMIN.REFERENCES.SCORE_CARD
  addReference = data_local.ADMIN.REFERENCES.ADD_REFERENCE_BUTTON
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  edit = data_local.ADMIN.EDIT
  parameterReferenceMessage = data_local.ADMIN.REFERENCES.PARAMETER_REFERENCE_MESSAGE
  dataNotSaved = data_local.ADMIN.REFERENCES.DATA_NOT_SAVED
  duplicateRatingMessage = data_local.ADMIN.REFERENCES.DUPLICATE_RATING_ERROR_MESSAGE
  duplicateReferenceMessage = data_local.ADMIN.REFERENCES.DUPLICATE_REFERENCE_ERROR_MESSAGE

  constructor(private appService: AppServiceService, public dialog: MatDialog, private store: Store<AppStates>, private _snackBar: MatSnackBar) {
    this.masterData = this.store.select((masterStore) => masterStore.masterData.masterData)
  }

  ngOnInit(): void {
    this.rating = [{rating: 1, selected: false}, {rating: 2, selected: false}, {rating: 3, selected: false}, {rating: 4, selected: false}, {rating: 5, selected: false}]
    this.topicReferences = []
    this.unsavedReferences = []
    this.unsavedChanges = null
    this.masterData.subscribe(data => {
      this.categories = data
      this.setTopicReferences()
      this.getTopicId()
      this.unsavedReferences = cloneDeep(this.getReferenceFromTopic())
      this.disableSavedRatings()
    })
  }

  private closePopUp() {
    this.dialog.closeAll();
  }

  close() {
    this.updateUnsavedChangesToStore()
    this.topicReferences = this.unsavedReferences
    this.closePopUp();
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  saveTopicReference(reference: TopicReference) {
    this.referenceToSend = this.setReferenceRequest(reference)
    if (this.isRatingUnique(reference) && this.isReferenceUnique(reference) && this.referenceToSend !== null) {
      this.appService.saveTopicReference(this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
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

  updateTopicReference(reference: TopicReference) {
    if (this.isRatingUnique(reference) && this.isReferenceUnique(reference)) {
      this.referenceToSend = this.setReferenceRequest(reference)
      if(this.referenceToSend !== null && reference.referenceId) {
        this.referenceToSend.referenceId = reference.referenceId
        this.appService.updateTopicReference(reference.referenceId, this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
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
  }

  deleteTopicReference(reference: TopicReference) {
    if(reference.referenceId && reference) {
      this.appService.deleteTopicReference(reference.referenceId).pipe().subscribe({
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

  setReferenceRequest(reference: TopicReference) : TopicReference | null{
    if(this.topicId) {
      this.referenceToSend = {
        reference: reference.reference.trim(),
        rating: reference.rating - 1,
        topic: this.topicId
      }
    }
    return this.referenceToSend
  }

  addMaturityReference() {
    if (this.selectedReference !== null && this.selectedReference !== undefined)
      this.selectedReference.isEdit = false
    this.deleteUnSavedReferences()
    this.resetUnsavedChanges()
    if(this.topicId !== undefined) {
      let reference: TopicReference = {referenceId: -1, reference: "", rating: -1, topic: this.topicId, isEdit: true}
      this.selectedReference = this.selectedReference == reference ? null : reference
      this.topicReferences?.unshift(reference)
    }
  }

  deleteUnSavedReferences() {
    if (this.topicReferences !== undefined && this.topicReferences.length !== 0) {
      if (this.topicReferences[0].referenceId === -1)
        this.topicReferences.splice(0, 1)
    }
  }

  deleteMaturityReference(reference: TopicReference)  {
    if (this.topicReferences !== undefined) {
      let index = this.topicReferences.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      this.deleteTopicReference(reference)
      this.topicReferences.splice(index, 1)
    }
  }

  isReferenceArrayFull(): boolean {
    if (this.topicReferences === undefined)
      return false;
    else
      return this.topicReferences.length === 5;
  }

  setTopicReferences() {
    let references = this.getReferenceFromTopic()
    if (references !== undefined) {
      references?.forEach(reference => {
        let eachReference: TopicReference = reference
        eachReference.isEdit = false
        this.topicReferences?.unshift(eachReference)
      })
    }
    this.sortReferences()
  }

  setIsEdit(reference: TopicReference) {
    this.deleteUnSavedReferences()
    this.resetUnsavedChanges()
    let topicId = this.topicId
    if(topicId !== undefined) {
      let selectedReference: TopicReference = {
        topic: topicId,
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

  cancelChanges(reference: TopicReference) {
    this.selectedReference = this.selectedReference == reference ? null : reference
    this.resetReference(reference);
  }

  private resetReference(reference: TopicReference | undefined) {
    if (this.unsavedChanges !== null && reference !== undefined) {
      reference.reference = this.unsavedChanges.reference
      reference.referenceId = this.unsavedChanges.referenceId
      reference.rating = this.unsavedChanges.rating
      reference.isEdit = false
    }
  }

  private isRatingUnique(reference: TopicReference): boolean {
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

  private isReferenceUnique(reference: TopicReference): boolean {
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


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendReferenceToStore(data: TopicReference) {
    let reference: TopicReference = {
      referenceId: data.referenceId, rating: data.rating, topic: data.topic, reference: data.reference
    }
    let references = this.getReferenceFromTopic();
    if (references === undefined) references = []

    references?.push(reference)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }


  deleteFromStore(reference: TopicReference) {
    let references = this.getReferenceFromTopic();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  updateStore(reference: TopicReference) {
    let references = this.getReferenceFromTopic();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1, reference)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  private updateUnsavedChangesToStore() {
    let references = this.getReferenceFromTopic()
    references?.splice(0, references?.length)
    if (this.unsavedReferences !== undefined)
      this.unsavedReferences.forEach(reference => references?.push(reference))

    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  getReferenceFromTopic() : TopicReference[] | undefined {
    return this.categories.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics.find(topic => topic.topicName === this.topic.topicName)?.references
  }

  private getSelectedTopic() : TopicStructure | undefined {
    return this.categories.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics.find(topic => topic.topicName === this.topic.topicName)
  }

  isInputValid(reference: TopicReference): boolean {
    let newReference: string = reference.reference;
    if (newReference.length !== 0) newReference = newReference.trim()
    return ((reference.rating === -1) || (newReference.length === 0))
  }

  disableSavedRatings() {
    this.unsavedReferences?.forEach(reference => {
      let rating = this.rating.find(eachRating => eachRating.rating === reference.rating)
      if(rating) rating.selected = true
    })
  }

  private getTopicId() : number {
    this.topicId = this.getSelectedTopic()?.topicId
    return this.topicId ? this.topicId : -1
  }

  private resetUnsavedChanges() {
    if(this.unsavedChanges !== null) {
      let reference = this.topicReferences?.find(eachReference => eachReference.referenceId === this.unsavedChanges?.referenceId)
      this.resetReference(reference)
    }
  }

  private sortReferences() {
    this.topicReferences?.sort((reference1,reference2) => reference1.rating - reference2.rating)
  }
}

