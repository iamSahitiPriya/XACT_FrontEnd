/*
 *  Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TopicData} from "../../../types/topicData";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, Subject, takeUntil} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {CategoryResponse} from "../../../types/categoryResponse";
import {ModuleStructure} from "../../../types/moduleStructure";
import * as fromActions from "../../../actions/assessment-data.actions";

import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {cloneDeep} from "lodash";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-admin-topic',
  templateUrl: './admin-topic.component.html',
  styleUrls: ['./admin-topic.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminTopicComponent implements OnInit, OnDestroy {
  private dialogRef: MatDialogRef<any>;
  masterDataCopy: CategoryResponse[]
  categories: CategoryResponse[]
  masterData: Observable<CategoryResponse[]>
  topicData: TopicData[];
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName', 'updatedAt', 'active', 'edit', 'reference'];
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  dataSource: MatTableDataSource<TopicData>;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TopicData>
  dataToDisplayed: TopicData[]
  private destroy$: Subject<void> = new Subject<void>();
  categoryList: any[] = []
  categoryAndModule = new Map();
  moduleAndTopic = new Map();
  moduleList: any[] = []
  selectedTopic: TopicData | null;
  private isTopicAdded: boolean;
  isEditable: boolean;
  unsavedTopic: TopicData | undefined;

  serverErrorMessage = data_local.ADMIN.SERVER_ERROR_MESSAGE
  duplicateError = data_local.ADMIN.DUPLICATE_ERROR_MESSAGE
  updateSuccessMessage = data_local.ADMIN.UPDATE_SUCCESSFUL_MESSAGE
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  addTopic = data_local.ADMIN.TOPIC.ADD_TOPIC
  duplicateErrorMessage = data_local.ADMIN.DUPLICATE_ERROR_MESSAGE
  date = data_local.ADMIN.DATE
  active = data_local.ADMIN.ACTIVE
  action = data_local.ADMIN.ACTION
  edit = data_local.ADMIN.EDIT
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  categoryLabel = data_local.ADMIN.CATEGORY_NAME
  moduleLabel = data_local.ADMIN.MODULE_NAME
  topicLabel = data_local.ADMIN.TOPIC_NAME
  dataNotFound = data_local.ADMIN.DATA_NOT_FOUND;
  moduleNotFound = data_local.ADMIN.MODULE_NOT_FOUND;
  selectCategory = data_local.ADMIN.CATEGORY.SELECT_CATEGORY;
  selectModule = data_local.ADMIN.MODULE.SELECT_MODULE;
  enterTopic = data_local.ADMIN.TOPIC.ENTER_TOPIC
  parameterReferenceMessage = data_local.ADMIN.REFERENCES.PARAMETER_REFERENCE_MESSAGE


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar, private store: Store<AppStates>, private dialog: MatDialog) {
    this.masterData = this.store.select((masterStore) => masterStore.masterData.masterData)
    this.topicData = []
    this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
    this.dataToDisplayed = [...this.dataSource.data]
  }

  ngOnInit(): void {
    this.categoryList = []
    this.masterData.subscribe(data => {
      if (data !== undefined) {
        this.categories = data
        data.forEach(eachCategory => {
          this.fetchModuleDetails(eachCategory);
        })
        this.sortTopic();
      }
    })
  }

   sortTopic() {
    this.topicData = this.topicData.sort((topic1, topic2) => topic2.updatedAt - topic1.updatedAt);
    this.categoryList.sort((category1, category2) => Number(category2.active) - Number(category1.active))
    this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchModuleDetails(eachCategory: CategoryResponse) {
    let module: any [] = [];
    this.categoryList.push({
      categoryId: eachCategory.categoryId,
      categoryName: eachCategory.categoryName,
      active: eachCategory.active
    })
    eachCategory.modules?.forEach(eachModule => {
      this.moduleAndTopic.set(eachModule.moduleId, [])
      module.push({moduleId: eachModule.moduleId, moduleName: eachModule.moduleName, active: eachModule.active})
      this.categoryAndModule.set(eachCategory.categoryId, module)
      if (eachModule.topics) {
        this.fetchTopics(eachModule, eachCategory);
      }
    })
  }

  private fetchTopics(eachModule: ModuleStructure, eachCategory: CategoryResponse) {
    eachModule.topics?.forEach(eachTopic => {
      let topics = this.moduleAndTopic.get(eachModule.moduleId)
      topics.push(eachTopic.topicName)
      this.moduleAndTopic.set(eachModule.moduleId, topics)
      let topic: TopicData = {
        categoryId: -1,
        categoryName: "",
        categoryStatus: false,
        moduleId: -1,
        moduleName: "",
        moduleStatus: false,
        topicId: -1,
        topicName: "",
        active: false,
        updatedAt: 123,
        comments: ""
      }
      topic.categoryId = eachCategory.categoryId
      topic.categoryName = eachCategory.categoryName
      topic.categoryStatus = eachCategory.active
      topic.moduleId = eachModule.moduleId
      topic.moduleName = eachModule.moduleName
      topic.moduleStatus = eachModule.active
      topic.topicId = eachTopic.topicId
      topic.active = eachTopic.active
      topic.topicName = eachTopic.topicName
      topic.updatedAt = eachTopic.updatedAt
      topic.comments = eachTopic.comments
      this.topicData.push(topic)
    })
  }

  addTopicRow() {
    this.deleteAddedTopicRow()
    this.moduleList = []
    let newTopic = {
      categoryId: -1,
      categoryName: "",
      categoryStatus: false,
      moduleId: -1,
      moduleName: "",
      moduleStatus: false,
      topicId: -1,
      topicName: "",
      active: true,
      updatedAt: Date.now(),
      comments: "",
      isEdit: true,
    }
    this.selectedTopic = this.selectedTopic == newTopic ? null : newTopic
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newTopic)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isTopicAdded = true
  }

  saveTopic(row: any) {
    let topicSaveRequest = this.getTopicRequest(row);
    if (topicSaveRequest !== null) {
      this.appService.saveTopic(topicSaveRequest).subscribe({
        next: (_data: any) => {
          let data = this.dataSource.data
          this.isEditable = false;
          data.splice(0, 1)
          this.dataSource.data = data
          this.selectedTopic = null
          row.updatedAt = _data.updatedAt
          row.isEdit = false
          this.topicData = []
          this.table.renderRows()
          this.sendToStore(_data)
          this.ngOnInit()
        }, error: (_err: any) => {
          this.showError(this.serverErrorMessage)
        }
      })
    }
  }

  getTopicRequest(row: TopicData) {
    let selectedModuleId = this.moduleList.find(module => module.moduleName === row.moduleName).moduleId
    let topicArray = this.moduleAndTopic.get(selectedModuleId)
    let topicIndex = topicArray.findIndex((topic: string) => topic.toLowerCase().replace(/\s/g, '') === row.topicName.toLowerCase().replace(/\s/g, ''))
    if (this.isTopicUnique(topicIndex)) {
      return this.setTopicRequest(row)
    } else {
      this.showError(this.duplicateError)
      return null;
    }
  }

  isTopicUnique(topicIndex: number) {
    return topicIndex === -1;
  }

  setTopicRequest(row: TopicData) {
    let selectedModuleId = this.moduleList.find(module => module.moduleName === row.moduleName).moduleId
    return {
      module: selectedModuleId,
      topicName: row.topicName,
      active: row.active,
      comments: row.comments,
    }
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  editTopic(row: any) {
    this.resetUnsavedChanges(row);

    this.deleteAddedTopicRow()
    this.selectedTopic = this.selectedTopic == row ? null : row
    this.isEditable = true
    row.isEdit = false
    let categoryId = this.categoryList.find(category => category.categoryName == row.categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    this.unsavedTopic = cloneDeep(row);
    return this.selectedTopic
  }


  resetUnsavedChanges(row: any) {
    if (this.unsavedTopic !== undefined && this.unsavedTopic?.topicId !== row.topicId) {
      let data = this.dataSource.data
      let index = data.findIndex(topic => topic.topicId === this.unsavedTopic?.topicId)
      if (index !== -1) {
        data.splice(index, 1, this.unsavedTopic)
        this.dataSource.data = data
      }
    }
  }

  updateTopic(row: any) {
    let topicRequest: { comments: string | undefined; module: any; topicName: string; active: boolean } | null = this.setTopicRequest(row);
    if (this.unsavedTopic?.topicName.toLowerCase().replace(/\s/g, '') !== row.topicName.toLowerCase().replace(/\s/g, '')) {
      topicRequest = this.getTopicRequest(row)
    }
    if (topicRequest !== null) {
      this.appService.updateTopic(topicRequest, row.topicId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false
          this.selectedTopic = null
          this.table.renderRows()
          row.updatedAt = _data.updatedAt
          this.topicData = []
          this.updateTopicToStore(_data)
          this.unsavedTopic = undefined;
          this.ngOnInit()
          this.showNotification(this.updateSuccessMessage, 2000)
        }, error: _error => {
          this.showError(this.serverErrorMessage);
        }
      })
    }
  }

  deleteAddedTopicRow() {
    let data = this.dataSource.data
    let index = data.findIndex(topic => topic.topicId === -1)
    if (index !== -1) {
      data.splice(index, 1)
      this.dataSource.data = data
      this.selectedTopic = null
      this.table.renderRows()
    }
  }

  shortlistModule(row: TopicData) {
    row.moduleName = ''
    let categoryId = this.categoryList.find(eachCategory => eachCategory.categoryName === row.categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    if (this.moduleList === undefined) {
      this.moduleList = [{moduleName: this.moduleNotFound}]
    }
    this.moduleList.sort((module1, module2) => Number(module2.active) - Number(module1.active))
  }

  private showNotification(reportData: string, duration: number) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  cancelUpdate(row: TopicData) {
    this.resetTopic(row);
    this.selectedTopic = this.selectedTopic === row ? null : row
    this.moduleList = []
    return row;
  }

  resetTopic(row: TopicData) {
    row.categoryName = <string>this.unsavedTopic?.categoryName
    row.categoryId = <number>this.unsavedTopic?.categoryId
    row.active = <boolean>this.unsavedTopic?.active
    row.moduleName = <string>this.unsavedTopic?.moduleName
    row.moduleId = <number>this.unsavedTopic?.moduleId
    row.topicId = <number>this.unsavedTopic?.topicId
    row.topicName = <string>this.unsavedTopic?.topicName
    row.updatedAt = <number>this.unsavedTopic?.updatedAt
    row.comments = <string>this.unsavedTopic?.comments
  }

  private getTopicStructure(_data: any) {
    return this.categories.find(eachCategory => eachCategory.categoryId === _data.categoryId)?.modules.find(
      eachModule => eachModule.moduleId === _data.moduleId)?.topics
  }

  sendToStore(_data: any) {
    let topic = {
      topicId: _data.topicId,
      topicName: _data.topicName,
      module: _data.moduleId,
      updatedAt: _data.updatedAt,
      active: _data.active,
      comments: _data.comments,
      parameters: _data.parameters ? _data.parameters : [],
      references: _data.references ? _data.references : []
    }
    let topicStructure = this.getTopicStructure(_data)
    topicStructure?.push(topic)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  private updateTopicToStore(_data: any) {
    let topic = this.categories.find(eachCategory => eachCategory.categoryId === _data.categoryId)
      ?.modules.find(eachModule => eachModule.moduleId === _data.moduleId)
      ?.topics
    let topicIndex = topic?.findIndex(eachTopic => eachTopic.topicId === _data.topicId)
    if (topicIndex !== undefined) {
      let fetchedTopic: any = topic?.slice(topicIndex,topicIndex+1)[0]
      _data['parameters'] = fetchedTopic.parameters
      _data['references'] = fetchedTopic.references
      topic?.splice(topicIndex, 1)
      this.sendToStore(_data)
    }
  }

  isInputValid(row: any) {
    return ((row.categoryName === '') || (row.moduleName === '') || (row.topicName === '') || !(row.topicName.match('^[a-zA-Z0-9-()._:&,-]+(\\s+[a-zA-Z0-9-()._:&,-]+)*$')));
  }

  async openTopicReferences(reference: any, row: any) {
    if (this.isTopicReferences(row)) {
      this.dialogRef = this.dialog.open(reference, {
        width: '62vw',
        height: '66vh',
        maxWidth: '80vw',
        maxHeight: '71vh'
      })
      this.dialogRef.disableClose = true;
    } else
      this.showError(this.parameterReferenceMessage)
  }

  private isTopicReferences(row: any) {
    let flag = true;
    this.categories.find(category => category.categoryName === row.categoryName)?.modules.find(module => module.moduleName === row.moduleName)?.topics.find(topic => topic.topicName === row.topicName)?.parameters?.forEach(parameter => {
      if (parameter.references !== undefined && parameter.references.length !== 0)
        flag = false
    })


    return flag
  }

  findCategoryId(row: any) {
    return this.categoryList.find(category => category.categoryName === row.categoryName).categoryId;
  }

  findModuleId(row: any) {
    let modules = this.categoryAndModule.get(this.findCategoryId(row))
    return modules.find((module: { moduleName: any; }) => module.moduleName === row.moduleName).moduleId
  }
}
