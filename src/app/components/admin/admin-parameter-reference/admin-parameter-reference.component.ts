import {Component, Input, OnInit} from '@angular/core';
import {data_local} from "../../../messages";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Observable, Subject, takeUntil} from "rxjs";
import {TopicReference} from "../../../types/topicReference";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {MatSnackBar} from "@angular/material/snack-bar";
import cloneDeep from "lodash/cloneDeep";
import {ParameterReference} from "../../../types/parameterReference";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import * as fromActions from "../../../actions/assessment-data.actions";

@Component({
  selector: 'app-admin-parameter-reference',
  templateUrl: './admin-parameter-reference.component.html',
  styleUrls: ['./admin-parameter-reference.component.css']
})
export class AdminParameterReferenceComponent implements OnInit {
  @Input() topic: number;
  @Input() category: number
  @Input() module: number
  @Input() parameter: any

  categories: CategoryResponse[]
  masterData: Observable<CategoryResponse[]>
  parameterReferences: any[] | TopicReference[] | undefined
  unsavedReferences: ParameterReference[] | undefined
  rating: any [] = []
  referenceToSend: any = {}
  isParameterLevel: boolean
  unsavedChanges: ParameterReference;
  private destroy$: Subject<void> = new Subject<void>();

  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  header = data_local.ADMIN.REFERENCES.HEADER
  scoreCard = data_local.ADMIN.REFERENCES.SCORE_CARD
  addReference = data_local.ADMIN.REFERENCES.ADD_REFERENCE_BUTTON
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  edit = data_local.ADMIN.EDIT
  topicReferenceMessage = data_local.ADMIN.REFERENCES.TOPIC_REFERENCE_MESSAGE

  constructor(private appService: AppServiceService, public dialog: MatDialog, private store: Store<AppStates>, private _snackBar: MatSnackBar) {
    this.masterData = this.store.select((store) => store.masterData.masterData)
  }

  ngOnInit(): void {
    this.rating = [{rating: 1, selected: false}, {rating: 2, selected: false}, {rating: 3, selected: false},
      {rating: 4, selected: false}, {rating: 5, selected: false}]
    this.parameterReferences = []
    this.masterData.subscribe(data => {
      this.categories = data
      this.setParameterReferences()
      this.isParameterLevel = this.isParameterLevelReference()
      this.unsavedReferences = cloneDeep(this.getReferenceFromParameter())
      this.disableSavedRatings()
    })
  }


  private closePopUp() {
    this.dialog.closeAll();
  }

  close() {
    this.updateUnsavedChangesToStore()
    this.parameterReferences = this.unsavedReferences
    this.closePopUp();
  }

  private updateUnsavedChangesToStore() {
    let references = this.getReferenceFromParameter()
    references?.splice(0,references?.length)
    if(this.unsavedReferences !== undefined)
      this.unsavedReferences.forEach(reference => references?.push(reference))

    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))

  }



  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  saveParameterReference(reference: any) {
    if (this.isRatingUnique(reference) && this.isReferenceUnique(reference)) {
      this.referenceToSend = this.setReferenceRequest(reference)
      this.appService.saveParameterReference(this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          reference.isEdit = false
          reference.referenceId = _data.referenceId
          this.sendReferenceToStore(_data)
          this.ngOnInit()
        }, error: _error => {
          this.showError("Data cannot be saved");
        }
      })
    }
  }

  isRatingUnique(reference: any | ParameterReference): boolean {
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

  isReferenceUnique(reference: any | ParameterReference) : boolean {
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

  setReferenceRequest(reference: any) {
    this.referenceToSend =  {
      reference : reference.reference,
      rating: reference.rating-1,
      parameter: this.parameter.parameterId
    }
    return this.referenceToSend
  }

  sendReferenceToStore(data: ParameterReference) {
    let reference : ParameterReference = {
      referenceId : data.referenceId, rating : data.rating, parameter:data.parameter, reference:data.reference}
    let references = this.getReferenceFromParameter();
    if(references === undefined) {
      let parameter : any = this.getSelectedParameter()
      parameter['references'] = []
      parameter['references'].push(reference)
    }
    else
      references?.push(reference)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  updateParameterReference(reference: any) {
    if(this.isRatingUnique(reference) && this.isReferenceUnique(reference)) {
      this.referenceToSend = this.setReferenceRequest(reference)
      this.referenceToSend.referenceId = reference.referenceId
      this.appService.updateParameterReference(reference.referenceId,this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
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

  updateStore(reference: ParameterReference) {
    let references = this.getReferenceFromParameter();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1, reference)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  private isParameterLevelReference() {
    let flag: boolean = false
    let topic = this.getSelectedTopic()
    if (topic?.parameters !== undefined) {
      topic?.parameters.forEach((parameter: { references: string | any[] | undefined; }) => {
        if (parameter.references !== undefined && parameter.references.length !== 0)
          flag = true
      })
    }
    return flag;
  }

  setParameterReferences() {
    let references = this.getReferenceFromParameter()
    if (references !== undefined) {
      references?.forEach(reference => {
        let eachReference: any = reference
        eachReference.isEdit = false
        this.parameterReferences?.unshift(eachReference)
      })
    }
  }

  getReferenceFromParameter() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics.find(topic => topic.topicId === this.topic)?.parameters.find(parameter => parameter.parameterName === this.parameter.parameterName)?.references
  }

  private getSelectedTopic() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics.find(topic => topic.topicId === this.topic)
  }

  addMaturityReference() {
    this.deleteUnSavedReferences()
    let reference: any = {
      referenceId: -1,
      reference: "",
      rating: -1,
      parameter: this.parameter.parameterId,
      isEdit: true
    }
    this.parameterReferences?.unshift(reference)

  }

  deleteUnSavedReferences() {
    if (this.parameterReferences !== undefined && this.parameterReferences.length !== 0) {
      if (this.parameterReferences[0].referenceId === -1)
        this.parameterReferences.splice(0, 1)
    }
  }

  isReferenceArrayFull(): boolean {
    if (this.parameterReferences === undefined)
      return false;
    else
      return this.parameterReferences.length === 5;
  }

  isInputValid(reference: any) : boolean {
    let newReference : string = reference.reference;
    if(newReference.length !== 0) newReference = newReference.trim()
    return ((reference.rating === -1) || (newReference.length === 0))
  }

  private getSelectedParameter() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics.find(topic => topic.topicId === this.topic)?.parameters.find(parameter => parameter.parameterName === this.parameter.parameterName)
  }

  setIsEdit(reference: any) {
    reference.isEdit = true
    this.unsavedChanges = cloneDeep(reference)
  }

  disableSavedRatings() {
    this.unsavedReferences?.forEach(reference => {
      let rating = this.rating.find(rating => rating.rating === reference.rating)
      rating.selected = true
    })
  }

  cancelChanges(reference: any) {
    reference.reference = this.unsavedChanges.reference
    reference.referenceId = this.unsavedChanges.referenceId
    reference.rating = this.unsavedChanges.rating
    reference.isEdit = false
  }

  deleteMaturityReference(reference: any) {
    if(this.parameterReferences !== undefined) {
      let index = this.parameterReferences.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      this.deleteParameterReference(reference)
      this.parameterReferences.splice(index, 1)
    }
    return  null;
  }

  deleteParameterReference(reference: any) {
    this.appService.deleteParameterReference(reference.referenceId).pipe().subscribe({
      next: () => {
        this.deleteFromStore(reference)
        this.ngOnInit()
      }, error: _error => {
        this.showError("Data cannot be saved");
      }
    })
  }

  deleteFromStore(reference: any) {
    let references = this.getReferenceFromParameter();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }
}
