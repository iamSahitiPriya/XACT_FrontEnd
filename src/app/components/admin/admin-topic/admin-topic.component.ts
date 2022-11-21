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
import {CategoryResponse} from "../../../types/categoryResponse";
import {ModuleStructure} from "../../../types/moduleStructure";
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
export class AdminTopicComponent implements OnInit,OnDestroy {
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
  categoryList: any[] = []
  categoryAndModule = new Map();
  moduleAndTopic = new Map();
  moduleList: any[] = []
  selectedTopic: TopicData | null;
  private isTopicAdded: boolean;
  isEditable: boolean;
  unsavedTopic: TopicData;

  serverErrorMessage = data_local.ADMIN.SERVER_ERROR_MESSAGE
  duplicateTopicError = data_local.ADMIN.TOPIC.DUPLICATE_TOPIC_ERROR_MESSAGE
  updateSuccessMessage = data_local.ADMIN.UPDATE_SUCCESSFUL_MESSAGE
  inputErrorMessage = data_local.ADMIN.ERROR
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
  moduleNotFound: any = "No modules available";


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar) {
    this.topicData = []
    this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
    this.dataToDisplayed = [...this.dataSource.data]
  }

  ngOnInit(): void {
    this.appService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
      data.forEach(eachCategory => {
        this.fetchModuleDetails(eachCategory);
      })
      this.topicData = this.topicData.sort((topic1, topic2) => topic2.updatedAt - topic1.updatedAt);
      this.categoryList.sort((category1, category2) => Number(category2.active) - Number(category1.active))
      this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
      this.paginator.pageIndex = 0
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
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
      active: false,
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

  saveTopic(row: TopicData) {
    let topicSaveRequest = this.getTopicRequest(row);

    this.appService.saveTopic(topicSaveRequest).subscribe({
      next: (_data) => {
        let data = this.dataSource.data
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

  getTopicRequest(row: TopicData) {
    let selectedModuleId = this.moduleList.find(module => module.moduleName === row.moduleName).moduleId
    let topicArray = this.moduleAndTopic.get(selectedModuleId)
    let topicIndex = topicArray.findIndex((topic: string) => topic === row.topicName)
    if (this.isTopicUnique(topicIndex)) {
      return this.setTopicRequest(row)
    } else {
      this.showError(this.duplicateTopicError)
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
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  editTopic(row:any) {
    this.deleteAddedTopicRow()
    this.selectedTopic = this.selectedTopic == row ? null : row
    this.isEditable = true
    row.isEdit = false
    let categoryId = this.categoryList.find(category => category.categoryName == row.categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    this.unsavedTopic = cloneDeep(row)
    return this.selectedTopic
  }


  updateTopic(row: any) {
    let topicRequest: { comments: string | undefined; module: any; topicName: string; active: boolean } | null = this.setTopicRequest(row);

    if (this.unsavedTopic.topicName !== row.topicName) {
      topicRequest = this.getTopicRequest(row)
    }


    if (topicRequest !== null) {
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

  shortlistModule(categoryName: string) {
    let categoryId = this.categoryList.find(eachCategory => eachCategory.categoryName === categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    if(this.moduleList === undefined) {
      this.moduleList = []
      let module = {moduleName:this.moduleNotFound}
      this.moduleList.push(module)}
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
}
