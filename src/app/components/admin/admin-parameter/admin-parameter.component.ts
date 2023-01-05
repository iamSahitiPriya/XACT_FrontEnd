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
import {AppStates} from "../../../reducers/app.states";
import * as fromActions from "../../../actions/assessment-data.actions";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-admin-parameter',
  templateUrl: './admin-parameter.component.html',
  styleUrls: ['./admin-parameter.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminParameterComponent implements OnInit {
  private dialogRef: MatDialogRef<any>;
  parameterData: ParameterData[];
  categoryData: CategoryResponse[]
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName', 'parameterName', 'updatedAt', 'active', 'edit', 'reference', 'addQuestion'];
  commonErrorFieldText = data_local.ADMIN.ERROR;
  dataSource: MatTableDataSource<ParameterData>;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ParameterData>
  dataToDisplayed: ParameterData[]
  private destroy$: Subject<void> = new Subject<void>();
  masterData: Observable<CategoryResponse[]>
  categoryList: any[] = []
  moduleList: any[] = []
  parameter: ParameterData
  unSavedParameter: ParameterData
  selectedParameter: ParameterData | null;
  categoryAndModule = new Map();
  moduleAndTopic = new Map();
  topicList: any[] = [];
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


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar, private store: Store<AppStates>, private dialog: MatDialog) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
    this.parameterData = []
    this.dataSource = new MatTableDataSource<ParameterData>(this.parameterData)
    this.dataToDisplayed = [...this.dataSource.data]
  }

  ngOnInit(): void {
    this.categoryList=[]
    this.masterData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.categoryData = data
        data.forEach(eachCategory => {
             this.fetchModules(eachCategory);
        })
        this.sortData();
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
    })
  }

  private sortData() {
    this.parameterData.sort((parameter1, parameter2) => Number(parameter2.updatedAt) - Number(parameter1.updatedAt));
    this.categoryList?.sort((category1, category2) => Number(category2.active) - Number(category1.active))
    this.moduleList?.sort((module1, module2) => Number(module2.active) - Number(module1.active))
    this.topicList?.sort((topic1, topic2) => Number(topic2.active) - Number(topic1.active))
  }

  private fetchModules(eachCategory: CategoryResponse) {
    let modules: any [] = [];
    this.categoryList.push({
      categoryId: eachCategory.categoryId,
      categoryName: eachCategory.categoryName,
      active: eachCategory.active
    })
    eachCategory.modules?.forEach(eachModule => {
      this.moduleAndTopic.set(eachModule.moduleId, [])
      modules.push({moduleId: eachModule.moduleId, moduleName: eachModule.moduleName, active: eachModule.active})
      this.categoryAndModule.set(eachCategory.categoryId, modules)
      if (eachModule.topics) {
        this.fetchTopics(eachModule, eachCategory);
      }
    })
  }

  private fetchTopics(eachModule: ModuleStructure, eachCategory: CategoryResponse) {
    let topic: any[] = [];
    this.moduleList.push({
      moduleId: eachModule.moduleId, moduleName: eachModule.moduleName, active: eachModule.active
    })
    eachModule.topics?.forEach(eachTopic => {
      this.topicAndParameter.set(eachTopic.topicId, [])
      topic.push({topicId: eachTopic.topicId, topicName: eachTopic.topicName, active: eachTopic.active})
      this.moduleAndTopic.set(eachModule.moduleId, topic)
      if (eachTopic.parameters) {
        this.fetchParameters(eachTopic, eachCategory, eachModule);
      }
    })
  }

  private fetchParameters(eachTopic: TopicStructure, eachCategory: CategoryResponse, eachModule: ModuleStructure) {
    let parameters: any[] = [];
    this.topicList.push({
      topicId: eachTopic.topicId, topicName: eachTopic.topicName, active: eachTopic.active
    })
    eachTopic.parameters?.forEach(eachParameter => {
      parameters.push({
        parameterId: eachParameter.parameterId,
        parameterName: eachParameter.parameterName,
        active: eachParameter.active
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
        active: eachParameter.active,
        updatedAt: eachParameter.updatedAt,
        comments: eachParameter.comments,
        parameterId: eachParameter.parameterId,
        parameterName: eachParameter.parameterName
      }
      this.parameterData.push(parameter)
    })
  }

  addParameterRow() {
    let newParameter = {
      categoryId: -1,
      categoryName: "",
      categoryStatus: false,
      moduleId: -1,
      moduleName: "",
      moduleStatus: false,
      topicId: -1,
      topicName: "",
      topicStatus: false,
      parameterId: -1,
      parameterName: "",
      active: false,
      updatedAt: Date.now(),
      comments: "",
      isEdit: true
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

  cancelChanges(row: any) {
    this.resetRow(row)
    this.selectedParameter = this.selectedParameter === row ? null : row
    return row;
  }

  private resetRow(row: any) {
    row.categoryName = this.unSavedParameter.categoryName
    row.moduleName = this.unSavedParameter.moduleName
    row.parameterName = this.unSavedParameter.parameterName
    row.active = this.unSavedParameter.active
    row.updatedAt = this.unSavedParameter.updatedAt
    row.comments = this.unSavedParameter.comments
  }


  saveParameterRow(row: any) {
    let parameterSaveRequest = this.getParameterRequest(row);
    if (this.isParameterUnique) {
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
          this.showError("Some error occurred")
        }
      })
    }
  }

  private getParameterRequest(row: any): any {
    let selectedTopicId = this.topicList.find(topic => topic.topicName === row.topicName).topicId
    let parameterArray = this.topicAndParameter.get(selectedTopicId)
    let index = parameterArray.findIndex((parameter: any) => parameter.parameterName.toLowerCase().replace(/\s/g, '') === row.parameterName.toLowerCase().replace(/\s/g, ''));
    if (index === -1) {
      return this.setParameterRequest(selectedTopicId, row);
    } else {
      this.isParameterUnique = false;
      this.showError(this.duplicateErrorMessage)
      return null
    }
  }

  private setParameterRequest(selectedTopicId: number, row: any) {
    this.isParameterUnique = true;
    return {
      topic: selectedTopicId,
      parameterName: row.parameterName,
      active: row.active,
      comments: row.comments,
    }
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  editParameterRow(row: any) {
    this.resetUnsavedChanges(row)
    this.deleteAddedParameterRow()
    this.selectedParameter = this.selectedParameter === row ? null : row
    this.isEditable = true;
    row.isEdit = false;
    let categoryId = this.categoryList.find(eachCategory => eachCategory.categoryName === row.categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    let moduleId = this.moduleList.find(eachModule => eachModule.moduleName === row.moduleName).moduleId
    this.topicList = this.moduleAndTopic.get(moduleId)
    this.unSavedParameter = cloneDeep(row)
    this.parameter = Object.assign({}, row)
    return this.selectedParameter;
  }

  resetUnsavedChanges(row: any) {
    if (this.unSavedParameter !== undefined && this.unSavedParameter.parameterId !== row.parameterId) {
      let data = this.dataSource.data
      let index = data.findIndex(parameter => parameter.parameterId === this.unSavedParameter.parameterId)
      if (index !== -1) {
        data.splice(index, 1, this.unSavedParameter)
        this.dataSource.data = data
      }
    }
  }

  updateParameterRow(row: any) {
    let selectedTopicId = this.topicList.find(topic => topic.topicName === row.topicName).topicId
    let parameterRequest = this.setParameterRequest(selectedTopicId, row);
    if (this.unSavedParameter.parameterName.toLowerCase().replace(/\s/g, '') !== row.parameterName.toLowerCase().replace(/\s/g, '')) {
      parameterRequest = this.getParameterRequest(row);
    }
    if (this.isParameterUnique) {
      this.appService.updateParameter(parameterRequest, row.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false;
          this.selectedParameter = null;
          this.updateToStore(_data)
          this.table.renderRows()
          this.showNotification("Your changes have been successfully updated.", 2000)
          this.parameterData = []
          this.ngOnInit()
        }, error: _error => {
          this.showError("Some error occurred");
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
    let data = this.dataSource.data
    let index = data.findIndex(parameter => parameter.parameterId === -1)
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data
      this.selectedParameter = null
      this.table.renderRows()
    }
  }

  shortlistModules(row: any) {
    row.moduleName = ''
    row.topicName = ''
    let categoryId = this.categoryList.find(eachCategory => eachCategory.categoryName === row.categoryName).categoryId
    this.topicList = []
    this.moduleList = this.categoryAndModule.get(categoryId)
    if (this.moduleList === undefined) {
      this.moduleList = [{moduleName: this.moduleNotFoundMessage}]
    }
    this.moduleList.sort((module1, module2) => Number(module2.active) - Number(module1.active))
  }

  shortListTopics(moduleName: string) {
    let moduleId = this.moduleList.find(eachModule => eachModule.moduleName === moduleName).moduleId
    this.topicList = this.moduleAndTopic.get(moduleId)
    if (this.topicList.length === 0) {
      this.topicList = [{topicName: this.topicNotFoundMessage}]
    }
    this.topicList.sort((topic1, topic2) => Number(topic2.active) - Number(topic1.active))
  }


  private updateToStore(_data: any) {
    let parameters: any = this.categoryData.find(eachCategory => eachCategory.categoryId === this.unSavedParameter.categoryId)?.modules?.find(eachModule => eachModule.moduleId === this.unSavedParameter.moduleId)?.topics?.find(eachTopic => eachTopic.topicId === this.unSavedParameter.topicId)?.parameters

    let parameterIndex = parameters?.findIndex((eachParameter: { parameterId: any; }) => eachParameter.parameterId === this.unSavedParameter.parameterId)
    if (parameterIndex !== -1) {
      let fetchedParameter: any = parameters?.at(parameterIndex)
      _data["questions"] = fetchedParameter.questions
      _data["references"] = fetchedParameter.references
      parameters.splice(parameterIndex, 1)
      this.sendToStore(_data)
    }
  }

  private sendToStore(_data: any) {
    let parameters: any = this.categoryData.find(eachCategory => eachCategory.categoryId === _data.categoryId)?.modules?.find(eachModule => eachModule.moduleId === _data.moduleId)?.topics?.find(eachTopic => eachTopic.topicId === _data.topicId)?.parameters
    let parameter = {
      parameterId: _data.parameterId,
      parameterName: _data.parameterName,
      active: _data.active,
      comments: _data.comments,
      updatedAt: Date.now(),
      questions: _data.questions ? _data.questions : [],
      references: _data.references ? _data.references : []
    }
    parameters?.push(parameter)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryData}))
    this.ngOnInit();
  }

  async openParameterReference(reference: any, row: any) {
    if (this.isParameterReference(row)) {
      this.dialogRef = this.dialog.open(reference, {
        width: '62vw',
        height: '66vh',
        maxWidth: '80vw',
        maxHeight: '71vh'
      })
      this.dialogRef.disableClose = true;
    } else
      this.showError(this.topicReferenceMessage)
  }

  findCategoryId(row: any) {
    return this.categoryList.find(category => category.categoryName === row.categoryName).categoryId
  }

  findModuleId(row: any) {
    let modules = this.categoryAndModule.get(this.findCategoryId(row))
    return modules.find((module: { moduleName: any; }) => module.moduleName === row.moduleName).moduleId
  }

  findTopicId(row: any) {
    let topics = this.moduleAndTopic.get(this.findModuleId(row))
    return topics.find((topic: { topicName: any; }) => topic.topicName === row.topicName).topicId
  }

  private isParameterReference(row: any) {
    let flag = true;
    let references = this.categoryData.find(category => category.categoryName === row.categoryName)?.modules.find(module => module.moduleName === row.moduleName)?.topics.find(topic => topic.topicName === row.topicName)?.references
    if (references !== undefined && references.length !== 0)
      flag = false

    return flag
  }

  openQuestions(questions:any) {
    this.dialogRef = this.dialog.open(questions, {
      width: '62vw',
      height: '66vh',
      maxWidth: '80vw',
      maxHeight: '71vh'
    })
    this.dialogRef.disableClose = true;
  }
}

