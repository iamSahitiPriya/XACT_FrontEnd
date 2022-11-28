/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit} from '@angular/core';
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
export class AdminReferenceComponent implements OnInit {

  @Input() topic:any;
  @Input() category : number
  @Input() module : number

  categories : CategoryResponse[]
  masterData: Observable<CategoryResponse[]>
  topicReferences : any[] | TopicReference[] | undefined
  unsavedReferences : TopicReference[] | undefined
  rating : number [] = [1,2,3,4,5]
  private destroy$: Subject<void> = new Subject<void>();

  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  header = data_local.ADMIN.REFERENCES.HEADER
  scoreCard = data_local.ADMIN.REFERENCES.SCORE_CARD
  addReference = data_local.ADMIN.REFERENCES.ADD_REFERENCE_BUTTON
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE


  constructor(private appService: AppServiceService,public dialog: MatDialog,private store: Store<AppStates>,private _snackBar: MatSnackBar) {
    this.masterData = this.store.select((store) => store.masterData.masterData)
  }

  ngOnInit(): void {
    this.topicReferences = []
    this.masterData.subscribe(data => {
      this.categories = data
      this.setTopicReferences()
      this.unsavedReferences = cloneDeep(this.getReferenceFromTopic())
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

  saveReference(reference: any) {
    if(reference.referenceId === -1 && this.isRatingUnique(reference) && this.isReferenceUnique(reference) ) {
      let newReference : any= this.setReferenceRequest(reference)
      this.appService.saveTopicReference(newReference).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          reference.isEdit = false
          reference.referenceId = _data.referenceId
          this.sendToStore(_data)
          this.ngOnInit()
        }, error: _error => {
          this.showError("Data cannot be saved");
        }
      })
    }
    else {
      this.updateReference(reference)
    }
  }

  private updateReference(reference: any) {
    if(this.isRatingUnique(reference) && this.isReferenceUnique(reference)) {
      let updateReference : any = this.setReferenceRequest(reference)
      updateReference.referenceId = reference.referenceId
      this.appService.updateTopicReference(reference.referenceId,updateReference).pipe(takeUntil(this.destroy$)).subscribe({
        next : (_data) => {
          reference.isEdit = false
          this.updateStore(_data)
          this.ngOnInit()
        }, error : _error => {
          this.showError("Data cannot be saved");
        }
      })
    }
  }

  private deleteReference(reference: any) {
    this.appService.deleteTopicReference(reference.referenceId).pipe().subscribe({
      next: () => {
        this.deleteFromStore(reference)
        this.ngOnInit()
      }, error: _error => {
        this.showError("Data cannot be saved");
      }
    })

  }

  private setReferenceRequest(reference: any) {
    return {
      reference : reference.reference,
      rating: reference.rating-1,
      topic: this.topic.topicId
    }
  }

  addMaturityReference() {
    let reference : any = {referenceId:-1,reference:"",rating:-1,topic:this.topic.topicId,isEdit:true}

    this.topicReferences?.unshift(reference)

  }

  deleteMaturityReference(reference: any) {
    if(this.topicReferences !== undefined) {
      let index = this.topicReferences.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      if (reference.referenceId === -1) {
        this.topicReferences.splice(index, 1)
        return this.topicReferences;
      }
      this.deleteReference(reference)
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

  private setTopicReferences() {
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
    return  reference.isEdit = true
  }

  private isRatingUnique(reference : any | TopicReference) : boolean {
    let flag = true
    if(this.unsavedReferences !== undefined) {
      this.unsavedReferences.forEach(eachReference => {
        if(eachReference.referenceId !== reference.referenceId && eachReference.rating === reference.rating) {
          this.showError("No duplicate ratings are allowed")
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
          this.showError("No duplicate references are allowed")
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

  private sendToStore(data: TopicReference) {
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


  private deleteFromStore(reference: any) {
    let references = this.getReferenceFromTopic();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  private updateStore(reference: TopicReference) {
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

  private getReferenceFromTopic(){
    return this.categories.find(category => category.categoryId === this.category)?.modules.
    find(module => module.moduleId === this.module)?.topics.
    find(topic => topic.topicId === this.topic.topicId)?.references
  }

  private getSelectedTopic() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.
    find(module => module.moduleId === this.module)?.topics.
    find(topic => topic.topicId === this.topic.topicId)
  }
}
