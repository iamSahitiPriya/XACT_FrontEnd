/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit} from '@angular/core';
import {data_local} from "../../../messages";
import {MatDialog} from "@angular/material/dialog";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {Observable} from "rxjs";
import {TopicStructure} from "../../../types/topicStructure";
import {TopicReference} from "../../../types/topicReference";
import {reference} from "@popperjs/core";

@Component({
  selector: 'app-admin-reference',
  templateUrl: './admin-reference.component.html',
  styleUrls: ['./admin-reference.component.css']
})
export class AdminReferenceComponent implements OnInit {

  @Input() topic:any;

  categories : CategoryResponse[]
  masterData: Observable<CategoryResponse[]>
  topicReferences : TopicReference[]
  rating : number [] = [1,2,3,4,5]

  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  header = data_local.ADMIN.REFERENCES.HEADER
  scoreCard = data_local.ADMIN.REFERENCES.SCORE_CARD
  addReference = data_local.ADMIN.REFERENCES.ADD_REFERENCE_BUTTON
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE


  constructor(public dialog: MatDialog,private store: Store<AppStates>) {
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


  private getTopicReferences() {
    let flag : boolean = false;
    this.categories.forEach(category => {
      category.modules?.forEach(module => {
        module.topics?.forEach(topic => {
          if(topic.topicId === this.topic.topicId) {
            this.topicReferences = topic.references
            if(this.topicReferences !== undefined)
            this.topicReferences.sort((reference1,reference2) => reference1.rating-reference2.rating)
            flag = true;
            return this.topicReferences
          }
          else
            return null;
        })
      })
    })
  }
}
