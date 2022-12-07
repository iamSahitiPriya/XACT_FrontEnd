import {Component, Input, OnInit} from '@angular/core';
import {data_local} from "../../../messages";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Observable, Subject} from "rxjs";
import {TopicReference} from "../../../types/topicReference";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {MatSnackBar} from "@angular/material/snack-bar";
import cloneDeep from "lodash/cloneDeep";

@Component({
  selector: 'app-admin-parameter-reference',
  templateUrl: './admin-parameter-reference.component.html',
  styleUrls: ['./admin-parameter-reference.component.css']
})
export class AdminParameterReferenceComponent implements OnInit {
  @Input() topic: number;
  @Input() category : number
  @Input() module : number
  @Input() parameter: any

  categories : CategoryResponse[]
  masterData: Observable<CategoryResponse[]>
  parameterReferences : any[] | TopicReference[] | undefined
  unsavedReferences : TopicReference[] | undefined
  rating : any [] = []
  isParameterLevel: boolean
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
    this.rating = [{rating:1,selected:false},{rating:2,selected: false},{rating:3,selected: false},{rating:4,selected: false},{rating:5,selected: false}]
    this.parameterReferences = []
    this.masterData.subscribe(data => {
      this.categories = data
      this.setParameterReferences()
      this.isParameterLevel = this.isParameterLevelReference()
      // this.unsavedReferences = cloneDeep(this.getReferenceFromTopic())
      // this.disableSavedRatings()
    })
  }


  private closePopUp() {

    this.dialog.closeAll();
  }

  close() {
    // this.updateUnsavedChangesToStore()
    // this.topicReferences = this.unsavedReferences
    this.closePopUp();
  }


  private isParameterLevelReference() {
    let flag : boolean = false
    let topic = this.getSelectedTopic()
    if(topic?.parameters !== undefined) {
      topic?.parameters.forEach((parameter: { references: string | any[] | undefined; }) => {
        if (parameter.references !== undefined && parameter.references.length !== 0)
          flag = true
      })
    }
    return flag;
  }

  private setParameterReferences() {
      let references = this.getReferenceFromParameter()
      if(references !== undefined) {
        references?.forEach(reference => {
          let eachReference: any = reference
          eachReference.isEdit = false
          this.parameterReferences?.unshift(eachReference)
        })
      }
  }

  getReferenceFromParameter(){
    return this.categories.find(category => category.categoryId === this.category)?.modules.
    find(module => module.moduleId === this.module)?.topics.
    find(topic => topic.topicId === this.topic)?.parameters.
      find(parameter => parameter.parameterId === this.parameter.parameterName)?.references
  }

  private getSelectedTopic() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.
    find(module => module.moduleId === this.module)?.topics.
    find(topic => topic.topicId === this.topic)
  }

  addMaturityReference() {
    this.deleteUnSavedReferences()
    let reference : any = {referenceId:-1,reference:"",rating:-1,parameter:this.parameter.parameterId,isEdit:true}

    this.parameterReferences?.unshift(reference)

  }

  private deleteUnSavedReferences() {
    if(this.parameterReferences !== undefined && this.parameterReferences.length !== 0) {
      if(this.parameterReferences[0].referenceId === -1)
        this.parameterReferences.splice(0,1)
    }
  }

  isReferenceArrayFull() : boolean {
    if(this.parameterReferences === undefined)
      return false;
    else
      return this.parameterReferences.length === 5;
  }
}
