import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TopicData} from "../../../types/topicData";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject, takeUntil} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {TopicResponse} from "../../../types/Admin/topicResponse";
import cloneDeep from "lodash/cloneDeep";

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
  topicData: TopicData[];
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName', 'active', 'updatedAt', 'edit', 'reference'];
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  dataSource: MatTableDataSource<TopicData>;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TopicData>
  dataToDisplayed: TopicData[]
  private destroy$: Subject<void> = new Subject<void>();
  private dataSourceArray: TopicData[];
  categoryList: any[] = []
  categoryAndModule = new Map()
  moduleMap = new Map()
  moduleList: any[] = []
  selectedTopic: TopicData | null;
  private isTopicAdded: boolean;
  private isEditable: boolean;
  private unsavedTopic: TopicData;
  setCategory: string = '';
  setModule: string = '';
  serverErrorMessage = data_local.ADMIN.SERVER_ERROR_MESSAGE
  duplicateTopicError = data_local.ADMIN.TOPIC.DUPLICATE_TOPIC_ERROR_MESSAGE
  updateSuccessMessage = data_local.ADMIN.UPDATE_SUCCESSFUL_MESSAGE
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  addTopic = data_local.ADMIN.TOPIC.ADD_TOPIC
  category = data_local.ADMIN.CATEGORY.CATEGORY
  selectCategory = data_local.ADMIN.CATEGORY.SELECT_CATEGORY
  module = data_local.ADMIN.MODULE.MODULE
  selectModule = data_local.ADMIN.MODULE.SELECT_MODULE
  topic = data_local.ADMIN.TOPIC.TOPIC
  enterTopic = data_local.ADMIN.TOPIC.ENTER_TOPIC
  date = data_local.ADMIN.DATE
  active = data_local.ADMIN.ACTIVE
  action = data_local.ADMIN.ACTION
  edit = data_local.ADMIN.EDIT
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE

  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar,) {
    this.topicData = []
    this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
    this.dataToDisplayed = [...this.dataSource.data]
  }

  ngOnInit(): void {
    this.moduleMap = new Map();
    this.appService.getAllTopics().pipe(takeUntil(this.destroy$)).subscribe(data => {
      data.forEach((eachTopic) => {
        if (eachTopic) {
          this.fetchCategory(eachTopic);
          this.fetchModule(eachTopic);
          this.fetchTopics(eachTopic);
          this.mapModuleToTopic(eachTopic);
        }
      })
      this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
      this.paginator.pageIndex = 0
      this.dataSource.paginator = this.paginator;
      this.dataSourceArray = [...this.dataSource.data]
    })
  }

  private fetchModule(eachTopic: TopicResponse) {
    if (this.categoryAndModule.has(eachTopic.module.category.categoryId)) {
      let module = {
        moduleId: eachTopic.module.moduleId,
        moduleName: eachTopic.module.moduleName,
        active: eachTopic.module.active
      }
      let moduleList = this.categoryAndModule.get(eachTopic.module.category.categoryId)
      let index = moduleList.findIndex((module: { moduleId: number; }) => module.moduleId === eachTopic.module.moduleId)
      if (index == -1)
        moduleList.push(module)
      this.categoryAndModule.set(eachTopic.module.category.categoryId, moduleList)

    } else {
      let allModules = []
      let module = {
        moduleId: eachTopic.module.moduleId,
        moduleName: eachTopic.module.moduleName,
        active: eachTopic.module.active
      }
      allModules.push(module)
      this.categoryAndModule.set(eachTopic.module.category.categoryId, allModules)
    }
  }

  private mapModuleToTopic(eachTopic: TopicResponse) {
    if (this.moduleMap.has(eachTopic.module.moduleId)) {
      let moduleArray = this.moduleMap.get(eachTopic.module.moduleId)
      let index = moduleArray.findIndex((topic: { topicName: string; }) => topic.topicName === eachTopic.topicName)
      if (index == -1) {
        moduleArray.push(eachTopic.topicName)
        this.moduleMap.set(eachTopic.module.moduleId, moduleArray)
      }
    } else {
      let moduleArray = []
      moduleArray.push(eachTopic.topicName)
      this.moduleMap.set(eachTopic.module.moduleId, moduleArray)
    }
  }

  private fetchCategory(eachTopic: TopicResponse) {
    let index = this.categoryList.findIndex(category => category.categoryId == eachTopic.module.category.categoryId)
    if (index == -1) {
      this.categoryList.push({
        categoryId: eachTopic.module.category.categoryId,
        categoryName: eachTopic.module.category.categoryName,
        active: eachTopic.module.category.active
      })
    }
  }

  private fetchTopics(eachTopic: TopicResponse) {
    let topic: TopicData = {
      active: false,
      categoryId: 0,
      categoryName: "",
      moduleId: 0,
      moduleName: "",
      topicId: 0,
      topicName: "",
      updatedAt: 0,
      comments: ""

    }

    topic.categoryId = eachTopic.module.category.categoryId
    topic.categoryName = eachTopic.module.category.categoryName
    topic.moduleId = eachTopic.module.moduleId
    topic.moduleName = eachTopic.module.moduleName
    topic.topicId = eachTopic.topicId
    topic.active = eachTopic.active
    topic.topicName = eachTopic.topicName
    topic.updatedAt = eachTopic.updatedAt
    topic.comments = eachTopic.comments
    this.topicData.push(topic)
  }

  addTopicRow() {
    this.moduleList = []
    let newTopic = {
      active: false,
      categoryId: 0,
      categoryName: "",
      comments: "",
      moduleId: 0,
      moduleName: "",
      topicId: 0,
      topicName: "",
      updatedAt: Date.now(),
      isEdit: true

    }
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newTopic)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isTopicAdded = true
  }


  saveTopic(row: any) {
    let topicSaveRequest = this.getTopicRequest(row);
    if(topicSaveRequest !== null) {
      this.appService.saveTopic(topicSaveRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          let data = this.dataSource.data
          row.isEdit = false
          this.isEditable = false;
          data.splice(0, 1)
          this.dataSource.data = data
          this.table.renderRows()
          this.topicData = []
          this.ngOnInit()
        }, error: (_err) => {
          this.showError(this.serverErrorMessage)
        }
      })
    }
  }

  private setTopicRequest(row : TopicData) {
    let {selectedModuleId, topicIndex} = this.findTopicFromModule(row);
    return {
      module: selectedModuleId,
      topicName: row.topicName,
      active: row.active,
      comments: row.comments,
    }

  }

  private getTopicRequest(row: TopicData) {
    let {selectedModuleId, topicIndex} = this.findTopicFromModule(row);
      if (this.isTopicUnique(topicIndex)) {
        return this.setTopicRequest(row)
      } else {
        this.showError(this.duplicateTopicError)
        return null;
      }
  }

  private isTopicUnique(topicIndex:number) {
    return topicIndex === -1;
  }

  private findTopicFromModule(row: TopicData) {
    let selectedModuleId = this.moduleList.find(module => module.moduleName === row.moduleName).moduleId
    let topicArray = this.moduleMap.get(selectedModuleId)
    let indexOfTopic = topicArray.findIndex((topic: string) => topic === row.topicName)
    return {selectedModuleId, topicIndex: indexOfTopic};
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  editTopic(row: TopicData) {
    this.selectedTopic = this.selectedTopic == row ? null : row
    this.isEditable = true
    let categoryId = this.categoryList.find(category => category.categoryName == row.categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    this.unsavedTopic = cloneDeep(row)
    return this.selectedTopic
  }

  updateTopic(row: any) {
    let topicRequest: { comments: string | undefined; module: any; topicName: string; active: boolean } | null = this.setTopicRequest(row);

    if(this.unsavedTopic.topicName !== row.topicName) {
      topicRequest = this.getTopicRequest(row)
    }

    if(topicRequest !== null) {
      this.appService.updateTopic(topicRequest, row.topicId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            row.isEdit = false
            this.selectedTopic = null
            this.table.renderRows()
            this.showNotification(this.updateSuccessMessage, 2000)
            this.topicData = []
            this.ngOnInit()
          }, error: _error => {
            this.showError(this.serverErrorMessage);
          }
        }
      )
    }
  }

  deleteAddedTopicRow() {
    let data = this.dataSource.data
    data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
    this.dataSource.data = data
    this.table.renderRows()
  }

  private showNotification(reportData: string, duration: number) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  shortlistModule(module: any) {
    let categoryId = this.categoryList.find(category => category.categoryName == module).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
  }

  cancelUpdate(row: TopicData) {
    this.resetTopic(row);
    this.selectedTopic = this.selectedTopic === row ? null : row
    return row;
  }

  private resetTopic(row: TopicData) {
    row.categoryName = this.unsavedTopic.categoryName
    row.categoryId = this.unsavedTopic.categoryId
    row.active = this.unsavedTopic.active
    row.moduleName = this.unsavedTopic.moduleName
    row.moduleId = this.unsavedTopic.moduleId
    row.topicId = this.unsavedTopic.topicId
    row.topicName = this.unsavedTopic.topicName
    row.updatedAt = this.unsavedTopic.updatedAt
    row.comments = this.unsavedTopic.comments
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
