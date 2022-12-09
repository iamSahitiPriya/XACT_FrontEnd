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
import cloneDeep from "lodash/cloneDeep";

@Component({
  selector: 'app-admin-reference',
  templateUrl: './admin-reference.component.html',
  styleUrls: ['./admin-reference.component.css']
})
export class AdminReferenceComponent implements OnInit, OnDestroy {

  @Input() topic:any;
  @Input() category : number
  @Input() module : number

  categories : CategoryResponse[]
  topicId : number | undefined
  masterData: Observable<CategoryResponse[]>
  topicReferences : any[] | TopicReference[] | undefined
  unsavedReferences : TopicReference[] | undefined
  unsavedChanges : TopicReference
  rating : any [] = []
  referenceToSend : any = {}
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

  constructor(private appService: AppServiceService,public dialog: MatDialog,private store: Store<AppStates>,private _snackBar: MatSnackBar) {
    this.masterData = this.store.select((store) => store.masterData.masterData)
  }

  ngOnInit(): void {
    this.referenceToSend = {}
    this.rating = [{rating:1,selected:false},{rating:2,selected: false},{rating:3,selected: false},{rating:4,selected: false},{rating:5,selected: false}]
    this.topicReferences = []
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
      data : { message  : message, iconType : "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration : 2000,
      verticalPosition : "top",
      horizontalPosition : "center"
    })
  }

  saveTopicReference(reference: any) {
    if(this.isRatingUnique(reference) && this.isReferenceUnique(reference) ) {
      this.referenceToSend = this.setReferenceRequest(reference)
      this.appService.saveTopicReference(this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          reference.isEdit = false
          reference.referenceId = _data.referenceId
          this.sendReferenceToStore(_data)
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  updateTopicReference(reference: any) {
    if(this.isRatingUnique(reference) && this.isReferenceUnique(reference)) {
     this.referenceToSend = this.setReferenceRequest(reference)
      this.referenceToSend.referenceId = reference.referenceId
      this.appService.updateTopicReference(reference.referenceId,this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
        next : (_data) => {
          reference.isEdit = false
          this.updateStore(_data)
          this.ngOnInit()
        }, error : _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  deleteTopicReference(reference: any) {
    this.appService.deleteTopicReference(reference.referenceId).pipe().subscribe({
      next: () => {
        this.deleteFromStore(reference)
        this.ngOnInit()
      }, error: _error => {
        this.showError(this.dataNotSaved);
      }
    })

  }

  setReferenceRequest(reference: any) {
    this.referenceToSend =  {
      reference : reference.reference,
      rating: reference.rating-1,
      topic: this.topicId
    }
    return this.referenceToSend
  }

  addMaturityReference() {
    this.deleteUnSavedReferences()
    let reference : any = {referenceId:-1,reference:"",rating:-1,topic:this.topicId,isEdit:true}

    this.topicReferences?.unshift(reference)

  }

  deleteUnSavedReferences() {
    if(this.topicReferences !== undefined && this.topicReferences.length !== 0) {
      if(this.topicReferences[0].referenceId === -1)
        this.topicReferences.splice(0,1)
    }
  }

  deleteMaturityReference(reference: any) {
    if(this.topicReferences !== undefined) {
      let index = this.topicReferences.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      this.deleteTopicReference(reference)
      this.topicReferences.splice(index, 1)
    }
    return  null;
  }

  isReferenceArrayFull() : boolean {
    if(this.topicReferences === undefined)
      return false;
    else
      return this.topicReferences.length === 5;
  }

  setTopicReferences() {
    let references = this.getReferenceFromTopic()
    if(references !== undefined) {
      references?.forEach(reference => {
        let eachReference: any = reference
        eachReference.isEdit = false
        this.topicReferences?.unshift(eachReference)
      })
    }
  }

  setIsEdit(reference: any) {
    reference.isEdit = true
    this.unsavedChanges = cloneDeep(reference)
  }

  cancelChanges(reference: any) {
      reference.reference = this.unsavedChanges.reference
      reference.referenceId = this.unsavedChanges.referenceId
      reference.rating = this.unsavedChanges.rating
      reference.isEdit = false
  }

  private isRatingUnique(reference : any | TopicReference) : boolean {
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

  private isReferenceUnique(reference : any | TopicReference) : boolean {
    let flag = true
    if(this.unsavedReferences !== undefined) {
      this.unsavedReferences.forEach(eachReference => {
        if(eachReference.referenceId !== reference.referenceId && eachReference.reference.trim() === reference.reference.trim()) {
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
    let reference : TopicReference = {
      referenceId : data.referenceId, rating : data.rating, topic:data.topic, reference:data.reference}
    let references = this.getReferenceFromTopic();
    if(references === undefined) {
      let topic : any = this.getSelectedTopic()
      topic['references'] = []
      topic['references'].push(reference)
    }
    else
      references?.push(reference)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }


  deleteFromStore(reference: any) {
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
    references?.splice(0,references?.length)
    if(this.unsavedReferences !== undefined)
      this.unsavedReferences.forEach(reference => references?.push(reference))

    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))

  }

  getReferenceFromTopic(){
    return this.categories.find(category => category.categoryId === this.category)?.modules.
    find(module => module.moduleId === this.module)?.topics.
    find(topic => topic.topicName === this.topic.topicName)?.references
  }

  private getSelectedTopic() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.
    find(module => module.moduleId === this.module)?.topics.
    find(topic => topic.topicName === this.topic.topicName)
  }

  isInputValid(reference: any) : boolean {
    let newReference : string = reference.reference;
    if(newReference.length !== 0) newReference = newReference.trim()
    return ((reference.rating === -1) || (newReference.length === 0))
  }

  disableSavedRatings() {
    this.unsavedReferences?.forEach(reference => {
      let rating = this.rating.find(rating => rating.rating === reference.rating)
      rating.selected = true
    })
  }

  private getTopicId() {
    this.topicId = this.getSelectedTopic()?.topicId
    return this.topicId
  }
}

