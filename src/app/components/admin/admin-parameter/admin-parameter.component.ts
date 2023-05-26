import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, Subject, takeUntil} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {CategoryResponse} from "../../../types/categoryResponse";
import {ModuleStructure} from "../../../types/moduleStructure";
import {ParameterData} from "../../../types/ParameterData";
import {TopicStructure} from "../../../types/topicStructure";
import {cloneDeep} from "lodash";
import {Store} from "@ngrx/store";
import {AppStates, User} from "../../../reducers/app.states";
import * as fromActions from "../../../actions/assessment-data.actions";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CategoryRequest} from "../../../types/Admin/categoryRequest";
import {ModuleRequest} from "../../../types/Admin/moduleRequest";
import {TopicRequest} from "../../../types/Admin/topicRequest";
import {ParameterRequest} from "../../../types/Admin/parameterRequest";
import {ParameterResponse} from "../../../types/Admin/parameterResponse";
import {ParameterStructure} from "../../../types/parameterStructure";
import {Router} from "@angular/router";
import {PopupConfirmationComponent} from "../../popup-confirmation/popup-confirmation.component";


const NOTIFICATION_DURATION = 5000;

@Component({
  selector: 'app-admin-parameter',
  templateUrl: './admin-parameter.component.html',
  styleUrls: ['./admin-parameter.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100%'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminParameterComponent implements OnInit {
  private dialogRef: MatDialogRef<any>;
  parameterData: ParameterData[];
  categoryData: CategoryResponse[]
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName', 'parameterName', 'updatedAt', 'active', 'reference','addQuestion'];
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  dataSource: MatTableDataSource<ParameterData>;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ParameterData>
  dataToDisplayed: ParameterData[]
  private destroy$: Subject<void> = new Subject<void>();
  masterData: Observable<CategoryResponse[]>
  categoryList: CategoryRequest[] = []
  moduleList: ModuleRequest[] = []
  parameter: ParameterData
  unSavedParameter: ParameterData | undefined;
  selectedParameter: ParameterData | null;
  categoryAndModule = new Map();
  moduleAndTopic = new Map();
  topicList: TopicRequest[] = [];
  topicAndParameter = new Map();
  isParameterAdded: boolean = false;
  isEditable: boolean = false;
  isParameterUnique = true;
  moduleNotFoundMessage: string = data_local.ADMIN.MODULE_NOT_FOUND
  topicNotFoundMessage: string = data_local.ADMIN.PARAMETER.TOPIC_NOT_FOUND
  duplicateErrorMessage = data_local.ADMIN.DUPLICATE_ERROR_MESSAGE
  serverErrorMessage = data_local.ADMIN.SERVER_ERROR_MESSAGE
  updateSuccessMessage = data_local.ADMIN.UPDATE_SUCCESSFUL_MESSAGE
  date = data_local.ADMIN.DATE
  active = data_local.ADMIN.ACTIVE
  action = data_local.ADMIN.ACTION
  edit = data_local.ADMIN.EDIT
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  categoryLabel = data_local.ADMIN.CATEGORY_NAME
  moduleLabel = data_local.ADMIN.MODULE_NAME
  topicLabel = data_local.ADMIN.TOPIC_NAME
  parameterLabel = data_local.ADMIN.PARAMETER_NAME
  parameterInput = data_local.ADMIN.PARAMETER.PARAMETER_INPUT_TEXT
  dataNotFound = data_local.ADMIN.DATA_NOT_FOUND;
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT
  topicReferenceMessage = data_local.ADMIN.REFERENCES.TOPIC_REFERENCE_MESSAGE
  path: string;
  loggedInUser: Observable<User>
  loggedInUserEmail: string
  private adminTopicReferenceMessage= data_local.ADMIN.REFERENCES.ADMIN_TOPIC_REFERENCE_MESSAGE;
  private confirmationText: string =data_local.ADMIN.PARAMETER.CONFIRMATION_TEXT;
  private isNotParameterLevelReference: number =2;
  private isParameterLevelReference: number =1;
  warningLabel: string = data_local.ADMIN.REFERENCES.WARNING_LABEL;

  constructor(private router: Router, private appService: AppServiceService, private _snackbar: MatSnackBar, private store: Store<AppStates>, private dialog: MatDialog) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
    this.parameterData = []
    this.loggedInUser = this.store.select(storeMap => storeMap.loggedInUserEmail)
    this.dataSource = new MatTableDataSource<ParameterData>(this.parameterData)
    this.dataToDisplayed = [...this.dataSource.data];
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/');
      this.path = path[1];
    })
  }

  ngOnInit(): void {
    this.categoryList = []
    this.masterData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.categoryData = data
        data.forEach(eachCategory => {
          this.fetchModules(eachCategory);
        })
      }
    })
  }

  sortParameter() {
    this.parameterData.sort((parameter1, parameter2) => Number(parameter2.updatedAt) - Number(parameter1.updatedAt));
    this.dataSource = new MatTableDataSource<ParameterData>(this.parameterData)
    this.paginator.pageIndex = 0
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (tableData: any, sortHeaderId: string): string => {
      if (typeof tableData[sortHeaderId] === 'string') {
        return tableData[sortHeaderId].toLocaleLowerCase();
      }
      return tableData[sortHeaderId];
    };
    this.dataSource.sort = this.sort;
  }

  private sortData() {
    this.categoryList?.sort((category1, category2) => Number(category2.active) - Number(category1.active))
    this.moduleList?.sort((module1, module2) => Number(module2.active) - Number(module1.active))
    this.topicList?.sort((topic1, topic2) => Number(topic2.active) - Number(topic1.active))
  }

  private fetchModules(eachCategory: CategoryResponse) {
    this.loggedInUser.subscribe(email => {
      this.loggedInUserEmail = email.email
      if (email.email.length > 0) {
        let modules: ModuleRequest [] = [];
        eachCategory.modules?.forEach(eachModule => {
          if (this.path === 'admin') {
            this.setModules(eachModule, modules, eachCategory);
          } else if (this.path === 'contributor') {
            this.displayedColumns = ['categoryName', 'moduleName', 'topicName', 'parameterName', 'updatedAt', 'active', 'edit', 'reference', 'addQuestion']
            let contributor = eachModule.contributors?.find(eachContributor => eachContributor.userEmail === this.loggedInUserEmail);
            let category = {
              categoryId: eachCategory.categoryId,
              categoryName: eachCategory.categoryName,
              active: eachCategory.active
            };
            if (contributor?.role === 'AUTHOR' && !this.categoryList.some(everyCategory=>everyCategory.categoryId === category.categoryId)) {
              this.categoryList.push(category)
              this.setModules(eachModule, modules, eachCategory);
            }
          }
        })
      }
    })
  }

  private setModules(eachModule: ModuleStructure, modules: ModuleRequest[], eachCategory: CategoryResponse) {
    this.moduleAndTopic.set(eachModule.moduleId, [])
    modules.push({
      moduleId: eachModule.moduleId,
      moduleName: eachModule.moduleName,
      active: eachModule.active,
      category: eachCategory.categoryId,
      contributors:eachModule.contributors
    })
    this.categoryAndModule.set(eachCategory.categoryId, modules)
    if (eachModule.topics) {
      this.fetchTopics(eachModule, eachCategory);
    }
  }

  private fetchTopics(eachModule: ModuleStructure, eachCategory: CategoryResponse) {
    let topic: TopicRequest[] = [];
    this.moduleList.push({
      moduleId: eachModule.moduleId,
      moduleName: eachModule.moduleName,
      active: eachModule.active,
      category: eachCategory.categoryId
    })
    eachModule.topics?.forEach(eachTopic => {
      this.topicAndParameter.set(eachTopic.topicId, [])
      topic.push({
        topicId: eachTopic.topicId,
        topicName: eachTopic.topicName,
        topicLevelReference:eachTopic.topicLevelReference,
        active: eachTopic.active,
        module: eachModule.moduleId
      })
      this.moduleAndTopic.set(eachModule.moduleId, topic)
      if (eachTopic.parameters) {
        this.fetchParameters(eachTopic, eachCategory, eachModule);
      }
    })
  }

  private fetchParameters(eachTopic: TopicStructure, eachCategory: CategoryResponse, eachModule: ModuleStructure) {
    let parameters: ParameterRequest[] = [];
    this.topicList.push(
      {
      topicId: eachTopic.topicId, topicName: eachTopic.topicName, active: eachTopic.active, module: eachModule.moduleId,topicLevelReference:eachTopic.topicLevelReference
    }
    )
    eachTopic.parameters?.forEach(eachParameter => {
      parameters.push({
        parameterId: eachParameter.parameterId,
        parameterName: eachParameter.parameterName,
        active: eachParameter.active,
        topic: eachTopic.topicId
      });
      this.topicAndParameter.set(eachTopic.topicId, parameters);
      let parameter: ParameterData = {
        categoryId: eachCategory.categoryId,
        categoryName: eachCategory.categoryName,
        categoryStatus: eachCategory.active,
        moduleId: eachModule.moduleId,
        moduleName: eachModule.moduleName,
        moduleStatus: eachModule.active,
        topicId: eachTopic.topicId,
        topicName: eachTopic.topicName,
        topicStatus: eachTopic.active,
        topicLevelReference:eachTopic.topicLevelReference,
        active: eachParameter.active,
        updatedAt: eachParameter.updatedAt,
        comments: eachParameter.comments,
        parameterId: eachParameter.parameterId,
        parameterName: eachParameter.parameterName,
        parameterLevelReference : eachParameter.parameterLevelReference
      }
      this.parameterData.push(parameter)
    })
    this.sortData()
    this.sortParameter();
  }

  addParameterRow() {
    let newParameter: ParameterData = {
      categoryId: -1,
      categoryName: "",
      categoryStatus: false,
      moduleId: -1,
      moduleName: "",
      moduleStatus: false,
      topicId: -1,
      topicName: "",
      topicStatus: false,
      topicLevelReference:false,
      parameterId: -1,
      parameterName: "",
      active: true,
      updatedAt: Date.now(),
      comments: "",
      isEdit: true,
      openReferences: false,
      openQuestions: false
    }
    this.moduleList = []
    this.topicList = []
    this.deleteAddedParameterRow()
    this.selectedParameter = this.selectedParameter === newParameter ? null : newParameter
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newParameter)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isParameterAdded = true
  }

  cancelChanges(row: ParameterData): ParameterData {
    this.resetRow(row)
    this.selectedParameter = this.selectedParameter === row ? null : row
    return row;
  }

  private resetRow(row: ParameterData) {
    if (this.unSavedParameter !== undefined) {
      row.categoryName = this.unSavedParameter?.categoryName
      row.moduleName = this.unSavedParameter?.moduleName
      row.parameterName = this.unSavedParameter?.parameterName
      row.active = this.unSavedParameter?.active
      row.updatedAt = this.unSavedParameter?.updatedAt
      row.comments = this.unSavedParameter?.comments
    }
  }


  saveParameterRow(row: ParameterData) {
    let parameterSaveRequest = this.getParameterRequest(row);
    let topicLevelReference = this.topicList.find(topic => topic.topicId === parameterSaveRequest?.topic)?.topicLevelReference;
    if (this.isParameterUnique && parameterSaveRequest !== null) {
      if(topicLevelReference){
        this.saveNewParameter(parameterSaveRequest,row)
      }else {
        this.confirmReferencePopup(parameterSaveRequest, row);
      }
    }
  }

  private saveNewParameter(parameterSaveRequest: ParameterRequest, row: ParameterData) {
    this.appService.saveParameter(parameterSaveRequest).subscribe({
      next: (_data) => {
        let data = this.dataSource.data
        row.isEdit = false
        this.isEditable = false;
        this.selectedParameter = null
        data.splice(0, 1)
        this.dataSource.data = data
        this.table.renderRows()
        this.parameterData = []
        this.sendToStore(_data)
      }, error: (_err) => {
        this.showError(this.serverErrorMessage)
      }
    })
  }

  private getParameterRequest(row: ParameterData): ParameterRequest | null {
    let selectedTopicId = this.topicList.find(topic => topic.topicName === row.topicName)?.topicId
    let parameterArray: ParameterRequest[] = this.topicAndParameter?.get(selectedTopicId)
    let index = parameterArray?.findIndex((parameter) => parameter.parameterName.toLowerCase().replace(/\s/g, '') === row.parameterName.toLowerCase().replace(/\s/g, ''));
    if (index === -1 && selectedTopicId !== undefined) {
      return this.setParameterRequest(selectedTopicId, row);
    } else {
      this.isParameterUnique = false;
      this.showError(this.duplicateErrorMessage)
      return null
    }
  }

  private setParameterRequest(selectedTopicId: number | undefined, row: ParameterData): ParameterRequest | null {
    this.isParameterUnique = true;
    if (selectedTopicId !== undefined) {
      return {
        topic: selectedTopicId,
        parameterName: row.parameterName,
        active: row.active,
        comments: row.comments,
      };
    }
    return null
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  editParameterRow(row: ParameterData) {
    this.resetUnsavedChanges(row)
    this.deleteAddedParameterRow()
    this.selectedParameter = this.selectedParameter === row ? null : row
    this.isEditable = true;
    row.isEdit = false;
    let categoryId = this.categoryData.find(eachCategory => eachCategory.categoryName === row.categoryName)?.categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    let moduleId = this.moduleList.find(eachModule => eachModule.moduleName === row.moduleName)?.moduleId
    this.topicList = this.moduleAndTopic.get(moduleId)
    this.unSavedParameter = cloneDeep(row)
    this.parameter = Object.assign({}, row)
    return this.selectedParameter;
  }

  resetUnsavedChanges(row: ParameterData) {
    if (this.unSavedParameter !== undefined && this.unSavedParameter?.parameterId !== row.parameterId) {
      let data = this.dataSource.data
      let index = data.findIndex(parameter => parameter.parameterId === this.unSavedParameter?.parameterId)
      if (index !== -1) {
        data.splice(index, 1, this.unSavedParameter)
        this.dataSource.data = data
      }
    }
  }

  updateParameterRow(row: ParameterData) {
    let selectedTopicId = this.topicList.find(topic => topic.topicName === row.topicName)?.topicId
    let parameterRequest = this.setParameterRequest(selectedTopicId, row);
    if (this.unSavedParameter?.parameterName.toLowerCase().replace(/\s/g, '') !== row.parameterName.toLowerCase().replace(/\s/g, '')) {
      parameterRequest = this.getParameterRequest(row);
    }
    if (this.isParameterUnique && parameterRequest !== null) {
      this.appService.updateParameter(parameterRequest, row.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false;
          this.selectedParameter = null;
          this.updateToStore(_data)
          this.unSavedParameter = undefined;
          this.table.renderRows()
          this.showNotification(this.updateSuccessMessage, NOTIFICATION_DURATION)
          this.parameterData = []
          this.ngOnInit()
        }, error: _error => {
          this.showError(_error.error);
        }
      })
    }
  }

  private showNotification(reportData: string, duration: number) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }


  deleteAddedParameterRow() {
    let data: ParameterData[] = this.dataSource.data
    let index = data.findIndex(parameter => parameter.parameterId === -1)
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data
      this.selectedParameter = null
      this.table.renderRows()
    }
  }

  shortlistModules(row: ParameterData) {
    row.moduleName = ''
    row.topicName = ''
    let categoryId = this.categoryList.find(eachCategory => eachCategory.categoryName === row.categoryName)?.categoryId
    this.topicList = []
    this.moduleList = this.categoryAndModule.get(categoryId)
    if (this.moduleList === undefined) {
      this.moduleList = [{moduleName: this.moduleNotFoundMessage, moduleId: -1, category: -1, active: false}]
    }
    this.moduleList.sort((module1, module2) => Number(module2.active) - Number(module1.active))
  }

  shortListTopics(moduleName: string) {
    let moduleId = this.moduleList.find(eachModule => eachModule.moduleName === moduleName)?.moduleId
    this.topicList = this.moduleAndTopic.get(moduleId)
    if (this.topicList === undefined || this.topicList.length === 0) {
      this.topicList = [{topicName: this.topicNotFoundMessage, module: -1, active: false}]
    }
    this.topicList.sort((topic1, topic2) => Number(topic2.active) - Number(topic1.active))
  }


  private updateToStore(_data: ParameterResponse) {
    let parameters: ParameterStructure[] | undefined = this.categoryData.find(eachCategory => eachCategory.categoryId === this.unSavedParameter?.categoryId)?.modules?.find(eachModule => eachModule.moduleId === this.unSavedParameter?.moduleId)?.topics?.find(eachTopic => eachTopic.topicId === this.unSavedParameter?.topicId)?.parameters
    let parameterIndex = parameters?.findIndex((eachParameter) => eachParameter.parameterId === this.unSavedParameter?.parameterId)
    if (parameterIndex !== -1 && parameterIndex !== undefined) {
      let fetchedParameter: ParameterStructure | undefined = parameters?.slice(parameterIndex, parameterIndex + 1)[0]
      _data.questions = fetchedParameter?.questions
      _data.references = fetchedParameter?.references
      parameters?.splice(parameterIndex, 1)
      this.sendToStore(_data)
    }
  }

  private sendToStore(_data: ParameterResponse) {
    let parameters: ParameterStructure[] | undefined = this.categoryData.find(eachCategory => eachCategory.categoryId === _data.categoryId)?.modules?.find(eachModule => eachModule.moduleId === _data.moduleId)?.topics?.find(eachTopic => eachTopic.topicId === _data.topicId)?.parameters
    if (parameters === undefined) parameters = []
    let parameter: ParameterStructure = {
      parameterId: _data.parameterId,
      parameterName: _data.parameterName,
      active: _data.active,
      comments: _data.comments,
      updatedAt: Date.now(),
      parameterLevelReference:_data.parameterLevelReference,
      topic: _data.topicId,
      questions: _data.questions ? _data.questions : [],
      references: _data.references ? _data.references : []
    }
    parameters?.push(parameter)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryData}))
    this.ngOnInit();
  }

  async openParameterReference(reference: any, row: ParameterData) {
    if (this.isParameterReference(row)) {
      row.openReferences = true;
      this.dialogRef = this.dialog.open(reference, {
        width: '62vw',
        height: '66vh',
        maxWidth: '80vw',
        maxHeight: '71vh'
      })
      this.dialogRef.disableClose = true;
    } else {
      this.path === 'admin' ?  this.showError(this.adminTopicReferenceMessage) : this.showError(this.topicReferenceMessage);

    }
  }

  findCategoryId(row: ParameterData): number {
    let categoryId = this.categoryData.find(category => category.categoryName === row.categoryName)?.categoryId
    return categoryId ? categoryId : -1
  }

  findModuleId(row: ParameterData): number {
    let modules: ModuleRequest[] | undefined = this.categoryAndModule.get(this.findCategoryId(row))
    let moduleId = modules?.find((module) => module.moduleName === row.moduleName)?.moduleId
    return moduleId ? moduleId : -1
  }

  findTopicId(row: ParameterData): number {
    let topics: TopicRequest[] | undefined = this.moduleAndTopic.get(this.findModuleId(row))
    let topicId = topics?.find((topic) => topic.topicName === row.topicName)?.topicId
    return topicId ? topicId : -1
  }

  private isParameterReference(row: ParameterData): boolean {
    let flag = true;
    let references = this.categoryData.find(category => category.categoryName === row.categoryName)?.modules.find(module => module.moduleName === row.moduleName)?.topics.find(topic => topic.topicName === row.topicName)?.references
    if (references !== undefined && references.length !== 0)
      flag = false

    return flag
  }


  private confirmReferencePopup(parameterSaveRequest: ParameterRequest, row: ParameterData) {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px',
      data : {
        level : "topic"
      }
    });
    openConfirm.componentInstance.text = this.confirmationText;
    openConfirm.componentInstance.warningLabel=this.warningLabel;
    openConfirm.afterClosed().subscribe(result => {
      if (result === this.isParameterLevelReference || result === this.isNotParameterLevelReference) {
        parameterSaveRequest.parameterLevelReference = result === this.isParameterLevelReference
        this.saveNewParameter(parameterSaveRequest, row);
      }
    })
  }

  closeQuestions(row :ParameterData){
      row.openQuestions = false
    }

  openQuestionPanel(row : ParameterData) {
    row.openQuestions=true;
  }
  hasParameterLevelReference(row: ParameterData){
    if(row.parameterLevelReference) {
      let references = this.categoryData?.find(eachCategory => eachCategory.categoryId === row.categoryId)?.modules?.find(eachModule => eachModule.moduleId === row.moduleId)?.topics?.find(eachTopic => eachTopic.topicId === row.topicId)?.parameters.find(eachParameter => eachParameter.parameterId === row.parameterId)?.references;
      return references?.length === 0 || references === undefined;
    }
    return false;
  }
}

