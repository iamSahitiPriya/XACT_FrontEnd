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
import {TopicStructure} from "../../../types/topicStructure";
import {TopicReference} from "../../../types/topicReference";
import {reference} from "@popperjs/core";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-reference',
  templateUrl: './admin-reference.component.html',
  styleUrls: ['./admin-reference.component.css']
})
export class AdminReferenceComponent implements OnInit {

  @Input() topic:any;

  categories : CategoryResponse[]
  masterData: Observable<CategoryResponse[]>
  topicReferences : any[]
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
    this.masterData.subscribe(data => {
      this.categories = data
      this.getTopicReferences()
      console.log(this.topicReferences)
    })
  }

  private closePopUp() {
    this.dialog.closeAll();
  }

  close() {
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

    if(reference.referenceId === -1 && this.isRatingUnique() && this.isReferenceUnique() ) {
      let newReference : any= this.setReferenceRequest(reference)
      this.appService.saveTopicReference(newReference).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          reference.isEdit = false
          reference.referenceId = _data.referenceId
          this.sendToStore(_data)
        }, error: _error => {
          this.showError("Data cannot be saved");
        }
      })
    }
  }

  private setReferenceRequest(reference: any) {
    return {
      reference : reference.reference,
      rating: reference.rating-1,
      topic: this.topic.topicId
    }
  }

  private getTopicReferences() {
    let flag : boolean = false;
    this.categories.forEach(category => {
      category.modules?.forEach(module => {
        module.topics?.forEach(topic => {
          if(topic.topicId === this.topic.topicId) {
            this.setTopicReferences(topic)
            flag = true;
            return this.topicReferences
          }
          else
            return null;
        })
      })
    })
  }

  addMaturityReference() {
    let reference : any = {referenceId:-1,reference:"",rating:-1,topic:this.topic.topicId,isEdit:true}
    if(this.topicReferences === undefined)
    this.topicReferences = []
    this.topicReferences.unshift(reference)

  }

  isReferenceArrayFull() : boolean {
    if(this.topicReferences === undefined)
      return false;
    else
      return this.topicReferences.length === 5;
  }

  private setTopicReferences(topic: TopicStructure) {
    this.topicReferences = []
    topic.references?.forEach(reference => {
      let eachReference : any = reference
      eachReference.isEdit = false
      this.topicReferences.unshift(eachReference)
    })
  }

  setIsEdit(reference: any) {
   return  reference.isEdit = true
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private sendToStore(data: TopicReference) {
    this.categories.forEach(category => {
      category.modules?.forEach(module => {
        module.topics?.forEach(topic => {
          if (topic.topicId === this.topic.topicId) {
            if(topic.references === undefined) {
              topic.references = []
            }
            topic.references.push(data)
            return this.categories
          }
          else
            return null;
        })
      })
    })
  }

  private isRatingUnique() : boolean {
    const uniqueReferences = new Set(this.topicReferences.map(reference => reference.rating));

    return this.isReferencesUnique(uniqueReferences,"No duplicate ratings are allowed");
  }


  private isReferencesUnique(uniqueReferences: Set<any>,message : string) {
    if (uniqueReferences.size < this.topicReferences.length) {
      this.showError(message)
      return false;
    }
    return true;
  }

  private isReferenceUnique() : boolean {
    const  uniqueReferences = new Set(this.topicReferences.map(reference => reference.reference))

    return this.isReferencesUnique(uniqueReferences,"No duplicate references are allowed")
  }
}
