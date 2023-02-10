import {Component, Input, OnInit} from '@angular/core';
import {data_local} from "../../../messages";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Observable, Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {MatSnackBar} from "@angular/material/snack-bar";
import {cloneDeep} from "lodash";
import {ParameterReference} from "../../../types/parameterReference";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import * as fromActions from "../../../actions/assessment-data.actions";
import {Rating} from "../../../types/Admin/rating";
import {ParameterData} from "../../../types/ParameterData";
import {ParameterStructure} from "../../../types/parameterStructure";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-admin-parameter-reference',
  templateUrl: './admin-parameter-reference.component.html',
  styleUrls: ['./admin-parameter-reference.component.css']
})
export class AdminParameterReferenceComponent implements OnInit {
  @Input() topic: number;
  @Input() category: number
  @Input() module: number
  @Input() parameter: ParameterData

  parameterId : number | undefined
  categories: CategoryResponse[]
  masterData: Observable<CategoryResponse[]>
  parameterReferences: ParameterReference[] | undefined
  unsavedReferences: ParameterReference[] | undefined
  rating: Rating [] = []
  referenceToSend: ParameterReference | null
  unsavedChanges: ParameterReference | null;
  selectedReference: ParameterReference | null;
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
  dataNotSaved = data_local.ADMIN.REFERENCES.DATA_NOT_SAVED
  duplicateRatingMessage = data_local.ADMIN.REFERENCES.DUPLICATE_RATING_ERROR_MESSAGE
  duplicateReferenceMessage = data_local.ADMIN.REFERENCES.DUPLICATE_REFERENCE_ERROR_MESSAGE

  constructor(private appService: AppServiceService, public dialog: MatDialog, private store: Store<AppStates>, private _snackBar: MatSnackBar) {
    this.masterData = this.store.select((masterStore) => masterStore.masterData.masterData)
  }

  ngOnInit(): void {
    this.rating = [{rating: 1, selected: false}, {rating: 2, selected: false}, {rating: 3, selected: false},
      {rating: 4, selected: false}, {rating: 5, selected: false}]
    this.parameterReferences = []
    this.unsavedChanges = null
    this.unsavedReferences = []
    this.masterData.subscribe(data => {
      this.categories = data
      this.setParameterReferences()
      this.getParameterId()
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
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  saveParameterReference(reference: ParameterReference) {
    this.referenceToSend = this.setReferenceRequest(reference)
    if (this.isRatingUnique(reference) && this.isReferenceUnique(reference) && this.referenceToSend !== null) {
      this.appService.saveParameterReference(this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
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

  updateParameterReference(reference:ParameterReference) {
    this.referenceToSend = this.setReferenceRequest(reference)
    if(this.isRatingUnique(reference) && this.isReferenceUnique(reference) && reference.referenceId && this.referenceToSend !== null) {
      this.referenceToSend.referenceId = reference.referenceId
      this.appService.updateParameterReference(reference.referenceId,this.referenceToSend).pipe(takeUntil(this.destroy$)).subscribe({
        next : (_data) => {
          reference.isEdit = false
          this.updateStore(_data)
          this.selectedReference = null
          this.ngOnInit()
        }, error : _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  deleteParameterReference(reference: ParameterReference) {
    if(reference.referenceId) {
      this.appService.deleteParameterReference(reference.referenceId).pipe().subscribe({
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

  isRatingUnique(reference: ParameterReference): boolean {
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

  isReferenceUnique(reference: ParameterReference) : boolean {
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

  setReferenceRequest(reference: ParameterReference) : ParameterReference | null {
    if(this.parameterId) {
      this.referenceToSend = {
        reference: reference.reference.trim(),
        rating: reference.rating - 1,
        parameter: this.parameterId
      }
      return this.referenceToSend
    }
    return null;
  }

  sendReferenceToStore(data: ParameterReference) {
    let reference : ParameterReference = {
      referenceId : data.referenceId, rating : data.rating, parameter:data.parameter, reference:data.reference}
    let references = this.getReferenceFromParameter();
    if(references === undefined) references = []

    references.push(reference)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }


  updateStore(reference: ParameterReference) {
    let references = this.getReferenceFromParameter();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1, reference)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }


  setParameterReferences() {
    let references = this.getReferenceFromParameter()
    if (references !== undefined) {
      references?.forEach(reference => {
        let eachReference: ParameterReference = reference
        eachReference.isEdit = false
        this.parameterReferences?.unshift(eachReference)
      })
    }
    this.sortReferences()
  }

  getReferenceFromParameter() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics.find(topic => topic.topicId === this.topic)?.parameters.find(parameter => parameter.parameterName === this.parameter.parameterName)?.references
  }


  addMaturityReference() {
    if (this.selectedReference !== null && this.selectedReference !== undefined)
      this.selectedReference.isEdit = false
    this.deleteUnSavedReferences()
    this.resetUnsavedChanges()
    if(this.parameterId !== undefined) {
      let reference: ParameterReference = {
        referenceId: -1,
        reference: "",
        rating: -1,
        parameter: this.parameterId,
        isEdit: true
      }
      this.selectedReference = this.selectedReference == reference ? null : reference
      this.parameterReferences?.unshift(reference)
    }

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

  isInputValid(reference: ParameterReference) : boolean {
    let newReference : string = reference.reference;
    if(newReference.length !== 0) newReference = newReference.trim()
    return ((reference.rating === -1) || (newReference.length === 0))
  }

  private getSelectedParameter() {
    return this.categories.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics.find(topic => topic.topicId === this.topic)?.parameters.find(parameter => parameter.parameterName === this.parameter.parameterName)
  }

  setIsEdit(reference: ParameterReference) {
    this.deleteUnSavedReferences()
    this.resetUnsavedChanges()
    let parameterId: number | undefined = this.parameterId
    if(parameterId) {
      let selectedReference: ParameterReference = {parameter: parameterId, reference: reference.reference, referenceId: reference.referenceId, rating: reference.rating}
      if (this.selectedReference !== null && this.selectedReference !== undefined) this.selectedReference.isEdit = false
      reference.isEdit = true
      this.unsavedChanges = cloneDeep(selectedReference)
      this.selectedReference = this.selectedReference === reference ? null : reference
    }
  }

  disableSavedRatings() {
    this.unsavedReferences?.forEach(reference => {
      let rating = this.rating.find(eachRating => eachRating.rating === reference.rating)
      if(rating) rating.selected = true
    })
  }

  cancelChanges(reference: ParameterReference) {
    this.selectedReference = this.selectedReference == reference ? null : reference
    this.resetReference(reference);
  }

  deleteMaturityReference(reference: ParameterReference) {
    if(this.parameterReferences !== undefined) {
      let index = this.parameterReferences.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      this.deleteParameterReference(reference)
      this.parameterReferences.splice(index, 1)
    }
  }


  deleteFromStore(reference: ParameterReference) {
    let references = this.getReferenceFromParameter();
    if (references !== undefined) {
      let index = references.findIndex(eachReference => eachReference.referenceId === reference.referenceId)
      references.splice(index, 1)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  private getParameterId() : number {
    this.parameterId = this.getSelectedParameter()?.parameterId
    return this.parameterId ? this.parameterId : -1
  }

  private resetUnsavedChanges() {
    if(this.unsavedChanges !== null) {
      let reference = this.parameterReferences?.find(eachReference => eachReference.referenceId === this.unsavedChanges?.referenceId)
      this.resetReference(reference)
    }
  }

  private resetReference(reference: ParameterReference | undefined) {
    if (this.unsavedChanges !== null && reference !== undefined) {
      reference.reference = this.unsavedChanges.reference
      reference.referenceId = this.unsavedChanges.referenceId
      reference.rating = this.unsavedChanges.rating
      reference.isEdit = false
    }
  }

  private sortReferences() {
    this.parameterReferences?.sort((reference1,reference2) => reference1.rating - reference2.rating)
  }
}
